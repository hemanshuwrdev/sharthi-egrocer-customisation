"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Area_Area_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/Area.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/Area.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      isLoading: false,
      fields: [{
        key: 'id',
        label: __('id'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'name',
        label: __('name'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'pincode',
        label: __('pincode'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'city.zone',
        label: __('zone'),
        sortable: false
      }, {
        key: 'state',
        label: __('state'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'district',
        label: __('district'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'status',
        label: __('status')
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      offset: 0,
      sortBy: 'id',
      sortDesc: true,
      sortDirection: 'desc',
      filter: null,
      filterOn: [],
      areas: [],
      tableKey: 0
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
    },
    filter: function filter() {
      this.currentPage = 1;
      this.getRecords();
    }
  },
  methods: {
    getRecords: function getRecords() {
      var _this = this;
      this.isLoading = true;
      var vm = this;
      var calculatedOffset = this.perPage * (this.currentPage - 1);
      var params = {
        offset: calculatedOffset,
        limit: this.perPage,
        search: this.filter
      };
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/areas', {
        params: params
      }).then(function (response) {
        _this.isLoading = false;
        var data = response.data;
        _this.areas = data.data.areas || [];
        _this.totalRows = data.data.total || 0;
        _this.tableKey++;
      })["catch"](function (error) {
        var _error$request;
        vm.isLoading = false;
        if (error !== null && error !== void 0 && (_error$request = error.request) !== null && _error$request !== void 0 && _error$request.statusText) {
          var _error$request2;
          _this.showError(error === null || error === void 0 ? void 0 : (_error$request2 = error.request) === null || _error$request2 === void 0 ? void 0 : _error$request2.statusText);
        } else if (error.message) {
          _this.showError(error.message);
        } else {
          _this.showError(__('something_went_wrong'));
        }
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
          var postData = {
            id: id
          };
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this2.$apiUrl + '/areas/delete', postData).then(function (response) {
            _this2.isLoading = false;
            var data = response.data;
            _this2.areas.splice(index, 1);
            _this2.showMessage('success', data.message);
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Area/Area.vue":
/*!******************************************!*\
  !*** ./resources/js/views/Area/Area.vue ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Area_vue_vue_type_template_id_0dda9760__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Area.vue?vue&type=template&id=0dda9760 */ "./resources/js/views/Area/Area.vue?vue&type=template&id=0dda9760");
/* harmony import */ var _Area_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Area.vue?vue&type=script&lang=js */ "./resources/js/views/Area/Area.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Area_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Area_vue_vue_type_template_id_0dda9760__WEBPACK_IMPORTED_MODULE_0__.render,
  _Area_vue_vue_type_template_id_0dda9760__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Area/Area.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Area/Area.vue?vue&type=script&lang=js":
/*!******************************************************************!*\
  !*** ./resources/js/views/Area/Area.vue?vue&type=script&lang=js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Area_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Area.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/Area.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Area_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Area/Area.vue?vue&type=template&id=0dda9760":
/*!************************************************************************!*\
  !*** ./resources/js/views/Area/Area.vue?vue&type=template&id=0dda9760 ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Area_vue_vue_type_template_id_0dda9760__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Area_vue_vue_type_template_id_0dda9760__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Area_vue_vue_type_template_id_0dda9760__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Area.vue?vue&type=template&id=0dda9760 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/Area.vue?vue&type=template&id=0dda9760");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/Area.vue?vue&type=template&id=0dda9760":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/Area.vue?vue&type=template&id=0dda9760 ***!
  \***************************************************************************************************************************************************************************************************************/
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
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
          _c("h3", [_vm._v(_vm._s(_vm.__("manage_areas_pincode_wise")))]),
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
                  [_vm._v(_vm._s(_vm.__("manage_areas")))]
                ),
              ]),
            ]
          ),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 col-md-12 order-md-1 order-last" }, [
          _c("div", { staticClass: "card" }, [
            _c("div", { staticClass: "card-header" }, [
              _c("h4", [_vm._v(_vm._s(_vm.__("manage_areas")))]),
              _vm._v(" "),
              _c(
                "span",
                { staticClass: "pull-right" },
                [
                  _vm.$can("area_create")
                    ? _c(
                        "router-link",
                        {
                          staticClass: "btn btn-primary",
                          attrs: { to: "/areas/create" },
                        },
                        [_vm._v(_vm._s(_vm.__("add_new_area")))]
                      )
                    : _vm._e(),
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
                  { staticClass: "mb-2" },
                  [
                    _c(
                      "b-col",
                      { attrs: { cols: "11", lg: "4", "offset-lg": "7" } },
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
                      key: _vm.tableKey,
                      ref: "table",
                      attrs: {
                        id: "my-table",
                        "head-variant": "unset",
                        items: _vm.areas,
                        fields: _vm.fields,
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
                        "empty-text": "There are no areas to show",
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
                        "sort-changed": _vm.getRecords,
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
                          key: "cell(status)",
                          fn: function (row) {
                            return [
                              _c(
                                "span",
                                {
                                  staticClass: "badge",
                                  class:
                                    row.item.status == 1
                                      ? "bg-success"
                                      : "bg-danger",
                                },
                                [
                                  _vm._v(
                                    "\n                                        " +
                                      _vm._s(
                                        row.item.status == 1
                                          ? _vm.__("active")
                                          : _vm.__("inactive")
                                      ) +
                                      "\n                                    "
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
                                "div",
                                { staticStyle: { width: "120px" } },
                                [
                                  _vm.$can("area_update")
                                    ? _c(
                                        "router-link",
                                        {
                                          directives: [
                                            {
                                              name: "b-tooltip",
                                              rawName: "v-b-tooltip.hover",
                                              modifiers: { hover: true },
                                            },
                                          ],
                                          staticClass: "btn btn-sm btn-primary",
                                          attrs: {
                                            to: {
                                              name: "EditArea",
                                              params: {
                                                id: row.item.id,
                                                record: row.item,
                                              },
                                            },
                                            title: _vm.__("edit"),
                                          },
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-pencil-alt",
                                          }),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _vm.$can("area_delete")
                                    ? _c(
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
                                              return _vm.deleteRecord(
                                                row.index,
                                                row.item.id
                                              )
                                            },
                                          },
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-trash",
                                          }),
                                        ]
                                      )
                                    : _vm._e(),
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
                    _c("b-col", { staticClass: "my-1", attrs: { md: "2" } }, [
                      _c(
                        "label",
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
                    ]),
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
                              ":- " +
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
                          on: { change: _vm.getRecords },
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
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);