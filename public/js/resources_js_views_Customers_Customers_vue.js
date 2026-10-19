"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Customers_Customers_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
        "class": 'text-center'
      }, {
        key: 'shop_name',
        label: __('shop_name'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'email',
        label: __('email'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'mobile',
        label: __('mobile_no'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'balance',
        label: __('balance'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'verification_status',
        label: __('verification'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'status',
        label: __('status'),
        sortable: true,
        "class": 'text-center'
      },
      // Sarthi: retailers only ever log in via phone OTP, so the login-type
      // column is disabled. Kept for reference.
      // { key: 'type', label: __('type'), sortable: true, class: 'text-center' },
      {
        key: 'created_at',
        label: __('date_time'),
        sortable: true,
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
      customers: [],
      verificationFilter: 'all',
      verificationOptions: [{
        value: 'all',
        text: __('all')
      }, {
        value: 'pending',
        text: __('pending')
      }, {
        value: 'verified',
        text: __('verified')
      }]
    };
  },
  computed: {
    visibleCustomers: function visibleCustomers() {
      var _this = this;
      if (this.verificationFilter === 'pending') {
        return this.customers.filter(function (c) {
          return _this.isPending(c);
        });
      }
      if (this.verificationFilter === 'verified') {
        return this.customers.filter(function (c) {
          return _this.isVerified(c);
        });
      }
      return this.customers;
    },
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
  watch: {
    visibleCustomers: function visibleCustomers(list) {
      this.totalRows = list.length;
      this.currentPage = 1;
    }
  },
  mounted: function mounted() {
    // Set the initial number of items
    this.totalRows = this.customers.length;
  },
  created: function created() {
    var _this2 = this;
    this.$eventBus.$on('customersSaved', function (message) {
      _this2.showMessage("success", message);
      _this2.getCustomers();
      _this2.create_new = null;
    });
    this.getCustomers();
  },
  methods: {
    addFilter: function addFilter() {
      this.customers = [];
      this.totalRows = 1;
      this.currentPage = 1;
      this.offset = 0;
      this.getCustomers();
    },
    getCustomers: function getCustomers() {
      var _this3 = this;
      var vm = this;
      this.isLoading = true;
      axios.get(this.$apiUrl + '/customers').then(function (response) {
        _this3.isLoading = false;
        vm.isLoading = false;

        // shop_name lives on the retailer profile; lift it so the column can sort and search.
        _this3.customers = response.data.data.map(function (c) {
          var _c$retailer_profile;
          return _objectSpread(_objectSpread({}, c), {}, {
            shop_name: ((_c$retailer_profile = c.retailer_profile) === null || _c$retailer_profile === void 0 ? void 0 : _c$retailer_profile.shop_name) || '-'
          });
        });
        _this3.totalRows = _this3.visibleCustomers.length;
      })["catch"](function (error) {
        var _error$request;
        vm.isLoading = false;
        if ((_error$request = error.request) !== null && _error$request !== void 0 && _error$request.statusText) {
          var _error$request2;
          _this3.showError((_error$request2 = error.request) === null || _error$request2 === void 0 ? void 0 : _error$request2.statusText);
        } else if (error.message) {
          _this3.showError(error.message);
        } else {
          _this3.showError(__('something_went_wrong'));
        }
      });
    },
    onFiltered: function onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    // 'approved' and 'active' can both order; 'pending' / 'salesman_verified' are still waiting.
    isVerified: function isVerified(customer) {
      return ['approved', 'active'].includes(customer.verification_status);
    },
    isPending: function isPending(customer) {
      return ['pending', 'salesman_verified'].includes(customer.verification_status);
    },
    verifiedByText: function verifiedByText(customer) {
      var profile = customer.retailer_profile || {};
      if (profile.verified_by_admin_id) return __('verified_by_admin');
      if (profile.verified_by_salesman_id) return __('verified_by_salesman');
      return '';
    },
    verifyCustomer: function verifyCustomer(customer) {
      var _this4 = this;
      this.$swal.fire({
        title: __('verify_retailer'),
        text: __('verify_retailer_confirm'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (!result.value) return;
        _this4.isLoading = true;
        axios.post(_this4.$apiUrl + '/customers/verify', {
          id: customer.id
        }).then(function (response) {
          _this4.isLoading = false;
          if (response.data.status === 1) {
            _this4.showMessage("success", response.data.message);
            _this4.getCustomers();
          } else {
            _this4.showError(response.data.message);
          }
        })["catch"](function (error) {
          var _error$request3;
          _this4.isLoading = false;
          _this4.showError(((_error$request3 = error.request) === null || _error$request3 === void 0 ? void 0 : _error$request3.statusText) || error.message || __('something_went_wrong'));
        });
      });
    },
    updateStatusCustomer: function updateStatusCustomer(index, id) {
      var _this5 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_to_change_status'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (result.value) {
          _this5.isLoading = true;
          var postData = {
            id: id
          };
          axios.post(_this5.$apiUrl + '/customers/change', postData).then(function (response) {
            _this5.isLoading = false;
            _this5.getCustomers();
            _this5.showMessage("success", response.data.message);
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.list-action-btn.is-verify[data-v-0aa4382c]:hover {\n    color: #37a279 !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_style_index_0_id_0aa4382c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_style_index_0_id_0aa4382c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_style_index_0_id_0aa4382c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Customers/Customers.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/Customers/Customers.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Customers_vue_vue_type_template_id_0aa4382c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Customers.vue?vue&type=template&id=0aa4382c&scoped=true */ "./resources/js/views/Customers/Customers.vue?vue&type=template&id=0aa4382c&scoped=true");
/* harmony import */ var _Customers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Customers.vue?vue&type=script&lang=js */ "./resources/js/views/Customers/Customers.vue?vue&type=script&lang=js");
/* harmony import */ var _Customers_vue_vue_type_style_index_0_id_0aa4382c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css */ "./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Customers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Customers_vue_vue_type_template_id_0aa4382c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Customers_vue_vue_type_template_id_0aa4382c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0aa4382c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Customers/Customers.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Customers/Customers.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/views/Customers/Customers.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Customers.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css":
/*!************************************************************************************************************!*\
  !*** ./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_style_index_0_id_0aa4382c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=style&index=0&id=0aa4382c&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Customers/Customers.vue?vue&type=template&id=0aa4382c&scoped=true":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/Customers/Customers.vue?vue&type=template&id=0aa4382c&scoped=true ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_template_id_0aa4382c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_template_id_0aa4382c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Customers_vue_vue_type_template_id_0aa4382c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Customers.vue?vue&type=template&id=0aa4382c&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=template&id=0aa4382c&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=template&id=0aa4382c&scoped=true":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Customers/Customers.vue?vue&type=template&id=0aa4382c&scoped=true ***!
  \*************************************************************************************************************************************************************************************************************************************/
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
          _vm._v(_vm._s(_vm.__("retailers"))),
        ]),
        _vm._v(" "),
        _vm.$can("customer_create")
          ? _c(
              "router-link",
              {
                staticClass:
                  "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap",
                attrs: { to: "/users/create" },
              },
              [
                _c("i", {
                  staticClass: "fa fa-plus",
                  attrs: { "aria-hidden": "true" },
                }),
                _vm._v(" "),
                _c("span", [_vm._v(_vm._s(_vm.__("add_retailer")))]),
              ]
            )
          : _vm._e(),
      ],
      1
    ),
    _vm._v(" "),
    _c("div", { staticClass: "list-surface" }, [
      _c(
        "div",
        { staticClass: "list-toolbar" },
        [
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
                  click: function ($event) {
                    return _vm.addFilter()
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
          _c("b-form-select", {
            staticClass: "form-control form-select w-auto",
            attrs: { options: _vm.verificationOptions, size: "sm" },
            model: {
              value: _vm.verificationFilter,
              callback: function ($$v) {
                _vm.verificationFilter = $$v
              },
              expression: "verificationFilter",
            },
          }),
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
                  return _vm.getCustomers()
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
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "table-responsive" },
        [
          _c("b-table", {
            attrs: {
              items: _vm.visibleCustomers,
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
              filtered: _vm.onFiltered,
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
                      "\n                    " +
                        _vm._s(_vm._f("emailMask")(row.item.email)) +
                        "\n                "
                    ),
                  ]
                },
              },
              {
                key: "cell(mobile)",
                fn: function (row) {
                  return [
                    _vm._v(
                      "\n                    " +
                        _vm._s(_vm._f("mobileMask")(row.item.mobile)) +
                        "\n                "
                    ),
                  ]
                },
              },
              {
                key: "cell(status)",
                fn: function (row) {
                  return [
                    row.item.status == 1
                      ? _c("span", { staticClass: "badge bg-success" }, [
                          _vm._v(_vm._s(_vm.__("active"))),
                        ])
                      : _c("span", { staticClass: "badge bg-danger" }, [
                          _vm._v(_vm._s(_vm.__("deactive"))),
                        ]),
                  ]
                },
              },
              {
                key: "cell(verification_status)",
                fn: function (row) {
                  return [
                    _vm.isVerified(row.item)
                      ? _c(
                          "span",
                          {
                            directives: [
                              {
                                name: "b-tooltip",
                                rawName: "v-b-tooltip.hover",
                                modifiers: { hover: true },
                              },
                            ],
                            staticClass: "badge bg-success",
                            attrs: { title: _vm.verifiedByText(row.item) },
                          },
                          [_vm._v(_vm._s(_vm.__("verified")))]
                        )
                      : _vm.isPending(row.item)
                      ? _c(
                          "span",
                          { staticClass: "badge bg-warning text-dark" },
                          [_vm._v(_vm._s(_vm.__("pending")))]
                        )
                      : _c("span", [_vm._v("-")]),
                  ]
                },
              },
              {
                key: "cell(created_at)",
                fn: function (row) {
                  return [
                    _vm._v(
                      "\n                    " +
                        _vm._s(row.item.created_at) +
                        "\n                "
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
                      { staticClass: "list-actions" },
                      [
                        _vm.isPending(row.item) && _vm.$can("customer_verify")
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
                                staticClass: "list-action-btn is-verify",
                                attrs: { title: _vm.__("verify_retailer") },
                                on: {
                                  click: function ($event) {
                                    return _vm.verifyCustomer(row.item)
                                  },
                                },
                              },
                              [_c("i", { staticClass: "fa fa-check" })]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        row.item.verification_status &&
                        _vm.$can("customer_update")
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
                                staticClass: "list-action-btn is-edit",
                                attrs: {
                                  to: "/users/edit/" + row.item.id,
                                  title: _vm.__("edit"),
                                },
                              },
                              [_c("i", { staticClass: "fa fa-pencil-alt" })]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.$can("customer_update")
                          ? _c(
                              "a",
                              {
                                attrs: { href: "javascript:void(0)" },
                                on: {
                                  click: function ($event) {
                                    return _vm.updateStatusCustomer(
                                      row.index,
                                      row.item.id
                                    )
                                  },
                                },
                              },
                              [
                                row.item.status == 1
                                  ? _c(
                                      "span",
                                      { staticClass: "primary-toggal" },
                                      [
                                        _c("i", {
                                          staticClass: "fa fa-toggle-on fa-2x",
                                        }),
                                      ]
                                    )
                                  : _c("span", { staticClass: "text-danger" }, [
                                      _c("i", {
                                        staticClass: "fa fa-toggle-off fa-2x",
                                      }),
                                    ]),
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
                    on: { change: _vm.addFilter },
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