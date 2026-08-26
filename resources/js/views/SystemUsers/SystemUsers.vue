<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('system_users') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="openCreateModal()" v-if="$role('Super Admin')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_user') }}</span>
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
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table
                            :items="system_users"
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

                            <template #cell(email)="row">
                                {{ row.item.email | emailMask }}
                            </template>

                            <template #cell(role)="row">
                                {{ row.item.role.name }}
                            </template>

                            <template #cell(actions)="row">
                                <div class="list-actions">
                                    <template v-if="row.item.role.name !== 'Super Admin'">
                                        <button class="list-action-btn is-edit" @click="openEditModal(row.item)" v-b-tooltip.hover :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                                        <button class="list-action-btn is-delete" @click="deleteSystemUser(row.index,row.item.id)" v-b-tooltip.hover :title="__('delete')"><i class="fa fa-trash"></i></button>
                                    </template>
                                    <template v-else>
                                        <span class="text-muted small">
                                            <i class="fa fa-shield-alt"></i> {{ __('protected') }}
                                        </span>
                                    </template>
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

        <!-- Add / Edit -->
        <app-edit-record
            v-if="create_new || edit_record"
            :record="edit_record"
            :roles="roles"
            :products="products"
            @modalClose="hideModal()"
        ></app-edit-record>
    </div>
</template>
<script>
import EditRecord from './Edit';
export default {
    components: {
        'app-edit-record' : EditRecord,
    },
    data: function() {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'username', label: __('username'), sortable: true, class: 'text-center' },
                { key: 'email', label: __('email'), sortable: true, class: 'text-center' },
                { key: 'role', label: __('role'),  class: 'text-center' },
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

            create_new : null,
            edit_record : null,
            system_users : [],
            roles : [],
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
        this.totalRows = this.system_users.length
    },
    created: function() {
        this.ensureEventListeners();
        this.getRecords();
    },
    beforeDestroy() {
        // Clean up event listeners to prevent accumulation
        this.$eventBus.$off('systemUserSaved');
    },
    methods: {
        getRecords(){
            this.isLoading = true
            axios.get(this.$apiUrl + '/system_users')
                .then((response) => {
                    this.system_users = response.data.data.records;
                    this.roles = response.data.data.roles;
                    this.totalRows = this.system_users.length;
                    this.isLoading = false;
                });
        },
        deleteSystemUser(index, id){
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
                    this.isLoading = true
                    let postData = {
                        id : id
                    }
                    axios.post(this.$apiUrl + '/system_users/delete',postData)
                        .then((response) => {
                            this.isLoading = false;
                            this.system_users.splice(index, 1);
                            this.showMessage("success", response.data.message);
                        });
                }
            });
        },
        hideModal() {
            this.create_new = false
            this.edit_record = null
        },
        openCreateModal() {
            this.create_new = true
            this.edit_record = null
            this.ensureEventListeners();
        },
        openEditModal(record) {
            this.edit_record = record
            this.create_new = false
            this.ensureEventListeners();
        },
        ensureEventListeners() {
            this.$eventBus.$off('systemUserSaved');
            this.$eventBus.$on('systemUserSaved', (message) => {
                this.showMessage("success", message);
                this.getRecords();
                this.hideModal();
            });
        },
    }
};
</script>
