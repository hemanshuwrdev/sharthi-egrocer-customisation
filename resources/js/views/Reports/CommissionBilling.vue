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
                                        <button class="btn btn-sm btn-outline-primary"
                                            @click="openDistributor(row.item)">
                                            {{ __('view_detail') }}
                                        </button>
                                    </template>
                                </b-table>
                            </div>
                            <!-- Summary totals -->
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
                        </div>
                    </div>

                    <!-- Distributor detail drill-down -->
                    <div class="card mt-3" v-if="detailSeller">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4 class="card-title mb-0">
                                {{ detailSeller.name }} — {{ __('detail') }}
                                <span class="badge bg-secondary ms-2">{{ detailSeller.commission_rate }}% {{ __('commission') }}</span>
                            </h4>
                            <button class="btn btn-sm btn-outline-danger" @click="detailSeller = null; detailData = null">
                                {{ __('close') }}
                            </button>
                        </div>
                        <div class="card-body">
                            <div v-if="detailLoading" class="text-center py-3"><b-spinner></b-spinner></div>
                            <div v-else-if="detailData">
                                <!-- GMV + commission cards -->
                                <b-row class="mb-3">
                                    <b-col md="2" v-for="(label, key) in gmvKeys" :key="key">
                                        <div class="card text-center border-0 shadow-sm p-2">
                                            <div class="text-muted small">{{ label }}</div>
                                            <div class="fw-bold">{{ $currency }} {{ detailData.gmv[key].toFixed(2) }}</div>
                                            <div class="text-primary small">{{ __('commission') }}: {{ $currency }} {{ detailData.commission_earned[key].toFixed(2) }}</div>
                                        </div>
                                    </b-col>
                                </b-row>
                                <!-- Transactions -->
                                <div class="table-responsive">
                                    <b-table
                                        :items="detailData.transactions.data"
                                        :fields="txFields"
                                        :bordered="true"
                                        show-empty
                                        small
                                        stacked="md">
                                        <template #cell(order_item_amount)="row">{{ $currency }} {{ parseFloat(row.item.order_item_amount).toFixed(2) }}</template>
                                        <template #cell(commission_amount)="row">{{ $currency }} {{ parseFloat(row.item.commission_amount).toFixed(2) }}</template>
                                        <template #cell(seller_commission_percentage)="row">{{ row.item.seller_commission_percentage }}%</template>
                                    </b-table>
                                </div>
                                <b-pagination
                                    v-model="detailPage"
                                    :total-rows="detailData.transactions.total"
                                    :per-page="detailPerPage"
                                    @change="loadDetail(detailSeller.seller_id, $event)"
                                    size="sm"
                                    class="mt-2"
                                ></b-pagination>
                            </div>
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
            activeTab: 'summary',
            maxDate: new Date(),

            // Summary tab
            summaryLoading: false,
            summaryData: [],
            summaryFilter: null,
            summaryFields: [
                { key: 'name',                  label: __('distributor'),          sortable: true },
                { key: 'mobile',                label: __('mobile'),               sortable: false },
                { key: 'commission_rate',       label: __('commission_rate'),      sortable: true, class: 'text-center' },
                { key: 'gmv_this_month',        label: __('gmv_this_month'),       sortable: true, class: 'text-center' },
                { key: 'commission_this_month', label: __('commission_this_month'),sortable: true, class: 'text-center' },
                { key: 'gmv_all_time',          label: __('gmv_all_time'),         sortable: true, class: 'text-center' },
                { key: 'commission_all_time',   label: __('commission_all_time'),  sortable: true, class: 'text-center' },
                { key: 'actions',               label: __('actions'),              class: 'text-center' },
            ],

            // Distributor detail drill-down
            detailSeller: null,
            detailData: null,
            detailLoading: false,
            detailPage: 1,
            detailPerPage: 15,
            gmvKeys: { today: __('today'), this_month: __('this_month'), all_time: __('all_time') },

            // Transactions tab
            txLoading: false,
            txData: [],
            txTotal: 0,
            txPage: 1,
            txPerPage: 20,
            txDateRange: { startDate: null, endDate: null },
            txSeller: '',
            txFields2: [
                { key: 'order_id',                    label: __('order_id'),       sortable: true },
                { key: 'order_item_id',               label: __('order_item_id'),  sortable: true, class: 'text-center' },
                { key: 'seller_name',                 label: __('seller'),         sortable: true },
                { key: 'order_item_amount',           label: __('order_item_amount'), class: 'text-center' },
                { key: 'seller_commission_percentage',label: __('commission') + ' (%)', class: 'text-center' },
                { key: 'commission_amount',           label: __('commission_amount'), class: 'text-center' },
                { key: 'added_date',                  label: __('date'),           sortable: true, class: 'text-center' },
            ],

            txFields: [
                { key: 'order_id',                    label: __('order_id'),       sortable: true },
                { key: 'order_item_id',               label: __('order_item_id'),  class: 'text-center' },
                { key: 'order_item_amount',           label: __('order_item_amount'), class: 'text-center' },
                { key: 'seller_commission_percentage',label: __('commission') + ' (%)', class: 'text-center' },
                { key: 'commission_amount',           label: __('commission_amount'), class: 'text-center' },
                { key: 'added_date',                  label: __('date'),           class: 'text-center' },
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
        this.loadSummary();
    },
    methods: {
        loadSummary() {
            this.summaryLoading = true;
            axios.get(this.$apiUrl + '/commissions/summary').then(res => {
                this.summaryData = res.data.data.data || [];
                this.sellers = this.summaryData;
                this.summaryLoading = false;
            }).catch(() => { this.summaryLoading = false; });
        },
        openDistributor(item) {
            this.detailSeller = item;
            this.detailPage = 1;
            this.loadDetail(item.seller_id, 1);
        },
        loadDetail(sellerId, page = 1) {
            this.detailLoading = true;
            const offset = (page - 1) * this.detailPerPage;
            axios.get(this.$apiUrl + '/commissions/distributor/' + sellerId, {
                params: { limit: this.detailPerPage, offset }
            }).then(res => {
                this.detailData = res.data.data;
                this.detailLoading = false;
            }).catch(() => { this.detailLoading = false; });
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
    },
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";
</style>
