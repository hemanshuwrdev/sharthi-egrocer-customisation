<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\MobileRegistry;
use App\Models\Role;
use App\Models\Salesman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SalesmanApiController extends Controller
{
    public function getSalesmen(Request $request)
    {
        $seller_id = auth()->user()->seller->id ?? 0;

        $query = Salesman::leftJoin('admins', 'admins.id', '=', 'salesmen.admin_id')
            ->where('salesmen.seller_id', $seller_id)
            ->select('salesmen.*', 'admins.email as email');

        if (isset($request->search) && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('salesmen.name', 'like', '%' . $request->search . '%')
                  ->orWhere('salesmen.mobile', 'like', '%' . $request->search . '%')
                  ->orWhere('admins.email', 'like', '%' . $request->search . '%');
            });
        }

        $total = $query->count();
        $salesmen = $query->orderBy('salesmen.id', 'desc')->get();

        return response()->json([
            'status' => 1,
            'message' => 'Salesmen retrieved successfully',
            'total' => $total,
            'data' => $salesmen
        ]);
    }

    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'mobile' => 'required|numeric|unique:salesmen,mobile',
            'email' => 'required|email|unique:admins,email',
            'password' => 'nullable|string|min:6',
            'brands' => 'required|array|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => 'Validation error',
                'data' => $validator->errors()
            ]);
        }

        $seller_id = auth()->user()->seller->id ?? 0;

        DB::beginTransaction();
        try {
            $admin = new Admin();
            $admin->username = $request->name;
            $admin->email = $request->email;
            $admin->password = Hash::make($request->filled('password') ? $request->password : \Illuminate\Support\Str::random(12));
            $admin->role_id = Role::$roleSalesman;
            $admin->created_by = auth()->user()->id;
            $admin->save();

            $salesman = new Salesman();
            $salesman->admin_id = $admin->id;
            $salesman->name = $request->name;
            $salesman->mobile = $request->mobile;
            $salesman->country_code = $request->country_code ?? '+91';
            $salesman->email = $request->email;
            $salesman->seller_id = $seller_id;
            $salesman->brands = $request->brands;
            $salesman->allow_payment_collection = $request->allow_payment_collection ? 1 : 0;
            $salesman->discount = $request->discount;
            $salesman->status = $request->status ?? 1;
            $salesman->save();

            $conflict = CommonHelper::claimMobile($salesman->mobile, MobileRegistry::ROLE_SALESMAN, $salesman->id);
            if ($conflict) {
                DB::rollBack();
                return response()->json([
                    'status' => 0,
                    'message' => $conflict
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Failed to create salesman',
                'error' => $e->getMessage()
            ]);
        }

        return response()->json([
            'status' => 1,
            'message' => 'Salesman created successfully',
            'data' => $salesman
        ]);
    }

    public function edit($id)
    {
        $seller_id = auth()->user()->seller->id ?? 0;
        $salesman = Salesman::with('admin:id,email')
            ->where('id', $id)->where('seller_id', $seller_id)->first();

        if (!$salesman) {
            return response()->json([
                'status' => 0,
                'message' => 'Salesman not found'
            ]);
        }

        $data = $salesman->toArray();
        $data['email'] = $salesman->admin->email ?? $salesman->email;
        unset($data['admin']);

        return response()->json([
            'status' => 1,
            'message' => 'Salesman data',
            'data' => $data
        ]);
    }

    public function update(Request $request)
    {
        $seller_id = auth()->user()->seller->id ?? 0;
        $salesman = Salesman::where('id', $request->id)->where('seller_id', $seller_id)->first();
        if (!$salesman) {
            return response()->json([
                'status' => 0,
                'message' => 'Salesman not found'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'name' => 'required|string',
            'mobile' => 'required|numeric|unique:salesmen,mobile,' . $request->id,
            'email' => 'required|email|unique:admins,email,' . ($salesman->admin_id ?? 'NULL'),
            'password' => 'nullable|string|min:6',
            'brands' => 'required|array|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'message' => 'Validation error',
                'data' => $validator->errors()
            ]);
        }

        DB::beginTransaction();
        try {
            // Ensure paired admins row (handles legacy rows that pre-date login wiring)
            $admin = $salesman->admin_id ? Admin::find($salesman->admin_id) : null;
            if (!$admin) {
                $admin = new Admin();
                $admin->role_id = Role::$roleSalesman;
                $admin->created_by = auth()->user()->id;
            }
            $admin->username = $request->name;
            $admin->email = $request->email;
            if ($request->filled('password')) {
                $admin->password = Hash::make($request->password);
            }
            $admin->save();

            $salesman->admin_id = $admin->id;
            $salesman->name = $request->name;
            $salesman->mobile = $request->mobile;
            $salesman->country_code = $request->country_code ?? $salesman->country_code;
            $salesman->email = $request->email;
            $salesman->brands = $request->brands;
            $salesman->allow_payment_collection = $request->allow_payment_collection ? 1 : 0;
            $salesman->discount = $request->discount;
            $salesman->status = $request->status ?? 1;
            $salesman->save();

            $conflict = CommonHelper::claimMobile($salesman->mobile, MobileRegistry::ROLE_SALESMAN, $salesman->id);
            if ($conflict) {
                DB::rollBack();
                return response()->json([
                    'status' => 0,
                    'message' => $conflict
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Failed to update salesman',
                'error' => $e->getMessage()
            ]);
        }

        return response()->json([
            'status' => 1,
            'message' => 'Salesman updated successfully',
            'data' => $salesman
        ]);
    }

    public function delete(Request $request)
    {
        $seller_id = auth()->user()->seller->id ?? 0;
        $salesman = Salesman::where('id', $request->id)->where('seller_id', $seller_id)->first();

        if (!$salesman) {
            return response()->json([
                'status' => 0,
                'message' => 'Salesman not found'
            ]);
        }

        DB::beginTransaction();
        try {
            $adminId = $salesman->admin_id;
            $salesman->delete();
            if ($adminId) {
                Admin::where('id', $adminId)->delete();
            }
            CommonHelper::releaseMobile(MobileRegistry::ROLE_SALESMAN, $salesman->id);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Failed to delete salesman',
                'error' => $e->getMessage()
            ]);
        }

        return response()->json([
            'status' => 1,
            'message' => 'Salesman deleted successfully'
        ]);
    }

    public function getPrivacyPolicy()
    {
        $variables = array("privacy_policy_salesman", "terms_conditions_salesman");
        $policies = \App\Models\Setting::whereIn('variable', $variables)->get();
        return CommonHelper::responseWithData($policies);
    }

    public function savePrivacyPolicy(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            $setting = \App\Models\Setting::where('variable', $key)->first();
            if ($setting) {
                $setting->variable = $key;
                $setting->value = $value ?? "";
                $setting->save();
            } else {
                $setting = new \App\Models\Setting();
                $setting->variable = $key;
                $setting->value = $value ?? "";
                $setting->save();
            }
        }
        return CommonHelper::responseSuccess('salesman_privacy_policy_and_terms_conditions_saved_successfully');
    }

    public function printPrivacyPolicy(Request $request)
    {
        $langCode = $request->get('lang', 'en'); // Default to 'en' if no language specified
        $value = \App\Models\Setting::get_value('privacy_policy_salesman');
        echo $this->getLanguageContent($value, $langCode);
    }

    public function printTermsConditions(Request $request)
    {
        $langCode = $request->get('lang', 'en'); // Default to 'en' if no language specified
        $value = \App\Models\Setting::get_value('terms_conditions_salesman');
        echo $this->getLanguageContent($value, $langCode);
    }

    private function getLanguageContent($value, $langCode)
    {
        if (empty($value)) {
            return '';
        }

        // Try to parse as JSON (language-wise format)
        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            // It's JSON with language codes - get content for specified language
            $content = $decoded[$langCode] ?? '';

            // If language not found, try to get default language or first available
            if (empty($content)) {
                $defaultCodes = ['en', 'ar', 'hi', 'fr', 'es'];
                foreach ($defaultCodes as $code) {
                    if (isset($decoded[$code]) && !empty($decoded[$code])) {
                        $content = $decoded[$code];
                        break;
                    }
                }
                if (empty($content) && !empty($decoded)) {
                    $content = reset($decoded);
                }
            }
        } else {
            // Not JSON - it's plain text, use as-is
            $content = $value;
        }

        // Remove newline characters (\n, \r, \r\n) for proper HTML rendering
        $content = str_replace(["\r\n", "\r", "\n"], '', $content);

        return $content;
    }
}
