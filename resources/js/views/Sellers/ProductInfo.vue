<template>
    <div>
        <div class="list-page">
            <div class="page-head">
                <h3 v-if="type === 'sold_out'" class="page-head-title">{{ __('sold_out_products_list') }}</h3>
                <h3 v-if="type === 'low_stock'" class="page-head-title">{{ __('low_stock_products_list') }}</h3>
                <h3 v-if="type === 'packet_products'" class="page-head-title">{{ __('packet_stock_products_list') }}</h3>
                <h3 v-if="type === 'loose_products'" class="page-head-title">{{ __('loose_stock_products_list') }}</h3>
                <router-link to="/seller/manage_products/create"
                    class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    <span>{{ __('add_product') }}</span>
                </router-link>
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
                    <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getProducts()">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="table-responsive">
                    <b-table
                                :items="products"
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
                                <template #cell(seller_name)="row">
                                    {{ row.item.seller_name }}
                                </template>
                                <template #cell(image)="row">
                                    <img :src="$storageUrl + row.item.image" height="50" v-if="row.item.image"/>
                                </template>
                                <template #cell(actions)="row">
                                    <div class="list-actions">
                                        <router-link
                                            :to="{ name: 'SellerMyProducts', query: { master_product_id: row.item.product_id } }"
                                            v-b-tooltip.hover :title="__('view_product')" class="list-action-btn is-view"><i
                                            class="fa fa-eye"></i></router-link>
                                    </div>
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
    </div>
</template>
<script>
import axios from "axios";

export default {
    data: function () {
        return {
            category: "",
            // Same columns as Dashboard ProductInfo: id, product_id, seller_name, name, image, price, discounted_price, actions
            fields: [
                {key: 'product_variant_id', label: __('id'), sortable: true, sortDirection: 'desc'},
                {key: 'product_id', label: __('product_id'), sortable: true, sortDirection: 'desc'},
                {key: 'seller_name', label: __('seller_name'), class: 'text-center', sortable: true},
                {key: 'name', label: __('name'), sortable: true, class: 'text-center'},
                {key: 'image', label: __('image'), class: 'text-center'},
                {key: 'price', label: __('price'), class: 'text-center', sortable: true},
                {key: 'discounted_price', label: __('discounted_price'), class: 'text-center', sortable: true},
                {key: 'actions', label: __('actions'), class: 'text-center' }
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
            products: null,
            type: null
        }
    },
    created: function () {
        this.type = this.$route.params.type;
        if (this.type) {
            this.getProducts();
        }

    },
    methods: {
        getProducts() {
            this.isLoading = true;
            let param = {
                "category": this.category,
                "type": this.type
            }
            axios.get(this.$sellerApiUrl + '/products/product_info', {
                params: param
            }).then((response) => {
                this.isLoading = false;
                this.products = response.data.data.products;
                this.totalRows = this.products.length
            });
        },
    }
};
</script>
<style scoped>
</style>
