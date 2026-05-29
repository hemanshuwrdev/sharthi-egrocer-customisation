"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Product_BulkUpdate_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/BulkUpdate.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/BulkUpdate.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************/
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
//


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      isLoading: false,
      isLoadingDownload: false,
      sampleFileurl: this.$baseUrl + '/sample-file/products.csv',
      instructionsFileurl: this.$baseUrl + '/sample-file/products.txt',
      file: null,
      fileError: null,
      rowErrors: []
    };
  },
  computed: {
    isSellerRoute: function isSellerRoute() {
      // Use this.$route to access the current route
      return this.$route.path.startsWith('/seller/');
    }
  },
  created: function created() {},
  mounted: function mounted() {},
  methods: {
    triggerFileClick: function triggerFileClick() {
      var ref = this.$refs.file_csv;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (input && typeof input.click === 'function') {
        input.click();
      }
    },
    dropFile: function dropFile(event) {
      event.preventDefault();
      var ref = this.$refs.file_csv;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (!input) return;
      input.files = event.dataTransfer.files;
      this.handleFileUpload();
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleFileUpload: function handleFileUpload() {
      var ref = this.$refs.file_csv;
      var input = Array.isArray(ref) ? ref[0] : ref;
      var file = input && input.files ? input.files[0] : null;
      if (!file) return;
      this.fileError = null;
      var validExtensions = ['.xlsx', '.xls'];
      var name = file.name ? file.name.toLowerCase() : '';
      if (!validExtensions.some(function (ext) {
        return name.endsWith(ext);
      })) {
        this.fileError = this.__('invalid_excel_file_type');
        return;
      }
      this.file = file;
      this.rowErrors = [];
    },
    downloadProductDataExcel: function downloadProductDataExcel() {
      var _this = this;
      this.isLoadingDownload = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default()({
        url: this.$apiUrl + '/products/download_product_data_excel',
        method: 'get',
        responseType: 'blob'
      }).then(function (response) {
        _this.isLoadingDownload = false;
        // Create a blob URL from the response
        var url = window.URL.createObjectURL(new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }));
        var link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'products_data.xlsx'); // Set the download file name as .xlsx
        document.body.appendChild(link);
        link.click();
        // Clean up: remove the link and revoke the blob URL
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })["catch"](function (error) {
        _this.isLoadingDownload = false;
        if (error.request && error.request.statusText) {
          _this.showError(error.request.statusText);
        } else if (error.message) {
          _this.showError(error.message);
        } else {
          _this.showError("Something went wrong!");
        }
      });
    },
    saveRecord: function saveRecord() {
      var _this2 = this;
      var vm = this;
      this.isLoading = true;
      var formData = new FormData();
      formData.append('file', this.file);
      var url = this.$apiUrl + '/products/bulk_update';
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (res) {
        var data = res.data;
        if (data.status === 1) {
          _this2.showMessage("success", data.message);
          _this2.$refs.file_csv.value = null;
          _this2.file = null;
          _this2.rowErrors = [];
          vm.isLoading = false;
        } else {
          if (Array.isArray(data.data) && data.data.length) {
            // Row-level validation errors — show in the table
            vm.showError(data.message || 'Validation failed for some rows.');
            vm.rowErrors = data.data;
          } else {
            // Unexpected server / DB error — show as a single friendly row
            vm.rowErrors = [{
              row: '—',
              errors: [data.message || 'An unexpected error occurred. Please check your data and try again.']
            }];
          }
          vm.$nextTick(function () {
            if (vm.$refs.rowErrorsAlert && typeof vm.$refs.rowErrorsAlert.scrollIntoView === 'function') {
              vm.$refs.rowErrorsAlert.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            } else {
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }
          });
          vm.isLoading = false;
        }
      })["catch"](function (error) {
        vm.isLoading = false;
        if (error.request.statusText) {
          _this2.showError(error.request.statusText);
        } else if (error.message) {
          _this2.showError(error.message);
        } else {
          _this2.showError("Something went wrong!");
        }
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Product/BulkUpdate.vue":
/*!***************************************************!*\
  !*** ./resources/js/views/Product/BulkUpdate.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BulkUpdate_vue_vue_type_template_id_23df579a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BulkUpdate.vue?vue&type=template&id=23df579a */ "./resources/js/views/Product/BulkUpdate.vue?vue&type=template&id=23df579a");
/* harmony import */ var _BulkUpdate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BulkUpdate.vue?vue&type=script&lang=js */ "./resources/js/views/Product/BulkUpdate.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BulkUpdate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _BulkUpdate_vue_vue_type_template_id_23df579a__WEBPACK_IMPORTED_MODULE_0__.render,
  _BulkUpdate_vue_vue_type_template_id_23df579a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Product/BulkUpdate.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Product/BulkUpdate.vue?vue&type=script&lang=js":
/*!***************************************************************************!*\
  !*** ./resources/js/views/Product/BulkUpdate.vue?vue&type=script&lang=js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUpdate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BulkUpdate.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/BulkUpdate.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUpdate_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Product/BulkUpdate.vue?vue&type=template&id=23df579a":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/Product/BulkUpdate.vue?vue&type=template&id=23df579a ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUpdate_vue_vue_type_template_id_23df579a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUpdate_vue_vue_type_template_id_23df579a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BulkUpdate_vue_vue_type_template_id_23df579a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./BulkUpdate.vue?vue&type=template&id=23df579a */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/BulkUpdate.vue?vue&type=template&id=23df579a");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/BulkUpdate.vue?vue&type=template&id=23df579a":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Product/BulkUpdate.vue?vue&type=template&id=23df579a ***!
  \************************************************************************************************************************************************************************************************************************/
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
          _c("h3", [_vm._v(_vm._s(_vm.__("bulk_update")))]),
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
                _vm.isSellerRoute
                  ? _c(
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
                    )
                  : _c(
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
                  [
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.__("bulk_update")) +
                        "\n                        "
                    ),
                  ]
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
              _c("h4", [_vm._v(_vm._s(_vm.__("product_bulk_update_form")))]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "card-body" }, [
              _c("div", { staticClass: "alert alert-info" }, [
                _c("p", [
                  _vm._v(
                    _vm._s(
                      _vm.__(
                        "always_download_and_use_new_sample_file_if_you_did_updated_admin_panel_version"
                      )
                    )
                  ),
                ]),
                _vm._v(" "),
                _c("p", [
                  _vm._v(
                    _vm._s(
                      _vm.__(
                        "read_and_follow_instructions_carefully_before_proceed"
                      )
                    )
                  ),
                ]),
                _vm._v(" "),
                _c("p", [
                  _c("b", [_vm._v(_vm._s(_vm.__("instruction")) + ":")]),
                ]),
                _vm._v(
                  "\n                            -- " +
                    _vm._s(_vm.__("download_product_data_file_as_excel")) +
                    " "
                ),
                _c("br"),
                _vm._v(
                  "\n                            -- " +
                    _vm._s(
                      _vm.__(
                        "change_product_name_price_stock_related_information_and_update"
                      )
                    ) +
                    "\n                        "
                ),
              ]),
              _vm._v(" "),
              _vm.rowErrors.length
                ? _c("div", { staticClass: "row" }, [
                    _c("div", { staticClass: "col-12" }, [
                      _c(
                        "div",
                        {
                          ref: "rowErrorsAlert",
                          staticClass: "alert alert-danger",
                        },
                        [
                          _c("p", { staticClass: "mb-2" }, [
                            _vm._v(
                              _vm._s(
                                _vm.__(
                                  "validation_failed_for_some_rows_please_review_and_fix_the_following"
                                )
                              )
                            ),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "table-responsive" }, [
                            _c(
                              "table",
                              { staticClass: "table table-sm table-bordered" },
                              [
                                _c("thead", [
                                  _c("tr", [
                                    _c(
                                      "th",
                                      {
                                        staticClass: "text-white",
                                        staticStyle: { width: "80px" },
                                      },
                                      [_vm._v(_vm._s(_vm.__("row")))]
                                    ),
                                    _vm._v(" "),
                                    _c("th", { staticClass: "text-white" }, [
                                      _vm._v(_vm._s(_vm.__("errors"))),
                                    ]),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c(
                                  "tbody",
                                  _vm._l(_vm.rowErrors, function (item) {
                                    return _c(
                                      "tr",
                                      { key: "row-" + item.row },
                                      [
                                        _c(
                                          "td",
                                          { staticClass: "text-white" },
                                          [_vm._v(_vm._s(item.row))]
                                        ),
                                        _vm._v(" "),
                                        _c("td", [
                                          _c(
                                            "ul",
                                            { staticClass: "mb-0 ps-3" },
                                            _vm._l(item.errors, function (err) {
                                              return _c(
                                                "li",
                                                {
                                                  key: err,
                                                  staticClass: "text-white",
                                                },
                                                [_vm._v(_vm._s(err))]
                                              )
                                            }),
                                            0
                                          ),
                                        ]),
                                      ]
                                    )
                                  }),
                                  0
                                ),
                              ]
                            ),
                          ]),
                        ]
                      ),
                    ]),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("div", { staticClass: "row" }, [
                _c(
                  "form",
                  {
                    ref: "my-form",
                    attrs: { method: "post", enctype: "multipart/form-data" },
                    on: {
                      submit: function ($event) {
                        $event.preventDefault()
                        return _vm.saveRecord.apply(null, arguments)
                      },
                    },
                  },
                  [
                    _c("div", { staticClass: "col-md-12" }, [
                      _c("div", { staticClass: "form-group" }, [
                        _c("label", { attrs: { for: "upload_file" } }, [
                          _vm._v(
                            _vm._s(_vm.__("upload_file")) +
                              " " +
                              _vm._s(_vm.__("excel_file"))
                          ),
                        ]),
                        _vm._v(" "),
                        _c("p", { staticClass: "text-muted mb-1" }, [
                          _vm._v(
                            "\n                                            " +
                              _vm._s(_vm.__("supported_formats")) +
                              ": XLSX, XLS\n                                        "
                          ),
                        ]),
                        _vm._v(" "),
                        _vm.fileError
                          ? _c("span", { staticClass: "error" }, [
                              _vm._v(_vm._s(_vm.fileError)),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _c("input", {
                          ref: "file_csv",
                          staticClass: "file-input",
                          attrs: {
                            type: "file",
                            name: "upload_file",
                            id: "upload_file",
                            accept: ".xlsx,.xls",
                          },
                          on: { change: _vm.handleFileUpload },
                        }),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass: "file-input-div bg-gray-100",
                            on: {
                              click: _vm.triggerFileClick,
                              drop: _vm.dropFile,
                              dragover: _vm.$dragoverFile,
                              dragleave: _vm.$dragleaveFile,
                            },
                          },
                          [
                            _vm.file && _vm.file.name
                              ? [
                                  _c("label", [
                                    _vm._v(
                                      _vm._s(_vm.__("selected_file_name")) +
                                        " " +
                                        _vm._s(_vm.file.name)
                                    ),
                                  ]),
                                ]
                              : [
                                  _vm._m(0),
                                  _vm._v(" "),
                                  _c("label", [
                                    _vm._v(
                                      _vm._s(
                                        _vm.__(
                                          "drop_files_here_or_click_to_upload"
                                        )
                                      )
                                    ),
                                  ]),
                                ],
                          ],
                          2
                        ),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "col-md-12" }, [
                      _c(
                        "button",
                        {
                          staticClass: "btn btn-primary",
                          attrs: {
                            type: "submit",
                            id: "submit_btn",
                            name: "btnAdd",
                            disabled: _vm.isLoading,
                          },
                        },
                        [
                          !_vm.isLoading
                            ? _c("i", { staticClass: "fa fa-upload" })
                            : _vm._e(),
                          _vm._v(
                            " " +
                              _vm._s(_vm.__("update")) +
                              "\n                                        "
                          ),
                          _vm.isLoading
                            ? _c("b-spinner", {
                                attrs: { small: "", label: "Spinning" },
                              })
                            : _vm._e(),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "button",
                        {
                          staticClass: "btn btn btn-secondary",
                          attrs: { type: "reset" },
                        },
                        [
                          _c("i", {
                            staticClass: "fa fa-undo",
                            attrs: { "aria-hidden": "true" },
                          }),
                          _vm._v(
                            " " +
                              _vm._s(_vm.__("clear")) +
                              "\n                                    "
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          directives: [
                            {
                              name: "b-tooltip",
                              rawName: "v-b-tooltip.hover",
                              modifiers: { hover: true },
                            },
                          ],
                          staticClass: "btn btn-info",
                          attrs: {
                            title: "Download Excel",
                            disabled: _vm.isLoadingDownload,
                          },
                          on: { click: _vm.downloadProductDataExcel },
                        },
                        [
                          _vm.isLoadingDownload
                            ? [
                                _c("b-spinner", {
                                  attrs: { small: "", label: "Spinning" },
                                }),
                                _vm._v(
                                  " Downloading...\n                                        "
                                ),
                              ]
                            : [
                                _c("i", { staticClass: "fa fa-download" }),
                                _vm._v(
                                  " " +
                                    _vm._s(
                                      _vm.__("download_product_data_file")
                                    ) +
                                    "\n                                        "
                                ),
                              ],
                        ],
                        2
                      ),
                    ]),
                  ]
                ),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("label", [
      _c("i", { staticClass: "fa fa-cloud-upload-alt fa-2x" }),
    ])
  },
]
render._withStripped = true



/***/ })

}]);