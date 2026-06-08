"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Logistics_ManageLoadingSlips_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'ManageLoadingSlips',
  data: function data() {
    return {
      slips: [],
      total: 0,
      page: 1,
      per_page: 10,
      filter: '',
      loading: false
    };
  },
  computed: {
    urlPrefix: function urlPrefix() {
      return this.$route.path.startsWith('/seller') ? '/seller' : '';
    },
    isSeller: function isSeller() {
      return this.$route.path.startsWith('/seller');
    },
    apiBase: function apiBase() {
      return this.isSeller ? this.$sellerApiUrl : this.$apiUrl;
    }
  },
  mounted: function mounted() {
    this.getSlips();
  },
  methods: {
    getSlips: function getSlips() {
      var _this = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips', {
        params: {
          page: this.page,
          per_page: this.per_page,
          filter: this.filter
        }
      }).then(function (res) {
        if (res.data.status === 1) {
          _this.slips = res.data.data.data || res.data.data;
          _this.total = res.data.data.total || _this.slips.length;
        }
      });
    },
    dispatchSlip: function dispatchSlip(id) {
      var _this2 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('this_will_change_loading_slip_status_to_dispatched_and_update_all_assigned_orders_to_out_for_delivery'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: __('yes_dispatch_now'),
        cancelButtonText: __('cancel'),
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#858796'
      }).then(function (result) {
        if (result.isConfirmed) {
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this2.apiBase + '/loading_slips/dispatch', {
            id: id
          }).then(function (res) {
            if (res.data.status === 1) {
              _this2.showMessage('success', res.data.message);
              _this2.getSlips();
            } else {
              _this2.showError(res.data.message);
            }
          })["catch"](function (err) {
            _this2.showError(__('an_error_occurred_during_dispatch'));
          });
        }
      });
    },
    printSlip: function printSlip(id) {
      window.open(this.apiBase + '/loading_slips/print/' + id, '_blank');
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.bg-soft-primary[data-v-5f75dcd2] {\n    background-color: rgba(78, 115, 223, 0.1) !important;\n    color: #4e73df !important;\n}\n.bg-soft-secondary[data-v-5f75dcd2] {\n    background-color: rgba(133, 135, 150, 0.1) !important;\n    color: #858796 !important;\n}\n.bg-soft-info[data-v-5f75dcd2] {\n    background-color: rgba(54, 185, 204, 0.1) !important;\n    color: #36b9cc !important;\n}\n.bg-soft-success[data-v-5f75dcd2] {\n    background-color: rgba(28, 200, 138, 0.1) !important;\n    color: #1cc88a !important;\n}\n.bg-soft-warning[data-v-5f75dcd2] {\n    background-color: rgba(246, 194, 62, 0.1) !important;\n    color: #f6c23e !important;\n}\n.btn-soft-primary[data-v-5f75dcd2] {\n    background-color: rgba(78, 115, 223, 0.1);\n    color: #4e73df;\n    border: none;\n    transition: all 0.2s;\n}\n.btn-soft-primary[data-v-5f75dcd2]:hover {\n    background-color: #4e73df;\n    color: white;\n}\n.btn-soft-success[data-v-5f75dcd2] {\n    background-color: rgba(28, 200, 138, 0.1);\n    color: #1cc88a;\n    border: none;\n    transition: all 0.2s;\n}\n.btn-soft-success[data-v-5f75dcd2]:hover {\n    background-color: #1cc88a;\n    color: white;\n}\n.btn-soft-secondary[data-v-5f75dcd2] {\n    background-color: rgba(133, 135, 150, 0.1);\n    color: #858796;\n    border: none;\n    transition: all 0.2s;\n}\n.btn-soft-secondary[data-v-5f75dcd2]:hover {\n    background-color: #858796;\n    color: white;\n}\n.transition-all[data-v-5f75dcd2] {\n    transition: all 0.25s ease-in-out;\n}\n.hover-bg-light[data-v-5f75dcd2]:hover {\n    background-color: rgba(248, 249, 250, 0.9) !important;\n    transform: translateY(-1px);\n}\n.gap-2[data-v-5f75dcd2] {\n    gap: 0.5rem;\n}\n.rounded-pill[data-v-5f75dcd2] {\n    border-radius: 50rem !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_style_index_0_id_5f75dcd2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_style_index_0_id_5f75dcd2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_style_index_0_id_5f75dcd2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Logistics/ManageLoadingSlips.vue":
/*!*************************************************************!*\
  !*** ./resources/js/views/Logistics/ManageLoadingSlips.vue ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ManageLoadingSlips_vue_vue_type_template_id_5f75dcd2_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManageLoadingSlips.vue?vue&type=template&id=5f75dcd2&scoped=true */ "./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=template&id=5f75dcd2&scoped=true");
/* harmony import */ var _ManageLoadingSlips_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ManageLoadingSlips.vue?vue&type=script&lang=js */ "./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=script&lang=js");
/* harmony import */ var _ManageLoadingSlips_vue_vue_type_style_index_0_id_5f75dcd2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css */ "./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ManageLoadingSlips_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ManageLoadingSlips_vue_vue_type_template_id_5f75dcd2_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ManageLoadingSlips_vue_vue_type_template_id_5f75dcd2_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "5f75dcd2",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Logistics/ManageLoadingSlips.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=script&lang=js":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=script&lang=js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageLoadingSlips.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css":
/*!*********************************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css ***!
  \*********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_style_index_0_id_5f75dcd2_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=style&index=0&id=5f75dcd2&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=template&id=5f75dcd2&scoped=true":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=template&id=5f75dcd2&scoped=true ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_template_id_5f75dcd2_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_template_id_5f75dcd2_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageLoadingSlips_vue_vue_type_template_id_5f75dcd2_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageLoadingSlips.vue?vue&type=template&id=5f75dcd2&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=template&id=5f75dcd2&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=template&id=5f75dcd2&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageLoadingSlips.vue?vue&type=template&id=5f75dcd2&scoped=true ***!
  \**********************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "container-fluid py-4" }, [
    _c("div", { staticClass: "row align-items-center mb-4" }, [
      _c("div", { staticClass: "col" }, [
        _c("h1", { staticClass: "h3 font-weight-bold mb-1" }, [
          _c("i", { staticClass: "fa fa-file-text text-primary mr-2" }),
          _vm._v(
            _vm._s(_vm.__("loading_slips_and_dispatches")) + "\n            "
          ),
        ]),
        _vm._v(" "),
        _c("p", { staticClass: "text-muted mb-0" }, [
          _vm._v(_vm._s(_vm.__("track_and_dispatch_warehouse_loading_slips"))),
        ]),
      ]),
      _vm._v(" "),
      _vm.isSeller
        ? _c(
            "div",
            { staticClass: "col-auto" },
            [
              _c(
                "router-link",
                {
                  staticClass:
                    "btn btn-primary btn-lg shadow-sm font-weight-bold rounded-pill",
                  attrs: { to: _vm.urlPrefix + "/loading_slips/create" },
                },
                [
                  _c("i", { staticClass: "fa fa-plus-circle mr-2" }),
                  _vm._v(_vm._s(_vm.__("plan_new_slip")) + "\n            "),
                ]
              ),
            ],
            1
          )
        : _vm._e(),
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "card border-0 shadow-sm rounded-lg overflow-hidden" },
      [
        _c("div", { staticClass: "card-header border-0 py-3" }, [
          _c("h6", { staticClass: "m-0 font-weight-bold" }, [
            _vm._v(_vm._s(_vm.__("distribution_runs"))),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card-body p-0" }, [
          _c(
            "div",
            { staticClass: "p-3 border-bottom" },
            [
              _c(
                "b-row",
                { staticClass: "mb-2" },
                [
                  _c(
                    "b-col",
                    { attrs: { md: "4", "offset-md": "7" } },
                    [
                      _c("h6", { staticClass: "box-title" }, [
                        _vm._v(_vm._s(_vm.__("search"))),
                      ]),
                      _vm._v(" "),
                      _c("b-form-input", {
                        attrs: {
                          id: "filter-input",
                          type: "search",
                          placeholder: _vm.__(
                            "search_by_slip_no_vehicle_driver"
                          ),
                        },
                        on: { input: _vm.getSlips },
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
                        "h6",
                        {
                          staticClass: "box-title",
                          staticStyle: { visibility: "hidden" },
                        },
                        [_vm._v(_vm._s(_vm.__("refresh")))]
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
                          staticClass: "btn btn-primary btn_refresh",
                          attrs: { title: _vm.__("refresh") },
                          on: {
                            click: function ($event) {
                              return _vm.getSlips()
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
            ],
            1
          ),
          _vm._v(" "),
          _c("div", { staticClass: "table-responsive" }, [
            _c(
              "table",
              {
                staticClass:
                  "table align-items-center table-flush table-hover mb-0",
              },
              [
                _c("thead", { staticClass: "thead-light" }, [
                  _c("tr", [
                    _c(
                      "th",
                      { staticClass: "py-3 font-weight-bold text-muted" },
                      [_vm._v(_vm._s(_vm.__("slip_no")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "th",
                      { staticClass: "py-3 font-weight-bold text-muted" },
                      [_vm._v(_vm._s(_vm.__("vehicle_details")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "th",
                      { staticClass: "py-3 font-weight-bold text-muted" },
                      [_vm._v(_vm._s(_vm.__("driver_rider")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "th",
                      {
                        staticClass:
                          "py-3 font-weight-bold text-muted text-center",
                      },
                      [_vm._v(_vm._s(_vm.__("orders")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "th",
                      {
                        staticClass:
                          "py-3 font-weight-bold text-muted text-right",
                      },
                      [_vm._v(_vm._s(_vm.__("total_weight")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "th",
                      {
                        staticClass:
                          "py-3 font-weight-bold text-muted text-center",
                      },
                      [_vm._v(_vm._s(_vm.__("status")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "th",
                      {
                        staticClass:
                          "py-3 font-weight-bold text-muted text-center",
                      },
                      [_vm._v(_vm._s(_vm.__("actions")))]
                    ),
                  ]),
                ]),
                _vm._v(" "),
                _c(
                  "tbody",
                  [
                    _vm._l(_vm.slips, function (slip) {
                      return _c(
                        "tr",
                        { key: slip.id, staticClass: "transition-all" },
                        [
                          _c(
                            "td",
                            {
                              staticClass: "font-weight-bold text-primary py-3",
                            },
                            [
                              _c(
                                "router-link",
                                {
                                  attrs: {
                                    to:
                                      _vm.urlPrefix +
                                      "/loading_slips/view/" +
                                      slip.id,
                                  },
                                },
                                [
                                  _vm._v(
                                    "\n                                    " +
                                      _vm._s(slip.slip_no) +
                                      "\n                                "
                                  ),
                                ]
                              ),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c("td", [
                            slip.vehicle
                              ? _c("div", { staticClass: "font-weight-bold" }, [
                                  _vm._v(_vm._s(slip.vehicle.name)),
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            slip.vehicle
                              ? _c("small", { staticClass: "text-muted" }, [
                                  _vm._v(_vm._s(slip.vehicle.vehicle_number)),
                                ])
                              : _vm._e(),
                          ]),
                          _vm._v(" "),
                          _c("td", [
                            slip.driver
                              ? _c("div", { staticClass: "font-weight-bold" }, [
                                  _vm._v(_vm._s(slip.driver.name)),
                                ])
                              : _vm._e(),
                            _vm._v(" "),
                            slip.driver
                              ? _c("small", { staticClass: "text-muted" }, [
                                  _vm._v(_vm._s(slip.driver.mobile)),
                                ])
                              : _vm._e(),
                          ]),
                          _vm._v(" "),
                          _c(
                            "td",
                            { staticClass: "text-center font-weight-bold" },
                            [
                              _c(
                                "span",
                                { staticClass: "badge bg-soft-info text-info" },
                                [
                                  _vm._v(
                                    _vm._s(slip.total_orders) +
                                      " " +
                                      _vm._s(_vm.__("orders"))
                                  ),
                                ]
                              ),
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "td",
                            { staticClass: "text-right font-weight-bold" },
                            [
                              _vm._v(
                                "\n                                " +
                                  _vm._s(slip.total_weight) +
                                  " " +
                                  _vm._s(_vm.__("kg")) +
                                  "\n                            "
                              ),
                            ]
                          ),
                          _vm._v(" "),
                          _c("td", { staticClass: "text-center" }, [
                            slip.status == 0
                              ? _c(
                                  "span",
                                  {
                                    staticClass:
                                      "badge bg-soft-warning font-weight-bold",
                                  },
                                  [
                                    _c("i", {
                                      staticClass:
                                        "fa fa-clock-o mr-1 text-warning",
                                    }),
                                    _vm._v(
                                      " " +
                                        _vm._s(_vm.__("planned")) +
                                        "\n                                "
                                    ),
                                  ]
                                )
                              : _c(
                                  "span",
                                  {
                                    staticClass:
                                      "badge bg-soft-success font-weight-bold",
                                  },
                                  [
                                    _c("i", {
                                      staticClass:
                                        "fa fa-truck mr-1 text-success",
                                    }),
                                    _vm._v(
                                      " " +
                                        _vm._s(_vm.__("dispatched")) +
                                        "\n                                "
                                    ),
                                  ]
                                ),
                          ]),
                          _vm._v(" "),
                          _c("td", { staticClass: "text-center" }, [
                            _c(
                              "div",
                              {
                                staticClass:
                                  "d-flex align-items-center justify-content-center gap-2",
                              },
                              [
                                _c(
                                  "router-link",
                                  {
                                    staticClass: "btn btn-sm btn-soft-primary",
                                    attrs: {
                                      to:
                                        _vm.urlPrefix +
                                        "/loading_slips/view/" +
                                        slip.id,
                                      title: _vm.__("view_details"),
                                    },
                                  },
                                  [_c("i", { staticClass: "fa fa-eye" })]
                                ),
                                _vm._v(" "),
                                slip.status == 0 && _vm.isSeller
                                  ? _c(
                                      "button",
                                      {
                                        staticClass:
                                          "btn btn-sm btn-soft-success",
                                        attrs: {
                                          title: _vm.__(
                                            "dispatch_out_for_delivery"
                                          ),
                                        },
                                        on: {
                                          click: function ($event) {
                                            return _vm.dispatchSlip(slip.id)
                                          },
                                        },
                                      },
                                      [
                                        _c("i", { staticClass: "fa fa-send" }),
                                        _vm._v(
                                          " " +
                                            _vm._s(_vm.__("dispatch")) +
                                            "\n                                    "
                                        ),
                                      ]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                _c(
                                  "button",
                                  {
                                    staticClass:
                                      "btn btn-sm btn-soft-secondary",
                                    attrs: {
                                      title: _vm.__("print_loading_slip"),
                                    },
                                    on: {
                                      click: function ($event) {
                                        return _vm.printSlip(slip.id)
                                      },
                                    },
                                  },
                                  [
                                    _c("i", { staticClass: "fa fa-print" }),
                                    _vm._v(
                                      " " +
                                        _vm._s(_vm.__("print")) +
                                        "\n                                    "
                                    ),
                                  ]
                                ),
                              ],
                              1
                            ),
                          ]),
                        ]
                      )
                    }),
                    _vm._v(" "),
                    _vm.slips.length === 0
                      ? _c("tr", [
                          _c(
                            "td",
                            {
                              staticClass: "text-center py-5 text-muted",
                              attrs: { colspan: "7" },
                            },
                            [
                              _c("i", {
                                staticClass:
                                  "fa fa-folder-open fa-2x mb-3 text-light",
                              }),
                              _vm._v(" "),
                              _c("p", { staticClass: "mb-0" }, [
                                _vm._v(
                                  _vm._s(_vm.__("no_distribution_slips_found"))
                                ),
                              ]),
                            ]
                          ),
                        ])
                      : _vm._e(),
                  ],
                  2
                ),
              ]
            ),
          ]),
        ]),
        _vm._v(" "),
        _vm.total > _vm.per_page
          ? _c(
              "div",
              { staticClass: "card-footer border-0 py-3" },
              [
                _c("b-pagination", {
                  staticClass: "mb-0",
                  attrs: {
                    "total-rows": _vm.total,
                    "per-page": _vm.per_page,
                    align: "right",
                  },
                  on: { input: _vm.getSlips },
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
            )
          : _vm._e(),
      ]
    ),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);