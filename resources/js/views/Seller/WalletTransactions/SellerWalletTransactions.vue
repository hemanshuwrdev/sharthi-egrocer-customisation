<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('wallet_transactions') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap" @click="create_new=true" v-if="login_user.role.name === 'Super Admin' || login_user.role.name === 'Admin'">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_transactions') }}</span>
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
                        @input="getWalletTransactions()"
                    ></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')" @click="getWalletTransactions()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>
                        <div class="table-responsive">
                            <b-table
                                :items="walletTransactions"
                                :fields="fields"
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

                                <template #cell(type)="row">
                                    <span
                                        class="badge text-capitalize"
                                        :class="getTypeBadgeClass(row.item.type)"
                                    >
                                        {{ row.item.type }}
                                    </span>
                                </template>

                                <template #cell(status)="row">
                                    <span
                                        class="badge"
                                        :class="getStatusBadgeClass(row.item.status)"
                                    >
                                        {{ row.item.status === 1 ? __('active') : __('deactive') }}
                                    </span>
                                </template>

                                <template #cell(created_at)="row">
                                    {{ row.item.created_at }}
                                </template>
                                <template #cell(amount)="row">
                                    {{ row.item.amount }}
                                </template>
                                <template #cell(actions)="row">
                                    <div class="list-actions">
                                        <button class="list-action-btn is-view" @click="row.toggleDetails" v-b-tooltip.hover :title="__('view')">
                                            <i v-if="row.detailsShowing" class="fa fa-eye-slash"></i>
                                            <i v-else class="fa fa-eye"></i>
                                        </button>
                                    </div>
                                </template>

                                <template #row-details="row">
                                    <b-card no-body class="p-4 bg-white shadow-sm">
                                        <div class="d-flex align-items-center mb-3">
                                            <h5 class="text-primary mb-0 me-3"><i class="fa fa-receipt me-1"></i> {{ __('transaction_details') }}</h5>
                                            <div class="h-line flex-grow-1 bg-light" style="height: 1px;"></div>
                                        </div>

                                        <div class="row g-4 text-break">
                                            <!-- Column 1: IDs -->
                                            <div class="col-md-3">
                                                <div class="mb-3">
                                                    <label class="text-muted small text-uppercase fw-bold d-block">{{ __('id') }}</label>
                                                    <span class="fs-6">#{{ row.item.id }}</span>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="text-muted small text-uppercase fw-bold d-block">{{ __('order_id') }}</label>
                                                    <span class="fs-6">#{{ row.item.order_id }}</span>
                                                </div>
                                                <div class="mb-0">
                                                    <label class="text-muted small text-uppercase fw-bold d-block">{{ __('seller_id') }}</label>
                                                    <span class="fs-6">{{ row.item.seller_id }}</span>
                                                </div>
                                            </div>

                                            <!-- Column 2: Item Info -->
                                            <div class="col-md-5">
                                                <div class="mb-3">
                                                    <label class="text-muted small text-uppercase fw-bold d-block">{{ __('product') }}</label>
                                                    <span class="fs-6">{{ row.item.product_name }}</span>
                                                </div>
                                                <div class="mb-0">
                                                    <label class="text-muted small text-uppercase fw-bold d-block">{{ __('measurement') }}</label>
                                                    <span class="fs-6">{{ row.item.variant_name }}</span>
                                                </div>
                                            </div>

                                            <!-- Column 3: Financials & Status -->
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label class="text-muted small text-uppercase fw-bold d-block">{{ __('amount') }}</label>
                                                    <span class="fs-6 fw-bold">₹{{ row.item.amount }}</span>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="text-muted small text-uppercase fw-bold d-block">{{ __('type') }}</label>
                                                    <span class="fs-6 text-capitalize">{{ row.item.type }}</span>
                                                </div>
                                                <div class="mb-0">
                                                    <label class="text-muted small text-uppercase fw-bold d-block">{{ __('status') }}</label>
                                                    <span class="fs-6">{{ row.item.status === 1 ? __('active') : __('deactive') }}</span>
                                                </div>
                                            </div>

                                            <!-- Message Row -->
                                            <div class="col-12 mt-3 p-3 bg-light rounded shadow-sm border-start border-4 border-primary">
                                                <label class="text-muted small text-uppercase fw-bold d-block mb-1">{{ __('message') }}</label>
                                                <p class="mb-0 text-dark fs-6 white-space-pre-wrap">{{ row.item.message }}</p>
                                            </div>
                                        </div>
                                    </b-card>
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
                            @input="getWalletTransactions()"
                        ></b-form-select>
                    </b-form-group>
                </div>
                <div>
                    <b-pagination
                        v-model="currentPage"
                        @input="getWalletTransactions()"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        align="fill"
                        size="sm"
                        class="list-pagination"
                    ></b-pagination>
                </div>
            </div>
        </div>

        <!-- Add / Edit -->
        <app-edit-record
            v-if="create_new || edit_record"
            :record="edit_record"
            :sellers="sellers"
            @modalClose="hideModal()"
        ></app-edit-record>
    </div>
</template>
<script>
import EditRecord from './Edit';
import Auth from '../../../Auth.js';

export default {
    components: {
        'app-edit-record': EditRecord,
    },

    data: function () {
        return {
            fields: [
                {key: 'id', label: __('id'), sortable: true, sortDirection: 'desc'},
                {key: 'seller_id', label: __('seller_id'), sortable: true, class: 'text-center'},
                {key: 'name', label: __('seller_name'), sortable: true, class: 'text-center'},
                {key: 'order_id', label: __('order_id'), sortable: true, class: 'text-center'},
                {key: 'order_item_id', label: __('order_item_id'), sortable: true, class: 'text-center'},
                {key: 'product_name', label: __('product_name'), sortable: true, class: 'text-center'},
                {key: 'variant_name', label: __('measurement'), sortable: true, class: 'text-center'},
                {key: 'type', label: __('type'), sortable: true, class: 'text-center'},
                {key: 'amount', label: __('amount'), sortable: true, class: 'text-center'},
                {key: 'status', label: __('status'), sortable: true, class: 'text-center'},
                {key: 'created_at', label: __('date'), sortable: true, class: 'text-center'},
                {key: 'actions', label: __('actions'), class: 'text-center'},
            ],
            totalRows: 1,
            currentPage: 1,
            perPage: this.$perPage || 5,
            pageOptions: this.$pageOptions || [5, 10, 20, 50],
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

            sellers: null,
            walletTransactions: [],
            login_user: Auth.user,
            currentLanguageId: null,
            activeLanguages: []
        }
    },
    computed: {
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return {text: f.label, value: f.key}
                })
        },
        isSellerRoute() {
            // Use this.$route to access the current route
            return this.$route.path.startsWith('/seller/');
        },
    },
    created: function () {
        this.$eventBus.$on('sellerWalletTransactionsSaved', (message) => {
            this.showMessage("success", message);
            this.getWalletTransactions();
            this.create_new = null;
        });
        this.fetchActiveLanguages().then(() => {
            this.getWalletTransactions();
        });
    },
    methods: {
        async fetchActiveLanguages() {
            try {
                const res = await axios.get(this.$apiUrl + '/active_languages');
                if (res.data.status === 1 && Array.isArray(res.data.data)) {
                    this.activeLanguages = res.data.data;
                    const appLocale = window.appLocale || 'en';
                    const currentLang = this.activeLanguages.find(
                        l => l.code === appLocale
                    );
                    if (currentLang) {
                        this.currentLanguageId = currentLang.id;
                    } else {
                        const def = this.activeLanguages.find(l => l.is_default === 1);
                        if (def) this.currentLanguageId = def.id;
                    }
                }
            } catch (e) {
                console.error('Language load failed', e);
            }
        },
        getTranslatedName(item) {
            if (!this.currentLanguageId) {
                return item.name || '';
            }
            if (item.translations && Array.isArray(item.translations)) {
                const translation = item.translations.find(
                    t => t.language_id === this.currentLanguageId
                );
                if (translation && translation.name && translation.name.trim() !== '') {
                    return translation.name;
                }
            }
            return item.name || '';
        },
        getWalletTransactions() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/seller_wallet_transactions', {
                params: {
                    limit: this.perPage,
                    offset: (this.currentPage - 1) * this.perPage,
                    search: this.filter,
                }
            })
                .then((response) => {
                    this.isLoading = false;
                    if (this.login_user.role.name == 'Seller') {
                        this.walletTransactions = response.data.data;
                    }
                    else {
                        // For admin, response.data.data.walletTransactions is the array
                        this.walletTransactions = response.data.data.walletTransactions;
                        this.sellers = response.data.data.sellers;
                    }
                    this.totalRows = response.data.total;
                });
        },
        getTypeBadgeClass(type) {
            if (!type) {
                return 'bg-secondary';
            }
            const normalized = String(type).toLowerCase();

            if (['credit', 'add', 'added', 'receive', 'received'].includes(normalized)) {
                return 'bg-success';
            }
            if (['debit', 'deduct', 'deducted', 'withdraw', 'payout'].includes(normalized)) {
                return 'bg-danger';
            }

            return 'bg-secondary';
        },
        getStatusBadgeClass(status) {
            return status === 1 ? 'bg-success' : 'bg-danger';
        },
        hideModal() {
            this.create_new = false
            this.edit_record = false
        },
    }
};
</script>
