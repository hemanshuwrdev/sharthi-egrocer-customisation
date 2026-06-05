<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('salesman') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page"> {{ __('salesman') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('salesman') }}</h4>
                        <span class="pull-right">
                            <router-link to="/seller/salesman/create" class="btn btn-primary" v-b-tooltip.hover :title="__('add_salesman')">{{ __('add_salesman') }}</router-link>
                        </span>
                    </div>
                    <div class="card-body">
                        <b-row class="mb-2">
                            <b-col md="3" offset-md="8">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input id="filter-input" v-model="filter" type="search" :placeholder="__('search')"></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')" @click="getSalesmen()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </b-row>
                        <div class="table-responsive">
                            <b-table :items="salesmen" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true" :busy="isLoading" stacked="md" show-empty small>
                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>
                                
                                <template #cell(status)="row">
                                    <label v-if="row.item.status == 1" class='badge bg-success'>{{ __('active') }}</label>
                                    <label v-else-if="row.item.status == 0" class='badge bg-danger'>{{ __('deactive') }}</label>
                                </template>

                                <template #cell(allow_payment_collection)="row">
                                    <span v-if="row.item.allow_payment_collection == 1" class="badge bg-success">{{ __('yes') }}</span>
                                    <span v-else class="badge bg-danger">{{ __('no') }}</span>
                                </template>

                                <template #cell(brands)="row">
                                    <span v-if="row.item.brands && JSON.parse(row.item.brands)" class="badge bg-secondary me-1" v-for="brand in JSON.parse(row.item.brands)" :key="brand">
                                        {{ getBrandName(brand) }}
                                    </span>
                                </template>

                                <template #cell(actions)="row">
                                    <router-link :to="{ name: 'SellerEditSalesman', params: { id: row.item.id } }" v-b-tooltip.hover :title="__('edit')" class="btn btn-primary btn-sm me-2">
                                        <i class="fa fa-pencil-alt"></i>
                                    </router-link>
                                    <button class="btn btn-sm btn-danger" @click="deleteSalesman(row.index, row.item.id)" v-b-tooltip.hover :title="__('delete')">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </template>
                            </b-table>
                        </div>
                        <b-row>
                            <b-col md="2" class="my-1">
                                <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right" label-size="sm" class="mb-0">
                                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="4" class="my-1" offset-md="6">
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm" class="my-0"></b-pagination>
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile'), sortable: true, class: 'text-center' },
                { key: 'brands', label: __('assigned_brands'), class: 'text-center' },
                { key: 'allow_payment_collection', label: __('payment_collection'), class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'desc',
            filter: null,
            filterOn: [],
            page: 1,
            salesmen: [],
            availableBrands: [],
            isLoading: false
        }
    },
    computed: {
        sortOptions() {
            return this.fields.filter(f => f.sortable).map(f => {
                return { text: f.label, value: f.key }
            })
        }
    },
    mounted() {
        this.getBrands();
    },
    created: function () {
        this.getSalesmen();
    },
    methods: {
        getBrands() {
            axios.get(this.$sellerApiUrl + '/brands')
                .then(response => {
                    if (response.data.status === 1) {
                        this.availableBrands = response.data.data;
                    }
                });
        },
        getBrandName(id) {
            let brand = this.availableBrands.find(b => b.id == id);
            return brand ? brand.name : id;
        },
        getSalesmen() {
            this.isLoading = true;
            axios.get(this.$sellerApiUrl + '/salesman')
                .then(response => {
                    this.isLoading = false;
                    let data = response.data;
                    if (data.status === 1) {
                        this.salesmen = data.data;
                        this.totalRows = this.salesmen.length;
                    }
                }).catch(error => {
                    this.isLoading = false;
                    this.showError(this.__('something_went_wrong'));
                });
        },
        deleteSalesman(index, id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_to_delete_this_salesman'),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: __('yes_delete_it'),
                cancelButtonText: __('cancel')
            }).then((result) => {
                if (result.value) {
                    this.isLoading = true;
                    let postData = {
                        id: id
                    }
                    axios.post(this.$sellerApiUrl + '/salesman/delete', postData)
                        .then((response) => {
                            this.isLoading = false;
                            let data = response.data;
                            this.salesmen.splice(index, 1);
                            this.showMessage("success", data.message);
                        }).catch(error => {
                            this.isLoading = false;
                            this.showError(this.__('something_went_wrong'));
                        });
                }
            });
        }
    }
}
</script>
