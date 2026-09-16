<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Country;
use App\Models\TaxCategory;
use App\Models\TaxRule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaxRulesApiController extends Controller
{
    public function getTaxRules(Request $request)
    {
        if ($request->filled('id')) {
            $rule = TaxRule::with(['country', 'tax_category'])->find($request->id);
            return CommonHelper::responseWithData($rule);
        }

        $limit  = (int) $request->get('limit', 10);
        $offset = (int) $request->get('offset', 0);

        $query = TaxRule::with(['country', 'tax_category'])->orderBy('id', 'ASC');

        if ($request->filled('country_id')) {
            $query->where('country_id', $request->country_id);
        }

        if ($request->filled('tax_category_id')) {
            $query->where('tax_category_id', $request->tax_category_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('tax_category', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            })->orWhereHas('country', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $total = $query->count();

        if ($limit > 0) {
            $query->skip($offset)->take($limit);
        }

        $rules = $query->get();

        return response()->json([
            'status'   => 1,
            'message'  => __('success'),
            'total'    => $total,
            'data'     => $rules,
            'warnings' => $this->buildWarnings(),
        ]);
    }

    /**
     * Countries that already have at least one tax rule but leave some category
     * uncovered (a rule with tax_category_id = null covers every category).
     * There's no store<->country link in this app, so "active store" can't be
     * computed; a country with zero rules is just unconfigured, not a gap.
     */
    protected function buildWarnings()
    {
        $categories = TaxCategory::where('status', 1)->get(['id', 'name']);

        if ($categories->isEmpty()) {
            return [];
        }

        $rules = TaxRule::where('status', 1)->get(['country_id', 'tax_category_id']);
        $countryIds = $rules->pluck('country_id')->unique()->values();

        if ($countryIds->isEmpty()) {
            return [];
        }

        $countries = Country::whereIn('id', $countryIds)->get(['id', 'name']);

        $warnings = [];

        foreach ($countries as $country) {
            $countryRules = $rules->where('country_id', $country->id);

            if ($countryRules->contains('tax_category_id', null)) {
                continue;
            }

            $coveredCategoryIds = $countryRules->pluck('tax_category_id')->filter()->all();

            $missingCategories = $categories->reject(function ($category) use ($coveredCategoryIds) {
                return in_array($category->id, $coveredCategoryIds);
            })->pluck('name')->values()->all();

            if (!empty($missingCategories)) {
                $warnings[] = [
                    'country_id'   => $country->id,
                    'country_name' => $country->name,
                    'categories'   => $missingCategories,
                ];
            }
        }

        return $warnings;
    }

    public function save(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'country_id'       => 'required|exists:countries,id',
                'tax_category_id'  => 'nullable|exists:tax_categories,id',
                'place_of_supply'  => 'required|in:any,same_region,different_region',
                'components'       => 'required|array|min:1',
                'components.*.name'       => 'required|string|max:50',
                'components.*.percentage' => 'required|numeric|min:0|max:100',
            ]);

            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $rule = TaxRule::create([
                'country_id'       => $request->country_id,
                'tax_category_id'  => $request->tax_category_id ?: null,
                'place_of_supply'  => $request->place_of_supply,
                'components'       => $request->components,
                'total_rate'       => collect($request->components)->sum('percentage'),
                'status'           => 1,
            ]);

            return CommonHelper::responseSuccessWithData('tax_rule_saved_successfully', $rule->load(['country', 'tax_category']));
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function update(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'id'               => 'required|exists:tax_rules,id',
                'country_id'       => 'required|exists:countries,id',
                'tax_category_id'  => 'nullable|exists:tax_categories,id',
                'place_of_supply'  => 'required|in:any,same_region,different_region',
                'components'       => 'required|array|min:1',
                'components.*.name'       => 'required|string|max:50',
                'components.*.percentage' => 'required|numeric|min:0|max:100',
            ]);

            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $rule = TaxRule::find($request->id);
            if (!$rule) {
                return CommonHelper::responseError('tax_rule_not_found');
            }

            $rule->country_id      = $request->country_id;
            $rule->tax_category_id = $request->tax_category_id ?: null;
            $rule->place_of_supply = $request->place_of_supply;
            $rule->components      = $request->components;
            $rule->total_rate      = collect($request->components)->sum('percentage');

            if ($request->has('status')) {
                $rule->status = $request->status;
            }

            $rule->save();

            return CommonHelper::responseSuccessWithData('tax_rule_updated_successfully', $rule->load(['country', 'tax_category']));
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function delete(Request $request)
    {
        try {
            $rule = TaxRule::find($request->id);

            if (!$rule) {
                return CommonHelper::responseError('tax_rule_not_found');
            }

            $rule->delete();
            return CommonHelper::responseSuccess('tax_rule_deleted_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }
}
