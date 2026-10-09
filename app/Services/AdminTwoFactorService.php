<?php

namespace App\Services;

use App\Helpers\CommonHelper;
use App\Models\Admin;
use App\Models\Role;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Email-OTP two-factor authentication for the Super Admin login.
 *
 * Turned on/off by the `superadmin_2fa_enabled` setting. Once the Super Admin's email + password
 * check out, the login is parked as a short-lived "challenge" (no session, no access token) and a
 * 6-digit code is emailed; the access token is only issued after that code is verified.
 */
class AdminTwoFactorService
{
    public const SETTING = 'superadmin_2fa_enabled';
    public const CODE_VALID_MINUTES = 10;
    public const MAX_ATTEMPTS = 5;
    public const RESEND_AFTER_SECONDS = 60;
    public const MAX_SENDS = 5;

    public static function isEnabled(): bool
    {
        return trim((string) Setting::get_value(self::SETTING)) === '1';
    }

    public static function appliesTo(Admin $user): bool
    {
        return (int) $user->role_id === (int) Role::$roleSuperAdmin && self::isEnabled();
    }

    /**
     * Park the login and email the first code.
     *
     * @return array{two_factor_required: bool, two_factor_token: string, email: string, resend_after: int, expires_in: int}
     * @throws \RuntimeException when the email could not be sent
     */
    public function start(Admin $user): array
    {
        $token = Str::random(48);
        $this->issueCode($token, $user, 1, 0);

        return $this->challengeInfo($token, $user);
    }

    /**
     * Email a fresh code for an open challenge.
     *
     * @return array{0: ?array, 1: ?string} [challenge info, error message key]
     */
    public function resend(string $token): array
    {
        $payload = $this->load($token);
        if (!$payload) {
            return [null, 'two_factor_session_expired_please_login_again'];
        }
        if (time() - $payload['sent_at'] < self::RESEND_AFTER_SECONDS) {
            return [null, 'please_wait_before_requesting_another_code'];
        }
        if ($payload['sends'] >= self::MAX_SENDS) {
            Cache::forget($this->key($token));
            return [null, 'too_many_codes_requested_please_login_again'];
        }

        $user = Admin::find($payload['user_id']);
        if (!$user) {
            return [null, 'two_factor_session_expired_please_login_again'];
        }

        try {
            $this->issueCode($token, $user, $payload['sends'] + 1, 0);
        } catch (\RuntimeException $e) {
            return [null, 'failed_to_send_otp_email_check_mail_settings'];
        }

        return [$this->challengeInfo($token, $user), null];
    }

    /**
     * Check a submitted code.
     *
     * @return array{0: ?Admin, 1: ?string} [the verified user, error message key]
     */
    public function verify(string $token, string $otp): array
    {
        $payload = $this->load($token);
        if (!$payload) {
            return [null, 'two_factor_session_expired_please_login_again'];
        }
        if ($payload['attempts'] >= self::MAX_ATTEMPTS) {
            Cache::forget($this->key($token));
            return [null, 'too_many_invalid_attempts_please_login_again'];
        }

        if (!hash_equals($payload['otp'], $this->hashOtp(trim($otp)))) {
            $payload['attempts']++;
            $this->store($token, $payload);
            return [null, 'otp_is_invalid_or_expired'];
        }

        // single use
        Cache::forget($this->key($token));

        $user = Admin::find($payload['user_id']);
        if (!$user || (int) $user->role_id !== (int) Role::$roleSuperAdmin) {
            return [null, 'two_factor_session_expired_please_login_again'];
        }

        return [$user, null];
    }

    /**
     * Turning 2FA on or off needs a code too: email one to the Super Admin who is changing the setting.
     * Receiving it also proves outgoing mail works, so 2FA can't be switched on into a broken mail setup.
     *
     * @return array{otp_required: bool, email: string, resend_after: int, expires_in: int}
     * @throws \RuntimeException when the email could not be sent, or a code was sent too recently
     */
    public function sendSettingChangeCode(Admin $user, bool $enable): array
    {
        $key = $this->settingKey($user);
        $existing = Cache::get($key);
        if (is_array($existing) && time() - ($existing['sent_at'] ?? 0) < self::RESEND_AFTER_SECONDS) {
            throw new \RuntimeException('please_wait_before_requesting_another_code');
        }

        $otp = (string) random_int(100000, 999999);
        try {
            CommonHelper::sendMail($user->email, 'Your security verification code', [
                'type' => 'two_factor_setting_otp',
                'otp' => $otp,
                'name' => $user->username ?? '',
                'action' => $enable ? 'turn ON' : 'turn OFF',
            ]);
        } catch (\Throwable $e) {
            \Log::error('Super Admin 2FA setting mail failed: ' . $e->getMessage());
            throw new \RuntimeException('failed_to_send_otp_email_check_mail_settings', 0, $e);
        }

        $expiresAt = time() + self::CODE_VALID_MINUTES * 60;
        Cache::put($key, [
            'otp' => $this->hashOtp($otp),
            'enable' => $enable,
            'attempts' => 0,
            'sent_at' => time(),
            'expires_at' => $expiresAt,
        ], Carbon::createFromTimestamp($expiresAt));

        return [
            'otp_required' => true,
            'email' => self::maskEmail($user->email),
            'resend_after' => self::RESEND_AFTER_SECONDS,
            'expires_in' => self::CODE_VALID_MINUTES * 60,
        ];
    }

    /**
     * Check the code for a setting change. Returns null when it is right, otherwise an error message key.
     */
    public function confirmSettingChange(Admin $user, bool $enable, string $otp): ?string
    {
        $key = $this->settingKey($user);
        $payload = Cache::get($key);
        if (!is_array($payload) || ($payload['expires_at'] ?? 0) < time() || (bool) $payload['enable'] !== $enable) {
            return 'otp_is_invalid_or_expired';
        }
        if ($payload['attempts'] >= self::MAX_ATTEMPTS) {
            Cache::forget($key);
            return 'too_many_invalid_attempts_please_try_again';
        }
        if (!hash_equals($payload['otp'], $this->hashOtp(trim($otp)))) {
            $payload['attempts']++;
            Cache::put($key, $payload, Carbon::createFromTimestamp($payload['expires_at']));
            return 'otp_is_invalid_or_expired';
        }

        Cache::forget($key);
        return null;
    }

    private function settingKey(Admin $user): string
    {
        return 'admin_2fa_setting:' . $user->id;
    }

    public static function maskEmail(?string $email): string
    {
        $email = (string) $email;
        if (!str_contains($email, '@')) {
            return '';
        }
        [$local, $domain] = explode('@', $email, 2);
        return Str::substr($local, 0, 1) . str_repeat('*', max(2, Str::length($local) - 1)) . '@' . $domain;
    }

    private function issueCode(string $token, Admin $user, int $sends, int $attempts): void
    {
        $otp = (string) random_int(100000, 999999);

        try {
            CommonHelper::sendMail($user->email, 'Your login verification code', [
                'type' => 'two_factor_login_otp',
                'otp' => $otp,
                'name' => $user->username ?? '',
            ]);
        } catch (\Throwable $e) {
            \Log::error('Super Admin 2FA mail failed: ' . $e->getMessage());
            throw new \RuntimeException('failed_to_send_otp_email_check_mail_settings', 0, $e);
        }

        $this->store($token, [
            'user_id' => $user->id,
            'otp' => $this->hashOtp($otp),
            'attempts' => $attempts,
            'sends' => $sends,
            'sent_at' => time(),
            'expires_at' => time() + self::CODE_VALID_MINUTES * 60,
        ]);
    }

    private function challengeInfo(string $token, Admin $user): array
    {
        return [
            'two_factor_required' => true,
            'two_factor_token' => $token,
            'email' => self::maskEmail($user->email),
            'resend_after' => self::RESEND_AFTER_SECONDS,
            'expires_in' => self::CODE_VALID_MINUTES * 60,
        ];
    }

    private function key(string $token): string
    {
        return 'admin_2fa:' . hash('sha256', $token);
    }

    private function hashOtp(string $otp): string
    {
        return hash_hmac('sha256', $otp, (string) config('app.key'));
    }

    private function load(string $token): ?array
    {
        $payload = Cache::get($this->key($token));
        if (!is_array($payload) || ($payload['expires_at'] ?? 0) < time()) {
            return null;
        }
        return $payload;
    }

    private function store(string $token, array $payload): void
    {
        Cache::put($this->key($token), $payload, Carbon::createFromTimestamp($payload['expires_at']));
    }
}
