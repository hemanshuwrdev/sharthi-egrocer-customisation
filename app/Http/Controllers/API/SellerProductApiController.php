<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandDistributorMapping;
use App\Models\Category;
use App\Models\MasterProduct;
use App\Models\MasterProductVariant;
use App\Models\SellerProduct;
use App\Models\SellerProductSlabPrice;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SellerProductApiController extends Controller
{
    /**
     * Resolve the logged-in distributor's seller record.
     */
    private function seller()
    {
        return auth()->user()->seller;
    }

    /**
     * Auto-list every master variant under brands assigned to this distributor,
     * with the distributor's overrides (status / mrp / selling_price / stock / slab_prices)
     * attached when present.
     */
    public function getMyProducts(Request $request)
    {
        $seller = $this->seller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $brandIds = BrandDistributorMapping::where('seller_id', $seller->id)
            ->pluck('brand_id')
            ->unique()
            ->values();

        if ($brandIds->isEmpty()) {
            // Distinct from "this filter/search just matched nothing" — the frontend
            // can't tell those apart from an empty data array alone, so this is called
            // out as its own top-level flag alongside the (still-array) data field.
            return response()->json([
                'status' => 1,
                'message' => __('success'),
                'total' => 0,
                'data' => [],
                'no_brands_assigned' => true,
            ]);
        }

        // Accept both the admin panel's page/per_page and the mobile app's limit/offset.
        $limit = (int) $request->input('limit', $request->input('per_page', 25));
        if ($request->filled('offset')) {
            $offset = (int) $request->input('offset');
        } else {
            $page = max((int) $request->input('page', 1), 1);
            $offset = ($page - 1) * $limit;
        }
        $filter = trim((string) $request->input('filter', ''));
        $type   = trim((string) $request->input('type', ''));
        $sort   = trim((string) $request->input('sort', ''));

        $query = MasterProductVariant::query()
            ->with(['masterProduct.brand', 'masterProduct.parentCompany', 'unit', 'secondaryUnit'])
            ->join('master_products', 'master_product_variants.master_product_id', '=', 'master_products.id')
            ->leftJoin('seller_products', function ($j) use ($seller) {
                $j->on('seller_products.master_product_variant_id', '=', 'master_product_variants.id')
                    ->where('seller_products.seller_id', $seller->id);
            })
            ->whereIn('master_products.brand_id', $brandIds)
            ->where('master_products.status', 1)
            ->where('master_product_variants.status', 1)
            ->select(
                'master_product_variants.*',
                'seller_products.id as sp_id',
                'seller_products.mrp as sp_mrp',
                'seller_products.selling_price as sp_selling_price',
                'seller_products.discounted_price as sp_discounted_price',
                'seller_products.stock as sp_stock',
                'seller_products.status as sp_status',
                'seller_products.allow_loose_qty as sp_allow_loose_qty',
                'seller_products.min_qty as sp_min_qty',
                'seller_products.max_qty_mode as sp_max_qty_mode',
                'seller_products.max_qty_value as sp_max_qty_value',
                'seller_products.cancelable_status as sp_cancelable_status',
                'seller_products.return_status as sp_return_status',
                'seller_products.return_days as sp_return_days'
            );

        if ($filter !== '') {
            $query->where(function ($w) use ($filter) {
                $w->where('master_products.name', 'like', "%{$filter}%")
                    ->orWhere('master_product_variants.sku', 'like', "%{$filter}%")
                    ->orWhere('master_products.hsn', 'like', "%{$filter}%");
            });
        }

        if ($request->filled('brand_id')) {
            $query->where('master_products.brand_id', $request->brand_id);
        }
        if ($request->filled('active_only')) {
            // '1' = activated only. '0' = deactivated only, meaning "not currently
            // sellable" — both explicitly-off (status=0) AND never activated at all
            // (no seller_products row yet, so status is NULL via the left join above).
            if ((int) $request->active_only === 1) {
                $query->where('seller_products.status', 1);
            } else {
                $query->where(function ($w) {
                    $w->where('seller_products.status', 0)
                        ->orWhereNull('seller_products.status');
                });
            }
        }
        if ($request->filled('master_product_id')) {
            $query->where('master_products.id', $request->master_product_id);
        }

        // Dashboard tiles: same sold_out/low_stock convention as the legacy
        // ProductApisController::getProducts, scoped to this seller's own stock.
        if ($type === 'sold_out') {
            $query->where('seller_products.stock', '<=', 0)
                  ->where('seller_products.status', 0);
        } elseif ($type === 'low_stock') {
            $lowStockLimit = Setting::where('variable', 'low_stock_limit')->value('value');
            if ($lowStockLimit !== null && $lowStockLimit !== '') {
                $query->where('seller_products.stock', '>', 0)
                      ->where('seller_products.stock', '<=', (float) $lowStockLimit)
                      ->where('seller_products.status', 1);
            } else {
                // No threshold configured — nothing can be "low stock" by definition.
                $query->whereRaw('1 = 0');
            }
        } elseif ($type === 'in_stock') {
            $lowStockLimit = Setting::where('variable', 'low_stock_limit')->value('value');
            $query->where('seller_products.status', 1);
            if ($lowStockLimit !== null && $lowStockLimit !== '') {
                $query->where('seller_products.stock', '>', (float) $lowStockLimit);
            } else {
                $query->where('seller_products.stock', '>', 0);
            }
        }

        if ($request->filled('category_id')) {
            $query->where('master_products.category_id', $request->category_id);
        }
        if ($request->filled('min_price')) {
            $query->where('seller_products.selling_price', '>=', (float) $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('seller_products.selling_price', '<=', (float) $request->max_price);
        }

        $total = (clone $query)->count();

        $orderedQuery = $sort === 'new'
            ? $query->orderBy('master_product_variants.id', 'desc')
            : $query->orderBy('master_products.name')->orderBy('master_product_variants.id');

        $rows = $orderedQuery
            ->skip($offset)
            ->take($limit)
            ->get();

        $spIds = $rows->pluck('sp_id')->filter()->unique()->values();
        $slabsBySp = SellerProductSlabPrice::whereIn('seller_product_id', $spIds)
            ->orderBy('min_qty')
            ->get()
            ->groupBy('seller_product_id');

        $result = $rows->map(function ($v) use ($slabsBySp) {
            $mp = $v->masterProduct;
            return [
                'product_variant_id' => $v->id,
                'product_id' => $v->master_product_id,
                'master_product_name' => $mp ? $mp->name : null,
                'parent_company' => $mp && $mp->parentCompany ? $mp->parentCompany->name : null,
                'brand' => $mp && $mp->brand ? $mp->brand->name : null,
                'brand_id' => $mp ? $mp->brand_id : null,
                'sku' => $v->sku,
                'unit' => $v->unit ? $v->unit->name : null,
                'unit_id' => $v->unit_id,
                'secondary_unit' => $v->secondaryUnit ? $v->secondaryUnit->name : null,
                'secondary_unit_value' => $v->secondary_unit_value,
                'allow_loose_qty' => (bool) $v->sp_allow_loose_qty,
                'min_qty' => $v->sp_min_qty !== null ? (int) $v->sp_min_qty : null,
                'max_qty_mode' => $v->sp_max_qty_mode,
                'max_qty_value' => $v->sp_max_qty_value,
                'cancelable_status' => (bool) $v->sp_cancelable_status,
                'return_status' => (bool) $v->sp_return_status,
                'return_days' => $v->sp_return_days !== null ? (int) $v->sp_return_days : 1,
                'weight' => $v->weight,
                'image' => $v->image ?: ($mp ? $mp->image : null),

                'seller_product_id' => $v->sp_id,
                'mrp' => $v->sp_mrp !== null ? (float) $v->sp_mrp : 0,
                'selling_price' => $v->sp_selling_price !== null ? (float) $v->sp_selling_price : 0,
                'discounted_price' => $v->sp_discounted_price !== null ? (float) $v->sp_discounted_price : null,
                'stock' => $v->sp_stock !== null ? (float) $v->sp_stock : 0,
                'status' => $v->sp_status !== null ? (int) $v->sp_status : 0,
                'slab_prices' => $v->sp_id && isset($slabsBySp[$v->sp_id])
                    ? $slabsBySp[$v->sp_id]->map(fn($s) => [
                        'id' => $s->id,
                        'min_qty' => $s->min_qty,
                        'max_qty' => $s->max_qty,
                        'price' => (float) $s->price,
                    ])->values()
                    : [],
            ];
        });

        return CommonHelper::responseWithData($result, $total);
    }

    /**
     * Brands available for the "My Products" filter dropdown — every brand assigned
     * to this distributor. Deliberately independent of the current product list: the
     * frontend used to derive this from whatever rows happened to be on the current
     * page (collectBrands()), so paging or filtering down to a handful of rows made
     * brands silently disappear from their own filter dropdown.
     */
    public function getFilterBrands()
    {
        $seller = $this->seller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $brandIds = BrandDistributorMapping::where('seller_id', $seller->id)
            ->pluck('brand_id')
            ->unique()
            ->values();

        if ($brandIds->isEmpty()) {
            return CommonHelper::responseWithData([], 0);
        }

        $brands = Brand::whereIn('id', $brandIds)
            ->where('status', 1)
            ->orderBy('name')
            ->get(['id', 'name']);

        return CommonHelper::responseWithData($brands, $brands->count());
    }

    /**
     * Categories available for the "My Products" filter dropdown — distinct
     * categories among master products under this distributor's assigned brands.
     * Deliberately independent of any currently-active filter (status/search/stock/
     * price), the same reasoning as collectBrands() above.
     */
    public function getFilterCategories()
    {
        $seller = $this->seller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $brandIds = BrandDistributorMapping::where('seller_id', $seller->id)
            ->pluck('brand_id')
            ->unique()
            ->values();

        if ($brandIds->isEmpty()) {
            return CommonHelper::responseWithData([], 0);
        }

        $categories = Category::whereIn('id', function ($q) use ($brandIds) {
                $q->select('category_id')
                    ->from('master_products')
                    ->whereIn('brand_id', $brandIds)
                    ->where('status', 1)
                    ->whereNotNull('category_id');
            })
            ->orderBy('name')
            ->get(['id', 'name']);

        return CommonHelper::responseWithData($categories, $categories->count());
    }

    /**
     * Upsert distributor's overrides for a master variant.
     * Guards: variant must belong to a brand assigned to this distributor.
     */
    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_variant_id' => 'required|exists:master_product_variants,id',
            'mrp' => 'nullable|numeric|min:0',
            'selling_price' => 'nullable|numeric|min:0',
            'discounted_price' => 'nullable|numeric|min:0',
            'stock' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:0,1',
            'allow_loose_qty' => 'nullable|boolean',
            'min_qty' => 'nullable|integer|min:1',
            'max_qty_mode' => 'nullable|in:per_order,per_day',
            'max_qty_value' => 'nullable|integer|min:1',
            'cancelable_status' => 'nullable|boolean',
            'return_status' => 'nullable|boolean',
            'return_days' => 'nullable|integer|min:1',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $seller = $this->seller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        if (!$this->isVariantAssignedToSeller($request->product_variant_id, $seller->id)) {
            return CommonHelper::responseError('brand_not_assigned_to_you');
        }

        $sp = SellerProduct::firstOrNew([
            'seller_id' => $seller->id,
            'master_product_variant_id' => $request->product_variant_id,
        ]);

        if ($request->has('mrp')) $sp->mrp = $request->mrp ?: 0;
        if ($request->has('selling_price')) $sp->selling_price = $request->selling_price ?: 0;
        if ($request->has('discounted_price')) $sp->discounted_price = $request->discounted_price;
        if ($request->has('stock')) $sp->stock = $request->stock ?: 0;
        if ($request->has('status')) $sp->status = $request->status;
        elseif (!$sp->exists) $sp->status = 0;
        if ($request->has('allow_loose_qty')) $sp->allow_loose_qty = (bool) $request->allow_loose_qty;
        if ($request->has('min_qty')) $sp->min_qty = $request->min_qty ? (int) $request->min_qty : null;
        if ($request->has('max_qty_mode')) $sp->max_qty_mode = $request->max_qty_mode ?: null;
        if ($request->has('max_qty_value')) $sp->max_qty_value = $request->max_qty_value ?: null;
        if ($request->has('cancelable_status')) $sp->cancelable_status = (bool) $request->cancelable_status;
        if ($request->has('return_status')) $sp->return_status = (bool) $request->return_status;
        if ($request->has('return_days')) $sp->return_days = $request->return_days ?: 1;

        $sp->save();

        return CommonHelper::responseWithData([
            'seller_product_id' => $sp->id,
            'message' => __('product_updated_successfully'),
        ]);
    }

    /**
     * Quick activate / deactivate without touching price/stock.
     */
    public function toggleStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_variant_id' => 'required|exists:master_product_variants,id',
            'status' => 'required|in:0,1',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $seller = $this->seller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }
        if (!$this->isVariantAssignedToSeller($request->product_variant_id, $seller->id)) {
            return CommonHelper::responseError('brand_not_assigned_to_you');
        }

        $sp = SellerProduct::firstOrNew([
            'seller_id' => $seller->id,
            'master_product_variant_id' => $request->product_variant_id,
        ]);
        $sp->status = $request->status;
        $sp->save();

        return CommonHelper::responseSuccess('status_updated_successfully');
    }

    /**
     * Save slab pricing for one of the distributor's seller_products.
     * Replaces all existing slabs with the provided list (full-sync style).
     */
    public function saveSlabs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seller_product_id' => 'required|exists:seller_products,id',
            'slabs' => 'required|array',
            'slabs.*.min_qty' => 'required|integer|min:1',
            'slabs.*.max_qty' => 'nullable|integer|min:1',
            'slabs.*.price' => 'required|numeric|min:0',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $seller = $this->seller();
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $sp = SellerProduct::where('id', $request->seller_product_id)
            ->where('seller_id', $seller->id)
            ->first();
        if (!$sp) {
            return CommonHelper::responseError('seller_product_not_found');
        }

        $variant = $sp->masterProductVariant;
        $step = ((int) $sp->allow_loose_qty === 1)
            ? 0
            : (float) ($variant?->secondary_unit_value ?? 0);
        $clean = CommonHelper::validateSlabRanges($request->slabs, $step);
        if (is_string($clean)) {
            return CommonHelper::responseError($clean);
        }

        try {
            DB::transaction(function () use ($sp, $clean) {
                SellerProductSlabPrice::where('seller_product_id', $sp->id)->delete();
                foreach ($clean as $s) {
                    SellerProductSlabPrice::create([
                        'seller_product_id' => $sp->id,
                        'min_qty' => $s['min_qty'],
                        'max_qty' => $s['max_qty'],
                        'price' => $s['price'],
                    ]);
                }
            });
        } catch (\Throwable $e) {
            return CommonHelper::responseError($e->getMessage());
        }

        return CommonHelper::responseSuccess('slab_prices_saved_successfully');
    }

    private function isVariantAssignedToSeller($variantId, $sellerId): bool
    {
        $brandId = MasterProductVariant::where('master_product_variants.id', $variantId)
            ->join('master_products', 'master_product_variants.master_product_id', '=', 'master_products.id')
            ->value('master_products.brand_id');
        if (!$brandId) {
            return false;
        }
        return BrandDistributorMapping::where('seller_id', $sellerId)
            ->where('brand_id', $brandId)
            ->exists();
    }
}
