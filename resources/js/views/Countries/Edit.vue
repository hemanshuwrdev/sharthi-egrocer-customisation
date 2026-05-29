<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" scrollable no-close-on-backdrop no-fade
        static size="lg">

        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">
                {{ __('save') }}
                <b-spinner v-if="isLoading" small></b-spinner>
            </b-button>

            <b-button variant="secondary" @click="hideModal">
                {{ __('cancel') }}
            </b-button>
        </div>
        <div v-if="isLoadingData" class="text-center p-5">
            <b-spinner label="Loading..."></b-spinner>
        </div>
        <form ref="my-form" @submit.prevent="saveRecord">

            <b-tabs v-model="activeLanguageTab" content-class="mt-3" v-if="languages.length > 0">
                <b-tab v-for="language in languages" :key="language.id">
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

                        <!-- Country Name (Translatable) -->
                        <div class="form-group col-md-12">
                            <label>{{ __('name') }}</label>
                            <i v-if="language.is_default" class="text-danger">*</i>
                            <input type="text" class="form-control" v-model="translations[language.id].name"
                                :required="language.is_default == 1 ? true : undefined" :placeholder="__('name')">

                        </div>

                        <!-- Default Language Only Fields -->
                        <template v-if="language.is_default">

                            <div class="form-group col-md-6">
                                <label>{{ __('dial_code') }} <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" v-model="dial_code" required :placeholder="__('dial_code')">
                            </div>

                            <div class="form-group col-md-6">
                                <label>{{ __('code') }} <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" v-model="code" required :placeholder="__('code')">
                            </div>

                            <!-- Logo and Status in flex row (side by side) -->
                            <div class="col-md-12 d-flex flex-wrap gap-3">
                                <div class="form-group flex-fill" style="min-width: 200px;">
                                    <label class="d-block">{{ __('logo') }} <span class="text-danger">*</span></label>
                                    <span v-if="logoError" class="error">{{ logoError }}</span>
                                    <input
                                        type="file"
                                        ref="file_image"
                                        name="country_logo"
                                        accept="image/*"
                                        class="file-input"
                                        @change="handleFileUpload"
                                    >
                                    <div
                                        class="file-input-div bg-gray-100"
                                        @click="triggerLogoClick"
                                        @drop="dropLogoFile"
                                        @dragover="$dragoverFile"
                                        @dragleave="$dragleaveFile"
                                    >
                                        <template v-if="logo && logo.name">
                                            <label>{{ __('selected_file_name') }} {{ logo.name }}</label>
                                        </template>
                                        <template v-else>
                                            <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                            <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                        </template>
                                    </div>
                                    <div v-if="logo_url" class="mt-2">
                                        <img :src="logo_url" width="120" class="img-thumbnail custom-image">
                                    </div>
                                </div>
                                <div class="form-group flex-fill" style="min-width: 200px;" v-if="id">
                                    <label class="d-block">{{ __('status') }}</label>
                                    <b-form-radio-group v-model="status" :options="[
                                        { text: __('deactive'), value: 0 },
                                        { text: __('active'), value: 1 }
                                    ]" buttons button-variant="outline-primary" class="d-block mt-1">
                                    </b-form-radio-group>
                                </div>
                            </div>
                        </template>
                    </div>
                </b-tab>
            </b-tabs>
            <button ref="dummy_submit" style="display:none;"></button>
        </form>
    </b-modal>
</template>

<script>
import axios from 'axios'
import TranslationHelper from '../../mixins/TranslationHelper.js'

export default {
    props: ['record'],
    mixins: [TranslationHelper],

    data() {
        return {
            isLoadingData: true,
            isLoading: false,

            id: this.record ? this.record.id : null,
            dial_code: this.record ? this.record.dial_code : '',
            code: this.record ? this.record.code : '',
            logo_url: this.record ? this.record.logo_url : null,
            status: this.record ? this.record.status : 1,
            logo: null,
            logoError: null,

            languages: [],
            translations: {},
            activeLanguageTab: 0,
            defaultLanguageId: null,

            translatableFields: ['name'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
        }
    },

    computed: {
        modal_title: function () {
            let title = this.id ? __('edit_country') : __('add_country');
            return title;
        },
    },


    methods: {

        resetForm() {
            this.id = null
            this.dial_code = ''
            this.code = ''
            this.logo = null
            this.logo_url = null
            this.status = 1
            this.translations = {}
        },

        deferDataLoad() {
            this.isLoadingData = true;

            this.fetchActiveLanguages()
                .then(() => {

                    const defaultLang = this.languages.find(lang => lang.is_default == 1);
                    if (defaultLang) {
                        this.defaultLanguageId = defaultLang.id;
                    }

                    // Initialize ONCE
                    this.initializeTranslations();

                    if (this.id) {
                        return this.loadCountryWithTranslations();
                    } else {
                        this.isLoadingData = false;
                    }
                })
                .catch(error => {
                    console.error('Error loading data:', error);
                    this.isLoadingData = false;
                });
        },

        fetchActiveLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(response => {
                    if (response.data.data) {
                        this.languages = response.data.data;
                        return this.languages;
                    } else {
                        throw new Error('No languages found');
                    }
                });
        },

        initializeTranslations() {
            this.translations = {};

            this.languages.forEach(language => {
                this.$set(this.translations, language.id, {
                    name: ''
                });
            });
        },
        loadCountryWithTranslations() {

            return axios.get(this.$apiUrl + '/countries', {
                params: { id: this.id }
            })
                .then(response => {

                    if (!response.data.data) {
                        this.isLoadingData = false;
                        return;
                    }

                    const country = Array.isArray(response.data.data)
                        ? response.data.data[0]
                        : response.data.data;

                    if (!country) {
                        this.isLoadingData = false;
                        return;
                    }

                    // Base table data
                    this.dial_code = country.dial_code;
                    this.code = country.code;
                    this.status = country.status;
                    this.logo_url = country.logo_url;

                    // Always create fresh object 
                    const updatedTranslations = {};

                    this.languages.forEach(language => {
                        updatedTranslations[language.id] = { name: '' };
                    });

                    // Fill from translation table
                    if (country.translations && Array.isArray(country.translations)) {
                        country.translations.forEach(trans => {
                            updatedTranslations[trans.language_id] = {
                                name: trans.name || ''
                            };
                        });
                    }

                    // Fallback for default language
                    const defaultLang = this.languages.find(l => l.is_default == 1);
                    if (defaultLang && !updatedTranslations[defaultLang.id].name) {
                        updatedTranslations[defaultLang.id].name = country.name || '';
                    }

                    this.translations = updatedTranslations;

                    this.isLoadingData = false;
                })
                .catch(error => {
                    console.error(error);
                    this.isLoadingData = false;
                });
        },

        validateDefaultLanguage() {

            if (!this.defaultLanguageId) {
                this.showError(__('default_language_not_found'));
                return false;
            }

            const defaultTranslation = this.translations[this.defaultLanguageId];

            if (!defaultTranslation || !defaultTranslation.name || defaultTranslation.name.trim() === '') {

                this.showError(__('please_fill_default_language_required_fields'));
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
            // Use $nextTick so tab switch happens after any error toast/modal renders
            this.$nextTick(() => {
                const index = this.languages.findIndex(l => l.is_default == 1);
                if (index !== -1) {
                    this.activeLanguageTab = index;
                }
            });
        },

        triggerLogoClick() {
            const ref = this.$refs.file_image
            const input = Array.isArray(ref) ? ref[0] : ref
            if (input && typeof input.click === 'function') {
                input.click()
            }
        },

        dropLogoFile(event) {
            event.preventDefault()
            const ref = this.$refs.file_image
            const input = Array.isArray(ref) ? ref[0] : ref
            if (!input) return
            input.files = event.dataTransfer.files
            this.handleFileUpload()
            event.currentTarget.classList.add('bg-gray-100')
            event.currentTarget.classList.remove('bg-green-300')
        },

        handleFileUpload() {
            const ref = this.$refs.file_image
            const fileInput = Array.isArray(ref) ? ref[0] : ref
            const file = fileInput?.files?.[0]
            if (!file) return
            this.logoError = null

            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"]
            if (!validTypes.includes(file.type)) {
                this.logoError = this.__('invalid_image_type');
                return
            }

            this.logo = file
            this.logo_url = URL.createObjectURL(file)
        },

        async saveRecord() {

            if (!this.validateDefaultLanguage()) return

            // Use HTML5 required validation
            if (!this.$refs['my-form'].checkValidity()) {
                this.showError(__('please_fill_default_language_required_fields'))
                this.switchToDefaultLanguageTab()
                return
            }

            // Extra check for logo: on create OR when no existing logo, require a file
            if (!this.id && !this.logo && !this.logo_url) {
                this.showError(this.__('please_fill_default_language_required_fields'))
                return
            }
            if (this.id && !this.logo && !this.logo_url) {
                this.showError(this.__('please_fill_default_language_required_fields'))
                return
            }

            this.isLoading = true

            try {

                let formData = new FormData()

                if (this.id) {
                    formData.append('id', this.id)
                }

                formData.append('dial_code', this.dial_code)
                formData.append('code', this.code)
                formData.append('status', this.status)

                // Get file from input at submit time (in case ref was array or state was lost)
                const fileInput = Array.isArray(this.$refs.file_image)
                    ? this.$refs.file_image[0]
                    : this.$refs.file_image
                const logoFile = this.logo || fileInput?.files?.[0]
                if (logoFile) {
                    formData.append('logo', logoFile, logoFile.name)
                }

                //  Send all translations at once
                formData.append('translations', JSON.stringify(this.translations))

                let url = this.id
                    ? this.$apiUrl + '/countries/update'
                    : this.$apiUrl + '/countries/save'

                await axios.post(url, formData)

                this.$eventBus.$emit('recordSaved', __('country_saved_successfully'))
                this.$router.push({ path: '/countries' })
                this.hideModal()

            } catch (error) {
                console.error(error)
            }

            this.isLoading = false
        }
        ,

        showModal() {
            this.$refs['my-modal'].show()
        },

        hideModal() {
            this.$refs['my-modal'].hide()
        }
    },

    mounted() {
        this.showModal();
        this.$nextTick(() => {
            this.deferDataLoad();
        });
    }

}
</script>

<style scoped>
.image_preview {
    margin-top: 5px;
}
</style>
