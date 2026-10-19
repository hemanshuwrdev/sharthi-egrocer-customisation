<template>
    <div class="distributor-dashboard">
        <!-- Stock update reminder banner -->
        <div class="row" v-if="showStockWarning">
            <div class="col-12 mb-3">
                <div class="alert alert-warning d-flex align-items-center justify-content-between mb-0 py-2 px-3 shadow-sm rounded-3" style="border-left: 4px solid #f59e0b; background-color: #fffbeb; color: #78350f;">
                    <div class="d-flex align-items-center gap-2" style="cursor: pointer;" @click="goToStockManagement">
                        <i class="fa fa-exclamation-triangle text-warning me-2 fs-5"></i>
                        <span><strong>{{ __('stock_update_reminder') }}</strong> — {{ __('click_here_to_update_stock') }}</span>
                        <i class="fa fa-arrow-right ms-2 text-warning"></i>
                    </div>
                    <button type="button" class="btn-close ms-3" @click.stop="dismissStockWarning" aria-label="Dismiss"></button>
                </div>
            </div>
        </div>

        <!-- Top Header & Date Filter Toolbar -->
        <!-- Top Header & Date Filter Toolbar -->
        <div class="dashboard-header-bar mb-3">
            <div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
                <div class="header-greeting">
                    <h2 class="greeting-title mb-1">
                        {{ greetingText }}, {{ distributorInfo.user_name || 'Partner' }} <span class="wave-emoji">👋</span>
                    </h2>
                    <p class="greeting-subtitle mb-0">
                        {{ __('Here\'s your business overview for') }} <span class="greeting-period">{{ periodFormatted }}</span>
                    </p>
                </div>

                <!-- Date Range Filter & Quick Presets Unified Toolbar -->
                <div class="header-controls d-flex flex-wrap align-items-center gap-2">
                    <div class="toolbar-pill-group d-none d-md-inline-flex">
                        <button type="button" class="preset-pill-btn" :class="{ 'active': activePreset === 'today' }" @click="setPresetRange('today')">
                            {{ __('today') }}
                        </button>
                        <button type="button" class="preset-pill-btn" :class="{ 'active': activePreset === 'last7' }" @click="setPresetRange('last7')">
                            {{ __('Last 7 Days') }}
                        </button>
                        <button type="button" class="preset-pill-btn" :class="{ 'active': activePreset === 'last30' }" @click="setPresetRange('last30')">
                            {{ __('Last 30 Days') }}
                        </button>
                        <button type="button" class="preset-pill-btn" :class="{ 'active': activePreset === 'this_month' }" @click="setPresetRange('this_month')">
                            {{ __('this_month') }}
                        </button>
                    </div>

                    <div class="date-picker-wrap">
                        <date-range-picker
                            :append-to-body="true"
                            :autoApply="false"
                            :showDropdowns="true"
                            v-model="dateRange"
                            :maxDate="maxDate"
                            @update="onDateRangeApplied"
                            :locale-data="dateRangePickerLocale"
                            :ranges="dateRangePickerRanges">
                        </date-range-picker>
                    </div>

                    <button class="btn btn-refresh-toolbar" :title="__('refresh')" @click="fetchDashboardData" :disabled="isLoading">
                        <i class="fa fa-refresh" :class="{ 'fa-spin': isLoading }"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Row 1: 4 Primary KPI Hero Cards (Exact Client Reference Layout) -->
        <div class="row g-3 mb-3">
            <!-- Total Sales -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card">
                    <div class="kpi-card-body">
                        <div class="kpi-header-row">
                            <div class="kpi-meta-group">
                                <div class="kpi-icon-tile icon-blue">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                                    </svg>
                                </div>
                                <div class="kpi-text-block">
                                    <div class="kpi-label">{{ __('Total Sales') }}</div>
                                    <div class="kpi-value">{{ formatCurrency(animatedStats.sales) }}</div>
                                    <div class="kpi-subtext">{{ __('vs last period') }} ({{ formatCurrency(heroKpis.sales.previous) }})</div>
                                </div>
                            </div>
                            <div class="kpi-growth-pill" :class="heroKpis.sales.growth >= 0 ? 'pill-green' : 'pill-red'">
                                <span>{{ heroKpis.sales.growth >= 0 ? '↑' : '↓' }} {{ Math.abs(heroKpis.sales.growth) }}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="kpi-sparkline-wrap">
                        <apexcharts type="area" height="32" width="100%" :options="sparkSalesOptions" :series="sparkSalesSeries"></apexcharts>
                    </div>
                </div>
            </div>

            <!-- Total Invoices -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card">
                    <div class="kpi-card-body">
                        <div class="kpi-header-row">
                            <div class="kpi-meta-group">
                                <div class="kpi-icon-tile icon-green">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                </div>
                                <div class="kpi-text-block">
                                    <div class="kpi-label">{{ __('Total Invoices') }}</div>
                                    <div class="kpi-value">{{ formatNumber(Math.round(animatedStats.invoices)) }}</div>
                                    <div class="kpi-subtext">{{ __('vs last period') }} ({{ formatNumber(heroKpis.invoices.previous) }})</div>
                                </div>
                            </div>
                            <div class="kpi-growth-pill" :class="heroKpis.invoices.growth >= 0 ? 'pill-green' : 'pill-red'">
                                <span>{{ heroKpis.invoices.growth >= 0 ? '↑' : '↓' }} {{ Math.abs(heroKpis.invoices.growth) }}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="kpi-sparkline-wrap">
                        <apexcharts type="area" height="32" width="100%" :options="sparkInvoicesOptions" :series="sparkInvoicesSeries"></apexcharts>
                    </div>
                </div>
            </div>

            <!-- Collections -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card">
                    <div class="kpi-card-body">
                        <div class="kpi-header-row">
                            <div class="kpi-meta-group">
                                <div class="kpi-icon-tile icon-amber">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                                        <line x1="12" y1="6" x2="12" y2="8"></line>
                                        <line x1="12" y1="16" x2="12" y2="18"></line>
                                    </svg>
                                </div>
                                <div class="kpi-text-block">
                                    <div class="kpi-label">{{ __('Collections') }}</div>
                                    <div class="kpi-value">{{ formatCurrency(animatedStats.collections) }}</div>
                                    <div class="kpi-subtext"><span class="fw-semibold text-slate-700">{{ heroKpis.collections.rate }}%</span> {{ __('collection rate') }}</div>
                                </div>
                            </div>
                            <div class="kpi-growth-pill" :class="heroKpis.collections.growth >= 0 ? 'pill-green' : 'pill-red'">
                                <span>{{ heroKpis.collections.growth >= 0 ? '↑' : '↓' }} {{ Math.abs(heroKpis.collections.growth) }}%</span>
                            </div>
                        </div>
                    </div>
                    <div class="kpi-sparkline-wrap">
                        <apexcharts type="area" height="32" width="100%" :options="sparkCollectionsOptions" :series="sparkCollectionsSeries"></apexcharts>
                    </div>
                </div>
            </div>

            <!-- Outstanding -->
            <div class="col-12 col-sm-6 col-xl-3">
                <div class="kpi-card">
                    <div class="kpi-card-body">
                        <div class="kpi-header-row">
                            <div class="kpi-meta-group">
                                <div class="kpi-icon-tile icon-red">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                    </svg>
                                </div>
                                <div class="kpi-text-block">
                                    <div class="kpi-label">{{ __('Outstanding') }}</div>
                                    <div class="kpi-value">{{ formatCurrency(animatedStats.outstanding) }}</div>
                                    <div class="kpi-subtext">{{ __('Across') }} {{ heroKpis.outstanding.retailers_count }} {{ __('retailers') }}</div>
                                </div>
                            </div>
                            <div class="kpi-growth-pill pill-red">
                                <span>{{ heroKpis.outstanding.retailers_count ? heroKpis.outstanding.retailers_count + ' ' + __('retailers') : 'Active' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="kpi-sparkline-wrap">
                        <apexcharts type="area" height="32" width="100%" :options="sparkOutstandingOptions" :series="sparkOutstandingSeries"></apexcharts>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 2: 6 Operational Stat Cards (Exact Client Reference Grid) -->
        <div class="ops-grid mb-3">
            <!-- Active Retailers -->
            <router-link to="/seller/orders" class="ops-card ops-card--blue" tag="div">
                <div class="ops-icon-tile icon-blue">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                        <path d="M2 7h20"></path>
                        <path d="M22 7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2"></path>
                    </svg>
                </div>
                <div class="ops-text-content">
                    <div class="ops-label">{{ __('Active Retailers') }}</div>
                    <div class="ops-value">{{ Math.round(animatedStats.active_retailers) }}</div>
                    <div class="ops-sub text-success">{{ operationalStats.active_retailers.sub }}</div>
                </div>
                <div class="ops-arrow-icon">›</div>
            </router-link>

            <!-- Active Salesman -->
            <router-link to="/seller/salesman" class="ops-card ops-card--purple" tag="div">
                <div class="ops-icon-tile icon-purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </div>
                <div class="ops-text-content">
                    <div class="ops-label">{{ __('Active Salesman') }}</div>
                    <div class="ops-value">{{ Math.round(animatedStats.active_salesmen) }}</div>
                    <div class="ops-sub" :class="operationalStats.active_salesmen.sub && operationalStats.active_salesmen.sub.includes('inactive') ? 'text-danger' : 'text-success'">
                        {{ operationalStats.active_salesmen.sub }}
                    </div>
                </div>
                <div class="ops-arrow-icon">›</div>
            </router-link>

            <!-- Active Drivers -->
            <router-link to="/seller/delivery_boys" class="ops-card ops-card--green" tag="div">
                <div class="ops-icon-tile icon-green">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                </div>
                <div class="ops-text-content">
                    <div class="ops-label">{{ __('Active Drivers') }}</div>
                    <div class="ops-value">{{ Math.round(animatedStats.active_drivers) }}</div>
                    <div class="ops-sub text-success">{{ operationalStats.active_drivers.sub }}</div>
                </div>
                <div class="ops-arrow-icon">›</div>
            </router-link>

            <!-- Products -->
            <router-link to="/seller/manage_stock" class="ops-card ops-card--indigo" tag="div">
                <div class="ops-icon-tile icon-indigo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </div>
                <div class="ops-text-content">
                    <div class="ops-label">{{ __('Products') }}</div>
                    <div class="ops-value">{{ formatNumber(Math.round(animatedStats.products)) }}</div>
                    <div class="ops-sub text-danger">{{ operationalStats.products.sub }}</div>
                </div>
                <div class="ops-arrow-icon">›</div>
            </router-link>

            <!-- Schemes Running -->
            <router-link to="/seller/schemes" class="ops-card ops-card--amber" tag="div">
                <div class="ops-icon-tile icon-amber">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                </div>
                <div class="ops-text-content">
                    <div class="ops-label">{{ __('Schemes Running') }}</div>
                    <div class="ops-value">{{ Math.round(animatedStats.schemes) }}</div>
                    <div class="ops-sub" :class="operationalStats.schemes.sub && operationalStats.schemes.sub.includes('ending') ? 'text-warning' : 'text-success'">
                        {{ operationalStats.schemes.sub }}
                    </div>
                </div>
                <div class="ops-arrow-icon">›</div>
            </router-link>

            <!-- Pending Deliveries -->
            <router-link to="/seller/orders" class="ops-card ops-card--red" tag="div">
                <div class="ops-icon-tile icon-red">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>
                <div class="ops-text-content">
                    <div class="ops-label">{{ __('Pending Deliveries') }}</div>
                    <div class="ops-value">{{ Math.round(animatedStats.pending_deliveries) }}</div>
                    <div class="ops-sub text-danger">{{ formatCurrency(animatedStats.pending_deliveries_value) }} value</div>
                </div>
                <div class="ops-arrow-icon">›</div>
            </router-link>
        </div>

        <!-- Row 3: Sales Trend Combo Chart + Category Donut + Top Products -->
        <div class="row g-3 mb-3 dashboard-row-3">
            <!-- Sales Trend (Dual-Axis Column + Line) -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3 d-flex flex-column">
                    <div class="d-flex flex-wrap align-items-center justify-content-between mb-2 gap-2">
                        <h5 class="card-title fw-bold text-dark mb-0">{{ __('Sales Trend') }}</h5>
                        <div class="d-flex align-items-center gap-2">
                            <span class="legend-dot-item small text-muted"><span class="dot" style="background-color: #2563eb;"></span> {{ __('Sales') }} (₹)</span>
                            <span class="legend-dot-item small text-muted"><span class="dot" style="background-color: #10b981;"></span> {{ __('Invoices') }}</span>
                        </div>
                    </div>
                    <div class="chart-wrapper flex-grow-1" style="min-height: 0;">
                        <apexcharts type="line" height="235" width="100%" :options="trendChartOptions" :series="trendChartSeries"></apexcharts>
                    </div>
                </div>
            </div>

            <!-- Sales by Category (Donut Chart with Side-by-Side Legend) -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3 d-flex flex-column">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h5 class="card-title fw-bold text-dark mb-0">{{ __('Sales by Category') }}</h5>
                        <div class="segmented-pills">
                            <button type="button" class="seg-btn" :class="{ 'active': categoryMetricMode === 'amount' }" @click="categoryMetricMode = 'amount'">
                                {{ __('Amount') }}
                            </button>
                            <button type="button" class="seg-btn" :class="{ 'active': categoryMetricMode === 'units' }" @click="categoryMetricMode = 'units'">
                                {{ __('Units') }}
                            </button>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-between flex-grow-1 gap-2 my-auto" style="min-height: 0;">
                        <div class="donut-chart-container flex-shrink-0" style="width: 170px; min-width: 160px; height: 215px;">
                            <apexcharts type="donut" width="100%" height="215" :options="categoryChartOptions" :series="categoryChartSeries"></apexcharts>
                        </div>
                        <div class="category-legend-list flex-grow-1 min-w-0 ps-2">
                            <div class="cat-legend-row d-flex align-items-center justify-content-between py-2 border-bottom" v-for="(item, idx) in categoryBreakdownList" :key="idx">
                                <div class="d-flex align-items-center gap-2 text-truncate pe-2">
                                    <span class="cat-color-dot" :style="{ backgroundColor: getCategoryColor(idx) }"></span>
                                    <span class="cat-name small text-dark text-truncate" :title="item.name" style="font-size: 12px; font-weight: 500;">{{ item.name }}</span>
                                </div>
                                <span class="cat-percent small fw-bold text-dark ps-1 tabular-nums" style="font-size: 11.5px;">{{ item.percent }}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Top 5 Products -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3 d-flex flex-column">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h5 class="card-title fw-bold text-dark mb-0">{{ __('Top 5 Products') }}</h5>
                        <router-link to="/seller/manage_products" class="view-all-link small text-primary fw-medium">
                            {{ __('View All') }} <i class="fa fa-angle-right ms-1"></i>
                        </router-link>
                    </div>
                    <div class="table-responsive top-table-container flex-grow-1" style="min-height: 0;">
                        <table class="table table-sm table-borderless align-middle mb-0 top-products-table">
                            <thead>
                                <tr class="text-muted small border-bottom">
                                    <th style="width: 26px; padding: 6px 4px;">#</th>
                                    <th style="padding: 6px 6px;">{{ __('Product') }}</th>
                                    <th class="text-end text-nowrap" style="width: 80px; padding: 6px 6px;">{{ __('Sales') }} (₹)</th>
                                    <th class="text-end text-nowrap" style="width: 55px; padding: 6px 4px;">{{ __('Units') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(prod, idx) in topProducts" :key="idx" class="product-item-row">
                                    <td class="text-center" style="padding: 6px 4px;">
                                        <span class="rank-badge" :class="idx === 0 ? 'rank-1' : (idx === 1 ? 'rank-2' : (idx === 2 ? 'rank-3' : 'rank-other'))">
                                            {{ idx + 1 }}
                                        </span>
                                    </td>
                                    <td style="padding: 6px 6px; text-align: left !important;">
                                        <div class="entity-cell-group text-truncate">
                                            <div class="product-thumb-sq flex-shrink-0">
                                                <img v-if="prod.image_url" :src="prod.image_url" :alt="prod.name" @error="onProductImgError($event)" />
                                                <i class="fa fa-cube text-muted prod-fallback-icon" :style="{ display: prod.image_url ? 'none' : 'inline-block' }"></i>
                                            </div>
                                            <div class="product-info-text text-truncate" style="text-align: left !important;">
                                                <span class="d-block text-dark fw-semibold small text-truncate product-title-text" style="text-align: left !important;" :title="prod.name">{{ prod.name }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-end fw-bold text-dark small text-nowrap tabular-nums" style="padding: 6px 6px;">{{ formatCurrency(prod.sales_amount) }}</td>
                                    <td class="text-end text-nowrap" style="padding: 6px 4px;">
                                        <span class="unit-pill">{{ formatNumber(prod.units_sold) }}</span>
                                    </td>
                                </tr>
                                <tr v-if="topProducts.length === 0">
                                    <td colspan="4" class="text-center text-muted small py-4">{{ __('No sales data recorded yet') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 4: Team Performance (Salesman, Driver, Retailer Activity) -->
        <div class="row g-3 mb-3 dashboard-row-4">
            <!-- Sales by Salesman -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="card-title fw-bold text-dark mb-0">{{ __('Sales by Salesman') }}</h5>
                        <router-link to="/seller/salesman" class="view-all-link small text-primary fw-medium">
                            {{ __('View All') }} <i class="fa fa-angle-right ms-1"></i>
                        </router-link>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-borderless align-middle mb-0">
                            <thead>
                                <tr class="text-muted small border-bottom">
                                    <th style="width: 20px;">#</th>
                                    <th>{{ __('Salesman') }}</th>
                                    <th class="text-end">{{ __('Sales') }} (₹)</th>
                                    <th class="text-center">{{ __('Retailers') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(sm, idx) in salesBySalesman" :key="idx" class="border-bottom-subtle">
                                    <td class="text-muted small fw-medium" style="width: 20px;">{{ idx + 1 }}</td>
                                    <td style="text-align: left !important;">
                                        <div class="entity-cell-group">
                                            <div class="avatar-circle-sm bg-purple-subtle text-purple fw-bold flex-shrink-0">
                                                {{ getInitials(sm.name) }}
                                            </div>
                                            <div class="entity-info-block">
                                                <div class="entity-name" style="max-width: 105px;" :title="sm.name">{{ sm.name }}</div>
                                                <div class="entity-sub">Total Invoices: {{ sm.invoices }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-end fw-semibold text-dark small tabular-nums">{{ formatCurrency(sm.sales) }}</td>
                                    <td class="text-center text-muted small tabular-nums">{{ sm.retailers }}</td>
                                </tr>
                                <tr v-if="salesBySalesman.length === 0">
                                    <td colspan="4" class="text-center text-muted small py-4">{{ __('No salesman orders recorded') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Sales by Driver -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="card-title fw-bold text-dark mb-0">{{ __('Sales by Driver') }}</h5>
                        <router-link to="/seller/delivery_boys" class="view-all-link small text-primary fw-medium">
                            {{ __('View All') }} <i class="fa fa-angle-right ms-1"></i>
                        </router-link>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-borderless align-middle mb-0">
                            <thead>
                                <tr class="text-muted small border-bottom">
                                    <th style="width: 20px;">#</th>
                                    <th>{{ __('Driver') }}</th>
                                    <th class="text-end">{{ __('Amount') }} (₹)</th>
                                    <th class="text-end">{{ __('Collections') }}</th>
                                    <th class="text-end">{{ __('Pending') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(dp, idx) in salesByDriver" :key="idx" class="border-bottom-subtle">
                                    <td class="text-muted small fw-medium" style="width: 20px;">{{ idx + 1 }}</td>
                                    <td style="text-align: left !important;">
                                        <div class="entity-cell-group">
                                            <div class="avatar-circle-sm bg-green-subtle text-success fw-bold flex-shrink-0">
                                                {{ getInitials(dp.name) }}
                                            </div>
                                            <div class="entity-info-block">
                                                <div class="entity-name" style="max-width: 95px;" :title="dp.name">{{ dp.name }}</div>
                                                <div class="entity-sub">Total Deliveries: {{ dp.deliveries }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-end text-dark fw-medium small tabular-nums">{{ formatCurrency(dp.amount) }}</td>
                                    <td class="text-end text-success fw-semibold small tabular-nums">{{ formatCurrency(dp.collections) }}</td>
                                    <td class="text-end text-danger fw-semibold small tabular-nums">{{ formatCurrency(dp.pending) }}</td>
                                </tr>
                                <tr v-if="salesByDriver.length === 0">
                                    <td colspan="5" class="text-center text-muted small py-4">{{ __('No driver deliveries recorded') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Retailer Activity -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="card-title fw-bold text-dark mb-0">{{ __('Retailer Activity') }}</h5>
                        <router-link to="/seller/orders" class="view-all-link small text-primary fw-medium">
                            {{ __('View All') }} <i class="fa fa-angle-right ms-1"></i>
                        </router-link>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-borderless align-middle mb-0">
                            <thead>
                                <tr class="text-muted small border-bottom">
                                    <th style="width: 20px;">#</th>
                                    <th>{{ __('Retailer') }}</th>
                                    <th class="text-end">{{ __('Sales') }} (₹)</th>
                                    <th class="text-end">{{ __('Status') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(ra, idx) in retailerActivity" :key="idx" class="border-bottom-subtle">
                                    <td class="text-muted small fw-medium" style="width: 20px;">{{ idx + 1 }}</td>
                                    <td style="text-align: left !important;">
                                        <div class="entity-cell-group">
                                            <div class="avatar-circle-sm bg-blue-subtle text-primary flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                                </svg>
                                            </div>
                                            <div class="entity-info-block">
                                                <div class="entity-name" style="max-width: 120px;" :title="ra.shop_name">{{ ra.shop_name }}</div>
                                                <div class="entity-sub">Last Order: {{ ra.last_order }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-end fw-semibold text-dark small tabular-nums">{{ formatCurrency(ra.sales) }}</td>
                                    <td class="text-end">
                                        <span class="status-pill-badge" :class="ra.status === 'Active' ? 'pill-active' : 'pill-inactive'">
                                            {{ ra.status }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="retailerActivity.length === 0">
                                    <td colspan="4" class="text-center text-muted small py-4">{{ __('No retailer activity found') }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 5: Outstanding by Retailer, Low Stock & AI Insights -->
        <div class="row g-3 mb-3 dashboard-row-5">
            <!-- Outstanding by Retailer (Aging) -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="card-title fw-bold text-dark mb-0">{{ __('Outstanding by Retailer') }}</h5>
                        <router-link to="/seller/receipt_cash_export" class="view-all-link small text-primary fw-medium">
                            {{ __('View All') }} <i class="fa fa-angle-right ms-1"></i>
                        </router-link>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-borderless align-middle mb-0">
                            <thead>
                                <tr class="text-muted small border-bottom">
                                    <th style="width: 20px;">#</th>
                                    <th>{{ __('Retailer') }}</th>
                                    <th class="text-end">{{ __('Outstanding') }} (₹)</th>
                                    <th class="text-end">{{ __('Days') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(ag, idx) in outstandingByRetailer" :key="idx" class="border-bottom-subtle">
                                    <td class="text-muted small fw-medium" style="width: 20px;">{{ idx + 1 }}</td>
                                    <td style="text-align: left !important;">
                                        <div class="entity-info-block">
                                            <div class="entity-name" style="max-width: 130px;" :title="ag.shop_name">
                                                {{ ag.shop_name }}
                                            </div>
                                            <div class="entity-sub">Total Invoices: {{ ag.invoices }}</div>
                                        </div>
                                    </td>
                                    <td class="text-end fw-semibold text-dark small tabular-nums">{{ formatCurrency(ag.outstanding) }}</td>
                                    <td class="text-end">
                                        <span class="fw-bold" :class="ag.days > 20 ? 'text-danger' : (ag.days > 10 ? 'text-warning' : 'text-muted')">
                                            {{ ag.days }}
                                        </span>
                                    </td>
                                </tr>
                                <tr v-if="outstandingByRetailer.length === 0">
                                    <td colspan="4" class="text-center text-success small py-4">
                                        <i class="fa fa-check-circle me-1"></i> {{ __('No pending retailer outstanding') }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Low Stock Products -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <h5 class="card-title fw-bold text-dark mb-0">{{ __('Low Stock Products') }}</h5>
                        <router-link to="/seller/manage_stock" class="view-all-link small text-primary fw-medium">
                            {{ __('View All') }} <i class="fa fa-angle-right ms-1"></i>
                        </router-link>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-borderless align-middle mb-0">
                            <thead>
                                <tr class="text-muted small border-bottom">
                                    <th style="width: 20px;">#</th>
                                    <th>{{ __('Product') }}</th>
                                    <th class="text-end">{{ __('Current Stock') }}</th>
                                    <th class="text-end">{{ __('Reorder Level') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(lsp, idx) in lowStockProducts" :key="idx" class="border-bottom-subtle">
                                    <td class="text-muted small fw-medium">{{ idx + 1 }}</td>
                                    <td class="text-dark fw-medium small text-truncate" style="max-width: 160px;" :title="lsp.product_name">
                                        {{ lsp.product_name }}
                                    </td>
                                    <td class="text-end text-danger fw-bold small">{{ lsp.current_stock }}</td>
                                    <td class="text-end text-warning fw-semibold small">{{ lsp.reorder_level }}</td>
                                </tr>
                                <tr v-if="lowStockProducts.length === 0">
                                    <td colspan="4" class="text-center text-success small py-4">
                                        <i class="fa fa-check-circle me-1"></i> {{ __('All products have healthy stock levels') }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- AI Insights & Recommendations -->
            <div class="col-12 col-xl-4">
                <div class="card h-100 border-0 shadow-sm p-3 ai-card-wrapper">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <span class="ai-sparkle-icon">✦</span>
                            <h5 class="card-title fw-bold text-dark mb-0">{{ __('AI Insights & Recommendations') }}</h5>
                        </div>
                    </div>

                    <div class="ai-cards-stack d-flex flex-column gap-2 text-start">
                        <div class="ai-row d-flex align-items-center justify-content-between gap-2 py-1 text-start" v-for="(ins, idx) in aiInsights" :key="idx">
                            <div class="ai-content-wrap d-flex align-items-center gap-2 min-w-0 flex-grow-1 text-start pe-1">
                                <div class="ai-circle-icon flex-shrink-0" :class="'ai-icon-' + ins.type">
                                    <span v-if="ins.type === 'success'">↑</span>
                                    <span v-else-if="ins.type === 'warning'">!</span>
                                    <span v-else-if="ins.type === 'info'">💡</span>
                                    <span v-else>★</span>
                                </div>
                                <div class="ai-text-block min-w-0 flex-grow-1 text-start">
                                    <div class="ai-title fw-bold text-dark text-truncate text-start" :title="ins.title">{{ ins.title }}</div>
                                    <div class="ai-sub text-muted text-truncate text-start" :title="ins.desc">{{ ins.desc }}</div>
                                </div>
                            </div>
                            <div class="ai-action flex-shrink-0" v-if="ins.action_label && ins.action_link">
                                <router-link :to="ins.action_link" class="btn btn-xs btn-white border rounded-2 py-1 px-2 fw-medium text-dark action-btn">
                                    {{ ins.action_label }}
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Row 6: Collapsible Order Pipeline & Recent Orders -->
        <div class="row">
            <div class="col-12">
                <div class="card border-0 shadow-sm list-surface">
                    <div class="card-header bg-transparent d-flex align-items-center justify-content-between py-3 border-bottom">
                        <div class="d-flex align-items-center gap-2">
                            <i class="fa fa-list-alt text-primary fs-5"></i>
                            <h5 class="card-title fw-bold text-dark mb-0">{{ __('Order Fulfillment & Recent Orders') }}</h5>
                        </div>
                        <button class="btn btn-sm btn-outline-secondary" @click="showRecentOrdersSection = !showRecentOrdersSection">
                            <i class="fa" :class="showRecentOrdersSection ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                            {{ showRecentOrdersSection ? __('Collapse') : __('Expand') }}
                        </button>
                    </div>

                    <div class="card-body p-3" v-show="showRecentOrdersSection">
                        <!-- Order Pipeline Strip -->
                        <div class="order-pipeline-strip mb-4">
                            <h6 class="text-muted small fw-semibold text-uppercase mb-2">{{ __('Order Status Breakdown') }}</h6>
                            <div class="row g-2">
                                <div class="col-6 col-md-4 col-lg-2" v-for="status in record.status_order_count" :key="status.id || status.status">
                                    <div class="pipeline-pill-card p-2 rounded-3 border d-flex align-items-center justify-content-between">
                                        <div class="text-truncate me-2">
                                            <span class="d-block text-muted small text-truncate" :title="getStatusDisplayName(status)">{{ getStatusDisplayName(status) }}</span>
                                        </div>
                                        <span class="badge bg-light text-dark border fw-bold">{{ status.order_count }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Orders Filter Bar -->
                        <div class="orders-table-toolbar mb-3">
                            <div class="row g-2 align-items-center">
                                <div class="col-12 col-md-4 col-lg-3">
                                    <select v-model="status" @change="getLatestOrders" class="form-control form-select form-select-sm">
                                        <option value="">{{ __('All Statuses') }}</option>
                                        <option v-for="st in statuses" :key="st.id" :value="st.id">{{ getStatusLabel(st) }}</option>
                                    </select>
                                </div>
                                <div class="col-12 col-md-5 col-lg-4">
                                    <b-form-input v-model="filter" type="search" size="sm" :placeholder="__('Search order ID, mobile, retailer...')"></b-form-input>
                                </div>
                                <div class="col-12 col-md-3 col-lg-2 ms-auto text-end">
                                    <button class="btn btn-sm btn-outline-primary" @click="getLatestOrders">
                                        <i class="fa fa-refresh me-1"></i> {{ __('Refresh Orders') }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Table -->
                        <div class="table-responsive">
                            <b-table
                                :items="orders"
                                :fields="orderFields"
                                :current-page="orderCurrentPage"
                                :per-page="orderPerPage"
                                :filter="filter"
                                :busy="isLoading"
                                small
                                responsive
                                class="align-middle mb-0">
                                <template #table-busy>
                                    <div class="text-center text-muted my-3">
                                        <b-spinner small class="align-middle me-2"></b-spinner>
                                        <strong>{{ __('Loading orders...') }}</strong>
                                    </div>
                                </template>
                                <template #cell(remaining_final)="row">
                                    <span class="fw-semibold text-dark">{{ formatCurrency(row.item.remaining_final || row.item.total) }}</span>
                                </template>
                                <template #cell(order_status)="row">
                                    <span class="badge rounded-pill px-2 py-1" :class="getOrderStatusBadgeClass(row.item.active_status || row.item.order_status)">
                                        {{ getStatusNameById(row.item.active_status || row.item.order_status) }}
                                    </span>
                                </template>
                                <template #cell(actions)="row">
                                    <router-link :to="{ name: 'SellerViewOrder', params: { id: row.item.id, record: row.item } }" class="btn btn-xs btn-primary py-1 px-2" :title="__('View Details')">
                                        <i class="fa fa-eye"></i>
                                    </router-link>
                                </template>
                            </b-table>
                        </div>

                        <!-- Pagination -->
                        <div class="d-flex align-items-center justify-content-between mt-3 pt-2 border-top">
                            <div class="small text-muted">
                                {{ __('Showing') }} {{ (orderCurrentPage - 1) * orderPerPage + 1 }} - {{ Math.min(orderCurrentPage * orderPerPage, orderTotalRows) }} {{ __('of') }} {{ orderTotalRows }}
                            </div>
                            <b-pagination
                                v-model="orderCurrentPage"
                                :total-rows="orderTotalRows"
                                :per-page="orderPerPage"
                                size="sm"
                                class="mb-0"
                                align="right">
                            </b-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker'
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin'
import axios from "axios";
import moment from "moment";
import VueApexCharts from 'vue-apexcharts'

export default {
    name: 'SellerDashboard',
    mixins: [DateRangePickerMixin],
    components: {
        apexcharts: VueApexCharts,
        DateRangePicker
    },
    data() {
        // Default to rolling Last 30 Days
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return {
            dateRange: { startDate: start, endDate: end },
            maxDate: new Date(),
            activePreset: 'last30',
            isLoading: false,
            showRecentOrdersSection: false,
            distributorInfo: {
                user_name: '',
                store_name: '',
                logo_url: null
            },
            periodFormatted: moment(start).format('DD MMM') + ' – ' + moment(end).format('DD MMM YYYY'),
            heroKpis: {
                sales: { current: 0, previous: 0, growth: 0, sparkline: [] },
                invoices: { current: 0, previous: 0, growth: 0, sparkline: [] },
                collections: { current: 0, previous: 0, growth: 0, rate: 0, sparkline: [] },
                outstanding: { current: 0, retailers_count: 0, sparkline: [] },
            },
            operationalStats: {
                active_retailers: { count: 0, sub: '' },
                active_salesmen: { count: 0, sub: '' },
                active_drivers: { count: 0, sub: '' },
                products: { count: 0, sub: '' },
                schemes: { count: 0, sub: '' },
                pending_deliveries: { count: 0, value: 0 },
            },
            animatedStats: {
                sales: 0,
                invoices: 0,
                collections: 0,
                outstanding: 0,
                active_retailers: 0,
                active_salesmen: 0,
                active_drivers: 0,
                products: 0,
                schemes: 0,
                pending_deliveries: 0,
                pending_deliveries_value: 0
            },
            statsAnimFrameId: null,
            salesTrendData: {
                dates: [],
                sales: [],
                invoices: []
            },
            categoryMetricMode: 'amount',
            categoryRawData: {
                labels: [],
                series_sales: [],
                series_units: [],
                total_sales: 0
            },
            topProducts: [],
            salesBySalesman: [],
            salesByDriver: [],
            retailerActivity: [],
            outstandingByRetailer: [],
            lowStockProducts: [],
            aiInsights: [],
            record: {},
            statuses: [],
            orders: [],
            orderTotalRows: 0,
            orderCurrentPage: 1,
            orderPerPage: 10,
            status: "",
            filter: "",
            orderFields: [
                { key: 'id', label: __('oid'), sortable: true },
                { key: 'user_name', label: __('user'), sortable: true },
                { key: 'mobile', label: __('mobile'), sortable: true },
                { key: 'remaining_final', label: __('total'), sortable: true },
                { key: 'payment_method', label: __('p_method'), sortable: true },
                { key: 'order_status', label: __('status'), sortable: true },
                { key: 'actions', label: __('actions'), class: 'text-end' }
            ],
            showStockWarning: false,
            midnightTimer: null
        };
    },
    computed: {
        greetingText() {
            const hr = new Date().getHours();
            if (hr < 12) return this.__('Good Morning');
            if (hr < 17) return this.__('Good Afternoon');
            return this.__('Good Evening');
        },
        sparkSalesOptions() {
            return this.buildSparklineOptions('#2563eb', 'currency');
        },
        sparkSalesSeries() {
            return [{ name: 'Sales', data: this.heroKpis.sales.sparkline || [] }];
        },
        sparkInvoicesOptions() {
            return this.buildSparklineOptions('#16a34a', 'count');
        },
        sparkInvoicesSeries() {
            return [{ name: 'Invoices', data: this.heroKpis.invoices.sparkline || [] }];
        },
        sparkCollectionsOptions() {
            return this.buildSparklineOptions('#d97706', 'currency');
        },
        sparkCollectionsSeries() {
            return [{ name: 'Collections', data: this.heroKpis.collections.sparkline || [] }];
        },
        sparkOutstandingOptions() {
            return this.buildSparklineOptions('#dc2626', 'currency');
        },
        sparkOutstandingSeries() {
            return [{ name: 'Outstanding', data: this.heroKpis.outstanding.sparkline || [] }];
        },
        trendChartOptions() {
            const self = this;
            return {
                chart: {
                    height: 235,
                    type: 'line',
                    toolbar: { show: false },
                    zoom: { enabled: false },
                    fontFamily: 'inherit',
                    parentHeightOffset: 0,
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: {
                            enabled: true,
                            delay: 150
                        },
                        dynamicAnimation: {
                            enabled: true,
                            speed: 350
                        }
                    }
                },
                stroke: {
                    width: [2.5, 2],
                    curve: 'smooth'
                },
                fill: {
                    type: ['gradient', 'solid'],
                    gradient: {
                        shade: 'light',
                        type: 'vertical',
                        shadeIntensity: 0.5,
                        opacityFrom: 0.35,
                        opacityTo: 0.04,
                        stops: [0, 90, 100]
                    }
                },
                colors: ['#2563eb', '#10b981'],
                markers: {
                    size: [0, 4],
                    strokeWidth: 2,
                    strokeColors: '#ffffff',
                    hover: { size: 6 }
                },
                xaxis: {
                    categories: this.salesTrendData.dates || [],
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    tickAmount: 7,
                    labels: {
                        style: { colors: '#94a3b8', fontSize: '11px' },
                        rotate: 0,
                        rotateAlways: false,
                        hideOverlappingLabels: true
                    }
                },
                yaxis: [
                    {
                        labels: {
                            formatter: (val) => self.formatAxisCurrency(val),
                            style: { colors: '#94a3b8', fontSize: '11px' }
                        }
                    },
                    {
                        opposite: true,
                        labels: {
                            formatter: (val) => Math.round(val),
                            style: { colors: '#94a3b8', fontSize: '11px' }
                        }
                    }
                ],
                grid: {
                    borderColor: '#f1f5f9',
                    strokeDashArray: 3,
                    padding: {
                        top: 0,
                        right: 8,
                        bottom: 0,
                        left: 10
                    }
                },
                legend: { show: false },
                tooltip: {
                    shared: true,
                    intersect: false,
                    theme: 'light',
                    y: {
                        formatter: (val, opts) => {
                            if (opts.seriesIndex === 0) return self.formatCurrency(val);
                            return Math.round(val) + ' invoices';
                        }
                    }
                }
            };
        },
        trendChartSeries() {
            return [
                { name: 'Sales Amount', type: 'area', data: this.salesTrendData.sales || [] },
                { name: 'Invoices', type: 'line', data: this.salesTrendData.invoices || [] }
            ];
        },
        categoryChartOptions() {
            const self = this;
            return {
                chart: {
                    type: 'donut',
                    height: 215,
                    fontFamily: 'inherit',
                    parentHeightOffset: 0,
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800
                    }
                },
                labels: this.categoryRawData.labels || [],
                colors: ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#64748b'],
                stroke: { show: true, width: 3, colors: ['#ffffff'] },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '70%',
                            labels: {
                                show: true,
                                name: { show: true, fontSize: '11px', color: '#64748b', offsetY: -3 },
                                value: {
                                    show: true,
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    color: '#0f172a',
                                    offsetY: 2,
                                    formatter: (val) => self.categoryMetricMode === 'amount' ? self.formatCurrency(val) : self.formatNumber(val)
                                },
                                total: {
                                    show: true,
                                    label: self.categoryMetricMode === 'amount' ? self.__('Total Sales') : self.__('Total Units'),
                                    fontSize: '11px',
                                    color: '#64748b',
                                    formatter: () => self.categoryMetricMode === 'amount'
                                        ? self.formatCurrency(self.categoryRawData.total_sales)
                                        : self.formatNumber((self.categoryRawData.series_units || []).reduce((a, b) => a + Number(b), 0))
                                }
                            }
                        }
                    }
                },
                dataLabels: { enabled: false },
                legend: { show: false },
                tooltip: {
                    theme: 'light',
                    y: {
                        formatter: (val) => self.categoryMetricMode === 'amount' ? self.formatCurrency(val) : self.formatNumber(val) + ' units'
                    }
                }
            };
        },
        categoryChartSeries() {
            if (this.categoryMetricMode === 'amount') {
                return (this.categoryRawData.series_sales || []).map(v => Number(v));
            }
            return (this.categoryRawData.series_units || []).map(v => Number(v));
        },
        categoryBreakdownList() {
            const labels = this.categoryRawData.labels || [];
            const values = this.categoryMetricMode === 'amount'
                ? (this.categoryRawData.series_sales || [])
                : (this.categoryRawData.series_units || []);
            const total = values.reduce((sum, v) => sum + Number(v), 0);
            return labels.map((name, idx) => {
                const s = Number(values[idx] || 0);
                const p = total > 0 ? ((s / total) * 100).toFixed(1) : '0.0';
                return { name, sales: s, percent: p };
            });
        }
    },
    created() {
        this.checkStockWarning();
        this.fetchDashboardData();
        this.getOrderStatuses();
        this.getLatestOrders();
    },
    beforeDestroy() {
        clearTimeout(this.midnightTimer);
        if (this.statsAnimFrameId) {
            cancelAnimationFrame(this.statsAnimFrameId);
        }
    },
    methods: {
        formatCurrency(value) {
            if (value === null || value === undefined || isNaN(value)) return '₹ 0';
            const num = Number(value);
            if (num >= 10000000) return '₹ ' + (num / 10000000).toFixed(2) + ' Cr';
            if (num >= 100000) return '₹ ' + (num / 100000).toFixed(2) + ' L';
            if (num >= 1000) return '₹ ' + (num / 1000).toFixed(1) + ' K';
            return '₹ ' + Math.round(num).toLocaleString('en-IN');
        },
        formatAxisCurrency(val) {
            if (val >= 100000) return (val / 100000).toFixed(1) + 'L';
            if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
            return val;
        },
        formatNumber(value) {
            if (value === null || value === undefined || isNaN(value)) return '0';
            return Number(value).toLocaleString('en-IN');
        },
        getInitials(name) {
            if (!name) return 'U';
            const parts = name.trim().split(' ');
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return name.substring(0, 2).toUpperCase();
        },
        getCategoryColor(idx) {
            const palette = ['#4f46e5', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#64748b'];
            return palette[idx % palette.length];
        },
        getAchievementClass(val) {
            if (val >= 100) return 'bg-success';
            if (val >= 80) return 'bg-primary';
            if (val >= 60) return 'bg-warning';
            return 'bg-secondary';
        },
        getAchievementTextClass(val) {
            if (val >= 100) return 'text-success';
            if (val >= 80) return 'text-primary';
            if (val >= 60) return 'text-warning';
            return 'text-muted';
        },
        onProductImgError(event) {
            event.target.style.display = 'none';
            if (event.target.nextElementSibling) {
                event.target.nextElementSibling.style.display = 'inline-block';
            }
        },
        buildSparklineOptions(color, mode) {
            const self = this;
            return {
                chart: {
                    type: 'area',
                    height: 36,
                    sparkline: { enabled: true },
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 600
                    },
                    parentHeightOffset: 0
                },
                stroke: {
                    curve: 'smooth',
                    width: 2,
                    colors: [color]
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.35,
                        opacityTo: 0.0,
                        stops: [0, 100],
                        colorStops: [
                            { offset: 0, color: color, opacity: 0.3 },
                            { offset: 100, color: color, opacity: 0.0 }
                        ]
                    }
                },
                tooltip: {
                    fixed: { enabled: false },
                    x: { show: false },
                    y: {
                        formatter: (val) => mode === 'count' ? (val + ' invoices') : self.formatCurrency(val)
                    },
                    marker: { show: false }
                }
            };
        },
        animateAllStats() {
            if (this.statsAnimFrameId) {
                cancelAnimationFrame(this.statsAnimFrameId);
            }
            const duration = 1000;
            const startTime = performance.now();

            const startValues = {
                sales: Number(this.animatedStats.sales) || 0,
                invoices: Number(this.animatedStats.invoices) || 0,
                collections: Number(this.animatedStats.collections) || 0,
                outstanding: Number(this.animatedStats.outstanding) || 0,
                active_retailers: Number(this.animatedStats.active_retailers) || 0,
                active_salesmen: Number(this.animatedStats.active_salesmen) || 0,
                active_drivers: Number(this.animatedStats.active_drivers) || 0,
                products: Number(this.animatedStats.products) || 0,
                schemes: Number(this.animatedStats.schemes) || 0,
                pending_deliveries: Number(this.animatedStats.pending_deliveries) || 0,
                pending_deliveries_value: Number(this.animatedStats.pending_deliveries_value) || 0
            };

            const targetValues = {
                sales: Number(this.heroKpis.sales && this.heroKpis.sales.current) || 0,
                invoices: Number(this.heroKpis.invoices && this.heroKpis.invoices.current) || 0,
                collections: Number(this.heroKpis.collections && this.heroKpis.collections.current) || 0,
                outstanding: Number(this.heroKpis.outstanding && this.heroKpis.outstanding.current) || 0,
                active_retailers: Number(this.operationalStats.active_retailers && this.operationalStats.active_retailers.count) || 0,
                active_salesmen: Number(this.operationalStats.active_salesmen && this.operationalStats.active_salesmen.count) || 0,
                active_drivers: Number(this.operationalStats.active_drivers && this.operationalStats.active_drivers.count) || 0,
                products: Number(this.operationalStats.products && this.operationalStats.products.count) || 0,
                schemes: Number(this.operationalStats.schemes && this.operationalStats.schemes.count) || 0,
                pending_deliveries: Number(this.operationalStats.pending_deliveries && this.operationalStats.pending_deliveries.count) || 0,
                pending_deliveries_value: Number(this.operationalStats.pending_deliveries && this.operationalStats.pending_deliveries.value) || 0
            };

            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

            const step = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = easeOutCubic(progress);

                for (const key in targetValues) {
                    const start = startValues[key] || 0;
                    const target = targetValues[key];
                    this.animatedStats[key] = start + (target - start) * ease;
                }

                if (progress < 1) {
                    this.statsAnimFrameId = requestAnimationFrame(step);
                } else {
                    for (const key in targetValues) {
                        this.animatedStats[key] = targetValues[key];
                    }
                    this.statsAnimFrameId = null;
                }
            };

            this.statsAnimFrameId = requestAnimationFrame(step);
        },
        setPresetRange(preset) {
            this.activePreset = preset;
            const end = new Date();
            const start = new Date();
            if (preset === 'today') {
                start.setHours(0, 0, 0, 0);
            } else if (preset === 'last7') {
                start.setDate(start.getDate() - 6);
                start.setHours(0, 0, 0, 0);
            } else if (preset === 'last30') {
                start.setDate(start.getDate() - 29);
                start.setHours(0, 0, 0, 0);
            } else if (preset === 'this_month') {
                start.setDate(1);
                start.setHours(0, 0, 0, 0);
            }
            end.setHours(23, 59, 59, 999);
            this.dateRange = { startDate: start, endDate: end };
            this.fetchDashboardData();
        },
        onDateRangeApplied() {
            this.activePreset = 'custom';
            this.fetchDashboardData();
        },
        fetchDashboardData() {
            this.isLoading = true;
            const params = {};
            if (this.dateRange && this.dateRange.startDate && this.dateRange.endDate) {
                params.startDate = moment(this.dateRange.startDate).format('YYYY-MM-DD');
                params.endDate = moment(this.dateRange.endDate).format('YYYY-MM-DD');
            }

            axios.get(this.$sellerApiUrl + '/dashboard', { params })
                .then(res => {
                    this.isLoading = false;
                    const data = res.data;
                    if (data.status === 1) {
                        this.record = data.data;
                        if (data.data.distributor_info) {
                            this.distributorInfo = data.data.distributor_info;
                        }
                        if (data.data.period && data.data.period.formatted) {
                            this.periodFormatted = data.data.period.formatted;
                        }
                        if (data.data.hero_kpis) {
                            this.heroKpis = data.data.hero_kpis;
                        }
                        if (data.data.operational_stats) {
                            this.operationalStats = data.data.operational_stats;
                        }
                        if (data.data.sales_trend) {
                            this.salesTrendData = data.data.sales_trend;
                        }
                        if (data.data.category_sales) {
                            this.categoryRawData = data.data.category_sales;
                        }
                        this.topProducts = data.data.top_products || [];
                        this.salesBySalesman = data.data.sales_by_salesman || [];
                        this.salesByDriver = data.data.sales_by_driver || [];
                        this.retailerActivity = data.data.retailer_activity || [];
                        this.outstandingByRetailer = data.data.outstanding_by_retailer || [];
                        this.lowStockProducts = data.data.low_stock_products || [];
                        this.aiInsights = data.data.ai_insights || [];
                        this.$nextTick(() => {
                            this.animateAllStats();
                        });
                    }
                })
                .catch(err => {
                    this.isLoading = false;
                    this.showError(err.message || 'Failed to load dashboard data');
                });
        },
        getOrderStatuses() {
            axios.get(this.$apiUrl + '/order_statuses').then(res => {
                this.statuses = res.data.data || [];
            }).catch(() => {});
        },
        getLatestOrders() {
            const params = {
                startDate: this.dateRange.startDate ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : '',
                endDate: this.dateRange.endDate ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : '',
                status: this.status
            };
            axios.get(this.$sellerApiUrl + '/orders', { params })
                .then(res => {
                    if (res.data.status === 1) {
                        this.orders = res.data.data.orders || [];
                        this.orderTotalRows = this.orders.length;
                    }
                })
                .catch(() => {});
        },
        getStatusDisplayName(status) {
            if (!status) return '';
            const sn = status.status_name;
            if (sn == null) return status.status || '';
            if (typeof sn === 'object') {
                const lang = this.$i18n ? this.$i18n.locale : 'en';
                return sn[lang] || sn['en'] || Object.values(sn)[0] || status.status || '';
            }
            return String(sn);
        },
        getStatusNameById(statusId) {
            if (!this.statuses || !this.statuses.length) return statusId;
            const found = this.statuses.find(s => s.id == statusId);
            if (!found) return statusId;
            return this.getStatusLabel(found);
        },
        getOrderStatusBadgeClass(statusId) {
            const sid = Number(statusId);
            if (sid === 6) return 'bg-success text-white';
            if (sid === 7) return 'bg-danger text-white';
            if (sid === 8) return 'bg-secondary text-white';
            if (sid === 5) return 'bg-info text-white';
            if (sid === 3 || sid === 4) return 'bg-primary text-white';
            if (sid === 2) return 'bg-warning text-dark';
            return 'bg-light text-dark border';
        },
        getStatusLabel(status) {
            if (!status) return '';
            const sn = status.status_name;
            if (sn == null) return status.status || '';
            if (typeof sn === 'object') {
                const lang = this.$i18n ? this.$i18n.locale : 'en';
                return sn[lang] || sn['en'] || Object.values(sn)[0] || status.status || '';
            }
            return String(sn);
        },
        checkStockWarning() {
            const dismissedDate = localStorage.getItem('stock_warning_dismissed');
            const today = new Date().toISOString().slice(0, 10);
            this.showStockWarning = (dismissedDate !== today);
            this.scheduleMidnightWarning();
        },
        scheduleMidnightWarning() {
            clearTimeout(this.midnightTimer);
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
            const msUntilMidnight = tomorrow.getTime() - now.getTime();
            this.midnightTimer = setTimeout(() => {
                this.checkStockWarning();
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
        }
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

.distributor-dashboard {
    padding-bottom: 2rem;
    color: #0f172a;
}

/* Header greeting */
.greeting-title {
    font-size: 1.55rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.025em;
    line-height: 1.25;
}

.greeting-subtitle {
    font-size: 0.875rem;
    color: #64748b;
    font-weight: 400;
}

.greeting-period {
    color: #334155;
    font-weight: 600;
}

.wave-emoji {
    display: inline-block;
    animation: wave 2.5s infinite;
    transform-origin: 70% 70%;
}

@keyframes wave {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(14deg); }
    20% { transform: rotate(-8deg); }
    30% { transform: rotate(14deg); }
    40% { transform: rotate(-4deg); }
    50% { transform: rotate(10deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
}

/* Unified Top Bar Controls */
.toolbar-pill-group {
    display: inline-flex;
    align-items: center;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 3px;
    gap: 2px;
}

.preset-pill-btn {
    border: none;
    background: transparent;
    font-size: 11.5px;
    font-weight: 500;
    padding: 5px 12px;
    border-radius: 9px;
    color: #64748b;
    transition: all 0.15s ease;
    cursor: pointer;
    line-height: 1.2;
}

.preset-pill-btn:hover {
    background-color: #f1f5f9;
    color: #334155;
}

.preset-pill-btn.active {
    background-color: #0f172a;
    color: #ffffff;
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
}

.date-picker-wrap {
    height: 36px;
    display: inline-flex;
    align-items: center;
}

.date-picker-wrap .vue-daterangepicker {
    border-radius: 12px !important;
}

.date-picker-wrap .reportrange-text {
    height: 36px !important;
    display: flex !important;
    align-items: center !important;
    border: 1px solid #e2e8f0 !important;
    background: #ffffff !important;
    border-radius: 12px !important;
    padding: 0 12px !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    color: #334155 !important;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03) !important;
    transition: all 0.15s ease !important;
}

.date-picker-wrap .reportrange-text:hover {
    background: #f8fafc !important;
    border-color: #cbd5e1 !important;
}

.btn-refresh-toolbar {
    height: 36px;
    width: 36px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background: #ffffff;
    color: #64748b;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
    transition: all 0.15s ease;
}

.btn-refresh-toolbar:hover:not(:disabled) {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #0f172a;
}

/* Primary KPI Cards (Exact Client Reference - Full-Width Horizontal Layout) */
.kpi-card {
    background: #ffffff;
    border: 1px solid #f1f5f9 !important;
    border-radius: 14px !important;
    box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02) !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    width: 100% !important;
    height: 100% !important;
    min-height: 114px;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    overflow: hidden !important;
    text-align: left !important;
}

.kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04) !important;
    border-color: #e2e8f0 !important;
}

.kpi-card-body {
    padding: 16px 18px 0 18px !important;
    text-align: left !important;
}

.kpi-header-row {
    display: flex !important;
    align-items: flex-start !important;
    justify-content: space-between !important;
    gap: 12px;
}

.kpi-meta-group {
    display: flex !important;
    align-items: flex-start !important;
    min-width: 0;
    flex: 1 1 auto;
}

.kpi-icon-tile {
    width: 46px !important;
    height: 46px !important;
    border-radius: 12px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    margin-right: 15px !important;
    margin-top: 2px !important;
}

.icon-blue { background-color: #eff6ff; color: #2563eb; }
.icon-green { background-color: #ecfdf5; color: #059669; }
.icon-amber { background-color: #fffbeb; color: #d97706; }
.icon-red { background-color: #fef2f2; color: #dc2626; }
.icon-purple { background-color: #f5f3ff; color: #9333ea; }
.icon-indigo { background-color: #eef2ff; color: #4f46e5; }

.kpi-text-block {
    text-align: left !important;
    min-width: 0;
    flex: 1 1 auto;
}

.kpi-label {
    font-size: 13px !important;
    font-weight: 500 !important;
    color: #64748b !important;
    margin-bottom: 4px !important;
    line-height: 1.25 !important;
    text-align: left !important;
    white-space: nowrap;
}

.kpi-value {
    font-size: 1.5rem !important;
    font-weight: 700 !important;
    letter-spacing: -0.025em !important;
    color: #0f172a !important;
    line-height: 1.2 !important;
    margin-bottom: 4px !important;
    font-variant-numeric: tabular-nums !important;
    font-feature-settings: "tnum" !important;
    text-align: left !important;
    white-space: nowrap;
}

.kpi-subtext {
    font-size: 11.5px !important;
    color: #94a3b8 !important;
    line-height: 1.3 !important;
    text-align: left !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.kpi-growth-pill {
    display: inline-flex;
    align-items: center;
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 9999px;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
    line-height: 1.2;
    white-space: nowrap;
    flex-shrink: 0;
    margin-top: 2px;
}

.pill-green {
    background-color: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
}

.pill-red {
    background-color: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
}

.kpi-sparkline-wrap {
    height: 30px;
    margin-bottom: -5px;
    overflow: hidden;
    line-height: 0;
    pointer-events: none;
}

/* Row 2: 6 Operational Stat Cards (Grid of 6) */
.ops-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    margin-bottom: 1rem;
}

@media (max-width: 1280px) {
    .ops-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .ops-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .ops-grid {
        grid-template-columns: 1fr;
    }
}

.ops-card {
    background: #ffffff;
    border: 1px solid #f1f5f9 !important;
    border-radius: 12px !important;
    padding: 10px 12px !important;
    display: flex !important;
    flex-direction: row !important;
    align-items: center !important;
    gap: 10px !important;
    height: 64px;
    min-height: 64px;
    box-sizing: border-box;
    text-align: left !important;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04) !important;
    transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    overflow: hidden;
    cursor: default;
    text-decoration: none !important;
    position: relative;
}

/* Clickable ops-cards (router-link) */
a.ops-card {
    cursor: pointer;
}

a.ops-card .ops-arrow-icon,
.ops-card .ops-arrow-icon {
    font-size: 18px;
    font-weight: 300;
    line-height: 1;
    flex-shrink: 0;
    margin-left: auto;
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.18s ease, transform 0.18s ease;
    color: currentColor;
}

/* Blue (Retailers) */
a.ops-card--blue:hover {
    background: #eff6ff !important;
    border-color: #93c5fd !important;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.12), 0 1px 4px rgba(37, 99, 235, 0.08) !important;
    transform: translateY(-2px) scale(1.015);
    color: #2563eb;
}
a.ops-card--blue:hover .ops-icon-tile { background-color: #dbeafe !important; transform: scale(1.12); }
a.ops-card--blue:hover .ops-arrow-icon { opacity: 1; transform: translateX(0); color: #2563eb; }

/* Purple (Salesman) */
a.ops-card--purple:hover {
    background: #f5f3ff !important;
    border-color: #c4b5fd !important;
    box-shadow: 0 4px 16px rgba(147, 51, 234, 0.12), 0 1px 4px rgba(147, 51, 234, 0.08) !important;
    transform: translateY(-2px) scale(1.015);
    color: #7c3aed;
}
a.ops-card--purple:hover .ops-icon-tile { background-color: #ede9fe !important; transform: scale(1.12); }
a.ops-card--purple:hover .ops-arrow-icon { opacity: 1; transform: translateX(0); color: #7c3aed; }

/* Green (Drivers) */
a.ops-card--green:hover {
    background: #ecfdf5 !important;
    border-color: #6ee7b7 !important;
    box-shadow: 0 4px 16px rgba(5, 150, 105, 0.12), 0 1px 4px rgba(5, 150, 105, 0.08) !important;
    transform: translateY(-2px) scale(1.015);
    color: #059669;
}
a.ops-card--green:hover .ops-icon-tile { background-color: #d1fae5 !important; transform: scale(1.12); }
a.ops-card--green:hover .ops-arrow-icon { opacity: 1; transform: translateX(0); color: #059669; }

/* Indigo (Products) */
a.ops-card--indigo:hover {
    background: #eef2ff !important;
    border-color: #a5b4fc !important;
    box-shadow: 0 4px 16px rgba(79, 70, 229, 0.12), 0 1px 4px rgba(79, 70, 229, 0.08) !important;
    transform: translateY(-2px) scale(1.015);
    color: #4f46e5;
}
a.ops-card--indigo:hover .ops-icon-tile { background-color: #e0e7ff !important; transform: scale(1.12); }
a.ops-card--indigo:hover .ops-arrow-icon { opacity: 1; transform: translateX(0); color: #4f46e5; }

/* Amber (Schemes) */
a.ops-card--amber:hover {
    background: #fffbeb !important;
    border-color: #fcd34d !important;
    box-shadow: 0 4px 16px rgba(217, 119, 6, 0.12), 0 1px 4px rgba(217, 119, 6, 0.08) !important;
    transform: translateY(-2px) scale(1.015);
    color: #d97706;
}
a.ops-card--amber:hover .ops-icon-tile { background-color: #fde68a !important; transform: scale(1.12); }
a.ops-card--amber:hover .ops-arrow-icon { opacity: 1; transform: translateX(0); color: #d97706; }

/* Red (Pending Deliveries) */
a.ops-card--red:hover {
    background: #fef2f2 !important;
    border-color: #fca5a5 !important;
    box-shadow: 0 4px 16px rgba(220, 38, 38, 0.12), 0 1px 4px rgba(220, 38, 38, 0.08) !important;
    transform: translateY(-2px) scale(1.015);
    color: #dc2626;
}
a.ops-card--red:hover .ops-icon-tile { background-color: #fee2e2 !important; transform: scale(1.12); }
a.ops-card--red:hover .ops-arrow-icon { opacity: 1; transform: translateX(0); color: #dc2626; }

.ops-icon-tile {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.18s ease !important;
}

.ops-text-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    flex: 1;
    text-align: left !important;
}

.ops-label {
    font-size: 11px !important;
    color: #64748b !important;
    font-weight: 500 !important;
    line-height: 1.15 !important;
    text-align: left !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 !important;
}

.ops-value {
    font-size: 1.15rem !important;
    font-weight: 700 !important;
    color: #0f172a !important;
    line-height: 1.15 !important;
    text-align: left !important;
    margin: 2px 0 1px 0 !important;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
    letter-spacing: -0.02em;
    white-space: nowrap;
}

.ops-sub {
    font-size: 10.5px !important;
    font-weight: 600 !important;
    line-height: 1.1 !important;
    text-align: left !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 !important;
}

.ops-sub.text-success { color: #059669 !important; }
.ops-sub.text-danger { color: #dc2626 !important; }
.ops-sub.text-warning { color: #d97706 !important; }
.ops-sub.text-muted { color: #64748b !important; }

/* Tabular Numbers */
.tabular-nums {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
}

/* Row 3, 4, 5 fixed uniform heights */
@media (min-width: 1200px) {
    .dashboard-row-3 > div > .card {
        height: 285px;
    }
    .dashboard-row-4 > div > .card,
    .dashboard-row-5 > div > .card {
        height: 285px;
    }
}

/* Row 4 and Row 5 table layout polish - eliminate horizontal scrollbars */
.dashboard-row-4 .table-responsive,
.dashboard-row-5 .table-responsive {
    overflow-x: hidden !important;
}

.dashboard-row-4 .table,
.dashboard-row-5 .table {
    table-layout: fixed;
    width: 100%;
    margin-bottom: 0;
}

.dashboard-row-4 .table th,
.dashboard-row-4 .table td,
.dashboard-row-5 .table th,
.dashboard-row-5 .table td {
    padding: 6px 4px !important;
    vertical-align: middle !important;
    white-space: nowrap;
}

/* Segmented button toggle */
.segmented-pills {
    display: inline-flex;
    background-color: #f1f5f9;
    border-radius: 8px;
    padding: 2px;
}

.seg-btn {
    border: none;
    background: transparent;
    font-size: 11px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 6px;
    color: #64748b;
    transition: all 0.15s ease;
}

.seg-btn.active {
    background-color: #0f172a;
    color: #ffffff;
    font-weight: 600;
}

/* Top Products Table (Zebra / Hover Highlights, Rank Badges, Unit Pills) */
.top-table-container {
    overflow-x: hidden;
}

.top-products-table {
    table-layout: fixed;
    width: 100%;
}

.top-products-table td, .top-products-table th {
    vertical-align: middle;
}

.top-products-table tbody tr.product-item-row {
    transition: background-color 0.15s ease;
    border-bottom: 1px solid #f8fafc;
}

.top-products-table tbody tr.product-item-row:hover {
    background-color: #f8fafc;
}

.product-title-text {
    line-height: 1.3;
    font-size: 12px;
    word-break: break-word;
}

.rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
}

.rank-1 {
    background-color: #fef3c7;
    color: #b45309;
    border: 1px solid #fde68a;
}

.rank-2 {
    background-color: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;
}

.rank-3 {
    background-color: #ffedd5;
    color: #c2410c;
    border: 1px solid #fed7aa;
}

.rank-other {
    background-color: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
}

.unit-pill {
    background-color: #f1f5f9;
    color: #475569;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 7px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
    display: inline-block;
}

.product-thumb-sq {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background-color: #f8fafc;
    border: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.product-thumb-sq img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.prod-fallback-icon {
    font-size: 14px;
}

/* Entity Cells Alignment (Salesman, Driver, Retailer) */
.entity-cell-group {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    text-align: left !important;
    gap: 8px !important;
    width: 100% !important;
}

.entity-info-block {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    justify-content: center !important;
    text-align: left !important;
    min-width: 0 !important;
    flex: 1 1 auto !important;
}

.entity-name {
    text-align: left !important;
    font-weight: 500 !important;
    color: #1e293b !important;
    font-size: 12px !important;
    line-height: 1.25 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    width: 100% !important;
    display: block !important;
}

.entity-sub {
    text-align: left !important;
    font-size: 10.5px !important;
    color: #64748b !important;
    line-height: 1.2 !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    width: 100% !important;
    display: block !important;
}

.avatar-circle-sm {
    width: 28px !important;
    min-width: 28px !important;
    max-width: 28px !important;
    height: 28px !important;
    border-radius: 50% !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 11px !important;
    flex-shrink: 0 !important;
}

.bg-purple-subtle { background-color: #f5f3ff !important; }
.text-purple { color: #8b5cf6 !important; }
.bg-blue-subtle { background-color: #eff6ff !important; }
.bg-green-subtle { background-color: #ecfdf5 !important; }

.status-pill-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 600;
}

.pill-active {
    background-color: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
}

.pill-inactive {
    background-color: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
}

.border-bottom-subtle {
    border-bottom: 1px solid #f8fafc;
}

.view-all-link {
    text-decoration: none;
    font-size: 12px;
}

.view-all-link:hover {
    text-decoration: underline;
}

/* Legend dots */
.legend-dot-item {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
}

.legend-dot-item .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
}

.cat-color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
}

.min-w-0 {
    min-width: 0 !important;
}

/* AI Insights card */
.ai-card-wrapper {
    overflow: hidden !important;
}

.ai-sparkle-icon {
    color: #8b5cf6;
    font-size: 15px;
}

.ai-circle-icon {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    flex-shrink: 0;
}

.ai-icon-success { background-color: #ecfdf5; color: #059669; }
.ai-icon-warning { background-color: #fffbeb; color: #d97706; }
.ai-icon-info { background-color: #eff6ff; color: #2563eb; }
.ai-icon-primary { background-color: #f5f3ff; color: #7c3aed; }

.ai-cards-stack {
    width: 100% !important;
    min-width: 0 !important;
}

.ai-row {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 8px !important;
    width: 100% !important;
    min-width: 0 !important;
    text-align: left !important;
}

.ai-content-wrap {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    min-width: 0 !important;
    flex: 1 1 0% !important;
    overflow: hidden !important;
    text-align: left !important;
}

.ai-text-block {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    justify-content: center !important;
    min-width: 0 !important;
    flex: 1 1 0% !important;
    overflow: hidden !important;
    text-align: left !important;
}

.ai-title {
    font-size: 12px !important;
    line-height: 1.3 !important;
    text-align: left !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    width: 100% !important;
    max-width: 100% !important;
    display: block !important;
}

.ai-sub {
    font-size: 11px !important;
    line-height: 1.3 !important;
    text-align: left !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    width: 100% !important;
    max-width: 100% !important;
    display: block !important;
}

.ai-action {
    flex-shrink: 0 !important;
    margin-left: auto !important;
}

.action-btn {
    border-color: #e2e8f0 !important;
    background-color: #ffffff !important;
    font-size: 11px !important;
    border-radius: 8px !important;
    white-space: nowrap !important;
    display: inline-block !important;
}

.action-btn:hover {
    background-color: #f8fafc !important;
}

.shadow-xs {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.btn-white {
    background-color: #ffffff;
    border-color: #e2e8f0;
}

@media (max-width: 768px) {
    .greeting-title {
        font-size: 1.3rem;
    }
    .kpi-value {
        font-size: 1.35rem;
    }
}

/* Smooth Staggered Dashboard Entrance Animation */
@keyframes dashCardEntrance {
    0% {
        opacity: 0;
        transform: translateY(12px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.kpi-card,
.ops-card,
.dashboard-row-3 > div > .card,
.dashboard-row-4 > div > .card,
.dashboard-row-5 > div > .card {
    animation: dashCardEntrance 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.kpi-card:hover {
    transform: translateY(-2px) !important;
}

.ops-card:hover {
    transform: translateY(-1px) !important;
}

/* Staggered Entrance Delays */
.dashboard-row-1 .col-xl-3:nth-child(1) .kpi-card { animation-delay: 0.05s; }
.dashboard-row-1 .col-xl-3:nth-child(2) .kpi-card { animation-delay: 0.10s; }
.dashboard-row-1 .col-xl-3:nth-child(3) .kpi-card { animation-delay: 0.15s; }
.dashboard-row-1 .col-xl-3:nth-child(4) .kpi-card { animation-delay: 0.20s; }

.ops-grid .ops-card:nth-child(1) { animation-delay: 0.14s; }
.ops-grid .ops-card:nth-child(2) { animation-delay: 0.18s; }
.ops-grid .ops-card:nth-child(3) { animation-delay: 0.22s; }
.ops-grid .ops-card:nth-child(4) { animation-delay: 0.26s; }
.ops-grid .ops-card:nth-child(5) { animation-delay: 0.30s; }
.ops-grid .ops-card:nth-child(6) { animation-delay: 0.34s; }

.dashboard-row-3 > div:nth-child(1) > .card { animation-delay: 0.25s; }
.dashboard-row-3 > div:nth-child(2) > .card { animation-delay: 0.30s; }
.dashboard-row-3 > div:nth-child(3) > .card { animation-delay: 0.35s; }

.dashboard-row-4 > div:nth-child(1) > .card { animation-delay: 0.35s; }
.dashboard-row-4 > div:nth-child(2) > .card { animation-delay: 0.40s; }
.dashboard-row-4 > div:nth-child(3) > .card { animation-delay: 0.45s; }

.dashboard-row-5 > div:nth-child(1) > .card { animation-delay: 0.45s; }
.dashboard-row-5 > div:nth-child(2) > .card { animation-delay: 0.50s; }
.dashboard-row-5 > div:nth-child(3) > .card { animation-delay: 0.55s; }
</style>
