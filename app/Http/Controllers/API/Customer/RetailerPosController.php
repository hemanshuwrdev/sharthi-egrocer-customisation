<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Helpers\MasterCatalogOrderHelper;
use App\Http\Controllers\Controller;
use App\Models\AdminToken;
use App\Models\MasterProductVariant;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusList;
use App\Models\Seller;
use App\Models\SellerProduct;
use App\Models\SellerProductSlabPrice;
use App\Models\Setting;
use App\Services\SchemeEngine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * Retailer POS — fast single-screen order placement without a persistent cart.
 *
 * Flow: search products → set qty per line → place order in one call.
 * Uses same orders/order_items tables, same scheme engine, same slab pricing,
 * same distributor notification as the regular retailer ordering flow.
 */
class RetailerPosController extends Controller
{
    /**
     * GET /customer/pos/products
     *
     * Fast product search for the POS screen. Accepts seller_id directly
     * (the retailer already knows their distributor from the regular catalog flow).
     *
     * Query params: seller_id (required), filter (name/SKU), category_id,
     *               brand_id, parent_company_id, page, per_page.
     */
    public function getProducts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seller_id' => 'required|integer|exists:sellers,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = auth()->user();
        if (!$user) {
            return CommonHelper::responseError('unauthorized');
        }

        $sellerId = (int) $request->seller_id;
        $limit    = (int) $request->input('per_page', 25);
        $page     = max((int) $request->input('page', 1), 1);
        $offset   = ($page - 1) * $limit;
        $filter   = trim((string) $request->input('filter', ''));

        $query = MasterProductVariant::query()
            ->with(['masterProduct.brand', 'masterProduct.category', 'unit', 'secondaryUnit'])
            ->join('master_products', 'master_product_variants.master_product_id', '=', 'master_products.id')
            ->join('seller_products', function ($j) use ($sellerId) {
                $j->on('seller_products.master_product_variant_id', '=', 'master_product_variants.id')
                  ->where('seller_products.seller_id', '=', $sellerId);
            })
            ->where('master_products.status', 1)
            ->where('master_product_variants.status', 1)
            ->where('seller_products.status', 1)
            ->where('seller_products.selling_price', '>', 0)
            ->where('seller_products.stock', '>', 0)
            ->select(
                'master_product_variants.*',
                'seller_products.id as sp_id',
                'seller_products.mrp as sp_mrp',
                'seller_products.selling_price as sp_selling_price',
                'seller_products.discounted_price as sp_discounted_price',
                'seller_products.stock as sp_stock'
            );

        if ($filter !== '') {
            $query->where(function ($w) use ($filter) {
                $w->where('master_products.name', 'like', "%{$filter}%")
                  ->orWhere('master_product_variants.sku', 'like', "%{$filter}%")
                  ->orWhere('master_products.hsn', 'like', "%{$filter}%");
            });
        }
        if ($request->filled('category_id')) {
            $query->where('master_products.category_id', (int) $request->category_id);
        }
        if ($request->filled('brand_id')) {
            $query->where('master_products.brand_id', (int) $request->brand_id);
        }
        if ($request->filled('parent_company_id')) {
            $query->where('master_products.parent_company_id', (int) $request->parent_company_id);
        }

        $rows = $query->orderBy('master_products.name')->orderBy('master_product_variants.id')->get();

        $slabsBySp = SellerProductSlabPrice::whereIn('seller_product_id', $rows->pluck('sp_id')->unique())
            ->orderBy('min_qty')
            ->get()
            ->groupBy('seller_product_id');

        $items = $rows->map(function ($r) use ($sellerId, $slabsBySp) {
            $mp   = $r->masterProduct;
            $slabs = isset($slabsBySp[$r->sp_id])
                ? $slabsBySp[$r->sp_id]->map(fn ($s) => [
                    'id'      => $s->id,
                    'min_qty' => (float) $s->min_qty,
                    'max_qty' => $s->max_qty !== null ? (float) $s->max_qty : null,
                    'price'   => (float) $s->price,
                ])->values()
                : [];

            return [
                'seller_product_id'    => $r->sp_id,
                'product_variant_id'   => $r->id,
                'product_id'           => $r->master_product_id,
                'name'                 => $mp ? $mp->name : null,
                'sku'                  => $r->sku,
                'category'             => $mp && $mp->category ? $mp->category->name : null,
                'category_id'          => $mp ? $mp->category_id : null,
                'brand'                => $mp && $mp->brand ? $mp->brand->name : null,
                'unit'                 => $r->unit ? $r->unit->name : null,
                'secondary_unit'       => $r->secondaryUnit ? $r->secondaryUnit->name : null,
                'secondary_unit_value' => $r->secondary_unit_value,
                // Stepper fields — salesman app configures qty widget using these
                'qty_step'             => (float) ($r->secondary_unit_value ?? 1) ?: 1,
                'min_qty'              => (float) ($r->secondary_unit_value ?? 1) ?: 1,
                'weight'               => $r->weight,
                'image'                => $r->image ?: ($mp ? $mp->image : null),
                'mrp'                  => (float) $r->sp_mrp,
                'selling_price'        => (float) $r->sp_selling_price,
                'discounted_price'     => $r->sp_discounted_price !== null ? (float) $r->sp_discounted_price : null,
                'stock'                => (float) $r->sp_stock,
                'slab_prices'          => $slabs,
            ];
        })->values();

        $total = $items->count();
        $paged = $items->slice($offset, $limit)->values();

        return CommonHelper::responseWithData($paged, $total);
    }

    /**
     * POST /customer/pos/place_order
     *
     * Direct order placement from a list of items — no cart required.
     * Mirrors RetailerCartOrderApiController::placeOrder but reads items from
     * the request body instead of the carts table.
     *
     * Body:
     *   seller_id        required  int
     *   items            required  array of {product_variant_id, qty}
     *   mobile           required  string
     *   payment_method   required  string
     *   address          required unless order_type=selfpickup
     *   latitude         required unless order_type=selfpickup
     *   longitude        required unless order_type=selfpickup
     *   order_type       optional  doorstep|selfpickup  (default doorstep)
     *   address_id       optional  int
     *   order_note       optional  string
     */
    public function placeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seller_id'            => 'required|integer|exists:sellers,id',
            'items'                => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|integer|exists:master_product_variants,id',
            'items.*.qty'          => 'required|numeric|min:1',
            'mobile'               => 'required|string',
            'payment_method'       => 'required|string',
            'order_type'           => 'nullable|in:doorstep,selfpickup',
            'address'              => 'required_unless:order_type,selfpickup',
            'latitude'             => 'required_unless:order_type,selfpickup',
            'longitude'            => 'required_unless:order_type,selfpickup',
            'address_id'           => 'nullable|integer',
            'order_note'           => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = auth()->user();
        if (!$user) {
            return CommonHelper::responseError('unauthorized');
        }

        // Verification gate — same as regular retailer placeOrder.
        if (!in_array($user->verification_status, ['approved', 'active'], true)) {
            return CommonHelper::responseError('retailer_pending_verification');
        }

        $sellerId = (int) $request->seller_id;

        // Pre-validate every line before any write.
        $resolved = [];
        foreach ($request->items as $item) {
            $variantId = (int) $item['product_variant_id'];
            $qty       = (float) $item['qty'];

            $line = MasterCatalogOrderHelper::resolveLine($sellerId, $variantId, $qty);
            if (!$line['ok']) {
                return CommonHelper::responseError($line['error']);
            }
            $resolved[] = ['item' => $item, 'line' => $line];
        }

        $sellerTotal = 0;
        $schemeLines = [];
        foreach ($resolved as $r) {
            $lineTotal    = $r['line']['unit_price'] * (float) $r['item']['qty'];
            $sellerTotal += $lineTotal;
            $schemeLines[] = [
                'seller_product_id' => $r['line']['seller_product']->id,
                'qty'               => (float) $r['item']['qty'],
                'line_total'        => $lineTotal,
            ];
        }

        $scheme         = SchemeEngine::evaluate($sellerId, $schemeLines);
        $schemeDiscount = $scheme['scheme_discount'] ?? 0;

        $orderId = null;
        $ordersId = 'OD' . date('YmdHis') . rand(10, 99);

        try {
            DB::transaction(function () use (
                $resolved, $request, $user, $sellerId,
                $sellerTotal, $schemeDiscount, $scheme, $ordersId, &$orderId
            ) {
                $deliveryDate = method_exists(CommonHelper::class, 'computeDeliveryDate')
                    ? CommonHelper::computeDeliveryDate(now(), $sellerId)
                    : null;

                $orderId = DB::table('orders')->insertGetId([
                    'user_id'         => $user->id,
                    'orders_id'       => $ordersId,
                    'mobile'          => $request->mobile,
                    'order_note'      => $request->order_note,
                    'total'           => $sellerTotal,
                    'delivery_charge' => 0,
                    'tax_amount'      => 0,
                    'tax_percentage'  => 0,
                    'wallet_balance'  => 0,
                    'discount'        => 0,
                    'promo_discount'  => 0,
                    'scheme_id'       => $scheme['scheme_id'] ?? null,
                    'scheme_discount' => $schemeDiscount,
                    'final_total'     => $sellerTotal - $schemeDiscount,
                    'payment_method'  => $request->payment_method,
                    'address'         => $request->address,
                    'latitude'        => $request->latitude,
                    'longitude'       => $request->longitude,
                    'delivery_time'   => $request->delivery_time ?? '',
                    'delivery_date'   => $deliveryDate,
                    'status'          => json_encode([['received', date('Y-m-d H:i:s')]]),
                    'active_status'   => (string) OrderStatusList::$received,
                    'order_type'      => $request->order_type ?? 'doorstep',
                    'address_id'      => $request->address_id ?? 0,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);

                foreach ($resolved as $r) {
                    $sp        = $r['line']['seller_product'];
                    $mv        = $r['line']['master_variant'];
                    $unitPrice = $r['line']['unit_price'];
                    $qty       = (float) $r['item']['qty'];
                    $subTotal  = $unitPrice * $qty;

                    DB::table('order_items')->insert([
                        'user_id'                   => $user->id,
                        'order_id'                  => $orderId,
                        'orders_id'                 => $ordersId,
                        'product_name'              => $mv->masterProduct->name ?? '',
                        'variant_name'              => $mv->sku ?? '',
                        'product_variant_id'        => 0,
                        'master_product_variant_id' => $mv->id,
                        'seller_product_id'         => $sp->id,
                        'quantity'                  => $qty,
                        'price'                     => $unitPrice,
                        'discounted_price'          => $r['line']['base_price'],
                        'tax_amount'                => 0,
                        'tax_percentage'            => 0,
                        'discount'                  => 0,
                        'sub_total'                 => $subTotal,
                        'status'                    => json_encode([['received', date('Y-m-d H:i:s')]]),
                        'active_status'             => (string) OrderStatusList::$received,
                        'seller_id'                 => $sellerId,
                        'slab_unit_price'           => $r['line']['slab'] ? $r['line']['slab']['price'] : null,
                        'slab_min_qty'              => $r['line']['slab']['min_qty'] ?? null,
                        'slab_max_qty'              => $r['line']['slab']['max_qty'] ?? null,
                        'created_at'                => now(),
                        'updated_at'                => now(),
                    ]);

                    MasterCatalogOrderHelper::decrementStock($sp->id, $qty);
                }

                // BXGY free items.
                foreach (($scheme['free_items'] ?? []) as $free) {
                    DB::table('order_items')->insert([
                        'user_id'                   => $user->id,
                        'order_id'                  => $orderId,
                        'orders_id'                 => $ordersId,
                        'product_name'              => $free['product_name'],
                        'variant_name'              => $free['variant_name'],
                        'product_variant_id'        => 0,
                        'master_product_variant_id' => $free['master_product_variant_id'],
                        'seller_product_id'         => $free['seller_product_id'],
                        'quantity'                  => $free['qty'],
                        'price'                     => 0,
                        'discounted_price'          => 0,
                        'tax_amount'                => 0,
                        'tax_percentage'            => 0,
                        'discount'                  => 0,
                        'sub_total'                 => 0,
                        'status'                    => json_encode([['received', date('Y-m-d H:i:s')]]),
                        'active_status'             => (string) OrderStatusList::$received,
                        'seller_id'                 => $sellerId,
                        'scheme_id'                 => $scheme['scheme_id'],
                        'is_free_item'              => 1,
                        'created_at'                => now(),
                        'updated_at'                => now(),
                    ]);

                    MasterCatalogOrderHelper::decrementStock((int) $free['seller_product_id'], (float) $free['qty']);
                }
            });
        } catch (\Throwable $e) {
            return CommonHelper::responseError($e->getMessage());
        }

        // Notify distributor — failure must not fail the order.
        try {
            $currency    = Setting::get_value('currency') ?? '$';
            $retailerName = trim((string) ($user->name ?? '')) ?: (string) ($user->mobile ?? '');
            $seller = Seller::select('admin_id')->where('id', $sellerId)->first();
            if ($seller) {
                $tokens = AdminToken::where('user_id', $seller->admin_id)->where('type', 'Seller')->get();
                if ($tokens->isNotEmpty()) {
                    CommonHelper::sendNotificationByTemplate(
                        $tokens,
                        'retailer_new_order_seller',
                        [
                            'order_id'      => $orderId,
                            'retailer_name' => $retailerName,
                            'currency'      => $currency,
                            'final_total'   => $sellerTotal - $schemeDiscount,
                        ],
                        'new_order', 0, '', null, null, 'order', $orderId
                    );
                }
            }
        } catch (\Throwable $e) {
            Log::error('[RetailerPOS] distributor push failed for order ' . $orderId . ': ' . $e->getMessage());
        }

        return CommonHelper::responseWithData([
            'order_id'        => $orderId,
            'orders_id'       => $ordersId,
            'sub_total'       => round($sellerTotal, 2),
            'scheme_discount' => round($schemeDiscount, 2),
            'final_total'     => round($sellerTotal - $schemeDiscount, 2),
            'applied_scheme'  => $scheme ? [
                'scheme_id'       => $scheme['scheme_id'],
                'name'            => $scheme['name'],
                'type'            => $scheme['type'],
                'scheme_discount' => $schemeDiscount,
                'free_items'      => $scheme['free_items'],
            ] : null,
            'message' => __('order_placed_successfully'),
        ]);
    }

    /**
     * GET /customer/pos/invoice/{id}
     *
     * Fetch a placed order's details for POS receipt display.
     * Scoped to the authenticated retailer — cannot view other users' orders.
     */
    public function getInvoice(Request $request, $id)
    {
        $user = auth()->user();
        if (!$user) {
            return CommonHelper::responseError('unauthorized');
        }

        $order = DB::table('orders')->where('id', $id)->where('user_id', $user->id)->first();
        if (!$order) {
            return CommonHelper::responseError('order_not_found');
        }

        $orderItems = DB::table('order_items')
            ->where('order_id', $id)
            ->get();

        $items = $orderItems->map(fn ($i) => [
            'product_name'     => $i->product_name,
            'variant_name'     => $i->variant_name,
            'qty'              => (float) $i->quantity,
            'unit_price'       => (float) $i->price,
            'sub_total'        => (float) $i->sub_total,
            'slab_unit_price'  => $i->slab_unit_price !== null ? (float) $i->slab_unit_price : null,
            'is_free_item'     => (int) ($i->is_free_item ?? 0),
        ])->values();

        $seller = DB::table('sellers')
            ->join('admins', 'admins.id', '=', 'sellers.admin_id')
            ->where('sellers.id', $order->seller_id ?? null)
            ->select('sellers.store_name', 'admins.email as seller_email')
            ->first();

        return CommonHelper::responseWithData([
            'order_id'        => $order->id,
            'orders_id'       => $order->orders_id,
            'date'            => $order->created_at,
            'delivery_date'   => $order->delivery_date,
            'payment_method'  => DB::table('order_payments')->where('order_id', $order->id)->orderByDesc('id')->value('method') ?? $order->payment_method,
            'order_note'      => $order->order_note,
            'seller_name'     => $seller->store_name ?? null,
            'sub_total'       => (float) $order->total,
            'scheme_discount' => (float) $order->scheme_discount,
            'final_total'     => (float) $order->final_total,
            'active_status'   => $order->active_status,
            'items'           => $items,
        ]);
    }
}
