"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Product_Units_Units_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Edit.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Edit.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************/
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

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  props: ['record', 'units'],
  data: function data() {
    var _this$record, _this$record2, _this$record3;
    return {
      isLoading: false,
      isLoadingData: true,
      id: ((_this$record = this.record) === null || _this$record === void 0 ? void 0 : _this$record.id) || null,
      parent_id: ((_this$record2 = this.record) === null || _this$record2 === void 0 ? void 0 : _this$record2.parent_id) || 0,
      conversion: ((_this$record3 = this.record) === null || _this$record3 === void 0 ? void 0 : _this$record3.conversion) || 1,
      languages: [],
      translations: {},
      originalTranslationLanguages: [],
      defaultLanguageId: null,
      activeLanguageTab: 0,
      validationError: null,
      tabsKey: 0,
      // Translate Button 
      translatableFields: ['name', 'short_code'],
      loadingEmpty: false,
      loadingOverwrite: false
    };
  },
  watch: {
    record: {
      immediate: true,
      deep: true,
      handler: function handler(newVal) {
        if (newVal && newVal.id) {
          this.id = newVal.id;
          this.parent_id = newVal.parent_id || 0;
          this.conversion = newVal.conversion || 1;
          // Reload data when record changes (for edit mode)
          // Only load if languages are already initialized
          if (this.languages.length > 0 && Object.keys(this.translations).length > 0) {
            this.loadUnit();
          }
        } else {
          this.id = null;
          // Reset form for new unit
          this.parent_id = 0;
          this.conversion = 1;
          this.translations = {};
          this.originalTranslationLanguages = [];
          if (this.languages.length > 0) {
            this.initializeTranslations();
          }
        }
      }
    }
  },
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  computed: {
    modal_title: function modal_title() {
      var title = this.id ? __('edit') : __('add');
      title += " " + __('unit');
      return title;
    }
  },
  methods: {
    validateConversion: function validateConversion() {
      if (this.conversion < 1) {
        this.validationError = __('conversion_must_be_greater_than_zero');
      } else {
        this.validationError = null;
      }
    },
    showModal: function showModal() {
      this.$refs['my-modal'].show();
      if (this.id && this.languages.length > 0) {
        this.loadUnit();
      }
    },
    hideModal: function hideModal() {
      this.$refs['my-modal'].hide();
      this.id = null;
      this.parent_id = 0;
      this.conversion = 1;
      this.translations = {};
      this.originalTranslationLanguages = [];
      this.validationError = null;
    },
    deferDataLoad: function deferDataLoad() {
      var _this = this;
      this.isLoadingData = true;
      this.fetchActiveLanguages().then(function () {
        if (_this.id) {
          return _this.loadUnit();
        }
      })["finally"](function () {
        _this.isLoadingData = false;
      });
    },
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this2 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/active_languages').then(function (res) {
        _this2.languages = res.data.data;
        var defaultLang = _this2.languages.find(function (l) {
          return l.is_default == 1;
        });
        if (defaultLang) {
          _this2.defaultLanguageId = defaultLang.id;
        }
        _this2.initializeTranslations();
      });
    },
    initializeTranslations: function initializeTranslations() {
      var _this3 = this;
      this.languages.forEach(function (lang) {
        if (!_this3.translations[lang.id]) {
          _this3.$set(_this3.translations, lang.id, {
            name: '',
            short_code: ''
          });
        }
      });
    },
    loadUnit: function loadUnit() {
      var _this4 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/units', {
        params: {
          id: this.id
        }
      }).then(function (res) {
        var unit = res.data.data[0];
        if (!unit) {
          console.error('Unit not found');
          return;
        }

        // Set main table fields
        _this4.parent_id = unit.parent_id || 0;
        _this4.conversion = unit.conversion || 1;

        // Ensure all languages are initialized first
        _this4.initializeTranslations();
        _this4.originalTranslationLanguages = [];

        // Process translations with fallback logic
        _this4.languages.forEach(function (lang) {
          var translation = Array.isArray(unit.translations) ? unit.translations.find(function (t) {
            return t.language_id === lang.id;
          }) : null;

          // Track if this language had a translation initially
          if (translation && (translation.name || translation.short_code)) {
            _this4.originalTranslationLanguages.push(lang.id);
          }
          if (lang.is_default) {
            // For default language, use translation if exists, otherwise fallback to main table data
            _this4.$set(_this4.translations, lang.id, {
              name: translation && translation.name && translation.name.trim() !== '' ? translation.name : unit.name || '',
              short_code: translation && translation.short_code && translation.short_code.trim() !== '' ? translation.short_code : unit.short_code || ''
            });
          } else {
            // For other languages, use translation if exists, otherwise empty
            _this4.$set(_this4.translations, lang.id, {
              name: translation && translation.name ? translation.name : '',
              short_code: translation && translation.short_code ? translation.short_code : ''
            });
          }
        });
        _this4.tabsKey++;
      });
    },
    validateDefaultLanguage: function validateDefaultLanguage() {
      if (!this.defaultLanguageId) {
        this.showError(__('default_language_not_found'));
        return false;
      }
      var defaultTranslation = this.translations[this.defaultLanguageId];

      // Check required fields for default language
      if (!defaultTranslation.name || defaultTranslation.name.trim() === '') {
        this.showError(__('please_fill_name_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      if (!defaultTranslation.short_code || defaultTranslation.short_code.trim() === '') {
        this.showError(__('please_fill_short_code_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      return true;
    },
    validateDefaultLanguageForTranslation: function validateDefaultLanguageForTranslation() {
      var _this5 = this;
      var form = this.$refs['my-form'];
      if (form && !form.reportValidity()) {
        this.$nextTick(function () {
          return _this5.switchToDefaultLanguageTab();
        });
        return false;
      }
      return this.validateDefaultLanguage();
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this6 = this;
      var defaultLangIndex = this.languages.findIndex(function (lang) {
        return lang.id === _this6.defaultLanguageId;
      });
      if (defaultLangIndex !== -1) {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLanguageTab = defaultLangIndex;
      }
    },
    saveRecord: function saveRecord() {
      var _this7 = this;
      if (!this.validateDefaultLanguage()) return;
      this.isLoading = true;
      var langsToSave = this.languages.filter(function (l) {
        var t = _this7.translations[l.id];
        var hasData = t && (t.name || t.short_code);
        var hadOriginalTranslation = _this7.originalTranslationLanguages.includes(l.id);

        // Always save default language
        if (l.is_default) {
          return true;
        }
        return hasData || _this7.id && hadOriginalTranslation;
      });
      var save = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
          var unitId, _iterator, _step, _res$data, _res$data$data, lang, t, fd, url, res;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  unitId = _this7.id;
                  _iterator = _createForOfIteratorHelper(langsToSave);
                  _context.prev = 2;
                  _iterator.s();
                case 4:
                  if ((_step = _iterator.n()).done) {
                    _context.next = 20;
                    break;
                  }
                  lang = _step.value;
                  t = _this7.translations[lang.id] || {
                    name: '',
                    short_code: ''
                  };
                  fd = new FormData();
                  if (unitId) fd.append('id', unitId);
                  fd.append('language_id', lang.id);
                  fd.append('name', t.name || '');
                  fd.append('short_code', t.short_code || '');
                  if (lang.is_default) {
                    fd.append('parent_id', _this7.parent_id);
                    fd.append('conversion', _this7.conversion);
                  }
                  url = unitId ? _this7.$apiUrl + '/units/update' : _this7.$apiUrl + '/units/save';
                  _context.next = 16;
                  return axios__WEBPACK_IMPORTED_MODULE_1___default().post(url, fd);
                case 16:
                  res = _context.sent;
                  if (!unitId && (_res$data = res.data) !== null && _res$data !== void 0 && (_res$data$data = _res$data.data) !== null && _res$data$data !== void 0 && _res$data$data.id) {
                    unitId = res.data.data.id;
                  }
                case 18:
                  _context.next = 4;
                  break;
                case 20:
                  _context.next = 25;
                  break;
                case 22:
                  _context.prev = 22;
                  _context.t0 = _context["catch"](2);
                  _iterator.e(_context.t0);
                case 25:
                  _context.prev = 25;
                  _iterator.f();
                  return _context.finish(25);
                case 28:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[2, 22, 25, 28]]);
        }));
        return function save() {
          return _ref.apply(this, arguments);
        };
      }();
      save().then(function () {
        var _;
        _this7.$emit('saved', (_ = __('unit_saved_successfully')) !== null && _ !== void 0 ? _ : 'Unit saved successfully');
        _this7.hideModal();
      })["catch"](function (err) {
        var _err$response, _err$response$data;
        _this7.showError(((_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.message) || __('something_went_wrong'));
      })["finally"](function () {
        _this7.isLoading = false;
      });
    }
  },
  mounted: function mounted() {
    this.showModal();
    this.deferDataLoad();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Units.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Units.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit */ "./resources/js/views/Product/Units/Edit.vue");
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    'app-edit-record': _Edit__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      fields: [{
        key: 'id',
        label: __('id'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'name',
        label: __('name'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'short_code',
        label: __('short_code'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'parent_id',
        label: __('parent_id'),
        "class": 'text-center'
      }, {
        key: 'conversion',
        label: __('conversion'),
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
      units: [],
      isLoading: false,
      sectionStyle: 'style_1',
      max_visible_units: 12,
      max_col_in_single_row: 3,
      create_new: null,
      edit_record: null,
      currentLanguageId: null,
      activeLanguages: [],
      defaultLanguageId: null
    };
  },
  computed: {
    translatedUnits: function translatedUnits() {
      var _this = this;
      if (!this.units.length) return this.units;
      return this.units.map(function (unit) {
        var _currentTranslation$n, _defaultTranslation$n, _currentTranslation$s, _defaultTranslation$s;
        var u = _objectSpread({}, unit);
        if (!Array.isArray(unit.translations)) {
          return u;
        }
        var currentTranslation = unit.translations.find(function (t) {
          return t.language_id === _this.currentLanguageId;
        });
        var defaultTranslation = unit.translations.find(function (t) {
          return t.language_id === _this.defaultLanguageId;
        });
        if (currentTranslation !== null && currentTranslation !== void 0 && (_currentTranslation$n = currentTranslation.name) !== null && _currentTranslation$n !== void 0 && _currentTranslation$n.trim()) {
          u.name = currentTranslation.name;
        } else if (defaultTranslation !== null && defaultTranslation !== void 0 && (_defaultTranslation$n = defaultTranslation.name) !== null && _defaultTranslation$n !== void 0 && _defaultTranslation$n.trim()) {
          u.name = defaultTranslation.name;
        }
        if (currentTranslation !== null && currentTranslation !== void 0 && (_currentTranslation$s = currentTranslation.short_code) !== null && _currentTranslation$s !== void 0 && _currentTranslation$s.trim()) {
          u.short_code = currentTranslation.short_code;
        } else if (defaultTranslation !== null && defaultTranslation !== void 0 && (_defaultTranslation$s = defaultTranslation.short_code) !== null && _defaultTranslation$s !== void 0 && _defaultTranslation$s.trim()) {
          u.short_code = defaultTranslation.short_code;
        }
        return u;
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
    this.totalRows = this.units.length;
  },
  created: function created() {
    var _this2 = this;
    this.$eventBus.$on('unitSaved', function (message) {
      _this2.showMessage('success', message);
      _this2.getUnits();
    });
    this.fetchActiveLanguages().then(function () {
      _this2.getUnits();
    });
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      return axios.get(this.$apiUrl + '/active_languages').then(function (response) {
        if (Array.isArray(response.data.data)) {
          _this3.activeLanguages = response.data.data;
          var appLocale = window.appLocale || 'en';
          var currentLang = _this3.activeLanguages.find(function (l) {
            return l.code === appLocale;
          });
          var defaultLang = _this3.activeLanguages.find(function (l) {
            return l.is_default === 1;
          });
          _this3.currentLanguageId = (currentLang === null || currentLang === void 0 ? void 0 : currentLang.id) || (defaultLang === null || defaultLang === void 0 ? void 0 : defaultLang.id) || null;
          _this3.defaultLanguageId = (defaultLang === null || defaultLang === void 0 ? void 0 : defaultLang.id) || null;
        }
      })["catch"](function (err) {
        return console.error(err);
      });
    },
    getUnits: function getUnits() {
      var _this4 = this;
      this.isLoading = true;
      axios.get(this.$apiUrl + '/units').then(function (response) {
        _this4.isLoading = false;
        var data = response.data;
        _this4.units = data.data;
        _this4.totalRows = _this4.units.length;
      })["catch"](function (error) {
        console.error('units API error', error);
      });
    },
    deleteUnit: function deleteUnit(index, id) {
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
          axios.post(_this5.$apiUrl + '/units/delete', postData).then(function (response) {
            _this5.isLoading = false;
            var data = response.data;
            _this5.units.splice(index, 1);
            _this5.showMessage("success", data.message);
          });
        }
      });
    },
    addUnitSettings: function addUnitSettings() {
      var _this6 = this;
      var postData = {
        add_unit_settings: 1,
        cat_style: this.sectionStyle,
        max_visible_units: this.max_visible_units,
        max_col_in_single_row: this.max_col_in_single_row
      };
      axios.post(this.$apiUrl + '/units/saveUnitSettings', postData).then(function (response) {
        var data = response.data;
        _this6.showMessage("success", data.message);
      });
    },
    onUnitSaved: function onUnitSaved(message) {
      this.showMessage('success', message || __('unit_saved_successfully'));
      this.getUnits();
      this.hideModal();
    },
    hideModal: function hideModal() {
      this.create_new = false;
      this.edit_record = false;
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

/***/ "./resources/js/views/Product/Units/Edit.vue":
/*!***************************************************!*\
  !*** ./resources/js/views/Product/Units/Edit.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue_vue_type_template_id_7a6ce069_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=7a6ce069&scoped=true */ "./resources/js/views/Product/Units/Edit.vue?vue&type=template&id=7a6ce069&scoped=true");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js */ "./resources/js/views/Product/Units/Edit.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_7a6ce069_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Edit_vue_vue_type_template_id_7a6ce069_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "7a6ce069",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Product/Units/Edit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Product/Units/Units.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/Product/Units/Units.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Units_vue_vue_type_template_id_29ed7ea0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Units.vue?vue&type=template&id=29ed7ea0 */ "./resources/js/views/Product/Units/Units.vue?vue&type=template&id=29ed7ea0");
/* harmony import */ var _Units_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Units.vue?vue&type=script&lang=js */ "./resources/js/views/Product/Units/Units.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Units_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Units_vue_vue_type_template_id_29ed7ea0__WEBPACK_IMPORTED_MODULE_0__.render,
  _Units_vue_vue_type_template_id_29ed7ea0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Product/Units/Units.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Product/Units/Edit.vue?vue&type=script&lang=js":
/*!***************************************************************************!*\
  !*** ./resources/js/views/Product/Units/Edit.vue?vue&type=script&lang=js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Edit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Product/Units/Units.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/views/Product/Units/Units.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Units.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Units.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Product/Units/Edit.vue?vue&type=template&id=7a6ce069&scoped=true":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/Product/Units/Edit.vue?vue&type=template&id=7a6ce069&scoped=true ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_7a6ce069_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_7a6ce069_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_7a6ce069_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=template&id=7a6ce069&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Edit.vue?vue&type=template&id=7a6ce069&scoped=true");


/***/ }),

/***/ "./resources/js/views/Product/Units/Units.vue?vue&type=template&id=29ed7ea0":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/Product/Units/Units.vue?vue&type=template&id=29ed7ea0 ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_template_id_29ed7ea0__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_template_id_29ed7ea0__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_template_id_29ed7ea0__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Units.vue?vue&type=template&id=29ed7ea0 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Units.vue?vue&type=template&id=29ed7ea0");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Edit.vue?vue&type=template&id=7a6ce069&scoped=true":
/*!************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Edit.vue?vue&type=template&id=7a6ce069&scoped=true ***!
  \************************************************************************************************************************************************************************************************************************************/
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
              _vm._v(
                "\n            " + _vm._s(_vm.__("save")) + "\n            "
              ),
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
                            ],
                            1
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.translations[language.id]
                        ? _c("div", [
                            _c("div", { staticClass: "row" }, [
                              _c("div", { staticClass: "form-group" }, [
                                _c("label", [_vm._v(_vm._s(_vm.__("name")))]),
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
                                    required: language.is_default
                                      ? true
                                      : undefined,
                                    placeholder: "Enter unit name.",
                                  },
                                  domProps: {
                                    value: _vm.translations[language.id].name,
                                  },
                                  on: {
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
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "form-group" }, [
                                _c("label", [
                                  _vm._v(_vm._s(_vm.__("short_code"))),
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
                                        _vm.translations[language.id]
                                          .short_code,
                                      expression:
                                        "translations[language.id].short_code",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "text",
                                    required: language.is_default
                                      ? true
                                      : undefined,
                                    placeholder:
                                      "Enter short code of unit name.",
                                  },
                                  domProps: {
                                    value:
                                      _vm.translations[language.id].short_code,
                                  },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.translations[language.id],
                                        "short_code",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c("label", [
                                      _vm._v(_vm._s(_vm.__("parent_id"))),
                                    ]),
                                    _vm._v(" "),
                                    _c(
                                      "select",
                                      {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value: _vm.parent_id,
                                            expression: "parent_id",
                                          },
                                        ],
                                        staticClass: "form-control form-select",
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
                                            _vm.parent_id = $event.target
                                              .multiple
                                              ? $$selectedVal
                                              : $$selectedVal[0]
                                          },
                                        },
                                      },
                                      [
                                        _c(
                                          "option",
                                          { attrs: { value: "0" } },
                                          [_vm._v(_vm._s(_vm.__("units")))]
                                        ),
                                        _vm._v(" "),
                                        _vm._l(_vm.units, function (unit) {
                                          return _c(
                                            "option",
                                            { domProps: { value: unit.id } },
                                            [_vm._v(_vm._s(unit.name))]
                                          )
                                        }),
                                      ],
                                      2
                                    ),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c("label", [
                                      _vm._v(_vm._s(_vm.__("conversion"))),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.conversion,
                                          expression: "conversion",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "number",
                                        placeholder: "Enter Conversion.",
                                        min: "1",
                                      },
                                      domProps: { value: _vm.conversion },
                                      on: {
                                        input: [
                                          function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.conversion = $event.target.value
                                          },
                                          _vm.validateConversion,
                                        ],
                                      },
                                    }),
                                    _vm._v(" "),
                                    _vm.validationError
                                      ? _c("span", { staticClass: "error" }, [
                                          _vm._v(_vm._s(_vm.validationError)),
                                        ])
                                      : _vm._e(),
                                  ])
                                : _vm._e(),
                            ]),
                          ])
                        : _vm._e(),
                    ]
                  )
                }),
                1
              )
            : _c(
                "div",
                { staticClass: "text-center p-5" },
                [
                  _c("b-spinner", { attrs: { label: "Loading languages..." } }),
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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Units.vue?vue&type=template&id=29ed7ea0":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/Units/Units.vue?vue&type=template&id=29ed7ea0 ***!
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
    { staticClass: "list-page" },
    [
      _c("div", { staticClass: "page-head" }, [
        _c("h3", { staticClass: "page-head-title" }, [
          _vm._v(_vm._s(_vm.__("units_list"))),
        ]),
        _vm._v(" "),
        _vm.$can("units")
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
                _c("span", [_vm._v(_vm._s(_vm.__("add_unit")))]),
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
                  return _vm.getUnits()
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
                items: _vm.translatedUnits,
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
                  key: "cell(parent_id)",
                  fn: function (row) {
                    return [
                      row.item.parent_id !== null
                        ? _c("p", [_vm._v(_vm._s(row.item.parent_id))])
                        : _c("p", [_vm._v("-")]),
                    ]
                  },
                },
                {
                  key: "cell(conversion)",
                  fn: function (row) {
                    return [
                      row.item.conversion !== null
                        ? _c("p", [_vm._v(_vm._s(row.item.conversion))])
                        : _c("p", [_vm._v("-")]),
                    ]
                  },
                },
                {
                  key: "cell(actions)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "list-actions" }, [
                        _vm.$can("units")
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
                        _vm.$can("units")
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
                                    return _vm.deleteUnit(
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
            key: _vm.edit_record ? _vm.edit_record.id : "new",
            attrs: {
              record: _vm.edit_record,
              units: _vm.units,
              "current-language-id": _vm.currentLanguageId,
              "default-language-id": _vm.defaultLanguageId,
            },
            on: {
              saved: _vm.onUnitSaved,
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