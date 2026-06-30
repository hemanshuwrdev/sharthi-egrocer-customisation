<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandDistributorMapping;
use App\Models\MasterProduct;
use App\Models\MasterProductVariant;
use App\Models\ProductRating;
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
        try {
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

        $limit  = max(1, (int) $request->input('limit', $request->input('per_page', 25)));
        $offset = max(0, (int) $request->input('offset', 0));
        $sort   = trim((string) $request->input('sort', ''));
        $filter = trim((string) $request->input('filter', ''));

        $mappings = BrandDistributorMapping::whereIn('city_id', $cityIds)
            ->get(['brand_id', 'seller_id']);

        $sellers = \App\Models\Seller::whereIn('id', $mappings->pluck('seller_id')->unique())
            ->get(['id', 'name', 'logo'])
            ->keyBy('id');
        $sellerNames = $sellers->pluck('name', 'id');

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

        // category_ids: comma-separated string or array
        $categoryIds = array_filter(array_map('intval', explode(',', (string) $request->input('category_ids', $request->input('category_id', '')))));
        if (!empty($categoryIds)) {
            $query->whereIn('master_products.category_id', $categoryIds);
        }

        // brand_ids: comma-separated string or array
        $brandIdsFilter = array_filter(array_map('intval', explode(',', (string) $request->input('brand_ids', $request->input('brand_id', '')))));
        if (!empty($brandIdsFilter)) {
            $query->whereIn('master_products.brand_id', $brandIdsFilter);
        }

        // unit_ids: comma-separated
        $unitIds = array_filter(array_map('intval', explode(',', (string) $request->input('unit_ids', ''))));
        if (!empty($unitIds)) {
            $query->whereIn('master_product_variants.unit_id', $unitIds);
        }

        // sizes: comma-separated weights (paired with unit_ids in legacy; here applied independently)
        $sizes = array_filter(array_map('trim', explode(',', (string) $request->input('sizes', ''))));
        if (!empty($sizes)) {
            $query->whereIn('master_product_variants.weight', $sizes);
        }

        // seller_id: filter to a specific distributor
        $sellerIdFilter = (int) $request->input('seller_id', 0);
        if ($sellerIdFilter > 0) {
            $query->where('seller_products.seller_id', $sellerIdFilter);
        }

        if ($request->filled('parent_company_id')) {
            $query->where('master_products.parent_company_id', $request->parent_company_id);
        }

        // Apply DB-level sort for name/date; price/discount sorts are applied after grouping
        $dbOrder = match ($sort) {
            'new'  => ['master_products.id', 'DESC'],
            'old'  => ['master_products.id', 'ASC'],
            'a_to_z', 'a-to-z' => ['master_products.name', 'ASC'],
            'z_to_a', 'z-to-a' => ['master_products.name', 'DESC'],
            default => ['master_products.name', 'ASC'],
        };

        $rows = $query->orderBy($dbOrder[0], $dbOrder[1])
            ->orderBy('master_product_variants.id')
            ->get();

        $rows = $rows->filter(fn($r) => isset($allowedPairs[$r->mp_brand_id . '_' . $r->sp_seller_id]));

        $slabsBySp = SellerProductSlabPrice::whereIn('seller_product_id', $rows->pluck('sp_id')->unique())
            ->orderBy('min_qty')
            ->get()
            ->groupBy('seller_product_id');

        // Preload ratings grouped by (product_id, seller_id) for seller-wise avg/count
        $masterProductIds = $rows->pluck('master_product_id')->unique();
        $ratingsBySellerProduct = ProductRating::whereIn('product_id', $masterProductIds)
            ->where('status', 1)
            ->get(['product_id', 'seller_id', 'rate'])
            ->groupBy(fn($r) => $r->product_id . '_' . $r->seller_id);

        $grouped = $rows->groupBy('id')->map(function ($group) use ($brandOverlap, $slabsBySp, $sellerNames, $sellers, $ratingsBySellerProduct) {
            $first = $group->first();
            $mp = $first->masterProduct;
            $overlapAllowed = (int) ($brandOverlap[$first->mp_brand_id] ?? 0) === 1;

            $offers = $group->map(function ($r) use ($slabsBySp, $sellerNames, $sellers, $ratingsBySellerProduct) {
                $sellerLogo  = $sellers[$r->sp_seller_id]->logo ?? null;
                $ratingKey   = $r->master_product_id . '_' . $r->sp_seller_id;
                $ratingGroup = $ratingsBySellerProduct[$ratingKey] ?? null;
                return [
                    'seller_id'        => $r->sp_seller_id,
                    'seller_name'      => $sellerNames[$r->sp_seller_id] ?? null,
                    'seller_image_url' => $sellerLogo ? asset('storage/' . $sellerLogo) : null,
                    'seller_product_id'=> $r->sp_id,
                    'mrp'              => (float) $r->sp_mrp,
                    'selling_price'    => (float) $r->sp_selling_price,
                    'discounted_price' => $r->sp_discounted_price !== null ? (float) $r->sp_discounted_price : null,
                    'stock'            => (float) $r->sp_stock,
                    'slab_prices'      => isset($slabsBySp[$r->sp_id])
                        ? $slabsBySp[$r->sp_id]->map(fn($s) => [
                            'id'      => $s->id,
                            'min_qty' => $s->min_qty,
                            'max_qty' => $s->max_qty,
                            'price'   => (float) $s->price,
                        ])->values()
                        : [],
                    'avg_rating'    => $ratingGroup ? round($ratingGroup->avg('rate'), 1) : null,
                    'total_ratings' => $ratingGroup ? $ratingGroup->count() : 0,
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
                'offers'        => $offers,
                'best_offer'    => $offers->first(),
            ];
        })->values();

        // Post-group sorts (need best_offer price which is only known after grouping)
        $grouped = match ($sort) {
            'low', 'price_low_to_high', 'price-low-to-high' => $grouped->sortBy(fn($p) => $p['best_offer']['discounted_price'] > 0 ? $p['best_offer']['discounted_price'] : $p['best_offer']['selling_price'])->values(),
            'high', 'price_high_to_low', 'price-high-to-low' => $grouped->sortByDesc(fn($p) => $p['best_offer']['discounted_price'] > 0 ? $p['best_offer']['discounted_price'] : $p['best_offer']['selling_price'])->values(),
            'discount' => $grouped->sortByDesc(function ($p) {
                $o = $p['best_offer'];
                $base = $o['selling_price'] > 0 ? $o['selling_price'] : 1;
                return $o['discounted_price'] > 0 ? round(($base - $o['discounted_price']) / $base * 100, 2) : 0;
            })->values(),
            default => $grouped,
        };

        $total = $grouped->count();
        $paged = $grouped->slice($offset, $limit)->values();

        return CommonHelper::responseWithData($paged, $total);
        } catch (\Throwable $e) {
            return CommonHelper::responseError($e->getMessage() . ' | line: ' . $e->getLine() . ' | file: ' . basename($e->getFile()));
        }
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

        $sellerProducts = SellerProduct::with(['slabPrices', 'seller'])
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
            $sellerLogo = $sp->seller ? $sp->seller->logo : null;
            return [
                'seller_id'        => $sp->seller_id,
                // 'seller_image'     => $sellerLogo,
                'seller_image_url' => $sellerLogo ? asset('storage/' . $sellerLogo) : null,
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
