<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{__('store_settings')}}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/seller/dashboard">{{__('dashboard')}}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{__('store_settings')}}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{__('units')}}</h4>
                    </div>
                    <div class="card-body">

                        <b-row class="mb-2">
                            <b-col md="3" offset-md="8">
                                <h6 class="box-title">{{__('search')}}</h6>
                                <b-form-input
                                    id="filter-input"
                                    v-model="filter"
                                    type="search"
                                    :placeholder="__('search')"
                                ></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')" @click="getUnits()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </b-row>

                        <b-table
                            :items="units"
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

                            <template #cell(parent_id)="row">
                                <p v-if="row.item.parent_id!==null">{{ row.item.parent_id }}</p>
                                <p v-else>-</p>
                            </template>

                            <template #cell(conversion)="row">
                                <p v-if="row.item.conversion!==null">{{ row.item.conversion }}</p>
                                <p v-else>-</p>
                            </template>



                        </b-table>

                        <b-row>
                            <b-col  md="2" class="my-1">
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
                            </b-col>
                            <b-col  md="4" class="my-1" offset-md="6">
                                <b-pagination
                                    v-model="currentPage"
                                    :total-rows="totalRows"
                                    :per-page="perPage"
                                    align="fill"
                                    size="sm"
                                    class="my-0"
                                ></b-pagination>
                            </b-col>
                        </b-row>

                    </div>
                </div>
            </section>
        </div>
        <!-- Add / Edit -->

    </div>
</template>
<script>

    export default {
        data: function() {
            return {
                fields: [
                    { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                    { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
                    { key: 'short_code', label: __('short_code'), sortable: true, class: 'text-center' },
                    { key: 'parent_id', label: __('parent_id'),  class: 'text-center' },
                    { key: 'conversion', label: __('conversion'),  class: 'text-center' }
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

                units: [],
                isLoading: false,
                sectionStyle : 'style_1',
                max_visible_units : 12,
                max_col_in_single_row : 3,
                create_new : null,
                edit_record : null
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
            this.totalRows = this.units.length
        },
        created: function() {
            this.$eventBus.$on('unitSaved', (message) => {
                this.showMessage("success", message);
                this.getUnits();
                this.create_new = null;
            });
            this.getUnits();
        },
        methods: {
            getUnits(){
                this.isLoading = true
                axios.get(this.$apiUrl + '/units')
                    .then((response) => {
                        this.isLoading = false
                        let data = response.data;
                        this.units = data.data
                        this.totalRows = this.units.length
                    });
            },
        }
    };
</script>
