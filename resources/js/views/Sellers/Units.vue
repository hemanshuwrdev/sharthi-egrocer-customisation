<template>
    <div>
        <div class="list-page">
            <div class="page-head">
                <h3 class="page-head-title">{{__('units')}}</h3>
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
                    <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getUnits()">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="table-responsive">
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
