<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('billing_overview') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('billing_overview') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <section class="section">

                <!-- Period tabs -->
                <div class="d-flex justify-content-end mb-3">
                    <div class="btn-group" role="group">
                        <button
                            v-for="tab in periodTabs" :key="tab.value"
                            type="button"
                            class="btn btn-sm"
                            :class="period === tab.value ? 'btn-primary' : 'btn-outline-primary'"
                            @click="switchPeriod(tab.value)">
                            {{ tab.label }}
                        </button>
                    </div>
                </div>

                <div v-if="loading && !billing" class="text-center py-5">
                    <b-spinner></b-spinner>
                </div>

                <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

                <template v-else-if="billing">

                    <!-- Commission rate badge -->
                    <div class="mb-3">
                        <span class="badge bg-primary fs-6">
                            {{ __('your_commission_rate') }}: {{ billing.commission_rate }}%
                        </span>
                    </div>

                    <!-- Two stat cards -->
                    <b-row class="mb-4">

                        <!-- GMV Volume card -->
                        <b-col md="6" class="mb-3 mb-md-0">
                            <div class="stat-card stat-card--gmv">
                                <div class="stat-card__icon-wrap stat-card__icon-wrap--green">
                                    <i class="fa fa-line-chart"></i>
                                </div>
                                <div class="stat-card__body">
                                    <div class="stat-card__label">{{ __('gmv_volume') }}</div>
                                    <div class="stat-card__value">
                                        {{ $currency }}&nbsp;{{ formatAmount(billing.gmv_card.current) }}
                                    </div>
                                    <div class="stat-card__meta">
                                        <span
                                            v-if="billing.gmv_card.change_percent !== null"
                                            class="stat-card__badge"
                                            :class="billing.gmv_card.change_percent >= 0 ? 'stat-card__badge--up' : 'stat-card__badge--down'">
                                            <i :class="billing.gmv_card.change_percent >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i>
                                            {{ Math.abs(billing.gmv_card.change_percent) }}%
                                        </span>
                                        <span class="stat-card__sub">{{ __('vs_previous_period') }}</span>
                                    </div>
                                    <div class="stat-card__divider"></div>
                                    <div class="stat-card__row">
                                        <div class="stat-card__row-item">
                                            <div class="stat-card__row-label">{{ __('previous_period') }}</div>
                                            <div class="stat-card__row-value">{{ $currency }} {{ formatAmount(billing.gmv_card.previous) }}</div>
                                        </div>
                                        <div class="stat-card__row-item">
                                            <div class="stat-card__row-label">{{ __('predicted_next') }}</div>
                                            <div class="stat-card__row-value text-info">{{ $currency }} {{ formatAmount(billing.gmv_card.predicted_next) }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-col>

                        <!-- Platform Service Fees card -->
                        <b-col md="6">
                            <div class="stat-card stat-card--fees">
                                <div class="stat-card__icon-wrap stat-card__icon-wrap--blue">
                                    <i class="fa fa-credit-card"></i>
                                </div>
                                <div class="stat-card__body">
                                    <div class="stat-card__label">{{ __('platform_service_fees') }}</div>
                                    <div class="stat-card__value stat-card__value--blue">
                                        {{ $currency }}&nbsp;{{ formatAmount(billing.charges_card.current) }}
                                    </div>
                                    <div class="stat-card__meta">
                                        <span class="stat-card__badge stat-card__badge--neutral">
                                            <i class="fa fa-shopping-bag"></i>
                                            {{ billing.charges_card.total_orders }} {{ __('orders') }}
                                        </span>
                                        <span class="stat-card__sub">{{ __('this_period') }}</span>
                                    </div>
                                    <div class="stat-card__divider"></div>
                                    <div class="stat-card__row">
                                        <div class="stat-card__row-item">
                                            <div class="stat-card__row-label">{{ __('commission_rate') }}</div>
                                            <div class="stat-card__row-value text-primary fw-bold">{{ billing.commission_rate }}%</div>
                                        </div>
                                        <div class="stat-card__row-item">
                                            <div class="stat-card__row-label">{{ __('per_order_avg') }}</div>
                                            <div class="stat-card__row-value">
                                                {{ $currency }} {{ billing.charges_card.total_orders > 0 ? formatAmount(billing.charges_card.current / billing.charges_card.total_orders) : '0.00' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-col>

                    </b-row>

                    <!-- Invoice History table -->
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title mb-0">{{ __('invoice_history') }}</h4>
                            <p class="text-muted small mb-0">{{ __('invoice_history_subtitle') }}</p>
                        </div>
                        <div class="card-body">

                            <div v-if="loading" class="text-center py-3"><b-spinner></b-spinner></div>
                            <div v-else>
                                <div class="table-responsive">
                                    <b-table
                                        :items="billing.history.data"
                                        :fields="historyFields"
                                        :bordered="true"
                                        show-empty
                                        small
                                        stacked="md">
                                        <template #cell(period_label)="row">
                                            <span class="fw-semibold">{{ row.item.period_label }}</span>
                                        </template>
                                        <template #cell(gross_gmv)="row">
                                            {{ $currency }} {{ row.item.gross_gmv.toFixed(2) }}
                                        </template>
                                        <template #cell(net_charges)="row">
                                            {{ $currency }} {{ row.item.net_charges.toFixed(2) }}
                                        </template>
                                        <template #cell(actions)="row">
                                            <button
                                                class="btn btn-sm btn-outline-secondary me-1"
                                                @click="viewDetail(row.item)"
                                                :title="__('view')">
                                                <i class="fa fa-eye"></i>
                                            </button>
                                        </template>
                                    </b-table>
                                </div>

                                <b-row class="mt-2">
                                    <b-col md="4" offset-md="8">
                                        <b-pagination
                                            v-model="page"
                                            :total-rows="billing.history.total"
                                            :per-page="perPage"
                                            @change="load"
                                            size="sm"
                                        ></b-pagination>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </div>

                    <!-- Period detail drawer -->
                    <div class="card mt-3" v-if="detailRow">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">{{ detailRow.period_label }} — {{ __('transactions') }}</h5>
                            <button class="btn btn-sm btn-outline-danger" @click="detailRow = null; detailTx = []">
                                {{ __('close') }}
                            </button>
                        </div>
                        <div class="card-body">
                            <div v-if="detailLoading" class="text-center py-3"><b-spinner></b-spinner></div>
                            <div v-else>
                                <div class="table-responsive">
                                    <b-table
                                        :items="detailTx"
                                        :fields="txFields"
                                        :bordered="true"
                                        show-empty small stacked="md">
                                        <template #cell(order_item_amount)="row">
                                            {{ $currency }} {{ parseFloat(row.item.order_item_amount).toFixed(2) }}
                                        </template>
                                        <template #cell(commission_amount)="row">
                                            {{ $currency }} {{ parseFloat(row.item.commission_amount).toFixed(2) }}
                                        </template>
                                        <template #cell(seller_commission_percentage)="row">
                                            {{ row.item.seller_commission_percentage }}%
                                        </template>
                                    </b-table>
                                </div>
                                <b-row class="mt-2">
                                    <b-col md="4" offset-md="8">
                                        <b-pagination
                                            v-model="detailPage"
                                            :total-rows="detailTotal"
                                            :per-page="detailPerPage"
                                            @change="loadDetailPage"
                                            size="sm"
                                        ></b-pagination>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </div>

                </template>

                <div v-else class="alert alert-info">{{ __('no_billing_data_available') }}</div>

            </section>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'SellerCommissionBilling',
    data() {
        return {
            period: 'monthly',
            periodTabs: [
                { value: 'monthly',   label: __('monthly') },
                { value: 'quarterly', label: __('quarterly') },
                { value: 'yearly',    label: __('yearly') },
            ],
            loading: false,
            billing: null,
            error: null,
            page: 1,
            perPage: 12,

            historyFields: [
                { key: 'period_label',  label: __('billing_period'),  sortable: false },
                { key: 'total_orders',  label: __('total_orders'),    class: 'text-center', sortable: false },
                { key: 'gross_gmv',     label: __('gross_gmv'),       class: 'text-center', sortable: false },
                { key: 'net_charges',   label: __('net_charges'),     class: 'text-center', sortable: false },
                { key: 'actions',       label: __('actions'),         class: 'text-center', sortable: false },
            ],

            txFields: [
                { key: 'order_id',                     label: __('order_id'),          sortable: true },
                { key: 'order_item_id',                label: __('order_item_id'),     class: 'text-center' },
                { key: 'order_item_amount',            label: __('order_item_amount'), class: 'text-center' },
                { key: 'seller_commission_percentage', label: __('commission') + ' (%)', class: 'text-center' },
                { key: 'commission_amount',            label: __('commission_amount'), class: 'text-center' },
                { key: 'added_date',                   label: __('date'),              class: 'text-center' },
            ],

            // detail drawer
            detailRow: null,
            detailTx: [],
            detailTotal: 0,
            detailPage: 1,
            detailPerPage: 20,
            detailLoading: false,
        };
    },
    created() {
        this.load(1);
    },
    methods: {
        switchPeriod(p) {
            this.period = p;
            this.page = 1;
            this.detailRow = null;
            this.detailTx = [];
            this.load(1);
        },
        load(page = 1) {
            this.loading = true;
            this.error = null;
            this.page = page;
            const offset = (page - 1) * this.perPage;
            axios.get(this.$apiUrl + '/seller/billing', {
                params: { period: this.period, limit: this.perPage, offset }
            }).then(res => {
                if (res.data && res.data.data) {
                    this.billing = res.data.data;
                } else {
                    this.error = res.data.message || 'Failed to load billing data';
                }
                this.loading = false;
            }).catch(err => {
                this.error = err.response?.data?.message || 'Server error. Please try again.';
                this.loading = false;
            });
        },
        viewDetail(row) {
            this.detailRow = row;
            this.detailPage = 1;
            this.loadDetailPage(1);
        },
        loadDetailPage(page = 1) {
            this.detailLoading = true;
            this.detailPage = page;
            const offset = (page - 1) * this.detailPerPage;
            // Derive start/end from period_key
            let startDate, endDate;
            if (this.period === 'monthly') {
                startDate = moment(this.detailRow.period_key, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
                endDate   = moment(this.detailRow.period_key, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');
            } else if (this.period === 'quarterly') {
                const [year, q] = this.detailRow.period_key.split('-Q');
                const qStart = moment().year(year).quarter(q).startOf('quarter');
                startDate = qStart.format('YYYY-MM-DD');
                endDate   = qStart.clone().endOf('quarter').format('YYYY-MM-DD');
            } else {
                startDate = moment().year(this.detailRow.period_key).startOf('year').format('YYYY-MM-DD');
                endDate   = moment().year(this.detailRow.period_key).endOf('year').format('YYYY-MM-DD');
            }
            axios.get(this.$apiUrl + '/seller/billing/transactions', {
                params: { start_date: startDate, end_date: endDate, limit: this.detailPerPage, offset }
            }).then(res => {
                if (res.data && res.data.data) {
                    this.detailTx    = res.data.data.data  || [];
                    this.detailTotal = res.data.data.total || 0;
                }
                this.detailLoading = false;
            }).catch(() => { this.detailLoading = false; });
        },
        formatAmount(val) {
            if (!val && val !== 0) return '0.00';
            if (val >= 10000000) return (val / 10000000).toFixed(2) + ' Cr';
            if (val >= 100000)   return (val / 100000).toFixed(2) + ' L';
            return parseFloat(val).toFixed(2);
        },
    },
};
</script>

<style scoped>
/* ── Stat cards ────────────────────────────────────────────────── */
.stat-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: #fff;
    border-radius: 14px;
    padding: 22px 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
    border: 1px solid #f0f0f0;
    height: 100%;
    transition: box-shadow 0.2s;
}
.stat-card:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.11);
}

/* Icon circle */
.stat-card__icon-wrap {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}
.stat-card__icon-wrap--green {
    background: #e8f8f1;
    color: #22c55e;
}
.stat-card__icon-wrap--blue {
    background: #e8f0fe;
    color: #4f8ef7;
}

/* Body */
.stat-card__body {
    flex: 1;
    min-width: 0;
}
.stat-card__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9ca3af;
    margin-bottom: 4px;
}
.stat-card__value {
    font-size: 28px;
    font-weight: 800;
    color: #111827;
    line-height: 1.1;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.stat-card__value--blue {
    color: #4f8ef7;
}

/* Meta row (badge + sub-text) */
.stat-card__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 2px;
}
.stat-card__badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 700;
    padding: 2px 9px;
    border-radius: 20px;
}
.stat-card__badge--up   { background: #dcfce7; color: #16a34a; }
.stat-card__badge--down { background: #fee2e2; color: #dc2626; }
.stat-card__badge--neutral { background: #eff6ff; color: #3b82f6; }
.stat-card__sub {
    font-size: 11px;
    color: #b0b7c3;
}

/* Divider */
.stat-card__divider {
    border-top: 1px solid #f3f4f6;
    margin: 12px 0;
}

/* Bottom two-column row */
.stat-card__row {
    display: flex;
    gap: 24px;
}
.stat-card__row-item {
    flex: 1;
    min-width: 0;
}
.stat-card__row-label {
    font-size: 11px;
    color: #9ca3af;
    margin-bottom: 2px;
    white-space: nowrap;
}
.stat-card__row-value {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
