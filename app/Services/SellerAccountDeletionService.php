<?php

namespace App\Services;

use App\Helpers\CommonHelper;
use App\Models\Admin;
use App\Models\Seller;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

/**
 * Email-OTP confirmation for a distributor deleting their own account.
 *
 * Deleting is permanent, so the "Delete account" button first emails a 6-digit code to the distributor's
 * registered address and only deletes once that code is entered. Works the same way as the Super Admin
 * login 2FA (AdminTwoFactorService): the code lives in the cache as an HMAC hash (never plain text), expires,
 * allows a few wrong tries, and is single use. It is kept separate from the sensitive-password code, so a code
 * issued for one purpose can never be used for the other.
 */
class SellerAccountDeletionService
{
    public const CODE_VALID_MINUTES = 10;
    public const MAX_ATTEMPTS = 5;
    public const RESEND_AFTER_SECONDS = 60;
    public const MAX_SENDS_PER_HOUR = 5;

    /**
     * Why this account cannot be deleted right now (a language key), or null when it can.
     * Checked before a code is sent, and again before deleting.
     */
    public function blockedReason(Seller $seller): ?string
    {
        if ($seller->email == 'seller@gmail.com' && isDemoMode()) {
            return 'this_function_is_not_available_in_demo_mode';
        }
        if (floatval($seller->balance ?? 0) > 0) {
            return 'cannot_delete_account_with_balance';
        }
        if ($seller->hasOrderHistory()) {
            return 'seller_has_orders_cannot_delete';
        }
        return null;
    }

    /**
     * Email a fresh code to the distributor's registered address.
     *
     * @return array{email: string, resend_after: int, expires_in: int}
     * @throws \RuntimeException with a language key as the message
     */
    public function sendCode(Admin $user, Seller $seller): array
    {
        if (empty($seller->email)) {
            throw new \RuntimeException('no_email_on_file_cannot_send_verification_code');
        }

        $key = $this->codeKey($user);
        $existing = Cache::get($key);
        if (is_array($existing) && time() - ($existing['sent_at'] ?? 0) < self::RESEND_AFTER_SECONDS) {
            throw new \RuntimeException('please_wait_before_requesting_another_code');
        }

        $sends = Cache::get($this->sendsKey($user));
        if (!is_array($sends) || ($sends['reset_at'] ?? 0) < time()) {
            $sends = ['count' => 0, 'reset_at' => time() + 3600];
        }
        if ($sends['count'] >= self::MAX_SENDS_PER_HOUR) {
            throw new \RuntimeException('too_many_codes_requested_try_again_later');
        }

        $otp = (string) random_int(100000, 999999);
        try {
            $this->deliver($seller->email, $otp, (string) ($seller->name ?? $user->username ?? ''));
        } catch (\Throwable $e) {
            \Log::error('Seller account deletion code mail failed: ' . $e->getMessage());
            throw new \RuntimeException('failed_to_send_otp_email_check_mail_settings', 0, $e);
        }

        $expiresAt = time() + self::CODE_VALID_MINUTES * 60;
        Cache::put($key, [
            'otp' => $this->hashOtp($otp),
            'attempts' => 0,
            'sent_at' => time(),
            'expires_at' => $expiresAt,
        ], Carbon::createFromTimestamp($expiresAt));

        $sends['count']++;
        Cache::put($this->sendsKey($user), $sends, Carbon::createFromTimestamp($sends['reset_at']));

        return [
            'email' => AdminTwoFactorService::maskEmail($seller->email),
            'resend_after' => self::RESEND_AFTER_SECONDS,
            'expires_in' => self::CODE_VALID_MINUTES * 60,
        ];
    }

    /** Seconds until a new code may be requested (0 when one can be sent now). */
    public function secondsUntilResend(Admin $user): int
    {
        $existing = Cache::get($this->codeKey($user));
        if (!is_array($existing)) {
            return 0;
        }
        return max(0, self::RESEND_AFTER_SECONDS - (time() - ($existing['sent_at'] ?? 0)));
    }

    /** The registered address with most of it hidden, for showing "we sent a code to ...". */
    public function maskedEmail(Seller $seller): string
    {
        return AdminTwoFactorService::maskEmail($seller->email);
    }

    /**
     * Check the submitted code. Returns null when it is right (and uses it up), otherwise a language key.
     */
    public function verify(Admin $user, string $otp): ?string
    {
        $key = $this->codeKey($user);
        $payload = Cache::get($key);
        if (!is_array($payload) || ($payload['expires_at'] ?? 0) < time()) {
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

        // single use
        Cache::forget($key);
        return null;
    }

    /** Sends the email. Its own method so a test can capture the code instead of mailing it. */
    protected function deliver(string $to, string $otp, string $name): void
    {
        CommonHelper::sendMail($to, 'Confirm account deletion', [
            'type' => 'seller_delete_account_otp',
            'otp' => $otp,
            'name' => $name,
        ]);
    }

    private function codeKey(Admin $user): string
    {
        return 'seller_delete_otp:' . $user->id;
    }

    private function sendsKey(Admin $user): string
    {
        return 'seller_delete_otp_sends:' . $user->id;
    }

    private function hashOtp(string $otp): string
    {
        return hash_hmac('sha256', 'seller_delete_account:' . $otp, (string) config('app.key'));
    }
}
