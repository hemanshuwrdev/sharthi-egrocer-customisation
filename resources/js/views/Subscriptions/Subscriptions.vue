<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('subscription_plans') }}</h3>
            <button class="btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap"
                @click="openAddModal" v-b-tooltip.hover :title="__('add_subscription')"
                v-if="$can('subscription_create')">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>{{ __('add_subscription') }}</span>
            </button>
        </div>

        <div class="list-surface">
            <div class="list-toolbar">
                <div class="d-flex gap-2">
                    <b-form-input id="subscription-name-input" v-model="subscriptionName"
                        type="text" :placeholder="__('enter_subscription_name')"></b-form-input>
                    <button class="btn btn-primary" @click="updateSubscriptionName"
                        :disabled="isUpdatingName" v-b-tooltip.hover :title="__('update')">
                        <span v-if="isUpdatingName">
                            <i class="fa fa-spinner fa-spin"></i>
                        </span>
                        <span v-else>
                            <i class="fa fa-save"></i>
                        </span>
                    </button>
                </div>
                <div class="list-search">
                    <i class="fa fa-search list-search-icon" aria-hidden="true"></i>
                    <b-form-input id="filter-input" v-model="filter" type="search"
                        :placeholder="__('search')" @input="currentPage = 1; getPlans()"></b-form-input>
                </div>
                <button class="list-icon-btn" v-b-tooltip.hover :title="__('refresh')"
                    @click="getPlans()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                </button>
            </div>
            <div class="table-responsive">
                <b-table :items="translatedPlans" :fields="fields" :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc" :sort-direction="sortDirection" :bordered="true"
                    :busy="isLoading" stacked="md" show-empty small class="text-nowrap">

                    <template #table-busy>
                        <div class="text-center text-black my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>{{ __('loading') }}...</strong>
                        </div>
                    </template>

                    <template #cell(name)="row">
                        <strong>{{ row.item.name }}</strong>
                    </template>

                    <template #cell(days)="row">
                        <span>{{ row.item.days }} {{ __('days') }}</span>
                    </template>

                    <template #cell(price)="row">
                        <span>{{ parseFloat(row.item.price).toFixed(2) }}</span>
                    </template>

                    <template #cell(discounted_price)="row">
                        <span v-if="row.item.discounted_price">{{
                            parseFloat(row.item.discounted_price).toFixed(2) }}</span>
                        <span v-else class="text-muted">-</span>
                    </template>

                    <template #cell(free_delivery_above)="row">
                        <span v-if="row.item.free_delivery_above">{{
                            parseFloat(row.item.free_delivery_above).toFixed(2) }}</span>
                        <span v-else class="text-muted">-</span>
                    </template>

                    <template #cell(status)="row">
                        <span class='badge bg-success' v-if="row.item.status == 1">{{ __('active')
                            }}</span>
                        <span class='badge bg-danger' v-if="row.item.status == 0">{{ __('deactive')
                            }}</span>
                    </template>

                    <template #cell(actions)="row">
                        <div class="list-actions">
                            <button class="list-action-btn is-edit" @click="editPlan(row.item)"
                                v-if="$can('subscription_update')" v-b-tooltip.hover :title="__('edit')"><i
                                    class="fa fa-pencil-alt"></i></button>
                            <button class="list-action-btn is-delete"
                                @click="deletePlan(row.index, row.item.id)"
                                v-if="$can('subscription_delete')" v-b-tooltip.hover
                                :title="__('delete')"><i class="fa fa-trash"></i></button>
                        </div>
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
                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                    align="fill" size="sm" class="list-pagination"></b-pagination>
            </div>
        </div>

        <!-- Create/Edit Subscription Plan Modal -->
        <b-modal v-model="create_new" :title="form.id ? __('edit_subscription_plan') : __('add_subscription')" size="lg"
            hide-footer @hidden="onModalHidden" no-close-on-backdrop>

            <form @submit.prevent="savePlan" id="subscription-form">

                <b-tabs v-if="languages.length && form.translations && Object.keys(form.translations).length > 0"
                    v-model="activeLanguageTab" content-class="mt-3">

                    <b-tab v-for="language in languages" :key="language.id">
                        <template #title>
                            <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                {{ language.name }}
                            </span>
                        </template>

                        <!-- Translate buttons -->
                        <div class="mb-3" v-if="language.is_default && languages.length > 1">
                            <b-button size="sm" variant="outline-primary" class="mr-2" @click="translateEmpty(language)"
                                v-b-tooltip.hover
                                :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                                :disabled="loadingEmpty">
                                <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                <b-spinner v-else small></b-spinner>
                            </b-button>
                            <b-button size="sm" variant="outline-danger" @click="translateOverwrite(language)"
                                v-b-tooltip.hover
                                :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                                :disabled="loadingOverwrite">
                                <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                                <b-spinner v-else small></b-spinner>
                            </b-button>
                            <div v-if="translateSuccessMessage" class="text-success mt-2 font-weight-bold">
                                {{ translateSuccessMessage }}
                            </div>
                        </div>
                        <!-- Translate buttons END -->

                        <!-- PLAN NAME -->
                        <div class="form-group" v-if="form.translations && form.translations[language.id]">
                            <!-- Only default language is logically required (handled in validateDefaultLanguage) -->
                            <i class="text-danger" v-if="language.is_default">*</i>
                            <label>{{ __('plan_name') }}</label>

                            <input type="text" class="form-control" :id="'plan_name_' + language.id"
                                v-model="form.translations[language.id].name" :placeholder="__('enter_plan_name')" />
                        </div>

                        <!-- DEFAULT LANGUAGE FIELDS -->
                        <template v-if="language.is_default">

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="days">{{ __('days') }} <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" v-model="form.days" min="1" :placeholder="__('days')" required />
                                </div>

                                <div class="col-md-6 mt-3 mb-3">
                                    <label>{{ __('status') }} <span class="text-danger">*</span></label>
                                    <b-form-radio-group v-model="form.status" :options="[
                                        { text: __('deactive'), value: 0 },
                                        { text: __('active'), value: 1 }
                                    ]" buttons button-variant="outline-primary d-flex gap-2" required />
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <label>
                                        {{ __('price') }} ({{ $currency }})
                                    </label>
                                    <input type="number" class="form-control" id="price" v-model="form.price"
                                        :placeholder="__('enter_price')" step="0.01" min="1" required
                                        @input="validateDiscountedPrice">
                                </div>

                                <div class="col-md-6">
                                    <label>
                                        {{ __('discounted_price') }} ({{ $currency }})
                                    </label>
                                    <input type="number" class="form-control"
                                        :class="{ 'is-invalid': discountedPriceError }" v-model="form.discounted_price"
                                        step="0.01" min="1" @input="validateDiscountedPrice" :placeholder="__('enter_discounted_price')" />
                                    <div v-if="discountedPriceError" class="invalid-feedback">
                                        {{ discountedPriceError }}
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <label>
                                        {{ __('free_delivery_above') }} ({{ $currency }})
                                    </label>
                                    <input type="number" class="form-control" id="free_delivery_above"
                                        v-model="form.free_delivery_above"
                                        :placeholder="__('enter_free_delivery_above')" step="0.01" min="0">
                                    <small class="text-muted">{{ __('minimum_order_amount_for_free_delivery') }}</small>
                                </div>

                                <div class="col-md-6">
                                    <label>{{ __('ios_product_id') }}</label>
                                    <input type="text" class="form-control" id="ios_product_id"
                                        v-model="form.ios_product_id" :placeholder="__('enter_ios_product_id')">
                                    <small class="text-muted">{{ __('ios_in_app_purchase_product_id') }}</small>

                                </div>

                                <div class="col-md-12">
                                    <div class="alert alert-success mt-2 mb-3" role="alert">
                                        <small>
                                            <i class="fa fa-info-circle"></i>
                                            <strong>{{ __('note') }}:</strong> {{
                                                __('please_configure_free_delivery_settings_properly') }}
                                            {{ __('to_avoid_conflicts_with_time_slots') }}.
                                            <router-link to="/delivery_settings" class="alert-link">
                                                {{ __('configure_delivery_settings') }} <i
                                                    class="fa fa-external-link-alt"></i>
                                            </router-link>
                                        </small>
                                    </div>
                                </div>
                            </div>

                        </template>
                    </b-tab>
                </b-tabs>

                <div class="form-group d-flex justify-content-end gap-2">

                    <button type="button" class="btn btn-secondary" @click="closeModal">
                        {{ __('cancel') }}
                    </button>


                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting" @click="savePlan">
                        <span v-if="isSubmitting">{{ __('saving') }}...</span>
                        <span v-else>{{ __('save') }}</span>
                    </button>


                </div>

            </form>
        </b-modal>

    </div>
</template>

<script>
import axios from 'axios';
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    name: 'Subscriptions',
    data() {
        return {
            plans: [],

            languages: [],
            currentLanguageId: null,
            activeLanguageTab: 0,
            isLoadingLanguages: false,
            isLoadingData: false,

            create_new: false,
            edit_record: {},
            form: {
                id: null,
                translations: {},
                days: '',
                price: '',
                discounted_price: '',
                free_delivery_above: '',
                ios_product_id: '',
                status: 1
            },
            isLoading: false,
            isSubmitting: false,
            isUpdatingName: false,
            subscriptionName: '',
            discountedPriceError: '',
            filter: '',
            filterOn: ['id', 'name', 'days', 'price', 'discounted_price', 'free_delivery_above', 'status'],
            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'desc',
            perPage: 10,
            currentPage: 1,
            totalRows: 0,
            pageOptions: [5, 10, 15, 20, 25, 50, 100],

            translatableFields: ['name'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
        }
    },
    async mounted() {
        await this.fetchActiveLanguages();
        this.getPlans();
    },
    computed: {
        defaultLanguageId() {
            const d = this.languages.find(l => l.is_default === 1);
            return d ? d.id : null;
        },
        translations() {
            return this.form.translations || {};
        },
        fields() {
            const c = this.$currency || '';
            return [
                { key: 'id', label: __('id'), sortable: true },
                { key: 'name', label: __('plan_name') },
                { key: 'days', label: __('days') },
                { key: 'price', label: __('price') + ` (${c})` },
                { key: 'discounted_price', label: __('discounted_price') + ` (${c})` },
                { key: 'free_delivery_above', label: __('free_delivery_above') + ` (${c})` },
                { key: 'status', label: __('status') },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ];
        },
        translatedPlans() {
            if (!this.currentLanguageId) return this.plans;

            return this.plans.map(plan => {
                const translated = { ...plan };

                if (Array.isArray(plan.translations)) {
                    const t = plan.translations.find(
                        tr => tr.language_id === this.currentLanguageId
                    );

                    if (t?.name?.trim()) {
                        translated.name = t.name;
                    }
                }

                return translated;
            });
        }
    },

    methods: {

        loadPlanWithTranslations() {
            this.isLoadingData = true;

            return axios.get(this.$apiUrl + '/subscription_plans', {
                params: {
                    id: this.id
                }
            })
                .then(response => {
                    if (!response.data.data) {
                        this.isLoadingData = false;
                        return;
                    }

                    // API may return array or single object
                    const plans = Array.isArray(response.data.data)
                        ? response.data.data
                        : [response.data.data];

                    const plan = plans.length > 0 ? plans[0] : null;

                    if (!plan) {
                        console.error('Subscription plan not found in response');
                        this.isLoadingData = false;
                        return;
                    }


                    this.form.id = plan.id;
                    this.form.days = plan.days;
                    this.form.price = plan.price;
                    this.form.discounted_price = plan.discounted_price;
                    this.form.free_delivery_above = plan.free_delivery_above;
                    this.form.status = plan.status;

                    /* ----------- TRANSLATIONS MERGE ------------ */
                    const updatedTranslations = { ...this.form.translations };

                    // Load translation table data
                    if (plan.translations && Array.isArray(plan.translations)) {
                        plan.translations.forEach(trans => {
                            const langId = trans.language_id;
                            updatedTranslations[langId] = {
                                language_id: langId,
                                name: trans.name || ''
                            };
                        });
                    }

                    this.languages.forEach(language => {
                        if (
                            !updatedTranslations[language.id] ||
                            !updatedTranslations[language.id].name
                        ) {
                            if (language.is_default) {
                                updatedTranslations[language.id] = {
                                    language_id: language.id,
                                    name: plan.name || ''
                                };
                            }
                        }
                    });

                    this.form.translations = updatedTranslations;

                    this.isLoadingData = false;
                })
                .catch(error => {
                    console.error('Error loading subscription plan translations:', error);
                    this.isLoadingData = false;
                    throw error;
                });
        },

        validateDefaultLanguage() {
            const def = this.languages.find(l => l.is_default);
            if (!def) return true;

            const t = this.form.translations?.[def.id];
            if (!t || !t.name || !t.name.trim()) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.activeLanguageTab = this.languages.findIndex(l => l.id === def.id);
                return false;
            }
            return true;
        },

        fetchActiveLanguages() {
            this.isLoadingLanguages = true;

            return axios.get(this.$apiUrl + '/active_languages')
                .then(res => {
                    this.languages = res.data.data || [];

                    const appLocale = window.appLocale || 'en';
                    const current =
                        this.languages.find(l => l.code === appLocale) ||
                        this.languages.find(l => l.is_default);

                    this.currentLanguageId = current?.id || null;
                })
                .finally(() => {
                    this.isLoadingLanguages = false;
                });
        },


        initializeTranslations(existing = [], base = null) {
            const map = {};

            this.languages.forEach(lang => {
                const found = existing.find(
                    t => t.language_id === lang.id
                );

                map[lang.id] = {
                    language_id: lang.id,
                    name:
                        found?.name ??
                        (lang.is_default ? base?.name : '') ??
                        ''
                };
            });

            this.form.translations = map;
        },

        // Get all subscription plans
        async getPlans() {
            this.isLoading = true;
            try {
                const params = {
                    limit: this.perPage,
                    offset: (this.currentPage - 1) * this.perPage,
                    search: this.filter
                };

                const response = await axios.get(this.$apiUrl + '/subscription_plans/', { params });
                if (response.data.status === 1) {
                    // Check if response has plans array or object with plans property
                    if (Array.isArray(response.data.data)) {
                        this.plans = response.data.data;
                        this.totalRows = response.data.total || response.data.data.length;
                    } else if (response.data.data && response.data.data.plans) {
                        // New format with plans and subscription_name
                        this.plans = response.data.data.plans;
                        this.totalRows = response.data.total || response.data.data.plans.length;
                        // Set subscription name if available
                        if (response.data.data.subscription_name !== undefined) {
                            this.subscriptionName = response.data.data.subscription_name || '';
                        }
                    } else {
                        this.plans = [];
                        this.totalRows = 0;
                    }
                } else {
                    this.showError(response.data.message);
                }
            } catch (error) {
                this.showError(__('something_went_wrong'));
            } finally {
                this.isLoading = false;
            }
        },

        // Validate discounted price
        validateDiscountedPrice() {
            this.discountedPriceError = '';

            // Only validate if both price and discounted_price are provided
            if (this.form.discounted_price && this.form.price) {
                const discountedPrice = parseFloat(this.form.discounted_price);
                const regularPrice = parseFloat(this.form.price);

                // Check if discounted price is less than regular price
                if (discountedPrice >= regularPrice) {
                    this.discountedPriceError = __('discounted_price_must_be_less_than_regular_price');
                    return false;
                }

                // Check if discounted price is negative
                if (discountedPrice < 0) {
                    this.discountedPriceError = __('discounted_price_cannot_be_negative');
                    return false;
                }
            }

            return true;
        },

        async checkFreeDeliveryTimeSlots() {
            try {
                const response = await axios.get(this.$apiUrl + '/subscription_plans/check_free_delivery_time_slots');
                if (response.data.status === 1) {
                    return response.data.data.has_free_delivery_time_slots;
                }
                return false;
            } catch (error) {
                console.error('Error checking free delivery time slots:', error);
                return false;
            }
        },

        // Save or update subscription plan
        async savePlan(event) {
            const form = event.target;

            // Validate discounted price before form submission
            if (!this.validateDiscountedPrice()) {
                // Focus on discounted price field if validation fails
                this.$nextTick(() => {
                    const discountedPriceInput = document.getElementById('discounted_price');
                    if (discountedPriceInput) {
                        discountedPriceInput.focus();
                        discountedPriceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                });
                return;
            }

            // Check HTML5 form validation
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (!this.validateDefaultLanguage()) return;
            this.isSubmitting = true;
            const payload = {
                days: this.form.days,
                price: this.form.price,
                discounted_price: this.form.discounted_price || null,
                free_delivery_above: this.form.free_delivery_above || null,
                ios_product_id: this.form.ios_product_id || null,
                status: this.form.status,
                translations: Object.values(this.form.translations)
            };

            let url = this.$apiUrl + '/subscription_plans/save';
            if (this.form.id) {
                url = this.$apiUrl + '/subscription_plans/update/' + this.form.id;
            }

            this.isSubmitting = true;

            axios.post(url, payload)
                .then(res => {
                    if (res.data.status === 1) {
                        this.showMessage('success', res.data.message);
                        this.create_new = false;
                        this.getPlans();
                    } else {
                        this.showError(res.data.message);
                    }
                })
                .finally(() => {
                    this.isSubmitting = false;
                });
        },

        // Edit plan - populate form with plan data and check for conflicts
        async editPlan(plan) {
            this.activeLanguageTab = 0;

            // Check for free delivery time slots before opening edit modal
            const hasFreeDeliveryTimeSlots = await this.checkFreeDeliveryTimeSlots();
            if (hasFreeDeliveryTimeSlots) {
                this.$swal.fire({
                    title: __('cannot_create_subscription_plan'),
                    html: `
                        <div class="text-left">
                            <p>${__('free_delivery_time_slots_exist_message')}</p>
                            <p class="mt-3">
                                <strong>${__('please_remove_free_delivery_time_slots_first')}</strong>
                            </p>
                            <p class="mt-3">
                                <a href="/delivery_settings" class="btn btn-primary btn-sm">
                                    ${__('go_to_delivery_settings')} <i class="fa fa-external-link-alt"></i>
                                </a>
                            </p>
                        </div>
                    `,
                    icon: 'warning',
                    confirmButtonText: __('ok'),
                    confirmButtonColor: '#37a279',
                    width: '600px'
                });
                return;
            }

            this.resetForm();

            await this.fetchActiveLanguages();

            this.form.id = plan.id;
            this.form.days = plan.days;
            this.form.price = plan.price;
            this.form.discounted_price = plan.discounted_price;
            this.form.free_delivery_above = plan.free_delivery_above;
            this.form.ios_product_id = plan.ios_product_id;
            this.form.status = plan.status;

            const map = {};
            this.languages.forEach(l => {
                map[l.id] = { language_id: l.id, name: '' };
            });

            if (Array.isArray(plan.translations)) {
                plan.translations.forEach(t => {
                    map[t.language_id].name = t.name || '';
                });
            }

            const def = this.languages.find(l => l.is_default);
            if (def && !map[def.id].name) {
                map[def.id].name = plan.name || '';
            }

            this.form.translations = map;
            this.activeLanguageTab = 0;
            this.create_new = true;
        },

        // Delete subscription plan
        async deletePlan(index, id) {
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
                    axios.post(this.$apiUrl + `/subscription_plans/delete/${id}`)
                        .then((response) => {
                            this.isLoading = false;
                            if (response.data.status === 1) {
                                this.showMessage('success', response.data.message);
                                this.getPlans();
                            } else {
                                this.showError(response.data.message);
                            }
                        })
                        .catch(error => {
                            this.isLoading = false;
                            this.showError(__('something_went_wrong'));
                        });
                }
            });
        },

        // Reset form to default values
        resetForm() {
            this.form = {
                id: null,
                days: '',
                price: '',
                discounted_price: '',
                free_delivery_above: '',
                ios_product_id: '',
                status: 1,
                translations: {}
            };

            this.discountedPriceError = '';
            this.activeLanguageTab = 0;
        },

        closeModal() {
            this.create_new = false;

        },

        onModalHidden() {
            this.resetForm();
        },

        async openAddModal() {
            this.activeLanguageTab = 0;

            // Check for free delivery time slots before opening the modal
            const hasFreeDeliveryTimeSlots = await this.checkFreeDeliveryTimeSlots();
            if (hasFreeDeliveryTimeSlots) {
                this.$swal.fire({
                    title: __('cannot_create_subscription_plan'),
                    html: `
                        <div class="text-left">
                            <p>${__('free_delivery_time_slots_exist_message')}</p>
                            <p class="mt-3">
                                <strong>${__('please_remove_free_delivery_time_slots_first')}</strong>
                            </p>
                                <p class="mt-3">
                                    <a href="/delivery_settings" class="btn btn-primary btn-sm">
                                        ${__('go_to_delivery_settings')} <i class="fa fa-external-link-alt"></i>
                                    </a>
                                </p>
                        </div>
                    `,
                    icon: 'warning',
                    confirmButtonText: __('ok'),
                    confirmButtonColor: '#37a279',
                    width: '600px'
                });
                return;
            }

            // If no conflicts, proceed to open the modal
            this.resetForm();

            await this.fetchActiveLanguages();
            this.initializeTranslations([], null);
            this.activeLanguageTab = 0;
            this.create_new = true;

        },

        // Update subscription name in settings
        async updateSubscriptionName() {
            if (!this.subscriptionName || this.subscriptionName.trim() === '') {
                this.showError(__('subscription_name_cannot_be_empty'));
                return;
            }

            this.isUpdatingName = true;
            try {
                const response = await axios.post(this.$apiUrl + '/subscription_plans/update_setting', {
                    subscription_name: this.subscriptionName.trim()
                });

                if (response.data.status === 1) {
                    this.showMessage("success", response.data.message);
                } else {
                    this.showError(response.data.message);
                }
            } catch (error) {
                this.showError(__('something_went_wrong'));
            } finally {
                this.isUpdatingName = false;
            }
        }
    },
    watch: {
        // Watch for pagination changes
        currentPage() {
            this.getPlans();
        },

        // Watch for per page changes
        perPage() {
            this.currentPage = 1; // Reset to first page when changing per page
            this.getPlans();
        }
    }
}
</script>
