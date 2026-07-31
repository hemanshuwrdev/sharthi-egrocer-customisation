<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Helpers\ProductHelper;
use App\Helpers\Paypal;
use App\Helpers\PaypalClient;
use App\Helpers\Paystack;
use App\Helpers\Paytm;
use App\Helpers\TransactionHelper;
use App\Http\Controllers\Controller;
use App\Models\AppUsage;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\OrderStatusList;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\WalletTransaction;
use App\Models\User;
use App\Models\LiveTracking;
use App\Models\PromoCode;
use App\Models\Product;
use App\Models\Unit;
use App\Models\ReturnRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use App\Jobs\SendEmailJob;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\AdditionalCharge;
use App\Services\LanguageService;

class OrderApiController extends Controller
{
    public function placeOrder(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'total' => 'required',
                'delivery_charge' => 'required_if:order_type,doorstep',
                'delivery_time' => 'required_if:order_type,doorstep',
                'final_total' => 'required',
                'payment_method' => 'required',
                'address_id' => 'required_if:order_type,doorstep',
                'quantity' => 'required',
                'order_note' => 'nullable|string|max:256',
                'order_type' => 'required|in:doorstep,selfpickup'
            ], [
                'required' => 'The :attribute field is required.',
                'order_note.max' => 'Order note cannot exceed 256 characters.',
                'address_id.required_if' => 'Address is required for doorstep delivery.',
                'order_type.in' => 'Order type must be either doorstep or selfpickup.',
            ]);

            if ($validator->fails()) {
                return CommonHelper::responseError($validator->errors()->first());
            }

            $user = auth()->user();
            $updatedVariants = [];
            if (!isset($user->status) || $user->status == 0) {
                return CommonHelper::responseError(__('not_allowed_to_place_order_as_your_account_is_de_activated'));
            }

            $order_type = $request->order_type ?? 'doorstep';
            $one_seller_cart = Setting::where('variable', 'one_seller_cart')->exists() ? (int) Setting::where('variable', 'one_seller_cart')->value('value') : 0;

            // For self pickup orders, one seller cart must be enabled
            if ($order_type == 'selfpickup' && $one_seller_cart != 1) {
                return CommonHelper::responseError(__('self_pickup_orders_require_one_seller_cart_to_be_enabled'));
            }

            $cartItems = Cart::select('carts.*', 'products.seller_id', 'products.name as product_name', 'sellers.name as seller_name', 'sellers.status as seller_status', 'sellers.self_pickup_mode', 'sellers.pickup_store_address', 'sellers.pickup_latitude', 'sellers.pickup_longitude', 'sellers.pickup_store_timings', 'sellers.mobile')
                ->join('products', 'carts.product_id', '=', 'products.id')
                ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
                ->where('carts.save_for_later', '=', 0)
                ->where('user_id', '=', $user->id)
                ->get();

            if ($cartItems->isEmpty()) {
                return CommonHelper::responseError(__('cart_is_empty'));
            }

            if ($order_type == 'selfpickup') {
                $validSellers = $cartItems->filter(function ($item) {
                    return $item->seller_id && $item->seller_status == 1;
                });

                if ($validSellers->isEmpty()) {
                    return CommonHelper::responseError(__('no_valid_sellers_for_self_pickup'));
                }
            }

            if ($one_seller_cart == 1 && !$cartItems->isEmpty()) {
                $firstSeller = $cartItems->first()->seller_id;
                $allSameSeller = $cartItems->every(function ($item) use ($firstSeller) {
                    return $item->seller_id === $firstSeller;
                });

                if (!$allSameSeller) {
                    $data['one_seller_error_code'] = 1;
                    return CommonHelper::responseErrorWithData(__('all_cart_products_have_not_same_seller'), $data);
                }

                if ($order_type == 'selfpickup') {
                    $seller = $cartItems->first();
                    if (!$seller || !$seller->seller_id) {
                        return CommonHelper::responseError(__('invalid_seller_for_self_pickup'));
                    }
                    if ($seller->self_pickup_mode != 1) {
                        return CommonHelper::responseError(__('seller_does_not_support_self_pickup'));
                    }
                    if (empty($seller->pickup_store_address)) {
                        return CommonHelper::responseError(__('seller_pickup_address_not_configured'));
                    }
                }
            }
            $deactivatedSellers = $cartItems->filter(function ($item) {
                return $item->seller_status != 1;
            });
            if ($deactivatedSellers->isNotEmpty()) {
                foreach ($deactivatedSellers as $item) {

                    $message =  "is_from_disabled_seller";
                    return CommonHelper::responseErrorWithData($message, $item->product_name);
                }
            }

            $address_id = ($order_type == 'doorstep') ? ($request->address_id ?? 0) : 0;
            $address = '';
            $mobile = '';
            $latitude = '';
            $longitude = '';
            $pincode_id = 0;
            $area_id = 0;
            $pickup_address = '';

            if ($order_type == 'doorstep') {
                $user_address = CommonHelper::getUserAddress($request->address_id);
                if (!empty($user_address)) {
                    // Only append "/alternate_mobile" when alternate_mobile is set, to avoid trailing "/"
                    $mobilePart = $user_address->mobile;
                    if (!empty($user_address->alternate_mobile)) {
                        $mobilePart .= '/' . $user_address->alternate_mobile;
                    }
                    $address = $user_address->address . ' ' . $user_address->landmark . ' ' . $user_address->area . ' ' . $user_address->city . ' ' . $user_address->state . ' ' . $user_address->country . '-' . $user_address->pincode . ' ' . $user_address->name . ' ' . $mobilePart;
                    $mobile = $user_address->mobile;
                    $latitude = $user_address->latitude;
                    $longitude = $user_address->longitude;
                    $pincode_id = $user_address->pincode_id;
                    $area_id = $user_address->area_id ?? 0;
                } else {
                    return CommonHelper::responseError(__('something_is_missing_in_your_address'));
                }
            } else if ($order_type == 'selfpickup') {
                $mobile = $user->mobile;
                $seller = $cartItems->first();
                if ($seller && $seller->pickup_store_address) {
                    $pickup_timings = json_decode($seller->pickup_store_timings, true);
                    $opening_time = $pickup_timings['opening_time'] ?? '';
                    $closing_time = $pickup_timings['closing_time'] ?? '';

                    $pickup_address = json_encode([
                        'pickup_latitude' => $seller->pickup_latitude,
                        'pickup_longitude' => $seller->pickup_longitude,
                        'pickup_store_address' => $seller->pickup_store_address,
                        'opening_time' => $opening_time,
                        'closing_time' => $closing_time,
                        'seller_mobile' => $seller->mobile
                    ]);
                } else {
                    return CommonHelper::responseError(__('seller_pickup_address_not_available'));
                }
            }

            $user_id = auth()->user()->id;
            $order_note = (isset($request->order_note) && !empty($request->order_note)) ? $request->order_note : "";
            $wallet_used = (isset($request->wallet_used) && !empty($request->wallet_used) == 'true') ? 'true' : 'false';
            $items = $request->product_variant_id;

            $total = floatval($request->total);
            $delivery_charge = ($order_type == 'selfpickup') ? 0 : floatval($request->delivery_charge);
            $final_total = floatval($request->final_total);

            $applicableType = ($order_type == 'selfpickup') ? 'self_pickup' : 'order';
            $chargesFromDb = AdditionalCharge::withTranslation()
                ->where('is_active', true)
                ->whereJsonContains('applicable_on', $applicableType)
                ->orderBy('sort_order')
                ->get();

            $additional_charges = [];
            $additional_charges_total = 0;
            $baseAmount = $total;
            foreach ($chargesFromDb as $charge) {
                if ($charge->charge_type === 'percentage') {
                    $amount = round($baseAmount * floatval($charge->amount) / 100, 2);
                } else {
                    $amount = floatval($charge->amount);
                }
                $additional_charges_total += $amount;
                $additional_charges[] = [
                    'title' => (string) $charge->translated('title'),
                    'amount' => (string) $amount,
                    'is_refundable' => $charge->is_refundable,
                ];
            }

            $promo_code = "";
            $promo_discount = 0;
            $promo_code_id = 0;

            if (isset($request->promocode_id) && $request->promocode_id && $request->promocode_id != "") {

                $code = PromoCode::find($request->promocode_id);

                if (empty($code)) {
                    return CommonHelper::responseError("Promo code not found!");
                }
                $promo = CommonHelper::validatePromoCode($user_id, $code->promo_code, $total);

                if ($promo['is_applicable'] == 0) {
                    return CommonHelper::responseError($promo['message']);
                }

                if (isset($promo['promo_code_id']) && $request->promocode_id == $promo['promo_code_id']) {
                    $promo_discount = $promo['discount'];
                    $promo_code = $promo['promo_code'] . "(" . $promo['discount'] . ")";
                    $promo_code_id = $promo['promo_code_id'];
                }
            }

            $wallet_balance = (isset($request->wallet_balance) && is_numeric($request->wallet_balance)) ? $request->wallet_balance : 0;
            $formatted_wallet_balance = number_format($wallet_balance, 2);
            $payment_method = $request->payment_method;
            $delivery_time = (isset($request->delivery_time)) ? $request->delivery_time : "";

            if ($order_type == 'selfpickup') {
                $active_status = $payment_method == Transaction::$paymentTypeCod ? OrderStatusList::$selfPickupPending : OrderStatusList::$paymentPending;
                if ($payment_method == 'Wallet') {
                    $active_status = OrderStatusList::$selfPickupPending;
                }
            } else {
                $active_status = $payment_method == Transaction::$paymentTypeCod ? OrderStatusList::$received : OrderStatusList::$paymentPending;
                if ($payment_method == 'Wallet') {
                    $active_status = OrderStatusList::$received;
                }
            }
            $order_from = (isset($request->order_from) && !empty($request->order_from)) ? $request->order_from : 0;

            $status[] = array($active_status, date("d-m-Y h:i:sa"));

            $quantity = $request->quantity;

            $quantity_arr = explode(",", $quantity);
            $item_arr = explode(",", $items);


            foreach ($item_arr as $key => $item) {
                $variant = ProductVariant::where("id", $item)->first();

                // Check if the variant exists
                if (empty($variant)) {
                    return CommonHelper::responseError(__('found_one_or_more_items_in_order_is_not_available_for_order'));
                }

                // Ensure the requested quantity is correctly retrieved
                $requested_qty = $quantity_arr[$key] ?? 1; // Default to 1 if missing

                // Check stock availability
                if (!ProductHelper::isItemAvailableWithStock(null, $item, $requested_qty)) {
                    return CommonHelper::responseError(__("Low stock: Only {$variant->stock} available for {$variant->product->name}"));
                }
            }

            $item_details = CommonHelper::getProductByVariantId($item_arr);

            $totalTax = CommonHelper::calculateOrderTotalTax($item_details, $quantity_arr);
            $order_total_tax_amt = $totalTax['order_total_tax_amt'];
            $order_total_tax_per = $totalTax['order_total_tax_per'];

            $otp_number = mt_rand(100000, 999999);

            /* check for wallet balance */
            if ($wallet_used == 'true') {
                $user_wallet_balance = auth()->user()->balance;
                if ($user_wallet_balance < $wallet_balance) {
                    return CommonHelper::responseError('insufficient_wallet_balance');
                }
            }

            /* check for minimum order amount */
            $min_order_amount = Setting::get_value("min_order_amount");
            if ($wallet_used == 'true') {
                $user_wallet_balance = auth()->user()->balance;
                if ($user_wallet_balance + $final_total < $min_order_amount) {
                    return CommonHelper::responseError("Minimum order amount is " . $min_order_amount . ".");
                }
            } else {
                if ($final_total < $min_order_amount) {
                    return CommonHelper::responseError("Minimum order amount is " . $min_order_amount . ".");
                }
            }

            $walletvalue = ($wallet_used) ? $wallet_balance : 0;
            $order_status = json_encode($status);


            if ($order_type == 'doorstep') {
                $seller_ids = array_values(array_unique(array_column($item_details->toArray(), "seller_id")));
                if (!CommonHelper::isDeliverableOrder($address_id, $latitude, $longitude, $seller_ids[0]) && !isDemoMode()) {
                    return CommonHelper::responseError(__('sorry_we_are_not_delivering_on_selected_address'));
                }
            }

            /* check for subscription */
            $subscription_id = null;
            $delivery_save_amount = 0;

            if ($order_type == 'doorstep' && $delivery_charge == 0) {
                $userSubscription = CommonHelper::getUserActiveSubscription($user_id);

                if ($userSubscription) {
                    $seller_ids = array_values(array_unique(array_column($item_details->toArray(), "seller_id")));

                    $originalDeliveryData = CommonHelper::getAllDeliveryCharge($latitude, $longitude, $seller_ids, $total);

                    if ($originalDeliveryData['status'] == 1 && isset($originalDeliveryData['data']['total_delivery_charge'])) {
                        $original_delivery_charge = $originalDeliveryData['data']['total_delivery_charge'];

                        $shouldApplySubscription = false;

                        if ($userSubscription->free_delivery_above === null) {
                            $shouldApplySubscription = true;
                        } else {
                            $total_with_original_delivery = $total + $original_delivery_charge;

                            if ($total_with_original_delivery >= $userSubscription->free_delivery_above) {
                                $shouldApplySubscription = true;
                            }
                        }

                        if ($shouldApplySubscription) {
                            $subscription_id = $userSubscription->id;
                            $delivery_save_amount = $original_delivery_charge;
                        }
                    }
                }
            }

            /* insert data into order table */
            $orders_id = CommonHelper::generateOrderId();

            DB::beginTransaction();
            try {

                $order = new Order();
                $order->user_id = $user_id;
                $order->delivery_boy_id = 0;
                $order->transaction_id = 0;
                $order->orders_id = $orders_id;
                $order->otp = $otp_number;
                $order->mobile = $mobile;
                $order->order_note = $order_note;
                $order->total = $total;
                $order->remaining_total = $total;
                $order->delivery_charge = $delivery_charge;
                $order->subscription_id = $subscription_id;
                $order->delivery_save_amount = $delivery_save_amount;
                $order->tax_amount = $order_total_tax_amt;
                $order->tax_percentage = $order_total_tax_per;
                $order->wallet_balance = $walletvalue;
                $order->promo_code_id = $promo_code_id;
                $order->promo_code = $promo_code;
                $order->promo_discount = $promo_discount;
                $order->final_total = $final_total;
                $order->remaining_final = $final_total;
                $order->payment_method = $payment_method;
                $order->address = $address;
                $order->latitude = $latitude;
                $order->longitude = $longitude;
                $order->delivery_time = $delivery_time;
                $orderSellerId = !empty($seller_ids) ? $seller_ids[0] : (array_values(array_unique(array_column($item_details->toArray(), 'seller_id')))[0] ?? null);
                $order->delivery_date = CommonHelper::computeDeliveryDate(null, $orderSellerId);
                $order->status = $order_status;
                $order->active_status = $active_status;
                $order->order_from = $order_from;
                $order->pincode_id = $pincode_id;
                $order->area_id = $area_id;
                $order->address_id = $address_id;
                $order->order_type = $order_type;
                $order->pickup_address = $pickup_address;
                $order->additional_charges = json_encode($additional_charges);
                $order->save();

                $order_id = $order->id;
                if ($order_id == "") {
                    return CommonHelper::responseError(__('order_can_not_place_due_to_some_reason_try_again_after_some_time'));
                }
                /* process wallet balance */
                $user_wallet_balance = $user->balance;
                /* process each product in order from variants of products */
                foreach ($item_details as $key => $item) {
                    $product_id = $item->product_id;
                    $product_name = $item->product_name;
                    $measurement = $item->measurement;
                    $variant_name = $measurement . ' ' . $item->stock_unit_name;
                    $product_variant_id = $item->id;
                    $stock_unit_id = $item->stock_unit_id;
                    $price = $item->price;
                    $discounted_price = (empty($item->discounted_price) || $item->discounted_price == "") ? 0 : $item->discounted_price;
                    $is_unlimited_stock = $item->is_unlimited_stock;
                    $type = $item->product_type;

                    $total_stock = $item->stock;
                    $quantity = $quantity_arr[$key];
                    $tax_title = $item->tax_title;
                    $seller_id = (!empty($item->seller_id)) ? $item->seller_id : "";
                    $tax_percentage = (empty($item->tax_percentage) || $item->tax_percentage == "") ? 0 : $item->tax_percentage;

                    $matchedSlab = CommonHelper::getMatchingSlab($product_variant_id, $quantity);
                    if ($matchedSlab) {
                        $effective_unit_price = (float) $matchedSlab->price;
                    } elseif ($discounted_price != 0) {
                        $effective_unit_price = (float) $discounted_price;
                    } else {
                        $effective_unit_price = (float) $price;
                    }
                    $tax_amt = ($tax_percentage / 100) * $effective_unit_price;
                    $sub_total = ($effective_unit_price + ($tax_percentage / 100) * $effective_unit_price) * $quantity;

                    $neworder_id = $order_id;
                    $tax_amount = $tax_amt;
                    $order_sub_total = $sub_total;
                    $order_item_status = json_encode($status);

                    $order_item = new OrderItem();
                    $order_item->user_id = $user_id;
                    $order_item->order_id = $neworder_id;

                    $order_item->orders_id = $orders_id;

                    $order_item->product_name = $product_name;
                    $order_item->variant_name = $variant_name;
                    $order_item->product_variant_id = $product_variant_id;
                    $order_item->quantity = $quantity;

                    $order_item->price = $price;
                    $order_item->discounted_price = $discounted_price;
                    if ($matchedSlab) {
                        $order_item->slab_unit_price = $effective_unit_price;
                        $order_item->slab_min_qty = (int) $matchedSlab->min_qty;
                        $order_item->slab_max_qty = $matchedSlab->max_qty !== null ? (int) $matchedSlab->max_qty : null;
                    }

                    $order_item->tax_amount = $tax_amount;
                    $order_item->tax_percentage = $tax_percentage;
                    $order_item->sub_total = $order_sub_total;
                    $order_item->status = $order_item_status;
                    $order_item->active_status = $active_status;
                    $order_item->seller_id = $seller_id;
                    $order_item->save();

                    /* here $is_unlimited_stock  0 = Limited and 1 = Unlimited */
                    if ($is_unlimited_stock != 1) {
                        $product_variant = ProductVariant::where("id", $product_variant_id)->first();
                        if ($type == 'packet') {
                            $stock = $total_stock - $quantity;
                            $product_variant->stock = $stock;
                            $product_variant->save();

                            $updatedVariants[] = $product_variant;

                            if ($product_variant->stock <= 0) {
                                $product_variant->status = 0; // here status 0 => "Sold Out" & 1 => "Available"
                                $product_variant->save();
                            }
                        } elseif ($type == 'loose') {
                            $stock = max(0, $total_stock - ($measurement * $quantity));
                            // Update main product variant stock
                            $product_variant->stock = $stock;
                            if ($stock <= 0) {
                                $product_variant->status = 0; // 0 => "Sold Out"
                            }
                            $product_variant->save();

                            $updatedVariants[] = $product_variant;
                            ProductVariant::where("product_id", $product_id)
                                ->where("stock_unit_id", $stock_unit_id) // Only same unit type
                                ->where("id", '!=', $product_variant_id) // Exclude current variant
                                ->update([
                                    'stock' => $stock,
                                    'status' => $stock <= 0 ? 0 : 1 // 0 => "Sold Out", 1 => "Available"
                                ]);
                        }
                    }
                }

                if ($wallet_used == 'true' && ($payment_method == Transaction::$paymentTypeCod || $payment_method == Transaction::$paymentTypeWallet)) {
                    /* deduct the balance & set the wallet transaction only for COD/Wallet payments.
                       For online payments, wallet is deducted after payment confirmation in addTransaction or webhppk */
                    $new_balance = $user_wallet_balance < $wallet_balance ? 0 : $user_wallet_balance - $wallet_balance;
                    CommonHelper::updateUserWalletBalance($new_balance, $user_id);
                    CommonHelper::addWalletTransaction($order_id, 0, $user_id, 'debit', $wallet_balance, 'wallet_used_against_order_placement', 1, $payment_method);
                }

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
                return CommonHelper::responseError(__('could_not_place_order_try_again'));
            }
            if (!empty($order) && $payment_method == Transaction::$paymentTypeCod || $payment_method == Transaction::$paymentTypeWallet) {
                try {
                    dispatch(function () use ($order) {
                        //push notification 
                        CommonHelper::sendNotificationOrderStatus($order);
                        // Send notifications to super admin (role_id=1) and sellers (role_id=3) whose items are in the order
                        CommonHelper::sendOrderNotificationsToAdmins($order, 'new_order', $order->delivery_boy_id ?? null);
                    })->afterResponse();
                } catch (\Exception $e) {
                    Log::error("Place orderNotification error :", [$e->getMessage()]);
                }
                try {

                    Log::info("Place order send mail :", [$order]);
                    dispatch(new SendEmailJob($order))->afterResponse();
                } catch (\Exception $e) {
                    Log::error("Place order Send mail error :", [$e->getMessage()]);
                }

                //Place Order Send SMS
                try {
                    CommonHelper::sendSmsOrderStatus($order, $order->active_status);
                } catch (\Exception $e) {
                    Log::error("Place order SMS error :", [$e->getMessage()]);
                }
            }

            try {
                CommonHelper::sendLowStockNotification($updatedVariants);
            } catch (\Exception $e) {
                Log::channel('low_stock_mail')->info("Low stock notification error: " . $e->getMessage());
            }

            if ($payment_method == Transaction::$paymentTypeCod || $payment_method == Transaction::$paymentTypeWallet) {
                $order_status = array();
                $order_status['order_id'] = $order->id;
                $order_status['order_item_id'] = 0;
                $order_status['status'] = ($order_type == 'selfpickup') ? OrderStatusList::$selfPickupPending : OrderStatusList::$received;
                $order_status['created_by'] = $user_id;
                $order_status['user_type'] = OrderStatus::$userTypeUser;
                CommonHelper::setOrderStatus($order_status);
                return CommonHelper::responseSuccess(__('order_placed_successfully'));
            } else {
                return CommonHelper::responseWithData(['order_id' => $order->id]);
            }
        } catch (\Exception $e) {
            Log::error("Place order error :", [$e->getMessage()]);
            return CommonHelper::responseError(__('could_not_place_order_try_again'));
        }
    }

    public function deletePaymentPendingOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required'
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $order = Order::find($request->order_id);
        $user = auth()->user();
        $user_wallet_balance = $user->balance;

        if (empty($order)) {
            return CommonHelper::responseError("Order Not found!");
        }

        if ($order->active_status != OrderStatusList::$paymentPending) {
            $statusName = OrderStatusList::where('id', $order->active_status)->value('status');
            return CommonHelper::responseError("Now you order status is " . $statusName);
        }

        DB::beginTransaction();
        try {
            // Retrieve the order items before deletion
            $orderItems = OrderItem::where('order_id', $request->order_id)->get();

            // Delete the order items
            OrderItem::where('order_id', $request->order_id)->delete();

            // Loop through each order item and update the stock of the corresponding product variant
            foreach ($orderItems as $item) {
                $productVariant = ProductVariant::find($item->product_variant_id);

                if ($productVariant) {
                    // Assuming you are adding the quantity back to stock
                    $productVariant->stock += $item->quantity;
                    $productVariant->status = 1;
                    $productVariant->save();
                }
            }
            $order->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::info("Error : " . $e->getMessage());
            throw $e;
            return CommonHelper::responseError(__('something_went_wrong'));
        }
        return CommonHelper::responseSuccess(__('order_deleted_successfully'));
    }

    public function initiateTransaction(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required',
            'type' => 'required',
            'order_id' => 'required_if:type,order',
            'wallet_amount' => 'required_if:type,wallet',
            'subscription_plan_id' => 'required_if:type,subscription',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        if ($request->type == 'order') {
            $order = Order::with('user')->where('id', $request->order_id)
                ->first();
            if (!$order) {
                return CommonHelper::responseError("Order not found!");
            }
        }
        if ($request->type == 'subscription') {
            // Check if user already has an active subscription
            $user = auth()->user();
            if ($user) {
                $activeSubscription = CommonHelper::getUserActiveSubscription($user->id);
                if ($activeSubscription) {
                    return CommonHelper::responseError("You already have an active subscription. Please wait for it to expire before purchasing a new one.");
                }
            }

            $subscriptionPlan = SubscriptionPlan::where('id', $request->subscription_plan_id)
                ->where('status', 1)
                ->first();
            if (!$subscriptionPlan) {
                return CommonHelper::responseError("Subscription plan not found or inactive!");
            }
        }

        // Calculate subscription amount if type is subscription
        $subscription_amount = 0;
        if ($request->type == 'subscription') {
            // Get amount from subscription plan (discounted_price if available, else price)
            $subscription_amount = $subscriptionPlan->discounted_price ?? $subscriptionPlan->price;
        }

        $out['payment_method'] = $request->payment_method;

        $transaction_id = "";

        //Wallet payment for subscription
        // Wallet payment for subscription: check balance, deduct and create transaction + subscription (no redirect)
        if ($request->type == 'subscription' && ($request->payment_method == 'Wallet' || $request->payment_method == Transaction::$paymentTypeWallet)) {
            $user = auth()->user();
            $user_balance = (float) ($user->balance ?? 0);
            $subscription_amount = (float) $subscription_amount;

            if ($user_balance < $subscription_amount) {
                return CommonHelper::responseError('insufficient_wallet_balance');
            }

            // Deduct from wallet
            $new_balance = $user_balance - $subscription_amount;
            CommonHelper::updateUserWalletBalance($new_balance, $user->id);
            CommonHelper::addWalletTransaction(0, 0, $user->id, 'debit', $subscription_amount, 'wallet_used_for_subscription');

            $txn_id = 'wallet-sub-' . $user->id . '-' . time();
            $transactionData = [
                'user_id' => $user->id,
                'order_id' => 0,
                'type' => Transaction::$typeWallet,
                'txn_id' => $txn_id,
                'payu_txn_id' => '',
                'amount' => $subscription_amount,
                'status' => Transaction::$statusSuccess,
                'message' => 'txn_subscription_payment_via_wallet',
                'transaction_date' => date('Y-m-d H:i:s'),
            ];
            Transaction::create($transactionData);

            // Create user subscription (same as addTransaction)
            $startDate = now()->toDateString();
            $endDate = now()->addDays($subscriptionPlan->days - 1)->toDateString();
            UserSubscription::create([
                'user_id' => $user->id,
                'plan_id' => $subscriptionPlan->id,
                'plan_name' => $subscriptionPlan->name,
                'price_paid' => $subscription_amount,
                'discounted_price' => $subscriptionPlan->discounted_price,
                'free_delivery_above' => $subscriptionPlan->free_delivery_above,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active'
            ]);

            return CommonHelper::responseSuccess('subscription_activated_successfully');
        }
        //end of Wallet payment for subscription
        if ($request->payment_method == "Razorpay") {

            Log::error("payment_method = " . $request->payment_method);

            $transaction_id = TransactionHelper::createOrderonRazorpay($request->type, $request->order_id ?? 0, $request->wallet_amount ?? 0, $subscription_amount);
            if ($transaction_id == "") {
                return CommonHelper::responseError("Error while communicating with razorpay server");
            }
        } else if ($request->payment_method == "Paypal") {

            $user_id = auth()->user()->id;
            if ($request->type == 'order') {
                $order_id = $request->order_id;
                $order = Order::where('id', $order_id)->first();

                if (!empty($order)) {
                    if ($request->request_from == 'website') {
                        $out['paypal_redirect_url'] = url('customer/paypal_payment_url?user_id=' . $user_id . '&order_id=' . $order_id . '&type=order&request_from=website');
                    } else {
                        $out['paypal_redirect_url'] = url('customer/paypal_payment_url?user_id=' . $user_id . '&order_id=' . $order_id . '&type=order');
                    }
                }
            } elseif ($request->type == 'wallet') {
                if ($request->request_from == 'website') {
                    $out['paypal_redirect_url'] = url('customer/paypal_payment_url?user_id=' . $user_id . '&wallet_amount=' . $request->wallet_amount . '&type=wallet&request_from=website');
                } else {
                    $out['paypal_redirect_url'] = url('customer/paypal_payment_url?user_id=' . $user_id . '&wallet_amount=' . $request->wallet_amount . '&type=wallet');
                }
            } elseif ($request->type == 'subscription') {
                if ($request->request_from == 'website') {
                    $out['paypal_redirect_url'] = url('customer/paypal_payment_url?user_id=' . $user_id . '&subscription_plan_id=' . $request->subscription_plan_id . '&subscription_amount=' . $subscription_amount . '&type=subscription&request_from=website');
                } else {
                    $out['paypal_redirect_url'] = url('customer/paypal_payment_url?user_id=' . $user_id . '&subscription_plan_id=' . $request->subscription_plan_id . '&subscription_amount=' . $subscription_amount . '&type=subscription');
                }
            }
        } else if ($request->payment_method == "Stripe") {

            Log::error("payment_method = " . $request->payment_method);

            if ($request->type == 'order') {
                $order_id = $request->order_id;
                $order = Order::where('id', $order_id)->first();

                if (!empty($order)) {
                    $response = TransactionHelper::createOrderOnStripe($order->final_total, 'order', $order->id);
                }
            } elseif ($request->type == 'wallet') {
                $response = TransactionHelper::createOrderOnStripe($request->wallet_amount, 'wallet');
            } elseif ($request->type == 'subscription') {
                $response = TransactionHelper::createOrderOnStripe($subscription_amount, 'subscription', 0, $request->subscription_plan_id);
            }

            if ($response == "") {
                return CommonHelper::responseError("Error while communicating with Stripe server");
            }
            $out = $response->toArray();
        } else  if ($request->payment_method == "Midtrans") {
            $midtrans_redirect_url = TransactionHelper::createOrderonMidtrans($request->type, $request->order_id ?? 0, $request->wallet_amount ?? 0, $subscription_amount, $request->subscription_plan_id ?? 0);
            if ($midtrans_redirect_url == "") {
                return CommonHelper::responseError("Error while communicating with Midtrans server");
            }

            // Return the URL for redirection
            return CommonHelper::responseWithData($midtrans_redirect_url);
        } else  if ($request->payment_method == "Phonepe") {
            $phonepay_data = TransactionHelper::createOrderonPhonepe($request->type, $request->order_id ?? 0, $request->wallet_amount ?? 0, $subscription_amount, $request->subscription_plan_id ?? 0);
            if ($phonepay_data == "") {
                return CommonHelper::responseError("Error while communicating with Phonepe server");
            }
            // Return the URL for redirection
            return $phonepay_data;
        } else  if ($request->payment_method == "Cashfree") {
            $cashfree_redirect_url = TransactionHelper::createOrderonCashfree($request->type, $request->order_id ?? 0, $request->wallet_amount ?? 0, $subscription_amount, $request->subscription_plan_id ?? 0);
            if ($cashfree_redirect_url == "") {
                return CommonHelper::responseError("Error while communicating with Cashfree server");
            }
            // Return the URL for redirection
            return CommonHelper::responseWithData($cashfree_redirect_url);
        } else  if ($request->payment_method == "Paytabs") {
            $paytabs_redirect_url = TransactionHelper::createOrderonPaytabs($request->type, $request->order_id ?? 0, $request->wallet_amount ?? 0, $subscription_amount, $request->subscription_plan_id ?? 0);

            if ($paytabs_redirect_url == "") {
                return CommonHelper::responseError("Error while communicating with Paytabs server");
            }
            // Return the URL for redirection
            return CommonHelper::responseWithData($paytabs_redirect_url);
        } else {
            return CommonHelper::responseError("Invalid payment methods.");
        }
        if ($request->type == 'order') {
            $order->payment_method = $request->payment_method;
            $order->save();
        }

        // Store subscription plan info in output for reference
        if ($request->type == 'subscription') {
            $out['subscription_plan_id'] = $request->subscription_plan_id;
            $out['subscription_amount'] = $subscription_amount;
        }

        if ($transaction_id != "") {
            $out['transaction_id'] = $transaction_id;
        }
        return CommonHelper::responseWithData($out);
    }

    /*Paypal Start*/
    public function paypalPaymentUrl(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'type' => 'required',
            'order_id' => 'required_if:type,order',
            'wallet_amount' => 'required_if:type,wallet',
            'subscription_plan_id' => 'required_if:type,subscription',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $app_name = Setting::get_value('app_name');
        $user = User::where('id', $request->user_id)->first();
        if ($request->type == 'order') {
            $order = Order::where('id', $request->order_id)->first();
            $order_amount = $order->final_total;
            $order_id = $order->id;
        } elseif ($request->type == 'wallet') {
            $order_amount = $request->wallet_amount;
            $order_id = 'wallet_recharge-' . $user->id;
        } elseif ($request->type == 'subscription') {
            $subscriptionPlan = SubscriptionPlan::where('id', $request->subscription_plan_id)
                ->where('status', 1)
                ->first();
            if (!$subscriptionPlan) {
                return CommonHelper::responseError("Subscription plan not found!");
            }
            $order_amount = $subscriptionPlan->discounted_price ?? $subscriptionPlan->price;
            $order_id = 'subscription-' . $request->subscription_plan_id . '-' . $user->id;
        }

        if ($order_amount) {

            header("Content-Type: html");

            $data['user'] = $user;

            $data['payment_type'] = "paypal";

            $websiteUrl = Setting::where('variable', 'website_url')->value('value');
            $websiteUrl = trim($websiteUrl, '/');
            $returnURL = $request->request_from == 'website' ? url($websiteUrl . '/web-payment-status?amount=' . $order_amount . '&status=pending&type=wallet') : url('customer/paypal_redirect/pending');
            if ($request->type == 'order') {
                if ($request->request_from == 'website') {
                    $returnURL = url($websiteUrl . '/web-payment-status?amount=' . $order_amount . '&status=pending&type=order&order_id=' . $order_id);
                } else {
                    $returnURL = url('customer/paypal_redirect/pending');
                }
            } elseif ($request->type == 'wallet') {
                if ($request->request_from == 'website') {
                    $returnURL = url($websiteUrl . '/web-payment-status?amount=' . $order_amount . '&status=pending&type=wallet');
                } else {
                    $returnURL = url('customer/paypal_redirect/pending');
                }
            } elseif ($request->type == 'subscription') {
                if ($request->request_from == 'website') {
                    $returnURL = url($websiteUrl . '/web-payment-status?amount=' . $order_amount . '&status=pending&type=subscription&subscription_plan_id=' . $request->subscription_plan_id);
                } else {
                    $returnURL = url('customer/paypal_redirect/pending');
                }
            }
            $cancelURL = url('customer/paypal_redirect/fail');
            $pendingURL = url('customer/paypal_redirect/pending');
            $notifyURL = url('customer/ipn');
            $txn_id = time() . "-" . rand();
            // Get current user ID from the session
            $userID = $data['user']['id'];
            //$order_id = $order_id;
            $payeremail = $data['user']['email'];
            // $userID = $data['user']->id;

            $paypal = new Paypal();
            // Add fields to paypal form
            $paypal->add_field('return', $returnURL);
            $paypal->add_field('pending', $pendingURL);
            $paypal->add_field('cancel_return', $cancelURL);
            $paypal->add_field('notify_url', $notifyURL);
            $paypal->add_field('item_name', $app_name);
            $paypal->add_field('custom', $userID . '|' . $payeremail);
            $paypal->add_field('item_number', $order_id);
            $paypal->add_field('amount', $order_amount);

            // Render paypal form
            $paypal->paypal_auto_form();
        }
    }

    public function paypalRedirect(Request $request)
    {
        $paypalInfo = $request->all();
        $website_url = config('app.website_url');

        Log::info("paypalRedirect : ", [$paypalInfo]);
        $order_status = Transaction::$statusFailed;
        if (!empty($paypalInfo) && isset($paypalInfo['payment_status']) && strtolower($paypalInfo['payment_status']) == "completed") {
            $response['error'] = false;
            $response['message'] = "Payment Completed Successfully";
            $response['data'] = $paypalInfo;
            $order_status = Transaction::$statusSuccess;
        } elseif (!empty($paypalInfo) && isset($paypalInfo['payment_status']) && strtolower($paypalInfo['payment_status']) == "authorized") {
            $response['error'] = false;
            $response['message'] = "Your payment is has been Authorized successfully. We will capture your transaction within 30 minutes, once we process your order. After successful capture coins wil be credited automatically.";
            $response['data'] = $paypalInfo;
            $order_status = Transaction::$statusSuccess;
        } elseif (!empty($paypalInfo) && isset($paypalInfo['payment_status']) && strtolower($paypalInfo['payment_status']) == "pending") {
            $response['error'] = false;
            $response['message'] = "Your payment is pending and is under process. We will notify you once the status is updated.";
            $response['data'] = $paypalInfo;
        } else {
            $response['error'] = true;
            $response['message'] = "Payment Cancelled / Declined ";
            $response['data'] = (isset($paypalInfo)) ? $paypalInfo : "";
        }

        echo "<html>
        <body>
        Redirecting...!
        </body>
        <script>
            //const parentOrigin = window.opener.location.origin;
            const parentOrigin = '" . $website_url . "';
            console.log('Parent origin:', parentOrigin);
            console.log('started')
            window.addEventListener('load', function(){
            console.log('loaded')
            window.opener.postMessage('" . $order_status . "',parentOrigin);
            window.close();
            });
        </script>
        </html>";
    }

    public function ipn(Request $request)
    {
        $paypalInfo = $request->all();

        if (!empty($paypalInfo)) {
            // Validate and get the ipn response
            $paypal = new Paypal();
            $ipnCheck = $paypal->validate_ipn($paypalInfo);
            // Check whether the transaction is valid
            if ($ipnCheck) {

                $userData = explode('|', $paypalInfo['custom']);

                //for react app
                if (is_null($paypalInfo["item_number"]) && isset($userData[2])) {
                    $paypalInfo["item_number"] = $userData[2];
                }

                $order_id = $paypalInfo["item_number"];
                /* if its not numeric then it is for the wallet recharge */
                if (
                    $paypalInfo["payment_status"] == 'Completed' &&
                    !is_numeric($order_id) && strpos($order_id, "wallet_recharge") !== false
                ) {
                    $temp = explode("-", $order_id); /* Order ID format for wallet recharge >> wallet_recharge-{user_id}  */
                    if (isset($temp[1]) && is_numeric($temp[1]) && !empty($temp[1] && $temp[1] != '')) {
                        $user_id = $temp[1];
                    } else {
                        $user_id = 0;
                    }
                    $amount = $paypalInfo["mc_gross"];
                    /* IPN for user wallet recharge */

                    $data['payment_type'] = "Paypal";
                    $data['user_id'] = $user_id;
                    $data['order_id'] = $order_id;
                    $data['type'] = "credit";
                    $data['txn_id'] = $paypalInfo["txn_id"];
                    $data['payu_txn_id'] = "";
                    $data['amount'] = $amount;
                    $data['status'] = Transaction::$statusSuccess;
                    $data['message'] = "Wallet successfully recharged.";
                    $data['transaction_date'] = date('Y-m-d H:i:s');
                    $wallet_transaction = WalletTransaction::create($data);

                    if ($data['status'] == WalletTransaction::$statusSuccess) {
                        $newBalance = CommonHelper::addUserWalletBalance($amount, $user_id);
                        $data['user_balance'] = $newBalance;
                        return CommonHelper::responseSuccessWithData("Amount Added in Wallet Successfully", $data);
                    } else {
                        return CommonHelper::responseError("Transaction Failed, Please try again!");
                    }
                } elseif (
                    $paypalInfo["payment_status"] == 'Completed' &&
                    !is_numeric($order_id) && strpos($order_id, "subscription") !== false
                ) {
                    /* IPN for subscription payment */
                    $temp = explode("-", $order_id); /* Order ID format for subscription >> subscription-{plan_id}-{user_id}  */
                    $subscription_plan_id = isset($temp[1]) && is_numeric($temp[1]) ? $temp[1] : 0;
                    $user_id = isset($temp[2]) && is_numeric($temp[2]) ? $temp[2] : 0;

                    if ($subscription_plan_id > 0 && $user_id > 0) {
                        $subscriptionPlan = SubscriptionPlan::where('id', $subscription_plan_id)
                            ->where('status', 1)
                            ->first();

                        if ($subscriptionPlan) {
                            $subscription_amount = $subscriptionPlan->discounted_price ?? $subscriptionPlan->price;

                            // Create transaction record
                            $data['transaction_type'] = 'Transaction';
                            $data['user_id'] = $user_id;
                            $data['order_id'] = 0;
                            $data['type'] = 'paypal';
                            $data['txn_id'] = $paypalInfo["txn_id"];
                            $data['payu_txn_id'] = "";
                            $data['amount'] = $subscription_amount;
                            $data['status'] = Transaction::$statusSuccess;
                            $data['message'] = "Subscription payment";
                            $data['transaction_date'] = date('Y-m-d H:i:s');
                            $transaction = Transaction::create($data);

                            // Create user subscription
                            $startDate = now()->toDateString();
                            $endDate = now()->addDays($subscriptionPlan->days - 1)->toDateString();

                            $userSubscription = UserSubscription::create([
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

                            return CommonHelper::responseSuccessWithData("Subscription activated successfully", $userSubscription);
                        }
                    }
                } else {
                    /* IPN for normal Order  */
                    // Insert the transaction data in the database
                    $userData = explode('|', $paypalInfo['custom']);

                    $data['transaction_type'] = 'Transaction';
                    $data['user_id'] = $userData[0];
                    $data['order_id'] = $paypalInfo["item_number"];
                    $data['type'] = 'paypal';
                    $data['txn_id'] = $paypalInfo["txn_id"];
                    $data['payu_txn_id'] = "";
                    $data['amount'] = $paypalInfo["mc_gross"];
                    $data['status'] = Transaction::$statusSuccess;
                    $data['message'] = 'Payment Verified';
                    $data['transaction_date'] = date('Y-m-d H:i:s');

                    $order = Order::where('id', $data['order_id'])->first();
                    if ($paypalInfo["payment_status"] == 'Completed') {

                        $transaction = Transaction::create($data);
                        if ($order->order_type == 'selfpickup') {
                            $order->active_status = OrderStatusList::$selfPickupPending;
                        } else {
                            $order->active_status = OrderStatusList::$received;
                        }
                        $order->transaction_id = $transaction->id ?? 0;

                        if (isset($order->wallet_balance) && $order->wallet_balance > 0) {
                            $walletUser = User::find($order->user_id);
                            if ($walletUser) {
                                $user_wallet_balance = $walletUser->balance;
                                $new_balance = $user_wallet_balance < $order->wallet_balance ? 0 : $user_wallet_balance - $order->wallet_balance;
                                CommonHelper::updateUserWalletBalance($new_balance, $walletUser->id);
                                CommonHelper::addWalletTransaction($order->id, 0, $walletUser->id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, Transaction::$paymentTypePaypal);
                            }
                        }

                        $order->save();
                    } else if (
                        $paypalInfo["payment_status"] == 'Expired' || $paypalInfo["payment_status"] == 'Failed'
                        || $paypalInfo["payment_status"] == 'Refunded' || $paypalInfo["payment_status"] == 'Reversed'
                    ) {
                        /* if transaction wasn't completed successfully then cancel the order and transaction */
                        $data['transaction_type'] = 'Transaction';
                        $data['user_id'] = $userData[0];
                        $data['order_id'] = $paypalInfo["item_number"];
                        $data['type'] = 'paypal';
                        $data['txn_id'] = $paypalInfo["txn_id"];
                        $data['payu_txn_id'] = "";
                        $data['amount'] = $paypalInfo["mc_gross"];
                        $data['currency_code'] = $paypalInfo["mc_currency"];
                        $data['status'] = $paypalInfo["payment_status"];
                        $data['message'] = 'Payment could not be completed due to one or more reasons!';
                        $data['transaction_date'] = date('Y-m-d H:i:s');

                        $transaction = Transaction::create($data);
                        //Mark payment received
                        $order->active_status = OrderStatusList::$cancelled;
                        $order->transaction_id = $transaction->id ?? 0;
                        $order->save();
                    }
                }
            }
        }
    }
    /*Paypal End*/

    public function addTransaction(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required',
            'order_id' => 'required_if:type,order',
            'wallet_amount' => 'required_if:type,wallet',
            'subscription_plan_id' => 'required_if:type,subscription',
            'device_type' => 'required',
            'app_version' => 'required',
            'payment_method' => 'required',
            'transaction_id' => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }
        $user = auth()->user();
        if ($request->type == 'order') {
            $order = Order::withTrashed()->where('id', $request->order_id)->first();
            if (!$order) {
                return CommonHelper::responseError("Invalid Order Id");
            }
        }

        // Save Device details - Handle AppUsage for order, wallet, and subscription types
        if ($request->device_type) {
            $app_usage = array();
            $app_usage['device_type'] = $request->device_type;
            $app_usage['app_version'] = $request->app_version;

            if ($request->type == 'order') {
                $app_usage['order_id'] = $order->id ?? null;
            } elseif ($request->type == 'subscription') {
                $app_usage['order_id'] = 'subscription-' . ($request->subscription_plan_id ?? '');
            } else {
                $app_usage['order_id'] = 'wallet';
            }

            AppUsage::create($app_usage);
        }

        $status = Transaction::$statusFailed;

        $txn_id = $request->transaction_id;

        // Handle iOS In-App Purchase separately
        if ($request->payment_method == Transaction::$paymentTypeInAppPurchase) {
            // iOS In-App Purchase handling - only for subscription type
            if ($request->type != 'subscription') {
                return CommonHelper::responseError("In-App Purchase is only available for subscriptions");
            }

            // Get subscription plan
            $subscriptionPlan = SubscriptionPlan::where('id', $request->subscription_plan_id)
                ->where('status', 1)
                ->first();

            if (!$subscriptionPlan) {
                return CommonHelper::responseError("Subscription plan not found!");
            }

            // Create transaction and subscription (receipt verification removed for now)
            $subscription_amount = $subscriptionPlan->discounted_price ?? $subscriptionPlan->price;

            $transactionData = array();
            $transactionData['user_id'] = $user->id;
            $transactionData['order_id'] = 0;
            $transactionData['type'] = Transaction::$typeInAppPurchase;
            $transactionData['txn_id'] = $txn_id;
            $transactionData['payu_txn_id'] = "";
            $transactionData['amount'] = $subscription_amount;
            $transactionData['status'] = Transaction::$statusSuccess;
            $transactionData['message'] = 'txn_subscription_payment_ios_iap';
            $transactionData['transaction_date'] = date('Y-m-d H:i:s');

            $transaction = Transaction::create($transactionData);

            // Create user subscription
            $startDate = now()->toDateString();
            $endDate = now()->addDays($subscriptionPlan->days - 1)->toDateString();

            UserSubscription::create([
                'user_id' => $user->id,
                'plan_id' => $subscriptionPlan->id,
                'plan_name' => $subscriptionPlan->name,
                'price_paid' => $subscription_amount,
                'discounted_price' => $subscriptionPlan->discounted_price,
                'free_delivery_above' => $subscriptionPlan->free_delivery_above,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active'
            ]);

            return CommonHelper::responseSuccess('subscription_activated_successfully');
        }

        if (
            isset($request->payment_method) && in_array(
                $request->payment_method,
                array(
                    Transaction::$paymentTypeRazorpay,
                    Transaction::$paymentTypePaystack,
                    Transaction::$paymentTypeStripe,
                    Transaction::$paymentTypePaytm,
                    Transaction::$paymentTypeMidtrans
                )
            )
        ) {
            if ($request->payment_method == Transaction::$paymentTypeRazorpay) {
                $signatureIsVaid = TransactionHelper::verifyRazorpaySignature(
                    $request->razorpay_order_id,
                    $request->razorpay_payment_id,
                    $request->razorpay_signature
                );

                if (!$signatureIsVaid) {
                    $status = Transaction::$statusSuccess;
                }
            } else if ($request->payment_method == Transaction::$paymentTypePaystack) {

                $paystack = new Paystack();
                $payment = $paystack->verify_transaction($txn_id);

                if (!empty($payment)) {
                    $payment = json_decode($payment, true);
                    if (isset($payment['data']['status']) && $payment['data']['status'] == 'success') {
                        $status = Transaction::$statusSuccess;
                    }
                }
            } else if ($request->payment_method == Transaction::$paymentTypeStripe) {

                try {

                    $stripe_secret_key = Setting::get_value('stripe_secret_key');
                    $stripe = new \Stripe\StripeClient(
                        $stripe_secret_key
                    );

                    $paymentIntent = $stripe->paymentIntents->retrieve(
                        $txn_id,
                        []
                    );

                    $status = Transaction::$statusSuccess;
                } catch (\Exception $e) {
                    Log::error("Stripe Error : ", [$e]);
                    return CommonHelper::responseError($e->getMessage());
                }
            } else if ($request->payment_method == Transaction::$paymentTypePaytm) {

                $payment = Paytm::transaction_status($order->id);

                if (!empty($payment)) {
                    $payment = json_decode($payment, true);

                    if (isset($payment['body']['resultInfo']['resultCode']) && ($payment['body']['resultInfo']['resultCode'] == '01' && $payment['body']['resultInfo']['resultStatus'] == 'TXN_SUCCESS')) {
                        $status = Transaction::$statusSuccess;
                    } elseif (isset($payment['body']['resultInfo']['resultCode']) && ($payment['body']['resultInfo']['resultStatus'] == 'TXN_FAILURE')) {
                        $status = Transaction::$statusFailed;
                    } else if (isset($payment['body']['resultInfo']['resultCode']) && ($payment['body']['resultInfo']['resultStatus'] == 'PENDING')) {
                        //PENDING
                    } else {
                        $status = Transaction::$statusFailed;
                    }
                } else {
                    $status = Transaction::$statusFailed;
                }
            } else if ($request->payment_method == Transaction::$paymentTypePaypal) {

                $transaction_id = $request->transaction_id;

                $paypalClient = new PaypalClient();
                $server_output = $paypalClient->getPayment($transaction_id);
                $result = json_decode($server_output, 1);

                Log::info('-------------Paypal start---------------');
                Log::info('paypal result : ', [$result]);

                $status = Transaction::$statusFailed;

                if (isset($result['state']) && $result['state'] == 'approved') {
                    $status = Transaction::$statusSuccess;
                    $gateway_amount = $result['transactions'][0]['amount']['total'];
                }
            }
            // Map gateway payment method to normalized key for transactions.type
            $paymentMethod = $request->payment_method;
            $paymentTypeKeyMap = [
                Transaction::$paymentTypeRazorpay => Transaction::$typeRazorpay,
                Transaction::$paymentTypePaystack => Transaction::$typePaystack,
                Transaction::$paymentTypeStripe   => Transaction::$typeStripe,
                Transaction::$paymentTypePaytm    => Transaction::$typePaytm,
                Transaction::$paymentTypePaypal   => Transaction::$typePaypal,
                Transaction::$paymentTypeMidtrans => Transaction::$typeMidtrans,
                Transaction::$paymentTypePhonepe  => Transaction::$typePhonepe,
                Transaction::$paymentTypeCashfree => Transaction::$typeCashfree,
                Transaction::$paymentTypePaytabs  => Transaction::$typePaytabs,
            ];
            $paymentTypeKey = $paymentTypeKeyMap[$paymentMethod] ?? $paymentMethod;

            if ($request->type == 'order') {
                $transactionData = array();
                $transactionData['user_id'] = $order->user_id;
                $transactionData['order_id'] = $order->id;
                $transactionData['type'] = $paymentTypeKey;
                $transactionData['txn_id'] = $txn_id;
                $transactionData['payu_txn_id'] = "";
                $transactionData['amount'] = $order->final_total;
                $transactionData['status'] = $status;
                $transactionData['message'] = 'txn_order_payment';
                $transactionData['transaction_date'] = date('Y-m-d H:i:s');

                $transaction = Transaction::create($transactionData);
                if ($status == Transaction::$statusSuccess) {

                    if ($order->order_type == 'selfpickup') {
                        $order->active_status = OrderStatusList::$selfPickupPending;
                    } else {
                        $order->active_status = OrderStatusList::$received;
                    }
                    $order->transaction_id = $transaction->id ?? 0;
                    $order->save();

                    $excludedStatuses = [OrderStatusList::$cancelled, OrderStatusList::$returned];
                    // Update the order items
                    OrderItem::where("order_id", $order->id)
                        ->whereNotIn("active_status", $excludedStatuses)
                        ->update(['active_status' => $order->active_status]);

                    /* deduct wallet balance now that online payment is confirmed */
                    if ($order->wallet_balance > 0) {
                        $orderUser = User::find($order->user_id);
                        if ($orderUser) {
                            $current_balance = $orderUser->balance;
                            $new_balance = $current_balance < $order->wallet_balance ? 0 : $current_balance - $order->wallet_balance;
                            CommonHelper::updateUserWalletBalance($new_balance, $order->user_id);
                            CommonHelper::addWalletTransaction($order->id, 0, $order->user_id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, $order->payment_method ?? '');
                        }
                    }

                    return CommonHelper::responseSuccess("Order Placed Successfully");
                } else {
                    return CommonHelper::responseError("Transaction Failed, Please try again!");
                }
            } elseif ($request->type == 'subscription') {
                // Get subscription plan
                $subscriptionPlan = SubscriptionPlan::where('id', $request->subscription_plan_id)
                    ->where('status', 1)
                    ->first();

                if (!$subscriptionPlan) {
                    return CommonHelper::responseError("Subscription plan not found!");
                }

                // Calculate amount (discounted_price if available, else price)
                $subscription_amount = $subscriptionPlan->discounted_price ?? $subscriptionPlan->price;

                $transactionData = array();
                $transactionData['user_id'] = $user->id;
                $transactionData['order_id'] = 0; // No order for subscription
                $transactionData['type'] = $paymentTypeKey;
                $transactionData['txn_id'] = $txn_id;
                $transactionData['payu_txn_id'] = "";
                $transactionData['amount'] = $subscription_amount;
                $transactionData['status'] = $status;
                $transactionData['message'] = 'txn_subscription_payment';
                $transactionData['transaction_date'] = date('Y-m-d H:i:s');

                $transaction = Transaction::create($transactionData);

                if ($status == Transaction::$statusSuccess) {
                    // Create user subscription
                    $startDate = now()->toDateString();
                    $endDate = now()->addDays($subscriptionPlan->days - 1)->toDateString();

                    UserSubscription::create([
                        'user_id' => $user->id,
                        'plan_id' => $subscriptionPlan->id,
                        'plan_name' => $subscriptionPlan->name,
                        'price_paid' => $subscription_amount,
                        'discounted_price' => $subscriptionPlan->discounted_price,
                        'free_delivery_above' => $subscriptionPlan->free_delivery_above,
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                        'status' => 'active'
                    ]);

                    return CommonHelper::responseSuccess('subscription_activated_successfully');
                } else {
                    return CommonHelper::responseError("Transaction Failed, Please try again!");
                }
            } elseif ($request->type == 'wallet') {

                $walletTransactionData = array();
                $walletTransactionData['user_id'] =  $user->id;
                $walletTransactionData['order_id'] = '';
                $walletTransactionData['type'] = 'credit';
                $walletTransactionData['payment_type'] = $request->payment_method; // Razorpay / Paystack / Paypal
                $walletTransactionData['txn_id'] = $txn_id;
                $walletTransactionData['amount'] = $request->wallet_amount;
                $walletTransactionData['status'] = $status;
                $walletTransactionData['message'] = 'wallet_successfully_recharged';
                $walletTransactionData['transaction_date'] = date('Y-m-d H:i:s');
                $wallet_transaction = WalletTransaction::create($walletTransactionData);
                if ($status == WalletTransaction::$statusSuccess) {

                    //Mark credit amount in user balance
                    $balance = $user->balance;
                    $newBalance = $balance + $request->wallet_amount;

                    $user = User::where('id', $user->id)->update(['balance' => $newBalance]);
                    $data = array();
                    $data['user_balance'] = $newBalance;
                    return CommonHelper::responseSuccessWithData("Amount Added in Wallet Successfully", $data);
                } else {
                    return CommonHelper::responseError("Transaction Failed, Please try again!");
                }
            }
        }
    }

    public function updateOrderStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_item_id' => 'required',
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $order_item_id = $request->order_item_id;
        $order_item = OrderItem::select("*")->where("id", $order_item_id)->first();


        if (empty($order_item)) {
            return CommonHelper::responseError('Order Item Not found.');
        }

        if (isset($request->order_id)) {
            $id = $request->order_id;
        } else {
            $id = $order_item->order_id;
        }
        $order = Order::select("*")->where("id", $id)->first();
        if (empty($order)) {
            return CommonHelper::responseError('Order Not found.');
        }

        $user = User::select("*")->where('id', $order->user_id)->first();
        if (empty($user)) {
            return CommonHelper::responseError('User Not found.');
        }

        $postStatus = $request->status;
        $status = OrderStatusList::where('id', $postStatus)->first();
        if (empty($status)) {
            return CommonHelper::responseError('Status Not found.');
        }
        $selectedStatus = $status->status;
        if ($order_item->active_status == $postStatus) {
            return CommonHelper::responseError("This Order Item is already " . $selectedStatus . "!");
        }

        /* Cannot return order unless it is delivered */
        if (CommonHelper::isOrderItemReturned($order_item->active_status, $postStatus)) {
            return CommonHelper::responseError(__('cannot_return_order_unless_it_is_delivered'));
        }

        /* Could not update order status once cancelled or returned! */
        if (CommonHelper::isOrderItemCancelled($order_item_id)) {
            return CommonHelper::responseError(__('could_not_update_order_status_cancelled_or_returned'));
        }

        if (!empty($postStatus)) {

            if ($postStatus == OrderStatusList::$delivered) {

                if ($order->payment_method == Transaction::$paymentTypeCod) {

                    // Save Device details
                    if ($request->device_type) {
                        $app_usage = array();
                        $app_usage['order_id'] = $order->id;
                        $app_usage['device_type'] = $request->device_type;
                        $app_usage['app_version'] = $request->app_version;
                        AppUsage::create($app_usage);
                    }

                    $transactionData = array();
                    $transactionData['user_id'] = $order->user_id;
                    $transactionData['order_id'] = $order->id;
                    $transactionData['type'] = "COD";
                    $transactionData['txn_id'] = round(microtime(true) * 1000);
                    $transactionData['payu_txn_id'] = "";
                    $transactionData['amount'] = $order->total;
                    $transactionData['status'] = Transaction::$statusSuccess;
                    $transactionData['message'] = "";
                    $transactionData['transaction_date'] = date('Y-m-d H:i:s');
                    $transaction = Transaction::create($transactionData);
                    $order->transaction_id = $transaction->id ?? 0;
                }

                $order->active_status = OrderStatusList::$delivered;
                $order->save();

                $order_item->active_status = OrderStatusList::$delivered;
                $order_item->save();

                dispatch(function () use ($order_item) {
                    try {
                        CommonHelper::sendOrderItemStatusMailNotification($order_item, 'order_item_status_update');
                    } catch (\Exception $e) {
                        Log::error("Order delivered mail/notification error :", [$e->getMessage()]);
                    }
                })->afterResponse();
                return CommonHelper::responseSuccess("Order Status Updated Successfully");
                /*Send Notification*/
            } else if ($postStatus == OrderStatusList::$cancelled) {
                DB::beginTransaction();

                // Count total items and how many are still not cancelled (before we save this one).
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
                $currentBalance = $user->balance;

                // Initialize additional charges total at the beginning
                $additional_charges = json_decode($order->additional_charges, true) ?? [];
                $additional_charges_total = array_sum(array_column($additional_charges, 'amount'));
                $refundable_charges_total = 0;
                $non_refundable_charges_total = 0;
                foreach ($additional_charges as $charge) {

                    $isRefundable = isset($charge['is_refundable'])
                        ? (bool)$charge['is_refundable']
                        : false;

                    if ($isRefundable) {
                        $refundable_charges_total += floatval($charge['amount']);
                    } else {
                        $non_refundable_charges_total += floatval($charge['amount']);
                    }
                }

                if ($order->payment_method !== Transaction::$paymentTypeCod) {
                    if ($itemNum == 1 || $lastItemNum == 1) {
                        // For single/last item - scientifically refund remainder by excluding known non-refundable charges
                        $refundable = max(0, floatval($order->remaining_final) - $non_refundable_charges_total - floatval($order->delivery_charge));

                        // Process refund
                        if ($refundable > 0) {
                            $new_balance = $currentBalance + $refundable;
                            CommonHelper::updateUserWalletBalance($new_balance, $order->user_id);
                            CommonHelper::addWalletTransaction($order->id, $order_item->id, $order->user_id, 'credit', $refundable, 'wallet_order_item_cancelled');
                        }

                        // Update order - only non-refundable charges and delivery remain
                        $order->remaining_total = 0;
                        $order->remaining_final = $non_refundable_charges_total + floatval($order->delivery_charge);
                        $order->wallet_balance = 0;
                        $order->save();
                    } else {
                        // For multiple items - calculate refund
                        $total_items_amount = OrderItem::where('order_id', $order->id)
                            ->sum('sub_total');

                        $itemShare = ($total_items_amount > 0) ? ($order_item->sub_total / $total_items_amount) : 0;


                        //  ADD PROMO SHARE CALCULATION HERE
                        $promo_share = 0;
                        if ($order->promo_discount > 0) {
                            $promo_share = $order->promo_discount * $itemShare;
                            $order->promo_discount = $order->promo_discount - $promo_share;
                        }

                        //  FINAL REFUND CALCULATION
                        $refundable = $order_item->sub_total;

                        if ($refundable_charges_total > 0) {
                            $refundable += $refundable_charges_total * $itemShare;
                        }

                        // SUBTRACT PROMO SHARE
                        $refundable -= $promo_share;

                        // If wallet was used, deduct from internal tracking
                        if ($order->wallet_balance > 0) {
                            $wallet_portion = $order_item->sub_total / $total_items_amount;
                            $wallet_refund = $order->wallet_balance * $wallet_portion;

                            // Update order wallet balance
                            $order->wallet_balance = max(0, $order->wallet_balance - $wallet_refund);
                        }

                        // Process main refund
                        if ($refundable > 0) {
                            CommonHelper::addWalletTransaction($order->id, $order_item->id, $order->user_id, 'credit', $refundable, 'wallet_order_item_amount_refunded');
                            $new_balance = $currentBalance + $refundable;
                            CommonHelper::updateUserWalletBalance($new_balance, $order->user_id);
                        }

                        // Update order
                        $order->remaining_total = floatval($order->remaining_total) - floatval($order_item->sub_total);
                        // $order->remaining_final = floatval($order->remaining_total) + $non_refundable_charges_total;
                        $remaining_refundable_charges = $refundable_charges_total - ($refundable_charges_total * $itemShare);

                        $order->remaining_final =
                            $order->remaining_total
                            + $remaining_refundable_charges
                            + $non_refundable_charges_total
                            + $order->delivery_charge
                            - $order->promo_discount;
                        $order->save();
                    }
                } else {
                    // For COD orders - only refund wallet balance if used
                    if ($order->wallet_balance > 0) {
                        if ($itemNum == 1 || $lastItemNum == 1) {
                            // For single/last item - refund entire wallet balance
                            $refundable = $order->wallet_balance;

                            // Process wallet refund
                            $new_balance = $currentBalance + $refundable;
                            CommonHelper::updateUserWalletBalance($new_balance, $order->user_id);
                            CommonHelper::addWalletTransaction($order->id, $order_item->id, $order->user_id, 'credit', $refundable, 'wallet_order_item_cancelled');

                            // Update order - COD fully cancelled, customer never paid so nothing to keep
                            $order->remaining_total = 0;
                            $order->remaining_final = 0;
                            $order->wallet_balance = 0;
                        } else {
                            // For multiple items - calculate proportional wallet refund
                            // $total_items_amount = OrderItem::where('order_id', $order->id)
                            //     ->sum('sub_total'); // include ALL items
                            //  Only NON-CANCELLED items
                            $total_items_amount = OrderItem::where('order_id', $order->id)
                                ->where('active_status', '!=', OrderStatusList::$cancelled)
                                ->sum('sub_total');

                            $wallet_portion = $order_item->sub_total / $total_items_amount;
                            $wallet_refund = $order->wallet_balance * $wallet_portion;

                            // Process wallet refund
                            if ($wallet_refund > 0) {
                                $new_balance = $currentBalance + $wallet_refund;
                                CommonHelper::updateUserWalletBalance($new_balance, $order->user_id);
                                CommonHelper::addWalletTransaction($order->id, $order_item->id, $order->user_id, 'credit', $wallet_refund, 'wallet_order_item_cancelled');
                            }

                            // Update order - partial cancel, keep non-refundable charges for remaining items
                            $order->remaining_total = floatval($order->remaining_total) - floatval($order_item->sub_total);
                            $order->remaining_final = floatval($order->remaining_total) + $non_refundable_charges_total;
                            $order->wallet_balance = $order->wallet_balance - $wallet_refund;
                        }
                        $order->save();
                    } else {
                        // No wallet balance used, just update order totals
                        $isLastItem = ($itemNum == 1 || $lastItemNum == 1);
                        $order->remaining_total = $isLastItem ? 0 : floatval($order->remaining_total) - floatval($order_item->sub_total);
                        $order->remaining_final = $isLastItem ? 0 : floatval($order->remaining_total) + $non_refundable_charges_total;
                        $order->save();
                    }
                }
                $order_item->active_status = $postStatus;
                $order_item->cancellation_reason = $request->cancellation_reason;
                $order_item->canceled_at = now();
                $order_item->save();
                // Find the product variant by id
                $product_variant_id = $order_item->product_variant_id;
                $product_variant = ProductVariant::where('id', $product_variant_id)->first();

                if ($product_variant) {
                    // Update the stock value
                    $new_stock_value = $product_variant->stock + $order_item->quantity;
                    $product_variant->stock = $new_stock_value; // Set the new stock value
                    $product_variant->save(); // Save the changes to the database
                }
                if (isset($order->promo_code) && $order->promo_code != null && isset($order->promo_discount) && $order->promo_discount != null) {
                    $promo_code = explode("(", $order->promo_code);
                    $minimum_order_amount = PromoCode::where('promo_code', $promo_code[0])->first()->minimum_order_amount;
                    if (isset($minimum_order_amount) && $minimum_order_amount != null && $order->total < $minimum_order_amount) {
                        $order_id = $order->id;
                        CommonHelper::updateOrderPromoCode($order_id, $order->promo_discount);
                    }
                }

                DB::commit();
                dispatch(function () use ($order_item) {
                    try {
                        CommonHelper::sendOrderItemStatusMailNotification($order_item, 'order_item_status_update');
                    } catch (\Exception $e) {
                        Log::error("Order cancelled mail/notification error :", [$e->getMessage()]);
                    }
                    // Order Item cancelled Send SMS
                    try {
                        CommonHelper::sendSmsOrderStatus($order_item, OrderStatusList::$cancelled); // case 7
                    } catch (\Exception $e) {
                        Log::error("Order cancelled SMS error :", [$e->getMessage()]);
                    }
                })->afterResponse();
                return CommonHelper::responseSuccessWithData('order_cancelled_successfully', $order);
            } elseif ($postStatus == OrderStatusList::$returned) {
                $validator = Validator::make($request->all(), [
                    'order_item_id' => [
                        'required',
                        Rule::unique('return_requests')->ignore($request->order_item_id),
                    ],
                ], [
                    'order_item_id.unique' => 'Return request has been sent already.',
                ]);
                if ($validator->fails()) {
                    return CommonHelper::responseError($validator->errors()->first());
                }
                $returnRequest = new ReturnRequest();
                $returnRequest->user_id = $order_item->user_id;
                $returnRequest->product_variant_id = $order_item->product_variant_id;
                $returnRequest->order_id = $request->order_id;
                $returnRequest->order_item_id = $request->order_item_id;
                $returnRequest->reason = $request->reason;
                $returnRequest->status = 1;    //request is pending
                $returnRequest->delivery_boy_id = 0;    //request is pending, so no delivery boy assigned
                $returnRequest->remarks = $request->remarks ?? '';
                $returnRequest->save();

                // Push notifications to customer (return_request_customer) and seller (return_request_seller); seller from order_item.
                dispatch(function () use ($returnRequest, $order_item) {
                    try {
                        CommonHelper::sendReturnRequestNotification($returnRequest);
                    } catch (\Exception $e) {
                        Log::error("Return request customer/seller notification error :", [$e->getMessage()]);
                    }
                    // Panel notifications for seller and admin: "You have a request for product return".
                    try {
                        CommonHelper::sendReturnRequestPanelNotifications($returnRequest);
                    } catch (\Exception $e) {
                        Log::error("Return request panel notification error :", [$e->getMessage()]);
                    }
                    try {
                        CommonHelper::sendOrderItemStatusMailNotification($order_item, 'return_request_sent');
                    } catch (\Exception $e) {
                        Log::error("Return request mail/notification error :", [$e->getMessage()]);
                    }
                    try {
                        CommonHelper::sendSmsOrderStatus($order_item, 8);  // case 8
                    } catch (\Exception $e) {
                        Log::error("Return request SMS error :", [$e->getMessage()]);
                    }
                })->afterResponse();
                return CommonHelper::responseSuccess('order_return_request_sent_successfully');
            } else {

                $order_item->active_status = $postStatus;

                $order_item->save();
                dispatch(function () use ($order_item) {
                    try {
                        CommonHelper::sendOrderItemStatusMailNotification($order_item, 'order_item_status_update');
                    } catch (\Exception $e) {
                        Log::error("Order status update mail/notification error :", [$e->getMessage()]);
                    }
                })->afterResponse();

                return CommonHelper::responseSuccess('order_status_updated_successfully');
            }
        }
    }

    public function getOrders(Request $request)
    {
        $limit = ($request->limit) ?? 12;
        $offset = ($request->offset) ?? 0;
        $page = $request->get('page', 0);

        $order_id = $request->order_id;
        $user_id = auth()->user()->id;

        $sql = Order::select(DB::raw("count(id) as total"))
            ->where("user_id", $user_id);
        if (!empty($order_id)) {
            $sql = $sql->where("id", $order_id);
        }

        if (isset($request->order_status_id) && $request->order_status_id != 0 && $request->order_status_id != "") {
            $sql = $sql->where("active_status", "=", $request->order_status_id);
        }

        if (isset($request->order_type) && !empty($request->order_type)) {
            $sql = $sql->where("order_type", "=", $request->order_type);
        }

        if (isset($request->type)) {
            $activeTypeStatus = [OrderStatusList::$paymentPending, OrderStatusList::$received, OrderStatusList::$processed, OrderStatusList::$outForDelivery, OrderStatusList::$shipped, OrderStatusList::$selfPickupPending, OrderStatusList::$selfPickupReady, OrderStatusList::$rescheduled];
            $previousTypeStatus = [OrderStatusList::$delivered, OrderStatusList::$cancelled, OrderStatusList::$returned, OrderStatusList::$selfPickupPicked];
            if ($request->type == Order::$activeType) {
                $sql = $sql->whereIn('orders.active_status', $activeTypeStatus);
            } else {
                $sql = $sql->whereIn('orders.active_status', $previousTypeStatus);
            }
        }
        $total = $sql->first();
        $sql = Order::select(
            "orders.*",
            'orders.address as order_address',
            'orders.mobile as order_mobile',
            'orders.id as order_id',
            "dboys.name as delivery_boy_name",
            "dboys.mobile as delivery_boy_mobile",

            DB::raw('(select name from users as u where u.id = orders.user_id) as user_name'),
            'address.address',
            'address.landmark',
            'address.area',
            'address.city',
            'address.state',
            'address.pincode',
            'address.country'
        )->from("orders")
            ->leftJoin('user_addresses as address', 'orders.address_id', '=', 'address.id')
            ->leftJoin('delivery_boys as dboys', 'orders.delivery_boy_id', '=', 'dboys.id')
            ->where("orders.user_id", "=", $user_id);
        if (!empty($order_id)) {
            $sql = $sql->where("orders.id", "=", $order_id);
        }

        if (isset($request->order_status_id) && $request->order_status_id != 0 && $request->order_status_id != "") {
            $sql = $sql->where("orders.active_status", "=", $request->order_status_id);
        }

        if (isset($request->order_type) && !empty($request->order_type)) {
            $sql = $sql->where("orders.order_type", "=", $request->order_type);
        }

        if (isset($request->type)) {
            $activeTypeStatus = [OrderStatusList::$paymentPending, OrderStatusList::$received, OrderStatusList::$processed, OrderStatusList::$outForDelivery, OrderStatusList::$shipped, OrderStatusList::$selfPickupPending, OrderStatusList::$selfPickupReady, OrderStatusList::$rescheduled];
            $previousTypeStatus = [OrderStatusList::$delivered, OrderStatusList::$cancelled, OrderStatusList::$returned, OrderStatusList::$selfPickupPicked];
            if ($request->type == Order::$activeType) {
                $sql = $sql->whereIn('orders.active_status', $activeTypeStatus);
            } else {
                $sql = $sql->whereIn('orders.active_status', $previousTypeStatus);
            }
        }
        $res = $sql->orderBy("orders.id", "DESC")->skip($offset)->take($limit)->get();

        $productRatingSetting = (int) (Setting::get_value('product_rating') ?? 0);
        $isProductRatingEnabled = $productRatingSetting === 1;
        $deliveryEstimateDays = (int) (Setting::get_value('delivery_estimate_days') ?? 0);
        $res = $res->makeHidden(['image', 'updated_at', 'deleted_at', 'current_status']);

        $langCode = app('lang_code') ?? 'en';
        app()->setLocale($langCode);

        $i = 0;
        foreach ($res as $key => $row) {
            $res[$key]->order_status_name = OrderStatusList::getTranslatedName((int) $row->active_status);
            $res[$key]->address = $row->address . " " . $row->landmark . " " . $row->area . " " . $row->city . " " . $row->state . "-" . $row->pincode . " " . $row->country;
            if (is_string($row->additional_charges)) {
                $res[$i]['additional_charges'] = json_decode($row->additional_charges, true) ?? [];
            } elseif (is_array($row->additional_charges)) {
                $res[$i]['additional_charges'] = $row->additional_charges;
            } else {
                $res[$i]['additional_charges'] = [];
            }
            if (empty($res[$key]->otp)) {
                $newOtp = mt_rand(100000, 999999);
                DB::table('orders')->where('id', $res[$key]->order_id)->update(['otp' => $newOtp]);
                $res[$key]->otp = $newOtp;
            }
            $product_rating = Setting::get_value("product_rating");
            $res[$key]->product_rating = $product_rating ?? 0;
            // echo "meri ek tang nakli hain me hoki ka bohot bada khiladi hun";
            $final_sub_total = 0;
            $sub_total = 0;

            $row->promo_code = explode('(', $row->promo_code)[0];

            if ($row->discount > 0) {

                $discounted_amount = $row->total * $row->discount / 100;
                $final_total = $row->total - $discounted_amount;
                $discount_in_rupees = $row->total - $final_total;
            } else {
                $discount_in_rupees = 0;
            }

            $res[$i]['discount_rupees'] = $discount_in_rupees;
            $final_total = $res[$i]['final_total'];
            $res[$i]['final_total'] = $final_total;

            $res[$i]['date'] = CommonHelper::formatDateTime($row->created_at);
            $res[$i]['created_at'] = $row->created_at;
            $res[$i]['estimate_date'] = CommonHelper::formatDate(
                Carbon::parse($row->created_at)->addDays($deliveryEstimateDays)
            );

            $res[$i]['bank_transfer_message'] = !empty($res[$i]['bank_transfer_message']) ? $res[$i]['bank_transfer_message'] : "";
            $res[$i]['bank_transfer_status'] = !empty($res[$i]['bank_transfer_status']) ? $res[$i]['bank_transfer_status'] : 0;

            if ($row->order_type == 'selfpickup' && !empty($row->pickup_address)) {
                if (is_string($row->pickup_address)) {
                    $pickupAddress = json_decode($row->pickup_address, true) ?? [];
                } else {
                    $pickupAddress = $row->pickup_address;
                }

                if (empty($pickupAddress['seller_mobile'])) {
                    $sellerMobile = OrderItem::where('order_id', $row->id)
                        ->join('sellers', 'order_items.seller_id', '=', 'sellers.id')
                        ->value('sellers.mobile');

                    if ($sellerMobile) {
                        $pickupAddress['seller_mobile'] = $sellerMobile;
                    }
                }

                $res[$i]['pickup_address'] = $pickupAddress;
            } else {
                $res[$i]['pickup_address'] = [];
            }

            $orderStatus = orderStatus::where('order_id', $row['id'])->get();
            $data = array();
            foreach ($orderStatus as $status) {
                $subData = array();
                array_push($subData, OrderStatusList::getStatusNameTranslated($status->status), CommonHelper::formatDateTime($status->created_at));
                array_push($data, $subData);
            }
            // Fallback: if no history rows, synthesize from current active_status
            if (empty($data)) {
                $data[] = [
                    OrderStatusList::getStatusNameTranslated((int) $row->active_status),
                    CommonHelper::formatDateTime($row->created_at),
                ];
            }
            $res[$i]['status'] = $data;

            $items = OrderItem::with('images')->select(
                'oi.*',
                'v.id as variant_id',
                DB::raw('COALESCE(mp.id, p.id) as product_id'),
                'p.name',
                'p.image',
                'p.manufacturer',
                'p.made_in',
                'p.return_status',
                'p.return_days',
                'p.cancelable_status',
                'p.till_status',
                'v.measurement',
                'v.stock_unit_id',
                DB::raw('(select short_code from units as u where u.id = v.stock_unit_id) as unit'),
                'co.name as country_made_in',
                's.name as seller_name',
                's.formatted_address as seller_address',
                's.place_name as seller_place_name',
                's.latitude as seller_latitude',
                's.longitude as seller_longitude',
                DB::raw('COALESCE(mpv.image, mp.image) as master_image'),
                DB::raw('(SELECT status FROM return_requests WHERE order_item_id = oi.id) as return_requested'),
                DB::raw('(SELECT reason FROM return_requests WHERE order_item_id = oi.id) as return_reason'),
                DB::raw('(SELECT remarks FROM return_requests WHERE order_item_id = oi.id) as return_remarks')
            )
                ->from('order_items as oi')
                ->leftJoin('product_variants as v', 'oi.product_variant_id', '=', 'v.id')
                ->leftJoin('products as p', 'v.product_id', '=', 'p.id')
                ->leftJoin('master_product_variants as mpv', 'oi.master_product_variant_id', '=', 'mpv.id')
                ->leftJoin('master_products as mp', 'mpv.master_product_id', '=', 'mp.id')
                ->leftJoin('sellers as s', 'oi.seller_id', '=', 's.id')
                ->leftJoin("countries as co", "p.made_in", "=", "co.id")
                ->where('oi.order_id', '=', $row['id'])
                ->orderBy('oi.id', 'ASC')
                ->get();

            foreach ($items as $subkey => $item) {

                $taxed = ProductHelper::getTaxableAmount($item->product_variant_id);

                $items[$subkey]->made_in = $item->country_made_in ?? "";
                $items[$subkey]->created_at = $item->created_at;

                // Add tax_amount to price and discounted_price
                $tax_amount = (float) ($item->tax_amount ?? 0);
                $items[$subkey]->price = (float) CommonHelper::doubleNumber($item->price + $tax_amount);
                $items[$subkey]->discounted_price = (float) CommonHelper::doubleNumber(
                    ($item->discounted_price != 0 ? $item->discounted_price + $tax_amount : 0)
                );

                $items[$subkey]->effective_price = (float) CommonHelper::doubleNumber(
                    ($item->discounted_price !== null && $item->discounted_price != 0)
                        ? $item->discounted_price
                        : ($taxed->taxable_amount ?? $item->price)
                );
                $cancelableStatusList = array(OrderStatusList::$received, OrderStatusList::$processed, OrderStatusList::$shipped, OrderStatusList::$outForDelivery);

                if (($item->cancelable_status == 1) && intval($row->active_status) <= intval($item->till_status) && in_array($row->active_status, $cancelableStatusList)) {
                    $items[$subkey]->cancelable_status = 1;
                } else {
                    $items[$subkey]->cancelable_status = 0;
                }

                $created_at = date_create(date('Y-m-d', strtotime($row->created_at)));
                $current_data = date_create(date('Y-m-d'));
                $order_days = abs(date_diff($created_at, $current_data)->format('%R%a'));

                if (($item->return_status == 1) && intval($order_days) <= intval($item->return_days) && intval($row->active_status) == OrderStatusList::$delivered) {
                    $items[$subkey]->return_status = 1;
                } else {
                    $items[$subkey]->return_status = 0;
                }
                $items[$subkey]->item_rating = CommonHelper::productRatingOfUser($item->product_id, $item->user_id);
            }
            foreach ($items as $item) {
                if (empty($item->image)) {
                    $item->image = $item->master_image;
                }
            }
            $items = $items->makeHidden(['images', 'master_image', 'updated_at', 'deleted_at', 'status', 'current_status', 'country_made_in']);

            $res[$i]['items'] = $items;
            $res[$i]['product_rating'] = $isProductRatingEnabled;
            $res[$i]['final_total'] = strval($row['final_total']);
            $res[$i]['total'] = strval($row['total']);
            $res[$i]['sub_total'] = strval(
                collect($items)->where('is_free_item', 0)->sum('sub_total')
            );
            if ($row->order_type == 'selfpickup') {
                unset($res[$i]['delivery_charge']);
            }

            $i++;
        }

        if (!empty($res) && $total->total !== 0) {
            return CommonHelper::responseWithData($res, $total->total);
        } else {
            return CommonHelper::responseError(__('no_orders_found'));
        }
    }

    public function generateOrderInvoice(Request $request)
    {
        $data = CommonHelper::getOrderDetails($request->order_id, true);
        if (!$data["order"]) {
            return CommonHelper::responseError("Order Not found!");
        }
        if ($data["order"]->active_status != OrderStatusList::$delivered && $data["order"]->active_status != OrderStatusList::$selfPickupPicked) {
            return CommonHelper::responseError("Invoice can only be generated after the order has been delivered.");
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
        if ($data["order"]->active_status != OrderStatusList::$delivered && $data["order"]->active_status != OrderStatusList::$selfPickupPicked) {
            return CommonHelper::responseError("Invoice can only be downloaded after the order has been delivered.");
        }
        CommonHelper::AdditionalChargesArray($data['order']);
        return CommonHelper::downloadOrderInvoice($request->order_id);
    }

    /*Midtrans*/
    public function midtransCallback(Request $request)
    {
        $notification = $request->all();

        // Log the notification for debugging
        Log::info("Midtrans Callback: " . print_r($notification, true));


        if ($notification['status_code'] == 200) {

            //transaction
            $order_id = $notification['order_id'];
            $explode = explode('-', $order_id);
            if ($explode[0] == 'order') {
                $transactionData = array();
                $transactionData['user_id'] = $explode[2];
                $transactionData['order_id'] = $explode[1];
                $transactionData['type'] = Transaction::$typeMidtrans;
                $transactionData['txn_id'] = $notification['transaction_id'];
                $transactionData['payu_txn_id'] = "";
                $transactionData['amount'] = $notification['gross_amount'] / 1000;
                $transactionData['status'] = $notification['transaction_status'];
                $transactionData['message'] = 'txn_order_payment';
                $transactionData['transaction_date'] = $notification['transaction_time'];

                $transaction = Transaction::create($transactionData);
                $order = Order::withTrashed()->where('id', $explode[1])->first();
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
                    $user = User::where('id', $explode[2])->first();
                    if ($user) {
                        $user_wallet_balance = $user->balance;
                        $new_balance = $user_wallet_balance < $order->wallet_balance ? 0 : $user_wallet_balance - $order->wallet_balance;
                        CommonHelper::updateUserWalletBalance($new_balance, $user->id);
                        CommonHelper::addWalletTransaction($order->id, 0, $user->id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, Transaction::$paymentTypeMidtrans);
                    }
                }

                $order->save();

                return CommonHelper::responseSuccess("Order Placed Successfully");
            } elseif ($explode[0] == 'subscription') {
                // Handle subscription payment for Midtrans
                $subscription_plan_id = isset($explode[1]) && is_numeric($explode[1]) ? $explode[1] : 0;
                $user_id = isset($explode[2]) && is_numeric($explode[2]) ? $explode[2] : 0;

                if ($subscription_plan_id > 0 && $user_id > 0) {
                    $subscriptionPlan = \App\Models\SubscriptionPlan::where('id', $subscription_plan_id)
                        ->where('status', 1)
                        ->first();

                    if ($subscriptionPlan) {
                        $subscription_amount = $subscriptionPlan->discounted_price ?? $subscriptionPlan->price;

                        $transactionData = array();
                        $transactionData['user_id'] = $user_id;
                        $transactionData['order_id'] = 0;
                        $transactionData['type'] = 'Midtrans';
                        $transactionData['txn_id'] = $notification['transaction_id'];
                        $transactionData['payu_txn_id'] = "";
                        $transactionData['amount'] = $notification['gross_amount'] / 1000;
                        $transactionData['status'] = $notification['transaction_status'] == 'settlement' ? Transaction::$statusSuccess : Transaction::$statusFailed;
                        $transactionData['message'] = 'txn_subscription_payment';
                        $transactionData['transaction_date'] = $notification['transaction_time'];

                        $transaction = Transaction::create($transactionData);

                        if ($transactionData['status'] == Transaction::$statusSuccess) {
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

                            return CommonHelper::responseSuccess("Subscription activated successfully");
                        }
                    }
                }
            } elseif ($explode[0] == 'wallet') {
                Log::info("Midtrans Callbackwall: " . print_r($notification, true));

                $walletTransactionData = array();
                $walletTransactionData['user_id'] =  $explode[2];
                $walletTransactionData['order_id'] = '';
                $walletTransactionData['type'] = 'credit';
                $walletTransactionData['payment_type'] = 'Midtrans';
                $walletTransactionData['txn_id'] = $notification['transaction_id'];
                $walletTransactionData['amount'] = $notification['gross_amount'] / 1000;
                $walletTransactionData['status'] = $notification['transaction_status'];
                $walletTransactionData['message'] = 'wallet_successfully_recharged';
                $walletTransactionData['transaction_date'] = $notification['transaction_time'];
                $wallet_transaction = WalletTransaction::create($walletTransactionData);

                $user = User::where('id', $explode[2])->first();
                //Mark credit amount in user balance
                $balance = $user->balance;
                $newBalance = $balance + $walletTransactionData['amount'];

                $user = User::where('id', $user->id)->update(['balance' => $newBalance]);
                $data = array();
                $data['user_balance'] = $newBalance;
                return CommonHelper::responseSuccessWithData("Amount Added in Wallet Successfully", $data);
            }
        }
    }

    public function getLiveTrackingDetails(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|numeric|exists:orders,id',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        // Retrieve the order ID from the request
        $orderId = $request->input('order_id');

        // Fetch the live tracking details based on the order ID
        $trackingData = LiveTracking::where('order_id', $orderId)
            ->orderBy('id', 'desc')
            ->first();

        // Check if the tracking data exists
        if ($trackingData) {
            return CommonHelper::responseSuccessWithData("Live Tracking Detail fetched successfully.", $trackingData);
        } else {
            return CommonHelper::responseError("Live Tracking Not available.");
        }
    }

    public function getOrderStatusPhonepe(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required|string'
        ]);
        try {
            $transactionId = $request->transaction_id;

            $mode = Setting::get_value('phonepay_mode'); // 'uat' or 'production'
            $merchantId = Setting::get_value('phonepay_merchant_id');

            // Get access token from your stored method or regenerate (better to cache it)
            $accessToken = $request->token; // Replace with dynamic token generation
            if (empty($accessToken)) {
                Log::error('PhonePe status token missing');
                return CommonHelper::responseError("Missing PhonePe token.");
            }

            $statusUrl = $mode === 'production'
                ? "https://api.phonepe.com/apis/pg/checkout/v2/order/$transactionId/status"
                : "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/$transactionId/status";
            
            $curl = curl_init();

            curl_setopt_array($curl, [
                CURLOPT_URL => $statusUrl,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'GET',
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Authorization: O-Bearer ' . $accessToken
                ],
            ]);

            $response = curl_exec($curl);
            unset($curl);

            $response = json_decode($response, true);

            // Guard against empty / invalid responses so we do not access null offsets.
            if (!$response) {
                Log::error('PhonePe status empty response', ['raw' => $response]);
                return CommonHelper::responseError("Unable to read PhonePe response.");
            }

            // PhonePe wraps data under "data" sometimes; fall back to root.
            $statusPayload = $response['data'] ?? $response;

            $paymentDetails = $statusPayload['paymentDetails'][0] ?? null;
            $metaInfo = $statusPayload['metaInfo'] ?? null;

            $paymentDetails = $statusPayload['paymentDetails'][0] ?? null;

            if (!$paymentDetails) {
                Log::error('PhonePe status missing paymentDetails', ['payload' => $statusPayload]);
                return CommonHelper::responseError("PhonePe status not available yet. Try again.");
            }

            $website_url = Setting::get_value('website_url') ?? "";

            try {
                if (($paymentDetails['state'] ?? '') == 'COMPLETED') {
                    // transaction

                    $order_id = $metaInfo['order_id'] ?? 0;

                    if (($metaInfo['type'] ?? '') == 'order') {

                        $transactionData = array();
                        $transactionData['user_id'] = $metaInfo['user_id'] ?? 0;
                        $transactionData['order_id'] = $metaInfo['order_id'] ?? 0;
                        $transactionData['type'] = Transaction::$typePhonepe;
                        $transactionData['txn_id'] = $paymentDetails['transactionId'] ?? '';
                        $transactionData['payu_txn_id'] = "";
                        $transactionData['amount'] = ($paymentDetails['amount'] ?? 0) / 100;
                        $transactionData['status'] = Transaction::$statusSuccess;
                        $transactionData['message'] = 'txn_order_payment';
                        $transactionData['transaction_date'] = now();

                        $transaction = Transaction::create($transactionData);
                        $order = Order::withTrashed()->where('id', $metaInfo['order_id'] ?? 0)->first();
                        $user = User::where('id', $metaInfo['user_id'] ?? 0)->first();
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
                            CommonHelper::addWalletTransaction($order_id, 0, $user->id, 'debit', $order->wallet_balance, 'wallet_used_against_order_placement', 1, Transaction::$paymentTypePhonepe);
                        }

                        $order->save();

                        $excludedStatuses = [OrderStatusList::$cancelled, OrderStatusList::$returned];
                        // Update the order items
                        OrderItem::where("order_id", $order->id)
                            ->whereNotIn("active_status", $excludedStatuses)
                            ->update(['active_status' => $order->active_status]);

                        return CommonHelper::responseWithData(['status' => $paymentDetails['state'], 'order_id' => $metaInfo['order_id'], 'user_id' => $metaInfo['user_id'], 'type' => $metaInfo['type']]);
                    } elseif (($metaInfo['type'] ?? '')  == 'wallet') {
                        // \Log::info("phonepe Callbackwallet: " . print_r($response, true));

                        $walletTransactionData = array();
                        $walletTransactionData['user_id'] =  $metaInfo['user_id'] ?? 0;
                        $walletTransactionData['order_id'] = '';
                        $walletTransactionData['type'] = 'credit';
                        $walletTransactionData['payment_type'] = Transaction::$paymentTypePhonepe;
                        $walletTransactionData['txn_id'] =  $paymentDetails['transactionId'] ?? '';
                        $walletTransactionData['amount'] = ($paymentDetails['amount'] ?? 0) / 100;
                        $walletTransactionData['status'] = Transaction::$statusSuccess;
                        $walletTransactionData['message'] = 'wallet_successfully_recharged';
                        $walletTransactionData['transaction_date'] = now();
                        $wallet_transaction = WalletTransaction::create($walletTransactionData);

                        $newBalance = CommonHelper::addUserWalletBalance($walletTransactionData['amount'], $metaInfo['user_id'] ?? 0);

                        return CommonHelper::responseWithData(['status' => $paymentDetails['state'], 'order_id' => $metaInfo['order_id'], 'user_id' => $metaInfo['user_id'], 'type' => $metaInfo['type']]);
                    } elseif (($metaInfo['type'] ?? '') == 'subscription') {
                        // Handle subscription payment
                        $user_id = $metaInfo['user_id'] ?? 0;
                        $subscription_plan_id = $metaInfo['subscription_plan_id'] ?? 0;

                        if ($subscription_plan_id > 0) {
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
                                $transactionData['txn_id'] = $paymentDetails['transactionId'] ?? '';
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

                                return CommonHelper::responseWithData([
                                    'status' => $paymentDetails['state'],
                                    'subscription_plan_id' => $subscription_plan_id,
                                    'user_id' => $user_id,
                                    'type' => $metaInfo['type']
                                ]);
                            }
                        }
                    }
                } else {

                    if (($metaInfo['type'] ?? '') == 'order') {
                        Order::where('id', $metaInfo['order_id'] ?? 0)->update(['active_status' => OrderStatusList::$cancelled]);
                        return CommonHelper::responseWithData(['status' => $paymentDetails['state'] ?? 'FAILED', 'order_id' => $metaInfo['order_id'], 'user_id' => $metaInfo['user_id'], 'type' => $metaInfo['type']]);
                    }
                }
            } catch (\Exception $e) {
                Log::error("Error processing Phonepe callback: " . $e->getMessage());
                return CommonHelper::responseError("An error occurred while processing the callback.");
            }
        } catch (\Exception $e) {
            Log::error('PhonePe Status Check Error: ' . $e->getMessage());
            return response()->json([
                'error' => true,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function rescheduleOrder(Request $request, $id = null)
    {
        $orderId = $id ?? $request->id ?? $request->order_id;
        if (empty($orderId)) {
            return CommonHelper::responseError("Order ID is required!");
        }

        $validator = Validator::make($request->all(), [
            'delivery_date'   => 'required|date|date_format:Y-m-d|after_or_equal:today',
            'delivery_reason' => 'nullable|string|max:255',
            'delivery_time'   => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $order = Order::find($orderId);
        if (empty($order)) {
            return CommonHelper::responseError("Order Not found!");
        }

        if ($order->user_id != auth()->user()->id) {
            return CommonHelper::responseError("Unauthorized");
        }

        if (in_array($order->active_status, [
            OrderStatusList::$delivered,
            OrderStatusList::$cancelled,
            OrderStatusList::$returned,
            OrderStatusList::$selfPickupPicked
        ])) {
            return CommonHelper::responseError("Cannot reschedule an order that is already delivered, cancelled, or returned.");
        }

        DB::beginTransaction();
        try {
            $order->delivery_date = $request->delivery_date;
            if ($request->has('delivery_reason')) {
                $order->delivery_reason = $request->delivery_reason;
            }
            if ($request->has('delivery_time')) {
                $order->delivery_time = $request->delivery_time;
            }
            $order->active_status = OrderStatusList::$rescheduled;
            $order->loading_slip_id = null;
            $order->delivery_boy_id = null;
            $order->delivery_boy_bonus_amount = 0;
            $order->delivery_boy_bonus_details = null;
            $order->save();

            // Sync order items active status
            OrderItem::where('order_id', $order->id)
                ->whereNotIn('active_status', [OrderStatusList::$cancelled, OrderStatusList::$returned])
                ->update(['active_status' => OrderStatusList::$rescheduled]);

            // Log status history
            $orderStatus = [
                'order_id'      => $order->id,
                'order_item_id' => 0,
                'status'        => 'Rescheduled',
                'created_by'    => auth()->user()->id,
                'user_type'     => OrderStatus::$userTypeUser,
                'created_at'    => now()
            ];
            OrderStatus::create($orderStatus);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Reschedule order error (customer): " . $e->getMessage());
            return CommonHelper::responseError("Something went wrong while rescheduling the order.");
        }

        return CommonHelper::responseSuccess(__('order_rescheduled_successfully'));
    }
}
