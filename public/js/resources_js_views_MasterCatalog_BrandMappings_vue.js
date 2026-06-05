"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_MasterCatalog_BrandMappings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
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
        key: 'brand',
        label: __('brand'),
        "class": 'text-center'
      }, {
        key: 'seller',
        label: __('distributor'),
        "class": 'text-center'
      }, {
        key: 'cities',
        label: __('cities'),
        "class": 'text-center'
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      mappings: [],
      totalRows: 0,
      currentPage: 1,
      perPage: this.$perPage || 10,
      pageOptions: this.$pageOptions || [5, 10, 15, 20],
      filter: null,
      isLoading: false,
      isSaving: false,
      modalOpen: false,
      isEdit: false,
      form: {
        brand_id: null,
        seller_id: null,
        city_ids: []
      },
      brands: [],
      sellers: [],
      cities: []
    };
  },
  created: function created() {
    this.getRecords();
    this.fetchLookups();
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
      axios.get(this.$apiUrl + '/admin/brand-mappings', {
        params: {
          page: this.currentPage,
          per_page: this.perPage,
          filter: this.filter
        }
      }).then(function (res) {
        _this.isLoading = false;
        _this.mappings = res.data.data || [];
        _this.totalRows = res.data.total || 0;
      })["catch"](function () {
        _this.isLoading = false;
      });
    },
    fetchLookups: function fetchLookups() {
      var _this2 = this;
      axios.get(this.$apiUrl + '/products/brands/get').then(function (r) {
        _this2.brands = r.data.data || [];
      });
      axios.get(this.$apiUrl + '/sellers', {
        params: {
          per_page: 1000
        }
      }).then(function (r) {
        _this2.sellers = r.data.data || [];
      })["catch"](function () {});
      axios.get(this.$apiUrl + '/cities').then(function (r) {
        var payload = r.data && r.data.data ? r.data.data : null;
        _this2.cities = Array.isArray(payload) ? payload : payload && payload.cities ? payload.cities : [];
      });
    },
    openCreate: function openCreate() {
      this.isEdit = false;
      this.form = {
        brand_id: null,
        seller_id: null,
        city_ids: []
      };
      this.modalOpen = true;
    },
    openEdit: function openEdit(row) {
      var _this3 = this;
      this.isEdit = true;
      this.form = {
        brand_id: row.brand_id,
        seller_id: row.seller_id,
        city_ids: []
      };
      this.modalOpen = true;
      axios.get(this.$apiUrl + '/admin/brand-mappings/get', {
        params: {
          brand_id: row.brand_id,
          seller_id: row.seller_id
        }
      }).then(function (r) {
        _this3.form.city_ids = r.data.data && r.data.data.city_ids || [];
      });
    },
    save: function save() {
      var _this4 = this;
      if (!this.form.brand_id || !this.form.seller_id || !this.form.city_ids.length) {
        this.showError(__('select_brand_distributor_and_cities'));
        return;
      }
      this.isSaving = true;
      axios.post(this.$apiUrl + '/admin/brand-mappings', this.form).then(function (res) {
        _this4.isSaving = false;
        if (res.data.status) {
          _this4.showMessage('success', res.data.message);
          _this4.modalOpen = false;
          _this4.getRecords();
        } else {
          _this4.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this4.isSaving = false;
        var msg = err.response && err.response.data && err.response.data.message || __('something_went_wrong');
        _this4.showError(msg);
      });
    },
    deleteRecord: function deleteRecord(index, item) {
      var _this5 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('this_will_remove_distributor_access_to_this_brand'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (result.value) {
          axios.post(_this5.$apiUrl + '/admin/brand-mappings/delete', {
            brand_id: item.brand_id,
            seller_id: item.seller_id
          }).then(function (res) {
            _this5.showMessage('success', res.data.message);
            _this5.mappings.splice(index, 1);
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/MasterCatalog/BrandMappings.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/BrandMappings.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BrandMappings_vue_vue_type_template_id_16b318e5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BrandMappings.vue?vue&type=template&id=16b318e5 */ "./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=template&id=16b318e5");
/* harmony import */ var _BrandMappings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BrandMappings.vue?vue&type=script&lang=js */ "./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BrandMappings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BrandMappings_vue_vue_type_template_id_16b318e5__WEBPACK_IMPORTED_MODULE_0__.render,
  _BrandMappings_vue_vue_type_template_id_16b318e5__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/MasterCatalog/BrandMappings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BrandMappings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BrandMappings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BrandMappings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=template&id=16b318e5":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=template&id=16b318e5 ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BrandMappings_vue_vue_type_template_id_16b318e5__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BrandMappings_vue_vue_type_template_id_16b318e5__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BrandMappings_vue_vue_type_template_id_16b318e5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BrandMappings.vue?vue&type=template&id=16b318e5 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=template&id=16b318e5");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=template&id=16b318e5":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/BrandMappings.vue?vue&type=template&id=16b318e5 ***!
  \*********************************************************************************************************************************************************************************************************************************/
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
  return _c(
    "div",
    [
      _c("div", { staticClass: "page-heading" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("brand_distributor_mappings")))]),
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
                      _c("router-link", { attrs: { to: "/dashboard" } }, [
                        _vm._v(_vm._s(_vm.__("dashboard"))),
                      ]),
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
                    [_vm._v(_vm._s(_vm.__("brand_distributor_mappings")))]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12" }, [
          _c("div", { staticClass: "card" }, [
            _c("div", { staticClass: "card-header" }, [
              _c("h4", [_vm._v(_vm._s(_vm.__("brand_distributor_mappings")))]),
              _vm._v(" "),
              _c("span", { staticClass: "pull-right" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary",
                    on: { click: _vm.openCreate },
                  },
                  [
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.__("add_mapping")) +
                        "\n                        "
                    ),
                  ]
                ),
              ]),
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "card-body" },
              [
                _c(
                  "b-row",
                  { staticClass: "mb-2" },
                  [
                    _c(
                      "b-col",
                      { attrs: { md: "3", "offset-md": "8" } },
                      [
                        _c("h6", { staticClass: "box-title" }, [
                          _vm._v(_vm._s(_vm.__("search"))),
                        ]),
                        _vm._v(" "),
                        _c("b-form-input", {
                          attrs: {
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
                                return _vm.getRecords()
                              },
                            },
                          },
                          [_c("i", { staticClass: "fa fa-refresh" })]
                        ),
                      ]
                    ),
                  ],
                  1
                ),
                _vm._v(" "),
                _c("b-table", {
                  attrs: {
                    items: _vm.mappings,
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
                      key: "cell(brand)",
                      fn: function (row) {
                        return [
                          _vm._v(
                            "\n                            " +
                              _vm._s(
                                row.item.brand ? row.item.brand.name : "-"
                              ) +
                              "\n                            "
                          ),
                          row.item.brand &&
                          row.item.brand.is_overlap_allowed == 1
                            ? _c(
                                "span",
                                { staticClass: "badge bg-info ms-2" },
                                [_vm._v(_vm._s(_vm.__("overlap_allowed")))]
                              )
                            : _vm._e(),
                        ]
                      },
                    },
                    {
                      key: "cell(seller)",
                      fn: function (row) {
                        return [
                          _vm._v(
                            "\n                            " +
                              _vm._s(
                                row.item.seller
                                  ? row.item.seller.store_name
                                  : "-"
                              ) +
                              "\n                        "
                          ),
                        ]
                      },
                    },
                    {
                      key: "cell(cities)",
                      fn: function (row) {
                        return [
                          _vm._l(row.item.cities, function (c) {
                            return _c(
                              "span",
                              {
                                key: c.id,
                                staticClass: "badge bg-secondary me-1",
                              },
                              [_vm._v(_vm._s(c.name))]
                            )
                          }),
                          _vm._v(" "),
                          _c(
                            "span",
                            { staticClass: "badge bg-light text-dark" },
                            [
                              _vm._v(
                                _vm._s(row.item.city_count) +
                                  " " +
                                  _vm._s(_vm.__("cities"))
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
                              directives: [
                                {
                                  name: "b-tooltip",
                                  rawName: "v-b-tooltip.hover",
                                  modifiers: { hover: true },
                                },
                              ],
                              staticClass: "btn btn-sm btn-primary",
                              attrs: { title: _vm.__("edit") },
                              on: {
                                click: function ($event) {
                                  return _vm.openEdit(row.item)
                                },
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
                              staticClass: "btn btn-sm btn-danger",
                              attrs: { title: _vm.__("delete") },
                              on: {
                                click: function ($event) {
                                  return _vm.deleteRecord(row.index, row.item)
                                },
                              },
                            },
                            [_c("i", { staticClass: "fa fa-trash" })]
                          ),
                        ]
                      },
                    },
                  ]),
                }),
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
                        _c("label", [
                          _vm._v(
                            _vm._s(_vm.__("total_records")) +
                              " :- " +
                              _vm._s(_vm.totalRows)
                          ),
                        ]),
                        _vm._v(" "),
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
      _vm._v(" "),
      _c(
        "b-modal",
        {
          attrs: {
            title: _vm.isEdit ? _vm.__("edit_mapping") : _vm.__("add_mapping"),
            "hide-footer": "",
            "no-close-on-backdrop": "",
          },
          model: {
            value: _vm.modalOpen,
            callback: function ($$v) {
              _vm.modalOpen = $$v
            },
            expression: "modalOpen",
          },
        },
        [
          _c(
            "form",
            {
              on: {
                submit: function ($event) {
                  $event.preventDefault()
                  return _vm.save.apply(null, arguments)
                },
              },
            },
            [
              _c("div", { staticClass: "form-group mb-3" }, [
                _c("label", { staticClass: "required" }, [
                  _vm._v(_vm._s(_vm.__("brand"))),
                ]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.form.brand_id,
                        expression: "form.brand_id",
                      },
                    ],
                    staticClass: "form-control",
                    attrs: { disabled: _vm.isEdit, required: "" },
                    on: {
                      change: function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.$set(
                          _vm.form,
                          "brand_id",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  [
                    _c("option", { domProps: { value: null } }, [
                      _vm._v("-- " + _vm._s(_vm.__("select")) + " --"),
                    ]),
                    _vm._v(" "),
                    _vm._l(_vm.brands, function (b) {
                      return _c(
                        "option",
                        { key: b.id, domProps: { value: b.id } },
                        [_vm._v(_vm._s(b.name))]
                      )
                    }),
                  ],
                  2
                ),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group mb-3" }, [
                _c("label", { staticClass: "required" }, [
                  _vm._v(_vm._s(_vm.__("distributor"))),
                ]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.form.seller_id,
                        expression: "form.seller_id",
                      },
                    ],
                    staticClass: "form-control",
                    attrs: { disabled: _vm.isEdit, required: "" },
                    on: {
                      change: function ($event) {
                        var $$selectedVal = Array.prototype.filter
                          .call($event.target.options, function (o) {
                            return o.selected
                          })
                          .map(function (o) {
                            var val = "_value" in o ? o._value : o.value
                            return val
                          })
                        _vm.$set(
                          _vm.form,
                          "seller_id",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  [
                    _c("option", { domProps: { value: null } }, [
                      _vm._v("-- " + _vm._s(_vm.__("select")) + " --"),
                    ]),
                    _vm._v(" "),
                    _vm._l(_vm.sellers, function (s) {
                      return _c(
                        "option",
                        { key: s.id, domProps: { value: s.id } },
                        [_vm._v(_vm._s(s.store_name))]
                      )
                    }),
                  ],
                  2
                ),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group mb-3" }, [
                _c("label", { staticClass: "required" }, [
                  _vm._v(_vm._s(_vm.__("cities"))),
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  {
                    staticStyle: {
                      "max-height": "240px",
                      "overflow-y": "auto",
                      border: "1px solid #ddd",
                      "border-radius": "4px",
                      padding: "8px",
                    },
                  },
                  [
                    !_vm.cities.length
                      ? _c("div", { staticClass: "text-muted" }, [
                          _vm._v(_vm._s(_vm.__("loading")) + "..."),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _vm._l(_vm.cities, function (c) {
                      return _c(
                        "div",
                        { key: c.id, staticClass: "form-check" },
                        [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.form.city_ids,
                                expression: "form.city_ids",
                              },
                            ],
                            staticClass: "form-check-input",
                            attrs: { type: "checkbox", id: "city_" + c.id },
                            domProps: {
                              value: c.id,
                              checked: Array.isArray(_vm.form.city_ids)
                                ? _vm._i(_vm.form.city_ids, c.id) > -1
                                : _vm.form.city_ids,
                            },
                            on: {
                              change: function ($event) {
                                var $$a = _vm.form.city_ids,
                                  $$el = $event.target,
                                  $$c = $$el.checked ? true : false
                                if (Array.isArray($$a)) {
                                  var $$v = c.id,
                                    $$i = _vm._i($$a, $$v)
                                  if ($$el.checked) {
                                    $$i < 0 &&
                                      _vm.$set(
                                        _vm.form,
                                        "city_ids",
                                        $$a.concat([$$v])
                                      )
                                  } else {
                                    $$i > -1 &&
                                      _vm.$set(
                                        _vm.form,
                                        "city_ids",
                                        $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1))
                                      )
                                  }
                                } else {
                                  _vm.$set(_vm.form, "city_ids", $$c)
                                }
                              },
                            },
                          }),
                          _vm._v(" "),
                          _c(
                            "label",
                            {
                              staticClass: "form-check-label",
                              attrs: { for: "city_" + c.id },
                            },
                            [_vm._v(_vm._s(c.name))]
                          ),
                        ]
                      )
                    }),
                  ],
                  2
                ),
                _vm._v(" "),
                _c("small", { staticClass: "text-muted" }, [
                  _vm._v(_vm._s(_vm.__("select_one_or_more_cities"))),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "text-end" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-secondary me-2",
                    attrs: { type: "button" },
                    on: {
                      click: function ($event) {
                        _vm.modalOpen = false
                      },
                    },
                  },
                  [_vm._v(_vm._s(_vm.__("cancel")))]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary",
                    attrs: { type: "submit", disabled: _vm.isSaving },
                  },
                  [
                    _vm._v(
                      "\n                    " +
                        _vm._s(_vm.__("save")) +
                        "\n                    "
                    ),
                    _vm.isSaving
                      ? _c("b-spinner", { attrs: { small: "" } })
                      : _vm._e(),
                  ],
                  1
                ),
              ]),
            ]
          ),
        ]
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);