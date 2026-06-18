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
                <div v-if="loading" class="text-center py-5">
                    <b-spinner></b-spinner>
                </div>

                <div v-else-if="error" class="alert alert-danger">
                    {{ error }}
                </div>

                <div v-else-if="billing">

                    <!-- Commission rate badge -->
                    <div class="mb-3">
                        <span class="badge bg-primary fs-6">
                            {{ __('your_commission_rate') }}: {{ billing.commission_rate }}%
                        </span>
                    </div>

                    <!-- GMV cards -->
                    <b-row class="mb-3">
                        <b-col md="4" v-for="(label, key) in periodLabels" :key="key">
                            <div class="card border-0 shadow-sm">
                                <div class="card-body text-center">
                                    <div class="text-muted small mb-1">{{ label }}</div>
                                    <div class="h4 text-success fw-bold">
                                        {{ $currency }} {{ billing.gmv[key].toFixed(2) }}
                                    </div>
                                    <div class="text-muted small">{{ __('gmv') }}</div>
                                    <hr class="my-2">
                                    <div class="h5 text-primary fw-bold">
                                        {{ $currency }} {{ billing.commission_paid[key].toFixed(2) }}
                                    </div>
                                    <div class="text-muted small">{{ __('commission_paid') }}</div>
                                </div>
                            </div>
                        </b-col>
                    </b-row>

                    <!-- Transaction history -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h4 class="card-title mb-0">{{ __('commission_transaction_history') }}</h4>
                        </div>
                        <div class="card-body">
                            <!-- Filters -->
                            <b-row class="mb-3">
                                <b-col md="5">
                                    <h6 class="box-title">{{ __('from_to_date') }}</h6>
                                    <div class="d-flex align-items-center">
                                        <date-range-picker
                                            :append-to-body="true"
                                            :single-date-picker="'range'"
                                            :autoApply="false"
                                            :showDropdowns="true"
                                            v-model="dateRange"
                                            :maxDate="maxDate"
                                            @update="loadBilling(1)"
                                            :locale-data="dateRangePickerLocale"
                                            :ranges="dateRangePickerRanges"
                                        ></date-range-picker>
                                        <button class="btn btn-sm btn-danger ms-1"
                                            @click="dateRange = { startDate: null, endDate: null }; loadBilling(1)">
                                            {{ __('clear') }}
                                        </button>
                                    </div>
                                </b-col>
                                <b-col md="1" class="d-flex align-items-end">
                                    <button class="btn btn-primary btn_refresh" @click="loadBilling(1)">
                                        <i class="fa fa-refresh"></i>
                                    </button>
                                </b-col>
                            </b-row>

                            <div class="table-responsive">
                                <b-table
                                    :items="billing.transactions.data"
                                    :fields="txFields"
                                    :bordered="true"
                                    show-empty
                                    small
                                    stacked="md">
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
                                <b-col md="4">
                                    <div class="text-primary h6">
                                        {{ __('total_commission') }}: {{ $currency }} {{ billing.commission_paid.all_time.toFixed(2) }}
                                    </div>
                                </b-col>
                                <b-col md="4" offset-md="4">
                                    <b-pagination
                                        v-model="page"
                                        :total-rows="billing.transactions.total"
                                        :per-page="perPage"
                                        @change="loadBilling"
                                        size="sm"
                                    ></b-pagination>
                                </b-col>
                            </b-row>
                        </div>
                    </div>

                </div>

                <div v-else class="alert alert-info">
                    {{ __('no_billing_data_available') }}
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
    name: 'SellerCommissionBilling',
    mixins: [DateRangePickerMixin],
    components: { DateRangePicker },
    data() {
        return {
            loading: false,
            billing: null,
            error: null,
            maxDate: new Date(),
            dateRange: { startDate: null, endDate: null },
            page: 1,
            perPage: 20,
            periodLabels: {
                today:      __('today'),
                this_month: __('this_month'),
                all_time:   __('all_time'),
            },
            txFields: [
                { key: 'order_id',                    label: __('order_id'),       sortable: true },
                { key: 'order_item_id',               label: __('order_item_id'),  class: 'text-center' },
                { key: 'order_item_amount',           label: __('order_item_amount'), class: 'text-center' },
                { key: 'seller_commission_percentage',label: __('commission') + ' (%)', class: 'text-center' },
                { key: 'commission_amount',           label: __('commission_amount'), class: 'text-center' },
                { key: 'added_date',                  label: __('date'),           class: 'text-center' },
            ],
        };
    },
    created() {
        this.loadBilling(1);
    },
    methods: {
        loadBilling(page = 1) {
            this.loading = true;
            this.error = null;
            this.page = page;
            const offset = (page - 1) * this.perPage;
            axios.get(this.$apiUrl + '/seller/billing', {
                params: {
                    start_date: this.dateRange.startDate ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : undefined,
                    end_date:   this.dateRange.endDate   ? moment(this.dateRange.endDate).format('YYYY-MM-DD')   : undefined,
                    limit: this.perPage,
                    offset,
                }
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
    },
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";
</style>
