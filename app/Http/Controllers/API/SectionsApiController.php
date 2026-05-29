<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Services\LanguageService;
use App\Helpers\CommonHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SectionsApiController extends Controller
{
    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function index()
    {
        $request = request();

        $query = Section::withAllTranslations()
            ->orderBy('id', 'DESC');

        if ($request->filled('id')) {
            $query->where('id', $request->id);
        }

        $sections = $query->get()->map(function ($section) {
            $defaultLangId = $this->languageService->getDefaultLanguage()->id;
            // Get default language translation
            $translationsCollection = $section->translations;
            $defaultTranslation = null;

            if ($translationsCollection && (is_array($translationsCollection) || is_object($translationsCollection))) {
                $translationsArray = is_array($translationsCollection)
                    ? $translationsCollection
                    : $translationsCollection->toArray();

                $defaultTranslation = collect($translationsArray)
                    ->firstWhere('language_id', $defaultLangId);
            }

            // Try to get from default translation first
            $title = '';
            $shortDescription = '';

            if ($defaultTranslation) {
                $title = $defaultTranslation['title'] ?? $defaultTranslation->title ?? '';
                $shortDescription = $defaultTranslation['short_description'] ?? $defaultTranslation->short_description ?? '';
            }

            if (empty($title)) {
                $title = $section->getOriginal('title')
                    ?? $section->getAttributes()['title']
                    ?? '';
            }
            if (empty($shortDescription)) {
                $shortDescription = $section->getOriginal('short_description')
                    ?? $section->getAttributes()['short_description']
                    ?? '';
            }

            // Ensure translations is always an array (even if empty)
            $translations = $section->translations;
            if (!is_array($translations)) {
                $translations = is_object($translations) ? $translations->toArray() : [];
            }

            return [
                'id' => $section->id,

                // Default language fields
                'title' => $section->title,
                'short_description' => $section->short_description,

                // Section config
                'product_type' => $section->product_type,
                'position' => $section->position,
                'category_ids' => json_decode($section->category_ids, true) ?? [],
                'product_ids'  => json_decode($section->product_ids, true) ?? [],

                'style_app' => $section->style_app,
                'style_web' => $section->style_web,

                'background_color_for_light_theme' =>
                $section->background_color_for_light_theme,

                'background_color_for_dark_theme' =>
                $section->background_color_for_dark_theme,

                // All translations
                'translations' => $section->translations ?? [],

                // Banner image URLs
                'banner_app_url' => $section->banner_app
                    ? asset('storage/' . $section->banner_app)
                    : null,
                'banner_web_url' => $section->banner_web
                    ? asset('storage/' . $section->banner_web)
                    : null,
            ];
        });

        return CommonHelper::responseWithData($sections);
    }

    public function save(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();
        $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

        $rules = [
            'language_id' => 'required|exists:languages,id',
        ];

        if ($isDefaultLanguage) {
            // Default language requires all fields
            $rules['title'] = 'required';
            $rules['short_description'] = 'required';
            $rules['product_type'] = 'required';
            $rules['position'] = 'required';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        DB::beginTransaction();

        try {

            // Find existing section
            $section = null;
            if ($request->id) {
                $section = Section::find($request->id);
            }

            // CREATE BASE RECORD IF NOT EXISTS
            if (!$section) {

                if (!$isDefaultLanguage) {
                    return CommonHelper::responseError(
                        'Please create section in default language first.'
                    );
                }

                $bannerAppPath = null;
                $bannerWebPath = null;

                if ($request->hasFile('banner_app')) {
                    $file = $request->file('banner_app');
                    $fileName = time() . '_app_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
                    $bannerAppPath = $file->storeAs('sections', $fileName, 'public');
                }

                if ($request->hasFile('banner_web')) {
                    $file = $request->file('banner_web');
                    $fileName = time() . '_web_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
                    $bannerWebPath = $file->storeAs('sections', $fileName, 'public');
                }

                $section = Section::create([
                    'title' => $request->title,
                    'short_description' => $request->short_description,
                    'product_type' => $request->product_type,
                    'position' => $request->position,
                    'category_ids' => json_encode($request->category_ids ?? []),
                    'product_ids' => json_encode($request->product_ids ?? []),
                    'style_app' => $request->style_app ?? 'style_1',
                    'style_web' => $request->style_web ?? 'style_1',
                    'banner_app' => $bannerAppPath,
                    'banner_web' => $bannerWebPath,
                    'background_color_for_light_theme' => $request->background_color_for_light_theme ?? '',
                    'background_color_for_dark_theme' => $request->background_color_for_dark_theme ?? '',
                ]);
            } else {

                if ($isDefaultLanguage) {

                    $section->product_type = $request->product_type;
                    $section->position = $request->position;
                    $section->category_ids = json_encode($request->category_ids ?? []);
                    $section->product_ids = json_encode($request->product_ids ?? []);
                    $section->style_app = $request->style_app ?? 'style_1';
                    $section->style_web = $request->style_web ?? 'style_1';
                    $section->background_color_for_light_theme = $request->background_color_for_light_theme;
                    $section->background_color_for_dark_theme = $request->background_color_for_dark_theme;

                    if ($request->hasFile('banner_app')) {
                        $file = $request->file('banner_app');
                        $fileName = time() . '_app_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
                        $section->banner_app = $file->storeAs('sections', $fileName, 'public');
                    }

                    if ($request->hasFile('banner_web')) {
                        $file = $request->file('banner_web');
                        $fileName = time() . '_web_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
                        $section->banner_web = $file->storeAs('sections', $fileName, 'public');
                    }

                    $section->title = $request->title;
                    $section->short_description = $request->short_description;

                    $section->save();
                }
            }

            // Save translation (for all languages)
            $section->saveTranslation($request->language_id, [
                'title' => $request->title,
                'short_description' => $request->short_description,
            ]);

            DB::commit();

            return CommonHelper::responseWithData([
                'id' => $section->id,
                'message' => __('section_saved_successfully')
            ]);
        } catch (\Exception $e) {

            DB::rollback();
            return CommonHelper::responseError($e->getMessage());
        }
    }


    public function update(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();
        $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

        $rules = [
            'id' => 'required|exists:sections,id',
            'language_id' => 'required|exists:languages,id',
        ];

        if ($isDefaultLanguage) {
            $rules['title'] = 'required';
            $rules['short_description'] = 'required';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return CommonHelper::responseError(
                $validator->errors()->first()
            );
        }

        $section = Section::find($request->id);

        if (!$section) {
            return CommonHelper::responseError('section_not_found');
        }

        if ($isDefaultLanguage) {

            $updateData = [
                'title' => $request->title,
                'short_description' => $request->short_description,
                'product_type' => $request->product_type,
                'position'     => $request->position,
                'category_ids' => json_encode($request->category_ids ?? []),
                'product_ids'  => json_encode($request->product_ids ?? []),
                'style_app'    => $request->style_app ?? 'style_1',
                'style_web'    => $request->style_web ?? 'style_1',
                'background_color_for_light_theme' =>
                    $request->background_color_for_light_theme ?? '',
                'background_color_for_dark_theme' =>
                    $request->background_color_for_dark_theme ?? '',
            ];

            if ($request->hasFile('banner_app')) {
                $file = $request->file('banner_app');
                $fileName = time() . '_app_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
                $updateData['banner_app'] = $file->storeAs('sections', $fileName, 'public');
            }

            if ($request->hasFile('banner_web')) {
                $file = $request->file('banner_web');
                $fileName = time() . '_web_' . rand(1000, 9999) . '.' . $file->getClientOriginalExtension();
                $updateData['banner_web'] = $file->storeAs('sections', $fileName, 'public');
            }

            $section->update($updateData);
        }


        $section->saveTranslation($request->language_id, [
            'title' => $request->title,
            'short_description' => $request->short_description,
        ]);

        return CommonHelper::responseSuccess(
            'section_updated_successfully'
        );
    }

    public function delete(Request $request)
    {
        $section = Section::find($request->id);

        if (!$section) {
            return CommonHelper::responseError('section_not_found');
        }

        $section->delete();

        return CommonHelper::responseSuccess(
            'section_deleted_successfully'
        );
    }
}
