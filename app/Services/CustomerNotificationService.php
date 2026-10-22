<?php

namespace App\Services;

use App\Helpers\CommonHelper;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatusList;
use App\Models\Setting;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Writes the retailer-facing order / payment / delivery-OTP events into the `notifications` table, so
 * they appear in the app's Notifications screen (GET customer/notifications) — until now these were
 * push-only and vanished once dismissed.
 *
 * Every public method is best-effort and never throws: a notification must never fail the order,
 * dispatch or payment that triggered it. Rows are written with the query builder (not the Notification
 * model) so they skip the activity log — one log row per card would be noise.
 *
 * The card text is stored already translated (in the customer's own language, not the language of
 * whoever triggered the event — e.g. the driver), and the same facts are also stored structured in
 * `data`, so the app can render the cards from either.
 */
class CustomerNotificationService
{
    public const CATEGORY_ORDERS   = 'orders';
    public const CATEGORY_PAYMENTS = 'payments';
    public const CATEGORY_OTP      = 'otp';

    /** Tabs the app can filter on (customer/notifications?category=). */
    public const CATEGORIES = [self::CATEGORY_ORDERS, self::CATEGORY_PAYMENTS, self::CATEGORY_OTP];

    /** event => category */
    private const EVENT_CATEGORY = [
        'order_placed'              => self::CATEGORY_ORDERS,
        'order_confirmed'           => self::CATEGORY_ORDERS,
        'out_for_delivery'          => self::CATEGORY_ORDERS,
        'order_delivered'           => self::CATEGORY_ORDERS,
        'order_partially_delivered' => self::CATEGORY_ORDERS,
        'order_not_delivered'       => self::CATEGORY_ORDERS,
        'order_rescheduled'         => self::CATEGORY_ORDERS,
        'order_cancelled'           => self::CATEGORY_ORDERS,
        'order_returned'            => self::CATEGORY_ORDERS,
        'payment_received'          => self::CATEGORY_PAYMENTS,
        'delivery_otp'              => self::CATEGORY_OTP,
    ];

    /** Payment methods a retailer is told about. Signature is an IOU (money still owed), not a payment. */
    private const PAYMENT_METHODS = ['cash', 'upi', 'cheque'];

    /** The order event for an order status id, or null when that status isn't something we notify about. */
    public static function eventForStatus(int $statusId): ?string
    {
        $map = [
            OrderStatusList::$processed       => 'order_confirmed',
            OrderStatusList::$outForDelivery  => 'out_for_delivery',
            OrderStatusList::$delivered       => 'order_delivered',
            OrderStatusList::$cancelled       => 'order_cancelled',
            OrderStatusList::$returned        => 'order_returned',
            OrderStatusList::$rescheduled     => 'order_rescheduled',
            OrderStatusList::$partialDelivery => 'order_partially_delivered',
            OrderStatusList::$notDelivered    => 'order_not_delivered',
        ];

        return $map[$statusId] ?? null;
    }

    /** A new order has been placed for the retailer — by themself, or by a salesman on their behalf. */
    public static function orderPlaced($order, ?string $salesmanName = null): void
    {
        self::safely(function () use ($order, $salesmanName) {
            $order = self::resolveOrder($order);
            if ($order) {
                self::record('order_placed', $order, ['placed_by' => $salesmanName !== null && trim($salesmanName) !== '' ? trim($salesmanName) : null]);
            }
        });
    }

    /**
     * The order moved to $statusId. Going Out For Delivery also records the delivery OTP card, when
     * this distributor uses delivery OTPs (the OTP is generated here if the order doesn't have one yet).
     */
    public static function orderStatusChanged($order, int $statusId): void
    {
        self::safely(function () use ($order, $statusId) {
            $event = self::eventForStatus($statusId);
            $order = $event ? self::resolveOrder($order) : null;
            if (!$order) {
                return;
            }

            if ($event === 'out_for_delivery') {
                // The OTP first, then the status card, so the status card sorts on top (newest id first).
                $otp = self::deliveryOtpFor($order);
                if ($otp !== null) {
                    self::record('delivery_otp', $order, ['otp' => $otp]);
                }
            }

            self::record($event, $order, []);
        });
    }

    /** A payment was recorded against the order (driver or salesman collection). */
    public static function paymentRecorded($order, $payment): void
    {
        self::safely(function () use ($order, $payment) {
            $method = strtolower((string) ($payment->method ?? ''));
            $amount = (float) ($payment->amount ?? 0);
            if (!in_array($method, self::PAYMENT_METHODS, true) || $amount <= 0) {
                return;
            }

            $order = self::resolveOrder($order);
            if ($order) {
                self::record('payment_received', $order, [
                    'amount'         => round($amount, 2),
                    'payment_method' => OrderPayment::appMethod($method),
                ]);
            }
        });
    }

    /**
     * The card facts for an order — distributor, invoice number, driver, order number, expected delivery date —
     * for the salesman / driver / distributor notification lists, which reuse the retailer's card structure.
     * Same keys as the retailer cards' `data` (otp / amount / payment_method / placed_by are null). Null when the
     * order doesn't exist (or was deleted).
     */
    public static function orderFacts($orderId): ?array
    {
        $order = $orderId ? Order::find($orderId) : null;

        return $order ? self::context($order, 'order_update', []) : null;
    }

    /**
     * The same card facts for the DISTRIBUTOR, DRIVER and SALESMAN apps. There the distributor is not useful — it is
     * their own distributor — so the `distributor` key is dropped and `retailer_name` (in the same place) says who the
     * order is for, as a plain string: shop name, else party name, else account name. Null for an order with no
     * customer (a POS walk-in sale). Only the retailer app keeps `distributor` ({ id, name }), from orderFacts().
     */
    public static function orderFactsForStaff($orderId): ?array
    {
        $order = $orderId ? Order::find($orderId) : null;
        if (!$order) {
            return null;
        }

        $retailerName = null;
        if (!empty($order->user_id)) {
            $profile = DB::table('retailer_profiles')->where('user_id', $order->user_id)->first(['shop_name', 'party_name']);
            $name    = trim((string) ($profile->shop_name ?? ''));
            if ($name === '') {
                $name = trim((string) ($profile->party_name ?? ''));
            }
            if ($name === '') {
                $name = trim((string) DB::table('users')->where('id', $order->user_id)->value('name'));
            }
            $retailerName = $name !== '' ? $name : null;
        }

        // Rebuilt so retailer_name takes the place `distributor` had in the card's data block.
        $facts = [];
        foreach (self::context($order, 'order_update', []) as $key => $value) {
            if ($key === 'distributor') {
                $facts['retailer_name'] = $retailerName;
            } else {
                $facts[$key] = $value;
            }
        }

        return $facts;
    }

    /**
     * Title + message for an event, in $locale. Pure — takes the already-built facts, touches no
     * database — so the wording can be checked without any data.
     *
     * @param  array  $facts  the `data` snapshot (see context())
     */
    public static function content(string $event, array $facts, string $locale): array
    {
        $previous = App::getLocale();
        App::setLocale($locale);

        try {
            // get_value() gives '' (not null) for a setting that isn't there.
            $currency = Setting::get_value('currency') ?: '₹';
            $amount   = isset($facts['amount']) ? (float) $facts['amount'] : 0.0;
            $replace  = [
                'order'       => (string) ($facts['order_number'] ?? ''),
                'invoice'     => (string) ($facts['invoice_number'] ?? ''),
                'distributor' => trim((string) ($facts['distributor']['name'] ?? '')) !== ''
                    ? trim((string) $facts['distributor']['name'])
                    : __('customer_notification_the_distributor'),
                'otp'         => (string) ($facts['otp'] ?? ''),
                'amount'      => $currency . (floor($amount) == $amount ? number_format($amount, 0) : number_format($amount, 2)),
                'salesman'    => (string) ($facts['placed_by'] ?? ''),
            ];

            $messageKey = 'customer_notification_' . $event . '_message';
            if ($event === 'order_placed' && !empty($facts['placed_by'])) {
                $messageKey = 'customer_notification_order_placed_by_salesman_message';
            } elseif ($event === 'payment_received') {
                $messageKey = $replace['invoice'] !== ''
                    ? 'customer_notification_payment_received_invoice_message'
                    : 'customer_notification_payment_received_order_message';
            }

            return [
                'title'   => __('customer_notification_' . $event . '_title'),
                'message' => __($messageKey, $replace),
            ];
        } finally {
            App::setLocale($previous);
        }
    }

    // ------------------------------------------------------------------------------------------

    private static function record(string $event, Order $order, array $extra): void
    {
        $userId = (int) $order->user_id;

        // The same status can be reported by more than one path in quick succession; payments are
        // exempt (two payments on one order a few seconds apart are both real).
        if ($event !== 'payment_received' && DB::table('notifications')
            ->where('type', 'user')->where('type_id', $userId)
            ->where('order_id', $order->id)->where('event', $event)
            ->where('date_sent', '>=', now()->subSeconds(60))
            ->exists()) {
            return;
        }

        $facts   = self::context($order, $event, $extra);
        $content = self::content($event, $facts, self::localeFor($userId));

        DB::table('notifications')->insert([
            'title'     => $content['title'],
            'message'   => $content['message'],
            'type'      => 'user',
            'type_id'   => $userId,
            'type_link' => '',
            'image'     => '',
            'date_sent' => now(),
            'category'  => self::EVENT_CATEGORY[$event],
            'event'     => $event,
            'order_id'  => $order->id,
            'data'      => json_encode($facts, JSON_UNESCAPED_UNICODE),
        ]);
    }

    /**
     * The structured facts behind a card. Every key is always present (null when it doesn't apply),
     * so the app can read it without checking which event it is.
     */
    private static function context(Order $order, string $event, array $extra): array
    {
        $sellerId = DB::table('order_items')->where('order_id', $order->id)->value('seller_id');
        $seller   = $sellerId ? DB::table('sellers')->where('id', $sellerId)->first(['id', 'name', 'store_name']) : null;
        $driver   = !empty($order->delivery_boy_id)
            ? DB::table('delivery_boys')->where('id', $order->delivery_boy_id)->first(['id', 'name', 'mobile', 'country_code'])
            : null;

        $storeName = $seller ? trim((string) ($seller->store_name ?? '')) : '';

        return [
            // The order's id — the number every app shows as "Order #…" — kept a string, as the apps already read it.
            'order_number'           => (string) $order->id,
            'invoice_number'         => $order->invoice_number ?: null,
            'distributor'            => $seller ? ['id' => (int) $seller->id, 'name' => $storeName !== '' ? $storeName : (string) $seller->name] : null,
            'driver'                 => $driver ? [
                'id'     => (int) $driver->id,
                'name'   => (string) $driver->name,
                'mobile' => CommonHelper::mobileWithCountryCode($driver->mobile, $driver->country_code),
            ] : null,
            // Only the OTP card carries the OTP — it must not leak onto the other cards.
            'otp'                    => $event === 'delivery_otp' ? (string) ($extra['otp'] ?? '') : null,
            'amount'                 => $extra['amount'] ?? null,
            'payment_method'         => $extra['payment_method'] ?? null,
            'expected_delivery_date' => !empty($order->delivery_date) ? substr((string) $order->delivery_date, 0, 10) : null,
            'placed_by'              => $extra['placed_by'] ?? null,
        ];
    }

    /** The OTP the driver will ask for, or null when this order's distributor has delivery OTPs switched off. */
    private static function deliveryOtpFor(Order $order): ?string
    {
        $sellerId = DB::table('order_items')->where('order_id', $order->id)->value('seller_id');
        $enabled  = $sellerId ? DB::table('sellers')->where('id', $sellerId)->value('delivery_otp_enabled') : 1;
        if ($enabled !== null && !(int) $enabled) {
            return null;
        }

        // Same lazy generation the order views use for orders that were placed without one.
        if (empty($order->otp)) {
            $otp = mt_rand(100000, 999999);
            DB::table('orders')->where('id', $order->id)->update(['otp' => $otp]);
            return (string) $otp;
        }

        return (string) $order->otp;
    }

    /** The customer's own language (from their app's device token), else the system default. */
    private static function localeFor(int $userId): string
    {
        $languages  = app(LanguageService::class);
        $languageId = DB::table('user_tokens')->where('user_id', $userId)->where('type', 'customer')
            ->whereNotNull('language_id')->value('language_id');

        $code = $languageId ? $languages->getLanguageCode((int) $languageId) : null;
        if (!$code) {
            $code = $languages->getLanguageCode(CommonHelper::getDefaultLanguageId());
        }

        return $code ?: 'en';
    }

    /** A fresh copy of the order, and only when it has a customer to notify (POS walk-in sales have none). */
    private static function resolveOrder($order): ?Order
    {
        $id    = is_object($order) ? ($order->id ?? null) : $order;
        $fresh = $id ? Order::find($id) : null;

        return ($fresh && !empty($fresh->user_id)) ? $fresh : null;
    }

    private static function safely(callable $work): void
    {
        try {
            $work();
        } catch (\Throwable $e) {
            try {
                Log::error('[CustomerNotification] ' . $e->getMessage());
            } catch (\Throwable $logError) {
                // A broken log channel must not turn into a failed order.
            }
        }
    }
}
