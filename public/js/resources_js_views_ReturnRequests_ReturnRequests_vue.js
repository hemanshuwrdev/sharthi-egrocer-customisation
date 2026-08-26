"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_ReturnRequests_ReturnRequests_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/Edit.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/Edit.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Auth.js */ "./resources/js/Auth.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  props: ['record'],
  data: function data() {
    return {
      isLoading: false,
      login_user: _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user,
      deliveryBoys: '',
      delivery_boy_id: '',
      returnRequest: {
        id: this.record ? this.record.id : null,
        status: this.record ? this.record.status : "",
        order_id: this.record ? this.record.order_id : "",
        delivery_boy_id: this.record ? this.record.delivery_boy_id : 0,
        remark: this.record ? this.record.remarks : "",
        cancellation_reason: this.record ? this.record.cancellation_reason : ""
      }
    };
  },
  computed: {
    modal_title: function modal_title() {
      var title = this.returnRequest.id ? __('edit') : __('add');
      title += ' ' + __('return_requests');
      return title;
    }
  },
  methods: {
    getDisplayName: function getDisplayName(name) {
      if (name == null) return '';
      if (typeof name === 'string') return name;
      if (_typeof(name) === 'object' && !Array.isArray(name)) {
        var appLocale = window.appLocale || window.localStorage && window.localStorage.getItem('lang') || 'en';
        var forLocale = name[appLocale];
        if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
        var firstNonEmpty = Object.values(name).find(function (val) {
          return val != null && String(val).trim() !== '';
        });
        return firstNonEmpty != null ? String(firstNonEmpty).trim() : '';
      }
      return '';
    },
    showModal: function showModal() {
      this.$refs['my-modal'].show();
      this.getOrder();
    },
    hideModal: function hideModal() {
      this.$refs['my-modal'].hide();
    },
    getOrder: function getOrder() {
      var _this = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/orders/view/' + this.record.order_id).then(function (response) {
        _this.isLoading = false;
        var data = response.data;
        if (data.status === 1) {
          _this.deliveryBoys = response.data.data.deliveryBoys;
        } else {
          _this.showError(data.message);
          setTimeout(function () {
            _this.$router.back();
          }, 1000);
        }
      })["catch"](function (error) {
        _this.isLoading = false;
        if (error.request.statusText) {
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
      var formObject = this.returnRequest;
      var formData = new FormData();
      for (var key in formObject) {
        formData.append(key, formObject[key]);
      }

      // Determine API endpoint based on user role
      var url = this.$apiUrl + '/return_requests/update';
      if (this.login_user.role_id == 3) {
        // Seller
        url = this.$apiUrl + '/seller/return_request_status_update';
      } else if (this.login_user.role_id == 4) {
        // Delivery Boy
        url = this.$apiUrl + '/delivery_boy/return_request_status_update';
      }
      // Admin (role_id 1, 2) uses default /return_requests/update

      axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, formData).then(function (res) {
        var data = res.data;
        if (data.status === 1) {
          _this2.$eventBus.$emit('returnRequestSaved', data.message);
          _this2.hideModal();
        } else {
          vm.showError(data.message);
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
  },
  mounted: function mounted() {
    this.showModal();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit */ "./resources/js/views/ReturnRequests/Edit.vue");
/* harmony import */ var _Auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Auth.js */ "./resources/js/Auth.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    'app-edit-record': _Edit__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      login_user: _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user,
      fields: [{
        key: 'id',
        label: __('id'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'user_id',
        label: __('user_id'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'name',
        label: __('name'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'product_name',
        label: __('product_name'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'variant_name',
        label: __('variant'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'quantity',
        label: __('quantity'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'sub_total',
        label: __('total'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'status',
        label: __('status'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'reason',
        label: __('reason'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'created_at',
        label: __('date'),
        sortable: true,
        "class": 'text-center'
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
      create_new: null,
      edit_record: null,
      returnRequests: []
    };
  },
  computed: {
    appLocale: function appLocale() {
      return typeof window !== 'undefined' && (window.appLocale || window.localStorage && window.localStorage.getItem('lang')) || 'en';
    },
    returnRequestsForTable: function returnRequestsForTable() {
      return this.returnRequests || [];
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
  mounted: function mounted() {
    // totalRows set in getReturnRequests when data loads
  },
  created: function created() {
    var _this = this;
    this._handleReturnRequestSaved = function (message) {
      _this.showMessage("success", message);
      _this.getReturnRequests();
      _this.create_new = null;
    };
    this.$eventBus.$on('returnRequestSaved', this._handleReturnRequestSaved);
    this.getReturnRequests();
  },
  beforeDestroy: function beforeDestroy() {
    this.$eventBus.$off('returnRequestSaved', this._handleReturnRequestSaved);
  },
  watch: {
    filter: function filter() {
      this.currentPage = 1;
      this.getReturnRequests();
    },
    currentPage: function currentPage() {
      if (this.login_user.role_id == 3 || this.login_user.role_id == 4) {
        this.getReturnRequests();
      }
    },
    perPage: function perPage() {
      this.currentPage = 1;
      if (this.login_user.role_id == 3 || this.login_user.role_id == 4) {
        this.getReturnRequests();
      }
    }
  },
  methods: {
    getReturnRequests: function getReturnRequests() {
      var _this2 = this;
      this.isLoading = true;
      var apiEndpoint = '/return_requests';
      if (this.login_user.role_id == 3) {
        // Seller
        apiEndpoint = '/seller/return_requests';
      } else if (this.login_user.role_id == 4) {
        // Delivery Boy
        apiEndpoint = '/delivery_boy/return_requests';
      }
      var isPaginatedApi = this.login_user.role_id == 3 || this.login_user.role_id == 4;
      var offset = isPaginatedApi ? (this.currentPage - 1) * this.perPage : 0;
      var limit = isPaginatedApi ? this.perPage : 1000;
      var url = this.$apiUrl + apiEndpoint + "?search=" + encodeURIComponent(this.filter || "");
      if (isPaginatedApi) {
        url += "&offset=" + offset + "&limit=" + limit;
      }
      axios.get(url).then(function (response) {
        _this2.returnRequests = response.data.data || [];
        _this2.totalRows = isPaginatedApi && response.data.total ? response.data.total : _this2.returnRequests.length;
        _this2.isLoading = false;
      });
    },
    deleteReturnRequests: function deleteReturnRequests(index, id) {
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
          var apiEndpoint = '/return_requests/delete';
          if (_this3.login_user.role_id == 3) {
            apiEndpoint = '/seller/return_requests_delete';
          }
          axios.post(_this3.$apiUrl + apiEndpoint, postData).then(function (response) {
            _this3.isLoading = false;
            _this3.returnRequests.splice(index, 1);
            _this3.showSuccess(response.data.message);
          });
        }
      });
    },
    hideModal: function hideModal() {
      this.create_new = false;
      this.edit_record = false;
    }
  }
});

/***/ }),

/***/ "./resources/js/views/ReturnRequests/Edit.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/ReturnRequests/Edit.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue_vue_type_template_id_69073a76__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=69073a76 */ "./resources/js/views/ReturnRequests/Edit.vue?vue&type=template&id=69073a76");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js */ "./resources/js/views/ReturnRequests/Edit.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_69073a76__WEBPACK_IMPORTED_MODULE_0__.render,
  _Edit_vue_vue_type_template_id_69073a76__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/ReturnRequests/Edit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/ReturnRequests/ReturnRequests.vue":
/*!**************************************************************!*\
  !*** ./resources/js/views/ReturnRequests/ReturnRequests.vue ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ReturnRequests_vue_vue_type_template_id_763d8f80__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ReturnRequests.vue?vue&type=template&id=763d8f80 */ "./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=template&id=763d8f80");
/* harmony import */ var _ReturnRequests_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ReturnRequests.vue?vue&type=script&lang=js */ "./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ReturnRequests_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ReturnRequests_vue_vue_type_template_id_763d8f80__WEBPACK_IMPORTED_MODULE_0__.render,
  _ReturnRequests_vue_vue_type_template_id_763d8f80__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/ReturnRequests/ReturnRequests.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/ReturnRequests/Edit.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/views/ReturnRequests/Edit.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/Edit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=script&lang=js":
/*!**************************************************************************************!*\
  !*** ./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=script&lang=js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ReturnRequests.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/ReturnRequests/Edit.vue?vue&type=template&id=69073a76":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/ReturnRequests/Edit.vue?vue&type=template&id=69073a76 ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_69073a76__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_69073a76__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_69073a76__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=template&id=69073a76 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/Edit.vue?vue&type=template&id=69073a76");


/***/ }),

/***/ "./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=template&id=763d8f80":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=template&id=763d8f80 ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_template_id_763d8f80__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_template_id_763d8f80__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_template_id_763d8f80__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ReturnRequests.vue?vue&type=template&id=763d8f80 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=template&id=763d8f80");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/Edit.vue?vue&type=template&id=69073a76":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/Edit.vue?vue&type=template&id=69073a76 ***!
  \*************************************************************************************************************************************************************************************************************************/
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
    "b-modal",
    {
      ref: "my-modal",
      attrs: { title: _vm.modal_title, "no-fade": "", static: "", size: "lg" },
      on: {
        hidden: function ($event) {
          return _vm.$emit("modalClose")
        },
      },
    },
    [
      _c(
        "div",
        { attrs: { slot: "modal-footer" }, slot: "modal-footer" },
        [
          _c(
            "b-button",
            {
              attrs: { variant: "primary", disabled: _vm.isLoading },
              on: {
                click: function ($event) {
                  return _vm.$refs["dummy_submit"].click()
                },
              },
            },
            [
              _vm._v(_vm._s(_vm.__("save")) + "\n            "),
              _vm.isLoading
                ? _c("b-spinner", { attrs: { small: "", label: "Spinning" } })
                : _vm._e(),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "b-button",
            { attrs: { variant: "secondary" }, on: { click: _vm.hideModal } },
            [_vm._v(_vm._s(_vm.__("cancel")))]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "form",
        {
          ref: "my-form",
          on: {
            submit: function ($event) {
              $event.preventDefault()
              return _vm.saveRecord.apply(null, arguments)
            },
          },
        },
        [
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "col-md-12" }, [
              _c("div", { staticClass: "form-group" }, [
                _c("label", { staticClass: "form-label fw-bold mb-3" }, [
                  _vm._v(_vm._s(_vm.__("status")) + " "),
                  _c("span", { staticClass: "text-danger" }, [_vm._v("*")]),
                ]),
                _vm._v(" "),
                _vm.login_user.role_id == 3
                  ? _c("div", { staticClass: "row g-2" }, [
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "1"
                                  ? "border-warning bg-warning bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "1"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("↻"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("pending"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "4"
                                  ? "border-info bg-info bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "4"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("👤"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(
                                      _vm._s(_vm.__("delivery_boy_assigned"))
                                    ),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "2"
                                  ? "border-success bg-success bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "2"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("✅"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("approve"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "3"
                                  ? "border-danger bg-danger bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "3"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("❌"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("reject"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                    ])
                  : _vm.login_user.role_id == 4
                  ? _c("div", { staticClass: "row g-2" }, [
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "5"
                                  ? "border-primary bg-primary bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "5"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("🚚"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("out_for_pickup"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "6"
                                  ? "border-secondary bg-secondary bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "6"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("📦"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(
                                      _vm._s(_vm.__("received_from_customer"))
                                    ),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "8"
                                  ? "border-dark bg-dark bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "8"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("🏬"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("return_to_seller"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "7"
                                  ? "border-danger bg-danger bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "7"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("🚫"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("cancelled"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                    ])
                  : _c("div", { staticClass: "row g-2" }, [
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "1"
                                  ? "border-warning bg-warning bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "1"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("↻"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("pending"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "4"
                                  ? "border-info bg-info bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "4"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("👤"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(
                                      _vm._s(_vm.__("delivery_boy_assigned"))
                                    ),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "5"
                                  ? "border-primary bg-primary bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "5"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("🚚"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("out_for_pickup"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "6"
                                  ? "border-secondary bg-secondary bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "6"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("📦"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(
                                      _vm._s(_vm.__("received_from_customer"))
                                    ),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "8"
                                  ? "border-dark bg-dark bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "8"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("🏬"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("return_to_seller"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "2"
                                  ? "border-success bg-success bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "2"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("✅"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("approve"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "3"
                                  ? "border-danger bg-danger bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "3"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("❌"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("reject"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "col-lg-3 col-md-4 col-sm-6 mb-2" },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "card h-100 border-2",
                              class:
                                _vm.returnRequest.status == "7"
                                  ? "border-danger bg-danger bg-opacity-10"
                                  : "border-light",
                              on: {
                                click: function ($event) {
                                  _vm.returnRequest.status = "7"
                                },
                              },
                            },
                            [
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "card-body text-center d-flex flex-column justify-content-center align-items-center p-3",
                                },
                                [
                                  _c("div", { staticClass: "mb-2 fs-4" }, [
                                    _vm._v("🚫"),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "fw-bold small" }, [
                                    _vm._v(_vm._s(_vm.__("cancelled"))),
                                  ]),
                                ]
                              ),
                            ]
                          ),
                        ]
                      ),
                    ]),
              ]),
              _vm._v(" "),
              _c("input", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.returnRequest.order_id,
                    expression: "returnRequest.order_id",
                  },
                ],
                attrs: { type: "hidden" },
                domProps: { value: _vm.returnRequest.order_id },
                on: {
                  input: function ($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.returnRequest, "order_id", $event.target.value)
                  },
                },
              }),
              _vm._v(" "),
              _vm.returnRequest.status == 4 && _vm.login_user.role_id != 4
                ? _c("div", { staticClass: "form-group mt-4" }, [
                    _c(
                      "label",
                      {
                        staticClass: "form-label fw-bold",
                        attrs: { for: "delivery_boy_id" },
                      },
                      [
                        _vm._v(_vm._s(_vm.__("assign_delivery_boy")) + " "),
                        _c("span", { staticClass: "text-danger" }, [
                          _vm._v("*"),
                        ]),
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.returnRequest.delivery_boy_id,
                            expression: "returnRequest.delivery_boy_id",
                          },
                        ],
                        staticClass: "form-control form-select",
                        attrs: {
                          id: "delivery_boy_id",
                          name: "delivery_boy_id",
                          required: "",
                        },
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
                              _vm.returnRequest,
                              "delivery_boy_id",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          },
                        },
                      },
                      [
                        _c("option", { attrs: { value: "" } }, [
                          _vm._v(_vm._s(_vm.__("select_delivery_boy"))),
                        ]),
                        _vm._v(" "),
                        _vm._l(_vm.deliveryBoys, function (boy) {
                          return _c(
                            "option",
                            { key: boy.id, domProps: { value: boy.id } },
                            [_vm._v(_vm._s(_vm.getDisplayName(boy.name)))]
                          )
                        }),
                      ],
                      2
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.returnRequest.status == 7
                ? _c("div", { staticClass: "form-group mt-4" }, [
                    _c(
                      "label",
                      {
                        staticClass: "form-label fw-bold",
                        attrs: { for: "cancellation_reason" },
                      },
                      [
                        _vm._v(_vm._s(_vm.__("cancellation_reason")) + " "),
                        _c("span", { staticClass: "text-danger" }, [
                          _vm._v("*"),
                        ]),
                      ]
                    ),
                    _vm._v(" "),
                    _c("textarea", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.returnRequest.cancellation_reason,
                          expression: "returnRequest.cancellation_reason",
                        },
                      ],
                      staticClass: "form-control",
                      attrs: {
                        name: "cancellation_reason",
                        id: "cancellation_reason",
                        placeholder: "Enter cancellation reason",
                        rows: "3",
                        required: "",
                      },
                      domProps: {
                        value: _vm.returnRequest.cancellation_reason,
                      },
                      on: {
                        input: function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.returnRequest,
                            "cancellation_reason",
                            $event.target.value
                          )
                        },
                      },
                    }),
                  ])
                : _vm._e(),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-md-12 mt-4" }, [
              _c("div", { staticClass: "form-group" }, [
                _c(
                  "label",
                  {
                    staticClass: "form-label fw-bold",
                    attrs: { for: "remark" },
                  },
                  [_vm._v(_vm._s(_vm.__("remark")))]
                ),
                _vm._v(" "),
                _c("textarea", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.returnRequest.remark,
                      expression: "returnRequest.remark",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: {
                    name: "remark",
                    id: "remark",
                    placeholder: "Enter Remark",
                    rows: "3",
                  },
                  domProps: { value: _vm.returnRequest.remark },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.returnRequest, "remark", $event.target.value)
                    },
                  },
                }),
              ]),
            ]),
          ]),
          _vm._v(" "),
          _c("button", {
            ref: "dummy_submit",
            staticStyle: { display: "none" },
          }),
        ]
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=template&id=763d8f80":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ReturnRequests/ReturnRequests.vue?vue&type=template&id=763d8f80 ***!
  \***********************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "list-page" },
    [
      _c("div", { staticClass: "page-head" }, [
        _c("h3", { staticClass: "page-head-title" }, [
          _vm._v(_vm._s(_vm.__("return_requests"))),
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
                  return _vm.getReturnRequests()
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
                items: _vm.returnRequestsForTable,
                fields: _vm.fields,
                "current-page": _vm.currentPage,
                "per-page": _vm.perPage,
                "sort-direction": _vm.sortDirection,
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
                  key: "head(price)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                    " +
                          _vm._s("Price (" + _vm.$currency + ")") +
                          "\n                "
                      ),
                    ]
                  },
                },
                {
                  key: "head(discounted_price)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                    " +
                          _vm._s("Discounted Price (" + _vm.$currency + ")") +
                          "\n                "
                      ),
                    ]
                  },
                },
                {
                  key: "cell(status)",
                  fn: function (row) {
                    return [
                      row.item.status === 1
                        ? _c("span", { staticClass: "badge bg-warning" }, [
                            _vm._v(_vm._s(_vm.__("pending"))),
                          ])
                        : row.item.status === 2
                        ? _c("span", { staticClass: "badge bg-success" }, [
                            _vm._v(_vm._s(_vm.__("approved"))),
                          ])
                        : row.item.status === 3
                        ? _c("span", { staticClass: "badge bg-danger" }, [
                            _vm._v(_vm._s(_vm.__("rejected"))),
                          ])
                        : row.item.status === 4
                        ? _c("span", { staticClass: "badge bg-info" }, [
                            _vm._v(_vm._s(_vm.__("delivery_boy_assigned"))),
                          ])
                        : row.item.status === 5
                        ? _c("span", { staticClass: "badge bg-primary" }, [
                            _vm._v(_vm._s(_vm.__("out_for_pickup"))),
                          ])
                        : row.item.status === 6
                        ? _c("span", { staticClass: "badge bg-secondary" }, [
                            _vm._v(_vm._s(_vm.__("received_from_customer"))),
                          ])
                        : row.item.status === 7
                        ? _c("span", { staticClass: "badge bg-danger" }, [
                            _vm._v(_vm._s(_vm.__("cancelled"))),
                          ])
                        : row.item.status === 8
                        ? _c("span", { staticClass: "badge bg-dark" }, [
                            _vm._v(_vm._s(_vm.__("return_to_seller"))),
                          ])
                        : _c("span", { staticClass: "badge bg-danger" }, [
                            _vm._v(_vm._s(_vm.__("undefined"))),
                          ]),
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
                  key: "cell(name)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                    " +
                          _vm._s(row.item.customer_name || row.item.name) +
                          "\n                "
                      ),
                    ]
                  },
                },
                {
                  key: "cell(product_name)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                    " +
                          _vm._s(row.item.product_name) +
                          "\n                "
                      ),
                    ]
                  },
                },
                {
                  key: "cell(variant_name)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                    " +
                          _vm._s(row.item.variant_name) +
                          "\n                "
                      ),
                    ]
                  },
                },
                {
                  key: "cell(actions)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "list-actions" }, [
                        _vm.$can("return_request_update")
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
                                staticClass: "list-action-btn is-edit",
                                attrs: { title: _vm.__("edit") },
                                on: {
                                  click: function ($event) {
                                    _vm.edit_record = row.item
                                  },
                                },
                              },
                              [_c("i", { staticClass: "fa fa-pencil-alt" })]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.$can("return_request_delete")
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
                                staticClass: "list-action-btn is-delete",
                                attrs: { title: _vm.__("delete") },
                                on: {
                                  click: function ($event) {
                                    return _vm.deleteReturnRequests(
                                      row.index,
                                      row.item.id
                                    )
                                  },
                                },
                              },
                              [_c("i", { staticClass: "fa fa-trash" })]
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
      _vm._v(" "),
      _vm.create_new || _vm.edit_record
        ? _c("app-edit-record", {
            attrs: { record: _vm.edit_record },
            on: {
              modalClose: function ($event) {
                return _vm.hideModal()
              },
            },
          })
        : _vm._e(),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);