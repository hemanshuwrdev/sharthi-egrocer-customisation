<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
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
        $product = MasterProduct::with(['parentCompany', 'brand', 'category', 'variants.unit', 'variants.secondaryUnit'])
            ->find($id);
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
            'name' => 'required|string|max:255',
            'brand_id' => 'nullable|exists:brands,id',
            'parent_company_id' => 'nullable|exists:parent_companies,id',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'image' => 'nullable|image',
            'type' => 'nullable|in:single,variable',
            'variants' => 'required|array|min:1',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.unit_id' => 'nullable|exists:units,id',
            'variants.*.secondary_unit_id' => 'nullable|exists:units,id',
            'variants.*.secondary_unit_value' => 'nullable|numeric|min:0',
            'variants.*.weight' => 'nullable|numeric|min:0',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $productId = DB::transaction(function () use ($request) {
                $product = new MasterProduct();
                $product->name = $request->name;
                $product->slug = Str::slug($request->name) . '-' . substr(uniqid(), -5);
                $product->parent_company_id = $request->parent_company_id;
                $product->brand_id = $request->brand_id;
                $product->category_id = $request->category_id;
                $product->tax_id = $request->tax_id;
                $product->hsn = $request->hsn;
                $product->short_description = $request->short_description;
                $product->description = $request->description;
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

                foreach ((array) $request->input('variants', []) as $idx => $v) {
                    $variant = new MasterProductVariant();
                    $variant->master_product_id = $product->id;
                    $variant->sku = $v['sku'] ?? null;
                    $variant->unit_id = $v['unit_id'] ?? null;
                    $variant->secondary_unit_id = $v['secondary_unit_id'] ?? null;
                    $variant->secondary_unit_value = $v['secondary_unit_value'] ?? null;
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
            'name' => 'required|string|max:255',
            'brand_id' => 'nullable|exists:brands,id',
            'parent_company_id' => 'nullable|exists:parent_companies,id',
            'category_id' => 'nullable|exists:categories,id',
            'tax_id' => 'nullable|exists:taxes,id',
            'image' => 'nullable|image',
            'type' => 'nullable|in:single,variable',
            'variants' => 'required|array|min:1',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.unit_id' => 'nullable|exists:units,id',
            'variants.*.secondary_unit_id' => 'nullable|exists:units,id',
            'variants.*.secondary_unit_value' => 'nullable|numeric|min:0',
            'variants.*.weight' => 'nullable|numeric|min:0',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            DB::transaction(function () use ($request) {
                $product = MasterProduct::find($request->id);
                $product->name = $request->name;
                $product->parent_company_id = $request->parent_company_id;
                $product->brand_id = $request->brand_id;
                $product->category_id = $request->category_id;
                $product->tax_id = $request->tax_id;
                $product->hsn = $request->hsn;
                $product->short_description = $request->short_description;
                $product->description = $request->description;
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
                if ($request->hasFile('other_images')) {
                    $paths = $product->other_images ?: [];
                    foreach ((array) $request->file('other_images') as $file) {
                        $paths[] = $this->storeImage($file, 'master_products');
                    }
                    $product->other_images = $paths;
                }

                $product->save();

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
}
