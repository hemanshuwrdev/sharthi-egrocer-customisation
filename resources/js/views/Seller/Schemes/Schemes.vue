<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('schemes') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/seller/dashboard">{{ __('dashboard') }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('schemes') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('schemes') }}</h4>
                        <span class="pull-right">
                            <router-link to="/seller/schemes/create" class="btn btn-primary" v-b-tooltip.hover :title="__('add_scheme')">{{ __('add_scheme') }}</router-link>
                        </span>
                    </div>
                    <div class="card-body">
                        <b-row class="mb-2">
                            <b-col md="3" offset-md="8">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input id="filter-input" v-model="filter" type="search" :placeholder="__('search')"></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')" @click="getSchemes()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </b-row>
                        <div class="table-responsive">
                            <b-table :items="schemes" :fields="fields" :current-page="currentPage" :per-page="perPage" :filter="filter" :filter-included-fields="filterOn" :bordered="true" :busy="isLoading" stacked="md" show-empty small>
                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>

                                <template #cell(type)="row">
                                    <span v-if="row.item.type === 'buy_x_get_y'" class="badge bg-info">{{ __('buy_x_get_y') }}</span>
                                    <span v-else class="badge bg-primary">{{ __('group_discount') }}</span>
                                </template>

                                <template #cell(offer)="row">
                                    <template v-if="row.item.type === 'buy_x_get_y'">
                                        {{ __('buy') }} {{ row.item.buy_qty }} × {{ row.item.buy_product }}<br>
                                        <strong>{{ __('get') }} {{ row.item.free_qty }} × {{ row.item.free_product }} {{ __('free') }}</strong>
                                    </template>
                                    <template v-else>
                                        <span class="badge bg-secondary me-1" v-for="(p, i) in row.item.products" :key="i">{{ p }}</span><br>
                                        <small v-for="(s, i) in row.item.slabs" :key="'s' + i" class="d-block">
                                            ≥ {{ s.min_value }} → {{ s.discount_value }}{{ s.discount_type === 'percentage' ? '%' : '' }} {{ __('off') }}
                                        </small>
                                    </template>
                                </template>

                                <template #cell(period)="row">
                                    {{ row.item.start_date }} → {{ row.item.end_date }}
                                </template>

                                <template #cell(status)="row">
                                    <label v-if="row.item.status == 1" class='badge bg-success'>{{ __('active') }}</label>
                                    <label v-else class='badge bg-danger'>{{ __('deactive') }}</label>
                                </template>

                                <template #cell(actions)="row">
                                    <router-link :to="{ name: 'SellerEditScheme', params: { id: row.item.id } }" v-b-tooltip.hover :title="__('edit')" class="btn btn-primary btn-sm me-2">
                                        <i class="fa fa-pencil-alt"></i>
                                    </router-link>
                                    <button class="btn btn-sm btn-danger" @click="deleteScheme(row.index, row.item.id)" v-b-tooltip.hover :title="__('delete')">
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
                { key: 'type', label: __('type'), class: 'text-center' },
                { key: 'offer', label: __('offer'), class: 'text-center' },
                { key: 'period', label: __('period'), class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            filter: null,
            filterOn: ['name'],
            schemes: [],
            isLoading: false
        }
    },
    created: function () {
        this.getSchemes();
    },
    methods: {
        getSchemes() {
            this.isLoading = true;
            axios.get(this.$sellerApiUrl + '/schemes')
                .then(response => {
                    this.isLoading = false;
                    let data = response.data;
                    if (data.status === 1) {
                        this.schemes = data.data;
                        this.totalRows = this.schemes.length;
                    }
                }).catch(error => {
                    this.isLoading = false;
                    this.showError(this.__('something_went_wrong'));
                });
        },
        deleteScheme(index, id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_to_delete_this_scheme'),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: __('yes_delete_it'),
                cancelButtonText: __('cancel')
            }).then((result) => {
                if (result.value) {
                    this.isLoading = true;
                    axios.post(this.$sellerApiUrl + '/schemes/delete', { id: id })
                        .then((response) => {
                            this.isLoading = false;
                            this.schemes.splice(index, 1);
                            this.showMessage("success", response.data.message);
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
