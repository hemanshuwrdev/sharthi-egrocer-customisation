"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_ProductInfo_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ProductInfo.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ProductInfo.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      category: "",
      // Same columns as Dashboard ProductInfo: id, product_id, seller_name, name, image, price, discounted_price, actions
      fields: [{
        key: 'product_variant_id',
        label: __('id'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'product_id',
        label: __('product_id'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'seller_name',
        label: __('seller_name'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'name',
        label: __('name'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'image',
        label: __('image'),
        "class": 'text-center'
      }, {
        key: 'price',
        label: __('price'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'discounted_price',
        label: __('discounted_price'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      isLoading: false,
      products: null,
      type: null
    };
  },
  created: function created() {
    this.type = this.$route.params.type;
    if (this.type) {
      this.getProducts();
    }
  },
  methods: {
    getProducts: function getProducts() {
      var _this = this;
      this.isLoading = true;
      var param = {
        "category": this.category,
        "type": this.type
      };
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/products/product_info', {
        params: param
      }).then(function (response) {
        _this.isLoading = false;
        _this.products = response.data.data.products;
        _this.totalRows = _this.products.length;
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Sellers/ProductInfo.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/Sellers/ProductInfo.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ProductInfo_vue_vue_type_template_id_30331313_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProductInfo.vue?vue&type=template&id=30331313&scoped=true */ "./resources/js/views/Sellers/ProductInfo.vue?vue&type=template&id=30331313&scoped=true");
/* harmony import */ var _ProductInfo_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProductInfo.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/ProductInfo.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ProductInfo_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ProductInfo_vue_vue_type_template_id_30331313_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ProductInfo_vue_vue_type_template_id_30331313_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "30331313",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/ProductInfo.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/ProductInfo.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/views/Sellers/ProductInfo.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductInfo_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductInfo.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ProductInfo.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductInfo_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/ProductInfo.vue?vue&type=template&id=30331313&scoped=true":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/Sellers/ProductInfo.vue?vue&type=template&id=30331313&scoped=true ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductInfo_vue_vue_type_template_id_30331313_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductInfo_vue_vue_type_template_id_30331313_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductInfo_vue_vue_type_template_id_30331313_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ProductInfo.vue?vue&type=template&id=30331313&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ProductInfo.vue?vue&type=template&id=30331313&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ProductInfo.vue?vue&type=template&id=30331313&scoped=true":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ProductInfo.vue?vue&type=template&id=30331313&scoped=true ***!
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
    _c("div", { staticClass: "list-page" }, [
      _c(
        "div",
        { staticClass: "page-head" },
        [
          _vm.type === "sold_out"
            ? _c("h3", { staticClass: "page-head-title" }, [
                _vm._v(_vm._s(_vm.__("sold_out_products_list"))),
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm.type === "low_stock"
            ? _c("h3", { staticClass: "page-head-title" }, [
                _vm._v(_vm._s(_vm.__("low_stock_products_list"))),
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm.type === "packet_products"
            ? _c("h3", { staticClass: "page-head-title" }, [
                _vm._v(_vm._s(_vm.__("packet_stock_products_list"))),
              ])
            : _vm._e(),
          _vm._v(" "),
          _vm.type === "loose_products"
            ? _c("h3", { staticClass: "page-head-title" }, [
                _vm._v(_vm._s(_vm.__("loose_stock_products_list"))),
              ])
            : _vm._e(),
          _vm._v(" "),
          _c(
            "router-link",
            {
              staticClass:
                "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap",
              attrs: { to: "/seller/manage_products/create" },
            },
            [
              _c("i", {
                staticClass: "fa fa-plus",
                attrs: { "aria-hidden": "true" },
              }),
              _vm._v(" "),
              _c("span", [_vm._v(_vm._s(_vm.__("add_product")))]),
            ]
          ),
        ],
        1
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
                  placeholder: _vm.__("search"),
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
                  return _vm.getProducts()
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
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "table-responsive" },
          [
            _c("b-table", {
              attrs: {
                items: _vm.products,
                fields: _vm.fields,
                "current-page": _vm.currentPage,
                "per-page": _vm.perPage,
                filter: _vm.filter,
                "filter-included-fields": _vm.filterOn,
                "sort-by": _vm.sortBy,
                "sort-desc": _vm.sortDesc,
                "sort-direction": _vm.sortDirection,
                bordered: true,
                busy: _vm.isLoading,
                stacked: "md",
                "show-empty": "",
                small: "",
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
                        { staticClass: "text-center text-black my-2" },
                        [
                          _c("b-spinner", { staticClass: "align-middle" }),
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
                  key: "cell(seller_name)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                                " +
                          _vm._s(row.item.seller_name) +
                          "\n                            "
                      ),
                    ]
                  },
                },
                {
                  key: "cell(image)",
                  fn: function (row) {
                    return [
                      row.item.image
                        ? _c("img", {
                            attrs: {
                              src: _vm.$storageUrl + row.item.image,
                              height: "50",
                            },
                          })
                        : _vm._e(),
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
                              staticClass: "list-action-btn is-view",
                              attrs: {
                                to: {
                                  name: "SellerMyProducts",
                                  query: {
                                    master_product_id: row.item.product_id,
                                  },
                                },
                                title: _vm.__("view_product"),
                              },
                            },
                            [_c("i", { staticClass: "fa fa-eye" })]
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
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);