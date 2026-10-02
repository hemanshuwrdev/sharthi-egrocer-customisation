@php
    $app_name = \App\Models\Setting::get_value('app_name');
    if($app_name == "" || $app_name == null){
        $app_name = "Sarthi";
    }

    $logo = \App\Models\Setting::get_value('logo') ?? "";
    $logo_url = '';
    if ($logo !== "" && file_exists(public_path('storage/' . $logo))) {
        $ext = pathinfo($logo, PATHINFO_EXTENSION);
        $logo_url = 'data:image/' . ($ext === 'svg' ? 'svg+xml' : $ext) . ';base64,' . base64_encode(file_get_contents(public_path('storage/' . $logo)));
    } elseif (file_exists(public_path('images/favicon.png'))) {
        $logo_url = 'data:image/png;base64,' . base64_encode(file_get_contents(public_path('images/favicon.png')));
    }

    $currency = \App\Models\Setting::get_value('currency') ?? '₹';

    if (!$seller) {
        $seller = new \stdClass();
        $seller->name = $order->seller_name ?? 'N/A';
        $seller->store_name = $order->store_name ?? 'N/A';
        $seller->street = $order->seller_formatted_address ?? '';
        $seller->city_name = $order->seller_place_name ?? '';
        $seller->state = $order->seller_state ?? 'Gujarat';
        $seller->tax_number = '';
        $seller->pan_number = '';
    } else {
        $seller->city_name = $seller->city->name ?? ($seller->place_name ?? '');
    }

    $customerName = $retailer->party_name ?? ($retailer->shop_name ?? ($order->user_name ?? ''));
    $customerAddress = $order->address ?: ($order->order_address ?: ($retailer->address ?? ''));
    $customerMobile = $order->mobile ?: ($order->order_mobile ?: ($retailer->mobile ?? ''));
    $customerGst = $retailer->gst_no ?? ($order->customer_gst ?? '');

    $sellerState = $seller->state ?? '';
    $customerState = $order->customer_state ?? ($order->ua_state ?? '');
    $isIntraState = (empty($sellerState) || empty($customerState) || strcasecmp($sellerState, $customerState) === 0);

    $reasonLabel = $creditNote->reason_type === 'return' ? 'Sales Return' : 'Order Cancellation';
@endphp
<html>
    <head>
        <title>Credit Note - {{ $creditNote->credit_note_no }}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: 'DejaVu Sans', Helvetica, Arial, sans-serif;
                color: #111;
                font-size: 11px;
                background: #fff;
                margin: 0;
                padding: 0;
            }
            .cn-container {
                box-sizing: border-box;
            }
            .cn-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 12px;
            }
            .cn-table th,
            .cn-table td {
                border: 1px solid #777;
                padding: 6px 8px;
                font-size: 11px;
                vertical-align: top;
                text-align: left;
            }
            .cn-table th {
                background-color: #f1f5f9;
                color: #0f172a;
                font-weight: bold;
                border-bottom: 2px solid #555;
            }
            .cn-totals-table {
                width: 320px;
                border-collapse: collapse;
            }
            .cn-totals-table td {
                padding: 5px 10px;
                font-size: 11px;
                border: none;
            }
            .cn-totals-table tr.grand-total td {
                background-color: #b91c1c;
                color: #fff;
                font-weight: bold;
                font-size: 13px;
            }
            .badge-credit-note {
                background-color: #ef4444;
                color: #fff;
                padding: 3px 8px;
                font-size: 10px;
                font-weight: bold;
                border-radius: 3px;
                display: inline-block;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        </style>
    </head>
    <body>
        <div class="cn-container">
            <!-- Header Table -->
            <table width="100%" style="border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; border-collapse: collapse;">
                <tr>
                    <td width="55%" style="vertical-align: middle; border: none; padding: 0;">
                        <table style="border: none; border-collapse: collapse; padding: 0; margin: 0;">
                            <tr>
                                <td style="border: none; padding: 0 10px 0 0; vertical-align: middle;">
                                    <img src="{{ $logo_url }}" height="38" style="max-height: 38px; width: auto;" alt="Logo">
                                </td>
                                <td style="border: none; vertical-align: middle; padding: 0;">
                                    <span style="color: #000; font-size: 26px; font-weight: 900; letter-spacing: -1.5px; line-height: 1; font-family: sans-serif;">{{ $app_name }}</span>
                                    <br>
                                    <span class="badge-credit-note" style="margin-top: 4px;">CREDIT NOTE</span>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td width="45%" style="text-align: right; vertical-align: top; border: none; padding: 0;">
                        <table align="right" style="border: none; border-collapse: collapse; font-size: 11px; font-weight: bold; color: #111; padding: 0; margin: 0;">
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Credit Note No:</td>
                                <td align="right" style="padding: 2px 5px; border: none; color: #b91c1c;">{{ $creditNote->credit_note_no }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Credit Note Date:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">{{ date('d-m-Y', strtotime($creditNote->generated_at ?? $creditNote->created_at)) }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Against Invoice:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">{{ $distributor_invoice_number ?: ($order->invoice_number ?: ('#' . $order->id)) }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Original Order ID:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">#{{ $order->id }}</td>
                            </tr>
                            <tr>
                                <td align="left" style="color: #555; padding: 2px 5px; border: none;">Reason:</td>
                                <td align="right" style="padding: 2px 5px; border: none;">{{ $reasonLabel }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Address Columns -->
            <table width="100%" style="border-collapse: collapse; margin-bottom: 12px; border-bottom: 1.5px solid #000; padding-bottom: 12px;">
                <tr>
                    <td width="50%" style="vertical-align: top; border: none; padding: 0 15px 0 0;">
                        <h4 style="margin: 0 0 6px 0; font-size: 11px; font-weight: 900; color: #000; text-transform: uppercase;">ISSUED BY (SUPPLIER):</h4>
                        <div style="font-size: 11px; line-height: 1.45; color: #222;">
                            <strong style="font-size: 12px;">{{ $seller->store_name ?? $seller->name }}</strong><br>
                            @if (!empty($seller->street))
                                {{ $seller->street }}<br>
                            @endif
                            @if (!empty($seller->city_name))
                                {{ $seller->city_name }}{{ !empty($seller->state) ? ', ' . $seller->state : '' }}<br>
                            @endif
                            @if (!empty($seller->mobile))
                                Phone: {{ $seller->mobile }}<br>
                            @endif
                            @if (!empty($seller->tax_number))
                                <strong>GSTIN:</strong> {{ $seller->tax_number }}<br>
                            @endif
                            @if (!empty($seller->pan_number))
                                <strong>PAN:</strong> {{ $seller->pan_number }}
                            @endif
                        </div>
                    </td>
                    <td width="50%" style="vertical-align: top; border: none; padding: 0 0 0 15px;">
                        <h4 style="margin: 0 0 6px 0; font-size: 11px; font-weight: 900; color: #000; text-transform: uppercase;">ISSUED TO (BUYER):</h4>
                        <div style="font-size: 11px; line-height: 1.45; color: #222;">
                            <strong style="font-size: 12px;">{{ $customerName }}</strong><br>
                            @if (!empty($customerAddress))
                                {{ $customerAddress }}<br>
                            @endif
                            @if (!empty($customerMobile))
                                Phone: {{ $customerMobile }}<br>
                            @endif
                            @if (!empty($customerGst))
                                <strong>GSTIN:</strong> {{ $customerGst }}<br>
                            @endif
                            Place of Supply: {{ $customerState ?: ($sellerState ?: 'Gujarat') }}
                        </div>
                    </td>
                </tr>
            </table>

            <!-- Credit Note Items Table -->
            <table class="cn-table">
                <thead>
                    <tr>
                        <th style="width: 30px; text-align: center;">#</th>
                        <th>Item Description</th>
                        <th style="width: 65px; text-align: center;">HSN</th>
                        <th style="width: 50px; text-align: center;">Qty</th>
                        <th style="width: 40px; text-align: center;">Unit</th>
                        <th style="width: 65px; text-align: right;">Rate ({{ $currency }})</th>
                        <th style="width: 75px; text-align: right;">Taxable ({{ $currency }})</th>
                        <th style="width: 80px; text-align: center;">Tax %</th>
                        <th style="width: 65px; text-align: right;">Tax Amt</th>
                        <th style="width: 80px; text-align: right;">Total ({{ $currency }})</th>
                    </tr>
                </thead>
                <tbody>
                    @php
                        $totalTaxable = 0;
                        $totalCgst = 0;
                        $totalSgst = 0;
                        $totalIgst = 0;
                        $totalCredit = 0;
                        $totalQty = 0;
                    @endphp
                    @foreach ($items as $index => $item)
                        @php
                            $qty = (float) ($item->quantity ?: 1);
                            $totalQty += $qty;
                            $grossAmount = (float) $item->amount;
                            $taxPct = (float) ($item->tax_percentage > 0 ? $item->tax_percentage : 5);
                            
                            // Amount is tax-inclusive refund
                            $taxableVal = round($grossAmount / (1 + ($taxPct / 100)), 2);
                            $taxAmt = round($grossAmount - $taxableVal, 2);
                            $unitRate = $qty > 0 ? round($taxableVal / $qty, 2) : $taxableVal;

                            $totalTaxable += $taxableVal;
                            $totalCredit += $grossAmount;

                            if ($isIntraState) {
                                $cgstPct = $taxPct / 2;
                                $sgstPct = $taxPct / 2;
                                $cgstVal = round($taxAmt / 2, 2);
                                $sgstVal = round($taxAmt - $cgstVal, 2);
                                $totalCgst += $cgstVal;
                                $totalSgst += $sgstVal;
                            } else {
                                $igstPct = $taxPct;
                                $totalIgst += $taxAmt;
                            }
                        @endphp
                        <tr>
                            <td style="text-align: center;">{{ $index + 1 }}</td>
                            <td>
                                <strong>{{ $item->product_name }}</strong>
                                @if (!empty($item->variant_name))
                                    <br><span style="color: #555; font-size: 10px;">{{ $item->variant_name }}</span>
                                @endif
                            </td>
                            <td style="text-align: center;">{{ $item->hsn ?: 'N/A' }}</td>
                            <td style="text-align: center; font-weight: bold;">{{ number_format($qty, 1) }}</td>
                            <td style="text-align: center;">{{ $item->unit_symbol ?: 'PCS' }}</td>
                            <td style="text-align: right;">{{ number_format($unitRate, 2) }}</td>
                            <td style="text-align: right;">{{ number_format($taxableVal, 2) }}</td>
                            <td style="text-align: center; font-size: 9px;">
                                @if ($isIntraState)
                                    CGST ({{ number_format($cgstPct, 1) }}%)<br>
                                    SGST ({{ number_format($sgstPct, 1) }}%)
                                @else
                                    IGST ({{ number_format($igstPct, 1) }}%)
                                @endif
                            </td>
                            <td style="text-align: right; font-size: 9px;">
                                @if ($isIntraState)
                                    {{ number_format($cgstVal, 2) }}<br>
                                    {{ number_format($sgstVal, 2) }}
                                @else
                                    {{ number_format($taxAmt, 2) }}
                                @endif
                            </td>
                            <td style="text-align: right; font-weight: bold;">{{ number_format($grossAmount, 2) }}</td>
                        </tr>
                    @endforeach
                    <!-- Total Row -->
                    <tr style="font-weight: bold; background-color: #f8fafc;">
                        <td colspan="3" style="text-align: right;">Total:</td>
                        <td style="text-align: center;">{{ number_format($totalQty, 1) }}</td>
                        <td></td>
                        <td></td>
                        <td style="text-align: right;">{{ number_format($totalTaxable, 2) }}</td>
                        <td></td>
                        <td style="text-align: right;">{{ number_format($isIntraState ? ($totalCgst + $totalSgst) : $totalIgst, 2) }}</td>
                        <td style="text-align: right;">{{ number_format($totalCredit, 2) }}</td>
                    </tr>
                </tbody>
            </table>

            <!-- Summary Table -->
            <table width="100%" style="border-collapse: collapse; margin-bottom: 15px;">
                <tr>
                    <td width="50%" style="border: none; padding: 0; vertical-align: top;">
                        <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; background-color: #f8fafc; font-size: 10px; color: #475569;">
                            <strong>Note:</strong> This Credit Note is issued towards {{ strtolower($reasonLabel) }} against original Invoice No. {{ $distributor_invoice_number ?: ($order->invoice_number ?: ('#' . $order->id)) }}. The refundable value of {{ $currency }}{{ number_format($totalCredit, 2) }} has been credited / adjusted to the retailer's wallet / ledger.
                        </div>
                    </td>
                    <td width="50%" align="right" style="border: none; padding: 0;">
                        <table class="cn-totals-table" align="right">
                            <tr>
                                <td align="left" style="color: #555;">Total Taxable Amount</td>
                                <td align="right" style="font-weight: 500;">{{ $currency }}{{ number_format($totalTaxable, 2) }}</td>
                            </tr>
                            @if ($isIntraState)
                                <tr>
                                    <td align="left" style="color: #555;">CGST Amount</td>
                                    <td align="right" style="font-weight: 500;">{{ $currency }}{{ number_format($totalCgst, 2) }}</td>
                                </tr>
                                <tr>
                                    <td align="left" style="color: #555;">SGST Amount</td>
                                    <td align="right" style="font-weight: 500;">{{ $currency }}{{ number_format($totalSgst, 2) }}</td>
                                </tr>
                            @else
                                <tr>
                                    <td align="left" style="color: #555;">IGST Amount</td>
                                    <td align="right" style="font-weight: 500;">{{ $currency }}{{ number_format($totalIgst, 2) }}</td>
                                </tr>
                            @endif
                            <tr class="grand-total">
                                <td align="left" style="padding: 6px 10px; font-weight: bold;">Total Credit Amount</td>
                                <td align="right" style="padding: 6px 10px; font-weight: bold;">{{ $currency }}{{ number_format($totalCredit, 2) }}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Footer Declarations -->
            <table width="100%" style="font-size: 9.5px; color: #444; line-height: 1.35; border-top: 1px solid #aaa; padding-top: 8px; margin-top: 12px; border-collapse: collapse;">
                <tr>
                    <td width="70%" style="vertical-align: top; border: none; padding: 0;">
                        <p style="margin: 0;"><strong>DECLARATION:</strong> We declare that this Credit Note shows the actual value of returned goods / cancelled transaction and that all particulars are true and correct. Issued in accordance with Section 34 of the CGST Act, 2017.</p>
                    </td>
                    <td width="30%" style="text-align: right; vertical-align: bottom; border: none; min-width: 150px; padding: 0;">
                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 11px; margin-bottom: 2px; color: #555; font-style: italic; font-weight: bold;">
                            {{ $seller->store_name ?? $seller->name }}
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
