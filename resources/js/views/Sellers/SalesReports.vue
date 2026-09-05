<template>
    <div>
        <div class="list-page">
            <div class="page-head">
                <h3 class="page-head-title">{{ __('sales_reports') }}</h3>
            </div>

            <div class="list-surface">
                <div class="list-toolbar">
                    <div>
                        <select name="category" id="category" v-model="category" @change="getSalesReports()"
                                class="form-control form-select">
                            <option value="">{{ __('select_category') }}</option>
                            <option v-for="category in categories" :value="category.id">{{ category.name }}
                            </option>
                        </select>
                    </div>
                    <div class="d-flex justify-content-center align-items-center">
                        <date-range-picker
                            :append-to-body="true"
                            :single-date-picker="'range'"
                            :locale-data="dateRangePickerLocale"
                            :ranges="dateRangePickerRanges"
                            :autoApply=false
                            :showDropdowns = true
                            v-model="dateRange"
                            :maxDate="maxDate"
                            @update="getSalesReports"
                        ></date-range-picker>
                        <button class="btn btn-sm btn-danger ml-1" @click="dateRange.startDate = null, dateRange.endDate = null, getSalesReports()">
                            {{ __('clear') }}
                        </button>
                    </div>
                    <div class="list-search">
                        <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                        <b-form-input
                            id="filter-input"
                            v-model="filter"
                            type="search"
                            :placeholder="__('search')"
                        ></b-form-input>
                    </div>
                    <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getSalesReports()">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="table-responsive">
                    <b-table
                                :items="salesReports"
                                :fields="fields"
                                :current-page="currentPage"
                                :per-page="perPage"
                                :filter="filter"
                                :filter-included-fields="filterOn"
                                :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc"
                                :sort-direction="sortDirection"
                                :bordered="true"
                                :busy="isLoading"
                                stacked="md"
                                show-empty
                                small>
                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>

                                <template #cell(created_at)="row">
                                    {{ new Date(row.item.created_at).toLocaleString() }}
                                </template>
                            </b-table>
                        </div>
                        <div class="text-success h6 m-3">{{ __('total_amount') }} :-  {{ $currency }} {{ final_total_sum }}</div>

                <div class="list-footer">
                    <div class="list-perpage">
                        <b-form-group
                            :label="__('per_page')"
                            label-for="per-page-select"
                            label-align-sm="right"
                            label-size="sm"
                            class="mb-0">
                            <b-form-select
                                id="per-page-select"
                                v-model="perPage"
                                :options="pageOptions"
                                size="sm"
                                class="form-control form-select"
                            ></b-form-select>
                        </b-form-group>
                    </div>
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="list-pagination"
                    ></b-pagination>
                </div>
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
    components: {DateRangePicker},
    data: function () {
        return {
            dateRange: {startDate:null, endDate:null},
            maxDate: new Date(),
            seller: "",
            category: "",
            fields: [
                {key: 'id', label: __('order_item_id'), sortable: true, sortDirection: 'desc'},
                {key: 'user_name', label: __('user'), sortable: true, class: 'text-center'},
                {key: 'product_name', label: __('product'), sortable: true, class: 'text-center'},
                {key: 'mobile', label: __('mobile'), sortable: true, class: 'text-center'},
                {key: 'sub_total', label: __('total') + '('+ this.$currency +')', sortable: true, class: 'text-center'},
                {key: 'added_date', label: __('date'), sortable: true, class: 'text-center'}
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
            salesReports: [],
            final_total_sum: 0,
            sellers: null,
            categories: null
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return {text: f.label, value: f.key}
                })
        }
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.salesReports.length
    },
    created: function () {
        this.getSalesReports();
    },
    methods: {
        getSalesReports() {
            this.isLoading = true;
            let param = {
                "startDate": (this.dateRange.startDate != null) ? moment(this.dateRange.startDate).format('YYYY-MM-DD'):"",
                "endDate": (this.dateRange.endDate != null) ? moment(this.dateRange.endDate).format('YYYY-MM-DD'):"",
                "seller": this.seller,
                "category": this.category
            }
            axios.get(this.$sellerApiUrl + '/sales_reports', {
                params: param
            }).then((response) => {
                this.isLoading = false
                this.sellers = response.data.data.sellers;
                this.categories = response.data.data.categories;
                this.salesReports = response.data.data.salesReports;
                this.final_total_sum = this.salesReports.map(item => item.sub_total).reduce((prev, curr) => prev + curr, 0);
                this.totalRows = this.salesReports.length
            });
        },
    }
};
</script>

<style scoped>
@import "../../../../node_modules/vue2-daterange-picker/dist/vue2-daterange-picker.css";
.list-toolbar > .d-flex {
    flex-shrink: 0;
}
</style>
