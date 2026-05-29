<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\AdminCommissionTransaction;
use App\Models\Seller;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CommissionReportsApiController extends Controller
{
    public function getCommissionReport(Request $request)
    {
        $startDate = $request->filled('startDate') ? Carbon::parse($request->input('startDate'))->startOfDay() : null;
        $endDate = $request->filled('endDate') ? Carbon::parse($request->input('endDate'))->endOfDay() : null;
        $seller = $request->input('seller');

        $sellers = Seller::orderBy('id', 'DESC')->get()->makeHidden(['translations'])->toArray();

        $query = AdminCommissionTransaction::select(
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
            ->join('sellers', 'sellers.id', '=', 'admin_commission_transactions.seller_id');

        if ($startDate && $endDate) {
            $query->whereBetween('admin_commission_transactions.created_at', [$startDate, $endDate]);
        }

        if (!empty($seller)) {
            $query->where('admin_commission_transactions.seller_id', $seller);
        }

        $commissionReports = $query->orderBy('admin_commission_transactions.id', 'DESC')->get();

        $commissionReports = $commissionReports->map(function ($item) {
            $item->added_date = CommonHelper::formatDate($item->created_at);
            return $item;
        });

        return response()->json([
            'error' => false,
            'data' => [
                'sellers' => $sellers,
                'commissionReports' => $commissionReports,
            ]
        ]);
    }
}
