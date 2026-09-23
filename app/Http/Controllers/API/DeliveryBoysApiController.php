<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\DeliveryBoy;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusList;
use App\Models\Role;
use App\Models\Seller;
use App\Services\LanguageService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DeliveryBoysApiController extends Controller
{
    // Per-item reason for delivered_quantity < quantity, set on markPartialDelivery.
    public const SHORTFALL_REASONS = [
        'product_damaged',
        'product_shortage',
        'product_not_available',
        'rejected_by_retailer',
        'qty_mismatch_packing_issue',
    ];

    protected $languageService;

    public function __construct(LanguageService $languageService)
    {
        $this->languageService = $languageService;
    }

    /**
     * A seller-authenticated caller may only act on their own drivers. Admins
     * (not tied to a seller) can access any driver.
     */
    private function canAccessDeliveryBoy(DeliveryBoy $deliveryBoy): bool
    {
        $seller = \App\Models\Seller::where('admin_id', auth()->id())->first();
        if (!$seller) {
            return true;
        }
        return (int) $deliveryBoy->seller_id === (int) $seller->id;
    }

    /**
     * A driver linked to an active (not completed/cancelled) loading slip, or
     * with an order currently out for delivery, can't be deleted.
     */
    private function deliveryBoyDeletionBlockReason(int $deliveryBoyId): ?string
    {
        $hasActiveLoadingSlip = \App\Models\LoadingSlip::where('driver_id', $deliveryBoyId)
            ->whereIn('status', [0, 1]) // Created, Dispatched
            ->exists();
        if ($hasActiveLoadingSlip) {
            return 'delivery_boy_has_active_loading_slip';
        }

        $hasActiveOrder = Order::where('delivery_boy_id', $deliveryBoyId)
            ->where('active_status', OrderStatusList::$outForDelivery)
            ->exists();
        if ($hasActiveOrder) {
            return 'delivery_boy_has_assigned_order';
        }

        return null;
    }

    public function getDeliveryBoyBonusSettings()
    {
        $bonus = CommonHelper::getDeliveryBoyBonusSettings();
        if (empty($bonus)) {
            return CommonHelper::responseError("Default bonus not found.");
        }
        return CommonHelper::responseWithData($bonus);
    }

    public function getDeliveryBoy(Request $request)
    {
        $query = DeliveryBoy::withAllTranslations()
            ->with(['admin', 'city', 'cities:cities.id,cities.name'])
            ->orderBy('id', 'DESC');

        // Distributors must only see their own drivers, not every driver on the
        // platform. Admins (not tied to a seller) still see the full list.
        $seller = \App\Models\Seller::where('admin_id', auth()->id())->first();
        if ($seller) {
            $query->where('seller_id', $seller->id);
        }

        if ($request->filled('filterStatus')) {
            $query->where('status', $request->filterStatus);
        }

        if ($request->filled('city_id')) {
            $query->servingCities([(int) $request->city_id])
                ->where('status', 1);
        }

        $deliveryBoys = $query->get();
        foreach ($deliveryBoys as $db) {
            $db->email = $db->admin ? $db->admin->email : '';
        }

        $deliveryBoysForResponse = $deliveryBoys->map(function (DeliveryBoy $db) {
            $row = $db->toArray();
            $rawCreated = $db->getAttributes()['created_at'] ?? null;
            if ($rawCreated !== null && $rawCreated !== '') {
                $row['created_at'] = CommonHelper::formatDateTime($rawCreated);
            }
            $rawDob = $db->getAttributes()['dob'] ?? null;
            if ($rawDob !== null && $rawDob !== '') {
                $row['dob'] = CommonHelper::formatDate($rawDob);
            }
            $blockReason = $this->deliveryBoyDeletionBlockReason($db->id);
            $row['is_deletable'] = $blockReason === null;
            $row['delete_block_reason'] = $blockReason ? __($blockReason) : null;
            return $row;
        });

        return CommonHelper::responseWithData($deliveryBoysForResponse);
    }

    public function edit($id)
    {
        $deliveryBoy = DeliveryBoy::withAllTranslations()
            ->with(['admin.deliveryBoy', 'city:id,name', 'cities:cities.id,cities.name', 'translations'])
            ->where('id', $id)->first();
        if (!$deliveryBoy || !$this->canAccessDeliveryBoy($deliveryBoy)) {
            return CommonHelper::responseError('delivery_boy_not_found');
        }

        // Add city information to the admin's deliveryBoy object as an array
        // (cities relation already loaded above; fall back to the legacy single city)
        if ($deliveryBoy->cities->isEmpty() && $deliveryBoy->city && $deliveryBoy->admin && $deliveryBoy->admin->deliveryBoy) {
            $deliveryBoy->admin->deliveryBoy->cities = [$deliveryBoy->city];
        }

        DeliveryBoy::setOptimizedResponse(false);

        return CommonHelper::responseWithData($deliveryBoy);
    }
    public function save(Request $request)
    {
        $rules = [
            'language_id' => 'required|exists:languages,id',
            'name'        => 'required',
            'address'     => 'nullable',
        ];

        $defaultLanguage = $this->languageService->getDefaultLanguage();

        if ($request->language_id == $defaultLanguage->id) {
            $rules = array_merge($rules, [
                'mobile' => 'required|unique:delivery_boys,mobile',
                'license_no' => 'nullable',
                'password' => 'nullable',
                'ifsc_code' => 'nullable',
                'bank_name' => 'nullable',
                'bank_account_number' => 'nullable',
                'account_name' => 'nullable',
                'city_ids' => 'required_without:city_id|array|min:1',
                'city_ids.*' => 'integer|exists:cities,id',
                'city_id' => 'required_without:city_ids',
                'driving_license' => 'nullable|file',
                'national_identity_card' => 'nullable|file',
                'bonus_percentage' => 'nullable|numeric'
            ]);
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if ($request->language_id != $defaultLanguage->id) {
            return CommonHelper::responseError('default_language_required_first');
        }

        $cityIds = $this->requestCityIds($request);
        $primaryCityId = $cityIds[0] ?? $request->city_id;

        DB::beginTransaction();
        try {
            /** Admin */
            $admin = Admin::create([
                'username' => $request->name,
                'email'    => $request->email,
                'password' => bcrypt($request->password ?? $request->mobile),
                'role_id'  => Role::$roleDeliveryBoy,
                'created_by' => 0,
            ]);

            // Auto-detect seller context: if logged-in admin is a seller, stamp seller_id.
            $sellerForDriver = Seller::where('admin_id', auth()->id())->value('id');

            /** DeliveryBoy main table */
            $deliveryBoy = DeliveryBoy::create([
                'admin_id'  => $admin->id,
                'seller_id' => $sellerForDriver,
                'name'      => $request->name,
                'address'   => $request->address,
                'other_payment_information' => $request->other_payment_information,
                'mobile'    => $request->mobile,
                'country_code' => $request->country_code ?? '+91',
                'license_no' => $request->license_no,
                'dob'       => $request->dob,
                'city_id'   => $primaryCityId,
                'bonus_type' => $request->bonus_type ?? 0,
                'bonus_percentage' => $request->bonus_percentage ?? 0,
                'bonus_min_amount' => $request->bonus_min_amount ?? 0,
                'bonus_max_amount' => $request->bonus_max_amount ?? 0,
                'ifsc_code' => $request->ifsc_code,
                'bank_name' => $request->bank_name,
                'bank_account_number' => $request->bank_account_number,
                'account_name' => $request->account_name,
                'status'    => DeliveryBoy::$statusActive,
            ]);


            /** Files */
            if ($request->hasFile('driving_license')) {
                $deliveryBoy->driving_license =
                    Storage::disk('public')->putFile('delivery_boy/driving_license', $request->file('driving_license'));
            }

            if ($request->hasFile('national_identity_card')) {
                $deliveryBoy->national_identity_card =
                    Storage::disk('public')->putFile('delivery_boy/national_identity_card', $request->file('national_identity_card'));
            }

            $deliveryBoy->save(); // save files
            $zoneOverlaps = $this->syncZones($deliveryBoy, $cityIds);

            /* Save Translation */
            $deliveryBoy->saveTranslation($request->language_id, [
                'name'  => $request->name ?? '',
                'address' => $request->address ?? '',
                'other_payment_information' => $request->other_payment_information ?? '',
            ]);

            $conflict = CommonHelper::claimMobile($deliveryBoy->mobile, \App\Models\MobileRegistry::ROLE_DELIVERY_BOY, $deliveryBoy->id);
            if ($conflict) {
                DB::rollBack();
                return CommonHelper::responseError($conflict);
            }

            DB::commit();

            return CommonHelper::responseWithData([
                'id' => $deliveryBoy->id,
                'message' => __('delivery_boy_saved_successfully'),
                'zone_overlaps' => $zoneOverlaps,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("DeliveryBoy Save Error", [$e->getMessage()]);
            return CommonHelper::responseError($e->getMessage());
        }
    }


    public function update(Request $request)
    {
        $defaultLanguage = $this->languageService->getDefaultLanguage();
        $isDefaultLang   = $defaultLanguage && (int) $request->language_id === (int) $defaultLanguage->id;

        $rules = [
            'id'          => 'required|exists:delivery_boys,id',
            'language_id' => 'required|exists:languages,id',
            'name'        => $isDefaultLang ? 'required' : 'nullable|string',
            'address'     => 'nullable|string',
        ];

        // If password is filled, confirm_password is required and must match
        if ($request->filled('password')) {
            $rules['password'] = 'required|min:6';
            $rules['confirm_password'] = 'required|same:password';
        }

        if ($isDefaultLang && $request->filled('mobile')) {
            $rules['mobile'] = 'required|unique:delivery_boys,mobile,' . $request->id;
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $deliveryBoy = DeliveryBoy::find($request->id);
        if (!$deliveryBoy || !$this->canAccessDeliveryBoy($deliveryBoy)) {
            return CommonHelper::responseError('delivery_boy_not_found');
        }




        /** Update main table only for default language */
        if ($request->language_id == $defaultLanguage->id) {
            $deliveryBoy->name = $request->name;
            $deliveryBoy->address = $request->address;
            $deliveryBoy->other_payment_information = $request->other_payment_information ?? '';
            $deliveryBoy->mobile = $request->mobile ?? $deliveryBoy->mobile;
            $deliveryBoy->country_code = $request->country_code ?? $deliveryBoy->country_code;
            $deliveryBoy->license_no = $request->license_no ?? $deliveryBoy->license_no;
            $deliveryBoy->dob    = $request->dob ?? $deliveryBoy->dob;
            $cityIds = $this->requestCityIds($request);
            if (!empty($cityIds)) {
                $deliveryBoy->city_id = $cityIds[0];
            }
            $deliveryBoy->status = $request->status ?? $deliveryBoy->status;
            // Remark field - always update (can be empty string)
            $deliveryBoy->remark = $request->input('remark', '');

            // Bank details
            $deliveryBoy->ifsc_code = $request->ifsc_code ?? $deliveryBoy->ifsc_code;
            $deliveryBoy->bank_name = $request->bank_name ?? $deliveryBoy->bank_name;
            $deliveryBoy->bank_account_number = $request->bank_account_number ?? $deliveryBoy->bank_account_number;
            $deliveryBoy->account_name = $request->account_name ?? $deliveryBoy->account_name;

            // Bonus details
            $deliveryBoy->bonus_type = $request->bonus_type ?? $deliveryBoy->bonus_type ?? 0;
            $deliveryBoy->bonus_percentage = $request->bonus_percentage ?? $deliveryBoy->bonus_percentage ?? 0;
            $deliveryBoy->bonus_min_amount = $request->bonus_min_amount ?? $deliveryBoy->bonus_min_amount ?? 0;
            $deliveryBoy->bonus_max_amount = $request->bonus_max_amount ?? $deliveryBoy->bonus_max_amount ?? 0;

         
            if ($request->hasFile('driving_license')) {
                $deliveryBoy->driving_license =
                    Storage::disk('public')->putFile('delivery_boy/driving_license', $request->file('driving_license'));
            }

            if ($request->hasFile('national_identity_card')) {
                $deliveryBoy->national_identity_card =
                    Storage::disk('public')->putFile('delivery_boy/national_identity_card', $request->file('national_identity_card'));
            }

            $conflict = CommonHelper::claimMobile($deliveryBoy->mobile, \App\Models\MobileRegistry::ROLE_DELIVERY_BOY, $deliveryBoy->id);
            if ($conflict) {
                return CommonHelper::responseError($conflict);
            }

            $deliveryBoy->save();
            $zoneOverlaps = !empty($cityIds) ? $this->syncZones($deliveryBoy, $cityIds) : [];

            // Update Admin password when password is provided
            if ($request->filled('password')) {
                $admin = Admin::find($deliveryBoy->admin_id);
                if ($admin) {
                    $admin->password = bcrypt($request->password);
                    $admin->save();
                }
            }


        }

        /**  Save or Update Translation (all languages) */
        $deliveryBoy->saveTranslation($request->language_id, [
            'name'  => $request->name ?? '',
            'address' => $request->address ?? '',
            'other_payment_information' => $request->other_payment_information ?? '',
        ]);

        /** Return latest delivery boy with current language translation */
        $deliveryBoy = DeliveryBoy::withTranslation()->find($request->id);


        return CommonHelper::responseWithData([
            'delivery_boy' => $deliveryBoy,
            'message' => __('delivery_boy_updated_successfully'),
            'zone_overlaps' => $zoneOverlaps ?? [],
        ]);
    }

    /** Unique int zone ids from city_ids[] (or legacy single city_id). */
    private function requestCityIds(Request $request): array
    {
        $ids = $request->has('city_ids') ? (array) $request->city_ids : array_filter([$request->city_id]);
        return array_values(array_unique(array_map('intval', array_filter($ids))));
    }

    /**
     * Replace the driver's zones and return zones already served by another active
     * driver of the same distributor (warning only, not blocking).
     */
    private function syncZones(DeliveryBoy $deliveryBoy, array $cityIds): array
    {
        $deliveryBoy->cities()->sync($cityIds);

        $others = DeliveryBoy::where('id', '!=', $deliveryBoy->id)
            ->where('status', 1)
            ->where('seller_id', $deliveryBoy->seller_id)
            ->servingCities($cityIds)
            ->with('cities:cities.id')
            ->get(['id', 'name', 'city_id']);

        $overlaps = [];
        foreach ($others as $other) {
            $theirs = $other->cities->pluck('id')->push($other->city_id)->filter()->unique();
            foreach (array_intersect($cityIds, $theirs->all()) as $cid) {
                $overlaps[] = ['city_id' => (int) $cid, 'delivery_boy_id' => $other->id, 'delivery_boy_name' => $other->name];
            }
        }
        return $overlaps;
    }

    public function updateStatus(Request $request)
    {
        if (isset($request->id)) {
            $deliveryBoy = DeliveryBoy::find($request->id);

            if ($deliveryBoy && $this->canAccessDeliveryBoy($deliveryBoy)) {
                $deliveryBoy->status = $request->status;
                $deliveryBoy->remark = $request->remark ?? "";
                $deliveryBoy->save();

                if (isset($request->status) && $request->status === DeliveryBoy::$statusActive) {
                    $status_name = DeliveryBoy::$Active;
                } else {
                    $status_name = DeliveryBoy::$Rejected;
                }

                $user = Admin::where('id', $deliveryBoy->admin_id)->first();

                try {
                    CommonHelper::sendMailAdminStatus("delivery_boy", $deliveryBoy, $deliveryBoy->status, $user->email);
                } catch (\Exception $e) {
                    Log::error("Approve delivery_boy status send mail error", [$e->getMessage()]);
                }

                return CommonHelper::responseSuccess(__('delivery_boy_status_updated_successfully', ['status' => $status_name]));
            } else {
                return CommonHelper::responseSuccess(__('delivery_boy_not_found'));
            }
        }
    }

    public function delete(Request $request)
    {
        $deliveryBoy = DeliveryBoy::find($request->id);

        if ($deliveryBoy && $this->canAccessDeliveryBoy($deliveryBoy)) {
            $blockReason = $this->deliveryBoyDeletionBlockReason($deliveryBoy->id);
            if ($blockReason) {
                return CommonHelper::responseError(__($blockReason));
            }

            $deliveryBoy->delete();
            CommonHelper::releaseMobile(\App\Models\MobileRegistry::ROLE_DELIVERY_BOY, $deliveryBoy->id);
        }

        return CommonHelper::responseSuccess('delivery_boy_deleted_successfully');
    }

    public function getStatus(Request $request)
    {
        // Try to get delivery boy ID from request or authenticated user
        $delivery_boy_id = $request->id ?? null;

        // If no ID in request, try to get from authenticated user's delivery_boy relationship
        if (!$delivery_boy_id && auth()->check()) {
            // Get delivery boy by admin_id (more reliable than relationship)
            $deliveryBoy = DeliveryBoy::where('admin_id', auth()->user()->id)->first();
            if ($deliveryBoy) {
                $delivery_boy_id = $deliveryBoy->id;
            }
        }

        if (!$delivery_boy_id) {
            return CommonHelper::responseError('delivery_boy_id_is_required');
        }

        $deliveryBoy = DeliveryBoy::find($delivery_boy_id);

        if (!$deliveryBoy) {
            return CommonHelper::responseError('delivery_boy_not_found');
        }

        $data = ['status' => $deliveryBoy->status, 'remark' => $deliveryBoy->remark];
        return CommonHelper::responseWithData($data);
    }

    public function getSalary(Request $request)
    {
        try {
            $seller = \App\Models\Seller::where('admin_id', auth()->id())->first();

            $query = DB::table('delivery_boy_salary as s')
                ->leftJoin('delivery_boys as d', 'd.id', '=', 's.delivery_boy_id')
                ->select(
                    's.*',
                    'd.name as delivery_boy_name'
                )
                ->orderBy('s.id', 'DESC');

            if ($seller) {
                $query->where('d.seller_id', $seller->id);
            }

            if ($request->filled('startDate')) {
                $query->whereDate('s.paid_on', '>=', $request->startDate);
            }

            if ($request->filled('endDate')) {
                $query->whereDate('s.paid_on', '<=', $request->endDate);
            }

            if ($request->filled('delivery_boy_id')) {
                $query->where('s.delivery_boy_id', $request->delivery_boy_id);
            }

            $salaries = $query->get();

            $deliveryBoysQuery = DeliveryBoy::select('id', 'name', 'mobile');
            if ($seller) {
                $deliveryBoysQuery->where('seller_id', $seller->id);
            }
            $deliveryBoys = $deliveryBoysQuery->get();

            return CommonHelper::responseWithData([
                'salaries' => $salaries,
                'deliveryBoys' => $deliveryBoys,
                'date_format' => CommonHelper::getDateFormat(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
            ]);
        }
    }
    public function addSalary(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'delivery_boy_id' => 'required|exists:delivery_boys,id',
            'amount' => 'required|numeric',
            'paid_on' => 'required|date'
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $deliveryBoy = DeliveryBoy::find($request->delivery_boy_id);
        if (!$deliveryBoy || !$this->canAccessDeliveryBoy($deliveryBoy)) {
            return CommonHelper::responseError('delivery_boy_not_found');
        }

        try {
            DB::table('delivery_boy_salary')->insert([
                'delivery_boy_id' => $request->delivery_boy_id,
                'amount' => $request->amount,
                'message' => $request->message ?? '',
                'paid_on' => $request->paid_on,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return CommonHelper::responseSuccess('salary_added_successfully');
        } catch (\Exception $e) {
            Log::error("Add Salary Error", [$e->getMessage()]);
            return CommonHelper::responseError('something_went_wrong');
        }
    }
    public function updateSalary(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:delivery_boy_salary,id',
            'delivery_boy_id' => 'required|exists:delivery_boys,id',
            'amount' => 'required|numeric',
            'paid_on' => 'required|date'
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Both the salary row's current driver and the (possibly changed) target driver
        // must belong to the caller's own seller.
        $existingSalaryDeliveryBoyId = DB::table('delivery_boy_salary')->where('id', $request->id)->value('delivery_boy_id');
        $existingDeliveryBoy = $existingSalaryDeliveryBoyId ? DeliveryBoy::find($existingSalaryDeliveryBoyId) : null;
        $targetDeliveryBoy = DeliveryBoy::find($request->delivery_boy_id);
        if (!$existingDeliveryBoy || !$targetDeliveryBoy
            || !$this->canAccessDeliveryBoy($existingDeliveryBoy)
            || !$this->canAccessDeliveryBoy($targetDeliveryBoy)) {
            return CommonHelper::responseError('delivery_boy_not_found');
        }

        try {
            DB::table('delivery_boy_salary')
                ->where('id', $request->id)
                ->update([
                    'delivery_boy_id' => $request->delivery_boy_id,
                    'amount' => $request->amount,
                    'message' => $request->message ?? '',
                    'paid_on' => $request->paid_on,
                    'updated_at' => now(),
                ]);

            return CommonHelper::responseSuccess('salary_updated_successfully');
        } catch (\Exception $e) {
            Log::error("Update Salary Error", [$e->getMessage()]);
            return CommonHelper::responseError('something_went_wrong');
        }
    }
    public function deleteSalary(Request $request)
    {
        if (!$request->id) {
            return CommonHelper::responseError('id_required');
        }

        $salaryDeliveryBoyId = DB::table('delivery_boy_salary')->where('id', $request->id)->value('delivery_boy_id');
        $deliveryBoy = $salaryDeliveryBoyId ? DeliveryBoy::find($salaryDeliveryBoyId) : null;
        if ($deliveryBoy && !$this->canAccessDeliveryBoy($deliveryBoy)) {
            return CommonHelper::responseError('delivery_boy_not_found');
        }

        try {
            DB::table('delivery_boy_salary')->where('id', $request->id)->delete();
            return CommonHelper::responseSuccess('salary_deleted_successfully');
        } catch (\Exception $e) {
            Log::error("Delete Salary Error", [$e->getMessage()]);
            return CommonHelper::responseError('something_went_wrong');
        }
    }
    public function getMySalary(Request $request)
    {
        try {
            // Get the delivery boy record linked to the logged-in user
            $deliveryBoy = auth('api')->user()->deliveryBoy;

            if (!$deliveryBoy) {
                return CommonHelper::responseError('No delivery boy record found');
            }

            $deliveryBoyId = $deliveryBoy->id;
            $query = DB::table('delivery_boy_salary as s')
                ->leftJoin('delivery_boys as d', 'd.id', '=', 's.delivery_boy_id')
                ->where('s.delivery_boy_id', $deliveryBoyId)
                ->select(
                    's.id',
                    's.amount',
                    's.message',
                    's.paid_on',
                    'd.name as delivery_boy_name'
                )
                ->orderBy('s.id', 'DESC');

            // Filters
            if ($request->filled('startDate')) {
                $query->whereDate('s.paid_on', '>=', $request->startDate);
            }

            if ($request->filled('endDate')) {
                $query->whereDate('s.paid_on', '<=', $request->endDate);
            }

            $limit = $request->input('limit', 10);
            $offset = $request->input('offset', 0);

            $total = (clone $query)->count();
            $dateFormat = CommonHelper::getDateFormat();

            $salaries = $query->limit($limit)->offset($offset)->get()->map(function ($item) {
                $item->paid_on = CommonHelper::formatDateTime($item->paid_on);
                return $item;
            });

            return response()->json([
                'status' => 1,
                'message' => 'Success',
                'data' => [
                    'salaries' => $salaries,
                    'total' => $total,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error("Delivery Boy Salary Error", [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 0,
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * POST /delivery_boy/order/not_delivered
     * Mark an order as not delivered with a reason.
     * Body: order_id, reason (shop_closed|refused|other), reason_note (nullable)
     */
    public function markNotDelivered(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id'    => 'required|exists:orders,id',
            'reason'      => 'required|in:shop_closed,refused,other',
            'reason_note' => 'nullable|string|max:500',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $deliveryBoy = auth()->user()->deliveryBoy ?? null;
        if (!$deliveryBoy) {
            return CommonHelper::responseError('unauthorized');
        }

        $order = Order::find($request->order_id);
        if ($order->delivery_boy_id != $deliveryBoy->id) {
            return CommonHelper::responseError('order_not_assigned_to_you');
        }
        if ($order->active_status != OrderStatusList::$outForDelivery) {
            return CommonHelper::responseError('order_must_be_out_for_delivery');
        }

        $note = $request->reason;
        if ($request->reason_note) {
            $note .= ': ' . $request->reason_note;
        }

        $order->active_status   = OrderStatusList::$notDelivered;
        $order->delivery_reason = $note;
        $order->save();

        OrderItem::where('order_id', $order->id)->update(['active_status' => OrderStatusList::$notDelivered]);

        return CommonHelper::responseSuccess('order_marked_as_not_delivered');
    }

    // Partial delivery itself is handled by OrdersApiController::updateStatus with
    // status_id=13 — that's the endpoint the driver app actually calls for every status
    // change, and it has its own inline partial-delivery branch (delivered_quantity,
    // damage_photo, shortfall_reason, final_total recalc). A separate endpoint here would
    // just be a second, easily-forgotten path to the same state change — removed.

    /**
     * GET /delivery_boy/order/shortfall_reasons
     * Static picklist for the partial_deliver reason field — app dev renders this as a
     * dropdown, sends the `key` back as items[].reason.
     */
    public function shortfallReasons()
    {
        $reasons = array_map(fn ($key) => ['key' => $key, 'label' => __($key)], self::SHORTFALL_REASONS);
        return CommonHelper::responseWithData(['reasons' => $reasons]);
    }
}
