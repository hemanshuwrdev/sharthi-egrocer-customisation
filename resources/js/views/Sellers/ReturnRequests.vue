<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('return_requests') }}</h3>
        </div>

        <!-- Status chips (counts cover every return request, not just the current search/page) -->
        <div class="ui-chips mb-3">
            <button type="button" v-for="chip in statusChips" :key="chip.key" class="ui-chip"
                :class="{ 'ui-chip--on': String(statusFilter) === String(chip.id) }" @click="setStatus(chip.id)">
                {{ chip.label }} <span>{{ chip.count }}</span>
            </button>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('Search shop, product or reason')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getReturnRequests()">
                    <i class="fa fa-sync-alt" :class="{ 'fa-spin': isLoading }" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <!-- Server-side paging: the API already returns just this page, so the table must not slice it again -->
                <b-table :items="returnRequests" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection" :bordered="false" :busy="isLoading" stacked="md" show-empty>

                    <template #table-busy>
                        <div class="text-center my-2">
                            <b-spinner class="align-middle" small></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #empty>
                        <div class="ui-empty">
                            <div class="ui-empty__icon"><i class="fa fa-undo-alt"></i></div>
                            <h3>{{ __('No return requests found') }}</h3>
                            <p>{{ (filter || statusFilter !== '') ? __('Nothing matches this search or status. Try changing or clearing it.') : __('Return requests from your retailers will show up here.') }}</p>
                        </div>
                    </template>

                    <template #cell(id)="row">
                        <div class="ui-cell">
                            <strong>#{{ row.item.id }}</strong>
                            <span class="ui-nowrap">{{ row.item.created_at }}</span>
                        </div>
                    </template>

                    <template #cell(shop_name)="row">
                        <div class="ui-person">
                            <span class="ui-avatar" :class="'ui-tone--' + avatarTone(row.item.shop_name)">{{ initials(row.item.shop_name) }}</span>
                            <div class="ui-cell">
                                <strong :title="row.item.shop_name">{{ row.item.shop_name || row.item.customer_name || '-' }}</strong>
                                <span>{{ row.item.customer_mobile | mobileMask }}</span>
                            </div>
                        </div>
                    </template>

                    <template #cell(product_name)="row">
                        <div class="ui-cell">
                            <strong>{{ row.item.product_name }}</strong>
                            <span>
                                <template v-if="row.item.variant_name">{{ row.item.variant_name }} &middot; </template>&times; {{ row.item.quantity }}
                            </span>
                        </div>
                    </template>

                    <template #cell(sub_total)="row">
                        <span class="ui-money">{{ $currency }}{{ formatMoney(row.item.sub_total) }}</span>
                    </template>

                    <template #cell(reason)="row">
                        <span v-if="row.item.reason" class="ui-clamp" :title="row.item.reason">{{ row.item.reason }}</span>
                        <span v-else class="ui-dash">-</span>
                    </template>

                    <template #cell(status)="row">
                        <span class="ui-pill" :class="'ui-tone--' + statusTone(row.item.status)">
                            <span class="ui-dot"></span>{{ statusLabel(row.item.status) }}
                        </span>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="edit_record = row.item"
                                v-if="$can('return_request_update')" v-b-tooltip.hover :title="__('edit')"><i
                                    class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-delete"
                                @click="deleteReturnRequests(row.item.id)"
                                v-if="$can('return_request_delete')" v-b-tooltip.hover :title="__('delete')"><i
                                    class="fa fa-trash"></i></button>
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
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>

        <!-- Edit -->
        <app-edit-record v-if="edit_record" :record="edit_record" @modalClose="hideModal()"></app-edit-record>
    </div>
</template>
<script>
import axios from 'axios';
import EditRecord from '../ReturnRequests/Edit';

// Return status ids (see App\Models\ReturnStatusList)
const STATUS = { pending: 1, approved: 2, rejected: 3, deliveryBoyAssigned: 4, outForPickup: 5, receivedFromCustomer: 6, cancelled: 7, returnToSeller: 8 };

export default {
    name: 'SellerReturnRequests',
    components: {
        'app-edit-record': EditRecord,
    },
    data: function () {
        return {
            fields: [
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'shop_name', label: __('Shop Name'), sortable: true },
                { key: 'product_name', label: __('product_name'), sortable: true },
                { key: 'sub_total', label: __('total'), sortable: true, class: 'ui-num' },
                { key: 'reason', label: __('reason') },
                { key: 'status', label: __('status'), sortable: true },
                { key: 'actions', label: __('actions') }
            ],
            totalRows: 0,
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: '',
            statusFilter: '', // '' = all, otherwise a return status id
            searchTimer: null,
            summary: { total: 0, by_status: {} },
            isLoading: false,
            edit_record: null,
            returnRequests: [],
        }
    },
    computed: {
        statusChips() {
            const by = this.summary.by_status || {};
            const count = (id) => parseInt(by[id]) || 0;
            const chips = [{ key: 'all', id: '', label: __('all'), count: parseInt(this.summary.total) || 0 }];
            // Pending first (needs action); the rarer statuses only appear once something is in them
            [STATUS.pending, STATUS.deliveryBoyAssigned, STATUS.outForPickup, STATUS.receivedFromCustomer,
             STATUS.approved, STATUS.rejected, STATUS.returnToSeller, STATUS.cancelled].forEach(id => {
                if (count(id) > 0 || [STATUS.pending, STATUS.approved, STATUS.rejected].includes(id)) {
                    chips.push({ key: id, id: id, label: this.statusLabel(id), count: count(id) });
                }
            });
            return chips;
        },
    },
    created: function () {
        this._handleReturnRequestSaved = (message) => {
            this.showMessage("success", message);
            this.getReturnRequests();
        };
        this.$eventBus.$on('returnRequestSaved', this._handleReturnRequestSaved);
        this.getReturnRequests();
    },
    beforeDestroy() {
        clearTimeout(this.searchTimer);
        this.$eventBus.$off('returnRequestSaved', this._handleReturnRequestSaved);
    },
    watch: {
        // debounce typing so each keystroke doesn't hit the API
        filter() {
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.currentPage = 1;
                this.getReturnRequests();
            }, 350);
        },
        currentPage() {
            this.getReturnRequests();
        },
        perPage() {
            this.currentPage = 1;
            this.getReturnRequests();
        }
    },
    methods: {
        getReturnRequests() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/seller/return_requests', {
                params: {
                    search: (this.filter || '').trim(),
                    status: this.statusFilter === '' ? undefined : this.statusFilter,
                    offset: (this.currentPage - 1) * this.perPage,
                    limit: this.perPage
                }
            }).then((response) => {
                this.isLoading = false;
                this.returnRequests = response.data.data || [];
                this.totalRows = response.data.total != null ? response.data.total : this.returnRequests.length;
                if (response.data.summary) this.summary = response.data.summary;
                // the last item of a later page was removed/filtered out: step back instead of showing an empty page
                if (this.returnRequests.length === 0 && this.currentPage > 1) this.currentPage = this.currentPage - 1;
            }).catch(() => {
                this.isLoading = false;
                this.showError(__('something_went_wrong'));
            });
        },
        setStatus(id) {
            this.statusFilter = id;
            this.currentPage = 1;
            this.getReturnRequests();
        },
        deleteReturnRequests(id) {
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
                    axios.post(this.$apiUrl + '/seller/return_requests_delete', { id: id })
                        .then((response) => {
                            this.showSuccess(response.data.message);
                            this.getReturnRequests(); // reload so the page, total and status counts stay correct
                        })
                        .catch(() => {
                            this.isLoading = false;
                            this.showError(__('something_went_wrong'));
                        });
                }
            });
        },
        hideModal() {
            this.edit_record = null;
        },

        // ---- presentation ----
        statusLabel(status) {
            switch (Number(status)) {
                case STATUS.pending: return __('pending');
                case STATUS.approved: return __('approved');
                case STATUS.rejected: return __('rejected');
                case STATUS.deliveryBoyAssigned: return __('delivery_boy_assigned');
                case STATUS.outForPickup: return __('out_for_pickup');
                case STATUS.receivedFromCustomer: return __('received_from_customer');
                case STATUS.cancelled: return __('cancelled');
                case STATUS.returnToSeller: return __('return_to_seller');
                default: return __('undefined');
            }
        },
        statusTone(status) {
            switch (Number(status)) {
                case STATUS.pending: return 'amber';
                case STATUS.approved: return 'green';
                case STATUS.rejected: case STATUS.cancelled: return 'red';
                case STATUS.deliveryBoyAssigned: return 'purple';
                case STATUS.outForPickup: case STATUS.receivedFromCustomer: return 'blue';
                default: return 'slate';
            }
        },
        formatMoney(value) {
            const n = parseFloat(value);
            if (isNaN(n)) return '0';
            // whole amounts stay compact (4,000); fractional ones always show paise (8,336.30)
            const digits = Number.isInteger(n) ? 0 : 2;
            return n.toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: 2 });
        },
        initials(name) {
            const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
            if (!parts.length) return '?';
            return ((parts[0][0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
        },
        // Stable colour per shop so the same shop always gets the same avatar
        avatarTone(name) {
            const tones = ['blue', 'green', 'purple', 'amber', 'red'];
            let hash = 0;
            String(name || '').split('').forEach(ch => { hash = (hash * 31 + ch.charCodeAt(0)) % 997; });
            return tones[hash % tones.length];
        },
    }
};
</script>
