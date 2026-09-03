<template>
    <div>
        <div class="page-heading">
            <h3>{{ __('dashboard') }}</h3>
        </div>
        <div class="page-content">
            <section class="row">

                <!-- Daily stock update reminder -->
                <div class="col-12" v-if="showStockWarning">
                    <div class="alert alert-warning d-flex align-items-center justify-content-between mb-3" style="border-left:4px solid #f0ad4e;">
                        <div class="d-flex align-items-center gap-2" style="cursor:pointer;" @click="goToStockManagement">
                            <i class="fa fa-exclamation-triangle me-2"></i>
                            <span><strong>{{ __('stock_update_reminder') }}</strong> — {{ __('click_here_to_update_stock') }}</span>
                            <i class="fa fa-arrow-right ms-2"></i>
                        </div>
                        <button type="button" class="btn-close ms-3" @click.stop="dismissStockWarning" aria-label="Dismiss"></button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="row align-items-start metric-card-wrapper">
                            <div class="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                <div class="card border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/seller/orders" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #4285F4; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-shopping-bag fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px;">{{ __('orders') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2;">{{ record.order_count }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                <div class="card border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/seller/manage_products" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #f59e0b; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-cubes fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px;">{{ __('products') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2;">{{ record.product_count }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                <div class="card border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/seller/categories" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #06b6d4; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-bullseye fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px;">{{ __('category') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2;">{{ record.category_count }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>

                            <div class="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                <div class="card border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/seller/delivery_boys" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #10b981; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-male fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px;">{{ __('delivery_boys') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2;">{{ record.driver_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                <div class="card border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <a href="#" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #8b5cf6; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-users fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px;">{{ __('salesman') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2;">{{ record.salesman_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-4 col-lg-2 col-xl-2">
                                <div class="card border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <a href="#" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #ef4444; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-line-chart fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px;">{{ __('retailer') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2;">{{ record.retailer_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 col-xl-6 product_category_count mb-3">
                        <div class="card h-100">
                            <div class="card-header">
                                <h4 class="card-title">{{ __('product_category_count') }}</h4>
                            </div>
                            <div class="card-body d-flex justify-content-center align-items-center chart-container">
                                <template v-if="series2.length > 0">
                                    <apexcharts class="w-100" height="100%" type="pie" :options="options2"
                                        :series="series2"></apexcharts>
                                </template>
                                <template v-else>
                                    <p class="text-muted">{{ __('no_product_found') }}</p>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Chart Section -->
                    <div class="col-12 col-xl-6 mb-3">
                        <div class="card h-100 dash-panel">
                            <div class="card-header">
                                <h4 class="card-title">{{ __('weekly_sales') }}</h4>
                                <p>{{ __('total_sale_in_last_week') }} ({{ __('month') }}: {{ currentMonth }})</p>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <apexchart :options="options" :series="series" width="100%" height="220"
                                        ref="apexBarChart">
                                    </apexchart>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Products Section (commented out: Sold Out / Low Stock cards)
                    <div class="col-12 col-lg-5">
                        <div class="row row-cols-1 row-cols-md-2 g-3">
                            Sold Out
                            <div class="col">
                                <div class="card h-100">
                                    <div class="card-header text-center">
                                        <h6>{{ __('products_sold_out') }}</h6>
                                    </div>
                                    <div class="card-body d-flex flex-column justify-content-center">
                                        <h1 class="text-center">{{ record.sold_out_count }}</h1>
                                        <router-link :to="{ name: 'SellerProductInfo', params: { type: 'sold_out' } }"
                                            class="btn btn-light-primary btn-lg mt-3 w-100">
                                            {{ __('more_info') }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>

                            Low Stock
                            <div class="col">
                                <div class="card h-100">
                                    <div class="card-header text-center">
                                        <h6>{{ __('products_in_low_stock') }}</h6>
                                    </div>
                                    <div class="card-body d-flex flex-column justify-content-center">
                                        <h1 class="text-center">{{ record.low_stock_count }}</h1>
                                        <router-link :to="{ name: 'SellerProductInfo', params: { type: 'low_stock' } }"
                                            class="btn btn-light-primary btn-lg mt-3 w-100">
                                            {{ __('more_info') }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    -->
                </div>

                <div class="row g-3 mb-3">
                    <h5 class="w-100">{{ __('order_out_lines') }}</h5>
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="status in record.status_order_count"
                        :key="status.status">
                        <div class="card border mb-0 h-100" style="border-radius: 12px; border-color: #E5E7EB !important;">
                            <div class="card-body p-3 d-flex align-items-center">
                                <!-- Left Icon -->
                                <div class="me-3 flex-shrink-0">
                                    <div v-if="status.status == $pending" class="stats-icon payment_pending">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Payment_Pending.svg'" />
                                    </div>
                                    <div v-else-if="status.status == $received" class="stats-icon received">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Received.svg'" />
                                    </div>
                                    <div v-else-if="status.status == $processed" class="stats-icon processed">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Processed.svg'" />
                                    </div>
                                    <div v-else-if="status.status == $shipped" class="stats-icon shipped">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Shipped.svg'" />
                                    </div>
                                    <div v-else-if="status.status == $outForDelivery" class="stats-icon outForDelivery">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Out_For_Delivery.svg'" />
                                    </div>
                                    <div v-else-if="status.status == $delivered" class="stats-icon delivered">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Delivered.svg'" />
                                    </div>
                                    <div v-else-if="status.status == $cancelled" class="stats-icon cancelled">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Cancelled.svg'" />
                                    </div>
                                    <div v-else-if="status.status == $returned" class="stats-icon returned">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Returned.svg'" />
                                    </div>
                                    <div v-else-if="status.status == 'Pending'" class="stats-icon payment_pending">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Payment_Pending.svg'" />
                                    </div>
                                    <div v-else-if="status.status == 'Ready for Pickup'" class="stats-icon processed">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Processed.svg'" />
                                    </div>
                                    <div v-else-if="status.status == 'Picked Up'" class="stats-icon delivered">
                                        <img :src="$baseUrl + '/assets/images/dashboard/Delivered.svg'" />
                                    </div>
                                    <div v-else-if="status.status == 'Rescheduled'" class="stats-icon purple">
                                        <i class="fa fa-history"></i>
                                    </div>
                                    <div v-else class="stats-icon purple">
                                        <i class="iconly-boldBag"></i>
                                    </div>
                                </div>

                                <!-- Right Content -->
                                <div class="flex-grow-1 text-start">
                                    <div class="text-muted small fw-semibold text-start" style="font-size: 13px;">{{ getStatusDisplayName(status) }}</div>
                                    <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2;">{{ status.order_count }}</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="list-surface">
                            <div class="card-header">
                                <h4 class="card-title">{{ __('latest_orders') }}</h4>
                            </div>
                            <div class="card-body">

                                <b-row class="mb-2">
                                    <b-col cols="12" md="6" lg="4" class="mb-2">
                                        <h6 class="box-title">{{ __('from_and_to_date') }}</h6>
                                        <div class="d-flex justify-content-center align-items-center">
                                            <date-range-picker :append-to-body="true" :autoApply=false :showDropdowns=true v-model="dateRange"
                                                :maxDate="maxDate" @update="getLatestOrders"
                                                :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"></date-range-picker>
                                            <button class="btn btn-sm btn-danger ml-1"
                                                @click="dateRange.startDate = null, dateRange.endDate = null, getLatestOrders()">
                                                {{ __('clear') }}
                                            </button>
                                        </div>
                                    </b-col>
                                    <b-col cols="12" md="6" lg="2" class="mb-2">
                                        <div class="form-group mb-0">
                                            <h6 class="box-title" for="status">{{ __('status') }}</h6>
                                            <select id="status" name="status" v-model="status"
                                                @change="getLatestOrders()" class="form-control form-select">
                                                <option value="">{{ __('all_orders') }}</option>
                                                <option v-for="status in statuses" :key="status.id" :value="status.id">
                                                    {{
                                                        getStatusLabel(status) }}</option>
                                            </select>
                                        </div>
                                    </b-col>
                                    <b-col cols="12" md="6" lg="3" class="mb-2">
                                        <h6 class="box-title">{{ __('from_and_to_delivery_date') }}</h6>
                                        <div class="d-flex justify-content-center align-items-center">
                                            <date-range-picker :append-to-body="true" :autoApply=false :showDropdowns=true
                                                v-model="deliveryDateRange" :maxDate="maxDate" @update="getLatestOrders"
                                                :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"></date-range-picker>
                                            <button class="btn btn-sm btn-danger ml-1"
                                                @click="deliveryDateRange.startDate = null, deliveryDateRange.endDate = null, getOrders()">
                                                {{ __('clear') }}
                                            </button>
                                        </div>
                                    </b-col>

                                    <b-col cols="12" md="6" lg="2" class="mb-2">
                                        <h6 class="box-title">{{ __('search') }}</h6>
                                        <b-form-input id="filter-input" v-model="filter" type="search"
                                            :placeholder="__('search')"></b-form-input>
                                    </b-col>
                                    <b-col cols="12" md="12" lg="1" class="text-center mb-2">
                                        <button class="list-icon-btn" v-b-tooltip.hover
                                            :title="__('refresh')" @click="getLatestOrders()">
                                            <i class="fa fa-refresh" aria-hidden="true"></i>
                                        </button>
                                    </b-col>

                                </b-row>
                                <div class="table-responsive">
                                    <b-table :items="orders" :fields="orderFields" :current-page="orderCurrentPage"
                                        :per-page="orderPerPage" :filter="filter" :filter-included-fields="filterOn"
                                        :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                        :sort-direction="sortDirection" :bordered="true" :busy="isLoading" stacked="md"
                                        show-empty small>
                                        <template #table-busy>
                                            <div class="text-center text-black my-2">
                                                <b-spinner class="align-middle"></b-spinner>
                                                <strong>{{ __('loading') }}</strong>
                                            </div>
                                        </template>

                                        <template #head(total)="row">
                                            {{ __('total') + ' (' + $currency + ')' }}
                                        </template>
                                        <template #head(delivery_charge)="row">
                                            {{ __('dcharges') + ' (' + $currency + ')' }}
                                        </template>
                                        <template #head(tax)="row">
                                            {{ __('tax') + ' (' + $currency + ') (%)' }}
                                        </template>
                                        <template #head(discount)="row">
                                            {{ __('disc') + ' (' + $currency + ') (%)' }}
                                        </template>
                                        <template #head(promo_discount)="row">
                                            {{ __('promo_disc') + ' (' + $currency + ')' }}
                                        </template>
                                        <template #head(wallet_balance)="row">
                                            {{ __('wallet_used') + ' (' + $currency + ')' }}
                                        </template>
                                        <template #head(remaining_final)="row">
                                            {{ __('ftotal') + ' (' + $currency + ')' }}
                                        </template>

                                        <template #cell(mobile)="row">
                                            {{ row.item.mobile | mobileMask }}
                                        </template>

                                        <template #cell(actions)="row">
                                            <router-link
                                                :to="{ name: 'SellerViewOrder', params: { id: row.item.id, record: row.item } }"
                                                v-b-tooltip.hover :title="__('view')" class="btn btn-primary btn-sm"><i
                                                    class="fa fa-eye"></i></router-link>
                                        </template>
                                    </b-table>
                                </div>
                                <div class="list-footer">
                                    <div class="list-perpage">
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">
                                            <b-form-select id="per-page-select" v-model="orderPerPage"
                                                :options="pageOptions" size="sm"
                                                class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </div>
                                    <b-pagination v-model="orderCurrentPage" :total-rows="orderTotalRows"
                                        :per-page="orderPerPage" align="fill" size="sm" class="list-pagination"></b-pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker'
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin'
import axios from "axios";
import { GChart } from 'vue-google-charts/legacy';
import moment from "moment";
import VueApexCharts from 'vue-apexcharts'
export default {
    name: 'Chart',
    mixins: [DateRangePickerMixin],
    components: {
        GChart,
        apexcharts: VueApexCharts,
        DateRangePicker
    },
    data: function () {
        let startDate = new Date();
        let endDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        return {
            dateRange: { startDate, endDate },
            deliveryDateRange: { startDate: null, endDate: null },
            maxDate: new Date(),
            isLoading: false,
            record: [],
            currentMonth: "",

            orderFields: [
                { key: 'id', label: __('oid'), sortable: true, sortDirection: 'desc' },
                { key: 'user_name', label: __('user'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile'), sortable: true, class: 'text-center' },
                { key: 'total', label: __('total'), sortable: true, class: 'text-center' },
                { key: 'delivery_charge', label: __('dcharges'), sortable: true, class: 'text-center' },
                { key: 'remaining_final', label: __('ftotal'), sortable: true, class: 'text-center' },
                { key: 'payment_method', label: __('p_method'), sortable: true, class: 'text-center' },
                { key: 'delivery_time', label: __('d_time'), sortable: true, class: 'text-center' },
                { key: "actions", label: __('actions') }
            ],

            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: null,
            filterOn: [],
            page: 1,

            sectionStyle: 'style_1',
            max_visible_units: 12,
            max_col_in_single_row: 3,

            statuses: [],

            orders: [],
            orderTotalRows: 1,
            orderCurrentPage: 1,
            orderPerPage: this.$perPage,
            status: "",


            graphOrders: [],
            isLoadingColumnChart: false,
            graphCategories: [],

            chartData: [],
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                },
                plotOptions: {
                    bar: {
                        borderRadius: 2,
                        dataLabels: {
                            position: 'top', // top, center, bottom
                        },
                    }
                },
                dataLabels: {
                    enabled: true,
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                },

                fill: {
                    colors: ['#25B076']
                },

                xaxis: {
                    categories: [],
                    position: 'top',
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    crosshairs: {
                        fill: {
                            type: 'gradient',
                            gradient: {
                                colorFrom: '#000',
                                colorTo: '#000',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                    }

                },
                title: {
                    text: 'Total Sale In Last Week.',
                    floating: false,
                    offsetY: 350,
                    align: 'center',
                    style: {
                        color: '#444'
                    }
                },
                noData: {
                    text: "No Data Found",
                    align: 'center',
                }
            },

            series: [{
                name: 'Total Sale',
                data: []
            }],
            options2: {
                chart: {
                    width: 380,
                    type: 'pie',
                },
                legend: {
                    show: true,
                    position: 'bottom'
                },
                labels: [],
                responsive: [{
                    breakpoint: 1000,
                    options: {

                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
            series2: [],
            showStockWarning: false,
            midnightTimer: null,
        };
    },
    mounted() {
        // Set the initial number of items
        this.orderTotalRows = this.orders.length
    },
    beforeDestroy() {
        clearTimeout(this.midnightTimer);
    },
    created() {
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let now = new Date();
        this.currentMonth = months[now.getMonth()];
        this.checkStockWarning();
        this.getRecord();
        this.getOrderStatus();
        this.getLatestOrders();
    },
    methods: {
        /**
         * Status name for display. Backend returns status_name as string (app) or object by lang code (panel).
         * When object, use app_locale to pick the name; fallback to status.status.
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
        /**
         * Translation key for order status id (matches OrderStatusList keys in lang files).
         */
        getStatusTranslationKey(id) {
            const map = { 1: 'payment_pending', 2: 'received', 3: 'processed', 4: 'shipped', 5: 'outForDelivery', 6: 'delivered', 7: 'cancelled', 8: 'returned', 9: 'pending', 10: 'ready_for_pickup', 11: 'picked_up', 12: 'rescheduled', 13: 'partial_delivery', 14: 'not_delivered' };
            return map[Number(id)] || '';
        },
        /**
         * Lang-wise label for status dropdown (uses panel __() and current language).
         */
        getStatusLabel(status) {
            if (!status) return '';
            const key = this.getStatusTranslationKey(status.id);
            return key ? this.__(key) : (status.status || '');
        },
        /**
         * Normalize category name for display. Backend returns string (app) or object by lang code (panel).
         * When object, use app_locale (window.appLocale or localStorage lang) to pick the name; fallback to first non-empty.
         */
        getCategoryDisplayName(name) {
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
        checkStockWarning() {
            const now = new Date();
            const today = now.toISOString().slice(0, 10);
            const dismissed = localStorage.getItem('stock_warning_dismissed');

            // Show only during 00:00–00:59 window and not yet dismissed today
            if (now.getHours() === 0 && dismissed !== today) {
                this.showStockWarning = true;
            }

            // Schedule to fire at the next midnight regardless of current time
            this.scheduleMidnightWarning();
        },
        scheduleMidnightWarning() {
            const now = new Date();
            const nextMidnight = new Date(now);
            nextMidnight.setHours(24, 0, 0, 0);
            const msUntilMidnight = nextMidnight - now;

            this.midnightTimer = setTimeout(() => {
                const today = new Date().toISOString().slice(0, 10);
                const dismissed = localStorage.getItem('stock_warning_dismissed');
                if (dismissed !== today) {
                    this.showStockWarning = true;
                }
                // Reschedule for next midnight
                this.scheduleMidnightWarning();
            }, msUntilMidnight);
        },
        dismissStockWarning() {
            const today = new Date().toISOString().slice(0, 10);
            localStorage.setItem('stock_warning_dismissed', today);
            this.showStockWarning = false;
        },
        goToStockManagement() {
            this.dismissStockWarning();
            this.$router.push('/seller/manage_stock');
        },
        getRecord: function () {
            let vm = this;
            this.isLoading = true;
            axios.get(this.$sellerApiUrl + '/dashboard').then(res => {
                vm.isLoading = false;
                let data = res.data;
                if (data.status === 1) {
                    this.record = data.data;

                    // barChart / pie: name can be string or object by lang code – use helper so we never push [object Object]
                    this.graphCategories = data.data.category_product_count;
                    this.graphCategories.forEach((category) => {
                        if (category.product_count !== 0) {
                            this.options2.labels.push(this.getCategoryDisplayName(category.name));
                            this.series2.push(category.product_count);
                        }
                    });
                    // pieChart
                    this.graphOrders = data.data.weekly_sales;
                    this.graphOrders.forEach((order) => {
                        this.options.xaxis.categories.push(moment(order.order_date).format('DD-MMM'));
                        this.series[0].data.push(order.total_sale);
                    });
                    this.$refs.apexBarChart.updateSeries([{
                        data: this.series[0].data,
                    }], false, true);
                }
            }).catch(error => {
                vm.isLoading = false;
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
            });
        },
        getOrderStatus: function () {
            let vm = this;
            axios.get(this.$apiUrl + '/order_statuses').then((response) => {
                this.isLoading = false
                this.statuses = response.data.data;
            }).catch(error => {
                vm.isLoading = false;
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
            });
        },
        getLatestOrders: function () {
            this.isLoading = true;
            let vm = this;
            let param = {
                "startDate": (this.dateRange.startDate != null) ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : "",
                "endDate": (this.dateRange.endDate != null) ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : "",
                "status": this.status,
                startDeliveryDate: this.deliveryDateRange.startDate ? moment(this.deliveryDateRange.startDate).format('YYYY-MM-DD') : '',
                endDeliveryDate: this.deliveryDateRange.endDate ? moment(this.deliveryDateRange.endDate).format('YYYY-MM-DD') : '',
            }
            axios.get(this.$sellerApiUrl + '/orders', {
                params: param
            }).then((response) => {
                let data = response.data;
                if (data.status === 1) {

                    this.orders = response.data.data.orders;
                    this.orderTotalRows = this.orders.length;
                    this.isLoading = false
                }
            }).catch(error => {
                vm.isLoading = false;
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
            });
        },

    },
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

.btn_product_count {
    margin-bottom: 10px;
}

.chart-container {
    min-height: 220px;
    height: 220px;
}

@media (max-width: 768px) {
    .chart-container {
        height: 200px;
    }
}
</style>
