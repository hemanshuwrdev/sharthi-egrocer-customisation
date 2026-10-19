<?php

namespace App\Services;

use App\Helpers\CommonHelper;
use App\Models\AdminToken;
use App\Models\Area;
use App\Models\BrandDistributorMapping;
use App\Models\City;
use App\Models\MobileRegistry;
use App\Models\RetailerProfile;
use App\Models\Salesman;
use App\Models\Setting;
use App\Models\User;
use App\Models\UserToken;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

/**
 * Retailer onboarding steps shared by the customer app (self-registration) and the admin panel
 * (add / edit / approve a retailer without waiting for a salesman visit).
 *
 * Business-rule failures are thrown as \DomainException whose message is a language key, so the
 * caller can hand it straight to CommonHelper::responseError().
 */
class RetailerOnboardingService
{
    /** Verification states an admin approval can move to 'active' (a pending retailer, or one left half-way). */
    private const APPROVABLE = ['pending', 'salesman_verified', 'approved'];

    public static function normalizeCountryCode($code): string
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

    /**
     * Admin adds a retailer. $verified = true makes the retailer 'active' straight away (can order,
     * no salesman visit); false leaves them 'pending' and notifies the territory's salesmen, exactly
     * like a self-registration.
     *
     * $data: country_code, mobile, shop_name, party_name, gst_no, address_line1, address_line2, city,
     *        state, area_id, gps_lat, gps_lng
     */
    public function createRetailer(array $data, int $adminId, bool $verified): User
    {
        $countryCode   = self::normalizeCountryCode($data['country_code'] ?? null);
        $matchedCityId = $this->matchZone($data['gps_lat'], $data['gps_lng']);
        $areaId        = $this->resolveAreaId($data['area_id'] ?? null);

        DB::beginTransaction();
        try {
            $user = new User();
            $user->name = $data['party_name'];
            $user->mobile = $data['mobile'];
            $user->country_code = $countryCode;
            $user->type = 'phone';
            $user->status = User::$active;
            $user->verification_status = $verified ? 'active' : 'pending';
            $user->referral_code = strtoupper(substr(sha1(microtime()), 0, 6));
            $user->is_verified = 1; // the retailer's own OTP login still happens on first app sign-in
            $user->save();

            CommonHelper::setDefaultMailSetting($user->id, 0);

            $profile = new RetailerProfile();
            $profile->user_id = $user->id;
            $this->fillProfile($profile, $data, $matchedCityId, $areaId);
            $profile->created_by_admin_id = $adminId;
            if ($verified) {
                $profile->verified_at = now();
                $profile->verified_by_admin_id = $adminId;
            }
            $profile->save();

            $conflict = CommonHelper::claimMobile($user->mobile, MobileRegistry::ROLE_RETAILER, $user->id);
            if ($conflict) {
                throw new \DomainException($conflict);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        $this->afterLocationSaved((int) $user->id, $data['gps_lat'], $data['gps_lng'], $matchedCityId);

        // Same as registration: the QR exists from the moment the account does.
        try {
            $this->ensureQr($user);
        } catch (\Throwable $e) {
            Log::error('createRetailer QR failed for user_id=' . $user->id . ': ' . $e->getMessage());
        }

        // A pending retailer still needs a salesman visit, so tell the territory. Never fails the create.
        if (!$verified) {
            try {
                $this->fanOutToSalesmen($user, $profile);
            } catch (\Throwable $e) {
                Log::error('createRetailer fan-out failed: ' . $e->getMessage());
            }
        }

        return $user;
    }

    /**
     * Admin edits a retailer. Same keys as createRetailer. The zone is only re-derived when the
     * location actually changed, and the retailer is signed out everywhere if the mobile changed
     * (it is their login identity).
     */
    public function updateRetailer(User $user, array $data): void
    {
        $countryCode = self::normalizeCountryCode($data['country_code'] ?? null);
        $profile = RetailerProfile::firstOrNew(['user_id' => $user->id]);

        $mobileChanged = (string) $data['mobile'] !== (string) $user->mobile || $countryCode !== (string) $user->country_code;
        $gpsChanged = !$profile->exists
            || abs((float) $data['gps_lat'] - (float) $profile->gps_lat) > 1e-7
            || abs((float) $data['gps_lng'] - (float) $profile->gps_lng) > 1e-7;

        $matchedCityId = $gpsChanged ? $this->matchZone($data['gps_lat'], $data['gps_lng']) : $profile->city_id;
        $areaId = $this->resolveAreaId($data['area_id'] ?? null, $profile->area_id);

        DB::beginTransaction();
        try {
            $user->name = $data['party_name'];
            $user->mobile = $data['mobile'];
            $user->country_code = $countryCode;
            $user->save();

            if ($mobileChanged) {
                $conflict = CommonHelper::claimMobile($user->mobile, MobileRegistry::ROLE_RETAILER, $user->id);
                if ($conflict) {
                    throw new \DomainException($conflict);
                }
            }

            $this->fillProfile($profile, $data, $matchedCityId, $areaId);
            $profile->save();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        if ($gpsChanged) {
            $this->afterLocationSaved((int) $user->id, $data['gps_lat'], $data['gps_lng'], $matchedCityId);
        }
        if ($mobileChanged) {
            $user->tokens()->update(['revoked' => true]);
        }
    }

    /**
     * Admin approval: pending -> active with no salesman visit. Guarded on the current state the same
     * way a salesman's claim is, so an approval racing a salesman's verify can only succeed once.
     */
    public function approveByAdmin(User $user, int $adminId): void
    {
        DB::beginTransaction();
        try {
            $claimed = User::where('id', $user->id)
                ->whereIn('verification_status', self::APPROVABLE)
                ->update(['verification_status' => 'active']);

            if ($claimed === 0) {
                throw new \DomainException('retailer_already_verified');
            }

            $profile = RetailerProfile::firstOrNew(['user_id' => $user->id]);
            $profile->verified_at = now();
            $profile->verified_by_admin_id = $adminId;
            $profile->save();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }

        // Best-effort push: tell the retailer they can order. Never fails the approval.
        try {
            $tokens = UserToken::where('user_id', $user->id)->where('type', 'customer')->get();
            if (!$tokens->isEmpty()) {
                CommonHelper::sendNotificationByTemplate(
                    $tokens,
                    'retailer_verified_customer',
                    [
                        'shop_name'     => $profile->shop_name ?? '',
                        // The template reads "{{salesman_name}} has verified your shop"; here it's the business itself.
                        'salesman_name' => Setting::get_value('app_name') ?: config('app.name'),
                    ],
                    'retailer_activated',
                    0,
                    '',
                    null,
                    null,
                    'retailer',
                    $user->id
                );
            }
        } catch (\Throwable $e) {
            Log::error('approveByAdmin retailer push failed: ' . $e->getMessage());
        }
    }

    /**
     * Builds (once) and returns the retailer's QR image — shared by signup, get_retailer_qr and the
     * admin panel so all produce the same file. Throws if the image can't be generated or stored.
     */
    public function ensureQr(User $user, bool $regenerate = false): array
    {
        $path = 'retailer_qr/' . $user->id . '.svg';
        if ($regenerate || !Storage::disk('public')->exists($path)) {
            $svg = QrCode::format('svg')
                ->size(400)
                ->margin(1)
                ->errorCorrection('M')
                ->generate((string) $user->id);
            Storage::disk('public')->put($path, $svg);
        }

        return [
            'qr_code'      => (string) $user->id,
            'qr_image_url' => Storage::disk('public')->url($path),
        ];
    }

    /**
     * Sarthi: push 'new_retailer_pending' to every salesman of every distributor
     * that ships to the retailer's city. No-op if no distributors map to that city.
     */
    public function fanOutToSalesmen(User $retailer, RetailerProfile $profile): void
    {
        if (!$profile->gps_lat || !$profile->gps_lng) {
            return;
        }

        // Fan out to every distributor mapped anywhere in the retailer's whole zone, not
        // just the single city polygon their GPS point happens to land inside.
        $zoneCityIds = CommonHelper::getDeliverableZoneCityIds($profile->gps_lat, $profile->gps_lng);
        if (empty($zoneCityIds)) {
            return;
        }

        $distributorIds = BrandDistributorMapping::whereIn('city_id', $zoneCityIds)
            ->pluck('seller_id')->unique()->values();

        if ($distributorIds->isEmpty()) {
            return;
        }

        $salesmen = Salesman::whereIn('seller_id', $distributorIds)
            ->where('status', Salesman::$statusActive)
            ->whereNotNull('admin_id')
            ->get(['id', 'admin_id', 'name']);

        if ($salesmen->isEmpty()) {
            return;
        }

        $cityName = City::where('id', $profile->city_id)->value('name') ?? '';
        $placeholders = [
            'shop_name'     => $profile->shop_name ?? '',
            'retailer_name' => $retailer->name ?? '',
            'city_name'     => $cityName,
            'retailer_id'   => $retailer->id,
        ];

        foreach ($salesmen as $sm) {
            try {
                $tokens = AdminToken::where('user_id', $sm->admin_id)
                    ->where('type', 'Salesman')
                    ->get();
                if ($tokens->isEmpty()) {
                    continue;
                }
                CommonHelper::sendNotificationByTemplate(
                    $tokens,
                    'new_retailer_pending',
                    $placeholders,
                    'new_retailer',
                    0,
                    '',
                    null,
                    null,
                    'retailer',
                    $retailer->id
                );
            } catch (\Throwable $e) {
                Log::error('[registerRetailer] salesman push failed for salesman_id=' . $sm->id . ': ' . $e->getMessage());
            }
        }
    }

    /** The first zone containing the point; the retailer must be inside the serviceable area. */
    private function matchZone($lat, $lng): int
    {
        $zoneCityIds = CommonHelper::getDeliverableZoneCityIds($lat, $lng);
        if (empty($zoneCityIds)) {
            throw new \DomainException('location_outside_serviceable_area');
        }

        return (int) (CommonHelper::getDeliverableCityIds($lat, $lng)[0] ?? $zoneCityIds[0]);
    }

    /** Area is independent of the GPS zone; it only has to exist and be active (or be the one already saved). */
    private function resolveAreaId($areaId, $currentAreaId = null): ?int
    {
        if (!$areaId) {
            return null;
        }
        if ((int) $areaId === (int) $currentAreaId) {
            return (int) $areaId;
        }
        if (!Area::where('id', $areaId)->where('status', 1)->exists()) {
            throw new \DomainException('invalid_area');
        }

        return (int) $areaId;
    }

    private function fillProfile(RetailerProfile $profile, array $data, ?int $cityId, ?int $areaId): void
    {
        $profile->shop_name     = $data['shop_name'];
        $profile->party_name    = $data['party_name'];
        $profile->gst_no        = $data['gst_no'] ?? null;
        $profile->address_line1 = $data['address_line1'];
        $profile->address_line2 = $data['address_line2'] ?? null;
        $profile->city          = $data['city'] ?? null;
        $profile->state         = $data['state'] ?? null;
        $profile->address       = RetailerProfile::composeAddress(
            $data['address_line1'], $data['address_line2'] ?? null, $data['city'] ?? null, $data['state'] ?? null
        );
        $profile->gps_lat       = $data['gps_lat'];
        $profile->gps_lng       = $data['gps_lng'];
        $profile->city_id       = $cityId;
        $profile->area_id       = $areaId;
    }

    /** Keep every zone the shop falls in (zones can overlap; city_id holds only the first one). */
    private function afterLocationSaved(int $userId, $lat, $lng, ?int $matchedCityId): void
    {
        try {
            app(RetailerZoneService::class)->syncRetailer($userId, $lat, $lng, $matchedCityId);
        } catch (\Throwable $e) {
            Log::error('retailer zone sync failed for user_id=' . $userId . ': ' . $e->getMessage());
        }
    }
}
