"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_CommissionBilling_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'SellerCommissionBilling',
  data: function data() {
    return {
      period: 'monthly',
      periodTabs: [{
        value: 'monthly',
        label: __('monthly')
      }, {
        value: 'quarterly',
        label: __('quarterly')
      }, {
        value: 'yearly',
        label: __('yearly')
      }],
      loading: false,
      billing: null,
      error: null,
      page: 1,
      perPage: 12,
      historyFields: [{
        key: 'period_label',
        label: __('billing_period'),
        sortable: false
      }, {
        key: 'total_orders',
        label: __('total_orders'),
        "class": 'text-center',
        sortable: false
      }, {
        key: 'gross_gmv',
        label: __('gross_gmv'),
        "class": 'text-center',
        sortable: false
      }, {
        key: 'net_charges',
        label: __('net_charges'),
        "class": 'text-center',
        sortable: false
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center',
        sortable: false
      }],
      txFields: [{
        key: 'order_id',
        label: __('order_id'),
        sortable: true
      }, {
        key: 'order_item_id',
        label: __('order_item_id'),
        "class": 'text-center'
      }, {
        key: 'order_item_amount',
        label: __('order_item_amount'),
        "class": 'text-center'
      }, {
        key: 'seller_commission_percentage',
        label: __('commission') + ' (%)',
        "class": 'text-center'
      }, {
        key: 'commission_amount',
        label: __('commission_amount'),
        "class": 'text-center'
      }, {
        key: 'added_date',
        label: __('date'),
        "class": 'text-center'
      }],
      // detail drawer
      detailRow: null,
      detailTx: [],
      detailTotal: 0,
      detailPage: 1,
      detailPerPage: 20,
      detailLoading: false
    };
  },
  created: function created() {
    this.load(1);
  },
  methods: {
    switchPeriod: function switchPeriod(p) {
      this.period = p;
      this.page = 1;
      this.detailRow = null;
      this.detailTx = [];
      this.load(1);
    },
    load: function load() {
      var _this = this;
      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.loading = true;
      this.error = null;
      this.page = page;
      var offset = (page - 1) * this.perPage;
      axios.get(this.$apiUrl + '/seller/billing', {
        params: {
          period: this.period,
          limit: this.perPage,
          offset: offset
        }
      }).then(function (res) {
        if (res.data && res.data.data) {
          _this.billing = res.data.data;
        } else {
          _this.error = res.data.message || 'Failed to load billing data';
        }
        _this.loading = false;
      })["catch"](function (err) {
        var _err$response, _err$response$data;
        _this.error = ((_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.message) || 'Server error. Please try again.';
        _this.loading = false;
      });
    },
    viewDetail: function viewDetail(row) {
      this.detailRow = row;
      this.detailPage = 1;
      this.loadDetailPage(1);
    },
    loadDetailPage: function loadDetailPage() {
      var _this2 = this;
      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.detailLoading = true;
      this.detailPage = page;
      var offset = (page - 1) * this.detailPerPage;
      // Derive start/end from period_key
      var startDate, endDate;
      if (this.period === 'monthly') {
        startDate = moment__WEBPACK_IMPORTED_MODULE_0___default()(this.detailRow.period_key, 'YYYY-MM').startOf('month').format('YYYY-MM-DD');
        endDate = moment__WEBPACK_IMPORTED_MODULE_0___default()(this.detailRow.period_key, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');
      } else if (this.period === 'quarterly') {
        var _this$detailRow$perio = this.detailRow.period_key.split('-Q'),
          _this$detailRow$perio2 = _slicedToArray(_this$detailRow$perio, 2),
          year = _this$detailRow$perio2[0],
          q = _this$detailRow$perio2[1];
        var qStart = moment__WEBPACK_IMPORTED_MODULE_0___default()().year(year).quarter(q).startOf('quarter');
        startDate = qStart.format('YYYY-MM-DD');
        endDate = qStart.clone().endOf('quarter').format('YYYY-MM-DD');
      } else {
        startDate = moment__WEBPACK_IMPORTED_MODULE_0___default()().year(this.detailRow.period_key).startOf('year').format('YYYY-MM-DD');
        endDate = moment__WEBPACK_IMPORTED_MODULE_0___default()().year(this.detailRow.period_key).endOf('year').format('YYYY-MM-DD');
      }
      axios.get(this.$apiUrl + '/seller/billing/transactions', {
        params: {
          start_date: startDate,
          end_date: endDate,
          limit: this.detailPerPage,
          offset: offset
        }
      }).then(function (res) {
        if (res.data && res.data.data) {
          _this2.detailTx = res.data.data.data || [];
          _this2.detailTotal = res.data.data.total || 0;
        }
        _this2.detailLoading = false;
      })["catch"](function () {
        _this2.detailLoading = false;
      });
    },
    formatAmount: function formatAmount(val) {
      if (!val && val !== 0) return '0.00';
      if (val >= 10000000) return (val / 10000000).toFixed(2) + ' Cr';
      if (val >= 100000) return (val / 100000).toFixed(2) + ' L';
      return parseFloat(val).toFixed(2);
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* ── Stat cards ────────────────────────────────────────────────── */\n.stat-card[data-v-d04c7834] {\n    display: flex;\n    align-items: flex-start;\n    gap: 16px;\n    background: #fff;\n    border-radius: 14px;\n    padding: 22px 20px;\n    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);\n    border: 1px solid #f0f0f0;\n    height: 100%;\n    transition: box-shadow 0.2s;\n}\n.stat-card[data-v-d04c7834]:hover {\n    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.11);\n}\n\n/* Icon circle */\n.stat-card__icon-wrap[data-v-d04c7834] {\n    flex-shrink: 0;\n    width: 52px;\n    height: 52px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 20px;\n}\n.stat-card__icon-wrap--green[data-v-d04c7834] {\n    background: #e8f8f1;\n    color: #22c55e;\n}\n.stat-card__icon-wrap--blue[data-v-d04c7834] {\n    background: #e8f0fe;\n    color: #4f8ef7;\n}\n\n/* Body */\n.stat-card__body[data-v-d04c7834] {\n    flex: 1;\n    min-width: 0;\n}\n.stat-card__label[data-v-d04c7834] {\n    font-size: 11px;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n    color: #9ca3af;\n    margin-bottom: 4px;\n}\n.stat-card__value[data-v-d04c7834] {\n    font-size: 28px;\n    font-weight: 800;\n    color: #111827;\n    line-height: 1.1;\n    margin-bottom: 8px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n.stat-card__value--blue[data-v-d04c7834] {\n    color: #4f8ef7;\n}\n\n/* Meta row (badge + sub-text) */\n.stat-card__meta[data-v-d04c7834] {\n    display: flex;\n    align-items: center;\n    gap: 8px;\n    margin-bottom: 2px;\n}\n.stat-card__badge[data-v-d04c7834] {\n    display: inline-flex;\n    align-items: center;\n    gap: 4px;\n    font-size: 12px;\n    font-weight: 700;\n    padding: 2px 9px;\n    border-radius: 20px;\n}\n.stat-card__badge--up[data-v-d04c7834]   { background: #dcfce7; color: #16a34a;\n}\n.stat-card__badge--down[data-v-d04c7834] { background: #fee2e2; color: #dc2626;\n}\n.stat-card__badge--neutral[data-v-d04c7834] { background: #eff6ff; color: #3b82f6;\n}\n.stat-card__sub[data-v-d04c7834] {\n    font-size: 11px;\n    color: #b0b7c3;\n}\n\n/* Divider */\n.stat-card__divider[data-v-d04c7834] {\n    border-top: 1px solid #f3f4f6;\n    margin: 12px 0;\n}\n\n/* Bottom two-column row */\n.stat-card__row[data-v-d04c7834] {\n    display: flex;\n    gap: 24px;\n}\n.stat-card__row-item[data-v-d04c7834] {\n    flex: 1;\n    min-width: 0;\n}\n.stat-card__row-label[data-v-d04c7834] {\n    font-size: 11px;\n    color: #9ca3af;\n    margin-bottom: 2px;\n    white-space: nowrap;\n}\n.stat-card__row-value[data-v-d04c7834] {\n    font-size: 14px;\n    font-weight: 600;\n    color: #374151;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_style_index_0_id_d04c7834_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_style_index_0_id_d04c7834_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_style_index_0_id_d04c7834_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sellers/CommissionBilling.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/Sellers/CommissionBilling.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CommissionBilling_vue_vue_type_template_id_d04c7834_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CommissionBilling.vue?vue&type=template&id=d04c7834&scoped=true */ "./resources/js/views/Sellers/CommissionBilling.vue?vue&type=template&id=d04c7834&scoped=true");
/* harmony import */ var _CommissionBilling_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CommissionBilling.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/CommissionBilling.vue?vue&type=script&lang=js");
/* harmony import */ var _CommissionBilling_vue_vue_type_style_index_0_id_d04c7834_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css */ "./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CommissionBilling_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _CommissionBilling_vue_vue_type_template_id_d04c7834_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _CommissionBilling_vue_vue_type_template_id_d04c7834_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "d04c7834",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/CommissionBilling.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/CommissionBilling.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/Sellers/CommissionBilling.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CommissionBilling.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_style_index_0_id_d04c7834_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=style&index=0&id=d04c7834&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/CommissionBilling.vue?vue&type=template&id=d04c7834&scoped=true":
/*!****************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/CommissionBilling.vue?vue&type=template&id=d04c7834&scoped=true ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_template_id_d04c7834_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_template_id_d04c7834_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CommissionBilling_vue_vue_type_template_id_d04c7834_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CommissionBilling.vue?vue&type=template&id=d04c7834&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=template&id=d04c7834&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=template&id=d04c7834&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CommissionBilling.vue?vue&type=template&id=d04c7834&scoped=true ***!
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
            _c("h3", [_vm._v(_vm._s(_vm.__("billing_overview")))]),
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
                      _c(
                        "router-link",
                        { attrs: { to: "/seller/dashboard" } },
                        [_vm._v(_vm._s(_vm.__("dashboard")))]
                      ),
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
                    [_vm._v(_vm._s(_vm.__("billing_overview")))]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c(
        "section",
        { staticClass: "section" },
        [
          _c("div", { staticClass: "d-flex justify-content-end mb-3" }, [
            _c(
              "div",
              { staticClass: "btn-group", attrs: { role: "group" } },
              _vm._l(_vm.periodTabs, function (tab) {
                return _c(
                  "button",
                  {
                    key: tab.value,
                    staticClass: "btn btn-sm",
                    class:
                      _vm.period === tab.value
                        ? "btn-primary"
                        : "btn-outline-primary",
                    attrs: { type: "button" },
                    on: {
                      click: function ($event) {
                        return _vm.switchPeriod(tab.value)
                      },
                    },
                  },
                  [
                    _vm._v(
                      "\n                        " +
                        _vm._s(tab.label) +
                        "\n                    "
                    ),
                  ]
                )
              }),
              0
            ),
          ]),
          _vm._v(" "),
          _vm.loading && !_vm.billing
            ? _c(
                "div",
                { staticClass: "text-center py-5" },
                [_c("b-spinner")],
                1
              )
            : _vm.error
            ? _c("div", { staticClass: "alert alert-danger" }, [
                _vm._v(_vm._s(_vm.error)),
              ])
            : _vm.billing
            ? [
                _c("div", { staticClass: "mb-3" }, [
                  _c("span", { staticClass: "badge bg-primary fs-6" }, [
                    _vm._v(
                      "\n                        " +
                        _vm._s(_vm.__("your_commission_rate")) +
                        ": " +
                        _vm._s(_vm.billing.commission_rate) +
                        "%\n                    "
                    ),
                  ]),
                ]),
                _vm._v(" "),
                _c(
                  "b-row",
                  { staticClass: "mb-4" },
                  [
                    _c(
                      "b-col",
                      { staticClass: "mb-3 mb-md-0", attrs: { md: "6" } },
                      [
                        _c("div", { staticClass: "stat-card stat-card--gmv" }, [
                          _c(
                            "div",
                            {
                              staticClass:
                                "stat-card__icon-wrap stat-card__icon-wrap--green",
                            },
                            [_c("i", { staticClass: "fa fa-line-chart" })]
                          ),
                          _vm._v(" "),
                          _c("div", { staticClass: "stat-card__body" }, [
                            _c("div", { staticClass: "stat-card__label" }, [
                              _vm._v(_vm._s(_vm.__("gmv_volume"))),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "stat-card__value" }, [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(
                                    _vm.formatAmount(
                                      _vm.billing.gmv_card.current
                                    )
                                  ) +
                                  "\n                                "
                              ),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "stat-card__meta" }, [
                              _vm.billing.gmv_card.change_percent !== null
                                ? _c(
                                    "span",
                                    {
                                      staticClass: "stat-card__badge",
                                      class:
                                        _vm.billing.gmv_card.change_percent >= 0
                                          ? "stat-card__badge--up"
                                          : "stat-card__badge--down",
                                    },
                                    [
                                      _c("i", {
                                        class:
                                          _vm.billing.gmv_card.change_percent >=
                                          0
                                            ? "fa fa-arrow-up"
                                            : "fa fa-arrow-down",
                                      }),
                                      _vm._v(
                                        "\n                                        " +
                                          _vm._s(
                                            Math.abs(
                                              _vm.billing.gmv_card
                                                .change_percent
                                            )
                                          ) +
                                          "%\n                                    "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _c("span", { staticClass: "stat-card__sub" }, [
                                _vm._v(_vm._s(_vm.__("vs_previous_period"))),
                              ]),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "stat-card__divider" }),
                            _vm._v(" "),
                            _c("div", { staticClass: "stat-card__row" }, [
                              _c(
                                "div",
                                { staticClass: "stat-card__row-item" },
                                [
                                  _c(
                                    "div",
                                    { staticClass: "stat-card__row-label" },
                                    [_vm._v(_vm._s(_vm.__("previous_period")))]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "stat-card__row-value" },
                                    [
                                      _vm._v(
                                        _vm._s(_vm.$currency) +
                                          " " +
                                          _vm._s(
                                            _vm.formatAmount(
                                              _vm.billing.gmv_card.previous
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
                                { staticClass: "stat-card__row-item" },
                                [
                                  _c(
                                    "div",
                                    { staticClass: "stat-card__row-label" },
                                    [_vm._v(_vm._s(_vm.__("predicted_next")))]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "stat-card__row-value text-info",
                                    },
                                    [
                                      _vm._v(
                                        _vm._s(_vm.$currency) +
                                          " " +
                                          _vm._s(
                                            _vm.formatAmount(
                                              _vm.billing.gmv_card
                                                .predicted_next
                                            )
                                          )
                                      ),
                                    ]
                                  ),
                                ]
                              ),
                            ]),
                          ]),
                        ]),
                      ]
                    ),
                    _vm._v(" "),
                    _c("b-col", { attrs: { md: "6" } }, [
                      _c("div", { staticClass: "stat-card stat-card--fees" }, [
                        _c(
                          "div",
                          {
                            staticClass:
                              "stat-card__icon-wrap stat-card__icon-wrap--blue",
                          },
                          [_c("i", { staticClass: "fa fa-credit-card" })]
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "stat-card__body" }, [
                          _c("div", { staticClass: "stat-card__label" }, [
                            _vm._v(_vm._s(_vm.__("platform_service_fees"))),
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            {
                              staticClass:
                                "stat-card__value stat-card__value--blue",
                            },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(
                                    _vm.formatAmount(
                                      _vm.billing.charges_card.current
                                    )
                                  ) +
                                  "\n                                "
                              ),
                            ]
                          ),
                          _vm._v(" "),
                          _c("div", { staticClass: "stat-card__meta" }, [
                            _c(
                              "span",
                              {
                                staticClass:
                                  "stat-card__badge stat-card__badge--neutral",
                              },
                              [
                                _c("i", { staticClass: "fa fa-shopping-bag" }),
                                _vm._v(
                                  "\n                                        " +
                                    _vm._s(
                                      _vm.billing.charges_card.total_orders
                                    ) +
                                    " " +
                                    _vm._s(_vm.__("orders")) +
                                    "\n                                    "
                                ),
                              ]
                            ),
                            _vm._v(" "),
                            _c("span", { staticClass: "stat-card__sub" }, [
                              _vm._v(_vm._s(_vm.__("this_period"))),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "stat-card__divider" }),
                          _vm._v(" "),
                          _c("div", { staticClass: "stat-card__row" }, [
                            _c("div", { staticClass: "stat-card__row-item" }, [
                              _c(
                                "div",
                                { staticClass: "stat-card__row-label" },
                                [_vm._v(_vm._s(_vm.__("commission_rate")))]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "stat-card__row-value text-primary fw-bold",
                                },
                                [
                                  _vm._v(
                                    _vm._s(_vm.billing.commission_rate) + "%"
                                  ),
                                ]
                              ),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "stat-card__row-item" }, [
                              _c(
                                "div",
                                { staticClass: "stat-card__row-label" },
                                [_vm._v(_vm._s(_vm.__("per_order_avg")))]
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "stat-card__row-value" },
                                [
                                  _vm._v(
                                    "\n                                            " +
                                      _vm._s(_vm.$currency) +
                                      " " +
                                      _vm._s(
                                        _vm.billing.charges_card.total_orders >
                                          0
                                          ? _vm.formatAmount(
                                              _vm.billing.charges_card.current /
                                                _vm.billing.charges_card
                                                  .total_orders
                                            )
                                          : "0.00"
                                      ) +
                                      "\n                                        "
                                  ),
                                ]
                              ),
                            ]),
                          ]),
                        ]),
                      ]),
                    ]),
                  ],
                  1
                ),
                _vm._v(" "),
                _c("div", { staticClass: "card" }, [
                  _c("div", { staticClass: "card-header" }, [
                    _c("h4", { staticClass: "card-title mb-0" }, [
                      _vm._v(_vm._s(_vm.__("invoice_history"))),
                    ]),
                    _vm._v(" "),
                    _c("p", { staticClass: "text-muted small mb-0" }, [
                      _vm._v(_vm._s(_vm.__("invoice_history_subtitle"))),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "card-body" }, [
                    _vm.loading
                      ? _c(
                          "div",
                          { staticClass: "text-center py-3" },
                          [_c("b-spinner")],
                          1
                        )
                      : _c(
                          "div",
                          [
                            _c(
                              "div",
                              { staticClass: "table-responsive" },
                              [
                                _c("b-table", {
                                  attrs: {
                                    items: _vm.billing.history.data,
                                    fields: _vm.historyFields,
                                    bordered: true,
                                    "show-empty": "",
                                    small: "",
                                    stacked: "md",
                                  },
                                  scopedSlots: _vm._u([
                                    {
                                      key: "cell(period_label)",
                                      fn: function (row) {
                                        return [
                                          _c(
                                            "span",
                                            { staticClass: "fw-semibold" },
                                            [
                                              _vm._v(
                                                _vm._s(row.item.period_label)
                                              ),
                                            ]
                                          ),
                                        ]
                                      },
                                    },
                                    {
                                      key: "cell(gross_gmv)",
                                      fn: function (row) {
                                        return [
                                          _vm._v(
                                            "\n                                        " +
                                              _vm._s(_vm.$currency) +
                                              " " +
                                              _vm._s(
                                                row.item.gross_gmv.toFixed(2)
                                              ) +
                                              "\n                                    "
                                          ),
                                        ]
                                      },
                                    },
                                    {
                                      key: "cell(net_charges)",
                                      fn: function (row) {
                                        return [
                                          _vm._v(
                                            "\n                                        " +
                                              _vm._s(_vm.$currency) +
                                              " " +
                                              _vm._s(
                                                row.item.net_charges.toFixed(2)
                                              ) +
                                              "\n                                    "
                                          ),
                                        ]
                                      },
                                    },
                                    {
                                      key: "cell(actions)",
                                      fn: function (row) {
                                        return [
                                          _c(
                                            "button",
                                            {
                                              staticClass:
                                                "btn btn-sm btn-outline-secondary me-1",
                                              attrs: { title: _vm.__("view") },
                                              on: {
                                                click: function ($event) {
                                                  return _vm.viewDetail(
                                                    row.item
                                                  )
                                                },
                                              },
                                            },
                                            [
                                              _c("i", {
                                                staticClass: "fa fa-eye",
                                              }),
                                            ]
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
                              "b-row",
                              { staticClass: "mt-2" },
                              [
                                _c(
                                  "b-col",
                                  { attrs: { md: "4", "offset-md": "8" } },
                                  [
                                    _c("b-pagination", {
                                      attrs: {
                                        "total-rows": _vm.billing.history.total,
                                        "per-page": _vm.perPage,
                                        size: "sm",
                                      },
                                      on: { change: _vm.load },
                                      model: {
                                        value: _vm.page,
                                        callback: function ($$v) {
                                          _vm.page = $$v
                                        },
                                        expression: "page",
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
                _vm._v(" "),
                _vm.detailRow
                  ? _c("div", { staticClass: "card mt-3" }, [
                      _c(
                        "div",
                        {
                          staticClass:
                            "card-header d-flex justify-content-between align-items-center",
                        },
                        [
                          _c("h5", { staticClass: "mb-0" }, [
                            _vm._v(
                              _vm._s(_vm.detailRow.period_label) +
                                " — " +
                                _vm._s(_vm.__("transactions"))
                            ),
                          ]),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-sm btn-outline-danger",
                              on: {
                                click: function ($event) {
                                  _vm.detailRow = null
                                  _vm.detailTx = []
                                },
                              },
                            },
                            [
                              _vm._v(
                                "\n                            " +
                                  _vm._s(_vm.__("close")) +
                                  "\n                        "
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "card-body" }, [
                        _vm.detailLoading
                          ? _c(
                              "div",
                              { staticClass: "text-center py-3" },
                              [_c("b-spinner")],
                              1
                            )
                          : _c(
                              "div",
                              [
                                _c(
                                  "div",
                                  { staticClass: "table-responsive" },
                                  [
                                    _c("b-table", {
                                      attrs: {
                                        items: _vm.detailTx,
                                        fields: _vm.txFields,
                                        bordered: true,
                                        "show-empty": "",
                                        small: "",
                                        stacked: "md",
                                      },
                                      scopedSlots: _vm._u(
                                        [
                                          {
                                            key: "cell(order_item_amount)",
                                            fn: function (row) {
                                              return [
                                                _vm._v(
                                                  "\n                                        " +
                                                    _vm._s(_vm.$currency) +
                                                    " " +
                                                    _vm._s(
                                                      parseFloat(
                                                        row.item
                                                          .order_item_amount
                                                      ).toFixed(2)
                                                    ) +
                                                    "\n                                    "
                                                ),
                                              ]
                                            },
                                          },
                                          {
                                            key: "cell(commission_amount)",
                                            fn: function (row) {
                                              return [
                                                _vm._v(
                                                  "\n                                        " +
                                                    _vm._s(_vm.$currency) +
                                                    " " +
                                                    _vm._s(
                                                      parseFloat(
                                                        row.item
                                                          .commission_amount
                                                      ).toFixed(2)
                                                    ) +
                                                    "\n                                    "
                                                ),
                                              ]
                                            },
                                          },
                                          {
                                            key: "cell(seller_commission_percentage)",
                                            fn: function (row) {
                                              return [
                                                _vm._v(
                                                  "\n                                        " +
                                                    _vm._s(
                                                      row.item
                                                        .seller_commission_percentage
                                                    ) +
                                                    "%\n                                    "
                                                ),
                                              ]
                                            },
                                          },
                                        ],
                                        null,
                                        false,
                                        149731947
                                      ),
                                    }),
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "b-row",
                                  { staticClass: "mt-2" },
                                  [
                                    _c(
                                      "b-col",
                                      { attrs: { md: "4", "offset-md": "8" } },
                                      [
                                        _c("b-pagination", {
                                          attrs: {
                                            "total-rows": _vm.detailTotal,
                                            "per-page": _vm.detailPerPage,
                                            size: "sm",
                                          },
                                          on: { change: _vm.loadDetailPage },
                                          model: {
                                            value: _vm.detailPage,
                                            callback: function ($$v) {
                                              _vm.detailPage = $$v
                                            },
                                            expression: "detailPage",
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
                    ])
                  : _vm._e(),
              ]
            : _c("div", { staticClass: "alert alert-info" }, [
                _vm._v(_vm._s(_vm.__("no_billing_data_available"))),
              ]),
        ],
        2
      ),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);