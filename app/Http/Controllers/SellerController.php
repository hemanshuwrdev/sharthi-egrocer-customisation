<?php

namespace App\Http\Controllers;

use App\Helpers\CommonHelper;
use App\Http\Controllers\API\OrderStatusApiController;
use App\Models\Category;
use App\Models\City;
use App\Models\DeliveryBoy;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusList;
use App\Models\PanelNotification;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ReturnRequest;
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
        $productsIds = Product::where('seller_id', $seller_id)->get()->pluck('id')->toArray() ?? [];
        $productsIds_stock = Product::where('seller_id', $seller_id)->where('is_unlimited_stock', 0)->get()->pluck('id')->toArray() ?? [];

        $data = array();

        $data['order_count'] = Order::whereIn('id', $orderIds)->count() ?? 0;

        $ignoreStatus = array(
            OrderStatusList::$paymentPending,
            OrderStatusList::$delivered,
            OrderStatusList::$cancelled,
            OrderStatusList::$returned,
        );
        $data['pending_order_count'] = Order::whereIn('id', $orderIds)->whereNotIn('active_status', $ignoreStatus)->count() ?? 0;

        $data['product_count'] = Product::where('seller_id', $seller_id)->get()->count() ?? 0;

        $data['salesman_count'] = \App\Models\Salesman::where('seller_id', $seller_id)->count() ?? 0;

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
        $data['packet_products'] = ProductVariant::select("*")->leftJoin('products', 'product_variants.product_id', '=', 'products.id')->where('products.type', 'packet')->whereIn('product_id', $productsIds)->get()->count();
        $data['loose_products'] = ProductVariant::select("*")->leftJoin('products', 'product_variants.product_id', '=', 'products.id')->where('products.type', 'loose')->whereIn('product_id', $productsIds)->get()->count();
        $data['sold_out_count'] = ProductVariant::where('status', ProductVariant::$statusSoldOut)
            ->whereIn('product_id', $productsIds_stock)
            ->where('stock', '<=', 0)
            ->where('stock', '<=', 0)->get()->count();

        $low_stock = Setting::where('variable', 'low_stock_limit')->first();
        $low_stock_limit = 0;
        if ($low_stock) {
            $low_stock_limit = $low_stock->value;
        }
        $data['low_stock_count'] = ProductVariant::where('status', ProductVariant::$statusAvailable)->whereIn('product_id', $productsIds_stock);
        if ($low_stock_limit !== 0) {
            $data['low_stock_count'] = $data['low_stock_count']->where('stock', '<=', $low_stock_limit);
        }
        $data['low_stock_count'] = $data['low_stock_count']->get()->count();


        $balance = (float) Seller::where('id', $seller_id)->value('balance') ?? 0;

        $pendingWithdrawals = (float) DB::table('withdrawal_requests')
            ->where('type', 'seller')
            ->where('type_id', $seller_id)
            ->where('status', 0)
            ->sum('amount') ?? 0;

        $data['balance'] = number_format($balance - $pendingWithdrawals, 2);

        if ($categoryIds != "") {
            $categoryIdsArray = array_filter(array_map('intval', explode(',', $categoryIds)));
            $childCategoryIds = CommonHelper::getChildCategoryIds($categoryIdsArray);
            $finalCategoryIds = array_values(array_unique(array_merge($categoryIdsArray, $childCategoryIds)));

            $countRows = DB::table('categories')
                ->join('products', 'products.category_id', '=', 'categories.id')
                ->whereIn('categories.id', $finalCategoryIds)
                ->where('products.seller_id', $seller_id)
                ->select('categories.id', DB::raw('COUNT(products.id) AS product_count'))
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
        } else {
            $category_product_count = collect([]);
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

        return CommonHelper::responseWithData($data);
    }

    public function getProducts(Request $request)
    {
        $limit = $request->limit;
        $offset = $request->offset;
        $seller_id = auth()->user()->seller->id;

        $join = "LEFT JOIN `categories` c ON c.id = p.category_id
        LEFT JOIN `product_variants` pv ON pv.product_id = p.id
            LEFT JOIN `units` u ON u.id = pv.stock_unit_id
            LEFT JOIN `sellers` s ON s.id = p.seller_id
            LEFT JOIN `order_status_lists` osl ON osl.id = p.till_status
            ";
        $where = " WHERE p.seller_id=" . $seller_id;

        //here Sold Out as 0
        if (isset($request->type) && $request->type === 'sold_out') {
            $where .= empty($where) ? " WHERE pv.stock <=0 AND pv.status = '0' AND p.is_unlimited_stock = '0' " : " AND pv.stock <=0 AND pv.status = '0' AND p.is_unlimited_stock = '0'";
        }
        //here Available as 1, low_stock_limit
        if (isset($request->type) && $request->type === 'low_stock') {
            $low_stock_limit = Setting::where('variable', 'low_stock_limit')->first();
            $where .= empty($where) ? " WHERE pv.stock <= " . $low_stock_limit['value'] . " AND pv.status = '1' AND p.is_unlimited_stock = '0'" : " AND pv.stock <= " . $low_stock_limit['value'] . " AND pv.status = '1' AND p.is_unlimited_stock = '0'";
        }
        //here packet paroducts
        if (isset($request->type) && $request->type === 'packet_products') {
            $where .= empty($where) ? " WHERE p.type = 'packet'" : " AND p.type ='packet'";
        }
        //here loose paroducts
        if (isset($request->type) && $request->type === 'loose_products') {
            $where .= empty($where) ? " WHERE p.type = 'loose'" : " AND p.type ='loose'";
        }

        $products = DB::select("SELECT p.id AS product_id, p.*, p.name, p.seller_id, p.status, p.tax_id, p.image,
            CONCAT('" . asset('storage/') . "/', p.image) as image_url,
            s.name as seller_name, p.indicator, p.manufacturer, p.made_in, p.return_status,
            p.cancelable_status, p.till_status, osl.status as till_status_name, p.description,
            pv.id as product_variant_id, pv.price, pv.discounted_price, pv.measurement,
            pv.status as pv_status, pv.stock, pv.stock_unit_id,
            (select short_code from units where units.id = pv.stock_unit_id) as stock_unit
            FROM `products` p $join $where
            ORDER BY p.id DESC, pv.id ASC");
        $total = count($products);
        if (isset($request->limit)) {
            $products = array_slice($products, $offset, $limit);
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
            'users.name as user_name',
            'order_items.active_status as order_status'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('user_addresses as address', 'orders.address_id', '=', 'address.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('delivery_boys', 'orders.delivery_boy_id', '=', 'delivery_boys.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->where('order_items.seller_id', $seller_id)
            ->where('orders.order_type', 'doorstep');

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
        // Add OTP value dynamically based on setting
        $generate_otp = Setting::get_value("generate_otp");
        foreach ($orders as $order) {
            $order->otp = ($generate_otp == 1) ? $order->otp : 0;
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
            'users.name as user_name',
            'order_items.status as order_status',
            'sellers.name as seller_name'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
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
        $generate_otp = Setting::get_value("generate_otp");
        foreach ($orders as &$order) {

            $order['otp'] = ($generate_otp == 1) ? $order['otp'] : 0;

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
            "self_pickup_mode"
        );
        $settings = CommonHelper::getSettings($variables);
        $settings = CommonHelper::resolveTranslatedSettings($settings);
        $settings["allPermissions"] = auth()->user()->allPermissions;
        $settings["view_customer_detail"] = Seller::select('customer_privacy')->where('admin_id', auth()->user()->id)->first()->customer_privacy;
        $settings["assign_delivery_boy"] = Seller::select('assign_delivery_boy')->where('admin_id', auth()->user()->id)->first()->assign_delivery_boy;
        $settings["view_order_otp"] = Seller::select('view_order_otp')->where('admin_id', auth()->user()->id)->first()->view_order_otp;
        $settings["change_order_status_delivered"] = Seller::select('change_order_status_delivered')->where('admin_id', auth()->user()->id)->first()->change_order_status_delivered;
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
        $city_id = auth()->user()->seller->city_id;

        if ($request->order_id) {
            $order = Order::find($request->order_id);
            if ($order && $order->address_id) {
                $address = UserAddress::find($order->address_id);
                if ($address && $address->city_id) {
                    $city_id = $address->city_id;
                }
            }
        }

        // Split city_id into array of IDs if it contains commas
        $cityIds = array_filter(array_map('trim', explode(',', $city_id)));

        // Retrieve delivery boys scoped to the seller's cities (or global cities NULL/0), and owned by this seller or system-wide (NULL/0)
        $deliveryBoys = DeliveryBoy::with(['admin', 'translations'])
            ->where(function ($query) use ($cityIds) {
                $query->whereIn('city_id', $cityIds)
                      ->orWhereNull('city_id')
                      ->orWhere('city_id', 0);
            })
            ->where(function ($query) use ($seller_id) {
                $query->where('seller_id', $seller_id)
                      ->orWhereNull('seller_id')
                      ->orWhere('seller_id', 0);
            });

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
