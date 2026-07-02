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
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3" style="width:90px">{{ __('order') }} #</th>
                                        <th style="width:110px">{{ __('loading_slip') }}</th>
                                        <th>{{ __('retailer') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('order_value') }}</th>
                                        <th class="text-end" style="width:100px">{{ __('shortfall') }}</th>
                                        <th style="width:120px">{{ __('method') }}</th>
                                        <th class="text-end" style="width:110px">{{ __('collected') }}</th>
                                        <th class="text-center" style="width:70px">{{ __('proof') }}</th>
                                        <th class="text-center" style="width:100px">{{ __('status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in flatRows" :key="row.paymentId || ('empty_' + row.orderId)">
                                        <!-- Order # — span across all payment rows of this order -->
                                        <td v-if="row.isFirst" class="ps-3 fw-semibold text-primary" :rowspan="row.rowspan">
                                            #{{ row.ordersId }}
                                        </td>
                                        <!-- Loading slip # -->
                                        <td v-if="row.isFirst" :rowspan="row.rowspan">
                                            <span v-if="row.loadingSlipNo" class="badge bg-secondary">{{ row.loadingSlipNo }}</span>
                                            <span v-else class="text-muted small">—</span>
                                        </td>
                                        <!-- Retailer -->
                                        <td v-if="row.isFirst" :rowspan="row.rowspan">
                                            <div class="fw-semibold">{{ row.retailerName }}</div>
                                            <div class="text-muted small">{{ row.retailerMobile }}</div>
                                        </td>
                                        <!-- Order value -->
                                        <td v-if="row.isFirst" class="text-end fw-bold" :rowspan="row.rowspan">
                                            {{ $currency }} {{ fmt(row.finalTotal) }}
                                        </td>
                                        <!-- Order shortfall (rowspan — one cell per order) -->
                                        <td v-if="row.isFirst" class="text-end" :rowspan="row.rowspan">
                                            <span v-if="row.orderShortfall > 0.005" class="text-danger fw-bold small">
                                                - {{ $currency }} {{ fmt(row.orderShortfall) }}
                                            </span>
                                            <span v-else-if="row.orderShortfall < -0.005" class="text-primary fw-bold small">
                                                + {{ $currency }} {{ fmt(Math.abs(row.orderShortfall)) }}
                                            </span>
                                            <span v-else class="text-success">
                                                <i class="fa fa-check-circle"></i>
                                            </span>
                                        </td>

                                        <!-- No payment case (colspan=4: method+collected+proof+status) -->
                                        <td v-if="row.isEmpty" colspan="4" class="text-muted text-center small">
                                            {{ __('no_payment_recorded') }}
                                        </td>

                                        <!-- Payment columns -->
                                        <template v-if="!row.isEmpty">
                                            <td>
                                                <span class="badge" :class="methodBadgeClass(row.method)">
                                                    <i :class="methodIcon(row.method)" class="me-1"></i>{{ row.method }}
                                                </span>
                                            </td>
                                            <td class="text-end fw-semibold">{{ $currency }} {{ fmt(row.amount) }}</td>
                                            <!-- Proof image (hidden for cash) -->
                                            <td class="text-center">
                                                <a v-if="row.proofPhoto && row.method !== 'cash'" :href="'/storage/' + row.proofPhoto" target="_blank"
                                                    class="btn btn-sm btn-outline-info">
                                                    <i class="fa fa-image"></i>
                                                </a>
                                                <span v-else class="text-muted small">—</span>
                                            </td>
                                            <!-- Verify status -->
                                            <td class="text-center">
                                                <span v-if="row.method === 'cash'" class="text-muted small">—</span>
                                                <template v-else>
                                                    <span v-if="row.paymentStatus === 'verified'" class="text-success small fw-semibold">
                                                        <i class="fa fa-check-circle"></i> {{ __('verified') }}
                                                    </span>
                                                    <button v-else
                                                        class="btn btn-sm btn-outline-success"
                                                        @click="verifyPayment(row.paymentId)"
                                                        :disabled="verifyingId === row.paymentId">
                                                        <b-spinner v-if="verifyingId === row.paymentId" small></b-spinner>
                                                        <i v-else class="fa fa-check"></i>
                                                        {{ __('verify') }}
                                                    </button>
                                                </template>
                                            </td>
                                        </template>
                                    </tr>
                                </tbody>
                                <!-- Footer totals row -->
                                <tfoot class="table-light fw-bold">
                                    <tr>
                                        <td colspan="4" class="ps-3 text-end">{{ __('total') }}</td>
                                        <td class="text-end" :class="overallShortfall > 0 ? 'text-danger' : overallShortfall < 0 ? 'text-primary' : 'text-success'">
                                            <template v-if="overallShortfall > 0">- {{ $currency }} {{ fmt(overallShortfall) }}</template>
                                            <template v-else-if="overallShortfall < 0">+ {{ $currency }} {{ fmt(Math.abs(overallShortfall)) }}</template>
                                            <template v-else><i class="fa fa-check-circle"></i></template>
                                        </td>
                                        <td></td>
                                        <td class="text-end">{{ $currency }} {{ fmt(totals.total_collected) }}</td>
                                        <td colspan="2"></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

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
        };
    },
    computed: {
        tripType()        { return this.$route.query.type || 'driver'; },
        isClosed()        { return this.settlement && this.settlement.status === 'reconciled'; },
        needsRereconcile(){ return this.settlement && this.settlement.status === 'needs_rereconcile'; },
        overallShortfall() {
            return parseFloat((this.totals.total_expected - this.totals.total_collected).toFixed(2));
        },
        canCloseNow() {
            return this.totals.unverified_digital === 0;
        },
        flatRows() {
            const rows = [];
            this.orders.forEach(order => {
                const payments       = order.payments || [];
                const collected      = payments.reduce((s, p) => s + parseFloat(p.amount || 0), 0);
                const orderShortfall = parseFloat((order.final_total - collected).toFixed(2));
                const retailerName   = order.retailer ? order.retailer.name   : '-';
                const retailerMobile = order.retailer ? order.retailer.mobile : '';
                const rowspan        = payments.length || 1;

                if (payments.length === 0) {
                    rows.push({
                        orderId: order.id, ordersId: order.orders_id,
                        loadingSlipNo: order.loading_slip_no,
                        retailerName, retailerMobile,
                        finalTotal: order.final_total,
                        isEmpty: true, isFirst: true, isLast: true, rowspan: 1,
                        orderShortfall, paymentId: null, method: null, amount: 0,
                        proofPhoto: null, paymentStatus: null,
                    });
                } else {
                    payments.forEach((p, pi) => {
                        rows.push({
                            orderId: order.id, ordersId: order.orders_id,
                            loadingSlipNo: order.loading_slip_no,
                            retailerName, retailerMobile,
                            finalTotal: order.final_total,
                            isEmpty: false,
                            isFirst: pi === 0,
                            isLast:  pi === payments.length - 1,
                            rowspan, orderShortfall,
                            paymentId:     p.id,
                            method:        p.method,
                            amount:        p.amount,
                            proofPhoto:    p.proof_photo,
                            paymentStatus: p.status,
                        });
                    });
                }
            });
            return rows;
        },
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
        verifyPayment(paymentId) {
            this.verifyingId = paymentId;
            axios.post(this.$apiUrl + '/seller/payments/verify', { payment_id: paymentId })
                .then(() => {
                    this.verifyingId = null;
                    this.$toasted.success(__('payment_verified'));
                    this.load();
                })
                .catch(err => {
                    this.verifyingId = null;
                    const msg = err.response?.data?.message || '';
                    if (msg === 'already_verified') {
                        // DB already has it verified — reload to sync UI
                        this.load();
                    } else {
                        this.$toasted.error(msg || __('something_went_wrong'));
                    }
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
                    this.$toasted.success(__('trip_closed'));
                    this.load();
                }).catch(err => {
                    this.closing = false;
                    this.$toasted.error(err.response?.data?.message || __('something_went_wrong'));
                });
            });
        },
        exportReport() {
            const rows = [
                ['Order #', 'Loading Slip', 'Retailer', 'Order Value', 'Method', 'Collected', 'Status'],
                ...this.flatRows.map(r => [
                    r.ordersId, r.loadingSlipNo || '-', r.retailerName,
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
