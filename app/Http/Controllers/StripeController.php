<?php

namespace App\Http\Controllers;

use App\Helpers\CommonHelper;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusList;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use App\Jobs\SendEmailJob;

class StripeController extends BaseController
{

    public function stripeWebhook(Request $request)
    {

        $stripe_secret_key = Setting::get_value('stripe_secret_key');

        if(!$stripe_secret_key){
            Log::info("Stripe Webhook : stripe_secret_key no found! Skip.");
            return;
        }

        \Stripe\Stripe::setApiKey($stripe_secret_key);
        $endpoint_secret = Setting::get_value('stripe_webhook_secret_key');

        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );

        } catch(\UnexpectedValueException $e) {
            http_response_code(400);
            exit();
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            http_response_code(400);
            exit();
        }

        // Resolve metadata - for charge events, metadata lives on the payment intent, not the charge
        $metadata = $event->data->object->metadata ?? null;
        $txn_id = "";
        $order_id = 0;
        $user_id = 0;
        $amount = 0;
        $currency = "";
        $balance_transaction = 0;
        $transaction = null;
        $subscription_plan_id = 0;

        if (!empty($event->data->object)) {
            $txn_id = $event->data->object->payment_intent ?? $event->data->object->id ?? "";
            $amount = $event->data->object->amount ?? 0;
            $currency = $event->data->object->currency ?? "";
            $balance_transaction = $event->data->object->balance_transaction ?? 0;

            // For charge events, metadata is on the payment intent - fetch it via Stripe API
            if (!empty($txn_id) && (empty($metadata) || count((array)$metadata) === 0) && isset($event->data->object->payment_intent)) {
                try {
                    $stripe_secret_key = Setting::get_value('stripe_secret_key');
                    $stripe = new \Stripe\StripeClient($stripe_secret_key);
                    $paymentIntent = $stripe->paymentIntents->retrieve($txn_id);
                    $metadata = $paymentIntent->metadata ?? null;
                } catch (\Exception $e) {
                    Log::error('Stripe Webhook: Failed to fetch payment intent metadata: ' . $e->getMessage());
                }
            }

            // Try to find existing transaction by txn_id
            if (!empty($txn_id)) {
                $transaction = Transaction::where('txn_id', $txn_id)->first();
                if ($transaction) {
                    $order_id = $transaction['order_id'];
                    $user_id = $transaction['user_id'];
                }
            }

            // If no transaction found, extract from metadata
            if (!$transaction && !empty($metadata)) {
                $order_id = $metadata->order_id ?? 0;
                $user_id = $metadata->user_id ?? 0;
                $subscription_plan_id = $metadata->subscription_plan_id ?? 0;

                // If order_id is numeric and we don't have user_id, look it up from the order
                if (!empty($order_id) && is_numeric($order_id) && empty($user_id)) {
                    $order_data = Order::where('id', $order_id)->first();
                    $user_id = $order_data['user_id'] ?? 0;
                }
            }
        }

        // Handle wallet refill pattern: wallet-refill-user-{user_id}-{timestamp}-{random}
        if (!empty($order_id) && !is_numeric($order_id) && strpos($order_id, "wallet-refill-user") !== false) {
            $temp = explode("-", $order_id);
            if (isset($temp[3]) && is_numeric($temp[3]) && !empty($temp[3])) {
                $user_id = $temp[3];
            }
        }

        // Handle subscription pattern: subscription-{plan_id}-{user_id}
        if ($subscription_plan_id == 0 && !empty($order_id) && !is_numeric($order_id) && strpos($order_id, "subscription") !== false) {
            $temp = explode("-", $order_id);
            if (isset($temp[1]) && is_numeric($temp[1]) && !empty($temp[1])) {
                $subscription_plan_id = $temp[1];
            }
            if (isset($temp[2]) && is_numeric($temp[2]) && !empty($temp[2])) {
                $user_id = $temp[2];
            }
        }

        if ($event->type == 'charge.succeeded'){
            // Handle subscription payment
            if ($subscription_plan_id > 0 && $user_id > 0) {
                $subscriptionPlan = SubscriptionPlan::where('id', $subscription_plan_id)
                    ->where('status', 1)
                    ->first();
                
                if ($subscriptionPlan) {
                    $subscription_amount = $subscriptionPlan->discounted_price ?? $subscriptionPlan->price;
                    
                    // Create or update transaction record
                    if (isset($transaction) && !empty($transaction)) {
                        $transaction->status = Transaction::$statusSuccess;
                        $transaction->save();
                    } else {
                        $transactionData = array();
                        $transactionData['user_id'] = $user_id;
                        $transactionData['order_id'] = 0; // No order for subscription
                        $transactionData['type'] = Transaction::$typeStripe;
                        $transactionData['txn_id'] = $txn_id;
                        $transactionData['payu_txn_id'] = "";
                        $transactionData['amount'] = $subscription_amount;
                        $transactionData['status'] = Transaction::$statusSuccess;
                        $transactionData['message'] = 'txn_subscription_payment';
                        $transactionData['transaction_date'] = date('Y-m-d H:i:s');
                        $transaction = Transaction::create($transactionData);
                    }
                    
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
                    
                }
            } elseif (!empty($order_id)) {
                /* To do the wallet recharge if the order id is set in the above mentioned pattern */
                if (strpos($order_id, "wallet-refill-user") !== false){
                    
                } else {
                    /* process the order and mark it as received */
                    $order = Order::where('id',$order_id)->first();
                    if (isset($order['user_id'])) {

                        if (!$transaction) {
                            $transactionData = array();
                            $transactionData['user_id'] = $order->user_id;
                            $transactionData['order_id'] = $order->id;
                            $transactionData['type'] = Transaction::$typeStripe;
                            $transactionData['txn_id'] = $txn_id;
                            $transactionData['payu_txn_id'] = "";
                            $transactionData['amount'] = $order->total;
                            $transactionData['status'] = Transaction::$statusSuccess;
                            $transactionData['message'] = 'txn_order_payment';
                            $transactionData['transaction_date'] = date('Y-m-d H:i:s');
                            $transaction = Transaction::create($transactionData);
                        } else {
                            $transaction->status = Transaction::$statusSuccess;
                            $transaction->save();
                        }

                        if($transaction){
                            if ($order->order_type == 'selfpickup') {
                                $order->active_status = OrderStatusList::$selfPickupPending;
                            } else {
                                $order->active_status = OrderStatusList::$received;
                            }
                            $order->transaction_id = $transaction->id??0;

                            if (isset($order->wallet_balance) && $order->wallet_balance > 0) {
                                $user = User::find($order->user_id);
                                if ($user) {
                                    $user_wallet_balance = $user->balance;
                                    $new_balance = $user_wallet_balance < $order->wallet_balance ? 0 : $user_wallet_balance - $order->wallet_balance;
                                    CommonHelper::updateUserWalletBalance($new_balance, $user->id);
                                    CommonHelper::addWalletTransaction($order->id, 0, $user->id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, Transaction::$paymentTypeStripe);
                                }
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
                        }
                    }
                }
            } else {
                Log::info("Stripe Webhook Order id not found : ",[$event]);
            }
            $response['error'] = false;
            $response['transaction_status'] = $event->type;
            $response['message'] = "Transaction successfully done";
            echo json_encode($response);
            return false;
            exit();

        }elseif ($event->type == 'charge.failed'){
            $order = Order::where('id',$order_id)->update(['active_status'=>OrderStatusList::$cancelled]);

            $response['error'] = true;
            $response['transaction_status'] = $event->type;
            $response['message'] = "Transaction is failed. ";
            Log::info('Stripe Webhook | Transaction is failed --> ',[$event]);
            echo json_encode($response);
            return false;
            exit();

        }elseif($event->type == 'charge.pending'){
            $response['error'] = false;
            $response['transaction_status'] = $event->type;
            $response['message'] = "Waiting customer to finish transaction ";
            Log::info('Stripe Webhook | Waiting customer to finish transaction --> ',[$event]);
            echo json_encode($response);
            return false;
            exit();
        }elseif($event->type == 'charge.expired'){
            if (!empty($order_id)) {
               Order::where('id',$order_id)->update(['active_status'=>OrderStatusList::$cancelled]);
            }

            $response['error'] = true;
            $response['transaction_status'] = $event->type;
            $response['message'] = "Transaction is expired.";
            Log::info( 'Stripe Webhook | Transaction is expired --> ',[$event]);
            echo json_encode($response);
            return false;
            exit();

        }elseif ($event->type == 'charge.refunded'){
            if (!empty($order_id)) {
                Order::where('id',$order_id)->update(['active_status'=>OrderStatusList::$cancelled]);
            }

            $response['error'] = true;
            $response['transaction_status'] = $event->type;
            $response['message'] = "Transaction is refunded.";
            Log::info('Stripe Webhook | Transaction is refunded --> ',[$event]);
            echo json_encode($response);
            return false;
            exit();
        } elseif (in_array($event->type, ['payment_intent.requires_action', 'payment_intent.succeeded', 'payment_intent.created', 'charge.updated'])) {
            // Informational events - no action needed
            Log::info('Stripe Webhook | Acknowledged event: ' . $event->type);
            $response['error'] = false;
            $response['transaction_status'] = $event->type;
            $response['message'] = "Event acknowledged.";
            echo json_encode($response);
            return false;
            exit();
        } else {
            $response['error'] = true;
            $response['transaction_status'] = $event->type;
            $response['message'] = "Transaction could not be detected.";
            Log::info('Stripe Webhook | Unhandled event type: ' . $event->type);
            echo json_encode($response);
            return false;
            exit();
        }

        http_response_code(200);
    }
}
