<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\BrandDistributorMapping;
use App\Models\BrandLine;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class BrandLineApiController extends Controller
{
    /**
     * List every line of a brand, with how many master products and mappings use it
     * (used by the Manage Lines modal and to decide whether delete should be blocked).
     */
    public function forBrand(Request $request, $brandId)
    {
        $brand = Brand::find($brandId);
        if (!$brand) {
            return CommonHelper::responseError('brand_not_found');
        }

        $lines = BrandLine::where('brand_id', $brandId)
            ->withCount(['products', 'mappings'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return CommonHelper::responseWithData($lines);
    }

    public function store(Request $request, $brandId)
    {
        $brand = Brand::find($brandId);
        if (!$brand) {
            return CommonHelper::responseError('brand_not_found');
        }

        $validator = Validator::make(array_merge($request->all(), ['brand_id' => $brandId]), [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('brand_lines')->where(fn($q) => $q->where('brand_id', $brandId)),
            ],
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $maxOrder = (int) BrandLine::where('brand_id', $brandId)->max('sort_order');

        $line = BrandLine::create([
            'brand_id' => $brandId,
            'name' => trim($request->name),
            'status' => 1,
            'sort_order' => $maxOrder + 1,
        ]);

        return CommonHelper::responseWithData([
            'id' => $line->id,
            'message' => __('brand_line_saved_successfully'),
        ]);
    }

    public function update(Request $request, $id)
    {
        $line = BrandLine::find($id);
        if (!$line) {
            return CommonHelper::responseError('brand_line_not_found');
        }

        $validator = Validator::make($request->all(), [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('brand_lines')->where(fn($q) => $q->where('brand_id', $line->brand_id))->ignore($line->id),
            ],
            'status' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
            'is_overlap_allowed' => 'sometimes|boolean',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if ($request->has('is_overlap_allowed')) {
            $turningOff = !$request->is_overlap_allowed && $line->is_overlap_allowed;
            if ($turningOff) {
                $conflicts = $this->findLineOverlapConflicts($line);
                if ($conflicts->isNotEmpty()) {
                    return CommonHelper::responseError(
                        __('cannot_disable_line_overlap_conflicts_exist') . ' ' . $conflicts->implode(' | ')
                    );
                }
            }
            $line->is_overlap_allowed = $request->is_overlap_allowed;
        }

        if ($request->filled('name')) {
            $line->name = trim($request->name);
        }
        if ($request->has('status')) {
            $line->status = $request->status;
        }
        if ($request->has('sort_order')) {
            $line->sort_order = $request->sort_order;
        }
        $line->save();

        return CommonHelper::responseSuccess('brand_line_updated_successfully');
    }

    public function destroy(Request $request, $id)
    {
        $line = BrandLine::withCount(['products', 'mappings'])->find($id);
        if (!$line) {
            return CommonHelper::responseError('brand_line_not_found');
        }

        if ($line->products_count > 0 || $line->mappings_count > 0) {
            return CommonHelper::responseError(__('brand_line_in_use_deactivate_instead'));
        }

        $line->delete();
        return CommonHelper::responseSuccess('brand_line_deleted_successfully');
    }

    /**
     * Scan mappings that reference this line (either specifically, or "All Lines") for
     * cities where two DIFFERENT distributors would conflict once this line's own overlap
     * override is turned off. "All Lines" vs "All Lines" pairs are skipped — that conflict
     * is unconditional and unrelated to this line, so it should already be impossible for a
     * brand that doesn't allow overlap.
     */
    private function findLineOverlapConflicts(BrandLine $line)
    {
        $rows = BrandDistributorMapping::where('brand_id', $line->brand_id)
            ->where(function ($q) use ($line) {
                $q->whereNull('brand_line_id')->orWhere('brand_line_id', $line->id);
            })
            ->with(['city:id,name', 'distributor:id,store_name'])
            ->get()
            ->groupBy('city_id');

        $conflicts = collect();

        foreach ($rows as $cityId => $cityRows) {
            $cityRows = $cityRows->values();
            for ($i = 0; $i < $cityRows->count(); $i++) {
                for ($j = $i + 1; $j < $cityRows->count(); $j++) {
                    $a = $cityRows[$i];
                    $b = $cityRows[$j];
                    if ($a->seller_id === $b->seller_id) {
                        continue;
                    }
                    if (is_null($a->brand_line_id) && is_null($b->brand_line_id)) {
                        continue;
                    }
                    $cityName = $a->city->name ?? $cityId;
                    $conflicts->push(
                        "{$cityName}: {$a->distributor->store_name} vs {$b->distributor->store_name}"
                    );
                }
            }
        }

        return $conflicts->unique()->values();
    }
}
