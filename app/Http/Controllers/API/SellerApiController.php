<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Brand;
use App\Models\BrandDistributorMapping;
use App\Models\City;
use App\Models\OrderItem;
use App\Models\Role;
use App\Models\Seller;
use App\Models\SellerWalletTransaction;
use App\Models\Setting;
use App\Services\LanguageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class SellerApiController extends Controller
{
    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }
    public function getSellers(Request $request)
    {
        $filterStatus = $request->filterStatus;
        $search = $request->search;

        // Eager load translations for all sellers
        $sellers = Seller::withAllTranslations()->with('city', 'categories');

        if (isset($filterStatus) && $filterStatus !== "") {
            if (!is_array($filterStatus)) {
                $filterStatus = [$filterStatus];
            }
            $sellers = $sellers->whereIn("status", $filterStatus);
        }

        if ($search) {
            $sellers = $sellers->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('store_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%");

                if (is_numeric($search)) {
                    $query->orWhere('id', $search);
                }

                // Map status keywords
                $searchLower = strtolower($search);
                $statusMap = [
                    'registered' => 0,
                    'approved' => 1,
                    'active' => 1,
                    'rejected' => 2,
                    'not approved' => 2,
                    'deactive' => 3,
                    'deactivated' => 3,
                    'blocked' => 4,
                    'removed' => 7,
                ];

                foreach ($statusMap as $keyword => $statusId) {
                    if (str_contains($keyword, $searchLower) || str_contains($searchLower, $keyword)) {
                        $query->orWhere('status', $statusId);
                    }
                }
            });
        }

        $sellers = $sellers->orderBy('id', 'DESC')->get();

        // Bulk-load cities with zone for all sellers (city_id is comma-separated)
        $allCityIds = $sellers->flatMap(function ($s) {
            return $s->city_id ? array_filter(array_map('intval', explode(',', $s->city_id))) : [];
        })->unique()->values()->toArray();

        $citiesMap = $allCityIds
            ? City::whereIn('id', $allCityIds)->get(['id', 'name', 'zone'])->keyBy('id')
            : collect();

        // Format created_at after toArray() so JSON is not re-serialized as ISO by Eloquent date cast
        $sellers = $sellers->map(function (Seller $seller) use ($citiesMap) {
            $row = $seller->toArray();
            $rawCreated = $seller->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            $cityIds = $seller->city_id ? array_filter(array_map('intval', explode(',', $seller->city_id))) : [];
            $row['cities'] = collect($cityIds)->map(fn($id) => $citiesMap->get($id))->filter()->values()->toArray();
            return $row;
        });

        return CommonHelper::responseWithData($sellers);
    }

    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'email|required|unique:admins',
            'mobile' => 'required|numeric',
            'password' => 'min:6|required_with:confirm_password|same:confirm_password',
            'store_name' => 'required',
            'brand_ids' => 'required',
            'commission' => 'required',
            'national_id_card' => 'required|mimes:jpeg,jpg,png,gif,pdf',
            'address_proof' => 'required|mimes:jpeg,jpg,png,gif,pdf',
            'store_logo' => 'required|mimes:jpeg,jpg,png,gif',
            'city_id' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
            // 'pickup_store_address' => 'required_if:self_pickup_mode,1',
            // 'pickup_latitude' => 'required_if:self_pickup_mode,1',
            // 'pickup_longitude' => 'required_if:self_pickup_mode,1',
            // 'pickup_store_timings' => 'required_if:self_pickup_mode,1',
            'upi_id'     => ['nullable', 'regex:/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/'],
            'upi_mobile' => 'nullable|digits:10',
            'upi_name'   => 'nullable|string|max:100',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $brandIds = $this->parseIdList($request->brand_ids);
        $cityIds = $this->parseIdList($request->city_id);
        $conflict = $this->getBrandCityConflict($brandIds, $cityIds, null);
        if ($conflict) {
            return CommonHelper::responseError($conflict);
        }

        DB::beginTransaction();
        try {
            $data = array();
            $data['username'] = $request->name;
            $data['email'] = $request->email;
            $data['password'] = bcrypt($request->password);
            $data['role_id'] = Role::$roleSeller;
            $data['created_by'] = 0;
            $admin = Admin::create($data);

            $record = new Seller();
            $record->admin_id = $admin->id;
            $record->name = $request->name;
            $record->email = $request->email;
            $record->mobile = $request->mobile;
            $record->country_code = $request->country_code ?? '+91';
            $record->store_url = $request->store_url;
            $record->store_name = $request->store_name;
            $record->street = $request->street;
            $record->pincode_id = ($request->pincode_id) ?? 0;
            $record->city_id = $request->city_id;
            $record->state = $request->state;
            $record->bank_name = $request->bank_name;
            $record->account_number = $request->account_number;
            $record->bank_ifsc_code = $request->bank_ifsc_code ?? $request->ifsc_code;
            $record->account_name = $request->account_name;
            $record->upi_id     = $request->upi_id;
            $record->upi_mobile = $request->upi_mobile;
            $record->upi_name   = $request->upi_name;
            // Some app clients send the literal string "null" instead of omitting the
            // field or sending an empty value, which MySQL's int column rejects outright.
            $record->commission = is_numeric($request->commission) ? $request->commission : null;
            $record->tax_name = $request->tax_name;
            $record->tax_number = $request->tax_number;
            $record->pan_number = $request->pan_number;
            $record->latitude = $request->latitude;
            $record->longitude = $request->longitude;
            $record->place_name = $request->place_name;
            $record->formatted_address = $request->formatted_address;

            // Get default language to check if this is default language save
            $defaultLanguage = $this->languageService->getDefaultLanguage();
            $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

            // Only save translatable fields to main table if default language
            if ($isDefaultLanguage) {
                $record->name = $request->name;
                $record->store_name = $request->store_name;
                $record->store_description = $request->store_description;
            } else {
                // For non-default languages, keep existing values or set defaults
                if (!$record->name) {
                    $record->name = $request->name;
                }
                if (!$record->store_name) {
                    $record->store_name = $request->store_name;
                }
                if (!$record->store_description) {
                    $record->store_description = $request->store_description;
                }
            }

            $record->require_products_approval = $request->require_products_approval;
            $record->customer_privacy = $request->customer_privacy;
            // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
            // $record->self_pickup_mode = $request->self_pickup_mode ?? 0;
            // $record->pickup_store_address = $request->pickup_store_address;
            // $record->pickup_latitude = $request->pickup_latitude;
            // $record->pickup_longitude = $request->pickup_longitude;
            // $record->pickup_store_timings = $request->pickup_store_timings;
            // $record->door_step_mode = $request->door_step_mode ?? 1;

            $record->status = Seller::$statusActive;
            if ($record->status == Seller::$statusActive || $record->status == Seller::$statusRegistered) {
                $record->remark = null;
            }
            $record->slug = Str::slug($request->name);

            if ($request->hasFile('store_logo')) {
                $file = $request->file('store_logo');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('sellers', $file, $fileName);
                $record->logo = $image;
            }

            if ($request->hasFile('national_id_card')) {
                $file = $request->file('national_id_card');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('sellers', $file, $fileName);
                $record->national_identity_card = $image;
            }

            if ($request->hasFile('address_proof')) {
                $file = $request->file('address_proof');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('sellers', $file, $fileName);
                $record->address_proof = $image;
            }
            $record->save();

            $this->syncBrandDistributorMappings($record, $brandIds, $cityIds);

            // Save translations - can accept single language_id or multiple translations array (JSON string)
            if ($request->has('translations')) {
                $translations = $request->translations;

                // If translations is a JSON string, decode it
                if (is_string($translations)) {
                    $translations = json_decode($translations, true);
                }

                // Multiple translations sent as array
                if (is_array($translations)) {
                    foreach ($translations as $translation) {
                        if (isset($translation['language_id'])) {
                            $translationData = [
                                'name' => $translation['name'] ?? '',
                                'store_name' => $translation['store_name'] ?? '',
                                'store_description' => $translation['store_description'] ?? '',
                            ];
                            $record->saveTranslation($translation['language_id'], $translationData);
                        }
                    }
                }
            } elseif ($request->has('language_id')) {
                // Single translation (backward compatibility)
                $translationData = [
                    'name' => $request->name ?? '',
                    'store_name' => $request->store_name ?? '',
                    'store_description' => $request->store_description ?? '',
                ];
                $record->saveTranslation($request->language_id, $translationData);
            }

            $conflict = CommonHelper::claimMobile($record->mobile, \App\Models\MobileRegistry::ROLE_SELLER, $record->id);
            if ($conflict) {
                DB::rollBack();
                return CommonHelper::responseError($conflict);
            }

            DB::commit();
        } catch (\Exception $e) {
            Log::info("Error : " . $e->getMessage());
            DB::rollBack();
            return CommonHelper::responseError("Something Went Wrong!");
        }

        try {
            CommonHelper::sendMailAdminStatus("seller", $record, $record->status, $request->email);
        } catch (\Exception $e) {
            Log::error("Add Seller status send mail error", [$e->getMessage()]);
        }

        // Return seller ID in response so frontend can save translations for other languages
        return CommonHelper::responseSuccessWithData('seller_saved_successfully', ['id' => $record->id]);
    }
    public function edit($id)
    {
        // Eager load translations for edit modal
        $seller = Seller::with('admin', 'translations')->where('id', $id)->first();

        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        // Load all assigned cities with zone so the edit form can pre-populate the zone step
        $cityIds = $seller->city_id ? array_filter(array_map('intval', explode(',', $seller->city_id))) : [];
        $cities = $cityIds ? City::whereIn('id', $cityIds)->get(['id', 'name', 'zone']) : collect();
        $seller->cities = $cities;
        $seller->brand_ids = BrandDistributorMapping::where('seller_id', $seller->id)->distinct()->pluck('brand_id');
        // Full brand objects (not just IDs) so API consumers (mobile app) can render
        // brand tags directly without a second lookup.
        $seller->brands = Brand::whereIn('id', $seller->brand_ids)->get(['id', 'name', 'image']);

        Seller::setOptimizedResponse(false);

        return CommonHelper::responseWithData($seller);
    }

    public function update(Request $request)
    {
        try{
        $record = isset($request->id) ? Seller::find($request->id) : null;

        // Distributors manage their own profile via this same endpoint, but brand
        // mapping and service zones/cities are an admin-controlled assignment —
        // a distributor must not be able to reassign themselves to other brands
        // or expand/change their own coverage area. Ignore those fields from a
        // seller-authenticated request and keep whatever is already on file.
        $isSellerCaller = (int) (auth()->user()->role_id ?? 0) === (int) Role::$roleSeller;

        // Ignore the record's own admin row when checking email uniqueness — derive it
        // from the fetched record itself (not $request->admin_id, which the caller can
        // omit, silently breaking the "exclude myself" exception and causing a false
        // "email already taken" on an unchanged email).
        $adminIdForUniqueCheck = $record->admin_id ?? $request->admin_id;

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'email|required|unique:admins,email,' . $adminIdForUniqueCheck,
            'mobile' => 'required|numeric',
            'confirm_password' => 'same:password',
            'store_name' => 'required',
            'brand_ids' => $isSellerCaller ? 'nullable' : 'required',
            'commission' => 'required',
            'city_id' => 'nullable',
            'latitude' => 'required',
            'longitude' => 'required',
            // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
            // 'pickup_store_address' => 'required_if:self_pickup_mode,1',
            // 'pickup_latitude' => 'required_if:self_pickup_mode,1',
            // 'pickup_longitude' => 'required_if:self_pickup_mode,1',
            // 'pickup_store_timings' => 'required_if:self_pickup_mode,1',
            'upi_id'     => ['nullable', 'regex:/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/'],
            'upi_mobile' => 'nullable|digits:10',
            'upi_name'   => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
        // if ($request->self_pickup_mode == 0 && $request->door_step_mode == 0) {
        //     return CommonHelper::responseError('at_least_one_delivery_mode_must_be_enabled');
        // }
        if (isset($request->id)) {
            if ($record) {

                if ($isSellerCaller) {
                    $brandIds = BrandDistributorMapping::where('seller_id', $record->id)->pluck('brand_id')->unique()->values()->all();
                    $cityIds = $this->parseIdList($record->city_id);
                } else {
                    $brandIds = $this->parseIdList($request->brand_ids);
                    $cityIds = $this->parseIdList($request->filled('city_id') ? $request->city_id : $record->city_id);
                }
                $conflict = $this->getBrandCityConflict($brandIds, $cityIds, $record->id);
                if ($conflict) {
                    return CommonHelper::responseError($conflict);
                }

                $oldStatus = $record->status;
                DB::beginTransaction();

                $data = array();
                $data['username'] = $request->name;
                $data['email'] = $request->email;

                if (isset($request->password) && $request->password != "") {

                    $data['password'] = bcrypt($request->password);
                }
                // Use the record's own admin_id, not $request->admin_id — the app doesn't
                // always send it, which would silently match zero rows here and leave the
                // admins.email/username login credentials out of sync with sellers.email.
                Admin::where('id', $record->admin_id)->update($data);

                $record->name = $request->name;
                $record->email = $request->email;

                $record->mobile = $request->mobile;
                $record->country_code = $request->country_code ?? $record->country_code;

                // Get default language to check if this is default language update
                $defaultLanguage = $this->languageService->getDefaultLanguage();
                $isDefaultLanguage = ($request->language_id == $defaultLanguage->id);

                // Only update translatable fields in main table if default language
                if ($isDefaultLanguage) {
                    $record->name = $request->name;
                    $record->store_name = $request->store_name;
                    $record->store_description = $request->store_description;
                }

                $record->store_url = $request->store_url;
                $record->street = $request->street;
                $record->pincode_id = ($request->pincode_id) ?? 0;
                if (!$isSellerCaller && $request->filled('city_id')) {
                    $record->city_id = $request->city_id;
                }
                $record->state = $request->state;
                $record->bank_name = $request->bank_name;
                $record->account_number = $request->account_number;
                $record->bank_ifsc_code = $request->bank_ifsc_code ?? $request->ifsc_code;
                $record->account_name = $request->account_name;
                $record->upi_id     = $request->upi_id;
                $record->upi_mobile = $request->upi_mobile;
                $record->upi_name   = $request->upi_name;
                // Some app clients send the literal string "null" instead of omitting the
            // field or sending an empty value, which MySQL's int column rejects outright.
            $record->commission = is_numeric($request->commission) ? $request->commission : null;
                $record->tax_name = $request->tax_name;
                $record->tax_number = $request->tax_number;
                $record->pan_number = $request->pan_number;
                $record->latitude = $request->latitude;
                $record->longitude = $request->longitude;
                $record->place_name = $request->place_name;
                $record->formatted_address = $request->formatted_address;
                // require_products_approval is NOT NULL in the DB — only overwrite it when
                // the request actually sends a value, so a partial self-profile save from
                // an app that doesn't touch this field doesn't null it out.
                if ($request->filled('require_products_approval')) {
                    $record->require_products_approval = $request->require_products_approval;
                }
                $record->customer_privacy = $request->customer_privacy;
                // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
                // $record->self_pickup_mode = $request->self_pickup_mode ?? 0;
                // $record->pickup_store_address = $request->pickup_store_address;
                // $record->pickup_latitude = $request->pickup_latitude;
                // $record->pickup_longitude = $request->pickup_longitude;
                // $record->pickup_store_timings = $request->pickup_store_timings;
                // $record->door_step_mode = $request->door_step_mode ?? 1;

                // status is an admin-controlled approval state — a distributor's own
                // self-profile save doesn't (and shouldn't) send it. Only apply it when
                // actually provided, so a self-save doesn't null out the existing status.
                if ($request->filled('status')) {
                    $record->status = $request->status;
                    if ($request->status == Seller::$statusActive || $request->status == Seller::$statusRegistered) {
                        $record->remark = null;
                    } else {
                        $record->remark = $request->remark;
                    }
                }
                $record->slug = Str::slug($request->name);

                if ($request->hasFile('store_logo')) {
                    $file = $request->file('store_logo');
                    $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                    $image = Storage::disk('public')
                        ->putFileAs('sellers', $file, $fileName);
                    $record->logo = $image;
                }
                if ($request->hasFile('national_id_card')) {
                    $file = $request->file('national_id_card');
                    $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                    $image = Storage::disk('public')->putFileAs('sellers', $file, $fileName);
                    $record->national_identity_card = $image;
                }
                if ($request->hasFile('address_proof')) {
                    $file = $request->file('address_proof');
                    $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                    $image = Storage::disk('public')->putFileAs('sellers', $file, $fileName);
                    $record->address_proof = $image;
                }
                $record->save();

                $this->syncBrandDistributorMappings($record, $brandIds, $cityIds);

                // Save/update translations - can accept single language_id or multiple translations array (JSON string)
                if ($request->has('translations')) {
                    $translations = $request->translations;

                    // If translations is a JSON string, decode it
                    if (is_string($translations)) {
                        $translations = json_decode($translations, true);
                    }

                    // Multiple translations sent as array
                    if (is_array($translations)) {
                        foreach ($translations as $translation) {
                            if (isset($translation['language_id'])) {
                                $translationData = [
                                    'name' => $translation['name'] ?? '',
                                    'store_name' => $translation['store_name'] ?? '',
                                    'store_description' => $translation['store_description'] ?? '',
                                ];
                                $record->saveTranslation($translation['language_id'], $translationData);
                            }
                        }
                    }
                } elseif ($request->has('language_id')) {
                    // Single translation (backward compatibility)
                    $translationData = [
                        'name' => $request->name ?? '',
                        'store_name' => $request->store_name ?? '',
                        'store_description' => $request->store_description ?? '',
                    ];
                    $record->saveTranslation($request->language_id, $translationData);
                }

                $conflict = CommonHelper::claimMobile($record->mobile, \App\Models\MobileRegistry::ROLE_SELLER, $record->id);
                if ($conflict) {
                    DB::rollBack();
                    return CommonHelper::responseError($conflict);
                }

                DB::commit();

                if ($oldStatus !== $record->status) {
                    try {
                        CommonHelper::sendMailAdminStatus("seller", $record, $record->status, $request->email);
                    } catch (\Exception $e) {
                        Log::error("Seller Update status send mail error", [$e->getMessage()]);
                    }
                }
            } else {
                return CommonHelper::responseSuccess('seller_not_found');
            }
        }
        return CommonHelper::responseSuccess('seller_updated_successfully');
        } catch (\Exception $e) {
            return CommonHelper::responseError($e->getMessage());
        }
    }

    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $seller = Seller::find($request->id);
            if ($seller) {
                @Storage::disk('public')->delete($seller->logo);
                @Storage::disk('public')->delete($seller->national_identity_card);
                @Storage::disk('public')->delete($seller->address_proof);
                $seller->delete();
                CommonHelper::releaseMobile(\App\Models\MobileRegistry::ROLE_SELLER, $seller->id);
                return CommonHelper::responseSuccess('seller_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess("Seller Already Deleted!");
            }
        }
    }

    public function updateStatus(Request $request)
    {
        $seller_id = $request->id ?? auth()->user()->seller->id ?? null;

        if ($seller_id) {
            $seller = Seller::find($seller_id);

            if ($seller) {
                $seller->status = (int) $request->status; // Ensure status is an integer
                $seller->remark = $request->remark ?? "";
                $seller->save();

                // Match status with strict comparison
                $status_name = match ((int) $request->status) {
                    Seller::$statusActive => Seller::$Active,
                    Seller::$statusDeactivated => Seller::$Deactivated,
                    Seller::$statusRejected => Seller::$Rejected,
                    Seller::$statusRegistered => Seller::$Registered,
                    Seller::$statusRemoved => Seller::$Removed,
                    Seller::$statusBlocked => Seller::$Blocked,
                    default => 'Unknown Status', // Handles unexpected cases
                };

                // Send admin notification email
                $user = Admin::find($seller->admin_id);
                if ($user) {
                    try {
                        CommonHelper::sendMailAdminStatus("seller", $seller, $seller->status, $user->email);
                    } catch (\Exception $e) {
                        Log::error("Approve Seller status send mail error", [$e->getMessage()]);
                    }
                }

                return CommonHelper::responseSuccess("Seller " . $status_name . " Successfully!");
            } else {
                return CommonHelper::responseError('seller_not_found');
            }
        }

        return CommonHelper::responseError("Seller ID is required.");
    }
    public function getStatus(Request $request)
    {
        $seller_id = $request->id ?? auth()->user()->seller->id ?? null;

        if (!$seller_id) {
            return CommonHelper::responseError("Seller ID is required.");
        }

        $seller = Seller::find($seller_id);

        if (!$seller) {
            return CommonHelper::responseError('seller_not_found');
        }

        $data = ['status' => $seller->status,'remark' => $seller->remark ?? ""];

        return CommonHelper::responseWithData($data);
    }

    public function getSellerCommission()
    {
        $settings = Setting::where('variable', 'seller_commission')->first();
        if (!empty($settings) && $settings->count() !== 0) {
            return CommonHelper::responseWithData($settings);
        } else {
            return CommonHelper::responseError('seller_s_commission_not_available');
        }
    }

    /**
     * Parse a comma-separated / array id list (as sent via FormData) into a clean array of ints.
     */
    private function parseIdList($value)
    {
        if (is_array($value)) {
            $ids = $value;
        } else {
            $ids = explode(',', (string) $value);
        }

        return collect($ids)
            ->map(fn($id) => (int) trim($id))
            ->filter(fn($id) => $id > 0)
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Check whether any of $brandIds is already mapped to a DIFFERENT seller in any of $cityIds,
     * for a brand that does not allow overlap. Mirrors the check in SuperAdminCustomApiController::saveBrandMappings.
     */
    private function getBrandCityConflict(array $brandIds, array $cityIds, $excludeSellerId)
    {
        if (empty($brandIds) || empty($cityIds)) {
            return null;
        }

        $brands = Brand::whereIn('id', $brandIds)->get()->keyBy('id');

        foreach ($brandIds as $brandId) {
            $brand = $brands->get($brandId);
            if (!$brand || $brand->is_overlap_allowed) {
                continue;
            }

            $conflict = BrandDistributorMapping::where('brand_id', $brandId)
                ->whereIn('city_id', $cityIds)
                ->when($excludeSellerId, fn($q) => $q->where('seller_id', '!=', $excludeSellerId))
                ->with('city')
                ->first();

            if ($conflict) {
                $cityName = $conflict->city->name ?? $conflict->city_id;
                return "{$brand->name} is already assigned to another distributor in {$cityName}";
            }
        }

        return null;
    }

    /**
     * Sync brand_distributor_mappings rows for this seller to exactly match the submitted
     * brand_ids x the seller's city_ids. Assumes conflicts were already checked before saving the seller.
     */
    private function syncBrandDistributorMappings(Seller $seller, array $brandIds, array $cityIds)
    {
        // Drop mappings for brands no longer selected
        BrandDistributorMapping::where('seller_id', $seller->id)
            ->whereNotIn('brand_id', $brandIds ?: [0])
            ->delete();

        foreach ($brandIds as $brandId) {
            // Drop mappings for cities no longer assigned to this seller
            BrandDistributorMapping::where('seller_id', $seller->id)
                ->where('brand_id', $brandId)
                ->whereNotIn('city_id', $cityIds ?: [0])
                ->delete();

            foreach ($cityIds as $cityId) {
                BrandDistributorMapping::firstOrCreate([
                    'brand_id' => $brandId,
                    'seller_id' => $seller->id,
                    'city_id' => $cityId,
                ]);
            }
        }
    }
}
