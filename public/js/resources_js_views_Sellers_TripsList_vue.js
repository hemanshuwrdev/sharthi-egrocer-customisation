"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_TripsList_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'SellerTripsList',
  data: function data() {
    return {
      loading: false,
      rows: [],
      total: 0,
      page: 1,
      perPage: 15,
      filter: '',
      typeFilter: 'all',
      typeOptions: [{
        value: 'all',
        label: 'All'
      }, {
        value: 'driver',
        label: 'Driver'
      }, {
        value: 'salesman',
        label: 'Salesman'
      }]
    };
  },
  created: function created() {
    this.load();
  },
  methods: {
    setType: function setType(t) {
      this.typeFilter = t;
      this.page = 1;
      this.load();
    },
    load: function load() {
      var _this = this;
      this.loading = true;
      axios.get(this.$apiUrl + '/seller/trips', {
        params: {
          page: this.page,
          filter: this.filter,
          type: this.typeFilter
        }
      }).then(function (res) {
        var d = res.data.data;
        _this.rows = d.data || [];
        _this.total = d.total || _this.rows.length;
        _this.loading = false;
      })["catch"](function () {
        _this.loading = false;
      });
    },
    fmt: function fmt(val) {
      if (val == null) return '0.00';
      return parseFloat(val).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    settlementStatusClass: function settlementStatusClass(s) {
      return {
        open: 'bg-warning text-dark',
        locked: 'bg-info',
        reconciled: 'bg-success'
      }[s] || 'bg-secondary';
    },
    settlementStatusIcon: function settlementStatusIcon(s) {
      return {
        open: 'fa fa-clock-o',
        locked: 'fa fa-lock',
        reconciled: 'fa fa-check-circle'
      }[s] || 'fa fa-circle';
    },
    reconLabel: function reconLabel(s) {
      return {
        unreconciled: __('unreconciled'),
        partial_match: __('partial_match'),
        full_match: __('full_match'),
        overpaid: __('overpaid')
      }[s] || s;
    },
    reconIcon: function reconIcon(s) {
      return {
        unreconciled: 'fa fa-circle-o',
        partial_match: 'fa fa-exclamation-triangle',
        full_match: 'fa fa-check-circle',
        overpaid: 'fa fa-arrow-up'
      }[s] || 'fa fa-circle-o';
    },
    reconClass: function reconClass(s) {
      return {
        unreconciled: 'recon-pill--grey',
        partial_match: 'recon-pill--orange',
        full_match: 'recon-pill--green',
        overpaid: 'recon-pill--blue'
      }[s] || 'recon-pill--grey';
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.bg-purple[data-v-a90058fc] { background-color: #7c3aed !important; color: #fff !important;\n}\n.recon-pill[data-v-a90058fc] {\n    display: inline-flex; align-items: center;\n    font-size: 11px; font-weight: 700;\n    padding: 4px 10px; border-radius: 20px;\n}\n.recon-pill--grey[data-v-a90058fc]   { background: #f3f4f6; color: #6b7280;\n}\n.recon-pill--orange[data-v-a90058fc] { background: #fff7ed; color: #ea580c;\n}\n.recon-pill--green[data-v-a90058fc]  { background: #dcfce7; color: #16a34a;\n}\n.recon-pill--blue[data-v-a90058fc]   { background: #e0f2fe; color: #0284c7;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_style_index_0_id_a90058fc_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_style_index_0_id_a90058fc_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_style_index_0_id_a90058fc_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sellers/TripsList.vue":
/*!**************************************************!*\
  !*** ./resources/js/views/Sellers/TripsList.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TripsList_vue_vue_type_template_id_a90058fc_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TripsList.vue?vue&type=template&id=a90058fc&scoped=true */ "./resources/js/views/Sellers/TripsList.vue?vue&type=template&id=a90058fc&scoped=true");
/* harmony import */ var _TripsList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TripsList.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/TripsList.vue?vue&type=script&lang=js");
/* harmony import */ var _TripsList_vue_vue_type_style_index_0_id_a90058fc_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css */ "./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _TripsList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _TripsList_vue_vue_type_template_id_a90058fc_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _TripsList_vue_vue_type_template_id_a90058fc_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "a90058fc",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/TripsList.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/TripsList.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/views/Sellers/TripsList.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TripsList.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_style_index_0_id_a90058fc_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=style&index=0&id=a90058fc&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/TripsList.vue?vue&type=template&id=a90058fc&scoped=true":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/Sellers/TripsList.vue?vue&type=template&id=a90058fc&scoped=true ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_template_id_a90058fc_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_template_id_a90058fc_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TripsList_vue_vue_type_template_id_a90058fc_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TripsList.vue?vue&type=template&id=a90058fc&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=template&id=a90058fc&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=template&id=a90058fc&scoped=true":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripsList.vue?vue&type=template&id=a90058fc&scoped=true ***!
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
            _c("h3", [_vm._v(_vm._s(_vm.__("trip_reconciliation")))]),
            _vm._v(" "),
            _c("p", { staticClass: "text-subtitle text-muted" }, [
              _vm._v(_vm._s(_vm.__("all_trips"))),
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
                      _c(
                        "router-link",
                        { attrs: { to: "/seller/dashboard" } },
                        [_vm._v(_vm._s(_vm.__("dashboard")))]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("li", { staticClass: "breadcrumb-item active" }, [
                    _vm._v(_vm._s(_vm.__("trip_reconciliation"))),
                  ]),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c("section", { staticClass: "section" }, [
        _c("div", { staticClass: "card" }, [
          _c(
            "div",
            {
              staticClass:
                "card-header d-flex justify-content-between align-items-center flex-wrap gap-2",
            },
            [
              _c("h4", { staticClass: "card-title mb-0" }, [
                _vm._v(_vm._s(_vm.__("all_trips"))),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "d-flex gap-2 align-items-center flex-wrap" },
                [
                  _c(
                    "div",
                    {
                      staticClass: "btn-group btn-group-sm",
                      attrs: { role: "group" },
                    },
                    _vm._l(_vm.typeOptions, function (t) {
                      return _c(
                        "button",
                        {
                          key: t.value,
                          staticClass: "btn",
                          class:
                            _vm.typeFilter === t.value
                              ? "btn-primary"
                              : "btn-outline-secondary",
                          attrs: { type: "button" },
                          on: {
                            click: function ($event) {
                              return _vm.setType(t.value)
                            },
                          },
                        },
                        [
                          _vm._v(
                            "\n                                " +
                              _vm._s(t.label) +
                              "\n                            "
                          ),
                        ]
                      )
                    }),
                    0
                  ),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.filter,
                        expression: "filter",
                      },
                    ],
                    staticClass: "form-control form-control-sm",
                    staticStyle: { "min-width": "200px" },
                    attrs: {
                      type: "text",
                      placeholder:
                        _vm.__("search") +
                        " " +
                        _vm.__("driver") +
                        " / " +
                        _vm.__("salesman"),
                    },
                    domProps: { value: _vm.filter },
                    on: {
                      input: [
                        function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.filter = $event.target.value
                        },
                        _vm.load,
                      ],
                    },
                  }),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-sm btn-outline-secondary",
                      on: { click: _vm.load },
                    },
                    [_c("i", { staticClass: "fa fa-refresh" })]
                  ),
                ]
              ),
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "card-body p-0" }, [
            _vm.loading
              ? _c(
                  "div",
                  { staticClass: "text-center py-5" },
                  [_c("b-spinner")],
                  1
                )
              : _vm.rows.length === 0
              ? _c("div", { staticClass: "text-center text-muted py-5" }, [
                  _c("i", { staticClass: "fa fa-users fa-2x mb-2 d-block" }),
                  _vm._v(
                    "\n                        " +
                      _vm._s(_vm.__("no_data_found")) +
                      "\n                    "
                  ),
                ])
              : _c("div", { staticClass: "table-responsive" }, [
                  _c(
                    "table",
                    { staticClass: "table table-hover align-middle mb-0" },
                    [
                      _c("thead", { staticClass: "table-light" }, [
                        _c("tr", [
                          _c("th", { staticClass: "ps-3" }, [
                            _vm._v(_vm._s(_vm.__("date"))),
                          ]),
                          _vm._v(" "),
                          _c("th", [_vm._v(_vm._s(_vm.__("type")))]),
                          _vm._v(" "),
                          _c("th", [_vm._v(_vm._s(_vm.__("driver_rider")))]),
                          _vm._v(" "),
                          _c("th", { staticClass: "text-end" }, [
                            _vm._v(_vm._s(_vm.__("cash"))),
                          ]),
                          _vm._v(" "),
                          _c("th", { staticClass: "text-center" }, [
                            _vm._v(_vm._s(_vm.__("status"))),
                          ]),
                          _vm._v(" "),
                          _c("th", { staticClass: "text-center" }, [
                            _vm._v(_vm._s(_vm.__("reconciliation_status"))),
                          ]),
                          _vm._v(" "),
                          _c("th", { staticClass: "text-center" }, [
                            _vm._v(_vm._s(_vm.__("actions"))),
                          ]),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "tbody",
                        _vm._l(_vm.rows, function (row) {
                          return _c("tr", { key: row.type + "_" + row.id }, [
                            _c("td", { staticClass: "ps-3" }, [
                              _c("span", { staticClass: "fw-bold" }, [
                                _vm._v(_vm._s(row.date)),
                              ]),
                            ]),
                            _vm._v(" "),
                            _c("td", [
                              _c(
                                "span",
                                {
                                  staticClass: "badge",
                                  class:
                                    row.type === "driver"
                                      ? "bg-info"
                                      : "bg-purple",
                                },
                                [
                                  _c("i", {
                                    staticClass: "me-1",
                                    class:
                                      row.type === "driver"
                                        ? "fa fa-truck"
                                        : "fa fa-user-tie",
                                  }),
                                  _vm._v(
                                    "\n                                            " +
                                      _vm._s(
                                        row.type === "driver"
                                          ? _vm.__("driver")
                                          : _vm.__("salesman")
                                      ) +
                                      "\n                                        "
                                  ),
                                ]
                              ),
                            ]),
                            _vm._v(" "),
                            _c("td", [
                              _c("div", { staticClass: "fw-semibold" }, [
                                _vm._v(_vm._s(row.person_name)),
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "text-muted small" }, [
                                _vm._v(_vm._s(row.person_mobile)),
                              ]),
                            ]),
                            _vm._v(" "),
                            _c("td", { staticClass: "text-end" }, [
                              _c("span", { staticClass: "fw-bold" }, [
                                _vm._v(
                                  _vm._s(_vm.$currency) +
                                    " " +
                                    _vm._s(_vm.fmt(row.total_cash))
                                ),
                              ]),
                              _vm._v(" "),
                              row.total_upi > 0 || row.total_cheque > 0
                                ? _c(
                                    "div",
                                    { staticClass: "text-muted small" },
                                    [
                                      _vm._v(
                                        "\n                                            + " +
                                          _vm._s(_vm.$currency) +
                                          " " +
                                          _vm._s(
                                            _vm.fmt(
                                              (row.total_upi || 0) +
                                                (row.total_cheque || 0) +
                                                (row.total_signature || 0)
                                            )
                                          ) +
                                          " digital\n                                        "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                            ]),
                            _vm._v(" "),
                            _c("td", { staticClass: "text-center" }, [
                              _c(
                                "span",
                                {
                                  staticClass: "badge",
                                  class: _vm.settlementStatusClass(row.status),
                                },
                                [
                                  _c("i", {
                                    staticClass: "me-1",
                                    class: _vm.settlementStatusIcon(row.status),
                                  }),
                                  _vm._v(
                                    "\n                                            " +
                                      _vm._s(row.status_text) +
                                      "\n                                        "
                                  ),
                                ]
                              ),
                            ]),
                            _vm._v(" "),
                            _c("td", { staticClass: "text-center" }, [
                              _c(
                                "span",
                                {
                                  staticClass: "recon-pill",
                                  class: _vm.reconClass(
                                    row.reconciliation_status || "unreconciled"
                                  ),
                                },
                                [
                                  _c("i", {
                                    staticClass: "me-1",
                                    class: _vm.reconIcon(
                                      row.reconciliation_status ||
                                        "unreconciled"
                                    ),
                                  }),
                                  _vm._v(
                                    "\n                                            " +
                                      _vm._s(
                                        _vm.reconLabel(
                                          row.reconciliation_status ||
                                            "unreconciled"
                                        )
                                      ) +
                                      "\n                                        "
                                  ),
                                ]
                              ),
                            ]),
                            _vm._v(" "),
                            _c(
                              "td",
                              { staticClass: "text-center" },
                              [
                                row.id
                                  ? _c(
                                      "router-link",
                                      {
                                        staticClass: "btn btn-sm",
                                        class:
                                          row.status === "reconciled"
                                            ? "btn-outline-success"
                                            : "btn-primary",
                                        attrs: {
                                          to: {
                                            path: "/seller/trips/" + row.id,
                                            query: { type: row.type },
                                          },
                                        },
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "me-1",
                                          class:
                                            row.status === "reconciled"
                                              ? "fa fa-check-circle"
                                              : "fa fa-retweet",
                                        }),
                                        _vm._v(
                                          "\n                                            " +
                                            _vm._s(
                                              row.status === "reconciled"
                                                ? _vm.__("view")
                                                : _vm.__("reconcile")
                                            ) +
                                            "\n                                        "
                                        ),
                                      ]
                                    )
                                  : _c(
                                      "span",
                                      { staticClass: "text-muted small" },
                                      [_vm._v("-")]
                                    ),
                              ],
                              1
                            ),
                          ])
                        }),
                        0
                      ),
                    ]
                  ),
                ]),
          ]),
          _vm._v(" "),
          _vm.total > _vm.perPage
            ? _c(
                "div",
                { staticClass: "card-footer py-2" },
                [
                  _c("b-pagination", {
                    staticClass: "mb-0",
                    attrs: {
                      "total-rows": _vm.total,
                      "per-page": _vm.perPage,
                      align: "right",
                    },
                    on: { input: _vm.load },
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
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);