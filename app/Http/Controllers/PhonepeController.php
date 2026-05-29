<?php

namespace App\Http\Controllers;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusList;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Jobs\SendEmailJob;
use App\Models\OrderItem;

class PhonepeController extends Controller
{

    public function phonepeWebhook(Request $request)
    {
        $notification = $request->all();
        $website_url = \App\Models\Setting::get_value('website_url') ?? "";

        // Log the notification for debugging
        Log::info("Phonepe Callback: " . print_r($notification, true));

        try {
            if ($notification['code'] == 'PAYMENT_SUCCESS') {
                // transaction
                $order_id = $notification['transactionId'];
                $explode = explode('-', $order_id);
                if ($explode[1] == 'order') {
                    $transactionData = array();
                    $transactionData['user_id'] = $explode[3];
                    $transactionData['order_id'] = $explode[2];
                    $transactionData['type'] = Transaction::$typePhonepe;
                    $transactionData['txn_id'] = $notification['transactionId'];
                    $transactionData['payu_txn_id'] = "";
                    $transactionData['amount'] = $notification['amount'] / 100;
                    $transactionData['status'] = Transaction::$statusSuccess;
                    $transactionData['message'] = 'txn_order_payment';
                    $transactionData['transaction_date'] = now();

                    $transaction = Transaction::create($transactionData);
                    $order = Order::withTrashed()->where('id', $explode[2])->first();
                    $user = User::where('id', $explode[3])->first();
                    $user_wallet_balance = $user->balance;
                    if (!$order) {
                        return CommonHelper::responseError("Invalid Order Id");
                    }

                    if ($order->order_type == 'selfpickup') {
                        $order->active_status = OrderStatusList::$selfPickupPending;
                    } else {
                        $order->active_status = OrderStatusList::$received;
                    }
                    $order->transaction_id = $transaction->id ?? 0;

                    if (isset($order->wallet_balance) && $order->wallet_balance > 0) {
                        // Deduct the balance & set the wallet transaction
                        $new_balance = $user_wallet_balance < $order->wallet_balance ? 0 : $user_wallet_balance - $order->wallet_balance;
                        CommonHelper::updateUserWalletBalance($new_balance, $user->id);
                        CommonHelper::addWalletTransaction($order->id, 0, $user->id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, Transaction::$paymentTypePhonepe);
                    }

                    $order->save();
                    $excludedStatuses = [OrderStatusList::$cancelled, OrderStatusList::$returned];
Log::info("Phonepe Callback Order Update: Order ID " . $order->id . " updated to status " . $order->active_status);
                    // Update the order items
                    OrderItem::where("order_id", $order->id)
                    ->whereNotIn("active_status", $excludedStatuses)
                    ->update(['active_status' => $order->active_status]);

                    try {
                        dispatch(function () use ($order) {
                            CommonHelper::sendNotificationOrderStatus($order);
                            CommonHelper::sendOrderNotificationsToAdmins($order, 'new_order', $order->delivery_boy_id ?? null);
                        })->afterResponse();
                    } catch (\Exception $e) {
                        Log::error("Place orderNotification error :",[$e->getMessage()] );
                    }
                    try {

                        Log::info("Place order send mail :",[$order] );
                        dispatch(new SendEmailJob($order))->afterResponse();
                    }catch ( \Exception $e){
                        Log::error("Place order Send mail error :",[$e->getMessage()] );
                    }

                    //Place Order Send SMS
                    try {
                        CommonHelper::sendSmsOrderStatus($order, $order->active_status);
                    }catch ( \Exception $e){
                        Log::error("Place order SMS error :",[$e->getMessage()] );
                    }

                    //CommonHelper::addSellerWiseOrder($order->id);
                    if (isset($website_url) && !empty($website_url)) {
                        $redirect_url = $website_url . '/web-payment-status?status=' . $notification['code'] . '&order_id='.$explode[2].'&type=order&payment_method=Phonepe';
                        return redirect($redirect_url);
                    } else {
                        return redirect()->route('phonepe.redirect', ['status' => $notification['code']]);
                    }

                } elseif ($explode[1] == 'wallet') {
                    Log::info("Phonepe Callbackwallet: " . print_r($notification, true));

                    $walletTransactionData = array();
                    $walletTransactionData['user_id'] = $explode[3];
                    $walletTransactionData['order_id'] = 0;
                    $walletTransactionData['type'] = 'credit';
                    $walletTransactionData['payment_type'] = Transaction::$paymentTypePhonepe;
                    $walletTransactionData['txn_id'] = $notification['transactionId'];
                    $walletTransactionData['amount'] = $notification['amount'] / 100;
                    $walletTransactionData['status'] = Transaction::$statusSuccess;
                    $walletTransactionData['message'] = 'wallet_successfully_recharged';
                    $walletTransactionData['transaction_date'] = now();
                    $wallet_transaction = WalletTransaction::create($walletTransactionData);

                    $newBalance = CommonHelper::addUserWalletBalance($walletTransactionData['amount'],$explode[3]);

                    if (isset($website_url) && !empty($website_url)) {
                        $redirect_url = $website_url . '/web-payment-status?status=' . $notification['code'] . '&order_id='.$explode[2].'&type=wallet&payment_method=Phonepe';
                        return redirect($redirect_url);
                    } else {
                        return redirect()->route('phonepe.redirect', ['status' => $notification['code']]);
                    }

                } elseif ($explode[1] == 'subscription') {
                    // Handle subscription payment for Phonepe
                    Log::info("Phonepe Callback Subscription: " . print_r($notification, true));
                    
                    $subscription_plan_id = isset($explode[2]) && is_numeric($explode[2]) ? $explode[2] : 0;
                    $user_id = isset($explode[3]) && is_numeric($explode[3]) ? $explode[3] : 0;
                    
                    if ($subscription_plan_id > 0 && $user_id > 0) {
                        $subscriptionPlan = SubscriptionPlan::where('id', $subscription_plan_id)
                            ->where('status', 1)
                            ->first();
                        
                        if ($subscriptionPlan) {
                            $subscription_amount = $subscriptionPlan->discounted_price ?? $subscriptionPlan->price;
                            
                            // Create transaction record
                            $transactionData = array();
                            $transactionData['user_id'] = $user_id;
                            $transactionData['order_id'] = 0; // No order for subscription
                            $transactionData['type'] = Transaction::$paymentTypePhonepe;
                            $transactionData['txn_id'] = $notification['transactionId'];
                            $transactionData['payu_txn_id'] = "";
                            $transactionData['amount'] = $notification['amount'] / 100;
                            $transactionData['status'] = Transaction::$statusSuccess;
                            $transactionData['message'] = 'txn_subscription_payment';
                            $transactionData['transaction_date'] = now();
                            $transaction = Transaction::create($transactionData);
                            
                            // Create user subscription
                            $startDate = now()->toDateString();
                            $endDate = now()->addDays($subscriptionPlan->days - 1)->toDateString();
                            
                            UserSubscription::create([
                                'user_id' => $user_id,
                                'plan_id' => $subscriptionPlan->id,
                                'plan_name' => $subscriptionPlan->name,
                                'price_paid' => $subscription_amount,
                                'discounted_price' => $subscriptionPlan->discounted_price,
                                'free_delivery_above' => $subscriptionPlan->free_delivery_above,
                                'start_date' => $startDate,
                                'end_date' => $endDate,
                                'status' => 'active'
                            ]);
                            
                            Log::info("Phonepe | Subscription activated successfully for user: " . $user_id);
                            
                            if (isset($website_url) && !empty($website_url)) {
                                $redirect_url = $website_url . '/web-payment-status?status=' . $notification['code'] . '&subscription_plan_id='.$subscription_plan_id.'&type=subscription&payment_method=Phonepe';
                                return redirect($redirect_url);
                            } else {
                                return redirect()->route('phonepe.redirect', ['status' => $notification['code']]);
                            }
                        } else {
                            return CommonHelper::responseError("Subscription plan not found or inactive!");
                        }
                    } else {
                        return CommonHelper::responseError("Invalid subscription payment data!");
                    }
                }
            } else {
                $order_id = $notification['transactionId'];
                $explode = explode('-', $order_id);
                if ($explode[1] == 'order') {
                    Order::where('id', $explode[2])->update(['active_status' => OrderStatusList::$cancelled]);
                }
            }
        } catch (\Exception $e) {
            Log::error("Error processing Phonepe callback: " . $e->getMessage());
            return CommonHelper::responseError("An error occurred while processing the callback.");
        }
    }

}
