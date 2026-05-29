<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('about_us') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item">
                                    <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                                </li>
                                <li class="breadcrumb-item active">{{ __('about_us') }}</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            <section class="section">
                <form @submit.prevent="saveRecord">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title">{{ __('update_information') }}</h4>
                        </div>

                        <div class="card-body">

                            <!-- Language Tabs -->
                            <div v-if="languages.length">
                                <b-tabs v-model="activeLanguageTab" content-class="mt-3">
                                    <b-tab
                                        v-for="language in languages"
                                        :key="language.id"
                                        lazy
                                    >
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

                                        <div class="form-group">
                                            <label>
                                                {{ __('about_us') }}
                                                <i v-if="language.is_default" class="text-danger">*</i>
                                            </label>

                                            <editor
                                                v-model="translations[language.id].about_us"
                                                placeholder="Enter About Us"
                                                :init="getEditorConfig()"
                                            />
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
    mixins: [TranslationHelper],
    components: { editor: Editor },

    data() {
        return {
            isLoading: false,
            isLoadingLanguages: false,
            languages: [],
            translations: {},
            defaultLanguageId: null,
            activeLanguageTab: 0,
            record: null,

            translatableFields: ['about_us'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
        };
    },

    created() {
        this.fetchActiveLanguages();
        this.getAboutUs();
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
                t[lang.id] = { about_us: "" };
            });
            this.translations = t;
        },

        getAboutUs() {
            axios.get(this.$apiUrl + "/about_us").then(res => {
                this.record = res.data.data;
                if (!this.record) return;

                try {
                    const parsed = JSON.parse(this.record.value);
                    this.languages.forEach(lang => {
                        if (parsed[lang.code]) {
                            this.translations[lang.id].about_us = parsed[lang.code];
                        }
                    });
                } catch {
                    if (this.defaultLanguageId) {
                        this.translations[this.defaultLanguageId].about_us = this.record.value;
                    }
                }
            });
        },

        validateDefaultLanguage() {
            const def = this.translations[this.defaultLanguageId];
            if (!def || !def.about_us.trim()) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.switchToDefaultTab();
                return false;
            }
            return true;
        },

        switchToDefaultTab() {
            const index = this.languages.findIndex(l => l.id === this.defaultLanguageId);
            if (index !== -1) this.activeLanguageTab = index;
        },

        saveRecord() {
            if (!this.validateDefaultLanguage()) return;

            this.isLoading = true;

            const dataByLang = {};
            this.languages.forEach(lang => {
                dataByLang[lang.code] = this.translations[lang.id].about_us || "";
            });

            axios.post(this.$apiUrl + "/about_us/save", {
                about_us: JSON.stringify(dataByLang),
            })
            .then(res => {
                res.data.status === 1
                    ? this.showMessage("success", res.data.message)
                    : this.showError(res.data.message);
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
