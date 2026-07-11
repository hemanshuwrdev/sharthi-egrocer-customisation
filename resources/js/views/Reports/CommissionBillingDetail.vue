<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ seller ? seller.name : __('commission_billing') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item">
                                    <router-link to="/commission_billing">{{ __('commission_billing') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ seller ? seller.name : __('detail') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <section class="section">

                <div v-if="loading && !seller" class="text-center py-5">
                    <b-spinner></b-spinner>
                </div>

                <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

                <template v-else-if="data">

                    <!-- Seller info bar -->
                    <div class="card mb-3">
                        <div class="card-body py-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <div>
                                    <h5 class="mb-0 fw-bold">{{ seller.name }}</h5>
                                    <div class="text-muted small">{{ seller.mobile }}</div>
                                </div>
                                <div class="mx-3">
                                    <span class="badge bg-primary px-3 py-2">
                                        {{ __('commission_rate') }}: {{ seller.commission_rate }}%
                                    </span>
                                </div>
                                <div>
                                    <router-link to="/commission_billing" class="btn btn-sm btn-outline-secondary">
                                        <i class="fa fa-arrow-left mr-1"></i> {{ __('back') }}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- GMV + Commission stat cards -->
                    <b-row class="mb-4">
                        <b-col md="4" v-for="(label, key) in periodLabels" :key="key" class="mb-3 mb-md-0">
                            <div class="stat-card" :class="'stat-card--' + key">
                                <div class="stat-card__icon-wrap" :class="iconClass(key)">
                                    <i :class="iconName(key)"></i>
                                </div>
                                <div class="stat-card__body">
                                    <div class="stat-card__label">{{ label }}</div>

                                    <!-- GMV row -->
                                    <div class="stat-card__metric">
                                        <div class="stat-card__metric-value text-success">
                                            {{ $currency }} {{ formatAmount(data.gmv[key]) }}
                                        </div>
                                        <div class="stat-card__metric-label">{{ __('gmv') }}</div>
                                    </div>

                                    <div class="stat-card__divider"></div>

                                    <!-- Commission row -->
                                    <div class="stat-card__metric">
                                        <div class="stat-card__metric-value text-primary">
                                            {{ $currency }} {{ formatAmount(data.commission_earned[key]) }}
                                        </div>
                                        <div class="stat-card__metric-label">{{ __('commission_earned') }}</div>
                                    </div>

                                    <!-- Commission rate pill (only on all_time card) -->
                                    <div v-if="key === 'all_time'" class="mt-2">
                                        <span class="stat-card__rate-pill">
                                            {{ __('commission_rate') }}: {{ seller.commission_rate }}%
                                        </span>
                                    </div>
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
                                            @update="load(1)"
                                            :locale-data="dateRangePickerLocale"
                                            :ranges="dateRangePickerRanges"
                                        ></date-range-picker>
                                        <button class="btn btn-sm btn-danger ms-1"
                                            @click="dateRange = { startDate: null, endDate: null }; load(1)">
                                            {{ __('clear') }}
                                        </button>
                                    </div>
                                </b-col>
                                <b-col md="1" class="d-flex align-items-end">
                                    <button class="btn btn-primary btn_refresh" @click="load(1)">
                                        <i class="fa fa-refresh"></i>
                                    </button>
                                </b-col>
                            </b-row>

                            <div v-if="loading" class="text-center py-3"><b-spinner></b-spinner></div>
                            <div v-else>
                                <div class="table-responsive">
                                    <b-table
                                        :items="data.transactions.data"
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
                                            {{ __('total_commission') }}: {{ $currency }} {{ data.commission_earned.all_time.toFixed(2) }}
                                        </div>
                                    </b-col>
                                    <b-col md="4" offset-md="4" class="pr-0 d-flex justify-content-end">
                                        <b-pagination
                                            v-model="page"
                                            :total-rows="data.transactions.total"
                                            :per-page="perPage"
                                            @change="load"
                                            size="sm"
                                            class="mb-0"
                                        ></b-pagination>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </div>

                </template>

            </section>
        </div>
    </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';
import moment from 'moment';

export default {
    name: 'CommissionBillingDetail',
    mixins: [DateRangePickerMixin],
    components: { DateRangePicker },
    data() {
        return {
            loading: false,
            error: null,
            seller: null,
            data: null,
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
                { key: 'order_id',                    label: __('order_id'),          sortable: true },
                { key: 'order_item_id',               label: __('order_item_id'),     class: 'text-center' },
                { key: 'order_item_amount',           label: __('order_item_amount'), class: 'text-center' },
                { key: 'seller_commission_percentage',label: __('commission') + ' (%)', class: 'text-center' },
                { key: 'commission_amount',           label: __('commission_amount'), class: 'text-center' },
                { key: 'added_date',                  label: __('date'),              class: 'text-center' },
            ],
        };
    },
    created() {
        this.load(1);
    },
    methods: {
        load(page = 1) {
            this.loading = true;
            this.error = null;
            this.page = page;
            const sellerId = this.$route.params.seller_id;
            const offset = (page - 1) * this.perPage;
            axios.get(this.$apiUrl + '/commissions/distributor/' + sellerId, {
                params: {
                    start_date: this.dateRange.startDate ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : undefined,
                    end_date:   this.dateRange.endDate   ? moment(this.dateRange.endDate).format('YYYY-MM-DD')   : undefined,
                    limit: this.perPage,
                    offset,
                }
            }).then(res => {
                if (res.data && res.data.data) {
                    const d = res.data.data;
                    this.seller = d.seller;
                    this.data   = d;
                } else {
                    this.error = res.data.message || 'Failed to load data';
                }
                this.loading = false;
            }).catch(err => {
                this.error = err.response?.data?.message || 'Server error. Please try again.';
                this.loading = false;
            });
        },
        iconClass(key) {
            return { today: 'stat-card__icon-wrap--orange', this_month: 'stat-card__icon-wrap--green', all_time: 'stat-card__icon-wrap--blue' }[key];
        },
        iconName(key) {
            return { today: 'fa fa-sun-o', this_month: 'fa fa-calendar', all_time: 'fa fa-trophy' }[key];
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

/* ── Stat cards ─────────────────────────────────────────────────── */
.stat-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: #fff;
    border-radius: 14px;
    padding: 22px 18px;
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
.stat-card__icon-wrap--orange { background: #fff4e5; color: #f97316; }
.stat-card__icon-wrap--green  { background: #e8f8f1; color: #22c55e; }
.stat-card__icon-wrap--blue   { background: #e8f0fe; color: #4f8ef7; }

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
    margin-bottom: 10px;
}

/* Each metric block */
.stat-card__metric {
    margin-bottom: 2px;
}
.stat-card__metric-value {
    font-size: 22px;
    font-weight: 800;
    line-height: 1.15;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.stat-card__metric-label {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 1px;
}

/* Divider */
.stat-card__divider {
    border-top: 1px solid #f3f4f6;
    margin: 10px 0;
}

/* Commission rate pill */
.stat-card__rate-pill {
    display: inline-block;
    background: #eff6ff;
    color: #3b82f6;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 20px;
}
</style>
