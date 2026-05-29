<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" scrollable no-close-on-backdrop no-fade
        static>
        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">{{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>
            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>

        <form ref="my-form" @submit.prevent="saveRecord" novalidate>
            <!-- Language Tabs with lazy (same as Category Edit – only active tab in DOM to avoid "not focusable") -->
            <b-tabs v-if="languages.length" v-model="activeTab" content-class="mt-3">
                <b-tab v-for="(lang, index) in languages" :key="lang.id" :title="lang.name"
                    :active="lang.is_default == 1">

                    <!-- Translate buttons -->
                    <div class="mb-3" v-if="lang.is_default && languages.length > 1">
                        <b-button size="sm" variant="outline-primary" class="mr-2" @click="translateEmpty(lang)"
                            v-b-tooltip.hover
                            :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                            :disabled="loadingEmpty">
                            <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                            <b-spinner v-else small></b-spinner>
                        </b-button>

                        <b-button size="sm" variant="outline-danger" @click="translateOverwrite(lang)" v-b-tooltip.hover
                            :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                            :disabled="loadingOverwrite">
                            <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                            <b-spinner v-else small></b-spinner>
                        </b-button>

                    </div>
                    <!-- Translate buttons END -->

                    <div class="row">
                        <div class="form-group">
                            <label>{{ __('title') }}</label>
                            <i class="text-danger" v-if="lang.is_default == 1">*</i>
                            <input type="text" class="form-control" v-model="form[lang.id].title"
                                :placeholder="__('enter_tax_title')"
                                :required="lang.is_default == 1 ? true : undefined">
                        </div>
                        <div class="form-group" v-if="lang.is_default == 1">
                            <label>{{ __('percentage') }}</label>
                            <i class="text-danger" v-if="lang.is_default">*</i>
                            <input type="number" class="form-control" v-model="percentage"
                                :placeholder="__('enter_percentage')" min="1" max="100" @input="validatePercentage"
                                step="0.01" :required="lang.is_default == 1 ? true : undefined">
                            <span v-if="validationError" class="error">{{ validationError }}</span>
                        </div>
                        <div class="form-group" v-if="id && lang.is_default == 1">
                            <label>{{ __('status') }}</label>
                            <div class="col-md-9 text-left mt-1">
                                <b-form-radio-group v-model="status" :options="[
                                    { text: __('deactivate'), 'value': 0 },
                                    { text: __('activate'), 'value': 1 },
                                ]" buttons button-variant="outline-primary"
                                    :required="lang.is_default == 1 ? true : undefined"></b-form-radio-group>
                            </div>
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
            <button ref="dummy_submit" style="display:none;"></button>
        </form>
    </b-modal>
</template>

<script>
import axios from 'axios';
import TranslationHelper from '../../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    props: ['record'],
    data: function () {
        return {

            id: null,
            percentage: null,
            status: null,
            languages: [],
            defaultLanguageId: null,
            activeTab: 0,
            form: {},
            isLoading: false,
            validationError: null,

            // Translate buttons
            translatableFields: ['title'],
            loadingEmpty: false,
            loadingOverwrite: false,
        };
    },
    watch: {
        record: {
            immediate: true,
            deep: true,
            handler(newVal) {
                if (newVal) {
                    // Base fields
                    this.id = newVal.id;
                    this.percentage = newVal.percentage;
                    this.status = newVal.status;
                    this.loadTaxWithTranslations();
                } else {
                    this.id = null;
                    this.percentage = null;
                    this.status = 1;
                    this.form = {};
                }
            }
        }
    },

    computed: {
        modal_title: function () {
            let title = this.id ? __('edit_tax') : __('add_tax');
            return title;
        },
    },
    created: function () {

    },
    methods: {
        showModal() {
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },


        loadTaxWithTranslations() {
            if (!this.id) return;

            axios.get(this.$apiUrl + '/products/taxes', {
                params: { id: this.id }
            }).then(res => {
                const tax = Array.isArray(res.data.data)
                    ? res.data.data[0]
                    : res.data.data;
                if (
                    this.defaultLanguageId &&
                    this.form[this.defaultLanguageId] &&
                    !this.form[this.defaultLanguageId].title
                ) {
                    this.form[this.defaultLanguageId].title = tax.title;
                }

                // base fields
                this.percentage = tax.percentage;
                this.status = tax.status;

                // translations
                if (tax.translations && tax.translations.length) {
                    tax.translations.forEach(tr => {
                        if (!this.form[tr.language_id]) {
                            this.$set(this.form, tr.language_id, { title: '' });
                        }
                        this.form[tr.language_id].title = tr.title;
                    });
                }
                if (this.defaultLanguageId && !this.form[this.defaultLanguageId].title) {
                    this.form[this.defaultLanguageId].title = tax.title;
                }

            });
        }
        ,
        // Use active_languages (admin panel only) so language_id matches backend getDefaultLanguage() – same as Brand Edit
        loadLanguages() {
            return axios.get(this.$apiUrl + '/active_languages').then(res => {
                this.languages = res.data.data || [];
                this.languages.sort((a, b) => (b.is_default || 0) - (a.is_default || 0));

                const defaultLang = this.languages.find(l => l.is_default == 1);
                this.defaultLanguageId = defaultLang ? defaultLang.id : null;

                this.languages.forEach(lang => {
                    let title = '';
                    if (this.record && this.record.translations && this.record.translations.length) {
                        const tr = this.record.translations.find(t => t.language_id === lang.id);
                        if (tr && tr.title) title = tr.title;
                    }
                    if (!title && lang.is_default == 1 && this.record && this.record.title) {
                        title = this.record.title;
                    }
                    this.$set(this.form, lang.id, { title });
                });

                // this.activeTab = 0;
            });
        },

        validateDefaultLanguage() {
            if (!this.defaultLanguageId) {
                this.showError(__('default_language_not_found'));
                return false;
            }

            const defaultTranslation = this.form[this.defaultLanguageId];

            // Check required fields for default language
            if (!defaultTranslation.title || defaultTranslation.title.trim() === '') {
                this.showError(__('please_fill_title_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            return true;
        },

        switchToDefaultLanguageTab() {
            const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.activeTab = defaultLangIndex;
            }
        },

        validateDefaultLanguageForTranslation() {
            const form = this.$refs['my-form'];
            if (form && !form.reportValidity()) {
                this.$nextTick(() => this.switchToDefaultLanguageTab());
                return false;
            }
            return this.validateDefaultLanguage();
        }
        ,
        validatePercentage() {
            if (this.percentage < 0.1 || this.percentage > 100) {
                this.validationError = "Percentage must be between 1 and 100.";
            } else {
                this.validationError = null;
            }
        },
        saveRecord() {

            if (!this.validateDefaultLanguage()) return;

            this.isLoading = true;

            const languagesToSave = [];

            const defaultLang = this.languages.find(l => l.is_default == 1);
            if (defaultLang) languagesToSave.push(defaultLang);

            this.languages.forEach(lang => {
                if (lang.is_default) return;
                const title = this.form[lang.id].title;
                if (title && title.trim() !== '') {
                    languagesToSave.push(lang);
                }
            });

            const saveSequentially = async () => {
                let taxId = this.id;

                for (const lang of languagesToSave) {
                    const fd = new FormData();

                    if (taxId) fd.append('id', taxId);

                    fd.append('language_id', lang.id);
                    fd.append('title', (this.form[lang.id] && this.form[lang.id].title) || '');
                    fd.append('percentage', this.percentage != null ? this.percentage : '');
                    fd.append('status', this.status != null ? this.status : 1);

                    const url = taxId
                        ? this.$apiUrl + '/products/taxes/update'
                        : this.$apiUrl + '/products/taxes/save';

                    const res = await axios.post(url, fd);

                    if (!res.data.status && res.data.message) {
                        throw new Error(res.data.message);
                    }
                    if (!taxId && res.data.data && res.data.data.id) {
                        taxId = res.data.data.id;
                    }
                }
            };

            saveSequentially()
                .then(() => {
                    this.$eventBus.$emit("recordSaved", __('tax_saved_successfully') || 'Tax saved successfully');
                    this.hideModal();
                })
                .catch((err) => {
                    this.showError(err.response?.data?.message || err.message || __('something_went_wrong'));
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },

    },
    mounted() {
        this.loadLanguages();
        this.showModal();
    },
}
</script>

<style scoped>
.image_preview {
    margin-top: 5px;
}
</style>
