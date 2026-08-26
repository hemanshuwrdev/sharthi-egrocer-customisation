"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Blogs_BlogCategories_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/BlogCategories.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/BlogCategories.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************/
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
//



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  name: 'BlogCategories',
  data: function data() {
    var _ref;
    return _ref = {
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
      isLoading: false
    }, _defineProperty(_ref, "isSubmitting", false), _defineProperty(_ref, "filter", ''), _defineProperty(_ref, "filterOn", ['id', 'name', 'slug', 'status']), _defineProperty(_ref, "sortBy", 'id'), _defineProperty(_ref, "sortDesc", true), _defineProperty(_ref, "sortDirection", 'desc'), _defineProperty(_ref, "fields", [{
      key: 'id',
      label: __('id'),
      sortable: true,
      "class": 'text-center'
    }, {
      key: 'name',
      label: __('name'),
      sortable: true,
      "class": 'text-center'
    }, {
      key: 'slug',
      label: __('slug'),
      "class": 'text-center'
    }, {
      key: 'blogs_count',
      label: __('blogs_count'),
      "class": 'text-center'
    }, {
      key: 'status',
      label: __('status'),
      "class": 'text-center'
    }, {
      key: 'actions',
      label: __('actions'),
      "class": 'text-center'
    }]), _defineProperty(_ref, "perPage", 10), _defineProperty(_ref, "currentPage", 1), _defineProperty(_ref, "totalRows", 0), _defineProperty(_ref, "currentLanguageId", null), _defineProperty(_ref, "activeLanguages", []), _defineProperty(_ref, "translatableFields", ['name', 'meta_title', 'meta_keywords', 'meta_description']), _defineProperty(_ref, "translateSuccessMessage", ''), _defineProperty(_ref, "loadingEmpty", false), _defineProperty(_ref, "loadingOverwrite", false), _defineProperty(_ref, "pageOptions", [5, 10, 15, 20, 25, 50, 100]), _ref;
  },
  computed: {
    defaultLanguageId: function defaultLanguageId() {
      var d = this.languages.find(function (l) {
        return l.is_default === 1;
      });
      return d ? d.id : null;
    },
    translations: function translations() {
      return this.form.translations || {};
    },
    translatedCategories: function translatedCategories() {
      var _this = this;
      if (!this.currentLanguageId || !Array.isArray(this.categories)) {
        return this.categories;
      }
      return this.categories.map(function (category) {
        var translated = _objectSpread({}, category);
        if (Array.isArray(category.translations)) {
          var tr = category.translations.find(function (t) {
            return t.language_id === _this.currentLanguageId;
          });
          if (tr) {
            var _tr$name, _tr$meta_title, _tr$meta_keywords, _tr$meta_description;
            if ((_tr$name = tr.name) !== null && _tr$name !== void 0 && _tr$name.trim()) translated.name = tr.name;
            if ((_tr$meta_title = tr.meta_title) !== null && _tr$meta_title !== void 0 && _tr$meta_title.trim()) translated.meta_title = tr.meta_title;
            if ((_tr$meta_keywords = tr.meta_keywords) !== null && _tr$meta_keywords !== void 0 && _tr$meta_keywords.trim()) translated.meta_keywords = tr.meta_keywords;
            if ((_tr$meta_description = tr.meta_description) !== null && _tr$meta_description !== void 0 && _tr$meta_description.trim()) translated.meta_description = tr.meta_description;
          }
        }
        return translated;
      });
    }
  },
  mounted: function mounted() {
    var _this2 = this;
    this.fetchActiveLanguages().then(function () {
      _this2.getBlogCategories();
    });
    if (!this.languages.length) {
      this.getLanguages();
    }
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var res, appLocale, currentLang, def;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().get(_this3.$apiUrl + '/active_languages');
              case 3:
                res = _context.sent;
                if (res.data.status === 1 && Array.isArray(res.data.data)) {
                  _this3.activeLanguages = res.data.data;
                  appLocale = window.appLocale || 'en';
                  currentLang = _this3.activeLanguages.find(function (l) {
                    return l.code === appLocale;
                  });
                  if (currentLang) {
                    _this3.currentLanguageId = currentLang.id;
                  } else {
                    def = _this3.activeLanguages.find(function (l) {
                      return l.is_default === 1;
                    });
                    if (def) _this3.currentLanguageId = def.id;
                  }
                }
                _context.next = 10;
                break;
              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.error('Language load failed', _context.t0);
              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }))();
    },
    onModalHidden: function onModalHidden() {
      this.resetForm();
      this.edit_record = {};
      this.activeLangTab = this.getDefaultLangIndex();
      this.tabsKey++;
    },
    // change 
    getDefaultLangIndex: function getDefaultLangIndex() {
      var index = this.languages.findIndex(function (l) {
        return l.is_default === 1;
      });
      return index !== -1 ? index : 0;
    },
    //change 
    openAddModal: function openAddModal() {
      this.edit_record = {};
      this.resetForm();
      this.activeLangTab = this.getDefaultLangIndex();
      this.tabsKey++;
      this.create_new = true;
    },
    getLanguages: function getLanguages() {
      var _this4 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
        var res, unique, map;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().get(_this4.$apiUrl + '/active_languages');
              case 2:
                res = _context2.sent;
                // Remove duplicates by ID
                unique = [];
                map = new Set();
                res.data.data.forEach(function (lang) {
                  if (!map.has(lang.id)) {
                    map.add(lang.id);
                    unique.push(lang);
                  }
                });
                _this4.languages = unique;
                _this4.initTranslations();
              case 8:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }))();
    },
    generateSlug: function generateSlug(langId) {
      var name = this.form.translations[langId].name;
      if (!name) return;
      this.form.slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    },
    getBlogCategories: function getBlogCategories() {
      var _this5 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3() {
        var params, response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this5.isLoading = true;
                _context3.prev = 1;
                params = {
                  offset: (_this5.currentPage - 1) * _this5.perPage,
                  limit: _this5.perPage,
                  search: _this5.filter
                };
                _context3.next = 5;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().get(_this5.$apiUrl + '/blog_categories', {
                  params: params
                });
              case 5:
                response = _context3.sent;
                if (response.data.status === 1) {
                  _this5.categories = response.data.data;
                  _this5.totalRows = response.data.total;
                } else {
                  _this5.showMessage("error", response.data.message);
                }
                _context3.next = 12;
                break;
              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](1);
                _this5.showError(__('something_went_wrong'));
              case 12:
                _context3.prev = 12;
                _this5.isLoading = false;
                return _context3.finish(12);
              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 9, 12, 15]]);
      }))();
    },
    createSlug: function createSlug(langId) {
      var name = this.form.translations[langId].name;
      if (!name) return;
      this.form.slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    },
    openCreateModal: function openCreateModal() {
      this.resetForm();
      this.showModal = true;
    },
    openEditModal: function openEditModal(item) {
      var _this6 = this;
      this.editId = item.id;
      this.form.status = item.status;
      item.translations.forEach(function (t) {
        _this6.form.translations[t.language_id] = {
          name: t.name,
          meta_title: t.meta_title,
          meta_keywords: t.meta_keywords,
          meta_description: t.meta_description
        };
      });
      this.showModal = true;
    },
    saveCategory: function saveCategory() {
      var _this7 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4() {
        var defaultLang, defaultTranslation, filteredTranslations, payload, url, res;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // Validate default language name
                defaultLang = _this7.languages.find(function (l) {
                  return l.is_default;
                });
                if (defaultLang) {
                  _context4.next = 5;
                  break;
                }
                _this7.showError(__('default_language_not_found'));
                _this7.isSubmitting = false;
                return _context4.abrupt("return");
              case 5:
                defaultTranslation = _this7.form.translations[defaultLang.id];
                if (!(!defaultTranslation || !defaultTranslation.name || defaultTranslation.name.trim() === '')) {
                  _context4.next = 11;
                  break;
                }
                _this7.showError(__('please_fill_default_language_required_fields'));
                _this7.activeLangTab = _this7.getDefaultLangIndex();
                _this7.isSubmitting = false;
                return _context4.abrupt("return");
              case 11:
                _this7.isSubmitting = true;

                // Filter translations to only include those with actual data
                // Ensure language IDs are sent as integers to match backend expectations
                filteredTranslations = {}; // First, always add default language translation (it's required)
                filteredTranslations[defaultLang.id] = {
                  name: defaultTranslation.name.trim() || '',
                  meta_title: defaultTranslation.meta_title || '',
                  meta_keywords: defaultTranslation.meta_keywords || '',
                  meta_description: defaultTranslation.meta_description || ''
                };

                // Then add other languages that have data
                Object.keys(_this7.form.translations).forEach(function (langId) {
                  var langIdInt = parseInt(langId);

                  // Skip default language as we already added it
                  if (langIdInt === defaultLang.id) {
                    return;
                  }
                  var tr = _this7.form.translations[langId];

                  // Check if translation has any meaningful data
                  var hasData = tr.name && tr.name.trim() !== '' || tr.meta_title && tr.meta_title.trim() !== '' || tr.meta_keywords && tr.meta_keywords.trim() !== '' || tr.meta_description && tr.meta_description.trim() !== '';
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
                if (!(!filteredTranslations[defaultLang.id] || !filteredTranslations[defaultLang.id].name || filteredTranslations[defaultLang.id].name.trim() === '')) {
                  _context4.next = 20;
                  break;
                }
                _this7.showError(__('please_fill_default_language_required_fields'));
                _this7.activeLangTab = _this7.getDefaultLangIndex();
                _this7.isSubmitting = false;
                return _context4.abrupt("return");
              case 20:
                payload = {
                  id: _this7.edit_record.id || null,
                  slug: _this7.form.slug,
                  status: _this7.form.status,
                  translations: filteredTranslations
                };
                url = _this7.edit_record.id ? '/blog_categories/update' : '/blog_categories/save';
                _context4.prev = 22;
                _context4.next = 25;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().post(_this7.$apiUrl + url, payload);
              case 25:
                res = _context4.sent;
                if (res.data.status === 1) {
                  _this7.$toast.success(res.data.message);
                  _this7.create_new = false;
                  _this7.getBlogCategories();
                  _this7.resetForm();
                } else {
                  _this7.showError(res.data.message);
                }
                _context4.next = 32;
                break;
              case 29:
                _context4.prev = 29;
                _context4.t0 = _context4["catch"](22);
                _this7.showError(__('something_went_wrong'));
              case 32:
                _context4.prev = 32;
                _this7.isSubmitting = false;
                return _context4.finish(32);
              case 35:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[22, 29, 32, 35]]);
      }))();
    },
    deleteCategory: function deleteCategory(id) {
      var _this8 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_be_able_to_revert_this'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then( /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5(result) {
          var res;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  if (result.value) {
                    _context5.next = 2;
                    break;
                  }
                  return _context5.abrupt("return");
                case 2:
                  _context5.prev = 2;
                  _context5.next = 5;
                  return axios__WEBPACK_IMPORTED_MODULE_1___default().post(_this8.$apiUrl + '/blog_categories/delete/' + id);
                case 5:
                  res = _context5.sent;
                  if (res.data.status === 1) {
                    _this8.$toast.success(res.data.message);
                    _this8.getBlogCategories();
                  } else {
                    _this8.$toast.error(res.data.message);
                  }
                  _context5.next = 12;
                  break;
                case 9:
                  _context5.prev = 9;
                  _context5.t0 = _context5["catch"](2);
                  _this8.showError(__('something_went_wrong'));
                case 12:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, null, [[2, 9]]);
        }));
        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }());
    },
    initTranslations: function initTranslations() {
      var _this9 = this;
      this.form.translations = {};
      this.languages.forEach(function (lang) {
        _this9.$set(_this9.form.translations, lang.id, {
          name: '',
          meta_title: '',
          meta_keywords: '',
          meta_description: ''
        });
      });
    },
    resetForm: function resetForm() {
      var _this10 = this;
      this.form.slug = '';
      this.form.status = 1;
      Object.keys(this.form.translations).forEach(function (id) {
        _this10.form.translations[id].name = '';
        _this10.form.translations[id].meta_title = '';
        _this10.form.translations[id].meta_keywords = '';
        _this10.form.translations[id].meta_description = '';
      });
      this.edit_record = {};
    },
    closeModal: function closeModal() {
      this.showModal = false;
      this.resetForm();
    }
  },
  watch: {
    edit_record: function edit_record(val) {
      var _this11 = this;
      if (!(val !== null && val !== void 0 && val.id)) return;
      this.tabsKey++;
      this.form.slug = val.slug;
      this.form.status = val.status;

      // Get default language for fallback
      var defaultLang = this.languages.find(function (l) {
        return l.is_default;
      });

      // Load translations from API response - only populate languages that have translations
      if (Array.isArray(val.translations) && val.translations.length > 0) {
        val.translations.forEach(function (tr) {
          if (_this11.form.translations[tr.language_id]) {
            // Only populate if translation has data
            var hasData = tr.name && tr.name.trim() !== '';
            if (hasData) {
              _this11.form.translations[tr.language_id] = {
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
        var defaultTranslation = this.form.translations[defaultLang.id];

        // Check if default language translation is missing or empty
        var isMissing = !defaultTranslation || !defaultTranslation.name || defaultTranslation.name.trim() === '';
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
    currentPage: function currentPage() {
      this.getBlogCategories();
    },
    perPage: function perPage() {
      this.getBlogCategories();
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

/***/ "./resources/js/views/Blogs/BlogCategories.vue":
/*!*****************************************************!*\
  !*** ./resources/js/views/Blogs/BlogCategories.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BlogCategories_vue_vue_type_template_id_ac7e704a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BlogCategories.vue?vue&type=template&id=ac7e704a */ "./resources/js/views/Blogs/BlogCategories.vue?vue&type=template&id=ac7e704a");
/* harmony import */ var _BlogCategories_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BlogCategories.vue?vue&type=script&lang=js */ "./resources/js/views/Blogs/BlogCategories.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BlogCategories_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BlogCategories_vue_vue_type_template_id_ac7e704a__WEBPACK_IMPORTED_MODULE_0__.render,
  _BlogCategories_vue_vue_type_template_id_ac7e704a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Blogs/BlogCategories.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Blogs/BlogCategories.vue?vue&type=script&lang=js":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/Blogs/BlogCategories.vue?vue&type=script&lang=js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogCategories_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogCategories.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/BlogCategories.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogCategories_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Blogs/BlogCategories.vue?vue&type=template&id=ac7e704a":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/Blogs/BlogCategories.vue?vue&type=template&id=ac7e704a ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogCategories_vue_vue_type_template_id_ac7e704a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogCategories_vue_vue_type_template_id_ac7e704a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BlogCategories_vue_vue_type_template_id_ac7e704a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BlogCategories.vue?vue&type=template&id=ac7e704a */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/BlogCategories.vue?vue&type=template&id=ac7e704a");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/BlogCategories.vue?vue&type=template&id=ac7e704a":
/*!**************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/BlogCategories.vue?vue&type=template&id=ac7e704a ***!
  \**************************************************************************************************************************************************************************************************************************/
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
          _vm._v(_vm._s(_vm.__("blog_categories"))),
        ]),
        _vm._v(" "),
        _vm.$can("blog_category_create")
          ? _c(
              "button",
              {
                staticClass:
                  "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap",
                on: { click: _vm.openAddModal },
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
                on: {
                  input: function ($event) {
                    _vm.currentPage = 1
                    _vm.getBlogCategories()
                  },
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
                  return _vm.getBlogCategories()
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
                  key: "cell(status)",
                  fn: function (row) {
                    return [
                      row.item.status == 1
                        ? _c("span", { staticClass: "badge bg-success" }, [
                            _vm._v(_vm._s(_vm.__("active"))),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      row.item.status == 0
                        ? _c("span", { staticClass: "badge bg-danger" }, [
                            _vm._v(_vm._s(_vm.__("deactive"))),
                          ])
                        : _vm._e(),
                    ]
                  },
                },
                {
                  key: "cell(blogs_count)",
                  fn: function (row) {
                    return [
                      _c("span", { staticClass: "badge bg-info" }, [
                        _vm._v(_vm._s(row.item.active_blogs_count || 0)),
                      ]),
                    ]
                  },
                },
                {
                  key: "cell(actions)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "list-actions" }, [
                        _vm.$can("blog_category_update")
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
                        _vm.$can("blog_category_delete")
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
                                    return _vm.deleteCategory(row.item.id)
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
      _c(
        "b-modal",
        {
          attrs: {
            title: _vm.edit_record.id
              ? _vm.__("edit_category")
              : _vm.__("add_category"),
            size: "lg",
            "hide-footer": true,
          },
          on: { hidden: _vm.onModalHidden },
          model: {
            value: _vm.create_new,
            callback: function ($$v) {
              _vm.create_new = $$v
            },
            expression: "create_new",
          },
        },
        [
          _c(
            "form",
            {
              attrs: { novalidate: "" },
              on: {
                submit: function ($event) {
                  $event.preventDefault()
                  return _vm.saveCategory.apply(null, arguments)
                },
              },
            },
            [
              _c(
                "b-tabs",
                {
                  key: _vm.tabsKey,
                  attrs: { "content-class": "mt-3" },
                  model: {
                    value: _vm.activeLangTab,
                    callback: function ($$v) {
                      _vm.activeLangTab = $$v
                    },
                    expression: "activeLangTab",
                  },
                },
                _vm._l(_vm.languages, function (lang, index) {
                  return _c(
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
                                    class: { "text-primary": lang.is_default },
                                  },
                                  [
                                    _vm._v(
                                      "\n              " +
                                        _vm._s(lang.name) +
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
                                            _vm.__("translate_empty_fields")
                                          )
                                        ),
                                      ])
                                    : _c("b-spinner", { attrs: { small: "" } }),
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
                                            _vm.__("translate_and_overwrite")
                                          )
                                        ),
                                      ])
                                    : _c("b-spinner", { attrs: { small: "" } }),
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _vm.translateSuccessMessage
                                ? _c(
                                    "div",
                                    {
                                      staticClass:
                                        "text-success mt-2 font-weight-bold",
                                    },
                                    [
                                      _vm._v(
                                        "\n              " +
                                          _vm._s(_vm.translateSuccessMessage) +
                                          "\n            "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                            ],
                            1
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      lang.is_default
                        ? _c(
                            "div",
                            { staticClass: "d-flex align-items-end mb-3" },
                            [
                              _c(
                                "div",
                                { staticClass: "form-group flex-grow-1 me-2" },
                                [
                                  _c("label", [
                                    _vm._v(_vm._s(_vm.__("category_name"))),
                                  ]),
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
                                        value:
                                          _vm.form.translations[lang.id].name,
                                        expression:
                                          "form.translations[lang.id].name",
                                      },
                                    ],
                                    staticClass: "form-control",
                                    attrs: {
                                      type: "text",
                                      required: "",
                                      placeholder: _vm.__(
                                        "enter_category_name"
                                      ),
                                    },
                                    domProps: {
                                      value:
                                        _vm.form.translations[lang.id].name,
                                    },
                                    on: {
                                      keyup: function ($event) {
                                        return _vm.createSlug(lang.id)
                                      },
                                      input: function ($event) {
                                        if ($event.target.composing) {
                                          return
                                        }
                                        _vm.$set(
                                          _vm.form.translations[lang.id],
                                          "name",
                                          $event.target.value
                                        )
                                      },
                                    },
                                  }),
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "form-group flex-grow-1" },
                                [
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
                                        value: _vm.form.slug,
                                        expression: "form.slug",
                                      },
                                    ],
                                    staticClass: "form-control",
                                    attrs: {
                                      type: "text",
                                      placeholder: _vm.__("enter_slug"),
                                      required: "",
                                    },
                                    domProps: { value: _vm.form.slug },
                                    on: {
                                      input: function ($event) {
                                        if ($event.target.composing) {
                                          return
                                        }
                                        _vm.$set(
                                          _vm.form,
                                          "slug",
                                          $event.target.value
                                        )
                                      },
                                    },
                                  }),
                                ]
                              ),
                            ]
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      !lang.is_default
                        ? _c("div", { staticClass: "form-group" }, [
                            _c("label", [
                              _vm._v(_vm._s(_vm.__("category_name"))),
                            ]),
                            _vm._v(" "),
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.form.translations[lang.id].name,
                                  expression: "form.translations[lang.id].name",
                                },
                              ],
                              staticClass: "form-control",
                              attrs: {
                                type: "text",
                                placeholder: _vm.__("enter_category_name"),
                              },
                              domProps: {
                                value: _vm.form.translations[lang.id].name,
                              },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.$set(
                                    _vm.form.translations[lang.id],
                                    "name",
                                    $event.target.value
                                  )
                                },
                              },
                            }),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _c("div", { staticClass: "form-group" }, [
                        _c("label", [_vm._v(_vm._s(_vm.__("meta_title")))]),
                        _vm._v(" "),
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.form.translations[lang.id].meta_title,
                              expression:
                                "form.translations[lang.id].meta_title",
                            },
                          ],
                          staticClass: "form-control",
                          attrs: {
                            type: "text",
                            placeholder: _vm.__("enter_meta_title"),
                          },
                          domProps: {
                            value: _vm.form.translations[lang.id].meta_title,
                          },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.form.translations[lang.id],
                                "meta_title",
                                $event.target.value
                              )
                            },
                          },
                        }),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "row" }, [
                        _c("div", { staticClass: "col-md-6" }, [
                          _c("div", { staticClass: "form-group" }, [
                            _c("label", [
                              _vm._v(_vm._s(_vm.__("meta_keywords"))),
                            ]),
                            _vm._v(" "),
                            _c("textarea", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value:
                                    _vm.form.translations[lang.id]
                                      .meta_keywords,
                                  expression:
                                    "form.translations[lang.id].meta_keywords",
                                },
                              ],
                              staticClass: "form-control",
                              attrs: {
                                placeholder: _vm.__("enter_meta_keywords"),
                                rows: "3",
                              },
                              domProps: {
                                value:
                                  _vm.form.translations[lang.id].meta_keywords,
                              },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.$set(
                                    _vm.form.translations[lang.id],
                                    "meta_keywords",
                                    $event.target.value
                                  )
                                },
                              },
                            }),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "col-md-6" }, [
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
                                    _vm.form.translations[lang.id]
                                      .meta_description,
                                  expression:
                                    "form.translations[lang.id].meta_description",
                                },
                              ],
                              staticClass: "form-control",
                              attrs: {
                                placeholder: _vm.__("enter_meta_description"),
                                rows: "3",
                              },
                              domProps: {
                                value:
                                  _vm.form.translations[lang.id]
                                    .meta_description,
                              },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.$set(
                                    _vm.form.translations[lang.id],
                                    "meta_description",
                                    $event.target.value
                                  )
                                },
                              },
                            }),
                          ]),
                        ]),
                      ]),
                      _vm._v(" "),
                      lang.is_default
                        ? _c("div", { staticClass: "form-group" }, [
                            _c("label", [_vm._v(_vm._s(_vm.__("status")))]),
                            _vm._v(" "),
                            _c(
                              "div",
                              { staticClass: "col-md-9 text-left mt-1" },
                              [
                                _c("b-form-radio-group", {
                                  attrs: {
                                    options: [
                                      { text: _vm.__("deactivate"), value: 0 },
                                      { text: _vm.__("activate"), value: 1 },
                                    ],
                                    buttons: "",
                                    "button-variant": "outline-primary",
                                    required: "",
                                  },
                                  model: {
                                    value: _vm.form.status,
                                    callback: function ($$v) {
                                      _vm.$set(_vm.form, "status", $$v)
                                    },
                                    expression: "form.status",
                                  },
                                }),
                              ],
                              1
                            ),
                          ])
                        : _vm._e(),
                    ]
                  )
                }),
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "form-group d-flex justify-content-end" },
                [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-secondary mr-2",
                      attrs: { type: "button" },
                      on: {
                        click: function ($event) {
                          _vm.create_new = false
                          _vm.resetForm()
                        },
                      },
                    },
                    [_vm._v(_vm._s(_vm.__("cancel")))]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary",
                      attrs: { type: "submit", disabled: _vm.isSubmitting },
                    },
                    [
                      _vm.isSubmitting
                        ? _c("span", [_vm._v(_vm._s(_vm.__("saving")) + "...")])
                        : _c("span", [_vm._v(_vm._s(_vm.__("save")))]),
                    ]
                  ),
                ]
              ),
            ],
            1
          ),
        ]
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);