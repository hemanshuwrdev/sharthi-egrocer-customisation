"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Setting_FirebaseSettings_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/FirebaseSettings.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/FirebaseSettings.vue?vue&type=script&lang=js ***!
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      fileExists: false,
      editorConfig: {},
      firebase: {
        firebase_apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
        measurementId: "",
        firebase_vapid_key: "",
        jsonFile: ""
      },
      record: null,
      jsonFileError: null
    };
  },
  created: function created() {
    if (this.$isDemo != 1) {
      this.getFirebaseData();
    }
  },
  methods: {
    getFirebaseData: function getFirebaseData() {
      var _this = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/firebase').then(function (response) {
        if (response.data.data) {
          _this.record = response.data.data;
          _this.record.map(function (item, index) {
            if (item.variable === 'file_exists') {
              // Handle file existence status
              _this.fileExists = item.value === '1';
            } else if (item.value === '0' || item.value === '1') {
              _this.firebase[item.variable] = item.value === '0' ? 0 : 1;
            } else {
              _this.firebase[item.variable] = item.value;
            }
          });
        }
      })["catch"](function (error) {
        if (error.request.statusText) {
          _this.showError(error.request.statusText);
        } else if (error.message) {
          _this.showError(error.message);
        } else {
          _this.showError(__('something_went_wrong'));
        }
      });
    },
    triggerJsonClick: function triggerJsonClick() {
      var ref = this.$refs.jsonFile;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (input && typeof input.click === 'function') {
        input.click();
      }
    },
    dropJsonFile: function dropJsonFile(event) {
      event.preventDefault();
      var ref = this.$refs.jsonFile;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (!input) return;
      input.files = event.dataTransfer.files;
      this.handleFileUpload();
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleFileUpload: function handleFileUpload() {
      var ref = this.$refs.jsonFile;
      var input = Array.isArray(ref) ? ref[0] : ref;
      var file = input && input.files ? input.files[0] : null;
      if (!file) return;
      this.jsonFileError = null;

      // Simple type check for JSON
      var validTypes = ['application/json', '.json'];
      if (file.type && !validTypes.includes(file.type)) {
        this.jsonFileError = this.__('invalid_json_file_type');
        return;
      }
      this.firebase.jsonFile = file;
      this.fileExists = true;
    },
    saveRecord: function saveRecord() {
      var _this2 = this;
      this.isLoading = true;
      var object = this.firebase;
      var formData = new FormData();
      for (var key in object) {
        formData.append(key, object[key]);
      }
      var url = this.$apiUrl + '/firebase/save';
      var vm = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, formData).then(function (res) {
        var data = res.data;
        if (data.status === 1) {
          _this2.showMessage("success", data.message);
          // Refresh data to get updated file status
          vm.getFirebaseData();
          setTimeout(function () {
            vm.$swal.close();
            vm.$router.push({
              path: '/firebase-settings'
            });
            vm.isLoading = false;
          }, 100);
        } else {
          vm.showError(data.message);
          vm.isLoading = false;
        }
      })["catch"](function (error) {
        if (error.request.statusText) {
          _this2.showError(error.request.statusText);
        } else if (error.message) {
          _this2.showError(error.message);
        } else {
          _this2.showError(__('something_went_wrong'));
        }
        vm.isLoading = true;
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Setting/FirebaseSettings.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/Setting/FirebaseSettings.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _FirebaseSettings_vue_vue_type_template_id_f7e07230__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FirebaseSettings.vue?vue&type=template&id=f7e07230 */ "./resources/js/views/Setting/FirebaseSettings.vue?vue&type=template&id=f7e07230");
/* harmony import */ var _FirebaseSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FirebaseSettings.vue?vue&type=script&lang=js */ "./resources/js/views/Setting/FirebaseSettings.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _FirebaseSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _FirebaseSettings_vue_vue_type_template_id_f7e07230__WEBPACK_IMPORTED_MODULE_0__.render,
  _FirebaseSettings_vue_vue_type_template_id_f7e07230__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Setting/FirebaseSettings.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Setting/FirebaseSettings.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/Setting/FirebaseSettings.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FirebaseSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FirebaseSettings.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/FirebaseSettings.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FirebaseSettings_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Setting/FirebaseSettings.vue?vue&type=template&id=f7e07230":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/Setting/FirebaseSettings.vue?vue&type=template&id=f7e07230 ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FirebaseSettings_vue_vue_type_template_id_f7e07230__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FirebaseSettings_vue_vue_type_template_id_f7e07230__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FirebaseSettings_vue_vue_type_template_id_f7e07230__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FirebaseSettings.vue?vue&type=template&id=f7e07230 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/FirebaseSettings.vue?vue&type=template&id=f7e07230");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/FirebaseSettings.vue?vue&type=template&id=f7e07230":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/FirebaseSettings.vue?vue&type=template&id=f7e07230 ***!
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
  return _c("div", [
    _c("div", { staticClass: "page-heading" }, [
      _c("div", { staticClass: "page-title" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("firebase_settings")))]),
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
                    [_vm._v(_vm._s(_vm.__("firebase_settings")))]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c("section", { staticClass: "section" }, [
        _c(
          "form",
          {
            attrs: {
              id: "api_key_form",
              method: "post",
              enctype: "multipart/form-data",
            },
            on: {
              submit: function ($event) {
                $event.preventDefault()
                return _vm.saveRecord.apply(null, arguments)
              },
            },
          },
          [
            _c("div", { staticClass: "card" }, [
              _c("div", { staticClass: "card-body" }, [
                _c("div", { staticClass: "row" }, [
                  _c("h4", { staticClass: "card-title" }, [
                    _vm._v(_vm._s(_vm.__("firebase_setup_keys"))),
                  ]),
                  _vm._v(" "),
                  _c("label", [
                    _c("span", { staticClass: "text-danger text-xs" }, [
                      _vm._v("*"),
                    ]),
                    _vm._v(" " + _vm._s(_vm.__("required_fields")) + "."),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "divider" }, [
                    _c("div", { staticClass: "divider-text" }, [
                      _vm._v(_vm._s(_vm.__("firebase_setup_keys_form"))),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-6" }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "firebase_apiKey" } }, [
                        _vm._v(_vm._s(_vm.__("apikey"))),
                        _c("span", { staticClass: "text-danger text-xs" }, [
                          _vm._v("*"),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.firebase.firebase_apiKey,
                            expression: "firebase.firebase_apiKey",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "text",
                          name: "firebase_apiKey",
                          id: "firebase_apiKey",
                          placeholder: _vm.__("apikey"),
                        },
                        domProps: { value: _vm.firebase.firebase_apiKey },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.firebase,
                              "firebase_apiKey",
                              $event.target.value
                            )
                          },
                        },
                      }),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-6" }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "authDomain" } }, [
                        _vm._v(_vm._s(_vm.__("authdomain"))),
                        _c("span", { staticClass: "text-danger text-xs" }, [
                          _vm._v("*"),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.firebase.authDomain,
                            expression: "firebase.authDomain",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "text",
                          name: "authDomain",
                          id: "authDomain",
                          placeholder: _vm.__("authdomain"),
                        },
                        domProps: { value: _vm.firebase.authDomain },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.firebase,
                              "authDomain",
                              $event.target.value
                            )
                          },
                        },
                      }),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-6" }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "projectId" } }, [
                        _vm._v(_vm._s(_vm.__("projectid")) + " "),
                        _c("span", { staticClass: "text-danger text-xs" }, [
                          _vm._v("*"),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.firebase.projectId,
                            expression: "firebase.projectId",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "text",
                          name: "projectId",
                          id: "projectId",
                          placeholder: _vm.__("projectid"),
                        },
                        domProps: { value: _vm.firebase.projectId },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.firebase,
                              "projectId",
                              $event.target.value
                            )
                          },
                        },
                      }),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-6" }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "storageBucket" } }, [
                        _vm._v(_vm._s(_vm.__("storagebucket"))),
                        _c("span", { staticClass: "text-danger text-xs" }, [
                          _vm._v("*"),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.firebase.storageBucket,
                            expression: "firebase.storageBucket",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "text",
                          name: "storageBucket",
                          id: "storageBucket",
                          placeholder: _vm.__("storagebucket"),
                        },
                        domProps: { value: _vm.firebase.storageBucket },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.firebase,
                              "storageBucket",
                              $event.target.value
                            )
                          },
                        },
                      }),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-6" }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "messagingSenderId" } }, [
                        _vm._v(" " + _vm._s(_vm.__("messagingsenderid"))),
                        _c("span", { staticClass: "text-danger text-xs" }, [
                          _vm._v("*"),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.firebase.messagingSenderId,
                            expression: "firebase.messagingSenderId",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "text",
                          name: "messagingSenderId",
                          id: "messagingSenderId",
                          placeholder: _vm.__("messagingsenderid"),
                        },
                        domProps: { value: _vm.firebase.messagingSenderId },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.firebase,
                              "messagingSenderId",
                              $event.target.value
                            )
                          },
                        },
                      }),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-6" }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "appId" } }, [
                        _vm._v(" " + _vm._s(_vm.__("appid"))),
                        _c("span", { staticClass: "text-danger text-xs" }, [
                          _vm._v("*"),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.firebase.appId,
                            expression: "firebase.appId",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "text",
                          name: "appId",
                          id: "appId",
                          placeholder: _vm.__("appid"),
                        },
                        domProps: { value: _vm.firebase.appId },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(_vm.firebase, "appId", $event.target.value)
                          },
                        },
                      }),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-6" }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "measurementId" } }, [
                        _vm._v(_vm._s(_vm.__("measurementid"))),
                        _c("span", { staticClass: "text-danger text-xs" }, [
                          _vm._v("*"),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.firebase.measurementId,
                            expression: "firebase.measurementId",
                          },
                        ],
                        staticClass: "form-control",
                        attrs: {
                          type: "text",
                          name: "measurementId",
                          id: "measurementId",
                          placeholder: _vm.__("measurementid"),
                        },
                        domProps: { value: _vm.firebase.measurementId },
                        on: {
                          input: function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.firebase,
                              "measurementId",
                              $event.target.value
                            )
                          },
                        },
                      }),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "divider" }, [
                    _c("div", { staticClass: "divider-text" }, [
                      _vm._v(_vm._s(_vm.__("firebase_json_file_upload"))),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-md-6" }, [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "jsonFile" } }, [
                        _vm._v(
                          _vm._s(_vm.__("firebase_json_file")) +
                            " \n                                        "
                        ),
                        _vm.fileExists
                          ? _c("span", { staticClass: "text-success ms-2" }, [
                              _c("i", { staticClass: "fa fa-check-circle" }),
                              _vm._v(
                                " " +
                                  _vm._s(_vm.__("file_exists")) +
                                  "\n                                        "
                              ),
                            ])
                          : _c("span", { staticClass: "text-danger ms-2" }, [
                              _c("i", { staticClass: "fa fa-times-circle" }),
                              _vm._v(
                                " " +
                                  _vm._s(_vm.__("file_not_exists")) +
                                  "\n                                        "
                              ),
                            ]),
                      ]),
                      _vm._v(" "),
                      _c("p", { staticClass: "text-muted mb-1" }, [
                        _vm._v(
                          "\n                                        " +
                            _vm._s(_vm.__("supported_formats")) +
                            ": JSON\n                                    "
                        ),
                      ]),
                      _vm._v(" "),
                      _vm.jsonFileError
                        ? _c("span", { staticClass: "error" }, [
                            _vm._v(_vm._s(_vm.jsonFileError)),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _c("input", {
                        ref: "jsonFile",
                        staticClass: "file-input",
                        attrs: {
                          type: "file",
                          name: "jsonFile",
                          id: "jsonFile",
                          accept: ".json,application/json",
                        },
                        on: { change: _vm.handleFileUpload },
                      }),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "file-input-div bg-gray-100",
                          on: {
                            click: _vm.triggerJsonClick,
                            drop: _vm.dropJsonFile,
                            dragover: _vm.$dragoverFile,
                            dragleave: _vm.$dragleaveFile,
                          },
                        },
                        [
                          _vm.firebase.jsonFile && _vm.firebase.jsonFile.name
                            ? [
                                _c("label", [
                                  _vm._v(
                                    _vm._s(_vm.__("selected_file_name")) +
                                      " " +
                                      _vm._s(_vm.firebase.jsonFile.name)
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
                ]),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "card-footer" },
                [
                  _c(
                    "b-button",
                    {
                      attrs: {
                        type: "submit",
                        variant: "primary",
                        disabled: _vm.isLoading,
                      },
                    },
                    [
                      _vm._v(
                        _vm._s(_vm.__("update")) +
                          "\n                            "
                      ),
                      _vm.isLoading
                        ? _c("b-spinner", {
                            attrs: { small: "", label: "Spinning" },
                          })
                        : _vm._e(),
                    ],
                    1
                  ),
                ],
                1
              ),
            ]),
          ]
        ),
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