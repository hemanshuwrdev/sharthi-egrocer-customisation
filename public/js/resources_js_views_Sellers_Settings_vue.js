"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_Settings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Auth.js */ "./resources/js/Auth.js");
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      login_user: _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user,
      isLoading: false,
      thermal_paper_width: 80,
      thermal_logo: "",
      thermal_logo_url: "",
      paperOptions: [{
        text: ' 58 mm',
        value: 58
      }, {
        text: ' 80 mm',
        value: 80
      }, {
        text: ' 112 mm',
        value: 112
      }, {
        text: ' 152 mm',
        value: 152
      }],
      isOrderLoading: false,
      order_cutoff_time: "",
      min_order_amount: "",
      delivery_otp_enabled: true,
      isPaymentLoading: false,
      paymentMethods: [],
      isInvoiceLoading: false,
      invoice_prefix: "",
      invoice_suffix: "",
      invoice_next_number: 1,
      isCreditNoteLoading: false,
      credit_note_prefix: "",
      credit_note_suffix: "",
      credit_note_next_number: 1,
      isSensitiveLoading: false,
      sensitivePasswordIsSet: false,
      sensitiveOldPassword: "",
      sensitiveNewPassword: "",
      sensitiveConfirmPassword: "",
      sensitiveForgotMode: false,
      sensitiveOtp: "",
      isSendingOtp: false,
      otpResendCooldown: 0,
      otpCooldownTimer: null
    };
  },
  created: function created() {
    this.getSettings();
    this.getOrderSettings();
    this.getPaymentMethods();
    this.getInvoiceSettings();
    this.getCreditNoteSettings();
    this.getSensitivePasswordStatus();
  },
  computed: {
    invoiceNumberPreview: function invoiceNumberPreview() {
      var padded = String(this.invoice_next_number || 1).padStart(4, '0');
      return "".concat(this.invoice_prefix || '').concat(padded).concat(this.invoice_suffix || '');
    },
    creditNoteNumberPreview: function creditNoteNumberPreview() {
      var padded = String(this.credit_note_next_number || 1).padStart(4, '0');
      return "".concat(this.credit_note_prefix || '').concat(padded).concat(this.credit_note_suffix || '');
    }
  },
  methods: {
    // ================= LOAD SETTINGS =================
    getSettings: function getSettings() {
      var _this = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/seller/thermal-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          var settings = res.data.data;
          if (settings.thermal_paper_width) {
            _this.thermal_paper_width = parseInt(settings.thermal_paper_width);
          }
          if (settings.invoice_logo) {
            _this.thermal_logo_url = _this.$storageUrl + settings.invoice_logo;
          }
        }
      })["catch"](function () {
        _this.showError('Failed to load thermal settings');
      });
    },
    // ================= FILE UPLOAD =================
    handleThermalLogo: function handleThermalLogo() {
      this.thermal_logo = this.$refs.file_thermal_logo.files[0];
      this.thermal_logo_url = URL.createObjectURL(this.thermal_logo);
    },
    dropThermalLogo: function dropThermalLogo(event) {
      event.preventDefault();
      this.$refs.file_thermal_logo.files = event.dataTransfer.files;
      this.handleThermalLogo();
    },
    // ================= SAVE SETTINGS =================
    saveSettings: function saveSettings() {
      var _this2 = this;
      this.isLoading = true;
      var formData = new FormData();
      formData.append('thermal_paper_width', this.thermal_paper_width);
      if (this.thermal_logo) {
        formData.append('invoice_logo', this.thermal_logo);
      }
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/seller/thermal-settings/save', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (res) {
        if (res.data.status) {
          _this2.showMessage('success', __(res.data.message));
        } else {
          _this2.showError(res.data.message || 'Failed to save');
        }
        _this2.isLoading = false;
      })["catch"](function () {
        _this2.showError('Failed to save settings');
        _this2.isLoading = false;
      });
    },
    // ================= ORDER SETTINGS =================
    getOrderSettings: function getOrderSettings() {
      var _this3 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/order-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          var _res$data$data$min_or;
          _this3.order_cutoff_time = res.data.data.order_cutoff_time || "";
          _this3.min_order_amount = (_res$data$data$min_or = res.data.data.min_order_amount) !== null && _res$data$data$min_or !== void 0 ? _res$data$data$min_or : "";
          _this3.delivery_otp_enabled = res.data.data.delivery_otp_enabled !== undefined ? !!res.data.data.delivery_otp_enabled : true;
        }
      })["catch"](function () {
        _this3.showError('Failed to load order settings');
      });
    },
    // ================= PAYMENT METHODS =================
    getPaymentMethods: function getPaymentMethods() {
      var _this4 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/payment_methods').then(function (res) {
        if (res.data.status && res.data.data) {
          _this4.paymentMethods = res.data.data.methods.map(function (m) {
            var _m$discount_percent;
            return _objectSpread(_objectSpread({}, m), {}, {
              is_enabled: m.is_enabled ? 1 : 0,
              discount_percent: (_m$discount_percent = m.discount_percent) !== null && _m$discount_percent !== void 0 ? _m$discount_percent : 0
            });
          });
        }
      })["catch"](function () {});
    },
    savePaymentMethods: function savePaymentMethods() {
      var _this5 = this;
      this.isPaymentLoading = true;
      var formData = new FormData();
      this.paymentMethods.forEach(function (m) {
        formData.append(m.method, m.is_editable ? m.is_enabled : 0);
        if (m.method === 'cash') {
          formData.append('cash_discount_percent', m.discount_percent || 0);
        }
      });
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/payment_methods/save', formData).then(function (res) {
        if (res.data.status) {
          _this5.showMessage('success', __(res.data.message));
        } else {
          _this5.showError(res.data.message || 'Failed to save');
        }
        _this5.isPaymentLoading = false;
      })["catch"](function () {
        _this5.showError('Failed to save');
        _this5.isPaymentLoading = false;
      });
    },
    saveOrderSettings: function saveOrderSettings() {
      var _this6 = this;
      this.isOrderLoading = true;
      var formData = new FormData();
      formData.append('order_cutoff_time', this.order_cutoff_time || '');
      formData.append('min_order_amount', this.min_order_amount || '');
      formData.append('delivery_otp_enabled', this.delivery_otp_enabled ? 1 : 0);
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/order-settings/save', formData).then(function (res) {
        if (res.data.status) {
          _this6.showMessage('success', __(res.data.message));
        } else {
          _this6.showError(res.data.message || 'Failed to save');
        }
        _this6.isOrderLoading = false;
      })["catch"](function () {
        _this6.showError('Failed to save order settings');
        _this6.isOrderLoading = false;
      });
    },
    // ================= INVOICE SETTINGS =================
    getInvoiceSettings: function getInvoiceSettings() {
      var _this7 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/invoice-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          _this7.invoice_prefix = res.data.data.invoice_prefix || "";
          _this7.invoice_suffix = res.data.data.invoice_suffix || "";
          _this7.invoice_next_number = res.data.data.invoice_next_number || 1;
        }
      })["catch"](function () {
        _this7.showError('Failed to load invoice settings');
      });
    },
    saveInvoiceSettings: function saveInvoiceSettings() {
      var _this8 = this;
      this.isInvoiceLoading = true;
      var formData = new FormData();
      formData.append('invoice_prefix', this.invoice_prefix || '');
      formData.append('invoice_suffix', this.invoice_suffix || '');
      formData.append('invoice_next_number', this.invoice_next_number || 1);
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/invoice-settings/save', formData).then(function (res) {
        if (res.data.status) {
          _this8.showMessage('success', __(res.data.message));
        } else {
          _this8.showError(res.data.message || 'Failed to save');
        }
        _this8.isInvoiceLoading = false;
      })["catch"](function () {
        _this8.showError('Failed to save invoice settings');
        _this8.isInvoiceLoading = false;
      });
    },
    getCreditNoteSettings: function getCreditNoteSettings() {
      var _this9 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/credit-note-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          _this9.credit_note_prefix = res.data.data.credit_note_prefix || "";
          _this9.credit_note_suffix = res.data.data.credit_note_suffix || "";
          _this9.credit_note_next_number = res.data.data.credit_note_next_number || 1;
        }
      })["catch"](function () {
        _this9.showError('Failed to load credit note settings');
      });
    },
    saveCreditNoteSettings: function saveCreditNoteSettings() {
      var _this10 = this;
      this.isCreditNoteLoading = true;
      var formData = new FormData();
      formData.append('credit_note_prefix', this.credit_note_prefix || '');
      formData.append('credit_note_suffix', this.credit_note_suffix || '');
      formData.append('credit_note_next_number', this.credit_note_next_number || 1);
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/credit-note-settings/save', formData).then(function (res) {
        if (res.data.status) {
          _this10.showMessage('success', __(res.data.message));
        } else {
          _this10.showError(res.data.message || 'Failed to save');
        }
        _this10.isCreditNoteLoading = false;
      })["catch"](function () {
        _this10.showError('Failed to save credit note settings');
        _this10.isCreditNoteLoading = false;
      });
    },
    // ================= SENSITIVE OPERATIONS PASSWORD =================
    getSensitivePasswordStatus: function getSensitivePasswordStatus() {
      var _this11 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/sensitive-password').then(function (res) {
        if (res.data.status && res.data.data) {
          _this11.sensitivePasswordIsSet = !!res.data.data.is_set;
        }
      })["catch"](function () {});
    },
    startSensitiveForgotMode: function startSensitiveForgotMode() {
      this.sensitiveForgotMode = true;
      this.sensitiveOldPassword = '';
      this.sendSensitiveOtp();
    },
    cancelSensitiveForgotMode: function cancelSensitiveForgotMode() {
      this.sensitiveForgotMode = false;
      this.sensitiveOtp = '';
      if (this.otpCooldownTimer) {
        clearInterval(this.otpCooldownTimer);
        this.otpCooldownTimer = null;
      }
      this.otpResendCooldown = 0;
    },
    sendSensitiveOtp: function sendSensitiveOtp() {
      var _this12 = this;
      if (this.isSendingOtp || this.otpResendCooldown > 0) return;
      this.isSendingOtp = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/sensitive-password/send-otp').then(function (res) {
        if (res.data.status) {
          _this12.showMessage('success', __(res.data.message));
          _this12.otpResendCooldown = 60;
          if (_this12.otpCooldownTimer) clearInterval(_this12.otpCooldownTimer);
          _this12.otpCooldownTimer = setInterval(function () {
            _this12.otpResendCooldown--;
            if (_this12.otpResendCooldown <= 0) {
              clearInterval(_this12.otpCooldownTimer);
              _this12.otpCooldownTimer = null;
            }
          }, 1000);
        } else {
          _this12.showError(res.data.message || 'Failed to send OTP');
        }
        _this12.isSendingOtp = false;
      })["catch"](function () {
        _this12.showError('Failed to send OTP');
        _this12.isSendingOtp = false;
      });
    },
    saveSensitivePassword: function saveSensitivePassword() {
      var _this13 = this;
      this.isSensitiveLoading = true;
      var formData = new FormData();
      if (this.sensitiveForgotMode) {
        formData.append('otp', this.sensitiveOtp || '');
        formData.append('new_password', this.sensitiveNewPassword || '');
        formData.append('confirm_new_password', this.sensitiveConfirmPassword || '');
      } else if (this.sensitivePasswordIsSet) {
        formData.append('old_password', this.sensitiveOldPassword || '');
        formData.append('new_password', this.sensitiveNewPassword || '');
        formData.append('confirm_new_password', this.sensitiveConfirmPassword || '');
      } else {
        formData.append('password', this.sensitiveNewPassword || '');
        formData.append('confirm_password', this.sensitiveConfirmPassword || '');
      }
      var endpoint = this.sensitiveForgotMode ? '/sensitive-password/reset-with-otp' : '/sensitive-password/save';
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + endpoint, formData).then(function (res) {
        if (res.data.status) {
          _this13.showMessage('success', __(res.data.message));
          _this13.sensitivePasswordIsSet = true;
          _this13.sensitiveOldPassword = '';
          _this13.sensitiveNewPassword = '';
          _this13.sensitiveConfirmPassword = '';
          _this13.cancelSensitiveForgotMode();
        } else {
          _this13.showError(res.data.message || 'Failed to save');
        }
        _this13.isSensitiveLoading = false;
      })["catch"](function () {
        _this13.showError('Failed to save');
        _this13.isSensitiveLoading = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.custom-image[data-v-7d055d3d] {\n    height: auto;\n    width: 60%;\n    border: 1px solid #ddd;\n    padding: 5px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_style_index_0_id_7d055d3d_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_style_index_0_id_7d055d3d_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_style_index_0_id_7d055d3d_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sellers/Settings.vue":
/*!*************************************************!*\
  !*** ./resources/js/views/Sellers/Settings.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Settings_vue_vue_type_template_id_7d055d3d_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settings.vue?vue&type=template&id=7d055d3d&scoped=true */ "./resources/js/views/Sellers/Settings.vue?vue&type=template&id=7d055d3d&scoped=true");
/* harmony import */ var _Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settings.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/Settings.vue?vue&type=script&lang=js");
/* harmony import */ var _Settings_vue_vue_type_style_index_0_id_7d055d3d_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css */ "./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Settings_vue_vue_type_template_id_7d055d3d_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Settings_vue_vue_type_template_id_7d055d3d_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "7d055d3d",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/Settings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/Settings.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./resources/js/views/Sellers/Settings.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_style_index_0_id_7d055d3d_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=style&index=0&id=7d055d3d&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/Settings.vue?vue&type=template&id=7d055d3d&scoped=true":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/Sellers/Settings.vue?vue&type=template&id=7d055d3d&scoped=true ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_7d055d3d_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_7d055d3d_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Settings_vue_vue_type_template_id_7d055d3d_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settings.vue?vue&type=template&id=7d055d3d&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=template&id=7d055d3d&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=template&id=7d055d3d&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settings.vue?vue&type=template&id=7d055d3d&scoped=true ***!
  \**********************************************************************************************************************************************************************************************************************************/
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
      _c("div", { staticClass: "row mb-3" }, [
        _c("div", { staticClass: "col-12" }, [
          _c("h3", [_vm._v(_vm._s(_vm.__("thermal_print_settings")))]),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "card" }, [
        _c("div", { staticClass: "card-header" }, [
          _c("h4", [_vm._v(_vm._s(_vm.__("thermal_print_settings")))]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card-body" }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "form-group col-md-6" }, [
              _c("label", [_vm._v(_vm._s(_vm.__("thermal_invoice_logo")))]),
              _vm._v(" "),
              _c("input", {
                ref: "file_thermal_logo",
                staticClass: "file-input",
                attrs: { type: "file", accept: "image/*" },
                on: { change: _vm.handleThermalLogo },
              }),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "file-input-div bg-gray-100",
                  on: {
                    click: function ($event) {
                      return _vm.$refs.file_thermal_logo.click()
                    },
                    drop: _vm.dropThermalLogo,
                    dragover: _vm.$dragoverFile,
                    dragleave: _vm.$dragleaveFile,
                  },
                },
                [
                  _vm.thermal_logo && _vm.thermal_logo.name
                    ? [
                        _c("label", [
                          _vm._v(
                            _vm._s(_vm.__("selected_file_name")) +
                              ": " +
                              _vm._s(_vm.thermal_logo.name)
                          ),
                        ]),
                      ]
                    : [
                        _vm._m(0),
                        _vm._v(" "),
                        _c("label", [
                          _vm._v(
                            _vm._s(_vm.__("drag_and_drop_to_upload_image"))
                          ),
                        ]),
                      ],
                ],
                2
              ),
              _vm._v(" "),
              _vm.thermal_logo_url
                ? _c("div", { staticClass: "row mt-2" }, [
                    _c("div", { staticClass: "col-md-4" }, [
                      _c("img", {
                        staticClass: "custom-image",
                        attrs: { src: _vm.thermal_logo_url },
                      }),
                    ]),
                  ])
                : _vm._e(),
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "form-group col-md-6" },
              [
                _c("label", [_vm._v(_vm._s(_vm.__("thermal_paper_width")))]),
                _vm._v(" "),
                _c("b-form-radio-group", {
                  attrs: {
                    options: _vm.paperOptions,
                    buttons: "",
                    "button-variant": "outline-primary",
                  },
                  model: {
                    value: _vm.thermal_paper_width,
                    callback: function ($$v) {
                      _vm.thermal_paper_width = $$v
                    },
                    expression: "thermal_paper_width",
                  },
                }),
              ],
              1
            ),
          ]),
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "card-footer" },
          [
            _c(
              "b-button",
              {
                attrs: { variant: "primary", disabled: _vm.isLoading },
                on: { click: _vm.saveSettings },
              },
              [
                _vm._v(
                  "\n                    " +
                    _vm._s(_vm.__("save")) +
                    "\n                    "
                ),
                _vm.isLoading
                  ? _c("b-spinner", { attrs: { small: "" } })
                  : _vm._e(),
              ],
              1
            ),
          ],
          1
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "card mt-4" }, [
        _c("div", { staticClass: "card-header" }, [
          _c("h4", [_vm._v(_vm._s(_vm.__("Payment Collection Methods")))]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card-body" }, [
          _c("p", { staticClass: "text-muted font-size-13" }, [
            _vm._v(
              _vm._s(
                _vm.__(
                  "Toggle the methods your drivers can use to collect payment. Methods disabled by admin cannot be enabled."
                )
              )
            ),
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "row" },
            _vm._l(_vm.paymentMethods, function (method) {
              return _c(
                "div",
                { key: method.method, staticClass: "form-group col-md-3" },
                [
                  _c("label", [
                    _vm._v(
                      _vm._s(
                        _vm.__(
                          method.method.charAt(0).toUpperCase() +
                            method.method.slice(1)
                        )
                      )
                    ),
                  ]),
                  _c("br"),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-check form-switch" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: method.is_enabled,
                          expression: "method.is_enabled",
                        },
                      ],
                      staticClass: "form-check-input",
                      attrs: {
                        type: "checkbox",
                        "true-value": "1",
                        "false-value": "0",
                        disabled: !method.is_editable,
                        title: !method.is_editable
                          ? _vm.__("Disabled by admin")
                          : "",
                      },
                      domProps: {
                        checked: Array.isArray(method.is_enabled)
                          ? _vm._i(method.is_enabled, null) > -1
                          : _vm._q(method.is_enabled, "1"),
                      },
                      on: {
                        change: function ($event) {
                          var $$a = method.is_enabled,
                            $$el = $event.target,
                            $$c = $$el.checked ? "1" : "0"
                          if (Array.isArray($$a)) {
                            var $$v = null,
                              $$i = _vm._i($$a, $$v)
                            if ($$el.checked) {
                              $$i < 0 &&
                                _vm.$set(
                                  method,
                                  "is_enabled",
                                  $$a.concat([$$v])
                                )
                            } else {
                              $$i > -1 &&
                                _vm.$set(
                                  method,
                                  "is_enabled",
                                  $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                )
                            }
                          } else {
                            _vm.$set(method, "is_enabled", $$c)
                          }
                        },
                      },
                    }),
                  ]),
                  _vm._v(" "),
                  !method.is_editable
                    ? _c("small", { staticClass: "text-danger" }, [
                        _vm._v(_vm._s(_vm.__("Disabled by admin"))),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  method.method === "cash"
                    ? _c("div", { staticClass: "mt-2" }, [
                        _c(
                          "label",
                          { staticClass: "font-size-13 text-muted" },
                          [_vm._v(_vm._s(_vm.__("Cash discount %")))]
                        ),
                        _vm._v(" "),
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: method.discount_percent,
                              expression: "method.discount_percent",
                            },
                          ],
                          staticClass: "form-control form-control-sm",
                          attrs: {
                            type: "number",
                            min: "0",
                            max: "100",
                            step: "0.01",
                            disabled: !method.is_editable || !method.is_enabled,
                            placeholder: _vm.__("e.g. 2"),
                          },
                          domProps: { value: method.discount_percent },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                method,
                                "discount_percent",
                                $event.target.value
                              )
                            },
                          },
                        }),
                        _vm._v(" "),
                        _c("small", { staticClass: "text-muted" }, [
                          _vm._v(
                            _vm._s(
                              _vm.__(
                                "Knocked off final_total when the retailer pays cash, so cash is always the cheapest option."
                              )
                            )
                          ),
                        ]),
                      ])
                    : _vm._e(),
                ]
              )
            }),
            0
          ),
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "card-footer" },
          [
            _c(
              "b-button",
              {
                attrs: { variant: "primary", disabled: _vm.isPaymentLoading },
                on: { click: _vm.savePaymentMethods },
              },
              [
                _vm._v(
                  "\n                    " +
                    _vm._s(_vm.__("save")) +
                    "\n                    "
                ),
                _vm.isPaymentLoading
                  ? _c("b-spinner", { attrs: { small: "" } })
                  : _vm._e(),
              ],
              1
            ),
          ],
          1
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "card mt-4" }, [
        _c("div", { staticClass: "card-header" }, [
          _c("h4", [_vm._v(_vm._s(_vm.__("order_settings")))]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card-body" }, [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "form-group col-md-6" }, [
              _c("label", { attrs: { for: "order_cutoff_time" } }, [
                _vm._v(_vm._s(_vm.__("order_cutoff_time"))),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.order_cutoff_time,
                    expression: "order_cutoff_time",
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  type: "time",
                  id: "order_cutoff_time",
                  placeholder: "15:00",
                },
                domProps: { value: _vm.order_cutoff_time },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.order_cutoff_time = $event.target.value
                  },
                },
              }),
              _vm._v(" "),
              _c("span", { staticClass: "text text-primary font-size-13" }, [
                _vm._v(
                  "(" +
                    _vm._s(
                      _vm.__(
                        "orders_at_or_before_this_time_get_next_day_delivery_after_get_day_after"
                      )
                    ) +
                    ")"
                ),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group col-md-6" }, [
              _c("label", { attrs: { for: "min_order_amount" } }, [
                _vm._v(_vm._s(_vm.__("min_order_amount"))),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.min_order_amount,
                    expression: "min_order_amount",
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  id: "min_order_amount",
                  placeholder: _vm.__("optional"),
                },
                domProps: { value: _vm.min_order_amount },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.min_order_amount = $event.target.value
                  },
                },
              }),
              _vm._v(" "),
              _c("span", { staticClass: "text text-primary font-size-13" }, [
                _vm._v(
                  "(" +
                    _vm._s(
                      _vm.__(
                        "minimum_cart_total_required_for_a_retailer_to_place_an_order"
                      )
                    ) +
                    ")"
                ),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group col-md-6" }, [
              _c("label", { attrs: { for: "delivery_otp_enabled" } }, [
                _vm._v(_vm._s(_vm.__("delivery_otp_enabled"))),
              ]),
              _c("br"),
              _vm._v(" "),
              _c("div", { staticClass: "form-check form-switch" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.delivery_otp_enabled,
                      expression: "delivery_otp_enabled",
                    },
                  ],
                  staticClass: "form-check-input",
                  attrs: { type: "checkbox", id: "delivery_otp_enabled" },
                  domProps: {
                    checked: Array.isArray(_vm.delivery_otp_enabled)
                      ? _vm._i(_vm.delivery_otp_enabled, null) > -1
                      : _vm.delivery_otp_enabled,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.delivery_otp_enabled,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            (_vm.delivery_otp_enabled = $$a.concat([$$v]))
                        } else {
                          $$i > -1 &&
                            (_vm.delivery_otp_enabled = $$a
                              .slice(0, $$i)
                              .concat($$a.slice($$i + 1)))
                        }
                      } else {
                        _vm.delivery_otp_enabled = $$c
                      }
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _c("span", { staticClass: "text text-primary font-size-13" }, [
                _vm._v(
                  "(" +
                    _vm._s(
                      _vm.__(
                        "driver_must_enter_the_retailers_otp_to_mark_an_order_delivered_not_the_login_otp"
                      )
                    ) +
                    ")"
                ),
              ]),
            ]),
          ]),
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "card-footer" },
          [
            _c(
              "b-button",
              {
                attrs: { variant: "primary", disabled: _vm.isOrderLoading },
                on: { click: _vm.saveOrderSettings },
              },
              [
                _vm._v(
                  "\n                    " +
                    _vm._s(_vm.__("save")) +
                    "\n                    "
                ),
                _vm.isOrderLoading
                  ? _c("b-spinner", { attrs: { small: "" } })
                  : _vm._e(),
              ],
              1
            ),
          ],
          1
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "card mt-4" }, [
        _c("div", { staticClass: "card-header" }, [
          _c("h4", [_vm._v(_vm._s(_vm.__("invoice_settings")))]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card-body" }, [
          _c("p", { staticClass: "text-muted font-size-13" }, [
            _vm._v(_vm._s(_vm.__("invoice_settings_hint"))),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "form-group col-md-4" }, [
              _c("label", { attrs: { for: "invoice_prefix" } }, [
                _vm._v(_vm._s(_vm.__("invoice_prefix"))),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.invoice_prefix,
                    expression: "invoice_prefix",
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  id: "invoice_prefix",
                  placeholder: _vm.__("optional"),
                },
                domProps: { value: _vm.invoice_prefix },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.invoice_prefix = $event.target.value
                  },
                },
              }),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group col-md-4" }, [
              _c("label", { attrs: { for: "invoice_next_number" } }, [
                _vm._v(_vm._s(_vm.__("invoice_number"))),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model.number",
                    value: _vm.invoice_next_number,
                    expression: "invoice_next_number",
                    modifiers: { number: true },
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  type: "number",
                  min: "1",
                  id: "invoice_next_number",
                  placeholder: "1",
                },
                domProps: { value: _vm.invoice_next_number },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.invoice_next_number = _vm._n($event.target.value)
                  },
                  blur: function ($event) {
                    return _vm.$forceUpdate()
                  },
                },
              }),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group col-md-4" }, [
              _c("label", { attrs: { for: "invoice_suffix" } }, [
                _vm._v(_vm._s(_vm.__("invoice_suffix"))),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.invoice_suffix,
                    expression: "invoice_suffix",
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  id: "invoice_suffix",
                  placeholder: _vm.__("optional"),
                },
                domProps: { value: _vm.invoice_suffix },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.invoice_suffix = $event.target.value
                  },
                },
              }),
            ]),
          ]),
          _vm._v(" "),
          _c("p", { staticClass: "text-muted font-size-13 mb-0" }, [
            _vm._v("\n                    " + _vm._s(_vm.__("preview")) + ": "),
            _c("strong", [_vm._v(_vm._s(_vm.invoiceNumberPreview))]),
          ]),
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "card-footer" },
          [
            _c(
              "b-button",
              {
                attrs: { variant: "primary", disabled: _vm.isInvoiceLoading },
                on: { click: _vm.saveInvoiceSettings },
              },
              [
                _vm._v(
                  "\n                    " +
                    _vm._s(_vm.__("save")) +
                    "\n                    "
                ),
                _vm.isInvoiceLoading
                  ? _c("b-spinner", { attrs: { small: "" } })
                  : _vm._e(),
              ],
              1
            ),
          ],
          1
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "card mt-4" }, [
        _c("div", { staticClass: "card-header" }, [
          _c("h4", [_vm._v(_vm._s(_vm.__("credit_note_settings")))]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card-body" }, [
          _c("p", { staticClass: "text-muted font-size-13" }, [
            _vm._v(_vm._s(_vm.__("credit_note_settings_hint"))),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "form-group col-md-4" }, [
              _c("label", { attrs: { for: "credit_note_prefix" } }, [
                _vm._v(_vm._s(_vm.__("credit_note_prefix"))),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.credit_note_prefix,
                    expression: "credit_note_prefix",
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  id: "credit_note_prefix",
                  placeholder: _vm.__("optional"),
                },
                domProps: { value: _vm.credit_note_prefix },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.credit_note_prefix = $event.target.value
                  },
                },
              }),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group col-md-4" }, [
              _c("label", { attrs: { for: "credit_note_next_number" } }, [
                _vm._v(_vm._s(_vm.__("credit_note_number"))),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model.number",
                    value: _vm.credit_note_next_number,
                    expression: "credit_note_next_number",
                    modifiers: { number: true },
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  type: "number",
                  min: "1",
                  id: "credit_note_next_number",
                  placeholder: "1",
                },
                domProps: { value: _vm.credit_note_next_number },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.credit_note_next_number = _vm._n($event.target.value)
                  },
                  blur: function ($event) {
                    return _vm.$forceUpdate()
                  },
                },
              }),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "form-group col-md-4" }, [
              _c("label", { attrs: { for: "credit_note_suffix" } }, [
                _vm._v(_vm._s(_vm.__("credit_note_suffix"))),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.credit_note_suffix,
                    expression: "credit_note_suffix",
                  },
                ],
                staticClass: "form-control",
                attrs: {
                  type: "text",
                  id: "credit_note_suffix",
                  placeholder: _vm.__("optional"),
                },
                domProps: { value: _vm.credit_note_suffix },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.credit_note_suffix = $event.target.value
                  },
                },
              }),
            ]),
          ]),
          _vm._v(" "),
          _c("p", { staticClass: "text-muted font-size-13 mb-0" }, [
            _vm._v("\n                    " + _vm._s(_vm.__("preview")) + ": "),
            _c("strong", [_vm._v(_vm._s(_vm.creditNoteNumberPreview))]),
          ]),
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "card-footer" },
          [
            _c(
              "b-button",
              {
                attrs: {
                  variant: "primary",
                  disabled: _vm.isCreditNoteLoading,
                },
                on: { click: _vm.saveCreditNoteSettings },
              },
              [
                _vm._v(
                  "\n                    " +
                    _vm._s(_vm.__("save")) +
                    "\n                    "
                ),
                _vm.isCreditNoteLoading
                  ? _c("b-spinner", { attrs: { small: "" } })
                  : _vm._e(),
              ],
              1
            ),
          ],
          1
        ),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "card mt-4" }, [
        _c("div", { staticClass: "card-header" }, [
          _c("h4", [_vm._v(_vm._s(_vm.__("Sensitive Operations Password")))]),
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "card-body" },
          [
            _c("p", { staticClass: "text-muted font-size-13" }, [
              _vm._v(
                "\n                    " +
                  _vm._s(
                    _vm.__(
                      "This password gates risky corrections (like editing a driver's recorded payment method) so only you can authorize them, even if staff have access to this panel."
                    )
                  ) +
                  "\n                "
              ),
            ]),
            _vm._v(" "),
            !_vm.sensitivePasswordIsSet
              ? [
                  _c("div", { staticClass: "row" }, [
                    _c("div", { staticClass: "form-group col-md-6" }, [
                      _c("label", [_vm._v(_vm._s(_vm.__("Password")))]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.sensitiveNewPassword,
                            expression: "sensitiveNewPassword",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "password",
                          autocomplete: "new-password",
                        },
                        domProps: { value: _vm.sensitiveNewPassword },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.sensitiveNewPassword = $event.target.value
                          },
                        },
                      }),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group col-md-6" }, [
                      _c("label", [_vm._v(_vm._s(_vm.__("Confirm Password")))]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.sensitiveConfirmPassword,
                            expression: "sensitiveConfirmPassword",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "password",
                          autocomplete: "new-password",
                        },
                        domProps: { value: _vm.sensitiveConfirmPassword },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.sensitiveConfirmPassword = $event.target.value
                          },
                        },
                      }),
                    ]),
                  ]),
                ]
              : [
                  _c("div", { staticClass: "row" }, [
                    _c(
                      "div",
                      { staticClass: "form-group col-md-4" },
                      [
                        !_vm.sensitiveForgotMode
                          ? [
                              _c("label", [
                                _vm._v(_vm._s(_vm.__("Old Password"))),
                              ]),
                              _vm._v(" "),
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.sensitiveOldPassword,
                                    expression: "sensitiveOldPassword",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: {
                                  type: "password",
                                  autocomplete: "current-password",
                                },
                                domProps: { value: _vm.sensitiveOldPassword },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.sensitiveOldPassword =
                                      $event.target.value
                                  },
                                },
                              }),
                              _vm._v(" "),
                              _c(
                                "a",
                                {
                                  staticClass: "small",
                                  attrs: { href: "javascript:void(0)" },
                                  on: { click: _vm.startSensitiveForgotMode },
                                },
                                [
                                  _vm._v(
                                    _vm._s(_vm.__("forgot_password")) + "?"
                                  ),
                                ]
                              ),
                            ]
                          : [
                              _c("label", [_vm._v(_vm._s(_vm.__("OTP")))]),
                              _vm._v(" "),
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.sensitiveOtp,
                                    expression: "sensitiveOtp",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: {
                                  type: "text",
                                  maxlength: "6",
                                  inputmode: "numeric",
                                  autocomplete: "one-time-code",
                                },
                                domProps: { value: _vm.sensitiveOtp },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.sensitiveOtp = $event.target.value
                                  },
                                },
                              }),
                              _vm._v(" "),
                              _c("span", { staticClass: "small" }, [
                                _c(
                                  "a",
                                  {
                                    attrs: { href: "javascript:void(0)" },
                                    on: {
                                      click: _vm.cancelSensitiveForgotMode,
                                    },
                                  },
                                  [_vm._v(_vm._s(_vm.__("cancel")))]
                                ),
                                _vm._v(
                                  "\n                                     | \n                                    "
                                ),
                                _c(
                                  "a",
                                  {
                                    class: {
                                      "text-muted": _vm.otpResendCooldown > 0,
                                    },
                                    attrs: { href: "javascript:void(0)" },
                                    on: {
                                      click: function ($event) {
                                        _vm.otpResendCooldown === 0 &&
                                          _vm.sendSensitiveOtp()
                                      },
                                    },
                                  },
                                  [
                                    _vm._v(
                                      "\n                                        " +
                                        _vm._s(
                                          _vm.otpResendCooldown > 0
                                            ? _vm.__("resend_code") +
                                                " (" +
                                                _vm.otpResendCooldown +
                                                "s)"
                                            : _vm.__("resend_code")
                                        ) +
                                        "\n                                    "
                                    ),
                                  ]
                                ),
                              ]),
                            ],
                      ],
                      2
                    ),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group col-md-4" }, [
                      _c("label", [_vm._v(_vm._s(_vm.__("New Password")))]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.sensitiveNewPassword,
                            expression: "sensitiveNewPassword",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "password",
                          autocomplete: "new-password",
                        },
                        domProps: { value: _vm.sensitiveNewPassword },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.sensitiveNewPassword = $event.target.value
                          },
                        },
                      }),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "form-group col-md-4" }, [
                      _c("label", [
                        _vm._v(_vm._s(_vm.__("Confirm New Password"))),
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.sensitiveConfirmPassword,
                            expression: "sensitiveConfirmPassword",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "password",
                          autocomplete: "new-password",
                        },
                        domProps: { value: _vm.sensitiveConfirmPassword },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.sensitiveConfirmPassword = $event.target.value
                          },
                        },
                      }),
                    ]),
                  ]),
                ],
          ],
          2
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "card-footer" },
          [
            _c(
              "b-button",
              {
                attrs: { variant: "primary", disabled: _vm.isSensitiveLoading },
                on: { click: _vm.saveSensitivePassword },
              },
              [
                _vm._v(
                  "\n                    " +
                    _vm._s(
                      _vm.sensitiveForgotMode
                        ? _vm.__("reset_password")
                        : _vm.sensitivePasswordIsSet
                        ? _vm.__("change_password")
                        : _vm.__("set_password")
                    ) +
                    "\n                    "
                ),
                _vm.isSensitiveLoading
                  ? _c("b-spinner", { attrs: { small: "" } })
                  : _vm._e(),
              ],
              1
            ),
          ],
          1
        ),
      ]),
    ]),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("label", [
      _c("i", { staticClass: "fa fa-cloud-upload-alt fa-2x" }),
    ])
  },
]
render._withStripped = true



/***/ })

}]);