<template>
    <div>
        <div class="page-heading">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('blogs') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard') }}</router-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">{{ __('blogs') }}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div class="row">
                <div class="col-12 col-md-12 order-md-1 order-last">
                    <div class="card">
                        <div class="card-header">
                            <h4>{{ __('blogs') }}</h4>
                            <span class="pull-right">
                                <button class="btn btn-primary" @click="openAddModal" v-b-tooltip.hover v-if="$can('blog_create')">{{ __('add_blog') }}</button>
                            </span>
                        </div>
                        <div class="card-body">
                            <b-row class="mb-2">
                                <b-col md="2">
                                    <h6 class="box-title">{{ __('category') }}</h6>
                                    <b-form-select v-model="selectedCategory" @change="getBlogs()"
                                        class="form-control form-select">
                                        <option value="">{{ __('all_categories') }}</option>
                                        <option v-for="category in translatedCategories" :key="category.id"
                                            :value="category.id">{{ category.name }}</option>
                                    </b-form-select>
                                </b-col>
                                <b-col md="3" offset-md="5">
                                    <h6 class="box-title">{{ __('search') }}</h6>
                                    <b-form-input id="filter-input" v-model="filter" type="search"
                                        :placeholder="__('search')"></b-form-input>
                                </b-col>
                                <b-col md="1" class="text-center">
                                    <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                                        @click="getBlogs()">
                                        <i class="fa fa-refresh" aria-hidden="true"></i>
                                    </button>
                                </b-col>
                            </b-row>
                            <b-table :items="translatedBlogs" :fields="fields" :filter="filter"
                                :filter-included-fields="filterOn" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                                :sort-direction="sortDirection" :bordered="true" :busy="isLoading" stacked="md"
                                show-empty small>

                                <template #table-busy>
                                    <div class="text-center text-black my-2">
                                        <b-spinner class="align-middle"></b-spinner>
                                        <strong>{{ __('loading') }}...</strong>
                                    </div>
                                </template>

                                <template #cell(image)="row">
                                    <img v-if="row.item.image_url" :src="row.item.image_url" height="50" />
                                    <span v-else class="text-muted">{{ __('no_image') }}</span>
                                </template>

                                <template #cell(category)="row">
                                    <span>{{ row.item.category ? row.item.category.name : '-' }}</span>
                                </template>

                                <template #cell(status)="row">
                                    <span class='badge bg-success' v-if="row.item.status == 1">{{ __('active') }}</span>
                                    <span class='badge bg-danger' v-if="row.item.status == 0">{{ __('deactive')
                                        }}</span>
                                </template>

                                <template #cell(actions)="row">
                                    <button class="btn btn-sm btn-primary" @click="edit_record = row.item"
                                        v-if="$can('blog_update')" v-b-tooltip.hover :title="__('edit')"><i
                                            class="fa fa-pencil-alt"></i></button>
                                    <button class="btn btn-sm btn-danger" @click="deleteBlog(row.index, row.item.id)"
                                        v-if="$can('blog_delete')" v-b-tooltip.hover :title="__('delete')"><i
                                            class="fa fa-trash"></i></button>
                                </template>

                            </b-table>
                            <b-row>
                                <b-col md="2" class="my-1">
                                    <label>
                                        <b-form-group :label="__('per_page')" label-for="per-page-select"
                                            label-align-sm="right" label-size="sm" class="mb-0">
                                            <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"
                                                size="sm" class="form-control form-select"></b-form-select>
                                        </b-form-group>
                                    </label>
                                </b-col>
                                <b-col md="2" class="my-1" offset-md="8">
                                    <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage"
                                        align="fill" size="sm" class="my-0"></b-pagination>
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Create/Edit Blog Modal -->
        <b-modal v-model="create_new" :title="edit_record.id ? __('edit_blog') : __('add_blog')" size="xl"
            :hide-footer="true" @hide="resetForm" id="blog-modal">
            <form @submit.prevent="saveBlog" enctype="multipart/form-data" id="blog-form" novalidate>

                <b-tabs v-model="activeLanguageTab" v-if="languages.length" :key="languagesKey">
                    <b-tab v-for="(lang, index) in languages" :key="lang.id">
                        <!-- TAB TITLE -->
                        <template #title>
                            <span :class="{ 'text-primary': lang.is_default }">
                                {{ lang.name }}
                            </span>
                        </template>

                        <!-- Translate buttons -->
                        <div class="my-3" v-if="lang.is_default && languages.length > 1">
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
                            <div v-if="translateSuccessMessage" class="text-success mt-2 font-weight-bold">
                                {{ translateSuccessMessage }}
                            </div>
                        </div>
                        <!-- Translate buttons END -->

                        <!-- Default Language Tab - Show All Fields -->
                        <template v-if="lang.is_default">
                            <!-- Basic Information Section -->
                            <div class="row">
                                <!-- Left Column -->
                                <div class="col-md-6">
                                    <!-- Title -->
                                    <div class="form-group">
                                        <label for="title">{{ __('title') }} <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="title"
                                            v-model="translations[lang.id].title" :placeholder="__('enter_blog_title')"
                                            @keyup="createSlug(lang.id)" required />
                                    </div>

                                    <!-- Category -->
                                    <div class="form-group">
                                        <label for="category_id">{{ __('category') }} <span
                                                class="text-danger">*</span></label>
                                        <select id="category_id" name="category_id" class="form-control form-select"
                                            v-model="form.category_id" required>
                                            <option value="">{{ __('select_category') }}</option>
                                            <option v-for="category in translatedCategories" :key="category.id"
                                                :value="category.id">
                                                {{ category.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Image (uses common file upload template) -->
                                    <div class="form-group">
                                        <label for="image">{{ __('image') }} <span class="text-danger"
                                                v-if="!edit_record.id || !form.image_url">*</span></label>
                                        <p class="text-muted">
                                            {{ __('supported_formats') }}: JPG, PNG, GIF ({{ __('max_size') }}: 2MB)
                                        </p>
                                        <span v-if="imageError" class="error">{{ imageError }}</span>
                                        <input
                                            type="file"
                                            id="image"
                                            name="blog_image"
                                            accept="image/*"
                                            ref="blog_image"
                                            class="file-input"
                                            @change="handleImageUpload"
                                        >
                                        <div
                                            class="file-input-div bg-gray-100"
                                            @click="triggerBlogImageClick"
                                            @drop="dropImageFile"
                                            @dragover="$dragoverFile"
                                            @dragleave="$dragleaveFile"
                                        >
                                            <template v-if="form.image && form.image.name">
                                                <label>{{ __('selected_file_name') }} {{ form.image.name }}</label>
                                            </template>
                                            <template v-else>
                                                <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                                <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                            </template>
                                        </div>
                                        <div class="row mt-2" v-if="form.image_url">
                                            <div class="col-md-6">
                                                <img
                                                    class="img-thumbnail custom-imag"
                                                    :src="form.image_url"
                                                    :alt="__('image')"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Right Column -->
                                <div class="col-md-6">
                                    <!-- Slug -->
                                    <div class="form-group">
                                        <label for="slug">{{ __('slug') }} <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="slug" v-model="form.slug"
                                            :placeholder="__('enter_slug')" required />
                                    </div>

                                    <!-- Status -->
                                    <div class="form-group">
                                        <label>{{ __('status') }}</label>
                                        <div class="mt-1">
                                            <b-form-radio-group v-model="form.status" :options="[
                                                { text: __('deactivate'), 'value': 0 },
                                                { text: __('activate'), 'value': 1 },
                                            ]" buttons button-variant="outline-primary" required></b-form-radio-group>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Content Description Section -->
                            <div class="row">
                                <div class="col-md-12">
                                    <!-- Short Description with AI Button -->
                                    <div class="form-group">
                                        <label for="short_description">{{ __('short_description') }} <span
                                                class="text-danger">*</span></label>
                                        <div class="d-flex align-items-start">
                                            <div class="flex-grow-1" style="margin-right: 10px;">
                                                <textarea class="form-control" id="short_description"
                                                    v-model="translations[lang.id].short_description" rows="3"
                                                    :placeholder="__('short_description')" required></textarea>
                                            </div>
                                            <div>
                                                <button type="button" class="btn btn-success" @click="generateWithAI"
                                                    :disabled="aiLoading" v-b-tooltip.hover title="Generate with AI">
                                                    <span v-if="aiLoading">
                                                        <i class="fa fa-spinner fa-spin"></i> AI...
                                                    </span>
                                                    <span v-else>
                                                        <i class="fa fa-magic"></i> {{ __('generate_with_ai') }}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <!-- Description -->
                                    <div class="form-group">
                                        <label for="description">{{ __('description') }} <span
                                                class="text-danger">*</span></label>
                                        <editor v-model="translations[lang.id].description"
                                            @input="updateDescriptionValidation" :init="getEditorConfig()"
                                            :placeholder="__('enter_blog_description')" />
                                        <input type="text" id="description_validation" v-model="descriptionValidation"
                                            class="form-control"
                                            style="height: 2px; padding: 0; margin-top: 2px; font-size: 1px; line-height: 2px;"
                                            tabindex="-1" aria-label="Description validation" required />
                                    </div>
                                </div>
                            </div>

                            <!-- Tags (default language tab: after description) -->
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="tags" class="control-label">
                                            {{ __('tags') }} ( {{ __('these_tags_help_you_in_search_result') }} )
                                        </label>
                                        <Select2 :key="'blog-tags-' + lang.id" :value="getTagIdsForLang(lang.id)"
                                            @input="setTagIdsForLang(lang.id, $event)"
                                            @change="setTagIdsForLang(lang.id, $event)" placeholder="Select Tags"
                                            no-add-on-enter :options="getSelect2TagOptions(lang.id)" separator=" ,;"
                                            :settings="tagSelectSettings" />

                                        <div v-if="getTagsOptionsForLang(lang.id).length === 0"
                                            class="text-muted small mt-1">{{ __('no_tags_available') ||
                                                'No tags available for this language.' }}</div>

                                    </div>
                                </div>
                            </div>

                            <!-- Meta Information Section -->
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="meta_title">{{ __('meta_title') }}</label>
                                        <input type="text" class="form-control" id="meta_title"
                                            v-model="translations[lang.id].meta_title"
                                            :placeholder="__('enter_meta_title')" />
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="meta_keywords">{{ __('meta_keywords') }}</label>
                                        <textarea class="form-control" id="meta_keywords"
                                            v-model="translations[lang.id].meta_keywords" rows="3"
                                            :placeholder="__('enter_meta_keywords')"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="meta_description">{{ __('meta_description') }}</label>
                                        <textarea class="form-control" id="meta_description"
                                            v-model="translations[lang.id].meta_description" rows="3"
                                            :placeholder="__('enter_meta_description')"></textarea>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <!-- Other Language Tabs - Show Only Translatable Fields -->
                        <template v-else>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="title">{{ __('title') }}</label>
                                        <input type="text" class="form-control" id="title"
                                            v-model="translations[lang.id].title"
                                            :placeholder="__('enter_blog_title')" />
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="short_description">{{ __('short_description') }}</label>
                                        <textarea class="form-control" id="short_description"
                                            v-model="translations[lang.id].short_description" rows="3"
                                            :placeholder="__('short_description')"></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="description">{{ __('description') }}</label>
                                        <editor v-model="translations[lang.id].description" :init="getEditorConfig()"/>
                                    </div>
                                </div>
                            </div>

                            <!-- Tags (other language tabs: after description) -->
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="tags" class="control-label">
                                            {{ __('tags') }} ( {{ __('these_tags_help_you_in_search_result') }} )
                                        </label>
                                        <Select2 :key="'blog-tags-' + lang.id" :value="getTagIdsForLang(lang.id)"
                                            @input="setTagIdsForLang(lang.id, $event)"
                                            @change="setTagIdsForLang(lang.id, $event)" placeholder="Select Tags"
                                            no-add-on-enter :options="getSelect2TagOptions(lang.id)" separator=" ,;"
                                            :settings="tagSelectSettings" />
                                        <div v-if="getTagsOptionsForLang(lang.id).length === 0"
                                            class="text-muted small mt-1">{{ __('no_tags_available') ||
                                                'No tags available for this language.' }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-12">
                                    <div class="form-group">
                                        <label for="meta_title">{{ __('meta_title') }}</label>
                                        <input type="text" class="form-control" id="meta_title"
                                            v-model="translations[lang.id].meta_title"
                                            :placeholder="__('enter_meta_title')" />
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="meta_keywords">{{ __('meta_keywords') }}</label>
                                        <textarea class="form-control" id="meta_keywords"
                                            v-model="translations[lang.id].meta_keywords" rows="3"
                                            :placeholder="__('enter_meta_keywords')"></textarea>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="meta_description">{{ __('meta_description') }}</label>
                                        <textarea class="form-control" id="meta_description"
                                            v-model="translations[lang.id].meta_description" rows="3"
                                            :placeholder="__('enter_meta_description')"></textarea>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </b-tab>
                </b-tabs>

                <div class="form-group d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary mr-2" @click="create_new = false; resetForm()">{{
                        __('cancel')
                        }}</button>
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                        <span v-if="isSubmitting">{{ __('saving') }}...</span>
                        <span v-else>{{ __('save') }}</span>
                    </button>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios';
import Select2 from "v-select2-component";
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    name: 'Blogs',
    components: {
        Editor
    },
    data() {

        return {
            languages: [],
            activeLanguageTab: 0,
            languagesKey: 0,
            blogs: [],
            categories: [],
            create_new: false,
            edit_record: {},
            aiLoading: false,
            aiPrompt: '',
            form: {
                title: '',
                slug: '',
                category_id: '',
                image: null,
                image_url: '',
                description: '',
                short_description: '',
                meta_title: '',
                // meta_keywords: '',
                // meta_description: '',
                status: 1,
                translations: {},
                currentLanguageId: null,
                activeLanguages: []
            },
            tags: [],
            /** Tags per language so dropdown options are ready when switching tabs: { [languageId]: [{ id, name }] } */
            tagsByLanguage: {},
            /** Tag IDs per language: { [languageId]: ['1','2'] } so each tab keeps its own selection */
            tagIdsByLanguage: {},
            isLoading: false,
            isSubmitting: false,
            filter: '',
            filterOn: ['title', 'description'],
            sortBy: 'id',
            sortDesc: true,
            sortDirection: 'desc',
            selectedCategory: '',
            fields: [
                { key: 'id', label: __('id'), sortable: true, class: 'text-center' },
                { key: 'image', label: __('image'), class: 'text-center' },
                { key: 'title', label: __('title'), sortable: true, class: 'text-center' },
                { key: 'category', label: __('category'), class: 'text-center' },
                { key: 'status', label: __('status'), class: 'text-center' },
                { key: 'actions', label: __('actions'), class: 'text-center' }
            ],
            perPage: 10,
            currentPage: 1,
            totalRows: 0,
            pageOptions: [5, 10, 15, 20, 25, 50, 100],
            descriptionValidation: '',
            translations: {},
            translatableFields: ['title', 'short_description', 'description', 'meta_title', 'meta_keywords', 'meta_description'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
            imageError: null,
        }
    },
    computed: {
        defaultLanguageId() {
            const d = this.languages.find(l => l.is_default);
            return d ? d.id : null;
        },
        translatedCategories() {
            if (!this.currentLanguageId || !Array.isArray(this.categories)) {
                return this.categories;
            }

            return this.categories.map(cat => {
                const c = { ...cat };

                if (Array.isArray(cat.translations)) {
                    const tr = cat.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );

                    if (tr?.name?.trim()) {
                        c.name = tr.name;
                    }
                }

                return c;
            });
        },

        translatedBlogs() {
            if (!this.currentLanguageId || !Array.isArray(this.blogs)) {
                return this.blogs;
            }

            return this.blogs.map(blog => {
                const translatedBlog = { ...blog };

                // Translate blog fields
                if (Array.isArray(blog.translations)) {
                    const tr = blog.translations.find(
                        t => t.language_id === this.currentLanguageId
                    );
                    if (tr?.title) translatedBlog.title = tr.title;
                }

                // Attach translated category name
                if (blog.category) {
                    const catTr = blog.category.translations?.find(
                        t => t.language_id === this.currentLanguageId
                    );
                    translatedBlog.category = {
                        ...blog.category,
                        name: catTr?.name || blog.category.name || '-'
                    };
                }

                return translatedBlog;
            });
        },


        /** Select2 settings for tags dropdown (same as EditProduct). dropdownParent makes dropdown appear inside modal. */
        tagSelectSettings() {
            return {
                tags: true,
                multiple: true,
                width: '100%',
                dropdownParent: '#blog-modal',
                tokenSeparators: [',', ';'],
                placeholder: 'Select Tags'
            };
        }
    },
    mounted() {
        this.getLanguages();
        this.fetchActiveLanguages().then(() => {
            this.getBlogs();
            this.getCategories();
        });

        this.getTags();
    },
    methods: {
        /*--------------------generateWithAI------------------------*/
        async generateWithAI() {
            // Get title from default language
            const defaultLang = this.languages.find(l => l.is_default);
            if (!defaultLang) {
                this.showError(__('default_language_not_found'));
                return;
            }

            const defaultTitle = this.translations[defaultLang.id]?.title || '';
            if (!defaultTitle) {
                this.showError(__('please_fill_default_language_required_fields'));
                return;
            }

            this.aiLoading = true;

            try {
                const response = await axios.post(this.$apiUrl + '/google_gemini', {
                    title: defaultTitle,
                    source: 'web'
                });

                if (response.data.status === 1) {
                    const data = response.data.data;

                    // Update default language translations
                    if (data.title) {
                        this.$set(this.translations[defaultLang.id], 'title', data.title);
                    }
                    if (data.short_description) {
                        this.$set(this.translations[defaultLang.id], 'short_description', data.short_description);
                    }
                    if (data.description) {
                        this.$set(this.translations[defaultLang.id], 'description', data.description);
                    }

                    // Create slug from default language title
                    this.createSlug(defaultLang.id);
                    this.updateDescriptionValidation();
                } else {
                    this.showError(response.data.message || 'AI failed');
                }

            } catch (e) {
                this.showError('AI generation failed');
            } finally {
                this.aiLoading = false;
            }
        },

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
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                setup: (editor) => {
                    editor.on('change', () => {
                        this.updateDescriptionValidation();
                    });
                },
                ...this.$tinymceImageUploadOptions()
            };
        },

        // Get category name helper method
        getCategoryName(categoryId) {
            const category = this.translatedCategories.find(cat => cat.id === categoryId);
            return category ? category.name : '';
        },

        // Fetch active languages
        async fetchActiveLanguages() {
            try {
                const res = await axios.get(this.$apiUrl + '/active_languages');

                if (res.data.status === 1 && Array.isArray(res.data.data)) {
                    this.activeLanguages = res.data.data;

                    const appLocale = window.appLocale || 'en';

                    const currentLang = this.activeLanguages.find(
                        l => l.code === appLocale
                    );

                    if (currentLang) {
                        this.currentLanguageId = currentLang.id;
                    } else {
                        const def = this.activeLanguages.find(l => l.is_default === 1);
                        if (def) this.currentLanguageId = def.id;
                    }
                }
            } catch (e) {
                console.error('Language load failed', e);
            }
        },

        // Initialize translations for all languages
        initTranslations() {
            this.translations = {};
            this.languages.forEach(lang => {
                this.$set(this.translations, lang.id, {
                    title: '',
                    description: '',
                    short_description: '',
                    meta_title: '',
                    meta_keywords: '',
                    meta_description: ''
                });
            });
        },

        // Open add modal - reset form and initialize translations
        openAddModal() {
            this.resetForm();
            this.initTranslations();
            this.initTagIdsByLanguage();
            this.activeLanguageTab = 0;
            this.languagesKey++;
            this.create_new = true;
            this.$nextTick(() => {
                this.getAllTagsForModal();
                this.loadTagIdsFromSession();
            });
        },

        // Get all blogs
        async getBlogs() {
            this.isLoading = true;
            try {
                const params = {
                    limit: this.perPage,
                    page: this.currentPage
                };

                if (this.selectedCategory) {
                    params.category_id = this.selectedCategory;
                }

                const response = await axios.post(
                    this.$apiUrl + '/blogs',
                    params
                );

                if (response.data.status === 1) {
                    this.blogs = response.data.data;
                    this.totalRows = response.data.total;
                } else {
                    this.showError(response.data.message);
                }
            } catch (error) {
                this.showError(__('something_went_wrong'));
            } finally {
                this.isLoading = false;
            }
        },

        async getLanguages() {
            try {
                const res = await axios.get(this.$apiUrl + '/active_languages');
                if (res.data.status === 1) {
                    this.languages = res.data.data;
                    this.initTranslations();
                }
            } catch (e) {
                console.error('Error loading languages', e);
            }
        },

        async getCategories() {
            const res = await axios.get(this.$apiUrl + '/blog_categories/dropdown');
            if (res.data.status === 1) {
                this.categories = res.data.data;
            }
        },
        /** Fetch tags for one language (used when modal is closed, e.g. list view). */
        async getTags(languageId) {
            try {
                const lid = languageId ?? this.languages[this.activeLanguageTab]?.id ?? this.currentLanguageId ?? null;
                const url = lid ? `${this.$apiUrl}/blog_tags?language_id=${lid}` : `${this.$apiUrl}/blog_tags`;
                const response = await axios.get(url);
                if (response.data.status === 1) {
                    this.tags = response.data.data;
                }
            } catch (error) {
                console.error('Error fetching blog tags:', error);
            }
        },
        /** Load all tags and group by language_id so every tab has options ready and selection persists when switching tabs */
        async getAllTagsForModal() {
            if (!this.languages.length) return;
            try {
                const res = await axios.get(`${this.$apiUrl}/blog_tags?all=1`);
                if (res.data.status !== 1 || !Array.isArray(res.data.data)) return;
                const byLang = {};
                this.languages.forEach(lang => {
                    byLang[lang.id] = res.data.data.filter(t => t.language_id === lang.id);
                });
                this.tagsByLanguage = byLang;
            } catch (e) {
                console.error('Error fetching all tags for modal:', e);
            }
        },
        /** Options for one language (for Tags multi-select). Returns { value, text } for b-form-select. */
        getTagsOptionsForLang(langId) {
            if (!langId) return [];
            const list = (this.create_new && this.tagsByLanguage[langId]) ? this.tagsByLanguage[langId] : this.tags;
            const baseOptions = list.length ? list.map(tag => ({ value: String(tag.id), text: tag?.name ?? String(tag.id) })) : [];
            if (!this.create_new) return baseOptions;
            const selectedIds = this.getTagIdsForLang(langId);
            const existingIds = new Set(baseOptions.map(o => o.value));
            selectedIds.forEach(sid => {
                const id = String(sid);
                if (id && !existingIds.has(id)) {
                    existingIds.add(id);
                    baseOptions.push({ value: id, text: id });
                }
            });
            return baseOptions;
        },
        /** Options for Select2: same as getTagsOptionsForLang but with { id, text } (Select2 expects id, not value). Shows only tags for this language tab. */
        getSelect2TagOptions(langId) {
            return this.getTagsOptionsForLang(langId).map(o => ({ id: o.value, text: o.text }));
        },
        /** Get tag IDs for one language (for Select2 :value). Each tab has its own list. */
        getTagIdsForLang(langId) {
            const list = this.tagIdsByLanguage[langId];
            if (Array.isArray(list)) return list;
            if (list != null && list !== '') return [].concat(list);
            return [];
        },
        /** Set tag IDs for one language (for Select2 @input). Keeps selections separate per tab; persists to sessionStorage. */
        setTagIdsForLang(langId, value) {
            const arr = Array.isArray(value) ? value : (value ? [value] : []);
            const trimmed = arr.map(id => id != null ? String(id).trim() : '').filter(Boolean);
            if (trimmed.length === 0) {
                const currentLangId = this.languages[this.activeLanguageTab]?.id;
                if (currentLangId !== langId) return;
            }
            this.$set(this.tagIdsByLanguage, langId, trimmed);
            this.saveTagIdsToSession();
        },
        /** Init tag IDs per language so each tab has its own array. */
        initTagIdsByLanguage() {
            this.tagIdsByLanguage = {};
            this.languages.forEach(lang => {
                this.$set(this.tagIdsByLanguage, lang.id, []);
            });
        },
        /** SessionStorage key for tag selections (add vs edit so they don't mix). */
        getBlogTagsSessionKey() {
            return (this.edit_record && this.edit_record.id) ? `blog_form_tag_ids_${this.edit_record.id}` : 'blog_form_tag_ids_new';
        },
        /** Persist current tag selections to sessionStorage so they survive tab switches. */
        saveTagIdsToSession() {
            if (!this.create_new) return;
            try {
                const key = this.getBlogTagsSessionKey();
                sessionStorage.setItem(key, JSON.stringify(this.tagIdsByLanguage));
            } catch (e) { /* ignore */ }
        },
        /** Restore tag selections from sessionStorage (e.g. after tab switch). */
        loadTagIdsFromSession() {
            if (!this.create_new || !this.languages.length) return;
            try {
                const key = this.getBlogTagsSessionKey();
                const raw = sessionStorage.getItem(key);
                if (!raw) return;
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    this.languages.forEach(lang => {
                        const val = parsed[lang.id] ?? parsed[String(lang.id)];
                        if (Array.isArray(val)) {
                            this.$set(this.tagIdsByLanguage, lang.id, val.map(id => String(id)));
                        }
                    });
                }
            } catch (e) { /* ignore */ }
        },
        /** Clear sessionStorage for tag selections (after save or reset). */
        clearTagIdsSession() {
            try {
                sessionStorage.removeItem('blog_form_tag_ids_new');
                if (this.edit_record && this.edit_record.id) {
                    sessionStorage.removeItem(`blog_form_tag_ids_${this.edit_record.id}`);
                }
            } catch (e) { /* ignore */ }
        },

        triggerBlogImageClick() {
            const ref = this.$refs.blog_image;
            const input = Array.isArray(ref) ? ref[0] : ref;
            if (input && typeof input.click === 'function') {
                input.click();
            }
        },

        dropImageFile(event) {
            event.preventDefault();
            const ref = this.$refs.blog_image;
            const input = Array.isArray(ref) ? ref[0] : ref;
            if (!input) return;
            input.files = event.dataTransfer.files;
            this.handleImageUpload();
            // Clean up drag styles
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },

        handleImageUpload() {
            const ref = this.$refs.blog_image;
            const input = Array.isArray(ref) ? ref[0] : ref;
            if (!input || !input.files || !input.files[0]) {
                return;
            }
            const file = input.files[0];

            this.imageError = null;

            const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
            if (!validTypes.includes(file.type)) {
                this.imageError = this.__('invalid_image_type');
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                this.imageError = this.__('image_too_large_2mb');
                return;
            }

            this.form.image = file;
            this.form.image_url = URL.createObjectURL(file);
        },

        switchToDefaultLanguageTab() {
            const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
            if (defaultLangIndex !== -1) {
                this.showError(__('please_fill_default_language_required_fields'));
                this.activeLanguageTab = defaultLangIndex;
            }
        },

        async saveBlog(event) {
            this.updateDescriptionValidation();

            // Validate required fields for default language
            const defaultLang = this.languages.find(l => l.is_default);
            if (defaultLang) {
                const defaultTranslation = this.translations[defaultLang.id];

                // Validate title
                if (!defaultTranslation?.title || !defaultTranslation.title.trim()) {
                    this.showError(__('please_fill_default_language_required_fields'));
                    // this.activeLanguageTab = this.languages.findIndex(l => l.is_default);
                    this.switchToDefaultLanguageTab();
                    return;
                }

                // Validate short description
                if (!defaultTranslation?.short_description || !defaultTranslation.short_description.trim()) {
                    this.showError(__('please_fill_default_language_required_fields'));
                    this.activeLanguageTab = this.languages.findIndex(l => l.is_default);
                    return;
                }

                // Validate description (strip HTML tags for validation)
                const descriptionText = (defaultTranslation?.description || '').replace(/<[^>]*>/g, '').trim();
                if (!descriptionText) {
                    this.showError(__('please_fill_default_language_required_fields'));
                    this.activeLanguageTab = this.languages.findIndex(l => l.is_default);
                    return;
                }
            }

            const formEl = event.target;
            if (!formEl.checkValidity()) {
                const firstInvalid = formEl.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => {
                        firstInvalid.focus();
                        firstInvalid.reportValidity();
                    }, 100);
                } else {
                    formEl.reportValidity();
                }
                return;
            }

            this.isSubmitting = true;

            try {
                const formData = new FormData();

                // Get default language translation for main blog fields
                const defaultLang = this.languages.find(l => l.is_default);
                const defaultTranslation = defaultLang ? this.translations[defaultLang.id] : null;

                // Basic fields
                formData.append('slug', this.form.slug);
                formData.append('category_id', this.form.category_id);
                formData.append('status', this.form.status);

                // Image
                if (this.form.image) {
                    formData.append('image', this.form.image);
                }

                // Tags: send per-language so backend can create new tags with correct language_id
                this.languages.forEach(lang => {
                    const ids = this.getTagIdsForLang(lang.id);
                    const str = Array.isArray(ids) ? ids.filter(Boolean).map(String).join(',') : (ids || '');
                    if (str) formData.append(`tag_ids_by_language[${lang.id}]`, str);
                });

                // Send only translations that have actual data (not empty)
                // This prevents storing empty translation records
                Object.keys(this.translations).forEach(langId => {
                    const tr = this.translations[langId];

                    // Check if translation has any meaningful data
                    const hasData = (tr.title && tr.title.trim() !== '') ||
                        (tr.description && tr.description.trim() !== '') ||
                        (tr.short_description && tr.short_description.trim() !== '') ||
                        (tr.meta_title && tr.meta_title.trim() !== '') ||
                        (tr.meta_keywords && tr.meta_keywords.trim() !== '') ||
                        (tr.meta_description && tr.meta_description.trim() !== '');

                    // Only send translations that have data
                    if (hasData) {
                        formData.append(`translations[${langId}][title]`, tr.title || '');
                        formData.append(`translations[${langId}][description]`, tr.description || '');
                        formData.append(`translations[${langId}][short_description]`, tr.short_description || '');
                        formData.append(`translations[${langId}][meta_title]`, tr.meta_title || '');
                        formData.append(`translations[${langId}][meta_keywords]`, tr.meta_keywords || '');
                        formData.append(`translations[${langId}][meta_description]`, tr.meta_description || '');
                    }
                });

                let response;
                if (this.edit_record.id) {
                    response = await axios.post(
                        `${this.$apiUrl}/blogs/update/${this.edit_record.id}`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );
                } else {
                    response = await axios.post(
                        `${this.$apiUrl}/blogs/save`,
                        formData,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );
                }

                if (response.data.status === 1) {
                    this.showMessage('success', response.data.message);
                    this.create_new = false;
                    this.resetForm();
                    this.getBlogs();
                    this.getAllTagsForModal();
                } else {
                    this.showError(response.data.message);
                }

            } catch (error) {
                this.showError(__('something_went_wrong'));
            } finally {
                this.isSubmitting = false;
            }
        },

        async deleteBlog(index, id) {
            this.$swal.fire({
                title: __('are_you_sure'),
                text: __('you_will_not_be_able_to_revert_this'),
                confirmButtonText: __('yes_sure'),
                cancelButtonText: __('cancel'),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#37a279',
                cancelButtonColor: '#d33',
            }).then(result => {
                if (result.value) {
                    this.isLoading = true;
                    axios.post(this.$apiUrl + `/blogs/delete/${id}`)
                        .then((response) => {
                            this.isLoading = false;
                            if (response.data.status === 1) {
                                this.showMessage('success', response.data.message);
                                this.getBlogs();
                            } else {
                                this.showError(response.data.message);
                            }
                        })
                        .catch(error => {
                            this.isLoading = false;
                            this.showError(__('something_went_wrong'));
                        });
                }
            });
        },

        resetForm() {
            this.clearTagIdsSession();
            this.form = {
                title: '',
                slug: '',
                category_id: '',
                image: null,
                image_url: '',
                description: '',
                short_description: '',
                meta_title: '',
                meta_keywords: '',
                meta_description: '',
                status: 1
            };
            this.edit_record = {};
            this.tagIdsByLanguage = {};
            this.descriptionValidation = '';
            this.initTranslations();
            if (this.languages.length) this.initTagIdsByLanguage();
        },

        // Create slug from title (for default language only)
        createSlug(langId) {
            // Only create slug from default language title
            if (langId) {
                const defaultLang = this.languages.find(l => l.is_default);
                if (defaultLang && defaultLang.id === langId) {
                    const title = this.translations[langId]?.title || '';
                    if (title !== "") {
                        let slug = title.toLowerCase()
                            .replace(/[^\w ]+/g, '')
                            .replace(/ +/g, '-');
                        this.form.slug = slug;
                    }
                }
            } else {
                // Fallback for old code that doesn't pass langId
                const defaultLang = this.languages.find(l => l.is_default);
                if (defaultLang && this.translations[defaultLang.id]?.title) {
                    const title = this.translations[defaultLang.id].title;
                    if (title !== "") {
                        let slug = title.toLowerCase()
                            .replace(/[^\w ]+/g, '')
                            .replace(/ +/g, '-');
                        this.form.slug = slug;
                    }
                }
            }
        },

        updateDescriptionValidation() {
            const defaultLang = this.languages.find(l => l.is_default);
            if (!defaultLang) return;

            const html = this.translations[defaultLang.id]?.description || '';
            this.descriptionValidation = html.replace(/<[^>]*>/g, '').trim();
        },
        normalizeTagIds(tagValue) {
            if (Array.isArray(tagValue)) {
                return tagValue
                    .map(tagId => {
                        if (tagId === null || tagId === undefined) {
                            return '';
                        }
                        return tagId.toString().trim();
                    })
                    .filter(tagId => tagId !== '');
            }

            if (typeof tagValue === 'string') {
                return tagValue
                    .split(',')
                    .map(tagId => tagId.trim())
                    .filter(tagId => tagId !== '');
            }

            return [];
        }
    },
    watch: {
        edit_record: {
            handler(newVal) {
                if (!newVal.id) return;

                this.form = {
                    slug: newVal.slug || '',
                    category_id: newVal.category_id || '',
                    status: newVal.status,
                    image: null,
                    image_url: newVal.image_url || ''
                };

                this.initTranslations();
                this.initTagIdsByLanguage();

                // Populate tags per language: fetch all tags, group by language for dropdown, and split blog.tags into each tab
                axios.get(`${this.$apiUrl}/blog_tags?all=1`).then(res => {
                    if (res.data.status === 1 && Array.isArray(res.data.data)) {
                        const allTags = res.data.data;
                        const byLang = {};
                        this.languages.forEach(lang => {
                            byLang[lang.id] = allTags.filter(t => t.language_id === lang.id);
                        });
                        this.tagsByLanguage = byLang;
                        if (newVal.tags && newVal.tags.trim()) {
                            const idToLang = {};
                            allTags.forEach(t => { idToLang[String(t.id)] = t.language_id; });
                            const blogTagIds = newVal.tags.split(',').map(id => id.trim()).filter(Boolean);
                            blogTagIds.forEach(tid => {
                                const langId = idToLang[String(tid)];
                                if (langId != null) {
                                    const list = this.getTagIdsForLang(langId);
                                    const sid = String(tid);
                                    if (!list.includes(sid)) this.setTagIdsForLang(langId, list.concat(sid));
                                }
                            });
                        }
                        this.saveTagIdsToSession();
                    }
                }).catch(() => { });

                // Tab switch watcher will restore from session when user changes tabs

                // Get default language for fallback
                const defaultLang = this.languages.find(l => l.is_default);

                // Load translations from API response - only populate languages that have translations
                if (Array.isArray(newVal.translations) && newVal.translations.length > 0) {
                    newVal.translations.forEach(tr => {
                        if (this.translations[tr.language_id]) {
                            // Only populate if translation has data
                            const hasData = (tr.title && tr.title.trim() !== '') ||
                                (tr.description && tr.description.trim() !== '') ||
                                (tr.short_description && tr.short_description.trim() !== '');

                            if (hasData) {
                                this.translations[tr.language_id] = {
                                    title: tr.title || '',
                                    description: tr.description || '',
                                    short_description: tr.short_description || '',
                                    meta_title: tr.meta_title || '',
                                    meta_keywords: tr.meta_keywords || '',
                                    meta_description: tr.meta_description || ''
                                };
                            }
                        }
                    });
                }

                // Apply fallback only for default language if no translation exists
                // Other languages will remain empty if no translation exists
                if (defaultLang) {
                    const defaultTranslation = this.translations[defaultLang.id];

                    // Check if default language translation is missing or empty
                    const isMissing = !defaultTranslation ||
                        (!defaultTranslation.title && !defaultTranslation.description && !defaultTranslation.short_description);

                    if (isMissing) {
                        // Use main table data as fallback only for default language
                        this.translations[defaultLang.id] = {
                            title: newVal.title || '',
                            description: newVal.description || '',
                            short_description: newVal.short_description || '',
                            meta_title: newVal.meta_title || '',
                            meta_keywords: newVal.meta_keywords || '',
                            meta_description: newVal.meta_description || ''
                        };
                    } else {
                        // Fill in any empty fields in default language translation with main table data
                        this.translations[defaultLang.id] = {
                            title: defaultTranslation.title || newVal.title || '',
                            description: defaultTranslation.description || newVal.description || '',
                            short_description: defaultTranslation.short_description || newVal.short_description || '',
                            meta_title: defaultTranslation.meta_title || newVal.meta_title || '',
                            meta_keywords: defaultTranslation.meta_keywords || newVal.meta_keywords || '',
                            meta_description: defaultTranslation.meta_description || newVal.meta_description || ''
                        };
                    }
                }

                this.create_new = true;
                this.activeLanguageTab = 0;
                this.languagesKey++;
                this.$nextTick(() => { this.updateDescriptionValidation(); });
            },
            deep: true
        },
        activeLanguageTab() {
            if (this.create_new && this.languages.length) {
                this.saveTagIdsToSession();
                this.loadTagIdsFromSession();
            }
        },
        currentPage() {
            this.getBlogs();
        },

        perPage() {
            this.currentPage = 1;
            this.getBlogs();
        }
    }
}
</script>