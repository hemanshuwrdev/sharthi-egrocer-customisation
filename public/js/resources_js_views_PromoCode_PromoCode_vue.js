"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_PromoCode_PromoCode_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/Edit.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/Edit.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_1__["default"]],
  props: ["record"],
  data: function data() {
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
      discount_type: this.record && this.record.length !== 0 ? this.record.discount_type : "",
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
      loadingOverwrite: false
    };
  },
  computed: {
    modal_title: function modal_title() {
      var title = this.id ? __('edit') : __('add');
      title += ' ';
      title += __('promo_code');
      return title;
    },
    isInvalidDiscount: function isInvalidDiscount() {
      return this.discount_type === 'amount' && this.minimum_order_amount < this.discount;
    }
  },
  methods: {
    showModal: function showModal() {
      var _this = this;
      this.$refs["my-modal"].show();
      this.fetchActiveLanguages().then(function () {
        if (_this.id) {
          _this.loadTranslations();
        }
      });
    },
    hideModal: function hideModal() {
      this.$refs["my-modal"].hide();
    },
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this2 = this;
      this.isLoadingLanguages = true;
      return axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/active_languages').then(function (response) {
        if (response.data.data) {
          _this2.languages = response.data.data;
          var defaultLang = _this2.languages.find(function (lang) {
            return lang.is_default === 1;
          });
          if (defaultLang) {
            _this2.defaultLanguageId = defaultLang.id;
          }
          _this2.initializeTranslations();
          _this2.isLoadingLanguages = false;
        } else {
          _this2.isLoadingLanguages = false;
        }
      })["catch"](function (error) {
        console.error('Error loading languages:', error);
        _this2.isLoadingLanguages = false;
      });
    },
    initializeTranslations: function initializeTranslations() {
      var allTranslations = {};
      this.languages.forEach(function (language) {
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
    loadTranslations: function loadTranslations() {
      var _this3 = this;
      if (!this.id) return;

      // Wait for languages to be loaded first
      if (this.languages.length === 0) {
        this.fetchActiveLanguages().then(function () {
          _this3.loadTranslationsData();
        });
        return;
      }
      this.loadTranslationsData();
    },
    loadTranslationsData: function loadTranslationsData() {
      var _this4 = this;
      // Method 1: Check for all_active_language_translations (from getAllActiveLanguageTranslations)
      if (this.record && this.record.all_active_language_translations) {
        var translationsData = this.record.all_active_language_translations;
        this.languages.forEach(function (language) {
          if (translationsData[language.id]) {
            _this4.$set(_this4.translations[language.id], 'message', translationsData[language.id].message || '');
          }
        });
        return;
      }

      // Method 2: Check for translations array directly
      if (this.record && this.record.translations && Array.isArray(this.record.translations)) {
        var translationsArray = this.record.translations;
        this.languages.forEach(function (language) {
          var translation = translationsArray.find(function (t) {
            return t.language_id === language.id;
          });
          if (translation && translation.message) {
            _this4.$set(_this4.translations[language.id], 'message', translation.message);
          }
        });
        return;
      }

      // Method 3: Fallback to main table message for default language
      if (this.message && this.defaultLanguageId) {
        this.$set(this.translations[this.defaultLanguageId], 'message', this.message);
      }
    },
    triggerRefClick: function triggerRefClick(refName) {
      var _this5 = this;
      // Use $nextTick to ensure refs are available after Vue updates DOM
      this.$nextTick(function () {
        try {
          var ref = _this5.$refs[refName];

          // If ref doesn't exist, exit silently
          if (!ref) {
            return;
          }

          // Handle array case (refs inside v-for)
          if (Array.isArray(ref)) {
            // Find first valid element in array
            for (var i = 0; i < ref.length; i++) {
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
    dropFile: function dropFile(event) {
      event.preventDefault();
      // Safely access file_image ref (can be array in v-for)
      var fileInput = Array.isArray(this.$refs.file_image) ? this.$refs.file_image[0] : this.$refs.file_image;
      if (fileInput) {
        fileInput.files = event.dataTransfer.files;
        this.handleFileUpload(); // Trigger the onChange event manually
      }
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleFileUpload: function handleFileUpload() {
      // Safely access file_image ref (can be array in v-for)
      var fileInput = Array.isArray(this.$refs.file_image) ? this.$refs.file_image[0] : this.$refs.file_image;
      if (!fileInput) return;
      var file = fileInput.files[0];

      // Reset previous error message
      this.error = null;

      // Check if a file was selected
      if (!file) return;

      // Perform image validation
      var validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        this.error = "Invalid file type. Please upload a JPEG, PNG, JPG,  GIF or WEBP image.";
        return;
      }
      var maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.error = "File size exceeds the maximum allowed limit (2MB).";
        return;
      }

      // Create a URL for the uploaded image and display it
      this.imageUrl = URL.createObjectURL(file);
      this.image = fileInput.files[0];
      this.image_url = URL.createObjectURL(this.image);
    },
    validateStartDate: function validateStartDate() {
      var today = new Date();
      var year = today.getFullYear();
      var month = String(today.getMonth() + 1).padStart(2, '0');
      var day = String(today.getDate()).padStart(2, '0');
      this.currentDate = "".concat(year, "-").concat(month, "-").concat(day);
      console.log(this.start_date + ' ' + this.currentDate);
      var startDate = new Date(this.start_date);
      var currentDate = new Date(this.currentDate);
      var endDate = new Date(this.end_date);
      if (startDate < currentDate || startDate > endDate) {
        this.validationStartDateError = "Start date cannot be a past date or after the end date.";
        this.start_date = "";
      } else {
        this.validationStartDateError = null;
      }
    },
    validateEndDate: function validateEndDate() {
      if (this.end_date < this.start_date) {
        this.validationEndDateError = "End Date must be equal or greater than Start Date.";
        this.end_date = "";
      } else {
        this.validationEndDateError = null;
      }
    },
    validateNoOfUsers: function validateNoOfUsers() {
      if (this.no_of_users < 1) {
        this.validationNoOfUsersError = "No of Users must be integer value.";
        this.no_of_users = "";
      } else {
        this.validationNoOfUsersError = null;
      }
    },
    validateMaxDiscountAmount: function validateMaxDiscountAmount() {
      if (this.max_discount_amount < 1) {
        this.validationMaxDiscountAmountError = "Max Discount Amount must be integer value.";
        this.max_discount_amount = "";
      } else {
        this.validationMaxDiscountAmountError = null;
      }
    },
    validateDiscountPercentage: function validateDiscountPercentage() {
      if (this.discount < 1 || this.discount > 100) {
        this.discountPercentagevalidationError = "Discount must be between 1 and 100.";
        this.discount = null;
      } else {
        this.discountPercentagevalidationError = null;
      }
    },
    saveRecord: function saveRecord() {
      var _this6 = this;
      // Validate default language message
      if (!this.validateDefaultLanguage()) {
        return;
      }
      var vm = this;
      this.isLoading = true;
      var formData = new FormData();
      if (this.id) {
        formData.append("id", this.id);
      }
      var defaultLang = this.languages.find(function (lang) {
        return lang.is_default === 1;
      });
      if (!defaultLang) {
        vm.showError(__('default_language_not_found'));
        vm.isLoading = false;
        return;
      }
      var defaultTranslation = this.translations[defaultLang.id];
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
      var allTranslations = [];
      this.languages.forEach(function (language) {
        var translation = _this6.translations[language.id];
        allTranslations.push({
          language_id: language.id,
          message: translation && translation.message ? translation.message : ''
        });
      });
      formData.append("translations", JSON.stringify(allTranslations));
      var url = this.$apiUrl + "/promo_code/save";
      if (this.id) {
        url = this.$apiUrl + "/promo_code/update";
      }
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(function (res) {
        var data = res.data;
        if (data.status === 1) {
          _this6.$eventBus.$emit("PromoCodeSaved", data.message);
          vm.$router.push({
            path: '/promo_code'
          });
          _this6.hideModal();
        } else {
          vm.showError(data.message);
          vm.isLoading = false;
        }
      })["catch"](function (error) {
        vm.isLoading = false;
        if (error.request.statusText) {
          _this6.showError(error.request.statusText);
        } else if (error.message) {
          _this6.showError(error.message);
        } else {
          _this6.showError(__('something_went_wrong'));
        }
      });
    },
    validateDefaultLanguage: function validateDefaultLanguage() {
      if (!this.defaultLanguageId) {
        this.showError(__('default_language_not_found'));
        return false;
      }
      var defaultTranslation = this.translations[this.defaultLanguageId];
      if (!defaultTranslation || !defaultTranslation.message || defaultTranslation.message.trim() === '') {
        this.showError(__('please_fill_message_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      return true;
    },
    validateDefaultLanguageForTranslation: function validateDefaultLanguageForTranslation() {
      var _this7 = this;
      var form = this.$refs['my-form'];
      if (form && !form.reportValidity()) {
        this.$nextTick(function () {
          return _this7.switchToDefaultLanguageTab();
        });
        return false;
      }
      return this.validateDefaultLanguage();
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this8 = this;
      var defaultLangIndex = this.languages.findIndex(function (lang) {
        return lang.id === _this8.defaultLanguageId;
      });
      if (defaultLangIndex !== -1) {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLanguageTab = defaultLangIndex;
      }
    }
  },
  mounted: function mounted() {
    this.showModal();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/PromoCode.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/PromoCode.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datatable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datatable */ "./node_modules/vuejs-datatable/dist/vuejs-datatable.esm.js");
/* harmony import */ var _Edit_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue */ "./resources/js/views/PromoCode/Edit.vue");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    VuejsDatatableFactory: vuejs_datatable__WEBPACK_IMPORTED_MODULE_0__.VuejsDatatableFactory,
    "app-edit-record": _Edit_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      fields: [{
        key: "id",
        label: __("id"),
        sortable: true,
        headAttr: {
          width: '80px',
          textAlign: 'center'
        },
        sortDirection: "desc"
      }, {
        key: "promo_code",
        label: __('promo_code'),
        sortable: true,
        "class": "text-center"
      }, {
        key: "message",
        label: __('message'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "start_date",
        label: __('start_date'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "end_date",
        label: __('end_date'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "no_of_users",
        label: __('no_of_users'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "minimum_order_amount",
        label: __('minimum_order_amount'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "discount",
        label: __('discount'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "discount_type",
        label: __('discount_type'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: 'image',
        label: __('image'),
        "class": 'text-center'
      }, {
        key: "status",
        label: __('status'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "validity",
        label: __('validity'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "actions",
        label: __('actions')
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      page: 1,
      promocode: [],
      isLoading: false,
      sectionStyle: "style_1",
      max_visible_promocode: 12,
      max_col_in_single_row: 12,
      create_new: false,
      edit_record: null,
      // Language handling for translations
      currentLanguageId: null,
      activeLanguages: []
    };
  },
  computed: {
    sortOptions: function sortOptions() {
      // Create an options list from our fields
      return this.fields.filter(function (f) {
        return f.sortable;
      }).map(function (f) {
        return {
          text: f.label,
          value: f.key
        };
      });
    }
  },
  mounted: function mounted() {
    // Set the initial number of items
    this.totalRows = this.promocode.length;
  },
  watch: {
    $route: function $route(to, from) {
      this.showCreateModal();
    },
    filter: function filter() {
      this.getPromoCode();
    }
  },
  created: function created() {
    var _this = this;
    this.showCreateModal();
    this.$eventBus.$on("PromoCodeSaved", function (message) {
      _this.showMessage("success", message);
      _this.getPromoCode();
    });
    // Load languages first so we know currentLanguageId before mapping translations
    this.fetchActiveLanguages().then(function () {
      _this.getPromoCode();
    })["catch"](function () {
      _this.getPromoCode();
    });
  },
  methods: {
    // Fetch active languages and set current language ID
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this2 = this;
      return axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + '/active_languages').then(function (response) {
        if (response.data.data && Array.isArray(response.data.data)) {
          _this2.activeLanguages = response.data.data;
          var appLocale = window.appLocale || 'en';
          var currentLanguage = _this2.activeLanguages.find(function (lang) {
            return lang.code === appLocale;
          });
          if (currentLanguage) {
            _this2.currentLanguageId = currentLanguage.id;
          } else {
            var defaultLanguage = _this2.activeLanguages.find(function (lang) {
              return lang.is_default === 1;
            });
            if (defaultLanguage) {
              _this2.currentLanguageId = defaultLanguage.id;
            }
          }
        }
      })["catch"](function (error) {
        console.error('Error loading languages:', error);
      });
    },
    // Get translated message with fallback logic
    getTranslatedMessage: function getTranslatedMessage(promoCode) {
      var _this3 = this;
      // If no language is set yet, return the base message
      if (!this.currentLanguageId || !this.activeLanguages.length) {
        return promoCode.message || '';
      }

      // Get default language ID for fallback
      var defaultLanguage = this.activeLanguages.find(function (lang) {
        return lang.is_default === 1;
      });
      var defaultLanguageId = defaultLanguage ? defaultLanguage.id : null;

      // Check if translations array exists
      if (promoCode.translations && Array.isArray(promoCode.translations) && promoCode.translations.length > 0) {
        // First try to find translation for current language
        var translation = promoCode.translations.find(function (t) {
          return t.language_id === _this3.currentLanguageId;
        });

        // If not found, try default language
        if (!translation && defaultLanguageId) {
          translation = promoCode.translations.find(function (t) {
            return t.language_id === defaultLanguageId;
          });
        }

        // Use translation message if available and not empty
        if (translation && translation.message && translation.message.trim() !== '') {
          return translation.message;
        }
      }

      // Fallback to base message
      return promoCode.message || '';
    },
    getPromoCode: function getPromoCode() {
      var _this4 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + "/promo_code?search=" + (this.filter || "")).then(function (response) {
        _this4.isLoading = false;
        var data = response.data;
        // Ensure promo codes have proper structure with translations
        _this4.promocode = (data.data || []).map(function (code) {
          // Ensure translations array exists
          if (!code.translations) {
            code.translations = [];
          }
          return code;
        });
        _this4.totalRows = _this4.promocode.length;
      });
    },
    deleteSlider: function deleteSlider(index, id) {
      var _this5 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_be_able_to_revert_this'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#37a279",
        cancelButtonColor: "#d33"
      }).then(function (result) {
        if (result.value) {
          _this5.isLoading = true;
          var postData = {
            id: id
          };
          axios__WEBPACK_IMPORTED_MODULE_2___default().post(_this5.$apiUrl + "/promo_code/delete", postData).then(function (response) {
            _this5.isLoading = false;
            var data = response.data;
            _this5.promocode.splice(index, 1);
            //this.showSuccess(data.message);
            _this5.showMessage("success", data.message);
          });
        }
      });
    },
    showCreateModal: function showCreateModal() {
      var create = this.$route.params.create;
      if (create) {
        this.create_new = true;
      }
    },
    hideModal: function hideModal() {
      this.create_new = false;
      this.edit_record = false;
      this.$router.push({
        path: '/promo_code'
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.$eventBus.$off('PromoCodeSaved');
  }
});

/***/ }),

/***/ "./resources/js/mixins/TranslationHelper.js":
/*!**************************************************!*\
  !*** ./resources/js/mixins/TranslationHelper.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  methods: {
    translateEmpty: function translateEmpty(language) {
      var _this = this;
      this.$root.$emit('bv::hide::tooltip');
      if (typeof this.validateDefaultLanguageForTranslation === "function") {
        if (!this.validateDefaultLanguageForTranslation()) return;
      }
      if (this.hasOwnProperty("loadingEmpty")) {
        this.loadingEmpty = true;
      } else {
        this.isTranslating = true;
      }
      var fields = this.translatableFields || [];

      // Check if any field is empty in non-default language tabs
      var hasEmptyFields = this.checkNonDefaultLanguagesHaveEmptyFields(fields);
      if (!hasEmptyFields) {
        // All fields in all non-default languages already have values
        var errorMsg = __("translation_error_all_fields_filled") || "All fields already have values. There is nothing to translate.";
        if (this.hasOwnProperty("loadingEmpty")) {
          this.loadingEmpty = false;
        } else {
          this.isTranslating = false;
        }
        this.showError(errorMsg);
        return;
      }
      this.translateEmptyHelper(language, fields).then(function () {
        _this.showSuccess(__("translation_completed_successfully") || "Translation completed successfully");
      })["catch"](function () {
        // Error handling is done in translateEmptyHelper
      })["finally"](function () {
        if (_this.hasOwnProperty("loadingEmpty")) {
          _this.loadingEmpty = false;
        } else {
          _this.isTranslating = false;
        }
      });
    },
    translateOverwrite: function translateOverwrite(language) {
      var _this2 = this;
      this.$root.$emit('bv::hide::tooltip');
      if (typeof this.validateDefaultLanguageForTranslation === "function") {
        if (!this.validateDefaultLanguageForTranslation()) return;
      }
      if (this.hasOwnProperty("loadingOverwrite")) {
        this.loadingOverwrite = true;
      } else {
        this.isTranslating = true;
      }
      var fields = this.translatableFields || [];
      this.translateOverwriteHelper(language, fields).then(function () {
        _this2.showSuccess(__("translation_overwritten_successfully") || "Translation overwritten successfully");
      })["finally"](function () {
        if (_this2.hasOwnProperty("loadingOverwrite")) {
          _this2.loadingOverwrite = false;
        } else {
          _this2.isTranslating = false;
        }
      });
    },
    getDefaultLanguageData: function getDefaultLanguageData() {
      if (this.translations && this.translations[this.defaultLanguageId]) {
        return this.translations[this.defaultLanguageId];
      } else if (this.form && this.form[this.defaultLanguageId]) {
        return this.form[this.defaultLanguageId];
      }
      return {};
    },
    checkNonDefaultLanguagesHaveEmptyFields: function checkNonDefaultLanguagesHaveEmptyFields() {
      var fieldsToTranslate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      // Determine target object (translations or form)
      var targetObj = null;
      if (this.translations) {
        targetObj = this.translations;
      } else if (this.form) {
        targetObj = this.form;
      }
      if (!targetObj || !this.languages || this.languages.length <= 1) {
        return true; // If no languages or only one language, allow translation
      }
      var fields = fieldsToTranslate.length > 0 ? fieldsToTranslate : this.translatableFields || [];
      if (fields.length === 0) {
        return true; // If no fields to check, allow translation
      }

      // Check if any non-default language has at least one empty field
      var _iterator = _createForOfIteratorHelper(this.languages),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var lang = _step.value;
          if (lang.is_default) continue; // Skip default language

          var langData = targetObj[lang.id];
          if (!langData) {
            return true; // If language data doesn't exist, there are empty fields
          }

          // Check if any field is empty for this language
          var _iterator2 = _createForOfIteratorHelper(fields),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var field = _step2.value;
              var value = langData[field];
              if (value === null || value === undefined || value === "" || typeof value === "string" && value.trim() === "") {
                return true; // Found at least one empty field
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return false; // All fields in all non-default languages have values
    },
    translateEmptyHelper: function translateEmptyHelper(language) {
      var _this3 = this;
      var fieldsToTranslate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var source = this.getDefaultLanguageData();
      if (!source || Object.keys(source).length === 0) {
        var errorMsg = __("default_language_data_missing");
        this.showError(errorMsg);
        return Promise.reject("default_language_data_missing");
      }

      // Determine target object (translations or form)
      var targetObj = null;
      if (this.translations) {
        targetObj = this.translations;
      } else if (this.form) {
        targetObj = this.form;
      }
      var dataToSend = {};
      if (fieldsToTranslate.length > 0) {
        fieldsToTranslate.forEach(function (field) {
          dataToSend[field] = source[field];
        });
      } else {
        Object.keys(source).forEach(function (key) {
          if (_typeof(source[key]) !== "object") {
            dataToSend[key] = source[key];
          }
        });
      }

      // Check if all fields in dataToSend are null or empty
      var allFieldsNull = Object.keys(dataToSend).length > 0 && Object.keys(dataToSend).every(function (field) {
        var value = dataToSend[field];
        return value === null || value === undefined || value === "" || typeof value === "string" && value.trim() === "";
      });
      if (allFieldsNull) {
        var _errorMsg = __("translation_error_all_fields_empty") || "All fields are empty. Please fill at least one field in default language before translating.";
        this.showError(_errorMsg);
        return Promise.reject(new Error(_errorMsg));
      }
      return axios__WEBPACK_IMPORTED_MODULE_0___default().post("/api/languages/translate-empty", {
        target_language: language.code,
        data: dataToSend
      }).then(function (res) {
        if (res.data.status === 0) {
          throw new Error(res.data.message || __("something_went_wrong"));
        }
        var allTranslations = res.data.data;
        _this3.languages.forEach(function (lang) {
          if (lang.is_default) return; // skip default language

          var translated = allTranslations[lang.code];
          if (!translated) return;
          Object.keys(translated).forEach(function (field) {
            if (targetObj && targetObj[lang.id]) {
              if (!targetObj[lang.id][field] || targetObj[lang.id][field] === "") {
                _this3.$set(targetObj[lang.id], field, translated[field]);
              }
            }
          });
        });
        if (typeof _this3.convertTagNamesToIds === "function") {
          _this3.$nextTick(function () {
            _this3.convertTagNamesToIds();
          });
        }
        return res;
      })["catch"](function (error) {
        var msg = error.message;
        if (error.response && error.response.data && error.response.data.message) {
          msg = error.response.data.message;
        }
        var errorMessage = msg || __("something_went_wrong");
        _this3.showError(errorMessage);
        throw error;
      });
    },
    translateOverwriteHelper: function translateOverwriteHelper(language) {
      var _this4 = this;
      var fieldsToTranslate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var source = this.getDefaultLanguageData();
      if (!source || Object.keys(source).length === 0) {
        var errorMsg = __("default_language_data_missing");
        this.showError(errorMsg);
        return Promise.reject("default_language_data_missing");
      }

      // Determine target object (translations or form)
      var targetObj = null;
      if (this.translations) {
        targetObj = this.translations;
      } else if (this.form) {
        targetObj = this.form;
      }
      var dataToSend = {};
      if (fieldsToTranslate.length > 0) {
        fieldsToTranslate.forEach(function (field) {
          dataToSend[field] = source[field];
        });
      } else {
        Object.keys(source).forEach(function (key) {
          if (_typeof(source[key]) !== "object") {
            dataToSend[key] = source[key];
          }
        });
      }

      // Check if all fields in dataToSend are null or empty
      var allFieldsNull = Object.keys(dataToSend).length > 0 && Object.keys(dataToSend).every(function (field) {
        var value = dataToSend[field];
        return value === null || value === undefined || value === "" || typeof value === "string" && value.trim() === "";
      });
      if (allFieldsNull) {
        var _errorMsg2 = __("translation_error_all_fields_empty") || "All fields are empty. Please fill at least one field in default language before translating.";
        this.showError(_errorMsg2);
        return Promise.reject(new Error(_errorMsg2));
      }
      return axios__WEBPACK_IMPORTED_MODULE_0___default().post("/api/languages/translate-overwrite", {
        target_language: language.code,
        data: dataToSend
      }).then(function (res) {
        if (res.data.status === 0) {
          throw new Error(res.data.message || __("something_went_wrong"));
        }
        var allTranslations = res.data.data;
        _this4.languages.forEach(function (lang) {
          if (lang.is_default) return;
          var translated = allTranslations[lang.code];
          if (!translated) return;
          Object.keys(translated).forEach(function (field) {
            if (targetObj && targetObj[lang.id]) {
              _this4.$set(targetObj[lang.id], field, translated[field]);
            }
          });
        });
        if (typeof _this4.convertTagNamesToIds === "function") {
          _this4.$nextTick(function () {
            _this4.convertTagNamesToIds();
          });
        }
        return res;
      })["catch"](function (error) {
        var msg = error.message;
        if (error.response && error.response.data && error.response.data.message) {
          msg = error.response.data.message;
        }
        var errorMessage = msg || __("something_went_wrong");
        _this4.showError(errorMessage);
        throw error;
      })["finally"](function () {
        _this4.isLoading = false;
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/PromoCode/Edit.vue":
/*!***********************************************!*\
  !*** ./resources/js/views/PromoCode/Edit.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue_vue_type_template_id_1a57251c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=1a57251c&scoped=true */ "./resources/js/views/PromoCode/Edit.vue?vue&type=template&id=1a57251c&scoped=true");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js */ "./resources/js/views/PromoCode/Edit.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_1a57251c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Edit_vue_vue_type_template_id_1a57251c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "1a57251c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/PromoCode/Edit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/PromoCode/PromoCode.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/PromoCode/PromoCode.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PromoCode_vue_vue_type_template_id_4be212fa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PromoCode.vue?vue&type=template&id=4be212fa */ "./resources/js/views/PromoCode/PromoCode.vue?vue&type=template&id=4be212fa");
/* harmony import */ var _PromoCode_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PromoCode.vue?vue&type=script&lang=js */ "./resources/js/views/PromoCode/PromoCode.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PromoCode_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _PromoCode_vue_vue_type_template_id_4be212fa__WEBPACK_IMPORTED_MODULE_0__.render,
  _PromoCode_vue_vue_type_template_id_4be212fa__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/PromoCode/PromoCode.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/PromoCode/Edit.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./resources/js/views/PromoCode/Edit.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/Edit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/PromoCode/PromoCode.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/views/PromoCode/PromoCode.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PromoCode_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PromoCode.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/PromoCode.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PromoCode_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/PromoCode/Edit.vue?vue&type=template&id=1a57251c&scoped=true":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/PromoCode/Edit.vue?vue&type=template&id=1a57251c&scoped=true ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_1a57251c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_1a57251c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_1a57251c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=template&id=1a57251c&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/Edit.vue?vue&type=template&id=1a57251c&scoped=true");


/***/ }),

/***/ "./resources/js/views/PromoCode/PromoCode.vue?vue&type=template&id=4be212fa":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/PromoCode/PromoCode.vue?vue&type=template&id=4be212fa ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PromoCode_vue_vue_type_template_id_4be212fa__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PromoCode_vue_vue_type_template_id_4be212fa__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PromoCode_vue_vue_type_template_id_4be212fa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PromoCode.vue?vue&type=template&id=4be212fa */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/PromoCode.vue?vue&type=template&id=4be212fa");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/Edit.vue?vue&type=template&id=1a57251c&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/Edit.vue?vue&type=template&id=1a57251c&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   staticRenderFns: () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "b-modal",
    {
      ref: "my-modal",
      attrs: {
        title: _vm.modal_title,
        size: "lg",
        scrollable: "",
        "no-close-on-backdrop": "",
        "no-fade": "",
        static: "",
      },
      on: {
        hidden: function ($event) {
          return _vm.$emit("modalClose")
        },
      },
    },
    [
      _c(
        "div",
        { attrs: { slot: "modal-footer" }, slot: "modal-footer" },
        [
          _c(
            "b-button",
            {
              attrs: {
                variant: "primary",
                disabled:
                  _vm.isLoading ||
                  (_vm.discount_type === "amount" &&
                    Number(this.minimum_order_amount) < Number(this.discount)),
              },
              on: {
                click: function ($event) {
                  return _vm.$refs["dummy_submit"].click()
                },
              },
            },
            [
              _vm._v("\n      " + _vm._s(_vm.__("save")) + "\n      "),
              _vm.isLoading
                ? _c("b-spinner", { attrs: { small: "", label: "Spinning" } })
                : _vm._e(),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "b-button",
            { attrs: { variant: "secondary" }, on: { click: _vm.hideModal } },
            [_vm._v(_vm._s(_vm.__("cancel")))]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "form",
        {
          ref: "my-form",
          on: {
            submit: function ($event) {
              $event.preventDefault()
              return _vm.saveRecord.apply(null, arguments)
            },
          },
        },
        [
          _vm.discount_type === "amount" &&
          Number(this.minimum_order_amount) < Number(this.discount)
            ? _c(
                "div",
                {
                  staticClass:
                    "alert alert-light-danger color-danger alert-dismissible fade show",
                  attrs: { role: "alert" },
                },
                [
                  _c("strong", [
                    _c("i", { staticClass: "bi bi-exclamation-triangle" }),
                    _vm._v(" " + _vm._s(_vm.__("error"))),
                  ]),
                  _vm._v(
                    "\n      " +
                      _vm._s(
                        _vm.__("discount_is_grater_than_minimun_order_amount")
                      ) +
                      "\n      "
                  ),
                  _c("button", {
                    staticClass: "btn-close",
                    attrs: {
                      type: "button",
                      "data-bs-dismiss": "alert",
                      "aria-label": "Close",
                    },
                  }),
                ]
              )
            : _vm._e(),
          _vm._v(" "),
          _vm.languages.length > 0
            ? _c(
                "div",
                { staticClass: "col-md-12 mb-3" },
                [
                  _c(
                    "b-tabs",
                    {
                      attrs: { "content-class": "mt-3" },
                      model: {
                        value: _vm.activeLanguageTab,
                        callback: function ($$v) {
                          _vm.activeLanguageTab = $$v
                        },
                        expression: "activeLanguageTab",
                      },
                    },
                    _vm._l(_vm.languages, function (language) {
                      return _c(
                        "b-tab",
                        {
                          key: language.id,
                          attrs: { title: language.name, lazy: "" },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "title",
                                fn: function () {
                                  return [
                                    _c(
                                      "span",
                                      {
                                        class: {
                                          "text-primary font-weight-bold":
                                            language.is_default,
                                        },
                                      },
                                      [
                                        _vm._v(
                                          "\n              " +
                                            _vm._s(language.name) +
                                            "\n            "
                                        ),
                                      ]
                                    ),
                                  ]
                                },
                                proxy: true,
                              },
                            ],
                            null,
                            true
                          ),
                        },
                        [
                          _vm._v(" "),
                          language.is_default && _vm.languages.length > 1
                            ? _c(
                                "div",
                                { staticClass: "mb-3" },
                                [
                                  _c(
                                    "b-button",
                                    {
                                      directives: [
                                        {
                                          name: "b-tooltip",
                                          rawName: "v-b-tooltip.hover",
                                          modifiers: { hover: true },
                                        },
                                      ],
                                      staticClass: "mr-2",
                                      attrs: {
                                        size: "sm",
                                        variant: "outline-primary",
                                        title: _vm.__(
                                          "only_empty_fields_will_be_translated_existing_content_will_not_be_changed"
                                        ),
                                        disabled: _vm.loadingEmpty,
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.translateEmpty(language)
                                        },
                                      },
                                    },
                                    [
                                      !_vm.loadingEmpty
                                        ? _c("span", [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__("translate_empty_fields")
                                              )
                                            ),
                                          ])
                                        : _c("b-spinner", {
                                            attrs: { small: "" },
                                          }),
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "b-button",
                                    {
                                      directives: [
                                        {
                                          name: "b-tooltip",
                                          rawName: "v-b-tooltip.hover",
                                          modifiers: { hover: true },
                                        },
                                      ],
                                      attrs: {
                                        size: "sm",
                                        variant: "outline-danger",
                                        title: _vm.__(
                                          "all_fields_will_be_translated_and_existing_content_will_be_overwritten"
                                        ),
                                        disabled: _vm.loadingOverwrite,
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.translateOverwrite(
                                            language
                                          )
                                        },
                                      },
                                    },
                                    [
                                      !_vm.loadingOverwrite
                                        ? _c("span", [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__(
                                                  "translate_and_overwrite"
                                                )
                                              )
                                            ),
                                          ])
                                        : _c("b-spinner", {
                                            attrs: { small: "" },
                                          }),
                                    ],
                                    1
                                  ),
                                ],
                                1
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticClass: "row" },
                            [
                              _c(
                                "div",
                                { staticClass: "form-group col-md-6 mt-0" },
                                [
                                  _c("label", [
                                    _vm._v(
                                      " " + _vm._s(_vm.__("message")) + " "
                                    ),
                                    language.is_default
                                      ? _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        )
                                      : _vm._e(),
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value:
                                          _vm.translations[language.id].message,
                                        expression:
                                          "translations[language.id].message",
                                      },
                                    ],
                                    staticClass: "form-control",
                                    attrs: {
                                      type: "text",
                                      required:
                                        language.is_default == 1
                                          ? true
                                          : undefined,
                                      placeholder: _vm.__("message", {
                                        language: language.name,
                                      }),
                                    },
                                    domProps: {
                                      value:
                                        _vm.translations[language.id].message,
                                    },
                                    on: {
                                      input: function ($event) {
                                        if ($event.target.composing) {
                                          return
                                        }
                                        _vm.$set(
                                          _vm.translations[language.id],
                                          "message",
                                          $event.target.value
                                        )
                                      },
                                    },
                                  }),
                                ]
                              ),
                              _vm._v(" "),
                              language.is_default
                                ? [
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-6" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            " " + _vm._s(_vm.__("promo_code"))
                                          ),
                                          _c(
                                            "i",
                                            { staticClass: "text-danger" },
                                            [_vm._v("*")]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.promo_code,
                                              expression: "promo_code",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "text",
                                            placeholder: _vm.__("promo_code"),
                                          },
                                          domProps: { value: _vm.promo_code },
                                          on: {
                                            input: function ($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.promo_code =
                                                $event.target.value
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-6" },
                                      [
                                        _c("label", [
                                          _vm._v(_vm._s(_vm.__("start_date"))),
                                          _c(
                                            "i",
                                            { staticClass: "text-danger" },
                                            [_vm._v("*")]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.start_date,
                                              expression: "start_date",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "date",
                                            placeholder: _vm.__("start_date"),
                                          },
                                          domProps: { value: _vm.start_date },
                                          on: {
                                            input: [
                                              function ($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.start_date =
                                                  $event.target.value
                                              },
                                              _vm.validateStartDate,
                                            ],
                                          },
                                        }),
                                        _vm._v(" "),
                                        _vm.validationStartDateError
                                          ? _c(
                                              "span",
                                              { staticClass: "error" },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.validationStartDateError
                                                  )
                                                ),
                                              ]
                                            )
                                          : _vm._e(),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-6" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            " " + _vm._s(_vm.__("end_date"))
                                          ),
                                          _c(
                                            "i",
                                            { staticClass: "text-danger" },
                                            [_vm._v("*")]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.end_date,
                                              expression: "end_date",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "date",
                                            placeholder: _vm.__("end_date"),
                                          },
                                          domProps: { value: _vm.end_date },
                                          on: {
                                            input: [
                                              function ($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.end_date =
                                                  $event.target.value
                                              },
                                              _vm.validateEndDate,
                                            ],
                                          },
                                        }),
                                        _vm._v(" "),
                                        _vm.validationEndDateError
                                          ? _c(
                                              "span",
                                              { staticClass: "error" },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.validationEndDateError
                                                  )
                                                ),
                                              ]
                                            )
                                          : _vm._e(),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-6" },
                                      [
                                        _c("label", [
                                          _vm._v(_vm._s(_vm.__("no_of_users"))),
                                          _c(
                                            "i",
                                            { staticClass: "text-danger" },
                                            [_vm._v("*")]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.no_of_users,
                                              expression: "no_of_users",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "number",
                                            step: "1",
                                            placeholder: _vm.__("no_of_users"),
                                          },
                                          domProps: { value: _vm.no_of_users },
                                          on: {
                                            input: [
                                              function ($event) {
                                                if ($event.target.composing) {
                                                  return
                                                }
                                                _vm.no_of_users =
                                                  $event.target.value
                                              },
                                              _vm.validateNoOfUsers,
                                            ],
                                          },
                                        }),
                                        _vm._v(" "),
                                        _vm.validationNoOfUsersError
                                          ? _c(
                                              "span",
                                              { staticClass: "error" },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.validationNoOfUsersError
                                                  )
                                                ),
                                              ]
                                            )
                                          : _vm._e(),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-6" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(
                                              _vm.__("minimum_order_amount")
                                            )
                                          ),
                                          _c(
                                            "i",
                                            { staticClass: "text-danger" },
                                            [_vm._v("*")]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.minimum_order_amount,
                                              expression:
                                                "minimum_order_amount",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "number",
                                            min: "0",
                                            step: "0.01",
                                            placeholder: _vm.__(
                                              "minimum_order_amount"
                                            ),
                                          },
                                          domProps: {
                                            value: _vm.minimum_order_amount,
                                          },
                                          on: {
                                            input: function ($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.minimum_order_amount =
                                                $event.target.value
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-6" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            " " +
                                              _vm._s(_vm.__("discount_type"))
                                          ),
                                          _c(
                                            "i",
                                            { staticClass: "text-danger" },
                                            [_vm._v("*")]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c(
                                          "select",
                                          {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.discount_type,
                                                expression: "discount_type",
                                              },
                                            ],
                                            staticClass:
                                              "form-control form-select",
                                            on: {
                                              change: function ($event) {
                                                var $$selectedVal =
                                                  Array.prototype.filter
                                                    .call(
                                                      $event.target.options,
                                                      function (o) {
                                                        return o.selected
                                                      }
                                                    )
                                                    .map(function (o) {
                                                      var val =
                                                        "_value" in o
                                                          ? o._value
                                                          : o.value
                                                      return val
                                                    })
                                                _vm.discount_type = $event
                                                  .target.multiple
                                                  ? $$selectedVal
                                                  : $$selectedVal[0]
                                              },
                                            },
                                          },
                                          [
                                            _c(
                                              "option",
                                              { attrs: { value: "" } },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__(
                                                      "select_discount_type"
                                                    )
                                                  )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: { value: "percentage" },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(_vm.__("percentage"))
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              { attrs: { value: "amount" } },
                                              [
                                                _vm._v(
                                                  " " + _vm._s(_vm.__("amount"))
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _vm.discount_type != ""
                                      ? _c(
                                          "div",
                                          {
                                            staticClass: "form-group col-md-6",
                                          },
                                          [
                                            _c("label", [
                                              _vm._v(
                                                " " + _vm._s(_vm.__("discount"))
                                              ),
                                              _c(
                                                "i",
                                                { staticClass: "text-danger" },
                                                [_vm._v("*")]
                                              ),
                                            ]),
                                            _vm._v(" "),
                                            _vm.discount_type == "percentage"
                                              ? _c("input", {
                                                  directives: [
                                                    {
                                                      name: "model",
                                                      rawName: "v-model",
                                                      value: _vm.discount,
                                                      expression: "discount",
                                                    },
                                                  ],
                                                  staticClass: "form-control",
                                                  attrs: {
                                                    type: "number",
                                                    required: "",
                                                    min: "0.01",
                                                    max: "100",
                                                    step: "0.01",
                                                    placeholder: _vm.__(
                                                      "discount_percentage"
                                                    ),
                                                  },
                                                  domProps: {
                                                    value: _vm.discount,
                                                  },
                                                  on: {
                                                    input: [
                                                      function ($event) {
                                                        if (
                                                          $event.target
                                                            .composing
                                                        ) {
                                                          return
                                                        }
                                                        _vm.discount =
                                                          $event.target.value
                                                      },
                                                      _vm.validateDiscountPercentage,
                                                    ],
                                                  },
                                                })
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _vm.discount_type == "amount"
                                              ? _c("input", {
                                                  directives: [
                                                    {
                                                      name: "model",
                                                      rawName: "v-model",
                                                      value: _vm.discount,
                                                      expression: "discount",
                                                    },
                                                  ],
                                                  staticClass: "form-control",
                                                  attrs: {
                                                    type: "number",
                                                    required: "",
                                                    min: "0",
                                                    step: "0.01",
                                                    placeholder:
                                                      _vm.__("discount_amount"),
                                                  },
                                                  domProps: {
                                                    value: _vm.discount,
                                                  },
                                                  on: {
                                                    input: function ($event) {
                                                      if (
                                                        $event.target.composing
                                                      ) {
                                                        return
                                                      }
                                                      _vm.discount =
                                                        $event.target.value
                                                    },
                                                  },
                                                })
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _vm.discountPercentagevalidationError
                                              ? _c(
                                                  "p",
                                                  { staticClass: "error" },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        _vm.discountPercentagevalidationError
                                                      )
                                                    ),
                                                  ]
                                                )
                                              : _vm._e(),
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _vm.discount_type == "percentage"
                                      ? _c(
                                          "div",
                                          {
                                            staticClass: "form-group col-md-6",
                                          },
                                          [
                                            _c("label", [
                                              _vm._v(
                                                " " +
                                                  _vm._s(
                                                    _vm.__(
                                                      "max_discount_amount"
                                                    )
                                                  )
                                              ),
                                              _c(
                                                "i",
                                                { staticClass: "text-danger" },
                                                [_vm._v("*")]
                                              ),
                                            ]),
                                            _vm._v(" "),
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value:
                                                    _vm.max_discount_amount,
                                                  expression:
                                                    "max_discount_amount",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: {
                                                type: "number",
                                                placeholder: _vm.__(
                                                  "max_discount_amount"
                                                ),
                                              },
                                              domProps: {
                                                value: _vm.max_discount_amount,
                                              },
                                              on: {
                                                input: [
                                                  function ($event) {
                                                    if (
                                                      $event.target.composing
                                                    ) {
                                                      return
                                                    }
                                                    _vm.max_discount_amount =
                                                      $event.target.value
                                                  },
                                                  _vm.validateMaxDiscountAmount,
                                                ],
                                              },
                                            }),
                                            _vm._v(" "),
                                            _vm.validationMaxDiscountAmountError
                                              ? _c(
                                                  "span",
                                                  { staticClass: "error" },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        _vm.validationMaxDiscountAmountError
                                                      )
                                                    ),
                                                  ]
                                                )
                                              : _vm._e(),
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-6" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            " " + _vm._s(_vm.__("repeat_usage"))
                                          ),
                                          _c(
                                            "i",
                                            { staticClass: "text-danger" },
                                            [_vm._v("*")]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c(
                                          "select",
                                          {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.repeat_usage,
                                                expression: "repeat_usage",
                                              },
                                            ],
                                            staticClass:
                                              "form-control form-select",
                                            on: {
                                              change: function ($event) {
                                                var $$selectedVal =
                                                  Array.prototype.filter
                                                    .call(
                                                      $event.target.options,
                                                      function (o) {
                                                        return o.selected
                                                      }
                                                    )
                                                    .map(function (o) {
                                                      var val =
                                                        "_value" in o
                                                          ? o._value
                                                          : o.value
                                                      return val
                                                    })
                                                _vm.repeat_usage = $event.target
                                                  .multiple
                                                  ? $$selectedVal
                                                  : $$selectedVal[0]
                                              },
                                            },
                                          },
                                          [
                                            _c(
                                              "option",
                                              { attrs: { value: "" } },
                                              [
                                                _vm._v(
                                                  " " + _vm._s(_vm.__("select"))
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              { attrs: { value: "1" } },
                                              [
                                                _vm._v(
                                                  _vm._s(_vm.__("allowed"))
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              { attrs: { value: "0" } },
                                              [
                                                _vm._v(
                                                  _vm._s(_vm.__("not_allowed"))
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _vm.repeat_usage === 1 ||
                                    _vm.repeat_usage === "1"
                                      ? _c(
                                          "div",
                                          {
                                            staticClass: "form-group col-md-6",
                                          },
                                          [
                                            _c("label", [
                                              _vm._v(
                                                " " +
                                                  _vm._s(
                                                    _vm.__("no_of_repeat_usage")
                                                  )
                                              ),
                                              _c(
                                                "i",
                                                { staticClass: "text-danger" },
                                                [_vm._v("*")]
                                              ),
                                            ]),
                                            _vm._v(" "),
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value: _vm.no_of_repeat_usage,
                                                  expression:
                                                    "no_of_repeat_usage",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: {
                                                type: "number",
                                                min: "0",
                                                step: "1",
                                                required: "",
                                                placeholder:
                                                  _vm.__("no_of_repeat_usage"),
                                              },
                                              domProps: {
                                                value: _vm.no_of_repeat_usage,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.no_of_repeat_usage =
                                                    $event.target.value
                                                },
                                              },
                                            }),
                                            _vm._v(" "),
                                            _c(
                                              "span",
                                              {
                                                staticClass:
                                                  "text text-primary font-size-13",
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__(
                                                      "set_0_if_you_want_ro_remove_limit"
                                                    )
                                                  )
                                                ),
                                              ]
                                            ),
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c("div", { staticClass: "form-group" }, [
                                      _c("label", [
                                        _vm._v(_vm._s(_vm.__("image"))),
                                      ]),
                                      _vm._v(" "),
                                      _c("p", { staticClass: "text-muted" }, [
                                        _vm._v(
                                          _vm._s(
                                            _vm.__(
                                              "please_choose_square_image_of_larger_than_350px_350px_and_smaller_than_550px_550px"
                                            )
                                          )
                                        ),
                                      ]),
                                      _vm._v(" "),
                                      _vm.error
                                        ? _c("span", { staticClass: "error" }, [
                                            _vm._v(_vm._s(_vm.error)),
                                          ])
                                        : _vm._e(),
                                      _vm._v(" "),
                                      _c("input", {
                                        ref: "file_image",
                                        refInFor: true,
                                        staticClass: "file-input",
                                        attrs: {
                                          type: "file",
                                          accept: "image/*",
                                          name: "image",
                                        },
                                        on: { change: _vm.handleFileUpload },
                                      }),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        {
                                          staticClass:
                                            "file-input-div bg-gray-100",
                                          on: {
                                            click: function ($event) {
                                              return _vm.triggerRefClick(
                                                "file_image"
                                              )
                                            },
                                            drop: _vm.dropFile,
                                            dragover: _vm.$dragoverFile,
                                            dragleave: _vm.$dragleaveFile,
                                          },
                                        },
                                        [
                                          _vm.image && _vm.image.name !== ""
                                            ? [
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.__(
                                                        "selected_file_name"
                                                      )
                                                    ) +
                                                      " " +
                                                      _vm._s(_vm.image.name)
                                                  ),
                                                ]),
                                              ]
                                            : [
                                                _c("label", [
                                                  _c("i", {
                                                    staticClass:
                                                      "fa fa-cloud-upload-alt fa-2x",
                                                  }),
                                                ]),
                                                _vm._v(" "),
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.__(
                                                        "drop_files_here_or_click_to_upload"
                                                      )
                                                    )
                                                  ),
                                                ]),
                                              ],
                                        ],
                                        2
                                      ),
                                      _vm._v(" "),
                                      _vm.image_url
                                        ? _c("div", { staticClass: "row" }, [
                                            _c(
                                              "div",
                                              { staticClass: "col-md-4" },
                                              [
                                                _c("img", {
                                                  staticClass: "custom-image",
                                                  attrs: {
                                                    src: _vm.image_url,
                                                    title: "Promo code image",
                                                    alt: "Promo code image",
                                                  },
                                                }),
                                              ]
                                            ),
                                          ])
                                        : _vm._e(),
                                    ]),
                                    _vm._v(" "),
                                    _vm.id
                                      ? _c(
                                          "div",
                                          {
                                            staticClass: "form-group col-md-12",
                                          },
                                          [
                                            _c("label", [
                                              _vm._v(_vm._s(_vm.__("status"))),
                                            ]),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-9 text-left mt-1",
                                              },
                                              [
                                                _c("b-form-radio-group", {
                                                  attrs: {
                                                    options: [
                                                      {
                                                        text: " Deactivated",
                                                        value: 0,
                                                      },
                                                      {
                                                        text: " Activated",
                                                        value: 1,
                                                      },
                                                    ],
                                                    buttons: "",
                                                    "button-variant":
                                                      "outline-primary",
                                                    required: "",
                                                  },
                                                  model: {
                                                    value: _vm.status,
                                                    callback: function ($$v) {
                                                      _vm.status = $$v
                                                    },
                                                    expression: "status",
                                                  },
                                                }),
                                              ],
                                              1
                                            ),
                                          ]
                                        )
                                      : _vm._e(),
                                  ]
                                : _vm._e(),
                            ],
                            2
                          ),
                        ]
                      )
                    }),
                    1
                  ),
                ],
                1
              )
            : _vm.isLoadingLanguages
            ? _c(
                "div",
                { staticClass: "text-center p-3 mb-3" },
                [_c("b-spinner", { attrs: { label: "Loading languages..." } })],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _c("button", {
            ref: "dummy_submit",
            staticStyle: { display: "none" },
          }),
        ]
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/PromoCode.vue?vue&type=template&id=4be212fa":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/PromoCode/PromoCode.vue?vue&type=template&id=4be212fa ***!
  \*************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* binding */ render),
/* harmony export */   staticRenderFns: () => (/* binding */ staticRenderFns)
/* harmony export */ });
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("div", { staticClass: "page-heading" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("manage_promo_code")))]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-12 col-md-6 order-md-2 order-first" }, [
            _c(
              "nav",
              {
                staticClass: "breadcrumb-header float-start float-lg-end",
                attrs: { "aria-label": "breadcrumb" },
              },
              [
                _c("ol", { staticClass: "breadcrumb" }, [
                  _c(
                    "li",
                    { staticClass: "breadcrumb-item" },
                    [
                      _c("router-link", { attrs: { to: "/dashboard" } }, [
                        _vm._v(_vm._s(_vm.__("dashboard"))),
                      ]),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "li",
                    {
                      staticClass: "breadcrumb-item active",
                      attrs: { "aria-current": "page" },
                    },
                    [_vm._v(_vm._s(_vm.__("manage_promo_code")))]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-12 order-md-1 order-last" }, [
            _c("div", { staticClass: "card" }, [
              _c("div", { staticClass: "card-header" }, [
                _c("h4", [_vm._v(_vm._s(_vm.__("promo_code")))]),
                _vm._v(" "),
                _c("span", { staticClass: "pull-right" }, [
                  _vm.$can("promo_code_create")
                    ? _c(
                        "button",
                        {
                          staticClass: "btn btn-primary",
                          on: {
                            click: function ($event) {
                              _vm.create_new = true
                            },
                          },
                        },
                        [_vm._v(_vm._s(_vm.__("add_promo_code")))]
                      )
                    : _vm._e(),
                ]),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "card-body" },
                [
                  _c(
                    "b-row",
                    { staticClass: "mb-2" },
                    [
                      _c(
                        "b-col",
                        { attrs: { md: "3", "offset-md": "8" } },
                        [
                          _c("h6", { staticClass: "box-title" }, [
                            _vm._v(_vm._s(_vm.__("search"))),
                          ]),
                          _vm._v(" "),
                          _c("b-form-input", {
                            attrs: {
                              id: "filter-input",
                              type: "search",
                              placeholder: _vm.__("search"),
                            },
                            model: {
                              value: _vm.filter,
                              callback: function ($$v) {
                                _vm.filter = $$v
                              },
                              expression: "filter",
                            },
                          }),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "b-col",
                        { staticClass: "text-center", attrs: { md: "1" } },
                        [
                          _c(
                            "button",
                            {
                              directives: [
                                {
                                  name: "b-tooltip",
                                  rawName: "v-b-tooltip.hover",
                                  modifiers: { hover: true },
                                },
                              ],
                              staticClass: "btn btn-primary btn_refresh",
                              attrs: { title: _vm.__("refresh") },
                              on: {
                                click: function ($event) {
                                  return _vm.getPromoCode()
                                },
                              },
                            },
                            [
                              _c("i", {
                                staticClass: "fa fa-refresh",
                                attrs: { "aria-hidden": "true" },
                              }),
                            ]
                          ),
                        ]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  [
                    _c(
                      "div",
                      { staticClass: "table-responsive" },
                      [
                        _c("b-table", {
                          attrs: {
                            items: _vm.promocode,
                            fields: _vm.fields,
                            "current-page": _vm.currentPage,
                            "per-page": _vm.perPage,
                            "sort-direction": _vm.sortDirection,
                            bordered: true,
                            busy: _vm.isLoading,
                            stacked: "md",
                            "show-empty": "",
                            small: "",
                          },
                          scopedSlots: _vm._u([
                            {
                              key: "table-busy",
                              fn: function () {
                                return [
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "text-center text-black my-2",
                                    },
                                    [
                                      _c("b-spinner", {
                                        staticClass: "align-middle",
                                      }),
                                      _vm._v(" "),
                                      _c("strong", [
                                        _vm._v(
                                          _vm._s(_vm.__("loading")) + "..."
                                        ),
                                      ]),
                                    ],
                                    1
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                            {
                              key: "cell(image)",
                              fn: function (row) {
                                return [
                                  _c("img", {
                                    attrs: {
                                      src: row.item.image_url,
                                      height: "50",
                                    },
                                  }),
                                ]
                              },
                            },
                            {
                              key: "cell(message)",
                              fn: function (row) {
                                return [
                                  _vm._v(
                                    "\n                    " +
                                      _vm._s(
                                        _vm.getTranslatedMessage(row.item)
                                      ) +
                                      "\n                "
                                  ),
                                ]
                              },
                            },
                            {
                              key: "cell(validity)",
                              fn: function (row) {
                                return [
                                  row.item.is_applicable === 1
                                    ? _c(
                                        "label",
                                        { staticClass: "badge bg-success" },
                                        [_vm._v(_vm._s(row.item.validity))]
                                      )
                                    : _c(
                                        "label",
                                        { staticClass: "badge bg-danger" },
                                        [_vm._v(_vm._s(row.item.validity))]
                                      ),
                                ]
                              },
                            },
                            {
                              key: "cell(status)",
                              fn: function (row) {
                                return [
                                  row.item.status === 1
                                    ? _c(
                                        "label",
                                        { staticClass: "badge bg-success" },
                                        [_vm._v(_vm._s(_vm.__("active")))]
                                      )
                                    : _c(
                                        "label",
                                        { staticClass: "badge bg-danger" },
                                        [_vm._v(_vm._s(_vm.__("deactive")))]
                                      ),
                                ]
                              },
                            },
                            {
                              key: "cell(actions)",
                              fn: function (row) {
                                return [
                                  _vm.$can("promo_code_update")
                                    ? _c(
                                        "button",
                                        {
                                          directives: [
                                            {
                                              name: "b-tooltip",
                                              rawName: "v-b-tooltip.hover",
                                              modifiers: { hover: true },
                                            },
                                          ],
                                          staticClass: "btn btn-sm btn-primary",
                                          attrs: { title: _vm.__("edit") },
                                          on: {
                                            click: function ($event) {
                                              _vm.edit_record = row.item
                                            },
                                          },
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-pencil-alt",
                                          }),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _vm.$can("promo_code_delete")
                                    ? _c(
                                        "button",
                                        {
                                          directives: [
                                            {
                                              name: "b-tooltip",
                                              rawName: "v-b-tooltip.hover",
                                              modifiers: { hover: true },
                                            },
                                          ],
                                          staticClass: "btn btn-sm btn-danger",
                                          attrs: { title: _vm.__("delete") },
                                          on: {
                                            click: function ($event) {
                                              return _vm.deleteSlider(
                                                row.index,
                                                row.item.id
                                              )
                                            },
                                          },
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-trash",
                                          }),
                                        ]
                                      )
                                    : _vm._e(),
                                ]
                              },
                            },
                          ]),
                        }),
                      ],
                      1
                    ),
                  ],
                  _vm._v(" "),
                  _c(
                    "b-row",
                    [
                      _c(
                        "b-col",
                        { staticClass: "my-1", attrs: { md: "2" } },
                        [
                          _c(
                            "b-form-group",
                            {
                              staticClass: "mb-0",
                              attrs: {
                                label: _vm.__("per_page"),
                                "label-for": "per-page-select",
                                "label-align-sm": "right",
                                "label-size": "sm",
                              },
                            },
                            [
                              _c("b-form-select", {
                                staticClass: "form-control form-select",
                                attrs: {
                                  id: "per-page-select",
                                  options: _vm.pageOptions,
                                  size: "sm",
                                },
                                model: {
                                  value: _vm.perPage,
                                  callback: function ($$v) {
                                    _vm.perPage = $$v
                                  },
                                  expression: "perPage",
                                },
                              }),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "b-col",
                        {
                          staticClass: "my-1",
                          attrs: { md: "4", "offset-md": "6" },
                        },
                        [
                          _c("b-pagination", {
                            staticClass: "my-0",
                            attrs: {
                              "total-rows": _vm.totalRows,
                              "per-page": _vm.perPage,
                              align: "fill",
                              size: "sm",
                            },
                            model: {
                              value: _vm.currentPage,
                              callback: function ($$v) {
                                _vm.currentPage = $$v
                              },
                              expression: "currentPage",
                            },
                          }),
                        ],
                        1
                      ),
                    ],
                    1
                  ),
                ],
                2
              ),
            ]),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _vm.create_new || _vm.edit_record
        ? _c("app-edit-record", {
            attrs: { record: _vm.edit_record },
            on: {
              modalClose: function ($event) {
                return _vm.hideModal()
              },
            },
          })
        : _vm._e(),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);