"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_Settlements_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'SellerSettlements',
  data: function data() {
    return {
      loading: false,
      rows: [],
      drivers: [],
      filterDate: '',
      filterDriver: '',
      fields: [{
        key: 'delivery_boy',
        label: __('driver'),
        sortable: false
      }, {
        key: 'settlement_date',
        label: __('date'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'total_orders',
        label: __('orders'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'total_cash',
        label: __('cash'),
        "class": 'text-center',
        sortable: false
      }, {
        key: 'total_upi',
        label: __('upi'),
        "class": 'text-center',
        sortable: false
      }, {
        key: 'total_cheque',
        label: __('cheque'),
        "class": 'text-center',
        sortable: false
      }, {
        key: 'total_all',
        label: __('total_collected'),
        "class": 'text-center',
        sortable: false
      }, {
        key: 'locked_at',
        label: __('locked_at'),
        "class": 'text-center',
        sortable: false
      }, {
        key: 'actions',
        label: '',
        "class": 'text-center',
        sortable: false
      }]
    };
  },
  computed: {
    totalCash: function totalCash() {
      return this.rows.reduce(function (s, r) {
        return s + parseFloat(r.total_cash || 0);
      }, 0);
    },
    totalUpi: function totalUpi() {
      return this.rows.reduce(function (s, r) {
        return s + parseFloat(r.total_upi || 0);
      }, 0);
    },
    totalCheque: function totalCheque() {
      return this.rows.reduce(function (s, r) {
        return s + parseFloat(r.total_cheque || 0);
      }, 0);
    },
    totalSignature: function totalSignature() {
      return this.rows.reduce(function (s, r) {
        return s + parseFloat(r.total_signature || 0);
      }, 0);
    },
    grandTotal: function grandTotal() {
      return this.totalCash + this.totalUpi + this.totalCheque + this.totalSignature;
    }
  },
  created: function created() {
    this.load();
  },
  methods: {
    load: function load() {
      var _this = this;
      this.loading = true;
      var params = {};
      if (this.filterDate) params.date = this.filterDate;
      if (this.filterDriver) params.delivery_boy_id = this.filterDriver;
      axios.get(this.$apiUrl + '/seller/settlements', {
        params: params
      }).then(function (res) {
        _this.rows = res.data.data.data || [];
        var seen = new Set();
        _this.rows.forEach(function (r) {
          if (r.delivery_boy && !seen.has(r.delivery_boy.id)) {
            seen.add(r.delivery_boy.id);
            _this.drivers.push(r.delivery_boy);
          }
        });
        _this.loading = false;
      })["catch"](function () {
        _this.loading = false;
      });
    },
    clearFilters: function clearFilters() {
      this.filterDate = '';
      this.filterDriver = '';
      this.load();
    },
    rowTotal: function rowTotal(row) {
      return parseFloat(row.total_cash || 0) + parseFloat(row.total_upi || 0) + parseFloat(row.total_cheque || 0) + parseFloat(row.total_signature || 0);
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.stat-card[data-v-06db8a80] {\n    display: flex;\n    align-items: center;\n    gap: 14px;\n    background: #fff;\n    border-radius: 14px;\n    padding: 18px 16px;\n    box-shadow: 0 2px 12px rgba(0,0,0,0.07);\n    border: 1px solid #f0f0f0;\n    height: 100%;\n}\n.stat-card__icon-wrap[data-v-06db8a80] {\n    flex-shrink: 0;\n    width: 46px;\n    height: 46px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 18px;\n}\n.stat-card__icon-wrap--green[data-v-06db8a80]  { background: #e8f8f1; color: #22c55e;\n}\n.stat-card__icon-wrap--blue[data-v-06db8a80]   { background: #e8f0fe; color: #4f8ef7;\n}\n.stat-card__icon-wrap--orange[data-v-06db8a80] { background: #fff4e5; color: #f97316;\n}\n.stat-card__icon-wrap--purple[data-v-06db8a80] { background: #f3e8ff; color: #a855f7;\n}\n.stat-card__body[data-v-06db8a80] { flex: 1; min-width: 0;\n}\n.stat-card__label[data-v-06db8a80] {\n    font-size: 11px;\n    font-weight: 700;\n    text-transform: uppercase;\n    letter-spacing: 0.07em;\n    color: #9ca3af;\n    margin-bottom: 3px;\n}\n.stat-card__value[data-v-06db8a80] {\n    font-size: 20px;\n    font-weight: 800;\n    color: #111827;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n.stat-card__value--blue[data-v-06db8a80]   { color: #4f8ef7;\n}\n.stat-card__value--orange[data-v-06db8a80] { color: #f97316;\n}\n.stat-card__value--purple[data-v-06db8a80] { color: #a855f7;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_style_index_0_id_06db8a80_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_style_index_0_id_06db8a80_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_style_index_0_id_06db8a80_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sellers/Settlements.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/Sellers/Settlements.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Settlements_vue_vue_type_template_id_06db8a80_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Settlements.vue?vue&type=template&id=06db8a80&scoped=true */ "./resources/js/views/Sellers/Settlements.vue?vue&type=template&id=06db8a80&scoped=true");
/* harmony import */ var _Settlements_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Settlements.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/Settlements.vue?vue&type=script&lang=js");
/* harmony import */ var _Settlements_vue_vue_type_style_index_0_id_06db8a80_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css */ "./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Settlements_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Settlements_vue_vue_type_template_id_06db8a80_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Settlements_vue_vue_type_template_id_06db8a80_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "06db8a80",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/Settlements.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/Settlements.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/views/Sellers/Settlements.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settlements.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css":
/*!************************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_style_index_0_id_06db8a80_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=style&index=0&id=06db8a80&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/Settlements.vue?vue&type=template&id=06db8a80&scoped=true":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/Sellers/Settlements.vue?vue&type=template&id=06db8a80&scoped=true ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_template_id_06db8a80_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_template_id_06db8a80_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Settlements_vue_vue_type_template_id_06db8a80_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Settlements.vue?vue&type=template&id=06db8a80&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=template&id=06db8a80&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=template&id=06db8a80&scoped=true":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Settlements.vue?vue&type=template&id=06db8a80&scoped=true ***!
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
  return _c("div", [
    _c("div", { staticClass: "page-heading" }, [
      _c("div", { staticClass: "page-title" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("driver_settlements")))]),
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
                    [_vm._v(_vm._s(_vm.__("driver_settlements")))]
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
          _vm.rows.length
            ? _c(
                "b-row",
                { staticClass: "mb-4" },
                [
                  _c(
                    "b-col",
                    { staticClass: "mb-3 mb-md-0", attrs: { md: "3" } },
                    [
                      _c("div", { staticClass: "stat-card" }, [
                        _c(
                          "div",
                          {
                            staticClass:
                              "stat-card__icon-wrap stat-card__icon-wrap--green",
                          },
                          [_c("i", { staticClass: "fa fa-money" })]
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "stat-card__body" }, [
                          _c("div", { staticClass: "stat-card__label" }, [
                            _vm._v(_vm._s(_vm.__("total_cash"))),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "stat-card__value" }, [
                            _vm._v(
                              _vm._s(_vm.$currency) +
                                " " +
                                _vm._s(_vm.formatAmount(_vm.totalCash))
                            ),
                          ]),
                        ]),
                      ]),
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "b-col",
                    { staticClass: "mb-3 mb-md-0", attrs: { md: "3" } },
                    [
                      _c("div", { staticClass: "stat-card" }, [
                        _c(
                          "div",
                          {
                            staticClass:
                              "stat-card__icon-wrap stat-card__icon-wrap--blue",
                          },
                          [_c("i", { staticClass: "fa fa-mobile" })]
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "stat-card__body" }, [
                          _c("div", { staticClass: "stat-card__label" }, [
                            _vm._v(_vm._s(_vm.__("total_upi"))),
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
                                _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(_vm.formatAmount(_vm.totalUpi))
                              ),
                            ]
                          ),
                        ]),
                      ]),
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "b-col",
                    { staticClass: "mb-3 mb-md-0", attrs: { md: "3" } },
                    [
                      _c("div", { staticClass: "stat-card" }, [
                        _c(
                          "div",
                          {
                            staticClass:
                              "stat-card__icon-wrap stat-card__icon-wrap--orange",
                          },
                          [_c("i", { staticClass: "fa fa-file-text" })]
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "stat-card__body" }, [
                          _c("div", { staticClass: "stat-card__label" }, [
                            _vm._v(_vm._s(_vm.__("total_cheque"))),
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            {
                              staticClass:
                                "stat-card__value stat-card__value--orange",
                            },
                            [
                              _vm._v(
                                _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(_vm.formatAmount(_vm.totalCheque))
                              ),
                            ]
                          ),
                        ]),
                      ]),
                    ]
                  ),
                  _vm._v(" "),
                  _c("b-col", { attrs: { md: "3" } }, [
                    _c("div", { staticClass: "stat-card" }, [
                      _c(
                        "div",
                        {
                          staticClass:
                            "stat-card__icon-wrap stat-card__icon-wrap--purple",
                        },
                        [_c("i", { staticClass: "fa fa-pencil" })]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "stat-card__body" }, [
                        _c("div", { staticClass: "stat-card__label" }, [
                          _vm._v(_vm._s(_vm.__("total_signature"))),
                        ]),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass:
                              "stat-card__value stat-card__value--purple",
                          },
                          [
                            _vm._v(
                              _vm._s(_vm.$currency) +
                                " " +
                                _vm._s(_vm.formatAmount(_vm.totalSignature))
                            ),
                          ]
                        ),
                      ]),
                    ]),
                  ]),
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _c("div", { staticClass: "card mb-3" }, [
            _c(
              "div",
              { staticClass: "card-body py-2" },
              [
                _c(
                  "b-row",
                  { staticClass: "align-items-end" },
                  [
                    _c("b-col", { attrs: { md: "3" } }, [
                      _c("label", { staticClass: "form-label small" }, [
                        _vm._v(_vm._s(_vm.__("date"))),
                      ]),
                      _vm._v(" "),
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
                    ]),
                    _vm._v(" "),
                    _c("b-col", { attrs: { md: "3" } }, [
                      _c("label", { staticClass: "form-label small" }, [
                        _vm._v(_vm._s(_vm.__("driver"))),
                      ]),
                      _vm._v(" "),
                      _c(
                        "select",
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.filterDriver,
                              expression: "filterDriver",
                            },
                          ],
                          staticClass:
                            "form-control form-select form-select-sm",
                          on: {
                            change: [
                              function ($event) {
                                var $$selectedVal = Array.prototype.filter
                                  .call($event.target.options, function (o) {
                                    return o.selected
                                  })
                                  .map(function (o) {
                                    var val = "_value" in o ? o._value : o.value
                                    return val
                                  })
                                _vm.filterDriver = $event.target.multiple
                                  ? $$selectedVal
                                  : $$selectedVal[0]
                              },
                              _vm.load,
                            ],
                          },
                        },
                        [
                          _c("option", { attrs: { value: "" } }, [
                            _vm._v(_vm._s(_vm.__("all_drivers"))),
                          ]),
                          _vm._v(" "),
                          _vm._l(_vm.drivers, function (d) {
                            return _c(
                              "option",
                              { key: d.id, domProps: { value: d.id } },
                              [_vm._v(_vm._s(d.name))]
                            )
                          }),
                        ],
                        2
                      ),
                    ]),
                    _vm._v(" "),
                    _c(
                      "b-col",
                      {
                        staticClass: "d-flex align-items-end gap-1",
                        attrs: { md: "2" },
                      },
                      [
                        _c(
                          "button",
                          {
                            staticClass: "btn btn-sm btn-primary",
                            on: { click: _vm.load },
                          },
                          [_c("i", { staticClass: "fa fa-refresh" })]
                        ),
                        _vm._v(" "),
                        _c(
                          "button",
                          {
                            staticClass: "btn btn-sm btn-outline-secondary",
                            on: { click: _vm.clearFilters },
                          },
                          [
                            _vm._v(
                              "\n                                " +
                                _vm._s(_vm.__("clear")) +
                                "\n                            "
                            ),
                          ]
                        ),
                      ]
                    ),
                  ],
                  1
                ),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "card" }, [
            _c(
              "div",
              {
                staticClass:
                  "card-header d-flex justify-content-between align-items-center",
              },
              [
                _c("h4", { staticClass: "card-title mb-0" }, [
                  _vm._v(_vm._s(_vm.__("eod_settlements"))),
                ]),
                _vm._v(" "),
                _c("span", { staticClass: "text-muted small" }, [
                  _vm._v(_vm._s(_vm.__("locked_settlements_only"))),
                ]),
              ]
            ),
            _vm._v(" "),
            _c("div", { staticClass: "card-body" }, [
              _vm.loading
                ? _c(
                    "div",
                    { staticClass: "text-center py-4" },
                    [_c("b-spinner")],
                    1
                  )
                : _vm.rows.length === 0
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
                    { staticClass: "table-responsive" },
                    [
                      _c("b-table", {
                        attrs: {
                          items: _vm.rows,
                          fields: _vm.fields,
                          bordered: true,
                          "show-empty": "",
                          small: "",
                          stacked: "md",
                        },
                        scopedSlots: _vm._u([
                          {
                            key: "cell(delivery_boy)",
                            fn: function (row) {
                              return [
                                _c("div", { staticClass: "fw-semibold" }, [
                                  _vm._v(
                                    _vm._s(
                                      row.item.delivery_boy
                                        ? row.item.delivery_boy.name
                                        : "-"
                                    )
                                  ),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "text-muted small" }, [
                                  _vm._v(
                                    _vm._s(
                                      row.item.delivery_boy
                                        ? row.item.delivery_boy.mobile
                                        : ""
                                    )
                                  ),
                                ]),
                              ]
                            },
                          },
                          {
                            key: "cell(settlement_date)",
                            fn: function (row) {
                              return [
                                _c("span", { staticClass: "fw-semibold" }, [
                                  _vm._v(
                                    _vm._s(
                                      _vm.formatDay(row.item.settlement_date)
                                    )
                                  ),
                                ]),
                              ]
                            },
                          },
                          {
                            key: "cell(total_orders)",
                            fn: function (row) {
                              return [
                                _c(
                                  "span",
                                  { staticClass: "badge bg-primary" },
                                  [_vm._v(_vm._s(row.item.total_orders))]
                                ),
                              ]
                            },
                          },
                          {
                            key: "cell(total_cash)",
                            fn: function (row) {
                              return [
                                _vm._v(
                                  "\n                                " +
                                    _vm._s(_vm.$currency) +
                                    " " +
                                    _vm._s(
                                      parseFloat(
                                        row.item.total_cash || 0
                                      ).toFixed(2)
                                    ) +
                                    "\n                            "
                                ),
                              ]
                            },
                          },
                          {
                            key: "cell(total_upi)",
                            fn: function (row) {
                              return [
                                _vm._v(
                                  "\n                                " +
                                    _vm._s(_vm.$currency) +
                                    " " +
                                    _vm._s(
                                      parseFloat(
                                        row.item.total_upi || 0
                                      ).toFixed(2)
                                    ) +
                                    "\n                            "
                                ),
                              ]
                            },
                          },
                          {
                            key: "cell(total_cheque)",
                            fn: function (row) {
                              return [
                                _vm._v(
                                  "\n                                " +
                                    _vm._s(_vm.$currency) +
                                    " " +
                                    _vm._s(
                                      parseFloat(
                                        row.item.total_cheque || 0
                                      ).toFixed(2)
                                    ) +
                                    "\n                            "
                                ),
                              ]
                            },
                          },
                          {
                            key: "cell(total_all)",
                            fn: function (row) {
                              return [
                                _c(
                                  "span",
                                  { staticClass: "fw-bold text-success" },
                                  [
                                    _vm._v(
                                      "\n                                    " +
                                        _vm._s(_vm.$currency) +
                                        " " +
                                        _vm._s(
                                          _vm.rowTotal(row.item).toFixed(2)
                                        ) +
                                        "\n                                "
                                    ),
                                  ]
                                ),
                              ]
                            },
                          },
                          {
                            key: "cell(locked_at)",
                            fn: function (row) {
                              return [
                                _c(
                                  "span",
                                  { staticClass: "text-muted small" },
                                  [
                                    _vm._v(
                                      _vm._s(_vm.formatDate(row.item.locked_at))
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
                                  "router-link",
                                  {
                                    staticClass:
                                      "btn btn-sm btn-outline-primary",
                                    attrs: {
                                      to: "/seller/trips/" + row.item.id,
                                    },
                                  },
                                  [
                                    _c("i", { staticClass: "fa fa-eye me-1" }),
                                    _vm._v(
                                      _vm._s(_vm.__("view_trip")) +
                                        "\n                                "
                                    ),
                                  ]
                                ),
                              ]
                            },
                          },
                        ]),
                      }),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "d-flex flex-wrap gap-3 mt-3 pt-3 border-top",
                        },
                        [
                          _c(
                            "div",
                            { staticClass: "text-muted small fw-semibold" },
                            [
                              _vm._v(
                                "\n                                " +
                                  _vm._s(_vm.__("grand_total")) +
                                  ":\n                                "
                              ),
                              _c(
                                "span",
                                {
                                  staticClass: "text-success fw-bold fs-6 ms-1",
                                },
                                [
                                  _vm._v(
                                    "\n                                    " +
                                      _vm._s(_vm.$currency) +
                                      " " +
                                      _vm._s(_vm.grandTotal.toFixed(2)) +
                                      "\n                                "
                                  ),
                                ]
                              ),
                            ]
                          ),
                          _vm._v(" "),
                          _c("div", { staticClass: "text-muted small" }, [
                            _vm._v(
                              "\n                                " +
                                _vm._s(_vm.__("total_settlements")) +
                                ": "
                            ),
                            _c("strong", [_vm._v(_vm._s(_vm.rows.length))]),
                          ]),
                        ]
                      ),
                    ],
                    1
                  ),
            ]),
          ]),
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