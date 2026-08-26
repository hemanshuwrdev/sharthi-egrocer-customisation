<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('product_sales_reports') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <!-- DATE FILTER -->
                <div>
                    <h6 class="box-title">{{ __('from_to_date') }}</h6>

                    <div class="d-flex align-items-center w-100">
                        <date-range-picker
                            class="flex-grow-1"
                            :single-date-picker="'range'"
                            :locale-data="dateRangePickerLocale"
                            :ranges="dateRangePickerRanges"
                            :autoApply="false"
                            :showDropdowns="true"
                            v-model="dateRange"
                            :maxDate="maxDate"
                            opens="right"
                            append-to-body
                            @update="getProductSalesReports"
                        ></date-range-picker>

                        <button class="btn btn-sm btn-danger ms-2">
                            {{ __('clear') }}
                        </button>
                    </div>
                </div>

                <!-- SEARCH + REFRESH -->
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input
                        v-model="filter"
                        type="search"
                        :placeholder="__('search')"
                    ></b-form-input>
                </div>
                <button
                    class="list-icon-btn"
                    v-b-tooltip.hover
                    :title="__('refresh')"
                    @click="getProductSalesReports()"
                >
                    <i class="fa fa-refresh"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table :items="productSalesReports" :fields="fields" :current-page="currentPage"
                    :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                    :bordered="true" :busy="isLoading" stacked="md" show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                </b-table>

            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                            size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';
import moment from "moment";
export default {
    name: "range_dates",
    mixins: [DateRangePickerMixin],
    components: { DateRangePicker },
    data: function () {
        return {
            dateRange: { startDate: null, endDate: null },
            maxDate: new Date(),
            fields: [
                { key: 'product_name', label: __('product_name'), sortable: true, class: 'text-center' },
                { key: 'seller_name', label: __('seller_name'), sortable: true, class: 'text-center' },
                { key: 'seller_id', label: __('seller_id'), sortable: true, sortDirection: 'desc' },
                { key: 'product_variant_id', label: __('product_variant_id'), sortable: true, sortDirection: 'desc' },
                { key: 'variant_name', label: __('unit_of_measure'), sortable: true, class: 'text-center' },
                { key: 'total_sales', label: __('total_units_sold'), sortable: true, class: 'text-center' },
                { key: 'total_price', label: __('total_sales'), sortable: true, class: 'text-center' }
            ],
            totalRows: 1,
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
            productSalesReports: []
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        }
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.productSalesReports.length
    },
    created: function () {
        this.getProductSalesReports();
    },
    methods: {
        downloadExcel() {
            this.isLoading = true;
            let postData = {
                order_id: this.id,
            }
            axios({
                url: this.$apiUrl + '/sales_reports/export_excel',
                method: 'get',
                responseType: 'blob',
            }).then((response) => {
                this.isLoading = false;

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'sales_report.csv'); // Set the download file name
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            }).catch(error => {
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                this.isLoading = false;
            });
        },
        exportToCSV() {
            let customHeaders = [
                'Product Name',
                'Seller Name',
                'Seller ID',
                'Product Variant ID',
                'Unit of Measure',
                'Total Units Sold',
                'Total Sales'
            ];
            const csvData = this.convertToCSV(this.productSalesReports, customHeaders);
            const blob = new Blob([csvData], { type: 'text/csv' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'product_sales_reports.csv';
            link.click();
        },
        convertToCSV(data) {
            let csv = '';
            let headers = Object.keys(this.fields.reduce((acc, cur) => {
                acc[cur.key] = true;
                return acc;
            }, {}));
            csv += headers.join(',') + '\n';
            // Rows
            data.forEach(item => {
                let row = headers.map(field => {
                    let value = item[field];
                    // Ensure values are properly formatted for CSV
                    if (typeof value === 'string') {
                        value = '"' + value.replace(/"/g, '""') + '"';
                    }
                    return value;
                });
                csv += row.join(',') + '\n';
            });
            return csv;
        },
        getProductSalesReports() {
            this.isLoading = true;
            let param = {
                "startDate": (this.dateRange.startDate != null) ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : "",
                "endDate": (this.dateRange.endDate != null) ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : "",
            }
            axios.get(this.$apiUrl + '/product_sales_reports/', {
                params: param
            }).then((response) => {
                this.isLoading = false;
                this.productSalesReports = response.data.data;
                this.totalRows = this.productSalesReports.length;
            });
        },
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";

</style>
