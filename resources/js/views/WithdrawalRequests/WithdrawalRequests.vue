<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('withdrawal_requests') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')"></b-form-input>
                </div>
                <form method="post">
                    <select @change="getRecords()" v-model="type" class="form-control form-select">
                        <option value="">{{ __('all_roles') }}</option>
                        <option value="seller">{{ __('seller') }}</option>
                        <option value="delivery_boy">{{ __('delivery_boy') }}</option>
                    </select>
                </form>
                <form method="post">
                    <select @change="getRecords()" v-model="status" class="form-control form-select">
                        <option value="">{{ __('select_status') }}</option>
                        <option value="0">{{ __('pending') }}</option>
                        <option value="1">{{ __('approved') }}</option>
                        <option value="2">{{ __('rejected') }}</option>
                    </select>
                </form>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getRecords()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive withdrawal-table">
                <b-table class="w-100" :items="withdrawalRequests" :fields="fields"
                    :current-page="currentPage" :per-page="perPage" :filter="filter"
                    :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection" :bordered="true" :busy="isLoading" stacked="md"
                    show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>
                    <template #head(amount)="row">
                        {{ 'Amount (' + $currency + ')' }}
                    </template>

                    <template #cell(status)="row">
                        <span v-if="row.item.status === 0" class="badge bg-warning">{{ __('pending')
                            }}</span>
                        <span v-else-if="row.item.status === 1" class="badge bg-success">{{ __('approved')
                            }}</span>
                        <span v-else-if="row.item.status === 2" class="badge bg-danger">{{ __('rejected')
                            }}</span>
                        <span v-else class="badge bg-danger">{{ __('undefine') }}Undefine</span>
                    </template>
                    <template #cell(receipt_image)="row">
                        <img :src="row.item.receipt_image_url" height="50" />
                    </template>
                    <template #cell(message)="row">
                        <small :id="'bonus' + row.item.id"
                            class="d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2">
                            <i class="fa fa-info-circle"></i>
                        </small>
                        <b-popover :target="'bonus' + row.item.id" triggers="hover" placement="left">
                            {{ row.item.message }}
                        </b-popover>

                    </template>
                    <template #cell(created_at)="row">
                        {{ row.item.created_at}}
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item"
                                v-if="$can('withdrawal_request_update')" v-b-tooltip.hover
                                :title="__('edit')"><i class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-delete"
                                @click="deleteWithdrawalRequests(row.index, row.item.id)"
                                v-if="$can('withdrawal_request_delete')" v-b-tooltip.hover
                                :title="__('delete')"><i class="fa fa-trash"></i></button>
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
                <b-pagination v-model="currentPage" :total-rows="totalRowsFilter" :per-page="perPage"
                    align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>
        <!-- Add / Edit -->
        <app-edit-record v-if="create_new || edit_record" :record="edit_record"
            @modalClose="hideModal()"></app-edit-record>
    </div>
</template>
<script>
import EditRecord from './Edit';
export default {
    components: {
        'app-edit-record': EditRecord,
    },
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc', thClass: 'text-nowrap' },
                { key: 'type', label: __('type'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'name', label: __('name'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'amount', label: __('amount'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'message', label: __('message'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'status', label: __('status'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'remark', label: __('remark'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'receipt_image', label: __('receipt_image'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'created_at', label: __('date'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'actions', label: __('actions'), thClass: 'text-nowrap', class: 'text-center' }
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
            withdrawalRequests: [],
            status: "",
            remark: "",
            type: ""
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
        },
        filteredWithdrawRequests: function () {
            const query = this.filter ? this.filter.toLowerCase() : '';
            return this.withdrawalRequests.filter(request => {
                return (
                    (request.type && request.type.toLowerCase().includes(query)) ||
                    (request.remark && request.remark.toLowerCase().includes(query))
                );
            });
        },
        totalRowsFilter: function () {
            return this.filteredWithdrawRequests.length;
        },
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.withdrawalRequests.length
    },
    created: function () {
        this.$eventBus.$on('withdrawalRequestSaved', (message) => {
            this.showMessage("success", message);
            this.getRecords();
            this.create_new = null;
        });
        this.getRecords();
    },
    methods: {
        getRecords() {
            this.isLoading = true
            let param = {
                "type": this.type,
                "status": this.status
            }
            axios.get(this.$apiUrl + '/withdrawal_requests/get', {
                params: param
            }).then((response) => {
                this.withdrawalRequests = response.data.data.withdraw_requests;
                this.totalRows = this.withdrawalRequests.length;
                this.isLoading = false;
            });
        },
        deleteWithdrawalRequests(index, id) {
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
                        id: id
                    }
                    axios.post(this.$apiUrl + '/withdrawal_requests/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            this.withdrawalRequests.splice(index, 1)
                            this.showSuccess(response.data.message)
                        });
                }
            });
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false
        },
    }
};
</script>
