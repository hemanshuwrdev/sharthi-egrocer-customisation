<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class PrivacyPolicyApiController extends Controller
{
    /**
     * Allowed setting variables
     */
    private $variables = [
        "privacy_policy",
        "returns_and_exchanges_policy",
        "shipping_policy",
        "cancellation_policy",
        "terms_conditions"
    ];

    /**
     * Get all policies
     */
    public function index()
    {
        $policies = Setting::whereIn('variable', $this->variables)->get();
        return CommonHelper::responseWithData($policies);
    }

    /**
     * Save multilingual policies
     */
    public function save(Request $request)
    {
        foreach ($this->variables as $key) {

            if (!$request->has($key)) {
                continue;
            }

            $value = $this->processValue($request->$key ?? "");

            $setting = Setting::where('variable', $key)->first();

            if ($setting) {
                $setting->value = $value;
                $setting->save();
            } else {
                Setting::create([
                    'variable' => $key,
                    'value'    => $value
                ]);
            }
        }

        return CommonHelper::responseSuccess(
            'privacy_policy_and_terms_conditions_saved_successfully'
        );
    }

    private function processValue($value)
    {
        if (empty($value)) {
            return "";
        }

        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {

            $cleaned = [];

            foreach ($decoded as $langCode => $content) {

                $content = preg_replace('/\r\n|\r|\n/', ' ', $content);
                $content = preg_replace('/\s+/', ' ', $content);

                $cleaned[$langCode] = trim($content);
            }

            return json_encode(
                $cleaned,
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            );
        }

        $value = preg_replace('/\r\n|\r|\n/', ' ', $value);
        $value = preg_replace('/\s+/', ' ', $value);

        return trim($value);
    }

    private function getLanguageContent($value, $langCode)
    {
        if (empty($value)) {
            return '';
        }

        $decoded = json_decode($value, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {

            // Return requested language
            if (!empty($decoded[$langCode])) {
                return $decoded[$langCode];
            }
     
            return reset($decoded);
        }

        // Old single language support
        return $value;
    }

    public function printPrivacyPolicy(Request $request)
    {
        $langCode = $request->get('lang', 'en');
        $value = Setting::get_value('privacy_policy');
        echo $this->getLanguageContent($value, $langCode);
    }

    public function printReturnsAndExchangesPolicy(Request $request)
    {
        $langCode = $request->get('lang', 'en');
        $value = Setting::get_value('returns_and_exchanges_policy');
        echo $this->getLanguageContent($value, $langCode);
    }

    public function printShippingPolicy(Request $request)
    {
        $langCode = $request->get('lang', 'en');
        $value = Setting::get_value('shipping_policy');
        echo $this->getLanguageContent($value, $langCode);
    }

    public function printCancellationPolicy(Request $request)
    {
        $langCode = $request->get('lang', 'en');
        $value = Setting::get_value('cancellation_policy');
        echo $this->getLanguageContent($value, $langCode);
    }

    public function printTermsConditions(Request $request)
    {
        $langCode = $request->get('lang', 'en');
        $value = Setting::get_value('terms_conditions');
        echo $this->getLanguageContent($value, $langCode);
    }
}
