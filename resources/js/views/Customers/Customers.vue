<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('customers') }}</h3>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search" :placeholder="__('search')"
                        @click="addFilter()"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getCustomers()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">

                <b-table :items="customers" :fields="fields" :current-page="currentPage" :per-page="perPage"
                    :filter="filter" :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true" :busy="isLoading"
                    stacked="md" show-empty small>
                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #cell(email)="row">
                        {{ row.item.email | emailMask }}
                    </template>

                    <template #cell(mobile)="row">
                        {{ row.item.mobile | mobileMask }}
                    </template>

                    <template #cell(type)="row">
                        <img :src="$baseUrl + '/images/phone.svg'" height="40" alt="phone"
                            v-if="row.item.type == 'phone' || (!row.item.type && row.item.mobile && !row.item.email)" />
                        <img :src="$baseUrl + '/images/google.svg'" height="40" alt="google"
                            v-if="row.item.type == 'google'" />
                        <img :src="$baseUrl + '/images/apple.svg'" height="40" alt="apple"
                            v-if="row.item.type == 'apple'" />
                        <img :src="$baseUrl + '/images/email.svg'" height="40" alt="email"
                            v-if="row.item.type == 'email' || (!row.item.type && row.item.email)" />
                    </template>

                    <template #cell(status)="row">
                        <span v-if="row.item.status == 1" class="badge bg-success">{{ __('active') }}</span>
                        <span v-else class="badge bg-danger">{{ __('deactive') }}</span>
                    </template>

                    <template #cell(created_at)="row">
                        {{ row.item.created_at }}
                    </template>
                    <template v-if="$can('customer_update')" #cell(actions)="row">
                        <div class="list-actions">
                            <a href="javascript:void(0)" @click="updateStatusCustomer(row.index, row.item.id)">
                                <span class="primary-toggal" v-if="row.item.status == 1"><i
                                        class="fa fa-toggle-on fa-2x"></i></span>
                                <span class="text-danger" v-else><i class="fa fa-toggle-off fa-2x"></i></span>
                            </a>
                        </div>
                    </template>
                </b-table>
            </div>

            <div class="list-footer">
                <div class="list-perpage">
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                        label-size="sm" class="mb-0">
                        <b-form-select id="per-page-select" v-model="perPage" @change="addFilter"
                            :options="pageOptions" size="sm" class="form-control form-select"></b-form-select>
                    </b-form-group>
                </div>
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill"
                    size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    data: function () {
        return {
            isLoading: false,
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
                { key: 'email', label: __('email'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile_no'), sortable: true, class: 'text-center' },
                { key: 'balance', label: __('balance'), sortable: true, class: 'text-center' },
                { key: 'status', label: __('status'), sortable: true, class: 'text-center' },
                { key: 'type', label: __('type'), sortable: true, class: 'text-center' },
                { key: 'created_at', label: __('date_time'), sortable: true, class: 'text-center' },
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
            customers: [],
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
        this.totalRows = this.customers.length
    },
    created: function () {
        this.$eventBus.$on('customersSaved', (message) => {
            this.showMessage("success", message);
            this.getCustomers();
            this.create_new = null;
        });
        this.getCustomers();
    },
    methods: {
        addFilter() {
            this.customers = [];
            this.totalRows = 1;
            this.currentPage = 1;
            this.offset = 0;
            this.getCustomers();
        },
        getCustomers() {
            let vm = this;
            this.isLoading = true;
            axios.get(this.$apiUrl + '/customers')
                .then((response) => {
                    this.isLoading = false;
                    vm.isLoading = false;

                    this.customers = response.data.data;

                    this.totalRows = response.data.total;

                }).catch(error => {

                    vm.isLoading = false;
                    if (error.request?.statusText) {
                        this.showError(error.request?.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });

        },
        updateStatusCustomer(index, id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_want_to_change_status'),
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
                    axios.post(this.$apiUrl + '/customers/change', postData)
                        .then((response) => {
                            this.isLoading = false
                            this.getCustomers();
                            this.showMessage("success", response.data.message);
                        });
                }
            });
        },

    }
};
</script>
