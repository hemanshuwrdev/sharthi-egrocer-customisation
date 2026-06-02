<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImages;
use App\Models\ProductVariant;
use App\Models\OrderItem;
use App\Models\Setting;
use App\Models\Tax;
use App\Models\Tag;
use App\Models\Unit;
use App\Models\Role;
use App\Services\LanguageService;
use App\Models\Section;
use App\Models\Country;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\IOFactory;

class ProductApisController extends Controller
{
    public function getProducts(Request $request)
    {
        $limit = $request->input('per_page'); // Default items per page
        $offset = (($request->input('page')) - 1) * $limit; // Default page
        $filter = $request->input('filter', ''); // Filter query

        if (!isset($request->type)) {
            $sellers = Seller::where('status', 1)
                ->select('id', 'name')
                ->with('translations')
                ->orderBy('id', 'DESC')
                ->get()
                ->makeHidden(['logo_url', 'national_identity_card_url', 'address_proof_url', 'categories_array', 'translations'])
                ->map(function ($seller) {
                    $sellerArray = $seller->toArray();
                    // Add translations from relation (not accessor)
                    $sellerArray['translations'] = $seller->getRelation('translations')->toArray();
                    return $sellerArray;
                })
                ->toArray();
        }

        // Load categories with ALL translations
        $categories = Category::where('status', 1)
            ->select('id', 'name')
            ->with('translations')
            ->orderBy('id', 'DESC')
            ->get()
            ->makeHidden(['image_url', 'has_child', 'has_active_child', 'translations'])
            ->map(function ($category) {
                $categoryArray = $category->toArray();
                // Add translations from relation (not accessor)
                $categoryArray['translations'] = $category->getRelation('translations')->toArray();
                return $categoryArray;
            })
            ->toArray();

        // Initialize an array to hold the where conditions
        $where = [];

        if (isset($request->is_approved) && $request->is_approved !== "") {
            $where[] = ['p.is_approved', '=', $request->is_approved];
        }

        if (isset($request->seller) && $request->seller !== "") {
            $where[] = ['p.seller_id', '=', $request->seller];
            // Get the assigned categories from the seller table
            $assignedCategories = Seller::where('id', $request->seller)->value('categories');

            // Convert the assigned categories into an array
            $categoryIds = explode(',', $assignedCategories);

            // Query the categories based on the assigned categories from the seller with ALL translations
            $categories = Category::whereIn('id', $categoryIds)
                ->with('translations')
                ->orderBy('id', 'DESC')
                ->get()
                ->makeHidden(['translations'])
                ->map(function ($category) {
                    $categoryArray = $category->toArray();
                    // Add translations from relation (not accessor)
                    $categoryArray['translations'] = $category->getRelation('translations')->toArray();
                    return $categoryArray;
                })
                ->toArray();
        }

        if (isset($request->category) && $request->category !== "") {
            $where[] = ['p.category_id', '=', $request->category];
        }

        // Packet products
        if (isset($request->type) && $request->type === 'packet_products') {
            $where[] = ['p.type', '=', 'packet'];
        }

        // Loose products
        if (isset($request->type) && $request->type === 'loose_products') {
            $where[] = ['p.type', '=', 'loose'];
        }

        // Sold Out
        if (isset($request->type) && $request->type === 'sold_out') {

            $where[] = ['pv.stock', '<=', 0];
            $where[] = ['pv.status', '=', 0];

            $where[] = ['p.is_unlimited_stock', '=', 0];
        }

        // Low Stock
        if (isset($request->type) && $request->type === 'low_stock') {
            $low_stock_limit = Setting::where('variable', 'low_stock_limit')->first();
            if ($low_stock_limit) {
                $where[] = ['pv.stock', '<=', $low_stock_limit['value']];
                $where[] = ['pv.status', '=', '1'];
                $where[] = ['p.is_unlimited_stock', '!=', '1'];
            }
        }

        $products = DB::table('products as p')->select(
            'p.id as id',
            'p.id as product_id',
            'p.name',
            'p.seller_id',
            'p.status',
            'p.tax_id',
            'p.image',
            's.name as seller_name',
            's.id as seller_id',
            'p.indicator',
            'p.is_approved',
            'p.manufacturer',
            'p.made_in',
            'p.return_status',
            'p.cancelable_status',
            'p.till_status',
            'pv.id as product_variant_id',
            'pv.price',
            'pv.discounted_price',
            'pv.measurement',
            'pv.status as pv_status',
            'pv.stock',
            'pv.stock_unit_id',
            DB::raw('(select short_code from units where units.id = pv.stock_unit_id) as stock_unit')
        )
            ->join('sellers as s', 'p.seller_id', '=', 's.id')
            ->join('product_variants as pv', 'p.id', '=', 'pv.product_id')
            ->join('units as u', 'pv.stock_unit_id', '=', 'u.id');

        // Add where conditions if any
        if (!empty($where)) {
            foreach ($where as $condition) {
                $products->where($condition[0], $condition[1], $condition[2]);
            }
        }
        $products = $products->orderBy('pv.id', 'desc');

        // Apply filter to all columns in all joined tables
        if ($filter) {
            $columns = [
                'p.id',
                'pv.id',
                'p.name',
                's.name',
                'pv.price',
                'pv.discounted_price',
                'pv.measurement',
                'pv.stock',
            ];

            $products = $products->where(function ($query) use ($filter, $columns) {
                foreach ($columns as $column) {
                    $query->orWhere($column, 'like', "%{$filter}%");
                }
            });
        }
        $total = $products->count();
        if (isset($limit)) {
            $products->limit($limit)->offset($offset);
        }
        $products = $products->get();

        // Load translations for products
        if ($products->isNotEmpty()) {
            $productIds = $products->pluck('product_id')->unique()->toArray();
            $productsWithTranslations = Product::whereIn('id', $productIds)
                ->with('translations')
                ->get()
                ->keyBy('id');

            // Attach translations to each product in the results
            $products = $products->map(function ($product) use ($productsWithTranslations) {
                $productModel = $productsWithTranslations->get($product->product_id);

                if ($productModel && $productModel->relationLoaded('translations')) {
                    $product->translations = $productModel->getRelation('translations')->toArray();
                } else {
                    $product->translations = [];
                }

                return $product;
            });
        }

        $data = array(
            "categories" => $categories,
            "products" => $products,

        );
        if (!isset($request->type)) {
            $data["sellers"] = $sellers;
        }

        return CommonHelper::responseWithData($data, $total);
    }

    public function getProducts_sellerapp(Request $request)
    {
        try {

            $currency = Setting::get_value('currency');
            $user_id = $request->user('api-customers') ? $request->user('api-customers')->id : '';

            $limit = ($request->limit) ?? 10;
            $offset = ($request->offset) ?? 0;

            $sort = ($request->sort) ?? 'row_order';
            $order = ($request->order) ?? 'asc';

            if ($sort == 'new') {
                $sort = 'created_at DESC';
                $price = 'MIN(discounted_price)';
                $price_sort = 'pv.discounted_price  ASC';
            } elseif ($sort == 'old') {
                $sort = 'created_at ASC';
                $price = 'MIN(discounted_price)';
                $price_sort = 'pv.discounted_price  ASC';
            } elseif ($sort == 'high') {

                $sort = 'max_price DESC';

                $price = 'MAX(if(pv.discounted_price > 0 && pv.discounted_price != 0, pv.discounted_price, pv.price))';
                $price_sort = 'if(pv.discounted_price > 0 && pv.discounted_price != 0, pv.discounted_price, pv.price) DESC';
            } elseif ($sort == 'low') {
                $sort = 'min_price ASC';

                $price = 'MIN(if(pv.discounted_price > 0 && pv.discounted_price != 0, pv.discounted_price, pv.price))';
                $price_sort = 'if(pv.discounted_price > 0 && pv.discounted_price != 0, pv.discounted_price, pv.price) ASC';
            } elseif ($sort == 'discount') {
                $sort = 'cal_discount_percentage DESC';
                $price = 'MIN(if(pv.discounted_price > 0 && pv.discounted_price != 0, pv.discounted_price, pv.price))';
                $price_sort = 'cal_discount_percentage DESC';
            } elseif ($sort == 'popular') {
                $sort = 'order_counter DESC';
                $price = 'MIN(pv.discounted_price)';
                $price_sort = 'order_counter DESC';
            } else {
                $sort = 'p.row_order ASC';
                $price = 'MIN(pv.discounted_price)';
                $price_sort = 'pv.id  ASC';
            }

            $category_id = $request->get('category_id');

            $seller_id = auth()->user()->seller->id;
            $brand_id = $request->get('brand_id');
            $seller_slug = '';
            $where = "";
            if (isset($request['search']) && $request['search'] != '') {
                $search = $request['search'];
                $where .= " AND ( p.`name` like '%" . $search . "%' OR p.`slug` like '%" . $search . "%' OR p.`tags` like '%" . $search . "%') ";
            }

            if (isset($request->section_id) && $request->section_id != "") {
                $section_id = $request->section_id;
                $section = Section::select("*")->where("id", "=", $section_id)->first();

                $product_ids = CommonHelper::getProductIdsSection($section);
                if ($product_ids !== "") {
                    $where .= "AND p.id IN  ($product_ids)";
                }
            }


            if (isset($request['seller_slug']) && !empty($request['seller_slug'])) {
                $seller_slug = $request['seller_slug'];
                if (isset($request['category_id']) && !empty($request['category_id']) && is_numeric($request['category_id'])) {
                    $seller_category = Seller::where('slug', $seller_slug)->first(['categories']);

                    if (!empty($seller_category)) {
                        $category = $seller_category['categories'];
                        $data = explode(",", $category);
                        $search = (in_array($category_id, $data, TRUE)) ? 1 : 2;
                        if ($search == 2) {
                            return CommonHelper::responseError('no_products_found');
                        } else {
                            $where .= " AND s.`slug` = '$seller_slug' AND p.`category_id` IN (" . $category_id . ") ";
                            Log::info('Seller Categories:', [$category]);
                        }
                    } else {
                        return CommonHelper::responseError('no_products_found');
                    }
                } else {
                    $seller_category = Seller::where('slug', $seller_slug)->first(['categories']);
                    if (!empty($seller_category)) {
                        $category = $seller_category['categories'];
                        $where .= " AND s.`slug` =  '$seller_slug' AND p.category_id IN (" . $category . " )";
                    } else {
                        return CommonHelper::responseError('no_products_found');
                    }
                }
            }

            if (isset($request['slug']) && !empty($request['slug'])) {
                $slug = $request['slug'];
                $where .= " AND p.`slug` =  '$slug' ";
            }

            if (isset($seller_id) && !empty($seller_id) && is_numeric($seller_id)) {

                if (isset($request['category_id']) && !empty($request['category_id']) && is_numeric($request['category_id'])) {
                    // dd([
                    //     'seller_id' => $seller_id,
                    //     'seller_category' => $seller_category,
                    //     'categories_raw' => $seller_category->categories ?? null,
                    // ]);
                    $seller_category = Seller::where('id', $seller_id)->first(['categories']);
                    if (!empty($seller_category)) {
                        // $category = $seller_category['categories'];
                        $category = $seller_category['categories'];

                        $categoryArray = explode(',', $category);

                        // dd([
                        //     'raw_category' => $category,
                        //     'category_array' => $categoryArray,
                        // ]);
                        $data = explode(",", $category);
                        $search = (in_array($category_id, $data, TRUE)) ? 1 : 2;
                        if ($search == 2) {
                            return CommonHelper::responseError('no_products_found');
                        } else {
                            $where .= " AND p.`seller_id` = " . $seller_id . " AND p.`category_id` IN (" . $category_id . ") ";
                        }
                    } else {
                        return CommonHelper::responseError('no_products_found');
                    }
                } else {

                    $seller_category = Seller::where('id', $seller_id)->first(['categories']);
                    if (!empty($seller_category)) {
                        $category = $seller_category['categories'];
                        if (!empty($category)) {
                            $where .= " AND p.`seller_id` = " . $seller_id . " AND p.category_id IN (" . $category . ")";
                        }
                    } else {
                        return CommonHelper::responseError('no_products_found');
                    }
                }
            }

            if (isset($request['category_id']) && !empty($request['category_id']) && is_numeric($request['category_id'])) {
                if (!isset($seller_id) && empty($seller_id) && !isset($request['seller_slug']) && empty($request['seller_slug'])) {
                    $where .= " AND p.`category_id`=" . $category_id;
                }
            }

            if (isset($request['category_id']) && !empty($request['category_id']) && is_numeric($request['category_id'])) {
                $where .= " AND p.`category_id`=" . $category_id;
            }

            if (isset($request['brand_id']) && !empty($request['brand_id']) && is_numeric($request['brand_id'])) {
                $where .= " AND p.`brand_id`=" . $brand_id;
            }

            $seller_id = $seller_id;

            $products = array();
            $i = 0;

            $products = Product::select('p.*', 'p.type as d_type', 's.store_name as seller_name', 's.slug as seller_slug', 's.status as seller_status')
                ->from('products as p')
                ->leftJoin('sellers as s', 'p.seller_id', '=', 's.id')
                ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
                ->whereIn('s.status', [1, 3])
                ->where('p.seller_id', $seller_id)

                ->groupBy("p.id");
            //  Safe category filter
            $seller_category = Seller::where('id', $seller_id)->first(['categories']);

            if (!empty($seller_category) && !empty($seller_category->categories)) {

                $categoryArray = array_filter(explode(',', $seller_category->categories));

                if (!empty($categoryArray)) {
                    $products->whereIn('p.category_id', $categoryArray);
                }
            }

            if (isset($request->min_price) && isset($request->max_price) && intval($request->max_price)) {
                $products = $products->havingRaw(" min_price > " . intval(intval($request->min_price) - 1) . " and max_price < " . intval(intval($request->max_price) + 1));
            }
            if (isset($request->search) && $request->search != '') {
                $search = $request->search;

                $products = $products->where(function ($query) use ($search) {
                    $query->where('p.name', 'like', '%' . $search . '%')
                        ->orWhere('p.slug', 'like', '%' . $search . '%')
                        ->orWhere('p.tags', 'like', '%' . $search . '%');
                });
            }

            if (isset($request->brand_ids) && $request->brand_ids != "") {
                $brand_ids = explode(",", $request->brand_ids);
                $products = $products->whereIn('p.brand_id', $brand_ids);
            }
            if (isset($request->sizes) && $request->sizes != "" && isset($request->unit_ids) && $request->unit_ids != "") {
                $sizes = explode(",", $request->sizes);
                $unit_ids = explode(",", $request->unit_ids);
                $products = $products->whereIn('pv.measurement', $sizes)->whereIn('pv.stock_unit_id', $unit_ids);
            }
            if (isset($request->is_approved) && $request->is_approved !== "") {
                $products = $products->where('p.is_approved', $request->is_approved);
            }

            $products_total = $products->count();

            $products = $products->orderByRaw($sort)->skip($offset)->take($limit)->get();

            $products = $products->makeHidden([
                'seller_id',
                'row_order',
                'return_status',
                'cancelable_status',
                'till_status',
                'description',
                'status',
                'return_days',
                'pincodes',
                'cod_allowed',
                'pickup_location',
                'tags',
                'd_type',
                'seller_name',
                'seller_slug',
                'seller_status',
                'created_at',
                'updated_at',
                'deleted_at',
                'image',
                'other_images'
            ]);

            $useContentLanguage = $request->header('Content-Language') !== null
                && trim((string) $request->header('Content-Language')) !== '';
            if ($useContentLanguage) {
                $langCode = trim($request->header('Content-Language'));
                $language = app(LanguageService::class)->getLanguageByCode($langCode);
                if ($language) {
                    app()->instance('lang_id', $language->id);
                    app()->setLocale($langCode);
                }
            }

            $productIds = $products->pluck('id')->toArray();
            $unitIds = ProductVariant::whereIn('product_id', $productIds)
                ->pluck('stock_unit_id')->filter()->unique()->values()->toArray();
            $unitsWithTranslations = !empty($unitIds)
                ? Unit::whereIn('id', $unitIds)->with('translations')->get()->keyBy('id')
                : collect();

            $i = 0;

            foreach ($products as $row) {

                $sql = ProductVariant::select(
                    '*',
                    DB::raw("(SELECT short_code FROM units u WHERE u.id=pv.stock_unit_id) as stock_unit_name")
                )
                    ->from('product_variants as pv')
                    ->where('pv.product_id', '=', $row['id'])
                    ->orderBy('pv.status', 'ASC');
                $variants = $sql->get();
                $variants = $variants->makeHidden(['product_id', 'status', 'measurement_unit_id', 'stock_unit_id', 'deleted_at']);
                if (empty($variants)) {
                    continue;
                }

                CommonHelper::getProductDetails($row['id'], $user_id, false);
                $variantArray = array();
                for ($k = 0; $k < count($variants); $k++) {
                    $variantData = CommonHelper::getProductVariant($variants[$k]['id'], $user_id);
                    $unitModel = $unitsWithTranslations->get($variants[$k]['stock_unit_id'] ?? 0);
                    $variantData['unit'] = $unitModel
                        ? [
                            'unit_id' => $unitModel->id,
                            'language_id' => app()->has('lang_id') ? app('lang_id') : null,
                            'name' => $unitModel->name ?? '',
                            'short_code' => $unitModel->short_code ?? '',
                        ]
                        : null;
                    array_push($variantArray, $variantData);
                }
                $products[$i]['variants'] = $variantArray;
                $i++;
            }
            $productSql = Product::from('products as p')->select(
                DB::raw('COUNT(p.id) AS total'),
                DB::raw('MIN((select MIN(if(discounted_price > 0, discounted_price, price)) from product_variants where product_variants.product_id = p.id)) as min_price'),
                DB::raw('MAX((select MAX(if(discounted_price > 0, discounted_price, price)) from product_variants where product_variants.product_id = p.id)) as max_price')
            )->leftJoin('product_variants as pv', 'pv.product_id', '=', 'p.id')->where('p.seller_id', $seller_id);
            // ✅ Safe category filter for stats query
            if (!empty($seller_category) && !empty($seller_category->categories)) {

                $categoryArray = array_filter(explode(',', $seller_category->categories));

                if (!empty($categoryArray)) {
                    $productSql->whereIn('p.category_id', $categoryArray);
                }
            }

            if (isset($request->min_price) && isset($request->max_price) && intval($request->max_price)) {
                $productSql = $productSql->havingRaw(" min_price > " . intval(intval($request->min_price) - 1) . " and max_price < " . intval(intval($request->max_price) + 1));
            }

            if (isset($request->brand_ids) && $request->brand_ids != "") {
                $brand_ids = explode(",", $request->brand_ids);
                $productSql = $productSql->whereIn('p.brand_id', $brand_ids);
            }
            if (isset($request->sizes) && $request->sizes != "" && isset($request->unit_ids) && $request->unit_ids != "") {
                $sizes = explode(",", $request->sizes);
                $unit_ids = explode(",", $request->unit_ids);
                $productSql = $productSql->whereIn('pv.measurement', $sizes)->whereIn('pv.stock_unit_id', $unit_ids);
            }

            // if ($where != "") {
            //     $productSql = $productSql->whereRaw(substr($where, 4));
            // }
            // if ($where != "") {

            //     //prevent empty IN ()
            //     if (strpos($where, 'IN ()') !== false) {
            //         // skip adding this condition
            //     } else {
            //         $productSql = $productSql->whereRaw(substr($where, 4));
            //     }
            // }
            //dd($productSql->toSql(), $productSql->getBindings());
            $productResult = $productSql->first();
            $total_min_price = $productResult->min_price;
            $total_max_price = $productResult->max_price;
            $total = $productResult->total;

            if (!empty($products)) {
                $brands = CommonHelper::getBrandsHavingProducts();
                $sizes = CommonHelper::getProductVariantsSize();
                return CommonHelper::responseWithData($products, $products_total);
            } else {
                return CommonHelper::responseError('no_products_found');
            }
        } catch (\Exception $e) {
            Log::info("Products Error : " . $e->getMessage());
            throw $e;
            return CommonHelper::responseError('something_went_wrong');
        }
    }

    public function getActiveProducts()
    {
        $query = DB::table('products as p')
            ->select(
                'p.id as id',
                'p.id as product_id',
                'p.name',
                'p.seller_id',
                'p.status',
                'p.slug',
                'p.tax_id',
                'p.image',
                's.name as seller_name',
                's.id as seller_id',
                'p.indicator',
                'p.manufacturer',
                'p.made_in',
                'p.return_status',
                'p.cancelable_status',
                'p.till_status',
                'pv.id as product_variant_id',
                'pv.price',
                'pv.discounted_price',
                'pv.measurement',
                'pv.status as pv_status',
                'pv.stock',
                'pv.stock_unit_id',
                DB::raw('(select short_code from units where units.id = pv.stock_unit_id) as stock_unit')
            )
            ->join('sellers as s', 'p.seller_id', '=', 's.id')
            ->join('product_variants as pv', 'p.id', '=', 'pv.product_id')
            ->join('units as u', 'pv.stock_unit_id', '=', 'u.id')
            ->where('p.status', 1);

        // Check role and filter by seller if applicable
        if (auth()->user()->role_id == Role::$roleSeller) {
            $query->where('p.seller_id', auth()->user()->seller->id);
        }

        $products = $query->orderBy('p.id', 'DESC')->get();

        // Load translations for products
        if ($products->isNotEmpty()) {
            $productIds = $products->pluck('product_id')->unique()->toArray();
            $productsWithTranslations = Product::whereIn('id', $productIds)
                ->with('translations')
                ->get()
                ->keyBy('id');

            // Attach translations to each product in the results
            $products = $products->map(function ($product) use ($productsWithTranslations) {
                $productModel = $productsWithTranslations->get($product->product_id);

                if ($productModel && $productModel->relationLoaded('translations')) {
                    $product->translations = $productModel->getRelation('translations')->toArray();
                } else {
                    $product->translations = [];
                }

                return $product;
            });
        }

        return CommonHelper::responseWithData($products);
    }

    public function save(Request $request)
    {
        $isSeller = auth()->user()->role_id == Role::$roleSeller;

        $rules = [
            'name' => [
                'required',
                Rule::unique('products')->where(function ($query) use ($request) {
                    $query->where('seller_id', $request->seller_id);
                })
            ],
            'seller_id' => 'required',

            'id' => 'nullable|integer',
            'image' => $request->id ? 'nullable' : 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'required',

            'type' => 'required',
            'is_unlimited_stock' => 'required',

            'packet_measurement.*' => ['required_if:type,packet', 'numeric', Rule::notIn([0]),],
            'packet_stock_unit_id.*' => ['required_if:type,packet', 'numeric'],

            'loose_measurement.*' => ['required_if:type,loose', 'numeric', Rule::notIn([0]),],
            'loose_stock_unit_id' => ['required_if:type,loose', 'nullable', 'numeric'],
            'category_id' => 'required',
            'barcode' => 'nullable|unique:products,barcode',
        ];

        if ($isSeller) {
            $rules['packet_price.*'] = ['required_if:type,packet', 'numeric'];
            $rules['packet_stock.*'] = [
                'required_if:type,packet',
                'numeric',
                function ($attribute, $value, $fail) use ($request) {
                    $index = explode('.', $attribute)[1];
                    $status = $request->input("packet_status.{$index}", 1);

                    if ($request->input('is_unlimited_stock') == 0 && $value == 0 && $request->input('type') == 'packet' && $status != 0) {
                        $fail($attribute . ' must be greater than 0 when is_unlimited_stock is 0 and status is not "Sold Out".');
                    }
                },
            ];
            $rules['loose_price.*'] = ['required_if:type,loose', 'numeric'];
            $rules['loose_stock.*'] = [
                'required_if:type,loose',
                'numeric',
                function ($attribute, $value, $fail) use ($request) {
                    $index = explode('.', $attribute)[1];
                    $status = $request->input('status', $request->input("loose_status.{$index}", 1));

                    if ($request->input('is_unlimited_stock') == 0 && strval($value) === '0' && $request->input('type') == 'loose' && intval($status) !== 0) {
                        $fail($attribute . ' must be greater than 0 when is_unlimited_stock is 0 and status is not "Sold Out".');
                    }
                },
            ];
        }

        $validator = Validator::make($request->all(), $rules, [
            'name.unique' => 'The product name has already been taken.',
            'seller_id.required' => 'The seller name field is required.',
            'is_unlimited_stock.required' => 'The Stock Limit field is required.',
            'category_id.required' => 'The Category name field is required.',
            'packet_measurement.*.required_if' => 'The Packet Measurement is required when the type is "Packet".',
            'packet_measurement.*.numeric' => 'The Packet Measurement  must be a number.',
            'packet_measurement.*.not_in' => 'The Packet Measurement must not be zero.',
            'packet_stock.*.required_if' => 'The Packet Stock is required when the type is "Packet".',
            'packet_stock.*.not_in' => 'The Packet Stock must not be zero.',
            'packet_stock_unit_id.*.required_if' => 'The Packet Stock Unit is required when the type is "Packet".',

            'loose_measurement.*.required_if' => 'The Loose Measurement is required when the type is "Loose".',
            'loose_measurement.*.numeric' => 'The Loose Measurement  must be a number.',
            'loose_measurement.*.not_in' => 'The Loose Measurement must not be zero.',
            'loose_stock_unit_id.required_if' => 'The Loose Stock Unit is required when the type is "Loose".',
            'loose_stock_unit_id.numeric' => 'The Loose Stock Unit must be a number.',

        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $variations = array();
        if ($request->type == "packet") {
            foreach ($request->packet_measurement as $index => $item) {
                $data = array();
                $data['measurement'] = $request->packet_measurement[$index];
                $data['price'] = isset($request->packet_price[$index]) ? $request->packet_price[$index] : 0;
                $data['discounted_price'] = isset($request->discounted_price[$index]) ? $request->discounted_price[$index] : 0;
                $data['status'] = isset($request->packet_status[$index]) ? $request->packet_status[$index] : 1;
                $data['stock'] = ($request->is_unlimited_stock == 0) ? (isset($request->packet_stock[$index]) ? $request->packet_stock[$index] : 0) : 0;

                $data['stock_unit_id'] = isset($request->packet_stock_unit_id[$index]) ? $request->packet_stock_unit_id[$index] : 0;
                $variations[] = $data;
            }
        } else {
            foreach ($request->loose_measurement as $index => $item) {
                $data = array();
                $data['measurement'] = $request->loose_measurement[$index];
                $data['price'] = isset($request->loose_price[$index]) ? $request->loose_price[$index] : 0;
                $data['discounted_price'] = isset($request->loose_discounted_price[$index]) ? $request->loose_discounted_price[$index] : 0;
                $variations[] = $data;
            }
        }
        if (count($variations) !== count(array_unique($variations, SORT_REGULAR))) {
            return CommonHelper::responseError('variations_are_duplicate');
        }

        if ($request->max_allowed_quantity == "" || $request->max_allowed_quantity == 0) {
            $max_allowed_quantity = Setting::get_value('max_cart_items_count');
            if ($max_allowed_quantity == "" || $max_allowed_quantity == 0) {
                return CommonHelper::responseError('maximum_items_allowed_in_cart_in_empty_in_store_settings');
            }
        } else {
            $max_allowed_quantity = $request->max_allowed_quantity;
        }

        DB::beginTransaction();

        try {
            $slug = $request->slug ?: preg_replace(
                '/\s+/',
                '-',
                trim(
                    preg_replace('/[^\p{L}\p{N} ]/u', '', $request->name)
                )
            );

            $count = Product::where('slug', 'LIKE', "{$slug}%")->count();

            $row_order = Product::max('row_order') + 1;
            $product = new Product();
            $product->name = $request->name;
            $product->slug = $count ? "{$slug}-{$count}" : $slug;
            $product->row_order = $row_order;
            $product->tax_id = $request->tax_id ?? "";
            $product->brand_id = $request->brand_id ?? "";
            $product->seller_id = $request->seller_id;
            $product->tags = $request->tags ?? "";
            $product->type = $request->type;
            $product->category_id = $request->category_id;
            $product->indicator = $request->product_type;
            $product->manufacturer = $request->manufacturer;
            $product->made_in = $request->made_in;
            $product->tax_included_in_price = $request->tax_included_in_price;
            $product->return_status = $request->return_status;
            $product->return_days = $request->return_days;
            $product->cancelable_status = $request->cancelable_status;
            $product->till_status = $request->till_status;
            $product->cod_allowed = $request->cod_allowed_status;
            $product->total_allowed_quantity = $max_allowed_quantity;
            $product->description = $request->description;
            $product->is_unlimited_stock = $request->is_unlimited_stock;
            $require_products_approval = Seller::where('id', $product->seller_id)->pluck('require_products_approval')->first();
            if ($require_products_approval == 1) {
                $product->is_approved = 0;
            } elseif ($require_products_approval == 0) {
                $product->is_approved = 1;
            }
            $product->status = $request->status ?? 1;
            $product->brand_id = $request->brand_id;
            $product->fssai_lic_no = $request->fssai_lic_no ?? "";
            if ($request->fssai_lic_no != null) {
                $pattern = '/^[0-9]{14}$/';
                // Check if the FSSAI number matches the pattern
                if (preg_match($pattern, $request->fssai_lic_no)) {
                } else {
                    return CommonHelper::responseError('please_enter_valid_fssai_no');
                }
            }
            $product->barcode = $request->barcode ?? "";
            if ($request->barcode != null) {
                $pattern = '/^[a-zA-Z0-9-]+$/';
                if (preg_match($pattern, $request->barcode)) {
                } else {
                    return CommonHelper::responseError('please_enter_valid_barcode');
                }
            }
            $product->meta_title = $request->meta_title ?? "";
            $product->meta_keywords = $request->meta_keywords ?? "";
            $product->schema_markup = $request->schema_markup ?? "";
            $product->meta_description = $request->meta_description ?? "";
            $image = '';
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('products', $file, $fileName);
            } else {
                $image = $request->image;
            }
            $product->image = $image;
            $product->save();

            if ($request->hasFile('other_images')) {
                CommonHelper::uploadProductImages($request->file('other_images'), $product->id);
            }

            /*Variance*/
            if ($request->type == "packet") {

                foreach ($request->packet_measurement as $index => $item) {

                    $data = array();
                    $data['product_id'] = $product->id;
                    $data['type'] = $request->type;
                    $data['measurement'] = $request->packet_measurement[$index];
                    $data['price'] = isset($request->packet_price[$index]) ? $request->packet_price[$index] : 0;
                    $data['purchase_price'] = isset($request->packet_purchase_price[$index]) ? $request->packet_purchase_price[$index] : 0;
                    $data['discounted_price'] = isset($request->discounted_price[$index]) ? $request->discounted_price[$index] : 0;
                    $data['status'] = $request->packet_status[$index] ?? 1;
                    $data['stock'] = ($request->is_unlimited_stock == 0) ? (isset($request->packet_stock[$index]) ? $request->packet_stock[$index] : 0) : 0;
                    $data['stock_unit_id'] = isset($request->packet_stock_unit_id[$index]) ? $request->packet_stock_unit_id[$index] : 0;
                    $data['sku'] = isset($request->packet_sku[$index]) ? $request->packet_sku[$index] : null;
                    $data['secondary_unit_id'] = isset($request->packet_secondary_unit_id[$index]) ? $request->packet_secondary_unit_id[$index] : null;
                    $data['secondary_unit_value'] = isset($request->packet_secondary_unit_value[$index]) ? $request->packet_secondary_unit_value[$index] : null;

                    ProductVariant::insert($data);
                    $variant_id = DB::getPdo()->lastInsertId();
                    if ($request->hasFile('packet_variant_images_' . $index)) {
                        CommonHelper::uploadProductImages($request->file('packet_variant_images_' . $index), $product->id, $variant_id);
                    }
                }
            }

            if ($request->type == "loose") {
                foreach ($request->loose_measurement as $index => $item) {

                    if ($request->is_unlimited_stock == 0 && isset($request->loose_stock[$index]) && $request->loose_measurement[$index] > $request->loose_stock[$index]) {
                        return CommonHelper::responseError("Variant " . ($index + 1) . " measurement cannot exceed total stock");
                    }

                    $data = array();
                    $data['product_id'] = $product->id;
                    $data['type'] = $request->type;
                    $data['stock'] = ($request->is_unlimited_stock == 0) ? (isset($request->loose_stock[$index]) ? $request->loose_stock[$index] : 0) : 0;
                    $data['stock_unit_id'] = $request->loose_stock_unit_id;
                    $data['status'] = $request->status ?? 1;
                    $data['measurement'] = $request->loose_measurement[$index];
                    $data['price'] = isset($request->loose_price[$index]) ? $request->loose_price[$index] : 0;
                    $data['purchase_price'] = $request->loose_purchase_price ?? 0;
                    if (is_array($data['purchase_price'])) {
                        $data['purchase_price'] = $data['purchase_price'][0] ?? 0;
                    }
                    $data['purchase_price'] = (float)$data['purchase_price'];

                    $data['discounted_price'] = isset($request->loose_discounted_price[$index]) ? $request->loose_discounted_price[$index] : 0;
                    $data['sku'] = isset($request->loose_sku[$index]) ? $request->loose_sku[$index] : null;
                    $data['secondary_unit_id'] = isset($request->loose_secondary_unit_id[$index]) ? $request->loose_secondary_unit_id[$index] : null;
                    $data['secondary_unit_value'] = isset($request->loose_secondary_unit_value[$index]) ? $request->loose_secondary_unit_value[$index] : null;

                    ProductVariant::insert($data);
                    $variant_id = DB::getPdo()->lastInsertId();
                    if ($request->hasFile('loose_variant_images_' . $index)) {
                        CommonHelper::uploadProductImages($request->file('loose_variant_images_' . $index), $product->id, $variant_id);
                    }
                }
            }
            $tagIds = array_filter(array_map('trim', explode(',', $request->tag_ids)), function ($value) {
                return $value !== '';
            });

            $product = Product::find($product->id);

            if ($product) {
                $existingTagIds = [];
                $newTagNames = [];

                // Separate integer IDs (existing tags) from string names (new tags)
                foreach ($tagIds as $tagId) {
                    if (is_numeric($tagId)) {
                        $existingTagIds[] = (int) $tagId;
                    } else {
                        $newTagNames[] = $tagId;
                    }
                }

                // Create new tags and get their IDs
                $newTagIds = [];
                foreach ($newTagNames as $tagName) {
                    $newTag = Tag::firstOrCreate(['name' => $tagName]);
                    $newTagIds[] = $newTag->id;
                }

                // Combine existing and new tag IDs
                $allTagIds = array_merge($existingTagIds, $newTagIds);

                // Sync the tags with the product
                $product->tags()->sync($allTagIds);
            }

            // Save translations using HasTranslations trait
            if ($request->has('translations')) {
                $translations = $request->translations;

                // If translations is a JSON string, decode it
                if (is_string($translations)) {
                    $translations = json_decode($translations, true);
                }

                // Multiple translations sent as array
                if (is_array($translations)) {
                    foreach ($translations as $translation) {
                        if (isset($translation['language_id'])) {
                            $translationData = [
                                'name' => $translation['name'] ?? '',
                                'tags' => $translation['tags'] ?? '',
                                'manufacturer' => $translation['manufacturer'] ?? '',
                                'description' => $translation['description'] ?? '',
                                'meta_title' => $translation['meta_title'] ?? '',
                                'meta_keywords' => $translation['meta_keywords'] ?? '',
                                'schema_markup' => $translation['schema_markup'] ?? '',
                                'meta_description' => $translation['meta_description'] ?? '',
                            ];
                            $product->saveTranslation($translation['language_id'], $translationData);
                        }
                    }
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            Log::info("Error : " . $e->getMessage());
            DB::rollBack();
            // throw $e;
            return CommonHelper::responseError($e->getMessage());
        }

        return CommonHelper::responseSuccess('product_saved_successfully');
    }

    public function edit($id)
    {
        $product = Product::with([
            'seller',
            'images',
            'variants.images',
            'variants.unit',
            'category',
            'tax',
            'madeInCountry',
            'brand',
            'tags',
            'translations'
        ])
            ->where('id', $id)->first();
        if (!$product) {
            return CommonHelper::responseError('product_not_found');
        }

        if ($product->relationLoaded('category') && $product->category) {
            $product->category->makeHidden(['catActiveChilds', 'cat_active_childs']);
        }

        if (isset($product->description)) {
            $product->description = CommonHelper::fixAdminImagePaths($product->description);
        }

        $product->translations = $this->buildProductTranslationsForEdit($product);

        return CommonHelper::responseWithData($product);
    }

    /**
     * Build translations array for edit form from translations relation.
     * Includes default language fallback from base table when no translation exists.
     */
    private function buildProductTranslationsForEdit(Product $product): array
    {
        $defaultLang = app(LanguageService::class)->getDefaultLanguage();
        $defaultLangId = $defaultLang ? $defaultLang->id : null;

        $translationsArray = [];
        $loadedTranslations = $product->relationLoaded('translations')
            ? $product->getRelation('translations')
            : $product->translations()->get();

        foreach ($loadedTranslations as $trans) {
            $translationsArray[] = [
                'language_id' => $trans->language_id,
                'name' => $trans->name ?? '',
                'tags' => $trans->tags ?? '',
                'manufacturer' => $trans->manufacturer ?? '',
                'description' => CommonHelper::fixAdminImagePaths($trans->description ?? ''),
                'meta_keywords' => $trans->meta_keywords ?? '',
                'schema_markup' => $trans->schema_markup ?? '',
                'meta_description' => $trans->meta_description ?? '',
            ];
        }

        // Add default language from base table if no translation exists
        $hasDefaultTranslation = collect($translationsArray)->contains('language_id', $defaultLangId);
        if ($defaultLangId && !$hasDefaultTranslation) {
            array_unshift($translationsArray, [
                'language_id' => $defaultLangId,
                'name' => $product->name ?? '',
                'tags' => '',
                'manufacturer' => $product->manufacturer ?? '',
                'description' => \App\Helpers\CommonHelper::fixAdminImagePaths($product->description ?? ''),
                'meta_title' => $product->meta_title ?? '',
                'meta_keywords' => $product->meta_keywords ?? $product->meta_keyword ?? '',
                'schema_markup' => $product->schema_markup ?? '',
                'meta_description' => $product->meta_description ?? '',
            ]);
        }

        return $translationsArray;
    }

    public function update(Request $request)
    {


        $isSeller = auth()->user()->role_id == Role::$roleSeller;

        $rules = [
            'name' => [
                'required',
                Rule::unique('products')->where(function ($query) use ($request) {
                    $query->where('seller_id', $request->seller_id)->where('id', '!=', $request->id);
                })
            ],

            'seller_id' => 'required',
            'description' => 'required',
            'type' => 'required',
            'is_unlimited_stock' => 'required',

            'packet_measurement.*' => ['required_if:type,packet', 'numeric', Rule::notIn([0]),],
            'packet_stock_unit_id.*' => ['required_if:type,packet', 'numeric'],

            'loose_measurement.*' => ['required_if:type,loose', 'numeric', Rule::notIn([0]),],
            'loose_stock_unit_id' => ['required_if:type,loose', 'nullable', 'numeric'],

            'category_id' => 'required',

            // Barcode should be globally unique (excluding current product on update)
            'barcode' => [
                'nullable',
                Rule::unique('products', 'barcode')->ignore($request->id),
            ],
        ];

        if ($isSeller) {
            $rules['packet_price.*'] = ['required_if:type,packet', 'numeric'];
            $rules['packet_stock.*'] = [
                'required_if:type,packet',
                'numeric',
                function ($attribute, $value, $fail) use ($request) {
                    $index = explode('.', $attribute)[1];
                    $status = $request->input("packet_status.{$index}", 1);

                    if ($request->input('type') === 'packet' && $request->input('is_unlimited_stock') == 0 && $value == 0 && $status != 0) {
                        $fail('The Packet Stock must be greater than 0 when Limited Stock Limit and status is not "Sold Out".');
                    }
                },
            ];
            $rules['loose_price.*'] = ['required_if:type,loose', 'numeric'];
            $rules['loose_stock.*'] = [
                'required_if:type,loose',
                'numeric',
                function ($attribute, $value, $fail) use ($request) {
                    $index = explode('.', $attribute)[1];
                    $status = $request->input('status', $request->input("loose_status.{$index}", 1));

                    if ($request->input('is_unlimited_stock') == 0 && strval($value) === '0' && $request->input('type') == 'loose' && intval($status) !== 0) {
                        $fail($attribute . ' must be greater than 0 when is_unlimited_stock is 0 and status is not "Sold Out".');
                    }
                },
            ];
        }

        $validator = Validator::make($request->all(), $rules, [
            'name.unique' => 'The product name has already been taken.',
            'seller_id.required' => 'The seller name field is required.',
            'is_unlimited_stock.required' => 'The Stock Limit field is required.',
            'category_id.required' => 'The Category name field is required.',
            'packet_measurement.*.required_if' => 'The Packet Measurement is required when the type is "Packet".',
            'packet_measurement.*.numeric' => 'The Packet Measurement must be a number.',
            'packet_measurement.*.not_in' => 'The Packet Measurement must not be zero.',
            'packet_stock.*.required_if' => 'The Packet Stock is required when the type is "Packet".',
            'packet_stock.*.not_in' => 'The Packet Stock must not be zero.',
            'packet_stock_unit_id.*.required_if' => 'The Packet Stock Unit is required when the type is "Packet".',
            'loose_measurement.*.required_if' => 'The Loose Measurement is required when the type is "Loose".',
            'loose_measurement.*.numeric' => 'The Loose Measurement must be a number.',
            'loose_measurement.*.not_in' => 'The Loose Measurement must not be zero.',
            'loose_stock_unit_id.required_if' => 'The Loose Stock Unit is required when the type is "Loose".',
            'loose_stock_unit_id.numeric' => 'The Loose Stock Unit must be a number.',
            'barcode.unique' => 'The barcode has already been taken.',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $variations = array();
        if ($request->type == "packet") {
            foreach ($request->packet_measurement as $index => $item) {
                $variant = isset($request->variant_id[$index]) ? ProductVariant::find($request->variant_id[$index]) : null;
                $data = array();
                $data['measurement'] = $request->packet_measurement[$index];
                $data['price'] = isset($request->packet_price[$index]) ? $request->packet_price[$index] : ($variant->price ?? 0);
                $data['discounted_price'] = isset($request->discounted_price[$index]) ? $request->discounted_price[$index] : ($variant->discounted_price ?? 0);
                $data['status'] = isset($request->packet_status[$index]) ? $request->packet_status[$index] : ($variant->status ?? 1);
                $data['stock'] = isset($request->packet_stock[$index]) ? $request->packet_stock[$index] : ($variant->stock ?? 0);
                $data['stock_unit_id'] = isset($request->packet_stock_unit_id[$index]) ? $request->packet_stock_unit_id[$index] : ($variant->stock_unit_id ?? 0);
                $variations[] = $data;
            }
        } else {
            foreach ($request->loose_measurement as $index => $item) {
                $variant = isset($request->variant_id[$index]) ? ProductVariant::find($request->variant_id[$index]) : null;
                if ($request->is_unlimited_stock == 0 && isset($request->loose_stock) && $request->loose_measurement[$index] > $request->loose_stock) {
                    return CommonHelper::responseError("Variant " . ($index + 1) . " measurement cannot exceed total stock");
                }
                $data = array();
                $data['measurement'] = $request->loose_measurement[$index];
                $data['price'] = isset($request->loose_price[$index]) ? $request->loose_price[$index] : ($variant->price ?? 0);
                $data['discounted_price'] = isset($request->loose_discounted_price[$index]) ? $request->loose_discounted_price[$index] : ($variant->discounted_price ?? 0);
                $variations[] = $data;
            }
        }
        if (count($variations) !== count(array_unique($variations, SORT_REGULAR))) {
            return CommonHelper::responseError('variations_are_duplicate');
        }

        if ($request->max_allowed_quantity == "" || $request->max_allowed_quantity == 0) {
            $max_allowed_quantity = Setting::get_value('max_cart_items_count');
            if ($max_allowed_quantity == " " || $max_allowed_quantity == 0) {
                return CommonHelper::responseError('maximum_items_allowed_in_cart_in_empty_in_store_settings');
            }
        } else {
            $max_allowed_quantity = $request->max_allowed_quantity;
        }

        DB::beginTransaction();
        try {
            $product_image_ids = json_decode($request->deleteImageIds);
            if (count($product_image_ids) !== 0) {
                foreach ($product_image_ids as $index => $product_image_id) {
                    $image = ProductImages::find($product_image_id);
                    if ($image) {
                        $image->delete();
                    }
                }
            }

            $product = Product::find($request->id);
            $row_order = Product::max('row_order') + 1;

            if ($product->name !== $request->name) {
                $slug = $request->slug ?: preg_replace(
                    '/\s+/',
                    '-',
                    trim(
                        preg_replace('/[^\p{L}\p{N} ]/u', '', $request->name)
                    )
                );
                $count = Product::where('slug', 'LIKE', "{$slug}%")->where('id', '!=', $request->id)->count();
                $product->slug = $count ? "{$slug}-{$count}" : $slug;
            }

            $product->name = $request->name;

            $product->row_order = $row_order;
            $product->tax_id = $request->tax_id;
            $product->brand_id = $request->brand_id;
            $product->seller_id = $request->seller_id;
            $product->type = $request->type;
            $product->category_id = $request->category_id;
            $product->indicator = $request->product_type;
            $product->manufacturer = $request->manufacturer;
            $product->made_in = $request->made_in;
            $product->tax_included_in_price = $request->tax_included_in_price;
            $product->return_status = $request->return_status;
            $product->return_days = $request->return_days;
            $product->cancelable_status = $request->cancelable_status;
            $product->till_status = $request->till_status;
            $product->cod_allowed = $request->cod_allowed_status;
            $product->total_allowed_quantity = $max_allowed_quantity;
            $product->description = $request->description;
            $product->is_unlimited_stock = $request->is_unlimited_stock;
            if (isset($request->is_approved)) {
                $product->is_approved = $request->is_approved;
            }
            $product->fssai_lic_no = $request->fssai_lic_no ?? "";
            if ($request->fssai_lic_no != null) {
                $pattern = '/^[0-9]{14}$/';
                // Check if the FSSAI number matches the pattern
                if (preg_match($pattern, $request->fssai_lic_no)) {
                } else {
                    return CommonHelper::responseError('please_enter_valid_fssai_no');
                }
            }
            $product->barcode = $request->barcode ?? "";
            if ($request->barcode != null) {
                $pattern = '/^[a-zA-Z0-9-]+$/';
                // Check if the FSSAI number matches the pattern
                if (preg_match($pattern, $request->barcode)) {
                } else {
                    return CommonHelper::responseError('please_enter_valid_barcode');
                }
            }
            $product->meta_title = $request->meta_title ?? "";
            $product->meta_keywords = $request->meta_keywords ?? "";
            $product->schema_markup = $request->schema_markup ?? "";
            $product->meta_description = $request->meta_description ?? "";
            $product->tags = $request->tags ?? "";

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('products', $file, $fileName);
                $product->image = $image;
            }
            if ($request->hasFile('other_images')) {
                CommonHelper::uploadProductImages($request->file('other_images'), $request->id);
            }



            if (isset($request->status)) {
                $product->status = $request->status;
            }

            $product->save();

            //Variance
            if ($request->type == "packet") {
                foreach ($request->packet_measurement as $index => $item) {
                    $variant = isset($request->variant_id[$index]) ? ProductVariant::find($request->variant_id[$index]) : null;
                    if (!$variant) {
                        $variant = new ProductVariant();
                    }
                    $variant->product_id = $product->id;
                    $variant->type = $request->type;
                    $variant->measurement = $request->packet_measurement[$index];
                    $variant->price = isset($request->packet_price[$index]) ? $request->packet_price[$index] : ($variant->price ?? 0);
                    $variant->purchase_price = isset($request->packet_purchase_price[$index]) ? $request->packet_purchase_price[$index] : ($variant->purchase_price ?? 0);
                    $variant->discounted_price = isset($request->discounted_price[$index]) ? $request->discounted_price[$index] : ($variant->discounted_price ?? 0);
                    $variant->status = isset($request->packet_status[$index]) ? $request->packet_status[$index] : ($variant->status ?? 1);
                    $variant->stock = ($request->is_unlimited_stock == 0) ? (isset($request->packet_stock[$index]) ? $request->packet_stock[$index] : ($variant->stock ?? 0)) : 0;
                    $variant->stock_unit_id = isset($request->packet_stock_unit_id[$index]) ? $request->packet_stock_unit_id[$index] : ($variant->stock_unit_id ?? 0);
                    $variant->sku = isset($request->packet_sku[$index]) ? $request->packet_sku[$index] : null;
                    $variant->secondary_unit_id = isset($request->packet_secondary_unit_id[$index]) ? $request->packet_secondary_unit_id[$index] : null;
                    $variant->secondary_unit_value = isset($request->packet_secondary_unit_value[$index]) ? $request->packet_secondary_unit_value[$index] : null;
                    $variant->save();
                    if ($request->hasFile('packet_variant_images_' . $index)) {
                        CommonHelper::uploadProductImages($request->file('packet_variant_images_' . $index), $product->id, $variant->id);
                    }
                }
            }

            if ($request->type == "loose") {
                foreach ($request->loose_measurement as $index => $item) {
                    $variant = isset($request->variant_id[$index]) ? ProductVariant::find($request->variant_id[$index]) : null;
                    if (!$variant) {
                        $variant = new ProductVariant();
                    }
                    $variant->product_id = $product->id;
                    $variant->type = $request->type;
                    $variant->stock = ($request->is_unlimited_stock == 0) ? (isset($request->loose_stock) ? $request->loose_stock : ($variant->stock ?? 0)) : 0;
                    $variant->stock_unit_id = $request->loose_stock_unit_id;
                    $variant->status = $request->status;
                    $variant->measurement = $request->loose_measurement[$index];
                    $variant->price = isset($request->loose_price[$index]) ? $request->loose_price[$index] : ($variant->price ?? 0);
                    
                    $purchasePrice = isset($request->loose_purchase_price[$index]) ? $request->loose_purchase_price[$index] : ($variant->purchase_price ?? 0);
                    if (is_array($purchasePrice)) {
                        $purchasePrice = $purchasePrice[0] ?? 0;
                    }
                    $variant->purchase_price = (float) $purchasePrice;
                    
                    $variant->discounted_price = isset($request->loose_discounted_price[$index]) ? $request->loose_discounted_price[$index] : ($variant->discounted_price ?? 0);


                    $variant->sku = isset($request->loose_sku[$index]) ? $request->loose_sku[$index] : null;
                    $variant->secondary_unit_id = isset($request->loose_secondary_unit_id[$index]) ? $request->loose_secondary_unit_id[$index] : null;
                    $variant->secondary_unit_value = isset($request->loose_secondary_unit_value[$index]) ? $request->loose_secondary_unit_value[$index] : null;
                    $variant->save();
                    if ($request->hasFile('loose_variant_images_' . $index)) {
                        CommonHelper::uploadProductImages($request->file('loose_variant_images_' . $index), $product->id, $variant->id);
                    }
                }
            }
            $tagIds = array_filter(array_map('trim', explode(',', $request->tag_ids)), function ($value) {
                return $value !== '';
            });

            $product = Product::find($product->id);

            if ($product) {
                $existingTagIds = [];
                $newTagNames = [];

                // Separate integer IDs (existing tags) from string names (new tags)
                foreach ($tagIds as $tagId) {
                    if (is_numeric($tagId)) {
                        $existingTagIds[] = (int) $tagId;
                    } else {
                        $newTagNames[] = $tagId;
                    }
                }

                // Create new tags and get their IDs
                $newTagIds = [];
                foreach ($newTagNames as $tagName) {
                    $newTag = Tag::firstOrCreate(['name' => $tagName]);
                    $newTagIds[] = $newTag->id;
                }

                // Combine existing and new tag IDs
                $allTagIds = array_merge($existingTagIds, $newTagIds);

                // Sync the tags with the product
                $product->tags()->sync($allTagIds);
            }

            // Save/update translations using HasTranslations trait
            if ($request->has('translations')) {
                $translations = $request->translations;

                // If translations is a JSON string, decode it
                if (is_string($translations)) {
                    $translations = json_decode($translations, true);
                }

                // Multiple translations sent as array
                if (is_array($translations)) {
                    foreach ($translations as $translation) {
                        if (isset($translation['language_id'])) {
                            $translationData = [
                                'name' => $translation['name'] ?? '',
                                'tags' => $translation['tags'] ?? '',
                                'manufacturer' => $translation['manufacturer'] ?? '',
                                'description' => $translation['description'] ?? '',
                                'meta_title' => $translation['meta_title'] ?? '',
                                'meta_keywords' => $translation['meta_keywords'] ?? '',
                                'schema_markup' => $translation['schema_markup'] ?? '',
                                'meta_description' => $translation['meta_description'] ?? '',
                            ];
                            $product->saveTranslation($translation['language_id'], $translationData);
                        }
                    }
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::info("Error : " . $e->getMessage());
            throw $e;
            return CommonHelper::responseError('something_went_wrong');
        }
        return CommonHelper::responseSuccess('product_updated_successfully');
    }

    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $productVariant = ProductVariant::find($request->id);

            if ($productVariant) {
                // Check if the product variant exists in order_items
                $orderItemExists = OrderItem::where('product_variant_id', $productVariant->id)->exists();

                if ($orderItemExists) {
                    return CommonHelper::responseError('this_product_variant_cannot_be_deleted_as_it_exists_in_orders');
                }

                $product_id = $productVariant->product_id;

                $variantDeleteStatus = $productVariant->delete();
                $variants = ProductVariant::where('product_id', $product_id)->get();

                if ($variantDeleteStatus == true && $variants->count() == 0) {
                    $product = Product::find($product_id);
                    if ($product) {
                        $product->delete();
                    }
                }

                return CommonHelper::responseSuccess('product_deleted_successfully');
            } else {
                return CommonHelper::responseError('product_already_deleted');
            }
        }

        return CommonHelper::responseError('invalid_request');
    }

    public function multipleDelete(Request $request)
    {
        if (isset($request->ids)) {
            $ids = explode(',', $request->ids);
            $productVariants = ProductVariant::with('images')->whereIn('id', $ids)->get();
            foreach ($productVariants as $productVariant) {
                $product_id = $productVariant->product_id;
                foreach ($productVariant->images as $image) {
                    @Storage::disk('public')->delete($image->image);
                    $image->delete();
                }
                $productVariant->delete();

                //If All variant deleted remove main product
                $product = Product::with('variants', 'images')->where('id', $product_id)->first();
                if ($product && count($product->variants) == 0) {
                    foreach ($productVariant->images as $image) {
                        @Storage::disk('public')->delete($image->image);
                        $image->delete();
                    }
                    @Storage::disk('public')->delete($product->image);
                    $product->delete();
                }
            }
            return CommonHelper::responseSuccess('selected_all_product_deleted_successfully');
        }
    }

    public function changeStatus(Request $request)
    {
        if (isset($request->id)) {
            $product = Product::find($request->id);
            if ($product) {
                $product->status = ($product->status == 1) ? 0 : 1;
                $product->save();
                return CommonHelper::responseSuccess('products_status_updated_successfully');
            } else {
                return CommonHelper::responseSuccess('products_record_not_found');
            }
        }
    }

    public function getProductsOrderList(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'category_id' => 'required',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $products = Product::where('category_id', $request->category_id)
            ->with('translations')
            ->orderBy('row_order', 'ASC')
            ->get()
            ->makeHidden(['translations'])
            ->map(function ($product) {
                $productArray = $product->toArray();
                // Add translations from relation (not accessor)
                $productArray['translations'] = $product->getRelation('translations')->toArray();
                return $productArray;
            })
            ->toArray();

        return CommonHelper::responseWithData($products);
    }
    public function updateProductsOrder(Request $request)
    {
        $products = $request->all();
        foreach ($products as $key => $product) {
            $data = Product::find($product["id"]);
            $data->row_order = $product["row_order"];
            $data->save();
        }
        return CommonHelper::responseSuccess('product_order_updated_successfully');
    }

    public function bulkUpload(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls'
            ]);
            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $filename = $_FILES["file"]["tmp_name"];
            $fileExtension = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));

            // Validate file extension (only Excel files allowed)
            if ($fileExtension != 'xlsx' && $fileExtension != 'xls') {
                return CommonHelper::responseError('Only Excel files (.xlsx, .xls) are allowed.');
            }

            if ($_FILES["file"]["size"] > 0) {
                $errors = [];

                $dataRows = [];
                // Read Excel file
                if ($fileExtension == 'xlsx' || $fileExtension == 'xls') {
                    $spreadsheet = IOFactory::load($filename);
                    $sheet = $spreadsheet->getActiveSheet();
                    $highestRow = $sheet->getHighestRow();

                    $headerRow = [];
                    $highestColumnIndex = $sheet->getHighestColumn();
                    $highestColumnNum = Coordinate::columnIndexFromString($highestColumnIndex);

                    // Read header row (row 1)
                    for ($colIndex = 1; $colIndex <= $highestColumnNum; $colIndex++) {
                        $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                        $cellValue = $sheet->getCell($colLetter . 1)->getValue();
                        $headerRow[] = $cellValue !== null ? (string) $cellValue : '';
                    }
                    $expectedColumnCount = count($headerRow);
                    $dataRows[] = $headerRow;

                    // Note: Only read rows that actually have data (at least Product Name should be filled)
                    for ($row = 2; $row <= $highestRow; $row++) {
                        $rowData = [];
                        for ($colIndex = 1; $colIndex <= $expectedColumnCount; $colIndex++) {
                            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                            $cellValue = $sheet->getCell($colLetter . $row)->getValue();
                            $rowData[] = $cellValue !== null ? (string) $cellValue : '';
                        }
                        while (count($rowData) < $expectedColumnCount) {
                            $rowData[] = '';
                        }

                        // Skip rows with empty Product Name, but keep reading remaining rows
                        if (!empty(trim($rowData[0]))) {
                            $dataRows[] = $rowData;
                        }
                    }
                } else {
                    return CommonHelper::responseError('Only Excel files (.xlsx, .xls) are allowed.');
                }

                // dataRows[0] is the header row, so we need at least 2 entries for 1 product row
                if (count($dataRows) <= 1) {
                    return CommonHelper::responseError('No valid product data found in the file.');
                }

                $count = 0;
                foreach ($dataRows as $products) {
                    if ($count != 0) {
                        if (!is_array($products)) {
                            $errors[] = [
                                'row' => $count,
                                'errors' => ['Invalid row format.']
                            ];
                            $count++;
                            continue;
                        }

                        // Pad the array to ensure we have at least the minimum required base columns
                        // 26 base columns + at least 7 for one variant = 33 minimum
                        while (count($products) < 26) {
                            $products[] = '';
                        }

                        $rowErrors = [];

                        // --- Required field: Product Name ---
                        if (empty($products[0])) {
                            $rowErrors[] = 'Product Name is required';
                        } else {
                            // Product Name must be unique - check against existing products in DB
                            $nameExists = Product::where('name', trim($products[0]))->exists();
                            if ($nameExists) {
                                $rowErrors[] = 'Product Name "' . trim($products[0]) . '" already exists. Product names must be unique.';
                            }
                        }

                        if (empty($products[2])) {
                            $rowErrors[] = 'Category ID is empty or invalid';
                        }
                        if (empty($products[1])) {
                            $rowErrors[] = 'Seller ID is empty or invalid';
                        }
                        if (!empty($products[1])) {
                            $seller = Seller::select('name', 'categories', 'require_products_approval')->where('id', $products[1])->first();
                            if (empty($seller)) {
                                $rowErrors[] = 'Seller does not exist (check seller_id)';
                            } else {
                                // Sellers have parent categories assigned, but child categories should also be allowed
                                if (!empty($products[2])) {
                                    $categoryId = (int) $products[2];
                                    $sellerCategoryIds = explode(',', (string) $seller->categories);
                                    $sellerCategoryIds = array_map('trim', $sellerCategoryIds);
                                    $sellerCategoryIds = array_filter($sellerCategoryIds);

                                    // Check if category is directly assigned to seller
                                    $isCategoryValid = in_array((string) $categoryId, $sellerCategoryIds, true);

                                    // If not directly assigned, check if it's a child category with assigned parent
                                    if (!$isCategoryValid) {
                                        $category = Category::find($categoryId);
                                        if ($category) {
                                            $currentCategory = $category;
                                            while ($currentCategory && $currentCategory->parent_id != 0) {
                                                $parentCategory = Category::find($currentCategory->parent_id);
                                                if ($parentCategory && in_array((string) $parentCategory->id, $sellerCategoryIds, true)) {
                                                    $isCategoryValid = true;
                                                    break;
                                                }
                                                $currentCategory = $parentCategory;
                                                if (!$currentCategory || $currentCategory->id == $categoryId) {
                                                    break;
                                                }
                                            }
                                        }
                                    }

                                    if (!$isCategoryValid) {
                                        $rowErrors[] = 'Category ID is not assigned to seller (category or its parent category must be assigned)';
                                    }
                                }
                            }
                        }
                        // Validate Is Returnable [6] - accept 0/1 or No/Yes (case-insensitive)
                        // Use preg_replace to strip any invisible/non-printable characters Excel may add
                        if (isset($products[6]) && trim($products[6]) !== '') {
                            $returnNorm = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $products[6]));
                            if (!in_array($returnNorm, ['0', '1', 'no', 'yes'])) {
                                $rowErrors[] = 'Is Returnable must be 0/1 or No/Yes (got: "' . trim($products[6]) . '")';
                            }
                        }

                        // Validate Is cancel-able [8] - accept 0/1 or No/Yes (case-insensitive)
                        if (isset($products[8]) && trim($products[8]) !== '') {
                            $cancelNorm = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $products[8]));
                            if (!in_array($cancelNorm, ['0', '1', 'no', 'yes'])) {
                                $rowErrors[] = 'Is cancel-able must be 0/1 or No/Yes (got: "' . trim($products[8]) . '")';
                            }
                        }

                        // Till status validation [9]: accept numeric values 1-5 or descriptive labels
                        $tillStatus = '';
                        $tillStatusLower = '';
                        if (isset($products[8]) && !empty($products[8])) {
                            // Use same normalization as the cancel-able validation above
                            $cancelNorm2 = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $products[8]));
                            $isCancelable = in_array($cancelNorm2, ['1', 'yes']);
                            if ($isCancelable) {
                                $tillStatus = isset($products[9]) ? $products[9] : '';
                                // Strip invisible/non-printable chars but keep spaces (for "Payment Pending", "Out for Delivery")
                                $tillStatusLower = strtolower(trim(preg_replace('/[^a-zA-Z0-9 ]/', '', $tillStatus)));
                                $validTillStatus = [
                                    '1',
                                    '2',
                                    '3',
                                    '4',
                                    '5',
                                    'payment pending',
                                    'received',
                                    'processed',
                                    'shipped',
                                    'out for delivery'
                                ];

                                if (empty($tillStatusLower) || !in_array($tillStatusLower, $validTillStatus)) {
                                    $rowErrors[] = 'Till status is empty or invalid (must be: Payment Pending, Received, Processed, Shipped, or Out for Delivery) (got: "' . trim($tillStatus) . '")';
                                }
                            }
                        }
                        if ((!isset($products[8]) || trim($products[8]) === '') && isset($products[9]) && !empty($products[9])) {
                            $rowErrors[] = 'Till status provided but Is cancel-able is empty';
                        }
                        // --- Required field: Description [10] ---
                        if (!isset($products[10]) || empty($products[10])) {
                            $rowErrors[] = 'Description is required';
                        }
                        // --- Required field: Main Image [11] ---
                        if (!isset($products[11]) || empty($products[11])) {
                            $rowErrors[] = 'Main Image is required';
                        } else {
                            $imgPathOriginal = isset($products[11]) ? trim($products[11]) : '';
                            $imgPathNormalized = str_replace(' ', '-', strtolower($imgPathOriginal));
                            $isUrl = preg_match('/^https?:\/\//i', $imgPathNormalized);
                            if (!$isUrl) {
                                $existsOnDisk = Storage::disk('public')->exists($imgPathNormalized);
                                $existsInPublic = file_exists(public_path('storage/' . ltrim($imgPathNormalized, '/')));
                                if (!$existsOnDisk && !$existsInPublic) {
                                    $rowErrors[] = 'Image file not found: ' . $imgPathOriginal;
                                }
                            }
                        }
                        // Product Status (Is approved?) [13] - strip invisible chars before comparing
                        if (isset($products[13]) && trim($products[13]) !== '') {
                            $approvedNorm = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $products[13]));
                            if (!in_array($approvedNorm, ['0', '1', 'no', 'yes'])) {
                                $rowErrors[] = 'Is_approved must be 0/1 or No/Yes (got: "' . trim($products[13]) . '")';
                            }
                        }

                        // Tax ID [15]
                        if (isset($products[15]) && !empty($products[15])) {
                            $tax = Tax::where('id', $products[15])->first();
                            if (empty($tax)) {
                                $rowErrors[] = 'Tax ID is invalid';
                            }
                        }

                        // Barcode [17] — must be unique across all products if provided
                        if (!empty(trim($products[17] ?? ''))) {
                            $barcodeExists = Product::where('barcode', trim($products[17]))->exists();
                            if ($barcodeExists) {
                                $rowErrors[] = 'Barcode "' . trim($products[17]) . '" already exists. Barcode must be unique.';
                            }
                        }

                        // Each variant has 7 columns: type, measurement, price, discounted_price,
                        // serve_for, stock, stock_unit_id
                        // Variants now start at index 26 (base columns are 26)
                        $columnsPerVariant = 7;
                        $index1 = 26;
                        $total_variants = 0;
                        for ($j = 0; $j < 50; $j++) {
                            if (isset($products[$index1]) && $products[$index1] !== '') {
                                $total_variants++;
                            }
                            $index1 = $index1 + $columnsPerVariant;
                        }
                        if ($total_variants == 0) {
                            $rowErrors[] = 'At least one variant required';
                        }

                        $ids = Unit::select('id')->orderBy('id', 'ASC')->get();
                        $validUnitIds = $ids->pluck('id')->all();
                        $index1 = 26; // Variants start at index 26 (after 26 base columns)

                        // Check if stock is unlimited — if so, skip stock required validation in variants
                        $stockLimitNorm = isset($products[19]) ? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $products[19])) : '';
                        $isUnlimitedStock = in_array($stockLimitNorm, ['unlimited', 'yes', '1']);

                        // Collect all variant types and measurements for cross-variant validation
                        $variantTypes        = [];
                        $variantMeasurements = [];
                        $columnsPerVariant   = 7;

                        for ($z = 0; $z < $total_variants; $z++) {
                            // --- Type ---
                            $typeNorm = isset($products[$index1]) ? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $products[$index1])) : '';
                            if (empty($typeNorm) || !in_array($typeNorm, ['packet', 'loose'])) {
                                $rowErrors[] = 'Variant ' . ($z + 1) . ': Type is empty or invalid (got: "' . trim($products[$index1] ?? '') . '")';
                            } else {
                                $variantTypes[] = $typeNorm;
                            }
                            $index1++;

                            // --- Measurement (must be numeric and unique across variants) ---
                            if (!isset($products[$index1]) || $products[$index1] === '' || !is_numeric($products[$index1])) {
                                $rowErrors[] = 'Variant ' . ($z + 1) . ': Measurement is empty or invalid';
                            } else {
                                $measureVal = (float) $products[$index1];
                                if (in_array($measureVal, $variantMeasurements, true)) {
                                    $rowErrors[] = 'Variant ' . ($z + 1) . ': Measurement "' . $measureVal . '" is already used by another variant. Each variant must have a unique measurement.';
                                } else {
                                    $variantMeasurements[] = $measureVal;
                                }
                            }
                            $index1++;

                            // --- Price (required) ---
                            $priceVal = isset($products[$index1]) && is_numeric($products[$index1]) ? (float) $products[$index1] : null;
                            if ($priceVal === null || $products[$index1] === '') {
                                $rowErrors[] = 'Variant ' . ($z + 1) . ': Price is empty or invalid';
                            }
                            $index1++;

                            // --- Discounted Price (optional) ---
                            // If filled: must be numeric AND less than price
                            $discountedVal = isset($products[$index1]) && $products[$index1] !== '' ? $products[$index1] : null;
                            if ($discountedVal !== null) {
                                if (!is_numeric($discountedVal)) {
                                    $rowErrors[] = 'Variant ' . ($z + 1) . ': Discounted Price must be a number';
                                } elseif ($priceVal !== null && (float) $discountedVal >= $priceVal) {
                                    $rowErrors[] = 'Variant ' . ($z + 1) . ': Discounted Price (' . $discountedVal . ') must be less than Price (' . $priceVal . ')';
                                }
                            }
                            $index1++;

                            // --- Variant Status ---
                            if (isset($products[$index1]) && trim($products[$index1]) !== '') {
                                $serveNorm = strtolower(trim(preg_replace('/[^a-zA-Z0-9 ]/', '', $products[$index1])));
                                if (!in_array($serveNorm, ['0', '1', 'available', 'sold out'])) {
                                    $rowErrors[] = 'Variant ' . ($z + 1) . ': Variant Status is invalid (must be Available or Sold Out) (got: "' . trim($products[$index1]) . '")';
                                }
                            } else {
                                $rowErrors[] = 'Variant ' . ($z + 1) . ': Variant Status is empty (must be Available or Sold Out)';
                            }
                            $index1++;

                            // --- Stock (only required when stock limit is NOT unlimited) ---
                            if (!$isUnlimitedStock) {
                                if (!isset($products[$index1]) || $products[$index1] === '' || !is_numeric($products[$index1])) {
                                    $rowErrors[] = 'Variant ' . ($z + 1) . ': Stock is empty or invalid';
                                }
                            }
                            $index1++;

                            // --- Stock Unit ID ---
                            if (!isset($products[$index1]) || $products[$index1] === '' || !in_array((int) $products[$index1], $validUnitIds, true)) {
                                $rowErrors[] = 'Variant ' . ($z + 1) . ': Stock Unit ID is empty or invalid';
                            }
                            $index1++;
                        }

                        // All variants must have the same type
                        if (!empty($variantTypes) && count(array_unique($variantTypes)) > 1) {
                            $rowErrors[] = 'All variants must have the same type (either all "packet" or all "loose"). Found: ' . implode(', ', array_unique($variantTypes));
                        }

                        if (!empty($rowErrors)) {
                            $errors[] = [
                                'row' => $count,
                                'errors' => $rowErrors
                            ];
                        }
                    }
                    $count++;
                }

                // If any validation errors, return them all at once
                if (!empty($errors)) {
                    return CommonHelper::responseErrorWithData('Validation failed for some rows.', $errors);
                }

                // Fetch countries for name-to-ID lookup
                $countriesMap = Country::all()->pluck('id', 'name')->mapWithKeys(function ($id, $name) {
                    return [strtolower(trim($name)) => $id];
                })->toArray();

                // Proceed with insert when no errors - reuse the same dataRows array
                $count1 = 0;
                foreach ($dataRows as $emapData) {
                    if ($count1 != 0) {

                        // Seller_id is now at index 1
                        $seller_id_check = isset($emapData[1]) ? $emapData[1] : null;
                        $seller = null;
                        if ($seller_id_check) {
                            $seller = Seller::select('name', 'categories', 'require_products_approval')->where('id', $seller_id_check)->first();
                        }
                        $is_approved_by_seller = ($seller && isset($seller->require_products_approval) && $seller->require_products_approval == 0) ? 1 : 0;

                        $product_name = isset($emapData[0]) ? $emapData[0] : '';
                        $seller_id    = isset($emapData[1]) ? $emapData[1] : '';   // [1] Seller_id
                        $category_id  = isset($emapData[2]) ? $emapData[2] : '';   // [2] Category ID

                        // Convert Indicator from descriptive label to numeric value
                        // Column index [3]: Indicator — strip invisible chars before lookup
                        // "Empty" → 0, "Veg" → 1, "Non-veg" → 2; default to 0 if not matched
                        $indicatorRaw = isset($emapData[3]) ? strtolower(preg_replace('/[^a-zA-Z0-9 ]/', '', $emapData[3])) : '';
                        $indicatorMap = ['empty' => 0, 'veg' => 1, 'nonveg' => 2, 'non veg' => 2, '0' => 0, '1' => 1, '2' => 2];
                        $indicator = isset($indicatorMap[trim($indicatorRaw)]) ? $indicatorMap[trim($indicatorRaw)] : 0;

                        $manufacturer = isset($emapData[4]) ? $emapData[4] : '';  // [4] Manufacturer
                        $made_in_name = isset($emapData[5]) ? $emapData[5] : '';  // [5] Made in
                        $made_in = isset($countriesMap[strtolower(trim($made_in_name))]) ? $countriesMap[strtolower(trim($made_in_name))] : $made_in_name;

                        // Convert Is Returnable from descriptive label to numeric value
                        // Column index [6]: Is Returnable?
                        // Strip any invisible characters Excel may embed before comparing
                        $returnRaw = isset($emapData[6]) ? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emapData[6])) : '';
                        $returnMap = ['no' => 0, 'yes' => 1, '0' => 0, '1' => 1];
                        $return_status = isset($returnMap[$returnRaw]) ? $returnMap[$returnRaw] : 0;

                        // Max Return Days is now at index [7] (moved next to Is Returnable)
                        $return_days = (isset($emapData[7]) && $emapData[7] != "") ? $emapData[7] : "0";

                        // Convert Is cancel-able from descriptive label to numeric value
                        // Column index [8]: Is cancel-able
                        // Strip any invisible characters before comparing
                        $cancelRaw = isset($emapData[8]) ? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emapData[8])) : '';
                        $cancelMap = ['no' => 0, 'yes' => 1, '0' => 0, '1' => 1];
                        $cancel_status = isset($cancelMap[$cancelRaw]) ? $cancelMap[$cancelRaw] : 0;

                        // Convert Till which status from descriptive label to numeric value
                        // Column index [9]: Till which status
                        // Strip invisible/non-printable chars but keep spaces for multi-word values
                        $tillStatusValue = isset($emapData[9]) ? strtolower(trim(preg_replace('/[^a-zA-Z0-9 ]/', '', $emapData[9]))) : '';
                        $tillStatusMap = [
                            'payment pending' => 1,
                            'received'        => 2,
                            'processed'       => 3,
                            'shipped'         => 4,
                            'out for delivery' => 5,
                            '1' => 1,
                            '2' => 2,
                            '3' => 3,
                            '4' => 4,
                            '5' => 5,
                        ];
                        $till_status = isset($tillStatusMap[$tillStatusValue]) ? $tillStatusMap[$tillStatusValue] : $tillStatusValue;

                        $description = isset($emapData[10]) ? $emapData[10] : '';  // [10] Description
                        $image = isset($emapData[11]) ? str_replace(' ', '-', strtolower($emapData[11])) : ''; // [11] Main Image

                        // Other Images is now at index [12] (moved next to Main Image)
                        $other_images = (isset($emapData[12])) ? $emapData[12] : "";

                        // Convert Is_approved (Product Status) from descriptive label to numeric value
                        // Column index [13]: Product Status (Is approved?) — strip invisible chars before lookup
                        $approvedRaw = isset($emapData[13]) ? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emapData[13])) : '';
                        $approvedMap = ['no' => 0, 'yes' => 1, '0' => 0, '1' => 1];
                        // If value matched in map use it; otherwise fall back to seller's approval setting
                        $is_approved = isset($approvedMap[$approvedRaw]) ? $approvedMap[$approvedRaw] : $is_approved_by_seller;

                        $brand_id = (isset($emapData[14]) && $emapData[14] != "") ? $emapData[14] : 0; // [14] Brand_id
                        $tax_id   = (isset($emapData[15]) && $emapData[15] != "") ? $emapData[15] : "0"; // [15] tax_id
                        $fssai_lic_no = (isset($emapData[16]) && $emapData[16] != "") ? $emapData[16] : ""; // [16]
                        $barcode  = (isset($emapData[17]) && $emapData[17] != "") ? $emapData[17] : ""; // [17]
                        $tags     = (isset($emapData[18]) && $emapData[18] != "") ? $emapData[18] : $emapData[0]; // [18]
                        // Strip invisible chars before checking stock limit type (same fix as other dropdowns)
                        $stockLimitValue = isset($emapData[19]) ? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emapData[19])) : ''; // [19]
                        $is_unlimited_stock = in_array($stockLimitValue, ['unlimited', 'yes', '1']) ? 1 : 0;
                        $cod_allowed = (isset($emapData[20]) && strtolower(trim($emapData[20])) == 'no') ? 0 : 1; // [20]
                        $max_allowed_quantity = (isset($emapData[21]) && $emapData[21] !== "") ? $emapData[21] : null; // [21]

                        // Active Status column has been removed; product status defaults to 1 (active)
                        $status = 1;

                        $meta_title       = (isset($emapData[22])) ? $emapData[22] : ""; // [22]
                        $meta_keyword     = (isset($emapData[23])) ? $emapData[23] : ""; // [23]
                        $schema_markup    = (isset($emapData[24])) ? $emapData[24] : ""; // [24]
                        $meta_description = (isset($emapData[25])) ? $emapData[25] : ""; // [25]

                        // Variants start at index 26 — strip invisible chars from Type value
                        $type = isset($emapData[26]) ? strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emapData[26])) : "";

                        $row_order = Product::max('row_order') + 1;

                        $product = new Product();
                        $product->name = $product_name;
                        $product->row_order = $row_order;
                        $slug = preg_replace(
                            '/\s+/',
                            '-',
                            trim(
                                preg_replace('/[^\p{L}\p{N} ]/u', '', $emapData[0])
                            )
                        );
                        $count = Product::where('slug', 'LIKE', "{$slug}%")->count();
                        $product->slug = $count ? "{$slug}-{$count}" : $slug;
                        $product->tags = $tags;
                        $product->status = $status;
                        $product->cod_allowed = $cod_allowed;
                        $product->is_unlimited_stock = $is_unlimited_stock;
                        $product->total_allowed_quantity = $max_allowed_quantity;
                        $product->category_id = $category_id;
                        $product->indicator = $indicator;
                        $product->manufacturer = $manufacturer;
                        $product->made_in = $made_in;
                        $product->return_status = $return_status;
                        $product->return_days = $return_days;
                        $product->cancelable_status = $cancel_status;
                        $product->till_status = $till_status;
                        $product->description = $description;
                        $product->image = $image;
                        $product->seller_id = $seller_id;
                        $product->is_approved = $is_approved;
                        $product->brand_id = $brand_id;
                        $product->tax_id = $tax_id;
                        $product->fssai_lic_no = $fssai_lic_no;
                        $product->barcode = $barcode;
                        $product->meta_title = $meta_title;
                        $product->meta_keywords = $meta_keyword;
                        $product->schema_markup = $schema_markup;
                        $product->meta_description = $meta_description;
                        $product->type = $type;
                        $product->save();

                        // Save default language translation for product (using base row values)
                        // Default language assumed to be admin panel default (system_type = 4)
                        $defaultLang = Language::where('system_type', 4)->where('is_default', 1)->first();
                        if ($defaultLang) {
                            $product->saveTranslation($defaultLang->id, [
                                'name'            => $product_name,
                                'tags'            => $tags,
                                'manufacturer'    => $manufacturer,
                                'description'     => $description,
                                'meta_title'      => $meta_title,
                                'meta_keywords'   => $meta_keyword,
                                'schema_markup'   => $schema_markup,
                                'meta_description' => $meta_description,
                            ]);
                        }

                        // Sync tags to tags table and product_tag pivot
                        if (!empty($tags)) {
                            $tagNames = array_filter(array_map('trim', explode(',', (string) $tags)));
                            if (!empty($tagNames)) {
                                $existing = Tag::whereIn('name', $tagNames)->pluck('id', 'name')->toArray();
                                $tagIds = [];
                                foreach ($tagNames as $tagName) {
                                    if ($tagName === '') {
                                        continue;
                                    }
                                    if (isset($existing[$tagName])) {
                                        $tagIds[] = $existing[$tagName];
                                    } else {
                                        $tag = Tag::create(['name' => $tagName]);
                                        $tagIds[] = $tag->id;
                                        $existing[$tagName] = $tag->id;
                                    }
                                }
                                if (!empty($tagIds)) {
                                    $product->tags()->syncWithoutDetaching($tagIds);
                                }
                            }
                        }

                        // Process Other Images
                        if ($other_images != "") {
                            $images = explode(',', $other_images);
                            foreach ($images as $img) {
                                $productImage = new ProductImages();
                                $productImage->product_id = $product->id;
                                $productImage->product_variant_id = 0;
                                $productImage->image = trim($img);
                                $productImage->save();
                            }
                        }

                        // Variants start at index 26 (26 base columns)
                        $index1 = 26;
                        $total_variants = 0;
                        // Same 7-column layout as validation loop
                        $columnsPerVariant = 7;
                        for ($j = 0; $j < 50; $j++) {
                            if (!empty($emapData[$index1])) {
                                $total_variants++;
                            }
                            $index1 = $index1 + $columnsPerVariant;
                        }

                        // Insert variants (starting at index 26)
                        $index = 26;
                        for ($i = 0; $i < $total_variants; $i++) {
                            // Check if we have enough columns in the row
                            if (!isset($emapData[$index])) {
                                break; // Not enough columns, skip remaining variants
                            }

                            $variant = new ProductVariant();
                            $variant->product_id = $product->id;
                            // Use product type for all variants (product type is from first variant, all variants must match)
                            $variant->type = $type; // Use the product type instead of reading from each variant column
                            $index++; // Skip the type column in data (we're using product type instead)
                            $variant->measurement = isset($emapData[$index]) ? $emapData[$index] : 0;
                            $index++;
                            $variant->price = isset($emapData[$index]) ? $emapData[$index] : 0;
                            $index++;
                            // Discounted price is optional — store 0 if not filled
                            $discountedRaw = isset($emapData[$index]) && $emapData[$index] !== '' ? $emapData[$index] : null;
                            $variant->discounted_price = ($discountedRaw !== null && is_numeric($discountedRaw)) ? (float) $discountedRaw : 0;
                            $index++;
                            // Strip invisible chars from Variant Status, keep spaces for "sold out"
                            $serveNorm = isset($emapData[$index]) ? strtolower(trim(preg_replace('/[^a-zA-Z0-9 ]/', '', $emapData[$index]))) : '';
                            $serveForMap = ['available' => 1, 'sold out' => 0, '1' => 1, '0' => 0];
                            $variant->status = isset($serveForMap[$serveNorm]) ? $serveForMap[$serveNorm] : 1;
                            $index++;
                            // If stock limit is unlimited, always store 0 for stock regardless of cell value
                            if ($is_unlimited_stock) {
                                $variant->stock = 0;
                            } else {
                                $variantStock = isset($emapData[$index]) ? $emapData[$index] : 0;
                                // For loose type with limited stock, measurement must not exceed stock
                                if ($type == "loose" && $variant->measurement > $variantStock) {
                                    DB::rollBack();
                                    return CommonHelper::responseError("Row $count1: Variant " . ($i + 1) . " measurement cannot exceed stock");
                                }
                                $variant->stock = $variantStock;
                            }
                            $index++;
                            $variant->stock_unit_id = isset($emapData[$index]) ? $emapData[$index] : 0;
                            $index++;

                            $variant->save();
                        }
                    }
                    $count1++;
                }
                // commit transaction
                DB::commit();
                return CommonHelper::responseSuccess('all_products_imported_successfully');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function getProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $product_id = $request->product_id;

        $product = Product::withAllTranslations()
            ->with('seller', 'images', 'variants.images', 'variants.unit', 'category', 'tax', 'madeInCountry', 'brand', 'tags')
            ->where('id', $product_id)
            ->first();

        if (!$product) {
            return CommonHelper::responseError('product_not_found');
        }

        $productArray = $product->toArray();

        // Keep product-level translations
        $productArray['translations'] = collect($product->getAllActiveLanguageTranslations())
            ->keyBy('language_code')
            ->toArray();

        // Add is_unlimited_stock to each variant
        if (isset($productArray['variants']) && count($productArray['variants'])) {
            foreach ($productArray['variants'] as &$variant) {
                // Copy from product level
                $variant['is_unlimited_stock'] = $productArray['is_unlimited_stock'] ?? 0;
            }
        }

        return CommonHelper::responseWithData($productArray);
    }

    /**
     * Download sample Excel file for bulk upload (template with dropdowns)
     * This is for users to download a blank template to fill in
     */
    public function downloadSampleFileExcel(Request $request)
    {
        // Create new Spreadsheet object
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Base header fields matching the Excel template structure
        $header = [
            'Product Name',           // index 0
            'Seller_id',              // index 1 (moved here from index 10)
            'Category ID',            // index 2
            'Indicator',              // index 3
            'Manufacturer',           // index 4
            'Made in',                // index 5
            'Is Returnable?',         // index 6
            'Max Return Days',        // index 7 (moved here from index 13, next to Is Returnable)
            'Is cancel-able',         // index 8
            'Till which status',      // index 9
            'Description',            // index 10
            'Main Image',             // index 11
            'Other Images',           // index 12 (moved here from index 26, next to Main Image)
            'Product Status (Is approved?)', // index 13
            'Brand_id',               // index 14
            'tax_id',                 // index 15
            'FSSAI Lic. No.',         // index 16
            'Barcode',                // index 17
            'Tags',                   // index 18
            'Stock Limit Type (Limited/Unlimited)', // index 19
            'Is COD allowed?',        // index 20
            'Total allowed quantity', // index 21
            'SEO Meta Title',         // index 22
            'SEO Meta Keywords',      // index 23
            'Schema Markup',          // index 24
            'Meta Description',       // index 25
        ];

        // Add variant columns (3 variants as per Excel template)
        for ($i = 1; $i <= 3; $i++) {
            $header[] = "Type";
            $header[] = "Measurement";
            $header[] = "Price";
            $header[] = "Discounted Price";
            $header[] = "Variant Status";
            $header[] = "Stock";
            $header[] = "Stock Unit ID";
        }

        // Set headers in first row
        $colIndex = 1;
        foreach ($header as $headerValue) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $sheet->setCellValue($colLetter . '1', $headerValue);
            $colIndex++;
        }

        // Style header row
        $sheet->getStyle('A1:' . Coordinate::stringFromColumnIndex(count($header)) . '1')
            ->getFont()->setBold(true);
        $sheet->getRowDimension(1)->setRowHeight(20);

        // Add one example row matching the new column order
        $exampleRow = [
            'Patanjali Biscuits',               // Product Name [0]
            1,                                   // Seller_id [1]
            30,                                  // Category ID [2]
            'Veg',                               // Indicator (Empty, Veg, or Non-veg) [3]
            'Patanjali',                         // Manufacturer [4]
            '1',                                 // Made in (Country ID) [5]
            'No',                                // Is Returnable? (No or Yes) [6]
            2,                                   // Max Return Days [7]
            'Yes',                               // Is cancel-able (No or Yes) [8]
            'Received',                          // Till which status [9]
            'Made with Pure Wheat Flour',        // Description [10]
            'upload/images/slider_(12).jpg',     // Main Image [11]
            'upload/images/other_1.jpg,upload/images/other_2.jpg', // Other Images [12]
            'Yes',                               // Product Status / Is_approved? (No or Yes) [13]
            0,                                   // Brand_id [14]
            0,                                   // tax_id [15]
            '12345678901234',                    // FSSAI Lic. No. [16]
            'B123C456',                          // Barcode [17]
            'biscuit,snack',                     // Tags [18]
            'Unlimited',                         // Stock Limit Type (Limited/Unlimited) [19]
            'Yes',                               // Is COD allowed? [20]
            '5',                                 // Total allowed quantity [21]
            'Delicious Patanjali Biscuits',      // SEO Meta Title [22]
            'biscuits, patanjali, wheat',        // SEO Meta Keywords [23]
            '{}',                                // Schema Markup [24]
            'Buy healthy Patanjali biscuits online.', // Meta Description [25]
            // Variant 1
            'packet', // Type
            1, // Measurement
            100, // Price
            91, // Discounted Price
            'Available', // Serve For (will show as Available or Sold Out)
            10, // Stock
            5, // Stock Unit ID
            // Variant 2
            'packet', // Type
            2, // Measurement
            200, // Price
            92, // Discounted Price
            'Available', // Serve For (will show as Available or Sold Out)
            10, // Stock
            5, // Stock Unit ID
            // Variant 3
            'packet', // Type
            3, // Measurement
            300, // Price
            93, // Discounted Price
            'Available', // Serve For (will show as Available or Sold Out)
            13, // Stock
            3, // Stock Unit ID
        ];

        $rowIndex = 2;
        $colIndex = 1;
        foreach ($exampleRow as $cellValue) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $sheet->setCellValue($colLetter . $rowIndex, $cellValue);
            $colIndex++;
        }


        $this->addDropdownValidation($sheet, 'D', 'D', "Empty,Veg,Non-veg", 1000);          // Indicator
        $this->addDropdownValidation($sheet, 'G', 'G', "No,Yes", 1000);                      // Is Returnable?
        $this->addDropdownValidation($sheet, 'I', 'I', "No,Yes", 1000);                      // Is cancel-able
        $this->addDropdownValidation($sheet, 'J', 'J', "Payment Pending,Received,Processed,Shipped,Out for Delivery", 1000); // Till which status
        $this->addDropdownValidation($sheet, 'N', 'N', "No,Yes", 1000);                      // Product Status (Is approved?)
        $this->addDropdownValidation($sheet, 'T', 'T', "Limited,Unlimited", 1000);           // Stock Limit Type
        $this->addDropdownValidation($sheet, 'U', 'U', "No,Yes", 1000);                      // Is COD Allowed

        // Compute variant dropdown columns dynamically based on new base header count
        // Base columns: 26 (Active Status removed; Seller_id, Max Return Days, Other Images reordered)
        // Each variant block has 7 columns: Type, Measurement, Price, Discounted Price,
        // Variant Status, Stock, Stock Unit ID
        $baseHeaderCount = 26; // number of non-variant columns (1-based: columns A..Z)
        $columnsPerVariant = 7;

        // Type columns for 3 variants
        $typeCols = [];
        for ($i = 0; $i < 3; $i++) {
            $typeCols[] = $baseHeaderCount + 1 + ($i * $columnsPerVariant);
        }
        foreach ($typeCols as $colIndex) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $this->addDropdownValidation($sheet, $colLetter, $colLetter, "packet,loose", 1000);
        }

        // Variant Status (Serve For) columns for 3 variants (offset 4 inside each block)
        $serveForCols = [];
        for ($i = 0; $i < 3; $i++) {
            $serveForCols[] = $baseHeaderCount + 1 + 4 + ($i * $columnsPerVariant);
        }
        foreach ($serveForCols as $colIndex) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $this->addDropdownValidation($sheet, $colLetter, $colLetter, "Available,Sold Out", 1000);
        }

        // Auto-size columns, but constrain long text columns
        $lastColumnIndex = count($header);
        for ($col = 1; $col <= $lastColumnIndex; $col++) {
            $colLetter = Coordinate::stringFromColumnIndex($col);

            // Constrain specific columns that can be very long
            // Description is now at column K (index 11, 1-based); Schema Markup at Y; Meta Description at Z
            if ($colLetter == 'K') { // Description
                $sheet->getColumnDimension($colLetter)->setAutoSize(false);
                $sheet->getColumnDimension($colLetter)->setWidth(50);
                $sheet->getStyle($colLetter . '1:' . $colLetter . $sheet->getHighestRow())
                    ->getAlignment()->setWrapText(true);
            } elseif ($colLetter == 'Y' || $colLetter == 'Z') { // Schema Markup, Meta Description
                $sheet->getColumnDimension($colLetter)->setAutoSize(false);
                $sheet->getColumnDimension($colLetter)->setWidth(40);
                $sheet->getStyle($colLetter . '1:' . $colLetter . $sheet->getHighestRow())
                    ->getAlignment()->setWrapText(true);
            } else {
                $sheet->getColumnDimension($colLetter)->setAutoSize(true);
            }
        }

        // Create Excel writer and save to temporary file
        $writer = new Xlsx($spreadsheet);
        $filename = "products_sample.xlsx";

        // Save to a temporary file first, then return as download response
        $tempFile = tempnam(sys_get_temp_dir(), 'products_sample_');
        $writer->save($tempFile);

        // Return the file as a download response
        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Download existing products data for bulk update
     * This downloads all existing products with their data
     */
    public function downloadProductDataExcel(Request $request)
    {
        // Get products data
        $products = Product::with(['variants', 'images'])->get();
        if (auth()->user()->role_id == Role::$roleSeller) {
            $products = Product::with(['variants', 'images'])->where('seller_id', auth()->user()->seller->id)->get();
        }

        // Create new Spreadsheet object
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Base header fields — same column order as downloadSampleFileExcel, plus ID as first column
        // Note: Active Status removed; Seller_id next to Product Name; Max Return Days next to
        //       Is Returnable; Other Images next to Main Image; Measurement Unit ID removed from variants
        $header = [
            'ID',                                   // A  (1)
            'Product Name',                         // B  (2)
            'Seller_id',                            // C  (3)
            'Category ID',                          // D  (4)
            'Indicator',                            // E  (5)  → dropdown
            'Manufacturer',                         // F  (6)
            'Made in',                              // G  (7)
            'Is Returnable?',                       // H  (8)  → dropdown
            'Max Return Days',                      // I  (9)
            'Is cancel-able',                       // J  (10) → dropdown
            'Till which status',                    // K  (11) → dropdown
            'Description',                          // L  (12)
            'Main Image',                           // M  (13)
            'Other Images',                         // N  (14)
            'Product Status (Is approved?)',        // O  (15) → dropdown
            'Brand_id',                             // P  (16)
            'tax_id',                               // Q  (17)
            'FSSAI Lic. No.',                       // R  (18)
            'Barcode',                              // S  (19)
            'Tags',                                 // T  (20)
            'Stock Limit Type (Limited/Unlimited)', // U  (21) → dropdown
            'Is COD allowed?',                      // V  (22) → dropdown
            'Total allowed quantity',               // W  (23)
            'SEO Meta Title',                       // X  (24)
            'SEO Meta Keywords',                    // Y  (25)
            'Schema Markup',                        // Z  (26)
            'Meta Description',                     // AA (27)
        ];

        // Determine the maximum number of variants across all products
        $maxVariants = $products->map(function ($product) {
            return $product->variants->count();
        })->max();

        // Generate dynamic headers for variants (8 cols each — Measurement Unit ID removed)
        // AB onwards: Product Variant ID, Type, Measurement, Price, Discounted Price,
        //             Variant Status, Stock, Stock Unit ID
        for ($i = 1; $i <= $maxVariants; $i++) {
            $header[] = "Product Variant ID $i";
            $header[] = "Type $i";
            $header[] = "Measurement $i";
            $header[] = "Price $i";
            $header[] = "Discounted Price $i";
            $header[] = "Variant Status $i";
            $header[] = "Stock $i";
            $header[] = "Stock Unit ID $i";
        }

        // Set headers in first row
        $colIndex = 1;
        foreach ($header as $headerValue) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $sheet->setCellValue($colLetter . '1', $headerValue);
            $colIndex++;
        }

        // Style header row
        $lastColLetter = Coordinate::stringFromColumnIndex(count($header));
        $sheet->getStyle('A1:' . $lastColLetter . '1')
            ->getFont()->setBold(true);
        $sheet->getRowDimension(1)->setRowHeight(20);

        // Generate rows for each product
        $rowIndex = 2;
        foreach ($products as $product) {
            $description = str_replace(["\r", "\n"], ' ', $product->description);

            $colIndex = 1;
            // Base product fields
            $indicatorLabel = '';
            switch ((int) $product->indicator) {
                case 0:
                    $indicatorLabel = 'Empty';
                    break;
                case 1:
                    $indicatorLabel = 'Veg';
                    break;
                case 2:
                    $indicatorLabel = 'Non-veg';
                    break;
                default:
                    $indicatorLabel = $product->indicator;
            }
            // Is Returnable: 0=No, 1=Yes
            $returnLabel = ((int) $product->return_status == 1) ? 'Yes' : 'No';
            // Is cancel-able: 0=No, 1=Yes
            $cancelLabel = ((int) $product->cancelable_status == 1) ? 'Yes' : 'No';
            // Till which status: 1=Payment Pending, 2=Received, 3=Processed, 4=Shipped, 5=Out for Delivery
            $tillStatusLabels = [
                1 => 'Payment Pending',
                2 => 'Received',
                3 => 'Processed',
                4 => 'Shipped',
                5 => 'Out for Delivery'
            ];
            $tillStatusLabel = isset($tillStatusLabels[(int) $product->till_status]) ? $tillStatusLabels[(int) $product->till_status] : $product->till_status;
            // Is_approved: 0=No, 1=Yes
            $approvedLabel = ((int) $product->is_approved == 1) ? 'Yes' : 'No';

            // Stock limit as "Unlimited"/"Limited" to match the dropdown values in the sheet
            $isUnlimitedStock = ((int) $product->is_unlimited_stock == 1) ? 'Unlimited' : 'Limited';
            $isCodAllowed     = ((int) $product->cod_allowed == 1) ? 'Yes' : 'No';
            $otherImages      = $product->images->pluck('image')->implode(',');

            // Row data follows the same column order as the header above
            $rowData = [
                $product->id,                        // A  ID
                $product->name,                      // B  Product Name
                $product->seller_id,                 // C  Seller_id
                $product->category_id,               // D  Category ID
                $indicatorLabel,                     // E  Indicator
                $product->manufacturer,              // F  Manufacturer
                $product->made_in,                   // G  Made in
                $returnLabel,                        // H  Is Returnable?
                $product->return_days,               // I  Max Return Days
                $cancelLabel,                        // J  Is cancel-able
                $tillStatusLabel,                    // K  Till which status
                $description,                        // L  Description
                $product->image,                     // M  Main Image
                $otherImages,                        // N  Other Images
                $approvedLabel,                      // O  Product Status (Is approved?)
                $product->brand_id,                  // P  Brand_id
                $product->tax_id,                    // Q  tax_id
                $product->fssai_lic_no,              // R  FSSAI Lic. No.
                $product->barcode,                   // S  Barcode
                $product->tags,                      // T  Tags
                $isUnlimitedStock,                   // U  Stock Limit Type (Limited/Unlimited)
                $isCodAllowed,                       // V  Is COD allowed?
                $product->total_allowed_quantity,    // W  Total allowed quantity
                $product->meta_title,                // X  SEO Meta Title
                $product->meta_keyword,              // Y  SEO Meta Keywords
                $product->schema_markup,             // Z  Schema Markup
                $product->meta_description,          // AA Meta Description
                // NOTE: Active Status column removed
            ];

            foreach ($rowData as $cellValue) {
                $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                $sheet->setCellValue($colLetter . $rowIndex, $cellValue);
                $colIndex++;
            }

            // Add variant data to the row (8 cols per variant: no Measurement Unit ID)
            foreach ($product->variants as $variant) {
                $serveForLabel = ((int) $variant->status == 1) ? 'Available' : 'Sold Out';

                $variantCells = [
                    $variant->id,               // Product Variant ID
                    $variant->type,             // Type
                    $variant->measurement,      // Measurement
                    $variant->price,            // Price
                    $variant->discounted_price, // Discounted Price
                    $serveForLabel,             // Variant Status
                    $variant->stock,            // Stock
                    $variant->stock_unit_id,    // Stock Unit ID
                ];

                foreach ($variantCells as $cellValue) {
                    $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                    $sheet->setCellValue($colLetter . $rowIndex, $cellValue);
                    $colIndex++;
                }
            }

            // Pad remaining variant columns with empty cells so all rows have the same width
            $remainingColumns = ($maxVariants - $product->variants->count()) * 8;
            for ($i = 0; $i < $remainingColumns; $i++) {
                $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                $sheet->setCellValue($colLetter . $rowIndex, '');
                $colIndex++;
            }

            $rowIndex++;
        }

        // Dropdown validations matching the new column layout:
        // E(5)=Indicator, H(8)=Is Returnable?, J(10)=Is cancel-able, K(11)=Till which status,
        // O(15)=Product Status, U(21)=Stock Limit Type, V(22)=Is COD allowed?
        $this->addDropdownValidation($sheet, 'E', 'E', "Empty,Veg,Non-veg", 1000);
        $this->addDropdownValidation($sheet, 'H', 'H', "No,Yes", 1000);
        $this->addDropdownValidation($sheet, 'J', 'J', "No,Yes", 1000);
        $this->addDropdownValidation($sheet, 'K', 'K', "Payment Pending,Received,Processed,Shipped,Out for Delivery", 1000);
        $this->addDropdownValidation($sheet, 'O', 'O', "No,Yes", 1000);
        $this->addDropdownValidation($sheet, 'U', 'U', "Limited,Unlimited", 1000);
        $this->addDropdownValidation($sheet, 'V', 'V', "No,Yes", 1000);

        // Variant dropdown columns (base = 27 cols including ID; 8 cols per variant)
        // Variant 1 starts at col 28; Type is offset +1 = col 29; Variant Status is offset +5 = col 33
        $baseHeaderCount = 27;
        $columnsPerVariant = 8;

        $typeColStart     = $baseHeaderCount + 2; // Type is 2nd col of each variant block
        $serveForColStart = $baseHeaderCount + 6; // Variant Status is 6th col of each variant block

        for ($i = 0; $i < $maxVariants; $i++) {
            $typeColLetter = Coordinate::stringFromColumnIndex($typeColStart + ($i * $columnsPerVariant));
            $this->addDropdownValidation($sheet, $typeColLetter, $typeColLetter, "packet,loose", 1000);

            $serveForColLetter = Coordinate::stringFromColumnIndex($serveForColStart + ($i * $columnsPerVariant));
            $this->addDropdownValidation($sheet, $serveForColLetter, $serveForColLetter, "Available,Sold Out", 1000);
        }

        // Auto-size columns, but constrain long text columns
        $lastColumnIndex = count($header);
        for ($col = 1; $col <= $lastColumnIndex; $col++) {
            $colLetter = Coordinate::stringFromColumnIndex($col);

            // Constrain specific columns that can be very long
            // Description is now at L(12); Schema Markup at Z(26); Meta Description at AA(27)
            if ($colLetter == 'L') { // Description
                $sheet->getColumnDimension($colLetter)->setAutoSize(false);
                $sheet->getColumnDimension($colLetter)->setWidth(50);
                $sheet->getStyle($colLetter . '1:' . $colLetter . $sheet->getHighestRow())
                    ->getAlignment()->setWrapText(true);
            } elseif ($colLetter == 'Z' || $colLetter == 'AA') { // Schema Markup, Meta Description
                $sheet->getColumnDimension($colLetter)->setAutoSize(false);
                $sheet->getColumnDimension($colLetter)->setWidth(40);
                $sheet->getStyle($colLetter . '1:' . $colLetter . $sheet->getHighestRow())
                    ->getAlignment()->setWrapText(true);
            } else {
                $sheet->getColumnDimension($colLetter)->setAutoSize(true);
            }
        }

        // Create Excel writer and save to temporary file
        $writer = new Xlsx($spreadsheet);
        $filename = "products_sample.xlsx";

        // Save to a temporary file first, then return as download response
        $tempFile = tempnam(sys_get_temp_dir(), 'products_');
        $writer->save($tempFile);

        // Return the file as a download response
        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    private function addDropdownValidation($sheet, $colStart, $colEnd, $formulaList, $maxRow = 1000)
    {
        // Convert comma-separated values to Excel formula format: "value1","value2","value3"
        $values = explode(',', $formulaList);
        $formula = '"' . implode('","', $values) . '"';

        // Apply validation to all rows from row 2 to maxRow (skip header row 1)
        // This ensures dropdowns work even when users add new rows
        for ($row = 2; $row <= $maxRow; $row++) {
            // Handle single column or column range
            if ($colStart == $colEnd) {
                // Single column - apply validation directly to each cell
                $cell = $sheet->getCell($colStart . $row);
                $validation = $cell->getDataValidation();
                $validation->setType(DataValidation::TYPE_LIST);
                $validation->setErrorStyle(DataValidation::STYLE_STOP);
                $validation->setAllowBlank(true);
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                $validation->setShowDropDown(true);
                $validation->setFormula1($formula);
            } else {
                // Column range - apply to each column in the range
                $startColIndex = Coordinate::columnIndexFromString($colStart);
                $endColIndex = Coordinate::columnIndexFromString($colEnd);

                for ($col = $startColIndex; $col <= $endColIndex; $col++) {
                    $colLetter = Coordinate::stringFromColumnIndex($col);
                    $cell = $sheet->getCell($colLetter . $row);
                    $validation = $cell->getDataValidation();
                    $validation->setType(DataValidation::TYPE_LIST);
                    $validation->setErrorStyle(DataValidation::STYLE_STOP);
                    $validation->setAllowBlank(true);
                    $validation->setShowInputMessage(true);
                    $validation->setShowErrorMessage(true);
                    $validation->setShowDropDown(true);
                    $validation->setFormula1($formula);
                }
            }
        }
    }
    public function bulkUpdate(Request $request)
    {
        try {
            DB::beginTransaction();

            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:xlsx,xls'
            ]);
            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $filename = $_FILES["file"]["tmp_name"];
            $fileExtension = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));

            // Validate file extension (only Excel files allowed)
            if ($fileExtension != 'xlsx' && $fileExtension != 'xls') {
                return CommonHelper::responseError('Only Excel files (.xlsx, .xls) are allowed.');
            }

            if ($_FILES["file"]["size"] > 0) {
                // Read data from Excel file
                $dataRows = [];
                if ($fileExtension == 'xlsx' || $fileExtension == 'xls') {
                    // Read Excel file
                    $spreadsheet = IOFactory::load($filename);
                    $sheet = $spreadsheet->getActiveSheet();
                    $highestRow = $sheet->getHighestRow();
                    $highestColumnIndex = $sheet->getHighestColumn();
                    $highestColumnNum = Coordinate::columnIndexFromString($highestColumnIndex);

                    // Read header row (row 1)
                    $headerRow = [];
                    for ($colIndex = 1; $colIndex <= $highestColumnNum; $colIndex++) {
                        $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                        $cellValue = $sheet->getCell($colLetter . 1)->getValue();
                        $headerRow[] = $cellValue !== null ? (string) $cellValue : '';
                    }
                    $expectedColumnCount = count($headerRow);
                    $dataRows[] = $headerRow;

                    // Read data rows
                    // Note: Only read rows that actually have data (at least Product ID should be filled)
                    for ($row = 2; $row <= $highestRow; $row++) {
                        $rowData = [];
                        for ($colIndex = 1; $colIndex <= $expectedColumnCount; $colIndex++) {
                            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
                            $cellValue = $sheet->getCell($colLetter . $row)->getValue();
                            $rowData[] = $cellValue !== null ? (string) $cellValue : '';
                        }
                        // Ensure row has same number of columns as header
                        while (count($rowData) < $expectedColumnCount) {
                            $rowData[] = '';
                        }

                        // Skip empty rows - check if ID (first column) is empty
                        if (!empty(trim($rowData[0]))) {
                            $dataRows[] = $rowData;
                        } else {
                            // If we encounter an empty row, stop reading further rows
                            break;
                        }
                    }
                } else {
                    return CommonHelper::responseError('Only Excel files (.xlsx, .xls) are allowed.');
                }

                // Get headers from the first row
                $headers = array_shift($dataRows);

                // Fetch countries for name-to-ID lookup
                $countriesMap = Country::all()->pluck('id', 'name')->mapWithKeys(function ($id, $name) {
                    return [strtolower(trim($name)) => $id];
                })->toArray();

                // ── VALIDATION PASS ────────────────────────────────────────────────────────
                // Validate all rows first before doing any DB writes (same approach as bulkUpload)
                $updateErrors = [];
                $rowNum = 2; // Excel row number (row 1 = header)
                foreach ($dataRows as $row) {
                    $rowNum++;
                    if (count($headers) !== count($row)) {
                        continue;
                    }
                    $rd = array_combine($headers, $row);
                    if (empty($rd['ID'])) {
                        continue;
                    }
                    $rowErrs = [];

                    // --- Required: Product Name ---
                    if (empty(trim($rd['Product Name'] ?? ''))) {
                        $rowErrs[] = 'Product Name is required';
                    } else {
                        // Must be unique, but allow keeping the same name for THIS product
                        $nameExists = Product::where('name', trim($rd['Product Name']))->where('id', '!=', (int) $rd['ID'])->exists();
                        if ($nameExists) {
                            $rowErrs[] = 'Product Name "' . trim($rd['Product Name']) . '" already belongs to another product';
                        }
                    }

                    // --- Required: Seller ID (must be numeric, must exist) ---
                    $rdSellerId = trim($rd['Seller_id'] ?? '');
                    $rdCategoryId = trim($rd['Category ID'] ?? '');
                    if (empty($rdSellerId) || !is_numeric($rdSellerId)) {
                        $rowErrs[] = 'Seller ID is required and must be a valid number';
                    } else {
                        // Check seller exists and that category belongs to the seller
                        $rdSeller = Seller::select('name', 'categories', 'require_products_approval')
                            ->where('id', (int) $rdSellerId)->first();
                        if (empty($rdSeller)) {
                            $rowErrs[] = 'Seller does not exist (check Seller_id)';
                        } elseif (!empty($rdCategoryId) && is_numeric($rdCategoryId)) {
                            // Check category is directly assigned to seller OR via parent chain
                            $rdCatId = (int) $rdCategoryId;
                            $sellerCatIds = array_filter(array_map('trim', explode(',', (string) $rdSeller->categories)));
                            $isCatValid = in_array((string) $rdCatId, $sellerCatIds, true);

                            if (!$isCatValid) {
                                // Walk up the category tree and check if any parent is assigned to seller
                                $currentCat = Category::find($rdCatId);
                                while ($currentCat && $currentCat->parent_id != 0) {
                                    $parentCat = Category::find($currentCat->parent_id);
                                    if ($parentCat && in_array((string) $parentCat->id, $sellerCatIds, true)) {
                                        $isCatValid = true;
                                        break;
                                    }
                                    $currentCat = $parentCat;
                                    if (!$currentCat || $currentCat->id == $rdCatId) {
                                        break;
                                    }
                                }
                            }

                            if (!$isCatValid) {
                                $rowErrs[] = 'Category ID "' . $rdCategoryId . '" is not assigned to this seller (category or its parent must be assigned to the seller)';
                            }
                        }
                    }

                    // --- Required: Category ID ---
                    if (empty($rdCategoryId) || !is_numeric($rdCategoryId)) {
                        $rowErrs[] = 'Category ID is required and must be a valid number';
                    }

                    // --- Required: Description ---
                    if (empty(trim($rd['Description'] ?? ''))) {
                        $rowErrs[] = 'Description is required';
                    }

                    // --- Required: Main Image ---
                    if (empty(trim($rd['Main Image'] ?? ''))) {
                        $rowErrs[] = 'Main Image is required';
                    }

                    // --- Is Returnable ---
                    $retNorm = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rd['Is Returnable?'] ?? ''));
                    if ($retNorm !== '' && !in_array($retNorm, ['0', '1', 'no', 'yes'])) {
                        $rowErrs[] = 'Is Returnable must be 0/1 or No/Yes (got: "' . trim($rd['Is Returnable?']) . '")';
                    }

                    // --- Is cancel-able & Till which status ---
                    $cancelNorm = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rd['Is cancel-able'] ?? ''));
                    if ($cancelNorm !== '' && !in_array($cancelNorm, ['0', '1', 'no', 'yes'])) {
                        $rowErrs[] = 'Is cancel-able must be 0/1 or No/Yes (got: "' . trim($rd['Is cancel-able']) . '")';
                    }
                    if (in_array($cancelNorm, ['1', 'yes'])) {
                        $tillNorm = strtolower(trim(preg_replace('/[^a-zA-Z0-9 ]/', '', $rd['Till which status'] ?? '')));
                        $validTill = ['1', '2', '3', '4', '5', 'payment pending', 'received', 'processed', 'shipped', 'out for delivery'];
                        if (empty($tillNorm) || !in_array($tillNorm, $validTill)) {
                            $rowErrs[] = 'Till which status is empty or invalid (must be: Payment Pending, Received, Processed, Shipped, or Out for Delivery) (got: "' . trim($rd['Till which status'] ?? '') . '")';
                        }
                    }

                    // --- Product Status (Is approved?) ---
                    $appNorm = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rd['Product Status (Is approved?)'] ?? ''));
                    if ($appNorm !== '' && !in_array($appNorm, ['0', '1', 'no', 'yes'])) {
                        $rowErrs[] = 'Product Status must be 0/1 or No/Yes (got: "' . trim($rd['Product Status (Is approved?)'] ?? '') . '")';
                    }

                    // --- Barcode must be unique, excluding THIS product's own barcode ---
                    $rdBarcode = trim($rd['Barcode'] ?? '');
                    if ($rdBarcode !== '') {
                        $barcodeExists = Product::where('barcode', $rdBarcode)
                            ->where('id', '!=', (int) $rd['ID'])
                            ->exists();
                        if ($barcodeExists) {
                            $rowErrs[] = 'Barcode "' . $rdBarcode . '" already belongs to another product. Barcode must be unique.';
                        }
                    }

                    // --- Stock Limit Type ---
                    $stockNorm = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rd['Stock Limit Type (Limited/Unlimited)'] ?? ''));
                    $rowIsUnlimited = in_array($stockNorm, ['unlimited', 'yes', '1']);

                    // --- Variant validations ---
                    $vIdx = 1;
                    $vTypes = [];
                    while (!empty($rd["Product Variant ID {$vIdx}"])) {
                        $vTypeNorm = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rd["Type {$vIdx}"] ?? ''));
                        if (empty($vTypeNorm) || !in_array($vTypeNorm, ['packet', 'loose'])) {
                            $rowErrs[] = "Variant {$vIdx}: Type is empty or invalid (got: \"" . trim($rd["Type {$vIdx}"] ?? '') . '")';
                        } else {
                            $vTypes[] = $vTypeNorm;
                        }

                        // Measurement required and numeric (uniqueness not enforced for updates)
                        $mVal = $rd["Measurement {$vIdx}"] ?? '';
                        if ($mVal === '' || !is_numeric($mVal)) {
                            $rowErrs[] = "Variant {$vIdx}: Measurement is empty or invalid";
                        }

                        // Price required
                        $pVal = $rd["Price {$vIdx}"] ?? '';
                        if ($pVal === '' || !is_numeric($pVal)) {
                            $rowErrs[] = "Variant {$vIdx}: Price is empty or invalid";
                        }

                        // Discounted Price optional — if filled must be numeric and < price
                        $dpVal = $rd["Discounted Price {$vIdx}"] ?? '';
                        if ($dpVal !== '') {
                            if (!is_numeric($dpVal)) {
                                $rowErrs[] = "Variant {$vIdx}: Discounted Price must be a number";
                            } elseif (is_numeric($pVal) && (float) $dpVal >= (float) $pVal) {
                                $rowErrs[] = "Variant {$vIdx}: Discounted Price ({$dpVal}) must be less than Price ({$pVal})";
                            }
                        }

                        // Variant Status
                        $vsNorm = strtolower(trim(preg_replace('/[^a-zA-Z0-9 ]/', '', $rd["Variant Status {$vIdx}"] ?? '')));
                        if (empty($vsNorm) || !in_array($vsNorm, ['0', '1', 'available', 'sold out'])) {
                            $rowErrs[] = "Variant {$vIdx}: Variant Status is empty or invalid (must be Available or Sold Out) (got: \"" . trim($rd["Variant Status {$vIdx}"] ?? '') . '")';
                        }

                        // Stock required only when not unlimited
                        if (!$rowIsUnlimited) {
                            $stVal = $rd["Stock {$vIdx}"] ?? '';
                            if ($stVal === '' || !is_numeric($stVal)) {
                                $rowErrs[] = "Variant {$vIdx}: Stock is empty or invalid";
                            }
                        }

                        $vIdx++;
                    }

                    // All variants must have the same type
                    if (!empty($vTypes) && count(array_unique($vTypes)) > 1) {
                        $rowErrs[] = 'All variants must have the same type. Found: ' . implode(', ', array_unique($vTypes));
                    }

                    if (!empty($rowErrs)) {
                        $updateErrors[] = ['row' => $rowNum, 'errors' => $rowErrs];
                    }
                }

                // Return all validation errors at once before touching the DB
                if (!empty($updateErrors)) {
                    return CommonHelper::responseErrorWithData('Validation failed for some rows.', $updateErrors);
                }

                // ── PROCESSING LOOP ─────────────────────────────────────────────────────────
                foreach ($dataRows as $row) {
                    if (count($headers) !== count($row)) {
                        continue;
                    }
                    $rowData = array_combine($headers, $row);

                    // Skip if ID is empty
                    if (empty($rowData['ID'])) {
                        continue;
                    }

                    // Indicator — strip invisible chars; "Empty"→0, "Veg"→1, "Non-veg"→2; default 0
                    $indicatorRaw = strtolower(preg_replace('/[^a-zA-Z0-9 ]/', '', $rowData['Indicator'] ?? ''));
                    $indicatorMap = ['empty' => 0, 'veg' => 1, 'nonveg' => 2, 'non veg' => 2, '0' => 0, '1' => 1, '2' => 2];
                    $indicator = isset($indicatorMap[trim($indicatorRaw)]) ? $indicatorMap[trim($indicatorRaw)] : 0;

                    // Is Returnable — strip invisible chars
                    $returnRaw = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rowData['Is Returnable?'] ?? ''));
                    $returnMap = ['no' => 0, 'yes' => 1, '0' => 0, '1' => 1];
                    $return_status = isset($returnMap[$returnRaw]) ? $returnMap[$returnRaw] : 0;

                    // Is cancel-able — strip invisible chars
                    $cancelRaw = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rowData['Is cancel-able'] ?? ''));
                    $cancelMap = ['no' => 0, 'yes' => 1, '0' => 0, '1' => 1];
                    $cancel_status = isset($cancelMap[$cancelRaw]) ? $cancelMap[$cancelRaw] : 0;

                    // Till which status — keep spaces for multi-word values
                    $tillRaw = strtolower(trim(preg_replace('/[^a-zA-Z0-9 ]/', '', $rowData['Till which status'] ?? '')));
                    $tillStatusMap = [
                        'payment pending' => 1,
                        'received' => 2,
                        'processed' => 3,
                        'shipped' => 4,
                        'out for delivery' => 5,
                        '1' => 1,
                        '2' => 2,
                        '3' => 3,
                        '4' => 4,
                        '5' => 5,
                    ];
                    $till_status = isset($tillStatusMap[$tillRaw]) ? $tillStatusMap[$tillRaw] : $tillRaw;

                    // Product Status (Is approved?) — strip invisible chars
                    $approvedRaw = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rowData['Product Status (Is approved?)'] ?? ''));
                    $approvedMap = ['no' => 0, 'yes' => 1, '0' => 0, '1' => 1];
                    $is_approved = isset($approvedMap[$approvedRaw]) ? $approvedMap[$approvedRaw] : 0;

                    // Made in — country name to ID lookup
                    $madeInValue = $rowData['Made in'] ?? '';
                    $made_in = isset($countriesMap[strtolower(trim($madeInValue))]) ? $countriesMap[strtolower(trim($madeInValue))] : $madeInValue;

                    // Active Status removed — default to 1 (active)
                    $status = 1;

                    // Stock Limit Type — strip invisible chars
                    $unlimitedStockValue = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rowData['Stock Limit Type (Limited/Unlimited)'] ?? 'limited'));
                    $is_unlimited_stock = in_array($unlimitedStockValue, ['unlimited', 'yes', '1']) ? 1 : 0;

                    // Is COD allowed — strip invisible chars
                    $codRaw = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rowData['Is COD allowed?'] ?? 'yes'));
                    $cod_allowed = ($codRaw === 'no' || $codRaw === '0') ? 0 : 1;

                    $other_images = isset($rowData['Other Images']) ? $rowData['Other Images'] : '';

                    // Update product data
                    $product = Product::updateOrCreate(
                        ['id' => $rowData['ID']],
                        [
                            'name' => $rowData['Product Name'],
                            'category_id' => $rowData['Category ID'],
                            'indicator' => $indicator,
                            'manufacturer' => $rowData['Manufacturer'] ?? '',
                            'made_in' => $made_in,
                            'return_status' => $return_status,
                            'cancelable_status' => $cancel_status,
                            'till_status' => $till_status,
                            'description' => $rowData['Description'] ?? '',
                            'image' => $rowData['Main Image'] ?? '',
                            'seller_id' => !empty($rowData['Seller_id']) && is_numeric($rowData['Seller_id']) ? (int) $rowData['Seller_id'] : null,
                            'is_approved' => $is_approved,
                            'brand_id' => $rowData['Brand_id'] ?? 0,
                            'return_days' => $rowData['Max Return Days'] ?? 0,
                            'tax_id' => $rowData['tax_id'] ?? 0,
                            'fssai_lic_no' => $rowData['FSSAI Lic. No.'] ?? '',
                            'barcode' => $rowData['Barcode'] ?? '',
                            'tags' => $rowData['Tags'] ?? '',
                            'is_unlimited_stock' => $is_unlimited_stock,
                            'cod_allowed' => $cod_allowed,
                            'total_allowed_quantity' => ($rowData['Total allowed quantity'] !== "") ? $rowData['Total allowed quantity'] : null,
                            'status' => $status,
                            'meta_title' => $rowData['SEO Meta Title'] ?? '',
                            'meta_keywords' => $rowData['SEO Meta Keywords'] ?? '',
                            'schema_markup' => $rowData['Schema Markup'] ?? '',
                            'meta_description' => $rowData['Meta Description'] ?? '',
                        ]
                    );

                    // Save default language translation for updated product fields
                    // Uses admin panel default language (system_type = 4), same as bulkUpload
                    $defaultLang = Language::where('system_type', 4)->where('is_default', 1)->first();
                    if ($defaultLang) {
                        $product->saveTranslation($defaultLang->id, [
                            'name'             => $rowData['Product Name'] ?? '',
                            'tags'             => $rowData['Tags'] ?? '',
                            'manufacturer'     => $rowData['Manufacturer'] ?? '',
                            'description'      => $rowData['Description'] ?? '',
                            'meta_title'       => $rowData['SEO Meta Title'] ?? '',
                            'meta_keywords'    => $rowData['SEO Meta Keywords'] ?? '',
                            'schema_markup'    => $rowData['Schema Markup'] ?? '',
                            'meta_description' => $rowData['Meta Description'] ?? '',
                        ]);
                    }

                    // Sync tags to the tags table and product_tag pivot (same as bulkUpload)
                    $tagsRaw = $rowData['Tags'] ?? '';
                    if (!empty($tagsRaw)) {
                        $tagNames = array_filter(array_map('trim', explode(',', (string) $tagsRaw)));
                        if (!empty($tagNames)) {
                            $existing = Tag::whereIn('name', $tagNames)->pluck('id', 'name')->toArray();
                            $tagIds = [];
                            foreach ($tagNames as $tagName) {
                                if ($tagName === '') {
                                    continue;
                                }
                                if (isset($existing[$tagName])) {
                                    $tagIds[] = $existing[$tagName];
                                } else {
                                    $tag = Tag::create(['name' => $tagName]);
                                    $tagIds[] = $tag->id;
                                    $existing[$tagName] = $tag->id;
                                }
                            }
                            if (!empty($tagIds)) {
                                $product->tags()->syncWithoutDetaching($tagIds);
                            }
                        }
                    }

                    // Process Other Images
                    if ($other_images != "") {
                        // Replace existing images with the ones from Excel
                        ProductImages::where('product_id', $product->id)->where('product_variant_id', 0)->delete();
                        $images = explode(',', $other_images);
                        foreach ($images as $img) {
                            $productImage = new ProductImages();
                            $productImage->product_id = $product->id;
                            $productImage->product_variant_id = 0;
                            $productImage->image = trim($img);
                            $productImage->save();
                        }
                    }

                    // Get product type from first variant
                    // Product type should be taken from first variant, and all variants must have the same type
                    $productType = '';
                    $variantIndex = 1;
                    $variantTypes = [];

                    // First pass: collect all variant types to validate they are all the same
                    while (isset($rowData["Product Variant ID {$variantIndex}"]) && !empty($rowData["Product Variant ID {$variantIndex}"])) {
                        $id = isset($rowData["Product Variant ID {$variantIndex}"]) ? (int) $rowData["Product Variant ID {$variantIndex}"] : null;
                        if ($id === null || $id <= 0) {
                            $variantIndex++;
                            continue;
                        }

                        $variantType = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rowData["Type {$variantIndex}"] ?? ''));
                        if (!empty($variantType)) {
                            $variantTypes[] = $variantType;
                            // Get product type from first variant (Type 1)
                            if ($variantIndex == 1 && empty($productType)) {
                                $productType = $variantType;
                            }
                        }
                        $variantIndex++;
                    }

                    // Validate that all variants have the same type
                    if (!empty($variantTypes) && count(array_unique($variantTypes)) > 1) {
                        $uniqueTypes = array_unique($variantTypes);
                        DB::rollBack();
                        return CommonHelper::responseError('All variants must have the same type (either all "packet" or all "loose"). Found mixed types: ' . implode(', ', $uniqueTypes) . ' for product ID: ' . $rowData['ID']);
                    }

                    // Update product type if we have a valid type from first variant
                    if (!empty($productType) && ($productType == 'packet' || $productType == 'loose')) {
                        $product->type = $productType;
                        $product->save();
                    }

                    // Update product variants
                    $variantsData = [];
                    $variantIndex = 1;

                    while (isset($rowData["Product Variant ID {$variantIndex}"]) && !empty($rowData["Product Variant ID {$variantIndex}"])) {
                        // Fetch the variant data from $rowData and assign default values if necessary
                        $id = isset($rowData["Product Variant ID {$variantIndex}"]) ? (int) $rowData["Product Variant ID {$variantIndex}"] : null;
                        // Use product type for all variants (ensures consistency)
                        $type = !empty($productType) ? $productType : strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $rowData["Type {$variantIndex}"] ?? ''));
                        $measurement = $rowData["Measurement {$variantIndex}"] ?? '';
                        $price = is_numeric($rowData["Price {$variantIndex}"] ?? '') ? (float) $rowData["Price {$variantIndex}"] : 0;

                        // Discounted Price optional — store 0 if empty
                        $dpRaw = $rowData["Discounted Price {$variantIndex}"] ?? '';
                        $discounted_price = ($dpRaw !== '' && is_numeric($dpRaw)) ? (float) $dpRaw : 0;

                        // Variant Status — strip invisible chars
                        $serveNorm = strtolower(trim(preg_replace('/[^a-zA-Z0-9 ]/', '', $rowData["Variant Status {$variantIndex}"] ?? '')));
                        $serveForMap = ['available' => 1, 'sold out' => 0, '1' => 1, '0' => 0];
                        $status = isset($serveForMap[$serveNorm]) ? $serveForMap[$serveNorm] : 1;

                        // Stock: if unlimited, always store 0 regardless of cell value
                        if ($is_unlimited_stock) {
                            $stock = 0;
                        } else {
                            $stock = isset($rowData["Stock {$variantIndex}"]) ? (int) $rowData["Stock {$variantIndex}"] : 0;
                            // For loose type, measurement must not exceed stock
                            if ($type == "loose" && $measurement > $stock) {
                                DB::rollBack();
                                return CommonHelper::responseError("ID $id: Variant {$variantIndex} measurement cannot exceed stock");
                            }
                        }

                        $stock_unit_id = isset($rowData["Stock Unit ID {$variantIndex}"]) ? (int) $rowData["Stock Unit ID {$variantIndex}"] : 1;

                        // Skip if ID is null or invalid
                        if ($id === null || $id <= 0) {
                            $variantIndex++;
                            continue;
                        }

                        // Add the validated data to the variantsData array
                        $variantsData[] = [
                            'id' => $id,
                            'product_id' => $product->id,
                            'type' => $type, // Use product type (from first variant)
                            'measurement' => $measurement,
                            'price' => $price,
                            'discounted_price' => $discounted_price,
                            'status' => $status,
                            'stock' => $stock,
                            'stock_unit_id' => $stock_unit_id,
                        ];

                        $variantIndex++;
                    }

                    foreach ($variantsData as $variantData) {
                        ProductVariant::updateOrCreate(
                            ['id' => $variantData['id']],
                            $variantData
                        );
                    }
                }

                DB::commit();
                return CommonHelper::responseSuccess('products_and_variants_updated_successfully');
            } else {
                return CommonHelper::responseError('file_is_empty');
            }
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            return CommonHelper::responseError("Products and variants not updated! Error: " . $e->getMessage());
        }
    }

    public function getProductVariants(Request $request)
    {
        // Set default values for pagination
        $limit = $request->input('per_page', 10);
        $page = $request->input('page', 1); // Default to the first page if not provided
        $offset = ($page - 1) * $limit;

        if ($request->has('limit')) {
            $limit = $request->limit;
            $offset = $request->offset;
        }

        // Step 1: Query the database and retrieve the raw data
        $rawProducts = DB::table('products as p')
            ->select(
                'p.id as id',
                'p.id as product_id',
                'p.name',
                'p.seller_id',
                'p.status',
                'p.tax_id',
                'p.image',
                's.name as seller_name',
                's.id as seller_id',
                'p.indicator',
                'p.manufacturer',
                'p.made_in',
                'pv.id as product_variant_id',
                'pv.type',
                'pv.price',
                'pv.discounted_price',
                'pv.measurement',
                'pv.status as pv_status',
                'pv.stock',
                'pv.stock_unit_id',
                'u.short_code',
                'u.short_code as stock_unit'
            )
            ->join('sellers as s', 'p.seller_id', '=', 's.id')
            ->join('product_variants as pv', 'p.id', '=', 'pv.product_id')
            ->join('units as u', 'pv.stock_unit_id', '=', 'u.id')
            ->leftJoin('product_translations as pt', 'p.id', '=', 'pt.product_id')
            ->where('p.is_unlimited_stock', 0);

        $searchTerm = $request->input('search') ?? $request->input('filter');
        $searchTerm = trim($searchTerm);

        if (!empty($searchTerm)) {
            $rawProducts = $rawProducts->where(function ($query) use ($searchTerm) {
                $noSpaceSearch = str_replace(' ', '', $searchTerm);

                $query->where('p.name', 'LIKE', "%$searchTerm%")
                    ->orWhere('p.description', 'LIKE', "%$searchTerm%")
                    ->orWhere('s.name', 'LIKE', "%$searchTerm%")
                    ->orWhere('pv.id', 'LIKE', "%$searchTerm%")
                    ->orWhere('pv.stock', 'LIKE', "%$searchTerm%")
                    ->orWhere('pv.measurement', 'LIKE', "%$searchTerm%")
                    ->orWhere('pv.type', 'LIKE', "%$searchTerm%")
                    ->orWhere('pt.name', 'LIKE', "%$searchTerm%")
                    // Space-insensitive searches
                    ->orWhere(DB::raw("REPLACE(CONCAT((pv.measurement + 0), u.short_code), ' ', '')"), 'LIKE', "%$noSpaceSearch%");

                $lowerFilter = strtolower($searchTerm);
                if (str_contains($lowerFilter, 'sold') || str_contains($lowerFilter, 'out') || $searchTerm === '0') {
                    $query->orWhere('pv.status', 0);
                } elseif (str_contains($lowerFilter, 'avail') || $searchTerm === '1') {
                    $query->orWhere('pv.status', 1);
                }
            });
        }

        if (auth()->user()->role_id == Role::$roleSeller) {
            $rawProducts = $rawProducts->where('p.seller_id', auth()->user()->seller->id);
        }

        $rawProducts = $rawProducts->distinct()
            ->orderBy('p.id', 'DESC')
            ->orderBy('pv.id', 'DESC')
            ->get();

        // Step 2: Load translations for products and units (Content-Language = single lang, else all)
        $useContentLanguage = $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';
        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        $productIds = collect($rawProducts)->pluck('product_id')->unique()->toArray();
        $unitIds = collect($rawProducts)->pluck('stock_unit_id')->unique()->filter()->toArray();

        $productsWithTranslations = Product::whereIn('id', $productIds)
            ->when($useContentLanguage, fn($q) => $q->withTranslation(), fn($q) => $q->with('translations'))
            ->get()
            ->keyBy('id');

        $unitsWithTranslations = Unit::whereIn('id', $unitIds)
            ->when($useContentLanguage, fn($q) => $q->withTranslation(), fn($q) => $q->with('translations'))
            ->get()
            ->keyBy('id');

        $langId = $useContentLanguage ? app(LanguageService::class)->getCurrentId() : null;

        // Step 3: Group the products and handle loose variants
        $groupedProducts = [];
        foreach ($rawProducts as $product) {
            // Manually append the image_url using the product model accessor
            $productModel = $productsWithTranslations->get($product->product_id);
            if ($productModel) {
                $product->image_url = $productModel->image_url;
                $productFields = (function () {
                    return $this->getTranslatableAttributes();
                })->call($productModel);

                if ($useContentLanguage) {
                    $translation = $productModel->getRelation('translations')->where('language_id', $langId)->first();
                    $transData = ['language_id' => $langId];
                    foreach ($productFields as $field) {
                        $transData[$field] = ($translation && !empty($translation->$field))
                            ? $translation->$field
                            : ($productModel->getAttributeValue($field) ?? '');
                    }
                    $product->product_translations = $transData;
                } else {
                    // All languages: patch each row's empty fields from main table
                    // Returns indexed array → JSON array [{},...]
                    $transArray = $productModel->getRelation('translations')->toArray();
                    foreach ($transArray as &$transData) {
                        foreach ($productFields as $field) {
                            if (empty($transData[$field])) {
                                $transData[$field] = $productModel->getAttributeValue($field) ?? '';
                            }
                        }
                    }
                    $product->product_translations = $transArray;
                }
            } else {
                $product->image_url = null;
                $product->product_translations = $useContentLanguage ? (object) [] : [];
            }

            // Attach unit translations
            $unitModel = $unitsWithTranslations->get($product->stock_unit_id);
            if ($unitModel) {
                $unitFields = (function () {
                    return $this->getTranslatableAttributes();
                })->call($unitModel);

                if ($useContentLanguage) {
                    $translation = $unitModel->getRelation('translations')->where('language_id', $langId)->first();
                    $transData = ['language_id' => $langId];
                    foreach ($unitFields as $field) {
                        $transData[$field] = ($translation && !empty($translation->$field))
                            ? $translation->$field
                            : ($unitModel->getAttributeValue($field) ?? '');
                    }
                    $product->unit_translations = $transData;
                } else {
                    $transArray = $unitModel->getRelation('translations')->toArray();
                    foreach ($transArray as &$transData) {
                        foreach ($unitFields as $field) {
                            if (empty($transData[$field])) {
                                $transData[$field] = $unitModel->getAttributeValue($field) ?? '';
                            }
                        }
                    }
                    $product->unit_translations = $transArray;
                }
            } else {
                $product->unit_translations = $useContentLanguage ? (object) [] : [];
            }

            if (strtolower($product->type) == 'loose') {
                // Group loose type products into a single entry by product_id
                if (isset($groupedProducts[$product->product_id])) {
                    // Concatenate fields for loose products when multiple variants exist
                    $groupedProducts[$product->product_id]['measurement'] .= ', ' . $product->measurement;
                    $groupedProducts[$product->product_id]['price'] .= ',' . $product->price;
                    $groupedProducts[$product->product_id]['discounted_price'] .= ',' . $product->discounted_price;
                    $groupedProducts[$product->product_id]['stock_unit_id'] .= ',' . $product->stock_unit_id;
                    $groupedProducts[$product->product_id]['stock'] += $product->stock;
                } else {
                    // Initialize the first loose variant entry
                    $groupedProducts[$product->product_id] = [
                        'id' => $product->product_id,
                        'product_id' => $product->product_id,
                        'name' => $product->name,
                        'seller_id' => $product->seller_id,
                        'seller_name' => $product->seller_name,
                        'status' => $product->status,
                        'tax_id' => $product->tax_id,
                        'image' => $product->image,
                        'image_url' => $product->image_url,
                        'indicator' => $product->indicator,
                        'manufacturer' => $product->manufacturer,
                        'made_in' => $product->made_in,
                        'product_variant_id' => $product->product_variant_id,
                        'type' => $product->type,
                        'price' => $product->price,
                        'discounted_price' => $product->discounted_price,
                        'measurement' => $product->measurement,
                        'pv_status' => $product->pv_status,
                        'stock' => $product->stock,
                        'stock_unit_id' => $product->stock_unit_id,
                        'short_code' => $product->short_code,
                        'stock_unit' => $product->stock_unit,
                        'translations' => $product->product_translations ?? [],
                        'unit_translations' => $product->unit_translations ?? []
                    ];
                }
            } else {
                // For non-loose variants (packet type), add them as they are
                $groupedProducts[$product->product_variant_id] = [
                    'id' => $product->product_variant_id,
                    'product_id' => $product->product_id,
                    'name' => $product->name,
                    'seller_id' => $product->seller_id,
                    'seller_name' => $product->seller_name,
                    'status' => $product->status,
                    'tax_id' => $product->tax_id,
                    'image' => $product->image,
                    'image_url' => $product->image_url,
                    'indicator' => $product->indicator,
                    'manufacturer' => $product->manufacturer,
                    'made_in' => $product->made_in,
                    'product_variant_id' => $product->product_variant_id,
                    'type' => $product->type,
                    'price' => $product->price,
                    'discounted_price' => $product->discounted_price,
                    'measurement' => $product->measurement,
                    'pv_status' => $product->pv_status,
                    'stock' => $product->stock,
                    'stock_unit_id' => $product->stock_unit_id,
                    'short_code' => $product->short_code,
                    'stock_unit' => $product->stock_unit,
                    'translations' => $product->product_translations ?? [],
                    'unit_translations' => $product->unit_translations ?? []
                ];
            }
        }

        // Step 4: Apply limit and offset after grouping
        $groupedProducts = array_values($groupedProducts); // Ensure it's indexed
        $totalCount = count($groupedProducts);
        $groupedProducts = array_slice($groupedProducts, $offset, $limit);

        return CommonHelper::responseWithData($groupedProducts, $totalCount);
    }

    public function updateVariantStock(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:product_variants,id',
            'stock' => 'required|integer|min:0|max:100000',
        ], [
            'id.required' => 'The product variant ID is required.',
            'id.integer' => 'The product variant ID must be a valid integer.',
            'id.exists' => 'The selected product variant does not exist.',

            'stock.required' => 'The stock quantity must be a valid integer.',
            'stock.integer' => 'The stock quantity must be a valid integer.',
            'stock.min' => 'The stock quantity cannot be less than 0.'
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $variant = ProductVariant::findOrFail($request->id);
        if ($variant->type == 'packet') {

            $variant->stock = $request->stock;
            $variant->save();

            if ($variant->stock <= 0) {
                $variant->status = 0; // here status 0 => "Sold Out" & 1 => "Available"
                $variant->save();
            } else {
                $variant->status = 1; // here status 0 => "Sold Out" & 1 => "Available"
                $variant->save();
            }
        } else if ($variant->type == 'loose') {
            // Update stock value
            $product_id = $variant->product_id;
            $product = Product::find($product_id); // Use find() for a single record

            // Check if product is found
            if ($product) {
                // Update product status based on request stock
                $product->status = $request->stock <= 0 ? 0 : 1; // 0 => "Sold Out", 1 => "Available"
                $product->save(); // Save the product status

                // Fetch all loose variants for the product
                $loose_variants = ProductVariant::where('product_id', $product_id)->get();

                foreach ($loose_variants as $loose_variant) {
                    // Update stock for each loose variant
                    $loose_variant->stock = $request->stock;
                    $loose_variant->status = $request->stock <= 0 ? 0 : 1; // Set status based on stock
                    $loose_variant->save(); // Save each loose variant
                }
            }
        }

        return CommonHelper::responseSuccess('stock_updated_successfully');
    }
}
