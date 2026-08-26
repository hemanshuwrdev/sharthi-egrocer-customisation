<template>
    <div>
        <div class="list-page">
            <div class="page-head">
                <h3 class="page-head-title">{{ __('return_requests') }}</h3>
            </div>

            <div class="list-surface">
                <div class="list-toolbar">
                    <div class="list-search">
                        <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                        <b-form-input id="filter-input" v-model="filter" type="search"
                            :placeholder="__('search')"></b-form-input>
                    </div>
                    <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                        @click="getReturnRequests()">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="table-responsive">
                    <b-table :items="returnRequestsForTable" :fields="fields" :current-page="currentPage"
                                :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                                :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                                :bordered="true" :busy="isLoading" stacked="md" show-empty small>

                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>

                                <template #head(price)="row">
                                    {{ 'Price (' + $currency + ')' }}
                                </template>
                                <template #head(discounted_price)="row">
                                    {{ 'Discounted Price (' + $currency + ')' }}
                                </template>

                                <template #cell(status)="row">
                                    <span v-if="row.item.status === 0" class="badge bg-warning">{{ __('pending')
                                        }}</span>
                                    <span v-else-if="row.item.status === 1" class="badge bg-success">{{ __('approved')
                                        }}</span>
                                    <span v-else-if="row.item.status === 2" class="badge bg-danger">{{ __('cancelled')
                                        }}</span>
                                    <span v-else class="badge bg-danger">{{ __('undefine') }}</span>
                                </template>
                                <template #cell(created_at)="row">
                                    {{ new Date(row.item.created_at).toLocaleString() }}
                                </template>
                                <template #cell(customer_name)="row">
                                    {{ row.item.customer_name }}
                                </template>
                                <template #cell(product_name)="row">
                                    {{ row.item.product_name }}
                                </template>
                                <template #cell(variant_name)="row">
                                    {{ row.item.variant_name }}
                                </template>
                                <template #cell(actions)="row">
                                    <div class="list-actions">
                                        <button class="list-action-btn is-edit" @click="edit_record = row.item"
                                            v-b-tooltip.hover :title="__('edit')"
                                            v-if="$can('return_request_update')"><i class="fa fa-pencil-alt"></i></button>
                                        <button class="list-action-btn is-delete"
                                            @click="deleteReturnRequests(row.index, row.item.id)"
                                            v-b-tooltip.hover :title="__('delete')"
                                            v-if="$can('return_request_delete')"><i class="fa fa-trash"></i></button>
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
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'user_id', label: __('user_id'), sortable: true, class: 'text-center' },
                { key: 'customer_name', label: __('name'), sortable: true, class: 'text-center' },
                { key: 'product_name', label: __('product_name'), sortable: true, class: 'text-center' },
                { key: 'variant_name', label: __('variant_name'), sortable: true, class: 'text-center' },
                { key: 'price', label: __('price'), sortable: true, class: 'text-center' },
                { key: 'discounted_price', label: __('discounted_price'), sortable: true, class: 'text-center' },
                { key: 'quantity', label: __('quantity'), sortable: true, class: 'text-center' },
                { key: 'balance', label: __('balance'), sortable: true, class: 'text-center' },
                { key: 'status', label: __('status'), sortable: true, class: 'text-center' },
                { key: 'created_at', label: __('date'), sortable: true, class: 'text-center' }
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
            returnRequests: [],
        }
    },
    computed: {
        returnRequestsForTable() {
            return this.returnRequests || [];
        },
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
        this.totalRows = this.returnRequests.length
    },
    created: function () {
        this.getReturnRequests();
    },
    methods: {

        getReturnRequests() {
            this.isLoading = true
            axios.get(this.$sellerApiUrl + '/return_requests')
                .then((response) => {
                    this.returnRequests = response.data.data;
                    this.totalRows = this.returnRequests.length;
                    this.isLoading = false;
                });
        },
    }
};
</script>
