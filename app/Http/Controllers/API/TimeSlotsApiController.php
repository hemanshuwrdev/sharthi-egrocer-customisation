<?php

namespace App\Http\Controllers\API;
use App\Services\LanguageService;
use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\TimeSlot;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class TimeSlotsApiController extends Controller
{
    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }
  
    public function checkActiveSubscriptionPlans()
    {
        try {
            $activePlans = SubscriptionPlan::where('status', 1)->count();
            
            return CommonHelper::responseWithData([
                'has_active_subscription_plans' => $activePlans > 0,
                'count' => $activePlans
            ]);
        } catch (\Exception $e) {
            return CommonHelper::responseError('something_went_wrong');
        }
    }

    public function index()
    {
        $timeSlots = TimeSlot::with('translations')
            ->orderBy('id', 'desc')
            ->get();
    
        // Raw times as HH:mm for HTML <input type="time"> (Edit.vue). Table shows *_display via store time_format.
        $timeSlots = $timeSlots->map(function (TimeSlot $ts) {
            $row = $ts->toArray();

            foreach (['from_time', 'to_time', 'last_order_time'] as $field) {
                $raw = $ts->getRawOriginal($field) ?? $ts->getAttributes()[$field] ?? null;
                if ($raw instanceof \DateTimeInterface) {
                    $raw = $raw->format('H:i:s');
                }
                $rawStr = $raw !== null && $raw !== '' ? (string) $raw : '';
                if ($rawStr === '') {
                    continue;
                }
                try {
                    $parsed = Carbon::parse($rawStr);
                    // 24-hour string browsers accept for type="time"
                    $row[$field] = $parsed->format('H:i');
                    $formatted = CommonHelper::formatTime($rawStr);
                    $row[$field . '_display'] = $formatted !== '' ? $formatted : $row[$field];
                } catch (\Exception $e) {
                    $row[$field] = $rawStr;
                    $row[$field . '_display'] = $rawStr;
                }
            }

            return $row;
        });
    
        return CommonHelper::responseWithData($timeSlots);
    }

public function save(Request $request)
{
    $defaultLanguage = $this->languageService->getDefaultLanguage();
    $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

    // Base rules (always)
    $rules = [
        'language_id' => 'required|exists:languages,id',
        'title'       => 'required',
    ];

    // ONLY default language requires time fields
    if ($isDefaultLanguage) {
        $rules['from_time'] = 'required';
        $rules['to_time'] = 'required';
        $rules['last_order_time'] = 'required';
    }

    $validator = Validator::make($request->all(), $rules);
    if ($validator->fails()) {
        return CommonHelper::responseError($validator->errors()->first());
    }

    // Create base record ONLY ONCE (default language)
    if ($isDefaultLanguage) {
        $timeSlot = new TimeSlot();
        $timeSlot->title = $request->title; // fallback title
        $timeSlot->from_time = $request->from_time;
        $timeSlot->to_time = $request->to_time;
        $timeSlot->last_order_time = $request->last_order_time;
        $timeSlot->status = $request->status ?? 1;

        $timeSlot->is_free_delivery = $request->is_free_delivery ?? 0;
        $timeSlot->save();
    } else {
        // Find existing slot created by default language
        $timeSlot = TimeSlot::latest()->first();
    }

    // Save translation (ALL languages)
    $timeSlot->saveTranslation(
        $request->language_id,
        ['title' => $request->title]
    );

    return CommonHelper::responseWithData([
        'id' => $timeSlot->id,
        'message' => __('time_slot_saved_successfully')
    ]);
}

public function update(Request $request)
{
    $defaultLanguage = $this->languageService->getDefaultLanguage();
    $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

    $rules = [
        'id' => 'required|exists:time_slots,id',
        'language_id' => 'required|exists:languages,id',
        'title' => 'required',
    ];

    if ($isDefaultLanguage) {
        $rules['from_time'] = 'required';
        $rules['to_time'] = 'required';
        $rules['last_order_time'] = 'required';
    }

    $validator = Validator::make($request->all(), $rules);
    if ($validator->fails()) {
        return CommonHelper::responseError($validator->errors()->first());
    }

    $timeSlot = TimeSlot::find($request->id);
    if (!$timeSlot) {
        return CommonHelper::responseError('time_slot_not_found') ;
    }

    // Update base table ONLY for default language
    if ($isDefaultLanguage) {
        $timeSlot->title = $request->title;
        $timeSlot->from_time = $request->from_time;
        $timeSlot->to_time = $request->to_time;
        $timeSlot->last_order_time = $request->last_order_time;
        $timeSlot->status = $request->status ?? $timeSlot->status;
        $timeSlot->is_free_delivery = $request->is_free_delivery ?? $timeSlot->is_free_delivery;
        $timeSlot->save();
    }

    // Save translation
    $timeSlot->saveTranslation(
        $request->language_id,
        ['title' => $request->title]
    );

    return CommonHelper::responseSuccess('time_slot_updated_successfully');
}

    public function delete(Request $request)
    {

        if (isset($request->id)) {

            $time_slots = TimeSlot::find($request->id);
            if ($time_slots) {
                $time_slots->delete();
                return CommonHelper::responseSuccess('time_slot_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess("Time Slot Already Deleted!");
            }
        }
    }

    public function getTimeSlotsSettings(){
        $timeSlot_settingsArray = array(
            "time_slot_setting" => Setting::get_value('time_slot_setting'),
            "time_slots_is_enabled" => false,
            "time_slots_allowed_days" => "",
            "delivery_estimate_days" => "",
        );
        $variables = array_keys($timeSlot_settingsArray);
        $timeSlot_settings = Setting::whereIn('variable',$variables )->get();
        $data = array(
            "timeSlot_settingsObject" => $timeSlot_settingsArray,
            "timeSlot_settings" => $timeSlot_settings
        );
        return CommonHelper::responseWithData($data);

    }

    public function saveTimeSlotsSettings(Request  $request)
    {
        $validator = Validator::make($request->all(),[
        
            'time_slots_allowed_days' => 'required',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        try {
            foreach ($request->all() as $key => $value) {
                $setting = Setting::where('variable', $key)->first();
    
                if (empty($setting)) {
                    $setting = new Setting();
                }
    
                $setting->variable = $key;
                $setting->value = $value;
                $setting->save();
            }
    
            return CommonHelper::responseSuccess("TimeSlots Settings Saved Successfully!");
        } catch (\Exception $e) {
            
    
            return CommonHelper::responseError("Failed to save TimeSlots Settings. Please try again later.");
        }
    }
}
