<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\AdminCommissionTransaction;
use App\Models\Seller;
use Carbon\Carbon;
use Illuminate\Http\Request;

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
     * GMV = SUM(order_item_amount) from admin_commission_transactions for a seller.
     * order_item_amount is the gross item value before commission deduction.
     */
    private function gmv(int $sellerId, ?Carbon $from = null, ?Carbon $to = null): float
    {
        $q = AdminCommissionTransaction::where('seller_id', $sellerId);

        if ($from) $q->where('created_at', '>=', $from);
        if ($to)   $q->where('created_at', '<=', $to);

        return (float) $q->sum('order_item_amount');
    }

    /**
     * Commission earned (admin's share) from admin_commission_transactions.
     */
    private function commissionEarned(int $sellerId, ?Carbon $from = null, ?Carbon $to = null): float
    {
        $q = AdminCommissionTransaction::where('seller_id', $sellerId);

        if ($from) $q->where('created_at', '>=', $from);
        if ($to)   $q->where('created_at', '<=', $to);

        return (float) $q->sum('amount');
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

        $period = in_array($request->input('period'), ['monthly', 'quarterly', 'yearly'])
            ? $request->input('period')
            : 'monthly';

        $now = Carbon::now();

        // ── Current-period window for stat cards ─────────────────────────────
        [$curStart, $curEnd, $prevStart, $prevEnd] = $this->periodWindows($now, $period);

        $gmvCurrent  = $this->gmv($seller->id, $curStart, $curEnd);
        $gmvPrevious = $this->gmv($seller->id, $prevStart, $prevEnd);
        $commCurrent = $this->commissionEarned($seller->id, $curStart, $curEnd);

        $changePercent = $gmvPrevious > 0
            ? round((($gmvCurrent - $gmvPrevious) / $gmvPrevious) * 100, 1)
            : null;

        // Predict next period by prorating current elapsed days
        $elapsed    = max(1, $curStart->diffInDays($now) + 1);
        $totalDays  = max(1, $curStart->diffInDays($curEnd) + 1);
        $predicted  = round(($gmvCurrent / $elapsed) * $totalDays, 2);

        $ordersCurrent = AdminCommissionTransaction::where('seller_id', $seller->id)
            ->where('created_at', '>=', $curStart)
            ->where('created_at', '<=', $curEnd)
            ->distinct('order_id')
            ->count('order_id');

        // ── Period history table ──────────────────────────────────────────────
        $limit  = (int) $request->input('limit', 12);
        $offset = (int) $request->input('offset', 0);

        [$groupExpr, $labelExpr, $sortExpr] = $this->periodGroupExpressions($period);

        $rows = AdminCommissionTransaction::selectRaw(
                "$groupExpr as period_key,
                 $labelExpr as period_label,
                 COUNT(DISTINCT order_id) as total_orders,
                 SUM(order_item_amount)   as gross_gmv,
                 SUM(amount)              as net_charges"
            )
            ->where('seller_id', $seller->id)
            ->groupByRaw($groupExpr)
            ->orderByRaw("$sortExpr DESC")
            ->offset($offset)
            ->limit($limit)
            ->get()
            ->map(fn ($r) => [
                'period_key'   => $r->period_key,
                'period_label' => $r->period_label,
                'total_orders' => (int) $r->total_orders,
                'gross_gmv'    => round((float) $r->gross_gmv, 2),
                'net_charges'  => round((float) $r->net_charges, 2),
            ]);

        $totalPeriods = AdminCommissionTransaction::selectRaw(
                "COUNT(DISTINCT $groupExpr) as cnt"
            )
            ->where('seller_id', $seller->id)
            ->value('cnt');

        return CommonHelper::responseWithData([
            'commission_rate' => (float) $seller->commission,
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
                    "CONCAT(YEAR(created_at), '-Q', QUARTER(created_at))",
                    "CONCAT('Q', QUARTER(created_at), ' ', YEAR(created_at))",
                    "CONCAT(YEAR(created_at), QUARTER(created_at))",
                ];
            case 'yearly':
                return [
                    "YEAR(created_at)",
                    "YEAR(created_at)",
                    "YEAR(created_at)",
                ];
            default: // monthly
                return [
                    "DATE_FORMAT(created_at, '%Y-%m')",
                    "DATE_FORMAT(created_at, '%M %Y')",
                    "DATE_FORMAT(created_at, '%Y-%m')",
                ];
        }
    }

    /**
     * GET /seller/billing/transactions
     * Paginated raw transactions for a date window (used by the detail drawer).
     * Query: start_date, end_date (Y-m-d), limit, offset.
     */
    public function sellerBillingTransactions(Request $request)
    {
        $seller = $this->currentSeller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $from  = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
        $to    = $request->filled('end_date')   ? Carbon::parse($request->end_date)->endOfDay()     : null;
        $limit  = (int) $request->input('limit', 20);
        $offset = (int) $request->input('offset', 0);

        $query = AdminCommissionTransaction::where('seller_id', $seller->id)
            ->orderByDesc('created_at');

        if ($from) $query->where('created_at', '>=', $from);
        if ($to)   $query->where('created_at', '<=', $to);

        $total = (clone $query)->count();
        $rows  = $query->offset($offset)->limit($limit)
            ->select('id', 'order_id', 'order_item_id', 'seller_commission_percentage',
                     'order_item_amount', 'amount as commission_amount', 'created_at')
            ->get()
            ->map(fn ($t) => array_merge($t->toArray(), [
                'added_date' => CommonHelper::formatDate($t->created_at),
            ]));

        return CommonHelper::responseWithData(['total' => $total, 'data' => $rows]);
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Admin endpoints
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /admin/commissions/aggregate
     * Platform-wide aggregate stat cards for the selected period (mirrors sellerBilling but across ALL sellers).
     * Query: period = monthly (default) | quarterly | yearly
     */
    public function adminAggregate(Request $request)
    {
        $period = in_array($request->input('period'), ['monthly', 'quarterly', 'yearly'])
            ? $request->input('period')
            : 'monthly';

        $now = Carbon::now();
        [$curStart, $curEnd, $prevStart, $prevEnd] = $this->periodWindows($now, $period);

        $gmvCurrent  = (float) AdminCommissionTransaction::where('created_at', '>=', $curStart)->where('created_at', '<=', $curEnd)->sum('order_item_amount');
        $gmvPrevious = (float) AdminCommissionTransaction::where('created_at', '>=', $prevStart)->where('created_at', '<=', $prevEnd)->sum('order_item_amount');
        $commCurrent = (float) AdminCommissionTransaction::where('created_at', '>=', $curStart)->where('created_at', '<=', $curEnd)->sum('amount');

        $changePercent = $gmvPrevious > 0
            ? round((($gmvCurrent - $gmvPrevious) / $gmvPrevious) * 100, 1)
            : null;

        $elapsed   = max(1, $curStart->diffInDays($now) + 1);
        $totalDays = max(1, $curStart->diffInDays($curEnd) + 1);
        $predicted = round(($gmvCurrent / $elapsed) * $totalDays, 2);

        $ordersCurrent = AdminCommissionTransaction::where('created_at', '>=', $curStart)
            ->where('created_at', '<=', $curEnd)
            ->distinct('order_id')
            ->count('order_id');

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
     * Per-distributor summary: commission%, GMV this month, commission earned this month, GMV all-time.
     * Optional query: seller_id for single distributor.
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
            $gmvMonth = $this->gmv($seller->id, $monthStart, $monthEnd);
            $gmvAll   = $this->gmv($seller->id);
            $commMonth = $this->commissionEarned($seller->id, $monthStart, $monthEnd);
            $commAll   = $this->commissionEarned($seller->id);

            return [
                'seller_id'           => $seller->id,
                'name'                => $seller->name,
                'mobile'              => $seller->mobile,
                'commission_rate'     => (float) $seller->commission,
                'gmv_this_month'      => round($gmvMonth, 2),
                'commission_this_month' => round($commMonth, 2),
                'gmv_all_time'        => round($gmvAll, 2),
                'commission_all_time' => round($commAll, 2),
            ];
        });

        return CommonHelper::responseWithData(['total' => $data->count(), 'data' => $data]);
    }

    /**
     * GET /admin/commissions
     * All commission transactions with filters.
     * Optional query: seller_id, start_date, end_date (Y-m-d), limit, offset.
     */
    public function adminTransactions(Request $request)
    {
        $query = AdminCommissionTransaction::with([])
            ->join('sellers', 'sellers.id', '=', 'admin_commission_transactions.seller_id')
            ->select(
                'admin_commission_transactions.id',
                'admin_commission_transactions.order_id',
                'admin_commission_transactions.order_item_id',
                'admin_commission_transactions.seller_id',
                'sellers.name as seller_name',
                'admin_commission_transactions.seller_commission_percentage',
                'admin_commission_transactions.order_item_amount',
                'admin_commission_transactions.amount as commission_amount',
                'admin_commission_transactions.created_at'
            )
            ->orderByDesc('admin_commission_transactions.id');

        if ($request->filled('seller_id')) {
            $query->where('admin_commission_transactions.seller_id', $request->seller_id);
        }
        if ($request->filled('start_date')) {
            $query->where('admin_commission_transactions.created_at', '>=',
                Carbon::parse($request->start_date)->startOfDay());
        }
        if ($request->filled('end_date')) {
            $query->where('admin_commission_transactions.created_at', '<=',
                Carbon::parse($request->end_date)->endOfDay());
        }

        $total  = (clone $query)->count();
        $limit  = (int) $request->input('limit', 20);
        $offset = (int) $request->input('offset', 0);

        $rows = $query->offset($offset)->limit($limit)->get()
            ->map(fn ($t) => array_merge($t->toArray(), [
                'added_date' => CommonHelper::formatDate($t->created_at),
            ]));

        return CommonHelper::responseWithData(['total' => $total, 'data' => $rows]);
    }

    /**
     * GET /admin/commissions/distributor/{seller_id}
     * Single distributor deep dive: overview + full transaction history.
     * Optional query: start_date, end_date, limit, offset.
     */
    public function adminDistributorDetail(Request $request, int $sellerId)
    {
        $seller = Seller::find($sellerId);
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $today      = Carbon::today();
        $monthStart = Carbon::now()->startOfMonth();
        $monthEnd   = Carbon::now()->endOfMonth();

        $from = $request->filled('start_date') ? Carbon::parse($request->start_date)->startOfDay() : null;
        $to   = $request->filled('end_date')   ? Carbon::parse($request->end_date)->endOfDay()   : null;

        $limit  = (int) $request->input('limit', 20);
        $offset = (int) $request->input('offset', 0);

        $txQuery = AdminCommissionTransaction::where('seller_id', $sellerId)
            ->orderByDesc('created_at');

        if ($from) $txQuery->where('created_at', '>=', $from);
        if ($to)   $txQuery->where('created_at', '<=', $to);

        $totalTx = (clone $txQuery)->count();
        $transactions = $txQuery->offset($offset)->limit($limit)
            ->select('id', 'order_id', 'order_item_id', 'seller_commission_percentage',
                     'order_item_amount', 'amount as commission_amount', 'created_at')
            ->get()
            ->map(fn ($t) => array_merge($t->toArray(), [
                'added_date' => CommonHelper::formatDate($t->created_at),
            ]));

        return CommonHelper::responseWithData([
            'seller' => [
                'id'              => $seller->id,
                'name'            => $seller->name,
                'mobile'          => $seller->mobile,
                'commission_rate' => (float) $seller->commission,
            ],
            'gmv' => [
                'today'      => round($this->gmv($sellerId, $today->copy()->startOfDay(), $today->copy()->endOfDay()), 2),
                'this_month' => round($this->gmv($sellerId, $monthStart, $monthEnd), 2),
                'all_time'   => round($this->gmv($sellerId), 2),
            ],
            'commission_earned' => [
                'today'      => round($this->commissionEarned($sellerId, $today->copy()->startOfDay(), $today->copy()->endOfDay()), 2),
                'this_month' => round($this->commissionEarned($sellerId, $monthStart, $monthEnd), 2),
                'all_time'   => round($this->commissionEarned($sellerId), 2),
            ],
            'transactions' => [
                'total' => $totalTx,
                'data'  => $transactions,
            ],
        ]);
    }
}
