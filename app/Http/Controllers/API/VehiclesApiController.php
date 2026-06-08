<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehiclesApiController extends Controller
{
    public function list(Request $request)
    {
        if ($request->filled('id')) {
            $vehicle = Vehicle::find($request->id);
            if (!$vehicle) {
                return CommonHelper::responseError('vehicle_not_found');
            }
            return CommonHelper::responseWithData($vehicle);
        }

        $limit = $request->input('per_page', 10);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $filter = $request->input('filter', '');

        $query = Vehicle::orderBy('id', 'DESC');

        if ($filter) {
            $query->where(function ($q) use ($filter) {
                $q->where('id', 'like', "%{$filter}%")
                  ->orWhere('name', 'like', "%{$filter}%")
                  ->orWhere('vehicle_number', 'like', "%{$filter}%");
            });
        }

        $total = $query->count();
        $vehicles = $query->skip($offset)->take($limit)->get();

        return CommonHelper::responseWithData($vehicles, $total);
    }

    public function save(Request $request)
    {
        if (auth()->user()->role_id !== \App\Models\Role::$roleSeller) {
            return CommonHelper::responseError(__('Unauthorized. Only distributors can manage vehicles.'));
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'vehicle_number' => 'required|string|max:255|unique:vehicles,vehicle_number',
            'capacity' => 'required|numeric|min:0.1',
            'status' => 'required|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $vehicle = Vehicle::create([
            'name' => $request->name,
            'vehicle_number' => $request->vehicle_number,
            'capacity' => $request->capacity,
            'status' => $request->status,
        ]);

        return CommonHelper::responseWithData([
            'id' => $vehicle->id,
            'message' => __('Vehicle saved successfully'),
        ]);
    }

    public function update(Request $request)
    {
        if (auth()->user()->role_id !== \App\Models\Role::$roleSeller) {
            return CommonHelper::responseError(__('Unauthorized. Only distributors can manage vehicles.'));
        }

        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:vehicles,id',
            'name' => 'required|string|max:255',
            'vehicle_number' => 'required|string|max:255|unique:vehicles,vehicle_number,' . $request->id,
            'capacity' => 'required|numeric|min:0.1',
            'status' => 'required|integer|in:0,1',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $vehicle = Vehicle::find($request->id);
        $vehicle->update([
            'name' => $request->name,
            'vehicle_number' => $request->vehicle_number,
            'capacity' => $request->capacity,
            'status' => $request->status,
        ]);

        return CommonHelper::responseSuccess(__('Vehicle updated successfully'));
    }

    public function delete(Request $request)
    {
        if (auth()->user()->role_id !== \App\Models\Role::$roleSeller) {
            return CommonHelper::responseError(__('Unauthorized. Only distributors can manage vehicles.'));
        }

        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:vehicles,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $vehicle = Vehicle::find($request->id);

        // Check if vehicle has any loading slips
        if ($vehicle->loadingSlips()->count() > 0) {
            return CommonHelper::responseError(__('Cannot delete vehicle assigned to loading slips'));
        }

        $vehicle->delete();

        return CommonHelper::responseSuccess(__('Vehicle deleted successfully'));
    }

    public function getActiveVehicles()
    {
        $vehicles = Vehicle::where('status', 1)->get();
        return CommonHelper::responseWithData($vehicles);
    }
}
