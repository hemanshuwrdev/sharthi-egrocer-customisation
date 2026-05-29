<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
class PrivacyPolicySellerApiController extends Controller
{
    public function index()
    {
        $variables = array("privacy_policy_seller", "terms_conditions_seller");
        $policies = Setting::whereIn('variable', $variables)->get();
        return CommonHelper::responseWithData($policies);
    }
    public function save(Request $request)
    {

        foreach ($request->all() as $key => $value) {
            $setting = Setting::where('variable', $key)->first();
            if ($setting) {
                $setting->variable = $key;
                $setting->value = $value ?? "";
                $setting->save();
            } else {
                $setting = new Setting();
                $setting->variable = $key;
                $setting->value = $value ?? "";
                $setting->save();
            }
        }
        return CommonHelper::responseSuccess('seller_privacy_policy_and_terms_conditions_saved_successfully');
    }
    public function printPrivacyPolicy(Request $request)
    {
        $langCode = $request->get('lang', 'en'); // Default to 'en' if no language specified
        $value = Setting::get_value('privacy_policy_seller');
        echo $this->getLanguageContent($value, $langCode);
    }

    public function printTermsConditions(Request $request)
    {
        $langCode = $request->get('lang', 'en'); // Default to 'en' if no language specified
        $value = Setting::get_value('terms_conditions_seller');
        echo $this->getLanguageContent($value, $langCode);
    }

    private function getLanguageContent($value, $langCode)
    {
        if (empty($value)) {
            return '';
        }

        // Try to parse as JSON (language-wise format)
        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            // It's JSON with language codes - get content for specified language
            $content = $decoded[$langCode] ?? '';

            // If language not found, try to get default language or first available
            if (empty($content)) {
                // Try common default language codes
                $defaultCodes = ['en', 'ar', 'hi', 'fr', 'es'];
                foreach ($defaultCodes as $code) {
                    if (isset($decoded[$code]) && !empty($decoded[$code])) {
                        $content = $decoded[$code];
                        break;
                    }
                }
                // If still empty, get first available
                if (empty($content) && !empty($decoded)) {
                    $content = reset($decoded);
                }
            }
        } else {
            // Not JSON - it's plain text, use as-is
            $content = $value;
        }

        // Remove newline characters (\n, \r, \r\n) for proper HTML rendering
        $content = str_replace(["\r\n", "\r", "\n"], '', $content);

        return $content;
    }
}
