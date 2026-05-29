<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Services\LanguageService;
use App\Jobs\ProcessReferralBonusAfterReturnPeriod;
use App\Jobs\SendEmailJob;
use App\Models\DeliveryBoy;
use App\Models\FundTransfer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\OrderStatusList;
use App\Models\Role;
use App\Models\Seller;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use App\Models\DeliveryBoyTransaction;
use App\Models\ProductVariant;
use App\Models\PromoCode;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class OrdersApiController extends Controller
{
    public function getOrders(Request $request)
    {
        $limit = $request->input('per_page', 10);
        $offset = (($request->input('page', 0)) - 1) * $limit;
        $search = $request->input('search', '');

        $sellers = $this->getSellersWithTranslations();

        $sellerId = (isset($request->seller) && $request->seller != '') ? (int) $request->seller : null;

        $sellerNameSubquery = $sellerId
            ? DB::raw("(SELECT s.name FROM sellers s INNER JOIN order_items oi ON s.id = oi.seller_id WHERE oi.order_id = orders.id AND oi.seller_id = {$sellerId} LIMIT 1) as seller_name")
            : DB::raw('(SELECT s.name FROM sellers s INNER JOIN order_items oi ON s.id = oi.seller_id WHERE oi.order_id = orders.id LIMIT 1) as seller_name');

        $ordersQuery = Order::select(
            'orders.id',
            'orders.mobile',
            'orders.total',
            'orders.delivery_charge',
            'orders.wallet_balance',
            'orders.final_total',
            'orders.remaining_final',
            'orders.payment_method',
            'orders.delivery_time',
            'orders.additional_charges',
            'orders.active_status',
            'orders.order_type',
            'users.name as user_name',
            $sellerNameSubquery
        )
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
             ->where('orders.order_type', 'doorstep');

        // Only parse dates when actually provided
        if (isset($request->startDate) && $request->startDate != "" && isset($request->endDate) && $request->endDate != "") {
            $startDate = Carbon::parse($request->startDate)->startOfDay();
            $endDate = Carbon::parse($request->endDate)->endOfDay();

            // Use whereExists for better performance than join
            $ordersQuery = $ordersQuery->whereExists(function ($query) use ($startDate, $endDate) {
                $query->select(DB::raw(1))
                    ->from('order_items')
                    ->whereColumn('order_items.order_id', 'orders.id')
                    ->whereBetween('order_items.created_at', [$startDate, $endDate]);
            });
        }

        if (isset($request->startDeliveryDate) && $request->startDeliveryDate != "" && isset($request->endDeliveryDate) && $request->endDeliveryDate != "") {
            // Convert start and end dates from request to Y-m-d format
            $startDeliveryDate = date('Y-m-d', strtotime($request->startDeliveryDate));
            $endDeliveryDate = date('Y-m-d', strtotime($request->endDeliveryDate));

            // Use whereRaw for delivery_time filtering
            $ordersQuery = $ordersQuery->where(function ($query) use ($startDeliveryDate, $endDeliveryDate) {
                $query->whereRaw("STR_TO_DATE(SUBSTRING_INDEX(orders.delivery_time, ' ', 1), '%d-%m-%Y') BETWEEN ? AND ?", [$startDeliveryDate, $endDeliveryDate]);
            });
        }

        if (isset($request->seller) && $request->seller != "") {
            // Use whereExists for seller filter to avoid join issues
            $ordersQuery = $ordersQuery->whereExists(function ($query) use ($request) {
                $query->select(DB::raw(1))
                    ->from('order_items')
                    ->whereColumn('order_items.order_id', 'orders.id')
                    ->where('order_items.seller_id', $request->seller);
            });
        }

        if (isset($request->status) && $request->status != "") {
            $ordersQuery = $ordersQuery->where('orders.active_status', $request->status);
        }

        if ($search) {
            // Optimize search with better query structure
            $ordersQuery = $ordersQuery->where(function ($query) use ($search) {
                $query->where('orders.payment_method', 'like', "%{$search}%")
                    ->orWhere('orders.id', 'like', "%{$search}%")
                    ->orWhere('orders.mobile', 'like', "%{$search}%")
                    ->orWhere('orders.delivery_charge', 'like', "%{$search}%")
                    ->orWhere('orders.wallet_balance', 'like', "%{$search}%")
                    ->orWhere('orders.remaining_final', 'like', "%{$search}%")
                    ->orWhere('orders.total', 'like', "%{$search}%")
                    ->orWhere('orders.delivery_time', 'like', "%{$search}%")
                    ->orWhereExists(function ($subQuery) use ($search) {
                        $subQuery->select(DB::raw(1))
                            ->from('users')
                            ->whereColumn('users.id', 'orders.user_id')
                            ->where('users.name', 'like', "%{$search}%");
                    })
                    ->orWhereExists(function ($subQuery) use ($search) {
                        $subQuery->select(DB::raw(1))
                            ->from('order_items')
                            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
                            ->whereColumn('order_items.order_id', 'orders.id')
                            ->where('sellers.name', 'like', "%{$search}%");
                    })
                    ->orWhereExists(function ($subQuery) use ($search) {
                        $subQuery->select(DB::raw(1))
                            ->from('order_items')
                            ->whereColumn('order_items.order_id', 'orders.id')
                            ->where('order_items.active_status', 'like', "%{$search}%");
                    });
            });
        }

        // Get total count using a separate optimized query (without groupBy)
        $orders_total = (clone $ordersQuery)->count();

        // Apply ordering and pagination
        $orders = $ordersQuery->orderBy('orders.id', 'DESC')
            ->skip($offset)
            ->take($limit)
            ->get();

        // Process additional_charges more efficiently
        $orders->transform(function ($order) {
            if (!empty($order->additional_charges)) {
                if (is_string($order->additional_charges)) {
                    $decoded = json_decode($order->additional_charges, true);
                    $order->additional_charges = (is_array($decoded)) ? $decoded : [];
                } else {
                    $order->additional_charges = [];
                }
            } else {
                $order->additional_charges = [];
            }
            return $order;
        });

        $item_limit = $request->input('item_per_page', 10);
        $item_offset = (($request->input('item_page', 0)) - 1) * $item_limit;
        $data = array(
            "sellers" => $sellers,
            "orders" => $orders,
            "orders_total" => $orders_total
        );
        return CommonHelper::responseWithData($data);
    }

    public function getSelfPickupOrders(Request $request)
    {
        $limit = $request->input('per_page', 10);
        $offset = (($request->input('page', 0)) - 1) * $limit;
        $search = $request->input('search', '');

        $sellers = $this->getSellersWithTranslations();

        $ordersQuery = Order::select(
            'orders.id',
            'orders.mobile',
            'orders.total',
            'orders.delivery_charge',
            'orders.wallet_balance',
            'orders.final_total',
            'orders.remaining_final',
            'orders.payment_method',
            'orders.delivery_time',
            'orders.additional_charges',
            'orders.active_status',
            'users.name as user_name',
            DB::raw('(SELECT s.name FROM sellers s INNER JOIN order_items oi ON s.id = oi.seller_id WHERE oi.order_id = orders.id LIMIT 1) as seller_name')
        )
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->where('orders.order_type', 'selfpickup');

        // Only parse dates when actually provided
        if (isset($request->startDate) && $request->startDate != "" && isset($request->endDate) && $request->endDate != "") {
            $startDate = Carbon::parse($request->startDate)->startOfDay();
            $endDate = Carbon::parse($request->endDate)->endOfDay();

            // Use whereExists for better performance than join
            $ordersQuery = $ordersQuery->whereExists(function ($query) use ($startDate, $endDate) {
                $query->select(DB::raw(1))
                    ->from('order_items')
                    ->whereColumn('order_items.order_id', 'orders.id')
                    ->whereBetween('order_items.created_at', [$startDate, $endDate]);
            });
        }

        if (isset($request->startDeliveryDate) && $request->startDeliveryDate != "" && isset($request->endDeliveryDate) && $request->endDeliveryDate != "") {
            // Convert start and end dates from request to Y-m-d format
            $startDeliveryDate = date('Y-m-d', strtotime($request->startDeliveryDate));
            $endDeliveryDate = date('Y-m-d', strtotime($request->endDeliveryDate));

            // Use whereRaw for delivery_time filtering
            $ordersQuery = $ordersQuery->where(function ($query) use ($startDeliveryDate, $endDeliveryDate) {
                $query->whereRaw("STR_TO_DATE(SUBSTRING_INDEX(orders.delivery_time, ' ', 1), '%d-%m-%Y') BETWEEN ? AND ?", [$startDeliveryDate, $endDeliveryDate]);
            });
        }

        if (isset($request->seller) && $request->seller != "") {
            // Use whereExists for seller filter to avoid join issues
            $ordersQuery = $ordersQuery->whereExists(function ($query) use ($request) {
                $query->select(DB::raw(1))
                    ->from('order_items')
                    ->whereColumn('order_items.order_id', 'orders.id')
                    ->where('order_items.seller_id', $request->seller);
            });
        }

        if (isset($request->status) && $request->status != "") {
            $ordersQuery = $ordersQuery->where('orders.active_status', $request->status);
        }

        if ($search) {
            // Optimize search with better query structure
            $ordersQuery = $ordersQuery->where(function ($query) use ($search) {
                $query->where('orders.payment_method', 'like', "%{$search}%")
                    ->orWhere('orders.id', 'like', "%{$search}%")
                    ->orWhere('orders.mobile', 'like', "%{$search}%")
                    ->orWhere('orders.delivery_charge', 'like', "%{$search}%")
                    ->orWhere('orders.wallet_balance', 'like', "%{$search}%")
                    ->orWhere('orders.remaining_final', 'like', "%{$search}%")
                    ->orWhere('orders.total', 'like', "%{$search}%")
                    ->orWhere('orders.delivery_time', 'like', "%{$search}%")
                    ->orWhereExists(function ($subQuery) use ($search) {
                        $subQuery->select(DB::raw(1))
                            ->from('users')
                            ->whereColumn('users.id', 'orders.user_id')
                            ->where('users.name', 'like', "%{$search}%");
                    })
                    ->orWhereExists(function ($subQuery) use ($search) {
                        $subQuery->select(DB::raw(1))
                            ->from('order_items')
                            ->leftJoin('sellers', 'order_items.seller_id', '=', 'sellers.id')
                            ->whereColumn('order_items.order_id', 'orders.id')
                            ->where('sellers.name', 'like', "%{$search}%");
                    })
                    ->orWhereExists(function ($subQuery) use ($search) {
                        $subQuery->select(DB::raw(1))
                            ->from('order_items')
                            ->whereColumn('order_items.order_id', 'orders.id')
                            ->where('order_items.active_status', 'like', "%{$search}%");
                    });
            });
        }

        // Get total count using a separate optimized query (without groupBy)
        $orders_total = (clone $ordersQuery)->count();

        // Apply ordering and pagination
        $orders = $ordersQuery->orderBy('orders.id', 'DESC')
            ->skip($offset)
            ->take($limit)
            ->get();

        // Process additional_charges more efficiently
        $orders->transform(function ($order) {
            if (!empty($order->additional_charges)) {
                if (is_string($order->additional_charges)) {
                    $decoded = json_decode($order->additional_charges, true);
                    $order->additional_charges = (is_array($decoded)) ? $decoded : [];
                } else {
                    $order->additional_charges = [];
                }
            } else {
                $order->additional_charges = [];
            }
            return $order;
        });

        $item_limit = $request->input('item_per_page', 10);
        $item_offset = (($request->input('item_page', 0)) - 1) * $item_limit;
        $data = array(
            "sellers" => $sellers,
            "orders" => $orders,
            "orders_total" => $orders_total
        );
        return CommonHelper::responseWithData($data);
    }

    public function view($id)
    {
        $data = CommonHelper::getOrderDetails($id);
        if (!$data["order"]) {
            return CommonHelper::responseError("Order Not found!");
        }

        if ($data["order"]->order_type == 'selfpickup') {
            $pickupStatus = OrderStatus::where('order_id', $id)
                ->where('status', OrderStatusList::$selfPickupPicked)
                ->orderBy('created_at', 'desc')
                ->first();

            $data["pickup_date"] = $pickupStatus ? $pickupStatus->created_at : null;
        }

        $data["deliveryBoys"] = $this->getDeliveryBoysWithTranslations($data["order"]->city_id);
        return CommonHelper::responseWithData($data);
    }

    public function generateOrderInvoice(Request $request)
    {
        $data = CommonHelper::getOrderDetails($request->order_id, true);
        if (!$data["order"]) {
            return CommonHelper::responseError("Order Not found!");
        }
        CommonHelper::AdditionalChargesArray($data['order']);
        $invoice = CommonHelper::generateOrderInvoice($data);
        return CommonHelper::responseWithData($invoice);
    }
    public function downloadOrderInvoice(Request $request)
    {
        $data = CommonHelper::getOrderDetails($request->order_id, true);
        if (!$data["order"]) {
            return CommonHelper::responseError("Order Not found!");
        }
        CommonHelper::AdditionalChargesArray($data['order']);
        return CommonHelper::downloadOrderInvoice($request->order_id);
    }

    public function delete(Request $request)
    {
        if (isset($request->id)) {
            $order = Order::find($request->id);
            if ($order) {
                $order->delete();
                return CommonHelper::responseSuccess('order_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess("Order Already Deleted!");
            }
        }
    }

    public function deleteItem(Request $request)
    {
        if (isset($request->id)) {
            $orderItem = OrderItem::find($request->id);
            if ($orderItem) {
                $orderItem->delete();
                return CommonHelper::responseSuccess('order_item_deleted_successfully');
            } else {
                return CommonHelper::responseSuccess("Order Item Already Deleted!");
            }
        }
    }

    public function getWeeklySales()
    {
        $year = date("Y");
        $curdate = date('Y-m-d');
        $orders = Order::select(DB::raw('ROUND(SUM(remaining_final), 2) AS total_sale'), DB::raw('DATE(created_at) AS order_date'))
            ->where(DB::raw('YEAR(created_at)'), '=', $year)
            ->where(DB::raw('DATE(created_at)'), '<=', $curdate)
            ->where('active_status', OrderStatusList::$delivered);

        $orders = $orders->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy(DB::raw('DATE(created_at)'), 'DESC')
            ->limit(7)->get();
        return CommonHelper::responseWithData($orders);
    }

    public function updateStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required',
            'status_id' => 'required',
        ], [
            'order_id.required' => 'The Order id field is required.',
            'status_id.required' => 'The status field is required.',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        $order = Order::find($request->order_id);
        if (empty($order)) {
            return CommonHelper::responseError("Order Not found!");
        }
        $selectedStatus = OrderStatusList::where('id', $request->status_id)->value('status');

        if ($order->active_status == $request->status_id) {
            return CommonHelper::responseError("This Order is already " . $selectedStatus . "!");
        }

        if ($order->active_status == 6 && $request->status_id < 6) {
            return CommonHelper::responseError("This Order is Delivered");
        }

        if ($order->active_status == OrderStatusList::$paymentPending) {
            return CommonHelper::responseError("Payment is pending. Without payment order can not receive");
        }

        if ($order->active_status == OrderStatusList::$returned || $order->active_status == OrderStatusList::$cancelled) {
            return CommonHelper::responseError("Order is Cancelled OR Returned.");
        }

        if (auth()->user()->role_id != Role::$roleSuperAdmin) {
            if ($order->active_status > $request->status_id) {
                return CommonHelper::responseError("You can not update this order status to " . $selectedStatus . "!");
            }
        }

        DB::beginTransaction();
        try {

            if ($order->active_status != $request->status_id) {

                if (isset($request->delivery_boy_id) && $request->delivery_boy_id != "" && $request->delivery_boy_id != 0) {

                    // Delivery Boy cash collection add and cash_received update with update balance of delivery boy start
                    if ($request->status_id == OrderStatusList::$delivered) {

                        $deliveryBoy = DeliveryBoy::find($request->delivery_boy_id);

                        $deliveryBoy->balance = floatval($deliveryBoy->balance) + floatval($order->delivery_boy_bonus_amount);

                        CommonHelper::addFundTransfers($deliveryBoy->id, $order->delivery_boy_bonus_amount, FundTransfer::$typeCredit);

                        if ($order->payment_method == DeliveryBoyTransaction::$paymentTypeCod) {

                            $transactionData = [
                                'user_id' => $order->user_id,
                                'order_id' => $order->id,
                                'delivery_boy_id' => $deliveryBoy->id,
                                'type' => $order->payment_method,
                                'amount' => $order->remaining_final,
                                'status' => Transaction::$statusSuccess,
                                'message' => "Delivery boy " . OrderStatusList::$orderDelivered . " this order. Order payment method was " . Transaction::$paymentTypeCod,
                                'transaction_date' => now(), // Cleaner than date('Y-m-d H:i:s')
                            ];

                            $transaction = DeliveryBoyTransaction::create($transactionData);

                            $order->transaction_id = $transaction->id ?? 0;

                            $deliveryBoy->cash_received = floatval($deliveryBoy->cash_received) + floatval($order->remaining_final);
                        }

                        $deliveryBoy->save();
                    }

                    $order->delivery_boy_id = $request->delivery_boy_id;
                }

                $order->active_status = $request->status_id;
                $order->save();

                if ($request->status_id == OrderStatusList::$delivered) {
                    $order = Order::with('user', 'items.productVariant.product')->find($request->order_id);
                    $user = $order->user;

                    $referralMinOrderAmount = Setting::get_value('referral_min_order_amount');
                    $referralCredit = Setting::get_value('referral_credit_first_order');

                    if ($user && $user->friends_code && $order->final_total >= $referralMinOrderAmount) {
                        // Check if this is the user's FIRST delivered order
                        $deliveredOrdersCount = Order::where('user_id', $user->id)
                            ->where('active_status', OrderStatusList::$delivered)
                            ->where('id', '!=', $order->id)  // Exclude current order
                            ->count();

                        if ($deliveredOrdersCount === 0) {  // This means it's the first order

                            $now = Carbon::now();

                            $canCreditReferral = true;

                            foreach ($order->items as $item) {
                                $product = $item->productVariant->product ?? null;
                                if ($product && $product->return_status == 1 && $product->return_days > 0) {
                                    $canCreditReferral = false;
                                }
                            }

                            if ($canCreditReferral) {
                                // Credit referral bonus immediately
                                $referrer = User::where('referral_code', $user->friends_code)->first();

                                if ($referrer) {
                                    $new_balance = floatval($referrer->balance) + floatval($referralCredit);
                                    CommonHelper::updateUserWalletBalance($new_balance, $referrer->id);
                                    CommonHelper::addWalletTransaction($order->id, 0, $referrer->id, 'credit', $referralCredit, 'wallet_refer_earn_first_order_bonus');
                                }
                            } else {
                                // Queue a job to check again after max return days
                                $maxReturnDays = $order->items->filter(function ($item) {
                                    $product = $item->productVariant->product ?? null;
                                    return $product && $product->return_status == 1 && $product->return_days > 0;
                                })->max(function ($item) {
                                    return $item->productVariant->product->return_days;
                                }) ?? 0;

                                $deliveredStatus = OrderStatus::where('order_id', $order->id)
                                    ->where('status', OrderStatusList::$delivered)
                                    ->orderBy('created_at', 'desc')
                                    ->first();

                                $deliveredAt = $deliveredStatus ? Carbon::parse($deliveredStatus->created_at) : Carbon::parse($order->updated_at);
                                $now = Carbon::now();

                                if ($maxReturnDays > 0) {

                                    $returnPeriodEnd = $deliveredAt->copy()->addDays($maxReturnDays);
                                    $delay = $now->diffInSeconds($returnPeriodEnd, false); // false: signed diff

                                    if ($delay > 0) {
                                        ProcessReferralBonusAfterReturnPeriod::dispatch($order->id)->delay(Carbon::now()->addSeconds($delay));
                                    }
                                }
                            }
                        }
                    }
                }

                $excludedStatuses = [OrderStatusList::$cancelled, OrderStatusList::$returned];

                // Update the order items
                $query = OrderItem::where("order_id", $request->order_id)
                    ->whereNotIn("active_status", $excludedStatuses)
                    ->update(['active_status' => $request->status_id]);

                $orderStatus = array();
                $orderStatus["order_id"] = $request->order_id;
                $orderStatus['order_item_id'] = 0;
                $orderStatus["status"] = $request->status_id;
                $orderStatus["created_by"] = auth()->user()->id;
                $orderStatus["user_type"] = auth()->user()->role_id;
                CommonHelper::setOrderStatus($orderStatus);
            } else {
                $status = OrderStatusList::find($request->status_id);
                return CommonHelper::responseError('status_is_already' . " " . $status->status);
            }
            DB::commit();
        } catch (\Exception $e) {
            Log::info("Error : " . $e->getMessage());
            DB::rollBack();
            throw $e;
            return CommonHelper::responseError('something_went_wrong');
        }

        $order = Order::with('items')->where("id", $request->order_id)->first();

        if (!empty($order)) {
            try {
                dispatch(function () use ($order) {
                    CommonHelper::sendNotificationOrderStatus($order, 'order_item_status_update');
                    CommonHelper::sendOrderNotificationsToAdmins($order, 'order_status_update', $order->delivery_boy_id ?? null);
                })->afterResponse();
            } catch (\Exception $e) {
                Log::error("Order status notification error: " . $e->getMessage());
            }

            try {
                dispatch(new SendEmailJob($order))->afterResponse();
            } catch (\Exception $e) {
                Log::error('update_order_status_by_delivery_boy_send_mail_error' . ":", [$e->getMessage()]);
            }

            try {
                dispatch(function () use ($order) {
                    CommonHelper::sendSmsOrderStatus($order, $order->active_status);
                })->afterResponse();
            } catch (\Exception $e) {
                Log::error('update_order_status_by_delivery_boy_send_sms_error' . ":", [$e->getMessage()]);
            }
        }

        return CommonHelper::responseSuccess('order_updated_successfully');
    }

    public function assignDeliveryBoy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required',
            'delivery_boy_id' => 'required',
        ], [
            'order_id.required' => 'The Order id field is required.',
            'delivery_boy_id.required' => 'The delivery boy field is required.',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $deliveryBoy = DeliveryBoy::find($request->delivery_boy_id);
        if (empty($deliveryBoy)) {
            return CommonHelper::responseSuccess('delivery_boy_not_found');
        }
        $order = Order::find($request->order_id);

        if ($order) {
            if ($order->active_status == OrderStatusList::$cancelled) {
                return CommonHelper::responseError('could_not_update_order_status_cancelled_or_returned');
            }
            if ($order->delivery_boy_id == $request->delivery_boy_id) {
                return CommonHelper::responseError('this_delivery_boy_already_assign');
            }
            if ($order->active_status == OrderStatusList::$paymentPending) {
                return CommonHelper::responseError('payment_is_pending_without_payment_order_can_not_receive');
            }

            $final_total = floatval($order->total);

            $bonus_type = $deliveryBoy->bonus_type;
            $bonus_details['final_total'] = $final_total;
            $bonus_details['bonus_type'] = $bonus_type;
            $bonus_amount = 0;
            if ($bonus_type == DeliveryBoy::$bonusCommission) {

                $bonus_percentage = floatval($deliveryBoy->bonus_percentage);
                $bonus_min_amount = floatval($deliveryBoy->bonus_min_amount);
                $bonus_max_amount = floatval($deliveryBoy->bonus_max_amount);

                $bonus_amount = floatval(($final_total * $bonus_percentage) / 100);

                if ($bonus_amount < $bonus_min_amount && $bonus_min_amount != 0) {
                    $bonus_amount = $bonus_min_amount;
                }

                if ($bonus_amount > $bonus_max_amount && $bonus_max_amount != 0) {
                    $bonus_amount = $bonus_max_amount;
                }

                $bonus_details['bonus_type_name'] = DeliveryBoy::$commission;
                $bonus_details['bonus_percentage'] = $bonus_percentage;
                $bonus_details['bonus_min_amount'] = $bonus_min_amount;
                $bonus_details['bonus_max_amount'] = $bonus_max_amount;
                $bonus_details['bonus_amount'] = $bonus_amount;
            } else {
                $bonus_details['bonus_type_name'] = DeliveryBoy::$fixed;
            }
            $bonus_details['bonus_amount'] = $bonus_amount;

            $order->delivery_boy_bonus_details = $bonus_details;
            $order->delivery_boy_bonus_amount = $bonus_amount;

            $order->delivery_boy_id = $request->delivery_boy_id;
            $order->save();

            try {
                dispatch(function () use ($order) {
                    CommonHelper::sendNotificationOrderAssignDeliveryBoy($order);
                    CommonHelper::sendMailOrderStatus($order, true);
                })->afterResponse();
            } catch (\Exception $e) {
                Log::error("Delivery boy assigned on order Send mail error :", [$e->getMessage()]);
            }

            return CommonHelper::responseSuccess('delivery_boy_assigned_successfully_for_this_order');
        } else {
            return CommonHelper::responseError('order_not_found');
        }
    }

    public function updateItemsStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required',
            'status_id' => 'required',
        ], [
            'ids.required' => 'The Item id field is required.',
            'status_id.required' => 'The status field is required.',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        $ids = explode(",", $request->ids);
        foreach ($ids as $key => $id) {
            $orderItem = OrderItem::find($id);
            $orderItem->active_status = $request->status_id;
            $orderItem->save();

            $orderStatus = array();
            $orderStatus["order_id"] = $orderItem->order_id;
            $orderStatus["order_item_id"] = $id;
            $orderStatus["status"] = $request->status_id;
            $orderStatus["created_by"] = auth()->user()->id;
            $orderStatus["user_type"] = auth()->user()->role_id;
            CommonHelper::setOrderStatus($orderStatus);
        }
        return CommonHelper::responseSuccess('order_updated_successfully');
    }

    public function updateSelfPickupOrderStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required',
            'status_id' => 'required',
            'order_item_id' => 'nullable|integer',
        ], [
            'order_id.required' => 'The Order id field is required.',
            'status_id.required' => 'The status field is required.',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $order = Order::find($request->order_id);
        if (empty($order)) {
            return CommonHelper::responseError('order_not_found');
        }

        if ($order->order_type !== 'selfpickup') {
            return CommonHelper::responseError('this_is_not_a_self_pickup_order');
        }

        if (isset($request->order_item_id) && $request->order_item_id != "") {
            return $this->handleItemReturn($request, $order);
        }

        $selectedStatus = OrderStatusList::where('id', $request->status_id)->value('status');

        if ($order->active_status == $request->status_id) {
            return CommonHelper::responseError(__('this_order_is_already') . " " . $selectedStatus . "!");
        }

        $selfPickupStatuses = [
            OrderStatusList::$selfPickupPending,
            OrderStatusList::$selfPickupReady,
            OrderStatusList::$selfPickupPicked,
        ];

        if (!in_array($request->status_id, $selfPickupStatuses)) {
            return CommonHelper::responseError('invalid_status');
        }

        if ($order->active_status == OrderStatusList::$selfPickupPicked) {
            return CommonHelper::responseError('order_is_already_picked_up');
        }
        if ($order->active_status == OrderStatusList::$returned) {
            return CommonHelper::responseError('order_is_already_returned');
        }
        if ($order->active_status == OrderStatusList::$cancelled) {
            return CommonHelper::responseError('order_is_already_cancelled');
        }

        if ($order->active_status > $request->status_id) {
            return CommonHelper::responseError('you_cannot_update_this_order_status_to' . " " . $selectedStatus . "!");
        }

        if ($order->active_status == OrderStatusList::$paymentPending) {
            return CommonHelper::responseError('payment_is_pending_without_payment_order_can_not_be_processed');
        }

        DB::beginTransaction();
        try {
            if ($order->active_status != $request->status_id) {
                $order->active_status = $request->status_id;
                $order->save();

                $excludedStatuses = [OrderStatusList::$cancelled];
                $query = OrderItem::where("order_id", $request->order_id)
                    ->whereNotIn("active_status", $excludedStatuses)
                    ->update(['active_status' => $request->status_id]);

                $orderStatus = array();
                $orderStatus["order_id"] = $request->order_id;
                $orderStatus['order_item_id'] = 0;
                $orderStatus["status"] = $request->status_id;
                $orderStatus["created_by"] = auth()->user()->id;
                $orderStatus["user_type"] = auth()->user()->role_id;
                CommonHelper::setOrderStatus($orderStatus);
            } else {
                $status = OrderStatusList::find($request->status_id);
                return CommonHelper::responseError(__('this_order_is_already') . " " . $status->status);
            }
            DB::commit();
        } catch (\Exception $e) {
            Log::info("Error : " . $e->getMessage());
            DB::rollBack();
            throw $e;
            return CommonHelper::responseError('something_went_wrong');
        }

        $order = Order::with('items')->where("id", $request->order_id)->first();

        if (!empty($order)) {
            try {
                dispatch(function () use ($order) {
                    CommonHelper::sendNotificationOrderStatus($order, 'order_item_status_update');
                    CommonHelper::sendOrderNotificationsToAdmins($order, 'order_status_update', $order->delivery_boy_id ?? null);
                })->afterResponse();
            } catch (\Exception $e) {
                Log::error("Self pickup order status notification error: " . $e->getMessage());
            }

            try {
                dispatch(new SendEmailJob($order))->afterResponse();
            } catch (\Exception $e) {
                Log::error("Self pickup order status email error: " . $e->getMessage());
            }

            try {
                dispatch(function () use ($order) {
                    CommonHelper::sendSmsOrderStatus($order, $order->active_status);
                })->afterResponse();
            } catch (\Exception $e) {
                Log::error("Self pickup order status SMS error: " . $e->getMessage());
            }
        }

        return CommonHelper::responseSuccess('self_pickup_order_updated_successfully');
    }

    private function handleItemReturn($request, $order)
    {
        $orderItem = OrderItem::find($request->order_item_id);
        if (empty($orderItem)) {
            return CommonHelper::responseError('order_item_not_found');
        }

        if ($request->status_id != OrderStatusList::$returned) {
            return CommonHelper::responseError('invalid_status_for_product_return');
        }

        if ($orderItem->active_status == OrderStatusList::$returned || $orderItem->active_status == OrderStatusList::$cancelled) {
            return CommonHelper::responseError('this_product_is_already_returned_or_cancelled');
        }

        if ($order->active_status != OrderStatusList::$selfPickupPicked) {
            return CommonHelper::responseError('order_must_be_picked_up_before_returning_products');
        }

        DB::beginTransaction();
        try {
            $orderItem->active_status = $request->status_id;
            $orderItem->cancellation_reason = $request->reason ?? 'Product returned by customer';
            $orderItem->save();

            $remainingActiveItems = OrderItem::where("order_id", $order->id)
                ->where('id', '!=', $orderItem->id)
                ->where('active_status', '!=', OrderStatusList::$cancelled)
                ->where('active_status', '!=', OrderStatusList::$returned)
                ->count();

            if ($remainingActiveItems == 0) {
                $additional_charges = json_decode($order->additional_charges, true) ?? [];
                $additional_charges_total = array_sum(array_column($additional_charges, 'amount'));

                $order->active_status = OrderStatusList::$returned;
                $order->remaining_total = 0;
                $order->final_total = $additional_charges_total;
                $order->remaining_final = $additional_charges_total;
                $order->save();
            } else {
                $additional_charges = json_decode($order->additional_charges, true) ?? [];
                $additional_charges_total = array_sum(array_column($additional_charges, 'amount'));

                $order->remaining_total = floatval($order->remaining_total) - floatval($orderItem->sub_total);
                $order->remaining_final = floatval($order->remaining_total) + $additional_charges_total;

                $order->final_total = $order->remaining_final;

                $order->save();
            }

            $product_variant_id = $orderItem->product_variant_id;
            $product_variant = ProductVariant::where('id', $product_variant_id)->first();

            if ($product_variant) {
                $new_stock_value = $product_variant->stock + $orderItem->quantity;
                $product_variant->stock = $new_stock_value;
                $product_variant->save();
            }

            try {
                CommonHelper::sendSmsOrderStatus($orderItem, 9);
                CommonHelper::sendOrderItemStatusMailNotification($orderItem, 'order_item_status_update');
            } catch (\Exception $e) {
                Log::error("Error sending notifications for item return: " . $e->getMessage());
            }

            DB::commit();
        } catch (\Exception $e) {
            Log::info("Error returning product: " . $e->getMessage());
            DB::rollBack();
            return CommonHelper::responseError('something_went_wrong_while_returning_the_product');
        }

        return CommonHelper::responseSuccess('product_returned_successfully');
    }

    public function cancelOrderItem(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_item_id' => 'required|integer',
            'cancellation_reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $order_item = OrderItem::find($request->order_item_id);

        if (empty($order_item)) {
            return CommonHelper::responseError('order_item_not_found');
        }

        $order = Order::find($order_item->order_id);
        if (empty($order)) {
            return CommonHelper::responseError('order_not_found');
        }

        if ($order->active_status == OrderStatusList::$cancelled || $order->active_status == OrderStatusList::$returned) {
            return CommonHelper::responseError('order_is_already_cancelled_or_returned');
        }

        if ($order->active_status == OrderStatusList::$delivered || $order->active_status == OrderStatusList::$selfPickupPicked) {
            return CommonHelper::responseError('order_is_already_delivered');
        }

        if (empty($order_item)) {
            return CommonHelper::responseError('order_item_not_found');
        }

        if ($order_item->active_status == OrderStatusList::$cancelled) {
            return CommonHelper::responseError('order_item_is_already_cancelled');
        }

        if ($order_item->active_status == OrderStatusList::$delivered || $order_item->active_status == OrderStatusList::$returned) {
            return CommonHelper::responseError('order_item_cannot_be_cancelled');
        }

        $postStatus = OrderStatusList::$cancelled;

        DB::beginTransaction();
        try {
            $itemNum = OrderItem::where("order_id", $order->id)->count();
            $lastItemNum = OrderItem::where("order_id", $order->id)
                ->where('active_status', '!=', OrderStatusList::$cancelled)
                ->count();

            if ($itemNum == 1 || $lastItemNum == 1) {
                $order_status = array();
                $order_status['order_id'] = $order->id;
                $order_status['order_item_id'] = $order_item->id;
                $order_status['status'] = $postStatus;
                $order_status['created_by'] = auth()->user()->id;
                $order_status['user_type'] = OrderStatus::$userTypeUser;
                CommonHelper::setOrderStatus($order_status);
                $order->active_status = OrderStatusList::$cancelled;
                $order->save();
            }

            $user = User::find($order->user_id);
            $currentBalance = floatval($user->balance);

            $additional_charges = json_decode($order->additional_charges, true) ?? [];
            $additional_charges_total = array_sum(array_column($additional_charges, 'amount'));
            $refundable_charges_total = 0;
            foreach ($additional_charges as $charge) {
                if (isset($charge['is_refundable']) && $charge['is_refundable'] == 1) {
                    $refundable_charges_total += floatval($charge['amount']);
                }
            }

            $isLastItem = ($itemNum == 1 || $lastItemNum == 1);

            $isCod = ($order->payment_method === Transaction::$paymentTypeCod);
            $isPaymentPending = ($order->active_status == OrderStatusList::$paymentPending);

            $allItemsSubTotal = floatval(OrderItem::where('order_id', $order->id)->sum('sub_total'));
            $itemSubTotal = floatval($order_item->sub_total);
            $itemShare = ($allItemsSubTotal > 0) ? ($itemSubTotal / $allItemsSubTotal) : 0;

            $refundable = 0;
            $walletRefund = 0;

            $non_refundable_charges_total = $additional_charges_total - $refundable_charges_total;

            if (!$isCod && !$isPaymentPending) {
                if ($isLastItem) {
                    $refundable = max(0, floatval($order->remaining_final) - $non_refundable_charges_total - floatval($order->delivery_charge));
                } else {
                    // Non-COD: customer already paid, refund item amount proportionally
                    $refundable = $itemSubTotal;

                    if (floatval($order->promo_discount ?? 0) > 0) {
                        $refundable -= floatval($order->promo_discount) * $itemShare;
                    }

                    if ($refundable_charges_total > 0) {
                        $refundable += $refundable_charges_total * $itemShare;
                    }
                }
            }

            // Wallet refund: applies to COD and non-COD but not payment pending (wallet was deducted at order time)
            if (!$isPaymentPending && floatval($order->wallet_balance ?? 0) > 0) {
                if ($isLastItem) {
                    $walletRefund = floatval($order->wallet_balance);
                } else {
                    $activeSubTotal = floatval(OrderItem::where('order_id', $order->id)
                        ->where('active_status', '!=', OrderStatusList::$cancelled)
                        ->sum('sub_total'));
                    $walletShare = ($activeSubTotal > 0) ? ($itemSubTotal / $activeSubTotal) : 0;
                    $walletRefund = floatval($order->wallet_balance) * $walletShare;
                }
                // For COD, the item amount isn't collected yet, so we only refund the wallet portion they already pre-paid.
                // For Non-COD, the $refundable already represents the ENTIRE amount paid (Gateway + Wallet), doing += would double-refund the wallet portion.
                if ($isCod) {
                    $refundable += $walletRefund;
                }
                $order->wallet_balance = floatval($order->wallet_balance) - $walletRefund;
            }

            $refundable = max(0, round($refundable, 2));

            // Update order totals
            if ($isLastItem) {
                $order->remaining_total = 0;
                $order->remaining_final = $non_refundable_charges_total + floatval($order->delivery_charge);
                $order->wallet_balance = 0;
            } else {
                $order->remaining_total = max(0, floatval($order->remaining_total) - $itemSubTotal);
                $nonWalletRefund = $refundable - $walletRefund;
                $order->remaining_final = max(0, floatval($order->remaining_final) - $nonWalletRefund);
            }

            // Process refund to wallet
            if ($refundable > 0) {
                $new_balance = $currentBalance + $refundable;
                CommonHelper::updateUserWalletBalance($new_balance, $order->user_id);
                CommonHelper::addWalletTransaction($order->id, $order_item->id, $order->user_id, 'credit', $refundable, 'wallet_order_item_cancelled');
            }

            $order->save();

            $order_item->active_status = $postStatus;
            $order_item->cancellation_reason = $request->cancellation_reason;
            $order_item->canceled_at = now();
            $order_item->save();

            $product_variant = ProductVariant::where('id', $order_item->product_variant_id)->first();
            if ($product_variant) {
                $product_variant->stock += $order_item->quantity;
                $product_variant->save();
            }

            if (isset($order->promo_code) && $order->promo_code != null && isset($order->promo_discount) && $order->promo_discount != null) {
                $promo_code = explode("(", $order->promo_code);
                $promoCodeModel = PromoCode::where('promo_code', $promo_code[0])->first();
                if ($promoCodeModel && isset($promoCodeModel->minimum_order_amount) && $order->total < $promoCodeModel->minimum_order_amount) {
                    CommonHelper::updateOrderPromoCode($order->id, $order->promo_discount);
                }
            }

            DB::commit();

            dispatch(function () use ($order, $order_item) {
                try {
                    CommonHelper::sendNotificationOrderStatus($order, 'order_item_status_update');
                } catch (\Exception $e) {
                    Log::error("Cancel order item notification error: " . $e->getMessage());
                }

                try {
                    CommonHelper::sendOrderItemStatusMailNotification($order_item, 'order_item_status_update');
                } catch (\Exception $e) {
                    Log::error("Cancel order item mail notification error: " . $e->getMessage());
                }

                try {
                    CommonHelper::sendSmsOrderStatus($order_item, OrderStatusList::$cancelled);
                } catch (\Exception $e) {
                    Log::error("Cancel order item SMS error: " . $e->getMessage());
                }
            })->afterResponse();

            return CommonHelper::responseSuccess('order_cancelled_successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Cancel order item error: " . $e->getMessage());
            return CommonHelper::responseError('something_went_wrong');
        }
    }

    private function getSellersWithTranslations(): array
    {
        $languageService = app(LanguageService::class);
        $defaultLang = $languageService->getDefaultLanguage();
        $defaultCode = $defaultLang ? $languageService->getLanguageCode($defaultLang->id) : 'en';
        $activeLangCodes = collect($languageService->getActiveLanguages())->pluck('code')->filter()->values()->all();

        $sellers = Seller::select('id', 'name')
            ->where('status', 1)
            ->with('translations')
            ->orderBy('id', 'DESC')
            ->get();

        $result = [];
        foreach ($sellers as $seller) {
            $nameByCode = [];
            $all = $seller->getAllActiveLanguageTranslations();
            foreach ($all as $t) {
                $code = $t['language_code'] ?? '';
                if ($code !== '') {
                    $nameByCode[$code] = trim((string) ($t['name'] ?? ''));
                }
            }
            $defaultName = $nameByCode[$defaultCode] ?? $seller->getAttributeValue('name') ?? '';
            $nameObj = (object) [];
            foreach ($activeLangCodes as $code) {
                $nameObj->{$code} = ($nameByCode[$code] ?? '') !== '' ? $nameByCode[$code] : $defaultName;
            }
            if ((array) $nameObj === []) {
                $nameObj = (object) ['en' => $seller->getAttributeValue('name') ?? ''];
            }
            $result[] = [
                'id' => $seller->id,
                'name' => $nameObj,
            ];
        }
        return $result;
    }

    private function getDeliveryBoysWithTranslations(?int $cityId): array
    {
        $languageService = app(LanguageService::class);
        $defaultLang = $languageService->getDefaultLanguage();
        $defaultCode = $defaultLang ? $languageService->getLanguageCode($defaultLang->id) : 'en';
        $activeLangCodes = collect($languageService->getActiveLanguages())->pluck('code')->filter()->values()->all();

        $query = DeliveryBoy::where('status', 1);
        if ($cityId !== null) {
            $query->where('city_id', $cityId);
        }
        $deliveryBoys = $query->with('translations')->orderBy('id', 'DESC')->get();

        $result = [];
        foreach ($deliveryBoys as $db) {
            $nameByCode = [];
            $all = $db->getAllActiveLanguageTranslations();
            foreach ($all as $t) {
                $code = $t['language_code'] ?? '';
                if ($code !== '') {
                    $nameByCode[$code] = trim((string) ($t['name'] ?? ''));
                }
            }
            $defaultName = $nameByCode[$defaultCode] ?? $db->getAttributeValue('name') ?? '';
            $nameObj = (object) [];
            foreach ($activeLangCodes as $code) {
                $nameObj->{$code} = ($nameByCode[$code] ?? '') !== '' ? $nameByCode[$code] : $defaultName;
            }
            if ((array) $nameObj === []) {
                $nameObj = (object) ['en' => $db->getAttributeValue('name') ?? ''];
            }
            $result[] = [
                'id' => $db->id,
                'name' => $nameObj,
                'pending_order_count' => $db->pending_order_count ?? 0,
                'driving_license_url' => $db->driving_license_url ?? null,
                'national_identity_card_url' => $db->national_identity_card_url ?? null,
            ];
        }
        return $result;
    }
}
