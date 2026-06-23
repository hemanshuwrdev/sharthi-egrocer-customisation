<?php

namespace App\Http\Controllers;

use App\Helpers\CommonHelper;
use App\Http\Controllers\API\OrdersApiController;
use App\Http\Controllers\API\OrderStatusApiController;
use App\Models\Category;
use App\Models\DeliveryBoy;
use App\Models\FundTransfer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use App\Models\OrderStatusList;
use App\Models\PanelNotification;
use App\Models\Setting;
use App\Models\DeliveryBoyTransaction;
use App\Models\LiveTracking;
use App\Models\LoadingSlip;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

class DeliveryBoyController extends BaseController
{
    public function index(Request $request){
        $delivery_boy_id = auth()->user()->deliveryBoy->id;
        $data = array();

        $query = Order::where('delivery_boy_id', $delivery_boy_id)
            ->where('active_status', OrderStatusList::$outForDelivery);

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->end_date)->endOfDay();
            $query->whereBetween('delivery_time', [$startDate, $endDate])
                  ->orWhereBetween('created_at', [$startDate, $endDate]); // Adjust depending on when 'start trip' is defined
        } else if ($request->filled('start_date')) {
            $startDate = Carbon::parse($request->start_date)->startOfDay();
            $endDate = Carbon::parse($request->start_date)->endOfDay();
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        // Calculate trip metrics
        $data['total_stops'] = (clone $query)->count();
        $data['expected_cash_collection'] = (clone $query)
            ->where('payment_method', 'COD')
            ->sum('final_total');

        // Legacy metrics
        $data['order_count'] = Order::where('delivery_boy_id',$delivery_boy_id)->count();
        $data['balance'] = number_format(auth()->user()->deliveryBoy->balance, 2);
        
        return CommonHelper::responseWithData($data);
    }

    public function getRouteList(Request $request)
    {
        $deliveryBoy = auth()->user()->deliveryBoy;
        if (!$deliveryBoy) {
            return CommonHelper::responseError('Driver not found');
        }
        $delivery_boy_id = $deliveryBoy->id;

        // 1. Try to find the active dispatched loading slip
        $slip = LoadingSlip::with(['vehicle', 'driver'])
            ->where('driver_id', $delivery_boy_id)
            ->where('status', 1) // Dispatched
            ->orderBy('id', 'DESC')
            ->first();

        // 2. If no active dispatched slip, fall back to any slip today (created or completed or dispatched)
        if (!$slip) {
            $slip = LoadingSlip::with(['vehicle', 'driver'])
                ->where('driver_id', $delivery_boy_id)
                ->whereDate('created_at', Carbon::today())
                ->orderBy('id', 'DESC')
                ->first();
        }

        $orders = collect();
        $expectedCash = 0;
        $totalStops = 0;

        if ($slip) {
            // Fetch all orders in the loading slip
            $orders = Order::select(
                'orders.*',
                'users.name as user_name',
                'user_addresses.address as customer_address',
                'user_addresses.latitude as user_address_latitude',
                'user_addresses.longitude as user_address_longitude',
                'cities.zone as city_zone',
                'rp.party_name',
                'rp.shop_name',
                'rp.gst_no as customer_gst',
                'rp.gps_lat',
                'rp.gps_lng',
                'rp.verified_lat',
                'rp.verified_lng',
                DB::raw('COALESCE(rp.party_name, rp.shop_name, users.name) as customer_name'),
                'orders.mobile as customer_mobile'
            )
                ->leftJoin('users', 'orders.user_id', '=', 'users.id')
                ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
                ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
                ->leftJoin('retailer_profiles as rp', 'orders.user_id', '=', 'rp.user_id')
                ->where('orders.loading_slip_id', $slip->id)
                ->get();
        } else {
            // Fallback: fetch orders assigned to delivery boy with outForDelivery status
            $orders = Order::select(
                'orders.*',
                'users.name as user_name',
                'user_addresses.address as customer_address',
                'user_addresses.latitude as user_address_latitude',
                'user_addresses.longitude as user_address_longitude',
                'cities.zone as city_zone',
                'rp.party_name',
                'rp.shop_name',
                'rp.gst_no as customer_gst',
                'rp.gps_lat',
                'rp.gps_lng',
                'rp.verified_lat',
                'rp.verified_lng',
                DB::raw('COALESCE(rp.party_name, rp.shop_name, users.name) as customer_name'),
                'orders.mobile as customer_mobile'
            )
                ->leftJoin('users', 'orders.user_id', '=', 'users.id')
                ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
                ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
                ->leftJoin('retailer_profiles as rp', 'orders.user_id', '=', 'rp.user_id')
                ->where('orders.delivery_boy_id', $delivery_boy_id)
                ->where('orders.active_status', OrderStatusList::$outForDelivery)
                ->get();
        }

        foreach ($orders as $order) {
            $order->resolved_latitude = floatval($order->latitude ?: ($order->user_address_latitude ?: ($order->verified_lat ?: ($order->gps_lat ?: 0))));
            $order->resolved_longitude = floatval($order->longitude ?: ($order->user_address_longitude ?: ($order->verified_lng ?: ($order->gps_lng ?: 0))));
            $order->customer_address = $order->customer_address ?: $order->address;
            $order->customer_mobile = $order->customer_mobile ?: $order->mobile;
        }

        if ($orders->isNotEmpty()) {
            // Sequence routes by spatial proximity using Euclidean distance
            $sequencedIds = $this->sequenceRoutesByProximity($orders);
            $orders = $orders->sortBy(function ($order) use ($sequencedIds) {
                return array_search($order->id, $sequencedIds);
            })->values();

            // Calculate metrics
            $totalStops = $orders->count();
            // Expected cash from COD orders (remaining_final)
            $expectedCash = $orders->where('payment_method', 'COD')->sum('remaining_final');
        }

        // Attach items, translated status name, and next stop indication
        $nextStopFound = false;
        foreach ($orders as $order) {
            // Fetch order items with delivered quantity / damage photo
            $order->items = DB::table('order_items')
                ->select('id', 'product_name', 'variant_name', 'quantity', 'delivered_quantity', 'damage_photo', 'price')
                ->where('order_id', $order->id)
                ->get();

            $order->order_status_name = OrderStatusList::getTranslatedName((int) ($order->active_status ?? 0));

            // Highlight next stop: first stop that is still out_for_delivery/shipped (pending delivery)
            if (!$nextStopFound && in_array($order->active_status, [
                OrderStatusList::$outForDelivery,
                OrderStatusList::$shipped,
                OrderStatusList::$processed,
                OrderStatusList::$received
            ])) {
                $order->is_next_stop = true;
                $nextStopFound = true;
            } else {
                $order->is_next_stop = false;
            }
        }

        $data = [
            'loading_slip' => $slip,
            'total_stops' => $totalStops,
            'expected_cash_collection' => round($expectedCash, 2),
            'stops' => $orders
        ];

        return CommonHelper::responseWithData($data);
    }

    // Nearest Neighbor Routing algorithm to cluster and sequence order stops logically
    private function sequenceRoutesByProximity($orders)
    {
        if ($orders->isEmpty()) return [];

        $unvisited = $orders->values()->all();
        $sequenced = [];

        // Start with the first order in the list as the anchor stop
        $current = array_shift($unvisited);
        $sequenced[] = $current;

        while (!empty($unvisited)) {
            $nearestIdx = 0;
            $minDist = doubleval(INF);

            $lat1 = doubleval($current->resolved_latitude);
            $lon1 = doubleval($current->resolved_longitude);

            foreach ($unvisited as $idx => $candidate) {
                $lat2 = doubleval($candidate->resolved_latitude);
                $lon2 = doubleval($candidate->resolved_longitude);

                // Simple Euclidean distance approximation for spatial proximity sequencing
                $dist = sqrt(pow($lat1 - $lat2, 2) + pow($lon1 - $lon2, 2));
                if ($dist < $minDist) {
                    $minDist = $dist;
                    $nearestIdx = $idx;
                }
            }

            $current = $unvisited[$nearestIdx];
            $sequenced[] = $current;
            unset($unvisited[$nearestIdx]);
            $unvisited = array_values($unvisited); // Reindex array keys
        }

        return collect($sequenced)->pluck('id')->toArray();
    }

    public function doLanguageChange(Request $request)
    {
        Session::put('lang',$request->language);
        return response()->json(['status' => true]);
    }

    public function createSlug($text){
        $slug = CommonHelper::slugify($text);
        return CommonHelper::responseWithData($slug);
    }

    public function getTopNotifications(){
        $notifications = PanelNotification::where('notifiable_id',auth()->user()->id);
        $unReadCount = (clone $notifications)->where('read_at',NULL)->get()->count();
        $notifications = $notifications->orderBy('created_at','DESC')->get();

        $data = array();
        $data['unread'] = $unReadCount;
        $data['notifications'] = $notifications;
        return CommonHelper::responseWithData($data);
    }

    public function markAsReadNotifications(Request $request){

        auth()->user()
            ->unreadNotifications
            ->when($request->input('id'), function ($query) use ($request) {
                return $query->where('id', $request->input('id'));
            })
            ->markAsRead();
        return CommonHelper::responseWithData("Notification Mark as Read Successfully!");

    }

    public function getOrders(Request $request){

        $delivery_boy_id = auth()->user()->deliveryBoy->id;

        $limit = (int) ($request->limit ?? 12);
        $offset = (int) ($request->offset ?? 0);
        $includeTotal = filter_var($request->input('include_total', true), FILTER_VALIDATE_BOOLEAN);

        // Parse dates only when provided (avoid errors and overhead)
        $startDate = (isset($request->startDate) && $request->startDate != "") ? Carbon::parse($request->startDate)->startOfDay() : null;
        $endDate = (isset($request->endDate) && $request->endDate != "") ? Carbon::parse($request->endDate)->endOfDay() : null;
        $startDeliveryDate = (isset($request->startDeliveryDate) && $request->startDeliveryDate != "") ? date('Y-m-d', strtotime($request->startDeliveryDate)) : null;
        $endDeliveryDate = (isset($request->endDeliveryDate) && $request->endDeliveryDate != "") ? date('Y-m-d', strtotime($request->endDeliveryDate)) : null;

        $sellerSubquery = "(SELECT s.name FROM order_items oi JOIN sellers s ON oi.seller_id = s.id WHERE oi.order_id = orders.id LIMIT 1)";
        $orders = Order::select(
            'orders.*',
            'orders.id as order_id',
            'delivery_boys.name as delivery_boy_name',
            DB::raw("{$sellerSubquery} as seller_name"),
            'users.name as user_name',
            'users.mobile as user_mobile',
            'users.country_code as user_country_code',
            'orders.active_status as order_status'
        )
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('delivery_boys', 'orders.delivery_boy_id', '=', 'delivery_boys.id')
            ->where('orders.delivery_boy_id', $delivery_boy_id);

        if ($startDate && $endDate) {
            $orders = $orders->whereBetween('orders.created_at', [$startDate, $endDate]);
        }

        if ($startDeliveryDate && $endDeliveryDate) {
            $orders = $orders->whereRaw(
                "STR_TO_DATE(SUBSTRING_INDEX(orders.delivery_time, ' ', 1), '%d-%m-%Y') BETWEEN ? AND ?",
                [$startDeliveryDate, $endDeliveryDate]
            );
        }

        if (isset($request->status) && $request->status != "" && $request->status != 0) {
            $orders = $orders->where('orders.active_status', $request->status);
        }
        if (isset($request->search) && !empty($request->search)) {
            $search = $request->search;
            $orders = $orders->where(function ($query) use ($search, $sellerSubquery) {
                $query->where('orders.id', 'LIKE', "%$search%")
                    ->orWhere('users.name', 'LIKE', "%$search%")
                    ->orWhere('users.mobile', 'LIKE', "%$search%")
                    ->orWhere('orders.mobile', 'LIKE', "%$search%")
                    ->orWhere('orders.payment_method', 'LIKE', "%$search%")
                    ->orWhere('orders.delivery_charge', 'LIKE', "%$search%")
                    ->orWhere('orders.wallet_balance', 'LIKE', "%$search%")
                    ->orWhere('orders.final_total', 'LIKE', "%$search%")
                    ->orWhere('orders.remaining_final', 'LIKE', "%$search%")
                    ->orWhere('orders.total', 'LIKE', "%$search%")
                    ->orWhere('orders.delivery_time', 'LIKE', "%$search%")
                    ->orWhereRaw("({$sellerSubquery}) LIKE ?", ["%$search%"])
                    ->orWhere('delivery_boys.name', 'LIKE', "%$search%");
            });
        }

        if (isset($request->type)) {
            $activeTypeStatus = [OrderStatusList::$paymentPending, OrderStatusList::$received, OrderStatusList::$processed, OrderStatusList::$outForDelivery, OrderStatusList::$shipped];
            $previousTypeStatus = [OrderStatusList::$delivered, OrderStatusList::$cancelled, OrderStatusList::$returned];
            if ($request->type == Order::$activeType) {
                $orders = $orders->whereIn('orders.active_status', $activeTypeStatus);
            } else {
                $orders = $orders->whereIn('orders.active_status', $previousTypeStatus);
            }
        }

        // Lightweight count (no seller subquery) - run before get()
        $ordersForCount = clone $orders;
        $ordersForCount->getQuery()->select(DB::raw('orders.id'));
        $totalOrder = $ordersForCount->count();

        // Fetch only the limited rows (skip/take applied)
        $orders = $orders->orderBy('orders.updated_at', 'DESC')->skip($offset)->take((int) $limit)->get();


        // Order items query: no product/variant joins needed (not selected)
        $order_items = Order::select('order_items.*','orders.mobile','orders.total' ,'orders.delivery_charge','orders.discount','orders.promo_code',
            'orders.promo_discount','orders.wallet_balance','orders.final_total','orders.remaining_final','orders.payment_method','orders.address','orders.delivery_time',
            'users.name as user_name','order_items.status as order_status','sellers.name as seller_name')
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->where('orders.delivery_boy_id', $delivery_boy_id);

        if(isset($request->startDate) && $request->startDate != "" && isset($request->endDate) && $request->endDate != ""){
            $order_items = $order_items->whereBetween('order_items.created_at', [$startDate, $endDate]);
        }

        if(isset($request->startDeliveryDate) && $request->startDeliveryDate != "" && isset($request->endDeliveryDate) && $request->endDeliveryDate != ""){
            // Convert start and end dates from request to Y-m-d format
            $startDeliveryDate = date('Y-m-d', strtotime($request->startDeliveryDate));
            $endDeliveryDate = date('Y-m-d', strtotime($request->endDeliveryDate));

            // Define a callback function to extract and format the delivery_time date
            $order_items = $order_items->where(function($query) use ($startDeliveryDate, $endDeliveryDate) {
                $query->whereRaw("STR_TO_DATE(SUBSTRING_INDEX(orders.delivery_time, ' ', 1), '%d-%m-%Y') BETWEEN ? AND ?", [$startDeliveryDate, $endDeliveryDate]);
            });
        }

        if(isset($request->status) && $request->status != "" && $request->status != 0){
            $order_items = $order_items->where('orders.active_status', $request->status);
        }

        if (isset($request->type)) {
            $activeTypeStatus = [OrderStatusList::$paymentPending, OrderStatusList::$received, OrderStatusList::$processed, OrderStatusList::$outForDelivery, OrderStatusList::$shipped];
            $previousTypeStatus = [OrderStatusList::$delivered, OrderStatusList::$cancelled, OrderStatusList::$returned];
            if ($request->type == Order::$activeType) {
                $order_items = $order_items->whereIn('orders.active_status', $activeTypeStatus);
            } else {
                $order_items = $order_items->whereIn('orders.active_status', $previousTypeStatus);
            }
        }

        $totalOrderItem = clone $order_items;
        $totalOrderItem = $totalOrderItem->count();
        $order_items = $order_items->orderBy('order_items.updated_at','DESC')->skip($offset)->take($limit)->get();

        // Attach translated order status name
        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';
        $previousLocale = app()->getLocale();
        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        foreach ($orders as $row) {
            $row->order_status_name = OrderStatusList::getTranslatedName((int) ($row->order_status ?? 0));
        }

        foreach ($order_items as $row) {
            $row->order_status_name = OrderStatusList::getTranslatedName((int) ($row->active_status ?? 0));
        }

        app()->setLocale($previousLocale);

        $data = array(
            "orders" => $orders,
            "total_order_item" => $totalOrderItem,
            "order_items" => $order_items
        );
        return CommonHelper::responseWithData($data,$totalOrder);
    }
    public function getOrder(Request $request){
        return app(OrdersApiController::class)->view($request->order_id);
    }
    public function getOrderStatus(Request $request){
        return app(OrderStatusApiController::class)->getOrderStatus($request);
    }
    public function getCashCollection(Request $request){
        $delivery_boy_id = auth()->user()->deliveryBoy->id;
        $transactions = DeliveryBoyTransaction::select( 'orders.*','delivery_boy_transactions.*','delivery_boys.name','delivery_boys.mobile','delivery_boys.address' )

        ->leftJoin('orders', 'delivery_boy_transactions.order_id', '=', 'orders.id')
        ->leftJoin('delivery_boys', 'delivery_boy_transactions.delivery_boy_id', '=', 'delivery_boys.id')
        ->where('delivery_boy_transactions.delivery_boy_id', $delivery_boy_id)
        ->where(function ($query) {
            $query->where('delivery_boy_transactions.type', DeliveryBoyTransaction::$paymentTypeCod)
                ->orWhere('delivery_boy_transactions.type', 'delivery_boy_cash_collection');
        });
        if(isset($request->startDate) && $request->startDate != "" && isset($request->endDate) && $request->endDate != ""){
            $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
            $endDate = Carbon::parse($request->input('endDate'))->endOfDay();
            $transactions = $transactions->whereBetween('delivery_boy_transactions.created_at', [$startDate, $endDate]);
        }
        if (isset($request->search) && !empty($request->search)) {
            $searchTerm = $request->search;
            $transactions = $transactions->where('delivery_boy_transactions.id', 'LIKE', '%' . $searchTerm . '%')->orWhere('orders.id', 'LIKE', '%' . $searchTerm . '%')
                ->orwhere('delivery_boy_transactions.type', 'LIKE', '%' . $searchTerm . '%')->orWhere('delivery_boy_transactions.amount', 'LIKE', '%' . $searchTerm . '%')
               ->orWhere('delivery_boy_transactions.message', 'LIKE', '%' . $searchTerm . '%');
        }
        $transactions = $transactions->orderBy('delivery_boy_transactions.id','ASC')->get();
        foreach($transactions as $t => $row) {
            if($row['type'] == 'delivery_boy_cash_collection'){
                 $transactions[$t]['type'] = 'Delivery Boy Cash Collection';
                  $transactions[$t]['order_id'] = '-';
                  $transactions[$t]['final_total'] = '-';
                  $transactions[$t]['collected_amount'] = $transactions[$t]['amount'];
                  $transactions[$t]['amount'] = 0;
            }elseif($row['type'] == 'COD'){
                $transactions[$t]['collected_amount'] = 0;
            }
        }
        $data['transactions'] = $transactions;
        $data['cash_in_hand'] = DeliveryBoy::where('id',$delivery_boy_id)->value('cash_received');
        $data['cash_collected'] = DeliveryBoyTransaction::select(DB::raw('SUM(amount) AS total_amt'))->where(['type' => 'delivery_boy_cash_collection', 'delivery_boy_id' => $delivery_boy_id])->value('total_amt');
        $data['transactions'] = $transactions->map(function (DeliveryBoyTransaction $dt) {
            $row = $dt->toArray();
            $rawTransactionDate = $dt->getAttributes()['transaction_date'] ?? null;
            if ($rawTransactionDate !== null && $rawTransactionDate !== '') {
                $row['transaction_date'] = CommonHelper::formatDateTime($rawTransactionDate);
            }
            return $row;
        });
        $total = $transactions->count();
        return CommonHelper::responseWithData( $data,$total);
    }
    public function getFundTransfers(Request $request){
        $delivery_boy_id = auth()->user()->deliveryBoy->id;
        $fundTransfers = FundTransfer::select('delivery_boys.name','delivery_boys.mobile','delivery_boys.address', 'fund_transfers.*')
            ->leftJoin('delivery_boys', 'fund_transfers.delivery_boy_id', '=', 'delivery_boys.id')->where('fund_transfers.delivery_boy_id', $delivery_boy_id);

            if (isset($request->search) && !empty($request->search)) {
            $searchTerm = $request->search;

                 $fundTransfers = $fundTransfers->where('fund_transfers.id', 'LIKE', '%' . $searchTerm . '%')
                    ->orwhere('fund_transfers.type', 'LIKE', '%' . $searchTerm . '%')->orWhere('fund_transfers.amount', 'LIKE', '%' . $searchTerm . '%')
                    ->orWhere('fund_transfers.message', 'LIKE', '%' . $searchTerm . '%');
            }
        $fundTransfers = $fundTransfers->orderBy('fund_transfers.id','DESC')->get();
        $fundTransfers = $fundTransfers->map(function (FundTransfer $ft) {
            $row = $ft->toArray();
            $rawCreated = $ft->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            return $row;
        });
        $total = $fundTransfers->count();

        return CommonHelper::responseWithData($fundTransfers,$total);
    }


    public function getProductSalesReport(Request $request){
        $delivery_boy_id = auth()->user()->deliveryBoy->id;
        $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
        $endDate = Carbon::parse($request->input('endDate'))->endOfDay();
        $ProductSalesReports = OrderItem::select('product_variants.product_id','products.name as product_name',
            'sellers.name as seller_name','product_variants.measurement','units.short_code AS unit_name','order_items.*',
            DB::raw('(SELECT COUNT(order_items.product_variant_id) FROM order_items WHERE product_variants.id = order_items.product_variant_id) as total_sales'),
            DB::raw('(SELECT SUM(order_items.sub_total) FROM `order_items` WHERE product_variants.id = order_items.product_variant_id) as total_price')
        )
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('units', 'product_variants.stock_unit_id', '=', 'units.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
            ->where('orders.delivery_boy_id', $delivery_boy_id)
            ->where('orders.active_status', OrderStatusList::$delivered)
            ->orWhere('orders.active_status', OrderStatusList::$selfPickupPicked)
            ->whereBetween('order_items.created_at', [$startDate, $endDate])
            ->orderBy('order_items.id','DESC')
            ->groupBy('product_variants.id')
            ->get();
        return CommonHelper::responseWithData($ProductSalesReports);
    }

    public function getSalesReport(Request $request){
        $delivery_boy_id = auth()->user()->deliveryBoy->id;
        $startDate = Carbon::parse($request->input('startDate'))->startOfDay();
        $endDate = Carbon::parse($request->input('endDate'))->endOfDay();
        $categories = Category::orderBy('id','DESC')->get()->toArray();
        $SalesReports = OrderItem::select('order_items.id','orders.total',
            'order_items.seller_id','order_items.sub_total','orders.user_id','orders.mobile',
            'products.name as product_name','orders.final_total','orders.address',
            'users.name as user_name','order_items.status',
            DB::raw('DATE_FORMAT(order_items.created_at,"%d-%m-%Y") as added_date'))
            ->leftJoin('users', 'order_items.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.delivery_boy_id', $delivery_boy_id)
            ->whereBetween('order_items.created_at', [$startDate, $endDate])
            ->where('orders.active_status', OrderStatusList::$delivered)
            ->orWhere('orders.active_status', OrderStatusList::$selfPickupPicked);
        if(isset($request->category) && $request->category != ""){
            $SalesReports = $SalesReports->where('products.category_id', $request->category);
        }
        $SalesReports = $SalesReports->orderBy('order_items.id','DESC')->get();
        $SalesReports = $SalesReports->map(function (OrderItem $oi) {
            $row = $oi->toArray();
            $rawAddedDate = $oi->getAttributes()['added_date'] ?? null;
            if ($rawAddedDate !== null && $rawAddedDate !== '') {
                $row['added_date'] = CommonHelper::formatDate($rawAddedDate);
            }
            return $row;
        });
        $data = array(
            "categories" => $categories,
            "salesReports" => $SalesReports
        );
        return CommonHelper::responseWithData($data);
    }
    public function getSettings(){

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
            "privacy_policy_delivery_boy",
            "terms_conditions_delivery_boy",
            "google_place_api_key",
            "app_mode_delivery_boy",
            "app_mode_delivery_boy_remark",
            "apiKey",
            "enable_road_path_tracking"
        );
        $settings = CommonHelper::getSettings($variables);
        $settings = CommonHelper::resolveTranslatedSettings($settings);
        $settings["allPermissions"] = auth()->user()->allPermissions;
        $settings = json_encode($settings);
        $settings = base64_encode($settings);
        if(!empty($settings)){
            return CommonHelper::responseWithData($settings);
        }else{
            return  CommonHelper::responseError('No settings found!');
        }
    }

    public function getPrivacyPolicy(){
        $variables = array(
            "privacy_policy_delivery_boy",
            "terms_conditions_delivery_boy",
        );
        $settings = CommonHelper::getSettings($variables);
        $settings = CommonHelper::resolveTranslatedSettings($settings);

        if(!empty($settings)){
            return CommonHelper::responseWithData($settings);
        }else{
            return  CommonHelper::responseError('No settings found!');
        }
    }

    public function deploy(){
        exec("git pull");
        exec("composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev");
        exec("php artisan migrate");
        echo "Done";
    }

    public function manageLiveTracking(Request $request)
{

    // Define the validation rules
    $validator = Validator::make($request->all(),[
        'order_id' => 'required|numeric|exists:orders,id',
        'order_status' => 'required|string|in:5,6,7',
        'latitude' => 'required|string',
        'longitude' => 'required|string',
    ]);
    if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
    }

    // Retrieve the inputs
    $orderId = $request->order_id;
    $orderStatus = $request->input('order_status');
    $latitude = $request->input('latitude');
    $longitude = $request->input('longitude');

    // Check if the order exists and if it's valid for tracking
    $order = Order::find($orderId);
    if (!$order) {
        return response()->json([
            'error' => true,
            'message' => 'Order does not exist.'
        ]);
    }

    if (in_array($order->active_status, [
        1,2,3,4,7,8
    ])) {
        return response()->json([
            'error' => true,
            'message' => "Order is {$order->active_status}. You cannot track this order."
        ]);
    }

    // Prepare the data for live tracking
    $trackingData = [
        'order_id' => $orderId,
        'order_status' => $orderStatus,
        'latitude' => $latitude,
        'longitude' => $longitude,
    ];

    // Update or insert live tracking data
    $liveTracking = LiveTracking::updateOrCreate(
        ['order_id' => $orderId],
        $trackingData
    );

    $message = $liveTracking->wasRecentlyCreated ? 'Live Tracking Details Inserted Successfully.' : 'Live Tracking Details Updated Successfully.' ;
    return  CommonHelper::responseSuccess($message);
}

}
