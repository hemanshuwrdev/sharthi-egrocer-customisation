"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Logistics_CreateLoadingSlip_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'CreateLoadingSlip',
  data: function data() {
    return {
      orders: [],
      zones: [],
      vehicles: [],
      drivers: [],
      selectedZone: '',
      selectedVehicleId: '',
      selectedVehicle: null,
      selectedDriverId: '',
      selectedOrderIds: [],
      selectAll: false,
      totalSelectedWeight: 0,
      loadPercent: 0,
      loading: false
    };
  },
  computed: {
    barClass: function barClass() {
      if (this.loadPercent > 100) return 'bg-danger';
      if (this.loadPercent > 85) return 'bg-warning';
      return 'bg-success';
    },
    urlPrefix: function urlPrefix() {
      return this.$route.path.startsWith('/seller') ? '/seller' : '';
    },
    isSeller: function isSeller() {
      return this.$route.path.startsWith('/seller');
    },
    apiBase: function apiBase() {
      return this.isSeller ? this.$sellerApiUrl : this.$apiUrl;
    }
  },
  mounted: function mounted() {
    this.getZones();
    this.getVehicles();
    this.getDrivers();
    this.getOrders();
  },
  methods: {
    getZones: function getZones() {
      var _this = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/zones').then(function (res) {
        if (res.data.status === 1) {
          _this.zones = res.data.data;
        }
      });
    },
    getVehicles: function getVehicles() {
      var _this2 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/vehicles/active').then(function (res) {
        if (res.data.status === 1) {
          _this2.vehicles = res.data.data;
        }
      });
    },
    getDrivers: function getDrivers() {
      var _this3 = this;
      // Eager load delivery boys that are active
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/delivery_boys', {
        params: {
          status: 1
        }
      }).then(function (res) {
        if (res.data.status === 1) {
          _this3.drivers = res.data.data.data || res.data.data;
        }
      });
    },
    getOrders: function getOrders() {
      var _this4 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/orders', {
        params: {
          zone: this.selectedZone
        }
      }).then(function (res) {
        if (res.data.status === 1) {
          _this4.orders = res.data.data;
          _this4.selectedOrderIds = [];
          _this4.selectAll = false;
          _this4.calculateWeightSum();
        }
      });
    },
    updateVehicleCapacity: function updateVehicleCapacity() {
      var _this5 = this;
      this.selectedVehicle = this.vehicles.find(function (v) {
        return v.id == _this5.selectedVehicleId;
      }) || null;
      this.calculateWeightSum();
    },
    toggleOrderSelection: function toggleOrderSelection(order) {
      var index = this.selectedOrderIds.indexOf(order.id);
      if (index > -1) {
        this.selectedOrderIds.splice(index, 1);
      } else {
        this.selectedOrderIds.push(order.id);
      }
      this.calculateWeightSum();
    },
    toggleSelectAll: function toggleSelectAll() {
      if (this.selectAll) {
        this.selectedOrderIds = this.orders.map(function (o) {
          return o.id;
        });
      } else {
        this.selectedOrderIds = [];
      }
      this.calculateWeightSum();
    },
    calculateWeightSum: function calculateWeightSum() {
      var _this6 = this;
      var sum = 0;
      this.orders.forEach(function (order) {
        if (_this6.selectedOrderIds.includes(order.id)) {
          sum += parseFloat(order.weight || 0);
        }
      });
      this.totalSelectedWeight = parseFloat(sum.toFixed(2));
      if (this.selectedVehicle) {
        this.loadPercent = Math.min(this.totalSelectedWeight / parseFloat(this.selectedVehicle.capacity) * 100, 120);
      } else {
        this.loadPercent = 0;
      }
    },
    formatZone: function formatZone(zone) {
      if (!zone) return 'All';
      return zone.charAt(0).toUpperCase() + zone.slice(1);
    },
    createLoadingSlip: function createLoadingSlip() {
      var _this7 = this;
      this.loading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.apiBase + '/loading_slips/save', {
        vehicle_id: this.selectedVehicleId,
        driver_id: this.selectedDriverId,
        order_ids: this.selectedOrderIds
      }).then(function (res) {
        _this7.loading = false;
        if (res.data.status === 1) {
          _this7.showSuccess(__('loading_slip_generated_and_route_optimized_successfully'));
          _this7.$router.push(_this7.urlPrefix + '/loading_slips');
        } else {
          _this7.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this7.loading = false;
        _this7.showError(__('an_error_occurred_during_slip_creation'));
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.bg-soft-primary[data-v-54652c95] {\n    background-color: rgba(78, 115, 223, 0.1) !important;\n    color: #4e73df !important;\n}\n.max-w-200[data-v-54652c95] {\n    max-width: 200px;\n}\n.max-w-250[data-v-54652c95] {\n    max-width: 250px;\n}\n.transition-all[data-v-54652c95] {\n    transition: all 0.25s ease-in-out;\n}\n.cursor-pointer[data-v-54652c95] {\n    cursor: pointer;\n}\n.gap-2[data-v-54652c95] {\n    gap: 0.5rem;\n}\n.text-xs[data-v-54652c95] {\n    font-size: 0.75rem;\n}\n.position-sticky[data-v-54652c95] {\n    position: sticky;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_0_id_54652c95_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_0_id_54652c95_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_0_id_54652c95_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Logistics/CreateLoadingSlip.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/Logistics/CreateLoadingSlip.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateLoadingSlip_vue_vue_type_template_id_54652c95_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateLoadingSlip.vue?vue&type=template&id=54652c95&scoped=true */ "./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=template&id=54652c95&scoped=true");
/* harmony import */ var _CreateLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateLoadingSlip.vue?vue&type=script&lang=js */ "./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=script&lang=js");
/* harmony import */ var _CreateLoadingSlip_vue_vue_type_style_index_0_id_54652c95_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css */ "./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _CreateLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _CreateLoadingSlip_vue_vue_type_template_id_54652c95_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _CreateLoadingSlip_vue_vue_type_template_id_54652c95_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "54652c95",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Logistics/CreateLoadingSlip.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css":
/*!********************************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_0_id_54652c95_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=0&id=54652c95&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=template&id=54652c95&scoped=true":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=template&id=54652c95&scoped=true ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_template_id_54652c95_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_template_id_54652c95_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_template_id_54652c95_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=template&id=54652c95&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=template&id=54652c95&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=template&id=54652c95&scoped=true":
/*!*********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=template&id=54652c95&scoped=true ***!
  \*********************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { staticClass: "container-fluid py-4" }, [
    _c("div", { staticClass: "row align-items-center mb-4" }, [
      _c("div", { staticClass: "col" }, [
        _c("h1", { staticClass: "h3 font-weight-bold mb-1" }, [
          _c("i", { staticClass: "fa fa-clipboard text-primary mr-2" }),
          _vm._v(_vm._s(_vm.__("create_loading_slip")) + "\n            "),
        ]),
        _vm._v(" "),
        _c("p", { staticClass: "text-muted mb-0" }, [
          _vm._v(
            _vm._s(
              _vm.__(
                "select_delivery_zone_assign_driver_and_vehicle_and_optimize_the_delivery_routing"
              )
            )
          ),
        ]),
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "col-auto" },
        [
          _c(
            "router-link",
            {
              staticClass:
                "btn btn-outline-secondary btn-lg font-weight-bold rounded-pill",
              attrs: { to: _vm.urlPrefix + "/loading_slips" },
            },
            [
              _c("i", { staticClass: "fa fa-arrow-left mr-2" }),
              _vm._v(_vm._s(_vm.__("back_to_slips")) + "\n            "),
            ]
          ),
        ],
        1
      ),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "row" }, [
      _c("div", { staticClass: "col-lg-8 mb-4" }, [
        _c("div", { staticClass: "card border-0 shadow-sm rounded-lg h-100" }, [
          _c("div", { staticClass: "card-header border-0 py-3" }, [
            _c("div", { staticClass: "row align-items-center" }, [
              _c("div", { staticClass: "col-md-6" }, [
                _c("h6", { staticClass: "m-0 font-weight-bold" }, [
                  _vm._v(_vm._s(_vm.__("unassigned_doorstep_orders"))),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-md-6" }, [
                _c(
                  "div",
                  {
                    staticClass:
                      "d-flex align-items-center justify-content-md-end gap-2",
                  },
                  [
                    _c(
                      "label",
                      {
                        staticClass:
                          "mb-0 text-muted font-weight-bold mr-2 text-nowrap",
                      },
                      [_vm._v(_vm._s(_vm.__("filter_by_zone")) + ":")]
                    ),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.selectedZone,
                            expression: "selectedZone",
                          },
                        ],
                        staticClass:
                          "form-control form-select border-0 max-w-200",
                        on: {
                          change: [
                            function ($event) {
                              var $$selectedVal = Array.prototype.filter
                                .call($event.target.options, function (o) {
                                  return o.selected
                                })
                                .map(function (o) {
                                  var val = "_value" in o ? o._value : o.value
                                  return val
                                })
                              _vm.selectedZone = $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            },
                            _vm.getOrders,
                          ],
                        },
                      },
                      [
                        _c("option", { attrs: { value: "" } }, [
                          _vm._v(_vm._s(_vm.__("all_zones"))),
                        ]),
                        _vm._v(" "),
                        _vm._l(_vm.zones, function (zone) {
                          return _c(
                            "option",
                            { key: zone, domProps: { value: zone } },
                            [_vm._v(_vm._s(_vm.formatZone(zone)))]
                          )
                        }),
                      ],
                      2
                    ),
                  ]
                ),
              ]),
            ]),
          ]),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "card-body p-0 overflow-auto",
              staticStyle: { "max-height": "600px" },
            },
            [
              _c("div", { staticClass: "table-responsive" }, [
                _c(
                  "table",
                  {
                    staticClass:
                      "table align-items-center table-flush table-hover mb-0",
                  },
                  [
                    _c("thead", { staticClass: "thead-light" }, [
                      _c("tr", [
                        _c(
                          "th",
                          {
                            staticClass: "text-center py-3",
                            staticStyle: { width: "40px" },
                          },
                          [
                            _c("div", { staticClass: "form-check" }, [
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.selectAll,
                                    expression: "selectAll",
                                  },
                                ],
                                staticClass: "form-check-input",
                                attrs: { type: "checkbox" },
                                domProps: {
                                  checked: Array.isArray(_vm.selectAll)
                                    ? _vm._i(_vm.selectAll, null) > -1
                                    : _vm.selectAll,
                                },
                                on: {
                                  change: [
                                    function ($event) {
                                      var $$a = _vm.selectAll,
                                        $$el = $event.target,
                                        $$c = $$el.checked ? true : false
                                      if (Array.isArray($$a)) {
                                        var $$v = null,
                                          $$i = _vm._i($$a, $$v)
                                        if ($$el.checked) {
                                          $$i < 0 &&
                                            (_vm.selectAll = $$a.concat([$$v]))
                                        } else {
                                          $$i > -1 &&
                                            (_vm.selectAll = $$a
                                              .slice(0, $$i)
                                              .concat($$a.slice($$i + 1)))
                                        }
                                      } else {
                                        _vm.selectAll = $$c
                                      }
                                    },
                                    _vm.toggleSelectAll,
                                  ],
                                },
                              }),
                            ]),
                          ]
                        ),
                        _vm._v(" "),
                        _c(
                          "th",
                          { staticClass: "py-3 font-weight-bold text-muted" },
                          [_vm._v(_vm._s(_vm.__("order_id")))]
                        ),
                        _vm._v(" "),
                        _c(
                          "th",
                          { staticClass: "py-3 font-weight-bold text-muted" },
                          [_vm._v(_vm._s(_vm.__("customer_name")))]
                        ),
                        _vm._v(" "),
                        _c(
                          "th",
                          {
                            staticClass:
                              "py-3 font-weight-bold text-muted text-center",
                          },
                          [_vm._v(_vm._s(_vm.__("zone")))]
                        ),
                        _vm._v(" "),
                        _c(
                          "th",
                          {
                            staticClass:
                              "py-3 font-weight-bold text-muted text-right",
                          },
                          [_vm._v(_vm._s(_vm.__("value")))]
                        ),
                        _vm._v(" "),
                        _c(
                          "th",
                          {
                            staticClass:
                              "py-3 font-weight-bold text-muted text-right",
                          },
                          [_vm._v(_vm._s(_vm.__("weight_kg")))]
                        ),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c(
                      "tbody",
                      [
                        _vm._l(_vm.orders, function (order) {
                          return _c(
                            "tr",
                            {
                              key: order.id,
                              staticClass: "transition-all cursor-pointer",
                              on: {
                                click: function ($event) {
                                  return _vm.toggleOrderSelection(order)
                                },
                              },
                            },
                            [
                              _c(
                                "td",
                                {
                                  staticClass: "text-center py-3",
                                  on: {
                                    click: function ($event) {
                                      $event.stopPropagation()
                                    },
                                  },
                                },
                                [
                                  _c("div", { staticClass: "form-check" }, [
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.selectedOrderIds,
                                          expression: "selectedOrderIds",
                                        },
                                      ],
                                      staticClass: "form-check-input",
                                      attrs: { type: "checkbox" },
                                      domProps: {
                                        value: order.id,
                                        checked: Array.isArray(
                                          _vm.selectedOrderIds
                                        )
                                          ? _vm._i(
                                              _vm.selectedOrderIds,
                                              order.id
                                            ) > -1
                                          : _vm.selectedOrderIds,
                                      },
                                      on: {
                                        change: [
                                          function ($event) {
                                            var $$a = _vm.selectedOrderIds,
                                              $$el = $event.target,
                                              $$c = $$el.checked ? true : false
                                            if (Array.isArray($$a)) {
                                              var $$v = order.id,
                                                $$i = _vm._i($$a, $$v)
                                              if ($$el.checked) {
                                                $$i < 0 &&
                                                  (_vm.selectedOrderIds =
                                                    $$a.concat([$$v]))
                                              } else {
                                                $$i > -1 &&
                                                  (_vm.selectedOrderIds = $$a
                                                    .slice(0, $$i)
                                                    .concat($$a.slice($$i + 1)))
                                              }
                                            } else {
                                              _vm.selectedOrderIds = $$c
                                            }
                                          },
                                          _vm.calculateWeightSum,
                                        ],
                                      },
                                    }),
                                  ]),
                                ]
                              ),
                              _vm._v(" "),
                              _c("td", { staticClass: "font-weight-bold" }, [
                                _vm._v("#" + _vm._s(order.id)),
                              ]),
                              _vm._v(" "),
                              _c("td", [
                                _c(
                                  "div",
                                  { staticClass: "font-weight-bold mb-0" },
                                  [_vm._v(_vm._s(order.user_name))]
                                ),
                                _vm._v(" "),
                                _c(
                                  "small",
                                  {
                                    staticClass:
                                      "text-muted text-truncate d-inline-block max-w-250",
                                  },
                                  [_vm._v(_vm._s(order.address))]
                                ),
                              ]),
                              _vm._v(" "),
                              _c("td", { staticClass: "text-center" }, [
                                _c(
                                  "span",
                                  {
                                    staticClass:
                                      "badge bg-soft-primary font-weight-bold",
                                  },
                                  [
                                    _vm._v(
                                      _vm._s(
                                        _vm.formatZone(
                                          order.city_zone || "Default"
                                        )
                                      )
                                    ),
                                  ]
                                ),
                              ]),
                              _vm._v(" "),
                              _c(
                                "td",
                                { staticClass: "text-right font-weight-bold" },
                                [_vm._v("₹" + _vm._s(order.final_total))]
                              ),
                              _vm._v(" "),
                              _c(
                                "td",
                                { staticClass: "text-right font-weight-bold" },
                                [
                                  _vm._v(
                                    "\n                                        " +
                                      _vm._s(order.weight || 0) +
                                      " kg\n                                    "
                                  ),
                                ]
                              ),
                            ]
                          )
                        }),
                        _vm._v(" "),
                        _vm.orders.length === 0
                          ? _c("tr", [
                              _c(
                                "td",
                                {
                                  staticClass: "text-center py-5 text-muted",
                                  attrs: { colspan: "6" },
                                },
                                [
                                  _c("i", {
                                    staticClass:
                                      "fa fa-check-circle fa-2x mb-3 text-success",
                                  }),
                                  _vm._v(" "),
                                  _c(
                                    "p",
                                    { staticClass: "mb-0 font-weight-bold" },
                                    [
                                      _vm._v(
                                        _vm._s(
                                          _vm.__(
                                            "hurray_all_doorstep_orders_are_already_assigned_to_slips"
                                          )
                                        )
                                      ),
                                    ]
                                  ),
                                ]
                              ),
                            ])
                          : _vm._e(),
                      ],
                      2
                    ),
                  ]
                ),
              ]),
            ]
          ),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col-lg-4 mb-4" }, [
        _c(
          "div",
          {
            staticClass: "card border-0 shadow-sm rounded-lg position-sticky",
            staticStyle: { top: "24px" },
          },
          [
            _c("div", { staticClass: "card-header border-0 py-3" }, [
              _c("h6", { staticClass: "m-0 font-weight-bold" }, [
                _vm._v(_vm._s(_vm.__("logistics_planner"))),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "card-body" }, [
              _c(
                "form",
                {
                  on: {
                    submit: function ($event) {
                      $event.preventDefault()
                      return _vm.createLoadingSlip.apply(null, arguments)
                    },
                  },
                },
                [
                  _c("div", { staticClass: "form-group mb-3" }, [
                    _c(
                      "label",
                      {
                        staticClass:
                          "form-control-label text-muted font-weight-bold mb-1",
                      },
                      [
                        _vm._v(_vm._s(_vm.__("select_delivery_vehicle")) + " "),
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
                            value: _vm.selectedVehicleId,
                            expression: "selectedVehicleId",
                          },
                        ],
                        staticClass:
                          "form-control form-select border shadow-none",
                        attrs: { required: "" },
                        on: {
                          change: [
                            function ($event) {
                              var $$selectedVal = Array.prototype.filter
                                .call($event.target.options, function (o) {
                                  return o.selected
                                })
                                .map(function (o) {
                                  var val = "_value" in o ? o._value : o.value
                                  return val
                                })
                              _vm.selectedVehicleId = $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            },
                            _vm.updateVehicleCapacity,
                          ],
                        },
                      },
                      [
                        _c("option", { attrs: { value: "" } }, [
                          _vm._v(
                            "-- " + _vm._s(_vm.__("choose_vehicle")) + " --"
                          ),
                        ]),
                        _vm._v(" "),
                        _vm._l(_vm.vehicles, function (v) {
                          return _c(
                            "option",
                            { key: v.id, domProps: { value: v.id } },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(v.name) +
                                  " [" +
                                  _vm._s(v.vehicle_number) +
                                  "] - " +
                                  _vm._s(_vm.__("cap")) +
                                  ": " +
                                  _vm._s(v.capacity) +
                                  " " +
                                  _vm._s(_vm.__("kg")) +
                                  "\n                                "
                              ),
                            ]
                          )
                        }),
                      ],
                      2
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group mb-4" }, [
                    _c(
                      "label",
                      {
                        staticClass:
                          "form-control-label text-muted font-weight-bold mb-1",
                      },
                      [
                        _vm._v(
                          _vm._s(_vm.__("select_active_driver_rider")) + " "
                        ),
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
                            value: _vm.selectedDriverId,
                            expression: "selectedDriverId",
                          },
                        ],
                        staticClass:
                          "form-control form-select border shadow-none",
                        attrs: { required: "" },
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
                            _vm.selectedDriverId = $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          },
                        },
                      },
                      [
                        _c("option", { attrs: { value: "" } }, [
                          _vm._v(
                            "-- " + _vm._s(_vm.__("choose_driver")) + " --"
                          ),
                        ]),
                        _vm._v(" "),
                        _vm._l(_vm.drivers, function (d) {
                          return _c(
                            "option",
                            { key: d.id, domProps: { value: d.id } },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(d.name) +
                                  " [" +
                                  _vm._s(d.mobile) +
                                  "]\n                                "
                              ),
                            ]
                          )
                        }),
                      ],
                      2
                    ),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "card border-0 p-3 mb-4 rounded-lg" },
                    [
                      _c("h6", { staticClass: "font-weight-bold mb-2" }, [
                        _vm._v(_vm._s(_vm.__("live_weight_load_bar"))),
                      ]),
                      _vm._v(" "),
                      !_vm.selectedVehicle
                        ? _c(
                            "div",
                            {
                              staticClass: "text-center py-2 text-muted small",
                            },
                            [
                              _c("i", { staticClass: "fa fa-truck mr-1" }),
                              _vm._v(
                                " " +
                                  _vm._s(
                                    _vm.__(
                                      "choose_a_vehicle_to_visualize_weight_limits"
                                    )
                                  ) +
                                  "\n                            "
                              ),
                            ]
                          )
                        : _c("div", [
                            _c(
                              "div",
                              {
                                staticClass:
                                  "d-flex justify-content-between font-weight-bold mb-1 small",
                              },
                              [
                                _c("span", [
                                  _vm._v(_vm._s(_vm.__("current_load_weight"))),
                                ]),
                                _vm._v(" "),
                                _c("span", [
                                  _vm._v(
                                    _vm._s(_vm.totalSelectedWeight) +
                                      " / " +
                                      _vm._s(_vm.selectedVehicle.capacity) +
                                      " " +
                                      _vm._s(_vm.__("kg"))
                                  ),
                                ]),
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "div",
                              {
                                staticClass: "progress rounded-pill mb-2",
                                staticStyle: { height: "12px" },
                              },
                              [
                                _c("div", {
                                  staticClass:
                                    "progress-bar rounded-pill transition-all",
                                  class: _vm.barClass,
                                  style: { width: _vm.loadPercent + "%" },
                                  attrs: { role: "progressbar" },
                                }),
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "div",
                              {
                                staticClass:
                                  "d-flex justify-content-between text-xs font-weight-bold",
                              },
                              [
                                _c(
                                  "span",
                                  {
                                    class:
                                      _vm.loadPercent > 100
                                        ? "text-danger"
                                        : "text-muted",
                                  },
                                  [
                                    _vm._v(
                                      "\n                                        " +
                                        _vm._s(_vm.loadPercent.toFixed(1)) +
                                        "% " +
                                        _vm._s(_vm.__("capacity_loaded")) +
                                        "\n                                    "
                                    ),
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "span",
                                  {
                                    staticClass: "badge",
                                    class:
                                      _vm.loadPercent > 100
                                        ? "bg-danger text-white"
                                        : "bg-secondary",
                                  },
                                  [
                                    _vm._v(
                                      "\n                                        " +
                                        _vm._s(_vm.selectedOrderIds.length) +
                                        " " +
                                        _vm._s(_vm.__("orders_selected")) +
                                        "\n                                    "
                                    ),
                                  ]
                                ),
                              ]
                            ),
                          ]),
                    ]
                  ),
                  _vm._v(" "),
                  _vm.loadPercent > 100
                    ? _c(
                        "div",
                        {
                          staticClass:
                            "alert alert-danger border-0 rounded-lg p-3 small mb-4",
                        },
                        [
                          _c("i", {
                            staticClass: "fa fa-exclamation-triangle mr-2",
                          }),
                          _c("strong", [
                            _vm._v(_vm._s(_vm.__("vehicle_overloaded")) + "!"),
                          ]),
                          _vm._v(
                            " " +
                              _vm._s(
                                _vm.__(
                                  "selected_load_exceeds_the_vehicle_maximum_capability"
                                )
                              ) +
                              "\n                        "
                          ),
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass:
                        "btn btn-primary btn-block btn-lg shadow-sm font-weight-bold rounded-pill",
                      attrs: {
                        type: "submit",
                        disabled:
                          _vm.loading ||
                          _vm.selectedOrderIds.length === 0 ||
                          _vm.loadPercent > 100,
                      },
                    },
                    [
                      _vm.loading
                        ? _c("b-spinner", {
                            staticClass: "mr-2",
                            attrs: { small: "" },
                          })
                        : _c("i", { staticClass: "fa fa-magic mr-2" }),
                      _vm._v(
                        _vm._s(_vm.__("generate_slip_and_sequence_route")) +
                          "\n                        "
                      ),
                    ],
                    1
                  ),
                ]
              ),
            ]),
          ]
        ),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);