<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehiclesApiController extends Controller
{
    private function scopeToSeller($query)
    {
        if (auth()->user()->role_id === \App\Models\Role::$roleSeller) {
            $query->where('seller_id', auth()->user()->seller->id);
        }

        return $query;
    }

    public function list(Request $request)
    {
        if ($request->filled('id')) {
            $vehicle = $this->scopeToSeller(Vehicle::where('id', $request->id))->first();
            if (!$vehicle) {
                return CommonHelper::responseError('vehicle_not_found');
            }
            return CommonHelper::responseWithData($vehicle);
        }

        $limit = $request->input('per_page', 10);
        $page = max((int) $request->input('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $filter = $request->input('filter', '');

        $query = $this->scopeToSeller(Vehicle::query());

        if ($filter) {
            $query->where(function ($q) use ($filter) {
                $q->where('id', 'like', "%{$filter}%")
                  ->orWhere('name', 'like', "%{$filter}%")
                  ->orWhere('vehicle_number', 'like', "%{$filter}%");
            });
        }

        if (in_array((string) $request->input('status', ''), ['0', '1'], true)) {
            $query->where('status', (int) $request->input('status'));
        }

        $total = (clone $query)->count();

        // loading_slips_count = every slip this vehicle was ever put on (a vehicle with any
        // can't be deleted); active_trips_count = slips currently dispatched (status 1), i.e.
        // the vehicle is on the road right now.
        $vehicles = $query
            ->withCount([
                'loadingSlips',
                'loadingSlips as active_trips_count' => fn ($q) => $q->where('status', 1),
            ])
            ->orderBy('id', 'DESC')
            ->skip($offset)->take($limit)
            ->get();

        // Whole-fleet numbers for the page's stat cards — deliberately ignores the search /
        // status filter and the current page, so they don't change as the list is browsed.
        $fleet = fn () => $this->scopeToSeller(Vehicle::query());
        $summary = [
            'total'           => $fleet()->count(),
            'active'          => $fleet()->where('status', 1)->count(),
            'inactive'        => $fleet()->where('status', 0)->count(),
            'on_route'        => $fleet()->whereHas('loadingSlips', fn ($q) => $q->where('status', 1))->count(),
            'active_capacity' => round((float) $fleet()->where('status', 1)->sum('capacity'), 2),
        ];

        $payload = CommonHelper::responseWithData($vehicles, $total)->getData(true);
        $payload['summary'] = $summary;

        return response()->json($payload);
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
            'seller_id' => auth()->user()->seller->id,
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

        $vehicle = Vehicle::where('id', $request->id)->where('seller_id', auth()->user()->seller->id)->first();
        if (!$vehicle) {
            return CommonHelper::responseError('vehicle_not_found');
        }

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

        $vehicle = Vehicle::where('id', $request->id)->where('seller_id', auth()->user()->seller->id)->first();
        if (!$vehicle) {
            return CommonHelper::responseError('vehicle_not_found');
        }

        // Check if vehicle has any loading slips
        if ($vehicle->loadingSlips()->count() > 0) {
            return CommonHelper::responseError(__('Cannot delete vehicle assigned to loading slips'));
        }

        $vehicle->delete();

        return CommonHelper::responseSuccess(__('Vehicle deleted successfully'));
    }

    public function getActiveVehicles()
    {
        $vehicles = $this->scopeToSeller(Vehicle::where('status', 1))->get();
        return CommonHelper::responseWithData($vehicles);
    }
}
