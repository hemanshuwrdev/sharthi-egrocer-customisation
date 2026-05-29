<template>
  <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" size="lg" scrollable no-close-on-backdrop
    no-fade static>
    <div slot="modal-footer">
      <b-button variant="primary" @click="$refs['dummy_submit'].click()"
        :disabled="isLoading || (discount_type === 'amount' && Number(this.minimum_order_amount) < Number(this.discount))">
        {{ __('save') }}
        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
      </b-button>
      <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
    </div>
    <form ref="my-form" @submit.prevent="saveRecord">

      <div v-if="discount_type === 'amount' && Number(this.minimum_order_amount) < Number(this.discount)"
        class="alert alert-light-danger color-danger alert-dismissible fade show" role="alert">
        <strong><i class="bi bi-exclamation-triangle"></i> {{ __('error') }}</strong>
        {{ __('discount_is_grater_than_minimun_order_amount') }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>


      <!-- Language Tabs: Show all fields in default language, only message in others -->
      <div class="col-md-12 mb-3" v-if="languages.length > 0">
        <b-tabs v-model="activeLanguageTab" content-class="mt-3">
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

            </div>
            <!-- Translate buttons END -->

            <div class="row">

              <!-- Translatable Field: Message (shown in all language tabs) -->
              <div class="form-group col-md-6 mt-0">
                <label> {{ __('message') }} <i class="text-danger" v-if="language.is_default">*</i></label>
                <input type="text" class="form-control" :required="language.is_default == 1 ? true : undefined"
                  v-model="translations[language.id].message" :placeholder="__('message', { language: language.name })" />
              </div>

              <!-- Non-translatable Fields (only shown in default language tab) -->
              <template v-if="language.is_default">
                <div class="form-group col-md-6">
                  <label> {{ __('promo_code') }}<i class="text-danger">*</i></label>
                  <input type="text" class="form-control" v-model="promo_code" :placeholder="__('promo_code')" />
                </div>

                <div class="form-group col-md-6">
                  <label>{{ __('start_date') }}<i class="text-danger">*</i></label>
                  <input type="date" class="form-control" v-model="start_date" :placeholder="__('start_date')"
                    @input="validateStartDate" />
                  <span v-if="validationStartDateError" class="error">{{ validationStartDateError }}</span>
                </div>
                <div class="form-group col-md-6">
                  <label> {{ __('end_date') }}<i class="text-danger">*</i></label>
                  <input type="date" class="form-control" v-model="end_date" :placeholder="__('end_date')"
                    @input="validateEndDate" />
                  <span v-if="validationEndDateError" class="error">{{ validationEndDateError }}</span>
                </div>

                <div class="form-group col-md-6">
                  <label>{{ __('no_of_users') }}<i class="text-danger">*</i></label>
                  <input type="number" step="1" class="form-control" v-model="no_of_users"
                    :placeholder="__('no_of_users')" @input="validateNoOfUsers" />
                  <span v-if="validationNoOfUsersError" class="error">{{ validationNoOfUsersError }}</span>
                </div>
                <div class="form-group col-md-6">
                  <label>{{ __('minimum_order_amount') }}<i class="text-danger">*</i></label>
                  <input type="number" min="0" step="0.01" class="form-control" v-model="minimum_order_amount"
                    :placeholder="__('minimum_order_amount')" />
                </div>

                <div class="form-group col-md-6">
                  <label> {{ __('discount_type') }}<i class="text-danger">*</i></label>
                  <select class="form-control form-select" v-model="discount_type">
                    <option value="">{{ __('select_discount_type') }}</option>
                    <option value="percentage"> {{ __('percentage') }}</option>
                    <option value="amount"> {{ __('amount') }}</option>
                  </select>
                </div>

                <div class="form-group col-md-6" v-if="discount_type != ''">
                  <label> {{ __('discount') }}<i class="text-danger">*</i></label>
                  <input type="number" required min="0.01" max="100" step="0.01" class="form-control"
                    v-if="discount_type == 'percentage'" v-model="discount" :placeholder="__('discount_percentage')"
                    @input="validateDiscountPercentage" />
                  <input type="number" required min="0" step="0.01" class="form-control"
                    v-if="discount_type == 'amount'" v-model="discount" :placeholder="__('discount_amount')" />
                  <p v-if="discountPercentagevalidationError" class="error">{{ discountPercentagevalidationError }}</p>
                </div>

                <div class="form-group col-md-6" v-if="discount_type == 'percentage'">
                  <label> {{ __('max_discount_amount') }}<i class="text-danger">*</i></label>
                  <input type="number" class="form-control" v-model="max_discount_amount"
                    :placeholder="__('max_discount_amount')" @input="validateMaxDiscountAmount" />
                  <span v-if="validationMaxDiscountAmountError" class="error">{{ validationMaxDiscountAmountError
                  }}</span>
                </div>
                <div class="form-group col-md-6">
                  <label> {{ __('repeat_usage') }}<i class="text-danger">*</i></label>
                  <select class="form-control form-select" v-model="repeat_usage">
                    <option value=""> {{ __('select') }}</option>
                    <option value="1">{{ __('allowed') }}</option>
                    <option value="0">{{ __('not_allowed') }}</option>
                  </select>
                </div>

                <div class="form-group col-md-6" v-if="repeat_usage === 1 || repeat_usage === '1'">
                  <label> {{ __('no_of_repeat_usage') }}<i class="text-danger">*</i></label>
                  <input type="number" min="0" step="1" class="form-control" required v-model="no_of_repeat_usage"
                    :placeholder="__('no_of_repeat_usage')" />
                  <span class="text text-primary font-size-13">{{ __('set_0_if_you_want_ro_remove_limit') }}</span>
                </div>
                <div class="form-group">
                  <label>{{ __('image') }}</label>
                  <p class="text-muted">{{
                    __('please_choose_square_image_of_larger_than_350px_350px_and_smaller_than_550px_550px') }}</p>
                  <span v-if="error" class="error">{{ error }}</span>
                  <input type="file" accept="image/*" name="image" v-on:change="handleFileUpload" ref="file_image"
                    class="file-input">
                  <div class="file-input-div bg-gray-100" @click="triggerRefClick('file_image')" @drop="dropFile"
                    @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                    <template v-if="image && image.name !== ''">
                      <label>{{ __('selected_file_name') }} {{ image.name }}</label>
                    </template>
                    <template v-else>
                      <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                      <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                    </template>
                  </div>
                  <div class="row" v-if="image_url">
                    <div class="col-md-4">
                      <img class="custom-image" :src="image_url" title='Promo code image' alt='Promo code image' />
                    </div>
                  </div>
                </div>
                <div class="form-group col-md-12" v-if="id">
                  <label>{{ __('status') }}</label>
                  <div class="col-md-9 text-left mt-1">
                    <b-form-radio-group v-model="status" :options="[
                      { text: ' Deactivated', 'value': 0 },
                      { text: ' Activated', 'value': 1 },
                    ]" buttons button-variant="outline-primary" required></b-form-radio-group>
                  </div>
                </div>
              </template>
            </div>
          </b-tab>
        </b-tabs>
      </div>

      <!-- Loading state for languages -->
      <div v-else-if="isLoadingLanguages" class="text-center p-3 mb-3">
        <b-spinner label="Loading languages..."></b-spinner>
      </div>
      <button ref="dummy_submit" style="display:none;"></button>
    </form>
  </b-modal>
</template>

<script>
import axios from "axios";
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
  mixins: [TranslationHelper],
  props: ["record"],
  data: function () {
    return {
      isLoading: false,
      isLoadingLanguages: false,
      id: this.record ? this.record.id : "",
      promo_code: this.record ? this.record.promo_code : "",
      message: this.record ? this.record.message : "",
      start_date: this.record ? this.record.start_date : "",
      end_date: this.record ? this.record.end_date : "",
      no_of_users: this.record ? this.record.no_of_users : "",
      minimum_order_amount: this.record ? this.record.minimum_order_amount : "",
      discount_type: (this.record && this.record.length !== 0) ? this.record.discount_type : "",
      discount: this.record ? this.record.discount : "",
      max_discount_amount: this.record ? this.record.max_discount_amount : "",
      repeat_usage: this.record ? this.record.repeat_usage : "",
      no_of_repeat_usage: this.record ? this.record.no_of_repeat_usage : 0,
      status: this.record ? this.record.status : 1,
      image: this.record ? this.record.image_url : "",
      image_url: this.record ? this.record.image_url : "",
      validationEndDateError: null,
      validationStartDateError: null,
      validationNoOfUsersError: null,
      validationMaxDiscountAmountError: null,
      error: null,
      discountPercentagevalidationError: null,
      // Multi-language support
      activeLanguageTab: 0,
      translations: {},
      defaultLanguageId: null,
      languages: [],

      // Translate buttons
      translatableFields: ['message'],
      loadingEmpty: false,
      loadingOverwrite: false,
    };
  },
  computed: {
    modal_title: function () {
      let title = this.id ? __('edit') : __('add');
      title += ' ';
      title += __('promo_code');
      return title;
    },
    isInvalidDiscount() {
      return this.discount_type === 'amount' && this.minimum_order_amount < this.discount;
    }


  },
  methods: {
    showModal() {
      this.$refs["my-modal"].show();
      this.fetchActiveLanguages().then(() => {
        if (this.id) {
          this.loadTranslations();
        }
      });
    },
    hideModal() {
      this.$refs["my-modal"].hide();
    },
    fetchActiveLanguages() {
      this.isLoadingLanguages = true;
      return axios.get(this.$apiUrl + '/active_languages')
        .then(response => {
          if (response.data.data) {
            this.languages = response.data.data;
            const defaultLang = this.languages.find(lang => lang.is_default === 1);
            if (defaultLang) {
              this.defaultLanguageId = defaultLang.id;
            }
            this.initializeTranslations();
            this.isLoadingLanguages = false;
          } else {
            this.isLoadingLanguages = false;
          }
        })
        .catch(error => {
          console.error('Error loading languages:', error);
          this.isLoadingLanguages = false;
        });
    },
    initializeTranslations() {
      const allTranslations = {};
      this.languages.forEach(language => {
        allTranslations[language.id] = {
          message: ''
        };
      });
      this.translations = allTranslations;

      // If editing and we have a message, set it for default language
      if (this.id && this.message && this.defaultLanguageId) {
        this.$set(this.translations[this.defaultLanguageId], 'message', this.message);
      }
    },
    loadTranslations() {
      if (!this.id) return;

      // Wait for languages to be loaded first
      if (this.languages.length === 0) {
        this.fetchActiveLanguages().then(() => {
          this.loadTranslationsData();
        });
        return;
      }

      this.loadTranslationsData();
    },
    loadTranslationsData() {
      // Method 1: Check for all_active_language_translations (from getAllActiveLanguageTranslations)
      if (this.record && this.record.all_active_language_translations) {
        const translationsData = this.record.all_active_language_translations;

        this.languages.forEach(language => {
          if (translationsData[language.id]) {
            this.$set(this.translations[language.id], 'message', translationsData[language.id].message || '');
          }
        });
        return;
      }

      // Method 2: Check for translations array directly
      if (this.record && this.record.translations && Array.isArray(this.record.translations)) {
        const translationsArray = this.record.translations;

        this.languages.forEach(language => {
          const translation = translationsArray.find(t => t.language_id === language.id);
          if (translation && translation.message) {
            this.$set(this.translations[language.id], 'message', translation.message);
          }
        });
        return;
      }

      // Method 3: Fallback to main table message for default language
      if (this.message && this.defaultLanguageId) {
        this.$set(this.translations[this.defaultLanguageId], 'message', this.message);
      }
    },
    triggerRefClick(refName) {
      // Use $nextTick to ensure refs are available after Vue updates DOM
      this.$nextTick(() => {
        try {
          const ref = this.$refs[refName];

          // If ref doesn't exist, exit silently
          if (!ref) {
            return;
          }

          // Handle array case (refs inside v-for)
          if (Array.isArray(ref)) {
            // Find first valid element in array
            for (let i = 0; i < ref.length; i++) {
              if (ref[i] && typeof ref[i].click === 'function') {
                ref[i].click();
                return;
              }
            }
            return;
          }

          // Handle single ref case
          if (typeof ref.click === 'function') {
            ref.click();
          }
        } catch (e) {
          // Keep silent; upload input is a best-effort UX helper.
          console.warn('Error triggering file input click:', e);
        }
      });
    },
    dropFile(event) {
      event.preventDefault();
      // Safely access file_image ref (can be array in v-for)
      const fileInput = Array.isArray(this.$refs.file_image)
        ? this.$refs.file_image[0]
        : this.$refs.file_image;

      if (fileInput) {
        fileInput.files = event.dataTransfer.files;
        this.handleFileUpload(); // Trigger the onChange event manually
      }
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleFileUpload() {
      // Safely access file_image ref (can be array in v-for)
      const fileInput = Array.isArray(this.$refs.file_image)
        ? this.$refs.file_image[0]
        : this.$refs.file_image;

      if (!fileInput) return;

      const file = fileInput.files[0];

      // Reset previous error message
      this.error = null;

      // Check if a file was selected
      if (!file) return;

      // Perform image validation
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        this.error = "Invalid file type. Please upload a JPEG, PNG, JPG,  GIF or WEBP image.";
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.error = "File size exceeds the maximum allowed limit (2MB).";
        return;
      }

      // Create a URL for the uploaded image and display it
      this.imageUrl = URL.createObjectURL(file);
      this.image = fileInput.files[0];
      this.image_url = URL.createObjectURL(this.image);
    },
    validateStartDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      this.currentDate = `${year}-${month}-${day}`;

      console.log(this.start_date + ' ' + this.currentDate);

      const startDate = new Date(this.start_date);
      const currentDate = new Date(this.currentDate);
      const endDate = new Date(this.end_date);

      if (startDate < currentDate || startDate > endDate) {
        this.validationStartDateError = "Start date cannot be a past date or after the end date.";
        this.start_date = "";
      } else {
        this.validationStartDateError = null;
      }
    },
    validateEndDate() {
      if (this.end_date < this.start_date) {
        this.validationEndDateError = "End Date must be equal or greater than Start Date.";
        this.end_date = "";
      } else {
        this.validationEndDateError = null;
      }
    },
    validateNoOfUsers() {
      if (this.no_of_users < 1) {
        this.validationNoOfUsersError = "No of Users must be integer value.";
        this.no_of_users = "";
      } else {
        this.validationNoOfUsersError = null;
      }
    },
    validateMaxDiscountAmount() {
      if (this.max_discount_amount < 1) {
        this.validationMaxDiscountAmountError = "Max Discount Amount must be integer value.";
        this.max_discount_amount = "";
      } else {
        this.validationMaxDiscountAmountError = null;
      }
    },
    validateDiscountPercentage() {
      if (this.discount < 1 || this.discount > 100) {
        this.discountPercentagevalidationError = "Discount must be between 1 and 100.";
        this.discount = null;
      } else {
        this.discountPercentagevalidationError = null;
      }
    },
    saveRecord: function () {
      // Validate default language message
      if (!this.validateDefaultLanguage()) {
        return;
      }

      let vm = this;
      this.isLoading = true;
      let formData = new FormData();
      if (this.id) {
        formData.append("id", this.id);
      }
      const defaultLang = this.languages.find(lang => lang.is_default === 1);
      if (!defaultLang) {
        vm.showError(__('default_language_not_found'));
        vm.isLoading = false;
        return;
      }

      const defaultTranslation = this.translations[defaultLang.id];

      formData.append("promo_code", this.promo_code);
      // Use default language message for main table
      formData.append("message", defaultTranslation.message || '');
      formData.append("start_date", this.start_date);
      formData.append("end_date", this.end_date);
      formData.append("no_of_users", this.no_of_users);
      formData.append("minimum_order_amount", this.minimum_order_amount);
      formData.append("discount", this.discount);
      formData.append("discount_type", this.discount_type);
      formData.append("max_discount_amount", this.max_discount_amount);
      formData.append("repeat_usage", this.repeat_usage);
      formData.append("no_of_repeat_usage", this.no_of_repeat_usage);
      formData.append("status", this.status);
      formData.append("image", this.image);

      const allTranslations = [];

      this.languages.forEach(language => {
        const translation = this.translations[language.id];
        allTranslations.push({
          language_id: language.id,
          message: (translation && translation.message) ? translation.message : ''
        });
      });

      formData.append("translations", JSON.stringify(allTranslations));

      let url = this.$apiUrl + "/promo_code/save";
      if (this.id) {
        url = this.$apiUrl + "/promo_code/update";
      }

      axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          let data = res.data;

          if (data.status === 1) {

            this.$eventBus.$emit("PromoCodeSaved", data.message);
            vm.$router.push({ path: '/promo_code' });
            this.hideModal();

          } else {
            vm.showError(data.message);
            vm.isLoading = false;
          }
        }).catch((error) => {
          vm.isLoading = false;
          if (error.request.statusText) {
            this.showError(error.request.statusText);
          } else if (error.message) {
            this.showError(error.message);
          } else {
            this.showError(__('something_went_wrong'));
          }
        });
    },
    validateDefaultLanguage() {
      if (!this.defaultLanguageId) {
        this.showError(__('default_language_not_found'));
        return false;
      }

      const defaultTranslation = this.translations[this.defaultLanguageId];

      if (!defaultTranslation || !defaultTranslation.message || defaultTranslation.message.trim() === '') {
        this.showError(__('please_fill_message_in_default_language'));
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
      const defaultLangIndex = this.languages.findIndex(lang => lang.id === this.defaultLanguageId);
      if (defaultLangIndex !== -1) {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLanguageTab = defaultLangIndex;
      }
    },

  },
  mounted() {
    this.showModal();
  },
};
</script>

<style scoped></style>
