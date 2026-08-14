"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Setting_PrivacyPolicySalesman_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tinymce_tinymce_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tinymce/tinymce-vue */ "./node_modules/@tinymce/tinymce-vue/lib/es2015/main/ts/index.js");
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  components: {
    'editor': _tinymce_tinymce_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      isLoading: false,
      isLoadingLanguages: false,
      policies: {
        privacy_policy_salesman: "",
        terms_conditions_salesman: ""
      },
      record: null,
      // Multi-language support
      activeLanguageTab: 0,
      translations: {},
      defaultLanguageId: null,
      languages: [],
      // Translate buttons
      translatableFields: ['privacy_policy_salesman', 'terms_conditions_salesman'],
      loadingEmpty: false,
      loadingOverwrite: false
    };
  },
  created: function created() {
    this.fetchActiveLanguages();
    this.getPrivacyPolicySalesman();
  },
  methods: {
    // Get editor configuration with safe fallbacks
    getEditorConfig: function getEditorConfig() {
      var plugins = this.$editorPlugins && Array.isArray(this.$editorPlugins) ? this.$editorPlugins : ["autolink", "lists", "link", "image", "charmap", "anchor", "searchreplace", "visualblocks", "media", "table", "wordcount", "code", "codesample"];
      var toolbar = this.$editorToolbar || "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | charmap | code | removeformat";
      var fontSizes = this.$editorFont_size_formats || '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt';
      return _objectSpread({
        height: 400,
        plugins: plugins,
        toolbar: toolbar,
        font_size_formats: fontSizes
      }, this.$tinymceImageUploadOptions());
    },
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this = this;
      this.isLoadingLanguages = true;
      return axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/active_languages').then(function (response) {
        if (response.data.data) {
          _this.languages = response.data.data;
          var defaultLang = _this.languages.find(function (lang) {
            return lang.is_default === 1;
          });
          if (defaultLang) {
            _this.defaultLanguageId = defaultLang.id;
          }
          _this.initializeTranslations();
          _this.isLoadingLanguages = false;
        } else {
          _this.isLoadingLanguages = false;
        }
      })["catch"](function (error) {
        console.error('Error loading languages:', error);
        _this.isLoadingLanguages = false;
      });
    },
    initializeTranslations: function initializeTranslations() {
      var allTranslations = {};
      this.languages.forEach(function (language) {
        allTranslations[language.id] = {
          privacy_policy_salesman: '',
          terms_conditions_salesman: ''
        };
      });
      this.translations = allTranslations;
    },
    getPrivacyPolicySalesman: function getPrivacyPolicySalesman() {
      var _this2 = this;
      // Wait for languages to be loaded first
      if (this.languages.length === 0) {
        this.fetchActiveLanguages().then(function () {
          _this2.loadPolicyData();
        });
      } else {
        this.loadPolicyData();
      }
    },
    loadPolicyData: function loadPolicyData() {
      var _this3 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/privacy_policy_salesman').then(function (response) {
        _this3.record = response.data.data;

        // Parse language-wise data from settings
        var privacyPolicyData = {};
        var termsConditionsData = {};
        _this3.record.forEach(function (item) {
          if (item.variable === 'privacy_policy_salesman') {
            // Try to parse as JSON (language-wise), fallback to plain text
            try {
              var parsed = JSON.parse(item.value);
              if (_typeof(parsed) === 'object' && parsed !== null) {
                // It's JSON with language codes
                Object.keys(parsed).forEach(function (langCode) {
                  var lang = _this3.languages.find(function (l) {
                    return l.code === langCode;
                  });
                  if (lang) {
                    privacyPolicyData[lang.id] = parsed[langCode];
                  }
                });
              } else {
                // It's a string, assign to default language
                if (_this3.defaultLanguageId) {
                  privacyPolicyData[_this3.defaultLanguageId] = item.value;
                }
              }
            } catch (e) {
              // Not JSON, it's plain text - assign to default language
              if (_this3.defaultLanguageId) {
                privacyPolicyData[_this3.defaultLanguageId] = item.value;
              }
            }
          } else if (item.variable === 'terms_conditions_salesman') {
            // Try to parse as JSON (language-wise), fallback to plain text
            try {
              var _parsed = JSON.parse(item.value);
              if (_typeof(_parsed) === 'object' && _parsed !== null) {
                // It's JSON with language codes
                Object.keys(_parsed).forEach(function (langCode) {
                  var lang = _this3.languages.find(function (l) {
                    return l.code === langCode;
                  });
                  if (lang) {
                    termsConditionsData[lang.id] = _parsed[langCode];
                  }
                });
              } else {
                // It's a string, assign to default language
                if (_this3.defaultLanguageId) {
                  termsConditionsData[_this3.defaultLanguageId] = item.value;
                }
              }
            } catch (e) {
              // Not JSON, it's plain text - assign to default language
              if (_this3.defaultLanguageId) {
                termsConditionsData[_this3.defaultLanguageId] = item.value;
              }
            }
          }
        });

        // Update translations with reactivity
        _this3.languages.forEach(function (language) {
          if (!_this3.translations[language.id]) {
            _this3.$set(_this3.translations, language.id, {
              privacy_policy_salesman: '',
              terms_conditions_salesman: ''
            });
          }
          if (privacyPolicyData[language.id]) {
            _this3.$set(_this3.translations[language.id], 'privacy_policy_salesman', privacyPolicyData[language.id]);
          }
          if (termsConditionsData[language.id]) {
            _this3.$set(_this3.translations[language.id], 'terms_conditions_salesman', termsConditionsData[language.id]);
          }
        });
      });
    },
    saveRecord: function saveRecord() {
      var _this4 = this;
      // Validate default language
      if (!this.validateDefaultLanguage()) {
        return;
      }
      this.isLoading = true;
      var vm = this;

      // Build language-wise data structure
      var privacyPolicyByLang = {};
      var termsConditionsByLang = {};
      this.languages.forEach(function (language) {
        var translation = _this4.translations[language.id];
        if (translation) {
          privacyPolicyByLang[language.code] = translation.privacy_policy_salesman || '';
          termsConditionsByLang[language.code] = translation.terms_conditions_salesman || '';
        }
      });

      // Prepare form data with JSON-encoded language-wise values
      var formData = {
        privacy_policy_salesman: JSON.stringify(privacyPolicyByLang),
        terms_conditions_salesman: JSON.stringify(termsConditionsByLang)
      };
      var url = this.$apiUrl + '/privacy_policy_salesman/save';
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, formData).then(function (res) {
        var data = res.data;
        if (data.status === 1) {
          vm.showMessage("success", data.message || 'Privacy Policy and Terms & Conditions saved successfully!');
          vm.isLoading = false;
        } else {
          vm.showError(data.message);
          vm.isLoading = false;
        }
      })["catch"](function (error) {
        if (error.request.statusText) {
          vm.showError(error.request.statusText);
        } else if (error.message) {
          vm.showError(error.message);
        } else {
          vm.showError(__('something_went_wrong'));
        }
        vm.isLoading = false;
      });
    },
    validateDefaultLanguage: function validateDefaultLanguage() {
      if (!this.defaultLanguageId) {
        this.showError(__('default_language_not_found'));
        return false;
      }
      var defaultTranslation = this.translations[this.defaultLanguageId];
      if (!defaultTranslation.privacy_policy_salesman || defaultTranslation.privacy_policy_salesman.trim() === '') {
        this.showError(__('please_fill_privacy_policy_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      if (!defaultTranslation.terms_conditions_salesman || defaultTranslation.terms_conditions_salesman.trim() === '') {
        this.showError(__('please_fill_terms_conditions_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      return true;
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this5 = this;
      var defaultLangIndex = this.languages.findIndex(function (lang) {
        return lang.id === _this5.defaultLanguageId;
      });
      if (defaultLangIndex !== -1) {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLanguageTab = defaultLangIndex;
      }
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

/***/ "./resources/js/views/Setting/PrivacyPolicySalesman.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/Setting/PrivacyPolicySalesman.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PrivacyPolicySalesman_vue_vue_type_template_id_1f9683cc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PrivacyPolicySalesman.vue?vue&type=template&id=1f9683cc */ "./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=template&id=1f9683cc");
/* harmony import */ var _PrivacyPolicySalesman_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PrivacyPolicySalesman.vue?vue&type=script&lang=js */ "./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PrivacyPolicySalesman_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _PrivacyPolicySalesman_vue_vue_type_template_id_1f9683cc__WEBPACK_IMPORTED_MODULE_0__.render,
  _PrivacyPolicySalesman_vue_vue_type_template_id_1f9683cc__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Setting/PrivacyPolicySalesman.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicySalesman_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PrivacyPolicySalesman.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicySalesman_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=template&id=1f9683cc":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=template&id=1f9683cc ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicySalesman_vue_vue_type_template_id_1f9683cc__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicySalesman_vue_vue_type_template_id_1f9683cc__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PrivacyPolicySalesman_vue_vue_type_template_id_1f9683cc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./PrivacyPolicySalesman.vue?vue&type=template&id=1f9683cc */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=template&id=1f9683cc");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=template&id=1f9683cc":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/PrivacyPolicySalesman.vue?vue&type=template&id=1f9683cc ***!
  \***********************************************************************************************************************************************************************************************************************************/
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
            _c("h3", [
              _vm._v(
                _vm._s(_vm.__("salesman_privacy_policy_and_term_conditions"))
              ),
            ]),
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
                        _vm._s(
                          _vm.__("salesman_privacy_policy_and_term_conditions")
                        )
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
        _c(
          "form",
          {
            attrs: {
              id: "contact_us_form",
              method: "post",
              enctype: "multipart/form-data",
            },
            on: {
              submit: function ($event) {
                $event.preventDefault()
                return _vm.saveRecord.apply(null, arguments)
              },
            },
          },
          [
            _c("div", { staticClass: "card" }, [
              _c("div", { staticClass: "card-header" }, [
                _c("h4", { staticClass: "card-title" }, [
                  _vm._v(
                    _vm._s(
                      _vm.__("salesman_privacy_policy_and_term_conditions")
                    )
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "card-body" }, [
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
                                                "\n                                            " +
                                                  _vm._s(language.name) +
                                                  "\n                                        "
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
                                _vm.$route.path.includes("/seller") &&
                                language.is_default &&
                                _vm.languages.length > 1
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
                                                return _vm.translateEmpty(
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
                                  { staticClass: "form-group" },
                                  [
                                    _c(
                                      "div",
                                      {
                                        staticClass:
                                          "d-flex justify-content-between mb-2",
                                      },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(_vm.__("privacy_policy")) +
                                              " "
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
                                        _c(
                                          "a",
                                          {
                                            directives: [
                                              {
                                                name: "b-tooltip",
                                                rawName: "v-b-tooltip.hover",
                                                modifiers: { hover: true },
                                              },
                                            ],
                                            staticClass:
                                              "btn btn-sm btn-primary",
                                            attrs: {
                                              href:
                                                _vm.$baseUrl +
                                                "/salesman-privacy-policy?lang=" +
                                                language.code,
                                              title: _vm.__("privacy_policy"),
                                              target: "_blank",
                                            },
                                          },
                                          [
                                            _c("i", {
                                              staticClass: "fa fa-eye",
                                            }),
                                          ]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c("editor", {
                                      attrs: {
                                        placeholder: _vm.__("privacy_policy"),
                                        init: _vm.getEditorConfig(),
                                        disabled:
                                          !_vm.$route.path.includes("/seller"),
                                      },
                                      model: {
                                        value:
                                          _vm.translations[language.id]
                                            .privacy_policy_salesman,
                                        callback: function ($$v) {
                                          _vm.$set(
                                            _vm.translations[language.id],
                                            "privacy_policy_salesman",
                                            $$v
                                          )
                                        },
                                        expression:
                                          "translations[language.id].privacy_policy_salesman",
                                      },
                                    }),
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c("h4", { staticClass: "card-title mt-4" }, [
                                  _vm._v(
                                    _vm._s(_vm.__("update_term_conditions"))
                                  ),
                                ]),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "form-group" },
                                  [
                                    _c(
                                      "div",
                                      {
                                        staticClass:
                                          "d-flex justify-content-between mb-2",
                                      },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(_vm.__("term_conditions")) +
                                              " "
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
                                        _c(
                                          "a",
                                          {
                                            directives: [
                                              {
                                                name: "b-tooltip",
                                                rawName: "v-b-tooltip.hover",
                                                modifiers: { hover: true },
                                              },
                                            ],
                                            staticClass:
                                              "btn btn-sm btn-primary",
                                            attrs: {
                                              href:
                                                _vm.$baseUrl +
                                                "/salesman-terms-conditions?lang=" +
                                                language.code,
                                              title: _vm.__("terms_conditions"),
                                              target: "_blank",
                                            },
                                          },
                                          [
                                            _c("i", {
                                              staticClass: "fa fa-eye",
                                            }),
                                          ]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c("editor", {
                                      attrs: {
                                        placeholder: _vm.__("terms_conditions"),
                                        init: _vm.getEditorConfig(),
                                        disabled:
                                          !_vm.$route.path.includes("/seller"),
                                      },
                                      model: {
                                        value:
                                          _vm.translations[language.id]
                                            .terms_conditions_salesman,
                                        callback: function ($$v) {
                                          _vm.$set(
                                            _vm.translations[language.id],
                                            "terms_conditions_salesman",
                                            $$v
                                          )
                                        },
                                        expression:
                                          "translations[language.id].terms_conditions_salesman",
                                      },
                                    }),
                                  ],
                                  1
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
                      [
                        _c("b-spinner", {
                          attrs: { label: _vm.__("loading") },
                        }),
                      ],
                      1
                    )
                  : _vm._e(),
              ]),
              _vm._v(" "),
              _vm.$route.path.includes("/seller")
                ? _c(
                    "div",
                    { staticClass: "card-footer" },
                    [
                      _c(
                        "b-button",
                        {
                          attrs: {
                            type: "submit",
                            variant: "primary",
                            disabled: _vm.isLoading,
                          },
                        },
                        [
                          _vm._v(
                            " " +
                              _vm._s(_vm.__("update")) +
                              "\n                            "
                          ),
                          _vm.isLoading
                            ? _c("b-spinner", {
                                attrs: { small: "", label: "Spinning" },
                              })
                            : _vm._e(),
                        ],
                        1
                      ),
                    ],
                    1
                  )
                : _vm._e(),
            ]),
          ]
        ),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);