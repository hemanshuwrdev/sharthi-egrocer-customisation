<template>
    <div class="container-fluid py-4">
        <!-- Header Section -->
        <div class="page-header-bar">
            <div class="page-header-left">
                <span class="page-header-icon"><i class="fa fa-file-text"></i></span>
                <div>
                    <h1 class="page-header-title">{{ __('loading_slips_and_dispatches') }}</h1>
                    <p class="page-header-subtitle">{{ __('track_and_dispatch_warehouse_loading_slips') }}</p>
                </div>
            </div>
            <div class="page-header-actions" v-if="isSeller">
                <router-link :to="urlPrefix + '/loading_slips/create'" class="btn btn-primary btn-lg shadow-sm font-weight-bold rounded-pill">
                    <i class="fa fa-plus-circle mr-2"></i>{{ __('plan_new_slip') }}
                </router-link>
            </div>
        </div>

        <!-- Listing Card -->
        <div class="card border-0 shadow-sm rounded-lg overflow-hidden">
            <div class="card-header border-0 py-3">
                <h6 class="m-0 font-weight-bold">{{ __('distribution_runs') }}</h6>
            </div>
            <div class="card-body p-0">
                <div class="p-3 border-bottom">
                    <div class="list-toolbar has-filters">
                        <div class="list-toolbar-start">
                            <div class="list-filter">
                                <span class="list-filter-label">{{ __('status') }}</span>
                                <select v-model="statusFilter" @change="applyFilters" class="form-control form-select">
                                    <option value="all">{{ __('all_statuses') }}</option>
                                    <option value="0">{{ __('planned') }}</option>
                                    <option value="1">{{ __('dispatched') }}</option>
                                    <option value="2">{{ __('completed') }}</option>
                                    <option value="3">{{ __('cancelled') }}</option>
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
                                <b-form-input id="filter-input" v-model="filter" @input="getSlips" type="search"
                                    :placeholder="__('search_by_slip_no_vehicle_driver')"></b-form-input>
                            </div>
                            <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getSlips()">
                                <i class="fa fa-refresh" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table align-items-center table-flush table-hover mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th class="py-3 font-weight-bold text-muted">{{ __('slip_no') }}</th>
                                <th class="py-3 font-weight-bold text-muted">{{ __('vehicle_details') }}</th>
                                <th class="py-3 font-weight-bold text-muted">{{ __('driver_rider') }}</th>
                                <th class="py-3 font-weight-bold text-muted text-center">{{ __('orders') }}</th>
                                <th class="py-3 font-weight-bold text-muted text-right">{{ __('total_weight') }}</th>
                                <th class="py-3 font-weight-bold text-muted text-center">{{ __('status') }}</th>
                                <th class="py-3 font-weight-bold text-muted text-center">{{ __('actions') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="slip in slips" :key="slip.id" class="transition-all">
                                <td class="font-weight-bold text-primary py-3">
                                    <router-link :to="urlPrefix + '/loading_slips/view/' + slip.id">
                                        {{ slip.slip_no }}
                                    </router-link>
                                </td>
                                <td>
                                    <div class="font-weight-bold" v-if="slip.vehicle">{{ slip.vehicle.name }}</div>
                                    <small class="text-muted" v-if="slip.vehicle">{{ slip.vehicle.vehicle_number }}</small>
                                </td>
                                <td>
                                    <div class="font-weight-bold" v-if="slip.driver">{{ slip.driver.name }}</div>
                                    <small class="text-muted" v-if="slip.driver">{{ slip.driver.mobile }}</small>
                                </td>
                                <td class="text-center font-weight-bold">
                                    <span class="badge bg-soft-info text-info">{{ slip.total_orders }} {{ __('orders') }}</span>
                                </td>
                                <td class="text-right font-weight-bold">
                                    {{ slip.total_weight }} {{ __('kg') }}
                                </td>
                                <td class="text-center">
                                    <span v-if="slip.status == 0" class="badge bg-soft-warning font-weight-bold">
                                        <i class="fa fa-clock-o mr-1 text-warning"></i> {{ __('planned') }}
                                    </span>
                                    <span v-else-if="slip.status == 3" class="badge bg-soft-danger font-weight-bold">
                                        <i class="fa fa-ban mr-1 text-danger"></i> {{ __('cancelled') }}
                                    </span>
                                    <span v-else class="badge bg-soft-success font-weight-bold">
                                        <i class="fa fa-truck mr-1 text-success"></i> {{ __('dispatched') }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <div class="d-flex align-items-center justify-content-center gap-2">
                                        <router-link :to="urlPrefix + '/loading_slips/view/' + slip.id" class="btn btn-sm btn-soft-primary" :title="__('view_details')">
                                            <i class="fa fa-eye"></i>
                                        </router-link>

                                        <!-- Always rendered (visibility, not v-if) so every row's action buttons
                                             stay column-aligned regardless of which ones apply to that row. -->
                                        <button :class="{ invisible: !(slip.status == 0 && isSeller) }" @click="dispatchSlip(slip.id)" class="btn btn-sm btn-soft-success" :title="__('dispatch_out_for_delivery')">
                                            <i class="fa fa-send"></i> {{ __('dispatch') }}
                                        </button>

                                        <button :class="{ invisible: !(slip.status == 0 && isSeller) }" @click="cancelSlip(slip.id)" class="btn btn-sm btn-soft-danger" :title="__('cancel_loading_slip')">
                                            <i class="fa fa-ban"></i> {{ __('cancel') }}
                                        </button>

                                        <button @click="printSlip(slip.id)" class="btn btn-sm btn-soft-secondary" :title="__('print_loading_slip')">
                                            <i class="fa fa-print"></i> {{ __('print') }}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="slips.length === 0">
                                <td colspan="7" class="text-center py-5 text-muted">
                                    <i class="fa fa-folder-open fa-2x mb-3 text-light"></i>
                                    <p class="mb-0">{{ __('no_distribution_slips_found') }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- Pagination -->
            <div class="card-footer border-0 py-3" v-if="total > per_page">
                <b-pagination v-model="page" :total-rows="total" :per-page="per_page" align="right" class="mb-0" @input="getSlips"></b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';

export default {
    name: 'ManageLoadingSlips',
    mixins: [DateRangePickerMixin],
    components: { DateRangePicker },
    data() {
        return {
            slips: [],
            total: 0,
            page: 1,
            per_page: 10,
            filter: '',
            loading: false,
            statusFilter: 'all',
            dateRange: { startDate: null, endDate: null },
            maxDate: new Date(),
        };
    },
    computed: {
        urlPrefix() {
            return this.$route.path.startsWith('/seller') ? '/seller' : '';
        },
        isSeller() {
            return this.$route.path.startsWith('/seller');
        },
        apiBase() {
            return this.isSeller ? this.$sellerApiUrl : this.$apiUrl;
        },
        hasActiveFilters() {
            return !!(this.filter || this.dateRange.startDate || this.dateRange.endDate || this.statusFilter !== 'all');
        },
    },
    mounted() {
        this.getSlips();
    },
    methods: {
        applyFilters() {
            this.page = 1;
            this.getSlips();
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
            this.dateRange = { startDate: null, endDate: null };
            this.page = 1;
            this.getSlips();
        },
        getSlips() {
            const fromDate = (this.dateRange.startDate && moment(this.dateRange.startDate).isValid())
                ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : undefined;
            const toDate = (this.dateRange.endDate && moment(this.dateRange.endDate).isValid())
                ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : undefined;
            axios.get(this.apiBase + '/loading_slips', {
                params: {
                    page: this.page,
                    per_page: this.per_page,
                    filter: this.filter,
                    status: this.statusFilter,
                    from_date: fromDate,
                    to_date: toDate,
                }
            }).then(res => {
                if (res.data.status === 1) {
                    this.slips = res.data.data.data || res.data.data;
                    this.total = res.data.data.total || this.slips.length;
                }
            });
        },
        dispatchSlip(id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('this_will_change_loading_slip_status_to_dispatched_and_update_all_assigned_orders_to_out_for_delivery'),
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: __('yes_dispatch_now'),
                cancelButtonText: __('cancel'),
                confirmButtonColor: '#1cc88a',
                cancelButtonColor: '#858796',
            }).then(result => {
                if (result.isConfirmed) {
                    axios.post(this.apiBase + '/loading_slips/dispatch', { id: id })
                        .then(res => {
                            if (res.data.status === 1) {
                                this.showMessage('success', res.data.message);
                                this.getSlips();
                            } else {
                                this.showError(res.data.message);
                            }
                        }).catch(err => {
                            this.showError(__('an_error_occurred_during_dispatch'));
                        });
                }
            });
        },
        cancelSlip(id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('this_will_cancel_the_loading_slip_and_release_all_its_orders_so_they_can_be_added_to_a_new_slip'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: __('yes_cancel_slip'),
                cancelButtonText: __('no'),
                confirmButtonColor: '#e74a3b',
                cancelButtonColor: '#858796',
            }).then(result => {
                if (result.isConfirmed) {
                    axios.post(this.apiBase + '/loading_slips/cancel', { id: id })
                        .then(res => {
                            if (res.data.status === 1) {
                                this.showMessage('success', res.data.message);
                                this.getSlips();
                            } else {
                                this.showError(res.data.message);
                            }
                        }).catch(err => {
                            this.showError(__('an_error_occurred_during_cancellation'));
                        });
                }
            });
        },
        printSlip(id) {
            window.open(this.apiBase + '/loading_slips/print/' + id, '_blank');
        }
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

.vue-daterange-picker {
    min-width: 220px;
}

.bg-soft-primary {
    background-color: rgba(78, 115, 223, 0.1) !important;
    color: #4e73df !important;
}
.bg-soft-secondary {
    background-color: rgba(133, 135, 150, 0.1) !important;
    color: #858796 !important;
}
.bg-soft-info {
    background-color: rgba(54, 185, 204, 0.1) !important;
    color: #36b9cc !important;
}
.bg-soft-success {
    background-color: rgba(28, 200, 138, 0.1) !important;
    color: #1cc88a !important;
}
.bg-soft-warning {
    background-color: rgba(246, 194, 62, 0.1) !important;
    color: #f6c23e !important;
}
.bg-soft-danger {
    background-color: rgba(231, 74, 59, 0.1) !important;
    color: #e74a3b !important;
}
.btn-soft-primary {
    background-color: rgba(78, 115, 223, 0.1);
    color: #4e73df;
    border: none;
    transition: all 0.2s;
}
.btn-soft-primary:hover {
    background-color: #4e73df;
    color: white;
}
.btn-soft-success {
    background-color: rgba(28, 200, 138, 0.1);
    color: #1cc88a;
    border: none;
    transition: all 0.2s;
}
.btn-soft-success:hover {
    background-color: #1cc88a;
    color: white;
}
.btn-soft-secondary {
    background-color: rgba(133, 135, 150, 0.1);
    color: #858796;
    border: none;
    transition: all 0.2s;
}
.btn-soft-secondary:hover {
    background-color: #858796;
    color: white;
}
.transition-all {
    transition: all 0.25s ease-in-out;
}
.hover-bg-light:hover {
    background-color: rgba(248, 249, 250, 0.9) !important;
    transform: translateY(-1px);
}
.gap-2 {
    gap: 0.5rem;
}
.rounded-pill {
    border-radius: 50rem !important;
}
</style>
