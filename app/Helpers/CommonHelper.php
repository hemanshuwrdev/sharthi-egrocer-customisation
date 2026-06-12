<?php

namespace App\Helpers;

use App\Jobs\SendEmailJob;
use App\Models\Admin;
use App\Models\AdminToken;
use App\Models\Brand;
use App\Models\Cart;
use App\Models\Category;
use App\Models\City;
use App\Models\DeliveryBoy;
use App\Models\Favorite;
use App\Models\FundTransfer;
use App\Models\MailSetting;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\OrderStatusList;
use App\Models\Product;
use App\Models\ProductImages;
use App\Models\ProductSlabPrice;
use App\Models\ProductVariant;
use App\Models\RecentlyVisitedProduct;
use App\Models\PromoCode;
use App\Models\ReturnRequest;
use App\Models\ReturnStatusList;
use App\Models\Section;
use App\Services\LanguageService;
use App\Models\Seller;
use App\Models\Setting;
use App\Models\Unit;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\UserToken;
use App\Models\UserSubscription;
use App\Models\WalletTransaction;
use App\Models\SellerWalletTransaction;
use App\Models\AdminCommissionTransaction;
use App\Models\SmsTemplate;
use App\Helpers\TwilioHelper;
use DateTime;
use DateTimeZone;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Mpdf\Mpdf;
use Mpdf\Output\Destination;
use Illuminate\Validation\Rule;
use App\Models\RatingImages;
use App\Models\ProductRating;
use Carbon\Carbon;
use App\Notifications\OrderNotification;
use App\Models\CartNotification;
use App\Models\NotificationTemplate;
use App\Models\NotificationTemplateTranslation;
use Illuminate\Support\Facades\Config;
use App\Mail\LowStockMail;
use App\Models\Language;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class CommonHelper
{

    // public static function fixDescriptionImageUrls($html)
    // {
    //     if (!$html) return $html;

    //     $baseUrl = request()->getSchemeAndHttpHost();

    //     return preg_replace_callback(
    //         '/<img[^>]+src=["\']([^"\']+)["\']/i',
    //         function ($matches) use ($baseUrl) {

    //             $fullTag = $matches[0];
    //             $src = $matches[1];

    //             // 1. If already absolute → return as is
    //             if (preg_match('#^https?://#', $src)) {
    //                 return $fullTag;
    //             }

    //             // 2. Remove ../ or ./ from start ONLY
    //             $src = preg_replace('#^(\.\./|\./)+#', '', $src);

    //             // 3. Ensure it starts with "storage/"
    //             if (!str_starts_with($src, 'storage/')) {
    //                 $src = 'storage/' . $src;
    //             }

    //             // 4. Final URL
    //             $newSrc = $baseUrl . '/' . $src;

    //             // 5. Replace inside tag
    //             return str_replace($matches[1], $newSrc, $fullTag);
    //         },
    //         $html
    //     );
    // }
    public static function fixAdminImagePaths($html)
    {
        if (!$html) return $html;

        $baseUrl = rtrim(url('/'), '/');

        return preg_replace_callback(
            '/<img[^>]+src=["\']([^"\']+)["\']/i',
            function ($matches) use ($baseUrl) {

                $fullTag = $matches[0];
                $src = $matches[1];

                // Skip base64
                if (preg_match('#^data:#i', $src)) {
                    return $fullTag;
                }

                // Find storage/
                $pos = strpos($src, 'storage/');
                if ($pos !== false) {
                    $cleanPath = substr($src, $pos);
                    $newSrc = $baseUrl . '/' . ltrim($cleanPath, '/');

                    // Carefully replace the exact src attribute to avoid partial match issues
                    return str_replace(['src="'.$src.'"', "src='".$src."'"], 'src="'.$newSrc.'"', $fullTag);
                }

                return $fullTag;
            },
            $html
        );
    }
    public static function fixDescriptionImageUrls($html)
    {
        if (!$html) return $html;

        // ✅ IMPORTANT: Skip for admin panel
        if (request()->is('admin/*')) {
            return $html;
        }

        $baseUrl = request()->getSchemeAndHttpHost();

        return preg_replace_callback(
            '/<img[^>]+src=["\']([^"\']+)["\']/i',
            function ($matches) use ($baseUrl) {

                $fullTag = $matches[0];
                $src = $matches[1];

                // 1. Base64 → keep
                if (preg_match('#^data:#i', $src)) {
                    return $fullTag;
                }

                // 2. If contains "storage/"
                $storagePos = strpos($src, 'storage/');
                if ($storagePos !== false) {

                    $cleanPath = substr($src, $storagePos);
                    $newSrc = rtrim($baseUrl, '/') . '/' . ltrim($cleanPath, '/');

                    return str_replace($matches[1], $newSrc, $fullTag);
                }

                // 3. Relative path fallback
                if (!preg_match('#^https?://#i', $src)) {

                    $cleanPath = ltrim(preg_replace('#^(\.\./|\./)+#', '', $src), '/');
                    $newSrc = rtrim($baseUrl, '/') . '/storage/' . $cleanPath;

                    return str_replace($matches[1], $newSrc, $fullTag);
                }

                // 4. External URL → keep
                return $fullTag;
            },
            $html
        );
    }
    public static function responseError($messageKey)
    {
        self::resolveResponseLanguage();
        return Response::json([
            'status'  => 0,
            'message' => __($messageKey),
        ]);
    }

    public static function responseErrorWithData($messageKey, $data)
    {
        self::resolveResponseLanguage();
        return Response::json([
            'status'  => 0,
            'message' => __($messageKey),
            'data'    => $data
        ]);
    }

    public static function responseSuccess($messageKey)
    {
        self::resolveResponseLanguage();
        return Response::json([
            'status'  => 1,
            'message' => __($messageKey),
        ]);
    }

    public static function responseWithData($data, $total = null)
    {
        self::resolveResponseLanguage();
        $total = $total ?? 1;

        return Response::json([
            'status'  => 1,
            'message' => __('success'),
            'total'   => $total,
            'data'    => $data,
        ]);
    }

    public static function responseSuccessWithData($messageKey, $data)
    {
        self::resolveResponseLanguage();
        return Response::json([
            'status'  => 1,
            'message' => __($messageKey),
            'data'    => $data,
        ]);
    }

    /**
     * Resolve response language based on Content-Language header and available lang files.
     * - If header Content-Language matches a folder in resources/lang or a {code}.json file, use that.
     * - Otherwise fall back to current app locale.
     */
    protected static function resolveResponseLanguage(): void
    {
        // Default: current app locale
        $default = App::getLocale();

        if (!app()->has('request') || !request()) {
            App::setLocale($default);
            return;
        }

        $header = request()->header('Content-Language');
        if (!$header) {
            App::setLocale($default);
            return;
        }

        $code = trim(strtolower($header));
        if ($code === '') {
            App::setLocale($default);
            return;
        }

        $langDir  = resource_path('lang/' . $code);
        $langJson = resource_path('lang/' . $code . '.json');

        if (File::isDirectory($langDir) || File::exists($langJson)) {
            App::setLocale($code);
            return;
        }

        App::setLocale($default);
        return;
    }

    public static function getColumnComment($tableName, $columnName)
    {
        $databaseName = DB::connection()->getDatabaseName();
        $comments = DB::select("SELECT COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '$databaseName' AND TABLE_NAME = '$tableName' AND COLUMN_NAME = '$columnName'");
        return $comments[0]->COLUMN_COMMENT;
    }

    public static function slugify($text, $table = 'products', $field = 'slug', $key = NULL, $value = NULL)
    {
        // replace non letter or digits by -
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);

        $text = trim($text, '-');

        // remove duplicate -
        $text = preg_replace('~-+~', '-', $text);

        // lowercase
        $slug = strtolower($text);

        if (empty($slug)) {
            return 'n-a';
        }
        $total = DB::select(DB::raw("SELECT COUNT(id) AS total_slugs FROM $table WHERE $field  LIKE '$slug%'"));

        return ($total[0]->total_slugs > 0) ? ($slug . '-' . $total[0]->total_slugs) : $slug;
    }

    public static function getTimezoneOptions()
    {
        $list = DateTimeZone::listAbbreviations();
        $idents = DateTimeZone::listIdentifiers();

        $data = $offset = $added = array();
        foreach ($list as $abbr => $info) {
            foreach ($info as $zone) {
                if (
                    !empty($zone['timezone_id'])
                    and
                    !in_array($zone['timezone_id'], $added)
                    and
                    in_array($zone['timezone_id'], $idents)
                ) {
                    $z = new DateTimeZone($zone['timezone_id']);
                    $c = new DateTime('', $z);
                    $zone['time'] = $c->format('H:i a');
                    $offset[] = $zone['offset'] = $z->getOffset($c);
                    $data[] = $zone;
                    $added[] = $zone['timezone_id'];
                }
            }
        }
        array_multisort($offset, SORT_ASC, $data);
        $i = 0;
        $temp = array();
        foreach ($data as $key => $row) {
            $temp[0] = $row['time'];
            $temp[1] = self::formatOffset($row['offset']);
            $temp[2] = $row['timezone_id'];
            $options[$i++] = $temp;
        }
        return $options;
    }

    public static function formatOffset($offset)
    {
        $hours = $offset / 3600;
        $remainder = $offset % 3600;
        $sign = $hours > 0 ? '+' : '-';
        $hour = (int)abs($hours);
        $minutes = (int)abs($remainder / 60);

        if ($hour == 0 and $minutes == 0) {
            $sign = ' ';
        }
        return $sign . str_pad($hour, 2, '0', STR_PAD_LEFT) . ':' . str_pad($minutes, 2, '0');
    }

    public static function convertSettingsInArray($settings): array
    {
        $imageArray = array("play_store_logo", "ios_store_logo", "favicon", "web_logo", "loading", "logo", "popup_image", "placeholder_image");
        $data = array();
        foreach ($settings as $setting) {
            if (in_array($setting->variable, $imageArray)) {
                $data[$setting->variable] = self::getImage($setting->value);
            } else {
                $data[$setting->variable] = $setting->value;
            }
        }
        return $data;
    }

    public static function getSettings($variables)
    {
        $settings = Setting::whereIn('variable', $variables)->get();
        $settingsArray = self::convertSettingsInArray($settings);

        // Set default values if not present
        $defaults = [
            'currency' => '₹',
            'currency_code' => 'INR',
            'decimal_point' => 2,
        ];

        return array_merge($defaults, $settingsArray);
    }

    public static function getDefaultCity()
    {
        $default_city_id = Setting::get_value('default_city_id');
        return City::select('id', 'name', 'state', 'formatted_address', 'latitude', 'longitude')->where('id', $default_city_id)->first();
    }


    private static ?string $cachedDateFormat = null;
    private static ?string $cachedTimeFormat = null;

    public static function getDateFormat(): string
    {
        if (self::$cachedDateFormat === null) {
            $format = Setting::get_value('date_format');
            self::$cachedDateFormat = !empty($format) ? $format : 'd-m-Y';
        }
        return self::$cachedDateFormat;
    }

    public static function getTimeFormat(): string
    {
        if (self::$cachedTimeFormat === null) {
            $format = Setting::get_value('time_format');
            self::$cachedTimeFormat = !empty($format) ? $format : 'h:i A';
        }
        return self::$cachedTimeFormat;
    }

    public static function formatDate($date): string
    {
        if (empty($date)) {
            return '';
        }
        try {
            $carbon = Carbon::parse($date);
            $tz = config('app.timezone', 'UTC');
            $carbon = $carbon->setTimezone($tz);
            return $carbon->format(self::getDateFormat());
        } catch (\Exception $e) {
            return '';
        }
    }
    public static function formatTime($time): string
    {
        if (empty($time)) {
            return '';
        }
        try {
            $carbon = Carbon::parse($time);
            $tz = config('app.timezone', 'UTC');
            $carbon = $carbon->setTimezone($tz);
            return $carbon->format(self::getTimeFormat());
        } catch (\Exception $e) {
            return '';
        }
    }

    public static function formatDateTime($date): string
    {
        if (empty($date)) {
            return '';
        }
        try {
            $carbon = Carbon::parse($date);
            $tz = config('app.timezone', 'UTC');
            $carbon = $carbon->setTimezone($tz);
            $dateFormat = self::getDateFormat();
            $timeFormat = self::getTimeFormat();
            return $carbon->format($dateFormat . ' ' . $timeFormat);
        } catch (\Exception $e) {
            return '';
        }
    }

    public static function getDeliveryBoyBonusSettings(): array
    {
        $variablesArray = array("delivery_boy_bonus_settings", "delivery_boy_bonus_type", "delivery_boy_bonus_percentage", "delivery_boy_bonus_min_amount", "delivery_boy_bonus_max_amount");
        $bonus =  self::getSettings($variablesArray);
        $bonus['delivery_boy_bonus_settings'] = intval($bonus['delivery_boy_bonus_settings']);
        $bonus['delivery_boy_bonus_type'] = intval($bonus['delivery_boy_bonus_type']);
        $bonus['delivery_boy_bonus_percentage'] = floatval($bonus['delivery_boy_bonus_percentage']);
        $bonus['delivery_boy_bonus_min_amount'] = floatval($bonus['delivery_boy_bonus_min_amount']);
        $bonus['delivery_boy_bonus_max_amount'] = floatval($bonus['delivery_boy_bonus_max_amount']);
        return $bonus;
    }

    public static function getMainCategories($request)
    {
        $query = Category::orderBy('id', 'DESC')
            ->where(['parent_id' => 0, 'status' => 1]);

        if (isset($request->search) && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where('name', 'LIKE', '%' . $searchTerm . '%');
        }

        $useContentLanguage = $request
            && $request->header('Content-Language') !== null
            && trim((string) $request->header('Content-Language')) !== '';

        if ($useContentLanguage) {
            $langCode = app()->has('lang_code') ? app('lang_code') : 'en';
            app()->setLocale($langCode);
        }

        $query->with('translations');

        $categories = $query->get();

        if ($useContentLanguage && $categories->isNotEmpty()) {
            $langId = app(LanguageService::class)->getCurrentId();

            // Read translatable fields from the model, same pattern as CountryApiController
            $translatableFields = (function () {
                return $this->getTranslatableAttributes();
            })->call($categories->first() ?? new Category());

            $categories = $categories->map(function ($category) use ($langId, $translatableFields) {
                $translation = $category->getRelation('translations')
                    ->where('language_id', $langId)
                    ->first();

                $transData = ['language_id' => $langId];
                foreach ($translatableFields as $field) {
                    // If translation value exists, use it; otherwise use base-table value
                    $transData[$field] = ($translation && isset($translation->$field) && $translation->$field !== '')
                        ? $translation->$field
                        : ($category->getAttributeValue($field) ?? '');
                }

                $categoryArray = $category->toArray();
                $categoryArray['translations'] = $transData;

                // Hide internal flags and nested active children completely on parent
                unset(
                    $categoryArray['has_child'],
                    $categoryArray['has_active_child'],
                    $categoryArray['cat_active_childs']
                );

                return $categoryArray;
            });
        } else {
            // When not using Content-Language, keep original model collection but hide internals
            $categories = $categories->makeHidden(['has_child', 'has_active_child', 'cat_active_childs']);
        }

        return $categories;
    }

    public static function categoryTree($parent_id = 0, $sub_mark = '', $default = NULL, $dont_include = array(), $only_last_selecatble = false, $multiple_default = array(), $exclude_id = 0, $seller_id = 0)
    {
        if ($seller_id != 0) {
            $seller = Seller::where('id', $seller_id)->first();
            $categories = Category::with('parent')->where('parent_id', $parent_id)->whereIn('id', explode(",", $seller->categories));
        } else {
            $categories = Category::with('parent')->where('parent_id', $parent_id);
        }

        if ($exclude_id != 0) {
            $categories = $categories->where('id', '!=', $exclude_id);
        }

        if (count($dont_include) > 0) {
            foreach ($dont_include as $dontInclude) {
                $categories->where('id', '!=', $dontInclude);
                $categories->where('parent_id', '!=', $dontInclude);
            }
        }

        $categories = $categories->get();

        if (count($categories) > 0) {
            foreach ($categories as $category) {
                $selected = '';
                if (isset($default) and $default == $category->id) {
                    $selected = 'selected';
                }

                $multiSelected = '';
                if (isset($multiple_default) and in_array($category->id, $multiple_default)) {
                    $multiSelected = 'selected';
                }

                if ($only_last_selecatble) {
                    if ($category->childs->count() == 0) {
                        echo '<option value="' . $category->id . '"  ' . $selected . ' ' . $multiSelected . ' >' . $sub_mark . $category->name . '</option>';
                    } else {
                        echo '<optgroup label="' . $sub_mark . $category->name . '">';
                        self::categoryTree($category->id, $sub_mark . '&nbsp;&nbsp;', $default, $dont_include, $only_last_selecatble, $multiple_default);
                        echo '</optgroup>';
                    }
                } else {
                    echo '<option value="' . $category->id . '"  ' . $selected . ' ' . $multiSelected . '>' . $sub_mark . $category->name . '</option>';
                    self::categoryTree($category->id, $sub_mark . '&nbsp;&nbsp;', $default, $dont_include, $only_last_selecatble, $multiple_default);
                }
            }
        }
    }

    public static function uploadProductImages($images, $product_id, $variant_id = 0)
    {
        foreach ($images as $file) {
            $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            $extension = $file->getClientOriginalExtension();
            if (in_array(strtolower($extension), $allowedExtensions)) {
                $image = Storage::disk('public')->putFileAs('products', $file, $fileName);
                $productImages = new ProductImages();
                $productImages->product_id = $product_id;
                $productImages->product_variant_id = $variant_id;
                $productImages->image = $image;
                $productImages->save();
            }
        }
    }

    public static function validatePromoCode($user_id, $promo_code, $total)
    {
        $code = PromoCode::where('promo_code', $promo_code)->first();
        if (empty($code)) {
            $response['is_applicable'] = 0;
            $response['message'] = "Promo code not available.";
            return $response;
        }
        $promo_code_id = $code->id;
        if ($code->status == 0) {
            $response['is_applicable'] = 0;
            $response['message'] = "This promo code is either expired / invalid.";
            return $response;
        }
        $user = auth()->user();
        if (empty($user)) {
            $response['is_applicable'] = 0;
            $response['message'] = "Invalid user data.";
            return $response;
        }
        $start_date = $code->start_date;
        $end_date = $code->end_date;
        $date = date('Y-m-d');
        if ($date < $start_date) {
            $response['is_applicable'] = 0;
            $response['message'] = "This promo code can't be used before " . date('d-m-Y', strtotime($start_date));
            return $response;
        }
        if ($date > $end_date) {
            $response['is_applicable'] = 0;
            $response['message'] = "This promo code can't be used after " . date('d-m-Y', strtotime($end_date));
            return $response;
        }
        if ($total < $code->minimum_order_amount) {
            $response['is_applicable'] = 0;
            $response['message'] = "This promo code is applicable only for order amount greater than or equal to " . $code->minimum_order_amount;
            return $response;
        }
        //check how many users have used this promo code and no of users used this promo code crossed max users or not
        $order = Order::select('id')->where('promo_code_id', $promo_code_id)->groupBy('user_id')->get()->toArray();
        if (count($order) >= $code->no_of_users) {
            $response['is_applicable'] = 0;
            $response['message'] = "This promo code is applicable only for first " . $code->no_of_users . " users.";
            return $response;
        }
        //check how many times user have used this promo code and count crossed max limit or not
        if ($code->repeat_usage == 1) {
            $order = Order::select('id')->where('user_id', $user_id)->where('promo_code_id', $promo_code_id)->groupBy('user_id')->get()->toArray();
            $total_usage = count($order);
            if ($total_usage >= $code->no_of_repeat_usage && $code->no_of_repeat_usage != 0) {
                $response['is_applicable'] = 0;
                $response['message'] = "This promo code is applicable only for " . $code->no_of_repeat_usage . " times.";
                return $response;
            }
        }
        //check if repeat usage is not allowed and user have already used this promo code
        if ($code->repeat_usage == 0) {
            $order = Order::select('id')->where('user_id', $user_id)->where('promo_code_id', $promo_code_id)->groupBy('user_id')->get()->toArray();
            $total_usage = count($order);
            if ($total_usage >= 1) {
                $response['is_applicable'] = 0;
                $response['message'] = "This promo code is applicable only for 1 time.";
                return $response;
            }
        }
        if ($code->discount_type == 'percentage') {
            $percentage = $code->discount;
            $discount = $total / 100 * $percentage;
            if ($discount > $code->max_discount_amount) {
                $discount = $code->max_discount_amount;
            }
        } else {
            $discount = $code->discount;
        }
        $discounted_amount = $total - $discount;

        $response['promo_code_id'] = $code->id;
        $response['is_applicable'] = 1;
        $response['message'] = "Promo code applied successfully.";
        $response['promo_code'] = $promo_code;
        $response['image_url'] = $code->image_url;
        $response['promo_code_message'] = $code->message;
        $response['total'] = $total;
        $response['discount'] = $discount;
        $response['discounted_amount'] = $discounted_amount;
        return $response;
    }

    public static function getValidatedPromoCode($promocode_id, $total, $user_id)
    {
        $code = PromoCode::find($promocode_id);
        if (empty($code)) {
            $response['is_applicable'] = 0;
            $response['message'] = "Promo code not available.";
            return $response;
        }

        return self::validatePromoCode($user_id, $code->promo_code, $total);
    }

    public static function getDeliverableCity($latitude, $longitude)
    {
        $point = ['lat' => $latitude, 'lng' => $longitude];

        // Retrieve cities with boundary points
        $cities = City::all();

        $cityIds = '';

        foreach ($cities as $city) {
            if ($city->geolocation_type == 'polygon') {
                $polygon = json_decode($city->boundary_points, true);

                if (is_array($polygon) && !empty($polygon) && self::isPointInPolygon($point, $polygon)) {
                    $cityIds = $city->id;
                }
            } elseif ($city->geolocation_type == 'circle') {
                $boundaryPoints  = json_decode($city->boundary_points, true);
                $radius = $city->radius; // Assuming radius is stored in meters

                if (is_array($boundaryPoints) && !empty($boundaryPoints)) {
                    $center = $boundaryPoints[0]; // Assuming the first element is the center point
                    if (self::isPointInCircle($point, $center, $radius)) {
                        $cityIds = $city->id;
                    }
                }
            }
        }

        $city = city::select('cities.*')
            ->leftJoin("sellers", "sellers.city_id", "cities.id")
            ->where("cities.id", $cityIds)
            ->first();
        return $city;
    }
    function boundaryPointsToPolygon($boundaryPoints)
    {
        $pointsArray = json_decode($boundaryPoints, true);
        $wkt = 'POLYGON((' . implode(',', array_map(function ($point) {
            return "{$point['lng']} {$point['lat']}";
        }, $pointsArray)) . '))';
        return $wkt;
    }

    public static function getDeliverableCityIds($latitude, $longitude)
    {
        $point = ['lat' => $latitude, 'lng' => $longitude];

        $cities = City::all();

        $cityIds = [];

        foreach ($cities as $city) {
            if ($city->geolocation_type == 'polygon') {
                $polygon = json_decode($city->boundary_points, true);

                if (is_array($polygon) && !empty($polygon) && self::isPointInPolygon($point, $polygon)) {
                    $cityIds[] = $city->id;
                }
            } elseif ($city->geolocation_type == 'circle') {
                $boundaryPoints  = json_decode($city->boundary_points, true);
                $radius = $city->radius;

                if (is_array($boundaryPoints) && !empty($boundaryPoints)) {
                    $center = $boundaryPoints[0];
                    if (self::isPointInCircle($point, $center, $radius)) {
                        $cityIds[] = $city->id;
                    }
                }
            }
        }

        return $cityIds;
    }

    public static function getSellerIds($latitude, $longitude)
    {
        $cityIds = self::getDeliverableCityIds($latitude, $longitude);
        return self::getSellerIdsfromCityIds($cityIds);
    }
    public static function isPointInPolygon($point, $polygon)
    {
        if (empty($polygon) || !is_array($polygon)) {
            return false; // Return false if polygon data is not valid
        }

        $x = $point['lng'];
        $y = $point['lat'];

        $vertices = $polygon;
        $count = count($vertices);

        if ($count < 3) {
            return false; // A polygon must have at least 3 vertices
        }

        $inside = false;
        $p1x = $vertices[0]['lng'];
        $p1y = $vertices[0]['lat'];

        for ($i = 1; $i <= $count; $i++) {
            $p2x = $vertices[$i % $count]['lng'];
            $p2y = $vertices[$i % $count]['lat'];

            if ($y > min($p1y, $p2y)) {
                if ($y <= max($p1y, $p2y)) {
                    if ($x <= max($p1x, $p2x)) {
                        if ($p1y != $p2y) {
                            $xinters = ($y - $p1y) * ($p2x - $p1x) / ($p2y - $p1y) + $p1x;
                        }
                        if ($p1x == $p2x || $x <= $xinters) {
                            $inside = !$inside;
                        }
                    }
                }
            }

            $p1x = $p2x;
            $p1y = $p2y;
        }

        return $inside;
    }
    public static function isPointInCircle($point, $center, $radius)
    {
        $earthRadius = 6371000; // Earth's radius in meters

        $latFrom = deg2rad($center['lat']);
        $lngFrom = deg2rad($center['lng']);
        $latTo = deg2rad($point['lat']);
        $lngTo = deg2rad($point['lng']);

        $latDelta = $latTo - $latFrom;
        $lngDelta = $lngTo - $lngFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lngDelta / 2), 2)));

        $distance = $angle * $earthRadius;

        return $distance <= $radius;
    }
    public static function getSellerIdsfromCityIds(array $cityIds)
    {
        if (empty($cityIds)) {
            return [];
        }

        $query = Seller::where('status', 1); // Adding the status condition

        $query->where(function ($q) use ($cityIds) {
            foreach ($cityIds as $cityId) {
                // city_id stored as CSV of city IDs (Sarthi: distributor serves multiple cities)
                $q->orWhereRaw('FIND_IN_SET(?, city_id)', [$cityId])
                    ->orWhereIn('city_id', $cityIds);
            }
        });

        $sellerIds = $query->pluck('id');
        return $sellerIds;
    }
    public static function getProductByVariantId($arr)
    {
        if (!empty($arr)) {
            $variants = ProductVariant::select(
                "pv.*",
                "pv.id",
                "pv.type as product_type",
                "p.seller_id",
                "p.name as product_name",
                "p.is_unlimited_stock",
                DB::raw("(SELECT t.title FROM taxes t WHERE t.id = p.tax_id) as tax_title"),
                DB::raw("(SELECT t.percentage FROM taxes t WHERE t.id = p.tax_id) as tax_percentage"),
                DB::raw("(SELECT short_code FROM units as u WHERE u.id = pv.stock_unit_id) as stock_unit_name")
            )
                ->from("product_variants as pv")
                ->leftJoin("products as p", "pv.product_id", "=", "p.id")
                ->whereIn("pv.id", $arr)
                ->orderByRaw("FIELD(pv.id, " . implode(',', $arr) . ")")
                ->get();

            if (!empty($variants)) {
                return $variants;
            }
        }
    }

    public static function getUserAddress($id)
    {
        $address = UserAddress::where("id", $id)->first();
        return $address;
    }

    public static function addUserWalletBalance($amount, $id)
    {
        $user = User::where("id", $id)->first();

        $user->balance = $user->balance + $amount;
        $user->save();
        return $user->balance;
    }

    public static function updateUserWalletBalance($new_balance, $id)
    {
        $user = User::where("id", $id)->first();
        $user->balance = $new_balance;
        $user->save();
    }

    public static function getUserWalletBalance($id)
    {
        $user = User::find($id);
        $balance = 0;
        if ($user) {
            $balance = $user->balance;
        }
        return $balance;
    }

    public static function getUserActiveSubscription($user_id = null)
    {
        try {
            if ($user_id === null) {
                $user = auth()->user();
                if (!$user) {
                    return null;
                }
                $user_id = $user->id;
            }
            $userSubscription = UserSubscription::where('user_id', $user_id)
                ->where('status', 'active')
                ->where('end_date', '>=', now()->toDateString())
                ->with('plan')
                ->orderBy('id', 'desc')
                ->first();
            return $userSubscription;
        } catch (\Exception $e) {
            Log::error('Error getting user active subscription: ' . $e->getMessage());
            return null;
        }
    }

    public static function addWalletTransaction($order_id, $order_item_id, $user_id, $type, $wallet_balance, $mesage, $status = 1, $payment_type = '')
    {
        $transaction = new WalletTransaction();
        $transaction->order_id = $order_id;
        $transaction->order_item_id     = $order_item_id;
        $transaction->user_id = $user_id;
        $transaction->type = $type;
        $transaction->amount = $wallet_balance;
        $transaction->message = $mesage;
        $transaction->status = $status;
        if (!empty($payment_type)) {
            $transaction->payment_type = $payment_type;
        }
        $transaction->save();

        if ($transaction->id) {
            return $transaction;
        } else {
            return false;
        }
    }

    public static function translateTransactionMessage($message)
    {
        if ($message === null || $message === '') {
            return $message;
        }
        $msg = (string) $message;
        if (!preg_match('/^[a-z0-9_]+$/', $msg)) {
            return $msg;
        }
        $previousLocale = App::getLocale();
        $defaultLocale = config('app.fallback_locale', 'en');
        $useLocale = $previousLocale;
        if (app()->has('request') && request()) {
            $header = request()->header('Content-Language');
            $code = $header ? trim(strtolower($header)) : '';
            if ($code !== '') {
                $langJson = resource_path('lang/' . $code . '.json');
                $langDir  = resource_path('lang/' . $code);
                if (File::exists($langJson) || File::isDirectory($langDir)) {
                    $useLocale = $code;
                }
            }
        }
        App::setLocale($useLocale);
        $text = __($msg);
        if ($text === $msg && $useLocale !== $defaultLocale) {
            App::setLocale($defaultLocale);
            $text = __($msg);
        }
        App::setLocale($previousLocale);
        return $text;
    }

    public static function isInPolygon($points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y)
    {

        $i = $j = $c = 0;
        for ($i = 0, $j = $points_polygon - 1; $i < $points_polygon; $j = $i++) {
            if ((($vertices_y[$i] > $latitude_y != ($vertices_y[$j] > $latitude_y)) &&
                ($longitude_x < ($vertices_x[$j] - $vertices_x[$i]) * ($latitude_y - $vertices_y[$i]) / ($vertices_y[$j] - $vertices_y[$i]) + $vertices_x[$i])))
                $c = !$c;
        }
        return $c;
    }

    public static function isDeliverable($city_id, $latitudeTo, $longitudeTo, $unit = 'K')
    {
        $point = ['lat' => $latitudeTo, 'lng' => $longitudeTo];

        // Retrieve cities with boundary points
        $checkcityIds = explode(',', $city_id);
        $cities = City::whereIn('id', $checkcityIds)->get();
        $cityIds = [];

        foreach ($cities as $city) {
            $polygon = json_decode($city->boundary_points, true);

            if (is_array($polygon) && !empty($polygon) && self::isPointInPolygon($point, $polygon)) {
                $cityIds[] = $city->id;
            }
        }
        // Return whether the point is deliverable in any of the specified cities
        return $isDeliverable = !empty($cityIds);
    }

    public static function isDeliverableOrder($address_id, $latitude, $longitude, $seller_id)
    {
        if (!empty($seller_id) || $seller_id != "") {

            // get seller points
            $seller = Seller::select("latitude", "longitude")->where("id", "=", $seller_id)->first();

            $address =  UserAddress::select("latitude", "longitude", DB::raw("6371 * acos(cos(radians(" . $seller->latitude . "))
                                * cos(radians(latitude)) * cos(radians(longitude) - radians(" . $seller->longitude . "))
                                + sin(radians(" . $seller->latitude . ")) * sin(radians(latitude))) AS distance"))
                ->where("id", "=", $address_id)->first();

            $city = self::getDeliverableCity($latitude, $longitude);

            if (!empty($city)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public static function convertToParent($measurement, $measurement_unit_id)
    {
        $unit = Unit::where("id", "=", $measurement_unit_id)->first();
        if (!empty($unit->parent_id)) {
            $stock = $measurement / $unit->conversion;
        } else {
            $stock = ($measurement) * $unit->conversion;
        }
        return $stock;
    }

    public static function isOrderItemCancelled($order_item_id)
    {
        $order_item = OrderItem::select('products.cancelable_status',)
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->where("order_items.id", $order_item_id)
            ->first();

        if ($order_item->cancelable_status == OrderStatusList::$cancelled) {
            return true;
        } else {
            return false;
        }
    }
    public static function isOrderItemReturned($active_status, $postStatus)
    {
        if ($active_status != OrderStatusList::$delivered && $postStatus == OrderStatusList::$returned) {
            return true;
        } else {
            return false;
        }
    }
    public static function getImage($image)
    {
        if ($image) {
            return asset('storage/' . $image);
        } else {
            return '';
        }
    }
    public static function getImages($product_id, $variant_id = 0)
    {
        $productImages = ProductImages::where('product_id', $product_id)
            ->where('product_variant_id', $variant_id)
            ->get()->pluck('image_url')->toArray();
        return $productImages;
    }

    /**
     * Convert a value (array, JSON-encoded string, CSV string, or null) to an array
     * of unique positive integers. Handles legacy CSV rows that the model's array
     * cast cannot decode.
     */
    public static function normalizeIdArray($value)
    {
        if (empty($value)) {
            return [];
        }
        if (is_array($value)) {
            $items = $value;
        } elseif (is_string($value) && isset($value[0]) && $value[0] === '[') {
            $decoded = json_decode($value, true);
            $items = is_array($decoded) ? $decoded : [];
        } else {
            $items = explode(',', (string) $value);
        }
        return array_values(array_unique(array_filter(
            array_map('intval', $items),
            function ($id) {
                return $id > 0;
            }
        )));
    }

    public static function getProductIdsSection($section, $user_id = null)
    {
        if (empty($section)) {
            return "";
        }
        $cate_ids = self::normalizeIdArray($section->category_ids);
        $product_ids = $section->product_ids;

        if ($section->product_type == 'all_products') {
            // When no valid category IDs after normalization, fetch from all categories
            if (empty($cate_ids)) {
                $sql = Product::select("id as product_id")->where("status", "=", 1)->orderBy("product_id", "DESC");
            } else {

                $sql = Product::select("id as product_id")->whereIn("category_id", $cate_ids)->orderBy("product_id", "DESC");
            }
        } elseif ($section->product_type == 'new_added_products') {
            if (empty($cate_ids)) {
                $sql = Product::select("id as product_id")->where("status", "=", 1)->orderBy("id", "DESC");
            } else {
                $sql = Product::select("id as product_id")->where("status", "=", 1)->whereIn("category_id", $cate_ids)->orderBy("id", "DESC");
            }
        } elseif ($section->product_type == 'products_on_sale') {
            if (empty($cate_ids)) {
                $sql = Product::select("p.id as product_id")->from("products as p")
                    ->leftJoin('product_variants as pv', 'pv.product_id', '=', 'p.id')
                    ->where("p.status", "=", 1)
                    ->where("pv.discounted_price", ">", 0)
                    ->where("pv.price", "=", "pv.discounted_price")
                    ->orderBy("p.id", "DESC");
            } else {
                $sql = Product::select("p.id as product_id")->from("products as p")
                    ->leftJoin('product_variants as pv', 'pv.product_id', '=', 'p.id')
                    ->where("p.status", "=", 1)
                    ->whereIn("category_id", $cate_ids)
                    ->where("pv.discounted_price", ">", 0)
                    ->where("pv.price", "=", "pv.discounted_price")
                    ->orderBy("p.id", "DESC");
            }
        } elseif ($section->product_type == 'most_selling_products') {
            // Group by product only so we get one row per product, ordered by total sales (all variants combined)
            // If no valid category IDs, do not filter by category at all.
            if (empty($cate_ids)) {
                $sql = OrderItem::select("p.id as product_id", DB::raw("COUNT(oi.id) AS total"))
                    ->from("order_items as oi")
                    ->leftJoin("product_variants as pv", "oi.product_variant_id", "=", "pv.id")
                    ->leftJoin("products as p", "pv.product_id", "=", "p.id")
                    ->where("oi.product_variant_id", "!=", 0)
                    ->whereNotNull("p.id")
                    ->groupBy("p.id")
                    ->orderByRaw("total DESC");
            } else {
                $sql = OrderItem::select("p.id as product_id", DB::raw("COUNT(oi.id) AS total"))
                    ->from("order_items as oi")
                    ->leftJoin("product_variants as pv", "oi.product_variant_id", "=", "pv.id")
                    ->leftJoin("products as p", "pv.product_id", "=", "p.id")
                    ->where("oi.product_variant_id", "!=", 0)
                    ->whereNotNull("p.id")
                    ->whereIn("p.category_id", $cate_ids)
                    ->groupBy("p.id")
                    ->orderByRaw("total DESC");
            }
        } elseif ($section->product_type == 'recently_visited_products') {
            if (!empty($user_id)) {
                $recentlyVisited = RecentlyVisitedProduct::where('user_id', $user_id)
                    ->orderBy('visited_at', 'desc')
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->pluck('product_id')
                    ->toArray();
                $product_ids = implode(",", $recentlyVisited);
            } else {
                $product_ids = "";
            }
        } else {
            $product_ids = implode(',', self::normalizeIdArray($section->product_ids));
        }
        if ($section->product_type != 'custom_products' && $section->product_type != 'recently_visited_products' && !empty($section->product_type) && isset($sql)) {
            $product = $sql->get();

            $rows = $tempRow = array();
            foreach ($product as $row1) {
                $tempRow['product_id'] = $row1->product_id;
                $rows[] = $tempRow;
            }
            $pro_id = array_column($rows, 'product_id');
            $product_ids = implode(",", $pro_id);
        }

        return $product_ids;
    }

    public static function getSectionWithProduct($seller_ids, $user_id = 0, $cityIds = [])
    {
        $limit = 8;
        $offset =  0;
        $sections = Section::orderBy('created_at', 'ASC')->get();

        $sections = $sections->makeHidden(['created_at', 'updated_at']);

        // Get settings for product rating and few quantity alert
        $productRatingSetting = (int) (Setting::get_value('product_rating') ?? 0);
        $isProductRatingEnabled = $productRatingSetting === 1;
        $fewQuantityAlertThreshold = (int) (Setting::get_value('few_quantity_left_alert') ?? 0);

        foreach ($sections as $key => $section) {
            $product_ids = self::getProductIdsSection($section, $user_id) ?? "";
            // Sanitize product_ids: trim, cast to int, keep unique positive IDs.
            $product_ids_array = array_values(array_unique(array_filter(
                array_map('intval', explode(",", $product_ids)),
                function ($id) {
                    return $id > 0;
                }
            )));

            if (!empty($product_ids_array)) {
                $productsQuery = Product::select(
                    'p.*',
                    'p.type as d_type',
                    's.store_name as seller_name',
                    's.slug as seller_slug',
                    's.status as seller_status'
                )
                    ->from('products as p')
                    ->leftJoin('sellers as s', 'p.seller_id', '=', 's.id')
                    ->leftJoin('categories as c', 'p.category_id', '=', 'c.id')
                    ->where('p.is_approved', 1)
                    ->where('p.status', 1)
                    ->where('c.status', 1)
                    ->where('s.status', 1)
                    ->whereIn('p.seller_id', $seller_ids)
                    ->whereIn('p.id', $product_ids_array);

                if (!empty($cityIds)) {
                    $productsQuery->where(function ($q) use ($cityIds) {
                        $q->whereNotExists(function ($subquery) use ($cityIds) {
                            $subquery->select(DB::raw(1))
                                ->from('brand_distributor_mappings as bdm')
                                ->whereColumn('bdm.brand_id', 'p.brand_id')
                                ->whereIn('bdm.city_id', $cityIds);
                        })
                        ->orWhereExists(function ($subquery) use ($cityIds) {
                            $subquery->select(DB::raw(1))
                                ->from('brand_distributor_mappings as bdm')
                                ->whereColumn('bdm.brand_id', 'p.brand_id')
                                ->whereIn('bdm.city_id', $cityIds)
                                ->whereColumn('bdm.seller_id', 'p.seller_id');
                        });
                    });
                }

                $products = $productsQuery
                    ->with('ratings')
                    ->groupBy('p.id')
                    ->orderByRaw("FIELD(p.id, " . implode(',', $product_ids_array) . ")")
                    ->skip($offset)
                    ->take($limit)
                    ->get();
                $products = $products->makeHidden([
                    'seller_id',
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
            } else {
                $products = collect(); // Return an empty collection if no product IDs
            }

            $i = 0;
            foreach ($products as $row) {


                $variants = ProductVariant::select(
                    '*',
                    DB::raw("(SELECT short_code FROM units u WHERE u.id=stock_unit_id) as stock_unit_name")
                )
                    ->with(['unit', 'product.tax'])
                    ->where('product_id', '=', $row['id'])
                    ->orderBy('status', 'ASC')
                    ->get();
                $variants = $variants->makeHidden(['product_id', 'measurement_unit_id', 'stock_unit_id', 'deleted_at', 'description']);
                if (empty($variants)) {
                    continue;
                }

                $products[$i] = self::getProductDetails($row['id'], $user_id, false);

                // Get product type and unlimited stock status for few quantity calculation
                $productType = strtolower((string) ($row->type ?? ''));
                $isPacketType = $productType === 'packet';
                $productUnlimitedStock = (int) ($row->is_unlimited_stock ?? 0);
                $isFewQuantityLeft = false;
                $variantFewQuantityMap = [];

                // Calculate few_quantity_left for each variant if threshold is set
                if ($fewQuantityAlertThreshold > 0) {
                    foreach ($variants as $variant) {
                        $variantId = $variant->id ?? null;
                        $variantStock = (int) ($variant->stock ?? 0);
                        // For packet type, check variant's unlimited stock; otherwise use product's unlimited stock
                        $variantUnlimitedStock = $isPacketType
                            ? (int) ($variant->is_unlimited_stock ?? 0)
                            : $productUnlimitedStock;

                        $variantHasFewQuantity = false;
                        // Check if variant has few quantity (stock > 0, not unlimited, and <= threshold)
                        if ($variantUnlimitedStock === 0 && $variantStock > 0 && $variantStock <= $fewQuantityAlertThreshold) {
                            $variantHasFewQuantity = true;
                            // For non-packet type, if any variant has few quantity, mark product as having few quantity
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

                $variantArray = array();
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
                    $variant->discounted_price = self::doubleNumber($taxed->taxable_discounted_price ?? $variant->discounted_price);
                    $variant->price = self::doubleNumber($taxed->taxable_price ?? $variant->price);
                    $variant->taxable_amount = self::doubleNumber($taxed->taxable_amount);

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

                    array_push($variantArray, $variant);
                }

                $products[$i]['variants'] = $variantArray;

                // Add product rating information
                $ratingData = CommonHelper::productAverageRating($row['id']);
                $products[$i]->rating_count = $ratingData['rating_count'];
                $products[$i]->average_rating = $ratingData['average_rating'];
                $products[$i]->product_rating = $isProductRatingEnabled;

                $i++;
            }
            $sections[$key]["products"] = $products;
        }

        $sections =  array_map("array_filter", $sections->toArray());
        $sections = array_filter($sections);
        return $sections;
    }

    public static function getBrandsHavingProducts()
    {
        $brands = Brand::orderBy('id', 'ASC')->where('status', 1)->whereExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('products')
                ->whereColumn('products.brand_id', 'brands.id');
        })->get();
        $brands = $brands->makeHidden(['created_at', 'updated_at', 'image', 'image_url', 'status']);
        return $brands;
    }

    public static function getProductVariantsSize()
    {
        $variants = ProductVariant::select('measurement as size', 'short_code', 'stock_unit_id as unit_id')
            ->from('product_variants as pv')->distinct()->leftJoin('units as u', 'pv.stock_unit_id', '=', 'u.id')->get();
        return $variants;
    }

    public static function doubleNumber($number)
    {
        $formattedNumber = number_format($number, 2);
        $floatNumber = (float) str_replace(',', '', $formattedNumber);
        return $floatNumber;
    }

    public static function getProductDetails($product_id, $user_id = null, $is_variants = true, $request = null)
    {
        $product = Product::select(
            'products.*',
            'sellers.longitude',
            'sellers.latitude',
            'cities.max_deliverable_distance',
            'cities.boundary_points',
            'co.name as country_made_in'
        )
            ->leftJoin("countries as co", "products.made_in", "=", "co.id")
            ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
            ->leftJoin('cities', 'sellers.city_id', '=', 'cities.id')
            ->where('products.id', $product_id)->first();
        if ($product) {
            $product = $product->makeHidden([
                'row_order',
                'return_status',
                'cancelable_status',
                'till_status',
                'description',
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
                'other_images',
                'cal_discount_percentage',
                'min_price',
                'max_price',
                'type',
                'boundary_points',
                'country_made_in'
            ]);

            $product['is_deliverable'] = true;
            $product['made_in'] = $product['country_made_in'] ?? "";
            $product['is_unlimited_stock'] = intval($product['is_unlimited_stock']) ?? 0;
            $product['tax_included_in_price'] = intval($product['tax_included_in_price']) ?? 0;
            $product['status'] = intval($product['status']) ?? 0;

            if (isset($product->max_deliverable_distance) && $product->max_deliverable_distance != 0 && $product->max_deliverable_distance != "") {
                if (isset($request->longitude) && CommonHelper::isDeliverable($product->max_deliverable_distance, $product->longitude, $product->latitude, $request->longitude, $request->latitude)) {
                    $product['is_deliverable'] = true;
                } else {
                    $product['is_deliverable'] = false;
                }

                $product['is_deliverable'] = true;
            } else {
                $product['is_deliverable'] = false;
            }

            if ($user_id) {
                $fav = Favorite::where('product_id', $product['id'])->where('user_id', $user_id)->first();
                $product['is_favorite'] = !is_null($fav) ? true : false;
            } else {
                $product['is_favorite'] = false;
            }

            if ($is_variants) {
                $variants = ProductVariant::where('product_id', $product->id)->get();
                $variantsArray = array();
                foreach ($variants as $variant) {
                    $product_variant = CommonHelper::getProductVariant($variant->id, $user_id);
                    array_push($variantsArray, $product_variant);
                }
                $product->variants = $variantsArray;
            }
            return $product;
        }
    }

    public static function getProductVariant($variant_id, $user_id = null)
    {
        $variant = ProductVariant::select(
            '*',
            DB::raw("(SELECT short_code FROM units as u WHERE u.id = pv.stock_unit_id) as stock_unit_name"),
            DB::raw("(SELECT is_unlimited_stock FROM products as p WHERE p.id = pv.product_id) as is_unlimited_stock")
        )
            ->from('product_variants as pv')
            ->where('id', $variant_id)
            ->first();

        if ($variant) {
            $variant = $variant->makeHidden([
                'product_id',
                'measurement_unit_id',
                'stock_unit_id',
                'deleted_at',
                'order_counter'
            ]);

            $variant['status'] = ($variant['stock'] <= 0 && $variant['is_unlimited_stock'] == 0) ? 0 : intval($variant['status']) ?? 0;

            $variant['cart_count'] = 0;
            if ($user_id) {
                $cart = Cart::where('product_variant_id', $variant['id'])->where('user_id', $user_id)->first();
                if ($cart) {
                    $variant['cart_count'] = $cart['qty'];
                }
            }

            $taxed = ProductHelper::getTaxableAmount($variant['id']);

            $variant['discounted_price'] = CommonHelper::doubleNumber($taxed->taxable_discounted_price ?? $variant['discounted_price']);
            $variant['price'] = CommonHelper::doubleNumber($taxed->taxable_price ?? $variant['price']);
            $variant['taxable_amount'] = CommonHelper::doubleNumber($taxed->taxable_amount);

            $variant['stock_unit_name'] = $variant['stock_unit_name'] ?? '';

            // Safely calculate calc_discount_percentage
            if (!empty($taxed->taxable_price) && $taxed->taxable_price > 0) {
                $discount = ($taxed->taxable_price - $taxed->taxable_discounted_price);
                $variant['calc_discount_percentage'] = round(($discount / $taxed->taxable_price) * 100, 2);
            } elseif (!empty($variant['price']) && $variant['price'] > 0) {
                $discount = ($variant['price'] - $variant['discounted_price']);
                $variant['calc_discount_percentage'] = round(($discount / $variant['price']) * 100, 2);
            } else {
                $variant['calc_discount_percentage'] = 0;
            }

            $variant['slab_prices'] = self::getSlabPricesForApi($variant['id'], (float) ($taxed->percentage ?? 0));

            return $variant;
        }

        return null;
    }


    public static function setOrderStatus($order_status)
    {
        $order_status['created_at'] = Carbon::now()->format('Y-m-d H:i:s');
        OrderStatus::create($order_status);
    }

    public static function getCartCount($user_id)
    {
        $total = Cart::select(DB::raw('COUNT(carts.id) AS cart_items_count'), DB::raw('sum(carts.qty) AS cart_total_qty'))
            ->Join('products', 'carts.product_id', '=', 'products.id')
            ->Join('product_variants', 'carts.product_variant_id', '=', 'product_variants.id')
            ->where('carts.save_for_later', '=', 0)
            ->where('user_id', $user_id)->first();
        $total->cart_items_count = intval($total->cart_items_count);
        $total->cart_total_qty = intval($total->cart_total_qty);

        $carts = Cart::select('carts.qty', 'carts.product_variant_id')
            ->Join('products', 'carts.product_id', '=', 'products.id')
            ->Join('product_variants', 'carts.product_variant_id', '=', 'product_variants.id')
            ->where('carts.save_for_later', '=', 0)
            ->where('user_id', '=', $user_id)
            ->get();

        $variant_ids = array_column($carts->toArray(), 'product_variant_id');
        $quantityArray = array_column($carts->toArray(), 'qty');

        $totalAmt = CommonHelper::calculateTotalAmount($variant_ids, $quantityArray);

        $total->save_price = $totalAmt['save_price'];
        $total->total_amount = $totalAmt['total_amount'];

        $total->product_variant_id = implode(',', $variant_ids);
        $total->quantity = implode(',', $quantityArray);

        return $total;
    }

    public static function generateOrderId()
    {
        return intval(round(microtime(true) * rand(1000, 9999)));
    }

    /**
     * Resolve the matching slab row for a given variant + qty.
     * Returns null when no slab is defined or qty falls outside all tiers.
     */
    public static function getMatchingSlab($variant_id, $qty)
    {
        $qty = (int) $qty;
        if ($qty < 1) {
            return null;
        }
        return ProductSlabPrice::where('product_variant_id', $variant_id)
            ->where('min_qty', '<=', $qty)
            ->where(function ($q) use ($qty) {
                $q->whereNull('max_qty')->orWhere('max_qty', '>=', $qty);
            })
            ->orderBy('min_qty', 'desc')
            ->first();
    }

    /**
     * Pre-tax unit price for a variant at a given qty.
     * Falls back to discounted_price (if > 0) then price when no slab matches.
     */
    public static function getSlabUnitPrice($variant_id, $qty)
    {
        $slab = self::getMatchingSlab($variant_id, $qty);
        if ($slab) {
            return (float) $slab->price;
        }
        $variant = ProductVariant::select('price', 'discounted_price')->find($variant_id);
        if (!$variant) {
            return 0.0;
        }
        return ($variant->discounted_price != 0 && $variant->discounted_price !== null)
            ? (float) $variant->discounted_price
            : (float) $variant->price;
    }

    /**
     * Slab-aware version of ProductHelper::getTaxableAmount.
     * Returns an object with the same shape (taxable_amount, taxable_price,
     * taxable_discounted_price, percentage, price, discounted_price) so it
     * can be a drop-in replacement at call sites.
     */
    public static function getSlabTaxableAmount($variant_id, $qty)
    {
        $base = ProductHelper::getTaxableAmount($variant_id);
        if (empty($base)) {
            return $base;
        }
        $slab = self::getMatchingSlab($variant_id, $qty);
        if (!$slab) {
            return $base;
        }
        $slabPrice = (float) $slab->price;
        $percentage = (float) ($base->percentage ?? 0);
        $base->discounted_price = $slabPrice;
        $base->taxable_discounted_price = $slabPrice + ($slabPrice * $percentage / 100);
        $base->taxable_amount = $base->taxable_discounted_price;
        return $base;
    }

    /**
     * Persist slab pricing rows for a variant. Accepts a JSON-encoded string
     * or an array of {min_qty, max_qty, price} objects. Empty input deletes
     * existing slabs. Returns null on success, error message string otherwise.
     */
    public static function saveSlabPricesForVariant($variant_id, $slabs)
    {
        if (is_string($slabs)) {
            $decoded = json_decode($slabs, true);
            $slabs = is_array($decoded) ? $decoded : [];
        } elseif (!is_array($slabs)) {
            $slabs = [];
        }

        $clean = [];
        foreach ($slabs as $row) {
            $minQty = isset($row['min_qty']) ? (int) $row['min_qty'] : 0;
            $maxRaw = $row['max_qty'] ?? null;
            $maxQty = ($maxRaw === null || $maxRaw === '' || $maxRaw === 'null') ? null : (int) $maxRaw;
            $price = isset($row['price']) ? (float) $row['price'] : -1;
            if ($minQty < 1) {
                return 'Slab min_qty must be at least 1';
            }
            if ($maxQty !== null && $maxQty < $minQty) {
                return 'Slab max_qty must be greater than or equal to min_qty';
            }
            if ($price < 0) {
                return 'Slab price cannot be negative';
            }
            $clean[] = ['min_qty' => $minQty, 'max_qty' => $maxQty, 'price' => $price];
        }

        usort($clean, function ($a, $b) {
            return $a['min_qty'] <=> $b['min_qty'];
        });
        for ($i = 1; $i < count($clean); $i++) {
            $prevMax = $clean[$i - 1]['max_qty'];
            if ($prevMax === null || $prevMax >= $clean[$i]['min_qty']) {
                return 'Slab ranges overlap';
            }
        }

        ProductSlabPrice::where('product_variant_id', $variant_id)->delete();
        if (!empty($clean)) {
            $now = now();
            $rows = array_map(function ($r) use ($variant_id, $now) {
                return $r + [
                    'product_variant_id' => $variant_id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }, $clean);
            ProductSlabPrice::insert($rows);
        }
        return null;
    }

    /**
     * Return the slab table for a variant decorated with tax-inclusive prices.
     * Used in API responses so retailer app can render bulk-pricing UI.
     */
    public static function getSlabPricesForApi($variant_id, $tax_percentage = 0)
    {
        $tax = (float) $tax_percentage;
        return ProductSlabPrice::where('product_variant_id', $variant_id)
            ->orderBy('min_qty')
            ->get()
            ->map(function ($slab) use ($tax) {
                $price = (float) $slab->price;
                return [
                    'min_qty' => (int) $slab->min_qty,
                    'max_qty' => $slab->max_qty !== null ? (int) $slab->max_qty : null,
                    'price' => self::doubleNumber($price),
                    'price_with_tax' => self::doubleNumber($price + ($price * $tax / 100)),
                ];
            })->toArray();
    }

    /**
     * Compute delivery_date for an order based on a PER-DISTRIBUTOR cutoff time.
     * Rule: order created at-or-before cutoff -> delivery = next day.
     *       order created after cutoff -> delivery = day after next.
     * Cutoff is read from sellers.order_cutoff_time (HH:MM, 24h).
     * Default 15:00 (3 PM) per Sarthi spec when seller has no cutoff set.
     */
    public static function computeDeliveryDate($createdAt = null, $sellerId = null)
    {
        $createdAt = $createdAt ? \Carbon\Carbon::parse($createdAt) : \Carbon\Carbon::now();

        $cutoffString = null;
        if ($sellerId) {
            $cutoffString = Seller::where('id', $sellerId)->value('order_cutoff_time');
        }
        if (empty($cutoffString) || !preg_match('/^\d{1,2}:\d{2}$/', trim($cutoffString))) {
            $cutoffString = '15:00';
        }

        $cutoffForDay = \Carbon\Carbon::parse($createdAt->toDateString() . ' ' . $cutoffString);

        return $createdAt->lessThanOrEqualTo($cutoffForDay)
            ? $createdAt->copy()->addDay()->toDateString()
            : $createdAt->copy()->addDays(2)->toDateString();
    }

    public static function calculateTotalAmount($variant_ids, $quantityArray)
    {
        $save_price = 0;
        $total_amount = 0;
        if (count($variant_ids) === count($quantityArray)) {
            foreach ($variant_ids as $key => $variant_id) {
                $qty = intval($quantityArray[$key]);

                $taxed_amount = self::getSlabTaxableAmount($variant_id, $qty);

                $variant = ProductVariant::select('price', 'discounted_price')->where('id', $variant_id)->first();

                if ($variant->discounted_price != 0 && $variant->discounted_price != "") {
                    $mainPrice = $variant->discounted_price;
                } else {
                    $mainPrice = $variant->price;
                }

                $price = floatval($taxed_amount->taxable_amount ?? $mainPrice) * $qty;

                $total_amount += floatval($price);

                $save_price += floatval($taxed_amount->price) * $qty;
            }
        }
        return array('save_price' => $save_price, 'total_amount' => $total_amount);
    }

    public static function calculateOrderTotalTax($item_details, $quantityArray)
    {
        $order_total_tax_amt = 0;
        $order_total_tax_per = 0;
        foreach ($item_details as $key => $item) {
            $price = $item->price;
            $discounted_price = (empty($item->discounted_price) || $item->discounted_price == "") ? 0 : $item->discounted_price;
            $quantity = (int) $quantityArray[$key];
            $tax_percentage = (empty($item->tax_percentage) || ($item->tax_percentage == "")) ? 0 : $item->tax_percentage;

            $variant_id = $item->id ?? $item->product_variant_id ?? null;
            $slabUnit = $variant_id ? self::getSlabUnitPrice($variant_id, $quantity) : null;
            if ($slabUnit !== null && $slabUnit > 0 && self::getMatchingSlab($variant_id, $quantity)) {
                $final_price = $slabUnit * $quantity;
            } else {
                $final_price = ($discounted_price != 0) ? ($discounted_price * $quantity) : ($price * $quantity);
            }

            $tax_count = ($tax_percentage / 100) * $final_price;
            $order_total_tax_amt += $tax_count;
            $order_total_tax_per += $tax_percentage;
        }
        return array('order_total_tax_amt' => $order_total_tax_amt, 'order_total_tax_per' => $order_total_tax_per);
    }


    public static function addSellerWiseOrder($order_id)
    {
        $orders_id = CommonHelper::generateOrderId();
        $order = Order::with('items')->where("id", $order_id)->first();
        $items = $order->items;
        $seller_ids = array_values(array_unique(array_column($items->toArray(), 'seller_id')));

        if (count($seller_ids) > 1) {
            $i = 1;



            foreach ($seller_ids as $key => $seller_id) {
                $items = OrderItem::where('order_id', $order_id)->where('seller_id', $seller_id)->get();
                $item_arr = array_column($items->toArray(), 'product_variant_id');

                $item_details = CommonHelper::getProductByVariantId($item_arr);
                $quantity_arr = array_column($items->toArray(), 'quantity');


                $totalAmt = CommonHelper::calculateTotalAmount($item_arr, $quantity_arr);
                $total = $totalAmt["total_amount"]; // sub_total of cart

                $sellerPromoPer = (floatval($total) / floatval($order->total)) * 100;
                $promo_discount = (floatval($order->promo_discount) * $sellerPromoPer) / 100;

                $delivery_charge = floatval($order->delivery_charge) / count($seller_ids);
                $final_total = ($totalAmt["total_amount"] - $promo_discount) + $delivery_charge;


                $totalTax = CommonHelper::calculateOrderTotalTax($item_details, $quantity_arr);
                $order_total_tax_amt = $totalTax['order_total_tax_amt'];
                $order_total_tax_per = $totalTax['order_total_tax_per'];

                $generate_otp = Setting::get_value("generate_otp");

                if ($generate_otp == 1) {
                    $otp_number = mt_rand(100000, 999999);
                } else {
                    $otp_number = 0;
                }


                if ($i === 1) {
                    $newOrder = Order::where('id', $order_id)->first();
                } else {
                    $newOrder = new Order();
                }
                $newOrder->user_id = $order->user_id;
                $order->delivery_boy_id = 0;
                $newOrder->orders_id = $orders_id;

                $newOrder->otp = $otp_number;

                $newOrder->mobile = $order->mobile;
                $newOrder->order_note = $order->order_note;

                $newOrder->total = $total;

                $newOrder->delivery_charge = $delivery_charge;

                $newOrder->tax_amount = $order_total_tax_amt;
                $newOrder->tax_percentage = $order_total_tax_per;

                $newOrder->wallet_balance = $order->walletvalue ?? 0;

                $newOrder->promo_code = $order->promo_code;
                $newOrder->promo_discount = $promo_discount;

                $newOrder->final_total = $final_total;

                $newOrder->payment_method = $order->payment_method;
                $newOrder->address = $order->address;
                $newOrder->latitude = $order->latitude;
                $newOrder->longitude = $order->longitude;
                $newOrder->delivery_time = $order->delivery_time;
                $newOrder->status = $order->order_status ?? 0;
                $newOrder->active_status = $order->active_status;
                $newOrder->order_from = $order->order_from;
                $newOrder->pincode_id = $order->pincode_id;
                $newOrder->area_id = $order->area_id ?? 0;
                $newOrder->address_id = $order->address_id;
                $newOrder->save();

                OrderItem::where('order_id', $order_id)->where('seller_id', $seller_id)
                    ->update(['order_id' =>  $newOrder->id, 'orders_id' =>  $orders_id]);

                $order_status = array();
                $order_status['order_id'] = $newOrder->id;
                $order_status['order_item_id'] = 0;
                $order_status['status'] = OrderStatusList::$received;
                $order_status['created_by'] =  $order->user_id;
                $order_status['user_type'] = OrderStatus::$userTypeUser;
                CommonHelper::setOrderStatus($order_status);

                $newOrder = Order::with('items')->where("id", $newOrder->id)->first();

                if (!empty($newOrder)) {

                    try {
                        dispatch(new SendEmailJob($newOrder));
                    } catch (\Exception $e) {
                        Log::error("Place order Send mail error :", [$e->getMessage()]);
                    }
                }

                $i++;
            }
            //sleep(1);
            return "Updated";
        } else {

            $order_status = array();
            $order_status['order_id'] = $order->id;
            $order_status['order_item_id'] = 0;
            $order_status['status'] = OrderStatusList::$received;
            $order_status['created_by'] =  $order->user_id;
            $order_status['user_type'] = OrderStatus::$userTypeUser;
            CommonHelper::setOrderStatus($order_status);
            if (!empty($order)) {
                try {
                    dispatch(new SendEmailJob($order));
                } catch (\Exception $e) {
                    Log::error("Place order Send mail error : ", [$e->getMessage()]);
                }
            }
            return "notUpdated";
        }
    }

    public static function findGoogleMapDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo)
    {
        $origins = implode(",", [$latitudeFrom, $longitudeFrom]);
        $destinations = implode(",", [$latitudeTo, $longitudeTo]);
        $result = (new GoogleMaps)->findGoogleMapDistance($origins, $destinations);
        return $result;
    }

    public static function findGoogleMapDistanceLocal($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo)
    {
        $url = "http://egrocer.netsofters.net/customer/distance_test?latitudeFrom=" . $latitudeFrom . "&longitudeFrom=" . $longitudeFrom . "&latitudeTo=" . $latitudeTo . "&longitudeTo=" . $longitudeTo;

        $context = stream_context_create([
            'http' => [
                'timeout' => 10, // Increase the timeout value (in seconds) as needed
            ],
        ]);

        $result = file_get_contents($url, false, $context);
        $data = json_decode($result, true);

        $data["body"] = json_decode($data["body"], true);
        return $data;
    }

    public static function getDeliveryCharge($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo, $cityIdsString, $sub_total)
    {
        // Convert the string to an array
        $cityIds = explode(',', $cityIdsString);

        // Retrieve cities with specified IDs
        $cities = City::whereIn('id', $cityIds)->get();
        $point = ['lat' => $latitudeFrom, 'lng' => $longitudeFrom];

        $cityId = '';

        foreach ($cities as $city) {
            if ($city->geolocation_type == 'polygon') {
                $polygon = json_decode($city->boundary_points, true);

                if (is_array($polygon) && !empty($polygon) && self::isPointInPolygon($point, $polygon)) {
                    $cityId = $city->id;
                }
            } elseif ($city->geolocation_type == 'circle') {
                $boundaryPoints  = json_decode($city->boundary_points, true);
                $radius = $city->radius; // Assuming radius is stored in meters

                if (is_array($boundaryPoints) && !empty($boundaryPoints)) {
                    $center = $boundaryPoints[0]; // Assuming the first element is the center point
                    if (self::isPointInCircle($point, $center, $radius)) {
                        $cityId = $city->id;
                    }
                }
            }
        }
        $city = City::where('id', $cityId)->first();
        if ($city) {
            $charge = 0;
            $charge_method = $city['delivery_charge_method'];
            $min_amount_for_free_delivery = $city['min_amount_for_free_delivery'];

            $result = CommonHelper::findGoogleMapDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo);

            if (isset($result['http_code']) && $result['http_code'] != "200") {
                $response['error'] = true;
                $response['message'] = $result['body']['error_message'] ?? "";
                $response['charge'] = "0";
                $response['distance'] = "0";
                $response['duration'] = "0";
                return $response;
            }

            if (isset($result['body']) && !empty($result['body'])) {

                if (is_string($result["body"])) {
                    $result["body"] =  json_decode($result["body"], true);
                }

                if (isset($result['body']['status']) && $result['body']['status'] == "REQUEST_DENIED") {
                    $response['error'] = true;

                    $response['message'] = $result['body']['error_message'];

                    $response['charge'] = "0";
                    $response['distance'] = "0";
                    $response['duration'] = "0";
                    return $response;
                } else if (isset($result['body']['status']) && $result['body']['status'] == "OK") {
                    if (isset($result['body']['rows'][0]['elements'][0]['status']) && $result['body']['rows'][0]['elements'][0]['status'] == "OK") {

                        $distance_text = $result['body']['rows'][0]['elements'][0]['distance']['text'];
                        $distance_in_meter = $result['body']['rows'][0]['elements'][0]['distance']['value'];
                        $distance = round(($distance_in_meter / 1000), 1);
                        $time = $result['body']['rows'][0]['elements'][0]['duration']['text'];

                        if ($charge_method == "fixed_charge") {
                            $charge = $city['fixed_charge'];
                        }
                        if ($charge_method == "per_km_charge") {
                            $charge = ($city['per_km_charge'] * intval($distance));
                        }
                        if ($charge_method == "range_wise_charges") {
                            $ranges = json_decode($city['range_wise_charges'], true);
                            $distance = round($distance);
                            foreach ($ranges as $range) {
                                if ($distance >= $range['from_range'] && $distance <= $range['to_range']) {
                                    $charge = ($range['price']);
                                }
                            }
                        }
                        if ($min_amount_for_free_delivery <= $sub_total && $min_amount_for_free_delivery != 0) {
                            $charge = 0;
                        }

                        $response['error'] = false;
                        $response['message'] = 'Data fetched successfully.';
                        $response['charge'] = $charge;
                        $response['distance'] = $distance_text;
                        $response['duration'] = $time;
                        return $response;
                    } else if (isset($result['body']['rows'][0]['elements'][0]['status']) && $result['body']['rows'][0]['elements'][0]['status'] == "ZERO_RESULTS") {
                        $response['error'] = false;
                        $response['message'] = 'Data not found or invalid.Please check!';
                        $response['charge'] = "0";
                        $response['distance'] = "0";
                        $response['duration'] = "0";
                        return $response;
                    } else {
                        $response['error'] = true;
                        $response['message'] = 'Something went wrong...';
                        $response['charge'] = "0";
                        $response['distance'] = "0";
                        $response['duration'] = "0";
                        return $response;
                    }
                } else if (isset($result['body']['status']) && $result['body']['status'] == "OVER_QUERY_LIMIT") {
                    // You have exceeded the QPS limits. Billing has not been enabled on your account
                    $response['error'] = true;
                    $response['message'] = 'You have exceeded the QPS limits or billing not enabled may be.';
                    $response['charge'] = "0";
                    $response['distance'] = "0";
                    $response['duration'] = "0";
                    return $response;
                } else if (isset($result['body']['status']) && $result['body']['status'] == "INVALID_REQUEST") {
                    // indicating the API request was malformed, generally due to the missing input parameter
                    $response['error'] = true;
                    $response['message'] = 'Indicating the API request was malformed.';
                    $response['charge'] = "0";
                    $response['distance'] = "0";
                    $response['duration'] = "0";
                    return $response;
                } else if (isset($result['body']['status']) && $result['body']['status'] == "UNKNOWN_ERROR") {
                    // indicating an unknown error
                    $response['error'] = true;
                    $response['message'] = 'An unknown error occure.';
                    $response['charge'] = "0";
                    $response['distance'] = "0";
                    $response['duration'] = "0";
                    return $response;
                } else if (isset($result['body']['status']) && $result['body']['status'] == "ZERO_RESULTS") {
                    // indicating that the search was successful but returned no results. This may occur if the search was passed a bounds in a remote location.
                    $response['error'] = true;
                    $response['message'] = 'Data not found or invalid.Please check!';
                    $response['charge'] = "0";
                    $response['distance'] = "0";
                    $response['duration'] = "0";
                    return $response;
                } else {
                    $response['error'] = true;
                    $response['message'] = 'Something went wrong.';
                    $response['charge'] = "0";
                    $response['distance'] = "0";
                    $response['duration'] = "0";
                    return $response;
                }
            }
        } else {
            $response['error'] = true;
            $response['message'] = 'Sorry, We are not delivering on selected address';
            return $response;
        }
    }

    public static function getAllDeliveryCharge($latitudeFrom, $longitudeFrom, $seller_ids, $sub_total)
    {
        $sellers = Seller::select('sellers.id', 'sellers.name', 'sellers.latitude', 'sellers.longitude', 'sellers.city_id', DB::raw("6371 * acos(cos(radians(" . $latitudeFrom . "))
                                * cos(radians(sellers.latitude)) * cos(radians(sellers.longitude) - radians(" . $longitudeFrom . "))
                                + sin(radians(" . $latitudeFrom . ")) * sin(radians(sellers.latitude))) AS distance"))
            ->leftJoin("cities", "sellers.city_id", "cities.id")->whereIn('sellers.id', $seller_ids)
            ->get();

        if ($sellers->isNotEmpty()) {

            $total_delivery_charge = 0;
            $data = array();
            foreach ($sellers as $seller) {
                $subData = array();


                $delivery = self::getDeliveryCharge($latitudeFrom, $longitudeFrom, $seller->latitude, $seller->longitude, $seller->city_id, $sub_total);

                if ($delivery["error"] == true) {
                    $response['status'] = 0;
                    $response['message'] =  $delivery["message"];
                    return $response;
                }

                $subData['seller_name'] = $seller->name;
                $subData['delivery_charge'] = $delivery["charge"];
                $subData['distance'] = $delivery["distance"];
                $subData['duration'] = $delivery["duration"];
                $total_delivery_charge += $delivery["charge"];
                array_push($data, $subData);
                $result['total_delivery_charge'] = $total_delivery_charge;
                $result['sellers_info'] = $data;

                $response['status'] = 1;
                $response['message'] = 'Data fetched successfully.';
                $response['data'] = $result;
                return $response;
            }
        } else {
            $response['status'] = 0;
            $response['message'] =  __('sorry_we_are_not_delivering_on_selected_address');
            return $response;
        }
    }

    public static function getSellerCategories($seller_id)
    {
        $seller = Seller::where('id', $seller_id)->first();
        $categories =  Category::whereIn('id', explode(",", $seller->categories))->orderBy('name', 'ASC')->get()->makeHidden(['has_child', 'has_active_child', 'translations']);
        return $categories;
    }

    public static function getSellerCategoriesTreeArray($seller_id)
    {
        if (!$seller_id) {
            return [];
        }
        $seller = Seller::where('id', $seller_id)->first();
        if (!$seller || empty($seller->categories)) {
            return [];
        }
        $sellerCategoryIds = array_filter(array_map('intval', explode(',', $seller->categories)));
        if (empty($sellerCategoryIds)) {
            return [];
        }
        // Load all categories once, then build a tree in memory to avoid N+1 queries.
        $allCategories = Category::query()
            ->select('id', 'parent_id', 'name', 'row_order')
            ->get();

        $byParent = [];
        foreach ($allCategories as $category) {
            $byParent[$category->parent_id][] = $category;
        }

        foreach ($byParent as &$children) {
            usort($children, function ($a, $b) {
                $rowA = $a->row_order ?? 0;
                $rowB = $b->row_order ?? 0;
                if ($rowA === $rowB) {
                    return strcmp((string) $a->name, (string) $b->name);
                }
                return $rowA <=> $rowB;
            });
        }
        unset($children);

        // Expand to include all descendants using the in-memory tree.
        $allowed = array_fill_keys($sellerCategoryIds, true);
        $queue = $sellerCategoryIds;
        while (!empty($queue)) {
            $parentId = array_pop($queue);
            if (!isset($byParent[$parentId])) {
                continue;
            }
            foreach ($byParent[$parentId] as $child) {
                if (!isset($allowed[$child->id])) {
                    $allowed[$child->id] = true;
                    $queue[] = $child->id;
                }
            }
        }

        $result = [];
        self::collectSellerCategoriesTreeFromMap($byParent, $allowed, 0, 0, $result);
        return $result;
    }

    protected static function collectSellerCategoriesTreeFromMap(array $byParent, array $allowed, $parentId, $depth, array &$result)
    {
        if (!isset($byParent[$parentId])) {
            return;
        }

        foreach ($byParent[$parentId] as $category) {
            if (!isset($allowed[$category->id])) {
                continue;
            }
            $name = trim(strip_tags($category->name));
            $result[] = ['id' => $category->id, 'name' => $name, 'depth' => $depth];
            self::collectSellerCategoriesTreeFromMap($byParent, $allowed, $category->id, $depth + 1, $result);
        }
    }

    public static function getSellerCategoriesOptionsHtml($seller_id)
    {
        $list = self::getSellerCategoriesTreeArray($seller_id);
        $html = '';
        foreach ($list as $item) {
            $indent = str_repeat('&nbsp;&nbsp;', (int) $item['depth']);
            $name = htmlspecialchars($item['name'], ENT_QUOTES, 'UTF-8');
            $html .= '<option value="' . (int) $item['id'] . '">' . $indent . $name . '</option>';
        }
        return $html;
    }

    public static function getStatusOrderCount($seller_id = null, $order_type = null)
    {

        $query = '(select count(orders.id) from orders where orders.active_status = order_status_lists.id AND orders.deleted_at IS NULL) AS order_count';

        if (isset($seller_id) && $seller_id != "" && $seller_id != 0) {
            $orderIds = OrderItem::where('seller_id', $seller_id)->get()->pluck('order_id')->toArray();
            if (count($orderIds) > 0) {
                $query = '(select count(orders.id) from orders where orders.active_status = order_status_lists.id and orders.id IN (' . implode(",", array_unique($orderIds)) . ')) AS order_count';
            }
        }

        if ($order_type == 'doorstep') {
            $query = str_replace('orders.active_status = order_status_lists.id', 'orders.active_status = order_status_lists.id AND orders.order_type = "doorstep"', $query);
        } elseif ($order_type == 'selfpickup') {
            $query = str_replace('orders.active_status = order_status_lists.id', 'orders.active_status = order_status_lists.id AND orders.order_type = "selfpickup"', $query);
        }

        $statusQuery = OrderStatusList::select('order_status_lists.id', 'order_status_lists.status', DB::raw($query));

        if ($order_type == 'doorstep') {
            $statusQuery = $statusQuery->whereBetween('order_status_lists.id', [1, 8]);
        } elseif ($order_type == 'selfpickup') {
            $statusQuery = $statusQuery->whereBetween('order_status_lists.id', [7, 11]);
        }

        if ($order_type == 'selfpickup') {
            return $statusQuery->orderByRaw('CASE 
                WHEN order_status_lists.id IN (9,10,11) THEN order_status_lists.id 
                WHEN order_status_lists.id = 7 THEN 12 
                WHEN order_status_lists.id = 8 THEN 13 
                ELSE order_status_lists.id 
            END ASC')->get();
        }

        return $statusQuery->orderBy('order_status_lists.id', 'asc')->get();
    }

    public static function calculateRefundAmountForOrderItem($order, $orderItem)
    {
        if (!$order || !$orderItem) {
            return 0;
        }
        $itemSubTotal = floatval($orderItem->sub_total ?? 0);

        // Get total sub_total of all non-cancelled order items (for proportional share)
        $totalSubTotal = OrderItem::where('order_id', $order->id)
            ->where('status', '!=', OrderStatusList::$cancelled)
            ->sum('sub_total');

        if ($totalSubTotal <= 0) {
            return $itemSubTotal;
        }

        $itemShare = $itemSubTotal / $totalSubTotal;
        $amount = $itemSubTotal;

        // Proportional: deduct item's share of promo discount
        if (floatval($order->promo_discount ?? 0) > 0) {
            $promoDiscountForItem = floatval($order->promo_discount) * $itemShare;
            $amount -= $promoDiscountForItem;
        }

        // Proportional: add item's share of refundable additional charges
        $additional_charges = json_decode($order->additional_charges, true) ?? [];
        $refundable_charges_total = 0;
        foreach ($additional_charges as $charge) {
            if (isset($charge['is_refundable']) && $charge['is_refundable'] == 1) {
                $refundable_charges_total += floatval($charge['amount']);
            }
        }
        if ($refundable_charges_total > 0) {
            $amount += $refundable_charges_total * $itemShare;
        }

        return max(0, round($amount, 2));
    }

    public static function getOrderDetails($order_id, $exclude_cancelled_returned = false)
    {
        $order = Order::select(
            'orders.*',
            'orders.additional_charges',
            'orders.pickup_address',
            'orders.address as order_address',
            'orders.mobile as order_mobile',
            'orders.id as order_id',
            'orders.created_at as orders_created_at',
            'users.*',
            'users.name as user_name',
            'users.email as user_email',
            'users.email as user_email',
            'users.mobile as user_mobile',
            'users.country_code as user_country_code',
            'address.*',
            'address.address as customer_address',
            'address.landmark as customer_landmark',
            'address.area as customer_area',
            'address.pincode as customer_pincode',
            'address.city as customer_city',
            'address.state as customer_state',
            'address.country as customer_country',
            'address.latitude as customer_latitude',
            'address.longitude as customer_longitude',
            'sellers.id as seller_id',
            'sellers.name as seller_name',
            'sellers.mobile as seller_mobile',
            'sellers.email as seller_email',
            'sellers.store_name',
            'sellers.formatted_address as seller_formatted_address',
            'sellers.place_name as seller_place_name',
            'sellers.latitude as seller_latitude',
            'sellers.longitude as seller_longitude',
            'sellers.pickup_store_timings',
            'delivery_boys.name as delivery_boy_name',
            'order_items.id as order_item_id',
            'os.id as active_status',
            'os.status as status_name',
            'schemes.name as scheme_name'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('user_addresses as address', 'orders.address_id', '=', 'address.id')
            ->leftJoin('cities', 'address.city_id', '=', 'cities.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('delivery_boys', 'orders.delivery_boy_id', '=', 'delivery_boys.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->leftJoin('order_status_lists as os', 'orders.active_status', '=', 'os.id')
            ->leftJoin('schemes', 'orders.scheme_id', '=', 'schemes.id')
            ->where('orders.id', $order_id)
            ->groupBy('orders.id')
            ->first();
        if ($order) {
            $order->additional_charges = json_decode($order->additional_charges ?? "[]");

            if ($order->order_type == 'selfpickup') {
                $pickupAddress = $order->pickup_address ?? [];
                if (is_string($pickupAddress)) {
                    $decoded = json_decode($pickupAddress, true);
                    $pickupAddress = (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) ? $decoded : ['pickup_store_address' => $pickupAddress, 'opening_time' => '', 'closing_time' => ''];
                }
                if (!is_array($pickupAddress)) {
                    $pickupAddress = [];
                }
                if ((empty($pickupAddress['opening_time']) || empty($pickupAddress['closing_time'])) && !empty($order->pickup_store_timings)) {
                    $sellerTimings = is_string($order->pickup_store_timings)
                        ? json_decode($order->pickup_store_timings, true) ?? []
                        : $order->pickup_store_timings;

                    if (is_array($sellerTimings)) {
                        $pickupAddress['opening_time'] = $pickupAddress['opening_time'] ?: ($sellerTimings['opening_time'] ?? '');
                        $pickupAddress['closing_time'] = $pickupAddress['closing_time'] ?: ($sellerTimings['closing_time'] ?? '');
                    }
                }

                $order->pickup_address = $pickupAddress;
            } else {
                $order->pickup_address = [];
            }
        }

        $order_items_query = Order::select(
            'order_items.*',
            'orders.mobile',
            'orders.total',
            'orders.delivery_charge',
            'orders.discount',
            'orders.promo_code',
            'orders.promo_discount',
            'orders.wallet_balance',
            'orders.final_total',
            'orders.payment_method',
            'orders.address',
            'orders.delivery_time',
            'users.name as user_name',
            'order_items.status as order_status',
            'sellers.name as seller_name',
            'products.id as product_id',
            'products.return_status',
            'products.return_days',
            DB::raw('CONCAT("' . asset('storage/') . '", "/", products.image) as image'),
            'os.id as active_status',
            'os.status as status_name'
        )
            ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
            ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
            ->leftJoin('order_status_lists as os', 'order_items.active_status', '=', 'os.id')
            ->where('orders.id', $order_id);

        if ($exclude_cancelled_returned) {
            $order_items_query->whereNotIn('order_items.active_status', [7, 8]);
        }

        $order_items = $order_items_query->orderBy('order_items.id', 'DESC')->get();
        if (auth()->user()->role_id == 3) {
            $seller_id =  auth()->user()->seller->id;

            $seller_order_items_query = Order::select(
                'order_items.*',
                'orders.mobile',
                'orders.total',
                'orders.delivery_charge',
                'orders.discount',
                'orders.promo_code',
                'orders.promo_discount',
                'orders.wallet_balance',
                'orders.final_total',
                'orders.payment_method',
                'orders.address',
                'orders.delivery_time',
                'users.name as user_name',
                'order_items.status as order_status',
                'sellers.name as seller_name',
                'products.id as product_id',
                'products.return_status',
                'products.return_days',
                DB::raw('CONCAT("' . asset('storage/') . '", "/", products.image) as image'),
                'os.id as active_status',
                'os.status as status_name'
            )
                ->leftJoin('order_items', 'order_items.order_id', '=', 'orders.id')
                ->leftJoin('users', 'orders.user_id', '=', 'users.id')
                ->leftJoin('product_variants', 'order_items.product_variant_id', '=', 'product_variants.id')
                ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
                ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
                ->leftJoin('order_status_lists as os', 'order_items.active_status', '=', 'os.id')
                ->where('orders.id', $order_id)
                ->where('sellers.id', '=',  $seller_id);

            if ($exclude_cancelled_returned) {
                $seller_order_items_query->whereNotIn('order_items.active_status', [7, 8]);
            }

            $order_items = $seller_order_items_query->orderBy('order_items.id', 'DESC')->get();
        }

        // Add is_product_returned flag to each order item if product is requested for return
        $order_item_ids = $order_items->pluck('id')->toArray();
        if (!empty($order_item_ids)) {
            $returnRequests = ReturnRequest::where('order_id', $order_id)
                ->whereIn('order_item_id', $order_item_ids)
                ->where('status', '!=', ReturnStatusList::$rCancelled)
                ->pluck('order_item_id')
                ->toArray();

            foreach ($order_items as $order_item) {
                $order_item->is_product_returned = in_array($order_item->id, $returnRequests) ? 1 : 0;
            }
        } else {
            foreach ($order_items as $order_item) {
                $order_item->is_product_returned = 0;
            }
        }

        // Add seller, delivery boy, status translations per order item and order.
        // If Content-Language header is passed: single-language format { lang, name }.
        // If not passed: all-language format { en: "...", hi: "..." } for admin panel.
        if ($order_items->isNotEmpty()) {
            $contentLanguage = request() ? request()->header('Content-Language') : null;
            $useContentLanguage = $contentLanguage !== null && trim((string) $contentLanguage) !== '';

            $languageService = app(LanguageService::class);
            $activeLangCodes = collect($languageService->getActiveLanguages())->pluck('code')->filter()->values()->all();
            $defaultLang = $languageService->getDefaultLanguage();
            $defaultCode = $defaultLang ? $languageService->getLanguageCode($defaultLang->id) : 'en';

            if ($useContentLanguage) {
                // Single language: Content-Language passed
                $langCode = LanguageService::getCurrentCode() ?? 'en';
                $sellerIds = array_unique(array_merge(
                    $order_items->pluck('seller_id')->filter()->unique()->values()->toArray(),
                    $order && isset($order->seller_id) ? [$order->seller_id] : []
                ));
                $sellerNameMap = [];
                $storeNameMap = [];
                if (!empty($sellerIds)) {
                    foreach (Seller::whereIn('id', $sellerIds)->with('translations')->get(['id', 'name', 'store_name']) as $s) {
                        $sellerNameMap[$s->id] = ['lang' => $langCode, 'name' => $s->name ?? ''];
                        $storeNameMap[$s->id] = ['lang' => $langCode, 'name' => $s->store_name ?? ''];
                    }
                }
                $deliveryBoyIds = $order && ($order->delivery_boy_id ?? 0) ? [$order->delivery_boy_id] : [];
                $deliveryBoyNameMap = [];
                if (!empty($deliveryBoyIds)) {
                    foreach (DeliveryBoy::whereIn('id', $deliveryBoyIds)->with('translations')->get(['id', 'name']) as $db) {
                        $deliveryBoyNameMap[$db->id] = ['lang' => $langCode, 'name' => $db->name ?? ''];
                    }
                }
                $statusIds = array_unique(array_merge(
                    $order_items->pluck('active_status')->filter()->unique()->values()->toArray(),
                    $order && ($order->active_status ?? 0) ? [$order->active_status] : []
                ));
                $statusNameMap = [];
                $previousLocale = app()->getLocale();
                app()->setLocale($langCode);
                foreach ($statusIds as $sid) {
                    $sid = (int) $sid;
                    $translated = OrderStatusList::getTranslatedName($sid);
                    $fallback = ($order && ($order->active_status ?? 0) == $sid) ? ($order->status_name ?? '') : ($order_items->firstWhere('active_status', $sid)->status_name ?? '');
                    $statusNameMap[$sid] = ['lang' => $langCode, 'name' => $translated !== '' ? $translated : $fallback];
                }
                app()->setLocale($previousLocale);
                foreach ($order_items as $item) {
                    $item->seller_name_translation = $sellerNameMap[$item->seller_id ?? 0] ?? ['lang' => $langCode, 'name' => $item->seller_name ?? ''];
                    $statusEntry = $statusNameMap[$item->active_status ?? 0] ?? ['name' => $item->status_name ?? ''];
                    $item->order_status_name = $statusEntry['name'] ?? $item->status_name ?? '';
                }
                if ($order) {
                    $order->seller_name_translation = $sellerNameMap[$order->seller_id ?? 0] ?? ['lang' => $langCode, 'name' => $order->seller_name ?? ''];
                    $order->store_name_translation = $storeNameMap[$order->seller_id ?? 0] ?? ['lang' => $langCode, 'name' => $order->store_name ?? ''];
                    $order->delivery_boy_name_translation = $deliveryBoyNameMap[$order->delivery_boy_id ?? 0] ?? ['lang' => $langCode, 'name' => $order->delivery_boy_name ?? ''];
                    $statusEntry = $statusNameMap[$order->active_status ?? 0] ?? ['name' => $order->status_name ?? ''];
                    $order->order_status_name = $statusEntry['name'] ?? $order->status_name ?? '';
                }
            } else {
                // All languages: Content-Language not passed (admin panel)
                $sellerIds = array_unique(array_merge(
                    $order_items->pluck('seller_id')->filter()->unique()->values()->toArray(),
                    $order && isset($order->seller_id) ? [$order->seller_id] : []
                ));
                $sellerNameMap = [];
                $storeNameMap = [];
                if (!empty($sellerIds)) {
                    foreach (Seller::whereIn('id', $sellerIds)->with('translations')->get(['id', 'name', 'store_name']) as $s) {
                        $nameByCode = [];
                        $storeByCode = [];
                        foreach ($s->getAllActiveLanguageTranslations() as $t) {
                            $code = $t['language_code'] ?? '';
                            if ($code !== '') {
                                $nameByCode[$code] = trim((string) ($t['name'] ?? ''));
                                $storeByCode[$code] = trim((string) ($t['store_name'] ?? ''));
                            }
                        }
                        $defaultName = $nameByCode[$defaultCode] ?? $s->getAttributeValue('name') ?? '';
                        $defaultStore = $storeByCode[$defaultCode] ?? $s->getAttributeValue('store_name') ?? '';
                        $nameObj = (object) [];
                        $storeObj = (object) [];
                        foreach ($activeLangCodes as $code) {
                            $nameObj->{$code} = ($nameByCode[$code] ?? '') !== '' ? $nameByCode[$code] : $defaultName;
                            $storeObj->{$code} = ($storeByCode[$code] ?? '') !== '' ? $storeByCode[$code] : $defaultStore;
                        }
                        $sellerNameMap[$s->id] = (array) $nameObj === [] ? (object) ['en' => $s->getAttributeValue('name') ?? ''] : $nameObj;
                        $storeNameMap[$s->id] = (array) $storeObj === [] ? (object) ['en' => $s->getAttributeValue('store_name') ?? ''] : $storeObj;
                    }
                }
                $deliveryBoyIds = $order && ($order->delivery_boy_id ?? 0) ? [$order->delivery_boy_id] : [];
                $deliveryBoyNameMap = [];
                if (!empty($deliveryBoyIds)) {
                    foreach (DeliveryBoy::whereIn('id', $deliveryBoyIds)->with('translations')->get(['id', 'name']) as $db) {
                        $nameByCode = [];
                        foreach ($db->getAllActiveLanguageTranslations() as $t) {
                            $code = $t['language_code'] ?? '';
                            if ($code !== '') {
                                $nameByCode[$code] = trim((string) ($t['name'] ?? ''));
                            }
                        }
                        $defaultName = $nameByCode[$defaultCode] ?? $db->getAttributeValue('name') ?? '';
                        $nameObj = (object) [];
                        foreach ($activeLangCodes as $code) {
                            $nameObj->{$code} = ($nameByCode[$code] ?? '') !== '' ? $nameByCode[$code] : $defaultName;
                        }
                        $deliveryBoyNameMap[$db->id] = (array) $nameObj === [] ? (object) ['en' => $db->getAttributeValue('name') ?? ''] : $nameObj;
                    }
                }
                $statusIds = array_unique(array_merge(
                    $order_items->pluck('active_status')->filter()->unique()->values()->toArray(),
                    $order && ($order->active_status ?? 0) ? [$order->active_status] : []
                ));
                $statusNameMap = [];
                $previousLocale = app()->getLocale();
                $previousLangCode = app()->has('lang_code') ? app('lang_code') : null;
                foreach ($statusIds as $sid) {
                    $sid = (int) $sid;
                    $key = OrderStatusList::getTranslationKey($sid);
                    $nameObj = (object) [];
                    if ($key !== '') {
                        foreach ($activeLangCodes as $code) {
                            app()->setLocale($code);
                            app()->instance('lang_code', $code);
                            $nameObj->{$code} = __($key);
                        }
                    }
                    $fallback = ($order && ($order->active_status ?? 0) == $sid) ? ($order->status_name ?? '') : ($order_items->firstWhere('active_status', $sid)->status_name ?? '');
                    $statusNameMap[$sid] = (array) $nameObj === [] ? (object) ['en' => $fallback] : $nameObj;
                }
                app()->setLocale($previousLocale);
                if ($previousLangCode !== null) {
                    app()->instance('lang_code', $previousLangCode);
                }
                foreach ($order_items as $item) {
                    $item->seller_name_translation = $sellerNameMap[$item->seller_id ?? 0] ?? (object) ['en' => $item->seller_name ?? ''];
                    $item->status_name_translation = $statusNameMap[$item->active_status ?? 0] ?? (object) ['en' => $item->status_name ?? ''];
                    $sid = (int) ($item->active_status ?? 0);
                    $item->order_status_name = OrderStatusList::getTranslatedName($sid) ?: ($item->status_name ?? '');
                }
                if ($order) {
                    $order->seller_name_translation = $sellerNameMap[$order->seller_id ?? 0] ?? (object) ['en' => $order->seller_name ?? ''];
                    $order->store_name_translation = $storeNameMap[$order->seller_id ?? 0] ?? (object) ['en' => $order->store_name ?? ''];
                    $order->delivery_boy_name_translation = $deliveryBoyNameMap[$order->delivery_boy_id ?? 0] ?? (object) ['en' => $order->delivery_boy_name ?? ''];
                    $order->status_name_translation = $statusNameMap[$order->active_status ?? 0] ?? (object) ['en' => $order->status_name ?? ''];
                    $order->order_status_name = OrderStatusList::getTranslatedName((int) ($order->active_status ?? 0)) ?: ($order->status_name ?? '');
                }
            }
        }

        // Add tax_amount to price and discounted_price for each order item
        foreach ($order_items as $item) {
            $tax_amount = (float) ($item->tax_amount ?? 0);
            $item->price = (float) self::doubleNumber($item->price + $tax_amount);
            $item->discounted_price = (float) self::doubleNumber(
                ($item->discounted_price != 0 ? $item->discounted_price + $tax_amount : 0)
            );
        }

        // Display order placed time using admin date/time format (store settings)
        if ($order && !empty($order->orders_created_at)) {
            $order->orders_created_at = self::formatDateTime($order->orders_created_at);
        }

        return array("order" => $order, "order_items" => $order_items);
    }

    public static function generateOrderInvoice($data)
    {
        $invoice = view('invoice', $data)->render();
        return $invoice;
    }

    public static function downloadOrderInvoice($order_id)
    {
        $data = CommonHelper::getOrderDetails($order_id, true);
        if (!$data["order"]) {
            return CommonHelper::responseError("Order Not found!");
        }
        $invoice = view('invoiceMpdf', $data)->render();

        $mpdf = new Mpdf();
        $stylesheet = file_get_contents(asset('assets/css/custom/bootstrap/bootstrap.min.css')); // external css
        $mpdf->WriteHTML($stylesheet, 1);
        $mpdf->WriteHTML($invoice);
        return $mpdf->Output("Invoice-No:#" . $order_id . '.pdf', Destination::INLINE);
    }

    public static function getFirebaseKeys()
    {
        $firebase_array = array(
            "firebase_apiKey" => "",
            "authDomain" => "",
            "databaseURL" => "",
            "projectId" => "",
            "storageBucket" => "",
            "messagingSenderId" => "",
            "appId" => "",
            "measurementId" => "",
            "jsonFile" => ""
        );
        $variables = array_keys($firebase_array);
        return Setting::whereIn('variable', $variables)->get();
    }

    public static function getMailSetting($user_type, $user_id)
    {
        return MailSetting::where(['user_type' => $user_type, 'user_id' => $user_id])->get();
    }

    public static function saveMailSetting($user_id, $user_type, $status_ids, $mail_statuses, $mobile_statuses, $sms_statuses)
    {

        foreach ($status_ids as $key => $status_id) {
            $setting = MailSetting::where(['user_type' => $user_type, 'user_id' => $user_id, 'order_status_id' => $status_id])->first() ?? new MailSetting();
            $setting->user_type = $user_type;
            $setting->user_id = $user_id;
            $setting->order_status_id = $status_id;
            $setting->mail_status = $mail_statuses[$key];
            $setting->mobile_status = $mobile_statuses[$key];
            $setting->sms_status = $sms_statuses[$key];
            $setting->save();
        }
    }
    public static function setDefaultMailSetting($user_id, $user_type)
    {
        $status_ids = OrderStatusList::get()->pluck('id')->toArray();
        $mail_statuses = array_fill(0, count($status_ids), 1);
        $mobile_statuses = $mail_statuses;
        $sms_statuses = array_fill(0, count($status_ids), 1);
        self::saveMailSetting($user_id, $user_type, $status_ids, $mail_statuses, $mobile_statuses, $sms_statuses);
    }

    public static function sendMail($to, $subject, $data)
    {

        $mailer = Setting::get_value('mailer') ?: 'smtp';
        $config = [
            'driver' => $mailer,
            'host' => Setting::get_value('smtp_host'),
            'username' => Setting::get_value('smtp_from_mail'),
            'password' => Setting::get_value('smtp_email_password'),
            'port' => Setting::get_value('smtp_port'),
            'encryption' => Setting::get_value('smtp_encryption_type'),
            'from'       => [
                'address' => Setting::get_value('smtp_from_mail'),
                'name'    => Setting::get_value('app_name'),
            ]
        ];

        Config::set('mail', $config);
        Mail::purge($mailer);

        $app_name = Setting::get_value('app_name');
        $mailData = array(
            'to' => $to,
            'subject' => $subject,
            'name' => $data['name'] ?? "",
            'app_name' => $app_name,
            'support_email' => Setting::get_value('smtp_from_mail'),
        );
        if (!is_array($data)) {
            $data = [];
        }

        $data['app_name'] = $app_name;

        Mail::send('mail', $data, function ($message) use ($mailData) {
            $message->to($mailData['to'], $mailData['name'])->subject($mailData['subject'])->from($mailData['support_email'], $mailData["app_name"]);
        });
    }
    public static function sendMailAdminStatus($adminType, $admin, $status, $email)
    {
        $app_name = Setting::get_value('app_name');
        $subject = "";
        $data = array();
        if ($adminType == "seller") {
            if (isset($status) && $status == Seller::$statusRegistered) {
                $status_name = Seller::$Registered;
                $subject = "Your Account is " . $status_name . " Successfully!";
            } else if (isset($status) && $status == Seller::$statusActive) {
                $status_name = Seller::$Active;
                $subject = "Your Account is activated";
            } else if (isset($status) && $status == Seller::$statusDeactivated) {
                $status_name = Seller::$Deactivated;
                $subject = "Your Account is " . $status_name . " by " . $app_name . " Administrator!";
            } else if (isset($status) && $status == Seller::$statusRejected) {
                $status_name = Seller::$Rejected;
                $subject = "Your Account is " . $status_name . " by " . $app_name . " Administrator!";
            }
            $data['seller'] = $admin;
            $data['type'] = "seller_status";
        } else {
            if (isset($status) && $status == DeliveryBoy::$statusRegistered) {
                $status_name = DeliveryBoy::$Registered;
                $subject = "Your Account is " . $status_name . " Successfully!";
            } else if (isset($status) && $status == DeliveryBoy::$statusActive) {
                $status_name = DeliveryBoy::$Active;
                $subject = "Your Account is activated";
            } else if (isset($status) && $status == DeliveryBoy::$statusDeactivated) {
                $status_name = DeliveryBoy::$Deactivated;
                $subject = "Your Account is " . $status_name . " by " . $app_name . " Administrator!";
            } else if (isset($status) && $status == DeliveryBoy::$statusRejected) {
                $status_name = DeliveryBoy::$Rejected;
                $subject = "Your Account is " . $status_name . " by " . $app_name . " Administrator!";
            }
            $admin['email'] = $email;
            $data['delivery_boy'] = $admin;
            $data['type'] = "delivery_boy_status";
        }

        $data['status_name'] = $status_name ?? "";
        $data['subject'] = $subject ?? "";
        $data['status'] = $status;

        self::sendMail($email, $subject, $data);
    }

    public static function sendReturnRequestNotification($returnRequest)
    {
        $app_name = Setting::get_value('app_name');
        $currency = Setting::get_value('currency') ?? '$';

        $status_name = ReturnStatusList::getStatusName($returnRequest->status);

        $placeholdersCustomer = [
            'return_request_id' => $returnRequest->id,
            'order_id'         => $returnRequest->order_id,
            'status_name'      => $status_name,
            'app_name'         => $app_name,
        ];
        $placeholdersSeller = [
            'return_request_id' => $returnRequest->id,
            'order_id'         => $returnRequest->order_id,
            'status_name'      => $status_name,
        ];

        // Send notification to customer (returnStatusId for language-wise status_name)
        if (isset($returnRequest->user_id) && $returnRequest->user_id != "") {
            $userTokens = UserToken::where('user_id', $returnRequest->user_id)->where('type', 'customer')->get();
            if ($userTokens->isNotEmpty()) {
                self::sendNotificationByTemplate($userTokens, 'return_request_customer', $placeholdersCustomer, '', 0, '', null, $returnRequest->status, 'return_request', $returnRequest->id, null, $returnRequest->order_id);
            }
        }

        // Send notification to seller
        $orderItem = OrderItem::find($returnRequest->order_item_id);
        if ($orderItem && isset($orderItem->seller_id) && $orderItem->seller_id != 0) {
            $seller = Seller::where('id', $orderItem->seller_id)->first();
            if ($seller && isset($seller->admin_id) && $seller->admin_id != 0) {
                $sellerTokens = AdminToken::where('user_id', $seller->admin_id)->where('type', 'Seller')->get();
                if ($sellerTokens->isNotEmpty()) {
                    self::sendNotificationByTemplate($sellerTokens, 'return_request_seller', $placeholdersSeller, '', 0, '', null, $returnRequest->status, 'return_request', $returnRequest->id, null, $returnRequest->order_id);
                }
            }
        }
        // Send notification to delivery boy when assigned or status changes
        if (isset($returnRequest->delivery_boy_id) && $returnRequest->delivery_boy_id != 0) {
            $deliveryBoy = DeliveryBoy::where('id', $returnRequest->delivery_boy_id)->first();
            if ($deliveryBoy && isset($deliveryBoy->admin_id) && $deliveryBoy->admin_id != 0) {
                $deliveryBoyTokens = AdminToken::where('user_id', $deliveryBoy->admin_id)->where('type', 'Delivery Boy')->get();
                if ($deliveryBoyTokens->isNotEmpty()) {
                    self::sendNotificationByTemplate($deliveryBoyTokens, 'return_request_delivery_boy', $placeholdersSeller, '', 0, '', null, $returnRequest->status, 'return_request', $returnRequest->id, null, $returnRequest->order_id);
                }
            }
        }

        self::sendReturnRequestSms($returnRequest);
        self::sendReturnRequestMail($returnRequest);
    }

    /**
     * Store panel notifications for seller and admins when a customer submits a return request.
     */
    public static function sendReturnRequestPanelNotifications($returnRequest)
    {
        $orderItem = OrderItem::find($returnRequest->order_item_id);
        if (!$orderItem) {
            return;
        }

        $admin_ids_to_notify = [];

        // Seller: get admin_id from order item's seller_id
        if (isset($orderItem->seller_id) && $orderItem->seller_id != 0 && $orderItem->seller_id != "") {
            $seller = Seller::where('id', $orderItem->seller_id)->first();
            if ($seller && isset($seller->admin_id) && $seller->admin_id != 0) {
                $admin_ids_to_notify[] = $seller->admin_id;
            }
        }

        // Super admins (role_id = 1)
        $super_admin_ids = Admin::where('role_id', 1)->pluck('id')->toArray();
        $admin_ids_to_notify = array_unique(array_merge($admin_ids_to_notify, $super_admin_ids));

        foreach ($admin_ids_to_notify as $admin_id) {
            try {
                $admin = Admin::find($admin_id);
                if ($admin) {
                    $admin->notify(new \App\Notifications\OrderNotification($orderItem->id, 'return_request_new'));
                }
            } catch (\Exception $e) {
                Log::error("Error sending return request panel notification to admin {$admin_id}: " . $e->getMessage());
            }
        }
    }

    public static function sendReturnRequestSms($returnRequest)
    {
        try {
            $app_name = Setting::get_value('app_name');
            $status_name = ReturnStatusList::getStatusName($returnRequest->status);

            $phone = User::where('id', $returnRequest->user_id)
                ->selectRaw("CONCAT(country_code, mobile) as phone")
                ->value('phone');

            if ($phone) {
                $phone = '+' . $phone;

                $message = self::getReturnRequestSmsMessage($returnRequest, $status_name);

                $success = TwilioHelper::sendSms($phone, $message);

                if ($success) {
                    Log::info("Return request SMS sent successfully for request #{$returnRequest->id}");
                } else {
                    Log::error("Failed to send return request SMS for request #{$returnRequest->id}");
                }
            }
        } catch (\Exception $e) {
            Log::error("Error sending return request SMS: " . $e->getMessage());
        }
    }

    public static function getReturnRequestSmsMessage($returnRequest, $status_name)
    {
        $app_name = Setting::get_value('app_name');
        $customer_name = User::where('id', $returnRequest->user_id)->value('name');
        $support_number = Setting::where('variable', 'support_number')->value('value');

        $message = "Dear {$customer_name}, your return request #{$returnRequest->id} for order #{$returnRequest->order_id} has been {$status_name}. ";

        switch ($returnRequest->status) {
            case ReturnStatusList::$rApproved:
                $message .= "Your return request is accepted and refund is credited to your wallet. Thank you for using {$app_name}.";
                break;
            case ReturnStatusList::$rRejected:
                $message .= "Please contact support at {$support_number} for more details.";
                break;
            case ReturnStatusList::$rDeliveryBoyAssigned:
                $message .= "A delivery boy has been assigned to collect your return. You will be contacted soon.";
                break;
            case ReturnStatusList::$rOutForPickup:
                $message .= "Our delivery boy is on the way to collect your return.";
                break;
            case ReturnStatusList::$rReceivedFromCustomer:
                $message .= "Your return has been received. Processing refund to your wallet.";
                break;
            case ReturnStatusList::$rCancelled:
                $message .= "Your return request has been cancelled.";
                break;
            default:
                $message .= "Thank you for using {$app_name}.";
                break;
        }

        return $message;
    }

    public static function sendReturnRequestMail($returnRequest)
    {
        try {
            $app_name = Setting::get_value('app_name');
            $status_name = ReturnStatusList::getStatusName($returnRequest->status);

            $customer = User::find($returnRequest->user_id);
            if (!$customer || !$customer->email) {
                Log::error("Customer email not found for return request #{$returnRequest->id}");
                return;
            }

            $subject = "Return Request #{$returnRequest->id} - {$status_name}";

            $data = [
                'customer' => $customer,
                'returnRequest' => $returnRequest,
                'status_name' => $status_name,
                'app_name' => $app_name,
                'type' => 'return_request_status',
                'name' => $customer->name
            ];

            self::sendMail($customer->email, $subject, $data);
        } catch (\Exception $e) {
            Log::error("Error sending return request mail: " . $e->getMessage());
        }
    }

    public static function sendLowStockNotification($productVariants)
    {
        try {

            $low_stock_limit = Setting::get_value('low_stock_limit') ?? 10;

            if (!$low_stock_limit || $low_stock_limit <= 0) {
                Log::channel('low_stock_mail')->info("Low stock limit not configured or disabled");
                return;
            }

            $lowStockProducts = [];
            $sellerNotifications = [];

            foreach ($productVariants as $variant) {

                if (!$variant) {
                    continue;
                }

                $product = Product::where('id', $variant->product_id)->first();

                if ($product && $product->is_unlimited_stock == 1) {
                    continue;
                }

                if ($variant->stock <= $low_stock_limit) {

                    $sellerId = $variant->seller_id
                        ?? optional(Product::find($variant->product_id))->seller_id;

                    if (empty($sellerId)) {
                        Log::channel('low_stock_mail')->warning(
                            "Low stock skipped: seller_id missing for variant ID {$variant->id}"
                        );
                        continue;
                    }

                    if (!isset($sellerNotifications[$sellerId])) {
                        $sellerNotifications[$sellerId] = [];
                    }

                    $sellerNotifications[$sellerId][] = [
                        'product_name'     => $product->name ?? 'N/A',
                        'variant_name'     => $variant->measurement . ' ' . ($variant->stock_unit_name ?? ''),
                        'current_stock'    => $variant->stock,
                        'low_stock_limit'  => $low_stock_limit,
                        'variant_id'       => $variant->id,
                    ];
                } else {
                    Log::info("Product variant stock is above limit - Stock: {$variant->stock}, Limit: {$low_stock_limit}");
                }
            }

            foreach ($sellerNotifications as $sellerId => $products) {

                try {

                    $seller = Seller::where('id', $sellerId)->first();
                    if (!$seller) {
                        Log::warning("Seller not found for ID: {$sellerId}");
                        continue;
                    }

                    $adminId = $seller->admin_id;

                    $sellerTokens = AdminToken::where('user_id', $adminId)
                        ->where('type', 'Seller')
                        ->get();

                    if (!$sellerTokens->isEmpty()) {
                        $productCount = count($products);
                        $templateType = $productCount === 1 ? 'low_stock_single_product' : 'low_stock_multiple_products';
                        $placeholders = $productCount === 1
                            ? [
                                'product_name'     => $products[0]['product_name'],
                                'current_stock'    => $products[0]['current_stock'],
                                'low_stock_limit'  => $products[0]['low_stock_limit'],
                            ]
                            : ['product_count' => $productCount];
                        // Single variant: id is product_variant id. Multiple products in one push: id is 0 — confirm desired id with your app team.
                        $lowStockPayloadId = $productCount === 1 ? ($products[0]['variant_id'] ?? 0) : 0;
                        self::sendNotificationByTemplate($sellerTokens, $templateType, $placeholders, '', 0, '', null, null, $productCount === 1 ? 'product_variant' : 'low_stock', $lowStockPayloadId);
                    } else {
                        Log::warning("No FCM tokens found for seller {$sellerId}");
                    }

                    if (
                        !empty($seller->email) &&
                        filter_var(trim($seller->email), FILTER_VALIDATE_EMAIL)
                    ) {

                        $subject = "Low Stock Alert";

                        $emailMessage = "Dear {$seller->name},\n\n";
                        $emailMessage .= "The following product(s) are running low on stock:\n\n";

                        foreach ($products as $item) {
                            $emailMessage .= "- {$item['product_name']} ({$item['variant_name']}) "
                                . "Current Stock: {$item['current_stock']} | Limit: {$item['low_stock_limit']}\n";
                        }

                        $emailMessage .= "\nPlease restock your inventory as soon as possible.\n\n";
                        $emailMessage .= "Regards,\n";
                        $emailMessage .= Setting::get_value('app_name');

                        // Reuse existing mail helper
                        foreach ($products as $product) {
                            Mail::to($seller->email)->send(
                                new LowStockMail($product, $seller)
                            );
                        }
                    } else {
                        Log::channel('low_stock_mail')->info(
                            "Low stock email skipped. Invalid or missing email for Seller ID {$sellerId}. Email: " . ($seller->email ?? 'NULL')
                        );
                    }
                } catch (\Exception $e) {
                    Log::channel('low_stock_mail')->info("Error sending low stock notification to seller {$sellerId}: " . $e->getMessage());
                }
            }
        } catch (\Exception $e) {
            Log::channel('low_stock_mail')->info("Error in sendLowStockNotification: " . $e->getMessage());
        }
    }

    public static function sendMailOrderStatus($order, $assign = false, $type = "")
    {
        if ($assign == true) {
            if (isset($order->delivery_boy_id) && $order->delivery_boy_id != 0 && $order->delivery_boy_id != "") {


                $deliveryBoy = DeliveryBoy::select("delivery_boys.*", "admins.email", "admins.role_id")->Join('admins', 'delivery_boys.admin_id', 'admins.id')->where('delivery_boys.id', $order->delivery_boy_id)->first();

                $subject = "You have just assigned new order, #" . $order->id;
                $redirect_url = (isset($order->id)) ? url('/seller/orders/view/' . $order->id) : url('/seller/orders');
                $data['redirect_url'] = $redirect_url;
                $data['subject'] = $subject;
                $data['deliveryBoy'] = $deliveryBoy;
                $data['assign'] = $assign;
                $data['order'] = $order;
                $data['type'] = "order_status";
                self::sendMail($deliveryBoy->email, $subject, $data);

                if ($type == 'order_item_status_update') {
                    $seller_id = $order->seller_id;
                } else {
                    $seller_id = $order->items[0]->seller_id;
                }
                if (isset($seller_id) && $seller_id != 0 && $seller_id != "") {
                    $seller = Seller::select("sellers.*", "admins.email", "admins.role_id")->Join('admins', 'sellers.admin_id', 'admins.id')->where('sellers.id', $seller_id)->first();

                    $subject = "Your order  #" . $order->id . " is assigned to a delivery boy";
                    $redirect_url = (isset($order->id)) ? url('/delivery_boy/orders/view/' . $order->id) : url('/delivery_boy/orders');
                    $data['redirect_url'] = $redirect_url;
                    $data['subject'] = $subject;
                    $data['seller'] = $seller;
                    self::sendMail($seller->email, $subject, $data);
                }
            }
        } else {
            // When type is order_item_status_update, $order is OrderItem - resolve parent Order for template
            $order_item = null;
            $mail_order = $order;
            if ($type == 'order_item_status_update' && isset($order->order_id)) {
                $order_item = $order;
                $mail_order = Order::with('items')->find($order->order_id);
                if (!$mail_order) {
                    return;
                }
                // Use item's status for template branching - so cancelled/returned item shows correct content
                $mail_order->active_status = $order_item->active_status;
            }

            $orderStatusList = OrderStatusList::where('id', $order->active_status)->first();
            $status_name = $orderStatusList->status;

            // Order ID for subjects: use order_id when it's order item
            $order_id = $order_item ? $order_item->order_id : $order->id;
            $item_subject = $order_item ? "Order item (" . ($order_item->product_name ?? '') . " - " . ($order_item->variant_name ?? '') . ") in Order #" . $order_id . " has been " . $status_name : null;

            if (isset($order->user_id) && $order->user_id != "") {
                if (self::checkOrderMailSendable($order->user_id, $order->active_status, 0)) {
                    $subject = $item_subject ?? "Your order  #" . $order_id . " has been " . $status_name;
                    $customer = User::where('id', $order->user_id)->first();
                    $data['status_name'] = $status_name;
                    $data['subject'] = $subject;
                    $data['user_type'] = 0;
                    $data['user'] = $customer;
                    $data['order'] = $mail_order;
                    $data['type'] = "order_status";
                    if ($order_item) {
                        $data['order_item'] = $order_item;
                    }
                    self::sendMail($customer->email, $subject, $data);
                }
            }

            if ($type == 'order_item_status_update') {
                $seller_id = $order->seller_id;
            } else {
                $seller_id = $order->items[0]->seller_id ?? null;
            }
            $sellerInfo = "";
            if (isset($seller_id) && $seller_id != 0 && $seller_id != "") {
                $seller = Seller::select("sellers.*", "admins.email", "admins.role_id")->Join('admins', 'sellers.admin_id', 'admins.id')
                    ->where('sellers.id', $seller_id)->first();
                $sellerInfo = $seller ? $seller->store_name . " (" . $seller->name . ")" : "";
                if ($seller && self::checkOrderMailSendable($seller->admin_id, $order->active_status, 1)) {

                    if ($order->active_status == OrderStatusList::$received) {
                        $subject = "You have " . $status_name . " new order  #" . $order_id;
                    } else {
                        $subject = $item_subject ?? "Order  #" . $order_id . " has been " . $status_name;
                    }

                    $data['status_name'] = $status_name;
                    $data['subject'] = $subject;
                    $data['user_type'] = 1;
                    $data['role'] = $seller->role_id;
                    $data['seller'] = $seller;
                    $data['order'] = $mail_order;
                    $data['type'] = "order_status";
                    if ($order_item) {
                        $data['order_item'] = $order_item;
                    }
                    self::sendMail($seller->email, $subject, $data);
                }
            }

            $delivery_boy_id = $order_item ? $mail_order->delivery_boy_id ?? 0 : $order->delivery_boy_id ?? 0;
            if (isset($delivery_boy_id) && $delivery_boy_id != 0 && $delivery_boy_id != "") {

                $deliveryBoy = DeliveryBoy::select("delivery_boys.*", "admins.email", "admins.role_id")->Join('admins', 'delivery_boys.admin_id', 'admins.id')
                    ->where('delivery_boys.id', $delivery_boy_id)->first();
                if ($deliveryBoy && self::checkOrderMailSendable($deliveryBoy->admin_id, $order->active_status, 1)) {
                    $subject = $item_subject ?? "Order  #" . $order_id . " has been " . $status_name;

                    $data['status_name'] = $status_name;
                    $data['subject'] = $subject;
                    $data['user_type'] = 1;
                    $data['role'] = $deliveryBoy->role_id;
                    $data['deliveryBoy'] = $deliveryBoy;
                    $data['order'] = $mail_order;
                    $data['type'] = "order_status";
                    if ($order_item) {
                        $data['order_item'] = $order_item;
                    }
                    self::sendMail($deliveryBoy->email, $subject, $data);
                }
            }

            $admins = Admin::whereIn('role_id', array(1, 2))->get();
            if (!empty($admins)) {
                foreach ($admins as $key => $admin) {
                    if (self::checkOrderMailSendable($admin->id, $order->active_status, 1)) {
                        if ($order->active_status == OrderStatusList::$received) {
                            $subject = "You have " . $status_name . " new order  #" . $order_id;
                        } else {
                            $subject = $item_subject ?? "Order  " . ($order->product_name ?? '') . " - " . ($order->variant_name ?? '') . " has been " . $status_name;
                            if ($sellerInfo != "" && !$item_subject) {
                                $subject .= " from " . $sellerInfo;
                            }
                        }
                        $data['status_name'] = $status_name;
                        $data['subject'] = $subject;
                        $data['user_type'] = 1;
                        $data['role'] = $admin->role_id;
                        $data['admin'] = $admin;
                        $data['order'] = $mail_order;
                        $data['type'] = "order_status";
                        if ($order_item) {
                            $data['order_item'] = $order_item;
                        }
                        self::sendMail($admin->email, $subject, $data);
                    }
                }
            }
        }
    }

    public static function checkOrderMailSendable($user_id, $status_id, $use_type, $type = "mail")
    {
        $mail_settings = MailSetting::where(['user_type' => $use_type, 'user_id' => $user_id, 'order_status_id' => $status_id])->first();
        if ($mail_settings) {
            if ($type == 'mail') {
                if ($mail_settings->mail_status == 1) {
                    return true;
                }
                return false;
            } else {
                if ($mail_settings->mobile_status == 1) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    public static function sendNotificationOrderStatus($order, $type = '')
    {
        $app_name = Setting::get_value('app_name');
        $currency = Setting::get_value('currency') ?? '$';

        // When this is an order-item status update (e.g. item cancelled), first param is OrderItem.
        // Resolve parent order so we have correct order_id, user_id, delivery_boy_id for notifications.
        $orderItem = null;
        if ($type == 'order_item_status_update' && isset($order->order_id)) {
            $orderItem = $order;
            $order = Order::find($order->order_id);
            if (!$order) {

                return;
            }
        }

        $status_id = $orderItem ? $orderItem->active_status : $order->active_status;
        $orderStatusList = OrderStatusList::where('id', $status_id)->first();
        $status_name = $orderStatusList ? $orderStatusList->status : '';
        $order_id = $order->id;

        // Notify customer (order_status_customer)
        $user_id = $order->user_id;
        if (isset($user_id) && $user_id != "") {
            if (self::checkOrderMailSendable($user_id, $status_id, 0, "Notification")) {
                $userTokens = UserToken::where('user_id', $user_id)->where('type', 'customer')->get();
                $placeholders = [
                    'order_id'     => $order_id,
                    'status_name'  => $status_name,
                    'created_at'   => $order->created_at,
                    'app_name'     => $app_name,
                    'currency'     => $currency,
                    'final_total'  => $order->final_total,
                ];
                self::sendNotificationByTemplate($userTokens, 'order_status_customer', $placeholders, '', 0, '', $status_id, null, 'order', $order_id);
            }
        }

        // Seller(s): for order-item update use that item's seller_id; for order update use all item sellers
        $seller_ids = [];
        if ($orderItem) {
            if (isset($orderItem->seller_id) && $orderItem->seller_id != 0 && $orderItem->seller_id != "") {
                $seller_ids[] = (int) $orderItem->seller_id;
            }
        } else {
            if (!isset($order->items) || $order->items === null) {
                $order->load('items');
            }
            if (isset($order->items) && $order->items->isNotEmpty()) {
                $seller_ids = $order->items->pluck('seller_id')->unique()->filter(function ($id) {
                    return $id !== null && $id != 0 && $id !== '';
                })->values()->toArray();
            }
            if (empty($seller_ids)) {
                $seller_ids = OrderItem::where('order_id', $order_id)
                    ->distinct()
                    ->pluck('seller_id')
                    ->filter(function ($id) {
                        return $id !== null && $id != 0 && $id !== '';
                    })
                    ->values()
                    ->toArray();
            }
        }

        foreach ($seller_ids as $seller_id) {
            try {
                $seller = Seller::select("sellers.*", "admins.email", "admins.role_id")
                    ->Join('admins', 'sellers.admin_id', 'admins.id')
                    ->where('sellers.id', $seller_id)
                    ->first();
                if (!$seller) {
                    Log::warning("Seller not found for ID: {$seller_id} in order #{$order_id}");
                    continue;
                }
                // if (!self::checkOrderMailSendable($seller->admin_id, $status_id, 1, "Notification")) {
                //     continue;
                // }

                // Seller order-status push: always send (do not use checkOrderMailSendable here so panel mail_settings are unchanged).
                $userTokens = AdminToken::where('user_id', $seller->admin_id)
                    ->where('type', 'Seller')
                    ->get();
                if ($userTokens->isEmpty()) {
                    Log::info("No FCM tokens found for seller {$seller_id} (admin_id: {$seller->admin_id})");
                    continue;
                }

                $templateType = ($status_id == OrderStatusList::$received) ? 'order_status_seller_new' : 'order_status_seller';
                $placeholders = ['order_id' => $order_id, 'status_name' => $status_name];
                $notification_type = ($status_id == OrderStatusList::$received) ? 'new_order' : '';
                self::sendNotificationByTemplate($userTokens, $templateType, $placeholders, $notification_type, 0, '', $status_id, null, 'order', $order_id);
            } catch (\Exception $e) {
                Log::error("Error sending notification to seller {$seller_id} for order #{$order_id}: " . $e->getMessage());
            }
        }

        // Notify delivery boy using order's delivery_boy_id (from orders table)
        if (isset($order->delivery_boy_id) && $order->delivery_boy_id != 0 && $order->delivery_boy_id != "") {
            $deliveryBoy = DeliveryBoy::select("delivery_boys.*", "admins.email", "admins.role_id")
                ->Join('admins', 'delivery_boys.admin_id', 'admins.id')
                ->where('delivery_boys.id', $order->delivery_boy_id)
                ->first();
            if ($deliveryBoy) {
                $userTokens = AdminToken::where('user_id', $deliveryBoy->admin_id)->where('type', 'Delivery Boy')->get();
                if ($userTokens->isNotEmpty()) {
                    $placeholders = ['order_id' => $order_id, 'status_name' => $status_name];
                    self::sendNotificationByTemplate($userTokens, 'order_status_delivery_boy', $placeholders, '', 0, '', $status_id, null, 'order', $order_id);
                }
            }
        }
    }

    public static function sendNotificationOrderAssignDeliveryBoy($order)
    {
        if (isset($order->delivery_boy_id) && $order->delivery_boy_id != 0 && $order->delivery_boy_id != "") {
            $deliveryBoy = DeliveryBoy::find($order->delivery_boy_id);
            if (!$deliveryBoy) {
                return;
            }
            $deliveryBoyUserId = $deliveryBoy->admin_id;
            if ($deliveryBoyUserId) {
                // Notify delivery boy: order assigned to him
                $deliveryBoyTokens = AdminToken::where('user_id', $deliveryBoyUserId)->where('type', 'Delivery Boy')->get();
                if ($deliveryBoyTokens->isNotEmpty()) {
                    $placeholders = ['order_id' => $order->id];
                    self::sendNotificationByTemplate($deliveryBoyTokens, 'assign_order_delivery_boy', $placeholders, 'assign_order', 0, '', null, null, 'order', $order->id);
                }
            }
            // Notify customer: order has been assigned to a delivery boy (with name and order id)
            if (!empty($order->user_id)) {
                $customerTokens = UserToken::where('user_id', $order->user_id)->where('type', 'customer')->get();
                if ($customerTokens->isNotEmpty()) {
                    $placeholdersCustomer = [
                        'order_id'          => $order->id,
                        'delivery_boy_name' => $deliveryBoy->name ?? 'Delivery Partner',
                    ];
                    self::sendNotificationByTemplate($customerTokens, 'assign_order_customer', $placeholdersCustomer, 'assign_order', 0, '', null, null, 'order', $order->id);
                }
            }
        }
    }

    public static function getPushObject($request, $image = "")
    {

        if ($request->hasFile('image') && $image != "") {
            $image_url = Storage::url($image);
            $image_url = asset($image_url);
            $push = new PushHelpers(
                $request->title,
                $request->message,
                $image_url,
                $request->type,
                $request->type_id,
                $request->type_link ?? ""
            );
        } else {
            $push = new PushHelpers(
                $request->title,
                $request->message,
                null,
                $request->type,
                $request->type_id,
                $request->type_link ?? ""
            );
        }

        //getting the push from push object
        $pushNotification = $push->getPush();

        return $pushNotification;
    }

    public static function sendNotification($userTokens, $title, $message, $type = '', $type_id = 0, $image = '', ?string $payloadType = null, $payloadId = null, $payloadSlug = null, $order_id = '')
    {
        $data = array();

        $logo = Setting::get_value('logo');
        if ($logo) {
            $logo = url('/storage') . "/" . $logo;
        } else {
            $logo = asset('images/favicon.png');
        }

        if ($payloadType !== null && $payloadType !== '') {
            $routingType = (string) $payloadType;
            $routingId = $payloadId !== null ? (string) $payloadId : '';
        } else {
            $routingType = (string) $type;
            $routingId = (string) ($type_id ?? '');
        }
        $soundType = in_array((string) $type, ['new_order', 'assign_order'], true) ? (string) $type : '';
        $useOrderSound = $soundType === 'new_order' || $soundType === 'assign_order';

        // FCM data payload requires ALL values to be strings
        $data = array();
        $data['data']['title'] = (string) $title;
        $data['data']['message'] = (string) $message;
        $data['data']['body'] = (string) $message;
        $data['data']['image'] = (string) $image;
        $data['data']['type'] = $routingType;
        $data['data']['id'] = $routingId;
        $data['data']['slug'] = $payloadSlug !== null ? (string) $payloadSlug : '';
        $data['data']['sound_type'] = $soundType;
        $data['data']['icon'] = (string) $logo;
        // All FCM data values must be strings
        if ($data['data']['type'] == 'category') {
            $category = Category::with('catActiveChilds')->find($slider->type_id ?? 0);
            if ($category) {
                $data['data']['type_slug'] = (string) ($category->slug ?? '');
                $data['data']['type_name'] = (string) ($category->name ?? '');
                $data['data']['has_child'] = (string) ($category->has_child ?? '0');
                $data['data']['has_active_child'] = (string) ($category->has_active_child ?? '0');
            } else {
                $data['data']['type_slug'] = "";
                $data['data']['type_name'] = "";
                $data['data']['has_child'] = "0";
                $data['data']['has_active_child'] = "0";
            }
        }
        if ($data['data']['type'] == 'product') {
            $data['data']['type_slug'] = (string) (Product::where('id', $slider->type_id ?? 0)->value('slug') ?? "");
        }
        // FCM data payload requires ALL values to be strings
        $fcmMsg = [
            'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
            'title' =>  (string) $title,
            'message' =>  (string) $message,
            'body' => (string) $message,
            'type' =>  $routingType,
            'id' => $routingId,
            'sound_type' => $soundType,
            'icon' => (string) $logo,
            'sound' => $useOrderSound ? 'order_sound.wav' : 'default',
            'type_slug' => $payloadSlug,
        ];

        if ($routingType == 'return_request' && $order_id != '') {
            $fcmMsg['order_id'] = (string) $order_id;
        }

        $notification = [
            'title' => $title,
            'body' =>  $message,
            // 'mutable_content' => true,
            //'sound' =>  $type == "new_order" || $type == "assign_order" ?  "order_sound.aiff" : "default"
        ];

        if (isset($userTokens) && count($userTokens) > 0) {
            $userTokens = array_unique($userTokens);

            foreach ($userTokens as $platform => $deviceToken) {
                try {

                    $result = FirebaseHelper::send($platform, $deviceToken, $fcmMsg, $notification);
                } catch (\Exception $e) {
                    Log::error("Error sending notification to device token: $deviceToken - " . $e->getMessage());
                }
            }
        } else {
            Log::warning('[sendNotification] No tokens to send to');
        }
        Log::info('[sendNotification] END');
    }

    public static function getDefaultLanguageId(): int
    {
        $id = (int) Language::where('system_type', 4)->where('is_default', 1)->value('id');
        return $id ?: 1;
    }

    /**
     * Get title and message for a notification template type and language.
     * Uses notification_template_translations; fallback to default language then to base notification_templates.
     */
    public static function getNotificationTemplateContent(string $type, int $languageId): array
    {

        $template = NotificationTemplate::where('type', $type)->first();
        if (!$template) {
            return ['title' => '', 'message' => ''];
        }

        // Try to get translation for requested language
        $trans = NotificationTemplateTranslation::where('notification_template_id', $template->id)
            ->where('language_id', $languageId)
            ->first();
        if ($trans) {
            return ['title' => $trans->title ?? '', 'message' => $trans->message ?? ''];
        }

        // Fallback to default language
        $defaultLangId = self::getDefaultLanguageId();
        if ($defaultLangId !== $languageId) {
            $trans = NotificationTemplateTranslation::where('notification_template_id', $template->id)
                ->where('language_id', $defaultLangId)
                ->first();
            if ($trans) {
                Log::info('[getNotificationTemplateContent] Translation found for default language_id=' . $defaultLangId);
                return ['title' => $trans->title ?? '', 'message' => $trans->message ?? ''];
            }
        }

        // Fallback to base template
        return ['title' => $template->title ?? '', 'message' => $template->message ?? ''];
    }

    public static function replacePlaceholders(string $str, array $placeholders): string
    {
        foreach ($placeholders as $key => $value) {
            $str = str_replace('{{' . $key . '}}', (string) $value, $str);
        }
        return $str;
    }

    /**
     * Send FCM to a collection of tokens (UserToken or AdminToken) by language.
     * Groups tokens by language_id (null => current default language), resolves template per language, sends to every token.
     * Sends to all devices for each user/admin, not just one per platform.
     * When $orderStatusId or $returnStatusId is set, status_name placeholder is translated per language.
     */
    public static function sendNotificationByTemplate($tokens, string $templateType, array $placeholders, string $type = '', $type_id = 0, string $image = '', ?int $orderStatusId = null, ?int $returnStatusId = null, ?string $payloadType = null, $payloadId = null, $payloadSlug = null, $order_id = '')
    {
        if ($tokens->isEmpty()) {
            return;
        }

        $defaultLangId = self::getDefaultLanguageId();
        $languageService = app(LanguageService::class);

        // Null language_id: use current default so notification is always in a valid language
        $grouped = $tokens->groupBy(function ($t) use ($defaultLangId) {
            return $t->language_id ?? $defaultLangId;
        });

        foreach ($grouped as $langId => $langTokens) {
            $langPlaceholders = $placeholders;

            // Translate status_name per language when order/return status ID is provided
            if (isset($langPlaceholders['status_name']) && ($orderStatusId !== null || $returnStatusId !== null)) {
                $langCode = $languageService->getLanguageCode((int) $langId);
                if ($langCode) {
                    $previousLocale = App::getLocale();
                    App::setLocale($langCode);
                    if ($orderStatusId !== null) {
                        $langPlaceholders['status_name'] = OrderStatusList::getTranslatedName($orderStatusId);
                    } else {
                        $langPlaceholders['status_name'] = ReturnStatusList::getTranslatedName($returnStatusId);
                    }
                    App::setLocale($previousLocale);
                }
            }

            $content = self::getNotificationTemplateContent($templateType, (int) $langId);
            $title = self::replacePlaceholders($content['title'], $langPlaceholders);
            $message = self::replacePlaceholders($content['message'], $langPlaceholders);

            // Send to every token (all devices), not one per platform
            foreach ($langTokens as $t) {
                $arr = [$t->platform => $t->fcm_token];
                self::sendNotification($arr, $title, $message, $type, $type_id, $image, $payloadType, $payloadId, $payloadSlug, $order_id);
            }
        }
    }

    public static function sendOrderNotificationsToAdmins($order, $notification_type = 'new_order', $delivery_boy_id = null)
    {
        try {
            // Refresh order from database to ensure we have latest data, especially for order status updates
            $order = Order::with('items')->where('id', $order->id)->first();

            if (!$order) {
                Log::warning("Order not found in sendOrderNotificationsToAdmins", ['order_id' => $order->id ?? 'N/A']);
                return;
            }

            $admin_ids_to_notify = [];

            // 1. Always notify super admins (role_id = 1)
            $super_admin_ids = Admin::where('role_id', 1)
                ->pluck('id')
                ->toArray();
            $admin_ids_to_notify = array_merge($admin_ids_to_notify, $super_admin_ids);

            // 2. Notify sellers (role_id = 3) whose items are in this order
            $seller_ids = [];
            if (isset($order->items) && !empty($order->items)) {
                $seller_ids = $order->items
                    ->pluck('seller_id')
                    ->unique()
                    ->filter(function ($id) {
                        return isset($id) && $id != 0 && $id != "";
                    })
                    ->values()
                    ->toArray();
            }

            if (!empty($seller_ids)) {
                $seller_admin_ids = Seller::whereIn('id', $seller_ids)
                    ->pluck('admin_id')
                    ->filter(function ($id) {
                        return isset($id) && $id != 0;
                    })
                    ->unique()
                    ->values()
                    ->toArray();

                // Only include sellers (role_id = 3)
                $seller_admin_ids = Admin::whereIn('id', $seller_admin_ids)
                    ->where('role_id', 3)
                    ->pluck('id')
                    ->toArray();

                $admin_ids_to_notify = array_merge($admin_ids_to_notify, $seller_admin_ids);
            }

            // 3. Notify delivery boy (role_id = 4) if delivery_boy_id is provided or if order has one assigned
            $delivery_boy_id_to_use = $delivery_boy_id ?? ($order->delivery_boy_id ?? null);
            if ($delivery_boy_id_to_use && $delivery_boy_id_to_use != 0) {
                $delivery_boy = DeliveryBoy::where('id', $delivery_boy_id_to_use)->first();
                if ($delivery_boy && $delivery_boy->admin_id) {
                    $delivery_boy_admin = Admin::where('id', $delivery_boy->admin_id)
                        ->where('role_id', 4)
                        ->first();
                    if ($delivery_boy_admin) {
                        $admin_ids_to_notify[] = $delivery_boy_admin->id;
                    }
                }
            }

            // Remove duplicates and send notifications
            $admin_ids_to_notify = array_unique($admin_ids_to_notify);

            if (!empty($admin_ids_to_notify)) {
                $admins = Admin::whereIn('id', $admin_ids_to_notify)->get();

                foreach ($admins as $admin) {
                    try {
                        $admin->notify(new OrderNotification($order->id, $notification_type));
                    } catch (\Exception $e) {
                        Log::error("Error sending notification to admin {$admin->id} for order #{$order->id}: " . $e->getMessage());
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("Error in sendOrderNotificationsToAdmins for order #{$order->id}: " . $e->getMessage());
        }
    }

    public static function addFundTransfers($delivery_boy_id, $amount, $type, $message = "")
    {

        $deliveryBoy = DeliveryBoy::find($delivery_boy_id);

        $closing_balance = 0;

        if ($type == FundTransfer::$typeDebit) {
            $closing_balance = ($deliveryBoy->balance - $amount);
        } else if ($type == FundTransfer::$typeCredit) {
            $closing_balance = ($deliveryBoy->balance + $amount);
        }

        if ($closing_balance != 0) {

            DB::beginTransaction();
            try {
                $fundTransfer = new FundTransfer();
                $fundTransfer->delivery_boy_id     = $delivery_boy_id;
                $fundTransfer->type     = $type;
                $fundTransfer->opening_balance     = $deliveryBoy->balance;
                $fundTransfer->closing_balance     = $closing_balance;
                $fundTransfer->amount   = $amount;
                $fundTransfer->status   = 1;
                $fundTransfer->message  = $message;
                $fundTransfer->save();

                $deliveryBoy->balance = $closing_balance;
                $deliveryBoy->save();

                DB::commit();
            } catch (\Exception $e) {
                Log::info("Error : " . $e->getMessage());
                DB::rollBack();
                // throw $e;
                return CommonHelper::responseError("Something Went Wrong!");
            }
        }
    }

    public static function updateOrderPromoCode($order_id, $order_promo_discount)
    {
        $order = Order::where("id", $order_id)->first();
        $order->promo_code = "";
        $order->promo_discount = 0;
        $order->final_total += $order_promo_discount;
        $order->remaining_final += $order_promo_discount;

        $order->save();
    }
    public static function getFssaiLicImg()
    {
        $fssai_lic_img_empty = '';
        try {
            $fssai_lic_img =  Setting::where('variable', 'fssai_lic_img')->first()->value;

            if ($fssai_lic_img != '') {
                return self::getImage($fssai_lic_img);
            } else {
                return $fssai_lic_img_empty;
            }
        } catch (\Exception $e) {
            return $fssai_lic_img_empty;
        }
    }

    public static function validateFSSAINumber($fssaiNumber)
    {
        $pattern = '/^[0-9]{14}$/';
        // Check if the FSSAI number matches the pattern
        if (preg_match($pattern, $fssaiNumber)) {
        } else {
            return Response::json(array('status' => 0, 'message' => 'please enter Valid FSSAI NO.'));
        }
    }

    public static function getIsCategorySectionInHomepage()
    {
        $is_category_section_in_homepage_empty = 0;
        try {
            $is_category_section_in_homepage =  (int)Setting::where('variable', 'is_category_section_in_homepage')->first()->value;

            if ($is_category_section_in_homepage != '') {
                return $is_category_section_in_homepage;
            } else {
                return $is_category_section_in_homepage_empty;
            }
        } catch (\Exception $e) {
            return $is_category_section_in_homepage_empty;
        }
    }

    public static function getCountCategorySectionInHomepage()
    {
        $count_category_section_in_homepage_empty = 9;
        try {
            $count_category_section_in_homepage =  (int)Setting::where('variable', 'count_category_section_in_homepage')->first()->value;

            if ($count_category_section_in_homepage != '') {
                return $count_category_section_in_homepage;
            } else {
                return $count_category_section_in_homepage_empty;
            }
        } catch (\Exception $e) {
            return $count_category_section_in_homepage_empty;
        }
    }

    public static function getIsBrandSectionInHomepage()
    {
        $is_brand_section_in_homepage_empty = 0;
        try {
            $is_brand_section_in_homepage =  (int)Setting::where('variable', 'is_brand_section_in_homepage')->first()->value;

            if ($is_brand_section_in_homepage != '') {
                return $is_brand_section_in_homepage;
            } else {
                return $is_brand_section_in_homepage_empty;
            }
        } catch (\Exception $e) {
            return $is_brand_section_in_homepage_empty;
        }
    }

    public static function getCountBrandSectionInHomepage()
    {
        $count_brand_section_in_homepage_empty = 9;
        try {
            $count_brand_section_in_homepage =  (int)Setting::where('variable', 'count_brand_section_in_homepage')->first()->value;

            if ($count_brand_section_in_homepage != '') {
                return $count_brand_section_in_homepage;
            } else {
                return $count_brand_section_in_homepage_empty;
            }
        } catch (\Exception $e) {
            return $count_brand_section_in_homepage_empty;
        }
    }

    public static function getIsSellerSectionInHomepage()
    {
        $is_seller_section_in_homepage_empty = 0;
        $count_seller_section_in_homepage = 9;
        try {
            $is_seller_section_in_homepage =  (int)Setting::where('variable', 'is_seller_section_in_homepage')->first()->value;
            $count_seller_section_in_homepage =  (int)Setting::where('variable', 'count_seller_section_in_homepage')->first()->value;
            if ($is_seller_section_in_homepage != '') {
                $data['is_seller_section_in_homepage'] = $is_seller_section_in_homepage;
                $data['count_seller_section_in_homepage'] = $count_seller_section_in_homepage;
                return $data;
            } else {
                $data['is_seller_section_in_homepage'] = $is_seller_section_in_homepage_empty;
                $data['count_seller_section_in_homepage'] = $is_seller_section_in_homepage_empty;
                return $data;
            }
        } catch (\Exception $e) {
            $data['is_seller_section_in_homepage'] = $is_seller_section_in_homepage_empty;
            $data['count_seller_section_in_homepage'] = $is_seller_section_in_homepage_empty;
            return $data;
        }
    }

    public static function getIsCountrySectionInHomepage()
    {
        $is_country_section_in_homepage_empty = 0;
        $count_country_section_in_homepage = 9;
        try {
            $is_country_section_in_homepage =  (int)Setting::where('variable', 'is_country_section_in_homepage')->first()->value;
            $count_country_section_in_homepage =  (int)Setting::where('variable', 'count_country_section_in_homepage')->first()->value;
            if ($is_country_section_in_homepage != '') {
                $data['is_country_section_in_homepage'] = $is_country_section_in_homepage;
                $data['count_country_section_in_homepage'] = $count_country_section_in_homepage;
                return $data;
            } else {
                $data['is_country_section_in_homepage'] = $is_country_section_in_homepage_empty;
                $data['count_country_section_in_homepage'] = $is_country_section_in_homepage_empty;
                return $data;
            }
        } catch (\Exception $e) {
            $data['is_country_section_in_homepage'] = $is_country_section_in_homepage_empty;
            $data['count_country_section_in_homepage'] = $is_country_section_in_homepage_empty;
            return $data;
        }
    }

    public static function updateSellerWalletBalance($new_balance, $id)
    {
        $seller = Seller::where("id", $id)->first();
        if ($seller) {
            $seller->balance = $new_balance;
            $seller->save();
        }
    }

    public static function getSellerWalletBalance($id)
    {
        $seller = Seller::find($id);
        $balance = 0;
        if ($seller) {
            $balance = $seller->balance;
        }
        return $balance;
    }

    public static function getSellerCommission($id)
    {
        $seller = Seller::find($id);
        $balance = 0;
        if ($seller) {
            $balance = $seller->balance;
        }
        return $balance;
    }
    public static function addSellerWalletTransaction($order_id, $order_item_id, $seller_id, $type, $wallet_balance, $message, $status = 1)
    {

        $validator = Validator::make(['order_item_id' => $order_item_id], [
            'order_item_id' => [
                'required',
                Rule::unique('seller_wallet_transactions', 'order_item_id'),
            ],
        ]);

        if ($validator->fails()) {
        } else {
            // Validation passed, create and save the new SellerWalletTransaction
            $transaction = new SellerWalletTransaction();
            $transaction->order_id = $order_id;
            $transaction->order_item_id = $order_item_id;
            $transaction->seller_id = $seller_id;
            $transaction->type = $type;
            $transaction->amount = $wallet_balance;
            $transaction->message = $message;
            $transaction->status = $status;
            $transaction->save();
        }
    }

    public static function addAdminCommissionTransaction($order_id, $order_item_id, $seller_id, $commission_percentage, $commission_amount, $order_item_amount, $status = 1)
    {
        $validator = Validator::make(['order_item_id' => $order_item_id], [
            'order_item_id' => [
                'required',
                Rule::unique('admin_commission_transactions', 'order_item_id'),
            ],
        ]);

        if (!$validator->fails()) {
            $transaction = new AdminCommissionTransaction();
            $transaction->order_id = $order_id;
            $transaction->order_item_id = $order_item_id;
            $transaction->seller_id = $seller_id;
            $transaction->seller_commission_percentage = $commission_percentage;
            $transaction->amount = $commission_amount;
            $transaction->order_item_amount = $order_item_amount;
            $transaction->message = 'admin_commission_order_item';
            $transaction->status = $status;
            $transaction->save();
        }
    }

    public static function uploadRatingImages($images, $product_rating_id)
    {
        foreach ($images as $file) {
            $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
            $image = Storage::disk('public')->putFileAs('product_ratings', $file, $fileName);
            $RatingImages = new RatingImages();
            $RatingImages->product_rating_id = $product_rating_id;
            $RatingImages->image = $image;
            $RatingImages->save();
        }
    }

    public static function productAverageRating($product_id)
    {
        // Sarthi: product_id now refers to master_products.id; count straight off product_ratings
        // without joining Product so it works regardless of catalog backing table.
        $ratings = ProductRating::where('product_id', $product_id)->get(['rate']);
        $total = $ratings->count();

        $data = [];
        $data['rating_count'] = $total;
        $data['average_rating'] = $total ? (float) $ratings->avg('rate') : 0;
        for ($i = 1; $i <= 5; $i++) {
            $data[['', 'one', 'two', 'three', 'four', 'five'][$i] . '_star_rating']
                = $ratings->where('rate', $i)->count();
        }
        return $data;
    }

    public static function productRatingOfUser($product_id, $user_id)
    {
        $product_ratings = ProductRating::with('user', 'images')->where('product_id', $product_id)->where('user_id', $user_id)->get();
        return $product_ratings;
    }

    public static function getCategoryChildIds($categories)
    {
        $ids = [];

        foreach ($categories as $category) {
            $ids[] = $category['id'];
            if (!empty($category['cat_active_childs'])) {
                $ids = array_merge($ids, self::getCategoryChildIds($category['cat_active_childs']));
            }
        }

        return $ids;
    }

    public static function getGuestCartCount($variant_id, $quantity)
    {

        $total['cart_items_count'] = count($variant_id);
        $total['cart_total_qty '] = count($quantity);

        $totalAmt = CommonHelper::calculateTotalAmount($variant_id, $quantity);

        $total['save_price'] = $totalAmt['save_price'];
        $total['total_amount'] = $totalAmt['total_amount'];

        $total['product_variant_id'] = implode(',', $variant_id);
        $total['quantity'] = implode(',', $quantity);

        return $total;
    }
    public static function sendOrderItemStatusMailNotification($order_item, $type)
    {
        try {
            dispatch(new SendEmailJob($order_item, $type))->afterResponse();
        } catch (\Exception $e) {
            Log::error("Order Status order Send mail error :", [$e->getMessage()]);
        }
        try {
            dispatch(function () use ($order_item) {
                CommonHelper::sendNotificationOrderStatus($order_item, 'order_item_status_update');
                $admins = Admin::get();
                foreach ($admins as $admin) {
                    $admin->notify(new OrderNotification($order_item->id, 'order_item_status_update'));
                }
            })->afterResponse();
        } catch (\Exception $e) {
            Log::error("Order Status orderNotification error :", [$e->getMessage()]);
        }
    }
    public static function SendCartNotification()
    {
        $cart_notification = Setting::where('variable', 'cart_notification')->first();

        if ($cart_notification->value == 1) {
            $notification_delay_after_cart_addition = Setting::where('variable', 'notification_delay_after_cart_addition')->first();
            $notification_interval = Setting::where('variable', 'notification_interval')->first();
            $notification_stop_time = Setting::where('variable', 'notification_stop_time')->first();

            // Fetch cart items with their related variants where 'save_for_later' is 0
            $cartItems = Cart::with('variants')->where('save_for_later', 0)->orderBy('created_at', 'desc')->get();

            // Group by user, then keep only the latest item from each 10-minute window
            $groupedByUser = $cartItems->groupBy('user_id');
            $filteredItems = collect();

            foreach ($groupedByUser as $userId => $userItems) {
                $processed = [];
                foreach ($userItems as $item) {
                    $dominated = false;
                    foreach ($processed as $kept) {
                        // If this item was added within 10 minutes of an already-kept (newer) item, skip it
                        if (abs(Carbon::parse($item->created_at)->diffInMinutes(Carbon::parse($kept->created_at))) <= 10) {
                            $dominated = true;
                            break;
                        }
                    }
                    if (!$dominated) {
                        $processed[] = $item;
                    }
                }
                foreach ($processed as $p) {
                    $filteredItems->push($p);
                }
            }

            foreach ($filteredItems as $item) {
                $cartNotifications = CartNotification::where('cart_id', $item->id)->orderBy('id', 'desc')->first();

                if ($cartNotifications) {
                    if (Carbon::now()->format('Y-m-d H:i') == Carbon::parse($item->created_at)->addMinutes($notification_stop_time->value)->format('Y-m-d H:i')) {
                        $cartNotifications->delete();
                    } elseif (Carbon::now()->format('Y-m-d H:i') == Carbon::parse($cartNotifications->sent_at)->addMinutes($notification_interval->value)->format('Y-m-d H:i')) {
                        $userTokens = UserToken::where('user_id', $item->user_id)->where('type', 'customer')->get();
                        if ($userTokens->isNotEmpty()) {
                            $placeholders = ['product_name' => $item->products->name ?? '', 'measurement' => $item->variants->measurement ?? ''];
                            self::sendNotificationByTemplate($userTokens, 'cart_reminder_interval', $placeholders, '', 0, '', null, null, 'cart', null);
                        }
                        CartNotification::create([
                            'user_id' => $item->user_id,
                            'cart_id' => $item->id,
                            'title' => 'Title for product ' . ($item->products->name ?? ''),
                            'message' => 'Message based on some condition for ' . ($item->variants->measurement ?? ''),
                            'sent_at' => Carbon::now(),
                        ]);
                    }
                } else {
                    $twoMinutesLater = Carbon::parse($item->created_at)->addMinutes($notification_delay_after_cart_addition->value);

                    if (Carbon::now()->format('Y-m-d H:i') == $twoMinutesLater->format('Y-m-d H:i')) {
                        Log::info('Next schedule:');
                        $userTokens = UserToken::where('user_id', $item->user_id)->where('type', 'customer')->get();
                        if ($userTokens->isNotEmpty()) {
                            $placeholders = ['product_name' => $item->products->name ?? ''];
                            self::sendNotificationByTemplate($userTokens, 'cart_reminder_first', $placeholders, '', 0, '', null, null, 'cart', null);
                        }
                        CartNotification::create([
                            'user_id' => $item->user_id,
                            'cart_id' => $item->id,
                            'title' => 'Hi, your cart with ' . ($item->products->name ?? '') . ' is waiting for you!',
                            'message' => "Don't forget to complete your purchase and place your order today!",
                            'sent_at' => Carbon::now(),
                        ]);
                    }
                }
            }
        }
    }
    public static function sendSmsOrderStatus($order, $order_item_status)
    {
        try {

            $isenable_orderitemstatus = $order_item_status;
            if ($isenable_orderitemstatus != null) {
                if ($order_item_status == 9 || $order_item_status == 10) {  // If return request is approved or rejected
                    $isenable_orderitemstatus = OrderStatusList::$returned;  // Assign the returned status
                }

                $smsStatus = self::isSmsStatus($isenable_orderitemstatus);  // Set SMS status based on order item status
            } else {
                $smsStatus = self::isSmsStatus($isenable_orderitemstatus);  // Handle null case
            }

            // Step 2: If SMS is enabled, proceed to send the SMS
            if ($smsStatus) {

                // Prepare the SMS content
                $message = self::getSmsTemplateMessage($order, $order_item_status);
                $phone =  User::where('id', $order->user_id)->selectRaw("CONCAT(country_code, mobile) as phone")->value('phone');

                if ($phone) {
                    $success = TwilioHelper::sendSms($phone, $message);
                } else {
                    Log::warning("SMS not sent for order #{$order->id}: User phone number is missing.");
                }
            } else {
                Log::info("SMS not sent for order #{$order->id}: SMS status is disabled.");
            }
        } catch (\Exception $e) {
            // Log the error for debugging purposes
            Log::error("Error sending SMS for order #{$order->id}: " . $e->getMessage());
        }
    }
    public static function isSmsStatus($active_status)
    {
        $smsStatus = MailSetting::where('order_status_id', $active_status)->where('user_type', 1)->where('user_id', 1)->value('sms_status');
        return  $smsStatus;
    }
    public static function getSmsTemplateMessage($order, $status)
    {
        $customer_name = User::where('id', $order->user_id)->value('name');
        $product_name = $order->product_name ?? '';
        $supportNumber = Setting::where('variable', 'support_number')->value('value');
        $appName = Setting::where('variable', 'app_name')->value('value');
        $reason = '';
        // Determine the message type based on the order's active status
        $messageType = '';
        switch ($status) {
            case 1:
                $messageType = 'customer_order_payment_pending';
                break;
            case 2:
                $messageType = 'customer_order_received';
                break;
            case 3:
                $messageType = 'customer_order_processed';
                break;
            case 4:
                $messageType = 'customer_order_shipped';
                break;
            case 5:
                $messageType = 'customer_order_out_for_delivery';
                break;
            case 6:
                $messageType = 'customer_order_delivered';
                break;
            case 7:
                $messageType = 'customer_order_cancelled';
                break;
            case 8:
                $messageType = 'customer_order_return_request';
                break;
            case 9:
                $messageType = 'customer_order_confirm_return_request';
                break;
            case 10:
                $messageType = 'customer_order_reject_return_request';
                $product_name = OrderItem::where('id', $order->order_item_id)->first()->product_name;
                $reason = $order->reason;
                break;

            default:
                // Handle other statuses or use a default message type
                $messageType = 'default_message';
                break;
        }

        // Retrieve the message template from the sms_template table
        $messageTemplate = SmsTemplate::where('type', $messageType)->value('message');
        if ($messageTemplate) {

            $message = str_replace(['[Customer Name]', '[Product Name]', '[Order ID]', '[Support Contact]', '[Store Name]', '[Reason]'], [$customer_name, $product_name, $order->id, $supportNumber, $appName, $reason], $messageTemplate);
        } else {
            // Fallback message if no template is found
            $message = "Your order #{$order->id} has been updated to status: {$order->status->name}";
        }

        return $message;
    }

    public static function getChildCategoryIds($categoryIds)
    {
        $childIds = Category::whereIn('parent_id', $categoryIds)
            ->pluck('id')
            ->toArray();

        if (!empty($childIds)) {
            return array_merge($childIds, self::getChildCategoryIds($childIds));
        }

        return [];
    }

    public static function AdditionalChargesArray($order)
    {
        if (isset($order->additional_charges)) {
            if (is_string($order->additional_charges)) {
                $decoded = json_decode($order->additional_charges, true);
                $order->additional_charges = (is_array($decoded)) ? $decoded : [];
            } elseif (!is_array($order->additional_charges)) {
                $order->additional_charges = [];
            }
        } else {
            $order->additional_charges = [];
        }
    }

    public static function logCurlRequest()
    {
        $request = request();

        $method  = strtoupper($request->method());
        $url     = $request->fullUrl();
        $headers = [];

        foreach ($request->headers->all() as $key => $values) {
            foreach ($values as $value) {
                $headers[] = "-H '" . $key . ": " . $value . "'";
            }
        }

        $data = '';

        if (in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            // Multipart (e.g., file upload)
            $parts = [];
            foreach ($request->all() as $key => $value) {
                if (is_array($value)) {
                    foreach ($value as $k => $v) {
                        $parts[] = "-F '{$key}[{$k}]={$v}'";
                    }
                } else {
                    $parts[] = "-F '{$key}={$value}'";
                }
            }

            // Handle uploaded files
            foreach ($request->files->all() as $key => $file) {
                if (is_array($file)) {
                    foreach ($file as $f) {
                        $parts[] = "-F '{$key}=@{$f->getRealPath()};filename={$f->getClientOriginalName()}'";
                    }
                } else {
                    $parts[] = "-F '{$key}=@{$file->getRealPath()};filename={$file->getClientOriginalName()}'";
                }
            }

            $data = " " . implode(" \\\n  ", $parts);
        }

        $curl = "curl -X {$method} '" . $url . "' \\\n  " . implode(" \\\n  ", $headers) . $data;

        Log::error("CURL Request:\n" . $curl);
    }

    // transallte in multipal language in one request
    public static function translate(array $text): array
    {

        if (empty($text)) {
            return [];
        }

        // Get Gemini API Key
        $apiKey = Setting::get_value('text_gen_key');
        if (empty($apiKey)) {
            return [];
        }

        try {
            $languages = DB::table('languages as l')
                ->join('supported_languages as sl', 'sl.id', '=', 'l.supported_language_id')
                ->where('l.status', 1)
                ->where('l.system_type', 4)
                ->whereNotNull('sl.code')
                ->get([
                    'sl.code',
                    'sl.name'
                ]);
        } catch (\Exception $e) {
            Log::error('Language fetch failed', [
                'error' => $e->getMessage()
            ]);
            return [];
        }

        if ($languages->isEmpty()) {
            Log::warning('No active supported languages found');
            return [];
        }

        // For long text (e.g. privacy policy, terms), translate one field at a time to avoid output token limit
        $totalChars = 0;
        foreach ($text as $value) {
            $totalChars += strlen((string) $value);
        }
        $longTextThreshold = 4000;

        if ($totalChars < $longTextThreshold) {
            return self::translateSingleRequest($text, $languages, $apiKey, $totalChars);
        }

        $mergedResult = [];
        foreach ($text as $fieldName => $fieldValue) {
            $singleField = [$fieldName => $fieldValue];
            $chunkResult = self::translateSingleRequest($singleField, $languages, $apiKey, strlen((string) $fieldValue));
            if (!empty($chunkResult)) {
                if (isset($chunkResult[0]['error'])) {
                    return $chunkResult;
                }
                foreach ($chunkResult as $langCode => $translated) {
                    if (!isset($mergedResult[$langCode])) {
                        $mergedResult[$langCode] = [];
                    }
                    $mergedResult[$langCode] = array_merge($mergedResult[$langCode], $translated);
                }
            }
        }

        return $mergedResult;
    }

    /**
     * Single Gemini API request for translation. Used for chunking long content.
     */
    private static function translateSingleRequest(array $text, $languages, string $apiKey, int $totalChars = 0): array
    {
        $languageList = [];
        foreach ($languages as $lang) {
            $languageList[] = [
                'code' => strtolower(trim($lang->code)),
                'name' => trim($lang->name),
            ];
        }

        $prompt = "
You are a professional translation engine.

STRICT RULES:
1. Translate ALL values into EACH language listed.
2. Use EXACT language codes as provided.
3. DO NOT change, shorten, or guess language codes.
4. JSON keys MUST remain unchanged.
5. Translate ONLY values, NEVER keys.
6. Output ONLY valid JSON.
7. No markdown, no explanation, no extra text.

Output format:
{
  \"lang_code\": {
    \"field\": \"translated value\"
  }
}

Languages:
" . json_encode($languageList, JSON_UNESCAPED_UNICODE) . "

JSON:
" . json_encode($text, JSON_UNESCAPED_UNICODE);

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey;

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ],
            'generationConfig' => [
                'response_mime_type' => 'application/json',
                'maxOutputTokens' => 65536,
            ]
        ];

        $timeout = $totalChars > 6000 ? 180 : 120;

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Accept: application/json',
            ],
        ]);

        $response  = curl_exec($ch);
        $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError || $httpCode !== 200 || empty($response)) {
            return [['error' => ['code' => $httpCode, 'message' => $curlError ?: 'API request failed']]];
        }

        $data = json_decode($response, true);

        if (
            empty($data['candidates'][0]['content']['parts'][0]['text'])
        ) {
            return [];
        }

        $jsonText = trim($data['candidates'][0]['content']['parts'][0]['text']);
        $jsonText = preg_replace('/^```json|```$/i', '', $jsonText);
        $jsonText = trim($jsonText);

        $decoded = json_decode($jsonText, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return [];
        }

        return $decoded;
    }

    private const TRANSLATED_SETTING_KEYS = [
        'app_name',
        'site_title',
        'store_address',
        'copyright_details',
        'app_title',
        'app_short_description',
        'app_mode_customer_remark',
        'app_mode_seller_remark',
        'app_mode_delivery_boy_remark',
        'contact_us',
        'about_us',
        'privacy_policy',
        'returns_and_exchanges_policy',
        'shipping_policy',
        'cancellation_policy',
        'terms_conditions',
        'privacy_policy_seller',
        'terms_conditions_seller',
        'common_meta_title',
        'common_meta_description',
        'website_mode_remark',
        'terms_conditions_delivery_boy',
        'privacy_policy_delivery_boy'
    ];

    public static function resolveTranslatedSettings(array $data): array
    {
        $lang = app()->has('lang_code') ? app('lang_code') : 'en';
        $languageService = app(\App\Services\LanguageService::class);
        $defaultLang = $languageService->getDefaultLanguage();
        $defaultLangCode = $defaultLang ? $languageService->getLanguageCode($defaultLang->id) : 'en';
        if (!$defaultLangCode) {
            $defaultLangCode = 'en';
        }

        foreach (self::TRANSLATED_SETTING_KEYS as $key) {
            if (!array_key_exists($key, $data)) {
                continue;
            }
            $value = $data[$key];
            if (is_string($value)) {
                if ($value === '') {
                    continue;
                }
                $decoded = json_decode($value, true);
            } elseif (is_array($value)) {
                $decoded = $value;
            } else {
                continue;
            }

            if (!is_array($decoded) || empty($decoded)) {
                continue;
            }
            $keys = array_keys($decoded);
            $isNumericList = $keys === range(0, count($decoded) - 1);
            if ($isNumericList) {
                continue;
            }
            // Resolve to single language: current lang, or default lang if current is empty/missing
            $resolved = $decoded[$lang] ?? null;
            if ($resolved === null || $resolved === '') {
                $resolved = $decoded[$defaultLangCode] ?? $decoded['en'] ?? reset($decoded) ?: '';
            }
            $data[$key] = $resolved === null ? '' : (string) $resolved;
        }
        return $data;
    }
}
