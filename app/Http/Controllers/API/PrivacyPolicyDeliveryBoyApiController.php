<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
class PrivacyPolicyDeliveryBoyApiController extends Controller
{
    public function index()
    {
        $variables = array("privacy_policy_delivery_boy", "terms_conditions_delivery_boy");
        $policies = Setting::whereIn('variable', $variables)->get();
        return CommonHelper::responseWithData($policies);
    }
    public function save(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            $setting = Setting::where('variable', $key)->first();
            if ($setting) {
                $setting->variable = $key;
                $setting->value = $this->processValue($value ?? "");
                $setting->save();
            } else {
                $setting = new Setting();
                $setting->variable = $key;
                $setting->value = $this->processValue($value ?? "");
                $setting->save();
            }
        }
        return CommonHelper::responseSuccess('delivery_boy_privacy_policy_and_terms_conditions_saved_successfully');
    }

    private function processValue($value)
    {
        if (empty($value)) {
            return "";
        }

        // Try to decode as JSON (language-wise format)
        $decoded = json_decode($value, true);

        // Check if it's valid JSON and an array (indicating language-wise content)
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $cleaned = [];
            foreach ($decoded as $langCode => $content) {
                // Remove newlines and normalize whitespace
                $cleanedContent = preg_replace('/\r\n|\r|\n/', ' ', $content);
                $cleanedContent = preg_replace('/\s+/', ' ', $cleanedContent);
                $cleaned[$langCode] = trim($cleanedContent);
            }
            // Re-encode with JSON_UNESCAPED_SLASHES to prevent escaping of '/' in HTML tags
            return json_encode($cleaned, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }

        // Not JSON - it's plain text, clean it directly
        $cleaned = preg_replace('/\r\n|\r|\n/', ' ', $value);
        $cleaned = preg_replace('/\s+/', ' ', $cleaned);
        return trim($cleaned);
    }

    public function printPrivacyPolicy(Request $request)
    {
        $langCode = $request->get('lang', 'en'); // Default to 'en' if no language specified
        $value = Setting::get_value('privacy_policy_delivery_boy');
        echo $this->getLanguageContent($value, $langCode);
    }

    public function printTermsConditions(Request $request)
    {
        $langCode = $request->get('lang', 'en'); // Default to 'en' if no language specified
        $value = Setting::get_value('terms_conditions_delivery_boy');
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
