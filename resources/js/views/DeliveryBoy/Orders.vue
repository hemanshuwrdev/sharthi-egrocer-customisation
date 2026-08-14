<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('order_list') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/delivery_boy">{{ __('dashboard')
                                }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('order_list') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('latest_orders') }}</h4>
                    </div>
                    <div class="card-body">
                        <div class="row mb-2">
                            <b-col md="3">
                                <h6 class="box-title">{{ __('from_and_to_date') }}</h6>
                                <div class="d-flex justify-content-center align-items-center">
                                    <date-range-picker :autoApply=false :showDropdowns=true v-model="dateRange"
                                        :maxDate="maxDate" @update="handleFilterChange" :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"
                                        :append-to-body="true" opens="right"></date-range-picker>
                                    <button class="btn btn-sm btn-danger ml-1" @click="clearDate()">
                                        {{ __('clear') }}
                                    </button>
                                </div>
                            </b-col>

                            <b-col md="2" offset-md="1">
                                <h6 class="box-title" for="status">{{ __('status') }}</h6>
                                <select id="status" name="status" v-model="status" @change="handleFilterChange()"
                                    class="form-control form-select">
                                    <option value="">{{ __('all_orders') }}</option>
                                    <option v-for="status in statuses" :key="status.id" :value="status.id">{{
                                        getStatusDisplayName(status) }}</option>
                                </select>
                            </b-col>
                            <b-col md="3">
                                <h6 class="box-title">{{ __('from_and_to_delivery_date') }}</h6>
                                <div class="d-flex justify-content-center align-items-center">
                                    <date-range-picker :autoApply=false :showDropdowns=true v-model="deliveryDateRange"
                                        :maxDate="maxDate" @update="handleFilterChange" :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"
                                        :append-to-body="true" opens="left"></date-range-picker>
                                    <button class="btn btn-sm btn-danger ml-1" @click="clearDeliveryDate()">
                                        {{ __('clear') }}
                                    </button>
                                </div>
                            </b-col>
                            <b-col md="2">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input id="filter-input" v-model="search" type="search"
                                    :placeholder="__('search')" @input="handleFilterChange()"></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                                    @click="getOrders()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>

                        </div>

                        <b-tabs title="" active>
                            <div class="table-responsive mt-3">
                                <b-table :items="orders" :fields="orderFields" show-details
                                    :tbody-tr-class="() => 'cursor-pointer'" :details-td-class="'p-0 bg-light'"
                                    :current-page="currentPage"
                                    :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                                    :bordered="true" :busy="isLoading" stacked="md" show-empty small>

                                    <template #cell(id)="row">
                                        <span @click.stop="toggleOrder(row)" style="cursor:pointer;">
                                            <i class="fa"
                                                :class="row.detailsShowing ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
                                            &nbsp; {{ row.item.id }}
                                        </span>
                                    </template>
                                    <template #table-busy>
                                        <div class="text-center text-black my-2">
                                            <b-spinner class="align-middle"></b-spinner>
                                            <strong>{{ __('loading') }}...</strong>
                                        </div>
                                    </template>
                                    <template #cell(mobile)="row">
                                        {{ row.item.mobile | mobileMask }}
                                    </template>

                                    <!-- Show colored badge with status name instead of raw number -->
                                    <template #cell(active_status)="row">
                                        <span class="badge" :class="getStatusBadgeClass(row.item.active_status)">
                                            {{ getStatusLabelById(row.item.active_status) }}
                                        </span>
                                    </template>

                                    <template #cell(actions)="row">
                                        <router-link
                                            :to="{ name: 'DeliveryBoyOrder', params: { id: row.item.id, record: row.item } }"
                                            v-b-tooltip.hover title="View" class="btn btn-primary btn-sm"><i
                                                class="fa fa-eye"></i></router-link>
                                    </template>

                                    <template #row-details="row">
                                        <b-card class="m-2 p-2" style="background:#f8fafc;">
                                            <div class="table-responsive">
                                                <table class="table table-sm table-hover bg-white mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th>{{ __('product') }}</th>
                                                            <th>{{ __('image') }}</th>
                                                            <th>{{ __('variant') }}</th>
                                                            <th>{{ __('qty') }}</th>
                                                            <th>{{ __('subtotal') }}</th>
                                                            <th>{{ __('status') }}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-if="row.item.itemsLoading">
                                                            <td colspan="6" class="text-center p-3">
                                                                <b-spinner small></b-spinner> {{ __('loading') }}...
                                                            </td>
                                                        </tr>
                                                        <template v-else-if="row.item.order_items && row.item.order_items.length">
                                                            <tr v-for="item in row.item.order_items" :key="item.id">
                                                                <td>{{ item.product_name }}</td>
                                                                <td>
                                                                    <img :src="item.image" alt="Image" height="50" />
                                                                </td>
                                                                <td>{{ item.variant_name }}</td>
                                                                <td>{{ item.quantity }}</td>
                                                                <td>{{ $currency }} {{ item.sub_total }}</td>
                                                                <td>{{ item.status_name }}</td>
                                                            </tr>
                                                        </template>
                                                        <tr v-else>
                                                            <td colspan="6" class="text-center text-muted p-2">
                                                                {{ __('no_products_found') }}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </b-card>
                                    </template>
                                </b-table>
                            </div>
                            <b-row>
                                <div class="col-md-4 text-success h6">{{ __('total_amount') }} :- {{ $currency }} {{
                                    total_amount }}</div>
                                <div class="col-md-4 text-success h6">{{ __('total_dchrg') }} :- {{ $currency }} {{
                                    delivery_charge }}</div>
                                <div class="col-md-4 text-success h6">{{ __('total_final_amount') }} :- {{ $currency }}
                                    {{ remaining_final }}</div>
                            </b-row>
                            <b-row>
                                <b-col md="2" class="my-1">
                                    <b-form-group :label="__('per_page')" label-for="per-page-select"
                                        label-align-sm="right" label-size="sm" class="mb-0">
                                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                            size="sm" class="form-control form-select"></b-form-select>
                                    </b-form-group>
                                </b-col>
                                <b-col md="4" class="my-1" offset-md="6">
                                    <b-pagination v-model="currentPage" :total-rows="totalOrderRows" :per-page="perPage"
                                        align="fill" size="sm" class="my-0"></b-pagination>
                                </b-col>
                            </b-row>
                        </b-tabs>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker'
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin'
import moment from "moment";
import axios from "axios";
export default {
    name: "range_dates",
    mixins: [DateRangePickerMixin],
    components: { DateRangePicker },
    data: function () {
        return {
            dateRange: { startDate: null, endDate: null },
            deliveryDateRange: { startDate: null, endDate: null },
            maxDate: new Date(),
            status: "",
            orderFields: [
                { key: 'id', label: 'O.ID', sortable: true, sortDirection: 'desc' },
                { key: 'user_name', label: __('user'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile'), sortable: true, class: 'text-center' },
                { key: 'total', label: __('total') + ' (' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'delivery_charge', label: __('dcharges') + ' (' + this.$currency + ')', sortable: true, class: 'text-center' },

                { key: 'wallet_balance', label: __('wallet_used') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'remaining_final', label: __('ftotal') + ' (' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'payment_method', label: __('p_method'), sortable: true, class: 'text-center' },
                { key: 'delivery_time', label: __('d_time'), sortable: true, class: 'text-center' },
                { key: 'active_status', label: __('status'), sortable: true, class: 'text-center' },
                { key: "actions", label: __('actions') }
            ],
            totalOrderRows: 1,
            orderItemFields: [
                { key: 'order_id', label: 'O.ID', sortable: true, sortDirection: 'desc' },
                { key: 'id', label: 'O.Item ID', sortable: true, sortDirection: 'desc' },
                { key: 'is_credited', label: 'Commission', sortable: true, class: 'text-center' },
                { key: 'user_name', label: 'U.Name', sortable: true, class: 'text-center' },
                { key: 'product_name', label: 'Product', sortable: true, class: 'text-center' },
                { key: 'mobile', label: 'Mob.', sortable: true, class: 'text-center' },
                { key: 'total', label: 'Total(' + this.$currency + ')', sortable: true, class: 'text-center' },

                { key: 'payment_method', label: 'P.Method', sortable: true, class: 'text-center' },
                { key: 'delivery_time', label: 'D.Time', sortable: true, class: 'text-center' },
                { key: 'active_status', label: 'A.Status', sortable: true, class: 'text-center' },
                { key: "actions", label: "Actions" }
            ],
            totalOrderItemRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,

            isLoading: false,
            sectionStyle: 'style_1',
            max_visible_units: 12,
            max_col_in_single_row: 3,
            statuses: [],

            orders: [],
            total_amount: 0,
            delivery_charge: 0,
            remaining_final: 0,

            order_items: [],
            order_items_total_sum: 0,

            itemCurrentPage: 1,
            itemPerPage: 5,
            search: "",

        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.orderFields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        }
    },
    mounted() {
        // Set the initial number of items
        this.totalOrderRows = this.orders.length
        this.totalOrderItemRows = this.order_items.length
    },
    created: function () {
        this.loadFilter();
        this.getOrderStatus();
        this.getOrders();
    },
    methods: {
        handleFilterChange() {
            localStorage.setItem('dateRangeStartDateFilter', this.dateRange.startDate);
            localStorage.setItem('dateRangeEndDateFilter', this.dateRange.endDate);
            localStorage.setItem('sellerFilter', this.seller);
            localStorage.setItem('statusFilter', this.status);
            localStorage.setItem('dateRangeStartDeliveryDateFilter', this.deliveryDateRange.startDate);
            localStorage.setItem('dateRangeEndDeliveryDateFilter', this.deliveryDateRange.endDate);
            localStorage.setItem('searchFilter', this.search);
            this.getOrders();
        },
        loadFilter() {
            const saveddateRangeStartDateFilter = localStorage.getItem('dateRangeStartDateFilter');
            console.log(saveddateRangeStartDateFilter);
            if (saveddateRangeStartDateFilter && saveddateRangeStartDateFilter != null && moment(saveddateRangeStartDateFilter).isValid()) {
                this.dateRange.startDate = saveddateRangeStartDateFilter;
            }
            const saveddateRangeEndDateFilter = localStorage.getItem('dateRangeEndDateFilter');
            if (saveddateRangeEndDateFilter && saveddateRangeEndDateFilter != null && moment(saveddateRangeEndDateFilter).isValid()) {
                this.dateRange.endDate = saveddateRangeEndDateFilter;
            }
            const savedSeller = localStorage.getItem('sellerFilter');
            if (savedSeller) {
                this.seller = savedSeller;
            }
            const savedStatus = localStorage.getItem('statusFilter');
            if (savedStatus) {
                this.status = savedStatus;
            }
            const saveddateRangeStartDeliveryDateFilter = localStorage.getItem('dateRangeStartDeliveryDateFilter');
            if (saveddateRangeStartDeliveryDateFilter && moment(saveddateRangeStartDeliveryDateFilter).isValid()) {
                this.deliveryDateRange.startDate = saveddateRangeStartDeliveryDateFilter;
            }
            const saveddateRangeEndDeliveryDateFilter = localStorage.getItem('dateRangeEndDeliveryDateFilter');
            if (saveddateRangeEndDeliveryDateFilter && moment(saveddateRangeEndDeliveryDateFilter).isValid()) {
                this.deliveryDateRange.endDate = saveddateRangeEndDeliveryDateFilter;
            }
            const savedSearchFilter = localStorage.getItem('searchFilter');
            if (savedSearchFilter) {
                this.search = savedSearchFilter;
            }
        },
        clearDate() {
            this.dateRange.startDate = null,
                this.dateRange.endDate = null,
                localStorage.setItem('dateRangeStartDateFilter', this.dateRange.startDate);
            localStorage.setItem('dateRangeEndDateFilter', this.dateRange.endDate);
            this.getOrders()
        },
        clearDeliveryDate() {
            this.deliveryDateRange.startDate = null,
                this.deliveryDateRange.endDate = null,
                localStorage.setItem('dateRangeStartDeliveryDateFilter', this.deliveryDateRange.startDate);
            localStorage.setItem('dateRangeEndDeliveryDateFilter', this.deliveryDateRange.endDate);
            this.getOrders()
        },
        /**
         * Status name for dropdown. API returns status_name as object by lang code { en: "...", hi: "..." }.
         * Picks current app locale; fallback to status.status.
         */
        getStatusDisplayName(status) {
            if (!status) return '';
            const sn = status.status_name;
            if (sn == null) return status.status || '';
            if (typeof sn === 'string') return sn.trim() || status.status || '';
            if (typeof sn === 'object' && !Array.isArray(sn)) {
                const appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
                const forLocale = sn[appLocale];
                if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
                const first = Object.values(sn).find(val => val != null && String(val).trim() !== '');
                return first != null ? String(first).trim() : (status.status || '');
            }
            return status.status || '';
        },
        // Returns a Bootstrap badge class based on the numeric status ID
        getStatusBadgeClass(statusId) {
            const id = Number(statusId);
            if (id === 1) return 'bg-secondary';           // Payment Pending
            if (id === 2) return 'bg-primary';             // Received
            if (id === 3) return 'bg-info';                // Processed
            if (id === 4 || id === 5) return 'bg-warning'; // Shipped, Out For Delivery
            if (id === 6) return 'bg-success';             // Delivered
            if (id === 7 || id === 8) return 'bg-danger';  // Cancelled, Returned
            return 'bg-secondary';
        },
        // Maps a numeric status ID to a translation key
        getStatusTranslationKey(id) {
            const map = { 1: 'payment_pending', 2: 'received', 3: 'processed', 4: 'shipped', 5: 'outForDelivery', 6: 'delivered', 7: 'cancelled', 8: 'returned', 9: 'pending', 10: 'ready_for_pickup', 11: 'picked_up', 12: 'rescheduled', 13: 'partial_delivery', 14: 'not_delivered' };
            return map[Number(id)] || '';
        },
        // Returns the translated status label from a numeric ID or status name string
        getStatusLabelById(val) {
            if (val == null || val === '') return '';
            const id = typeof val === 'number' ? val : parseInt(val, 10);
            if (!isNaN(id)) {
                const key = this.getStatusTranslationKey(id);
                return key ? this.__(key) : String(val);
            }
            const nameToKey = { 'Payment Pending': 'payment_pending', 'Received': 'received', 'Processed': 'processed', 'Shipped': 'shipped', 'Out For Delivery': 'outForDelivery', 'Delivered': 'delivered', 'Cancelled': 'cancelled', 'Returned': 'returned', 'Pending': 'pending', 'Ready for Pickup': 'ready_for_pickup', 'Picked Up': 'picked_up' };
            const key = nameToKey[String(val).trim()];
            return key ? this.__(key) : String(val);
        },
        toggleOrder(itemOrRow) {
            const item = itemOrRow.item || itemOrRow;
            const isRow = !!itemOrRow.toggleDetails;

            const isShowing = isRow ? itemOrRow.detailsShowing : !!item._showDetails;

            if (!isShowing) {
                this.orders.forEach(order => {
                    this.$set(order, '_showDetails', false);
                });
            }

            if (isRow) {
                itemOrRow.toggleDetails();
            } else {
                this.$set(item, '_showDetails', !isShowing);
            }

            if ((item.order_items && item.order_items.length > 0) || item.itemsLoading) {
                return;
            }

            item.itemsLoading = true;

            axios.get(this.$deliveryBoyApiUrl + '/order_by_id?order_id=' + item.id)
                .then(res => {
                    this.$set(item, 'order_items', res.data.data.order_items || []);
                    item.itemsLoading = false;
                })
                .catch(() => {
                    item.itemsLoading = false;
                    this.showError(__('something_went_wrong'));
                });
        },
        getOrderStatus: function () {
            let vm = this;
            axios.get(this.$apiUrl + '/order_statuses').then((response) => {
                this.isLoading = false
                this.statuses = response.data.data;
            }).catch(error => {
                vm.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
            });
        },
        getOrders() {
            this.isLoading = true
            let param = {
                "startDate": (this.dateRange.startDate != null) ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : "",
                "endDate": (this.dateRange.endDate != null) ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : "",
                "status": this.status,
                startDeliveryDate: this.deliveryDateRange.startDate ? moment(this.deliveryDateRange.startDate).format('YYYY-MM-DD') : '',
                endDeliveryDate: this.deliveryDateRange.endDate ? moment(this.deliveryDateRange.endDate).format('YYYY-MM-DD') : '',
                'search': this.search,
            }
            axios.get(this.$deliveryBoyApiUrl + '/orders', {
                params: param
            }).then((response) => {
                this.isLoading = false
                this.orders = response.data.data.orders.map(o => {
                    o.order_items = [];
                    o.itemsLoading = false;
                    return o;
                });
                this.totalOrderRows = this.orders.length;

                this.total_amount = this.orders.map(item => item.total).reduce((prev, curr) => prev + curr, 0).toFixed(2);
                this.delivery_charge = this.orders.map(item => item.delivery_charge).reduce((prev, curr) => prev + curr, 0).toFixed(2);
                this.remaining_final = this.orders.map(item => parseFloat(item.remaining_final) || 0).reduce((prev, curr) => prev + curr, 0).toFixed(2);

                this.order_items = response.data.data.order_items;
                this.totalOrderItemRows = this.order_items.length;
                this.order_items_total_sum = this.order_items.map(item => item.total).reduce((prev, curr) => prev + curr, 0).toFixed(2);

            });
        }
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

.vue-daterange-picker[data-v-1ebd09d2] {
    min-width: 80%;
}

@media only screen and (min-width: 600px) {
    .vue-daterange-picker[data-v-1ebd09d2] {
        min-width: 90%;
    }
}
</style>
