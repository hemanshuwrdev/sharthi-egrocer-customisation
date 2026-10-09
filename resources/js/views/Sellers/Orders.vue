<template>
    <div class="ord ord-scope">
        <!-- Header -->
        <header class="ord-head">
            <span class="ord-eyebrow">{{ __('Sales') }}</span>
            <h1>{{ __('latest_orders') }}</h1>
        </header>

        <!-- Status cards (seller-wide counts; click to filter) -->
        <section class="ord-cards">
            <button type="button" v-for="card in statusCards" :key="card.key" class="ord-card ord-stat"
                :class="{ 'ord-stat--on': String(status) === String(card.id) }" @click="setStatus(card.id)">
                <span class="ord-tile" :class="'ord-tone--' + card.tone"><i class="fa" :class="card.icon"></i></span>
                <span class="ord-stat__body">
                    <span class="ord-stat__label">{{ card.label }}</span>
                    <strong class="ord-stat__value">{{ card.count }}</strong>
                </span>
            </button>
        </section>

        <!-- Filters: everything on one line -->
        <div class="ord-card ord-filters">
            <div class="ord-search">
                <i class="fa fa-search"></i>
                <input v-model="search" type="text" :placeholder="__('Search by order ID, shop, mobile or product')"
                    :aria-label="__('search')" @input="onSearchInput">
                <button v-if="search" type="button" class="ord-search__clear" :title="__('Clear')" @click="clearSearch">
                    <i class="fa fa-times"></i>
                </button>
            </div>

            <select id="status" name="status" v-model="status" @change="handleFilterChange()"
                class="ord-select" :aria-label="__('status')">
                <option value="">{{ __('all_orders') }}</option>
                <option v-for="status in statuses" :key="status.id" :value="status.id">{{
                    getStatusDisplayName(status) }}</option>
            </select>

            <div class="ord-field__control">
                <date-range-picker :autoApply=false :showDropdowns=true v-model="dateRange"
                    :maxDate="maxDate" @update="handleFilterChange" :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"
                    :append-to-body="true" opens="right">
                        <template #input="picker">
                            <i class="fa fa-calendar-alt"></i>
                            <template v-if="picker.startDate"><span class="ord-picked">{{ __('Order') }}</span><span>{{ picker.rangeText }}</span></template>
                            <span v-else class="ord-placeholder">{{ __('Order date range') }}</span>
                        </template>
                </date-range-picker>
                <button v-if="dateRange.startDate" type="button" class="ord-clear" :title="__('clear')" @click="clearDate()">
                    <i class="fa fa-times"></i>
                </button>
            </div>

            <div class="ord-field__control">
                <date-range-picker :autoApply=false :showDropdowns=true v-model="deliveryDateRange"
                    :maxDate="maxDate" @update="handleFilterChange" :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"
                    :append-to-body="true" opens="left">
                        <template #input="picker">
                            <i class="fa fa-calendar-alt"></i>
                            <template v-if="picker.startDate"><span class="ord-picked">{{ __('Delivery') }}</span><span>{{ picker.rangeText }}</span></template>
                            <span v-else class="ord-placeholder">{{ __('Delivery date range') }}</span>
                        </template>
                </date-range-picker>
                <button v-if="deliveryDateRange.startDate" type="button" class="ord-clear" :title="__('clear')" @click="clearDeliveryDate()">
                    <i class="fa fa-times"></i>
                </button>
            </div>

            <button v-if="hasActiveFilters" type="button" class="ord-linkbtn" @click="clearAllFilters">
                <i class="fa fa-times-circle"></i> {{ __('Clear all filters') }}
            </button>

            <button type="button" class="ord-iconbtn" :title="__('refresh')" @click="getOrders()">
                <i class="fa fa-sync-alt" :class="{ 'fa-spin': isLoading }"></i>
            </button>
        </div>

        <!-- Table panel -->
        <div class="ord-card ord-panel">
            <div class="ord-panel__head">
                <div class="ord-seg" role="tablist">
                    <button type="button" role="tab" class="ord-seg__btn" :class="{ 'ord-seg__btn--on': activeTab === 'orders' }"
                        :aria-selected="activeTab === 'orders'" @click="activeTab = 'orders'">
                        <i class="fa fa-shopping-bag"></i> {{ __('orders') }} <span>{{ totalOrderRows }}</span>
                    </button>
                    <button type="button" role="tab" class="ord-seg__btn" :class="{ 'ord-seg__btn--on': activeTab === 'items' }"
                        :aria-selected="activeTab === 'items'" @click="activeTab = 'items'">
                        <i class="fa fa-cubes"></i> {{ __('order_items') }} <span>{{ totalOrderItemRows }}</span>
                    </button>
                </div>

                <div class="ord-sums" v-if="activeTab === 'orders'">
                    <span class="ord-sums__cap">{{ __('On this page') }}</span>
                    <span class="ord-sum">{{ __('total_amount') }} <strong>{{ $currency }}{{ formatMoney(total_amount) }}</strong></span>
                    <span class="ord-sum ord-sum--strong">{{ __('total_final_amount') }} <strong>{{ $currency }}{{ formatMoney(remaining_final) }}</strong></span>
                </div>
                <div class="ord-sums" v-else>
                    <span class="ord-sums__cap">{{ __('On this page') }}</span>
                    <span class="ord-sum">{{ __('total') }} <strong>{{ $currency }}{{ formatMoney(order_items_total_sum) }}</strong></span>
                </div>
            </div>

            <!-- Orders -->
            <div v-show="activeTab === 'orders'">
                <div class="table-responsive ord-tablewrap">
                    <b-table :items="orders" :fields="orderFields" :filter="filter"
                        :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="false" borderless hover
                        :busy="isLoading" stacked="md" show-empty show-details class="ord-table"
                        :tbody-tr-class="rowClass">

                        <template #table-busy>
                            <div class="ord-busy">
                                <b-spinner class="align-middle" small></b-spinner>
                                <strong>{{ __('loading') }}...</strong>
                            </div>
                        </template>

                        <!-- The short labels (F.Total, P.Method) get a hover tooltip with the full name -->
                        <template #head(remaining_final)="data">
                            <span class="ord-hint" v-b-tooltip.hover.top
                                :title="__('final_total') + ': ' + __('the amount payable for this order after discounts, cancellations and returns')">{{ data.label }}</span>
                        </template>

                        <template #head(payment_method)="data">
                            <span class="ord-hint" v-b-tooltip.hover.top :title="__('payment_method')">{{ data.label }}</span>
                        </template>

                        <template #empty>
                            <div class="ord-empty">
                                <div class="ord-empty__icon"><i class="fa fa-shopping-bag"></i></div>
                                <h3>{{ __('No orders found') }}</h3>
                                <p>{{ hasActiveFilters ? __('Nothing matches these filters. Try changing or clearing them.') : __('Orders from your retailers will show up here.') }}</p>
                                <button v-if="hasActiveFilters" type="button" class="ord-btn" @click="clearAllFilters">
                                    <i class="fa fa-times"></i> {{ __('Clear all filters') }}
                                </button>
                            </div>
                        </template>

                        <template #cell(id)="row">
                            <div class="ord-id">
                                <button type="button" class="ord-toggle" :class="{ 'is-open': row.detailsShowing }"
                                    :aria-expanded="row.detailsShowing ? 'true' : 'false'" :title="__('View items')"
                                    @click="toggleOrder(row)"><i class="fa fa-chevron-right"></i></button>
                                <div class="ord-id__text">
                                    <strong>#{{ row.item.id }}</strong>
                                    <span v-if="row.item.created_at">{{ formatDateTime(row.item.created_at) }}</span>
                                </div>
                            </div>
                        </template>

                        <template #cell(user_name)="row">
                            <div class="ord-shop">
                                <span class="ord-avatar" :class="'ord-tone--' + avatarTone(row.item.user_name)">{{ initials(row.item.user_name) }}</span>
                                <div class="ord-shop__text">
                                    <strong :title="row.item.user_name">{{ row.item.user_name || '-' }}</strong>
                                    <span>{{ row.item.mobile | mobileMask }}</span>
                                </div>
                            </div>
                        </template>

                        <template #cell(total)="row">{{ $currency }}{{ formatMoney(row.item.total) }}</template>

                        <template #cell(wallet_balance)="row">
                            <span v-if="Number(row.item.wallet_balance) > 0">{{ $currency }}{{ formatMoney(row.item.wallet_balance) }}</span>
                            <span v-else class="ord-dash">-</span>
                        </template>

                        <template #cell(remaining_final)="row">
                            <strong>{{ $currency }}{{ formatMoney(row.item.remaining_final) }}</strong>
                        </template>

                        <template #cell(payment_method)="row">
                            <span class="ord-tag">{{ row.item.payment_method || '-' }}</span>
                        </template>

                        <template #cell(delivery_date)="row">
                            <div class="ord-when">
                                <strong>{{ formatDate(row.item.delivery_date) }}</strong>
                                <span v-if="row.item.delivery_time">{{ row.item.delivery_time }}</span>
                            </div>
                        </template>

                        <!-- Coloured pill with status name instead of the raw number -->
                        <template #cell(active_status)="row">
                            <span class="ord-pill ord-pill--dot" :class="'ord-tone--' + statusTone(row.item.active_status)">
                                <span class="ord-dot"></span>{{ getStatusLabelById(row.item.active_status) }}
                            </span>
                        </template>

                        <template #cell(actions)="row">
                            <div class="ord-actions">
                                <router-link
                                    :to="{ name: 'SellerViewOrder', params: { id: row.item.id, record: row.item } }"
                                    v-b-tooltip.hover :title="__('view')" class="ord-iconbtn"><i
                                        class="fa fa-eye"></i></router-link>
                                <b-button v-if="canEditOrder(row.item)" v-b-tooltip.hover
                                    :title="__('edit_quantity')" class="ord-iconbtn"
                                    @click="openEditOrderItems(row.item)">
                                    <i class="fa fa-pencil-alt"></i>
                                </b-button>
                                <router-link
                                    v-if="row.item.active_status == $delivered || row.item.active_status == 6"
                                    :to="{ name: 'SellerInvoiceOrder', params: { id: row.item.id } }"
                                    v-b-tooltip.hover :title="__('generate_invoice')"
                                    class="ord-iconbtn"><i class="fa fa-file-invoice"></i></router-link>
                            </div>
                        </template>

                        <template #row-details="row">
                            <div class="ord-details">
                                <div v-if="row.item.itemsLoading" class="ord-busy">
                                    <b-spinner label="Spinning" small></b-spinner>
                                </div>
                                <template v-else>
                                    <p class="ord-empty-inline" v-if="!row.item.order_items || row.item.order_items.length === 0">{{ __('no_products_found') }}</p>
                                    <ul class="ord-lines" v-else>
                                        <li v-for="item in row.item.order_items" :key="item.id">
                                            <img v-if="item.image" :src="item.image" alt="" class="ord-lines__img">
                                            <span v-else class="ord-lines__img ord-lines__img--blank"><i class="fa fa-box"></i></span>
                                            <div class="ord-lines__name">
                                                <strong>{{ item.product_name }}</strong>
                                                <span v-if="item.variant_name">{{ item.variant_name }}</span>
                                            </div>
                                            <span class="ord-lines__qty">&times; {{ item.quantity }}</span>
                                            <strong class="ord-lines__amt">{{ $currency }}{{ formatMoney(item.sub_total) }}</strong>
                                            <span class="ord-pill ord-pill--dot" :class="'ord-tone--' + statusTone(item.active_status)">
                                                <span class="ord-dot"></span>{{ item.status_name || getStatusLabelById(item.active_status) }}
                                            </span>
                                        </li>
                                    </ul>
                                </template>
                            </div>
                        </template>
                    </b-table>
                </div>

                <div class="ord-foot">
                    <div class="ord-foot__size">
                        <label for="per-page-select">{{ __('per_page') }}</label>
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                            size="sm" class="form-control form-select"></b-form-select>
                    </div>
                    <span class="ord-foot__count">{{ rangeText(currentPage, perPage, totalOrderRows) }}</span>
                    <b-pagination v-if="totalOrderRows > perPage" v-model="currentPage" :total-rows="totalOrderRows"
                        :per-page="perPage" size="sm" class="my-0"></b-pagination>
                </div>
            </div>

            <!-- Order items -->
            <div v-show="activeTab === 'items'">
                <div class="table-responsive ord-tablewrap">
                    <b-table :items="order_items" :fields="orderItemFields" :filter="filter"
                        :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="false" borderless hover
                        :busy="isLoading" stacked="md" show-empty class="ord-table">
                        <template #table-busy>
                            <div class="ord-busy">
                                <b-spinner class="align-middle" small></b-spinner>
                                <strong>{{ __('loading') }}...</strong>
                            </div>
                        </template>

                        <template #head(payment_method)="data">
                            <span class="ord-hint" v-b-tooltip.hover.top :title="__('payment_method')">{{ data.label }}</span>
                        </template>

                        <template #empty>
                            <div class="ord-empty">
                                <div class="ord-empty__icon"><i class="fa fa-cubes"></i></div>
                                <h3>{{ __('No order items found') }}</h3>
                                <p>{{ hasActiveFilters ? __('Nothing matches these filters. Try changing or clearing them.') : __('Order items will show up here.') }}</p>
                                <button v-if="hasActiveFilters" type="button" class="ord-btn" @click="clearAllFilters">
                                    <i class="fa fa-times"></i> {{ __('Clear all filters') }}
                                </button>
                            </div>
                        </template>

                        <template #cell(order_id)="row">
                            <div class="ord-id__text">
                                <strong>#{{ row.item.order_id }}</strong>
                                <span>{{ __('order_item_id') }} {{ row.item.id }}</span>
                            </div>
                        </template>

                        <template #cell(product_name)="row">
                            <div class="ord-id__text">
                                <strong :title="row.item.product_name">{{ row.item.product_name }}</strong>
                                <span v-if="row.item.variant_name">{{ row.item.variant_name }}<template v-if="row.item.quantity"> &middot; &times; {{ row.item.quantity }}</template></span>
                            </div>
                        </template>

                        <template #cell(user_name)="row">
                            <div class="ord-shop">
                                <span class="ord-avatar" :class="'ord-tone--' + avatarTone(row.item.user_name)">{{ initials(row.item.user_name) }}</span>
                                <div class="ord-shop__text">
                                    <strong :title="row.item.user_name">{{ row.item.user_name || '-' }}</strong>
                                    <span>{{ row.item.mobile | mobileMask }}</span>
                                </div>
                            </div>
                        </template>

                        <template #cell(total)="row">{{ $currency }}{{ formatMoney(row.item.total) }}</template>

                        <template #cell(payment_method)="row">
                            <span class="ord-tag">{{ row.item.payment_method || '-' }}</span>
                        </template>

                        <template #cell(delivery_date)="row">
                            <div class="ord-when">
                                <strong>{{ formatDate(row.item.delivery_date) }}</strong>
                                <span v-if="row.item.delivery_time">{{ row.item.delivery_time }}</span>
                            </div>
                        </template>

                        <template #cell(is_credited)="row">
                            <span v-if="row.item.is_credited" class="ord-pill ord-tone--green">{{ __('credited') }}</span>
                            <span v-else class="ord-pill ord-tone--slate">{{ __('not_credited') }}</span>
                        </template>

                        <template #cell(active_status)="row">
                            <span class="ord-pill ord-pill--dot" :class="'ord-tone--' + statusTone(row.item.active_status)">
                                <span class="ord-dot"></span>{{ getStatusLabelById(row.item.active_status) || __('not_found') }}
                            </span>
                        </template>

                        <template #cell(actions)="row">
                            <div class="ord-actions">
                                <router-link
                                    :to="{ name: 'SellerViewOrder', params: { id: row.item.order_id, record: row.item } }"
                                    v-b-tooltip.hover :title="__('view')" class="ord-iconbtn"><i
                                        class="fa fa-eye"></i></router-link>
                            </div>
                        </template>
                    </b-table>
                </div>

                <div class="ord-foot">
                    <div class="ord-foot__size">
                        <label for="item-per-page-select">{{ __('per_page') }}</label>
                        <b-form-select id="item-per-page-select" v-model="itemPerPage"
                            :options="pageOptions" size="sm" class="form-control form-select"></b-form-select>
                    </div>
                    <span class="ord-foot__count">{{ rangeText(itemCurrentPage, itemPerPage, totalOrderItemRows) }}</span>
                    <b-pagination v-if="totalOrderItemRows > itemPerPage" v-model="itemCurrentPage" :total-rows="totalOrderItemRows"
                        :per-page="itemPerPage" size="sm" class="my-0"></b-pagination>
                </div>
            </div>
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
                { key: 'user_name', label: __('Shop Name'), sortable: true },
                { key: 'total', label: __('total'), sortable: true, class: 'ord-num' },
                // { key: 'delivery_charge', ... }, // delivery charge disabled
                // { key: 'wallet_balance', label: __('wallet_used'), sortable: true, class: 'ord-num' }, // wallet column hidden
                { key: 'remaining_final', label: __('ftotal'), sortable: true, class: 'ord-num' },
                { key: 'payment_method', label: __('p_method'), sortable: true },
                { key: 'delivery_date', label: __('delivery_date'), sortable: true },
                { key: 'active_status', label: __('status'), sortable: true },
                { key: 'actions', label: __('actions'), class: 'ord-actions-col' }
            ],
            totalOrderRows: 1,
            orderItemFields: [
                { key: 'order_id', label: __('order_id'), sortable: true, sortDirection: 'desc' },
                { key: 'product_name', label: __('product'), sortable: true },
                { key: 'user_name', label: __('Shop Name'), sortable: true },
                { key: 'total', label: __('total'), sortable: true, class: 'ord-num' },
                { key: 'payment_method', label: __('p_method'), sortable: true },
                { key: 'delivery_date', label: __('delivery_date'), sortable: true },
                { key: 'is_credited', label: __('commission'), sortable: true },
                { key: 'active_status', label: __('status'), sortable: true },
                { key: 'actions', label: __('actions'), class: 'ord-actions-col' }
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
            statusCounts: [], // seller-wide order count per status, from the orders API
            activeTab: 'orders', // 'orders' | 'items'
            searchTimer: null,

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
        // Clickable cards above the table; counts are seller-wide (not date filtered)
        statusCards() {
            const count = (id) => {
                const row = this.statusCounts.find(r => Number(r.id) === id);
                return row ? (parseInt(row.order_count) || 0) : 0;
            };
            const all = this.statusCounts
                .filter(r => Number(r.id) !== 0)
                .reduce((sum, r) => sum + (parseInt(r.order_count) || 0), 0);
            return [
                { key: 'all', id: '', label: this.__('all_orders'), count: all, icon: 'fa-shopping-bag', tone: 'blue' },
                { key: 'received', id: 2, label: this.getStatusLabelById(2), count: count(2), icon: 'fa-inbox', tone: 'amber' },
                { key: 'out', id: 5, label: this.getStatusLabelById(5), count: count(5), icon: 'fa-truck', tone: 'purple' },
                { key: 'delivered', id: 6, label: this.getStatusLabelById(6), count: count(6), icon: 'fa-check-circle', tone: 'green' },
            ];
        },
        hasActiveFilters() {
            return !!(this.search
                || this.status
                || this.dateRange.startDate
                || this.deliveryDateRange.startDate);
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
    beforeDestroy() {
        clearTimeout(this.searchTimer);
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
        // ---- presentation helpers ----
        formatMoney(value) {
            const n = parseFloat(value);
            if (isNaN(n)) return '0';
            // whole amounts stay compact (4,000); fractional ones always show paise (8,336.30)
            const digits = Number.isInteger(n) ? 0 : 2;
            return n.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: 2 });
        },
        formatDate(value) {
            const m = moment(value);
            return value && m.isValid() ? m.format('DD MMM YYYY') : '-';
        },
        formatDateTime(value) {
            const m = moment(value);
            return value && m.isValid() ? m.format('DD MMM, hh:mm A') : '';
        },
        initials(name) {
            const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
            if (!parts.length) return '?';
            return ((parts[0][0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
        },
        // Stable colour per shop so the same shop always gets the same avatar
        avatarTone(name) {
            const tones = ['blue', 'green', 'purple', 'amber', 'red'];
            let hash = 0;
            String(name || '').split('').forEach(ch => { hash = (hash * 31 + ch.charCodeAt(0)) % 997; });
            return tones[hash % tones.length];
        },
        statusTone(statusId) {
            switch (Number(statusId)) {
                case 2: return 'blue';            // Received
                case 3: return 'purple';          // Processed
                case 4: case 5: return 'amber';   // Shipped, Out For Delivery
                case 6: return 'green';           // Delivered
                case 7: case 8: return 'red';     // Cancelled, Returned
                case 12: return 'purple';         // Rescheduled
                case 13: return 'amber';          // Partial Delivery
                case 14: return 'red';            // Not Delivered
                case 11: return 'green';          // Picked Up
                default: return 'slate';          // Payment Pending, Pending, ...
            }
        },
        rowClass(item) {
            return item && [7, 8].includes(Number(item.active_status)) ? 'ord-row--off' : '';
        },
        rangeText(page, perPage, total) {
            if (!total) return '';
            const from = (page - 1) * perPage + 1;
            const to = Math.min(page * perPage, total);
            return from + '-' + to + ' / ' + total;
        },

        // ---- filters ----
        // The status cards double as quick filters; clicking the active one again clears it
        setStatus(id) {
            this.status = String(this.status) === String(id) ? '' : id;
            this.currentPage = 1;
            this.itemCurrentPage = 1;
            this.handleFilterChange();
        },
        onSearchInput() {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => this.handleFilterChange(), 350);
        },
        clearSearch() {
            this.search = '';
            this.handleFilterChange();
        },
        clearAllFilters() {
            this.search = '';
            this.status = '';
            this.dateRange.startDate = null;
            this.dateRange.endDate = null;
            this.deliveryDateRange.startDate = null;
            this.deliveryDateRange.endDate = null;
            localStorage.setItem('dateRangeStartDeliveryDateFilter', null);
            localStorage.setItem('dateRangeEndDeliveryDateFilter', null);
            this.handleFilterChange();
        },

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
                // Payment Pending (id 1) never applies to Sarthi's COD-only distributor flow;
                // Shipped (id 4) is unused in this flow too
                this.statuses = response.data.data.filter(status => status.id != 1 && status.id != 4);
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
                this.statusCounts = response.data.data.status_order_count || [];
                this.totalOrderRows = response.data.total;

                this.total_amount = this.orders.map(item => parseFloat(item.total) || 0).reduce((prev, curr) => prev + curr, 0).toFixed(2);
                this.delivery_charge = this.orders.map(item => parseFloat(item.delivery_charge) || 0).reduce((prev, curr) => prev + curr, 0).toFixed(2);
                this.remaining_final = this.orders.map(item => parseFloat(item.remaining_final) || 0).reduce((prev, curr) => prev + curr, 0).toFixed(2);

                this.order_items = response.data.data.order_items;
                this.totalOrderItemRows = response.data.data.total_order_item;
                this.order_items_total_sum = this.order_items.map(item => parseFloat(item.total) || 0).reduce((prev, curr) => prev + curr, 0).toFixed(2);

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

/* ---------- tokens ---------- */
.ord-scope {
    --ord-card: #ffffff;
    --ord-border: #e5eaf2;
    --ord-text: #0f172a;
    --ord-muted: #64748b;
    --ord-soft: #f4f7fb;
    --ord-primary: #1e3a8a;
    --ord-primary-hover: #172d6e;
    --ord-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 20px rgba(15, 23, 42, 0.04);

    --ord-green-bg: #e7f7ef;  --ord-green-fg: #047857;  --ord-green: #10b981;
    --ord-amber-bg: #fff6e0;  --ord-amber-fg: #b45309;  --ord-amber: #f59e0b;
    --ord-red-bg: #fdecec;    --ord-red-fg: #b91c1c;    --ord-red: #ef4444;
    --ord-blue-bg: #e8f0fe;   --ord-blue-fg: #1d4ed8;   --ord-blue: #3b82f6;
    --ord-purple-bg: #f1eafe; --ord-purple-fg: #6d28d9; --ord-purple: #8b5cf6;
    --ord-slate-bg: #eef1f6;  --ord-slate-fg: #475569;  --ord-slate: #94a3b8;

    color: var(--ord-text);
    font-variant-numeric: tabular-nums;
}
.theme-dark .ord-scope {
    --ord-card: #1e1e2d;
    --ord-border: #2f2f45;
    --ord-text: #eef2f7;
    --ord-muted: #9aa5b8;
    --ord-soft: #262639;
    --ord-primary: #3d5fd6;
    --ord-primary-hover: #5373e6;
    --ord-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);

    --ord-green-bg: rgba(16, 185, 129, 0.16);  --ord-green-fg: #4ade9f;
    --ord-amber-bg: rgba(245, 158, 11, 0.16);  --ord-amber-fg: #fbbf4a;
    --ord-red-bg: rgba(239, 68, 68, 0.16);     --ord-red-fg: #f87171;
    --ord-blue-bg: rgba(59, 130, 246, 0.18);   --ord-blue-fg: #7fb0ff;
    --ord-purple-bg: rgba(139, 92, 246, 0.18); --ord-purple-fg: #b69cff;
    --ord-slate-bg: rgba(148, 163, 184, 0.14); --ord-slate-fg: #b6c0d1;
}
.ord { padding: 24px; }

.ord-tone--green  { --tone-bg: var(--ord-green-bg);  --tone-fg: var(--ord-green-fg); }
.ord-tone--amber  { --tone-bg: var(--ord-amber-bg);  --tone-fg: var(--ord-amber-fg); }
.ord-tone--red    { --tone-bg: var(--ord-red-bg);    --tone-fg: var(--ord-red-fg); }
.ord-tone--blue   { --tone-bg: var(--ord-blue-bg);   --tone-fg: var(--ord-blue-fg); }
.ord-tone--purple { --tone-bg: var(--ord-purple-bg); --tone-fg: var(--ord-purple-fg); }
.ord-tone--slate  { --tone-bg: var(--ord-slate-bg);  --tone-fg: var(--ord-slate-fg); }

/* ---------- header ---------- */
.ord-head { display: flex; align-items: baseline; gap: 14px; margin-bottom: 16px; }
.ord-eyebrow { padding-right: 14px; border-right: 1px solid var(--ord-border); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ord-muted); }
.ord-head h1 { margin: 0; font-size: 28px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--ord-text); }

/* ---------- shared ---------- */
.ord-card { background: var(--ord-card); border: 1px solid var(--ord-border); border-radius: 18px; box-shadow: var(--ord-shadow); }
.ord-btn {
    display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; border-radius: 12px;
    border: 1px solid var(--ord-border); background: var(--ord-card); color: var(--ord-text); font-size: 13.5px; font-weight: 600; cursor: pointer;
}
.ord-btn:hover { background: var(--ord-soft); }
.ord-iconbtn {
    width: 38px; height: 38px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; padding: 0;
    border-radius: 10px; border: 1px solid var(--ord-border); background: var(--ord-card); color: var(--ord-muted);
    font-size: 14px; cursor: pointer; text-decoration: none !important; transition: background-color 0.15s ease, color 0.15s ease;
}
.ord-iconbtn:hover { background: var(--ord-soft); color: var(--ord-primary); }
.ord-pill {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 999px;
    font-size: 12px; font-weight: 600; line-height: 1.2; white-space: nowrap; background: var(--tone-bg); color: var(--tone-fg);
}
.ord-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.ord-tag { display: inline-block; padding: 3px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; background: var(--ord-soft); color: var(--ord-muted); border: 1px solid var(--ord-border); }
.ord-tile { flex-shrink: 0; width: 46px; height: 46px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 19px; background: var(--tone-bg); color: var(--tone-fg); }
.ord-dash { color: var(--ord-slate); }
.ord-hint { border-bottom: 1px dotted currentColor; cursor: help; }

/* ---------- status cards ---------- */
.ord-cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px; }
.ord-stat {
    display: flex; align-items: center; gap: 14px; padding: 16px 18px; text-align: left; width: 100%;
    cursor: pointer; font: inherit; color: inherit; transition: box-shadow 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.ord-stat:hover { box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08); transform: translateY(-2px); }
.ord-stat--on { border-color: var(--ord-primary); box-shadow: 0 0 0 3px var(--ord-blue-bg), var(--ord-shadow); }
.ord-stat__body { display: flex; flex-direction: column; min-width: 0; gap: 2px; }
.ord-stat__label { font-size: 13px; color: var(--ord-muted); }
.ord-stat__value { font-size: 26px; line-height: 1.1; font-weight: 800; letter-spacing: -0.02em; color: var(--ord-text); }

/* ---------- filters (one line) ---------- */
.ord-filters { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 12px; padding: 12px 14px; margin-bottom: 16px; }
.ord-search { position: relative; flex: 1 1 220px; min-width: 200px; }
.ord-search > .fa-search { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ord-slate); font-size: 14px; pointer-events: none; }
.ord-search input {
    width: 100%; height: 42px; padding: 0 38px 0 40px; border-radius: 12px; border: 1px solid var(--ord-border);
    background: var(--ord-soft); color: var(--ord-text); font-size: 14px; outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.ord-search input::placeholder { color: var(--ord-muted); }
.ord-search input:focus { background: var(--ord-card); border-color: var(--ord-blue); box-shadow: 0 0 0 3px var(--ord-blue-bg); }
.ord-search__clear { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 26px; height: 26px; border: 0; border-radius: 50%; background: transparent; color: var(--ord-muted); cursor: pointer; }
.ord-search__clear:hover { background: var(--ord-slate-bg); }

.ord-field__control { display: flex; align-items: center; gap: 6px; }
.ord-select {
    height: 42px; min-width: 150px; padding: 0 34px 0 14px; border-radius: 12px; border: 1px solid var(--ord-border);
    background-color: var(--ord-soft); color: var(--ord-text); font-size: 14px; outline: none; cursor: pointer;
}
.ord-select:focus { border-color: var(--ord-blue); box-shadow: 0 0 0 3px var(--ord-blue-bg); }
.ord-clear { width: 30px; height: 30px; border: 0; border-radius: 50%; background: var(--ord-slate-bg); color: var(--ord-slate-fg); cursor: pointer; font-size: 12px; }
.ord-clear:hover { background: var(--ord-red-bg); color: var(--ord-red-fg); }
.ord-linkbtn { height: 42px; border: 0; background: transparent; color: var(--ord-blue-fg); font-size: 13px; font-weight: 600; cursor: pointer; padding: 0 4px; white-space: nowrap; }
.ord-linkbtn:hover { text-decoration: underline; }

/* date range pickers (vue2-daterange-picker renders its own markup) */
::v-deep .ord-field__control .vue-daterange-picker { display: block; min-width: 215px; }
::v-deep .ord-field__control .vue-daterange-picker .form-control.reportrange-text {
    height: 42px; display: flex; align-items: center; border-radius: 12px; border: 1px solid var(--ord-border);
    background: var(--ord-soft); color: var(--ord-text); font-size: 14px; padding: 0 14px; gap: 8px;
}
.ord-placeholder { color: var(--ord-muted); }
.ord-picked { font-size: 11.5px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; color: var(--ord-muted); }
::v-deep .ord-field__control .reportrange-text .fa-calendar-alt { color: var(--ord-slate); }

/* ---------- panel ---------- */
.ord-panel { overflow: hidden; }
.ord-panel__head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px; padding: 16px 20px; border-bottom: 1px solid var(--ord-border); }
.ord-seg { display: inline-flex; gap: 4px; padding: 4px; border-radius: 12px; background: var(--ord-slate-bg); }
.ord-seg__btn {
    display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border: 0; border-radius: 9px;
    background: transparent; color: var(--ord-muted); font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
}
.ord-seg__btn span { padding: 1px 8px; border-radius: 999px; font-size: 12px; background: var(--ord-card); color: var(--ord-slate-fg); }
.ord-seg__btn:hover { color: var(--ord-text); }
.ord-seg__btn--on { background: var(--ord-card); color: var(--ord-text); box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12); }
.ord-seg__btn--on span { background: var(--ord-primary); color: #fff; }

.ord-sums { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; font-size: 13px; color: var(--ord-muted); }
.ord-sums__cap { font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
.ord-sum { padding: 6px 12px; border-radius: 10px; background: var(--ord-soft); border: 1px solid var(--ord-border); }
.ord-sum strong { margin-left: 4px; color: var(--ord-text); }
.ord-sum--strong { background: var(--ord-green-bg); border-color: transparent; color: var(--ord-green-fg); }
.ord-sum--strong strong { color: var(--ord-green-fg); }

/* ---------- table (b-table renders its own markup, hence the deep selectors) ---------- */
.ord-tablewrap { margin: 0; }
::v-deep .ord-table { margin: 0; color: var(--ord-text); }
::v-deep .ord-table thead th {
    padding: 12px 16px; border: 0; background: var(--ord-soft); color: var(--ord-muted); white-space: nowrap; vertical-align: middle;
    font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
}
::v-deep .ord-table tbody td { padding: 14px 16px; vertical-align: middle; border-top: 1px solid var(--ord-border); color: var(--ord-text); }
::v-deep .ord-table tbody tr:first-child > td { border-top: 0; }
::v-deep .ord-table.table-hover tbody tr:hover > td { background: var(--ord-soft); }
::v-deep .ord-table .ord-num { text-align: right; white-space: nowrap; }
::v-deep .ord-table .ord-actions-col { text-align: right; width: 1%; white-space: nowrap; }
::v-deep .ord-table tr.ord-row--off > td { opacity: 0.6; }
::v-deep .ord-table tr.b-table-details > td { padding: 0 16px 16px; background: var(--ord-soft); border-top: 0; }
::v-deep .ord-table tr.b-table-has-details > td { background: var(--ord-soft); }

.ord-id { display: flex; align-items: center; gap: 10px; }
.ord-toggle {
    width: 26px; height: 26px; flex-shrink: 0; border: 0; border-radius: 8px; background: var(--ord-slate-bg); color: var(--ord-slate-fg);
    font-size: 11px; cursor: pointer; transition: transform 0.15s ease, background-color 0.15s ease;
}
.ord-toggle:hover { background: var(--ord-blue-bg); color: var(--ord-blue-fg); }
.ord-toggle.is-open { transform: rotate(90deg); background: var(--ord-blue-bg); color: var(--ord-blue-fg); }
.ord-id__text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.ord-id__text strong { font-size: 14px; font-weight: 700; color: var(--ord-text); }
.ord-id__text span { font-size: 12px; color: var(--ord-muted); white-space: nowrap; }

.ord-shop { display: flex; align-items: center; gap: 12px; min-width: 190px; }
.ord-avatar {
    width: 38px; height: 38px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; background: var(--tone-bg); color: var(--tone-fg);
}
.ord-shop__text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.ord-shop__text strong { font-size: 14px; font-weight: 700; color: var(--ord-text); max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ord-shop__text span { font-size: 12px; color: var(--ord-muted); }
.ord-when { display: flex; flex-direction: column; gap: 2px; }
.ord-when strong { font-size: 13.5px; font-weight: 600; color: var(--ord-text); white-space: nowrap; }
.ord-when span { font-size: 12px; color: var(--ord-muted); white-space: nowrap; }
.ord-actions { display: inline-flex; gap: 8px; }

.ord-busy { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 36px 0; color: var(--ord-muted); font-size: 14px; }
.ord-empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 52px 24px; }
.ord-empty__icon { width: 68px; height: 68px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 6px; background: var(--ord-blue-bg); color: var(--ord-blue-fg); }
.ord-empty h3 { margin: 0; font-size: 18px; font-weight: 700; color: var(--ord-text); }
.ord-empty p { margin: 0 0 10px; max-width: 360px; font-size: 14px; color: var(--ord-muted); }
.ord-empty-inline { margin: 0; padding: 16px 0; text-align: center; font-size: 13.5px; color: var(--ord-muted); }

/* expanded order lines */
.ord-details { padding-top: 4px; }
.ord-lines { list-style: none; margin: 0; padding: 0; border: 1px solid var(--ord-border); border-radius: 14px; background: var(--ord-card); overflow: hidden; }
.ord-lines li { display: flex; align-items: center; gap: 14px; padding: 12px 16px; }
.ord-lines li + li { border-top: 1px dashed var(--ord-border); }
.ord-lines__img { width: 44px; height: 44px; flex-shrink: 0; border-radius: 10px; object-fit: cover; background: var(--ord-soft); border: 1px solid var(--ord-border); }
.ord-lines__img--blank { display: flex; align-items: center; justify-content: center; color: var(--ord-slate); }
.ord-lines__name { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.ord-lines__name strong { font-size: 13.5px; font-weight: 600; color: var(--ord-text); }
.ord-lines__name span { font-size: 12px; color: var(--ord-muted); }
.ord-lines__qty { font-size: 13px; font-weight: 700; padding: 2px 10px; border-radius: 8px; background: var(--ord-soft); color: var(--ord-text); }
.ord-lines__amt { min-width: 80px; text-align: right; font-size: 14px; color: var(--ord-text); }

/* ---------- footer ---------- */
.ord-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px; padding: 14px 20px; border-top: 1px solid var(--ord-border); }
.ord-foot__size { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--ord-muted); }
.ord-foot__size label { margin: 0; }
.ord-foot__size .form-select { width: auto; min-width: 72px; }
.ord-foot__count { flex: 1; font-size: 13px; color: var(--ord-muted); white-space: nowrap; }

/* ---------- responsive ---------- */
@media (max-width: 1199px) {
    .ord-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 767px) {
    .ord { padding: 16px; }
    .ord-head h1 { font-size: 24px; }
    .ord-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .ord-stat { padding: 12px; gap: 10px; }
    .ord-tile { width: 38px; height: 38px; font-size: 16px; }
    .ord-stat__value { font-size: 22px; }
    .ord-search { flex-basis: 100%; }
    .ord-select { flex: 1 1 0; min-width: 0; }
    .ord-panel__head { padding: 12px; }
    .ord-seg { width: 100%; }
    .ord-seg__btn { flex: 1; justify-content: center; }
    .ord-foot__count { flex: none; margin-left: auto; }
    .ord-foot .pagination { width: 100%; justify-content: center; }
    .ord-lines li { flex-wrap: wrap; }
    .ord-seg__btn { white-space: nowrap; padding: 0 10px; gap: 6px; }
    .ord-field__control { flex: 1 1 100%; }
    ::v-deep .ord-field__control .vue-daterange-picker { flex: 1; min-width: 0; }

    /* bootstrap-vue stacks each table row into labelled lines below md; turn every order into a card */
    ::v-deep .ord-table.b-table-stacked-md > tbody > tr {
        display: block; margin: 12px; border: 1px solid var(--ord-border); border-radius: 14px; overflow: hidden; background: var(--ord-card);
    }
    ::v-deep .ord-table.b-table-stacked-md > tbody > tr > [data-label] { padding: 9px 14px; border-top: 1px dashed var(--ord-border); }
    ::v-deep .ord-table.b-table-stacked-md > tbody > tr > [data-label]:first-child { border-top: 0; padding-top: 14px; }
    ::v-deep .ord-table.b-table-stacked-md > tbody > tr > [data-label]::before {
        text-align: left; font-weight: 600; font-size: 11.5px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ord-muted);
    }
    ::v-deep .ord-table.b-table-stacked-md > tbody > tr.b-table-details { margin: -4px 12px 12px; border-style: dashed; }
    ::v-deep .ord-table.b-table-stacked-md > tbody > tr.b-table-details > td { padding: 12px; }
    ::v-deep .ord-table .ord-actions-col { width: auto; white-space: normal; text-align: left; }
}
</style>
