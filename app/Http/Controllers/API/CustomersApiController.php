<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Area;
use App\Models\User;
use App\Services\RetailerOnboardingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CustomersApiController extends Controller
{
    public function getCustomers(Request $request)
    {

        $limit = $request->get('limit', 5);
        $offset = $request->get('offset', 0);

        $query = User::with('retailerProfile.area')->where('status', '!=', 2);

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%')
                    ->orWhere('mobile', 'like', '%' . $searchTerm . '%')
                    ->orWhere('balance', 'like', '%' . $searchTerm . '%')
                    ->orWhere('referral_code', 'like', '%' . $searchTerm . '%')
                    ->orWhere('friends_code', 'like', '%' . $searchTerm . '%')
                    ->orWhere('status', 'like', '%' . $searchTerm . '%');
            });
        }

        // Apply sorting
        if ($request->has('sort_by')) {
            $sortColumn = $request->input('sort_by', 'id');
            $sortDirection = $request->input('sort_dir', 'desc dvfd');
            $query->orderBy($sortColumn, $sortDirection);
        }

        // Get the total count for pagination
        $total = $query->count();
        $customers = $query->get();

        $customersForResponse = $customers->map(function (User $user) {
            $row = $user->toArray();
            $rawCreated = $user->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            return $row;
        });

        return CommonHelper::responseWithData($customersForResponse, $total);
    }
    public function changeStatus(Request $request)
    {
        if (isset($request->id)) {
            $customers = User::find($request->id);
            if ($customers) {
                $customers->status = ($customers->status == 1) ? 0 : 1;
                $customers->save();
                return CommonHelper::responseSuccess('customers_status_updated_successfully');
            } else {
                return CommonHelper::responseSuccess('customer_record_not_found');
            }
        }
    }

    /**
     * GET customers/edit/{id} — one retailer with their profile, for the admin edit form.
     */
    public function edit($id)
    {
        if ($this->lacksPermission('customer_update')) {
            return CommonHelper::responseError('unauthorized_access');
        }

        $user = User::with('retailerProfile.area')->find($id);
        if (!$user || $user->verification_status === null || !$user->retailerProfile) {
            return CommonHelper::responseError('retailer_not_found');
        }

        return CommonHelper::responseWithData($user);
    }

    /**
     * POST customers/save — admin adds a retailer. `is_verified` = 1 makes them 'active' right away
     * (no salesman visit); 0 leaves them 'pending' for a salesman, exactly like a self-registration.
     */
    public function save(Request $request, RetailerOnboardingService $onboarding)
    {
        if ($this->lacksPermission('customer_create')) {
            return CommonHelper::responseError('unauthorized_access');
        }

        $verified = $request->boolean('is_verified');
        // Skipping the salesman visit is its own permission, even at create time.
        if ($verified && $this->lacksPermission('customer_verify')) {
            return CommonHelper::responseError('unauthorized_access');
        }

        $validator = Validator::make($request->all(), $this->retailerRules($request), [
            'mobile.unique' => 'mobile_number_already_taken',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $onboarding->createRetailer($this->retailerData($request), (int) auth()->id(), $verified);
        } catch (\DomainException $e) {
            return CommonHelper::responseError($e->getMessage());
        } catch (\Throwable $e) {
            Log::error('admin createRetailer failed: ' . $e->getMessage());
            return CommonHelper::responseError('something_went_wrong');
        }

        return CommonHelper::responseSuccess($verified ? 'retailer_created_and_verified_successfully' : 'retailer_created_successfully');
    }

    /**
     * POST customers/update — admin edits a retailer's details, address and location.
     */
    public function update(Request $request, RetailerOnboardingService $onboarding)
    {
        if ($this->lacksPermission('customer_update')) {
            return CommonHelper::responseError('unauthorized_access');
        }

        $user = User::find($request->id);
        if (!$user || $user->verification_status === null) {
            return CommonHelper::responseError('retailer_not_found');
        }

        $validator = Validator::make($request->all(), $this->retailerRules($request, $user->id), [
            'mobile.unique' => 'mobile_number_already_taken',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        try {
            $onboarding->updateRetailer($user, $this->retailerData($request));
        } catch (\DomainException $e) {
            return CommonHelper::responseError($e->getMessage());
        } catch (\Throwable $e) {
            Log::error('admin updateRetailer failed: ' . $e->getMessage());
            return CommonHelper::responseError('something_went_wrong');
        }

        return CommonHelper::responseSuccess('retailer_updated_successfully');
    }

    /**
     * POST customers/verify — admin approves a pending retailer without a salesman visit.
     */
    public function verify(Request $request, RetailerOnboardingService $onboarding)
    {
        if ($this->lacksPermission('customer_verify')) {
            return CommonHelper::responseError('unauthorized_access');
        }

        $user = User::find($request->id);
        if (!$user || $user->verification_status === null) {
            return CommonHelper::responseError('retailer_not_found');
        }

        try {
            $onboarding->approveByAdmin($user, (int) auth()->id());
        } catch (\DomainException $e) {
            return CommonHelper::responseError($e->getMessage());
        } catch (\Throwable $e) {
            Log::error('admin approveRetailer failed: ' . $e->getMessage());
            return CommonHelper::responseError('something_went_wrong');
        }

        return CommonHelper::responseSuccess('retailer_verified_successfully');
    }

    /**
     * The panel's API routes only check that someone is logged in; the permission is enforced here
     * so a distributor/driver login can't call these endpoints directly.
     */
    private function lacksPermission(string $permission): bool
    {
        $admin = auth()->user();

        return !$admin || !in_array($permission, $admin->allPermissions ?? [], true);
    }

    private function retailerRules(Request $request, ?int $ignoreUserId = null): array
    {
        $countryCode = RetailerOnboardingService::normalizeCountryCode($request->input('country_code'));

        return [
            'country_code'  => 'required|string',
            'mobile'        => [
                'required', 'numeric',
                Rule::unique('users', 'mobile')
                    ->ignore($ignoreUserId)
                    ->where(fn ($q) => $q->where('country_code', $countryCode))
                    ->whereNull('deleted_at'),
            ],
            'shop_name'     => 'required|string|max:160',
            'party_name'    => 'required|string|max:160',
            'gst_no'        => 'nullable|string|max:32',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city'          => 'nullable|string|max:191',
            'state'         => 'nullable|string|max:191',
            // Area decides which area-scoped distributors can see the retailer, so it is required
            // whenever areas are set up at all.
            'area_id'       => [Rule::requiredIf(fn () => Area::where('status', 1)->exists()), 'nullable', 'integer', 'exists:areas,id'],
            'gps_lat'       => 'required|numeric|between:-90,90',
            'gps_lng'       => 'required|numeric|between:-180,180',
        ];
    }

    private function retailerData(Request $request): array
    {
        return $request->only([
            'country_code', 'mobile', 'shop_name', 'party_name', 'gst_no',
            'address_line1', 'address_line2', 'city', 'state', 'area_id', 'gps_lat', 'gps_lng',
        ]);
    }
}
