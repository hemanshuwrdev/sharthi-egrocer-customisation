<?php

namespace App\Http\Controllers\API;

use App\Services\LanguageService;
use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\Setting;
use App\Models\SubscriptionFaq;
use App\Models\Order;
use App\Models\TimeSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class SubscriptionPlansApiController extends Controller
{
    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }
    public function getPlans(Request $request)
    {
        try {
            $limit = $request->input('limit');
            $offset = $request->input('offset', 0);
            $search = $request->input('search');

            $query = SubscriptionPlan::with('translations');

            if ($search) {
                $query->where(function ($q) use ($search) {
                    if (is_numeric($search)) {
                        $q->where('id', $search)
                            ->orWhere('days', $search)
                            ->orWhere('price', $search)
                            ->orWhere('discounted_price', $search)
                            ->orWhere('free_delivery_above', $search);
                    } else {
                        $q->where('name', 'like', '%' . $search . '%');
                    }

                    if (strtolower($search) == 'active' || $search == '1') {
                        $q->orWhere('status', 1);
                    } elseif (strtolower($search) == 'deactive' || strtolower($search) == 'inactive' || $search == '0') {
                        $q->orWhere('status', 0);
                    }

                    $q->orWhere('name', 'like', '%' . $search . '%')
                        ->orWhereHas('translations', function ($query) use ($search) {
                            $query->where('name', 'like', '%' . $search . '%');
                        });
                });
            }

            $total = (clone $query)->count();

            if (isset($limit)) {
                $query->offset($offset)->limit($limit);
            }

            $plans = $query->orderBy('id', 'desc')->get();

            return CommonHelper::responseWithData($plans, $total);
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }

    public function checkFreeDeliveryTimeSlots()
    {
        try {
            $timeSlotsEnabled = Setting::get_value('time_slots_is_enabled');

            // If time slots are disabled, return 0 count
            if ($timeSlotsEnabled == "false") {
                return CommonHelper::responseWithData([
                    'has_free_delivery_time_slots' => false,
                    'count' => 0
                ]);
            }

            // If time slots are enabled, count free delivery time slots
            $freeDeliveryTimeSlots = TimeSlot::where('is_free_delivery', 1)
                ->where('status', 1)
                ->count();

            return CommonHelper::responseWithData([
                'has_free_delivery_time_slots' => $freeDeliveryTimeSlots > 0,
                'count' => $freeDeliveryTimeSlots
            ]);
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }

    public function save(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'days' => 'required|integer|min:1|unique:subscription_plans,days',
            'price' => 'required|numeric|min:0',
            'discounted_price' => 'nullable|numeric|min:0',
            'free_delivery_above' => 'nullable|numeric|min:0',
            'status' => 'required|in:0,1',
            'translations.*.language_id' => 'required|exists:languages,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {

            $defaultLanguage = app(LanguageService::class)->getDefaultLanguage();

            //  Default translation
            $defaultTranslation = collect($request->translations)
                ->firstWhere('language_id', $defaultLanguage->id);

            if (!$defaultTranslation) {
                return CommonHelper::responseError(__('default_language_required'));
            }

            $plan = new SubscriptionPlan();
            $plan->days = $request->days;
            $plan->price = $request->price;
            $plan->discounted_price = $request->discounted_price;
            $plan->free_delivery_above = $request->free_delivery_above;
            $plan->ios_product_id = $request->ios_product_id;
            $plan->status = $request->status;
            $plan->name = $defaultTranslation['name']; // 🔥 BASE FROM DEFAULT LANG
            $plan->save();

            foreach ($request->translations as $t) {
                $plan->saveTranslation($t['language_id'], [
                    'name' => $t['name']
                ]);
            }

            return CommonHelper::responseSuccessWithData(
                __('subscription_plan_created_successfully'),
                $plan
            );
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }

    public function update(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'days' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:0,1',
            'translations.*.language_id' => 'required|exists:languages,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $plan = SubscriptionPlan::findOrFail($id);

            $defaultLanguage = app(LanguageService::class)->getDefaultLanguage();

            $defaultTranslation = collect($request->translations)
                ->firstWhere('language_id', $defaultLanguage->id);

            if ($defaultTranslation) {
                $plan->name = $defaultTranslation['name'];
            }

            $plan->days = $request->days;
            $plan->price = $request->price;
            $plan->discounted_price = $request->discounted_price;
            $plan->free_delivery_above = $request->free_delivery_above;
            $plan->ios_product_id = $request->ios_product_id;
            $plan->status = $request->status;
            $plan->save();

            foreach ($request->translations as $t) {
                $plan->saveTranslation($t['language_id'], [
                    'name' => $t['name']
                ]);
            }

            return CommonHelper::responseSuccessWithData(
                __('subscription_plan_updated_successfully'),
                $plan
            );
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }

    public function delete($id)
    {
        try {
            $plan = SubscriptionPlan::find($id);
            if (!$plan) {
                return CommonHelper::responseError(__('subscription_plan_not_found'));
            }

            $activeSubscriptionsCount = UserSubscription::where('plan_id', $id)
                ->where('status', 'active')
                ->where('end_date', '>=', now()->toDateString())
                ->count();

            if ($activeSubscriptionsCount > 0) {
                return CommonHelper::responseError(__('cannot_delete_plan_with_active_subscriptions'));
            }

            $plan->delete();

            return CommonHelper::responseSuccess(__('subscription_plan_deleted_successfully'));
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }

    public function getPlan()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return CommonHelper::responseError(__('user_not_authenticated'));
            }

            $userSubscription = UserSubscription::where('user_id', $user->id)
                ->where('status', 'active')
                ->where('end_date', '>=', now()->toDateString())
                ->with('plan')
                ->orderBy('id', 'desc')
                ->first();

            if (!$userSubscription) {
                return CommonHelper::responseError(__('no_active_subscription_found'));
            }

            $totalMoneySaved = Order::where('subscription_id', $userSubscription->id)
                ->sum('delivery_save_amount');

            $endDate = Carbon::parse($userSubscription->end_date);
            $today = Carbon::now();
            $daysRemaining = $today->diffInDays($endDate, false);
            $deliveriesNumber = Order::where('subscription_id', $userSubscription->id)->count();
            if ($daysRemaining < 0) {
                $daysRemaining = 0;
            }

            $planNameToShow = $userSubscription->plan_name;
            $plan = $userSubscription->plan;
            if ($userSubscription->plan_id && $plan) {
                // Get the original (base-table) name without translation accessors.
                $currentBaseName = $plan->getRawOriginal('name');

                if (!empty($currentBaseName) && $currentBaseName === $userSubscription->plan_name) {
                    $planNameToShow = $plan->translated('name');
                }
            }

            $responseData = [
                'id' => $userSubscription->id,
                'user_id' => $userSubscription->user_id,
                'plan_id' => $userSubscription->plan_id,
                'plan_name' => $planNameToShow,
                'price_paid' => $userSubscription->price_paid,
                'discounted_price' => $userSubscription->discounted_price,
                'free_delivery_above' => $userSubscription->free_delivery_above,
                'start_date' => CommonHelper::formatDate($userSubscription->start_date),
                'end_date' => CommonHelper::formatDate($userSubscription->end_date),
                'status' => $userSubscription->status,
                'total_money_saved' => round($totalMoneySaved, 2),
                'days_remaining' => $daysRemaining,
                'deliveries_number' => $deliveriesNumber
            ];

            return CommonHelper::responseSuccessWithData(__('success'), $responseData);
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }

    public function updateSetting(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'subscription_name' => 'required|string|max:255'
            ]);

            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $setting = Setting::where('variable', 'subscription_name')->first();

            if ($setting) {
                $setting->value = $request->subscription_name;
                $setting->save();
            } else {
                $setting = new Setting();
                $setting->variable = 'subscription_name';
                $setting->value = $request->subscription_name;
                $setting->save();
            }

            return CommonHelper::responseSuccess(__('subscription_name_updated_successfully'));
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }

    public function getFaqs(Request $request)
    {
        try {
            $search = $request->input('search');
            $query = SubscriptionFaq::ordered()->with('translations');

            if ($search) {
                $query->where(function ($q) use ($search) {
                    if (is_numeric($search)) {
                        $q->where('id', $search);
                    }

                    if (strtolower($search) == 'active' || $search == '1') {
                        $q->orWhere('status', 1);
                    } elseif (strtolower($search) == 'deactive' || strtolower($search) == 'inactive' || $search == '0') {
                        $q->orWhere('status', 0);
                    }

                    $q->orWhere('question', 'like', '%' . $search . '%')
                        ->orWhere('answer', 'like', '%' . $search . '%')
                        ->orWhereHas('translations', function ($query) use ($search) {
                            $query->where('question', 'like', '%' . $search . '%')
                                ->orWhere('answer', 'like', '%' . $search . '%');
                        });
                });
            }

            $faqs = $query->get();

            return CommonHelper::responseWithData($faqs, $faqs->count());
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }
    public function saveFaq(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:0,1',
            'sort_order' => 'required|integer|unique:subscription_faqs,sort_order',
            'translations.*.language_id' => 'required|exists:languages,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {

            $defaultLanguage = app(LanguageService::class)->getDefaultLanguage();
            $defaultTranslation = collect($request->translations)
                ->firstWhere('language_id', $defaultLanguage->id);

            if (!$defaultTranslation) {
                return CommonHelper::responseError(__('default_language_required'));
            }

            $faq = new SubscriptionFaq();
            $faq->status = $request->status;
            $faq->sort_order = $request->sort_order ?? 0;
            $faq->question = $defaultTranslation['question']; // 🔥 FIX
            $faq->answer = $defaultTranslation['answer'];     // 🔥 FIX
            $faq->save();


            foreach ($request->translations as $t) {
                $faq->saveTranslation($t['language_id'], [
                    'question' => $t['question'],
                    'answer' => $t['answer'],
                ]);
            }
            return CommonHelper::responseSuccessWithData(__('subscription_faq_created_successfully'), $faq);
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }


    public function updateFaq(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:0,1',
            'sort_order' => 'required|integer|unique:subscription_faqs,sort_order,' . $id,
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $faq = SubscriptionFaq::findOrFail($id);

            $defaultLanguage = app(LanguageService::class)->getDefaultLanguage();

            $defaultTranslation = collect($request->translations)
                ->firstWhere('language_id', $defaultLanguage->id);

            if ($defaultTranslation) {
                $faq->question = $defaultTranslation['question'];
                $faq->answer = $defaultTranslation['answer'];
            }

            $faq->status = $request->status;
            $faq->sort_order = $request->sort_order ?? $faq->sort_order;
            $faq->save();

            foreach ($request->translations as $t) {
                $faq->saveTranslation($t['language_id'], [
                    'question' => $t['question'],
                    'answer' => $t['answer'],
                ]);
            }

            return CommonHelper::responseSuccessWithData(__('subscription_faq_updated_successfully'), $faq);
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('enter_valid_sort_order'));
        }
    }

    public function deleteFaq($id)
    {
        try {
            $faq = SubscriptionFaq::find($id);

            if (!$faq) {
                return CommonHelper::responseError(__('subscription_faq_not_found'));
            }

            $faq->delete();

            return CommonHelper::responseSuccess(__('subscription_faq_deleted_successfully'));
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function updateFaqsOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'faqs' => 'required|array',
            'faqs.*.id' => 'required|exists:subscription_faqs,id',
            'faqs.*.sort_order' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            foreach ($request->faqs as $faqData) {
                SubscriptionFaq::where('id', $faqData['id'])
                    ->update(['sort_order' => $faqData['sort_order']]);
            }

            return CommonHelper::responseSuccess(__('subscription_faqs_order_updated_successfully'));
        } catch (\Exception $e) {
            return CommonHelper::responseError(__('something_went_wrong'));
        }
    }
}
