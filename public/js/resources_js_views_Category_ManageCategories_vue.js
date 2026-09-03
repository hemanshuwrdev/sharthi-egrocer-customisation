"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Category_ManageCategories_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  props: {
    record: {
      type: Object,
      "default": null
    }
  },
  data: function data() {
    return {
      isLoading: false,
      isLoadingData: true,
      // Start with loading state
      image: null,
      // Basic fields
      id: this.record ? this.record.id : null,
      slug: this.record ? this.record.slug : null,
      hsn: this.record ? this.record.hsn : null,
      image_url: this.record ? this.record.image_url : null,
      status: this.record ? this.record.status : 1,
      parent_id: this.record ? this.record.parent_id : 0,
      error: null,
      parent_categories: null,
      // Multi-language support
      activeLanguageTab: 0,
      translations: {},
      defaultLanguageId: null,
      languages: [],
      translatableFields: ['name', 'subtitle', 'meta_title', 'meta_keywords', 'schema_markup', 'meta_description'],
      loadingEmpty: false,
      loadingOverwrite: false
    };
  },
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  created: function created() {
    this.$apiUrl = '/api';
  },
  computed: {
    modal_title: function modal_title() {
      var title = this.id ? __('edit_category') : __('add_category');
      return title;
    }
  },
  methods: {
    // Used by TranslationHelper mixin (Translate buttons). Validates default language is filled.
    validateDefaultLanguageForTranslation: function validateDefaultLanguageForTranslation() {
      return this.validateDefaultLanguage();
    },
    deferDataLoad: function deferDataLoad() {
      var _this = this;
      this.isLoadingData = true;

      // Load languages and parent categories in parallel
      Promise.all([this.fetchActiveLanguages(), this.getParentCategories()]).then(function () {
        // Find default language
        var defaultLang = _this.languages.find(function (lang) {
          return lang.is_default === 1;
        });
        if (defaultLang) {
          _this.defaultLanguageId = defaultLang.id;
        }

        // Initialize translations efficiently (single operation)
        _this.initializeTranslations();

        // Load translations only if editing
        if (_this.id) {
          return _this.loadCategoryWithTranslations();
        } else {
          // For new category, no translations to load
          _this.isLoadingData = false;
        }
      })["catch"](function (error) {
        console.error('Error loading data:', error);
        _this.isLoadingData = false;
      });
    },
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this2 = this;
      return new Promise(function (resolve, reject) {
        // Fetch from API directly - no caching
        axios__WEBPACK_IMPORTED_MODULE_1___default().get(_this2.$apiUrl + '/active_languages').then(function (response) {
          if (response.data.data) {
            _this2.languages = response.data.data;
            resolve(_this2.languages);
          } else {
            reject(new Error('No languages found'));
          }
        })["catch"](function (error) {
          reject(error);
        });
      });
    },
    initializeTranslations: function initializeTranslations() {
      // Create all translations in one object assignment
      var allTranslations = {};
      this.languages.forEach(function (language) {
        allTranslations[language.id] = {
          name: '',
          subtitle: '',
          meta_title: '',
          meta_keywords: '',
          schema_markup: '',
          meta_description: ''
        };
      });
      // Single reactive assignment
      this.translations = allTranslations;
    },
    loadCategoryWithTranslations: function loadCategoryWithTranslations() {
      var _this3 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/categories', {
        params: {
          id: this.id
        }
      }).then(function (response) {
        if (response.data.data) {
          // Response is now an array of categories, get the first one (filtered by id)
          var categories = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
          var category = categories.length > 0 ? categories[0] : null;
          if (!category) {
            _this3.isLoadingData = false;
            return;
          }

          // Load base data
          _this3.slug = category.slug;
          _this3.hsn = category.hsn;
          _this3.parent_id = category.parent_id;
          _this3.image_url = category.image_url;
          _this3.status = category.status;

          // Load translations from the category object
          var updatedTranslations = _objectSpread({}, _this3.translations);
          if (category.translations && Array.isArray(category.translations)) {
            category.translations.forEach(function (trans) {
              var langId = trans.language_id;
              updatedTranslations[langId] = {
                name: trans.name || '',
                subtitle: trans.subtitle || '',
                meta_title: trans.meta_title || '',
                meta_keywords: trans.meta_keywords || '',
                schema_markup: trans.schema_markup || '',
                meta_description: trans.meta_description || ''
              };
            });
          }
          _this3.languages.forEach(function (language) {
            if (!updatedTranslations[language.id] || !updatedTranslations[language.id].name && !updatedTranslations[language.id].subtitle) {
              if (language.is_default) {
                updatedTranslations[language.id] = {
                  name: category.name || '',
                  subtitle: category.subtitle || '',
                  meta_title: category.meta_title || '',
                  meta_keywords: category.meta_keywords || '',
                  schema_markup: category.schema_markup || '',
                  meta_description: category.meta_description || ''
                };
              }
            }
          });

          // Single assignment for reactivity
          _this3.translations = updatedTranslations;
        }
        _this3.isLoadingData = false;
      })["catch"](function (error) {
        _this3.isLoadingData = false;
        throw error;
      });
    },
    createSlug: function createSlug() {
      var _this4 = this;
      if (!this.defaultLanguageId) return;
      var name = this.translations[this.defaultLanguageId].name;
      if (name !== "") {
        var slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

        // Check for uniqueness
        axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + "/categories/check-slug/".concat(slug)).then(function (response) {
          if (response.data.unique) {
            _this4.slug = slug;
          } else {
            _this4.slug = slug + '-' + response.data.count;
          }
        })["catch"](function (error) {
          console.error('Error checking slug uniqueness: ' + error);
        });
      }
    },
    getParentCategories: function getParentCategories() {
      var _this5 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/categories/options', {
        params: {
          exclude_id: this.record ? this.record.id : 0
        }
      }).then(function (response) {
        _this5.parent_categories = response.data;
      });
    },
    showModal: function showModal() {
      this.$refs['my-modal'].show();
    },
    hideModal: function hideModal() {
      this.$refs['my-modal'].hide();
    },
    handleDragOver: function handleDragOver(event) {
      event.preventDefault();
      event.currentTarget.classList.add('bg-green-300');
      event.currentTarget.classList.remove('bg-gray-100');
    },
    handleDragLeave: function handleDragLeave(event) {
      event.preventDefault();
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    dropFile: function dropFile(event) {
      event.preventDefault();

      // Get the file input element (handle array case from lazy-loaded tabs)
      var fileInputRef = this.$refs.file_image;
      var fileInput = Array.isArray(fileInputRef) ? fileInputRef[0] : fileInputRef;
      if (fileInput) {
        fileInput.files = event.dataTransfer.files;
        this.handleFileUpload();
      }
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleFileUpload: function handleFileUpload() {
      // Get the file input element (handle array case from lazy-loaded tabs)
      var fileInputRef = this.$refs.file_image;
      var fileInput = Array.isArray(fileInputRef) ? fileInputRef[0] : fileInputRef;

      // Check if fileInput exists and has files
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        return;
      }
      var file = fileInput.files[0];

      // Reset previous error message
      this.error = null;

      // Check if a file was selected
      if (!file) return;

      // Perform image validation
      var validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
      if (!validTypes.includes(file.type)) {
        this.error = "Invalid file type. Please upload a JPEG, PNG, JPG, GIF, WEBP or SVG image.";
        return;
      }
      var maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.error = "File size exceeds the maximum allowed limit (2MB).";
        return;
      }

      // Create a URL for the uploaded image and display it
      this.imageUrl = URL.createObjectURL(file);
      this.image = file;
      this.image_url = URL.createObjectURL(file);
    },
    validateDefaultLanguage: function validateDefaultLanguage() {
      if (!this.defaultLanguageId) {
        this.showError(__('default_language_not_found'));
        return false;
      }
      var defaultTranslation = this.translations[this.defaultLanguageId];

      // Check required fields for default language - show generic message for any missing field
      if (!defaultTranslation.name || defaultTranslation.name.trim() === '') {
        this.switchToDefaultLanguageTab();
        this.showError(__('please_fill_default_language_required_fields'));
        return false;
      }
      if (!defaultTranslation.subtitle || defaultTranslation.subtitle.trim() === '') {
        this.switchToDefaultLanguageTab();
        this.showError(__('please_fill_default_language_required_fields'));
        return false;
      }
      if (!this.slug || this.slug.trim() === '') {
        this.switchToDefaultLanguageTab();
        this.showError(__('please_fill_default_language_required_fields'));
        return false;
      }
      if (!this.id && !this.image && !this.image_url) {
        this.switchToDefaultLanguageTab();
        this.showError(__('please_fill_default_language_required_fields'));
        return false;
      }
      return true;
    },
    triggerFileInput: function triggerFileInput() {
      var _this6 = this;
      // Use nextTick to ensure DOM is ready
      this.$nextTick(function () {
        var fileInput = _this6.$refs.file_image;
        if (fileInput) {
          // Handle both direct element and array of elements
          var element = Array.isArray(fileInput) ? fileInput[0] : fileInput;
          if (element && element.click) {
            element.click();
          }
        }
      });
    },
    // Switches to default language tab so user sees the required fields. Caller shows the specific error.
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this7 = this;
      var defaultLangIndex = this.languages.findIndex(function (lang) {
        return lang.id === _this7.defaultLanguageId;
      });
      if (defaultLangIndex !== -1) {
        this.activeLanguageTab = defaultLangIndex;
      }
    },
    saveRecord: function saveRecord() {
      var _this8 = this;
      if (!this.validateDefaultLanguage()) return;
      var vm = this;
      this.isLoading = true;
      var languagesToSave = [];
      var defaultLang = this.languages.find(function (lang) {
        return lang.is_default;
      });

      // Add default language first
      if (defaultLang) {
        languagesToSave.push(defaultLang);
      }

      // Add other languages that have data
      this.languages.forEach(function (language) {
        if (language.is_default) return; // Skip default, already added

        var translation = _this8.translations[language.id];
        var hasData = _this8.translatableFields.some(function (field) {
          var val = translation[field];
          return val != null && String(val).trim() !== '';
        });
        if (hasData || _this8.id) {
          languagesToSave.push(language);
        }
      });

      // Save sequentially: default language first, then others
      var saveSequentially = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
          var categoryId, i, language, translation, formData, url, response;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  categoryId = _this8.id; // For edit mode
                  i = 0;
                case 2:
                  if (!(i < languagesToSave.length)) {
                    _context.next = 35;
                    break;
                  }
                  language = languagesToSave[i];
                  translation = _this8.translations[language.id];
                  formData = new FormData(); // Basic fields
                  if (categoryId) {
                    formData.append('id', categoryId);
                  }
                  formData.append('language_id', language.id);
                  formData.append('slug', _this8.slug);
                  formData.append('hsn', _this8.hsn || '');
                  formData.append('status', _this8.status);
                  formData.append('parent_id', _this8.parent_id);

                  // Translatable fields
                  formData.append('name', translation.name || '');
                  formData.append('subtitle', translation.subtitle || '');
                  formData.append('meta_title', translation.meta_title || '');
                  formData.append('meta_keywords', translation.meta_keywords || '');
                  formData.append('schema_markup', translation.schema_markup || '');
                  formData.append('meta_description', translation.meta_description || '');

                  // Image (only send with default language)
                  if (language.is_default && _this8.image) {
                    formData.append('image', _this8.image);
                  }
                  url = _this8.$apiUrl + '/categories/save';
                  if (categoryId) {
                    url = _this8.$apiUrl + '/categories/update';
                  }
                  _context.prev = 21;
                  _context.next = 24;
                  return axios__WEBPACK_IMPORTED_MODULE_1___default().post(url, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  });
                case 24:
                  response = _context.sent;
                  // If this was the first save (default language), get the category ID
                  if (!categoryId && response.data.data && response.data.data.id) {
                    categoryId = response.data.data.id;
                  }
                  _context.next = 32;
                  break;
                case 28:
                  _context.prev = 28;
                  _context.t0 = _context["catch"](21);
                  console.error('Save failed:', _context.t0);
                  throw _context.t0;
                case 32:
                  i++;
                  _context.next = 2;
                  break;
                case 35:
                  return _context.abrupt("return", true);
                case 36:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[21, 28]]);
        }));
        return function saveSequentially() {
          return _ref.apply(this, arguments);
        };
      }();

      // Execute sequential save
      saveSequentially().then(function () {
        var message = __('category_saved_successfully') || 'Category saved successfully';
        // Emit to parent only (parent shows toast once)
        vm.$emit('saved', message);
        // Notify other pages to refresh list only (no toast)
        vm.$eventBus.$emit('categorySaved');
        vm.hideModal();
        vm.$router.push({
          path: '/manage_categories'
        });
      })["catch"](function (error) {
        vm.isLoading = false;
        if (error.response && error.response.data && error.response.data.message) {
          vm.showError(error.response.data.message);
        } else if (error.request && error.request.statusText) {
          vm.showError(error.request.statusText);
        } else if (error.message) {
          vm.showError(error.message);
        } else {
          vm.showError(__('something_went_wrong'));
        }
      });
    }
  },
  mounted: function mounted() {
    var _this9 = this;
    this.showModal();
    this.$nextTick(function () {
      _this9.deferDataLoad();
    });
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/ManageCategories.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/ManageCategories.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue */ "./resources/js/views/Category/Edit.vue");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    'app-edit-record': _Edit_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      fields: [{
        key: 'id',
        label: __('id'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'asc'
      }, {
        key: 'parent_id',
        label: __('parent_id'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'name',
        label: __('name'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'subtitle',
        label: __('subtitle'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'image',
        label: __('image'),
        "class": 'text-center'
      }, {
        key: 'status',
        label: __('status'),
        "class": 'text-center'
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: 'id',
      sortDesc: true,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      page: 1,
      categories: [],
      isLoading: false,
      sectionStyle: 'style_1',
      max_visible_categories: 12,
      max_col_in_single_row: 3,
      create_new: null,
      edit_record: null,
      settingModalShow: false,
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
    },
    filteredCategories: function filteredCategories() {
      var list = Array.isArray(this.categories) ? this.categories : [];
      var query = this.filter ? this.filter.toLowerCase() : '';
      return list.filter(function (category) {
        var name = (category.name || '').toString().toLowerCase();
        var subtitle = (category.subtitle || '').toString().toLowerCase();
        return name.includes(query) || subtitle.includes(query);
      });
    },
    // Computed property to transform categories with translated fields based on current app_locale
    translatedCategories: function translatedCategories() {
      var _this = this;
      // Guard: ensure categories is an array to avoid "Cannot read properties of undefined (reading 'length')"
      var list = Array.isArray(this.categories) ? this.categories : [];
      if (!this.currentLanguageId || list.length === 0) {
        return list;
      }

      // Transform each category to use translated fields
      return list.map(function (category) {
        var translatedCategory = _objectSpread({}, category);
        if (category.translations && Array.isArray(category.translations)) {
          var translation = category.translations.find(function (t) {
            return t.language_id === _this.currentLanguageId;
          });

          // Use translated name if available and not empty, otherwise fallback to main table name
          if (translation && translation.name && translation.name.trim() !== '') {
            translatedCategory.name = translation.name;
          }

          // Use translated subtitle if available and not empty, otherwise fallback to main table subtitle
          if (translation && translation.subtitle && translation.subtitle.trim() !== '') {
            translatedCategory.subtitle = translation.subtitle;
          }
        }
        return translatedCategory;
      });
    }
  },
  mounted: function mounted() {},
  watch: {
    $route: function $route(to, from) {
      this.showCreateModal();
    },
    currentPage: function currentPage(newPage) {
      this.getCategories();
    },
    perPage: function perPage(newPerPage) {
      this.getCategories();
    },
    filter: function filter(newFilter, oldFilter) {
      this.currentPage = 1;
      this.getCategories();
    }
  },
  created: function created() {
    var _this2 = this;
    this.showCreateModal();
    this.fetchActiveLanguages().then(function () {
      _this2.getCategories();
    });
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      return axios.get(this.$apiUrl + '/active_languages').then(function (response) {
        if (response.data.data && Array.isArray(response.data.data)) {
          _this3.activeLanguages = response.data.data;
          var appLocale = window.appLocale || 'en';

          // Find language ID for current app_locale code
          var currentLanguage = _this3.activeLanguages.find(function (lang) {
            return lang.code === appLocale;
          });
          if (currentLanguage) {
            _this3.currentLanguageId = currentLanguage.id;
          } else {
            var defaultLanguage = _this3.activeLanguages.find(function (lang) {
              return lang.is_default === 1;
            });
            if (defaultLanguage) {
              _this3.currentLanguageId = defaultLanguage.id;
            }
          }
        }
      })["catch"](function (error) {
        console.error('Error loading languages:', error);
      });
    },
    getCategories: function getCategories() {
      var _this4 = this;
      this.isLoading = true;
      var params = {
        offset: this.currentPage,
        limit: this.perPage,
        filter: this.filter
      };
      axios.get(this.$apiUrl + '/categories', {
        params: params
      }).then(function (response) {
        _this4.isLoading = false;
        var data = response.data || {};
        // Always set to array so .length and table empty state work; avoid undefined
        _this4.categories = Array.isArray(data.data) ? data.data : [];
        _this4.totalRows = typeof data.total === 'number' ? data.total : 0;
      })["catch"](function () {
        _this4.isLoading = false;
        _this4.categories = [];
        _this4.totalRows = 0;
      });
    },
    deleteCategory: function deleteCategory(index, id) {
      var _this5 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_be_able_to_revert_this'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (result.value) {
          _this5.isLoading = true;
          var postData = {
            id: id
          };
          axios.post(_this5.$apiUrl + '/categories/delete', postData).then(function (response) {
            _this5.isLoading = false;
            var data = response.data;
            _this5.categories.splice(index, 1);
            _this5.showMessage('success', data.message);
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
        path: '/manage_categories'
      });
    },
    // Called when Edit modal saves; show toast once and refresh list
    onCategorySaved: function onCategorySaved(message) {
      this.showMessage('success', message);
      this.getCategories();
      this.create_new = null;
    }
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.image_preview[data-v-df3546e8] {\n    margin-top: 5px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_df3546e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_df3546e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_df3546e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Category/Edit.vue":
/*!**********************************************!*\
  !*** ./resources/js/views/Category/Edit.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue_vue_type_template_id_df3546e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=df3546e8&scoped=true */ "./resources/js/views/Category/Edit.vue?vue&type=template&id=df3546e8&scoped=true");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js */ "./resources/js/views/Category/Edit.vue?vue&type=script&lang=js");
/* harmony import */ var _Edit_vue_vue_type_style_index_0_id_df3546e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css */ "./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_df3546e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Edit_vue_vue_type_template_id_df3546e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "df3546e8",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Category/Edit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Category/ManageCategories.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/Category/ManageCategories.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ManageCategories_vue_vue_type_template_id_35266163__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManageCategories.vue?vue&type=template&id=35266163 */ "./resources/js/views/Category/ManageCategories.vue?vue&type=template&id=35266163");
/* harmony import */ var _ManageCategories_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ManageCategories.vue?vue&type=script&lang=js */ "./resources/js/views/Category/ManageCategories.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ManageCategories_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ManageCategories_vue_vue_type_template_id_35266163__WEBPACK_IMPORTED_MODULE_0__.render,
  _ManageCategories_vue_vue_type_template_id_35266163__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Category/ManageCategories.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Category/Edit.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/views/Category/Edit.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Category/ManageCategories.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/Category/ManageCategories.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageCategories_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageCategories.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/ManageCategories.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageCategories_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_df3546e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=style&index=0&id=df3546e8&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Category/Edit.vue?vue&type=template&id=df3546e8&scoped=true":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/Category/Edit.vue?vue&type=template&id=df3546e8&scoped=true ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_df3546e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_df3546e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_df3546e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=template&id=df3546e8&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=template&id=df3546e8&scoped=true");


/***/ }),

/***/ "./resources/js/views/Category/ManageCategories.vue?vue&type=template&id=35266163":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/Category/ManageCategories.vue?vue&type=template&id=35266163 ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageCategories_vue_vue_type_template_id_35266163__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageCategories_vue_vue_type_template_id_35266163__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageCategories_vue_vue_type_template_id_35266163__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageCategories.vue?vue&type=template&id=35266163 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/ManageCategories.vue?vue&type=template&id=35266163");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=template&id=df3546e8&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/Edit.vue?vue&type=template&id=df3546e8&scoped=true ***!
  \*******************************************************************************************************************************************************************************************************************************/
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
        scrollable: "",
        "no-close-on-backdrop": "",
        "no-fade": "",
        static: "",
        size: "xl",
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
              attrs: { variant: "primary", disabled: _vm.isLoading },
              on: {
                click: function ($event) {
                  return _vm.$refs["dummy_submit"].click()
                },
              },
            },
            [
              _vm._v(_vm._s(_vm.__("save")) + "\n            "),
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
      _vm.isLoadingData
        ? _c(
            "div",
            { staticClass: "text-center p-5" },
            [
              _c("b-spinner", { attrs: { label: "Loading..." } }),
              _vm._v(" "),
              _c("p", { staticClass: "mt-2" }, [
                _vm._v(_vm._s(_vm.__("loading"))),
              ]),
            ],
            1
          )
        : _c(
            "form",
            {
              ref: "my-form",
              attrs: { novalidate: "" },
              on: {
                submit: function ($event) {
                  $event.preventDefault()
                  return _vm.saveRecord.apply(null, arguments)
                },
              },
            },
            [
              _vm.languages.length > 0
                ? _c(
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
                                          "\n                        " +
                                            _vm._s(language.name) +
                                            "\n                    "
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
                          _c("div", { staticClass: "row" }, [
                            language.is_default
                              ? _c("div", { staticClass: "form-group" }, [
                                  _c("label", [
                                    _vm._v(_vm._s(_vm.__("parent_category"))),
                                  ]),
                                  _vm._v(" "),
                                  _c("select", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.parent_id,
                                        expression: "parent_id",
                                      },
                                    ],
                                    staticClass: "form-control form-select",
                                    domProps: {
                                      innerHTML: _vm._s(_vm.parent_categories),
                                    },
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
                                        _vm.parent_id = $event.target.multiple
                                          ? $$selectedVal
                                          : $$selectedVal[0]
                                      },
                                    },
                                  }),
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            _c(
                              "div",
                              {
                                staticClass: "form-group",
                                class: { required: language.is_default },
                              },
                              [
                                _c("label", [
                                  _vm._v(_vm._s(_vm.__("category_name"))),
                                ]),
                                _vm._v(" "),
                                language.is_default
                                  ? _c("i", { staticClass: "text-danger" }, [
                                      _vm._v("*"),
                                    ])
                                  : _vm._e(),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.translations[language.id].name,
                                      expression:
                                        "translations[language.id].name",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "text",
                                    placeholder: _vm.__("enter_category_name"),
                                  },
                                  domProps: {
                                    value: _vm.translations[language.id].name,
                                  },
                                  on: {
                                    keyup: function ($event) {
                                      language.is_default
                                        ? _vm.createSlug()
                                        : null
                                    },
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.translations[language.id],
                                        "name",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]
                            ),
                            _vm._v(" "),
                            language.is_default
                              ? _c("div", { staticClass: "form-group" }, [
                                  _c("label", [_vm._v(_vm._s(_vm.__("slug")))]),
                                  _vm._v(" "),
                                  _c("i", { staticClass: "text-danger" }, [
                                    _vm._v("*"),
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.slug,
                                        expression: "slug",
                                      },
                                    ],
                                    staticClass: "form-control",
                                    attrs: {
                                      type: "text",
                                      placeholder: _vm.__("enter_slug"),
                                    },
                                    domProps: { value: _vm.slug },
                                    on: {
                                      input: function ($event) {
                                        if ($event.target.composing) {
                                          return
                                        }
                                        _vm.slug = $event.target.value
                                      },
                                    },
                                  }),
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            language.is_default
                              ? _c("div", { staticClass: "form-group" }, [
                                  _c("label", [
                                    _vm._v(_vm._s(_vm.__("hsn_code"))),
                                  ]),
                                  _vm._v(" "),
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.hsn,
                                        expression: "hsn",
                                      },
                                    ],
                                    staticClass: "form-control",
                                    attrs: {
                                      type: "text",
                                      placeholder: _vm.__("enter_hsn_code"),
                                    },
                                    domProps: { value: _vm.hsn },
                                    on: {
                                      input: function ($event) {
                                        if ($event.target.composing) {
                                          return
                                        }
                                        _vm.hsn = $event.target.value
                                      },
                                    },
                                  }),
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            _c(
                              "div",
                              {
                                staticClass: "form-group",
                                class: { required: language.is_default },
                              },
                              [
                                _c("label", [
                                  _vm._v(_vm._s(_vm.__("category_subtitle"))),
                                ]),
                                _vm._v(" "),
                                language.is_default
                                  ? _c("i", { staticClass: "text-danger" }, [
                                      _vm._v("*"),
                                    ])
                                  : _vm._e(),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value:
                                        _vm.translations[language.id].subtitle,
                                      expression:
                                        "translations[language.id].subtitle",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "text",
                                    placeholder: _vm.__(
                                      "enter_category_subtitle"
                                    ),
                                  },
                                  domProps: {
                                    value:
                                      _vm.translations[language.id].subtitle,
                                  },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.translations[language.id],
                                        "subtitle",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]
                            ),
                            _vm._v(" "),
                            language.is_default
                              ? _c("div", { staticClass: "form-group" }, [
                                  _c("label", [
                                    _vm._v(_vm._s(_vm.__("image"))),
                                  ]),
                                  _c("i", { staticClass: "text-danger" }, [
                                    _vm._v("*"),
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
                                    staticStyle: { display: "none" },
                                    attrs: {
                                      type: "file",
                                      name: "category_image",
                                      accept: "image/*",
                                    },
                                    on: { change: _vm.handleFileUpload },
                                  }),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass: "file-input-div bg-gray-100",
                                      on: {
                                        click: _vm.triggerFileInput,
                                        drop: _vm.dropFile,
                                        dragover: _vm.handleDragOver,
                                        dragleave: _vm.handleDragLeave,
                                      },
                                    },
                                    [
                                      _vm.image && _vm.image.name !== ""
                                        ? [
                                            _c("label", [
                                              _vm._v(
                                                _vm._s(
                                                  _vm.__("selected_file_name")
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
                                        _c("div", { staticClass: "col-md-4" }, [
                                          _c("img", {
                                            staticClass: "custom-image",
                                            attrs: {
                                              src: _vm.image_url,
                                              title: "Category Image",
                                              alt: "Category Image",
                                            },
                                          }),
                                        ]),
                                      ])
                                    : _vm._e(),
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            _c("div", { staticClass: "form-group" }, [
                              _c("label", [
                                _vm._v(_vm._s(_vm.__("meta_title"))),
                              ]),
                              _vm._v(" "),
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.translations[language.id].meta_title,
                                    expression:
                                      "translations[language.id].meta_title",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: {
                                  type: "text",
                                  placeholder: _vm.__("enter_meta_title"),
                                },
                                domProps: {
                                  value:
                                    _vm.translations[language.id].meta_title,
                                },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.translations[language.id],
                                      "meta_title",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "form-group" }, [
                              _c("label", [
                                _vm._v(_vm._s(_vm.__("meta_keywords"))),
                              ]),
                              _vm._v(" "),
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.translations[language.id]
                                        .meta_keywords,
                                    expression:
                                      "translations[language.id].meta_keywords",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: {
                                  type: "text",
                                  placeholder: _vm.__("enter_meta_keywords"),
                                },
                                domProps: {
                                  value:
                                    _vm.translations[language.id].meta_keywords,
                                },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.translations[language.id],
                                      "meta_keywords",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "form-group" }, [
                              _c(
                                "label",
                                [
                                  _vm._v(
                                    _vm._s(_vm.__("schema_markup")) +
                                      "\n                            "
                                  ),
                                  _c(
                                    "small",
                                    {
                                      staticClass:
                                        "d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2",
                                      attrs: {
                                        id: "schema_markup_" + language.id,
                                      },
                                    },
                                    [
                                      _c("i", {
                                        staticClass: "fa fa-info-circle",
                                      }),
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "b-popover",
                                    {
                                      attrs: {
                                        target: "schema_markup_" + language.id,
                                        triggers: "hover",
                                        placement: "left",
                                      },
                                    },
                                    [
                                      _c("p", [
                                        _vm._v(
                                          "Schema markup, also known as structured data, is the language search engines use\n                                    to read and\n                                    understand the content on your pages. By language, we mean a semantic vocabulary\n                                    (code) that helps\n                                    search engines characterize and categorize the content of web pages. Learn more\n                                    about schema markup\n                                    and generate it for your website using the "
                                        ),
                                        _c(
                                          "a",
                                          {
                                            attrs: {
                                              href: "https://www.rankranger.com/schema-markup-generator",
                                              target: "_blank",
                                            },
                                          },
                                          [
                                            _vm._v(
                                              "Rank Ranger Schema\n                                        Markup Generator"
                                            ),
                                          ]
                                        ),
                                      ]),
                                    ]
                                  ),
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c("textarea", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.translations[language.id]
                                        .schema_markup,
                                    expression:
                                      "translations[language.id].schema_markup",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: {
                                  placeholder: _vm.__("enter_schema_markup"),
                                  rows: "4",
                                },
                                domProps: {
                                  value:
                                    _vm.translations[language.id].schema_markup,
                                },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.translations[language.id],
                                      "schema_markup",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "form-group" }, [
                              _c("label", [
                                _vm._v(_vm._s(_vm.__("meta_description"))),
                              ]),
                              _vm._v(" "),
                              _c("textarea", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value:
                                      _vm.translations[language.id]
                                        .meta_description,
                                    expression:
                                      "translations[language.id].meta_description",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: {
                                  type: "text",
                                  placeholder: _vm.__("enter_meta_description"),
                                  rows: "4",
                                },
                                domProps: {
                                  value:
                                    _vm.translations[language.id]
                                      .meta_description,
                                },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.$set(
                                      _vm.translations[language.id],
                                      "meta_description",
                                      $event.target.value
                                    )
                                  },
                                },
                              }),
                            ]),
                            _vm._v(" "),
                            _vm.id && language.is_default
                              ? _c("div", { staticClass: "form-group" }, [
                                  _c("label", [
                                    _vm._v(_vm._s(_vm.__("status"))),
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "col-md-9 text-left mt-1" },
                                    [
                                      _c("b-form-radio-group", {
                                        attrs: {
                                          options: [
                                            {
                                              text: _vm.__("deactivate"),
                                              value: 0,
                                            },
                                            {
                                              text: _vm.__("activate"),
                                              value: 1,
                                            },
                                          ],
                                          buttons: "",
                                          "button-variant": "outline-primary",
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
                                ])
                              : _vm._e(),
                          ]),
                        ]
                      )
                    }),
                    1
                  )
                : _c(
                    "div",
                    { staticClass: "text-center p-5" },
                    [
                      _c("b-spinner", {
                        attrs: { label: "Loading languages..." },
                      }),
                      _vm._v(" "),
                      _c("p", { staticClass: "mt-2" }, [
                        _vm._v(_vm._s(_vm.__("loading_languages"))),
                      ]),
                    ],
                    1
                  ),
              _vm._v(" "),
              _c("button", {
                ref: "dummy_submit",
                staticStyle: { display: "none" },
              }),
            ],
            1
          ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/ManageCategories.vue?vue&type=template&id=35266163":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Category/ManageCategories.vue?vue&type=template&id=35266163 ***!
  \*******************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "list-page" },
    [
      _c("div", { staticClass: "page-head" }, [
        _c("h3", { staticClass: "page-head-title" }, [
          _vm._v(_vm._s(_vm.__("categories"))),
        ]),
        _vm._v(" "),
        _vm.$can("category_create")
          ? _c(
              "button",
              {
                staticClass:
                  "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap",
                on: {
                  click: function ($event) {
                    _vm.create_new = true
                  },
                },
              },
              [
                _c("i", {
                  staticClass: "fa fa-plus",
                  attrs: { "aria-hidden": "true" },
                }),
                _vm._v(" "),
                _c("span", [_vm._v(_vm._s(_vm.__("add_category")))]),
              ]
            )
          : _vm._e(),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "list-surface" }, [
        _c("div", { staticClass: "list-toolbar" }, [
          _c(
            "div",
            { staticClass: "list-search" },
            [
              _c("i", {
                staticClass: "fa fa-search list-search-icon",
                attrs: { "aria-hidden": "true" },
              }),
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
            "button",
            {
              directives: [
                {
                  name: "b-tooltip",
                  rawName: "v-b-tooltip.hover",
                  modifiers: { hover: true },
                },
              ],
              staticClass: "list-icon-btn",
              attrs: { title: _vm.__("refresh") },
              on: {
                click: function ($event) {
                  return _vm.getCategories()
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
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "table-responsive" },
          [
            _c("b-table", {
              attrs: {
                items: _vm.translatedCategories,
                fields: _vm.fields,
                filter: _vm.filter,
                "filter-included-fields": _vm.filterOn,
                "sort-by": _vm.sortBy,
                "sort-desc": _vm.sortDesc,
                "sort-direction": _vm.sortDirection,
                bordered: true,
                busy: _vm.isLoading,
                stacked: "md",
                "show-empty": "",
                small: "",
                "empty-text": _vm.__("no_records_to_show"),
                "empty-filtered-text": _vm.__("no_records_to_show"),
              },
              on: {
                "update:sortBy": function ($event) {
                  _vm.sortBy = $event
                },
                "update:sort-by": function ($event) {
                  _vm.sortBy = $event
                },
                "update:sortDesc": function ($event) {
                  _vm.sortDesc = $event
                },
                "update:sort-desc": function ($event) {
                  _vm.sortDesc = $event
                },
              },
              scopedSlots: _vm._u([
                {
                  key: "table-busy",
                  fn: function () {
                    return [
                      _c(
                        "div",
                        { staticClass: "text-center text-black my-2" },
                        [
                          _c("b-spinner", { staticClass: "align-middle" }),
                          _vm._v(" "),
                          _c("strong", [
                            _vm._v(_vm._s(_vm.__("loading")) + "..."),
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
                        attrs: { src: row.item.image_url, height: "50" },
                      }),
                    ]
                  },
                },
                {
                  key: "cell(status)",
                  fn: function (row) {
                    return [
                      row.item.status == 1
                        ? _c("span", { staticClass: "badge bg-success" }, [
                            _vm._v(_vm._s(_vm.__("activate"))),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      row.item.status == 0
                        ? _c("span", { staticClass: "badge bg-danger" }, [
                            _vm._v(_vm._s(_vm.__("deactivate"))),
                          ])
                        : _vm._e(),
                    ]
                  },
                },
                {
                  key: "cell(actions)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "list-actions" }, [
                        _vm.$can("category_update")
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
                                staticClass: "list-action-btn is-edit",
                                attrs: { title: _vm.__("edit") },
                                on: {
                                  click: function ($event) {
                                    _vm.edit_record = row.item
                                  },
                                },
                              },
                              [_c("i", { staticClass: "fa fa-pencil-alt" })]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.$can("category_delete")
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
                                staticClass: "list-action-btn is-delete",
                                attrs: { title: _vm.__("delete") },
                                on: {
                                  click: function ($event) {
                                    return _vm.deleteCategory(
                                      row.index,
                                      row.item.id
                                    )
                                  },
                                },
                              },
                              [_c("i", { staticClass: "fa fa-trash" })]
                            )
                          : _vm._e(),
                      ]),
                    ]
                  },
                },
              ]),
            }),
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "list-footer" },
          [
            _c(
              "div",
              { staticClass: "list-perpage" },
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
            _c("b-pagination", {
              staticClass: "list-pagination",
              attrs: {
                "total-rows": _vm.totalRows,
                "per-page": _vm.perPage,
                align: "fill",
                size: "sm",
              },
              on: { change: _vm.getCategories },
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
      ]),
      _vm._v(" "),
      _vm.create_new || _vm.edit_record
        ? _c("app-edit-record", {
            attrs: { record: _vm.edit_record },
            on: {
              modalClose: function ($event) {
                return _vm.hideModal()
              },
              saved: _vm.onCategorySaved,
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