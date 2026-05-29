"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Setting_AdditionalCharges_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  data: function data() {
    return {
      additionalCharges: [],
      languages: [],
      activeLanguageTab: 0,
      isLoading: false,
      isLoadingLanguages: false,
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false
    };
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this = this;
      if (this.languages.length) {
        return Promise.resolve(this.languages);
      }
      this.isLoadingLanguages = true;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/active_languages').then(function (res) {
        _this.languages = res.data.data || [];
        var def = _this.languages.find(function (l) {
          return l.is_default;
        });
        if (def) _this.defaultLanguageId = def.id;
      })["catch"](function () {
        _this.languages = [];
      })["finally"](function () {
        _this.isLoadingLanguages = false;
      });
    },
    getAdditionalCharges: function getAdditionalCharges() {
      var _this2 = this;
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/additional_charges').then(function (res) {
        var data = res.data.data;
        if (!Array.isArray(data)) {
          _this2.additionalCharges = [];
          return;
        }
        var languages = _this2.languages && _this2.languages.length ? _this2.languages : [{
          code: 'en',
          is_default: 1
        }];
        _this2.additionalCharges = data.map(function (charge) {
          var titleObject = {};
          if (_typeof(charge.title) === 'object' && charge.title !== null) {
            languages.forEach(function (lang) {
              titleObject[lang.code] = charge.title[lang.code] != null ? String(charge.title[lang.code]) : '';
            });
          } else {
            languages.forEach(function (lang) {
              titleObject[lang.code] = '';
            });
          }
          var amount = parseFloat(charge.amount);
          return {
            id: charge.id || null,
            title: titleObject,
            amount: isNaN(amount) ? 0 : amount,
            charge_type: charge.charge_type || 'amount',
            is_refundable: charge.is_refundable === true || charge.is_refundable === 1,
            is_active: charge.is_active !== false && charge.is_active !== 0,
            applicable_on: Array.isArray(charge.applicable_on) ? charge.applicable_on.filter(function (v) {
              return v !== 'pos';
            }) : ['order', 'self_pickup']
          };
        });
      })["catch"](function () {
        _this2.additionalCharges = [];
      });
    },
    addCharge: function addCharge() {
      var newCharge = {
        id: null,
        title: {},
        amount: 0,
        charge_type: 'amount',
        is_refundable: false,
        is_active: true,
        applicable_on: ['order', 'self_pickup']
      };
      this.languages.forEach(function (lang) {
        newCharge.title[lang.code] = '';
      });
      this.additionalCharges.push(newCharge);
    },
    removeCharge: function removeCharge(index) {
      var _this3 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_wont_be_able_to_revert_this'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: __('yes_delete_it'),
        cancelButtonText: __('cancel')
      }).then(function (result) {
        if (result.isConfirmed) {
          _this3.additionalCharges.splice(index, 1);
        }
      });
    },
    saveAdditionalCharges: function saveAdditionalCharges() {
      var _this4 = this;
      this.isLoading = true;
      var defaultLang = this.languages.find(function (l) {
        return l.is_default;
      });
      if (!defaultLang) {
        this.showError('Default language not configured');
        this.isLoading = false;
        return;
      }
      for (var i = 0; i < this.additionalCharges.length; i++) {
        var value = this.additionalCharges[i].title[defaultLang.code];
        if (!value || !value.trim()) {
          this.showError("".concat(__('charge_title'), " (default language) is required for charge #").concat(i + 1));
          this.isLoading = false;
          return;
        }
      }
      var payload = this.additionalCharges.map(function (charge) {
        var cleanTitle = {};
        _this4.languages.forEach(function (lang) {
          var value = charge.title[lang.code] || '';
          value = value.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
          cleanTitle[lang.code] = value;
        });
        return {
          id: charge.id || null,
          title: cleanTitle,
          amount: charge.amount || 0,
          charge_type: charge.charge_type || 'amount',
          is_refundable: charge.is_refundable ? true : false,
          is_active: charge.is_active ? true : false,
          applicable_on: charge.applicable_on || ['order', 'self_pickup']
        };
      });
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(this.$apiUrl + '/additional_charges/save', {
        additional_charges: JSON.stringify(payload)
      }).then(function (res) {
        if (res.data.status === 1) {
          _this4.showMessage('success', res.data.message);
          _this4.getAdditionalCharges();
        } else {
          _this4.showError(res.data.message);
        }
        _this4.isLoading = false;
      })["catch"](function (err) {
        var _err$response, _err$response$data;
        _this4.isLoading = false;
        _this4.showError(((_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.message) || err.message || __('something_went_wrong'));
      });
    },
    _translateAdditionalCharges: function _translateAdditionalCharges(emptyOnly) {
      var _this5 = this;
      var defaultLang = this.languages.find(function (l) {
        return l.is_default;
      });
      if (!defaultLang || !defaultLang.code) {
        this.showError(__('default_language_data_missing') || 'Default language not found');
        return Promise.reject();
      }
      var source = {};
      this.additionalCharges.forEach(function (charge, i) {
        source['charge_' + i + '_title'] = charge.title[defaultLang.code] || '';
      });
      if (Object.values(source).every(function (v) {
        return !v || !String(v).trim();
      })) {
        this.showError(__('default_language_data_missing') || 'Fill charge titles in default language first');
        return Promise.reject();
      }
      if (emptyOnly) {
        var hasEmptyField = false;
        var _iterator = _createForOfIteratorHelper(this.languages),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var lang = _step.value;
            if (lang.is_default) continue;
            for (var i = 0; i < this.additionalCharges.length; i++) {
              var charge = this.additionalCharges[i];
              var val = charge.title[lang.code];
              if (!val || String(val).trim() === '') {
                hasEmptyField = true;
                break;
              }
            }
            if (hasEmptyField) break;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (!hasEmptyField) {
          this.showError(__('translation_error_all_fields_filled') || 'All fields already have values. There is nothing to translate.');
          return Promise.reject();
        }
      }
      this.translateSuccessMessage = '';
      if (emptyOnly) this.loadingEmpty = true;else this.loadingOverwrite = true;
      var url = emptyOnly ? 'languages/translate-empty' : 'languages/translate-overwrite';
      return axios__WEBPACK_IMPORTED_MODULE_1___default().post(this.$apiUrl + '/' + url, {
        target_language: defaultLang.code,
        data: source
      }).then(function (res) {
        var allTranslations = res.data.data || {};
        _this5.languages.forEach(function (lang) {
          if (lang.is_default) return;
          var translated = allTranslations[lang.code];
          if (!translated) return;
          _this5.additionalCharges.forEach(function (charge, i) {
            var key = 'charge_' + i + '_title';
            var val = translated[key];
            if (val == null) return;
            if (emptyOnly && charge.title[lang.code]) return;
            _this5.$set(charge.title, lang.code, val);
          });
        });
        _this5.translateSuccessMessage = emptyOnly ? __('translation_completed_successfully') || 'Translation completed successfully' : __('translation_overwritten_successfully') || 'Translation overwritten successfully';
        setTimeout(function () {
          _this5.translateSuccessMessage = '';
        }, 5000);
      })["catch"](function (err) {
        var _err$response2, _err$response2$data;
        _this5.showError(((_err$response2 = err.response) === null || _err$response2 === void 0 ? void 0 : (_err$response2$data = _err$response2.data) === null || _err$response2$data === void 0 ? void 0 : _err$response2$data.message) || err.message || __('something_went_wrong'));
        throw err;
      })["finally"](function () {
        if (emptyOnly) _this5.loadingEmpty = false;else _this5.loadingOverwrite = false;
      });
    },
    translateEmptyAdditionalCharges: function translateEmptyAdditionalCharges(language) {
      if (!language || !language.is_default) return;
      this._translateAdditionalCharges(true);
    },
    translateOverwriteAdditionalCharges: function translateOverwriteAdditionalCharges(language) {
      if (!language || !language.is_default) return;
      this._translateAdditionalCharges(false);
    }
  },
  mounted: function mounted() {
    var _this6 = this;
    return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _this6.isLoading = true;
              _context.prev = 1;
              _context.next = 4;
              return _this6.fetchActiveLanguages();
            case 4:
              _context.next = 6;
              return _this6.getAdditionalCharges();
            case 6:
              _context.prev = 6;
              _this6.isLoading = false;
              return _context.finish(6);
            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1,, 6, 9]]);
    }))();
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.charge-card[data-v-f6e0b92c] {\n    background: #fafbfc;\n}\n.charge-card[data-v-f6e0b92c]:hover {\n    background: #f0f4f8;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_style_index_0_id_f6e0b92c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_style_index_0_id_f6e0b92c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_style_index_0_id_f6e0b92c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Setting/AdditionalCharges.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/Setting/AdditionalCharges.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AdditionalCharges_vue_vue_type_template_id_f6e0b92c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AdditionalCharges.vue?vue&type=template&id=f6e0b92c&scoped=true */ "./resources/js/views/Setting/AdditionalCharges.vue?vue&type=template&id=f6e0b92c&scoped=true");
/* harmony import */ var _AdditionalCharges_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AdditionalCharges.vue?vue&type=script&lang=js */ "./resources/js/views/Setting/AdditionalCharges.vue?vue&type=script&lang=js");
/* harmony import */ var _AdditionalCharges_vue_vue_type_style_index_0_id_f6e0b92c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css */ "./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _AdditionalCharges_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _AdditionalCharges_vue_vue_type_template_id_f6e0b92c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _AdditionalCharges_vue_vue_type_template_id_f6e0b92c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "f6e0b92c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Setting/AdditionalCharges.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Setting/AdditionalCharges.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/Setting/AdditionalCharges.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AdditionalCharges.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_style_index_0_id_f6e0b92c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=style&index=0&id=f6e0b92c&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Setting/AdditionalCharges.vue?vue&type=template&id=f6e0b92c&scoped=true":
/*!****************************************************************************************************!*\
  !*** ./resources/js/views/Setting/AdditionalCharges.vue?vue&type=template&id=f6e0b92c&scoped=true ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_template_id_f6e0b92c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_template_id_f6e0b92c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AdditionalCharges_vue_vue_type_template_id_f6e0b92c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./AdditionalCharges.vue?vue&type=template&id=f6e0b92c&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=template&id=f6e0b92c&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=template&id=f6e0b92c&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/AdditionalCharges.vue?vue&type=template&id=f6e0b92c&scoped=true ***!
  \*******************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", [
    _c("div", { staticClass: "page-heading" }, [
      _c("div", { staticClass: "page-title" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("additional_charge")))]),
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
                    [
                      _vm._v(
                        _vm._s(_vm.__("additional_charge")) +
                          "\n                            "
                      ),
                    ]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c("section", { staticClass: "section" }, [
        _c("div", { staticClass: "card" }, [
          _c("div", { staticClass: "card-header" }, [
            _c("h4", { staticClass: "card-title" }, [
              _vm._v(_vm._s(_vm.__("additional_charge"))),
            ]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "card-body" }, [
            _c(
              "form",
              {
                on: {
                  submit: function ($event) {
                    $event.preventDefault()
                    return _vm.saveAdditionalCharges.apply(null, arguments)
                  },
                },
              },
              [
                _c(
                  "b-tabs",
                  {
                    attrs: { lazy: "" },
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
                                        "\n                                        " +
                                          _vm._s(language.name) +
                                          "\n                                    "
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
                                      title:
                                        "Only empty fields will be translated.",
                                      disabled:
                                        _vm.loadingEmpty ||
                                        _vm.loadingOverwrite,
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.translateEmptyAdditionalCharges(
                                          language
                                        )
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
                                      title:
                                        "All fields will be translated and overwritten.",
                                      disabled:
                                        _vm.loadingEmpty ||
                                        _vm.loadingOverwrite,
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.translateOverwriteAdditionalCharges(
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
                                              _vm.__("translate_and_overwrite")
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
                                _vm.translateSuccessMessage
                                  ? _c(
                                      "div",
                                      {
                                        staticClass:
                                          "text-success mt-2 font-weight-bold",
                                      },
                                      [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(_vm.translateSuccessMessage)
                                        ),
                                      ]
                                    )
                                  : _vm._e(),
                              ],
                              1
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _vm._l(_vm.additionalCharges, function (charge, index) {
                          return _c(
                            "div",
                            {
                              key: index,
                              staticClass:
                                "charge-card mb-3 p-3 border rounded",
                            },
                            [
                              _c(
                                "div",
                                { staticClass: "row align-items-end" },
                                [
                                  _c("div", { staticClass: "col-md-4" }, [
                                    _c(
                                      "div",
                                      { staticClass: "form-group mb-2" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(_vm.__("charge_title")) + " "
                                          ),
                                          language.is_default
                                            ? _c(
                                                "span",
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
                                                charge.title[language.code],
                                              expression:
                                                "charge.title[language.code]",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "text",
                                            placeholder: _vm.__("charge_title"),
                                            required: language.is_default
                                              ? true
                                              : undefined,
                                          },
                                          domProps: {
                                            value: charge.title[language.code],
                                          },
                                          on: {
                                            input: function ($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.$set(
                                                charge.title,
                                                language.code,
                                                $event.target.value
                                              )
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                  ]),
                                  _vm._v(" "),
                                  language.is_default
                                    ? [
                                        _c("div", { staticClass: "col-md-2" }, [
                                          _c(
                                            "div",
                                            { staticClass: "form-group mb-2" },
                                            [
                                              _c("label", [
                                                _vm._v(
                                                  _vm._s(_vm.__("charge_type"))
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
                                                      value: charge.charge_type,
                                                      expression:
                                                        "charge.charge_type",
                                                    },
                                                  ],
                                                  staticClass:
                                                    "form-control form-select",
                                                  on: {
                                                    change: function ($event) {
                                                      var $$selectedVal =
                                                        Array.prototype.filter
                                                          .call(
                                                            $event.target
                                                              .options,
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
                                                        charge,
                                                        "charge_type",
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
                                                    {
                                                      attrs: {
                                                        value: "amount",
                                                      },
                                                    },
                                                    [
                                                      _vm._v(
                                                        _vm._s(_vm.__("amount"))
                                                      ),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "option",
                                                    {
                                                      attrs: {
                                                        value: "percentage",
                                                      },
                                                    },
                                                    [
                                                      _vm._v(
                                                        _vm._s(
                                                          _vm.__("percentage")
                                                        )
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              ),
                                            ]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("div", { staticClass: "col-md-2" }, [
                                          _c(
                                            "div",
                                            { staticClass: "form-group mb-2" },
                                            [
                                              _c("label", [
                                                _vm._v(
                                                  _vm._s(
                                                    charge.charge_type ===
                                                      "percentage"
                                                      ? _vm.__("percentage")
                                                      : _vm.__("charge_amount")
                                                  )
                                                ),
                                              ]),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                { staticClass: "input-group" },
                                                [
                                                  _c(
                                                    "span",
                                                    {
                                                      staticClass:
                                                        "input-group-text",
                                                    },
                                                    [
                                                      _vm._v(
                                                        "\n                                                            " +
                                                          _vm._s(
                                                            charge.charge_type ===
                                                              "percentage"
                                                              ? "%"
                                                              : _vm.$currency
                                                          ) +
                                                          "\n                                                        "
                                                      ),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c("input", {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model",
                                                        value: charge.amount,
                                                        expression:
                                                          "charge.amount",
                                                      },
                                                    ],
                                                    staticClass: "form-control",
                                                    attrs: {
                                                      type: "number",
                                                      id:
                                                        "charge_amount_" +
                                                        index,
                                                      min: "0",
                                                      max:
                                                        charge.charge_type ===
                                                        "percentage"
                                                          ? 100
                                                          : undefined,
                                                      step: "0.01",
                                                      required: "",
                                                    },
                                                    domProps: {
                                                      value: charge.amount,
                                                    },
                                                    on: {
                                                      input: function ($event) {
                                                        if (
                                                          $event.target
                                                            .composing
                                                        ) {
                                                          return
                                                        }
                                                        _vm.$set(
                                                          charge,
                                                          "amount",
                                                          $event.target.value
                                                        )
                                                      },
                                                    },
                                                  }),
                                                ]
                                              ),
                                            ]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("div", { staticClass: "col-md-2" }, [
                                          _c(
                                            "div",
                                            { staticClass: "form-group mb-2" },
                                            [
                                              _c("label", [
                                                _vm._v(
                                                  _vm._s(_vm.__("refundable"))
                                                ),
                                              ]),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "form-check form-switch mt-1",
                                                },
                                                [
                                                  _c("input", {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model",
                                                        value:
                                                          charge.is_refundable,
                                                        expression:
                                                          "charge.is_refundable",
                                                      },
                                                    ],
                                                    staticClass:
                                                      "form-check-input",
                                                    attrs: {
                                                      type: "checkbox",
                                                      id: "refundable_" + index,
                                                    },
                                                    domProps: {
                                                      checked: Array.isArray(
                                                        charge.is_refundable
                                                      )
                                                        ? _vm._i(
                                                            charge.is_refundable,
                                                            null
                                                          ) > -1
                                                        : charge.is_refundable,
                                                    },
                                                    on: {
                                                      change: function (
                                                        $event
                                                      ) {
                                                        var $$a =
                                                            charge.is_refundable,
                                                          $$el = $event.target,
                                                          $$c = $$el.checked
                                                            ? true
                                                            : false
                                                        if (
                                                          Array.isArray($$a)
                                                        ) {
                                                          var $$v = null,
                                                            $$i = _vm._i(
                                                              $$a,
                                                              $$v
                                                            )
                                                          if ($$el.checked) {
                                                            $$i < 0 &&
                                                              _vm.$set(
                                                                charge,
                                                                "is_refundable",
                                                                $$a.concat([
                                                                  $$v,
                                                                ])
                                                              )
                                                          } else {
                                                            $$i > -1 &&
                                                              _vm.$set(
                                                                charge,
                                                                "is_refundable",
                                                                $$a
                                                                  .slice(0, $$i)
                                                                  .concat(
                                                                    $$a.slice(
                                                                      $$i + 1
                                                                    )
                                                                  )
                                                              )
                                                          }
                                                        } else {
                                                          _vm.$set(
                                                            charge,
                                                            "is_refundable",
                                                            $$c
                                                          )
                                                        }
                                                      },
                                                    },
                                                  }),
                                                  _vm._v(" "),
                                                  _c(
                                                    "label",
                                                    {
                                                      staticClass:
                                                        "form-check-label",
                                                      attrs: {
                                                        for:
                                                          "refundable_" + index,
                                                      },
                                                    },
                                                    [
                                                      _vm._v(
                                                        "\n                                                            " +
                                                          _vm._s(
                                                            charge.is_refundable
                                                              ? _vm.__("yes")
                                                              : _vm.__("no")
                                                          ) +
                                                          "\n                                                        "
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              ),
                                            ]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("div", { staticClass: "col-md-1" }, [
                                          _c(
                                            "div",
                                            { staticClass: "form-group mb-2" },
                                            [
                                              _c("label", [
                                                _vm._v(
                                                  _vm._s(_vm.__("status"))
                                                ),
                                              ]),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "form-check form-switch mt-1",
                                                },
                                                [
                                                  _c("input", {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model",
                                                        value: charge.is_active,
                                                        expression:
                                                          "charge.is_active",
                                                      },
                                                    ],
                                                    staticClass:
                                                      "form-check-input",
                                                    attrs: {
                                                      type: "checkbox",
                                                      id: "status_" + index,
                                                    },
                                                    domProps: {
                                                      checked: Array.isArray(
                                                        charge.is_active
                                                      )
                                                        ? _vm._i(
                                                            charge.is_active,
                                                            null
                                                          ) > -1
                                                        : charge.is_active,
                                                    },
                                                    on: {
                                                      change: function (
                                                        $event
                                                      ) {
                                                        var $$a =
                                                            charge.is_active,
                                                          $$el = $event.target,
                                                          $$c = $$el.checked
                                                            ? true
                                                            : false
                                                        if (
                                                          Array.isArray($$a)
                                                        ) {
                                                          var $$v = null,
                                                            $$i = _vm._i(
                                                              $$a,
                                                              $$v
                                                            )
                                                          if ($$el.checked) {
                                                            $$i < 0 &&
                                                              _vm.$set(
                                                                charge,
                                                                "is_active",
                                                                $$a.concat([
                                                                  $$v,
                                                                ])
                                                              )
                                                          } else {
                                                            $$i > -1 &&
                                                              _vm.$set(
                                                                charge,
                                                                "is_active",
                                                                $$a
                                                                  .slice(0, $$i)
                                                                  .concat(
                                                                    $$a.slice(
                                                                      $$i + 1
                                                                    )
                                                                  )
                                                              )
                                                          }
                                                        } else {
                                                          _vm.$set(
                                                            charge,
                                                            "is_active",
                                                            $$c
                                                          )
                                                        }
                                                      },
                                                    },
                                                  }),
                                                ]
                                              ),
                                            ]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c(
                                          "div",
                                          {
                                            staticClass:
                                              "col-md-1 d-flex align-items-end mb-2",
                                          },
                                          [
                                            _vm.$can(
                                              "additional_charges_delete"
                                            )
                                              ? _c(
                                                  "button",
                                                  {
                                                    staticClass:
                                                      "btn btn-danger",
                                                    attrs: { type: "button" },
                                                    on: {
                                                      click: function ($event) {
                                                        return _vm.removeCharge(
                                                          index
                                                        )
                                                      },
                                                    },
                                                  },
                                                  [
                                                    _c("i", {
                                                      staticClass:
                                                        "fa fa-trash",
                                                    }),
                                                  ]
                                                )
                                              : _vm._e(),
                                          ]
                                        ),
                                      ]
                                    : _vm._e(),
                                ],
                                2
                              ),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "row mt-1" }, [
                                    _c("div", { staticClass: "col-12" }, [
                                      _c("label", { staticClass: "me-3" }, [
                                        _vm._v(
                                          _vm._s(_vm.__("applicable_on")) + ":"
                                        ),
                                      ]),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        {
                                          staticClass:
                                            "form-check form-check-inline",
                                        },
                                        [
                                          _c("input", {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: charge.applicable_on,
                                                expression:
                                                  "charge.applicable_on",
                                              },
                                            ],
                                            staticClass: "form-check-input",
                                            attrs: {
                                              type: "checkbox",
                                              id: "type_order_" + index,
                                              value: "order",
                                            },
                                            domProps: {
                                              checked: Array.isArray(
                                                charge.applicable_on
                                              )
                                                ? _vm._i(
                                                    charge.applicable_on,
                                                    "order"
                                                  ) > -1
                                                : charge.applicable_on,
                                            },
                                            on: {
                                              change: function ($event) {
                                                var $$a = charge.applicable_on,
                                                  $$el = $event.target,
                                                  $$c = $$el.checked
                                                    ? true
                                                    : false
                                                if (Array.isArray($$a)) {
                                                  var $$v = "order",
                                                    $$i = _vm._i($$a, $$v)
                                                  if ($$el.checked) {
                                                    $$i < 0 &&
                                                      _vm.$set(
                                                        charge,
                                                        "applicable_on",
                                                        $$a.concat([$$v])
                                                      )
                                                  } else {
                                                    $$i > -1 &&
                                                      _vm.$set(
                                                        charge,
                                                        "applicable_on",
                                                        $$a
                                                          .slice(0, $$i)
                                                          .concat(
                                                            $$a.slice($$i + 1)
                                                          )
                                                      )
                                                  }
                                                } else {
                                                  _vm.$set(
                                                    charge,
                                                    "applicable_on",
                                                    $$c
                                                  )
                                                }
                                              },
                                            },
                                          }),
                                          _vm._v(" "),
                                          _c(
                                            "label",
                                            {
                                              staticClass: "form-check-label",
                                              attrs: {
                                                for: "type_order_" + index,
                                              },
                                            },
                                            [_vm._v(_vm._s(_vm.__("order")))]
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        {
                                          staticClass:
                                            "form-check form-check-inline",
                                        },
                                        [
                                          _c("input", {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: charge.applicable_on,
                                                expression:
                                                  "charge.applicable_on",
                                              },
                                            ],
                                            staticClass: "form-check-input",
                                            attrs: {
                                              type: "checkbox",
                                              id: "type_self_pickup_" + index,
                                              value: "self_pickup",
                                            },
                                            domProps: {
                                              checked: Array.isArray(
                                                charge.applicable_on
                                              )
                                                ? _vm._i(
                                                    charge.applicable_on,
                                                    "self_pickup"
                                                  ) > -1
                                                : charge.applicable_on,
                                            },
                                            on: {
                                              change: function ($event) {
                                                var $$a = charge.applicable_on,
                                                  $$el = $event.target,
                                                  $$c = $$el.checked
                                                    ? true
                                                    : false
                                                if (Array.isArray($$a)) {
                                                  var $$v = "self_pickup",
                                                    $$i = _vm._i($$a, $$v)
                                                  if ($$el.checked) {
                                                    $$i < 0 &&
                                                      _vm.$set(
                                                        charge,
                                                        "applicable_on",
                                                        $$a.concat([$$v])
                                                      )
                                                  } else {
                                                    $$i > -1 &&
                                                      _vm.$set(
                                                        charge,
                                                        "applicable_on",
                                                        $$a
                                                          .slice(0, $$i)
                                                          .concat(
                                                            $$a.slice($$i + 1)
                                                          )
                                                      )
                                                  }
                                                } else {
                                                  _vm.$set(
                                                    charge,
                                                    "applicable_on",
                                                    $$c
                                                  )
                                                }
                                              },
                                            },
                                          }),
                                          _vm._v(" "),
                                          _c(
                                            "label",
                                            {
                                              staticClass: "form-check-label",
                                              attrs: {
                                                for:
                                                  "type_self_pickup_" + index,
                                              },
                                            },
                                            [
                                              _vm._v(
                                                _vm._s(_vm.__("self_pickup"))
                                              ),
                                            ]
                                          ),
                                        ]
                                      ),
                                    ]),
                                  ])
                                : _vm._e(),
                            ]
                          )
                        }),
                      ],
                      2
                    )
                  }),
                  1
                ),
                _vm._v(" "),
                _c("div", { staticClass: "mt-3 d-flex justify-content-end" }, [
                  _vm.$can("additional_charges_create")
                    ? _c(
                        "button",
                        {
                          staticClass: "btn btn-success",
                          attrs: { type: "button" },
                          on: { click: _vm.addCharge },
                        },
                        [_vm._v(_vm._s(_vm.__("add_charge")))]
                      )
                    : _vm._e(),
                ]),
                _vm._v(" "),
                _vm.$can("additional_charges_update")
                  ? _c(
                      "b-button",
                      {
                        staticClass: "mt-3",
                        attrs: {
                          type: "submit",
                          variant: "primary",
                          disabled: _vm.isLoading,
                        },
                      },
                      [
                        _vm._v(
                          "\n                            " +
                            _vm._s(_vm.__("update")) +
                            "\n                            "
                        ),
                        _vm.isLoading
                          ? _c("b-spinner", { attrs: { small: "" } })
                          : _vm._e(),
                      ],
                      1
                    )
                  : _vm._e(),
              ],
              1
            ),
          ]),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);