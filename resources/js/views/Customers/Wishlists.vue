<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('wishlists') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getWishlists()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    :items="wishlists"
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
                        {{ new Date(row.item.created_at).toLocaleString()  }}
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <router-link v-if="row.item.master_product_id"
                                :to="{ name: 'EditMasterProduct', params: { id: row.item.master_product_id } }"
                                class="list-action-btn is-view" v-b-tooltip.hover :title="__('view')">
                                <i class="fa fa-eye"></i>
                            </router-link>
                            <router-link v-else-if="row.item.product_id"
                                :to="'manage_products/view/' + row.item.product_id"
                                class="list-action-btn is-view" v-b-tooltip.hover :title="__('view')">
                                <i class="fa fa-eye"></i>
                            </router-link>
                        </div>
                    </template>

                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"
                            class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill"
                    size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'product_name', label: __('product'), sortable: true, class: 'text-center' },
                { key: 'total_qty', label: __('quantity'), sortable: true, class: 'text-center' },
                { key: 'seller_name', label: __('seller'), sortable: true, class: 'text-center' },
                { key: 'actions', label: __('actions') }
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
            wishlists: [],
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
        this.totalRows = this.wishlists.length
    },
    created: function() {
        this.getWishlists();
    },
    methods: {
        getWishlists(){
            this.isLoading = true
            axios.get(this.$apiUrl + '/wishlists')
                .then((response) => {
                    this.isLoading = false
                    this.wishlists = response.data.data;
                    this.totalRows = this.wishlists.length
                });
        },
    }
};
</script>
