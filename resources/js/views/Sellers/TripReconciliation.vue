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

            <section class="section" v-else-if="!slip">
                <div class="card"><div class="card-body text-center text-muted py-5">{{ __('trip_not_found') }}</div></div>
            </section>

            <section class="section" v-else>

                <!-- Driver / Slip header bar -->
                <div class="card mb-4 trip-header">
                    <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div class="d-flex align-items-center gap-3">
                            <div class="driver-avatar">
                                <i class="fa fa-user"></i>
                            </div>
                            <div>
                                <div class="fw-bold fs-5">{{ slip.driver ? slip.driver.name : '-' }}</div>
                                <div class="text-muted small">
                                    {{ __('route_id') }}: <strong>{{ slip.slip_no }}</strong>
                                    &nbsp;·&nbsp;
                                    {{ slip.vehicle ? slip.vehicle.vehicle_no : '' }}
                                    &nbsp;·&nbsp;
                                    {{ __('total_orders') }}: {{ slip.total_orders }}
                                </div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="trip-badge" :class="slipBadgeClass(slip.status)">
                                <i :class="slipIcon(slip.status)" class="me-1"></i>
                                {{ slip.status_text }}
                            </span>
                            <button class="btn btn-sm btn-outline-secondary" @click="exportReport">
                                <i class="fa fa-download me-1"></i>{{ __('export_report') }}
                            </button>
                        </div>
                    </div>
                </div>

                <div class="row">

                    <!-- Left: Collection Reconciliation -->
                    <div class="col-lg-8 mb-4">
                        <div class="card h-100">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="card-title mb-0">{{ __('collection_reconciliation') }}</h5>
                                <span v-if="slip.reconciliation_status !== 'unreconciled'" class="small">
                                    {{ __('reconciliation_status') }}:
                                    <span class="fw-semibold" :class="reconStatusClass(slip.reconciliation_status)">
                                        <i :class="reconStatusIcon(slip.reconciliation_status)" class="me-1"></i>
                                        {{ reconStatusLabel(slip.reconciliation_status) }}
                                    </span>
                                </span>
                            </div>
                            <div class="card-body">

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
                                        <div class="recon-tile__label">{{ __('current_shortfall') }}</div>
                                        <div class="recon-tile__value recon-tile__value--red">{{ $currency }} {{ fmt(totals.cash_expected) }}</div>
                                    </div>
                                </div>

                                <!-- Cash input — only if trip has cash payments -->
                                <div class="mb-3" v-if="totals.has_cash">
                                    <label class="form-label fw-semibold">{{ __('cash_collected_from_driver') }} ({{ $currency }})</label>
                                    <div class="d-flex gap-2 flex-wrap">
                                        <input
                                            type="number"
                                            v-model.number="cashInput"
                                            class="form-control"
                                            :placeholder="fmt(totals.cash_expected)"
                                            :disabled="isClosed"
                                            style="max-width:220px">
                                        <button
                                            class="btn btn-primary"
                                            @click="updateReconciliation"
                                            :disabled="reconciling || isClosed || (totals.has_cash && (cashInput === null || cashInput === ''))">
                                            <b-spinner v-if="reconciling" small class="me-1"></b-spinner>
                                            {{ __('update_reconciliation') }}
                                        </button>
                                    </div>

                                    <!-- Shortfall / overpaid alert -->
                                    <div v-if="liveShortfall !== null" class="mt-2">
                                        <div v-if="liveShortfall > 0" class="alert alert-warning py-2 mb-0 small">
                                            <i class="fa fa-exclamation-triangle me-1"></i>
                                            {{ $currency }} {{ fmt(liveShortfall) }} {{ __('shortfall_detected') }}
                                        </div>
                                        <div v-else-if="liveShortfall < 0" class="alert alert-info py-2 mb-0 small">
                                            <i class="fa fa-info-circle me-1"></i>
                                            {{ $currency }} {{ fmt(Math.abs(liveShortfall)) }} {{ __('overpaid_detected') }}
                                        </div>
                                        <div v-else class="alert alert-success py-2 mb-0 small">
                                            <i class="fa fa-check-circle me-1"></i>
                                            {{ __('full_match') }}
                                        </div>
                                    </div>
                                </div>

                                <!-- Close blockers warning -->
                                <div v-if="closeBlockers.length && !isClosed" class="alert alert-danger py-2 small mb-0">
                                    <div class="fw-semibold mb-1"><i class="fa fa-lock me-1"></i>Cannot close trip yet:</div>
                                    <ul class="mb-0 ps-3">
                                        <li v-for="b in closeBlockers" :key="b">{{ b }}</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- Right: Trip Analytics -->
                    <div class="col-lg-4 mb-4">
                        <div class="card h-100">
                            <div class="card-header">
                                <h5 class="card-title mb-0">{{ __('trip_analytics') }}</h5>
                            </div>
                            <div class="card-body p-0">
                                <div class="analytics-row">
                                    <div class="analytics-row__icon analytics-row__icon--blue">
                                        <i class="fa fa-shopping-bag"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('total_orders') }}</div>
                                        <div class="analytics-row__value">{{ orders.length }}</div>
                                    </div>
                                </div>
                                <div class="analytics-row">
                                    <div class="analytics-row__icon analytics-row__icon--green">
                                        <i class="fa fa-money"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('total_expected') }}</div>
                                        <div class="analytics-row__value">{{ $currency }} {{ fmt(totals.total_expected) }}</div>
                                    </div>
                                </div>
                                <div class="analytics-row">
                                    <div class="analytics-row__icon analytics-row__icon--purple">
                                        <i class="fa fa-mobile"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('digital_verified') }}</div>
                                        <div class="analytics-row__value">{{ $currency }} {{ fmt(totals.digital_verified) }}</div>
                                    </div>
                                </div>
                                <div class="analytics-row">
                                    <div class="analytics-row__icon analytics-row__icon--orange">
                                        <i class="fa fa-check-circle"></i>
                                    </div>
                                    <div class="analytics-row__body">
                                        <div class="analytics-row__label">{{ __('collected_orders') }}</div>
                                        <div class="analytics-row__value">{{ collectedCount }} / {{ orders.length }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Order Settlement Details -->
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">{{ __('order_settlement_details') }}</h5>
                        <span class="text-muted small">{{ __('showing') }} {{ orders.length }} {{ __('orders') }}</span>
                    </div>
                    <div class="card-body p-0">
                        <div v-if="orders.length === 0" class="text-center text-muted py-4">
                            <i class="fa fa-inbox fa-2x mb-2 d-block"></i>
                            {{ __('no_data_found') }}
                        </div>
                        <div v-else class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3">{{ __('order') }} #</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end">{{ __('amount') }}</th>
                                        <th class="text-center">{{ __('payment_status') }}</th>
                                        <th class="text-center">{{ __('payment_mode') }}</th>
                                        <th class="text-center">{{ __('proof') }}</th>
                                        <th class="text-center">{{ __('actions') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="order in orders" :key="order.id">
                                        <td class="ps-3">
                                            <span class="fw-semibold text-primary">#{{ order.orders_id }}</span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ order.retailer ? order.retailer.name : '-' }}</div>
                                            <div class="text-muted small">{{ order.retailer ? order.retailer.mobile : '' }}</div>
                                        </td>
                                        <td class="text-end fw-bold">
                                            {{ $currency }} {{ fmt(order.final_total) }}
                                        </td>
                                        <td class="text-center">
                                            <span v-if="order.payments && order.payments.length">
                                                <span
                                                    v-for="p in order.payments" :key="p.id"
                                                    class="badge me-1"
                                                    :class="p.status === 'verified' ? 'bg-success' : 'bg-warning text-dark'">
                                                    {{ p.status === 'verified' ? __('payment_collected') : __('payment_pending') }}
                                                </span>
                                            </span>
                                            <span v-else class="badge bg-secondary">{{ __('no_payment') }}</span>
                                        </td>
                                        <td class="text-center">
                                            <span
                                                v-for="p in order.payments" :key="'m'+p.id"
                                                class="badge me-1"
                                                :class="methodBadgeClass(p.method)">
                                                <i :class="methodIcon(p.method)" class="me-1"></i>{{ p.method }}
                                            </span>
                                            <span v-if="!order.payments || !order.payments.length" class="text-muted small">-</span>
                                        </td>
                                        <td class="text-center">
                                            <span v-for="p in order.payments" :key="'pp'+p.id">
                                                <a v-if="p.proof_photo" :href="'/storage/' + p.proof_photo" target="_blank" class="btn btn-sm btn-outline-info me-1">
                                                    <i class="fa fa-image"></i>
                                                </a>
                                            </span>
                                            <span v-if="!hasProof(order)" class="text-muted small">-</span>
                                        </td>
                                        <td class="text-center">
                                            <span v-for="p in order.payments" :key="'v'+p.id">
                                                <button
                                                    v-if="p.status !== 'verified' && !isClosed"
                                                    class="btn btn-sm btn-outline-success me-1"
                                                    @click="verifyPayment(p, order)"
                                                    :disabled="verifyingId === p.id">
                                                    <b-spinner v-if="verifyingId === p.id" small></b-spinner>
                                                    <i v-else class="fa fa-check"></i>
                                                    {{ __('verify') }}
                                                </button>
                                            </span>
                                            <span v-if="allVerified(order)" class="text-success small"><i class="fa fa-check-circle"></i></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Footer bar -->
                <div v-if="slip" class="card mt-3">
                    <div class="card-body d-flex align-items-center gap-4 flex-wrap">
                        <div class="me-2">
                            <div class="footer-label">{{ __('cash_in_hand') }}</div>
                            <div class="footer-value text-success">{{ $currency }} {{ fmt(cashInput !== null ? cashInput : (totals.cash_received || 0)) }}</div>
                        </div>
                        <div class="footer-divider"></div>
                        <div class="me-2">
                            <div class="footer-label">{{ __('upi') }}</div>
                            <div class="footer-value text-primary">{{ $currency }} {{ fmt(totalUpi) }}</div>
                        </div>
                        <div class="footer-divider"></div>
                        <div class="me-2">
                            <div class="footer-label">{{ __('cheque') }}</div>
                            <div class="footer-value text-info">{{ $currency }} {{ fmt(totalCheque) }}</div>
                        </div>
                        <div class="footer-divider"></div>
                        <div class="me-2">
                            <div class="footer-label">{{ __('signature') }}</div>
                            <div class="footer-value text-warning">{{ $currency }} {{ fmt(totalSignature) }}</div>
                        </div>
                        <div class="footer-divider"></div>
                        <div class="me-2">
                            <div class="footer-label">{{ __('reconciliation_status') }}</div>
                            <div class="footer-value">
                                <span :class="reconStatusClass(slip.reconciliation_status)">
                                    <i :class="reconStatusIcon(slip.reconciliation_status)" class="me-1"></i>
                                    {{ reconStatusLabel(slip.reconciliation_status) }}
                                </span>
                            </div>
                        </div>
                        <div class="ms-auto d-flex gap-2">
                            <button
                                class="btn btn-outline-secondary"
                                @click="updateReconciliation"
                                :disabled="reconciling || isClosed || (totals.has_cash && (cashInput === null || cashInput === ''))">
                                <b-spinner v-if="reconciling" small class="me-1"></b-spinner>
                                {{ __('save_draft') }}
                            </button>
                            <button
                                class="btn btn-primary"
                                @click="closeTrip"
                                :disabled="closing || isClosed || !canClose"
                                :title="closeBlockers.join(' | ')">
                                <b-spinner v-if="closing" small class="me-1"></b-spinner>
                                <i v-else class="fa fa-check-circle me-1"></i>
                                {{ isClosed ? __('trip_reconciled') : __('verify_close_trip') }}
                            </button>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SellerTripReconciliation',
    data() {
        return {
            loading:      true,
            slip:         null,
            orders:       [],
            totals:       { total_expected: 0, digital_verified: 0, cash_expected: 0, cash_received: null, shortfall: null, has_cash: false },
            canClose:     false,
            closeBlockers:[],
            cashInput:    null,
            reconciling:  false,
            closing:     false,
            verifyingId: null,
        };
    },
    computed: {
        isClosed() {
            return this.slip && this.slip.status === 2;
        },
        liveShortfall() {
            if (this.cashInput === null || this.cashInput === '') return null;
            return parseFloat((this.totals.cash_expected - this.cashInput).toFixed(2));
        },
        collectedCount() {
            return this.orders.filter(o => o.payments && o.payments.some(p => p.status === 'verified')).length;
        },
        allPayments() {
            return this.orders.flatMap(o => o.payments || []);
        },
        totalUpi() {
            return this.allPayments.filter(p => p.method === 'upi').reduce((s, p) => s + parseFloat(p.amount || 0), 0);
        },
        totalCheque() {
            return this.allPayments.filter(p => p.method === 'cheque').reduce((s, p) => s + parseFloat(p.amount || 0), 0);
        },
        totalSignature() {
            return this.allPayments.filter(p => p.method === 'signature').reduce((s, p) => s + parseFloat(p.amount || 0), 0);
        },
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            this.loading = true;
            axios.get(this.$apiUrl + '/seller/trips/' + this.$route.params.id).then(res => {
                const d           = res.data.data;
                this.slip         = d.slip;
                this.orders       = d.orders;
                this.totals       = d.totals;
                this.canClose     = d.can_close;
                this.closeBlockers= d.close_blockers || [];
                this.cashInput    = d.totals.cash_received;
                this.loading      = false;
            }).catch(() => { this.loading = false; });
        },
        updateReconciliation() {
            const cashValue = this.totals.has_cash ? this.cashInput : 0;
            if (cashValue === null || cashValue === '') return;
            this.reconciling = true;
            axios.post(this.$apiUrl + '/seller/trips/' + this.$route.params.id + '/reconcile', {
                cash_received: cashValue,
            }).then(res => {
                this.reconciling = false;
                const d = res.data.data;
                this.slip.reconciliation_status = d.reconciliation_status;
                this.totals.cash_received       = this.cashInput;
                this.totals.cash_expected       = d.cash_expected;
                this.$toasted.success(__('update_reconciliation'));
                this.load();
            }).catch(err => {
                this.reconciling = false;
                this.$toasted.error(err.response?.data?.message || __('something_went_wrong'));
            });
        },
        closeTrip() {
            this.$bvModal.msgBoxConfirm(__('verify_close_trip') + '?', {
                okVariant: 'primary', okTitle: __('confirm'), cancelTitle: __('cancel'),
            }).then(ok => {
                if (!ok) return;
                this.closing = true;
                axios.post(this.$apiUrl + '/seller/trips/' + this.$route.params.id + '/close').then(() => {
                    this.closing    = false;
                    this.slip.status     = 2;
                    this.slip.status_text = __('trip_reconciled');
                    this.$toasted.success(__('trip_closed'));
                }).catch(err => {
                    this.closing = false;
                    this.$toasted.error(err.response?.data?.message || __('something_went_wrong'));
                });
            });
        },
        verifyPayment(payment, order) {
            this.verifyingId = payment.id;
            axios.post(this.$apiUrl + '/seller/payments/verify', { payment_id: payment.id }).then(() => {
                this.verifyingId = null;
                payment.status   = 'verified';
                // refresh totals
                this.load();
                this.$toasted.success(__('payment_verified'));
            }).catch(err => {
                this.verifyingId = null;
                this.$toasted.error(err.response?.data?.message || __('something_went_wrong'));
            });
        },
        exportReport() {
            const rows = [
                ['Order #', 'Retailer', 'Amount', 'Payment Status', 'Method'],
                ...this.orders.map(o => [
                    o.orders_id,
                    o.retailer ? o.retailer.name : '-',
                    o.final_total,
                    o.payments && o.payments.length ? o.payments.map(p => p.status).join('+') : 'no_payment',
                    o.payments && o.payments.length ? o.payments.map(p => p.method).join('+') : '-',
                ]),
            ];
            const csv  = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href = url; a.download = 'trip-' + this.$route.params.id + '.csv'; a.click();
            URL.revokeObjectURL(url);
        },
        hasProof(order) {
            return order.payments && order.payments.some(p => p.proof_photo);
        },
        allVerified(order) {
            return order.payments && order.payments.length > 0 && order.payments.every(p => p.status === 'verified');
        },
        fmt(val) {
            if (val == null) return '0.00';
            return parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        methodIcon(m) {
            return { cash: 'fa fa-money', upi: 'fa fa-mobile', cheque: 'fa fa-file-text', signature: 'fa fa-pencil' }[m] || 'fa fa-credit-card';
        },
        methodBadgeClass(m) {
            return { cash: 'bg-success', upi: 'bg-primary', cheque: 'bg-info', signature: 'bg-warning text-dark' }[m] || 'bg-secondary';
        },
        slipBadgeClass(s) {
            return { 0: 'trip-badge--orange', 1: 'trip-badge--blue', 2: 'trip-badge--green', 3: 'trip-badge--red' }[s] || '';
        },
        slipIcon(s) {
            return { 0: 'fa fa-clock-o', 1: 'fa fa-truck', 2: 'fa fa-check-circle', 3: 'fa fa-times-circle' }[s] || 'fa fa-circle';
        },
        reconStatusLabel(s) {
            return { unreconciled: __('unreconciled'), partial_match: __('partial_match'), full_match: __('full_match'), overpaid: __('overpaid') }[s] || s;
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
.driver-avatar {
    width: 48px; height: 48px; border-radius: 50%;
    background: #e8f0fe; color: #4f8ef7;
    display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
}
.trip-badge {
    display: inline-flex; align-items: center;
    font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 20px;
}
.trip-badge--green  { background: #dcfce7; color: #16a34a; }
.trip-badge--blue   { background: #e0f2fe; color: #0284c7; }
.trip-badge--orange { background: #fff7ed; color: #ea580c; }
.trip-badge--red    { background: #fee2e2; color: #dc2626; }

.recon-tiles { display: flex; gap: 16px; flex-wrap: wrap; }
.recon-tile {
    flex: 1; min-width: 140px;
    background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 16px;
}
.recon-tile--blue { border-color: #bfdbfe; background: #eff6ff; }
.recon-tile--red  { border-color: #fecaca; background: #fff5f5; }
.recon-tile__label {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.06em; color: #9ca3af; margin-bottom: 6px;
}
.recon-tile__value { font-size: 22px; font-weight: 800; color: #111827; }
.recon-tile__value--blue { color: #2563eb; }
.recon-tile__value--red  { color: #dc2626; }

.analytics-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px; border-bottom: 1px solid #f0f0f0;
}
.analytics-row:last-child { border-bottom: none; }
.analytics-row__icon {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 15px;
}
.analytics-row__icon--blue   { background: #e8f0fe; color: #4f8ef7; }
.analytics-row__icon--green  { background: #e8f8f1; color: #22c55e; }
.analytics-row__icon--purple { background: #f3e8ff; color: #a855f7; }
.analytics-row__icon--orange { background: #fff4e5; color: #f97316; }
.analytics-row__label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.analytics-row__value { font-size: 16px; font-weight: 700; color: #111827; }

.footer-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; font-weight: 700; }
.footer-value { font-size: 16px; font-weight: 800; color: #111827; }
.footer-divider { width: 1px; height: 36px; background: #e5e7eb; flex-shrink: 0; }
</style>
