"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_DeliveryBoys_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=script&lang=js":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=script&lang=js ***!
  \*********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _driverStatusConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./driverStatusConfig */ "./resources/js/views/Sellers/driverStatusConfig.js");
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




// delivery_boys.status: 0 registered, 1 active, 2 not approved, 3 deactive, 4 blocked, 7 removed
var STATUS = {
  registered: 0,
  active: 1,
  notApproved: 2,
  deactive: 3,
  blocked: 4,
  removed: 7
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'SellerDeliveryBoys',
  data: function data() {
    return {
      fields: [{
        key: 'name',
        label: __('name'),
        sortable: true
      }, {
        key: 'address',
        label: __('address'),
        sortable: true
      }, {
        key: 'balance',
        label: __('balance') + ' (' + this.$currency + ')',
        sortable: true,
        "class": 'ui-num'
      }, {
        key: 'cash_received',
        label: __('cash_received') + ' (' + this.$currency + ')',
        sortable: true,
        "class": 'ui-num'
      }, {
        key: 'status',
        label: __('status'),
        sortable: true
      }, {
        key: 'actions',
        label: __('actions')
      }],
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: '',
      filterStatus: '',
      // '' = all, otherwise a status id
      isLoading: false,
      deliveryBoys: [],
      currentLanguageId: null,
      activeLanguages: []
    };
  },
  computed: {
    // Names/addresses can be translated per language
    translatedDeliveryBoys: function translatedDeliveryBoys() {
      var _this = this;
      if (!this.currentLanguageId || !Array.isArray(this.deliveryBoys)) {
        return this.deliveryBoys;
      }
      return this.deliveryBoys.map(function (boy) {
        var translatedBoy = _objectSpread({}, boy);
        if (boy.translations && Array.isArray(boy.translations)) {
          var translation = boy.translations.find(function (t) {
            return t.language_id === _this.currentLanguageId;
          });
          if (translation) {
            if (translation.name && translation.name.trim() !== '') translatedBoy.name = translation.name;
            if (translation.address && translation.address.trim() !== '') translatedBoy.address = translation.address;
            if (translation.other_payment_information && translation.other_payment_information.trim() !== '') {
              translatedBoy.other_payment_information = translation.other_payment_information;
            }
          }
        }
        return translatedBoy;
      });
    },
    // status chip + search applied in the browser (the list is loaded whole, like before)
    filteredBoys: function filteredBoys() {
      var _this2 = this;
      var term = (this.filter || '').trim().toLowerCase();
      return this.translatedDeliveryBoys.filter(function (b) {
        if (_this2.filterStatus !== '' && String(b.status) !== String(_this2.filterStatus)) return false;
        if (!term) return true;
        return [b.name, b.mobile, b.address].some(function (v) {
          return String(v || '').toLowerCase().indexOf(term) >= 0;
        });
      });
    },
    totalRows: function totalRows() {
      return this.filteredBoys.length;
    },
    statusChips: function statusChips() {
      var _this3 = this;
      var count = function count(id) {
        return _this3.deliveryBoys.filter(function (b) {
          return b.status === id;
        }).length;
      };
      var chips = [{
        key: 'all',
        id: '',
        label: __('all'),
        count: this.deliveryBoys.length
      }];
      // SIMPLE_DRIVER_STATUS (driverStatusConfig.js): Active / Deactive always get a chip; every other state only when a
      // driver is in it, so nobody is hidden. Flip the flag to false and Not-Approved / Blocked chips are always shown again.
      var alwaysShown = _driverStatusConfig__WEBPACK_IMPORTED_MODULE_1__.SIMPLE_DRIVER_STATUS ? [STATUS.active, STATUS.deactive] : [STATUS.active, STATUS.notApproved, STATUS.deactive, STATUS.blocked];
      [STATUS.active, STATUS.registered, STATUS.notApproved, STATUS.deactive, STATUS.blocked, STATUS.removed].forEach(function (id) {
        if (alwaysShown.includes(id) || count(id) > 0) {
          chips.push({
            key: id,
            id: id,
            label: _this3.statusLabel(id),
            count: count(id)
          });
        }
      });
      return chips;
    },
    // collected on COD deliveries and not yet handed over (the cash-collection screen subtracts what they hand in)
    cashWithDrivers: function cashWithDrivers() {
      return this.deliveryBoys.reduce(function (sum, b) {
        return sum + (parseFloat(b.cash_received) || 0);
      }, 0);
    }
  },
  watch: {
    filter: function filter() {
      this.currentPage = 1;
    },
    filterStatus: function filterStatus() {
      this.currentPage = 1;
    }
  },
  created: function created() {
    var _this4 = this;
    this._handleSaved = function (message) {
      _this4.showMessage("success", message);
      _this4.getDeliveryBoys();
    };
    this.$eventBus.$on('deliveryBoysSaved', this._handleSaved);
    this.fetchActiveLanguages().then(function () {
      _this4.getDeliveryBoys();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.$eventBus.$off('deliveryBoysSaved', this._handleSaved);
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this5 = this;
      return axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/active_languages').then(function (response) {
        if (Array.isArray(response.data.data)) {
          _this5.activeLanguages = response.data.data;
          var appLocale = window.appLocale || 'en';
          var currentLanguage = _this5.activeLanguages.find(function (lang) {
            return lang.code === appLocale;
          });
          if (currentLanguage) {
            _this5.currentLanguageId = currentLanguage.id;
          } else {
            var defaultLang = _this5.activeLanguages.find(function (lang) {
              return lang.is_default === 1;
            });
            if (defaultLang) _this5.currentLanguageId = defaultLang.id;
          }
        }
      })["catch"](function (err) {
        console.error('Language load error:', err);
      });
    },
    getDeliveryBoys: function getDeliveryBoys() {
      var _this6 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/delivery_boys').then(function (response) {
        _this6.isLoading = false;
        // Every driver linked to this distributor, whatever the status. A "Registered" (0) driver used to be
        // hidden here, so one saved with that status vanished from the panel with no way to bring it back.
        _this6.deliveryBoys = response.data.data || [];
      })["catch"](function () {
        _this6.isLoading = false;
        _this6.showError(__('something_went_wrong'));
      });
    },
    deleteDeliveryBoys: function deleteDeliveryBoys(boy) {
      var _this7 = this;
      if (boy.is_deletable === false) {
        this.showMessage('error', boy.delete_block_reason);
        return;
      }
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
          _this7.isLoading = true;
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this7.$apiUrl + '/delivery_boys/delete', {
            id: boy.id
          }).then(function (response) {
            _this7.isLoading = false;
            if (response.data.status === 1) {
              _this7.deliveryBoys = _this7.deliveryBoys.filter(function (b) {
                return b.id !== boy.id;
              });
              _this7.showMessage('success', response.data.message);
              // deleting the last row of a later page: step back instead of showing an empty page
              var lastPage = Math.max(1, Math.ceil(_this7.totalRows / _this7.perPage));
              if (_this7.currentPage > lastPage) _this7.currentPage = lastPage;
            } else {
              _this7.showMessage('error', response.data.message);
            }
          })["catch"](function () {
            _this7.isLoading = false;
            _this7.showError(__('something_went_wrong'));
          });
        }
      });
    },
    // ---- presentation ----
    statusLabel: function statusLabel(status) {
      switch (Number(status)) {
        case STATUS.registered:
          return __('registered');
        case STATUS.active:
          return __('active');
        case STATUS.notApproved:
          return __('not_approved');
        case STATUS.deactive:
          return __('deactive');
        case STATUS.blocked:
          return __('blocked');
        case STATUS.removed:
          return __('removed');
        default:
          return '-';
      }
    },
    statusTone: function statusTone(status) {
      switch (Number(status)) {
        case STATUS.registered:
          return 'blue';
        case STATUS.active:
          return 'green';
        case STATUS.notApproved:
          return 'amber';
        case STATUS.deactive:
        case STATUS.removed:
          return 'red';
        default:
          return 'slate';
        // blocked
      }
    },
    formatMoney: function formatMoney(value) {
      var n = parseFloat(value);
      if (isNaN(n)) return '0';
      // whole amounts stay compact (4,000); fractional ones always show paise (8,336.30)
      var digits = Number.isInteger(n) ? 0 : 2;
      return n.toLocaleString('en-IN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: 2
      });
    },
    initials: function initials(name) {
      var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return '?';
      return ((parts[0][0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    },
    // Stable colour per driver so the same person always gets the same avatar
    avatarTone: function avatarTone(name) {
      var tones = ['blue', 'green', 'purple', 'amber', 'red'];
      var hash = 0;
      String(name || '').split('').forEach(function (ch) {
        hash = (hash * 31 + ch.charCodeAt(0)) % 997;
      });
      return tones[hash % tones.length];
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Sellers/driverStatusConfig.js":
/*!**********************************************************!*\
  !*** ./resources/js/views/Sellers/driverStatusConfig.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SIMPLE_DRIVER_STATUS: () => (/* binding */ SIMPLE_DRIVER_STATUS)
/* harmony export */ });
// Which driver statuses the DISTRIBUTOR panel offers (driver edit form status buttons + Drivers list chips).
//
//   true  = just Active / Deactive. Active can use the app; Deactive cannot log in and is logged out of the app
//           (the server already does that for every status other than Active).
//   false = the full set again: Not-Approved and Blocked come back in the form and as chips.
//
// Display only: the server accepts every status either way, and a driver already in another state (Registered,
// Not-Approved, Blocked, Removed) is still shown with that state, so nobody disappears from the panel.
// To bring the other statuses back, change this one word to false and rebuild (npm run dev).
var SIMPLE_DRIVER_STATUS = true;

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.list-action-btn.is-disabled[data-v-3bf09356] {\n    opacity: 0.4;\n    cursor: not-allowed;\n    pointer-events: auto;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Delete-blocked tooltip: not scoped, since bootstrap-vue teleports tooltips to <body>. */\n.text-nowrap-tooltip .tooltip-inner {\n    max-width: 260px;\n    white-space: normal;\n    text-align: left;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_style_index_0_id_3bf09356_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_style_index_0_id_3bf09356_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_style_index_0_id_3bf09356_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_style_index_1_id_3bf09356_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_style_index_1_id_3bf09356_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_style_index_1_id_3bf09356_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sellers/DeliveryBoys.vue":
/*!*****************************************************!*\
  !*** ./resources/js/views/Sellers/DeliveryBoys.vue ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DeliveryBoys_vue_vue_type_template_id_3bf09356_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DeliveryBoys.vue?vue&type=template&id=3bf09356&scoped=true */ "./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=template&id=3bf09356&scoped=true");
/* harmony import */ var _DeliveryBoys_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DeliveryBoys.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=script&lang=js");
/* harmony import */ var _DeliveryBoys_vue_vue_type_style_index_0_id_3bf09356_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css */ "./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css");
/* harmony import */ var _DeliveryBoys_vue_vue_type_style_index_1_id_3bf09356_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css */ "./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _DeliveryBoys_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _DeliveryBoys_vue_vue_type_template_id_3bf09356_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _DeliveryBoys_vue_vue_type_template_id_3bf09356_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "3bf09356",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/DeliveryBoys.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=script&lang=js":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=script&lang=js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DeliveryBoys.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_style_index_0_id_3bf09356_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=0&id=3bf09356&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css":
/*!*************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_style_index_1_id_3bf09356_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=style&index=1&id=3bf09356&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=template&id=3bf09356&scoped=true":
/*!***********************************************************************************************!*\
  !*** ./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=template&id=3bf09356&scoped=true ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_template_id_3bf09356_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_template_id_3bf09356_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DeliveryBoys_vue_vue_type_template_id_3bf09356_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DeliveryBoys.vue?vue&type=template&id=3bf09356&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=template&id=3bf09356&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=template&id=3bf09356&scoped=true":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/DeliveryBoys.vue?vue&type=template&id=3bf09356&scoped=true ***!
  \**************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "list-page" }, [
    _c(
      "div",
      { staticClass: "page-head" },
      [
        _c("h3", { staticClass: "page-head-title" }, [
          _vm._v(_vm._s(_vm.__("delivery_boys"))),
        ]),
        _vm._v(" "),
        _c(
          "router-link",
          {
            directives: [
              {
                name: "b-tooltip",
                rawName: "v-b-tooltip.hover",
                modifiers: { hover: true },
              },
            ],
            staticClass:
              "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap",
            attrs: {
              to: "/seller/delivery_boys/create",
              title: _vm.__("add_delivery_boy"),
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
        ),
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass:
          "d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3",
      },
      [
        _c(
          "div",
          { staticClass: "ui-chips" },
          _vm._l(_vm.statusChips, function (chip) {
            return _c(
              "button",
              {
                key: chip.key,
                staticClass: "ui-chip",
                class: {
                  "ui-chip--on": String(_vm.filterStatus) === String(chip.id),
                },
                attrs: { type: "button" },
                on: {
                  click: function ($event) {
                    _vm.filterStatus = chip.id
                  },
                },
              },
              [
                _vm._v("\n                " + _vm._s(chip.label) + " "),
                _c("span", [_vm._v(_vm._s(chip.count))]),
              ]
            )
          }),
          0
        ),
        _vm._v(" "),
        _vm.cashWithDrivers > 0
          ? _c(
              "span",
              {
                directives: [
                  {
                    name: "b-tooltip",
                    rawName: "v-b-tooltip.hover",
                    modifiers: { hover: true },
                  },
                ],
                staticClass: "ui-pill ui-tone--amber",
                attrs: {
                  title: _vm.__(
                    "Cash collected by drivers that they have not handed over yet"
                  ),
                },
              },
              [
                _c("i", { staticClass: "fa fa-wallet" }),
                _vm._v(
                  " " + _vm._s(_vm.__("Cash with drivers")) + "\n            "
                ),
                _c("strong", [
                  _vm._v(
                    _vm._s(_vm.$currency) +
                      _vm._s(_vm.formatMoney(_vm.cashWithDrivers))
                  ),
                ]),
              ]
            )
          : _vm._e(),
      ]
    ),
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
                placeholder: _vm.__("Search by name, mobile or address"),
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
                return _vm.getDeliveryBoys()
              },
            },
          },
          [
            _c("i", {
              staticClass: "fa fa-sync-alt",
              class: { "fa-spin": _vm.isLoading },
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
              items: _vm.filteredBoys,
              fields: _vm.fields,
              "current-page": _vm.currentPage,
              "per-page": _vm.perPage,
              "sort-by": _vm.sortBy,
              "sort-desc": _vm.sortDesc,
              "sort-direction": _vm.sortDirection,
              bordered: false,
              busy: _vm.isLoading,
              stacked: "md",
              "show-empty": "",
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
                      { staticClass: "text-center my-2" },
                      [
                        _c("b-spinner", {
                          staticClass: "align-middle",
                          attrs: { small: "" },
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
                key: "empty",
                fn: function () {
                  return [
                    _c("div", { staticClass: "ui-empty" }, [
                      _c("div", { staticClass: "ui-empty__icon" }, [
                        _c("i", { staticClass: "fa fa-motorcycle" }),
                      ]),
                      _vm._v(" "),
                      _c("h3", [
                        _vm._v(_vm._s(_vm.__("No delivery boys found"))),
                      ]),
                      _vm._v(" "),
                      _c("p", [
                        _vm._v(
                          _vm._s(
                            _vm.filter || _vm.filterStatus !== ""
                              ? _vm.__(
                                  "Nothing matches this search or status. Try changing or clearing it."
                                )
                              : _vm.__(
                                  "Add your first delivery boy to start assigning deliveries."
                                )
                          )
                        ),
                      ]),
                    ]),
                  ]
                },
                proxy: true,
              },
              {
                key: "cell(name)",
                fn: function (row) {
                  return [
                    _c("div", { staticClass: "ui-person" }, [
                      _c(
                        "span",
                        {
                          staticClass: "ui-avatar",
                          class: "ui-tone--" + _vm.avatarTone(row.item.name),
                        },
                        [_vm._v(_vm._s(_vm.initials(row.item.name)))]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "ui-cell" }, [
                        _c("strong", { attrs: { title: row.item.name } }, [
                          _vm._v(_vm._s(row.item.name || "-")),
                        ]),
                        _vm._v(" "),
                        _c("span", [
                          _vm._v(_vm._s(_vm._f("mobileMask")(row.item.mobile))),
                        ]),
                      ]),
                    ]),
                  ]
                },
              },
              {
                key: "cell(address)",
                fn: function (row) {
                  return [
                    row.item.address
                      ? _c(
                          "span",
                          {
                            staticClass: "ui-clamp",
                            attrs: { title: row.item.address },
                          },
                          [_vm._v(_vm._s(row.item.address))]
                        )
                      : _c("span", { staticClass: "ui-dash" }, [_vm._v("-")]),
                  ]
                },
              },
              {
                key: "cell(balance)",
                fn: function (row) {
                  return [
                    Number(row.item.balance) > 0
                      ? _c("span", { staticClass: "ui-money" }, [
                          _vm._v(
                            _vm._s(_vm.$currency) +
                              _vm._s(_vm.formatMoney(row.item.balance))
                          ),
                        ])
                      : _c("span", { staticClass: "ui-dash" }, [_vm._v("-")]),
                  ]
                },
              },
              {
                key: "cell(cash_received)",
                fn: function (row) {
                  return [
                    Number(row.item.cash_received) > 0
                      ? _c("span", { staticClass: "ui-money" }, [
                          _vm._v(
                            _vm._s(_vm.$currency) +
                              _vm._s(_vm.formatMoney(row.item.cash_received))
                          ),
                        ])
                      : _c("span", { staticClass: "ui-dash" }, [_vm._v("-")]),
                  ]
                },
              },
              {
                key: "cell(status)",
                fn: function (row) {
                  return [
                    _c(
                      "span",
                      {
                        staticClass: "ui-pill",
                        class: "ui-tone--" + _vm.statusTone(row.item.status),
                      },
                      [
                        _c("span", { staticClass: "ui-dot" }),
                        _vm._v(
                          _vm._s(_vm.statusLabel(row.item.status)) +
                            "\n                    "
                        ),
                      ]
                    ),
                  ]
                },
              },
              {
                key: "cell(actions)",
                fn: function (row) {
                  return [
                    _c(
                      "div",
                      { staticClass: "list-actions" },
                      [
                        _c(
                          "router-link",
                          {
                            directives: [
                              {
                                name: "b-tooltip",
                                rawName: "v-b-tooltip.hover",
                                modifiers: { hover: true },
                              },
                            ],
                            staticClass: "list-action-btn is-edit",
                            attrs: {
                              to: {
                                name: "SellerEditDeliveryBoy",
                                params: { id: row.item.id, record: row.item },
                              },
                              title: _vm.__("edit"),
                            },
                          },
                          [_c("i", { staticClass: "fa fa-pencil-alt" })]
                        ),
                        _vm._v(" "),
                        _c(
                          "button",
                          {
                            directives: [
                              {
                                name: "b-tooltip",
                                rawName: "v-b-tooltip.hover.left",
                                value: {
                                  boundary: "viewport",
                                  customClass: "text-nowrap-tooltip",
                                },
                                expression:
                                  "{ boundary: 'viewport', customClass: 'text-nowrap-tooltip' }",
                                modifiers: { hover: true, left: true },
                              },
                            ],
                            staticClass: "list-action-btn is-delete",
                            class: {
                              "is-disabled": row.item.is_deletable === false,
                            },
                            attrs: {
                              title:
                                row.item.is_deletable === false
                                  ? row.item.delete_block_reason
                                  : _vm.__("delete"),
                            },
                            on: {
                              click: function ($event) {
                                return _vm.deleteDeliveryBoys(row.item)
                              },
                            },
                          },
                          [_c("i", { staticClass: "fa fa-trash" })]
                        ),
                      ],
                      1
                    ),
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
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);