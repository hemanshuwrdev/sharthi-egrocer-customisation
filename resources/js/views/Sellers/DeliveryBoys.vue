<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('delivery_boys') }}</h3>
            <router-link to="/seller/delivery_boys/create"
                class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                v-b-tooltip.hover :title="__('add_delivery_boy')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add') }}</span>
            </router-link>
        </div>

        <!-- Status chips (counts cover every driver) + the cash drivers are still holding -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div class="ui-chips">
                <button type="button" v-for="chip in statusChips" :key="chip.key" class="ui-chip"
                    :class="{ 'ui-chip--on': String(filterStatus) === String(chip.id) }" @click="filterStatus = chip.id">
                    {{ chip.label }} <span>{{ chip.count }}</span>
                </button>
            </div>
            <span class="ui-pill ui-tone--amber" v-if="cashWithDrivers > 0"
                v-b-tooltip.hover :title="__('Cash collected by drivers that they have not handed over yet')">
                <i class="fa fa-wallet"></i> {{ __('Cash with drivers') }}
                <strong>{{ $currency }}{{ formatMoney(cashWithDrivers) }}</strong>
            </span>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('Search by name, mobile or address')"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getDeliveryBoys()">
                    <i class="fa fa-sync-alt" :class="{ 'fa-spin': isLoading }" aria-hidden="true"></i>
                </button>
            </div>

            <div class="table-responsive">
                <b-table :items="filteredBoys" :fields="fields" :current-page="currentPage"
                    :per-page="perPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection" :bordered="false" :busy="isLoading" stacked="md" show-empty>

                    <template #table-busy>
                        <div class="text-center my-2">
                            <b-spinner class="align-middle" small></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #empty>
                        <div class="ui-empty">
                            <div class="ui-empty__icon"><i class="fa fa-motorcycle"></i></div>
                            <h3>{{ __('No delivery boys found') }}</h3>
                            <p>{{ (filter || filterStatus !== '') ? __('Nothing matches this search or status. Try changing or clearing it.') : __('Add your first delivery boy to start assigning deliveries.') }}</p>
                        </div>
                    </template>

                    <template #cell(name)="row">
                        <div class="ui-person">
                            <span class="ui-avatar" :class="'ui-tone--' + avatarTone(row.item.name)">{{ initials(row.item.name) }}</span>
                            <div class="ui-cell">
                                <strong :title="row.item.name">{{ row.item.name || '-' }}</strong>
                                <span>{{ row.item.mobile | mobileMask }}</span>
                            </div>
                        </div>
                    </template>

                    <template #cell(address)="row">
                        <span v-if="row.item.address" class="ui-clamp" :title="row.item.address">{{ row.item.address }}</span>
                        <span v-else class="ui-dash">-</span>
                    </template>

                    <template #cell(balance)="row">
                        <span v-if="Number(row.item.balance) > 0" class="ui-money">{{ $currency }}{{ formatMoney(row.item.balance) }}</span>
                        <span v-else class="ui-dash">-</span>
                    </template>

                    <template #cell(cash_received)="row">
                        <span v-if="Number(row.item.cash_received) > 0" class="ui-money">{{ $currency }}{{ formatMoney(row.item.cash_received) }}</span>
                        <span v-else class="ui-dash">-</span>
                    </template>

                    <template #cell(status)="row">
                        <span class="ui-pill" :class="'ui-tone--' + statusTone(row.item.status)">
                            <span class="ui-dot"></span>{{ statusLabel(row.item.status) }}
                        </span>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <router-link
                                :to="{ name: 'SellerEditDeliveryBoy', params: { id: row.item.id, record: row.item } }"
                                class="list-action-btn is-edit" v-b-tooltip.hover :title="__('edit')">
                                <i class="fa fa-pencil-alt"></i>
                            </router-link>

                            <button class="list-action-btn is-delete"
                                :class="{ 'is-disabled': row.item.is_deletable === false }"
                                @click="deleteDeliveryBoys(row.item)"
                                v-b-tooltip.hover.left="{ boundary: 'viewport', customClass: 'text-nowrap-tooltip' }"
                                :title="row.item.is_deletable === false ? row.item.delete_block_reason : __('delete')"><i
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
    </div>
</template>
<script>
import axios from 'axios';
import { SIMPLE_DRIVER_STATUS } from './driverStatusConfig';

// delivery_boys.status: 0 registered, 1 active, 2 not approved, 3 deactive, 4 blocked, 7 removed
const STATUS = { registered: 0, active: 1, notApproved: 2, deactive: 3, blocked: 4, removed: 7 };

export default {
    name: 'SellerDeliveryBoys',
    data: function () {
        return {
            fields: [
                { key: 'name', label: __('name'), sortable: true },
                { key: 'address', label: __('address'), sortable: true },
                { key: 'balance', label: __('balance') + ' (' + this.$currency + ')', sortable: true, class: 'ui-num' },
                { key: 'cash_received', label: __('cash_received') + ' (' + this.$currency + ')', sortable: true, class: 'ui-num' },
                { key: 'status', label: __('status'), sortable: true },
                { key: 'actions', label: __('actions') }
            ],
            currentPage: 1,
            perPage: this.$perPage,
            pageOptions: this.$pageOptions,
            sortBy: '',
            sortDesc: false,
            sortDirection: 'asc',
            filter: '',
            filterStatus: '', // '' = all, otherwise a status id
            isLoading: false,
            deliveryBoys: [],
            currentLanguageId: null,
            activeLanguages: []
        }
    },
    computed: {
        // Names/addresses can be translated per language
        translatedDeliveryBoys() {
            if (!this.currentLanguageId || !Array.isArray(this.deliveryBoys)) {
                return this.deliveryBoys;
            }
            return this.deliveryBoys.map(boy => {
                const translatedBoy = { ...boy };
                if (boy.translations && Array.isArray(boy.translations)) {
                    const translation = boy.translations.find(t => t.language_id === this.currentLanguageId);
                    if (translation) {
                        if (translation.name && translation.name.trim() !== '') translatedBoy.name = translation.name;
                        if (translation.address && translation.address.trim() !== '') translatedBoy.address = translation.address;
                        if (translation.other_payment_information && translation.other_payment_information.trim() !== '') {
                            translatedBoy.other_payment_information = translation.other_payment_information;
                        }
                    }
                }
                return translatedBoy;
            });
        },
        // status chip + search applied in the browser (the list is loaded whole, like before)
        filteredBoys() {
            const term = (this.filter || '').trim().toLowerCase();
            return this.translatedDeliveryBoys.filter(b => {
                if (this.filterStatus !== '' && String(b.status) !== String(this.filterStatus)) return false;
                if (!term) return true;
                return [b.name, b.mobile, b.address].some(v => String(v || '').toLowerCase().indexOf(term) >= 0);
            });
        },
        totalRows() {
            return this.filteredBoys.length;
        },
        statusChips() {
            const count = (id) => this.deliveryBoys.filter(b => b.status === id).length;
            const chips = [{ key: 'all', id: '', label: __('all'), count: this.deliveryBoys.length }];
            // SIMPLE_DRIVER_STATUS (driverStatusConfig.js): Active / Deactive always get a chip; every other state only when a
            // driver is in it, so nobody is hidden. Flip the flag to false and Not-Approved / Blocked chips are always shown again.
            const alwaysShown = SIMPLE_DRIVER_STATUS ? [STATUS.active, STATUS.deactive] : [STATUS.active, STATUS.notApproved, STATUS.deactive, STATUS.blocked];
            [STATUS.active, STATUS.registered, STATUS.notApproved, STATUS.deactive, STATUS.blocked, STATUS.removed].forEach(id => {
                if (alwaysShown.includes(id) || count(id) > 0) {
                    chips.push({ key: id, id: id, label: this.statusLabel(id), count: count(id) });
                }
            });
            return chips;
        },
        // collected on COD deliveries and not yet handed over (the cash-collection screen subtracts what they hand in)
        cashWithDrivers() {
            return this.deliveryBoys.reduce((sum, b) => sum + (parseFloat(b.cash_received) || 0), 0);
        },
    },
    watch: {
        filter() { this.currentPage = 1; },
        filterStatus() { this.currentPage = 1; },
    },
    created: function () {
        this._handleSaved = (message) => {
            this.showMessage("success", message);
            this.getDeliveryBoys();
        };
        this.$eventBus.$on('deliveryBoysSaved', this._handleSaved);
        this.fetchActiveLanguages().then(() => {
            this.getDeliveryBoys();
        });
    },
    beforeDestroy() {
        this.$eventBus.$off('deliveryBoysSaved', this._handleSaved);
    },
    methods: {
        fetchActiveLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (Array.isArray(response.data.data)) {
                        this.activeLanguages = response.data.data;
                        const appLocale = window.appLocale || 'en';
                        const currentLanguage = this.activeLanguages.find(lang => lang.code === appLocale);
                        if (currentLanguage) {
                            this.currentLanguageId = currentLanguage.id;
                        } else {
                            const defaultLang = this.activeLanguages.find(lang => lang.is_default === 1);
                            if (defaultLang) this.currentLanguageId = defaultLang.id;
                        }
                    }
                })
                .catch(err => {
                    console.error('Language load error:', err);
                });
        },
        getDeliveryBoys() {
            this.isLoading = true;
            axios.get(this.$apiUrl + '/delivery_boys')
                .then((response) => {
                    this.isLoading = false;
                    // Every driver linked to this distributor, whatever the status. A "Registered" (0) driver used to be
                    // hidden here, so one saved with that status vanished from the panel with no way to bring it back.
                    this.deliveryBoys = response.data.data || [];
                })
                .catch(() => {
                    this.isLoading = false;
                    this.showError(__('something_went_wrong'));
                });
        },
        deleteDeliveryBoys(boy) {
            if (boy.is_deletable === false) {
                this.showMessage('error', boy.delete_block_reason);
                return;
            }
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
                    axios.post(this.$apiUrl + '/delivery_boys/delete', { id: boy.id })
                        .then((response) => {
                            this.isLoading = false;
                            if (response.data.status === 1) {
                                this.deliveryBoys = this.deliveryBoys.filter(b => b.id !== boy.id);
                                this.showMessage('success', response.data.message);
                                // deleting the last row of a later page: step back instead of showing an empty page
                                const lastPage = Math.max(1, Math.ceil(this.totalRows / this.perPage));
                                if (this.currentPage > lastPage) this.currentPage = lastPage;
                            } else {
                                this.showMessage('error', response.data.message);
                            }
                        })
                        .catch(() => {
                            this.isLoading = false;
                            this.showError(__('something_went_wrong'));
                        });
                }
            });
        },

        // ---- presentation ----
        statusLabel(status) {
            switch (Number(status)) {
                case STATUS.registered: return __('registered');
                case STATUS.active: return __('active');
                case STATUS.notApproved: return __('not_approved');
                case STATUS.deactive: return __('deactive');
                case STATUS.blocked: return __('blocked');
                case STATUS.removed: return __('removed');
                default: return '-';
            }
        },
        statusTone(status) {
            switch (Number(status)) {
                case STATUS.registered: return 'blue';
                case STATUS.active: return 'green';
                case STATUS.notApproved: return 'amber';
                case STATUS.deactive: case STATUS.removed: return 'red';
                default: return 'slate'; // blocked
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
        // Stable colour per driver so the same person always gets the same avatar
        avatarTone(name) {
            const tones = ['blue', 'green', 'purple', 'amber', 'red'];
            let hash = 0;
            String(name || '').split('').forEach(ch => { hash = (hash * 31 + ch.charCodeAt(0)) % 997; });
            return tones[hash % tones.length];
        },
    }
};
</script>

<style scoped>
.list-action-btn.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: auto;
}
</style>

<style>
/* Delete-blocked tooltip: not scoped, since bootstrap-vue teleports tooltips to <body>. */
.text-nowrap-tooltip .tooltip-inner {
    max-width: 260px;
    white-space: normal;
    text-align: left;
}
</style>
