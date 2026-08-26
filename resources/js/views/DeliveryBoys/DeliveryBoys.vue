<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('delivery_boys') }}</h3>
            <router-link to="/seller/delivery_boys/create"
                class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                v-b-tooltip.hover :title="__('add_delivery_boy')" v-if="$route.path.includes('/seller')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add') }}</span>
            </router-link>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="form-group mb-0">
                    <h6 for="filterStatus" class="box-title">{{ __('status') }}</h6>
                    <select id="filterStatus" name="filterStatus" v-model="filterStatus"
                        @change="getDeliveryBoys()" class="form-control form-select">
                        <option value="">{{ __('all') }}</option>
                        <option value="1">{{ __('active') }}</option>
                        <option value="2">{{ __('not_approved') }}</option>
                        <option value="3">{{ __('deactive') }}</option>
                        <option value="4">{{ __('blocked') }}</option>
                    </select>
                </div>
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')" @input="getDeliveryBoys()"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getDeliveryBoys()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>
            <div class="table-responsive">
                            <b-table :items="translatedDeliveryBoys" :fields="fields" :current-page="currentPage"
                                :per-page="perPage" :filter="filter" :filter-included-fields="filterOn"
                                :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :sort-direction="sortDirection"
                                :bordered="true" :busy="isLoading" stacked="md" show-empty small>

                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>
                                <template #head(balance)="row">
                                    {{ __('balance') }}{{ ' (' + $currency + ')' }}
                                </template>
                                <template #head(cash_received)="row">
                                    {{ __('cash_received') }} {{ '(' + $currency + ')' }}
                                </template>

                                <template #cell(mobile)="row">
                                    {{ row.item.mobile | mobileMask }}
                                </template>

                                <template #cell(bonus_percentage)="row">
                                    <small :id="'bonus' + row.item.id"
                                        class="d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2">
                                        <i class="fa fa-info-circle"></i>
                                    </small>
                                    <b-popover :target="'bonus' + row.item.id" triggers="hover" placement="left">
                                        <template #title>
                                            {{ __('bonus_details') }}
                                        </template>
                                        <table class="table table-borderless">
                                            <tr>
                                                <th>{{ __('bonus_type') }}</th>
                                                <td class="text-end">{{ row.item.bonus_type ===
                                                    1 ? "Commission" : "Fixed/Salaried" }}</td>
                                            </tr>
                                            <tr v-if="row.item.bonus_type === 1">
                                                <th>{{ __('commission') }}</th>
                                                <td class="text-end">{{ row.item.bonus_percentage }}</td>
                                            </tr>
                                            <tr>
                                                <th>{{ __('min_amount') }} ({{ $currency }})</th>
                                                <td class="text-end">{{ row.item.bonus_min_amount }}</td>
                                            </tr>
                                            <tr>
                                                <th>{{ __('max_amount') }} ({{ $currency }})</th>
                                                <td class="text-end">{{ row.item.bonus_max_amount }}</td>
                                            </tr>
                                        </table>
                                    </b-popover>

                                </template>

                                <template #cell(status)="row">
                                    <label v-if="row.item.status == 0" class='badge bg-primary'>{{ __('registered')
                                        }}</label>
                                    <label v-else-if="row.item.status == 1" class='badge bg-success'>{{ __('active')
                                        }}</label>
                                    <label v-else-if="row.item.status == 2" class='badge bg-warning'>{{
                                        __('not_approved') }}</label>
                                    <label v-else-if="row.item.status == 3" class='badge bg-danger'>{{ __('deactive')
                                        }}</label>
                                    <label v-else-if="row.item.status == 4" class='badge bg-black'>{{ __('blocked')
                                        }}</label>
                                    <label v-else-if="row.item.status == 7" class='badge bg-danger'>{{ __('removed')
                                        }}</label>
                                </template>

                                <template #cell(is_available)="row">
                                    <span v-if="row.item.status == 1" class="badge bg-success">{{ __('yes') }}</span>
                                    <span v-else class="badge bg-danger">{{ __('no') }}</span>
                                </template>

                                <template #cell(actions)="row">
                                    <div class="list-actions">
                                        <router-link
                                            :to="{ name: 'SellerEditDeliveryBoy', params: { id: row.item.id, record: row.item } }"
                                            class="list-action-btn is-edit"
                                            v-if="$route.path.includes('/seller')" v-b-tooltip.hover :title="__('edit')">
                                            <i class="fa fa-pencil-alt"></i>
                                        </router-link>

                                        <button class="list-action-btn is-delete"
                                            @click="deleteDeliveryBoys(row.index, row.item.id)"
                                            v-if="$route.path.includes('/seller')" v-b-tooltip.hover :title="__('delete')"><i
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
                { key: 'id', label: __('id'), sortable: true, sortDirection: 'desc' },
                { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
                { key: 'mobile', label: __('mobile'), sortable: true, class: 'text-center' },
                { key: 'address', label: __('address'), sortable: true, class: 'text-center' },
                { key: 'bonus_percentage', label: __('bonus'), sortable: true, class: 'text-center' },
                { key: 'balance', label: __('balance'), sortable: true, class: 'text-center' },
                { key: 'cash_received', label: __('cash_received'), sortable: true, class: 'text-center' },
                { key: 'status', label: __('status'), sortable: true, class: 'text-center' },
                { key: 'is_available', label: __('available'), class: 'text-center' },
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

            categories: null,
            products: null,

            deliveryBoys: [],
            filterStatus: '',
            currentLanguageId: null,
            activeLanguages: []
        }
    },
    computed: {
        translatedDeliveryBoys() {
            if (!this.currentLanguageId || !Array.isArray(this.deliveryBoys)) {
                return this.deliveryBoys;
            }

            return this.deliveryBoys.map(boy => {
                const translatedBoy = { ...boy };

                if (boy.translations && Array.isArray(boy.translations)) {
                    const translation = boy.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (translation) {
                        // translate fields safely
                        if (translation.name && translation.name.trim() !== '') {
                            translatedBoy.name = translation.name;
                        }

                        if (translation.address && translation.address.trim() !== '') {
                            translatedBoy.address = translation.address;
                        }

                        if (translation.other_payment_information && translation.other_payment_information.trim() !== '') {
                            translatedBoy.other_payment_information = translation.other_payment_information;
                        }
                    }
                }

                return translatedBoy;
            });
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
        // Set the initial number of items
        this.totalRows = this.deliveryBoys.length
    },

    created: function () {
        this.$eventBus.$on('deliveryBoysSaved', (message) => {
            this.showMessage("success", message);
            this.getDeliveryBoys();
            this.create_new = null;
        });
        this.fetchActiveLanguages().then(() => {
            this.getDeliveryBoys();
        });
    },
    methods: {
        fetchActiveLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (Array.isArray(response.data.data)) {
                        this.activeLanguages = response.data.data;

                        const appLocale = window.appLocale || 'en';

                        const currentLanguage = this.activeLanguages.find(
                            lang => lang.code === appLocale
                        );

                        if (currentLanguage) {
                            this.currentLanguageId = currentLanguage.id;
                        } else {
                            const defaultLang = this.activeLanguages.find(
                                lang => lang.is_default === 1
                            );
                            if (defaultLang) {
                                this.currentLanguageId = defaultLang.id;
                            }
                        }
                    }
                })
                .catch(err => {
                    console.error('Language load error:', err);
                });
        },
        getDeliveryBoys() {
            this.isLoading = true

            axios.get(this.$apiUrl + '/delivery_boys', {
                params: {
                    filterStatus: this.filterStatus,
                    search: this.filter
                }
            })
                .then((response) => {
                    this.isLoading = false
                    this.deliveryBoys = response.data.data.filter(boy => boy.status !== 0) || []
                    this.totalRows = this.deliveryBoys.length
                });
        },
        deleteDeliveryBoys(index, id) {
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
                    axios.post(this.$apiUrl + '/delivery_boys/delete', postData)
                        .then((response) => {
                            this.isLoading = false
                            this.deliveryBoys.splice(index, 1)
                            this.showMessage('success', response.data.message);
                        });
                }
            });
        },

        hideModal() {
            this.create_new = false
            this.edit_record = false
            this.$router.push({ path: '/delivery_boys' });
        },
    }
};
</script>
