<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ isEdit ? __('edit_master_product') : __('add_master_product') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item">
                                <router-link to="/master_catalog/products">{{ __('master_catalog') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">
                                {{ isEdit ? __('edit') : __('add') }}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>

        <form ref="my-form" @submit.prevent="save" @keydown.enter="$event.preventDefault()" id="masterProductForm">
            <!-- Product details + multi-language tabs -->
            <div class="card">
                <div class="card-header">
                    <h4>{{ __('product_details') }}</h4>
                </div>
                <div class="card-body">
                    <div class="col-md-12 mb-3" v-if="languages.length > 0">
                        <b-tabs v-model="activeLanguageTab" content-class="mt-3">
                            <b-tab v-for="language in languages" :key="language.id" lazy>
                                <template #title>
                                    <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                        {{ language.name }}
                                    </span>
                                </template>

                                <div v-if="translations[language.id]">
                                    <div class="row">
                                        <!-- Name (translated) -->
                                        <div class="col-md-6 mb-3">
                                            <label>{{ __('Product Name') }}
                                                <i class="text-danger" v-if="language.is_default">*</i>
                                            </label>
                                            <input type="text" class="form-control"
                                                :placeholder="__('enter_product_name')"
                                                v-model="translations[language.id].name"
                                                @input="onNameInput(language)"
                                                :required="language.is_default ? true : undefined" />
                                        </div>

                                        <!-- Slug (default only) -->
                                        <template v-if="language.is_default">
                                            <div class="col-md-6 mb-3 mt-2">
                                                <label>{{ __('slug') }}</label>
                                                <input type="text" class="form-control"
                                                    v-model="product.slug" readonly />
                                            </div>

                                            <!-- Parent Company (searchable + inline create) -->
                                            <div class="col-md-6 mb-3 position-relative">
                                                <label>{{ __('parent_company') }}</label>
                                                <input type="text" class="form-control"
                                                    v-model="pcQuery"
                                                    @input="onPcInput"
                                                    @focus="pcDropdownOpen = true"
                                                    @blur="onPcBlur"
                                                    :placeholder="__('search_or_create')"
                                                    autocomplete="off" />
                                                <ul v-if="pcDropdownOpen"
                                                    class="list-group position-absolute w-100 shadow-sm"
                                                    style="z-index: 50; max-height: 240px; overflow-y: auto;">
                                                    <li v-for="pc in pcResults" :key="pc.id"
                                                        class="list-group-item list-group-item-action py-2"
                                                        @mousedown.prevent="selectParentCompany(pc)">
                                                        {{ pc.name }}
                                                    </li>
                                                    <li v-if="pcQuery && !pcExactMatch"
                                                        class="list-group-item list-group-item-action py-2 text-primary"
                                                        @mousedown.prevent="createParentCompany">
                                                        <i class="fa fa-plus"></i> {{ __('create') }}
                                                        "{{ pcQuery }}" {{ __('as_new_parent_company') }}
                                                    </li>
                                                    <li v-if="!pcResults.length && !pcQuery"
                                                        class="list-group-item text-muted py-2">
                                                        {{ __('start_typing_to_search') }}
                                                    </li>
                                                </ul>
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <label>{{ __('brand') }} <i class="text-danger">*</i></label>
                                                <select class="form-control form-select" v-model="product.brand_id" required>
                                                    <option :value="null">-- {{ __('select') }} --</option>
                                                    <option v-for="b in brands" :key="b.id" :value="b.id">
                                                        {{ b.name }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <label>{{ __('category') }} <i class="text-danger">*</i></label>
                                                <select class="form-control form-select" v-model="product.category_id"
                                                    @change="onCategoryChange" required>
                                                    <option :value="null">-- {{ __('select') }} --</option>
                                                    <option v-for="c in categories" :key="c.id" :value="c.id">
                                                        {{ c.name }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <label>{{ __('tax') }}</label>
                                                <select class="form-control form-select" v-model="product.tax_id">
                                                    <option :value="null">-- {{ __('select') }} --</option>
                                                    <option v-for="t in taxes" :key="t.id" :value="t.id">
                                                        {{ t.title }} ({{ t.percentage }}%)
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <label>{{ __('hsn_code') }}</label>
                                                <input type="text" class="form-control" v-model="product.hsn" />
                                            </div>

                                            
                                        </template>

                                        <!-- Description (translated, TinyMCE) -->
                                        <div class="col-md-12 mb-3">
                                            <label>{{ __('description') }}
                                                <i class="text-danger" v-if="language.is_default">*</i>
                                            </label>
                                            <editor :placeholder="__('enter_product_description')"
                                                v-model="translations[language.id].description"
                                                :init="getEditorConfig()" />
                                        </div>

                                        <!-- Main image + Other images (default only) -->
                                        <template v-if="language.is_default">
                                            <div class="col-md-6">
                                                <div class="form-group mb-3">
                                                    <label>{{ __('image') }} <i class="text-danger" v-if="!isEdit">*</i></label>
                                                    <input type="file" name="image" accept="image/*"
                                                        ref="file_image" v-on:change="fileImage"
                                                        class="file-input" />

                                                    <div class="file-input-div bg-gray-100"
                                                        @click="triggerRefClick('file_image')"
                                                        @drop="dropFile"
                                                        @dragover="$dragoverFile"
                                                        @dragleave="$dragleaveFile">
                                                        <template v-if="main_image_name === ''">
                                                            <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                            <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                                        </template>
                                                        <template v-else>
                                                            <label>{{ __('selected_file_name') }} {{ main_image_name }}</label>
                                                        </template>
                                                    </div>
                                                    <p v-if="mainImageError" class="error">{{ mainImageError }}</p>

                                                    <div class="row" v-if="main_image_path">
                                                        <div class="col-md-4">
                                                            <img class="custom-image" :src="main_image_path"
                                                                title="Main Image" alt="Main Image" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="form-group mb-3">
                                                    <label>{{ __('other_images_of_the_product') }}</label>
                                                    <input type="file" name="other_images[]" accept="image/*"
                                                        ref="file_other_images" v-on:change="otherImage"
                                                        multiple class="file-input" />

                                                    <div class="file-input-div bg-gray-100"
                                                        @click="triggerRefClick('file_other_images')"
                                                        @drop="dropFileOtherImage"
                                                        @dragover="$dragoverFile"
                                                        @dragleave="$dragleaveFile">
                                                        <template v-if="images.length === 0">
                                                            <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                            <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                                        </template>
                                                        <template v-else>
                                                            <label>{{ images.length }} {{ __('files_selected') }}</label>
                                                        </template>
                                                    </div>
                                                    <p v-if="otherImageError" class="error">{{ otherImageError }}</p>

                                                    <div class="row" v-if="images.length">
                                                        <h6 class="mt-3">{{ __('selected_other_images') }}</h6>
                                                        <div class="col-md-4 image-container"
                                                            v-for="(image, index) in images" :key="'sel-' + index">
                                                            <img class="img-thumbnail custom-image" :src="image.url"
                                                                :title="image.name" :alt="image.name" />
                                                            <button type="button"
                                                                @click="removeSelectedOtherImage(index)"
                                                                class="btn btn-sm btn-danger btn-remove">
                                                                <i class="fa fa-times-circle"></i>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div class="row" v-if="other_images.length">
                                                        <h6 class="mt-3">{{ __('uploaded_other_images') }}</h6>
                                                        <div class="col-md-4 image-container"
                                                            v-for="(path, index) in other_images" :key="'up-' + index">
                                                            <img class="img-thumbnail custom-image"
                                                                :src="$storageUrl + path"
                                                                title="Other Image" alt="Other Image" />
                                                            <button type="button"
                                                                @click="removeUploadedOtherImage(index)"
                                                                class="btn btn-sm btn-danger btn-remove">
                                                                <i class="fa fa-times-circle"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </div>

                    <div v-else-if="isLoadingLanguages" class="text-center p-3 mb-3">
                        <b-spinner label="Loading languages..."></b-spinner>
                    </div>
                </div>
            </div>           

            <!-- Variants (no per-language) -->
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">{{ __('variants') }}</h4>
                    <button v-if="product.type === 'variable'"
                        type="button"
                        class="btn btn-sm btn-outline-primary"
                        @click="addVariantRow">
                        <i class="fa fa-plus"></i> {{ __('add_variant') }}
                    </button>
                </div>
                <div class="card-body">
                    <div class="col-md-6 mb-3">
                                                <label>{{ __('type') }}</label>
                                                <div>
                                                    <b-form-radio-group
                                                        v-model="product.type"
                                                        :options="[
                                                            { text: __('single'), value: 'single' },
                                                            { text: __('variable'), value: 'variable' }
                                                        ]"
                                                        buttons
                                                        button-variant="outline-primary"
                                                        @change="onTypeChange">
                                                    </b-form-radio-group>
                                                </div>
                                            </div>
                    <div class="table-responsive">
                        <table class="table table-bordered align-middle">
                            <thead class="table-light">
                                <tr>
                                    <th>{{ __('sku') }}</th>
                                    <th>{{ __('outer_pack') }}</th>
                                    <th>{{ __('weight') }}</th>
                                    <th>{{ __('inner_pack') }}</th>
                                    <th>{{ __('secondary_value') }}</th>
                                    <th>{{ __('image') }}</th>
                                    <th>{{ __('status') }}</th>
                                    <th v-if="product.type === 'variable'" style="width:60px;">{{ __('actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="v in visibleVariants" :key="v._key">
                                    <td>
                                        <input type="text" class="form-control form-control-sm" v-model="v.sku" />
                                    </td>
                                    <td>
                                        <select class="form-control form-control-sm" v-model="v.unit_id">
                                            <option :value="null">--</option>
                                            <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="number" class="form-control form-control-sm" step="0.001"
                                            v-model.number="v.weight" />
                                    </td>
                                    <td>
                                        <select class="form-control form-control-sm" v-model="v.secondary_unit_id">
                                            <option :value="null">--</option>
                                            <option v-for="u in units" :key="u.id" :value="u.id">{{ u.name }}</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="number" class="form-control form-control-sm" step="0.01"
                                            v-model.number="v.secondary_unit_value" />
                                    </td>
                                    <td>
                                        <input type="file" class="form-control form-control-sm" accept="image/*"
                                            @change="onVariantImage($event, v)" />
                                        <div v-if="v._imageError" class="text-danger small mt-1">{{ v._imageError }}</div>
                                        <div v-if="v._preview || v.image" class="mt-1">
                                            <img :src="v._preview || ($storageUrl + v.image)" height="40" />
                                        </div>
                                    </td>
                                    <td>
                                        <select class="form-control form-control-sm" v-model.number="v.status">
                                            <option :value="1">{{ __('active') }}</option>
                                            <option :value="0">{{ __('deactive') }}</option>
                                        </select>
                                    </td>
                                    <td v-if="product.type === 'variable'">
                                        <button type="button" class="btn btn-sm btn-danger"
                                            :disabled="visibleVariants.length === 1"
                                            @click="removeVariantRow(v)">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <small class="text-muted">
                        {{ product.type === 'single'
                            ? __('single_type_one_variant_hint')
                            : __('variable_type_multiple_variants_hint') }}
                    </small>
                </div>
            </div>

             <!-- SEO Settings card with language tabs -->
            <div class="card mt-3">
                <div class="card-header">
                    <h4>{{ __('seo_settings') }}</h4>
                </div>
                <div class="card-body">
                    <div class="col-md-12 mb-3" v-if="languages.length > 0">
                        <b-tabs v-model="activeSeoLanguageTab" content-class="mt-3">
                            <b-tab v-for="language in languages" :key="'seo-' + language.id" lazy>
                                <template #title>
                                    <span :class="{ 'text-primary font-weight-bold': language.is_default }">
                                        {{ language.name }}
                                    </span>
                                </template>
                                <div v-if="translations[language.id]" class="row">
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label>{{ __('meta_title') }}</label>
                                            <input type="text" class="form-control"
                                                v-model="translations[language.id].meta_title"
                                                :placeholder="__('enter_meta_title')" />
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>{{ __('meta_keywords') }}</label>
                                            <input type="text" class="form-control"
                                                v-model="translations[language.id].meta_keywords"
                                                :placeholder="__('enter_meta_keywords')" />
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>{{ __('schema_markup') }}</label>
                                            <textarea class="form-control" rows="4"
                                                v-model="translations[language.id].schema_markup"
                                                :placeholder="__('enter_schema_markup')"></textarea>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group mb-3">
                                            <label>{{ __('meta_description') }}</label>
                                            <textarea class="form-control" rows="4"
                                                v-model="translations[language.id].meta_description"
                                                :placeholder="__('enter_meta_description')"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </b-tab>
                        </b-tabs>
                    </div>
                </div>
                <div class="card-footer">
                    <button type="submit" class="btn btn-primary me-2" :disabled="isSaving">
                        {{ __('save') }}
                        <b-spinner small v-if="isSaving"></b-spinner>
                    </button>
                    <router-link to="/master_catalog/products" class="btn btn-secondary">
                        {{ __('cancel') }}
                    </router-link>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue';

export default {
    props: ['id'],
    components: { 'editor': Editor },
    data() {
        return {
            isSaving: false,
            isEdit: false,

            product: {
                id: null,
                slug: '',
                parent_company_id: null,
                brand_id: null,
                category_id: null,
                tax_id: null,
                hsn: '',
                type: 'single',
                status: 1,
            },

            // Main image
            imageFile: null,
            main_image_path: '',
            main_image_name: '',
            mainImageError: null,

            // Other images
            images: [],          // newly selected (not yet uploaded)
            other_images: [],    // already-uploaded paths from server
            deletedOtherImages: [],
            otherImageError: null,

            variants: [this.blankVariant()],

            brands: [],
            categories: [],
            taxes: [],
            units: [],

            // Parent company picker
            pcQuery: '',
            pcResults: [],
            pcDropdownOpen: false,
            pcDebounce: null,

            // Multi-language
            isLoadingLanguages: false,
            activeLanguageTab: 0,
            activeSeoLanguageTab: 0,
            languages: [],
            defaultLanguageId: null,
            translations: {},
        };
    },
    computed: {
        visibleVariants() {
            return this.variants.filter(v => !v._delete);
        },
        pcExactMatch() {
            const q = (this.pcQuery || '').trim().toLowerCase();
            return this.pcResults.some(pc => (pc.name || '').toLowerCase() === q);
        },
    },
    created() {
        this.isEdit = !!this.id;
        this.fetchActiveLanguages().then(() => {
            this.fetchLookups();
            if (this.isEdit) {
                this.fetchProduct();
            }
        });
    },
    methods: {
        // Auto-fill HSN from the selected category's own HSN code, only when
        // the product doesn't already have one entered/saved — never
        // overwrite a value the user (or a loaded product) already has.
        onCategoryChange() {
            if (this.product.hsn) return;
            const category = this.categories.find(c => c.id === this.product.category_id);
            if (category && category.hsn) {
                this.product.hsn = category.hsn;
            }
        },

        // ---------- Languages / translations ----------
        fetchActiveLanguages() {
            this.isLoadingLanguages = true;
            return axios.get(this.$apiUrl + '/active_languages').then(r => {
                this.languages = r.data.data || [];
                const defaultLang = this.languages.find(l => l.is_default === 1);
                if (defaultLang) this.defaultLanguageId = defaultLang.id;
                this.initializeTranslations();
                this.isLoadingLanguages = false;
            }).catch(() => {
                this.isLoadingLanguages = false;
            });
        },
        initializeTranslations() {
            const all = {};
            this.languages.forEach(language => {
                all[language.id] = {
                    name: '',
                    description: '',
                    meta_title: '',
                    meta_keywords: '',
                    schema_markup: '',
                    meta_description: '',
                };
            });
            this.translations = all;
        },
        loadTranslationsFromRecord(record) {
            if (!record || !Array.isArray(record.translations)) return;
            this.languages.forEach(language => {
                const t = record.translations.find(tr => tr.language_id === language.id);
                if (t) {
                    this.$set(this.translations[language.id], 'name', t.name || '');
                    this.$set(this.translations[language.id], 'description', t.description || '');
                    this.$set(this.translations[language.id], 'meta_title', t.meta_title || '');
                    this.$set(this.translations[language.id], 'meta_keywords', t.meta_keywords || '');
                    this.$set(this.translations[language.id], 'schema_markup', t.schema_markup || '');
                    this.$set(this.translations[language.id], 'meta_description', t.meta_description || '');
                }
            });

            // Default language fallback: if no record for default lang, use base columns
            if (this.defaultLanguageId && this.translations[this.defaultLanguageId]) {
                const dt = this.translations[this.defaultLanguageId];
                if (!dt.name) dt.name = record.name || '';
                if (!dt.description) dt.description = record.description || '';
                if (!dt.meta_title) dt.meta_title = record.meta_title || '';
                if (!dt.meta_keywords) dt.meta_keywords = record.meta_keywords || '';
                if (!dt.schema_markup) dt.schema_markup = record.schema_markup || '';
                if (!dt.meta_description) dt.meta_description = record.meta_description || '';
            }
        },
        switchToDefaultLanguageTab() {
            const idx = this.languages.findIndex(l => l.id === this.defaultLanguageId);
            if (idx !== -1) this.activeLanguageTab = idx;
        },
        onNameInput(language) {
            if (language.is_default) this.createSlug();
        },
        createSlug() {
            const name = (this.translations[this.defaultLanguageId] || {}).name || '';
            if (!name) {
                this.product.slug = '';
                return;
            }
            this.product.slug = name
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '')
                .replace(/[^\p{L}\p{N}\s-]/gu, '')
                .trim()
                .replace(/\s+/g, '-')
                .toLowerCase();
        },
        getEditorConfig() {
            const plugins = (this.$editorPlugins && Array.isArray(this.$editorPlugins))
                ? this.$editorPlugins
                : ["autolink", "lists", "link", "image", "charmap", "anchor", "searchreplace", "visualblocks", "media", "table", "wordcount", "code", "codesample"];
            const toolbar = this.$editorToolbar || "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | charmap | code | removeformat";
            const fontSizes = this.$editorFont_size_formats || '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt';
            return {
                height: 400,
                plugins,
                toolbar,
                font_size_formats: fontSizes,
                ...this.$tinymceImageUploadOptions(),
            };
        },

        // ---------- Lookups ----------
        fetchLookups() {
            axios.get(this.$apiUrl + '/products/brands/get').then(r => {
                this.brands = r.data.data || [];
            });
            axios.get(this.$apiUrl + '/categories', { params: { per_page: 1000 } }).then(r => {
                this.categories = r.data.data || [];
            }).catch(() => {});
            axios.get(this.$apiUrl + '/products/taxes').then(r => {
                this.taxes = r.data.data || [];
            }).catch(() => {});
            axios.get(this.$apiUrl + '/units/get').then(r => {
                this.units = r.data.data || [];
            }).catch(() => {});
        },
        fetchProduct() {
            axios.get(this.$apiUrl + '/master_catalog/products/edit/' + this.id).then(r => {
                const p = r.data.data;
                if (!p) return;
                this.product = {
                    id: p.id,
                    slug: p.slug || '',
                    parent_company_id: p.parent_company_id,
                    brand_id: p.brand_id,
                    category_id: p.category_id,
                    tax_id: p.tax_id,
                    hsn: p.hsn,
                    type: p.type || 'single',
                    status: p.status,
                };
                this.pcQuery = p.parent_company ? p.parent_company.name : '';
                if (p.image) {
                    this.main_image_path = this.$storageUrl + p.image;
                }
                this.other_images = Array.isArray(p.other_images) ? p.other_images.slice() : [];

                if (Array.isArray(p.variants) && p.variants.length) {
                    this.variants = p.variants.map(v => ({
                        _key: Math.random().toString(36).slice(2),
                        id: v.id,
                        sku: v.sku,
                        unit_id: v.unit_id,
                        secondary_unit_id: v.secondary_unit_id,
                        secondary_unit_value: v.secondary_unit_value,
                        weight: v.weight,
                        image: v.image,
                        status: v.status,
                        _file: null,
                        _preview: null,
                        _delete: false,
                        _imageError: null,
                    }));
                }

                this.loadTranslationsFromRecord(p);
            });
        },

        // ---------- Main image ----------
        triggerRefClick(refName) {
            this.$nextTick(() => {
                try {
                    const ref = this.$refs[refName];
                    if (!ref) return;
                    if (Array.isArray(ref)) {
                        for (let i = 0; i < ref.length; i++) {
                            if (ref[i] && typeof ref[i].click === 'function') {
                                ref[i].click();
                                return;
                            }
                        }
                        return;
                    }
                    if (typeof ref.click === 'function') ref.click();
                } catch (e) { /* ignore */ }
            });
        },
        dropFile(event) {
            event.preventDefault();
            const fileInput = Array.isArray(this.$refs.file_image)
                ? this.$refs.file_image[0]
                : this.$refs.file_image;
            if (fileInput) {
                fileInput.files = event.dataTransfer.files;
                this.fileImage();
            }
        },
        fileImage() {
            const fileInput = Array.isArray(this.$refs.file_image)
                ? this.$refs.file_image[0]
                : this.$refs.file_image;
            if (!fileInput) return;
            const file = fileInput.files[0];
            this.mainImageError = null;
            if (!file) return;

            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                this.mainImageError = "Invalid file type. Please upload a JPEG, PNG, JPG, GIF or WEBP image.";
                this.main_image_path = '';
                this.main_image_name = '';
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                this.mainImageError = "File size exceeds the maximum allowed limit (2MB).";
                this.main_image_path = '';
                this.main_image_name = '';
                return;
            }
            this.imageFile = file;
            this.main_image_path = URL.createObjectURL(file);
            this.main_image_name = file.name;
        },

        // ---------- Other images ----------
        dropFileOtherImage(event) {
            event.preventDefault();
            const fileInput = Array.isArray(this.$refs.file_other_images)
                ? this.$refs.file_other_images[0]
                : this.$refs.file_other_images;
            if (fileInput) {
                fileInput.files = event.dataTransfer.files;
                this.otherImage();
            }
        },
        otherImage() {
            this.images = [];
            const fileInput = Array.isArray(this.$refs.file_other_images)
                ? this.$refs.file_other_images[0]
                : this.$refs.file_other_images;
            if (!fileInput) return;

            this.otherImageError = null;
            const files = fileInput.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) {
                    this.otherImageError = "Invalid file type. Please upload an image.";
                    continue;
                }
                this.images.push({
                    url: URL.createObjectURL(file),
                    name: file.name,
                    file,
                });
            }
        },
        removeSelectedOtherImage(index) {
            this.images.splice(index, 1);
        },
        removeUploadedOtherImage(index) {
            const path = this.other_images[index];
            if (path) this.deletedOtherImages.push(path);
            this.other_images.splice(index, 1);
        },

        // ---------- Variants ----------
        blankVariant() {
            return {
                _key: Math.random().toString(36).slice(2),
                id: null,
                sku: '',
                unit_id: null,
                secondary_unit_id: null,
                secondary_unit_value: null,
                weight: null,
                image: null,
                status: 1,
                _file: null,
                _preview: null,
                _delete: false,
                _imageError: null,
            };
        },
        onVariantImage(e, v) {
            const file = e.target.files[0];
            v._imageError = null;
            if (!file) return;

            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                v._imageError = "Invalid file type. Please upload a JPEG, PNG, JPG, GIF or WEBP image.";
                e.target.value = '';
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                v._imageError = "File size exceeds the maximum allowed limit (2MB).";
                e.target.value = '';
                return;
            }
            v._file = file;
            v._preview = URL.createObjectURL(file);
        },
        onTypeChange(value) {
            if (value === 'single' && this.visibleVariants.length > 1) {
                this.variants = [this.visibleVariants[0]];
            }
        },
        addVariantRow() {
            this.variants.push(this.blankVariant());
        },
        removeVariantRow(v) {
            if (v.id) {
                v._delete = true;
            } else {
                this.variants = this.variants.filter(x => x._key !== v._key);
            }
        },

        // ---------- Parent company picker ----------
        onPcInput() {
            clearTimeout(this.pcDebounce);
            this.product.parent_company_id = null;
            this.pcDropdownOpen = true;
            this.pcDebounce = setTimeout(() => this.searchPc(), 250);
        },
        searchPc() {
            axios.get(this.$apiUrl + '/master_catalog/parent_companies/search', {
                params: { q: this.pcQuery },
            }).then(r => {
                this.pcResults = r.data.data || [];
            });
        },
        selectParentCompany(pc) {
            this.pcQuery = pc.name;
            this.product.parent_company_id = pc.id;
            this.pcDropdownOpen = false;
        },
        createParentCompany() {
            axios.post(this.$apiUrl + '/master_catalog/parent_companies/find_or_create', {
                name: this.pcQuery,
            }).then(r => {
                const pc = r.data.data;
                if (pc) this.selectParentCompany(pc);
            });
        },
        onPcBlur() {
            setTimeout(() => { this.pcDropdownOpen = false; }, 150);
        },

        // ---------- Save ----------
        validateBeforeSave() {
            const form = this.$refs['my-form'];
            if (form && !form.reportValidity()) {
                this.$nextTick(() => this.switchToDefaultLanguageTab());
                return false;
            }
            if (!this.defaultLanguageId) {
                this.showError(__('default_language_not_found'));
                return false;
            }
            const dt = this.translations[this.defaultLanguageId];
            if (!dt.name || !dt.name.trim()) {
                this.showError(__('please_fill_product_name_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (!dt.description || !dt.description.trim()) {
                this.showError(__('please_fill_description_in_default_language'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (!this.product.brand_id) {
                this.showError(__('please_select_brand'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (!this.product.category_id) {
                this.showError(__('please_select_category'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (!this.isEdit && !this.imageFile) {
                this.showError(__('please_select_main_image'));
                this.switchToDefaultLanguageTab();
                return false;
            }
            if (!this.visibleVariants.length) {
                this.showError(__('at_least_one_variant_required'));
                return false;
            }
            return true;
        },
        buildTranslationsPayload() {
            return this.languages.map(language => {
                const t = this.translations[language.id] || {};
                return {
                    language_id: language.id,
                    name: t.name || '',
                    description: t.description || '',
                    meta_title: t.meta_title || '',
                    meta_keywords: t.meta_keywords || '',
                    schema_markup: t.schema_markup || '',
                    meta_description: t.meta_description || '',
                };
            });
        },
        save() {
            if (!this.validateBeforeSave()) return;
            this.isSaving = true;

            const fd = new FormData();
            if (this.product.parent_company_id) fd.append('parent_company_id', this.product.parent_company_id);
            if (this.product.brand_id) fd.append('brand_id', this.product.brand_id);
            if (this.product.category_id) fd.append('category_id', this.product.category_id);
            if (this.product.tax_id) fd.append('tax_id', this.product.tax_id);
            if (this.product.hsn) fd.append('hsn', this.product.hsn);
            fd.append('type', this.product.type);
            fd.append('status', this.product.status);

            // Multi-language payload (legacy shape: JSON-encoded array)
            fd.append('translations', JSON.stringify(this.buildTranslationsPayload()));

            // Main image
            if (this.imageFile) fd.append('image', this.imageFile);

            // Other images: send fresh ones, plus paths to delete
            this.images.forEach(img => {
                fd.append('other_images[]', img.file);
            });
            this.deletedOtherImages.forEach(path => {
                fd.append('delete_other_images[]', path);
            });

            // Variants
            this.variants.forEach((v, idx) => {
                if (v.id) fd.append(`variants[${idx}][id]`, v.id);
                if (v._delete) fd.append(`variants[${idx}][_delete]`, 1);
                fd.append(`variants[${idx}][sku]`, v.sku || '');
                if (v.unit_id) fd.append(`variants[${idx}][unit_id]`, v.unit_id);
                if (v.secondary_unit_id) fd.append(`variants[${idx}][secondary_unit_id]`, v.secondary_unit_id);
                if (v.secondary_unit_value != null) fd.append(`variants[${idx}][secondary_unit_value]`, v.secondary_unit_value);
                if (v.weight != null) fd.append(`variants[${idx}][weight]`, v.weight);
                fd.append(`variants[${idx}][status]`, v.status);
                if (v._file) fd.append(`variants[${idx}][image]`, v._file);
            });

            const url = this.isEdit
                ? this.$apiUrl + '/master_catalog/products/update'
                : this.$apiUrl + '/master_catalog/products/save';
            if (this.isEdit) fd.append('id', this.product.id);

            axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then(res => {
                    this.isSaving = false;
                    if (res.data.status) {
                        this.showMessage('success',
                            res.data.message ||
                            __(this.isEdit ? 'master_product_updated_successfully' : 'master_product_saved_successfully'));
                        this.$router.push('/master_catalog/products');
                    } else {
                        this.showError(res.data.message);
                    }
                }).catch(err => {
                    this.isSaving = false;
                    const msg = (err.response && err.response.data && err.response.data.message) || __('something_went_wrong');
                    this.showError(msg);
                });
        },
    },
};
</script>
