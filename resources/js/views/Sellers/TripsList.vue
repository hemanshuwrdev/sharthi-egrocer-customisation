<template>
    <div class="list-page">
        <div class="page-header-bar">
            <div class="page-header-left">
                <span class="page-header-icon"><i class="fa fa-exchange"></i></span>
                <div>
                    <h1 class="page-header-title">{{ __('trip_reconciliation') }}</h1>
                    <p class="page-header-subtitle">{{ __('reconcile_driver_and_salesman_cash_collections_against_settlements') }}</p>
                </div>
            </div>
        </div>

        <div class="list-surface">
            <div class="list-toolbar has-filters">
                <div class="list-toolbar-start">
                    <div class="list-filter">
                        <span class="list-filter-label">{{ __('type') }}</span>
                        <div class="btn-group btn-group-sm trip-type-toggle" role="group">
                            <button
                                v-for="t in typeOptions" :key="t.value"
                                type="button"
                                class="btn"
                                :class="typeFilter === t.value ? 'btn-primary' : 'btn-outline-secondary'"
                                @click="setType(t.value)">
                                {{ t.label }}
                            </button>
                        </div>
                    </div>

                    <div class="list-filter">
                        <span class="list-filter-label">{{ __('status') }}</span>
                        <select v-model="statusFilter" @change="applyFilters" class="form-control form-select">
                            <option value="all">{{ __('all_statuses') }}</option>
                            <option value="open">{{ __('open') }}</option>
                            <option value="locked">{{ __('locked') }}</option>
                            <option value="reconciled">{{ __('reconciled') }}</option>
                            <option value="needs_rereconcile">{{ __('Needs Re-Reconcile') }}</option>
                        </select>
                    </div>

                    <div class="list-filter">
                        <span class="list-filter-label">{{ __('Date Range') }}</span>
                        <div class="d-flex align-items-center flex-wrap gap-2">
                            <date-range-picker :autoApply="false" :showDropdowns="true" v-model="dateRange"
                                :maxDate="maxDate" @update="applyFilters" :locale-data="dateRangePickerLocale"
                                :ranges="dateRangePickerRanges" :append-to-body="true" opens="right"></date-range-picker>
                            <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill" @click="setQuickRange('today')">{{ __('today') }}</button>
                            <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill" @click="setQuickRange('last7')">{{ __('Last 7 Days') }}</button>
                            <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill" @click="setQuickRange('this_month')">{{ __('this_month') }}</button>
                        </div>
                    </div>

                    <button v-if="hasActiveFilters" type="button" class="btn btn-sm btn-outline-danger" @click="clearFilters">
                        <i class="fa fa-times me-1" aria-hidden="true"></i>{{ __('Clear Filters') }}
                    </button>
                </div>

                <div class="list-toolbar-end">
                    <div class="list-search">
                        <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                        <b-form-input v-model="filter" type="search" @input="load"
                            :placeholder="__('search') + ' ' + __('driver') + ' / ' + __('salesman')"></b-form-input>
                    </div>
                    <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="load">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            <div v-if="loading" class="text-center py-5"><b-spinner></b-spinner></div>
            <div v-else-if="rows.length === 0" class="text-center text-muted py-5">
                <i class="fa fa-users fa-2x mb-2 d-block"></i>
                {{ __('no_data_found') }}
            </div>
            <div v-else class="table-responsive">
                            <table class="table table-hover align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th class="ps-3">{{ __('date') }}</th>
                                        <th>{{ __('type') }}</th>
                                        <th>{{ __('driver_rider') }}</th>
                                        <th class="text-end">{{ __('cash') }}</th>
                                        <th class="text-center">{{ __('status') }}</th>
                                        <th class="text-center">{{ __('reconciliation_status') }}</th>
                                        <th class="text-center">{{ __('actions') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in rows" :key="row.type + '_' + row.id">
                                        <td class="ps-3">
                                            <span class="fw-bold">{{ row.date }}</span>
                                        </td>
                                        <td>
                                            <span class="badge" :class="row.type === 'driver' ? 'bg-info' : 'bg-purple'">
                                                <i :class="row.type === 'driver' ? 'fa fa-truck' : 'fa fa-user-tie'" class="me-1"></i>
                                                {{ row.type === 'driver' ? __('driver') : __('salesman') }}
                                            </span>
                                        </td>
                                        <td>
                                            <div class="fw-semibold">{{ row.person_name }}</div>
                                            <div class="text-muted small">{{ row.person_mobile }}</div>
                                        </td>
                                        <td class="text-end">
                                            <span class="fw-bold">{{ $currency }} {{ fmt(row.total_cash) }}</span>
                                            <div class="text-muted small" v-if="row.total_upi > 0 || row.total_cheque > 0">
                                                + {{ $currency }} {{ fmt((row.total_upi || 0) + (row.total_cheque || 0) + (row.total_signature || 0)) }} digital
                                            </div>
                                        </td>
                                        <td class="text-center">
                                            <span class="badge" :class="settlementStatusClass(row.status)">
                                                <i :class="settlementStatusIcon(row.status)" class="me-1"></i>
                                                {{ row.status_text }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <span class="recon-pill" :class="reconClass(row.reconciliation_status || 'unreconciled')">
                                                <i :class="reconIcon(row.reconciliation_status || 'unreconciled')" class="me-1"></i>
                                                {{ reconLabel(row.reconciliation_status || 'unreconciled') }}
                                            </span>
                                        </td>
                                        <td class="text-center">
                                            <router-link
                                                v-if="row.id"
                                                :to="{ path: '/seller/trips/' + row.id, query: { type: row.type } }"
                                                class="btn btn-sm"
                                                :class="row.status === 'reconciled' ? 'btn-outline-success' : 'btn-primary'">
                                                <i :class="row.status === 'reconciled' ? 'fa fa-check-circle' : 'fa fa-retweet'" class="me-1"></i>
                                                {{ row.status === 'reconciled' ? __('view') : __('reconcile') }}
                                            </router-link>
                                            <span v-else class="text-muted small">-</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
            <div class="list-footer" v-if="total > perPage">
                <div></div>
                <b-pagination
                    v-model="page"
                    :total-rows="total"
                    :per-page="perPage"
                    class="list-pagination mb-0"
                    @input="load">
                </b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';

export default {
    mixins: [DateRangePickerMixin],
    components: { DateRangePicker },
    name: 'SellerTripsList',
    data() {
        return {
            loading:    false,
            rows:       [],
            total:      0,
            page:       1,
            perPage:    15,
            filter:       '',
            typeFilter:   'all',
            statusFilter: 'all',
            dateRange:    { startDate: null, endDate: null },
            maxDate:      new Date(),
            typeOptions: [
                { value: 'all',      label: 'All' },
                { value: 'driver',   label: 'Driver' },
                { value: 'salesman', label: 'Salesman' },
            ],
        };
    },
    created() {
        this.load();
    },
    computed: {
        hasActiveFilters() {
            return !!(this.filter || this.dateRange.startDate || this.dateRange.endDate || this.statusFilter !== 'all' || this.typeFilter !== 'all');
        },
    },
    methods: {
        setType(t) {
            this.typeFilter = t;
            this.page = 1;
            this.load();
        },
        applyFilters() {
            this.page = 1;
            this.load();
        },
        setQuickRange(key) {
            const ranges = {
                today: this.getTodayRange(),
                last7: this.getLast7DaysRange(),
                this_month: this.getThisMonthRange(),
            };
            const [start, end] = ranges[key];
            this.dateRange = { startDate: start, endDate: end };
            this.applyFilters();
        },
        getLast7DaysRange() {
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const start = new Date();
            start.setDate(start.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            return [start, end];
        },
        clearFilters() {
            this.filter = '';
            this.statusFilter = 'all';
            this.typeFilter = 'all';
            this.dateRange = { startDate: null, endDate: null };
            this.page = 1;
            this.load();
        },
        load() {
            this.loading = true;
            const fromDate = (this.dateRange.startDate && moment(this.dateRange.startDate).isValid())
                ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : undefined;
            const toDate = (this.dateRange.endDate && moment(this.dateRange.endDate).isValid())
                ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : undefined;
            axios.get(this.$apiUrl + '/seller/trips', {
                params: {
                    page: this.page, filter: this.filter, type: this.typeFilter,
                    status: this.statusFilter, from_date: fromDate, to_date: toDate,
                },
            }).then(res => {
                const d      = res.data.data;
                this.rows    = d.data || [];
                this.total   = d.total || this.rows.length;
                this.loading = false;
            }).catch(() => { this.loading = false; });
        },
        fmt(val) {
            if (val == null) return '0.00';
            return parseFloat(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        settlementStatusClass(s) {
            return { open: 'bg-warning text-dark', locked: 'bg-info', reconciled: 'bg-success', needs_rereconcile: 'bg-danger' }[s] || 'bg-secondary';
        },
        settlementStatusIcon(s) {
            return { open: 'fa fa-clock-o', locked: 'fa fa-lock', reconciled: 'fa fa-check-circle', needs_rereconcile: 'fa fa-exclamation-triangle' }[s] || 'fa fa-circle';
        },
        reconLabel(s) {
            return {
                unreconciled:  __('unreconciled'),
                partial_match: __('partial_match'),
                full_match:    __('full_match'),
                overpaid:      __('overpaid'),
            }[s] || s;
        },
        reconIcon(s) {
            return {
                unreconciled:  'fa fa-circle-o',
                partial_match: 'fa fa-exclamation-triangle',
                full_match:    'fa fa-check-circle',
                overpaid:      'fa fa-arrow-up',
            }[s] || 'fa fa-circle-o';
        },
        reconClass(s) {
            return {
                unreconciled:  'recon-pill--grey',
                partial_match: 'recon-pill--orange',
                full_match:    'recon-pill--green',
                overpaid:      'recon-pill--blue',
            }[s] || 'recon-pill--grey';
        },
    },
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

.trip-type-toggle .btn:first-child { border-top-left-radius: 50rem; border-bottom-left-radius: 50rem; }
.trip-type-toggle .btn:last-child  { border-top-right-radius: 50rem; border-bottom-right-radius: 50rem; }

.vue-daterange-picker {
    min-width: 220px;
}

.bg-purple { background-color: #7c3aed !important; color: #fff !important; }

.recon-pill {
    display: inline-flex; align-items: center;
    font-size: 11px; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
}
.recon-pill--grey   { background: #f3f4f6; color: #6b7280; }
.recon-pill--orange { background: #fff7ed; color: #ea580c; }
.recon-pill--green  { background: #dcfce7; color: #16a34a; }
.recon-pill--blue   { background: #e0f2fe; color: #0284c7; }
</style>
