<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" scrollable no-close-on-backdrop no-fade
        static>
        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">
                {{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>
            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>
        <form ref="my-form" @submit.prevent="saveRecord">


            <!-- Language Tabs with lazy rendering (lazy avoids hidden required fields triggering "not focusable" error) -->
            <b-tabs :key="tabsKey" v-model="activeLanguageTab" content-class="mt-3" v-if="languages.length > 0">

                <b-tab v-for="language in languages" :key="language.id" :title="language.name" lazy>

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

                    </div>
                    <!-- Translate buttons END -->

                    <div v-if="translations[language.id]">
                        <div class="row">
                            <div class="form-group">
                                <label>{{ __('name') }}</label>
                                <i class="text-danger" v-if="language.is_default">*</i>
                                <input type="text" class="form-control"
                                    :required="language.is_default ? true : undefined"
                                    v-model="translations[language.id].name" placeholder="Enter unit name.">
                            </div>

                            <div class="form-group">
                                <label>{{ __('short_code') }}</label>
                                <i class="text-danger" v-if="language.is_default">*</i>

                                <input type="text" class="form-control"
                                    :required="language.is_default ? true : undefined"
                                    v-model="translations[language.id].short_code"
                                    placeholder="Enter short code of unit name.">
                            </div>
                            <div class="form-group" v-if="language.is_default">
                                <label>{{ __('parent_id') }}</label>
                                <select class="form-control form-select" v-model="parent_id">
                                    <option value="0">{{ __('units') }}</option>
                                    <option v-for="unit in units" :value="unit.id">{{ unit.name }}</option>
                                </select>
                            </div>
                            <div class="form-group" v-if="language.is_default">
                                <label>{{ __('conversion') }}</label>
                                <input type="number" class="form-control" v-model="conversion"
                                    placeholder="Enter Conversion." min="1" @input="validateConversion">
                                <span v-if="validationError" class="error">{{ validationError }}</span>
                            </div>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
            <div v-else class="text-center p-5">
                <b-spinner label="Loading languages..."></b-spinner>
                <p class="mt-2">{{ __('loading_languages') }}</p>
            </div>
            <button ref="dummy_submit" style="display:none;"></button>
        </form>
    </b-modal>
</template>

<script>
import axios from 'axios';
import TranslationHelper from '../../../mixins/TranslationHelper.js';

export default {
    props: ['record', 'units'],

    data() {
        return {
            isLoading: false,
            isLoadingData: true,

            id: this.record?.id || null,
            parent_id: this.record?.parent_id || 0,
            conversion: this.record?.conversion || 1,

            languages: [],
            translations: {},
            originalTranslationLanguages: [],
            defaultLanguageId: null,
            activeLanguageTab: 0,
            validationError: null,
            tabsKey: 0,

            // Translate Button 
            translatableFields: ['name', 'short_code'],
            loadingEmpty: false,
            loadingOverwrite: false,
        };
    },

    watch: {
        record: {
            immediate: true,
            deep: true,
            handler(newVal) {
                if (newVal && newVal.id) {
                    this.id = newVal.id;
                    this.parent_id = newVal.parent_id || 0;
                    this.conversion = newVal.conversion || 1;
                    // Reload data when record changes (for edit mode)
                    // Only load if languages are already initialized
                    if (this.languages.length > 0 && Object.keys(this.translations).length > 0) {
                        this.loadUnit();
                    }
                } else {
                    this.id = null;
                    // Reset form for new unit
                    this.parent_id = 0;
                    this.conversion = 1;
                    this.translations = {};
                    this.originalTranslationLanguages = [];
                    if (this.languages.length > 0) {
                        this.initializeTranslations();
                    }
                }
            }
        }
    },

    mixins: [TranslationHelper],

    computed: {
        modal_title: function () {
            let title = this.id ? __('edit') : __('add');
            title += " " + __('unit');
            return title;
        },
    },

    methods: {

        validateConversion() {
            if (this.conversion < 1) {
                this.validationError = __('conversion_must_be_greater_than_zero');
            } else {
                this.validationError = null;
            }
        },
        showModal() {
            this.$refs['my-modal'].show();
            if (this.id && this.languages.length > 0) {
                this.loadUnit();
            }
        },

        hideModal() {
            this.$refs['my-modal'].hide();
            this.id = null;
            this.parent_id = 0;
            this.conversion = 1;
            this.translations = {};
            this.originalTranslationLanguages = [];
            this.validationError = null;
        },

        deferDataLoad() {
            this.isLoadingData = true;

            this.fetchActiveLanguages()
                .then(() => {
                    if (this.id) {
                        return this.loadUnit();
                    }
                })
                .finally(() => {
                    this.isLoadingData = false;
                });
        },

        fetchActiveLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(res => {
                    this.languages = res.data.data;

                    const defaultLang = this.languages.find(l => l.is_default == 1);
                    if (defaultLang) {
                        this.defaultLanguageId = defaultLang.id;
                    }

                    this.initializeTranslations();
                });
        },

        initializeTranslations() {
            this.languages.forEach(lang => {
                if (!this.translations[lang.id]) {
                    this.$set(this.translations, lang.id, {
                        name: '',
                        short_code: '',
                    });
                }
            });
        },

        loadUnit() {
            return axios.get(this.$apiUrl + '/units', {
                params: { id: this.id }
            }).then(res => {
                const unit = res.data.data[0];

                if (!unit) {
                    console.error('Unit not found');
                    return;
                }

                // Set main table fields
                this.parent_id = unit.parent_id || 0;
                this.conversion = unit.conversion || 1;

                // Ensure all languages are initialized first
                this.initializeTranslations();

                this.originalTranslationLanguages = [];

                // Process translations with fallback logic
                this.languages.forEach(lang => {
                    const translation = Array.isArray(unit.translations)
                        ? unit.translations.find(t => t.language_id === lang.id)
                        : null;

                    // Track if this language had a translation initially
                    if (translation && (translation.name || translation.short_code)) {
                        this.originalTranslationLanguages.push(lang.id);
                    }

                    if (lang.is_default) {
                        // For default language, use translation if exists, otherwise fallback to main table data
                        this.$set(this.translations, lang.id, {
                            name: (translation && translation.name && translation.name.trim() !== '')
                                ? translation.name
                                : (unit.name || ''),
                            short_code: (translation && translation.short_code && translation.short_code.trim() !== '')
                                ? translation.short_code
                                : (unit.short_code || ''),
                        });
                    } else {
                        // For other languages, use translation if exists, otherwise empty
                        this.$set(this.translations, lang.id, {
                            name: (translation && translation.name) ? translation.name : '',
                            short_code: (translation && translation.short_code) ? translation.short_code : '',
                        });
                    }
                });

                this.tabsKey++;
            });
        },

        validateDefaultLanguage() {
            if (!this.defaultLanguageId) {
                this.showError(__('default_language_not_found'));
                return false;
            }

            const defaultTranslation = this.translations[this.defaultLanguageId];

            // Check required fields for default language
            if (!defaultTranslation.name || defaultTranslation.name.trim() === '') {
                this.showError(__('please_fill_name_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            if (!defaultTranslation.short_code || defaultTranslation.short_code.trim() === '') {
                this.showError(__('please_fill_short_code_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            return true;
        },

        validateDefaultLanguageForTranslation() {
            const form = this.$refs['my-form'];
            if (form && !form.reportValidity()) {
                this.$nextTick(() => this.switchToDefaultLanguageTab());
                return false;
            }
            return this.validateDefaultLanguage();
        },

        switchToDefaultLanguageTab() {
            const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.activeLanguageTab = defaultLangIndex;
            }
        },

        saveRecord() {
            if (!this.validateDefaultLanguage()) return;

            this.isLoading = true;

            const langsToSave = this.languages.filter(l => {
                const t = this.translations[l.id];
                const hasData = t && (t.name || t.short_code);
                const hadOriginalTranslation = this.originalTranslationLanguages.includes(l.id);

                // Always save default language
                if (l.is_default) {
                    return true;
                }

                return hasData || (this.id && hadOriginalTranslation);
            });

            const save = async () => {
                let unitId = this.id;

                for (const lang of langsToSave) {
                    const t = this.translations[lang.id] || { name: '', short_code: '' };
                    const fd = new FormData();

                    if (unitId) fd.append('id', unitId);
                    fd.append('language_id', lang.id);
                    fd.append('name', t.name || '');
                    fd.append('short_code', t.short_code || '');

                    if (lang.is_default) {
                        fd.append('parent_id', this.parent_id);
                        fd.append('conversion', this.conversion);
                    }

                    const url = unitId
                        ? this.$apiUrl + '/units/update'
                        : this.$apiUrl + '/units/save';

                    const res = await axios.post(url, fd);
                    if (!unitId && res.data?.data?.id) {
                        unitId = res.data.data.id;
                    }
                }
            };

            save()
                .then(() => {
                    this.$emit('saved', __('unit_saved_successfully') ?? 'Unit saved successfully');

                    this.hideModal();
                })
                .catch(err => {
                    this.showError(err.response?.data?.message || __('something_went_wrong'));
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

    },

    mounted() {
        this.showModal();
        this.deferDataLoad();
    }
};
</script>
<style scoped></style>