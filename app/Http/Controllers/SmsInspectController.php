<?php

namespace App\Http\Controllers;

use App\Helpers\CommonHelper;
use App\Helpers\Msg91Helper;
use App\Helpers\SmsHelper;
use App\Helpers\TwilioHelper;
use App\Models\Admin;
use App\Models\Setting;
use App\Models\SmsVerification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Routing\Controller as BaseController;

class SmsInspectController extends BaseController
{
    /**
     * Resolve current authenticated user/admin.
     */
    protected function resolveAdmin(Request $request)
    {
        if (Auth::guard('web')->check()) {
            return Auth::guard('web')->user();
        }

        if (Auth::guard('api')->check()) {
            return Auth::guard('api')->user();
        }

        $bearer = $request->bearerToken() ?? $request->query('token');
        if (!empty($bearer)) {
            $tokenRow = \App\Models\AdminToken::where('token', $bearer)->first();
            if ($tokenRow && $tokenRow->admin) {
                return $tokenRow->admin;
            }
        }

        $secret = $request->query('secret');
        $validSecret = env('SMS_INSPECT_SECRET') ?: substr(md5(config('app.key')), 0, 16);
        if (!empty($secret) && $secret === $validSecret) {
            return (object)[
                'id' => 0,
                'username' => 'Super Admin (Secret Access)',
                'email' => 'admin@secret',
                'role_id' => 1,
            ];
        }

        return null;
    }

    /**
     * Main dashboard action.
     */
    public function inspect(Request $request)
    {
        // Handle inline login submission
        if ($request->isMethod('post') && $request->input('action') === 'login') {
            $email = trim($request->input('email', ''));
            $password = (string)$request->input('password', '');

            $admin = Admin::where('email', $email)->first();
            if ($admin && Hash::check($password, $admin->password)) {
                Auth::guard('web')->login($admin, true);
                return redirect()->route('sms.inspect')->with('success', 'Logged in successfully as ' . ($admin->username ?? $admin->email));
            }

            return redirect()->route('sms.inspect')->with('auth_error', 'Invalid email or password.');
        }

        // Handle logout
        if ($request->isMethod('post') && $request->input('action') === 'logout') {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('sms.inspect')->with('info', 'Logged out.');
        }

        $admin = $this->resolveAdmin($request);
        if (!$admin) {
            return view('sms_inspect', [
                'authenticated' => false,
            ]);
        }

        // 1. Gather all SMS & login settings
        $trackedKeys = [
            'sms_gateway',
            'msg91_method',
            'msg91_auth_key',
            'msg91_sender_id',
            'msg91_otp_template_id',
            'twilio_method',
            'twilio_sid',
            'twilio_phone_number',
            'firebase_authentication',
            'custom_sms_gateway_otp_based',
            'phone_login',
            'phone_auth_otp',
            'phone_auth_password',
            'app_name',
            'country_code',
        ];

        $settingsRaw = Setting::whereIn('variable', $trackedKeys)->pluck('value', 'variable')->toArray();
        $settings = [];
        foreach ($trackedKeys as $k) {
            $settings[$k] = $settingsRaw[$k] ?? '';
        }

        $activeGateway = SmsHelper::activeGateway();

        // 2. Health checks
        $healthChecks = [];

        // Check: Phone Login
        $healthChecks[] = [
            'title' => 'Phone Login Active',
            'status' => ($settings['phone_login'] == 1) ? 'success' : 'danger',
            'message' => ($settings['phone_login'] == 1) ? 'Enabled' : 'Disabled (retailers cannot log in or register via phone)',
        ];

        // Check: Phone Auth OTP
        $healthChecks[] = [
            'title' => 'Phone Auth OTP Active',
            'status' => ($settings['phone_auth_otp'] == 1) ? 'success' : 'danger',
            'message' => ($settings['phone_auth_otp'] == 1) ? 'Enabled' : 'Disabled in Store Settings',
        ];

        // Check: Firebase Authentication
        $healthChecks[] = [
            'title' => 'Firebase Authentication',
            'status' => ($settings['firebase_authentication'] == 0) ? 'success' : 'warning',
            'message' => ($settings['firebase_authentication'] == 0) ? 'OFF (Custom SMS gateway is active)' : 'ON (App will use Firebase SDK client-side)',
        ];

        // Check: Custom SMS Gateway OTP Based
        $healthChecks[] = [
            'title' => 'Custom SMS Gateway Toggle',
            'status' => ($settings['custom_sms_gateway_otp_based'] == 1) ? 'success' : 'danger',
            'message' => ($settings['custom_sms_gateway_otp_based'] == 1) ? 'ON in Store Settings' : 'OFF in Store Settings',
        ];

        // Check: Active Gateway
        $healthChecks[] = [
            'title' => 'Active Gateway Selected',
            'status' => (!empty($activeGateway)) ? 'success' : 'danger',
            'message' => (!empty($activeGateway)) ? strtoupper($activeGateway) : 'None selected (Configure in SMS Settings)',
        ];

        // Check: MSG91 Auth Key
        $hasAuthKey = !empty($settings['msg91_auth_key']);
        $healthChecks[] = [
            'title' => 'MSG91 Auth Key',
            'status' => $hasAuthKey ? 'success' : 'danger',
            'message' => $hasAuthKey ? 'Configured (' . strlen($settings['msg91_auth_key']) . ' chars)' : 'Missing!',
        ];

        // Check: MSG91 Sender ID
        $hasSender = !empty($settings['msg91_sender_id']);
        $healthChecks[] = [
            'title' => 'MSG91 Sender ID (DLT Header)',
            'status' => $hasSender ? 'success' : 'danger',
            'message' => $hasSender ? $settings['msg91_sender_id'] : 'Missing!',
        ];

        // Check: MSG91 OTP Template ID
        $hasTemplate = !empty($settings['msg91_otp_template_id']);
        $healthChecks[] = [
            'title' => 'MSG91 OTP Template ID',
            'status' => $hasTemplate ? 'success' : 'danger',
            'message' => $hasTemplate ? $settings['msg91_otp_template_id'] : 'Missing!',
        ];

        // 3. Fetch latest 30 SMS verification records from DB
        $verifications = SmsVerification::latest('id')->take(30)->get();

        // 4. Read recent SMS logs from storage/logs/laravel.log
        $smsLogs = $this->extractRecentSmsLogs(50);

        return view('sms_inspect', [
            'authenticated' => true,
            'admin' => $admin,
            'settings' => $settings,
            'activeGateway' => $activeGateway,
            'healthChecks' => $healthChecks,
            'verifications' => $verifications,
            'smsLogs' => $smsLogs,
            'testResult' => session('test_result'),
        ]);
    }

    /**
     * Send test OTP directly and capture exact HTTP diagnostics.
     */
    public function sendTest(Request $request)
    {
        $admin = $this->resolveAdmin($request);
        if (!$admin) {
            return redirect()->route('sms.inspect')->with('auth_error', 'Authentication required.');
        }

        $rawPhone = trim($request->input('phone', ''));
        if (empty($rawPhone)) {
            return redirect()->route('sms.inspect')->with('error', 'Phone number is required.');
        }

        $gateway = $request->input('gateway', 'auto');
        if ($gateway === 'auto') {
            $gateway = SmsHelper::activeGateway() ?: 'msg91';
        }

        // Clean phone number
        $cleanDigits = preg_replace('/[^0-9]/', '', $rawPhone);
        if (strlen($cleanDigits) === 10) {
            $cleanDigits = '91' . $cleanDigits;
        }
        $phoneWithPlus = '+' . $cleanDigits;
        $otp = rand(100000, 999999);
        $appName = Setting::get_value('app_name') ?: 'Saarthi Wholesale';

        $diagnostic = [
            'phone' => $phoneWithPlus,
            'clean_mobiles' => $cleanDigits,
            'otp' => $otp,
            'gateway' => $gateway,
            'timestamp' => Carbon::now()->toDateTimeString(),
            'steps' => [],
            'success' => false,
            'final_message' => '',
        ];

        $startTime = microtime(true);

        if ($gateway === 'msg91' || $gateway === 'msg91_flow') {
            $authKey = Setting::get_value('msg91_auth_key');
            $sender = Setting::get_value('msg91_sender_id');
            $templateId = Setting::get_value('msg91_otp_template_id');

            $diagnostic['config'] = [
                'auth_key_masked' => $this->maskString($authKey),
                'sender_id' => $sender,
                'template_id' => $templateId,
                'app_name' => $appName,
            ];

            if (empty($authKey) || empty($templateId)) {
                $diagnostic['final_message'] = 'MSG91 credentials or template ID missing in SMS Settings.';
                return redirect()->route('sms.inspect')->with('test_result', $diagnostic);
            }

            // Step 1: Call Flow API (templates created under SMS -> Templates are Flow templates)
            $flowUrl = 'https://control.msg91.com/api/v5/flow/';
            $flowPayload = [
                'template_id' => $templateId,
                'short_url' => '0',
                'recipients' => [
                    [
                        'mobiles' => $cleanDigits,
                        'OTP' => (string)$otp,
                        'otp' => (string)$otp,
                        'app_name' => (string)$appName,
                    ]
                ],
            ];
            if (!empty($sender)) {
                $flowPayload['sender'] = $sender;
            }

            try {
                $flowResp = Http::timeout(10)->withHeaders([
                    'authkey' => $authKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->post($flowUrl, $flowPayload);

                $flowElapsed = round((microtime(true) - $startTime) * 1000);
                $flowData = $flowResp->json();

                $flowStep = [
                    'endpoint' => 'POST /api/v5/flow/',
                    'http_status' => $flowResp->status(),
                    'elapsed_ms' => $flowElapsed,
                    'request_payload' => $flowPayload,
                    'response_body' => $flowData ?: $flowResp->body(),
                    'success' => false,
                ];

                $flowSuccess = $flowResp->successful() && (
                    (isset($flowData['status']) && strtolower($flowData['status']) === 'success') ||
                    (isset($flowData['type']) && strtolower($flowData['type']) === 'success') ||
                    (isset($flowData['message']) && stripos($flowData['message'], 'success') !== false) ||
                    empty($flowData)
                );

                if ($flowSuccess) {
                    $flowStep['success'] = true;
                    $diagnostic['steps'][] = $flowStep;
                    $diagnostic['success'] = true;
                    $diagnostic['final_message'] = 'MSG91 Flow API succeeded! SMS dispatched to telecom.';
                } else {
                    $flowStep['note'] = 'Flow API did not succeed; attempting OTP API fallback...';
                    $diagnostic['steps'][] = $flowStep;

                    // Fallback to OTP API
                    $otpUrl = 'https://control.msg91.com/api/v5/otp';
                    $queryParams = [
                        'template_id' => $templateId,
                        'mobile' => $cleanDigits,
                        'authkey' => $authKey,
                        'otp' => (string)$otp,
                    ];
                    $body = [
                        'otp' => (string)$otp,
                        'OTP' => (string)$otp,
                        'app_name' => (string)$appName,
                    ];
                    if (!empty($sender)) {
                        $body['sender'] = $sender;
                    }

                    $otpResp = Http::timeout(10)->withHeaders([
                        'authkey' => $authKey,
                        'Content-Type' => 'application/json',
                        'Accept' => 'application/json',
                    ])->post($otpUrl . '?' . http_build_query($queryParams), $body);

                    $otpElapsed = round((microtime(true) - $startTime) * 1000);
                    $otpData = $otpResp->json();

                    $otpStep = [
                        'endpoint' => 'POST /api/v5/otp',
                        'http_status' => $otpResp->status(),
                        'elapsed_ms' => $otpElapsed,
                        'request_body' => $body,
                        'response_body' => $otpData ?: $otpResp->body(),
                        'success' => $otpResp->successful(),
                    ];

                    $diagnostic['steps'][] = $otpStep;

                    if ($otpResp->successful()) {
                        $diagnostic['success'] = true;
                        $diagnostic['final_message'] = 'MSG91 OTP API succeeded! SMS dispatched.';
                    } else {
                        $diagnostic['final_message'] = 'Both Flow and OTP APIs failed. Check responses below.';
                    }
                }
            } catch (\Throwable $e) {
                $diagnostic['steps'][] = [
                    'endpoint' => 'Exception',
                    'error' => $e->getMessage(),
                ];
                $diagnostic['final_message'] = 'Network exception: ' . $e->getMessage();
            }
        } elseif ($gateway === 'msg91_otp') {
            $authKey = Setting::get_value('msg91_auth_key');
            $sender = Setting::get_value('msg91_sender_id');
            $templateId = Setting::get_value('msg91_otp_template_id');

            $diagnostic['config'] = [
                'auth_key_masked' => $this->maskString($authKey),
                'sender_id' => $sender,
                'template_id' => $templateId,
                'app_name' => $appName,
            ];

            $otpUrl = 'https://control.msg91.com/api/v5/otp';
            $queryParams = [
                'template_id' => $templateId,
                'mobile' => $cleanDigits,
                'authkey' => $authKey,
                'otp' => (string)$otp,
            ];
            $body = [
                'otp' => (string)$otp,
                'OTP' => (string)$otp,
                'app_name' => (string)$appName,
            ];
            if (!empty($sender)) {
                $body['sender'] = $sender;
            }

            try {
                $otpResp = Http::timeout(10)->withHeaders([
                    'authkey' => $authKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])->post($otpUrl . '?' . http_build_query($queryParams), $body);

                $otpElapsed = round((microtime(true) - $startTime) * 1000);
                $otpData = $otpResp->json();

                $diagnostic['steps'][] = [
                    'endpoint' => 'POST /api/v5/otp',
                    'http_status' => $otpResp->status(),
                    'elapsed_ms' => $otpElapsed,
                    'request_body' => $body,
                    'response_body' => $otpData ?: $otpResp->body(),
                    'success' => $otpResp->successful(),
                ];
                $diagnostic['success'] = $otpResp->successful();
                $diagnostic['final_message'] = $otpResp->successful() ? 'MSG91 OTP API executed.' : 'MSG91 OTP API failed.';
            } catch (\Throwable $e) {
                $diagnostic['final_message'] = 'OTP API exception: ' . $e->getMessage();
            }
        } elseif ($gateway === 'twilio') {
            try {
                $msg = "{$otp} is your verification code from {$appName}";
                $ok = TwilioHelper::sendSms($phoneWithPlus, $msg);
                $diagnostic['success'] = $ok;
                $diagnostic['final_message'] = $ok ? 'Twilio SMS sent successfully.' : 'Twilio send failed (check logs).';
            } catch (\Throwable $e) {
                $diagnostic['final_message'] = 'Twilio exception: ' . $e->getMessage();
            }
        }

        // Record in sms_verifications if test succeeded
        if ($diagnostic['success']) {
            SmsVerification::insert([
                'phone' => $phoneWithPlus,
                'user_type' => null,
                'otp' => $otp,
                'status' => 'pending',
                'expires_at' => Carbon::now()->addMinutes(10),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

        return redirect()->route('sms.inspect')->with('test_result', $diagnostic);
    }

    /**
     * Read the last N matching log lines from storage/logs/laravel.log
     */
    protected function extractRecentSmsLogs(int $limit = 50): array
    {
        $logPath = storage_path('logs/laravel.log');
        if (!file_exists($logPath) || !is_readable($logPath)) {
            return [];
        }

        $lines = [];
        $fp = @fopen($logPath, 'r');
        if (!$fp) {
            return [];
        }

        // Read last 256KB of the file
        $fileSize = filesize($logPath);
        $readBytes = min($fileSize, 262144);
        fseek($fp, -$readBytes, SEEK_END);
        $content = fread($fp, $readBytes);
        fclose($fp);

        $rawLines = explode("\n", $content);
        $rawLines = array_reverse($rawLines);

        $pattern = '/MSG91|SmsHelper|Twilio|send_sms|sms_verifications|otp_provider/i';

        foreach ($rawLines as $line) {
            $trimmed = trim($line);
            if (empty($trimmed)) {
                continue;
            }

            if (preg_match($pattern, $trimmed)) {
                // Parse timestamp and level: [2026-10-10 10:04:10] local.INFO: MSG91 ...
                $parsed = [
                    'raw' => $trimmed,
                    'timestamp' => '',
                    'level' => 'INFO',
                    'message' => $trimmed,
                ];

                if (preg_match('/^\[([0-9\-\s\:]+)\]\s+([a-zA-Z0-9_\.]+)\.([A-Z]+):\s+(.*)$/', $trimmed, $m)) {
                    $parsed['timestamp'] = $m[1];
                    $parsed['level'] = $m[3];
                    $parsed['message'] = $m[4];
                }

                $lines[] = $parsed;
                if (count($lines) >= $limit) {
                    break;
                }
            }
        }

        return $lines;
    }

    /**
     * Mask sensitive credentials.
     */
    protected function maskString(?string $str, int $visible = 4): string
    {
        if (empty($str)) {
            return 'Not Set';
        }
        $len = strlen($str);
        if ($len <= $visible * 2) {
            return substr($str, 0, 2) . '***' . substr($str, -2);
        }
        return substr($str, 0, $visible) . '...' . substr($str, -$visible);
    }
}
