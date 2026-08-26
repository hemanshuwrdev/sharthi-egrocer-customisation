<template>
    <div>
        <div class="list-page">
            <div class="page-head">
                <h3 class="page-head-title">{{ __('withdrawal_request') }}</h3>
                <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                    @click="create_new = true">
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    <span>{{ __('create_withdraw_request') }}</span>
                </button>
            </div>

            <div class="list-surface">
                <div class="list-toolbar">
                    <form method="post">
                        <select @change="getWthdrawalRequests()" v-model="status"
                            class="form-control form-select">
                            <option value="">{{ __('select_status') }}</option>
                            <option value="0">{{ __('pending') }}</option>
                            <option value="1">{{ __('approved') }}</option>
                            <option value="2">{{ __('rejected') }}</option>
                        </select>
                    </form>
                    <div class="list-search">
                        <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                        <b-form-input id="filter-input" v-model="filter" type="search"
                            :placeholder="__('search')"></b-form-input>
                    </div>
                    <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                        @click="getWthdrawalRequests()">
                        <i class="fa fa-refresh" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="table-responsive">
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
                                    {{ __('amount') }} ({{ $currency }})
                                </template>

                                <template #cell(status)="row">
                                    <span v-if="row.item.status === 0" class="badge bg-warning">{{ __('pending')
                                        }}</span>
                                    <span v-else-if="row.item.status === 1" class="badge bg-success">{{ __('approved')
                                        }}</span>
                                    <span v-else-if="row.item.status === 2" class="badge bg-danger">{{ __('rejected')
                                        }}</span>
                                    <span v-else class="badge bg-danger">{{ __('undefine') }}</span>
                                </template>
                                <template #cell(receipt_image)="row">
                                    <img :src="row.item.receipt_image_url" height="50" />
                                </template>
                                <template #cell(created_at)="row">
                                    {{ row.item.created_at }}
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
                            </b-table>
                        </div>

                <div class="list-footer">
                    <div class="list-perpage">
                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                            label-align-sm="right" label-size="sm" class="mb-0">
                            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                size="sm" class="form-control form-select"></b-form-select>
                        </b-form-group>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                            align="fill" size="sm" class="list-pagination"></b-pagination>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add / Edit -->
        <app-edit-record v-if="create_new || edit_record" :record="edit_record" :customers="customers"
            :balance="balance" @modalClose="hideModal()"></app-edit-record>
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
                { key: 'amount', label: __('amount'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'message', label: __('message'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'status', label: __('status'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'remark', label: __('remark'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'receipt_image', label: __('receipt_image'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },
                { key: 'created_at', label: __('date'), sortable: true, class: 'text-center', thClass: 'text-nowrap' },

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

            customers: null,
            withdrawalRequests: [

            ],
            balance: 0,
            status: ""
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
        this.totalRows = this.withdrawalRequests.length
    },

    created: function () {
        this.$eventBus.$on('withdrawalRequestsSaved', (message) => {
            this.showMessage("success", message);
            this.getWthdrawalRequests();
            this.create_new = null;
        });
        this.getWthdrawalRequests();
    },
    methods: {
        getWthdrawalRequests() {
            this.isLoading = true
            let param = {
                "status": this.status
            }
            axios.get(this.$apiUrl + '/withdrawal_requests/get', {
                params: param
            }).then((response) => {
                this.isLoading = false
                this.withdrawalRequests = response.data.data.withdraw_requests;
                this.totalRows = this.withdrawalRequests.length;
                this.balance = response.data.data.balance
            });
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false
        },
    }
};
</script>
