<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('manage_areas') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                v-if="$can('area_create')" @click="$router.push('/areas/create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_new_area') }}</span>
            </button>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                    id="my-table"
                    ref="table"
                    head-variant="unset"
                    :items="areas"
                    :fields="fields"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    @sort-changed="getRecords"
                    :bordered="true"
                    :busy="isLoading"
                    stacked="md"
                    show-empty
                    small
                    empty-text="There are no areas to show"
                    :key="tableKey"
                >
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                    <template #cell(status)="row">
                        <span class="badge" :class="row.item.status == 1 ? 'bg-success' : 'bg-danger'">
                            {{ row.item.status == 1 ? __('active') : __('inactive') }}
                        </span>
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <router-link
                                :to="{ name: 'EditArea', params: { id: row.item.id, record: row.item } }"
                                v-b-tooltip.hover :title="__('edit')" class="list-action-btn is-edit"
                                v-if="$can('area_update')">
                                <i class="fa fa-pencil-alt"></i>
                            </router-link>
                            <button class="list-action-btn is-delete" v-b-tooltip.hover :title="__('delete')"
                                    @click="deleteRecord(row.index, row.item.id)"
                                    v-if="$can('area_delete')">
                                <i class="fa fa-trash"></i>
                            </button>
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
                    @change="getRecords"
                ></b-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data: function () {
        return {
            isLoading: false,

            fields: [
                {key: 'id', label: __('id'), sortable: true, sortDirection: 'desc'},
                {key: 'name', label: __('name'), sortable: true, sortDirection: 'desc'},
                {key: 'pincode', label: __('pincode'), sortable: true, sortDirection: 'desc'},
                {key: 'state', label: __('state'), sortable: true, sortDirection: 'desc'},
                {key: 'district', label: __('district'), sortable: true, sortDirection: 'desc'},
                {key: 'status', label: __('status')},
                {key: 'actions', label: __('actions'), class: 'text-center' }
            ],

            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            offset: 0,

            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'desc',

            filter: null,
            filterOn: [],

            areas: [],
            tableKey: 0,
        }
    },
    created() {
        this.getRecords();
    },
    watch: {
        currentPage() {
            this.getRecords();
        },
        perPage() {
            this.getRecords();
        },
        filter() {
            this.currentPage = 1;
            this.getRecords();
        }
    },
    methods: {
        getRecords() {
            this.isLoading = true;
            let vm = this;

            const calculatedOffset = this.perPage * (this.currentPage - 1);

            const params = {
                offset: calculatedOffset,
                limit: this.perPage,
                search: this.filter,
            };

            axios.get(this.$apiUrl + '/areas', { params })
                .then((response) => {
                    this.isLoading = false;
                    let data = response.data;
                    this.areas = data.data.areas || [];
                    this.totalRows = data.data.total || 0;
                    this.tableKey++;
                }).catch(error => {
                    vm.isLoading = false;
                    if (error?.request?.statusText) {
                        this.showError(error?.request?.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });
        },

        deleteRecord(index, id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_be_able_to_revert_this'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.isLoading = true;
                    let postData = { id: id };
                    axios.post(this.$apiUrl + '/areas/delete', postData)
                        .then((response) => {
                            this.isLoading = false;
                            let data = response.data;
                            this.areas.splice(index, 1);
                            this.showMessage('success', data.message);
                        });
                }
            });
        },
    }
};
</script>
