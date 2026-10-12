"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Seller_Schemes_Schemes_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************/
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
        key: 'type',
        label: __('type'),
        "class": 'text-center'
      }, {
        key: 'offer',
        label: __('offer'),
        "class": 'text-center'
      }, {
        key: 'period',
        label: __('period'),
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
      filter: null,
      filterOn: ['name'],
      schemes: [],
      isLoading: false
    };
  },
  created: function created() {
    this.getSchemes();
  },
  methods: {
    t: function t(key, fallback) {
      var val = this.__(key);
      return val && val !== key ? val : fallback || key;
    },
    // The search filters in the browser, so the footer count and pager follow the matching rows
    onFiltered: function onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    rangeText: function rangeText(page, perPage, total) {
      if (!total) return '';
      var from = (page - 1) * perPage + 1;
      var to = Math.min(page * perPage, total);
      return from + '-' + to + ' / ' + total;
    },
    getSchemes: function getSchemes() {
      var _this = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/schemes').then(function (response) {
        _this.isLoading = false;
        var data = response.data;
        if (data.status === 1) {
          _this.schemes = data.data;
          _this.totalRows = _this.schemes.length;
        }
      })["catch"](function (error) {
        _this.isLoading = false;
        _this.showError(_this.__('something_went_wrong'));
      });
    },
    deleteScheme: function deleteScheme(index, id) {
      var _this2 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_to_delete_this_scheme'),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: __('yes_delete_it'),
        cancelButtonText: __('cancel')
      }).then(function (result) {
        if (result.value) {
          _this2.isLoading = true;
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this2.$sellerApiUrl + '/schemes/delete', {
            id: id
          }).then(function (response) {
            _this2.isLoading = false;
            _this2.schemes.splice(index, 1);
            _this2.showMessage("success", response.data.message);
          })["catch"](function (error) {
            _this2.isLoading = false;
            _this2.showError(_this2.__('something_went_wrong'));
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Seller/Schemes/Schemes.vue":
/*!*******************************************************!*\
  !*** ./resources/js/views/Seller/Schemes/Schemes.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Schemes_vue_vue_type_template_id_402ff05c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Schemes.vue?vue&type=template&id=402ff05c */ "./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=template&id=402ff05c");
/* harmony import */ var _Schemes_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Schemes.vue?vue&type=script&lang=js */ "./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Schemes_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Schemes_vue_vue_type_template_id_402ff05c__WEBPACK_IMPORTED_MODULE_0__.render,
  _Schemes_vue_vue_type_template_id_402ff05c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Seller/Schemes/Schemes.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Schemes_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Schemes.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Schemes_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=template&id=402ff05c":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=template&id=402ff05c ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Schemes_vue_vue_type_template_id_402ff05c__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Schemes_vue_vue_type_template_id_402ff05c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Schemes_vue_vue_type_template_id_402ff05c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Schemes.vue?vue&type=template&id=402ff05c */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=template&id=402ff05c");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=template&id=402ff05c":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/Schemes/Schemes.vue?vue&type=template&id=402ff05c ***!
  \****************************************************************************************************************************************************************************************************************************/
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
          _vm._v(_vm._s(_vm.__("schemes"))),
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
              to: "/seller/schemes/create",
              title: _vm.__("add_scheme"),
            },
          },
          [
            _c("i", {
              staticClass: "fa fa-plus",
              attrs: { "aria-hidden": "true" },
            }),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.__("add_scheme")))]),
          ]
        ),
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "ui-filters" }, [
      _c("div", { staticClass: "ui-search" }, [
        _c("i", {
          staticClass: "fa fa-search",
          attrs: { "aria-hidden": "true" },
        }),
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
          attrs: {
            id: "filter-input",
            type: "text",
            placeholder: _vm.__("search"),
            "aria-label": _vm.__("search"),
          },
          domProps: { value: _vm.filter },
          on: {
            input: function ($event) {
              if ($event.target.composing) {
                return
              }
              _vm.filter = $event.target.value
            },
          },
        }),
        _vm._v(" "),
        _vm.filter
          ? _c(
              "button",
              {
                staticClass: "ui-search__clear",
                attrs: { type: "button", title: _vm.__("Clear") },
                on: {
                  click: function ($event) {
                    _vm.filter = null
                  },
                },
              },
              [_c("i", { staticClass: "fa fa-times" })]
            )
          : _vm._e(),
      ]),
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
          staticClass: "ui-iconbtn",
          attrs: { type: "button", title: _vm.__("refresh") },
          on: {
            click: function ($event) {
              return _vm.getSchemes()
            },
          },
        },
        [
          _c("i", {
            staticClass: "fa fa-sync-alt",
            class: { "fa-spin": _vm.isLoading },
            attrs: { "aria-hidden": "true" },
          }),
        ]
      ),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "list-surface" }, [
      _c(
        "div",
        { staticClass: "table-responsive" },
        [
          _c("b-table", {
            attrs: {
              items: _vm.schemes,
              fields: _vm.fields,
              "current-page": _vm.currentPage,
              "per-page": _vm.perPage,
              filter: _vm.filter,
              "filter-included-fields": _vm.filterOn,
              bordered: false,
              borderless: "",
              hover: "",
              busy: _vm.isLoading,
              stacked: "md",
              "show-empty": "",
            },
            on: { filtered: _vm.onFiltered },
            scopedSlots: _vm._u([
              {
                key: "table-busy",
                fn: function () {
                  return [
                    _c(
                      "div",
                      { staticClass: "ui-busy" },
                      [
                        _c("b-spinner", {
                          staticClass: "align-middle",
                          attrs: { small: "" },
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
                key: "empty",
                fn: function () {
                  return [
                    _c("div", { staticClass: "ui-empty" }, [
                      _c("div", { staticClass: "ui-empty__icon" }, [
                        _c("i", { staticClass: "fa fa-gift" }),
                      ]),
                      _vm._v(" "),
                      _c("h3", [_vm._v(_vm._s(_vm.__("No schemes found")))]),
                      _vm._v(" "),
                      _c("p", [
                        _vm._v(
                          _vm._s(_vm.__("Schemes you add will show up here."))
                        ),
                      ]),
                    ]),
                  ]
                },
                proxy: true,
              },
              {
                key: "emptyfiltered",
                fn: function () {
                  return [
                    _c("div", { staticClass: "ui-empty" }, [
                      _c("div", { staticClass: "ui-empty__icon" }, [
                        _c("i", { staticClass: "fa fa-gift" }),
                      ]),
                      _vm._v(" "),
                      _c("h3", [_vm._v(_vm._s(_vm.__("No schemes found")))]),
                      _vm._v(" "),
                      _c("p", [
                        _vm._v(
                          _vm._s(
                            _vm.__(
                              "Nothing matches this search. Try changing or clearing it."
                            )
                          )
                        ),
                      ]),
                      _vm._v(" "),
                      _c(
                        "button",
                        {
                          staticClass: "ui-btn",
                          attrs: { type: "button" },
                          on: {
                            click: function ($event) {
                              _vm.filter = null
                            },
                          },
                        },
                        [
                          _c("i", { staticClass: "fa fa-times" }),
                          _vm._v(
                            " " +
                              _vm._s(_vm.__("Clear search")) +
                              "\n                        "
                          ),
                        ]
                      ),
                    ]),
                  ]
                },
                proxy: true,
              },
              {
                key: "cell(id)",
                fn: function (row) {
                  return [
                    _c("span", { staticClass: "ui-id" }, [
                      _vm._v("#" + _vm._s(row.item.id)),
                    ]),
                  ]
                },
              },
              {
                key: "cell(name)",
                fn: function (row) {
                  return [
                    _c("strong", { staticClass: "ui-strong" }, [
                      _vm._v(_vm._s(row.item.name)),
                    ]),
                  ]
                },
              },
              {
                key: "cell(type)",
                fn: function (row) {
                  return [
                    row.item.type === "buy_x_get_y"
                      ? _c("span", { staticClass: "badge bg-info" }, [
                          _vm._v(_vm._s(_vm.__("buy_x_get_y"))),
                        ])
                      : row.item.type === "group_discount_qty"
                      ? _c(
                          "span",
                          { staticClass: "badge bg-warning text-dark" },
                          [_vm._v(_vm._s(_vm.__("group_discount_qty")))]
                        )
                      : _c("span", { staticClass: "badge bg-primary" }, [
                          _vm._v(_vm._s(_vm.__("group_discount_price"))),
                        ]),
                  ]
                },
              },
              {
                key: "cell(offer)",
                fn: function (row) {
                  return [
                    row.item.type === "buy_x_get_y"
                      ? [
                          _vm._v(
                            "\n                        " +
                              _vm._s(_vm.t("buy", "Buy")) +
                              " " +
                              _vm._s(row.item.buy_qty) +
                              " " +
                              _vm._s(
                                row.item.buy_qty_basis === "outer"
                                  ? "Outer"
                                  : row.item.buy_qty_basis === "inner"
                                  ? "Inner"
                                  : ""
                              ) +
                              " × " +
                              _vm._s(row.item.buy_product)
                          ),
                          _c("br"),
                          _vm._v(" "),
                          _c("strong", [
                            _vm._v(
                              _vm._s(_vm.t("get", "Get")) +
                                " " +
                                _vm._s(row.item.free_qty) +
                                " " +
                                _vm._s(
                                  row.item.free_qty_basis === "outer"
                                    ? "Outer"
                                    : row.item.free_qty_basis === "inner"
                                    ? "Inner"
                                    : ""
                                ) +
                                " × " +
                                _vm._s(row.item.free_product) +
                                " " +
                                _vm._s(_vm.t("free", "Free"))
                            ),
                          ]),
                        ]
                      : row.item.is_multi_combo
                      ? [
                          _c("div", { staticClass: "small mb-1 text-start" }, [
                            _c(
                              "span",
                              {
                                staticClass: "badge bg-primary text-white mb-1",
                              },
                              [
                                _c("i", {
                                  staticClass: "fa fa-layer-group me-1",
                                }),
                                _vm._v(
                                  " " +
                                    _vm._s(
                                      _vm.t(
                                        "multi_product_combo",
                                        "Multi-Product Combo"
                                      )
                                    )
                                ),
                              ]
                            ),
                            _vm._v(" "),
                            _c("div", [
                              _c("strong", [
                                _vm._v(_vm._s(row.item.combo_condition)),
                              ]),
                              _vm._v(" "),
                              _c(
                                "span",
                                { staticClass: "badge bg-success ms-1" },
                                [_vm._v(_vm._s(row.item.combo_reward))]
                              ),
                            ]),
                            _vm._v(" "),
                            _c(
                              "div",
                              { staticClass: "text-muted small mt-1" },
                              [
                                _vm._v(
                                  _vm._s(_vm.t("any_mix_of", "Any mix of")) +
                                    ": " +
                                    _vm._s(row.item.products.join(", "))
                                ),
                              ]
                            ),
                          ]),
                        ]
                      : row.item.products_detail &&
                        row.item.products_detail.length
                      ? _vm._l(row.item.products_detail, function (p, i) {
                          return _c(
                            "div",
                            {
                              key: "pd" + i,
                              staticClass: "small mb-1 text-start",
                            },
                            [
                              _c("strong", [_vm._v(_vm._s(p.product))]),
                              _vm._v(" "),
                              p.conditions
                                ? _c("span", { staticClass: "text-muted" }, [
                                    _vm._v(" (" + _vm._s(p.conditions) + ")"),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              p.reward
                                ? _c(
                                    "span",
                                    { staticClass: "badge bg-success ms-1" },
                                    [_vm._v(_vm._s(p.reward))]
                                  )
                                : _vm._e(),
                            ]
                          )
                        })
                      : [
                          _vm._l(row.item.products, function (p, i) {
                            return _c(
                              "span",
                              {
                                key: i,
                                staticClass: "badge bg-secondary me-1",
                              },
                              [_vm._v(_vm._s(p))]
                            )
                          }),
                          _c("br"),
                          _vm._v(" "),
                          _vm._l(row.item.slabs, function (s, i) {
                            return _c(
                              "small",
                              { key: "s" + i, staticClass: "d-block" },
                              [
                                _vm._v(
                                  "\n                            ≥ " +
                                    _vm._s(s.min_value) +
                                    _vm._s(
                                      row.item.type === "group_discount_qty"
                                        ? " units"
                                        : " ₹"
                                    ) +
                                    " → " +
                                    _vm._s(s.discount_value) +
                                    _vm._s(
                                      s.discount_type === "percentage"
                                        ? "%"
                                        : " ₹"
                                    ) +
                                    " " +
                                    _vm._s(_vm.__("off")) +
                                    "\n                        "
                                ),
                              ]
                            )
                          }),
                        ],
                  ]
                },
              },
              {
                key: "cell(period)",
                fn: function (row) {
                  return [
                    _c("span", { staticClass: "ui-nowrap" }, [
                      _vm._v(
                        _vm._s(row.item.start_date) +
                          " → " +
                          _vm._s(row.item.end_date)
                      ),
                    ]),
                  ]
                },
              },
              {
                key: "cell(status)",
                fn: function (row) {
                  return [
                    row.item.status == 1
                      ? _c("label", { staticClass: "badge bg-success" }, [
                          _vm._v(_vm._s(_vm.__("active"))),
                        ])
                      : _c("label", { staticClass: "badge bg-danger" }, [
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
                              to: {
                                name: "SellerEditScheme",
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
                                return _vm.deleteScheme(row.index, row.item.id)
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
          _c("span", { staticClass: "ui-count" }, [
            _vm._v(
              _vm._s(_vm.rangeText(_vm.currentPage, _vm.perPage, _vm.totalRows))
            ),
          ]),
          _vm._v(" "),
          _vm.totalRows > _vm.perPage
            ? _c("b-pagination", {
                staticClass: "list-pagination my-0",
                attrs: {
                  "total-rows": _vm.totalRows,
                  "per-page": _vm.perPage,
                  size: "sm",
                },
                model: {
                  value: _vm.currentPage,
                  callback: function ($$v) {
                    _vm.currentPage = $$v
                  },
                  expression: "currentPage",
                },
              })
            : _vm._e(),
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