<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Helpers\MasterCatalogOrderHelper;
use App\Http\Controllers\Controller;
use App\Models\BrandDistributorMapping;
use App\Models\Cart;
use App\Models\MasterProduct;
use App\Models\MasterProductVariant;
use App\Models\SellerProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

/**
 * Sarthi retailer cart + order placement on top of the master catalog.
 * Coexists with legacy Customer\CartApiController + Customer\OrderApiController;
 * the app should call these when operating in the new flow.
 *
 * Salesman flow: pass `seller_id` explicitly (the salesman's distributor) and we
 * skip the city → seller resolution.
 */
class RetailerCartOrderApiController extends Controller
{
    /**
     * Add a master variant to the retailer's cart.
     *
     * Body: product_variant_id, qty, latitude+longitude (retailer flow) OR seller_id (salesman flow).
     * Behavior:
     *   - Resolves the serving distributor (or accepts the explicit one)
     *   - Validates assignment + activation + stock
     *   - Upserts a carts row keyed by (user, master_variant, seller)
     */
    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_variant_id' => 'required|exists:master_product_variants,id',
            'qty' => 'required|numeric|min:1',
            'latitude' => 'nullable',
            'longitude' => 'nullable',
            'seller_id' => 'nullable|exists:sellers,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        if ((!$request->latitude || !$request->longitude) && !$request->seller_id) {
            return CommonHelper::responseError('latitude_longitude_or_seller_id_required');
        }

        $user = auth()->user();
        $variantId = (int) $request->product_variant_id;
        $qty = (float) $request->qty;

        $sellerId = (int) $request->seller_id ?: null;
        if (!$sellerId) {
            $cityIds = CommonHelper::getDeliverableCityIds($request->latitude, $request->longitude);
            if (empty($cityIds)) {
                return CommonHelper::responseError('product_not_available_in_your_area');
            }
            $resolved = $this->resolveSellerForCityIds($variantId, $cityIds);
            if (!$resolved['ok']) {
                return CommonHelper::responseError($resolved['error']);
            }
            $sellerId = $resolved['seller_id'];
        }

        $line = MasterCatalogOrderHelper::resolveLine($sellerId, $variantId, $qty);
        if (!$line['ok']) {
            return CommonHelper::responseError($line['error']);
        }

        $cart = Cart::where('user_id', $user->id)
            ->where('master_product_variant_id', $variantId)
            ->where('seller_id', $sellerId)
            ->first();

        if (!$cart) {
            $cart = new Cart();
            $cart->user_id = $user->id;
            $cart->product_id = $line['master_variant']->master_product_id;
            $cart->product_variant_id = 0;
            $cart->master_product_variant_id = $variantId;
            $cart->seller_id = $sellerId;
            $cart->save_for_later = 0;
        }
        $cart->seller_product_id = $line['seller_product']->id;
        $cart->qty = $qty;
        $cart->save();

        return CommonHelper::responseWithData([
            'cart_id' => $cart->id,
            'seller_id' => $sellerId,
            'unit_price' => $line['unit_price'],
            'slab' => $line['slab'],
            'message' => __('item_added_to_cart_successfully'),
        ]);
    }

    /**
     * List the retailer's master-catalog cart, grouped by distributor.
     * Re-resolves slab pricing on every fetch (prices may have changed).
     */
    public function getCart(Request $request)
    {
        $user = auth()->user();

        $items = Cart::where('user_id', $user->id)
            ->whereNotNull('master_product_variant_id')
            ->where('save_for_later', 0)
            ->get();

        if ($items->isEmpty()) {
            return CommonHelper::responseWithData(['groups' => [], 'grand_total' => 0]);
        }

        $variantIds = $items->pluck('master_product_variant_id')->unique();
        $variants = MasterProductVariant::with(['masterProduct.brand', 'masterProduct.parentCompany', 'unit'])
            ->whereIn('id', $variantIds)
            ->get()
            ->keyBy('id');

        $groups = [];
        foreach ($items as $row) {
            $variant = $variants[$row->master_product_variant_id] ?? null;
            if (!$variant) {
                continue;
            }

            $line = MasterCatalogOrderHelper::resolveLine((int) $row->seller_id, (int) $row->master_product_variant_id, (float) $row->qty);
            if (!$line['ok']) {
                $groups[$row->seller_id]['unavailable'][] = [
                    'cart_id' => $row->id,
                    'product_variant_id' => $row->master_product_variant_id,
                    'reason' => $line['error'],
                    'name' => $variant->masterProduct->name ?? '',
                ];
                continue;
            }

            $unitPrice = $line['unit_price'];
            $subtotal = $unitPrice * (float) $row->qty;

            $groups[$row->seller_id]['seller_id'] = (int) $row->seller_id;
            $groups[$row->seller_id]['items'][] = [
                'cart_id' => $row->id,
                'product_variant_id' => $variant->id,
                'product_id' => $variant->master_product_id,
                'name' => $variant->masterProduct->name ?? '',
                'brand' => $variant->masterProduct->brand->name ?? null,
                'sku' => $variant->sku,
                'unit' => $variant->unit->name ?? null,
                'image' => $variant->image ?: ($variant->masterProduct->image ?? null),
                'qty' => (float) $row->qty,
                'unit_price' => $unitPrice,
                'base_price' => $line['base_price'],
                'slab' => $line['slab'],
                'sub_total' => $subtotal,
            ];
            $groups[$row->seller_id]['sub_total'] = ($groups[$row->seller_id]['sub_total'] ?? 0) + $subtotal;
        }

        $groupsOut = collect($groups)->values();
        $grand = $groupsOut->sum('sub_total');

        return CommonHelper::responseWithData([
            'groups' => $groupsOut,
            'grand_total' => $grand,
        ]);
    }

    /**
     * Pick the serving distributor for a variant across a set of deliverable cities.
     * Honors the brand overlap flag; picks the cheapest activated offer when overlap is allowed.
     */
    private function resolveSellerForCityIds(int $variantId, array $cityIds): array
    {
        $variant = MasterProductVariant::with('masterProduct.brand')->find($variantId);
        if (!$variant || !$variant->masterProduct) {
            return ['ok' => false, 'error' => 'master_variant_not_found', 'seller_id' => null];
        }
        $brandId = $variant->masterProduct->brand_id;
        $overlapAllowed = $variant->masterProduct->brand && (int) $variant->masterProduct->brand->is_overlap_allowed === 1;

        $sellerIds = BrandDistributorMapping::where('brand_id', $brandId)
            ->whereIn('city_id', $cityIds)
            ->pluck('seller_id');

        if ($sellerIds->isEmpty()) {
            return ['ok' => false, 'error' => 'product_not_available_in_your_area', 'seller_id' => null];
        }

        if (!$overlapAllowed) {
            return ['ok' => true, 'error' => null, 'seller_id' => (int) $sellerIds->first()];
        }

        $sp = SellerProduct::whereIn('seller_id', $sellerIds)
            ->where('master_product_variant_id', $variantId)
            ->where('status', 1)
            ->where('selling_price', '>', 0)
            ->orderByRaw('CASE WHEN discounted_price > 0 THEN discounted_price ELSE selling_price END ASC')
            ->first();

        if (!$sp) {
            return ['ok' => false, 'error' => 'product_not_available_in_your_area', 'seller_id' => null];
        }
        return ['ok' => true, 'error' => null, 'seller_id' => (int) $sp->seller_id];
    }

    public function removeFromCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cart_id' => 'required|exists:carts,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = auth()->user();
        $deleted = Cart::where('id', $request->cart_id)
            ->where('user_id', $user->id)
            ->delete();

        return $deleted
            ? CommonHelper::responseSuccess('item_removed_from_cart')
            : CommonHelper::responseError('item_not_found');
    }

    /**
     * Count of master-catalog cart rows for the logged-in user (excluding save-for-later).
     */
    public function getCartCount(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return CommonHelper::responseError('user_not_found');
        }

        $count = Cart::where('user_id', $user->id)
            ->whereNotNull('master_product_variant_id')
            ->where('save_for_later', 0)
            ->count();

        return CommonHelper::responseWithData(['cart_count' => $count]);
    }

    /**
     * Move a cart row in/out of save-for-later. Body: cart_id, save_for_later (0|1).
     */
    public function saveForLater(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'cart_id' => 'required|exists:carts,id',
            'save_for_later' => 'required|in:0,1',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = auth()->user();
        $cart = Cart::where('id', $request->cart_id)
            ->where('user_id', $user->id)
            ->first();
        if (!$cart) {
            return CommonHelper::responseError('item_not_found');
        }

        $cart->save_for_later = (int) $request->save_for_later;
        $cart->save();

        return CommonHelper::responseSuccess('cart_updated_successfully');
    }

    /**
     * Bulk add master variants to the cart. Body:
     *   items[].product_variant_id, items[].qty
     *   + latitude+longitude (retailer) OR seller_id (salesman)
     *
     * Returns per-item ok/error so partial failures are visible to the client.
     */
    public function bulkAddToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|integer|exists:master_product_variants,id',
            'items.*.qty' => 'required|numeric|min:1',
            'latitude' => 'nullable',
            'longitude' => 'nullable',
            'seller_id' => 'nullable|exists:sellers,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        if ((!$request->latitude || !$request->longitude) && !$request->seller_id) {
            return CommonHelper::responseError('latitude_longitude_or_seller_id_required');
        }

        $user = auth()->user();
        $explicitSellerId = (int) $request->seller_id ?: null;
        $cityIds = !$explicitSellerId
            ? CommonHelper::getDeliverableCityIds($request->latitude, $request->longitude)
            : [];

        $results = [];
        foreach ($request->items as $idx => $item) {
            $variantId = (int) $item['product_variant_id'];
            $qty = (float) $item['qty'];

            $sellerId = $explicitSellerId;
            if (!$sellerId) {
                if (empty($cityIds)) {
                    $results[] = ['index' => $idx, 'ok' => false, 'error' => 'product_not_available_in_your_area'];
                    continue;
                }
                $resolved = $this->resolveSellerForCityIds($variantId, $cityIds);
                if (!$resolved['ok']) {
                    $results[] = ['index' => $idx, 'ok' => false, 'error' => $resolved['error']];
                    continue;
                }
                $sellerId = $resolved['seller_id'];
            }

            $line = MasterCatalogOrderHelper::resolveLine($sellerId, $variantId, $qty);
            if (!$line['ok']) {
                $results[] = ['index' => $idx, 'ok' => false, 'error' => $line['error']];
                continue;
            }

            $cart = Cart::where('user_id', $user->id)
                ->where('master_product_variant_id', $variantId)
                ->where('seller_id', $sellerId)
                ->first();
            if (!$cart) {
                $cart = new Cart();
                $cart->user_id = $user->id;
                $cart->product_id = $line['master_variant']->master_product_id;
                $cart->product_variant_id = 0;
                $cart->master_product_variant_id = $variantId;
                $cart->seller_id = $sellerId;
                $cart->save_for_later = 0;
            }
            $cart->seller_product_id = $line['seller_product']->id;
            $cart->qty = $qty;
            $cart->save();

            $results[] = [
                'index' => $idx,
                'ok' => true,
                'cart_id' => $cart->id,
                'seller_id' => $sellerId,
                'unit_price' => $line['unit_price'],
            ];
        }

        return CommonHelper::responseWithData($results);
    }

    /**
     * Place an order from the retailer's master-catalog cart.
     * Splits per distributor → one Order per seller. Each order_items row gets
     * a frozen slab snapshot. seller_products.stock is decremented atomically.
     *
     * Required: address, payment_method, mobile, latitude, longitude
     */
    public function placeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile' => 'required',
            'address' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'payment_method' => 'required',
            'delivery_time' => 'nullable|string',
            'address_id' => 'nullable|integer',
            'order_note' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = auth()->user();

        $items = Cart::where('user_id', $user->id)
            ->whereNotNull('master_product_variant_id')
            ->where('save_for_later', 0)
            ->get();

        if ($items->isEmpty()) {
            return CommonHelper::responseError('cart_is_empty');
        }

        // Pre-validate every line before any write
        $resolved = [];
        foreach ($items as $row) {
            $line = MasterCatalogOrderHelper::resolveLine((int) $row->seller_id, (int) $row->master_product_variant_id, (float) $row->qty);
            if (!$line['ok']) {
                return CommonHelper::responseError($line['error']);
            }
            $resolved[$row->id] = $line;
        }

        $bySeller = $items->groupBy('seller_id');
        $createdOrders = [];

        try {
            DB::transaction(function () use ($items, $resolved, $bySeller, $request, $user, &$createdOrders) {
                foreach ($bySeller as $sellerId => $sellerItems) {
                    $sellerTotal = 0;
                    foreach ($sellerItems as $row) {
                        $r = $resolved[$row->id];
                        $sellerTotal += $r['unit_price'] * (float) $row->qty;
                    }

                    $ordersId = 'OD' . date('YmdHis') . rand(10, 99);
                    $deliveryDate = method_exists(CommonHelper::class, 'computeDeliveryDate')
                        ? CommonHelper::computeDeliveryDate(now(), (int) $sellerId)
                        : null;

                    $orderId = DB::table('orders')->insertGetId([
                        'user_id' => $user->id,
                        'orders_id' => $ordersId,
                        'mobile' => $request->mobile,
                        'order_note' => $request->order_note,
                        'total' => $sellerTotal,
                        'delivery_charge' => 0,
                        'tax_amount' => 0,
                        'tax_percentage' => 0,
                        'wallet_balance' => 0,
                        'discount' => 0,
                        'promo_discount' => 0,
                        'final_total' => $sellerTotal,
                        'payment_method' => $request->payment_method,
                        'address' => $request->address,
                        'latitude' => $request->latitude,
                        'longitude' => $request->longitude,
                        'delivery_time' => $request->delivery_time ?? '',
                        'delivery_date' => $deliveryDate,
                        'status' => json_encode([['received', date('Y-m-d H:i:s')]]),
                        'active_status' => 'received',
                        'address_id' => $request->address_id ?? 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    foreach ($sellerItems as $row) {
                        $r = $resolved[$row->id];
                        $sp = $r['seller_product'];
                        $mv = $r['master_variant'];
                        $unitPrice = $r['unit_price'];
                        $subTotal = $unitPrice * (float) $row->qty;

                        DB::table('order_items')->insert([
                            'user_id' => $user->id,
                            'order_id' => $orderId,
                            'orders_id' => $ordersId,
                            'product_name' => $mv->masterProduct->name ?? '',
                            'variant_name' => $mv->sku ?? '',
                            'product_variant_id' => 0,
                            'master_product_variant_id' => $mv->id,
                            'seller_product_id' => $sp->id,
                            'quantity' => $row->qty,
                            'price' => $unitPrice,
                            'discounted_price' => $r['base_price'],
                            'tax_amount' => 0,
                            'tax_percentage' => 0,
                            'discount' => 0,
                            'sub_total' => $subTotal,
                            'status' => json_encode([['received', date('Y-m-d H:i:s')]]),
                            'active_status' => 'received',
                            'seller_id' => $sellerId,
                            'slab_unit_price' => $r['slab'] ? $r['slab']['price'] : null,
                            'slab_min_qty' => $r['slab']['min_qty'] ?? null,
                            'slab_max_qty' => $r['slab']['max_qty'] ?? null,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        MasterCatalogOrderHelper::decrementStock($sp->id, (float) $row->qty);
                    }

                    $createdOrders[] = [
                        'order_id' => $orderId,
                        'orders_id' => $ordersId,
                        'seller_id' => (int) $sellerId,
                        'final_total' => $sellerTotal,
                        'delivery_date' => $deliveryDate,
                    ];
                }

                Cart::whereIn('id', $items->pluck('id'))->delete();
            });
        } catch (\Throwable $e) {
            return CommonHelper::responseError($e->getMessage());
        }

        return CommonHelper::responseWithData([
            'orders' => $createdOrders,
            'message' => __('order_placed_successfully'),
        ]);
    }
}
