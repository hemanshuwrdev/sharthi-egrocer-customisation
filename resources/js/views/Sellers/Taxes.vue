<template>
    <div>
        <div class="list-page">
            <div class="page-head">
                <h3 class="page-head-title">{{__('taxes')}}</h3>
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
                    <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="table-responsive">
                    <b-table
                                :items="taxes"
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

                                <template #cell(id)="row">
                                    {{ row.item.id }}
                                </template>

                                <template #cell(image)="row">
                                    <p v-if="row.item.image ===''">No Image</p>
                                    <img :src="$storageUrl + row.item.image" height="50" v-else/>
                                </template>

                                <template #cell(status)="row">
                                    <span v-if="row.item.status == 1" class="badge bg-success">{{__('activate')}}</span>
                                    <span v-else class="badge bg-danger">{{__('deactivate')}}</span>
                                </template>

                                <template #cell(actions)="row">
                                    <div class="list-actions">
                                        <button class="list-action-btn is-edit" @click="edit_record = row.item" v-b-tooltip.hover :title="__('edit')" ><i class="fa fa-pencil-alt"></i></button>
                                        <button class="list-action-btn is-delete" @click="deleteRecord(row.index,row.item.id)" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
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
                    <div class="d-flex align-items-center gap-2">
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
    </div>
</template>
<script>
export default {

    data: function() {
        return {
            fields: [
                { key: 'id', label: __('id'), class: 'text-center', sortable: true, sortDirection: 'desc' },
                { key: 'title', label: __('title'),  class: 'text-center' },
                { key: 'percentage', label: __('percentage'),  class: 'text-center' },
                { key: 'status', label: __('status'),  class: 'text-center' },
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

            sectionStyle : 'style_1',
            max_visible_units : 12,
            max_col_in_single_row : 3,

            taxes: [],
            isLoading: false,
            create_new : null,
            edit_record : null,

        }
    },
    created: function() {
        this.getRecords();
    },
    methods: {
        getRecords(){
            this.isLoading = true
            axios.get(this.$apiUrl + '/products/taxes')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.taxes = data.data;
                    this.totalRows = data.total;
                });
        },
    }
};
</script>
