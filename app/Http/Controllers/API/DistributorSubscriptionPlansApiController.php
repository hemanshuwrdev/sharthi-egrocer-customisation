<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\DistributorSubscription;
use App\Models\DistributorSubscriptionPlan;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DistributorSubscriptionPlansApiController extends Controller
{
    public function getList()
    {
        $records = DistributorSubscriptionPlan::with('tax')->orderBy('id', 'DESC')->get();

        return CommonHelper::responseWithData(['records' => $records]);
    }

    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), $this->rules());
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $plan = DistributorSubscriptionPlan::create($this->payload($request));

        return CommonHelper::responseSuccessWithData(__('subscription_plan_created_successfully'), $plan);
    }

    public function update(Request $request, $id)
    {
        $plan = DistributorSubscriptionPlan::find($id);
        if (!$plan) {
            return CommonHelper::responseError('record_not_found');
        }

        $validator = Validator::make($request->all(), $this->rules());
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $plan->update($this->payload($request));

        return CommonHelper::responseSuccessWithData(__('subscription_plan_updated_successfully'), $plan);
    }

    public function updateStatus(Request $request, $id)
    {
        $plan = DistributorSubscriptionPlan::find($id);
        if (!$plan) {
            return CommonHelper::responseError('record_not_found');
        }

        $plan->status = (int) $request->status;
        $plan->save();

        return CommonHelper::responseSuccess(__('status_updated_successfully'));
    }

    public function delete($id)
    {
        $plan = DistributorSubscriptionPlan::find($id);
        if (!$plan) {
            return CommonHelper::responseError('record_not_found');
        }

        $plan->delete();

        return CommonHelper::responseSuccess(__('deleted_successfully'));
    }

    public function assign(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seller_id' => 'required|exists:sellers,id',
            'plan_id' => 'required|exists:distributor_subscription_plans,id',
            'start_date' => 'required|date',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $plan = DistributorSubscriptionPlan::find($request->plan_id);

        $endDate = null;
        if ($plan->duration_type === 'limited' && $plan->duration_days) {
            $endDate = \Carbon\Carbon::parse($request->start_date)->addDays($plan->duration_days)->toDateString();
        }

        DistributorSubscription::where('seller_id', $request->seller_id)
            ->where('status', 'active')
            ->update(['status' => 'cancelled']);

        $assignment = DistributorSubscription::create([
            'seller_id' => $request->seller_id,
            'plan_id' => $plan->id,
            'plan_name' => $plan->name,
            'start_date' => $request->start_date,
            'end_date' => $endDate,
            'status' => 'active',
            'assigned_by' => auth()->id(),
        ]);

        return CommonHelper::responseSuccessWithData(__('plan_assigned_successfully'), $assignment);
    }

    public function assignments()
    {
        $records = DistributorSubscription::with(['seller:id,name,store_name', 'plan:id,name'])
            ->orderBy('id', 'DESC')
            ->get();

        return CommonHelper::responseWithData(['records' => $records]);
    }

    public function cancelAssignment($id)
    {
        $assignment = DistributorSubscription::find($id);
        if (!$assignment) {
            return CommonHelper::responseError('record_not_found');
        }

        $assignment->status = 'cancelled';
        $assignment->save();

        return CommonHelper::responseSuccess(__('subscription_cancelled_successfully'));
    }

    public function sellersList()
    {
        $sellers = Seller::select('id', 'name', 'store_name')->orderBy('name')->get();

        return CommonHelper::responseWithData(['records' => $sellers]);
    }

    public function publishedList()
    {
        $records = DistributorSubscriptionPlan::with('tax')
            ->where('publish', 1)
            ->where('status', 1)
            ->orderBy('price', 'ASC')
            ->get();

        return CommonHelper::responseWithData(['records' => $records]);
    }

    public function myStatus()
    {
        $seller = auth()->user()->seller ?? null;
        if (!$seller) {
            return CommonHelper::responseError('record_not_found');
        }

        $trialDays = (int) (\App\Models\Setting::get_value('distributor_trial_days') ?: 0);
        $trialEndsAt = \Carbon\Carbon::parse($seller->created_at)->addDays($trialDays);

        $activeSubscription = DistributorSubscription::with('plan')
            ->where('seller_id', $seller->id)
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>=', now()->toDateString());
            })
            ->first();

        return CommonHelper::responseWithData([
            'trial_ends_at' => $trialEndsAt->toDateString(),
            'in_trial' => now()->lessThanOrEqualTo($trialEndsAt),
            'has_active_subscription' => (bool) $activeSubscription,
            'active_subscription' => $activeSubscription,
        ]);
    }

    private function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'duration_type' => 'required|in:limited,unlimited',
            'duration_days' => 'nullable|integer|min:1',
            'price' => 'required|numeric|min:0',
            'discounted_price' => 'nullable|numeric|min:0|lt:price',
            'tax_type' => 'required|in:inclusive,exclusive',
            'tax_id' => 'nullable|exists:taxes,id',
            'commission_percentage' => 'nullable|numeric|min:0|max:100',
            'publish' => 'nullable|boolean',
        ];
    }

    private function payload(Request $request)
    {
        return [
            'name' => $request->name,
            'description' => $request->description,
            'duration_type' => $request->duration_type,
            'duration_days' => $request->duration_type === 'limited' ? $request->duration_days : null,
            'price' => $request->price,
            'discounted_price' => $request->discounted_price,
            'tax_type' => $request->tax_type,
            'tax_id' => $request->tax_id,
            'booking_type' => 'unlimited',
            'booking_limit' => null,
            'commission_enabled' => $request->filled('commission_percentage') && $request->commission_percentage > 0,
            'commission_threshold' => null,
            'commission_percentage' => $request->commission_percentage,
            'publish' => (bool) $request->boolean('publish', true),
        ];
    }
}
