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
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




// tab order = b-tabs index; "?tab=profile" in the URL opens that tab (used by the My Profile menu link)
var TAB_KEYS = ['orders', 'numbering', 'notifications', 'security', 'profile'];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    SellerProfileForm: function SellerProfileForm() {
      return __webpack_require__.e(/*! import() */ "resources_js_views_Seller_EditSeller_vue").then(__webpack_require__.bind(__webpack_require__, /*! ../Seller/EditSeller.vue */ "./resources/js/views/Seller/EditSeller.vue"));
    }
  },
  data: function data() {
    return {
      login_user: _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user,
      activeTab: 0,
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
      instantDiscountPercent: 0,
      isInvoiceLoading: false,
      invoice_prefix: "",
      invoice_suffix: "",
      invoice_next_number: 1,
      isLoadingSlipSettingsLoading: false,
      loading_slip_prefix: "",
      loading_slip_suffix: "",
      loading_slip_next_number: 1,
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
      otpCooldownTimer: null,
      // Notifications tab (order mail / SMS per status)
      statuses: [],
      mail_statuses: [],
      mobile_statuses: [],
      sms_statuses: [],
      isNotifyLoading: false,
      notificationsLoaded: false,
      // Security tab: login credentials + account deletion
      credentials: {
        username: _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user.username,
        current_password: "",
        password: "",
        confirm_password: ""
      },
      isCredentialsLoading: false,
      isDeletingAccount: false
    };
  },
  created: function created() {
    // open on the tab the user was last on (a per-browser convenience; fine if storage is blocked)
    var fromUrl = TAB_KEYS.indexOf(this.$route.query.tab);
    if (fromUrl >= 0) {
      this.activeTab = fromUrl;
    } else {
      try {
        var saved = TAB_KEYS.indexOf(window.localStorage.getItem('sarthi_seller_settings_tab_key'));
        if (saved >= 0) this.activeTab = saved;
      } catch (e) {}
    }
    this.ensureNotificationsLoaded();
    this.getSettings();
    this.getOrderSettings();
    this.getPaymentMethods();
    this.getInvoiceSettings();
    this.getLoadingSlipSettings();
    this.getCreditNoteSettings();
    this.getSensitivePasswordStatus();
  },
  watch: {
    activeTab: function activeTab(index) {
      try {
        window.localStorage.setItem('sarthi_seller_settings_tab_key', TAB_KEYS[index]);
      } catch (e) {}
      this.ensureNotificationsLoaded();
      // keep the address in step with the tab, so a refresh or a shared link lands on it
      if (this.$route.query.tab !== TAB_KEYS[index]) {
        var nav = this.$router.replace({
          query: Object.assign({}, this.$route.query, {
            tab: TAB_KEYS[index]
          })
        });
        if (nav && nav["catch"]) nav["catch"](function () {});
      }
    },
    // the top-menu "My Profile" link while this page is already open
    '$route.query.tab': function $routeQueryTab(tab) {
      var index = TAB_KEYS.indexOf(tab);
      if (index >= 0 && index !== this.activeTab) this.activeTab = index;
    }
  },
  computed: {
    // The shared Cash / Bank discount can be edited while at least one of the two is on and allowed.
    instantDiscountEditable: function instantDiscountEditable() {
      return this.paymentMethods.some(function (m) {
        return (m.method === 'cash' || m.method === 'upi') && m.is_editable && m.is_enabled == 1;
      });
    },
    invoiceNumberPreview: function invoiceNumberPreview() {
      var padded = String(this.invoice_next_number || 1).padStart(4, '0');
      return "".concat(this.invoice_prefix || '').concat(padded).concat(this.invoice_suffix || '');
    },
    creditNoteNumberPreview: function creditNoteNumberPreview() {
      var padded = String(this.credit_note_next_number || 1).padStart(4, '0');
      return "".concat(this.credit_note_prefix || '').concat(padded).concat(this.credit_note_suffix || '');
    },
    loadingSlipNumberPreview: function loadingSlipNumberPreview() {
      var padded = String(this.loading_slip_next_number || 1).padStart(4, '0');
      return "".concat(this.loading_slip_prefix || '').concat(padded).concat(this.loading_slip_suffix || '');
    }
  },
  methods: {
    // ================= NOTIFICATIONS (order mail / SMS) =================
    // loaded the first time the tab is opened, so the page start-up stays light
    ensureNotificationsLoaded: function ensureNotificationsLoaded() {
      if (this.notificationsLoaded || TAB_KEYS[this.activeTab] !== 'notifications') return;
      this.notificationsLoaded = true;
      this.getOrderStatus();
      this.getMailSetting();
    },
    /**
     * Status label for display. API returns status_name as object by lang code { en: "...", hi: "..." }.
     * Picks current app locale; fallback to status.status.
     */
    getStatusDisplayName: function getStatusDisplayName(status) {
      if (!status) return '';
      var sn = status.status_name;
      if (sn == null) return status.status || '';
      if (typeof sn === 'string') return sn.trim() || status.status || '';
      if (_typeof(sn) === 'object' && !Array.isArray(sn)) {
        var appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
        var forLocale = sn[appLocale];
        if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
        var first = Object.values(sn).find(function (val) {
          return val != null && String(val).trim() !== '';
        });
        return first != null ? String(first).trim() : status.status || '';
      }
      return status.status || '';
    },
    getOrderStatus: function getOrderStatus() {
      var _this = this;
      this.isNotifyLoading = true;
      Promise.all([axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/order_statuses'), axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/order_statuses/self_pickup')]).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          orderResponse = _ref2[0],
          selfPickResponse = _ref2[1];
        _this.isNotifyLoading = false;
        // self-pickup statuses 1, 7 and 8 duplicate the normal ones, so they are left out
        var selfPickStatuses = selfPickResponse.data.data.filter(function (item) {
          return ![1, 7, 8].includes(item.id);
        });
        _this.statuses = [].concat(_toConsumableArray(orderResponse.data.data), _toConsumableArray(selfPickStatuses));
      })["catch"](function (error) {
        _this.isNotifyLoading = false;
        if (error.request && error.request.statusText) {
          _this.showError(error.request.statusText);
        } else if (error.message) {
          _this.showError(error.message);
        } else {
          _this.showError(__('something_went_wrong'));
        }
      });
    },
    getMailSetting: function getMailSetting() {
      var _this2 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/mail_settings').then(function (response) {
        // rebuilt from scratch so a reload after saving never doubles up
        var mail = [],
          mobile = [],
          sms = [];
        response.data.data.forEach(function (status) {
          if (status.mail_status === 1) mail.push(status.order_status_id);
          if (status.mobile_status === 1) mobile.push(status.order_status_id);
          if (status.sms_status === 1) sms.push(status.order_status_id);
        });
        _this2.mail_statuses = mail;
        _this2.mobile_statuses = mobile;
        _this2.sms_statuses = sms;
      })["catch"](function (error) {
        if (error.request && error.request.statusText) {
          _this2.showError(error.request.statusText);
        } else if (error.message) {
          _this2.showError(error.message);
        } else {
          _this2.showError(__('something_went_wrong'));
        }
      });
    },
    saveMailSetting: function saveMailSetting() {
      var _this3 = this;
      this.isNotifyLoading = true;
      var formData = new FormData();
      this.statuses.forEach(function (status) {
        formData.append('status_ids[]', status.id);
        formData.append('mail_statuses[]', _this3.mail_statuses.includes(status.id) ? "1" : "0");
        formData.append('mobile_statuses[]', _this3.mobile_statuses.includes(status.id) ? "1" : "0");
        formData.append('sms_statuses[]', _this3.sms_statuses.includes(status.id) ? "1" : "0");
      });
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + '/mail_settings/save', formData).then(function (res) {
        _this3.isNotifyLoading = false;
        if (res.data.status === 1) {
          _this3.showMessage("success", res.data.message);
          _this3.getMailSetting();
        } else {
          _this3.showError(res.data.message);
        }
      })["catch"](function (error) {
        _this3.isNotifyLoading = false;
        if (error.request && error.request.statusText) {
          _this3.showError(error.request.statusText);
        } else if (error.message) {
          _this3.showError(error.message);
        } else {
          _this3.showError(__('something_went_wrong'));
        }
      });
    },
    // ================= LOGIN USERNAME / PASSWORD =================
    saveCredentials: function saveCredentials() {
      var _this4 = this;
      this.isCredentialsLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + '/system_users/change_password', this.credentials).then(function (res) {
        _this4.isCredentialsLoading = false;
        if (res.data.status === 1) {
          _this4.showMessage("success", res.data.message);
          // Update Auth.user.username in memory and localStorage so the header reflects immediately
          _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user.username = _this4.credentials.username;
          window.localStorage.setItem('user', JSON.stringify(_Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user));
          _this4.$router.push('/seller');
        } else {
          _this4.showError(res.data.message);
        }
      })["catch"](function (error) {
        _this4.isCredentialsLoading = false;
        if (error.request && error.request.statusText) {
          _this4.showError(error.request.statusText);
        } else if (error.message) {
          _this4.showError(error.message);
        } else {
          _this4.showError(__('something_went_wrong'));
        }
      });
    },
    // ================= DELETE ACCOUNT =================
    deleteAccount: function deleteAccount() {
      var _this5 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('delete_account_confirmation'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: __('yes_delete'),
        cancelButtonText: __('cancel')
      }).then(function (result) {
        if (!result.isConfirmed) return;
        _this5.$swal.fire({
          title: __('final_confirmation'),
          text: __('delete_account_final_warning'),
          icon: 'error',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: __('yes_delete_permanently'),
          cancelButtonText: __('cancel'),
          dangerMode: true
        }).then(function (secondResult) {
          if (!secondResult.isConfirmed) return;
          _this5.isDeletingAccount = true;
          axios__WEBPACK_IMPORTED_MODULE_0___default().get(_this5.$sellerApiUrl + '/delete_seller_account').then(function (response) {
            _this5.isDeletingAccount = false;
            if (response.data.status === 1) {
              _this5.showSuccess(response.data.message);
              _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].logout();
              setTimeout(function () {
                _this5.$router.push('/login');
              }, 1500);
            } else {
              _this5.showError(response.data.message);
            }
          })["catch"](function (error) {
            _this5.isDeletingAccount = false;
            if (error.request && error.request.statusText) {
              _this5.showError(error.request.statusText);
            } else if (error.message) {
              _this5.showError(error.message);
            } else {
              _this5.showError(__('something_went_wrong'));
            }
          });
        });
      });
    },
    methodLabel: function methodLabel(method) {
      // label only: the method key stays 'upi' everywhere else (saving, the driver app, exports)
      if (method === 'upi') return this.__('Bank');
      return this.__(method.charAt(0).toUpperCase() + method.slice(1));
    },
    methodIcon: function methodIcon(method) {
      return {
        cash: 'fa fa-money-bill-alt',
        upi: 'fa fa-mobile-alt',
        cheque: 'fa fa-money-check-alt',
        signature: 'fa fa-file-signature'
      }[method] || 'fa fa-credit-card';
    },
    // ================= LOAD SETTINGS =================
    getSettings: function getSettings() {
      var _this6 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/seller/thermal-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          var settings = res.data.data;
          if (settings.thermal_paper_width) {
            _this6.thermal_paper_width = parseInt(settings.thermal_paper_width);
          }
          if (settings.invoice_logo) {
            _this6.thermal_logo_url = _this6.$storageUrl + settings.invoice_logo;
          }
        }
      })["catch"](function () {
        _this6.showError('Failed to load thermal settings');
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
      var _this7 = this;
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
          _this7.showMessage('success', __(res.data.message));
        } else {
          _this7.showError(res.data.message || 'Failed to save');
        }
        _this7.isLoading = false;
      })["catch"](function () {
        _this7.showError('Failed to save settings');
        _this7.isLoading = false;
      });
    },
    // ================= ORDER SETTINGS =================
    getOrderSettings: function getOrderSettings() {
      var _this8 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/order-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          var _res$data$data$min_or;
          _this8.order_cutoff_time = res.data.data.order_cutoff_time || "";
          _this8.min_order_amount = (_res$data$data$min_or = res.data.data.min_order_amount) !== null && _res$data$data$min_or !== void 0 ? _res$data$data$min_or : "";
          _this8.delivery_otp_enabled = res.data.data.delivery_otp_enabled !== undefined ? !!res.data.data.delivery_otp_enabled : true;
        }
      })["catch"](function () {
        _this8.showError('Failed to load order settings');
      });
    },
    // ================= PAYMENT METHODS =================
    getPaymentMethods: function getPaymentMethods() {
      var _this9 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/payment_methods').then(function (res) {
        if (res.data.status && res.data.data) {
          _this9.paymentMethods = res.data.data.methods.map(function (m) {
            return _objectSpread(_objectSpread({}, m), {}, {
              is_enabled: m.is_enabled ? 1 : 0
            });
          });
          // cash and bank rows carry the same shared %
          var cash = res.data.data.methods.find(function (m) {
            return m.method === 'cash';
          });
          _this9.instantDiscountPercent = cash && cash.discount_percent ? cash.discount_percent : 0;
        }
      })["catch"](function () {});
    },
    savePaymentMethods: function savePaymentMethods() {
      var _this10 = this;
      this.isPaymentLoading = true;
      var formData = new FormData();
      this.paymentMethods.forEach(function (m) {
        formData.append(m.method, m.is_editable ? m.is_enabled : 0);
      });
      // one shared Cash / Bank discount (stored as cash_discount_percent)
      formData.append('cash_discount_percent', this.instantDiscountPercent || 0);
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/payment_methods/save', formData).then(function (res) {
        if (res.data.status) {
          _this10.showMessage('success', __(res.data.message));
        } else {
          _this10.showError(res.data.message || 'Failed to save');
        }
        _this10.isPaymentLoading = false;
      })["catch"](function () {
        _this10.showError('Failed to save');
        _this10.isPaymentLoading = false;
      });
    },
    saveOrderSettings: function saveOrderSettings() {
      var _this11 = this;
      this.isOrderLoading = true;
      var formData = new FormData();
      formData.append('order_cutoff_time', this.order_cutoff_time || '');
      formData.append('min_order_amount', this.min_order_amount || '');
      formData.append('delivery_otp_enabled', this.delivery_otp_enabled ? 1 : 0);
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/order-settings/save', formData).then(function (res) {
        if (res.data.status) {
          _this11.showMessage('success', __(res.data.message));
        } else {
          _this11.showError(res.data.message || 'Failed to save');
        }
        _this11.isOrderLoading = false;
      })["catch"](function () {
        _this11.showError('Failed to save order settings');
        _this11.isOrderLoading = false;
      });
    },
    // ================= INVOICE SETTINGS =================
    getInvoiceSettings: function getInvoiceSettings() {
      var _this12 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/invoice-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          _this12.invoice_prefix = res.data.data.invoice_prefix || "";
          _this12.invoice_suffix = res.data.data.invoice_suffix || "";
          _this12.invoice_next_number = res.data.data.invoice_next_number || 1;
        }
      })["catch"](function () {
        _this12.showError('Failed to load invoice settings');
      });
    },
    saveInvoiceSettings: function saveInvoiceSettings() {
      var _this13 = this;
      this.isInvoiceLoading = true;
      var formData = new FormData();
      formData.append('invoice_prefix', this.invoice_prefix || '');
      formData.append('invoice_suffix', this.invoice_suffix || '');
      formData.append('invoice_next_number', this.invoice_next_number || 1);
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/invoice-settings/save', formData).then(function (res) {
        if (res.data.status) {
          _this13.showMessage('success', __(res.data.message));
        } else {
          _this13.showError(res.data.message || 'Failed to save');
        }
        _this13.isInvoiceLoading = false;
      })["catch"](function () {
        _this13.showError('Failed to save invoice settings');
        _this13.isInvoiceLoading = false;
      });
    },
    getLoadingSlipSettings: function getLoadingSlipSettings() {
      var _this14 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/loading-slip-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          _this14.loading_slip_prefix = res.data.data.loading_slip_prefix || "";
          _this14.loading_slip_suffix = res.data.data.loading_slip_suffix || "";
          _this14.loading_slip_next_number = res.data.data.loading_slip_next_number || 1;
        }
      })["catch"](function () {
        _this14.showError('Failed to load loading slip settings');
      });
    },
    saveLoadingSlipSettings: function saveLoadingSlipSettings() {
      var _this15 = this;
      this.isLoadingSlipSettingsLoading = true;
      var formData = new FormData();
      formData.append('loading_slip_prefix', this.loading_slip_prefix || '');
      formData.append('loading_slip_suffix', this.loading_slip_suffix || '');
      formData.append('loading_slip_next_number', this.loading_slip_next_number || 1);
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/loading-slip-settings/save', formData).then(function (res) {
        if (res.data.status) {
          _this15.showMessage('success', __(res.data.message));
        } else {
          _this15.showError(res.data.message || 'Failed to save');
        }
        _this15.isLoadingSlipSettingsLoading = false;
      })["catch"](function () {
        _this15.showError('Failed to save loading slip settings');
        _this15.isLoadingSlipSettingsLoading = false;
      });
    },
    getCreditNoteSettings: function getCreditNoteSettings() {
      var _this16 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/credit-note-settings').then(function (res) {
        if (res.data.status && res.data.data) {
          _this16.credit_note_prefix = res.data.data.credit_note_prefix || "";
          _this16.credit_note_suffix = res.data.data.credit_note_suffix || "";
          _this16.credit_note_next_number = res.data.data.credit_note_next_number || 1;
        }
      })["catch"](function () {
        _this16.showError('Failed to load credit note settings');
      });
    },
    saveCreditNoteSettings: function saveCreditNoteSettings() {
      var _this17 = this;
      this.isCreditNoteLoading = true;
      var formData = new FormData();
      formData.append('credit_note_prefix', this.credit_note_prefix || '');
      formData.append('credit_note_suffix', this.credit_note_suffix || '');
      formData.append('credit_note_next_number', this.credit_note_next_number || 1);
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/credit-note-settings/save', formData).then(function (res) {
        if (res.data.status) {
          _this17.showMessage('success', __(res.data.message));
        } else {
          _this17.showError(res.data.message || 'Failed to save');
        }
        _this17.isCreditNoteLoading = false;
      })["catch"](function () {
        _this17.showError('Failed to save credit note settings');
        _this17.isCreditNoteLoading = false;
      });
    },
    // ================= SENSITIVE OPERATIONS PASSWORD =================
    getSensitivePasswordStatus: function getSensitivePasswordStatus() {
      var _this18 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/sensitive-password').then(function (res) {
        if (res.data.status && res.data.data) {
          _this18.sensitivePasswordIsSet = !!res.data.data.is_set;
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
      var _this19 = this;
      if (this.isSendingOtp || this.otpResendCooldown > 0) return;
      this.isSendingOtp = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$sellerApiUrl + '/sensitive-password/send-otp').then(function (res) {
        if (res.data.status) {
          _this19.showMessage('success', __(res.data.message));
          _this19.otpResendCooldown = 60;
          if (_this19.otpCooldownTimer) clearInterval(_this19.otpCooldownTimer);
          _this19.otpCooldownTimer = setInterval(function () {
            _this19.otpResendCooldown--;
            if (_this19.otpResendCooldown <= 0) {
              clearInterval(_this19.otpCooldownTimer);
              _this19.otpCooldownTimer = null;
            }
          }, 1000);
        } else {
          _this19.showError(res.data.message || 'Failed to send OTP');
        }
        _this19.isSendingOtp = false;
      })["catch"](function () {
        _this19.showError('Failed to send OTP');
        _this19.isSendingOtp = false;
      });
    },
    saveSensitivePassword: function saveSensitivePassword() {
      var _this20 = this;
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
          _this20.showMessage('success', __(res.data.message));
          _this20.sensitivePasswordIsSet = true;
          _this20.sensitiveOldPassword = '';
          _this20.sensitiveNewPassword = '';
          _this20.sensitiveConfirmPassword = '';
          _this20.cancelSensitiveForgotMode();
        } else {
          _this20.showError(res.data.message || 'Failed to save');
        }
        _this20.isSensitiveLoading = false;
      })["catch"](function () {
        _this20.showError('Failed to save');
        _this20.isSensitiveLoading = false;
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.custom-image[data-v-7d055d3d] {\n    height: auto;\n    width: 60%;\n    border: 1px solid #ddd;\n    padding: 5px;\n}\n\n/* tabs: same pill look as the Export Center */\n[data-v-7d055d3d] .settings-tabs {\n    flex-wrap: wrap;\n    gap: 8px;\n    border-bottom: 0;\n}\n[data-v-7d055d3d] .settings-tabs .nav-link {\n    border: 1px solid rgba(128, 128, 128, 0.3);\n    border-radius: 10px;\n    padding: 10px 18px;\n    font-weight: 600;\n    font-size: 13.5px;\n    color: #64748b;\n    background: transparent;\n}\n[data-v-7d055d3d] .settings-tabs .nav-link:hover {\n    border-color: rgba(128, 128, 128, 0.55);\n}\n[data-v-7d055d3d] .settings-tabs .nav-link.active {\n    background: rgba(16, 185, 129, 0.12);\n    border-color: #10b981;\n    color: #059669;\n}\n.settings-card[data-v-7d055d3d] {\n    border: 1px solid rgba(128, 128, 128, 0.22);\n    border-radius: 14px;\n}\n.settings-card-head[data-v-7d055d3d] {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    padding: 18px 20px 14px;\n}\n.settings-icon[data-v-7d055d3d] {\n    width: 38px;\n    height: 38px;\n    border-radius: 10px;\n    background: rgba(37, 99, 235, 0.1);\n    color: #2563eb;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    flex-shrink: 0;\n}\n.settings-icon--danger[data-v-7d055d3d] {\n    background: rgba(239, 68, 68, 0.12);\n    color: #dc2626;\n}\n.settings-card--danger[data-v-7d055d3d] {\n    border-color: rgba(239, 68, 68, 0.35);\n}\n\n/* notifications: status name, then a mail switch and an SMS switch */\n.notify-row[data-v-7d055d3d] {\n    display: grid;\n    grid-template-columns: minmax(0, 1fr) 72px 72px;\n    align-items: center;\n    gap: 8px;\n    padding: 11px 0;\n    border-bottom: 1px solid rgba(128, 128, 128, 0.15);\n}\n.notify-row[data-v-7d055d3d]:last-child {\n    border-bottom: 0;\n}\n.notify-row--head[data-v-7d055d3d] {\n    padding-top: 4px;\n    font-size: 12px;\n    font-weight: 700;\n    letter-spacing: 0.06em;\n    text-transform: uppercase;\n    color: #6c757d;\n}\n.notify-label[data-v-7d055d3d] {\n    margin: 0;\n    font-weight: 600;\n}\n.settings-card-foot[data-v-7d055d3d] {\n    padding: 14px 20px;\n    border-top: 1px solid rgba(128, 128, 128, 0.18);\n    display: flex;\n    justify-content: flex-end;\n}\n.setting-hint[data-v-7d055d3d] {\n    color: #6c757d;\n    font-size: 12.5px;\n    line-height: 1.45;\n}\n\n/* a setting = text on the left, its control on the right */\n.setting-row[data-v-7d055d3d] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 16px;\n    padding: 14px 0;\n    border-bottom: 1px solid rgba(128, 128, 128, 0.15);\n}\n.setting-row[data-v-7d055d3d]:last-child {\n    border-bottom: 0;\n}\n.setting-text[data-v-7d055d3d] {\n    flex: 1 1 220px;\n    min-width: 0;\n}\n.setting-title[data-v-7d055d3d] {\n    font-weight: 600;\n    margin-bottom: 2px;\n    display: block;\n}\n.setting-control[data-v-7d055d3d] {\n    flex: 0 0 150px;\n}\n.setting-control-switch[data-v-7d055d3d] {\n    flex: 0 0 auto;\n}\n\n/* payment method tiles */\n.method-tile[data-v-7d055d3d] {\n    border: 1px solid rgba(128, 128, 128, 0.3);\n    border-radius: 12px;\n    padding: 14px 16px;\n    transition: border-color 0.15s, background 0.15s;\n}\n.method-tile.is-on[data-v-7d055d3d] {\n    border-color: #10b981;\n    background: rgba(16, 185, 129, 0.07);\n}\n.method-tile.is-locked[data-v-7d055d3d] {\n    opacity: 0.65;\n}\n.method-icon[data-v-7d055d3d] {\n    width: 32px;\n    height: 32px;\n    border-radius: 8px;\n    background: rgba(128, 128, 128, 0.14);\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n}\n.method-tile.is-on .method-icon[data-v-7d055d3d] {\n    background: rgba(16, 185, 129, 0.2);\n    color: #059669;\n}\n\n/* numbering preview chip */\n.series-preview[data-v-7d055d3d] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 12px;\n    padding: 10px 14px;\n    border-radius: 10px;\n    background: rgba(128, 128, 128, 0.1);\n}\n.series-preview strong[data-v-7d055d3d] {\n    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;\n    font-size: 1.05rem;\n}\n@media (max-width: 575px) {\n.setting-control[data-v-7d055d3d] {\n        flex: 1 1 100%;\n}\n}\n", ""]);
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
    _c(
      "div",
      { staticClass: "page-heading" },
      [
        _c("div", { staticClass: "row mb-3" }, [
          _c("div", { staticClass: "col-12" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("settings")))]),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "text-muted mb-3" }, [
          _vm._v(
            _vm._s(
              _vm.__(
                "Manage how orders, payments and documents work for your store."
              )
            )
          ),
        ]),
        _vm._v(" "),
        _c(
          "b-tabs",
          {
            attrs: {
              pills: "",
              "nav-class": "settings-tabs mb-3",
              "content-class": "mt-1",
            },
            model: {
              value: _vm.activeTab,
              callback: function ($$v) {
                _vm.activeTab = $$v
              },
              expression: "activeTab",
            },
          },
          [
            _c(
              "b-tab",
              {
                scopedSlots: _vm._u([
                  {
                    key: "title",
                    fn: function () {
                      return [
                        _c("span", { staticClass: "tab-title" }, [
                          _c("i", { staticClass: "fa fa-shopping-cart me-2" }),
                          _vm._v(_vm._s(_vm.__("Orders & Payments"))),
                        ]),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              },
              [
                _vm._v(" "),
                _c("div", { staticClass: "row g-3" }, [
                  _c("div", { staticClass: "col-xl-5" }, [
                    _c("div", { staticClass: "card settings-card h-100" }, [
                      _c("div", { staticClass: "settings-card-head" }, [
                        _c("span", { staticClass: "settings-icon" }, [
                          _c("i", { staticClass: "fa fa-clipboard-list" }),
                        ]),
                        _vm._v(" "),
                        _c("h5", { staticClass: "mb-0" }, [
                          _vm._v(_vm._s(_vm.__("order_settings"))),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "card-body pt-0" }, [
                        _c("div", { staticClass: "setting-row" }, [
                          _c("div", { staticClass: "setting-text" }, [
                            _c(
                              "label",
                              {
                                staticClass: "setting-title",
                                attrs: { for: "order_cutoff_time" },
                              },
                              [_vm._v(_vm._s(_vm.__("order_cutoff_time")))]
                            ),
                            _vm._v(" "),
                            _c("div", { staticClass: "setting-hint" }, [
                              _vm._v(
                                _vm._s(
                                  _vm.__(
                                    "orders_at_or_before_this_time_get_next_day_delivery_after_get_day_after"
                                  )
                                )
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "setting-control" }, [
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
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "setting-row" }, [
                          _c("div", { staticClass: "setting-text" }, [
                            _c(
                              "label",
                              {
                                staticClass: "setting-title",
                                attrs: { for: "min_order_amount" },
                              },
                              [_vm._v(_vm._s(_vm.__("min_order_amount")))]
                            ),
                            _vm._v(" "),
                            _c("div", { staticClass: "setting-hint" }, [
                              _vm._v(
                                _vm._s(
                                  _vm.__(
                                    "minimum_cart_total_required_for_a_retailer_to_place_an_order"
                                  )
                                )
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "setting-control" }, [
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
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "setting-row" }, [
                          _c("div", { staticClass: "setting-text" }, [
                            _c(
                              "label",
                              {
                                staticClass: "setting-title",
                                attrs: { for: "delivery_otp_enabled" },
                              },
                              [_vm._v(_vm._s(_vm.__("delivery_otp_enabled")))]
                            ),
                            _vm._v(" "),
                            _c("div", { staticClass: "setting-hint" }, [
                              _vm._v(
                                _vm._s(
                                  _vm.__(
                                    "driver_must_enter_the_retailers_otp_to_mark_an_order_delivered_not_the_login_otp"
                                  )
                                )
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            {
                              staticClass:
                                "setting-control setting-control-switch",
                            },
                            [
                              _c(
                                "div",
                                { staticClass: "form-check form-switch m-0" },
                                [
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
                                    attrs: {
                                      type: "checkbox",
                                      id: "delivery_otp_enabled",
                                    },
                                    domProps: {
                                      checked: Array.isArray(
                                        _vm.delivery_otp_enabled
                                      )
                                        ? _vm._i(
                                            _vm.delivery_otp_enabled,
                                            null
                                          ) > -1
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
                                              (_vm.delivery_otp_enabled =
                                                $$a.concat([$$v]))
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
                                ]
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "settings-card-foot" },
                        [
                          _c(
                            "b-button",
                            {
                              attrs: {
                                variant: "primary",
                                disabled: _vm.isOrderLoading,
                              },
                              on: { click: _vm.saveOrderSettings },
                            },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(_vm.__("save")) +
                                  "\n                                    "
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
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-xl-7" }, [
                    _c("div", { staticClass: "card settings-card h-100" }, [
                      _c("div", { staticClass: "settings-card-head" }, [
                        _c("span", { staticClass: "settings-icon" }, [
                          _c("i", { staticClass: "fa fa-wallet" }),
                        ]),
                        _vm._v(" "),
                        _c("h5", { staticClass: "mb-0" }, [
                          _vm._v(_vm._s(_vm.__("Payment Collection Methods"))),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "card-body pt-0" }, [
                        _c("p", { staticClass: "setting-hint" }, [
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
                          { staticClass: "row g-3" },
                          _vm._l(_vm.paymentMethods, function (method) {
                            return _c(
                              "div",
                              { key: method.method, staticClass: "col-sm-6" },
                              [
                                _c(
                                  "div",
                                  {
                                    staticClass: "method-tile h-100",
                                    class: {
                                      "is-on": method.is_enabled == 1,
                                      "is-locked": !method.is_editable,
                                    },
                                  },
                                  [
                                    _c(
                                      "div",
                                      {
                                        staticClass:
                                          "d-flex align-items-center justify-content-between gap-2",
                                      },
                                      [
                                        _c(
                                          "div",
                                          {
                                            staticClass:
                                              "d-flex align-items-center gap-2",
                                          },
                                          [
                                            _c(
                                              "span",
                                              { staticClass: "method-icon" },
                                              [
                                                _c("i", {
                                                  class: _vm.methodIcon(
                                                    method.method
                                                  ),
                                                }),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "span",
                                              { staticClass: "fw-semibold" },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.methodLabel(
                                                      method.method
                                                    )
                                                  )
                                                ),
                                              ]
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "div",
                                          {
                                            staticClass:
                                              "form-check form-switch m-0",
                                          },
                                          [
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value: method.is_enabled,
                                                  expression:
                                                    "method.is_enabled",
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
                                                checked: Array.isArray(
                                                  method.is_enabled
                                                )
                                                  ? _vm._i(
                                                      method.is_enabled,
                                                      null
                                                    ) > -1
                                                  : _vm._q(
                                                      method.is_enabled,
                                                      "1"
                                                    ),
                                              },
                                              on: {
                                                change: function ($event) {
                                                  var $$a = method.is_enabled,
                                                    $$el = $event.target,
                                                    $$c = $$el.checked
                                                      ? "1"
                                                      : "0"
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
                                                          $$a
                                                            .slice(0, $$i)
                                                            .concat(
                                                              $$a.slice($$i + 1)
                                                            )
                                                        )
                                                    }
                                                  } else {
                                                    _vm.$set(
                                                      method,
                                                      "is_enabled",
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
                                    _vm._v(" "),
                                    !method.is_editable
                                      ? _c(
                                          "small",
                                          {
                                            staticClass:
                                              "text-danger d-block mt-2",
                                          },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__("Disabled by admin")
                                              )
                                            ),
                                          ]
                                        )
                                      : _vm._e(),
                                  ]
                                ),
                              ]
                            )
                          }),
                          0
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "mt-4" }, [
                          _c(
                            "label",
                            { staticClass: "form-label small text-muted mb-1" },
                            [_vm._v(_vm._s(_vm.__("Cash / Bank discount %")))]
                          ),
                          _vm._v(" "),
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.instantDiscountPercent,
                                expression: "instantDiscountPercent",
                              },
                            ],
                            staticClass: "form-control form-control-sm",
                            staticStyle: { "max-width": "220px" },
                            attrs: {
                              type: "number",
                              min: "0",
                              max: "100",
                              step: "0.01",
                              disabled: !_vm.instantDiscountEditable,
                              placeholder: _vm.__("e.g. 2"),
                            },
                            domProps: { value: _vm.instantDiscountPercent },
                            on: {
                              input: function ($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.instantDiscountPercent = $event.target.value
                              },
                            },
                          }),
                          _vm._v(" "),
                          _c(
                            "small",
                            { staticClass: "setting-hint d-block mt-1" },
                            [
                              _vm._v(
                                _vm._s(
                                  _vm.__(
                                    "Knocked off the order total when the retailer pays the whole amount in one go by Cash or Bank, so the money comes in instantly at delivery. No discount if the payment is split across types."
                                  )
                                )
                              ),
                            ]
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "settings-card-foot" },
                        [
                          _c(
                            "b-button",
                            {
                              attrs: {
                                variant: "primary",
                                disabled: _vm.isPaymentLoading,
                              },
                              on: { click: _vm.savePaymentMethods },
                            },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(_vm.__("save")) +
                                  "\n                                    "
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
                  ]),
                ]),
              ]
            ),
            _vm._v(" "),
            _c(
              "b-tab",
              {
                scopedSlots: _vm._u([
                  {
                    key: "title",
                    fn: function () {
                      return [
                        _c("span", { staticClass: "tab-title" }, [
                          _c("i", { staticClass: "fa fa-hashtag me-2" }),
                          _vm._v(_vm._s(_vm.__("Document numbering"))),
                        ]),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              },
              [
                _vm._v(" "),
                _c("p", { staticClass: "setting-hint mb-3" }, [
                  _vm._v(
                    _vm._s(
                      _vm.__(
                        "Choose how each document number looks. The preview shows the next number that will be issued."
                      )
                    )
                  ),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row g-3" }, [
                  _c("div", { staticClass: "col-lg-4" }, [
                    _c("div", { staticClass: "card settings-card h-100" }, [
                      _c("div", { staticClass: "settings-card-head" }, [
                        _c("span", { staticClass: "settings-icon" }, [
                          _c("i", { staticClass: "fa fa-file-invoice" }),
                        ]),
                        _vm._v(" "),
                        _c("h5", { staticClass: "mb-0" }, [
                          _vm._v(_vm._s(_vm.__("invoice_settings"))),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "card-body pt-0" }, [
                        _c("p", { staticClass: "setting-hint" }, [
                          _vm._v(_vm._s(_vm.__("invoice_settings_hint"))),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "row g-3" }, [
                          _c("div", { staticClass: "col-6" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "invoice_prefix" },
                              },
                              [_vm._v(_vm._s(_vm.__("invoice_prefix")))]
                            ),
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
                          _c("div", { staticClass: "col-6" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "invoice_suffix" },
                              },
                              [_vm._v(_vm._s(_vm.__("invoice_suffix")))]
                            ),
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
                          _vm._v(" "),
                          _c("div", { staticClass: "col-12" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "invoice_next_number" },
                              },
                              [_vm._v(_vm._s(_vm.__("invoice_number")))]
                            ),
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
                                  _vm.invoice_next_number = _vm._n(
                                    $event.target.value
                                  )
                                },
                                blur: function ($event) {
                                  return _vm.$forceUpdate()
                                },
                              },
                            }),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "series-preview mt-3" }, [
                          _c("span", { staticClass: "text-muted small" }, [
                            _vm._v(_vm._s(_vm.__("preview"))),
                          ]),
                          _vm._v(" "),
                          _c("strong", [
                            _vm._v(_vm._s(_vm.invoiceNumberPreview)),
                          ]),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "settings-card-foot" },
                        [
                          _c(
                            "b-button",
                            {
                              attrs: {
                                variant: "primary",
                                disabled: _vm.isInvoiceLoading,
                              },
                              on: { click: _vm.saveInvoiceSettings },
                            },
                            [
                              _vm._v(
                                "\n                                " +
                                  _vm._s(_vm.__("save")) +
                                  "\n                                "
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
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-4" }, [
                    _c("div", { staticClass: "card settings-card h-100" }, [
                      _c("div", { staticClass: "settings-card-head" }, [
                        _c("span", { staticClass: "settings-icon" }, [
                          _c("i", { staticClass: "fa fa-truck" }),
                        ]),
                        _vm._v(" "),
                        _c("h5", { staticClass: "mb-0" }, [
                          _vm._v(_vm._s(_vm.__("loading_slip_settings"))),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "card-body pt-0" }, [
                        _c("p", { staticClass: "setting-hint" }, [
                          _vm._v(_vm._s(_vm.__("loading_slip_settings_hint"))),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "row g-3" }, [
                          _c("div", { staticClass: "col-6" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "loading_slip_prefix" },
                              },
                              [_vm._v(_vm._s(_vm.__("loading_slip_prefix")))]
                            ),
                            _vm._v(" "),
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.loading_slip_prefix,
                                  expression: "loading_slip_prefix",
                                },
                              ],
                              staticClass: "form-control",
                              attrs: {
                                type: "text",
                                id: "loading_slip_prefix",
                                placeholder: _vm.__("optional"),
                              },
                              domProps: { value: _vm.loading_slip_prefix },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.loading_slip_prefix = $event.target.value
                                },
                              },
                            }),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "col-6" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "loading_slip_suffix" },
                              },
                              [_vm._v(_vm._s(_vm.__("loading_slip_suffix")))]
                            ),
                            _vm._v(" "),
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.loading_slip_suffix,
                                  expression: "loading_slip_suffix",
                                },
                              ],
                              staticClass: "form-control",
                              attrs: {
                                type: "text",
                                id: "loading_slip_suffix",
                                placeholder: _vm.__("optional"),
                              },
                              domProps: { value: _vm.loading_slip_suffix },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.loading_slip_suffix = $event.target.value
                                },
                              },
                            }),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "col-12" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "loading_slip_next_number" },
                              },
                              [_vm._v(_vm._s(_vm.__("loading_slip_number")))]
                            ),
                            _vm._v(" "),
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model.number",
                                  value: _vm.loading_slip_next_number,
                                  expression: "loading_slip_next_number",
                                  modifiers: { number: true },
                                },
                              ],
                              staticClass: "form-control",
                              attrs: {
                                type: "number",
                                min: "1",
                                id: "loading_slip_next_number",
                                placeholder: "1",
                              },
                              domProps: { value: _vm.loading_slip_next_number },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.loading_slip_next_number = _vm._n(
                                    $event.target.value
                                  )
                                },
                                blur: function ($event) {
                                  return _vm.$forceUpdate()
                                },
                              },
                            }),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "series-preview mt-3" }, [
                          _c("span", { staticClass: "text-muted small" }, [
                            _vm._v(_vm._s(_vm.__("preview"))),
                          ]),
                          _vm._v(" "),
                          _c("strong", [
                            _vm._v(_vm._s(_vm.loadingSlipNumberPreview)),
                          ]),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "settings-card-foot" },
                        [
                          _c(
                            "b-button",
                            {
                              attrs: {
                                variant: "primary",
                                disabled: _vm.isLoadingSlipSettingsLoading,
                              },
                              on: { click: _vm.saveLoadingSlipSettings },
                            },
                            [
                              _vm._v(
                                "\n                                " +
                                  _vm._s(_vm.__("save")) +
                                  "\n                                "
                              ),
                              _vm.isLoadingSlipSettingsLoading
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
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-4" }, [
                    _c("div", { staticClass: "card settings-card h-100" }, [
                      _c("div", { staticClass: "settings-card-head" }, [
                        _c("span", { staticClass: "settings-icon" }, [
                          _c("i", { staticClass: "fa fa-undo-alt" }),
                        ]),
                        _vm._v(" "),
                        _c("h5", { staticClass: "mb-0" }, [
                          _vm._v(_vm._s(_vm.__("credit_note_settings"))),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "card-body pt-0" }, [
                        _c("p", { staticClass: "setting-hint" }, [
                          _vm._v(_vm._s(_vm.__("credit_note_settings_hint"))),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "row g-3" }, [
                          _c("div", { staticClass: "col-6" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "credit_note_prefix" },
                              },
                              [_vm._v(_vm._s(_vm.__("credit_note_prefix")))]
                            ),
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
                          _c("div", { staticClass: "col-6" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "credit_note_suffix" },
                              },
                              [_vm._v(_vm._s(_vm.__("credit_note_suffix")))]
                            ),
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
                          _vm._v(" "),
                          _c("div", { staticClass: "col-12" }, [
                            _c(
                              "label",
                              {
                                staticClass: "form-label",
                                attrs: { for: "credit_note_next_number" },
                              },
                              [_vm._v(_vm._s(_vm.__("credit_note_number")))]
                            ),
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
                                  _vm.credit_note_next_number = _vm._n(
                                    $event.target.value
                                  )
                                },
                                blur: function ($event) {
                                  return _vm.$forceUpdate()
                                },
                              },
                            }),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "series-preview mt-3" }, [
                          _c("span", { staticClass: "text-muted small" }, [
                            _vm._v(_vm._s(_vm.__("preview"))),
                          ]),
                          _vm._v(" "),
                          _c("strong", [
                            _vm._v(_vm._s(_vm.creditNoteNumberPreview)),
                          ]),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "settings-card-foot" },
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
                                "\n                                " +
                                  _vm._s(_vm.__("save")) +
                                  "\n                                "
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
                  ]),
                ]),
              ]
            ),
            _vm._v(" "),
            _c(
              "b-tab",
              {
                scopedSlots: _vm._u([
                  {
                    key: "title",
                    fn: function () {
                      return [
                        _c("span", { staticClass: "tab-title" }, [
                          _c("i", { staticClass: "fa fa-bell me-2" }),
                          _vm._v(_vm._s(_vm.__("Notifications"))),
                        ]),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              },
              [
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-xl-8" }, [
                    _c(
                      "form",
                      {
                        on: {
                          submit: function ($event) {
                            $event.preventDefault()
                            return _vm.saveMailSetting.apply(null, arguments)
                          },
                        },
                      },
                      [
                        _c("div", { staticClass: "card settings-card" }, [
                          _c("div", { staticClass: "settings-card-head" }, [
                            _c("span", { staticClass: "settings-icon" }, [
                              _c("i", { staticClass: "fa fa-envelope" }),
                            ]),
                            _vm._v(" "),
                            _c("h5", { staticClass: "mb-0" }, [
                              _vm._v(_vm._s(_vm.__("order_mail_settings"))),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticClass: "card-body pt-0" },
                            [
                              _c("p", { staticClass: "setting-hint" }, [
                                _vm._v(
                                  _vm._s(
                                    _vm.__(
                                      "Choose which order updates send a mail or an SMS."
                                    )
                                  )
                                ),
                              ]),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "notify-row notify-row--head" },
                                [
                                  _c("span", [
                                    _vm._v(_vm._s(_vm.__("order_status"))),
                                  ]),
                                  _vm._v(" "),
                                  _c("span", { staticClass: "text-center" }, [
                                    _vm._v(_vm._s(_vm.__("mail"))),
                                  ]),
                                  _vm._v(" "),
                                  _c("span", { staticClass: "text-center" }, [
                                    _vm._v(_vm._s(_vm.__("sms"))),
                                  ]),
                                ]
                              ),
                              _vm._v(" "),
                              _vm._l(_vm.statuses, function (status) {
                                return _c(
                                  "div",
                                  { key: status.id, staticClass: "notify-row" },
                                  [
                                    _c(
                                      "label",
                                      { staticClass: "notify-label" },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            _vm.getStatusDisplayName(status)
                                          )
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      {
                                        staticClass:
                                          "form-check form-switch m-0 d-flex justify-content-center",
                                      },
                                      [
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.mail_statuses,
                                              expression: "mail_statuses",
                                            },
                                          ],
                                          staticClass: "form-check-input",
                                          attrs: {
                                            type: "checkbox",
                                            id: "checkbox_mail_" + status.id,
                                          },
                                          domProps: {
                                            value: status.id,
                                            checked: Array.isArray(
                                              _vm.mail_statuses
                                            )
                                              ? _vm._i(
                                                  _vm.mail_statuses,
                                                  status.id
                                                ) > -1
                                              : _vm.mail_statuses,
                                          },
                                          on: {
                                            change: function ($event) {
                                              var $$a = _vm.mail_statuses,
                                                $$el = $event.target,
                                                $$c = $$el.checked
                                                  ? true
                                                  : false
                                              if (Array.isArray($$a)) {
                                                var $$v = status.id,
                                                  $$i = _vm._i($$a, $$v)
                                                if ($$el.checked) {
                                                  $$i < 0 &&
                                                    (_vm.mail_statuses =
                                                      $$a.concat([$$v]))
                                                } else {
                                                  $$i > -1 &&
                                                    (_vm.mail_statuses = $$a
                                                      .slice(0, $$i)
                                                      .concat(
                                                        $$a.slice($$i + 1)
                                                      ))
                                                }
                                              } else {
                                                _vm.mail_statuses = $$c
                                              }
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      {
                                        staticClass:
                                          "form-check form-switch m-0 d-flex justify-content-center",
                                      },
                                      [
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.sms_statuses,
                                              expression: "sms_statuses",
                                            },
                                          ],
                                          staticClass: "form-check-input",
                                          attrs: {
                                            type: "checkbox",
                                            id: "checkbox_sms_" + status.id,
                                          },
                                          domProps: {
                                            value: status.id,
                                            checked: Array.isArray(
                                              _vm.sms_statuses
                                            )
                                              ? _vm._i(
                                                  _vm.sms_statuses,
                                                  status.id
                                                ) > -1
                                              : _vm.sms_statuses,
                                          },
                                          on: {
                                            change: function ($event) {
                                              var $$a = _vm.sms_statuses,
                                                $$el = $event.target,
                                                $$c = $$el.checked
                                                  ? true
                                                  : false
                                              if (Array.isArray($$a)) {
                                                var $$v = status.id,
                                                  $$i = _vm._i($$a, $$v)
                                                if ($$el.checked) {
                                                  $$i < 0 &&
                                                    (_vm.sms_statuses =
                                                      $$a.concat([$$v]))
                                                } else {
                                                  $$i > -1 &&
                                                    (_vm.sms_statuses = $$a
                                                      .slice(0, $$i)
                                                      .concat(
                                                        $$a.slice($$i + 1)
                                                      ))
                                                }
                                              } else {
                                                _vm.sms_statuses = $$c
                                              }
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                  ]
                                )
                              }),
                            ],
                            2
                          ),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticClass: "settings-card-foot" },
                            [
                              _c(
                                "b-button",
                                {
                                  attrs: {
                                    type: "submit",
                                    variant: "primary",
                                    disabled: _vm.isNotifyLoading,
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n                                        " +
                                      _vm._s(_vm.__("save")) +
                                      "\n                                        "
                                  ),
                                  _vm.isNotifyLoading
                                    ? _c("b-spinner", { attrs: { small: "" } })
                                    : _vm._e(),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                        ]),
                      ]
                    ),
                  ]),
                ]),
              ]
            ),
            _vm._v(" "),
            _c(
              "b-tab",
              {
                scopedSlots: _vm._u([
                  {
                    key: "title",
                    fn: function () {
                      return [
                        _c("span", { staticClass: "tab-title" }, [
                          _c("i", { staticClass: "fa fa-lock me-2" }),
                          _vm._v(_vm._s(_vm.__("Security"))),
                        ]),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              },
              [
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-xl-8" }, [
                    _c("div", { staticClass: "card settings-card" }, [
                      _c("div", { staticClass: "settings-card-head" }, [
                        _c("span", { staticClass: "settings-icon" }, [
                          _c("i", { staticClass: "fa fa-key" }),
                        ]),
                        _vm._v(" "),
                        _c("h5", { staticClass: "mb-0" }, [
                          _vm._v(
                            _vm._s(_vm.__("Sensitive Operations Password"))
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "card-body pt-0" },
                        [
                          _c("p", { staticClass: "setting-hint" }, [
                            _vm._v(
                              "\n                                    " +
                                _vm._s(
                                  _vm.__(
                                    "This password gates risky corrections (like editing a driver's recorded payment method) so only you can authorize them, even if staff have access to this panel."
                                  )
                                ) +
                                "\n                                "
                            ),
                          ]),
                          _vm._v(" "),
                          !_vm.sensitivePasswordIsSet
                            ? [
                                _c("div", { staticClass: "row g-3" }, [
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("label", { staticClass: "form-label" }, [
                                      _vm._v(_vm._s(_vm.__("Password"))),
                                    ]),
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
                                      domProps: {
                                        value: _vm.sensitiveNewPassword,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.sensitiveNewPassword =
                                            $event.target.value
                                        },
                                      },
                                    }),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("label", { staticClass: "form-label" }, [
                                      _vm._v(
                                        _vm._s(_vm.__("Confirm Password"))
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.sensitiveConfirmPassword,
                                          expression:
                                            "sensitiveConfirmPassword",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "password",
                                        autocomplete: "new-password",
                                      },
                                      domProps: {
                                        value: _vm.sensitiveConfirmPassword,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.sensitiveConfirmPassword =
                                            $event.target.value
                                        },
                                      },
                                    }),
                                  ]),
                                ]),
                              ]
                            : [
                                _c("div", { staticClass: "row g-3" }, [
                                  _c(
                                    "div",
                                    { staticClass: "col-md-4" },
                                    [
                                      !_vm.sensitiveForgotMode
                                        ? [
                                            _c(
                                              "label",
                                              { staticClass: "form-label" },
                                              [
                                                _vm._v(
                                                  _vm._s(_vm.__("Old Password"))
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value:
                                                    _vm.sensitiveOldPassword,
                                                  expression:
                                                    "sensitiveOldPassword",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: {
                                                type: "password",
                                                autocomplete:
                                                  "current-password",
                                              },
                                              domProps: {
                                                value: _vm.sensitiveOldPassword,
                                              },
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
                                                attrs: {
                                                  href: "javascript:void(0)",
                                                },
                                                on: {
                                                  click:
                                                    _vm.startSensitiveForgotMode,
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__("forgot_password")
                                                  ) + "?"
                                                ),
                                              ]
                                            ),
                                          ]
                                        : [
                                            _c(
                                              "label",
                                              { staticClass: "form-label" },
                                              [_vm._v(_vm._s(_vm.__("OTP")))]
                                            ),
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
                                              domProps: {
                                                value: _vm.sensitiveOtp,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.sensitiveOtp =
                                                    $event.target.value
                                                },
                                              },
                                            }),
                                            _vm._v(" "),
                                            _c(
                                              "span",
                                              { staticClass: "small" },
                                              [
                                                _c(
                                                  "a",
                                                  {
                                                    attrs: {
                                                      href: "javascript:void(0)",
                                                    },
                                                    on: {
                                                      click:
                                                        _vm.cancelSensitiveForgotMode,
                                                    },
                                                  },
                                                  [
                                                    _vm._v(
                                                      _vm._s(_vm.__("cancel"))
                                                    ),
                                                  ]
                                                ),
                                                _vm._v(
                                                  "\n                                                     | \n                                                    "
                                                ),
                                                _c(
                                                  "a",
                                                  {
                                                    class: {
                                                      "text-muted":
                                                        _vm.otpResendCooldown >
                                                        0,
                                                    },
                                                    attrs: {
                                                      href: "javascript:void(0)",
                                                    },
                                                    on: {
                                                      click: function ($event) {
                                                        _vm.otpResendCooldown ===
                                                          0 &&
                                                          _vm.sendSensitiveOtp()
                                                      },
                                                    },
                                                  },
                                                  [
                                                    _vm._v(
                                                      "\n                                                        " +
                                                        _vm._s(
                                                          _vm.otpResendCooldown >
                                                            0
                                                            ? _vm.__(
                                                                "resend_code"
                                                              ) +
                                                                " (" +
                                                                _vm.otpResendCooldown +
                                                                "s)"
                                                            : _vm.__(
                                                                "resend_code"
                                                              )
                                                        ) +
                                                        "\n                                                    "
                                                    ),
                                                  ]
                                                ),
                                              ]
                                            ),
                                          ],
                                    ],
                                    2
                                  ),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-4" }, [
                                    _c("label", { staticClass: "form-label" }, [
                                      _vm._v(_vm._s(_vm.__("New Password"))),
                                    ]),
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
                                      domProps: {
                                        value: _vm.sensitiveNewPassword,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.sensitiveNewPassword =
                                            $event.target.value
                                        },
                                      },
                                    }),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-4" }, [
                                    _c("label", { staticClass: "form-label" }, [
                                      _vm._v(
                                        _vm._s(_vm.__("Confirm New Password"))
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.sensitiveConfirmPassword,
                                          expression:
                                            "sensitiveConfirmPassword",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "password",
                                        autocomplete: "new-password",
                                      },
                                      domProps: {
                                        value: _vm.sensitiveConfirmPassword,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.sensitiveConfirmPassword =
                                            $event.target.value
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
                        { staticClass: "settings-card-foot" },
                        [
                          _c(
                            "b-button",
                            {
                              attrs: {
                                variant: "primary",
                                disabled: _vm.isSensitiveLoading,
                              },
                              on: { click: _vm.saveSensitivePassword },
                            },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(
                                    _vm.sensitiveForgotMode
                                      ? _vm.__("reset_password")
                                      : _vm.sensitivePasswordIsSet
                                      ? _vm.__("change_password")
                                      : _vm.__("set_password")
                                  ) +
                                  "\n                                    "
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
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row mt-3" }, [
                  _c("div", { staticClass: "col-xl-8" }, [
                    _c(
                      "form",
                      {
                        on: {
                          submit: function ($event) {
                            $event.preventDefault()
                            return _vm.saveCredentials.apply(null, arguments)
                          },
                        },
                      },
                      [
                        _c("div", { staticClass: "card settings-card" }, [
                          _c("div", { staticClass: "settings-card-head" }, [
                            _c("span", { staticClass: "settings-icon" }, [
                              _c("i", { staticClass: "fa fa-user-lock" }),
                            ]),
                            _vm._v(" "),
                            _c("h5", { staticClass: "mb-0" }, [
                              _vm._v(
                                _vm._s(_vm.__("change_username_and_password"))
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "card-body pt-0" }, [
                            _c("div", { staticClass: "row g-3" }, [
                              _c("div", { staticClass: "col-md-6" }, [
                                _c(
                                  "label",
                                  {
                                    staticClass: "form-label",
                                    attrs: { for: "login_username" },
                                  },
                                  [_vm._v(_vm._s(_vm.__("username")))]
                                ),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.credentials.username,
                                      expression: "credentials.username",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "text",
                                    id: "login_username",
                                    placeholder: _vm.__("username"),
                                    autocomplete: "username",
                                    required: "",
                                  },
                                  domProps: { value: _vm.credentials.username },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.credentials,
                                        "username",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "col-md-6" }, [
                                _c(
                                  "label",
                                  {
                                    staticClass: "form-label",
                                    attrs: { for: "login_current_password" },
                                  },
                                  [_vm._v(_vm._s(_vm.__("current_password")))]
                                ),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.credentials.current_password,
                                      expression:
                                        "credentials.current_password",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "password",
                                    id: "login_current_password",
                                    placeholder: _vm.__("current_password"),
                                    autocomplete: "current-password",
                                    required: "",
                                  },
                                  domProps: {
                                    value: _vm.credentials.current_password,
                                  },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.credentials,
                                        "current_password",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "col-md-6" }, [
                                _c(
                                  "label",
                                  {
                                    staticClass: "form-label",
                                    attrs: { for: "login_new_password" },
                                  },
                                  [_vm._v(_vm._s(_vm.__("new_password")))]
                                ),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.credentials.password,
                                      expression: "credentials.password",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "password",
                                    id: "login_new_password",
                                    placeholder: _vm.__("new_password"),
                                    autocomplete: "new-password",
                                    required: "",
                                  },
                                  domProps: { value: _vm.credentials.password },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.credentials,
                                        "password",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "col-md-6" }, [
                                _c(
                                  "label",
                                  {
                                    staticClass: "form-label",
                                    attrs: { for: "login_confirm_password" },
                                  },
                                  [
                                    _vm._v(
                                      _vm._s(_vm.__("confirm_new_password"))
                                    ),
                                  ]
                                ),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.credentials.confirm_password,
                                      expression:
                                        "credentials.confirm_password",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "password",
                                    id: "login_confirm_password",
                                    placeholder: _vm.__("confirm_new_password"),
                                    autocomplete: "new-password",
                                    required: "",
                                  },
                                  domProps: {
                                    value: _vm.credentials.confirm_password,
                                  },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.credentials,
                                        "confirm_password",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticClass: "settings-card-foot" },
                            [
                              _c(
                                "b-button",
                                {
                                  attrs: {
                                    type: "submit",
                                    variant: "primary",
                                    disabled: _vm.isCredentialsLoading,
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n                                        " +
                                      _vm._s(_vm.__("save")) +
                                      "\n                                        "
                                  ),
                                  _vm.isCredentialsLoading
                                    ? _c("b-spinner", { attrs: { small: "" } })
                                    : _vm._e(),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                        ]),
                      ]
                    ),
                  ]),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row mt-3" }, [
                  _c("div", { staticClass: "col-xl-8" }, [
                    _c(
                      "div",
                      {
                        staticClass: "card settings-card settings-card--danger",
                      },
                      [
                        _c("div", { staticClass: "settings-card-head" }, [
                          _c(
                            "span",
                            {
                              staticClass:
                                "settings-icon settings-icon--danger",
                            },
                            [
                              _c("i", {
                                staticClass: "fa fa-exclamation-triangle",
                              }),
                            ]
                          ),
                          _vm._v(" "),
                          _c("h5", { staticClass: "mb-0" }, [
                            _vm._v(_vm._s(_vm.__("delete_account"))),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "card-body pt-0" }, [
                          _c("p", { staticClass: "setting-hint mb-0" }, [
                            _vm._v(
                              _vm._s(
                                _vm.__(
                                  "Permanently delete your distributor account. This cannot be undone."
                                )
                              )
                            ),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "settings-card-foot" }, [
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-danger",
                              attrs: {
                                type: "button",
                                disabled: _vm.isDeletingAccount,
                              },
                              on: { click: _vm.deleteAccount },
                            },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(_vm.__("delete_account")) +
                                  "\n                                    "
                              ),
                              _vm.isDeletingAccount
                                ? _c("b-spinner", { attrs: { small: "" } })
                                : _vm._e(),
                            ],
                            1
                          ),
                        ]),
                      ]
                    ),
                  ]),
                ]),
              ]
            ),
            _vm._v(" "),
            _c(
              "b-tab",
              {
                attrs: { lazy: "" },
                scopedSlots: _vm._u([
                  {
                    key: "title",
                    fn: function () {
                      return [
                        _c("span", { staticClass: "tab-title" }, [
                          _c("i", { staticClass: "fa fa-user me-2" }),
                          _vm._v(_vm._s(_vm.__("my_profile"))),
                        ]),
                      ]
                    },
                    proxy: true,
                  },
                ]),
              },
              [
                _vm._v(" "),
                _c("seller-profile-form", { attrs: { embedded: "" } }),
              ],
              1
            ),
          ],
          1
        ),
      ],
      1
    ),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);