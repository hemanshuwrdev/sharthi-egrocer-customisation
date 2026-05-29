<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Helpers\FirebaseHelper;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use App\Models\DeliveryBoy;
use App\Models\Notification;
use App\Models\User;
use App\Models\UserToken;
use App\Models\AdminToken;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
class NotificationsApiController extends Controller
{
    public function index()
    {
        $sellers = Seller::where('status', 1)->select('id', 'name')->orderBy('id', 'DESC')->get()->makeHidden(['translations', 'categories'])->toArray();
        $delivery_boys = DeliveryBoy::where('status', 1)->select('id', 'name')->orderBy('id', 'DESC')->get()->makeHidden('translations')->toArray();
        $users = User::where('status', 1)->select('id', 'name')->orderBy('id', 'DESC')->get()->makeHidden('translations')->toArray();
        $categories = Category::where('status', 1)
            ->select('id', 'name') // Only select specific columns
            ->orderBy('id', 'DESC')
            ->get()
            ->makeHidden(['translations', 'image_url', 'has_child', 'has_active_child'])
            ->toArray();
        $products = Product::where('status', 1)->where('is_approved', 1)->select('id', 'name')->orderBy('id', 'DESC')->get()->makeHidden('translations')->toArray();
        $notifications = Notification::orderBy('id', 'DESC')->get();
        $data = array(
            "users" => $users,
            "delivery_boys" => $delivery_boys,
            "sellers" => $sellers,
            "categories" => $categories,
            "products" => $products,
            "notifications" => $notifications
        );
        return CommonHelper::responseWithData($data);
    }

    public function save(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required',
            'type_id' => 'required_if:type,category,product,user,seller,delivery_boy|numeric',
            'title' => 'required',
            'message' => 'required',
            'image' => ['required_if:include_image,true', 'nullable', 'mimes:jpeg,jpg,png,gif'],
            'type_link' => 'required_if:type,==,url',
        ]);
        $validator->setCustomMessages([
            'type_id.required_if' => 'The :attribute field is required when the type is category, product.',
            'type_id.numeric' => 'Please select Category or Product',

        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        if ($request->type == "user" || $request->type == "seller" || $request->type == "delivery_boy") {
            $type_ids = explode(',', $request->type_ids);
            foreach ($type_ids as $key => $type_id) {
                $notification = new Notification();
                $notification->type = $request->type;
                $notification->type_id = $type_id;
                $notification->type_link = $request->type_link ?? "";
                $notification->title = $request->title;
                $notification->message = $request->message;
                $image = '';
                if ($request->include_image == 'true' && $request->hasFile('image')) {
                    $file = $request->file('image');
                    $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                    $image = Storage::disk('public')->putFileAs('notifications', $file, $fileName);
                }
                $notification->image = $image;
                $notification->date_sent = now();
                $notification->save();
            }
        } else {
            $notification = new Notification();
            $notification->type = $request->type;
            $notification->type_id = $request->type_id;
            $notification->type_link = $request->type_link ?? "";
            $notification->title = $request->title;
            $notification->message = $request->message;
            $image = '';
            if ($request->include_image == 'true' && $request->hasFile('image')) {
                $file = $request->file('image');
                $fileName = time() . '_' . rand(1111, 99999) . '.' . $file->getClientOriginalExtension();
                $image = Storage::disk('public')->putFileAs('notifications', $file, $fileName);
            }
            $notification->image = $image;
            $notification->date_sent = now();
            $notification->save();
        }

        $pushNotification = CommonHelper::getPushObject($request, $image ?? '');

        // Fetch FCM tokens based on notification type: customers use UserToken, sellers/delivery boys use AdminToken
        $tokensToSend = collect();
        if ($request->type === 'user') {
            if (isset($type_ids) && count($type_ids) > 0) {
                $tokensToSend = UserToken::where('type', 'customer')->whereIn('user_id', $type_ids)->get();
            } else {
                $tokensToSend = UserToken::where('type', 'customer')->get();
            }
        } elseif ($request->type === 'seller' && isset($type_ids) && count($type_ids) > 0) {
            $adminIds = Seller::whereIn('id', $type_ids)->pluck('admin_id')->filter()->unique()->values();
            $tokensToSend = AdminToken::where('type', Role::$roleNameSeller)->whereIn('user_id', $adminIds)->get();
        } elseif ($request->type === 'delivery_boy' && isset($type_ids) && count($type_ids) > 0) {
            $adminIds = DeliveryBoy::whereIn('id', $type_ids)->pluck('admin_id')->filter()->unique()->values();
            $tokensToSend = AdminToken::where('type', Role::$roleNameDeliveryBoy)->whereIn('user_id', $adminIds)->get();
        } elseif (in_array($request->type, ['default', 'category', 'product', 'url'])) {
            // Broadcast to all customers
            $tokensToSend = UserToken::where('type', 'customer')->get();
        }

        if ($tokensToSend->isNotEmpty()) {
            $tokenModelForInvalid = in_array($request->type, ['user', 'default', 'category', 'product', 'url']) ? UserToken::class : AdminToken::class;
            FirebaseHelper::sendBulk($tokensToSend, $pushNotification['fcmMsg'], $pushNotification['notification'], $tokenModelForInvalid);
        } else {
            $notification = ['status' => 0, 'message' => "No FCM tokens found for the selected " . $request->type . "(s). They may not have logged in from the app yet."];
            return CommonHelper::responseSuccessWithData("notification_saved_successfully", $notification);
        }
        return CommonHelper::responseSuccess('notification_saved_successfully');
    }

    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $notification = Notification::find($request->id);
            if ($notification) {
                @Storage::disk('public')->delete($notification->image);
                $notification->delete();
                return CommonHelper::responseSuccess('notification_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess('notification_already_deleted');
            }
        }
    }
}
