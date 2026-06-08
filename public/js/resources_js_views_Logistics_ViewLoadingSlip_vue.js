"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Logistics_ViewLoadingSlip_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'ViewLoadingSlip',
  data: function data() {
    return {
      slip: null,
      orders: []
    };
  },
  computed: {
    loadRatioPercent: function loadRatioPercent() {
      if (!this.slip || !this.slip.vehicle) return 0;
      return parseFloat(this.slip.total_weight) / parseFloat(this.slip.vehicle.capacity) * 100;
    },
    loadRatioClass: function loadRatioClass() {
      if (this.loadRatioPercent > 99) return 'text-danger';
      if (this.loadRatioPercent > 80) return 'text-warning';
      return 'text-success';
    },
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
    this.getSlipDetails();
  },
  methods: {
    getSlipDetails: function getSlipDetails() {
      var _this = this;
      var id = this.$route.params.id;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/view/' + id).then(function (res) {
        if (res.data.status === 1) {
          _this.slip = res.data.data.slip;
          _this.orders = res.data.data.orders;
        } else {
          _this.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this.showError(__('could_not_load_slip_details'));
      });
    },
    dispatchSlip: function dispatchSlip() {
      var _this2 = this;
      this.$swal.fire({
        title: __('confirm_dispatch'),
        text: __('this_will_change_status_to_dispatched_and_update_all_assigned_orders_to_out_for_delivery'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: __('yes_dispatch_now'),
        cancelButtonText: __('cancel'),
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#858796'
      }).then(function (result) {
        if (result.isConfirmed) {
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this2.apiBase + '/loading_slips/dispatch', {
            id: _this2.slip.id
          }).then(function (res) {
            if (res.data.status === 1) {
              _this2.showMessage('success', res.data.message);
              _this2.getSlipDetails();
            } else {
              _this2.showError(res.data.message);
            }
          })["catch"](function (err) {
            _this2.showError(__('an_error_occurred_during_dispatch'));
          });
        }
      });
    },
    printSlip: function printSlip() {
      window.open(this.apiBase + '/loading_slips/print/' + this.slip.id, '_blank');
    },
    formatDate: function formatDate(dateStr) {
      return moment(dateStr).format('DD-MM-YYYY hh:mm A');
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.bg-soft-primary[data-v-6dc471e8] {\n    background-color: rgba(78, 115, 223, 0.1) !important;\n    color: #4e73df !important;\n}\n.bg-soft-info[data-v-6dc471e8] {\n    background-color: rgba(54, 185, 204, 0.1) !important;\n    color: #36b9cc !important;\n}\n.bg-soft-success[data-v-6dc471e8] {\n    background-color: rgba(28, 200, 138, 0.1) !important;\n    color: #1cc88a !important;\n}\n.bg-soft-warning[data-v-6dc471e8] {\n    background-color: rgba(246, 194, 62, 0.1) !important;\n    color: #f6c23e !important;\n}\n.bg-soft-secondary[data-v-6dc471e8] {\n    background-color: rgba(133, 135, 150, 0.1) !important;\n    color: #858796 !important;\n}\n.avatar-circle[data-v-6dc471e8] {\n    width: 45px;\n    height: 45px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 18px;\n    font-weight: bold;\n}\n.timeline-step[data-v-6dc471e8] {\n    position: relative;\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n}\n.step-circle[data-v-6dc471e8] {\n    width: 32px;\n    height: 32px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 14px;\n    z-index: 2;\n}\n.step-line[data-v-6dc471e8] {\n    position: absolute;\n    top: 32px;\n    bottom: -24px;\n    width: 2px;\n    background-color: #e3e6f0;\n    z-index: 1;\n}\n.gap-2[data-v-6dc471e8] {\n    gap: 0.5rem;\n}\n.rounded-pill[data-v-6dc471e8] {\n    border-radius: 50rem !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Logistics/ViewLoadingSlip.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/Logistics/ViewLoadingSlip.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true */ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true");
/* harmony import */ var _ViewLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewLoadingSlip.vue?vue&type=script&lang=js */ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js");
/* harmony import */ var _ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css */ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ViewLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "6dc471e8",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Logistics/ViewLoadingSlip.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewLoadingSlip.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true":
/*!****************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true ***!
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
  return _vm.slip
    ? _c("div", { staticClass: "container-fluid py-4" }, [
        _c("div", { staticClass: "row align-items-center mb-4" }, [
          _c("div", { staticClass: "col" }, [
            _c("h1", { staticClass: "h3 font-weight-bold mb-1" }, [
              _c("i", { staticClass: "fa fa-info-circle text-primary mr-2" }),
              _vm._v(
                _vm._s(_vm.__("loading_slip")) +
                  ": " +
                  _vm._s(_vm.slip.slip_no) +
                  "\n            "
              ),
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "text-muted mb-0" }, [
              _vm._v(
                _vm._s(
                  _vm.__(
                    "detailed_view_of_planned_route_sequence_loaded_goods_and_vehicle_status"
                  )
                )
              ),
            ]),
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "col-auto d-flex gap-2" },
            [
              _c(
                "router-link",
                {
                  staticClass:
                    "btn btn-outline-secondary font-weight-bold rounded-pill",
                  attrs: { to: _vm.urlPrefix + "/loading_slips" },
                },
                [
                  _c("i", { staticClass: "fa fa-arrow-left mr-2" }),
                  _vm._v(_vm._s(_vm.__("back_to_slips")) + "\n            "),
                ]
              ),
              _vm._v(" "),
              _c(
                "button",
                {
                  staticClass:
                    "btn btn-secondary font-weight-bold rounded-pill",
                  on: { click: _vm.printSlip },
                },
                [
                  _c("i", { staticClass: "fa fa-print mr-2" }),
                  _vm._v(_vm._s(_vm.__("print_slip")) + "\n            "),
                ]
              ),
              _vm._v(" "),
              _vm.slip.status == 0
                ? _c(
                    "button",
                    {
                      staticClass:
                        "btn btn-success font-weight-bold rounded-pill",
                      on: { click: _vm.dispatchSlip },
                    },
                    [
                      _c("i", { staticClass: "fa fa-send mr-2" }),
                      _vm._v(_vm._s(_vm.__("dispatch_run")) + "\n            "),
                    ]
                  )
                : _vm._e(),
            ],
            1
          ),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-lg-4 mb-4" }, [
            _c(
              "div",
              {
                staticClass:
                  "card border-0 shadow-sm rounded-lg mb-4 text-center p-4",
                class:
                  _vm.slip.status == 0 ? "bg-soft-warning" : "bg-soft-success",
              },
              [
                _c(
                  "div",
                  { staticClass: "h6 font-weight-bold text-uppercase mb-1" },
                  [_vm._v(_vm._s(_vm.__("distribution_status")))]
                ),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticClass: "h3 font-weight-bold mb-0",
                    class:
                      _vm.slip.status == 0 ? "text-warning" : "text-success",
                  },
                  [
                    _c("i", {
                      class:
                        _vm.slip.status == 0 ? "fa fa-clock-o" : "fa fa-truck",
                    }),
                    _vm._v(
                      "\n                    " +
                        _vm._s(
                          _vm.slip.status == 0
                            ? _vm.__("planned")
                            : _vm.__("dispatched")
                        ) +
                        "\n                "
                    ),
                  ]
                ),
                _vm._v(" "),
                _vm.slip.status == 0
                  ? _c("p", { staticClass: "text-muted mt-2 mb-0 small" }, [
                      _vm._v(
                        _vm._s(
                          _vm.__(
                            "warehouse_operations_are_active_ready_for_driver_loading"
                          )
                        )
                      ),
                    ])
                  : _c("p", { staticClass: "text-muted mt-2 mb-0 small" }, [
                      _vm._v(
                        _vm._s(
                          _vm.__(
                            "the_vehicle_is_currently_on_the_delivery_route"
                          )
                        )
                      ),
                    ]),
              ]
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "card border-0 shadow-sm rounded-lg mb-4" },
              [
                _c("div", { staticClass: "card-header border-0 py-3" }, [
                  _c("h6", { staticClass: "m-0 font-weight-bold" }, [
                    _vm._v(_vm._s(_vm.__("vehicle_information"))),
                  ]),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "card-body pt-0" }, [
                  _c("div", { staticClass: "d-flex align-items-center mb-3" }, [
                    _vm._m(0),
                    _vm._v(" "),
                    _c("div", [
                      _vm.slip.vehicle
                        ? _c("div", { staticClass: "font-weight-bold" }, [
                            _vm._v(_vm._s(_vm.slip.vehicle.name)),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.slip.vehicle
                        ? _c(
                            "span",
                            {
                              staticClass:
                                "badge bg-soft-secondary font-weight-bold border",
                            },
                            [_vm._v(_vm._s(_vm.slip.vehicle.vehicle_number))]
                          )
                        : _vm._e(),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "border-top pt-3" }, [
                    _c(
                      "div",
                      { staticClass: "d-flex justify-content-between mb-2" },
                      [
                        _c("span", { staticClass: "text-muted" }, [
                          _vm._v(
                            _vm._s(_vm.__("total_allowed_capacity")) + ":"
                          ),
                        ]),
                        _vm._v(" "),
                        _vm.slip.vehicle
                          ? _c("span", { staticClass: "font-weight-bold" }, [
                              _vm._v(
                                _vm._s(_vm.slip.vehicle.capacity) +
                                  " " +
                                  _vm._s(_vm.__("kg"))
                              ),
                            ])
                          : _vm._e(),
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "d-flex justify-content-between mb-2" },
                      [
                        _c("span", { staticClass: "text-muted" }, [
                          _vm._v(_vm._s(_vm.__("allocated_run_weight")) + ":"),
                        ]),
                        _vm._v(" "),
                        _c("span", { staticClass: "font-weight-bold" }, [
                          _vm._v(
                            _vm._s(_vm.slip.total_weight) +
                              " " +
                              _vm._s(_vm.__("kg"))
                          ),
                        ]),
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "d-flex justify-content-between" },
                      [
                        _c("span", { staticClass: "text-muted" }, [
                          _vm._v(_vm._s(_vm.__("used_capacity_ratio")) + ":"),
                        ]),
                        _vm._v(" "),
                        _vm.slip.vehicle
                          ? _c(
                              "span",
                              {
                                staticClass: "font-weight-bold",
                                class: _vm.loadRatioClass,
                              },
                              [
                                _vm._v(
                                  _vm._s(_vm.loadRatioPercent.toFixed(1)) + "%"
                                ),
                              ]
                            )
                          : _vm._e(),
                      ]
                    ),
                  ]),
                ]),
              ]
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "card border-0 shadow-sm rounded-lg mb-4" },
              [
                _c("div", { staticClass: "card-header border-0 py-3" }, [
                  _c("h6", { staticClass: "m-0 font-weight-bold" }, [
                    _vm._v(_vm._s(_vm.__("driver_information"))),
                  ]),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "card-body pt-0" }, [
                  _vm.slip.driver
                    ? _c(
                        "div",
                        { staticClass: "d-flex align-items-center mb-3" },
                        [
                          _vm._m(1),
                          _vm._v(" "),
                          _c("div", [
                            _c("div", { staticClass: "font-weight-bold" }, [
                              _vm._v(_vm._s(_vm.slip.driver.name)),
                            ]),
                            _vm._v(" "),
                            _c("small", { staticClass: "text-muted" }, [
                              _vm._v(_vm._s(_vm.slip.driver.mobile)),
                            ]),
                          ]),
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.slip.driver
                    ? _c("div", { staticClass: "border-top pt-3" }, [
                        _c(
                          "div",
                          {
                            staticClass: "d-flex justify-content-between mb-2",
                          },
                          [
                            _c("span", { staticClass: "text-muted" }, [
                              _vm._v(
                                _vm._s(_vm.__("license_plate_number")) + ":"
                              ),
                            ]),
                            _vm._v(" "),
                            _c("span", { staticClass: "font-weight-bold" }, [
                              _vm._v(
                                _vm._s(
                                  _vm.slip.driver.license_plate ||
                                    _vm.__("active_rider")
                                )
                              ),
                            ]),
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "d-flex justify-content-between" },
                          [
                            _c("span", { staticClass: "text-muted" }, [
                              _vm._v(_vm._s(_vm.__("run_date")) + ":"),
                            ]),
                            _vm._v(" "),
                            _c("span", { staticClass: "font-weight-bold" }, [
                              _vm._v(
                                _vm._s(_vm.formatDate(_vm.slip.created_at))
                              ),
                            ]),
                          ]
                        ),
                      ])
                    : _vm._e(),
                ]),
              ]
            ),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-lg-8 mb-4" }, [
            _c("div", { staticClass: "card border-0 shadow-sm rounded-lg" }, [
              _c("div", { staticClass: "card-header border-0 py-3" }, [
                _c("h6", { staticClass: "m-0 font-weight-bold" }, [
                  _vm._v(
                    _vm._s(_vm.__("logical_route_sequence_optimized_proximity"))
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "card-body p-0" }, [
                _c(
                  "div",
                  { staticClass: "timeline p-4" },
                  _vm._l(_vm.orders, function (order, idx) {
                    return _c(
                      "div",
                      {
                        key: order.id,
                        staticClass: "timeline-item mb-4 d-flex",
                      },
                      [
                        _c(
                          "div",
                          {
                            staticClass: "timeline-step",
                            staticStyle: { "margin-right": "25px !important" },
                          },
                          [
                            _c(
                              "div",
                              {
                                staticClass:
                                  "step-circle bg-primary text-white font-weight-bold",
                              },
                              [_vm._v(_vm._s(idx + 1))]
                            ),
                            _vm._v(" "),
                            idx < _vm.orders.length - 1
                              ? _c("div", { staticClass: "step-line" })
                              : _vm._e(),
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass:
                              "card border w-100 rounded-lg overflow-hidden shadow-none",
                          },
                          [
                            _c("div", { staticClass: "card-body py-3" }, [
                              _c(
                                "div",
                                { staticClass: "row align-items-center" },
                                [
                                  _c("div", { staticClass: "col" }, [
                                    _c(
                                      "div",
                                      {
                                        staticClass:
                                          "d-flex align-items-center gap-2 mb-1",
                                      },
                                      [
                                        _c(
                                          "h5",
                                          {
                                            staticClass:
                                              "h6 font-weight-bold mb-0",
                                          },
                                          [
                                            _vm._v(
                                              _vm._s(_vm.__("stop")) +
                                                ": " +
                                                _vm._s(order.user_name)
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "span",
                                          { staticClass: "badge bg-soft-info" },
                                          [
                                            _vm._v(
                                              _vm._s(_vm.__("order")) +
                                                " #" +
                                                _vm._s(order.id)
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "p",
                                      {
                                        staticClass: "text-muted text-sm mb-2",
                                      },
                                      [
                                        _c("i", {
                                          staticClass:
                                            "fa fa-map-marker mr-1 text-danger",
                                        }),
                                        _vm._v(_vm._s(order.customer_address)),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    order.items && order.items.length > 0
                                      ? _c(
                                          "div",
                                          {
                                            staticClass:
                                              "border p-2 rounded small",
                                          },
                                          [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "font-weight-bold mb-1 border-bottom pb-1",
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__("items_to_unload")
                                                  ) + ":"
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _vm._l(
                                              order.items,
                                              function (item) {
                                                return _c(
                                                  "div",
                                                  {
                                                    key: item.id,
                                                    staticClass:
                                                      "d-flex justify-content-between",
                                                  },
                                                  [
                                                    _c("span", [
                                                      _vm._v(
                                                        _vm._s(
                                                          item.product_name
                                                        ) +
                                                          " (" +
                                                          _vm._s(
                                                            item.variant_name
                                                          ) +
                                                          ")"
                                                      ),
                                                    ]),
                                                    _vm._v(" "),
                                                    _c(
                                                      "span",
                                                      {
                                                        staticClass:
                                                          "font-weight-bold",
                                                      },
                                                      [
                                                        _vm._v(
                                                          "x" +
                                                            _vm._s(
                                                              item.quantity
                                                            )
                                                        ),
                                                      ]
                                                    ),
                                                  ]
                                                )
                                              }
                                            ),
                                          ],
                                          2
                                        )
                                      : _vm._e(),
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "col-auto text-right border-left pl-4",
                                    },
                                    [
                                      _c(
                                        "div",
                                        {
                                          staticClass:
                                            "text-xs font-weight-bold text-muted text-uppercase mb-1",
                                        },
                                        [_vm._v(_vm._s(_vm.__("stop_value")))]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        {
                                          staticClass:
                                            "h6 font-weight-bold mb-2",
                                        },
                                        [
                                          _vm._v(
                                            "₹" + _vm._s(order.final_total)
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        {
                                          staticClass:
                                            "text-xs font-weight-bold text-muted text-uppercase mb-1",
                                        },
                                        [_vm._v(_vm._s(_vm.__("weight")))]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        { staticClass: "font-weight-bold" },
                                        [
                                          _vm._v(
                                            _vm._s(order.weight) +
                                              " " +
                                              _vm._s(_vm.__("kg"))
                                          ),
                                        ]
                                      ),
                                    ]
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
          ]),
        ]),
      ])
    : _vm._e()
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass: "avatar-circle bg-soft-primary",
        staticStyle: { "margin-right": "25px !important" },
      },
      [_c("i", { staticClass: "fa fa-truck text-primary" })]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass: "avatar-circle bg-soft-info",
        staticStyle: { "margin-right": "25px !important" },
      },
      [_c("i", { staticClass: "fa fa-user text-info" })]
    )
  },
]
render._withStripped = true



/***/ })

}]);