<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandDistributorMapping;
use App\Models\City;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SuperAdminCustomApiController extends Controller
{
    /**
     * Map Brands to specific Distributors for specific geographic areas (cities).
     */
    public function saveBrandMappings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'brand_id' => 'required|exists:brands,id',
            'seller_id' => 'required|exists:sellers,id',
            'city_ids' => 'required|array',
            'city_ids.*' => 'exists:cities,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $brand = Brand::find($request->brand_id);
        if (!$brand->is_overlap_allowed) {
            // Check if another seller already has this brand mapped to any of these cities
            $existing = BrandDistributorMapping::where('brand_id', $brand->id)
                ->where('seller_id', '!=', $request->seller_id)
                ->whereIn('city_id', $request->city_ids)
                ->first();
            
            if ($existing) {
                return CommonHelper::responseError('Overlap not allowed for this brand in the selected territories.');
            }
        }

        // We can either append or sync. Let's just create new missing mappings.
        // It's usually better to sync. Let's clear previous for this brand + seller and insert new.
        BrandDistributorMapping::where('brand_id', $request->brand_id)
            ->where('seller_id', $request->seller_id)
            ->delete();

        $mappings = [];
        foreach ($request->city_ids as $city_id) {
            $mappings[] = [
                'brand_id' => $request->brand_id,
                'seller_id' => $request->seller_id,
                'city_id' => $city_id,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        BrandDistributorMapping::insert($mappings);

        return CommonHelper::responseSuccess('Brand mappings updated successfully.');
    }

    /**
     * List brand-distributor mappings grouped by (brand, seller), with city names attached.
     */
    public function listBrandMappings(Request $request)
    {
        $limit = $request->input('per_page', 10);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $filter = trim((string) $request->input('filter', ''));

        $base = BrandDistributorMapping::query()
            ->selectRaw('brand_id, seller_id, MIN(id) as id, COUNT(*) as city_count')
            ->groupBy('brand_id', 'seller_id');

        if ($request->filled('brand_id')) {
            $base->where('brand_id', $request->brand_id);
        }
        if ($request->filled('seller_id')) {
            $base->where('seller_id', $request->seller_id);
        }

        $total = DB::table(DB::raw('(' . $base->toSql() . ') as g'))
            ->mergeBindings($base->getQuery())
            ->count();

        $groups = $base->orderBy('brand_id')->skip($offset)->take($limit)->get();

        $brandIds = $groups->pluck('brand_id')->unique();
        $sellerIds = $groups->pluck('seller_id')->unique();

        $brands = Brand::whereIn('id', $brandIds)->get(['id', 'name', 'is_overlap_allowed'])->keyBy('id');
        $sellers = Seller::whereIn('id', $sellerIds)->get(['id', 'store_name'])->keyBy('id');

        $cityMap = BrandDistributorMapping::whereIn('brand_id', $brandIds)
            ->whereIn('seller_id', $sellerIds)
            ->get(['brand_id', 'seller_id', 'city_id'])
            ->groupBy(fn($r) => $r->brand_id . '_' . $r->seller_id);

        $cityIdSet = collect();
        foreach ($cityMap as $rows) {
            foreach ($rows as $r) {
                $cityIdSet->push($r->city_id);
            }
        }
        $cityNames = City::whereIn('id', $cityIdSet->unique())->get(['id', 'name'])->keyBy('id');

        $result = $groups->map(function ($g) use ($brands, $sellers, $cityMap, $cityNames) {
            $key = $g->brand_id . '_' . $g->seller_id;
            $rows = $cityMap[$key] ?? collect();
            $cityIds = $rows->pluck('city_id')->values();
            return [
                'brand_id' => $g->brand_id,
                'seller_id' => $g->seller_id,
                'brand' => $brands[$g->brand_id] ?? null,
                'seller' => $sellers[$g->seller_id] ?? null,
                'city_ids' => $cityIds,
                'cities' => $cityIds->map(fn($cid) => $cityNames[$cid] ?? null)->filter()->values(),
                'city_count' => $g->city_count,
            ];
        })->values();

        if ($filter !== '') {
            $needle = strtolower($filter);
            $result = $result->filter(function ($r) use ($needle) {
                $brandName = strtolower($r['brand']->name ?? '');
                $sellerName = strtolower($r['seller']->store_name ?? '');
                return str_contains($brandName, $needle) || str_contains($sellerName, $needle);
            })->values();
        }

        return CommonHelper::responseWithData($result, $total);
    }

    /**
     * Get current city_ids for a (brand, seller) so the edit modal can preselect.
     */
    public function getBrandSellerMapping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'brand_id' => 'required|exists:brands,id',
            'seller_id' => 'required|exists:sellers,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $cityIds = BrandDistributorMapping::where('brand_id', $request->brand_id)
            ->where('seller_id', $request->seller_id)
            ->pluck('city_id');

        return CommonHelper::responseWithData([
            'brand_id' => (int) $request->brand_id,
            'seller_id' => (int) $request->seller_id,
            'city_ids' => $cityIds,
        ]);
    }

    /**
     * Remove every city mapping for a (brand, seller) — the distributor loses all access
     * to this brand's products. Existing seller_products rows are left parked (hidden from
     * distributor's list because the brand is no longer assigned).
     */
    public function deleteBrandMapping(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'brand_id' => 'required|exists:brands,id',
            'seller_id' => 'required|exists:sellers,id',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        BrandDistributorMapping::where('brand_id', $request->brand_id)
            ->where('seller_id', $request->seller_id)
            ->delete();

        return CommonHelper::responseSuccess('brand_mapping_removed_successfully');
    }

    /**
     * Map specific geographic areas (Zones/Pincodes/Cities) to distributors.
     */
    public function saveGeoFences(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seller_id' => 'required|exists:sellers,id',
            'city_ids' => 'required|array',
            'city_ids.*' => 'exists:cities,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $seller = Seller::find($request->seller_id);
        $seller->city_id = implode(',', $request->city_ids);
        $seller->save();

        return CommonHelper::responseSuccess('Geo-fences updated successfully for distributor.');
    }
}
