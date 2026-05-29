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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        label: __('actions')
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
    },
    deleteRecord: function deleteRecord(index, id) {
      var _this2 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_to_be_able_to_revert_this'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (result.value) {
          _this2.isLoading = true;
          var postData = {
            id: id
          };
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this2.$apiUrl + '/products/delete', postData).then(function (response) {
            _this2.isLoading = false;
            var data = response.data;
            _this2.products.splice(index, 1);
            _this2.showSuccess(data.message);
          });
        }
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
    _c("div", { staticClass: "page-heading" }, [
      _c("div", { staticClass: "page-title" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _vm.type === "sold_out"
              ? _c("h3", [_vm._v(_vm._s(_vm.__("sold_out_products")))])
              : _vm._e(),
            _vm._v(" "),
            _vm.type === "low_stock"
              ? _c("h3", [_vm._v(_vm._s(_vm.__("low_stock_products")))])
              : _vm._e(),
            _vm._v(" "),
            _vm.type === "packet_products"
              ? _c("h3", [_vm._v(_vm._s(_vm.__("packet_products")))])
              : _vm._e(),
            _vm._v(" "),
            _vm.type === "loose_products"
              ? _c("h3", [_vm._v(_vm._s(_vm.__("loose_products")))])
              : _vm._e(),
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
                  _vm.type === "sold_out"
                    ? _c(
                        "li",
                        {
                          staticClass: "breadcrumb-item active",
                          attrs: { "aria-current": "page" },
                        },
                        [_vm._v(_vm._s(_vm.__("sold_out_products")))]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.type === "low_stock"
                    ? _c(
                        "li",
                        {
                          staticClass: "breadcrumb-item active",
                          attrs: { "aria-current": "page" },
                        },
                        [_vm._v(_vm._s(_vm.__("low_stock_products")))]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.type === "packet_products"
                    ? _c(
                        "li",
                        {
                          staticClass: "breadcrumb-item active",
                          attrs: { "aria-current": "page" },
                        },
                        [_vm._v(_vm._s(_vm.__("packet_products")))]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.type === "loose_products"
                    ? _c(
                        "li",
                        {
                          staticClass: "breadcrumb-item active",
                          attrs: { "aria-current": "page" },
                        },
                        [_vm._v(_vm._s(_vm.__("loose_products")))]
                      )
                    : _vm._e(),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c("section", { staticClass: "section" }, [
        _c("div", { staticClass: "card" }, [
          _c("div", { staticClass: "card-header" }, [
            _vm.type === "sold_out"
              ? _c("h4", { staticClass: "card-title" }, [
                  _vm._v(_vm._s(_vm.__("sold_out_products_list"))),
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.type === "low_stock"
              ? _c("h4", { staticClass: "card-title" }, [
                  _vm._v(_vm._s(_vm.__("low_stock_products_list"))),
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.type === "packet_products"
              ? _c("h4", { staticClass: "card-title" }, [
                  _vm._v(_vm._s(_vm.__("packet_stock_products_list"))),
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.type === "loose_products"
              ? _c("h4", { staticClass: "card-title" }, [
                  _vm._v(_vm._s(_vm.__("loose_stock_products_list"))),
                ])
              : _vm._e(),
            _vm._v(" "),
            _c(
              "span",
              { staticClass: "pull-right" },
              [
                _c(
                  "router-link",
                  {
                    staticClass: "btn btn-primary",
                    attrs: { to: "/manage_products/create" },
                  },
                  [_vm._v(_vm._s(_vm.__("add_product")))]
                ),
              ],
              1
            ),
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "card-body" },
            [
              _c(
                "b-row",
                { staticClass: "mb-2 justify-content-end" },
                [
                  _c(
                    "b-col",
                    { attrs: { md: "3", "offset-md": "5" } },
                    [
                      _c("h6", { staticClass: "box-title" }, [
                        _vm._v(_vm._s(_vm.__("search"))),
                      ]),
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
                    "b-col",
                    { staticClass: "text-center", attrs: { md: "1" } },
                    [
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
                    ]
                  ),
                ],
                1
              ),
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
                                _c("b-spinner", {
                                  staticClass: "align-middle",
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
                              { staticStyle: { width: "120px" } },
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
                                    staticClass: "btn btn-primary btn-sm",
                                    attrs: {
                                      to: {
                                        name: "ViewProduct",
                                        params: {
                                          id: row.item.id,
                                          record: row.item,
                                        },
                                      },
                                      title: _vm.__("view"),
                                    },
                                  },
                                  [_c("i", { staticClass: "fa fa-eye" })]
                                ),
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
                                    staticClass: "btn btn-success btn-sm",
                                    attrs: {
                                      to: {
                                        name: "EditProduct",
                                        params: {
                                          id: row.item.id,
                                          record: row.item,
                                        },
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
                                        rawName: "v-b-tooltip.hover",
                                        modifiers: { hover: true },
                                      },
                                    ],
                                    staticClass: "btn btn-danger btn-sm",
                                    attrs: { title: _vm.__("delete") },
                                    on: {
                                      click: function ($event) {
                                        return _vm.deleteRecord(
                                          row.index,
                                          row.item.product_variant_id
                                        )
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
                "b-row",
                [
                  _c(
                    "b-col",
                    { staticClass: "my-1", attrs: { md: "2" } },
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
                  _c(
                    "b-col",
                    {
                      staticClass: "my-1",
                      attrs: { md: "4", "offset-md": "6" },
                    },
                    [
                      _c("b-pagination", {
                        staticClass: "my-0",
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
                ],
                1
              ),
            ],
            1
          ),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);