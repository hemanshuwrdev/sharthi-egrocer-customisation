(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sections_Sections_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var vue_multiselect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue-multiselect */ "./node_modules/vue-multiselect/dist/vue-multiselect.min.js");
/* harmony import */ var vue_multiselect__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(vue_multiselect__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var v_select2_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! v-select2-component */ "./node_modules/v-select2-component/dist/Select2.esm.js");
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_4__["default"]],
  props: ['record'],
  components: {
    Multiselect: (vue_multiselect__WEBPACK_IMPORTED_MODULE_2___default()),
    Select2: v_select2_component__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    var _this$record, _this$record2, _this$record3, _this$record4, _this$record5;
    return {
      previousCategoryIds: [],
      isLoading: false,
      categories: [],
      products: [],
      section: {
        style_app: 'style_1',
        style_web: 'style_1',
        category_ids: [],
        id: ((_this$record = this.record) === null || _this$record === void 0 ? void 0 : _this$record.id) || null,
        product_type: ((_this$record2 = this.record) === null || _this$record2 === void 0 ? void 0 : _this$record2.product_type) || '',
        position: ((_this$record3 = this.record) === null || _this$record3 === void 0 ? void 0 : _this$record3.position) || '',
        background_color_for_light_theme: ((_this$record4 = this.record) === null || _this$record4 === void 0 ? void 0 : _this$record4.background_color_for_light_theme) || '',
        background_color_for_dark_theme: ((_this$record5 = this.record) === null || _this$record5 === void 0 ? void 0 : _this$record5.background_color_for_dark_theme) || '',
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
      loadingOverwrite: false
    };
  },
  created: function created() {
    var _this = this;
    // Fetch languages first, then categories and products
    this.fetchLanguages().then(function () {
      _this.getCategories();
      _this.getProducts();
    });
  },
  watch: {
    'section.product_type': function sectionProduct_type(newVal, oldVal) {
      if (newVal === 'recently_visited_products') {
        // save existing categories
        this.previousCategoryIds = _toConsumableArray(this.section.category_ids || []);
        this.section.category_ids = [];
      }
      if (oldVal === 'recently_visited_products' && newVal !== 'recently_visited_products') {
        // restore categories
        this.section.category_ids = _toConsumableArray(this.previousCategoryIds);
      }
    },
    record: {
      immediate: true,
      deep: true,
      handler: function handler(newVal) {
        var _this2 = this;
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
          this.languages.forEach(function (lang) {
            if (_this2.translations[lang.id]) {
              _this2.translations[lang.id].title = '';
              _this2.translations[lang.id].short_description = '';
            }
          });
        }
        this.tabsKey++;
      }
    }
  },
  computed: {
    modal_title: function modal_title() {
      var title = this.section.id ? __('edit') : __('create');
      title += __('manage_featured_products_section');
      return title;
    },
    categories_options: function categories_options() {
      var _this3 = this;
      return this.categories.map(function (category) {
        return {
          id: category.id,
          text: _this3.getTranslatedCategoryName(category)
        };
      });
    },
    products_options: function products_options() {
      var _this4 = this;
      var temp = [];
      if (this.products.length !== 0) {
        this.products.forEach(function (product) {
          // Get translated product name
          var productName = _this4.getTranslatedProductName(product);
          temp.push({
            id: product.id,
            text: productName
          });
        });
      }
      return temp;
    }
  },
  methods: {
    triggerBannerWebUpload: function triggerBannerWebUpload(langId) {
      var input = this.$refs['file_banner_web_' + langId];
      if (Array.isArray(input)) {
        var _input$;
        (_input$ = input[0]) === null || _input$ === void 0 ? void 0 : _input$.click();
      } else {
        input === null || input === void 0 ? void 0 : input.click();
      }
    },
    triggerBannerAppUpload: function triggerBannerAppUpload(langId) {
      var input = this.$refs['file_banner_app_' + langId];
      if (Array.isArray(input)) {
        var _input$2;
        (_input$2 = input[0]) === null || _input$2 === void 0 ? void 0 : _input$2.click();
      } else {
        input === null || input === void 0 ? void 0 : input.click();
      }
    },
    fetchLanguages: function fetchLanguages() {
      var _this5 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/active_languages').then(function (res) {
        _this5.languages = res.data.data;
        var def = _this5.languages.find(function (l) {
          return l.is_default == 1;
        });
        _this5.defaultLanguageId = def === null || def === void 0 ? void 0 : def.id;

        // Set current language for dropdowns
        _this5.activeLanguages = res.data.data;
        var appLocale = window.appLocale || 'en';
        var currentLang = _this5.activeLanguages.find(function (l) {
          return l.code === appLocale;
        });
        if (currentLang) {
          _this5.currentLanguageId = currentLang.id;
        } else {
          var defaultLang = _this5.activeLanguages.find(function (l) {
            return l.is_default === 1;
          });
          if (defaultLang) _this5.currentLanguageId = defaultLang.id;
        }
        _this5.languages.forEach(function (l) {
          _this5.$set(_this5.translations, l.id, {
            title: '',
            short_description: ''
          });
        });
      });
    },
    getTranslatedCategoryName: function getTranslatedCategoryName(category) {
      var _this6 = this;
      // If no language is set, return main table name
      if (!this.currentLanguageId || !category) {
        return category.name || '';
      }

      // Check if category has translations array
      if (category.translations && Array.isArray(category.translations)) {
        var translation = category.translations.find(function (t) {
          return t.language_id === _this6.currentLanguageId;
        });

        // Use translation if it exists and has value
        if (translation && translation.name && translation.name.trim() !== '') {
          return translation.name;
        }
      }

      // Fallback: Use main table name if no translation found
      return category.name || '';
    },
    getTranslatedProductName: function getTranslatedProductName(product) {
      var _this7 = this;
      // If no language is set, return main table name
      if (!this.currentLanguageId || !product) {
        return product.name || '';
      }

      // Check if product has translations array
      if (product.translations && Array.isArray(product.translations)) {
        var translation = product.translations.find(function (t) {
          return t.language_id === _this7.currentLanguageId;
        });

        // Use translation if it exists and has value
        if (translation && translation.name && translation.name.trim() !== '') {
          return translation.name;
        }
      }

      // Fallback: Use main table name if no translation found
      return product.name || '';
    },
    loadSection: function loadSection() {
      var _this8 = this;
      if (!this.section.id) return;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/sections', {
        params: {
          id: this.section.id
        }
      }).then(function (res) {
        var s = res.data.data[0];
        if (!s) {
          console.error('Section not found');
          return;
        }

        // Load main section fields
        _this8.section.id = s.id;
        _this8.section.product_type = s.product_type || '';
        _this8.section.position = s.position || '';
        _this8.section.category_ids = s.category_ids || [];
        _this8.section.product_ids = s.product_ids || [];
        _this8.section.style_app = s.style_app || 'style_1';
        _this8.section.style_web = s.style_web || 'style_1';
        _this8.section.background_color_for_light_theme = s.background_color_for_light_theme || '';
        _this8.section.background_color_for_dark_theme = s.background_color_for_dark_theme || '';
        _this8.section.banner_app_url = s.banner_app_url || '';
        _this8.section.banner_web_url = s.banner_web_url || '';

        // Ensure all languages are initialized first
        _this8.languages.forEach(function (lang) {
          if (!_this8.translations[lang.id]) {
            _this8.$set(_this8.translations, lang.id, {
              title: '',
              short_description: ''
            });
          }
        });

        // Get main table title and short_description for fallback
        var mainTitle = s.title || '';
        var mainShortDescription = s.short_description || '';

        // Process translations with fallback logic
        _this8.languages.forEach(function (lang) {
          var translation = Array.isArray(s.translations) && s.translations.length > 0 ? s.translations.find(function (t) {
            return t.language_id === lang.id;
          }) : null;
          if (lang.is_default) {
            // For default language, use translation if exists and has value, otherwise fallback to main table data
            _this8.$set(_this8.translations, lang.id, {
              title: translation && translation.title && translation.title.trim() !== '' ? translation.title : mainTitle || '',
              short_description: translation && translation.short_description && translation.short_description.trim() !== '' ? translation.short_description : mainShortDescription || ''
            });
          } else {
            // For other languages, use translation if exists, otherwise empty
            _this8.$set(_this8.translations, lang.id, {
              title: translation && translation.title ? translation.title : '',
              short_description: translation && translation.short_description ? translation.short_description : ''
            });
          }
        });
        _this8.tabsKey++;
      });
    },
    validateDefaultLanguage: function validateDefaultLanguage() {
      if (!this.defaultLanguageId) {
        this.showError(__('default_language_not_found'));
        return false;
      }
      var defaultTranslation = this.translations[this.defaultLanguageId];

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
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this9 = this;
      var defaultLangIndex = this.languages.findIndex(function (lang) {
        return lang.id === _this9.defaultLanguageId;
      });
      if (defaultLangIndex !== -1) {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLanguageTab = defaultLangIndex;
      }
    },
    validateDefaultLanguageForTranslation: function validateDefaultLanguageForTranslation() {
      var _this10 = this;
      var form = this.$refs['my-form'];
      if (form && !form.reportValidity()) {
        this.$nextTick(function () {
          return _this10.switchToDefaultLanguageTab();
        });
        return false;
      }
      return this.validateDefaultLanguage();
    },
    showModal: function showModal() {
      this.$refs['my-modal'].show();
    },
    hideModal: function hideModal() {
      this.$refs['my-modal'].hide();
    },
    getCategories: function getCategories() {
      var _this11 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/categories/active').then(function (response) {
        _this11.isLoading = false;
        _this11.categories = response.data.data;
      })["catch"](function (error) {
        _this11.isLoading = false;
        if (error.request.statusText) {
          _this11.showError(error.request.statusText);
        } else if (error.message) {
          _this11.showError(error.message);
        } else {
          _this11.showError(__('something_went_wrong'));
        }
      });
    },
    getProducts: function getProducts() {
      var _this12 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/products/active').then(function (response) {
        _this12.isLoading = false;
        _this12.products = response.data.data;
      })["catch"](function (error) {
        _this12.isLoading = false;
        if (error.request.statusText) {
          _this12.showError(error.request.statusText);
        } else if (error.message) {
          _this12.showError(error.message);
        } else {
          _this12.showError(__('something_went_wrong'));
        }
      });
    },
    dropFile: function dropFile(event) {
      event.preventDefault();
      var files = event.dataTransfer.files;
      if (!files || !files.length) return;
      var file = files[0];
      this.section.banner_app = file;
      this.section.banner_app_url = URL.createObjectURL(file);
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleFileUploadBannerApp: function handleFileUploadBannerApp(event) {
      var _event$target;
      var files = event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.files;
      if (!files || !files.length) return;
      var file = files[0];
      this.section.error = null;
      var validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
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
    },
    dropFileWeb: function dropFileWeb(event) {
      event.preventDefault();
      var files = event.dataTransfer.files;
      if (!files || !files.length) return;
      var file = files[0];
      this.section.banner_web = file;
      this.section.banner_web_url = URL.createObjectURL(file);
    },
    handleFileUploadBannerWeb: function handleFileUploadBannerWeb(event) {
      var _event$target2;
      var files = event === null || event === void 0 ? void 0 : (_event$target2 = event.target) === null || _event$target2 === void 0 ? void 0 : _event$target2.files;
      if (!files || !files.length) return;
      var file = files[0];
      this.section.error_web = null;
      var validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
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
    saveRecord: function saveRecord() {
      var _this13 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var isUpdate, sectionId, langsToSave, _iterator, _step, _loop, _ret, message;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (_this13.validateDefaultLanguage()) {
                  _context2.next = 2;
                  break;
                }
                return _context2.abrupt("return");
              case 2:
                isUpdate = !!_this13.section.id;
                _this13.isLoading = true;
                sectionId = _this13.section.id;
                _context2.prev = 5;
                langsToSave = [].concat(_toConsumableArray(_this13.languages.filter(function (l) {
                  return l.is_default;
                })), _toConsumableArray(_this13.languages.filter(function (l) {
                  return !l.is_default;
                })));
                _iterator = _createForOfIteratorHelper(langsToSave);
                _context2.prev = 8;
                _loop = /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _loop() {
                  var _res$data2, _res$data2$data;
                  var lang, t, fd, url, res, _res$data;
                  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _loop$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          lang = _step.value;
                          t = _this13.translations[lang.id];
                          if (!(!lang.is_default && !t.title && !t.short_description)) {
                            _context.next = 4;
                            break;
                          }
                          return _context.abrupt("return", "continue");
                        case 4:
                          fd = new FormData();
                          if (sectionId) fd.append('id', sectionId);
                          fd.append('language_id', lang.id);
                          fd.append('title', t.title);
                          fd.append('short_description', t.short_description);
                          if (lang.is_default) {
                            fd.append('product_type', _this13.section.product_type || '');
                            fd.append('position', _this13.section.position || '');
                            fd.append('background_color_for_light_theme', _this13.section.background_color_for_light_theme || '');
                            fd.append('background_color_for_dark_theme', _this13.section.background_color_for_dark_theme || '');
                            fd.append('style_app', _this13.section.style_app || 'style_1');
                            fd.append('style_web', _this13.section.style_web || 'style_1');
                            if (Array.isArray(_this13.section.category_ids)) {
                              _this13.section.category_ids.forEach(function (id) {
                                fd.append('category_ids[]', id);
                              });
                            }
                            if (Array.isArray(_this13.section.product_ids)) {
                              _this13.section.product_ids.forEach(function (id) {
                                fd.append('product_ids[]', id);
                              });
                            }
                            if (_this13.section.banner_app instanceof File) {
                              fd.append('banner_app', _this13.section.banner_app);
                            }
                            if (_this13.section.banner_web instanceof File) {
                              fd.append('banner_web', _this13.section.banner_web);
                            }
                          }
                          url = sectionId ? _this13.$apiUrl + '/sections/update' : _this13.$apiUrl + '/sections/save';
                          _context.next = 13;
                          return axios__WEBPACK_IMPORTED_MODULE_1___default().post(url, fd, {
                            headers: {
                              'Content-Type': 'multipart/form-data'
                            }
                          });
                        case 13:
                          res = _context.sent;
                          if (!(!res.data || res.data.status !== 1)) {
                            _context.next = 16;
                            break;
                          }
                          throw new Error(((_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.message) || __('something_went_wrong'));
                        case 16:
                          if (!sectionId && (_res$data2 = res.data) !== null && _res$data2 !== void 0 && (_res$data2$data = _res$data2.data) !== null && _res$data2$data !== void 0 && _res$data2$data.id) {
                            sectionId = res.data.data.id;
                          }
                        case 17:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _loop);
                });
                _iterator.s();
              case 11:
                if ((_step = _iterator.n()).done) {
                  _context2.next = 18;
                  break;
                }
                return _context2.delegateYield(_loop(), "t0", 13);
              case 13:
                _ret = _context2.t0;
                if (!(_ret === "continue")) {
                  _context2.next = 16;
                  break;
                }
                return _context2.abrupt("continue", 16);
              case 16:
                _context2.next = 11;
                break;
              case 18:
                _context2.next = 23;
                break;
              case 20:
                _context2.prev = 20;
                _context2.t1 = _context2["catch"](8);
                _iterator.e(_context2.t1);
              case 23:
                _context2.prev = 23;
                _iterator.f();
                return _context2.finish(23);
              case 26:
                message = isUpdate ? __('section_updated_successfully') || 'Section updated successfully' : __('section_saved_successfully') || 'Section saved successfully';
                _this13.$eventBus.$emit('sectionSaved', message);
                _this13.hideModal();
                _context2.next = 34;
                break;
              case 31:
                _context2.prev = 31;
                _context2.t2 = _context2["catch"](5);
                _this13.showError(_context2.t2.message || __('something_went_wrong'));
              case 34:
                _context2.prev = 34;
                _this13.isLoading = false;
                return _context2.finish(34);
              case 37:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, null, [[5, 31, 34, 37], [8, 20, 23, 26]]);
      }))();
    },
    addCategoryTag: function addCategoryTag(newTag) {
      var tag = {
        name: newTag
      };
      this.categories_ids.push(tag);
    }
  },
  mounted: function mounted() {
    var _this14 = this;
    this.showModal();
    this.fetchLanguages().then(function () {
      // Load section data if id exists
      if (_this14.section.id) {
        _this14.loadSection();
      }
    });
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Sections.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Sections.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit */ "./resources/js/views/Sections/Edit.vue");
/* harmony import */ var fslightbox_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fslightbox-vue */ "./node_modules/fslightbox-vue/index.js");
/* harmony import */ var fslightbox_vue__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fslightbox_vue__WEBPACK_IMPORTED_MODULE_1__);
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



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    'app-edit-record': _Edit__WEBPACK_IMPORTED_MODULE_0__["default"],
    FsLightbox: (fslightbox_vue__WEBPACK_IMPORTED_MODULE_1___default())
  },
  data: function data() {
    return {
      fields: [{
        key: 'id',
        label: __('id'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'title',
        label: __('title'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'short_description',
        label: __('short_description'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'style',
        label: 'Style',
        "class": 'text-center'
      }, {
        key: 'product_type',
        label: __('product_type'),
        "class": 'text-center'
      }, {
        key: 'category_ids',
        label: __('category_ids'),
        "class": 'text-center'
      }, {
        key: 'position',
        label: __('position'),
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
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      page: 1,
      isLoading: false,
      sectionStyle: 'style_1',
      max_visible_units: 12,
      max_col_in_single_row: 3,
      create_new: null,
      edit_record: null,
      sections: [],
      toggler: false,
      lightboxSources: [],
      slide: 1,
      currentLanguageId: null,
      activeLanguages: []
    };
  },
  computed: {
    translatedSections: function translatedSections() {
      var _this = this;
      if (!this.currentLanguageId || this.sections.length === 0) {
        return this.sections;
      }
      return this.sections.map(function (section) {
        var translatedSection = _objectSpread({}, section);

        // Get main table data for fallback
        var mainTitle = section.title || '';
        var mainShortDescription = section.short_description || '';

        // Try to get translation for current language
        if (section.translations && Array.isArray(section.translations) && section.translations.length > 0) {
          var translation = section.translations.find(function (t) {
            return t.language_id === _this.currentLanguageId;
          });
          if (translation) {
            // Use translation if it exists and has value
            if (translation.title && translation.title.trim() !== '') {
              translatedSection.title = translation.title;
            }
            if (translation.short_description && translation.short_description.trim() !== '') {
              translatedSection.short_description = translation.short_description;
            }
          }
        }

        // Fallback: If no translation found or translation is empty, use main table data
        if (!translatedSection.title || translatedSection.title.trim() === '') {
          translatedSection.title = mainTitle;
        }
        if (!translatedSection.short_description || translatedSection.short_description.trim() === '') {
          translatedSection.short_description = mainShortDescription;
        }
        return translatedSection;
      });
    },
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
    this.totalRows = this.sections.length;
  },
  watch: {
    $route: function $route(to, from) {
      this.showCreateModal();
    }
  },
  created: function created() {
    var _this2 = this;
    this.showCreateModal();
    this.$eventBus.$on('sectionSaved', function (message) {
      _this2.showMessage("success", message);
      _this2.getSections();
      _this2.create_new = null;
    });
    this.fetchActiveLanguages().then(function () {
      _this2.getSections();
    });
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      return axios.get(this.$apiUrl + '/active_languages').then(function (response) {
        if (response.data.data && Array.isArray(response.data.data)) {
          _this3.activeLanguages = response.data.data;
          var appLocale = window.appLocale || 'en';
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
    openLightbox: function openLightbox(image) {
      this.lightboxSources = [image];
      this.toggler = !this.toggler;
    },
    handleClose: function handleClose() {
      this.lightboxSources = null;
      this.toggler = false;
    },
    handleSectionSaved: function handleSectionSaved(message) {
      this.showMessage('success', message);
      this.getSections();
      this.create_new = false;
      this.edit_record = null;
    },
    getSections: function getSections() {
      var _this4 = this;
      this.isLoading = true;
      axios.get(this.$apiUrl + '/sections').then(function (response) {
        _this4.isLoading = false;
        _this4.sections = response.data.data;
        _this4.totalRows = _this4.sections.length;
      })["catch"](function (error) {
        _this4.isLoading = false;
        var msg = __('something_went_wrong');
        if (error.response && error.response.data && error.response.data.message) {
          msg = error.response.data.message;
        } else if (error.message) {
          msg = error.message;
        }
        _this4.showError(msg);
      });
    },
    deleteSection: function deleteSection(index, id) {
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
          axios.post(_this5.$apiUrl + '/sections/delete', postData).then(function (response) {
            _this5.isLoading = false;
            _this5.sections.splice(index, 1);
            _this5.showMessage('success', response.data.message);
          })["catch"](function (error) {
            _this5.isLoading = false;
            var msg = __('something_went_wrong');
            if (error.response && error.response.data && error.response.data.message) {
              msg = error.response.data.message;
            } else if (error.message) {
              msg = error.message;
            }
            _this5.showError(msg);
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
      if (this.$route.path !== '/sections') {
        this.$router.push({
          path: '/sections'
        });
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.$eventBus.$off('sectionSaved');
  }
});

/***/ }),

/***/ "./resources/js/mixins/TranslationHelper.js":
/*!**************************************************!*\
  !*** ./resources/js/mixins/TranslationHelper.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.select2-search__field input[type=search][data-v-3572115c] {\n    width: 5000px !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_3572115c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_3572115c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_3572115c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sections/Edit.vue":
/*!**********************************************!*\
  !*** ./resources/js/views/Sections/Edit.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue_vue_type_template_id_3572115c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=3572115c&scoped=true */ "./resources/js/views/Sections/Edit.vue?vue&type=template&id=3572115c&scoped=true");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js */ "./resources/js/views/Sections/Edit.vue?vue&type=script&lang=js");
/* harmony import */ var _Edit_vue_vue_type_style_index_0_id_3572115c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css */ "./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_3572115c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Edit_vue_vue_type_template_id_3572115c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "3572115c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sections/Edit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sections/Sections.vue":
/*!**************************************************!*\
  !*** ./resources/js/views/Sections/Sections.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Sections_vue_vue_type_template_id_490e3b00__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Sections.vue?vue&type=template&id=490e3b00 */ "./resources/js/views/Sections/Sections.vue?vue&type=template&id=490e3b00");
/* harmony import */ var _Sections_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Sections.vue?vue&type=script&lang=js */ "./resources/js/views/Sections/Sections.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Sections_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Sections_vue_vue_type_template_id_490e3b00__WEBPACK_IMPORTED_MODULE_0__.render,
  _Sections_vue_vue_type_template_id_490e3b00__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sections/Sections.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sections/Edit.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/views/Sections/Edit.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sections/Sections.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/views/Sections/Sections.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Sections_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Sections.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Sections.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Sections_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_3572115c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=style&index=0&id=3572115c&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sections/Edit.vue?vue&type=template&id=3572115c&scoped=true":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/Sections/Edit.vue?vue&type=template&id=3572115c&scoped=true ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_3572115c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_3572115c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_3572115c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=template&id=3572115c&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=template&id=3572115c&scoped=true");


/***/ }),

/***/ "./resources/js/views/Sections/Sections.vue?vue&type=template&id=490e3b00":
/*!********************************************************************************!*\
  !*** ./resources/js/views/Sections/Sections.vue?vue&type=template&id=490e3b00 ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Sections_vue_vue_type_template_id_490e3b00__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Sections_vue_vue_type_template_id_490e3b00__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Sections_vue_vue_type_template_id_490e3b00__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Sections.vue?vue&type=template&id=490e3b00 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Sections.vue?vue&type=template&id=490e3b00");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=template&id=3572115c&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Edit.vue?vue&type=template&id=3572115c&scoped=true ***!
  \*******************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
        size: "xxl",
        scrollable: "",
        "no-close-on-backdrop": "",
        "no-fade": "",
        static: "",
        id: "mymodal",
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
          _vm.languages.length > 0
            ? _c(
                "b-tabs",
                {
                  key: _vm.tabsKey,
                  attrs: { "content-class": "mt-3" },
                  model: {
                    value: _vm.activeLanguageTab,
                    callback: function ($$v) {
                      _vm.activeLanguageTab = $$v
                    },
                    expression: "activeLanguageTab",
                  },
                },
                [
                  _vm._l(_vm.languages, function (lang) {
                    return lang.is_default
                      ? _c(
                          "b-tab",
                          {
                            key: lang.id,
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
                                              lang.is_default,
                                          },
                                        },
                                        [
                                          _vm._v(
                                            "\n                        " +
                                              _vm._s(lang.name) +
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
                            lang.is_default && _vm.languages.length > 1
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
                                            return _vm.translateEmpty(lang)
                                          },
                                        },
                                      },
                                      [
                                        !_vm.loadingEmpty
                                          ? _c("span", [
                                              _vm._v(
                                                _vm._s(
                                                  _vm.__(
                                                    "translate_empty_fields"
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
                                            return _vm.translateOverwrite(lang)
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
                            _vm.translations[lang.id]
                              ? _c("div", [
                                  _c("div", { staticClass: "form-group" }, [
                                    _c("label", [
                                      _vm._v(
                                        _vm._s(_vm.__("title_for_section"))
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    lang.is_default
                                      ? _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value:
                                            _vm.translations[lang.id].title,
                                          expression:
                                            "translations[lang.id].title",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        required: lang.is_default
                                          ? true
                                          : undefined,
                                      },
                                      domProps: {
                                        value: _vm.translations[lang.id].title,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.translations[lang.id],
                                            "title",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "form-group" }, [
                                    _c("label", [
                                      _vm._v(
                                        _vm._s(_vm.__("short_descrption"))
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    lang.is_default
                                      ? _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value:
                                            _vm.translations[lang.id]
                                              .short_description,
                                          expression:
                                            "translations[lang.id].short_description",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        required: lang.is_default
                                          ? true
                                          : undefined,
                                      },
                                      domProps: {
                                        value:
                                          _vm.translations[lang.id]
                                            .short_description,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.translations[lang.id],
                                            "short_description",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "row" }, [
                                    _c(
                                      "div",
                                      { staticClass: "form-group" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(_vm.__("category_ids"))
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("Select2", {
                                          attrs: {
                                            placeholder:
                                              _vm.__("select_categories"),
                                            options: _vm.categories_options,
                                            disabled:
                                              _vm.section.product_type ===
                                              "recently_visited_products",
                                            settings: {
                                              multiple: "multiple",
                                              width: "100%",
                                              dropdownParent: "#mymodal",
                                            },
                                          },
                                          model: {
                                            value: _vm.section.category_ids,
                                            callback: function ($$v) {
                                              _vm.$set(
                                                _vm.section,
                                                "category_ids",
                                                $$v
                                              )
                                            },
                                            expression: "section.category_ids",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-3" },
                                      [
                                        _c(
                                          "label",
                                          { attrs: { for: "product_type" } },
                                          [
                                            _vm._v(
                                              " " +
                                                _vm._s(_vm.__("product_types"))
                                            ),
                                          ]
                                        ),
                                        _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "select",
                                          {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.section.product_type,
                                                expression:
                                                  "section.product_type",
                                              },
                                            ],
                                            staticClass:
                                              "form-control form-select",
                                            attrs: {
                                              name: "product_type",
                                              id: "product_type",
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
                                                _vm.$set(
                                                  _vm.section,
                                                  "product_type",
                                                  $event.target.multiple
                                                    ? $$selectedVal
                                                    : $$selectedVal[0]
                                                )
                                              },
                                            },
                                          },
                                          [
                                            _c(
                                              "option",
                                              { attrs: { value: "" } },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__(
                                                        "select_product_type"
                                                      )
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value: "all_products",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__("all_products")
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value: "new_added_products",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__(
                                                        "new_added_products"
                                                      )
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value: "products_on_sale",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__("products_on_sale")
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value:
                                                    "most_selling_products",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__(
                                                      "most_selling_products"
                                                    )
                                                  )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value: "custom_products",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__("custom_products")
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value:
                                                    "recently_visited_products",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__(
                                                        "recently_visited_products"
                                                      )
                                                    ) +
                                                    "\n                                "
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-3" },
                                      [
                                        _c(
                                          "label",
                                          { attrs: { for: "position" } },
                                          [
                                            _vm._v(
                                              " " + _vm._s(_vm.__("position"))
                                            ),
                                          ]
                                        ),
                                        _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "select",
                                          {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.section.position,
                                                expression: "section.position",
                                              },
                                            ],
                                            staticClass:
                                              "form-control form-select",
                                            attrs: {
                                              name: "position",
                                              id: "position",
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
                                                _vm.$set(
                                                  _vm.section,
                                                  "position",
                                                  $event.target.multiple
                                                    ? $$selectedVal
                                                    : $$selectedVal[0]
                                                )
                                              },
                                            },
                                          },
                                          [
                                            _c(
                                              "option",
                                              { attrs: { value: "" } },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__("select_position")
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              { attrs: { value: "top" } },
                                              [
                                                _vm._v(
                                                  " " + _vm._s(_vm.__("top"))
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value: "below_slider",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__("below_slider")
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value: "below_category",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__("below_category")
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value: "below_shop_by_seller",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__(
                                                      "below_shop_by_seller"
                                                    )
                                                  )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value:
                                                    "below_shop_by_country_of_origin",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__(
                                                        "below_shop_by_country_of_origin"
                                                      )
                                                    )
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "option",
                                              {
                                                attrs: {
                                                  value:
                                                    "custom_below_shop_by_brands",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__(
                                                        "below_shop_by_brands"
                                                      )
                                                    ) +
                                                    "\n                                "
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-3" },
                                      [
                                        _c(
                                          "label",
                                          {
                                            attrs: {
                                              for: "background color (Light theme)",
                                            },
                                          },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__(
                                                  "background_color_for_light_theme"
                                                )
                                              )
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "b-input-group",
                                          {
                                            staticClass: "mb-2",
                                            attrs: { prepend: "" },
                                          },
                                          [
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value:
                                                    _vm.section
                                                      .background_color_for_light_theme,
                                                  expression:
                                                    "section.background_color_for_light_theme",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: { type: "text" },
                                              domProps: {
                                                value:
                                                  _vm.section
                                                    .background_color_for_light_theme,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.$set(
                                                    _vm.section,
                                                    "background_color_for_light_theme",
                                                    $event.target.value
                                                  )
                                                },
                                              },
                                            }),
                                            _vm._v(" "),
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value:
                                                    _vm.section
                                                      .background_color_for_light_theme,
                                                  expression:
                                                    "section.background_color_for_light_theme",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: {
                                                type: "color",
                                                id: "color",
                                                name: "color",
                                              },
                                              domProps: {
                                                value:
                                                  _vm.section
                                                    .background_color_for_light_theme,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.$set(
                                                    _vm.section,
                                                    "background_color_for_light_theme",
                                                    $event.target.value
                                                  )
                                                },
                                              },
                                            }),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group col-md-3" },
                                      [
                                        _c(
                                          "label",
                                          {
                                            attrs: {
                                              for: "background color (Dark theme)",
                                            },
                                          },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__(
                                                  "background_color_for_dark_theme"
                                                )
                                              )
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "b-input-group",
                                          {
                                            staticClass: "mb-2",
                                            attrs: { prepend: "" },
                                          },
                                          [
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value:
                                                    _vm.section
                                                      .background_color_for_dark_theme,
                                                  expression:
                                                    "section.background_color_for_dark_theme",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: { type: "text" },
                                              domProps: {
                                                value:
                                                  _vm.section
                                                    .background_color_for_dark_theme,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.$set(
                                                    _vm.section,
                                                    "background_color_for_dark_theme",
                                                    $event.target.value
                                                  )
                                                },
                                              },
                                            }),
                                            _vm._v(" "),
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value:
                                                    _vm.section
                                                      .background_color_for_dark_theme,
                                                  expression:
                                                    "section.background_color_for_dark_theme",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: {
                                                type: "color",
                                                id: "color",
                                                name: "color",
                                              },
                                              domProps: {
                                                value:
                                                  _vm.section
                                                    .background_color_for_dark_theme,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.$set(
                                                    _vm.section,
                                                    "background_color_for_dark_theme",
                                                    $event.target.value
                                                  )
                                                },
                                              },
                                            }),
                                          ]
                                        ),
                                      ],
                                      1
                                    ),
                                    _vm._v(" "),
                                    _vm.section.product_type ===
                                    "custom_products"
                                      ? _c(
                                          "div",
                                          { staticClass: "form-group" },
                                          [
                                            _c("label", [
                                              _vm._v(
                                                _vm._s(_vm.__("products"))
                                              ),
                                            ]),
                                            _vm._v(" "),
                                            _c("Select2", {
                                              attrs: {
                                                placeholder: "Select Products",
                                                options: _vm.products_options,
                                                settings: {
                                                  multiple: "multiple",
                                                  width: "100%",
                                                  dropdownParent: "#mymodal",
                                                },
                                              },
                                              model: {
                                                value: _vm.section.product_ids,
                                                callback: function ($$v) {
                                                  _vm.$set(
                                                    _vm.section,
                                                    "product_ids",
                                                    $$v
                                                  )
                                                },
                                                expression:
                                                  "section.product_ids",
                                              },
                                            }),
                                          ],
                                          1
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "col-md-6 form-group" },
                                      [
                                        _c(
                                          "div",
                                          { staticClass: "form-group row" },
                                          [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-12 col-sm-12",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "required" },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        _vm.__(
                                                          "select_style_for_app_section"
                                                        )
                                                      )
                                                    ),
                                                  ]
                                                ),
                                                _c(
                                                  "i",
                                                  {
                                                    staticClass: "text-danger",
                                                  },
                                                  [_vm._v("*")]
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "div",
                                          { staticClass: "form-group row" },
                                          [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-3 col-sm-3",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "radio-img" },
                                                  [
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.section
                                                              .style_app,
                                                          expression:
                                                            "section.style_app",
                                                        },
                                                      ],
                                                      staticClass:
                                                        "form-control",
                                                      attrs: {
                                                        type: "radio",
                                                        value: "style_1",
                                                        required: "",
                                                      },
                                                      domProps: {
                                                        checked: _vm._q(
                                                          _vm.section.style_app,
                                                          "style_1"
                                                        ),
                                                      },
                                                      on: {
                                                        change: function (
                                                          $event
                                                        ) {
                                                          return _vm.$set(
                                                            _vm.section,
                                                            "style_app",
                                                            "style_1"
                                                          )
                                                        },
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c("img", {
                                                      staticClass:
                                                        "style_image",
                                                      attrs: {
                                                        src:
                                                          _vm.$baseUrl +
                                                          "/images/app_style/App_Style_1.jpg",
                                                        alt: "style_1",
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-3 col-sm-3",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "radio-img" },
                                                  [
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.section
                                                              .style_app,
                                                          expression:
                                                            "section.style_app",
                                                        },
                                                      ],
                                                      attrs: {
                                                        type: "radio",
                                                        value: "style_2",
                                                      },
                                                      domProps: {
                                                        checked: _vm._q(
                                                          _vm.section.style_app,
                                                          "style_2"
                                                        ),
                                                      },
                                                      on: {
                                                        change: function (
                                                          $event
                                                        ) {
                                                          return _vm.$set(
                                                            _vm.section,
                                                            "style_app",
                                                            "style_2"
                                                          )
                                                        },
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c("img", {
                                                      staticClass:
                                                        "style_image",
                                                      attrs: {
                                                        src:
                                                          _vm.$baseUrl +
                                                          "/images/app_style/App_Style_2.jpg",
                                                        alt: "style_2",
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-3 col-sm-3",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "radio-img" },
                                                  [
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.section
                                                              .style_app,
                                                          expression:
                                                            "section.style_app",
                                                        },
                                                      ],
                                                      attrs: {
                                                        type: "radio",
                                                        value: "style_3",
                                                      },
                                                      domProps: {
                                                        checked: _vm._q(
                                                          _vm.section.style_app,
                                                          "style_3"
                                                        ),
                                                      },
                                                      on: {
                                                        change: function (
                                                          $event
                                                        ) {
                                                          return _vm.$set(
                                                            _vm.section,
                                                            "style_app",
                                                            "style_3"
                                                          )
                                                        },
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c("img", {
                                                      staticClass:
                                                        "style_image",
                                                      attrs: {
                                                        src:
                                                          _vm.$baseUrl +
                                                          "/images/app_style/App_Style_3.jpg",
                                                        alt: "style_3",
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-3 col-sm-3",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "radio-img" },
                                                  [
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.section
                                                              .style_app,
                                                          expression:
                                                            "section.style_app",
                                                        },
                                                      ],
                                                      attrs: {
                                                        type: "radio",
                                                        value: "style_4",
                                                      },
                                                      domProps: {
                                                        checked: _vm._q(
                                                          _vm.section.style_app,
                                                          "style_4"
                                                        ),
                                                      },
                                                      on: {
                                                        change: function (
                                                          $event
                                                        ) {
                                                          return _vm.$set(
                                                            _vm.section,
                                                            "style_app",
                                                            "style_4"
                                                          )
                                                        },
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c("img", {
                                                      staticClass:
                                                        "style_image",
                                                      attrs: {
                                                        src:
                                                          _vm.$baseUrl +
                                                          "/images/app_style/App_Style_4.jpg",
                                                        alt: "style_4",
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _vm.section.style_app === "style_4"
                                          ? _c(
                                              "div",
                                              { staticClass: "form-group" },
                                              [
                                                _c(
                                                  "label",
                                                  {
                                                    attrs: {
                                                      for: "banner_app",
                                                    },
                                                  },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        _vm.__("banner_image")
                                                      )
                                                    ),
                                                    _c(
                                                      "i",
                                                      {
                                                        staticClass:
                                                          "text-danger",
                                                      },
                                                      [_vm._v("*")]
                                                    ),
                                                  ]
                                                ),
                                                _vm._v(" "),
                                                _vm.section.error
                                                  ? _c(
                                                      "span",
                                                      { staticClass: "error" },
                                                      [
                                                        _vm._v(
                                                          _vm._s(
                                                            _vm.section.error
                                                          )
                                                        ),
                                                      ]
                                                    )
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                _c("input", {
                                                  ref:
                                                    "file_banner_app_" +
                                                    lang.id,
                                                  refInFor: true,
                                                  staticClass: "file-input",
                                                  attrs: {
                                                    type: "file",
                                                    name: "banner_app",
                                                    accept: "image/*",
                                                    id: "banner_app",
                                                  },
                                                  on: {
                                                    change:
                                                      _vm.handleFileUploadBannerApp,
                                                  },
                                                }),
                                                _vm._v(" "),
                                                _c(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "file-input-div bg-gray-100",
                                                    on: {
                                                      click: function ($event) {
                                                        return _vm.triggerBannerAppUpload(
                                                          lang.id
                                                        )
                                                      },
                                                      drop: _vm.dropFile,
                                                      dragover:
                                                        _vm.$dragoverFile,
                                                      dragleave:
                                                        _vm.$dragleaveFile,
                                                    },
                                                  },
                                                  [
                                                    _vm.section.banner_app &&
                                                    _vm.section.banner_app
                                                      .name !== ""
                                                      ? [
                                                          _c("label", [
                                                            _vm._v(
                                                              " " +
                                                                _vm._s(
                                                                  _vm.__(
                                                                    "selected_file_name"
                                                                  )
                                                                ) +
                                                                " " +
                                                                _vm._s(
                                                                  _vm.section
                                                                    .banner_app
                                                                    .name
                                                                )
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
                                                _vm.section.banner_app_url
                                                  ? _c(
                                                      "div",
                                                      { staticClass: "row" },
                                                      [
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "col-md-2",
                                                          },
                                                          [
                                                            _c("img", {
                                                              staticClass:
                                                                "custom-image",
                                                              attrs: {
                                                                src: _vm.section
                                                                  .banner_app_url,
                                                                title:
                                                                  "Offer Image",
                                                                alt: "Offer Image",
                                                              },
                                                            }),
                                                          ]
                                                        ),
                                                      ]
                                                    )
                                                  : _vm._e(),
                                              ]
                                            )
                                          : _vm._e(),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "col-md-6 form-group" },
                                      [
                                        _c(
                                          "div",
                                          { staticClass: "form-group row" },
                                          [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-12 col-sm-12",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "required" },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        _vm.__(
                                                          "select_style_for_web_section"
                                                        )
                                                      )
                                                    ),
                                                  ]
                                                ),
                                                _c(
                                                  "i",
                                                  {
                                                    staticClass: "text-danger",
                                                  },
                                                  [_vm._v("*")]
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "div",
                                          { staticClass: "form-group row" },
                                          [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-3 col-sm-3",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "radio-img" },
                                                  [
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.section
                                                              .style_web,
                                                          expression:
                                                            "section.style_web",
                                                        },
                                                      ],
                                                      staticClass:
                                                        "form-control",
                                                      attrs: {
                                                        type: "radio",
                                                        value: "style_1",
                                                        required: "",
                                                      },
                                                      domProps: {
                                                        checked: _vm._q(
                                                          _vm.section.style_web,
                                                          "style_1"
                                                        ),
                                                      },
                                                      on: {
                                                        change: function (
                                                          $event
                                                        ) {
                                                          return _vm.$set(
                                                            _vm.section,
                                                            "style_web",
                                                            "style_1"
                                                          )
                                                        },
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c("img", {
                                                      staticClass:
                                                        "style_image",
                                                      attrs: {
                                                        src:
                                                          _vm.$baseUrl +
                                                          "/images/web_style/Web_Style_1.jpg",
                                                        alt: "style_1",
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-3 col-sm-3",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "radio-img" },
                                                  [
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.section
                                                              .style_web,
                                                          expression:
                                                            "section.style_web",
                                                        },
                                                      ],
                                                      attrs: {
                                                        type: "radio",
                                                        value: "style_2",
                                                      },
                                                      domProps: {
                                                        checked: _vm._q(
                                                          _vm.section.style_web,
                                                          "style_2"
                                                        ),
                                                      },
                                                      on: {
                                                        change: function (
                                                          $event
                                                        ) {
                                                          return _vm.$set(
                                                            _vm.section,
                                                            "style_web",
                                                            "style_2"
                                                          )
                                                        },
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c("img", {
                                                      staticClass:
                                                        "style_image",
                                                      attrs: {
                                                        src:
                                                          _vm.$baseUrl +
                                                          "/images/web_style/Web_Style_2.jpg",
                                                        alt: "style_2",
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-3 col-sm-3",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "radio-img" },
                                                  [
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.section
                                                              .style_web,
                                                          expression:
                                                            "section.style_web",
                                                        },
                                                      ],
                                                      attrs: {
                                                        type: "radio",
                                                        value: "style_3",
                                                      },
                                                      domProps: {
                                                        checked: _vm._q(
                                                          _vm.section.style_web,
                                                          "style_3"
                                                        ),
                                                      },
                                                      on: {
                                                        change: function (
                                                          $event
                                                        ) {
                                                          return _vm.$set(
                                                            _vm.section,
                                                            "style_web",
                                                            "style_3"
                                                          )
                                                        },
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c("img", {
                                                      staticClass:
                                                        "style_image",
                                                      attrs: {
                                                        src:
                                                          _vm.$baseUrl +
                                                          "/images/web_style/Web_Style_3.jpg",
                                                        alt: "style_3",
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-3 col-sm-3",
                                              },
                                              [
                                                _c(
                                                  "label",
                                                  { staticClass: "radio-img" },
                                                  [
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.section
                                                              .style_web,
                                                          expression:
                                                            "section.style_web",
                                                        },
                                                      ],
                                                      attrs: {
                                                        type: "radio",
                                                        value: "style_4",
                                                      },
                                                      domProps: {
                                                        checked: _vm._q(
                                                          _vm.section.style_web,
                                                          "style_4"
                                                        ),
                                                      },
                                                      on: {
                                                        change: function (
                                                          $event
                                                        ) {
                                                          return _vm.$set(
                                                            _vm.section,
                                                            "style_web",
                                                            "style_4"
                                                          )
                                                        },
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c("img", {
                                                      staticClass:
                                                        "style_image",
                                                      attrs: {
                                                        src:
                                                          _vm.$baseUrl +
                                                          "/images/web_style/Web_Style_4.jpg",
                                                        alt: "style_4",
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _vm.section.style_web === "style_4"
                                          ? _c(
                                              "div",
                                              { staticClass: "form-group row" },
                                              [
                                                _c(
                                                  "div",
                                                  { staticClass: "col-md-12" },
                                                  [
                                                    _c(
                                                      "label",
                                                      {
                                                        attrs: {
                                                          for: "banner_web",
                                                        },
                                                      },
                                                      [
                                                        _vm._v(
                                                          " " +
                                                            _vm._s(
                                                              _vm.__(
                                                                "banner_image"
                                                              )
                                                            )
                                                        ),
                                                        _c(
                                                          "i",
                                                          {
                                                            staticClass:
                                                              "text-danger",
                                                          },
                                                          [_vm._v("*")]
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _vm.section.error_web
                                                      ? _c(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "error",
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.section
                                                                  .error_web
                                                              )
                                                            ),
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                    _vm._v(" "),
                                                    _c("input", {
                                                      ref:
                                                        "file_banner_web_" +
                                                        lang.id,
                                                      refInFor: true,
                                                      staticClass: "file-input",
                                                      attrs: {
                                                        type: "file",
                                                        name: "banner_web",
                                                        accept: "image/*",
                                                        id: "banner_web",
                                                      },
                                                      on: {
                                                        change:
                                                          _vm.handleFileUploadBannerWeb,
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "file-input-div bg-gray-100 mt-2",
                                                        on: {
                                                          click: function (
                                                            $event
                                                          ) {
                                                            return _vm.triggerBannerWebUpload(
                                                              lang.id
                                                            )
                                                          },
                                                          drop: _vm.dropFileWeb,
                                                          dragover:
                                                            _vm.$dragoverFile,
                                                          dragleave:
                                                            _vm.$dragleaveFile,
                                                        },
                                                      },
                                                      [
                                                        _vm.section
                                                          .banner_web &&
                                                        _vm.section.banner_web
                                                          .name !== ""
                                                          ? [
                                                              _c("label", [
                                                                _vm._v(
                                                                  " " +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "selected_file_name"
                                                                      )
                                                                    ) +
                                                                    " " +
                                                                    _vm._s(
                                                                      _vm
                                                                        .section
                                                                        .banner_web
                                                                        .name
                                                                    )
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
                                                    _vm.section.banner_web_url
                                                      ? _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "row mt-2",
                                                          },
                                                          [
                                                            _c(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "col-md-2",
                                                              },
                                                              [
                                                                _c("img", {
                                                                  staticClass:
                                                                    "custom-image",
                                                                  attrs: {
                                                                    src: _vm
                                                                      .section
                                                                      .banner_web_url,
                                                                    title:
                                                                      "Banner Web Image",
                                                                    alt: "Banner Web Image",
                                                                  },
                                                                }),
                                                              ]
                                                            ),
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                  ]
                                                ),
                                              ]
                                            )
                                          : _vm._e(),
                                      ]
                                    ),
                                  ]),
                                ])
                              : _vm._e(),
                          ]
                        )
                      : _vm._e()
                  }),
                  _vm._v(" "),
                  _vm._l(_vm.languages, function (lang) {
                    return !lang.is_default
                      ? _c(
                          "b-tab",
                          {
                            key: lang.id,
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "title",
                                  fn: function () {
                                    return [
                                      _c("span", [
                                        _vm._v(
                                          "\n                        " +
                                            _vm._s(lang.name) +
                                            "\n                    "
                                        ),
                                      ]),
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
                            _vm.translations[lang.id]
                              ? _c("div", [
                                  _c("div", { staticClass: "form-group" }, [
                                    _c("label", [
                                      _vm._v(
                                        _vm._s(_vm.__("title_for_section"))
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    lang.is_default
                                      ? _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value:
                                            _vm.translations[lang.id].title,
                                          expression:
                                            "translations[lang.id].title",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        required: lang.is_default
                                          ? true
                                          : undefined,
                                      },
                                      domProps: {
                                        value: _vm.translations[lang.id].title,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.translations[lang.id],
                                            "title",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "form-group" }, [
                                    _c("label", [
                                      _vm._v(
                                        _vm._s(_vm.__("short_descrption"))
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    lang.is_default
                                      ? _c(
                                          "i",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value:
                                            _vm.translations[lang.id]
                                              .short_description,
                                          expression:
                                            "translations[lang.id].short_description",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        required: lang.is_default
                                          ? true
                                          : undefined,
                                      },
                                      domProps: {
                                        value:
                                          _vm.translations[lang.id]
                                            .short_description,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.translations[lang.id],
                                            "short_description",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ]),
                                ])
                              : _vm._e(),
                          ]
                        )
                      : _vm._e()
                  }),
                ],
                2
              )
            : _vm._e(),
          _vm._v(" "),
          _c("button", {
            ref: "dummy_submit",
            staticStyle: { display: "none" },
            attrs: { formnovalidate: "" },
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Sections.vue?vue&type=template&id=490e3b00":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sections/Sections.vue?vue&type=template&id=490e3b00 ***!
  \***********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
          _vm._v(_vm._s(_vm.__("featured_sections_of_app"))),
        ]),
        _vm._v(" "),
        _vm.$can("featured_section_create")
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
                _c("span", [_vm._v(_vm._s(_vm.__("add")))]),
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
                  return _vm.getSections()
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
                items: _vm.translatedSections,
                fields: _vm.fields,
                "current-page": _vm.currentPage,
                "per-page": _vm.perPage,
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
                  key: "cell(style)",
                  fn: function (row) {
                    return [
                      _c("div", [
                        row.item.style_app
                          ? _c(
                              "div",
                              [
                                _c("strong", [
                                  _vm._v(_vm._s(_vm.__("App Style:"))),
                                ]),
                                _vm._v(" "),
                                row.item.style_app === "style_1"
                                  ? _c("img", {
                                      attrs: {
                                        src:
                                          _vm.$baseUrl +
                                          "/images/app_style/App_Style_1.jpg",
                                        alt: "App Style 1",
                                        height: "70",
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.openLightbox(
                                            _vm.$baseUrl +
                                              "/images/app_style/App_Style_1.jpg"
                                          )
                                        },
                                      },
                                    })
                                  : _vm._e(),
                                _vm._v(" "),
                                row.item.style_app === "style_2"
                                  ? _c("img", {
                                      attrs: {
                                        src:
                                          _vm.$baseUrl +
                                          "/images/app_style/App_Style_2.jpg",
                                        alt: "App Style 2",
                                        height: "70",
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.openLightbox(
                                            _vm.$baseUrl +
                                              "/images/app_style/App_Style_2.jpg"
                                          )
                                        },
                                      },
                                    })
                                  : _vm._e(),
                                _vm._v(" "),
                                row.item.style_app === "style_3"
                                  ? _c("img", {
                                      attrs: {
                                        src:
                                          _vm.$baseUrl +
                                          "/images/app_style/App_Style_3.jpg",
                                        alt: "App Style 3",
                                        height: "70",
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.openLightbox(
                                            _vm.$baseUrl +
                                              "/images/app_style/App_Style_3.jpg"
                                          )
                                        },
                                      },
                                    })
                                  : _vm._e(),
                                _vm._v(" "),
                                row.item.style_app === "style_4"
                                  ? _c("img", {
                                      attrs: {
                                        src:
                                          _vm.$baseUrl +
                                          "/images/app_style/App_Style_4.jpg",
                                        alt: "App Style 4",
                                        width: "70",
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.openLightbox(
                                            _vm.$baseUrl +
                                              "/images/app_style/App_Style_4.jpg"
                                          )
                                        },
                                      },
                                    })
                                  : _vm._e(),
                                _vm._v(" "),
                                _c("FsLightbox", {
                                  attrs: {
                                    toggler: _vm.toggler,
                                    sources: _vm.lightboxSources,
                                    onClose: _vm.handleClose,
                                  },
                                }),
                                _vm._v(" "),
                                _c("br"),
                                _c("br"),
                              ],
                              1
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        row.item.style_web
                          ? _c("div", [
                              _c("strong", [
                                _vm._v(_vm._s(_vm.__("Web Style:"))),
                              ]),
                              _vm._v(" "),
                              row.item.style_web === "style_1"
                                ? _c("img", {
                                    attrs: {
                                      src:
                                        _vm.$baseUrl +
                                        "/images/web_style/Web_Style_1.jpg",
                                      alt: "Web Style 1",
                                      height: "70",
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.openLightbox(
                                          _vm.$baseUrl +
                                            "/images/web_style/Web_Style_1.jpg"
                                        )
                                      },
                                    },
                                  })
                                : _vm._e(),
                              _vm._v(" "),
                              row.item.style_web === "style_2"
                                ? _c("img", {
                                    attrs: {
                                      src:
                                        _vm.$baseUrl +
                                        "/images/web_style/Web_Style_1.jpg",
                                      alt: "Web Style 2",
                                      height: "70",
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.openLightbox(
                                          _vm.$baseUrl +
                                            "/images/web_style/Web_Style_2.jpg"
                                        )
                                      },
                                    },
                                  })
                                : _vm._e(),
                              _vm._v(" "),
                              row.item.style_web === "style_3"
                                ? _c("img", {
                                    attrs: {
                                      src:
                                        _vm.$baseUrl +
                                        "/images/web_style/Web_Style_1.jpg",
                                      alt: "Web Style 3",
                                      height: "70",
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.openLightbox(
                                          _vm.$baseUrl +
                                            "/images/web_style/Web_Style_3.jpg"
                                        )
                                      },
                                    },
                                  })
                                : _vm._e(),
                              _vm._v(" "),
                              row.item.style_web === "style_4"
                                ? _c("img", {
                                    attrs: {
                                      src:
                                        _vm.$baseUrl +
                                        "/images/web_style/Web_Style_1.jpg",
                                      alt: "Web Style 4",
                                      width: "70",
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.openLightbox(
                                          _vm.$baseUrl +
                                            "/images/web_style/Web_Style_4.jpg"
                                        )
                                      },
                                    },
                                  })
                                : _vm._e(),
                            ])
                          : _vm._e(),
                      ]),
                    ]
                  },
                },
                {
                  key: "cell(product_type)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                    " +
                          _vm._s(row.item.product_type) +
                          "\n                    "
                      ),
                      row.item.product_type === "custom_products"
                        ? _c("div", [
                            _c("strong", [
                              _vm._v(_vm._s(_vm.__("product_ids")) + " : "),
                            ]),
                            _vm._v(
                              " " +
                                _vm._s(row.item.product_ids) +
                                "\n                    "
                            ),
                          ])
                        : _vm._e(),
                    ]
                  },
                },
                {
                  key: "cell(image)",
                  fn: function (row) {
                    return [
                      row.item.image === ""
                        ? _c("p", [_vm._v(_vm._s(_vm.__("no_image")))])
                        : _c("img", {
                            attrs: {
                              src: _vm.$storageUrl + row.item.image,
                              height: "50",
                            },
                          }),
                    ]
                  },
                },
                {
                  key: "cell(actions)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "list-actions" }, [
                        _vm.$can("featured_section_update")
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
                        _vm.$can("featured_section_delete")
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
                                    return _vm.deleteSection(
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
              saved: _vm.handleSectionSaved,
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



/***/ }),

/***/ "./node_modules/vue-multiselect/dist/vue-multiselect.min.js":
/*!******************************************************************!*\
  !*** ./node_modules/vue-multiselect/dist/vue-multiselect.min.js ***!
  \******************************************************************/
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=60)}([function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){var i=n(49)("wks"),r=n(30),o=n(0).Symbol,s="function"==typeof o;(t.exports=function(t){return i[t]||(i[t]=s&&o[t]||(s?o:r)("Symbol."+t))}).store=i},function(t,e,n){var i=n(5);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){var i=n(0),r=n(10),o=n(8),s=n(6),u=n(11),a=function(t,e,n){var l,c,f,p,h=t&a.F,d=t&a.G,v=t&a.S,g=t&a.P,y=t&a.B,m=d?i:v?i[e]||(i[e]={}):(i[e]||{}).prototype,b=d?r:r[e]||(r[e]={}),_=b.prototype||(b.prototype={});d&&(n=e);for(l in n)c=!h&&m&&void 0!==m[l],f=(c?m:n)[l],p=y&&c?u(f,i):g&&"function"==typeof f?u(Function.call,f):f,m&&s(m,l,f,t&a.U),b[l]!=f&&o(b,l,p),g&&_[l]!=f&&(_[l]=f)};i.core=r,a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,e,n){t.exports=!n(7)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var i=n(0),r=n(8),o=n(12),s=n(30)("src"),u=Function.toString,a=(""+u).split("toString");n(10).inspectSource=function(t){return u.call(t)},(t.exports=function(t,e,n,u){var l="function"==typeof n;l&&(o(n,"name")||r(n,"name",e)),t[e]!==n&&(l&&(o(n,s)||r(n,s,t[e]?""+t[e]:a.join(String(e)))),t===i?t[e]=n:u?t[e]?t[e]=n:r(t,e,n):(delete t[e],r(t,e,n)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[s]||u.call(this)})},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var i=n(13),r=n(25);t.exports=n(4)?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){var n=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n)},function(t,e,n){var i=n(14);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var i=n(2),r=n(41),o=n(29),s=Object.defineProperty;e.f=n(4)?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){t.exports={}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){"use strict";var i=n(7);t.exports=function(t,e){return!!t&&i(function(){e?t.call(null,function(){},1):t.call(null)})}},function(t,e,n){var i=n(23),r=n(16);t.exports=function(t){return i(r(t))}},function(t,e,n){var i=n(53),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0}},function(t,e,n){var i=n(11),r=n(23),o=n(28),s=n(19),u=n(64);t.exports=function(t,e){var n=1==t,a=2==t,l=3==t,c=4==t,f=6==t,p=5==t||f,h=e||u;return function(e,u,d){for(var v,g,y=o(e),m=r(y),b=i(u,d,3),_=s(m.length),x=0,w=n?h(e,_):a?h(e,0):void 0;_>x;x++)if((p||x in m)&&(v=m[x],g=b(v,x,y),t))if(n)w[x]=g;else if(g)switch(t){case 3:return!0;case 5:return v;case 6:return x;case 2:w.push(v)}else if(c)return!1;return f?-1:l||c?c:w}}},function(t,e,n){var i=n(5),r=n(0).document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var i=n(9);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}},function(t,e){t.exports=!1},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){var i=n(13).f,r=n(12),o=n(1)("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,o)&&i(t,o,{configurable:!0,value:e})}},function(t,e,n){var i=n(49)("keys"),r=n(30);t.exports=function(t){return i[t]||(i[t]=r(t))}},function(t,e,n){var i=n(16);t.exports=function(t){return Object(i(t))}},function(t,e,n){var i=n(5);t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}},function(t,e,n){"use strict";var i=n(0),r=n(12),o=n(9),s=n(67),u=n(29),a=n(7),l=n(77).f,c=n(45).f,f=n(13).f,p=n(51).trim,h=i.Number,d=h,v=h.prototype,g="Number"==o(n(44)(v)),y="trim"in String.prototype,m=function(t){var e=u(t,!1);if("string"==typeof e&&e.length>2){e=y?e.trim():p(e,3);var n,i,r,o=e.charCodeAt(0);if(43===o||45===o){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===o){switch(e.charCodeAt(1)){case 66:case 98:i=2,r=49;break;case 79:case 111:i=8,r=55;break;default:return+e}for(var s,a=e.slice(2),l=0,c=a.length;l<c;l++)if((s=a.charCodeAt(l))<48||s>r)return NaN;return parseInt(a,i)}}return+e};if(!h(" 0o1")||!h("0b1")||h("+0x1")){h=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof h&&(g?a(function(){v.valueOf.call(n)}):"Number"!=o(n))?s(new d(m(e)),n,h):m(e)};for(var b,_=n(4)?l(d):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),x=0;_.length>x;x++)r(d,b=_[x])&&!r(h,b)&&f(h,b,c(d,b));h.prototype=v,v.constructor=h,n(6)(i,"Number",h)}},function(t,e,n){"use strict";function i(t){return 0!==t&&(!(!Array.isArray(t)||0!==t.length)||!t)}function r(t){return function(){return!t.apply(void 0,arguments)}}function o(t,e){return void 0===t&&(t="undefined"),null===t&&(t="null"),!1===t&&(t="false"),-1!==t.toString().toLowerCase().indexOf(e.trim())}function s(t,e,n,i){return t.filter(function(t){return o(i(t,n),e)})}function u(t){return t.filter(function(t){return!t.$isLabel})}function a(t,e){return function(n){return n.reduce(function(n,i){return i[t]&&i[t].length?(n.push({$groupLabel:i[e],$isLabel:!0}),n.concat(i[t])):n},[])}}function l(t,e,i,r,o){return function(u){return u.map(function(u){var a;if(!u[i])return console.warn("Options passed to vue-multiselect do not contain groups, despite the config."),[];var l=s(u[i],t,e,o);return l.length?(a={},n.i(d.a)(a,r,u[r]),n.i(d.a)(a,i,l),a):[]})}}var c=n(59),f=n(54),p=(n.n(f),n(95)),h=(n.n(p),n(31)),d=(n.n(h),n(58)),v=n(91),g=(n.n(v),n(98)),y=(n.n(g),n(92)),m=(n.n(y),n(88)),b=(n.n(m),n(97)),_=(n.n(b),n(89)),x=(n.n(_),n(96)),w=(n.n(x),n(93)),S=(n.n(w),n(90)),O=(n.n(S),function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(t){return e.reduce(function(t,e){return e(t)},t)}});e.a={data:function(){return{search:"",isOpen:!1,preferredOpenDirection:"below",optimizedHeight:this.maxHeight}},props:{internalSearch:{type:Boolean,default:!0},options:{type:Array,required:!0},multiple:{type:Boolean,default:!1},value:{type:null,default:function(){return[]}},trackBy:{type:String},label:{type:String},searchable:{type:Boolean,default:!0},clearOnSelect:{type:Boolean,default:!0},hideSelected:{type:Boolean,default:!1},placeholder:{type:String,default:"Select option"},allowEmpty:{type:Boolean,default:!0},resetAfter:{type:Boolean,default:!1},closeOnSelect:{type:Boolean,default:!0},customLabel:{type:Function,default:function(t,e){return i(t)?"":e?t[e]:t}},taggable:{type:Boolean,default:!1},tagPlaceholder:{type:String,default:"Press enter to create a tag"},tagPosition:{type:String,default:"top"},max:{type:[Number,Boolean],default:!1},id:{default:null},optionsLimit:{type:Number,default:1e3},groupValues:{type:String},groupLabel:{type:String},groupSelect:{type:Boolean,default:!1},blockKeys:{type:Array,default:function(){return[]}},preserveSearch:{type:Boolean,default:!1},preselectFirst:{type:Boolean,default:!1}},mounted:function(){!this.multiple&&this.max&&console.warn("[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false."),this.preselectFirst&&!this.internalValue.length&&this.options.length&&this.select(this.filteredOptions[0])},computed:{internalValue:function(){return this.value||0===this.value?Array.isArray(this.value)?this.value:[this.value]:[]},filteredOptions:function(){var t=this.search||"",e=t.toLowerCase().trim(),n=this.options.concat();return n=this.internalSearch?this.groupValues?this.filterAndFlat(n,e,this.label):s(n,e,this.label,this.customLabel):this.groupValues?a(this.groupValues,this.groupLabel)(n):n,n=this.hideSelected?n.filter(r(this.isSelected)):n,this.taggable&&e.length&&!this.isExistingOption(e)&&("bottom"===this.tagPosition?n.push({isTag:!0,label:t}):n.unshift({isTag:!0,label:t})),n.slice(0,this.optionsLimit)},valueKeys:function(){var t=this;return this.trackBy?this.internalValue.map(function(e){return e[t.trackBy]}):this.internalValue},optionKeys:function(){var t=this;return(this.groupValues?this.flatAndStrip(this.options):this.options).map(function(e){return t.customLabel(e,t.label).toString().toLowerCase()})},currentOptionLabel:function(){return this.multiple?this.searchable?"":this.placeholder:this.internalValue.length?this.getOptionLabel(this.internalValue[0]):this.searchable?"":this.placeholder}},watch:{internalValue:function(){this.resetAfter&&this.internalValue.length&&(this.search="",this.$emit("input",this.multiple?[]:null))},search:function(){this.$emit("search-change",this.search,this.id)}},methods:{getValue:function(){return this.multiple?this.internalValue:0===this.internalValue.length?null:this.internalValue[0]},filterAndFlat:function(t,e,n){return O(l(e,n,this.groupValues,this.groupLabel,this.customLabel),a(this.groupValues,this.groupLabel))(t)},flatAndStrip:function(t){return O(a(this.groupValues,this.groupLabel),u)(t)},updateSearch:function(t){this.search=t},isExistingOption:function(t){return!!this.options&&this.optionKeys.indexOf(t)>-1},isSelected:function(t){var e=this.trackBy?t[this.trackBy]:t;return this.valueKeys.indexOf(e)>-1},isOptionDisabled:function(t){return!!t.$isDisabled},getOptionLabel:function(t){if(i(t))return"";if(t.isTag)return t.label;if(t.$isLabel)return t.$groupLabel;var e=this.customLabel(t,this.label);return i(e)?"":e},select:function(t,e){if(t.$isLabel&&this.groupSelect)return void this.selectGroup(t);if(!(-1!==this.blockKeys.indexOf(e)||this.disabled||t.$isDisabled||t.$isLabel)&&(!this.max||!this.multiple||this.internalValue.length!==this.max)&&("Tab"!==e||this.pointerDirty)){if(t.isTag)this.$emit("tag",t.label,this.id),this.search="",this.closeOnSelect&&!this.multiple&&this.deactivate();else{if(this.isSelected(t))return void("Tab"!==e&&this.removeElement(t));this.$emit("select",t,this.id),this.multiple?this.$emit("input",this.internalValue.concat([t]),this.id):this.$emit("input",t,this.id),this.clearOnSelect&&(this.search="")}this.closeOnSelect&&this.deactivate()}},selectGroup:function(t){var e=this,n=this.options.find(function(n){return n[e.groupLabel]===t.$groupLabel});if(n)if(this.wholeGroupSelected(n)){this.$emit("remove",n[this.groupValues],this.id);var i=this.internalValue.filter(function(t){return-1===n[e.groupValues].indexOf(t)});this.$emit("input",i,this.id)}else{var r=n[this.groupValues].filter(function(t){return!(e.isOptionDisabled(t)||e.isSelected(t))});this.$emit("select",r,this.id),this.$emit("input",this.internalValue.concat(r),this.id)}},wholeGroupSelected:function(t){var e=this;return t[this.groupValues].every(function(t){return e.isSelected(t)||e.isOptionDisabled(t)})},wholeGroupDisabled:function(t){return t[this.groupValues].every(this.isOptionDisabled)},removeElement:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!this.disabled&&!t.$isDisabled){if(!this.allowEmpty&&this.internalValue.length<=1)return void this.deactivate();var i="object"===n.i(c.a)(t)?this.valueKeys.indexOf(t[this.trackBy]):this.valueKeys.indexOf(t);if(this.$emit("remove",t,this.id),this.multiple){var r=this.internalValue.slice(0,i).concat(this.internalValue.slice(i+1));this.$emit("input",r,this.id)}else this.$emit("input",null,this.id);this.closeOnSelect&&e&&this.deactivate()}},removeLastElement:function(){-1===this.blockKeys.indexOf("Delete")&&0===this.search.length&&Array.isArray(this.internalValue)&&this.internalValue.length&&this.removeElement(this.internalValue[this.internalValue.length-1],!1)},activate:function(){var t=this;this.isOpen||this.disabled||(this.adjustPosition(),this.groupValues&&0===this.pointer&&this.filteredOptions.length&&(this.pointer=1),this.isOpen=!0,this.searchable?(this.preserveSearch||(this.search=""),this.$nextTick(function(){return t.$refs.search.focus()})):this.$el.focus(),this.$emit("open",this.id))},deactivate:function(){this.isOpen&&(this.isOpen=!1,this.searchable?this.$refs.search.blur():this.$el.blur(),this.preserveSearch||(this.search=""),this.$emit("close",this.getValue(),this.id))},toggle:function(){this.isOpen?this.deactivate():this.activate()},adjustPosition:function(){if("undefined"!=typeof window){var t=this.$el.getBoundingClientRect().top,e=window.innerHeight-this.$el.getBoundingClientRect().bottom;e>this.maxHeight||e>t||"below"===this.openDirection||"bottom"===this.openDirection?(this.preferredOpenDirection="below",this.optimizedHeight=Math.min(e-40,this.maxHeight)):(this.preferredOpenDirection="above",this.optimizedHeight=Math.min(t-40,this.maxHeight))}}}}},function(t,e,n){"use strict";var i=n(54),r=(n.n(i),n(31));n.n(r);e.a={data:function(){return{pointer:0,pointerDirty:!1}},props:{showPointer:{type:Boolean,default:!0},optionHeight:{type:Number,default:40}},computed:{pointerPosition:function(){return this.pointer*this.optionHeight},visibleElements:function(){return this.optimizedHeight/this.optionHeight}},watch:{filteredOptions:function(){this.pointerAdjust()},isOpen:function(){this.pointerDirty=!1}},methods:{optionHighlight:function(t,e){return{"multiselect__option--highlight":t===this.pointer&&this.showPointer,"multiselect__option--selected":this.isSelected(e)}},groupHighlight:function(t,e){var n=this;if(!this.groupSelect)return["multiselect__option--group","multiselect__option--disabled"];var i=this.options.find(function(t){return t[n.groupLabel]===e.$groupLabel});return i&&!this.wholeGroupDisabled(i)?["multiselect__option--group",{"multiselect__option--highlight":t===this.pointer&&this.showPointer},{"multiselect__option--group-selected":this.wholeGroupSelected(i)}]:"multiselect__option--disabled"},addPointerElement:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Enter",e=t.key;this.filteredOptions.length>0&&this.select(this.filteredOptions[this.pointer],e),this.pointerReset()},pointerForward:function(){this.pointer<this.filteredOptions.length-1&&(this.pointer++,this.$refs.list.scrollTop<=this.pointerPosition-(this.visibleElements-1)*this.optionHeight&&(this.$refs.list.scrollTop=this.pointerPosition-(this.visibleElements-1)*this.optionHeight),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward()),this.pointerDirty=!0},pointerBackward:function(){this.pointer>0?(this.pointer--,this.$refs.list.scrollTop>=this.pointerPosition&&(this.$refs.list.scrollTop=this.pointerPosition),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerBackward()):this.filteredOptions[this.pointer]&&this.filteredOptions[0].$isLabel&&!this.groupSelect&&this.pointerForward(),this.pointerDirty=!0},pointerReset:function(){this.closeOnSelect&&(this.pointer=0,this.$refs.list&&(this.$refs.list.scrollTop=0))},pointerAdjust:function(){this.pointer>=this.filteredOptions.length-1&&(this.pointer=this.filteredOptions.length?this.filteredOptions.length-1:0),this.filteredOptions.length>0&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward()},pointerSet:function(t){this.pointer=t,this.pointerDirty=!0}}}},function(t,e,n){"use strict";var i=n(36),r=n(74),o=n(15),s=n(18);t.exports=n(72)(Array,"Array",function(t,e){this._t=s(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,r(1)):"keys"==e?r(0,n):"values"==e?r(0,t[n]):r(0,[n,t[n]])},"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries")},function(t,e,n){"use strict";var i=n(31),r=(n.n(i),n(32)),o=n(33);e.a={name:"vue-multiselect",mixins:[r.a,o.a],props:{name:{type:String,default:""},selectLabel:{type:String,default:"Press enter to select"},selectGroupLabel:{type:String,default:"Press enter to select group"},selectedLabel:{type:String,default:"Selected"},deselectLabel:{type:String,default:"Press enter to remove"},deselectGroupLabel:{type:String,default:"Press enter to deselect group"},showLabels:{type:Boolean,default:!0},limit:{type:Number,default:99999},maxHeight:{type:Number,default:300},limitText:{type:Function,default:function(t){return"and ".concat(t," more")}},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},openDirection:{type:String,default:""},showNoOptions:{type:Boolean,default:!0},showNoResults:{type:Boolean,default:!0},tabindex:{type:Number,default:0}},computed:{isSingleLabelVisible:function(){return(this.singleValue||0===this.singleValue)&&(!this.isOpen||!this.searchable)&&!this.visibleValues.length},isPlaceholderVisible:function(){return!(this.internalValue.length||this.searchable&&this.isOpen)},visibleValues:function(){return this.multiple?this.internalValue.slice(0,this.limit):[]},singleValue:function(){return this.internalValue[0]},deselectLabelText:function(){return this.showLabels?this.deselectLabel:""},deselectGroupLabelText:function(){return this.showLabels?this.deselectGroupLabel:""},selectLabelText:function(){return this.showLabels?this.selectLabel:""},selectGroupLabelText:function(){return this.showLabels?this.selectGroupLabel:""},selectedLabelText:function(){return this.showLabels?this.selectedLabel:""},inputStyle:function(){if(this.searchable||this.multiple&&this.value&&this.value.length)return this.isOpen?{width:"100%"}:{width:"0",position:"absolute",padding:"0"}},contentStyle:function(){return this.options.length?{display:"inline-block"}:{display:"block"}},isAbove:function(){return"above"===this.openDirection||"top"===this.openDirection||"below"!==this.openDirection&&"bottom"!==this.openDirection&&"above"===this.preferredOpenDirection},showSearchInput:function(){return this.searchable&&(!this.hasSingleSelectedSlot||!this.visibleSingleValue&&0!==this.visibleSingleValue||this.isOpen)}}}},function(t,e,n){var i=n(1)("unscopables"),r=Array.prototype;void 0==r[i]&&n(8)(r,i,{}),t.exports=function(t){r[i][t]=!0}},function(t,e,n){var i=n(18),r=n(19),o=n(85);t.exports=function(t){return function(e,n,s){var u,a=i(e),l=r(a.length),c=o(s,l);if(t&&n!=n){for(;l>c;)if((u=a[c++])!=u)return!0}else for(;l>c;c++)if((t||c in a)&&a[c]===n)return t||c||0;return!t&&-1}}},function(t,e,n){var i=n(9),r=n(1)("toStringTag"),o="Arguments"==i(function(){return arguments}()),s=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=s(e=Object(t),r))?n:o?i(e):"Object"==(u=i(e))&&"function"==typeof e.callee?"Arguments":u}},function(t,e,n){"use strict";var i=n(2);t.exports=function(){var t=i(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},function(t,e,n){var i=n(0).document;t.exports=i&&i.documentElement},function(t,e,n){t.exports=!n(4)&&!n(7)(function(){return 7!=Object.defineProperty(n(21)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var i=n(9);t.exports=Array.isArray||function(t){return"Array"==i(t)}},function(t,e,n){"use strict";function i(t){var e,n;this.promise=new t(function(t,i){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=i}),this.resolve=r(e),this.reject=r(n)}var r=n(14);t.exports.f=function(t){return new i(t)}},function(t,e,n){var i=n(2),r=n(76),o=n(22),s=n(27)("IE_PROTO"),u=function(){},a=function(){var t,e=n(21)("iframe"),i=o.length;for(e.style.display="none",n(40).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;i--;)delete a.prototype[o[i]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(u.prototype=i(t),n=new u,u.prototype=null,n[s]=t):n=a(),void 0===e?n:r(n,e)}},function(t,e,n){var i=n(79),r=n(25),o=n(18),s=n(29),u=n(12),a=n(41),l=Object.getOwnPropertyDescriptor;e.f=n(4)?l:function(t,e){if(t=o(t),e=s(e,!0),a)try{return l(t,e)}catch(t){}if(u(t,e))return r(!i.f.call(t,e),t[e])}},function(t,e,n){var i=n(12),r=n(18),o=n(37)(!1),s=n(27)("IE_PROTO");t.exports=function(t,e){var n,u=r(t),a=0,l=[];for(n in u)n!=s&&i(u,n)&&l.push(n);for(;e.length>a;)i(u,n=e[a++])&&(~o(l,n)||l.push(n));return l}},function(t,e,n){var i=n(46),r=n(22);t.exports=Object.keys||function(t){return i(t,r)}},function(t,e,n){var i=n(2),r=n(5),o=n(43);t.exports=function(t,e){if(i(t),r(e)&&e.constructor===t)return e;var n=o.f(t);return(0,n.resolve)(e),n.promise}},function(t,e,n){var i=n(10),r=n(0),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:i.version,mode:n(24)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})},function(t,e,n){var i=n(2),r=n(14),o=n(1)("species");t.exports=function(t,e){var n,s=i(t).constructor;return void 0===s||void 0==(n=i(s)[o])?e:r(n)}},function(t,e,n){var i=n(3),r=n(16),o=n(7),s=n(84),u="["+s+"]",a="​",l=RegExp("^"+u+u+"*"),c=RegExp(u+u+"*$"),f=function(t,e,n){var r={},u=o(function(){return!!s[t]()||a[t]()!=a}),l=r[t]=u?e(p):s[t];n&&(r[n]=l),i(i.P+i.F*u,"String",r)},p=f.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(c,"")),t};t.exports=f},function(t,e,n){var i,r,o,s=n(11),u=n(68),a=n(40),l=n(21),c=n(0),f=c.process,p=c.setImmediate,h=c.clearImmediate,d=c.MessageChannel,v=c.Dispatch,g=0,y={},m=function(){var t=+this;if(y.hasOwnProperty(t)){var e=y[t];delete y[t],e()}},b=function(t){m.call(t.data)};p&&h||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return y[++g]=function(){u("function"==typeof t?t:Function(t),e)},i(g),g},h=function(t){delete y[t]},"process"==n(9)(f)?i=function(t){f.nextTick(s(m,t,1))}:v&&v.now?i=function(t){v.now(s(m,t,1))}:d?(r=new d,o=r.port2,r.port1.onmessage=b,i=s(o.postMessage,o,1)):c.addEventListener&&"function"==typeof postMessage&&!c.importScripts?(i=function(t){c.postMessage(t+"","*")},c.addEventListener("message",b,!1)):i="onreadystatechange"in l("script")?function(t){a.appendChild(l("script")).onreadystatechange=function(){a.removeChild(this),m.call(t)}}:function(t){setTimeout(s(m,t,1),0)}),t.exports={set:p,clear:h}},function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}},function(t,e,n){"use strict";var i=n(3),r=n(20)(5),o=!0;"find"in[]&&Array(1).find(function(){o=!1}),i(i.P+i.F*o,"Array",{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n(36)("find")},function(t,e,n){"use strict";var i,r,o,s,u=n(24),a=n(0),l=n(11),c=n(38),f=n(3),p=n(5),h=n(14),d=n(61),v=n(66),g=n(50),y=n(52).set,m=n(75)(),b=n(43),_=n(80),x=n(86),w=n(48),S=a.TypeError,O=a.process,L=O&&O.versions,k=L&&L.v8||"",P=a.Promise,T="process"==c(O),V=function(){},E=r=b.f,A=!!function(){try{var t=P.resolve(1),e=(t.constructor={})[n(1)("species")]=function(t){t(V,V)};return(T||"function"==typeof PromiseRejectionEvent)&&t.then(V)instanceof e&&0!==k.indexOf("6.6")&&-1===x.indexOf("Chrome/66")}catch(t){}}(),C=function(t){var e;return!(!p(t)||"function"!=typeof(e=t.then))&&e},D=function(t,e){if(!t._n){t._n=!0;var n=t._c;m(function(){for(var i=t._v,r=1==t._s,o=0;n.length>o;)!function(e){var n,o,s,u=r?e.ok:e.fail,a=e.resolve,l=e.reject,c=e.domain;try{u?(r||(2==t._h&&$(t),t._h=1),!0===u?n=i:(c&&c.enter(),n=u(i),c&&(c.exit(),s=!0)),n===e.promise?l(S("Promise-chain cycle")):(o=C(n))?o.call(n,a,l):a(n)):l(i)}catch(t){c&&!s&&c.exit(),l(t)}}(n[o++]);t._c=[],t._n=!1,e&&!t._h&&j(t)})}},j=function(t){y.call(a,function(){var e,n,i,r=t._v,o=N(t);if(o&&(e=_(function(){T?O.emit("unhandledRejection",r,t):(n=a.onunhandledrejection)?n({promise:t,reason:r}):(i=a.console)&&i.error&&i.error("Unhandled promise rejection",r)}),t._h=T||N(t)?2:1),t._a=void 0,o&&e.e)throw e.v})},N=function(t){return 1!==t._h&&0===(t._a||t._c).length},$=function(t){y.call(a,function(){var e;T?O.emit("rejectionHandled",t):(e=a.onrejectionhandled)&&e({promise:t,reason:t._v})})},F=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,e._v=t,e._s=2,e._a||(e._a=e._c.slice()),D(e,!0))},M=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw S("Promise can't be resolved itself");(e=C(t))?m(function(){var i={_w:n,_d:!1};try{e.call(t,l(M,i,1),l(F,i,1))}catch(t){F.call(i,t)}}):(n._v=t,n._s=1,D(n,!1))}catch(t){F.call({_w:n,_d:!1},t)}}};A||(P=function(t){d(this,P,"Promise","_h"),h(t),i.call(this);try{t(l(M,this,1),l(F,this,1))}catch(t){F.call(this,t)}},i=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},i.prototype=n(81)(P.prototype,{then:function(t,e){var n=E(g(this,P));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=T?O.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&D(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new i;this.promise=t,this.resolve=l(M,t,1),this.reject=l(F,t,1)},b.f=E=function(t){return t===P||t===s?new o(t):r(t)}),f(f.G+f.W+f.F*!A,{Promise:P}),n(26)(P,"Promise"),n(83)("Promise"),s=n(10).Promise,f(f.S+f.F*!A,"Promise",{reject:function(t){var e=E(this);return(0,e.reject)(t),e.promise}}),f(f.S+f.F*(u||!A),"Promise",{resolve:function(t){return w(u&&this===s?P:this,t)}}),f(f.S+f.F*!(A&&n(73)(function(t){P.all(t).catch(V)})),"Promise",{all:function(t){var e=this,n=E(e),i=n.resolve,r=n.reject,o=_(function(){var n=[],o=0,s=1;v(t,!1,function(t){var u=o++,a=!1;n.push(void 0),s++,e.resolve(t).then(function(t){a||(a=!0,n[u]=t,--s||i(n))},r)}),--s||i(n)});return o.e&&r(o.v),n.promise},race:function(t){var e=this,n=E(e),i=n.reject,r=_(function(){v(t,!1,function(t){e.resolve(t).then(n.resolve,i)})});return r.e&&i(r.v),n.promise}})},function(t,e,n){"use strict";var i=n(3),r=n(10),o=n(0),s=n(50),u=n(48);i(i.P+i.R,"Promise",{finally:function(t){var e=s(this,r.Promise||o.Promise),n="function"==typeof t;return this.then(n?function(n){return u(e,t()).then(function(){return n})}:t,n?function(n){return u(e,t()).then(function(){throw n})}:t)}})},function(t,e,n){"use strict";function i(t){n(99)}var r=n(35),o=n(101),s=n(100),u=i,a=s(r.a,o.a,!1,u,null,null);e.a=a.exports},function(t,e,n){"use strict";function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}e.a=i},function(t,e,n){"use strict";function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t){return(r="function"==typeof Symbol&&"symbol"===i(Symbol.iterator)?function(t){return i(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":i(t)})(t)}e.a=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(34),r=(n.n(i),n(55)),o=(n.n(r),n(56)),s=(n.n(o),n(57)),u=n(32),a=n(33);n.d(e,"Multiselect",function(){return s.a}),n.d(e,"multiselectMixin",function(){return u.a}),n.d(e,"pointerMixin",function(){return a.a}),e.default=s.a},function(t,e){t.exports=function(t,e,n,i){if(!(t instanceof e)||void 0!==i&&i in t)throw TypeError(n+": incorrect invocation!");return t}},function(t,e,n){var i=n(14),r=n(28),o=n(23),s=n(19);t.exports=function(t,e,n,u,a){i(e);var l=r(t),c=o(l),f=s(l.length),p=a?f-1:0,h=a?-1:1;if(n<2)for(;;){if(p in c){u=c[p],p+=h;break}if(p+=h,a?p<0:f<=p)throw TypeError("Reduce of empty array with no initial value")}for(;a?p>=0:f>p;p+=h)p in c&&(u=e(u,c[p],p,l));return u}},function(t,e,n){var i=n(5),r=n(42),o=n(1)("species");t.exports=function(t){var e;return r(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!r(e.prototype)||(e=void 0),i(e)&&null===(e=e[o])&&(e=void 0)),void 0===e?Array:e}},function(t,e,n){var i=n(63);t.exports=function(t,e){return new(i(t))(e)}},function(t,e,n){"use strict";var i=n(8),r=n(6),o=n(7),s=n(16),u=n(1);t.exports=function(t,e,n){var a=u(t),l=n(s,a,""[t]),c=l[0],f=l[1];o(function(){var e={};return e[a]=function(){return 7},7!=""[t](e)})&&(r(String.prototype,t,c),i(RegExp.prototype,a,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)}))}},function(t,e,n){var i=n(11),r=n(70),o=n(69),s=n(2),u=n(19),a=n(87),l={},c={},e=t.exports=function(t,e,n,f,p){var h,d,v,g,y=p?function(){return t}:a(t),m=i(n,f,e?2:1),b=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(o(y)){for(h=u(t.length);h>b;b++)if((g=e?m(s(d=t[b])[0],d[1]):m(t[b]))===l||g===c)return g}else for(v=y.call(t);!(d=v.next()).done;)if((g=r(v,m,d.value,e))===l||g===c)return g};e.BREAK=l,e.RETURN=c},function(t,e,n){var i=n(5),r=n(82).set;t.exports=function(t,e,n){var o,s=e.constructor;return s!==n&&"function"==typeof s&&(o=s.prototype)!==n.prototype&&i(o)&&r&&r(t,o),t}},function(t,e){t.exports=function(t,e,n){var i=void 0===n;switch(e.length){case 0:return i?t():t.call(n);case 1:return i?t(e[0]):t.call(n,e[0]);case 2:return i?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return i?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return i?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},function(t,e,n){var i=n(15),r=n(1)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||o[r]===t)}},function(t,e,n){var i=n(2);t.exports=function(t,e,n,r){try{return r?e(i(n)[0],n[1]):e(n)}catch(e){var o=t.return;throw void 0!==o&&i(o.call(t)),e}}},function(t,e,n){"use strict";var i=n(44),r=n(25),o=n(26),s={};n(8)(s,n(1)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=i(s,{next:r(1,n)}),o(t,e+" Iterator")}},function(t,e,n){"use strict";var i=n(24),r=n(3),o=n(6),s=n(8),u=n(15),a=n(71),l=n(26),c=n(78),f=n(1)("iterator"),p=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,e,n,d,v,g,y){a(n,e,d);var m,b,_,x=function(t){if(!p&&t in L)return L[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",S="values"==v,O=!1,L=t.prototype,k=L[f]||L["@@iterator"]||v&&L[v],P=k||x(v),T=v?S?x("entries"):P:void 0,V="Array"==e?L.entries||k:k;if(V&&(_=c(V.call(new t)))!==Object.prototype&&_.next&&(l(_,w,!0),i||"function"==typeof _[f]||s(_,f,h)),S&&k&&"values"!==k.name&&(O=!0,P=function(){return k.call(this)}),i&&!y||!p&&!O&&L[f]||s(L,f,P),u[e]=P,u[w]=h,v)if(m={values:S?P:x("values"),keys:g?P:x("keys"),entries:T},y)for(b in m)b in L||o(L,b,m[b]);else r(r.P+r.F*(p||O),e,m);return m}},function(t,e,n){var i=n(1)("iterator"),r=!1;try{var o=[7][i]();o.return=function(){r=!0},Array.from(o,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!r)return!1;var n=!1;try{var o=[7],s=o[i]();s.next=function(){return{done:n=!0}},o[i]=function(){return s},t(o)}catch(t){}return n}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){var i=n(0),r=n(52).set,o=i.MutationObserver||i.WebKitMutationObserver,s=i.process,u=i.Promise,a="process"==n(9)(s);t.exports=function(){var t,e,n,l=function(){var i,r;for(a&&(i=s.domain)&&i.exit();t;){r=t.fn,t=t.next;try{r()}catch(i){throw t?n():e=void 0,i}}e=void 0,i&&i.enter()};if(a)n=function(){s.nextTick(l)};else if(!o||i.navigator&&i.navigator.standalone)if(u&&u.resolve){var c=u.resolve(void 0);n=function(){c.then(l)}}else n=function(){r.call(i,l)};else{var f=!0,p=document.createTextNode("");new o(l).observe(p,{characterData:!0}),n=function(){p.data=f=!f}}return function(i){var r={fn:i,next:void 0};e&&(e.next=r),t||(t=r,n()),e=r}}},function(t,e,n){var i=n(13),r=n(2),o=n(47);t.exports=n(4)?Object.defineProperties:function(t,e){r(t);for(var n,s=o(e),u=s.length,a=0;u>a;)i.f(t,n=s[a++],e[n]);return t}},function(t,e,n){var i=n(46),r=n(22).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,r)}},function(t,e,n){var i=n(12),r=n(28),o=n(27)("IE_PROTO"),s=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),i(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?s:null}},function(t,e){e.f={}.propertyIsEnumerable},function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},function(t,e,n){var i=n(6);t.exports=function(t,e,n){for(var r in e)i(t,r,e[r],n);return t}},function(t,e,n){var i=n(5),r=n(2),o=function(t,e){if(r(t),!i(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,i){try{i=n(11)(Function.call,n(45).f(Object.prototype,"__proto__").set,2),i(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return o(t,n),e?t.__proto__=n:i(t,n),t}}({},!1):void 0),check:o}},function(t,e,n){"use strict";var i=n(0),r=n(13),o=n(4),s=n(1)("species");t.exports=function(t){var e=i[t];o&&e&&!e[s]&&r.f(e,s,{configurable:!0,get:function(){return this}})}},function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},function(t,e,n){var i=n(53),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)}},function(t,e,n){var i=n(0),r=i.navigator;t.exports=r&&r.userAgent||""},function(t,e,n){var i=n(38),r=n(1)("iterator"),o=n(15);t.exports=n(10).getIteratorMethod=function(t){if(void 0!=t)return t[r]||t["@@iterator"]||o[i(t)]}},function(t,e,n){"use strict";var i=n(3),r=n(20)(2);i(i.P+i.F*!n(17)([].filter,!0),"Array",{filter:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var i=n(3),r=n(37)(!1),o=[].indexOf,s=!!o&&1/[1].indexOf(1,-0)<0;i(i.P+i.F*(s||!n(17)(o)),"Array",{indexOf:function(t){return s?o.apply(this,arguments)||0:r(this,t,arguments[1])}})},function(t,e,n){var i=n(3);i(i.S,"Array",{isArray:n(42)})},function(t,e,n){"use strict";var i=n(3),r=n(20)(1);i(i.P+i.F*!n(17)([].map,!0),"Array",{map:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var i=n(3),r=n(62);i(i.P+i.F*!n(17)([].reduce,!0),"Array",{reduce:function(t){return r(this,t,arguments.length,arguments[1],!1)}})},function(t,e,n){var i=Date.prototype,r=i.toString,o=i.getTime;new Date(NaN)+""!="Invalid Date"&&n(6)(i,"toString",function(){var t=o.call(this);return t===t?r.call(this):"Invalid Date"})},function(t,e,n){n(4)&&"g"!=/./g.flags&&n(13).f(RegExp.prototype,"flags",{configurable:!0,get:n(39)})},function(t,e,n){n(65)("search",1,function(t,e,n){return[function(n){"use strict";var i=t(this),r=void 0==n?void 0:n[e];return void 0!==r?r.call(n,i):new RegExp(n)[e](String(i))},n]})},function(t,e,n){"use strict";n(94);var i=n(2),r=n(39),o=n(4),s=/./.toString,u=function(t){n(6)(RegExp.prototype,"toString",t,!0)};n(7)(function(){return"/a/b"!=s.call({source:"a",flags:"b"})})?u(function(){var t=i(this);return"/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?r.call(t):void 0)}):"toString"!=s.name&&u(function(){return s.call(this)})},function(t,e,n){"use strict";n(51)("trim",function(t){return function(){return t(this,3)}})},function(t,e,n){for(var i=n(34),r=n(47),o=n(6),s=n(0),u=n(8),a=n(15),l=n(1),c=l("iterator"),f=l("toStringTag"),p=a.Array,h={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=r(h),v=0;v<d.length;v++){var g,y=d[v],m=h[y],b=s[y],_=b&&b.prototype;if(_&&(_[c]||u(_,c,p),_[f]||u(_,f,y),a[y]=p,m))for(g in i)_[g]||o(_,g,i[g],!0)}},function(t,e){},function(t,e){t.exports=function(t,e,n,i,r,o){var s,u=t=t||{},a=typeof t.default;"object"!==a&&"function"!==a||(s=t,u=t.default);var l="function"==typeof u?u.options:u;e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns,l._compiled=!0),n&&(l.functional=!0),r&&(l._scopeId=r);var c;if(o?(c=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},l._ssrRegister=c):i&&(c=i),c){var f=l.functional,p=f?l.render:l.beforeCreate;f?(l._injectStyles=c,l.render=function(t,e){return c.call(e),p(t,e)}):l.beforeCreate=p?[].concat(p,c):[c]}return{esModule:s,exports:u,options:l}}},function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"multiselect",class:{"multiselect--active":t.isOpen,"multiselect--disabled":t.disabled,"multiselect--above":t.isAbove},attrs:{tabindex:t.searchable?-1:t.tabindex},on:{focus:function(e){t.activate()},blur:function(e){!t.searchable&&t.deactivate()},keydown:[function(e){return"button"in e||!t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerForward()):null},function(e){return"button"in e||!t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerBackward()):null}],keypress:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")||!t._k(e.keyCode,"tab",9,e.key,"Tab")?(e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate()}}},[t._t("caret",[n("div",{staticClass:"multiselect__select",on:{mousedown:function(e){e.preventDefault(),e.stopPropagation(),t.toggle()}}})],{toggle:t.toggle}),t._v(" "),t._t("clear",null,{search:t.search}),t._v(" "),n("div",{ref:"tags",staticClass:"multiselect__tags"},[t._t("selection",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.visibleValues.length>0,expression:"visibleValues.length > 0"}],staticClass:"multiselect__tags-wrap"},[t._l(t.visibleValues,function(e,i){return[t._t("tag",[n("span",{key:i,staticClass:"multiselect__tag"},[n("span",{domProps:{textContent:t._s(t.getOptionLabel(e))}}),t._v(" "),n("i",{staticClass:"multiselect__tag-icon",attrs:{"aria-hidden":"true",tabindex:"1"},on:{keypress:function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13,n.key,"Enter"))return null;n.preventDefault(),t.removeElement(e)},mousedown:function(n){n.preventDefault(),t.removeElement(e)}}})])],{option:e,search:t.search,remove:t.removeElement})]})],2),t._v(" "),t.internalValue&&t.internalValue.length>t.limit?[t._t("limit",[n("strong",{staticClass:"multiselect__strong",domProps:{textContent:t._s(t.limitText(t.internalValue.length-t.limit))}})])]:t._e()],{search:t.search,remove:t.removeElement,values:t.visibleValues,isOpen:t.isOpen}),t._v(" "),n("transition",{attrs:{name:"multiselect__loading"}},[t._t("loading",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"multiselect__spinner"})])],2),t._v(" "),t.searchable?n("input",{ref:"search",staticClass:"multiselect__input",style:t.inputStyle,attrs:{name:t.name,id:t.id,type:"text",autocomplete:"nope",placeholder:t.placeholder,disabled:t.disabled,tabindex:t.tabindex},domProps:{value:t.search},on:{input:function(e){t.updateSearch(e.target.value)},focus:function(e){e.preventDefault(),t.activate()},blur:function(e){e.preventDefault(),t.deactivate()},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate()},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"]))return null;e.preventDefault(),t.pointerForward()},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"]))return null;e.preventDefault(),t.pointerBackward()},function(e){if(!("button"in e)&&t._k(e.keyCode,"delete",[8,46],e.key,["Backspace","Delete"]))return null;e.stopPropagation(),t.removeLastElement()}],keypress:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null}}}):t._e(),t._v(" "),t.isSingleLabelVisible?n("span",{staticClass:"multiselect__single",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("singleLabel",[[t._v(t._s(t.currentOptionLabel))]],{option:t.singleValue})],2):t._e(),t._v(" "),t.isPlaceholderVisible?n("span",{staticClass:"multiselect__placeholder",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("placeholder",[t._v("\n          "+t._s(t.placeholder)+"\n        ")])],2):t._e()],2),t._v(" "),n("transition",{attrs:{name:"multiselect"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen,expression:"isOpen"}],ref:"list",staticClass:"multiselect__content-wrapper",style:{maxHeight:t.optimizedHeight+"px"},attrs:{tabindex:"-1"},on:{focus:t.activate,mousedown:function(t){t.preventDefault()}}},[n("ul",{staticClass:"multiselect__content",style:t.contentStyle},[t._t("beforeList"),t._v(" "),t.multiple&&t.max===t.internalValue.length?n("li",[n("span",{staticClass:"multiselect__option"},[t._t("maxElements",[t._v("Maximum of "+t._s(t.max)+" options selected. First remove a selected option to select another.")])],2)]):t._e(),t._v(" "),!t.max||t.internalValue.length<t.max?t._l(t.filteredOptions,function(e,i){return n("li",{key:i,staticClass:"multiselect__element"},[e&&(e.$isLabel||e.$isDisabled)?t._e():n("span",{staticClass:"multiselect__option",class:t.optionHighlight(i,e),attrs:{"data-select":e&&e.isTag?t.tagPlaceholder:t.selectLabelText,"data-selected":t.selectedLabelText,"data-deselect":t.deselectLabelText},on:{click:function(n){n.stopPropagation(),t.select(e)},mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.pointerSet(i)}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2),t._v(" "),e&&(e.$isLabel||e.$isDisabled)?n("span",{staticClass:"multiselect__option",class:t.groupHighlight(i,e),attrs:{"data-select":t.groupSelect&&t.selectGroupLabelText,"data-deselect":t.groupSelect&&t.deselectGroupLabelText},on:{mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.groupSelect&&t.pointerSet(i)},mousedown:function(n){n.preventDefault(),t.selectGroup(e)}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2):t._e()])}):t._e(),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoResults&&0===t.filteredOptions.length&&t.search&&!t.loading,expression:"showNoResults && (filteredOptions.length === 0 && search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noResult",[t._v("No elements found. Consider changing the search query.")],{search:t.search})],2)]),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoOptions&&0===t.options.length&&!t.search&&!t.loading,expression:"showNoOptions && (options.length === 0 && !search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noOptions",[t._v("List is empty.")])],2)]),t._v(" "),t._t("afterList")],2)])])],2)},r=[],o={render:i,staticRenderFns:r};e.a=o}])});

/***/ }),

/***/ "./node_modules/fslightbox-vue/index.js":
/*!**********************************************!*\
  !*** ./node_modules/fslightbox-vue/index.js ***!
  \**********************************************/
/***/ ((module) => {

!function(){"use strict";var e={d:function(t,n){for(var i in n)e.o(n,i)&&!e.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:n[i]})},o:function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r:function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{default:function(){return Ie}});var n=function(){var e=this,t=e._self._c;return e.isOpen?t("div",{ref:"container",staticClass:"fslightbox-container fslightbox-full-dimension fslightbox-fade-in-strong"},[t("Naver",{attrs:{i:e.i}}),e._v(" "),t("Swc",{attrs:{i:e.i}}),e._v(" "),t("SlideButtons",{attrs:{i:e.i}}),e._v(" "),t("SlideSwipingHoverer",{attrs:{i:e.i}})],1):e._e()};n._withStripped=!0;var i="fslightbox-",o="".concat(i,"styles"),r="".concat(i,"cursor-grabbing"),s="".concat(i,"open"),c="".concat(i,"fade-in"),a="".concat(i,"fade-out"),l=a+"-strong",u="".concat(i,"opacity-"),d="".concat(u,"1"),h="".concat(i,"source");function f(){var e=document.createElement("style");e.className=o,e.appendChild(document.createTextNode(".fslightbox-absoluted{position:absolute;top:0;left:0}.fslightbox-fade-in{animation:fslightbox-fade-in .3s cubic-bezier(0, 0, 0.7, 1)}.fslightbox-fade-out{animation:fslightbox-fade-out .3s ease}.fslightboxfis{animation:fslightboxfis .3s cubic-bezier(0, 0, 0.7, 1)}.fslightbox-fade-out-strong{animation:fslightbox-fade-out-strong .3s ease}@keyframes fslightbox-fade-in{from{opacity:.65}to{opacity:1}}@keyframes fslightbox-fade-out{from{opacity:.35}to{opacity:0}}@keyframes fslightboxfis{from{opacity:.3}to{opacity:1}}@keyframes fslightbox-fade-out-strong{from{opacity:1}to{opacity:0}}.fslightbox-cursor-grabbing{cursor:grabbing}.fslightbox-full-dimension{width:100%;height:100%}.fslightbox-open{overflow:hidden;height:100%}.fslightbox-flex-centered{display:flex;justify-content:center;align-items:center}.fslightbox-opacity-0{opacity:0 !important}.fslightbox-opacity-1{opacity:1 !important}.fslightbox-scrollbarfix{padding-right:17px}.fslightboxtt{transition:transform .3s}.fslightbox-container{font-family:Arial,sans-serif;position:fixed;top:0;left:0;background:linear-gradient(rgba(30, 30, 30, 0.9), black 1810%);z-index:9999999;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;touch-action:none;-webkit-tap-highlight-color:transparent}.fslightbox-container *{box-sizing:border-box}.fslightbox-svg-path{transition:fill .15s ease;fill:#ddd}.fslightbox-nav{height:45px;width:100%;position:absolute;top:0;left:0}.fslightbox-slide-number-container{display:flex;justify-content:center;align-items:center;position:relative;height:100%;font-size:15px;color:#d7d7d7;z-index:0;max-width:55px;text-align:left}.fslightbox-slide-number-container .fslightbox-flex-centered{height:100%}.fslightbox-slash{display:block;margin:0 5px;width:1px;height:12px;transform:rotate(15deg);background:#fff}.fslightbox-toolbar{position:absolute;z-index:3;right:0;top:0;height:100%;display:flex;background:rgba(35,35,35,.65)}.fslightbox-toolbar-button{height:100%;width:45px;cursor:pointer}.fslightbox-toolbar-button:hover .fslightbox-svg-path{fill:#fff}.fslightbox-slide-btn-container{display:flex;align-items:center;padding:12px 12px 12px 6px;position:absolute;top:50%;cursor:pointer;z-index:3;transform:translateY(-50%)}@media(min-width: 476px){.fslightbox-slide-btn-container{padding:22px 22px 22px 6px}}@media(min-width: 768px){.fslightbox-slide-btn-container{padding:30px 30px 30px 6px}}.fslightbox-slide-btn-container:hover .fslightbox-svg-path{fill:#f1f1f1}.fslightbox-slide-btn{padding:9px;font-size:26px;background:rgba(35,35,35,.65)}@media(min-width: 768px){.fslightbox-slide-btn{padding:10px}}@media(min-width: 1600px){.fslightbox-slide-btn{padding:11px}}.fslightbox-slide-btn-previous-container{left:0}@media(max-width: 475.99px){.fslightbox-slide-btn-previous-container{padding-left:3px}}.fslightbox-slide-btn-next-container{right:0;padding-left:12px;padding-right:3px}@media(min-width: 476px){.fslightbox-slide-btn-next-container{padding-left:22px}}@media(min-width: 768px){.fslightbox-slide-btn-next-container{padding-left:30px}}@media(min-width: 476px){.fslightbox-slide-btn-next-container{padding-right:6px}}.fslightbox-down-event-detector{position:absolute;z-index:1}.fslightbox-slide-swiping-hoverer{z-index:4}.fslightboxin{font-size:22px;color:#eaebeb;margin:auto}.fslightbox-video{object-fit:cover}.fslightboxl{display:block;margin:auto;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:67px;height:67px}.fslightboxl div{box-sizing:border-box;display:block;position:absolute;width:54px;height:54px;margin:6px;border:5px solid;border-color:#999 transparent transparent transparent;border-radius:50%;animation:fslightboxl 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite}.fslightboxl div:nth-child(1){animation-delay:-0.45s}.fslightboxl div:nth-child(2){animation-delay:-0.3s}.fslightboxl div:nth-child(3){animation-delay:-0.15s}@keyframes fslightboxl{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}.fslightbox-source{position:relative;z-index:2;opacity:0;transform:translateZ(0);margin:auto;backface-visibility:hidden}")),document.head.appendChild(e)}function p(e){return p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},p(e)}"object"===("undefined"==typeof document?"undefined":p(document))&&f();var g=[],v="fslightbox-types";function m(e){var t,n=e.props,i=0,o={};this.getSourceTypeFromLocalStorageByUrl=function(e){return t[e]?t[e]:r(e)},this.handleReceivedSourceTypeForUrl=function(e,n){if(!1===o[n]&&(i--,"invalid"!==e?o[n]=e:delete o[n],0===i)){!function(e,t){for(var n in t)e[n]=t[n]}(t,o);try{localStorage.setItem(v,JSON.stringify(t))}catch(e){}}};var r=function(e){i++,o[e]=!1};if(n.disableLocalStorage)this.getSourceTypeFromLocalStorageByUrl=function(){},this.handleReceivedSourceTypeForUrl=function(){};else{try{t=JSON.parse(localStorage.getItem(v))}catch(e){}t||(t={},this.getSourceTypeFromLocalStorageByUrl=r)}}var b="image",x="video",S="youtube",w="custom",y="invalid";function _(e){var t=e.componentsServices.isLightboxOpenManager,n=e.elements.sourcesComponents,i=e.sawu;this.runActionsForSourceTypeAndIndex=function(e,o){var r;switch(e){case b:r="I";break;case x:r="V";break;case S:r="Y";break;case w:r="C";break;default:r="In"}n[o]=r,t.get()&&i[o]()}}function C(e,t,n){var i=e.props,o=i.types,r=i.type,s=i.sources;this.getTypeSetByClientForIndex=function(e){var t;return o&&o[e]?t=o[e]:r&&(t=r),t},this.retrieveTypeWithXhrForIndex=function(e){!function(e,t){var n=document.createElement("a");n.href=e;var i=n.hostname;if("www.youtube.com"===i||"youtu.be"===i)return t(S);var o=new XMLHttpRequest;o.onreadystatechange=function(){if(4!==o.readyState){if(2===o.readyState){var e,n=o.getResponseHeader("content-type");switch(n.slice(0,n.indexOf("/"))){case"image":e=b;break;case"video":e=x;break;default:e=y}o.onreadystatechange=null,o.abort(),t(e)}}else t(y)},o.open("GET",e),o.send()}(s[e],(function(i){t.handleReceivedSourceTypeForUrl(i,s[e]),n.runActionsForSourceTypeAndIndex(i,e)}))}}function L(e){var t=this,n=e.componentsServices,i=n.isFullscreenOpenManager,o=n.isLightboxOpenManager,r=e.core,c=r.eventsDispatcher,a=r.globalEventsController,u=r.scrollbarRecompensor,d=e.elements,h=e.fs,f=e.props,p=e.sourcePointerProps,g=e.timeout;this.isLightboxFadingOut=!1,this.runActions=function(){t.isLightboxFadingOut=!0,d.container.classList.add(l),a.removeListeners(),f.exitFullscreenOnClose&&i.get()&&h.exitFullscreen(),g((function(){t.isLightboxFadingOut=!1,p.isPointering=!1,d.container.classList.remove(l),document.documentElement.classList.remove(s),u.removeRecompense(),o.set(!1),c.dispatch("onClose")}),270)}}function F(e){var t=e.core,n=t.lightboxCloser,i=t.slideChangeFacade,o=e.fs;this.listener=function(e){switch(e.key){case"Escape":n.closeLightbox();break;case"ArrowLeft":i.changeToPrevious();break;case"ArrowRight":i.changeToNext();break;case"F11":e.preventDefault(),o.toggleFullscreen()}}}function T(e){var t=e.componentsServices,n=e.elements,i=e.smw,o=e.sourcePointerProps,s=e.stageIndexes;function c(e,t){i[e].v(o.swipedX)[t]()}this.runActionsForEvent=function(e){t.showSlideSwipingHoverer(),n.container.classList.add(r),o.swipedX=e.screenX-o.downScreenX,c(s.current,"z"),void 0!==s.previous&&o.swipedX>0?c(s.previous,"ne"):void 0!==s.next&&o.swipedX<0&&c(s.next,"p")}}function z(e){var t=e.props.sources,n=e.resolve,i=e.sourcePointerProps,o=n(T);1===t.length?this.listener=function(){i.swipedX=1}:this.listener=function(e){i.isPointering&&o.runActionsForEvent(e)}}function A(e){var t=e.core.slideIndexChanger,n=e.smw,i=e.stageIndexes,o=e.sws;function r(e){var t=n[i.current];t.a(),t[e]()}function s(e,t){void 0!==e&&(n[e].s(),n[e][t]())}this.p=function(){var e=i.previous;if(void 0===e)r("z");else{r("p");var n=i.next;t.changeTo(e);var c=i.previous;o.d(c),o.b(n),r("z"),s(c,"ne")}},this.n=function(){var e=i.next;if(void 0===e)r("z");else{r("ne");var n=i.previous;t.changeTo(e);var c=i.next;o.d(c),o.b(n),r("z"),s(c,"p")}}}function j(e){var t=e.componentsServices,n=e.core.lightboxCloser,i=e.elements,o=e.resolve,s=e.sourcePointerProps,c=o(A);this.runNoSwipeActions=function(){t.hideSlideSwipingHoverer(),s.isSourceDownEventTarget||n.closeLightbox(),s.isPointering=!1},this.runActions=function(){s.swipedX>0?c.p():c.n(),t.hideSlideSwipingHoverer(),i.container.classList.remove(r),s.isPointering=!1}}function I(e){var t=e.resolve,n=e.sourcePointerProps,i=t(j);this.listener=function(){n.isPointering&&(n.swipedX?i.runActions():i.runNoSwipeActions())}}function O(e,t){var n=e.classList;n.contains(t)&&n.remove(t)}function N(e,t,n){for(var i=0;i<e.props.sources.length;i++)e.collections[t][i]=e.resolve(n,[i])}function k(e,t,n,i){var o=e.data,r=e.elements.sources,s=n/i,c=0;this.adjustSize=function(){if((c=o.maxSourceWidth/s)<o.maxSourceHeight)return n<o.maxSourceWidth&&(c=i),a();c=i>o.maxSourceHeight?o.maxSourceHeight:i,a()};var a=function(){var e=r[t].style;e.width=c*s+"px",e.height=c+"px"}}function P(e,t){var n=this,i=e.collections.sourceSizers,o=e.elements.sources,r=e.isl,s=e.resolve,c=e.saw,a=e.sawu;function l(e,n){i[t]=s(k,[t,e,n]),i[t].adjustSize()}this.runActions=function(e,i){r[t]=!0,a[t](),o[t].classList.add(d),c[t].classList.add("fslightboxfis"),l(e,i),n.runActions=l}}function E(e,t){var n,i=this,o=e.elements.sources,r=e.props,s=(0,e.resolve)(P,[t]);this.handleImageLoad=function(e){var t=e.target,n=t.naturalWidth,i=t.naturalHeight;s.runActions(n,i)},this.handleVideoLoad=function(e){var t=e.target,i=t.videoWidth,o=t.videoHeight;n=!0,s.runActions(i,o)},this.handleNotMetaDatedVideoLoad=function(){n||i.handleYoutubeLoad()},this.handleYoutubeLoad=function(){var e=1920,t=1080;r.maxYoutubeVideoDimensions&&(e=r.maxYoutubeVideoDimensions.width,t=r.maxYoutubeVideoDimensions.height),s.runActions(e,t)},this.handleCustomLoad=function(){var e=o[t];if(e){var n=e.offsetWidth,r=e.offsetHeight;n&&r?s.runActions(n,r):setTimeout(i.handleCustomLoad)}}}function B(e){var t=e.componentsServices.isLightboxOpenManager,n=e.core,i=n.eventsDispatcher,o=n.globalEventsController,r=n.scrollbarRecompensor,s=n.sourceDisplayFacade,l=n.windowResizeActioner,u=(e.elements,e.st),d=e.stageIndexes,h=e.sws;function f(){s.displaySourcesWhichShouldBeDisplayed(),document.documentElement.classList.add("fslightbox-open"),r.addRecompense(),o.attachListeners(),l.runActions(),i.dispatch("onOpen")}e.o=function(){N(e,"sourceLoadHandlers",E),t.set(!0,(function(){h.b(d.previous),h.b(d.current),h.b(d.next),u.u(),h.c(),h.a(),f(),i.dispatch("onShow")}))},e.i=function(){e.ii=!0,N(e,"sourceLoadHandlers",E),function(e){var t,n,i;n=(t=e).core.eventsDispatcher,i=t.props,n.dispatch=function(e){i[e]&&i[e]()},function(e){var t=e.componentsServices.isFullscreenOpenManager,n=e.fs,i=["fullscreenchange","webkitfullscreenchange","mozfullscreenchange","MSFullscreenChange"];function o(e){for(var t=0;t<i.length;t++)document[e](i[t],r)}function r(){t.set(document.fullscreenElement||document.webkitIsFullScreen||document.mozFullScreen||document.msFullscreenElement)}n.enterFullscreen=function(){t.set(!0);var e=document.documentElement;e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.msRequestFullscreen&&e.msRequestFullscreen()},n.exitFullscreen=function(){t.set(!1),document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen()},n.toggleFullscreen=function(){t.get()?n.exitFullscreen():n.enterFullscreen()},n.listen=function(){o("addEventListener")},n.unlisten=function(){o("removeEventListener")}}(e),function(e){var t=e.core,n=t.globalEventsController,i=t.windowResizeActioner,o=e.fs,r=e.resolve,s=r(F),c=r(z),a=r(I);n.attachListeners=function(){document.addEventListener("pointermove",c.listener),document.addEventListener("pointerup",a.listener),addEventListener("resize",i.runActions),document.addEventListener("keydown",s.listener),o.listen()},n.removeListeners=function(){document.removeEventListener("pointermove",c.listener),document.removeEventListener("pointerup",a.listener),removeEventListener("resize",i.runActions),document.removeEventListener("keydown",s.listener),o.unlisten()}}(e),function(e){var t=e.core.lightboxCloser,n=(0,e.resolve)(L);t.closeLightbox=function(){n.isLightboxFadingOut||n.runActions()}}(e),function(e){var t=e.data,n=e.core.scrollbarRecompensor;n.addRecompense=function(){"complete"===document.readyState?i():window.addEventListener("load",(function(){i(),n.addRecompense=i}))};var i=function(){document.body.offsetHeight>window.innerHeight&&(document.body.style.marginRight=t.scrollbarWidth+"px")};n.removeRecompense=function(){document.body.style.removeProperty("margin-right")}}(e),function(e){var t=e.core,n=t.slideChangeFacade,i=t.slideIndexChanger,o=e.props.sources,r=e.st;o.length>1?(n.changeToPrevious=function(){i.jumpTo(r.getPreviousSlideIndex())},n.changeToNext=function(){i.jumpTo(r.getNextSlideIndex())}):(n.changeToPrevious=function(){},n.changeToNext=function(){})}(e),function(e){var t=e.componentsServices,n=e.core,i=n.slideIndexChanger,o=n.sourceDisplayFacade,r=e.isl,s=e.saw,l=e.smw,u=e.st,d=e.stageIndexes,h=e.sws;i.changeTo=function(e){d.current=e,u.u(),t.setSlideNumber(e+1),o.displaySourcesWhichShouldBeDisplayed()},i.jumpTo=function(e){var t=d.previous,n=d.current,o=d.next,f=r[n],p=r[e];i.changeTo(e);for(var g=0;g<l.length;g++)l[g].d();h.d(n),h.c(),requestAnimationFrame((function(){requestAnimationFrame((function(){var e=d.previous,i=d.current,g=d.next;function v(){u.i(n)?n===d.previous?l[n].ne():n===d.next&&l[n].p():(l[n].h(),l[n].n())}f&&s[n].classList.add(a),p&&s[i].classList.add(c),h.a(),void 0!==e&&e!==n&&l[e].ne(),l[i].n(),void 0!==g&&g!==n&&l[g].p(),h.b(t),h.b(o),r[n]?setTimeout(v,260):v()}))}))}}(e),function(e){var t=e.core.sourcesPointerDown,n=e.elements.sources,i=e.smw,o=e.sourcePointerProps,r=e.stageIndexes;t.listener=function(e){"VIDEO"!==e.target.tagName&&e.preventDefault(),o.isPointering=!0,o.downScreenX=e.screenX,o.swipedX=0;var t=n[r.current];t&&t.contains(e.target)?o.isSourceDownEventTarget=!0:o.isSourceDownEventTarget=!1;for(var s=0;s<i.length;s++)i[s].d()}}(e),function(e){var t=e.core.sourceDisplayFacade,n=e.props.loadOnlyCurrentSource,i=e.sawu,o=e.stageIndexes;t.displaySourcesWhichShouldBeDisplayed=function(){if(n)i[o.current]();else for(var e in o){var t=o[e];void 0!==t&&i[t]()}}}(e),function(e){var t=e.props.sources,n=e.st,i=e.stageIndexes,o=t.length-1;n.getPreviousSlideIndex=function(){return 0===i.current?o:i.current-1},n.getNextSlideIndex=function(){return i.current===o?0:i.current+1},n.u=0===o?function(){}:1===o?function(){0===i.current?(i.next=1,delete i.previous):(i.previous=0,delete i.next)}:function(){i.previous=n.getPreviousSlideIndex(),i.next=n.getNextSlideIndex()},n.i=o<=2?function(){return!0}:function(e){var t=i.current;if(0===t&&e===o||t===o&&0===e)return!0;var n=t-e;return-1===n||0===n||1===n}}(e),function(e){var t=e.collections.sourceSizers,n=e.core.windowResizeActioner,i=e.data,o=e.elements.sources,r=e.smw,s=e.stageIndexes;n.runActions=function(){innerWidth<992?i.maxSourceWidth=innerWidth:i.maxSourceWidth=.9*innerWidth,i.maxSourceHeight=.9*innerHeight;for(var e=0;e<o.length;e++)r[e].d(),t[e]&&o[e]&&t[e].adjustSize();var n=s.previous,c=s.next;void 0!==n&&r[n].ne(),void 0!==c&&r[c].p()}}(e),function(e){var t=e.isl,n=e.stageIndexes,i=e.saw,o=e.smw,r=e.st,s=e.sws;s.a=function(){for(var e in n)o[n[e]].s()},s.b=function(e){void 0===e||r.i(e)||(o[e].h(),o[e].n())},s.c=function(){for(var e in n)s.d(n[e])},s.d=function(e){if(t[e]){var n=i[e];O(n,"fslightboxfis"),O(n,c),O(n,a)}}}(e)}(e),u.u(),t.set(!0,(function(){f(),function(e){for(var t=e.props.sources,n=e.resolve,i=n(m),o=n(_),r=n(C,[i,o]),s=0;s<t.length;s++)if("string"==typeof t[s]){var c=r.getTypeSetByClientForIndex(s);if(c)o.runActionsForSourceTypeAndIndex(c,s);else{var a=i.getSourceTypeFromLocalStorageByUrl(t[s]);a?o.runActionsForSourceTypeAndIndex(a,s):r.retrieveTypeWithXhrForIndex(s)}}else o.runActionsForSourceTypeAndIndex(w,s)}(e),i.dispatch("onInit")}))}}function H(e){var t=e.componentsServices.isLightboxOpenManager,n=e.core.slideIndexChanger,i=e.stageIndexes;this.runCurrentStageIndexUpdateActionsFor=function(e){e!==i.current&&(t.get()?n.jumpTo(e):i.current=e)}}function D(e,t,n){return D=R()?Reflect.construct.bind():function(e,t,n){var i=[null];i.push.apply(i,t);var o=new(Function.bind.apply(e,i));return n&&M(o,n.prototype),o},D.apply(null,arguments)}function R(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function M(e,t){return M=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},M(e,t)}function U(e){return function(e){if(Array.isArray(e))return W(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return W(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?W(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function W(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function X(e){var t=this;this.props=e,this.data={isFullyRendered:!1,maxSourceWidth:0,maxSourceHeight:0,scrollbarWidth:0},this.isl=[],this.sourcePointerProps={isPointering:!1,downScreenX:null,isSourceDownEventTarget:!1,swipedX:0},this.stageIndexes={current:0},this.componentsServices={isLightboxOpenManager:{},setSlideNumber:null,isFullscreenOpenManager:{},showSlideSwipingHoverer:null,hideSlideSwipingHoverer:null},this.sawu=[],this.elements={sources:[],sourcesComponents:[]},this.saw=[],this.smw=[],this.collections={sourceLoadHandlers:[],sourceSizers:[],xhrs:[]},this.core={eventsDispatcher:{},globalEventsController:{},lightboxCloser:{},lightboxUpdater:{},scrollbarRecompensor:{},slideChangeFacade:{},slideIndexChanger:{},sourcesPointerDown:{},sourceDisplayFacade:{},windowResizeActioner:{}},this.fs={},this.st={},this.sws={},this.getQueuedAction=function(e,n){var i=[];return function(){i.push(!0),t.timeout((function(){i.pop(),i.length||e()}),n)}},this.resolve=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[];return n.unshift(t),D(e,U(n))},this.timeout=function(e,n){setTimeout((function(){t.elements.container&&e()}),n)},function(e){var t=e.componentsServices.isLightboxOpenManager,n=e.core,i=n.lightboxCloser,o=n.lightboxUpdater,r=e.data,s=(0,e.resolve)(H);o.handleSlideProp=function(){var t=e.props;"number"==typeof t.sourceIndex?s.runCurrentStageIndexUpdateActionsFor(t.sourceIndex):"string"==typeof t.source?s.runCurrentStageIndexUpdateActionsFor(t.sources.indexOf(t.source)):"number"==typeof t.slide&&s.runCurrentStageIndexUpdateActionsFor(t.slide-1)},o.handleTogglerUpdate=function(){t.get()?i.closeLightbox():r.isInitialized?e.o():e.i()}}(this),B(this)}var V=function(){var e=this,t=e._self._c;return t("div",{ref:"nav",staticClass:"fslightbox-nav"},[t("Toolbar",{attrs:{i:e.i}}),e._v(" "),e.hasMoreThanSource?t("SlideNumber",{attrs:{i:e.i}}):e._e()],1)};V._withStripped=!0;var $=function(){var e=this,t=e._self._c;return t("div",{staticClass:"fslightbox-toolbar"},[t("FullscreenButton",{attrs:{i:e.i}}),e._v(" "),t("CloseButton",{attrs:{i:e.i}})],1)};$._withStripped=!0;var q=function(){return(0,this._self._c)("ToolbarButton",{attrs:{"on-click":this.onClick,"view-box":"0 0 24 24",size:"20px",d:"M 4.7070312 3.2929688 L 3.2929688 4.7070312 L 10.585938 12 L 3.2929688 19.292969 L 4.7070312 20.707031 L 12 13.414062 L 19.292969 20.707031 L 20.707031 19.292969 L 13.414062 12 L 20.707031 4.7070312 L 19.292969 3.2929688 L 12 10.585938 L 4.7070312 3.2929688 z",title:"Close"}})};q._withStripped=!0;var Y=function(){var e=this,t=e._self._c;return t("div",{staticClass:"fslightbox-toolbar-button fslightbox-flex-centered",attrs:{title:e.title},on:{click:e.onClick}},[t("Svger",{attrs:{size:e.size,"view-box":e.viewBox,d:e.d}})],1)};Y._withStripped=!0;var J=function(){var e=this,t=e._self._c;return t("svg",{attrs:{width:e.size,height:e.size,viewBox:e.viewBox,xmlns:"http://www.w3.org/2000/svg"}},[t("path",{staticClass:"fslightbox-svg-path",attrs:{d:e.d}})])};function G(e,t,n,i,o,r,s,c){var a,l="function"==typeof e?e.options:e;if(t&&(l.render=t,l.staticRenderFns=n,l._compiled=!0),i&&(l.functional=!0),r&&(l._scopeId="data-v-"+r),s?(a=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),o&&o.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(s)},l._ssrRegister=a):o&&(a=c?function(){o.call(this,(l.functional?this.parent:this).$root.$options.shadowRoot)}:o),a)if(l.functional){l._injectStyles=a;var u=l.render;l.render=function(e,t){return a.call(t),u(e,t)}}else{var d=l.beforeCreate;l.beforeCreate=d?[].concat(d,a):[a]}return{exports:e,options:l}}J._withStripped=!0;var Q=G({props:{size:String,viewBox:String,d:String}},J,[],!1,null,null,null).exports,Z=G({components:{Svger:Q},props:{onClick:Function,size:String,viewBox:String,d:String,title:String}},Y,[],!1,null,null,null).exports,K=G({components:{ToolbarButton:Z},props:{i:Number},data:function(){return{onClick:g[this.i].core.lightboxCloser.closeLightbox}}},q,[],!1,null,null,null).exports,ee=function(){var e=this;return(0,e._self._c)("ToolbarButton",{attrs:{"on-click":e.getButtonData("onClick"),"view-box":e.getButtonData("viewBox"),size:e.getButtonData("size"),d:e.getButtonData("d"),title:e.getButtonData("title")}})};ee._withStripped=!0;var te=G({components:{ToolbarButton:Z},props:{i:Number},data:function(){return{isFullscreenOpen:!1}},methods:{getButtonData:function(e){var t=g[this.i].fs,n=t.exitFullscreen,i=t.enterFullscreen;return(this.isFullscreenOpen?{onClick:n,viewBox:"0 0 950 1024",size:"24px",d:"M682 342h128v84h-212v-212h84v128zM598 810v-212h212v84h-128v128h-84zM342 342v-128h84v212h-212v-84h128zM214 682v-84h212v212h-84v-128h-128z",title:"Exit fullscreen"}:{onClick:i,viewBox:"0 0 18 18",size:"20px",d:"M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z",title:"Enter fullscreen"})[e]}},created:function(){var e=this,t=g[this.i].componentsServices.isFullscreenOpenManager;t.get=function(){return e.isFullscreenOpen},t.set=function(t){return e.isFullscreenOpen=t}}},ee,[],!1,null,null,null),ne=G({components:{FullscreenButton:te.exports,CloseButton:K},props:{i:Number}},$,[],!1,null,null,null).exports,ie=function(){var e=this,t=e._self._c;return t("div",{ref:"source-outer",staticClass:"fslightbox-slide-number-container"},[t("div",{ref:"source-inner",staticClass:"fslightbox-flex-centered"},[t("span",[e._v(e._s(e.slide))]),e._v(" "),t("span",{staticClass:"fslightbox-slash"}),e._v(" "),t("span",[e._v(e._s(e.sourcesCount))])])])};ie._withStripped=!0;var oe=G({props:{i:Number},data:function(){return{slide:g[this.i].stageIndexes.current+1,sourcesCount:g[this.i].props.sources.length}},created:function(){var e=this;g[this.i].componentsServices.setSlideNumber=function(t){return e.slide=t}},mounted:function(){this.$refs["source-inner"].offsetWidth>55&&(this.$refs["source-outer"].style.justifyContent="flex-start")}},ie,[],!1,null,null,null),re=G({components:{SlideNumber:oe.exports,Toolbar:ne},props:{i:Number},data:function(){return{hasMoreThanSource:g[this.i].props.sources.length>1}}},V,[],!1,null,null,null).exports,se=function(){var e=this,t=e._self._c;return t("div",{staticClass:"fslightbox-absoluted fslightbox-full-dimension",on:{pointerdown:e.listener}},e._l(e.sources.length,(function(n,i){return t("Smw",{key:i,attrs:{i:e.i,j:i}})})),1)};se._withStripped=!0;var ce=function(){var e=this,t=e._self._c;return t("div",{ref:"a",staticClass:"fslightbox-absoluted fslightbox-full-dimension fslightbox-flex-centered",style:e.css},[t("Saw",{attrs:{i:e.i,j:e.j}})],1)};ce._withStripped=!0;var ae=function(){var e=this,t=e._self._c;return t("div",{ref:"a"},[e.isl?e._e():t("div",{staticClass:"fslightboxl"},[t("div"),t("div"),t("div"),t("div")]),e.current===e.j||!e.loadOnlyCurrentSource&&e.ist?t(e.sourceComponent,{tag:"component",attrs:{i:e.i,j:e.j}}):e._e()],1)};ae._withStripped=!0;var le=function(){var e=this;return(0,e._self._c)("img",e._b({ref:"ref",staticClass:"fslightbox-source",attrs:{src:e.src},on:{load:e.onLoad}},"img",e.customAttributes,!1))};le._withStripped=!0;var ue=G({props:{i:Number,j:Number},data:function(){var e=this,t=g[this.i],n=t.collections.sourceLoadHandlers,i=t.props,o=i.customAttributes;return{onLoad:function(t){n[e.j].handleImageLoad(t)},src:i.sources[this.j],customAttributes:o&&o[this.j]}},mounted:function(){g[this.i].elements.sources[this.j]=this.$refs.ref}},le,[],!1,null,null,null).exports,de=function(){var e=this,t=e._self._c;return t("video",e._b({ref:"ref",staticClass:"fslightbox-source fslightbox-video",attrs:{controls:""},on:{loadedmetadata:e.onLoad}},"video",e.customAttributes,!1),[t("source",{attrs:{src:e.src}})])};de._withStripped=!0;var he=G({props:{i:Number,j:Number},data:function(){var e=g[this.i],t=e.collections.sourceLoadHandlers,n=e.props,i=n.customAttributes,o=n.sources;return{onLoad:t[this.j].handleVideoLoad,src:o[this.j],customAttributes:i&&i[this.j]}},mounted:function(){g[this.i].elements.sources[this.j]=this.$refs.ref}},de,[],!1,null,null,null).exports,fe=function(){var e=this;return(0,e._self._c)("iframe",e._b({ref:"a",staticClass:"fslightbox-source fslightbox-youtube-iframe",attrs:{src:e.src,allowfullscreen:""}},"iframe",e.customAttributes,!1))};fe._withStripped=!0;var pe={props:{i:Number,j:Number},created:function(){var e=g[this.i].props,t=e.customAttributes,n=e.sources,i=this.j,o=n[i],r=o.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)[2],s=o.split("?")[1];s=s||"",this.src="https://www.youtube.com/embed/".concat(r,"?").concat(s),this.customAttributes=t&&t[i]},mounted:function(){var e=g[this.i],t=this.j;e.elements.sources[t]=this.$refs.a,e.collections.sourceLoadHandlers[t].handleYoutubeLoad()}},ge=G(pe,fe,[],!1,null,null,null).exports,ve=function(){var e=this;return(0,e._self._c)(e.c,e._b({ref:"a",tag:"component"},"component",e.p,!1))};ve._withStripped=!0;var me=G({props:{i:Number,j:Number},created:function(){var e=g[this.i].props.sources[this.j];this.c=e.component?e.component:e,this.p=e.props?e.props:{}},mounted:function(){var e=g[this.i],t=e.collections.sourceLoadHandlers,n=e.elements.sources;n[this.j]=this.$refs.a.$el,n[this.j].classList.add(h),t[this.j].handleCustomLoad()}},ve,[],!1,null,null,null).exports,be=function(){return(0,this._self._c)("div",{staticClass:"fslightboxin fslightbox-flex-centered"},[this._v("Invalid source")])};be._withStripped=!0;var xe=G({props:{i:Number,j:Number},mounted:function(){var e=g[this.i],t=e.isl,n=e.saw,i=e.sawu,o=this.j;t[o]=!0,i[o](),n[o].classList.add("fslightboxfis")}},be,[],!1,null,null,null).exports,Se=G({props:{i:Number,j:Number},components:{I:ue,V:he,Y:ge,C:me,In:xe},data:function(){var e={};return this.attachComponentDataToObject(e),e},created:function(){var e=this;g[this.i].sawu[this.j]=function(){e.attachComponentDataToObject(e)}},mounted:function(){g[this.i].saw[this.j]=this.$refs.a},methods:{attachComponentDataToObject:function(e){var t=g[this.i],n=t.elements.sourcesComponents,i=t.isl,o=t.props.loadOnlyCurrentSource,r=t.st,s=t.stageIndexes.current;e.sourceComponent=n[this.j],e.isl=i[this.j],e.ist=r.i(this.j),e.current=s,e.loadOnlyCurrentSource=o}}},ae,[],!1,null,null,null).exports,we={props:{i:Number,j:Number},components:{Saw:Se},created:function(){this.css=g[this.i].st.i(this.j)?{}:{display:"none"}},mounted:function(){var e=g[this.i],t=this.$refs.a,n=0;function i(e){t.style.transform="translateX(".concat(e+n,"px)"),n=0}function o(){return(1+e.props.slideDistance)*innerWidth}t.s=function(){t.style.display="flex"},t.h=function(){t.style.display="none"},t.a=function(){t.classList.add("fslightboxtt")},t.d=function(){t.classList.remove("fslightboxtt")},t.n=function(){t.style.removeProperty("transform")},t.v=function(e){return n=e,t},t.ne=function(){i(-o())},t.z=function(){i(0)},t.p=function(){i(o())},e.smw[this.j]=t}},ye=G(we,ce,[],!1,null,null,null).exports,_e=G({props:{i:Number},components:{Smw:ye},data:function(){var e=g[this.i],t=e.core.sourcesPointerDown.listener;return{sources:e.props.sources,listener:t}}},se,[],!1,null,null,null).exports,Ce=function(){var e=this,t=e._self._c;return e.sourcesCount>1?t("div",[t("SlideButton",{attrs:{"on-click":e.changeToPrevious,name:"previous",d:"M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788S18.707,9.212,18.271,9.212z"}}),e._v(" "),t("SlideButton",{attrs:{"on-click":e.changeToNext,name:"next",d:"M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788S1.293,9.212,1.729,9.212z"}})],1):e._e()};Ce._withStripped=!0;var Le=function(){var e=this,t=e._self._c;return t("div",{class:"fslightbox-slide-btn-container fslightbox-slide-btn-".concat(e.name,"-container"),attrs:{title:e.title},on:{click:e.onClick}},[t("div",{staticClass:"fslightbox-slide-btn fslightbox-flex-centered"},[t("Svger",{attrs:{"view-box":"0 0 20 20",size:"20px",d:e.d}})],1)])};Le._withStripped=!0;var Fe=G({components:{Svger:Q},props:{onClick:Function,name:String,d:String},data:function(){var e=this.name.charAt(0).toUpperCase()+this.name.slice(1);return{title:"".concat(e," slide")}}},Le,[],!1,null,null,null).exports,Te=G({props:{i:Number},components:{SlideButton:Fe},data:function(){var e=g[this.i],t=e.core.slideChangeFacade,n=t.changeToPrevious,i=t.changeToNext;return{sourcesCount:e.props.sources.length,changeToPrevious:n,changeToNext:i}}},Ce,[],!1,null,null,null).exports,ze=function(){var e=this,t=e._self._c;return e.isSlideSwipingHovererShown?t("div",{staticClass:"fslightbox-slide-swiping-hoverer fslightbox-full-dimension fslightbox-absoluted"}):e._e()};ze._withStripped=!0;var Ae,je=G({props:{i:Number},data:function(){return{isSlideSwipingHovererShown:!1}},created:function(){var e=this,t=g[this.i].componentsServices;t.showSlideSwipingHoverer=function(){e.isSlideSwipingHovererShown||(e.isSlideSwipingHovererShown=!0)},t.hideSlideSwipingHoverer=function(){e.isSlideSwipingHovererShown&&(e.isSlideSwipingHovererShown=!1)}}},ze,[],!1,null,null,null).exports;var Ie=G({props:{toggler:Boolean,sources:Array,slide:Number,source:String,sourceIndex:Number,onOpen:Function,onClose:Function,onInit:Function,onShow:Function,disableLocalStorage:Boolean,types:Array,type:String,customAttributes:Array,maxYoutubeVideoDimensions:Object,loadOnlyCurrentSource:Boolean,slideDistance:{type:Number,default:.3},openOnMount:Boolean,exitFullscreenOnClose:Boolean},components:{Swc:_e,SlideButtons:Te,Naver:re,SlideSwipingHoverer:je},data:function(){return{isOpen:!1}},watch:{slide:function(){g[this.i].core.lightboxUpdater.handleSlideProp()},sourceIndex:function(){g[this.i].core.lightboxUpdater.handleSlideProp()},source:function(){g[this.i].core.lightboxUpdater.handleSlideProp()},toggler:function(){g[this.i].core.lightboxUpdater.handleSlideProp(),g[this.i].core.lightboxUpdater.handleTogglerUpdate()}},created:function(){var e=this;this.i=g.push(new X(this))-1;var t=g[this.i].componentsServices.isLightboxOpenManager;t.get=function(){return e.isOpen},t.set=function(t,n){e.isOpen=t,n&&(Ae=n)}},mounted:function(){g[this.i].elements.container=this.$refs.container,function(e){var t=e.data,n=e.props.openOnMount;document.getElementsByClassName(o).length||f(),t.scrollbarWidth=function(){var e=document.createElement("div"),t=e.style,n=document.createElement("div");t.visibility="hidden",t.width="100px",t.msOverflowStyle="scrollbar",t.overflow="scroll",n.style.width="100%",document.body.appendChild(e);var i=e.offsetWidth;e.appendChild(n);var o=n.offsetWidth;return document.body.removeChild(e),i-o}(),n&&e.i()}(g[this.i])},updated:function(){g[this.i].elements.container=this.$refs.container,Ae&&Ae(),Ae=null}},n,[],!1,null,null,null).exports;module.exports=t}();

/***/ })

}]);