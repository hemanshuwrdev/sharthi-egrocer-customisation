<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\DeliveryBoy;
use App\Models\LoadingSlip;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusList;
use App\Models\ProductVariant;
use App\Models\Unit;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class LoadingSlipsApiController extends Controller
{
    public function list(Request $request)
    {
        $limit = $request->input('per_page', 10);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $filter = $request->input('filter', '');

        $query = LoadingSlip::with(['vehicle', 'driver'])->orderBy('id', 'DESC');

        if (auth()->user() && auth()->user()->seller) {
            $query->where('created_by', auth()->user()->id);
        }

        if ($filter) {
            $query->where(function ($q) use ($filter) {
                $q->where('slip_no', 'like', "%{$filter}%")
                  ->orWhereHas('vehicle', function($vq) use ($filter) {
                      $vq->where('name', 'like', "%{$filter}%")
                         ->orWhere('vehicle_number', 'like', "%{$filter}%");
                  })
                  ->orWhereHas('driver', function($dq) use ($filter) {
                      $dq->where('name', 'like', "%{$filter}%");
                  });
            });
        }

        $total = $query->count();
        $slips = $query->skip($offset)->take($limit)->get();

        return CommonHelper::responseWithData($slips, $total);
    }

    public function getOrdersForAssignment(Request $request)
    {
        $zone = $request->input('zone', '');

        $query = Order::select('orders.*', 'users.name as user_name', 'cities.zone as city_zone')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
            ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
            ->whereNull('orders.loading_slip_id')
            ->where('orders.order_type', 'doorstep')
            ->whereIn('orders.active_status', [
                OrderStatusList::$received,
                OrderStatusList::$processed,
                OrderStatusList::$shipped
            ]);

        if (auth()->user() && auth()->user()->seller) {
            $sellerId = auth()->user()->seller->id;
            $query->whereExists(function ($q) use ($sellerId) {
                $q->select(DB::raw(1))
                  ->from('order_items')
                  ->whereColumn('order_items.order_id', 'orders.id')
                  ->where('order_items.seller_id', $sellerId);
            });
        }

        if ($zone) {
            $query->where('cities.zone', $zone);
        }

        $orders = $query->orderBy('orders.id', 'ASC')->get();

        // Calculate and save order weight dynamically if not saved already
        foreach ($orders as $order) {
            $computedWeight = self::calculateOrderWeight($order->id);
            if ($order->weight != $computedWeight) {
                $order->weight = $computedWeight;
                $order->save();
            }
        }

        return CommonHelper::responseWithData($orders);
    }

    public function getZones()
    {
        $zones = City::select('zone')->whereNotNull('zone')->where('zone', '!=', '')->distinct()->pluck('zone');
        return CommonHelper::responseWithData($zones);
    }

    public function save(Request $request)
    {
        if (!auth()->user() || !auth()->user()->seller) {
            return \App\Helpers\CommonHelper::responseError('Only distributors (sellers) can create a loading slip.');
        }

        $validator = Validator::make($request->all(), [
            'vehicle_id' => 'required|exists:vehicles,id',
            'driver_id' => 'required|exists:delivery_boys,id',
            'order_ids' => 'required|array|min:1',
            'order_ids.*' => 'exists:orders,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $vehicle = Vehicle::find($request->vehicle_id);
        $driver = DeliveryBoy::find($request->driver_id);

        if (!$vehicle || $vehicle->status != 1) {
            return CommonHelper::responseError('Vehicle is inactive or not found.');
        }

        if (!$driver || $driver->status != 1) {
            return CommonHelper::responseError('Driver is inactive or not found.');
        }

        $orders = Order::whereIn('id', $request->order_ids)->get();

        if (auth()->user() && auth()->user()->seller) {
            $sellerId = auth()->user()->seller->id;
            foreach ($orders as $order) {
                $hasSellerItem = DB::table('order_items')
                    ->where('order_id', $order->id)
                    ->where('seller_id', $sellerId)
                    ->exists();
                if (!$hasSellerItem) {
                    return CommonHelper::responseError("Order #{$order->id} does not belong to your store.");
                }
            }
        }

        $totalWeight = 0;
        $totalItems = 0;
        $totalOrders = count($orders);

        foreach ($orders as $order) {
            if ($order->loading_slip_id !== null) {
                return CommonHelper::responseError("Order #{$order->id} is already assigned to a loading slip.");
            }
            $computedWeight = self::calculateOrderWeight($order->id);
            $totalWeight += $computedWeight;

            $totalItems += OrderItem::where('order_id', $order->id)->sum('quantity');
        }

        // Weight Capacity Check
        if ($totalWeight > $vehicle->capacity) {
            return CommonHelper::responseError("Weight Capacity exceeded! Total selected weight {$totalWeight} kg exceeds vehicle capacity {$vehicle->capacity} kg.");
        }

        // Route sequence: nearest neighbor spatial clustering
        $sequencedOrderIds = $this->sequenceRoutesByProximity($orders);

        DB::beginTransaction();
        try {
            // Generate slip number
            $lastSlip = LoadingSlip::orderBy('id', 'DESC')->first();
            $nextId = $lastSlip ? $lastSlip->id + 1 : 10001;
            $slipNo = 'LS-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

            $slip = LoadingSlip::create([
                'slip_no' => $slipNo,
                'vehicle_id' => $vehicle->id,
                'driver_id' => $driver->id,
                'status' => 0, // Created
                'total_weight' => round($totalWeight, 2),
                'total_items' => $totalItems,
                'total_orders' => $totalOrders,
                'created_by' => auth()->user()->id ?? null,
            ]);

            // Save bonus details for delivery boy assignment and link orders
            foreach ($orders as $order) {
                // Apply bonus calculation rules
                $final_total = floatval($order->total);
                $bonus_type = $driver->bonus_type;
                $bonus_details = [
                    'final_total' => $final_total,
                    'bonus_type' => $bonus_type,
                ];
                $bonus_amount = 0;

                if ($bonus_type == DeliveryBoy::$bonusCommission) {
                    $bonus_percentage = floatval($driver->bonus_percentage);
                    $bonus_min_amount = floatval($driver->bonus_min_amount);
                    $bonus_max_amount = floatval($driver->bonus_max_amount);

                    $bonus_amount = floatval(($final_total * $bonus_percentage) / 100);

                    if ($bonus_amount < $bonus_min_amount && $bonus_min_amount != 0) {
                        $bonus_amount = $bonus_min_amount;
                    }
                    if ($bonus_amount > $bonus_max_amount && $bonus_max_amount != 0) {
                        $bonus_amount = $bonus_max_amount;
                    }

                    $bonus_details['bonus_type_name'] = DeliveryBoy::$commission;
                    $bonus_details['bonus_percentage'] = $bonus_percentage;
                    $bonus_details['bonus_min_amount'] = $bonus_min_amount;
                    $bonus_details['bonus_max_amount'] = $bonus_max_amount;
                } else {
                    $bonus_details['bonus_type_name'] = DeliveryBoy::$fixed;
                }
                $bonus_details['bonus_amount'] = $bonus_amount;

                $order->loading_slip_id = $slip->id;
                $order->delivery_boy_id = $driver->id;
                $order->delivery_boy_bonus_details = $bonus_details;
                $order->delivery_boy_bonus_amount = $bonus_amount;
                $order->weight = self::calculateOrderWeight($order->id);
                $order->save();
            }

            DB::commit();

            return CommonHelper::responseWithData([
                'id' => $slip->id,
                'slip_no' => $slip->slip_no,
                'message' => 'Loading slip created and sequenced successfully',
                'sequenced_order_ids' => $sequencedOrderIds,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error saving loading slip: " . $e->getMessage());
            return CommonHelper::responseError('Something went wrong during loading slip planning.');
        }
    }

    public function view($id)
    {
        $slip = LoadingSlip::with(['vehicle', 'driver'])->find($id);
        if (!$slip) {
            return CommonHelper::responseError('Loading slip not found.');
        }
        if (auth()->user() && auth()->user()->seller && $slip->created_by != auth()->user()->id) {
            return CommonHelper::responseError('Access denied to this loading slip.');
        }

        // Fetch associated orders in sequential route order if sequenced, or order id asc
        $orders = Order::select('orders.*', 'users.name as user_name', 'user_addresses.address as customer_address', 'cities.zone as city_zone')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
            ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
            ->where('orders.loading_slip_id', $id)
            ->get();

        foreach ($orders as $order) {
            $order->items = OrderItem::where('order_id', $order->id)->get();
        }

        return CommonHelper::responseWithData([
            'slip' => $slip,
            'orders' => $orders
        ]);
    }

    public function dispatch(Request $request)
    {
        if (!auth()->user() || !auth()->user()->seller) {
            return \App\Helpers\CommonHelper::responseError('Only distributors (sellers) can dispatch a loading slip.');
        }

        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:loading_slips,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $slip = LoadingSlip::find($request->id);
        if ($slip->status != 0) {
            return CommonHelper::responseError('Only newly created loading slips can be dispatched.');
        }

        $orders = Order::where('loading_slip_id', $slip->id)->get();

        DB::beginTransaction();
        try {
            $slip->status = 1; // Dispatched
            $slip->save();

            foreach ($orders as $order) {
                // Update Order Status to Out For Delivery (5)
                $order->active_status = OrderStatusList::$outForDelivery;
                $order->save();

                // Update Order Items Status
                OrderItem::where('order_id', $order->id)
                    ->whereNotIn('active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
                    ->update(['active_status' => OrderStatusList::$outForDelivery]);

                // Create Order status history entry
                $orderStatus = [
                    'order_id' => $order->id,
                    'order_item_id' => 0,
                    'status' => OrderStatusList::$outForDelivery,
                    'created_by' => auth()->user()->id ?? 1,
                    'user_type' => auth()->user()->role_id ?? 1,
                ];
                CommonHelper::setOrderStatus($orderStatus);

                // Dispatch notification to Delivery Boy
                try {
                    CommonHelper::sendNotificationOrderAssignDeliveryBoy($order);
                } catch (\Exception $ne) {
                    Log::error("FCM dispatch notification error: " . $ne->getMessage());
                }
            }

            DB::commit();
            return CommonHelper::responseSuccess('Loading slip dispatched and out-for-delivery successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error dispatching loading slip: " . $e->getMessage());
            return CommonHelper::responseError('Something went wrong during dispatch.');
        }
    }

    public function print($id)
    {
        $slip = LoadingSlip::with(['vehicle', 'driver'])->find($id);
        if (!$slip) {
            return response()->json(['error' => 'Loading slip not found.'], 404);
        }

        $orders = Order::select(
                'orders.*',
                'users.name as user_name',
                'user_addresses.address as customer_address',
                'cities.zone as city_zone',
                'rp.party_name',
                'rp.shop_name',
                'rp.gst_no as customer_gst',
                DB::raw('COALESCE(rp.party_name, rp.shop_name, users.name) as customer_name'),
                'orders.mobile as customer_mobile'
            )
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
            ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
            ->leftJoin('retailer_profiles as rp', 'orders.user_id', '=', 'rp.user_id')
            ->where('orders.loading_slip_id', $id)
            ->get();

        // Load seller details
        $sellerId = null;
        if (auth()->user() && auth()->user()->seller) {
            $sellerId = auth()->user()->seller->id;
        } else if ($orders->count() > 0) {
            $firstOrder = $orders->first();
            $firstItem = DB::table('order_items')->where('order_id', $firstOrder->id)->first();
            if ($firstItem) {
                $sellerId = $firstItem->seller_id;
            }
        }

        $seller = null;
        if ($sellerId) {
            $seller = DB::table('sellers')
                ->select('sellers.*', 'cities.name as city_name')
                ->leftJoin('cities', 'sellers.city_id', '=', 'cities.id')
                ->where('sellers.id', $sellerId)
                ->first();
        }

        // Get aggregate items and quantities loaded with packaging details
        $itemSummary = DB::table('order_items')
            ->select(
                'order_items.product_name',
                'order_items.variant_name',
                DB::raw('SUM(order_items.quantity) as qty'),
                'pv.secondary_unit_value',
                'u2.short_code as secondary_unit_name',
                'pv.measurement as primary_measurement',
                'u1.short_code as primary_unit_name'
            )
            ->leftJoin('product_variants as pv', 'order_items.product_variant_id', '=', 'pv.id')
            ->leftJoin('units as u1', 'pv.stock_unit_id', '=', 'u1.id')
            ->leftJoin('units as u2', 'pv.secondary_unit_id', '=', 'u2.id')
            ->whereIn('order_items.order_id', $orders->pluck('id'))
            ->groupBy(
                'order_items.product_variant_id',
                'order_items.product_name',
                'order_items.variant_name',
                'pv.secondary_unit_value',
                'u2.short_code',
                'pv.measurement',
                'u1.short_code'
            )
            ->get();

        // Load items for each individual order for party name wise bills
        foreach ($orders as $order) {
            $order->items = DB::table('order_items')
                ->select(
                    'order_items.*',
                    'pv.secondary_unit_value',
                    'u2.short_code as secondary_unit_name',
                    'pv.measurement as primary_measurement',
                    'u1.short_code as primary_unit_name'
                )
                ->leftJoin('product_variants as pv', 'order_items.product_variant_id', '=', 'pv.id')
                ->leftJoin('units as u1', 'pv.stock_unit_id', '=', 'u1.id')
                ->leftJoin('units as u2', 'pv.secondary_unit_id', '=', 'u2.id')
                ->where('order_items.order_id', $order->id)
                ->get();
        }

        $app_name = \App\Models\Setting::get_value('app_name') ?: 'Sarthi Wholesale';
        $logo = \App\Models\Setting::get_value('logo') ?: \App\Models\Setting::get_value('web_settings_logo');

        // Build printable loading slip invoice template
        $html = view('loading_slip_print', [
            'slip' => $slip,
            'orders' => $orders,
            'itemSummary' => $itemSummary,
            'app_name' => $app_name,
            'logo' => $logo,
            'seller' => $seller,
        ])->render();

        return response($html)->header('Content-Type', 'text/html');
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

            $lat1 = doubleval($current->latitude);
            $lon1 = doubleval($current->longitude);

            foreach ($unvisited as $idx => $candidate) {
                $lat2 = doubleval($candidate->latitude);
                $lon2 = doubleval($candidate->longitude);

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

    // Helper method to calculate exact order weight in kg
    public static function calculateOrderWeight($orderId)
    {
        $items = OrderItem::where('order_id', $orderId)->get();
        $totalWeight = 0;

        foreach ($items as $item) {
            $variant = ProductVariant::find($item->product_variant_id);
            if ($variant) {
                $measurement = (float)$variant->measurement;
                $qty = (int)$item->quantity;
                $unit = Unit::find($variant->stock_unit_id);

                $weightInKg = 0;
                if ($unit) {
                    $code = strtolower(trim($unit->short_code));
                    if (in_array($code, ['kg', 'kilogram', 'kilograms', 'l', 'ltr', 'litre', 'litres'])) {
                        $weightInKg = $measurement;
                    } elseif (in_array($code, ['g', 'gm', 'gram', 'grams', 'ml', 'milliliter', 'milliliters'])) {
                        $weightInKg = $measurement / 1000;
                    } else {
                        // For pieces/packets treat as 0.1 kg standard
                        $weightInKg = 0.1;
                    }
                } else {
                    $weightInKg = 0.1;
                }
                $totalWeight += ($weightInKg * $qty);
            }
        }

        return round($totalWeight, 2);
    }
}
