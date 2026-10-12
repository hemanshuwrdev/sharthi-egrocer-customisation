<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMS & OTP Diagnostic Inspector | Saarthi Wholesale</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        :root {
            --primary: #042A5F;
            --primary-dark: #021B40;
            --dark-bg: #0f172a;
            --card-bg: #ffffff;
            --border-color: #e2e8f0;
        }
        body {
            background-color: #f1f5f9;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #1e293b;
        }
        .navbar-custom {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            border-bottom: 2px solid var(--primary);
        }
        .card {
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
            margin-bottom: 1.5rem;
        }
        .card-header {
            background-color: #f8fafc;
            border-bottom: 1px solid var(--border-color);
            font-weight: 600;
            padding: 0.85rem 1.25rem;
        }
        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        .badge-verified {
            background-color: #d1fae5;
            color: #065f46;
        }
        .badge-expired {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .code-box {
            background: #0f172a;
            color: #f8fafc;
            border-radius: 8px;
            padding: 1rem;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.85rem;
            max-height: 380px;
            overflow-y: auto;
        }
        .table-responsive {
            max-height: 480px;
            overflow-y: auto;
        }
        .stat-card {
            border-left: 4px solid var(--primary);
        }
        .stat-card.danger {
            border-left-color: #ef4444;
        }
        .stat-card.warning {
            border-left-color: #f59e0b;
        }
    </style>
</head>
<body>

    <!-- Header Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark navbar-custom py-2 px-3">
        <div class="container-fluid">
            <span class="navbar-brand d-flex align-items-center fw-bold">
                <i class="fa-solid fa-tower-broadcast text-warning me-2 fs-4"></i>
                <span>SMS & OTP Inspector</span>
                <span class="badge bg-secondary ms-2 text-uppercase font-monospace" style="font-size: 0.7rem;">Diagnostics</span>
            </span>
            <div class="d-flex align-items-center">
                @if($authenticated ?? false)
                    <span class="text-light me-3 small">
                        <i class="fa-solid fa-user-shield text-success me-1"></i>
                        {{ $admin->username ?? $admin->email ?? 'Admin' }}
                    </span>
                    <form method="POST" action="{{ route('sms.inspect') }}" class="d-inline">
                        @csrf
                        <input type="hidden" name="action" value="logout">
                        <button type="submit" class="btn btn-sm btn-outline-light">
                            <i class="fa-solid fa-arrow-right-from-bracket me-1"></i> Logout
                        </button>
                    </form>
                @endif
            </div>
        </div>
    </nav>

    <div class="container-fluid py-4 px-4">

        {{-- Flash Messages --}}
        @if(session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fa-solid fa-circle-check me-2"></i> {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif
        @if(session('error'))
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fa-solid fa-triangle-exclamation me-2"></i> {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif
        @if(session('auth_error'))
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <i class="fa-solid fa-lock me-2"></i> {{ session('auth_error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        {{-- Authentication Form if not logged in --}}
        @if(!($authenticated ?? false))
            <div class="row justify-content-center py-5">
                <div class="col-md-5 col-lg-4">
                    <div class="card shadow-lg">
                        <div class="card-header text-center py-3 bg-dark text-white">
                            <i class="fa-solid fa-shield-halved fa-2x text-warning mb-2"></i>
                            <h5 class="mb-0">Admin Authentication Required</h5>
                            <small class="text-white-50">Please log in to inspect SMS gateway settings & OTP logs</small>
                        </div>
                        <div class="card-body p-4">
                            <form method="POST" action="{{ route('sms.inspect') }}">
                                @csrf
                                <input type="hidden" name="action" value="login">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Admin Email</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                        <input type="email" name="email" class="form-control" placeholder="admin@example.com" required autofocus>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Password</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                                        <input type="password" name="password" class="form-control" placeholder="••••••••" required>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-success w-100 py-2 fw-semibold">
                                    <i class="fa-solid fa-right-to-bracket me-1"></i> Unlock SMS Inspector
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        @else

            {{-- Test Result Alert if test OTP was executed --}}
            @if(!empty($testResult))
                <div class="card border-{{ $testResult['success'] ? 'success' : 'danger' }} mb-4">
                    <div class="card-header bg-{{ $testResult['success'] ? 'success' : 'danger' }} text-white d-flex justify-content-between align-items-center">
                        <span>
                            <i class="fa-solid {{ $testResult['success'] ? 'fa-circle-check' : 'fa-circle-xmark' }} me-2"></i>
                            <strong>Test OTP Dispatch Result:</strong> {{ $testResult['final_message'] }}
                        </span>
                        <span class="badge bg-light text-dark font-monospace">{{ $testResult['timestamp'] }}</span>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-3"><strong>Target Phone:</strong> <code>{{ $testResult['phone'] }}</code></div>
                            <div class="col-md-3"><strong>Clean Digits:</strong> <code>{{ $testResult['clean_mobiles'] }}</code></div>
                            <div class="col-md-3"><strong>Generated OTP:</strong> <span class="badge bg-primary fs-6">{{ $testResult['otp'] }}</span></div>
                            <div class="col-md-3"><strong>Gateway:</strong> <span class="badge bg-dark">{{ strtoupper($testResult['gateway']) }}</span></div>
                        </div>

                        <h6 class="fw-bold mt-3 mb-2"><i class="fa-solid fa-network-wired me-1"></i> HTTP Request / Response Trace:</h6>
                        @foreach($testResult['steps'] as $idx => $step)
                            <div class="border rounded p-3 mb-2 bg-light">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <strong>Step {{ $idx + 1 }}: {{ $step['endpoint'] }}</strong>
                                    <span>
                                        @if(isset($step['http_status']))
                                            <span class="badge bg-{{ $step['http_status'] >= 200 && $step['http_status'] < 300 ? 'success' : 'danger' }} font-monospace">HTTP {{ $step['http_status'] }}</span>
                                        @endif
                                        @if(isset($step['elapsed_ms']))
                                            <span class="badge bg-secondary font-monospace">{{ $step['elapsed_ms'] }} ms</span>
                                        @endif
                                    </span>
                                </div>
                                @if(!empty($step['note']))
                                    <div class="text-warning small mb-2"><i class="fa-solid fa-circle-info"></i> {{ $step['note'] }}</div>
                                @endif
                                <div class="code-box">
<span class="text-warning">// Response:</span>
{{ json_encode($step['response_body'] ?? $step['error'] ?? [], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) }}
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            {{-- Diagnostic Health Badges --}}
            <div class="row g-3 mb-4">
                @foreach($healthChecks as $check)
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100 stat-card {{ $check['status'] === 'success' ? '' : ($check['status'] === 'warning' ? 'warning' : 'danger') }} p-3">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <div class="text-muted small fw-semibold">{{ $check['title'] }}</div>
                                    <div class="fw-bold fs-6 mt-1 text-{{ $check['status'] }}">
                                        {{ $check['message'] }}
                                    </div>
                                </div>
                                <div>
                                    @if($check['status'] === 'success')
                                        <i class="fa-solid fa-circle-check text-success fs-4"></i>
                                    @elseif($check['status'] === 'warning')
                                        <i class="fa-solid fa-triangle-exclamation text-warning fs-4"></i>
                                    @else
                                        <i class="fa-solid fa-circle-xmark text-danger fs-4"></i>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>

            <div class="row g-4">
                {{-- Column Left: Send Test OTP & Configuration --}}
                <div class="col-lg-5">

                    <!-- Send Test OTP Card -->
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <span><i class="fa-solid fa-paper-plane me-2"></i><strong>Send Test OTP Now</strong></span>
                            <span class="badge bg-light text-primary">Live Simulator</span>
                        </div>
                        <div class="card-body">
                            <p class="text-muted small mb-3">
                                Test sending an actual OTP to your phone right now. This will call MSG91 API in real-time, record the result in <code>sms_verifications</code>, and print the raw HTTP response.
                            </p>
                            <form method="POST" action="{{ route('sms.inspect.test') }}">
                                @csrf
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Mobile Number</label>
                                    <div class="input-group">
                                        <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                                        <input type="text" name="phone" class="form-control font-monospace" placeholder="e.g. 919876543210 or 9876543210" required>
                                    </div>
                                    <small class="text-muted">Enter 10-digit mobile or include 91 country code.</small>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Target Gateway</label>
                                    <select name="gateway" class="form-select">
                                        <option value="msg91_flow" selected>MSG91 Flow API (Recommended for SMS/DLT Templates)</option>
                                        <option value="msg91_otp">MSG91 OTP API (For Dedicated OTP Templates)</option>
                                        <option value="twilio">Twilio</option>
                                    </select>
                                </div>

                                <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold">
                                    <i class="fa-solid fa-paper-plane me-2"></i> Send Test OTP & Inspect Response
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- Gateway Settings Card -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span><i class="fa-solid fa-sliders me-2"></i>Current Gateway Settings</span>
                            <a href="/sms-settings" target="_blank" class="btn btn-sm btn-outline-secondary">
                                <i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Edit in Panel
                            </a>
                        </div>
                        <div class="card-body p-0">
                            <table class="table table-sm table-striped mb-0">
                                <tbody>
                                    <tr>
                                        <td class="fw-semibold px-3 py-2">Active SMS Gateway</td>
                                        <td class="px-3 py-2">
                                            <span class="badge bg-{{ !empty($activeGateway) ? 'success' : 'danger' }}">
                                                {{ strtoupper($activeGateway ?: 'NOT CONFIGURED') }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold px-3 py-2">MSG91 Method Toggle</td>
                                        <td class="px-3 py-2">
                                            <span class="badge bg-{{ $settings['msg91_method'] == 1 ? 'success' : 'secondary' }}">
                                                {{ $settings['msg91_method'] == 1 ? 'Enabled (1)' : 'Disabled (0)' }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold px-3 py-2">MSG91 Auth Key</td>
                                        <td class="px-3 py-2 font-monospace small">
                                            @if(!empty($settings['msg91_auth_key']))
                                                <span class="text-success">{{ substr($settings['msg91_auth_key'], 0, 4) }}...{{ substr($settings['msg91_auth_key'], -4) }}</span>
                                            @else
                                                <span class="text-danger fw-bold">EMPTY</span>
                                            @endif
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold px-3 py-2">MSG91 Sender ID</td>
                                        <td class="px-3 py-2 font-monospace">
                                            {{ $settings['msg91_sender_id'] ?: 'EMPTY' }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold px-3 py-2">MSG91 Template ID</td>
                                        <td class="px-3 py-2 font-monospace small">
                                            {{ $settings['msg91_otp_template_id'] ?: 'EMPTY' }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold px-3 py-2">Custom SMS Gateway Mode</td>
                                        <td class="px-3 py-2">
                                            <span class="badge bg-{{ $settings['custom_sms_gateway_otp_based'] == 1 ? 'success' : 'secondary' }}">
                                                {{ $settings['custom_sms_gateway_otp_based'] == 1 ? 'ON (Custom SMS)' : 'OFF' }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold px-3 py-2">Firebase Auth Mode</td>
                                        <td class="px-3 py-2">
                                            <span class="badge bg-{{ $settings['firebase_authentication'] == 1 ? 'warning' : 'info' }}">
                                                {{ $settings['firebase_authentication'] == 1 ? 'ON (Client-side Firebase)' : 'OFF' }}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-semibold px-3 py-2">Twilio Method Toggle</td>
                                        <td class="px-3 py-2">
                                            <span class="badge bg-{{ $settings['twilio_method'] == 1 ? 'success' : 'secondary' }}">
                                                {{ $settings['twilio_method'] == 1 ? 'Enabled (1)' : 'Disabled (0)' }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Helpful Links -->
                    <div class="card">
                        <div class="card-header"><i class="fa-solid fa-link me-2"></i>Direct Portal Links</div>
                        <div class="card-body">
                            <div class="d-grid gap-2">
                                <a href="https://control.msg91.com/app/m/l/sms/logs/sms" target="_blank" class="btn btn-outline-dark text-start">
                                    <i class="fa-solid fa-arrow-up-right-from-square me-2 text-primary"></i> <strong>MSG91 SMS Delivery Logs</strong>
                                    <div class="small text-muted ms-4">View real-time telecom delivery status, DLT blocks, and deduction</div>
                                </a>
                                <a href="/logs" target="_blank" class="btn btn-outline-dark text-start">
                                    <i class="fa-solid fa-file-lines me-2 text-warning"></i> <strong>Laravel Log Viewer (/logs)</strong>
                                    <div class="small text-muted ms-4">Browse full application logs directly in your browser</div>
                                </a>
                                <a href="/store_settings" target="_blank" class="btn btn-outline-dark text-start">
                                    <i class="fa-solid fa-gear me-2 text-success"></i> <strong>Store Settings (/store_settings)</strong>
                                    <div class="small text-muted ms-4">Toggle Phone Login & Custom SMS Gateway options</div>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {{-- Column Right: DB Verifications & Laravel Logs --}}
                <div class="col-lg-7">

                    <!-- DB Records Table (sms_verifications) -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span>
                                <i class="fa-solid fa-database me-2"></i>
                                <strong>Database OTP Records (sms_verifications)</strong>
                            </span>
                            <span class="badge bg-secondary font-monospace">Latest {{ count($verifications) }} Records</span>
                        </div>
                        <div class="card-body p-0">
                            @if(count($verifications) === 0)
                                <div class="p-4 text-center text-muted">
                                    <i class="fa-regular fa-folder-open fa-2x mb-2"></i>
                                    <div>No OTP records found in <code>sms_verifications</code> table.</div>
                                    <small>Send a test OTP using the simulator to generate the first record.</small>
                                </div>
                            @else
                                <div class="table-responsive">
                                    <table class="table table-sm table-hover table-striped align-middle mb-0" style="font-size: 0.85rem;">
                                        <thead class="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Phone</th>
                                                <th>Type</th>
                                                <th>OTP</th>
                                                <th>Status</th>
                                                <th>Expires At</th>
                                                <th>Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @foreach($verifications as $v)
                                                <tr>
                                                    <td class="font-monospace fw-bold">#{{ $v->id }}</td>
                                                    <td class="font-monospace">{{ $v->phone }}</td>
                                                    <td>
                                                        @if($v->user_type == 3)
                                                            <span class="badge bg-info">Seller</span>
                                                        @elseif($v->user_type == 4)
                                                            <span class="badge bg-primary">Delivery Boy</span>
                                                        @elseif($v->user_type == 5)
                                                            <span class="badge bg-secondary">Salesman</span>
                                                        @else
                                                            <span class="badge bg-dark">Customer/Retailer</span>
                                                        @endif
                                                    </td>
                                                    <td><span class="badge bg-light text-dark font-monospace border">{{ $v->otp }}</span></td>
                                                    <td>
                                                        @if($v->status === 'verified')
                                                            <span class="badge badge-verified">Verified</span>
                                                        @elseif(\Carbon\Carbon::parse($v->expires_at)->lt(\Carbon\Carbon::now()))
                                                            <span class="badge badge-expired">Expired</span>
                                                        @else
                                                            <span class="badge badge-pending">Pending</span>
                                                        @endif
                                                    </td>
                                                    <td class="small text-muted font-monospace">{{ $v->expires_at }}</td>
                                                    <td class="small text-muted font-monospace">{{ $v->created_at }}</td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            @endif
                        </div>
                    </div>

                    <!-- Live SMS Logs extracted from laravel.log -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <span>
                                <i class="fa-solid fa-terminal me-2"></i>
                                <strong>Live Application Logs (storage/logs/laravel.log)</strong>
                            </span>
                            <span class="badge bg-dark font-monospace">SMS Filter</span>
                        </div>
                        <div class="card-body p-0">
                            @if(count($smsLogs) === 0)
                                <div class="p-4 text-center text-muted">
                                    <i class="fa-regular fa-clipboard fa-2x mb-2"></i>
                                    <div>No recent SMS entries found in <code>laravel.log</code>.</div>
                                </div>
                            @else
                                <div class="code-box" style="max-height: 440px;">
                                    @foreach($smsLogs as $log)
                                        <div class="mb-2 pb-1 border-bottom border-secondary">
                                            <span class="text-secondary small">[{{ $log['timestamp'] }}]</span>
                                            @if($log['level'] === 'ERROR')
                                                <span class="badge bg-danger">{{ $log['level'] }}</span>
                                            @elseif($log['level'] === 'WARNING')
                                                <span class="badge bg-warning text-dark">{{ $log['level'] }}</span>
                                            @else
                                                <span class="badge bg-info text-dark">{{ $log['level'] }}</span>
                                            @endif
                                            <span class="text-light ms-1">{{ $log['message'] }}</span>
                                        </div>
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    </div>

                </div>
            </div>

        @endif

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
