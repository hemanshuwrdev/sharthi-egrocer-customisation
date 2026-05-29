<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class AboutUsApiController extends Controller
{
    public function index()
    {
        $about_us = Setting::where('variable', 'about_us')->first();
        return CommonHelper::responseWithData($about_us);
    }

    public function save(Request $request)
    {
        $value = $this->processValue($request->about_us ?? "");

        $setting = Setting::where('variable', 'about_us')->first();
        if ($setting) {
            $setting->value = $value;
            $setting->save();
        } else {
            $setting = new Setting();
            $setting->variable = 'about_us';
            $setting->value = $value;
            $setting->save();
        }

        return CommonHelper::responseSuccess('about_us_saved_successfully');
    }

    private function processValue($value)
    {
        if (empty($value)) return "";

        $decoded = json_decode($value, true);

        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $clean = [];
            foreach ($decoded as $lang => $content) {
                $content = preg_replace('/\r\n|\r|\n/', ' ', $content);
                $content = preg_replace('/\s+/', ' ', $content);
                $clean[$lang] = trim($content);
            }
            return json_encode($clean, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        }

        return trim(preg_replace('/\s+/', ' ', $value));
    }

    public function printAboutUs(Request $request)
    {
        $lang = $request->get('lang', 'en');
        $value = Setting::get_value('about_us');
        echo $this->getLanguageContent($value, $lang);
    }

    private function getLanguageContent($value, $lang)
    {
        if (!$value) return '';

        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded[$lang] ?? reset($decoded);
        }

        return $value;
    }
}
