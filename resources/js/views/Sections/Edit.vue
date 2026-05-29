<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" size="xxl" scrollable
        no-close-on-backdrop no-fade static id="mymodal">
        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">{{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>
            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>
        <form ref="my-form" @submit.prevent="saveRecord">

            <b-tabs :key="tabsKey" v-model="activeLanguageTab" content-class="mt-3" v-if="languages.length > 0">
                <!-- Default Language Tab - Show All Fields -->
                <b-tab v-for="lang in languages" :key="lang.id" v-if="lang.is_default">

                    <template #title>
                        <span :class="{ 'text-primary font-weight-bold': lang.is_default }">
                            {{ lang.name }}
                        </span>
                    </template>

                    <!-- Translate buttons -->
                    <div class="mb-3" v-if="lang.is_default && languages.length > 1">
                        <b-button size="sm" variant="outline-primary" class="mr-2" @click="translateEmpty(lang)"
                            v-b-tooltip.hover
                            :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                            :disabled="loadingEmpty">
                            <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                            <b-spinner v-else small></b-spinner>
                        </b-button>

                        <b-button size="sm" variant="outline-danger" @click="translateOverwrite(lang)"
                            v-b-tooltip.hover
                            :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                            :disabled="loadingOverwrite">
                            <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                            <b-spinner v-else small></b-spinner>
                        </b-button>

                    </div>
                    <!-- Translate buttons END -->

                    <div v-if="translations[lang.id]">

                        <div class="form-group">
                            <label>{{ __('title_for_section') }}</label>
                            <i class="text-danger" v-if="lang.is_default">*</i>
                            <input type="text" class="form-control" :required="lang.is_default ? true : undefined" v-model="translations[lang.id].title">
                        </div>

                        <!-- SHORT DESCRIPTION -->
                        <div class="form-group">
                            <label>{{ __('short_descrption') }}</label>
                            <i class="text-danger" v-if="lang.is_default">*</i>
                            <input type="text" class="form-control" :required="lang.is_default ? true : undefined"
                                v-model="translations[lang.id].short_description">
                        </div>
                        <div class="row">

                            <div class="form-group">
                                <label>{{ __('category_ids') }}</label>

                                <Select2 v-model="section.category_ids" :placeholder="__('select_categories')"
                                    :options="categories_options"
                                    :disabled="section.product_type === 'recently_visited_products'"
                                    :settings="{ multiple: 'multiple', width: '100%', dropdownParent: '#mymodal' }" />
                            </div>
                            <div class="form-group col-md-3">
                                <label for='product_type'> {{ __('product_types') }}</label><i class="text-danger">*</i>
                                <select name='product_type' id='product_type' v-model="section.product_type"
                                    class='form-control form-select'>
                                    <option value=""> {{ __('select_product_type') }}</option>
                                    <option value="all_products"> {{ __('all_products') }}</option>
                                    <option value="new_added_products"> {{ __('new_added_products') }}</option>
                                    <option value="products_on_sale"> {{ __('products_on_sale') }}</option>
                                    <option value="most_selling_products">{{ __('most_selling_products') }}</option>
                                    <option value="custom_products"> {{ __('custom_products') }}</option>
                                    <option value="recently_visited_products"> {{ __('recently_visited_products') }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label for='position'> {{ __('position') }}</label><i class="text-danger">*</i>
                                <select name='position' id='position' v-model="section.position"
                                    class='form-control form-select'>
                                    <option value=""> {{ __('select_position') }}</option>
                                    <option value="top"> {{ __('top') }}</option>
                                    <option value="below_slider"> {{ __('below_slider') }}</option>
                                    <option value="below_category"> {{ __('below_category') }}</option>
                                    <option value="below_shop_by_seller">{{ __('below_shop_by_seller') }}</option>
                                    <option value="below_shop_by_country_of_origin"> {{
                                        __('below_shop_by_country_of_origin') }}</option>
                                    <option value="custom_below_shop_by_brands"> {{ __('below_shop_by_brands') }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label for="background color (Light theme)">{{ __('background_color_for_light_theme')
                                }}</label>
                                <i class="text-danger">*</i>
                                <b-input-group prepend class="mb-2">
                                    <input type="text" v-model="section.background_color_for_light_theme"
                                        class="form-control">
                                    <input type="color" id="color" name='color'
                                        v-model="section.background_color_for_light_theme" class="form-control">
                                </b-input-group>
                            </div>
                            <div class="form-group col-md-3">
                                <label for="background color (Dark theme)">{{ __('background_color_for_dark_theme')
                                }}</label>
                                <i class="text-danger">*</i>
                                <b-input-group prepend class="mb-2">
                                    <input type="text" v-model="section.background_color_for_dark_theme"
                                        class="form-control">
                                    <input type="color" id="color" name='color'
                                        v-model="section.background_color_for_dark_theme" class="form-control">
                                </b-input-group>
                            </div>
                            <div class="form-group" v-if="section.product_type === 'custom_products'">
                                <label>{{ __('products') }}</label>

                                <Select2 v-model="section.product_ids" placeholder="Select Products"
                                    :options="products_options"
                                    :settings="{ multiple: 'multiple', width: '100%', dropdownParent: '#mymodal' }" />

                            </div>
                            <div class="col-md-6 form-group">
                                <div class="form-group row">
                                    <div class="col-md-12 col-sm-12">
                                        <label class="required">{{ __('select_style_for_app_section') }}</label><i
                                            class="text-danger">*</i>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-3 col-sm-3">
                                        <label class="radio-img">
                                            <input type="radio" value="style_1" v-model="section.style_app" required
                                                class="form-control">
                                            <img :src="$baseUrl + '/images/app_style/App_Style_1.jpg'" alt="style_1"
                                                class="style_image">
                                        </label>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <label class="radio-img">
                                            <input type="radio" value="style_2" v-model="section.style_app">
                                            <img :src="$baseUrl + '/images/app_style/App_Style_2.jpg'" alt="style_2"
                                                class="style_image">
                                        </label>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <label class="radio-img">
                                            <input type="radio" value="style_3" v-model="section.style_app">
                                            <img :src="$baseUrl + '/images/app_style/App_Style_3.jpg'" alt="style_3"
                                                class="style_image">
                                        </label>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <label class="radio-img">
                                            <input type="radio" value="style_4" v-model="section.style_app">
                                            <img :src="$baseUrl + '/images/app_style/App_Style_4.jpg'" alt="style_4"
                                                class="style_image">
                                        </label>
                                    </div>
                                </div>

                                <!-- Show file upload input if style_4 is selected -->
                                <div class="form-group" v-if="section.style_app === 'style_4'">
                                    <label for="banner_app">{{ __('banner_image') }}<i class="text-danger">*</i></label>

                                    <span v-if="section.error" class="error">{{ section.error }}</span>
                                    <input type="file" name="banner_app" accept="image/*" id="banner_app"
                                        @change="handleFileUploadBannerApp" :ref="'file_banner_app_' + lang.id"
                                        class="file-input">

                                    <div class="file-input-div bg-gray-100" @click="triggerBannerAppUpload(lang.id)"
                                        @drop="dropFile" @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                        <template v-if="section.banner_app && section.banner_app.name !== ''">
                                            <label> {{ __('selected_file_name') }} {{ section.banner_app.name }}</label>
                                        </template>
                                        <template v-else>
                                            <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                            <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                        </template>
                                    </div>

                                    <div class="row" v-if="section.banner_app_url">
                                        <div class="col-md-2">
                                            <img class="custom-image" :src="section.banner_app_url" title="Offer Image"
                                                alt="Offer Image" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 form-group">
                                <div class="form-group row">
                                    <div class="col-md-12 col-sm-12">
                                        <label class="required">{{ __('select_style_for_web_section') }}</label><i
                                            class="text-danger">*</i>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-3 col-sm-3">
                                        <label class="radio-img">
                                            <input type="radio" value="style_1" required="" class="form-control"
                                                v-model="section.style_web">
                                            <img :src="$baseUrl + '/images/web_style/Web_Style_1.jpg'" alt="style_1"
                                                class="style_image">
                                        </label>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <label class="radio-img">
                                            <input type="radio" value="style_2" v-model="section.style_web">
                                            <img :src="$baseUrl + '/images/web_style/Web_Style_2.jpg'" alt="style_2"
                                                class="style_image">
                                        </label>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <label class="radio-img">
                                            <input type="radio" value="style_3" v-model="section.style_web">
                                            <img :src="$baseUrl + '/images/web_style/Web_Style_3.jpg'" alt="style_3"
                                                class="style_image">
                                        </label>
                                    </div>
                                    <div class="col-md-3 col-sm-3">
                                        <label class="radio-img">
                                            <input type="radio" value="style_4" v-model="section.style_web">
                                            <img :src="$baseUrl + '/images/web_style/Web_Style_4.jpg'" alt="style_4"
                                                class="style_image">
                                        </label>
                                    </div>

                                </div>
                                <!-- Show file upload input if style_4 is selected -->
                                <div class="form-group row" v-if="section.style_web === 'style_4'">
                                    <div class="col-md-12">
                                        <label for="banner_web"> {{ __('banner_image') }}<i
                                                class="text-danger">*</i></label>
                                        <span v-if="section.error_web" class="error">{{ section.error_web }}</span>
                                        <input type="file" name="banner_web" accept="image/*" id="banner_web"
                                            @change="handleFileUploadBannerWeb" :ref="'file_banner_web_' + lang.id"
                                            class="file-input">

                                        <div class="file-input-div bg-gray-100 mt-2"
                                            @click="triggerBannerWebUpload(lang.id)" @drop="dropFileWeb"
                                            @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                            <template v-if="section.banner_web && section.banner_web.name !== ''">
                                                <label> {{ __('selected_file_name') }} {{ section.banner_web.name
                                                }}</label>
                                            </template>
                                            <template v-else>
                                                <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                            </template>
                                        </div>

                                        <div class="row mt-2" v-if="section.banner_web_url">
                                            <div class="col-md-2">
                                                <img class="custom-image" :src="section.banner_web_url"
                                                    title="Banner Web Image" alt="Banner Web Image" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-tab>

                <!-- Other Language Tabs - Show Only Translatable Fields -->
                <b-tab v-for="lang in languages" :key="lang.id" v-if="!lang.is_default">

                    <template #title>
                        <span>
                            {{ lang.name }}
                        </span>
                    </template>

                    <div v-if="translations[lang.id]">
                        <!-- Title (Translatable) -->
                        <div class="form-group">
                            <label>{{ __('title_for_section') }}</label>
                            <i class="text-danger" v-if="lang.is_default">*</i>
                            <input type="text" class="form-control" :required="lang.is_default ? true : undefined" v-model="translations[lang.id].title">
                        </div>

                        <!-- Short Description (Translatable) -->
                        <div class="form-group">
                            <label>{{ __('short_descrption') }}</label>
                            <i class="text-danger" v-if="lang.is_default">*</i>
                            <input type="text" class="form-control" :required="lang.is_default ? true : undefined" v-model="translations[lang.id].short_description">
                        </div>
                    </div>
                </b-tab>
            </b-tabs>
            <button ref="dummy_submit" style="display:none;" formnovalidate></button>

        </form>
    </b-modal>

</template>


<script>

import axios from 'axios';
import Multiselect from 'vue-multiselect'
import Select2 from "v-select2-component";
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    props: ['record'],
    components: {
        Multiselect,
        Select2
    },
    data() {
        return {
            previousCategoryIds: [],
            isLoading: false,
            categories: [],
            products: [],

            section: {
                style_app: 'style_1',
                style_web: 'style_1',
                category_ids: [],
                id: this.record?.id || null,
                product_type: this.record?.product_type || '',
                position: this.record?.position || '',
                background_color_for_light_theme: this.record?.background_color_for_light_theme || '',
                background_color_for_dark_theme: this.record?.background_color_for_dark_theme || '',
                product_ids: [],
                banner_app: null,
                banner_app_url: '',
                banner_web: null,
                banner_web_url: '',
                error: null,
                error_web: null
            },

            languages: [],
            translations: {},
            defaultLanguageId: null,
            activeLanguageTab: 0,
            tabsKey: 0,
            currentLanguageId: null,
            activeLanguages: [],

            // Translate buttons
            translatableFields: ['title', 'short_description'],
            loadingEmpty: false,
            loadingOverwrite: false,
        };
    },
    created: function () {
        // Fetch languages first, then categories and products
        this.fetchLanguages().then(() => {
            this.getCategories();
            this.getProducts();
        });
    },
    watch: {
        'section.product_type'(newVal, oldVal) {

            if (newVal === 'recently_visited_products') {
                // save existing categories
                this.previousCategoryIds = [...(this.section.category_ids || [])];
                this.section.category_ids = [];
            }

            if (
                oldVal === 'recently_visited_products' &&
                newVal !== 'recently_visited_products'
            ) {
                // restore categories
                this.section.category_ids = [...this.previousCategoryIds];
            }
        },
        record: {
            immediate: true,
            deep: true,
            handler(newVal) {
                if (newVal && newVal.id) {
                    this.section.id = newVal.id;
                    // Only load section data if languages are already loaded
                    if (this.languages.length > 0) {
                        this.loadSection();
                    }
                } else {
                    this.section.id = null;
                    // Reset form for new section
                    this.section.product_type = '';
                    this.section.position = '';
                    this.section.category_ids = [];
                    this.section.product_ids = [];
                    this.section.style_app = 'style_1';
                    this.section.style_web = 'style_1';
                    this.section.background_color_for_light_theme = '';
                    this.section.background_color_for_dark_theme = '';
                    this.section.banner_app_url = '';
                    this.section.banner_web_url = '';
                    // Reset translations
                    this.languages.forEach(lang => {
                        if (this.translations[lang.id]) {
                            this.translations[lang.id].title = '';
                            this.translations[lang.id].short_description = '';
                        }
                    });
                }
                this.tabsKey++;
            }
        }
    }
    ,

    computed: {
        modal_title: function () {
            let title = this.section.id ? __('edit') : __('create');
            title += __('manage_featured_products_section');
            return title;
        },
        categories_options: function () {
            return this.categories.map(category => ({
                id: category.id,
                text: this.getTranslatedCategoryName(category),
            }));
        },
        products_options: function () {
            var temp = [];
            if (this.products.length !== 0) {
                this.products.forEach(product => {
                    // Get translated product name
                    const productName = this.getTranslatedProductName(product);
                    temp.push({ id: product.id, text: productName })
                });
            }
            return temp;
        },
    },

    methods: {
        triggerBannerWebUpload(langId) {
            const input = this.$refs['file_banner_web_' + langId];

            if (Array.isArray(input)) {
                input[0]?.click();
            } else {
                input?.click();
            }
        },

        triggerBannerAppUpload(langId) {
            const input = this.$refs['file_banner_app_' + langId];
            if (Array.isArray(input)) {
                input[0]?.click();
            } else {
                input?.click();
            }
        },
        fetchLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(res => {
                    this.languages = res.data.data;
                    const def = this.languages.find(l => l.is_default == 1);
                    this.defaultLanguageId = def?.id;

                    // Set current language for dropdowns
                    this.activeLanguages = res.data.data;
                    const appLocale = window.appLocale || 'en';
                    const currentLang = this.activeLanguages.find(l => l.code === appLocale);
                    if (currentLang) {
                        this.currentLanguageId = currentLang.id;
                    } else {
                        const defaultLang = this.activeLanguages.find(l => l.is_default === 1);
                        if (defaultLang) this.currentLanguageId = defaultLang.id;
                    }

                    this.languages.forEach(l => {
                        this.$set(this.translations, l.id, {
                            title: '',
                            short_description: ''
                        });
                    });
                });
        },
        getTranslatedCategoryName(category) {
            // If no language is set, return main table name
            if (!this.currentLanguageId || !category) {
                return category.name || '';
            }

            // Check if category has translations array
            if (category.translations && Array.isArray(category.translations)) {
                const translation = category.translations.find(
                    t => t.language_id === this.currentLanguageId
                );

                // Use translation if it exists and has value
                if (translation && translation.name && translation.name.trim() !== '') {
                    return translation.name;
                }
            }

            // Fallback: Use main table name if no translation found
            return category.name || '';
        },
        getTranslatedProductName(product) {
            // If no language is set, return main table name
            if (!this.currentLanguageId || !product) {
                return product.name || '';
            }

            // Check if product has translations array
            if (product.translations && Array.isArray(product.translations)) {
                const translation = product.translations.find(
                    t => t.language_id === this.currentLanguageId
                );

                // Use translation if it exists and has value
                if (translation && translation.name && translation.name.trim() !== '') {
                    return translation.name;
                }
            }

            // Fallback: Use main table name if no translation found
            return product.name || '';
        },

        loadSection() {
            if (!this.section.id) return;

            return axios.get(this.$apiUrl + '/sections', {
                params: { id: this.section.id }
            }).then(res => {
                const s = res.data.data[0];

                if (!s) {
                    console.error('Section not found');
                    return;
                }

                // Load main section fields
                this.section.id = s.id;
                this.section.product_type = s.product_type || '';
                this.section.position = s.position || '';
                this.section.category_ids = s.category_ids || [];
                this.section.product_ids = s.product_ids || [];
                this.section.style_app = s.style_app || 'style_1';
                this.section.style_web = s.style_web || 'style_1';
                this.section.background_color_for_light_theme = s.background_color_for_light_theme || '';
                this.section.background_color_for_dark_theme = s.background_color_for_dark_theme || '';
                this.section.banner_app_url = s.banner_app_url || '';
                this.section.banner_web_url = s.banner_web_url || '';

                // Ensure all languages are initialized first
                this.languages.forEach(lang => {
                    if (!this.translations[lang.id]) {
                        this.$set(this.translations, lang.id, {
                            title: '',
                            short_description: ''
                        });
                    }
                });

                // Get main table title and short_description for fallback
                const mainTitle = s.title || '';
                const mainShortDescription = s.short_description || '';

                // Process translations with fallback logic
                this.languages.forEach(lang => {
                    const translation = Array.isArray(s.translations) && s.translations.length > 0
                        ? s.translations.find(t => t.language_id === lang.id)
                        : null;

                    if (lang.is_default) {
                        // For default language, use translation if exists and has value, otherwise fallback to main table data
                        this.$set(this.translations, lang.id, {
                            title: (translation && translation.title && translation.title.trim() !== '')
                                ? translation.title
                                : (mainTitle || ''),
                            short_description: (translation && translation.short_description && translation.short_description.trim() !== '')
                                ? translation.short_description
                                : (mainShortDescription || ''),
                        });
                    } else {
                        // For other languages, use translation if exists, otherwise empty
                        this.$set(this.translations, lang.id, {
                            title: (translation && translation.title) ? translation.title : '',
                            short_description: (translation && translation.short_description) ? translation.short_description : '',
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
            if (!defaultTranslation.title || defaultTranslation.title.trim() === '') {
                this.showError(__('please_fill_title_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }

            if (!defaultTranslation.short_description || defaultTranslation.short_description.trim() === '') {
                this.showError(__('please_fill_short_description_in_default_language'));
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
        },

        validateDefaultLanguageForTranslation() {
            const form = this.$refs['my-form'];
            if (form && !form.reportValidity()) {
                this.$nextTick(() => this.switchToDefaultLanguageTab());
                return false;
            }
            return this.validateDefaultLanguage();
        },
        showModal() {
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        getCategories() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/categories/active')
                .then((response) => {
                    this.isLoading = false
                    this.categories = response.data.data;
                }).catch(error => {
                    this.isLoading = false;
                    if (error.request.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });
        },
        getProducts() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/products/active')
                .then((response) => {
                    this.isLoading = false
                    this.products = response.data.data;
                }).catch(error => {
                    this.isLoading = false;
                    if (error.request.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError(__('something_went_wrong'));
                    }
                });
        },
        dropFile(event) {
            event.preventDefault();
            const files = event.dataTransfer.files;
            if (!files || !files.length) return;

            const file = files[0];
            this.section.banner_app = file;
            this.section.banner_app_url = URL.createObjectURL(file);
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        handleFileUploadBannerApp(event) {
            const files = event?.target?.files;
            if (!files || !files.length) return;

            const file = files[0];
            this.section.error = null;

            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                this.section.error = "Invalid file type.";
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                this.section.error = "File size exceeds 2MB.";
                return;
            }

            this.section.banner_app = file;
            this.section.banner_app_url = URL.createObjectURL(file);
        }
        ,
        dropFileWeb(event) {
            event.preventDefault();

            const files = event.dataTransfer.files;
            if (!files || !files.length) return;

            const file = files[0];
            this.section.banner_web = file;
            this.section.banner_web_url = URL.createObjectURL(file);
        }
        ,
        handleFileUploadBannerWeb(event) {
            const files = event?.target?.files;
            if (!files || !files.length) return;

            const file = files[0];
            this.section.error_web = null;

            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                this.section.error_web = "Invalid file type.";
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                this.section.error_web = "File size exceeds 2MB.";
                return;
            }

            this.section.banner_web = file;
            this.section.banner_web_url = URL.createObjectURL(file);
        },

        async saveRecord() {
            if (!this.validateDefaultLanguage()) return;
            const isUpdate = !!this.section.id;
            this.isLoading = true;
            let sectionId = this.section.id;

            try {
                const langsToSave = [
                    ...this.languages.filter(l => l.is_default),
                    ...this.languages.filter(l => !l.is_default),
                ];

                for (const lang of langsToSave) {
                    const t = this.translations[lang.id];

                    if (!lang.is_default && !t.title && !t.short_description) continue;

                    const fd = new FormData();

                    if (sectionId) fd.append('id', sectionId);
                    fd.append('language_id', lang.id);
                    fd.append('title', t.title);
                    fd.append('short_description', t.short_description);

                    if (lang.is_default) {

                        fd.append('product_type', this.section.product_type || '');
                        fd.append('position', this.section.position || '');

                        fd.append(
                            'background_color_for_light_theme',
                            this.section.background_color_for_light_theme || ''
                        );

                        fd.append(
                            'background_color_for_dark_theme',
                            this.section.background_color_for_dark_theme || ''
                        );

                        fd.append('style_app', this.section.style_app || 'style_1');
                        fd.append('style_web', this.section.style_web || 'style_1');

                        if (Array.isArray(this.section.category_ids)) {
                            this.section.category_ids.forEach(id => {
                                fd.append('category_ids[]', id);
                            });
                        }
                        if (Array.isArray(this.section.product_ids)) {
                            this.section.product_ids.forEach(id => {
                                fd.append('product_ids[]', id);
                            });
                        }

                        if (this.section.banner_app instanceof File) {
                            fd.append('banner_app', this.section.banner_app);
                        }

                        if (this.section.banner_web instanceof File) {
                            fd.append('banner_web', this.section.banner_web);
                        }
                    }

                    const url = sectionId
                        ? this.$apiUrl + '/sections/update'
                        : this.$apiUrl + '/sections/save';

                    const res = await axios.post(url, fd, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });

                    if (!res.data || res.data.status !== 1) {
                        throw new Error(res.data?.message || __('something_went_wrong'));
                    }

                    if (!sectionId && res.data?.data?.id) {
                        sectionId = res.data.data.id;
                    }
                }

                const message = isUpdate
                    ? __('section_updated_successfully') || 'Section updated successfully'
                    : __('section_saved_successfully') || 'Section saved successfully';

                this.$eventBus.$emit('sectionSaved', message);
                this.hideModal();

            } catch (e) {
                this.showError(e.message || __('something_went_wrong'));
            } finally {
                this.isLoading = false;
            }
        },

        addCategoryTag(newTag) {
            const tag = {
                name: newTag,
            }
            this.categories_ids.push(tag)
        },
    },
    mounted() {
        this.showModal();
        this.fetchLanguages().then(() => {
            // Load section data if id exists
            if (this.section.id) {
                this.loadSection();
            }
        });
    }
}
</script>


<style scoped>
.select2-search__field input[type=search] {
    width: 5000px !important;
}
</style>