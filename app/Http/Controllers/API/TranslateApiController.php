<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Services\LanguageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TranslateApiController extends Controller
{
    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function translateEmptyFields(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data'        => 'required|array',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError(
                $validator->errors()->first()
            );
        }

        try {
            $targetData = $request->input('data', []);

            $toTranslate = [];
            foreach (array_keys($targetData) as $field) {
                $sourceValue = $targetData[$field] ?? null;
                if (
                    !is_null($sourceValue) or
                    trim((string) $sourceValue) == ''
                ) {
                    $toTranslate[$field] = $sourceValue;
                }
            }

            if (empty($toTranslate)) {
                return CommonHelper::responseWithData([]);
            }

            $translations = CommonHelper::translate($toTranslate);

            if (empty($translations)) {
                return CommonHelper::responseWithData([]);
            }

            if (
                isset($translations[0]['error']) &&
                isset($translations[0]['error']['code'])
            ) {
                $error = $translations[0]['error'];

                return CommonHelper::responseError($error['message']);
            }

            return CommonHelper::responseWithData($translations);
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function translateOverwriteFields(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'data' => 'required|array',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError(
                $validator->errors()->first()
            );
        }

        try {
            $sourceData = $request->input('data', []);
            $toTranslate = [];
            foreach (array_keys($sourceData) as $field) {
                $sourceValue = $sourceData[$field] ?? null;
                if (
                    isset($sourceValue) &&
                    trim((string) $sourceValue) !== ''
                ) {
                    $toTranslate[$field] = $sourceValue;
                }
            }

            if (empty($toTranslate)) {
                return CommonHelper::responseError(
                    'No valid translatable fields found in source_data'
                );
            }

            $translations = CommonHelper::translate($toTranslate);

            if (empty($translations)) {
                return CommonHelper::responseWithData([]);
            }

            if (
                isset($translations[0]['error']) &&
                isset($translations[0]['error']['code'])
            ) {
                $error = $translations[0]['error'];

                return CommonHelper::responseError(
                    $error['message']
                );
            }

            return CommonHelper::responseWithData($translations);
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }
}
