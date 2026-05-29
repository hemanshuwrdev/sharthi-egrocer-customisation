<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Admin;
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

        // Format created_at after toArray() so JSON is not re-serialized as ISO by Eloquent date cast
        $sellers = $sellers->map(function (Seller $seller) {
            $row = $seller->toArray();
            $rawCreated = $seller->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
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
            'categories_ids' => 'required',
            'commission' => 'required',
            'national_id_card' => 'required|mimes:jpeg,jpg,png,gif,pdf',
            'address_proof' => 'required|mimes:jpeg,jpg,png,gif,pdf',
            'store_logo' => 'required|mimes:jpeg,jpg,png,gif',
            'city_id' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'pickup_store_address' => 'required_if:self_pickup_mode,1',
            'pickup_latitude' => 'required_if:self_pickup_mode,1',
            'pickup_longitude' => 'required_if:self_pickup_mode,1',
            'pickup_store_timings' => 'required_if:self_pickup_mode,1'
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
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
            $record->store_url = $request->store_url;
            $record->store_name = $request->store_name;
            $record->street = $request->street;
            $record->pincode_id = ($request->pincode_id) ?? 0;
            $record->city_id = $request->city_id;
            $record->categories = $request->categories_ids;
            $record->state = $request->state;
            $record->account_number = $request->account_number;
            $record->bank_ifsc_code = $request->ifsc_code;
            $record->bank_name = $request->bank_name;
            $record->account_name = $request->account_name;
            $record->commission = $request->commission;
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
            $record->view_order_otp = $request->view_order_otp;
            $record->assign_delivery_boy = $request->assign_delivery_boy;
            $record->change_order_status_delivered = $request->change_order_status_delivered;
            $record->self_pickup_mode = $request->self_pickup_mode ?? 0;
            $record->pickup_store_address = $request->pickup_store_address;
            $record->pickup_latitude = $request->pickup_latitude;
            $record->pickup_longitude = $request->pickup_longitude;
            $record->pickup_store_timings = $request->pickup_store_timings;
            $record->door_step_mode = $request->door_step_mode ?? 1;

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

        if ($seller->city_id && $seller->admin && $seller->admin->seller) {
            $cityIds = explode(',', $seller->city_id);
            $cities = City::whereIn('id', $cityIds)->get(['id', 'name']);

            $seller->admin->seller->cities = $cities;
        }

        Seller::setOptimizedResponse(false);

        return CommonHelper::responseWithData($seller);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'email|required|unique:admins,email,' . $request->admin_id,
            'mobile' => 'required|numeric',
            'confirm_password' => 'same:password',
            'store_name' => 'required',
            'categories_ids' => 'required',
            'commission' => 'required',
            'city_id' => 'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'pickup_store_address' => 'required_if:self_pickup_mode,1',
            'pickup_latitude' => 'required_if:self_pickup_mode,1',
            'pickup_longitude' => 'required_if:self_pickup_mode,1',
            'pickup_store_timings' => 'required_if:self_pickup_mode,1'
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        if ($request->self_pickup_mode == 0 && $request->door_step_mode == 0) {
            return CommonHelper::responseError('at_least_one_delivery_mode_must_be_enabled');
        }
        if (isset($request->id)) {
            $record = Seller::find($request->id);

            if ($record) {

                $oldStatus = $record->status;
                DB::beginTransaction();

                $data = array();
                $data['username'] = $request->name;
                $data['email'] = $request->email;

                if (isset($request->password) && $request->password != "") {

                    $data['password'] = bcrypt($request->password);
                }
                Admin::where('id', $request->admin_id)->update($data);

                $record->name = $request->name;
                $record->email = $request->email;

                $record->mobile = $request->mobile;

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
                $record->city_id = $request->city_id;
                $record->categories = $request->categories_ids;
                $record->state = $request->state;
                $record->account_number = $request->account_number;
                $record->bank_ifsc_code = $request->ifsc_code;
                $record->bank_name = $request->bank_name;
                $record->account_name = $request->account_name;
                $record->commission = $request->commission;
                $record->tax_name = $request->tax_name;
                $record->tax_number = $request->tax_number;
                $record->pan_number = $request->pan_number;
                $record->latitude = $request->latitude;
                $record->longitude = $request->longitude;
                $record->place_name = $request->place_name;
                $record->formatted_address = $request->formatted_address;
                $record->require_products_approval = $request->require_products_approval;
                $record->customer_privacy = $request->customer_privacy;
                $record->view_order_otp = $request->view_order_otp;
                $record->assign_delivery_boy = $request->assign_delivery_boy;
                $record->change_order_status_delivered = $request->change_order_status_delivered;
                $record->self_pickup_mode = $request->self_pickup_mode ?? 0;
                $record->pickup_store_address = $request->pickup_store_address;
                $record->pickup_latitude = $request->pickup_latitude;
                $record->pickup_longitude = $request->pickup_longitude;
                $record->pickup_store_timings = $request->pickup_store_timings;
                $record->door_step_mode = $request->door_step_mode ?? 1;

                $record->status = $request->status;
                if ($request->status == Seller::$statusActive || $request->status == Seller::$statusRegistered) {
                    $record->remark = null;
                } else {
                    $record->remark = $request->remark;
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
}
