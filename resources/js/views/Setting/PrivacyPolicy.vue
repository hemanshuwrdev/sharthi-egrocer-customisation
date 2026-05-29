<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('privacy_policy_terms_conditions') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-md-end">
                            <ol class="breadcrumb mb-0 justify-content-md-end text-end">
                                <li class="breadcrumb-item">
                                    <router-link to="/dashboard">
                                        {{ __('dashboard') }}
                                    </router-link>
                                </li>
                                <li class="breadcrumb-item active">
                                    {{ __('privacy_policy_terms_conditions') }}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <section class="section">
                <form @submit.prevent="saveRecord">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">
                                {{ __('update_privacy_policy') }}
                            </h4>
                        </div>

                        <div class="card-body">

                            <!-- LANGUAGE TABS -->
                            <div v-if="languages.length">
                                <b-tabs v-model="activeLanguageTab" content-class="mt-3">

                                    <b-tab v-for="language in languages" :key="language.id" lazy>
                                        <template #title>
                                            <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                                {{ language.name }}
                                            </span>
                                        </template>

                                        <!-- Translate buttons (skip if no language.name) -->
                                        <div class="mb-3" v-if="language.is_default && languages.length > 1">
                                            <b-button size="sm" variant="outline-primary" class="mr-2"
                                                @click="translateEmpty(language)" v-b-tooltip.hover
                                                :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                                                :disabled="loadingEmpty">
                                                <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                                <b-spinner v-else small></b-spinner>
                                            </b-button>

                                            <b-button size="sm" variant="outline-danger"
                                                @click="translateOverwrite(language)" v-b-tooltip.hover
                                                :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                                                :disabled="loadingOverwrite">
                                                <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite')
                                                }}</span>
                                                <b-spinner v-else small></b-spinner>
                                            </b-button>

                                            <div v-if="translateSuccessMessage"
                                                class="text-success mt-2 font-weight-bold">
                                                {{ translateSuccessMessage }}
                                            </div>
                                        </div>
                                        <!-- Translate buttons END -->

                                        <!-- POLICY EDITORS -->
                                        <div v-for="(label, variable) in policyLabels" :key="variable"
                                            class="form-group">
                                            <div class="d-flex justify-content-between mb-2">
                                                <label>
                                                    {{ label }}
                                                    <i class="text-danger" v-if="language.is_default">*</i>
                                                </label>
                                            </div>

                                            <editor v-model="translations[language.id][variable]"
                                                :init="getEditorConfig()" />
                                        </div>

                                    </b-tab>
                                </b-tabs>
                            </div>

                            <div v-else-if="isLoadingLanguages" class="text-center p-3">
                                <b-spinner />
                            </div>

                        </div>

                        <div class="card-footer">
                            <b-button type="submit" variant="primary" :disabled="isLoading">
                                {{ __('update') }}
                                <b-spinner v-if="isLoading" small />
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
    components: { editor: Editor },
    mixins: [TranslationHelper],

    data() {
        return {
            isLoading: false,
            isLoadingLanguages: false,
            languages: [],
            translations: {},
            defaultLanguageId: null,
            activeLanguageTab: 0,
            record: null,

            translatableFields: ['privacy_policy', 'returns_and_exchanges_policy', 'shipping_policy', 'cancellation_policy', 'terms_conditions'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,

            policyLabels: {
                privacy_policy: __('privacy_policy'),
                returns_and_exchanges_policy: __('return_exchange_policy'),
                shipping_policy: __('shipping_policy'),
                cancellation_policy: __('cancellation_policy'),
                terms_conditions: __('terms_conditions')
            }
        };
    },

    created() {
        this.fetchActiveLanguages().then(() => {
            this.getPrivacyPolicy();
        });
    },

    methods: {

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

            return axios.get(this.$apiUrl + "/active_languages")
                .then(res => {
                    this.languages = res.data.data || [];

                    const def = this.languages.find(l => l.is_default === 1);
                    this.defaultLanguageId = def ? def.id : null;

                    this.initTranslations();
                    this.isLoadingLanguages = false;
                });
        },

        initTranslations() {
            const t = {};

            this.languages.forEach(lang => {
                t[lang.id] = {
                    privacy_policy: "",
                    returns_and_exchanges_policy: "",
                    shipping_policy: "",
                    cancellation_policy: "",
                    terms_conditions: ""
                };
            });

            this.translations = t;
        },

        getPrivacyPolicy() {
            axios.get(this.$apiUrl + "/privacy_policy")
                .then(res => {
                    this.record = res.data.data;
                    if (!this.record) return;

                    this.record.forEach(item => {
                        try {
                            const parsed = JSON.parse(item.value);

                            this.languages.forEach(lang => {
                                if (parsed[lang.code]) {
                                    this.translations[lang.id][item.variable] =
                                        parsed[lang.code];
                                }
                            });

                        } catch {
                            // fallback for old single-language data
                            if (this.defaultLanguageId) {
                                this.translations[this.defaultLanguageId][item.variable] =
                                    item.value;
                            }
                        }
                    });
                });
        },

        validateDefaultLanguage() {
            const def = this.translations[this.defaultLanguageId];
            if (!def) {
                this.showError(__('something_went_wrong') || 'Something went wrong.');
                return false;
            }

            const requiredFields = [
                'privacy_policy',
                'returns_and_exchanges_policy',
                'shipping_policy',
                'cancellation_policy',
                'terms_conditions'
            ];
            const emptyFields = requiredFields.filter(
                (field) => !(def[field] && String(def[field]).trim())
            );

            if (emptyFields.length > 0) {
                const message =
                    __('please_fill_all_required_fields_in_default_language') ||
                    'Please fill all required fields in the default language.';
                this.showError(message);
                this.switchToDefaultTab();
                return false;
            }

            return true;
        },

        validateDefaultLanguageForTranslation() {
            return this.validateDefaultLanguage();
        },

        switchToDefaultTab() {
            const index = this.languages.findIndex(
                l => l.id === this.defaultLanguageId
            );

            if (index !== -1) {
                this.activeLanguageTab = index;
            }
        },

        saveRecord() {
            if (!this.validateDefaultLanguage()) return;

            this.isLoading = true;

            const payload = {};

            Object.keys(this.policyLabels).forEach(variable => {

                const dataByLang = {};

                this.languages.forEach(lang => {
                    dataByLang[lang.code] =
                        this.translations[lang.id][variable] || "";
                });

                payload[variable] = JSON.stringify(dataByLang);
            });

            axios.post(this.$apiUrl + "/privacy_policy/save", payload)
                .then(res => {
                    if (res.data.status === 1) {
                        this.showMessage("success", res.data.message);
                    } else {
                        this.showError(res.data.message);
                    }
                    this.isLoading = false;
                })
                .catch(() => {
                    this.showError(__('something_went_wrong'));
                    this.isLoading = false;
                });
        },
    },
};
</script>
