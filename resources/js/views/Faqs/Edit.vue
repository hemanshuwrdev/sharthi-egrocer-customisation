<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" scrollable no-close-on-backdrop no-fade
        static>
        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">{{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>
            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>
        <!-- Loading -->
        <div v-if="isLoadingData" class="text-center p-5">
            <b-spinner></b-spinner>
            <p>{{ __('loading_faq_data') }}</p>
        </div>
        <form ref="my-form" @submit.prevent="saveRecord">
            <!-- Language Tabs with lazy rendering -->
            <b-tabs v-model="activeLanguageTab" content-class="mt-3" v-if="languages.length > 0">
                <b-tab v-for="language in languages" :key="language.id" :title="language.name" lazy>
                    <template #title>
                        <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                            {{ language.name }}
                        </span>
                    </template>

                    <!-- Translate buttons -->
                    <div class="mb-2" v-if="language.is_default && languages.length > 1">
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

                    <div class="row">
                        <div class="form-group">
                            <label for="question">{{ __('query') }}</label>
                            <i v-if="language.is_default" class="text-danger">*</i>
                            <input class="form-control" name="query" id="question"
                                :required="language.is_default ? true : undefined"
                                v-model="translations[language.id].question" :placeholder="__('query')">
                        </div>
                        <div class="form-group ">
                            <label for="answer">{{ __('answer') }}</label>
                            <i v-if="language.is_default" class="text-danger">*</i>
                            <textarea class="form-control" name="answer" id="answer"
                                :required="language.is_default ? true : undefined"
                                v-model="translations[language.id].answer" :placeholder="__('answer')"
                                rows="5"></textarea>
                        </div>
                    </div>
                </b-tab></b-tabs>
            <button ref="dummy_submit" style="display:none;"></button>
        </form>
    </b-modal>
</template>

<script>
import axios from 'axios';
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    props: ['record'],
    mixins: [TranslationHelper],
    data: function () {
        return {
            isLoading: false,
            isLoadingData: true,
            languages: [],
            translations: {},
            defaultLanguageId: null,
            activeLanguageTab: 0,
            faq: {
                id: this.record ? this.record.id : null,

            },
            translatableFields: ['question', 'answer'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
        };
    },
    computed: {
        modal_title: function () {
            let title = this.faq.id ? __('edit') : __('add');
            title += " ";
            title += __('frequently_asked_questions');
            return title;
        },
    },
    methods: {
        showModal() {
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        fetchLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(res => {
                    this.languages = res.data.data;
                });
        },

        initializeTranslations() {
            const obj = {};
            this.languages.forEach(lang => {
                obj[lang.id] = {
                    question: '',
                    answer: ''
                };
            });
            this.translations = obj;
        },
        loadFaqWithTranslations() {
            return axios.get(this.$apiUrl + '/faqs', {
                params: { id: this.faq.id }
            })
                .then(res => {

                    const faq = res.data.data;
                    if (!faq) return;

                    const updated = { ...this.translations };

                    // Fill translation table data
                    if (faq.translations) {
                        faq.translations.forEach(trans => {
                            updated[trans.language_id] = {
                                question: trans.question || '',
                                answer: trans.answer || ''
                            };
                        });
                    }

                    // IMPORTANT: Fill default language from base table
                    updated[this.defaultLanguageId] = {
                        question: faq.question || '',
                        answer: faq.answer || ''
                    };

                    this.translations = updated;
                });
        },


        validateDefaultLanguage() {
            const defaultData = this.translations[this.defaultLanguageId];

            if (!defaultData.question || defaultData.question.trim() === '') {
                this.showError(__('please_fill_default_language_required_fields'));
                this.switchToDefaultTab();
                return false;
            }

            return true;
        },

        validateDefaultLanguageForTranslation() {
            const form = this.$refs['my-form'];
            if (form && !form.reportValidity()) {
                this.$nextTick(() => this.switchToDefaultTab());
                return false;
            }
            return this.validateDefaultLanguage();
        },

        switchToDefaultTab() {
            const index = this.languages.findIndex(
                lang => lang.id === this.defaultLanguageId
            );
            if (index !== -1) {
                this.activeLanguageTab = index;
            }
        },

        async saveRecord() {

            if (!this.validateDefaultLanguage()) return;

            this.isLoading = true;

            const isEditMode = this.faq.id ? true : false;
            let faqId = this.faq.id;

            const defaultLang = this.languages.find(l => l.is_default);

            const languagesToSave = [];

            // default first
            if (defaultLang) {
                languagesToSave.push(defaultLang);
            }

            // others only if have data
            this.languages.forEach(lang => {
                if (lang.is_default) return;

                const data = this.translations[lang.id];
                if (data.question && data.question.trim() !== '') {
                    languagesToSave.push(lang);
                }
            });

            try {

                for (let language of languagesToSave) {

                    const formData = new FormData();

                    if (faqId) {
                        formData.append('id', faqId);
                    }

                    formData.append('language_id', language.id);
                    formData.append('question', this.translations[language.id].question);
                    formData.append('answer', this.translations[language.id].answer);

                    let url = this.$apiUrl + '/faqs/save';
                    if (faqId) {
                        url = this.$apiUrl + '/faqs/update';
                    }

                    const response = await axios.post(url, formData);
                    if (!faqId && response.data.data?.id) {
                        faqId = response.data.data.id;
                        this.faq.id = faqId;
                    }
                }
                if (isEditMode) {
                    this.$eventBus.$emit(
                        'faqSaved',
                        __('faq_updated_successfully') || 'FAQ updated successfully'
                    );
                } else {
                    this.$eventBus.$emit(
                        'faqSaved',
                        __('faq_saved_successfully') || 'FAQ saved successfully'
                    );
                }

                this.hideModal();

            } catch (error) {
                this.showError(error.response?.data?.message || __('something_went_wrong'));
            }

            this.isLoading = false;
        },


    },

    mounted() {
        this.showModal();

        Promise.all([
            this.fetchLanguages()
        ])
            .then(() => {

                const defaultLang = this.languages.find(l => l.is_default);
                if (defaultLang) {
                    this.defaultLanguageId = defaultLang.id;
                }

                this.initializeTranslations();

                if (this.faq.id) {

                    return this.loadFaqWithTranslations();
                }
            })
            .finally(() => {
                this.isLoadingData = false;
            });
    }
}
</script>

<style scoped></style>
