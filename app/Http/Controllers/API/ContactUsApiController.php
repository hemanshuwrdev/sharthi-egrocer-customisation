<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;

class ContactUsApiController extends Controller
{
    public function index()
    {
        $contact_us = Setting::where('variable', 'contact_us')->first();
        return CommonHelper::responseWithData($contact_us);
    }

    public function save(Request $request)
    {
        $value = $this->processValue($request->contact_us ?? "");

        $setting = Setting::where('variable', 'contact_us')->first();
        if ($setting) {
            $setting->value = $value;
            $setting->save();
        } else {
            $setting = new Setting();
            $setting->variable = 'contact_us';
            $setting->value = $value;
            $setting->save();
        }

        return CommonHelper::responseSuccess('contact_us_saved_successfully');
    }

    /**
     * Clean + store language-wise JSON safely
     */
    private function processValue($value)
    {
        if (empty($value)) {
            return "";
        }

        // Try JSON decode (language-wise)
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

        // Old single-language fallback
        $value = preg_replace('/\r\n|\r|\n/', ' ', $value);
        $value = preg_replace('/\s+/', ' ', $value);
        return trim($value);
    }

    /**
     * Frontend public contact-us page
     */
    public function printContactUs(Request $request)
    {
        $langCode = $request->get('lang', 'en');
        $value = Setting::get_value('contact_us');
        echo $this->getLanguageContent($value, $langCode);
    }

    private function getLanguageContent($value, $langCode)
    {
        if (empty($value)) {
            return '';
        }

        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $content = $decoded[$langCode] ?? '';

            if (empty($content)) {
                $content = reset($decoded); // fallback
            }
        } else {
            $content = $value;
        }

        return str_replace(["\r", "\n"], '', $content);
    }
}
