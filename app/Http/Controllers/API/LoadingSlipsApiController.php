<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\BrandDistributorMapping;
use App\Models\City;
use App\Models\DeliveryBoy;
use App\Models\LoadingSlip;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusList;
use App\Models\ProductVariant;
use App\Models\SellerProduct;
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
        $cityId = $request->input('city_id', '');
        $areaId = $request->input('area_id', '');
        $isRescheduled = $request->input('is_rescheduled', '');

        $query = Order::select('orders.*', 'users.name as user_name', 'cities.zone as city_zone', 'areas.name as area_name')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
            ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
            ->leftJoin('areas', 'orders.area_id', '=', 'areas.id')
            ->whereNull('orders.loading_slip_id')
            ->where('orders.order_type', 'doorstep')
            ->whereIn('orders.active_status', [
                OrderStatusList::$received,
                OrderStatusList::$processed,
                OrderStatusList::$shipped,
                OrderStatusList::$rescheduled
            ]);

        if ($isRescheduled === '1' || $isRescheduled === 1) {
            $query->whereExists(function ($q) {
                $q->select(DB::raw(1))
                  ->from('order_statuses')
                  ->whereColumn('order_statuses.order_id', 'orders.id')
                  ->where('order_statuses.status', 'Rescheduled');
            });
        } elseif ($isRescheduled === '0' || $isRescheduled === 0) {
            $query->whereNotExists(function ($q) {
                $q->select(DB::raw(1))
                  ->from('order_statuses')
                  ->whereColumn('order_statuses.order_id', 'orders.id')
                  ->where('order_statuses.status', 'Rescheduled');
            });
        }

        if (auth()->user() && auth()->user()->seller) {
            $sellerId = auth()->user()->seller->id;
            $query->whereExists(function ($q) use ($sellerId) {
                $q->select(DB::raw(1))
                  ->from('order_items')
                  ->whereColumn('order_items.order_id', 'orders.id')
                  ->where('order_items.seller_id', $sellerId);
            });
        }

        if ($cityId) {
            $query->where('user_addresses.city_id', $cityId);
        }

        if ($areaId) {
            $query->where('orders.area_id', $areaId);
        }

        // Add is_rescheduled flag via subquery — avoids N+1 per order
        $query->addSelect(DB::raw(
            'EXISTS(SELECT 1 FROM order_statuses WHERE order_statuses.order_id = orders.id AND order_statuses.status = "Rescheduled") as is_rescheduled'
        ));

        $orders = $query->orderBy('orders.id', 'ASC')->get();

        // Back-fill weight only for orders that have never had it calculated (null).
        // Do NOT recalculate on every request — that causes N×M queries and deadlocks.
        $needsWeight = $orders->filter(fn($o) => $o->weight === null)->pluck('id');
        if ($needsWeight->isNotEmpty()) {
            foreach ($needsWeight as $orderId) {
                $weight = self::calculateOrderWeight($orderId);
                Order::where('id', $orderId)->update(['weight' => $weight]);
            }
            // Reload weights for those orders
            $weights = Order::whereIn('id', $needsWeight)->pluck('weight', 'id');
            $orders->each(function ($o) use ($weights) {
                if (isset($weights[$o->id])) $o->weight = $weights[$o->id];
            });
        }

        return CommonHelper::responseWithData($orders);
    }

    public function getZones()
    {
        $query = City::whereNotNull('zone')->where('zone', '!=', '');

        if (auth()->user() && auth()->user()->seller) {
            $cityIds = BrandDistributorMapping::where('seller_id', auth()->user()->seller->id)
                ->distinct()
                ->pluck('city_id');
            $query->whereIn('id', $cityIds);
        }

        $zones = $query->orderBy('zone')->get(['id', 'zone']);

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

        // Stock confirmation check
        $stockShortages = [];
        $sellerId = auth()->user()->seller->id ?? null;

        // Group items by variant to check total required quantity
        $variantQuantities = [];
        foreach ($orders as $order) {
            $items = OrderItem::where('order_id', $order->id)->get();
            foreach ($items as $item) {
                if ($item->master_product_variant_id) {
                    $key = 'master_' . $item->master_product_variant_id;
                    if (!isset($variantQuantities[$key])) {
                        $variantQuantities[$key] = [
                            'type' => 'master',
                            'id' => $item->master_product_variant_id,
                            'name' => $item->product_name . ($item->variant_name ? ' (' . $item->variant_name . ')' : ''),
                            'qty' => 0,
                        ];
                    }
                    $variantQuantities[$key]['qty'] += $item->quantity;
                } else {
                    $key = 'legacy_' . $item->product_variant_id;
                    if (!isset($variantQuantities[$key])) {
                        $variantQuantities[$key] = [
                            'type' => 'legacy',
                            'id' => $item->product_variant_id,
                            'name' => $item->product_name . ($item->variant_name ? ' (' . $item->variant_name . ')' : ''),
                            'qty' => 0,
                        ];
                    }
                    $variantQuantities[$key]['qty'] += $item->quantity;
                }
            }
        }

        foreach ($variantQuantities as $vq) {
            $currentStock = 0;
            if ($vq['type'] === 'master') {
                $sp = SellerProduct::where('seller_id', $sellerId)
                    ->where('master_product_variant_id', $vq['id'])
                    ->first();
                $currentStock = $sp ? (float)$sp->stock : 0;
            } else {
                $pv = ProductVariant::find($vq['id']);
                $currentStock = $pv ? (float)$pv->stock : 0;
            }

            // Since stock was already decremented at order placement, the actual physical stock
            // available in the warehouse is the remaining database stock plus the quantity
            // already reserved/subtracted for the orders on this loading slip.
            $physicalAvailableStock = $currentStock + $vq['qty'];

            if ($physicalAvailableStock < $vq['qty']) {
                $stockShortages[] = [
                    'name' => $vq['name'],
                    'required' => $vq['qty'],
                    'available' => $physicalAvailableStock,
                ];
            }
        }

        if (!empty($stockShortages) && !$request->input('confirm_stock_shortage', false)) {
            return response()->json([
                'status' => 2,
                'message' => 'Some items in the selected orders have insufficient database stock. Do you want to proceed anyway?',
                'shortages' => $stockShortages
            ]);
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

    public function view(Request $request, $id = null)
    {
        $slipId = $id ?? $request->id ?? $request->loading_slip_id;
        if (empty($slipId)) {
            return CommonHelper::responseError('Loading slip ID is required.');
        }

        $slip = LoadingSlip::with(['vehicle', 'driver'])->find($slipId);
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
            ->where('orders.loading_slip_id', $slipId)
            ->get();

        foreach ($orders as $order) {
            $order->items = OrderItem::where('order_id', $order->id)->get();
            $order->is_rescheduled = DB::table('order_statuses')
                ->where('order_id', $order->id)
                ->where('status', 'Rescheduled')
                ->exists();
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
                'orders.mobile as customer_mobile',
                'placing_salesman.name as salesman_name',
                'placing_salesman.mobile as salesman_mobile'
            )
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
            ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
            ->leftJoin('retailer_profiles as rp', 'orders.user_id', '=', 'rp.user_id')
            ->leftJoin('salesmen as placing_salesman', 'orders.placed_by_salesman_id', '=', 'placing_salesman.id')
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

            $order->is_rescheduled = DB::table('order_statuses')
                ->where('order_id', $order->id)
                ->where('status', 'Rescheduled')
                ->exists();
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
            $weightInKg = 0;

            if ($item->master_product_variant_id) {
                // Master catalog system
                $variant = \App\Models\MasterProductVariant::find($item->master_product_variant_id);
                if ($variant) {
                    $weight = (float)($variant->weight ?? 0);
                    $unit = Unit::find($variant->unit_id);

                    if ($unit) {
                        $code = strtolower(trim($unit->short_code));
                        if (in_array($code, ['kg', 'kilogram', 'kilograms', 'l', 'ltr', 'litre', 'litres'])) {
                            $weightInKg = $weight;
                        } elseif (in_array($code, ['g', 'gm', 'gram', 'grams', 'ml', 'milliliter', 'milliliters'])) {
                            $weightInKg = $weight / 1000;
                        } else {
                            // For pieces/packets treat as 0.1 kg standard
                            $weightInKg = 0.1;
                        }
                    } else {
                        $weightInKg = 0.1;
                    }
                } else {
                    $weightInKg = 0.1;
                }
            } else {
                // Legacy system
                $variant = ProductVariant::find($item->product_variant_id);
                if ($variant) {
                    $measurement = (float)$variant->measurement;
                    $unit = Unit::find($variant->stock_unit_id);

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
                }
            }

            $qty = (int)$item->quantity;
            $totalWeight += ($weightInKg * $qty);
        }

        return round($totalWeight, 2);
    }
}
