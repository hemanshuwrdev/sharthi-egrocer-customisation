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
            $limit = $request->input('limit', 0);

            // Get POS users
            $posUsers = DB::table('pos_users')
                ->select('id', 'name', 'phone as mobile', DB::raw("'pos' as user_type"), DB::raw("NULL as email"));

            // Apply search if provided
            if (!empty($search)) {
                $posUsers->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('phone', 'like', '%' . $search . '%');
                });
            }

            $posUsers->orderBy('id', 'DESC');

            // Get regular users
            $regUsers = DB::table('users')
                ->select('id', 'name', 'mobile', DB::raw("'user' as user_type"), 'email');

            // Apply search if provided
            if (!empty($search)) {
                $regUsers->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('mobile', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            }

            $regUsers->orderBy('id', 'DESC');

            // Combine users
            $query = $posUsers->union($regUsers);

            // Apply limit if specified
            if ($limit > 0) {
                $users = $query->limit($limit)->get();
            } else {
                $users = $query->get();
            }

            return CommonHelper::responseWithData($users);
        } catch (\Exception $e) {
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

    public function updateOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:pos_orders,id',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.product_variant_id' => 'required|exists:product_variants,id',
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

        DB::beginTransaction();
        try {
            // Get the existing order
            $order = DB::table('pos_orders')->where('id', $request->order_id)->first();

            if (!$order) {
                return response()->json([
                    'status' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            // Verify seller owns the order
            if ($order->store_id != auth()->user()->seller->id) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized access to this order'
                ], 403);
            }

            // Get existing order items
            $existingItems = DB::table('pos_order_items')
                ->where('pos_order_id', $request->order_id)
                ->get();

            // Create composite keys for existing and new items (product_id + variant_id)
            $existingItemsMap = [];
            foreach ($existingItems as $item) {
                $key = $item->product_id . '_' . $item->product_variant_id;
                $existingItemsMap[$key] = $item;
            }

            // Create a map of new items
            $newItemsMap = [];
            foreach ($request->items as $item) {
                $key = $item['product_id'] . '_' . $item['product_variant_id'];
                $newItemsMap[$key] = $item;
            }

            // Find keys to remove (in existing but not in new)
            $keysToRemove = array_diff(array_keys($existingItemsMap), array_keys($newItemsMap));

            // Step 1: Handle removed items - restore stock and delete from database
            foreach ($keysToRemove as $key) {
                $removedItem = $existingItemsMap[$key];

                // Restore stock if variant exists
                if ($removedItem->product_variant_id) {
                    $productVariant = ProductVariant::with('product')->find($removedItem->product_variant_id);

                    if ($productVariant && $productVariant->is_unlimited_stock != 1) {
                        $product = $productVariant->product;

                        if ($product) {
                            // Restore stock based on product type
                            if ($product->type == 'packet') {
                                $newStock = $productVariant->stock + $removedItem->quantity;
                                $productVariant->stock = $newStock;

                                if ($productVariant->status == 0 && $newStock > 0) {
                                    $productVariant->status = 1; // Set back to available
                                }

                                $productVariant->save();
                            } else if ($product->type == 'loose') {
                                $weightToRestore = $productVariant->measurement * $removedItem->quantity;
                                $newStock = $productVariant->stock + $weightToRestore;

                                $productVariant->stock = $newStock;

                                if ($productVariant->status == 0 && $newStock > 0) {
                                    $productVariant->status = 1; // Set back to available
                                }

                                $productVariant->save();

                                // Update other variants with same stock unit
                                ProductVariant::where("product_id", $product->id)
                                    ->where("stock_unit_id", $productVariant->stock_unit_id)
                                    ->where("id", '!=', $productVariant->id)
                                    ->update([
                                        'stock' => $newStock,
                                        'status' => $newStock <= 0 ? 0 : 1
                                    ]);
                            }
                        }
                    }
                }

                // Delete the item from the order
                $deleted = DB::table('pos_order_items')
                    ->where('id', $removedItem->id)
                    ->delete();
            }

            // Step 2: Process remaining items (update existing or add new)
            foreach ($request->items as $item) {
                $productId = $item['product_id'];
                $productVariantId = $item['product_variant_id'];
                $newQuantity = $item['quantity'];
                $compositeKey = $productId . '_' . $productVariantId;

                $productVariant = ProductVariant::with(['product'])->find($productVariantId);
                if (!$productVariant || !$productVariant->product) {
                    continue;
                }

                $product = $productVariant->product;
                $price = CommonHelper::getSlabUnitPrice($productVariant->id, (int) $newQuantity);
                $subtotal = $price * $newQuantity;

                // Find if this item (with same product AND variant) exists in the original order
                $existingItem = isset($existingItemsMap[$compositeKey]) ? $existingItemsMap[$compositeKey] : null;

                if ($existingItem) {
                    // Item exists, update it and adjust stock
                    $oldQuantity = $existingItem->quantity;
                    $quantityDiff = $oldQuantity - $newQuantity; // positive means stock to add back

                    // Update the item in database
                    DB::table('pos_order_items')
                        ->where('id', $existingItem->id)
                        ->update([
                            'product_variant_id' => $productVariantId,
                            'quantity' => $newQuantity,
                            'unit_price' => $price,
                            'total_price' => $subtotal,
                            'updated_at' => now()
                        ]);

                    // Adjust stock if quantity changed and not unlimited
                    if ($quantityDiff != 0 && $productVariant->is_unlimited_stock != 1) {
                        if ($product->type == 'packet') {
                            // Add stock back or remove more stock
                            $newStock = $productVariant->stock + $quantityDiff;
                            $productVariant->stock = max(0, $newStock);

                            // Update status based on stock
                            if ($newStock <= 0) {
                                $productVariant->status = 0; // Sold out
                            } else if ($productVariant->status == 0 && $newStock > 0) {
                                $productVariant->status = 1; // Available
                            }

                            $productVariant->save();
                        } else if ($product->type == 'loose') {
                            // For loose products, adjust by weight
                            $weightAdjustment = $productVariant->measurement * $quantityDiff;
                            $newStock = $productVariant->stock + $weightAdjustment;
                            $productVariant->stock = max(0, $newStock);

                            // Update status based on stock
                            if ($newStock <= 0) {
                                $productVariant->status = 0; // Sold out
                            } else if ($productVariant->status == 0 && $newStock > 0) {
                                $productVariant->status = 1; // Available
                            }

                            $productVariant->save();

                            // Update other variants with same stock unit
                            ProductVariant::where("product_id", $product->id)
                                ->where("stock_unit_id", $productVariant->stock_unit_id)
                                ->where("id", '!=', $productVariant->id)
                                ->update([
                                    'stock' => max(0, $newStock),
                                    'status' => $newStock <= 0 ? 0 : 1
                                ]);
                        }
                    }
                } else {
                    // Add new item to order
                    DB::table('pos_order_items')->insert([
                        'pos_order_id' => $request->order_id,
                        'product_id' => $productId,
                        'product_variant_id' => $productVariantId,
                        'quantity' => $newQuantity,
                        'unit_price' => $price,
                        'total_price' => $subtotal,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);

                    // Reduce stock for new item (if not unlimited)
                    if ($productVariant->is_unlimited_stock != 1) {
                        if ($product->type == 'packet') {
                            // For packet products, decrease stock by quantity
                            $newStock = max(0, $productVariant->stock - $newQuantity);
                            $productVariant->stock = $newStock;

                            if ($newStock <= 0) {
                                $productVariant->status = 0; // Sold out
                            }

                            $productVariant->save();
                        } else if ($product->type == 'loose') {
                            // For loose products, decrease stock by weight
                            $weightToReduce = $productVariant->measurement * $newQuantity;
                            $newStock = max(0, $productVariant->stock - $weightToReduce);

                            $productVariant->stock = $newStock;
                            if ($newStock <= 0) {
                                $productVariant->status = 0; // Sold out
                            }

                            $productVariant->save();

                            // Update other variants with same stock unit
                            ProductVariant::where("product_id", $product->id)
                                ->where("stock_unit_id", $productVariant->stock_unit_id)
                                ->where("id", '!=', $productVariant->id)
                                ->update([
                                    'stock' => $newStock,
                                    'status' => $newStock <= 0 ? 0 : 1
                                ]);
                        }
                    }
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
