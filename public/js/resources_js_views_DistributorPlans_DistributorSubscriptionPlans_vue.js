"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_DistributorPlans_DistributorSubscriptionPlans_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=script&lang=js":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=script&lang=js ***!
  \**********************************************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      activeTab: 'plans',
      plans: [],
      assignments: [],
      taxes: [],
      sellers: [],
      isLoading: false,
      isAssignmentsLoading: false,
      saving: false,
      assigning: false,
      isEdit: false,
      planModalOpen: false,
      assignModalOpen: false,
      planFields: [{
        key: 'id',
        label: __('id')
      }, {
        key: 'name',
        label: __('name')
      }, {
        key: 'duration',
        label: __('duration')
      }, {
        key: 'price',
        label: __('price')
      }, {
        key: 'status',
        label: __('status')
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      assignmentFields: [{
        key: 'id',
        label: __('id')
      }, {
        key: 'seller',
        label: __('distributor')
      }, {
        key: 'plan_name',
        label: __('name')
      }, {
        key: 'start_date',
        label: __('start_date')
      }, {
        key: 'end_date',
        label: __('end_date')
      }, {
        key: 'status',
        label: __('status')
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      form: this.emptyForm(),
      assignForm: {
        plan_id: null,
        seller_id: null,
        start_date: ''
      }
    };
  },
  created: function created() {
    this.fetchPlans();
    this.fetchTaxes();
    this.fetchSellers();
  },
  methods: {
    emptyForm: function emptyForm() {
      return {
        id: null,
        name: '',
        description: '',
        duration_type: 'unlimited',
        duration_days: null,
        price: 0,
        discounted_price: null,
        tax_type: 'inclusive',
        tax_id: null,
        commission_percentage: null,
        publish: 1,
        status: 1
      };
    },
    fetchPlans: function fetchPlans() {
      var _this = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/distributor_subscription_plans').then(function (response) {
        var data = response.data && response.data.data || {};
        _this.plans = data.records || [];
        _this.isLoading = false;
      })["catch"](function () {
        _this.isLoading = false;
      });
    },
    fetchAssignments: function fetchAssignments() {
      var _this2 = this;
      this.isAssignmentsLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/distributor_subscription_plans/assignments').then(function (response) {
        var data = response.data && response.data.data || {};
        _this2.assignments = data.records || [];
        _this2.isAssignmentsLoading = false;
      })["catch"](function () {
        _this2.isAssignmentsLoading = false;
      });
    },
    fetchTaxes: function fetchTaxes() {
      var _this3 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/taxes', {
        params: {
          limit: 0
        }
      }).then(function (response) {
        var data = response.data && response.data.data || [];
        _this3.taxes = Array.isArray(data) ? data : data.records || [];
      })["catch"](function () {});
    },
    fetchSellers: function fetchSellers() {
      var _this4 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/distributor_subscription_plans/sellers').then(function (response) {
        var data = response.data && response.data.data || {};
        _this4.sellers = data.records || [];
      })["catch"](function () {});
    },
    openCreateModal: function openCreateModal() {
      this.isEdit = false;
      this.form = this.emptyForm();
      this.planModalOpen = true;
    },
    openEditModal: function openEditModal(item) {
      this.isEdit = true;
      this.form = {
        id: item.id,
        name: item.name,
        description: item.description,
        duration_type: item.duration_type,
        duration_days: item.duration_days,
        price: item.price,
        discounted_price: item.discounted_price,
        tax_type: item.tax_type,
        tax_id: item.tax_id,
        commission_percentage: item.commission_percentage,
        publish: item.publish ? 1 : 0,
        status: item.status ? 1 : 0
      };
      this.planModalOpen = true;
    },
    savePlan: function savePlan() {
      var _this5 = this;
      if (this.form.discounted_price && parseFloat(this.form.discounted_price) >= parseFloat(this.form.price)) {
        this.showMessage('error', __('discount_price_must_be_less_than_price'));
        return;
      }
      this.saving = true;
      var url = this.isEdit ? this.$apiUrl + '/distributor_subscription_plans/update/' + this.form.id : this.$apiUrl + '/distributor_subscription_plans/save';
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, this.form).then(function (response) {
        _this5.saving = false;
        _this5.planModalOpen = false;
        _this5.showMessage('success', response.data.message);
        _this5.fetchPlans();
      })["catch"](function (err) {
        _this5.saving = false;
        _this5.showMessage('error', err.response && err.response.data && err.response.data.message || __('something_went_wrong'));
      });
    },
    toggleStatus: function toggleStatus(item) {
      var _this6 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + '/distributor_subscription_plans/update_status/' + item.id, {
        status: item.status
      }).then(function (response) {
        _this6.showMessage('success', response.data.message);
      })["catch"](function () {
        _this6.fetchPlans();
      });
    },
    deletePlan: function deletePlan(id) {
      var _this7 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_be_able_to_revert_this'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (result.value) {
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this7.$apiUrl + '/distributor_subscription_plans/delete/' + id).then(function (response) {
            _this7.showMessage('success', response.data.message);
            _this7.fetchPlans();
          });
        }
      });
    },
    openAssignModal: function openAssignModal(item) {
      this.assignForm = {
        plan_id: item.id,
        seller_id: null,
        start_date: new Date().toISOString().slice(0, 10)
      };
      this.assignModalOpen = true;
    },
    assignPlan: function assignPlan(bvModalEvent) {
      var _this8 = this;
      bvModalEvent.preventDefault();
      this.assigning = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + '/distributor_subscription_plans/assign', this.assignForm).then(function (response) {
        _this8.assigning = false;
        _this8.assignModalOpen = false;
        _this8.showMessage('success', response.data.message);
      })["catch"](function (err) {
        _this8.assigning = false;
        _this8.showMessage('error', err.response && err.response.data && err.response.data.message || __('something_went_wrong'));
      });
    },
    cancelAssignment: function cancelAssignment(id) {
      var _this9 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_be_able_to_revert_this'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (result.value) {
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this9.$apiUrl + '/distributor_subscription_plans/assignments/' + id + '/cancel').then(function (response) {
            _this9.showMessage('success', response.data.message);
            _this9.fetchAssignments();
          });
        }
      });
    },
    assignmentBadgeClass: function assignmentBadgeClass(status) {
      return {
        active: 'bg-success',
        expired: 'bg-secondary',
        cancelled: 'bg-danger'
      }[status] || 'bg-secondary';
    }
  }
});

/***/ }),

/***/ "./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue":
/*!******************************************************************************!*\
  !*** ./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DistributorSubscriptionPlans_vue_vue_type_template_id_4fef32fa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DistributorSubscriptionPlans.vue?vue&type=template&id=4fef32fa */ "./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=template&id=4fef32fa");
/* harmony import */ var _DistributorSubscriptionPlans_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DistributorSubscriptionPlans.vue?vue&type=script&lang=js */ "./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _DistributorSubscriptionPlans_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _DistributorSubscriptionPlans_vue_vue_type_template_id_4fef32fa__WEBPACK_IMPORTED_MODULE_0__.render,
  _DistributorSubscriptionPlans_vue_vue_type_template_id_4fef32fa__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=script&lang=js":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DistributorSubscriptionPlans_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DistributorSubscriptionPlans.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DistributorSubscriptionPlans_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=template&id=4fef32fa":
/*!************************************************************************************************************!*\
  !*** ./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=template&id=4fef32fa ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DistributorSubscriptionPlans_vue_vue_type_template_id_4fef32fa__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DistributorSubscriptionPlans_vue_vue_type_template_id_4fef32fa__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DistributorSubscriptionPlans_vue_vue_type_template_id_4fef32fa__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./DistributorSubscriptionPlans.vue?vue&type=template&id=4fef32fa */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=template&id=4fef32fa");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=template&id=4fef32fa":
/*!***************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/DistributorPlans/DistributorSubscriptionPlans.vue?vue&type=template&id=4fef32fa ***!
  \***************************************************************************************************************************************************************************************************************************************************/
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
          _vm._v(_vm._s(_vm.__("subscription_plan"))),
        ]),
        _vm._v(" "),
        _c(
          "button",
          {
            staticClass:
              "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2",
            on: { click: _vm.openCreateModal },
          },
          [
            _c("i", {
              staticClass: "fa fa-plus",
              attrs: { "aria-hidden": "true" },
            }),
            _vm._v(" "),
            _c("span", [_vm._v(_vm._s(_vm.__("add")))]),
          ]
        ),
      ]),
      _vm._v(" "),
      _c("ul", { staticClass: "nav nav-tabs mb-3" }, [
        _c("li", { staticClass: "nav-item" }, [
          _c(
            "a",
            {
              staticClass: "nav-link",
              class: { active: _vm.activeTab === "plans" },
              attrs: { href: "javascript:void(0)" },
              on: {
                click: function ($event) {
                  _vm.activeTab = "plans"
                },
              },
            },
            [
              _vm._v(
                "\n                " +
                  _vm._s(_vm.__("distributor_subscription_plans")) +
                  "\n            "
              ),
            ]
          ),
        ]),
        _vm._v(" "),
        _c("li", { staticClass: "nav-item" }, [
          _c(
            "a",
            {
              staticClass: "nav-link",
              class: { active: _vm.activeTab === "assignments" },
              attrs: { href: "javascript:void(0)" },
              on: {
                click: function ($event) {
                  _vm.activeTab = "assignments"
                  _vm.fetchAssignments()
                },
              },
            },
            [
              _vm._v(
                "\n                " +
                  _vm._s(_vm.__("distributor_subscriptions")) +
                  "\n            "
              ),
            ]
          ),
        ]),
      ]),
      _vm._v(" "),
      _vm.activeTab === "plans"
        ? _c("div", { staticClass: "list-surface" }, [
            _c(
              "div",
              { staticClass: "table-responsive" },
              [
                _c("b-table", {
                  attrs: {
                    items: _vm.plans,
                    fields: _vm.planFields,
                    busy: _vm.isLoading,
                    bordered: true,
                    stacked: "md",
                    "show-empty": "",
                    small: "",
                  },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "table-busy",
                        fn: function () {
                          return [
                            _c(
                              "div",
                              { staticClass: "text-center text-black my-2" },
                              [
                                _c("b-spinner", {
                                  staticClass: "align-middle",
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
                        key: "cell(price)",
                        fn: function (row) {
                          return [
                            row.item.discounted_price
                              ? [
                                  _c("strong", [
                                    _vm._v(
                                      _vm._s(_vm.$currency) +
                                        " " +
                                        _vm._s(row.item.discounted_price)
                                    ),
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "span",
                                    { staticClass: "text-muted small" },
                                    [
                                      _c("s", [
                                        _vm._v(
                                          _vm._s(_vm.$currency) +
                                            " " +
                                            _vm._s(row.item.price)
                                        ),
                                      ]),
                                    ]
                                  ),
                                ]
                              : [
                                  _vm._v(
                                    "\n                        " +
                                      _vm._s(_vm.$currency) +
                                      " " +
                                      _vm._s(row.item.price) +
                                      "\n                    "
                                  ),
                                ],
                          ]
                        },
                      },
                      {
                        key: "cell(duration)",
                        fn: function (row) {
                          return [
                            _vm._v(
                              "\n                    " +
                                _vm._s(
                                  row.item.duration_type === "limited"
                                    ? row.item.duration_days +
                                        " " +
                                        _vm.__("days")
                                    : _vm.__("unlimited")
                                ) +
                                "\n                "
                            ),
                          ]
                        },
                      },
                      {
                        key: "cell(status)",
                        fn: function (row) {
                          return [
                            _c("b-form-checkbox", {
                              attrs: {
                                switch: "",
                                value: true,
                                "unchecked-value": false,
                              },
                              on: {
                                change: function ($event) {
                                  return _vm.toggleStatus(row.item)
                                },
                              },
                              model: {
                                value: row.item.status,
                                callback: function ($$v) {
                                  _vm.$set(row.item, "status", $$v)
                                },
                                expression: "row.item.status",
                              },
                            }),
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
                                  staticClass: "list-action-btn is-edit",
                                  attrs: {
                                    title: _vm.__("assign_to_distributor"),
                                  },
                                  on: {
                                    click: function ($event) {
                                      return _vm.openAssignModal(row.item)
                                    },
                                  },
                                },
                                [_c("i", { staticClass: "fa fa-user-plus" })]
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
                                      return _vm.deletePlan(row.item.id)
                                    },
                                  },
                                },
                                [_c("i", { staticClass: "fa fa-trash" })]
                              ),
                            ]),
                          ]
                        },
                      },
                    ],
                    null,
                    false,
                    2652590330
                  ),
                }),
              ],
              1
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.activeTab === "assignments"
        ? _c("div", { staticClass: "list-surface" }, [
            _c(
              "div",
              { staticClass: "table-responsive" },
              [
                _c("b-table", {
                  attrs: {
                    items: _vm.assignments,
                    fields: _vm.assignmentFields,
                    busy: _vm.isAssignmentsLoading,
                    bordered: true,
                    stacked: "md",
                    "show-empty": "",
                    small: "",
                  },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "table-busy",
                        fn: function () {
                          return [
                            _c(
                              "div",
                              { staticClass: "text-center text-black my-2" },
                              [
                                _c("b-spinner", {
                                  staticClass: "align-middle",
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
                        key: "cell(seller)",
                        fn: function (row) {
                          return [
                            _vm._v(
                              "\n                    " +
                                _vm._s(
                                  row.item.seller
                                    ? row.item.seller.store_name ||
                                        row.item.seller.name
                                    : "-"
                                ) +
                                "\n                "
                            ),
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
                                staticClass: "badge",
                                class: _vm.assignmentBadgeClass(
                                  row.item.status
                                ),
                              },
                              [_vm._v(_vm._s(row.item.status))]
                            ),
                          ]
                        },
                      },
                      {
                        key: "cell(actions)",
                        fn: function (row) {
                          return [
                            _c("div", { staticClass: "list-actions" }, [
                              row.item.status === "active"
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
                                      attrs: { title: _vm.__("cancel") },
                                      on: {
                                        click: function ($event) {
                                          return _vm.cancelAssignment(
                                            row.item.id
                                          )
                                        },
                                      },
                                    },
                                    [_c("i", { staticClass: "fa fa-times" })]
                                  )
                                : _vm._e(),
                            ]),
                          ]
                        },
                      },
                    ],
                    null,
                    false,
                    924403688
                  ),
                }),
              ],
              1
            ),
          ])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          attrs: {
            title: _vm.isEdit ? _vm.__("edit") : _vm.__("add"),
            size: "xl",
            "hide-footer": "",
            "no-close-on-backdrop": "",
          },
          model: {
            value: _vm.planModalOpen,
            callback: function ($$v) {
              _vm.planModalOpen = $$v
            },
            expression: "planModalOpen",
          },
        },
        [
          _c(
            "form",
            {
              on: {
                submit: function ($event) {
                  $event.preventDefault()
                  return _vm.savePlan.apply(null, arguments)
                },
              },
            },
            [
              _c("div", { staticClass: "row" }, [
                _c("div", { staticClass: "col-lg-8 mb-3" }, [
                  _c("div", { staticClass: "card h-100" }, [
                    _c(
                      "div",
                      {
                        staticClass:
                          "card-header d-flex justify-content-between align-items-center",
                      },
                      [
                        _c("h5", { staticClass: "card-title mb-0" }, [
                          _vm._v(_vm._s(_vm.__("subscription_information"))),
                        ]),
                        _vm._v(" "),
                        _c(
                          "b-form-checkbox",
                          {
                            attrs: {
                              switch: "",
                              value: 1,
                              "unchecked-value": 0,
                            },
                            model: {
                              value: _vm.form.status,
                              callback: function ($$v) {
                                _vm.$set(_vm.form, "status", $$v)
                              },
                              expression: "form.status",
                            },
                          },
                          [_vm._v(_vm._s(_vm.__("active")))]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c("div", { staticClass: "card-body" }, [
                      _c("div", { staticClass: "row" }, [
                        _c("div", { staticClass: "col-md-6 form-group mb-3" }, [
                          _c("label", { staticClass: "font-weight-bold" }, [
                            _vm._v(_vm._s(_vm.__("name")) + " *"),
                          ]),
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
                            staticClass: "form-control",
                            attrs: { type: "text", required: "" },
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
                        _c(
                          "div",
                          { staticClass: "col-md-6 form-group mb-3" },
                          [
                            _c(
                              "label",
                              { staticClass: "font-weight-bold d-block" },
                              [_vm._v(_vm._s(_vm.__("duration")) + " *")]
                            ),
                            _vm._v(" "),
                            _c("b-form-radio-group", {
                              staticClass: "pt-2",
                              attrs: {
                                options: [
                                  { text: _vm.__("limited"), value: "limited" },
                                  {
                                    text: _vm.__("unlimited"),
                                    value: "unlimited",
                                  },
                                ],
                              },
                              model: {
                                value: _vm.form.duration_type,
                                callback: function ($$v) {
                                  _vm.$set(_vm.form, "duration_type", $$v)
                                },
                                expression: "form.duration_type",
                              },
                            }),
                            _vm._v(" "),
                            _vm.form.duration_type === "limited"
                              ? _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model.number",
                                      value: _vm.form.duration_days,
                                      expression: "form.duration_days",
                                      modifiers: { number: true },
                                    },
                                  ],
                                  staticClass: "form-control mt-2",
                                  attrs: {
                                    type: "number",
                                    min: "1",
                                    placeholder: _vm.__("days"),
                                    required: "",
                                  },
                                  domProps: { value: _vm.form.duration_days },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.form,
                                        "duration_days",
                                        _vm._n($event.target.value)
                                      )
                                    },
                                    blur: function ($event) {
                                      return _vm.$forceUpdate()
                                    },
                                  },
                                })
                              : _vm._e(),
                          ],
                          1
                        ),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "form-group mb-3" }, [
                        _c("label", { staticClass: "font-weight-bold" }, [
                          _vm._v(_vm._s(_vm.__("description")) + " *"),
                        ]),
                        _vm._v(" "),
                        _c("textarea", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.form.description,
                              expression: "form.description",
                            },
                          ],
                          staticClass: "form-control",
                          attrs: { rows: "3", required: "" },
                          domProps: { value: _vm.form.description },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.form,
                                "description",
                                $event.target.value
                              )
                            },
                          },
                        }),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "form-group mb-0" },
                        [
                          _c(
                            "label",
                            { staticClass: "font-weight-bold d-block" },
                            [_vm._v(_vm._s(_vm.__("publish")))]
                          ),
                          _vm._v(" "),
                          _c(
                            "b-form-checkbox",
                            {
                              attrs: {
                                switch: "",
                                value: 1,
                                "unchecked-value": 0,
                              },
                              model: {
                                value: _vm.form.publish,
                                callback: function ($$v) {
                                  _vm.$set(_vm.form, "publish", $$v)
                                },
                                expression: "form.publish",
                              },
                            },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(
                                    _vm.form.publish
                                      ? _vm.__("yes")
                                      : _vm.__("no")
                                  ) +
                                  "\n                                "
                              ),
                            ]
                          ),
                        ],
                        1
                      ),
                    ]),
                  ]),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "col-lg-4 mb-3" }, [
                  _c("div", { staticClass: "card h-100" }, [
                    _c("div", { staticClass: "card-header" }, [
                      _c("h5", { staticClass: "card-title mb-0" }, [
                        _vm._v(_vm._s(_vm.__("price_details"))),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "card-body" }, [
                      _c("div", { staticClass: "form-group mb-3" }, [
                        _c("label", { staticClass: "font-weight-bold" }, [
                          _vm._v(_vm._s(_vm.__("price")) + " *"),
                        ]),
                        _vm._v(" "),
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model.number",
                              value: _vm.form.price,
                              expression: "form.price",
                              modifiers: { number: true },
                            },
                          ],
                          staticClass: "form-control",
                          attrs: {
                            type: "number",
                            step: "0.01",
                            min: "0",
                            required: "",
                          },
                          domProps: { value: _vm.form.price },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.form,
                                "price",
                                _vm._n($event.target.value)
                              )
                            },
                            blur: function ($event) {
                              return _vm.$forceUpdate()
                            },
                          },
                        }),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "form-group mb-3" }, [
                        _c("label", { staticClass: "font-weight-bold" }, [
                          _vm._v(_vm._s(_vm.__("discount_price"))),
                        ]),
                        _vm._v(" "),
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model.number",
                              value: _vm.form.discounted_price,
                              expression: "form.discounted_price",
                              modifiers: { number: true },
                            },
                          ],
                          staticClass: "form-control",
                          attrs: { type: "number", step: "0.01", min: "0" },
                          domProps: { value: _vm.form.discounted_price },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.form,
                                "discounted_price",
                                _vm._n($event.target.value)
                              )
                            },
                            blur: function ($event) {
                              return _vm.$forceUpdate()
                            },
                          },
                        }),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "form-group mb-3" }, [
                        _c("label", { staticClass: "font-weight-bold" }, [
                          _vm._v(_vm._s(_vm.__("tax_type")) + " *"),
                        ]),
                        _vm._v(" "),
                        _c(
                          "select",
                          {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.form.tax_type,
                                expression: "form.tax_type",
                              },
                            ],
                            staticClass: "form-control",
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
                                  _vm.form,
                                  "tax_type",
                                  $event.target.multiple
                                    ? $$selectedVal
                                    : $$selectedVal[0]
                                )
                              },
                            },
                          },
                          [
                            _c("option", { attrs: { value: "inclusive" } }, [
                              _vm._v(_vm._s(_vm.__("tax_included_in_price"))),
                            ]),
                            _vm._v(" "),
                            _c("option", { attrs: { value: "exclusive" } }, [
                              _vm._v(_vm._s(_vm.__("tax_excluded_from_price"))),
                            ]),
                          ]
                        ),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "form-group mb-3" }, [
                        _c("label", { staticClass: "font-weight-bold" }, [
                          _vm._v(_vm._s(_vm.__("select_tax"))),
                        ]),
                        _vm._v(" "),
                        _c(
                          "select",
                          {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.form.tax_id,
                                expression: "form.tax_id",
                              },
                            ],
                            staticClass: "form-control",
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
                                  _vm.form,
                                  "tax_id",
                                  $event.target.multiple
                                    ? $$selectedVal
                                    : $$selectedVal[0]
                                )
                              },
                            },
                          },
                          [
                            _c("option", { domProps: { value: null } }, [
                              _vm._v(_vm._s(_vm.__("none"))),
                            ]),
                            _vm._v(" "),
                            _vm._l(_vm.taxes, function (t) {
                              return _c(
                                "option",
                                { key: t.id, domProps: { value: t.id } },
                                [
                                  _vm._v(
                                    _vm._s(t.title) +
                                      " (" +
                                      _vm._s(t.percentage) +
                                      "%)"
                                  ),
                                ]
                              )
                            }),
                          ],
                          2
                        ),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "form-group mb-0" }, [
                        _c("label", { staticClass: "font-weight-bold" }, [
                          _vm._v(_vm._s(_vm.__("commission")) + " (%)"),
                        ]),
                        _vm._v(" "),
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model.number",
                              value: _vm.form.commission_percentage,
                              expression: "form.commission_percentage",
                              modifiers: { number: true },
                            },
                          ],
                          staticClass: "form-control",
                          attrs: {
                            type: "number",
                            step: "0.01",
                            min: "0",
                            max: "100",
                          },
                          domProps: { value: _vm.form.commission_percentage },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.form,
                                "commission_percentage",
                                _vm._n($event.target.value)
                              )
                            },
                            blur: function ($event) {
                              return _vm.$forceUpdate()
                            },
                          },
                        }),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "text-end mt-3" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-secondary me-2",
                    attrs: { type: "button" },
                    on: {
                      click: function ($event) {
                        _vm.planModalOpen = false
                      },
                    },
                  },
                  [_vm._v(_vm._s(_vm.__("cancel")))]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary",
                    attrs: { type: "submit", disabled: _vm.saving },
                  },
                  [
                    _vm._v(
                      "\n                    " + _vm._s(_vm.__("save")) + " "
                    ),
                    _vm.saving
                      ? _c("b-spinner", { attrs: { small: "" } })
                      : _vm._e(),
                  ],
                  1
                ),
              ]),
            ]
          ),
        ]
      ),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          attrs: {
            title: _vm.__("assign_to_distributor"),
            "ok-title": _vm.__("assign"),
            "cancel-title": _vm.__("cancel"),
            "ok-disabled": _vm.assigning,
          },
          on: { ok: _vm.assignPlan },
          model: {
            value: _vm.assignModalOpen,
            callback: function ($$v) {
              _vm.assignModalOpen = $$v
            },
            expression: "assignModalOpen",
          },
        },
        [
          _c("div", { staticClass: "form-group mb-3" }, [
            _c("label", { staticClass: "font-weight-bold" }, [
              _vm._v(_vm._s(_vm.__("select_distributor")) + " *"),
            ]),
            _vm._v(" "),
            _c(
              "select",
              {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.assignForm.seller_id,
                    expression: "assignForm.seller_id",
                  },
                ],
                staticClass: "form-control",
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
                    _vm.$set(
                      _vm.assignForm,
                      "seller_id",
                      $event.target.multiple ? $$selectedVal : $$selectedVal[0]
                    )
                  },
                },
              },
              [
                _c("option", { domProps: { value: null } }, [
                  _vm._v(_vm._s(_vm.__("select_distributor"))),
                ]),
                _vm._v(" "),
                _vm._l(_vm.sellers, function (s) {
                  return _c(
                    "option",
                    { key: s.id, domProps: { value: s.id } },
                    [_vm._v(_vm._s(s.store_name || s.name))]
                  )
                }),
              ],
              2
            ),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "form-group mb-0" }, [
            _c("label", { staticClass: "font-weight-bold" }, [
              _vm._v(_vm._s(_vm.__("start_date")) + " *"),
            ]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.assignForm.start_date,
                  expression: "assignForm.start_date",
                },
              ],
              staticClass: "form-control",
              attrs: { type: "date", required: "" },
              domProps: { value: _vm.assignForm.start_date },
              on: {
                input: function ($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.$set(_vm.assignForm, "start_date", $event.target.value)
                },
              },
            }),
          ]),
        ]
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);