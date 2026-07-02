<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\AdminToken;
use App\Models\BrandDistributorMapping;
use App\Models\RetailerAddressChangeRequest;
use App\Models\RetailerProfile;
use App\Models\Salesman;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class RetailerAddressChangeController extends Controller
{
    // ──────────────────────────────────────────────────────────────────────────
    //  Retailer side
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * POST /address-change-request
     * Retailer submits a request to change their shop address.
     * Broadcasts a push + in-app notification to all salesmen in the new city.
     */
    public function submitRequest(Request $request)
    {
        $retailer = auth('api-customers')->user();
        if (!$retailer) {
            return CommonHelper::responseError('unauthorized');
        }

        $validator = Validator::make($request->all(), [
            'new_address' => 'required|string|max:500',
            'new_city_id' => 'required|integer|exists:cities,id',
            'new_gps_lat' => 'required|numeric|between:-90,90',
            'new_gps_lng' => 'required|numeric|between:-180,180',
            'reason'      => 'nullable|string|max:500',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Block if a pending/assigned request already exists for this retailer
        $existing = RetailerAddressChangeRequest::where('user_id', $retailer->id)
            ->whereIn('status', ['pending', 'assigned'])
            ->first();
        if ($existing) {
            return CommonHelper::responseError('address_change_request_already_pending');
        }

        // Snapshot current address from retailer_profiles
        $profile = RetailerProfile::where('user_id', $retailer->id)->first();

        $changeRequest = RetailerAddressChangeRequest::create([
            'user_id'     => $retailer->id,
            'reason'      => $request->reason,
            'old_address' => $profile?->address,
            'old_city_id' => $profile?->city_id ?? null,
            'old_gps_lat' => $profile?->gps_lat ?? null,
            'old_gps_lng' => $profile?->gps_lng ?? null,
            'new_address' => $request->new_address,
            'new_city_id' => (int) $request->new_city_id,
            'new_gps_lat' => (float) $request->new_gps_lat,
            'new_gps_lng' => (float) $request->new_gps_lng,
            'status'      => 'pending',
        ]);

        // Broadcast to salesmen in the new city
        $this->notifySalesmenInCity((int) $request->new_city_id, $retailer, $changeRequest->id);

        return CommonHelper::responseWithData([
            'request_id' => $changeRequest->id,
            'status'     => 'pending',
        ]);
    }

    /**
     * GET /address-change-request/status
     * Retailer checks the status of their latest request.
     */
    public function myRequestStatus()
    {
        $retailer = auth('api-customers')->user();
        if (!$retailer) {
            return CommonHelper::responseError('unauthorized');
        }

        $req = RetailerAddressChangeRequest::where('user_id', $retailer->id)
            ->latest()
            ->first();

        if (!$req) {
            return CommonHelper::responseError('no_address_change_request_found');
        }

        return CommonHelper::responseWithData([
            'id'          => $req->id,
            'status'      => $req->status,
            'new_address' => $req->new_address,
            'new_city_id' => $req->new_city_id,
            'reason'      => $req->reason,
            'verified_at' => $req->verified_at?->toDateTimeString(),
            'created_at'  => $req->created_at->toDateTimeString(),
        ]);
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Salesman side
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * GET /salesman/address-change-requests
     * Lists pending address change requests in the salesman's distributor cities.
     */
    public function pendingRequests()
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) return CommonHelper::responseError('salesman_not_found');

        $cityIds = $this->territoryCityIds((int) $salesman->seller_id);
        if (empty($cityIds)) {
            return CommonHelper::responseWithData(['total' => 0, 'data' => []]);
        }

        $requests = RetailerAddressChangeRequest::with(['retailer:id,name,mobile', 'newCity:id,name'])
            ->whereIn('new_city_id', $cityIds)
            ->whereIn('status', ['pending', 'assigned'])
            ->where(function ($q) use ($salesman) {
                // Show unassigned requests + ones assigned to this salesman
                $q->whereNull('assigned_salesman_id')
                  ->orWhere('assigned_salesman_id', $salesman->id);
            })
            ->latest()
            ->get()
            ->map(fn ($r) => [
                'id'             => $r->id,
                'status'         => $r->status,
                'retailer'       => ['id' => $r->retailer?->id, 'name' => $r->retailer?->name, 'mobile' => $r->retailer?->mobile],
                'new_address'    => $r->new_address,
                'new_city'       => $r->newCity?->name,
                'new_gps_lat'    => $r->new_gps_lat,
                'new_gps_lng'    => $r->new_gps_lng,
                'reason'         => $r->reason,
                'requested_at'   => $r->created_at->toDateTimeString(),
                'is_mine'        => $r->assigned_salesman_id === $salesman->id,
            ]);

        return CommonHelper::responseWithData(['total' => $requests->count(), 'data' => $requests]);
    }

    /**
     * POST /salesman/address-change-requests/{id}/verify
     * Salesman visits the retailer's new location, takes storefront photo, and verifies.
     * On success: updates retailer_profiles + users with new address and resets salesman ownership.
     */
    public function verifyRequest(Request $request, int $id)
    {
        $salesman = $this->currentSalesman();
        if (!$salesman) return CommonHelper::responseError('salesman_not_found');

        $validator = Validator::make($request->all(), [
            'verified_lat'       => 'required|numeric|between:-90,90',
            'verified_lng'       => 'required|numeric|between:-180,180',
            'storefront_photo'   => 'required',
            'verification_notes' => 'nullable|string|max:1000',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $cityIds = $this->territoryCityIds((int) $salesman->seller_id);

        $changeRequest = RetailerAddressChangeRequest::whereIn('new_city_id', $cityIds)
            ->whereIn('status', ['pending', 'assigned'])
            ->find($id);

        if (!$changeRequest) {
            return CommonHelper::responseError('address_change_request_not_found');
        }

        // Atomic claim — only one salesman can verify
        $claimed = RetailerAddressChangeRequest::where('id', $id)
            ->whereIn('status', ['pending', 'assigned'])
            ->where(function ($q) use ($salesman) {
                $q->whereNull('assigned_salesman_id')
                  ->orWhere('assigned_salesman_id', $salesman->id);
            })
            ->update(['assigned_salesman_id' => $salesman->id, 'status' => 'assigned']);

        if (!$claimed) {
            return CommonHelper::responseError('already_being_verified_by_another_salesman');
        }

        // Handle storefront photo upload
        $photoPath = null;
        if ($request->hasFile('storefront_photo')) {
            $file      = $request->file('storefront_photo');
            $fileName  = time() . '_racr_' . $id . '.' . $file->getClientOriginalExtension();
            $photoPath = Storage::disk('public')->putFileAs('retailer_verifications', $file, $fileName);
        } elseif ($request->filled('storefront_photo')) {
            $photoPath = (string) $request->storefront_photo;
        }

        // Mark request as verified
        $changeRequest->refresh();
        $changeRequest->status                  = 'verified';
        $changeRequest->verified_lat            = (float) $request->verified_lat;
        $changeRequest->verified_lng            = (float) $request->verified_lng;
        $changeRequest->storefront_photo        = $photoPath;
        $changeRequest->verification_notes      = $request->verification_notes;
        $changeRequest->verified_by_salesman_id = $salesman->id;
        $changeRequest->verified_at             = Carbon::now();
        $changeRequest->save();

        // ── Update existing tables ONLY after verification ──────────────────

        // Update retailer_profiles with new address + GPS
        RetailerProfile::where('user_id', $changeRequest->user_id)->update([
            'address'                  => $changeRequest->new_address,
            'city_id'                  => $changeRequest->new_city_id,
            'gps_lat'                  => $changeRequest->new_gps_lat,
            'gps_lng'                  => $changeRequest->new_gps_lng,
            'verified_lat'             => $changeRequest->verified_lat,
            'verified_lng'             => $changeRequest->verified_lng,
            'storefront_photo'         => $photoPath,
            'verification_notes'       => $changeRequest->verification_notes,
            'verified_by_salesman_id'  => $salesman->id,
            'verified_at'              => $changeRequest->verified_at,
        ]);

        // Reassign retailer to the new verifying salesman
        User::where('id', $changeRequest->user_id)->update([
            'salesman_id'         => $salesman->id,
            'verification_status' => 'active',
        ]);

        // Notify the retailer
        try {
            $retailer = User::find($changeRequest->user_id);
            $tokens   = \App\Models\UserToken::where('user_id', $retailer->id)
                ->where('type', 'customer')
                ->get();
            if ($tokens->isNotEmpty()) {
                CommonHelper::sendNotificationByTemplate(
                    $tokens,
                    'retailer_verified_customer',
                    [
                        'shop_name'     => RetailerProfile::where('user_id', $retailer->id)->value('shop_name') ?? '',
                        'salesman_name' => $salesman->name ?? '',
                    ],
                    'retailer_activated',
                    0, '', null, null,
                    'retailer', $retailer->id
                );
            }
        } catch (\Throwable $e) {
            Log::error('address change retailer push failed: ' . $e->getMessage());
        }

        return CommonHelper::responseSuccess('address_change_verified');
    }

    // ──────────────────────────────────────────────────────────────────────────
    //  Helpers
    // ──────────────────────────────────────────────────────────────────────────

    private function currentSalesman(): ?Salesman
    {
        $admin = auth()->user();
        if (!$admin) return null;
        return Salesman::where('admin_id', $admin->id)->first();
    }

    private function territoryCityIds(int $sellerId): array
    {
        return BrandDistributorMapping::where('seller_id', $sellerId)
            ->pluck('city_id')->unique()->values()->all();
    }

    /**
     * Find all salesmen whose distributor serves the given city,
     * insert salesman_notifications rows, and send FCM push to each.
     */
    private function notifySalesmenInCity(int $cityId, User $retailer, int $requestId): void
    {
        try {
            // Distributors serving this city
            $sellerIds = BrandDistributorMapping::where('city_id', $cityId)
                ->pluck('seller_id')->unique()->values();

            if ($sellerIds->isEmpty()) return;

            // All salesmen under those distributors
            $salesmen = Salesman::whereIn('seller_id', $sellerIds)->where('status', 1)->get();

            if ($salesmen->isEmpty()) return;

            $profile     = RetailerProfile::where('user_id', $retailer->id)->first();
            $shopName    = $profile?->shop_name ?? $retailer->name ?? 'A retailer';
            $title       = 'Address Change Request';
            $message     = "{$shopName} has requested an address change. Please verify their new location.";

            foreach ($salesmen as $sm) {
                // In-app notification
                DB::table('salesman_notifications')->insert([
                    'salesman_id' => $sm->id,
                    'title'       => $title,
                    'message'     => $message,
                    'type'        => 'address_change_request',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                // FCM push
                $tokens = AdminToken::where('user_id', $sm->admin_id)
                    ->where('type', \App\Models\Role::$roleNameSalesman)
                    ->get();

                if ($tokens->isNotEmpty()) {
                    CommonHelper::sendNotificationByTemplate(
                        $tokens,
                        'retailer_verified_customer', // reuse closest template or add a dedicated one
                        ['shop_name' => $shopName, 'salesman_name' => ''],
                        'address_change_request',
                        0, '', null, null,
                        'address_change_request', $requestId
                    );
                }
            }
        } catch (\Throwable $e) {
            Log::error('notifySalesmenInCity failed: ' . $e->getMessage());
        }
    }
}
