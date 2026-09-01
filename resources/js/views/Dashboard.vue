<template>
    <div>
        <div class="page-heading d-flex justify-content-between align-items-center mb-4 text-start">
            <div class="text-start w-100">
                <h3 class="mb-0 fw-bold header-title text-start" style="color: #2b3674; font-size: 1.75rem; letter-spacing: -0.5px; text-align: left !important;">{{ __('welcome') }}, {{ adminName }}</h3>
                <p class="mb-0 header-subtitle text-start" style="color: #05cd99; font-weight: 500; font-size: 0.95rem; text-align: left !important;">{{ __(greetingKey) }} &bull; {{ currentDate }}</p>
            </div>
        </div>
        <div class="page-content">
            <section class="row">
                <div class="row">
                    <div class="col-12">
                        <div class="row align-items-start metric-card-wrapper">
                            <div class="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2">
                                <div class="card shadow-sm border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link :to="{ name: 'MasterProducts' }" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #4285F4; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-cubes fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px; text-align: left !important;">{{ __('products') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2; text-align: left !important;">{{ record.product_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2">
                                <div class="card shadow-sm border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/users" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #10b981; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-users fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px; text-align: left !important;">{{ __('customers') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2; text-align: left !important;">{{ record.customer_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2">
                                <div class="card shadow-sm border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/sellers" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #f59e0b; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-store fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px; text-align: left !important;">{{ __('sellers') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2; text-align: left !important;">{{ record.seller_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2">
                                <div class="card shadow-sm border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/manage_categories" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #ef4444; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-bullseye fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px; text-align: left !important;">{{ __('categories') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2; text-align: left !important;">{{ record.category_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2">
                                <div class="card shadow-sm border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/brands" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #8b5cf6; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-code-branch fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px; text-align: left !important;">{{ __('brands') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2; text-align: left !important;">{{ record.brand_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2">
                                <div class="card shadow-sm border mb-4" style="border-radius: 12px; border-color: #E5E7EB !important;">
                                    <router-link to="/cities" class="text-decoration-none text-dark d-block w-100">
                                        <div class="card-body p-3 d-flex align-items-center">
                                            <div class="rounded d-flex justify-content-center align-items-center flex-shrink-0" style="width: 48px; height: 48px; background-color: #06b6d4; color: white; border-radius: 12px !important;">
                                                <i class="fa fa-map fs-4"></i>
                                            </div>
                                            <div class="ms-3 text-start w-100">
                                                <div class="text-muted small fw-semibold text-start" style="font-size: 13px; text-align: left !important;">{{ __('city') }}</div>
                                                <div class="fs-4 fw-bold text-start" style="color: #2b3674; line-height: 1.2; text-align: left !important;">{{ record.city_count || 0 }}</div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-5 col-xl-4 mb-4">
                        <div class="card shadow-sm border h-100" style="border-radius: 12px; border-color: #E5E7EB !important;">
                            <div class="card-body p-4">
                                <h4 class="mb-0 fw-bold header-title text-start" style="color: #2b3674; font-size: 1.15rem; letter-spacing: -0.5px; text-align: left !important;">{{ __('product_category_count') }}</h4>
                                <p class="text-muted small fw-semibold text-start mb-4" style="font-size: 13px; text-align: left !important;">{{ __('this_year') }}</p>
                                <div v-if="series2 && series2.length" class="d-flex justify-content-center">
                                    <apexcharts width="100%" type="donut" :options="options2" :series="series2"></apexcharts>
                                </div>
                                <div v-else class="text-center text-muted py-4">
                                    {{ __('no_product_found') }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-7 col-xl-8 mb-4">
                        <div class="list-surface h-100">
                            <div class="card-header">
                                <h4 class="card-title me-1">{{ __('top_brands') }}</h4>
                                <small>({{ __('month') }}: {{ currentMonth }})</small>
                            </div>
                            <div v-if="brands.length" class="list-group list-group-flush">
                                <div v-for="brand in brands" :key="brand.brand_id"
                                    class="list-group-item d-flex align-items-center justify-content-between">
                                    <span class="fw-semibold">{{ getDisplayName(brand.brand_name) || '' }}</span>
                                    <span class="fw-bold text-dark">{{ $currency }}{{ brand.total_revenue }}</span>
                                </div>
                            </div>
                            <div v-else class="text-center text-muted py-4">
                                {{ __('no_product_found') }}
                            </div>
                        </div>
                    </div>

                </div>

                <div class="row">

                    <!-- Sarthi: Weekly Sales chart hidden on admin dashboard, order-derived
                    <div class="col-12 col-lg-7 col-md-12">
                        <div class="card h-90">
                            <div class="card-header">
                                <h4 class="card-title me-1">{{ __('weekly_sales') }}</h4>
                                <p>{{ __('total_sale_in_last_week') }} ({{ __('month') }}: {{ currentMonth }})</p>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <apexchart width="700" height="260" :options="options" :series="series"
                                        ref="apexBarChart"></apexchart>
                                </div>
                            </div>
                        </div>
                    </div>
                    -->

                    <div class="col-12 col-lg-5 col-md-12 products_sold">
                        <!-- Sarthi: Packet/Loose Products cards hidden on admin dashboard, no equivalent concept in master catalog schema
                        <div class="row">
                            <div class="col-12 col-lg-6 col-md-6">
                                <div class="card">
                                    <div class="card-header text-center">
                                        <h6> {{ __('packet_products') }} </h6>
                                    </div>
                                    <div class="card-body">
                                        <h2 class="text-center">{{ record.packet_products }}</h2>

                                        <router-link :to="{ name: 'ProductInfo', params: { type: 'packet_products' } }"
                                            class="btn btn-block btn-light-primary btn-lg btn_product_count">{{
                                                __('more_info') }}
                                        </router-link>
                                    </div>

                                </div>
                            </div>
                            <div class="col-12 col-lg-6 col-md-6">
                                <div class="card">
                                    <div class="card-header text-center">
                                        <h6> {{ __('loose_products') }} </h6>
                                    </div>
                                    <div class="card-body">
                                        <h2 class="text-center">{{ record.loose_products }}</h2>
                                        <router-link :to="{ name: 'ProductInfo', params: { type: 'loose_products' } }"
                                            class="btn btn-lg btn-block btn-light-primary btn-lg btn_product_count">
                                            {{ __('more_info') }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        -->
                        <!-- Sarthi: Sold Out / Low Stock cards hidden on admin dashboard
                        <div class="row">
                            <div class="col-12 col-lg-6 col-md-6">
                                <div class="card">
                                    <div class="card-header text-center">
                                        <h6> {{ __('products_sold_out') }} </h6>
                                    </div>
                                    <div class="card-body">
                                        <h2 class="text-center">{{ record.sold_out_count }}</h2>

                                        <router-link :to="{ name: 'ProductInfo', params: { type: 'sold_out' } }"
                                            class="btn btn-block btn-light-primary btn-lg btn_product_count">{{
                                                __('more_info') }}
                                        </router-link>
                                    </div>

                                </div>
                            </div>
                            <div class="col-12 col-lg-6 col-md-6">
                                <div class="card">
                                    <div class="card-header text-center">
                                        <h6> {{ __('products_in_low_stock') }} </h6>
                                    </div>
                                    <div class="card-body">
                                        <h2 class="text-center">{{ record.low_stock_count }}</h2>
                                        <router-link :to="{ name: 'ProductInfo', params: { type: 'low_stock' } }"
                                            class="btn btn-lg btn-block btn-light-primary btn-lg btn_product_count">
                                            {{ __('more_info') }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        -->

                    </div>

                </div>


                <!-- Sarthi: Order Out Lines status breakdown hidden on admin dashboard
                <div class="row">
                    <h5 class="mb-4"> {{ __('order_out_lines') }} </h5>
                    <div class="col-12 col-sm-4 col-md-4 col-lg-2 col-xl-2 col-xxl-2 mb-2 mb-md-3"
                        v-for="status in record.status_order_count" :key="status.status">
                        <div class="card h-100">
                            <div class="card-body p-2 p-sm-3 h-100 d-flex flex-column justify-content-center align-items-center text-center">
                                <div class="d-flex flex-column justify-content-center align-items-center text-center">
                                    <div class="mb-2 d-flex justify-content-center">
                                        <div v-if="status.status == $pending" class="stats-icon payment_pending">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Payment_Pending.svg'"
                                                class="img-fluid">
                                        </div>
                                        <div v-else-if="status.status == $received" class="stats-icon received">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Received.svg'"
                                                class="img-fluid">
                                        </div>
                                        <div v-else-if="status.status == $processed" class="stats-icon processed">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Processed.svg'"
                                                class="img-fluid">
                                        </div>
                                        <div v-else-if="status.status == $shipped" class="stats-icon shipped">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Shipped.svg'"
                                                class="img-fluid">
                                        </div>
                                        <div v-else-if="status.status == $outForDelivery"
                                            class="stats-icon outForDelivery">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Out_For_Delivery.svg'"
                                                class="img-fluid">
                                        </div>
                                        <div v-else-if="status.status == $delivered" class="stats-icon delivered">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Delivered.svg'"
                                                class="img-fluid">
                                        </div>
                                        <div v-else-if="status.status == $cancelled" class="stats-icon cancelled">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Cancelled.svg'"
                                                class="img-fluid">
                                        </div>
                                        <div v-else-if="status.status == $returned" class="stats-icon returned">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Returned.svg'"
                                                class="img-fluid">
                                        </div>
                                        <div v-else-if="status.status == 'Pending'" class="stats-icon payment_pending">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Payment_Pending.svg'"
                                                class="img-fluid" />
                                        </div>
                                        <div v-else-if="status.status == 'Ready for Pickup'"
                                            class="stats-icon processed">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Processed.svg'"
                                                class="img-fluid" />
                                        </div>
                                        <div v-else-if="status.status == 'Picked Up'" class="stats-icon delivered">
                                            <img :src="$baseUrl + '/assets/images/dashboard/Delivered.svg'"
                                                class="img-fluid" />
                                        </div>
                                        <div v-else-if="status.status == 'Rescheduled'" class="stats-icon purple">
                                            <i class="fa fa-history"></i>
                                        </div>
                                        <div v-else class="stats-icon purple">
                                            <i class="iconly-boldBag"></i>
                                        </div>
                                    </div>

                                    <div>
                                        <h6 v-if="status.status == $pending" class="text-muted font-semibold">{{
                                            __('payment_pending') }}</h6>
                                        <h6 v-if="status.status == $received" class="text-muted font-semibold">{{
                                            __('received') }}</h6>
                                        <h6 v-if="status.status == $processed" class="text-muted font-semibold">{{
                                            __('processed') }}</h6>
                                        <h6 v-if="status.status == $shipped" class="text-muted font-semibold">{{
                                            __('shipped') }}</h6>
                                        <h6 v-if="status.status == $outForDelivery" class="text-muted font-semibold">{{
                                            __('outForDelivery') }}</h6>
                                        <h6 v-if="status.status == $delivered" class="text-muted font-semibold">{{
                                            __('delivered') }}</h6>
                                        <h6 v-if="status.status == $cancelled" class="text-muted font-semibold">{{
                                            __('cancelled') }}</h6>
                                        <h6 v-if="status.status == $returned" class="text-muted font-semibold">{{
                                            __('returned') }}</h6>
                                        <h6 v-if="status.status == 'Pending'" class="text-muted font-semibold">{{
                                            __('pending') }}</h6>
                                        <h6 v-if="status.status == 'Ready for Pickup'" class="text-muted font-semibold">
                                            {{ __('ready_for_pickup') }}</h6>
                                        <h6 v-if="status.status == 'Picked Up'" class="text-muted font-semibold">{{
                                            __('picked_up') }}</h6>
                                        <h4 class="font-extrabold mb-0">{{ status.order_count }}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                -->

                <div class="row">
                    <!-- Sarthi: Latest Orders table hidden on admin dashboard, orders are distributor-managed 

                    <div class="col-12" v-if="$can('order_list')">
                        <div class="card shadow-sm border" style="border-radius: 12px; border-color: #E5E7EB !important; overflow: hidden;">
                            <div class="card-header bg-white border-0 py-4">
                                <h4 class="recent-orders-card-title mb-0">Recent Orders</h4>
                            </div>
                            <div class="card-body">

                                <b-row class="mb-4 align-items-end">
                                    <b-col cols="12" md="7" lg="4" class="mb-2">
                                        <label class="box-title d-block mb-1">{{ __('from_and_to_date') }}</label>
                                        <div class="d-flex align-items-center">
                                            <date-range-picker :append-to-body="true" :autoApply=false :showDropdowns=true v-model="dateRange"
                                                :maxDate="maxDate" @update="getLatestOrders"
                                                :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"></date-range-picker>
                                            <button class="btn btn-sm btn-danger ms-1 flex-shrink-0"
                                                @click="dateRange.startDate = null, dateRange.endDate = null, getLatestOrders()">
                                                {{ __('clear') }}
                                            </button>
                                        </div>
                                    </b-col>
                                    <b-col cols="12" md="5" lg="2" class="mb-2">
                                        <label class="box-title d-block mb-1" for="status">{{ __('status') }}</label>
                                        <select id="status" name="status" v-model="status" @change="getLatestOrders()"
                                            class="form-control form-select">
                                            <option value="">{{ __('all_orders') }}</option>
                                            <option v-for="status in statuses" :value='status.id'>{{
                                                getStatusDisplayName(status) }}</option>
                                        </select>
                                    </b-col>
                                    <b-col cols="12" md="6" lg="2" class="mb-2">
                                        <label class="box-title d-block mb-1" for="seller">{{ __('seller') }}</label>
                                        <select name="seller" id="seller" v-model="seller" @change="getLatestOrders()"
                                            class="form-control form-select">
                                            <option value="">{{ __('select_seller') }}</option>
                                            <option v-for="seller in filterSellers" :value="seller.id">{{
                                                getDisplayName(seller.name) }}</option>
                                        </select>
                                    </b-col>
                                    <b-col cols="12" md="6" lg="3" class="mb-2">
                                        <label class="box-title d-block mb-1">{{ __('from_and_to_delivery_date')
                                        }}</label>
                                        <div class="d-flex align-items-center">
                                            <date-range-picker :append-to-body="true" :autoApply=false :showDropdowns=true
                                                v-model="deliveryDateRange" :maxDate="maxDate" @update="getLatestOrders"
                                                :locale-data="dateRangePickerLocale" :ranges="dateRangePickerRanges"></date-range-picker>
                                            <button class="btn btn-sm btn-danger ms-1 flex-shrink-0"
                                                @click="deliveryDateRange.startDate = null, deliveryDateRange.endDate = null, getLatestOrders()">
                                                {{ __('clear') }}
                                            </button>
                                        </div>
                                    </b-col>
                                    <b-col cols="12" md="12" lg="1"
                                        class="mb-2 d-flex align-items-end justify-content-center">
                                        <button class="btn btn-primary btn_refresh" v-b-tooltip.hover
                                            :title="__('refresh')" @click="getLatestOrders()">
                                            <i class="fa fa-refresh" aria-hidden="true"></i>
                                        </button>
                                    </b-col>
                                </b-row>

                                <div class="table-responsive">
                                    <b-table :items="orders" :fields="orderFields" :current-page="orderCurrentPage"
                                        :per-page="orderPerPage" :filter="orderFilter"
                                        :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                                        :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="false" borderless
                                        :busy="isLoading" show-empty class="modern-table"
                                        @row-clicked="toggleOrder" :tbody-tr-class="() => 'cursor-pointer modern-tr'">

                                        <template #table-busy>
                                            <div class="text-center text-black my-2">
                                                <b-spinner class="align-middle"></b-spinner>
                                                <strong>{{ __('loading') }}...</strong>
                                            </div>
                                        </template>

                                        <template #cell(id)="row">
                                            <div class="fw-bold text-dark">SB-ORD-00{{ row.item.id }}</div>
                                        </template>

                                        <template #cell(user_name)="row">
                                            <div class="fw-bold" style="color: #2b3674;">{{ row.item.user_name }}</div>
                                            <div class="small text-muted">{{ row.item.mobile | mobileMask }}</div>
                                        </template>

                                        <template #cell(mode)="row">
                                            <span class="badge bg-light text-primary rounded-pill px-3 py-2 border border-primary-subtle" style="font-size: 0.8rem;">
                                                <i class="fa fa-bolt me-1 text-success"></i> Quick
                                            </span>
                                        </template>

                                        <template #cell(payment_method)="row">
                                            <span class="text-uppercase fw-semibold">{{ row.item.payment_method }}</span>
                                        </template>

                                        <template #cell(active_status)="row">
                                            <span class="badge rounded-pill px-3 py-2" :class="getModernStatusBadgeClass(row.item.active_status)">
                                                {{ getStatusLabelById(row.item.active_status) }}
                                            </span>
                                        </template>

                                        <template #cell(remaining_final)="row">
                                            <div class="fw-bold text-dark">{{  }}{{ row.item.remaining_final }}</div>
                                        </template>

                                        <template #cell(created_at)="row">
                                            <div class="text-muted">{{ formatDate(row.item.created_at) }}</div>
                                        </template>

                                    </b-table>
                                </div>
                                <b-row>
                                    <b-col md="2" class="my-1">
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">
                                            <b-form-select id="per-page-select" v-model="orderPerPage"
                                                :options="pageOptions" size="sm"
                                                class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="4" class="my-1" offset-md="6">
                                        <b-pagination v-model="orderCurrentPage" :total-rows="orderTotalRows"
                                            :per-page="orderPerPage" align="fill" size="sm" class="my-0"></b-pagination>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </div>

                    -->
                    <div class="col-lg-6 col-md-12 col-sm-12 mb-4">
                        <div class="list-surface h-100">
                            <div class="card-header">
                                <h4 class="card-title me-1">{{ __('top_sellers') }}</h4>
                                <small>({{ __('month') }}: {{ currentMonth }})</small>
                            </div>

                            <div class="table-responsive">
                                <b-table :items="sellers" :fields="sellerFields" :current-page="currentPage"
                                    :per-page="perPage" :filter="sellerFilter" :filter-included-fields="filterOn"
                                    :sort-by.sync="sellerSortBy" :sort-desc.sync="sellerSortDesc"
                                    :sort-direction="sortDirection" :bordered="true" show-empty small>
                                    <template #head()="data">
                                        <span class="th-sort-inline">
                                            {{ data.label }}
                                            <i v-if="data.field.sortable" class="th-sort-icon"
                                                :class="sortIconClass(sellerSortBy, sellerSortDesc, data.column)"></i>
                                        </span>
                                    </template>
                                    <template #cell(seller_name)="row">
                                        {{ getDisplayName(row.item.name) || row.item.seller_name || '' }}
                                    </template>
                                    <template #cell(store_name)="row">
                                        {{ getDisplayName(row.item.store_name) || '' }}
                                    </template>
                                </b-table>
                            </div>

                            <div class="list-footer">
                                <div class="list-perpage">
                                    <b-form-group :label="__('per_page')" label-for="per-page-select-sellers"
                                        label-align-sm="right" label-size="sm" class="mb-0">
                                        <b-form-select id="per-page-select-sellers" v-model="perPage"
                                            :options="pageOptions" size="sm"
                                            class="form-control form-select">
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <b-pagination
                                    v-model="currentPage"
                                    :total-rows="totalRows"
                                    :per-page="perPage"
                                    align="fill"
                                    size="sm"
                                    class="list-pagination">
                                </b-pagination>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 col-md-12 col-sm-12 mb-4">
                        <div class="list-surface h-100">
                            <div class="card-header">
                                <h4 class="card-title me-1">{{ __('top_categories') }}</h4>
                                <small>({{ __('month') }}: {{ currentMonth }})</small>
                            </div>

                            <div class="table-responsive">
                                <b-table :items="categories" :fields="categoryFields"
                                    :current-page="categoryCurrentPage" :per-page="categoryPerPage"
                                    :filter="categoryFilter" :filter-included-fields="filterOn"
                                    :sort-by.sync="categorySortBy" :sort-desc.sync="categorySortDesc"
                                    :sort-direction="sortDirection" :bordered="true" show-empty small>
                                    <template #head()="data">
                                        <span class="th-sort-inline">
                                            {{ data.label }}
                                            <i v-if="data.field.sortable" class="th-sort-icon"
                                                :class="sortIconClass(categorySortBy, categorySortDesc, data.column)"></i>
                                        </span>
                                    </template>
                                    <template #cell(category_name)="row">
                                        {{ getDisplayName(row.item.category_name) || '' }}
                                    </template>
                                    <template #cell(product_name)="row">
                                        {{ getDisplayName(row.item.product_name) || '' }}
                                    </template>
                                </b-table>
                            </div>

                            <div class="list-footer">
                                <div class="list-perpage">
                                    <b-form-group :label="__('per_page')" label-for="per-page-select-categories"
                                        label-align-sm="right" label-size="sm" class="mb-0">
                                        <b-form-select id="per-page-select-categories" v-model="categoryPerPage"
                                            :options="pageOptions" size="sm"
                                            class="form-control form-select">
                                        </b-form-select>
                                    </b-form-group>
                                </div>
                                <b-pagination
                                    v-model="categoryCurrentPage"
                                    :total-rows="categoryTotalRows"
                                    :per-page="categoryPerPage"
                                    align="fill"
                                    size="sm"
                                    class="list-pagination">
                                </b-pagination>
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
import DateRangePickerMixin from '../mixins/DateRangePickerMixin'
import Auth from '../Auth.js';
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
            currentDate: moment().format('D MMM YYYY'),
            deliveryDateRange: { startDate: null, endDate: null },
            maxDate: new Date(),
            isLoading: false,
            record: [],
            currentMonth: "",

            sellerFields: [
                { key: 'seller_id', label: __('distributor_id').toUpperCase(), sortable: true, thClass: 'text-center border-0 fw-semibold text-muted', tdClass: 'text-center align-middle py-3' },
                { key: 'seller_name', label: __('distributors').toUpperCase(), sortable: true, thClass: 'text-center border-0 fw-semibold text-muted', tdClass: 'text-center align-middle fw-bold py-3' },
                { key: 'store_name', label: __('store_name').toUpperCase(), sortable: true, thClass: 'text-center border-0 fw-semibold text-muted', tdClass: 'text-center align-middle py-3' },
                { key: 'total_revenue', label: __('total_revenue').toUpperCase() + '(' + this.$currency + ')', sortable: true, thClass: 'text-center border-0 fw-semibold text-muted', tdClass: 'text-center align-middle fw-bold py-3' }
            ],

            categoryFields: [
                { key: 'category_id', label: __('id').toUpperCase(), sortable: true, thClass: 'text-center border-0 fw-semibold text-muted', tdClass: 'text-center align-middle py-3' },
                { key: 'category_name', label: __('category').toUpperCase(), sortable: true, thClass: 'text-center border-0 fw-semibold text-muted', tdClass: 'text-center align-middle fw-bold py-3' },
                { key: 'product_name', label: __('product').toUpperCase(), sortable: true, thClass: 'text-center border-0 fw-semibold text-muted', tdClass: 'text-center align-middle py-3' },
                { key: 'total_revenue', label: __('total_revenue').toUpperCase() + ' (' + this.$currency + ')', sortable: true, thClass: 'text-center border-0 fw-semibold text-muted', tdClass: 'text-center align-middle fw-bold py-3' }
            ],

            orderFields: [
                { key: 'id', label: __('order').toUpperCase(), sortable: true, thClass: 'text-start border-0 fw-semibold text-muted bg-light', tdClass: 'text-start align-middle py-3' },
                { key: 'user_name', label: __('customer').toUpperCase(), sortable: true, thClass: 'text-start border-0 fw-semibold text-muted bg-light', tdClass: 'text-start align-middle py-3' },
                { key: 'mode', label: __('mode').toUpperCase(), sortable: false, thClass: 'text-start border-0 fw-semibold text-muted bg-light', tdClass: 'text-start align-middle py-3' },
                { key: 'payment_method', label: __('p_method').toUpperCase(), sortable: true, thClass: 'text-start border-0 fw-semibold text-muted bg-light', tdClass: 'text-start align-middle py-3' },
                { key: 'active_status', label: __('status').toUpperCase(), sortable: true, thClass: 'text-start border-0 fw-semibold text-muted bg-light', tdClass: 'text-start align-middle py-3' },
                { key: 'remaining_final', label: __('amount').toUpperCase(), sortable: true, thClass: 'text-start border-0 fw-semibold text-muted bg-light', tdClass: 'text-start align-middle py-3' },
                { key: 'created_at', label: __('date').toUpperCase(), sortable: true, thClass: 'text-start border-0 fw-semibold text-muted bg-light', tdClass: 'text-start align-middle py-3' }
            ],

            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            sellerSortBy: 'total_revenue',
            sellerSortDesc: true,
            categorySortBy: 'total_revenue',
            categorySortDesc: true,

            orderFilter: null,
            sellerFilter: null,
            categoryFilter: null,

            filterOn: [],

            page: 1,

            sectionStyle: 'style_1',
            max_visible_units: 12,
            max_col_in_single_row: 3,

            sellers: [],
            totalRows: 1,
            currentPage: 1,
            perPage: 5,

            categories: [],
            categoryTotalRows: 1,
            categoryCurrentPage: 1,
            categoryPerPage: 5,

            brands: [],

            statuses: [],
            orders: [],
            orderTotalRows: 1,
            orderCurrentPage: 1,
            orderPerPage: 5,
            status: "",
            filterSellers: "",
            seller: "",

            graphOrders: [],
            isLoadingColumnChart: false,
            graphCategories: [],

            chartData: [],

            options: {
                chart: {
                    height: 500,
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
                    type: 'donut',
                    height: '350',
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%'
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                colors: ['#F59E0B', '#8B5CF6', '#10B981', '#3B82F6', '#14B8A6', '#EC4899', '#EF4444', '#FCD34D', '#A78BFA', '#34D399'],
                legend: {
                    show: true,
                    position: 'bottom',
                    fontSize: '13px',
                    fontFamily: 'Nunito, sans-serif',
                    markers: {
                        width: 12,
                        height: 12,
                        radius: 12
                    },
                    itemMargin: {
                        horizontal: 10,
                        vertical: 5
                    }
                },
                labels: [],
                responsive: [{
                    breakpoint: 9999,
                    options: {
                        chart: {
                            height: 350
                        }
                    }
                }]
            },
            series2: []
        };
    },
    computed: {
        greetingKey() {
            const hour = new Date().getHours();
            if (hour < 12) return 'good_morning';
            if (hour < 18) return 'good_afternoon';
            return 'good_evening';
        },
        adminName() {
            return Auth.user ? Auth.user.username : '';
        }
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.sellers.length
        this.categoryTotalRows = this.categories.length
        this.orderTotalRows = this.orders.length
    },
    created() {
        this.barChart();
        this.pieChart();

        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let now = new Date();
        this.currentMonth = months[now.getMonth()];
        this.getRecord();
        this.getOrderStatus();
        this.getLatestOrders();
        this.setSellerWalletTransaction();
    },
    methods: {
        barChart() {
            axios.get(this.$apiUrl + '/orders/weekly_sales').then((response) => {
                this.graphOrders = response.data.data;
                this.graphOrders.forEach((order) => {
                    this.options.xaxis.categories.push(moment(order.order_date).format('DD-MMM'));
                    this.series[0].data.push(order.total_sale);
                });
                this.$refs.apexBarChart.updateSeries([{
                    data: this.series[0].data,
                }], false, true);
            })
        },
        pieChart() {
            axios.get(this.$apiUrl + '/categories/product_count').then((response) => {
                this.graphCategories = response.data.data;
                this.graphCategories.forEach((category) => {
                    if (category.product_count !== 0) {
                        this.options2.labels.push(this.getDisplayName(category.name));
                        this.series2.push(category.product_count);
                    }
                });
            })
        },

        sortIconClass(sortBy, sortDesc, key) {
            if (sortBy !== key) return 'fa fa-sort';
            return sortDesc ? 'fa fa-sort-down' : 'fa fa-sort-up';
        },

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

        getRecord: function () {
            let vm = this;
            this.isLoading = true;
            axios.get(this.$apiUrl + '/dashboard').then(res => {
                vm.isLoading = false;
                let data = res.data;
                if (data.status === 1) {
                    this.record = data.data;
                    this.sellers = data.data.top_sellers;
                    this.totalRows = this.sellers.length;
                    this.categories = data.data.top_categories;
                    this.categoryTotalRows = this.categories.length;
                    this.brands = data.data.top_brands || [];
                }
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
        setSellerWalletTransaction: function () {

            let vm = this;
            this.isLoading = true;
            axios.get(this.$apiUrl + '/set_seller_wallet_transaction').then(res => {
                vm.isLoading = false;
                let data = res.data;
                if (data.status === 1) {
                    this.record = data.data;
                    this.sellers = data.data.top_sellers;
                    this.totalRows = this.sellers.length;
                    this.categories = data.data.top_categories;
                    this.categoryTotalRows = this.categories.length;
                }
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
        getOrderStatus: function () {
            let vm = this;
            Promise.all([
                axios.get(this.$apiUrl + '/order_statuses'),
                axios.get(this.$apiUrl + '/order_statuses/self_pickup')
            ]).then(([regularRes, selfPickRes]) => {
                this.isLoading = false;
                const regular = regularRes.data.data || [];
                // Self-pickup statuses excluding IDs already in regular (1,7,8 are shared)
                const regularIds = new Set(regular.map(s => s.id));
                const selfPick = (selfPickRes.data.data || []).filter(s => !regularIds.has(s.id));
                this.statuses = [...regular, ...selfPick];
            }).catch(error => {
                vm.isLoading = false;
                if (error.request && error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
            });
        },
        getLatestOrders: function () {
            this.isLoading = true;
            let vm = this;
            let param = {
                "startDate": (this.dateRange.startDate != null) ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : "",
                "endDate": (this.dateRange.endDate != null) ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : "",
                "seller": this.seller,
                "status": this.status,
                startDeliveryDate: this.deliveryDateRange.startDate ? moment(this.deliveryDateRange.startDate).format('YYYY-MM-DD') : '',
                endDeliveryDate: this.deliveryDateRange.endDate ? moment(this.deliveryDateRange.endDate).format('YYYY-MM-DD') : '',
            }
            axios.get(this.$apiUrl + '/orders', {
                params: param
            }).then((response) => {
                let data = response.data;
                if (data.status === 1) {
                    this.filterSellers = response.data.data.sellers;
                    this.orders = response.data.data.orders.map(o => {
                        o.order_items = [];
                        o.itemsLoading = false;
                        return o;
                    });
                    this.orderTotalRows = this.orders.length;
                    this.isLoading = false
                }
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
        deleteOrder(index, id) {
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

            // Fetch data if needed
            if (item.order_items.length > 0 || item.itemsLoading) {
                return;
            }

            item.itemsLoading = true;
            axios.get(this.$apiUrl + '/orders/view/' + item.id)
                .then(res => {
                    item.order_items = res.data.data.order_items || [];
                    item.itemsLoading = false;
                })
                .catch(() => {
                    item.itemsLoading = false;
                    this.showError('Failed to load order items');
                });
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
    },
};
</script>

<style scoped>
@import "../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

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

/* Sortable table headers: the label + sort caret render together as one
   centered unit (via #head() slot) instead of bootstrap-vue's default
   background-image caret pinned to the cell's far edge. */
::v-deep .list-surface table.b-table > thead > tr > [aria-sort] {
    background-image: none !important;
    padding-left: 0.3rem !important;
    padding-right: 0.3rem !important;
}

.th-sort-inline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
}

.th-sort-icon {
    font-size: 0.7rem;
    opacity: 0.6;
}
</style>
