<?php

namespace App\Helpers;

use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Msg91Helper
{
    private const FLOW_URL = 'https://control.msg91.com/api/v5/flow/';
    private const OTP_URL  = 'https://control.msg91.com/api/v5/otp';

    /**
     * Send OTP via MSG91.
     * Tries MSG91 OTP API first; falls back to Flow API if configured as a Flow template.
     *
     * @param string $to
     * @param string|int $otp
     * @param array $context
     * @return bool
     */
    public static function sendOtp($to, $otp, array $context = []): bool
    {
        $authKey    = Setting::get_value('msg91_auth_key');
        $sender     = Setting::get_value('msg91_sender_id');
        $templateId = $context['template_id'] ?? Setting::get_value('msg91_otp_template_id');

        if (empty($authKey)) {
            Log::error('MSG91: Auth key is missing.');
            return false;
        }

        // MSG91 requires mobile number with country code and without leading '+'
        $mobiles = preg_replace('/\D/', '', ltrim(trim($to), '+'));
        if (strlen($mobiles) === 10) {
            $mobiles = '91' . $mobiles;
        }
        if ($mobiles === '') {
            Log::error('MSG91: Mobile number is empty.');
            return false;
        }

        $appName = $context['app_name'] ?? Setting::get_value('app_name') ?? '';

        if (empty($templateId)) {
            Log::error('MSG91: OTP template ID is missing.');
            return false;
        }

        // 1. Try Flow API first (templates created under SMS -> Templates are Flow templates)
        try {
            $recipient = [
                'mobiles'  => $mobiles,
                'OTP'      => (string)$otp,
                'otp'      => (string)$otp,
                'app_name' => (string)$appName,
            ];

            $payload = [
                'template_id' => $templateId,
                'short_url'   => '0',
                'recipients'  => [$recipient],
            ];

            if (!empty($sender)) {
                $payload['sender'] = $sender;
            }

            $response = Http::withHeaders([
                'authkey'      => $authKey,
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ])->post(self::FLOW_URL, $payload);

            $resData = $response->json();
            if ($response->successful() && (
                (isset($resData['status']) && strtolower($resData['status']) === 'success') ||
                (isset($resData['type']) && strtolower($resData['type']) === 'success') ||
                (isset($resData['message']) && stripos($resData['message'], 'success') !== false) ||
                empty($resData)
            )) {
                Log::info("MSG91 Flow OTP sent successfully to {$mobiles}");
                return true;
            }

            Log::warning("MSG91 Flow API did not succeed for {$mobiles}, body: " . $response->body() . ". Retrying via OTP API...");
        } catch (\Throwable $e) {
            Log::error("MSG91 Flow exception: " . $e->getMessage());
        }

        // 2. Fallback to MSG91 OTP API
        try {
            $queryParams = [
                'template_id' => $templateId,
                'mobile'      => $mobiles,
                'authkey'     => $authKey,
                'otp'         => (string)$otp,
            ];

            $body = [
                'otp'      => (string)$otp,
                'OTP'      => (string)$otp,
                'app_name' => (string)$appName,
            ];

            if (!empty($sender)) {
                $body['sender'] = $sender;
            }

            $response = Http::withHeaders([
                'authkey'      => $authKey,
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ])->post(self::OTP_URL . '?' . http_build_query($queryParams), $body);

            $resData = $response->json();
            if ($response->successful() && (
                (isset($resData['type']) && strtolower($resData['type']) === 'success') ||
                (isset($resData['status']) && strtolower($resData['status']) === 'success') ||
                (isset($resData['message']) && stripos($resData['message'], 'success') !== false)
            )) {
                Log::info("MSG91 OTP sent successfully to {$mobiles}");
                return true;
            }

            Log::error("MSG91 OTP failed for {$mobiles}", ['status' => $response->status(), 'body' => $response->body()]);
            return false;
        } catch (\Throwable $e) {
            Log::error("MSG91 OTP API exception: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send general or transactional SMS via MSG91 Flow API.
     *
     * @param string $to
     * @param string $message
     * @param array $context
     * @return bool
     */
    public static function sendSms(string $to, string $message, array $context = []): bool
    {
        $authKey    = Setting::get_value('msg91_auth_key');
        $sender     = Setting::get_value('msg91_sender_id');
        $templateId = $context['template_id'] ?? '';
        $vars       = $context['vars'] ?? [];

        if (empty($authKey)) {
            Log::error('MSG91: Auth key missing.');
            return false;
        }

        if (empty($templateId)) {
            Log::warning('MSG91: Flow template ID is not configured for this message type.');
            return false;
        }

        $mobiles = preg_replace('/\D/', '', ltrim(trim($to), '+'));
        if (strlen($mobiles) === 10) {
            $mobiles = '91' . $mobiles;
        }
        if ($mobiles === '') {
            return false;
        }

        $stringVars = [];
        foreach ($vars as $k => $v) {
            $stringVars[$k] = is_scalar($v) ? (string)$v : json_encode($v);
        }

        $recipient = array_merge(['mobiles' => $mobiles], $stringVars);

        $payload = [
            'template_id' => $templateId,
            'short_url'   => '0',
            'recipients'  => [$recipient],
        ];

        if (!empty($sender)) {
            $payload['sender'] = $sender;
        }

        try {
            $response = Http::withHeaders([
                'authkey'      => $authKey,
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ])->post(self::FLOW_URL, $payload);

            if (!$response->successful()) {
                Log::error('MSG91 send failed', ['status' => $response->status(), 'body' => $response->body()]);
                return false;
            }
            return true;
        } catch (\Throwable $e) {
            Log::error('MSG91 send exception: ' . $e->getMessage());
            return false;
        }
    }
}
