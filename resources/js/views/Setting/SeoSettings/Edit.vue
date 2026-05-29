<template>
  <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" scrollable no-close-on-backdrop no-fade
    static>
    <div slot="modal-footer">
      <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">
        {{ __('save') }}
        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
      </b-button>
      <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
    </div>

    <form ref="my-form" @submit.prevent="saveRecord">
      <b-tabs v-model="activeLanguageTab" content-class="mt-3" v-if="languages.length > 0">
        <b-tab v-for="language in languages" :key="language.id" :title="language.name" lazy>
          <template #title>
            <span :class="{ 'text-primary font-weight-bold': language.is_default }">
              {{ language.name }}
            </span>
          </template>

          <!-- Translate buttons -->
          <div class="mb-3" v-if="language.is_default && languages.length > 1">
            <b-button size="sm" variant="outline-primary" class="mr-2" @click="translateEmpty(language)"
              v-b-tooltip.hover :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
              :disabled="loadingEmpty">
              <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
              <b-spinner v-else small></b-spinner>
            </b-button>
            <b-button size="sm" variant="outline-danger" @click="translateOverwrite(language)" v-b-tooltip.hover
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
            <div class="form-group col-md-12" v-if="language.is_default">
              <label>{{ __("SEO Page") }}</label>
              <select v-model="page_type" class="form-control form-select">
                <option v-for="page in pages" :key="page.id" :value="page.value">
                  {{ __(page.name) }}
                </option>
              </select>
            </div>

            <div class="form-group col-md-12">
              <label>{{ __('meta_title') }}</label>
              <i class="text-danger" v-if="language.is_default">*</i>
              <input type="text" class="form-control" v-model="translations[language.id].meta_title"
                :placeholder="__('enter_meta_title')" :required="language.is_default == 1 ? true : undefined">
            </div>

            <div class="form-group col-md-12">
              <label>{{ __('meta_keyword') }}</label>
              <i class="text-danger" v-if="language.is_default">*</i>
              <input type="text" class="form-control" v-model="translations[language.id].meta_keyword"
                :placeholder="__('enter_meta_keywords')" :required="language.is_default == 1 ? true : undefined">
            </div>

            <div class="form-group col-md-12">
              <label>
                {{ __('schema_markup') }}
                <small :id="'schema_markup'"
                  class="d-inline-flex px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary rounded-2">
                  <i class="fa fa-info-circle"></i>
                </small>
                <b-popover :target="'schema_markup'" triggers="hover" placement="left">
                  <p>Schema markup helps search engines understand your content. Generate markup using
                    <a href="https://www.rankranger.com/schema-markup-generator" target="_blank">this
                      tool</a>.
                  </p>
                </b-popover>
              </label>
              <i class="text-danger" v-if="language.is_default">*</i>
              <textarea class="form-control" v-model="translations[language.id].schema_markup"
                :placeholder="__('enter_schema_markup')" rows="4" :required="language.is_default == 1 ? true : undefined"></textarea>
            </div>

            <div class="form-group col-md-12">
              <label>{{ __('meta_description') }}</label>
              <i class="text-danger" v-if="language.is_default">*</i>
              <textarea class="form-control" v-model="translations[language.id].meta_description"
                :placeholder="__('enter_meta_description')" rows="4" :required="language.is_default == 1 ? true : undefined"></textarea>
            </div>
            <div class="form-group" v-if="language.is_default">
              <label>{{ __('og_image') }}</label><i class="text-danger">*</i>
              <p class="text-muted">{{ __('please_choose_square_image_of_larger_than_350px_350px_and_smaller_than_550px_550px') }}</p>
              <span v-if="error" class="error">{{ error }}</span>

              <input type="file" name="og_image" accept="image/*" ref="file_image_default" @change="handleFileUpload"
                class="file-input">
              <div class="file-input-div bg-gray-100" @click="triggerFileInput" @drop="dropFile"
                @dragover="$dragoverFile" @dragleave="$dragleaveFile">

                <template v-if="og_image && og_image.name !== ''">
                  <label>{{ __('selected_file_name') }} {{ og_image.name }}</label>
                </template>
                <template v-else>
                  <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                  <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                </template>

              </div>
              <div class="row" v-if="og_image_url">
                <div class="col-md-4">
                  <img class="custom-image" :src="og_image_url" title='OG Image' alt='OG Image' />
                </div>
              </div>
            </div>
          </div>
        </b-tab></b-tabs>

      <button ref="dummy_submit" style="display: none;"></button>
    </form>
  </b-modal>
</template>

<script>
import axios from 'axios';
import TranslationHelper from '../../../mixins/TranslationHelper.js';

export default {
  props: { 'record': Object },
  mixins: [TranslationHelper],

  data() {
    return {
      error: null,
      isLoading: false,
      languages: [],
      activeLanguageTab: 0,
      defaultLanguageId: null,

      id: this.record?.id || null,
      page_type: this.record?.page_type || 'Home',

      translations: {},
      og_image: null,
      og_image_url: this.record ? this.record.og_image_url : null,

      translatableFields: ['meta_title', 'meta_keyword', 'schema_markup', 'meta_description'],
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false,

      pages: [
        { id: 1, name: 'Home', value: 'Home' },
        { id: 2, name: 'About us', value: 'About us' },
        { id: 3, name: 'Contact us', value: 'Contact us' },
        { id: 4, name: 'Faqs', value: 'Faqs' },
        { id: 5, name: 'Term condition', value: 'Term condition' },
        { id: 6, name: 'Product listing page', value: 'Product listing page' },
        { id: 7, name: 'Privacy policy', value: 'Privacy policy' },
        { id: 8, name: 'Return exchange policy', value: 'Return exchange policy' },
        { id: 9, name: 'Shipping policy', value: 'Shipping policy' },
        { id: 10, name: 'Cancellation policy', value: 'Cancellation policy' },
        { id: 11, name: 'blog_listing_page', value: 'Blog Listing Page' }
      ]
    };
  },

  computed: {
    modal_title: function () {
      return this.id ? __('edit_seo_setting') : __('add_seo_setting');

    }
  },

  methods: {
    triggerFileInput() {
      this.$nextTick(() => {
        const ref = this.$refs.file_image_default;
        const el = Array.isArray(ref) ? ref[0] : ref;

        if (el && typeof el.click === 'function') {
          el.click();
        }
      });
    },

    showModal() {
      this.$refs['my-modal'].show();
    },

    hideModal() {
      this.$refs['my-modal'].hide();
    },

    validateDefaultLanguageForTranslation() {
      const defaultData = this.translations[this.defaultLanguageId];
      const requiredFields = ['meta_title', 'meta_keyword', 'schema_markup', 'meta_description'];
      const missingFields = requiredFields.filter(
        (f) => !defaultData?.[f] || String(defaultData[f]).trim() === ''
      );
      if (missingFields.length > 0) {
        this.showError(__('please_fill_default_language_required_fields') || 'Please fill SEO fields in default language');
        this.$nextTick(() => this.switchToDefaultLanguageTab());
        return false;
      }

      const form = this.$refs['my-form'];
      if (form && !form.reportValidity()) {
        this.$nextTick(() => this.switchToDefaultLanguageTab());
        return false;
      }
      return true;
    },

    switchToDefaultLanguageTab() {
      const index = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
      if (index !== -1) this.activeLanguageTab = index;
    },

    dropFile(event) {
      event.preventDefault();

      const ref = this.$refs.file_image_default;
      const input = Array.isArray(ref) ? ref[0] : ref;

      if (!input) return;

      input.files = event.dataTransfer.files;
      this.handleFileUpload();
    },


    handleFileUpload() {
      const ref = this.$refs.file_image_default;
      const input = Array.isArray(ref) ? ref[0] : ref;

      if (!input || !input.files || !input.files.length) return;

      const file = input.files[0];
      this.error = null;

      const validTypes = [
        "image/jpeg", "image/png", "image/jpg",
        "image/gif", "image/webp", "image/svg+xml"
      ];

      if (!validTypes.includes(file.type)) {
        this.error = "Invalid image type.";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        this.error = "File size exceeds 2MB.";
        return;
      }

      this.og_image = file;
      this.og_image_url = URL.createObjectURL(file);
    },


    fetchLanguages() {
      return axios.get(this.$apiUrl + '/active_languages')
        .then(res => {
          this.languages = res.data.data || [];


          const obj = {};
          this.languages.forEach(l => {
            obj[l.id] = {
              meta_title: '',
              meta_keyword: '',
              schema_markup: '',
              meta_description: ''
            };
          });

          this.translations = obj;

          this.defaultLanguageId =
            this.languages.find(l => l.is_default)?.id || null;
        });
    }
    ,

    initTranslations() {
      const obj = {};
      this.languages.forEach(l => {
        obj[l.id] = {
          meta_title: '',
          meta_keyword: '',
          schema_markup: '',
          meta_description: ''
        };
      });
      this.translations = obj;
    },

    loadSeoTranslations() {
      if (!this.record) return;

      const updatedTranslations = { ...this.translations };

      if (Array.isArray(this.record.translations)) {
        this.record.translations.forEach(t => {
          updatedTranslations[t.language_id] = {
            meta_title: t.meta_title || '',
            meta_keyword: t.meta_keyword || '',
            schema_markup: t.schema_markup || '',
            meta_description: t.meta_description || ''
          };
        });
      }


      this.languages.forEach(language => {
        const langId = language.id;
        const tr = updatedTranslations[langId];

        const isEmpty =
          !tr ||
          (!tr.meta_title &&
            !tr.meta_keyword &&
            !tr.schema_markup &&
            !tr.meta_description);

        if (language.is_default && isEmpty) {
          updatedTranslations[langId] = {
            meta_title: this.record.meta_title || '',
            meta_keyword: this.record.meta_keyword || '',
            schema_markup: this.record.schema_markup || '',
            meta_description: this.record.meta_description || ''
          };
        }
      });


      this.translations = updatedTranslations;
    },

    async saveRecord() {
      if (!this.validateDefaultLanguageForTranslation()) return;
      // OG image required when creating new SEO setting
      if (!this.id && !this.og_image) {
        this.showError(__('please_upload_og_image') || 'Please upload OG image');
        this.$nextTick(() => this.switchToDefaultLanguageTab());
        return;
      }
      this.isLoading = true;
      let seoId = this.id;

      try {
        const langs = [
          ...this.languages.filter(l => l.is_default),
          ...this.languages.filter(l => !l.is_default)
        ];

        for (const lang of langs) {
          const fd = new FormData();

          if (seoId) fd.append('id', seoId);

          fd.append('language_id', lang.id);
          fd.append('page_type', this.page_type);

          Object.entries(this.translations[lang.id] || {})
            .forEach(([k, v]) => fd.append(k, v || ''));

          if (lang.is_default && this.og_image) {
            fd.append('og_image', this.og_image);
          }

          const url = this.$apiUrl +
            (seoId ? '/seo_settings/update' : '/seo_settings/save');

          const res = await axios.post(url, fd);

          if (res?.data?.status === 0) {
            this.showError(res.data.message || __('something_went_wrong'));
            this.$nextTick(() => this.switchToDefaultLanguageTab());
            return;
          }

          if (!seoId && res?.data?.data?.id) {
            seoId = res.data.data.id;
          }
        }

        this.$eventBus.$emit('SeoSettingSaved', __('seo_setting_saved_successfully'));
        this.hideModal();

      } catch (e) {
        console.error(e);
        const msg = e?.response?.data?.message || __('something_went_wrong');
        this.showError ? this.showError(msg) : alert(msg);
      } finally {
        this.isLoading = false;
      }
    }

  },


  mounted() {
    this.showModal();
    this.fetchLanguages()
      .then(() => {
        this.initTranslations();
        this.loadSeoTranslations();
      });
  }

};
</script>

<style scoped>
.image_preview {
  margin-top: 5px;
}
</style>
