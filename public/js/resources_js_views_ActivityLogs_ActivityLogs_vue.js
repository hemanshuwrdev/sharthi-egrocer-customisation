"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_ActivityLogs_ActivityLogs_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  data: function data() {
    return {
      fields: [{
        key: 'date',
        label: __('date'),
        sortable: false
      }, {
        key: 'event',
        label: __('event')
      }, {
        key: 'module',
        label: __('module')
      }, {
        key: 'description',
        label: __('description')
      }, {
        key: 'user',
        label: __('user')
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      logs: [],
      totalRows: 0,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      filter: null,
      filterTimeout: null,
      isLoading: false,
      logTypeOptions: [{
        value: '',
        text: __('all_log_types')
      }],
      eventOptions: [{
        value: '',
        text: __('all_events')
      }],
      moduleOptions: [{
        value: '',
        text: __('all_modules')
      }],
      userOptions: [{
        value: '',
        text: __('all_users')
      }],
      selectedLogType: '',
      selectedEvent: '',
      selectedModule: '',
      selectedUser: '',
      selectedDate: '',
      showDetailModal: false,
      detailRecord: null
    };
  },
  created: function created() {
    this.fetchFilters();
    this.fetchLogs(1);
  },
  methods: {
    fetchFilters: function fetchFilters() {
      var _this = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/activity_logs/filters').then(function (response) {
        var data = response.data && response.data.data || {};
        _this.logTypeOptions = [{
          value: '',
          text: __('all_log_types')
        }].concat((data.log_types || []).map(function (t) {
          return {
            value: t,
            text: t
          };
        }));
        _this.eventOptions = [{
          value: '',
          text: __('all_events')
        }].concat((data.events || []).map(function (e) {
          return {
            value: e,
            text: _this.eventLabel(e)
          };
        }));
        _this.moduleOptions = [{
          value: '',
          text: __('all_modules')
        }].concat((data.modules || []).map(function (m) {
          return {
            value: m.value,
            text: m.label
          };
        }));
        _this.userOptions = [{
          value: '',
          text: __('all_users')
        }].concat((data.users || []).map(function (u) {
          return {
            value: u.id,
            text: u.name + (u.role ? ' (' + u.role + ')' : '')
          };
        }));
      })["catch"](function () {});
    },
    onFilterChange: function onFilterChange() {
      var _this2 = this;
      clearTimeout(this.filterTimeout);
      this.filterTimeout = setTimeout(function () {
        _this2.fetchLogs(1);
      }, 400);
    },
    clearDate: function clearDate() {
      this.selectedDate = '';
      this.fetchLogs(1);
    },
    fetchLogs: function fetchLogs(page) {
      var _this3 = this;
      this.currentPage = page || this.currentPage;
      this.isLoading = true;
      var params = {
        page: this.currentPage,
        per_page: this.perPage,
        search: this.filter || undefined,
        log_type: this.selectedLogType || undefined,
        event: this.selectedEvent || undefined,
        module: this.selectedModule || undefined,
        user_id: this.selectedUser || undefined,
        date: this.selectedDate || undefined
      };
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/activity_logs', {
        params: params
      }).then(function (response) {
        var data = response.data && response.data.data || {};
        _this3.logs = Array.isArray(data.records) ? data.records : [];
        _this3.totalRows = typeof data.total === 'number' ? data.total : 0;
        _this3.isLoading = false;
      })["catch"](function () {
        _this3.logs = [];
        _this3.totalRows = 0;
        _this3.isLoading = false;
      });
    },
    eventLabel: function eventLabel(event) {
      if (!event) return '';
      return event.charAt(0).toUpperCase() + event.slice(1);
    },
    eventBadgeClass: function eventBadgeClass(event) {
      switch (event) {
        case 'created':
          return 'bg-success';
        case 'updated':
          return 'bg-info';
        case 'deleted':
          return 'bg-danger';
        case 'login':
          return 'bg-primary';
        case 'logout':
          return 'bg-secondary';
        default:
          return 'bg-secondary';
      }
    },
    viewDetail: function viewDetail(item) {
      var _this4 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/activity_logs/' + item.id).then(function (response) {
        _this4.detailRecord = response.data && response.data.data || null;
        _this4.showDetailModal = true;
        _this4.isLoading = false;
      })["catch"](function () {
        _this4.isLoading = false;
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/ActivityLogs/ActivityLogs.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/ActivityLogs/ActivityLogs.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ActivityLogs_vue_vue_type_template_id_3a268f00__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ActivityLogs.vue?vue&type=template&id=3a268f00 */ "./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=template&id=3a268f00");
/* harmony import */ var _ActivityLogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ActivityLogs.vue?vue&type=script&lang=js */ "./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ActivityLogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ActivityLogs_vue_vue_type_template_id_3a268f00__WEBPACK_IMPORTED_MODULE_0__.render,
  _ActivityLogs_vue_vue_type_template_id_3a268f00__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/ActivityLogs/ActivityLogs.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ActivityLogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActivityLogs.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ActivityLogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=template&id=3a268f00":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=template&id=3a268f00 ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActivityLogs_vue_vue_type_template_id_3a268f00__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActivityLogs_vue_vue_type_template_id_3a268f00__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ActivityLogs_vue_vue_type_template_id_3a268f00__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ActivityLogs.vue?vue&type=template&id=3a268f00 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=template&id=3a268f00");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=template&id=3a268f00":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/ActivityLogs/ActivityLogs.vue?vue&type=template&id=3a268f00 ***!
  \*******************************************************************************************************************************************************************************************************************************/
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
          _vm._v(_vm._s(_vm.__("activity_logs"))),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "list-surface" }, [
        _c(
          "div",
          { staticClass: "list-toolbar flex-wrap gap-2" },
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
                  on: { input: _vm.onFilterChange },
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
              attrs: { options: _vm.logTypeOptions, size: "sm" },
              on: {
                change: function ($event) {
                  return _vm.fetchLogs(1)
                },
              },
              model: {
                value: _vm.selectedLogType,
                callback: function ($$v) {
                  _vm.selectedLogType = $$v
                },
                expression: "selectedLogType",
              },
            }),
            _vm._v(" "),
            _c("b-form-select", {
              staticClass: "form-control form-select w-auto",
              attrs: { options: _vm.eventOptions, size: "sm" },
              on: {
                change: function ($event) {
                  return _vm.fetchLogs(1)
                },
              },
              model: {
                value: _vm.selectedEvent,
                callback: function ($$v) {
                  _vm.selectedEvent = $$v
                },
                expression: "selectedEvent",
              },
            }),
            _vm._v(" "),
            _c("b-form-select", {
              staticClass: "form-control form-select w-auto",
              attrs: { options: _vm.moduleOptions, size: "sm" },
              on: {
                change: function ($event) {
                  return _vm.fetchLogs(1)
                },
              },
              model: {
                value: _vm.selectedModule,
                callback: function ($$v) {
                  _vm.selectedModule = $$v
                },
                expression: "selectedModule",
              },
            }),
            _vm._v(" "),
            _c("b-form-select", {
              staticClass: "form-control form-select w-auto",
              attrs: { options: _vm.userOptions, size: "sm" },
              on: {
                change: function ($event) {
                  return _vm.fetchLogs(1)
                },
              },
              model: {
                value: _vm.selectedUser,
                callback: function ($$v) {
                  _vm.selectedUser = $$v
                },
                expression: "selectedUser",
              },
            }),
            _vm._v(" "),
            _c("b-form-input", {
              staticClass: "form-control w-auto",
              attrs: { type: "date", size: "sm" },
              on: {
                change: function ($event) {
                  return _vm.fetchLogs(1)
                },
              },
              model: {
                value: _vm.selectedDate,
                callback: function ($$v) {
                  _vm.selectedDate = $$v
                },
                expression: "selectedDate",
              },
            }),
            _vm._v(" "),
            _vm.selectedDate
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
                    staticClass: "list-icon-btn",
                    attrs: { title: _vm.__("clear") },
                    on: { click: _vm.clearDate },
                  },
                  [
                    _c("i", {
                      staticClass: "fa fa-times",
                      attrs: { "aria-hidden": "true" },
                    }),
                  ]
                )
              : _vm._e(),
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
                    return _vm.fetchLogs(_vm.currentPage)
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
                items: _vm.logs,
                fields: _vm.fields,
                busy: _vm.isLoading,
                bordered: true,
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
                  key: "cell(date)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                    " +
                          _vm._s(row.item.date) +
                          "\n                "
                      ),
                    ]
                  },
                },
                {
                  key: "cell(event)",
                  fn: function (row) {
                    return [
                      _c(
                        "span",
                        {
                          staticClass: "badge",
                          class: _vm.eventBadgeClass(row.item.event),
                        },
                        [_vm._v(_vm._s(_vm.eventLabel(row.item.event)))]
                      ),
                    ]
                  },
                },
                {
                  key: "cell(module)",
                  fn: function (row) {
                    return [
                      _c("div", [
                        _c("strong", [
                          _vm._v(
                            _vm._s(row.item.module) +
                              " #" +
                              _vm._s(row.item.subject_id)
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      row.item.subject_label
                        ? _c("div", { staticClass: "text-muted small" }, [
                            _vm._v(_vm._s(row.item.subject_label)),
                          ])
                        : _vm._e(),
                    ]
                  },
                },
                {
                  key: "cell(description)",
                  fn: function (row) {
                    return [
                      _vm._v(
                        "\n                    " +
                          _vm._s(row.item.description) +
                          "\n                "
                      ),
                    ]
                  },
                },
                {
                  key: "cell(user)",
                  fn: function (row) {
                    return [
                      row.item.user
                        ? _c("div", [
                            _c("div", [_vm._v(_vm._s(row.item.user.name))]),
                            _vm._v(" "),
                            _c("div", { staticClass: "text-muted small" }, [
                              _vm._v(_vm._s(row.item.user.role)),
                            ]),
                          ])
                        : _c("span", [_vm._v("-")]),
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
                            attrs: { title: _vm.__("view") },
                            on: {
                              click: function ($event) {
                                return _vm.viewDetail(row.item)
                              },
                            },
                          },
                          [_c("i", { staticClass: "fa fa-eye" })]
                        ),
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
                      on: {
                        change: function ($event) {
                          return _vm.fetchLogs(1)
                        },
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
            _c("div", { staticClass: "text-muted small" }, [
              _vm._v(
                _vm._s(_vm.__("total_records")) + ": " + _vm._s(_vm.totalRows)
              ),
            ]),
            _vm._v(" "),
            _c("b-pagination", {
              staticClass: "list-pagination",
              attrs: {
                "total-rows": _vm.totalRows,
                "per-page": _vm.perPage,
                align: "fill",
                size: "sm",
              },
              on: { change: _vm.fetchLogs },
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
      _c(
        "b-modal",
        {
          attrs: {
            title: _vm.__("activity_log_details"),
            "hide-footer": "",
            size: "lg",
          },
          model: {
            value: _vm.showDetailModal,
            callback: function ($$v) {
              _vm.showDetailModal = $$v
            },
            expression: "showDetailModal",
          },
        },
        [
          _vm.detailRecord
            ? _c("div", [
                _c("p", [
                  _c("strong", [_vm._v(_vm._s(_vm.__("date")) + ":")]),
                  _vm._v(" " + _vm._s(_vm.detailRecord.date)),
                ]),
                _vm._v(" "),
                _c("p", [
                  _c("strong", [_vm._v(_vm._s(_vm.__("event")) + ":")]),
                  _vm._v(" " + _vm._s(_vm.eventLabel(_vm.detailRecord.event))),
                ]),
                _vm._v(" "),
                _c("p", [
                  _c("strong", [_vm._v(_vm._s(_vm.__("module")) + ":")]),
                  _vm._v(
                    " " +
                      _vm._s(_vm.detailRecord.module) +
                      " #" +
                      _vm._s(_vm.detailRecord.subject_id)
                  ),
                ]),
                _vm._v(" "),
                _c("p", [
                  _c("strong", [_vm._v(_vm._s(_vm.__("description")) + ":")]),
                  _vm._v(" " + _vm._s(_vm.detailRecord.description)),
                ]),
                _vm._v(" "),
                _vm.detailRecord.user
                  ? _c("p", [
                      _c("strong", [_vm._v(_vm._s(_vm.__("user")) + ":")]),
                      _vm._v(
                        " " +
                          _vm._s(_vm.detailRecord.user.name) +
                          " (" +
                          _vm._s(_vm.detailRecord.user.role) +
                          ")"
                      ),
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _vm.detailRecord.properties
                  ? _c("pre", [
                      _vm._v(
                        _vm._s(
                          JSON.stringify(_vm.detailRecord.properties, null, 2)
                        )
                      ),
                    ])
                  : _vm._e(),
              ])
            : _vm._e(),
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