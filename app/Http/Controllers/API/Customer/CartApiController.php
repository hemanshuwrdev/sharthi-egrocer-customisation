<?php

namespace App\Http\Controllers\API\Customer;

use App\Helpers\CommonHelper;
use App\Helpers\ProductHelper;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\SellerProduct;
use App\Models\Seller;
use App\Models\AdditionalCharge;
use App\Models\Setting;
use App\Traits\HasTranslations;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Response;

class CartApiController extends Controller
{
    public function getUserCart(Request $request)
    {
        // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — forced false so
        // every '$is_self_pickup' branch below is dead but left in place for reference; uncomment to restore.
        // $is_self_pickup = (isset($request->is_self_pickup) && $request->is_self_pickup == 1) ? true : false;
        $is_self_pickup = false;

        $validationRules = [];
        if (!$is_self_pickup) {
            $validationRules = [
                'latitude' => 'required',
                'longitude' => 'required',
            ];
        }

        $validator = Validator::make($request->all(), $validationRules, [
            'latitude.required' => 'The latitude field is required.',
            'longitude.required' => 'The longitude field is required.'
        ]);
        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        HasTranslations::setOnlyIdAndTranslationsFor(['Product', 'Unit']);

        $type = $request->get('type', '');
        $user_id = $request->user('api-customers') ? $request->user('api-customers')->id : '';

        $variant_ids = explode(",", $request->variant_ids);

        if (ProductHelper::isItemAvailableInUserCart($user_id)) {

            $res = Cart::select(
                'carts.*',
                'products.slug',
                'products.cod_allowed',
                'products.image',
                'products.is_unlimited_stock',
                'products.seller_id',
                'sellers.longitude',
                'sellers.latitude',
                'sellers.city_id'
            )
                ->Join('products', 'carts.product_id', '=', 'products.id')
                ->Join('product_variants', 'carts.product_variant_id', '=', 'product_variants.id')
                ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
                ->where('carts.save_for_later', '=', 0)
                ->where('user_id', '=', $user_id);
            if ($request->variant_ids && $request->variant_ids !== "") {
                $res = $res->whereIn('carts.product_variant_id', $variant_ids);
            }
            $res = $res->orderBy('created_at', 'DESC')

                ->get();

            $seller_ids = array_values(array_unique(array_column($res->toArray(), 'seller_id')));

            $res = $res->makeHidden(['user_id', 'id', 'save_for_later', 'type', 'stock_unit_name', 'image', 'images', 'created_at', 'updated_at', 'seller_id']);

            foreach ($res as $key => $row) {

                if (isset($row->city_id) && $row->city_id != 0 && $row->city_id != "") {
                    if ($is_self_pickup) {
                        $row['is_deliverable'] = 1; // Self-pickup is always "deliverable"
                    } else {
                        if (CommonHelper::isDeliverable($row->city_id, $request->latitude, $request->longitude)) {
                            $row['is_deliverable'] = 1;
                        } else {
                            $row['is_deliverable'] = 0;
                        }
                    }
                } else {
                    $row['is_deliverable'] = 0;
                }

                $item = ProductVariant::select(
                    'product_variants.*',
                    'products.cod_allowed',
                    'products.seller_id as seller_id',
                    'products.name',
                    'products.type as d_type',
                    'products.cod_allowed',
                    'products.slug',
                    'products.image',
                    'products.total_allowed_quantity',
                    DB::raw('(CASE WHEN taxes.percentage != "0" THEN taxes.percentage ELSE "0" END) AS tax_percentage'),
                    DB::raw('(CASE WHEN taxes.title != "" THEN taxes.title ELSE "" END) AS tax_title'),
                    'product_variants.measurement',
                    DB::raw('(select short_code from units where units.id = product_variants.stock_unit_id) AS stock_unit_name')
                )
                    ->Join('products', 'product_variants.product_id', '=', 'products.id')
                    ->leftJoin('taxes', 'products.tax_id', '=', 'taxes.id')
                    ->where('product_variants.id', $row->product_variant_id)
                    ->groupBy('product_variants.id')
                    ->orderBy('created_at', 'DESC')
                    ->first();
                $item = $item->makeHidden(['image', 'created_at', 'updated_at']);

                $res[$key]->type = $item->type;
                $res[$key]->measurement = $item->measurement;

                $taxed = ProductHelper::getTaxableAmount($item->id);

                $res[$key]->discounted_price =  CommonHelper::doubleNumber($taxed->taxable_discounted_price ?? $item->discounted_price);
                $res[$key]->price = CommonHelper::doubleNumber($taxed->taxable_price ?? $item->price);
                $res[$key]->taxable_amount = CommonHelper::doubleNumber($taxed->taxable_amount);

                $cartQty = (int) ($row->qty ?? 0);
                $taxPercentage = (float) ($item->tax_percentage ?? 0);
                $res[$key]->slab_prices = CommonHelper::getSlabPricesForApi($item->id, $taxPercentage);
                $slabTaxed = CommonHelper::getSlabTaxableAmount($item->id, $cartQty);
                $res[$key]->effective_unit_price = CommonHelper::doubleNumber($slabTaxed->taxable_amount ?? $taxed->taxable_amount);

                $res[$key]->stock = $item->stock;
                $res[$key]->images = CommonHelper::getImages($row['id'], $row->product_variant_id);
                $res[$key]->total_allowed_quantity = $item->total_allowed_quantity;
                $res[$key]->name = $item->name;
                $res[$key]->unit_code = $item->unit->short_code ?? '';
                $res[$key]->stock_unit_name = $item->stock_unit_name;
                $res[$key]->status = $item->status;

                $res[$key]->product = Product::find($item->product_id);
                $res[$key]->unit = $item->unit;
            }

            /*Save for Later*/
            if ($request->is_checkout != 1) {
                $result = Cart::with('images')->select(
                    'carts.*',
                    'products.cod_allowed',
                    'products.image',
                    'products.is_unlimited_stock',
                    'sellers.longitude',
                    'sellers.latitude'
                )
                    ->Join('products', 'carts.product_id', '=', 'products.id')
                    ->Join('product_variants', 'carts.product_variant_id', '=', 'product_variants.id')
                    ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
                    ->where('carts.save_for_later', 1)
                    ->where('user_id', '=', $user_id)
                    ->orderBy('created_at', 'DESC')
                    ->get();

                $result = $result->makeHidden(['user_id', 'id', 'save_for_later', 'type', 'stock_unit_name', 'image', 'images', 'created_at', 'updated_at', 'boundary_points']);
                foreach ($result as $key => $rows) {

                    if (isset($rows->max_deliverable_distance) && $rows->max_deliverable_distance != 0 && $rows->max_deliverable_distance != "") {
                        if ($is_self_pickup) {
                            $rows['is_deliverable'] = 1;
                        } else {
                            if (CommonHelper::isDeliverable($rows->max_deliverable_distance, $rows->longitude, $rows->latitude, $request->longitude, $request->latitude)) {
                                $rows['is_deliverable'] = 1;
                            } else {
                                $rows['is_deliverable'] = 0;
                            }
                        }
                    } else {
                        $rows['is_deliverable'] = 0;
                    }

                    $item = ProductVariant::select(
                        'product_variants.*',
                        'products.cod_allowed',
                        'products.seller_id as seller_id',
                        'products.name',
                        'products.type as d_type',
                        'products.cod_allowed',
                        'products.slug',
                        'products.image',
                        'products.total_allowed_quantity',
                        DB::raw('(CASE WHEN taxes.percentage != "0" THEN taxes.percentage ELSE "0" END) AS tax_percentage'),
                        DB::raw('(CASE WHEN taxes.title != "" THEN taxes.title ELSE "" END) AS tax_title'),
                        'product_variants.measurement',
                        DB::raw('(select short_code from units where units.id = product_variants.stock_unit_id) AS stock_unit_name')
                    )
                        ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
                        ->leftJoin('taxes', 'products.tax_id', '=', 'taxes.id')
                        ->where('product_variants.id', '=', $rows->product_variant_id)
                        ->groupBy('product_variants.id')
                        ->orderBy('created_at', 'DESC')
                        ->first();
                    $item = $item->makeHidden(['image', 'created_at', 'updated_at']);

                    $result[$key]->type = $item->type;
                    $result[$key]->measurement = $item->measurement;

                    $taxed = ProductHelper::getTaxableAmount($item->id);

                    $result[$key]->discounted_price =  CommonHelper::doubleNumber($taxed->taxable_discounted_price ?? $item->discounted_price);
                    $result[$key]->price = CommonHelper::doubleNumber($taxed->taxable_price ?? $item->price);
                    $result[$key]->taxable_amount = CommonHelper::doubleNumber($taxed->taxable_amount);

                    $result[$key]->slab_prices = CommonHelper::getSlabPricesForApi($item->id, (float) ($item->tax_percentage ?? 0));

                    $result[$key]->stock = $item->stock;
                    $result[$key]->images = CommonHelper::getImages($rows['id'], $rows->product_variant_id);
                    $result[$key]->total_allowed_quantity = $item->total_allowed_quantity;
                    $result[$key]->name = $item->name;
                    $result[$key]->unit_code = $item->unit->short_code ?? '';
                    $result[$key]->unit = $item->unit;
                    $result[$key]->stock_unit_name = $item->stock_unit_name;
                    $result[$key]->status = $item->status;

                    $result[$key]->product = Product::find($item->product_id);
                }
            }

            if (!empty($res) || !empty($result)) {

                $total = CommonHelper::getCartCount($user_id);
                $sub_total = $total->total_amount;

                $saved_amount =  $total->save_price -  $total->total_amount;
                $saved_amount = ($saved_amount <= 0) ? 0 : $saved_amount;

                if (isset($request->is_checkout) && $request->is_checkout == 1) {

                    $cod_payment_method = Setting::get_value('cod_payment_method');
                    if ($cod_payment_method == 1) {
                        $cod_mode = Setting::get_value('cod_mode');
                        if ($cod_mode == Setting::$codModeGlobal) {
                            $response['cod_allowed'] = 1;
                        } else {
                            $codArray = array_values(array_unique(array_column($res->toArray(), 'cod_allowed')));
                            $cod_allowed = implode(',', $codArray);
                            if ($cod_allowed == 1) {
                                $response['cod_allowed'] = intval($cod_allowed);
                            } else {
                                $response['cod_allowed'] = 0;
                            }
                        }
                    } else {
                        $response['cod_allowed'] = 0;
                    }

                    $response['product_variant_id'] = $total->product_variant_id;
                    $response['quantity'] = $total->quantity;

                    // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
                    // $is_self_pickup_enabled = (isset($request->is_self_pickup) && $request->is_self_pickup == 1) ? true : false;
                    $is_self_pickup_enabled = false;

                    if ($is_self_pickup_enabled) {
                        $data = [
                            'status' => 1,
                            'data' => [
                                'total_delivery_charge' => 0,
                                'delivery_charge' => 0,
                                'delivery_charge_details' => []
                            ]
                        ];
                    } else {
                        // For non-self-pickup orders, latitude and longitude are required
                        if (!isset($request->latitude) || !isset($request->longitude)) {
                            return CommonHelper::responseError('latitude and longitude are required for delivery orders');
                        }
                        $data = CommonHelper::getAllDeliveryCharge($request->latitude, $request->longitude, $seller_ids, $sub_total);
                    }

                    if ($data['status'] == 0) {
                        return CommonHelper::responseError('sorry_we_are_not_delivering_on_selected_address');
                    } else {

                        $free_delivery = $request->get('is_free_delivery', 0);
                        if ($free_delivery == 1) {
                            $data['data']['total_delivery_charge'] = 0;
                            $data['data']['delivery_charge'] = 0;
                            $data['data']['delivery_charge_tax'] = 0;
                        }

                        $one_seller_cart = Setting::where('variable', 'one_seller_cart')->exists() ? (int) Setting::where('variable', 'one_seller_cart')->value('value') : 0;
                        $cartItems = Cart::select('carts.*', 'products.seller_id', 'products.name as product_name', 'sellers.name as seller_name', 'sellers.status as seller_status', 'sellers.self_pickup_mode', 'sellers.door_step_mode', 'sellers.pickup_store_address')
                            ->join('products', 'carts.product_id', '=', 'products.id')
                            ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
                            ->where('carts.save_for_later', '=', 0)
                            ->where('user_id', '=', $user_id)
                            ->get();
                        if ($one_seller_cart == 1 && !$cartItems->isEmpty()) {
                            $firstSeller = $cartItems->first()->seller_id;
                            $allSameSeller = $cartItems->every(function ($item) use ($firstSeller) {
                                return $item->seller_id === $firstSeller;
                            });

                            if (!$allSameSeller) {
                                $data['one_seller_error_code'] = 1;
                                return CommonHelper::responseErrorWithData('all_cart_products_have_not_same_seller', $data);
                            }

                            // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
                            // $seller = $cartItems->first();
                            // if ($seller && $seller->seller_id) {
                            //     $sellerData = Seller::select('id', 'name', 'self_pickup_mode', 'door_step_mode', 'pickup_store_address', 'pickup_latitude', 'pickup_longitude', 'pickup_store_timings', 'mobile')
                            //         ->where('id', $seller->seller_id)
                            //         ->first();
                            //
                            //     if ($sellerData) {
                            //         // Parse pickup store timings JSON
                            //         $pickup_timings = json_decode($sellerData->pickup_store_timings, true);
                            //         $opening_time = $pickup_timings['opening_time'] ?? '';
                            //         $closing_time = $pickup_timings['closing_time'] ?? '';
                            //
                            //         $response['seller_self_pickup'] = [
                            //             'seller_id' => $sellerData->id,
                            //             'seller_name' => $sellerData->name,
                            //             'seller_mobile' => $sellerData->mobile,
                            //             'pickup_store_address' => $sellerData->pickup_store_address,
                            //             'pickup_latitude' => $sellerData->pickup_latitude,
                            //             'pickup_longitude' => $sellerData->pickup_longitude,
                            //             'opening_time' => $opening_time,
                            //             'closing_time' => $closing_time,
                            //         ];
                            //     }
                            // }
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

                        // Calculate total amount (subtotal + delivery charge)
                        $total_amount = $total->total_amount + $data['data']['total_delivery_charge'];

                        /* check for subscription */
                        $userSubscription = CommonHelper::getUserActiveSubscription($user_id);

                        if ($userSubscription) {
                            $shouldApplyFreeDelivery = false;

                            // If free_delivery_above is null, apply free delivery regardless of amount
                            if ($userSubscription->free_delivery_above === null) {
                                $shouldApplyFreeDelivery = true;
                            } elseif ($sub_total >= $userSubscription->free_delivery_above) {
                                // Check based on subtotal instead of total_amount
                                $shouldApplyFreeDelivery = true;
                            }

                            if ($shouldApplyFreeDelivery) {
                                $data['data']['total_delivery_charge'] = 0;
                                $data['data']['delivery_charge'] = 0;
                                $data['data']['delivery_charge_tax'] = 0;

                                $total_amount = $total->total_amount;
                            }
                        }

                        // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
                        // $global_self_pickup_mode = Setting::where('variable', 'self_pickup_mode')->value('value') ?? 0;
                        //
                        // $seller_self_pickup_mode = 0;
                        // $seller_door_step_mode = 1;
                        // if (!empty($cartItems)) {
                        //     $firstCartItem = $cartItems->first();
                        //     if ($firstCartItem) {
                        //         $seller_self_pickup_mode = $firstCartItem->self_pickup_mode ?? 0;
                        //         $seller_door_step_mode = $firstCartItem->door_step_mode ?? 1;
                        //     }
                        // }
                        //
                        // $response['self_pickup_mode'] = ($global_self_pickup_mode == 1 && $seller_self_pickup_mode == 1) ? 1 : 0;
                        // $response['doorstep_delivery_mode'] = 0;
                        //
                        // if ($global_self_pickup_mode == 0) {
                        //     // When global self pickup is OFF, doorstep delivery becomes compulsory
                        //     $response['doorstep_delivery_mode'] = 1;
                        // } elseif ($global_self_pickup_mode == 1 && $seller_self_pickup_mode == 0 && $seller_door_step_mode == 1) {
                        //     // Case 3: Global ON, Seller OFF, Doorstep ON
                        //     $response['doorstep_delivery_mode'] = 1;
                        // } elseif ($global_self_pickup_mode == 1 && $seller_self_pickup_mode == 1 && $seller_door_step_mode == 1) {
                        //     // Case 5: Global ON, Seller ON, Doorstep ON
                        //     $response['doorstep_delivery_mode'] = 1;
                        // }
                        $response['self_pickup_mode'] = 0;
                        $response['doorstep_delivery_mode'] = 1;

                        if (isset($request->promocode_id) && $request->promocode_id && $request->promocode_id != "") {

                            $promocode_details = CommonHelper::getValidatedPromoCode($request->promocode_id, $sub_total, $user_id);
                            $response['promocode_details'] = $promocode_details;
                            $total_amount = $total_amount - $promocode_details['discount'];
                        }

                        $response['delivery_charge'] = $data['data'];
                        $response['total_amount'] = $total_amount;
                    }
                }
                $user_balance = CommonHelper::getUserWalletBalance($user_id);

                $response['user_balance'] = $user_balance;
                $response['sub_total'] = $sub_total;
                $response['saved_amount'] = $saved_amount;

                if ($request->is_checkout != 1) {
                    $response['cart'] = $res;
                    $response['save_for_later'] = $result;

                    // Self-pickup removed for Sarthi (all orders go out via driver/vehicle dispatch) — kept commented for reference.
                    // $global_self_pickup_mode = Setting::where('variable', 'self_pickup_mode')->value('value') ?? 0;
                    //
                    // $seller_self_pickup_mode = 0;
                    // $seller_door_step_mode = 1;
                    // if (!empty($res)) {
                    //     $cartItems = Cart::select('carts.*', 'products.seller_id', 'sellers.self_pickup_mode', 'sellers.door_step_mode')
                    //         ->join('products', 'carts.product_id', '=', 'products.id')
                    //         ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
                    //         ->where('carts.save_for_later', '=', 0)
                    //         ->where('user_id', '=', $user_id)
                    //         ->first();
                    //
                    //     if ($cartItems) {
                    //         $seller_self_pickup_mode = $cartItems->self_pickup_mode ?? 0;
                    //         $seller_door_step_mode = $cartItems->door_step_mode ?? 1;
                    //     }
                    // }
                    //
                    // $response['self_pickup_mode'] = ($global_self_pickup_mode == 1 && $seller_self_pickup_mode == 1) ? 1 : 0;
                    //
                    // $response['doorstep_delivery_mode'] = 0;
                    //
                    // if ($global_self_pickup_mode == 0) {
                    //     $response['doorstep_delivery_mode'] = 1;
                    // } elseif ($global_self_pickup_mode == 1 && $seller_self_pickup_mode == 0 && $seller_door_step_mode == 1) {
                    //     $response['doorstep_delivery_mode'] = 1;
                    // } elseif ($global_self_pickup_mode == 1 && $seller_self_pickup_mode == 1 && $seller_door_step_mode == 1) {
                    //     $response['doorstep_delivery_mode'] = 1;
                    // }
                    $response['self_pickup_mode'] = 0;
                    $response['doorstep_delivery_mode'] = 1;
                }

                if (isset($request->is_checkout) && $request->is_checkout == 1) {
                    $applicableType = $is_self_pickup ? 'self_pickup' : 'order';
                    $charges = AdditionalCharge::withTranslation()
                        ->where('is_active', true)
                        ->whereJsonContains('applicable_on', $applicableType)
                        ->orderBy('sort_order')
                        ->get();

                    $additional_charges = [];
                    $additional_charges_total = 0;
                    $baseAmount = $sub_total;
                    foreach ($charges as $charge) {
                        if ($charge->charge_type === 'percentage') {
                            $amount = round($baseAmount * floatval($charge->amount) / 100, 2);
                        } else {
                            $amount = floatval($charge->amount);
                        }
                        $additional_charges_total += $amount;
                        $additional_charges[] = [
                            'title' => (string) $charge->translated('title'),
                            'amount' => (string) $amount,
                            'charge_type' => $charge->charge_type,
                            'is_refundable' => $charge->is_refundable,
                        ];
                    }
                    if (isset($response['total_amount'])) {
                        $response['total_amount'] += $additional_charges_total;
                    }
                    $response['additional_charges'] = $additional_charges;
                } else {
                    $response['additional_charges'] = [];
                }

                return CommonHelper::responseWithData($response, $total->cart_items_count);
            } else {
                return CommonHelper::responseError('no_items_found_in_users_cart');
            }
        } else {
            return CommonHelper::responseError('no_items_found_in_users_cart');
        }
    }

    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required',
            'product_variant_id' => 'required',
            'qty' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $product_id = $request->product_id;
        $variant_id = $request->product_variant_id;
        $qty = $request->get('qty', '');
        $user = auth()->user();
        $one_seller_cart_exist =  (int)Setting::where('variable', 'one_seller_cart')->exists();
        $one_seller_cart = ($one_seller_cart_exist = Setting::where('variable', 'one_seller_cart')->exists()) ? (int) Setting::where('variable', 'one_seller_cart')->value('value') : 0;

        if ($one_seller_cart == 1) {
            $cart = Cart::select('carts.*', 'products.seller_id')
                ->join('products', 'carts.product_id', '=', 'products.id')
                ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
                ->where('carts.save_for_later', '=', 0)
                ->where('user_id', '=', $user->id)
                ->get();

            $product = Product::find($product_id);

            if (!$product) {
                // Handle the case where the product with the specified product_id is not found
                return CommonHelper::responseError('product_not_found');
            }

            $seller_id = $product->seller_id;

            if (!$cart->isEmpty()) {
                $firstSeller = $cart->first()->seller_id;

                // Check if all sellers are the same
                $allSameSeller = $cart->every(function ($item) use ($firstSeller) {
                    return $item->seller_id === $firstSeller;
                });

                if ($allSameSeller) {
                    $commonSellerId = $firstSeller;

                    $commonSeller = Seller::find($commonSellerId);
                    if ($seller_id === $commonSellerId) {
                    } else {
                        // $seller_id does not match the common seller ID
                        $data['one_seller_error_code'] = 1;
                        return CommonHelper::responseErrorWithData('seller_id_does_not_match', $data);
                    }
                } else {
                    $data['one_seller_error_code'] = 1;
                    return CommonHelper::responseErrorWithData('all_cart_products_have_not_same_seller', $data);
                }
            }
        }

        if (ProductHelper::isItemAvailable($product_id, $variant_id)) {
            if (ProductHelper::isItemAvailableWithStock($product_id, $variant_id, $qty)) {

                $variant = ProductVariant::select('*', DB::raw("(SELECT is_unlimited_stock FROM products as p WHERE p.id = pv.product_id) as is_unlimited_stock"))
                    ->from('product_variants as pv')->where('id', $variant_id)->first();

                if ($variant) {

                    if (($variant->is_unlimited_stock == 1 || $variant->stock > 0) && $variant->status == 1) {

                        if (ProductHelper::isItemAvailableInUserCart($user->id, $variant_id)) {
                            $cart = Cart::where('user_id', $user->id)
                                ->where('product_variant_id', $variant_id)->first();

                            // check for total allowed quantity
                            $total_quantity = Cart::where('user_id', $user->id)
                                ->where('product_id', $product_id)
                                ->where('save_for_later', 0)
                                ->sum('qty');

                            if ($total_quantity) {
                                $total_allowed_quantity = Product::where('id', $product_id)->pluck('total_allowed_quantity')->first();

                                $temp = Cart::where('user_id', $user->id)->where('product_variant_id', $variant_id)->pluck('qty')->first();

                                $total_quantity = $total_quantity - $temp;
                                $total_quantity = $total_quantity + $qty;

                                if ($total_quantity > $total_allowed_quantity) {
                                    return CommonHelper::responseError('maximum_products_quantity_limit_reached_message');
                                }
                            }

                            if ($cart) {

                                $cart->qty = $qty;
                                $cart->save_for_later = 0;
                                $cart->save();

                                $total = CommonHelper::getCartCount($user->id);
                                $sub_total = $total->total_amount;
                                $saved_amount =  $total->save_price -  $total->total_amount;
                                $saved_amount = ($saved_amount <= 0) ? 0 : $saved_amount;
                                return Response::json(array('status' => 1, 'message' => 'item_updated_in_users_cart_successfully', 'cart_items_count' => $total->cart_items_count, 'cart_total_qty' => $total->cart_total_qty, 'sub_total' => $sub_total, 'saved_amount' => $saved_amount));
                            } else {

                                return CommonHelper::responseError('item_not_found');
                            }
                        } else {

                            if ($user->status == 1) {

                                $total_allowed_quantity = Product::where('id', $product_id)->value('total_allowed_quantity');
                                if ($total_allowed_quantity && $qty > $total_allowed_quantity) {
                                    return CommonHelper::responseError('maximum_products_quantity_limit_reached_message');
                                }

                                /* if item not found in user's cart add it */
                                $data = array(
                                    'user_id' => $user->id,
                                    'product_id' => $product_id,
                                    'product_variant_id' => $variant_id,
                                    'qty' => $qty,
                                    'created_at' => date('Y-m-d H:i:s')
                                );
                                $insert = Cart::insert($data);
                                if ($insert) {
                                    $total = CommonHelper::getCartCount($user->id);
                                    $sub_total = $total->total_amount;
                                    $saved_amount =  $total->save_price -  $total->total_amount;
                                    $saved_amount = ($saved_amount <= 0) ? 0 : $saved_amount;
                                    return Response::json(array('status' => 1, 'message' => 'item_added_to_users_cart_successfully', 'cart_items_count' => $total->cart_items_count, 'cart_total_qty' => $total->cart_total_qty, 'sub_total' => $sub_total, 'saved_amount' => $saved_amount));
                                } else {
                                    return CommonHelper::responseError('something_went_wrong');
                                }
                            } else {
                                return CommonHelper::responseError('not_allowed_to_add_to_cart_as_your_account_is_de_activated');
                            }
                        }
                    } else {
                        return CommonHelper::responseError('opps_stock_is_not_available');
                    }
                } else {
                    return CommonHelper::responseError('no_such_item_available');
                }
            } else {
                return CommonHelper::responseError('opps_stock_is_not_available');
            }
        } else {
            return CommonHelper::responseError('no_such_item_available');
        }
    }

    public function removeFromCart(Request $request)
    {
        $user_id = auth()->user()->id;
        $variant_id = $request->get('product_variant_id', '');
        if (ProductHelper::isItemAvailableInUserCart($user_id, $variant_id)) {
            $cart = Cart::where('user_id', $user_id)->where('save_for_later', 0);

            if (!empty($variant_id)) {
                $cart->where('product_variant_id', $variant_id);
                $cart = $cart->delete();
                if ($cart) {

                    $total = CommonHelper::getCartCount($user_id);
                    $sub_total = $total->total_amount;
                    $saved_amount =  $total->save_price -  $total->total_amount;
                    $saved_amount = ($saved_amount <= 0) ? 0 : $saved_amount;

                    return Response::json(array('status' => 1, 'message' => 'item_removed_from_users_cart_successfully', 'cart_items_count' => $total->cart_items_count, 'cart_total_qty' => $total->cart_total_qty, 'sub_total' => $sub_total, 'saved_amount' => $saved_amount));
                } else {
                    return CommonHelper::responseError('no_product_found');
                }
            } else if (isset($request->is_remove_all) && $request->is_remove_all == 1) {
                $cart = $cart->delete();
                if ($cart) {
                    return CommonHelper::responseSuccess('all_items_removed_from_users_cart_successfully');
                } else {
                    return CommonHelper::responseError('no_product_found');
                }
            } else {
                return CommonHelper::responseError('no_items_found_in_users_cart');
            }
        } else {
            return CommonHelper::responseError('no_items_found_in_users_cart');
        }
    }

    public function addToSaveForLater(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required',
            'product_variant_id' => 'required',
            'qty' => 'required|numeric|min:1',
            'save_for_later' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $user_id = auth()->user()->id;
        $product_id = $request->product_id;
        $variant_id = $request->product_variant_id;

        $save_for_later = $request->save_for_later;

        $qty = $request->get('qty', '');

        $save_for_later = $request->save_for_later;

        if (!empty($user_id) && !empty($product_id)) {
            if (!empty($variant_id)) {
                if (ProductHelper::isItemAvailable($product_id, $variant_id)) {

                    if (ProductHelper::isItemAvailableInUserCart($user_id, $variant_id)) {
                        $cart = Cart::where('user_id', $user_id)->where('product_variant_id', $variant_id);
                        if (empty($qty) || $qty == 0) {
                            $cart = $cart->delete();
                            if ($cart) {
                                return CommonHelper::responseSuccess('item_removed_users_cart_due_to_0_quantity');
                            } else {
                                return CommonHelper::responseError('something_went_wrong');
                            }
                        }
                        /* if item found in user's cart update it */
                        $data = array(
                            'qty' => $qty,
                            'save_for_later' => $save_for_later
                        );
                        $cart = $cart->first();

                        $cart->save_for_later = $save_for_later;
                        $cart->qty = $qty;
                        $cart->save();
                    } else {
                        /* if item not found in user's cart add it */
                        $data = array(
                            'user_id' => $user_id,
                            'product_id' => $product_id,
                            'product_variant_id' => $variant_id,
                            'qty' => $qty,
                            'save_for_later' => $save_for_later
                        );
                        $cart = new Cart();
                        $cart->user_id = $user_id;
                        $cart->product_id = $product_id;
                        $cart->product_variant_id = $variant_id;
                        $cart->qty = $qty;
                        $cart->save_for_later = $save_for_later;
                        $cart->save();
                    }

                    if ($cart) {
                        $x = 0;
                        $total_amount = 0;
                        $result = Cart::with('images')->select('carts.*', 'products.image')
                            ->Join('products', 'carts.product_id', '=', 'products.id')
                            ->where('save_for_later', $save_for_later)->where('user_id', $user_id)->where('product_variant_id', $variant_id)->get();
                        $result = $result->makeHidden(['image', 'created_at', 'updated_at', 'deleted_at']);


                        $res1 = Cart::select('qty', 'product_variant_id')->where('save_for_later', $save_for_later)->where('user_id', $user_id)->get();
                        foreach ($res1 as $row1) {
                            $result1 = ProductVariant::select('price', 'discounted_price')->where('id', $row1->product_variant_id)->get();
                            $price = 0;
                            foreach ($result1 as $result2) {
                                $price = $result2->discounted_price == 0 ? $result2->price * $row1->qty : $result2->discounted_price * $row1->qty;
                            }
                            $total_amount += $price;
                        }

                        foreach ($result as $key => $rows) {
                            $item = ProductVariant::with('images')
                                ->select(
                                    'product_variants.*',
                                    'products.seller_id as seller_id',
                                    'products.name',
                                    'products.type as d_type',
                                    'products.cod_allowed',
                                    'products.slug',
                                    'products.image',
                                    'products.total_allowed_quantity',
                                    DB::raw('(CASE WHEN taxes.percentage != "0" THEN taxes.percentage ELSE "0" END) AS tax_percentage'),
                                    DB::raw('(CASE WHEN taxes.title != "" THEN taxes.title ELSE "" END) AS tax_title'),
                                    'product_variants.measurement',
                                    DB::raw('(select short_code from units where units.id = product_variants.stock_unit_id) AS stock_unit_name')
                                )
                                ->leftJoin('products', 'product_variants.product_id', '=', 'products.id')
                                ->leftJoin('taxes', 'products.tax_id', '=', 'taxes.id')
                                ->where('product_variants.id', '=', $rows->product_variant_id)
                                ->groupBy('product_variants.id')
                                ->orderBy('created_at', 'DESC')
                                ->first();
                            $item = $item->makeHidden(['image', 'created_at', 'updated_at', 'deleted_at']);
                            $result[$key]->type = $item->type;
                            $result[$key]->measurement = $item->measurement;


                            $taxed = ProductHelper::getTaxableAmount($item->id);

                            $result[$key]->discounted_price = CommonHelper::doubleNumber($taxed->taxable_discounted_price ?? $item->discounted_price);
                            $result[$key]->price = CommonHelper::doubleNumber($taxed->taxable_price ?? $item->price);
                            $result[$key]->taxable_amount = CommonHelper::doubleNumber($taxed->taxable_amount);

                            $cartQty = (int) ($rows->qty ?? 0);
                            $result[$key]->slab_prices = CommonHelper::getSlabPricesForApi($item->id, (float) ($item->tax_percentage ?? 0));
                            $slabTaxed = CommonHelper::getSlabTaxableAmount($item->id, $cartQty);
                            $result[$key]->effective_unit_price = CommonHelper::doubleNumber($slabTaxed->taxable_amount ?? $taxed->taxable_amount);

                            $result[$key]->stock = $item->stock;
                            $result[$key]->images = CommonHelper::getImages($rows->id, $rows->product_variant_id);
                            $result[$key]->total_allowed_quantity = $item->total_allowed_quantity;
                            $result[$key]->unit_code = $item->unit->short_code ?? '';
                            $result[$key]->unit = $item->unit;

                            $result[$key]->product = Product::find($item->product_id);

                            $x++;
                        }

                        $total = CommonHelper::getCartCount($user_id);
                        $sub_total = $total->total_amount;
                        $saved_amount =  $total->save_price -  $total->total_amount;
                        $saved_amount = ($saved_amount <= 0) ? 0 : $saved_amount;

                        if ($save_for_later == 1) {
                            return Response::json(array('status' => 1, 'message' => 'item_added_to_save_for_later_successfully', 'cart_items_count' => $total->cart_items_count, 'cart_total_qty' => $total->cart_total_qty, 'sub_total' => $sub_total, 'saved_amount' => $saved_amount, 'data' => $result));
                        } else {
                            return Response::json(array('status' => 1, 'message' => 'item_remove_from_save_for_later_successfully', 'cart_items_count' => $total->cart_items_count, 'cart_total_qty' => $total->cart_total_qty, 'sub_total' => $sub_total, 'saved_amount' => $saved_amount, 'data' => $result));
                        }
                    } else {
                        return CommonHelper::responseError('something_went_wrong');
                    }
                } else {
                    return CommonHelper::responseError('no_such_item_available');
                }
            } else {
                return CommonHelper::responseError('please_choose_at_least_one_item');
            }
        } else {
            return CommonHelper::responseError('please_pass_all_the_fields');
        }
    }
    public function getGuestCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude'           => 'required',
            'longitude'          => 'required',
            'seller_product_ids' => 'required',
            'quantities'         => 'required',
        ]);

        if ($validator->fails()) {
            return CommonHelper::responseError($validator->errors()->first());
        }

        $sellerProductIds = array_filter(array_map('intval', explode(',', $request->seller_product_ids)));
        $quantities       = array_map('floatval', explode(',', $request->quantities));

        if (count($sellerProductIds) !== count($quantities)) {
            return CommonHelper::responseError('variant_and_quantity_does_not_match');
        }

        $sellerProducts = SellerProduct::with([
            'masterProductVariant.masterProduct.brand',
            'masterProductVariant.masterProduct.parentCompany',
            'masterProductVariant.masterProduct.category',
            'masterProductVariant.unit',
            'masterProductVariant.secondaryUnit',
            'seller',
            'slabPrices',
        ])
            ->whereIn('id', $sellerProductIds)
            ->where('status', 1)
            ->get()
            ->keyBy('id');

        if ($sellerProducts->isEmpty()) {
            return CommonHelper::responseError('no_items_found_in_users_cart');
        }

        $cart     = [];
        $subTotal = 0.0;
        $mrpTotal = 0.0;

        foreach (array_values($sellerProductIds) as $index => $spId) {
            $sp  = $sellerProducts[$spId] ?? null;
            if (!$sp) continue;

            $qty = $quantities[$index] ?? 0;
            $mpv = $sp->masterProductVariant;
            $mp  = $mpv ? $mpv->masterProduct : null;

            $resolved           = RetailerCatalogApiController::resolveUnitPrice($sp->id, $qty);
            $effectiveUnitPrice = $resolved['price'];

            $subTotal += round($effectiveUnitPrice * $qty, 4);
            $mrpTotal += round((float) $sp->mrp * $qty, 4);

            $image = $mpv ? ($mpv->image ?: ($mp ? $mp->image : null)) : null;

            $cart[] = [
                'seller_product_id'    => $sp->id,
                'product_variant_id'   => $mpv ? $mpv->id : null,
                'product_id'           => $mp ? $mp->id : null,
                'master_product_name'  => $mp ? $mp->name : null,
                'brand'                => $mp && $mp->brand ? $mp->brand->name : null,
                'brand_id'             => $mp ? $mp->brand_id : null,
                'parent_company'       => $mp && $mp->parentCompany ? $mp->parentCompany->name : null,
                'category'             => $mp && $mp->category ? $mp->category->name : null,
                'category_id'          => $mp ? $mp->category_id : null,
                'sku'                  => $mpv ? $mpv->sku : null,
                'unit'                 => $mpv && $mpv->unit ? $mpv->unit->name : null,
                'secondary_unit'       => $mpv && $mpv->secondaryUnit ? $mpv->secondaryUnit->name : null,
                'secondary_unit_value' => $mpv ? $mpv->secondary_unit_value : null,
                'weight'               => $mpv ? $mpv->weight : null,
                'image'                => $image,
                'image_url'            => $image ? asset('storage/' . $image) : null,
                'mrp'                  => (float) $sp->mrp,
                'selling_price'        => (float) $sp->selling_price,
                'discounted_price'     => $sp->discounted_price !== null ? (float) $sp->discounted_price : null,
                'stock'                => (float) $sp->stock,
                'slab_prices'          => $sp->slabPrices->map(fn($s) => [
                    'id'      => $s->id,
                    'min_qty' => $s->min_qty,
                    'max_qty' => $s->max_qty,
                    'price'   => (float) $s->price,
                ])->values(),
                'effective_unit_price' => CommonHelper::doubleNumber($effectiveUnitPrice),
                'qty'                  => $qty,
                'seller_id'            => $sp->seller_id,
                'seller_name'          => $sp->seller ? ($sp->seller->store_name ?: $sp->seller->name) : null,
            ];
        }

        if (empty($cart)) {
            return CommonHelper::responseError('no_items_found_in_users_cart');
        }

        $savedAmount = max(0, round($mrpTotal - $subTotal, 4));

        $charges              = AdditionalCharge::withTranslation()
            ->where('is_active', true)
            ->whereJsonContains('applicable_on', 'order')
            ->orderBy('sort_order')
            ->get();

        $additionalCharges      = [];
        $additionalChargesTotal = 0.0;
        foreach ($charges as $charge) {
            $amount = $charge->charge_type === 'percentage'
                ? round($subTotal * floatval($charge->amount) / 100, 2)
                : floatval($charge->amount);
            $additionalChargesTotal += $amount;
            $additionalCharges[] = [
                'title'         => (string) $charge->translated('title'),
                'amount'        => (string) $amount,
                'charge_type'   => $charge->charge_type,
                'is_refundable' => $charge->is_refundable,
            ];
        }

        $response = [
            'sub_total'          => CommonHelper::doubleNumber($subTotal),
            'saved_amount'       => CommonHelper::doubleNumber($savedAmount),
            'additional_charges' => $additionalCharges,
        ];

        if ($request->is_checkout != 1) {
            $response['cart'] = $cart;
        }

        return CommonHelper::responseWithData($response, count($cart));
    }
    public function BulkAddToCartItems(Request $request)
    {

        $variant_ids = explode(",", $request->variant_ids);
        $quantities = explode(",", $request->quantities);
        $user = auth()->user();
        $one_seller_cart = Setting::where('variable', 'one_seller_cart')->exists() ? (int) Setting::where('variable', 'one_seller_cart')->value('value') : 0;
        //check all variants are same selelr or not
        if (isset($one_seller_cart) && $one_seller_cart == 1) {
            $sellerIds = ProductVariant::join('products', 'product_variants.product_id', '=', 'products.id')
                ->whereIn('product_variants.id', explode(",", $request->variant_ids))
                ->pluck('products.seller_id')
                ->unique();
            if ($sellerIds->count() > 1) {
                return CommonHelper::responseError('all_cart_products_have_not_same_seller');
            }
        }

        if (count($variant_ids) !== count($quantities)) {
            return CommonHelper::responseError('mismatched_variants_and_quantities');
        }

        $cartItems = Cart::select('carts.*', 'products.seller_id', 'products.category_id')
            ->join('products', function ($join) {
                $join->on('carts.product_id', '=', 'products.id')
                    ->where('products.status', 1)
                    ->where('products.is_approved', 1);
            })
            ->leftJoin('sellers', 'products.seller_id', '=', 'sellers.id')
            ->join('categories', function ($join) {
                $join->on('products.category_id', '=', 'categories.id')
                    ->where('categories.status', 1);
            })
            ->where('carts.save_for_later', 0)
            ->where('carts.user_id', $user->id)
            ->get();

        if ($one_seller_cart == 1 && !$cartItems->isEmpty()) {
            $firstSeller = $cartItems->first()->seller_id;
            $allSameSeller = $cartItems->every(function ($item) use ($firstSeller) {
                return $item->seller_id === $firstSeller;
            });

            if (!$allSameSeller) {
                $data['one_seller_error_code'] = 1;
                return CommonHelper::responseErrorWithData(('all_cart_products_have_not_same_seller'), $data);
            }
        }
        $available_products = [];
        $out_of_stock_products = [];
        $available_products_names = '';
        $out_of_stock_products_names = '';
        foreach ($variant_ids as $index => $variant_id) {
            $qty = $quantities[$index];
            $variant = ProductVariant::select('*', DB::raw("(SELECT is_unlimited_stock FROM products as p WHERE p.id = pv.product_id) as is_unlimited_stock"))
                ->from('product_variants as pv')->where('id', $variant_id)->first();

            if (!$variant) {
                return CommonHelper::responseError('no_such_item_available');
            }

            $product_id = $variant->product_id;
            $product = Product::find($product_id);

            if (!$product) {
                return CommonHelper::responseError('product_not_found');
            }

            if ($one_seller_cart == 1 && !$cartItems->isEmpty()) {
                $commonSellerId = $cartItems->first()->seller_id;
                if ($product->seller_id !== $commonSellerId) {
                    $data['one_seller_error_code'] = 1;
                    return CommonHelper::responseErrorWithData('seller_id_does_not_match', $data);
                }
            }

            if (ProductHelper::isItemAvailableWithStock($product_id, $variant_id, $qty)) {
                $available_products[] = [
                    'product_id'   => $product_id,
                    'variant_id'   => $variant_id,
                    'product_name' => $product->name, // Include product name
                ];
                $available_products_names = implode(', ', array_column($available_products, 'product_name'));
                if (ProductHelper::isItemAvailableInUserCart($user->id, $variant_id)) {
                    $cart = Cart::where('user_id', $user->id)
                        ->where('product_variant_id', $variant_id)->first();

                    if ($cart) {
                        $total_quantity = Cart::where('user_id', $user->id)
                            ->where('product_id', $product_id)
                            ->where('save_for_later', 0)
                            ->sum('qty');

                        $total_allowed_quantity = Product::where('id', $product_id)->pluck('total_allowed_quantity')->first();
                        $current_quantity = Cart::where('user_id', $user->id)->where('product_variant_id', $variant_id)->pluck('qty')->first();
                        $total_quantity = $total_quantity - $current_quantity + $qty;

                        if ($total_quantity > $total_allowed_quantity) {
                            return CommonHelper::responseError('total_allowed_quantity_for_this_product_is' . $total_allowed_quantity);
                        }

                        $cart->qty = $qty;
                        $cart->save_for_later = 0;
                        $cart->save();
                    } else {
                        return CommonHelper::responseError('item_not_found');
                    }
                } else {
                    if ($user->status == 1) {
                        $total_allowed_quantity = Product::where('id', $product_id)->pluck('total_allowed_quantity')->first();
                        if ($total_allowed_quantity && $qty > $total_allowed_quantity) {
                            return CommonHelper::responseError('total_allowed_quantity_for_this_product_is' . $total_allowed_quantity . '!');
                        }

                        $data = [
                            'user_id' => $user->id,
                            'product_id' => $product_id,
                            'product_variant_id' => $variant_id,
                            'qty' => $qty
                        ];

                        Cart::insert($data);
                    } else {
                        return CommonHelper::responseError('not_allowed_to_add_to_cart_as_your_account_is_de_activated');
                    }
                }
            } else {
                $out_of_stock_products[] = ['product_id' => $product_id, 'variant_id' => $variant_id, 'product_name' => $product->name];
                $out_of_stock_products_names = implode(', ', array_column($out_of_stock_products, 'product_name'));
            }
        }

        $total = CommonHelper::getCartCount($user->id);
        $sub_total = $total->total_amount;
        $saved_amount = $total->save_price - $total->total_amount;
        $saved_amount = ($saved_amount <= 0) ? 0 : $saved_amount;
        if (!empty($available_products_names)) {

            return Response::json([
                'status' => 1,
                'message' => 'items_added_to_users_cart_successfully',
                'cart_items_count' => $total->cart_items_count,
                'cart_total_qty' => $total->cart_total_qty,
                'sub_total' => $sub_total,
                'saved_amount' => $saved_amount,
                'available_products_names' => $available_products_names,
                'out_of_stock_products_names' => $out_of_stock_products_names,
            ]);
        } else {
            return Response::json([
                'status' => 0,
                'message' => 'items_not_available',
                'cart_items_count' => $total->cart_items_count,
                'cart_total_qty' => $total->cart_total_qty,
                'sub_total' => $sub_total,
                'saved_amount' => $saved_amount,
                'available_products_names' => $available_products_names,
                'out_of_stock_products_names' => $out_of_stock_products_names,
            ]);
        }
    }
    public function getCartCount()
    {
        $userId = auth()->id(); // Example for logged-in user
        $cartCount = Cart::where('user_id', $userId)->count();
        return Response::json([
            'cart_count' => $cartCount,
        ]);
    }
}
