<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('trip_reconciliation') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item">
                                    <router-link to="/seller/trips">{{ __('trips') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('trip_reconciliation') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <section class="section" v-if="loading">
                <div class="text-center py-5"><b-spinner></b-spinner></div>
            </section>

            <section class="section" v-else-if="!settlement">
                <div class="card"><div class="card-body text-center text-muted py-5">{{ __('trip_not_found') }}</div></div>
            </section>

            <section class="section" v-else>

                <!-- Header bar -->
                <div class="trip-header">
                    <div class="trip-header__left">
                        <div class="driver-avatar" :class="tripType === 'salesman' ? 'driver-avatar--purple' : ''">
                            <i :class="tripType === 'salesman' ? 'fa fa-user-tie' : 'fa fa-truck'"></i>
                        </div>
                        <div>
                            <div class="trip-header__title">
                                <span class="trip-header__name">{{ settlement.person ? settlement.person.name : '-' }}</span>
                                <span v-if="settlement.trip_no" class="trip-header__code">{{ settlement.trip_no }}</span>
                            </div>
                            <div class="trip-header__meta">
                                <span>{{ fmtDate(settlement.date) }}</span>
                                <span class="trip-header__dot">•</span>
                                <span>{{ orders.length }} {{ __('total_orders') }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="trip-header__right">
                        <span class="trip-badge" :class="statusBadgeClass(settlement.status)">
                            <span class="trip-badge__dot"></span>
                            {{ settlement.status_text }}
                        </span>

                        <div class="trip-header__divider"></div>

                        <div class="trip-header__actions">
                            <span v-if="methodEditUnlocked" class="text-success small fw-semibold">
                                <i class="fa fa-unlock me-1"></i>{{ __('editing_enabled') }}
                            </span>
                            <button v-else type="button" class="trip-header__btn trip-header__btn--secondary" @click="openUnlockModal">
                                <i class="fa fa-lock trip-header__btn-icon"></i>{{ __('edit') }}
                            </button>
                            <b-dropdown v-if="isClosed" right boundary="window" class="export-dropdown"
                                toggle-class="trip-header__btn trip-header__btn--primary" no-caret>
                                <template #button-content>
                                    <i class="fa fa-download"></i>{{ __('export_report') }}
                                    <i class="fa fa-caret-down trip-header__btn-caret"></i>
                                </template>
                                <b-dropdown-item href="#" @click.prevent="exportReport('csv')">{{ __('export_as_csv') }}</b-dropdown-item>
                                <b-dropdown-item href="#" @click.prevent="exportReport('pdf')">{{ __('export_as_pdf') }}</b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </div>
                </div>

                <!-- Sensitive-operations password prompt (unlocks Method editing) -->
                <b-modal v-model="unlockModalShow" :title="__('Enter Sensitive Operations Password')" hide-footer no-close-on-backdrop>
                    <form @submit.prevent="submitUnlock">
                        <div class="form-group">
                            <label>{{ __('Password') }}</label>
                            <input type="password" class="form-control" v-model="unlockPassword" autocomplete="current-password" ref="unlockPasswordInput" />
                        </div>
                        <div v-if="unlockError" class="text-danger small mb-2">{{ unlockError }}</div>
                        <div class="text-end">
                            <b-button variant="secondary" class="me-2" @click="unlockModalShow = false">{{ __('cancel') }}</b-button>
                            <b-button variant="primary" type="submit" :disabled="unlocking">
                                {{ __('confirm') }}
                                <b-spinner v-if="unlocking" small></b-spinner>
                            </b-button>
                        </div>
                    </form>
                </b-modal>

                <div class="row">

                    <!-- Left: Collection Reconciliation -->
                    <div class="col-lg-8 mb-4">
                        <div class="card h-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0">{{ __('collection_reconciliation') }}</h5>
                                <span v-if="settlement.reconciliation_status !== 'unreconciled'" class="small">
                                    {{ __('reconciliation_status') }}:
                                    <span class="fw-semibold" :class="reconStatusClass(settlement.reconciliation_status)">
                                        <i :class="reconStatusIcon(settlement.reconciliation_status)" class="me-1"></i>
                                        {{ reconStatusLabel(settlement.reconciliation_status) }}
                                    </span>
                                </span>
                            </div>
                            <div class="card-body">

                                <!-- Re-reconcile warning -->
                                <div v-if="needsRereconcile" class="alert alert-warning py-2 small mb-3">
                                    <i class="fa fa-exclamation-triangle me-1"></i>
                                    New payments collected after reconciliation — please verify and re-reconcile.
                                </div>

                                <!-- 3 stat tiles -->
                                <div class="recon-tiles mb-4">
                                    <div class="recon-tile">
                                        <div class="recon-tile__label">{{ __('total_expected') }}</div>
                                        <div class="recon-tile__value">{{ $currency }} {{ fmt(totals.total_expected) }}</div>
                                    </div>
                                    <div class="recon-tile recon-tile--blue">
                                        <div class="recon-tile__label">{{ __('digital_verified') }}</div>
                                        <div class="recon-tile__value recon-tile__value--blue">{{ $currency }} {{ fmt(totals.digital_verified) }}</div>
                                    </div>
                                    <div class="recon-tile recon-tile--red">
                                        <div class="recon-tile__label">{{ __('cash_expected') }}</div>
                                        <div class="recon-tile__value recon-tile__value--red">{{ $currency }} {{ fmt(totals.cash_expected) }}</div>
                                    </div>
                                </div>


                                <!-- Pending digital warning -->
                                <div v-if="totals.unverified_digital > 0 && !isClosed" class="alert alert-danger py-2 small mb-0">
                                    <i class="fa fa-lock me-1"></i>
                                    {{ totals.unverified_digital }} {{ __('digital_payment_pending_verify') }}
                                </div>

                                <!-- Pending partial-invoice / cancel-invoice verification warnings -->
                                <div v-if="totals.unverified_partial > 0 && !isClosed" class="alert alert-danger py-2 small mb-0 mt-2">
                                    <i class="fa fa-lock me-1"></i>
                                    {{ totals.unverified_partial }} {{ __('partial_invoice_item_pending_verify') }}
                                </div>
                                <div v-if="totals.unverified_cancel > 0 && !isClosed" class="alert alert-danger py-2 small mb-0 mt-2">
                                    <i class="fa fa-lock me-1"></i>
                                    {{ totals.unverified_cancel }} {{ __('cancel_invoice_pending_verify') }}
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Right: Method summary cards -->
                    <div class="col-lg-4 mb-4">
                        <div class="card h-100">
                            <div class="card-header">
                                <h5 class="card-title mb-0">{{ __('payment_summary') }}</h5>
                            </div>
                            <div class="card-body p-0">
                                <div class="analytics-row" v-if="totals.total_cash > 0">
                                    <div class="analytics-row__icon analytics-row__icon--green">
                                        <i class="fa fa-money"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('cash') }}</div>
                                        <div class="analytics-row__value">{{ $currency }} {{ fmt(totals.total_cash) }}</div>
                                    </div>
                                </div>
                                <div class="analytics-row" v-if="totals.total_upi > 0">
                                    <div class="analytics-row__icon analytics-row__icon--blue">
                                        <i class="fa fa-mobile"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('upi') }}</div>
                                        <div class="analytics-row__value">{{ $currency }} {{ fmt(totals.total_upi) }}</div>
                                    </div>
                                    <div class="analytics-row__badge">
                                        <span :class="totals.verified_upi >= totals.total_upi ? 'text-success' : 'text-warning'" class="small fw-semibold">
                                            {{ $currency }} {{ fmt(totals.verified_upi) }} {{ __('verified') }}
                                        </span>
                                    </div>
                                </div>
                                <div class="analytics-row" v-if="totals.total_cheque > 0">
                                    <div class="analytics-row__icon analytics-row__icon--purple">
                                        <i class="fa fa-file-text"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('cheque') }}</div>
                                        <div class="analytics-row__value">{{ $currency }} {{ fmt(totals.total_cheque) }}</div>
                                    </div>
                                    <div class="analytics-row__badge">
                                        <span :class="totals.verified_cheque >= totals.total_cheque ? 'text-success' : 'text-warning'" class="small fw-semibold">
                                            {{ $currency }} {{ fmt(totals.verified_cheque) }} {{ __('verified') }}
                                        </span>
                                    </div>
                                </div>
                                <div class="analytics-row" v-if="totals.total_signature > 0">
                                    <div class="analytics-row__icon analytics-row__icon--orange">
                                        <i class="fa fa-pencil"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('signature') }}</div>
                                        <div class="analytics-row__value">{{ $currency }} {{ fmt(totals.total_signature) }}</div>
                                    </div>
                                    <div class="analytics-row__badge">
                                        <span :class="totals.verified_signature >= totals.total_signature ? 'text-success' : 'text-warning'" class="small fw-semibold">
                                            {{ $currency }} {{ fmt(totals.verified_signature) }} {{ __('verified') }}
                                        </span>
                                    </div>
                                </div>
                                <div class="analytics-row">
                                    <div class="analytics-row__icon analytics-row__icon--dark">
                                        <i class="fa fa-calculator"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('total_expected') }}</div>
                                        <div class="analytics-row__value">{{ $currency }} {{ fmt(totals.total_expected) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <b-tabs content-class="mt-3" nav-class="trip-tabs">
                <b-tab active>
                    <template #title>
                        <span class="trip-tab-title">
                            <i class="fa fa-money trip-tab-icon"></i>{{ __('payments') }}
                        </span>
                    </template>

                <!-- Cash Settlement -->
                <div class="card" v-if="cashRows.length > 0">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0"><i class="fa fa-money me-2 text-success"></i>{{ __('Cash Settlement') }}</h5>
                        <span class="text-muted small">{{ cashRows.length }} {{ __('entries') }}</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:120px">{{ __('invoice') }} #</th>
                                        <th style="width:110px">{{ __('loading_slip') }}</th>
                                        <th style="width:120px">{{ __('invoice_no') }}</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('order_value') }}</th>
                                        <th class="text-end" style="width:100px">{{ __('shortfall') }}</th>
                                        <th style="width:120px">{{ __('method') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('collected') }}</th>
                                        <th class="text-end" style="width:120px">{{ __('received') }}</th>
                                        <th class="text-center" style="width:70px">{{ __('proof') }}</th>
                                        <th class="text-center" style="width:100px">{{ __('status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in cashRows" :key="row.paymentId">
                                        <td class="ps-3 fw-semibold text-primary">{{ row.invoiceNumber || ('#' + row.ordersId) }}</td>
                                        <td>
                                            <span v-if="row.loadingSlipNo" class="badge bg-secondary">{{ row.loadingSlipNo }}</span>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.retailerName }}</div>
                                            <div class="text-muted small">{{ row.retailerMobile }}</div>
                                        </td>
                                        <td class="text-end fw-bold">{{ $currency }} {{ fmt(row.finalTotal) }}</td>
                                        <td class="text-end"
                                            :class="row.orderShortfall > 0.005 ? 'text-danger fw-bold small' : row.orderShortfall < -0.005 ? 'text-primary fw-bold small' : 'text-success fw-bold small'">
                                            <template v-if="row.orderShortfall > 0.005">- {{ $currency }} {{ fmt(row.orderShortfall) }}</template>
                                            <template v-else-if="row.orderShortfall < -0.005">+ {{ $currency }} {{ fmt(Math.abs(row.orderShortfall)) }}</template>
                                            <template v-else>{{ $currency }} 0</template>
                                        </td>
                                        <td>
                                            <select v-if="methodEditUnlocked" class="form-select form-select-sm"
                                                :value="row.method"
                                                @change="changePaymentMethod(row.paymentId, $event.target.value)">
                                                <option v-for="m in methodOptions" :key="m" :value="m">{{ m }}</option>
                                            </select>
                                            <span v-else class="badge" :class="methodBadgeClass(row.method)">
                                                <i :class="methodIcon(row.method)" class="me-1"></i>{{ row.method }}
                                            </span>
                                        </td>
                                        <td class="text-end fw-semibold">{{ $currency }} {{ fmt(row.amount) }}</td>
                                        <td class="text-end">
                                            <div class="input-group input-group-sm" style="max-width:130px; margin-left:auto;">
                                                <span class="input-group-text">{{ $currency }}</span>
                                                <input type="number" step="0.01" class="form-control text-end"
                                                    :value="row.receivedAmount"
                                                    :disabled="isClosed"
                                                    @input="updateReceivedAmountLocally(row.paymentId, $event.target.value)"
                                                    @blur="saveReceivedAmount(row.paymentId, row.receivedAmount)">
                                            </div>
                                        </td>
                                        <td class="text-center"><span class="text-muted small">—</span></td>
                                        <td class="text-center"><span class="text-muted small">—</span></td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-light fw-bold">
                                    <tr>
                                        <td colspan="6" class="ps-3 text-end">{{ __('total') }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(methodTotal(cashRows, 'amount')) }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(methodTotal(cashRows, 'receivedAmount')) }}</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- UPI / Bank Settlement -->
                <div class="card" v-if="upiRows.length > 0">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0"><i class="fa fa-mobile me-2 text-primary"></i>{{ __('UPI / Bank') }}</h5>
                        <span class="text-muted small">{{ upiRows.length }} {{ __('entries') }}</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:120px">{{ __('invoice') }} #</th>
                                        <th style="width:110px">{{ __('loading_slip') }}</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('order_value') }}</th>
                                        <th class="text-end" style="width:100px">{{ __('shortfall') }}</th>
                                        <th style="width:120px">{{ __('method') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('collected') }}</th>
                                        <th class="text-end" style="width:120px">{{ __('received') }}</th>
                                        <th class="text-center" style="width:70px">{{ __('proof') }}</th>
                                        <th class="text-center" style="width:100px">{{ __('status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in upiRows" :key="row.paymentId">
                                        <td class="ps-3 fw-semibold text-primary">{{ row.invoiceNumber || ('#' + row.ordersId) }}</td>
                                        <td>
                                            <span v-if="row.loadingSlipNo" class="badge bg-secondary">{{ row.loadingSlipNo }}</span>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.retailerName }}</div>
                                            <div class="text-muted small">{{ row.retailerMobile }}</div>
                                        </td>
                                        <td class="text-end fw-bold">{{ $currency }} {{ fmt(row.finalTotal) }}</td>
                                        <td class="text-end"
                                            :class="row.orderShortfall > 0.005 ? 'text-danger fw-bold small' : row.orderShortfall < -0.005 ? 'text-primary fw-bold small' : 'text-success fw-bold small'">
                                            <template v-if="row.orderShortfall > 0.005">- {{ $currency }} {{ fmt(row.orderShortfall) }}</template>
                                            <template v-else-if="row.orderShortfall < -0.005">+ {{ $currency }} {{ fmt(Math.abs(row.orderShortfall)) }}</template>
                                            <template v-else>{{ $currency }} 0</template>
                                        </td>
                                        <td>
                                            <select v-if="methodEditUnlocked" class="form-select form-select-sm"
                                                :value="row.method"
                                                @change="changePaymentMethod(row.paymentId, $event.target.value)">
                                                <option v-for="m in methodOptions" :key="m" :value="m">{{ m }}</option>
                                            </select>
                                            <span v-else class="badge" :class="methodBadgeClass(row.method)">
                                                <i :class="methodIcon(row.method)" class="me-1"></i>{{ row.method }}
                                            </span>
                                        </td>
                                        <td class="text-end fw-semibold">{{ $currency }} {{ fmt(row.amount) }}</td>
                                        <td class="text-end">
                                            <div class="input-group input-group-sm" style="max-width:130px; margin-left:auto;">
                                                <span class="input-group-text">{{ $currency }}</span>
                                                <input type="number" step="0.01" class="form-control text-end"
                                                    :value="row.receivedAmount"
                                                    :disabled="isClosed"
                                                    @input="updateReceivedAmountLocally(row.paymentId, $event.target.value)"
                                                    @blur="saveReceivedAmount(row.paymentId, row.receivedAmount)">
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <a v-if="row.proofPhoto" :href="'/storage/' + row.proofPhoto" target="_blank" class="btn btn-sm btn-outline-info">
                                                <i class="fa fa-image"></i>
                                            </a>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="row.paymentStatus === 'verified'" class="text-success small fw-semibold">
                                                <i class="fa fa-check-circle"></i> {{ __('verified') }}
                                            </span>
                                            <button v-else
                                                class="btn btn-sm btn-outline-success"
                                                @click="verifyPayment(row.paymentId)"
                                                :disabled="isClosed || verifyingId === row.paymentId">
                                                <b-spinner v-if="verifyingId === row.paymentId" small></b-spinner>
                                                <i v-else class="fa fa-check"></i>
                                                {{ __('verify') }}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-light fw-bold">
                                    <tr>
                                        <td colspan="6" class="ps-3 text-end">{{ __('total') }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(methodTotal(upiRows, 'amount')) }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(methodTotal(upiRows, 'receivedAmount')) }}</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Cheque Settlement -->
                <div class="card" v-if="chequeRows.length > 0">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0"><i class="fa fa-file-text me-2 text-info"></i>{{ __('Cheque') }}</h5>
                        <span class="text-muted small">{{ chequeRows.length }} {{ __('entries') }}</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:120px">{{ __('invoice') }} #</th>
                                        <th style="width:110px">{{ __('loading_slip') }}</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('order_value') }}</th>
                                        <th class="text-end" style="width:100px">{{ __('shortfall') }}</th>
                                        <th style="width:120px">{{ __('method') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('collected') }}</th>
                                        <th class="text-end" style="width:120px">{{ __('received') }}</th>
                                        <th style="width:150px">{{ __('Cheque Date') }}</th>
                                        <th style="width:140px">{{ __('Cheque Number') }}</th>
                                        <th class="text-center" style="width:70px">{{ __('proof') }}</th>
                                        <th class="text-center" style="width:100px">{{ __('status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in chequeRows" :key="row.paymentId">
                                        <td class="ps-3 fw-semibold text-primary">{{ row.invoiceNumber || ('#' + row.ordersId) }}</td>
                                        <td>
                                            <span v-if="row.loadingSlipNo" class="badge bg-secondary">{{ row.loadingSlipNo }}</span>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.retailerName }}</div>
                                            <div class="text-muted small">{{ row.retailerMobile }}</div>
                                        </td>
                                        <td class="text-end fw-bold">{{ $currency }} {{ fmt(row.finalTotal) }}</td>
                                        <td class="text-end"
                                            :class="row.orderShortfall > 0.005 ? 'text-danger fw-bold small' : row.orderShortfall < -0.005 ? 'text-primary fw-bold small' : 'text-success fw-bold small'">
                                            <template v-if="row.orderShortfall > 0.005">- {{ $currency }} {{ fmt(row.orderShortfall) }}</template>
                                            <template v-else-if="row.orderShortfall < -0.005">+ {{ $currency }} {{ fmt(Math.abs(row.orderShortfall)) }}</template>
                                            <template v-else>{{ $currency }} 0</template>
                                        </td>
                                        <td>
                                            <select v-if="methodEditUnlocked" class="form-select form-select-sm"
                                                :value="row.method"
                                                @change="changePaymentMethod(row.paymentId, $event.target.value)">
                                                <option v-for="m in methodOptions" :key="m" :value="m">{{ m }}</option>
                                            </select>
                                            <span v-else class="badge" :class="methodBadgeClass(row.method)">
                                                <i :class="methodIcon(row.method)" class="me-1"></i>{{ row.method }}
                                            </span>
                                        </td>
                                        <td class="text-end fw-semibold">{{ $currency }} {{ fmt(row.amount) }}</td>
                                        <td class="text-end">
                                            <div class="input-group input-group-sm" style="max-width:130px; margin-left:auto;">
                                                <span class="input-group-text">{{ $currency }}</span>
                                                <input type="number" step="0.01" class="form-control text-end"
                                                    :value="row.receivedAmount"
                                                    :disabled="isClosed"
                                                    @input="updateReceivedAmountLocally(row.paymentId, $event.target.value)"
                                                    @blur="saveReceivedAmount(row.paymentId, row.receivedAmount)">
                                            </div>
                                        </td>
                                        <!-- Cheque Date / Number: directly editable inline since this row is already cheque -->
                                        <td>
                                            <input type="date" class="form-control form-control-sm"
                                                :value="row.chequeDate"
                                                :disabled="isClosed"
                                                @input="updateChequeDateLocally(row.paymentId, $event.target.value)"
                                                @blur="saveChequeDetails(row.paymentId)">
                                        </td>
                                        <td>
                                            <input type="number" min="0" step="1" class="form-control form-control-sm" :placeholder="__('Cheque Number')"
                                                :value="row.chequeNumber"
                                                :disabled="isClosed"
                                                @keydown="if (['e', 'E', '+', '-', '.'].includes($event.key)) $event.preventDefault()"
                                                @input="updateChequeNumberLocally(row.paymentId, $event.target.value)"
                                                @blur="saveChequeDetails(row.paymentId)">
                                        </td>
                                        <td class="text-center">
                                            <a v-if="row.proofPhoto" :href="'/storage/' + row.proofPhoto" target="_blank" class="btn btn-sm btn-outline-info">
                                                <i class="fa fa-image"></i>
                                            </a>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="row.paymentStatus === 'verified'" class="text-success small fw-semibold">
                                                <i class="fa fa-check-circle"></i> {{ __('verified') }}
                                            </span>
                                            <button v-else
                                                class="btn btn-sm btn-outline-success"
                                                @click="verifyPayment(row.paymentId)"
                                                v-b-tooltip.hover :title="(!row.chequeDate || !row.chequeNumber) ? __('cheque_date_and_number_required_before_verification') : ''"
                                                :disabled="isClosed || verifyingId === row.paymentId || !row.chequeDate || !row.chequeNumber">
                                                <b-spinner v-if="verifyingId === row.paymentId" small></b-spinner>
                                                <i v-else class="fa fa-check"></i>
                                                {{ __('verify') }}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-light fw-bold">
                                    <tr>
                                        <td colspan="6" class="ps-3 text-end">{{ __('total') }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(methodTotal(chequeRows, 'amount')) }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(methodTotal(chequeRows, 'receivedAmount')) }}</td>
                                        <td colspan="2"></td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Signature Settlement -->
                <div class="card" v-if="signatureRows.length > 0">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0"><i class="fa fa-pencil me-2 text-warning"></i>{{ __('Signature') }}</h5>
                        <span class="text-muted small">{{ signatureRows.length }} {{ __('entries') }}</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:120px">{{ __('invoice') }} #</th>
                                        <th style="width:110px">{{ __('loading_slip') }}</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('order_value') }}</th>
                                        <th class="text-end" style="width:100px">{{ __('shortfall') }}</th>
                                        <th style="width:120px">{{ __('method') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('collected') }}</th>
                                        <th class="text-end" style="width:120px">{{ __('received') }}</th>
                                        <th class="text-center" style="width:70px">{{ __('proof') }}</th>
                                        <th class="text-center" style="width:100px">{{ __('status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in signatureRows" :key="row.paymentId">
                                        <td class="ps-3 fw-semibold text-primary">{{ row.invoiceNumber || ('#' + row.ordersId) }}</td>
                                        <td>
                                            <span v-if="row.loadingSlipNo" class="badge bg-secondary">{{ row.loadingSlipNo }}</span>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.retailerName }}</div>
                                            <div class="text-muted small">{{ row.retailerMobile }}</div>
                                        </td>
                                        <td class="text-end fw-bold">{{ $currency }} {{ fmt(row.finalTotal) }}</td>
                                        <td class="text-end"
                                            :class="row.orderShortfall > 0.005 ? 'text-danger fw-bold small' : row.orderShortfall < -0.005 ? 'text-primary fw-bold small' : 'text-success fw-bold small'">
                                            <template v-if="row.orderShortfall > 0.005">- {{ $currency }} {{ fmt(row.orderShortfall) }}</template>
                                            <template v-else-if="row.orderShortfall < -0.005">+ {{ $currency }} {{ fmt(Math.abs(row.orderShortfall)) }}</template>
                                            <template v-else>{{ $currency }} 0</template>
                                        </td>
                                        <td>
                                            <select v-if="methodEditUnlocked" class="form-select form-select-sm"
                                                :value="row.method"
                                                @change="changePaymentMethod(row.paymentId, $event.target.value)">
                                                <option v-for="m in methodOptions" :key="m" :value="m">{{ m }}</option>
                                            </select>
                                            <span v-else class="badge" :class="methodBadgeClass(row.method)">
                                                <i :class="methodIcon(row.method)" class="me-1"></i>{{ row.method }}
                                            </span>
                                        </td>
                                        <td class="text-end fw-semibold">{{ $currency }} {{ fmt(row.amount) }}</td>
                                        <td class="text-end">
                                            <div class="input-group input-group-sm" style="max-width:130px; margin-left:auto;">
                                                <span class="input-group-text">{{ $currency }}</span>
                                                <input type="number" step="0.01" class="form-control text-end"
                                                    :value="row.receivedAmount"
                                                    :disabled="isClosed"
                                                    @input="updateReceivedAmountLocally(row.paymentId, $event.target.value)"
                                                    @blur="saveReceivedAmount(row.paymentId, row.receivedAmount)">
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <a v-if="row.proofPhoto" :href="'/storage/' + row.proofPhoto" target="_blank" class="btn btn-sm btn-outline-info">
                                                <i class="fa fa-image"></i>
                                            </a>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="row.paymentStatus === 'verified'" class="text-success small fw-semibold">
                                                <i class="fa fa-check-circle"></i> {{ __('verified') }}
                                            </span>
                                            <button v-else
                                                class="btn btn-sm btn-outline-success"
                                                @click="verifyPayment(row.paymentId)"
                                                :disabled="isClosed || verifyingId === row.paymentId">
                                                <b-spinner v-if="verifyingId === row.paymentId" small></b-spinner>
                                                <i v-else class="fa fa-check"></i>
                                                {{ __('verify') }}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-light fw-bold">
                                    <tr>
                                        <td colspan="6" class="ps-3 text-end">{{ __('total') }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(methodTotal(signatureRows, 'amount')) }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(methodTotal(signatureRows, 'receivedAmount')) }}</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card" v-if="flatRows.length === 0">
                    <div class="card-body text-center text-muted py-4">
                        <i class="fa fa-inbox fa-2x mb-2 d-block"></i>
                        {{ __('no_data_found') }}
                    </div>
                </div>

                </b-tab>

                <b-tab>
                    <template #title>
                        <span class="trip-tab-title">
                            <i class="fa fa-exclamation-triangle trip-tab-icon"></i>{{ __('partial_invoices') }}
                            <span v-if="partialInvoices.length" class="trip-tab-badge">{{ partialInvoices.length }}</span>
                        </span>
                    </template>

                <!-- Partial Invoices -->
                <div class="card" v-if="partialInvoiceRows.length > 0">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0"><i class="fa fa-exclamation-triangle me-2 text-warning"></i>{{ __('partial_invoices') }}</h5>
                        <span class="text-muted small">{{ partialInvoices.length }} {{ __('invoice') }}(s)</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:120px">{{ __('invoice') }} #</th>
                                        <th style="width:110px">{{ __('loading_slip') }}</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th>{{ __('product') }}</th>
                                        <th class="text-center" style="width:110px">{{ __('items_accepted') }}</th>
                                        <th class="text-end" style="width:90px">{{ __('ordered_qty') }}</th>
                                        <th class="text-end" style="width:90px">{{ __('delivered_qty') }}</th>
                                        <th class="text-end" style="width:90px">{{ __('shortfall_qty') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('shortfall_value') }}</th>
                                        <th style="width:160px">{{ __('reason') }}</th>
                                        <th class="text-center" style="width:70px">{{ __('proof') }}</th>
                                        <th class="text-center" style="width:100px">{{ __('status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in partialInvoiceRows" :key="row.orderId + '_' + idx">
                                        <td class="ps-3 fw-semibold text-primary">{{ row.invoiceNumber || ('#' + row.orderId) }}</td>
                                        <td>
                                            <span v-if="row.loadingSlipNo" class="badge bg-secondary">{{ row.loadingSlipNo }}</span>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.retailerName }}</div>
                                            <div class="text-muted small">{{ row.retailerMobile }}</div>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.productName }}</div>
                                            <div class="text-muted small" v-if="row.variantName">{{ row.variantName }}</div>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge" :class="row.totalDeliveredQty < row.totalOrderedQty ? 'bg-warning text-dark' : 'bg-success'">
                                                {{ row.totalDeliveredQty }}/{{ row.totalOrderedQty }}
                                            </span>
                                        </td>
                                        <td class="text-end">{{ row.quantity }}</td>
                                        <td class="text-end">{{ row.deliveredQuantity }}</td>
                                        <td class="text-end text-danger fw-bold">{{ row.shortfallQty }}</td>
                                        <td class="text-end text-danger fw-bold">{{ $currency }} {{ fmt(row.shortfallValue) }}</td>
                                        <td>{{ row.shortfallReason ? __(row.shortfallReason) : '-' }}</td>
                                        <td class="text-center">
                                            <a v-if="row.damagePhoto" :href="'/storage/' + row.damagePhoto" target="_blank" class="btn btn-sm btn-outline-info">
                                                <i class="fa fa-image"></i>
                                            </a>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td class="text-center">
                                            <span v-if="row.verified" class="text-success small fw-semibold">
                                                <i class="fa fa-check-circle"></i> {{ __('verified') }}
                                            </span>
                                            <button v-else
                                                class="btn btn-sm btn-outline-success"
                                                @click="verifyPartialInvoiceItem(row.orderItemId)"
                                                :disabled="isClosed || verifyingPartialId === row.orderItemId">
                                                <b-spinner v-if="verifyingPartialId === row.orderItemId" small></b-spinner>
                                                <i v-else class="fa fa-check"></i>
                                                {{ __('verify') }}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-light fw-bold">
                                    <tr>
                                        <td colspan="8" class="ps-3 text-end">{{ __('total') }}</td>
                                        <td class="text-end text-danger">{{ $currency }} {{ fmt(totalShortfallValue) }}</td>
                                        <td colspan="3"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card" v-else>
                    <div class="card-body text-center text-success py-4">
                        <i class="fa fa-check-circle fa-2x mb-2 d-block"></i>
                        {{ __('all_items_delivered_in_full') }}
                    </div>
                </div>

                </b-tab>

                <b-tab>
                    <template #title>
                        <span class="trip-tab-title">
                            <i class="fa fa-ban trip-tab-icon"></i>{{ __('cancel_invoices') }}
                            <span v-if="cancelInvoices.length" class="trip-tab-badge">{{ cancelInvoices.length }}</span>
                        </span>
                    </template>

                <!-- Cancel Invoices -->
                <div class="card" v-if="cancelInvoices.length > 0">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0"><i class="fa fa-ban me-2 text-danger"></i>{{ __('cancel_invoices') }}</h5>
                        <span class="text-muted small">{{ cancelInvoices.length }} {{ __('invoice') }}(s)</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:120px">{{ __('invoice') }} #</th>
                                        <th style="width:110px">{{ __('loading_slip') }}</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end" style="width:120px">{{ __('order_value') }}</th>
                                        <th style="width:170px">{{ __('cancelled_at') }}</th>
                                        <th class="text-center" style="width:100px">{{ __('status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in cancelInvoices" :key="row.order_id">
                                        <td class="ps-3 fw-semibold text-primary">{{ row.invoice_number || ('#' + row.order_id) }}</td>
                                        <td>
                                            <span v-if="row.loading_slip_no" class="badge bg-secondary">{{ row.loading_slip_no }}</span>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.retailer ? row.retailer.name : '-' }}</div>
                                            <div class="text-muted small">{{ row.retailer ? row.retailer.mobile : '' }}</div>
                                        </td>
                                        <td class="text-end fw-bold">{{ $currency }} {{ fmt(row.final_total) }}</td>
                                        <td>{{ fmtDateTime(row.cancelled_at) }}</td>
                                        <td class="text-center">
                                            <span v-if="row.verified" class="text-success small fw-semibold">
                                                <i class="fa fa-check-circle"></i> {{ __('verified') }}
                                            </span>
                                            <button v-else
                                                class="btn btn-sm btn-outline-success"
                                                @click="verifyCancelInvoice(row.order_id)"
                                                :disabled="isClosed || verifyingCancelId === row.order_id">
                                                <b-spinner v-if="verifyingCancelId === row.order_id" small></b-spinner>
                                                <i v-else class="fa fa-check"></i>
                                                {{ __('verify') }}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-light fw-bold">
                                    <tr>
                                        <td colspan="3" class="ps-3 text-end">{{ __('total') }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(cancelInvoices.reduce((s, r) => s + parseFloat(r.final_total || 0), 0)) }}</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card" v-else>
                    <div class="card-body text-center text-success py-4">
                        <i class="fa fa-check-circle fa-2x mb-2 d-block"></i>
                        {{ __('no_cancelled_orders_in_this_trip') }}
                    </div>
                </div>

                </b-tab>

                <b-tab>
                    <template #title>
                        <span class="trip-tab-title">
                            <i class="fa fa-calendar trip-tab-icon"></i>{{ __('reschedule_invoices') }}
                            <span v-if="rescheduleInvoices.length" class="trip-tab-badge">{{ rescheduleInvoices.length }}</span>
                        </span>
                    </template>

                <!-- Reschedule Invoices -->
                <div class="card" v-if="rescheduleInvoices.length > 0">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0"><i class="fa fa-calendar me-2 text-warning"></i>{{ __('reschedule_invoices') }}</h5>
                        <span class="text-muted small">{{ rescheduleInvoices.length }} {{ __('invoice') }}(s)</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:120px">{{ __('invoice') }} #</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('order_value') }}</th>
                                        <th style="width:130px">{{ __('new_delivery_date') }}</th>
                                        <th>{{ __('reason') }}</th>
                                        <th style="width:170px">{{ __('rescheduled_at') }}</th>
                                        <th style="width:130px">{{ __('current_status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in rescheduleInvoices" :key="row.order_id">
                                        <td class="ps-3 fw-semibold text-primary">{{ row.invoice_number || ('#' + row.order_id) }}</td>
                                        <td>
                                            <div class="fw-semibold">{{ row.retailer ? row.retailer.name : '-' }}</div>
                                            <div class="text-muted small">{{ row.retailer ? row.retailer.mobile : '' }}</div>
                                        </td>
                                        <td class="text-end fw-bold">{{ $currency }} {{ fmt(row.final_total) }}</td>
                                        <td>{{ fmtDate(row.new_delivery_date) }}</td>
                                        <td>{{ row.delivery_reason || '-' }}</td>
                                        <td>{{ fmtDateTime(row.rescheduled_at) }}</td>
                                        <td><span class="badge bg-secondary">{{ orderStatusLabel(row.current_status) }}</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card" v-else>
                    <div class="card-body text-center text-success py-4">
                        <i class="fa fa-check-circle fa-2x mb-2 d-block"></i>
                        {{ __('no_rescheduled_orders_in_this_trip') }}
                    </div>
                </div>

                </b-tab>

                <b-tab>
                    <template #title>
                        <span class="trip-tab-title">
                            <i class="fa fa-undo trip-tab-icon"></i>{{ __('returns') }}
                            <span v-if="returnItemSummary.length" class="trip-tab-badge">{{ returnItemSummary.length }}</span>
                        </span>
                    </template>

                <!-- Item Summary of Returned Items -->
                <div class="card" v-if="returnItemSummary.length > 0">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0"><i class="fa fa-undo me-2 text-info"></i>{{ __('item_summary_of_returned_items') }}</h5>
                        <span class="text-muted small">{{ returnItemSummary.length }} {{ __('item') }}(s)</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:120px">{{ __('invoice') }} #</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th>{{ __('product') }}</th>
                                        <th class="text-end" style="width:120px">{{ __('refund_amount') }}</th>
                                        <th>{{ __('reason') }}</th>
                                        <th style="width:170px">{{ __('returned_at') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, idx) in returnItemSummary" :key="row.order_id + '_' + idx">
                                        <td class="ps-3 fw-semibold text-primary">{{ row.invoice_number || ('#' + row.order_id) }}</td>
                                        <td>
                                            <div class="fw-semibold">{{ row.retailer ? row.retailer.name : '-' }}</div>
                                            <div class="text-muted small">{{ row.retailer ? row.retailer.mobile : '' }}</div>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.product_name }}</div>
                                            <div class="text-muted small" v-if="row.variant_name">{{ row.variant_name }}</div>
                                        </td>
                                        <td class="text-end fw-bold">{{ $currency }} {{ fmt(row.refund_amount) }}</td>
                                        <td>{{ row.reason || '-' }}</td>
                                        <td>{{ fmtDateTime(row.returned_at) }}</td>
                                    </tr>
                                </tbody>
                                <tfoot class="table-light fw-bold">
                                    <tr>
                                        <td colspan="3" class="ps-3 text-end">{{ __('total') }}</td>
                                        <td class="text-end">{{ $currency }} {{ fmt(returnItemSummary.reduce((s, r) => s + parseFloat(r.refund_amount || 0), 0)) }}</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card" v-else>
                    <div class="card-body text-center text-success py-4">
                        <i class="fa fa-check-circle fa-2x mb-2 d-block"></i>
                        {{ __('no_returns_in_this_trip') }}
                    </div>
                </div>

                </b-tab>
                </b-tabs>

                <!-- Cheque details modal: opens when a row's method is changed to Cheque,
                     since Cheque Date + Number must be captured before the change is saved. -->
                <b-modal v-model="chequeModalShow" :title="__('Enter Cheque Details')" hide-footer no-close-on-backdrop>
                    <form @submit.prevent="submitChequeModal">
                        <div class="form-group mb-3">
                            <label>{{ __('Cheque Date') }}</label>
                            <input type="date" class="form-control" v-model="chequeModalDate" required ref="chequeModalDateInput" />
                        </div>
                        <div class="form-group mb-3">
                            <label>{{ __('Cheque Number') }}</label>
                            <input type="number" min="0" step="1" class="form-control" v-model="chequeModalNumber" required @keydown="if (['e', 'E', '+', '-', '.'].includes($event.key)) $event.preventDefault()" />
                        </div>
                        <div v-if="chequeModalError" class="text-danger small mb-2">{{ chequeModalError }}</div>
                        <div class="text-end">
                            <b-button variant="secondary" class="me-2" @click="cancelChequeModal">{{ __('cancel') }}</b-button>
                            <b-button variant="primary" type="submit" :disabled="chequeModalSaving">
                                {{ __('confirm') }}
                                <b-spinner v-if="chequeModalSaving" small></b-spinner>
                            </b-button>
                        </div>
                    </form>
                </b-modal>

                <!-- Footer bar -->
                <div class="card mt-3">
                    <div class="card-body d-flex align-items-center gap-4 flex-wrap">
                        <div class="me-2">
                            <div class="footer-label">{{ __('cash') }}</div>
                            <div class="footer-value text-success">{{ $currency }} {{ fmt(totals.total_cash) }}</div>
                        </div>
                        <div class="footer-divider"></div>
                        <div class="me-2" v-if="totals.total_upi > 0">
                            <div class="footer-label">{{ __('upi') }}</div>
                            <div class="footer-value text-primary">{{ $currency }} {{ fmt(totals.total_upi) }}</div>
                        </div>
                        <div class="footer-divider" v-if="totals.total_upi > 0"></div>
                        <div class="me-2" v-if="totals.total_cheque > 0">
                            <div class="footer-label">{{ __('cheque') }}</div>
                            <div class="footer-value text-info">{{ $currency }} {{ fmt(totals.total_cheque) }}</div>
                        </div>
                        <div class="footer-divider" v-if="totals.total_cheque > 0"></div>
                        <div class="me-2" v-if="totals.total_signature > 0">
                            <div class="footer-label">{{ __('signature') }}</div>
                            <div class="footer-value text-warning">{{ $currency }} {{ fmt(totals.total_signature) }}</div>
                        </div>
                        <div class="footer-divider" v-if="totals.total_signature > 0"></div>
                        <div class="me-2">
                            <div class="footer-label">{{ __('reconciliation_status') }}</div>
                            <div class="footer-value">
                                <span :class="reconStatusClass(settlement.reconciliation_status)">
                                    <i :class="reconStatusIcon(settlement.reconciliation_status)" class="me-1"></i>
                                    {{ reconStatusLabel(settlement.reconciliation_status) }}
                                </span>
                            </div>
                        </div>
                        <div class="ms-auto">
                            <button
                                v-if="!isClosed"
                                class="btn btn-primary"
                                @click="closeTrip"
                                :disabled="closing || !canCloseNow">
                                <b-spinner v-if="closing" small class="me-1"></b-spinner>
                                <i v-else class="fa fa-check-circle me-1"></i>
                                {{ needsRereconcile ? 'Re-Reconcile' : __('close_and_reconcile') }}
                            </button>
                            <span v-else class="text-success fw-semibold">
                                <i class="fa fa-check-circle me-1"></i>{{ __('trip_reconciled') }}
                            </span>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default {
    name: 'SellerTripReconciliation',
    data() {
        return {
            loading:     true,
            settlement:  null,
            orders:      [],
            partialInvoices: [],
            cancelInvoices: [],
            rescheduleInvoices: [],
            returnItemSummary: [],
            totals: {
                total_expected: 0, total_collected: 0,
                total_cash: 0, total_upi: 0, total_cheque: 0, total_signature: 0,
                verified_upi: 0, verified_cheque: 0, verified_signature: 0,
                digital_verified: 0, cash_expected: 0, cash_received: null,
                has_cash: false, unverified_digital: 0,
                unverified_partial: 0, unverified_cancel: 0,
            },
            closing:     false,
            verifyingId: null,
            verifyingPartialId: null,
            verifyingCancelId: null,
            methodOptions:      ['cash', 'upi', 'cheque', 'signature'],
            methodEditUnlocked: false,
            unlockModalShow:    false,
            unlockPassword:     '',
            unlockError:        '',
            unlocking:          false,
            // Cheque-details modal — opens when a row's method is changed to "cheque",
            // since date+number must be captured before the change is saved.
            chequeModalShow:          false,
            chequeModalPaymentId:     null,
            chequeModalPreviousMethod: null,
            chequeModalDate:          '',
            chequeModalNumber:        '',
            chequeModalError:         '',
            chequeModalSaving:        false,
        };
    },
    computed: {
        tripType()        { return this.$route.query.type || 'driver'; },
        isClosed()        { return this.settlement && this.settlement.status === 'reconciled'; },
        needsRereconcile(){ return this.settlement && this.settlement.status === 'needs_rereconcile'; },
        overallShortfall() {
            return parseFloat((this.totals.total_expected - this.totalReceivedAmount).toFixed(2));
        },
        totalReceivedAmount() {
            return this.flatRows.reduce((s, row) => s + parseFloat(row.receivedAmount || 0), 0);
        },
        canCloseNow() {
            return this.totals.unverified_digital === 0
                && this.totals.unverified_partial === 0
                && this.totals.unverified_cancel === 0;
        },
        // One row per payment, order-level fields (Order #, Retailer, Order Value,
        // Shortfall) repeated on every row — each of the 4 method tables below just
        // filters this by method, so an order with no payments recorded at all (no
        // method to categorize it under) is skipped entirely.
        flatRows() {
            const rows = [];
            this.orders.forEach(order => {
                const payments = order.payments || [];
                if (payments.length === 0) return;

                const received       = payments.reduce((s, p) => s + parseFloat((p.received_amount ?? p.amount) || 0), 0);
                const orderShortfall = parseFloat((order.final_total - received).toFixed(2));
                const retailerName   = order.retailer ? order.retailer.name   : '-';
                const retailerMobile = order.retailer ? order.retailer.mobile : '';

                payments.forEach(p => {
                    rows.push({
                        orderId: order.id, ordersId: order.orders_id,
                        invoiceNumber: order.invoice_number,
                        loadingSlipNo: order.loading_slip_no,
                        invoiceNumber: order.invoice_number,
                        retailerName, retailerMobile,
                        finalTotal: order.final_total,
                        orderShortfall,
                        paymentId:      p.id,
                        method:         p.method,
                        amount:         p.amount,
                        receivedAmount: p.received_amount ?? p.amount,
                        proofPhoto:     p.proof_photo,
                        paymentStatus:  p.status,
                        // cheque_date comes back as an ISO datetime string (date cast) — trim
                        // to YYYY-MM-DD for the native <input type="date">.
                        chequeDate:   p.cheque_date ? String(p.cheque_date).substring(0, 10) : '',
                        chequeNumber: p.cheque_number || '',
                    });
                });
            });
            return rows;
        },
        cashRows()      { return this.flatRows.filter(r => r.method === 'cash'); },
        upiRows()       { return this.flatRows.filter(r => r.method === 'upi'); },
        chequeRows()    { return this.flatRows.filter(r => r.method === 'cheque'); },
        signatureRows() { return this.flatRows.filter(r => r.method === 'signature'); },
        // One row per shortfall item, invoice-level fields (Invoice #, Retailer, Items
        // Accepted) repeated on every row — mirrors flatRows' pattern for payments.
        partialInvoiceRows() {
            const rows = [];
            this.partialInvoices.forEach(inv => {
                (inv.items || []).forEach(item => {
                    rows.push({
                        orderId: inv.order_id,
                        orderItemId: item.order_item_id,
                        invoiceNumber: inv.invoice_number,
                        loadingSlipNo: inv.loading_slip_no,
                        retailerName: inv.retailer ? inv.retailer.name : '-',
                        retailerMobile: inv.retailer ? inv.retailer.mobile : '',
                        totalOrderedQty: inv.total_ordered_qty,
                        totalDeliveredQty: inv.total_delivered_qty,
                        productName: item.product_name,
                        variantName: item.variant_name,
                        quantity: item.quantity,
                        deliveredQuantity: item.delivered_quantity,
                        shortfallQty: item.shortfall_qty,
                        shortfallValue: item.shortfall_value,
                        shortfallReason: item.shortfall_reason,
                        damagePhoto: item.damage_photo,
                        verified: item.verified,
                    });
                });
            });
            return rows;
        },
        totalShortfallValue() {
            return this.partialInvoiceRows.reduce((s, row) => s + parseFloat(row.shortfallValue || 0), 0);
        },
    },
    created() { this.load(); },
    methods: {
        load() {
            this.loading = true;
            axios.get(this.$apiUrl + '/seller/trips/' + this.$route.params.id, {
                params: { type: this.tripType },
            }).then(res => {
                const d              = res.data.data;
                this.settlement      = d.settlement;
                this.orders          = d.orders;
                this.totals          = d.totals;
                this.partialInvoices    = d.partial_invoices || [];
                this.cancelInvoices     = d.cancel_invoices || [];
                this.rescheduleInvoices = d.reschedule_invoices || [];
                this.returnItemSummary  = d.return_item_summary || [];
                this.loading            = false;
            }).catch(() => { this.loading = false; });
        },
        markPaymentVerifiedLocally(paymentId) {
            for (const order of this.orders) {
                const payment = (order.payments || []).find(p => p.id === paymentId);
                if (payment && payment.status !== 'verified') {
                    this.$set(payment, 'status', 'verified');
                    // Optimistic totals bump — load() will overwrite this with the
                    // authoritative server value shortly after, but without this an
                    // export/print triggered before that reload finishes reads stale
                    // (unverified) totals even though the row already shows "verified".
                    const amount = parseFloat(payment.amount || 0);
                    const round2 = (v) => parseFloat((v || 0).toFixed(2));
                    if (['upi', 'cheque', 'signature'].includes(payment.method)) {
                        this.totals.digital_verified = round2(this.totals.digital_verified + amount);
                        this.totals.unverified_digital = Math.max(0, (this.totals.unverified_digital || 0) - 1);
                        if (payment.method === 'upi') this.totals.verified_upi = round2(this.totals.verified_upi + amount);
                        if (payment.method === 'cheque') this.totals.verified_cheque = round2(this.totals.verified_cheque + amount);
                        if (payment.method === 'signature') this.totals.verified_signature = round2(this.totals.verified_signature + amount);
                    }
                    break;
                }
            }
        },
        verifyPayment(paymentId) {
            this.verifyingId = paymentId;
            axios.post(this.$apiUrl + '/seller/payments/verify', { payment_id: paymentId })
                .then(res => {
                    this.verifyingId = null;
                    // CommonHelper::responseError() replies with HTTP 200 and status:0 in
                    // the body, not an HTTP error — axios lands in .then() either way, so
                    // status must be checked here, never inferred from a resolved promise.
                    if (!res.data.status) {
                        if (res.data.message === 'already_verified') {
                            // DB already has it verified — sync UI immediately, then reload totals
                            this.markPaymentVerifiedLocally(paymentId);
                            this.load();
                        } else {
                            this.$toast.error(res.data.message || __('something_went_wrong'));
                        }
                        return;
                    }
                    this.markPaymentVerifiedLocally(paymentId);
                    this.$toast.success(__('payment_verified'));
                    this.load();
                })
                .catch(err => {
                    this.verifyingId = null;
                    this.$toast.error(err.response?.data?.message || __('something_went_wrong'));
                });
        },
        verifyPartialInvoiceItem(orderItemId) {
            if (orderItemId == null) return;
            this.verifyingPartialId = orderItemId;
            axios.post(this.$apiUrl + '/seller/trips/' + this.$route.params.id + '/partial-invoices/' + orderItemId + '/verify', {
                type: this.tripType,
            }).then(res => {
                this.verifyingPartialId = null;
                if (!res.data.status) {
                    this.$toast.error(res.data.message || __('something_went_wrong'));
                    return;
                }
                this.$toast.success(__('shortfall_verified'));
                this.load();
            }).catch(err => {
                this.verifyingPartialId = null;
                this.$toast.error(err.response?.data?.message || __('something_went_wrong'));
            });
        },
        verifyCancelInvoice(orderId) {
            if (orderId == null) return;
            this.verifyingCancelId = orderId;
            axios.post(this.$apiUrl + '/seller/trips/' + this.$route.params.id + '/cancel-invoices/' + orderId + '/verify', {
                type: this.tripType,
            }).then(res => {
                this.verifyingCancelId = null;
                if (!res.data.status) {
                    this.$toast.error(res.data.message || __('something_went_wrong'));
                    return;
                }
                this.$toast.success(__('cancellation_verified'));
                this.load();
            }).catch(err => {
                this.verifyingCancelId = null;
                this.$toast.error(err.response?.data?.message || __('something_went_wrong'));
            });
        },
        updateReceivedAmountLocally(paymentId, value) {
            if (paymentId == null) return;
            for (const order of this.orders) {
                const payment = (order.payments || []).find(p => p.id === paymentId);
                if (payment) {
                    this.$set(payment, 'received_amount', value === '' ? null : parseFloat(value));
                    break;
                }
            }
        },
        saveReceivedAmount(paymentId, value) {
            if (paymentId == null || this.isClosed) return;
            const amount = parseFloat(value);
            if (isNaN(amount) || amount < 0) return;
            axios.post(this.$apiUrl + '/seller/payments/received', {
                payment_id: paymentId, received_amount: amount,
            }).then(res => {
                if (!res.data.status) {
                    this.$toast.error(res.data.message || __('something_went_wrong'));
                    this.load();
                }
            }).catch(err => {
                this.$toast.error(err.response?.data?.message || __('something_went_wrong'));
            });
        },
        openUnlockModal() {
            this.unlockPassword = '';
            this.unlockError = '';
            this.unlockModalShow = true;
            this.$nextTick(() => this.$refs.unlockPasswordInput && this.$refs.unlockPasswordInput.focus());
        },
        submitUnlock() {
            if (!this.unlockPassword) return;
            this.unlocking = true;
            this.unlockError = '';
            axios.post(this.$apiUrl + '/seller/sensitive/verify', { password: this.unlockPassword })
                .then(res => {
                    this.unlocking = false;
                    if (res.data.status) {
                        this.methodEditUnlocked = true;
                        this.unlockModalShow = false;
                        this.unlockPassword = '';
                        return;
                    }
                    this.setUnlockError(res.data.message);
                })
                .catch(err => {
                    this.unlocking = false;
                    this.setUnlockError(err.response?.data?.message);
                });
        },
        setUnlockError(msg) {
            if (msg === 'sensitive_password_not_set') {
                this.unlockError = __('Set a sensitive operations password in Settings first.');
            } else if (msg === 'incorrect_password') {
                this.unlockError = __('Incorrect password.');
            } else {
                this.unlockError = msg || __('something_went_wrong');
            }
        },
        updateMethodLocally(paymentId, value) {
            for (const order of this.orders) {
                const payment = (order.payments || []).find(p => p.id === paymentId);
                if (payment) {
                    this.$set(payment, 'method', value);
                    break;
                }
            }
        },
        changePaymentMethod(paymentId, value) {
            if (paymentId == null || !this.methodEditUnlocked) return;
            const previous = this.flatRows.find(r => r.paymentId === paymentId)?.method;
            if (value === 'cheque') {
                // Cheque needs date + number before it can be saved — collect them via
                // the modal instead of saving immediately.
                this.chequeModalPaymentId = paymentId;
                this.chequeModalPreviousMethod = previous;
                this.chequeModalDate = '';
                this.chequeModalNumber = '';
                this.chequeModalError = '';
                this.updateMethodLocally(paymentId, 'cheque'); // reflect the pick in the dropdown while the modal is open
                this.chequeModalShow = true;
                this.$nextTick(() => this.$refs.chequeModalDateInput && this.$refs.chequeModalDateInput.focus());
                return;
            }
            this.updateMethodLocally(paymentId, value);
            this.saveMethodChange(paymentId, value, previous);
        },
        saveMethodChange(paymentId, value, previous) {
            return axios.post(this.$apiUrl + '/seller/payments/update-method', {
                payment_id: paymentId, method: value,
            }).then(res => {
                if (res.data.status) {
                    this.$toast.success(__('method_updated'));
                    this.load();
                    return true;
                }
                if (previous) this.updateMethodLocally(paymentId, previous);
                if (res.data.message === 'sensitive_unlock_required') {
                    this.methodEditUnlocked = false;
                    this.$toast.error(__('Editing session expired — click Edit to unlock again.'));
                } else {
                    this.$toast.error(res.data.message || __('something_went_wrong'));
                }
                return false;
            }).catch(err => {
                if (previous) this.updateMethodLocally(paymentId, previous);
                this.$toast.error(err.response?.data?.message || __('something_went_wrong'));
                return false;
            });
        },
        cancelChequeModal() {
            if (this.chequeModalPaymentId != null && this.chequeModalPreviousMethod) {
                this.updateMethodLocally(this.chequeModalPaymentId, this.chequeModalPreviousMethod);
            }
            this.chequeModalShow = false;
        },
        submitChequeModal() {
            if (!this.chequeModalDate || !this.chequeModalNumber) return;
            this.chequeModalSaving = true;
            this.chequeModalError = '';
            const paymentId = this.chequeModalPaymentId;
            axios.post(this.$apiUrl + '/seller/payments/update-method', {
                payment_id: paymentId, method: 'cheque',
                cheque_date: this.chequeModalDate, cheque_number: this.chequeModalNumber,
            }).then(res => {
                this.chequeModalSaving = false;
                if (res.data.status) {
                    this.$toast.success(__('method_updated'));
                    this.chequeModalShow = false;
                    this.load();
                    return;
                }
                if (this.chequeModalPreviousMethod) this.updateMethodLocally(paymentId, this.chequeModalPreviousMethod);
                if (res.data.message === 'sensitive_unlock_required') {
                    this.methodEditUnlocked = false;
                    this.chequeModalShow = false;
                    this.$toast.error(__('Editing session expired — click Edit to unlock again.'));
                } else {
                    this.chequeModalError = res.data.message || __('something_went_wrong');
                }
            }).catch(err => {
                this.chequeModalSaving = false;
                if (this.chequeModalPreviousMethod) this.updateMethodLocally(paymentId, this.chequeModalPreviousMethod);
                this.chequeModalError = err.response?.data?.message || __('something_went_wrong');
            });
        },
        updateChequeDateLocally(paymentId, value) {
            for (const order of this.orders) {
                const payment = (order.payments || []).find(p => p.id === paymentId);
                if (payment) {
                    this.$set(payment, 'cheque_date', value);
                    break;
                }
            }
        },
        updateChequeNumberLocally(paymentId, value) {
            for (const order of this.orders) {
                const payment = (order.payments || []).find(p => p.id === paymentId);
                if (payment) {
                    this.$set(payment, 'cheque_number', value);
                    break;
                }
            }
        },
        // Inline correction of date/number on a row that's already cheque — no modal
        // needed here, mirrors how receivedAmount is edited inline elsewhere on this page.
        saveChequeDetails(paymentId) {
            if (paymentId == null || this.isClosed) return;
            const row = this.flatRows.find(r => r.paymentId === paymentId);
            if (!row || !row.chequeDate || !row.chequeNumber) return;
            axios.post(this.$apiUrl + '/seller/payments/update-method', {
                payment_id: paymentId, method: 'cheque',
                cheque_date: row.chequeDate, cheque_number: row.chequeNumber,
            }).then(res => {
                if (!res.data.status) {
                    this.$toast.error(res.data.message || __('something_went_wrong'));
                    this.load();
                }
            }).catch(err => {
                this.$toast.error(err.response?.data?.message || __('something_went_wrong'));
            });
        },
        closeTrip() {
            if (!this.canCloseNow) return;
            this.$bvModal.msgBoxConfirm(__('verify_close_trip') + '?', {
                okVariant: 'primary', okTitle: __('confirm'), cancelTitle: __('cancel'),
            }).then(ok => {
                if (!ok) return;
                this.closing = true;
                axios.post(this.$apiUrl + '/seller/trips/' + this.$route.params.id + '/close', {
                    type: this.tripType,
                }).then(res => {
                    this.closing = false;
                    // CommonHelper::responseError() replies with HTTP 200 and status:0 in
                    // the body, not an HTTP error — axios lands in .then() either way, so
                    // status must be checked here, not inferred from a resolved promise.
                    if (!res.data.status) {
                        this.$toast.error(res.data.message || __('something_went_wrong'));
                        this.load();
                        return;
                    }
                    const creditNotes = res.data?.data?.credit_notes || [];
                    this.$toast.success(creditNotes.length
                        ? __('trip_closed') + ' — ' + creditNotes.length + ' ' + __('credit_notes_generated')
                        : __('trip_closed'));
                    this.load();
                }).catch(err => {
                    this.closing = false;
                    this.$toast.error(err.response?.data?.message || __('something_went_wrong'));
                });
            });
        },
        exportReport(format) {
            if (format === 'pdf') {
                this.exportReportPdf();
            } else {
                this.exportReportCsv();
            }
        },
        exportReportCsv() {
            const rows = [
                ['Invoice #', 'Loading Slip', 'Retailer', 'Order Value', 'Method', 'Collected', 'Status'],
                ...this.flatRows.map(r => [
                    r.invoiceNumber || ('#' + r.ordersId), r.loadingSlipNo || '-', r.retailerName,
                    r.finalTotal, r.method || '-', r.amount, r.paymentStatus || '-',
                ]),
            ];
            const csv  = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href = url;
            a.download = 'settlement-' + this.tripType + '-' + this.$route.params.id + '.csv';
            a.click();
            URL.revokeObjectURL(url);
        },
        exportReportPdf() {
            const doc     = new jsPDF();
            const pageW   = doc.internal.pageSize.getWidth();
            const money   = (val) => 'Rs. ' + this.fmt(val);
            const personName = this.settlement.person ? this.settlement.person.name : '-';
            const typeLabel  = this.tripType === 'salesman' ? __('salesman') : __('driver');

            // Header bar
            doc.setFillColor(52, 58, 64);
            doc.rect(0, 0, pageW, 22, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(15);
            doc.setFont(undefined, 'bold');
            doc.text(__('trip_reconciliation') || 'Trip Reconciliation', 14, 14);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.text('#' + this.$route.params.id, pageW - 14, 14, { align: 'right' });
            doc.setTextColor(0, 0, 0);

            // Person / type / date + status summary table
            autoTable(doc, {
                startY: 28,
                theme: 'plain',
                styles: { fontSize: 9, cellPadding: 1 },
                body: [
                    [{ content: __('type'), styles: { fontStyle: 'bold' } }, typeLabel,
                     { content: __('date'), styles: { fontStyle: 'bold' } }, this.fmtDate(this.settlement.date)],
                    [{ content: __('name'), styles: { fontStyle: 'bold' } }, personName,
                     { content: __('status'), styles: { fontStyle: 'bold' } }, this.settlement.status_text],
                ],
            });

            // Reconciliation totals
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 4,
                head: [[__('total_expected'), __('digital_verified'), __('cash_expected')]],
                body: [[
                    money(this.totals.total_expected),
                    money(this.totals.digital_verified),
                    money(this.totals.cash_expected),
                ]],
                styles: { fontSize: 10, halign: 'center', cellPadding: 3 },
                headStyles: { fillColor: [233, 236, 239], textColor: [52, 58, 64], fontStyle: 'bold' },
                bodyStyles: { fontStyle: 'bold' },
            });

            // Shortfall / return calculation — up top, right under the totals, so it's the
            // first thing a distributor sees when checking whether a trip closed clean.
            const shortfall = this.totals.shortfall !== null && this.totals.shortfall !== undefined
                ? this.totals.shortfall
                : this.overallShortfall;
            const totalReturns = this.totals.total_returns || 0;
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 3,
                theme: 'plain',
                styles: { fontSize: 10, cellPadding: 2, fontStyle: 'bold' },
                body: [
                    [
                        { content: __('shortfall') + ':', styles: { halign: 'right' } },
                        { content: money(shortfall), styles: { textColor: shortfall > 0 ? [220, 53, 69] : [22, 163, 74] } },
                    ],
                    [
                        { content: (__('total_returns') || 'Total Returns') + ':', styles: { halign: 'right' } },
                        { content: money(totalReturns), styles: { textColor: totalReturns > 0 ? [234, 88, 12] : [0, 0, 0] } },
                    ],
                ],
                columnStyles: { 0: { cellWidth: pageW - 14 - 40 - 14 }, 1: { cellWidth: 40 } },
            });

            // Order / payment detail — one table PER payment method, not mixed together.
            const methodGroups = [
                { key: 'cash',      label: __('cash_payments'),      total: this.totals.total_cash },
                { key: 'upi',       label: __('upi_payments'),       total: this.totals.total_upi },
                { key: 'cheque',    label: __('cheque_payments'),    total: this.totals.total_cheque },
                { key: 'signature', label: __('signature_payments'), total: this.totals.total_signature },
            ];
            methodGroups.forEach(group => {
                const rows = this.flatRows.filter(r => r.method === group.key);
                if (rows.length === 0) return;

                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.text(group.label + ' — ' + money(group.total), 14, doc.lastAutoTable.finalY + 10);
                doc.setFont(undefined, 'normal');

                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 13,
                    head: [['Order #', 'Loading Slip', 'Invoice #', 'Retailer', 'Order Value', 'Collected', 'Status']],
                    body: rows.map(r => [
                        r.ordersId, r.loadingSlipNo || '-', r.invoiceNumber || '-', r.retailerName,
                        money(r.finalTotal), money(r.amount), r.paymentStatus || '-',
                    ]),
                    styles: { fontSize: 8, cellPadding: 2 },
                    headStyles: { fillColor: [52, 58, 64] },
                    alternateRowStyles: { fillColor: [248, 249, 250] },
                    columnStyles: { 3: { cellWidth: 40 } },
                });
            });

            // Orders with no payment recorded at all — flatRows skips these entirely (it's
            // flat per-payment, nothing to key an "empty" row off), so pull them straight
            // from this.orders instead, which always has every order regardless.
            const noPaymentRows = this.orders.filter(o => (o.payments || []).length === 0);
            if (noPaymentRows.length) {
                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.text(__('no_payment_collected') || 'No Payment Collected', 14, doc.lastAutoTable.finalY + 10);
                doc.setFont(undefined, 'normal');

                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 13,
                    head: [['Order #', 'Loading Slip', 'Invoice #', 'Retailer', 'Order Value']],
                    body: noPaymentRows.map(o => [
                        o.orders_id, o.loading_slip_no || '-', o.invoice_number || '-',
                        o.retailer ? o.retailer.name : '-', money(o.final_total),
                    ]),
                    styles: { fontSize: 8, cellPadding: 2 },
                    headStyles: { fillColor: [52, 58, 64] },
                    alternateRowStyles: { fillColor: [248, 249, 250] },
                    columnStyles: { 3: { cellWidth: 40 } },
                });
            }

            // Returns — approved return requests against orders in this trip. Refund is
            // wallet-credited, not cash the driver hands back, so it's a separate table.
            const returnRows = [];
            this.orders.forEach(order => {
                (order.returns || []).forEach(r => {
                    returnRows.push([order.orders_id, order.retailer ? order.retailer.name : '-', r.product_name, money(r.refund_amount)]);
                });
            });
            if (returnRows.length) {
                doc.setFontSize(11);
                doc.setFont(undefined, 'bold');
                doc.text((__('returns') || 'Returns') + ' — ' + money(this.totals.total_returns || 0), 14, doc.lastAutoTable.finalY + 10);
                doc.setFont(undefined, 'normal');

                autoTable(doc, {
                    startY: doc.lastAutoTable.finalY + 13,
                    head: [['Order #', 'Retailer', 'Product', 'Refund Amount']],
                    body: returnRows,
                    styles: { fontSize: 8, cellPadding: 2 },
                    headStyles: { fillColor: [234, 88, 12] },
                    alternateRowStyles: { fillColor: [255, 247, 237] },
                    columnStyles: { 2: { cellWidth: 50 } },
                });
            }

            doc.save('settlement-' + this.tripType + '-' + this.$route.params.id + '.pdf');
        },
        // Mirrors Sellers/Dashboard.vue's getStatusTranslationKey — same OrderStatusList ids.
        orderStatusLabel(id) {
            const map = { 1: 'payment_pending', 2: 'received', 3: 'processed', 4: 'shipped', 5: 'outForDelivery', 6: 'delivered', 7: 'cancelled', 8: 'returned', 9: 'pending', 10: 'ready_for_pickup', 11: 'picked_up', 12: 'rescheduled', 13: 'partial_delivery', 14: 'not_delivered' };
            const key = map[Number(id)];
            return key ? __(key) : (id || '-');
        },
        fmt(val) {
            if (val == null) return '0.00';
            return parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        fmtDate(val) {
            if (!val) return '-';
            const m = moment(val);
            return m.isValid() ? m.format('DD-MM-YYYY') : val;
        },
        fmtDateTime(val) {
            if (!val) return '-';
            const m = moment(val);
            return m.isValid() ? m.format('DD-MM-YYYY hh:mm A') : val;
        },
        methodTotal(rows, field) {
            return rows.reduce((s, r) => s + parseFloat(r[field] || 0), 0);
        },
        methodIcon(m) {
            return { cash: 'fa fa-money', upi: 'fa fa-mobile', cheque: 'fa fa-file-text', signature: 'fa fa-pencil' }[m] || 'fa fa-credit-card';
        },
        methodBadgeClass(m) {
            return { cash: 'bg-success', upi: 'bg-primary', cheque: 'bg-info', signature: 'bg-warning text-dark' }[m] || 'bg-secondary';
        },
        statusBadgeClass(s) {
            return { open: 'trip-badge--orange', locked: 'trip-badge--blue', reconciled: 'trip-badge--green', needs_rereconcile: 'trip-badge--orange' }[s] || '';
        },
        statusIcon(s) {
            return { open: 'fa fa-clock-o', locked: 'fa fa-lock', reconciled: 'fa fa-check-circle', needs_rereconcile: 'fa fa-exclamation-triangle' }[s] || 'fa fa-circle';
        },
        reconStatusLabel(s) {
            return { unreconciled: __('unreconciled'), partial_match: __('partial_match'), full_match: __('full_match'), overpaid: __('overpaid') }[s] || (s || '-');
        },
        reconStatusIcon(s) {
            return { unreconciled: 'fa fa-circle-o', partial_match: 'fa fa-exclamation-triangle', full_match: 'fa fa-check-circle', overpaid: 'fa fa-arrow-up' }[s] || 'fa fa-circle-o';
        },
        reconStatusClass(s) {
            return { unreconciled: 'text-muted', partial_match: 'text-warning fw-semibold', full_match: 'text-success fw-semibold', overpaid: 'text-info fw-semibold' }[s] || 'text-muted';
        },
    },
};
</script>

<style scoped>
.bg-purple { background-color: #7c3aed !important; color: #fff !important; }

.trip-header {
    background: #fff; border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    padding: 16px 24px; margin-bottom: 16px; overflow: visible;
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;
}
.trip-header__left { display: flex; align-items: center; gap: 16px; }
.trip-header__right { display: flex; align-items: center; gap: 12px; }
.trip-header__actions { display: flex; align-items: center; gap: 8px; }
.trip-header__divider { width: 1px; height: 20px; background: #e2e8f0; flex-shrink: 0; }

.driver-avatar {
    width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
    background: #eff6ff; color: #2563eb; border: 1px solid rgba(219, 234, 254, 0.8);
    display: flex; align-items: center; justify-content: center; font-size: 19px;
}
.driver-avatar--purple { background: #f3e8ff; color: #7c3aed; border-color: rgba(233, 213, 255, 0.8); }

.trip-header__title { display: flex; align-items: center; gap: 8px; }
.trip-header__name { font-size: 18px; font-weight: 700; color: #0f172a; letter-spacing: -0.01em; text-transform: capitalize; }
.trip-header__code {
    font-family: SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; font-weight: 500;
    padding: 2px 8px; border-radius: 6px; background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0;
}
.trip-header__meta {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 500; color: #64748b; margin-top: 4px;
}
.trip-header__dot { color: #cbd5e1; }

.trip-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 500; padding: 4px 10px; border-radius: 999px;
    border: 1px solid transparent;
}
.trip-badge__dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.trip-badge--green  { background: #ecfdf5; color: #047857; border-color: rgba(167, 243, 208, 0.8); }
.trip-badge--blue   { background: #eff6ff; color: #1d4ed8; border-color: rgba(191, 219, 254, 0.8); }
.trip-badge--orange { background: #fffbeb; color: #b45309; border-color: rgba(253, 230, 138, 0.8); }
.trip-badge--green  .trip-badge__dot { background: #10b981; }
.trip-badge--blue   .trip-badge__dot { background: #3b82f6; }
.trip-badge--orange .trip-badge__dot { background: #f59e0b; }

/* Shared by both a plain <button> in this template (the Edit button) and the
   toggle-class passed into <b-dropdown> (renders its own internal <button>, hence
   ::v-deep) — using ::v-deep throughout keeps both reachable from one rule set. */
::v-deep .trip-header__btn {
    display: inline-flex; align-items: center; gap: 6px;
    height: 36px; padding: 0 14px; font-size: 12.5px; font-weight: 600;
    border-radius: 8px; border: 1px solid transparent; transition: all .15s ease; white-space: nowrap;
}
::v-deep .trip-header__btn--secondary {
    background: #fff; color: #334155; border-color: #cbd5e1;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.02);
}
::v-deep .trip-header__btn--secondary:hover { background: #f8fafc; }
::v-deep .trip-header__btn-icon { color: #64748b; font-size: 12px; }
::v-deep .trip-header__btn--primary {
    background: #0f172a !important; color: #fff !important; border-color: #0f172a !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
::v-deep .trip-header__btn--primary:hover { background: #1e293b !important; }
::v-deep .trip-header__btn-caret { color: #94a3b8; font-size: 11px; }

.recon-tiles { display: flex; gap: 16px; flex-wrap: wrap; }
.recon-tile {
    flex: 1; min-width: 130px;
    background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 16px;
}
.recon-tile--blue  { border-color: #bfdbfe; background: #eff6ff; }
.recon-tile--red   { border-color: #fecaca; background: #fff5f5; }
.recon-tile--green { border-color: #bbf7d0; background: #f0fdf4; }
.recon-tile__label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: #9ca3af; margin-bottom: 6px;
}
.recon-tile__value { font-size: 22px; font-weight: 800; color: #111827; }
.recon-tile__value--blue  { color: #2563eb; }
.recon-tile__value--red   { color: #dc2626; }
.recon-tile__value--green { color: #16a34a; }

.analytics-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; border-bottom: 1px solid #f0f0f0;
}
.analytics-row:last-child { border-bottom: none; }
.analytics-row__icon {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.analytics-row__icon--green  { background: #e8f8f1; color: #22c55e; }
.analytics-row__icon--blue   { background: #e8f0fe; color: #4f8ef7; }
.analytics-row__icon--purple { background: #f3e8ff; color: #a855f7; }
.analytics-row__icon--orange { background: #fff4e5; color: #f97316; }
.analytics-row__icon--dark   { background: #e5e7eb; color: #374151; }
.analytics-row__body { flex: 1; }
.analytics-row__label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.analytics-row__value { font-size: 16px; font-weight: 700; color: #111827; }
.analytics-row__badge { flex-shrink: 0; }

.footer-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; font-weight: 700; }
.footer-value { font-size: 16px; font-weight: 800; color: #111827; }
.footer-divider { width: 1px; height: 36px; background: #e5e7eb; flex-shrink: 0; }

/* .trip-tabs / .nav-link are rendered inside <b-tabs>'s own template, not this
   component's — ::v-deep is required to reach past that component boundary. */
::v-deep .trip-tabs {
    display: inline-flex; align-items: center; gap: 4px; flex-wrap: wrap;
    padding: 4px; background: rgba(226, 232, 240, 0.6); border: 1px solid #e2e8f0;
    border-radius: 12px; border-bottom: none !important;
}
::v-deep .trip-tabs .nav-item { margin: 0; }
::v-deep .trip-tabs .nav-link {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 14px; border-radius: 8px !important;
    font-weight: 500; font-size: 14px; color: #475569;
    border: 1px solid transparent !important; background: transparent !important;
    box-shadow: none !important; transition: all .15s ease;
}
::v-deep .trip-tabs .nav-link:hover:not(.active) {
    color: #0f172a; background: rgba(255, 255, 255, 0.5) !important;
}
::v-deep .trip-tabs .nav-link.active {
    color: #0f172a; font-weight: 600;
    background: #fff !important; border-color: rgba(226, 232, 240, 0.5) !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
}
/* The theme's global common.css (and its dark-mode twin) draws its own active-tab
   accent as a synthetic bar via ::after — content/position/background-color, not a
   border — so no border/background override above ever touches it. This is the
   actual fix for the persistent green underline; kill the pseudo-element outright. */
::v-deep .trip-tabs .nav-link.active::after { display: none !important; content: none !important; }

::v-deep .trip-tabs .nav-link .trip-tab-icon { color: #94a3b8; }
::v-deep .trip-tabs .nav-link:hover:not(.active) .trip-tab-icon { color: #475569; }
::v-deep .trip-tabs .nav-link.active .trip-tab-icon { color: #059669; }

.trip-tab-title { display: inline-flex; align-items: center; gap: 8px; }
.trip-tab-icon { font-size: 14px; transition: color .15s ease; }
.trip-tab-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 20px; height: 18px; padding: 2px 6px; border-radius: 999px;
    font-size: 11px; font-weight: 600; line-height: 1;
    background: rgba(203, 213, 225, 0.6); color: #334155;
}
::v-deep .trip-tabs .nav-link.active .trip-tab-badge {
    background: #f1f5f9 !important; color: #334155 !important;
}
</style>
