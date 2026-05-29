<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Helpers\ProductHelper;
use App\Http\Controllers\Controller;
use App\Http\Repository\CategoryRepository;
use App\Http\Repository\ProductRepository;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\ProductImages;
use App\Models\ProductVariant;
use App\Models\Section;
use App\Models\Seller;
use App\Models\Setting;
use App\Models\Tax;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\ProductRating;
use App\Models\RatingImages;
use App\Models\RecentlyVisitedProduct;
use App\Traits\HasTranslations;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Response;

class ProductsApiController extends Controller
{
    public $productRepository;
    public $categoryRepository;

    public function __construct(ProductRepository $productRepository, CategoryRepository $categoryRepository)
    {
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
    }
    public function getProducts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required',
            'longitude' => 'required',
        ], [
            'latitude.required' => 'The latitude field is required.',
            'longitude.required' => 'The longitude field is required.'
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $productRatingSetting = (int) (Setting::get_value('product_rating') ?? 0);
            $isProductRatingEnabled = $productRatingSetting === 1;
            $fewQuantityAlertThreshold = (int) (Setting::get_value('few_quantity_left_alert') ?? 0);
            $user_id = $request->user('api-customers') ? $request->user('api-customers')->id : '';

            $limit = ($request->limit) ?? 10;
            $offset = ($request->offset) ?? 0;

            $sort = ($request->sort) ?? 'row_order';
            $order = ($request->order) ?? 'asc';

            // Initialize price range so they are always defined before any early return
            $total_min_price = 0;
            $total_max_price = 0;

            // Get seller IDs deliverable to this lat/long and fetch min/max price range first (before any early returns)
            $seller_ids = CommonHelper::getSellerIds($request->latitude, $request->longitude);
            if (empty($seller_ids)) {
                $lat = (float) $request->latitude;
                $lng = (float) $request->longitude;
                $seller_ids = Seller::query()
                    ->select('sellers.id')
                    ->leftJoin('cities', 'sellers.city_id', '=', 'cities.id')
                    ->where('sellers.status', 1)
                    ->whereExists(function ($q) {
                        $q->select(DB::raw(1))
                            ->from('products')
                            ->whereColumn('products.seller_id', 'sellers.id');
                    })
                    ->whereNotNull('sellers.latitude')
                    ->whereNotNull('sellers.longitude')
                    ->whereRaw('cities.max_deliverable_distance > 0')
                    ->whereRaw(
                        '(6371 * acos(cos(radians(?)) * cos(radians(sellers.latitude)) * cos(radians(sellers.longitude) - radians(?)) + sin(radians(?)) * sin(radians(sellers.latitude)))) <= cities.max_deliverable_distance',
                        [$lat, $lng, $lat]
                    )
                    ->pluck('id')
                    ->toArray();
            } else {
                $seller_ids = is_array($seller_ids) ? $seller_ids : $seller_ids->toArray();
            }
            if (!empty($seller_ids)) {
                $productResult = DB::table('products as p')
                    ->leftJoin('product_variants as pv', 'pv.product_id', '=', 'p.id')
                    ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
                    ->leftJoin('sellers as s', 'p.seller_id', '=', 's.id')
                    ->leftJoin('taxes as tx', 'p.tax_id', '=', 'tx.id')
                    ->where('p.is_approved', 1)
                    ->where('p.status', 1)
                    ->where('c.status', 1)
                    ->where('s.status', 1)
                    ->whereIn('p.seller_id', $seller_ids)
                    ->selectRaw('
                        MIN(
                            IF(
                                pv.discounted_price > 0 AND pv.discounted_price != 0,
                                pv.discounted_price * (1 + COALESCE(tx.percentage, 0) / 100),
                                pv.price * (1 + COALESCE(tx.percentage, 0) / 100)
                            )
                        ) as min_price_with_tax,
                        MAX(
                            IF(
                                pv.discounted_price > 0 AND pv.discounted_price != 0,
                                pv.discounted_price * (1 + COALESCE(tx.percentage, 0) / 100),
                                pv.price * (1 + COALESCE(tx.percentage, 0) / 100)
                            )
                        ) as max_price_with_tax
                    ')
                    ->first();

                if ($productResult && ($productResult->min_price_with_tax !== null || $productResult->max_price_with_tax !== null)) {
                    $total_min_price = (float) ($productResult->min_price_with_tax ?? 0);
                    $total_max_price = (float) ($productResult->max_price_with_tax ?? 0);
                }
            }

            if ($sort == 'new') {
                $sort = 'created_at DESC';
                $price = 'MIN(discounted_price)';
                $price_sort = 'pv.discounted_price  ASC';
            } elseif ($sort == 'old') {
                $sort = 'created_at ASC';
                $price = 'MIN(discounted_price)';
                $price_sort = 'pv.discounted_price  ASC';
            } elseif ($sort == 'high') {
                // Sort by highest variant price INCLUDING tax
                $sort = 'max_price_with_tax DESC';
                $price = 'MAX(if(pv.discounted_price > 0 && pv.discounted_price != 0, pv.discounted_price, pv.price))';
                $price_sort = 'if(pv.discounted_price > 0 && pv.discounted_price != 0, pv.discounted_price, pv.price) DESC';
            } elseif ($sort == 'low') {
                // Sort by lowest variant price INCLUDING tax
                $sort = 'min_price_with_tax ASC';
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

            // Get request parameters
            // Note: category_id is removed, use category_ids (comma-separated) instead
            $seller_id = $request->get('seller_id');
            $brand_id = $request->get('brand_id');
            $country_id = $request->get('country_id');
            $seller_slug = '';
            $where = "";

            // Search filter - search by product name, slug, or tags
            if (isset($request['search']) && $request['search'] != '') {
                $search = trim($request['search']);
                $keywords = preg_split('/\s+/', $search);
                $where .= " AND (";

                $conditions = [];

                foreach ($keywords as $word) {
                    $word = addslashes($word);
                    $conditions[] = "
                        (
                            p.`name` LIKE '%$word%' 
                            OR p.`slug` LIKE '%$word%' 
                            OR p.`tags` LIKE '%$word%'
                        )
                    ";
                }

                $where .= implode(" AND ", $conditions);
                $where .= ")";
            }

            // Seller slug filter with optional category_ids
            if (isset($request['seller_slug']) && !empty($request['seller_slug'])) {
                $seller_slug = $request['seller_slug'];

                // Check if category_ids provided with seller_slug
                if (isset($request['category_ids']) && !empty($request['category_ids'])) {
                    // Parse comma-separated category IDs
                    $category_ids_array = array_map('trim', explode(",", $request['category_ids']));
                    $category_ids_array = array_filter($category_ids_array, 'is_numeric');

                    $seller_category = Seller::where('slug', $seller_slug)->first(['categories']);
                    if (!empty($seller_category)) {
                        $seller_categories = explode(",", $seller_category['categories']);

                        // Filter to only include categories that belong to this seller
                        $valid_category_ids = array_intersect($category_ids_array, $seller_categories);

                        if (empty($valid_category_ids)) {
                            return Response::json(array(
                                'status' => 1,
                                'message' => 'success',
                                'total' => 0,
                                'total_min_price' => (float) ($total_min_price ?? 0),
                                'total_max_price' => (float) ($total_max_price ?? 0),
                                'data' => []
                            ));
                        }

                        // Filter by exact category IDs only (no child categories)
                        $where .= " AND s.`slug` = '$seller_slug' AND p.`category_id` IN (" . implode(",", $valid_category_ids) . ") ";
                    } else {
                        return Response::json(array(
                            'status' => 1,
                            'message' => 'success',
                            'total' => 0,
                            'total_min_price' => (float) ($total_min_price ?? 0),
                            'total_max_price' => (float) ($total_max_price ?? 0),
                            'data' => []
                        ));
                    }
                } else {
                    // No category_ids - get all seller categories and their children
                    $seller_category = Seller::where('slug', $seller_slug)->first(['categories']);
                    if (!empty($seller_category)) {
                        $category_ids = explode(",", $seller_category['categories']);

                        // Query categories based on the provided category IDs
                        $categories = Category::where('status', 1)
                            ->whereIn('id', $category_ids)
                            ->orderBy('id', 'ASC')
                            ->get()
                            ->toArray();

                        // Get all child category IDs
                        $ids = CommonHelper::getCategoryChildIds($categories);

                        // Convert array of category IDs to comma-separated string
                        $category_ids = implode(",", $ids);

                        $where .= " AND s.`slug` =  '$seller_slug' AND p.category_id IN (" . $category_ids . " )";
                    } else {
                        return Response::json(array(
                            'status' => 1,
                            'message' => 'success',
                            'total' => 0,
                            'total_min_price' => (float) ($total_min_price ?? 0),
                            'total_max_price' => (float) ($total_max_price ?? 0),
                            'data' => []
                        ));
                    }
                }
            }

            // Product slug filter
            if (isset($request['slug']) && !empty($request['slug'])) {
                $slug = $request['slug'];
                $where .= " AND p.`slug` =  '$slug' ";
            }

            // Seller ID filter with optional category_ids
            if (isset($request['seller_id']) && !empty($request['seller_id']) && is_numeric($request['seller_id'])) {
                // Check if category_ids provided with seller_id
                if (isset($request['category_ids']) && !empty($request['category_ids'])) {
                    // Parse comma-separated category IDs
                    $category_ids_array = array_map('trim', explode(",", $request['category_ids']));
                    $category_ids_array = array_filter($category_ids_array, 'is_numeric');

                    $seller_category = Seller::where('id', $seller_id)->first(['categories']);
                    if (!empty($seller_category)) {
                        $seller_categories = explode(",", $seller_category['categories']);

                        // Filter to only include categories that belong to this seller
                        $valid_category_ids = array_intersect($category_ids_array, $seller_categories);

                        if (empty($valid_category_ids)) {
                            return Response::json(array(
                                'status' => 1,
                                'message' => 'success',
                                'total' => 0,
                                'total_min_price' => (float) ($total_min_price ?? 0),
                                'total_max_price' => (float) ($total_max_price ?? 0),
                                'data' => []
                            ));
                        }

                        // Filter by exact category IDs only (no child categories)
                        $where .= " AND p.`seller_id` = " . $seller_id . " AND p.`category_id` IN (" . implode(",", $valid_category_ids) . ") ";
                    } else {
                        return Response::json(array(
                            'status' => 1,
                            'message' => 'success',
                            'total' => 0,
                            'total_min_price' => (float) ($total_min_price ?? 0),
                            'total_max_price' => (float) ($total_max_price ?? 0),
                            'data' => []
                        ));
                    }
                } else {
                    // No category_ids - get all seller categories and their children
                    $seller_category = Seller::where('id', $seller_id)->first(['categories']);
                    if (!empty($seller_category)) {
                        $category_ids = explode(",", $seller_category['categories']);

                        // Query categories based on the provided category IDs
                        $categories = Category::where('status', 1)
                            ->whereIn('id', $category_ids)
                            ->orderBy('id', 'ASC')
                            ->get()
                            ->toArray();

                        // Get all child category IDs
                        $ids = CommonHelper::getCategoryChildIds($categories);

                        // Convert array of category IDs to comma-separated string
                        $category_ids = implode(",", $ids);

                        $where .= " AND p.`seller_id` = " . $seller_id . " AND p.category_id IN (" . $category_ids . " )";
                    } else {
                        return Response::json(array(
                            'status' => 1,
                            'message' => 'success',
                            'total' => 0,
                            'total_min_price' => (float) ($total_min_price ?? 0),
                            'total_max_price' => (float) ($total_max_price ?? 0),
                            'data' => []
                        ));
                    }
                }
            }

            // Brand filter
            if (isset($request['brand_id']) && !empty($request['brand_id']) && is_numeric($request['brand_id'])) {
                $where .= " AND p.`brand_id`=" . $brand_id;
            }

            // Country filter
            if (isset($request['country_id']) && !empty($request['country_id']) && is_numeric($request['country_id'])) {
                $where .= " AND p.`made_in`=" . $country_id;
            }

            $products = array();
            $i = 0;

            $products = Product::select(
                'p.*',
                'p.type as d_type',
                's.store_name as seller_name',
                's.slug as seller_slug',
                's.status as seller_status',

                'pv.price',
                'pv.discounted_price',

                DB::raw("if(pv.discounted_price > 0, ceil(((pv.price - pv.discounted_price)/pv.price)*100), 0)  as cal_discount_percentage"),

                DB::raw("ceil((pv.price - pv.discounted_price)) as cal_discount"),

                DB::raw('count(*) as order_counter'),

                'co.name as country_made_in',
                's.longitude',
                's.latitude',
                'cities.max_deliverable_distance',
                'cities.boundary_points',
                'tx.percentage as tax_percentage',
                DB::raw("GROUP_CONCAT(t.name) as tag_names")
            )
                ->from('products as p')
                ->leftJoin("countries as co", "p.made_in", "=", "co.id")
                ->leftJoin('sellers as s', 'p.seller_id', '=', 's.id')
                ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
                ->leftJoin('cities', 's.city_id', '=', 'cities.id')
                ->Join("product_variants as pv", "pv.product_id", "=", "p.id")
                ->leftJoin('product_tag as pt', 'p.id', '=', 'pt.product_id')
                ->leftJoin('tags as t', 'pt.tag_id', '=', 't.id')
                ->leftJoin('taxes as tx', 'p.tax_id', '=', 'tx.id')
                ->where('p.is_approved', 1)
                ->where('p.status', 1)
                ->where('c.status', 1)
                ->where('s.status', 1)
                ->whereIn('p.seller_id', $seller_ids)
                // Calculate min/max variant price INCLUDING tax for each product
                ->selectRaw('
                    MIN(
                        IF(
                            pv.discounted_price > 0 AND pv.discounted_price != 0,
                            pv.discounted_price * (1 + COALESCE(tx.percentage, 0) / 100),
                            pv.price * (1 + COALESCE(tx.percentage, 0) / 100)
                        )
                    ) as min_price_with_tax,
                    MAX(
                        IF(
                            pv.discounted_price > 0 AND pv.discounted_price != 0,
                            pv.discounted_price * (1 + COALESCE(tx.percentage, 0) / 100),
                            pv.price * (1 + COALESCE(tx.percentage, 0) / 100)
                        )
                    ) as max_price_with_tax
                ')
                ->with([
                    'ratings',
                    'brand',
                    'category',
                    'tax',
                    'seller'
                ]);
            // Section order (FIELD) is applied later inside section_id block only when sort is default
            $products = $products->groupBy("p.id");

            // if (isset($request->min_price) && isset($request->max_price) && intval($request->max_price)) {
            //     $products = $products->havingRaw(" min_price > " . intval(intval($request->min_price) - 1) . " and max_price < " . intval(intval($request->max_price) + 1));
            // }
            if ($request->filled('min_price') && $request->filled('max_price')) {

                $min = (int) $request->min_price;
                $max = (int) $request->max_price;

                $products = $products->havingRaw("
                    min_price_with_tax >= $min 
                    AND max_price_with_tax <= $max
            ");
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
            // Filter by category_ids (comma-separated) - only if seller_id or seller_slug not already handling it
            // Each category ID fetches products from its specific category only (no child categories)
            if (isset($request->category_ids) && !empty($request->category_ids)) {
                // Only apply this filter if seller_id/seller_slug is not set
                // (because those already handle category_ids in the $where clause)
                if (empty($request->seller_id) && empty($request->seller_slug)) {
                    // Parse comma-separated category IDs into array
                    $category_ids_array = array_map('trim', explode(",", $request->category_ids));
                    // Filter to keep only numeric IDs
                    $category_ids_array = array_filter($category_ids_array, 'is_numeric');

                    if (!empty($category_ids_array)) {
                        // Filter products by exact category IDs only (no child categories)
                        $products = $products->whereIn('p.category_id', $category_ids_array);
                    }
                }
            }
            if (isset($request->section_id) && $request->section_id != "") {
                $section_id = $request->section_id;
                $section = Section::select("*")->where("id", "=", $section_id)->first();

                $product_ids = CommonHelper::getProductIdsSection($section, $user_id);

                // Sanitize: unique positive integers so filters and ORDER BY work correctly (e.g. sort=high)
                $product_ids_array = array_values(array_unique(array_filter(
                    array_map('intval', explode(",", $product_ids ?? '')),
                    function ($id) {
                        return $id > 0;
                    }
                )));

                if (!empty($product_ids_array)) {
                    $products = $products->whereIn('p.id', $product_ids_array);
                    // Preserve section order only when user did not request a sort (row_order); else sort=high/low/etc. applies
                    if ($sort === 'p.row_order ASC') {
                        $products = $products->orderByRaw(DB::raw("FIELD(p.id, " . implode(',', $product_ids_array) . ")"));
                    }
                }
            }

            if (isset($request->tag_names) && !empty($request->tag_names)) {
                $tagsArray = explode(',', $request->tag_names);
                $tagIds = DB::table('tags')->whereIn('name', $tagsArray)->pluck('id')->toArray();

                $products = $products->havingRaw("SUM(CASE WHEN pt.tag_id IN (" . implode(',', $tagIds) . ") THEN 1 ELSE 0 END) > 0")->where('p.slug', '!=', $request->tag_slug);
            }

            if (isset($request->barcode) && !empty($request->barcode)) {
                $products = $products->where('p.barcode', $request->barcode);
            }
            if ($where != "") {
                $products = $products->whereRaw(substr($where, 4));
            }
            $total = $products->get()->count();

            $products = $products->skip($offset)->take($limit)->orderByRaw($sort)->get();

            $products = $products->makeHidden([
                'row_order',
                'return_status',
                'cancelable_status',
                'till_status',
                'description',
                'status',
                'is_approved',
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

            $i = 0;
            foreach ($products as $row) {
                $taxRate = $row->tax_percentage; // % tax

                // Load variants with unit (translations will be resolved automatically via accessor)
                $variants = ProductVariant::with(['product.tax', 'unit', 'images'])
                    ->where('product_id', $row['id'])
                    ->get();

                // Now sort using the accessor in PHP
                if ($request->sort == 'low') {
                    $variants = $variants->sortBy('final_price_with_tax')->values();
                } elseif ($request->sort == 'high') {
                    $variants = $variants->sortByDesc('final_price_with_tax')->values();
                } elseif ($request->sort == 'discount') {
                    $variants = $variants->sortByDesc(function ($variant) {
                        if ($variant->discounted_price > 0 && $variant->price > 0) {
                            return ceil((($variant->price - $variant->discounted_price) / $variant->price) * 100);
                        }
                        return 0;
                    })->values();
                }

                $variants = $variants->makeHidden(['product_id', 'measurement_unit_id', 'stock_unit_id', 'deleted_at']);
                if (empty($variants)) {
                    continue;
                }

                CommonHelper::getProductDetails($row['id'], $user_id, false);
                $variantArray = array();
                $productType = strtolower((string) ($row->type ?? ''));
                $isPacketType = $productType === 'packet';
                $productUnlimitedStock = (int) ($row->is_unlimited_stock ?? 0);
                $isFewQuantityLeft = false;
                $variantFewQuantityMap = [];
                $row->product_rating = $isProductRatingEnabled;

                if ($fewQuantityAlertThreshold > 0) {
                    foreach ($variants as $variant) {
                        $variantId = $variant->id ?? null;
                        $variantStock = (int) ($variant->stock ?? 0);
                        $variantUnlimitedStock = $isPacketType
                            ? (int) ($variant->is_unlimited_stock ?? 0)
                            : $productUnlimitedStock;

                        $variantHasFewQuantity = false;
                        if ($variantUnlimitedStock === 0 && $variantStock > 0 && $variantStock <= $fewQuantityAlertThreshold) {
                            $variantHasFewQuantity = true;
                            if (!$isPacketType) {
                                $isFewQuantityLeft = true;
                            }
                        }

                        if ($variantId !== null) {
                            $variantFewQuantityMap[$variantId] = $variantHasFewQuantity;
                        }
                    }

                    if ($isPacketType && in_array(true, $variantFewQuantityMap, true)) {
                        $isFewQuantityLeft = true;
                    }
                }

                for ($k = 0; $k < count($variants); $k++) {
                    $currentVariantId = $variants[$k]->id ?? null;
                    $currentVariantFewQuantity = $currentVariantId !== null
                        ? ($variantFewQuantityMap[$currentVariantId] ?? false)
                        : false;

                    $variant = $variants[$k];

                    // Add cart count
                    $variant->cart_count = 0;
                    if ($user_id) {
                        $cart = \App\Models\Cart::where('product_variant_id', $variant->id)->where('user_id', $user_id)->first();
                        if ($cart) {
                            $variant->cart_count = $cart->qty;
                        }
                    }

                    // Get taxable amounts
                    $taxed = \App\Helpers\ProductHelper::getTaxableAmount($variant->id);
                    $variant->discounted_price = CommonHelper::doubleNumber($taxed->taxable_discounted_price ?? $variant->discounted_price);
                    $variant->price = CommonHelper::doubleNumber($taxed->taxable_price ?? $variant->price);
                    $variant->taxable_amount = CommonHelper::doubleNumber($taxed->taxable_amount);

                    // Calculate discount percentage
                    if (!empty($taxed->taxable_price) && $taxed->taxable_price > 0) {
                        $discount = ($taxed->taxable_price - $taxed->taxable_discounted_price);
                        $variant->calc_discount_percentage = round(($discount / $taxed->taxable_price) * 100, 2);
                    } else {
                        $discount = ($variant->price - $variant->discounted_price);
                        $variant->calc_discount_percentage = $variant->price > 0 ? round(($discount / $variant->price) * 100, 2) : 0;
                    }

                    // Add few_quantity_left
                    $variant->few_quantity_left = $isPacketType ? $currentVariantFewQuantity : $isFewQuantityLeft;

                    // Add stock unit name from unit relation (unit is loaded via stock_unit_id)
                    $variant->stock_unit_name = $variant->unit
                        ? ($variant->unit->short_code ?? $variant->unit->name ?? '')
                        : '';

                    // Hide description from nested product and its translations
                    if ($variant->product) {
                        $variant->product->makeHidden(['description']);

                        // Also hide description from product's translations
                        if (isset($variant->product->translations)) {
                            $translations = $variant->product->translations;
                            if (is_object($translations)) {
                                $translationsArray = (array) $translations;
                                unset($translationsArray['description']);
                                $variant->product->translations = (object) $translationsArray;
                            }
                        }
                    }

                    array_push($variantArray, $variant);
                }
                $products[$i]['variants'] = $variantArray;

                $row->rating_count = CommonHelper::productAverageRating($row['id'])['rating_count'];
                $row->average_rating = CommonHelper::productAverageRating($row['id'])['average_rating'];

                $i++;
            }

            if (!empty($products)) {
                $brands = CommonHelper::getBrandsHavingProducts();
                $sizes = CommonHelper::getProductVariantsSize();

                return Response::json(array(
                    'status' => 1,
                    'message' => 'success',
                    'total' => $total,
                    'total_min_price' => (float) ($total_min_price ?? 0),
                    'total_max_price' => (float) ($total_max_price ?? 0),
                    'data' => $products
                ));
            } else {
                return Response::json(array(
                    'status' => 1,
                    'message' => 'success',
                    'total' => 0,
                    'total_min_price' => (float) ($total_min_price ?? 0),
                    'total_max_price' => (float) ($total_max_price ?? 0),
                    'data' => []
                ));
            }
        } catch (\Exception $e) {
            Log::info("Products Error : " . $e->getMessage());
            throw $e;
            return CommonHelper::responseError("Something Went Wrong!");
        }
    }

    public function getProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required_without_all:slug,barcode',
            'slug' => 'required_without_all:id,barcode',
            'barcode' => 'required_without_all:id,slug',
            'latitude' => 'required',
            'longitude' => 'required'
        ], [
            'required' => 'The product :attribute field is required.',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Seller, brand, category, tax, country (made_in) in response: only id and translations (optimized for app)
        HasTranslations::setOnlyIdAndTranslationsFor(['Seller', 'Brand', 'Category', 'Tax', 'Country']);

        $product_id = $request->id;
        $product_slug = $request->slug;
        $product_barcode = $request->barcode;

        $sql = Product::with([
            'variants' => function ($query) {
                $query->select(
                    '*',
                    DB::raw("(SELECT short_code FROM units as u WHERE u.id = stock_unit_id) as stock_unit_name")
                );
            },
            'variants.unit',
            'variants.product.tax',
            'brand',
            'category',
            'tax',
            'seller',
            'madeInCountry'
        ])->select(
            'p.*',
            'p.type as d_type',
            's.id as seller_id',
            's.store_name as seller_name',
            's.slug as seller_slug',
            's.status as seller_status',
            's.latitude',
            's.longitude',
            'co.name as country_made_in',
            'co.id as made_in_id',
            'cities.boundary_points',
            'cities.max_deliverable_distance',
            'c.name as category_name',
            'br.name as brand_name',
            DB::raw("GROUP_CONCAT(t.name) as tag_names")
        )
            ->from('products as p')
            ->leftJoin("countries as co", "p.made_in", "=", "co.id")
            ->leftJoin('sellers as s', 'p.seller_id', '=', 's.id')
            ->leftJoin('cities', 's.city_id', '=', 'cities.id')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
            ->leftJoin('brands as br', 'p.brand_id', '=', 'br.id')
            ->leftJoin('product_tag as pt', 'p.id', '=', 'pt.product_id')
            ->leftJoin('tags as t', 'pt.tag_id', '=', 't.id')
            ->where('s.status', 1)
            ->where('p.is_approved', 1)
            ->where(function ($query) use ($product_id, $product_slug, $product_barcode) {
                if (isset($product_id) && $product_id != null) {
                    $query->where('p.id', $product_id);
                } elseif (isset($product_slug) && $product_slug != null) {
                    $query->where('p.slug', $product_slug);
                } elseif (isset($product_barcode) && $product_barcode != null) {
                    $query->where('p.barcode', $product_barcode);
                }
            })
            ->groupBy('p.id');  // Group by product ID to handle the GROUP_CONCAT

        $product = $sql->first();

        if ($product) {

            $product = $product->makeHidden([
                'row_order',
                'pincodes',
                'pickup_location',
                'tags',
                'seller_slug',
                'seller_status',
                'created_at',
                'updated_at',
                'deleted_at',
                'image',
                'other_images',
                'boundary_points',
                'country_made_in',
                'made_in_id'
            ]);

            $product->images = CommonHelper::getImages($product->id);
            $product->made_in = $product->madeInCountry ? $product->madeInCountry->toArray() : null;
            $product->makeHidden(['madeInCountry']);

            if (isset($product->max_deliverable_distance) && $product->max_deliverable_distance != 0 && $product->max_deliverable_distance != "") {
                if (CommonHelper::isDeliverable($product->max_deliverable_distance, $product->longitude, $product->latitude, $request->longitude, $request->latitude)) {
                    $product->is_deliverable = true;
                } else {
                    $product->is_deliverable = false;
                }
            } else {
                $product->is_deliverable = false;
            }

            $user_id = $request->user('api-customers') ? $request->user('api-customers')->id : '';
            if ($user_id) {
                $fav = Favorite::where('product_id', $product->id)->where('user_id', $user_id)->first();
                $product->is_favorite = !is_null($fav) ? true : false;
            } else {
                $product->is_favorite = false;
            }
            $product->till_status = $product->till_status ?? '';
            $product->seller_name = $product->seller_name ?? '';
            $variants = $product->variants;

            if ($variants->count() == 0) {
                return CommonHelper::responseError(__('no_items_found'));
            }
            foreach ($variants as $key => $variant) {
                $variants = $variants->makeHidden(['product_id', 'measurement_unit_id', 'stock_unit_id', 'deleted_at']);
                if ($variants[$key]->stock <= 0 && $product->is_unlimited_stock == 0) {
                    $variants[$key]->status = 0;
                } else {
                    $variants[$key]->status = intval($variants[$key]->status) ?? 0;
                }
                if ($user_id) {
                    $cart = Cart::where('product_variant_id', $variants[$key]->id)
                        ->where('user_id', $user_id)->first();
                    if ($cart) {
                        $variants[$key]->cart_count = $cart->qty;
                    } else {
                        $variants[$key]->cart_count = 0;
                    }
                } else {
                    $variants[$key]->cart_count = 0;
                }
                $taxed = ProductHelper::getTaxableAmount($variants[$key]['id']);
                $variants[$key]['discounted_price'] = CommonHelper::doubleNumber($taxed->taxable_discounted_price ?? $variants[$key]['discounted_price']);
                $variants[$key]['price'] = CommonHelper::doubleNumber($taxed->taxable_price ?? $variants[$key]['price']);
                $variants[$key]['taxable_amount'] = CommonHelper::doubleNumber($taxed->taxable_amount);
                $variants[$key]->images = CommonHelper::getImages($variants[$key]->product_id, $variants[$key]->id);
                $variants[$key]->stock_unit_name = $variants[$key]->stock_unit_name ?? '';

                // Fix description image URLs in nested variant->product->translations
                if (isset($variants[$key]->product) && isset($variants[$key]->product->translations)) {
                    $translations = $variants[$key]->product->translations;
                    if (is_array($translations) && isset($translations['description'])) {
                        $translations['description'] = CommonHelper::fixDescriptionImageUrls($translations['description']);
                    } elseif (is_object($translations) && isset($translations->description)) {
                        $translations->description = CommonHelper::fixDescriptionImageUrls($translations->description);
                    }
                    $variants[$key]->product->translations = $translations;
                }
            }

            // Get few_quantity_left_alert setting
            $fewQuantityAlertThreshold = (int) (Setting::get_value('few_quantity_left_alert') ?? 0);

            // Determine product type and calculate few_quantity_left for each variant
            $productType = strtolower((string) ($product->type ?? ''));
            $isPacketType = $productType === 'packet';
            $productUnlimitedStock = (int) ($product->is_unlimited_stock ?? 0);
            $isFewQuantityLeft = false;
            $variantFewQuantityMap = [];

            // Calculate few_quantity_left for each variant
            if ($fewQuantityAlertThreshold > 0) {
                foreach ($variants as $variant) {
                    $variantId = $variant->id ?? null;
                    $variantStock = (int) ($variant->stock ?? 0);
                    $variantUnlimitedStock = $isPacketType
                        ? (int) ($variant->is_unlimited_stock ?? 0)
                        : $productUnlimitedStock;

                    $variantHasFewQuantity = false;
                    if ($variantUnlimitedStock === 0 && $variantStock > 0 && $variantStock <= $fewQuantityAlertThreshold) {
                        $variantHasFewQuantity = true;
                        if (!$isPacketType) {
                            $isFewQuantityLeft = true;
                        }
                    }

                    if ($variantId !== null) {
                        $variantFewQuantityMap[$variantId] = $variantHasFewQuantity;
                    }
                }

                // For packet type, check if any variant has few quantity
                if ($isPacketType && in_array(true, $variantFewQuantityMap, true)) {
                    $isFewQuantityLeft = true;
                }
            }

            // Add few_quantity_left directly to each variant
            foreach ($variants as $key => $variant) {
                $currentVariantId = $variant->id ?? null;
                $currentVariantFewQuantity = $currentVariantId !== null
                    ? ($variantFewQuantityMap[$currentVariantId] ?? false)
                    : false;

                // Add few_quantity_left directly to variant
                $variants[$key]->few_quantity_left = $isPacketType ? $currentVariantFewQuantity : $isFewQuantityLeft;
            }

            $product->variants = $variants;
            $product->fssai_lic_img = CommonHelper::getFssaiLicImg();
            $productRatingSetting = (int) (Setting::get_value('product_rating') ?? 0);
            $isProductRatingEnabled = $productRatingSetting === 1;
            $product->product_rating = $isProductRatingEnabled;

            if (isset($product->translations)) {
                $translations = $product->translations;
                if (is_array($translations) && isset($translations['description'])) {
                    $translations['description'] = CommonHelper::fixDescriptionImageUrls($translations['description']);
                } elseif (is_object($translations) && isset($translations->description)) {
                    $translations->description = CommonHelper::fixDescriptionImageUrls($translations->description);
                }
                $product->translations = $translations;
            }
            if (isset($product->description)) {
                $product->description = CommonHelper::fixDescriptionImageUrls($product->description);
            }
            return CommonHelper::responseWithData($product);
        } else {
            return CommonHelper::responseError(__('no_items_found'));
        }
    }


    public function getSimilarProducts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required',
            'category_id' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user_id = $request->user('api-customers') ? $request->user('api-customers')->id : '';


        $product_id = $request['product_id'];
        $category_id = $request['category_id'];

        $limit = $request->get('limit', 6);
        $offset = 0;
        $order = "RAND()";
        $where = '';

        $sql = "SELECT count(p.id) as total FROM `products` p JOIN `sellers`s ON s.id=p.seller_id where p.id != $product_id AND p.category_id = $category_id AND p.is_approved = 1 AND p.status = 1 and s.status = 1  $where ORDER BY $order LIMIT $offset,$limit";
        $total = DB::select(DB::raw($sql));
        if (count($total) > 0) {
            $total = $total[0]->total;
        } else {
            $total = 0;
        }

        $rows = array();

        $sql = "SELECT p.*,s.name as seller_name,s.status as seller_status,(SELECT MIN(pv.price) FROM product_variants pv WHERE pv.product_id=p.id) as price FROM products p  JOIN sellers s on s.id=p.seller_id where p.id != $product_id and p.status=1  and p.is_approved = 1 and  s.status = 1 and category_id = $category_id $where ORDER BY $order LIMIT $offset,$limit";
        $res = DB::select(DB::raw($sql));
        $res = json_decode(json_encode($res), true);

        if (!empty($res)) {
            foreach ($res as $row) {
                $tempRow['id'] = $row['id'];
                $tempRow['seller_id'] = $row['seller_id'];
                $tempRow['seller_name'] = $row['seller_name'];
                $tempRow['tax_id'] = $row['tax_id'];
                $tempRow['row_order'] = $row['row_order'];
                $tempRow['name'] = $row['name'];
                $tempRow['slug'] = $row['slug'];
                $tempRow['category_id'] = $row['category_id'];

                $tempRow['indicator'] = $row['indicator'];
                $tempRow['manufacturer'] = $row['manufacturer'];
                $tempRow['made_in'] = $row['made_in'];
                $tempRow['return_status'] = $row['return_status'];
                $tempRow['cancelable_status'] = $row['cancelable_status'];
                $tempRow['till_status'] = $row['till_status'];
                $tempRow['seller_status'] = $row['seller_status'];
                $tempRow['date_added'] = CommonHelper::formatDateTime($row['created_at']);
                $tempRow['price'] = $row['price'];
                $tempRow['type'] = $row['type'];
                $tempRow['pincodes'] = $row['pincodes'];
                $tempRow['is_approved'] = $row['is_approved'];
                $tempRow['return_days'] = $row['return_days'];
                $tempRow['image'] = (!empty($row['image'])) ? asset('storage/' . $row['image']) : '';

                $otherImages = ProductImages::where('product_id', $row['id'])->where('product_variant_id', 0)->get();
                if (!empty($otherImages)) {
                    for ($j = 0; $j < count($otherImages); $j++) {
                        $tempRow['other_images'][$j] = asset('storage/' . $otherImages[$j]['image']);
                    }
                } else {
                    $tempRow['other_images'] = array();
                }

                if ($row['tax_id'] == 0) {
                    $tempRow['tax_title'] = "";
                    $tempRow['tax_percentage'] = "0";
                } else {

                    $tax1 = Tax::find($row['tax_id']);
                    $tempRow['tax_title'] = $tax1['title'];
                    $tempRow['tax_percentage'] = $tax1['percentage'];
                }

                if ($user_id) {
                    $fav = Favorite::where('product_id', $row['id'])->where('user_id', $user_id)->first();
                    $row['is_favorite'] = !is_null($fav) ? true : false;
                } else {
                    $row['is_favorite'] = false;
                }

                $tempRow['description'] = $row['description'];
                $tempRow['status'] = $row['status'];

                $sql1 = "SELECT *,(SELECT short_code FROM units u WHERE u.id=pv.stock_unit_id) as measurement_unit_name,(SELECT short_code FROM units u WHERE u.id=pv.stock_unit_id) as stock_unit_name FROM product_variants pv WHERE pv.product_id=" . $row['id'] . " ORDER BY pv.status ASC";
                $variants = DB::select(DB::raw($sql1));
                $variants = json_decode(json_encode($variants), true);
                if (empty($variants)) {
                    continue;
                }
                for ($k = 0; $k < count($variants); $k++) {
                    $variantImages = ProductImages::where('product_id', $row['id'])->where('product_variant_id', $variants[$k]['id'])->get();
                    $variants[$k]['images'] = (empty($variantImages)) ? array() : $variantImages;
                    for ($j = 0; $j < count($variantImages); $j++) {
                        $variants[$k]['images'][$j] = !empty($variantImages[$j]['image']) ? asset('storage/' . $variantImages[$j]['image']) : "";
                    }

                    $cart = Cart::where('product_variant_id', $variants[$k]['id'])->where('user_id', $user_id)->first();
                    if ($cart) {
                        $variants[$k]['cart_count'] = $cart['qty'];
                    } else {
                        $variants[$k]['cart_count'] = "0";
                    }
                }
                $tempRow['variants'] = $variants;
                $rows[] = $tempRow;
            }

            $response['total'] = $total;
            $response['data'] = $rows;
            return CommonHelper::responseWithData($response);
        } else {
            return CommonHelper::responseError(__('data_not_found'));
        }
    }

    public function getSearchProducts(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'search' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user_id = $request->user('api-customers') ? $request->user('api-customers')->id : '';

        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'DESC');

        $where = '';
        if (isset($request['search']) && $request['search'] != '') {
            $search = $request['search'];
            $search = str_replace(' ', '%', $search);
            $where = " AND (p.`id` like '%" . $search . "%' OR p.`name` like '%" . $search . "%' OR p.`image` like '%" . $search . "%' OR p.`slug` like '%" . $search . "%' OR p.`description` like '%" . $search . "%')";
        }

        $sql = "SELECT COUNT(p.id) as total FROM `products`p JOIN `sellers` s ON s.id=p.seller_id WHERE p.is_approved = 1 AND p.status = 1 AND s.status = 1 " . $where;

        $total = DB::select(DB::raw($sql));
        if (count($total) > 0) {
            $total = $total[0]->total;
        } else {
            $total = 0;
        }

        $sql = "SELECT p.*,s.name as seller_name,s.status as seller_status FROM `products`p JOIN sellers s ON s.id=p.seller_id WHERE p.is_approved = 1 AND p.status = 1 AND s.status = 1 " . $where;
        $res = DB::select(DB::raw($sql));
        $res = json_decode(json_encode($res), true);

        $products = array();
        $i = 0;

        foreach ($res as $row) {
            $sql = "SELECT *,(SELECT short_code FROM units u WHERE u.id=pv.stock_unit_id) as measurement_unit_name,(SELECT short_code FROM units u WHERE u.id=pv.stock_unit_id) as stock_unit_name FROM product_variants pv WHERE pv.product_id=" . $row['id'] . " ORDER BY pv.status ASC";
            $variants = DB::select(DB::raw($sql));
            $variants = json_decode(json_encode($variants), true);
            if (empty($variants)) {
                continue;
            }

            if ($user_id) {
                $fav = Favorite::where('product_id', $row['id'])->where('user_id', $user_id)->first();
                $row['is_favorite'] = !is_null($fav) ? true : false;
            } else {
                $row['is_favorite'] = false;
            }


            $row['type'] = (isset($row['type']) == null) ? "" : $row['type'];
            $row['pincodes'] = (isset($row['pincodes']) == null) ? "" : $row['pincodes'];
            $row['is_approved'] = (isset($row['is_approved']) == null) ? "" : $row['is_approved'];
            $row['seller_id'] = (isset($row['seller_id']) == null) ? "" : $row['seller_id'];

            $otherImages = ProductImages::where('product_id', $row['id'])->where('product_variant_id', 0)->get();
            $row['other_images'] = (empty($otherImages)) ? array() : $otherImages;
            for ($j = 0; $j < count($otherImages); $j++) {
                $row['other_images'][$j] = asset('storage/' . $row['other_images'][$j]['image']);
            }
            if ($row['tax_id'] == 0) {
                $row['tax_title'] = "";
                $row['tax_percentage'] = "0";
            } else {
                $tax1 = Tax::find($row['tax_id']);
                $row['tax_title'] = (!empty($tax1['title'])) ? $tax1['title'] : "";
                $row['tax_percentage'] = (!empty($tax1['percentage'])) ? $tax1['percentage'] : "0";
            }
            $row['image'] = asset('storage/' . $row['image']);
            $product[$i] = $row;
            for ($k = 0; $k < count($variants); $k++) {
                $variantImages = ProductImages::where('product_id', $row['id'])->where('product_variant_id', $variants[$k]['id'])->get();
                $variants[$k]['images'] = (empty($variantImages)) ? array() : $variantImages;
                for ($j = 0; $j < count($variantImages); $j++) {
                    $variants[$k]['images'][$j] = asset('storage/' . $variantImages[$j]['image']);
                }

                $cart = Cart::where('product_variant_id', $variants[$k]['id'])->where('user_id', auth()->user()->id)->first();
                if ($cart) {
                    $variants[$k]['cart_count'] = $cart['qty'];
                } else {
                    $variants[$k]['cart_count'] = "0";
                }
            }
            $product[$i]['variants'] = $variants;
            $i++;
        }
        if (empty($product)) {
            return CommonHelper::responseError(__('no_products_available'));
        } else {
            $response['total'] = $total;
            $response['data'] = array_values($product);
            return CommonHelper::responseWithData($response);
        }
    }

    public function getAllProductNames(Request $request)
    {

        $sql = "SELECT p.name FROM `products` p JOIN sellers s on s.id = p.seller_id where p.is_approved = 1 AND p.status = 1 AND s.status = 1";
        $res = DB::select(DB::raw($sql));
        $res = json_decode(json_encode($res), true);

        $rows = $tempRow = $blog_array = $blog_array1 = array();
        foreach ($res as $row) {
            $tempRow['name'] = $row['name'];
            $rows[] = $tempRow;
        }
        $names = array_column($rows, 'name');

        $pr_names = implode(",", $names);
        $pr_name = explode(",", $pr_names);

        return CommonHelper::responseWithData($pr_name);
    }
    public function productRatingSave(Request $request)
    {
        $validator = Validator::make($request->all(), [
            // 'user_id' => 'required',
            'rate' => 'required',
            'product_id' => ['required', Rule::unique('product_ratings')->where(function ($query) use ($request) {
                return $query->where('user_id', auth()->user()->id);
            })],
            'image.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $product_rating = new ProductRating();
        $product_rating->product_id = $request->product_id;
        $product_rating->user_id = auth()->user()->id;
        $product_rating->rate = $request->rate;
        $product_rating->review = $request->review ?? '';
        $product_rating->status = 1;
        $product_rating->save();
        if ($request->hasFile('image')) {
            CommonHelper::uploadRatingImages($request->file('image'), $product_rating->id);
        }
        $data = ProductRating::with('user', 'images')->where('id', $product_rating->id)->get();
        return CommonHelper::responseSuccessWithData("Product Rating Saved Successfully!", $data);
    }

    public function productRatingEdit(Request $request)
    {
        $id = $request->id;
        $product_rating = ProductRating::with('images')->where('id', $id)->first();
        //log::info('product edit function :=> ',[$product]);
        if (!$product_rating) {
            return CommonHelper::responseError("Product Rating Not found!");
        }
        return CommonHelper::responseWithData($product_rating);
    }

    public function productRatingUpdate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'rate' => 'required',
            'image.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        $product_image_ids = json_decode($request->deleteImageIds);
        // Check if $product_image_ids is not null and is an array or countable
        if (!is_null($product_image_ids) && (is_array($product_image_ids) || $product_image_ids instanceof Countable)) {
            // Check if $product_image_ids is not empty
            if (count($product_image_ids) !== 0) {
                foreach ($product_image_ids as $index => $product_image_id) {
                    $image = RatingImages::find($product_image_id);
                    if ($image) {
                        $image->delete();
                    }
                }
            }
        }
        $product_rating = ProductRating::find($request->id);
        $product_rating->rate = $request->rate;
        $product_rating->review = $request->review ?? '';
        $product_rating->status = 1;
        $product_rating->save();
        if ($request->hasFile('image')) {
            CommonHelper::uploadRatingImages($request->file('image'), $product_rating->id);
        }
        $data = ProductRating::with('user', 'images')->where('id', $request->id)->get();
        return CommonHelper::responseSuccessWithData("Product Updated Successfully!", $data);
    }

    public function productRatingsList(Request $request)
    {
        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'DESC');

        $product_id = $request->product_id;
        if ($product_id != null) {
            $productRatings = ProductRating::with('user', 'images')->where('product_id', $product_id);
            $total = $productRatings->count();
            $productRatingsData['average_rating'] = CommonHelper::productAverageRating($product_id)['average_rating'];
            $productRatingsData['one_star_rating'] = CommonHelper::productAverageRating($product_id)['one_star_rating'];
            $productRatingsData['two_star_rating'] = CommonHelper::productAverageRating($product_id)['two_star_rating'];
            $productRatingsData['three_star_rating'] = CommonHelper::productAverageRating($product_id)['three_star_rating'];
            $productRatingsData['four_star_rating'] = CommonHelper::productAverageRating($product_id)['four_star_rating'];
            $productRatingsData['five_star_rating'] = CommonHelper::productAverageRating($product_id)['five_star_rating'];
            $ratings = $productRatings
                ->orderBy($sort, $order)
                ->skip($offset)
                ->take($limit)
                ->get()
                ->map(function ($item) {

                    $data = $item->toArray();

                    //  format updated_at
                    $data['updated_at'] = CommonHelper::formatDateTime($item->updated_at);

                    return $data;
                });

            $productRatingsData['rating_list'] = $ratings;
            return CommonHelper::responseWithData($productRatingsData, $total);
        } else {
            return CommonHelper::responseError("Please select product first");
        }
    }
    public function productRatingImageList(Request $request)
    {
        $limit = $request->get('limit', 10);
        $offset = $request->get('offset', 0);

        $sort = $request->get('sort', 'id');
        $order = $request->get('order', 'DESC');

        $product_id = $request->product_id;
        if ($product_id != null) {
            $productRatingImages = ProductRating::with('images')->where('product_id', $product_id)->get();
            if ($productRatingImages->isNotEmpty()) {
                $images = $productRatingImages->pluck('images')->flatten();
                $total = $images->count();
                $images = $productRatingImages->pluck('images')->flatten()->skip($offset)->take($limit);
                $RatingImages = [];
                foreach ($images as $image) {
                    $RatingImages[] = $image->image_url;
                }
                return CommonHelper::responseWithData($RatingImages, $total);
            }
            return CommonHelper::responseError("Product not available");
        } else {
            return CommonHelper::responseError("Please select product first");
        }
    }

    public function getSeoThings(Request $request)
    {
        $slug = $request->input('slug');

        $product = Product::withTranslation()
            ->select('id', 'meta_title', 'meta_keywords', 'meta_description', 'schema_markup', 'image')
            ->where('slug', $slug)
            ->first();

        if (!$product) {
            return CommonHelper::responseError("Product not available");
        }
        $seoThings = [];
        $seoThings['meta_title'] = $product->meta_title;
        $seoThings['meta_keywords'] = $product->meta_keywords;
        $seoThings['meta_description'] = $product->meta_description;
        $seoThings['schema_markup'] = $product->schema_markup;
        $seoThings['og_image'] = $product->image_url;
        $seoThings['favicon'] = Setting::get_value('favicon') ? asset('storage/' . Setting::get_value('favicon')) : '';

        return CommonHelper::responseWithData($seoThings);
    }

    public function getRecentlyVisitedProducts(Request $request)
    {
        $user = $request->user('api-customers');
        if (!$user) {
            return CommonHelper::responseError('User authentication required.');
        }

        $user_id = $user->id;
        $exclude_product_id = $request->get('product_id');

        try {
            // Get recently visited product IDs for this user, ordered by most recent
            $recentlyVisitedQuery = RecentlyVisitedProduct::where('user_id', $user_id)
                ->orderBy('visited_at', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(10);

            if (!empty($exclude_product_id)) {
                $recentlyVisitedQuery->where('product_id', '!=', $exclude_product_id);
            }

            $recentlyVisited = $recentlyVisitedQuery->pluck('product_id')->toArray();

            if (empty($recentlyVisited)) {
                return CommonHelper::responseWithData([], 0);
            }

            $products = Product::select(
                'p.*',
                'p.type as d_type',
                's.store_name as seller_name',
                's.slug as seller_slug',
                's.status as seller_status',
                'pv.price',
                'pv.discounted_price',
                DB::raw("if(pv.discounted_price > 0, ceil(((pv.price - pv.discounted_price)/pv.price)*100), 0)  as cal_discount_percentage"),
                DB::raw("ceil((pv.price - pv.discounted_price)) as cal_discount"),
                DB::raw('count(*) as order_counter'),
                'co.name as country_made_in',
                'tx.percentage as tax_percentage',
                DB::raw("GROUP_CONCAT(t.name) as tag_names")
            )
                ->from('products as p')
                ->leftJoin("countries as co", "p.made_in", "=", "co.id")
                ->leftJoin('sellers as s', 'p.seller_id', '=', 's.id')
                ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
                ->Join("product_variants as pv", "pv.product_id", "=", "p.id")
                ->leftJoin('product_tag as pt', 'p.id', '=', 'pt.product_id')
                ->leftJoin('tags as t', 'pt.tag_id', '=', 't.id')
                ->leftJoin('taxes as tx', 'p.tax_id', '=', 'tx.id')
                ->where('p.is_approved', 1)
                ->where('p.status', 1)
                ->where('c.status', 1)
                ->where('s.status', 1)
                ->whereIn('p.id', $recentlyVisited)
                ->with('ratings')
                ->selectRaw(
                    '
        MIN(IF(pv.discounted_price > 0, pv.discounted_price, pv.price)) as min_price,
        MAX(IF(pv.discounted_price > 0, pv.discounted_price, pv.price)) as max_price'
                )
                ->groupBy('p.id')
                ->orderByRaw("FIELD(p.id, " . implode(',', $recentlyVisited) . ")")
                ->get();

            $total = Product::whereIn('p.id', $recentlyVisited)
                ->where('p.is_approved', 1)
                ->where('p.status', 1)
                ->from('products as p')
                ->leftJoin('sellers as s', 'p.seller_id', '=', 's.id')
                ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
                ->where('c.status', 1)
                ->where('s.status', 1)
                ->count();

            $products = $products->makeHidden([
                'row_order',
                'return_status',
                'cancelable_status',
                'till_status',
                'description',
                'status',
                'is_approved',
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

            $productRatingSetting = (int) (Setting::get_value('product_rating') ?? 0);
            $isProductRatingEnabled = $productRatingSetting === 1;
            $fewQuantityAlertThreshold = (int) (Setting::get_value('few_quantity_left_alert') ?? 0);

            $i = 0;
            foreach ($products as $row) {
                $variants = ProductVariant::with(['product.tax', 'unit', 'images'])
                    ->where('product_id', $row['id'])
                    ->get();

                if ($request->sort == 'low') {
                    $variants = $variants->sortBy('final_price_with_tax')->values();
                } elseif ($request->sort == 'high') {
                    $variants = $variants->sortByDesc('final_price_with_tax')->values();
                } elseif ($request->sort == 'discount') {
                    $variants = $variants->sortByDesc(function ($variant) {
                        if ($variant->discounted_price > 0 && $variant->price > 0) {
                            return ceil((($variant->price - $variant->discounted_price) / $variant->price) * 100);
                        }
                        return 0;
                    })->values();
                }

                $variants = $variants->makeHidden(['product_id', 'status', 'measurement_unit_id', 'stock_unit_id', 'deleted_at']);
                if (empty($variants)) {
                    continue;
                }

                CommonHelper::getProductDetails($row['id'], $user_id, false);
                $variantArray = array();
                $productType = strtolower((string) ($row->type ?? ''));
                $isPacketType = $productType === 'packet';
                $productUnlimitedStock = (int) ($row->is_unlimited_stock ?? 0);
                $isFewQuantityLeft = false;
                $variantFewQuantityMap = [];
                $row->product_rating = $isProductRatingEnabled;

                if ($fewQuantityAlertThreshold > 0) {
                    foreach ($variants as $variant) {
                        $variantId = $variant->id ?? null;
                        $variantStock = (int) ($variant->stock ?? 0);
                        $variantUnlimitedStock = $isPacketType
                            ? (int) ($variant->is_unlimited_stock ?? 0)
                            : $productUnlimitedStock;

                        $variantHasFewQuantity = false;
                        if ($variantUnlimitedStock === 0 && $variantStock > 0 && $variantStock <= $fewQuantityAlertThreshold) {
                            $variantHasFewQuantity = true;
                            if (!$isPacketType) {
                                $isFewQuantityLeft = true;
                            }
                        }

                        if ($variantId !== null) {
                            $variantFewQuantityMap[$variantId] = $variantHasFewQuantity;
                        }
                    }

                    if ($isPacketType && in_array(true, $variantFewQuantityMap, true)) {
                        $isFewQuantityLeft = true;
                    }
                }

                for ($k = 0; $k < count($variants); $k++) {
                    $currentVariantId = $variants[$k]->id ?? null;
                    $currentVariantFewQuantity = $currentVariantId !== null
                        ? ($variantFewQuantityMap[$currentVariantId] ?? false)
                        : false;

                    $variantData = CommonHelper::getProductVariant($variants[$k]['id'], $user_id);

                    if ($variantData) {
                        $variantDataArray = is_object($variantData) ? $variantData->toArray() : (array) $variantData;
                        $variantDataArray['few_quantity_left'] = $isPacketType ? $currentVariantFewQuantity : $isFewQuantityLeft;
                        $loadedUnit = $variants[$k]->relationLoaded('unit') ? $variants[$k]->unit : null;
                        $variantDataArray['unit'] = $loadedUnit ? $loadedUnit->toArray() : null;
                        $variantData = is_object($variantData) ? (object) $variantDataArray : $variantDataArray;
                    }
                    array_push($variantArray, $variantData);
                }
                $products[$i]['variants'] = $variantArray;

                $row->rating_count = CommonHelper::productAverageRating($row['id'])['rating_count'];
                $row->average_rating = CommonHelper::productAverageRating($row['id'])['average_rating'];

                $i++;
            }

            if (!empty($products)) {
                return CommonHelper::responseWithData($products, $total);
            } else {
                return CommonHelper::responseError("No products found");
            }
        } catch (\Exception $e) {
            Log::info("Recently Visited Products Error : " . $e->getMessage());
            return CommonHelper::responseError("Something Went Wrong!");
        }
    }
}
