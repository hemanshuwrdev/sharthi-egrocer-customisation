<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use App\Services\LanguageService;
use App\Helpers\CommonHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class UnitApiController extends Controller
{
    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function index()
    {
        $request = request();

        $query = Unit::with('translations')
            ->orderBy('id', 'DESC');

        if ($request->filled('id')) {
            $query->where('id', $request->id);
        }

        $units = $query->get();

        return CommonHelper::responseWithData($units);
    }

    public function save(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();

        $rules = [
            'language_id' => 'required|exists:languages,id',
            'name' => 'required',
            'short_code' => 'required',
        ];

        if ($request->language_id == $defaultLanguage->id) {
            $rules['conversion'] = 'required|numeric|min:1';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if ($request->language_id != $defaultLanguage->id) {
            return CommonHelper::responseError('default_language_required_first');
        }

        $unit = Unit::create([
            'name' => $request->name,
            'short_code' => $request->short_code,
            'parent_id' => $request->parent_id ?? 0,
            'conversion' => $request->conversion,
        ]);

        $unit->saveTranslation($request->language_id, [
            'name' => $request->name,
            'short_code' => $request->short_code,
        ]);

        return CommonHelper::responseWithData([
            'id' => $unit->id,
            'message' => __('unit_saved_successfully'),
        ]);
    }

    public function update(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();

        $rules = [
            'id' => 'required|exists:units,id',
            'language_id' => 'required|exists:languages,id',
        ];

        if ($request->language_id == $defaultLanguage->id) {
            $rules['name'] = 'required';
            $rules['short_code'] = 'required';
        } else {
            $rules['name'] = 'nullable';
            $rules['short_code'] = 'nullable';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $unit = Unit::find($request->id);

        if (!$unit) {
            return CommonHelper::responseError('unit_not_found');
        }
        $defaultLanguage = $this->languageService->getDefaultLanguage();
        if ((int) $request->language_id === (int) $defaultLanguage->id) {
            $unit->name = $request->name;
            $unit->short_code = $request->short_code;
            $unit->parent_id = $request->parent_id ?? $unit->parent_id;

            if ($request->language_id == $defaultLanguage->id && $request->has('conversion')) {
                $unit->conversion = $request->conversion;
            }

            $unit->save();
        }

        $unit->saveTranslation($request->language_id, [
            'name' => $request->name ?? '',
            'short_code' => $request->short_code ?? '',
        ]);

        return CommonHelper::responseSuccess('unit_updated_successfully');
    }

    public function delete(Request $request)
    {
        $unit = Unit::find($request->id);

        if ($unit) {
            $unit->delete();
        }

        return CommonHelper::responseSuccess('unit_deleted_successfully');
    }

    public function getUnits(Request $request)
    {
        $limit = $request->get('limit');
        $offset = $request->get('offset');
        $total = Unit::count();
        $query = Unit::orderBy('id', 'ASC');
        if ($limit > 0) {
            $query->skip($offset)->take($limit);
        }
        $units = $query->get();
        return CommonHelper::responseWithData($units, $total);
    }
}

