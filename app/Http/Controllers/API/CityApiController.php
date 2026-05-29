<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Services\LanguageService;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CityApiController extends Controller
{

    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function getCities(Request $request)
    {

        $query = City::with('translations')->orderBy('id', 'desc');
        $limit = $request->get('limit', 5);
        $offset = $request->get('offset', 0);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('zone', 'like', '%' . $searchTerm . '%')
                    ->orWhere('state', 'like', '%' . $searchTerm . '%')
                    ->orWhere('formatted_address', 'like', '%' . $searchTerm . '%')
                    ->orWhere('latitude', 'like', '%' . $searchTerm . '%')
                    ->orWhere('longitude', 'like', '%' . $searchTerm . '%')
                    ->orWhere('max_deliverable_distance', 'like', '%' . $searchTerm . '%');
            });
        }

        $total = $query->count();

        if ($request->limit) {
            $limit = $request->get('limit');
            $offset = $request->get('offset', 0);
            $cities = $query->skip($offset)->take($limit)->get();
        } else {
            $cities = $query->get();
        }

        return CommonHelper::responseWithData([
            "total" => $total,
            "cities" => $cities
        ]);
    }

    public function save(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();
        $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

        if ($request->has('id') && $request->id != '') {

            $city = City::find($request->id);

            if (!$city) {
                return CommonHelper::responseError('City not found');
            }
        } else {

            if (!$isDefaultLanguage) {
                return CommonHelper::responseError('Please create city in default language first');
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'latitude' => 'required',
                'longitude' => 'required',
                'formatted_address' => 'required',
                'zone' => 'required',
            ]);

            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $city = new City();
        }

        // UPDATE BASE TABLE ONLY FOR DEFAULT LANGUAGE
        if ($isDefaultLanguage) {

            // Validate required fields for default language
            $validator = Validator::make($request->all(), [
                'time_to_travel' => 'required',
                'min_amount_for_free_delivery' => 'required',
                'delivery_charge_method' => 'required|in:fixed_charge,per_km_charge,range_wise_charges',
            ]);

            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $city->name = $request->name;
            $city->latitude = $request->latitude;
            $city->longitude = $request->longitude;
            $city->state = $request->state;
            $city->formatted_address = $request->formatted_address;
            $city->time_to_travel = $request->time_to_travel;
            $city->min_amount_for_free_delivery = $request->min_amount_for_free_delivery;
            $city->max_deliverable_distance = $request->max_deliverable_distance ?? 0;
            $city->delivery_charge_method = $request->delivery_charge_method;
            $city->fixed_charge = $request->fixed_charge ?? 0;
            $city->per_km_charge = $request->per_km_charge ?? 0;
            $city->range_wise_charges = $request->range_wise_charges;
            $city->boundary_points = $request->boundary_points;
            $city->geolocation_type = $request->geolocation_type;
            $city->radius = $request->radius;
            $city->zone = $request->zone;

            $city->save();
        }

        // SAVE TRANSLATION
        $city->saveTranslation($request->language_id, [
            'zone' => $request->zone
        ]);

        return CommonHelper::responseWithData([
            'id' => $city->id,
            'message' => __('city_saved_successfully')
        ]);
    }

    public function edit($id)
    {
        $city = City::with('translations')->find($id);

        if (!$city) {
            return CommonHelper::responseError('City not found');
        }

        return CommonHelper::responseWithData($city);
    }

    public function update(Request $request)
    {
        $defaultLanguage = app(\App\Services\LanguageService::class)->getDefaultLanguage();
        $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:cities,id',
            'language_id' => 'required|exists:languages,id',
            'zone' => 'required',
            'delivery_charge_method' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $city = City::find($request->id);

        if (!$city) {
            return CommonHelper::responseError('City not found');
        }

        if ($isDefaultLanguage) {

            $city->latitude = $request->latitude;
            $city->longitude = $request->longitude;
            $city->name = $request->name;
            $city->state = $request->state;
            $city->formatted_address = $request->formatted_address;
            $city->time_to_travel = $request->time_to_travel;
            $city->delivery_charge_method = $request->delivery_charge_method;
            $city->fixed_charge = $request->fixed_charge ?? 0;
            $city->per_km_charge = $request->per_km_charge ?? 0;
            $city->range_wise_charges = $request->range_wise_charges;
            $city->geolocation_type = $request->geolocation_type;
            $city->radius = $request->radius;
            $city->boundary_points = $request->boundary_points;
            $city->zone = $request->zone;

            $city->save();
        }

        $city->saveTranslation($request->language_id, [
            'zone' => $request->zone
        ]);

        return CommonHelper::responseSuccess('city_updated_successfully');
    }

    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $role = City::find($request->id);
            if ($role) {
                $role->delete();
                return CommonHelper::responseSuccess('city_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess('city_already_deleted');
            }
        }
    }
}
