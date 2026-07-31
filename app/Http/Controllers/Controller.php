<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Seller;
use App\Models\Product;
use App\Models\MasterProduct;
use App\Models\Setting;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Section;
use App\Models\City;
use App\Models\OrderItem;
use App\Models\AdminToken;
use Illuminate\Http\Request;
use App\Helpers\CommonHelper;
use App\Models\ProductVariant;
use App\Models\OrderStatusList;
use App\Models\PanelNotification;
use App\Models\SellerWalletTransaction;
use App\Services\LanguageService;
use App\Models\UserSubscription;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    public function index()
    {
        $data = array();
        $data['order_count'] = Order::get()->count();
        $data['product_count'] = MasterProduct::where('status', 1)->count();
        $data['customer_count'] = User::where('status', '!=', 2)->get()->count();
        $data['seller_count'] = Seller::where('status', 1)->get()->count();
        $data['category_count'] = Category::where('status', 1)->get()->count();
        $data['brand_count'] = Brand::where('status', 1)->get()->count();
        $data['section_count'] = Section::get()->count();
        $data['city_count'] = City::get()->count();
        $data['packet_products'] = ProductVariant::select("*")->leftJoin('products', 'product_variants.product_id', '=', 'products.id')->where('products.type', 'packet')->get()->count();
        $data['loose_products'] = ProductVariant::select("*")->leftJoin('products', 'product_variants.product_id', '=', 'products.id')->where('products.type', 'loose')->get()->count();

        $data['sold_out_count'] = ProductVariant::Join("products", "product_variants.product_id", "=", "products.id")
            ->join('sellers as s', 'products.seller_id', '=', 's.id')
            ->where('s.status', 1)
            ->where('products.is_unlimited_stock', 0)
            ->where('products.status', 1)
            ->where('products.is_approved', 1)
            ->where('product_variants.status', 0)
            ->where('product_variants.stock', '<=', 0)
            ->count();

        $low_stock = Setting::where('variable', 'low_stock_limit')->first();
        $low_stock_limit = 0;
        if ($low_stock) {
            $low_stock_limit = $low_stock->value;
        }
        $data['low_stock_count'] = ProductVariant::select("product_variants.*")
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
            ->where('sellers.status', 1)
            ->where('product_variants.status', ProductVariant::$statusAvailable);
        if (isset($low_stock_limit) && $low_stock_limit !== "" && $low_stock_limit !== 0) {
            $data['low_stock_count'] = $data['low_stock_count']->where('product_variants.stock', '<=', $low_stock_limit)->where('products.is_unlimited_stock', '!=', 1);
        }
        $data['low_stock_count'] = $data['low_stock_count']->get()->count();

        $data['top_sellers'] = OrderItem::select(
            DB::raw("ROUND(SUM(order_items.sub_total),2) as total_revenue"),
            'order_items.seller_id',
            'sellers.name as seller_name',
            'sellers.store_name'
        )
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->where('sellers.status', 1)
            ->groupBy('order_items.seller_id')
            ->orderBy('total_revenue', 'DESC')
            ->where('sellers.name', '!=', null)
            ->get();

        // Add seller name and store_name as all-language translations (keyed by language code); fallback to default lang if missing
        if ($data['top_sellers']->isNotEmpty()) {
            $languageService = app(LanguageService::class);
            $defaultLang = $languageService->getDefaultLanguage();
            $defaultCode = $defaultLang ? $languageService->getLanguageCode($defaultLang->id) : 'en';
            $activeLangCodes = collect($languageService->getActiveLanguages())->pluck('code')->filter()->values()->all();

            $sellerIds = $data['top_sellers']->pluck('seller_id')->unique()->filter()->values();
            $sellers = Seller::whereIn('id', $sellerIds)->with('translations')->get()->keyBy('id');
            foreach ($data['top_sellers'] as $row) {
                $origStoreName = $row->store_name ?? '';
                $seller = $sellers->get($row->seller_id);
                $nameByCode = [];
                $storeNameByCode = [];
                if ($seller) {
                    $all = $seller->getAllActiveLanguageTranslations();
                    foreach ($all as $t) {
                        $code = $t['language_code'] ?? '';
                        if ($code !== '') {
                            $nameByCode[$code] = trim((string) ($t['name'] ?? ''));
                            $storeNameByCode[$code] = trim((string) ($t['store_name'] ?? ''));
                        }
                    }
                }
                $defaultName = $nameByCode[$defaultCode] ?? $row->seller_name ?? '';
                $defaultStoreName = $storeNameByCode[$defaultCode] ?? $origStoreName;
                $row->name = (object) [];
                $row->store_name = (object) [];
                foreach ($activeLangCodes as $code) {
                    $row->name->{$code} = ($nameByCode[$code] ?? '') !== '' ? $nameByCode[$code] : $defaultName;
                    $row->store_name->{$code} = ($storeNameByCode[$code] ?? '') !== '' ? $storeNameByCode[$code] : $defaultStoreName;
                }
                if ((array) $row->name === []) {
                    $row->name = (object) ['en' => $row->seller_name ?? ''];
                    $row->store_name = (object) ['en' => $origStoreName];
                }
            }
        }

        $parents = Category::get()->pluck('parent_id')->toArray();
        $data['top_categories'] = OrderItem::select(
            'master_product_variants.master_product_id as product_id',
            'master_products.name as product_name',
            'master_products.category_id',
            'order_items.seller_id',
            'categories.name as category_name',
            'order_items.product_name',
            'order_items.variant_name',
            DB::raw("ROUND(SUM(order_items.sub_total),2) as total_revenue")
        )
            ->leftJoin('orders', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('master_product_variants', 'order_items.master_product_variant_id', '=', 'master_product_variants.id')
            ->leftJoin('master_products', 'master_product_variants.master_product_id', '=', 'master_products.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->leftJoin('categories', 'master_products.category_id', '=', 'categories.id')
            ->where('sellers.status', 1)
            ->whereMonth('order_items.created_at', now()->month)
            ->whereYear('order_items.created_at', now()->year)
            ->where('orders.active_status', '=', OrderStatusList::$delivered)
            ->where('categories.status', 1)
            ->whereNotIn('master_products.category_id', $parents)
            ->groupBy('master_products.category_id')
            ->orderBy('total_revenue', 'DESC')
            ->get();

        // Add category_name and product_name as all-language translations (keyed by language code); fallback to default lang if missing
        if ($data['top_categories']->isNotEmpty()) {
            $languageService = app(LanguageService::class);
            $defaultLang = $languageService->getDefaultLanguage();
            $defaultCode = $defaultLang ? $languageService->getLanguageCode($defaultLang->id) : 'en';
            $activeLangCodes = collect($languageService->getActiveLanguages())->pluck('code')->filter()->values()->all();

            $categoryIds = $data['top_categories']->pluck('category_id')->unique()->filter()->values();
            $productIds = $data['top_categories']->pluck('product_id')->unique()->filter()->values();
            $categories = Category::whereIn('id', $categoryIds)->with('translations')->get()->keyBy('id');
            $products = MasterProduct::whereIn('id', $productIds)->with('translations')->get()->keyBy('id');
            foreach ($data['top_categories'] as $row) {
                $origCategoryName = $row->category_name ?? '';
                $origProductName = $row->product_name ?? '';
                $categoryNameByCode = [];
                $productNameByCode = [];
                $category = $categories->get($row->category_id);
                if ($category) {
                    $all = $category->getAllActiveLanguageTranslations();
                    foreach ($all as $t) {
                        $code = $t['language_code'] ?? '';
                        if ($code !== '') {
                            $categoryNameByCode[$code] = trim((string) ($t['name'] ?? ''));
                        }
                    }
                }
                $product = $products->get($row->product_id);
                if ($product) {
                    $all = $product->getAllActiveLanguageTranslations();
                    foreach ($all as $t) {
                        $code = $t['language_code'] ?? '';
                        if ($code !== '') {
                            $productNameByCode[$code] = trim((string) ($t['name'] ?? ''));
                        }
                    }
                }
                $defaultCategoryName = $categoryNameByCode[$defaultCode] ?? $origCategoryName;
                $defaultProductName = $productNameByCode[$defaultCode] ?? $origProductName;
                $row->category_name = (object) [];
                $row->product_name = (object) [];
                foreach ($activeLangCodes as $code) {
                    $row->category_name->{$code} = ($categoryNameByCode[$code] ?? '') !== '' ? $categoryNameByCode[$code] : $defaultCategoryName;
                    $row->product_name->{$code} = ($productNameByCode[$code] ?? '') !== '' ? $productNameByCode[$code] : $defaultProductName;
                }
                if ((array) $row->category_name === []) {
                    $row->category_name = (object) ['en' => $origCategoryName];
                }
                if ((array) $row->product_name === []) {
                    $row->product_name = (object) ['en' => $origProductName];
                }
            }
        }

        $data['status_order_count'] = CommonHelper::getStatusOrderCount();

        return CommonHelper::responseWithData($data);
    }
    public function doLanguageChange(Request $request)
    {
        Session::put('lang', $request->language);
        Session::put('app_locale', $request->language);
        return response()->json(['status' => true]);
    }

    public function clearLanguageSession()
    {
        Session::forget('lang');
        Session::forget('app_locale');
        return response()->json(['status' => true, 'message' => 'Language session cleared']);
    }
    public function createSlug($text)
    {
        $slug = CommonHelper::slugify($text);
        return CommonHelper::responseWithData($slug);
    }

    public function getTopNotifications()
    {
        $notifications = PanelNotification::where('notifiable_id', auth()->user()->id);
        $unReadCount = (clone $notifications)->where('read_at', NULL)->get()->count();
        $notifications = $notifications->orderBy('created_at', 'DESC')->get();

        $data = array();
        $data['unread'] = $unReadCount;
        $data['notifications'] = $notifications;
        return CommonHelper::responseWithData($data);
    }

    public function markAsReadNotifications(Request $request)
    {
        auth()->user()
            ->unreadNotifications
            ->when($request->input('id'), function ($query) use ($request) {
                return $query->where('id', $request->input('id'));
            })
            ->markAsRead();
        return CommonHelper::responseWithData("Notification Mark as Read Successfully!");
    }

    public function deploy()
    {

        exec("git pull origin 1.9 2>&1", $output);
        echo "<pre>";
        var_dump($output);
        echo "</pre>";

        exec("composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev");
        exec("php artisan migrate");

        echo "<br><br>Done";
    }

    public function updateToken(Request $request)
    {
        AdminToken::firstOrCreate([
            'user_id' => auth()->user()->id,
            'type' => auth()->user()->role->name,
            'fcm_token' => $request->token
        ]);

        return response()->json(['success' => true]);
    }

    public function setSellerWalletTransaction()
    {
        try {

            $this->expireUserSubscriptions();

            $items = OrderItem::with(['productVariant', 'seller'])
                ->where('active_status', 6)->where('is_credited', 0)
                ->get();
            $productIds = $items->pluck('productVariant.product_id')->unique();
            $productInfo = Product::whereIn('id', $productIds)
                ->select('id', 'return_status', 'return_days', 'seller_id', 'category_id')
                ->get()
                ->keyBy('id');

            foreach ($items as $item) {
                try {

                    if (is_object($item->productVariant)) {
                        // Legacy product catalog flow
                        $productId = $item->productVariant->product_id;
                        $product_info = $productInfo->get($productId);

                        if ($product_info && $product_info->return_status == 1) {
                            if (today() > $item->created_at->addDays($product_info->return_days)) {
                                $this->processSellerTransaction($item, $product_info);
                            }
                        } else {
                            $this->processSellerTransaction($item, $product_info);
                        }
                    } elseif ($item->master_product_variant_id) {
                        // Sarthi master catalog flow — no product_variant, process directly
                        $this->processSellerTransaction($item, null);
                    }
                } catch (\Exception $e) {
                    Log::error("Set seller wallet transaction :", [$e->getMessage()]);
                }
            }
        } catch (\Exception $e) {

            Log::error("Set seller wallet transactions :", [$e->getMessage()]);
        }
    }

    private function processSellerTransaction($item, $product_info)
    {
        try {
            $existsInSellerWalletTransaction = SellerWalletTransaction::where('order_item_id', $item->id)->exists();

            if (!$existsInSellerWalletTransaction) {

                $commission = isset($item->seller->commission) ? $item->seller->commission : 0;

                $admin_commission_amount = $item->sub_total * $commission / 100;
                $seller_amount = $item->sub_total - $admin_commission_amount;
                $seller_id = $item->seller_id;

                $getSellerWalletBalance = CommonHelper::getSellerWalletBalance($seller_id);
                $new_balance = $getSellerWalletBalance + $seller_amount;

                CommonHelper::updateSellerWalletBalance($new_balance, $seller_id);
                CommonHelper::addSellerWalletTransaction($item->order_id, $item->id, $seller_id, 'credit', $seller_amount, 'seller_wallet_order_item_commission');

                CommonHelper::addAdminCommissionTransaction($item->order_id, $item->id, $seller_id, $commission, $admin_commission_amount, $item->sub_total);

                SellerWalletTransaction::where('order_item_id', $item->id)->update(['is_commission' => 1]);

                OrderItem::where('id', $item->id)->update(['is_credited' => 1]);
            }
        } catch (\Exception $e) {

            Log::error("Process seller transaction :", [$e->getMessage()]);
        }
    }

    private function expireUserSubscriptions()
    {
        try {
            $now = now()->toDateString();

            UserSubscription::where('status', 'active')
                ->whereDate('end_date', '<', $now)
                ->update([
                    'status' => 'expired',
                    'updated_at' => $now
                ]);
        } catch (\Exception $e) {
            Log::error("Expire user subscriptions :", [$e->getMessage()]);
        }
    }

    public function unauthorized()
    {
        $data = [];
        $invoice = view('unauthorized', $data)->render();
        return $invoice;
    }
    public function getAdminSettings()
    {
        $logo = "";
        $app_name = "";
        $support_email = "";
        $support_number = "";
        $google_place_api_key = "";
        $google_map_api_key = "";
        $googleMapApiKey = "";
        $currency = "";
        $purchase_code = "";
        $logo_full_path = "";
        $delivery_boy_bonus_settings = 0;
        $isDemoMode = 0;

        $website_url = "";
        $copyright_details = "";

        // Firebase keys
        $apiKey = "";
        $authDomain = "";
        $projectId = "";
        $storageBucket = "";
        $messagingSenderId = "";
        $appId = "";
        $measurementId = "";


        $app_name = Setting::get_value('app_name') ?? "eGrocer";
        $support_email = Setting::get_value('support_email') ?? "";
        $support_number = Setting::get_value('support_number') ?? "";

        $logo = Setting::get_value('logo') ?? "";
        if ($logo !== "") {
            $logo_full_path = url('/') . '/storage/' . $logo;
        } else {
            $logo_full_path = asset('images/favicon.png');
        }

        $panel_login_background_img = Setting::get_value('panel_login_background_img') ?? "";
        $panel_login_background_img_full_path = '';
        if ($panel_login_background_img !== "") {
            $panel_login_background_img_full_path = url('/') . '/storage/' . $panel_login_background_img;
        } else {
            $panel_login_background_img_full_path = asset('images/panel_login_background_img.jpg');
        }

        $google_place_api_key = Setting::get_value('google_place_api_key') ?? "";
        $google_map_api_key = Setting::get_value('google_map_api_key') ?? "";
        $apiKey = Setting::get_value('firebase_apiKey') ?? "";
        $googleMapApiKey = Setting::get_value('googleMapApiKey') ?? "";
        $currency = Setting::get_value('currency') ?? "$";
        $purchase_code = Setting::get_value('purchase_code') ?? "";

        $website_url = Setting::get_value('website_url') ?? "";
        $copyright_details = Setting::get_value('copyright_details') ?? "";

        $delivery_boy_bonus_settings = Setting::get_value('delivery_boy_bonus_settings') ?? 0;

        // Firebase keys
        $authDomain = Setting::get_value('authDomain') ?? "";
        $projectId = Setting::get_value('projectId') ?? "";
        $storageBucket = Setting::get_value('storageBucket') ?? "";
        $messagingSenderId = Setting::get_value('messagingSenderId') ?? "";
        $appId = Setting::get_value('appId') ?? "";
        $measurementId = Setting::get_value('measurementId') ?? "";

        $isDemoMode = isDemoMode() ?? 0;


        return response()->json([
            'app_name' => $app_name,
            'support_email' => $support_email,
            'support_number' => $support_number,
            'logo_full_path' => $logo_full_path,
            'panel_login_background_img_full_path' => $panel_login_background_img_full_path,
            'google_place_api_key' => $google_place_api_key,
            'google_map_api_key' => $google_map_api_key,
            'googleMapApiKey' => $googleMapApiKey,
            'currency' => $currency,
            'purchase_code' => $purchase_code,
            'website_url' => $website_url,
            'copyright_details' => $copyright_details,
            'delivery_boy_bonus_settings' => $delivery_boy_bonus_settings,
            'firebase' => [
                'apiKey' => $apiKey,
                'authDomain' => $authDomain,
                'projectId' => $projectId,
                'storageBucket' => $storageBucket,
                'messagingSenderId' => $messagingSenderId,
                'appId' => $appId,
                'measurementId' => $measurementId,
            ],
            'isDemoMode' => $isDemoMode,
        ]);
    }
}
