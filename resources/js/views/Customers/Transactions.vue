<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('transactions') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
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
                    <template #head(amount)="row">
                        {{__('amount') }} ({{$currency}})
                    </template>
                    <template #cell(transaction_date)="row">
                        {{ row.item.transaction_date }}
                    </template>
                </b-table>
            </div>

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
export default {
    data: function() {
        return {
            fields: [
                { key: 'id', label:  __('id') , sortable: true, sortDirection: 'desc' },
                { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
                { key: 'order_id', label: __('order_id'), sortable: true, class: 'text-center' },
                { key: 'type', label: __('type'), sortable: true, class: 'text-center' },
                { key: 'txn_id', label: __('txn_id'), sortable: true, class: 'text-center' },
                { key: 'amount', label: __('amount'), sortable: true, class: 'text-center' },
                { key: 'message', label: __('message'), sortable: true, class: 'text-center' },
                { key: 'transaction_date', label: __('transaction_date'), sortable: true, class: 'text-center' },
                { key: 'status', label: __('status'), sortable: true, class: 'text-center' }
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
            sectionStyle : 'style_1',
            max_visible_units : 12,
            max_col_in_single_row : 3,
            transactions: [],
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
        this.totalRows = this.transactions.length
    },
    created: function() {
        this.getTransactions();
    },
    methods: {
        getTransactions(){
            this.isLoading = true
            axios.get(this.$apiUrl + '/transactions')
                .then((response) => {
                    this.isLoading = false
                    this.transactions = response.data.data;
                    this.totalRows = this.transactions.length
                });
        },
    }
};
</script>
