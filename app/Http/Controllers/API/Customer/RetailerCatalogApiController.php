<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandDistributorMapping;
use App\Models\MasterProduct;
use App\Models\MasterProductVariant;
use App\Models\SellerProduct;
use App\Models\SellerProductSlabPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Sarthi master-catalog retailer feed.
 *
 * Flow:
 *  - Input: retailer's city_id
 *  - Lookup: brand_distributor_mappings where city = retailer's city → (brand, seller) pairs
 *  - For each pair: pull master variants under that brand with the seller's seller_products override (status=1)
 *  - Group by variant; if brand.is_overlap_allowed=1, multiple distributors may serve the same variant
 *    — return all of them so the retailer can pick. Otherwise the territory mapping already enforces one.
 */
class RetailerCatalogApiController extends Controller
{
    /**
     * Auto-list of products visible to the retailer at a given lat/long.
     * Required: latitude, longitude (deliverable city set resolved from these).
     * Optional: brand_id, category_id, parent_company_id, filter, page/per_page.
     */
    public function listProducts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required',
            'longitude' => 'required',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $cityIds = CommonHelper::getDeliverableCityIds($request->latitude, $request->longitude);
        if (empty($cityIds)) {
            return CommonHelper::responseWithData([], 0);
        }

        $limit = (int) $request->input('per_page', 25);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $filter = trim((string) $request->input('filter', ''));

        $mappings = BrandDistributorMapping::whereIn('city_id', $cityIds)
            ->get(['brand_id', 'seller_id']);

        if ($mappings->isEmpty()) {
            return CommonHelper::responseWithData([], 0);
        }

        $brandIds = $mappings->pluck('brand_id')->unique()->values();
        $sellerIds = $mappings->pluck('seller_id')->unique()->values();
        $allowedPairs = $mappings->map(fn($m) => $m->brand_id . '_' . $m->seller_id)->unique()->flip();

        $brandOverlap = Brand::whereIn('id', $brandIds)
            ->pluck('is_overlap_allowed', 'id');

        $query = MasterProductVariant::query()
            ->with(['masterProduct.brand', 'masterProduct.parentCompany', 'masterProduct.category', 'unit', 'secondaryUnit'])
            ->join('master_products', 'master_product_variants.master_product_id', '=', 'master_products.id')
            ->join('seller_products', function ($j) {
                $j->on('seller_products.master_product_variant_id', '=', 'master_product_variants.id');
            })
            ->whereIn('master_products.brand_id', $brandIds)
            ->whereIn('seller_products.seller_id', $sellerIds)
            ->where('master_products.status', 1)
            ->where('master_product_variants.status', 1)
            ->where('seller_products.status', 1)
            ->where('seller_products.selling_price', '>', 0)
            ->select(
                'master_product_variants.*',
                'master_products.brand_id as mp_brand_id',
                'seller_products.id as sp_id',
                'seller_products.seller_id as sp_seller_id',
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
            $query->where('master_products.brand_id', $request->brand_id);
        }
        if ($request->filled('category_id')) {
            $query->where('master_products.category_id', $request->category_id);
        }
        if ($request->filled('parent_company_id')) {
            $query->where('master_products.parent_company_id', $request->parent_company_id);
        }

        $rows = $query->orderBy('master_products.name')
            ->orderBy('master_product_variants.id')
            ->get();

        $rows = $rows->filter(fn($r) => isset($allowedPairs[$r->mp_brand_id . '_' . $r->sp_seller_id]));

        $slabsBySp = SellerProductSlabPrice::whereIn('seller_product_id', $rows->pluck('sp_id')->unique())
            ->orderBy('min_qty')
            ->get()
            ->groupBy('seller_product_id');

        $grouped = $rows->groupBy('id')->map(function ($group) use ($brandOverlap, $slabsBySp) {
            $first = $group->first();
            $mp = $first->masterProduct;
            $overlapAllowed = (int) ($brandOverlap[$first->mp_brand_id] ?? 0) === 1;

            $offers = $group->map(function ($r) use ($slabsBySp) {
                return [
                    'seller_id' => $r->sp_seller_id,
                    'seller_product_id' => $r->sp_id,
                    'mrp' => (float) $r->sp_mrp,
                    'selling_price' => (float) $r->sp_selling_price,
                    'discounted_price' => $r->sp_discounted_price !== null ? (float) $r->sp_discounted_price : null,
                    'stock' => (float) $r->sp_stock,
                    'slab_prices' => isset($slabsBySp[$r->sp_id])
                        ? $slabsBySp[$r->sp_id]->map(fn($s) => [
                            'id' => $s->id,
                            'min_qty' => $s->min_qty,
                            'max_qty' => $s->max_qty,
                            'price' => (float) $s->price,
                        ])->values()
                        : [],
                ];
            })->sortBy(function ($o) {
                return $o['discounted_price'] !== null && $o['discounted_price'] > 0 ? $o['discounted_price'] : $o['selling_price'];
            })->values();

            return [
                'product_variant_id' => $first->id,
                'product_id' => $first->master_product_id,
                'master_product_name' => $mp ? $mp->name : null,
                'brand' => $mp && $mp->brand ? $mp->brand->name : null,
                'brand_id' => $mp ? $mp->brand_id : null,
                'parent_company' => $mp && $mp->parentCompany ? $mp->parentCompany->name : null,
                'category' => $mp && $mp->category ? $mp->category->name : null,
                'category_id' => $mp ? $mp->category_id : null,
                'sku' => $first->sku,
                'unit' => $first->unit ? $first->unit->name : null,
                'secondary_unit' => $first->secondaryUnit ? $first->secondaryUnit->name : null,
                'secondary_unit_value' => $first->secondary_unit_value,
                'weight' => $first->weight,
                'image' => $first->image ?: ($mp ? $mp->image : null),
                'overlap_allowed' => $overlapAllowed,
                'offers' => $offers,
                'best_offer' => $offers->first(),
            ];
        })->values();

        $total = $grouped->count();
        $paged = $grouped->slice($offset, $limit)->values();

        return CommonHelper::responseWithData($paged, $total);
    }

    /**
     * Single variant detail with every distributor that can serve this variant at the given lat/long.
     */
    public function productDetail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_variant_id' => 'required|exists:master_product_variants,id',
            'latitude' => 'required',
            'longitude' => 'required',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $variant = MasterProductVariant::with(['masterProduct.brand', 'masterProduct.parentCompany', 'masterProduct.category', 'unit', 'secondaryUnit'])
            ->find($request->product_variant_id);
        if (!$variant || !$variant->masterProduct) {
            return CommonHelper::responseError('master_product_not_found');
        }

        $brandId = $variant->masterProduct->brand_id;
        $cityIds = CommonHelper::getDeliverableCityIds($request->latitude, $request->longitude);
        if (empty($cityIds)) {
            return CommonHelper::responseError('product_not_available_in_your_area');
        }

        $sellerIds = BrandDistributorMapping::where('brand_id', $brandId)
            ->whereIn('city_id', $cityIds)
            ->pluck('seller_id');

        if ($sellerIds->isEmpty()) {
            return CommonHelper::responseError('product_not_available_in_your_area');
        }

        $sellerProducts = SellerProduct::with('slabPrices')
            ->where('master_product_variant_id', $variant->id)
            ->whereIn('seller_id', $sellerIds)
            ->where('status', 1)
            ->where('selling_price', '>', 0)
            ->get();

        if ($sellerProducts->isEmpty()) {
            return CommonHelper::responseError('product_not_available_in_your_area');
        }

        $brand = $variant->masterProduct->brand;
        $overlapAllowed = $brand && (int) $brand->is_overlap_allowed === 1;

        $offers = $sellerProducts->map(function ($sp) {
            return [
                'seller_id' => $sp->seller_id,
                'seller_product_id' => $sp->id,
                'mrp' => (float) $sp->mrp,
                'selling_price' => (float) $sp->selling_price,
                'discounted_price' => $sp->discounted_price !== null ? (float) $sp->discounted_price : null,
                'stock' => (float) $sp->stock,
                'slab_prices' => $sp->slabPrices->map(fn($s) => [
                    'id' => $s->id,
                    'min_qty' => $s->min_qty,
                    'max_qty' => $s->max_qty,
                    'price' => (float) $s->price,
                ])->values(),
            ];
        })->sortBy(fn($o) => $o['discounted_price'] !== null && $o['discounted_price'] > 0 ? $o['discounted_price'] : $o['selling_price'])
            ->values();

        return CommonHelper::responseWithData([
            'product_variant_id' => $variant->id,
            'product_id' => $variant->master_product_id,
            'master_product_name' => $variant->masterProduct->name,
            'brand' => $brand ? $brand->name : null,
            'brand_id' => $brandId,
            'parent_company' => $variant->masterProduct->parentCompany ? $variant->masterProduct->parentCompany->name : null,
            'category' => $variant->masterProduct->category ? $variant->masterProduct->category->name : null,
            'sku' => $variant->sku,
            'unit' => $variant->unit ? $variant->unit->name : null,
            'secondary_unit' => $variant->secondaryUnit ? $variant->secondaryUnit->name : null,
            'secondary_unit_value' => $variant->secondary_unit_value,
            'weight' => $variant->weight,
            'image' => $variant->image ?: $variant->masterProduct->image,
            'description' => $variant->masterProduct->description,
            'short_description' => $variant->masterProduct->short_description,
            'overlap_allowed' => $overlapAllowed,
            'offers' => $offers,
            'best_offer' => $offers->first(),
        ]);
    }

    /**
     * Resolve the slab-applicable unit price for a given (seller_product, qty).
     * Used by cart/order to freeze the actual price at the time of action.
     */
    public static function resolveUnitPrice(int $sellerProductId, float $qty): array
    {
        $sp = SellerProduct::with('slabPrices')->find($sellerProductId);
        if (!$sp) {
            return ['price' => 0, 'slab' => null];
        }

        $base = $sp->discounted_price && $sp->discounted_price > 0
            ? (float) $sp->discounted_price
            : (float) $sp->selling_price;

        $matched = null;
        foreach ($sp->slabPrices->sortByDesc('min_qty') as $slab) {
            $inRange = $qty >= $slab->min_qty && ($slab->max_qty === null || $qty <= $slab->max_qty);
            if ($inRange) {
                $matched = $slab;
                break;
            }
        }

        if ($matched) {
            return [
                'price' => (float) $matched->price,
                'slab' => [
                    'min_qty' => (int) $matched->min_qty,
                    'max_qty' => $matched->max_qty !== null ? (int) $matched->max_qty : null,
                ],
            ];
        }

        return ['price' => $base, 'slab' => null];
    }
}
