<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class AreaApiController extends Controller
{
    public function getAreas(Request $request)
    {
        $query = Area::orderBy('id', 'desc');

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('pincode', 'like', '%' . $searchTerm . '%')
                    ->orWhere('state', 'like', '%' . $searchTerm . '%')
                    ->orWhere('district', 'like', '%' . $searchTerm . '%');
            });
        }

        $total = $query->count();

        if ($request->limit) {
            $limit = $request->get('limit');
            $offset = $request->get('offset', 0);
            $areas = $query->skip($offset)->take($limit)->get();
        } else {
            $areas = $query->get();
        }

        return CommonHelper::responseWithData([
            "total" => $total,
            "areas" => $areas
        ]);
    }

    public function searchByPincode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pincode' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $areas = Area::where('pincode', $request->pincode)
            ->where('status', 1)
            ->get();

        // Registration screen prefills "city" from this. Areas have no city of their own
        // (areas.city_id is a legacy delivery-zone link), so it comes from the postal data.
        if ($areas->isNotEmpty()) {
            $city = $this->cityForPincode($request->pincode);
            $areas->each(fn ($area) => $area->city = $city);
        }

        return CommonHelper::responseWithData($areas);
    }

    /**
     * City name for a pincode, from the postal API's "Block" (the sub-district / taluka — the
     * API has no city field, and "District" is a different, larger thing). A pincode can span
     * several blocks; the most common one wins, first one on a tie. Cached per pincode so the
     * registration screen doesn't wait on the external API each time. A failed lookup returns
     * null and is not cached, so the next request retries.
     */
    private function cityForPincode($pincode): ?string
    {
        $pincode = (string) $pincode;
        if (!preg_match('/^\d{6}$/', $pincode)) {
            return null;
        }

        $cacheKey = 'pincode_block_' . $pincode;
        $city = Cache::get($cacheKey);
        if ($city !== null) {
            return $city;
        }

        try {
            $response = Http::withHeaders(['User-Agent' => 'Mozilla/5.0'])
                ->timeout(5)
                ->get('https://api.postalpincode.in/pincode/' . $pincode);
        } catch (\Exception $e) {
            return null;
        }

        $result = $response->ok() ? ($response->json()[0] ?? null) : null;
        if (!$result || ($result['Status'] ?? null) !== 'Success' || empty($result['PostOffice'])) {
            return null;
        }

        $blocks = collect($result['PostOffice'])
            ->pluck('Block')
            ->map(fn ($block) => trim((string) $block))
            ->reject(fn ($block) => $block === '' || strtoupper($block) === 'NA');

        // countBy() keeps first-seen order and max() keeps the first maximum, so ties go to the earliest.
        $counts = $blocks->countBy();
        $city = $counts->isEmpty() ? null : $counts->search($counts->max());

        if ($city !== null) {
            Cache::put($cacheKey, $city, now()->addDays(30));
        }

        return $city;
    }

    public function lookupPincode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pincode' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $response = Http::withHeaders(['User-Agent' => 'Mozilla/5.0'])
                ->timeout(5)
                ->get('https://api.postalpincode.in/pincode/' . $request->pincode);
        } catch (\Exception $e) {
            return CommonHelper::responseError('pincode_lookup_failed');
        }

        $result = $response->json()[0] ?? null;

        if (!$response->ok() || !$result || $result['Status'] !== 'Success' || empty($result['PostOffice'])) {
            return CommonHelper::responseError('invalid_pincode');
        }

        $postOffice = $result['PostOffice'][0];

        return CommonHelper::responseWithData([
            'state' => $postOffice['State'],
            'district' => $postOffice['District'],
        ]);
    }

    public function save(Request $request)
    {
        if ($request->has('id') && $request->id != '') {
            $area = Area::find($request->id);

            if (!$area) {
                return CommonHelper::responseError('Area not found');
            }
        } else {
            $area = new Area();
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'pincode' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $area->name = $request->name;
        $area->pincode = $request->pincode;
        $area->state = $request->state;
        $area->district = $request->district;
        $area->status = $request->has('status') ? $request->status : 1;
        $area->save();

        return CommonHelper::responseWithData([
            'id' => $area->id,
            'message' => __('area_saved_successfully')
        ]);
    }

    public function edit($id)
    {
        $area = Area::find($id);

        if (!$area) {
            return CommonHelper::responseError('Area not found');
        }

        return CommonHelper::responseWithData($area);
    }

    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $area = Area::find($request->id);
            if ($area) {
                $area->delete();
                return CommonHelper::responseSuccess('area_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess('area_already_deleted');
            }
        }
    }
}
