<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\BrandDistributorMapping;
use App\Models\MasterProduct;
use App\Models\MasterProductVariant;
use App\Models\SellerProduct;
use App\Models\SellerProductSlabPrice;
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
            return CommonHelper::responseWithData([], 0);
        }

        $limit = (int) $request->input('per_page', 25);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $filter = trim((string) $request->input('filter', ''));

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
                'seller_products.status as sp_status'
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
            $query->where('seller_products.status', 1);
        }

        $total = (clone $query)->count();

        $rows = $query->orderBy('master_products.name')
            ->orderBy('master_product_variants.id')
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

        try {
            DB::transaction(function () use ($sp, $request) {
                SellerProductSlabPrice::where('seller_product_id', $sp->id)->delete();
                foreach ($request->slabs as $s) {
                    SellerProductSlabPrice::create([
                        'seller_product_id' => $sp->id,
                        'min_qty' => $s['min_qty'],
                        'max_qty' => $s['max_qty'] ?? null,
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
