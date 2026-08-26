"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Seller_RegisteredSellers_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/RegisteredSellers.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/RegisteredSellers.vue?vue&type=script&lang=js ***!
  \*************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
        key: 'seller_info',
        label: __('seller_info'),
        "class": 'text-legt',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'store_info',
        label: __('store_details'),
        "class": 'text-left',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'categories_array',
        label: __('category'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'cities',
        label: __('city'),
        "class": 'text-center'
      }, {
        key: 'logo',
        label: __('logo'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'other_info',
        label: __('other_info'),
        "class": 'text-left',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'commission',
        label: __('commission'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'created_at',
        label: __('date'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'status',
        label: __('status'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'actions',
        label: __('actions')
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
      records: [],
      filterStatus: 0,
      currentLanguageId: null,
      activeLanguages: []
    };
  },
  computed: {
    translatedRecords: function translatedRecords() {
      var _this = this;
      if (!this.currentLanguageId || !Array.isArray(this.records)) {
        return this.records;
      }
      return this.records.map(function (seller) {
        var translatedSeller = _objectSpread({}, seller);
        if (seller.translations && Array.isArray(seller.translations)) {
          var translation = seller.translations.find(function (t) {
            return t.language_id === _this.currentLanguageId;
          });
          if (translation) {
            if (translation.name && translation.name.trim() !== '') {
              translatedSeller.name = translation.name;
            }
            if (translation.store_name && translation.store_name.trim() !== '') {
              translatedSeller.store_name = translation.store_name;
            }
          }
        }
        return translatedSeller;
      });
    }
  },
  created: function created() {
    var _this2 = this;
    this.category_id = this.$route.params.id;
    this.$eventBus.$on('recordSaved', function (message) {
      _this2.showMessage('success', message);
      _this2.getRecords();
    });
    this.fetchActiveLanguages().then(function () {
      _this2.getRecords();
    });
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var res, appLocale, currentLang, def;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return axios.get(_this3.$apiUrl + '/active_languages');
              case 3:
                res = _context.sent;
                if (res.data.status === 1 && Array.isArray(res.data.data)) {
                  _this3.activeLanguages = res.data.data;
                  appLocale = window.appLocale || 'en';
                  currentLang = _this3.activeLanguages.find(function (l) {
                    return l.code === appLocale;
                  });
                  if (currentLang) {
                    _this3.currentLanguageId = currentLang.id;
                  } else {
                    def = _this3.activeLanguages.find(function (l) {
                      return l.is_default === 1;
                    });
                    if (def) _this3.currentLanguageId = def.id;
                  }
                }
                _context.next = 10;
                break;
              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                console.error('Language load failed', _context.t0);
              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }))();
    },
    strip_tags: function strip_tags(input) {
      return input.replace(/<\/?[^>]+(>|$)/g, "");
    },
    getRecords: function getRecords() {
      var _this4 = this;
      this.isLoading = true;
      axios.get(this.$apiUrl + '/sellers', {
        params: {
          filterStatus: this.filterStatus,
          search: this.filter
        }
      }).then(function (response) {
        _this4.isLoading = false;
        var data = response.data;
        _this4.records = data.data;
        _this4.totalRows = _this4.records.length;
      });
    },
    updateStatus: function updateStatus(index, id, selectedStatus) {
      var _this5 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_be_able_to_revert_this'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2(result) {
          var remarks, _yield$_this5$$swal$f, text, postData;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  if (!result.value) {
                    _context2.next = 9;
                    break;
                  }
                  remarks = "";
                  if (!(selectedStatus === 2)) {
                    _context2.next = 8;
                    break;
                  }
                  _context2.next = 5;
                  return _this5.$swal.fire({
                    title: __('remarks'),
                    input: 'textarea',
                    /*inputLabel: 'Remarks',*/
                    inputPlaceholder: 'Type your remarks here...',
                    inputAttributes: {
                      'aria-label': 'Type your remarks here'
                    },
                    confirmButtonText: "Submit",
                    cancelButtonText: "Cancel",
                    showCancelButton: true,
                    inputValidator: function inputValidator(value) {
                      return new Promise(function (resolve) {
                        if (value !== '') {
                          resolve();
                        } else {
                          resolve('The Remarks field is required');
                        }
                      });
                    }
                  });
                case 5:
                  _yield$_this5$$swal$f = _context2.sent;
                  text = _yield$_this5$$swal$f.value;
                  if (text) {
                    remarks = text;
                  }
                case 8:
                  if (selectedStatus === 1 || selectedStatus === 2 && remarks !== "") {
                    _this5.isLoading = true;
                    postData = {
                      id: id,
                      status: selectedStatus,
                      remark: remarks
                    };
                    axios.post(_this5.$apiUrl + '/sellers/update_status', postData).then(function (response) {
                      _this5.isLoading = false;
                      var data = response.data;
                      _this5.getRecords();
                      _this5.showMessage('success', data.message);
                    });
                  }
                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    },
    deleteSeller: function deleteSeller(index, id) {
      var _this6 = this;
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
          _this6.isLoading = true;
          var postData = {
            id: id
          };
          axios.post(_this6.$apiUrl + '/sellers/delete', postData).then(function (response) {
            _this6.isLoading = false;
            var data = response.data;
            _this6.records.splice(index, 1);
            _this6.showSuccess(data.message);
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Seller/RegisteredSellers.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/Seller/RegisteredSellers.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _RegisteredSellers_vue_vue_type_template_id_9bfccb3e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RegisteredSellers.vue?vue&type=template&id=9bfccb3e */ "./resources/js/views/Seller/RegisteredSellers.vue?vue&type=template&id=9bfccb3e");
/* harmony import */ var _RegisteredSellers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./RegisteredSellers.vue?vue&type=script&lang=js */ "./resources/js/views/Seller/RegisteredSellers.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _RegisteredSellers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _RegisteredSellers_vue_vue_type_template_id_9bfccb3e__WEBPACK_IMPORTED_MODULE_0__.render,
  _RegisteredSellers_vue_vue_type_template_id_9bfccb3e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Seller/RegisteredSellers.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Seller/RegisteredSellers.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/Seller/RegisteredSellers.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RegisteredSellers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RegisteredSellers.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/RegisteredSellers.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_RegisteredSellers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Seller/RegisteredSellers.vue?vue&type=template&id=9bfccb3e":
/*!***************************************************************************************!*\
  !*** ./resources/js/views/Seller/RegisteredSellers.vue?vue&type=template&id=9bfccb3e ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_RegisteredSellers_vue_vue_type_template_id_9bfccb3e__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_RegisteredSellers_vue_vue_type_template_id_9bfccb3e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_RegisteredSellers_vue_vue_type_template_id_9bfccb3e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./RegisteredSellers.vue?vue&type=template&id=9bfccb3e */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/RegisteredSellers.vue?vue&type=template&id=9bfccb3e");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/RegisteredSellers.vue?vue&type=template&id=9bfccb3e":
/*!******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/RegisteredSellers.vue?vue&type=template&id=9bfccb3e ***!
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
    _c("div", { staticClass: "page-head" }, [
      _c("h3", { staticClass: "page-head-title" }, [
        _vm._v(_vm._s(_vm.__("seller_requests"))),
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
              items: _vm.translatedRecords,
              fields: _vm.fields,
              "current-page": _vm.currentPage,
              "per-page": _vm.perPage,
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
                key: "cell(email)",
                fn: function (row) {
                  return [
                    _vm._v(
                      "\n                                " +
                        _vm._s(_vm._f("emailMask")(row.item.email)) +
                        "\n                            "
                    ),
                  ]
                },
              },
              {
                key: "cell(mobile)",
                fn: function (row) {
                  return [
                    _vm._v(
                      "\n                                " +
                        _vm._s(_vm._f("mobileMask")(row.item.mobile)) +
                        "\n                            "
                    ),
                  ]
                },
              },
              {
                key: "cell(seller_info)",
                fn: function (row) {
                  return [
                    _c(
                      "small",
                      {
                        staticClass:
                          "d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2",
                        attrs: { id: "seller" + row.item.id },
                      },
                      [_c("i", { staticClass: "fa fa-info-circle" })]
                    ),
                    _vm._v(" "),
                    _c(
                      "b-popover",
                      {
                        attrs: {
                          target: "seller" + row.item.id,
                          triggers: "hover",
                          placement: "left",
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "title",
                              fn: function () {
                                return [
                                  _vm._v(
                                    "\n                                       " +
                                      _vm._s(_vm.__("sellr_details")) +
                                      "\n                                    "
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      },
                      [
                        _vm._v(" "),
                        _c("table", { staticClass: "table table-borderless" }, [
                          _c("tr", [
                            _c("th", [_vm._v(" " + _vm._s(_vm.__("name")))]),
                            _vm._v(" "),
                            _c("td", [_vm._v(" : " + _vm._s(row.item.name))]),
                          ]),
                          _vm._v(" "),
                          _c("tr", [
                            _c("th", [_vm._v(" " + _vm._s(_vm.__("email")))]),
                            _vm._v(" "),
                            _c("td", [_vm._v(" : " + _vm._s(row.item.email))]),
                          ]),
                          _vm._v(" "),
                          _c("tr", [
                            _c("th", [_vm._v(" " + _vm._s(_vm.__("mobile")))]),
                            _vm._v(" "),
                            _c("td", [_vm._v(" : " + _vm._s(row.item.mobile))]),
                          ]),
                        ]),
                      ]
                    ),
                    _vm._v(
                      "\n                                " +
                        _vm._s(row.item.name) +
                        "\n                            "
                    ),
                  ]
                },
              },
              {
                key: "cell(store_info)",
                fn: function (row) {
                  return [
                    _c(
                      "small",
                      {
                        staticClass:
                          "d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2",
                        attrs: { id: "store" + row.item.id },
                      },
                      [_c("i", { staticClass: "fa fa-info-circle" })]
                    ),
                    _vm._v(" "),
                    _c(
                      "b-popover",
                      {
                        attrs: {
                          target: "store" + row.item.id,
                          triggers: "hover",
                          placement: "left",
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "title",
                              fn: function () {
                                return [
                                  _vm._v(
                                    "\n                                        " +
                                      _vm._s(_vm.__("store_details")) +
                                      "\n                                    "
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      },
                      [
                        _vm._v(" "),
                        _c("table", { staticClass: "table table-borderless" }, [
                          _c("tr", [
                            _c("th", [_vm._v(" " + _vm._s(_vm.__("name")))]),
                            _vm._v(" "),
                            _c("td", [
                              _vm._v(" : " + _vm._s(row.item.store_name)),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("tr", [
                            _c("th", [_vm._v(" " + _vm._s(_vm.__("url")))]),
                            _vm._v(" "),
                            _c("td", [
                              _vm._v(" : " + _vm._s(row.item.store_url)),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("tr", [
                            _c("th", [
                              _vm._v(" " + _vm._s(_vm.__("description"))),
                            ]),
                            _vm._v(" "),
                            _c("td", [
                              _vm._v(
                                " : " +
                                  _vm._s(
                                    _vm.strip_tags(row.item.store_description)
                                  )
                              ),
                            ]),
                          ]),
                        ]),
                      ]
                    ),
                    _vm._v(
                      "\n                                " +
                        _vm._s(row.item.store_name) +
                        "\n                            "
                    ),
                  ]
                },
              },
              {
                key: "cell(cities)",
                fn: function (row) {
                  return [
                    row.item.cities && row.item.cities.length
                      ? _c("span", [
                          _vm._v(
                            "\n                                    " +
                              _vm._s(
                                row.item.cities
                                  .map(function (c) {
                                    return c.zone
                                  })
                                  .filter(Boolean)
                                  .join(", ")
                              ) +
                              "\n                                "
                          ),
                        ])
                      : _vm._e(),
                  ]
                },
              },
              {
                key: "cell(other_info)",
                fn: function (row) {
                  return [
                    _c(
                      "small",
                      {
                        staticClass:
                          "d-inline-flex mb-3 px-2 py-1 text-muted bg-secondary bg-opacity-10 border border-secondary border-opacity-10 rounded-2",
                        attrs: { id: "other" + row.item.id },
                      },
                      [_c("i", { staticClass: "fa fa-info-circle" })]
                    ),
                    _vm._v(" "),
                    _c(
                      "b-popover",
                      {
                        attrs: {
                          target: "other" + row.item.id,
                          triggers: "hover",
                          placement: "left",
                        },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "title",
                              fn: function () {
                                return [
                                  _vm._v(
                                    "\n                                         " +
                                      _vm._s(_vm.__("store_details")) +
                                      "\n                                    "
                                  ),
                                ]
                              },
                              proxy: true,
                            },
                          ],
                          null,
                          true
                        ),
                      },
                      [
                        _vm._v(" "),
                        _c("table", { staticClass: "table table-borderless" }, [
                          _c("tr", [
                            _c("th", [_vm._v(_vm._s(_vm.__("tax_name")))]),
                            _vm._v(" "),
                            _c("td", [
                              _vm._v(" : " + _vm._s(row.item.tax_name)),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("tr", [
                            _c("th", [_vm._v(" " + _vm._s(_vm.__("tax_no")))]),
                            _vm._v(" "),
                            _c("td", [
                              _vm._v(" : " + _vm._s(row.item.tax_number)),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("tr", [
                            _c("th", [_vm._v(" " + _vm._s(_vm.__("pan_no")))]),
                            _vm._v(" "),
                            _c("td", [
                              _vm._v(" : " + _vm._s(row.item.pan_number)),
                            ]),
                          ]),
                          _vm._v(" "),
                          row.item.bank_name
                            ? _c("tr", [
                                _c("th", [
                                  _vm._v(" " + _vm._s(_vm.__("bank_name"))),
                                ]),
                                _vm._v(" "),
                                _c("td", [
                                  _vm._v(" : " + _vm._s(row.item.bank_name)),
                                ]),
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          row.item.account_number
                            ? _c("tr", [
                                _c("th", [
                                  _vm._v(
                                    " " + _vm._s(_vm.__("account_number"))
                                  ),
                                ]),
                                _vm._v(" "),
                                _c("td", [
                                  _vm._v(
                                    " : " + _vm._s(row.item.account_number)
                                  ),
                                ]),
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          row.item.bank_ifsc_code || row.item.ifsc_code
                            ? _c("tr", [
                                _c("th", [
                                  _vm._v(
                                    " " + _vm._s(_vm.__("bank_ifsc_code"))
                                  ),
                                ]),
                                _vm._v(" "),
                                _c("td", [
                                  _vm._v(
                                    " : " +
                                      _vm._s(
                                        row.item.bank_ifsc_code ||
                                          row.item.ifsc_code
                                      )
                                  ),
                                ]),
                              ])
                            : _vm._e(),
                        ]),
                        _vm._v(" "),
                        _c("p", [
                          _c(
                            "a",
                            {
                              staticClass: "badge bg-success",
                              attrs: {
                                target: "_blank",
                                href: row.item.national_identity_card_url,
                              },
                            },
                            [
                              _c("i", { staticClass: "fa fa-eye" }),
                              _vm._v(
                                "  " + _vm._s(_vm.__("national_identity_card"))
                              ),
                            ]
                          ),
                        ]),
                        _vm._v(" "),
                        _c("p", [
                          _c(
                            "a",
                            {
                              staticClass: "badge bg-success",
                              attrs: {
                                target: "_blank",
                                href: row.item.address_proof_url,
                              },
                            },
                            [
                              _c("i", { staticClass: "fa fa-eye" }),
                              _vm._v(
                                "  " + _vm._s(_vm.__("address_proof")) + " "
                              ),
                            ]
                          ),
                        ]),
                      ]
                    ),
                    _vm._v(
                      "\n                                " +
                        _vm._s(row.item.store_name) +
                        "\n                            "
                    ),
                  ]
                },
              },
              {
                key: "cell(logo)",
                fn: function (row) {
                  return [
                    !row.item.logo
                      ? _c("span", [_vm._v(_vm._s(_vm.__("no_image")))])
                      : _c("img", {
                          attrs: {
                            src: _vm.$storageUrl + row.item.logo,
                            height: "50",
                          },
                        }),
                  ]
                },
              },
              {
                key: "cell(created_at)",
                fn: function (row) {
                  return [
                    _vm._v(
                      "\n                                " +
                        _vm._s(row.item.created_at) +
                        "\n                            "
                    ),
                  ]
                },
              },
              {
                key: "cell(status)",
                fn: function (row) {
                  return [
                    row.item.status == 0
                      ? _c("label", { staticClass: "badge bg-primary" }, [
                          _vm._v(_vm._s(_vm.__("registered"))),
                        ])
                      : row.item.status == 1
                      ? _c("label", { staticClass: "badge bg-success" }, [
                          _vm._v(_vm._s(_vm.__("approved"))),
                        ])
                      : row.item.status == 2
                      ? _c("label", { staticClass: "badge bg-warning" }, [
                          _vm._v(_vm._s(_vm.__("reject"))),
                        ])
                      : row.item.status == 3
                      ? _c("label", { staticClass: "badge bg-danger" }, [
                          _vm._v(_vm._s(_vm.__("deactive"))),
                        ])
                      : row.item.status == 7
                      ? _c("label", { staticClass: "badge bg-danger" }, [
                          _vm._v(_vm._s(_vm.__("removed"))),
                        ])
                      : _vm._e(),
                  ]
                },
              },
              {
                key: "cell(require_products_approval)",
                fn: function (row) {
                  return [
                    row.item.require_products_approval == 1
                      ? _c("label", { staticClass: "badge bg-success" }, [
                          _vm._v(_vm._s(_vm.__("yes"))),
                        ])
                      : row.item.require_products_approval == 0
                      ? _c("label", { staticClass: "badge bg-danger" }, [
                          _vm._v(_vm._s(_vm.__("no"))),
                        ])
                      : _vm._e(),
                  ]
                },
              },
              {
                key: "cell(actions)",
                fn: function (row) {
                  return [
                    _c("div", { staticClass: "list-actions" }, [
                      _vm.$can("seller_delete")
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
                              staticClass: "btn btn-sm btn-success",
                              attrs: { type: "button", title: "Change Status" },
                              on: {
                                click: function ($event) {
                                  return _vm.updateStatus(
                                    row.index,
                                    row.item.id,
                                    1
                                  )
                                },
                              },
                            },
                            [
                              _vm._v(
                                "\n                                         " +
                                  _vm._s(_vm.__("approved")) +
                                  "\n                                    "
                              ),
                            ]
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.$can("seller_delete")
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
                              attrs: { type: "button", title: "Change Status" },
                              on: {
                                click: function ($event) {
                                  return _vm.updateStatus(
                                    row.index,
                                    row.item.id,
                                    2
                                  )
                                },
                              },
                            },
                            [
                              _vm._v(
                                "\n                                         " +
                                  _vm._s(_vm.__("reject")) +
                                  "\n                                    "
                              ),
                            ]
                          )
                        : _vm._e(),
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