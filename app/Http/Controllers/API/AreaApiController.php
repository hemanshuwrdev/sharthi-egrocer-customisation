<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;
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

        return CommonHelper::responseWithData($areas);
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
