<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('return_requests') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard')
                                        }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('return_requests') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('return_requests') }}</h4>
                    </div>
                    <div class="card-body">

                        <b-row class="mb-2">
                            <b-col md="3" offset-md="8">
                                <h6 class="box-title">{{ __('search') }}</h6>
                                <b-form-input id="filter-input" v-model="filter" type="search"
                                    :placeholder="__('search')"></b-form-input>
                            </b-col>
                            <b-col md="1" class="text-center">
                                <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                                    @click="getReturnRequests()">
                                    <i class="fa fa-refresh" aria-hidden="true"></i>
                                </button>
                            </b-col>
                        </b-row>

                        <div class="table-responsive">
                            <b-table :items="returnRequestsForTable" :fields="fields" :current-page="currentPage"
                                :per-page="perPage" :sort-direction="sortDirection" :bordered="true" :busy="isLoading"
                                stacked="md" show-empty small>

                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>

                                <template #head(price)="row">
                                    {{ 'Price (' + $currency + ')' }}
                                </template>
                                <template #head(discounted_price)="row">
                                    {{ 'Discounted Price (' + $currency + ')' }}
                                </template>

                                <template #cell(status)="row">
                                    <span v-if="row.item.status === 1" class="badge bg-warning">{{ __('pending')
                                        }}</span>
                                    <span v-else-if="row.item.status === 2" class="badge bg-success">{{ __('approved')
                                        }}</span>
                                    <span v-else-if="row.item.status === 3" class="badge bg-danger">{{ __('rejected')
                                        }}</span>
                                    <span v-else-if="row.item.status === 4" class="badge bg-info">{{
                                        __('delivery_boy_assigned') }}</span>
                                    <span v-else-if="row.item.status === 5" class="badge bg-primary">{{
                                        __('out_for_pickup') }}</span>
                                    <span v-else-if="row.item.status === 6" class="badge bg-secondary">{{
                                        __('received_from_customer') }}</span>
                                    <span v-else-if="row.item.status === 7" class="badge bg-danger">{{ __('cancelled')
                                        }}</span>
                                    <span v-else-if="row.item.status === 8" class="badge bg-dark">{{
                                        __('return_to_seller') }}</span>
                                    <span v-else class="badge bg-danger">{{ __('undefined') }}</span>
                                </template>
                                <template #cell(created_at)="row">
                                    {{ row.item.created_at }}
                                </template>
                                <!-- Resolve name, product_name, variant_name when API sends object by lang code -->
                                <template #cell(name)="row">
                                    {{ row.item.customer_name || row.item.name }}
                                </template>
                                <template #cell(product_name)="row">
                                    {{ row.item.product_name }}
                                </template>
                                <template #cell(variant_name)="row">
                                    {{ row.item.variant_name }}
                                </template>
                                <template #cell(actions)="row">
                                    <button class="btn btn-sm btn-primary" @click="edit_record = row.item"
                                        v-if="$can('return_request_update')" v-b-tooltip.hover :title="__('edit')"><i
                                            class="fa fa-pencil-alt"></i></button>
                                    <button class="btn btn-sm btn-danger"
                                        @click="deleteReturnRequests(row.index, row.item.id)"
                                        v-if="$can('return_request_delete')" v-b-tooltip.hover :title="__('delete')"><i
                                            class="fa fa-trash"></i></button>
                                </template>

                            </b-table>
                        </div>

                        <b-row>
                            <b-col md="2" class="my-1">
                                <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                                    label-size="sm" class="mb-0">
                                    <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                        size="sm" class="form-control form-select"></b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col md="4" class="my-1" offset-md="6">
                                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                    align="fill" size="sm" class="my-0"></b-pagination>
                            </b-col>
                        </b-row>

                    </div>
                </div>
            </section>
        </div>
        <!-- Add / Edit -->
        <app-edit-record v-if="create_new || edit_record" :record="edit_record"
            @modalClose="hideModal()"></app-edit-record>
    </div>
</template>
<script>
import EditRecord from './Edit';
import Auth from '../../Auth.js';

export default {
    components: {
        'app-edit-record': EditRecord,
    },
    data: function () {
        return {
            login_user: Auth.user,
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'user_id', label: __('user_id'), sortable: true, class: 'text-center' },
                { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
                { key: 'product_name', label: __('product_name'), sortable: true, class: 'text-center' },
                { key: 'variant_name', label: __('variant'), sortable: true, class: 'text-center' },
                { key: 'quantity', label: __('quantity'), sortable: true, class: 'text-center' },
                { key: 'sub_total', label: __('total'), sortable: true, class: 'text-center' },
                { key: 'status', label: __('status'), sortable: true, class: 'text-center' },
                { key: 'reason', label: __('reason'), sortable: true, class: 'text-center' },
                { key: 'created_at', label: __('date'), sortable: true, class: 'text-center' },
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
            sectionStyle: 'style_1',
            max_visible_units: 12,
            max_col_in_single_row: 3,
            create_new: null,
            edit_record: null,
            returnRequests: [],
        }
    },
    computed: {
        appLocale() {
            return (typeof window !== 'undefined' && (window.appLocale || (window.localStorage && window.localStorage.getItem('lang')))) || 'en';
        },
        returnRequestsForTable() {
            return this.returnRequests || [];
        },
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
        // totalRows set in getReturnRequests when data loads
    },
    created: function () {
        this._handleReturnRequestSaved = (message) => {
            this.showMessage("success", message);
            this.getReturnRequests();
            this.create_new = null;
        };
        this.$eventBus.$on('returnRequestSaved', this._handleReturnRequestSaved);
        this.getReturnRequests();
    },
    beforeDestroy() {
        this.$eventBus.$off('returnRequestSaved', this._handleReturnRequestSaved);
    },
    watch: {
        filter() {
            this.currentPage = 1;
            this.getReturnRequests();
        },
        currentPage() {
            if (this.login_user.role_id == 3 || this.login_user.role_id == 4) {
                this.getReturnRequests();
            }
        },
        perPage() {
            this.currentPage = 1;
            if (this.login_user.role_id == 3 || this.login_user.role_id == 4) {
                this.getReturnRequests();
            }
        }
    },
    methods: {

        getReturnRequests() {
            this.isLoading = true

            let apiEndpoint = '/return_requests';
            if (this.login_user.role_id == 3) { // Seller
                apiEndpoint = '/seller/return_requests';
            } else if (this.login_user.role_id == 4) { // Delivery Boy
                apiEndpoint = '/delivery_boy/return_requests';
            }

            const isPaginatedApi = this.login_user.role_id == 3 || this.login_user.role_id == 4;
            const offset = isPaginatedApi ? (this.currentPage - 1) * this.perPage : 0;
            const limit = isPaginatedApi ? this.perPage : 1000;

            let url = this.$apiUrl + apiEndpoint + "?search=" + encodeURIComponent(this.filter || "");
            if (isPaginatedApi) {
                url += "&offset=" + offset + "&limit=" + limit;
            }

            axios.get(url)
                .then((response) => {
                    this.returnRequests = response.data.data || [];
                    this.totalRows = (isPaginatedApi && response.data.total) ? response.data.total : this.returnRequests.length;
                    this.isLoading = false;
                });
        },
        deleteReturnRequests(index, id) {
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

                    let apiEndpoint = '/return_requests/delete';
                    if (this.login_user.role_id == 3) {
                        apiEndpoint = '/seller/return_requests_delete';
                    }

                    axios.post(this.$apiUrl + apiEndpoint, postData)
                        .then((response) => {
                            this.isLoading = false
                            this.returnRequests.splice(index, 1)
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
