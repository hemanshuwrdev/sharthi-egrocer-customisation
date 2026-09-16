<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\TaxCategory;
use App\Models\TaxRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaxCategoriesApiController extends Controller
{
    public function getTaxCategories(Request $request)
    {
        if ($request->filled('id')) {
            $category = TaxCategory::withCount('taxRules')->find($request->id);
            return CommonHelper::responseWithData($category);
        }

        $limit  = (int) $request->get('limit', 10);
        $offset = (int) $request->get('offset', 0);

        $query = TaxCategory::query()
            ->withCount('taxRules')
            ->orderBy('id', 'ASC');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $total = $query->count();

        if ($limit > 0) {
            $query->skip($offset)->take($limit);
        }

        $categories = $query->get()->map(function ($category) {
            $category->products_count = \App\Models\Product::where('tax_category_id', $category->id)->count();
            return $category;
        });

        return CommonHelper::responseWithData($categories, $total);
    }

    public function save(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'        => 'required|string|max:191',
                'code'        => 'required|string|max:191|unique:tax_categories,code',
                'description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $category = TaxCategory::create([
                'name'        => $request->name,
                'code'        => $request->code,
                'description' => $request->description,
                'status'      => 1,
            ]);

            return CommonHelper::responseSuccessWithData('tax_category_saved_successfully', $category);
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function update(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id'          => 'required|exists:tax_categories,id',
                'name'        => 'required|string|max:191',
                'code'        => 'required|string|max:191|unique:tax_categories,code,' . $request->id,
                'description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $category = TaxCategory::find($request->id);
            if (!$category) {
                return CommonHelper::responseError('tax_category_not_found');
            }

            $category->name        = $request->name;
            $category->code        = $request->code;
            $category->description = $request->description;

            if ($request->has('status')) {
                $category->status = $request->status;
            }

            $category->save();

            return CommonHelper::responseSuccessWithData('tax_category_updated_successfully', $category);
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function delete(Request $request)
    {
        try {
            $category = TaxCategory::find($request->id);

            if (!$category) {
                return CommonHelper::responseError('tax_category_not_found');
            }

            if (TaxRule::where('tax_category_id', $category->id)->exists()) {
                return CommonHelper::responseError('tax_category_in_use_by_tax_rule');
            }

            $category->delete();
            return CommonHelper::responseSuccess('tax_category_deleted_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }
}
