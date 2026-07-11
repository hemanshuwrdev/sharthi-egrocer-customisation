<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Helpers\MasterCatalogOrderHelper;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\MasterProduct;
use App\Models\OrderStatusList;
use App\Models\SellerProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SellerPosController extends Controller
{
    public function getUsersList(Request $request)
    {
        try {
            $search = $request->input('search', '');
            $limit  = (int) $request->input('limit', 20);

            $query = DB::table('users')
                ->leftJoin('retailer_profiles', 'users.id', '=', 'retailer_profiles.user_id')
                ->select(
                    'users.id',
                    'users.name',
                    'users.mobile',
                    'users.email',
                    'retailer_profiles.shop_name'
                );

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('users.name', 'like', '%' . $search . '%')
                      ->orWhere('users.mobile', 'like', '%' . $search . '%')
                      ->orWhere('retailer_profiles.shop_name', 'like', '%' . $search . '%');
                });
            }

            $users = $query->orderByDesc('users.id')
                ->limit($limit > 0 ? $limit : 20)
                ->get();

            return CommonHelper::responseWithData($users);
        } catch (\Exception $e) {
            Log::error('POS getUsersList: ' . $e->getMessage());
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function placeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'                    => 'nullable|exists:users,id',
            'items'                      => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|exists:master_product_variants,id',
            'items.*.quantity'           => 'required|numeric|min:1',
            'items.*.custom_price'       => 'nullable|numeric|min:0',
            // 'payment_method'          => 'required|in:cash,card,upi',
            'total'                      => 'required|numeric',
            'final_total'                => 'required|numeric',
            'discount_amount'            => 'nullable|numeric',
            'discount_percentage'        => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $sellerId = auth()->user()->seller->id;

        DB::beginTransaction();
        try {
            // Pre-validate every line
            $resolved = [];
            foreach ($request->items as $idx => $item) {
                $r = MasterCatalogOrderHelper::resolveLine($sellerId, (int) $item['product_variant_id'], (float) $item['quantity']);
                if (!$r['ok']) {
                    DB::rollBack();
                    return CommonHelper::responseError(__($r['error']) ?: $r['error']);
                }
                $resolved[$idx] = $r;
            }

            $user     = $request->user_id ? DB::table('users')->where('id', $request->user_id)->first() : null;
            $ordersId = 'POS' . date('YmdHis') . rand(10, 99);
            $otp      = mt_rand(100000, 999999);
            $now      = date('Y-m-d H:i:s');

            $orderId = DB::table('orders')->insertGetId([
                'user_id'        => $request->user_id ?? null,
                'orders_id'      => $ordersId,
                'otp'            => $otp,
                'mobile'         => $user ? ($user->mobile ?? '') : '',
                'total'          => $request->total,
                'delivery_charge' => 0,
                'tax_amount'     => 0,
                'tax_percentage' => 0,
                'wallet_balance' => 0,
                'discount'       => $request->discount_amount ?? 0,
                'promo_discount' => 0,
                'final_total'    => $request->final_total,
                'payment_method' => $request->payment_method ?? 'cash',
                // 'payment_method' => $request->payment_method,
                'address'        => '',
                'latitude'       => '',
                'longitude'      => '',
                'delivery_time'  => '',
                'status'         => json_encode([['received', $now]]),
                'active_status'  => (string) OrderStatusList::$received,
                'order_type'     => 'pos',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            foreach ($request->items as $idx => $item) {
                $r        = $resolved[$idx];
                $sp       = $r['seller_product'];
                $mv       = $r['master_variant'];
                $qty      = (float) $item['quantity'];
                $price    = isset($item['custom_price']) && $item['custom_price'] > 0
                    ? (float) $item['custom_price']
                    : $r['unit_price'];
                $subtotal = $price * $qty;

                DB::table('order_items')->insert([
                    'user_id'                   => $request->user_id ?? null,
                    'order_id'                  => $orderId,
                    'orders_id'                 => $ordersId,
                    'product_name'              => $mv->masterProduct->name ?? '',
                    'variant_name'              => implode(' | ', array_filter([
                        $mv->sku ?? '',
                        $mv->secondary_unit_value
                            ? ((int) $mv->secondary_unit_value . ' ' . ($mv->secondaryUnit?->name ?? 'units') . '/box')
                            : null,
                    ])),
                    'product_variant_id'        => 0,
                    'master_product_variant_id' => $mv->id,
                    'seller_product_id'         => $sp->id,
                    'quantity'                  => $qty,
                    'price'                     => $price,
                    'discounted_price'          => $price,
                    'tax_amount'                => 0,
                    'tax_percentage'            => 0,
                    'discount'                  => 0,
                    'sub_total'                 => $subtotal,
                    'status'                    => json_encode([['received', $now]]),
                    'active_status'             => (string) OrderStatusList::$received,
                    'seller_id'                 => $sellerId,
                    'slab_unit_price'           => $r['slab'] ? $r['slab']['price'] : null,
                    'slab_min_qty'              => $r['slab']['min_qty'] ?? null,
                    'slab_max_qty'              => $r['slab']['max_qty'] ?? null,
                    'created_at'                => now(),
                    'updated_at'                => now(),
                ]);

                MasterCatalogOrderHelper::decrementStock($sp->id, $qty);
            }

            DB::commit();

            return CommonHelper::responseWithData([
                'order_id'     => $orderId,
                'order_number' => $ordersId,
                'status'       => 'completed',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('POS placeOrder: ' . $e->getMessage());
            return CommonHelper::responseError('Something went wrong. Please try again.');
        }
    }

    public function getProducts(Request $request)
    {
        try {
            $sellerId = auth()->user()->seller->id;
            $perPage  = (int) ($request->per_page ?? 9);
            $page     = max((int) ($request->page ?? 1), 1);

            $masterIdsQuery = MasterProduct::query()
                ->select('master_products.id')
                ->join('master_product_variants', 'master_product_variants.master_product_id', '=', 'master_products.id')
                ->join('seller_products', function ($j) use ($sellerId) {
                    $j->on('seller_products.master_product_variant_id', '=', 'master_product_variants.id')
                        ->where('seller_products.seller_id', $sellerId)
                        ->where('seller_products.status', 1);
                })
                ->where('master_products.status', 1)
                ->where('master_product_variants.status', 1);

            if ($request->category_id) {
                $masterIdsQuery->where('master_products.category_id', $request->category_id);
            }

            if ($request->search) {
                $search = $request->search;
                $masterIdsQuery->where(function ($q) use ($search) {
                    $q->where('master_products.name', 'like', "%{$search}%")
                        ->orWhere('master_products.slug', 'like', "%{$search}%")
                        ->orWhere('master_product_variants.sku', 'like', "%{$search}%");
                });
            }

            $masterIds    = $masterIdsQuery->distinct()->pluck('master_products.id');
            $totalProducts = $masterIds->count();
            $pagedIds     = $masterIds->slice(($page - 1) * $perPage, $perPage)->values();

            $products = MasterProduct::with(['variants' => function ($q) use ($sellerId) {
                $q->where('master_product_variants.status', 1)
                    ->whereHas('sellerProducts', function ($q2) use ($sellerId) {
                        $q2->where('seller_id', $sellerId)->where('status', 1);
                    })
                    ->with(['unit']);
            }])
                ->whereIn('id', $pagedIds)
                ->orderBy('name')
                ->get();

            $variantIds = $products->flatMap(fn($p) => $p->variants->pluck('id'))->unique();
            $overrides  = SellerProduct::where('seller_id', $sellerId)
                ->whereIn('master_product_variant_id', $variantIds)
                ->get()
                ->keyBy('master_product_variant_id');

            $transformedProducts = $products->map(function ($product) use ($overrides) {
                return [
                    'id'               => $product->id,
                    'name'             => $product->name,
                    'description'      => $product->description,
                    'image_url'        => CommonHelper::getImage($product->image),
                    'is_unlimited_stock' => false,
                    'variants'         => $product->variants->map(function ($variant) use ($overrides) {
                        $sp = $overrides[$variant->id] ?? null;
                        return [
                            'id'                    => $variant->id,
                            'seller_product_id'     => $sp ? $sp->id : null,
                            'measurement'           => $variant->secondary_unit_value ?: $variant->weight,
                            'measurement_unit_name' => $variant->unit ? $variant->unit->short_code : '',
                            'sku'                   => $variant->sku,
                            'secondary_unit_value'  => (float) ($variant->secondary_unit_value > 0 ? $variant->secondary_unit_value : 1),
                            'price'                 => $sp ? (float) $sp->selling_price : 0,
                            'mrp'                   => $sp ? (float) $sp->mrp : 0,
                            'discounted_price'      => $sp && $sp->discounted_price !== null ? (float) $sp->discounted_price : 0,
                            'stock'                 => $sp ? (float) $sp->stock : 0,
                            'status'                => $sp ? (int) $sp->status : 0,
                        ];
                    })->values(),
                ];
            });

            return response()->json([
                'status' => true,
                'data'   => $transformedProducts,
                'meta'   => [
                    'total'        => $totalProducts,
                    'current_page' => $page,
                    'last_page'    => (int) ceil($totalProducts / max($perPage, 1)),
                    'per_page'     => $perPage,
                    'from'         => $totalProducts === 0 ? 0 : (($page - 1) * $perPage) + 1,
                    'to'           => min($page * $perPage, $totalProducts),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('POS getProducts: ' . $e->getMessage());
            return CommonHelper::responseError('Something went wrong while fetching products.');
        }
    }

    public function getSellerCategories()
    {
        try {
            $seller = auth()->user()->seller;

            if (!$seller) {
                return CommonHelper::responseError('Seller profile not found');
            }

            $categoryIds = MasterProduct::query()
                ->join('master_product_variants', 'master_product_variants.master_product_id', '=', 'master_products.id')
                ->join('seller_products', function ($j) use ($seller) {
                    $j->on('seller_products.master_product_variant_id', '=', 'master_product_variants.id')
                        ->where('seller_products.seller_id', $seller->id)
                        ->where('seller_products.status', 1);
                })
                ->where('master_products.status', 1)
                ->whereNotNull('master_products.category_id')
                ->distinct()
                ->pluck('master_products.category_id');

            $categories = Category::whereIn('id', $categoryIds)
                ->where('status', 1)
                ->orderBy('name', 'ASC')
                ->get()
                ->map(function ($category) {
                    return [
                        'id'    => $category->id,
                        'name'  => $category->name,
                        'image' => CommonHelper::getImage($category->image),
                    ];
                });

            return CommonHelper::responseWithData($categories);
        } catch (\Exception $e) {
            Log::error('POS getSellerCategories: ' . $e->getMessage());
            return CommonHelper::responseError('Something went wrong while fetching categories.');
        }
    }

    public function updateOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id'                   => 'required|exists:orders,id',
            'items'                      => 'required|array',
            'items.*.product_variant_id' => 'required|exists:master_product_variants,id',
            'items.*.quantity'           => 'required|numeric|min:1',
            'items.*.custom_price'       => 'nullable|numeric|min:0',
            // 'payment_method'          => 'required|in:cash,card,upi',
            'discount_amount'            => 'nullable|numeric',
            'discount_percentage'        => 'nullable|numeric',
            'user_id'                    => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $sellerId = auth()->user()->seller->id;

        DB::beginTransaction();
        try {
            $order = DB::table('orders')->where('id', $request->order_id)->where('order_type', 'pos')->first();
            if (!$order) {
                return CommonHelper::responseError('POS order not found');
            }

            // Verify seller ownership via order_items
            $ownerCheck = DB::table('order_items')
                ->where('order_id', $request->order_id)
                ->where('seller_id', $sellerId)
                ->exists();
            if (!$ownerCheck) {
                return CommonHelper::responseError('Unauthorized access to this order');
            }

            // Pre-resolve every new line
            $resolved = [];
            foreach ($request->items as $idx => $item) {
                $r = MasterCatalogOrderHelper::resolveLine($sellerId, (int) $item['product_variant_id'], (float) $item['quantity']);
                if (!$r['ok']) {
                    DB::rollBack();
                    return CommonHelper::responseError(__($r['error']) ?: $r['error']);
                }
                $resolved[$idx] = $r;
            }

            // Snapshot existing items keyed by master_product_variant_id
            $existingItems     = DB::table('order_items')->where('order_id', $request->order_id)->get();
            $existingByVariant = [];
            foreach ($existingItems as $row) {
                $key = $row->master_product_variant_id ?: $row->product_variant_id;
                $existingByVariant[$key] = $row;
            }

            $incomingVariantIds = collect($request->items)
                ->pluck('product_variant_id')
                ->map(fn($v) => (int) $v)
                ->all();

            // Remove dropped lines and restore stock
            foreach ($existingByVariant as $variantKey => $existing) {
                if (in_array((int) $variantKey, $incomingVariantIds, true)) {
                    continue;
                }
                if ($existing->seller_product_id) {
                    MasterCatalogOrderHelper::decrementStock($existing->seller_product_id, -1 * (float) $existing->quantity);
                }
                DB::table('order_items')->where('id', $existing->id)->delete();
            }

            $now = date('Y-m-d H:i:s');

            // Upsert remaining lines and adjust stock by delta
            foreach ($request->items as $idx => $item) {
                $r        = $resolved[$idx];
                $sp       = $r['seller_product'];
                $mv       = $r['master_variant'];
                $qty      = (float) $item['quantity'];
                $price    = isset($item['custom_price']) && $item['custom_price'] > 0
                    ? (float) $item['custom_price']
                    : $r['unit_price'];
                $subtotal = $price * $qty;
                $existing = $existingByVariant[$mv->id] ?? null;

                $payload = [
                    'product_variant_id'        => 0,
                    'master_product_variant_id' => $mv->id,
                    'seller_product_id'         => $sp->id,
                    'quantity'                  => $qty,
                    'price'                     => $price,
                    'discounted_price'          => $price,
                    'sub_total'                 => $subtotal,
                    'slab_unit_price'           => $r['slab'] ? $r['slab']['price'] : null,
                    'slab_min_qty'              => $r['slab']['min_qty'] ?? null,
                    'slab_max_qty'              => $r['slab']['max_qty'] ?? null,
                    'updated_at'                => now(),
                ];

                if ($existing) {
                    $delta = $qty - (float) $existing->quantity;
                    if ($delta != 0) {
                        MasterCatalogOrderHelper::decrementStock($sp->id, $delta);
                    }
                    DB::table('order_items')->where('id', $existing->id)->update($payload);
                } else {
                    $payload['user_id']       = $request->user_id ?? null;
                    $payload['order_id']      = $request->order_id;
                    $payload['orders_id']     = $order->orders_id;
                    $payload['product_name']  = $mv->masterProduct->name ?? '';
                    $payload['variant_name']  = implode(' | ', array_filter([
                        $mv->sku ?? '',
                        $mv->secondary_unit_value
                            ? ((int) $mv->secondary_unit_value . ' ' . ($mv->secondaryUnit?->name ?? 'units') . '/box')
                            : null,
                    ]));
                    $payload['tax_amount']    = 0;
                    $payload['tax_percentage'] = 0;
                    $payload['discount']      = 0;
                    $payload['status']        = json_encode([['received', $now]]);
                    $payload['active_status'] = (string) OrderStatusList::$received;
                    $payload['seller_id']     = $sellerId;
                    $payload['created_at']    = now();
                    DB::table('order_items')->insert($payload);
                    MasterCatalogOrderHelper::decrementStock($sp->id, $qty);
                }
            }

            // Update order totals / payment / user
            $updateData = [
                'final_total'    => $request->final_total,
                'discount'       => $request->discount_amount ?? 0,
                // 'payment_method' => $request->payment_method,
                'user_id'        => $request->user_id ?? null,
                'updated_at'     => now(),
            ];

            if ($request->user_id) {
                $user = DB::table('users')->where('id', $request->user_id)->first();
                $updateData['mobile'] = $user ? ($user->mobile ?? '') : '';
            }

            DB::table('orders')->where('id', $request->order_id)->update($updateData);

            DB::commit();

            return CommonHelper::responseWithData(['order_id' => $request->order_id]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('POS updateOrder: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return CommonHelper::responseError('Something went wrong. Please try again.');
        }
    }

    public function showInvoice($id)
    {
        try {
            $order = DB::table('orders')
                ->where('id', $id)
                ->where('order_type', 'pos')
                ->first();

            if (!$order) {
                return response()->view('errors.404', [], 404);
            }

            $order_items = DB::table('order_items')
                ->select(
                    'order_items.id',
                    'order_items.product_name',
                    'order_items.variant_name',
                    'order_items.quantity',
                    'order_items.price as unit_price',
                    'order_items.sub_total as total_price',
                )
                ->where('order_items.order_id', $id)
                ->get();

            // User details
            if ($order->user_id) {
                $user = DB::table('users')->select('id', 'name', 'email', 'mobile')->where('id', $order->user_id)->first();
                if ($user) {
                    $order->user_name = $user->name;
                    $order->user_email = $user->email;
                    $order->mobile    = $user->mobile;
                }
            }
            if (empty($order->user_name)) {
                $order->user_name = 'Walk-in Customer';
            }

            // Seller/store details
            try {
                $firstItem = DB::table('order_items')->where('order_id', $id)->first();
                if ($firstItem && $firstItem->seller_id) {
                    $seller = DB::table('sellers')->where('id', $firstItem->seller_id)->first();
                    if ($seller) {
                        $order->store_name     = $seller->name;
                        $order->seller_name    = $seller->name;
                        $order->seller_email   = $seller->email ?? '';
                        $order->seller_mobile  = $seller->mobile ?? '';
                    }
                }
            } catch (\Exception $e) {
                Log::warning('POS showInvoice seller fetch: ' . $e->getMessage());
            }

            if (!view()->exists('pos_invoice')) {
                return response()->view('errors.404', ['message' => 'Invoice template not found'], 404);
            }

            $additional_charges = collect();

            return view('pos_invoice', compact('order', 'order_items', 'additional_charges'));
        } catch (\Exception $e) {
            Log::error('POS showInvoice: ' . $e->getMessage());
            return response()->view('errors.500', ['message' => 'Error generating invoice: ' . $e->getMessage()], 500);
        }
    }

    public function getSellerStoreName()
    {
        try {
            $userId = auth()->id();

            $seller = DB::table('sellers')
                ->where('admin_id', $userId)
                ->select('name as store_name')
                ->first();

            if (!$seller) {
                return CommonHelper::responseError('Seller not found for this user');
            }

            return CommonHelper::responseWithData(['store_name' => $seller->store_name]);
        } catch (\Exception $e) {
            return CommonHelper::responseError('Error fetching store name: ' . $e->getMessage());
        }
    }
}
