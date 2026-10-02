<?php

namespace App\Helpers;

use App\Models\Setting;
use Illuminate\Support\Facades\Log;

class SmsHelper
{
    /**
     * Get the active SMS gateway name ('twilio', 'msg91', or empty).
     */
    public static function activeGateway(): string
    {
        $gateway = Setting::get_value('sms_gateway');
        if (!empty($gateway)) {
            return strtolower(trim($gateway));
        }

        // Backward compatibility: check individual gateway toggle flags
        if ((int)Setting::get_value('msg91_method') === 1) {
            return 'msg91';
        }
        if ((int)Setting::get_value('twilio_method') === 1) {
            return 'twilio';
        }

        return '';
    }

    /**
     * Send OTP via the active gateway.
     *
     * @param string $to
     * @param string|int $otp
     * @param array $context
     * @return bool
     */
    public static function sendOtp($to, $otp, array $context = []): bool
    {
        $gateway = self::activeGateway();

        if ($gateway === 'msg91') {
            return Msg91Helper::sendOtp($to, $otp, $context);
        }

        if ($gateway === 'twilio') {
            $appName = $context['app_name'] ?? Setting::get_value('app_name') ?? '';
            $message = $context['message'] ?? "{$otp} is your verification code from {$appName}";
            return TwilioHelper::sendSms($to, $message);
        }

        Log::warning("SmsHelper: No active SMS gateway found to send OTP.");
        return false;
    }

    /**
     * Send general or transactional SMS via the active gateway.
     *
     * @param string $to
     * @param string $message
     * @param array $context
     * @return bool
     */
    public static function sendSms($to, string $message, array $context = []): bool
    {
        $gateway = self::activeGateway();

        if ($gateway === 'msg91') {
            return Msg91Helper::sendSms($to, $message, $context);
        }

        if ($gateway === 'twilio') {
            return TwilioHelper::sendSms($to, $message);
        }

        Log::warning("SmsHelper: No active SMS gateway found to send SMS.");
        return false;
    }
}
