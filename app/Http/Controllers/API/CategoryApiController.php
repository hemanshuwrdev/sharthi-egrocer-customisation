<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\LanguageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CategoryApiController extends Controller
{
    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function getCategories(Request $request)
    {
        try {

            $useContentLanguage = $request->header('Content-Language') !== null
                && trim((string) $request->header('Content-Language')) !== '';

            if (isset(auth()->user()->seller->id) && auth()->user()->seller->id != null && auth()->user()->role_id == 3) {
                $limit = $request->input('limit');
                $offset = $request->input('offset', 0);
                $filter = $request->input('search', '');

                $category_id = $request->get('category_id', 0);
                $category_slug = $request->get('slug');

                $seller = auth()->user()->seller;
                $sellerCategoryIds = explode(",", $seller->categories);

                if (isset($category_slug) && !empty($category_slug)) {
                    $category = Category::where('status', 1)->where('slug', $category_slug)->whereIn('id', $sellerCategoryIds)->first();
                    if (!$category) {
                        return CommonHelper::responseError('no_category_found');
                    }
                    $categories = Category::where('status', 1)->where('parent_id', $category->id);
                } else {
                    if ($category_id > 0) {
                        $hasAccess = false;

                        if (in_array($category_id, $sellerCategoryIds)) {
                            $hasAccess = true;
                        } else {
                            $categoryMap = Category::select('id', 'parent_id')
                                ->where('status', 1)
                                ->get()
                                ->keyBy('id');

                            $currentCategory = $categoryMap->get($category_id);
                            if ($currentCategory && $currentCategory->parent_id != 0) {
                                $parentIds = [];
                                $tempCategory = $currentCategory;
                                $maxDepth = 20;
                                $depth = 0;

                                while ($tempCategory && $tempCategory->parent_id != 0 && $depth < $maxDepth) {
                                    $parentIds[] = $tempCategory->parent_id;
                                    $tempCategory = $categoryMap->get($tempCategory->parent_id);
                                    $depth++;
                                    if (!$tempCategory)
                                        break;
                                }

                                if (!empty($parentIds)) {
                                    $hasAccess = !empty(array_intersect($parentIds, $sellerCategoryIds));
                                }
                            }
                        }

                        if (!$hasAccess) {
                            return CommonHelper::responseError('no_category_found');
                        }

                        $childIdsQuery = Category::where('status', 1)
                            ->where('parent_id', $category_id);

                        // Restrict children to seller's allowed categories (if configured)
                        if (!empty($sellerCategoryIds)) {
                            $childIdsQuery->whereIn('id', $sellerCategoryIds);
                        }

                        $childIds = $childIdsQuery->pluck('id')->toArray();
                        $allIds = array_unique(array_merge([$category_id], $childIds));

                        $categories = Category::where('status', 1)
                            ->whereIn('id', $allIds);
                    } else {
                        $categories = Category::where('status', 1)->whereIn('id', $sellerCategoryIds);
                    }
                }

                if ($filter) {
                    $categories = $categories->where(function ($query) use ($filter) {
                        $query->where('name', 'like', "%{$filter}%")
                            ->orWhere('subtitle', 'like', "%{$filter}%");
                    });
                }

                $total = $categories->count();

                if (!$useContentLanguage) {
                    $categories = $categories->with('translations');
                }
                if (isset($limit) && $limit > 0) {
                    $categories = $categories->orderBy('row_order', 'ASC')
                        ->offset($offset)
                        ->limit($limit)
                        ->get(['id', 'name', 'subtitle', 'slug', 'image']);
                } else {
                    $categories = $categories->orderBy('row_order', 'ASC')
                        ->get(['id', 'name', 'subtitle', 'slug', 'image']);
                }

                // For specific category tree (when category_id is passed), keep has_child / has_active_child
                if ($category_id == 0) {
                    $categories = $categories->makeHidden(['image', 'has_child', 'has_active_child']);
                } else {
                    $categories = $categories->makeHidden(['image']);

                    $categories = $categories->map(function ($category) {
                        $hasActiveChild = Category::where('status', 1)
                            ->where('parent_id', $category->id)
                            ->exists();

                        $categoryArray = $category->toArray();
                        $categoryArray['has_child'] = $hasActiveChild;
                        $categoryArray['has_active_child'] = $hasActiveChild;

                        return $categoryArray;
                    });
                }

                if (count($categories) > 0) {
                    return CommonHelper::responseWithData($categories, $total);
                } else {
                    return CommonHelper::responseError('no_category_found');
                }
            } else {
                $limit = $request->input('limit');
                $offset = (($request->input('offset')) - 1) * $limit;
                $filter = $request->input('filter', '');
                $categoryId = $request->input('id');
                $statusFilter = $request->input('status');

                $categoriesQuery = Category::orderBy('id', 'DESC');

                // Optionally filter by status (e.g. status=1 for active-only dropdowns)
                if (!is_null($statusFilter)) {
                    $categoriesQuery = $categoriesQuery->where('status', $statusFilter);
                }

                // Filter by id if provided (for edit modal)
                if ($categoryId) {
                    $categoriesQuery = $categoriesQuery->where('id', $categoryId);
                }

                if ($filter) {
                    $categoriesQuery = $categoriesQuery->where(function ($query) use ($filter) {
                        $query->where('name', 'like', "%{$filter}%")
                            ->orWhere('subtitle', 'like', "%{$filter}%");
                    });
                }
                $total = $categoriesQuery->count();
                if (!$useContentLanguage) {
                    $categoriesQuery = $categoriesQuery->with('translations');
                }
                if (isset($limit) && !is_null($limit)) {
                    $categories = $categoriesQuery->orderBy('id', 'desc')->skip($offset)->take($limit)->get();
                } else {
                    $categories = $categoriesQuery->orderBy('id', 'desc')->get();
                }

                if ($categories->isEmpty()) {
                    return CommonHelper::responseWithData([], 0);
                }

                $categories->makeHidden(['has_child', 'has_active_child']);

                return CommonHelper::responseWithData($categories, $total);
            }
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function getMainCategories(Request $request)
    {
        $categories = CommonHelper::getMainCategories($request);
        $total = $categories->count();
        if (empty($categories)) {
            return CommonHelper::responseError('category_not_found');
        }
        return CommonHelper::responseWithData($categories, $total);
    }
    public function getCategoriesByRowOrder()
    {
        $categories = Category::where('parent_id', 0)
            ->where('status', 1)    
            ->with('translations')
            ->orderBy('row_order', 'ASC')
            ->get();
        $categories->makeHidden(['has_child', 'has_active_child']);
        return CommonHelper::responseWithData($categories);
    }
    public function save(Request $request)
    {
        // Get default language to check if this is default language save
        $defaultLanguage = $this->languageService->getDefaultLanguage();
        $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

        $rules = [
            'name' => 'required',
            'subtitle' => 'required',
            'language_id' => 'required|exists:languages,id'
        ];
        if ($isDefaultLanguage) {
            $rules['name'] = 'required';
            $rules['subtitle'] = 'required';
            $rules['image'] = 'required|mimes:jpeg,jpg,png,gif,webp,svg';
        } else {
            $rules['name'] = 'nullable';
            $rules['subtitle'] = 'nullable';
            $rules['image'] = 'nullable|mimes:jpeg,jpg,png,gif,webp,svg';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if ($request->has('slug') && !empty($request->slug)) {
            $slug = $request->slug;
        } else {
            // Generate slug from name
            $slug = preg_replace('/\s+/', '-', trim(
                preg_replace('/[^A-Za-z0-9 ]/', '', $request->name)
            ));

            // Ensure slug uniqueness
            $count = Category::where('slug', $slug)->count();
            if ($count > 0) {
                $slug .= '-' . ($count + 1);
            }
        }

        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            $category = new Category();
            $category->slug = $slug;
            $category->status = $request->status ?? 1;
            $category->parent_id = $request->parent_id ?? 0;
            $category->web_image = '';

            $image = '';
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('categories', $file, $fileName);
            }
            $category->image = $image;

            $category->name = $request->name;
            $category->subtitle = $request->subtitle;
            $category->meta_title = $request->meta_title ?? "";
            $category->meta_keywords = $request->meta_keywords ?? "";
            $category->schema_markup = $request->schema_markup ?? "";
            $category->meta_description = $request->meta_description ?? "";

            $category->save();
        }

        $translationData = [
            'name' => $request->name,
            'subtitle' => $request->subtitle,
            'meta_title' => $request->meta_title ?? "",
            'meta_keywords' => $request->meta_keywords ?? "",
            'schema_markup' => $request->schema_markup ?? "",
            'meta_description' => $request->meta_description ?? "",
        ];

        $category->saveTranslation($request->language_id, $translationData);

        return CommonHelper::responseWithData([
            'id' => $category->id,
            'message' => __('category_saved_successfully')
        ]);
    }
    public function update(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();
        $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

        $rules = [
            'id' => 'required|exists:categories,id',
            'language_id' => 'required|exists:languages,id'
        ];
        if ($isDefaultLanguage) {
            $rules['name'] = 'required';
            $rules['subtitle'] = 'required';
        } else {
            $rules['name'] = 'nullable';
            $rules['subtitle'] = 'nullable';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $category = Category::find($request->id);
        if (!$category) {
            return CommonHelper::responseError('category_not_found');
        }

        if ($isDefaultLanguage && $request->has('slug')) {
            $category->slug = $request->slug;
        }

        if ($isDefaultLanguage) {
            $category->status = $request->status ?? $category->status;
            $category->parent_id = $request->parent_id ?? $category->parent_id;
        }

        if ($request->hasFile('image')) {
            // Delete old image
            @Storage::disk('public')->delete($category->image);

            // Upload new image
            $file = $request->file('image');
            $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
            $image = Storage::disk('public')->putFileAs('categories', $file, $fileName);
            $category->image = $image;
        }

        if ($isDefaultLanguage) {
            $category->name = $request->name;
            $category->subtitle = $request->subtitle;
            $category->meta_title = $request->meta_title ?? "";
            $category->meta_keywords = $request->meta_keywords ?? "";
            $category->schema_markup = $request->schema_markup ?? "";
            $category->meta_description = $request->meta_description ?? "";
        }

        $category->save();

        // Save/update translation for the specified language
        $translationData = [
            'name' => $request->name,
            'subtitle' => $request->subtitle,
            'meta_title' => $request->meta_title ?? "",
            'meta_keywords' => $request->meta_keywords ?? "",
            'schema_markup' => $request->schema_markup ?? "",
            'meta_description' => $request->meta_description ?? "",
        ];

        $category->saveTranslation($request->language_id, $translationData);

        return CommonHelper::responseSuccess('category_updated_successfully');
    }
    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $category = Category::find($request->id);
            if ($category) {
                @Storage::disk('public')->delete($category->image);
                $category->delete();
                return CommonHelper::responseSuccess('category_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess('category_already_deleted');
            }
        }
    }

    public function getOptions(Request $request)
    {
        echo "<option value='0' selected >" . __('select_category') . "</option>";
        $options = CommonHelper::categoryTree(0, '', null, array(), false, array(), $request->exclude_id, 0);
    }

    // New method to return categories as JSON with translations for ProductOrder
    public function getOptionsJson(Request $request)
    {
        $categories = Category::where('status', 1)
            ->with('translations')
            ->orderBy('row_order', 'ASC')
            ->get()
            ->makeHidden(['image_url', 'has_child', 'has_active_child', 'translations'])
            ->map(function ($category) {
                $categoryArray = $category->toArray();
                // Add translations from relation (not accessor)
                $categoryArray['translations'] = $category->getRelation('translations')->toArray();
                return $categoryArray;
            })
            ->toArray();

        return CommonHelper::responseWithData($categories);
    }

    public function getActiveCategories()
    {
        $categories = Category::where('status', 1)
            ->with('translations')
            ->orderBy('id', 'ASC')
            ->get();
        $categories->makeHidden(['has_child', 'has_active_child']);

        return CommonHelper::responseWithData($categories);
    }

    public function updateCategoriesOrder(Request $request)
    {
        $categories = $request->all();
        foreach ($categories as $key => $category) {
            $data = Category::find($category["id"]);
            $data->row_order = $category["row_order"];
            $data->save();
        }
        return CommonHelper::responseSuccess('category_order_updated_successfully');
    }
    public function countProductCategoryWise()
    {
        $rows = Category::query()
            ->select('categories.id', 'categories.name', DB::raw('COUNT(products.id) AS product_count'))
            ->leftJoin('products', 'products.category_id', '=', 'categories.id')
            ->where('categories.status', 1)
            ->groupBy('categories.id', 'categories.name')
            ->orderBy('categories.id', 'ASC')
            ->get();

        // Add category name as all-language translations (keyed by language code); fallback to default lang if missing
        $defaultLang = $this->languageService->getDefaultLanguage();
        $defaultCode = $defaultLang ? $this->languageService->getLanguageCode($defaultLang->id) : 'en';
        $activeLangCodes = collect($this->languageService->getActiveLanguages())->pluck('code')->filter()->values()->all();

        $categoriesWithTranslations = Category::whereIn('id', $rows->pluck('id'))->with('translations')->get()->keyBy('id');

        $categories = $rows->map(function ($c) use ($categoriesWithTranslations, $defaultCode, $activeLangCodes) {
            $nameByCode = [];
            $category = $categoriesWithTranslations->get($c->id);
            if ($category) {
                foreach ($category->getAllActiveLanguageTranslations() as $t) {
                    $code = $t['language_code'] ?? '';
                    if ($code !== '') {
                        $nameByCode[$code] = trim((string) ($t['name'] ?? ''));
                    }
                }
            }
            $defaultName = $nameByCode[$defaultCode] ?? $c->name ?? '';
            $name = (object) [];
            foreach ($activeLangCodes as $code) {
                $name->{$code} = ($nameByCode[$code] ?? '') !== '' ? $nameByCode[$code] : $defaultName;
            }
            if ((array) $name === []) {
                $name = (object) ['en' => $c->name ?? ''];
            }
            return [
                'id' => $c->id,
                'name' => $name,
                'product_count' => (int) $c->product_count,
            ];
        })->values();

        return CommonHelper::responseWithData($categories);
    }

    public function getSellerCategories(Request $request)
    {
        $sellerId = $request->input('seller_id');
        if (!$sellerId || (int) $sellerId === 0) {
            return CommonHelper::responseWithData('no_seller_found');
        }
        $html = CommonHelper::getSellerCategoriesOptionsHtml((int) $sellerId);
        return CommonHelper::responseWithData($html);
    }
    public function checkSlug($slug)
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
            return response()->json(['error' => __('an_error_occurred_while_checking_slug_uniqueness')], 500);
        }
    }
}
