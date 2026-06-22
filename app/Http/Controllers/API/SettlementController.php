<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\DeliveryBoy;
use App\Models\DriverSettlement;
use App\Models\LoadingSlip;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\Seller;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SettlementController extends Controller
{
    private const METHODS = ['cash', 'upi', 'cheque', 'signature'];

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
    private function sellerEnabledMethods(Seller $seller): array
    {
        $adminEnabled = $this->adminEnabledMethods();
        return array_filter($adminEnabled, fn ($m) => (int) ($seller->{'payment_method_' . $m} ?? 0) === 1);
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
            return [
                'method'      => $m,
                'is_enabled'  => $adminOn && (int) ($seller->{'payment_method_' . $m} ?? 0) === 1,
                'is_editable' => $adminOn, // false = admin disabled, shown greyed-out
            ];
        }, self::METHODS);

        return CommonHelper::responseWithData(['methods' => array_values($data)]);
    }

    /**
     * POST /seller/payment_methods/save
     * Body: { cash: 0|1, upi: 0|1, cheque: 0|1, signature: 0|1 }
     * Silently ignores values for methods admin has disabled.
     */
    public function sellerSavePaymentMethods(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $validator = Validator::make($request->all(), [
            'cash'      => 'required|in:0,1',
            'upi'       => 'required|in:0,1',
            'cheque'    => 'required|in:0,1',
            'signature' => 'required|in:0,1',
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

        $payment = OrderPayment::whereHas('deliveryBoy', fn ($q) => $q->where('seller_id', $seller->id))
            ->find($request->payment_id);

        if (!$payment) {
            return CommonHelper::responseError('payment_not_found');
        }
        if ($payment->status === 'verified') {
            return CommonHelper::responseError('already_verified');
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
                $orderIds        = Order::where('loading_slip_id', $slip->id)->pluck('id');
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
            'cash'      => ['requires_amount' => true, 'requires_photo' => false, 'photo_label' => null],
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
        } catch (\Throwable $e) {
            Log::error('collectPayment failed: ' . $e->getMessage());
            return CommonHelper::responseError('something_went_wrong');
        }

        return CommonHelper::responseWithData([
            'payment_id' => $payment->id,
            'status'     => 'pending',
            'message'    => 'payment_collected_pending_verification',
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
                'final_total'   => $order->final_total,
                'active_status' => $order->active_status,
                'retailer'      => $order->user
                    ? ['id' => $order->user->id, 'name' => $order->user->name, 'mobile' => $order->user->mobile]
                    : null,
                'payments'      => $paymentMap->get($order->id, collect())->values(),
            ];
        });

        $totalExpected   = round($orders->sum('final_total'), 2);
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

        // Recalculate cash_expected fresh
        $orders          = Order::where('loading_slip_id', $id)->get('final_total');
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
}
