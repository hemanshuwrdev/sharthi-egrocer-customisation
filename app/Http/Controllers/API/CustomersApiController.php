<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class CustomersApiController extends Controller
{
    public function getCustomers(Request $request)
    {

        $limit = $request->get('limit', 5);
        $offset = $request->get('offset', 0);

        $query = User::where('status', '!=', 2);

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
}
