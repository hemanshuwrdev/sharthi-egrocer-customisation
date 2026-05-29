<?php

namespace App\Services;

use App\Models\Language;
use App\Models\SupportedLanguage;

class LanguageService
{
    public function getLanguageByCode(string $code): ?Language
    {
        // Get supported language by code
        $supportedLanguage = SupportedLanguage::where('code', $code)->first();
        
        if (!$supportedLanguage) {
            return null;
        }

        // Get language by supported_language_id for Admin Panel only (system_type = 4)
        return Language::select(['id', 'supported_language_id', 'system_type', 'is_default', 'display_name'])->where('supported_language_id', $supportedLanguage->id)
            ->where('system_type', 4)
            ->where('status', 1)
            ->first();
    }

    public function getLanguageById(int $languageId): ?Language
    {
        return Language::where('id', $languageId)
            ->where('status', 1)
            ->first();
    }

    public function getDefaultLanguage(): ?Language
    {
        return Language::select(['id', 'supported_language_id', 'system_type', 'is_default', 'display_name'])->where('system_type', 4)
            ->where('is_default', 1)
            ->where('status', 1)
            ->first();
    }

    public function getLanguageCode(int $languageId): ?string
    {
        $language = $this->getLanguageById($languageId);
        
        if (!$language) {
            return null;
        }

        // Get supported language code
        $supportedLanguage = SupportedLanguage::find($language->supported_language_id);
        
        return $supportedLanguage ? $supportedLanguage->code : null;
    }

    public function getActiveLanguages()
    {
        return Language::leftJoin('supported_languages', 'supported_languages.id', 'languages.supported_language_id')
            ->where('languages.system_type', 4)
            ->where('languages.status', 1)
            ->orderBy('languages.is_default', 'DESC')
            ->orderBy('supported_languages.name', 'ASC')
            ->get([
                'languages.id',
                'languages.supported_language_id',
                'languages.system_type',
                'languages.is_default',
                'languages.display_name',
                'supported_languages.name',
                'supported_languages.code'
            ]);
    }

    public static function getCurrentId(): ?int
    {
        return app()->has('lang_id') ? app('lang_id') : null;
    }

    public static function getCurrentCode(): ?string
    {
        return app()->has('lang_code') ? app('lang_code') : null;
    }

    public static function getCurrent()
    {
        return app()->has('current_language') ? app('current_language') : null;
    }

    public static function hasCurrentLanguage(): bool
    {
        return app()->has('lang_id');
    }
}

