<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('export_center') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('export_center') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-body">
                        <b-tabs content-class="mt-3">

                            <b-tab :title="__('sales_invoice_export')" active>
                                <b-row class="mb-2 ms-1">
                                    <b-col md="4">
                                        <h6 class="box-title">{{ __('from_and_to_date') }}</h6>
                                        <div class="d-flex justify-content-center align-items-center">
                                            <date-range-picker
                                                :append-to-body="true"
                                                :single-date-picker="'range'"
                                                :locale-data="dateRangePickerLocale"
                                                :ranges="dateRangePickerRanges"
                                                :autoApply=false
                                                :showDropdowns="true"
                                                v-model="salesDateRange"
                                                :maxDate="maxDate"
                                            ></date-range-picker>
                                            <button class="btn btn-sm btn-danger ml-1" @click="salesDateRange.startDate = null, salesDateRange.endDate = null">
                                                {{ __('clear') }}
                                            </button>
                                        </div>
                                    </b-col>
                                    <b-col md="2" class="d-flex align-items-end">
                                        <button class="btn btn-primary" :disabled="!salesDateRange.startDate || !salesDateRange.endDate || downloading.sales"
                                            @click="downloadXlsx('/orders/export_csv', salesDateRange, 'Sales', downloading, 'sales')">
                                            <i class="fa fa-download" aria-hidden="true"></i>
                                            {{ downloading.sales ? __('loading') + '...' : __('download_xlsx') }}
                                        </button>
                                    </b-col>
                                </b-row>
                            </b-tab>

                            <b-tab :title="__('receipt_cash_export')">
                                <b-row class="mb-2 ms-1">
                                    <b-col md="4">
                                        <h6 class="box-title">{{ __('from_and_to_date') }}</h6>
                                        <div class="d-flex justify-content-center align-items-center">
                                            <date-range-picker
                                                :append-to-body="true"
                                                :single-date-picker="'range'"
                                                :locale-data="dateRangePickerLocale"
                                                :ranges="dateRangePickerRanges"
                                                :autoApply=false
                                                :showDropdowns="true"
                                                v-model="cashBankDateRange"
                                                :maxDate="maxDate"
                                            ></date-range-picker>
                                            <button class="btn btn-sm btn-danger ml-1" @click="cashBankDateRange.startDate = null, cashBankDateRange.endDate = null">
                                                {{ __('clear') }}
                                            </button>
                                        </div>
                                    </b-col>
                                    <b-col md="2" class="d-flex align-items-end">
                                        <button class="btn btn-primary" :disabled="!cashBankDateRange.startDate || !cashBankDateRange.endDate || downloading.cashBank"
                                            @click="downloadXlsx('/receipts/cash/export_csv', cashBankDateRange, 'ReceiptCashBank', downloading, 'cashBank')">
                                            <i class="fa fa-download" aria-hidden="true"></i>
                                            {{ downloading.cashBank ? __('loading') + '...' : __('download_xlsx') }}
                                        </button>
                                    </b-col>
                                </b-row>
                            </b-tab>

                            <b-tab :title="__('receipt_pdc_export')">
                                <b-row class="mb-2 ms-1">
                                    <b-col md="4">
                                        <h6 class="box-title">{{ __('from_and_to_date') }}</h6>
                                        <div class="d-flex justify-content-center align-items-center">
                                            <date-range-picker
                                                :append-to-body="true"
                                                :single-date-picker="'range'"
                                                :locale-data="dateRangePickerLocale"
                                                :ranges="dateRangePickerRanges"
                                                :autoApply=false
                                                :showDropdowns="true"
                                                v-model="pdcDateRange"
                                                :maxDate="maxDate"
                                            ></date-range-picker>
                                            <button class="btn btn-sm btn-danger ml-1" @click="pdcDateRange.startDate = null, pdcDateRange.endDate = null">
                                                {{ __('clear') }}
                                            </button>
                                        </div>
                                    </b-col>
                                    <b-col md="2" class="d-flex align-items-end">
                                        <button class="btn btn-primary" :disabled="!pdcDateRange.startDate || !pdcDateRange.endDate || downloading.pdc"
                                            @click="downloadXlsx('/receipts/pdc/export_csv', pdcDateRange, 'ReceiptPDC', downloading, 'pdc')">
                                            <i class="fa fa-download" aria-hidden="true"></i>
                                            {{ downloading.pdc ? __('loading') + '...' : __('download_xlsx') }}
                                        </button>
                                    </b-col>
                                </b-row>
                            </b-tab>

                            <b-tab :title="__('product_master_export')">
                                <p class="text-muted">{{ __('product_master_export_hint') }}</p>
                                <button class="btn btn-primary" :disabled="downloading.products" @click="downloadProductsXlsx()">
                                    <i class="fa fa-download" aria-hidden="true"></i>
                                    {{ downloading.products ? __('loading') + '...' : __('download_xlsx') }}
                                </button>
                            </b-tab>

                            <b-tab :title="__('credit_note_export')">
                                <b-row class="mb-2 ms-1">
                                    <b-col md="4">
                                        <h6 class="box-title">{{ __('from_and_to_date') }}</h6>
                                        <div class="d-flex justify-content-center align-items-center">
                                            <date-range-picker
                                                :append-to-body="true"
                                                :single-date-picker="'range'"
                                                :locale-data="dateRangePickerLocale"
                                                :ranges="dateRangePickerRanges"
                                                :autoApply=false
                                                :showDropdowns="true"
                                                v-model="creditNoteDateRange"
                                                :maxDate="maxDate"
                                            ></date-range-picker>
                                            <button class="btn btn-sm btn-danger ml-1" @click="creditNoteDateRange.startDate = null, creditNoteDateRange.endDate = null">
                                                {{ __('clear') }}
                                            </button>
                                        </div>
                                    </b-col>
                                    <b-col md="2" class="d-flex align-items-end">
                                        <button class="btn btn-primary" :disabled="!creditNoteDateRange.startDate || !creditNoteDateRange.endDate || downloading.creditNote"
                                            @click="downloadXlsx('/credit-notes/export_csv', creditNoteDateRange, 'CreditNote', downloading, 'creditNote')">
                                            <i class="fa fa-download" aria-hidden="true"></i>
                                            {{ downloading.creditNote ? __('loading') + '...' : __('download_xlsx') }}
                                        </button>
                                    </b-col>
                                </b-row>
                            </b-tab>

                        </b-tabs>
                    </div>
                </div>
            </section>
        </div>
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
        }
    },
    methods: {
        downloadXlsx(path, dateRange, fileLabel, flagBag, flagKey) {
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
                link.setAttribute('download', fileLabel + '_' + param.startDate + '_to_' + param.endDate + '.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                flagBag[flagKey] = false;
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
                link.setAttribute('download', 'Products.xlsx');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                this.downloading.products = false;
            }).catch(() => {
                this.downloading.products = false;
            });
        },
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
