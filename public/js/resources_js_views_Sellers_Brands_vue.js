"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_Brands_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Brands.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Brands.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datatable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datatable */ "./node_modules/vuejs-datatable/dist/vuejs-datatable.esm.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  components: {
    VuejsDatatableFactory: vuejs_datatable__WEBPACK_IMPORTED_MODULE_0__.VuejsDatatableFactory
  },
  data: function data() {
    return {
      fields: [{
        key: 'id',
        label: __('id'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'name',
        label: __('name'),
        "class": 'text-center'
      }, {
        key: 'image',
        label: __('image'),
        "class": 'text-center'
      }, {
        key: 'status',
        label: __('status'),
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
      isLoading: false,
      sectionStyle: 'style_1',
      max_visible_units: 12,
      max_col_in_single_row: 3,
      brands: [],
      create_new: null,
      edit_record: null
    };
  },
  watch: {
    // Re-fetch when page changes
    currentPage: function currentPage() {
      this.getRecords();
    },
    // Re-fetch when per-page changes and reset to page 1
    perPage: function perPage() {
      this.currentPage = 1;
      this.getRecords();
    },
    // Re-fetch when search filter changes and reset to page 1
    filter: function filter() {
      this.currentPage = 1;
      this.getRecords();
    }
  },
  created: function created() {
    var _this = this;
    this.$eventBus.$on('recordSaved', function (message) {
      _this.showMessage('success', message);
      _this.getRecords();
    });
    this.getRecords();
  },
  methods: {
    getRecords: function getRecords() {
      var _this2 = this;
      this.isLoading = true;
      // Pass page, per_page, and filter so the API handles server-side pagination
      axios.get(this.$apiUrl + '/seller/products/brands', {
        params: {
          page: this.currentPage,
          per_page: this.perPage,
          filter: this.filter || ''
        }
      }).then(function (response) {
        _this2.isLoading = false;
        var data = response.data;
        _this2.brands = data.data;
        // Use the total count from API for correct pagination
        _this2.totalRows = data.total;
      });
    },
    deleteRecord: function deleteRecord(index, id) {
      var _this3 = this;
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
          _this3.isLoading = true;
          var postData = {
            id: id
          };
          axios.post(_this3.$apiUrl + '/products/brands/delete', postData).then(function (response) {
            _this3.isLoading = false;
            var data = response.data;
            _this3.brands.splice(index, 1);
            _this3.showMessage('success', data.message);
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Sellers/Brands.vue":
/*!***********************************************!*\
  !*** ./resources/js/views/Sellers/Brands.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Brands_vue_vue_type_template_id_6094e2e6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Brands.vue?vue&type=template&id=6094e2e6 */ "./resources/js/views/Sellers/Brands.vue?vue&type=template&id=6094e2e6");
/* harmony import */ var _Brands_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Brands.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/Brands.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Brands_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Brands_vue_vue_type_template_id_6094e2e6__WEBPACK_IMPORTED_MODULE_0__.render,
  _Brands_vue_vue_type_template_id_6094e2e6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/Brands.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/Brands.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./resources/js/views/Sellers/Brands.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Brands_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Brands.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Brands.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Brands_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/Brands.vue?vue&type=template&id=6094e2e6":
/*!*****************************************************************************!*\
  !*** ./resources/js/views/Sellers/Brands.vue?vue&type=template&id=6094e2e6 ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Brands_vue_vue_type_template_id_6094e2e6__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Brands_vue_vue_type_template_id_6094e2e6__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Brands_vue_vue_type_template_id_6094e2e6__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Brands.vue?vue&type=template&id=6094e2e6 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Brands.vue?vue&type=template&id=6094e2e6");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Brands.vue?vue&type=template&id=6094e2e6":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/Brands.vue?vue&type=template&id=6094e2e6 ***!
  \********************************************************************************************************************************************************************************************************************/
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
        _vm._v(_vm._s(_vm.__("brands"))),
      ]),
    ]),
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
              items: _vm.brands,
              fields: _vm.fields,
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
                key: "cell(id)",
                fn: function (row) {
                  return [
                    _vm._v(
                      "\n                                " +
                        _vm._s(row.item.id) +
                        "\n                            "
                    ),
                  ]
                },
              },
              {
                key: "cell(image)",
                fn: function (row) {
                  return [
                    row.item.image === ""
                      ? _c("p", [_vm._v("No Image")])
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
                key: "cell(status)",
                fn: function (row) {
                  return [
                    row.item.status == 1
                      ? _c("span", { staticClass: "badge bg-success" }, [
                          _vm._v(_vm._s(_vm.__("activate"))),
                        ])
                      : _c("span", { staticClass: "badge bg-danger" }, [
                          _vm._v(_vm._s(_vm.__("deactivate"))),
                        ]),
                  ]
                },
              },
              {
                key: "cell(actions)",
                fn: function (row) {
                  return [
                    _c("div", { staticClass: "list-actions" }, [
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
                          staticClass: "list-action-btn is-edit",
                          attrs: { title: _vm.__("edit") },
                          on: {
                            click: function ($event) {
                              _vm.edit_record = row.item
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
                    ]),
                  ]
                },
              },
            ]),
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "list-footer" }, [
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
        _c(
          "div",
          [
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