
<h1 style="line-height: 24px; margin-bottom:15px; font-size: 20px;" >{{ ucwords($subject) }}  </h1>

@php
    $currency = \App\Models\Setting::get_value('currency') ?? '$';
@endphp

@if(isset($assign) && $assign == true)

    @if(isset($seller) && !empty($seller))

        <p style="line-height: 24px; margin-bottom:15px;">
            Dear, {{ $seller->name }}
        </p>

        <p style="line-height: 24px; margin-bottom: 15px;">
            You order, #{{ $order->id }} is just assigned a delivery boy.
        </p>

        <h1 style="line-height: 24px; margin-bottom:15px; font-size: 20px;"> Delivery Boy details </h1>

        <table border="1" width="100%" cellpadding="0" cellspacing="0" bgcolor="ffffff">
            <tr>
                <td align="left"> Name </td>
                <td align="left"> {{$deliveryBoy->name}} </td>

                <td align="left"> Date of Birth </td>
                <td align="left"> {{$deliveryBoy->dob}} </td>
            </tr>
            <tr>
                <td align="left"> Email </td>
                <td align="left"> {{$deliveryBoy->email}} </td>

                <td align="left"> Mobile </td>
                <td align="left"> {{$deliveryBoy->mobile}} </td>
            </tr>
        </table><br>
    @else
        <p style="line-height: 24px; margin-bottom:15px;">
            Dear, {{ $deliveryBoy->name }}
        </p>
        <p style="line-height: 24px; margin-bottom: 15px;">
          You have just assigned new order, #{{ $order->id }}.
        </p>
    @endif

    <p style="line-height: 24px; margin-bottom: 15px;">
        Estimated delivery time is {{ $order->delivery_time }}
    </p>

    <p style="line-height: 24px; margin-bottom: 15px;">
        <strong>
            Delivery address :-
        </strong><br>
        {{ $order->address }}
    </p>

    <a href="{{ $redirect_url }}" style="color: #ffffff; text-decoration: none;">
        <table border="0" align="center" width="180" cellpadding="0" cellspacing="0" bgcolor="#37a279" style="margin-bottom:20px;">
            <tr>
                <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
            </tr>
            <tr>
                <td align="center" style="color: #ffffff; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 22px; letter-spacing: 2px;">
                    <!-- main section button -->
                    <div style="line-height: 22px;">
                        Check it out
                    </div>
                </td>
            </tr>
            <tr>
                <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
            </tr>
        </table>
    </a>

@else
    @if($user_type == 0)
        {{--here customer mail--}}

        @if($order->active_status == \App\Models\OrderStatusList::$received)

            <p style="line-height: 24px; margin-bottom:15px;">
                Dear, {{ $user->name }}
            </p>

            <p style="line-height: 24px; margin-bottom: 15px;">
                Your order has been received.
            </p>
            <p style="line-height: 24px;margin-bottom:15px;">
                This notification is just a friendly reminder (not a bill or a second charge) that on {{ $order->created_at }} you placed an order from
                {{ $app_name }}.
                The charge will appear on your bill.
                This is just a reminder to help you recognise the charge.
            </p>

            {{-- Product details table: scrollable wrapper for small screens, inline styles for email clients --}}
            <p style="font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">Product Details:</p>
            <div style="max-width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch;">
                <table style="width: 100%; max-width: 100%; min-width: 320px; border-collapse: collapse; border: 1px solid #ddd; font-size: 14px;">
                    <thead>
                    <tr style="background-color: #f5f5f5;">
                        <th style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">Sr No.</th>
                        <th style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">Name</th>
                        <th style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">Unit</th>
                        <th style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">Price</th>
                        <th style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">Tax {{ $currency }} (%)</th>
                        <th style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">Qty</th>
                        <th style="padding: 10px 8px; text-align: center; border: 1px solid #ddd;">SubTotal ( {{ $currency }} )</th>
                    </tr>
                    </thead>
                    <tbody>
                    @php
                        $total_tax_amount = 0;
                        $total_quantity = 0;
                        $total_sub_total = 0;
                        $order_items = $order->items;
                    @endphp
                    @foreach($order_items as $index => $item)
                        <tr style="background-color: #fff;">
                            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">{{ $index+1 }}</td>
                            <td style="padding: 8px; text-align: center; border: 1px solid #ddd; word-break: break-word;">{{ $item->product_name }}</td>
                            <td style="padding: 8px; text-align: center; border: 1px solid #ddd; word-break: break-word;">{{ $item->variant_name }}</td>
                            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">{{ $item->discounted_price > 0 ? $item->discounted_price : $item->price }}</td>
                            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">{{ $item->tax_amount. "  (" .$item->tax_percentage."%)" }}</td>
                            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">{{ $item->quantity }}</td>
                            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">{{ $item->sub_total }}</td>
                            @php
                                $total_tax_amount = $total_tax_amount + $item->quantity;
                                $total_quantity = $total_quantity + $item->quantity;
                                $total_sub_total = $total_sub_total + $item->sub_total;
                            @endphp
                        </tr>
                    @endforeach
                    </tbody>
                    <tfoot>
                    <tr style="background-color: #f5f5f5; font-weight: 600;">
                        <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
                        <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
                        <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
                        <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
                        <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">Total</td>
                        <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">{{ $total_quantity }}</td>
                        <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">{{ $total_sub_total }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>

            {{-- Order summary table: full width, responsive --}}
            <p style="margin: 20px 0 8px 0;"><b>Payment Method : </b> {{ strtoupper($order->payment_method) }}</p>
            <table style="width: 100%; max-width: 100%; border-collapse: collapse; border: 1px solid #ddd; font-size: 14px;">
                <tbody>
                <tr style="background-color: #fff;">
                    <th style="padding: 10px 8px; text-align: left; border: 1px solid #ddd; width: 60%;">Total Order Price ({{ $currency }})</th>
                    <td style="padding: 10px 8px; text-align: right; border: 1px solid #ddd;">{{ $order->remaining_total }}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                    <th style="padding: 10px 8px; text-align: left; border: 1px solid #ddd;">Delivery Charge ({{ $currency }})</th>
                    <td style="padding: 10px 8px; text-align: right; border: 1px solid #ddd;">{{ $order->delivery_charge }}</td>
                </tr>
                <tr style="background-color: #fff;">
                    <th style="padding: 10px 8px; text-align: left; border: 1px solid #ddd;">Discount {{ $currency }} (%)</th>
                    @php
                        $discount_in_rupees = 0;
                        if ( $order->discount > 0) {
                            $discounted_amount = $order->remaining_total * $order->discount / 100;
                            $final_total = $order->remaining_total - $discounted_amount;
                            $discount_in_rupees = $order->remaining_total - $final_total;
                        }
                    @endphp
                    <td style="padding: 10px 8px; text-align: right; border: 1px solid #ddd;">{{ '- ' . $discount_in_rupees . ' (' . $order->discount . '%)'}}</td>
                </tr>
                <tr style="background-color: #f9f9f9;">
                    <th style="padding: 10px 8px; text-align: left; border: 1px solid #ddd;">Promo ({{ $order->promo_code }}) Discount ({{ $currency }})</th>
                    <td style="padding: 10px 8px; text-align: right; border: 1px solid #ddd;">{{ '- ' . $order->promo_discount }}</td>
                </tr>
                <tr style="background-color: #fff;">
                    <th style="padding: 10px 8px; text-align: left; border: 1px solid #ddd;">Wallet Used ({{ $currency }})</th>
                    <td style="padding: 10px 8px; text-align: right; border: 1px solid #ddd;">{{ '- ' . $order->wallet_balance }}</td>
                </tr>
                <tr style="background-color: #f0f0f0; font-weight: 600;">
                    <th style="padding: 10px 8px; text-align: left; border: 1px solid #ddd;">Final Total ({{ $currency }})</th>
                    <td style="padding: 10px 8px; text-align: right; border: 1px solid #ddd;">{{ '= ' . ceil($order->remaining_final)}}</td>
                </tr>
                </tbody>
            </table>

            <p style="line-height: 24px; margin-bottom: 15px;">
                We would like to take this opportunity to thank you for your business and look forward to serving you in the future.
            </p>
        @elseif(in_array($order->active_status, array(
                                                \App\Models\OrderStatusList::$processed,
                                                \App\Models\OrderStatusList::$shipped,
                                                \App\Models\OrderStatusList::$outForDelivery
                                             )
                        )
            )
            <p style="line-height: 24px; margin-bottom:15px;">
                Dear, {{ $user->name }}
            </p>

            <p style="line-height: 24px; margin-bottom: 15px;">
                Your order has been {{ $status_name }}.
            </p>

            <p style="line-height: 24px; margin-bottom: 15px;">
                This notification is just a friendly reminder (not a bill or a second charge) that on {{ $order->created_at }} you placed an order from
                {{ $app_name }}.
                The charge will appear on your bill.
                This is just a reminder to help you recognise the charge.
            </p>
            <p style="line-height: 24px; margin-bottom: 15px;">
                Order summary
                #{{ $order->id }}
                Final Total - {{ $currency }} {{ $order->remaining_final }}
                We would like to take this opportunity to thank you for your business and look forward to serving you in the future.
            </p>
        @elseif($order->active_status == \App\Models\OrderStatusList::$delivered)
            <p style="line-height: 24px; margin-bottom:15px;">
                Dear, {{ $user->name }}
            </p>

            <p style="line-height: 24px; margin-bottom: 15px;">
                Your order has been {{ $status_name }}.
            </p>

            <p style="line-height: 24px; margin-bottom: 15px;">
                This notification is just a friendly reminder (not a bill or a second charge) that on {{ $order->created_at }} you placed an order from
                {{ $app_name }}.
                The charge will appear on your bill.
            </p>

            {{--@include('invoice')--}}

        @elseif(in_array($order->active_status, array(
                                                \App\Models\OrderStatusList::$cancelled,
                                                \App\Models\OrderStatusList::$returned,
                                             )
                        )
        )
            @php
                $isReturned = ($order->active_status == \App\Models\OrderStatusList::$returned);
                $isCancelledCod = ($order->active_status == \App\Models\OrderStatusList::$cancelled && strtoupper($order->payment_method ?? '') == 'COD');
                $showRefundAmount = $isReturned || ($order->active_status == \App\Models\OrderStatusList::$cancelled && !$isCancelledCod);
            @endphp

            <p style="line-height: 24px; margin-bottom:15px;">
                Dear, {{ $user->name }}
            </p>

            <p style="line-height: 24px; margin-bottom: 15px;">
                Sorry to see your order #{{ $order->id }} belonging to {{ $user->name }} has been
                {{ $status_name }}. @if($showRefundAmount) If your order is prepaid, you will get refund within few business days. @endif
            </p>
        @endif
    @else
        {{--here customer mail--}}
        @if($role == \App\Models\Role::$roleSeller)

            <p style="line-height: 24px; margin-bottom:15px;">
                Dear, {{ $seller->name }}
            </p>

            @if($order->active_status == \App\Models\OrderStatusList::$received)
                <p style="line-height: 24px; margin-bottom:15px;">
                    You have just received new order, #{{ $order->id }}
                </p>
            @else
                <p style="line-height: 24px; margin-bottom:15px;">
                    {{ $subject }}
                </p>
            @endif

            @php
                $redirect_url = (isset($order->id)) ? url('/seller/orders/view/'.$order->id): url('/seller/orders');
            @endphp
        @elseif($role == \App\Models\Role::$roleDeliveryBoy)

            <p style="line-height: 24px; margin-bottom:15px;">
                Dear, {{ $deliveryBoy->name }}
            </p>

            <p style="line-height: 24px; margin-bottom:15px;">
                You have just assigned new order, #{{ $order->id }}
            </p>

            <p style="line-height: 24px; margin-bottom:15px;">

                Estimated delivery time is {{ $order->delivery_time }}
            </p>

            <p style="line-height: 24px; margin-bottom:15px;">
                {{ $subject }}
            </p>

            @php
                $redirect_url = (isset($order->id)) ? url('/delivery_boy/orders/view/'.$order->id): url('/delivery_boy/orders');
            @endphp
        @else

            <p style="line-height: 24px; margin-bottom:15px;">
                Dear, {{ $admin->name }}
            </p>

            @if($order->active_status == \App\Models\OrderStatusList::$received)
                <p style="line-height: 24px; margin-bottom:15px;">
                    You have just received new order, #{{ $order->id }}
                </p>
            @else
                <p style="line-height: 24px; margin-bottom:15px;">
                    {{ $subject }}
                </p>
            @endif
            @php
                $redirect_url = (isset($order->id)) ? url('/orders/view/'.$order->id): url('/orders');
            @endphp
        @endif

        <a href="{{ $redirect_url }}" style="color: #ffffff; text-decoration: none;">
            <table border="0" align="center" width="180" cellpadding="0" cellspacing="0" bgcolor="#37a279" style="margin-bottom:20px;">
                <tr>
                    <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                </tr>
                <tr>
                    <td align="center" style="color: #ffffff; font-size: 14px; font-family: 'Work Sans', Calibri, sans-serif; line-height: 22px; letter-spacing: 2px;">
                        <!-- main section button -->
                        <div style="line-height: 22px;">
                            Check it out
                        </div>
                    </td>
                </tr>
                <tr>
                    <td height="10" style="font-size: 10px; line-height: 10px;">&nbsp;</td>
                </tr>
            </table>
        </a>
    @endif
@endif
