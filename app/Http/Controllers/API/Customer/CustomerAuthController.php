<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\MailSetting;
use App\Models\Setting;
use App\Models\UserToken;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\OrderStatusList;
use Illuminate\Support\Facades\Response;
use Illuminate\Validation\Rule;

class CustomerAuthController extends Controller
{
    
    private function normalizeCountryCode($code): string
    {
        $default = Setting::where('variable', 'country_code')->value('value') ?? '+91';
        // Ensure default itself is normalized
        if ($default && !str_starts_with($default, '+')) {
            $default = '+' . ltrim(preg_replace('/\D/', '', $default), '0');
        }

        if (!$code) {
            return $default;
        }

        $digits = preg_replace('/\D/', '', (string) $code);

        if (!$digits) {
            return $default;
        }

        return '+' . ltrim($digits, '0');
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type'    => 'required|in:phone,google,apple,email',
            'id'      => 'required', // mobile for phone, email for google/apple/email
            'country_code' => 'required_if:type,phone|nullable|string',
            'phone_auth_type' => 'required_if:type,phone|in:phone_auth_otp,phone_auth_password',
            'password' => [
                'required_if:type,email',
            ],
        ], [
            'password.min' => 'invalid_password',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        if ($request->type == 'phone') {
            $loginCountryCode = $this->normalizeCountryCode($request->input('country_code'));
            // Find user by mobile+country_code regardless of registration type
            $user = User::where('mobile', $request->id)
                ->where('country_code', $loginCountryCode)
                ->where('type', $request->type)
                ->where('status', 0)
                ->first();
            if ($user) {
                return CommonHelper::responseSuccess('user_deactivated');
            }
            $user = User::where('mobile', $request->id)
                ->where('country_code', $loginCountryCode)
                ->where('type', $request->type)
                ->first();

            if (!$user) {
                return CommonHelper::responseError('user_not_exist');
            }

            if ($request->phone_auth_type == 'phone_auth_password') {
                if (empty($user->password)) {
                    return CommonHelper::responseError('user_exist_password_blank');
                }
            }
            Auth::login($user);
            if (
                ($request->type == 'email' || ($request->type == 'phone' && $request->phone_auth_type == 'phone_auth_password'))
            ) {
                if (empty($user->password) || !password_verify($request->password, $user->password)) {
                    return CommonHelper::responseError(__('invalid_password'));
                }
            }
            $accessToken = $user->createToken('authToken')->accessToken;
            $user->referral_code = $user->referral_code ?? "";
            $user->status = intval($user->status) ?? 0;
            $res = ['user' => $user, 'access_token' => $accessToken];
            // **Update or create FCM token - match by user_id + fcm_token**
            if (isset($request->fcm_token)) {
                UserToken::updateOrCreate(
                    ['user_id' => auth()->user()->id, 'fcm_token' => $request->fcm_token],
                    ['type' => 'customer', 'platform' => $request->platform ?? 'android', 'language_id' => $request->input('language_id') ?: CommonHelper::getDefaultLanguageId()]
                );
            }

            $user_type = 0;
            $existingMailSettings = CommonHelper::getMailSetting($user_type, $user->id);
            
            $allStatusIds = OrderStatusList::get()->pluck('id')->toArray();
            
            if ($existingMailSettings->isEmpty()) {
                CommonHelper::setDefaultMailSetting($user->id, $user_type);
            } else {
                $existingStatusIds = $existingMailSettings->pluck('order_status_id')->toArray();
                $missingStatusIds = array_diff($allStatusIds, $existingStatusIds);
                
                if (!empty($missingStatusIds)) {
                    $mail_statuses = array_fill(0, count($missingStatusIds), 1);
                    $mobile_statuses = $mail_statuses;
                    $sms_statuses = array_fill(0, count($missingStatusIds), 1);
                    CommonHelper::saveMailSetting($user->id, $user_type, array_values($missingStatusIds), $mail_statuses, $mobile_statuses, $sms_statuses);
                }
            }

            return CommonHelper::responseSuccessWithData('user_already_exist', $res);
        }

        if ($request->type === 'email') {
            $existingUserWithDifferentType = User::where('email', $request->id)
                ->where('type', '!=', $request->type)
                ->first();

            if ($existingUserWithDifferentType) {
                return CommonHelper::responseError('user_exist_with_' . $existingUserWithDifferentType->type);
            }

            $user =  User::where('email', $request->id)
                ->where('type', $request->type)
                ->where('status', 0)
                ->first();
            if ($user) {
                return CommonHelper::responseSuccess('user_deactivated');
            }
            $user = User::where('email', $request->id)
                ->where('is_verified', 0)
                ->where('type', $request->type)
                ->first();

            if ($user) {
                $verificationCode = rand(100000, 999999);
                $user->email_verification_code = $verificationCode;
                $user->is_verified = false; // Initially not verified

                try {
                    $data = ['type' => 'verify_email', 'code' => $verificationCode];
                    $subject = 'Mail from ' . env('APP_NAME');

                    commonHelper::sendMail($user->email, $subject, $data);
                    Log::info('Verification email sent to ' . $user->email);

                    $user->save();
                } catch (\Exception $e) {
                    Log::error('Failed to send verification email: ' . $e->getMessage());
                    return CommonHelper::responseError('Failed to send verification email.');
                }

                return CommonHelper::responseError('email_not_verified');
            }
        }

        if (in_array($request->type, ['google', 'apple'])) {

            $user =  User::where('email', $request->id)
                ->where('type', $request->type)
                ->where('status', 0)
                ->first();
            if ($user) {
                return CommonHelper::responseSuccess('user_deactivated');
            }
            $user = User::where('email', $request->id)->first();

            if ($user) {
                if (strtolower($user->type) !== strtolower($request->type)) {
                    Auth::login($user);
                    return CommonHelper::responseError('user_exist_with_' . $user->type);
                }
            }
        }

        if ($request->type === 'phone') {
            $loginCountryCode = $this->normalizeCountryCode($request->input('country_code'));
            $user = User::select('id', 'name', 'email', 'country_code', 'mobile', 'profile', 'balance', 'referral_code', 'status', 'type', 'password')
                ->where('type', $request->type)
                ->where('mobile', $request->id)
                ->where('country_code', $loginCountryCode)
                ->first();
        } elseif (in_array($request->type, ['google', 'apple'])) {
            $user = User::select('id', 'name', 'email', 'country_code', 'mobile', 'profile', 'balance', 'referral_code', 'status', 'type')
                ->where('type', $request->type)
                ->where('email', $request->id)
                ->first();
        } elseif ($request->type === 'email') {
            $user = User::select('id', 'name', 'email', 'password', 'country_code', 'mobile', 'profile', 'balance', 'referral_code', 'status', 'type')
                ->where('type', $request->type)
                ->where('email', $request->id)
                ->where('is_verified', 1)
                ->first();
        }

        if ($user) {
            // **For email login and phone login with password**
            if (
                ($request->type == 'email' || ($request->type == 'phone' && $request->phone_auth_type == 'phone_auth_password'))
            ) {
                if (empty($user->password) || !password_verify($request->password, $user->password)) {
                    return CommonHelper::responseError(__('invalid_password'));
                }
            }

            // **Check if the user is inactive**
            if ($user->status == User::$deactive) {
                return CommonHelper::responseError(__('this_customer_account_is_deactivated_kindly_contact_admin'));
            }

            // **Login user and create access token**
            Auth::login($user);
            $accessToken = $user->createToken('authToken')->accessToken;
            $user->referral_code = $user->referral_code ?? "";
            $user->status = intval($user->status) ?? 0;
            $res = ['user' => $user, 'access_token' => $accessToken];

            // **Update or create FCM token - match by user_id + fcm_token**
            if (isset($request->fcm_token)) {
                UserToken::updateOrCreate(
                    ['user_id' => auth()->user()->id, 'fcm_token' => $request->fcm_token],
                    ['type' => 'customer', 'platform' => $request->platform ?? 'android', 'language_id' => $request->input('language_id') ?: CommonHelper::getDefaultLanguageId()]
                );
            }

            $user_type = 0;
            $existingMailSettings = CommonHelper::getMailSetting($user_type, $user->id);
            
            $allStatusIds = OrderStatusList::get()->pluck('id')->toArray();
            
            if ($existingMailSettings->isEmpty()) {
                CommonHelper::setDefaultMailSetting($user->id, $user_type);
            } else {
                $existingStatusIds = $existingMailSettings->pluck('order_status_id')->toArray();
                $missingStatusIds = array_diff($allStatusIds, $existingStatusIds);
                
                if (!empty($missingStatusIds)) {
                    $mail_statuses = array_fill(0, count($missingStatusIds), 1);
                    $mobile_statuses = $mail_statuses;
                    $sms_statuses = array_fill(0, count($missingStatusIds), 1);
                    CommonHelper::saveMailSetting($user->id, $user_type, array_values($missingStatusIds), $mail_statuses, $mobile_statuses, $sms_statuses);
                }
            }

            return CommonHelper::responseWithData($res);
        } else {
            return CommonHelper::responseError(__('user_does_not_exist'));
        }
    }

    public function register(Request $request)
    {
        $requestData = $request->all();

        $registerCountryCode = $this->normalizeCountryCode($request->input('country_code'));
        $mobileRules = ['required_if:type,phone', 'nullable', 'numeric'];
        // Enforce mobile uniqueness across ALL types (not just same type)
        if ($request->type === 'phone') {
            $mobileRules[] = Rule::unique('users', 'mobile')
                ->where(function ($query) use ($registerCountryCode) {
                    $query->where('country_code', $registerCountryCode);
                })
                ->whereNull('deleted_at');
        }

        $validator = Validator::make($requestData, [
            'type'            => 'required|in:phone,apple,google,email',
            'country_code'    => 'required_if:type,phone|nullable|string',
            'mobile'          => $mobileRules,
            'email'           => 'required_if:type,apple,google,email|email',
            'phone_auth_type' => 'nullable|in:phone_auth_otp,phone_auth_password',
            'password'        => [
                'nullable',
                'min:6',
                function ($attribute, $value, $fail) use ($request) {
                    if (
                        ($request->type == 'phone' && $request->phone_auth_type == 'phone_auth_password') ||
                        $request->type == 'email'
                    ) {
                        if (empty($value)) {
                            $fail('The password field is required.');
                        }
                    }
                }
            ],
        ], [
            'mobile.unique' => 'mobile_number_already_taken',
            'email.unique' => 'email_already_taken',
        ]);


        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            // Check mobile+country_code uniqueness across ALL types
            if ($request->type == 'phone') {
                $user = User::where('mobile', $request->mobile)
                    ->where('country_code', $registerCountryCode)
                    ->where('type', $request->type)
                    ->first();
                if ($user) {
                    return CommonHelper::responseError('user_already_exist');
                }
            }

            // Check email uniqueness across ALL types
            if (in_array($request->type, ['email'])) {
                $user = User::where('email', $request->email)
                    ->where('is_verified', 0)
                    ->where('type', $request->type)
                    ->first();

                if ($user) {
                    return CommonHelper::responseError('email_not_verified');
                }
            }

            if (in_array($request->type, ['google', 'apple', 'email'])) {
                $user = User::where('email', $request->email)->first();

                if ($user) {
                    return CommonHelper::responseError('user_exist_with_' . $user->type);
                }
            }

            // Also check if email is already used when registering via phone
            if ($request->type == 'phone' && $request->filled('email')) {
                $existingEmailUser = User::where('email', $request->email)->first();
                if ($existingEmailUser) {
                    return CommonHelper::responseError('user_exist_with_' . $existingEmailUser->type);
                }
            }

            if ($request->type == 'phone') {
                $user = User::where('type', $request->type)
                    ->where('mobile', $request->mobile)
                    ->where('country_code', $registerCountryCode)
                    ->where('is_verified', 1)
                    ->first();
            } elseif (in_array($request->type, ['google', 'apple', 'email'])) {
                $user = User::where('type', $request->type)
                    ->where('email', $request->email)
                    ->first();
            }

            $needsEmailVerificationReturn = false;
            if ($user) {
                if ($user->status == User::$deactive) {
                    return CommonHelper::responseError(__('this_customer_account_is_deactivated_kindly_contact_admin'));
                }
            } else {
                // Create a new user
                $referral_code = strtoupper(substr(sha1(microtime()), 0, 6));

                $user = new User();
                $user->name = $request->get('name', '');
                $user->email = $request->get('email', '');
                $user->referral_code = $referral_code;
                $user->status = 1;
                $user->country_code = $registerCountryCode;
                $user->mobile = $request->get('mobile', '');
                $user->password = $request->password ? bcrypt($request->password) : null;
                $user->type = $request->type;
                $user->friends_code = $request->friends_code ?? null;

                // Save user first to get ID (needed for profile filename)
                $user->save();
                CommonHelper::setDefaultMailSetting($user->id, 0);

                // Email Verification Process - defer return so profile can be processed first
                if ($request->type == 'email') {
                    $verificationCode = rand(100000, 999999);
                    $user->email_verification_code = $verificationCode;
                    $user->is_verified = false;
                    $user->save();

                    try {
                        $data = [
                            'type' => 'verify_email',
                            'code' => $verificationCode,
                        ];
                        $subject = 'Mail from ' . Setting::get_value('app_name');
                        CommonHelper::sendMail($user->email, $subject, $data);
                        $needsEmailVerificationReturn = true;
                    } catch (\Exception $e) {
                        Log::error('Failed to send verification email: ' . $e->getMessage());
                        return CommonHelper::responseError('Failed to send verification email.');
                    }
                }
            }

            // Single profile upload block - runs for both new and existing users
            if ($request->hasFile('profile')) {
                $file = $request->file('profile');
                $fileName = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('customers', $file, $fileName);
                $user->profile = $image;
                $user->save();
            }

            if ($needsEmailVerificationReturn) {
                return CommonHelper::responseSuccess('verification_mail_sent_successfully');
            }

            // Authenticate user
            Auth::login($user);
            $accessToken = $user->createToken('authToken')->accessToken;
            $res = ['user' => $user, 'access_token' => $accessToken];

            // Save FCM token if provided
            if ($request->has('fcm_token') && filled($request->fcm_token)) {
                $language_id = $request->input('language_id') ?: CommonHelper::getDefaultLanguageId();
                UserToken::updateOrCreate(
                    ['fcm_token' => $request->fcm_token],
                    [
                        'user_id' => auth()->user()->id,
                        'platform' => $request->platform ?? 'android',
                        'type' => 'customer',
                        'language_id' => $language_id,
                    ]
                );
            }

            return CommonHelper::responseWithData($res);
        } catch (\Exception $e) {
            Log::error('Register : ' . $e->getMessage());
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function logout(Request $request)
    {
        if (isset($request->fcm_token)) {
            UserToken::where('type', 'customer')
                ->where('user_id', $request->user()->id)
                ->where('fcm_token', $request->fcm_token)
                ->delete();
        }

        $token = $request->user()->token();
        $token->revoke();

        return CommonHelper::responseSuccess(__('you_have_been_successfully_logged_out'));
    }

    public function notLogin()
    {
        return CommonHelper::responseError(__('unauthorized'));
    }

    public function deleteAccount(Request $request)
    {
        try {
            $user_id = auth()->user()->id;
            $user = User::where('id', $user_id)->first();

            if ($user->mobile == '9876543210') {
                return CommonHelper::responseError("This function is not available in demo mode!");
            }
            if ($user->balance > 0) {
                return CommonHelper::responseError("cannot_delete_account_with_balance");
            }
            MailSetting::where('user_id', $user_id)->delete();
            UserToken::where('user_id', $user_id)->delete();

            $user->delete();
            return CommonHelper::responseSuccess("your_account_deleted_successfully");
        } catch (\Exception $e) {
            Log::error('Login : ' . $e->getMessage());
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function editProfile(Request $request)
    {
        $user = auth()->user();
        $profileCountryCode = $this->normalizeCountryCode($request->input('country_code', $user->country_code));
        $validator = Validator::make($request->all(), [
            'name'   => 'required',
            'email'  => 'required|unique:users,email,' . $user->id . ',id,deleted_at,NULL',
            'country_code' => 'required_with:mobile|nullable|string',
            'mobile' => [
                'nullable',
                Rule::unique('users', 'mobile')
                    ->ignore($user->id)
                    ->where(function ($query) use ($profileCountryCode) {
                        $query->where('country_code', $profileCountryCode);
                    })
                    ->whereNull('deleted_at'),
            ],
        ], [
            'email.unique'  => 'email_has_already_taken',
            'mobile.unique' => 'mobile_number_has_already_taken',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
 
        if ($user->mobile == '9876543210') {
            return CommonHelper::responseError("This function is not available in demo mode!");
        }
        
        $user->name = $request->name;
        $user->email = $request->email;

        if (isset($request->mobile) && $user->type != 'phone') {
            $user->mobile = $request->mobile;
            $user->country_code = $profileCountryCode;
        }

        if ($request->hasFile('profile')) {
            $file = $request->file('profile');

            $fileName = time() . '_' . $user->id . '.' . $file->getClientOriginalExtension();

            $image = Storage::disk('public')->putFileAs('customers', $file, $fileName);
            $user->profile = $image;
        }

        if ($user->status == 2) {
            if (isset($request->referral_code)) {
                $validCode = User::where('status', 1)
                    ->where('referral_code', $request->referral_code)->first();
                if ($validCode) {
                    $user->friends_code = $request->referral_code;
                }
            }
            $user->status = 1;
            CommonHelper::setDefaultMailSetting($user->id, 0);
        }

        $user->save();

        return  CommonHelper::responseSuccess('profile_updated_successfully');
    }

    public function ResetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ], [
            'new_password.confirmed' => __('The new password confirmation does not match.')
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = auth()->user();

        // Verify that the old password matches the current password in the database
        if (!Hash::check($request->old_password, $user->password)) {
            return CommonHelper::responseError(__('The old password is incorrect.'));
        }

        // Update password to new password
        $user->password = bcrypt($request->new_password);
        $user->save();

        return CommonHelper::responseSuccess(__('password_updated_successfully'));
    }

    public function uploadProfile(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'profile' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = auth()->user();
        if ($request->hasFile('profile')) {
            $file = $request->file('profile');
            $image = Storage::disk('public')
                ->putFileAs('customers', $file, $user->id . ".jpg");
            $user->profile = $image;
            $user->save();
        }
        return  CommonHelper::responseSuccess('profile_updated_successfully');
    }

    public function addFcmToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fcm_token' => 'required|string',
            'platform' => 'required|string|in:android,ios,web', // Adjust platform types as per your app
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = $request->user('api-customers');
        $user_id = $user ? $user->id : 0;

        $language_id = $request->input('language_id') ?: CommonHelper::getDefaultLanguageId();

        $token = UserToken::where('fcm_token', $request->fcm_token)->first();

        if ($token) {
            if ($token->user_id == 0 && $user_id != 0) {
                $token->user_id = $user_id;
                $token->platform = $request->platform;
                $token->language_id = $language_id;
                $token->save();
                return CommonHelper::responseSuccess(__('token_updated_successfully'));
            }
            if ($request->has('language_id')) {
                $token->language_id = $language_id;
                $token->save();
            }
            return CommonHelper::responseSuccess(__('token_already_exists'));
        }

        UserToken::create([
            'user_id' => $user_id,
            'type' => 'customer',
            'fcm_token' => $request->fcm_token,
            'platform' => $request->platform,
            'language_id' => $language_id,
        ]);

        return CommonHelper::responseSuccess(__('token_added_successfully'));
    }

    public function updateFcmToken(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fcm_token' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user_id = $request->user('api-customers') ? $request->user('api-customers')->id : 0;

        $token = UserToken::where('fcm_token', $request->fcm_token)->first();
        $language_id = $request->input('language_id') ?: CommonHelper::getDefaultLanguageId();

        // Assign guest token to user when they log in (user_id must be set)
        if ($token && ($token->user_id == 0 || $token->user_id == '') && $user_id) {
            $token->user_id = $user_id;
            $token->platform = $request->platform ?? 'android';
            $token->language_id = $language_id;
            $token->save();
            return CommonHelper::responseSuccess(__('token_updated_successfully'));
        }
        if ($token && $request->has('language_id')) {
            $token->language_id = $language_id;
            $token->save();
        }

        // Match by user_id + fcm_token - if same token exists, update it
        UserToken::updateOrCreate(
            ['user_id' => $user_id, 'fcm_token' => $request->fcm_token],
            ['type' => 'customer', 'platform' => $request->platform ?? 'android', 'language_id' => $language_id]
        );
        return CommonHelper::responseSuccess(__('token_added_successfully'));
    }

    public function getLoginUserDetails(Request $request)
    {
        $user_id = $request->user('api-customers') ? $request->user('api-customers')->id : '';
        $total = Cart::select(DB::raw('COUNT(carts.id) AS total'))->Join('products', 'carts.product_id', '=', 'products.id')->where('carts.save_for_later', '=', 0)->where('user_id', '=', $user_id)->first();
        $total = $total->makeHidden(['image_url']);
        $user = User::select('id', 'name', 'email', 'country_code', 'mobile', 'profile', 'balance', 'referral_code', 'status')->where('id', $user_id)->first();
        if (!empty($user)) {
            // Check if there are any active subscription plans
            $activePlansCount = SubscriptionPlan::where('status', 1)->count();
            $is_subscription_plans = $activePlansCount > 0;
            
            // Check user's subscription status
            // 0 = never purchased, 1 = active subscription, 2 = expired subscription
            $has_active_subscription = 0;
            $userSubscription = null;
            $subscription_expiry_date = null;
            
            // Check if user has any subscription (active or expired)
            $anySubscription = UserSubscription::where('user_id', $user_id)->first();
            
            if ($anySubscription) {
                // User has purchased subscription at least once
                // Check if they have an active subscription
                $userSubscription = CommonHelper::getUserActiveSubscription($user_id);
                // dd($userSubscription);
                if ($userSubscription) {
                    // User has active subscription
                    $has_active_subscription = 1;
                    $subscription_expiry_date = $userSubscription->end_date;
                } else {
                    // User purchased subscription but it has expired
                    $has_active_subscription = 2;
                    // Get the most recent expired subscription for expiry date
                    $expiredSubscription = UserSubscription::where('user_id', $user_id)
                        ->where(function($query) {
                            $query->where('status', 'expired')
                                  ->orWhere('end_date', '<', now()->toDateString());
                        })
                        ->orderBy('id', 'desc')
                        ->first();
                    if ($expiredSubscription) {
                        $subscription_expiry_date = $expiredSubscription->end_date;
                    }
                }
            }

            // If user has an active subscription, mark is_subscription_plans true
            if ($has_active_subscription === 1) {
                $is_subscription_plans = true;
            }
            
            // Get subscription_name from settings
            $subscriptionNameSetting = Setting::where('variable', 'subscription_name')->first();
            $subscription_name = $subscriptionNameSetting ? $subscriptionNameSetting->value : '';
            
            // Resolve subscription plan for translated name (active or most recent expired).
            $plan = null;
            if ($userSubscription && $userSubscription->plan) {
                $plan = $userSubscription->plan;
            } elseif (!empty($expiredSubscription) && !empty($expiredSubscription->plan_id)) {
                $plan = SubscriptionPlan::find($expiredSubscription->plan_id);
            }

            $user->is_subscription_plans = $is_subscription_plans;
            $user->has_active_subscription = $has_active_subscription;
            $user->subscription_name = $subscription_name;
            $user->subscription_expiry_date = CommonHelper::formatDate($subscription_expiry_date);
            $user->user_subscription_plan_name = $plan ? $plan->translated('name') : (($userSubscription ? $userSubscription->plan_name : null) ?? (isset($expiredSubscription) ? $expiredSubscription->plan_name : ''));

            return Response::json(array(
                'status' => 1, 
                'message' => 'success', 
                'total' => 1, 
                'cart_items_count' => $total->total, 
                'user' => $user
            ));
        } else {
            return CommonHelper::responseError(__('unauthorized'));
        }
    }

    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->email_verification_code != $request->code) {
            return CommonHelper::responseError(__('Invalid verification code'));
        }

        // Mark the user as verified
        $user->is_verified = true;
        $user->email_verification_code = null; // Clear the verification code
        $user->save();

        $accessToken = $user->createToken('authToken')->accessToken;

        $res = ['user' => $user, 'access_token' => $accessToken];
        return CommonHelper::responseWithData($res);
    }
    public function forgetPasswordOtp(Request $request)
    {
        $requestData = $request->all();
        $validator = Validator::make($requestData, [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = User::where('type', 'email')
            ->where('email', $request->email)
            ->where('is_verified', 1)
            ->first();

        if ($user) {
            $verificationCode = rand(100000, 999999);

            $user->email_verification_code = $verificationCode;

            // Send forgot password code to email
            try {
                $data = [];
                $data['type'] = 'verify_email';
                $data['code'] = $verificationCode;
                $subject = 'Mail from ' . env('APP_NAME');
                // Mail::to($user->email)->send(new VerifyEmail($verificationCode));
                commonHelper::sendMail($user->email, $subject, $data);
                // Email sent successfully, you can log this or proceed as needed
                Log::info('Verification email sent to ' . $user->email);
                // Save the user record
                $user->save();
                return CommonHelper::responseSuccess('verification_mail_sent_successfully');
            } catch (\Exception $e) {
                // Handle any errors that occur during sending
                Log::error('Failed to send verification email: ' . $e->getMessage());
                return CommonHelper::responseError('Failed to send verification email.');
            }
        } else {
            return CommonHelper::responseError('email_is_not_registered');
        }
    }

    public function forgotPassword(Request $request)
    {
        $requestData = $request->all();

        // Validation rules
        $validator = Validator::make($requestData, [
            'type'    => 'required|in:phone,google,apple,email',
            'email'   => 'required_if:type,email|email',
            'mobile'  => 'required_if:type,phone|numeric',
            'country_code' => 'nullable|string',
            'otp_verify_method' => 'required_if:type,phone|in:twilio,firebase',
            'otp'               => 'required_if:otp_verify_method,twilio|integer',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required'
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if ($request->type === 'email') {
            // Check OTP in users table for email
            $user = User::where('email', $request->email)
                ->where('email_verification_code', $request->otp)
                ->first();

            if (!$user) {
                return CommonHelper::responseError('Invalid or expired OTP');
            }
        } elseif ($request->type === 'phone') {
            $forgotCc = $this->normalizeCountryCode($request->input('country_code'));
            $otpPhoneKey = $forgotCc . $request->mobile;

            if ($request->otp_verify_method === 'twilio') {
                // Check OTP in sms_verifications table for phone
                $smsVerification = DB::table('sms_verifications')
                    ->where('otp', $request->otp)
                    ->where(function ($q) use ($otpPhoneKey, $request) {
                        $q->where('phone', $otpPhoneKey)->orWhere('phone', (string) $request->mobile);
                    })
                    ->first();

                if (!$smsVerification) {
                    return CommonHelper::responseError('Invalid or expired OTP');
                }
            }

            // If otp_verify_method is 'firebase', skip OTP check
            // Find the user based on mobile after OTP verification (or directly for Firebase)
            $user = User::where('mobile', $request->mobile)
                ->where('country_code', $forgotCc)
                ->first();

            if (!$user) {
                return CommonHelper::responseError('User not found');
            }
        }

        if (!$user) {
            return CommonHelper::responseError('Invalid request');
        }

        // Reset password
        $user->password = Hash::make($request->password);
        $user->email_verification_code = null; // Clear OTP for email
        $user->save();

        return CommonHelper::responseSuccess(__('password_updated_successfully'));
    }
    public function verifyUserExist(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mobile' => 'required|string',
            'country_code' => 'required|string',
            'type'    => 'required|in:phone,google,apple,email',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $existCc = $this->normalizeCountryCode($request->country_code);
        $user = User::where('mobile', $request->mobile)
            ->where('country_code', $existCc)
            ->where('type', $request->type)
            ->first();

        if (!$user) {
            return CommonHelper::responseError('user_not_exist');
        }

        return CommonHelper::responseSuccess('user_already_exist');
    }
}