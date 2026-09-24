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
                <div class="card mb-4 trip-header">
                    <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="driver-avatar" :class="tripType === 'salesman' ? 'driver-avatar--purple' : ''">
                                <i :class="tripType === 'salesman' ? 'fa fa-user-tie' : 'fa fa-truck'"></i>
                            </div>
                            <div>
                                <div class="fw-bold fs-5">{{ settlement.person ? settlement.person.name : '-' }}</div>
                                <div class="text-muted small">
                                    <span class="badge me-1" :class="tripType === 'salesman' ? 'bg-purple' : 'bg-info'">
                                        {{ tripType === 'salesman' ? __('salesman') : __('driver') }}
                                    </span>
                                    {{ settlement.date }}
                                    &nbsp;·&nbsp; {{ __('total_orders') }}: {{ orders.length }}
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="trip-badge" :class="statusBadgeClass(settlement.status)">
                                <i :class="statusIcon(settlement.status)" class="me-1"></i>
                                {{ settlement.status_text }}
                            </span>
                            <span v-if="methodEditUnlocked" class="text-success small fw-semibold">
                                <i class="fa fa-unlock me-1"></i>{{ __('editing_enabled') }}
                            </span>
                            <b-button v-else variant="outline-danger" size="sm" @click="openUnlockModal">
                                <i class="fa fa-lock me-1"></i>{{ __('edit') }}
                            </b-button>
                            <b-dropdown v-if="isClosed" variant="outline-secondary" size="sm" right boundary="window" class="export-dropdown">
                                <template #button-content>
                                    <i class="fa fa-download me-1"></i>{{ __('export_report') }}
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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default {
    name: 'SellerTripReconciliation',
    data() {
        return {
            loading:     true,
            settlement:  null,
            orders:      [],
            totals: {
                total_expected: 0, total_collected: 0,
                total_cash: 0, total_upi: 0, total_cheque: 0, total_signature: 0,
                verified_upi: 0, verified_cheque: 0, verified_signature: 0,
                digital_verified: 0, cash_expected: 0, cash_received: null,
                has_cash: false, unverified_digital: 0,
            },
            closing:     false,
            verifyingId: null,
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
            return this.totals.unverified_digital === 0;
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
    },
    created() { this.load(); },
    methods: {
        load() {
            this.loading = true;
            axios.get(this.$apiUrl + '/seller/trips/' + this.$route.params.id, {
                params: { type: this.tripType },
            }).then(res => {
                const d          = res.data.data;
                this.settlement  = d.settlement;
                this.orders      = d.orders;
                this.totals      = d.totals;
                this.loading     = false;
            }).catch(() => { this.loading = false; });
        },
        markPaymentVerifiedLocally(paymentId) {
            for (const order of this.orders) {
                const payment = (order.payments || []).find(p => p.id === paymentId);
                if (payment) {
                    this.$set(payment, 'status', 'verified');
                    break;
                }
            }
        },
        verifyPayment(paymentId) {
            this.verifyingId = paymentId;
            axios.post(this.$apiUrl + '/seller/payments/verify', { payment_id: paymentId })
                .then(() => {
                    this.verifyingId = null;
                    this.markPaymentVerifiedLocally(paymentId);
                    this.$toast.success(__('payment_verified'));
                    this.load();
                })
                .catch(err => {
                    this.verifyingId = null;
                    const msg = err.response?.data?.message || '';
                    if (msg === 'already_verified') {
                        // DB already has it verified — sync UI immediately, then reload totals
                        this.markPaymentVerifiedLocally(paymentId);
                        this.load();
                    } else {
                        this.$toast.error(msg || __('something_went_wrong'));
                    }
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
                }).then(() => {
                    this.closing = false;
                    this.$toast.success(__('trip_closed'));
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
                     { content: __('date'), styles: { fontStyle: 'bold' } }, this.settlement.date],
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

            // Order / payment detail table
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 6,
                head: [['Invoice #', 'Loading Slip', 'Retailer', 'Order Value', 'Method', 'Collected', 'Status']],
                body: this.flatRows.map(r => [
                    r.invoiceNumber || ('#' + r.ordersId), r.loadingSlipNo || '-', r.retailerName,
                    money(r.finalTotal), r.method || '-', money(r.amount), r.paymentStatus || '-',
                ]),
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [52, 58, 64] },
                alternateRowStyles: { fillColor: [248, 249, 250] },
                columnStyles: { 2: { cellWidth: 40 } },
            });

            doc.save('settlement-' + this.tripType + '-' + this.$route.params.id + '.pdf');
        },
        fmt(val) {
            if (val == null) return '0.00';
            return parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

.trip-header, .trip-header .card-body { overflow: visible; }

.driver-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: #e8f0fe; color: #4f8ef7;
    display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
}
.driver-avatar--purple { background: #f3e8ff; color: #7c3aed; }

.trip-badge {
    display: inline-flex; align-items: center;
    font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 20px;
}
.trip-badge--green  { background: #dcfce7; color: #16a34a; }
.trip-badge--blue   { background: #e0f2fe; color: #0284c7; }
.trip-badge--orange { background: #fff7ed; color: #ea580c; }

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
</style>
