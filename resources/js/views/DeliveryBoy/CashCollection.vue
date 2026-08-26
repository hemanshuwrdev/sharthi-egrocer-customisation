<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('cash_collection_list') }}</h3>
        </div>

        <div class="row">
            <div class="col-6 col-lg-3 col-md-6 col-xl-8 col-xxl-4">
                <div class="card">
                        <div class="card-body px-3 py-4-5">
                            <div class="row">
                                <div class="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start">
                                    <div class="stats-icon purple mb-2">
                                        <i class="fa fa-handshake-o"></i>
                                    </div>
                                </div>
                                <div class="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                                    <h5 class="text-muted font-semibold">{{ __('cash_in_hand') }}</h5>
                                    <h3 class="font-extrabold mb-0">{{ $currency+" "+cash_in_hand }}</h3>
                                </div>
                            </div>
                        </div>

                </div>
            </div>
            <div class="col-6 col-lg-3 col-md-6 col-xl-8 col-xxl-4">
                <div class="card">
                    <div class="card-body px-3 py-4-5">
                        <div class="row">
                            <div class="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start">
                                <div class="stats-icon green mb-2">
                                    <i class="fa fa-money"></i>
                                </div>
                            </div>
                            <div class="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                                <h5 class="text-muted font-semibold">{{ __('cash_collected') }}</h5>
                                <h3 class="font-extrabold mb-0">{{ $currency+" "+Math.abs(cash_collected) }}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <b-col md="3">
                    <h6 class="box-title">{{ __('from_and_to_date') }}</h6>
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
                            @update="getTransactions"
                        ></date-range-picker>
                        <button class="btn btn-sm btn-danger ml-1" @click="dateRange.startDate = null, dateRange.endDate = null, getTransactions()">
                            {{ __('clear') }}
                        </button>
                    </div>
                </b-col>

                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input
                        id="filter-input"
                        v-model="filter"
                        type="search"
                        :placeholder="__('search')"
                    ></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getTransactions()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="transactions"
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
                     <template #cell(amount)="row">
                        <span v-if="row.item.type === __('delivery_boy_cash_collection')">{{row.item.collected_amount}}</span>
                        <span v-else >{{row.item.amount}}</span>
                    </template>
                    <template #head(amount)="row">
                        {{ __('amount') }}{{' ('+$currency+')' }}
                    </template>
                    <template #cell(created_at)="row">
                        {{ row.item.transaction_date }}
                    </template>
                     <template #cell(status)="row">
                        <div class="badge bg-success">
                        {{ row.item.status }}
                        </div>
                    </template>
                </b-table>
            </div>

            <b-row>
                <div class="col-md-4 text-success h6">{{ __('total_amount') }} :- {{ $currency }} {{ total_amount }}</div>
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
import DateRangePicker from 'vue2-daterange-picker'
import DateRangePickerMixin from '../../mixins/DateRangePickerMixin';
import moment from "moment";
export default {
    name: "range_dates",
    mixins: [DateRangePickerMixin],
    components: {DateRangePicker},
    data: function () {
        return {
            dateRange: {startDate:null, endDate:null},
            maxDate : new Date(),
            fields: [
                {key: 'id', label: __('id'), sortable: true, sortDirection: 'desc'},
                {key: 'order_id', label: __('order_id'), sortable: true, class: 'text-center'},
                 {key: 'message', label: __('message'), sortable: true, class: 'text-center'},
                {key: 'amount', label: __('amount'), sortable: true, class: 'text-center'},
                {key: 'status', label: __('status'), sortable: true, class: 'text-center'},
                {key: 'transaction_date', label: __('date_time'), sortable: true, class: 'text-center'}
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
            max_visible_units: 12,
            max_col_in_single_row: 3,

            transactions: [],
            cash_in_hand:0,
            cash_collected:0,
            total_amount:0
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
        this.totalRows = this.transactions.length
    },
    created: function () {
        this.$eventBus.$on('transactionsSaved', (message) => {
            this.showMessage("success", message);
            this.getTransactions();
            this.create_new = null;
        });
        this.getTransactions();
    },
    methods: {
        getTransactions() {
            this.isLoading = true
            let param = {
                "startDate": (this.dateRange.startDate != null) ? moment(this.dateRange.startDate).format('YYYY-MM-DD'):"",
                "endDate": (this.dateRange.endDate != null) ? moment(this.dateRange.endDate).format('YYYY-MM-DD'):"",
            }
            axios.get(this.$deliveryBoyApiUrl + '/cash_collection',{
                params: param
            }).then((response) => {
                this.transactions = response.data.data.transactions;
                this.cash_in_hand = response.data.data.cash_in_hand;
                this.cash_collected = response.data.data.cash_collected;

                this.totalRows = this.transactions.length;
                this.total_amount = this.transactions.map(item => item.amount).reduce((prev, curr) => prev + curr, 0).toFixed(2);

                this.isLoading = false;
            });
        },
    }
};
</script>
<style>
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
