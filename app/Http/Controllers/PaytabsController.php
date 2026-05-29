<?php

namespace App\Http\Controllers;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatusList;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Support\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Jobs\SendEmailJob;
use App\Models\OrderItem;

class PaytabsController extends Controller
{

    public function paytabsWebhook(Request $request)
    {
      
        $notification = $request->all();
        $website_url = Setting::get_value('website_url') ?? "";
 
        try {
            if ($notification['payment_result']['response_status'] == 'A') {
                // transaction
                $order_id = $notification['cart_id']  ;
                
                $explode = explode('-', $order_id);
                if ($explode[0] == 'order') {
                    $transactionData = array();
                    $transactionData['user_id'] = $explode[2];
                    $transactionData['order_id'] = $explode[1];
                    $transactionData['type'] = Transaction::$typePaytabs;
                    $transactionData['txn_id'] = $notification['tran_ref'];
                    $transactionData['payu_txn_id'] = "";
                    $transactionData['amount'] = $notification['tran_total'];
                    $transactionData['status'] = Transaction::$statusSuccess;
                    $transactionData['message'] = 'txn_order_payment';
                    $transactionData['transaction_date'] = now();

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
                        CommonHelper::addWalletTransaction($order->id, 0, $user->id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, Transaction::$paymentTypePaytabs);
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

                    if (isset($website_url) && !empty($website_url)) { 
                        $redirect_url = $website_url . '/web-payment-status?status=' . $notification['payment_result']['response_status'] . '&type=order&payment_method=Phonepe';
                        return redirect($redirect_url);
                    } else {
                        return redirect()->route('phonepe.redirect', ['status' => $notification['payment_result']['response_status']]);
                    }

                } elseif ($explode[0] == 'wallet') {
                    $dateTime = Carbon::createFromFormat('YmdHis', $explode[1]);
                    $formattedDateTime = $dateTime->format('Y-m-d H:i:s');
                    $walletTransactionData = array();
                    $walletTransactionData['user_id'] = $explode[2];
                    $walletTransactionData['order_id'] = '';
                    $walletTransactionData['type'] = 'credit';
                    $walletTransactionData['payment_type'] = Transaction::$paymentTypePaytabs;
                    $walletTransactionData['txn_id'] = $notification['tran_ref'];
                    $walletTransactionData['amount'] = $notification['tran_total'];
                    $walletTransactionData['status'] = Transaction::$statusSuccess;
                    $walletTransactionData['message'] = 'wallet_successfully_recharged';
                    $walletTransactionData['transaction_date'] = $formattedDateTime;
                    $wallet_transaction = WalletTransaction::create($walletTransactionData);

                    $newBalance = CommonHelper::addUserWalletBalance($walletTransactionData['amount'],$explode[2]);

                    if (isset($website_url) && !empty($website_url)) {
                        $redirect_url = $website_url . '/web-payment-status?status=' . $notification['payment_result']['response_status'] . '&type=wallet&payment_method=Paytabs';
                        return redirect($redirect_url);
                    } else {
                        return redirect()->route('paytabs.redirect', ['order' => $order_id]);
                    }
                } elseif ($explode[0] == 'subscription') {
                    // Handle subscription payment for Paytabs
                    $subscription_plan_id = isset($explode[1]) && is_numeric($explode[1]) ? (int)$explode[1] : 0;
                    $user_id = isset($explode[2]) && is_numeric($explode[2]) ? (int)$explode[2] : 0;
                    
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
                            $transactionData['type'] = Transaction::$typePaytabs;
                            $transactionData['txn_id'] = $notification['tran_ref'];
                            $transactionData['payu_txn_id'] = "";
                            $transactionData['amount'] = $subscription_amount;
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
                                                        
                            if (isset($website_url) && !empty($website_url)) {
                                $redirect_url = $website_url . '/web-payment-status?status=' . $notification['payment_result']['response_status'] . '&subscription_plan_id='.$subscription_plan_id.'&type=subscription&payment_method=Paytabs';
                                return redirect($redirect_url);
                            } else {
                                return redirect()->route('paytabs.redirect', ['order' => $order_id]);
                            }
                        } else {
                            Log::error("Paytabs | Subscription plan not found or inactive: " . $subscription_plan_id);
                        }
                    } else {
                        Log::error("Paytabs | Invalid subscription payment data - plan_id: $subscription_plan_id, user_id: $user_id");
                    }
                }
            } else {
                $order_id = $notification['data']['order']['order_tags']['link_id'];
                $explode = explode('-', $order_id);
                if ($explode[0] == 'order') {
                    Order::where('id', $explode[1])->update(['active_status' => OrderStatusList::$cancelled]);
                }
            }
        } catch (\Exception $e) {
            Log::error("Error processing Paytabs callback: " . $e->getMessage());
            return CommonHelper::responseError("An error occurred while processing the callback.");
        }
    }

    public function paytabsRedirect(Request $request)
    {
       
        $order_id = $request->order;
        $explode = explode('-', $order_id);
    if ($explode[0] == 'order') {
        
        $order_status = Order::where('id', $explode[1])->where('user_id', $explode[2])->value('active_status');
        
        if($order_status != OrderStatusList::$cancelled){
             $status = Transaction::where('order_id', $explode[1])->where('user_id', $explode[2])->value('status');
        }else{
           $status =  Transaction::$statusFailed;
        }
               

    }elseif($explode[0] == 'wallet'){
        $dateTime = Carbon::createFromFormat('YmdHis', $explode[1]);
        $formattedDateTime = $dateTime->format('Y-m-d H:i:s');

        $status = WalletTransaction::where('transaction_date', $formattedDateTime)->where('user_id', $explode[2])->value('status') ?? 'failed';
      
    }elseif($explode[0] == 'subscription'){
        // Check subscription transaction status
        $subscription_plan_id = isset($explode[1]) && is_numeric($explode[1]) ? (int)$explode[1] : 0;
        $user_id = isset($explode[2]) && is_numeric($explode[2]) ? (int)$explode[2] : 0;
        
        if ($subscription_plan_id > 0 && $user_id > 0) {
            // Check if user has active subscription for this plan
            $userSubscription = UserSubscription::where('user_id', $user_id)
                ->where('plan_id', $subscription_plan_id)
                ->where('status', 'active')
                ->first();
            
            if ($userSubscription) {
                $status = Transaction::$statusSuccess;
            } else {
                // Check transaction table
                $transaction = Transaction::where('user_id', $user_id)
                    ->where('order_id', 0)
                    ->where('type', Transaction::$typePaytabs)
                    ->orderBy('created_at', 'desc')
                    ->first();
                
                $status = $transaction ? $transaction->status : Transaction::$statusFailed;
            }
        } else {
            $status = Transaction::$statusFailed;
        }
    }
  
        $website_url = Setting::get_value('website_url') ?? "";
        if (isset($website_url) && !empty($website_url)) {
            $redirect_url = $website_url . '/web-payment-status?status=' . $status . '&type='.$explode[0].'&payment_method=Paytabs&order_id='.$explode[1];
            return redirect($redirect_url);
        } else {
            return redirect()->route('/', ['status' => $status]);
        }
    }

}