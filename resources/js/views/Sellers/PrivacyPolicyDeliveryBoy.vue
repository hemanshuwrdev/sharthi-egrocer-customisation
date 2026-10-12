<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">{{ __('delivery_boy_privacy_policy_and_term_conditions') }}</h3>
        </div>

        <form id="contact_us_form" method="post" enctype="multipart/form-data" class="ui-card" @submit.prevent="saveRecord">
            <div class="ui-card__body">
                <!-- Language tabs (the tab bar is only shown when there is more than one language) -->
                <b-tabs v-if="languages.length > 0" v-model="activeLanguageTab" pills
                    :nav-class="languages.length > 1 ? 'ui-seg-nav' : 'd-none'">
                    <b-tab v-for="language in languages" :key="language.id" lazy>
                        <template #title>{{ language.name }}</template>

                        <!-- Translate buttons -->
                        <div class="ui-toolbar" v-if="language.is_default && languages.length > 1">
                            <b-button size="sm" variant="outline-primary" @click="translateEmpty(language)"
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

                        <section class="ui-section">
                            <div class="ui-section__head">
                                <h3 class="ui-section__title"><i class="fa fa-shield-alt"></i> {{ __('privacy_policy') }} <span class="ui-req" v-if="language.is_default">*</span></h3>
                                <a :href="$baseUrl + '/delivery-boy-privacy-policy?lang=' + language.code" v-b-tooltip.hover :title="__('privacy_policy')" target="_blank" class="ui-btn-sm">
                                    <i class="fa fa-eye"></i> {{ __('Preview') }}
                                </a>
                            </div>
                            <div class="ui-editor">
                                <editor
                                    :placeholder="__('privacy_policy')"
                                    v-model="translations[language.id].privacy_policy_delivery_boy"
                                    :init="getEditorConfig()"
                                />
                            </div>
                        </section>

                        <section class="ui-section">
                            <div class="ui-section__head">
                                <h3 class="ui-section__title"><i class="fa fa-file-contract"></i> {{ __('term_conditions') }} <span class="ui-req" v-if="language.is_default">*</span></h3>
                                <a :href="$baseUrl + '/delivery-boy-terms-conditions?lang=' + language.code" v-b-tooltip.hover :title="__('term_conditions')" target="_blank" class="ui-btn-sm">
                                    <i class="fa fa-eye"></i> {{ __('Preview') }}
                                </a>
                            </div>
                            <div class="ui-editor">
                                <editor
                                    :placeholder="__('term_conditions')"
                                    v-model="translations[language.id].terms_conditions_delivery_boy"
                                    :init="getEditorConfig()"
                                />
                            </div>
                        </section>
                    </b-tab>
                </b-tabs>

                <!-- Loading state for languages -->
                <div v-else-if="isLoadingLanguages" class="ui-busy">
                    <b-spinner small :label="__('loading')"></b-spinner>
                </div>
            </div>

            <div class="ui-card__foot">
                <b-button type="submit" variant="primary" :disabled="isLoading">
                    {{ __('update') }}
                    <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                </b-button>
            </div>
        </form>
    </div>
</template>
<script>
import axios from "axios";
import Editor from "@tinymce/tinymce-vue";
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    components: { 'editor': Editor },
    data: function () {
        return {
            isLoading: false,
            isLoadingLanguages: false,
            policies: {
                privacy_policy_delivery_boy: "",
                terms_conditions_delivery_boy: ""
            },
            record: null,
            // Multi-language support
            activeLanguageTab: 0,
            translations: {},
            defaultLanguageId: null,
            languages: [],

            // Translate buttons
            translatableFields: ['privacy_policy_delivery_boy', 'terms_conditions_delivery_boy'],
            loadingEmpty: false,
            loadingOverwrite: false,
        }
    },
    created: function () {
        this.fetchActiveLanguages();
        this.getPrivacyPolicyDeliveryBoy();
    },
    methods: {
        // Get editor configuration with safe fallbacks
        getEditorConfig() {
            const plugins = (this.$editorPlugins && Array.isArray(this.$editorPlugins)) 
                ? this.$editorPlugins 
                : ["autolink", "lists", "link", "image", "charmap", "anchor", "searchreplace", "visualblocks", "media", "table", "wordcount", "code", "codesample"];
            
            const toolbar = this.$editorToolbar || "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | charmap | code | removeformat";
            
            const fontSizes = this.$editorFont_size_formats || '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt';
            
            return {
                height: 400,
                plugins: plugins,
                toolbar: toolbar,
                font_size_formats: fontSizes,
                ...this.$tinymceImageUploadOptions()
            };
        },

        fetchActiveLanguages() {
            this.isLoadingLanguages = true;
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (response.data.data) {
                        this.languages = response.data.data;
                        const defaultLang = this.languages.find(lang => lang.is_default === 1);
                        if (defaultLang) {
                            this.defaultLanguageId = defaultLang.id;
                        }
                        this.initializeTranslations();
                        this.isLoadingLanguages = false;
                    } else {
                        this.isLoadingLanguages = false;
                    }
                })
                .catch(error => {
                    console.error('Error loading languages:', error);
                    this.isLoadingLanguages = false;
                });
        },

        initializeTranslations() {
            const allTranslations = {};
            this.languages.forEach(language => {
                allTranslations[language.id] = {
                    privacy_policy_delivery_boy: '',
                    terms_conditions_delivery_boy: ''
                };
            });
            this.translations = allTranslations;
        },

        getPrivacyPolicyDeliveryBoy() {
            // Wait for languages to be loaded first
            if (this.languages.length === 0) {
                this.fetchActiveLanguages().then(() => {
                    this.loadPolicyData();
                });
            } else {
                this.loadPolicyData();
            }
        },

        loadPolicyData() {
            axios.get(this.$apiUrl + '/privacy_policy_delivery_boy').then((response) => {
                this.record = response.data.data;
                
                // Parse language-wise data from settings
                const privacyPolicyData = {};
                const termsConditionsData = {};
                
                this.record.forEach((item) => {
                    if (item.variable === 'privacy_policy_delivery_boy') {
                        // Try to parse as JSON (language-wise), fallback to plain text
                        try {
                            const parsed = JSON.parse(item.value);
                            if (typeof parsed === 'object' && parsed !== null) {
                                // It's JSON with language codes
                                Object.keys(parsed).forEach(langCode => {
                                    const lang = this.languages.find(l => l.code === langCode);
                                    if (lang) {
                                        privacyPolicyData[lang.id] = parsed[langCode];
                                    }
                                });
                            } else {
                                // It's a string, assign to default language
                                if (this.defaultLanguageId) {
                                    privacyPolicyData[this.defaultLanguageId] = item.value;
                                }
                            }
                        } catch (e) {
                            // Not JSON, it's plain text - assign to default language
                            if (this.defaultLanguageId) {
                                privacyPolicyData[this.defaultLanguageId] = item.value;
                            }
                        }
                    } else if (item.variable === 'terms_conditions_delivery_boy') {
                        // Try to parse as JSON (language-wise), fallback to plain text
                        try {
                            const parsed = JSON.parse(item.value);
                            if (typeof parsed === 'object' && parsed !== null) {
                                // It's JSON with language codes
                                Object.keys(parsed).forEach(langCode => {
                                    const lang = this.languages.find(l => l.code === langCode);
                                    if (lang) {
                                        termsConditionsData[lang.id] = parsed[langCode];
                                    }
                                });
                            } else {
                                // It's a string, assign to default language
                                if (this.defaultLanguageId) {
                                    termsConditionsData[this.defaultLanguageId] = item.value;
                                }
                            }
                        } catch (e) {
                            // Not JSON, it's plain text - assign to default language
                            if (this.defaultLanguageId) {
                                termsConditionsData[this.defaultLanguageId] = item.value;
                            }
                        }
                    }
                });

                // Update translations with reactivity
                this.languages.forEach(language => {
                    if (!this.translations[language.id]) {
                        this.$set(this.translations, language.id, {
                            privacy_policy_delivery_boy: '',
                            terms_conditions_delivery_boy: ''
                        });
                    }
                    if (privacyPolicyData[language.id]) {
                        this.$set(this.translations[language.id], 'privacy_policy_delivery_boy', privacyPolicyData[language.id]);
                    }
                    if (termsConditionsData[language.id]) {
                        this.$set(this.translations[language.id], 'terms_conditions_delivery_boy', termsConditionsData[language.id]);
                    }
                });
            });
        },

        saveRecord: function() {
            // Validate default language
            if (!this.validateDefaultLanguage()) {
                return;
            }

            this.isLoading = true;
            let vm = this;

            // Build language-wise data structure
            const privacyPolicyByLang = {};
            const termsConditionsByLang = {};

            this.languages.forEach(language => {
                const translation = this.translations[language.id];
                if (translation) {
                    privacyPolicyByLang[language.code] = translation.privacy_policy_delivery_boy || '';
                    termsConditionsByLang[language.code] = translation.terms_conditions_delivery_boy || '';
                }
            });

            // Prepare form data with JSON-encoded language-wise values
            let formData = {
                privacy_policy_delivery_boy: JSON.stringify(privacyPolicyByLang),
                terms_conditions_delivery_boy: JSON.stringify(termsConditionsByLang)
            };

            let url = this.$apiUrl + '/privacy_policy_delivery_boy/save';
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    vm.showMessage("success", data.message || 'Privacy Policy and Terms & Conditions saved successfully!');
                            vm.isLoading = false;
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                if (error.request.statusText) {
                    vm.showError(error.request.statusText);
                } else if (error.message) {
                    vm.showError(error.message);
                } else {
                    vm.showError(__('something_went_wrong'));
                }
                vm.isLoading = false;
            });
        },

        validateDefaultLanguage() {
            if (!this.defaultLanguageId) {
                this.showError(__('default_language_not_found'));
                return false;
            }

            const defaultTranslation = this.translations[this.defaultLanguageId];
            
            if (!defaultTranslation.privacy_policy_delivery_boy || defaultTranslation.privacy_policy_delivery_boy.trim() === '') {
                this.showError(__('please_fill_privacy_policy_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            if (!defaultTranslation.terms_conditions_delivery_boy || defaultTranslation.terms_conditions_delivery_boy.trim() === '') {
                this.showError(__('please_fill_terms_conditions_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            return true;
        },

        switchToDefaultLanguageTab() {
            const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.activeLanguageTab = defaultLangIndex;
            }
        }
    }
}
</script>
