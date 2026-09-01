<template>
    <div class="dashboard-custom-wrapper">
        <div class="page-heading d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="mb-0 fw-bold">{{ __('welcome_admin') }}</h3>
                <p class="text-muted small mb-0">{{ currentDate }}</p>
            </div>
            <!-- Placeholder for filters like in image -->
            <div class="d-flex gap-2">
                 <!-- Filters can go here later -->
            </div>
        </div>

        <div class="page-content">
            <!-- Top 4 Metrics -->
            <div class="row g-3 mb-4">
                <div class="col-12 col-sm-6 col-xl-3">
                    <router-link :to="{ name: 'MasterProducts' }">
                        <div class="card custom-card h-100 top-metric-card">
                            <div class="card-body d-flex align-items-center">
                                <div class="icon-wrapper bg-soft-blue me-3">
                                    <i class="fa fa-cubes text-blue"></i>
                                </div>
                                <div>
                                    <p class="text-muted small mb-0 fw-semibold">{{ __('total_products') }}</p>
                                    <h3 class="fw-bold mb-0 text-dark">{{ record.product_count }}</h3>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="col-12 col-sm-6 col-xl-3">
                    <router-link to="/users">
                        <div class="card custom-card h-100 top-metric-card">
                            <div class="card-body d-flex align-items-center">
                                <div class="icon-wrapper bg-soft-green me-3">
                                    <i class="fa fa-users text-green"></i>
                                </div>
                                <div>
                                    <p class="text-muted small mb-0 fw-semibold">{{ __('total_customers') }}</p>
                                    <h3 class="fw-bold mb-0 text-dark">{{ record.customer_count }}</h3>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="col-12 col-sm-6 col-xl-3">
                    <router-link to="/sellers">
                        <div class="card custom-card h-100 top-metric-card">
                            <div class="card-body d-flex align-items-center">
                                <div class="icon-wrapper bg-soft-orange me-3">
                                    <i class="fa fa-store text-orange"></i>
                                </div>
                                <div>
                                    <p class="text-muted small mb-0 fw-semibold">{{ __('total_sellers') }}</p>
                                    <h3 class="fw-bold mb-0 text-dark">{{ record.seller_count }}</h3>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="col-12 col-sm-6 col-xl-3">
                    <router-link to="/manage_categories">
                        <div class="card custom-card h-100 top-metric-card">
                            <div class="card-body d-flex align-items-center">
                                <div class="icon-wrapper bg-soft-red me-3">
                                    <i class="fa fa-bullseye text-red"></i>
                                </div>
                                <div>
                                    <p class="text-muted small mb-0 fw-semibold">{{ __('total_categories') }}</p>
                                    <h3 class="fw-bold mb-0 text-dark">{{ record.category_count }}</h3>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

            <div class="row g-3 mb-4">
                <!-- Left Column for Chart & Small Cards -->
                <div class="col-xl-8 col-lg-12">
                    <!-- Product Category Chart (Using Doughnut to match design style) -->
                    <div class="card custom-card mb-4 chart-card">
                        <div class="card-header bg-white border-0 pt-4 pb-0">
                            <h5 class="card-title fw-bold">{{ __('product_category_count') }}</h5>
                            <p class="text-muted small">Distribution across active categories</p>
                        </div>
                        <div class="card-body">
                            <div v-if="series2 && series2.length">
                                <apexcharts width="100%" height="300" type="donut" :options="options2" :series="series2"></apexcharts>
                            </div>
                            <div v-else class="text-center text-muted py-5">
                                {{ __('no_product_found') }}
                            </div>
                        </div>
                    </div>

                    <!-- Small Summary Cards Grid -->
                    <div class="row g-3">
                        <div class="col-md-4 col-sm-6">
                            <div class="card custom-card summary-card">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="icon-sm bg-soft-purple rounded text-purple"><i class="fa fa-tag"></i></div>
                                        <span class="badge bg-soft-success text-success rounded-pill">+100%</span>
                                    </div>
                                    <p class="text-muted small mb-1 fw-bold text-uppercase">{{ __('brands') }}</p>
                                    <h4 class="fw-bold mb-0">{{ record.brand_count }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-6">
                            <div class="card custom-card summary-card">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="icon-sm bg-soft-info rounded text-info"><i class="fa fa-map-marker-alt"></i></div>
                                        <span class="badge bg-soft-success text-success rounded-pill">+100%</span>
                                    </div>
                                    <p class="text-muted small mb-1 fw-bold text-uppercase">{{ __('city') }}</p>
                                    <h4 class="fw-bold mb-0">{{ record.city_count }}</h4>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-6">
                            <div class="card custom-card summary-card">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="icon-sm bg-soft-warning rounded text-warning"><i class="fa fa-exclamation-triangle"></i></div>
                                    </div>
                                    <p class="text-muted small mb-1 fw-bold text-uppercase">{{ __('low_stock') }}</p>
                                    <h4 class="fw-bold mb-0">{{ record.low_stock_count }}</h4>
                                </div>
                            </div>
                        </div>
                         <div class="col-md-4 col-sm-6">
                            <div class="card custom-card summary-card">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-start mb-2">
                                        <div class="icon-sm bg-soft-danger rounded text-danger"><i class="fa fa-times-circle"></i></div>
                                    </div>
                                    <p class="text-muted small mb-1 fw-bold text-uppercase">{{ __('sold_out') }}</p>
                                    <h4 class="fw-bold mb-0">{{ record.sold_out_count }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column for Lists (Order Status Placeholder for now since it's hidden in admin, or we can use it for something else) -->
                <!-- Since Order Status is hidden for admin, let's put Highest Revenue Stores here to match the vertical list style -->
                <div class="col-xl-4 col-lg-12">
                    <div class="card custom-card h-100 list-card">
                        <div class="card-header bg-white border-0 pt-4 pb-2">
                            <h5 class="card-title fw-bold mb-0">{{ __('highest_revenue_stores') }}</h5>
                            <p class="text-muted small">{{ __('month') }}: {{ currentMonth }}</p>
                        </div>
                        <div class="card-body p-0">
                             <ul class="list-group list-group-flush custom-list">
                                <li v-for="(seller, index) in sellers.slice(0, 8)" :key="index" class="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-0">
                                    <div class="d-flex align-items-center">
                                        <span class="rank-badge me-3">{{ index + 1 }}</span>
                                        <div class="store-icon me-3 bg-soft-success text-success">
                                            <i class="fa fa-store"></i>
                                        </div>
                                        <div>
                                            <h6 class="mb-0 fw-bold">{{ getDisplayName(seller.name) || seller.seller_name }}</h6>
                                            <small class="text-muted">{{ getDisplayName(seller.store_name) }}</small>
                                        </div>
                                    </div>
                                    <div class="text-end">
                                        <span class="fw-bold">{{ $currency }}{{ seller.total_revenue }}</span>
                                    </div>
                                </li>
                            </ul>
                            <div v-if="!sellers || sellers.length === 0" class="text-center p-4 text-muted">
                                {{ __('no_data_found') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom Row for Top Categories (Styled as a list/table to match design) -->
            <div class="row g-3">
                <div class="col-12">
                    <div class="card custom-card list-card">
                         <div class="card-header bg-white border-0 pt-4 pb-2">
                            <h5 class="card-title fw-bold mb-0">{{ __('top_categories_revenue') }}</h5>
                            <p class="text-muted small">{{ __('month') }}: {{ currentMonth }}</p>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-borderless custom-table align-middle mb-0">
                                    <thead class="text-muted small text-uppercase bg-light">
                                        <tr>
                                            <th class="ps-4 rounded-start">Rank</th>
                                            <th>{{ __('category') }}</th>
                                            <th>{{ __('product') }}</th>
                                            <th class="text-end pe-4 rounded-end">{{ __('total_revenue') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(cat, index) in categories.slice(0, 10)" :key="index">
                                            <td class="ps-4"><span class="rank-badge-light">{{ index + 1 }}</span></td>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                     <div class="cat-icon me-2 bg-soft-primary text-primary"><i class="fa fa-folder"></i></div>
                                                     <span class="fw-bold">{{ getDisplayName(cat.category_name) }}</span>
                                                </div>
                                            </td>
                                            <td>{{ getDisplayName(cat.product_name) }}</td>
                                            <td class="text-end pe-4 fw-bold">{{ $currency }}{{ cat.total_revenue }}</td>
                                        </tr>
                                        <tr v-if="!categories || categories.length === 0">
                                            <td colspan="4" class="text-center py-4 text-muted">{{ __('no_data_found') }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
