<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('fund_transfers') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="create_new=true" v-if="$can('fund_transfers_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_fund_transfers') }}</span>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getFundTransfers()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="fundTransfers"
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
                    <template #head(opening_balance)="row">
                        {{__('opening_balance') + ' ('+$currency+')' }}
                    </template>
                    <template #head(closing_balance)="row">
                        {{__('closing_balance') + ' ('+$currency+')' }}
                    </template>
                    <template #head(amount)="row">
                        {{__('amount') + ' ('+$currency+')' }}
                    </template>

                    <template #cell(type)="row">
                        <span v-if="row.item.type === 'credit'" class="badge bg-success">{{ __('credit') }}</span>
                        <span v-else class="badge bg-danger">{{ __('debit') }}</span>
                    </template>

                    <template #cell(status)="row">
                        <span v-if="row.item.status === '1'" class="badge bg-success">{{ __('active') }}</span>
                        <span v-else class="badge bg-danger">{{ __('deactive') }}</span>
                    </template>

                    <template #cell(created_at)="row">
                        {{ row.item.created_at }}
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

    data: function () {
        return {
            fields: [
                {key: 'id', label: __('id'), sortable: true, sortDirection: 'desc'},
                {key: 'opening_balance', label: __('opening_balance'), sortable: true, class: 'text-center'},
                {key: 'closing_balance', label: __('closing_balance'), sortable: true, class: 'text-center'},
                {key: 'amount', label: __('amount'), sortable: true, class: 'text-center'},
                {key: 'type', label: __('type'), sortable: true, class: 'text-center'},
                {key: 'message', label: __('message'), sortable: true, class: 'text-center'},
                {key: 'status', label: __('status'), sortable: true, class: 'text-center'},
                {key: 'created_at', label: __('date_created'), sortable: true, class: 'text-center'}
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

            fundTransfers: [],
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
        this.totalRows = this.fundTransfers.length
    },
    created: function () {
        this.getFundTransfers();
    },
    methods: {
        getFundTransfers() {
            this.isLoading = true
            axios.get(this.$deliveryBoyApiUrl + '/fund_transfers')
                .then((response) => {
                    this.isLoading = false
                    this.fundTransfers = response.data.data;
                    this.totalRows = this.fundTransfers.length;
                    this.isLoading = false;
                });
        },
    }
};
</script>
