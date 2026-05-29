<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('delivery_boy_privacy_policy_and_term_conditions') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard') }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('delivery_boy_privacy_policy_and_term_conditions') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <form id="contact_us_form" method="post" enctype="multipart/form-data" @submit.prevent="saveRecord">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">{{ __('delivery_boy_privacy_policy_and_term_conditions') }}</h4>
                        </div>
                        <div class="card-body">
                            <!-- Language Tabs -->
                            <div class="col-md-12 mb-3" v-if="languages.length > 0">
                                <b-tabs v-model="activeLanguageTab" content-class="mt-3">
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

                            <div class="form-group">
                                <div class="d-flex justify-content-between mb-2">
                                                <label>{{ __('privacy_policy') }} <i class="text-danger" v-if="language.is_default">*</i></label>
                                                <a :href="$baseUrl+'/delivery-boy-privacy-policy?lang=' + language.code" v-b-tooltip.hover :title="__('privacy_policy')" target="_blank" class="btn btn-sm btn-primary"><i class="fa fa-eye"></i></a>
                                </div>
                                <editor
                                    :placeholder="__('privacy_policy')"
                                                v-model="translations[language.id].privacy_policy_delivery_boy"
                                                :init="getEditorConfig()"
                                />
                            </div>

                                        <h4 class="card-title mt-4">{{ __('update_term_conditions') }}</h4>
                            <div class="form-group">
                                <div class="d-flex justify-content-between mb-2">
                                                <label>{{ __('term_conditions') }} <i class="text-danger" v-if="language.is_default">*</i></label>
                                                <a :href="$baseUrl+'/delivery-boy-terms-conditions?lang=' + language.code" v-b-tooltip.hover :title="__('terms_conditions')" target="_blank" class="btn btn-sm btn-primary"><i class="fa fa-eye"></i></a>
                                </div>
                                <editor
                                    :placeholder="__('terms_conditions')"
                                                v-model="translations[language.id].terms_conditions_delivery_boy"
                                                :init="getEditorConfig()"
                                            />
                                        </div>
                                    </b-tab>
                                </b-tabs>
                            </div>

                            <!-- Loading state for languages -->
                            <div v-else-if="isLoadingLanguages" class="text-center p-3 mb-3">
                                <b-spinner :label="__('loading')"></b-spinner>
                            </div>
                        </div>
                        <div class="card-footer">
                            <b-button type="submit" variant="primary" :disabled="isLoading"> {{ __('update') }}
                                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                            </b-button>
                        </div>
                    </div>
                </form>
            </section>
        </div>
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
