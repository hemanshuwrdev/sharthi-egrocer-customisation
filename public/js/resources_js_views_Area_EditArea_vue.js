"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Area_EditArea_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/EditArea.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/EditArea.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      area: {
        id: "",
        city_id: "",
        name: "",
        pincode: "",
        state: "",
        district: "",
        status: 1
      },
      cities: [],
      isLoading: false
    };
  },
  created: function created() {
    this.area.id = this.$route.params.id;
    this.$apiUrl = '/api';
    this.fetchCities();
    if (this.area.id) {
      this.loadArea();
    }
  },
  methods: {
    fetchCities: function fetchCities() {
      var _this = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/cities').then(function (response) {
        var _response$data$data;
        _this.cities = ((_response$data$data = response.data.data) === null || _response$data$data === void 0 ? void 0 : _response$data$data.cities) || [];
      })["catch"](function () {
        _this.cities = [];
      });
    },
    loadArea: function loadArea() {
      var _this2 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/areas/edit/' + this.area.id).then(function (response) {
        var area = response.data.data;
        if (!area) {
          _this2.showError("Area not found");
          return;
        }
        Object.keys(_this2.area).forEach(function (key) {
          if (area[key] !== undefined && area[key] !== null) {
            _this2.area[key] = area[key];
          }
        });
      })["catch"](function () {
        _this2.showError("Failed to load area");
      });
    },
    saveRecord: function saveRecord() {
      var _this3 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var _this3$area$state, _this3$area$district;
        var formData, _error$response, _error$response$data;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!_this3.area.city_id || !_this3.area.name || !_this3.area.pincode)) {
                  _context.next = 3;
                  break;
                }
                _this3.showError(__('please_fill_all_required_fields'));
                return _context.abrupt("return");
              case 3:
                _this3.isLoading = true;
                formData = new FormData();
                if (_this3.area.id) {
                  formData.append("id", _this3.area.id);
                }
                formData.append("city_id", _this3.area.city_id);
                formData.append("name", _this3.area.name);
                formData.append("pincode", _this3.area.pincode);
                formData.append("state", (_this3$area$state = _this3.area.state) !== null && _this3$area$state !== void 0 ? _this3$area$state : '');
                formData.append("district", (_this3$area$district = _this3.area.district) !== null && _this3$area$district !== void 0 ? _this3$area$district : '');
                formData.append("status", _this3.area.status);
                _context.prev = 12;
                _context.next = 15;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().post(_this3.$apiUrl + '/areas/save', formData);
              case 15:
                _this3.showMessage("success", __('area_saved_successfully'));
                setTimeout(function () {
                  _this3.$router.push({
                    path: '/areas'
                  });
                }, 1500);
                _context.next = 22;
                break;
              case 19:
                _context.prev = 19;
                _context.t0 = _context["catch"](12);
                if ((_error$response = _context.t0.response) !== null && _error$response !== void 0 && (_error$response$data = _error$response.data) !== null && _error$response$data !== void 0 && _error$response$data.message) {
                  _this3.showError(_context.t0.response.data.message);
                } else {
                  _this3.showError("Something went wrong!");
                }
              case 22:
                _context.prev = 22;
                _this3.isLoading = false;
                return _context.finish(22);
              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[12, 19, 22, 25]]);
      }))();
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Area/EditArea.vue":
/*!**********************************************!*\
  !*** ./resources/js/views/Area/EditArea.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EditArea_vue_vue_type_template_id_792cea0a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EditArea.vue?vue&type=template&id=792cea0a */ "./resources/js/views/Area/EditArea.vue?vue&type=template&id=792cea0a");
/* harmony import */ var _EditArea_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EditArea.vue?vue&type=script&lang=js */ "./resources/js/views/Area/EditArea.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _EditArea_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _EditArea_vue_vue_type_template_id_792cea0a__WEBPACK_IMPORTED_MODULE_0__.render,
  _EditArea_vue_vue_type_template_id_792cea0a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Area/EditArea.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Area/EditArea.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/views/Area/EditArea.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditArea_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditArea.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/EditArea.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditArea_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Area/EditArea.vue?vue&type=template&id=792cea0a":
/*!****************************************************************************!*\
  !*** ./resources/js/views/Area/EditArea.vue?vue&type=template&id=792cea0a ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditArea_vue_vue_type_template_id_792cea0a__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditArea_vue_vue_type_template_id_792cea0a__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditArea_vue_vue_type_template_id_792cea0a__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditArea.vue?vue&type=template&id=792cea0a */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/EditArea.vue?vue&type=template&id=792cea0a");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/EditArea.vue?vue&type=template&id=792cea0a":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Area/EditArea.vue?vue&type=template&id=792cea0a ***!
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
  return _c("div", [
    _c("div", { staticClass: "page-heading" }, [
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
          _c("h3", [_vm._v(_vm._s(_vm.__("manage_area")))]),
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
                  [
                    _vm.area.id
                      ? [_vm._v(_vm._s(_vm.__("edit")))]
                      : [_vm._v(_vm._s(_vm.__("create")))],
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.__("area")) +
                        "\n                        "
                    ),
                  ],
                  2
                ),
              ]),
            ]
          ),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-md-6 col-sm-12 order-md-1 order-last" }, [
          _c("div", { staticClass: "card h-100" }, [
            _c("div", { staticClass: "card-header" }, [
              _c(
                "h4",
                [
                  _vm.area.id
                    ? [_vm._v(_vm._s(_vm.__("edit")))]
                    : [_vm._v(_vm._s(_vm.__("create")))],
                  _vm._v(
                    "\n                            " +
                      _vm._s(_vm.__("area")) +
                      "\n                        "
                  ),
                ],
                2
              ),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "card-body" }, [
              _c(
                "form",
                {
                  ref: "my-form",
                  attrs: { novalidate: "" },
                  on: {
                    submit: function ($event) {
                      $event.preventDefault()
                      return _vm.saveRecord.apply(null, arguments)
                    },
                  },
                },
                [
                  _c("div", { staticClass: "form-group" }, [
                    _c("label", { attrs: { for: "city_id" } }, [
                      _vm._v(_vm._s(_vm.__("zone"))),
                      _c("span", { staticClass: "text-danger text-sm" }, [
                        _vm._v("*"),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.area.city_id,
                            expression: "area.city_id",
                          },
                        ],
                        staticClass: "form-control form-select",
                        attrs: { name: "city_id", id: "city_id", required: "" },
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
                              _vm.area,
                              "city_id",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      [
                        _c("option", { attrs: { value: "" } }, [
                          _vm._v(_vm._s(_vm.__("select_zone"))),
                        ]),
                        _vm._v(" "),
                        _vm._l(_vm.cities, function (city) {
                          return _c(
                            "option",
                            { key: city.id, domProps: { value: city.id } },
                            [_vm._v(_vm._s(city.zone))]
                          )
                        }),
                      ],
                      2
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c("label", { attrs: { for: "name" } }, [
                      _vm._v(_vm._s(_vm.__("area_name"))),
                      _c("span", { staticClass: "text-danger text-sm" }, [
                        _vm._v("*"),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.area.name,
                          expression: "area.name",
                        },
                      ],
                      staticClass: "form-control",
                      attrs: {
                        type: "text",
                        name: "name",
                        id: "name",
                        placeholder: _vm.__("area_name"),
                        required: "",
                      },
                      domProps: { value: _vm.area.name },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(_vm.area, "name", $event.target.value)
                        },
                      },
                    }),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c("label", { attrs: { for: "pincode" } }, [
                      _vm._v(_vm._s(_vm.__("pincode"))),
                      _c("span", { staticClass: "text-danger text-sm" }, [
                        _vm._v("*"),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.area.pincode,
                          expression: "area.pincode",
                        },
                      ],
                      staticClass: "form-control",
                      attrs: {
                        type: "text",
                        name: "pincode",
                        id: "pincode",
                        placeholder: _vm.__("pincode"),
                        required: "",
                      },
                      domProps: { value: _vm.area.pincode },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(_vm.area, "pincode", $event.target.value)
                        },
                      },
                    }),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c("label", { attrs: { for: "state" } }, [
                      _vm._v(_vm._s(_vm.__("state_name"))),
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.area.state,
                          expression: "area.state",
                        },
                      ],
                      staticClass: "form-control",
                      attrs: {
                        type: "text",
                        name: "state",
                        id: "state",
                        placeholder: _vm.__("state_name"),
                      },
                      domProps: { value: _vm.area.state },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(_vm.area, "state", $event.target.value)
                        },
                      },
                    }),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c("label", { attrs: { for: "district" } }, [
                      _vm._v(_vm._s(_vm.__("district"))),
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.area.district,
                          expression: "area.district",
                        },
                      ],
                      staticClass: "form-control",
                      attrs: {
                        type: "text",
                        name: "district",
                        id: "district",
                        placeholder: _vm.__("district"),
                      },
                      domProps: { value: _vm.area.district },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(_vm.area, "district", $event.target.value)
                        },
                      },
                    }),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c("label", { attrs: { for: "status" } }, [
                      _vm._v(_vm._s(_vm.__("status"))),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.area.status,
                            expression: "area.status",
                          },
                        ],
                        staticClass: "form-control form-select",
                        attrs: { name: "status", id: "status" },
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
                              _vm.area,
                              "status",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      [
                        _c("option", { domProps: { value: 1 } }, [
                          _vm._v(_vm._s(_vm.__("active"))),
                        ]),
                        _vm._v(" "),
                        _c("option", { domProps: { value: 0 } }, [
                          _vm._v(_vm._s(_vm.__("inactive"))),
                        ]),
                      ]
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c(
                      "button",
                      {
                        staticClass: "btn btn-primary",
                        attrs: { type: "submit" },
                      },
                      [_vm._v(_vm._s(_vm.__("save")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "btn btn-secondary",
                        attrs: { type: "reset" },
                      },
                      [_vm._v(_vm._s(_vm.__("clear")))]
                    ),
                  ]),
                ]
              ),
            ]),
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