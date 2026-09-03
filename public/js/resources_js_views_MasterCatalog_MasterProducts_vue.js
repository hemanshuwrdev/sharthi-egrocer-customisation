"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_MasterCatalog_MasterProducts_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************************/
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      fields: [{
        key: 'id',
        label: __('id'),
        "class": 'text-center',
        sortable: true
      }, {
        key: 'image',
        label: __('image'),
        "class": 'text-center'
      }, {
        key: 'name',
        label: __('name'),
        "class": 'text-center'
      }, {
        key: 'parent_company',
        label: __('parent_company'),
        "class": 'text-center'
      }, {
        key: 'brand',
        label: __('brand') ? __('brand').charAt(0).toUpperCase() + __('brand').slice(1) : 'Brand',
        "class": 'text-center'
      }, {
        key: 'variants_count',
        label: __('variants') ? __('variants').charAt(0).toUpperCase() + __('variants').slice(1) : 'Variants',
        "class": 'text-center'
      }, {
        key: 'status',
        label: __('status'),
        "class": 'text-center'
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      totalRows: 0,
      currentPage: 1,
      perPage: this.$perPage || 10,
      pageOptions: this.$pageOptions || [5, 10, 15, 20],
      filter: null,
      isLoading: false,
      products: []
    };
  },
  created: function created() {
    this.getRecords();
  },
  watch: {
    currentPage: function currentPage() {
      this.getRecords();
    },
    perPage: function perPage() {
      this.getRecords();
    }
  },
  methods: {
    getRecords: function getRecords() {
      var _this = this;
      this.isLoading = true;
      axios.get(this.$apiUrl + '/master_catalog/products', {
        params: {
          page: this.currentPage,
          per_page: this.perPage,
          filter: this.filter
        }
      }).then(function (response) {
        _this.isLoading = false;
        _this.products = response.data.data || [];
        _this.totalRows = response.data.total || 0;
      })["catch"](function () {
        _this.isLoading = false;
      });
    },
    deleteRecord: function deleteRecord(index, id) {
      var _this2 = this;
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
          _this2.isLoading = true;
          axios.post(_this2.$apiUrl + '/master_catalog/products/delete', {
            id: id
          }).then(function (response) {
            _this2.isLoading = false;
            _this2.products.splice(index, 1);
            _this2.showMessage('success', response.data.message);
          })["catch"](function () {
            _this2.isLoading = false;
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/MasterCatalog/MasterProducts.vue":
/*!*************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/MasterProducts.vue ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MasterProducts_vue_vue_type_template_id_01a33946__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MasterProducts.vue?vue&type=template&id=01a33946 */ "./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=template&id=01a33946");
/* harmony import */ var _MasterProducts_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MasterProducts.vue?vue&type=script&lang=js */ "./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MasterProducts_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MasterProducts_vue_vue_type_template_id_01a33946__WEBPACK_IMPORTED_MODULE_0__.render,
  _MasterProducts_vue_vue_type_template_id_01a33946__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/MasterCatalog/MasterProducts.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=script&lang=js":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=script&lang=js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProducts_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MasterProducts.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProducts_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=template&id=01a33946":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=template&id=01a33946 ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProducts_vue_vue_type_template_id_01a33946__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProducts_vue_vue_type_template_id_01a33946__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProducts_vue_vue_type_template_id_01a33946__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MasterProducts.vue?vue&type=template&id=01a33946 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=template&id=01a33946");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=template&id=01a33946":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProducts.vue?vue&type=template&id=01a33946 ***!
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
  return _c("div", { staticClass: "list-page" }, [
    _c(
      "div",
      { staticClass: "page-head" },
      [
        _c("h3", { staticClass: "page-head-title" }, [
          _vm._v(_vm._s(_vm.__("master_products"))),
        ]),
        _vm._v(" "),
        _c(
          "router-link",
          {
            staticClass:
              "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap",
            attrs: { to: "/master_catalog/products/create" },
          },
          [
            _c("i", {
              staticClass: "fa fa-plus",
              attrs: { "aria-hidden": "true" },
            }),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.__("add_master_product")))]),
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
              on: {
                input: function ($event) {
                  return _vm.getRecords()
                },
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
                return _vm.getRecords()
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
              bordered: true,
              busy: _vm.isLoading,
              stacked: "md",
              "show-empty": "",
              small: "",
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
                key: "cell(image)",
                fn: function (row) {
                  return [
                    !row.item.image
                      ? _c("p", [_vm._v(_vm._s(_vm.__("no_image")))])
                      : _c("img", {
                          attrs: {
                            src: _vm.$storageUrl + row.item.image,
                            height: "50",
                          },
                        }),
                  ]
                },
              },
              {
                key: "cell(parent_company)",
                fn: function (row) {
                  return [
                    _vm._v(
                      "\n                    " +
                        _vm._s(
                          row.item.parent_company
                            ? row.item.parent_company.name
                            : "-"
                        ) +
                        "\n                "
                    ),
                  ]
                },
              },
              {
                key: "cell(brand)",
                fn: function (row) {
                  return [
                    _vm._v(
                      "\n                    " +
                        _vm._s(row.item.brand ? row.item.brand.name : "-") +
                        "\n                "
                    ),
                  ]
                },
              },
              {
                key: "cell(variants_count)",
                fn: function (row) {
                  return [
                    _c("span", { staticClass: "badge bg-info" }, [
                      _vm._v(_vm._s(row.item.variants_count)),
                    ]),
                  ]
                },
              },
              {
                key: "cell(status)",
                fn: function (row) {
                  return [
                    row.item.status == 1
                      ? _c("span", { staticClass: "badge bg-success" }, [
                          _vm._v(_vm._s(_vm.__("active"))),
                        ])
                      : _c("span", { staticClass: "badge bg-danger" }, [
                          _vm._v(_vm._s(_vm.__("deactive"))),
                        ]),
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
                              to:
                                "/master_catalog/products/edit/" + row.item.id,
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
                            staticClass: "list-action-btn is-delete",
                            attrs: { title: _vm.__("delete") },
                            on: {
                              click: function ($event) {
                                return _vm.deleteRecord(row.index, row.item.id)
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