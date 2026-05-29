"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Setting_SeoSettings_SeoSettings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
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



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: {
    'record': Object
  },
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  data: function data() {
    var _this$record, _this$record2;
    return {
      error: null,
      isLoading: false,
      languages: [],
      activeLanguageTab: 0,
      defaultLanguageId: null,
      id: ((_this$record = this.record) === null || _this$record === void 0 ? void 0 : _this$record.id) || null,
      page_type: ((_this$record2 = this.record) === null || _this$record2 === void 0 ? void 0 : _this$record2.page_type) || 'Home',
      translations: {},
      og_image: null,
      og_image_url: this.record ? this.record.og_image_url : null,
      translatableFields: ['meta_title', 'meta_keyword', 'schema_markup', 'meta_description'],
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false,
      pages: [{
        id: 1,
        name: 'Home',
        value: 'Home'
      }, {
        id: 2,
        name: 'About us',
        value: 'About us'
      }, {
        id: 3,
        name: 'Contact us',
        value: 'Contact us'
      }, {
        id: 4,
        name: 'Faqs',
        value: 'Faqs'
      }, {
        id: 5,
        name: 'Term condition',
        value: 'Term condition'
      }, {
        id: 6,
        name: 'Product listing page',
        value: 'Product listing page'
      }, {
        id: 7,
        name: 'Privacy policy',
        value: 'Privacy policy'
      }, {
        id: 8,
        name: 'Return exchange policy',
        value: 'Return exchange policy'
      }, {
        id: 9,
        name: 'Shipping policy',
        value: 'Shipping policy'
      }, {
        id: 10,
        name: 'Cancellation policy',
        value: 'Cancellation policy'
      }, {
        id: 11,
        name: 'blog_listing_page',
        value: 'Blog Listing Page'
      }]
    };
  },
  computed: {
    modal_title: function modal_title() {
      return this.id ? __('edit_seo_setting') : __('add_seo_setting');
    }
  },
  methods: {
    triggerFileInput: function triggerFileInput() {
      var _this = this;
      this.$nextTick(function () {
        var ref = _this.$refs.file_image_default;
        var el = Array.isArray(ref) ? ref[0] : ref;
        if (el && typeof el.click === 'function') {
          el.click();
        }
      });
    },
    showModal: function showModal() {
      this.$refs['my-modal'].show();
    },
    hideModal: function hideModal() {
      this.$refs['my-modal'].hide();
    },
    validateDefaultLanguageForTranslation: function validateDefaultLanguageForTranslation() {
      var _this2 = this;
      var defaultData = this.translations[this.defaultLanguageId];
      var requiredFields = ['meta_title', 'meta_keyword', 'schema_markup', 'meta_description'];
      var missingFields = requiredFields.filter(function (f) {
        return !(defaultData !== null && defaultData !== void 0 && defaultData[f]) || String(defaultData[f]).trim() === '';
      });
      if (missingFields.length > 0) {
        this.showError(__('please_fill_default_language_required_fields') || 'Please fill SEO fields in default language');
        this.$nextTick(function () {
          return _this2.switchToDefaultLanguageTab();
        });
        return false;
      }
      var form = this.$refs['my-form'];
      if (form && !form.reportValidity()) {
        this.$nextTick(function () {
          return _this2.switchToDefaultLanguageTab();
        });
        return false;
      }
      return true;
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this3 = this;
      var index = this.languages.findIndex(function (lang) {
        return lang.id === _this3.defaultLanguageId;
      });
      if (index !== -1) this.activeLanguageTab = index;
    },
    dropFile: function dropFile(event) {
      event.preventDefault();
      var ref = this.$refs.file_image_default;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (!input) return;
      input.files = event.dataTransfer.files;
      this.handleFileUpload();
    },
    handleFileUpload: function handleFileUpload() {
      var ref = this.$refs.file_image_default;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (!input || !input.files || !input.files.length) return;
      var file = input.files[0];
      this.error = null;
      var validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];
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
    fetchLanguages: function fetchLanguages() {
      var _this4 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/active_languages').then(function (res) {
        var _this4$languages$find;
        _this4.languages = res.data.data || [];
        var obj = {};
        _this4.languages.forEach(function (l) {
          obj[l.id] = {
            meta_title: '',
            meta_keyword: '',
            schema_markup: '',
            meta_description: ''
          };
        });
        _this4.translations = obj;
        _this4.defaultLanguageId = ((_this4$languages$find = _this4.languages.find(function (l) {
          return l.is_default;
        })) === null || _this4$languages$find === void 0 ? void 0 : _this4$languages$find.id) || null;
      });
    },
    initTranslations: function initTranslations() {
      var obj = {};
      this.languages.forEach(function (l) {
        obj[l.id] = {
          meta_title: '',
          meta_keyword: '',
          schema_markup: '',
          meta_description: ''
        };
      });
      this.translations = obj;
    },
    loadSeoTranslations: function loadSeoTranslations() {
      var _this5 = this;
      if (!this.record) return;
      var updatedTranslations = _objectSpread({}, this.translations);
      if (Array.isArray(this.record.translations)) {
        this.record.translations.forEach(function (t) {
          updatedTranslations[t.language_id] = {
            meta_title: t.meta_title || '',
            meta_keyword: t.meta_keyword || '',
            schema_markup: t.schema_markup || '',
            meta_description: t.meta_description || ''
          };
        });
      }
      this.languages.forEach(function (language) {
        var langId = language.id;
        var tr = updatedTranslations[langId];
        var isEmpty = !tr || !tr.meta_title && !tr.meta_keyword && !tr.schema_markup && !tr.meta_description;
        if (language.is_default && isEmpty) {
          updatedTranslations[langId] = {
            meta_title: _this5.record.meta_title || '',
            meta_keyword: _this5.record.meta_keyword || '',
            schema_markup: _this5.record.schema_markup || '',
            meta_description: _this5.record.meta_description || ''
          };
        }
      });
      this.translations = updatedTranslations;
    },
    saveRecord: function saveRecord() {
      var _this6 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var seoId, langs, _iterator, _step, _loop, _ret, _e$response, _e$response$data, msg;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (_this6.validateDefaultLanguageForTranslation()) {
                  _context2.next = 2;
                  break;
                }
                return _context2.abrupt("return");
              case 2:
                if (!(!_this6.id && !_this6.og_image)) {
                  _context2.next = 6;
                  break;
                }
                _this6.showError(__('please_upload_og_image') || 'Please upload OG image');
                _this6.$nextTick(function () {
                  return _this6.switchToDefaultLanguageTab();
                });
                return _context2.abrupt("return");
              case 6:
                _this6.isLoading = true;
                seoId = _this6.id;
                _context2.prev = 8;
                langs = [].concat(_toConsumableArray(_this6.languages.filter(function (l) {
                  return l.is_default;
                })), _toConsumableArray(_this6.languages.filter(function (l) {
                  return !l.is_default;
                })));
                _iterator = _createForOfIteratorHelper(langs);
                _context2.prev = 11;
                _loop = /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _loop() {
                  var _res$data, _res$data2, _res$data2$data;
                  var lang, fd, url, res;
                  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _loop$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          lang = _step.value;
                          fd = new FormData();
                          if (seoId) fd.append('id', seoId);
                          fd.append('language_id', lang.id);
                          fd.append('page_type', _this6.page_type);
                          Object.entries(_this6.translations[lang.id] || {}).forEach(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 2),
                              k = _ref2[0],
                              v = _ref2[1];
                            return fd.append(k, v || '');
                          });
                          if (lang.is_default && _this6.og_image) {
                            fd.append('og_image', _this6.og_image);
                          }
                          url = _this6.$apiUrl + (seoId ? '/seo_settings/update' : '/seo_settings/save');
                          _context.next = 10;
                          return axios__WEBPACK_IMPORTED_MODULE_1___default().post(url, fd);
                        case 10:
                          res = _context.sent;
                          if (!((res === null || res === void 0 ? void 0 : (_res$data = res.data) === null || _res$data === void 0 ? void 0 : _res$data.status) === 0)) {
                            _context.next = 15;
                            break;
                          }
                          _this6.showError(res.data.message || __('something_went_wrong'));
                          _this6.$nextTick(function () {
                            return _this6.switchToDefaultLanguageTab();
                          });
                          return _context.abrupt("return", {
                            v: void 0
                          });
                        case 15:
                          if (!seoId && res !== null && res !== void 0 && (_res$data2 = res.data) !== null && _res$data2 !== void 0 && (_res$data2$data = _res$data2.data) !== null && _res$data2$data !== void 0 && _res$data2$data.id) {
                            seoId = res.data.data.id;
                          }
                        case 16:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _loop);
                });
                _iterator.s();
              case 14:
                if ((_step = _iterator.n()).done) {
                  _context2.next = 21;
                  break;
                }
                return _context2.delegateYield(_loop(), "t0", 16);
              case 16:
                _ret = _context2.t0;
                if (!(_typeof(_ret) === "object")) {
                  _context2.next = 19;
                  break;
                }
                return _context2.abrupt("return", _ret.v);
              case 19:
                _context2.next = 14;
                break;
              case 21:
                _context2.next = 26;
                break;
              case 23:
                _context2.prev = 23;
                _context2.t1 = _context2["catch"](11);
                _iterator.e(_context2.t1);
              case 26:
                _context2.prev = 26;
                _iterator.f();
                return _context2.finish(26);
              case 29:
                _this6.$eventBus.$emit('SeoSettingSaved', __('seo_setting_saved_successfully'));
                _this6.hideModal();
                _context2.next = 38;
                break;
              case 33:
                _context2.prev = 33;
                _context2.t2 = _context2["catch"](8);
                console.error(_context2.t2);
                msg = (_context2.t2 === null || _context2.t2 === void 0 ? void 0 : (_e$response = _context2.t2.response) === null || _e$response === void 0 ? void 0 : (_e$response$data = _e$response.data) === null || _e$response$data === void 0 ? void 0 : _e$response$data.message) || __('something_went_wrong');
                _this6.showError ? _this6.showError(msg) : alert(msg);
              case 38:
                _context2.prev = 38;
                _this6.isLoading = false;
                return _context2.finish(38);
              case 41:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, null, [[8, 33, 38, 41], [11, 23, 26, 29]]);
      }))();
    }
  },
  mounted: function mounted() {
    var _this7 = this;
    this.showModal();
    this.fetchLanguages().then(function () {
      _this7.initTranslations();
      _this7.loadSeoTranslations();
    });
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue */ "./resources/js/views/Setting/SeoSettings/Edit.vue");
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
        key: 'page_type',
        label: __('page_type'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'meta_title',
        label: __('meta_title'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'meta_keyword',
        label: __('meta_keywords'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'schema_markup',
        label: __('schema_markup'),
        "class": 'text-center'
      }, {
        key: 'meta_description',
        label: __('meta_description'),
        "class": 'text-center'
      }, {
        key: 'og_image',
        label: __('og_image'),
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
      seo_settings: [],
      isLoading: false,
      sectionStyle: 'style_1',
      create_new: null,
      edit_record: null,
      settingModalShow: false,
      // View more functionality data
      expandedSchema: {},
      expandedMeta: {},
      maxLength: 100,
      activeLanguages: [],
      currentLanguageId: null
    };
  },
  computed: {
    translatedSeoSettings: function translatedSeoSettings() {
      var _this = this;
      if (!this.currentLanguageId) return this.seo_settings;
      return this.seo_settings.map(function (item) {
        var translated = _objectSpread({}, item);
        if (item.translations && Array.isArray(item.translations)) {
          var t = item.translations.find(function (tr) {
            return tr.language_id === _this.currentLanguageId;
          });
          if (t) {
            var _t$meta_title, _t$meta_keyword, _t$schema_markup, _t$meta_description;
            translated.meta_title = ((_t$meta_title = t.meta_title) === null || _t$meta_title === void 0 ? void 0 : _t$meta_title.trim()) !== '' ? t.meta_title : item.meta_title;
            translated.meta_keyword = ((_t$meta_keyword = t.meta_keyword) === null || _t$meta_keyword === void 0 ? void 0 : _t$meta_keyword.trim()) !== '' ? t.meta_keyword : item.meta_keyword;
            translated.schema_markup = ((_t$schema_markup = t.schema_markup) === null || _t$schema_markup === void 0 ? void 0 : _t$schema_markup.trim()) !== '' ? t.schema_markup : item.schema_markup;
            translated.meta_description = ((_t$meta_description = t.meta_description) === null || _t$meta_description === void 0 ? void 0 : _t$meta_description.trim()) !== '' ? t.meta_description : item.meta_description;
          }
        }
        return translated;
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
  mounted: function mounted() {},
  watch: {
    $route: function $route(to, from) {
      this.showCreateModal();
    },
    currentPage: function currentPage(newPage) {
      this.getSeoSettings();
    },
    perPage: function perPage(newPerPage) {
      this.getSeoSettings();
    }
  },
  created: function created() {
    var _this2 = this;
    this.$eventBus.$on('SeoSettingSaved', function (message) {
      _this2.showMessage('success', message);
      _this2.getSeoSettings();
      _this2.create_new = null;
    });
    this.fetchActiveLanguages().then(function () {
      _this2.getSeoSettings();
    });
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      return axios.get(this.$apiUrl + '/active_languages').then(function (response) {
        if (response.data.data && Array.isArray(response.data.data)) {
          _this3.activeLanguages = response.data.data;
          var appLocale = window.appLocale || 'en';
          var currentLang = _this3.activeLanguages.find(function (l) {
            return l.code === appLocale;
          });
          if (!currentLang) {
            currentLang = _this3.activeLanguages.find(function (l) {
              return l.is_default === 1;
            });
          }
          _this3.currentLanguageId = currentLang ? currentLang.id : null;
        }
      });
    },
    getSeoSettings: function getSeoSettings() {
      var _this4 = this;
      this.isLoading = true;
      var params = {
        offset: this.currentPage,
        limit: this.perPage,
        filter: this.filter
      };
      axios.get(this.$apiUrl + '/seo_settings', {
        params: params
      }).then(function (response) {
        _this4.isLoading = false;
        var data = response.data;
        _this4.seo_settings = data.data;
        _this4.totalRows = data.total;
      });
    },
    deleteSeoSettings: function deleteSeoSettings(index, id) {
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
          axios.post(_this5.$apiUrl + '/seo_settings/delete', postData).then(function (response) {
            _this5.isLoading = false;
            var data = response.data;
            _this5.seo_settings.splice(index, 1);
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
      this.getSeoSettings();
    },
    // View more functionality methods
    toggleSchemaExpansion: function toggleSchemaExpansion(id) {
      this.$set(this.expandedSchema, id, !this.expandedSchema[id]);
    },
    toggleMetaExpansion: function toggleMetaExpansion(id) {
      this.$set(this.expandedMeta, id, !this.expandedMeta[id]);
    },
    shouldTruncate: function shouldTruncate(text) {
      return text && text.length > this.maxLength;
    },
    getTruncatedText: function getTruncatedText(text) {
      if (!text) return '';
      return text.length > this.maxLength ? text.substring(0, this.maxLength) + '...' : text;
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.image_preview[data-v-6878e357] {\n  margin-top: 5px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_6878e357_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_6878e357_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_6878e357_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Setting/SeoSettings/Edit.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/Setting/SeoSettings/Edit.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue_vue_type_template_id_6878e357_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=6878e357&scoped=true */ "./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=template&id=6878e357&scoped=true");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js */ "./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=script&lang=js");
/* harmony import */ var _Edit_vue_vue_type_style_index_0_id_6878e357_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css */ "./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_6878e357_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Edit_vue_vue_type_template_id_6878e357_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "6878e357",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Setting/SeoSettings/Edit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Setting/SeoSettings/SeoSettings.vue":
/*!****************************************************************!*\
  !*** ./resources/js/views/Setting/SeoSettings/SeoSettings.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SeoSettings_vue_vue_type_template_id_e265d63a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SeoSettings.vue?vue&type=template&id=e265d63a */ "./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=template&id=e265d63a");
/* harmony import */ var _SeoSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SeoSettings.vue?vue&type=script&lang=js */ "./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SeoSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _SeoSettings_vue_vue_type_template_id_e265d63a__WEBPACK_IMPORTED_MODULE_0__.render,
  _SeoSettings_vue_vue_type_template_id_e265d63a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Setting/SeoSettings/SeoSettings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SeoSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SeoSettings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SeoSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_6878e357_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=style&index=0&id=6878e357&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=template&id=6878e357&scoped=true":
/*!***************************************************************************************************!*\
  !*** ./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=template&id=6878e357&scoped=true ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_6878e357_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_6878e357_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_6878e357_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=template&id=6878e357&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=template&id=6878e357&scoped=true");


/***/ }),

/***/ "./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=template&id=e265d63a":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=template&id=e265d63a ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeoSettings_vue_vue_type_template_id_e265d63a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeoSettings_vue_vue_type_template_id_e265d63a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SeoSettings_vue_vue_type_template_id_e265d63a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./SeoSettings.vue?vue&type=template&id=e265d63a */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=template&id=e265d63a");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=template&id=6878e357&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/Edit.vue?vue&type=template&id=6878e357&scoped=true ***!
  \******************************************************************************************************************************************************************************************************************************************/
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
                                      "\n            " +
                                        _vm._s(language.name) +
                                        "\n          "
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
                                      return _vm.translateOverwrite(language)
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
                                        "\n            " +
                                          _vm._s(_vm.translateSuccessMessage) +
                                          "\n          "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                            ],
                            1
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _c("div", { staticClass: "row" }, [
                        language.is_default
                          ? _c("div", { staticClass: "form-group col-md-12" }, [
                              _c("label", [_vm._v(_vm._s(_vm.__("SEO Page")))]),
                              _vm._v(" "),
                              _c(
                                "select",
                                {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.page_type,
                                      expression: "page_type",
                                    },
                                  ],
                                  staticClass: "form-control form-select",
                                  on: {
                                    change: function ($event) {
                                      var $$selectedVal = Array.prototype.filter
                                        .call(
                                          $event.target.options,
                                          function (o) {
                                            return o.selected
                                          }
                                        )
                                        .map(function (o) {
                                          var val =
                                            "_value" in o ? o._value : o.value
                                          return val
                                        })
                                      _vm.page_type = $event.target.multiple
                                        ? $$selectedVal
                                        : $$selectedVal[0]
                                    },
                                  },
                                },
                                _vm._l(_vm.pages, function (page) {
                                  return _c(
                                    "option",
                                    {
                                      key: page.id,
                                      domProps: { value: page.value },
                                    },
                                    [
                                      _vm._v(
                                        "\n                " +
                                          _vm._s(_vm.__(page.name)) +
                                          "\n              "
                                      ),
                                    ]
                                  )
                                }),
                                0
                              ),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _c("div", { staticClass: "form-group col-md-12" }, [
                          _c("label", [_vm._v(_vm._s(_vm.__("meta_title")))]),
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
                                value: _vm.translations[language.id].meta_title,
                                expression:
                                  "translations[language.id].meta_title",
                              },
                            ],
                            staticClass: "form-control",
                            attrs: {
                              type: "text",
                              placeholder: _vm.__("enter_meta_title"),
                              required:
                                language.is_default == 1 ? true : undefined,
                            },
                            domProps: {
                              value: _vm.translations[language.id].meta_title,
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
                        _c("div", { staticClass: "form-group col-md-12" }, [
                          _c("label", [_vm._v(_vm._s(_vm.__("meta_keyword")))]),
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
                                  _vm.translations[language.id].meta_keyword,
                                expression:
                                  "translations[language.id].meta_keyword",
                              },
                            ],
                            staticClass: "form-control",
                            attrs: {
                              type: "text",
                              placeholder: _vm.__("enter_meta_keywords"),
                              required:
                                language.is_default == 1 ? true : undefined,
                            },
                            domProps: {
                              value: _vm.translations[language.id].meta_keyword,
                            },
                            on: {
                              input: function ($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.$set(
                                  _vm.translations[language.id],
                                  "meta_keyword",
                                  $event.target.value
                                )
                              },
                            },
                          }),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "form-group col-md-12" }, [
                          _c(
                            "label",
                            [
                              _vm._v(
                                "\n              " +
                                  _vm._s(_vm.__("schema_markup")) +
                                  "\n              "
                              ),
                              _c(
                                "small",
                                {
                                  staticClass:
                                    "d-inline-flex px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary rounded-2",
                                  attrs: { id: "schema_markup" },
                                },
                                [_c("i", { staticClass: "fa fa-info-circle" })]
                              ),
                              _vm._v(" "),
                              _c(
                                "b-popover",
                                {
                                  attrs: {
                                    target: "schema_markup",
                                    triggers: "hover",
                                    placement: "left",
                                  },
                                },
                                [
                                  _c("p", [
                                    _vm._v(
                                      "Schema markup helps search engines understand your content. Generate markup using\n                  "
                                    ),
                                    _c(
                                      "a",
                                      {
                                        attrs: {
                                          href: "https://www.rankranger.com/schema-markup-generator",
                                          target: "_blank",
                                        },
                                      },
                                      [_vm._v("this\n                    tool")]
                                    ),
                                    _vm._v(".\n                "),
                                  ]),
                                ]
                              ),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          language.is_default
                            ? _c("i", { staticClass: "text-danger" }, [
                                _vm._v("*"),
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          _c("textarea", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value:
                                  _vm.translations[language.id].schema_markup,
                                expression:
                                  "translations[language.id].schema_markup",
                              },
                            ],
                            staticClass: "form-control",
                            attrs: {
                              placeholder: _vm.__("enter_schema_markup"),
                              rows: "4",
                              required:
                                language.is_default == 1 ? true : undefined,
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
                        _c("div", { staticClass: "form-group col-md-12" }, [
                          _c("label", [
                            _vm._v(_vm._s(_vm.__("meta_description"))),
                          ]),
                          _vm._v(" "),
                          language.is_default
                            ? _c("i", { staticClass: "text-danger" }, [
                                _vm._v("*"),
                              ])
                            : _vm._e(),
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
                              placeholder: _vm.__("enter_meta_description"),
                              rows: "4",
                              required:
                                language.is_default == 1 ? true : undefined,
                            },
                            domProps: {
                              value:
                                _vm.translations[language.id].meta_description,
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
                        language.is_default
                          ? _c("div", { staticClass: "form-group" }, [
                              _c("label", [_vm._v(_vm._s(_vm.__("og_image")))]),
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
                                ref: "file_image_default",
                                refInFor: true,
                                staticClass: "file-input",
                                attrs: {
                                  type: "file",
                                  name: "og_image",
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
                                    dragover: _vm.$dragoverFile,
                                    dragleave: _vm.$dragleaveFile,
                                  },
                                },
                                [
                                  _vm.og_image && _vm.og_image.name !== ""
                                    ? [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(
                                              _vm.__("selected_file_name")
                                            ) +
                                              " " +
                                              _vm._s(_vm.og_image.name)
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
                              _vm.og_image_url
                                ? _c("div", { staticClass: "row" }, [
                                    _c("div", { staticClass: "col-md-4" }, [
                                      _c("img", {
                                        staticClass: "custom-image",
                                        attrs: {
                                          src: _vm.og_image_url,
                                          title: "OG Image",
                                          alt: "OG Image",
                                        },
                                      }),
                                    ]),
                                  ])
                                : _vm._e(),
                            ])
                          : _vm._e(),
                      ]),
                    ]
                  )
                }),
                1
              )
            : _vm._e(),
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=template&id=e265d63a":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/SeoSettings/SeoSettings.vue?vue&type=template&id=e265d63a ***!
  \*************************************************************************************************************************************************************************************************************************************/
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
            _c("h3", [_vm._v(_vm._s(_vm.__("seo_settings")))]),
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
                    [_vm._v(_vm._s(_vm.__("seo_settings")))]
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
                _c("h4", [_vm._v(_vm._s(_vm.__("seo_settings")))]),
                _vm._v(" "),
                _c("span", { staticClass: "pull-right" }, [
                  _vm.$can("category_create")
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
                          staticClass: "btn btn-primary",
                          attrs: { title: _vm.__("add_seo_page") },
                          on: {
                            click: function ($event) {
                              _vm.create_new = true
                            },
                          },
                        },
                        [_vm._v(_vm._s(_vm.__("add_seo_page")))]
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
                                  return _vm.getSeoSettings()
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
                  _c("b-table", {
                    attrs: {
                      items: _vm.translatedSeoSettings,
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
                                _c("b-spinner", {
                                  staticClass: "align-middle",
                                }),
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
                        key: "cell(schema_markup)",
                        fn: function (row) {
                          return [
                            _vm.shouldTruncate(row.item.schema_markup)
                              ? _c("div", [
                                  !_vm.expandedSchema[row.item.id]
                                    ? _c("span", [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(
                                              _vm.getTruncatedText(
                                                row.item.schema_markup
                                              )
                                            ) +
                                            "\n                                        "
                                        ),
                                        _c(
                                          "a",
                                          {
                                            staticClass: "text-info",
                                            attrs: { href: "#" },
                                            on: {
                                              click: function ($event) {
                                                $event.preventDefault()
                                                return _vm.toggleSchemaExpansion(
                                                  row.item.id
                                                )
                                              },
                                            },
                                          },
                                          [_vm._v("View More")]
                                        ),
                                      ])
                                    : _c("span", [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(row.item.schema_markup) +
                                            "\n                                        "
                                        ),
                                        _c(
                                          "a",
                                          {
                                            staticClass: "text-info",
                                            attrs: { href: "#" },
                                            on: {
                                              click: function ($event) {
                                                $event.preventDefault()
                                                return _vm.toggleSchemaExpansion(
                                                  row.item.id
                                                )
                                              },
                                            },
                                          },
                                          [_vm._v("View Less")]
                                        ),
                                      ]),
                                ])
                              : _c("span", [
                                  _vm._v(_vm._s(row.item.schema_markup)),
                                ]),
                          ]
                        },
                      },
                      {
                        key: "cell(meta_description)",
                        fn: function (row) {
                          return [
                            _vm.shouldTruncate(row.item.meta_description)
                              ? _c("div", [
                                  !_vm.expandedMeta[row.item.id]
                                    ? _c("span", [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(
                                              _vm.getTruncatedText(
                                                row.item.meta_description
                                              )
                                            ) +
                                            "\n                                        "
                                        ),
                                        _c(
                                          "a",
                                          {
                                            staticClass: "text-info",
                                            attrs: { href: "#" },
                                            on: {
                                              click: function ($event) {
                                                $event.preventDefault()
                                                return _vm.toggleMetaExpansion(
                                                  row.item.id
                                                )
                                              },
                                            },
                                          },
                                          [_vm._v("View More")]
                                        ),
                                      ])
                                    : _c("span", [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(row.item.meta_description) +
                                            "\n                                        "
                                        ),
                                        _c(
                                          "a",
                                          {
                                            staticClass: "text-info",
                                            attrs: { href: "#" },
                                            on: {
                                              click: function ($event) {
                                                $event.preventDefault()
                                                return _vm.toggleMetaExpansion(
                                                  row.item.id
                                                )
                                              },
                                            },
                                          },
                                          [_vm._v("View Less")]
                                        ),
                                      ]),
                                ])
                              : _c("span", [
                                  _vm._v(_vm._s(row.item.meta_description)),
                                ]),
                          ]
                        },
                      },
                      {
                        key: "cell(og_image)",
                        fn: function (row) {
                          return [
                            _c("img", {
                              attrs: {
                                src: row.item.og_image_url,
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
                                    staticClass: "btn btn-sm btn-primary",
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
                                    staticClass: "btn btn-sm btn-danger",
                                    attrs: { title: _vm.__("delete") },
                                    on: {
                                      click: function ($event) {
                                        return _vm.deleteSeoSettings(
                                          row.index,
                                          row.item.id
                                        )
                                      },
                                    },
                                  },
                                  [_c("i", { staticClass: "fa fa-trash" })]
                                )
                              : _vm._e(),
                          ]
                        },
                      },
                    ]),
                  }),
                  _vm._v(" "),
                  _c(
                    "b-row",
                    [
                      _c("b-col", { staticClass: "my-1", attrs: { md: "2" } }, [
                        _c(
                          "label",
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
                      ]),
                      _vm._v(" "),
                      _c(
                        "b-col",
                        {
                          staticClass: "my-1",
                          attrs: { md: "4", "offset-md": "6" },
                        },
                        [
                          _c("label", [
                            _vm._v(
                              _vm._s(_vm.__("total_records")) +
                                " :- " +
                                _vm._s(_vm.totalRows) +
                                " "
                            ),
                          ]),
                          _vm._v(" "),
                          _c("b-pagination", {
                            staticClass: "my-0",
                            attrs: {
                              "total-rows": _vm.totalRows,
                              "per-page": _vm.perPage,
                              align: "fill",
                              size: "sm",
                            },
                            on: { change: _vm.getSeoSettings },
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
                1
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