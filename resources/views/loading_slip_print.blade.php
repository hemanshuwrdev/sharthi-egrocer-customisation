<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading Slip</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
            font-size: 13px;
            line-height: 1.4;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }

        .logo-title h1 {
            font-size: 24px;
            margin: 0 0 5px 0;
            color: #1a1a1a;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .logo-title p {
            margin: 0;
            color: #666;
            font-size: 12px;
        }

        .slip-meta {
            text-align: right;
        }

        .slip-meta h2 {
            font-size: 20px;
            margin: 0 0 5px 0;
            color: #007bff;
        }

        .slip-meta p {
            margin: 2px 0;
        }

        .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }

        .card {
            border: 1px solid #ddd;
            border-radius: 6px;
            padding: 15px;
            background: #fdfdfd;
        }

        .card h3 {
            margin: 0 0 10px 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
            font-size: 14px;
            color: #555;
            text-transform: uppercase;
        }

        .card-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }

        .card-row span:first-child {
            color: #666;
            font-weight: 500;
        }

        .card-row span:last-child {
            font-weight: bold;
            color: #111;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px 10px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
            color: #444;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 11px;
        }

        tr:nth-child(even) td {
            background-color: #fafafa;
        }

        .section-title {
            font-size: 15px;
            font-weight: bold;
            margin: 25px 0 10px 0;
            padding-left: 8px;
            border-left: 4px solid #111;
            color: #333;
            text-transform: uppercase;
        }

        .right {
            text-align: right;
        }

        .center {
            text-align: center;
        }

        .badge {
            background: #e2e3e5;
            color: #383d41;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
        }

        .footer-sig {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            padding: 0 30px;
        }

        .sig-box {
            text-align: center;
            width: 200px;
        }

        .sig-line {
            border-top: 1px solid #333;
            margin-top: 70px;
            padding-top: 5px;
            font-weight: bold;
            color: #555;
        }

        .distributor-header {
            text-align: center;
            margin-bottom: 5px;
        }

        .distributor-name {
            font-size: 16px;
            font-weight: bold;
            color: #000;
            margin: 0;
        }

        .distributor-address {
            font-size: 11px;
            color: #222;
            margin: 3px 0 0 0;
            line-height: 1.3;
        }

        .distributor-title {
            font-size: 15px;
            font-weight: bold;
            text-decoration: underline;
            text-transform: uppercase;
            margin: 10px 0 0 0;
            letter-spacing: 0.5px;
        }

        .distributor-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
            padding-bottom: 4px;
            margin-bottom: 4px;
        }

        .transport-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            font-weight: bold;
            border-bottom: 2px solid #000;
            padding-bottom: 6px;
            margin-bottom: 15px;
        }

        @media print {
            @page {
                size: auto;
                margin: 0mm;
            }
            body {
                padding: 15mm;
                font-size: 12px;
            }

            .no-print {
                display: none;
            }

            .card {
                background: none;
            }

            .party-bill-page {
                page-break-before: always;
                border-top: none !important;
                padding-top: 0 !important;
                margin-top: 0 !important;
            }
        }

        .party-bill-page {
            border-top: 2px dashed #bbb;
            padding-top: 30px;
            margin-top: 30px;
        }

        /* Udaan Invoice high-fidelity replication styling */
        .udaan-invoice {
            background: #fff;
            color: #111;
            padding: 20px;
            font-size: 11px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, Arial, sans-serif;
            border: 1px solid #777;
            margin-top: 20px;
            box-sizing: border-box;
            position: relative;
        }

        .udaan-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }

        .udaan-logo-container {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .udaan-logo-circle {
            background-color: #df2029;
            color: #fff;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 900;
            font-family: 'Times New Roman', serif;
        }

        .udaan-logo-text {
            color: #000;
            font-size: 28px;
            font-weight: 900;
            letter-spacing: -1.5px;
            line-height: 1;
        }

        .udaan-meta-grid {
            display: grid;
            grid-template-columns: auto auto;
            column-gap: 20px;
            row-gap: 4px;
            font-size: 11px;
        }

        .udaan-meta-label {
            color: #555;
            font-weight: bold;
        }

        .udaan-meta-val {
            font-weight: bold;
            color: #111;
        }

        .udaan-address-columns {
            display: grid;
            grid-template-columns: 1.5fr 1.2fr 80px;
            gap: 15px;
            border-bottom: 1.5px solid #000;
            padding-bottom: 12px;
            margin-bottom: 12px;
        }

        .udaan-address-col h4 {
            margin: 0 0 6px 0;
            font-size: 11px;
            font-weight: 900;
            color: #000;
            text-transform: uppercase;
        }

        .udaan-address-col p {
            margin: 2px 0;
            line-height: 1.35;
            color: #222;
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
            text-transform: none;
            border-bottom: 2px solid #555;
        }

        .udaan-totals-area {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 15px;
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

        .udaan-ad-banner {
            border: 1px solid #f8a5c2;
            background: linear-gradient(90deg, #ffeef2, #fff9f4);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            margin-bottom: 15px;
            border-radius: 4px;
        }

        .udaan-ad-banner .ad-text h3 {
            margin: 0;
            font-size: 15px;
            color: #df2029;
            font-weight: 900;
            letter-spacing: 0.5px;
        }

        .udaan-ad-banner .ad-text p {
            margin: 2px 0 0 0;
            font-size: 11px;
            color: #444;
            font-weight: bold;
        }

        .udaan-footer-rules {
            font-size: 9.5px;
            color: #444;
            line-height: 1.35;
            border-top: 1px solid #aaa;
            padding-top: 8px;
            margin-top: 12px;
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>

<body>

    <div class="distributor-header">
        <div class="distributor-name">
            @if (isset($seller) && $seller->store_name)
                {{ strtoupper($seller->store_name) }} ({{ date('Y') }}-{{ date('y', strtotime('+1 year')) }})
            @else
                {{ strtoupper($app_name) }} ({{ date('Y') }}-{{ date('y', strtotime('+1 year')) }})
            @endif
        </div>
        <div class="distributor-address">
            @if (isset($seller) && $seller->formatted_address)
                {{ strtoupper($seller->formatted_address) }}
            @elseif(isset($seller) && $seller->street)
                {{ strtoupper($seller->street) }}{{ $seller->city_name ? ', ' . strtoupper($seller->city_name) : '' }}
            @endif
        </div>
        <div class="distributor-title">Loading Slip</div>
    </div>

    <div class="distributor-meta">
        <div>Date : {{ $slip->created_at->format('d-M-y') }}</div>
        <div>Slip No: {{ $slip->slip_no }}</div>
        <div>Page 1</div>
    </div>
    <div class="transport-meta">
        <div>Vehicle: {{ $slip->vehicle->name ?? 'N/A' }} ({{ $slip->vehicle->vehicle_number ?? 'N/A' }})</div>
        <div>Driver: {{ $slip->driver->name ?? 'N/A' }} @if(isset($slip->driver->mobile)) - {{ $slip->driver->mobile }} @endif</div>
        <div>Total Weight: {{ number_format($slip->total_weight, 2) }} kg</div>
    </div>


    <table>
        <thead>
            <tr>
                <th style="width: 60px;" class="center">Sr No</th>
                <th>Item Name</th>
                <th style="width: 250px;" class="center">Quantity</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($itemSummary as $index => $item)
                @php
                    $displayName = strtoupper($item->product_name);
                    if (isset($item->secondary_unit_value) && $item->secondary_unit_value > 1) {
                        $displayName .=
                            ' ' . (int) $item->secondary_unit_value . ' X ' . strtoupper($item->variant_name);
                    } else {
                        $displayName .= ' ' . strtoupper($item->variant_name);
                    }

                    $boxQty = '';
                    if (isset($item->secondary_unit_value) && $item->secondary_unit_value > 1) {
                        $boxes = floor($item->qty / $item->secondary_unit_value);
                        $loose = $item->qty % $item->secondary_unit_value;
                        $secName = $item->secondary_unit_name ?: 'Box';

                        if ($boxes > 0 && $loose > 0) {
                            $boxQty = $boxes . ' ' . $secName . ' + ' . $loose . ' nos';
                        } elseif ($boxes > 0) {
                            $boxQty = $boxes . ' ' . $secName;
                        } else {
                            $boxQty = $loose . ' nos';
                        }

                        $boxQty .= ' (Total ' . $item->qty . ' nos)';
                    } else {
                        $boxQty = $item->qty . ' nos';
                    }
                @endphp
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td style="font-size: 13px; font-weight: bold; color: #111;">{{ $displayName }}</td>
                    <td class="center" style="font-size: 13px; font-weight: bold; color: #df2029;">{{ $boxQty }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 25px;"></div>
    <table>
        <thead>
            <tr>
                <th style="width: 60px;" class="center">Sr No</th>
                <th>Name of Party</th>
                <th style="width: 120px;" class="center">Bill No.</th>
                <th style="width: 150px;" class="right">Bill Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($orders as $index => $order)
                <tr>
                    <td class="center" style="font-size: 14px; font-weight: bold; color: #df2029;">{{ $index + 1 }}
                    </td>
                    <td>
                        <strong>{{ $order->party_name ?: ($order->shop_name ?: $order->user_name) }}</strong>
                        @if ($order->city_zone)
                            <span style="color: #666; font-size: 10px; font-weight: bold; margin-left: 10px;">(Zone:
                                {{ $order->city_zone }})</span>
                        @endif
                        <br><span
                            style="font-size: 10.5px; color: #555; font-weight: normal;">{{ $order->customer_address }}</span>
                    </td>
                    <td class="center">#{{ $order->id }}</td>
                    <td class="right" style="font-weight: bold; font-size: 13px;">
                        ₹{{ number_format($order->final_total, 2) }}</td>
                </tr>
            @endforeach
            <tr>
                <td></td>
                <td class="right" style="font-weight: bold; font-size: 13px;">Total Number Of Bill And Amount :</td>
                <td class="center" style="font-weight: bold; font-size: 13px;">{{ count($orders) }}</td>
                <td class="right" style="font-weight: bold; font-size: 13px;">₹{{ number_format($orders->sum('final_total'), 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer-sig">
        <div class="sig-box">
            <div class="sig-line">Warehouse In-charge</div>
        </div>
        <div class="sig-box">
            <div class="sig-line">Sign</div>
        </div>
        <div class="sig-box">
            <div class="sig-line">Driver / Delivery Boy</div>
        </div>
    </div>

    <!-- 3. Party Name Wise Bills (1 page per party) in high-fidelity Udaan style -->
    @foreach ($orders as $orderIndex => $order)
        @if (!$order->is_rescheduled)
        <div class="party-bill-page">
            <div class="udaan-invoice">
                <!-- Header -->
                <div class="udaan-header">
                    <div class="udaan-logo-container">
                        @php
                            $logo_url = '';
                            if (isset($logo) && $logo !== '') {
                                $logo_url = url('/') . '/storage/' . $logo;
                            } else {
                                $logo_url = asset('images/favicon.png');
                            }
                        @endphp
                        <img src="{{ $logo_url }}" height="38" style="max-height: 38px; width: auto;" alt="Logo">
                        <div>
                            <span class="udaan-logo-text">{{ $app_name }}</span>
                            <div
                                style="font-size: 8px; color: #666; font-weight: bold; margin-top: -3px; letter-spacing: 0.5px;">
                              </div>
                        </div>
                    </div>

                    <div class="udaan-meta-grid">
                        <span class="udaan-meta-label">Invoice ID:</span>
                        <span
                            class="udaan-meta-val">INV/{{ date('Y') }}/{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</span>

                        <span class="udaan-meta-label">Invoice Date:</span>
                        <span class="udaan-meta-val">{{ $order->created_at->format('Y-m-d') }}</span>

                        <span class="udaan-meta-label">Order ID:</span>
                        <span class="udaan-meta-val">#{{ $order->id }}</span>

                        <span class="udaan-meta-label">Shipment No:</span>
                        <span class="udaan-meta-val">{{ $slip->slip_no }}</span>

                        <span class="udaan-meta-label">Page No:</span>
                        <span class="udaan-meta-val">{{ $orderIndex + 1 }} / {{ count($orders) }}</span>
                    </div>
                </div>

                <!-- Address Grid -->
                <div class="udaan-address-columns">
                    <!-- Ship From -->
                    <div class="udaan-address-col">
                        <h4>Ship From:</h4>
                        <p><strong>{{ $seller->store_name }}</strong></p>
                        <p>{{ $seller->street }}</p>
                        <p>{{ $seller->city_name }}, {{ $seller->state }}</p>
                        <p>Place of Supply: {{ strtoupper($seller->city_name) }}</p>
                        <p>Supply Type: INTRA_STATE</p>
                        <p>GSTIN: {{ $seller->tax_number }}</p>
                        <p>PAN: {{ $seller->pan_number }}</p>
                    </div>

                    <!-- Bill to / Ship to -->
                    <div class="udaan-address-col">
                        <h4>Bill to/Ship to:</h4>
                        <p><strong>{{ $order->customer_name }}</strong></p>
                        <p>{{ $order->customer_address }}</p>
                        <p>Mobile: {{ $order->customer_mobile }}</p>
                        <p>GSTIN: {{ $order->customer_gst }}</p>
                    </div>

                    <!-- QR Code Box -->
                    <div
                        style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-start;">
                        @if (isset($seller) && !empty($seller->upi_id))
                            @php
                                $upiId = trim($seller->upi_id);
                                $upiName = trim(!empty($seller->upi_name) ? $seller->upi_name : (!empty($seller->store_name) ? $seller->store_name : $app_name));
                                $amountToPay = floatval(isset($order->remaining_final) ? $order->remaining_final : $order->final_total);
                                $amount = number_format($amountToPay, 2, '.', '');
                                $note = 'Payment for Order #' . ($order->order_id ?? $order->id);
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
                        <span
                            style="font-size: 7px; color: #666; margin-top: 4px; font-weight: bold; text-align: center; width: 65px; letter-spacing: 0.5px;">SCAN CODE</span>
                    </div>
                </div>

                <!-- Items Table -->
                <table class="udaan-table">
                    <thead>
                        <tr>
                            <th>Description</th>
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
                        @foreach ($order->items as $itemIndex => $item)
                            @php
                                $pkgFormat = '';
                                $boxQty = '';
                                if (isset($item->secondary_unit_value) && $item->secondary_unit_value > 1) {
                                    $pkgFormat = (int) $item->secondary_unit_value . ' * ' . $item->variant_name;
                                    $boxes = floor($item->quantity / $item->secondary_unit_value);
                                    $loose = $item->quantity % $item->secondary_unit_value;
                                    $secName = $item->secondary_unit_name ?: 'Box';

                                    if ($boxes > 0 && $loose > 0) {
                                        $boxQty = $boxes . ' ' . $secName . ' + ' . $loose . ' nos';
                                    } elseif ($boxes > 0) {
                                        $boxQty = $boxes . ' ' . $secName;
                                    } else {
                                        $boxQty = $loose . ' nos';
                                    }
                                }

                                // Tax calculations (assume 5% inclusive GST if database doesn't define it)
                                $taxPct = $item->tax_percentage > 0 ? $item->tax_percentage : 5;
                                $cgstPct = $taxPct / 2;
                                $sgstPct = $taxPct / 2;

                                $itemTotal = $item->sub_total;
                                $netTaxable = $itemTotal / (1 + $taxPct / 100);
                                $itemTax = $itemTotal - $netTaxable;
                                $cgstAmt = $itemTax / 2;
                                $sgstAmt = $itemTax / 2;

                                $rate = $item->discounted_price ?: $item->price;
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
                                        <br><span style="color: #111; font-weight: bold; font-size: 10px;">Format:
                                            {{ $pkgFormat }}</span>
                                    @endif
                                    @if ($boxQty)
                                        <span
                                            style="color: #df2029; font-weight: bold; margin-left: 10px; font-size: 10px;">({{ $boxQty }})</span>
                                    @endif
                                    <br><span style="color: #555; font-size: 8px;">Variant: {{ $item->variant_name }} |
                                        HSN: 110610</span>
                                </td>
                                <td style="text-align: center; font-weight: bold;">
                                    {{ number_format($item->quantity, 1) }}</td>
                                <td style="text-align: right;">₹{{ number_format($rate, 2) }}</td>
                                <td style="text-align: right;">₹{{ number_format($discountRate, 2) }}</td>
                                <td style="text-align: right;">₹{{ number_format($netTaxable, 2) }}</td>
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
                                <td style="text-align: right; font-weight: bold;">₹{{ number_format($itemTotal, 2) }}
                                </td>
                            </tr>
                        @endforeach
                        <!-- Total row -->
                        <tr style="font-weight: bold; background-color: #f2f2f2;">
                            <td>Total</td>
                            <td style="text-align: center;">{{ number_format($totalBillQty, 1) }}</td>
                            <td></td>
                            <td></td>
                            <td style="text-align: right;">₹{{ number_format($totalNetTaxable, 2) }}</td>
                            <td></td>
                            <td style="text-align: right;">₹{{ number_format($totalTaxAmount, 2) }}</td>
                            <td style="text-align: right;">₹{{ number_format($totalBillAmt, 2) }}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Totals Area -->
                <div class="udaan-totals-area">
                    <table class="udaan-totals-table">
                        <tr>
                            <td style="text-align: left; color: #555;">Taxable Amount</td>
                            <td style="text-align: right; font-weight: 500;">₹{{ number_format($totalNetTaxable, 2) }}
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; color: #555;">Total Discount</td>
                            <td style="text-align: right; font-weight: 500;">
                                ₹{{ number_format(($order->total * $order->discount) / 100 + $order->promo_discount, 2) }}
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; color: #555;">Net Taxable Amount</td>
                            <td style="text-align: right; font-weight: bold;">₹{{ number_format($totalNetTaxable, 2) }}
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align: left; color: #555;">Total Tax</td>
                            <td style="text-align: right; font-weight: bold;">₹{{ number_format($totalTaxAmount, 2) }}
                            </td>
                        </tr>
                        @if ($order->delivery_charge > 0)
                            <tr>
                                <td style="text-align: left; color: #555;">Delivery Charge</td>
                                <td style="text-align: right; font-weight: bold;">
                                    ₹{{ number_format($order->delivery_charge, 2) }}</td>
                            </tr>
                        @endif
                        <tr class="grand-total">
                            <td style="text-align: left;">Grand Total</td>
                            <td style="text-align: right;">₹{{ number_format($order->final_total, 2) }}</td>
                        </tr>
                    </table>
                </div>

                <!-- Advertisement Banner -->
                <div class="udaan-ad-banner">
                    <div class="ad-text">
                        <h3>{{ strtoupper($app_name) }}</h3>
                        <p>Everyday Essentials, Excellent Quality, at Right Price - ORDER NOW</p>
                    </div>
                </div>

                <!-- Footer Declarations -->
                <div class="udaan-footer-rules">
                    <div style="max-width: 70%;">
                        <p style="margin: 0;"><strong>DECLARATION:</strong> We declare that this invoice shows the
                            actual price of the goods described and that all particulars are true and correct. This is a
                            computer generated invoice.</p>
                    </div>
                    <div
                        style="text-align: right; min-width: 150px; display: flex; flex-direction: column; align-items: flex-end; justify-content: flex-end;">
                        <div
                            style="font-family: 'Courier New', Courier, monospace; font-size: 11px; margin-bottom: 2px; color: #555; font-style: italic; font-weight: bold;">
                            {{ $seller->name }}</div>
                        <div
                            style="border-top: 1px solid #000; width: 120px; text-align: center; padding-top: 3px; font-weight: bold; font-size: 8px;">
                            Authorised Signatory</div>
                    </div>
                </div>
            </div>
        </div>
        @endif
    @endforeach

    <div style="text-align: center; margin-top: 40px;" class="no-print">
        <button onclick="window.print()"
            style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            Print Loading Slip
        </button>
    </div>

</body>

</html>
