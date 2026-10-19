<?php

namespace App\Http\Controllers;

use App\Helpers\CommonHelper;
use App\Http\Controllers\API\OrderStatusApiController;
use App\Models\Category;
use App\Models\City;
use App\Models\CreditNoteItem;
use App\Models\DeliveryBoy;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderPayment;
use App\Models\OrderStatusList;
use App\Models\PanelNotification;
use App\Models\ReturnStatusList;
use App\Models\SellerProduct;
use App\Models\MasterProductVariant;
use App\Models\ReturnRequest;
use App\Models\Role;
use App\Models\Seller;
use App\Models\Setting;
use App\Models\UserAddress;
use App\Services\LanguageService;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class SellerController extends BaseController
{
    public function index(Request $request)
    {
        $contentLanguage = $request->header('Content-Language');
        $useContentLanguage = $contentLanguage !== null && trim((string) $contentLanguage) !== '';

        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        $seller_id = auth()->user()->seller->id;
        $orderIds = OrderItem::where('seller_id', $seller_id)->get()->pluck('order_id')->toArray() ?? [];


        $data = array();

        $data['order_count'] = Order::whereIn('id', $orderIds)->count() ?? 0;

        $ignoreStatus = array(
            OrderStatusList::$paymentPending,
            OrderStatusList::$delivered,
            OrderStatusList::$cancelled,
            OrderStatusList::$returned,
        );
        $data['pending_order_count'] = Order::whereIn('id', $orderIds)->whereNotIn('active_status', $ignoreStatus)->count() ?? 0;

        $data['product_count'] = SellerProduct::where('seller_id', $seller_id)->where('status', 1)->count();

        $data['salesman_count'] = \App\Models\Salesman::where('seller_id', $seller_id)->count() ?? 0;

        $data['driver_count'] = DeliveryBoy::forSeller($seller_id)->count() ?? 0;

        // Retailer count is unique users ordering from this seller
        $data['retailer_count'] = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller_id)
            ->distinct('orders.user_id')
            ->count('orders.user_id') ?? 0;

        // Collections: Total cash received by delivery boys of this seller + salesmen maybe?
        // Or simply sum of delivered orders. Let's use delivered orders sub_total as total collections.
        $data['collections'] = OrderItem::where('seller_id', $seller_id)
            ->where('active_status', OrderStatusList::$delivered)
            ->sum('sub_total') ?? 0;

        $categoryIds = Seller::select('categories')->where('id', $seller_id)->value('categories') ?? "";
        $categoryIdsArray = explode(',', $categoryIds);

        $childCategoryIds = CommonHelper::getChildCategoryIds($categoryIdsArray);
        $finalCategoryIds = array_unique(array_merge($categoryIdsArray, $childCategoryIds));

        if ($childCategoryIds != "") {
            $data['category_count'] = count($finalCategoryIds);
        } else {
            $data['category_count'] = 0;
        }
        $data['sold_out_count'] = SellerProduct::where('seller_id', $seller_id)
            ->where('status', 1)
            ->where('stock', '<=', 0)
            ->count();

        $low_stock = Setting::where('variable', 'low_stock_limit')->first();
        $low_stock_limit = $low_stock ? (int) $low_stock->value : 0;

        $lowStockQuery = SellerProduct::where('seller_id', $seller_id)
            ->where('status', 1)
            ->where('stock', '>', 0);
        if ($low_stock_limit > 0) {
            $lowStockQuery->where('stock', '<=', $low_stock_limit);
        }
        $data['low_stock_count'] = $lowStockQuery->count();


        $balance = (float) Seller::where('id', $seller_id)->value('balance') ?? 0;

        $pendingWithdrawals = (float) DB::table('withdrawal_requests')
            ->where('type', 'seller')
            ->where('type_id', $seller_id)
            ->where('status', 0)
            ->sum('amount') ?? 0;

        $data['balance'] = number_format($balance - $pendingWithdrawals, 2);

        // Sarthi: distributors no longer self-select categories (that's a legacy B2C field, unset/stale
        // for Sarthi sellers — they're scoped by brand_distributor_mappings instead). So this chart is
        // built directly from whatever categories the seller's own master-catalog products actually fall
        // into, rather than filtering by the legacy Seller.categories field.
        $countRows = DB::table('categories')
            ->join('master_products', 'master_products.category_id', '=', 'categories.id')
            ->join('master_product_variants', 'master_product_variants.master_product_id', '=', 'master_products.id')
            ->join('seller_products', 'seller_products.master_product_variant_id', '=', 'master_product_variants.id')
            ->where('seller_products.seller_id', $seller_id)
            ->where('seller_products.status', 1)
            ->select('categories.id', DB::raw('COUNT(DISTINCT master_products.id) AS product_count'))
            ->groupBy('categories.id')
            ->orderBy('categories.id')
            ->get();

        $categoryIdsFromRows = $countRows->pluck('id')->toArray();
        $categoriesWithName = Category::whereIn('id', $categoryIdsFromRows)->with('translations')->get()->keyBy('id');

        if ($useContentLanguage) {
            // App: single language name (locale already set above)
            $category_product_count = $countRows->map(function ($row) use ($categoriesWithName) {
                $cat = $categoriesWithName->get($row->id);
                return [
                    'id' => $row->id,
                    'name' => $cat ? $cat->name : '',
                    'product_count' => (int) $row->product_count,
                ];
            })->values();
        } else {
            // Panel: all translations for category name (keyed by language code)
            $category_product_count = $countRows->map(function ($row) use ($categoriesWithName) {
                $cat = $categoriesWithName->get($row->id);
                $names = (object) [];
                if ($cat) {
                    $allTranslations = $cat->getAllActiveLanguageTranslations();
                    foreach ($allTranslations as $trans) {
                        $code = $trans['language_code'] ?? '';
                        if ($code !== '') {
                            $names->{$code} = $trans['name'] ?? '';
                        }
                    }
                }
                return [
                    'id' => $row->id,
                    'name' => $names,
                    'product_count' => (int) $row->product_count,
                ];
            })->values();
        }

        $data['category_product_count'] = $category_product_count;

        $year = date("Y");
        $curdate = date('Y-m-d');

        $data['weekly_sales'] = Order::select(DB::raw('ROUND(SUM(order_items.sub_total), 2) AS total_sale'), DB::raw('DATE(orders.created_at) AS order_date'))
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.seller_id', $seller_id)
            ->where(DB::raw('YEAR(orders.created_at)'), '=', $year)
            ->where(DB::raw('DATE(orders.created_at)'), '<=', $curdate)
            ->groupBy(DB::raw('DATE(orders.created_at)'))
            ->orderBy(DB::raw('DATE(orders.created_at)'), 'DESC')
            ->limit(7)->get();

        $orderIdsString = '0';
        if (count($orderIds) > 0) {
            $orderIdsString = implode(',', array_map('intval', array_unique($orderIds)));
        }
        $statusOrderCount = OrderStatusList::select(
            'order_status_lists.id',
            'order_status_lists.status',
            DB::raw('(SELECT COUNT(orders.id) FROM orders WHERE orders.active_status = order_status_lists.id AND orders.id IN (' . $orderIdsString . ') AND orders.deleted_at IS NULL) AS order_count')
        )
            ->orderBy('order_status_lists.id', 'asc')
            ->get();

        $languageService = app(LanguageService::class);
        if ($useContentLanguage) {
            $data['status_order_count'] = $statusOrderCount->map(function ($row) {
                return [
                    'id' => $row->id,
                    'status' => $row->status,
                    'order_count' => (int) $row->order_count,
                    'status_name' => OrderStatusList::getTranslatedName($row->id),
                ];
            })->values();
        } else {
            // Panel: status name in all active languages (keyed by language code)
            $activeLanguages = $languageService->getActiveLanguages();
            $data['status_order_count'] = $statusOrderCount->map(function ($row) use ($activeLanguages) {
                $statusNames = (object) [];
                $key = OrderStatusList::getTranslationKey($row->id);
                foreach ($activeLanguages as $lang) {
                    $code = $lang->code ?? '';
                    if ($code !== '' && $key !== '') {
                        app()->setLocale($code);
                        $statusNames->{$code} = __($key);
                    }
                }
                return [
                    'id' => $row->id,
                    'status' => $row->status,
                    'order_count' => (int) $row->order_count,
                    'status_name' => $statusNames,
                ];
            })->values();
        }

        // -------------------------------------------------------------
        // Enhanced Distributor Dashboard Analytics (Reference UI Support)
        // -------------------------------------------------------------
        $endDate = $request->filled('endDate') ? Carbon::parse($request->endDate)->endOfDay() : Carbon::now()->endOfDay();
        $startDate = $request->filled('startDate') ? Carbon::parse($request->startDate)->startOfDay() : Carbon::now()->subDays(29)->startOfDay();
        $diffDays = max(1, $startDate->diffInDays($endDate) + 1);

        $prevEndDate = (clone $startDate)->subDay()->endOfDay();
        $prevStartDate = (clone $prevEndDate)->subDays($diffDays - 1)->startOfDay();

        $calcGrowth = function ($current, $previous) {
            if ($previous > 0) {
                return round((($current - $previous) / $previous) * 100, 1);
            }
            return $current > 0 ? 100.0 : 0.0;
        };

        $sellerUser = auth()->user();
        $sellerModel = $sellerUser->seller;

        $currentOrderIds = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller_id)
            ->whereNull('orders.deleted_at')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->distinct()
            ->pluck('orders.id')
            ->toArray();

        $prevOrderIds = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller_id)
            ->whereNull('orders.deleted_at')
            ->whereBetween('orders.created_at', [$prevStartDate, $prevEndDate])
            ->distinct()
            ->pluck('orders.id')
            ->toArray();

        // 1. Hero KPIs
        $currentSales = (float) (Order::whereIn('id', $currentOrderIds)->sum('final_total') ?? 0);
        $prevSales = (float) (Order::whereIn('id', $prevOrderIds)->sum('final_total') ?? 0);
        $salesGrowth = $calcGrowth($currentSales, $prevSales);

        $currentInvoices = count($currentOrderIds);
        $prevInvoices = count($prevOrderIds);
        $invoicesGrowth = $calcGrowth($currentInvoices, $prevInvoices);

        $currentCollections = (float) (OrderPayment::whereIn('order_id', function ($q) use ($seller_id) {
            $q->select('order_id')->from('order_items')->where('seller_id', $seller_id);
        })->whereBetween('created_at', [$startDate, $endDate])->sum('amount') ?? 0);

        $prevCollections = (float) (OrderPayment::whereIn('order_id', function ($q) use ($seller_id) {
            $q->select('order_id')->from('order_items')->where('seller_id', $seller_id);
        })->whereBetween('created_at', [$prevStartDate, $prevEndDate])->sum('amount') ?? 0);

        $collectionsGrowth = $calcGrowth($currentCollections, $prevCollections);
        $collectionRate = $currentSales > 0 ? min(100, round(($currentCollections / $currentSales) * 100, 1)) : 0;

        // Outstanding & Aging
        $outstandingOrders = Order::whereIn('id', function ($q) use ($seller_id) {
            $q->select('order_id')->from('order_items')->where('seller_id', $seller_id);
        })
            ->whereNotIn('active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
            ->whereNull('deleted_at')
            ->select('id', 'user_id', 'final_total', 'created_at')
            ->get();

        $orderPaymentsSum = OrderPayment::whereIn('order_id', $outstandingOrders->pluck('id'))
            ->selectRaw('order_id, SUM(amount) as total_paid')
            ->groupBy('order_id')
            ->pluck('total_paid', 'order_id');

        $totalOutstanding = 0;
        $retailerAging = [];

        foreach ($outstandingOrders as $o) {
            $paid = (float) ($orderPaymentsSum[$o->id] ?? 0);
            $bal = max(0, (float) $o->final_total - $paid);
            if ($bal > 1.0) {
                $totalOutstanding += $bal;
                if (!isset($retailerAging[$o->user_id])) {
                    $retailerAging[$o->user_id] = [
                        'user_id' => $o->user_id,
                        'balance' => 0,
                        'invoices_count' => 0,
                        'oldest_date' => $o->created_at,
                    ];
                }
                $retailerAging[$o->user_id]['balance'] += $bal;
                $retailerAging[$o->user_id]['invoices_count']++;
                if (strtotime($o->created_at) < strtotime($retailerAging[$o->user_id]['oldest_date'])) {
                    $retailerAging[$o->user_id]['oldest_date'] = $o->created_at;
                }
            }
        }
        $outstandingRetailersCount = count($retailerAging);

        // Daily series for Trend Combo Chart & Sparklines
        $dailyOrders = Order::whereIn('id', $currentOrderIds)
            ->selectRaw('DATE(created_at) as order_date, SUM(final_total) as daily_sales, COUNT(id) as daily_invoices')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('order_date');

        $dailyPayments = OrderPayment::whereIn('order_id', function ($q) use ($seller_id) {
            $q->select('order_id')->from('order_items')->where('seller_id', $seller_id);
        })
            ->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as pay_date, SUM(amount) as daily_amount')
            ->groupBy(DB::raw('DATE(created_at)'))
            ->get()
            ->keyBy('pay_date');

        $trendDates = [];
        $trendSales = [];
        $trendInvoices = [];
        $sparkSales = [];
        $sparkInvoices = [];
        $sparkCollections = [];

        $stepDate = (clone $startDate)->startOfDay();
        while ($stepDate <= $endDate) {
            $dateStr = $stepDate->format('Y-m-d');
            $displayDate = $stepDate->format('d M');
            $trendDates[] = $displayDate;

            $daySale = (float) ($dailyOrders[$dateStr]->daily_sales ?? 0);
            $dayInv = (int) ($dailyOrders[$dateStr]->daily_invoices ?? 0);
            $dayColl = (float) ($dailyPayments[$dateStr]->daily_amount ?? 0);

            $trendSales[] = round($daySale, 2);
            $trendInvoices[] = $dayInv;
            $sparkSales[] = round($daySale, 2);
            $sparkInvoices[] = $dayInv;
            $sparkCollections[] = round($dayColl, 2);

            $stepDate->addDay();
        }

        // 2. Operational Stat Badges
        $activeRetailersCount = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller_id)
            ->whereNull('orders.deleted_at')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->distinct('orders.user_id')
            ->count('orders.user_id');

        $monthStart = Carbon::now()->startOfMonth();
        $newRetailersThisMonth = DB::table('orders')
            ->join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.seller_id', $seller_id)
            ->whereNull('orders.deleted_at')
            ->groupBy('orders.user_id')
            ->havingRaw('MIN(orders.created_at) >= ?', [$monthStart])
            ->pluck('orders.user_id')
            ->count();

        $activeSalesmenCount = \App\Models\Salesman::where('seller_id', $seller_id)->where('status', 1)->count();
        $inactiveSalesmenCount = \App\Models\Salesman::where('seller_id', $seller_id)->where('status', 0)->count();
        $activeDriversCount = DeliveryBoy::forSeller($seller_id)->where('status', 1)->count();

        $todayStr = Carbon::today()->toDateString();
        $threeDaysStr = Carbon::today()->addDays(3)->toDateString();
        $schemesRunningCount = \App\Models\Scheme::where('seller_id', $seller_id)
            ->where('status', 1)
            ->whereDate('start_date', '<=', $todayStr)
            ->whereDate('end_date', '>=', $todayStr)
            ->count();
        $schemesEndingSoonCount = \App\Models\Scheme::where('seller_id', $seller_id)
            ->where('status', 1)
            ->whereDate('start_date', '<=', $todayStr)
            ->whereDate('end_date', '>=', $todayStr)
            ->whereDate('end_date', '<=', $threeDaysStr)
            ->count();

        $pendingDeliveryStatus = [
            OrderStatusList::$processed,
            OrderStatusList::$shipped,
            OrderStatusList::$outForDelivery,
        ];
        $pendingOrders = Order::whereIn('id', function ($q) use ($seller_id) {
            $q->select('order_id')->from('order_items')->where('seller_id', $seller_id);
        })
            ->whereIn('active_status', $pendingDeliveryStatus)
            ->whereNull('deleted_at');
        $pendingDeliveriesCount = $pendingOrders->count();
        $pendingDeliveriesValue = (float) $pendingOrders->sum('final_total');

        // 3. Sales by Category
        $categorySalesRaw = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->leftJoin('master_product_variants', 'master_product_variants.id', '=', 'order_items.master_product_variant_id')
            ->leftJoin('master_products', 'master_products.id', '=', 'master_product_variants.master_product_id')
            ->leftJoin('categories', 'categories.id', '=', 'master_products.category_id')
            ->where('order_items.seller_id', $seller_id)
            ->whereNull('orders.deleted_at')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->select(
                DB::raw("COALESCE(categories.name, 'General') as category_name"),
                DB::raw('SUM(order_items.sub_total) as category_sales'),
                DB::raw('SUM(order_items.quantity) as category_units')
            )
            ->groupBy(DB::raw("COALESCE(categories.name, 'General')"))
            ->orderBy('category_sales', 'DESC')
            ->limit(5)
            ->get();

        $catLabels = [];
        $catSeriesSales = [];
        $catSeriesUnits = [];
        $catSumSales = 0;
        foreach ($categorySalesRaw as $cRow) {
            $catLabels[] = $cRow->category_name;
            $catSeriesSales[] = round((float) $cRow->category_sales, 2);
            $catSeriesUnits[] = (float) $cRow->category_units;
            $catSumSales += (float) $cRow->category_sales;
        }
        if ($currentSales > $catSumSales && ($currentSales - $catSumSales) > 10) {
            $othersSales = round($currentSales - $catSumSales, 2);
            $catLabels[] = 'Others';
            $catSeriesSales[] = $othersSales;
            $catSeriesUnits[] = 0;
            $catSumSales += $othersSales;
        }

        // 4. Top 5 Products
        $topProductsRaw = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->leftJoin('master_product_variants', 'master_product_variants.id', '=', 'order_items.master_product_variant_id')
            ->leftJoin('master_products', 'master_products.id', '=', 'master_product_variants.master_product_id')
            ->where('order_items.seller_id', $seller_id)
            ->whereNull('orders.deleted_at')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->select(
                'order_items.product_name',
                'order_items.variant_name',
                'master_products.image as product_image',
                'master_product_variants.image as variant_image',
                DB::raw('SUM(order_items.sub_total) as sales_amount'),
                DB::raw('SUM(order_items.quantity) as units_sold')
            )
            ->groupBy('order_items.product_name', 'order_items.variant_name', 'master_products.image', 'master_product_variants.image')
            ->orderBy('sales_amount', 'DESC')
            ->limit(5)
            ->get()
            ->map(function ($row) {
                $img = $row->product_image ?: $row->variant_image;
                $imgUrl = null;
                if ($img) {
                    $imgUrl = str_starts_with($img, 'http') ? $img : asset('storage/' . $img);
                }
                return [
                    'name' => $row->product_name . ($row->variant_name ? ' (' . $row->variant_name . ')' : ''),
                    'image_url' => $imgUrl,
                    'sales_amount' => round((float) $row->sales_amount, 2),
                    'units_sold' => (float) $row->units_sold,
                ];
            });

        // 5. Sales by Salesman (with Target, Achievement & Collections)
        $salesmenRows = DB::table('orders')
            ->join('salesmen', 'salesmen.id', '=', 'orders.placed_by_salesman_id')
            ->whereIn('orders.id', $currentOrderIds)
            ->select(
                'salesmen.id',
                'salesmen.name',
                'salesmen.mobile',
                DB::raw('SUM(orders.final_total) as total_sales'),
                DB::raw('COUNT(orders.id) as invoices_count'),
                DB::raw('COUNT(DISTINCT orders.user_id) as retailers_count')
            )
            ->groupBy('salesmen.id', 'salesmen.name', 'salesmen.mobile')
            ->orderBy('total_sales', 'DESC')
            ->limit(5)
            ->get()
            ->map(function ($sm) use ($currentSales, $startDate, $endDate) {
                $coll = (float) OrderPayment::where('salesman_id', $sm->id)
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('amount');
                $share = $currentSales > 0 ? round(((float) $sm->total_sales / $currentSales) * 100, 1) : 0;
                $smSales = (float) $sm->total_sales;
                return [
                    'id' => $sm->id,
                    'name' => $sm->name,
                    'sales' => round($smSales, 2),
                    'invoices' => (int) $sm->invoices_count,
                    'retailers' => (int) $sm->retailers_count,
                    'collections' => round($coll, 2),
                    'share_percent' => $share,
                ];
            });

        // 6. Sales by Driver (Deliveries, Dispatched, Collected, Pending)
        $driverRows = DB::table('orders')
            ->join('delivery_boys', 'delivery_boys.id', '=', 'orders.delivery_boy_id')
            ->whereIn('orders.id', $currentOrderIds)
            ->select(
                'delivery_boys.id',
                'delivery_boys.name',
                'delivery_boys.mobile',
                DB::raw('COUNT(orders.id) as deliveries_count'),
                DB::raw('SUM(orders.final_total) as total_amount')
            )
            ->groupBy('delivery_boys.id', 'delivery_boys.name', 'delivery_boys.mobile')
            ->orderBy('total_amount', 'DESC')
            ->limit(5)
            ->get()
            ->map(function ($dp) use ($startDate, $endDate) {
                $coll = (float) OrderPayment::where('delivery_boy_id', $dp->id)
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->sum('amount');
                $pending = max(0, (float) $dp->total_amount - $coll);
                return [
                    'id' => $dp->id,
                    'name' => $dp->name,
                    'deliveries' => (int) $dp->deliveries_count,
                    'amount' => round((float) $dp->total_amount, 2),
                    'collections' => round($coll, 2),
                    'pending' => round($pending, 2),
                ];
            });

        // 7. Retailer Activity
        $retailerActivityRows = DB::table('orders')
            ->leftJoin('retailer_profiles', 'retailer_profiles.user_id', '=', 'orders.user_id')
            ->leftJoin('users', 'users.id', '=', 'orders.user_id')
            ->whereIn('orders.id', $currentOrderIds)
            ->select(
                'orders.user_id',
                DB::raw("COALESCE(NULLIF(TRIM(retailer_profiles.shop_name), ''), users.name, 'Retailer') as shop_name"),
                DB::raw('SUM(orders.final_total) as total_sales'),
                DB::raw('MAX(orders.created_at) as last_order_date')
            )
            ->groupBy('orders.user_id', 'retailer_profiles.shop_name', 'users.name')
            ->orderBy('total_sales', 'DESC')
            ->limit(5)
            ->get()
            ->map(function ($ra) {
                $daysSinceOrder = Carbon::parse($ra->last_order_date)->diffInDays(Carbon::now());
                return [
                    'user_id' => $ra->user_id,
                    'shop_name' => $ra->shop_name,
                    'sales' => round((float) $ra->total_sales, 2),
                    'last_order' => Carbon::parse($ra->last_order_date)->format('d M'),
                    'status' => $daysSinceOrder <= 15 ? 'Active' : 'Inactive',
                ];
            });

        // 8. Outstanding by Retailer Aging (Top 5)
        $sortedAging = collect($retailerAging)->sortByDesc('balance')->take(5);
        $agingUserIds = $sortedAging->pluck('user_id')->toArray();
        $shopProfiles = DB::table('retailer_profiles')
            ->leftJoin('users', 'users.id', '=', 'retailer_profiles.user_id')
            ->whereIn('retailer_profiles.user_id', $agingUserIds)
            ->select('retailer_profiles.user_id', DB::raw("COALESCE(NULLIF(TRIM(retailer_profiles.shop_name), ''), users.name) as name"))
            ->pluck('name', 'user_id');

        $outstandingByRetailer = $sortedAging->map(function ($ag) use ($shopProfiles) {
            $days = Carbon::parse($ag['oldest_date'])->diffInDays(Carbon::now());
            return [
                'user_id' => $ag['user_id'],
                'shop_name' => $shopProfiles[$ag['user_id']] ?? ('Retailer #' . $ag['user_id']),
                'outstanding' => round((float) $ag['balance'], 2),
                'invoices' => (int) $ag['invoices_count'],
                'days' => $days,
            ];
        })->values();

        // 9. Low Stock Products
        $lowStockProducts = SellerProduct::where('seller_products.seller_id', $seller_id)
            ->where('seller_products.status', 1)
            ->where('seller_products.stock', '<=', $low_stock_limit)
            ->join('master_product_variants', 'master_product_variants.id', '=', 'seller_products.master_product_variant_id')
            ->join('master_products', 'master_products.id', '=', 'master_product_variants.master_product_id')
            ->leftJoin('units', 'units.id', '=', 'master_product_variants.unit_id')
            ->select(
                'seller_products.id',
                'master_products.name as product_name',
                'seller_products.stock',
                'units.short_code as unit_name'
            )
            ->orderBy('seller_products.stock', 'ASC')
            ->limit(5)
            ->get()
            ->map(function ($p) use ($low_stock_limit) {
                $unit = $p->unit_name ?: 'Units';
                return [
                    'id' => $p->id,
                    'product_name' => $p->product_name,
                    'current_stock' => $p->stock . ' ' . $unit,
                    'reorder_level' => $low_stock_limit . ' ' . $unit,
                ];
            });

        // 10. AI Insights & Recommendations (BETA)
        $topCatName = optional($categorySalesRaw->first())->category_name ?? 'Products';
        if ($salesGrowth >= 0) {
            $insightGrowth = [
                'type' => 'success',
                'icon' => 'arrow-up',
                'title' => "Sales are up {$salesGrowth}% this period",
                'desc' => "{$topCatName} category grew strongly vs prior period.",
                'action_label' => 'View Reports',
                'action_link' => '/seller/sales_reports',
            ];
        } else {
            $absGrowth = abs($salesGrowth);
            $insightGrowth = [
                'type' => 'warning',
                'icon' => 'arrow-down',
                'title' => "Sales dipped by {$absGrowth}% vs prior period",
                'desc' => "Consider introducing trade schemes on {$topCatName} to drive volumes.",
                'action_label' => 'View Schemes',
                'action_link' => '/seller/schemes',
            ];
        }

        $twentyDaysAgo = Carbon::now()->subDays(20);
        $inactiveRetailersCount = DB::table('orders')
            ->join('order_items', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.seller_id', $seller_id)
            ->whereNull('orders.deleted_at')
            ->groupBy('orders.user_id')
            ->havingRaw('MAX(orders.created_at) < ?', [$twentyDaysAgo])
            ->pluck('orders.user_id')
            ->count();

        $insightRetention = [
            'type' => 'warning',
            'icon' => 'exclamation-triangle',
            'title' => "{$inactiveRetailersCount} retailers have not ordered in 20+ days",
            'desc' => "Reconnect to avoid losing business to competitors.",
            'action_label' => 'View List',
            'action_link' => '/seller/orders',
        ];

        $firstLowStock = $lowStockProducts->first();
        $insightStock = [
            'type' => 'info',
            'icon' => 'lightbulb-o',
            'title' => $firstLowStock ? "Consider increasing stock of {$firstLowStock['product_name']}" : "Inventory levels are healthy",
            'desc' => $firstLowStock ? "Current stock is low ({$firstLowStock['current_stock']}) against reorder limit." : "All listed products currently meet the reorder threshold.",
            'action_label' => 'View Stock',
            'action_link' => '/seller/manage_stock',
        ];

        $topSalesman = $salesmenRows->first();
        $topDriver = $driverRows->first();
        if ($topSalesman) {
            $insightPerformer = [
                'type' => 'primary',
                'icon' => 'star',
                'title' => "{$topSalesman['name']} is top performer this period",
                'desc' => "Generated " . number_format($topSalesman['sales'], 2) . " ({$topSalesman['share_percent']}% share) across {$topSalesman['retailers']} retailers.",
                'action_label' => 'View Details',
                'action_link' => '/seller/salesman',
            ];
        } elseif ($topDriver) {
            $insightPerformer = [
                'type' => 'primary',
                'icon' => 'truck',
                'title' => "{$topDriver['name']} completed {$topDriver['deliveries']} deliveries",
                'desc' => "Collected " . number_format($topDriver['collections'], 2) . " on daily routes.",
                'action_label' => 'View Drivers',
                'action_link' => '/seller/delivery_boys',
            ];
        } else {
            $insightPerformer = [
                'type' => 'primary',
                'icon' => 'trophy',
                'title' => "Distributor portal active",
                'desc' => "Track deliveries, collections and route orders in real-time.",
                'action_label' => 'View Orders',
                'action_link' => '/seller/orders',
            ];
        }

        $data['period'] = [
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'formatted' => $startDate->format('d M') . ' – ' . $endDate->format('d M Y'),
            'days' => $diffDays,
        ];
        $data['distributor_info'] = [
            'user_name' => $sellerUser->name ?? $sellerUser->username ?? 'Distributor',
            'store_name' => $sellerModel->store_name ?? $sellerModel->name ?? 'Distributor',
            'logo_url' => $sellerModel->logo_url ?? null,
        ];
        $data['hero_kpis'] = [
            'sales' => [
                'current' => $currentSales,
                'previous' => $prevSales,
                'growth' => $salesGrowth,
                'trend' => $salesGrowth >= 0 ? 'up' : 'down',
                'sparkline' => $sparkSales,
            ],
            'invoices' => [
                'current' => $currentInvoices,
                'previous' => $prevInvoices,
                'growth' => $invoicesGrowth,
                'trend' => $invoicesGrowth >= 0 ? 'up' : 'down',
                'sparkline' => $sparkInvoices,
            ],
            'collections' => [
                'current' => $currentCollections,
                'previous' => $prevCollections,
                'growth' => $collectionsGrowth,
                'trend' => $collectionsGrowth >= 0 ? 'up' : 'down',
                'rate' => $collectionRate,
                'sparkline' => $sparkCollections,
            ],
            'outstanding' => [
                'current' => $totalOutstanding,
                'retailers_count' => $outstandingRetailersCount,
                'sparkline' => array_slice($sparkSales, -7),
            ],
        ];
        $data['operational_stats'] = [
            'active_retailers' => [
                'count' => $activeRetailersCount,
                'sub' => '+' . $newRetailersThisMonth . ' this month',
            ],
            'active_salesmen' => [
                'count' => $activeSalesmenCount,
                'sub' => $inactiveSalesmenCount > 0 ? ($inactiveSalesmenCount . ' inactive') : 'All active',
            ],
            'active_drivers' => [
                'count' => $activeDriversCount,
                'sub' => 'All active',
            ],
            'products' => [
                'count' => $data['product_count'],
                'sub' => $data['low_stock_count'] . ' low stock',
            ],
            'schemes' => [
                'count' => $schemesRunningCount,
                'sub' => $schemesEndingSoonCount > 0 ? ($schemesEndingSoonCount . ' ending soon') : 'Active',
            ],
            'pending_deliveries' => [
                'count' => $pendingDeliveriesCount,
                'value' => $pendingDeliveriesValue,
            ],
        ];
        $data['sales_trend'] = [
            'dates' => $trendDates,
            'sales' => $trendSales,
            'invoices' => $trendInvoices,
        ];
        $data['category_sales'] = [
            'labels' => $catLabels,
            'series_sales' => $catSeriesSales,
            'series_units' => $catSeriesUnits,
            'total_sales' => $catSumSales > 0 ? $catSumSales : $currentSales,
        ];
        $data['top_products'] = $topProductsRaw;
        $data['sales_by_salesman'] = $salesmenRows;
        $data['sales_by_driver'] = $driverRows;
        $data['retailer_activity'] = $retailerActivityRows;
        $data['outstanding_by_retailer'] = $outstandingByRetailer;
        $data['low_stock_products'] = $lowStockProducts;
        $data['ai_insights'] = [
            $insightGrowth,
            $insightRetention,
            $insightStock,
            $insightPerformer,
        ];

        return CommonHelper::responseWithData($data);
    }

    public function getProducts(Request $request)
    {
        $limit = $request->limit;
        $offset = $request->offset;
        $seller_id = auth()->user()->seller->id;

        // Packet/loose classification does not exist for master-catalog products.
        if (isset($request->type) && in_array($request->type, ['packet_products', 'loose_products'])) {
            return CommonHelper::responseWithData(["products" => []], 0);
        }

        $query = SellerProduct::where('seller_products.seller_id', $seller_id)
            ->where('seller_products.status', 1)
            ->join('master_product_variants as mpv', 'mpv.id', '=', 'seller_products.master_product_variant_id')
            ->join('master_products as mp', 'mp.id', '=', 'mpv.master_product_id')
            ->leftJoin('sellers as s', 's.id', '=', 'seller_products.seller_id');

        // Matches SellerController::index()'s sold_out_count query.
        if (isset($request->type) && $request->type === 'sold_out') {
            $query->where('seller_products.stock', '<=', 0);
        }
        // Matches SellerController::index()'s low_stock_count query.
        if (isset($request->type) && $request->type === 'low_stock') {
            $query->where('seller_products.stock', '>', 0);
            $low_stock_limit = Setting::where('variable', 'low_stock_limit')->first();
            $low_stock_limit = $low_stock_limit ? (int) $low_stock_limit->value : 0;
            if ($low_stock_limit > 0) {
                $query->where('seller_products.stock', '<=', $low_stock_limit);
            }
        }

        $query->select(
            'mpv.id as product_variant_id',
            'mp.id as product_id',
            'mp.name',
            'mp.image',
            's.name as seller_name',
            'seller_products.id as seller_product_id',
            'seller_products.mrp as price',
            'seller_products.discounted_price',
            'seller_products.stock',
            'seller_products.status as pv_status'
        );

        $total = (clone $query)->count();

        $products = $query->orderBy('mp.id', 'DESC')
            ->orderBy('mpv.id', 'ASC')
            ->get()
            ->map(function ($row) {
                $row->image_url = $row->image ? asset('storage/' . $row->image) : null;
                return $row;
            });

        if (isset($request->limit)) {
            $products = $products->slice($offset, $limit)->values();
        }
        $data = array(
            "products" => $products
        );

        return CommonHelper::responseWithData($data, $total);
    }

    public function getWeeklySales()
    {

        $seller_id = auth()->user()->seller->id;
        $year = date("Y");
        $curdate = date('Y-m-d');
        $orders = Order::select(
            DB::raw('ROUND(SUM(order_items.sub_total), 2) AS total_sale'),
            DB::raw('DATE(orders.created_at) AS order_date')
        )
            ->where(DB::raw('YEAR(orders.created_at)'), '=', $year)
            ->where(DB::raw('DATE(orders.created_at)'), '<=', $curdate)
            ->where('active_status', OrderStatusList::$delivered)
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.seller_id', $seller_id)
            ->groupBy(DB::raw('DATE(orders.created_at)'))
            ->orderBy(DB::raw('DATE(orders.created_at)'), 'DESC')
            ->limit(7)
            ->get();

        return CommonHelper::responseWithData($orders);
    }

    public function countProductCategoryWise()
    {
        $sellerCategoryIds = auth()->user()->seller->categories;
        $categories = Category::select('name', DB::raw('(SELECT count(id) from `products` WHERE products.category_id = categories.id) AS product_count'))
            ->whereIn('id', explode(',', $sellerCategoryIds))
            ->orderBy('id', 'ASC')->get();
        return CommonHelper::responseWithData($categories);
    }

    public function doLanguageChange(Request $request)
    {
        Session::put('lang', $request->language);

        return response()->json(['status' => true]);
    }

    public function createSlug($text)
    {
        $slug = CommonHelper::slugify($text);
        return CommonHelper::responseWithData($slug);
    }

    public function getTopNotifications()
    {
        $notifications = PanelNotification::where('notifiable_id', auth()->user()->id);
        $unReadCount = (clone $notifications)->where('read_at', NULL)->get()->count();
        $notifications = $notifications->orderBy('created_at', 'DESC')->get();

        $data = array();
        $data['unread'] = $unReadCount;
        $data['notifications'] = $notifications;
        return CommonHelper::responseWithData($data);
    }

    public function markAsReadNotifications(Request $request)
    {

        auth()->user()
            ->unreadNotifications
            ->when($request->input('id'), function ($query) use ($request) {
                return $query->where('id', $request->input('id'));
            })
            ->markAsRead();
        return CommonHelper::responseWithData('notification_mark_as_read_successfully');
    }

   public function getOrders(Request $request)
    {
        $seller_id = auth()->user()->seller->id;

        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';
        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        $limit = ($request->limit);
        $offset = ($request->offset) ?? 0;
        $filter = $request->search; // Filter query

        $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
        $endDate = Carbon::parse($request->input('endDate'))->endOfDay();

        $startDeliveryDate = Carbon::parse($request->input('startDeliveryDate'))->startOfDay();
        $endDeliveryDate = Carbon::parse($request->input('endDeliveryDate'))->endOfDay();

        $orders = Order::select(
            'orders.*',
            'orders.id as order_id',
            'delivery_boys.name as delivery_boy_name',
            'sellers.name as seller_name',
            DB::raw("COALESCE(NULLIF(TRIM(retailer_profiles.shop_name), ''), users.name) as user_name"),
            'order_items.active_status as order_status'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('user_addresses as address', 'orders.address_id', '=', 'address.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles', 'retailer_profiles.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('delivery_boys', 'orders.delivery_boy_id', '=', 'delivery_boys.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->where('order_items.seller_id', $seller_id)
            ->whereIn('orders.order_type', ['doorstep', 'pos']);

        if (isset($request->startDate) && $request->startDate != "" && isset($request->endDate) && $request->endDate != "") {
            $orders = $orders->whereBetween('order_items.created_at', [$startDate, $endDate]);
        }

        if (isset($request->startDeliveryDate) && $request->startDeliveryDate != "" && isset($request->endDeliveryDate) && $request->endDeliveryDate != "") {
            // Convert start and end dates from request to Y-m-d format
            $startDeliveryDate = date('Y-m-d', strtotime($request->startDeliveryDate));
            $endDeliveryDate = date('Y-m-d', strtotime($request->endDeliveryDate));

            // Define a callback function to extract and format the delivery_time date
            $orders = $orders->where(function ($query) use ($startDeliveryDate, $endDeliveryDate) {
                $query->whereRaw("STR_TO_DATE(SUBSTRING_INDEX(orders.delivery_time, ' ', 1), '%d-%m-%Y') BETWEEN ? AND ?", [$startDeliveryDate, $endDeliveryDate]);
            });
        }

        if (isset($request->status) && $request->status != "" && $request->status != 0) {
            $orders = $orders->where('orders.active_status', $request->status);
        }

        // Apply filter to all columns in all joined tables
        if ($filter) {
            $columns = [
                'orders.payment_method',
                'orders.id',
                'orders.mobile',
                'delivery_boys.name',
                'orders.delivery_charge',
                'orders.wallet_balance',
                'orders.remaining_final',
                'orders.total',
                'orders.delivery_time',
                'sellers.name',
                'users.name',
                'retailer_profiles.shop_name',
                'order_items.active_status',
                'products.name'
                // Add more columns as needed
            ];

            $orders = $orders->where(function ($query) use ($filter, $columns) {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'like', "%{$filter}%");
                }
            });
        }

        $totalOrder = $orders->groupBy('orders.id')->get()->count();

        if (isset($limit) && $limit > 0) {
            $orders = $orders->groupBy('orders.id')->orderBy('orders.id', 'DESC')->skip($offset)->take($limit)->get();
        } else {
            $orders = $orders->groupBy('orders.id')->orderBy('orders.id', 'DESC')->get();
        }
        CommonHelper::attachRetailerAddress($orders);
        foreach ($orders as $order) {
            $order->order_status_name = OrderStatusList::getTranslatedName((int) $order->active_status);
        }
        $item_limit = ($request->item_limit);
        $item_offset = ($request->item_offset) ?? 0;
        $order_items = Order::select(
            'order_items.*',
            'product_variants.measurement',
            'product_variants.stock_unit_id',
            'orders.mobile',
            'orders.total',
            'orders.delivery_charge',
            'orders.discount',
            'orders.promo_code',
            'orders.promo_discount',
            'orders.wallet_balance',
            'orders.final_total',
            'remaining_final',
            'orders.payment_method',
            'orders.address',
            'orders.delivery_time',
            'orders.delivery_date',
            DB::raw("COALESCE(NULLIF(TRIM(retailer_profiles.shop_name), ''), users.name) as user_name"),
            'order_items.status as order_status',
            'sellers.name as seller_name'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles', 'retailer_profiles.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('delivery_boys', 'orders.delivery_boy_id', '=', 'delivery_boys.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->where('order_items.seller_id', $seller_id);

        if (isset($request->startDate) && $request->startDate != "" && isset($request->endDate) && $request->endDate != "") {
            $order_items = $order_items->whereBetween('order_items.created_at', [$startDate, $endDate]);
        }

        if (isset($request->startDeliveryDate) && $request->startDeliveryDate != "" && isset($request->endDeliveryDate) && $request->endDeliveryDate != "") {
            // Convert start and end dates from request to Y-m-d format
            $startDeliveryDate = date('Y-m-d', strtotime($request->startDeliveryDate));
            $endDeliveryDate = date('Y-m-d', strtotime($request->endDeliveryDate));

            // Define a callback function to extract and format the delivery_time date
            $order_items = $order_items->where(function ($query) use ($startDeliveryDate, $endDeliveryDate) {
                $query->whereRaw("STR_TO_DATE(SUBSTRING_INDEX(orders.delivery_time, ' ', 1), '%d-%m-%Y') BETWEEN ? AND ?", [$startDeliveryDate, $endDeliveryDate]);
            });
        }

        if (isset($request->status) && $request->status != "" && $request->status != 0) {
            $order_items = $order_items->where('orders.active_status', $request->status);
        }
        // Apply filter to all columns in all joined tables
        if ($filter) {
            $columns = [
                'orders.payment_method',
                'orders.id',
                'orders.mobile',
                'delivery_boys.name',
                'orders.delivery_charge',
                'orders.wallet_balance',
                'orders.remaining_final',
                'orders.total',
                'orders.delivery_time',
                'sellers.name',
                'users.name',
                'retailer_profiles.shop_name',
                'order_items.active_status',
                'products.name',
                'order_items.id',
                'order_items.is_credited'
            ];

            $order_items = $order_items->where(function ($query) use ($filter, $columns) {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'like', "%{$filter}%");
                }
                $loweredFilter = strtolower($filter);
                if ($loweredFilter == "credited") {
                    $query->orWhere('order_items.is_credited', 1);
                } elseif ($loweredFilter == "not credited" || $loweredFilter == "not_credited" || $loweredFilter == "notcredited") {
                    $query->orWhere('order_items.is_credited', 0);
                }
            });
        }

        $totalOrderItem = $order_items->count();
        if (isset($item_limit) && $item_limit > 0) {
            $order_items = $order_items->orderBy('order_items.id', 'DESC')->skip($item_offset)->take($item_limit)->get();
        } else {
            $order_items = $order_items->orderBy('order_items.id', 'DESC')->get();
        }

        $statusOrderCount = CommonHelper::getStatusOrderCount($seller_id, 'doorstep')->toArray() ?? [];
        array_unshift($statusOrderCount, array("id" => 0, "status" => "All Orders", "order_count" => $totalOrder));

        if ($useContentLanguage) {
            $statusOrderCount = array_map(function ($row) {
                $statusName = ($row['id'] ?? null) === 0 ? __('all_orders') : OrderStatusList::getTranslatedName((int) $row['id']);
                return array_merge($row, ['status_name' => $statusName]);
            }, $statusOrderCount);
        }

        if ($orders) {
            $data = array(
                "status_order_count" => $statusOrderCount,
                "orders" => $orders,
                "total_order_item" => $totalOrderItem,
                "order_items" => $order_items
            );
            return CommonHelper::responseWithData($data, $totalOrder);
        } else {
            return CommonHelper::responseSuccess('Order not found');
        }
    }

    public function getSelfPickupOrders(Request $request)
    {
        $seller_id = auth()->user()->seller->id;

        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';
        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        $limit = $request->input('per_page', 10);
        $offset = (($request->input('page', 1)) - 1) * $limit;
        $filter = $request->input('search', '');

        $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
        $endDate = Carbon::parse($request->input('endDate'))->endOfDay();

        $orders = Order::select(
            'orders.*',
            'orders.id as order_id',
            'orders.active_status',
            'orders.additional_charges',
            'sellers.name as seller_name',
            'users.name as user_name',
            'order_items.active_status as order_status'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->where('order_items.seller_id', $seller_id)
            ->where('orders.order_type', 'selfpickup');

        if (isset($request->startDate) && $request->startDate != "" && isset($request->endDate) && $request->endDate != "") {
            $orders = $orders->whereBetween('order_items.created_at', [$startDate, $endDate]);
        }

        if (isset($request->status) && $request->status != "" && $request->status != 0) {
            $orders = $orders->where('orders.active_status', $request->status);
        }

        if ($filter) {
            $columns = [
                'orders.payment_method',
                'orders.id',
                'orders.mobile',
                'orders.delivery_charge',
                'orders.wallet_balance',
                'orders.remaining_final',
                'orders.total',
                'orders.delivery_time',
                'sellers.name',
                'users.name',
                'order_items.active_status',
                'products.name'
            ];

            $orders = $orders->where(function ($query) use ($filter, $columns) {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'like', "%{$filter}%");
                }
            });
        }

        $orders = $orders->orderBy('orders.id', 'DESC')->groupBy('orders.id');

        $totalOrder = $orders->get()->count();
        $orders = $orders->skip($offset)->take($limit)->get();
        $orders = $orders->map(function ($order) {
            $order = $order->toArray(); // important

            $order['created_at'] = CommonHelper::formatDateTime($order['created_at']);
            $order['updated_at'] = CommonHelper::formatDateTime($order['updated_at']);

            return $order;
        });
        foreach ($orders as &$order) {

            $order['order_status_name'] = OrderStatusList::getTranslatedName((int) ($order['active_status'] ?? 0));

            if (!empty($order['additional_charges'])) {
                if (is_string($order['additional_charges'])) {
                    $decoded = json_decode($order['additional_charges'], true);
                    $order['additional_charges'] = (is_array($decoded)) ? $decoded : [];
                } elseif (!is_array($order['additional_charges'])) {
                    $order['additional_charges'] = [];
                }
            } else {
                $order['additional_charges'] = [];
            }
        }

        $item_limit = $request->input('item_per_page', 10);
        $item_offset = (($request->input('item_page', 1)) - 1) * $item_limit;

        $order_items = Order::select(
            'order_items.*',
            'orders.mobile',
            'orders.total',
            'orders.delivery_charge',
            'orders.discount',
            'orders.promo_code',
            'orders.promo_discount',
            'orders.wallet_balance',
            'orders.final_total',
            'remaining_final',
            'orders.payment_method',
            'orders.delivery_time',
            'users.name as user_name',
            'order_items.status as order_status',
            'sellers.name as seller_name'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->where('order_items.seller_id', $seller_id)
            ->where('orders.order_type', 'selfpickup');

        if (isset($request->startDate) && $request->startDate != "" && isset($request->endDate) && $request->endDate != "") {
            $order_items = $order_items->whereBetween('order_items.created_at', [$startDate, $endDate]);
        }

        if (isset($request->status) && $request->status != "" && $request->status != 0) {
            $order_items = $order_items->where('orders.active_status', $request->status);
        }

        if ($filter) {
            $columns = [
                'orders.payment_method',
                'orders.id',
                'orders.mobile',
                'orders.delivery_charge',
                'orders.wallet_balance',
                'orders.remaining_final',
                'orders.total',
                'orders.delivery_time',
                'sellers.name',
                'users.name',
                'order_items.active_status',
                'products.name',
                'order_items.id',
                'order_items.is_credited'
            ];

            $order_items = $order_items->where(function ($query) use ($filter, $columns) {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'like', "%{$filter}%");
                }
                $loweredFilter = strtolower($filter);
                if ($loweredFilter == "credited") {
                    $query->orWhere('order_items.is_credited', 1);
                } elseif ($loweredFilter == "not credited" || $loweredFilter == "not_credited" || $loweredFilter == "notcredited") {
                    $query->orWhere('order_items.is_credited', 0);
                }
            });
        }

        $totalOrderItem = $order_items->count();
        $order_items = $order_items->orderBy('order_items.id', 'DESC')->skip($item_offset)->take($item_limit)->get();
        $order_items = $order_items->map(function ($item) {
            $item = $item->toArray(); // important

            $item['created_at'] = CommonHelper::formatDateTime($item['created_at']);
            $item['updated_at'] = CommonHelper::formatDateTime($item['updated_at']);

            return $item;
        });

        $statusOrderCount = CommonHelper::getStatusOrderCount($seller_id, 'selfpickup')->toArray() ?? [];
        array_unshift($statusOrderCount, array("id" => 0, "status" => "All Orders", "order_count" => $totalOrder));

        if ($useContentLanguage) {
            $statusOrderCount = array_map(function ($row) {
                $statusName = ($row['id'] ?? null) === 0 ? __('all_orders') : OrderStatusList::getTranslatedName((int) $row['id']);
                return array_merge($row, ['status_name' => $statusName]);
            }, $statusOrderCount);
        }

        if ($orders) {
            $data = array(
                "status_order_count" => $statusOrderCount,
                "orders" => $orders,
                "total_order_item" => $totalOrderItem,
                "order_items" => $order_items,
                "orders_total" => $totalOrder
            );
            return CommonHelper::responseWithData($data, $totalOrder);
        } else {
            return CommonHelper::responseSuccess('Order not found');
        }
    }

    public function getOrder(Request $request)
    {
        $data = CommonHelper::getOrderDetails($request->order_id);
        return CommonHelper::responseWithData($data);
    }

    public function getOrderStatus(Request $request)
    {
        return app(OrderStatusApiController::class)->getOrderStatus($request);
    }

    public function getCategories(Request $request)
    {
        $seller_categories = auth()->user()->seller->categories;
        $category_id = $request->get('category_id', 0);
        if (isset($request->category_id)) {
            $categories = Category::where('parent_id', $category_id)->orderBy('name', 'ASC')->get();
        } else {
            $categories = Category::whereIn('id', explode(",", $seller_categories))->where('parent_id', $category_id)->orderBy('name', 'ASC')->get();
        }
        return CommonHelper::responseWithData($categories);
    }

    public function getReturnRequests()
    {
        $seller_id = auth()->user()->seller->id;
        $ReturnRequests = ReturnRequest::select(
            'return_requests.*',
            'users.name',
            'order_items.product_variant_id',
            'order_items.quantity',
            'order_items.price',
            'order_items.discounted_price',
            'order_items.product_name',
            'order_items.variant_name'
        )
            ->leftJoin('users', 'return_requests.user_id', '=', 'users.id')
            ->leftJoin('order_items', 'return_requests.order_item_id', '=', 'order_items.id')
            ->leftJoin('products', 'return_requests.product_id', '=', 'products.id')
            ->leftJoin('product_variants', 'return_requests.product_variant_id', '=', 'product_variants.id')
            ->where('products.seller_id', $seller_id)
            ->orderBy('return_requests.id', 'DESC')
            ->get();
        return CommonHelper::responseWithData($ReturnRequests);
    }

    public function getProductSalesReport(Request $request)
    {
        $seller_id = auth()->user()->seller->id;
        $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
        $endDate = Carbon::parse($request->input('endDate'))->endOfDay();
        $ProductSalesReports = OrderItem::select(
            'product_variants.product_id',
            'products.name as product_name',
            'sellers.name as seller_name',
            'product_variants.measurement',
            'units.short_code AS unit_name',
            'order_items.*',
            'orders.*',
            DB::raw('(SELECT COUNT(order_items.product_variant_id) FROM order_items WHERE product_variants.id = order_items.product_variant_id) as total_sales'),
            DB::raw('(SELECT SUM(order_items.sub_total) FROM `order_items` WHERE product_variants.id = order_items.product_variant_id) as total_price')
        )
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('units', 'product_variants.stock_unit_id', '=', 'units.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
            ->where('products.seller_id', $seller_id)
            ->where('orders.active_status', OrderStatusList::$delivered)
            ->orWhere('orders.active_status', OrderStatusList::$selfPickupPicked)
            ->whereBetween('order_items.created_at', [$startDate, $endDate])
            ->orderBy('order_items.id', 'DESC')
            ->groupBy('product_variants.id')
            ->get();
        return CommonHelper::responseWithData($ProductSalesReports);
    }

    public function getSalesReport(Request $request)
    {
        $seller_id = auth()->user()->seller->id;

        $startDate = $request->filled('startDate')
            ? Carbon::parse($request->input('startDate'))->startOfDay()
            : null;
        $endDate = $request->filled('endDate')
            ? Carbon::parse($request->input('endDate'))->endOfDay()
            : null;

        $categories = CommonHelper::getSellerCategories($seller_id);

        $SalesReports = OrderItem::select(
            'order_items.id',
            'orders.total',
            'order_items.seller_id',
            'order_items.sub_total',
            'orders.user_id',
            'orders.mobile',
            'products.name as product_name',
            'orders.final_total',
            'orders.address',
            'users.name as user_name',
            'order_items.status',
            DB::raw('DATE_FORMAT(order_items.created_at,"%d-%m-%Y") as added_date')
        )
            ->leftJoin('users', 'order_items.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('products.seller_id', $seller_id)
            ->where(function ($query) {
                $query->where('orders.active_status', OrderStatusList::$delivered)
                    ->orWhere('orders.active_status', OrderStatusList::$selfPickupPicked);
            });

        if ($startDate && $endDate) {
            $SalesReports = $SalesReports->whereBetween('order_items.created_at', [$startDate, $endDate]);
        }

        if (isset($request->category) && $request->category != "") {
            $SalesReports = $SalesReports->where('products.category_id', $request->category);
        }

        $SalesReports = $SalesReports->orderBy('order_items.id', 'DESC')->get();

        $SalesReports = $SalesReports->map(function (OrderItem $oi) {
            $row = $oi->toArray();
            $rawAddedDate = $oi->getAttributes()['added_date'] ?? null;
            if ($rawAddedDate !== null && $rawAddedDate !== '') {
                $row['added_date'] = CommonHelper::formatDate($rawAddedDate);
            }
            return $row;
        });

        $data = [
            "categories"   => $categories,
            "salesReports" => $SalesReports
        ];

        return CommonHelper::responseWithData($data);
    }

    /**
     * Sales Invoice export — Tally "Sales Voucher" import template, one row per
     * order item. Column layout is the shared Sales / Credit Note one, see
     * tallyVoucherHeaders(). Only invoices with at least one verified payment are included (2026-09-30
     * spec: exports 2-6 gate on settled + verified); a cash payment counts as
     * verified, see the gate below.
     */
    public function exportOrdersCsv(Request $request)
    {
        $startDate = $request->filled('startDate')
            ? Carbon::parse($request->input('startDate'))->startOfDay()
            : null;
        $endDate = $request->filled('endDate')
            ? Carbon::parse($request->input('endDate'))->endOfDay()
            : null;

        [$headers, $sheetRows] = $this->buildSalesSheet(auth()->user()->seller->id, $startDate, $endDate);

        return $this->downloadXlsx($headers, $sheetRows, 'Sales.xlsx');
    }

    /**
     * Sales Invoice + Credit Note in one Tally import file. Both vouchers already share one
     * column layout (the Voucher Type column tells Tally which is which), so this is just the
     * Sales rows followed by the Credit Note rows under a single header. Sales go first so each
     * credit note's "Against Invoice No" finds its invoice already in Tally. The one date range
     * is applied to each side's own date (invoice date / credit note generated date).
     */
    public function exportSalesAndCreditNotesCsv(Request $request)
    {
        $seller_id = auth()->user()->seller->id;

        $startDate = $request->filled('startDate')
            ? Carbon::parse($request->input('startDate'))->startOfDay()
            : null;
        $endDate = $request->filled('endDate')
            ? Carbon::parse($request->input('endDate'))->endOfDay()
            : null;

        [$headers, $salesRows] = $this->buildSalesSheet($seller_id, $startDate, $endDate);
        [, $creditNoteRows] = $this->buildCreditNoteSheet($seller_id, $startDate, $endDate);

        return $this->downloadXlsx($headers, array_merge($salesRows, $creditNoteRows), 'SalesCreditNote.xlsx');
    }

    /**
     * Header + data rows of the Sales sheet (see exportOrdersCsv for the rules). Shared by the
     * Sales-only download and the combined Sales + Credit Note download. Discounts are exported
     * as positive amounts / percentages — Tally reads them positive for every voucher type.
     */
    private function buildSalesSheet(int $seller_id, ?Carbon $startDate, ?Carbon $endDate): array
    {
        $seller = DB::table('sellers')->where('id', $seller_id)->first();
        $sellerState = $seller->state ?? null;

        $rows = OrderItem::select(
            'order_items.id as order_item_id',
            'order_items.order_id',
            'order_items.master_product_variant_id',
            'order_items.product_variant_id',
            'order_items.quantity',
            'order_items.price',
            'order_items.discount',
            'order_items.tax_percentage',
            'order_items.created_at as item_created_at',
            'order_items.product_name',
            'order_items.variant_name',
            'orders.invoice_number',
            'orders.placed_by_salesman_id',
            'orders.discount as order_discount',
            'orders.promo_discount as order_promo_discount',
            'orders.scheme_discount as order_scheme_discount',
            'orders.cash_discount_amount as order_cash_discount',
            'orders.loading_slip_id',
            'retailer_profiles.party_name',
            'retailer_profiles.shop_name',
            'rp_area.name as rp_area_name',
            'users.mobile as user_mobile',
            'orders.mobile as order_mobile',
            'retailer_profiles.gst_no',
            'retailer_profiles.area_id as rp_area_id',
            'users.name as user_name',
            // The retailer's own address (profile) — the retailer app creates no saved delivery
            // address, so these are what fills the Party Address columns for them.
            'retailer_profiles.address as rp_profile_address',
            'retailer_profiles.address_line1 as rp_address_line1',
            'retailer_profiles.address_line2 as rp_address_line2',
            'retailer_profiles.city as rp_profile_city',
            'retailer_profiles.state as rp_profile_state',
            'rp_area.pincode as rp_area_pincode',
            'ua.address as ua_address',
            'ua.landmark as ua_landmark',
            'ua.area as ua_area',
            'ua.city as ua_city',
            'ua.state as ua_state',
            'rp_city.state as rp_city_state',
            'rp_area.state as rp_area_state',
            'ua.pincode as ua_pincode',
            'salesman.name as salesman_name',
            DB::raw('COALESCE(mpv.unit_id, pv.stock_unit_id) as unit_id'),
            DB::raw('COALESCE(u.short_code, u2.short_code) as unit_symbol'),
            DB::raw('(SELECT mp.hsn FROM master_products mp
                      INNER JOIN master_product_variants mpv2 ON mpv2.master_product_id = mp.id
                      WHERE mpv2.id = order_items.master_product_variant_id LIMIT 1) as hsn')
        )
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles', 'orders.user_id', '=', 'retailer_profiles.user_id')
            ->leftJoin('areas as rp_area', 'retailer_profiles.area_id', '=', 'rp_area.id')
            ->leftJoin('cities as rp_city', 'retailer_profiles.city_id', '=', 'rp_city.id')
            ->leftJoin('user_addresses as ua', 'orders.address_id', '=', 'ua.id')
            ->leftJoin('salesmen as salesman', 'orders.placed_by_salesman_id', '=', 'salesman.id')
            ->leftJoin('master_product_variants as mpv', 'order_items.master_product_variant_id', '=', 'mpv.id')
            ->leftJoin('units as u', 'mpv.unit_id', '=', 'u.id')
            ->leftJoin('product_variants as pv', 'order_items.product_variant_id', '=', 'pv.id')
            ->leftJoin('units as u2', 'pv.stock_unit_id', '=', 'u2.id')
            ->where('order_items.seller_id', $seller_id)
            // Partial Delivery is a delivered invoice too: its receipt and short-delivery credit
            // note are exported, so leaving it out would import both against a missing invoice.
            ->where(function ($query) {
                $query->where('orders.active_status', OrderStatusList::$delivered)
                    ->orWhere('orders.active_status', OrderStatusList::$partialDelivery)
                    ->orWhere('orders.active_status', OrderStatusList::$selfPickupPicked);
            })
            // Only invoices with a distributor-verified payment are exportable. Cash
            // counts as verified without being flagged: it never goes through the Verify
            // action (reconciled at trip level instead), so its status stays 'pending' —
            // gating on it would hide every cash-paid invoice while its cash receipt
            // still exports, leaving a receipt in Tally with no invoice to settle.
            ->whereExists(function ($q) {
                $q->select(DB::raw(1))
                    ->from('order_payments')
                    ->whereColumn('order_payments.order_id', 'orders.id')
                    ->where(function ($q2) {
                        $q2->where('order_payments.status', 'verified')
                            ->orWhere('order_payments.method', 'cash');
                    });
            });

        if ($startDate && $endDate) {
            $rows = $rows->whereBetween('order_items.created_at', [$startDate, $endDate]);
        }

        $rows = $rows->orderBy('order_items.order_id')->orderBy('order_items.id')->get();

        // Loading slip (vehicle/driver) is per-order, batched separately — cheaper
        // than a join fanning out further, and most orders share few slips.
        $slipIds = $rows->pluck('loading_slip_id')->filter()->unique();
        $slips = $slipIds->isEmpty() ? collect() : DB::table('loading_slips as ls')
            ->leftJoin('vehicles as v', 'ls.vehicle_id', '=', 'v.id')
            ->leftJoin('delivery_boys as db', 'ls.driver_id', '=', 'db.id')
            ->whereIn('ls.id', $slipIds)
            ->get(['ls.id', 'ls.slip_no', 'v.vehicle_number', 'db.name as driver_name'])
            ->keyBy('id');

        $headers = $this->tallyVoucherHeaders();

        $itemNames = $this->tallyItemNames($rows->pluck('master_product_variant_id')->all());

        $sheetRows = [];
        $seenOrders = [];
        foreach ($rows as $row) {
            $partyName = $this->tallyPartyLedgerName($row);
            $voucherNo = $row->invoice_number ?: ('#' . $row->order_id);
            $itemName = $this->tallyLineItemName($row, $itemNames);
            $slip = $row->loading_slip_id ? ($slips[$row->loading_slip_id] ?? null) : null;

            $partyState = $this->tallyPartyState($row);
            $supplyType = ($partyState && $sellerState && strcasecmp($partyState, $sellerState) === 0)
                ? 'INTRA_STATE' : 'INTER_STATE';

            $isFirstRowOfOrder = !isset($seenOrders[$row->order_id]);
            $seenOrders[$row->order_id] = true;
            $invoiceDiscountAmt = '';
            $codDiscountAmt = '';
            if ($isFirstRowOfOrder) {
                $orderDiscount = (float) $row->order_discount + (float) $row->order_promo_discount + (float) $row->order_scheme_discount;
                $invoiceDiscountAmt = $orderDiscount > 0 ? $orderDiscount : '';

                // Cash discount is booked at collection and already taken off final_total, so it
                // must be exported (own column, as in the client's sheet, positive amount) or the
                // invoice in Tally stays higher than the receipt against it.
                $codDiscount = (float) $row->order_cash_discount;
                $codDiscountAmt = $codDiscount > 0 ? $codDiscount : '';
            }

            $dispatchedThrough = $row->placed_by_salesman_id && $row->salesman_name
                ? $row->salesman_name . ' (Salesman)'
                : 'Self - Retailer App Order';

            $partyAddress = $this->tallyPartyAddress($row);

            $sheetRows[] = [
                'Sales',
                Carbon::parse($row->item_created_at)->format('d-m-Y'),
                $voucherNo,
                $partyName,
                $this->tallyPartyMobile($row),
                $this->tallyPartyMobile($row),
                $row->gst_no,
                $partyState,
                $supplyType,
                '',
                '',
                'Sales',
                $itemName,
                $row->hsn,
                $row->quantity,
                $row->unit_symbol,
                $row->price,
                $row->discount ? abs($row->discount) : 0,
                $invoiceDiscountAmt,
                $codDiscountAmt,
                '', // Delivery Charge — no delivery charge in the system; the column is kept blank for Tally
                $row->tax_percentage,
                '',
                'Order ' . $row->order_id,
                $partyAddress['line1'],
                $partyAddress['pincode'],
                $slip->vehicle_number ?? '',
                $slip->slip_no ?? '',
                $partyAddress['area'],
                $dispatchedThrough,
                $slip->driver_name ?? '',
                'Online order #' . $row->order_id,
            ];
        }

        return [$headers, $sheetRows];
    }

    /**
     * Credit Note export — Tally "Credit Note" voucher import template, one row per
     * credit note line item. Column layout is identical to exportOrdersCsv()'s Sales
     * export (those headers already reserve Bill Ref No/Date for this), sourced from
     * credit_notes / credit_note_items — generated automatically at trip close for
     * approved returns and cancelled orders (see SettlementController::generateCreditNotesForTripClose).
     *
     * Quantity/Rate/Discount/Tax come straight from the original order_item, not from
     * credit_note_items.quantity (which is hardcoded to 1 for returns) — returns are
     * always all-or-nothing per line item, so the original order_item's quantity is
     * always the correct returned quantity. The exception is a 'partial' credit note
     * (delivery shortfall): it covers only the undelivered units, so its quantity is
     * credit_note_items.quantity — the order_item's quantity would be the full ordered qty.
     */
    public function exportCreditNotesCsv(Request $request)
    {
        $startDate = $request->filled('startDate')
            ? Carbon::parse($request->input('startDate'))->startOfDay()
            : null;
        $endDate = $request->filled('endDate')
            ? Carbon::parse($request->input('endDate'))->endOfDay()
            : null;

        [$headers, $sheetRows] = $this->buildCreditNoteSheet(auth()->user()->seller->id, $startDate, $endDate);

        return $this->downloadXlsx($headers, $sheetRows, 'CreditNote.xlsx');
    }

    /**
     * GET seller/credit-notes/preview?order_id=
     * The exact header + rows the Credit Note Excel export would contain for one order's
     * credit notes, so the order page can show them without downloading the file.
     */
    public function previewCreditNotes(Request $request)
    {
        $orderId = (int) $request->input('order_id');
        if ($orderId <= 0) {
            return CommonHelper::responseError('order_id_required');
        }

        [$headers, $rows] = $this->buildCreditNoteSheet(auth()->user()->seller->id, null, null, $orderId);

        return CommonHelper::responseWithData(['headers' => $headers, 'rows' => $rows]);
    }

    /**
     * Header + data rows of the Credit Note sheet (see exportCreditNotesCsv for the
     * column rules). Shared by the Excel download and the order-page preview so both
     * always show identical data. $orderId narrows it to one order's credit notes.
     */
    private function buildCreditNoteSheet(int $seller_id, ?Carbon $startDate, ?Carbon $endDate, ?int $orderId = null): array
    {
        $seller = DB::table('sellers')->where('id', $seller_id)->first();
        $sellerState = $seller->state ?? null;

        $rows = CreditNoteItem::select(
            'credit_notes.id as credit_note_id',
            'credit_notes.credit_note_no',
            'credit_notes.generated_at',
            'credit_notes.reason_type',
            'order_items.order_id',
            'order_items.quantity',
            'credit_note_items.quantity as credit_note_quantity',
            'credit_note_items.amount as credit_note_amount',
            'order_items.master_product_variant_id',
            'order_items.discounted_price',
            'order_items.price',
            'order_items.discount',
            'order_items.tax_percentage',
            'orders.discount as order_discount',
            'orders.promo_discount as order_promo_discount',
            'orders.scheme_discount as order_scheme_discount',
            'order_items.created_at as item_created_at',
            'order_items.product_name',
            'order_items.variant_name',
            'orders.invoice_number',
            'orders.placed_by_salesman_id',
            'orders.loading_slip_id',
            'retailer_profiles.party_name',
            'retailer_profiles.shop_name',
            'rp_area.name as rp_area_name',
            'users.mobile as user_mobile',
            'orders.mobile as order_mobile',
            'retailer_profiles.gst_no',
            'users.name as user_name',
            // The retailer's own address (profile) — the retailer app creates no saved delivery
            // address, so these are what fills the Party Address columns for them.
            'retailer_profiles.address as rp_profile_address',
            'retailer_profiles.address_line1 as rp_address_line1',
            'retailer_profiles.address_line2 as rp_address_line2',
            'retailer_profiles.city as rp_profile_city',
            'retailer_profiles.state as rp_profile_state',
            'rp_area.pincode as rp_area_pincode',
            'ua.address as ua_address',
            'ua.landmark as ua_landmark',
            'ua.area as ua_area',
            'ua.city as ua_city',
            'ua.state as ua_state',
            'rp_city.state as rp_city_state',
            'rp_area.state as rp_area_state',
            'ua.pincode as ua_pincode',
            'salesman.name as salesman_name',
            DB::raw('COALESCE(mpv.unit_id, pv.stock_unit_id) as unit_id'),
            DB::raw('COALESCE(u.short_code, u2.short_code) as unit_symbol'),
            DB::raw('(SELECT mp.hsn FROM master_products mp
                      INNER JOIN master_product_variants mpv2 ON mpv2.master_product_id = mp.id
                      WHERE mpv2.id = order_items.master_product_variant_id LIMIT 1) as hsn'),
            DB::raw('(SELECT rr.reason FROM return_requests rr
                      WHERE rr.order_item_id = credit_note_items.order_item_id
                      AND rr.status = ' . ReturnStatusList::$rApproved . '
                      ORDER BY rr.id DESC LIMIT 1) as return_reason')
        )
            ->join('credit_notes', 'credit_note_items.credit_note_id', '=', 'credit_notes.id')
            ->leftJoin('order_items', 'credit_note_items.order_item_id', '=', 'order_items.id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles', 'orders.user_id', '=', 'retailer_profiles.user_id')
            ->leftJoin('areas as rp_area', 'retailer_profiles.area_id', '=', 'rp_area.id')
            ->leftJoin('cities as rp_city', 'retailer_profiles.city_id', '=', 'rp_city.id')
            ->leftJoin('user_addresses as ua', 'orders.address_id', '=', 'ua.id')
            ->leftJoin('salesmen as salesman', 'orders.placed_by_salesman_id', '=', 'salesman.id')
            ->leftJoin('master_product_variants as mpv', 'order_items.master_product_variant_id', '=', 'mpv.id')
            ->leftJoin('units as u', 'mpv.unit_id', '=', 'u.id')
            ->leftJoin('product_variants as pv', 'order_items.product_variant_id', '=', 'pv.id')
            ->leftJoin('units as u2', 'pv.stock_unit_id', '=', 'u2.id')
            ->where('credit_notes.seller_id', $seller_id);

        if ($orderId) {
            $rows = $rows->where('credit_notes.order_id', $orderId);
        }

        if ($startDate && $endDate) {
            $rows = $rows->whereBetween('credit_notes.generated_at', [$startDate, $endDate]);
        }

        $rows = $rows->orderBy('credit_notes.id')->orderBy('credit_note_items.id')->get();

        // Loading slip (vehicle/driver) is per-order, batched separately — same approach
        // as the Sales export.
        $slipIds = $rows->pluck('loading_slip_id')->filter()->unique();
        $slips = $slipIds->isEmpty() ? collect() : DB::table('loading_slips as ls')
            ->leftJoin('vehicles as v', 'ls.vehicle_id', '=', 'v.id')
            ->leftJoin('delivery_boys as db', 'ls.driver_id', '=', 'db.id')
            ->whereIn('ls.id', $slipIds)
            ->get(['ls.id', 'ls.slip_no', 'v.vehicle_number', 'db.name as driver_name'])
            ->keyBy('id');

        $headers = $this->tallyVoucherHeaders();

        // A short-delivery credit note is stored net of the cash discount share on the missing
        // goods (qty x unit price - stored amount). That share goes in the COD DISCOUNT column,
        // keeping the export equal to the stored credit note. Credit notes saved before this rule
        // have amount = qty x price, so they get 0.
        $itemNames = $this->tallyItemNames($rows->pluck('master_product_variant_id')->all());

        $cashShareByCreditNote = [];
        foreach ($rows as $r) {
            if ($r->reason_type !== 'partial') continue;
            $gross = (float) $r->credit_note_quantity * (float) ($r->discounted_price ?: $r->price);
            $cashShareByCreditNote[$r->credit_note_id] = ($cashShareByCreditNote[$r->credit_note_id] ?? 0)
                + max(0, round($gross - (float) $r->credit_note_amount, 2));
        }

        $sheetRows = [];
        $seenCreditNotes = [];
        foreach ($rows as $row) {
            $partyName = $this->tallyPartyLedgerName($row);
            $itemName = $this->tallyLineItemName($row, $itemNames);
            $slip = $row->loading_slip_id ? ($slips[$row->loading_slip_id] ?? null) : null;

            $partyState = $this->tallyPartyState($row);
            $supplyType = ($partyState && $sellerState && strcasecmp($partyState, $sellerState) === 0)
                ? 'INTRA_STATE' : 'INTER_STATE';

            // "first row of the order" per the header — here that's the first row of
            // this credit note (the voucher being built), mirroring exportOrdersCsv()'s
            // own first-row-only dedup so the amount isn't repeated on every line.
            $isFirstRowOfCreditNote = !isset($seenCreditNotes[$row->credit_note_id]);
            $seenCreditNotes[$row->credit_note_id] = true;
            $invoiceDiscountAmt = '';
            $codDiscountAmt = '';
            if ($isFirstRowOfCreditNote) {
                $orderDiscount = (float) $row->order_discount + (float) $row->order_promo_discount + (float) $row->order_scheme_discount;
                $invoiceDiscountAmt = $orderDiscount > 0 ? $orderDiscount : '';

                $codShare = (float) ($cashShareByCreditNote[$row->credit_note_id] ?? 0);
                $codDiscountAmt = $codShare > 0 ? $codShare : '';
            }

            $dispatchedThrough = $row->placed_by_salesman_id && $row->salesman_name
                ? $row->salesman_name . ' (Salesman)'
                : 'Self - Retailer App Order';

            $partyAddress = $this->tallyPartyAddress($row);

            $narration = match ($row->reason_type) {
                'return'  => $row->return_reason ?: ('Sales Return - Order #' . $row->order_id),
                'partial' => 'Partial Delivery Shortfall - Order #' . $row->order_id,
                default   => 'Order Cancelled - Order #' . $row->order_id,
            };

            $quantity = $row->reason_type === 'partial' ? $row->credit_note_quantity : $row->quantity;

            $sheetRows[] = [
                'Credit Note',
                Carbon::parse($row->generated_at)->format('d-m-Y'),
                $row->credit_note_no,
                $partyName,
                $this->tallyPartyMobile($row),
                $this->tallyPartyMobile($row),
                $row->gst_no,
                $partyState,
                $supplyType,
                $row->invoice_number ?: ('#' . $row->order_id),
                $row->item_created_at ? Carbon::parse($row->item_created_at)->format('d-m-Y') : '',
                'Sales Returns',
                $itemName,
                $row->hsn,
                $quantity,
                $row->unit_symbol,
                $row->price,
                $row->discount ?: 0,
                $invoiceDiscountAmt,
                $codDiscountAmt,
                '',
                $row->tax_percentage,
                '',
                'Order ' . $row->order_id,
                $partyAddress['line1'],
                $partyAddress['pincode'],
                $slip->vehicle_number ?? '',
                $slip->slip_no ?? '',
                $partyAddress['area'],
                $dispatchedThrough,
                $slip->driver_name ?? '',
                $narration,
            ];
        }

        return [$headers, $sheetRows];
    }

    /**
     * Product Master export — Tally "Sarthi Excel Import > Import Items / Products"
     * template. Column layout matches the client's Products.xlsx sample exactly.
     * One row per master-catalog variant this distributor has listed (seller_products),
     * named like "Product (4 NOS/CTN)" — the same name the Sales / Credit Note vouchers use
     * for that variant, so imported invoice lines find their stock item in Tally.
     * Not gated on settled/verified — this is a catalog export, not a transaction one.
     */
    public function exportProductMasterXlsx(Request $request)
    {
        $seller_id = auth()->user()->seller->id;

        $rows = DB::table('seller_products as sp')
            ->join('master_product_variants as mpv', 'mpv.id', '=', 'sp.master_product_variant_id')
            ->join('master_products as mp', 'mp.id', '=', 'mpv.master_product_id')
            ->leftJoin('categories as c', 'mp.category_id', '=', 'c.id')
            ->leftJoin('units as u1', 'mpv.unit_id', '=', 'u1.id')
            ->leftJoin('units as u2', 'mpv.secondary_unit_id', '=', 'u2.id')
            ->leftJoin('taxes as t', 'mp.tax_id', '=', 't.id')
            ->where('sp.seller_id', $seller_id)
            ->where('sp.status', 1)
            ->select(
                'mpv.id as variant_id',
                'mp.name as product_name',
                'mpv.sku',
                'mp.category_id',
                'c.name as category_name',
                'u1.short_code as base_unit',
                'u2.short_code as alt_unit',
                'mpv.secondary_unit_value',
                'mp.hsn',
                't.percentage as gst_rate',
                'mp.short_description'
            )
            ->distinct()
            ->orderBy('mp.name')
            ->orderBy('mpv.sku')
            ->get();

        $headers = [
            'Item Name (exact Tally name)',
            'Stock Group (inside Sarthi Stock; blank = Sarthi Stock)',
            'Base Unit (e.g. Pcs)',
            'Alternate Unit (blank = none)',
            'Conversion (Base units in 1 Alternate unit)',
            'HSN/SAC',
            'GST Rate % (5 = 5%)',
            'Description (HSN/SAC goods description)',
        ];

        $itemNames = $this->tallyItemNames($rows->pluck('variant_id')->all());

        // Stock Group = the top-level (global) category; the product's own category goes in the
        // description column, so the group stays broad (e.g. "OIL /GHEE") and the detail is kept.
        $categories = DB::table('categories')->get(['id', 'name', 'parent_id'])->keyBy('id');

        $sheetRows = [];
        foreach ($rows as $row) {
            $sheetRows[] = [
                $itemNames[$row->variant_id] ?? $row->product_name,
                $this->rootCategoryName($row->category_id, $categories),
                $row->base_unit,
                $row->alt_unit,
                $row->alt_unit ? $row->secondary_unit_value : '',
                $row->hsn,
                $row->gst_rate,
                $row->category_name,
            ];
        }

        return $this->downloadXlsx($headers, $sheetRows, 'Products.xlsx');
    }

    /**
     * Cash Receipt export — Tally "Receipt Voucher" import template, cash payments only.
     * Column layout matches the client's ReceiptCash.xlsx sample exactly.
     */
    public function exportCashReceiptCsv(Request $request)
    {
        $seller_id = auth()->user()->seller->id;

        $startDate = $request->filled('startDate')
            ? Carbon::parse($request->input('startDate'))->startOfDay()
            : null;
        $endDate = $request->filled('endDate')
            ? Carbon::parse($request->input('endDate'))->endOfDay()
            : null;

        // Cash + Bank(UPI) together, one file — client wants a single Receipt Voucher
        // import for both, not split like the cheque/PDC one. UPI rows go to the "Bank"
        // ledger; UTR/Payer VPA stay blank for them: order_payments has no columns for
        // those (method is a bare enum, no txn reference is captured anywhere).
        $rows = OrderPayment::select(
            'order_payments.id',
            'order_payments.order_id',
            'order_payments.method',
            'order_payments.amount',
            'order_payments.created_at as payment_created_at',
            'orders.invoice_number',
            'retailer_profiles.party_name',
            'retailer_profiles.shop_name',
            'rp_area.name as rp_area_name',
            'users.name as user_name',
            'delivery_boys.name as delivery_boy_name',
            'salesmen.name as salesman_name'
        )
            ->join('orders', 'order_payments.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles', 'orders.user_id', '=', 'retailer_profiles.user_id')
            ->leftJoin('areas as rp_area', 'retailer_profiles.area_id', '=', 'rp_area.id')
            ->leftJoin('delivery_boys', 'order_payments.delivery_boy_id', '=', 'delivery_boys.id')
            ->leftJoin('salesmen', 'order_payments.salesman_id', '=', 'salesmen.id')
            // orders carry no seller_id of their own — an order can hold items from
            // several distributors, so scoping is via order_items.seller_id instead.
            ->whereExists(function ($q) use ($seller_id) {
                $q->select(DB::raw(1))
                    ->from('order_items')
                    ->whereColumn('order_items.order_id', 'orders.id')
                    ->where('order_items.seller_id', $seller_id);
            })
            // UPI is only a real receipt once the distributor has verified it. Cash never
            // goes through that verification — it's reconciled at trip level via
            // cash_received, and SettlementController treats it as implicitly verified —
            // so its order_payments.status stays 'pending' forever and must not be
            // filtered on, or every cash receipt silently drops out of this export.
            ->where(function ($q) {
                $q->where('order_payments.method', 'cash')
                    ->orWhere(function ($q2) {
                        $q2->where('order_payments.method', 'upi')
                            ->where('order_payments.status', 'verified');
                    });
            });

        if ($startDate && $endDate) {
            $rows = $rows->whereBetween('order_payments.created_at', [$startDate, $endDate]);
        }

        $rows = $rows->orderBy('order_payments.created_at')->get();

        $headers = [
            "Voucher Type\n(exact Tally name)",
            "Voucher Date\n(DD-MM-YYYY text)",
            'Receipt No',
            "Party Ledger\n(exact Tally name)",
            "Party Alias\n(used if Party blank)",
            'Receipt Amount',
            "Cash / Bank Ledger\n(exact Tally name)",
            "Payment Mode\nCash/UPI/NEFT/IMPS",
            'UTR / Txn ID',
            'Payer VPA (optional)',
            "Against Invoice No\n(blank = On Account)",
            "Bill-wise Amount\n(blank = auto)",
            'On Account Amount',
            'Narration',
            'Order Ref',
            'Received By',
        ];

        $sheetRows = [];
        foreach ($rows as $row) {
            $partyName = $this->tallyPartyLedgerName($row);
            $invoiceNo = $row->invoice_number ?: ('#' . $row->order_id);
            $receivedBy = $row->delivery_boy_name ?: ($row->salesman_name ?: '');
            $isCash = $row->method === 'cash';

            $sheetRows[] = [
                'Receipt',
                Carbon::parse($row->payment_created_at)->format('d-m-Y'),
                'RC-' . $row->id,
                $partyName,
                '',
                (float) $row->amount,
                $isCash ? 'Cash' : 'Bank',
                $isCash ? 'Cash' : 'UPI',
                '',
                '',
                $invoiceNo,
                '',
                '',
                'Received against ' . $invoiceNo,
                'Order ' . $row->order_id,
                $receivedBy,
            ];
        }

        return $this->downloadXlsx($headers, $sheetRows, 'ReceiptCashBank.xlsx');
    }

    /**
     * PDC (post-dated cheque) Receipt export — Tally "Receipt Voucher" import
     * template, cheque payments only. Column layout matches ReceiptPDC.xlsx sample.
     */
    public function exportPdcReceiptCsv(Request $request)
    {
        $seller_id = auth()->user()->seller->id;

        $startDate = $request->filled('startDate')
            ? Carbon::parse($request->input('startDate'))->startOfDay()
            : null;
        $endDate = $request->filled('endDate')
            ? Carbon::parse($request->input('endDate'))->endOfDay()
            : null;

        $rows = OrderPayment::select(
            'order_payments.id',
            'order_payments.order_id',
            'order_payments.amount',
            'order_payments.cheque_number',
            'order_payments.cheque_date',
            'order_payments.created_at as payment_created_at',
            'orders.invoice_number',
            'retailer_profiles.party_name',
            'retailer_profiles.shop_name',
            'rp_area.name as rp_area_name',
            'users.mobile as user_mobile',
            'orders.mobile as order_mobile',
            'users.name as user_name',
            'delivery_boys.name as delivery_boy_name',
            'salesmen.name as salesman_name'
        )
            ->join('orders', 'order_payments.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles', 'orders.user_id', '=', 'retailer_profiles.user_id')
            ->leftJoin('areas as rp_area', 'retailer_profiles.area_id', '=', 'rp_area.id')
            ->leftJoin('delivery_boys', 'order_payments.delivery_boy_id', '=', 'delivery_boys.id')
            ->leftJoin('salesmen', 'order_payments.salesman_id', '=', 'salesmen.id')
            // orders carry no seller_id of their own — an order can hold items from
            // several distributors, so scoping is via order_items.seller_id instead.
            ->whereExists(function ($q) use ($seller_id) {
                $q->select(DB::raw(1))
                    ->from('order_items')
                    ->whereColumn('order_items.order_id', 'orders.id')
                    ->where('order_items.seller_id', $seller_id);
            })
            ->where('order_payments.method', 'cheque')
            // Only export payments the distributor has actually verified — an
            // unverified collection isn't a real receipt yet.
            ->where('order_payments.status', 'verified');

        if ($startDate && $endDate) {
            $rows = $rows->whereBetween('order_payments.created_at', [$startDate, $endDate]);
        }

        $rows = $rows->orderBy('order_payments.created_at')->get();

        $headers = [
            "Voucher Type\n(exact Tally name)",
            "Voucher Date\n(DD-MM-YYYY text)",
            'Receipt No',
            "Party Ledger\n(exact Tally name)",
            'Party Alias',
            'MOBILE NO',
            'Receipt Amount',
            "Bank Ledger\n(where cheque is deposited)",
            "Payment Mode\n(Cheque)",
            "UTR / Txn ID\n(blank for cheque)",
            "Payer VPA\n(blank for cheque)",
            'Against Invoice No',
            "Bill-wise Amount\n(blank = full amount)",
            'On Account Amount',
            'Narration',
            'Order Ref',
            'Received By',
            'Cheque No',
            "Cheque Date\n(DD-MM-YYYY text)",
            "Drawee Bank\n(party's bank)",
            'Post Dated\n(Yes / No)',
        ];

        $sheetRows = [];
        foreach ($rows as $row) {
            $partyName = $this->tallyPartyLedgerName($row);
            $invoiceNo = $row->invoice_number ?: ('#' . $row->order_id);
            $receivedBy = $row->delivery_boy_name ?: ($row->salesman_name ?: '');
            $chequeDate = $row->cheque_date ? Carbon::parse($row->cheque_date) : null;
            $voucherDate = Carbon::parse($row->payment_created_at);
            $postDated = $chequeDate && $chequeDate->gt($voucherDate) ? 'Yes' : 'No';

            $sheetRows[] = [
                'Receipt',
                $voucherDate->format('d-m-Y'),
                'RP-' . $row->id,
                $partyName,
                $this->tallyPartyMobile($row),
                $this->tallyPartyMobile($row),
                (float) $row->amount,
                'PDC CHQ',
                'Cheque',
                '',
                '',
                $invoiceNo,
                '',
                '',
                'PDC against ' . $invoiceNo . ' - cheque ' . $row->cheque_number
                    . ($chequeDate ? ' dated ' . $chequeDate->format('d-m-Y') : ''),
                'Order ' . $row->order_id,
                $receivedBy,
                $row->cheque_number,
                $chequeDate ? $chequeDate->format('d-m-Y') : '',
                '',
                $postDated,
            ];
        }

        return $this->downloadXlsx($headers, $sheetRows, 'ReceiptPDC.xlsx');
    }

    /**
     * Receipts export — Cash, Bank and PDC (cheque) receipts in one Tally "Receipt Voucher"
     * import file, on the PDC layout (ReceiptPDC.xlsx). The Bank Ledger / Payment Mode columns say
     * which kind a row is: Cash / Cash, Bank / Bank, PDC CHQ / Cheque. Cash and bank rows leave the
     * cheque columns (Cheque No, Cheque Date, Drawee Bank, Post Dated) blank — those are cheque
     * facts only. Same gate as the separate exports: cash always (it's reconciled at trip level and
     * never gets verified), bank (stored as 'upi') and cheque only once the distributor verified them.
     */
    public function exportReceiptsCsv(Request $request)
    {
        $seller_id = auth()->user()->seller->id;

        $startDate = $request->filled('startDate')
            ? Carbon::parse($request->input('startDate'))->startOfDay()
            : null;
        $endDate = $request->filled('endDate')
            ? Carbon::parse($request->input('endDate'))->endOfDay()
            : null;

        $rows = OrderPayment::select(
            'order_payments.id',
            'order_payments.order_id',
            'order_payments.method',
            'order_payments.amount',
            'order_payments.cheque_number',
            'order_payments.cheque_date',
            'order_payments.created_at as payment_created_at',
            'orders.invoice_number',
            'retailer_profiles.party_name',
            'retailer_profiles.shop_name',
            'rp_area.name as rp_area_name',
            'users.mobile as user_mobile',
            'orders.mobile as order_mobile',
            'users.name as user_name',
            'delivery_boys.name as delivery_boy_name',
            'salesmen.name as salesman_name'
        )
            ->join('orders', 'order_payments.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles', 'orders.user_id', '=', 'retailer_profiles.user_id')
            ->leftJoin('areas as rp_area', 'retailer_profiles.area_id', '=', 'rp_area.id')
            ->leftJoin('delivery_boys', 'order_payments.delivery_boy_id', '=', 'delivery_boys.id')
            ->leftJoin('salesmen', 'order_payments.salesman_id', '=', 'salesmen.id')
            // orders carry no seller_id of their own — an order can hold items from
            // several distributors, so scoping is via order_items.seller_id instead.
            ->whereExists(function ($q) use ($seller_id) {
                $q->select(DB::raw(1))
                    ->from('order_items')
                    ->whereColumn('order_items.order_id', 'orders.id')
                    ->where('order_items.seller_id', $seller_id);
            })
            ->where(function ($q) {
                $q->where('order_payments.method', 'cash')
                    ->orWhere(function ($q2) {
                        $q2->whereIn('order_payments.method', ['upi', 'cheque'])
                            ->where('order_payments.status', 'verified');
                    });
            });

        if ($startDate && $endDate) {
            $rows = $rows->whereBetween('order_payments.created_at', [$startDate, $endDate]);
        }

        $rows = $rows->orderBy('order_payments.created_at')->orderBy('order_payments.id')->get();

        $headers = [
            "Voucher Type\n(exact Tally name)",
            "Voucher Date\n(DD-MM-YYYY text)",
            'Receipt No',
            "Party Ledger\n(exact Tally name)",
            'Party Alias',
            'MOBILE NO',
            'Receipt Amount',
            "Cash / Bank Ledger\n(exact Tally name)",
            "Payment Mode\n(Cash / Bank / Cheque)",
            'UTR / Txn ID',
            'Payer VPA',
            'Against Invoice No',
            "Bill-wise Amount\n(blank = full amount)",
            'On Account Amount',
            'Narration',
            'Order Ref',
            'Received By',
            'Cheque No',
            "Cheque Date\n(DD-MM-YYYY text)",
            "Drawee Bank\n(party's bank)",
            "Post Dated\n(Yes / No, cheques only)",
        ];

        $sheetRows = [];
        foreach ($rows as $row) {
            $partyName = $this->tallyPartyLedgerName($row);
            $invoiceNo = $row->invoice_number ?: ('#' . $row->order_id);
            $receivedBy = $row->delivery_boy_name ?: ($row->salesman_name ?: '');
            $voucherDate = Carbon::parse($row->payment_created_at);

            $isCheque = $row->method === 'cheque';
            $mode = match ($row->method) {
                'cash'   => 'Cash',
                'cheque' => 'Cheque',
                default  => 'Bank',
            };

            $chequeDate = $isCheque && $row->cheque_date ? Carbon::parse($row->cheque_date) : null;
            $postDated = '';
            if ($isCheque) {
                $postDated = $chequeDate && $chequeDate->gt($voucherDate) ? 'Yes' : 'No';
            }

            $sheetRows[] = [
                'Receipt',
                $voucherDate->format('d-m-Y'),
                ($isCheque ? 'RP-' : 'RC-') . $row->id,
                $partyName,
                $this->tallyPartyMobile($row),
                $this->tallyPartyMobile($row),
                (float) $row->amount,
                $isCheque ? 'PDC CHQ' : $mode,
                $mode,
                '',
                '',
                $invoiceNo,
                '',
                '',
                $isCheque
                    ? 'PDC against ' . $invoiceNo . ' - cheque ' . $row->cheque_number
                        . ($chequeDate ? ' dated ' . $chequeDate->format('d-m-Y') : '')
                    : 'Received against ' . $invoiceNo,
                'Order ' . $row->order_id,
                $receivedBy,
                $isCheque ? $row->cheque_number : '',
                $chequeDate ? $chequeDate->format('d-m-Y') : '',
                '',
                $postDated,
            ];
        }

        return $this->downloadXlsx($headers, $sheetRows, 'Receipts.xlsx');
    }

    /**
     * Header row shared by the Sales and Credit Note vouchers (one 32-column Tally layout, the
     * Voucher Type column says which voucher a row is). Wording is verbatim from the client's
     * CreditNote.xlsx sample, including which columns use \n vs a plain space. Discount columns
     * are positive for both vouchers — Tally reads positive for all.
     */
    private function tallyVoucherHeaders(): array
    {
        return [
            "Voucher Type\n(exact Tally name)",
            "Voucher Date\n(DD-MM-YYYY text)",
            'Voucher No',
            "Party Ledger\n(exact Tally name)",
            "Party Alias\n(used if Party blank)",
            'MOBILE NO',
            'Party GSTIN',
            "Place of Supply\n(STATE e.g. Gujarat)",
            "Supply Type\nINTRA_STATE / INTER_STATE",
            "Bill Ref No\nSales: blank = Voucher No\nCN: Against Invoice No",
            "Bill Ref Date\nCN: Orig. Invoice Date",
            'Sales / Sales Return Ledger',
            "Stock Item Name\n(exact Tally name)",
            "HSN/SAC\n(needed for new item)",
            'Quantity',
            "Unit\n(Tally unit symbol;\nneeded for new item)",
            'Rate',
            "Item Discount %\n(2 = 2% off)",
            "Invoice Discount (amt)\n(first row of the order;\n100 = Rs 100 off)",
            'COD DISCOUNT',
            'Delivery Charge',
            "GST Rate %\n(5 = 5%)",
            "Godown\n(blank = Main Location)",
            'Order Ref',
            "Party Address Line 1\n(address, city, state, PIN)",
            'Party Pincode (6 digits)',
            'Vehicle No',
            'Loading Slip No',
            'Destination (Area)',
            'Dispatched Through (Salesman / Self - Retailer App Order)',
            'Driver Name (Carrier Name/Agent)',
            'Narration',
        ];
    }

    /**
     * Retailer's mobile number for the Party Alias column: digits only, the account's own number
     * first, then the one on the order. Blank when neither is known.
     */
    private function tallyPartyMobile($row): string
    {
        foreach ([$row->user_mobile ?? null, $row->order_mobile ?? null] as $mobile) {
            $digits = preg_replace('/\D+/', '', (string) $mobile);
            if ($digits !== '') {
                return $digits;
            }
        }

        return '';
    }

    /**
     * Party Address Line 1, Pincode and Destination (Area) for the Sales and Credit Note vouchers —
     * the shared retailer-address rule, see CommonHelper::partyAddress(). Tally can't import
     * Address Line 2 / 3, so Line 1 carries the whole address: line 1, line 2, city, state, pincode.
     * A part Line 1 already contains is skipped (a retailer whose profile address is one full
     * Google address already ends with its own city / state / PIN), so nothing is repeated.
     */
    private function tallyPartyAddress($row): array
    {
        $address = CommonHelper::partyAddress($row);

        $parts = [];
        foreach ([$address['line1'], $address['line2'], $address['city'], $address['state'], $address['pincode']] as $part) {
            $part = trim((string) $part);
            if ($part !== '' && !preg_match('/\b' . preg_quote($part, '/') . '\b/iu', implode(', ', $parts))) {
                $parts[] = $part;
            }
        }
        $address['line1'] = implode(', ', $parts);

        return $address;
    }

    /**
     * Place of Supply state for the Sales / Credit Note vouchers. Retailers usually have no saved
     * delivery address (the retailer app doesn't create one), so after the order's address the
     * state of the retailer's city is used, then of their area. Supply Type is derived from it,
     * so an unknown state used to export every invoice as INTER_STATE.
     */
    private function tallyPartyState($row): ?string
    {
        foreach ([$row->ua_state ?? null, $row->rp_city_state ?? null, $row->rp_area_state ?? null] as $state) {
            $state = trim((string) $state);
            if ($state !== '') {
                return $state;
            }
        }

        return null;
    }

    /**
     * Party ledger name for every Tally export: "Shop name - Owner name" (just the shop name when the
     * retailer has no owner name). Falls back to party name or user name when there is no shop name.
     */
    private function tallyPartyLedgerName($row): string
    {
        $shopName = trim((string) ($row->shop_name ?: ($row->party_name ?: '')));
        $owner = trim((string) ($row->user_name ?? ''));

        if ($shopName !== '' && $owner !== '' && strcasecmp($shopName, $owner) !== 0) {
            return $shopName . ' - ' . $owner;
        }

        return $shopName !== '' ? $shopName : $owner;
    }

    /**
     * Name of the top-level category a category sits under (the category itself when it has no
     * parent). $categories is id => {name, parent_id}. The step limit just guards a bad parent loop.
     */
    private function rootCategoryName($categoryId, $categories): ?string
    {
        $node = $categories->get($categoryId);
        for ($i = 0; $node && $i < 10; $i++) {
            $parent = $node->parent_id ? $categories->get($node->parent_id) : null;
            if (!$parent) {
                break;
            }
            $node = $parent;
        }

        return $node->name ?? null;
    }

    /**
     * Tally stock-item names for master variants, keyed by variant id: "Product (4 NOS/CTN)" —
     * the product name plus pieces / base unit / outer-pack unit, the way the client's own item
     * list reads. Product Master, Sales and Credit Note all take the name from here so a voucher
     * line always matches the item created from the master. A variant with no outer pack is just
     * the product name; where two variants of one product would get the same name, the SKU is
     * added to each so Tally keeps them as separate items.
     */
    private function tallyItemNames(array $variantIds): array
    {
        $variantIds = array_values(array_unique(array_filter($variantIds)));
        if (!$variantIds) {
            return [];
        }

        $productIds = DB::table('master_product_variants')->whereIn('id', $variantIds)->pluck('master_product_id')->unique();

        // All sibling variants, not just the exported ones, so a name is the same whichever
        // export asks for it.
        $variants = DB::table('master_product_variants as v')
            ->join('master_products as p', 'p.id', '=', 'v.master_product_id')
            ->leftJoin('units as u1', 'u1.id', '=', 'v.unit_id')
            ->leftJoin('units as u2', 'u2.id', '=', 'v.secondary_unit_id')
            ->whereIn('v.master_product_id', $productIds)
            ->get([
                'v.id', 'v.master_product_id', 'v.sku', 'v.unit_id', 'v.secondary_unit_id', 'v.secondary_unit_value',
                'p.name as product_name', 'u1.short_code as unit_code', 'u1.name as unit_name',
                'u2.short_code as unit2_code', 'u2.name as unit2_name',
            ]);

        $names = [];
        $byName = [];
        foreach ($variants as $v) {
            $name  = trim((string) $v->product_name);
            $count = (float) $v->secondary_unit_value;

            // An outer pack only means something when it is a different unit from the base one.
            if ($count > 0 && $v->unit_id && $v->secondary_unit_id && (int) $v->unit_id !== (int) $v->secondary_unit_id) {
                $name .= ' (' . rtrim(rtrim(number_format($count, 2, '.', ''), '0'), '.') . ' '
                    . ($v->unit_code ?: $v->unit_name) . '/' . ($v->unit2_code ?: $v->unit2_name) . ')';
            }

            $names[$v->id] = $name;
            $byName[$v->master_product_id][$name][] = $v;
        }

        foreach ($byName as $sameName) {
            foreach ($sameName as $group) {
                if (count($group) < 2) continue;
                foreach ($group as $v) {
                    $names[$v->id] .= ' - ' . (trim((string) $v->sku) !== '' ? trim((string) $v->sku) : '#' . $v->id);
                }
            }
        }

        return $names;
    }

    /**
     * Item name for an order / credit-note line, from the master variant's name (see
     * tallyItemNames) rather than the one saved on the line: retailer-app orders save
     * "SKU | 20 Nos/Bag" there and salesman orders just the SKU, so the same product would
     * export under two names.
     */
    private function tallyLineItemName($row, array $itemNames): string
    {
        if (!empty($row->master_product_variant_id) && isset($itemNames[$row->master_product_variant_id])) {
            return $itemNames[$row->master_product_variant_id];
        }

        // Older lines pre-date the master catalog: no variant to read from, use what was saved.
        return $row->variant_name ? $row->product_name . ' (' . $row->variant_name . ')' : $row->product_name;
    }

    /**
     * Shared writer for the receipt-voucher/Tally-import exports — one header row
     * (each \n becomes a wrapped line, matching the multi-line headers in the
     * client's sample workbooks) plus data rows, streamed as a real .xlsx file.
     */
    private function downloadXlsx(array $headers, array $rows, string $filename)
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        foreach ($headers as $i => $h) {
            $cell = $sheet->getCellByColumnAndRow($i + 1, 1);
            $cell->setValue($h);
            $cell->getStyle()->getAlignment()->setWrapText(true);
        }

        foreach ($rows as $rowNum => $row) {
            foreach ($row as $i => $v) {
                $sheet->setCellValueByColumnAndRow($i + 1, $rowNum + 2, $v);
            }
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'sarthi_export_');
        $writer->save($tempFile);

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    public function getReports(Request $request)
    {
        try {
            $sellerId = auth()->user()->seller->id;

            // Build query with joins to get customer information
            $query = DB::table('pos_orders')
                ->select(
                    'pos_orders.*',
                    DB::raw('CASE
                        WHEN pos_orders.pos_user_id IS NOT NULL THEN pos_users.name
                        WHEN pos_orders.user_id IS NOT NULL THEN users.name
                        ELSE "Cash Sale"
                    END as customer_name'),
                    DB::raw('CASE
                        WHEN pos_orders.pos_user_id IS NOT NULL THEN pos_users.phone
                        WHEN pos_orders.user_id IS NOT NULL THEN users.mobile
                        ELSE NULL
                    END as customer_mobile')
                )
                ->leftJoin('pos_users', 'pos_orders.pos_user_id', '=', 'pos_users.id')
                ->leftJoin('users', 'pos_orders.user_id', '=', 'users.id')
                ->where('pos_orders.store_id', $sellerId);

            // Apply date range filter if provided
            if ($request->has('startDate') && $request->has('endDate') && !empty($request->startDate) && !empty($request->endDate)) {
                $startDate = $request->startDate . ' 00:00:00';
                $endDate = $request->endDate . ' 23:59:59';
                $query->whereBetween('pos_orders.created_at', [$startDate, $endDate]);
            }

            // Apply payment method filter if provided
            if ($request->has('payment_method') && !empty($request->payment_method)) {
                $query->where('pos_orders.payment_method', $request->payment_method);
            }

            // Get results ordered by most recent first
            $orders = $query->orderBy('pos_orders.created_at', 'desc')->get();

            // Transform data to include order information
            $orders = $orders->map(function ($order) {
                return [
                    'id' => $order->id,
                    'pos_user_id' => $order->pos_user_id,
                    'user_id' => $order->user_id,
                    'store_id' => $order->store_id,
                    'customer_name' => $order->customer_name,
                    'customer_mobile' => $order->customer_mobile,
                    'total_amount' => $order->total_amount,
                    'payment_method' => $order->payment_method,
                    'created_at' => CommonHelper::formatDate($order->created_at),
                    'updated_at' => $order->updated_at
                ];
            });

            // Add summary data
            $summary = [
                'total_orders' => count($orders),
                'total_amount' => $orders->sum('total_amount'),
                'cash_payments' => $orders->where('payment_method', 'cash')->sum('total_amount'),
                'card_payments' => $orders->where('payment_method', 'card')->sum('total_amount'),
                'upi_payments' => $orders->where('payment_method', 'upi')->sum('total_amount'),
            ];

            return response()->json([
                'status' => true,
                'data' => $orders,
                'summary' => $summary
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching POS reports: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while fetching POS reports.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /* thermal print */
    public function thermalPrint(Request $request)
    {
        try {

            $seller = auth()->user()->seller;
            $sellerId = $seller->id;

            // order_id required
            if (!$request->order_id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Order ID is required for printing'
                ], 422);
            }

            $orderId = $request->order_id;


            //ORDER DATA
            $order = DB::table('pos_orders')
                ->where('id', $orderId)
                ->where('store_id', $sellerId)
                ->first();

            if (!$order) {
                return response()->json([
                    'status' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            // ORDER ITEMS
            $items = DB::table('pos_order_items as items')
                ->join('products', 'items.product_id', '=', 'products.id')
                ->select(
                    'products.name as product_name',
                    'items.unit_price',
                    'items.quantity',
                    'items.total_price'
                )
                ->where('items.pos_order_id', $orderId)
                ->get();

            //ADDITIONAL CHARGES

            $charges = DB::table('pos_additional_charges')
                ->where('pos_order_id', $orderId)
                ->select('charge_name', 'amount')
                ->get();


            //  RESPONSE FORMAT
            $orderData = [
                'order_id' => $order->id,
                'created_at' => $order->created_at,
                'payment_method' => $order->payment_method,

                'discount_amount' => $order->discount_amount,
                'discount_percentage' => $order->discount_percentage,

                'items' => $items->map(function ($i) {
                    return [
                        'name' => $i->product_name,
                        'unit_price' => $i->unit_price,
                        'qty' => $i->quantity,
                        'subtotal' => $i->total_price,
                    ];
                })->values(),

                'total_qty' => $items->sum('quantity'),
                'items_total' => $items->sum('total_price'),

                'additional_charges' => $charges,

                'grand_total' =>
                $items->sum('total_price')
                    - $order->discount_amount
                    + $charges->sum('amount'),
            ];

            return response()->json([
                'status' => true,
                'seller' => [
                    'name' => $seller->store_name ?? $seller->name,
                    'email' => $seller->email,
                    'mobile' => $seller->mobile,
                    'invoice_logo' => $seller->invoice_logo
                        ? asset('storage/' . $seller->invoice_logo)
                        : null,
                    'thermal_paper_width' => $seller->thermal_paper_width ?? 80
                ],
                'order' => $orderData
            ]);
        } catch (\Exception $e) {

            Log::error('Thermal Print Error: ' . $e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Thermal print failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get items for a specific POS order
     */
    public function getOrderItems($orderId)
    {
        try {
            $sellerId = auth()->user()->seller->id;

            // Check if the order belongs to this seller
            $order = DB::table('pos_orders')
                ->where('id', $orderId)
                ->where('store_id', $sellerId)
                ->first();

            if (!$order) {
                return response()->json([
                    'status' => false,
                    'message' => 'Order not found or does not belong to this seller'
                ], 404);
            }

            // Get order items
            $orderItems = DB::table('pos_order_items')
                ->select(
                    'pos_order_items.*',
                    'products.name as product_name'
                )
                ->leftJoin('products', 'pos_order_items.product_id', '=', 'products.id')
                ->where('pos_order_items.pos_order_id', $orderId)
                ->get();

            return response()->json([
                'status' => true,
                'data' => $orderItems
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching order items: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while fetching order items.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getSettings()
    {
        $variables = array(
            "app_name",
            "support_number",
            "support_email",
            "current_version",
            "minimum_version_required",
            "is_version_system_on",
            "ios_is_version_system_on",
            "currency",
            "currency_code",
            "decimal_point",
            "low_stock_limit",
            "app_mode_seller",
            "privacy_policy_seller",
            "terms_conditions_seller",
            "google_place_api_key",
            "app_mode_seller",
            "app_mode_seller_remark",
            "seller_commission",
            "text_gen_key",
            "self_pickup_mode",
            "phone_auth_otp",
            "firebase_authentication",
            "custom_sms_gateway_otp_based"
        );
        $settings = CommonHelper::getSettings($variables);
        $settings = CommonHelper::resolveTranslatedSettings($settings);

        $settings['type'] = Role::$roleSeller; // 3 for distributor/seller

        // Derive otp_provider for distributor app login screen
        if (!empty($settings['phone_auth_otp']) && $settings['phone_auth_otp'] == 1) {
            if (!empty($settings['firebase_authentication']) && $settings['firebase_authentication'] == 1) {
                $settings['otp_provider'] = 'firebase';
            } elseif (!empty($settings['custom_sms_gateway_otp_based']) && $settings['custom_sms_gateway_otp_based'] == 1) {
                $settings['otp_provider'] = 'custom_sms';
            } else {
                $settings['otp_provider'] = 'sms';
            }
            $settings['login_type'] = 'mobile';
        } else {
            $settings['otp_provider'] = 'none';
            $settings['login_type'] = 'email';
        }

        // Return user permissions and privacy settings only if a valid token is passed
        $user = auth('api')->user();
        if ($user) {
            $settings["allPermissions"] = $user->allPermissions;
            $seller = Seller::where('admin_id', $user->id)->first();
            if ($seller) {
                $settings["view_customer_detail"] = $seller->customer_privacy ?? 0;
                $settings["assign_delivery_boy"] = $seller->assign_delivery_boy ?? 0;
                $settings["view_order_otp"] = $seller->view_order_otp ?? 0;
                $settings["change_order_status_delivered"] = $seller->change_order_status_delivered ?? 0;
            }
        }
        $settings["demo_mode"] = env('DEMO_MODE', 0);
        $settings = json_encode($settings);
        $settings = base64_encode($settings);
        if (!empty($settings)) {
            return CommonHelper::responseWithData($settings);
        } else {
            return CommonHelper::responseError('No settings found!');
        }
    }
    public function getPrivacyPolicy()
    {
        $variables = array(
            "privacy_policy_seller",
            "terms_conditions_seller",
        );
        $settings = CommonHelper::getSettings($variables);
        $settings = CommonHelper::resolveTranslatedSettings($settings);
        if (!empty($settings)) {
            return CommonHelper::responseWithData($settings);
        } else {
            return CommonHelper::responseError('No settings found!');
        }
    }

    public function getPolicies(Request $request)
    {
        $request->validate([
            'is_seller' => 'required|in:0,1'
        ]);

        if ($request->is_seller == 1) {
            $variables = array(
                "privacy_policy_seller",
                "terms_conditions_seller",
                "app_mode_seller_remark"
            );
        } else {
            $variables = array(
                "privacy_policy_delivery_boy",
                "terms_conditions_delivery_boy",
                "app_mode_delivery_boy_remark"
            );
        }
        $settings = CommonHelper::getSettings($variables);
        $settings = CommonHelper::resolveTranslatedSettings($settings);

        unset($settings['currency'], $settings['currency_code'], $settings['decimal_point']);

        if (!empty($settings)) {
            return CommonHelper::responseWithData($settings);
        } else {
            return CommonHelper::responseError('No settings found!');
        }
    }
    public function getDeliveryBoys(Request $request)
    {
        $limit = ($request->limit) ?? 10;
        $offset = ($request->offset) ?? 0;

        $seller_id = auth()->user()->seller->id;

        // Strictly this distributor's own drivers only — unassigned drivers
        // (seller_id null/0) used to leak into every distributor's dropdown here.
        $deliveryBoys = DeliveryBoy::with(['admin', 'translations'])
            ->forSeller($seller_id);

        // No zone filter: a distributor's drivers report directly to them, not to a zone.

        // Filter by status if specified in the request
        if ($request->has('filterStatus') && $request->input('filterStatus') !== '') {
            $deliveryBoys->where('status', $request->filterStatus);
        } elseif ($request->has('status') && $request->input('status') !== '') {
            $deliveryBoys->where('status', $request->status);
        } elseif (!$request->has('filterStatus') && !$request->has('status')) {
            // Default to active delivery boys if status is not requested at all
            $deliveryBoys->where('status', 1);
        }

        // Filter by search term if provided
        if ($request->filled('search')) {
            $search = $request->search;
            $deliveryBoys->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('mobile', 'like', "%{$search}%");
            });
        }

        $totalDeliveryBoys = clone $deliveryBoys;
        $totalDeliveryBoys = $totalDeliveryBoys->count();

        $deliveryBoys = $deliveryBoys->orderBy('id', 'DESC')->skip($offset)->take($limit)->get();

        foreach ($deliveryBoys as $db) {
            $db->email = $db->admin ? $db->admin->email : '';
        }

        DeliveryBoy::limitCashToSeller($deliveryBoys, $seller_id);

        return CommonHelper::responseWithData($deliveryBoys, $totalDeliveryBoys);
    }

    public function getCities()
    {
        $cities = City::select('id', 'name', 'state', 'formatted_address', 'latitude', 'longitude')->orderBy('id', 'DESC')->get();
        if (empty($cities)) {
            return CommonHelper::responseError('Cities not found.');
        }
        return CommonHelper::responseWithData($cities);
    }
    public function getMainCategories(Request $request)
    {
        $seller_id = auth()->user()->seller->id;
        $seller = Seller::where('id', $seller_id)->first();

        $query = Category::orderBy('name', 'ASC');

        if (isset($request->category_id) && $request->category_id !== 0) {
            $query->where("parent_id", $request->category_id);
        } else {
            $query->whereIn('id', explode(",", $seller->categories));
        }

        if (isset($request->search) && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', '%' . $searchTerm . '%');
        }

        $userCategories = $query->get();
        $total = $userCategories->count();

        return CommonHelper::responseWithData($userCategories, $total);
    }
    public function deploy()
    {
        exec("git pull");
        exec("composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev");
        exec("php artisan migrate");
        echo "Done";
    }
}
