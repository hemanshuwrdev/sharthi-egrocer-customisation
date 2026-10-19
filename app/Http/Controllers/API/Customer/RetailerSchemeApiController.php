<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\BrandDistributorMapping;
use App\Models\SellerProduct;
use App\Services\SchemeListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * Sarthi: running schemes (offers) visible to a retailer at a given lat/long.
 */
class RetailerSchemeApiController extends Controller
{
    /**
     * GET customer/schemes
     * Required: latitude, longitude.
     * Optional: seller_id (one distributor), type, filter (name search), limit/offset.
     *
     * A scheme is listed when its distributor serves the retailer's city AND eligibility passes
     * (CommonHelper::filterEligibleSellerIds) AND at least one of its products is something
     * customer/products would show — same brand/line mapping and live-product rules.
     */
    public function listSchemes(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude'  => 'required',
            'longitude' => 'required',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $cityIds = CommonHelper::getDeliverableZoneCityIds($request->latitude, $request->longitude);
        if (empty($cityIds)) {
            return CommonHelper::responseWithData([], 0);
        }

        $limit  = max(1, (int) $request->input('limit', $request->input('per_page', 25)));
        $offset = max(0, (int) $request->input('offset', 0));

        $mappings  = BrandDistributorMapping::whereIn('city_id', $cityIds)->get(['brand_id', 'brand_line_id', 'seller_id']);
        $sellerIds = CommonHelper::filterEligibleSellerIds($mappings->pluck('seller_id')->unique()->values());

        $sellerIdFilter = (int) $request->input('seller_id', 0);
        if ($sellerIdFilter > 0) {
            $sellerIds = $sellerIds->filter(fn ($id) => (int) $id === $sellerIdFilter)->values();
        }
        if ($sellerIds->isEmpty()) {
            return CommonHelper::responseWithData([], 0);
        }

        // Which product lines each (brand, seller) pair may sell here — NULL entry = all lines.
        $allowedLinesByPair = $mappings->groupBy(fn ($m) => $m->brand_id . '_' . $m->seller_id)
            ->map(fn ($rows) => $rows->pluck('brand_line_id')->all());

        $isOrderable = function (SellerProduct $sp) use ($allowedLinesByPair) {
            if (!SchemeListing::isLive($sp)) {
                return false;
            }
            $master = $sp->masterProductVariant->masterProduct;
            $lines  = $allowedLinesByPair[$master->brand_id . '_' . $sp->seller_id] ?? null;

            return $lines !== null
                && BrandDistributorMapping::lineIsCovered($lines, $master->brand_line_id !== null ? (int) $master->brand_line_id : null);
        };

        $schemes = SchemeListing::runningQuery(
            $sellerIds,
            trim((string) $request->input('type', '')) ?: null,
            trim((string) $request->input('filter', ''))
        )->get()
            ->map(fn ($s) => SchemeListing::format($s, $isOrderable))
            ->filter()
            ->values();

        return CommonHelper::responseWithData($schemes->slice($offset, $limit)->values(), $schemes->count());
    }
}
