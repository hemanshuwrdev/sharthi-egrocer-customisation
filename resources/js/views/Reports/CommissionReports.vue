<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('commission_reports') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div>
                    <h6 class="box-title">{{ __('from_to_date') }}</h6>
                    <div class="d-flex justify-content-center align-items-center">
                        <date-range-picker
                            :append-to-body="true"
                            :single-date-picker="'range'"
                            :autoApply=false
                            :showDropdowns=true
                            v-model="dateRange"
                            :maxDate="maxDate"
                            @update="getCommissionReports"
                            :locale-data="dateRangePickerLocale"
                            :ranges="dateRangePickerRanges"
                        ></date-range-picker>
                        <button class="btn btn-sm btn-danger ml-1" @click="dateRange.startDate = null, dateRange.endDate = null, getCommissionReports()">
                            {{ __('clear') }}
                        </button>
                    </div>
                </div>
                <div>
                    <h6 class="box-title" for="seller">{{ __('seller') }}</h6>
                    <select name="seller" id="seller" v-model="seller" @change="getCommissionReports()"
                            class="form-control form-select">
                        <option value="">{{ __('select_seller') }}</option>
                        <option v-for="seller in sellers" :value="seller.id">{{ seller.name }}</option>
                    </select>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getCommissionReports()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="commissionReports"
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
                </b-table>
            </div>
            <b-row>
                <div class="col-md-4 text-success h6">{{ __('total_commission') }} :- {{ $currency }} {{ total_commission.toFixed(2) }}</div>
            </b-row>

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
</template>
<script>
import DateRangePicker from 'vue2-daterange-picker';
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';
import moment from "moment";

export default {
    name: "commission_reports",
    mixins: [DateRangePickerMixin],
    components: {DateRangePicker},
    data: function () {
        return {
            dateRange: {startDate: null, endDate: null},
            maxDate: new Date(),
            seller: "",
            fields: [
                {key: 'order_id', label: __('order_id'), sortable: true, sortDirection: 'desc'},
                {key: 'order_item_id', label: __('order_item_id'), sortable: true, class: 'text-center'},
                {key: 'seller_name', label: __('seller'), sortable: true, class: 'text-center'},
                {key: 'order_item_amount', label: __('order_item_amount') + ' (' + this.$currency + ')', sortable: true, class: 'text-center'},
                {key: 'seller_commission_percentage', label: __('commission') + ' (%)', sortable: true, class: 'text-center'},
                {key: 'commission_amount', label: __('commission_amount') + ' (' + this.$currency + ')', sortable: true, class: 'text-center'},
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
            isLoading: false,
            commissionReports: [],
            total_commission: 0,
            sellers: null,
        }
    },
    computed: {
        sortOptions() {
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return {text: f.label, value: f.key}
                })
        }
    },
    mounted() {
        this.totalRows = this.commissionReports.length
    },
    created: function () {
        this.getCommissionReports();
    },
    methods: {
        getCommissionReports() {
            this.isLoading = true;
            let param = {
                "startDate": (this.dateRange.startDate != null) ? moment(this.dateRange.startDate).format('YYYY-MM-DD') : "",
                "endDate": (this.dateRange.endDate != null) ? moment(this.dateRange.endDate).format('YYYY-MM-DD') : "",
                "seller": this.seller,
            }
            axios.get(this.$apiUrl + '/commission_reports', {
                params: param
            }).then((response) => {
                this.isLoading = false;
                this.sellers = response.data.data.sellers;
                this.commissionReports = response.data.data.commissionReports;
                this.total_commission = this.commissionReports.map(item => parseFloat(item.commission_amount)).reduce((prev, curr) => prev + curr, 0) || 0;
                this.totalRows = this.commissionReports.length;
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
