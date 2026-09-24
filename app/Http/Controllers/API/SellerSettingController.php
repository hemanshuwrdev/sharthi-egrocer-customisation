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

    /**
     * Forgot-password recovery for the sensitive password: emails a 6-digit OTP
     * to the seller's registered address. Resetting with it (below) doesn't
     * require the old password, so this is the only way back in if it's lost.
     */
    public function sendSensitivePasswordOtp(Request $request)
    {
        $seller = auth()->user()->seller;

        if (empty($seller->email)) {
            return CommonHelper::responseError('no_email_on_file_contact_admin_to_recover_password');
        }

        // Sent less than 60s ago (more than 9 of the 10 minutes still left)? Block resend spam.
        // Not Carbon-cast on the model, so parse explicitly rather than relying on ->copy()/->gt().
        if ($seller->sensitive_otp_expires_at && now()->lt(\Carbon\Carbon::parse($seller->sensitive_otp_expires_at)->subMinutes(9))) {
            return CommonHelper::responseError('please_wait_before_requesting_another_code');
        }

        $otp = (string) random_int(100000, 999999);
        $seller->sensitive_otp = $otp;
        $seller->sensitive_otp_expires_at = now()->addMinutes(10);
        $seller->save();

        try {
            CommonHelper::sendMail($seller->email, 'Reset Sensitive Password', [
                'type' => 'sensitive_password_otp',
                'otp'  => $otp,
            ]);
        } catch (\Exception $e) {
            \Log::error('sendSensitivePasswordOtp mail failed: ' . $e->getMessage());
            return CommonHelper::responseError('failed_to_send_otp_email_check_mail_settings');
        }

        return CommonHelper::responseSuccess('otp_sent_to_your_registered_email');
    }

    public function resetSensitivePasswordWithOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'otp'                  => 'required|string',
            'new_password'         => 'required|string|min:6',
            'confirm_new_password' => 'required|string|same:new_password',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $seller = auth()->user()->seller;

        if (
            empty($seller->sensitive_otp) ||
            $seller->sensitive_otp !== $request->otp ||
            !$seller->sensitive_otp_expires_at ||
            now()->gt(\Carbon\Carbon::parse($seller->sensitive_otp_expires_at))
        ) {
            return CommonHelper::responseError('otp_is_invalid_or_expired');
        }

        $seller->sensitive_password = Hash::make($request->new_password);
        $seller->sensitive_otp = null;
        $seller->sensitive_otp_expires_at = null;
        $seller->save();

        return CommonHelper::responseSuccess('sensitive_password_changed_successfully');
    }
}
