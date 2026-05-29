<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Services\LanguageService;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\SeoSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SeoSettingsApiController extends Controller
{

    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function getSeoSettings(Request $request)
    {
        try {
            $limit  = $request->input('limit');
            $offset = (($request->input('offset', 1)) - 1) * $limit;
            $filter = $request->input('filter', '');

            $query = SeoSetting::with('translations')->orderBy('id', 'DESC');

            if ($filter) {
                $query->where('page_type', 'like', "%{$filter}%")
                    ->orWhereHas('translations', function ($q) use ($filter) {
                        $q->where('meta_title', 'like', "%{$filter}%")
                            ->orWhere('meta_description', 'like', "%{$filter}%");
                    });
            }

            $total = $query->count();

            if ($limit) {
                $seoSettings = $query->skip($offset)->take($limit)->get();
            } else {
                $seoSettings = $query->get();
            }

            return CommonHelper::responseWithData($seoSettings, $total);
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function save(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();
        $isDefault = $request->language_id == $defaultLanguage->id;

        $rules = [
            'page_type'   => 'required|string|max:255',
            'language_id' => 'required|exists:languages,id',
        ];

        if ($isDefault) {
            $rules['og_image'] = 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $existingSeo = SeoSetting::where('page_type', $request->page_type)->first();
        if ($existingSeo) {
            return CommonHelper::responseError(__('page_type_already_exists'));
        }

        $seo = new SeoSetting();
        $seo->page_type = $request->page_type;

        if ($request->hasFile('og_image')) {
            $file = $request->file('og_image');
            $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
            $seo->og_image = Storage::disk('public')->putFileAs('seo_settings', $file, $fileName);
        }

        $seo->save();

        $translationData = [
            'meta_title'       => $request->meta_title ?? '',
            'meta_keyword'     => $request->meta_keyword ?? '',
            'schema_markup'    => $request->schema_markup ?? '',
            'meta_description' => $request->meta_description ?? '',
        ];


        if ($isDefault) {
            $seo->meta_title       = $translationData['meta_title'];
            $seo->meta_keyword     = $translationData['meta_keyword'];
            $seo->schema_markup    = $translationData['schema_markup'];
            $seo->meta_description = $translationData['meta_description'];
            $seo->save();
        }

        $seo->saveTranslation($request->language_id, $translationData);

        return CommonHelper::responseWithData($seo, __('seo_setting_saved_successfully'));
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id'          => 'required|exists:web_seo_pages,id',
            'language_id' => 'required|exists:languages,id',
            'page_type'   => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $seo = SeoSetting::find($request->id);
        if (!$seo) {
            return CommonHelper::responseError(__('page_not_found'));
        }

        // When changing page_type, ensure it does not already exist on another record
        $existingSeo = SeoSetting::where('page_type', $request->page_type)->where('id', '!=', $request->id)->first();
        if ($existingSeo) {
            return CommonHelper::responseError(__('page_type_already_exists'));
        }

        $defaultLanguage = $this->languageService->getDefaultLanguage();
        $isDefault = $request->language_id == $defaultLanguage->id;

        if ($isDefault) {
            $seo->page_type = $request->page_type;

            if ($request->hasFile('og_image')) {
                @Storage::disk('public')->delete($seo->og_image);
                $file = $request->file('og_image');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $seo->og_image = Storage::disk('public')->putFileAs('seo_settings', $file, $fileName);
            }

            $seo->save();
        }

        $translationData = [
            'meta_title'       => $request->meta_title ?? '',
            'meta_keyword'     => $request->meta_keyword ?? '',
            'schema_markup'    => $request->schema_markup ?? '',
            'meta_description' => $request->meta_description ?? '',
        ];
        if ($isDefault) {
            $seo->meta_title       = $request->meta_title ?? '';
            $seo->meta_keyword     = $request->meta_keyword ?? '';
            $seo->schema_markup    = $request->schema_markup ?? '';
            $seo->meta_description = $request->meta_description ?? '';
            $seo->save();
        }

        $seo->saveTranslation($request->language_id, $translationData);

        return CommonHelper::responseWithData([
            'id' => $seo->id
        ], __('seo_setting_updated_successfully'));
    }

    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $SeoSetting = SeoSetting::find($request->id);
            if ($SeoSetting) {
                //@Storage::disk('public')->delete($SeoSetting->image);
                $SeoSetting->delete();
                return CommonHelper::responseSuccess(__('seo_setting_deleted_successfully'));
            } else {
                return CommonHelper::responseSuccess("SeoSetting Already Deleted!");
            }
        }
    }

    public function getOptions(Request  $request)
    {
        echo "<option value='0' selected >Select Category</option>";
        $options = CommonHelper::categoryTree(0, '', null, array(), false, array(), $request->exclude_id, 0);
    }

    public function updateCategoriesOrder(Request $request)
    {
        $categories = $request->all();
        foreach ($categories as $key => $category) {
            $data = Category::find($category["id"]);
            $data->row_order = $category["row_order"];
            $data->save();
        }
        return CommonHelper::responseSuccess(__('category_order_updated_successfully'));
    }
    public function countProductCategoryWise()
    {
        $categories = Category::select('id', 'name', DB::raw('(SELECT count(id) from `products` WHERE products.category_id = categories.id) AS product_count'))
            ->orderBy('id', 'ASC')->get();
        return CommonHelper::responseWithData($categories);
    }

    public function getSellerCategories(Request $request)
    {

        CommonHelper::categoryTree(0, '', null, array(), true, array(), '', $request->seller_id);
    }
    public function checkSlug(Request $request, $slug)
    {
        try {
            // Query the database to count the documents that match the slug pattern
            $existingDocumentCount = Category::where('slug', 'like', $slug . '%')->count();

            // Construct the response data
            $responseData = [
                'unique' => $existingDocumentCount === 0,
                'count' => $existingDocumentCount
            ];

            return response()->json($responseData);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while checking slug uniqueness'], 500);
        }
    }
}
