<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandDistributorMapping;
use App\Models\Seller;
use Illuminate\Http\Request;
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
