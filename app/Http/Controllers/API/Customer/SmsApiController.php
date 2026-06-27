<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Models\SmsVerification;
use App\Models\User;
use App\Models\Setting;
use Illuminate\Http\Request;
use App\Helpers\TwilioHelper;
use App\Helpers\CommonHelper;
use Illuminate\Support\Facades\Validator;
class SmsApiController extends Controller
    {
     
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|string',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Determine configured OTP provider
        $firebaseEnabled = (int) Setting::where('variable', 'firebase_authentication')->value('value');
        $otpEnabled      = (int) Setting::where('variable', 'phone_auth_otp')->value('value');

        if (!$otpEnabled) {
            return CommonHelper::responseError('otp_login_not_enabled');
        }

        // Firebase OTP is handled entirely on the client side
        if ($firebaseEnabled) {
            return CommonHelper::responseWithData(['otp_provider' => 'firebase']);
        }

        // Twilio flow — generate, send, store
        $otp         = rand(100000, 999999);
        $countryCode = ltrim($request->input('country_code', ''), '+');
        $phone       = '+' . $countryCode . $request->input('phone');
        $appName     = Setting::where('variable', 'app_name')->value('value');
        $message     = "$otp is your verification code from $appName";

        $success = TwilioHelper::sendSms($phone, $message);
        if (!$success) {
            return CommonHelper::responseError('sms_gateway_error');
        }

        $expiresAt = Carbon::now()->addMinutes(10);
        SmsVerification::insert([
            'phone'      => $phone,
            'otp'        => $otp,
            'status'     => 'pending',
            'expires_at' => $expiresAt,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        return CommonHelper::responseWithData(['otp_provider' => 'twilio']);
    }
    public function verifyContact(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'phone' => 'required|numeric',
            'otp' => 'required|string',
            'country_code' => 'required|string',
        ]);
        
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
    
        $phone = $request->input('country_code').$request->input('phone');
        $otp = $request->input('otp');
    
        // Retrieve the OTP record
        $otpRecord = SmsVerification::where('phone', $phone)
                ->latest('created_at') // Fetch the latest record based on created_at
                ->first();
    
        if ($otpRecord && $otpRecord->otp == $otp && $otpRecord->status == 'pending' && $otpRecord->expires_at > Carbon::now()) {
            $otpRecord->status = 'verified';
            $otpRecord->save();
            // Retrieve the user from the users table where mobile = phone and type = phone
            $phone =$request->input('phone');
            $user = User::where('mobile', $phone)->where('type', 'phone')->first();
            if ($user) {
                $accessToken = $user->createToken('authToken')->accessToken;
                $res = ['user' => $user, 'access_token' => $accessToken];
                return CommonHelper::responseSuccessWithData("OTP is valid! User found.", $res);
            } else {
                return CommonHelper::responseSuccess("otp_valid_but_user_not_found");
            }
        } else {
            return CommonHelper::responseError("OTP is invalid or has expired.");
        }
    }
   
}
