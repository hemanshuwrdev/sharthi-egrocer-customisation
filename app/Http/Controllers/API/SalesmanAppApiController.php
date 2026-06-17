<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Helpers\MasterCatalogOrderHelper;
use App\Http\Controllers\Controller;
use App\Models\AdminToken;
use App\Models\BrandDistributorMapping;
use App\Models\Cart;
use App\Models\MasterProductVariant;
use App\Models\Order;
use App\Models\SellerProductSlabPrice;
use App\Models\OrderStatusList;
use App\Models\RetailerProfile;
use App\Models\Salesman;
use App\Models\Seller;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserToken;
use App\Services\SchemeEngine;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

/**
 * Sarthi: salesman-side retailer verification.
 * Slim controller — only the two endpoints needed to prove the verification loop end-to-end.
 */
class SalesmanAppApiController extends Controller
{
    /**
     * Resolve the Salesman row for the currently logged-in Admin.
     * Returns null if the auth user isn't wired to a salesman record.
     */
    private function currentSalesman(): ?Salesman
    {
        $admin = auth()->user();
        if (!$admin) return null;
        return Salesman::where('admin_id', $admin->id)->first();
    }

    /**
     * City IDs the salesman's distributor ships to.
     * Drives territory scoping for both endpoints.
     */
    private function territoryCityIds(int $sellerId): array
    {
        return BrandDistributorMapping::where('seller_id', $sellerId)
            ->pluck('city_id')
            ->unique()
            ->values()
            ->all();
    }

    /**
     * GET /api/salesman/retailers/pending
     *
     * Returns retailers that:
     *   - registered in cities the salesman's distributor covers
     *   - are still verification_status = 'pending'
     *   - have not yet been claimed (salesman_id IS NULL)
     *
     * Once another salesman claims a retailer, it disappears from this list for everyone else.
     */
    public function pendingRetailers(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $cityIds = $this->territoryCityIds((int) $salesman->seller_id);
        if (empty($cityIds)) {
            return CommonHelper::responseWithData(['data' => [], 'total' => 0]);
        }

        $rows = User::query()
            ->select(
                'users.id as user_id',
                'users.name',
                'users.mobile',
                'users.country_code',
                'users.created_at as registered_at',
                'retailer_profiles.shop_name',
                'retailer_profiles.party_name',
                'retailer_profiles.gst_no',
                'retailer_profiles.address',
                'retailer_profiles.city_id',
                'retailer_profiles.gps_lat',
                'retailer_profiles.gps_lng',
                'cities.name as city_name'
            )
            ->join('retailer_profiles', 'retailer_profiles.user_id', '=', 'users.id')
            ->leftJoin('cities', 'cities.id', '=', 'retailer_profiles.city_id')
            ->where('users.verification_status', 'pending')
            ->whereNull('users.salesman_id')
            ->whereIn('retailer_profiles.city_id', $cityIds)
            ->orderByDesc('users.created_at')
            ->get();

        return CommonHelper::responseWithData([
            'total' => $rows->count(),
            'data'  => $rows,
        ]);
    }

    /**
     * POST /api/salesman/retailers/verify
     *
     * Atomic first-claim. The first salesman whose UPDATE matches the unclaimed pending
     * row wins; everyone else gets `already_verified_by_another_salesman`.
     *
     * Body (required): retailer_id, verified_lat, verified_lng, storefront_photo
     * Body (optional): verification_notes
     *
     * storefront_photo accepts either:
     *   - an uploaded file (multipart) → stored in storage/app/public/retailer_verifications/
     *   - a pre-uploaded path string (for clients that upload via a separate media endpoint)
     */
    public function verifyRetailer(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $validator = Validator::make($request->all(), [
            'retailer_id'        => 'required|integer|exists:users,id',
            'verified_lat'       => 'required|numeric|between:-90,90',
            'verified_lng'       => 'required|numeric|between:-180,180',
            'storefront_photo'   => 'required',
            'verification_notes' => 'nullable|string|max:1000',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Territory check — refuse early if retailer isn't in this salesman's distributor's cities.
        $cityIds = $this->territoryCityIds((int) $salesman->seller_id);
        if (empty($cityIds)) {
            return CommonHelper::responseError('not_in_your_territory');
        }
        $profile = RetailerProfile::where('user_id', $request->retailer_id)->first();
        if (!$profile || !in_array((int) $profile->city_id, array_map('intval', $cityIds), true)) {
            return CommonHelper::responseError('not_in_your_territory');
        }

        // Handle photo: multipart upload OR pre-uploaded path.
        $photoPath = null;
        if ($request->hasFile('storefront_photo')) {
            $file = $request->file('storefront_photo');
            $fileName = time() . '_' . $request->retailer_id . '.' . $file->getClientOriginalExtension();
            $photoPath = Storage::disk('public')->putFileAs('retailer_verifications', $file, $fileName);
        } else {
            $photoPath = (string) $request->storefront_photo;
        }

        DB::beginTransaction();
        try {
            // The ATOMIC claim. Only the first salesman whose WHERE-clause still matches succeeds.
            // Sarthi flow: salesman verification IS the activation — no distributor approval step.
            $claimed = User::where('id', $request->retailer_id)
                ->where('verification_status', 'pending')
                ->whereNull('salesman_id')
                ->update([
                    'verification_status' => 'active',
                    'salesman_id'         => $salesman->id,
                ]);

            if ($claimed === 0) {
                DB::rollBack();
                return CommonHelper::responseError('already_verified_by_another_salesman');
            }

            $profile->verified_lat            = $request->verified_lat;
            $profile->verified_lng            = $request->verified_lng;
            $profile->storefront_photo        = $photoPath;
            $profile->verification_notes      = $request->verification_notes;
            $profile->verified_at             = Carbon::now();
            $profile->verified_by_salesman_id = $salesman->id;
            $profile->save();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('verifyRetailer failed: ' . $e->getMessage());
            return CommonHelper::responseError('something_went_wrong');
        }

        // Best-effort: push to retailer that their account is now active. Never fail the response.
        try {
            $retailer = User::find($request->retailer_id);
            if ($retailer) {
                $tokens = UserToken::where('user_id', $retailer->id)
                    ->where('type', 'customer')
                    ->get();
                if (!$tokens->isEmpty()) {
                    CommonHelper::sendNotificationByTemplate(
                        $tokens,
                        'retailer_verified_customer',
                        [
                            'shop_name'     => $profile->shop_name ?? '',
                            'salesman_name' => $salesman->name ?? '',
                        ],
                        'retailer_activated',
                        0,
                        '',
                        null,
                        null,
                        'retailer',
                        $retailer->id
                    );
                }
            }
        } catch (\Throwable $e) {
            Log::error('verifyRetailer retailer push failed: ' . $e->getMessage());
        }

        return CommonHelper::responseWithData([
            'message'             => __('retailer_verified_successfully'),
            'retailer_id'         => (int) $request->retailer_id,
            'verification_status' => 'active',
            'storefront_photo'    => $photoPath,
            'next_step'           => 'ready_to_order',
        ]);
    }

    /**
     * GET /api/salesman/retailers/my
     * "My Retailers" — every retailer this salesman owns (claimed via verify).
     * Returns shop info + status + last_order_at to feed the doc's Active/Pending/Inactive badges.
     */
    public function myRetailers(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $rows = User::query()
            ->select(
                'users.id as user_id',
                'users.name',
                'users.mobile',
                'users.country_code',
                'users.verification_status',
                'users.status',
                'users.created_at as registered_at',
                'retailer_profiles.shop_name',
                'retailer_profiles.party_name',
                'retailer_profiles.address',
                'retailer_profiles.gst_no',
                'retailer_profiles.verified_at',
                'cities.name as city_name',
                DB::raw('(SELECT MAX(orders.created_at) FROM orders WHERE orders.user_id = users.id) as last_order_at')
            )
            ->leftJoin('retailer_profiles', 'retailer_profiles.user_id', '=', 'users.id')
            ->leftJoin('cities', 'cities.id', '=', 'retailer_profiles.city_id')
            ->where('users.salesman_id', $salesman->id)
            ->orderByDesc('users.id')
            ->get();

        return CommonHelper::responseWithData([
            'total' => $rows->count(),
            'data'  => $rows,
        ]);
    }

    /**
     * GET /api/salesman/retailers/{id}
     * Retailer detail screen. STRICT owner check — salesman can only view retailers they own.
     */
    public function retailerDetail(Request $request, $id)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $retailer = User::with('retailerProfile')->find($id);
        if (!$retailer || !$retailer->retailerProfile) {
            return CommonHelper::responseError('retailer_not_found');
        }

        // Strict ownership: only the owning salesman can view detail.
        if ((int) $retailer->salesman_id !== (int) $salesman->id) {
            return CommonHelper::responseError('retailer_not_owned_by_you');
        }

        $recentOrders = Order::where('user_id', $retailer->id)
            ->orderByDesc('id')
            ->limit(5)
            ->get(['id', 'total', 'final_total', 'active_status', 'payment_method', 'created_at']);

        return CommonHelper::responseWithData([
            'user'          => $retailer,
            'profile'       => $retailer->retailerProfile,
            'recent_orders' => $recentOrders,
        ]);
    }

    /**
     * POST /api/salesman/retailers/scan
     * QR resolver. Retailer's app encodes `user_id` in their QR. Salesman scans → opens detail.
     * Returns the same payload shape as retailerDetail() so the app can navigate identically.
     *
     * Body: qr_code (string — the raw user_id encoded in the retailer's QR)
     */
    public function scanRetailer(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $validator = Validator::make($request->all(), [
            'qr_code' => 'required',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $retailerId = (int) trim((string) $request->qr_code);
        if ($retailerId <= 0) {
            return CommonHelper::responseError('invalid_qr_code');
        }

        $retailer = User::with('retailerProfile')->find($retailerId);
        if (!$retailer || !$retailer->retailerProfile) {
            return CommonHelper::responseError('retailer_not_found');
        }

        if ((int) $retailer->salesman_id !== (int) $salesman->id) {
            return CommonHelper::responseError('retailer_not_owned_by_you');
        }

        $recentOrders = Order::where('user_id', $retailer->id)
            ->orderByDesc('id')
            ->limit(5)
            ->get(['id', 'total', 'final_total', 'active_status', 'payment_method', 'created_at']);

        return CommonHelper::responseWithData([
            'user'          => $retailer,
            'profile'       => $retailer->retailerProfile,
            'recent_orders' => $recentOrders,
        ]);
    }

    /**
     * GET /api/salesman/retailers/overview
     *
     * Returns two flat lists for the distributor's territory:
     *   verified — retailers THIS salesman owns (salesman_id = me)
     *   pending  — unclaimed retailers in the distributor's cities (salesman_id IS NULL, status = pending)
     *
     * Optional query param: search (name / shop_name / mobile substring)
     */
    public function retailersOverview(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $cityIds = $this->territoryCityIds((int) $salesman->seller_id);
        if (empty($cityIds)) {
            return CommonHelper::responseWithData(['verified' => [], 'pending' => []]);
        }

        $search = trim((string) $request->input('search', ''));

        $query = User::query()
            ->select(
                'users.id as user_id',
                'users.name',
                'users.mobile',
                'users.country_code',
                'users.verification_status',
                'users.status',
                'users.created_at as registered_at',
                'retailer_profiles.shop_name',
                'retailer_profiles.party_name',
                'retailer_profiles.address',
                'retailer_profiles.gst_no',
                'retailer_profiles.city_id',
                'retailer_profiles.gps_lat',
                'retailer_profiles.gps_lng',
                'retailer_profiles.verified_at',
                'cities.name as city_name',
                'cities.zone as zone'
            )
            ->join('retailer_profiles', 'retailer_profiles.user_id', '=', 'users.id')
            ->leftJoin('cities', 'cities.id', '=', 'retailer_profiles.city_id')
            ->whereIn('retailer_profiles.city_id', $cityIds)
            ->where(function ($q) use ($salesman) {
                // my verified retailers OR unclaimed pending retailers in territory
                $q->where('users.salesman_id', $salesman->id)
                  ->orWhere(function ($sub) {
                      $sub->whereNull('users.salesman_id')
                          ->where('users.verification_status', 'pending');
                  });
            });

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('retailer_profiles.shop_name', 'like', "%{$search}%")
                  ->orWhere('users.mobile', 'like', "%{$search}%");
            });
        }

        $rows = $query->orderByDesc('users.id')->get();

        return CommonHelper::responseWithData([
            'total' => $rows->count(),
            'data'  => $rows,
        ]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    //  Phase C — Salesman assisted-order endpoints (cart + place)
    //  Strict ownership: salesman can only operate on retailers where users.salesman_id = me.
    //  Cart rows are tagged with placed_by_salesman_id = me so they don't leak into the
    //  retailer's own cart view (retailer-side filters out salesman drafts).
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Strict ownership: the retailer must be claimed by this salesman AND active.
     * Returns the User row on success; null if not allowed (caller responds with an error).
     */
    private function ensureOwnedActiveRetailer(Salesman $salesman, $retailerId): ?User
    {
        $retailer = User::find($retailerId);
        if (!$retailer) return null;
        if ((int) $retailer->salesman_id !== (int) $salesman->id) return null;
        if ($retailer->verification_status !== 'active') return null;
        return $retailer;
    }

    /**
     * GET /api/salesman/products
     * Query: filter, brand_id, category_id, parent_company_id, page, per_page
     *
     * Returns the logged-in salesman's distributor catalog so he can pick
     * variants to add to a retailer's cart.  seller_id is resolved from the
     * salesman's own record — no need for lat/lng.
     */
    public function listProducts(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $sellerId = (int) $salesman->seller_id;
        $limit    = (int) $request->input('per_page', 25);
        $page     = max((int) $request->input('page', 1), 1);
        $offset   = ($page - 1) * $limit;
        $filter   = trim((string) $request->input('filter', ''));

        $query = MasterProductVariant::query()
            ->with(['masterProduct.brand', 'masterProduct.parentCompany', 'masterProduct.category', 'unit', 'secondaryUnit'])
            ->join('master_products', 'master_product_variants.master_product_id', '=', 'master_products.id')
            ->join('seller_products', function ($j) use ($sellerId) {
                $j->on('seller_products.master_product_variant_id', '=', 'master_product_variants.id')
                  ->where('seller_products.seller_id', '=', $sellerId);
            })
            ->where('master_products.status', 1)
            ->where('master_product_variants.status', 1)
            ->where('seller_products.status', 1)
            ->where('seller_products.selling_price', '>', 0)
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
        if ($request->filled('brand_id')) {
            $query->where('master_products.brand_id', (int) $request->brand_id);
        }
        if ($request->filled('category_id')) {
            $query->where('master_products.category_id', (int) $request->category_id);
        }
        if ($request->filled('parent_company_id')) {
            $query->where('master_products.parent_company_id', (int) $request->parent_company_id);
        }

        $rows = $query->orderBy('master_products.name')
            ->orderBy('master_product_variants.id')
            ->get();

        $slabsBySp = SellerProductSlabPrice::whereIn('seller_product_id', $rows->pluck('sp_id')->unique())
            ->orderBy('min_qty')
            ->get()
            ->groupBy('seller_product_id');

        $items = $rows->map(function ($r) use ($sellerId, $slabsBySp) {
            $mp = $r->masterProduct;
            $slabs = isset($slabsBySp[$r->sp_id])
                ? $slabsBySp[$r->sp_id]->map(fn($s) => [
                    'id'      => $s->id,
                    'min_qty' => $s->min_qty,
                    'max_qty' => $s->max_qty,
                    'price'   => (float) $s->price,
                ])->values()
                : [];

            $offer = [
                'seller_id'         => $sellerId,
                'seller_product_id' => $r->sp_id,
                'mrp'               => (float) $r->sp_mrp,
                'selling_price'     => (float) $r->sp_selling_price,
                'discounted_price'  => $r->sp_discounted_price !== null ? (float) $r->sp_discounted_price : null,
                'stock'             => (float) $r->sp_stock,
                'slab_prices'       => $slabs,
            ];

            return [
                'product_variant_id'   => $r->id,
                'product_id'           => $r->master_product_id,
                'master_product_name'  => $mp ? $mp->name : null,
                'brand'                => $mp && $mp->brand ? $mp->brand->name : null,
                'brand_id'             => $mp ? $mp->brand_id : null,
                'parent_company'       => $mp && $mp->parentCompany ? $mp->parentCompany->name : null,
                'category'             => $mp && $mp->category ? $mp->category->name : null,
                'category_id'          => $mp ? $mp->category_id : null,
                'sku'                  => $r->sku,
                'unit'                 => $r->unit ? $r->unit->name : null,
                'secondary_unit'       => $r->secondaryUnit ? $r->secondaryUnit->name : null,
                'secondary_unit_value' => $r->secondary_unit_value,
                'weight'               => $r->weight,
                'image'                => $r->image ?: ($mp ? $mp->image : null),
                'offer'                => $offer,
            ];
        })->values();

        $total = $items->count();
        $paged = $items->slice($offset, $limit)->values();

        return CommonHelper::responseWithData($paged, $total);
    }

    /**
     * POST /api/salesman/cart/add
     * Body: retailer_id, product_variant_id, qty, seller_id
     */
    public function addCartItem(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $validator = Validator::make($request->all(), [
            'retailer_id'        => 'required|integer|exists:users,id',
            'product_variant_id' => 'required|exists:master_product_variants,id',
            'qty'                => 'required|numeric|min:1',
            'seller_id'          => 'required|exists:sellers,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $retailer = $this->ensureOwnedActiveRetailer($salesman, $request->retailer_id);
        if (!$retailer) {
            return CommonHelper::responseError('retailer_not_owned_or_not_active');
        }

        $variantId = (int) $request->product_variant_id;
        $sellerId  = (int) $request->seller_id;
        $qty       = (float) $request->qty;

        $line = MasterCatalogOrderHelper::resolveLine($sellerId, $variantId, $qty);
        if (!$line['ok']) {
            return CommonHelper::responseError($line['error']);
        }

        // Salesman draft is scoped to (retailer, salesman). Reuse row if present.
        $cart = Cart::where('user_id', $retailer->id)
            ->where('placed_by_salesman_id', $salesman->id)
            ->where('master_product_variant_id', $variantId)
            ->where('seller_id', $sellerId)
            ->first();
        if (!$cart) {
            $cart = new Cart();
            $cart->user_id = $retailer->id;
            $cart->placed_by_salesman_id = $salesman->id;
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
            'cart_id'    => $cart->id,
            'seller_id'  => $sellerId,
            'unit_price' => $line['unit_price'],
            'slab'       => $line['slab'],
            'message'    => __('item_added_to_cart_successfully'),
        ]);
    }

    /**
     * GET /api/salesman/cart/list?retailer_id=X
     * Lists salesman's draft cart for the given retailer, grouped by distributor.
     */
    public function getCartItems(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $validator = Validator::make($request->all(), [
            'retailer_id' => 'required|integer|exists:users,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $retailer = $this->ensureOwnedActiveRetailer($salesman, $request->retailer_id);
        if (!$retailer) {
            return CommonHelper::responseError('retailer_not_owned_or_not_active');
        }

        $items = Cart::where('user_id', $retailer->id)
            ->where('placed_by_salesman_id', $salesman->id)
            ->whereNotNull('master_product_variant_id')
            ->where('save_for_later', 0)
            ->get();

        if ($items->isEmpty()) {
            return CommonHelper::responseWithData(['groups' => [], 'grand_total' => 0]);
        }

        $variantIds = $items->pluck('master_product_variant_id')->unique();
        $variants = MasterProductVariant::with(['masterProduct.brand', 'unit'])
            ->whereIn('id', $variantIds)->get()->keyBy('id');

        $groups = [];
        foreach ($items as $row) {
            $variant = $variants[$row->master_product_variant_id] ?? null;
            if (!$variant) continue;

            $line = MasterCatalogOrderHelper::resolveLine((int) $row->seller_id, (int) $row->master_product_variant_id, (float) $row->qty);
            if (!$line['ok']) {
                $groups[$row->seller_id]['unavailable'][] = [
                    'cart_id' => $row->id,
                    'product_variant_id' => $row->master_product_variant_id,
                    'reason'  => $line['error'],
                    'name'    => $variant->masterProduct->name ?? '',
                ];
                continue;
            }
            $unitPrice = $line['unit_price'];
            $subtotal  = $unitPrice * (float) $row->qty;

            $groups[$row->seller_id]['seller_id'] = (int) $row->seller_id;
            $groups[$row->seller_id]['items'][] = [
                'cart_id'  => $row->id,
                'product_variant_id' => $variant->id,
                'name'     => $variant->masterProduct->name ?? '',
                'brand'    => $variant->masterProduct->brand->name ?? null,
                'sku'      => $variant->sku,
                'unit'     => $variant->unit->name ?? null,
                'image'    => $variant->image ?: ($variant->masterProduct->image ?? null),
                'qty'      => (float) $row->qty,
                'unit_price' => $unitPrice,
                'slab'     => $line['slab'],
                'sub_total' => $subtotal,
            ];
            $groups[$row->seller_id]['sub_total'] = ($groups[$row->seller_id]['sub_total'] ?? 0) + $subtotal;
            $groups[$row->seller_id]['scheme_lines'][] = [
                'seller_product_id' => $line['seller_product']->id,
                'qty' => (float) $row->qty,
                'line_total' => $subtotal,
            ];
        }

        // Scheme preview: best offer per distributor (re-evaluated server-side at placeOrder).
        foreach ($groups as $sellerId => &$group) {
            $schemeLines = $group['scheme_lines'] ?? [];
            $scheme  = SchemeEngine::evaluate((int) $sellerId, $schemeLines);
            $nearest = SchemeEngine::nearestUnapplied((int) $sellerId, $schemeLines, $scheme['scheme_id'] ?? null);
            unset($group['scheme_lines']);
            $group['applied_scheme']  = $scheme;
            $group['scheme_discount'] = $scheme['scheme_discount'] ?? 0;
            $group['final_total']     = ($group['sub_total'] ?? 0) - $group['scheme_discount'];
            $group['nearest_scheme']  = $nearest;
        }
        unset($group);

        $groupsOut = collect($groups)->values();
        return CommonHelper::responseWithData([
            'groups'      => $groupsOut,
            'grand_total' => $groupsOut->sum('final_total'),
        ]);
    }

    /**
     * POST /api/salesman/cart/remove
     * Body: retailer_id, cart_id
     */
    public function removeCartItem(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $validator = Validator::make($request->all(), [
            'retailer_id' => 'required|integer|exists:users,id',
            'cart_id'     => 'required|exists:carts,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $deleted = Cart::where('id', $request->cart_id)
            ->where('user_id', $request->retailer_id)
            ->where('placed_by_salesman_id', $salesman->id)
            ->delete();

        return $deleted
            ? CommonHelper::responseSuccess('item_removed_from_cart')
            : CommonHelper::responseError('item_not_found');
    }

    /**
     * POST /api/salesman/orders/place
     * Body: retailer_id, payment_method, mobile?, address?, latitude?, longitude?, address_id?,
     *       delivery_time?, order_note?, discount_percent? (0..salesmen.discount cap)
     *
     * Mirrors RetailerCartOrderApiController::placeOrder but:
     *  - Pulls salesman's tagged cart rows (placed_by_salesman_id = me)
     *  - Applies salesman discount (capped by salesmen.discount)
     *  - Stamps orders.placed_by_salesman_id + orders.salesman_discount
     *  - Pushes "salesman_placed_order_customer" to retailer and reuses "retailer_new_order_seller" for distributor
     */
    public function placeOrder(Request $request)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) {
            return CommonHelper::responseError('salesman_not_found');
        }

        $validator = Validator::make($request->all(), [
            'retailer_id'      => 'required|integer|exists:users,id',
            'payment_method'   => 'required|string',
            'discount_percent' => 'nullable|numeric|min:0|max:100',
            'mobile'           => 'nullable|string',
            'address'          => 'nullable|string',
            'latitude'         => 'nullable',
            'longitude'        => 'nullable',
            'address_id'       => 'nullable|integer',
            'delivery_time'    => 'nullable|string',
            'order_note'       => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $retailer = $this->ensureOwnedActiveRetailer($salesman, $request->retailer_id);
        if (!$retailer) {
            return CommonHelper::responseError('retailer_not_owned_or_not_active');
        }

        // Discount cap: distributor sets salesmen.discount (percentage).
        $cap        = (float) ($salesman->discount ?? 0);
        $discountPc = (float) ($request->discount_percent ?? 0);
        if ($discountPc < 0 || $discountPc > $cap) {
            return CommonHelper::responseError('discount_exceeds_your_cap');
        }

        // Pull only this salesman's tagged draft for this retailer.
        $items = Cart::where('user_id', $retailer->id)
            ->where('placed_by_salesman_id', $salesman->id)
            ->whereNotNull('master_product_variant_id')
            ->where('save_for_later', 0)
            ->get();
        if ($items->isEmpty()) {
            return CommonHelper::responseError('cart_is_empty');
        }

        // Pre-resolve every line before any write.
        $resolved = [];
        foreach ($items as $row) {
            $line = MasterCatalogOrderHelper::resolveLine((int) $row->seller_id, (int) $row->master_product_variant_id, (float) $row->qty);
            if (!$line['ok']) {
                return CommonHelper::responseError($line['error']);
            }
            $resolved[$row->id] = $line;
        }

        // Resolve address/coords with retailer profile fallback.
        $profile = $retailer->retailerProfile;
        $mobile  = $request->mobile ?? $retailer->mobile;
        $address = $request->address ?? ($profile->address ?? '');
        $lat     = $request->latitude ?? ($profile->gps_lat ?? null);
        $lng     = $request->longitude ?? ($profile->gps_lng ?? null);
        if (empty($address) || $lat === null || $lng === null) {
            return CommonHelper::responseError('address_or_coords_required');
        }

        $bySeller = $items->groupBy('seller_id');
        $createdOrders = [];

        try {
            DB::transaction(function () use ($items, $resolved, $bySeller, $request, $retailer, $salesman, $discountPc, $mobile, $address, $lat, $lng, &$createdOrders) {
                foreach ($bySeller as $sellerId => $sellerItems) {
                    $sellerSubtotal = 0;
                    $schemeLines = [];
                    foreach ($sellerItems as $row) {
                        $r = $resolved[$row->id];
                        $lineTotal = $r['unit_price'] * (float) $row->qty;
                        $sellerSubtotal += $lineTotal;
                        $schemeLines[] = [
                            'seller_product_id' => $r['seller_product']->id,
                            'qty' => (float) $row->qty,
                            'line_total' => $lineTotal,
                        ];
                    }

                    // Auto-apply best scheme first, then the salesman discount on the scheme-reduced amount.
                    $scheme = SchemeEngine::evaluate((int) $sellerId, $schemeLines);
                    $schemeDiscount = $scheme['scheme_discount'] ?? 0;

                    $salesmanDiscountAmount = round(($sellerSubtotal - $schemeDiscount) * ($discountPc / 100), 2);
                    $finalTotal = max(0, $sellerSubtotal - $schemeDiscount - $salesmanDiscountAmount);

                    $ordersId = 'OD' . date('YmdHis') . rand(10, 99);
                    $deliveryDate = method_exists(CommonHelper::class, 'computeDeliveryDate')
                        ? CommonHelper::computeDeliveryDate(now(), (int) $sellerId)
                        : null;

                    $orderId = DB::table('orders')->insertGetId([
                        'user_id'                 => $retailer->id,
                        'placed_by_salesman_id'   => $salesman->id,
                        'orders_id'               => $ordersId,
                        'mobile'                  => $mobile,
                        'order_note'              => $request->order_note,
                        'total'                   => $sellerSubtotal,
                        'delivery_charge'         => 0,
                        'tax_amount'              => 0,
                        'tax_percentage'          => 0,
                        'wallet_balance'          => 0,
                        'discount'                => $salesmanDiscountAmount,
                        'salesman_discount'       => $salesmanDiscountAmount,
                        'promo_discount'          => 0,
                        'scheme_id'               => $scheme['scheme_id'] ?? null,
                        'scheme_discount'         => $schemeDiscount,
                        'final_total'             => $finalTotal,
                        'payment_method'          => $request->payment_method,
                        'address'                 => $address,
                        'latitude'                => $lat,
                        'longitude'               => $lng,
                        'delivery_time'           => $request->delivery_time ?? '',
                        'delivery_date'           => $deliveryDate,
                        'status'                  => json_encode([['received', date('Y-m-d H:i:s')]]),
                        'active_status'           => (string) OrderStatusList::$received,
                        'address_id'              => $request->address_id ?? 0,
                        'created_at'              => now(),
                        'updated_at'              => now(),
                    ]);

                    foreach ($sellerItems as $row) {
                        $r = $resolved[$row->id];
                        $sp = $r['seller_product'];
                        $mv = $r['master_variant'];
                        $unitPrice = $r['unit_price'];
                        $subTotal = $unitPrice * (float) $row->qty;

                        DB::table('order_items')->insert([
                            'user_id'                   => $retailer->id,
                            'order_id'                  => $orderId,
                            'orders_id'                 => $ordersId,
                            'product_name'              => $mv->masterProduct->name ?? '',
                            'variant_name'              => $mv->sku ?? '',
                            'product_variant_id'        => 0,
                            'master_product_variant_id' => $mv->id,
                            'seller_product_id'         => $sp->id,
                            'quantity'                  => $row->qty,
                            'price'                     => $unitPrice,
                            'discounted_price'          => $r['base_price'],
                            'tax_amount'                => 0,
                            'tax_percentage'            => 0,
                            'discount'                  => 0,
                            'sub_total'                 => $subTotal,
                            'status'                    => json_encode([['received', date('Y-m-d H:i:s')]]),
                            'active_status'             => (string) OrderStatusList::$received,
                            'seller_id'                 => $sellerId,
                            'slab_unit_price'           => $r['slab'] ? $r['slab']['price'] : null,
                            'slab_min_qty'              => $r['slab']['min_qty'] ?? null,
                            'slab_max_qty'              => $r['slab']['max_qty'] ?? null,
                            'created_at'                => now(),
                            'updated_at'                => now(),
                        ]);

                        MasterCatalogOrderHelper::decrementStock($sp->id, (float) $row->qty);
                    }

                    // BXGY free lines: real order_items at price 0 so they flow through delivery + stock.
                    foreach (($scheme['free_items'] ?? []) as $free) {
                        DB::table('order_items')->insert([
                            'user_id'                   => $retailer->id,
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

                    $createdOrders[] = [
                        'order_id'    => $orderId,
                        'orders_id'   => $ordersId,
                        'seller_id'   => (int) $sellerId,
                        'final_total' => $finalTotal,
                        'salesman_discount' => $salesmanDiscountAmount,
                        'scheme' => $scheme ? [
                            'scheme_id' => $scheme['scheme_id'],
                            'name' => $scheme['name'],
                            'type' => $scheme['type'],
                            'scheme_discount' => $schemeDiscount,
                            'free_items' => $scheme['free_items'],
                        ] : null,
                        'delivery_date' => $deliveryDate,
                    ];
                }
                // Clear salesman's draft after successful order.
                Cart::whereIn('id', $items->pluck('id'))->delete();
            });
        } catch (\Throwable $e) {
            Log::error('salesman placeOrder failed: ' . $e->getMessage());
            return CommonHelper::responseError($e->getMessage());
        }

        // Best-effort notifications — failures must NOT break the order response.
        $currency = Setting::get_value('currency') ?? '$';
        $shopName = $retailer->retailerProfile->shop_name ?? ($retailer->name ?? '');
        foreach ($createdOrders as $row) {
            // To distributor — reuse existing template
            try {
                $seller = Seller::select('admin_id')->where('id', $row['seller_id'])->first();
                if ($seller) {
                    $tokens = AdminToken::where('user_id', $seller->admin_id)->where('type', 'Seller')->get();
                    if (!$tokens->isEmpty()) {
                        CommonHelper::sendNotificationByTemplate(
                            $tokens,
                            'retailer_new_order_seller',
                            [
                                'order_id'      => $row['order_id'],
                                'retailer_name' => $shopName,
                                'currency'      => $currency,
                                'final_total'   => $row['final_total'],
                            ],
                            'new_order',
                            0, '', null, null, 'order', $row['order_id']
                        );
                    }
                }
            } catch (\Throwable $e) {
                Log::error('salesman placeOrder distributor push failed: ' . $e->getMessage());
            }

            // To retailer — new template
            try {
                $tokens = UserToken::where('user_id', $retailer->id)->where('type', 'customer')->get();
                if (!$tokens->isEmpty()) {
                    CommonHelper::sendNotificationByTemplate(
                        $tokens,
                        'salesman_placed_order_customer',
                        [
                            'order_id'      => $row['order_id'],
                            'salesman_name' => $salesman->name ?? '',
                            'currency'      => $currency,
                            'final_total'   => $row['final_total'],
                        ],
                        'salesman_order',
                        0, '', null, null, 'order', $row['order_id']
                    );
                }
            } catch (\Throwable $e) {
                Log::error('salesman placeOrder retailer push failed: ' . $e->getMessage());
            }
        }

        return CommonHelper::responseWithData([
            'message' => __('order_placed_successfully'),
            'orders'  => $createdOrders,
        ]);
    }
}
