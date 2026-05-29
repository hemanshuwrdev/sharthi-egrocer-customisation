<template>
  <div>
    <div class="page-heading">
      <div class="row">
        <div class="col-12 col-md-6 order-md-1 order-last">
          <h3>{{ __('blog_categories') }}</h3>
        </div>
        <div class="col-12 col-md-6 order-md-2 order-first">
          <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
            <ol class="breadcrumb">
              <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard') }}</router-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{ __('blog_categories') }}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-12 order-md-1 order-last">
          <div class="card">
            <div class="card-header">
              <h4>{{ __('blog_categories') }}</h4>
              <span class="pull-right">
                <button class="btn btn-primary" @click="openAddModal" v-b-tooltip.hover :title="__('add_new_category')"
                  v-if="$can('blog_category_create')">{{ __('add_category') }}</button>
              </span>
            </div>
            <div class="card-body">


              <b-row class="mb-2">
                <b-col md="3" offset-md="8">
                  <h6 class="box-title">{{ __('search') }}</h6>
                  <b-form-input id="filter-input" v-model="filter" type="search" :placeholder="__('search')"
                    @input="currentPage = 1; getBlogCategories()"></b-form-input>
                </b-col>
                <b-col md="1" class="text-center">
                  <button class="btn btn-primary btn_refresh" v-b-tooltip.hover :title="__('refresh')"
                    @click="getBlogCategories()">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                  </button>
                </b-col>
              </b-row>
              <b-table :items="translatedCategories" :fields="fields" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection" :bordered="true" :busy="isLoading" stacked="md" show-empty small>

                <template #table-busy>
                  <div class="text-center text-black my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong>{{ __('loading') }}...</strong>
                  </div>
                </template>

                <template #cell(status)="row">
                  <span class='badge bg-success' v-if="row.item.status == 1">{{ __('active') }}</span>
                  <span class='badge bg-danger' v-if="row.item.status == 0">{{ __('deactive') }}</span>
                </template>

                <template #cell(blogs_count)="row">
                  <span class="badge bg-info">{{ row.item.active_blogs_count || 0 }}</span>
                </template>

                <template #cell(actions)="row">
                  <button class="btn btn-sm btn-primary" @click="edit_record = row.item"
                    v-if="$can('blog_category_update')" v-b-tooltip.hover :title="__('edit')"><i
                      class="fa fa-pencil-alt"></i></button>
                  <button class="btn btn-sm btn-danger" @click="deleteCategory(row.item.id)"
                    v-if="$can('blog_category_delete')" v-b-tooltip.hover :title="__('delete')"><i
                      class="fa fa-trash"></i></button>
                </template>

              </b-table>
              <b-row>
                <b-col md="2" class="my-1">
                  <label>
                    <b-form-group :label="__('per_page')" label-for="per-page-select" label-align-sm="right"
                      label-size="sm" class="mb-0">
                      <b-form-select id="per-page-select" v-model="perPage" :options="pageOptions" size="sm"
                        class="form-control form-select"></b-form-select>
                    </b-form-group>
                  </label>
                </b-col>
                <b-col md="2" class="my-1" offset-md="8">
                  <label>{{ __('total_records') }}:- {{ totalRows }}</label>,
                  <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" align="fill" size="sm"
                    class="my-0"></b-pagination>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Category Modal -->
    <b-modal v-model="create_new" :title="edit_record.id ? __('edit_category') : __('add_category')" size="lg"
      :hide-footer="true" @hidden="onModalHidden">
      <form @submit.prevent="saveCategory" novalidate>

        <b-tabs :key="tabsKey" v-model="activeLangTab" content-class="mt-3">
          <b-tab v-for="(lang, index) in languages" :key="lang.id">
            <template #title>
              <span :class="{ 'text-primary': lang.is_default }">
                {{ lang.name }}
              </span>
            </template>

            <!-- Translate buttons -->
            <div class="mb-3" v-if="lang.is_default && languages.length > 1">
              <b-button size="sm" variant="outline-primary" class="mr-2" @click="translateEmpty(lang)" v-b-tooltip.hover
                :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                :disabled="loadingEmpty">
                <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                <b-spinner v-else small></b-spinner>
              </b-button>
              <b-button size="sm" variant="outline-danger" @click="translateOverwrite(lang)" v-b-tooltip.hover
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

            <!-- Category Name and Slug in flex layout (only for default language) -->
            <div v-if="lang.is_default" class="d-flex align-items-end mb-3">
              <div class="form-group flex-grow-1 me-2">
                <label>{{ __('category_name') }}</label>
                <i class="text-danger">*</i>
                <input type="text" class="form-control" required v-model="form.translations[lang.id].name"
                  :placeholder="__('enter_category_name')" @keyup="createSlug(lang.id)" />
              </div>
              <div class="form-group flex-grow-1">
                <label>{{ __('slug') }}</label>
                <i class="text-danger">*</i>
                <input type="text" class="form-control" :placeholder="__('enter_slug')" v-model="form.slug" required>
              </div>
            </div>

            <!-- Category Name (for other languages) -->
            <div class="form-group" v-if="!lang.is_default">
              <label>{{ __('category_name') }}</label>
              <input type="text" class="form-control" v-model="form.translations[lang.id].name"
                :placeholder="__('enter_category_name')" />
            </div>

            <!-- Meta Title (Translatable) -->
            <div class="form-group">
              <label>{{ __('meta_title') }}</label>
              <input type="text" class="form-control" v-model="form.translations[lang.id].meta_title"
                :placeholder="__('enter_meta_title')" />
            </div>

            <!-- Meta Keywords and Meta Description side by side -->
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>{{ __('meta_keywords') }}</label>
                  <textarea class="form-control" v-model="form.translations[lang.id].meta_keywords"
                    :placeholder="__('enter_meta_keywords')" rows="3"></textarea>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label>{{ __('meta_description') }}</label>
                  <textarea class="form-control" v-model="form.translations[lang.id].meta_description"
                    :placeholder="__('enter_meta_description')" rows="3"></textarea>
                </div>
              </div>
            </div>

            <!-- Status (only show for default language) -->
            <div class="form-group" v-if="lang.is_default">
              <label>{{ __('status') }}</label>
              <div class="col-md-9 text-left mt-1">
                <b-form-radio-group v-model="form.status" :options="[
                  { text: __('deactivate'), 'value': 0 },
                  { text: __('activate'), 'value': 1 },
                ]" buttons button-variant="outline-primary" required></b-form-radio-group>
              </div>
            </div>

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
import axios from 'axios';
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
  mixins: [TranslationHelper],
  name: 'BlogCategories',
  data() {
    return {
      tabsKey: 0,
      isLoadingData: true,
      categories: [],
      activeLangTab: 0,
      languages: [],
      create_new: false,
      edit_record: {},
      isSubmitting: false,

      form: {
        slug: '',
        status: 1,
        translations: {}
      },
      isLoading: false,
      isSubmitting: false,
      filter: '',
      filterOn: ['id', 'name', 'slug', 'status'],
      sortBy: 'id',
      sortDesc: true,
      sortDirection: 'desc',
      fields: [
        { key: 'id', label: __('id'), sortable: true, class: 'text-center' },
        { key: 'name', label: __('name'), sortable: true, class: 'text-center' },
        { key: 'slug', label: __('slug'), class: 'text-center' },
        { key: 'blogs_count', label: __('blogs_count'), class: 'text-center' },
        { key: 'status', label: __('status'), class: 'text-center' },
        { key: 'actions', label: __('actions'), class: 'text-center' }
      ],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      currentLanguageId: null,
      activeLanguages: [],

      translatableFields: ['name', 'meta_title', 'meta_keywords', 'meta_description'],
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false,

      pageOptions: [5, 10, 15, 20, 25, 50, 100]
    }
  },
  computed: {
    defaultLanguageId() {
      const d = this.languages.find(l => l.is_default === 1);
      return d ? d.id : null;
    },
    translations() {
      return this.form.translations || {};
    },
    translatedCategories() {
      if (!this.currentLanguageId || !Array.isArray(this.categories)) {
        return this.categories;
      }

      return this.categories.map(category => {
        const translated = { ...category };

        if (Array.isArray(category.translations)) {
          const tr = category.translations.find(
            t => t.language_id === this.currentLanguageId
          );

          if (tr) {
            if (tr.name?.trim()) translated.name = tr.name;
            if (tr.meta_title?.trim()) translated.meta_title = tr.meta_title;
            if (tr.meta_keywords?.trim()) translated.meta_keywords = tr.meta_keywords;
            if (tr.meta_description?.trim()) translated.meta_description = tr.meta_description;
          }
        }

        return translated;
      });
    }
  },
  mounted() {
    this.fetchActiveLanguages().then(() => {
      this.getBlogCategories();
    });

    if (!this.languages.length) {
      this.getLanguages();
    }
  },
  methods: {
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

    onModalHidden() {
      this.resetForm();
      this.edit_record = {};
      this.activeLangTab = this.getDefaultLangIndex();
      this.tabsKey++;
    },
    // change 
    getDefaultLangIndex() {
      const index = this.languages.findIndex(l => l.is_default === 1);
      return index !== -1 ? index : 0;
    },
    //change 
    openAddModal() {
      this.edit_record = {};
      this.resetForm();
      this.activeLangTab = this.getDefaultLangIndex();
      this.tabsKey++;
      this.create_new = true;
    },

    async getLanguages() {
      const res = await axios.get(this.$apiUrl + '/active_languages');

      // Remove duplicates by ID
      const unique = [];
      const map = new Set();

      res.data.data.forEach(lang => {
        if (!map.has(lang.id)) {
          map.add(lang.id);
          unique.push(lang);
        }
      });

      this.languages = unique;

      this.initTranslations();
    }

    ,
    generateSlug(langId) {
      const name = this.form.translations[langId].name;
      if (!name) return;

      this.form.slug = name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    },


    async getBlogCategories() {
      this.isLoading = true;
      try {
        const params = {
          offset: (this.currentPage - 1) * this.perPage,
          limit: this.perPage,
          search: this.filter
        };

        const response = await axios.get(this.$apiUrl + '/blog_categories', { params });
        if (response.data.status === 1) {
          this.categories = response.data.data;
          this.totalRows = response.data.total;
        } else {
          this.showMessage("error", response.data.message);
        }
      } catch (error) {
        this.showError(__('something_went_wrong'));
      } finally {
        this.isLoading = false;
      }
    },

    createSlug(langId) {
      const name = this.form.translations[langId].name;
      if (!name) return;

      this.form.slug = name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
    },


    openCreateModal() {
      this.resetForm();
      this.showModal = true;
    },
    openEditModal(item) {
      this.editId = item.id;
      this.form.status = item.status;

      item.translations.forEach(t => {
        this.form.translations[t.language_id] = {
          name: t.name,
          meta_title: t.meta_title,
          meta_keywords: t.meta_keywords,
          meta_description: t.meta_description
        };
      });

      this.showModal = true;
    },


    async saveCategory() {
      // Validate default language name
      const defaultLang = this.languages.find(l => l.is_default);
      if (!defaultLang) {
        this.showError(__('default_language_not_found'));
        this.isSubmitting = false;
        return;
      }

      const defaultTranslation = this.form.translations[defaultLang.id];
      if (!defaultTranslation || !defaultTranslation.name || defaultTranslation.name.trim() === '') {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLangTab = this.getDefaultLangIndex();
        this.isSubmitting = false;
        return;
      }

      this.isSubmitting = true;

      // Filter translations to only include those with actual data
      // Ensure language IDs are sent as integers to match backend expectations
      const filteredTranslations = {};

      // First, always add default language translation (it's required)
      filteredTranslations[defaultLang.id] = {
        name: defaultTranslation.name.trim() || '',
        meta_title: defaultTranslation.meta_title || '',
        meta_keywords: defaultTranslation.meta_keywords || '',
        meta_description: defaultTranslation.meta_description || ''
      };

      // Then add other languages that have data
      Object.keys(this.form.translations).forEach(langId => {
        const langIdInt = parseInt(langId);

        // Skip default language as we already added it
        if (langIdInt === defaultLang.id) {
          return;
        }

        const tr = this.form.translations[langId];

        // Check if translation has any meaningful data
        const hasData = (tr.name && tr.name.trim() !== '') ||
          (tr.meta_title && tr.meta_title.trim() !== '') ||
          (tr.meta_keywords && tr.meta_keywords.trim() !== '') ||
          (tr.meta_description && tr.meta_description.trim() !== '');

        if (hasData) {
          filteredTranslations[langIdInt] = {
            name: tr.name || '',
            meta_title: tr.meta_title || '',
            meta_keywords: tr.meta_keywords || '',
            meta_description: tr.meta_description || ''
          };
        }
      });

      // Final validation: Ensure default language translation exists with name
      if (!filteredTranslations[defaultLang.id] || !filteredTranslations[defaultLang.id].name || filteredTranslations[defaultLang.id].name.trim() === '') {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLangTab = this.getDefaultLangIndex();
        this.isSubmitting = false;
        return;
      }

      const payload = {
        id: this.edit_record.id || null,
        slug: this.form.slug,
        status: this.form.status,
        translations: filteredTranslations
      };

      const url = this.edit_record.id
        ? '/blog_categories/update'
        : '/blog_categories/save';

      try {
        const res = await axios.post(this.$apiUrl + url, payload);

        if (res.data.status === 1) {
          this.$toast.success(res.data.message);
          this.create_new = false;
          this.getBlogCategories();
          this.resetForm();
        } else {
          this.showError(res.data.message);
        }
      } catch (e) {
        this.showError(__('something_went_wrong'));
      } finally {
        this.isSubmitting = false;
      }
    }
    ,
    deleteCategory(id) {
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_be_able_to_revert_this'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33',
      }).then(async (result) => {
        if (!result.value) return;
        try {
          const res = await axios.post(
            this.$apiUrl + '/blog_categories/delete/' + id
          );
          if (res.data.status === 1) {
            this.$toast.success(res.data.message);
            this.getBlogCategories();
          } else {
            this.$toast.error(res.data.message);
          }
        } catch (e) {
          this.showError(__('something_went_wrong'));
        }
      });
    },
    initTranslations() {
      this.form.translations = {};

      this.languages.forEach(lang => {
        this.$set(this.form.translations, lang.id, {
          name: '',
          meta_title: '',
          meta_keywords: '',
          meta_description: ''
        });
      });
    }
    ,

    resetForm() {
      this.form.slug = '';
      this.form.status = 1;

      Object.keys(this.form.translations).forEach(id => {
        this.form.translations[id].name = '';
        this.form.translations[id].meta_title = '';
        this.form.translations[id].meta_keywords = '';
        this.form.translations[id].meta_description = '';
      });

      this.edit_record = {};
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

  },
  watch: {
    edit_record(val) {
      if (!val?.id) return;
      this.tabsKey++;
      this.form.slug = val.slug;
      this.form.status = val.status;

      // Get default language for fallback
      const defaultLang = this.languages.find(l => l.is_default);

      // Load translations from API response - only populate languages that have translations
      if (Array.isArray(val.translations) && val.translations.length > 0) {
        val.translations.forEach(tr => {
          if (this.form.translations[tr.language_id]) {
            // Only populate if translation has data
            const hasData = tr.name && tr.name.trim() !== '';

            if (hasData) {
              this.form.translations[tr.language_id] = {
                name: tr.name || '',
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
        const defaultTranslation = this.form.translations[defaultLang.id];

        // Check if default language translation is missing or empty
        const isMissing = !defaultTranslation ||
          (!defaultTranslation.name || defaultTranslation.name.trim() === '');

        if (isMissing) {
          // Use main table data as fallback only for default language
          this.form.translations[defaultLang.id] = {
            name: val.name || '',
            meta_title: val.meta_title || '',
            meta_keywords: val.meta_keywords || '',
            meta_description: val.meta_description || ''
          };
        } else {
          // Fill in any empty fields in default language translation with main table data
          this.form.translations[defaultLang.id] = {
            name: defaultTranslation.name || val.name || '',
            meta_title: defaultTranslation.meta_title || val.meta_title || '',
            meta_keywords: defaultTranslation.meta_keywords || val.meta_keywords || '',
            meta_description: defaultTranslation.meta_description || val.meta_description || ''
          };
        }
      }

      this.activeLangTab = this.getDefaultLangIndex();
      this.create_new = true;
    },
    currentPage() {
      this.getBlogCategories();
    },
    perPage() {
      this.getBlogCategories();
    }
  }



}
</script>