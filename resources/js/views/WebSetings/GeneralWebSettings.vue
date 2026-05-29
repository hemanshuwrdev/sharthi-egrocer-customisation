<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
                <div class="row">
                    <div class="col-12 col-md-6 order-md-1 order-last">
                        <h3>{{ __('general_web_settings') }}</h3>
                    </div>
                    <div class="col-12 col-md-6 order-md-2 order-first">
                        <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard')
                                        }}</router-link></li>
                                <li class="breadcrumb-item active" aria-current="page">{{ __('general_web_settings') }}
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <section class="section">
                <form method="post" enctype="multipart/form-data" @submit.prevent="saveRecord" novalidate>

                    <div class="card mb-3">
                        <div class="card-header">
                            <h4 class="card-title">{{ __('header_settings') }}</h4>
                        </div>

                        <div class="card-body">

                            <b-tabs v-model="activeLanguageTab" nav-class="mb-4 border-bottom" content-class="mt-3"
                                :lazy="false">
                                <b-tab v-for="language in languages" :key="language.id">
                                    <template #title>
                                        <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                            {{ language.name }}
                                        </span>
                                    </template>
                                    <div class="card-body ps-0 pt-0">
                                        <!-- Translate buttons (Web setting) -->
                                        <div class="mb-3" v-if="language.is_default && languages.length > 1">
                                            <b-button size="sm" variant="outline-primary" class="mr-2"
                                                @click="translateEmptyWebSetting(language)" v-b-tooltip.hover
                                                title="Only empty fields will be translated."
                                                :disabled="loadingEmpty || loadingOverwrite">
                                                <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                                <b-spinner v-else small></b-spinner>
                                            </b-button>
                                            <b-button size="sm" variant="outline-danger"
                                                @click="translateOverwriteWebSetting(language)" v-b-tooltip.hover
                                                title="All fields will be translated and overwritten."
                                                :disabled="loadingEmpty || loadingOverwrite">
                                                <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite')
                                                    }}</span>
                                                <b-spinner v-else small></b-spinner>
                                            </b-button>
                                            <div v-if="translateSuccessMessage"
                                                class="text-success mt-2 font-weight-bold">{{ translateSuccessMessage }}
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="form-group col-md-4 mt-0">
                                                <label for="site_title">{{ __('site_title') }}</label>
                                                <i class="text-danger" v-if="language.is_default">*</i>
                                                <input type="text" name="site_title" id="site_title"
                                                    v-model="webTranslations.site_title[language.code]"
                                                    class="form-control" :placeholder="__('site_title')"
                                                    :required="language.is_default ? true : undefined" />
                                            </div>
                                            <div class="form-group col-sm-6 col-md-6 col-lg-4" v-if="language.is_default">
                                                <label for="website_url">{{ __('website_url') }}</label>
                                                <i class="text-danger">*</i>
                                                <div class="input-group">
                                                    <input type="text" name="website_url" id="website_url"
                                                        v-model="settings.website_url" class="form-control"
                                                        :placeholder="__('website_url')"
                                                        :required="language.is_default ? true : undefined" />
                                                    <button type="button" class="btn btn-primary"
                                                        v-if="settings.website_url"
                                                        @click="openUrl(settings.website_url)">
                                                        <i class="fa fa-solid fa-globe fs-5"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="form-group col-sm-6 col-md-6 col-lg-4">
                                                <label for="common_meta_title">{{ __('common_meta_title') }}</label>
                                                <i class="text-danger" v-if="language.is_default">*</i>
                                                <div class="input-group">
                                                    <input type="text" name="common_meta_title" id="common_meta_title"
                                                        v-model="webTranslations.common_meta_title[language.code]"
                                                        class="form-control" :placeholder="__('common_meta_title')"
                                                        :required="language.is_default ? true : undefined" />
                                                </div>
                                            </div>
                                            <div class="form-group col-md-12 col-lg-8">
                                                <label for="common_meta_description">{{
                                                    __('common_meta_description') }}</label>
                                                <i class="text-danger" v-if="language.is_default">*</i>
                                                <div class="input-group">
                                                    <textarea type="text" name="common_meta_description"
                                                        id="common_meta_description"
                                                        v-model="webTranslations.common_meta_description[language.code]"
                                                        class="form-control"
                                                        :placeholder="__('common_meta_description')"
                                                        :required="language.is_default ? true : undefined" />
                                                </div>
                                            </div>
                                            <div class="form-group col-md-12 col-lg-4">
                                                <label for="website_mode" class="website_maitenance_mode">{{
                                                    __('website_maitenance_mode') }} <span
                                                        class="text text-primary font-size-13">( {{ __('enable') }}/{{
                                                            __('disable') }}
                                                        ) </span> &nbsp; &nbsp;
                                                    <span class="form-switch">
                                                        <input type="checkbox" true-value="1" false-value="0"
                                                            class="form-check-input" name="website_mode"
                                                            id="website_mode" v-model="settings.website_mode">
                                                    </span>
                                                </label>
                                                <div class="form-floating mb-3" v-if="settings.website_mode == 1">
                                                    <textarea name="message" id="website_mode_remark"
                                                        v-model="webTranslations.website_mode_remark[language.code]"
                                                        class="form-control"
                                                        placeholder="Enter Notification Message Here!"></textarea>
                                                    <label for="website_mode_remark">{{ __('website_remark') }}</label>
                                                </div>
                                            </div>

                                            <div class="row mt-3 mb-3 align-items-baseline" v-if="language.is_default">
                                                <div class="form-group col-sm-6 col-md-6 col-lg-4">
                                                    <div class="row">
                                                        <div class="col-md-12 col-xxl-12">
                                                            <label for="web_logo">{{ __('web_logo') }}</label>
                                                            <i class="text-danger">*</i>
                                                            <input type='file' name='web_logo' id='web_logo'
                                                                @change="handleWebLogoUpload($event)" ref="web_logo"
                                                                accept="image/*" class="file-input" />
                                                            <div class="file-input-div" @click="triggerFileInput('web_logo')"
                                                                @drop="dropFileWebLogo" @dragover="$dragoverFile"
                                                                @dragleave="$dragleaveFile">
                                                                <template v-if="web_logo_name && web_logo_name !== ''">
                                                                    <label>{{ __('selected_file_name') }}:- {{ web_logo_name
                                                                    }}</label>
                                                                </template>
                                                                <template v-else>
                                                                    <label><i
                                                                            class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                    <label>{{ __('drop_files_here_or_click_to_upload')
                                                                        }}</label>
                                                                </template>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-12 col-xxl-12" v-if="web_logo_url">
                                                            <img class="custom-row-image img-fluid image-preview" :src="web_logo_url"
                                                                title='Web Logo' alt='Web Logo' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group col-sm-6 col-md-6 col-lg-4">
                                                    <div class="row">
                                                        <div class="col-md-12 col-xxl-12">
                                                            <label for="favicon">{{ __('favicon_icon') }} </label>
                                                            <i class="text-danger">*</i>
                                                            <input type='file' name='favicon' id='favicon'
                                                                @change="handleFaviconUpload($event)" ref="favicon"
                                                                accept="image/*" class="file-input" />
                                                            <div class="file-input-div" @click="triggerFileInput('favicon')"
                                                                @drop="dropFileFavicon" @dragover="$dragoverFile"
                                                                @dragleave="$dragleaveFile">
                                                                <template v-if="favicon_name && favicon_name !== ''">
                                                                    <label>{{ __('selected_file_name') }}:- {{ favicon_name
                                                                    }}</label>
                                                                </template>
                                                                <template v-else>
                                                                    <label><i
                                                                            class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                    <label>{{ __('drop_files_here_or_click_to_upload')
                                                                        }}</label>
                                                                </template>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-12 col-xxl-12" v-if="favicon_url">
                                                            <img class="custom-row-image img-fluid image-preview" :src="favicon_url"
                                                                title='Favicon Icon' alt='Favicon Icon' />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group col-sm-6 col-md-6 col-lg-4">
                                                    <div class="row">
                                                        <div class="col-md-12 col-xxl-12">
                                                            <label for="placeholder_image">{{ __('placeholder_image') }}
                                                            </label>
                                                            <i class="text-danger">*</i>
                                                            <input type='file' name='placeholder_image'
                                                                id='placeholder_image'
                                                                @change="handlePlaceholderImageUpload($event)"
                                                                ref="placeholder_image" accept="image/*"
                                                                class="file-input" />
                                                            <div class="file-input-div"
                                                                @click="triggerFileInput('placeholder_image')"
                                                                @drop="dropFilePlaceholderImage"
                                                                @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                                                <template
                                                                    v-if="placeholder_image_name && placeholder_image_name !== ''">
                                                                    <label>{{ __('selected_file_name') }}:- {{
                                                                        placeholder_image_name }}</label>
                                                                </template>
                                                                <template v-else>
                                                                    <label><i
                                                                            class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                    <label>{{ __('drop_files_here_or_click_to_upload')
                                                                        }}</label>
                                                                </template>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-12 col-xxl-12" v-if="placeholder_image_url">
                                                            <img class="custom-row-image img-fluid image-preview"
                                                                :src="placeholder_image_url"
                                                                title="__('placeholder_image')"
                                                                alt='Placeholder Image' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group col-sm-6 col-md-6 col-lg-4" v-if="language.is_default">
                                                <label for="color">{{ __('color') ? __('color') : 'Color' }}</label>
                                                <i class="text-danger">*</i>
                                                <b-input-group prepend class="mb-2">
                                                    <input type="text" v-model="settings.color" class="form-control">
                                                    <input type="color" id="color" name='color' v-model="settings.color"
                                                        class="form-control">
                                                </b-input-group>
                                            </div>
                                            <div class="form-group col-sm-6 col-md-6 col-lg-4" v-if="language.is_default">
                                                <label for="light_color">{{ __('light_color') ? __('light_color') :
                                                    'Light Color' }}</label>
                                                <i class="text-danger">*</i>
                                                <b-input-group prepend class="mb-2">
                                                    <input type="text" v-model="settings.light_color"
                                                        class="form-control">
                                                    <input type="color" id="light_color" name='light_color'
                                                        v-model="settings.light_color" class="form-control">
                                                </b-input-group>
                                            </div>
                                        </div>
                                    </div>
                                </b-tab></b-tabs>
                        </div>
                    </div>
                    <div class="card mb-3">

                        <div class="card-header">
                            <h4 class="card-title">
                                {{ __('app_download_section') }}
                                <small v-if="activeLanguage">
                                    ({{ activeLanguage.name }})
                                </small>
                            </h4>
                        </div>

                        <div class="card-body" v-if="activeLanguage">

                            <div class="row">

                                <!-- App Title (ALL languages) -->
                                <div class="form-group col-md-6">
                                    <label>{{ __('app_title') }}</label>
                                    <input type="text" v-model="webTranslations.app_title[activeLanguage.code]"
                                        class="form-control" :placeholder="__('enter_app_title')">
                                </div>

                                <!-- Short Description (ALL languages) -->
                                <div class="form-group col-md-6">
                                    <label>{{ __('short_description') }}</label>
                                    <textarea v-model="webTranslations.app_short_description[activeLanguage.code]"
                                        rows="5" class="form-control"
                                        :placeholder="__('enter_app_short_description_here')"></textarea>
                                </div>

                                <div class="col-md-12" v-if="activeLanguage.is_default">
                                    <div class="row">
                                        <div class="col-12 col-lg-6 mb-3 mb-lg-0">
                                            <div class="border rounded p-3 h-100">
                                                <div class="mb-3">
                                                    <label>{{ __('android_app') }}</label>
                                                    <div class="form-check form-switch">
                                                        <input type="checkbox" true-value="1" false-value="0"
                                                            class="form-check-input" v-model="settings.is_android_app">
                                                    </div>
                                                </div>

                                                <div v-if="settings.is_android_app == 1" class="mb-4">
                                                    <div class="form-group">
                                                        <label>{{ __('android_application_url') }}</label>
                                                        <input type="text" v-model="settings.android_app_url"
                                                            class="form-control"
                                                            :placeholder="__('enter_android_app_url')" />
                                                    </div>

                                                    <div class="form-group mt-3">
                                                        <label>{{ __('android_play_store_logo') }}</label>
                                                        <i class="text-danger">*</i>
                                                        <input type='file' name='play_store_logo' ref="play_store_logo"
                                                            @change="handlePlayStoreLogoUpload" accept="image/*"
                                                            class="file-input" />

                                                        <div class="file-input-div"
                                                            @click="triggerFileInput('play_store_logo')"
                                                            @drop="dropFilePlayStoreLogo" @dragover="$dragoverFile"
                                                            @dragleave="$dragleaveFile">

                                                            <template v-if="play_store_logo_name">
                                                                <label>{{ __('selected_file_name') }}:- {{ play_store_logo_name
                                                                }}</label>
                                                            </template>

                                                            <template v-else>
                                                                <label><i
                                                                        class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                <label>{{ __('drop_files_here_or_click_to_upload')
                                                                    }}</label>
                                                            </template>
                                                        </div>

                                                        <div v-if="play_store_logo_url" class="mt-2">
                                                            <img class="custom-row-image img-fluid image-preview"
                                                                :src="play_store_logo_url" alt="Play Store Logo" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- IOS SECTION: half width on lg+, full width on small screens; separate border -->
                                        <div class="col-12 col-lg-6">
                                            <div class="border rounded p-3 h-100">
                                                <div class="mb-3">
                                                    <label>{{ __('ios_app') }}</label>
                                                    <div class="form-check form-switch">
                                                        <input type="checkbox" true-value="1" false-value="0"
                                                            class="form-check-input" v-model="settings.is_ios_app">
                                                    </div>
                                                </div>

                                                <div v-if="settings.is_ios_app == 1">
                                                    <div class="form-group">
                                                        <label>{{ __('ios_application_url') }}</label>
                                                        <input type="text" v-model="settings.ios_app_url"
                                                            class="form-control"
                                                            :placeholder="__('enter_ios_app_url')" />
                                                    </div>

                                                    <div class="form-group mt-3">
                                                        <label>{{ __('ios_store_logo') }}</label>
                                                        <i class="text-danger">*</i>
                                                        <input type='file' name='ios_store_logo' ref="ios_store_logo"
                                                            @change="handleIosStoreLogoUpload" accept="image/*"
                                                            class="file-input" />

                                                        <div class="file-input-div"
                                                            @click="triggerFileInput('ios_store_logo')"
                                                            @drop="dropFileIosStoreLogo" @dragover="$dragoverFile"
                                                            @dragleave="$dragleaveFile">

                                                            <template v-if="ios_store_logo_name">
                                                                <label>{{ __('selected_file_name') }}:- {{ ios_store_logo_name
                                                                }}</label>
                                                            </template>

                                                            <template v-else>
                                                                <label><i
                                                                        class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                                <label>{{ __('drop_files_here_or_click_to_upload')
                                                                    }}</label>
                                                            </template>
                                                        </div>

                                                        <div v-if="ios_store_logo_url" class="mt-2">
                                                            <img class="custom-row-image img-fluid image-preview"
                                                                :src="ios_store_logo_url" alt="IOS Store Logo" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <b-button type="submit" variant="primary" :disabled="isLoading">{{ __('update') }}
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
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {

    data: function () {
        return {
            languages: [],
            activeLanguageTab: 0,
            defaultLanguageId: null,
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,

            webTranslations: {
                site_title: {},
                common_meta_title: {},
                common_meta_description: {},
                website_mode_remark: {},
                app_title: {},
                app_short_description: {},
            },

            colors: "",

            isLoading: false,
            editor: ClassicEditor,
            editorConfig: {},
            settings: {},
            record: null,

            web_logo_url: "",
            web_logo_name: "",

            favicon_url: "",
            favicon_name: "",
            placeholder_image_url: "",
            placeholder_image_name: "",

            play_store_logo_url: "",
            play_store_logo_name: "",

            ios_store_logo_url: "",
            ios_store_logo_name: "",

        }
    },
    created: function () {
        //this.getSettings()
        this.getLanguages();
    },
    computed: {
        activeLanguage() {
            return this.languages[this.activeLanguageTab] || null;
        }
    },

    methods: {
        getLanguages() {
            axios.get(this.$apiUrl + '/active_languages').then(response => {
                this.languages = response.data.data || [];
                const def = this.languages.find(l => l.is_default);
                this.defaultLanguageId = def ? def.id : null;
                // after languages load → load settings
                this.getSettings();
            });
        },

        _translateWebSetting(emptyOnly) {
            const defaultLang = this.languages.find(l => l.is_default);
            if (!defaultLang || !defaultLang.code) {
                this.showError(__('default_language_data_missing') || 'Default language not found');
                return Promise.reject();
            }
            const fields = ['site_title', 'common_meta_title', 'common_meta_description', 'website_mode_remark', 'app_title', 'app_short_description'];
            const source = {};
            fields.forEach(f => { source[f] = this.webTranslations[f] && this.webTranslations[f][defaultLang.code] ? this.webTranslations[f][defaultLang.code] : ''; });
            if (Object.values(source).every(v => !v || !String(v).trim())) {
                this.showError(__('default_language_data_missing') || 'Fill default language fields first');
                return Promise.reject();
            }

            if (emptyOnly) {
                let hasEmptyField = false;
                for (const lang of this.languages) {
                    if (lang.is_default) continue;
                    for (const field of fields) {
                        const val = this.webTranslations[field] && this.webTranslations[field][lang.code];
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
                        fields.forEach(f => {
                            const val = translated[f];
                            if (val == null) return;
                            if (emptyOnly && this.webTranslations[f] && this.webTranslations[f][lang.code]) return;
                            if (!this.webTranslations[f]) this.$set(this.webTranslations, f, {});
                            this.$set(this.webTranslations[f], lang.code, val);
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
        translateEmptyWebSetting(language) {
            if (!language || !language.is_default) return;
            this._translateWebSetting(true);
        },
        translateOverwriteWebSetting(language) {
            if (!language || !language.is_default) return;
            this._translateWebSetting(false);
        },

        safeJson(value) {
            try {
                const parsed = JSON.parse(value);
                return (typeof parsed === 'object' && parsed !== null) ? parsed : null;
            } catch (e) {
                return null;
            }
        },
        ValidURL(str) {
            var regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if (!regex.test(str)) {
                this.showError("Please enter valid URL.");
                return false;
            } else {
                return true;
            }
        },
        openUrl(url) {
            if (this.ValidURL(url)) {
                window.open(url, '__blank');
            }
        },
        getSettings() {
            axios.get(this.$apiUrl + '/web_settings').then((response) => {

                this.settings = response.data.data.settingsObject;
                this.record = response.data.data.settings;

                // Fill settings
                this.record.forEach((item) => {
                    this.settings[item.variable] = item.value;
                });

                // Now handle translations ONLY ONCE
                const translatableFields = [
                    'site_title',
                    'common_meta_title',
                    'common_meta_description',
                    'website_mode_remark',
                    'app_title',
                    'app_short_description'
                ];

                translatableFields.forEach(field => {

                    const raw = this.settings[field] || '';
                    const json = this.safeJson(raw);

                    if (!this.webTranslations[field]) {
                        this.$set(this.webTranslations, field, {});
                    }

                    this.languages.forEach(lang => {

                        // If JSON exists
                        if (json && typeof json === 'object') {

                            this.$set(
                                this.webTranslations[field],
                                lang.code,
                                json[lang.code] ?? (lang.is_default ? raw : '')
                            );

                        } else {

                            // Fallback to plain text
                            this.$set(
                                this.webTranslations[field],
                                lang.code,
                                lang.is_default ? raw : ''
                            );
                        }

                    });

                });

                // Images
                this.web_logo_url = this.settings.web_logo
                    ? this.$storageUrl + this.settings.web_logo
                    : this.$baseUrl + '/images/logo.png';

                this.favicon_url = this.settings.favicon
                    ? this.$storageUrl + this.settings.favicon
                    : '';

                this.placeholder_image_url = this.settings.placeholder_image
                    ? this.$storageUrl + this.settings.placeholder_image
                    : '';

                this.play_store_logo_url = this.settings.play_store_logo
                    ? this.$storageUrl + this.settings.play_store_logo
                    : '';

                this.ios_store_logo_url = this.settings.ios_store_logo
                    ? this.$storageUrl + this.settings.ios_store_logo
                    : '';
            });
        },

        handlePlayStoreLogoUpload: function () {
            this.settings.play_store_logo = this.$refs.play_store_logo.files[0];
            this.play_store_logo_url = URL.createObjectURL(this.settings.play_store_logo);
            this.play_store_logo_name = this.settings.play_store_logo.name;
        },
        dropFilePlayStoreLogo(event) {
            event.preventDefault();
            this.$refs.play_store_logo.files = event.dataTransfer.files;
            this.handlePlayStoreLogoUpload(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        handleIosStoreLogoUpload: function () {
            this.settings.ios_store_logo = this.$refs.ios_store_logo.files[0];
            this.ios_store_logo_url = URL.createObjectURL(this.settings.ios_store_logo);
            this.ios_store_logo_name = this.settings.ios_store_logo.name;
        },
        dropFileIosStoreLogo(event) {
            event.preventDefault();
            this.$refs.ios_store_logo.files = event.dataTransfer.files;
            this.handleIosStoreLogoUpload(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        handleFaviconUpload: function (event) {
            const input = event?.target || this.$refs.favicon;
            const file = input?.files?.[0];
            if (!file) return;
            this.settings.favicon = file;
            this.favicon_url = URL.createObjectURL(file);
            this.favicon_name = file.name;
        },

        dropFileFavicon(event) {
            event.preventDefault();
            const input = this.$refs.favicon;
            if (input && event.dataTransfer?.files?.length) {
                input.files = event.dataTransfer.files;
                this.handleFaviconUpload({ target: input });
            }
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        handlePlaceholderImageUpload: function (event) {
            const input = event?.target || this.$refs.placeholder_image;
            const file = input?.files?.[0];
            if (!file) return;
            this.settings.placeholder_image = file;
            this.placeholder_image_url = URL.createObjectURL(file);
            this.placeholder_image_name = file.name;
        },

        dropFilePlaceholderImage(event) {
            event.preventDefault();
            const input = this.$refs.placeholder_image;
            if (input && event.dataTransfer?.files?.length) {
                input.files = event.dataTransfer.files;
                this.handlePlaceholderImageUpload({ target: input });
            }
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        triggerFileInput(refName) {
            this.$nextTick(() => {
                const ref = this.$refs[refName];
                const el = Array.isArray(ref) ? ref[0] : ref;
                if (el && typeof el.click === 'function') {
                    el.click();
                }
            });
        },

        handleWebLogoUpload: function (event) {
            const input = event?.target || this.$refs.web_logo;
            const file = input?.files?.[0];
            if (!file) return;
            this.settings.web_logo = file;
            this.web_logo_url = URL.createObjectURL(file);
            this.web_logo_name = file.name;
        },
        dropFileWebLogo(event) {
            event.preventDefault();
            const input = this.$refs.web_logo;
            if (input && event.dataTransfer?.files?.length) {
                input.files = event.dataTransfer.files;
                this.handleWebLogoUpload({ target: input });
            }
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        validateDefaultLanguage() {
            if (!this.defaultLanguageId) {
                this.showError(__('default_language_not_found'));
                return false;
            }

            const defaultLang = this.languages.find(l => l.id === this.defaultLanguageId);
            if (!defaultLang || !defaultLang.code) {
                this.showError(__('default_language_not_found'));
                return false;
            }

            // Validate all required default language fields
            const siteTitle = this.webTranslations?.site_title?.[defaultLang.code];
            const commonMetaTitle = this.webTranslations?.common_meta_title?.[defaultLang.code];
            const commonMetaDesc = this.webTranslations?.common_meta_description?.[defaultLang.code];
            const websiteUrl = this.settings?.website_url || '';
            const color = this.settings?.color || '';
            const lightColor = this.settings?.light_color || '';

            const isEmpty = (v) => !v || String(v).trim() === '';

            if (isEmpty(siteTitle)) {
                this.showError(__('please_fill_site_title_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (isEmpty(commonMetaTitle)) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (isEmpty(commonMetaDesc)) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (isEmpty(websiteUrl)) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (isEmpty(color) || isEmpty(lightColor)) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            return true;
        },

        switchToDefaultLanguageTab() {
            const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                this.activeLanguageTab = defaultLangIndex;
            }
        },

        saveRecord: function () {
            if (!this.validateDefaultLanguage()) return;
            this.isLoading = true;
            let settingsObject = this.settings;
            let formData = new FormData();
            const fileKeys = ['web_logo', 'favicon', 'placeholder_image', 'play_store_logo', 'ios_store_logo', 'loading'];
            for (let key in settingsObject) {
                const val = settingsObject[key];
                if (val === undefined || val === null) continue;
                if (val instanceof File) {
                    formData.append(key, val, val.name);
                } else if (!fileKeys.includes(key) || typeof val === 'string') {
                    formData.append(key, val);
                }
            }
            const cleanLangObject = (obj = {}) => {
                const cleaned = {};
                Object.keys(obj).forEach(lang => {
                    let value = obj[lang];
                    if (typeof value === 'string') {
                        value = value.replace(/\r?\n|\r/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
                    }
                    cleaned[lang] = value || '';
                });
                return cleaned;
            };

            formData.append('site_title', JSON.stringify(cleanLangObject(this.webTranslations.site_title)));
            formData.append('common_meta_title', JSON.stringify(cleanLangObject(this.webTranslations.common_meta_title)));
            formData.append('common_meta_description', JSON.stringify(cleanLangObject(this.webTranslations.common_meta_description)));
            formData.append('website_mode_remark', JSON.stringify(cleanLangObject(this.webTranslations.website_mode_remark)));
            formData.append('app_title', JSON.stringify(cleanLangObject(this.webTranslations.app_title)));
            formData.append('app_short_description', JSON.stringify(cleanLangObject(this.webTranslations.app_short_description)));

            let url = this.$apiUrl + '/web_settings/save';
            let vm = this;
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    this.getSettings();
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            vm.isLoading = false;
                            window.location.reload();
                            vm.$router.push({ path: '/general_settings' })
                        }, 2000);
                } else {
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
                vm.isLoading = false;
            });
        }
    }
}
</script>
<style scoped>
/* Keep label inline so the * sits beside it, not below */
.form-group label {
    display: inline;
}

/* Image preview size - consistent max dimensions for all previews */
.image-preview {
    max-width: 150px;
    max-height: 150px;
    height: auto;
    object-fit: contain;
}
</style>