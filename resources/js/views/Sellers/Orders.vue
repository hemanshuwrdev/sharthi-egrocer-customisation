<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('latest_orders') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar has-filters">
                <div class="list-toolbar-start">
                    <div class="list-filter">
                        <span class="list-filter-label">{{ __('from_and_to_date') }}</span>
                        <div class="d-flex align-items-center">
                            <date-range-picker :autoApply=false :showDropdowns=true v-model="dateRange"
                                :maxDate="maxDate" @update="handleFilterChange" :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"
                                :append-to-body="true" opens="right"></date-range-picker>
                            <button class="btn btn-sm btn-danger ml-1" @click="clearDate()">
                                {{ __('clear') }}
                            </button>
                        </div>
                    </div>

                    <div class="list-filter">
                        <span class="list-filter-label">{{ __('from_and_to_delivery_date') }}</span>
                        <div class="d-flex align-items-center">
                            <date-range-picker :autoApply=false :showDropdowns=true v-model="deliveryDateRange"
                                :maxDate="maxDate" @update="handleFilterChange" :ranges="customRanges"
                                :append-to-body="true" opens="left"></date-range-picker>
                            <button class="btn btn-sm btn-danger ml-1" @click="clearDeliveryDate()">
                                {{ __('clear') }}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="list-toolbar-end">
                    <div class="list-filter">
                        <span class="list-filter-label" for="status">{{ __('status') }}</span>
                        <select id="status" name="status" v-model="status" @change="handleFilterChange()"
                            class="form-control form-select">
                            <option value="">{{ __('all_orders') }}</option>
                            <option v-for="status in statuses" :key="status.id" :value="status.id">{{
                                getStatusDisplayName(status) }}</option>
                        </select>
                    </div>
                    <div class="list-search">
                        <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                        <b-form-input id="filter-input" v-model="search" type="search"
                            :placeholder="__('search')" @input="handleFilterChange()"></b-form-input>
                    </div>
                    <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                        @click="getOrders()">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
                        <b-tabs pills active-nav-item-class="font-weight-bold text-uppercase" class="list-surface-tabs">
                            <b-tab :title="__('orders')" active @click="getOrders">
                                <div class="table-responsive">
                                    <b-table :items="orders" :fields="orderFields" :filter="filter"
                                        :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                                        :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true"
                                        :busy="isLoading" stacked="md" show-empty small show-details>

                                        <template #table-busy>
                                            <div class="text-center text-black my-2">
                                                <b-spinner class="align-middle"></b-spinner>
                                                <strong>{{ __('loading') }}...</strong>
                                            </div>
                                        </template>

                                        <template #cell(id)="row">
                                            <div class='d-flex align-items-center'>
                                                <i :class="row.detailsShowing ? 'fa fa-chevron-down' : 'fa fa-chevron-right'"
                                                    @click="toggleOrder(row)"
                                                    style="cursor: pointer; margin-right: 10px;"></i>
                                                {{ row.item.id }}
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
                                            <div class="list-actions">
                                                <router-link
                                                    :to="{ name: 'SellerViewOrder', params: { id: row.item.id, record: row.item } }"
                                                    v-b-tooltip.hover :title="__('view')" class="list-action-btn is-view"><i
                                                        class="fa fa-eye"></i></router-link>
                                                <b-button v-if="canEditOrder(row.item)" v-b-tooltip.hover
                                                    :title="__('edit_quantity')" class="list-action-btn is-edit"
                                                    @click="openEditOrderItems(row.item)">
                                                    <i class="fa fa-pencil-alt"></i>
                                                </b-button>
                                            </div>
                                        </template>

                                        <template #row-details="row">
                                            <b-card>
                                                <div v-if="row.item.itemsLoading" class="text-center">
                                                    <b-spinner label="Spinning"></b-spinner>
                                                </div>
                                                <div v-else>
                                                    <div class="table-responsive">
                                                        <table class="table table-bordered table-sm">
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
                                                                <tr v-if="!row.item.order_items || row.item.order_items.length === 0">
                                                                    <td colspan="6" class="text-center">{{ __('no_products_found') }}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </b-card>
                                        </template>
                                    </b-table>
                                </div>
                                <b-row class="mx-0 px-3 py-3 border-top">
                                    <div class="col-md-4 text-success h6 mb-0">{{ __('total_amount') }} :- {{ $currency }} {{
                                        total_amount }}</div>
                                    <div class="col-md-4 text-success h6 mb-0">{{ __('total_dchrg') }} :- {{ $currency }} {{
                                        delivery_charge }}</div>
                                    <div class="col-md-4 text-success h6 mb-0">{{ __('total_final_amount') }} :- {{ $currency
                                    }} {{ remaining_final }}</div>
                                </b-row>
                                <div class="list-footer">
                                    <div class="list-perpage">
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">
                                            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                                size="sm" class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </div>
                                    <b-pagination v-model="currentPage" :total-rows="totalOrderRows"
                                        :per-page="perPage" align="fill" size="sm" class="list-pagination"></b-pagination>
                                </div>
                            </b-tab>
                            <b-tab :title="__('order_items')" @click="getOrders">
                                <div class="table-responsive">
                                    <b-table :items="order_items" :fields="orderItemFields" :filter="filter"
                                        :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                                        :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true"
                                        :busy="isLoading" stacked="md" show-empty small>
                                        <template #table-busy>
                                            <div class="text-center text-black my-2">
                                                <b-spinner class="align-middle"></b-spinner>
                                                <strong>{{ __('loading') }}...</strong>
                                            </div>
                                        </template>

                                        <template #cell(mobile)="row">
                                            {{ row.item.mobile | mobileMask }}
                                        </template>

                                        <template #head(tax)="row">
                                            {{ 'Tax (' + $currency + ') (%)' }}
                                        </template>

                                        <template #cell(is_credited)="row">
                                            <span v-if="row.item.is_credited" class="badge bg-success">{{ __('credited')
                                            }}</span>
                                            <span v-else class="badge bg-danger">{{ __('not_credited') }}</span>
                                        </template>

                                        <template #cell(active_status)="row">
                                            <span
                                                v-if="row.item.active_status == $received || row.item.active_status == 2"
                                                class="badge bg-primary">{{ getStatusLabelById(row.item.active_status)
                                                }}</span>
                                            <span
                                                v-else-if="row.item.active_status == $pending || row.item.active_status == 1"
                                                class="badge bg-secondary">{{ getStatusLabelById(row.item.active_status)
                                                }}</span>
                                            <span
                                                v-else-if="row.item.active_status == $processed || row.item.active_status == 3"
                                                class="badge bg-info">{{ getStatusLabelById(row.item.active_status)
                                                }}</span>
                                            <span
                                                v-else-if="row.item.active_status == $shipped || row.item.active_status == 4"
                                                class="badge bg-warning">{{ getStatusLabelById(row.item.active_status)
                                                }}</span>
                                            <span
                                                v-else-if="row.item.active_status == $outForDelivery || row.item.active_status == 5"
                                                class="badge bg-warning">{{ getStatusLabelById(row.item.active_status)
                                                }}</span>
                                            <span
                                                v-else-if="row.item.active_status == $delivered || row.item.active_status == 6"
                                                class="badge bg-success">{{ getStatusLabelById(row.item.active_status)
                                                }}</span>
                                            <span
                                                v-else-if="row.item.active_status == $returned || row.item.active_status == $cancelled || row.item.active_status == 7 || row.item.active_status == 8"
                                                class="badge bg-danger">{{ getStatusLabelById(row.item.active_status)
                                                }}</span>
                                            <span v-else class="badge bg-secondary">{{
                                                getStatusLabelById(row.item.active_status) || __('not_found') }}</span>
                                        </template>
                                        <template #cell(actions)="row">
                                            <div class="list-actions">
                                                <router-link
                                                    :to="{ name: 'SellerViewOrder', params: { id: row.item.order_id, record: row.item } }"
                                                    v-b-tooltip.hover :title="__('view')" class="list-action-btn is-view"><i
                                                        class="fa fa-eye"></i></router-link>
                                            </div>
                                        </template>
                                    </b-table>
                                </div>
                                <b-row class="mx-0 px-3 py-3 border-top">
                                    <div class="col-md-12 text-success text-center h6 mb-0">{{ __('total') }} :- {{ $currency
                                    }} {{ order_items_total_sum
                                        }}</div>
                                </b-row>
                                <div class="list-footer">
                                    <div class="list-perpage">
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">
                                            <b-form-select id="per-page-select" v-model="itemPerPage"
                                                :options="pageOptions" size="sm"
                                                class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </div>
                                    <b-pagination v-model="itemCurrentPage" :total-rows="totalOrderItemRows"
                                        :per-page="itemPerPage" align="fill" size="sm" class="list-pagination"></b-pagination>
                                </div>
                            </b-tab>
                        </b-tabs>
        </div>

            <b-modal v-model="editOrderModalShow" :title="__('edit_quantity')" size="lg" :hide-footer="true"
                @hide="onEditOrderModalHide">
                <b-container fluid>
                    <p class="text-muted small">
                        {{ __('only_received_orders_can_be_edited') }}
                    </p>
                    <div v-if="editingOrderItemsLoading" class="text-center py-3">
                        <b-spinner></b-spinner>
                    </div>
                    <div v-else>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th>{{ __('product') }}</th>
                                        <th class="text-center" style="width: 130px;">{{ __('quantity') }}</th>
                                        <th class="text-end" style="width: 130px;">{{ __('price') }} ({{ $currency }})</th>
                                        <th class="text-end" style="width: 140px;">{{ __('subtotal') }} ({{ $currency }})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="row in editingItems" :key="row.order_item_id">
                                        <td>
                                            <div>{{ row.product_name }}</div>
                                            <small class="text-muted" v-if="row.variant_name">({{ row.variant_name }})</small>
                                        </td>
                                        <td>
                                            <input type="number" min="0" step="1" class="form-control text-center"
                                                v-model.number="row.quantity">
                                        </td>
                                        <td class="text-end">{{ row.price }}</td>
                                        <td class="text-end">{{ editingRowSubtotal(row) }}</td>
                                    </tr>
                                    <tr v-if="editingItems.length === 0">
                                        <td colspan="4" class="text-center text-muted">
                                            {{ __('no_items') }}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot v-if="editingItems.length > 0">
                                    <tr>
                                        <th colspan="3" class="text-end">{{ __('new_total') }} ({{ $currency }})</th>
                                        <th class="text-end">{{ editingItemsTotal }}</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div class="d-flex justify-content-end gap-2 mt-3">
                            <b-button variant="secondary" @click="editOrderModalShow = false" :disabled="isSavingEdit">
                                {{ __('cancel') }}
                            </b-button>
                            <b-button variant="primary" @click="saveEditedOrderItems"
                                :disabled="isSavingEdit || editingItems.length === 0">
                                <span v-if="isSavingEdit"><i class="fa fa-spinner fa-spin"></i></span>
                                {{ __('save_changes') }}
                            </b-button>
                        </div>
                    </div>
                </b-container>
            </b-modal>
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
                { key: 'id', label: __('order_id'), sortable: true, sortDirection: 'desc' },
                { key: 'user_name', label: __('user'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile'), sortable: true, class: 'text-center' },
                { key: 'total', label: __('total') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'delivery_charge', label: __('dcharges') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'wallet_balance', label: __('wallet_used') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'remaining_final', label: __('ftotal') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'payment_method', label: __('p_method'), sortable: true, class: 'text-center' },
                { key: 'delivery_time', label: __('d_time'), sortable: true, class: 'text-center' },
                { key: 'delivery_date', label: __('delivery_date'), sortable: true, class: 'text-center' },
                { key: 'active_status', label: __('status'), sortable: true, class: 'text-center' },
                { key: "actions", label: __('actions') }
            ],
            totalOrderRows: 1,
            orderItemFields: [
                { key: 'order_id', label: __('order_id'), sortable: true, sortDirection: 'desc' },
                { key: 'id', label: __('order_item_id'), sortable: true, sortDirection: 'desc' },
                { key: 'is_credited', label: __('commission'), sortable: true, class: 'text-center' },
                { key: 'user_name', label: __('user_name'), sortable: true, class: 'text-center' },
                { key: 'product_name', label: __('product'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile'), sortable: true, class: 'text-center' },
                { key: 'total', label: __('total') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'payment_method', label: __('p_method'), sortable: true, class: 'text-center' },
                { key: 'delivery_time', label: __('d_time'), sortable: true, class: 'text-center' },
                { key: 'delivery_date', label: __('delivery_date'), sortable: true, class: 'text-center' },
                { key: 'active_status', label: __('status'), sortable: true, class: 'text-center' },
                { key: "actions", label: __('actions') }
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
            itemPerPage: this.$perPage,
            itemPageOptions: this.$pageOptions,
            search: "",

            // Sarthi: distributor edits qty on a received order from the list page
            editOrderModalShow: false,
            editingOrderId: null,
            editingItems: [],
            editingOrderItemsLoading: false,
            isSavingEdit: false,
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
        editingItemsTotal() {
            const t = this.editingItems.reduce((sum, r) => {
                const q = parseFloat(r.quantity) || 0;
                const p = parseFloat(r.price) || 0;
                return sum + q * p;
            }, 0);
            return t.toFixed(2);
        },
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
    watch: {
        currentPage() {
            this.getOrders();
        },
        perPage() {
            this.getOrders();
        },
        itemCurrentPage() {
            this.getOrders();
        },
        itemPerPage() {
            this.getOrders();
        }
    },
    methods: {
        // Sarthi: distributor edits qty on a `received` order (active_status == 2) from the list
        canEditOrder(orderRow) {
            if (!orderRow || orderRow.active_status == null) return false;
            return parseInt(orderRow.active_status) === 2;
        },
        editingRowSubtotal(row) {
            const q = parseFloat(row.quantity) || 0;
            const p = parseFloat(row.price) || 0;
            return (q * p).toFixed(2);
        },
        openEditOrderItems(orderRow) {
            this.editingOrderId = orderRow.id;
            this.editingItems = [];
            this.editOrderModalShow = true;

            // If items aren't loaded yet (row not expanded), fetch them
            const seed = (items) => {
                this.editingItems = items
                    .filter(i => parseInt(i.active_status) !== 7 && parseInt(i.active_status) !== 8)
                    .map(i => ({
                        order_item_id: i.id,
                        product_name: i.product_name,
                        variant_name: i.variant_name,
                        price: parseFloat(i.price) || 0,
                        original_quantity: parseFloat(i.quantity) || 0,
                        quantity: parseFloat(i.quantity) || 0,
                    }));
            };

            if (orderRow.order_items && orderRow.order_items.length > 0) {
                seed(orderRow.order_items);
                return;
            }

            this.editingOrderItemsLoading = true;
            axios.get(this.$apiUrl + '/orders/view/' + orderRow.id)
                .then((response) => {
                    this.editingOrderItemsLoading = false;
                    const data = response.data;
                    if (data.status === 1) {
                        seed(data.data.order_items || []);
                    } else {
                        this.showError(data.message);
                        this.editOrderModalShow = false;
                    }
                })
                .catch(() => {
                    this.editingOrderItemsLoading = false;
                    this.showError('Failed to load order items');
                    this.editOrderModalShow = false;
                });
        },
        onEditOrderModalHide() {
            this.editingItems = [];
            this.editingOrderId = null;
        },
        saveEditedOrderItems() {
            const changed = this.editingItems
                .filter(r => parseFloat(r.quantity) !== r.original_quantity)
                .map(r => ({
                    order_item_id: r.order_item_id,
                    quantity: parseFloat(r.quantity),
                    // price intentionally omitted — distributor can't change price
                }));

            if (changed.length === 0) {
                this.showWarning(this.__('no_changes_to_save'));
                return;
            }
            for (const r of changed) {
                if (isNaN(r.quantity) || r.quantity < 0) {
                    this.showError(this.__('invalid_qty'));
                    return;
                }
            }

            this.isSavingEdit = true;
            const postData = { order_id: this.editingOrderId, items: changed };
            axios.post(this.$apiUrl + '/orders/update_items', postData)
                .then((response) => {
                    this.isSavingEdit = false;
                    const data = response.data;
                    if (data.status === 1) {
                        this.editOrderModalShow = false;
                        this.editingItems = [];
                        this.editingOrderId = null;
                        this.showMessage('success', data.message);
                        this.getOrders();
                    } else {
                        this.showError(data.message);
                    }
                })
                .catch(error => {
                    this.isSavingEdit = false;
                    if (error.response && error.response.data && error.response.data.message) {
                        this.showError(error.response.data.message);
                    } else {
                        this.showError('Something went wrong!');
                    }
                });
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
        getStatusBadgeClass(statusId) {
            const id = Number(statusId);
            if (id === 1) return 'bg-secondary';          // Payment Pending
            if (id === 2) return 'bg-primary';            // Received
            if (id === 3) return 'bg-info';               // Processed
            if (id === 4 || id === 5) return 'bg-warning'; // Shipped, Out For Delivery
            if (id === 6) return 'bg-success';            // Delivered
            if (id === 7 || id === 8) return 'bg-danger'; // Cancelled, Returned
            return 'bg-secondary';
        },
        getStatusTranslationKey(id) {
            const map = { 1: 'payment_pending', 2: 'received', 3: 'processed', 4: 'shipped', 5: 'outForDelivery', 6: 'delivered', 7: 'cancelled', 8: 'returned', 9: 'pending', 10: 'ready_for_pickup', 11: 'picked_up', 12: 'rescheduled', 13: 'partial_delivery', 14: 'not_delivered' };
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
                    this.showError("Something went wrong!");
                }
            });
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
        getOrders() {
            this.isLoading = true;
            let offset = (this.currentPage - 1) * this.perPage;
            let item_offset = (this.itemCurrentPage - 1) * this.itemPerPage
            let param = {
                "startDate": (this.dateRange.startDate != null && moment(this.dateRange.startDate).isValid()) ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : "",
                "endDate": (this.dateRange.endDate != null && moment(this.dateRange.endDate).isValid()) ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : "",
                startDeliveryDate: (this.deliveryDateRange.endDate != null && moment(this.deliveryDateRange.endDate).isValid()) ? moment(this.deliveryDateRange.startDate).format('YYYY-MM-DD') : '',
                endDeliveryDate: (this.deliveryDateRange.endDate != null && moment(this.deliveryDateRange.endDate).isValid()) ? moment(this.deliveryDateRange.endDate).format('YYYY-MM-DD') : '',
                "status": this.status,
                offset: offset,
                limit: this.perPage,
                item_offset: item_offset,
                item_limit: this.itemPerPage,
                search: this.search
            }
            axios.get(this.$sellerApiUrl + '/orders', {
                params: param
            }).then((response) => {
                this.isLoading = false
                this.orders = response.data.data.orders;
                this.totalOrderRows = response.data.total;

                this.total_amount = this.orders.map(item => parseFloat(item.total) || 0).reduce((prev, curr) => prev + curr, 0).toFixed(2);
                this.delivery_charge = this.orders.map(item => parseFloat(item.delivery_charge) || 0).reduce((prev, curr) => prev + curr, 0).toFixed(2);
                this.remaining_final = this.orders.map(item => parseFloat(item.remaining_final) || 0).reduce((prev, curr) => prev + curr, 0).toFixed(2);

                this.order_items = response.data.data.order_items;
                this.totalOrderItemRows = response.data.data.total_order_item;
                this.order_items_total_sum = this.order_items.map(item => item.total).reduce((prev, curr) => prev + curr, 0).toFixed(2);

                this.orders.forEach(order => {
                    this.$set(order, 'order_items', []);
                    this.$set(order, 'itemsLoading', false);
                });

            });
        },
        toggleOrder(row) {
            if (row.detailsShowing) {
                row.toggleDetails();
            } else {
                this.orders.forEach(o => {
                    if (o.id !== row.item.id) {
                        this.$set(o, '_showDetails', false);
                    }
                });

                if (row.item.order_items.length === 0) {
                    row.item.itemsLoading = true;
                    axios.get(this.$sellerApiUrl + '/order_by_id', {
                        params: {
                            order_id: row.item.id
                        }
                    })
                        .then((response) => {
                            row.item.order_items = response.data.data.order_items;
                            row.item.itemsLoading = false;
                        })
                        .catch(error => {
                            row.item.itemsLoading = false;
                            this.showError(error.message || "Failed to fetch order items");
                        });
                }
                row.toggleDetails();
            }
        }
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

.vue-daterange-picker[data-v-1ebd09d2] {
    min-width: 190px;
}
</style>
