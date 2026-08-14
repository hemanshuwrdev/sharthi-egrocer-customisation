<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\BrandDistributorMapping;
use App\Models\MasterProduct;
use App\Models\SellerProduct;
use App\Models\SellerProductSlabPrice;
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

    /**
     * Sarthi: distributor's active product list — every master variant they have
     * marked active (seller_products.status=1) under their assigned brands.
     * Flat list of variants (one row per variant) with master metadata + their
     * seller_product overrides, mirroring the legacy active-products shape.
     */
    public function getActiveProducts()
    {
        $user = auth()->user();
        if (!$user || !$user->seller) {
            return CommonHelper::responseError('seller_not_found');
        }
        $sellerId = $user->seller->id;

        $rows = DB::table('master_product_variants as mpv')
            ->select(
                'mp.id as product_id',
                'mp.name',
                'mp.slug',
                'mp.image',
                'mp.tax_id',
                'mp.brand_id',
                'mp.category_id',
                'mp.hsn',
                'mpv.id as product_variant_id',
                'mpv.sku',
                'mpv.weight',
                'mpv.secondary_unit_value',
                'mpv.unit_id',
                'mpv.secondary_unit_id',
                'sp.id as seller_product_id',
                'sp.seller_id',
                'sp.mrp',
                'sp.selling_price',
                'sp.discounted_price',
                'sp.stock',
                'sp.status as pv_status',
                DB::raw('(SELECT short_code FROM units u WHERE u.id = mpv.unit_id) as stock_unit'),
                DB::raw('(SELECT short_code FROM units u WHERE u.id = mpv.secondary_unit_id) as secondary_unit')
            )
            ->join('master_products as mp', 'mp.id', '=', 'mpv.master_product_id')
            ->join('seller_products as sp', function ($j) use ($sellerId) {
                $j->on('sp.master_product_variant_id', '=', 'mpv.id')
                    ->where('sp.seller_id', $sellerId)
                    ->where('sp.status', 1);
            })
            ->where('mp.status', 1)
            ->where('mpv.status', 1)
            ->orderBy('mp.id', 'DESC')
            ->get();

        return CommonHelper::responseWithData($rows);
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
            'brand_id' => 'required',
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
            'brand_id.required' => 'The Brand field is required.',
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
                    if (isset($request->packet_slab_prices[$index])) {
                        $slabErr = CommonHelper::saveSlabPricesForVariant($variant_id, $request->packet_slab_prices[$index]);
                        if ($slabErr) {
                            DB::rollBack();
                            return CommonHelper::responseError($slabErr);
                        }
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
                    if (isset($request->loose_slab_prices[$index])) {
                        $slabErr = CommonHelper::saveSlabPricesForVariant($variant_id, $request->loose_slab_prices[$index]);
                        if ($slabErr) {
                            DB::rollBack();
                            return CommonHelper::responseError($slabErr);
                        }
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

    /**
     * Sarthi: distributor-side read of a master product (path param style).
     * Forwards to `getProduct()` which scopes results to the logged-in distributor.
     */
    public function edit($id)
    {
        $request = request();
        $request->merge(['product_id' => $id]);
        return $this->getProduct($request);
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
            'brand_id' => 'required',

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
                $data['price'] = $request->packet_price[$index] ?? ($variant->price ?? 0);
                $data['discounted_price'] = $request->discounted_price[$index] ?? ($variant->discounted_price ?? 0);
                $data['status'] = $request->packet_status[$index] ?? ($variant->status ?? 1);
                $data['stock'] = $request->packet_stock[$index] ?? ($variant->stock ?? 0);
                $data['stock_unit_id'] = $request->packet_stock_unit_id[$index] ?? ($variant->stock_unit_id ?? 0);
                $variations[] = $data;
            }
        } else {
            foreach ($request->loose_measurement as $index => $item) {
                $variant = isset($request->variant_id[$index]) ? ProductVariant::find($request->variant_id[$index]) : null;
                $looseStockForIndex = $request->loose_stock[$index] ?? null;
                if ($request->is_unlimited_stock == 0 && $looseStockForIndex !== null && $request->loose_measurement[$index] > $looseStockForIndex) {
                    return CommonHelper::responseError("Variant " . ($index + 1) . " measurement cannot exceed total stock");
                }
                $data = array();
                $data['measurement'] = $request->loose_measurement[$index];
                $data['price'] = $request->loose_price[$index] ?? ($variant->price ?? 0);
                $data['discounted_price'] = $request->loose_discounted_price[$index] ?? ($variant->discounted_price ?? 0);
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
            $product_image_ids = json_decode($request->deleteImageIds ?? '[]') ?: [];
            if (count($product_image_ids) !== 0) {
                foreach ($product_image_ids as $index => $product_image_id) {
                    $image = ProductImages::find($product_image_id);
                    if ($image) {
                        $image->delete();
                    }
                }
            }

            $product = Product::find($request->id);
            if (!$product) {
                DB::rollBack();
                return CommonHelper::responseError('product_not_found');
            }
            if ($isSeller && $product->seller_id != auth()->user()->seller->id) {
                DB::rollBack();
                return CommonHelper::responseError('unauthorized');
            }
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
            if (!$isSeller) {
                $product->seller_id = $request->seller_id;
            }
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
                    $variant->price = $request->packet_price[$index] ?? ($variant->price ?? 0);
                    $variant->purchase_price = $request->packet_purchase_price[$index] ?? ($variant->purchase_price ?? 0);
                    $variant->discounted_price = $request->discounted_price[$index] ?? ($variant->discounted_price ?? 0);
                    $variant->status = $request->packet_status[$index] ?? ($variant->status ?? 1);
                    $variant->stock = ($request->is_unlimited_stock == 0) ? ($request->packet_stock[$index] ?? ($variant->stock ?? 0)) : 0;
                    $variant->stock_unit_id = $request->packet_stock_unit_id[$index] ?? ($variant->stock_unit_id ?? 0);
                    $variant->sku = $request->packet_sku[$index] ?? ($variant->sku ?? null);
                    $variant->secondary_unit_id = $request->packet_secondary_unit_id[$index] ?? ($variant->secondary_unit_id ?? null);
                    $variant->secondary_unit_value = $request->packet_secondary_unit_value[$index] ?? ($variant->secondary_unit_value ?? null);
                    $variant->save();
                    if ($request->hasFile('packet_variant_images_' . $index)) {
                        CommonHelper::uploadProductImages($request->file('packet_variant_images_' . $index), $product->id, $variant->id);
                    }
                    if (isset($request->packet_slab_prices[$index])) {
                        $slabErr = CommonHelper::saveSlabPricesForVariant($variant->id, $request->packet_slab_prices[$index]);
                        if ($slabErr) {
                            DB::rollBack();
                            return CommonHelper::responseError($slabErr);
                        }
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
                    $variant->stock = ($request->is_unlimited_stock == 0) ? ($request->loose_stock[$index] ?? ($variant->stock ?? 0)) : 0;
                    $variant->stock_unit_id = $request->loose_stock_unit_id ?? ($variant->stock_unit_id ?? 0);
                    $variant->status = $request->loose_status[$index] ?? ($variant->status ?? 1);
                    $variant->measurement = $request->loose_measurement[$index];
                    $variant->price = $request->loose_price[$index] ?? ($variant->price ?? 0);

                    $purchasePrice = $request->loose_purchase_price[$index] ?? ($variant->purchase_price ?? 0);
                    if (is_array($purchasePrice)) {
                        $purchasePrice = $purchasePrice[0] ?? 0;
                    }
                    $variant->purchase_price = (float) $purchasePrice;

                    $variant->discounted_price = $request->loose_discounted_price[$index] ?? ($variant->discounted_price ?? 0);

                    $variant->sku = $request->loose_sku[$index] ?? ($variant->sku ?? null);
                    $variant->secondary_unit_id = $request->loose_secondary_unit_id[$index] ?? ($variant->secondary_unit_id ?? null);
                    $variant->secondary_unit_value = $request->loose_secondary_unit_value[$index] ?? ($variant->secondary_unit_value ?? null);
                    $variant->save();
                    if ($request->hasFile('loose_variant_images_' . $index)) {
                        CommonHelper::uploadProductImages($request->file('loose_variant_images_' . $index), $product->id, $variant->id);
                    }
                    if (isset($request->loose_slab_prices[$index])) {
                        $slabErr = CommonHelper::saveSlabPricesForVariant($variant->id, $request->loose_slab_prices[$index]);
                        if ($slabErr) {
                            DB::rollBack();
                            return CommonHelper::responseError($slabErr);
                        }
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
            return CommonHelper::responseError($e->getMessage());
        }
        return CommonHelper::responseSuccess('product_updated_successfully');
    }

    /**
     * Sarthi: distributors don't own master products, so "delete" here means
     * deactivate the distributor's seller_products row for a master variant.
     * Legacy param `id` is treated as master_product_variant_id.
     */
    public function delete(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->seller) {
            return CommonHelper::responseError('seller_not_found');
        }
        if (!isset($request->id)) {
            return CommonHelper::responseError('invalid_request');
        }

        $sp = SellerProduct::where('seller_id', $user->seller->id)
            ->where('master_product_variant_id', $request->id)
            ->first();
        if (!$sp) {
            return CommonHelper::responseError('product_already_deleted');
        }
        $sp->status = 0;
        $sp->save();

        return CommonHelper::responseSuccess('product_deleted_successfully');
    }

    /**
     * Bulk deactivate: `ids` is CSV of master_product_variant_ids.
     */
    public function multipleDelete(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->seller) {
            return CommonHelper::responseError('seller_not_found');
        }
        if (!isset($request->ids)) {
            return CommonHelper::responseError('invalid_request');
        }

        $ids = array_filter(array_map('trim', explode(',', $request->ids)));
        if (empty($ids)) {
            return CommonHelper::responseError('invalid_request');
        }

        SellerProduct::where('seller_id', $user->seller->id)
            ->whereIn('master_product_variant_id', $ids)
            ->update(['status' => 0]);

        return CommonHelper::responseSuccess('selected_all_product_deleted_successfully');
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

    /**
     * Sarthi: distributors don't own master products. Catalog creation is
     * super-admin only. Surface a clear deprecation so the app can route the
     * user to the right place.
     */
    public function bulkUpload(Request $request)
    {
        return CommonHelper::responseError('master_catalog_is_managed_by_super_admin_bulk_upload_unavailable');
    }

    /**
     * Sarthi: bulk update distributor's seller_products overrides from an Excel sheet.
     * Expected headers: product_variant_id, mrp, selling_price, discounted_price, stock, status.
     * Each row upserts the distributor's row for that master_product_variant.
     */
    public function bulkUpdate(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $sellerId = $user->seller->id;
        $assignedBrandIds = BrandDistributorMapping::where('seller_id', $sellerId)
            ->pluck('brand_id')
            ->unique()
            ->all();

        try {
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($request->file('file')->getRealPath());
            $sheet = $spreadsheet->getActiveSheet();
            $rows = $sheet->toArray();
            if (empty($rows)) {
                return CommonHelper::responseError('file_is_empty');
            }

            $headers = array_map(fn($h) => strtolower(trim((string) $h)), array_shift($rows));
            $needed = ['product_variant_id'];
            foreach ($needed as $h) {
                if (!in_array($h, $headers, true)) {
                    return CommonHelper::responseError("missing_column_{$h}");
                }
            }

            $idx = array_flip($headers);
            $updated = 0;
            $skipped = [];

            DB::beginTransaction();
            foreach ($rows as $rowNum => $row) {
                $variantId = isset($idx['product_variant_id']) ? (int) ($row[$idx['product_variant_id']] ?? 0) : 0;
                if (!$variantId) continue;

                $variant = DB::table('master_product_variants as mpv')
                    ->join('master_products as mp', 'mp.id', '=', 'mpv.master_product_id')
                    ->where('mpv.id', $variantId)
                    ->first(['mp.brand_id']);
                if (!$variant || !in_array($variant->brand_id, $assignedBrandIds, false)) {
                    $skipped[] = ['row' => $rowNum + 2, 'reason' => 'brand_not_assigned'];
                    continue;
                }

                $sp = SellerProduct::firstOrNew([
                    'seller_id' => $sellerId,
                    'master_product_variant_id' => $variantId,
                ]);
                foreach (['mrp', 'selling_price', 'discounted_price', 'stock', 'status'] as $field) {
                    if (isset($idx[$field]) && $row[$idx[$field]] !== '' && $row[$idx[$field]] !== null) {
                        $sp->{$field} = $row[$idx[$field]];
                    }
                }
                if (!$sp->exists && !isset($sp->status)) {
                    $sp->status = 0;
                }
                $sp->save();
                $updated++;
            }
            DB::commit();

            return CommonHelper::responseWithData([
                'updated' => $updated,
                'skipped' => $skipped,
                'message' => __('products_and_variants_updated_successfully'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return CommonHelper::responseError($e->getMessage());
        }
    }

    /**
     * Sarthi master catalog: fetch a single master product (with all its variants
     * + the logged-in distributor's overrides) by its master_product_id.
     * `product_id` keeps the legacy URL contract; internally it is a master_products.id.
     */
    public function getProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $seller = auth()->user() ? auth()->user()->seller : null;
        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $brandIds = BrandDistributorMapping::where('seller_id', $seller->id)
            ->pluck('brand_id')
            ->unique()
            ->values()
            ->all();

        $product = MasterProduct::with([
            'brand',
            'parentCompany',
            'category',
            'translations',
            'variants' => function ($q) {
                $q->where('status', 1);
            },
            'variants.unit',
            'variants.secondaryUnit',
        ])
            ->where('id', $request->product_id)
            ->where('status', 1)
            ->whereIn('brand_id', $brandIds)
            ->first();

        if (!$product) {
            return CommonHelper::responseError('product_not_found');
        }

        $variantIds = $product->variants->pluck('id')->all();
        $sellerProducts = SellerProduct::where('seller_id', $seller->id)
            ->whereIn('master_product_variant_id', $variantIds)
            ->get()
            ->keyBy('master_product_variant_id');

        $spIds = $sellerProducts->pluck('id')->filter()->unique()->values();
        $slabsBySp = SellerProductSlabPrice::whereIn('seller_product_id', $spIds)
            ->orderBy('min_qty')
            ->get()
            ->groupBy('seller_product_id');

        $variants = $product->variants->map(function ($v) use ($sellerProducts, $slabsBySp, $product) {
            $sp = $sellerProducts->get($v->id);
            return [
                'product_variant_id' => $v->id,
                'product_id' => $v->master_product_id,
                'sku' => $v->sku,
                'unit' => $v->unit ? $v->unit->name : null,
                'unit_id' => $v->unit_id,
                'secondary_unit' => $v->secondaryUnit ? $v->secondaryUnit->name : null,
                'secondary_unit_id' => $v->secondary_unit_id,
                'secondary_unit_value' => $v->secondary_unit_value,
                'weight' => $v->weight,
                'image' => $v->image ?: $product->image,

                'seller_product_id' => $sp ? $sp->id : null,
                'mrp' => $sp ? (float) $sp->mrp : 0,
                'selling_price' => $sp ? (float) $sp->selling_price : 0,
                'discounted_price' => $sp && $sp->discounted_price !== null ? (float) $sp->discounted_price : null,
                'stock' => $sp ? (float) $sp->stock : 0,
                'status' => $sp ? (int) $sp->status : 0,
                'slab_prices' => $sp && isset($slabsBySp[$sp->id])
                    ? $slabsBySp[$sp->id]->map(fn($s) => [
                        'id' => $s->id,
                        'min_qty' => $s->min_qty,
                        'max_qty' => $s->max_qty,
                        'price' => (float) $s->price,
                    ])->values()
                    : [],
            ];
        })->values();

        return CommonHelper::responseWithData([
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'parent_company' => $product->parentCompany ? $product->parentCompany->name : null,
            'parent_company_id' => $product->parent_company_id,
            'brand' => $product->brand ? $product->brand->name : null,
            'brand_id' => $product->brand_id,
            'category' => $product->category ? $product->category->name : null,
            'category_id' => $product->category_id,
            'hsn' => $product->hsn,
            'image' => $product->image,
            'other_images' => $product->other_images,
            'description' => $product->description,
            'meta_title' => $product->meta_title,
            'meta_keywords' => $product->meta_keywords,
            'meta_description' => $product->meta_description,
            'schema_markup' => $product->schema_markup,
            'type' => $product->type,
            'translations' => $product->translations,
            'variants' => $variants,
        ]);
    }

    /**
     * Sarthi: blank template for distributor's bulk_update. Header-only sheet so
     * the distributor can fill in price/stock for each master variant.
     */
    public function downloadSampleFileExcel(Request $request)
    {
        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $headers = ['product_variant_id', 'mrp', 'selling_price', 'discounted_price', 'stock', 'status'];
        foreach ($headers as $i => $h) {
            $sheet->setCellValueByColumnAndRow($i + 1, 1, $h);
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'sarthi_products_');
        $writer->save($tempFile);

        return response()->download($tempFile, 'sarthi_products_sample.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Sarthi: export this distributor's seller_products joined with master metadata —
     * one row per variant. Same columns as the sample so the file can be edited and re-uploaded.
     */
    public function downloadProductDataExcel(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $rows = DB::table('seller_products as sp')
            ->join('master_product_variants as mpv', 'mpv.id', '=', 'sp.master_product_variant_id')
            ->join('master_products as mp', 'mp.id', '=', 'mpv.master_product_id')
            ->where('sp.seller_id', $user->seller->id)
            ->select(
                'mpv.id as product_variant_id',
                'mp.name as master_product_name',
                'mpv.sku',
                'sp.mrp',
                'sp.selling_price',
                'sp.discounted_price',
                'sp.stock',
                'sp.status'
            )
            ->orderBy('mp.name')
            ->orderBy('mpv.id')
            ->get();

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $headers = ['product_variant_id', 'master_product_name', 'sku', 'mrp', 'selling_price', 'discounted_price', 'stock', 'status'];
        foreach ($headers as $i => $h) {
            $sheet->setCellValueByColumnAndRow($i + 1, 1, $h);
        }

        $rowNum = 2;
        foreach ($rows as $r) {
            $cols = [$r->product_variant_id, $r->master_product_name, $r->sku, $r->mrp, $r->selling_price, $r->discounted_price, $r->stock, $r->status];
            foreach ($cols as $i => $v) {
                $sheet->setCellValueByColumnAndRow($i + 1, $rowNum, $v);
            }
            $rowNum++;
        }

        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $tempFile = tempnam(sys_get_temp_dir(), 'sarthi_my_products_');
        $writer->save($tempFile);

        return response()->download($tempFile, 'sarthi_my_products.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Sarthi: per-variant stock view for the logged-in distributor.
     * One row per master_product_variant the distributor has an override on,
     * filtered by stock-aware search. Replaces the legacy products/product_variants join.
     */
    public function getProductVariants(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->seller) {
            return CommonHelper::responseError('seller_not_found');
        }
        $sellerId = $user->seller->id;

        $limit = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1) ?: 1;
        $offset = ($page - 1) * $limit;
        if ($request->has('limit')) {
            $limit = (int) $request->limit;
            $offset = (int) $request->offset;
        }

        $query = DB::table('master_product_variants as mpv')
            ->select(
                'mp.id as product_id',
                'mp.name',
                'mp.image',
                'mp.tax_id',
                'mp.brand_id',
                'mpv.id as product_variant_id',
                'mpv.sku',
                'mpv.weight',
                'mpv.secondary_unit_value',
                'mpv.unit_id as stock_unit_id',
                'mpv.secondary_unit_id',
                'sp.id as seller_product_id',
                'sp.seller_id',
                'sp.mrp',
                'sp.selling_price as price',
                'sp.discounted_price',
                'sp.stock',
                'sp.status as pv_status',
                DB::raw('(SELECT short_code FROM units u WHERE u.id = mpv.unit_id) as short_code'),
                DB::raw('(SELECT short_code FROM units u WHERE u.id = mpv.unit_id) as stock_unit')
            )
            ->join('master_products as mp', 'mp.id', '=', 'mpv.master_product_id')
            ->join('seller_products as sp', function ($j) use ($sellerId) {
                $j->on('sp.master_product_variant_id', '=', 'mpv.id')
                    ->where('sp.seller_id', $sellerId);
            })
            ->where('mp.status', 1)
            ->where('mpv.status', 1);

        $searchTerm = trim((string) ($request->input('search') ?? $request->input('filter') ?? ''));
        if ($searchTerm !== '') {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('mp.name', 'LIKE', "%$searchTerm%")
                    ->orWhere('mp.hsn', 'LIKE', "%$searchTerm%")
                    ->orWhere('mpv.sku', 'LIKE', "%$searchTerm%");
            });
        }

        $rawProducts = $query->orderBy('mp.id', 'DESC')
            ->orderBy('mpv.id', 'DESC')
            ->get();

        $totalCount = $rawProducts->count();
        $paged = $rawProducts->slice($offset, $limit)->values();
        return CommonHelper::responseWithData($paged, $totalCount);
    }

    /**
     * Sarthi: master-catalog product search for admin screens that need to pick a
     * product but aren't tied to any single distributor (e.g. matching a customer's
     * Product Request to an existing catalog product). Not seller-scoped — separate
     * from getProductVariants() above, which is the distributor's own stock view and
     * hard-requires a seller. Shows every distributor that lists each variant.
     */
    public function searchCatalogVariants(Request $request)
    {
        $limit = (int) $request->input('per_page', 10);
        $page = (int) $request->input('page', 1) ?: 1;
        $offset = ($page - 1) * $limit;
        if ($request->has('limit')) {
            $limit = (int) $request->limit;
            $offset = (int) $request->offset;
        }

        $query = DB::table('master_product_variants as mpv')
            ->select(
                'mp.id as product_id',
                'mp.name',
                'mp.image',
                'mpv.id as product_variant_id',
                'mpv.sku',
                'sp.id as seller_product_id',
                'sp.seller_id',
                's.name as seller_name'
            )
            ->join('master_products as mp', 'mp.id', '=', 'mpv.master_product_id')
            ->join('seller_products as sp', 'sp.master_product_variant_id', '=', 'mpv.id')
            ->leftJoin('sellers as s', 's.id', '=', 'sp.seller_id')
            ->where('mp.status', 1)
            ->where('mpv.status', 1)
            ->where('sp.status', 1);

        $searchTerm = trim((string) ($request->input('search') ?? $request->input('filter') ?? ''));
        if ($searchTerm !== '') {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('mp.name', 'LIKE', "%$searchTerm%")
                    ->orWhere('mp.hsn', 'LIKE', "%$searchTerm%")
                    ->orWhere('mpv.sku', 'LIKE', "%$searchTerm%");
            });
        }

        $rawProducts = $query->orderBy('mp.id', 'DESC')
            ->orderBy('mpv.id', 'DESC')
            ->get();

        $totalCount = $rawProducts->count();
        $paged = $rawProducts->slice($offset, $limit)->values();
        return CommonHelper::responseWithData($paged, $totalCount);
    }

    public function updateVariantStock(Request $request)
    {
        $user = auth()->user();
        if (!$user || !$user->seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $validator = Validator::make($request->all(), [
            'id' => 'required|integer|exists:master_product_variants,id',
            'stock' => 'required|integer|min:0|max:100000',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $sellerProduct = SellerProduct::where('seller_id', $user->seller->id)
            ->where('master_product_variant_id', $request->id)
            ->first();

        if (!$sellerProduct) {
            return CommonHelper::responseError('product_not_owned_by_seller');
        }

        $sellerProduct->stock = $request->stock;
        $sellerProduct->status = $request->stock > 0 ? 1 : 0;
        $sellerProduct->save();

        return CommonHelper::responseSuccess('stock_updated_successfully');
    }
}
