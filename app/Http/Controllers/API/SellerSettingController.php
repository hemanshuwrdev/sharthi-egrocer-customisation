<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SellerSettingController extends Controller
{

    public function getThermalSettings()
    {
        $seller = auth()->user()->seller;

        return CommonHelper::responseWithData([
            'invoice_logo' => $seller->invoice_logo,
            'thermal_paper_width' => $seller->thermal_paper_width
        ]);
    }

    public function saveThermalSettings(Request $request)
    {
        try {
            $seller = auth()->user()->seller;

            if ($request->hasFile('invoice_logo')) {
                $path = $request->file('invoice_logo')->store('thermal_logo', 'public');

                $seller->invoice_logo = $path;
            }

            if ($request->has('thermal_paper_width')) {
                $seller->thermal_paper_width = $request->thermal_paper_width;
            }

            $seller->save();

            return CommonHelper::responseSuccess('thermal_print_settings_saved_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError('something_went_wrong');
        }
    }

    public function getOrderSettings()
    {
        $seller = auth()->user()->seller;
        return CommonHelper::responseWithData([
            'order_cutoff_time' => $seller->order_cutoff_time,
            'min_order_amount' => $seller->min_order_amount,
            // Driver's delivery-confirmation OTP — not the login OTP.
            'delivery_otp_enabled' => (bool) ($seller->delivery_otp_enabled ?? true),
        ]);
    }

    public function saveOrderSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_cutoff_time' => ['nullable', 'regex:/^\d{1,2}:\d{2}$/'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'delivery_otp_enabled' => ['nullable', 'boolean'],
        ], [
            'order_cutoff_time.regex' => 'Cutoff time must be in HH:MM 24-hour format.',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $seller = auth()->user()->seller;
            $seller->order_cutoff_time = $request->order_cutoff_time ?: null;
            $seller->min_order_amount = $request->min_order_amount !== null && $request->min_order_amount !== '' ? $request->min_order_amount : null;
            $seller->delivery_otp_enabled = $request->has('delivery_otp_enabled') ? (bool) $request->delivery_otp_enabled : true;
            $seller->save();
            return CommonHelper::responseSuccess('order_settings_saved_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    /**
     * Invoice numbering: {prefix}{number}{suffix}. Prefix/suffix are optional; number
     * is the next value this distributor's order invoices will be assigned (loading
     * slips run on their own independent counter, sharing only the prefix/suffix style).
     */
    public function getInvoiceSettings()
    {
        $seller = auth()->user()->seller;
        return CommonHelper::responseWithData([
            'invoice_prefix' => $seller->invoice_prefix,
            'invoice_suffix' => $seller->invoice_suffix,
            'invoice_next_number' => $seller->invoice_next_number,
        ]);
    }

    public function saveInvoiceSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'invoice_prefix' => 'nullable|string|max:20',
            'invoice_suffix' => 'nullable|string|max:20',
            'invoice_next_number' => 'required|integer|min:1',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $seller = auth()->user()->seller;
            $seller->invoice_prefix = $request->invoice_prefix ?: null;
            $seller->invoice_suffix = $request->invoice_suffix ?: null;
            $seller->invoice_next_number = $request->invoice_next_number;
            $seller->save();
            return CommonHelper::responseSuccess('invoice_settings_saved_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    /**
     * Sensitive-operations password: a second password (distinct from the login
     * password) that gates risky corrections like editing a driver's recorded
     * payment method. Only the seller who already knows it can rotate it, so
     * staff with panel login access but not this password can't take it over.
     */
    public function getSensitivePasswordStatus()
    {
        $seller = auth()->user()->seller;
        return CommonHelper::responseWithData([
            'is_set' => !empty($seller->sensitive_password),
        ]);
    }

    public function saveSensitivePassword(Request $request)
    {
        $seller = auth()->user()->seller;
        $isSet  = !empty($seller->sensitive_password);

        if (!$isSet) {
            $validator = Validator::make($request->all(), [
                'password'         => 'required|string|min:6',
                'confirm_password' => 'required|string|same:password',
            ]);
            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $seller->sensitive_password = Hash::make($request->password);
            $seller->save();
            return CommonHelper::responseSuccess('sensitive_password_set_successfully');
        }

        $validator = Validator::make($request->all(), [
            'old_password'          => 'required|string',
            'new_password'          => 'required|string|min:6',
            'confirm_new_password'  => 'required|string|same:new_password',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if (!Hash::check($request->old_password, $seller->sensitive_password)) {
            return CommonHelper::responseError('old_password_is_incorrect');
        }

        $seller->sensitive_password = Hash::make($request->new_password);
        $seller->save();
        return CommonHelper::responseSuccess('sensitive_password_changed_successfully');
    }
}
