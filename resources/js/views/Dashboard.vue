<template>
    <div>
        <div class="page-heading">
            <h3>{{ __('dashboard') }}</h3>
        </div>
        <div class="page-content">
            <section class="row">
                <div class="row">
                    <div class="col-12 col-xxl-6">
                        <div class="row">
                            <!-- Sarthi: Orders card hidden on admin dashboard, orders are distributor-managed
                            <div class="col-6 col-lg-3 col-md-3 col-sm-6">
                                <div class="card">
                                    <router-link to="/orders">
                                        <div class="card-body px-3 py-4-5">
                                            <div class="row d-flex flex-column justify-content-center ">
                                                <div class="col-md-12 d-flex justify-content-center align-items-center">
                                                    <div class="stats-icon-big blue">
                                                        <img
                                                            :src="$baseUrl + '/assets/images/dashboard/Total_Orders.svg'">
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-12 mt-3 d-flex flex-column justify-content-center align-items-center">
                                                    <h3 class="font-extrabold mb-0">{{ record.order_count }}</h3>
                                                    <h5 class="text-muted font-semibold">{{ __('orders') }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            -->
                            <div class="col-6 col-lg-4 col-md-4 col-sm-6">
                                <div class="card">
                                    <router-link :to="{ name: 'MasterProducts' }">
                                        <div class="card-body px-3 py-4-5">
                                            <div class="row">
                                                <div class="col-md-12 d-flex justify-content-center align-items-center">
                                                    <div class="stats-icon-big orange">
                                                        <i class="fa fa-cubes"></i>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-12 mt-3 d-flex flex-column justify-content-center align-items-center">
                                                    <h3 class="font-extrabold mb-0">{{ record.product_count }}</h3>
                                                    <h5 class="text-muted font-semibold">{{ __('products') }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-6 col-lg-4 col-md-4">
                                <div class="card">
                                    <router-link to="/users">
                                        <div class="card-body px-3 py-4-5">
                                            <div class="row">
                                                <div class="col-md-12 d-flex justify-content-center align-items-center">
                                                    <div class="stats-icon-big sky">
                                                        <img
                                                            :src="$baseUrl + '/assets/images/dashboard/Total_Customers.svg'">
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-12 mt-3 d-flex flex-column justify-content-center align-items-center">
                                                    <h3 class="font-extrabold mb-0">{{ record.customer_count }}</h3>
                                                    <h5 class="text-muted font-semibold">{{ __('customers') }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-6 col-lg-4 col-md-4">
                                <div class="card">
                                    <router-link to="/sellers">
                                        <div class="card-body px-3 py-4-5">
                                            <div class="row">
                                                <div class="col-md-12 d-flex justify-content-center align-items-center">
                                                    <div class="stats-icon-big lightgreen">
                                                        <i class="fa fa-solid fa-store"></i>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-12 mt-3 d-flex flex-column justify-content-center align-items-center">
                                                    <h3 class="font-extrabold mb-0">{{ record.seller_count }}</h3>
                                                    <h5 class="text-muted font-semibold">{{ __('sellers') }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>

                            <div class="col-6 col-lg-4 col-md-4">
                                <div class="card">
                                    <router-link to="/manage_categories">
                                        <div class="card-body px-3 py-4-5">
                                            <div class="row d-flex flex-column justify-content-center ">
                                                <div class="col-md-12 d-flex justify-content-center align-items-center">
                                                    <div class="stats-icon-big lightgreen">
                                                        <i class="fa fa-bullseye"></i>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-12 mt-3 d-flex flex-column justify-content-center align-items-center">
                                                    <h3 class="font-extrabold mb-0">{{ record.category_count }}</h3>
                                                    <h5 class="text-muted font-semibold">{{ __('categories') }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <div class="col-6 col-lg-4 col-md-4">
                                <div class="card">
                                    <router-link to="/brands">
                                        <div class="card-body px-3 py-4-5">
                                            <div class="row">
                                                <div class="col-md-12 d-flex justify-content-center align-items-center">
                                                    <div class="stats-icon-big sky">
                                                        <i class="fa fa-code-branch"></i>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-12 mt-3 d-flex flex-column justify-content-center align-items-center">
                                                    <h3 class="font-extrabold mb-0">{{ record.brand_count }}</h3>
                                                    <h5 class="text-muted font-semibold">{{ __('brands') }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            <!-- Sarthi: Sections card hidden on admin dashboard
                            <div class="col-6 col-lg-3 col-md-3">
                                <div class="card">
                                    <router-link to="/sections">
                                        <div class="card-body px-0 py-4-5">
                                            <div class="row">
                                                <div class="col-md-12 d-flex justify-content-center align-items-center">
                                                    <div class="stats-icon-big orange">
                                                        <i class="fa fa-puzzle-piece"></i>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-12 mt-3 d-flex flex-column justify-content-center align-items-center">
                                                    <h3 class="font-extrabold mb-0">{{ record.section_count }}</h3>
                                                    <h5 class="text-muted font-semibold">{{ __('sections') }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                            -->
                            <div class="col-6 col-lg-4 col-md-4">
                                <div class="card">
                                    <router-link to="/cities">
                                        <div class="card-body px-3 py-4-5">
                                            <div class="row">
                                                <div class="col-md-12 d-flex justify-content-center align-items-center">
                                                    <div class="stats-icon-big blue">
                                                        <i class="fa fa-map"></i>
                                                    </div>
                                                </div>
                                                <div
                                                    class="col-md-12 mt-3 d-flex flex-column justify-content-center align-items-center">
                                                    <h3 class="font-extrabold mb-0">{{ record.city_count }}</h3>
                                                    <h5 class="text-muted font-semibold">{{ __('city') }}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </router-link>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="col-12 col-xxl-6">
                        <div class="card">
                            <div class="card-header">
                                <h4 class="card-title text-center">{{ __('product_category_count') }}</h4>
                            </div>
                            <div class="card-body">
                                <div v-if="series2 && series2.length">
                                    <apexcharts width="100%" type="pie" :options="options2" :series="series2"></apexcharts>
                                </div>
                                <div v-else class="text-center text-muted py-4">
                                    {{ __('no_product_found') }}
                                </div>
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
                    <h5 class="mb-3"> {{ __('order_out_lines') }} </h5>
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
                        <div class="card">
                            <div class="card-header">
                                <h4 class="card-title">{{ __('latest_orders') }}</h4>
                            </div>
                            <div class="card-body">

                                <b-row class="mb-3 align-items-end">
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
                                        :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true"
                                        :busy="isLoading" stacked="md" show-empty show-details
                                        @row-clicked="toggleOrder" :tbody-tr-class="() => 'cursor-pointer'" small>
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

                                        <template #cell(active_status)="row">
                                            <span class="badge" :class="getStatusBadgeClass(row.item.active_status)">{{
                                                getStatusLabelById(row.item.active_status) }}</span>
                                        </template>

                                        <template #cell(actions)="row" v-if="$can('order_update')">
                                            <router-link
                                                :to="{ name: 'ViewOrder', params: { id: row.item.id, record: row.item } }"
                                                v-b-tooltip.hover :title="__('view')" class="btn btn-primary btn-sm"><i
                                                    class="fa fa-eye"></i></router-link>
                                            <button class="btn btn-danger btn-sm" v-b-tooltip.hover
                                                :title="__('delete')" v-if="$can('order_delete')"
                                                @click="deleteOrder(row.index, row.item.id)"><i
                                                    class="fa fa-trash"></i></button>
                                        </template>

                                        <template #row-details="row">
                                            <b-card class="m-2 p-2" style="background:#f8fafc;">
                                                <div
                                                    class="row font-weight-bold text-center border-bottom pb-2 mb-2 d-none d-md-flex">
                                                    <div class="col-md-3 text-left">{{ __('product') }}</div>
                                                    <div class="col-md-2">{{ __('image') }}</div>
                                                    <div class="col-md-2">{{ __('variant') }}</div>
                                                    <div class="col-md-1">{{ __('qty') }}</div>
                                                    <div class="col-md-2">{{ __('subtotal') }}</div>
                                                    <div class="col-md-2">{{ __('status') }}</div>
                                                </div>

                                                <div v-if="row.item.order_items && row.item.order_items.length">
                                                    <div v-for="(item, index) in row.item.order_items" :key="index"
                                                        class="row align-items-center border-bottom py-3 bg-white text-center">
                                                        <div class="col-md-3 text-left">
                                                            <strong>{{ item.product_name }}</strong>
                                                        </div>
                                                        <div class="col-md-2">
                                                            <img :src="item.image" alt="Image" height="50" />
                                                        </div>
                                                        <div class="col-md-2">
                                                            {{ item.variant_name || '-' }}
                                                        </div>
                                                        <div class="col-md-1">
                                                            {{ item.quantity }}
                                                        </div>
                                                        <div class="col-md-2 font-weight-bold">
                                                            {{ $currency }} {{ item.sub_total }}
                                                        </div>
                                                        <div class="col-md-2">
                                                            {{ item.status_name }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else-if="row.item.itemsLoading" class="text-center p-3">
                                                    <b-spinner small></b-spinner> {{ __('loading') }}...
                                                </div>
                                                <div v-else class="text-center text-muted p-2">
                                                    {{ __('no_products_found') }}
                                                </div>
                                            </b-card>
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

                    <div class="col-lg-6 col-md-12 col-sm-12">
                        <div class="card h-95">
                            <div class="card-header">
                                <h4 class="card-title me-1">{{ __('top_sellers') }}</h4>
                                <small>({{ __('month') }}: {{ currentMonth }})</small>
                            </div>
                            <div class="card-body">

                                <div class="table-responsive">
                                    <b-table :items="sellers" :fields="sellerFields" :current-page="currentPage"
                                        :per-page="perPage" :filter="sellerFilter" :filter-included-fields="filterOn"
                                        :sort-by.sync="sellerSortBy" :sort-desc.sync="sellerSortDesc"
                                        :sort-direction="sortDirection" :bordered="true" stacked="md" show-empty small>
                                        <template #head(total_revenue)="row">
                                            {{ __('total_revenue') + '(' + $currency + ')' }}
                                        </template>
                                        <template #cell(seller_name)="row">
                                            {{ getDisplayName(row.item.name) || row.item.seller_name || '' }}
                                        </template>
                                        <template #cell(store_name)="row">
                                            {{ getDisplayName(row.item.store_name) || '' }}
                                        </template>
                                        <template #cell(actions)="row">
                                            <router-link to="/sellers" v-b-tooltip.hover :title="__('view')"
                                                class="btn btn-primary btn-sm"><i class="fa fa-eye"></i>
                                            </router-link>
                                        </template>
                                    </b-table>
                                </div>
                                <b-row>
                                    <b-col md="2" class="my-1">
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">
                                            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                                size="sm" class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="4" class="my-1" offset-md="6">
                                        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                            align="fill" size="sm" class="my-0"></b-pagination>
                                    </b-col>
                                </b-row>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 col-md-12 col-sm-12">
                        <div class="card h-95">
                            <div class="card-header">
                                <h4 class="card-title me-1">{{ __('top_categories') }}</h4>
                                <small>({{ __('month') }}: {{ currentMonth }})</small>
                            </div>
                            <div class="card-body">

                                <div class="table-responsive">
                                    <b-table :items="categories" :fields="categoryFields"
                                        :current-page="categoryCurrentPage" :per-page="categoryPerPage"
                                        :filter="categoryFilter" :filter-included-fields="filterOn"
                                        :sort-by.sync="categorySortBy" :sort-desc.sync="categorySortDesc"
                                        :sort-direction="sortDirection" :bordered="true" stacked="md" show-empty small>
                                        <template #head(total_revenue)="row">
                                            {{ __('total_revenue') + ' (' + $currency + ')' }}
                                        </template>
                                        <template #cell(category_name)="row">
                                            {{ getDisplayName(row.item.category_name) || '' }}
                                        </template>
                                        <template #cell(product_name)="row">
                                            {{ getDisplayName(row.item.product_name) || '' }}
                                        </template>
                                        <template #cell(actions)="row">
                                            <router-link to="/manage_categories" v-b-tooltip.hover :title="__('view')"
                                                class="btn btn-primary btn-sm"><i class="fa fa-eye"></i>
                                            </router-link>
                                        </template>
                                    </b-table>
                                </div>
                                <b-row>
                                    <b-col md="2" class="my-1">
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">
                                            <b-form-select id="per-page-select" v-model="categoryPerPage"
                                                :options="pageOptions" size="sm"
                                                class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </b-col>
                                    <b-col md="4" class="my-1" offset-md="6">
                                        <b-pagination v-model="categoryCurrentPage" :total-rows="categoryTotalRows"
                                            :per-page="categoryPerPage" align="fill" size="sm"
                                            class="my-0"></b-pagination>
                                    </b-col>
                                </b-row>
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

            sellerFields: [
                { key: 'seller_id', label: __('seller_id'), sortable: false, sortDirection: 'desc' },
                { key: 'seller_name', label: __('sellers'), sortable: false, class: 'text-center' },
                { key: 'store_name', label: __('store_name'), sortable: false, class: 'text-center' },
                { key: 'total_revenue', label: __('total_revenue'), sortable: false, class: 'text-center' },
                { key: "actions", label: __('actions') }
            ],

            categoryFields: [
                { key: 'category_id', label: __('id'), sortable: false, sortDirection: 'desc' },
                { key: 'category_name', label: __('category'), sortable: false, class: 'text-center' },
                { key: 'product_name', label: __('product'), sortable: false, class: 'text-center' },
                { key: 'total_revenue', label: __('total_revenue'), sortable: false, class: 'text-center' },
                { key: "actions", label: __('actions') }
            ],

            orderFields: [
                { key: 'id', label: __('oid'), sortable: true, sortDirection: 'desc' },
                { key: 'user_name', label: __('user'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile'), sortable: true, class: 'text-center' },
                { key: 'seller_name', label: __('seller'), sortable: false, class: 'text-center' },
                { key: 'total', label: __('total') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'delivery_charge', label: __('dcharges') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'remaining_final', label: __('ftotal') + '(' + this.$currency + ')', sortable: true, class: 'text-center' },
                { key: 'payment_method', label: __('p_method'), sortable: true, class: 'text-center' },
                { key: 'delivery_time', label: __('d_time'), sortable: true, class: 'text-center' },
                { key: 'active_status', label: __('status'), sortable: true, class: 'text-center' },
                { key: "actions", label: __('actions') }
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
                    type: 'pie',
                    height: '200',
                },
                legend: {
                    show: true,
                    position: 'bottom',
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    markers: {
                        width: 8,
                        height: 8,
                        radius: 2
                    }
                },
                labels: [],
                responsive: [{
                    breakpoint: 9999,
                    options: {
                        chart: {
                            height: 450
                        }
                    }
                }]
            },
            series2: []
        };
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
</style>
