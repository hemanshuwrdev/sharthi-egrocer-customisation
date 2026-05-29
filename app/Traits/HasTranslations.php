<?php

namespace App\Traits;

use App\Services\LanguageService;
use Illuminate\Support\Facades\Request;
trait HasTranslations
{

    public function translations()
    {
        $translationModel = $this->getTranslationModelClass();
        $foreignKey = $this->getTranslationForeignKey();

        return $this->hasMany($translationModel, $foreignKey);
    }

    public function translation($languageId = null)
    {
        if ($languageId === null) {
            $languageId = $this->getCurrentLanguageId();
        }

        return $this->translations()->where('language_id', $languageId)->first();
    }

    public function getTranslatedAttribute(string $field, $languageId = null)
    {
        // Get current language ID from app container (set by ResolveLanguage middleware)
        if ($languageId === null) {
            $languageId = LanguageService::getCurrentId();
        }

        // If no language set, return base table value
        if (!$languageId) {
            return $this->attributes[$field] ?? null;
        }

        // Check if translations are eager loaded (from ->with('translations'))
        if ($this->relationLoaded('translations')) {
            try {
                $translationsCollection = $this->getRelation('translations');
                if ($translationsCollection !== null) {
                    $translation = $translationsCollection
                        ->where('language_id', $languageId)
                        ->first();
                } else {
                    $translation = $this->translation($languageId);
                }
            } catch (\Exception $e) {
                // If accessing translations fails, fallback to lazy loading
                $translation = $this->translation($languageId);
            }
        } else {
            // Fallback to lazy loading if not eager loaded
            $translation = $this->translation($languageId);
        }

        // If translation exists and field has value, use it
        // Check for both null and empty string
        $value = ($translation && isset($translation->$field) && $translation->$field !== '' && $translation->$field !== null)
            ? $translation->$field
            : ($this->attributes[$field] ?? null);

        if (in_array($field, ['description', 'store_description']) && !empty($value)) {
            $value = \App\Helpers\CommonHelper::fixDescriptionImageUrls($value);
        }

        return $value;
    }

    public function translated(string $field)
    {
        $langId = \App\Services\LanguageService::getCurrentId();

        // If no language set, return base table value
        if (!$langId) {
            return $this->attributes[$field] ?? null;
        }

        // Check if translations are eager loaded (more efficient)
        if ($this->relationLoaded('translations')) {
            try {
                $translationsCollection = $this->getRelation('translations');
                if ($translationsCollection !== null) {
                    $translation = $translationsCollection
                        ->where('language_id', $langId)
                        ->first();
                } else {
                    $translation = $this->translation($langId);
                }
            } catch (\Exception $e) {
                $translation = $this->translation($langId);
            }
        } else {
            $translation = $this->translation($langId);
        }

        $value = ($translation && isset($translation->$field) && $translation->$field !== '' && $translation->$field !== null)
            ? $translation->$field
            : ($this->attributes[$field] ?? null);

        if (in_array($field, ['description', 'store_description']) && !empty($value)) {
            $value = \App\Helpers\CommonHelper::fixDescriptionImageUrls($value);
        }

        return $value;
    }

    public function getAttribute($key)
    {
        // Check if this is a translatable field
        if ($this->isTranslatableAttribute($key)) {
            return $this->getTranslatedAttribute($key);
        }

        // Default behavior for non-translatable fields
        return parent::getAttribute($key);
    }

    protected function isTranslatableAttribute(string $key): bool
    {
        return in_array($key, $this->getTranslatableAttributes());
    }

    protected function getTranslatableAttributes(): array
    {
        return property_exists($this, 'translatable') ? $this->translatable : [];
    }

    protected function getTranslationModelClass(): string
    {
        if (property_exists($this, 'translationModel')) {
            return 'App\\Models\\' . $this->translationModel;
        }

        // Default: ModelNameTranslation
        $modelName = class_basename($this);
        return 'App\\Models\\' . $modelName . 'Translation';
    }

    protected function getTranslationForeignKey(): string
    {
        if (property_exists($this, 'translationForeignKey')) {
            return $this->translationForeignKey;
        }

        // Default: model_id (e.g., category_id)
        return strtolower(class_basename($this)) . '_id';
    }

    protected function getCurrentLanguageId(): ?int
    {
        // Priority 1: Get from app container (set by middleware)
        if (app()->has('lang_id')) {
            return app('lang_id');
        }

        // Priority 2: Get from request attributes (backward compatibility)
        $request = Request::instance();
        if ($request) {
            return $request->attributes->get('language_id');
        }

        return null;
    }

    public function scopeWithTranslation($query)
    {
        $languageId = $this->getCurrentLanguageId();

        if ($languageId) {
            return $query->with(['translations' => function ($q) use ($languageId) {
                $q->where('language_id', $languageId);
            }]);
        }

        return $query->with('translations');
    }

    public function scopeWithAllTranslations($query)
    {
        return $query->with('translations');
    }

    public function saveTranslation(int $languageId, array $data)
    {
        $translationModel = $this->getTranslationModelClass();
        $foreignKey = $this->getTranslationForeignKey();

        // Only save translatable fields
        $translatableData = array_intersect_key($data, array_flip($this->getTranslatableAttributes()));

        foreach ($translatableData as $key => $value) {
            if (is_null($value)) {
                $translatableData[$key] = '';
            }
        }

        // Check if all translatable fields are empty
        $allFieldsEmpty = true;
        foreach ($translatableData as $value) {
            // Convert to string and trim, then check if not empty
            $trimmedValue = trim((string) $value);
            if ($trimmedValue !== '') {
                $allFieldsEmpty = false;
                break;
            }
        }

        // If all fields are empty, delete the translation if it exists
        if ($allFieldsEmpty) {
            $existingTranslation = $translationModel::where($foreignKey, $this->id)
                ->where('language_id', $languageId)
                ->first();
            
            if ($existingTranslation) {
                $existingTranslation->delete();
                return null; // Return null to indicate deletion
            }
            
            // No existing translation to delete, return null
            return null;
        }

        // Update or create translation when there's actual data
        return $translationModel::updateOrCreate(
            [
                $foreignKey => $this->id,
                'language_id' => $languageId
            ],
            $translatableData
        );
    }

    public function deleteTranslation(int $languageId): bool
    {
        $foreignKey = $this->getTranslationForeignKey();

        return $this->translations()
            ->where($foreignKey, $this->id)
            ->where('language_id', $languageId)
            ->delete();
    }

    public function getTranslationsAttribute()
    {
        if ($this->relationLoaded('translations')) {
            return $this->getRelation('translations')->toArray();
        }

        // Default accessor behavior - return array with current language translations
        $langCode = LanguageService::getCurrentCode();

        $translations = [
            'lang' => $langCode,
        ];

        foreach ($this->getTranslatableAttributes() as $field) {
            // This automatically applies fallback via getAttribute()
            $translations[$field] = $this->getTranslatedAttribute($field);
        }

        return $translations;
    }

    /**
     * Serialization: when "optimized" (customer route or Content-Language header), translatable
     * fields only in translations. Which extra attributes to hide is controlled per request
     * via setHideAttributes() / setOnlyIdAndTranslationsFor() in your controller—no model property.
     */
    public function toArray()
    {
        $array = parent::toArray();

        if (!self::isOptimizedResponse()) {
            return $array;
        }

        // Translatable only inside translations (no top-level duplication)
        foreach ($this->getTranslatableAttributes() as $field) {
            unset($array[$field]);
        }

        // Per-model: keep only id and translations (e.g. for Seller in app APIs)
        $onlyIdAndTranslations = self::getOnlyIdAndTranslationsModelsFromRequest();
        if (!empty($onlyIdAndTranslations) && in_array(class_basename($this), $onlyIdAndTranslations, true)) {
            $array = array_intersect_key($array, array_flip(['id', 'translations']));
            return $array;
        }

        // Global or default: hide only attributes set for this request (via setHideAttributes).
        $hideAttrs = self::getTranslationHideAttributesFromRequest($this);
        foreach ($hideAttrs as $key) {
            unset($array[$key]);
        }

        return $array;
    }

    /**
     * Optimized when: customer route OR Content-Language header, unless overridden by setOptimizedResponse(false).
     */
    protected static function isOptimizedResponse(): bool
    {
        if (!app()->has('request') || !request()) {
            return false;
        }
        $override = request()->attributes->get('translation_optimized');
        if ($override !== null) {
            return (bool) $override;
        }
        if (self::isCustomerRoute()) {
            return true;
        }
        $contentLanguage = request()->header('Content-Language');
        return $contentLanguage !== null && trim((string) $contentLanguage) !== '';
    }

    /**
     * Attributes to hide in optimized response. Supports per-model list: translation_hide_attributes_Seller, etc.
     * Fallback: translation_hide_attributes (global). Empty or not set = hide nothing extra.
     */
    protected static function getTranslationHideAttributesFromRequest($model = null): array
    {
        if (!app()->has('request') || !request()) {
            return [];
        }
        if ($model !== null) {
            $key = 'translation_hide_attributes_' . class_basename($model);
            $attrs = request()->attributes->get($key);
            if (is_array($attrs)) {
                return $attrs;
            }
        }
        $attrs = request()->attributes->get('translation_hide_attributes');
        return is_array($attrs) ? $attrs : [];
    }

    /**
     * Model class basenames (e.g. ['Seller']) that should serialize as only id + translations.
     */
    protected static function getOnlyIdAndTranslationsModelsFromRequest(): array
    {
        if (!app()->has('request') || !request()) {
            return [];
        }
        $list = request()->attributes->get('translation_only_id_and_translations');
        return is_array($list) ? $list : [];
    }

    /**
     * Whether the current request is under the customer route prefix (customer/*).
     */
    protected static function isCustomerRoute(): bool
    {
        if (!app()->has('request') || !request()) {
            return false;
        }
        $path = request()->path();
        return $path === 'customer' || str_starts_with($path, 'customer/');
    }

    // --- Request-level controls (call from controller when building response) ---

    /**
     * Force optimized response (translations only at top level) for this request.
     * Call before returning response. Optional: default is derived from customer route / Content-Language.
     */
    public static function setOptimizedResponse(bool $enabled): void
    {
        if (app()->has('request') && request()) {
            request()->attributes->set('translation_optimized', $enabled);
        }
    }

    /**
     * In optimized response, hide these attributes (e.g. ['parent_id', 'conversion'] for Unit).
     * Call in controller per API so the same model can return full or minimal data.
     * Pass [] to hide nothing extra; omit calling to also hide nothing.
     */
    public static function setHideAttributes(array $attributes): void
    {
        if (app()->has('request') && request()) {
            request()->attributes->set('translation_hide_attributes', $attributes);
        }
    }

    /**
     * Convenience: enable optimized response and set which attributes to hide in one call.
     * Example: HasTranslations::optimizedForRequest(['parent_id', 'conversion']);
     */
    public static function optimizedForRequest(array $hideAttributes = []): void
    {
        self::setOptimizedResponse(true);
        self::setHideAttributes($hideAttributes);
    }

    /**
     * In optimized response, these models will serialize with only id and translations.
     * Pass class basenames, e.g. setOnlyIdAndTranslationsFor(['Seller']).
     */
    public static function setOnlyIdAndTranslationsFor(array $modelBasenames): void
    {
        if (app()->has('request') && request()) {
            request()->attributes->set('translation_only_id_and_translations', $modelBasenames);
        }
    }

    public function getAllActiveLanguageTranslations(): array
    {
        // Ensure translations are loaded (eager load if not already loaded)
        if (!$this->relationLoaded('translations')) {
            $this->load('translations');
        }

        // Get default language for fallback logic
        $languageService = app(LanguageService::class);
        $defaultLanguage = $languageService->getDefaultLanguage();
        $defaultLanguageId = $defaultLanguage ? $defaultLanguage->id : null;

        // Get all active languages for admin panel (system_type = 4)
        $activeLanguages = collect($languageService->getActiveLanguages())->keyBy('id');

        $translationsRelation = $this->getRelation('translations');
        $modelTranslations = $translationsRelation ? collect($translationsRelation)->keyBy('language_id') : collect();

        $translatableFields = $this->getTranslatableAttributes();

        $hasAnyTranslation = $modelTranslations->isNotEmpty();
        $isSingleLanguage = $activeLanguages->count() === 1;

        $translations = [];
        
        foreach ($activeLanguages as $langId => $langInfo) {
            $translation = $modelTranslations->get($langId);
            
            $isDefaultLanguage = ($langId == $defaultLanguageId) || ($langInfo->is_default == 1);
            $hasTranslation = $translation !== null;
            
            $translationData = [
                'language_id' => $langId,
                'language_code' => $langInfo->code ?? '',
                'language_name' => $langInfo->name ?? '',
            ];

            // For each translatable field, get the value
            foreach ($translatableFields as $field) {
                // If single language and no translations exist, use main table data
                if ($isSingleLanguage && !$hasAnyTranslation) {
                    $translationData[$field] = $this->getAttributeValue($field) ?? '';
                } elseif ($isDefaultLanguage && !$hasTranslation) {
                    // Default language without translation: use base table values
                    $translationData[$field] = $this->getAttributeValue($field) ?? '';
                } else {
                    // Use translation data if available, otherwise empty string
                    $translationData[$field] = $translation ? ($translation->$field ?? '') : '';
                }
            }

            $translations[$langId] = $translationData;
        }

        return $translations;
    }
    
}