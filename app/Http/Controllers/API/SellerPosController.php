<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Helpers\MasterCatalogOrderHelper;
use App\Http\Controllers\Controller;
use App\Models\BrandDistributorMapping;
use App\Models\Category;
use App\Models\MasterProduct;
use App\Models\MasterProductVariant;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\SellerProduct;
use App\Models\SellerProductSlabPrice;
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

            // All app users (retailers), enriched with shop_name if they have a profile
            $retailers = DB::table('users')
                ->leftJoin('retailer_profiles', 'users.id', '=', 'retailer_profiles.user_id')
                ->select(
                    'users.id',
                    'users.name',
                    'users.mobile',
                    DB::raw("'retailer' as user_type"),
                    'users.email',
                    'retailer_profiles.shop_name'
                );

            if (!empty($search)) {
                $retailers->where(function ($q) use ($search) {
                    $q->where('users.name', 'like', '%' . $search . '%')
                      ->orWhere('users.mobile', 'like', '%' . $search . '%')
                      ->orWhere('retailer_profiles.shop_name', 'like', '%' . $search . '%');
                });
            }

            // POS walk-in users (added directly from POS)
            $posUsers = DB::table('pos_users')
                ->select('id', 'name', 'phone as mobile', DB::raw("'pos' as user_type"), DB::raw("NULL as email"), DB::raw("NULL as shop_name"));

            if (!empty($search)) {
                $posUsers->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('phone', 'like', '%' . $search . '%');
                });
            }

            $users = $retailers->union($posUsers)
                ->orderByDesc('id')
                ->limit($limit > 0 ? $limit : 20)
                ->get();

            return CommonHelper::responseWithData($users);
        } catch (\Exception $e) {
            Log::error('POS getUsersList: ' . $e->getMessage());
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function registerUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'mobile' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if user with the same mobile already exists
            if (!empty($request->mobile)) {
                $existingUser = DB::table('pos_users')->where('phone', $request->mobile)->first();
                if ($existingUser) {
                    return response()->json([
                        'status' => false,
                        'message' => 'User with this phone number already exists'
                    ], 422);
                }
            }

            // Create new user in pos_users table
            $userId = DB::table('pos_users')->insertGetId([
                'name' => $request->name,
                'phone' => $request->mobile ?? null,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $user = DB::table('pos_users')->find($userId);

            return response()->json([
                'status' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'mobile' => $user->phone
                ]
            ]);
        } catch (\Exception $e) {
            Log::error("Error registering user: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong. Please try again.'
            ], 500);
        }
    }

    public function placeOrder(Request $request)
    {
        // Sarthi: POS items.*.product_variant_id now references master_product_variants.id.
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable',
            'user_type' => 'nullable|in:pos,user',
            'items' => 'required|array|min:1',
            'items.*.product_variant_id' => 'required|exists:master_product_variants,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'payment_method' => 'required|in:cash,card,upi',
            'total' => 'required|numeric',
            'final_total' => 'required|numeric',
            'discount_amount' => 'nullable|numeric',
            'discount_percentage' => 'nullable|numeric',
            'additional_charges' => 'nullable|array',
            'additional_charges.*.charge_name' => 'required_with:additional_charges',
            'additional_charges.*.amount' => 'required_with:additional_charges|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sellerId = auth()->user()->seller->id;

        DB::beginTransaction();
        try {
            // Get user info if provided
            if ($request->user_id && $request->user_type) {
                if ($request->user_type === 'pos') {
                    DB::table('pos_users')->find($request->user_id);
                } else {
                    DB::table('users')->find($request->user_id);
                }
            }

            // Pre-validate every line. resolveLine enforces (assigned, activated, in-stock).
            // product_variant_id refers to master_product_variants.id in the master catalog flow.
            $resolved = [];
            foreach ($request->items as $idx => $item) {
                $r = MasterCatalogOrderHelper::resolveLine($sellerId, (int) $item['product_variant_id'], (float) $item['quantity']);
                if (!$r['ok']) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'message' => __($r['error']) ?: $r['error'],
                    ], 422);
                }
                $resolved[$idx] = $r;
            }

            // Create order data array
            $orderData = [
                'pos_user_id' => ($request->user_type === 'pos') ? $request->user_id : null,
                'user_id' => ($request->user_type === 'user') ? $request->user_id : null,
                'store_id' => $sellerId,
                'total_amount' => $request->final_total,
                'discount_amount' => $request->discount_amount ?? 0,
                'discount_percentage' => $request->discount_percentage ?? 0,
                'payment_method' => $request->payment_method,
                'created_at' => now(),
                'updated_at' => now()
            ];

            $orders_id = 'POS' . date('YmdHis') . rand(10, 99);
            $posOrderId = DB::table('pos_orders')->insertGetId($orderData);

            if (!empty($request->additional_charges)) {
                foreach ($request->additional_charges as $charge) {
                    DB::table('pos_additional_charges')->insert([
                        'pos_order_id' => $posOrderId,
                        'charge_name' => $charge['charge_name'],
                        'amount' => $charge['amount'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }

            foreach ($request->items as $idx => $item) {
                $r = $resolved[$idx];
                $sp = $r['seller_product'];
                $mv = $r['master_variant'];
                $qty = (float) $item['quantity'];
                $price = $r['unit_price'];
                $subtotal = $price * $qty;

                DB::table('pos_order_items')->insert([
                    'pos_order_id' => $posOrderId,
                    'product_id' => $mv->master_product_id,
                    'product_variant_id' => $mv->id,
                    'master_product_variant_id' => $mv->id,
                    'seller_product_id' => $sp->id,
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'total_price' => $subtotal,
                    'slab_unit_price' => $r['slab'] ? $r['slab']['price'] : null,
                    'slab_min_qty' => $r['slab']['min_qty'] ?? null,
                    'slab_max_qty' => $r['slab']['max_qty'] ?? null,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                MasterCatalogOrderHelper::decrementStock($sp->id, $qty);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Order placed successfully',
                'data' => [
                    'pos_order_id' => $posOrderId,
                    'order_number' => $orders_id,
                    'status' => 'completed'
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error placing order: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProducts(Request $request)
    {
        try {
            $sellerId = auth()->user()->seller->id;
            $perPage = (int) ($request->per_page ?? 9);
            $page = max((int) ($request->page ?? 1), 1);

            // Sarthi: POS reads from master catalog filtered by this seller's activated overrides.
            // Group by master_product so the POS card still shows one product with N variants beneath.
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

            $masterIds = $masterIdsQuery->distinct()->pluck('master_products.id');
            $totalProducts = $masterIds->count();
            $pagedIds = $masterIds->slice(($page - 1) * $perPage, $perPage)->values();

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
            $overrides = SellerProduct::where('seller_id', $sellerId)
                ->whereIn('master_product_variant_id', $variantIds)
                ->get()
                ->keyBy('master_product_variant_id');

            $transformedProducts = $products->map(function ($product) use ($overrides) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'image_url' => CommonHelper::getImage($product->image),
                    'is_unlimited_stock' => false,
                    'variants' => $product->variants->map(function ($variant) use ($overrides) {
                        $sp = $overrides[$variant->id] ?? null;
                        return [
                            'id' => $variant->id,
                            'seller_product_id' => $sp ? $sp->id : null,
                            'measurement' => $variant->secondary_unit_value ?: $variant->weight,
                            'measurement_unit_name' => $variant->unit ? $variant->unit->short_code : '',
                            'sku' => $variant->sku,
                            'secondary_unit_value' => (float) ($variant->secondary_unit_value > 0 ? $variant->secondary_unit_value : 1),
                            'price' => $sp ? (float) $sp->selling_price : 0,
                            'mrp' => $sp ? (float) $sp->mrp : 0,
                            'discounted_price' => $sp && $sp->discounted_price !== null ? (float) $sp->discounted_price : 0,
                            'stock' => $sp ? (float) $sp->stock : 0,
                            'status' => $sp ? (int) $sp->status : 0,
                        ];
                    })->values(),
                ];
            });

            return response()->json([
                'status' => true,
                'data' => $transformedProducts,
                'meta' => [
                    'total' => $totalProducts,
                    'current_page' => $page,
                    'last_page' => (int) ceil($totalProducts / max($perPage, 1)),
                    'per_page' => $perPage,
                    'from' => $totalProducts === 0 ? 0 : (($page - 1) * $perPage) + 1,
                    'to' => min($page * $perPage, $totalProducts),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching products: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while fetching products.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getSellerCategories()
    {
        try {
            $seller = auth()->user()->seller;

            if (!$seller) {
                return response()->json([
                    'status' => false,
                    'message' => 'Seller profile not found'
                ], 404);
            }

            // Sarthi: categories derived from this seller's activated master catalog rows.
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
                        'id' => $category->id,
                        'name' => $category->name,
                        'image' => CommonHelper::getImage($category->image)
                    ];
                });

            return response()->json([
                'status' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching categories: " . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while fetching categories.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sarthi: edit an existing POS order on the master catalog.
     * items[].product_variant_id refers to master_product_variants.id (same as placeOrder).
     * Stock deltas are applied on seller_products via MasterCatalogOrderHelper.
     */
    public function updateOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:pos_orders,id',
            'items' => 'required|array',
            'items.*.product_variant_id' => 'required|exists:master_product_variants,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'payment_method' => 'required|in:cash,card,upi',
            'discount_amount' => 'nullable|numeric',
            'discount_percentage' => 'nullable|numeric',
            'additional_charges' => 'nullable|array',
            'additional_charges.*.charge_name' => 'required_with:additional_charges',
            'additional_charges.*.amount' => 'required_with:additional_charges|numeric',
            'user_id' => 'nullable',
            'user_type' => 'nullable|in:pos,user',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $sellerId = auth()->user()->seller->id;

        DB::beginTransaction();
        try {
            $order = DB::table('pos_orders')->where('id', $request->order_id)->first();
            if (!$order) {
                return response()->json(['status' => false, 'message' => 'Order not found'], 404);
            }
            if ($order->store_id != $sellerId) {
                return response()->json(['status' => false, 'message' => 'Unauthorized access to this order'], 403);
            }

            // Pre-resolve every new line so we fail before we touch anything.
            $resolved = [];
            foreach ($request->items as $idx => $item) {
                $r = MasterCatalogOrderHelper::resolveLine(
                    $sellerId,
                    (int) $item['product_variant_id'],
                    (float) $item['quantity']
                );
                if (!$r['ok']) {
                    DB::rollBack();
                    return response()->json([
                        'status' => false,
                        'message' => __($r['error']) ?: $r['error'],
                    ], 422);
                }
                $resolved[$idx] = $r;
            }

            // Snapshot existing items keyed by master_product_variant_id so we can diff.
            $existingItems = DB::table('pos_order_items')
                ->where('pos_order_id', $request->order_id)
                ->get();

            $existingByVariant = [];
            foreach ($existingItems as $row) {
                $key = $row->master_product_variant_id ?: $row->product_variant_id;
                $existingByVariant[$key] = $row;
            }

            $incomingVariantIds = collect($request->items)
                ->pluck('product_variant_id')
                ->map(fn($v) => (int) $v)
                ->all();

            // Step 1: remove dropped lines and restore stock to seller_products.
            foreach ($existingByVariant as $variantKey => $existing) {
                if (in_array((int) $variantKey, $incomingVariantIds, true)) {
                    continue;
                }
                if ($existing->seller_product_id) {
                    MasterCatalogOrderHelper::decrementStock(
                        $existing->seller_product_id,
                        -1 * (float) $existing->quantity
                    );
                }
                DB::table('pos_order_items')->where('id', $existing->id)->delete();
            }

            // Step 2: upsert remaining lines and adjust stock by delta.
            foreach ($request->items as $idx => $item) {
                $r = $resolved[$idx];
                $sp = $r['seller_product'];
                $mv = $r['master_variant'];
                $qty = (float) $item['quantity'];
                $price = $r['unit_price'];
                $subtotal = $price * $qty;
                $existing = $existingByVariant[$mv->id] ?? null;

                $payload = [
                    'product_id' => $mv->master_product_id,
                    'product_variant_id' => $mv->id,
                    'master_product_variant_id' => $mv->id,
                    'seller_product_id' => $sp->id,
                    'quantity' => $qty,
                    'unit_price' => $price,
                    'total_price' => $subtotal,
                    'slab_unit_price' => $r['slab'] ? $r['slab']['price'] : null,
                    'slab_min_qty' => $r['slab']['min_qty'] ?? null,
                    'slab_max_qty' => $r['slab']['max_qty'] ?? null,
                    'updated_at' => now(),
                ];

                if ($existing) {
                    $delta = $qty - (float) $existing->quantity;
                    if ($delta != 0) {
                        MasterCatalogOrderHelper::decrementStock($sp->id, $delta);
                    }
                    DB::table('pos_order_items')->where('id', $existing->id)->update($payload);
                } else {
                    $payload['pos_order_id'] = $request->order_id;
                    $payload['created_at'] = now();
                    DB::table('pos_order_items')->insert($payload);
                    MasterCatalogOrderHelper::decrementStock($sp->id, $qty);
                }
            }

            // Update order data (discount, payment method, user, etc.)
            $updateData = [
                'total_amount' => $request->final_total,
                'discount_amount' => $request->discount_amount ?? 0,
                'discount_percentage' => $request->discount_percentage ?? 0,
                'payment_method' => $request->payment_method,
                'updated_at' => now()
            ];

            // Update user information if provided
            if ($request->has('user_id') && $request->has('user_type')) {
                if ($request->user_type === 'pos') {
                    $updateData['pos_user_id'] = $request->user_id;
                    $updateData['user_id'] = null;
                } else {
                    $updateData['user_id'] = $request->user_id;
                    $updateData['pos_user_id'] = null;
                }
            } else if ($request->has('user_id') === false && $request->has('user_type') === false) {
                // If no user is selected (cash sale), clear both user fields
                $updateData['user_id'] = null;
                $updateData['pos_user_id'] = null;
            }

            DB::table('pos_orders')
                ->where('id', $request->order_id)
                ->update($updateData);

            // Update additional charges
            DB::table('pos_additional_charges')
                ->where('pos_order_id', $request->order_id)
                ->delete();

            if (!empty($request->additional_charges)) {
                foreach ($request->additional_charges as $charge) {
                    DB::table('pos_additional_charges')->insert([
                        'pos_order_id' => $request->order_id,
                        'charge_name' => $charge['charge_name'],
                        'amount' => $charge['amount'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Order updated successfully',
                'data' => [
                    'pos_order_id' => $request->order_id
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Error updating order: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showInvoice($id)
    {
        try {

            // Get the order
            $order = DB::table('pos_orders')
                ->select('pos_orders.*')
                ->where('pos_orders.id', $id)
                ->first();

            if (!$order) {
                Log::error("POS Order not found for ID: " . $id);
                return response()->view('errors.404', [], 404);
            }

            // Get order items
            $order_items = DB::table('pos_order_items')
                ->select(
                    'pos_order_items.*',
                    'products.name as product_name'
                )
                ->leftJoin('products', 'pos_order_items.product_id', '=', 'products.id')
                ->where('pos_order_items.pos_order_id', $id)
                ->get();

            // Add variant names to order items
            foreach ($order_items as $item) {
                $variant = ProductVariant::find($item->product_variant_id);
                if ($variant) {
                    $item->variant_name = $variant->measurement . " " .
                        (($variant->unit) ? $variant->unit->short_code : "");
                } else {
                    $item->variant_name = '';
                }
            }

            // Get user details
            if ($order->user_id) {
                $user = DB::table('users')->select('id', 'name', 'email', 'mobile')->where('id', $order->user_id)->first();
                if ($user) {
                    $order->user_name = $user->name;
                    $order->user_email = $user->email;
                    $order->mobile = $user->mobile;
                }
            } elseif ($order->pos_user_id) {
                $posUser = DB::table('pos_users')->select('id', 'name', 'phone')->where('id', $order->pos_user_id)->first();
                if ($posUser) {
                    $order->user_name = $posUser->name;
                    $order->mobile = $posUser->phone;
                }
            } else {
                // If no user or POS user is associated, set as Cash Sale
                $order->user_name = "Cash Sale";
            }

            // Get seller details - using direct DB query to avoid relationship issues
            try {
                $seller = DB::table('sellers')->where('id', $order->store_id)->first();
                if ($seller) {
                    $order->store_name = $seller->name;
                    $order->seller_name = $seller->name;
                    $order->seller_email = $seller->email;
                    $order->seller_mobile = $seller->mobile;
                }
            } catch (\Exception $e) {
                Log::warning("Error getting seller details: " . $e->getMessage());
                // Continue without seller details
            }

            // Get additional charges
            $additional_charges = DB::table('pos_additional_charges')
                ->where('pos_order_id', $id)
                ->get();

            // Check if view exists
            if (!view()->exists('pos_invoice')) {
                return response()->view('errors.404', ['message' => 'Invoice template not found'], 404);
            }


            return view('pos_invoice', compact('order', 'order_items', 'additional_charges'));
        } catch (\Exception $e) {
            Log::error("Error showing POS invoice: " . $e->getMessage());
            return response()->view('errors.500', ['message' => 'Error generating invoice: ' . $e->getMessage()], 500);
        }
    }

    public function getSellerStoreName()
    {
        try {
            $userId = auth()->id();

            // Find the seller where admin_id matches the authenticated user's ID
            $seller = DB::table('sellers')
                ->where('admin_id', $userId)
                ->select('name as store_name')
                ->first();

            if (!$seller) {
                return response()->json([
                    'status' => false,
                    'message' => 'Seller not found for this user'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => [
                    'store_name' => $seller->store_name
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching store name: ' . $e->getMessage()
            ], 500);
        }
    }
}
