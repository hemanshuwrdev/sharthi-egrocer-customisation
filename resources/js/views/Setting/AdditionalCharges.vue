<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('additional_charge') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('additional_charge') }}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">{{ __('additional_charge') }}</h4>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="saveAdditionalCharges">
                            <b-tabs v-model="activeLanguageTab" lazy>
                                <b-tab v-for="language in languages" :key="language.id">
                                    <template #title>
                                        <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                            {{ language.name }}
                                        </span>
                                    </template>

                                    <div class="mb-3" v-if="language.is_default && languages.length > 1">
                                        <b-button size="sm" variant="outline-primary" class="mr-2"
                                            @click="translateEmptyAdditionalCharges(language)" v-b-tooltip.hover
                                            title="Only empty fields will be translated."
                                            :disabled="loadingEmpty || loadingOverwrite">
                                            <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                            <b-spinner v-else small></b-spinner>
                                        </b-button>
                                        <b-button size="sm" variant="outline-danger"
                                            @click="translateOverwriteAdditionalCharges(language)" v-b-tooltip.hover
                                            title="All fields will be translated and overwritten."
                                            :disabled="loadingEmpty || loadingOverwrite">
                                            <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                                            <b-spinner v-else small></b-spinner>
                                        </b-button>
                                        <div v-if="translateSuccessMessage" class="text-success mt-2 font-weight-bold">
                                            {{
                                                translateSuccessMessage }}</div>
                                    </div>

                                    <div v-for="(charge, index) in additionalCharges" :key="index"
                                        class="charge-card mb-3 p-3 border rounded">

                                        <!-- Row 1: Title + Value -->
                                        <div class="row align-items-end">
                                            <div class="col-md-4">
                                                <div class="form-group mb-2">
                                                    <label>{{ __('charge_title') }} <span v-if="language.is_default"
                                                            class="text-danger">*</span></label>
                                                    <input type="text" class="form-control"
                                                        v-model="charge.title[language.code]"
                                                        :placeholder="__('charge_title')"
                                                        :required="language.is_default ? true : undefined">
                                                </div>
                                            </div>

                                            <template v-if="language.is_default">
                                                <!-- Charge Type: Amount or Percentage -->
                                                <div class="col-md-2">
                                                    <div class="form-group mb-2">
                                                        <label>{{ __('charge_type') }}</label>
                                                        <select class="form-control form-select"
                                                            v-model="charge.charge_type">
                                                            <option value="amount">{{ __('amount') }}</option>
                                                            <option value="percentage">{{ __('percentage') }}</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <!-- Value field (changes based on type) -->
                                                <div class="col-md-2">
                                                    <div class="form-group mb-2">
                                                        <label>{{ charge.charge_type === 'percentage' ? __('percentage')
                                                            : __('charge_amount') }}</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text">
                                                                {{ charge.charge_type === 'percentage' ? '%' : $currency
                                                                }}
                                                            </span>
                                                            <input type="number" class="form-control"
                                                                v-model="charge.amount" :id="'charge_amount_' + index"
                                                                min="0"
                                                                :max="charge.charge_type === 'percentage' ? 100 : undefined"
                                                                step="0.01" required>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Refundable Toggle -->
                                                <div class="col-md-2">
                                                    <div class="form-group mb-2">
                                                        <label>{{ __('refundable') }}</label>
                                                        <div class="form-check form-switch mt-1">
                                                            <input class="form-check-input" type="checkbox"
                                                                :id="'refundable_' + index"
                                                                v-model="charge.is_refundable">
                                                            <label class="form-check-label"
                                                                :for="'refundable_' + index">
                                                                {{ charge.is_refundable ? __('yes') : __('no') }}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Status Toggle -->
                                                <div class="col-md-1">
                                                    <div class="form-group mb-2">
                                                        <label>{{ __('status') }}</label>
                                                        <div class="form-check form-switch mt-1">
                                                            <input class="form-check-input" type="checkbox"
                                                                :id="'status_' + index" v-model="charge.is_active">
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Delete -->
                                                <div class="col-md-1 d-flex align-items-end mb-2">
                                                    <button v-if="$can('additional_charges_delete')" type="button"
                                                        class="btn btn-danger" @click="removeCharge(index)">
                                                        <i class="fa fa-trash"></i>
                                                    </button>
                                                </div>
                                            </template>
                                        </div>

                                        <!-- Row 2: Applicable On (only for default language) -->
                                        <div class="row mt-1" v-if="language.is_default">
                                            <div class="col-12">
                                                <label class="me-3">{{ __('applicable_on') }}:</label>
                                                <div class="form-check form-check-inline">
                                                    <input class="form-check-input" type="checkbox"
                                                        :id="'type_order_' + index" value="order"
                                                        v-model="charge.applicable_on">
                                                    <label class="form-check-label" :for="'type_order_' + index">{{
                                                        __('order') }}</label>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </b-tab>
                            </b-tabs>

                            <div class="mt-3 d-flex justify-content-end">
                                <button v-if="$can('additional_charges_create')" type="button" class="btn btn-success"
                                    @click="addCharge">{{
                                        __('add_charge')
                                    }}</button>
                            </div>

                            <b-button v-if="$can('additional_charges_update')" type="submit" variant="primary"
                                class="mt-3" :disabled="isLoading">
                                {{ __('update') }}
                                <b-spinner v-if="isLoading" small />
                            </b-button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
import axios from "axios";

export default {
    data() {
        return {
            additionalCharges: [],
            languages: [],
            activeLanguageTab: 0,
            isLoading: false,
            isLoadingLanguages: false,
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
        };
    },

    methods: {
        fetchActiveLanguages() {
            if (this.languages.length) {
                return Promise.resolve(this.languages);
            }
            this.isLoadingLanguages = true;
            return axios.get(this.$apiUrl + '/active_languages')
                .then(res => {
                    this.languages = res.data.data || [];
                    const def = this.languages.find(l => l.is_default);
                    if (def) this.defaultLanguageId = def.id;
                })
                .catch(() => {
                    this.languages = [];
                })
                .finally(() => {
                    this.isLoadingLanguages = false;
                });
        },

        getAdditionalCharges() {
            axios.get(this.$apiUrl + '/additional_charges')
                .then(res => {
                    let data = res.data.data;
                    if (!Array.isArray(data)) {
                        this.additionalCharges = [];
                        return;
                    }
                    const languages = this.languages && this.languages.length ? this.languages : [{ code: 'en', is_default: 1 }];
                    this.additionalCharges = data.map(charge => {
                        const titleObject = {};
                        if (typeof charge.title === 'object' && charge.title !== null) {
                            languages.forEach(lang => {
                                titleObject[lang.code] = charge.title[lang.code] != null ? String(charge.title[lang.code]) : '';
                            });
                        } else {
                            languages.forEach(lang => {
                                titleObject[lang.code] = '';
                            });
                        }
                        const amount = parseFloat(charge.amount);
                        return {
                            id: charge.id || null,
                            title: titleObject,
                            amount: isNaN(amount) ? 0 : amount,
                            charge_type: charge.charge_type || 'amount',
                            is_refundable: charge.is_refundable === true || charge.is_refundable === 1,
                            is_active: charge.is_active !== false && charge.is_active !== 0,
                            applicable_on: Array.isArray(charge.applicable_on) ? charge.applicable_on.filter(v => v !== 'pos') : ['order'],
                        };
                    });
                })
                .catch(() => {
                    this.additionalCharges = [];
                });
        },

        addCharge() {
            const newCharge = {
                id: null,
                title: {},
                amount: 0,
                charge_type: 'amount',
                is_refundable: false,
                is_active: true,
                applicable_on: ['order'],
            };
            this.languages.forEach(lang => {
                newCharge.title[lang.code] = '';
            });
            this.additionalCharges.push(newCharge);
        },

        removeCharge(index) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_wont_be_able_to_revert_this'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: __('yes_delete_it'),
                cancelButtonText: __('cancel'),
            }).then((result) => {
                if (result.isConfirmed) {
                    this.additionalCharges.splice(index, 1);
                }
            });
        },

        saveAdditionalCharges() {
            this.isLoading = true;
            const defaultLang = this.languages.find(l => l.is_default);
            if (!defaultLang) {
                this.showError('Default language not configured');
                this.isLoading = false;
                return;
            }
            for (let i = 0; i < this.additionalCharges.length; i++) {
                const value = this.additionalCharges[i].title[defaultLang.code];
                if (!value || !value.trim()) {
                    this.showError(
                        `${__('charge_title')} (default language) is required for charge #${i + 1}`
                    );
                    this.isLoading = false;
                    return;
                }
            }
            const payload = this.additionalCharges.map(charge => {
                const cleanTitle = {};
                this.languages.forEach(lang => {
                    let value = charge.title[lang.code] || '';
                    value = value
                        .replace(/\r?\n|\r/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                    cleanTitle[lang.code] = value;
                });
                return {
                    id: charge.id || null,
                    title: cleanTitle,
                    amount: charge.amount || 0,
                    charge_type: charge.charge_type || 'amount',
                    is_refundable: charge.is_refundable ? true : false,
                    is_active: charge.is_active ? true : false,
                    applicable_on: charge.applicable_on || ['order'],
                };
            });
            axios.post(this.$apiUrl + '/additional_charges/save', {
                additional_charges: JSON.stringify(payload)
            })
                .then(res => {
                    if (res.data.status === 1) {
                        this.showMessage('success', res.data.message);
                        this.getAdditionalCharges();
                    } else {
                        this.showError(res.data.message);
                    }
                    this.isLoading = false;
                })
                .catch(err => {
                    this.isLoading = false;
                    this.showError(
                        err.response?.data?.message ||
                        err.message ||
                        __('something_went_wrong')
                    );
                });
        },

        _translateAdditionalCharges(emptyOnly) {
            const defaultLang = this.languages.find(l => l.is_default);
            if (!defaultLang || !defaultLang.code) {
                this.showError(__('default_language_data_missing') || 'Default language not found');
                return Promise.reject();
            }
            const source = {};
            this.additionalCharges.forEach((charge, i) => {
                source['charge_' + i + '_title'] = charge.title[defaultLang.code] || '';
            });
            if (Object.values(source).every(v => !v || !String(v).trim())) {
                this.showError(__('default_language_data_missing') || 'Fill charge titles in default language first');
                return Promise.reject();
            }

            if (emptyOnly) {
                let hasEmptyField = false;
                for (const lang of this.languages) {
                    if (lang.is_default) continue;
                    for (let i = 0; i < this.additionalCharges.length; i++) {
                        const charge = this.additionalCharges[i];
                        const val = charge.title[lang.code];
                        if (!val || String(val).trim() === '') {
                            hasEmptyField = true;
                            break;
                        }
                    }
                    if (hasEmptyField) break;
                }
                if (!hasEmptyField) {
                    this.showError(__('translation_error_all_fields_filled') || 'All fields already have values. There is nothing to translate.');
                    return Promise.reject();
                }
            }

            this.translateSuccessMessage = '';
            if (emptyOnly) this.loadingEmpty = true; else this.loadingOverwrite = true;
            const url = emptyOnly ? 'languages/translate-empty' : 'languages/translate-overwrite';
            return axios.post(this.$apiUrl + '/' + url, { target_language: defaultLang.code, data: source })
                .then(res => {
                    const allTranslations = res.data.data || {};
                    this.languages.forEach(lang => {
                        if (lang.is_default) return;
                        const translated = allTranslations[lang.code];
                        if (!translated) return;
                        this.additionalCharges.forEach((charge, i) => {
                            const key = 'charge_' + i + '_title';
                            const val = translated[key];
                            if (val == null) return;
                            if (emptyOnly && charge.title[lang.code]) return;
                            this.$set(charge.title, lang.code, val);
                        });
                    });
                    this.translateSuccessMessage = emptyOnly
                        ? (__('translation_completed_successfully') || 'Translation completed successfully')
                        : (__('translation_overwritten_successfully') || 'Translation overwritten successfully');
                    setTimeout(() => { this.translateSuccessMessage = ''; }, 5000);
                })
                .catch(err => {
                    this.showError(err.response?.data?.message || err.message || __('something_went_wrong'));
                    throw err;
                })
                .finally(() => {
                    if (emptyOnly) this.loadingEmpty = false; else this.loadingOverwrite = false;
                });
        },

        translateEmptyAdditionalCharges(language) {
            if (!language || !language.is_default) return;
            this._translateAdditionalCharges(true);
        },
        translateOverwriteAdditionalCharges(language) {
            if (!language || !language.is_default) return;
            this._translateAdditionalCharges(false);
        },
    },

    async mounted() {
        this.isLoading = true;
        try {
            await this.fetchActiveLanguages();
            await this.getAdditionalCharges();
        } finally {
            this.isLoading = false;
        }
    }
};
</script>
<style scoped>
.charge-card {
    background: #fafbfc;
}

.charge-card:hover {
    background: #f0f4f8;
}
</style>