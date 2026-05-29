<?php

namespace App\Http\Middleware;

use App\Helpers\CommonHelper;
use App\Models\Language;
use App\Models\SupportedLanguage;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Route;

class SetLang
{
    public function handle($request, Closure $next)
    {
        try {
            $user = Auth::user();
            $myfile = fopen("my-logs/log-" . date('Y-m-d') . ".txt", "a") or die("Unable to open file!");
            fwrite($myfile, date('Y-m-d H:i:s') . " ==> " . json_encode($_REQUEST) . " ==> " . json_encode($_SERVER) . " ==> " . json_encode($user));
            fclose($myfile);
        } catch (\Exception $e) {
        }

        $lang = 'en';

        if (Session::has('lang') && Session::get('lang') != '') {
            $lang = Session::get('lang');
        } else {
            // Skip DB queries during install - no database/tables yet
            try {
                $role = Language::$systemTypeAdminPanel;
                $language = Language::where('system_type', $role)
                    ->where('is_default', 1)
                    ->first();
                if ($language) {
                    $supportedLanguage = SupportedLanguage::where('id', $language->supported_language_id)->first();
                    if ($supportedLanguage) {
                        $lang = $supportedLanguage->code;
                    }
                }
            } catch (\Throwable $e) {
                // Database not ready (e.g. during install) - keep default 'en'
            }
        }

        if (isset($lang) && $lang != '') {
            app()->setLocale($lang);
            Session::put('app_locale', $lang);
        }

        //check installed
        if (!str_contains($request->path(), 'install') && !file_exists(storage_path('installed'))) {
            return redirect('install');
        }

        $restrictedUrls = array(
            'categories.save',
            'categories.update',
            'categories.delete',
            'categories.updateOrder',
            'subcategories.save',
            'subcategories.update',
            'subcategories.delete',
            'products.save',
            'products.update',
            'products.updateOrder',
            'products.delete',
            'products.multiple_delete',
            'products.change',
            'products.bulk_upload',
            'taxes.save',
            'taxes.update',
            'taxes.delete',
            'brands.save',
            'brands.update',
            'brands.delete',
            'sellers.save',
            'sellers.update',
            'sellers.delete',
            'sellers.update-status',
            'home_slider_images.save',
            'home_slider_images.update',
            'home_slider_images.delete',
            'promo_code.save',
            'promo_code.update',
            'promo_code.delete',
            'time_slots.save',
            'time_slots.update',
            'time_slots.delete',
            'units.save',
            'units.update',
            'units.delete',
            'payment_methods.save',
            'store_settings.save',
            'mail_settings.save',
            'firebase.save',
            'popup.save',
            'notification_settings.save',
            'contact_us.save',
            'about_us.save',
            'privacy_policy.save',
            'privacy_policy_delivery_boy.save',
            'privacy_policy_seller.save',
            'notifications.save',
            'notifications.save',
            'notifications.delete',
            'sections.save',
            'sections.update',
            'sections.delete',
            'sections.updateOrder',
            'offers.save',
            'offers.update',
            'offers.delete',
            'delivery_boys.save',
            'delivery_boys.update',
            'delivery_boys.delete',
            'delivery_boys.update-status',
            'fund_transfers.save',
            'cash_collection.save',
            'front_end_policies.save',
            'web_settings.save',
            'front_end_about.save',
            'social_media.save',
            'social_media.update',
            'social_media.delete',
            'seller_wallet_transactions.save',
            'customers.change',
            'wallet_transactions.save',
            'system_users.save',
            'system_users.update',
            'system_users.delete',
            'system_users.change_password',
            'withdrawal_requests.save',
            'withdrawal_requests.update',
            'withdrawal_requests.delete',
            'return_requests.save',
            'return_requests.update',
            'return_requests.delete',
            'orders.delete',
            'orders.deleteItem',
            'orders.update_status',
            'orders.assign_delivery_boy',
            'orders.update_items_status',
            'role.save',
            'role.update',
            'role.delete',
            'media.save',
            'media.delete',
            'media.multiple_delete',
            'cities.save',
            'cities.save_boundary',
            'cities.update',
            'cities.delete',
            'faqs.save',
            'faqs.update',
            'faqs.delete',
            'languages.save',
            'languages.update',
            'languages.delete',
            'seller.update_status',
            'seller.assign_delivery_boy',
            'seller.mail_settings.save',
            'seller.delete_seller_account',
            'delivery_boy.update_status',
            'delivery_boy.mail_settings.save',
            'delivery_boy.delete_delivery_boy_account',
            'database_backup_download.download_db_backup',
            'products.bulk_update',
            'store_settings.save_login_setting',
            'time_slots.saveTimeSlotsSettings',
            'countries.save',
            'countries.update',
            'countries.delete',
            'store_settings.save_store_basic_setting',
            'store_settings.save_address_setting',
            'store_settings.save_other_setting',
            'store_settings.save_app_setting',
            'store_settings.save_delivery_boy_setting',
            'store_settings.save_frontend_home_setting',
            'store_settings.save_smtp_mail_setting',
            'store_settings.save_third_party_api_setting',
            'store_settings.save_seller_setting',
            'store_settings.save_refer_earn_setting',
            'store_settings.save_additional_charges',
            'store_settings.save_third_party_api_setting',
            'store_settings.test_mail',
            'store_settings.save_cart_setting',
            'orders.update_self_pickup_status',
            'user_product_requests.update-status',
            'user_product_requests.delete',
            'blog_categories.save',
            'blog_categories.update',
            'blog_categories.delete',
            'blogs.save',
            'blogs.update',
            'blogs.delete',
            'subscription_plans.save',
            'subscription_plans.update',
            'subscription_plans.delete',
            'subscription_plans.update_setting',
            'subscription_faqs.save',
            'subscription_faqs.update',
            'subscription_faqs.delete',
            'subscription_faqs.update_order',
            'languages.translate-empty',
            'languages.translate-overwrite',
            'blogs.google_gemini',
            'seller.google_gemini',
            'orders.cancel_order_item',
            'delivery_boy_salary.delete',
            'delivery_boy_salary.update',
            'delivery_boy_salary.add',
            'additional_charges.save',
            'additional_charges.delete'
        );
        $route = Route::getRoutes()->match($request);
        $currentRoute = $route->getName() ?? '';

        if (in_array($currentRoute, $restrictedUrls) && isDemoMode()) {
            $user_id = auth()->user()->id ?? 0;
            if ($user_id !== 1) {
                return CommonHelper::responseError("This function is not available in demo mode!");
            }
        }

        validateAdmin();
        fixVersion();
        return $next($request);
    }
}
