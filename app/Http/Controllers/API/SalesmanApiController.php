<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Salesman;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalesmanApiController extends Controller
{
    public function getSalesmen(Request $request)
    {
        $seller_id = auth()->user()->seller->id ?? 0;
        
        $query = Salesman::where('seller_id', $seller_id);

        if (isset($request->search) && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('mobile', 'like', '%' . $request->search . '%');
            });
        }

        $total = $query->count();
        $salesmen = $query->orderBy('id', 'desc')->get();

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

        $salesman = new Salesman();
        $salesman->name = $request->name;
        $salesman->mobile = $request->mobile;
        $salesman->seller_id = $seller_id;
        $salesman->brands = json_encode($request->brands);
        $salesman->allow_payment_collection = $request->allow_payment_collection ? 1 : 0;
        $salesman->discount = $request->discount;
        $salesman->status = $request->status ?? 1;
        $salesman->save();

        return response()->json([
            'status' => 1,
            'message' => 'Salesman created successfully',
            'data' => $salesman
        ]);
    }

    public function edit($id)
    {
        $seller_id = auth()->user()->seller->id ?? 0;
        $salesman = Salesman::where('id', $id)->where('seller_id', $seller_id)->first();
        
        if (!$salesman) {
            return response()->json([
                'status' => 0,
                'message' => 'Salesman not found'
            ]);
        }

        // Decode brands
        $salesman->brands = json_decode($salesman->brands, true) ?? [];

        return response()->json([
            'status' => 1,
            'message' => 'Salesman data',
            'data' => $salesman
        ]);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'name' => 'required|string',
            'mobile' => 'required|numeric|unique:salesmen,mobile,' . $request->id,
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
        $salesman = Salesman::where('id', $request->id)->where('seller_id', $seller_id)->first();

        if (!$salesman) {
            return response()->json([
                'status' => 0,
                'message' => 'Salesman not found'
            ]);
        }

        $salesman->name = $request->name;
        $salesman->mobile = $request->mobile;
        $salesman->brands = json_encode($request->brands);
        $salesman->allow_payment_collection = $request->allow_payment_collection ? 1 : 0;
        $salesman->discount = $request->discount;
        $salesman->status = $request->status ?? 1;
        $salesman->save();

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
        
        if ($salesman) {
            $salesman->delete();
            return response()->json([
                'status' => 1,
                'message' => 'Salesman deleted successfully'
            ]);
        }

        return response()->json([
            'status' => 0,
            'message' => 'Salesman not found'
        ]);
    }
}
