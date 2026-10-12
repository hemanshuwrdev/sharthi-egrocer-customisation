"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_Units_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Units.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Units.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
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
        key: 'short_code',
        label: __('short_code'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'parent_id',
        label: __('parent_id'),
        "class": 'text-center'
      }, {
        key: 'conversion',
        label: __('conversion'),
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
      page: 1,
      units: [],
      isLoading: false,
      sectionStyle: 'style_1',
      max_visible_units: 12,
      max_col_in_single_row: 3,
      create_new: null,
      edit_record: null
    };
  },
  computed: {
    sortOptions: function sortOptions() {
      // Create an options list from our fields
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
    // Set the initial number of items
    this.totalRows = this.units.length;
  },
  created: function created() {
    var _this = this;
    this.$eventBus.$on('unitSaved', function (message) {
      _this.showMessage("success", message);
      _this.getUnits();
      _this.create_new = null;
    });
    this.getUnits();
  },
  methods: {
    getUnits: function getUnits() {
      var _this2 = this;
      this.isLoading = true;
      axios.get(this.$apiUrl + '/units').then(function (response) {
        _this2.isLoading = false;
        var data = response.data;
        _this2.units = data.data;
        _this2.totalRows = _this2.units.length;
      });
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
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Sellers/Units.vue":
/*!**********************************************!*\
  !*** ./resources/js/views/Sellers/Units.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Units_vue_vue_type_template_id_71a7d1c5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Units.vue?vue&type=template&id=71a7d1c5 */ "./resources/js/views/Sellers/Units.vue?vue&type=template&id=71a7d1c5");
/* harmony import */ var _Units_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Units.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/Units.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Units_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Units_vue_vue_type_template_id_71a7d1c5__WEBPACK_IMPORTED_MODULE_0__.render,
  _Units_vue_vue_type_template_id_71a7d1c5__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/Units.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/Units.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/views/Sellers/Units.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Units.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Units.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/Units.vue?vue&type=template&id=71a7d1c5":
/*!****************************************************************************!*\
  !*** ./resources/js/views/Sellers/Units.vue?vue&type=template&id=71a7d1c5 ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_template_id_71a7d1c5__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_template_id_71a7d1c5__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Units_vue_vue_type_template_id_71a7d1c5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Units.vue?vue&type=template&id=71a7d1c5 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Units.vue?vue&type=template&id=71a7d1c5");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Units.vue?vue&type=template&id=71a7d1c5":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Units.vue?vue&type=template&id=71a7d1c5 ***!
  \*******************************************************************************************************************************************************************************************************************/
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
    _c("div", { staticClass: "page-head" }, [
      _c("h3", { staticClass: "page-head-title" }, [
        _vm._v(_vm._s(_vm.__("units"))),
      ]),
    ]),
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
              return _vm.getUnits()
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
              items: _vm.units,
              fields: _vm.fields,
              "current-page": _vm.currentPage,
              "per-page": _vm.perPage,
              filter: _vm.filter,
              "filter-included-fields": _vm.filterOn,
              "sort-by": _vm.sortBy,
              "sort-desc": _vm.sortDesc,
              "sort-direction": _vm.sortDirection,
              bordered: false,
              borderless: "",
              hover: "",
              busy: _vm.isLoading,
              stacked: "md",
              "show-empty": "",
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
              filtered: _vm.onFiltered,
            },
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
                        _c("i", { staticClass: "fa fa-ruler" }),
                      ]),
                      _vm._v(" "),
                      _c("h3", [_vm._v(_vm._s(_vm.__("No units found")))]),
                      _vm._v(" "),
                      _c("p", [
                        _vm._v(_vm._s(_vm.__("Units will show up here."))),
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
                        _c("i", { staticClass: "fa fa-ruler" }),
                      ]),
                      _vm._v(" "),
                      _c("h3", [_vm._v(_vm._s(_vm.__("No units found")))]),
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
                key: "cell(short_code)",
                fn: function (row) {
                  return [
                    row.item.short_code
                      ? _c("span", { staticClass: "ui-tag" }, [
                          _vm._v(_vm._s(row.item.short_code)),
                        ])
                      : _c("span", { staticClass: "ui-dash" }, [_vm._v("-")]),
                  ]
                },
              },
              {
                key: "cell(parent_id)",
                fn: function (row) {
                  return [
                    row.item.parent_id !== null
                      ? _c("span", [_vm._v(_vm._s(row.item.parent_id))])
                      : _c("span", { staticClass: "ui-dash" }, [_vm._v("-")]),
                  ]
                },
              },
              {
                key: "cell(conversion)",
                fn: function (row) {
                  return [
                    row.item.conversion !== null
                      ? _c("span", [_vm._v(_vm._s(row.item.conversion))])
                      : _c("span", { staticClass: "ui-dash" }, [_vm._v("-")]),
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