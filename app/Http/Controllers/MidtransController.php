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

class MidtransController extends Controller
{
    public function midtransWebhook(Request $request)
    {
        $notification = $request->all();

        // Log the notification for debugging
        Log::info("Midtrans Callback: " . print_r($notification, true));
        
        try {
            if ($notification['status_code'] == 200) {
                // Process the notification data here
                // Example: Update your database based on the notification
                
                // Transaction
                $order_id = $notification['order_id'];
                $explode = explode('-', $order_id);
                
                if ($explode[0] == 'order') {
                    $transactionData = [
                        'user_id' => $explode[2],
                        'order_id' => $explode[1],
                        'type' => Transaction::$typeMidtrans,
                        'txn_id' => $notification['transaction_id'],
                        'payu_txn_id' => "",
                        'amount' => $notification['gross_amount'] / 1000,
                        'status' => $notification['transaction_status'],
                        'message' => $notification['status_message'],
                        'transaction_date' => $notification['transaction_time'],
                    ];

                    $transaction = Transaction::create($transactionData);
                    $order = Order::withTrashed()->where('id', $explode[1])->first();
                    $user = User::where('id', $explode[2])->first();
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
                        CommonHelper::addWalletTransaction($order->id, 0, $user->id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, Transaction::$paymentTypeMidtrans);
                    }

                    $order->save();
                    $excludedStatuses = [OrderStatusList::$cancelled, OrderStatusList::$returned];

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

                    return CommonHelper::responseSuccess("Order Placed Successfully");
                } elseif ($explode[0] == 'wallet') {
                    Log::info("Midtrans Callback wallet: " . print_r($notification, true));

                    $walletTransactionData = [
                        'user_id' => $explode[2],
                        'order_id' => '',
                        'type' => 'credit',
                        'payment_type' => 'Midtrans',
                        'txn_id' => $notification['transaction_id'],
                        'amount' => $notification['gross_amount'] / 1000,
                        'status' => $notification['transaction_status'],
                        'message' => 'wallet_successfully_recharged',
                        'transaction_date' => $notification['transaction_time'],
                    ];

                    $wallet_transaction = WalletTransaction::create($walletTransactionData);
                    $user = User::where('id', $explode[2])->first();

                    // Mark credit amount in user balance
                    $balance = $user->balance;
                    $newBalance = $balance + $walletTransactionData['amount'];

                    $user->update(['balance' => $newBalance]);
                    $data = ['user_balance' => $newBalance];

                    return CommonHelper::responseSuccessWithData("Amount Added in Wallet Successfully", $data);
                } elseif ($explode[0] == 'subscription') {
                    // Handle subscription payment for Midtrans
                    Log::info("Midtrans Callback Subscription: " . print_r($notification, true));
                    
                    $subscription_plan_id = isset($explode[1]) && is_numeric($explode[1]) ? $explode[1] : 0;
                    $user_id = isset($explode[2]) && is_numeric($explode[2]) ? $explode[2] : 0;
                    
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
                            $transactionData['type'] = 'Midtrans';
                            $transactionData['txn_id'] = $notification['transaction_id'];
                            $transactionData['payu_txn_id'] = "";
                            $transactionData['amount'] = $notification['gross_amount'] / 1000;
                            $transactionData['status'] = $notification['transaction_status'] == 'settlement' ? Transaction::$statusSuccess : $notification['transaction_status'];
                            $transactionData['message'] = 'txn_subscription_successfully_activated';
                            $transactionData['transaction_date'] = $notification['transaction_time'];
                            $transaction = Transaction::create($transactionData);
                            
                            // Only create subscription if transaction status is success
                            if ($transactionData['status'] == Transaction::$statusSuccess) {
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
                                
                                Log::info("Midtrans | Subscription activated successfully for user: " . $user_id);
                                return CommonHelper::responseSuccess("Subscription Activated Successfully");
                            } else {
                                return CommonHelper::responseError("Subscription Payment Failed, Please try again!");
                            }
                        } else {
                            return CommonHelper::responseError("Subscription plan not found or inactive!");
                        }
                    } else {
                        return CommonHelper::responseError("Invalid subscription payment data!");
                    }
                }
            } else {
                $order_id = $notification['order_id'];
                $explode = explode('-', $order_id);
                if ($explode[0] == 'order') {
                    Order::where('id', $explode[1])->update(['active_status' => OrderStatusList::$cancelled]);
                }
            }
        } catch (\Exception $e) {
            Log::error("Error processing Midtrans callback: " . $e->getMessage());
            return CommonHelper::responseError("An error occurred while processing the callback.");
        }
    }
}