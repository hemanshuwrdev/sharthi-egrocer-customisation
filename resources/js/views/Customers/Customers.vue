<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('retailers') }}</h3>
            <router-link to="/users/create" class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                v-if="$can('customer_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_retailer') }}</span>
            </router-link>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search" :placeholder="__('search')"
                        @click="addFilter()"></b-form-input>
                </div>
                <b-form-select v-model="verificationFilter" :options="verificationOptions" size="sm"
                    class="form-control form-select w-auto"></b-form-select>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getCustomers()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">

                <b-table :items="visibleCustomers" :fields="fields" :current-page="currentPage" :per-page="perPage"
                    :filter="filter" :filter-included-fields="filterOn" :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true" :busy="isLoading"
                    stacked="md" show-empty small @filtered="onFiltered">
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

                    <!-- Sarthi: retailers only ever log in via phone OTP (no Google/Apple/email sign-in),
                         so the login-type icon column is disabled. Kept for reference. -->
                    <!--
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
                    -->

                    <template #cell(status)="row">
                        <span v-if="row.item.status == 1" class="badge bg-success">{{ __('active') }}</span>
                        <span v-else class="badge bg-danger">{{ __('deactive') }}</span>
                    </template>

                    <template #cell(verification_status)="row">
                        <span v-if="isVerified(row.item)" class="badge bg-success" v-b-tooltip.hover
                            :title="verifiedByText(row.item)">{{ __('verified') }}</span>
                        <span v-else-if="isPending(row.item)" class="badge bg-warning text-dark">{{ __('pending') }}</span>
                        <span v-else>-</span>
                    </template>

                    <template #cell(created_at)="row">
                        {{ row.item.created_at }}
                    </template>
                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-verify" v-if="isPending(row.item) && $can('customer_verify')"
                                v-b-tooltip.hover :title="__('verify_retailer')" @click="verifyCustomer(row.item)">
                                <i class="fa fa-check"></i>
                            </button>
                            <router-link :to="'/users/edit/' + row.item.id" class="list-action-btn is-edit"
                                v-if="row.item.verification_status && $can('customer_update')" v-b-tooltip.hover
                                :title="__('edit')">
                                <i class="fa fa-pencil-alt"></i>
                            </router-link>
                            <a href="javascript:void(0)" v-if="$can('customer_update')"
                                @click="updateStatusCustomer(row.index, row.item.id)">
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
                { key: 'shop_name', label: __('shop_name'), sortable: true, class: 'text-center' },
                { key: 'email', label: __('email'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile_no'), sortable: true, class: 'text-center' },
                { key: 'balance', label: __('balance'), sortable: true, class: 'text-center' },
                { key: 'verification_status', label: __('verification'), sortable: true, class: 'text-center' },
                { key: 'status', label: __('status'), sortable: true, class: 'text-center' },
                // Sarthi: retailers only ever log in via phone OTP, so the login-type
                // column is disabled. Kept for reference.
                // { key: 'type', label: __('type'), sortable: true, class: 'text-center' },
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
            verificationFilter: 'all',
            verificationOptions: [
                { value: 'all', text: __('all') },
                { value: 'pending', text: __('pending') },
                { value: 'verified', text: __('verified') },
            ],
        }
    },
    computed: {
        visibleCustomers() {
            if (this.verificationFilter === 'pending') {
                return this.customers.filter(c => this.isPending(c));
            }
            if (this.verificationFilter === 'verified') {
                return this.customers.filter(c => this.isVerified(c));
            }
            return this.customers;
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
    watch: {
        visibleCustomers(list) {
            this.totalRows = list.length;
            this.currentPage = 1;
        },
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

                    // shop_name lives on the retailer profile; lift it so the column can sort and search.
                    this.customers = response.data.data.map(c => ({
                        ...c,
                        shop_name: c.retailer_profile?.shop_name || '-',
                    }));

                    this.totalRows = this.visibleCustomers.length;

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
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        // 'approved' and 'active' can both order; 'pending' / 'salesman_verified' are still waiting.
        isVerified(customer) {
            return ['approved', 'active'].includes(customer.verification_status);
        },
        isPending(customer) {
            return ['pending', 'salesman_verified'].includes(customer.verification_status);
        },
        verifiedByText(customer) {
            const profile = customer.retailer_profile || {};
            if (profile.verified_by_admin_id) return __('verified_by_admin');
            if (profile.verified_by_salesman_id) return __('verified_by_salesman');
            return '';
        },
        verifyCustomer(customer) {
            this.$swal.fire({
                title: __('verify_retailer'),
                text: __('verify_retailer_confirm'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (!result.value) return;
                this.isLoading = true;
                axios.post(this.$apiUrl + '/customers/verify', { id: customer.id })
                    .then((response) => {
                        this.isLoading = false;
                        if (response.data.status === 1) {
                            this.showMessage("success", response.data.message);
                            this.getCustomers();
                        } else {
                            this.showError(response.data.message);
                        }
                    }).catch(error => {
                        this.isLoading = false;
                        this.showError(error.request?.statusText || error.message || __('something_went_wrong'));
                    });
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

<style scoped>
.list-action-btn.is-verify:hover {
    color: #37a279 !important;
}
</style>
