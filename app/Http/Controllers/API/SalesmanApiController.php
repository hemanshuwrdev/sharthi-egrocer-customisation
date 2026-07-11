<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
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
            $salesman->email = $request->email;
            $salesman->seller_id = $seller_id;
            $salesman->brands = $request->brands;
            $salesman->allow_payment_collection = $request->allow_payment_collection ? 1 : 0;
            $salesman->discount = $request->discount;
            $salesman->status = $request->status ?? 1;
            $salesman->save();

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
            $salesman->email = $request->email;
            $salesman->brands = $request->brands;
            $salesman->allow_payment_collection = $request->allow_payment_collection ? 1 : 0;
            $salesman->discount = $request->discount;
            $salesman->status = $request->status ?? 1;
            $salesman->save();

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
}
