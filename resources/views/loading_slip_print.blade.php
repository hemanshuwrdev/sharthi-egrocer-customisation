<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading Slip: {{ $slip->slip_no }}</title>
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
        th, td {
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
            border-left: 4px solid #007bff;
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
            margin-top: 40px;
            padding-top: 5px;
            font-weight: bold;
            color: #555;
        }
        @media print {
            body {
                padding: 0;
                font-size: 12px;
            }
            .no-print {
                display: none;
            }
            .card {
                background: none;
            }
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="logo-title">
            @if($logo)
                <img src="{{ asset('storage/'.$logo) }}" alt="{{ $app_name }}" style="max-height: 50px; margin-bottom: 5px;">
            @else
                <h1>{{ $app_name }}</h1>
            @endif
            <p>Warehouse Operations & Logistics Control</p>
        </div>
        <div class="slip-meta">
            <h2>LOADING SLIP</h2>
            <p><strong>Slip No:</strong> {{ $slip->slip_no }}</p>
            <p><strong>Date:</strong> {{ $slip->created_at->format('d-m-Y H:i A') }}</p>
        </div>
    </div>

    <div class="grid">
        <div class="card">
            <h3>Vehicle Details</h3>
            <div class="card-row">
                <span>Vehicle Name:</span>
                <span>{{ $slip->vehicle->name }}</span>
            </div>
            <div class="card-row">
                <span>Vehicle Number:</span>
                <span>{{ $slip->vehicle->vehicle_number }}</span>
            </div>
            <div class="card-row">
                <span>Max Capacity:</span>
                <span>{{ $slip->vehicle->capacity }} kg</span>
            </div>
        </div>

        <div class="card">
            <h3>Driver & Dispatch Details</h3>
            <div class="card-row">
                <span>Driver Name:</span>
                <span>{{ $slip->driver->name }}</span>
            </div>
            <div class="card-row">
                <span>Mobile Number:</span>
                <span>{{ $slip->driver->mobile }}</span>
            </div>
            <div class="card-row">
                <span>Dispatch Status:</span>
                <span class="badge">{{ $slip->status_text }}</span>
            </div>
        </div>
    </div>

    <div class="card" style="margin-bottom: 25px;">
        <h3>Load Weight Metrics</h3>
        <div style="display: flex; justify-content: space-around; text-align: center;">
            <div>
                <p style="margin: 0; color: #666;">Total Orders</p>
                <h4 style="margin: 5px 0 0 0; font-size: 18px; color: #111;">{{ $slip->total_orders }}</h4>
            </div>
            <div>
                <p style="margin: 0; color: #666;">Total Load Weight</p>
                <h4 style="margin: 5px 0 0 0; font-size: 18px; color: #d9534f;">{{ $slip->total_weight }} / {{ $slip->vehicle->capacity }} kg</h4>
            </div>
            <div>
                <p style="margin: 0; color: #666;">Total Items to Load</p>
                <h4 style="margin: 5px 0 0 0; font-size: 18px; color: #5cb85c;">{{ $slip->total_items }}</h4>
            </div>
        </div>
    </div>

    <div class="section-title">1. Consolidated Warehouse Load List</div>
    <p style="color: #666; margin-top: 0; margin-bottom: 10px;">Please fetch these total quantities from the warehouse racks for loading:</p>
    <table>
        <thead>
            <tr>
                <th style="width: 50px;" class="center">Sr No</th>
                <th>Item / Product Name</th>
                <th>Variant Unit</th>
                <th style="width: 100px;" class="center">Quantity to Load</th>
            </tr>
        </thead>
        <tbody>
            @foreach($itemSummary as $index => $item)
                <tr>
                    <td class="center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item->product_name }}</strong></td>
                    <td>{{ $item->variant_name }}</td>
                    <td class="center" style="font-size: 14px; font-weight: bold;">{{ $item->qty }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div style="page-break-before: always;"></div>

    <div class="section-title">2. Logical Route Stop Sequence (Driver Guide)</div>
    <p style="color: #666; margin-top: 0; margin-bottom: 10px;">Stops sequenced dynamically based on geographic zones to minimize travel time:</p>
    <table>
        <thead>
            <tr>
                <th style="width: 40px;" class="center">Seq</th>
                <th style="width: 70px;">Order ID</th>
                <th>Shop / Customer Name</th>
                <th>Delivery Address & Area</th>
                <th style="width: 80px;" class="right">Value</th>
                <th style="width: 70px;" class="center">Weight</th>
                <th style="width: 100px;" class="center">Verification</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orders as $index => $order)
                <tr>
                    <td class="center" style="font-size: 14px; font-weight: bold; color: #007bff;">{{ $index + 1 }}</td>
                    <td>#{{ $order->id }}</td>
                    <td><strong>{{ $order->user_name }}</strong></td>
                    <td>
                        {{ $order->customer_address }}
                        @if($order->city_zone)
                            <br><span style="color: #666; font-size: 10px; font-weight: bold;">Zone: {{ $order->city_zone }}</span>
                        @endif
                    </td>
                    <td class="right" style="font-weight: 500;">₹{{ number_format($order->final_total, 2) }}</td>
                    <td class="center">{{ $order->weight }} kg</td>
                    <td class="center" style="font-size: 10px; color: #999;">[ ] Delivered</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer-sig">
        <div class="sig-box">
            <div class="sig-line">Warehouse In-charge</div>
        </div>
        <div class="sig-box">
            <div class="sig-line">Driver / Delivery Boy</div>
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px;" class="no-print">
        <button onclick="window.print()" style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            Print Loading Slip
        </button>
    </div>

</body>
</html>
