<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\CreditNote;
use App\Models\CreditNoteItem;
use App\Models\DeliveryBoy;
use App\Models\DriverSettlement;
use App\Models\LoadingSlip;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\ReturnRequest;
use App\Models\ReturnStatusList;
use App\Models\Salesman;
use App\Models\SalesmanSettlement;
use App\Models\Seller;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SettlementController extends Controller
{
    private const METHODS = ['cash', 'upi', 'cheque', 'signature'];
    // How long a verified sensitive-operations password stays "unlocked" server-side.
    // Generous window for a single page visit; the frontend re-prompts on every fresh
    // visit to the reconciliation page regardless, this only bounds direct API misuse.
    private const SENSITIVE_UNLOCK_MINUTES = 120;
    private const STATUS_TEXT_MAP = [
        'open'              => 'Open',
        'locked'            => 'Locked',
        'reconciled'        => 'Reconciled',
        'needs_rereconcile' => 'Needs Re-Reconcile',
    ];

    // ──────────────────────────────────────────────────────────────────────────
    //  Shared helpers
    // ──────────────────────────────────────────────────────────────────────────

    /** Resolve the DeliveryBoy row for the authenticated admin (driver login). */
    private function currentDriver(): ?DeliveryBoy
    {
        $admin = auth()->user();
        if (!$admin) return null;
        return DeliveryBoy::where('admin_id', $admin->id)->first();
    }

    /** Resolve the Seller row for the authenticated admin (distributor login). */
    private function currentSeller(): ?Seller
    {
        $admin = auth()->user();
        if (!$admin) return null;
        return Seller::where('admin_id', $admin->id)->first();
    }

    /**
     * Methods enabled at admin level (reads settings table).
     * Returns array of method keys that are enabled.
     */
    private function adminEnabledMethods(): array
    {
        $settings = Setting::whereIn('variable', array_map(fn ($m) => 'payment_method_' . $m, self::METHODS))
            ->pluck('value', 'variable');

        return array_filter(self::METHODS, fn ($m) => (int) ($settings['payment_method_' . $m] ?? 0) === 1);
    }

    /**
     * Methods a specific seller has enabled (from sellers table columns).
     * Only returns methods that are also admin-enabled.
     */
    protected function sellerEnabledMethods(Seller $seller): array
    {
        $adminEnabled = $this->adminEnabledMethods();
        return array_filter($adminEnabled, fn ($m) => (int) ($seller->{'payment_method_' . $m} ?? 0) === 1);
    }

    /**
     * Cheap "needs_rereconcile" detection for the trips LIST (not the full legacy-close
     * upgrade logic sellerTripDetailUpdated() does, which needs per-order/loading-slip
     * queries that don't scale to a paginated list). A trip flips to needs_rereconcile
     * when it was reconciled but a payment landed after that close.
     */
    private function effectiveTripStatus($settlement, ?string $lastPaymentAt): string
    {
        $status = $settlement->status ?? 'open';
        if ($status === 'reconciled' && $settlement->reconciled_at && $lastPaymentAt) {
            $reconciledAt = Carbon::parse($settlement->reconciled_at);
            if (Carbon::parse($lastPaymentAt)->gt($reconciledAt)) {
                return 'needs_rereconcile';
            }
        }
        return $status;
    }

    /**
     * Payments belonging to one driver settlement row (one trip). When the row is
     * tied to a loading slip, only that slip's orders count — this is what keeps
     * two same-day trips from being reconciled/closed as one merged blob. Rows
     * without a slip (legacy/slip-less payments) fall back to the old same-day grouping.
     */
    private function paymentsForDriverSettlement(DriverSettlement $ds)
    {
        $query = OrderPayment::where('delivery_boy_id', $ds->delivery_boy_id);

        if ($ds->loading_slip_id) {
            $query->whereIn('order_id', Order::where('loading_slip_id', $ds->loading_slip_id)->pluck('id'));
        } else {
            $date = $ds->settlement_date instanceof Carbon
                ? $ds->settlement_date->toDateString()
                : (string) $ds->settlement_date;
            $query->whereDate('created_at', $date)
                  ->whereIn('order_id', function ($q) {
                      $q->select('id')->from('orders')->whereNull('loading_slip_id');
                  });
        }

        return $query->get();
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Admin endpoints
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /admin/payment_methods
     * Returns all 4 methods with admin-level is_enabled.
     */
    public function adminGetPaymentMethods()
    {
        $settings = Setting::whereIn('variable', array_map(fn ($m) => 'payment_method_' . $m, self::METHODS))
            ->pluck('value', 'variable');

        $data = array_map(fn ($m) => [
            'method'     => $m,
            'is_enabled' => (int) ($settings['payment_method_' . $m] ?? 0) === 1,
        ], self::METHODS);

        return CommonHelper::responseWithData(['methods' => array_values($data)]);
    }

    /**
     * POST /admin/payment_methods/save
     * Body: { cash: 0|1, upi: 0|1, cheque: 0|1, signature: 0|1 }
     */
    public function adminSavePaymentMethods(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cash'      => 'required|in:0,1',
            'upi'       => 'required|in:0,1',
            'cheque'    => 'required|in:0,1',
            'signature' => 'required|in:0,1',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        foreach (self::METHODS as $method) {
            Setting::updateOrCreate(
                ['variable' => 'payment_method_' . $method],
                ['value'    => $request->input($method, 0)]
            );
        }

        return CommonHelper::responseSuccess('payment_methods_saved');
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Distributor endpoints
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /seller/payment_methods
     * Returns 4 methods. If admin disabled a method:
     *   - is_enabled = false, is_editable = false (distributor sees it but cannot turn it on)
     * If admin enabled a method:
     *   - is_enabled = seller's own flag, is_editable = true
     */
    public function sellerGetPaymentMethods()
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $adminEnabled = array_values($this->adminEnabledMethods());

        $data = array_map(function ($m) use ($seller, $adminEnabled) {
            $adminOn = in_array($m, $adminEnabled, true);
            $row = [
                'method'      => $m,
                'is_enabled'  => $adminOn && (int) ($seller->{'payment_method_' . $m} ?? 0) === 1,
                'is_editable' => $adminOn, // false = admin disabled, shown greyed-out
            ];
            if ($m === 'cash') {
                $row['discount_percent'] = (float) ($seller->cash_discount_percent ?? 0);
            }
            return $row;
        }, self::METHODS);

        return CommonHelper::responseWithData(['methods' => array_values($data)]);
    }

    /**
     * POST /seller/payment_methods/save
     * Body: { cash: 0|1, upi: 0|1, cheque: 0|1, signature: 0|1, cash_discount_percent?: 0-100 }
     * Silently ignores values for methods admin has disabled.
     */
    public function sellerSavePaymentMethods(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $validator = Validator::make($request->all(), [
            'cash'                  => 'required|in:0,1',
            'upi'                   => 'required|in:0,1',
            'cheque'                => 'required|in:0,1',
            'signature'             => 'required|in:0,1',
            'cash_discount_percent' => 'nullable|numeric|min:0|max:100',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $adminEnabled = $this->adminEnabledMethods();

        foreach (self::METHODS as $method) {
            // If admin has this method disabled, force it off regardless of request
            $value = in_array($method, $adminEnabled, true) ? (int) $request->input($method, 0) : 0;
            $seller->{'payment_method_' . $method} = $value;
        }
        $seller->cash_discount_percent = $request->filled('cash_discount_percent') ? $request->cash_discount_percent : 0;
        $seller->save();

        return CommonHelper::responseSuccess('payment_methods_saved');
    }

    /**
     * GET /seller/payments/pending
     * All unverified payment collections across this distributor's drivers.
     * Optional query: date (Y-m-d), delivery_boy_id
     */
    public function sellerPendingPayments(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $query = OrderPayment::with(['order:id,orders_id,final_total', 'deliveryBoy:id,name,mobile'])
            ->whereHas('deliveryBoy', fn ($q) => $q->where('seller_id', $seller->id))
            ->where('status', 'pending')
            ->orderByDesc('created_at');

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->input('date'));
        }
        if ($request->filled('delivery_boy_id')) {
            $query->where('delivery_boy_id', $request->input('delivery_boy_id'));
        }

        $rows = $query->get();

        return CommonHelper::responseWithData(['total' => $rows->count(), 'data' => $rows]);
    }

    /**
     * POST /seller/payments/verify
     * Body: { payment_id: int }
     * Marks a single payment as verified. Once ALL payments for a driver's today orders
     * are verified, the driver's EOD lock becomes available.
     */
    public function sellerVerifyPayment(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $validator = Validator::make($request->all(), [
            'payment_id' => 'required|integer|exists:order_payments,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $payment = OrderPayment::where(function ($q) use ($seller) {
                $q->whereHas('deliveryBoy', fn ($qq) => $qq->where('seller_id', $seller->id))
                  ->orWhereHas('salesman', fn ($qq) => $qq->where('seller_id', $seller->id));
            })
            ->find($request->payment_id);

        if (!$payment) {
            return CommonHelper::responseError('payment_not_found');
        }
        if ($payment->status === 'verified') {
            return CommonHelper::responseError('already_verified');
        }
        if ($payment->method === 'cheque' && (empty($payment->cheque_date) || empty($payment->cheque_number))) {
            return CommonHelper::responseError('cheque_date_and_number_required_before_verification');
        }

        $payment->status      = 'verified';
        $payment->verified_by = auth()->id();
        $payment->verified_at = Carbon::now();
        $payment->save();

        // Auto-reconcile: if trip has zero cash expected after this verification, mark full_match
        $order = Order::find($payment->order_id);
        if ($order && $order->loading_slip_id) {
            $slip = LoadingSlip::find($order->loading_slip_id);
            if ($slip && $slip->reconciliation_status !== 'full_match') {
                $orderIds        = Order::where('loading_slip_id', $slip->id)
                                        ->where('active_status', '!=', \App\Models\OrderStatusList::$notDelivered)
                                        ->pluck('id');
                $totalExpected   = round(Order::whereIn('id', $orderIds)->sum('final_total'), 2);
                $digitalVerified = round(
                    OrderPayment::whereIn('order_id', $orderIds)
                        ->whereIn('method', ['upi', 'cheque', 'signature'])
                        ->where('status', 'verified')
                        ->sum('amount'),
                    2
                );
                $cashExpected = round($totalExpected - $digitalVerified, 2);
                if ($cashExpected <= 0) {
                    $slip->cash_received         = 0;
                    $slip->reconciliation_status = 'full_match';
                    $slip->save();
                }
            }
        }

        return CommonHelper::responseSuccess('payment_verified');
    }

    /**
     * POST /seller/payments/received
     * Body: payment_id, received_amount — records the office-verified actual amount
     * for this payment (distinct from `amount`, the driver/salesman's self-reported
     * figure), driving the per-order shortfall shown on the reconciliation screen.
     */
    public function sellerUpdatePaymentReceived(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $validator = Validator::make($request->all(), [
            'payment_id'      => 'required|integer|exists:order_payments,id',
            'received_amount' => 'required|numeric|min:0',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $payment = OrderPayment::where(function ($q) use ($seller) {
                $q->whereHas('deliveryBoy', fn ($qq) => $qq->where('seller_id', $seller->id))
                  ->orWhereHas('salesman', fn ($qq) => $qq->where('seller_id', $seller->id));
            })
            ->find($request->payment_id);

        if (!$payment) {
            return CommonHelper::responseError('payment_not_found');
        }

        // Once the trip this payment belongs to is reconciled/closed, the figures used to
        // close it must stay frozen — mirrors the `isClosed` gate on the reconciliation screen.
        $date       = Carbon::parse($payment->created_at)->toDateString();
        $settlement = $payment->delivery_boy_id
            ? DriverSettlement::where('delivery_boy_id', $payment->delivery_boy_id)->whereDate('settlement_date', $date)->first()
            : SalesmanSettlement::where('salesman_id', $payment->salesman_id)->whereDate('settlement_date', $date)->first();

        if ($settlement && $settlement->status === 'reconciled') {
            return CommonHelper::responseError('trip_already_closed');
        }

        $payment->received_amount = $request->received_amount;
        $payment->save();

        return CommonHelper::responseSuccess('received_amount_saved');
    }

    /**
     * POST /seller/sensitive/verify
     * Body: password — checks the distributor's sensitive-operations password (set
     * on the Settings page) and, on success, marks it "unlocked" for a limited window
     * so sensitive edit endpoints below don't need the password resent on every call.
     */
    public function sellerVerifySensitivePassword(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        if (empty($seller->sensitive_password)) {
            return CommonHelper::responseError('sensitive_password_not_set');
        }

        $validator = Validator::make($request->all(), ['password' => 'required|string']);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if (!Hash::check($request->password, $seller->sensitive_password)) {
            return CommonHelper::responseError('incorrect_password');
        }

        $seller->sensitive_unlocked_at = Carbon::now();
        $seller->save();

        return CommonHelper::responseSuccess('unlocked');
    }

    /**
     * POST /seller/payments/update-method
     * Body: payment_id, method — corrects a driver/salesman's mis-recorded payment
     * method. Gated behind a recent sellerVerifySensitivePassword() call rather than
     * the trip-closed freeze used for Received, since the mistake this exists to fix
     * is usually only noticed while reviewing an already-closed trip.
     */
    public function sellerUpdatePaymentMethod(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $unlockedRecently = $seller->sensitive_unlocked_at
            && Carbon::parse($seller->sensitive_unlocked_at)->gt(Carbon::now()->subMinutes(self::SENSITIVE_UNLOCK_MINUTES));
        if (!$unlockedRecently) {
            return CommonHelper::responseError('sensitive_unlock_required');
        }

        $validator = Validator::make($request->all(), [
            'payment_id'    => 'required|integer|exists:order_payments,id',
            'method'        => 'required|string|in:' . implode(',', self::METHODS),
            'cheque_date'   => 'required_if:method,cheque|nullable|date',
            'cheque_number' => 'required_if:method,cheque|nullable|digits_between:1,30',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $payment = OrderPayment::where(function ($q) use ($seller) {
                $q->whereHas('deliveryBoy', fn ($qq) => $qq->where('seller_id', $seller->id))
                  ->orWhereHas('salesman', fn ($qq) => $qq->where('seller_id', $seller->id));
            })
            ->find($request->payment_id);

        if (!$payment) {
            return CommonHelper::responseError('payment_not_found');
        }

        $payment->method = $request->method;
        if ($request->method === 'cheque') {
            $payment->cheque_date   = $request->cheque_date;
            $payment->cheque_number = $request->cheque_number;
        } else {
            // No longer a cheque — don't leave stale cheque details attached.
            $payment->cheque_date   = null;
            $payment->cheque_number = null;
        }
        $payment->save();

        return CommonHelper::responseSuccess('method_updated');
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Driver endpoints
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /delivery_boy/payment_methods
     * Returns only methods enabled by BOTH admin AND driver's distributor.
     * Includes what proof is required per method.
     */
    public function driverPaymentMethods()
    {
        $driver = $this->currentDriver();
        if (!$driver) {
            return CommonHelper::responseError('driver_not_found');
        }

        $seller = $driver->seller_id ? Seller::find($driver->seller_id) : null;
        if (!$seller) {
            return CommonHelper::responseError('driver_not_linked_to_distributor');
        }

        $enabled = array_values($this->sellerEnabledMethods($seller));

        $meta = [
            'cash'      => ['requires_amount' => true, 'requires_photo' => false, 'photo_label' => null, 'discount_percent' => (float) ($seller->cash_discount_percent ?? 0)],
            'upi'       => ['requires_amount' => true, 'requires_photo' => true,  'photo_label' => 'UPI screenshot'],
            'cheque'    => ['requires_amount' => true, 'requires_photo' => true,  'photo_label' => 'Cheque photo'],
            'signature' => ['requires_amount' => true, 'requires_photo' => true,  'photo_label' => 'Customer signature'],
        ];

        $data = array_map(fn ($m) => array_merge(['method' => $m], $meta[$m]), $enabled);

        return CommonHelper::responseWithData(['methods' => array_values($data)]);
    }

    /**
     * POST /delivery_boy/collect_payment
     * Body: order_id, method, amount (cash/upi), proof_photo (upi/cheque/signature)
     */
    public function collectPayment(Request $request)
    {
        $driver = $this->currentDriver();
        if (!$driver) {
            return CommonHelper::responseError('driver_not_found');
        }

        $seller = $driver->seller_id ? Seller::find($driver->seller_id) : null;
        if (!$seller) {
            return CommonHelper::responseError('driver_not_linked_to_distributor');
        }

        $validator = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id',
            'method'   => 'required|in:cash,upi,cheque,signature',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Validate method is enabled for this driver's distributor
        $enabledMethods = array_values($this->sellerEnabledMethods($seller));
        if (!in_array($request->method, $enabledMethods, true)) {
            return CommonHelper::responseError('payment_method_not_allowed');
        }

        // Method-specific field validation — all methods require amount
        $method = $request->method;
        if (!$request->filled('amount')) {
            return CommonHelper::responseError('amount_required_for_' . $method);
        }
        if (in_array($method, ['upi', 'cheque', 'signature'], true) && !$request->hasFile('proof_photo') && !$request->filled('proof_photo')) {
            return CommonHelper::responseError('proof_photo_required_for_' . $method);
        }

        // Verify this order belongs to this driver
        $order = Order::where('id', $request->order_id)
            ->where('delivery_boy_id', $driver->id)
            ->first();
        if (!$order) {
            return CommonHelper::responseError('order_not_assigned_to_you');
        }

        // Prevent same method being submitted twice for the same order (split cash+UPI is allowed)
        if (OrderPayment::where('order_id', $order->id)->where('method', $method)->exists()) {
            return CommonHelper::responseError('payment_method_already_collected_for_this_order');
        }

        // Cash-vs-other-methods incentive: applied once, at the point cash is actually
        // collected — order.final_total was fixed at placement without knowing which
        // collection method the customer would pick, so the discount books here instead.
        $cashDiscountAmount = 0;
        if ($method === 'cash' && (float) ($order->cash_discount_amount ?? 0) === 0.0) {
            $cashDiscountPercent = (float) ($seller->cash_discount_percent ?? 0);
            if ($cashDiscountPercent > 0) {
                $alreadyCollected = (float) OrderPayment::where('order_id', $order->id)->sum('amount');
                $outstanding = max(0, (float) $order->final_total - $alreadyCollected);
                $cashDiscountAmount = round($outstanding * ($cashDiscountPercent / 100), 2);
                if ($cashDiscountAmount > 0) {
                    $order->final_total = max(0, (float) $order->final_total - $cashDiscountAmount);
                    if ($order->remaining_final !== null) {
                        $order->remaining_final = max(0, (float) $order->remaining_final - $cashDiscountAmount);
                    }
                    $order->cash_discount_amount = $cashDiscountAmount;
                    $order->save();
                }
            }
        }

        // Handle proof photo upload
        $proofPath = null;
        if ($request->hasFile('proof_photo')) {
            $file      = $request->file('proof_photo');
            $fileName  = time() . '_' . $order->id . '.' . $file->getClientOriginalExtension();
            $proofPath = Storage::disk('public')->putFileAs('payment_proofs', $file, $fileName);
        } elseif ($request->filled('proof_photo')) {
            $proofPath = (string) $request->proof_photo;
        }

        try {
            $payment = OrderPayment::create([
                'order_id'        => $order->id,
                'delivery_boy_id' => $driver->id,
                'method'          => $method,
                'amount'          => (float) $request->amount,
                'proof_photo'     => $proofPath,
                'status'          => 'pending',
            ]);

            // Auto-create settlement row so distributor sees this trip immediately
            $today = Carbon::today();
            DriverSettlement::firstOrCreate(
                ['delivery_boy_id' => $driver->id, 'settlement_date' => $today->toDateString()],
                [
                    'seller_id'    => $seller->id,
                    'total_orders' => 0,
                    'total_cash'   => 0,
                    'total_upi'    => 0,
                    'total_cheque' => 0,
                    'total_signature' => 0,
                    'status'       => 'open',
                ]
            );
        } catch (\Throwable $e) {
            Log::error('collectPayment failed: ' . $e->getMessage());
            return CommonHelper::responseError('something_went_wrong');
        }

        return CommonHelper::responseWithData([
            'payment_id'           => $payment->id,
            'status'               => 'pending',
            'cash_discount_amount' => $cashDiscountAmount,
            'order_final_total'    => (float) $order->final_total,
            'message'              => 'payment_collected_pending_verification',
        ]);
    }

    /**
     * GET /delivery_boy/settlement/today
     * Summary of today's collections + whether EOD lock is available.
     * EOD lock is available only when ALL today's order payments are verified.
     */
    public function todaySummary()
    {
        $driver = $this->currentDriver();
        if (!$driver) {
            return CommonHelper::responseError('driver_not_found');
        }

        $today    = Carbon::today();
        $payments = OrderPayment::where('delivery_boy_id', $driver->id)
            ->whereDate('created_at', $today)
            ->get();

        $pendingCount = $payments->where('status', 'pending')->count();
        $canLockEod   = $payments->isNotEmpty() && $pendingCount === 0;

        $summary = [
            'total_orders'    => $payments->count(),
            'total_cash'      => round($payments->where('method', 'cash')->sum('amount'), 2),
            'total_upi'       => round($payments->where('method', 'upi')->sum('amount'), 2),
            'total_cheque'    => round($payments->where('method', 'cheque')->sum('amount'), 2),
            'total_signature' => round($payments->where('method', 'signature')->sum('amount'), 2),
            'pending_count'   => $pendingCount,
            'can_lock_eod'    => $canLockEod,
            'eod_lock_reason' => $canLockEod ? null : ($payments->isEmpty() ? 'no_collections_today' : 'distributor_verification_pending'),
        ];

        // Check if already locked today
        $settlement = DriverSettlement::where('delivery_boy_id', $driver->id)
            ->where('settlement_date', $today->toDateString())
            ->first();

        return CommonHelper::responseWithData([
            'date'       => $today->toDateString(),
            'summary'    => $summary,
            'eod_status' => $settlement ? $settlement->status : 'not_submitted',
        ]);
    }

    /**
     * POST /delivery_boy/settlement/lock_eod
     * Locks today's EOD. Only allowed when all today's payments are verified by distributor.
     */
    public function lockEod()
    {
        $driver = $this->currentDriver();
        if (!$driver) {
            return CommonHelper::responseError('driver_not_found');
        }

        $today    = Carbon::today();
        $payments = OrderPayment::where('delivery_boy_id', $driver->id)
            ->whereDate('created_at', $today)
            ->get();

        if ($payments->isEmpty()) {
            return CommonHelper::responseError('no_collections_today');
        }

        $pendingCount = $payments->where('status', 'pending')->count();
        if ($pendingCount > 0) {
            return CommonHelper::responseError('distributor_verification_pending');
        }

        // Prevent double lock
        $existing = DriverSettlement::where('delivery_boy_id', $driver->id)
            ->where('settlement_date', $today->toDateString())
            ->first();

        if ($existing && $existing->status === 'locked') {
            return CommonHelper::responseError('eod_already_locked');
        }

        $sellerId = (int) $driver->seller_id;

        $settlement = DriverSettlement::updateOrCreate(
            ['delivery_boy_id' => $driver->id, 'settlement_date' => $today->toDateString()],
            [
                'seller_id'       => $sellerId,
                'total_orders'    => $payments->count(),
                'total_cash'      => round($payments->where('method', 'cash')->sum('amount'), 2),
                'total_upi'       => round($payments->where('method', 'upi')->sum('amount'), 2),
                'total_cheque'    => round($payments->where('method', 'cheque')->sum('amount'), 2),
                'total_signature' => round($payments->where('method', 'signature')->sum('amount'), 2),
                'status'          => 'locked',
                'locked_at'       => Carbon::now(),
            ]
        );

        return CommonHelper::responseWithData([
            'settlement_id'   => $settlement->id,
            'settlement_date' => $today->toDateString(),
            'status'          => 'locked',
        ]);
    }

    /**
     * GET /delivery_boy/loading_slips/active
     * Loading-slip-wise replacement for the whole-day EOD lock: lists this driver's
     * active slips (not yet Completed/Cancelled) with a per-slip lock readiness flag.
     * A slip can be locked only once every order in it has finished its delivery
     * attempt AND every OrderPayment for it has been manually verified by the
     * distributor (no auto-verification — cash included).
     */
    public function driverActiveLoadingSlips(Request $request)
    {
        $driver = $this->currentDriver();
        if (!$driver) {
            return CommonHelper::responseError('driver_not_found');
        }

        $terminalDeliveryStatuses = [
            \App\Models\OrderStatusList::$delivered,
            \App\Models\OrderStatusList::$partialDelivery,
            \App\Models\OrderStatusList::$notDelivered,
            \App\Models\OrderStatusList::$cancelled,
            \App\Models\OrderStatusList::$returned,
        ];

        $slips = LoadingSlip::where('driver_id', $driver->id)
            ->whereIn('status', [0, 1]) // Created, Dispatched — not yet Completed/Cancelled
            ->when($request->filled('search'), fn ($q) => $q->where('slip_no', 'like', '%' . $request->input('search') . '%'))
            ->orderByDesc('id')
            ->get();

        $data = $slips->map(function (LoadingSlip $slip) use ($terminalDeliveryStatuses) {
            $orders       = Order::where('loading_slip_id', $slip->id)->get();
            $orderIds     = $orders->pluck('id');
            $payments     = OrderPayment::whereIn('order_id', $orderIds)->get();

            $undeliveredCount = $orders->whereNotIn('active_status', $terminalDeliveryStatuses)->count();
            $pendingPayments  = $payments->where('status', 'pending')->count();
            $alreadyLocked    = $slip->payment_lock_status === 'locked';

            $canLock  = !$alreadyLocked && $orders->isNotEmpty() && $undeliveredCount === 0 && $pendingPayments === 0;
            $reason   = null;
            if (!$canLock && !$alreadyLocked) {
                $reason = $orders->isEmpty()
                    ? 'no_orders_in_slip'
                    : ($undeliveredCount > 0 ? 'orders_pending_delivery' : 'payment_verification_pending');
            }

            return [
                'id'                 => $slip->id,
                'slip_no'            => $slip->slip_no,
                'status'             => $slip->status,
                'status_text'        => $slip->status_text,
                'total_orders'       => $orders->count(),
                'undelivered_count'  => $undeliveredCount,
                'pending_payments'   => $pendingPayments,
                'payment_lock_status'=> $slip->payment_lock_status,
                'payment_locked_at'  => $slip->payment_locked_at,
                'can_lock'           => $canLock,
                'lock_blocked_reason'=> $reason,
                'total_collected'    => round($payments->sum('amount'), 2),
                // Per-method breakdown so the driver can see what's collected/verified
                // vs. still pending, per payment method — same shape as settlement/today.
                'payment_methods'    => [
                    'cash'      => round($payments->where('method', 'cash')->sum('amount'), 2),
                    'upi'       => round($payments->where('method', 'upi')->sum('amount'), 2),
                    'cheque'    => round($payments->where('method', 'cheque')->sum('amount'), 2),
                    'signature' => round($payments->where('method', 'signature')->sum('amount'), 2),
                ],
                'payments' => $payments->map(fn (OrderPayment $p) => [
                    'id'         => $p->id,
                    'order_id'   => $p->order_id,
                    'method'     => $p->method,
                    'amount'     => (float) $p->amount,
                    'status'     => $p->status,
                    'verified_at'=> $p->verified_at,
                ])->values(),
            ];
        });

        return CommonHelper::responseWithData(['total' => $data->count(), 'data' => $data->values()]);
    }

    /**
     * POST /delivery_boy/loading_slips/{id}/lock
     * Locks one loading slip's payments. Requires every order in the slip to have
     * finished its delivery attempt and every OrderPayment for it to already be
     * manually verified by the distributor — nothing here auto-verifies anything.
     */
    public function driverLockLoadingSlip(int $id)
    {
        $driver = $this->currentDriver();
        if (!$driver) {
            return CommonHelper::responseError('driver_not_found');
        }

        $slip = LoadingSlip::where('id', $id)->where('driver_id', $driver->id)->first();
        if (!$slip) {
            return CommonHelper::responseError('loading_slip_not_found');
        }

        if ($slip->payment_lock_status === 'locked') {
            return CommonHelper::responseError('loading_slip_already_locked');
        }

        $orders = Order::where('loading_slip_id', $slip->id)->get();
        if ($orders->isEmpty()) {
            return CommonHelper::responseError('no_orders_in_slip');
        }

        $terminalDeliveryStatuses = [
            \App\Models\OrderStatusList::$delivered,
            \App\Models\OrderStatusList::$partialDelivery,
            \App\Models\OrderStatusList::$notDelivered,
            \App\Models\OrderStatusList::$cancelled,
            \App\Models\OrderStatusList::$returned,
        ];
        if ($orders->whereNotIn('active_status', $terminalDeliveryStatuses)->isNotEmpty()) {
            return CommonHelper::responseError('orders_pending_delivery');
        }

        $pendingPayments = OrderPayment::whereIn('order_id', $orders->pluck('id'))
            ->where('status', 'pending')
            ->count();
        if ($pendingPayments > 0) {
            return CommonHelper::responseError('payment_verification_pending');
        }

        $slip->payment_lock_status = 'locked';
        $slip->payment_locked_at   = Carbon::now();
        $slip->payment_locked_by   = $driver->id;
        $slip->save();

        return CommonHelper::responseWithData([
            'id'                 => $slip->id,
            'payment_lock_status'=> $slip->payment_lock_status,
            'payment_locked_at'  => $slip->payment_locked_at,
        ]);
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Distributor reconciliation
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /seller/trips
     * All loading slips for this distributor with reconciliation status.
     */
    public function sellerTripsList(Request $request)
    {
        $query = LoadingSlip::with(['driver:id,name,mobile', 'vehicle:id,vehicle_number,name'])
            ->where('created_by', auth()->id())
            ->orderByDesc('id');

        if ($request->filled('filter')) {
            $filter = $request->input('filter');
            $query->where(function ($q) use ($filter) {
                $q->where('slip_no', 'like', "%{$filter}%")
                  ->orWhereHas('driver', fn($d) => $d->where('name', 'like', "%{$filter}%"));
            });
        }

        $total = $query->count();
        $slips = $query->skip(($request->input('page', 1) - 1) * 10)->take(10)->get();

        return CommonHelper::responseWithData($slips, $total);
    }

    /**
     * GET /seller/trips/{id}
     * id = loading_slip_id
     * Returns slip info + all orders + per-order payment status + totals.
     */
    public function sellerTripDetail(int $id)
    {
        $slip = LoadingSlip::with(['driver:id,name,mobile', 'vehicle:id,vehicle_number,name'])
            ->where(function ($q) {
                if (auth()->user() && auth()->user()->seller) {
                    $q->where('created_by', auth()->id());
                }
            })
            ->find($id);

        if (!$slip) return CommonHelper::responseError('trip_not_found');

        // All orders in this slip with retailer info
        $orders = Order::with('user:id,name,mobile')
            ->where('loading_slip_id', $id)
            ->get();

        $orderIds = $orders->pluck('id');

        // All payments for these orders
        $payments = $orderIds->isNotEmpty()
            ? OrderPayment::whereIn('order_id', $orderIds)->get()
            : collect();

        $paymentMap = $payments->groupBy('order_id');

        $ordersData = $orders->map(function ($order) use ($paymentMap) {
            return [
                'id'            => $order->id,
                'orders_id'     => $order->orders_id,
                'invoice_number'=> $order->invoice_number ?: CommonHelper::resolveDistributorInvoiceNumber($order->id),
                'final_total'   => $order->final_total,
                'active_status' => $order->active_status,
                'retailer'      => $order->user
                    ? ['id' => $order->user->id, 'name' => $order->user->name, 'mobile' => $order->user->mobile]
                    : null,
                'payments'      => $paymentMap->get($order->id, collect())->values(),
            ];
        });

        $totalExpected   = round($orders->where('active_status', '!=', \App\Models\OrderStatusList::$notDelivered)->sum('final_total'), 2);
        $digitalVerified = round(
            $payments->whereIn('method', ['upi', 'cheque', 'signature'])->where('status', 'verified')->sum('amount'), 2
        );
        $cashExpected    = round($totalExpected - $digitalVerified, 2);
        $cashReceived    = $slip->cash_received;
        $shortfall       = $cashReceived !== null ? round($cashExpected - $cashReceived, 2) : null;
        $hasCash         = $payments->where('method', 'cash')->isNotEmpty();

        // --- Close eligibility ---
        $blockers = [];
        $unverified = $payments->where('status', 'pending')->count();
        if ($unverified > 0) {
            $blockers[] = "{$unverified} payment(s) not verified yet";
        }
        if ($hasCash && $cashReceived === null) {
            $blockers[] = 'Cash received amount not entered';
        }
        $canClose = empty($blockers) && $slip->status !== 2;

        return CommonHelper::responseWithData([
            'slip'      => $slip,
            'orders'    => $ordersData,
            'totals'    => [
                'total_expected'   => $totalExpected,
                'digital_verified' => $digitalVerified,
                'cash_expected'    => $cashExpected,
                'cash_received'    => $cashReceived,
                'shortfall'        => $shortfall,
                'has_cash'         => $hasCash,
            ],
            'can_close'     => $canClose,
            'close_blockers'=> $blockers,
        ]);
    }

    /**
     * POST /seller/trips/{id}/reconcile
     * id = loading_slip_id. Body: { cash_received: float }
     */
    public function sellerUpdateReconciliation(Request $request, int $id)
    {
        $seller = $this->currentSeller();
        if (!$seller) return CommonHelper::responseError('seller_not_found');

        $slip = LoadingSlip::find($id);
        if (!$slip) return CommonHelper::responseError('trip_not_found');

        $validator = Validator::make($request->all(), [
            'cash_received' => 'required|numeric|min:0',
        ]);
        if ($validator->fails()) return CommonHelper::responseError($validator->errors()->first());

        // Recalculate cash_expected fresh (exclude not_delivered orders)
        $orders          = Order::where('loading_slip_id', $id)
                            ->where('active_status', '!=', \App\Models\OrderStatusList::$notDelivered)
                            ->get('final_total');
        $payments        = OrderPayment::whereIn('order_id', Order::where('loading_slip_id', $id)->pluck('id'))
                            ->whereIn('method', ['upi', 'cheque', 'signature'])
                            ->where('status', 'verified')->get();
        $totalExpected   = round($orders->sum('final_total'), 2);
        $digitalVerified = round($payments->sum('amount'), 2);
        $cashExpected    = round($totalExpected - $digitalVerified, 2);
        $cashReceived    = (float) $request->cash_received;
        $diff            = round($cashExpected - $cashReceived, 2);

        if ($diff == 0)    $status = 'full_match';
        elseif ($diff > 0) $status = 'partial_match';
        else               $status = 'overpaid';

        $slip->cash_received         = $cashReceived;
        $slip->reconciliation_status = $status;
        $slip->save();

        return CommonHelper::responseWithData([
            'reconciliation_status' => $status,
            'cash_expected'         => $cashExpected,
            'shortfall'             => $diff,
        ]);
    }

    /**
     * POST /seller/trips/{id}/close
     * id = loading_slip_id. Marks slip status → 2 (Completed).
     * Guards: all payments verified + cash_received entered if cash exists.
     */
    public function sellerCloseTrip(int $id)
    {
        $slip = LoadingSlip::find($id);
        if (!$slip) return CommonHelper::responseError('trip_not_found');

        if ($slip->status === 2) {
            return CommonHelper::responseError('trip_already_closed');
        }

        $orderIds = Order::where('loading_slip_id', $id)->pluck('id');
        $payments = OrderPayment::whereIn('order_id', $orderIds)->get();

        $unverified = $payments->where('status', 'pending')->count();
        if ($unverified > 0) {
            return CommonHelper::responseError("{$unverified} payment(s) still pending verification");
        }

        $hasCash = $payments->where('method', 'cash')->isNotEmpty();
        if ($hasCash && $slip->cash_received === null) {
            return CommonHelper::responseError('Enter cash received from driver before closing trip');
        }

        $slip->status        = 2; // Completed
        $slip->reconciled_at = Carbon::now();
        $slip->reconciled_by = auth()->id();
        $slip->save();

        return CommonHelper::responseSuccess('trip_closed');
    }

    /**
     * GET /seller/settlements
     * All locked EOD settlements for this distributor's drivers.
     * Optional query: date (Y-m-d), delivery_boy_id
     */
    public function sellerSettlements(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $query = DriverSettlement::with(['deliveryBoy:id,name,mobile'])
            ->where('seller_id', $seller->id)
            ->where('status', 'locked')
            ->orderByDesc('settlement_date');

        if ($request->filled('date')) {
            $query->where('settlement_date', $request->input('date'));
        }
        if ($request->filled('delivery_boy_id')) {
            $query->where('delivery_boy_id', $request->input('delivery_boy_id'));
        }

        $rows = $query->get();

        return CommonHelper::responseWithData(['total' => $rows->count(), 'data' => $rows]);
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Salesman payment collection (mirrors driver payment flow)
    // ──────────────────────────────────────────────────────────────────────────

    private function currentSalesman(): ?Salesman
    {
        $admin = auth()->user();
        if (!$admin) return null;
        return Salesman::where('admin_id', $admin->id)->first();
    }

    /**
     * GET /salesman/payment-methods
     * Salesman collects actual money (cash/upi/cheque) for delivered orders where driver took signature.
     */
    public function salesmanPaymentMethods()
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) return CommonHelper::responseError('salesman_not_found');

        $seller = $salesman->seller_id ? Seller::find($salesman->seller_id) : null;
        if (!$seller) return CommonHelper::responseError('salesman_not_linked_to_distributor');

        $allMeta = [
            'cash'   => ['requires_amount' => true, 'requires_photo' => false, 'photo_label' => null, 'discount_percent' => (float) ($seller->cash_discount_percent ?? 0)],
            'upi'    => ['requires_amount' => true, 'requires_photo' => true,  'photo_label' => 'UPI screenshot'],
            'cheque' => ['requires_amount' => true, 'requires_photo' => true,  'photo_label' => 'Cheque photo'],
        ];

        $enabled = array_values(array_filter(
            $this->sellerEnabledMethods($seller),
            fn ($m) => isset($allMeta[$m])
        ));

        return CommonHelper::responseWithData([
            'methods' => array_values(array_map(fn ($m) => array_merge(['method' => $m], $allMeta[$m]), $enabled))
        ]);
    }

    /**
     * POST /salesman/collect-payment
     * Body: order_id, method (cash/upi/cheque), amount, proof_photo (for upi/cheque)
     * Only allowed for orders that are delivered and have a driver signature payment but no salesman collection yet.
     */
    public function salesmanCollectPayment(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) return CommonHelper::responseError('salesman_not_found');

        $seller = $salesman->seller_id ? Seller::find($salesman->seller_id) : null;
        if (!$seller) return CommonHelper::responseError('salesman_not_linked_to_distributor');

        $validator = Validator::make($request->all(), [
            'order_id' => 'required|integer|exists:orders,id',
            'method'   => 'required|in:cash,upi,cheque',
        ]);
        if ($validator->fails()) return CommonHelper::responseError($validator->errors()->first());

        $method = $request->input('method');
        $enabledMethods = array_values($this->sellerEnabledMethods($seller));
        if (!in_array($method, $enabledMethods, true)) return CommonHelper::responseError('payment_method_not_allowed');
        if (!$request->filled('amount')) return CommonHelper::responseError('amount_required');
        if (in_array($method, ['upi', 'cheque'], true) && !$request->hasFile('proof_photo') && !$request->filled('proof_photo')) {
            return CommonHelper::responseError('proof_photo_required_for_' . $method);
        }

        $order = Order::where('id', $request->order_id)
            ->where('active_status', 6)
            ->first();
        if (!$order) return CommonHelper::responseError('order_not_delivered');

        // Confirm driver already collected signature for this order
        $driverSignature = OrderPayment::where('order_id', $order->id)
            ->where('method', 'signature')
            ->whereNotNull('delivery_boy_id')
            ->first();
        if (!$driverSignature) return CommonHelper::responseError('no_driver_signature_for_this_order');

        $dueAmount = (float) $driverSignature->amount;

        // Sum of what salesman has already collected for this order
        $alreadyCollected = (float) OrderPayment::where('order_id', $order->id)
            ->whereIn('method', ['cash', 'upi', 'cheque'])
            ->whereNull('delivery_boy_id')
            ->sum('amount');

        $remaining = round($dueAmount - $alreadyCollected, 2);

        if ($remaining <= 0) {
            return CommonHelper::responseError('payment_already_fully_collected_for_this_order');
        }

        if ((float) $request->amount > $remaining) {
            return CommonHelper::responseError('amount_cannot_exceed_remaining_due_of_' . $remaining);
        }

        $proofPath = null;
        if ($request->hasFile('proof_photo')) {
            $file      = $request->file('proof_photo');
            $proofPath = Storage::disk('public')->putFile('payment_proofs', $file);
        } elseif ($request->filled('proof_photo')) {
            $proofPath = (string) $request->proof_photo;
        }

        try {
            $payment = OrderPayment::create([
                'order_id'    => $order->id,
                'salesman_id' => $salesman->id,
                'method'      => $method,
                'amount'      => (float) $request->amount,
                'proof_photo' => $proofPath,
                'status'      => 'pending',
            ]);
        } catch (\Throwable $e) {
            Log::error('salesmanCollectPayment failed: ' . $e->getMessage());
            return CommonHelper::responseError('something_went_wrong');
        }

        return CommonHelper::responseWithData(['payment_id' => $payment->id, 'status' => 'pending']);
    }

    /**
     * GET /salesman/settlement/today
     */
    public function salesmanTodaySummary()
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) return CommonHelper::responseError('salesman_not_found');

        $today    = Carbon::today();
        $payments = OrderPayment::where('salesman_id', $salesman->id)->whereDate('created_at', $today)->get();
        $pending  = $payments->where('status', 'pending')->count();
        $canLock  = $payments->isNotEmpty() && $pending === 0;

        $settlement = SalesmanSettlement::where('salesman_id', $salesman->id)->where('settlement_date', $today->toDateString())->first();

        return CommonHelper::responseWithData([
            'date'       => $today->toDateString(),
            'eod_status' => $settlement ? $settlement->status : 'not_submitted',
            'summary'    => [
                'total_orders'    => $payments->count(),
                'total_cash'      => round($payments->where('method', 'cash')->sum('amount'), 2),
                'total_upi'       => round($payments->where('method', 'upi')->sum('amount'), 2),
                'total_cheque'    => round($payments->where('method', 'cheque')->sum('amount'), 2),
                'total_signature' => round($payments->where('method', 'signature')->sum('amount'), 2),
                'pending_count'   => $pending,
                'can_lock_eod'    => $canLock,
            ],
        ]);
    }

    /**
     * POST /salesman/settlement/lock-eod
     */
    public function salesmanLockEod()
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) return CommonHelper::responseError('salesman_not_found');

        $today    = Carbon::today();
        $payments = OrderPayment::where('salesman_id', $salesman->id)->whereDate('created_at', $today)->get();

        if ($payments->isEmpty()) return CommonHelper::responseError('no_collections_today');
        if ($payments->where('status', 'pending')->count() > 0) return CommonHelper::responseError('distributor_verification_pending');

        $existing = SalesmanSettlement::where('salesman_id', $salesman->id)->where('settlement_date', $today->toDateString())->first();
        if ($existing && $existing->status === 'locked') return CommonHelper::responseError('eod_already_locked');

        $settlement = SalesmanSettlement::updateOrCreate(
            ['salesman_id' => $salesman->id, 'settlement_date' => $today->toDateString()],
            [
                'seller_id'       => (int) $salesman->seller_id,
                'total_orders'    => $payments->count(),
                'total_cash'      => round($payments->where('method', 'cash')->sum('amount'), 2),
                'total_upi'       => round($payments->where('method', 'upi')->sum('amount'), 2),
                'total_cheque'    => round($payments->where('method', 'cheque')->sum('amount'), 2),
                'total_signature' => round($payments->where('method', 'signature')->sum('amount'), 2),
                'status'          => 'locked',
                'locked_at'       => Carbon::now(),
            ]
        );

        return CommonHelper::responseWithData(['settlement_id' => $settlement->id, 'settlement_date' => $today->toDateString(), 'status' => 'locked']);
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Updated distributor trips — now covers driver + salesman per day
    //  Pass ?type=driver (default) or ?type=salesman in requests
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /seller/trips  (updated)
     * Returns merged list of driver + salesman settlements for this distributor.
     * Query: filter (person name search), type (driver|salesman|all), page
     */
    public function sellerTripsListUpdated(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) return CommonHelper::responseError('seller_not_found');

        $filter       = strtolower($request->input('filter', ''));
        $type         = $request->input('type', 'all');
        $statusFilter = $request->input('status', 'all');
        $fromDate     = $request->input('from_date');
        $toDate       = $request->input('to_date');
        $page         = max(1, (int) $request->input('page', 1));
        $perPage      = 15;

        $rows = collect();

        if ($type !== 'salesman') {
            // Aggregate real payment totals directly from order_payments.
            // settlement.total_cash stays 0 until driver locks EOD, so we can't use it here.
            $driverIds = DeliveryBoy::where('seller_id', $seller->id)->pluck('id');

            // Grouped by loading slip so two trips a driver runs on the same day stay
            // two rows, not one merged row. Orders never assigned a slip (legacy/edge
            // cases) fall back to the old per-day grouping via the CASE below.
            $driverAgg = DB::table('order_payments')
                ->join('delivery_boys', 'delivery_boys.id', '=', 'order_payments.delivery_boy_id')
                ->join('orders', 'orders.id', '=', 'order_payments.order_id')
                ->leftJoin('loading_slips', 'loading_slips.id', '=', 'orders.loading_slip_id')
                ->whereIn('order_payments.delivery_boy_id', $driverIds)
                ->when($fromDate, fn ($q) => $q->whereDate('order_payments.created_at', '>=', $fromDate))
                ->when($toDate, fn ($q) => $q->whereDate('order_payments.created_at', '<=', $toDate))
                ->selectRaw('
                    order_payments.delivery_boy_id,
                    delivery_boys.name  as person_name,
                    delivery_boys.mobile as person_mobile,
                    delivery_boys.country_code as person_country_code,
                    MAX(orders.loading_slip_id) as loading_slip_id,
                    MAX(loading_slips.slip_no) as slip_no,
                    DATE(MIN(order_payments.created_at)) as pay_date,
                    ROUND(SUM(IF(order_payments.method="cash",      order_payments.amount, 0)), 2) as total_cash,
                    ROUND(SUM(IF(order_payments.method="upi",       order_payments.amount, 0)), 2) as total_upi,
                    ROUND(SUM(IF(order_payments.method="cheque",    order_payments.amount, 0)), 2) as total_cheque,
                    ROUND(SUM(IF(order_payments.method="signature", order_payments.amount, 0)), 2) as total_signature,
                    COUNT(DISTINCT order_payments.order_id) as total_orders,
                    MAX(order_payments.created_at) as last_payment_at
                ')
                ->groupByRaw('
                    order_payments.delivery_boy_id, delivery_boys.name, delivery_boys.mobile,
                    COALESCE(orders.loading_slip_id, 0),
                    (CASE WHEN orders.loading_slip_id IS NULL THEN DATE(order_payments.created_at) ELSE NULL END)
                ')
                ->get();

            // Load settlements as a lookup map for reconciliation meta (cash_received, recon_status, etc.)
            $driverSettlements = DriverSettlement::where('seller_id', $seller->id)
                ->get()
                ->keyBy(fn ($ds) => $ds->loading_slip_id
                    ? 'slip_' . $ds->loading_slip_id
                    : 'day_' . $ds->delivery_boy_id . '_' . (
                        $ds->settlement_date instanceof Carbon
                            ? $ds->settlement_date->format('Y-m-d')
                            : (string) $ds->settlement_date
                    ));

            foreach ($driverAgg as $agg) {
                if ($filter && stripos($agg->person_name ?? '', $filter) === false) continue;
                $key = $agg->loading_slip_id
                    ? 'slip_' . $agg->loading_slip_id
                    : 'day_' . $agg->delivery_boy_id . '_' . $agg->pay_date;
                $ds  = $driverSettlements->get($key);

                // Ensure a settlement row exists so the detail view has a valid ID to link to.
                if (!$ds) {
                    $ds = DriverSettlement::firstOrCreate(
                        [
                            'delivery_boy_id' => $agg->delivery_boy_id,
                            'loading_slip_id' => $agg->loading_slip_id,
                            'settlement_date' => $agg->pay_date,
                        ],
                        ['seller_id' => $seller->id, 'total_orders' => 0, 'total_cash' => 0,
                         'total_upi' => 0, 'total_cheque' => 0, 'total_signature' => 0, 'status' => 'open']
                    );
                    $driverSettlements->put($key, $ds);
                }

                $effectiveStatus = $this->effectiveTripStatus($ds, $agg->last_payment_at);
                if ($statusFilter !== 'all' && $effectiveStatus !== $statusFilter) continue;

                $rows->push([
                    'id'                   => $ds->id,
                    'type'                 => 'driver',
                    'trip_no'              => $agg->slip_no,
                    'person_name'          => $agg->person_name ?: '-',
                    'person_mobile'        => $agg->person_mobile ?? '',
                    'person_country_code'  => $agg->person_country_code ?? '+91',
                    'date'                 => $agg->pay_date,
                    'total_orders'         => (int) $agg->total_orders,
                    'total_cash'           => (float) $agg->total_cash,
                    'total_upi'            => (float) $agg->total_upi,
                    'total_cheque'         => (float) $agg->total_cheque,
                    'total_signature'      => (float) $agg->total_signature,
                    'cash_received'        => $ds->cash_received,
                    'reconciliation_status'=> $ds->reconciliation_status ?? 'unreconciled',
                    'status'               => $effectiveStatus,
                    'status_text'          => self::STATUS_TEXT_MAP[$effectiveStatus] ?? ucfirst($effectiveStatus),
                    'sort_key'             => $agg->pay_date . '_' . $agg->delivery_boy_id . '_' . ($agg->loading_slip_id ?? 0),
                ]);
            }
        }

        if ($type !== 'driver') {
            $salesmanIds = Salesman::where('seller_id', $seller->id)->pluck('id');

            $salesmanAgg = DB::table('order_payments')
                ->join('salesmen', 'salesmen.id', '=', 'order_payments.salesman_id')
                ->whereIn('order_payments.salesman_id', $salesmanIds)
                ->whereNotNull('order_payments.salesman_id')
                ->when($fromDate, fn ($q) => $q->whereDate('order_payments.created_at', '>=', $fromDate))
                ->when($toDate, fn ($q) => $q->whereDate('order_payments.created_at', '<=', $toDate))
                ->selectRaw('
                    order_payments.salesman_id,
                    salesmen.name   as person_name,
                    salesmen.mobile as person_mobile,
                    salesmen.country_code as person_country_code,
                    DATE(order_payments.created_at) as pay_date,
                    ROUND(SUM(IF(order_payments.method="cash",      order_payments.amount, 0)), 2) as total_cash,
                    ROUND(SUM(IF(order_payments.method="upi",       order_payments.amount, 0)), 2) as total_upi,
                    ROUND(SUM(IF(order_payments.method="cheque",    order_payments.amount, 0)), 2) as total_cheque,
                    ROUND(SUM(IF(order_payments.method="signature", order_payments.amount, 0)), 2) as total_signature,
                    COUNT(DISTINCT order_payments.order_id) as total_orders,
                    MAX(order_payments.created_at) as last_payment_at
                ')
                ->groupByRaw('order_payments.salesman_id, salesmen.name, salesmen.mobile, DATE(order_payments.created_at)')
                ->get();

            $salesmanSettlements = SalesmanSettlement::where('seller_id', $seller->id)
                ->get()
                ->keyBy(fn ($ss) => $ss->salesman_id . '_' . (
                    $ss->settlement_date instanceof Carbon
                        ? $ss->settlement_date->format('Y-m-d')
                        : (string) $ss->settlement_date
                ));

            foreach ($salesmanAgg as $agg) {
                if ($filter && stripos($agg->person_name ?? '', $filter) === false) continue;
                $key = $agg->salesman_id . '_' . $agg->pay_date;
                $ss  = $salesmanSettlements->get($key);

                // Ensure a settlement row exists so the detail view has a valid ID to link to.
                if (!$ss) {
                    $ss = SalesmanSettlement::firstOrCreate(
                        ['salesman_id' => $agg->salesman_id, 'settlement_date' => $agg->pay_date],
                        ['seller_id' => $seller->id, 'total_orders' => 0, 'total_cash' => 0,
                         'total_upi' => 0, 'total_cheque' => 0, 'total_signature' => 0, 'status' => 'open']
                    );
                    $salesmanSettlements->put($key, $ss);
                }

                $effectiveStatus = $this->effectiveTripStatus($ss, $agg->last_payment_at);
                if ($statusFilter !== 'all' && $effectiveStatus !== $statusFilter) continue;

                $rows->push([
                    'id'                   => $ss->id,
                    'type'                 => 'salesman',
                    'trip_no'              => null,
                    'person_name'          => $agg->person_name ?: '-',
                    'person_mobile'        => $agg->person_mobile ?? '',
                    'person_country_code'  => $agg->person_country_code ?? '+91',
                    'date'                 => $agg->pay_date,
                    'total_orders'         => (int) $agg->total_orders,
                    'total_cash'           => (float) $agg->total_cash,
                    'total_upi'            => (float) $agg->total_upi,
                    'total_cheque'         => (float) $agg->total_cheque,
                    'total_signature'      => (float) $agg->total_signature,
                    'cash_received'        => $ss->cash_received,
                    'reconciliation_status'=> $ss->reconciliation_status ?? 'unreconciled',
                    'status'               => $effectiveStatus,
                    'status_text'          => self::STATUS_TEXT_MAP[$effectiveStatus] ?? ucfirst($effectiveStatus),
                    'sort_key'             => $agg->pay_date . '_' . $agg->salesman_id,
                ]);
            }
        }

        $sorted = $rows->sortByDesc('sort_key')->values();
        $total  = $sorted->count();
        $data   = $sorted->skip(($page - 1) * $perPage)->take($perPage)->values();

        return CommonHelper::responseWithData(['total' => $total, 'data' => $data]);
    }

    /**
     * GET /seller/trips/{id}  (updated)
     * Query: type=driver (default) | type=salesman
     * id = driver_settlement.id or salesman_settlement.id
     */
    public function sellerTripDetailUpdated(Request $request, int $id)
    {
        $seller = $this->currentSeller();
        if (!$seller) return CommonHelper::responseError('seller_not_found');

        $type = $request->input('type', 'driver');

        if ($type === 'salesman') {
            $settlement = SalesmanSettlement::with('salesman:id,name,mobile')->find($id);
            // verify this salesman belongs to the current seller
            if (!$settlement || !Salesman::where('id', $settlement->salesman_id)->where('seller_id', $seller->id)->exists()) {
                return CommonHelper::responseError('settlement_not_found');
            }

            $date     = $settlement->settlement_date instanceof Carbon
                            ? $settlement->settlement_date->toDateString()
                            : (string) $settlement->settlement_date;
            $personId = $settlement->salesman_id;
            $payments = OrderPayment::where('salesman_id', $personId)->whereDate('created_at', $date)->get();
            $person   = ['name' => $settlement->salesman?->name ?? '-', 'mobile' => $settlement->salesman?->mobile ?? ''];
        } else {
            $settlement = DriverSettlement::with(['deliveryBoy:id,name,mobile', 'loadingSlip:id,slip_no'])->find($id);
            // verify this driver belongs to the current seller
            if (!$settlement || !DeliveryBoy::where('id', $settlement->delivery_boy_id)->where('seller_id', $seller->id)->exists()) {
                return CommonHelper::responseError('settlement_not_found');
            }

            $date     = $settlement->settlement_date instanceof Carbon
                            ? $settlement->settlement_date->toDateString()
                            : (string) $settlement->settlement_date;
            $personId = $settlement->delivery_boy_id;
            $payments = $this->paymentsForDriverSettlement($settlement);
            $person   = ['name' => $settlement->deliveryBoy?->name ?? '-', 'mobile' => $settlement->deliveryBoy?->mobile ?? ''];
        }

        $orderIds   = $payments->pluck('order_id')->unique();

        // Broader order set for this trip. $orderIds only has orders with a payment
        // row — a cancelled order never gets one, so it would never surface. A
        // cancel via the generic status-update path does NOT null loading_slip_id
        // (unlike reschedule, which does — see the OrderStatus lookup below instead),
        // so sourcing directly from the slip catches those too. Only meaningful when
        // this trip actually has a slip; otherwise it's the same set as $orderIds.
        $tripOrderIds = $orderIds;
        if ($type === 'driver' && $settlement->loading_slip_id) {
            $tripOrderIds = $orderIds->merge(
                Order::where('loading_slip_id', $settlement->loading_slip_id)->pluck('id')
            )->unique()->values();
        }

        $orders     = Order::with(['user:id,name,mobile', 'loadingSlip:id,slip_no'])->whereIn('id', $tripOrderIds)->get();
        $paymentMap = $payments->groupBy('order_id');

        // Approved returns against orders in this trip — refund is wallet-credited
        // (CommonHelper::calculateRefundAmountForOrderItem at approval time), not cash
        // handed back by the driver, so it's shown separately from the cash/digital
        // collection math above rather than folded into it.
        $returnRequests = ReturnRequest::with([
                'orderItem:id,order_id,product_name,variant_name,refund_amount',
                'user:id,name,mobile',
            ])
            ->whereIn('order_id', $tripOrderIds)
            ->where('status', ReturnStatusList::$rApproved)
            ->get();
        $returnMap    = $returnRequests->groupBy('order_id');
        $totalReturns = round($returnRequests->sum(fn ($r) => (float) ($r->orderItem->refund_amount ?? 0)), 2);

        // Item-level shortfall detection. The order's own active_status is NOT a
        // reliable flag here — an order delivered through the normal flow can still
        // carry a per-item delivered_quantity < quantity (order stays "Delivered",
        // never flips to "Partial Delivery"), so this always scans order_items
        // directly instead of trusting the order status.
        $itemsByOrder = OrderItem::whereIn('order_id', $tripOrderIds)->get()->groupBy('order_id');

        $partialInvoices = $orders->map(function ($o) use ($itemsByOrder) {
                $items = $itemsByOrder->get($o->id, collect());
                $shortfallItems = $items->filter(
                    fn ($i) => $i->delivered_quantity !== null && (float) $i->delivered_quantity < (float) $i->quantity
                );
                if ($shortfallItems->isEmpty()) return null;

                return [
                    'order_id'            => $o->id,
                    'orders_id'           => $o->orders_id,
                    'invoice_number'      => $o->invoice_number ?: CommonHelper::resolveDistributorInvoiceNumber($o->id),
                    'loading_slip_no'     => $o->loadingSlip ? $o->loadingSlip->slip_no : null,
                    'retailer'            => $o->user ? ['id' => $o->user->id, 'name' => $o->user->name, 'mobile' => $o->user->mobile] : null,
                    'final_total'         => $o->final_total,
                    'total_ordered_qty'   => $items->sum(fn ($i) => (float) $i->quantity),
                    'total_delivered_qty' => $items->sum(fn ($i) => (float) ($i->delivered_quantity ?? $i->quantity)),
                    'items'               => $shortfallItems->map(fn ($i) => [
                        'order_item_id'      => $i->id,
                        'product_name'       => $i->product_name,
                        'variant_name'       => $i->variant_name,
                        'quantity'           => (float) $i->quantity,
                        'delivered_quantity' => (float) $i->delivered_quantity,
                        'shortfall_qty'      => round((float) $i->quantity - (float) $i->delivered_quantity, 2),
                        'shortfall_value'    => round(((float) $i->quantity - (float) $i->delivered_quantity) * ((float) ($i->discounted_price ?: $i->price)), 2),
                        'shortfall_reason'   => $i->shortfall_reason,
                        'damage_photo'       => $i->damage_photo,
                        'verified'           => $i->shortfall_verified_at !== null,
                    ])->values(),
                ];
            })
            ->filter()
            ->values();

        // Cancelled orders came in via the broader $tripOrderIds above (a cancel
        // doesn't touch loading_slip_id, unlike reschedule) — their final_total is
        // never zeroed out, so they must stay out of the money totals below or
        // "Total Expected" quietly inflates by whatever was cancelled.
        $cancelledOrders = $orders->where('active_status', \App\Models\OrderStatusList::$cancelled)->values();

        $cancelledAtMap = \App\Models\OrderStatus::whereIn('order_id', $cancelledOrders->pluck('id'))
            ->where('status', (string) \App\Models\OrderStatusList::$cancelled)
            ->get()
            ->groupBy('order_id')
            ->map(fn ($rows) => $rows->sortByDesc('created_at')->first()->created_at);

        $cancelInvoices = $cancelledOrders->map(fn ($o) => [
            'order_id'        => $o->id,
            'orders_id'       => $o->orders_id,
            'invoice_number'  => $o->invoice_number ?: CommonHelper::resolveDistributorInvoiceNumber($o->id),
            'loading_slip_no' => $o->loadingSlip ? $o->loadingSlip->slip_no : null,
            'retailer'        => $o->user ? ['id' => $o->user->id, 'name' => $o->user->name, 'mobile' => $o->user->mobile] : null,
            'final_total'     => $o->final_total,
            'cancelled_at'    => $cancelledAtMap->get($o->id),
            'verified'        => $o->cancel_verified_at !== null,
        ])->values();

        // Rescheduled orders detach from the slip immediately (loading_slip_id is
        // nulled), so unlike cancels they can't be found via $tripOrderIds at all —
        // only the snapshot captured on the "Rescheduled" order_statuses row at the
        // moment of reschedule can still tell us which trip one came from.
        $rescheduleStatuses = ($type === 'driver' && $settlement->loading_slip_id)
            ? \App\Models\OrderStatus::where('status', 'Rescheduled')
                ->where('loading_slip_id', $settlement->loading_slip_id)
                ->orderByDesc('created_at')
                ->get()
            : collect();

        $rescheduledOrdersMap = Order::with('user:id,name,mobile')
            ->whereIn('id', $rescheduleStatuses->pluck('order_id')->unique())
            ->get()
            ->keyBy('id');

        $rescheduleInvoices = $rescheduleStatuses->map(function ($statusRow) use ($rescheduledOrdersMap) {
                $o = $rescheduledOrdersMap->get((int) $statusRow->order_id);
                if (!$o) return null;
                return [
                    'order_id'          => $o->id,
                    'orders_id'         => $o->orders_id,
                    'invoice_number'    => $o->invoice_number ?: CommonHelper::resolveDistributorInvoiceNumber($o->id),
                    'retailer'          => $o->user ? ['id' => $o->user->id, 'name' => $o->user->name, 'mobile' => $o->user->mobile] : null,
                    'final_total'       => $o->final_total,
                    'new_delivery_date' => $o->delivery_date,
                    'delivery_reason'   => $o->delivery_reason,
                    'rescheduled_at'    => $statusRow->created_at,
                    'current_status'    => $o->active_status,
                ];
            })
            ->filter()
            ->values();

        // Item Summary of Returned Items — same approved-returns source that already
        // feeds $totalReturns above, just reshaped as its own flat list for the tab.
        $returnItemOrdersMap = Order::whereIn('id', $returnRequests->pluck('order_id')->unique())
            ->get(['id', 'orders_id', 'invoice_number'])
            ->keyBy('id');

        $returnItemSummary = $returnRequests->map(function ($r) use ($returnItemOrdersMap) {
                $o = $returnItemOrdersMap->get($r->order_id);
                return [
                    'order_id'       => $r->order_id,
                    'invoice_number' => $o ? ($o->invoice_number ?: CommonHelper::resolveDistributorInvoiceNumber($o->id)) : null,
                    'product_name'   => $r->orderItem->product_name ?? '-',
                    'variant_name'   => $r->orderItem->variant_name ?? null,
                    'refund_amount'  => (float) ($r->orderItem->refund_amount ?? 0),
                    'reason'         => $r->reason,
                    'retailer'       => $r->user ? ['id' => $r->user->id, 'name' => $r->user->name, 'mobile' => $r->user->mobile] : null,
                    'returned_at'    => $r->updated_at,
                ];
            })
            ->values();

        $totalExpected        = round($orders->where('active_status', '!=', \App\Models\OrderStatusList::$cancelled)->sum('final_total'), 2);
        $digitalVerified      = round($payments->whereIn('method', ['upi', 'cheque', 'signature'])->where('status', 'verified')->sum('amount'), 2);
        // Cash expected = actual cash the driver collected (not total_expected minus digital_verified,
        // which wrongly inflates cash_expected when digital payments are unverified).
        $cashExpected         = round($payments->where('method', 'cash')->sum('amount'), 2);
        $cashReceived         = $settlement->cash_received;
        $hasCash              = $payments->where('method', 'cash')->isNotEmpty();
        $unverifiedDigital    = $payments->whereIn('method', ['upi', 'cheque', 'signature'])->where('status', 'pending')->count();

        // Detect legacy close: old sellerCloseTrip only set loading_slip.status=2,
        // it never updated driver_settlement.status. If all orders' slips are closed, treat as reconciled.
        $effectiveStatus = $settlement->status;
        if ($effectiveStatus !== 'reconciled' && $orders->isNotEmpty()) {
            $slipIds = $orders->pluck('loading_slip_id')->filter()->unique()->values();
            if ($slipIds->isNotEmpty()) {
                $hasOpenSlip = LoadingSlip::whereIn('id', $slipIds)->where('status', '!=', 2)->exists();
                if (!$hasOpenSlip) {
                    $effectiveStatus = 'reconciled';
                }
            }
        }

        // If already reconciled, check for new payments after close → needs re-reconcile
        if ($effectiveStatus === 'reconciled' && $settlement->reconciled_at) {
            $reconciledAt   = $settlement->reconciled_at instanceof Carbon
                ? $settlement->reconciled_at
                : Carbon::parse($settlement->reconciled_at);
            $hasNewPayments = $payments->filter(fn ($p) => Carbon::parse($p->created_at)->gt($reconciledAt))->isNotEmpty();
            if ($hasNewPayments) {
                $effectiveStatus = 'needs_rereconcile';
            }
        }

        $isClosed = $effectiveStatus === 'reconciled';

        // Compute reconciliation_status dynamically so it reflects current totals, not the stored snapshot
        if ($effectiveStatus === 'reconciled' || $effectiveStatus === 'needs_rereconcile') {
            $cashRec = (float) ($settlement->cash_received ?? 0);
            if (!$hasCash) {
                $dynamicReconStatus = $unverifiedDigital === 0 ? 'full_match' : 'partial_match';
            } else {
                $cashDiff = round($cashExpected - $cashRec, 2);
                if ($cashDiff == 0 && $unverifiedDigital === 0) {
                    $dynamicReconStatus = 'full_match';
                } elseif ($cashRec > $cashExpected) {
                    $dynamicReconStatus = 'overpaid';
                } else {
                    $dynamicReconStatus = 'partial_match';
                }
            }
        } else {
            $dynamicReconStatus = $settlement->reconciliation_status ?? 'unreconciled';
        }

        $unverifiedPartialCount = $partialInvoices->flatMap(fn ($inv) => $inv['items'])->filter(fn ($i) => !$i['verified'])->count();
        $unverifiedCancelCount  = $cancelInvoices->filter(fn ($c) => !$c['verified'])->count();

        $blockers = [];
        if ($unverifiedDigital > 0) $blockers[] = "{$unverifiedDigital} digital payment(s) not verified yet";
        if ($hasCash && $settlement->cash_received === null) $blockers[] = 'Enter cash received to close';
        if ($unverifiedPartialCount > 0) $blockers[] = "{$unverifiedPartialCount} partial invoice item(s) not verified yet";
        if ($unverifiedCancelCount > 0) $blockers[] = "{$unverifiedCancelCount} cancelled invoice(s) not verified yet";
        $canClose = ($unverifiedDigital === 0) && (!$hasCash || $settlement->cash_received !== null)
            && ($unverifiedPartialCount === 0) && ($unverifiedCancelCount === 0) && !$isClosed;

        $settlementData = [
            'id'                   => $settlement->id,
            'type'                 => $type,
            'trip_no'              => $type === 'driver' ? ($settlement->loadingSlip?->slip_no ?? null) : null,
            'person'               => $person,
            'date'                 => $date,
            'total_orders'         => $settlement->total_orders,
            'cash_received'        => $settlement->cash_received,
            'reconciliation_status'=> $dynamicReconStatus,
            'status'               => $effectiveStatus,
            'status_text'          => self::STATUS_TEXT_MAP[$effectiveStatus] ?? ucfirst($effectiveStatus),
        ];

        return CommonHelper::responseWithData([
            'settlement'     => $settlementData,
            'orders'         => $orders->map(fn ($o) => [
                'id'              => $o->id,
                'orders_id'       => $o->orders_id,
                'invoice_number'  => $o->invoice_number ?: CommonHelper::resolveDistributorInvoiceNumber($o->id),
                'final_total'     => $o->final_total,
                'active_status'   => $o->active_status,
                'loading_slip_no' => $o->loadingSlip ? $o->loadingSlip->slip_no : null,
                'invoice_number'  => $o->invoice_number,
                'retailer'        => $o->user ? ['id' => $o->user->id, 'name' => $o->user->name, 'mobile' => $o->user->mobile] : null,
                'payments'        => $paymentMap->get($o->id, collect())->values(),
                'returns'         => $returnMap->get($o->id, collect())->map(fn ($r) => [
                    'product_name'  => $r->orderItem->product_name ?? '-',
                    'refund_amount' => (float) ($r->orderItem->refund_amount ?? 0),
                ])->values(),
            ]),
            'totals'         => [
                'total_expected'    => $totalExpected,
                'total_collected'   => round($payments->sum('amount'), 2),
                'digital_verified'  => $digitalVerified,
                'cash_expected'     => $cashExpected,
                'cash_received'     => $cashReceived,
                'shortfall'         => $cashReceived !== null ? round($cashExpected - $cashReceived, 2) : null,
                'has_cash'          => $hasCash,
                'total_cash'        => round($payments->where('method', 'cash')->sum('amount'), 2),
                'total_upi'         => round($payments->where('method', 'upi')->sum('amount'), 2),
                'total_cheque'      => round($payments->where('method', 'cheque')->sum('amount'), 2),
                'total_signature'   => round($payments->where('method', 'signature')->sum('amount'), 2),
                'verified_upi'      => round($payments->where('method', 'upi')->where('status', 'verified')->sum('amount'), 2),
                'verified_cheque'   => round($payments->where('method', 'cheque')->where('status', 'verified')->sum('amount'), 2),
                'verified_signature'=> round($payments->where('method', 'signature')->where('status', 'verified')->sum('amount'), 2),
                'unverified_digital'=> $unverifiedDigital,
                'unverified_partial'=> $unverifiedPartialCount,
                'unverified_cancel' => $unverifiedCancelCount,
                'total_returns'     => $totalReturns,
            ],
            'partial_invoices'    => $partialInvoices,
            'cancel_invoices'     => $cancelInvoices,
            'reschedule_invoices' => $rescheduleInvoices,
            'return_item_summary' => $returnItemSummary,
            'can_close'      => $canClose,
            'close_blockers' => $blockers,
        ]);
    }

    /**
     * POST /seller/trips/{id}/partial-invoices/{itemId}/verify
     * Distributor acknowledgment that a shortfall item has been reviewed — a plain
     * flag (mirrors how order_payments verify already works), feeding the trip's
     * close-gate. No other side effect.
     */
    public function sellerVerifyPartialInvoiceItem(Request $request, int $id, int $itemId)
    {
        $seller = $this->currentSeller();
        if (!$seller) return CommonHelper::responseError('seller_not_found');

        $settlement = DriverSettlement::find($id);
        if (!$settlement || !DeliveryBoy::where('id', $settlement->delivery_boy_id)->where('seller_id', $seller->id)->exists()) {
            return CommonHelper::responseError('settlement_not_found');
        }
        if (!$settlement->loading_slip_id) {
            return CommonHelper::responseError('trip_has_no_loading_slip');
        }

        $item = OrderItem::find($itemId);
        if (!$item) return CommonHelper::responseError('order_item_not_found');

        $belongsToTrip = Order::where('id', $item->order_id)->where('loading_slip_id', $settlement->loading_slip_id)->exists();
        if (!$belongsToTrip) return CommonHelper::responseError('item_not_in_this_trip');

        if ($item->delivered_quantity === null || (float) $item->delivered_quantity >= (float) $item->quantity) {
            return CommonHelper::responseError('item_has_no_shortfall');
        }

        $item->shortfall_verified_at = Carbon::now();
        $item->shortfall_verified_by = auth()->id();
        $item->save();

        return CommonHelper::responseSuccess('shortfall_verified');
    }

    /**
     * POST /seller/trips/{id}/cancel-invoices/{orderId}/verify
     * Distributor acknowledgment that a cancelled order on this trip has been
     * reviewed — a plain flag, feeding the trip's close-gate. No other side effect.
     */
    public function sellerVerifyCancelInvoice(Request $request, int $id, int $orderId)
    {
        $seller = $this->currentSeller();
        if (!$seller) return CommonHelper::responseError('seller_not_found');

        $settlement = DriverSettlement::find($id);
        if (!$settlement || !DeliveryBoy::where('id', $settlement->delivery_boy_id)->where('seller_id', $seller->id)->exists()) {
            return CommonHelper::responseError('settlement_not_found');
        }
        if (!$settlement->loading_slip_id) {
            return CommonHelper::responseError('trip_has_no_loading_slip');
        }

        $order = Order::where('id', $orderId)
            ->where('loading_slip_id', $settlement->loading_slip_id)
            ->where('active_status', \App\Models\OrderStatusList::$cancelled)
            ->first();
        if (!$order) return CommonHelper::responseError('cancelled_order_not_in_this_trip');

        $order->cancel_verified_at = Carbon::now();
        $order->cancel_verified_by = auth()->id();
        $order->save();

        return CommonHelper::responseSuccess('cancellation_verified');
    }

    /**
     * POST /seller/trips/{id}/reconcile  (updated)
     * Body: cash_received. Query: type=driver|salesman
     */
    public function sellerUpdateReconciliationUpdated(Request $request, int $id)
    {
        $seller = $this->currentSeller();
        if (!$seller) return CommonHelper::responseError('seller_not_found');

        $validator = Validator::make($request->all(), ['cash_received' => 'required|numeric|min:0']);
        if ($validator->fails()) return CommonHelper::responseError($validator->errors()->first());

        $type = $request->input('type', 'driver');

        if ($type === 'salesman') {
            $settlement = SalesmanSettlement::find($id);
            if (!$settlement || !Salesman::where('id', $settlement->salesman_id)->where('seller_id', $seller->id)->exists()) {
                return CommonHelper::responseError('settlement_not_found');
            }
        } else {
            $settlement = DriverSettlement::find($id);
            if (!$settlement || !DeliveryBoy::where('id', $settlement->delivery_boy_id)->where('seller_id', $seller->id)->exists()) {
                return CommonHelper::responseError('settlement_not_found');
            }
        }

        $payments = $type === 'salesman'
            ? OrderPayment::where('salesman_id', $settlement->salesman_id)
                ->whereDate('created_at', $settlement->settlement_date instanceof Carbon
                    ? $settlement->settlement_date->toDateString()
                    : (string) $settlement->settlement_date)
                ->get()
            : $this->paymentsForDriverSettlement($settlement);
        $cashExpected = round($payments->where('method', 'cash')->sum('amount'), 2);
        $cashReceived = (float) $request->cash_received;
        $diff         = round($cashExpected - $cashReceived, 2);

        $reconStatus = $diff == 0 ? 'full_match' : ($diff > 0 ? 'partial_match' : 'overpaid');

        $settlement->cash_received         = $cashReceived;
        $settlement->reconciliation_status = $reconStatus;
        $settlement->save();

        return CommonHelper::responseWithData(['reconciliation_status' => $reconStatus, 'cash_expected' => $cashExpected, 'shortfall' => $diff]);
    }

    /**
     * Generates one credit note per order that had either an approved return or a
     * cancellation surfacing in this trip. Document only — it records money that
     * already moved via the existing wallet flows (return approval / item-level
     * cancel refund at cancelOrderItem time), it never credits anything itself.
     * At most one credit note per (order_id, reason_type) ever — the unique index
     * on credit_notes plus this exists-check make re-closing a trip (needs_rereconcile)
     * safe to call again without duplicating one already generated.
     */
    private function generateCreditNotesForTripClose($settlement, string $type, Seller $seller): array
    {
        if ($type === 'driver') {
            $tripOrderIds = $settlement->loading_slip_id
                ? Order::where('loading_slip_id', $settlement->loading_slip_id)->pluck('id')
                : $this->paymentsForDriverSettlement($settlement)->pluck('order_id')->unique();
        } else {
            $date = $settlement->settlement_date instanceof Carbon
                ? $settlement->settlement_date->toDateString()
                : (string) $settlement->settlement_date;
            $tripOrderIds = OrderPayment::where('salesman_id', $settlement->salesman_id)
                ->whereDate('created_at', $date)
                ->pluck('order_id')->unique();
        }

        if ($tripOrderIds->isEmpty()) {
            return [];
        }

        $generatedNos = [];

        // Returns — applies to both driver and salesman trips, any order that was ever paid for on this trip.
        $approvedReturnsByOrder = ReturnRequest::with('orderItem')
            ->whereIn('order_id', $tripOrderIds)
            ->where('status', ReturnStatusList::$rApproved)
            ->get()
            ->groupBy('order_id');

        foreach ($approvedReturnsByOrder as $orderId => $returns) {
            if (CreditNote::where('order_id', $orderId)->where('reason_type', 'return')->exists()) continue;

            $totalAmount = round($returns->sum(fn ($r) => (float) ($r->orderItem->refund_amount ?? 0)), 2);
            if ($totalAmount <= 0) continue;

            $order = Order::find($orderId);

            $cn = CreditNote::create([
                'credit_note_no'      => CommonHelper::nextCreditNoteNumber($seller),
                'seller_id'           => $seller->id,
                'driver_settlement_id'=> $type === 'driver' ? $settlement->id : null,
                'order_id'            => $orderId,
                'retailer_id'         => $order->user_id ?? null,
                'reason_type'         => 'return',
                'total_amount'        => $totalAmount,
                'generated_at'        => Carbon::now(),
                'generated_by'        => auth()->id(),
            ]);

            foreach ($returns as $r) {
                CreditNoteItem::create([
                    'credit_note_id' => $cn->id,
                    'order_item_id'  => $r->order_item_id,
                    'product_name'   => $r->orderItem->product_name ?? null,
                    'variant_name'   => $r->orderItem->variant_name ?? null,
                    'quantity'       => 1,
                    'amount'         => round((float) ($r->orderItem->refund_amount ?? 0), 2),
                ]);
            }

            $generatedNos[] = $cn->credit_note_no;
        }

        // Cancels — driver trips with a loading slip only, matching the Cancel Invoices tab's own scope.
        if ($type === 'driver' && $settlement->loading_slip_id) {
            $cancelledOrders = Order::with('items')
                ->whereIn('id', $tripOrderIds)
                ->where('active_status', \App\Models\OrderStatusList::$cancelled)
                ->get();

            foreach ($cancelledOrders as $order) {
                if (CreditNote::where('order_id', $order->id)->where('reason_type', 'cancel')->exists()) continue;
                if ((float) $order->final_total <= 0) continue;

                $cn = CreditNote::create([
                    'credit_note_no'      => CommonHelper::nextCreditNoteNumber($seller),
                    'seller_id'           => $seller->id,
                    'driver_settlement_id'=> $settlement->id,
                    'order_id'            => $order->id,
                    'retailer_id'         => $order->user_id,
                    'reason_type'         => 'cancel',
                    'total_amount'        => round((float) $order->final_total, 2),
                    'generated_at'        => Carbon::now(),
                    'generated_by'        => auth()->id(),
                ]);

                foreach ($order->items as $item) {
                    CreditNoteItem::create([
                        'credit_note_id' => $cn->id,
                        'order_item_id'  => $item->id,
                        'product_name'   => $item->product_name,
                        'variant_name'   => $item->variant_name,
                        'quantity'       => (float) $item->quantity,
                        'amount'         => round((float) $item->sub_total, 2),
                    ]);
                }

                $generatedNos[] = $cn->credit_note_no;
            }
        }

        return $generatedNos;
    }

    /**
     * POST /seller/trips/{id}/close  (updated)
     * Query: type=driver|salesman. Sets settlement status → reconciled.
     */
    public function sellerCloseTripUpdated(Request $request, int $id)
    {
        $seller = $this->currentSeller();
        if (!$seller) return CommonHelper::responseError('seller_not_found');

        $type = $request->input('type', 'driver');

        if ($type === 'salesman') {
            $settlement = SalesmanSettlement::find($id);
            if (!$settlement || !Salesman::where('id', $settlement->salesman_id)->where('seller_id', $seller->id)->exists()) {
                return CommonHelper::responseError('settlement_not_found');
            }
        } else {
            $settlement = DriverSettlement::find($id);
            if (!$settlement || !DeliveryBoy::where('id', $settlement->delivery_boy_id)->where('seller_id', $seller->id)->exists()) {
                return CommonHelper::responseError('settlement_not_found');
            }
        }
        $payments = $type === 'salesman'
            ? OrderPayment::where('salesman_id', $settlement->salesman_id)
                ->whereDate('created_at', $settlement->settlement_date instanceof \Carbon\Carbon
                    ? $settlement->settlement_date->toDateString()
                    : (string) $settlement->settlement_date)
                ->get()
            : $this->paymentsForDriverSettlement($settlement);

        if ($settlement->status === 'reconciled') {
            // Allow re-close only when new payments arrived after the last reconciliation
            $reconciledAt = $settlement->reconciled_at
                ? Carbon::parse($settlement->reconciled_at)
                : Carbon::parse('2000-01-01');
            $hasNew = $payments->filter(fn ($p) => Carbon::parse($p->created_at)->gt($reconciledAt))->isNotEmpty();
            if (!$hasNew) {
                return CommonHelper::responseError('trip_already_closed');
            }
        }

        // Only digital payments (UPI / cheque / signature) require explicit verification.
        // Cash is reconciled via the cash_received input below.
        $unverifiedDigital = $payments->whereIn('method', ['upi', 'cheque', 'signature'])
                                       ->where('status', 'pending')->count();
        if ($unverifiedDigital > 0) {
            return CommonHelper::responseError("{$unverifiedDigital} digital payment(s) still pending verification");
        }

        // Same gate as above, server-side: close must not go through while any
        // shortfall item or cancelled order on this trip is still unacknowledged.
        // Re-checked here independent of the client, same as the digital-payment gate.
        if ($type === 'driver' && $settlement->loading_slip_id) {
            $tripOrderIdsForGate = Order::where('loading_slip_id', $settlement->loading_slip_id)->pluck('id');

            $unverifiedPartial = OrderItem::whereIn('order_id', $tripOrderIdsForGate)
                ->whereNotNull('delivered_quantity')
                ->whereColumn('delivered_quantity', '<', 'quantity')
                ->whereNull('shortfall_verified_at')
                ->count();
            if ($unverifiedPartial > 0) {
                return CommonHelper::responseError("{$unverifiedPartial} partial invoice item(s) still pending verification");
            }

            $unverifiedCancel = Order::whereIn('id', $tripOrderIdsForGate)
                ->where('active_status', \App\Models\OrderStatusList::$cancelled)
                ->whereNull('cancel_verified_at')
                ->count();
            if ($unverifiedCancel > 0) {
                return CommonHelper::responseError("{$unverifiedCancel} cancelled invoice(s) still pending verification");
            }
        }

        // Reconcile cash inline so the distributor closes in a single action.
        // Auto-set cash_received from actual cash payments — no manual input needed
        $cashCollected = round($payments->where('method', 'cash')->sum('amount'), 2);
        if ($cashCollected > 0) {
            $settlement->cash_received         = $cashCollected;
            $settlement->reconciliation_status = 'full_match';
        } else {
            $settlement->reconciliation_status = 'full_match';
        }

        $settlement->status        = 'reconciled';
        $settlement->reconciled_at = Carbon::now();
        $settlement->reconciled_by = auth()->id();
        $settlement->save();

        $creditNoteNos = $this->generateCreditNotesForTripClose($settlement, $type, $seller);

        return CommonHelper::responseSuccessWithData('trip_closed', ['credit_notes' => $creditNoteNos]);
    }
}
