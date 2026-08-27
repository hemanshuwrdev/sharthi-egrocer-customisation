<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AreaApiController extends Controller
{
    public function getAreas(Request $request)
    {
        $query = Area::with('city')->orderBy('id', 'desc');

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('pincode', 'like', '%' . $searchTerm . '%')
                    ->orWhere('state', 'like', '%' . $searchTerm . '%')
                    ->orWhere('district', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('city', function ($q) use ($searchTerm) {
                        $q->where('zone', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
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
            'city_id' => 'required|exists:cities,id',
            'name' => 'required',
            'pincode' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $area->city_id = $request->city_id;
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
        $area = Area::with('city')->find($id);

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
