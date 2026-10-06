<template>
    <div class="export-center-page">
        <!-- Top Header & Action Row -->
        <div class="export-header-container mb-4">
            <div class="row align-items-center">
                <div class="col-12 col-lg-7 mb-3 mb-lg-0">
                    <div class="d-flex align-items-center">
                        <div class="export-header-icon-box me-3">
                            <svg class="header-icon-svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                        </div>
                        <div>
                            <h2 class="export-main-title">{{ __('export_center') }}</h2>
                            <div class="export-sub-title">
                                Export your business transactions and catalog data pre-formatted for Tally Prime.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-5 text-lg-end">
                    <div class="header-help-card" @click="showGuideModal = true" role="button">
                        <div class="help-card-icon me-3">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                        </div>
                        <div class="help-card-body">
                            <div class="help-title">
                                How to import in Tally Prime? <i class="fa fa-angle-right ms-1 text-primary"></i>
                            </div>
                            <div class="help-subtitle">Step-by-step guides for vouchers, ledgers & tax setup</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tally Status & Format Bar -->
            <div class="tally-status-bar shadow-sm mt-3">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <div class="d-flex align-items-center">
                        <div class="tally-tag me-3">
                            <span class="tally-indicator"></span>
                            <span class="tally-tag-text">TALLY PRIME</span>
                        </div>
                        <div class="tally-info-text">
                            <span class="fw-bold text-dark">Pre-configured Format (.xlsx):</span>
                            <span class="text-muted ms-1">Pre-structured for Tally vouchers, Party Ledgers, Item HSN, Units, and CGST/SGST/IGST accounts.</span>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge format-badge"><i class="fa fa-file-excel-o text-success me-1"></i> Excel (.xlsx)</span>
                        <span class="badge verified-badge"><i class="fa fa-check-circle me-1"></i> Tally 2.0+ / 3.0+ / 4.0+</span>
                    </div>
                </div>
            </div>
        </div>

        <section class="section">
            <div class="card shadow-sm border-0 export-main-card">
                <div class="card-body p-4">
                    <!-- Navigation Tabs -->
                    <b-tabs pills nav-class="export-custom-tabs mb-4" content-class="mt-2">

                        <!-- Tab 1: Sales Invoices -->
                        <b-tab active>
                            <template #title>
                                <div class="tab-title-content">
                                    <i class="fa fa-shopping-cart tab-icon me-2"></i>
                                    <span>{{ __('sales_invoice_export') }}</span>
                                </div>
                            </template>

                            <!-- Step 1: Date Range -->
                            <div class="step-card mb-4">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">1</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Select Date Range & Period</h6>
                                            <div class="step-subheading">Choose invoice date range to export</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-end g-3">
                                        <div class="col-12 col-md-5">
                                            <label class="field-label mb-2">
                                                <i class="fa fa-calendar me-1 text-primary"></i> {{ __('from_and_to_date') }}
                                            </label>
                                            <div class="date-picker-wrap">
                                                <date-range-picker
                                                    :append-to-body="true"
                                                    :single-date-picker="'range'"
                                                    :locale-data="dateRangePickerLocale"
                                                    :ranges="dateRangePickerRanges"
                                                    :autoApply="false"
                                                    :showDropdowns="true"
                                                    v-model="salesDateRange"
                                                    :maxDate="maxDate"
                                                ></date-range-picker>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-7">
                                            <label class="field-label mb-2">
                                                <i class="fa fa-bolt me-1 text-warning"></i> Quick Presets
                                            </label>
                                            <div class="presets-btn-group">
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(salesDateRange, 'today') }"
                                                    @click="applyPreset('salesDateRange', 'today')">
                                                    Today
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(salesDateRange, 'yesterday') }"
                                                    @click="applyPreset('salesDateRange', 'yesterday')">
                                                    Yesterday
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(salesDateRange, 'this_week') }"
                                                    @click="applyPreset('salesDateRange', 'this_week')">
                                                    This Week
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(salesDateRange, 'this_month') }"
                                                    @click="applyPreset('salesDateRange', 'this_month')">
                                                    This Month
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(salesDateRange, 'last_month') }"
                                                    @click="applyPreset('salesDateRange', 'last_month')">
                                                    Last Month
                                                </button>
                                                <button type="button" class="btn btn-preset-clear"
                                                    @click="clearRange('salesDateRange')">
                                                    <i class="fa fa-times me-1"></i> {{ __('clear') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 2: Review & Generate File -->
                            <div class="step-card">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">2</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Generate Export File</h6>
                                            <div class="step-subheading">Review summary and download Tally-ready Excel file</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-stretch g-3">
                                        <div class="col-12 col-lg-8">
                                            <div class="row g-3 h-100">
                                                <div class="col-12 col-sm-4">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Voucher Type</span>
                                                        <div class="summary-value text-dark">
                                                            <i class="fa fa-shopping-cart text-primary me-1"></i> Sales Invoices
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-5">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Selected Period</span>
                                                        <div class="summary-value text-primary" v-if="salesDateRange.startDate && salesDateRange.endDate">
                                                            {{ formatDateRange(salesDateRange) }}
                                                            <span class="badge duration-pill ms-1">{{ getRangeDays(salesDateRange) }}</span>
                                                        </div>
                                                        <div class="summary-value text-warning" v-else>
                                                            <i class="fa fa-exclamation-circle me-1"></i> Date required
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-3">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Output Format</span>
                                                        <div class="summary-value text-success">
                                                            <i class="fa fa-file-excel-o me-1"></i> Excel (.xlsx)
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 col-lg-4 d-flex flex-column justify-content-center">
                                            <button class="btn btn-action-download w-100"
                                                :disabled="!salesDateRange.startDate || !salesDateRange.endDate || downloading.sales"
                                                @click="downloadXlsx('/orders/export_csv', salesDateRange, 'Sales', downloading, 'sales', 'Sales Invoice')">
                                                <span v-if="downloading.sales">
                                                    <i class="fa fa-spinner fa-spin me-2"></i> Generating File...
                                                </span>
                                                <span v-else>
                                                    <i class="fa fa-download me-2"></i> Download Tally File (.xlsx)
                                                </span>
                                            </button>
                                            <div class="text-center text-muted small mt-1" v-if="!salesDateRange.startDate || !salesDateRange.endDate">
                                                Select date range to enable download
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <!-- Tab 2: Credit Notes -->
                        <b-tab>
                            <template #title>
                                <div class="tab-title-content">
                                    <i class="fa fa-reply tab-icon me-2"></i>
                                    <span>{{ __('credit_note_export') }}</span>
                                </div>
                            </template>

                            <!-- Step 1: Date Range -->
                            <div class="step-card mb-4">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">1</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Select Date Range & Period</h6>
                                            <div class="step-subheading">Choose credit note date range to export</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-end g-3">
                                        <div class="col-12 col-md-5">
                                            <label class="field-label mb-2">
                                                <i class="fa fa-calendar me-1 text-primary"></i> {{ __('from_and_to_date') }}
                                            </label>
                                            <div class="date-picker-wrap">
                                                <date-range-picker
                                                    :append-to-body="true"
                                                    :single-date-picker="'range'"
                                                    :locale-data="dateRangePickerLocale"
                                                    :ranges="dateRangePickerRanges"
                                                    :autoApply="false"
                                                    :showDropdowns="true"
                                                    v-model="creditNoteDateRange"
                                                    :maxDate="maxDate"
                                                ></date-range-picker>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-7">
                                            <label class="field-label mb-2">
                                                <i class="fa fa-bolt me-1 text-warning"></i> Quick Presets
                                            </label>
                                            <div class="presets-btn-group">
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(creditNoteDateRange, 'today') }"
                                                    @click="applyPreset('creditNoteDateRange', 'today')">
                                                    Today
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(creditNoteDateRange, 'yesterday') }"
                                                    @click="applyPreset('creditNoteDateRange', 'yesterday')">
                                                    Yesterday
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(creditNoteDateRange, 'this_week') }"
                                                    @click="applyPreset('creditNoteDateRange', 'this_week')">
                                                    This Week
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(creditNoteDateRange, 'this_month') }"
                                                    @click="applyPreset('creditNoteDateRange', 'this_month')">
                                                    This Month
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(creditNoteDateRange, 'last_month') }"
                                                    @click="applyPreset('creditNoteDateRange', 'last_month')">
                                                    Last Month
                                                </button>
                                                <button type="button" class="btn btn-preset-clear"
                                                    @click="clearRange('creditNoteDateRange')">
                                                    <i class="fa fa-times me-1"></i> {{ __('clear') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 2: Review & Generate File -->
                            <div class="step-card">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">2</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Generate Export File</h6>
                                            <div class="step-subheading">Review summary and download Tally-ready Excel file</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-stretch g-3">
                                        <div class="col-12 col-lg-8">
                                            <div class="row g-3 h-100">
                                                <div class="col-12 col-sm-4">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Voucher Type</span>
                                                        <div class="summary-value text-dark">
                                                            <i class="fa fa-reply text-danger me-1"></i> Credit Notes
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-5">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Selected Period</span>
                                                        <div class="summary-value text-primary" v-if="creditNoteDateRange.startDate && creditNoteDateRange.endDate">
                                                            {{ formatDateRange(creditNoteDateRange) }}
                                                            <span class="badge duration-pill ms-1">{{ getRangeDays(creditNoteDateRange) }}</span>
                                                        </div>
                                                        <div class="summary-value text-warning" v-else>
                                                            <i class="fa fa-exclamation-circle me-1"></i> Date required
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-3">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Output Format</span>
                                                        <div class="summary-value text-success">
                                                            <i class="fa fa-file-excel-o me-1"></i> Excel (.xlsx)
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 col-lg-4 d-flex flex-column justify-content-center">
                                            <button class="btn btn-action-download w-100"
                                                :disabled="!creditNoteDateRange.startDate || !creditNoteDateRange.endDate || downloading.creditNote"
                                                @click="downloadXlsx('/credit-notes/export_csv', creditNoteDateRange, 'CreditNote', downloading, 'creditNote', 'Credit Note')">
                                                <span v-if="downloading.creditNote">
                                                    <i class="fa fa-spinner fa-spin me-2"></i> Generating File...
                                                </span>
                                                <span v-else>
                                                    <i class="fa fa-download me-2"></i> Download Tally File (.xlsx)
                                                </span>
                                            </button>
                                            <div class="text-center text-muted small mt-1" v-if="!creditNoteDateRange.startDate || !creditNoteDateRange.endDate">
                                                Select date range to enable download
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <!-- Tab 3: Receipt Cash / Bank -->
                        <b-tab>
                            <template #title>
                                <div class="tab-title-content">
                                    <i class="fa fa-money tab-icon me-2"></i>
                                    <span>{{ __('receipt_cash_export') }}</span>
                                </div>
                            </template>

                            <!-- Step 1: Date Range -->
                            <div class="step-card mb-4">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">1</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Select Date Range & Period</h6>
                                            <div class="step-subheading">Choose cash/bank receipt date range to export</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-end g-3">
                                        <div class="col-12 col-md-5">
                                            <label class="field-label mb-2">
                                                <i class="fa fa-calendar me-1 text-primary"></i> {{ __('from_and_to_date') }}
                                            </label>
                                            <div class="date-picker-wrap">
                                                <date-range-picker
                                                    :append-to-body="true"
                                                    :single-date-picker="'range'"
                                                    :locale-data="dateRangePickerLocale"
                                                    :ranges="dateRangePickerRanges"
                                                    :autoApply="false"
                                                    :showDropdowns="true"
                                                    v-model="cashBankDateRange"
                                                    :maxDate="maxDate"
                                                ></date-range-picker>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-7">
                                            <label class="field-label mb-2">
                                                <i class="fa fa-bolt me-1 text-warning"></i> Quick Presets
                                            </label>
                                            <div class="presets-btn-group">
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(cashBankDateRange, 'today') }"
                                                    @click="applyPreset('cashBankDateRange', 'today')">
                                                    Today
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(cashBankDateRange, 'yesterday') }"
                                                    @click="applyPreset('cashBankDateRange', 'yesterday')">
                                                    Yesterday
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(cashBankDateRange, 'this_week') }"
                                                    @click="applyPreset('cashBankDateRange', 'this_week')">
                                                    This Week
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(cashBankDateRange, 'this_month') }"
                                                    @click="applyPreset('cashBankDateRange', 'this_month')">
                                                    This Month
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(cashBankDateRange, 'last_month') }"
                                                    @click="applyPreset('cashBankDateRange', 'last_month')">
                                                    Last Month
                                                </button>
                                                <button type="button" class="btn btn-preset-clear"
                                                    @click="clearRange('cashBankDateRange')">
                                                    <i class="fa fa-times me-1"></i> {{ __('clear') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 2: Review & Generate File -->
                            <div class="step-card">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">2</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Generate Export File</h6>
                                            <div class="step-subheading">Review summary and download Tally-ready Excel file</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-stretch g-3">
                                        <div class="col-12 col-lg-8">
                                            <div class="row g-3 h-100">
                                                <div class="col-12 col-sm-4">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Voucher Type</span>
                                                        <div class="summary-value text-dark">
                                                            <i class="fa fa-money text-success me-1"></i> Cash / Bank Receipts
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-5">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Selected Period</span>
                                                        <div class="summary-value text-primary" v-if="cashBankDateRange.startDate && cashBankDateRange.endDate">
                                                            {{ formatDateRange(cashBankDateRange) }}
                                                            <span class="badge duration-pill ms-1">{{ getRangeDays(cashBankDateRange) }}</span>
                                                        </div>
                                                        <div class="summary-value text-warning" v-else>
                                                            <i class="fa fa-exclamation-circle me-1"></i> Date required
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-3">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Output Format</span>
                                                        <div class="summary-value text-success">
                                                            <i class="fa fa-file-excel-o me-1"></i> Excel (.xlsx)
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 col-lg-4 d-flex flex-column justify-content-center">
                                            <button class="btn btn-action-download w-100"
                                                :disabled="!cashBankDateRange.startDate || !cashBankDateRange.endDate || downloading.cashBank"
                                                @click="downloadXlsx('/receipts/cash/export_csv', cashBankDateRange, 'ReceiptCashBank', downloading, 'cashBank', 'Cash / Bank Receipt')">
                                                <span v-if="downloading.cashBank">
                                                    <i class="fa fa-spinner fa-spin me-2"></i> Generating File...
                                                </span>
                                                <span v-else>
                                                    <i class="fa fa-download me-2"></i> Download Tally File (.xlsx)
                                                </span>
                                            </button>
                                            <div class="text-center text-muted small mt-1" v-if="!cashBankDateRange.startDate || !cashBankDateRange.endDate">
                                                Select date range to enable download
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <!-- Tab 4: Receipt PDC -->
                        <b-tab>
                            <template #title>
                                <div class="tab-title-content">
                                    <i class="fa fa-credit-card tab-icon me-2"></i>
                                    <span>{{ __('receipt_pdc_export') }}</span>
                                </div>
                            </template>

                            <!-- Step 1: Date Range -->
                            <div class="step-card mb-4">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">1</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Select Date Range & Period</h6>
                                            <div class="step-subheading">Choose PDC receipt date range to export</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-end g-3">
                                        <div class="col-12 col-md-5">
                                            <label class="field-label mb-2">
                                                <i class="fa fa-calendar me-1 text-primary"></i> {{ __('from_and_to_date') }}
                                            </label>
                                            <div class="date-picker-wrap">
                                                <date-range-picker
                                                    :append-to-body="true"
                                                    :single-date-picker="'range'"
                                                    :locale-data="dateRangePickerLocale"
                                                    :ranges="dateRangePickerRanges"
                                                    :autoApply="false"
                                                    :showDropdowns="true"
                                                    v-model="pdcDateRange"
                                                    :maxDate="maxDate"
                                                ></date-range-picker>
                                            </div>
                                        </div>
                                        <div class="col-12 col-md-7">
                                            <label class="field-label mb-2">
                                                <i class="fa fa-bolt me-1 text-warning"></i> Quick Presets
                                            </label>
                                            <div class="presets-btn-group">
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(pdcDateRange, 'today') }"
                                                    @click="applyPreset('pdcDateRange', 'today')">
                                                    Today
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(pdcDateRange, 'yesterday') }"
                                                    @click="applyPreset('pdcDateRange', 'yesterday')">
                                                    Yesterday
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(pdcDateRange, 'this_week') }"
                                                    @click="applyPreset('pdcDateRange', 'this_week')">
                                                    This Week
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(pdcDateRange, 'this_month') }"
                                                    @click="applyPreset('pdcDateRange', 'this_month')">
                                                    This Month
                                                </button>
                                                <button type="button" class="btn btn-preset"
                                                    :class="{ active: isPresetActive(pdcDateRange, 'last_month') }"
                                                    @click="applyPreset('pdcDateRange', 'last_month')">
                                                    Last Month
                                                </button>
                                                <button type="button" class="btn btn-preset-clear"
                                                    @click="clearRange('pdcDateRange')">
                                                    <i class="fa fa-times me-1"></i> {{ __('clear') }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 2: Review & Generate File -->
                            <div class="step-card">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">2</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Generate Export File</h6>
                                            <div class="step-subheading">Review summary and download Tally-ready Excel file</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-stretch g-3">
                                        <div class="col-12 col-lg-8">
                                            <div class="row g-3 h-100">
                                                <div class="col-12 col-sm-4">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Voucher Type</span>
                                                        <div class="summary-value text-dark">
                                                            <i class="fa fa-credit-card text-info me-1"></i> PDC Receipts
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-5">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Selected Period</span>
                                                        <div class="summary-value text-primary" v-if="pdcDateRange.startDate && pdcDateRange.endDate">
                                                            {{ formatDateRange(pdcDateRange) }}
                                                            <span class="badge duration-pill ms-1">{{ getRangeDays(pdcDateRange) }}</span>
                                                        </div>
                                                        <div class="summary-value text-warning" v-else>
                                                            <i class="fa fa-exclamation-circle me-1"></i> Date required
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-3">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Output Format</span>
                                                        <div class="summary-value text-success">
                                                            <i class="fa fa-file-excel-o me-1"></i> Excel (.xlsx)
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 col-lg-4 d-flex flex-column justify-content-center">
                                            <button class="btn btn-action-download w-100"
                                                :disabled="!pdcDateRange.startDate || !pdcDateRange.endDate || downloading.pdc"
                                                @click="downloadXlsx('/receipts/pdc/export_csv', pdcDateRange, 'ReceiptPDC', downloading, 'pdc', 'Receipt PDC')">
                                                <span v-if="downloading.pdc">
                                                    <i class="fa fa-spinner fa-spin me-2"></i> Generating File...
                                                </span>
                                                <span v-else>
                                                    <i class="fa fa-download me-2"></i> Download Tally File (.xlsx)
                                                </span>
                                            </button>
                                            <div class="text-center text-muted small mt-1" v-if="!pdcDateRange.startDate || !pdcDateRange.endDate">
                                                Select date range to enable download
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                        <!-- Tab 5: Product Master -->
                        <b-tab>
                            <template #title>
                                <div class="tab-title-content">
                                    <i class="fa fa-cubes tab-icon me-2"></i>
                                    <span>{{ __('product_master_export') }}</span>
                                </div>
                            </template>

                            <!-- Step 1: Catalog Scope & Notice -->
                            <div class="step-card mb-4">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">1</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Master Catalog Information</h6>
                                            <div class="step-subheading">Export complete product database for Tally item master sync</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tally-tip-box d-flex align-items-start">
                                    <div class="tip-icon me-3">
                                        <i class="fa fa-lightbulb-o"></i>
                                    </div>
                                    <div>
                                        <div class="fw-bold text-dark mb-1">Important Tally Setup Recommendation</div>
                                        <div class="text-muted small">
                                            {{ __('product_master_export_hint') }}
                                            This ensures all stock items, measurement units, HSN codes, and GST rates are properly synchronized before recording transactions.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Step 2: Download Product Master -->
                            <div class="step-card">
                                <div class="step-card-header mb-3">
                                    <div class="d-flex align-items-center">
                                        <span class="step-circle">2</span>
                                        <div class="ms-3">
                                            <h6 class="step-heading mb-0">Generate Product Master File</h6>
                                            <div class="step-subheading">Review catalog export details and download</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="step-card-body">
                                    <div class="row align-items-stretch g-3">
                                        <div class="col-12 col-lg-8">
                                            <div class="row g-3 h-100">
                                                <div class="col-12 col-sm-4">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Export Scope</span>
                                                        <div class="summary-value text-dark">
                                                            <i class="fa fa-cubes text-warning me-1"></i> All Active Products
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-5">
                                                    <div class="summary-box">
                                                        <span class="summary-label">Included Attributes</span>
                                                        <div class="summary-value text-primary">
                                                            HSN, Units, GST %, MRP
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-3">
                                                    <div class="summary-box">
                                                        <span class="summary-label">File Format</span>
                                                        <div class="summary-value text-success">
                                                            <i class="fa fa-file-excel-o me-1"></i> Excel (.xlsx)
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12 col-lg-4 d-flex flex-column justify-content-center">
                                            <button class="btn btn-action-download w-100"
                                                :disabled="downloading.products"
                                                @click="downloadProductsXlsx()">
                                                <span v-if="downloading.products">
                                                    <i class="fa fa-spinner fa-spin me-2"></i> Generating File...
                                                </span>
                                                <span v-else>
                                                    <i class="fa fa-download me-2"></i> Download Product Master (.xlsx)
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-tab>

                    </b-tabs>
                </div>
            </div>

            <!-- Recent Exports Table Card -->
            <div class="card shadow-sm border-0 mt-4 recent-exports-card">
                <div class="card-header bg-white border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <div class="recent-header-icon me-2">
                            <i class="fa fa-history text-secondary"></i>
                        </div>
                        <div>
                            <h6 class="mb-0 fw-bold text-dark">Recent Exports</h6>
                            <small class="text-muted">Your recent download logs in this browser session</small>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger rounded-pill px-3"
                        v-if="recentExports.length > 0"
                        @click="clearRecentExports">
                        <i class="fa fa-trash-o me-1"></i> Clear History
                    </button>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive" v-if="recentExports.length > 0">
                        <table class="table table-hover align-middle mb-0 export-table">
                            <thead>
                                <tr>
                                    <th class="ps-4">#</th>
                                    <th>Export Date & Time</th>
                                    <th>Format / Voucher</th>
                                    <th>Date Range</th>
                                    <th>File Name</th>
                                    <th>Status</th>
                                    <th class="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in recentExports" :key="item.id">
                                    <td class="ps-4 fw-semibold text-muted">{{ index + 1 }}</td>
                                    <td>
                                        <div class="small fw-semibold text-dark">{{ item.time }}</div>
                                    </td>
                                    <td>
                                        <span class="badge bg-light text-dark border">
                                            <i class="fa fa-file-excel-o text-success me-1"></i> {{ item.type }}
                                        </span>
                                    </td>
                                    <td>
                                        <small class="text-muted">{{ item.dateRange }}</small>
                                    </td>
                                    <td>
                                        <code class="small text-secondary">{{ item.fileName }}</code>
                                    </td>
                                    <td>
                                        <span class="badge status-badge-completed">
                                            <i class="fa fa-check me-1"></i> {{ item.status }}
                                        </span>
                                    </td>
                                    <td class="text-end pe-4">
                                        <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 font-size-12"
                                            @click="redownloadRecent(item)">
                                            <i class="fa fa-download me-1"></i> Re-download
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Empty State -->
                    <div class="p-5 text-center" v-else>
                        <div class="empty-export-icon mb-3">
                            <i class="fa fa-file-text-o"></i>
                        </div>
                        <h6 class="text-dark fw-bold mb-1">No recent exports logged yet</h6>
                        <p class="text-muted small mb-0">
                            When you generate export files from above, your recent downloads will appear here for fast re-downloading.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Tally Prime Integration Help Modal -->
        <b-modal v-model="showGuideModal" title="How to Import Exported Data into Tally Prime" size="lg" hide-footer centered>
            <div class="tally-guide-container p-2">
                <div class="alert alert-info d-flex align-items-center mb-4">
                    <i class="fa fa-info-circle fa-2x me-3 text-info"></i>
                    <div>
                        <strong>Recommended Import Sequence:</strong> Always import <strong>Product Master</strong> first into your Tally Company, followed by <strong>Sales Vouchers</strong>, <strong>Receipts</strong>, and <strong>Credit Notes</strong>.
                    </div>
                </div>

                <div class="guide-step-card mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <span class="guide-step-badge">1</span>
                        <h6 class="mb-0 fw-bold text-dark">Step 1: Synchronize Product Master First</h6>
                    </div>
                    <p class="text-muted small mb-1 ms-4">
                        Download the <strong>Product Master Export</strong>. This file contains stock item names, measurement units (e.g. PCS, NOS, BOX), HSN codes, and GST tax percentages. Importing this first ensures Tally has all stock items before recording vouchers.
                    </p>
                </div>

                <div class="guide-step-card mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <span class="guide-step-badge">2</span>
                        <h6 class="mb-0 fw-bold text-dark">Step 2: Ledger Setup in Tally Prime</h6>
                    </div>
                    <div class="text-muted small ms-4">
                        Verify the following standard ledgers are created under your Tally Company:
                        <ul class="mb-1 mt-1 ps-3">
                            <li><strong>Party Ledgers (Sundry Debtors):</strong> Retailer shop names with valid GSTIN matching the customer profiles.</li>
                            <li><strong>Tax Ledgers (Duties & Taxes):</strong> <code>Output CGST</code>, <code>Output SGST</code>, and <code>Output IGST</code>.</li>
                            <li><strong>Sales Ledger:</strong> <code>Sales Account</code> configured with GST Applicable.</li>
                        </ul>
                    </div>
                </div>

                <div class="guide-step-card mb-3">
                    <div class="d-flex align-items-center mb-2">
                        <span class="guide-step-badge">3</span>
                        <h6 class="mb-0 fw-bold text-dark">Step 3: Importing Vouchers in Tally Prime</h6>
                    </div>
                    <div class="text-muted small ms-4">
                        <ol class="mb-1 ps-3">
                            <li>Open <strong>Tally Prime</strong> and load your distributor company.</li>
                            <li>Go to top menu: <strong>Alt + O (Import)</strong> &gt; <strong>Transactions</strong>.</li>
                            <li>Select <strong>Excel (.xlsx)</strong> or XML converter format, select the downloaded file from your Downloads folder.</li>
                            <li>Press <strong>Import</strong>. Tally will validate records and generate the voucher entries automatically.</li>
                        </ol>
                    </div>
                </div>

                <div class="guide-step-card">
                    <div class="d-flex align-items-center mb-2">
                        <span class="guide-step-badge">4</span>
                        <h6 class="mb-0 fw-bold text-dark">Step 4: Check Tally Import Log (Tally.imp)</h6>
                    </div>
                    <p class="text-muted small mb-0 ms-4">
                        If any line items are skipped, check the <code>Tally.imp</code> log file inside your Tally installation directory. The most common cause is a missing party ledger or mismatched tax ledger name.
                    </p>
                </div>

                <div class="text-end mt-4">
                    <button class="btn btn-secondary px-4 rounded-pill" @click="showGuideModal = false">
                        Close Guide
                    </button>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';
import moment from "moment";

export default {
    name: "SellerExportCenter",
    mixins: [DateRangePickerMixin],
    components: {DateRangePicker},
    data: function () {
        return {
            maxDate: new Date(),
            salesDateRange: {startDate: null, endDate: null},
            cashBankDateRange: {startDate: null, endDate: null},
            pdcDateRange: {startDate: null, endDate: null},
            creditNoteDateRange: {startDate: null, endDate: null},
            downloading: {sales: false, cashBank: false, pdc: false, products: false, creditNote: false},
            showGuideModal: false,
            recentExports: [],
        }
    },
    mounted() {
        // Load recent exports from localStorage
        try {
            const saved = localStorage.getItem('sarthi_seller_recent_exports');
            if (saved) {
                this.recentExports = JSON.parse(saved);
            }
        } catch(e) {}

        // Default ranges to 'this_month' for instant 1-click readiness
        const thisMonth = this.getThisMonthRange();
        this.salesDateRange = {startDate: thisMonth[0], endDate: thisMonth[1]};
        this.cashBankDateRange = {startDate: thisMonth[0], endDate: thisMonth[1]};
        this.pdcDateRange = {startDate: thisMonth[0], endDate: thisMonth[1]};
        this.creditNoteDateRange = {startDate: thisMonth[0], endDate: thisMonth[1]};
    },
    methods: {
        applyPreset(rangeKey, presetKey) {
            let range = null;
            if (presetKey === 'today') range = this.getTodayRange();
            else if (presetKey === 'yesterday') range = this.getYesterdayRange();
            else if (presetKey === 'this_week') range = this.getThisWeekRange();
            else if (presetKey === 'this_month') range = this.getThisMonthRange();
            else if (presetKey === 'last_month') range = this.getLastMonthRange();

            if (range) {
                this[rangeKey] = {
                    startDate: range[0],
                    endDate: range[1]
                };
            }
        },
        clearRange(rangeKey) {
            this[rangeKey] = {
                startDate: null,
                endDate: null
            };
        },
        isPresetActive(range, presetKey) {
            if (!range || !range.startDate || !range.endDate) return false;
            let expected = null;
            if (presetKey === 'today') expected = this.getTodayRange();
            else if (presetKey === 'yesterday') expected = this.getYesterdayRange();
            else if (presetKey === 'this_week') expected = this.getThisWeekRange();
            else if (presetKey === 'this_month') expected = this.getThisMonthRange();
            else if (presetKey === 'last_month') expected = this.getLastMonthRange();

            if (!expected) return false;
            return moment(range.startDate).isSame(expected[0], 'day') &&
                   moment(range.endDate).isSame(expected[1], 'day');
        },
        formatDateRange(range) {
            if (!range || !range.startDate || !range.endDate) return '';
            return moment(range.startDate).format('DD MMM YYYY') + ' - ' + moment(range.endDate).format('DD MMM YYYY');
        },
        getRangeDays(range) {
            if (!range || !range.startDate || !range.endDate) return '';
            const days = moment(range.endDate).diff(moment(range.startDate), 'days') + 1;
            return days === 1 ? '1 day' : days + ' days';
        },
        recordRecentExport(record) {
            this.recentExports.unshift(record);
            if (this.recentExports.length > 10) {
                this.recentExports.pop();
            }
            try {
                localStorage.setItem('sarthi_seller_recent_exports', JSON.stringify(this.recentExports));
            } catch(e) {}
        },
        clearRecentExports() {
            this.recentExports = [];
            try {
                localStorage.removeItem('sarthi_seller_recent_exports');
            } catch(e) {}
        },
        downloadXlsx(path, dateRange, fileLabel, flagBag, flagKey, displayName) {
            if (!dateRange.startDate || !dateRange.endDate) {
                return;
            }
            flagBag[flagKey] = true;
            let param = {
                startDate: moment(dateRange.startDate).format('YYYY-MM-DD'),
                endDate: moment(dateRange.endDate).format('YYYY-MM-DD'),
            }
            axios({
                url: this.$sellerApiUrl + path,
                method: 'get',
                params: param,
                responseType: 'blob',
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                const fileName = fileLabel + '_' + param.startDate + '_to_' + param.endDate + '.xlsx';
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                flagBag[flagKey] = false;

                this.recordRecentExport({
                    id: Date.now(),
                    type: displayName || fileLabel,
                    fileLabel: fileLabel,
                    fileName: fileName,
                    dateRange: moment(param.startDate).format('DD MMM YYYY') + ' - ' + moment(param.endDate).format('DD MMM YYYY'),
                    startDate: param.startDate,
                    endDate: param.endDate,
                    path: path,
                    flagKey: flagKey,
                    time: moment().format('DD MMM YYYY, hh:mm A'),
                    status: 'Completed',
                });
            }).catch(() => {
                flagBag[flagKey] = false;
            });
        },
        downloadProductsXlsx() {
            this.downloading.products = true;
            axios({
                url: this.$sellerApiUrl + '/products/export_xlsx',
                method: 'get',
                responseType: 'blob',
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                const fileName = 'Products.xlsx';
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                this.downloading.products = false;

                this.recordRecentExport({
                    id: Date.now(),
                    type: 'Product Master',
                    fileLabel: 'Products',
                    fileName: fileName,
                    dateRange: 'All Master Catalog Products',
                    startDate: null,
                    endDate: null,
                    path: '/products/export_xlsx',
                    flagKey: 'products',
                    time: moment().format('DD MMM YYYY, hh:mm A'),
                    status: 'Completed',
                });
            }).catch(() => {
                this.downloading.products = false;
            });
        },
        redownloadRecent(item) {
            if (item.fileLabel === 'Products') {
                this.downloadProductsXlsx();
                return;
            }
            if (item.startDate && item.endDate) {
                const dummyRange = {
                    startDate: new Date(item.startDate),
                    endDate: new Date(item.endDate)
                };
                this.downloadXlsx(item.path, dummyRange, item.fileLabel, this.downloading, item.flagKey, item.type);
            }
        }
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

/* Base Container */
.export-center-page {
    font-family: inherit;
}

/* Header Container */
.export-header-container {
    margin-bottom: 24px;
}

.export-header-icon-box {
    width: 48px;
    height: 48px;
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.header-icon-svg {
    width: 24px;
    height: 24px;
    display: block;
}

.export-main-title {
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
    margin: 0;
    letter-spacing: -0.2px;
}

.export-sub-title {
    font-size: 13.5px;
    color: #64748b;
    margin-top: 4px;
    line-height: 1.4;
}

/* Header Help Card */
.header-help-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 16px;
    display: inline-flex;
    align-items: center;
    text-align: left;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
}

.header-help-card:hover {
    border-color: #3b82f6;
    background: #f8fafc;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
}

.help-card-icon {
    width: 40px;
    height: 40px;
    background: #eff6ff;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.help-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.25;
}

.help-subtitle {
    font-size: 11.5px;
    color: #64748b;
    margin-top: 2px;
}

/* Tally Status Bar */
.tally-status-bar {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 18px;
}

.tally-tag {
    background: #0f172a;
    color: #ffffff;
    padding: 5px 12px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    font-weight: 800;
    font-size: 12px;
    letter-spacing: 0.8px;
    flex-shrink: 0;
}

.tally-indicator {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    margin-right: 8px;
    box-shadow: 0 0 6px rgba(16, 185, 129, 0.9);
}

.tally-info-text {
    font-size: 13px;
    line-height: 1.4;
}

.format-badge {
    background: #f8fafc;
    color: #334155;
    border: 1px solid #e2e8f0;
    font-size: 11.5px;
    padding: 5px 10px;
    border-radius: 6px;
    font-weight: 600;
}

.verified-badge {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
    font-size: 11.5px;
    padding: 5px 10px;
    border-radius: 6px;
    font-weight: 600;
}

/* Main Card */
.export-main-card {
    border-radius: 16px;
    background: #ffffff;
}

/* Custom Tabs */
::v-deep .export-custom-tabs .nav-item {
    margin-right: 8px;
    margin-bottom: 8px;
}

::v-deep .export-custom-tabs .nav-link {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    color: #475569;
    border-radius: 10px;
    padding: 10px 18px;
    font-weight: 600;
    font-size: 13.5px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
}

::v-deep .export-custom-tabs .nav-link:hover {
    background: #f1f5f9;
    color: #0f172a;
    border-color: #cbd5e1;
}

::v-deep .export-custom-tabs .nav-link.active {
    background: #ecfdf5 !important;
    border-color: #10b981 !important;
    color: #047857 !important;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
}

::v-deep .export-custom-tabs .nav-link.active .tab-icon {
    color: #10b981;
}

.tab-icon {
    font-size: 15px;
    color: #64748b;
}

/* Step Container */
.step-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 20px;
}

.step-circle {
    width: 30px;
    height: 30px;
    background: #10b981;
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
}

.step-heading {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
}

.step-subheading {
    font-size: 12.5px;
    color: #64748b;
}

.field-label {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    display: block;
}

/* Presets & Controls */
.presets-btn-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 42px;
}

.btn-preset {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    color: #475569;
    border-radius: 20px;
    font-size: 12.5px;
    padding: 6px 14px;
    font-weight: 500;
    transition: all 0.18s ease;
    line-height: 1.3;
}

.btn-preset:hover {
    background: #f1f5f9;
    color: #0f172a;
    border-color: #cbd5e1;
}

.btn-preset.active {
    background: #10b981 !important;
    border-color: #10b981 !important;
    color: #ffffff !important;
    font-weight: 600;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.35);
}

.btn-preset-clear {
    background: transparent;
    border: 1px solid transparent;
    color: #ef4444;
    border-radius: 20px;
    font-size: 12.5px;
    padding: 6px 12px;
    font-weight: 500;
    transition: all 0.18s ease;
    line-height: 1.3;
}

.btn-preset-clear:hover {
    background: #fee2e2;
    color: #dc2626;
}

/* Date Range Picker Input */
.date-picker-wrap {
    width: 100%;
}

.date-picker-wrap ::v-deep .vue-daterange-picker {
    width: 100%;
    display: block;
}

.date-picker-wrap ::v-deep .reportrange-text {
    width: 100%;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    height: 42px;
    display: flex;
    align-items: center;
    padding: 0 14px;
    font-size: 13.5px;
    color: #1e293b;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: all 0.15s ease-in-out;
}

.date-picker-wrap ::v-deep .reportrange-text:hover {
    border-color: #94a3b8;
}

.date-picker-wrap ::v-deep .reportrange-text i {
    margin-right: 8px;
    color: #64748b;
}

.date-picker-wrap ::v-deep .reportrange-text b.caret {
    margin-left: auto;
}

/* Summary Box */
.summary-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 14px;
    height: 100%;
    /* common.css turns every `.col-12.col-sm-4` into a flex container (dashboard
       cards rule), which would shrink this box to its text — only the first box
       here is col-sm-4, hence the odd gap. Explicit width keeps all boxes equal. */
    width: 100%;
    min-height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.summary-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 3px;
}

.summary-value {
    font-size: 13.5px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.duration-pill {
    background: #f1f5f9;
    color: #475569;
    font-size: 11px;
    padding: 2px 7px;
    border-radius: 10px;
    font-weight: 600;
}

/* Action Download Button */
.btn-action-download {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    color: #ffffff;
    font-weight: 700;
    font-size: 14px;
    height: 48px;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.btn-action-download:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
    color: #ffffff;
}

.btn-action-download:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
}

/* Tip Box */
.tally-tip-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 16px 20px;
}

.tip-icon {
    width: 36px;
    height: 36px;
    background: #dbeafe;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #2563eb;
    flex-shrink: 0;
}

/* Recent Exports Card & Table */
.recent-exports-card {
    border-radius: 16px;
    overflow: hidden;
}

.recent-header-icon {
    width: 32px;
    height: 32px;
    background: #f1f5f9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
}

.export-table thead th {
    background: #f8fafc;
    color: #475569;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    padding-top: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid #e2e8f0;
}

.export-table tbody td {
    padding-top: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid #f1f5f9;
}

.status-badge-completed {
    background: #dcfce7;
    color: #15803d;
    font-weight: 600;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 20px;
}

.empty-export-icon {
    font-size: 40px;
    color: #cbd5e1;
}

/* Modal Styling */
.guide-step-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 16px;
}

.guide-step-badge {
    width: 22px;
    height: 22px;
    background: #3b82f6;
    color: #ffffff;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    margin-right: 8px;
}

.font-size-12 {
    font-size: 12px;
}
</style>
