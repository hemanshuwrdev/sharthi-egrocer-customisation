<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Seller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommissionBillingController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────────
    //  Shared helpers
    // ──────────────────────────────────────────────────────────────────────────

    private function currentSeller(): ?Seller
    {
        $admin = auth()->user();
        if (!$admin) return null;
        return Seller::where('admin_id', $admin->id)->first();
    }

    /**
     * Base query: order_items joined with orders, filtered by seller and delivered status.
     * Optionally filtered by date range on orders.created_at.
     */
    private function orderItemsQuery(int $sellerId, ?Carbon $from = null, ?Carbon $to = null)
    {
        $q = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $sellerId)
            ->where('orders.active_status', 6) // delivered
            ->whereNotIn('order_items.active_status', [7, 8]); // exclude cancelled/returned

        if ($from) $q->where('orders.created_at', '>=', $from);
        if ($to)   $q->where('orders.created_at', '<=', $to);

        return $q;
    }

    private function gmv(int $sellerId, ?Carbon $from = null, ?Carbon $to = null): float
    {
        return (float) $this->orderItemsQuery($sellerId, $from, $to)->sum('order_items.sub_total');
    }

    private function commissionEarned(int $sellerId, float $commissionRate, ?Carbon $from = null, ?Carbon $to = null): float
    {
        $gmv = $this->gmv($sellerId, $from, $to);
        return round($gmv * $commissionRate / 100, 2);
    }

    private function orderCount(int $sellerId, ?Carbon $from = null, ?Carbon $to = null): int
    {
        return (int) $this->orderItemsQuery($sellerId, $from, $to)
            ->distinct('order_items.order_id')
            ->count('order_items.order_id');
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Distributor endpoint
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /seller/billing
     * Distributor billing overview — GMV card, charges card, period history.
     *
     * Query params:
     *   period  = monthly (default) | quarterly | yearly
     *   limit   = rows per page (default 12)
     *   offset  = pagination offset (default 0)
     */
    public function sellerBilling(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $commissionRate = (float) $seller->commission;

        $period = in_array($request->input('period'), ['monthly', 'quarterly', 'yearly'])
            ? $request->input('period')
            : 'monthly';

        $now = Carbon::now();

        [$curStart, $curEnd, $prevStart, $prevEnd] = $this->periodWindows($now, $period);

        $gmvCurrent  = $this->gmv($seller->id, $curStart, $curEnd);
        $gmvPrevious = $this->gmv($seller->id, $prevStart, $prevEnd);
        $commCurrent = $this->commissionEarned($seller->id, $commissionRate, $curStart, $curEnd);

        $changePercent = $gmvPrevious > 0
            ? round((($gmvCurrent - $gmvPrevious) / $gmvPrevious) * 100, 1)
            : null;

        $elapsed   = max(1, $curStart->diffInDays($now) + 1);
        $totalDays = max(1, $curStart->diffInDays($curEnd) + 1);
        $predicted = round(($gmvCurrent / $elapsed) * $totalDays, 2);

        $ordersCurrent = $this->orderCount($seller->id, $curStart, $curEnd);

        // ── Period history table ──────────────────────────────────────────────
        $limit  = (int) $request->input('limit', 12);
        $offset = (int) $request->input('offset', 0);

        [$groupExpr, $labelExpr, $sortExpr] = $this->periodGroupExpressions($period);

        $rows = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller->id)
            ->where('orders.active_status', 6)
            ->whereNotIn('order_items.active_status', [7, 8])
            ->selectRaw("
                {$groupExpr} as period_key,
                {$labelExpr} as period_label,
                COUNT(DISTINCT order_items.order_id) as total_orders,
                SUM(order_items.sub_total) as gross_gmv
            ")
            ->groupByRaw($groupExpr)
            ->orderByRaw("{$sortExpr} DESC")
            ->offset($offset)
            ->limit($limit)
            ->get()
            ->map(fn ($r) => [
                'period_key'   => $r->period_key,
                'period_label' => $r->period_label,
                'total_orders' => (int) $r->total_orders,
                'gross_gmv'    => round((float) $r->gross_gmv, 2),
                'net_charges'  => round((float) $r->gross_gmv * $commissionRate / 100, 2),
            ]);

        $totalPeriods = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller->id)
            ->where('orders.active_status', 6)
            ->whereNotIn('order_items.active_status', [7, 8])
            ->selectRaw("COUNT(DISTINCT {$groupExpr}) as cnt")
            ->value('cnt');

        return CommonHelper::responseWithData([
            'commission_rate' => $commissionRate,
            'period'          => $period,
            'gmv_card' => [
                'current'        => round($gmvCurrent,  2),
                'previous'       => round($gmvPrevious, 2),
                'change_percent' => $changePercent,
                'predicted_next' => $predicted,
            ],
            'charges_card' => [
                'current'      => round($commCurrent, 2),
                'total_orders' => $ordersCurrent,
            ],
            'history' => [
                'total' => (int) $totalPeriods,
                'data'  => $rows,
            ],
        ]);
    }

    private function periodWindows(Carbon $now, string $period): array
    {
        switch ($period) {
            case 'quarterly':
                $curStart  = $now->copy()->firstOfQuarter()->startOfDay();
                $curEnd    = $now->copy()->lastOfQuarter()->endOfDay();
                $prevStart = $curStart->copy()->subQuarter()->firstOfQuarter()->startOfDay();
                $prevEnd   = $curStart->copy()->subDay()->endOfDay();
                break;
            case 'yearly':
                $curStart  = $now->copy()->startOfYear();
                $curEnd    = $now->copy()->endOfYear();
                $prevStart = $now->copy()->subYear()->startOfYear();
                $prevEnd   = $now->copy()->subYear()->endOfYear();
                break;
            default: // monthly
                $curStart  = $now->copy()->startOfMonth();
                $curEnd    = $now->copy()->endOfMonth();
                $prevStart = $now->copy()->subMonth()->startOfMonth();
                $prevEnd   = $now->copy()->subMonth()->endOfMonth();
        }
        return [$curStart, $curEnd, $prevStart, $prevEnd];
    }

    private function periodGroupExpressions(string $period): array
    {
        switch ($period) {
            case 'quarterly':
                return [
                    "CONCAT(YEAR(orders.created_at), '-Q', QUARTER(orders.created_at))",
                    "CONCAT('Q', QUARTER(orders.created_at), ' ', YEAR(orders.created_at))",
                    "CONCAT(YEAR(orders.created_at), QUARTER(orders.created_at))",
                ];
            case 'yearly':
                return [
                    "YEAR(orders.created_at)",
                    "YEAR(orders.created_at)",
                    "YEAR(orders.created_at)",
                ];
            default: // monthly
                return [
                    "DATE_FORMAT(orders.created_at, '%Y-%m')",
                    "DATE_FORMAT(orders.created_at, '%M %Y')",
                    "DATE_FORMAT(orders.created_at, '%Y-%m')",
                ];
        }
    }

    /**
     * GET /seller/billing/transactions
     * Paginated delivered order items for a date window.
     */
    public function sellerBillingTransactions(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $commissionRate = (float) $seller->commission;
        $from  = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
        $to    = $request->filled('end_date')   ? Carbon::parse($request->end_date)->endOfDay()     : null;
        $limit  = (int) $request->input('limit', 20);
        $offset = (int) $request->input('offset', 0);

        $query = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller->id)
            ->where('orders.active_status', 6)
            ->whereNotIn('order_items.active_status', [7, 8])
            ->select(
                'order_items.id',
                'order_items.order_id',
                'order_items.product_name',
                'order_items.variant_name',
                'order_items.quantity',
                'order_items.sub_total as order_item_amount',
                'orders.created_at'
            )
            ->orderByDesc('order_items.id');

        if ($from) $query->where('orders.created_at', '>=', $from);
        if ($to)   $query->where('orders.created_at', '<=', $to);

        $total = (clone $query)->count();
        $rows  = $query->offset($offset)->limit($limit)->get()
            ->map(fn ($t) => [
                'id'                          => $t->id,
                'order_id'                    => $t->order_id,
                'product_name'                => $t->product_name,
                'variant_name'                => $t->variant_name,
                'quantity'                    => $t->quantity,
                'order_item_amount'           => round((float) $t->order_item_amount, 2),
                'commission_amount'           => round((float) $t->order_item_amount * $commissionRate / 100, 2),
                'seller_commission_percentage'=> $commissionRate,
                'added_date'                  => CommonHelper::formatDate($t->created_at),
            ]);

        return CommonHelper::responseWithData(['total' => $total, 'data' => $rows]);
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Admin endpoints
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /admin/commissions/aggregate
     */
    public function adminAggregate(Request $request)
    {
        $period = in_array($request->input('period'), ['monthly', 'quarterly', 'yearly'])
            ? $request->input('period')
            : 'monthly';

        $now = Carbon::now();
        [$curStart, $curEnd, $prevStart, $prevEnd] = $this->periodWindows($now, $period);

        $baseQ = fn ($from, $to) => DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('sellers', 'sellers.id', '=', 'order_items.seller_id')
            ->where('orders.active_status', 6)
            ->whereNotIn('order_items.active_status', [7, 8])
            ->where('orders.created_at', '>=', $from)
            ->where('orders.created_at', '<=', $to);

        $gmvCurrent  = (float) $baseQ($curStart, $curEnd)->sum('order_items.sub_total');
        $gmvPrevious = (float) $baseQ($prevStart, $prevEnd)->sum('order_items.sub_total');
        $commCurrent = (float) $baseQ($curStart, $curEnd)
            ->selectRaw('SUM(order_items.sub_total * sellers.commission / 100) as comm')
            ->value('comm');

        $changePercent = $gmvPrevious > 0
            ? round((($gmvCurrent - $gmvPrevious) / $gmvPrevious) * 100, 1)
            : null;

        $elapsed   = max(1, $curStart->diffInDays($now) + 1);
        $totalDays = max(1, $curStart->diffInDays($curEnd) + 1);
        $predicted = round(($gmvCurrent / $elapsed) * $totalDays, 2);

        $ordersCurrent = (int) DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.active_status', 6)
            ->whereNotIn('order_items.active_status', [7, 8])
            ->where('orders.created_at', '>=', $curStart)
            ->where('orders.created_at', '<=', $curEnd)
            ->distinct('order_items.order_id')
            ->count('order_items.order_id');

        return CommonHelper::responseWithData([
            'period'   => $period,
            'gmv_card' => [
                'current'        => round($gmvCurrent,  2),
                'previous'       => round($gmvPrevious, 2),
                'change_percent' => $changePercent,
                'predicted_next' => $predicted,
            ],
            'charges_card' => [
                'current'      => round($commCurrent, 2),
                'total_orders' => $ordersCurrent,
            ],
        ]);
    }

    /**
     * GET /admin/commissions/summary
     */
    public function adminSummary(Request $request)
    {
        $monthStart = Carbon::now()->startOfMonth();
        $monthEnd   = Carbon::now()->endOfMonth();

        $query = Seller::select('id', 'name', 'mobile', 'commission')
            ->where('status', 1);

        if ($request->filled('seller_id')) {
            $query->where('id', $request->seller_id);
        }

        $sellers = $query->orderBy('name')->get();

        $data = $sellers->map(function ($seller) use ($monthStart, $monthEnd) {
            $rate = (float) $seller->commission;

            $gmvMonth = $this->gmv($seller->id, $monthStart, $monthEnd);
            $gmvAll   = $this->gmv($seller->id);
            $commMonth = $this->commissionEarned($seller->id, $rate, $monthStart, $monthEnd);
            $commAll   = $this->commissionEarned($seller->id, $rate);

            return [
                'seller_id'               => $seller->id,
                'name'                    => $seller->name,
                'mobile'                  => $seller->mobile,
                'commission_rate'         => $rate,
                'gmv_this_month'          => round($gmvMonth, 2),
                'commission_this_month'   => round($commMonth, 2),
                'gmv_all_time'            => round($gmvAll,   2),
                'commission_all_time'     => round($commAll,  2),
            ];
        });

        return CommonHelper::responseWithData(['total' => $data->count(), 'data' => $data]);
    }

    /**
     * GET /admin/commissions
     */
    public function adminTransactions(Request $request)
    {
        $query = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('sellers', 'sellers.id', '=', 'order_items.seller_id')
            ->where('orders.active_status', 6)
            ->whereNotIn('order_items.active_status', [7, 8])
            ->select(
                'order_items.id',
                'order_items.order_id',
                'order_items.seller_id',
                'sellers.name as seller_name',
                'sellers.commission as seller_commission_percentage',
                'order_items.product_name',
                'order_items.variant_name',
                'order_items.quantity',
                'order_items.sub_total as order_item_amount',
                DB::raw('order_items.sub_total * sellers.commission / 100 as commission_amount'),
                'orders.created_at'
            )
            ->orderByDesc('order_items.id');

        if ($request->filled('seller_id')) {
            $query->where('order_items.seller_id', $request->seller_id);
        }
        if ($request->filled('start_date')) {
            $query->where('orders.created_at', '>=', Carbon::parse($request->start_date)->startOfDay());
        }
        if ($request->filled('end_date')) {
            $query->where('orders.created_at', '<=', Carbon::parse($request->end_date)->endOfDay());
        }

        $total  = (clone $query)->count();
        $limit  = (int) $request->input('limit', 20);
        $offset = (int) $request->input('offset', 0);

        $rows = $query->offset($offset)->limit($limit)->get()
            ->map(fn ($t) => [
                'id'                          => $t->id,
                'order_id'                    => $t->order_id,
                'seller_id'                   => $t->seller_id,
                'seller_name'                 => $t->seller_name,
                'product_name'                => $t->product_name,
                'variant_name'                => $t->variant_name,
                'quantity'                    => $t->quantity,
                'order_item_amount'           => round((float) $t->order_item_amount, 2),
                'commission_amount'           => round((float) $t->commission_amount, 2),
                'seller_commission_percentage'=> (float) $t->seller_commission_percentage,
                'added_date'                  => CommonHelper::formatDate($t->created_at),
            ]);

        return CommonHelper::responseWithData(['total' => $total, 'data' => $rows]);
    }

    /**
     * GET /admin/commissions/distributor/{seller_id}
     */
    public function adminDistributorDetail(Request $request, int $sellerId)
    {
        $seller = Seller::find($sellerId);
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $rate       = (float) $seller->commission;
        $today      = Carbon::today();
        $monthStart = Carbon::now()->startOfMonth();
        $monthEnd   = Carbon::now()->endOfMonth();

        $from = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
        $to   = $request->filled('end_date')   ? Carbon::parse($request->end_date)->endOfDay()   : null;

        $limit  = (int) $request->input('limit', 20);
        $offset = (int) $request->input('offset', 0);

        $txQuery = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $sellerId)
            ->where('orders.active_status', 6)
            ->whereNotIn('order_items.active_status', [7, 8])
            ->select(
                'order_items.id',
                'order_items.order_id',
                'order_items.product_name',
                'order_items.variant_name',
                'order_items.quantity',
                'order_items.sub_total as order_item_amount',
                DB::raw("order_items.sub_total * {$rate} / 100 as commission_amount"),
                'orders.created_at'
            )
            ->orderByDesc('order_items.id');

        if ($from) $txQuery->where('orders.created_at', '>=', $from);
        if ($to)   $txQuery->where('orders.created_at', '<=', $to);

        $totalTx = (clone $txQuery)->count();
        $transactions = $txQuery->offset($offset)->limit($limit)->get()
            ->map(fn ($t) => [
                'id'                          => $t->id,
                'order_id'                    => $t->order_id,
                'product_name'                => $t->product_name,
                'variant_name'                => $t->variant_name,
                'quantity'                    => $t->quantity,
                'order_item_amount'           => round((float) $t->order_item_amount, 2),
                'commission_amount'           => round((float) $t->commission_amount, 2),
                'seller_commission_percentage'=> $rate,
                'added_date'                  => CommonHelper::formatDate($t->created_at),
            ]);

        return CommonHelper::responseWithData([
            'seller' => [
                'id'              => $seller->id,
                'name'            => $seller->name,
                'mobile'          => $seller->mobile,
                'commission_rate' => $rate,
            ],
            'gmv' => [
                'today'      => round($this->gmv($sellerId, $today->copy()->startOfDay(), $today->copy()->endOfDay()), 2),
                'this_month' => round($this->gmv($sellerId, $monthStart, $monthEnd), 2),
                'all_time'   => round($this->gmv($sellerId), 2),
            ],
            'commission_earned' => [
                'today'      => round($this->commissionEarned($sellerId, $rate, $today->copy()->startOfDay(), $today->copy()->endOfDay()), 2),
                'this_month' => round($this->commissionEarned($sellerId, $rate, $monthStart, $monthEnd), 2),
                'all_time'   => round($this->commissionEarned($sellerId, $rate), 2),
            ],
            'transactions' => [
                'total' => $totalTx,
                'data'  => $transactions,
            ],
        ]);
    }
}
