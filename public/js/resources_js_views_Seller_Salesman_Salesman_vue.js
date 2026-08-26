"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Seller_Salesman_Salesman_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      fields: [{
        key: 'id',
        label: __('id'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'name',
        label: __('name'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'email',
        label: __('email'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'mobile',
        label: __('mobile'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'brands',
        label: __('assigned_brands'),
        "class": 'text-center'
      }, {
        key: 'allow_payment_collection',
        label: __('payment_collection'),
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
      totalRows: 1,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: 'id',
      sortDesc: true,
      sortDirection: 'desc',
      filter: null,
      filterOn: [],
      page: 1,
      salesmen: [],
      availableBrands: [],
      isLoading: false
    };
  },
  computed: {
    sortOptions: function sortOptions() {
      return this.fields.filter(function (f) {
        return f.sortable;
      }).map(function (f) {
        return {
          text: f.label,
          value: f.key
        };
      });
    }
  },
  mounted: function mounted() {
    this.getBrands();
  },
  created: function created() {
    this.getSalesmen();
  },
  methods: {
    getBrands: function getBrands() {
      var _this = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/brands').then(function (response) {
        if (response.data.status === 1) {
          _this.availableBrands = response.data.data;
        }
      });
    },
    getBrandName: function getBrandName(id) {
      var brand = this.availableBrands.find(function (b) {
        return b.id == id;
      });
      return brand ? brand.name : id;
    },
    parseBrands: function parseBrands(value) {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      try {
        return JSON.parse(value) || [];
      } catch (e) {
        return [];
      }
    },
    getSalesmen: function getSalesmen() {
      var _this2 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/salesman').then(function (response) {
        _this2.isLoading = false;
        var data = response.data;
        if (data.status === 1) {
          _this2.salesmen = data.data;
          _this2.totalRows = _this2.salesmen.length;
        }
      })["catch"](function (error) {
        _this2.isLoading = false;
        _this2.showError(_this2.__('something_went_wrong'));
      });
    },
    deleteSalesman: function deleteSalesman(index, id) {
      var _this3 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_to_delete_this_salesman'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: __('yes_delete_it'),
        cancelButtonText: __('cancel')
      }).then(function (result) {
        if (result.value) {
          _this3.isLoading = true;
          var postData = {
            id: id
          };
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this3.$sellerApiUrl + '/salesman/delete', postData).then(function (response) {
            _this3.isLoading = false;
            var data = response.data;
            _this3.salesmen.splice(index, 1);
            _this3.showMessage("success", data.message);
          })["catch"](function (error) {
            _this3.isLoading = false;
            _this3.showError(_this3.__('something_went_wrong'));
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Seller/Salesman/Salesman.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/Seller/Salesman/Salesman.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Salesman_vue_vue_type_template_id_4b846cfe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Salesman.vue?vue&type=template&id=4b846cfe */ "./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=template&id=4b846cfe");
/* harmony import */ var _Salesman_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Salesman.vue?vue&type=script&lang=js */ "./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Salesman_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Salesman_vue_vue_type_template_id_4b846cfe__WEBPACK_IMPORTED_MODULE_0__.render,
  _Salesman_vue_vue_type_template_id_4b846cfe__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Seller/Salesman/Salesman.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Salesman_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Salesman.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Salesman_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=template&id=4b846cfe":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=template&id=4b846cfe ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Salesman_vue_vue_type_template_id_4b846cfe__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Salesman_vue_vue_type_template_id_4b846cfe__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Salesman_vue_vue_type_template_id_4b846cfe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Salesman.vue?vue&type=template&id=4b846cfe */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=template&id=4b846cfe");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=template&id=4b846cfe":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Salesman/Salesman.vue?vue&type=template&id=4b846cfe ***!
  \******************************************************************************************************************************************************************************************************************************/
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
          _vm._v(_vm._s(_vm.__("salesman"))),
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
              to: "/seller/salesman/create",
              title: _vm.__("add_salesman"),
            },
          },
          [
            _c("i", {
              staticClass: "fa fa-plus",
              attrs: { "aria-hidden": "true" },
            }),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.__("add_salesman")))]),
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
                return _vm.getSalesmen()
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
              items: _vm.salesmen,
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
                key: "cell(status)",
                fn: function (row) {
                  return [
                    row.item.status == 1
                      ? _c("label", { staticClass: "badge bg-success" }, [
                          _vm._v(_vm._s(_vm.__("active"))),
                        ])
                      : row.item.status == 0
                      ? _c("label", { staticClass: "badge bg-danger" }, [
                          _vm._v(_vm._s(_vm.__("deactive"))),
                        ])
                      : _vm._e(),
                  ]
                },
              },
              {
                key: "cell(allow_payment_collection)",
                fn: function (row) {
                  return [
                    row.item.allow_payment_collection == 1
                      ? _c("span", { staticClass: "badge bg-success" }, [
                          _vm._v(_vm._s(_vm.__("yes"))),
                        ])
                      : _c("span", { staticClass: "badge bg-danger" }, [
                          _vm._v(_vm._s(_vm.__("no"))),
                        ]),
                  ]
                },
              },
              {
                key: "cell(brands)",
                fn: function (row) {
                  return _vm._l(
                    _vm.parseBrands(row.item.brands),
                    function (brand) {
                      return _c(
                        "span",
                        { key: brand, staticClass: "badge bg-secondary me-1" },
                        [
                          _vm._v(
                            "\n                                    " +
                              _vm._s(_vm.getBrandName(brand)) +
                              "\n                                "
                          ),
                        ]
                      )
                    }
                  )
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
                                name: "SellerEditSalesman",
                                params: { id: row.item.id },
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
                            staticClass: "list-action-btn is-delete",
                            attrs: { title: _vm.__("delete") },
                            on: {
                              click: function ($event) {
                                return _vm.deleteSalesman(
                                  row.index,
                                  row.item.id
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