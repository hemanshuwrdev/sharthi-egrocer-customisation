<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('wallet_transactions') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="create_new=true">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_transactions') }}</span>
            </button>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getWalletTransactions()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="walletTransactions"
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

                    <template #cell(type)="row">
                        <span v-if="row.item.type === 'credit'" class="badge bg-success">{{ __('credit') }}</span>
                        <span v-else class="badge bg-danger">{{ __('debit') }}</span>
                    </template>

                    <template #cell(transaction_date)="row">
                        {{ row.item.transaction_date }}
                    </template>
                    <template #cell(updated_at)="row">
                        {{ row.item.updated_at }}
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

        <!-- Add / Edit -->
        <app-edit-record
            v-if="create_new || edit_record"
            :record="edit_record"
            :customers="customers"
            @modalClose="hideModal()"
        ></app-edit-record>
    </div>
</template>
<script>
import EditRecord from './Edit';

export default {
    components: {
        'app-edit-record': EditRecord,
    },
    data: function () {
        return {
            fields: [
                {key: 'id', label:  __('id') , sortable: true, sortDirection: 'desc'},
                {key: 'user_id', label:  __('user_id'), sortable: true, class: 'text-center'},
                {key: 'name', label:  __('user_name'), sortable: true, class: 'text-center'},
                {key: 'type', label:  __('type'), sortable: true, class: 'text-center'},
                {key: 'payment_type', label:  __('payment_type'), sortable: true, class: 'text-center'},
                {key: 'txn_id', label:  __('txn_id'), sortable: true, class: 'text-center'},
                {key: 'amount', label:  __('amount'), sortable: true, class: 'text-center'},
                {key: 'message', label:  __('message'), sortable: true, class: 'text-center'},
                {key: 'transaction_date', label:  __('transaction_date'), sortable: true, class: 'text-center'},
                {key: 'updated_at', label:  __('last_updated'), sortable: true, class: 'text-center'}
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
            create_new: null,
            edit_record: null,

            customers: null,
            walletTransactions: [],
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
        this.totalRows = this.walletTransactions.length
    },
    created: function () {
        this.$eventBus.$on('walletTransactionsSaved', (message) => {
            //this.showSuccess(message);
            this.showMessage("success", message);
            this.getWalletTransactions();
            this.create_new = null;
        });
        this.getWalletTransactions();
    },
    methods: {
        getWalletTransactions() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/wallet_transactions')
                .then((response) => {
                    this.isLoading = false
                    this.walletTransactions = response.data.data.walletTransactions;
                    this.customers = response.data.data.customers;
                    this.totalRows = this.walletTransactions.length
                });
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false
        },
    }
};
</script>
