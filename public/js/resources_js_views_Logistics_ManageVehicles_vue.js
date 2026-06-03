"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Logistics_ManageVehicles_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=script&lang=js":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=script&lang=js ***!
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'ManageVehicles',
  data: function data() {
    return {
      vehicles: [],
      total: 0,
      page: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      filter: '',
      modalShow: false,
      isEdit: false,
      loading: false,
      isLoading: false,
      fields: [{
        key: 'id',
        label: 'ID',
        "class": 'text-center',
        sortable: true
      }, {
        key: 'name',
        label: 'Vehicle Name',
        "class": 'text-center',
        sortable: true
      }, {
        key: 'vehicle_number',
        label: 'Vehicle Number',
        "class": 'text-center',
        sortable: true
      }, {
        key: 'capacity',
        label: 'Capacity (kg)',
        "class": 'text-center',
        sortable: true
      }, {
        key: 'status',
        label: 'Status',
        "class": 'text-center',
        sortable: true
      }, {
        key: 'actions',
        label: 'Actions',
        "class": 'text-center'
      }],
      form: {
        id: null,
        name: '',
        vehicle_number: '',
        capacity: '',
        status: 1
      }
    };
  },
  computed: {
    activeCount: function activeCount() {
      return this.vehicles.filter(function (v) {
        return v.status == 1;
      }).length;
    },
    totalCapacity: function totalCapacity() {
      return this.vehicles.reduce(function (acc, v) {
        return acc + parseFloat(v.capacity || 0);
      }, 0).toFixed(2);
    }
  },
  watch: {
    page: function page(newPage) {
      this.getVehicles();
    },
    perPage: function perPage(newPerPage) {
      this.getVehicles();
    },
    filter: function filter(newFilter, oldFilter) {
      this.page = 1;
      this.getVehicles();
    }
  },
  mounted: function mounted() {
    this.getVehicles();
  },
  methods: {
    getVehicles: function getVehicles() {
      var _this = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/vehicles', {
        params: {
          page: this.page,
          per_page: this.perPage,
          filter: this.filter
        }
      }).then(function (res) {
        _this.isLoading = false;
        if (res.data.status === 1) {
          _this.vehicles = res.data.data.data || res.data.data;
          _this.total = res.data.data.total || _this.vehicles.length;
        }
      })["catch"](function (err) {
        _this.isLoading = false;
        _this.showError('Could not load vehicles data.');
      });
    },
    openCreateModal: function openCreateModal() {
      this.isEdit = false;
      this.form = {
        id: null,
        name: '',
        vehicle_number: '',
        capacity: '',
        status: 1
      };
      this.modalShow = true;
    },
    openEditModal: function openEditModal(vehicle) {
      this.isEdit = true;
      this.form = {
        id: vehicle.id,
        name: vehicle.name,
        vehicle_number: vehicle.vehicle_number,
        capacity: vehicle.capacity,
        status: parseInt(vehicle.status)
      };
      this.modalShow = true;
    },
    saveVehicle: function saveVehicle() {
      var _this2 = this;
      this.loading = true;
      var endpoint = this.isEdit ? '/vehicles/update' : '/vehicles/save';
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + endpoint, this.form).then(function (res) {
        _this2.loading = false;
        if (res.data.status === 1) {
          _this2.showMessage('success', res.data.message);
          _this2.modalShow = false;
          _this2.getVehicles();
        } else {
          _this2.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this2.loading = false;
        _this2.showError('An error occurred while saving the vehicle.');
      });
    },
    deleteVehicle: function deleteVehicle(id) {
      var _this3 = this;
      this.$swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this vehicle? This action is irreversible!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        confirmButtonColor: '#e74a3b',
        cancelButtonColor: '#858796'
      }).then(function (result) {
        if (result.isConfirmed) {
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this3.$apiUrl + '/vehicles/delete', {
            id: id
          }).then(function (res) {
            if (res.data.status === 1) {
              _this3.showMessage('success', res.data.message);
              _this3.getVehicles();
            } else {
              _this3.showError(res.data.message);
            }
          })["catch"](function (err) {
            _this3.showError('An error occurred while deleting the vehicle.');
          });
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* Premium aesthetics CSS */\n.card-light-primary[data-v-6e7f3107] {\n    background-color: #f0f4ff;\n    border: 1px solid rgba(78, 115, 223, 0.15) !important;\n}\n.card-light-success[data-v-6e7f3107] {\n    background-color: #eafaf1;\n    border: 1px solid rgba(28, 200, 138, 0.15) !important;\n}\n.card-light-warning[data-v-6e7f3107] {\n    background-color: #fef9ec;\n    border: 1px solid rgba(246, 194, 62, 0.15) !important;\n}\n.bg-soft-primary[data-v-6e7f3107] {\n    background-color: rgba(78, 115, 223, 0.1) !important;\n}\n.bg-soft-secondary[data-v-6e7f3107] {\n    background-color: rgba(133, 135, 150, 0.1) !important;\n}\n.bg-soft-success[data-v-6e7f3107] {\n    background-color: rgba(28, 200, 138, 0.1) !important;\n    color: #1cc88a !important;\n}\n.bg-soft-danger[data-v-6e7f3107] {\n    background-color: rgba(231, 74, 59, 0.1) !important;\n    color: #e74a3b !important;\n}\n.btn-soft-primary[data-v-6e7f3107] {\n    background-color: rgba(78, 115, 223, 0.1);\n    color: #4e73df;\n    border: none;\n    transition: all 0.2s;\n}\n.btn-soft-primary[data-v-6e7f3107]:hover {\n    background-color: #4e73df;\n    color: white;\n}\n.btn-soft-danger[data-v-6e7f3107] {\n    background-color: rgba(231, 74, 59, 0.1);\n    color: #e74a3b;\n    border: none;\n    transition: all 0.2s;\n}\n.btn-soft-danger[data-v-6e7f3107]:hover {\n    background-color: #e74a3b;\n    color: white;\n}\n.avatar-circle[data-v-6e7f3107] {\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 16px;\n    font-weight: bold;\n}\n.transition-all[data-v-6e7f3107] {\n    transition: all 0.25s ease-in-out;\n}\n.hover-bg-light[data-v-6e7f3107]:hover {\n    background-color: rgba(248, 249, 250, 0.9) !important;\n    transform: translateY(-2px);\n    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);\n}\n.form-control-lg[data-v-6e7f3107] {\n    border-radius: 10px;\n    font-size: 0.95rem;\n}\n.rounded-pill[data-v-6e7f3107] {\n    border-radius: 50rem !important;\n}\n.gap-2[data-v-6e7f3107] {\n    gap: 0.5rem;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_style_index_0_id_6e7f3107_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_style_index_0_id_6e7f3107_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_style_index_0_id_6e7f3107_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Logistics/ManageVehicles.vue":
/*!*********************************************************!*\
  !*** ./resources/js/views/Logistics/ManageVehicles.vue ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ManageVehicles_vue_vue_type_template_id_6e7f3107_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ManageVehicles.vue?vue&type=template&id=6e7f3107&scoped=true */ "./resources/js/views/Logistics/ManageVehicles.vue?vue&type=template&id=6e7f3107&scoped=true");
/* harmony import */ var _ManageVehicles_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ManageVehicles.vue?vue&type=script&lang=js */ "./resources/js/views/Logistics/ManageVehicles.vue?vue&type=script&lang=js");
/* harmony import */ var _ManageVehicles_vue_vue_type_style_index_0_id_6e7f3107_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css */ "./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ManageVehicles_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ManageVehicles_vue_vue_type_template_id_6e7f3107_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ManageVehicles_vue_vue_type_template_id_6e7f3107_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "6e7f3107",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Logistics/ManageVehicles.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Logistics/ManageVehicles.vue?vue&type=script&lang=js":
/*!*********************************************************************************!*\
  !*** ./resources/js/views/Logistics/ManageVehicles.vue?vue&type=script&lang=js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageVehicles.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css":
/*!*****************************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_style_index_0_id_6e7f3107_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=style&index=0&id=6e7f3107&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Logistics/ManageVehicles.vue?vue&type=template&id=6e7f3107&scoped=true":
/*!***************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ManageVehicles.vue?vue&type=template&id=6e7f3107&scoped=true ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_template_id_6e7f3107_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_template_id_6e7f3107_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ManageVehicles_vue_vue_type_template_id_6e7f3107_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ManageVehicles.vue?vue&type=template&id=6e7f3107&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=template&id=6e7f3107&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=template&id=6e7f3107&scoped=true":
/*!******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ManageVehicles.vue?vue&type=template&id=6e7f3107&scoped=true ***!
  \******************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "container-fluid py-4" },
    [
      _c("div", { staticClass: "row align-items-center mb-4" }, [
        _vm._m(0),
        _vm._v(" "),
        _c("div", { staticClass: "col-auto" }, [
          _c(
            "button",
            {
              staticClass:
                "btn btn-primary btn-lg shadow-sm font-weight-bold rounded-pill",
              on: { click: _vm.openCreateModal },
            },
            [
              _c("i", { staticClass: "fa fa-plus mr-2" }),
              _vm._v("Add New Vehicle\n            "),
            ]
          ),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row mb-4" }, [
        _c("div", { staticClass: "col-xl-3 col-md-6 mb-4" }, [
          _c(
            "div",
            {
              staticClass: "card h-100 shadow-sm rounded-lg card-light-primary",
            },
            [
              _c("div", { staticClass: "card-body" }, [
                _c(
                  "div",
                  { staticClass: "row no-gutters align-items-center" },
                  [
                    _c("div", { staticClass: "col mr-2" }, [
                      _c(
                        "div",
                        {
                          staticClass:
                            "text-xs font-weight-bold text-uppercase mb-1 text-primary",
                        },
                        [_vm._v("Total Vehicles")]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "h5 mb-0 font-weight-bold text-dark" },
                        [_vm._v(_vm._s(_vm.total))]
                      ),
                    ]),
                    _vm._v(" "),
                    _vm._m(1),
                  ]
                ),
              ]),
            ]
          ),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-xl-3 col-md-6 mb-4" }, [
          _c(
            "div",
            {
              staticClass: "card h-100 shadow-sm rounded-lg card-light-success",
            },
            [
              _c("div", { staticClass: "card-body" }, [
                _c(
                  "div",
                  { staticClass: "row no-gutters align-items-center" },
                  [
                    _c("div", { staticClass: "col mr-2" }, [
                      _c(
                        "div",
                        {
                          staticClass:
                            "text-xs font-weight-bold text-uppercase mb-1 text-success",
                        },
                        [_vm._v("Active Fleet")]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "h5 mb-0 font-weight-bold text-dark" },
                        [_vm._v(_vm._s(_vm.activeCount))]
                      ),
                    ]),
                    _vm._v(" "),
                    _vm._m(2),
                  ]
                ),
              ]),
            ]
          ),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-xl-3 col-md-6 mb-4" }, [
          _c(
            "div",
            {
              staticClass: "card h-100 shadow-sm rounded-lg card-light-warning",
            },
            [
              _c("div", { staticClass: "card-body" }, [
                _c(
                  "div",
                  { staticClass: "row no-gutters align-items-center" },
                  [
                    _c("div", { staticClass: "col mr-2" }, [
                      _c(
                        "div",
                        {
                          staticClass:
                            "text-xs font-weight-bold text-uppercase mb-1 text-warning",
                        },
                        [_vm._v("Total Capacity")]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "h5 mb-0 font-weight-bold text-dark" },
                        [_vm._v(_vm._s(_vm.totalCapacity) + " kg")]
                      ),
                    ]),
                    _vm._v(" "),
                    _vm._m(3),
                  ]
                ),
              ]),
            ]
          ),
        ]),
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "card border-0 shadow-sm rounded-lg overflow-hidden" },
        [
          _vm._m(4),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "card-body" },
            [
              _c(
                "b-row",
                { staticClass: "mb-2" },
                [
                  _c(
                    "b-col",
                    { attrs: { md: "3", "offset-md": "8" } },
                    [
                      _c("h6", { staticClass: "box-title" }, [
                        _vm._v("Search"),
                      ]),
                      _vm._v(" "),
                      _c("b-form-input", {
                        attrs: {
                          id: "filter-input",
                          type: "search",
                          placeholder: "Search",
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
                    "b-col",
                    { staticClass: "text-center", attrs: { md: "1" } },
                    [
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
                          staticClass: "btn btn-primary btn_refresh",
                          attrs: { title: "Refresh" },
                          on: {
                            click: function ($event) {
                              return _vm.getVehicles()
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
                    ]
                  ),
                ],
                1
              ),
              _vm._v(" "),
              _c("b-table", {
                attrs: {
                  items: _vm.vehicles,
                  fields: _vm.fields,
                  bordered: true,
                  busy: _vm.isLoading,
                  stacked: "md",
                  "show-empty": "",
                  small: "",
                  "empty-text": "No records to show",
                  "empty-filtered-text": "No records to show",
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
                            _c("strong", [_vm._v("Loading...")]),
                          ],
                          1
                        ),
                      ]
                    },
                    proxy: true,
                  },
                  {
                    key: "cell(name)",
                    fn: function (row) {
                      return [
                        _c(
                          "div",
                          { staticClass: "d-flex align-items-center" },
                          [
                            _c(
                              "div",
                              {
                                staticClass:
                                  "avatar-circle mr-3 bg-soft-primary",
                              },
                              [
                                _c("i", {
                                  staticClass: "fa fa-truck text-primary",
                                }),
                              ]
                            ),
                            _vm._v(
                              "\n                        " +
                                _vm._s(row.item.name) +
                                "\n                    "
                            ),
                          ]
                        ),
                      ]
                    },
                  },
                  {
                    key: "cell(vehicle_number)",
                    fn: function (row) {
                      return [
                        _c(
                          "span",
                          {
                            staticClass:
                              "badge bg-soft-secondary font-weight-bold text-dark border",
                          },
                          [_vm._v(_vm._s(row.item.vehicle_number))]
                        ),
                      ]
                    },
                  },
                  {
                    key: "cell(capacity)",
                    fn: function (row) {
                      return [
                        _vm._v(
                          "\n                    " +
                            _vm._s(row.item.capacity) +
                            " kg\n                "
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
                              _vm._v("Active"),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        row.item.status == 0
                          ? _c("span", { staticClass: "badge bg-danger" }, [
                              _vm._v("Inactive"),
                            ])
                          : _vm._e(),
                      ]
                    },
                  },
                  {
                    key: "cell(actions)",
                    fn: function (row) {
                      return [
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
                            staticClass: "btn btn-sm btn-primary mr-2",
                            attrs: { title: "Edit" },
                            on: {
                              click: function ($event) {
                                return _vm.openEditModal(row.item)
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
                            staticClass: "btn btn-sm btn-danger",
                            attrs: { title: "Delete" },
                            on: {
                              click: function ($event) {
                                return _vm.deleteVehicle(row.item.id)
                              },
                            },
                          },
                          [_c("i", { staticClass: "fa fa-trash" })]
                        ),
                      ]
                    },
                  },
                ]),
              }),
              _vm._v(" "),
              _c(
                "b-row",
                [
                  _c("b-col", { staticClass: "my-1", attrs: { md: "2" } }, [
                    _c(
                      "label",
                      [
                        _c(
                          "b-form-group",
                          {
                            staticClass: "mb-0",
                            attrs: {
                              label: "Per page",
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
                  ]),
                  _vm._v(" "),
                  _c(
                    "b-col",
                    {
                      staticClass: "my-1",
                      attrs: { md: "4", "offset-md": "6" },
                    },
                    [
                      _c("label", [
                        _vm._v("Total Records :- " + _vm._s(_vm.total) + " "),
                      ]),
                      _vm._v(" "),
                      _c("b-pagination", {
                        staticClass: "my-0",
                        attrs: {
                          "total-rows": _vm.total,
                          "per-page": _vm.perPage,
                          align: "fill",
                          size: "sm",
                        },
                        model: {
                          value: _vm.page,
                          callback: function ($$v) {
                            _vm.page = $$v
                          },
                          expression: "page",
                        },
                      }),
                    ],
                    1
                  ),
                ],
                1
              ),
            ],
            1
          ),
        ]
      ),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          attrs: {
            id: "vehicle-modal",
            title: _vm.isEdit ? "Edit Vehicle Details" : "Register New Vehicle",
            "hide-footer": "",
            centered: "",
            "body-class": "p-4",
            "header-class": "border-0 pb-0",
            "title-class": "font-weight-bold text-dark h4",
          },
          model: {
            value: _vm.modalShow,
            callback: function ($$v) {
              _vm.modalShow = $$v
            },
            expression: "modalShow",
          },
        },
        [
          _c(
            "form",
            {
              on: {
                submit: function ($event) {
                  $event.preventDefault()
                  return _vm.saveVehicle.apply(null, arguments)
                },
              },
            },
            [
              _c("div", { staticClass: "form-group mb-3" }, [
                _c(
                  "label",
                  {
                    staticClass:
                      "form-control-label text-muted font-weight-bold",
                  },
                  [
                    _vm._v("Vehicle Model / Name "),
                    _c("span", { staticClass: "text-danger" }, [_vm._v("*")]),
                  ]
                ),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.form.name,
                      expression: "form.name",
                    },
                  ],
                  staticClass:
                    "form-control form-control-lg border shadow-none",
                  attrs: {
                    type: "text",
                    placeholder: "e.g. Tata Ace, Mahindra Bolero",
                    required: "",
                  },
                  domProps: { value: _vm.form.name },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "name", $event.target.value)
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group mb-3" }, [
                _c(
                  "label",
                  {
                    staticClass:
                      "form-control-label text-muted font-weight-bold",
                  },
                  [
                    _vm._v("Vehicle Registration Number "),
                    _c("span", { staticClass: "text-danger" }, [_vm._v("*")]),
                  ]
                ),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.form.vehicle_number,
                      expression: "form.vehicle_number",
                    },
                  ],
                  staticClass:
                    "form-control form-control-lg border shadow-none",
                  attrs: {
                    type: "text",
                    placeholder: "e.g. MH-12-AB-1234",
                    required: "",
                  },
                  domProps: { value: _vm.form.vehicle_number },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "vehicle_number", $event.target.value)
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group mb-3" }, [
                _c(
                  "label",
                  {
                    staticClass:
                      "form-control-label text-muted font-weight-bold",
                  },
                  [
                    _vm._v("Load Weight Capacity (in Kilograms) "),
                    _c("span", { staticClass: "text-danger" }, [_vm._v("*")]),
                  ]
                ),
                _vm._v(" "),
                _c("div", { staticClass: "input-group" }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model.number",
                        value: _vm.form.capacity,
                        expression: "form.capacity",
                        modifiers: { number: true },
                      },
                    ],
                    staticClass:
                      "form-control form-control-lg border shadow-none",
                    attrs: {
                      type: "number",
                      step: "0.01",
                      placeholder: "e.g. 500",
                      required: "",
                    },
                    domProps: { value: _vm.form.capacity },
                    on: {
                      input: function ($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.$set(
                          _vm.form,
                          "capacity",
                          _vm._n($event.target.value)
                        )
                      },
                      blur: function ($event) {
                        return _vm.$forceUpdate()
                      },
                    },
                  }),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      staticClass:
                        "input-group-text bg-light border font-weight-bold text-muted",
                    },
                    [_vm._v("kg")]
                  ),
                ]),
              ]),
              _vm._v(" "),
              _vm.isEdit
                ? _c("div", { staticClass: "form-group mb-4" }, [
                    _c(
                      "label",
                      {
                        staticClass:
                          "form-control-label text-muted font-weight-bold d-block",
                      },
                      [_vm._v("Vehicle Fleet Status")]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "form-check form-switch fs-5 pl-0" },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.form.status,
                              expression: "form.status",
                            },
                          ],
                          staticClass: "form-check-input ms-0",
                          attrs: {
                            type: "checkbox",
                            id: "vehicle-status",
                            "true-value": 1,
                            "false-value": 0,
                          },
                          domProps: {
                            checked: Array.isArray(_vm.form.status)
                              ? _vm._i(_vm.form.status, null) > -1
                              : _vm._q(_vm.form.status, 1),
                          },
                          on: {
                            change: function ($event) {
                              var $$a = _vm.form.status,
                                $$el = $event.target,
                                $$c = $$el.checked ? 1 : 0
                              if (Array.isArray($$a)) {
                                var $$v = null,
                                  $$i = _vm._i($$a, $$v)
                                if ($$el.checked) {
                                  $$i < 0 &&
                                    _vm.$set(
                                      _vm.form,
                                      "status",
                                      $$a.concat([$$v])
                                    )
                                } else {
                                  $$i > -1 &&
                                    _vm.$set(
                                      _vm.form,
                                      "status",
                                      $$a
                                        .slice(0, $$i)
                                        .concat($$a.slice($$i + 1))
                                    )
                                }
                              } else {
                                _vm.$set(_vm.form, "status", $$c)
                              }
                            },
                          },
                        }),
                        _vm._v(" "),
                        _c(
                          "label",
                          {
                            staticClass:
                              "form-check-label ml-2 font-weight-bold text-dark",
                            attrs: { for: "vehicle-status" },
                          },
                          [
                            _vm._v(
                              "\n                        " +
                                _vm._s(
                                  _vm.form.status == 1
                                    ? "Active & Ready for Dispatch"
                                    : "Inactive / Maintenance"
                                ) +
                                "\n                    "
                            ),
                          ]
                        ),
                      ]
                    ),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass:
                    "d-flex justify-content-end gap-2 mt-4 pt-3 border-top",
                },
                [
                  _c(
                    "b-button",
                    {
                      staticClass: "btn-lg px-4 font-weight-bold rounded-pill",
                      attrs: { variant: "light" },
                      on: {
                        click: function ($event) {
                          _vm.modalShow = false
                        },
                      },
                    },
                    [_vm._v("Cancel")]
                  ),
                  _vm._v(" "),
                  _c(
                    "b-button",
                    {
                      staticClass: "btn-lg px-4 font-weight-bold rounded-pill",
                      attrs: {
                        type: "submit",
                        variant: "primary",
                        disabled: _vm.loading,
                      },
                    },
                    [
                      _vm.loading
                        ? _c("b-spinner", {
                            staticClass: "mr-2",
                            attrs: { small: "" },
                          })
                        : _vm._e(),
                      _vm._v(
                        "\n                    " +
                          _vm._s(
                            _vm.isEdit ? "Save Changes" : "Register Vehicle"
                          ) +
                          "\n                "
                      ),
                    ],
                    1
                  ),
                ],
                1
              ),
            ]
          ),
        ]
      ),
    ],
    1
  )
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col" }, [
      _c("h1", { staticClass: "h3 text-dark font-weight-bold mb-1" }, [
        _c("i", { staticClass: "fa fa-truck text-primary mr-2" }),
        _vm._v("Manage Vehicles\n            "),
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "text-muted mb-0" }, [
        _vm._v(
          "Add, edit, and manage your distribution fleet and load capacities."
        ),
      ]),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-auto" }, [
      _c("i", { staticClass: "fa fa-truck fa-2x text-primary opacity-75" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-auto" }, [
      _c("i", {
        staticClass: "fa fa-check-circle fa-2x text-success opacity-75",
      }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-auto" }, [
      _c("i", {
        staticClass: "fa fa-balance-scale fa-2x text-warning opacity-75",
      }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "card-header bg-white border-0 py-3" }, [
      _c("h4", { staticClass: "m-0 font-weight-bold text-dark" }, [
        _vm._v("Vehicles"),
      ]),
    ])
  },
]
render._withStripped = true



/***/ })

}]);