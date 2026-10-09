"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_ReturnRequests_vue"],{

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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ReturnRequests.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ReturnRequests.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ReturnRequests_Edit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ReturnRequests/Edit */ "./resources/js/views/ReturnRequests/Edit.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




// Return status ids (see App\Models\ReturnStatusList)
var STATUS = {
  pending: 1,
  approved: 2,
  rejected: 3,
  deliveryBoyAssigned: 4,
  outForPickup: 5,
  receivedFromCustomer: 6,
  cancelled: 7,
  returnToSeller: 8
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'SellerReturnRequests',
  components: {
    'app-edit-record': _ReturnRequests_Edit__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      fields: [{
        key: 'id',
        label: __('id'),
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'shop_name',
        label: __('Shop Name'),
        sortable: true
      }, {
        key: 'product_name',
        label: __('product_name'),
        sortable: true
      }, {
        key: 'sub_total',
        label: __('total'),
        sortable: true,
        "class": 'ui-num'
      }, {
        key: 'reason',
        label: __('reason')
      }, {
        key: 'status',
        label: __('status'),
        sortable: true
      }, {
        key: 'actions',
        label: __('actions')
      }],
      totalRows: 0,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: '',
      statusFilter: '',
      // '' = all, otherwise a return status id
      searchTimer: null,
      summary: {
        total: 0,
        by_status: {}
      },
      isLoading: false,
      edit_record: null,
      returnRequests: []
    };
  },
  computed: {
    statusChips: function statusChips() {
      var _this = this;
      var by = this.summary.by_status || {};
      var count = function count(id) {
        return parseInt(by[id]) || 0;
      };
      var chips = [{
        key: 'all',
        id: '',
        label: __('all'),
        count: parseInt(this.summary.total) || 0
      }];
      // Pending first (needs action); the rarer statuses only appear once something is in them
      [STATUS.pending, STATUS.deliveryBoyAssigned, STATUS.outForPickup, STATUS.receivedFromCustomer, STATUS.approved, STATUS.rejected, STATUS.returnToSeller, STATUS.cancelled].forEach(function (id) {
        if (count(id) > 0 || [STATUS.pending, STATUS.approved, STATUS.rejected].includes(id)) {
          chips.push({
            key: id,
            id: id,
            label: _this.statusLabel(id),
            count: count(id)
          });
        }
      });
      return chips;
    }
  },
  created: function created() {
    var _this2 = this;
    this._handleReturnRequestSaved = function (message) {
      _this2.showMessage("success", message);
      _this2.getReturnRequests();
    };
    this.$eventBus.$on('returnRequestSaved', this._handleReturnRequestSaved);
    this.getReturnRequests();
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.searchTimer);
    this.$eventBus.$off('returnRequestSaved', this._handleReturnRequestSaved);
  },
  watch: {
    // debounce typing so each keystroke doesn't hit the API
    filter: function filter() {
      var _this3 = this;
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(function () {
        _this3.currentPage = 1;
        _this3.getReturnRequests();
      }, 350);
    },
    currentPage: function currentPage() {
      this.getReturnRequests();
    },
    perPage: function perPage() {
      this.currentPage = 1;
      this.getReturnRequests();
    }
  },
  methods: {
    getReturnRequests: function getReturnRequests() {
      var _this4 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/seller/return_requests', {
        params: {
          search: (this.filter || '').trim(),
          status: this.statusFilter === '' ? undefined : this.statusFilter,
          offset: (this.currentPage - 1) * this.perPage,
          limit: this.perPage
        }
      }).then(function (response) {
        _this4.isLoading = false;
        _this4.returnRequests = response.data.data || [];
        _this4.totalRows = response.data.total != null ? response.data.total : _this4.returnRequests.length;
        if (response.data.summary) _this4.summary = response.data.summary;
        // the last item of a later page was removed/filtered out: step back instead of showing an empty page
        if (_this4.returnRequests.length === 0 && _this4.currentPage > 1) _this4.currentPage = _this4.currentPage - 1;
      })["catch"](function () {
        _this4.isLoading = false;
        _this4.showError(__('something_went_wrong'));
      });
    },
    setStatus: function setStatus(id) {
      this.statusFilter = id;
      this.currentPage = 1;
      this.getReturnRequests();
    },
    deleteReturnRequests: function deleteReturnRequests(id) {
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
      }).then(function (result) {
        if (result.value) {
          _this5.isLoading = true;
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this5.$apiUrl + '/seller/return_requests_delete', {
            id: id
          }).then(function (response) {
            _this5.showSuccess(response.data.message);
            _this5.getReturnRequests(); // reload so the page, total and status counts stay correct
          })["catch"](function () {
            _this5.isLoading = false;
            _this5.showError(__('something_went_wrong'));
          });
        }
      });
    },
    hideModal: function hideModal() {
      this.edit_record = null;
    },
    // ---- presentation ----
    statusLabel: function statusLabel(status) {
      switch (Number(status)) {
        case STATUS.pending:
          return __('pending');
        case STATUS.approved:
          return __('approved');
        case STATUS.rejected:
          return __('rejected');
        case STATUS.deliveryBoyAssigned:
          return __('delivery_boy_assigned');
        case STATUS.outForPickup:
          return __('out_for_pickup');
        case STATUS.receivedFromCustomer:
          return __('received_from_customer');
        case STATUS.cancelled:
          return __('cancelled');
        case STATUS.returnToSeller:
          return __('return_to_seller');
        default:
          return __('undefined');
      }
    },
    statusTone: function statusTone(status) {
      switch (Number(status)) {
        case STATUS.pending:
          return 'amber';
        case STATUS.approved:
          return 'green';
        case STATUS.rejected:
        case STATUS.cancelled:
          return 'red';
        case STATUS.deliveryBoyAssigned:
          return 'purple';
        case STATUS.outForPickup:
        case STATUS.receivedFromCustomer:
          return 'blue';
        default:
          return 'slate';
      }
    },
    formatMoney: function formatMoney(value) {
      var n = parseFloat(value);
      if (isNaN(n)) return '0';
      // whole amounts stay compact (4,000); fractional ones always show paise (8,336.30)
      var digits = Number.isInteger(n) ? 0 : 2;
      return n.toLocaleString('en-IN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: 2
      });
    },
    initials: function initials(name) {
      var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
      if (!parts.length) return '?';
      return ((parts[0][0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    },
    // Stable colour per shop so the same shop always gets the same avatar
    avatarTone: function avatarTone(name) {
      var tones = ['blue', 'green', 'purple', 'amber', 'red'];
      var hash = 0;
      String(name || '').split('').forEach(function (ch) {
        hash = (hash * 31 + ch.charCodeAt(0)) % 997;
      });
      return tones[hash % tones.length];
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

/***/ "./resources/js/views/Sellers/ReturnRequests.vue":
/*!*******************************************************!*\
  !*** ./resources/js/views/Sellers/ReturnRequests.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ReturnRequests_vue_vue_type_template_id_717f082e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ReturnRequests.vue?vue&type=template&id=717f082e */ "./resources/js/views/Sellers/ReturnRequests.vue?vue&type=template&id=717f082e");
/* harmony import */ var _ReturnRequests_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ReturnRequests.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/ReturnRequests.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ReturnRequests_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ReturnRequests_vue_vue_type_template_id_717f082e__WEBPACK_IMPORTED_MODULE_0__.render,
  _ReturnRequests_vue_vue_type_template_id_717f082e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/ReturnRequests.vue"
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

/***/ "./resources/js/views/Sellers/ReturnRequests.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/Sellers/ReturnRequests.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ReturnRequests.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ReturnRequests.vue?vue&type=script&lang=js");
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

/***/ "./resources/js/views/Sellers/ReturnRequests.vue?vue&type=template&id=717f082e":
/*!*************************************************************************************!*\
  !*** ./resources/js/views/Sellers/ReturnRequests.vue?vue&type=template&id=717f082e ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_template_id_717f082e__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_template_id_717f082e__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReturnRequests_vue_vue_type_template_id_717f082e__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ReturnRequests.vue?vue&type=template&id=717f082e */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ReturnRequests.vue?vue&type=template&id=717f082e");


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

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ReturnRequests.vue?vue&type=template&id=717f082e":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/ReturnRequests.vue?vue&type=template&id=717f082e ***!
  \****************************************************************************************************************************************************************************************************************************/
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
      _c(
        "div",
        { staticClass: "ui-chips mb-3" },
        _vm._l(_vm.statusChips, function (chip) {
          return _c(
            "button",
            {
              key: chip.key,
              staticClass: "ui-chip",
              class: {
                "ui-chip--on": String(_vm.statusFilter) === String(chip.id),
              },
              attrs: { type: "button" },
              on: {
                click: function ($event) {
                  return _vm.setStatus(chip.id)
                },
              },
            },
            [
              _vm._v("\n            " + _vm._s(chip.label) + " "),
              _c("span", [_vm._v(_vm._s(chip.count))]),
            ]
          )
        }),
        0
      ),
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
                  placeholder: _vm.__("Search shop, product or reason"),
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
                staticClass: "fa fa-sync-alt",
                class: { "fa-spin": _vm.isLoading },
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
                items: _vm.returnRequests,
                fields: _vm.fields,
                "sort-by": _vm.sortBy,
                "sort-desc": _vm.sortDesc,
                "sort-direction": _vm.sortDirection,
                bordered: false,
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
              },
              scopedSlots: _vm._u([
                {
                  key: "table-busy",
                  fn: function () {
                    return [
                      _c(
                        "div",
                        { staticClass: "text-center my-2" },
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
                          _c("i", { staticClass: "fa fa-undo-alt" }),
                        ]),
                        _vm._v(" "),
                        _c("h3", [
                          _vm._v(_vm._s(_vm.__("No return requests found"))),
                        ]),
                        _vm._v(" "),
                        _c("p", [
                          _vm._v(
                            _vm._s(
                              _vm.filter || _vm.statusFilter !== ""
                                ? _vm.__(
                                    "Nothing matches this search or status. Try changing or clearing it."
                                  )
                                : _vm.__(
                                    "Return requests from your retailers will show up here."
                                  )
                            )
                          ),
                        ]),
                      ]),
                    ]
                  },
                  proxy: true,
                },
                {
                  key: "cell(id)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "ui-cell" }, [
                        _c("strong", [_vm._v("#" + _vm._s(row.item.id))]),
                        _vm._v(" "),
                        _c("span", { staticClass: "ui-nowrap" }, [
                          _vm._v(_vm._s(row.item.created_at)),
                        ]),
                      ]),
                    ]
                  },
                },
                {
                  key: "cell(shop_name)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "ui-person" }, [
                        _c(
                          "span",
                          {
                            staticClass: "ui-avatar",
                            class:
                              "ui-tone--" + _vm.avatarTone(row.item.shop_name),
                          },
                          [_vm._v(_vm._s(_vm.initials(row.item.shop_name)))]
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "ui-cell" }, [
                          _c(
                            "strong",
                            { attrs: { title: row.item.shop_name } },
                            [
                              _vm._v(
                                _vm._s(
                                  row.item.shop_name ||
                                    row.item.customer_name ||
                                    "-"
                                )
                              ),
                            ]
                          ),
                          _vm._v(" "),
                          _c("span", [
                            _vm._v(
                              _vm._s(
                                _vm._f("mobileMask")(row.item.customer_mobile)
                              )
                            ),
                          ]),
                        ]),
                      ]),
                    ]
                  },
                },
                {
                  key: "cell(product_name)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "ui-cell" }, [
                        _c("strong", [_vm._v(_vm._s(row.item.product_name))]),
                        _vm._v(" "),
                        _c(
                          "span",
                          [
                            row.item.variant_name
                              ? [_vm._v(_vm._s(row.item.variant_name) + " · ")]
                              : _vm._e(),
                            _vm._v(
                              "× " +
                                _vm._s(row.item.quantity) +
                                "\n                        "
                            ),
                          ],
                          2
                        ),
                      ]),
                    ]
                  },
                },
                {
                  key: "cell(sub_total)",
                  fn: function (row) {
                    return [
                      _c("span", { staticClass: "ui-money" }, [
                        _vm._v(
                          _vm._s(_vm.$currency) +
                            _vm._s(_vm.formatMoney(row.item.sub_total))
                        ),
                      ]),
                    ]
                  },
                },
                {
                  key: "cell(reason)",
                  fn: function (row) {
                    return [
                      row.item.reason
                        ? _c(
                            "span",
                            {
                              staticClass: "ui-clamp",
                              attrs: { title: row.item.reason },
                            },
                            [_vm._v(_vm._s(row.item.reason))]
                          )
                        : _c("span", { staticClass: "ui-dash" }, [_vm._v("-")]),
                    ]
                  },
                },
                {
                  key: "cell(status)",
                  fn: function (row) {
                    return [
                      _c(
                        "span",
                        {
                          staticClass: "ui-pill",
                          class: "ui-tone--" + _vm.statusTone(row.item.status),
                        },
                        [
                          _c("span", { staticClass: "ui-dot" }),
                          _vm._v(
                            _vm._s(_vm.statusLabel(row.item.status)) +
                              "\n                    "
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
                                    return _vm.deleteReturnRequests(row.item.id)
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
      _vm.edit_record
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