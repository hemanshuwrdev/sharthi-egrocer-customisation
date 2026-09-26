<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\BrandDistributorMapping;
use App\Models\City;
use App\Models\DeliveryBoy;
use App\Models\LoadingSlip;
use App\Models\MasterProductVariant;
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
        $status = $request->input('status', 'all');
        $fromDate = $request->input('from_date');
        $toDate = $request->input('to_date');

        $query = LoadingSlip::with(['vehicle', 'driver'])->orderBy('id', 'DESC');

        // Cancelled slips are kept in the DB for the audit trail (never deleted — see
        // cancel()) but a cancelled slip has no further action to take on it, so it's
        // excluded from this list by default. Still reachable directly via view(), or by
        // explicitly filtering status=3.
        if ($status === 'all' || $status === '' || $status === null) {
            $query->where('status', '!=', 3);
        } else {
            $query->where('status', (int) $status);
        }

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

        $query->when($fromDate, fn ($q) => $q->whereDate('created_at', '>=', $fromDate))
              ->when($toDate, fn ($q) => $q->whereDate('created_at', '<=', $toDate));

        $total = $query->count();
        $slips = $query->skip($offset)->take($limit)->get();

        // DeliveryBoy model globally appends pending_order_count/translations/license
        // URLs — each of those runs its own query when a driver is serialized, firing
        // once per row here (N+1). This list only ever shows driver name/mobile, so hide
        // the unused appends for this response only — the model's global $appends stay
        // untouched, so every other screen that actually needs them is unaffected.
        foreach ($slips as $slip) {
            if ($slip->driver) {
                $slip->driver->makeHidden(['pending_order_count', 'translations', 'driving_license_url', 'national_identity_card_url']);
            }
        }

        return CommonHelper::responseWithData($slips, $total);
    }

    public function getOrdersForAssignment(Request $request)
    {
        $cityId = $request->input('city_id', '');
        $areaId = $request->input('area_id', '');
        $isRescheduled = $request->input('is_rescheduled', '');

        $query = Order::select(
                'orders.*',
                DB::raw('COALESCE(rp.shop_name, rp.party_name, users.name) as user_name'),
                'cities.zone as city_zone',
                // area_id isn't always stamped on the order itself (older orders, or the
                // salesman-placed flow) — fall back to the delivery address's area, then
                // the retailer's own profile area, so the loading slip screen isn't blank.
                DB::raw('COALESCE(areas.name, ua_areas.name, rp_areas.name) as area_name')
            )
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles as rp', 'orders.user_id', '=', 'rp.user_id')
            ->leftJoin('user_addresses', 'orders.address_id', '=', 'user_addresses.id')
            ->leftJoin('cities', 'user_addresses.city_id', '=', 'cities.id')
            ->leftJoin('areas', 'orders.area_id', '=', 'areas.id')
            ->leftJoin('areas as ua_areas', 'user_addresses.area_id', '=', 'ua_areas.id')
            ->leftJoin('areas as rp_areas', 'rp.area_id', '=', 'rp_areas.id')
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
            // Match the same area resolved for display (COALESCE above): orders.area_id
            // first, falling back to the delivery address's area, then the retailer
            // profile's area — otherwise orders showing "bhuj" via fallback never match
            // a "bhuj" filter that only checked orders.area_id.
            $query->where(function ($q) use ($areaId) {
                $q->where('orders.area_id', $areaId)
                  ->orWhere(function ($q2) use ($areaId) {
                      $q2->whereNull('orders.area_id')->where('user_addresses.area_id', $areaId);
                  })
                  ->orWhere(function ($q3) use ($areaId) {
                      $q3->whereNull('orders.area_id')->whereNull('user_addresses.area_id')->where('rp.area_id', $areaId);
                  });
            });
        }

        // Product filter: an order matches if it contains ANY of the selected products
        // (union, not intersection) — selecting 2 products surfaces every order that has
        // at least one of them, not just orders containing both.
        $productIds = array_filter((array) $request->input('product_ids', []));
        if (!empty($productIds)) {
            $query->whereExists(function ($q) use ($productIds) {
                $q->select(DB::raw(1))
                  ->from('order_items')
                  ->whereColumn('order_items.order_id', 'orders.id')
                  ->whereIn('order_items.seller_product_id', $productIds);
            });
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

    /**
     * GET /loading_slips/products
     * Lightweight {id, text} list (id = seller_product_id) for the product multiselect
     * filter on the create-slip screen — feeds getOrdersForAssignment()'s product_ids param.
     */
    public function getFilterProducts()
    {
        if (!auth()->user() || !auth()->user()->seller) {
            return CommonHelper::responseError('Only distributors (sellers) can view this.');
        }
        $sellerId = auth()->user()->seller->id;

        $products = SellerProduct::with('masterProductVariant.masterProduct')
            ->where('seller_id', $sellerId)
            ->where('status', 1)
            ->get()
            ->map(fn ($sp) => [
                'id'   => $sp->id,
                'text' => trim(($sp->masterProductVariant->masterProduct->name ?? '') . ' — ' . ($sp->masterProductVariant->sku ?? '')),
            ])
            ->values();

        return CommonHelper::responseWithData($products);
    }

    /**
     * POST /loading_slips/order_items_summary
     * Body: order_ids[] — pure display data for the pre-generate review modal on the
     * create-slip screen: one table's worth of rows per order, each product's quantity
     * broken into boxes + loose pieces using the same secondary_unit_value math
     * calculateOrderWeight() already uses below. Deliberately has nothing to do with
     * SellerProduct.stock or save()'s stock-shortage check — this is not a validation/
     * blocking step, just a number-crunched summary for the distributor to eyeball
     * against physical stock themselves.
     */
    public function getOrderItemsSummary(Request $request)
    {
        if (!auth()->user() || !auth()->user()->seller) {
            return CommonHelper::responseError('Only distributors (sellers) can view this.');
        }

        $validator = Validator::make($request->all(), [
            'order_ids'   => 'required|array|min:1',
            'order_ids.*' => 'integer',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $sellerId = auth()->user()->seller->id;

        $orders = Order::select('orders.id', 'orders.orders_id', DB::raw('COALESCE(rp.shop_name, rp.party_name, users.name) as retailer_name'))
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('retailer_profiles as rp', 'orders.user_id', '=', 'rp.user_id')
            ->whereIn('orders.id', $request->order_ids)
            ->orderBy('orders.id')
            ->get();

        $items = OrderItem::whereIn('order_id', $request->order_ids)
            ->where('seller_id', $sellerId)
            ->get()
            ->groupBy('order_id');

        $variantIds = $items->flatten()->pluck('master_product_variant_id')->filter()->unique();
        $variants = MasterProductVariant::with(['unit', 'secondaryUnit'])
            ->whereIn('id', $variantIds)
            ->get()
            ->keyBy('id');

        $summary = $orders->map(function ($order) use ($items, $variants) {
            $rows = [];
            foreach ($items->get($order->id, collect()) as $item) {
                $key = $item->master_product_variant_id
                    ? 'master_' . $item->master_product_variant_id
                    : 'legacy_' . $item->product_variant_id;

                if (!isset($rows[$key])) {
                    $rows[$key] = [
                        'name'       => trim($item->product_name . ($item->variant_name ? ' (' . $item->variant_name . ')' : '')),
                        'qty'        => 0,
                        // box_unit = the bulk grouping (e.g. "Box") — confusingly this is the
                        // *secondary* unit / "Inner Pack Unit" in this app's own Master Catalog
                        // terminology. piece_unit = the individual sellable unit (e.g. "Pcs"/"Kg"),
                        // which is the *primary* unit / "Outer Pack Unit". Named for clarity here
                        // instead of reusing that inverted outer/inner wording.
                        'box_unit'   => null,
                        'piece_unit' => null,
                        'pack_size'  => null,
                    ];

                    $variant = $item->master_product_variant_id ? $variants->get($item->master_product_variant_id) : null;
                    if ($variant && (float) $variant->secondary_unit_value > 0) {
                        $rows[$key]['pack_size']  = (float) $variant->secondary_unit_value;
                        $rows[$key]['box_unit']   = $variant->secondaryUnit->name ?? null;
                        $rows[$key]['piece_unit'] = $variant->unit->name ?? null;
                    }
                }

                $rows[$key]['qty'] += (float) $item->quantity;
            }

            $rows = collect($rows)->map(function ($row, $key) {
                $qty = (int) round($row['qty']);
                if ($row['pack_size'] > 0) {
                    $packSize = (int) round($row['pack_size']);
                    $row['boxes'] = intdiv($qty, $packSize);
                    $row['loose'] = $qty % $packSize;
                } else {
                    $row['boxes'] = null;
                    $row['loose'] = null;
                }
                $row['qty'] = $qty;
                // key + pack_size (raw, not the per-order boxes/loose) are kept so the
                // frontend can group these rows by product across orders and correctly
                // recompute boxes/loose for the *aggregate* quantity — summing each
                // order's own boxes/loose would give a wrong total (e.g. four orders of
                // "0 boxes + 25 loose" at pack size 50 is actually "2 boxes + 0 loose"
                // once combined, not "0 boxes + 100 loose").
                $row['key'] = $key;
                return $row;
            })->values();

            return [
                'order_id'      => $order->id,
                'orders_id'     => $order->orders_id,
                'retailer_name' => $order->retailer_name ?: '-',
                'items'         => $rows,
            ];
        })->values();

        return CommonHelper::responseWithData($summary);
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

    /**
     * GET /seller/loading_slips/areas
     * "Filter By Area" options on the create-slip screen — restricted to areas
     * actually assigned to this distributor (distributor_areas), not every area
     * in the system.
     */
    public function getFilterAreas()
    {
        $query = \App\Models\Area::query();

        if (auth()->user() && auth()->user()->seller) {
            $areaIds = \App\Models\DistributorArea::where('seller_id', auth()->user()->seller->id)
                ->pluck('area_id');
            $query->whereIn('id', $areaIds);
        }

        $areas = $query->orderBy('name')->get(['id', 'name']);

        return CommonHelper::responseWithData($areas);
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
            $items = OrderItem::where('order_id', $order->id)
                ->whereNotIn('active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
                ->get();
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

            $totalItems += OrderItem::where('order_id', $order->id)
                ->whereNotIn('active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
                ->sum('quantity');
        }

        // Weight Capacity Check
        if ($totalWeight > $vehicle->capacity) {
            return CommonHelper::responseError("Weight Capacity exceeded! Total selected weight {$totalWeight} kg exceeds vehicle capacity {$vehicle->capacity} kg.");
        }

        // Route sequence: nearest neighbor spatial clustering
        $sequencedOrderIds = $this->sequenceRoutesByProximity($orders);

        DB::beginTransaction();
        try {
            // Generate slip number — distributor's own prefix/number/suffix sequence,
            // independent from their order-invoice numbering (a slip bundles many orders).
            $slipNo = CommonHelper::nextLoadingSlipNumber(auth()->user()->seller);

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
            $order->items = OrderItem::where('order_id', $order->id)
                ->whereNotIn('active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
                ->get();
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
        if (!$slip) {
            return CommonHelper::responseError('Loading slip not found.');
        }
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

                // Dispatch notification to Delivery Boy — a push-notification failure
                // (bad FCM token, template lookup, etc.) must never abort the dispatch
                // itself, so it's caught separately. \Throwable, not \Exception — a
                // TypeError/Error here would otherwise escape both catches below and
                // surface as a raw, unhelpful 500.
                try {
                    CommonHelper::sendNotificationOrderAssignDeliveryBoy($order);
                } catch (\Throwable $ne) {
                    try {
                        Log::error("FCM dispatch notification error: " . $ne->getMessage());
                    } catch (\Throwable $logErr) {
                        // Logging itself failed (misconfigured channel) — don't let that
                        // crash the request on top of the original notification error.
                    }
                }
            }

            DB::commit();
            return CommonHelper::responseSuccess('Loading slip dispatched and out-for-delivery successfully.');
        } catch (\Throwable $e) {
            DB::rollBack();
            try {
                Log::error("Error dispatching loading slip: " . $e->getMessage());
            } catch (\Throwable $logErr) {
                // ignore — see comment above
            }
            // Surface the real reason instead of a generic message — this endpoint was
            // returning an unhelpful raw 500 with no indication of what actually failed.
            return CommonHelper::responseError('Something went wrong during dispatch: ' . $e->getMessage());
        }
    }

    /**
     * POST /loading_slips/cancel
     * Body: id — only while status=0 (not yet dispatched, so nothing has physically left
     * the warehouse). Fully releases every assigned order back to unassigned — clearing
     * loading_slip_id/delivery_boy_id/bonus fields exactly as save() set them — so they're
     * immediately eligible again via getOrdersForAssignment() for a fresh loading slip.
     * We never delete the slip itself; it's kept, marked Cancelled, for the audit trail.
     */
    public function cancel(Request $request)
    {
        if (!auth()->user() || !auth()->user()->seller) {
            return CommonHelper::responseError('Only distributors (sellers) can cancel a loading slip.');
        }

        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:loading_slips,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $slip = LoadingSlip::find($request->id);
        if (!$slip) {
            return CommonHelper::responseError('Loading slip not found.');
        }
        if ($slip->created_by != auth()->user()->id) {
            return CommonHelper::responseError('Access denied to this loading slip.');
        }
        if ($slip->status != 0) {
            return CommonHelper::responseError('Only a not-yet-dispatched loading slip can be cancelled.');
        }

        DB::beginTransaction();
        try {
            Order::where('loading_slip_id', $slip->id)->update([
                'loading_slip_id' => null,
                'delivery_boy_id' => null,
                'delivery_boy_bonus_details' => null,
                'delivery_boy_bonus_amount' => null,
            ]);

            $slip->status = 3; // Cancelled
            $slip->save();

            DB::commit();
            return CommonHelper::responseSuccess('Loading slip cancelled — orders are available to add to a new slip.');
        } catch (\Throwable $e) {
            DB::rollBack();
            try {
                Log::error("Error cancelling loading slip: " . $e->getMessage());
            } catch (\Throwable $logErr) {
                // ignore
            }
            return CommonHelper::responseError('Something went wrong while cancelling: ' . $e->getMessage());
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
                'areas.name as area_name',
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
            ->leftJoin('areas', 'user_addresses.area_id', '=', 'areas.id')
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
            ->whereNotIn('order_items.active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
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
                ->whereNotIn('order_items.active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
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
        $items = OrderItem::where('order_id', $orderId)
            ->whereNotIn('active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
            ->get();
        $totalWeight = 0;

        // Batch-load every variant + unit this order's items could need, once, instead of
        // one MasterProductVariant::find()/ProductVariant::find()/Unit::find() per item —
        // that was N+1 (2 queries per line item) on every order with several lines.
        $masterVariantIds = $items->pluck('master_product_variant_id')->filter()->unique();
        $legacyVariantIds = $items->whereNull('master_product_variant_id')->pluck('product_variant_id')->filter()->unique();

        $masterVariants = $masterVariantIds->isNotEmpty()
            ? \App\Models\MasterProductVariant::whereIn('id', $masterVariantIds)->get()->keyBy('id')
            : collect();
        $legacyVariants = $legacyVariantIds->isNotEmpty()
            ? ProductVariant::whereIn('id', $legacyVariantIds)->get()->keyBy('id')
            : collect();

        $unitIds = $masterVariants->map(fn ($v) => $v->weight_unit_id ?: $v->unit_id)
            ->merge($legacyVariants->pluck('stock_unit_id'))
            ->filter()->unique();
        $units = $unitIds->isNotEmpty() ? Unit::whereIn('id', $unitIds)->get()->keyBy('id') : collect();

        foreach ($items as $item) {
            $weightInKg = 0;

            if ($item->master_product_variant_id) {
                // Master catalog system
                $variant = $masterVariants->get($item->master_product_variant_id);
                if ($variant) {
                    // variant->weight is the weight of ONE Inner Pack (box of secondary_unit_value
                    // outer-pack units) — divide down to a per-outer-unit weight before multiplying
                    // by order quantity below. Order quantity is always denominated in outer-pack
                    // units (loose or not), so this one formula covers both cases.
                    $secondaryUnitValue = (float) ($variant->secondary_unit_value ?? 0);
                    $weight = (float)($variant->weight ?? 0);
                    $weight = $secondaryUnitValue > 0 ? $weight / $secondaryUnitValue : $weight;
                    // weight is stored in weight_unit_id; unit_id is the selling unit (Nos/Pcs)
                    $unit = $units->get($variant->weight_unit_id ?: $variant->unit_id);

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
                $variant = $legacyVariants->get($item->product_variant_id);
                if ($variant) {
                    $measurement = (float)$variant->measurement;
                    $unit = $units->get($variant->stock_unit_id);

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
