@php
    $app_name = \App\Models\Setting::get_value('app_name');
    if($app_name == "" || $app_name == null){
        $app_name = "Sarthi";
    }

    $logo = \App\Models\Setting::get_value('logo') ?? "";
    $logo_url = '';
    if($logo !== ""){
        $logo_url = url('/').'/storage/'.$logo;
    }else{
        $logo_url = asset('images/favicon.png');
    }

    $currency = \App\Models\Setting::get_value('currency') ?? '₹';

    $seller = \App\Models\Seller::with('city')->find($order->seller_id);
    if (!$seller) {
        $seller = new \stdClass();
        $seller->name = $order->seller_name ?? 'N/A';
        $seller->store_name = $order->store_name ?? 'N/A';
        $seller->street = $order->seller_formatted_address ?? '';
        $seller->city_name = $order->seller_place_name ?? '';
        $seller->state = '';
        $seller->tax_number = '';
        $seller->pan_number = '';
    } else {
        $seller->city_name = $seller->city->name ?? ($seller->place_name ?? '');
    }

    $retailer = \DB::table('retailer_profiles')->where('user_id', $order->user_id)->first();
    $customerName = $retailer->party_name ?? ($retailer->shop_name ?? ($order->user_name ?? ''));
    $customerAddress = $order->address ?: ($order->order_address ?: ($retailer->address ?? ''));
    $customerMobile = $order->mobile ?: ($order->order_mobile ?: ($retailer->mobile ?? ''));
    $customerGst = $retailer->gst_no ?? ($order->customer_gst ?? '');

    $loadingSlip = null;
    if (!empty($order->loading_slip_id)) {
        $loadingSlip = \App\Models\LoadingSlip::find($order->loading_slip_id);
    }
    $shipmentNo = $loadingSlip ? $loadingSlip->slip_no : 'N/A';
@endphp
<html>
    <head>
        <title>Invoice Order - {{ $app_name }}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: 'Inter', sans-serif;
                color: #111;
                font-size: 11px;
                background: #fff;
                margin: 0;
                padding: 0;
            }
            .udaan-invoice {
                box-sizing: border-box;
            }
            .udaan-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 12px;
            }
            .udaan-table th,
            .udaan-table td {
                border: 1px solid #777;
                padding: 6px 8px;
                font-size: 11px;
                vertical-align: top;
                text-align: left;
            }
            .udaan-table th {
                background-color: #e2e3e5;
                color: #000;
                font-weight: bold;
                border-bottom: 2px solid #555;
            }
            .udaan-totals-table {
                width: 320px;
                border-collapse: collapse;
            }
            .udaan-totals-table td {
                padding: 5px 10px;
                font-size: 11px;
                border: none;
            }
            .udaan-totals-table tr.grand-total td {
                background-color: #343a40;
                color: #fff;
                font-weight: bold;
                font-size: 13px;
            }
        </style>
    </head>
    <body>
        <div class="udaan-invoice">
            <!-- Header Table -->
            <table width="100%" style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; border-collapse: collapse;">
                <tr>
                    <td width="60%" style="vertical-align: middle; border: none; padding: 0;">
                        <table style="border: none; border-collapse: collapse; padding: 0; margin: 0;">
                            <tr>
                                <td style="border: none; padding: 0 10px 0 0; vertical-align: middle;"><img src="{{ $logo_url }}" height="38" style="max-height: 38px; width: auto;" alt="Logo"></td>
                                <td style="border: none; vertical-align: middle; padding: 0;"><span style="color: #000; font-size: 28px; font-weight: 900; letter-spacing: -1.5px; line-height: 1; font-family: sans-serif;">{{ $app_name }}</span></td>
                            </tr>
                        </table>
                    </td>
                    <td width="40%" style="text-align: right; vertical-align: top; border: none; padding: 0;">
                        <table align="right" style="border: none; border-collapse: collapse; font-size: 11px; font-weight: bold; color: #111; padding: 0; margin: 0;">
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Invoice ID:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">INV/{{ date('Y', strtotime($order->orders_created_at ?? $order->created_at)) }}/{{ str_pad($order->order_id, 6, '0', STR_PAD_LEFT) }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Invoice Date:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">{{ date('Y-m-d', strtotime($order->orders_created_at ?? $order->created_at)) }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Order ID:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">#{{ $order->order_id }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Shipment No:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">{{ $shipmentNo }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Page No:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">1 / 1</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Address columns -->
            <table width="100%" style="border-collapse: collapse; margin-bottom: 12px; border-bottom: 1.5px solid #000; padding-bottom: 12px;">
                <tr>
                    <td width="45%" style="vertical-align: top; border: none; padding: 0 15px 0 0;">
                        <h4 style="margin: 0 0 6px 0; font-size: 11px; font-weight: 900; color: #000; text-transform: uppercase; font-family: sans-serif;">SHIP FROM:</h4>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;"><strong>{{ $seller->store_name }}</strong></p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">{{ $seller->street }}</p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">{{ $seller->city_name }}{{ $seller->state ? ', ' . $seller->state : '' }}</p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">Place of Supply: {{ strtoupper($seller->city_name) }}</p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">Supply Type: INTRA_STATE</p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">GSTIN: {{ $seller->tax_number }}</p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">PAN: {{ $seller->pan_number }}</p>
                    </td>
                    <td width="40%" style="vertical-align: top; border: none; padding: 0 10px 0 0;">
                        <h4 style="margin: 0 0 6px 0; font-size: 11px; font-weight: 900; color: #000; text-transform: uppercase; font-family: sans-serif;">BILL TO/SHIP TO:</h4>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;"><strong>{{ $customerName }}</strong></p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">{{ $customerAddress }}</p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">Mobile: {{ $customerMobile }}</p>
                        <p style="margin: 2px 0; line-height: 1.35; color: #222;">GSTIN: {{ $customerGst }}</p>
                    </td>
                    <td width="15%" style="vertical-align: top; text-align: right; border: none; padding: 0;">
                        <div style="display: inline-block; text-align: right;">
                            @if (isset($seller) && !empty($seller->upi_id))
                                @php
                                    $upiId = trim($seller->upi_id);
                                    $upiName = trim(!empty($seller->upi_name) ? $seller->upi_name : (!empty($seller->store_name) ? $seller->store_name : $app_name));
                                    $amountToPay = floatval(isset($order->remaining_final) ? $order->remaining_final : ($order->final_total ?? 0));
                                    $amount = number_format($amountToPay, 2, '.', '');
                                    $note = 'Payment for Order #' . ($order->order_id ?? ($order->id ?? ''));
                                    $upiUrl = "upi://pay?pa=" . rawurlencode($upiId) . "&pn=" . rawurlencode($upiName) . "&am=" . $amount . "&cu=INR&tn=" . rawurlencode($note);
                                    $qrCodeSvg = \SimpleSoftwareIO\QrCode\Facades\QrCode::format('svg')->size(65)->margin(0)->generate($upiUrl);
                                    $qrCodeBase64 = 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg);
                                @endphp
                                <a href="{{ $upiUrl }}" style="text-decoration: none; display: inline-block;">
                                    <img src="{{ $qrCodeBase64 }}" width="65" height="65" style="border: 1px solid #ccc; padding: 3px; background: #fff;" alt="UPI QR Code" />
                                </a>
                            @else
                                <div style="border: 1px solid #ccc; padding: 3px; background: #fff; width: 65px; height: 65px; display: flex; align-items: center; justify-content: center; font-size: 6px; font-weight: bold; color: red; text-align: center; box-sizing: border-box; line-height: 1.2;">
                                    UPI ID NOT SET
                                </div>
                            @endif
                            <span style="font-size: 7px; color: #666; margin-top: 4px; font-weight: bold; text-align: center; display: block; letter-spacing: 0.5px;">SCAN CODE</span>
                        </div>
                    </td>
                </tr>
            </table>

            <!-- Items Table -->
            <table class="udaan-table">
                <thead>
                    <tr>
                        <th style="width: 35%;">Description</th>
                        <th style="width: 45px; text-align: center;">Qty</th>
                        <th style="width: 70px; text-align: right;">Rate</th>
                        <th style="width: 60px; text-align: right;">Disc. Rate</th>
                        <th style="width: 80px; text-align: right;">Net Taxable Amt.</th>
                        <th style="width: 80px; text-align: center;">Tax Type</th>
                        <th style="width: 70px; text-align: right;">Tax</th>
                        <th style="width: 80px; text-align: right;">Total Amt.</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $totalBillQty = 0;
                        $totalNetTaxable = 0;
                        $totalTaxAmount = 0;
                        $totalBillAmt = 0;
                    @endphp
                    @foreach ($order_items as $itemIndex => $item)
                        @php
                            $pv = \DB::table('product_variants as pv')
                                ->select('pv.secondary_unit_value', 'u2.short_code as secondary_unit_name')
                                ->leftJoin('units as u2', 'pv.secondary_unit_id', '=', 'u2.id')
                                ->where('pv.id', $item->product_variant_id)
                                ->first();
                            $secondary_unit_value = $pv->secondary_unit_value ?? null;
                            $secondary_unit_name = $pv->secondary_unit_name ?? null;

                            $pkgFormat = '';
                            $boxQty = '';
                            if (isset($secondary_unit_value) && $secondary_unit_value > 1) {
                                $pkgFormat = (int) $secondary_unit_value . ' * ' . $item->variant_name;
                                $boxes = floor($item->quantity / $secondary_unit_value);
                                $loose = $item->quantity % $secondary_unit_value;
                                $secName = $secondary_unit_name ?: 'Box';

                                if ($boxes > 0 && $loose > 0) {
                                    $boxQty = $boxes . ' ' . $secName . ' + ' . $loose . ' nos';
                                } elseif ($boxes > 0) {
                                    $boxQty = $boxes . ' ' . $secName;
                                } else {
                                    $boxQty = $loose . ' nos';
                                }
                            }

                            $hsn = '';
                            if (!empty($item->master_product_variant_id)) {
                                $hsn = \DB::table('master_products as mp')
                                    ->join('master_product_variants as mpv', 'mp.id', '=', 'mpv.master_product_id')
                                    ->where('mpv.id', $item->master_product_variant_id)
                                    ->value('mp.hsn');
                            }
                            $hsn = $hsn ?: 'N/A';

                            $taxPct = $item->tax_percentage > 0 ? $item->tax_percentage : 5;
                            $cgstPct = $taxPct / 2;
                            $sgstPct = $taxPct / 2;

                            $itemTotal = $item->sub_total;
                            $netTaxable = $itemTotal / (1 + $taxPct / 100);
                            $itemTax = $itemTotal - $netTaxable;
                            $cgstAmt = $itemTax / 2;
                            $sgstAmt = $itemTax / 2;

                            $rate = ($item->discounted_price != 0 && $item->discounted_price != "") ? $item->discounted_price : $item->price;
                            $discountRate = 0.0;

                            $totalBillQty += $item->quantity;
                            $totalNetTaxable += $netTaxable;
                            $totalTaxAmount += $itemTax;
                            $totalBillAmt += $itemTotal;
                        @endphp
                        <tr>
                            <td>
                                <strong>{{ $item->product_name }}</strong>
                                @if ($pkgFormat)
                                    <br><span style="color: #111; font-weight: bold; font-size: 10px;">Format: {{ $pkgFormat }}</span>
                                @endif
                                @if ($boxQty)
                                    <span style="color: #df2029; font-weight: bold; margin-left: 10px; font-size: 10px;">({{ $boxQty }})</span>
                                @endif
                                <br><span style="color: #555; font-size: 8px;">Variant: {{ $item->variant_name }} | HSN: {{ $hsn }}</span>
                            </td>
                            <td style="text-align: center; font-weight: bold;">
                                {{ number_format($item->quantity, 1) }}
                            </td>
                            <td style="text-align: right;">{{ $currency }}{{ number_format($rate, 2) }}</td>
                            <td style="text-align: right;">{{ $currency }}{{ number_format($discountRate, 2) }}</td>
                            <td style="text-align: right;">{{ $currency }}{{ number_format($netTaxable, 2) }}</td>
                            <td style="text-align: center; font-size: 8.5px; line-height: 1.25;">
                                CGST({{ number_format($cgstPct, 1) }}%)<br>
                                SGST({{ number_format($sgstPct, 1) }}%)<br>
                                <strong>Tax</strong>
                            </td>
                            <td style="text-align: right; font-size: 8.5px; line-height: 1.25;">
                                {{ number_format($cgstAmt, 2) }}<br>
                                {{ number_format($sgstAmt, 2) }}<br>
                                <strong>{{ number_format($itemTax, 2) }}</strong>
                            </td>
                            <td style="text-align: right; font-weight: bold;">{{ $currency }}{{ number_format($itemTotal, 2) }}</td>
                        </tr>
                    @endforeach
                    <!-- Total row -->
                    <tr style="font-weight: bold; background-color: #f2f2f2;">
                        <td>Total</td>
                        <td style="text-align: center;">{{ number_format($totalBillQty, 1) }}</td>
                        <td></td>
                        <td></td>
                        <td style="text-align: right;">{{ $currency }}{{ number_format($totalNetTaxable, 2) }}</td>
                        <td></td>
                        <td style="text-align: right;">{{ $currency }}{{ number_format($totalTaxAmount, 2) }}</td>
                        <td style="text-align: right;">{{ $currency }}{{ number_format($totalBillAmt, 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Totals Area -->
            <table width="100%" style="border-collapse: collapse; margin-bottom: 15px;">
                <tr>
                    <td width="50%" style="border: none; padding: 0;"></td>
                    <td width="50%" align="right" style="border: none; padding: 0;">
                        <table class="udaan-totals-table" align="right">
                            <tr>
                                <td align="left" style="color: #555;">Taxable Amount</td>
                                <td align="right" style="font-weight: 500;">{{ $currency }}{{ number_format($totalNetTaxable, 2) }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555;">Total Discount</td>
                                <td align="right" style="font-weight: 500;">
                                    @php
                                        $totalDiscount = $order->discount + $order->promo_discount;
                                    @endphp
                                    {{ $currency }}{{ number_format($totalDiscount, 2) }}
                                </td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555;">Net Taxable Amount</td>
                                <td align="right" style="font-weight: bold;">{{ $currency }}{{ number_format($totalNetTaxable, 2) }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555;">Total Tax</td>
                                <td align="right" style="font-weight: bold;">{{ $currency }}{{ number_format($totalTaxAmount, 2) }}</td>
                            </tr>
                            @if ($order->delivery_charge > 0)
                                <tr>
                                    <td align="left" style="color: #555;">Delivery Charge</td>
                                    <td align="right" style="font-weight: bold;">{{ $currency }}{{ number_format($order->delivery_charge, 2) }}</td>
                                </tr>
                            @endif
                            <tr class="grand-total">
                                <td align="left" style="padding: 6px 10px; font-weight: bold; background-color: #343a40; color: #fff;">Grand Total</td>
                                <td align="right" style="padding: 6px 10px; font-weight: bold; background-color: #343a40; color: #fff;">{{ $currency }}{{ number_format($order->remaining_final, 2) }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Advertisement Banner Table -->
            <table width="100%" style="border: 1px solid #f8a5c2; background-color: #ffeef2; padding: 10px 15px; margin-bottom: 15px; border-radius: 4px; border-collapse: collapse;">
                <tr>
                    <td style="border: none; padding: 0;">
                        <h3 style="margin: 0; font-size: 15px; color: #df2029; font-weight: 900; letter-spacing: 0.5px; font-family: sans-serif;">{{ strtoupper($app_name) }}</h3>
                        <p style="margin: 2px 0 0 0; font-size: 11px; color: #444; font-weight: bold;">Everyday Essentials, Excellent Quality, at Right Price - ORDER NOW</p>
                    </td>
                </tr>
            </table>

            <!-- Footer Declarations -->
            <table width="100%" style="font-size: 9.5px; color: #444; line-height: 1.35; border-top: 1px solid #aaa; padding-top: 8px; margin-top: 12px; border-collapse: collapse;">
                <tr>
                    <td width="70%" style="vertical-align: top; border: none; padding: 0;">
                        <p style="margin: 0;"><strong>DECLARATION:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. This is a computer generated invoice.</p>
                    </td>
                    <td width="30%" style="text-align: right; vertical-align: bottom; border: none; min-width: 150px; padding: 0;">
                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; margin-bottom: 2px; color: #555; font-style: italic; font-weight: bold;">
                            {{ $seller->name }}
                        </div>
                        <div style="border-top: 1px solid #000; width: 120px; text-align: center; padding-top: 3px; font-weight: bold; font-size: 8px; display: inline-block;">
                            Authorised Signatory
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>
