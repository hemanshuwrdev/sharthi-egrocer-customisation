<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Models\MasterProduct;
use App\Models\MasterProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MasterProductApiController extends Controller
{
    public function list(Request $request)
    {
        if ($request->filled('id')) {
            $product = MasterProduct::with(['parentCompany', 'brand', 'category', 'variants.unit', 'variants.secondaryUnit'])
                ->where('id', $request->id)
                ->first();
            return CommonHelper::responseWithData($product);
        }

        $limit = $request->input('per_page', 10);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $filter = $request->input('filter', '');

        $query = MasterProduct::with(['parentCompany', 'brand', 'category'])
            ->withCount('variants')
            ->orderBy('id', 'DESC');

        if ($filter) {
            $query->where(function ($q) use ($filter) {
                $q->where('id', 'like', "%{$filter}%")
                    ->orWhere('name', 'like', "%{$filter}%")
                    ->orWhere('hsn', 'like', "%{$filter}%");
            });
        }

        foreach (['brand_id', 'parent_company_id', 'category_id', 'status'] as $f) {
            if ($request->filled($f)) {
                $query->where($f, $request->input($f));
            }
        }

        $total = $query->count();
        $products = $query->skip($offset)->take($limit)->get();

        return CommonHelper::responseWithData($products, $total);
    }

    public function edit($id)
    {
        $product = MasterProduct::with([
            'parentCompany',
            'brand',
            'category',
            'variants.unit',
            'variants.secondaryUnit',
            'translations',
        ])->find($id);
        if (!$product) {
            return CommonHelper::responseError('master_product_not_found');
        }
        return CommonHelper::responseWithData($product);
    }

    /**
     * Single-form save: creates master_product + N variants in one transaction.
     * Variants come in as an array: variants[0][sku], variants[0][unit_id], variants[0][image] (file), etc.
     */
    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'brand_id' => 'required|exists:brands,id',
            'parent_company_id' => 'nullable|exists:parent_companies,id',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'other_images' => 'nullable|array',
            'other_images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'type' => 'nullable|in:single,variable',
            'variants' => 'required|array|min:1',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.unit_id' => 'nullable|exists:units,id',
            'variants.*.secondary_unit_id' => 'nullable|exists:units,id',
            'variants.*.secondary_unit_value' => 'nullable|numeric|min:0',
            'variants.*.allow_loose_qty' => 'nullable|boolean',
            'variants.*.weight' => 'nullable|numeric|min:0',
            'variants.*.image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $nameError = $this->ensureDefaultLanguageName($request);
        if ($nameError) {
            return CommonHelper::responseError($nameError);
        }

        try {
            $productId = DB::transaction(function () use ($request) {
                $translations = $this->decodeTranslations($request);
                $defaults = $this->extractDefaultsFromTranslations($request, $translations);

                $product = new MasterProduct();
                $product->name = $defaults['name'];
                $product->slug = Str::slug($defaults['name']) . '-' . substr(uniqid(), -5);
                $product->parent_company_id = $request->parent_company_id;
                $product->brand_id = $request->brand_id;
                $product->category_id = $request->category_id;
                $product->tax_id = $request->tax_id;
                $product->hsn = $request->hsn;
                $product->description = $defaults['description'];
                $product->meta_title = $defaults['meta_title'];
                $product->meta_keywords = $defaults['meta_keywords'];
                $product->meta_description = $defaults['meta_description'];
                $product->schema_markup = $defaults['schema_markup'];
                $product->type = $request->type ?: 'single';
                $product->status = $request->has('status') ? $request->status : 1;
                $product->created_by = auth()->id();

                if ($request->hasFile('image')) {
                    $product->image = $this->storeImage($request->file('image'), 'master_products');
                }
                if ($request->hasFile('other_images')) {
                    $paths = [];
                    foreach ((array) $request->file('other_images') as $file) {
                        $paths[] = $this->storeImage($file, 'master_products');
                    }
                    $product->other_images = $paths;
                }

                $product->save();

                foreach ($translations as $t) {
                    if (!empty($t['language_id'])) {
                        $product->saveTranslation((int) $t['language_id'], $t);
                    }
                }

                foreach ((array) $request->input('variants', []) as $idx => $v) {
                    $variant = new MasterProductVariant();
                    $variant->master_product_id = $product->id;
                    $variant->sku = $v['sku'] ?? null;
                    $variant->unit_id = $v['unit_id'] ?? null;
                    $variant->secondary_unit_id = $v['secondary_unit_id'] ?? null;
                    $variant->secondary_unit_value = $v['secondary_unit_value'] ?? null;
                    $variant->allow_loose_qty = !empty($v['allow_loose_qty']) ? 1 : 0;
                    $variant->weight = $v['weight'] ?? null;
                    $variant->status = isset($v['status']) ? $v['status'] : 1;

                    if ($request->hasFile("variants.$idx.image")) {
                        $variant->image = $this->storeImage($request->file("variants.$idx.image"), 'master_product_variants');
                    }
                    $variant->save();
                }

                return $product->id;
            });

            return CommonHelper::responseWithData([
                'id' => $productId,
                'message' => __('master_product_saved_successfully'),
            ]);
        } catch (\Throwable $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    /**
     * Single-form update: updates product + reconciles variants (insert new / update existing / delete marked).
     * Variant row with `id` set -> update. Row without id -> insert. Row with `_delete=1` -> delete.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:master_products,id',
            'brand_id' => 'required|exists:brands,id',
            'parent_company_id' => 'nullable|exists:parent_companies,id',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'other_images' => 'nullable|array',
            'other_images.*' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
            'type' => 'nullable|in:single,variable',
            'variants' => 'required|array|min:1',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.unit_id' => 'nullable|exists:units,id',
            'variants.*.secondary_unit_id' => 'nullable|exists:units,id',
            'variants.*.secondary_unit_value' => 'nullable|numeric|min:0',
            'variants.*.allow_loose_qty' => 'nullable|boolean',
            'variants.*.weight' => 'nullable|numeric|min:0',
            'variants.*.image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:2048',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $nameError = $this->ensureDefaultLanguageName($request);
        if ($nameError) {
            return CommonHelper::responseError($nameError);
        }

        try {
            DB::transaction(function () use ($request) {
                $product = MasterProduct::find($request->id);
                $translations = $this->decodeTranslations($request);
                $defaults = $this->extractDefaultsFromTranslations($request, $translations);

                $product->name = $defaults['name'];
                $product->parent_company_id = $request->parent_company_id;
                $product->brand_id = $request->brand_id;
                $product->category_id = $request->category_id;
                $product->tax_id = $request->tax_id;
                $product->hsn = $request->hsn;
                $product->description = $defaults['description'];
                $product->meta_title = $defaults['meta_title'];
                $product->meta_keywords = $defaults['meta_keywords'];
                $product->meta_description = $defaults['meta_description'];
                $product->schema_markup = $defaults['schema_markup'];
                if ($request->filled('type')) {
                    $product->type = $request->type;
                }
                if ($request->has('status')) {
                    $product->status = $request->status;
                }

                if ($request->hasFile('image')) {
                    if ($product->image) {
                        Storage::disk('public')->delete($product->image);
                    }
                    $product->image = $this->storeImage($request->file('image'), 'master_products');
                }

                $existingOther = $product->other_images ?: [];

                // Remove explicit images (paths sent via delete_other_images[])
                $deletePaths = array_filter((array) $request->input('delete_other_images', []));
                if (!empty($deletePaths)) {
                    foreach ($deletePaths as $path) {
                        Storage::disk('public')->delete($path);
                    }
                    $existingOther = array_values(array_diff($existingOther, $deletePaths));
                }

                if ($request->hasFile('other_images')) {
                    foreach ((array) $request->file('other_images') as $file) {
                        $existingOther[] = $this->storeImage($file, 'master_products');
                    }
                }
                $product->other_images = $existingOther;

                $product->save();

                foreach ($translations as $t) {
                    if (!empty($t['language_id'])) {
                        $product->saveTranslation((int) $t['language_id'], $t);
                    }
                }

                foreach ((array) $request->input('variants', []) as $idx => $v) {
                    $isDelete = !empty($v['_delete']);
                    $variantId = $v['id'] ?? null;

                    if ($isDelete && $variantId) {
                        $existing = MasterProductVariant::where('id', $variantId)
                            ->where('master_product_id', $product->id)
                            ->first();
                        if ($existing) {
                            if ($existing->image) {
                                Storage::disk('public')->delete($existing->image);
                            }
                            $existing->delete();
                        }
                        continue;
                    }

                    $variant = $variantId
                        ? MasterProductVariant::where('id', $variantId)->where('master_product_id', $product->id)->first()
                        : new MasterProductVariant();

                    if (!$variant) {
                        continue;
                    }

                    $variant->master_product_id = $product->id;
                    $variant->sku = $v['sku'] ?? null;
                    if (array_key_exists('unit_id', $v)) {
                        $variant->unit_id = $v['unit_id'] ?: null;
                    }
                    $variant->secondary_unit_id = $v['secondary_unit_id'] ?? null;
                    $variant->secondary_unit_value = $v['secondary_unit_value'] ?? null;
                    $variant->allow_loose_qty = !empty($v['allow_loose_qty']) ? 1 : 0;
                    $variant->weight = $v['weight'] ?? null;
                    if (array_key_exists('status', $v)) {
                        $variant->status = $v['status'];
                    } elseif (!$variant->exists) {
                        $variant->status = 1;
                    }

                    if ($request->hasFile("variants.$idx.image")) {
                        if ($variant->image) {
                            Storage::disk('public')->delete($variant->image);
                        }
                        $variant->image = $this->storeImage($request->file("variants.$idx.image"), 'master_product_variants');
                    }

                    $variant->save();
                }
            });

            return CommonHelper::responseSuccess('master_product_updated_successfully');
        } catch (\Throwable $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function delete(Request $request)
    {
        $product = MasterProduct::with('variants')->find($request->id);
        if (!$product) {
            return CommonHelper::responseError('master_product_not_found');
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        foreach ((array) $product->other_images as $path) {
            Storage::disk('public')->delete($path);
        }
        foreach ($product->variants as $variant) {
            if ($variant->image) {
                Storage::disk('public')->delete($variant->image);
            }
        }

        $product->delete();
        return CommonHelper::responseSuccess('master_product_deleted_successfully');
    }

    public function changeStatus(Request $request)
    {
        $product = MasterProduct::find($request->id);
        if (!$product) {
            return CommonHelper::responseError('master_product_not_found');
        }
        $product->status = $request->status;
        $product->save();
        return CommonHelper::responseSuccess('status_updated_successfully');
    }

    /**
     * Lightweight catalog search used by seller app "Add from Catalog" picker.
     */
    public function catalogSearch(Request $request)
    {
        $q = trim((string) $request->input('q', ''));
        $limit = (int) $request->input('per_page', 20);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;

        $query = MasterProduct::with(['brand', 'parentCompany', 'variants' => function ($q2) {
            $q2->where('status', 1);
        }])
            ->where('status', 1)
            ->orderBy('name', 'ASC');

        if ($q !== '') {
            $query->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                    ->orWhere('hsn', 'like', "%{$q}%")
                    ->orWhereHas('brand', function ($b) use ($q) {
                        $b->where('name', 'like', "%{$q}%");
                    });
            });
        }

        foreach (['brand_id', 'category_id', 'parent_company_id'] as $f) {
            if ($request->filled($f)) {
                $query->where($f, $request->input($f));
            }
        }

        $total = $query->count();
        $rows = $query->skip($offset)->take($limit)->get();

        return CommonHelper::responseWithData($rows, $total);
    }

    private function storeImage($file, string $folder): string
    {
        $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
        return Storage::disk('public')->putFileAs($folder, $file, $fileName);
    }

    /**
     * Master product names live inside translations[] now, not at the top level.
     * Require a non-empty name in the default language; falls back to top-level
     * `name` for backward-compatible callers.
     */
    private function ensureDefaultLanguageName(Request $request): ?string
    {
        $translations = $this->decodeTranslations($request);
        $defaults = $this->extractDefaultsFromTranslations($request, $translations);
        $name = trim((string) ($defaults['name'] ?? ''));
        return $name === '' ? __('please_fill_product_name_in_default_language') : null;
    }

    /**
     * Accepts translations as either a JSON-encoded string or an array of
     * { language_id, name, description, meta_*, schema_markup } objects.
     * Matches the legacy /products/save shape used by ProductApisController.
     */
    private function decodeTranslations(Request $request): array
    {
        $raw = $request->input('translations', []);
        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            $raw = is_array($decoded) ? $decoded : [];
        }
        return is_array($raw) ? $raw : [];
    }

    /**
     * The base table (master_products) mirrors the default-language values
     * so callers without a language context still see something sensible.
     * Falls back to top-level request fields when no default-lang translation
     * is sent (e.g. single-language installs).
     */
    private function extractDefaultsFromTranslations(Request $request, array $translations): array
    {
        // Match the front-end's /active_languages filter so both ends resolve the
        // same "default language" id, otherwise the lookup picks a stale row.
        $defaultLang = Language::where('is_default', 1)
            ->where('status', 1)
            ->where('system_type', 4)
            ->first();
        $defaultLangId = $defaultLang ? (int) $defaultLang->id : null;

        $defaultTr = null;
        if ($defaultLangId) {
            foreach ($translations as $t) {
                if (isset($t['language_id']) && (int) $t['language_id'] === $defaultLangId) {
                    $defaultTr = $t;
                    break;
                }
            }
        }

        // Fallback: pick the first translation that has any non-empty field
        // (covers misconfigured is_default rows + users typing in a non-default tab).
        if (!$defaultTr) {
            foreach ($translations as $t) {
                if (!empty(trim((string) ($t['name'] ?? '')))) {
                    $defaultTr = $t;
                    break;
                }
            }
        }

        return [
            'name' => $defaultTr['name'] ?? $request->input('name'),
            'description' => $defaultTr['description'] ?? $request->input('description'),
            'meta_title' => $defaultTr['meta_title'] ?? $request->input('meta_title'),
            'meta_keywords' => $defaultTr['meta_keywords'] ?? $request->input('meta_keywords'),
            'schema_markup' => $defaultTr['schema_markup'] ?? $request->input('schema_markup'),
            'meta_description' => $defaultTr['meta_description'] ?? $request->input('meta_description'),
        ];
    }
}
