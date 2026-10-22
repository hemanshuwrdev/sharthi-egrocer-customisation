<?php

namespace App\Services;

use App\Helpers\CommonHelper;
use App\Models\PanelNotification;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

/**
 * The retailer app's Notifications list structure (customer/notifications) for the other apps — salesman,
 * driver and distributor — built from the notifications each of them ALREADY records, so no new events:
 *
 *   - driver + distributor (panel accounts): `panel_notifications`, served by GET get_top_notifications
 *   - salesman: `salesman_notifications`, served by GET salesman/notifications
 *
 * The apps get this structure from their existing URLs, with no extra parameter: the same card keys, filters
 * (category, unread, limit, offset, search), unread_count and mark_read request/response as the retailer app.
 * (The one thing that still gets the old get_top_notifications response is the web panel's bell — see
 * Controller::getTopNotifications.)
 */
class NotificationFeed
{
    /** What the apps may filter on: the retailer's tabs, plus `returns` (distributor return requests) and `general`. */
    public const CATEGORIES = ['orders', 'payments', 'otp', 'returns', 'general'];

    /**
     * Panel notifications store {type, order_id, text} in `data`. type => [category, event, title key].
     * Anything not listed is `general`.
     */
    private const PANEL_TYPES = [
        'new'                      => ['orders',  'new_order',              'panel_notification_new_order'],
        'new_order'                => ['orders',  'new_order',              'panel_notification_new_order'],
        'order_status_update'      => ['orders',  'order_status_update',    'panel_notification_order_update'],
        'order_item_status_update' => ['orders',  'item_status_update',     'panel_notification_item_update'],
        'return_request_new'       => ['returns', 'return_request_new',     'panel_notification_return_request'],
        'return_request_sent'      => ['returns', 'return_request_sent',    'panel_notification_return_request'],
        'return_request_status'    => ['returns', 'return_request_status',  'panel_notification_return_request_update'],
    ];

    /** For these types `data.order_id` actually holds an ORDER ITEM id, which has to be turned into the order id. */
    private const ITEM_TYPES = ['order_item_status_update', 'return_request_sent', 'return_request_status'];

    // ---- driver + distributor ---------------------------------------------------------------------------------

    /** GET get_top_notifications */
    public static function panelList(Request $request, $user)
    {
        self::applyRequestLanguage();
        [$limit, $offset] = self::paging($request);

        $query = PanelNotification::where('notifiable_id', $user->id);
        self::panelFilters($query, $request);

        $total = (clone $query)->count();
        $rows  = $query->orderBy('created_at', 'desc')->orderBy('id', 'desc')->skip($offset)->take($limit)->get();

        // data.order_id is an order item id for the item-level types: resolve those to order ids in one query.
        $itemIds = $rows->filter(fn ($r) => in_array($r->data['type'] ?? '', self::ITEM_TYPES, true))
            ->map(fn ($r) => $r->data['order_id'] ?? null)->filter()->unique()->values()->all();
        $itemOrder = $itemIds ? DB::table('order_items')->whereIn('id', $itemIds)->pluck('order_id', 'id') : collect();

        $facts = [];
        $cards = [];
        foreach ($rows as $row) {
            $payload = is_array($row->data) ? $row->data : [];
            $kind    = $payload['type'] ?? '';
            [$category, $event, $titleKey] = self::PANEL_TYPES[$kind] ?? ['general', $kind !== '' ? $kind : 'notification', 'panel_notification_general'];

            $orderId = isset($payload['order_id']) ? (int) $payload['order_id'] : null;
            if (in_array($kind, self::ITEM_TYPES, true)) {
                $orderId = $orderId !== null ? (isset($itemOrder[$orderId]) ? (int) $itemOrder[$orderId] : null) : null;
            }

            $cards[] = self::card([
                'id'         => $row->id,
                'title'      => __($titleKey),
                'message'    => (string) ($payload['text'] ?? ''),
                'type'       => self::panelRole($user),
                'type_id'    => (int) $user->id,
                'category'   => $category,
                'event'      => $event,
                'order_id'   => $orderId ?: null,
                'is_read'    => $row->read_at !== null,
                'created_at' => $row->created_at,
                // The distributor, driver and salesman apps get `retailer_name` instead of `distributor` (see orderFactsForStaff).
                'data'       => self::factsFor($orderId, $facts, true),
            ]);
        }

        return self::response($cards, $total, self::panelUnread($user));
    }

    /** POST notification_mark_read — body: ids[] | all=1 [, category] */
    public static function panelMarkRead(Request $request, $user)
    {
        $input = self::markReadInput($request, 'string|max:64');
        if (is_string($input)) {
            return CommonHelper::responseError($input);
        }
        [$ids, $category] = $input;

        $query = PanelNotification::where('notifiable_id', $user->id)->whereNull('read_at');
        if ($ids) {
            $query->whereIn('id', $ids);
        } elseif ($category) {
            self::panelCategory($query, $category);
        }
        $marked = $query->update(['read_at' => now()]);

        return CommonHelper::responseWithData(['marked' => (int) $marked, 'unread_count' => self::panelUnread($user)]);
    }

    private static function panelFilters($query, Request $request): void
    {
        if (in_array($request->category, self::CATEGORIES, true)) {
            self::panelCategory($query, $request->category);
        }
        if (filter_var($request->unread, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereNull('read_at');
        }
        if ($request->filled('search')) {
            $query->where('data', 'like', '%' . $request->search . '%');
        }
    }

    /** `data` is JSON text (json_encode, no spaces), so a category is a set of `"type":"…"` matches. */
    private static function panelCategory($query, string $category): void
    {
        if ($category === 'general') {
            foreach (array_keys(self::PANEL_TYPES) as $kind) {
                $query->where('data', 'not like', '%"type":"' . $kind . '"%');
            }
            return;
        }

        $kinds = array_keys(array_filter(self::PANEL_TYPES, fn ($meta) => $meta[0] === $category));
        if (!$kinds) {
            $query->whereRaw('1 = 0');   // payments / otp: these apps have no such notifications
            return;
        }
        $query->where(function ($q) use ($kinds) {
            foreach ($kinds as $kind) {
                $q->orWhere('data', 'like', '%"type":"' . $kind . '"%');
            }
        });
    }

    private static function panelUnread($user): int
    {
        return (int) PanelNotification::where('notifiable_id', $user->id)->whereNull('read_at')->count();
    }

    private static function panelRole($user): string
    {
        $role = (int) ($user->role_id ?? 0);

        return $role === Role::$roleSeller ? 'seller' : ($role === Role::$roleDeliveryBoy ? 'delivery_boy' : 'admin');
    }

    // ---- salesman -------------------------------------------------------------------------------------------

    /** GET salesman/notifications */
    public static function salesmanList(Request $request, $salesman)
    {
        self::applyRequestLanguage();
        [$limit, $offset] = self::paging($request);

        $query = DB::table('salesman_notifications')->where('salesman_id', $salesman->id);
        if (in_array($request->category, self::CATEGORIES, true)) {
            self::salesmanCategory($query, $request->category);
        }
        if (filter_var($request->unread, FILTER_VALIDATE_BOOLEAN)) {
            $query->whereNull('read_at');
        }
        if ($request->filled('search')) {
            $like = '%' . $request->search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('title', 'like', $like)->orWhere('message', 'like', $like);
            });
        }

        $total = (clone $query)->count();
        $rows  = $query->orderBy('created_at', 'desc')->orderBy('id', 'desc')->skip($offset)->take($limit)->get();

        $facts = [];
        $cards = [];
        foreach ($rows as $row) {
            $orderId = $row->order_id ? (int) $row->order_id : null;
            $cards[] = self::card([
                'id'         => (int) $row->id,
                'title'      => (string) $row->title,
                'message'    => (string) $row->message,
                'type'       => 'salesman',
                'type_id'    => (int) $salesman->id,
                // A notification about an order is an Orders card; the rest (e.g. an address-change request) is general.
                'category'   => $orderId ? 'orders' : 'general',
                'event'      => (string) ($row->type ?: 'general'),
                'order_id'   => $orderId,
                'is_read'    => $row->read_at !== null,
                'created_at' => $row->created_at,
                // Same facts as the distributor and driver apps: `retailer_name`, no `distributor`.
                'data'       => self::factsFor($orderId, $facts, true),
            ]);
        }

        return self::response($cards, $total, self::salesmanUnread($salesman));
    }

    /** POST salesman/notifications/mark_read — body: ids[] | all=1 [, category] */
    public static function salesmanMarkRead(Request $request, $salesman)
    {
        $input = self::markReadInput($request, 'integer');
        if (is_string($input)) {
            return CommonHelper::responseError($input);
        }
        [$ids, $category] = $input;

        $query = DB::table('salesman_notifications')->where('salesman_id', $salesman->id)->whereNull('read_at');
        if ($ids) {
            $query->whereIn('id', array_map('intval', $ids));
        } elseif ($category) {
            self::salesmanCategory($query, $category);
        }
        $marked = $query->update(['read_at' => now()]);

        return CommonHelper::responseWithData(['marked' => (int) $marked, 'unread_count' => self::salesmanUnread($salesman)]);
    }

    private static function salesmanCategory($query, string $category): void
    {
        if ($category === 'orders') {
            $query->whereNotNull('order_id');
        } elseif ($category === 'general') {
            $query->whereNull('order_id');
        } else {
            $query->whereRaw('1 = 0');   // payments / otp / returns: the salesman app has none of these
        }
    }

    private static function salesmanUnread($salesman): int
    {
        return (int) DB::table('salesman_notifications')->where('salesman_id', $salesman->id)->whereNull('read_at')->count();
    }

    // ---- shared ---------------------------------------------------------------------------------------------

    /** One card, with exactly the keys (and key order) of a customer/notifications row. */
    private static function card(array $f): array
    {
        return [
            'id'            => $f['id'],
            'title'         => $f['title'],
            'message'       => $f['message'],
            'type'          => $f['type'],
            'type_id'       => $f['type_id'],
            'image_url'     => '',
            'link_url'      => '',
            'date_sent'     => CommonHelper::formatDateTime($f['created_at']),
            'category'      => $f['category'],
            'event'         => $f['event'],
            'order_id'      => $f['order_id'],
            'is_read'       => $f['is_read'],
            'date_sent_iso' => $f['created_at'] ? Carbon::parse($f['created_at'])->toIso8601String() : null,
            'data'          => $f['data'],
        ];
    }

    /** The order's card facts, looked up once per order per request. Null when there's no (live) order. */
    private static function factsFor(?int $orderId, array &$cache, bool $forStaff = false): ?array
    {
        if (!$orderId) {
            return null;
        }
        if (!array_key_exists($orderId, $cache)) {
            $cache[$orderId] = $forStaff
                ? CustomerNotificationService::orderFactsForStaff($orderId)
                : CustomerNotificationService::orderFacts($orderId);
        }

        return $cache[$orderId];
    }

    /** Same envelope as customer/notifications: { status, message, total, unread_count, data }. */
    private static function response(array $cards, int $total, int $unread)
    {
        $payload = CommonHelper::responseWithData($cards, $total)->getData(true);
        $payload['unread_count'] = $unread;

        return response()->json($payload);
    }

    private static function paging(Request $request): array
    {
        $limit = (int) ($request->limit ?: 10);

        return [max(1, min($limit, 100)), max(0, (int) $request->offset)];
    }

    /**
     * Validate a mark_read body. Returns [ids[], category|null], or an error message string.
     * Needs ids[] or all=1; `all` may be narrowed by `category`.
     */
    private static function markReadInput(Request $request, string $idRule)
    {
        $validator = Validator::make($request->all(), [
            'ids'      => 'nullable|array|max:200',
            'ids.*'    => $idRule,
            'all'      => 'nullable|boolean',
            'category' => 'nullable|in:' . implode(',', self::CATEGORIES),
        ]);
        if ($validator->fails()) {
            return $validator->errors()->first();
        }

        $ids = array_values(array_filter((array) $request->input('ids', []), fn ($id) => $id !== null && $id !== ''));
        $all = filter_var($request->input('all'), FILTER_VALIDATE_BOOLEAN);
        if (empty($ids) && !$all) {
            return 'Send ids[] or all=1.';
        }

        return [$ids, $request->filled('category') ? $request->category : null];
    }

    /** Card titles follow the app's Content-Language, the same way the response helpers do. */
    private static function applyRequestLanguage(): void
    {
        $code = strtolower(trim((string) request()->header('Content-Language')));
        if ($code !== '' && (File::exists(resource_path('lang/' . $code . '.json')) || File::isDirectory(resource_path('lang/' . $code)))) {
            App::setLocale($code);
        }
    }
}
