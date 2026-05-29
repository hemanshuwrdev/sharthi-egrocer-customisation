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
                                <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard')
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
                            <b-col md="6" class="mb-3">
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
                            <b-col md="6" class="mb-3">
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
                            <b-col md="4" class="mb-3">
                                <h6 class="box-title" for="seller">{{ __('seller') }}</h6>
                                <select name="seller" id="seller" v-model="seller" @change="handleFilterChange()"
                                    class="form-control form-select">
                                    <option value="">{{ __('all_sellers') }}</option>
                                    <option v-for="seller in sellers" :value="seller.id">{{ getDisplayName(seller.name)
                                        }}</option>
                                </select>
                            </b-col>
                            <b-col md="4" class="mb-3">
                                <h6 class="box-title" for="status">{{ __('status') }} </h6>
                                <select id="status" name="status" v-model="status" @change="handleFilterChange()"
                                    class="form-control form-select">
                                    <option value="">{{ __('all_orders') }}</option>
                                    <option v-for="status in statuses" :value='status.id'>{{
                                        getStatusDisplayName(status) }}</option>
                                </select>
                            </b-col>
                            <b-col md="3" class="mb-3">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input id="filter-input" v-model="search" type="search"
                                    :placeholder="__('search')" @input="handleFilterChange()"></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center mb-3">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                                    @click="getOrders()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </div>

                        <div class="table-responsive mt-3">
                            <b-table responsive="sm" :items="orders" :fields="orderFields" show-details
                                :tbody-tr-class="() => 'cursor-pointer'" :details-td-class="'p-0 bg-light'"
                                :filter="filter" :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true"
                                :busy="isLoading" :foot-clone="true" :no-footer-sorting="true"
                                :no-border-collapse="false" stacked="md" show-empty small>

                                <!-- Order ID with dropdown arrow -->
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


                                <!-- Accordion content -->
                                <template #row-details="row">
                                    <b-card class="m-2 p-2" style="background:#f8fafc;">

                                        <!-- Header Row -->
                                        <!-- Header -->
                                        <div
                                            class="row font-weight-bold text-center border-bottom pb-2 mb-2 d-none d-md-flex">
                                            <div class="col-md-3 text-left">{{ __('product') }}</div>
                                            <div class="col-md-2">{{ __('image') }}</div>
                                            <div class="col-md-2">{{ __('variant') }}</div>
                                            <div class="col-md-1">{{ __('qty') }}</div>
                                            <div class="col-md-2">{{ __('subtotal') }}</div>
                                            <div class="col-md-2">{{ __('status') }}</div>
                                        </div>

                                        <!-- Product Rows -->
                                        <div v-if="row.item.order_items && row.item.order_items.length">
                                            <div v-for="(item, index) in row.item.order_items" :key="index"
                                                class="row align-items-center border-bottom py-3 bg-white text-center">
                                                <!-- Product Name -->
                                                <div class="col-md-3 text-left">
                                                    <strong>{{ item.product_name }}</strong>
                                                </div>

                                                <!-- Product Image -->
                                                <div class="col-md-2">
                                                    <img :src="item.image" @click="openLightbox(row.item.image)"
                                                        alt="Image" height="50" />
                                                </div>

                                                <!-- Variant -->
                                                <div class="col-md-2">
                                                    {{ item.variant_name || '-' }}
                                                </div>

                                                <!-- Quantity -->
                                                <div class="col-md-1">
                                                    {{ item.quantity }}
                                                </div>

                                                <!-- Subtotal -->
                                                <div class="col-md-2 font-weight-bold">
                                                    {{ $currency }} {{ item.sub_total }}
                                                </div>

                                                <!-- Status -->
                                                <div class="col-md-2">
                                                    {{ item.status_name }}
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else class="text-center text-muted p-2">
                                            {{ __('no_products_found') }}
                                        </div>

                                    </b-card>
                                </template>

                                <template #cell(additional_charges)="row">
                                    <div v-if="row.item.additional_charges && row.item.additional_charges.length > 0">
                                        <span>{{ formatAmount(getAdditionalChargesTotal(row.item.additional_charges))
                                            }}</span>
                                        <i class="fa fa-info-circle text-primary ml-1" v-b-tooltip.hover
                                            :title="getAdditionalChargesTooltip(row.item.additional_charges)"></i>
                                    </div>
                                    <span v-else>0</span>
                                </template>

                                <template #cell(active_status)="row">
                                    <span class="badge" :class="getStatusBadgeClass(row.item.active_status)">{{
                                        getStatusLabelById(row.item.active_status) }}</span>
                                </template>

                                <template #cell(actions)="row">
                                    <router-link
                                        :to="{ name: 'ViewOrder', params: { id: row.item.id, record: row.item } }"
                                        v-b-tooltip.hover :title="__('view')" class="btn btn-primary btn-sm"><i
                                            class="fa fa-eye"></i></router-link>
                                    <button class="btn btn-danger btn-sm" v-b-tooltip.hover :title="__('delete')"
                                        @click="deleteOrder(row.index, row.item.id)" v-if="$can('order_delete')">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </template>

                                <!-- A custom formatted footer cell for field 'name' -->

                                <template #foot(total)="data">
                                    <span class="text-success">{{ $currency }} {{ total_amount }}</span>
                                </template>
                                <template #foot(delivery_charge)="data">
                                    <span class="text-success">{{ $currency }} {{ delivery_charge }}</span>
                                </template>
                                <template #foot(additional_charges)="data">
                                    <span class="text-success">{{ $currency }} {{ additional_charges_total }}</span>
                                </template>
                                <template #foot(remaining_final)="data">
                                    <span class="text-success">{{ $currency }} {{ remaining_final }}</span>
                                </template>

                                <!-- Default fall-back custom formatted footer cell -->
                                <template #foot()="data">

                                </template>

                            </b-table>
                        </div>
                        <b-row>
                            <b-col md="2" class="my-1">
                                <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                                    label-size="sm" class="mb-0">
                                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                        size="sm" class="form-control form-select"></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="4" class="my-1" offset-md="6">
                                <b-pagination v-model="currentPage" :total-rows="totalOrderRows" :per-page="perPage"
                                    align="fill" size="sm" class="my-0"></b-pagination>
                            </b-col>
                        </b-row>
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
            seller: "",
            status: "",
            search: "",
            orderFields: [
                { key: 'id', label: __('oid'), sortable: false, sortDirection: 'desc', class: 'text-center' },
                { key: 'user_name', label: __('user'), sortable: false, class: 'text-center' },
                { key: 'seller_name', label: __('seller'), sortable: false, class: 'text-center' },
                { key: 'mobile', label: __('mobile'), sortable: false, class: 'text-center' },
                { key: 'total', label: __('total') + '(' + this.$currency + ')', sortable: false, class: 'text-center' },
                { key: 'delivery_charge', label: __('dcharges') + '(' + this.$currency + ')', sortable: false, class: 'text-center' },
                { key: 'additional_charges', label: __('a_charges') + '(' + this.$currency + ')', sortable: false, class: 'text-center' },
                { key: 'wallet_balance', label: __('wallet_used') + '(' + this.$currency + ')', sortable: false, class: 'text-center' },
                { key: 'remaining_final', label: __('ftotal') + '(' + this.$currency + ')', sortable: false, class: 'text-center' },
                { key: 'payment_method', label: __('p_method'), sortable: false, class: 'text-center' },
                { key: 'delivery_time', label: __('d_time'), sortable: false, class: 'text-center' },
                { key: 'active_status', label: __('status'), sortable: false, class: 'text-center' },
                { key: "actions", label: __('actions') }
            ],
            footClone: false,

            totalOrderRows: 1,

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
            additional_charges_total: 0,

            sellers: null,
            itemCurrentPage: 1,
            itemPerPage: this.$perPage,
            itemPageOptions: this.$pageOptions,
            selectedTab: '',
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
        },
    },
    mounted() {

    },
    created: function () {
        this.loadFilter();
        this.getOrderStatus();
        this.getOrders();
    },
    watch: {
        currentPage() {
            this.getOrders();
        },
        perPage() {
            this.getOrders();
        },

    },
    methods: {

        toggleOrder(itemOrRow) {
            const item = itemOrRow.item || itemOrRow;
            const isRow = !!itemOrRow.toggleDetails;

            // Determine if the clicked row is currently showing details
            const isShowing = isRow ? itemOrRow.detailsShowing : !!item._showDetails;

            // Close all other rows if we are opening a new one
            if (!isShowing) {
                this.orders.forEach(order => {
                    this.$set(order, '_showDetails', false);
                });
            }

            // Toggle current row
            if (isRow) {
                itemOrRow.toggleDetails();
            } else {
                this.$set(item, '_showDetails', !isShowing);
            }

            // if already loaded or loading, don't call again
            if (item.order_items.length > 0 || item.itemsLoading) {
                return;
            }

            item.itemsLoading = true;

            axios.get(this.$apiUrl + '/orders/view/' + item.id)
                .then(res => {
                    // API returns: data.order_items
                    item.order_items = res.data.data.order_items || [];
                    item.itemsLoading = false;
                })
                .catch(() => {
                    item.itemsLoading = false;
                    this.showError('Failed to load order items');
                });
        },

        /**
         * Display value for name that can be string or object by lang code. Uses app locale; fallback to first non-empty.
         */
        getDisplayName(name) {
            if (name == null) return '';
            if (typeof name === 'string') return name;
            if (typeof name === 'object' && !Array.isArray(name)) {
                const appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
                const forLocale = name[appLocale];
                if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
                const firstNonEmpty = Object.values(name).find(val => val != null && String(val).trim() !== '');
                return firstNonEmpty != null ? String(firstNonEmpty).trim() : '';
            }
            return '';
        },
        /**
         * Status label for dropdown. API returns status_name as object by lang code { en: "...", hi: "..." }.
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
        getOrderStatus: function (tabTitle) {
            let vm = this;
            axios.get(this.$apiUrl + '/order_statuses').then((response) => {
                this.isLoading = false
                this.statuses = response.data.data;
            }).catch(error => {
                vm.isLoading = false;
                if (error?.request?.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
            });
        },
        onTabChange(tabTitle) {
            this.selectedTab = tabTitle;
        },
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
        getOrders() {
            let vm = this;
            this.isLoading = true
            const param = {
                "startDate": (this.dateRange.startDate != null && moment(this.dateRange.startDate).isValid()) ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : "",
                "endDate": (this.dateRange.endDate != null && moment(this.dateRange.endDate).isValid()) ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : "",
                startDeliveryDate: (this.deliveryDateRange.endDate != null && moment(this.deliveryDateRange.endDate).isValid()) ? moment(this.deliveryDateRange.startDate).format('YYYY-MM-DD') : '',
                endDeliveryDate: (this.deliveryDateRange.endDate != null && moment(this.deliveryDateRange.endDate).isValid()) ? moment(this.deliveryDateRange.endDate).format('YYYY-MM-DD') : '',
                "seller": this.seller,
                "status": this.status,
                page: this.currentPage,
                per_page: this.perPage,
                item_page: this.itemCurrentPage,
                item_per_page: this.itemPerPage,
                search: this.search
            }

            axios.get(this.$apiUrl + '/orders', {
                params: param
            }).then((response) => {

                this.sellers = response.data.data.sellers;
                this.orders = response.data.data.orders.map(o => {
                    o.order_items = [];     // products will come later
                    o.itemsLoading = false; // loader flag
                    return o;
                });

                this.totalOrderRows = response.data.data.orders_total;

                this.total_amount = this.orders.map(item => Number(item.total)).reduce((prev, curr) => prev + curr, 0).toFixed(2);
                this.delivery_charge = this.orders.map(item => Number(item.delivery_charge)).reduce((prev, curr) => prev + curr, 0).toFixed(2);
                this.additional_charges_total = this.orders
                    .map(item => this.getAdditionalChargesTotal(item.additional_charges || []))
                    .reduce((prev, curr) => prev + curr, 0)
                    .toFixed(2);
                this.remaining_final = this.orders.map(item => Number(item.remaining_final)).reduce((prev, curr) => prev + curr, 0).toFixed(2);

                this.isLoading = false;

            }).catch(error => {
                vm.isLoading = false;
                if (error?.request?.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
            });
        },
        deleteOrder(index, id) {
            this.$swal.fire({
                title: "Are you Sure?",
                text: "You want be able to revert this",
                confirmButtonText: "Yes, Sure",
                cancelButtonText: "Cancel",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.isLoading = true
                    let postData = {
                        id: id
                    }
                    axios.post(this.$apiUrl + '/orders/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.orders.splice(index, 1)
                            this.showSuccess(data.message)
                        });
                }
            });
        },
        deleteOrderItem(index, id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_be_able_to_revert_this'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.isLoading = true
                    let postData = {
                        id: id
                    }
                    axios.post(this.$apiUrl + '/orders/delete_item', postData)
                        .then((response) => {
                            this.isLoading = false
                            let data = response.data;
                            this.order_items.splice(index, 1)
                            this.showSuccess(data.message)
                        });
                }
            });
        },
        getAdditionalChargesTotal(charges) {
            if (!charges || !Array.isArray(charges)) return 0;
            return charges.reduce((total, charge) => total + (parseFloat(charge.amount) || 0), 0);
        },
        getAdditionalChargesTooltip(charges) {
            if (!charges || !Array.isArray(charges) || charges.length === 0) return 'No additional charges';

            return charges.map(charge =>
                `${charge.title}: ${this.$currency}${this.formatAmount(charge.amount)}`
            ).join('\n');
        },
        formatAmount(amount) {
            if (typeof amount !== 'number') amount = parseFloat(amount);
            return Number.isInteger(amount) ? amount : amount.toFixed(2);
        },
        getStatusBadgeClass(statusId) {
            const id = Number(statusId);
            if (id === 1) return 'bg-secondary'; // Payment Pending
            if (id === 2) return 'bg-primary';   // Received
            if (id === 3) return 'bg-info';      // Processed
            if (id === 4 || id === 5) return 'bg-warning'; // Shipped, Out For Delivery
            if (id === 6) return 'bg-success';   // Delivered
            if (id === 7 || id === 8) return 'bg-danger'; // Cancelled, Returned
            return 'bg-secondary';
        },
        getStatusTranslationKey(id) {
            const map = { 1: 'payment_pending', 2: 'received', 3: 'processed', 4: 'shipped', 5: 'outForDelivery', 6: 'delivered', 7: 'cancelled', 8: 'returned', 9: 'pending', 10: 'ready_for_pickup', 11: 'picked_up' };
            return map[Number(id)] || '';
        },
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
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

.vue-daterange-picker[data-v-1ebd09d2] {
    min-width: 80%;
}

.cursor-pointer {
    cursor: pointer;
}

@media only screen and (min-width: 600px) {
    .vue-daterange-picker[data-v-1ebd09d2] {
        min-width: 90%;
    }
}
</style>
