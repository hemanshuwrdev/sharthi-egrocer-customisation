"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_CashCollection_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'SellerCashCollection',
  data: function data() {
    return {
      filterDate: '',
      settlementsLoading: false,
      settlements: [],
      pendingLoading: false,
      pendingRows: [],
      selectedDriver: null,
      selectedDriverName: '',
      verifyingId: null,
      pendingFields: [{
        key: 'order',
        label: __('order'),
        sortable: false
      }, {
        key: 'method',
        label: __('method'),
        "class": 'text-center'
      }, {
        key: 'amount',
        label: __('amount'),
        "class": 'text-center'
      }, {
        key: 'proof_photo',
        label: __('proof'),
        "class": 'text-center'
      }, {
        key: 'created_at',
        label: __('date'),
        "class": 'text-center'
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }]
    };
  },
  computed: {
    totalCash: function totalCash() {
      return this.settlements.reduce(function (s, r) {
        return s + parseFloat(r.total_cash || 0);
      }, 0);
    },
    totalUpi: function totalUpi() {
      return this.settlements.reduce(function (s, r) {
        return s + parseFloat(r.total_upi || 0);
      }, 0);
    },
    grandTotal: function grandTotal() {
      return this.settlements.reduce(function (s, r) {
        return s + parseFloat(r.total_cash || 0) + parseFloat(r.total_upi || 0) + parseFloat(r.total_cheque || 0) + parseFloat(r.total_signature || 0);
      }, 0);
    }
  },
  created: function created() {
    this.load();
  },
  methods: {
    load: function load() {
      var _this = this;
      this.settlementsLoading = true;
      this.selectedDriver = null;
      this.pendingRows = [];
      var params = {};
      if (this.filterDate) params.date = this.filterDate;
      axios.get(this.$apiUrl + '/seller/settlements', {
        params: params
      }).then(function (res) {
        _this.settlements = res.data.data.data || [];
        _this.settlementsLoading = false;
      })["catch"](function () {
        _this.settlementsLoading = false;
      });
    },
    selectDriver: function selectDriver(settlement) {
      this.selectedDriver = settlement.delivery_boy_id;
      this.selectedDriverName = settlement.delivery_boy ? settlement.delivery_boy.name : '';
      this.loadPending(settlement.delivery_boy_id, settlement.settlement_date);
    },
    loadPending: function loadPending(driverId, date) {
      var _this2 = this;
      this.pendingLoading = true;
      this.pendingRows = [];
      axios.get(this.$apiUrl + '/seller/payments/pending', {
        params: {
          delivery_boy_id: driverId,
          date: date
        }
      }).then(function (res) {
        _this2.pendingRows = res.data.data.data || [];
        _this2.pendingLoading = false;
      })["catch"](function () {
        _this2.pendingLoading = false;
      });
    },
    pendingCountFor: function pendingCountFor(driverId) {
      // Show badge based on whether this driver is the selected one
      if (this.selectedDriver === driverId) return this.pendingRows.length;
      return '?'; // unknown until clicked
    },
    verify: function verify(row) {
      var _this3 = this;
      this.verifyingId = row.id;
      axios.post(this.$apiUrl + '/seller/payments/verify', {
        payment_id: row.id
      }).then(function () {
        _this3.verifyingId = null;
        _this3.$toasted.success(__('payment_verified'));
        _this3.pendingRows = _this3.pendingRows.filter(function (r) {
          return r.id !== row.id;
        });
        // refresh settlement cards
        _this3.load();
        if (_this3.selectedDriver) {
          _this3.loadPending(_this3.selectedDriver, _this3.filterDate || undefined);
        }
      })["catch"](function (err) {
        var _err$response, _err$response$data;
        _this3.verifyingId = null;
        _this3.$toasted.error(((_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.message) || __('something_went_wrong'));
      });
    },
    rowTotal: function rowTotal(s) {
      return parseFloat(s.total_cash || 0) + parseFloat(s.total_upi || 0) + parseFloat(s.total_cheque || 0) + parseFloat(s.total_signature || 0);
    },
    methodIcon: function methodIcon(m) {
      return {
        cash: 'fa fa-money',
        upi: 'fa fa-mobile',
        cheque: 'fa fa-file-text',
        signature: 'fa fa-pencil'
      }[m] || 'fa fa-credit-card';
    },
    methodBadgeClass: function methodBadgeClass(m) {
      return {
        cash: 'bg-success',
        upi: 'bg-primary',
        cheque: 'bg-info',
        signature: 'bg-warning text-dark'
      }[m] || 'bg-secondary';
    },
    formatDay: function formatDay(d) {
      return d ? moment__WEBPACK_IMPORTED_MODULE_0___default()(d).format('DD MMM YYYY') : '-';
    },
    formatDate: function formatDate(d) {
      return d ? moment__WEBPACK_IMPORTED_MODULE_0___default()(d).format('DD MMM YYYY, hh:mm A') : '-';
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Driver cards */\n.driver-card[data-v-b4617a6a] {\n    border: 1px solid #e9ecef;\n    border-radius: 12px;\n    padding: 16px;\n    cursor: pointer;\n    transition: border-color 0.2s, box-shadow 0.2s;\n    background: #fff;\n    height: 100%;\n}\n.driver-card[data-v-b4617a6a]:hover { border-color: #4f8ef7; box-shadow: 0 4px 16px rgba(79,142,247,0.12);\n}\n.driver-card--active[data-v-b4617a6a] { border-color: #4f8ef7; box-shadow: 0 4px 16px rgba(79,142,247,0.18); background: #f0f6ff;\n}\n.driver-card__header[data-v-b4617a6a] { display: flex; align-items: center; gap: 12px; margin-bottom: 12px;\n}\n.driver-card__avatar[data-v-b4617a6a] {\n    width: 40px; height: 40px; border-radius: 50%;\n    background: #e8f0fe; color: #4f8ef7;\n    display: flex; align-items: center; justify-content: center; font-size: 16px;\n    flex-shrink: 0;\n}\n.driver-card__info[data-v-b4617a6a] { min-width: 0;\n}\n.driver-card__methods[data-v-b4617a6a] { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;\n}\n.driver-card__footer[data-v-b4617a6a] { display: flex; justify-content: space-between; align-items: center;\n}\n\n/* Method pills */\n.method-pill[data-v-b4617a6a] {\n    display: inline-flex; align-items: center;\n    font-size: 12px; font-weight: 600;\n    padding: 3px 10px; border-radius: 20px;\n}\n.method-pill--cash[data-v-b4617a6a]    { background: #dcfce7; color: #16a34a;\n}\n.method-pill--upi[data-v-b4617a6a]     { background: #eff6ff; color: #3b82f6;\n}\n.method-pill--cheque[data-v-b4617a6a]  { background: #e0f2fe; color: #0284c7;\n}\n.method-pill--sig[data-v-b4617a6a]     { background: #fef9c3; color: #854d0e;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_style_index_0_id_b4617a6a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_style_index_0_id_b4617a6a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_style_index_0_id_b4617a6a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sellers/CashCollection.vue":
/*!*******************************************************!*\
  !*** ./resources/js/views/Sellers/CashCollection.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CashCollection_vue_vue_type_template_id_b4617a6a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CashCollection.vue?vue&type=template&id=b4617a6a&scoped=true */ "./resources/js/views/Sellers/CashCollection.vue?vue&type=template&id=b4617a6a&scoped=true");
/* harmony import */ var _CashCollection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CashCollection.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/CashCollection.vue?vue&type=script&lang=js");
/* harmony import */ var _CashCollection_vue_vue_type_style_index_0_id_b4617a6a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css */ "./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CashCollection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _CashCollection_vue_vue_type_template_id_b4617a6a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _CashCollection_vue_vue_type_template_id_b4617a6a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "b4617a6a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/CashCollection.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/CashCollection.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/Sellers/CashCollection.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CashCollection.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css":
/*!***************************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_style_index_0_id_b4617a6a_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=style&index=0&id=b4617a6a&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/CashCollection.vue?vue&type=template&id=b4617a6a&scoped=true":
/*!*************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/CashCollection.vue?vue&type=template&id=b4617a6a&scoped=true ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_template_id_b4617a6a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_template_id_b4617a6a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CashCollection_vue_vue_type_template_id_b4617a6a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CashCollection.vue?vue&type=template&id=b4617a6a&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=template&id=b4617a6a&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=template&id=b4617a6a&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CashCollection.vue?vue&type=template&id=b4617a6a&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************/
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
            _c("h3", [_vm._v(_vm._s(_vm.__("cash_collection")))]),
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
                    [_vm._v(_vm._s(_vm.__("cash_collection")))]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c("section", { staticClass: "section" }, [
        _c("div", { staticClass: "row mb-4" }, [
          _c("div", { staticClass: "col-6 col-md-3 mb-3" }, [
            _c("div", { staticClass: "card h-100" }, [
              _c("div", { staticClass: "card-body px-3 py-4-5" }, [
                _c("div", { staticClass: "row" }, [
                  _vm._m(0),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-8" }, [
                    _c("h5", { staticClass: "text-muted font-semibold" }, [
                      _vm._v(_vm._s(_vm.__("pending_verifications"))),
                    ]),
                    _vm._v(" "),
                    _c("h3", { staticClass: "font-extrabold mb-0" }, [
                      _vm._v(_vm._s(_vm.pendingRows.length)),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-6 col-md-3 mb-3" }, [
            _c("div", { staticClass: "card h-100" }, [
              _c("div", { staticClass: "card-body px-3 py-4-5" }, [
                _c("div", { staticClass: "row" }, [
                  _vm._m(1),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-8" }, [
                    _c("h5", { staticClass: "text-muted font-semibold" }, [
                      _vm._v(_vm._s(_vm.__("cash_collected"))),
                    ]),
                    _vm._v(" "),
                    _c("h3", { staticClass: "font-extrabold mb-0" }, [
                      _vm._v(
                        _vm._s(
                          _vm.$currency + " " + _vm.formatAmount(_vm.totalCash)
                        )
                      ),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-6 col-md-3 mb-3" }, [
            _c("div", { staticClass: "card h-100" }, [
              _c("div", { staticClass: "card-body px-3 py-4-5" }, [
                _c("div", { staticClass: "row" }, [
                  _vm._m(2),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-8" }, [
                    _c("h5", { staticClass: "text-muted font-semibold" }, [
                      _vm._v(_vm._s(_vm.__("upi_collected"))),
                    ]),
                    _vm._v(" "),
                    _c("h3", { staticClass: "font-extrabold mb-0" }, [
                      _vm._v(
                        _vm._s(
                          _vm.$currency + " " + _vm.formatAmount(_vm.totalUpi)
                        )
                      ),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-6 col-md-3 mb-3" }, [
            _c("div", { staticClass: "card h-100" }, [
              _c("div", { staticClass: "card-body px-3 py-4-5" }, [
                _c("div", { staticClass: "row" }, [
                  _vm._m(3),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-8" }, [
                    _c("h5", { staticClass: "text-muted font-semibold" }, [
                      _vm._v(_vm._s(_vm.__("total_collected"))),
                    ]),
                    _vm._v(" "),
                    _c("h3", { staticClass: "font-extrabold mb-0" }, [
                      _vm._v(
                        _vm._s(
                          _vm.$currency + " " + _vm.formatAmount(_vm.grandTotal)
                        )
                      ),
                    ]),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card mb-4" }, [
          _c(
            "div",
            {
              staticClass:
                "card-header d-flex justify-content-between align-items-center",
            },
            [
              _c("h4", { staticClass: "card-title mb-0" }, [
                _vm._v(_vm._s(_vm.__("driver_wise_collection"))),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "d-flex gap-2 align-items-center" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.filterDate,
                      expression: "filterDate",
                    },
                  ],
                  staticClass: "form-control form-control-sm",
                  staticStyle: { width: "160px" },
                  attrs: { type: "date" },
                  domProps: { value: _vm.filterDate },
                  on: {
                    change: _vm.load,
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.filterDate = $event.target.value
                    },
                  },
                }),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-sm btn-outline-secondary",
                    on: {
                      click: function ($event) {
                        _vm.filterDate = ""
                        _vm.load()
                      },
                    },
                  },
                  [_vm._v(_vm._s(_vm.__("clear")))]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-sm btn-primary",
                    on: { click: _vm.load },
                  },
                  [_c("i", { staticClass: "fa fa-refresh" })]
                ),
              ]),
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "card-body" }, [
            _vm.settlementsLoading
              ? _c(
                  "div",
                  { staticClass: "text-center py-4" },
                  [_c("b-spinner")],
                  1
                )
              : _vm.settlements.length === 0
              ? _c("div", { staticClass: "text-center text-muted py-4" }, [
                  _c("i", { staticClass: "fa fa-inbox fa-2x mb-2 d-block" }),
                  _vm._v(
                    "\n                        " +
                      _vm._s(_vm.__("no_settlements_found")) +
                      "\n                    "
                  ),
                ])
              : _c(
                  "div",
                  { staticClass: "row" },
                  _vm._l(_vm.settlements, function (s) {
                    return _c(
                      "div",
                      { key: s.id, staticClass: "col-md-6 col-xl-4 mb-3" },
                      [
                        _c(
                          "div",
                          {
                            staticClass: "driver-card",
                            class: {
                              "driver-card--active":
                                _vm.selectedDriver === s.delivery_boy_id,
                            },
                            on: {
                              click: function ($event) {
                                return _vm.selectDriver(s)
                              },
                            },
                          },
                          [
                            _c("div", { staticClass: "driver-card__header" }, [
                              _vm._m(4, true),
                              _vm._v(" "),
                              _c("div", { staticClass: "driver-card__info" }, [
                                _c("div", { staticClass: "fw-bold" }, [
                                  _vm._v(
                                    _vm._s(
                                      s.delivery_boy ? s.delivery_boy.name : "-"
                                    )
                                  ),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "text-muted small" }, [
                                  _vm._v(
                                    _vm._s(
                                      s.delivery_boy
                                        ? s.delivery_boy.mobile
                                        : ""
                                    )
                                  ),
                                ]),
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "ms-auto text-end" }, [
                                _c(
                                  "div",
                                  { staticClass: "fw-bold text-success" },
                                  [
                                    _vm._v(
                                      _vm._s(_vm.$currency) +
                                        " " +
                                        _vm._s(_vm.rowTotal(s).toFixed(2))
                                    ),
                                  ]
                                ),
                                _vm._v(" "),
                                _c("div", { staticClass: "text-muted small" }, [
                                  _vm._v(
                                    _vm._s(s.total_orders) +
                                      " " +
                                      _vm._s(_vm.__("orders"))
                                  ),
                                ]),
                              ]),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "driver-card__methods" }, [
                              parseFloat(s.total_cash) > 0
                                ? _c(
                                    "span",
                                    {
                                      staticClass:
                                        "method-pill method-pill--cash",
                                    },
                                    [
                                      _c("i", {
                                        staticClass: "fa fa-money me-1",
                                      }),
                                      _vm._v(
                                        _vm._s(_vm.$currency) +
                                          " " +
                                          _vm._s(
                                            parseFloat(s.total_cash).toFixed(2)
                                          ) +
                                          "\n                                    "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              parseFloat(s.total_upi) > 0
                                ? _c(
                                    "span",
                                    {
                                      staticClass:
                                        "method-pill method-pill--upi",
                                    },
                                    [
                                      _c("i", {
                                        staticClass: "fa fa-mobile me-1",
                                      }),
                                      _vm._v(
                                        _vm._s(_vm.$currency) +
                                          " " +
                                          _vm._s(
                                            parseFloat(s.total_upi).toFixed(2)
                                          ) +
                                          "\n                                    "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              parseFloat(s.total_cheque) > 0
                                ? _c(
                                    "span",
                                    {
                                      staticClass:
                                        "method-pill method-pill--cheque",
                                    },
                                    [
                                      _c("i", {
                                        staticClass: "fa fa-file-text me-1",
                                      }),
                                      _vm._v(
                                        _vm._s(_vm.$currency) +
                                          " " +
                                          _vm._s(
                                            parseFloat(s.total_cheque).toFixed(
                                              2
                                            )
                                          ) +
                                          "\n                                    "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              parseFloat(s.total_signature || 0) > 0
                                ? _c(
                                    "span",
                                    {
                                      staticClass:
                                        "method-pill method-pill--sig",
                                    },
                                    [
                                      _c("i", {
                                        staticClass: "fa fa-pencil me-1",
                                      }),
                                      _vm._v(
                                        _vm._s(_vm.$currency) +
                                          " " +
                                          _vm._s(
                                            parseFloat(
                                              s.total_signature
                                            ).toFixed(2)
                                          ) +
                                          "\n                                    "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "driver-card__footer" }, [
                              _c("span", { staticClass: "text-muted small" }, [
                                _vm._v(
                                  _vm._s(_vm.formatDay(s.settlement_date))
                                ),
                              ]),
                              _vm._v(" "),
                              _vm.pendingCountFor(s.delivery_boy_id) > 0
                                ? _c(
                                    "span",
                                    {
                                      staticClass: "badge bg-warning text-dark",
                                    },
                                    [
                                      _vm._v(
                                        "\n                                        " +
                                          _vm._s(
                                            _vm.pendingCountFor(
                                              s.delivery_boy_id
                                            )
                                          ) +
                                          " " +
                                          _vm._s(_vm.__("pending")) +
                                          "\n                                    "
                                      ),
                                    ]
                                  )
                                : _c(
                                    "span",
                                    { staticClass: "badge bg-success" },
                                    [
                                      _c("i", {
                                        staticClass: "fa fa-check me-1",
                                      }),
                                      _vm._v(
                                        _vm._s(_vm.__("all_verified")) +
                                          "\n                                    "
                                      ),
                                    ]
                                  ),
                            ]),
                          ]
                        ),
                      ]
                    )
                  }),
                  0
                ),
          ]),
        ]),
        _vm._v(" "),
        _vm.selectedDriver
          ? _c("div", { staticClass: "card" }, [
              _c(
                "div",
                {
                  staticClass:
                    "card-header d-flex justify-content-between align-items-center",
                },
                [
                  _c("h4", { staticClass: "card-title mb-0" }, [
                    _c("i", { staticClass: "fa fa-user me-2" }),
                    _vm._v(
                      _vm._s(_vm.selectedDriverName) +
                        " — " +
                        _vm._s(_vm.__("pending_verifications")) +
                        "\n                    "
                    ),
                  ]),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-sm btn-outline-secondary",
                      on: {
                        click: function ($event) {
                          _vm.selectedDriver = null
                        },
                      },
                    },
                    [_c("i", { staticClass: "fa fa-times" })]
                  ),
                ]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "card-body" }, [
                _vm.pendingLoading
                  ? _c(
                      "div",
                      { staticClass: "text-center py-4" },
                      [_c("b-spinner")],
                      1
                    )
                  : _vm.pendingRows.length === 0
                  ? _c("div", { staticClass: "text-center text-muted py-4" }, [
                      _c("i", {
                        staticClass:
                          "fa fa-check-circle fa-2x text-success mb-2 d-block",
                      }),
                      _vm._v(
                        "\n                        " +
                          _vm._s(_vm.__("no_pending_payments")) +
                          "\n                    "
                      ),
                    ])
                  : _c(
                      "div",
                      { staticClass: "table-responsive" },
                      [
                        _c("b-table", {
                          attrs: {
                            items: _vm.pendingRows,
                            fields: _vm.pendingFields,
                            bordered: true,
                            "show-empty": "",
                            small: "",
                            stacked: "md",
                          },
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "cell(order)",
                                fn: function (row) {
                                  return [
                                    _c("div", { staticClass: "fw-semibold" }, [
                                      _vm._v(
                                        "#" +
                                          _vm._s(
                                            row.item.order
                                              ? row.item.order.orders_id
                                              : row.item.order_id
                                          )
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    row.item.order
                                      ? _c(
                                          "div",
                                          { staticClass: "text-muted small" },
                                          [
                                            _vm._v(
                                              _vm._s(_vm.$currency) +
                                                " " +
                                                _vm._s(
                                                  parseFloat(
                                                    row.item.order.final_total
                                                  ).toFixed(2)
                                                )
                                            ),
                                          ]
                                        )
                                      : _vm._e(),
                                  ]
                                },
                              },
                              {
                                key: "cell(method)",
                                fn: function (row) {
                                  return [
                                    _c(
                                      "span",
                                      {
                                        staticClass: "badge",
                                        class: _vm.methodBadgeClass(
                                          row.item.method
                                        ),
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "me-1",
                                          class: _vm.methodIcon(
                                            row.item.method
                                          ),
                                        }),
                                        _vm._v(
                                          _vm._s(row.item.method) +
                                            "\n                                "
                                        ),
                                      ]
                                    ),
                                  ]
                                },
                              },
                              {
                                key: "cell(amount)",
                                fn: function (row) {
                                  return [
                                    _c("span", { staticClass: "fw-bold" }, [
                                      _vm._v(
                                        _vm._s(_vm.$currency) +
                                          " " +
                                          _vm._s(
                                            parseFloat(row.item.amount).toFixed(
                                              2
                                            )
                                          )
                                      ),
                                    ]),
                                  ]
                                },
                              },
                              {
                                key: "cell(proof_photo)",
                                fn: function (row) {
                                  return [
                                    row.item.proof_photo
                                      ? _c(
                                          "a",
                                          {
                                            staticClass:
                                              "btn btn-sm btn-outline-info",
                                            attrs: {
                                              href:
                                                "/storage/" +
                                                row.item.proof_photo,
                                              target: "_blank",
                                            },
                                          },
                                          [
                                            _c("i", {
                                              staticClass: "fa fa-image",
                                            }),
                                          ]
                                        )
                                      : _c(
                                          "span",
                                          { staticClass: "text-muted small" },
                                          [_vm._v("-")]
                                        ),
                                  ]
                                },
                              },
                              {
                                key: "cell(created_at)",
                                fn: function (row) {
                                  return [
                                    _c(
                                      "span",
                                      { staticClass: "text-muted small" },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            _vm.formatDate(row.item.created_at)
                                          )
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
                                      "button",
                                      {
                                        staticClass: "btn btn-sm btn-success",
                                        attrs: {
                                          disabled:
                                            _vm.verifyingId === row.item.id,
                                        },
                                        on: {
                                          click: function ($event) {
                                            return _vm.verify(row.item)
                                          },
                                        },
                                      },
                                      [
                                        _vm.verifyingId === row.item.id
                                          ? _c("b-spinner", {
                                              attrs: { small: "" },
                                            })
                                          : _c("i", {
                                              staticClass: "fa fa-check",
                                            }),
                                        _vm._v(
                                          " " +
                                            _vm._s(_vm.__("verify")) +
                                            "\n                                "
                                        ),
                                      ],
                                      1
                                    ),
                                  ]
                                },
                              },
                            ],
                            null,
                            false,
                            4213005091
                          ),
                        }),
                      ],
                      1
                    ),
              ]),
            ])
          : _vm._e(),
      ]),
    ]),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-4 d-flex justify-content-start" }, [
      _c("div", { staticClass: "stats-icon purple mb-2" }, [
        _c("i", { staticClass: "fa fa-clock-o" }),
      ]),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-4 d-flex justify-content-start" }, [
      _c("div", { staticClass: "stats-icon green mb-2" }, [
        _c("i", { staticClass: "fa fa-money" }),
      ]),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-4 d-flex justify-content-start" }, [
      _c("div", { staticClass: "stats-icon blue mb-2" }, [
        _c("i", { staticClass: "fa fa-mobile" }),
      ]),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-4 d-flex justify-content-start" }, [
      _c("div", { staticClass: "stats-icon red mb-2" }, [
        _c("i", { staticClass: "fa fa-handshake-o" }),
      ]),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "driver-card__avatar" }, [
      _c("i", { staticClass: "fa fa-user" }),
    ])
  },
]
render._withStripped = true



/***/ })

}]);