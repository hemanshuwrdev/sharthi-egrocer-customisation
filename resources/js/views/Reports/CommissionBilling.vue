<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('commission_billing') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('commission_billing') }}</li>
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

                <!-- Aggregate stat cards -->
                <div v-if="aggLoading && !agg" class="text-center py-4"><b-spinner></b-spinner></div>
                <b-row v-else-if="agg" class="mb-4">

                    <!-- Total GMV card -->
                    <b-col md="6" class="mb-3 mb-md-0">
                        <div class="stat-card stat-card--gmv">
                            <div class="stat-card__icon-wrap stat-card__icon-wrap--green">
                                <i class="fa fa-line-chart"></i>
                            </div>
                            <div class="stat-card__body">
                                <div class="stat-card__label">{{ __('gmv_volume') }}</div>
                                <div class="stat-card__value">
                                    {{ $currency }}&nbsp;{{ formatAmount(agg.gmv_card.current) }}
                                </div>
                                <div class="stat-card__meta">
                                    <span
                                        v-if="agg.gmv_card.change_percent !== null"
                                        class="stat-card__badge"
                                        :class="agg.gmv_card.change_percent >= 0 ? 'stat-card__badge--up' : 'stat-card__badge--down'">
                                        <i :class="agg.gmv_card.change_percent >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i>
                                        {{ Math.abs(agg.gmv_card.change_percent) }}%
                                    </span>
                                    <span class="stat-card__sub">{{ __('vs_previous_period') }}</span>
                                </div>
                                <div class="stat-card__divider"></div>
                                <div class="stat-card__row">
                                    <div class="stat-card__row-item">
                                        <div class="stat-card__row-label">{{ __('previous_period') }}</div>
                                        <div class="stat-card__row-value">{{ $currency }} {{ formatAmount(agg.gmv_card.previous) }}</div>
                                    </div>
                                    <div class="stat-card__row-item">
                                        <div class="stat-card__row-label">{{ __('predicted_next') }}</div>
                                        <div class="stat-card__row-value text-info">{{ $currency }} {{ formatAmount(agg.gmv_card.predicted_next) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-col>

                    <!-- Total Platform Fees card -->
                    <b-col md="6">
                        <div class="stat-card stat-card--fees">
                            <div class="stat-card__icon-wrap stat-card__icon-wrap--blue">
                                <i class="fa fa-credit-card"></i>
                            </div>
                            <div class="stat-card__body">
                                <div class="stat-card__label">{{ __('platform_service_fees') }}</div>
                                <div class="stat-card__value stat-card__value--blue">
                                    {{ $currency }}&nbsp;{{ formatAmount(agg.charges_card.current) }}
                                </div>
                                <div class="stat-card__meta">
                                    <span class="stat-card__badge stat-card__badge--neutral">
                                        <i class="fa fa-shopping-bag"></i>
                                        {{ agg.charges_card.total_orders }} {{ __('orders') }}
                                    </span>
                                    <span class="stat-card__sub">{{ __('this_period') }}</span>
                                </div>
                                <div class="stat-card__divider"></div>
                                <div class="stat-card__row">
                                    <div class="stat-card__row-item">
                                        <div class="stat-card__row-label">{{ __('total_distributors') }}</div>
                                        <div class="stat-card__row-value fw-bold">{{ summaryData.length }}</div>
                                    </div>
                                    <div class="stat-card__row-item">
                                        <div class="stat-card__row-label">{{ __('per_order_avg') }}</div>
                                        <div class="stat-card__row-value">
                                            {{ $currency }} {{ agg.charges_card.total_orders > 0 ? formatAmount(agg.charges_card.current / agg.charges_card.total_orders) : '0.00' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </b-col>

                </b-row>

                <!-- Tab nav -->
                <ul class="nav nav-tabs mb-3" id="commissionTabs">
                    <li class="nav-item">
                        <a class="nav-link" :class="{ active: activeTab === 'summary' }" href="#" @click.prevent="activeTab = 'summary'">
                            {{ __('distributor_summary') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" :class="{ active: activeTab === 'transactions' }" href="#" @click.prevent="activeTab = 'transactions'">
                            {{ __('all_transactions') }}
                        </a>
                    </li>
                </ul>

                <!-- ── TAB 1: Distributor Summary ── -->
                <div v-if="activeTab === 'summary'">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4 class="card-title mb-0">{{ __('distributor_gmv_commission_summary') }}</h4>
                            <button class="btn btn-sm btn-primary" @click="loadSummary">
                                <i class="fa fa-refresh"></i>
                            </button>
                        </div>
                        <div class="card-body">
                            <div v-if="summaryLoading" class="text-center py-4">
                                <b-spinner></b-spinner>
                            </div>
                            <div v-else class="table-responsive">
                                <b-table
                                    :items="summaryData"
                                    :fields="summaryFields"
                                    :filter="summaryFilter"
                                    :current-page="summaryCurrentPage"
                                    :per-page="summaryPerPage"
                                    :busy="summaryLoading"
                                    :bordered="true"
                                    show-empty
                                    small
                                    stacked="md">
                                    <template #cell(commission_rate)="row">
                                        {{ row.item.commission_rate }}%
                                    </template>
                                    <template #cell(gmv_this_month)="row">
                                        {{ $currency }} {{ row.item.gmv_this_month.toFixed(2) }}
                                    </template>
                                    <template #cell(commission_this_month)="row">
                                        {{ $currency }} {{ row.item.commission_this_month.toFixed(2) }}
                                    </template>
                                    <template #cell(gmv_all_time)="row">
                                        {{ $currency }} {{ row.item.gmv_all_time.toFixed(2) }}
                                    </template>
                                    <template #cell(commission_all_time)="row">
                                        {{ $currency }} {{ row.item.commission_all_time.toFixed(2) }}
                                    </template>
                                    <template #cell(actions)="row">
                                        <router-link
                                            :to="'/commission_billing/' + row.item.seller_id"
                                            class="btn btn-sm btn-outline-primary">
                                            {{ __('view_detail') }}
                                        </router-link>
                                    </template>
                                </b-table>
                            </div>
                            <b-row class="mt-2" v-if="summaryData.length">
                                <b-col md="3">
                                    <div class="text-success h6">
                                        {{ __('total_gmv_month') }}: {{ $currency }} {{ totalGmvMonth.toFixed(2) }}
                                    </div>
                                </b-col>
                                <b-col md="3">
                                    <div class="text-primary h6">
                                        {{ __('total_commission_month') }}: {{ $currency }} {{ totalCommMonth.toFixed(2) }}
                                    </div>
                                </b-col>
                            </b-row>
                            <b-row class="mt-2" v-if="summaryData.length">
                                <b-col md="2">
                                    <b-form-group
                                        :label="__('per_page')"
                                        label-for="summary-per-page-select"
                                        label-align-sm="right"
                                        label-size="sm"
                                        class="mb-0">
                                        <b-form-select
                                            id="summary-per-page-select"
                                            v-model="summaryPerPage"
                                            :options="summaryPageOptions"
                                            size="sm"
                                            class="form-control form-select"
                                        ></b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="4" offset-md="6">
                                    <b-pagination
                                        v-model="summaryCurrentPage"
                                        :total-rows="summaryData.length"
                                        :per-page="summaryPerPage"
                                        align="fill"
                                        size="sm"
                                        class="my-0"
                                    ></b-pagination>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </div>

                <!-- ── TAB 2: All Transactions ── -->
                <div v-if="activeTab === 'transactions'">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">{{ __('all_commission_transactions') }}</h4>
                        </div>
                        <div class="card-body">
                            <b-row class="mb-3">
                                <b-col md="4">
                                    <h6 class="box-title">{{ __('from_to_date') }}</h6>
                                    <div class="d-flex align-items-center">
                                        <date-range-picker
                                            :append-to-body="true"
                                            :single-date-picker="'range'"
                                            :autoApply="false"
                                            :showDropdowns="true"
                                            v-model="txDateRange"
                                            :maxDate="maxDate"
                                            @update="loadTransactions(1)"
                                            :locale-data="dateRangePickerLocale"
                                            :ranges="dateRangePickerRanges"
                                        ></date-range-picker>
                                        <button class="btn btn-sm btn-danger ms-1"
                                            @click="txDateRange = { startDate: null, endDate: null }; loadTransactions(1)">
                                            {{ __('clear') }}
                                        </button>
                                    </div>
                                </b-col>
                                <b-col md="3">
                                    <h6 class="box-title">{{ __('seller') }}</h6>
                                    <select v-model="txSeller" @change="loadTransactions(1)" class="form-control form-select">
                                        <option value="">{{ __('all_distributors') }}</option>
                                        <option v-for="s in sellers" :key="s.seller_id" :value="s.seller_id">{{ s.name }}</option>
                                    </select>
                                </b-col>
                                <b-col md="1" class="d-flex align-items-end">
                                    <button class="btn btn-primary btn_refresh" @click="loadTransactions(1)">
                                        <i class="fa fa-refresh"></i>
                                    </button>
                                </b-col>
                            </b-row>
                            <div v-if="txLoading" class="text-center py-4"><b-spinner></b-spinner></div>
                            <div v-else>
                                <div class="table-responsive">
                                    <b-table
                                        :items="txData"
                                        :fields="txFields2"
                                        :bordered="true"
                                        show-empty
                                        small
                                        stacked="md">
                                        <template #cell(order_item_amount)="row">{{ $currency }} {{ parseFloat(row.item.order_item_amount).toFixed(2) }}</template>
                                        <template #cell(commission_amount)="row">{{ $currency }} {{ parseFloat(row.item.commission_amount).toFixed(2) }}</template>
                                        <template #cell(seller_commission_percentage)="row">{{ row.item.seller_commission_percentage }}%</template>
                                    </b-table>
                                </div>
                                <b-row class="mt-2">
                                    <b-col md="4">
                                        <div class="text-success h6">
                                            {{ __('total_commission') }}: {{ $currency }} {{ totalTxCommission.toFixed(2) }}
                                        </div>
                                    </b-col>
                                    <b-col md="4" offset-md="4">
                                        <b-pagination
                                            v-model="txPage"
                                            :total-rows="txTotal"
                                            :per-page="txPerPage"
                                            @change="loadTransactions"
                                            size="sm"
                                        ></b-pagination>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';
import moment from 'moment';

export default {
    name: 'CommissionBilling',
    mixins: [DateRangePickerMixin],
    components: { DateRangePicker },
    data() {
        return {
            period: 'monthly',
            periodTabs: [
                { value: 'monthly',   label: __('monthly') },
                { value: 'quarterly', label: __('quarterly') },
                { value: 'yearly',    label: __('yearly') },
            ],
            activeTab: 'summary',
            maxDate: new Date(),

            // Aggregate cards
            aggLoading: false,
            agg: null,

            // Summary tab
            summaryLoading: false,
            summaryData: [],
            summaryFilter: null,
            summaryCurrentPage: 1,
            summaryPerPage: this.$perPage || 10,
            summaryPageOptions: this.$pageOptions || [10, 25, 50, 100],
            summaryFields: [
                { key: 'name',                  label: __('distributor'),           sortable: true },
                { key: 'mobile',                label: __('mobile'),                sortable: false },
                { key: 'commission_rate',       label: __('commission_rate'),       sortable: true,  class: 'text-center' },
                { key: 'gmv_this_month',        label: __('gmv_this_month'),        sortable: true,  class: 'text-center' },
                { key: 'commission_this_month', label: __('commission_this_month'), sortable: true,  class: 'text-center' },
                { key: 'gmv_all_time',          label: __('gmv_all_time'),          sortable: true,  class: 'text-center' },
                { key: 'commission_all_time',   label: __('commission_all_time'),   sortable: true,  class: 'text-center' },
                { key: 'actions',               label: __('actions'),               class: 'text-center' },
            ],

            // Transactions tab
            txLoading: false,
            txData: [],
            txTotal: 0,
            txPage: 1,
            txPerPage: 20,
            txDateRange: { startDate: null, endDate: null },
            txSeller: '',
            txFields2: [
                { key: 'order_id',                     label: __('order_id'),          sortable: true },
                { key: 'order_item_id',                label: __('order_item_id'),     sortable: true, class: 'text-center' },
                { key: 'seller_name',                  label: __('seller'),            sortable: true },
                { key: 'order_item_amount',            label: __('order_item_amount'), class: 'text-center' },
                { key: 'seller_commission_percentage', label: __('commission') + ' (%)', class: 'text-center' },
                { key: 'commission_amount',            label: __('commission_amount'), class: 'text-center' },
                { key: 'added_date',                   label: __('date'),              sortable: true, class: 'text-center' },
            ],

            sellers: [],
        };
    },
    computed: {
        totalGmvMonth() {
            return this.summaryData.reduce((s, r) => s + r.gmv_this_month, 0);
        },
        totalCommMonth() {
            return this.summaryData.reduce((s, r) => s + r.commission_this_month, 0);
        },
        totalTxCommission() {
            return this.txData.reduce((s, r) => s + parseFloat(r.commission_amount || 0), 0);
        },
    },
    created() {
        this.loadAggregate();
        this.loadSummary();
    },
    methods: {
        switchPeriod(p) {
            this.period = p;
            this.loadAggregate();
        },
        loadAggregate() {
            this.aggLoading = true;
            axios.get(this.$apiUrl + '/commissions/aggregate', {
                params: { period: this.period }
            }).then(res => {
                if (res.data && res.data.data) {
                    this.agg = res.data.data;
                }
                this.aggLoading = false;
            }).catch(() => { this.aggLoading = false; });
        },
        loadSummary() {
            this.summaryLoading = true;
            axios.get(this.$apiUrl + '/commissions/summary').then(res => {
                this.summaryData = res.data.data.data || [];
                this.sellers = this.summaryData;
                this.summaryLoading = false;
            }).catch(() => { this.summaryLoading = false; });
        },
        loadTransactions(page = 1) {
            this.txLoading = true;
            this.txPage = page;
            const offset = (page - 1) * this.txPerPage;
            axios.get(this.$apiUrl + '/commissions', {
                params: {
                    seller_id:  this.txSeller || undefined,
                    start_date: this.txDateRange.startDate ? moment(this.txDateRange.startDate).format('YYYY-MM-DD') : undefined,
                    end_date:   this.txDateRange.endDate   ? moment(this.txDateRange.endDate).format('YYYY-MM-DD')   : undefined,
                    limit: this.txPerPage,
                    offset,
                }
            }).then(res => {
                this.txData  = res.data.data.data  || [];
                this.txTotal = res.data.data.total || 0;
                this.txLoading = false;
            }).catch(() => { this.txLoading = false; });
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
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

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
.stat-card__icon-wrap--green { background: #e8f8f1; color: #22c55e; }
.stat-card__icon-wrap--blue  { background: #e8f0fe; color: #4f8ef7; }
.stat-card__body { flex: 1; min-width: 0; }
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
.stat-card__value--blue { color: #4f8ef7; }
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
.stat-card__badge--up      { background: #dcfce7; color: #16a34a; }
.stat-card__badge--down    { background: #fee2e2; color: #dc2626; }
.stat-card__badge--neutral { background: #eff6ff; color: #3b82f6; }
.stat-card__sub { font-size: 11px; color: #b0b7c3; }
.stat-card__divider { border-top: 1px solid #f3f4f6; margin: 12px 0; }
.stat-card__row { display: flex; gap: 24px; }
.stat-card__row-item { flex: 1; min-width: 0; }
.stat-card__row-label { font-size: 11px; color: #9ca3af; margin-bottom: 2px; white-space: nowrap; }
.stat-card__row-value {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
