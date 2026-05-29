<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Services\LanguageService;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CountryApiController extends Controller
{

    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function index()
    {
        $request = request();

        if ($request->id) {

            $country = Country::with('translations')
                ->where('id', $request->id)
                ->first();

            if (!$country) {
                return CommonHelper::responseError('Country not found');
            }

            return CommonHelper::responseWithData($country);
        }

        $countries = Country::with('translations')
            ->orderBy('id', 'asc')
            ->get();

        return CommonHelper::responseWithData($countries);
    }

    public function getCountries(Request $request)
    {
        $limit = $request->get('limit', 5);
        $offset = $request->get('offset', 0);

        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';

        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        $query = Country::where('status', 1)->with('translations')->orderBy('id', 'asc');

        $total = $query->count();

        $countries = $query->skip($offset)->take($limit)->get();

        if ($useContentLanguage) {
            $langId = app(LanguageService::class)->getCurrentId();
            $translatableFields = (function () {
                return $this->getTranslatableAttributes();
            })->call($countries->first() ?? new Country());

            $countries = $countries->map(function ($country) use ($langId, $translatableFields) {
                $translation = $country->getRelation('translations')->where('language_id', $langId)->first();

                $transData = ['language_id' => $langId];
                foreach ($translatableFields as $field) {
                    $transData[$field] = ($translation && !empty($translation->$field))
                        ? $translation->$field
                        : ($country->getAttributeValue($field) ?? '');
                }

                $countryArray = $country->toArray();
                $countryArray['translations'] = $transData;
                return $countryArray;
            });
        }

        return CommonHelper::responseWithData($countries, $total);
    }

    public function active(Request $request)
    {
        $countries = Country::where('status', 1)->orderBy('id', 'asc')->get();
        return CommonHelper::responseWithData($countries);
    }

    public function save(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();

        $translations = json_decode($request->translations, true);

        if (
            !$translations ||
            !isset($translations[$defaultLanguage->id]['name']) ||
            trim($translations[$defaultLanguage->id]['name']) == ''
        ) {
            return CommonHelper::responseError(__('default_language_required'));
        }

        $validator = Validator::make($request->all(), [
            'dial_code' => 'required',
            'code' => 'required',
            'logo' => 'required|file',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $country = new Country();
        $country->dial_code = $request->dial_code;
        $country->code = $request->code;
        $country->status = $request->status ?? 1;

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
            $logo = Storage::disk('public')->putFileAs('countries', $file, $fileName);
            $country->logo = $logo;
        } else {
            $country->logo = null;
        }

        // Save default name in base table
        $country->name = $translations[$defaultLanguage->id]['name'];

        $country->save();

        // Save translations
        foreach ($translations as $languageId => $data) {
            $country->saveTranslation($languageId, [
                'name' => $data['name'] ?? ''
            ]);
        }

        return CommonHelper::responseSuccess('country_saved_successfully');
    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:countries,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $country = Country::find($request->id);

        $translations = json_decode($request->translations, true);

        $defaultLanguage = $this->languageService->getDefaultLanguage();

        $country->dial_code = $request->dial_code ?? $country->dial_code;
        $country->code = $request->code ?? $country->code;
        $country->status = $request->status ?? $country->status;

        if ($request->hasFile('logo')) {
            @Storage::disk('public')->delete($country->logo);

            $file = $request->file('logo');
            $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
            $logo = Storage::disk('public')->putFileAs('countries', $file, $fileName);
            $country->logo = $logo;
        }

        // Update base name from default language
        if (isset($translations[$defaultLanguage->id]['name'])) {
            $country->name = $translations[$defaultLanguage->id]['name'];
        }

        $country->save();

        foreach ($translations as $languageId => $data) {
            $country->saveTranslation($languageId, [
                'name' => $data['name'] ?? ''
            ]);
        }

        return CommonHelper::responseSuccess('country_updated_successfully');
    }

    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $country = Country::find($request->id);
            if ($country) {

                $country->delete();
                return CommonHelper::responseSuccess('country_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess("Country Already Deleted!");
            }
        }
    }
}
