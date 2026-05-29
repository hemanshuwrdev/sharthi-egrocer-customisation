<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\DeliveryBoyNotification;
use App\Models\Favorite;
use App\Models\OrderItem;
use App\Models\Pincode;
use App\Models\Product;
use App\Models\RecentlyVisitedProduct;
use App\Models\Section;
use App\Models\Tax;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SectionsApiController extends Controller
{

    public function removeSection($id)
    {
        $section = Section::find($id);
        if ($section) {
            $section->delete();
            return CommonHelper::responseSuccess("Section Deleted Successfully!");
        } else {
            return CommonHelper::responseSuccess("Section Not Found!");
        }
    }

    public function getDeliveryBoyNotifications(Request $request)
    {
        $limit = ($request->limit) ?? 10;
        $offset = ($request->offset) ?? 0;
        $sort = ($request->sort) ?? 'id';
        $order = ($request->sort) ?? 'DESC';
        $where = '';
        if (isset($request->search) && $request->search != '') {
            $search = $request->search;
            $where = " Where `id` like '%" . $search . "%' OR `title` like '%" . $search . "%' OR `message` like '%" . $search . "%' OR `date_created` like '%" . $search . "%' ";
        }

        $totalSql = DeliveryBoyNotification::select(DB::raw(" COUNT(`id`) as total"));
        if ($where != "") {
            $totalSql = $totalSql->whereRaw($where);
        }
        $totalSql = $totalSql->first();
        $total = $totalSql->total;


        $sql = DeliveryBoyNotification::select("*");
        if ($where != "") {
            $sql = $sql->whereRaw($where);
        }
        $notifications = $sql->orderBy($sort, $order)->skip($offset)->take($limit)->get();

        if (!empty($notifications)) {
            $response = array();
            $response['status'] = 1;
            $response['total'] = $total;
            $rows = array();
            $tempRow = array();
            foreach ($notifications as $row) {
                $tempRow['id'] = $row->id;
                $tempRow['name'] = $row->title;
                $tempRow['subtitle'] = $row->message;
                $tempRow['type'] = $row->type;
                $tempRow['type_id'] = $row->type_id;
                $tempRow['image_url'] = $row->image_url;
                $rows[] = $tempRow;
            }
            $response['data'] = $rows;
        } else {
            $response['status'] = 0;
            $response['message'] = "Data not found!";
        }
        return CommonHelper::responseWithData($response);
    }

    public function addRecentlyVisitedProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ], [
            'product_id.required' => 'The product_id field is required.',
            'product_id.exists' => 'The selected product does not exist.',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user = $request->user('api-customers');
        if (!$user) {
            return CommonHelper::responseError('User authentication required.');
        }

        $user_id = $user->id;
        $product_id = $request->product_id;

        try {
            RecentlyVisitedProduct::updateOrCreate(
                [
                    'user_id' => $user_id,
                    'product_id' => $product_id
                ],
                [
                    'visited_at' => now()
                ]
            );

            // Keep only the 10 most recent entries, delete older ones
            $idsToKeep = RecentlyVisitedProduct::where('user_id', $user_id)
                ->orderBy('visited_at', 'desc')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->pluck('id');

            // Delete all entries for this user that are NOT in the top 10
            if ($idsToKeep->count() > 0) {
                RecentlyVisitedProduct::where('user_id', $user_id)
                    ->whereNotIn('id', $idsToKeep)
                    ->delete();
            }

            return CommonHelper::responseSuccess("Recently visited product tracked successfully!");
        } catch (\Exception $e) {
            return CommonHelper::responseError("Failed to track recently visited product: " . $e->getMessage());
        }
    }
}
