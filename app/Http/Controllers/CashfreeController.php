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
use App\Models\Admin;
use App\Notifications\OrderNotification;
use App\Jobs\SendEmailJob;
use App\Models\OrderItem;

class CashfreeController extends Controller
{

    public function cashfreeWebhook(Request $request)
    {

        $notification = $request->all();

        // Log the notification for debugging
        Log::info("Cashfree Callback: " .print_r($notification, true));

        try {
            if ($notification['data']['order']['transaction_status'] ?? $notification['data']['payment']['payment_status']== 'SUCCESS') {
                // transaction
                $order_id = $notification['data']['link_id'] ?? $notification['data']['order']['order_tags']['link_id'] ?? $notification['data']['order']['order_id'] ?? '';
                
                Log::info("Cashfree Callback - link_id/order_id: " . $order_id);
                
                $explode = explode('-', $order_id);
                Log::info("Cashfree Callback - Exploded parts: " . json_encode($explode));
                if ($explode[0] == 'order') {
                     Log::info("Cashfree Callbackorder: " .print_r($notification, true));
                    $transactionData = array();
                    $transactionData['user_id'] = $explode[2];
                    $transactionData['order_id'] = $explode[1];
                    $transactionData['type'] = Transaction::$typeCashfree;
                    $transactionData['txn_id'] = $notification['data']['order']['transaction_id'] ?? $notification['data']['payment']['cf_payment_id'];
                    $transactionData['payu_txn_id'] = "";
                    $transactionData['amount'] = $notification['data']['order']['order_amount'] ?? $notification['data']['payment']['payment_amount'];
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
                        CommonHelper::addWalletTransaction($explode[1], 0, $user->id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, Transaction::$paymentTypeCashfree);
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

                } elseif ($explode[0] == 'wallet') {
                    Log::info("Cashfree Callbackwallet: " . print_r($notification, true));
                    $dateTime = Carbon::createFromFormat('YmdHis', $explode[1]);
                    $formattedDateTime = $dateTime->format('Y-m-d H:i:s');
                    $walletTransactionData = array();
                    $walletTransactionData['user_id'] = $explode[2];
                    $walletTransactionData['order_id'] = '';
                    $walletTransactionData['type'] = 'credit';
                    $walletTransactionData['payment_type'] = Transaction::$paymentTypeCashfree;
                    $walletTransactionData['txn_id'] = $notification['data']['order']['transaction_id'] ?? $notification['data']['payment']['cf_payment_id'];
                    $walletTransactionData['amount'] = $notification['data']['order']['order_amount'] ?? $notification['data']['payment']['payment_amount'];
                    $walletTransactionData['status'] = Transaction::$statusSuccess;
                    $walletTransactionData['message'] = 'wallet_successfully_recharged';
                    $walletTransactionData['transaction_date'] = $formattedDateTime;
                    $wallet_transaction = WalletTransaction::create($walletTransactionData);

                    $newBalance = CommonHelper::addUserWalletBalance($walletTransactionData['amount'],$explode[2]);

                } elseif ($explode[0] == 'subscription') {
                    // Handle subscription payment for Cashfree
                    Log::info("Cashfree Callback Subscription: " . print_r($notification, true));
                    Log::info("Cashfree Subscription - Exploded link_id: " . json_encode($explode));
                    
                    // Format: subscription-{plan_id}-{user_id}-{uniqueString}
                    $subscription_plan_id = isset($explode[1]) && is_numeric($explode[1]) ? (int)$explode[1] : 0;
                    $user_id = isset($explode[2]) && is_numeric($explode[2]) ? (int)$explode[2] : 0;
                    
                    // Try to get plan_id from link_notes if available
                    if ($subscription_plan_id == 0) {
                        // Check order_tags for link_notes
                        $order_tags = $notification['data']['order']['order_tags'] ?? [];
                        $link_notes = $order_tags['link_notes'] ?? null;
                        
                        if ($link_notes) {
                            $notes = [];
                            
                            // link_notes should be a map[string]string (array/object)
                            if (is_array($link_notes)) {
                                $notes = $link_notes;
                            } elseif (is_string($link_notes)) {
                                // Try to parse as JSON (for backward compatibility)
                                $decoded = json_decode($link_notes, true);
                                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                    $notes = $decoded;
                                }
                            }
                            
                            // First try subscription_plan_id from link_notes
                            if (isset($notes['subscription_plan_id']) && is_numeric($notes['subscription_plan_id']) && $notes['subscription_plan_id'] > 0) {
                                $subscription_plan_id = (int)$notes['subscription_plan_id'];
                                Log::info("Cashfree Subscription - Got plan_id from link_notes.subscription_plan_id: $subscription_plan_id");
                            } elseif (isset($notes['plan_id']) && is_numeric($notes['plan_id']) && $notes['plan_id'] > 0) {
                                // Try plan_id (current format)
                                $subscription_plan_id = (int)$notes['plan_id'];
                                Log::info("Cashfree Subscription - Got plan_id from link_notes.plan_id: $subscription_plan_id");
                            } elseif (isset($notes['original_order_id']) && is_numeric($notes['original_order_id']) && $notes['original_order_id'] > 0) {
                                // Fallback to original_order_id (old format)
                                $subscription_plan_id = (int)$notes['original_order_id'];
                                Log::info("Cashfree Subscription - Got plan_id from link_notes.original_order_id: $subscription_plan_id");
                            } elseif (isset($notes['order_id']) && is_numeric($notes['order_id']) && $notes['order_id'] > 0) {
                                // Try order_id (current format)
                                $subscription_plan_id = (int)$notes['order_id'];
                                Log::info("Cashfree Subscription - Got plan_id from link_notes.order_id: $subscription_plan_id");
                            }
                        }
                        
                        // Also check if subscription_plan_id is directly in order_tags
                        if ($subscription_plan_id == 0 && isset($order_tags['subscription_plan_id']) && is_numeric($order_tags['subscription_plan_id'])) {
                            $subscription_plan_id = (int)$order_tags['subscription_plan_id'];
                            Log::info("Cashfree Subscription - Got plan_id from order_tags.subscription_plan_id: $subscription_plan_id");
                        }
                    }
                    
                    Log::info("Cashfree Subscription - Final plan_id: $subscription_plan_id, user_id: $user_id");
                    
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
                            $transactionData['type'] = Transaction::$typeCashfree;
                            $transactionData['txn_id'] = $notification['data']['order']['transaction_id'] ?? $notification['data']['payment']['cf_payment_id'];
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
                            
                            Log::info("Cashfree | Subscription activated successfully for user: " . $user_id);
                        } else {
                            Log::error("Cashfree | Subscription plan not found or inactive: " . $subscription_plan_id);
                        }
                    } else {
                        Log::error("Cashfree | Invalid subscription payment data - plan_id: $subscription_plan_id, user_id: $user_id");
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
            Log::error("Error processing Cashfree callback: " . $e->getMessage());
            return CommonHelper::responseError("An error occurred while processing the callback.");
        }
    }

    public function cashfreeRedirect(Request $request)
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
                    ->where('type', Transaction::$typeCashfree)
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
            $redirect_url = $website_url . '/web-payment-status?status=' . $status . '&type='.$explode[0].'&order_id='.$explode[1].'&payment_method=Cashfree';
            return redirect($redirect_url);
        } else {
            return redirect()->route('/', ['status' => $status]);
        }
    }

}