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
      summary: {
        total: 0,
        active: 0,
        inactive: 0,
        on_route: 0,
        active_capacity: 0
      },
      page: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      filter: '',
      statusFilter: 'all',
      // 'all' | '1' | '0'
      searchTimer: null,
      modalShow: false,
      isEdit: false,
      loading: false,
      isLoading: false,
      firstLoad: true,
      togglingId: null,
      quickCapacities: [500, 1000, 2000, 5000],
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
    isSeller: function isSeller() {
      return this.$route.path.startsWith('/seller');
    },
    apiPath: function apiPath() {
      return this.isSeller ? '/seller/vehicles' : '/vehicles';
    },
    statusChips: function statusChips() {
      return [{
        value: 'all',
        label: __('All'),
        count: this.summary.total
      }, {
        value: '1',
        label: __('active'),
        count: this.summary.active
      }, {
        value: '0',
        label: __('inactive'),
        count: this.summary.inactive
      }];
    },
    hasActiveFilters: function hasActiveFilters() {
      return this.filter.trim() !== '' || this.statusFilter !== 'all';
    },
    rangeText: function rangeText() {
      if (!this.total) return '';
      var from = (this.page - 1) * this.perPage + 1;
      var to = Math.min(this.page * this.perPage, this.total);
      return from + '-' + to + ' / ' + this.total;
    }
  },
  watch: {
    page: function page() {
      this.getVehicles();
    },
    perPage: function perPage() {
      this.page = 1;
      this.getVehicles();
    },
    statusFilter: function statusFilter() {
      this.page = 1;
      this.getVehicles();
    },
    // debounce typing so each keystroke doesn't hit the API
    filter: function filter() {
      var _this = this;
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(function () {
        _this.page = 1;
        _this.getVehicles();
      }, 350);
    }
  },
  mounted: function mounted() {
    this.getVehicles();
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.searchTimer);
  },
  methods: {
    // `silent` refreshes the data without dimming the grid (used after a quick toggle)
    getVehicles: function getVehicles() {
      var _this2 = this;
      var silent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (!silent) this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + this.apiPath, {
        params: {
          page: this.page,
          per_page: this.perPage,
          filter: this.filter.trim(),
          status: this.statusFilter === 'all' ? undefined : this.statusFilter
        }
      }).then(function (res) {
        _this2.isLoading = false;
        _this2.firstLoad = false;
        if (res.data.status === 1) {
          _this2.vehicles = res.data.data.data || res.data.data || [];
          _this2.total = res.data.total != null ? res.data.total : _this2.vehicles.length;
          if (res.data.summary) _this2.summary = res.data.summary;
          // deleted / filtered the last item on a later page: step back instead of showing an empty page
          if (_this2.vehicles.length === 0 && _this2.page > 1) _this2.page = _this2.page - 1;
        }
      })["catch"](function (err) {
        _this2.isLoading = false;
        _this2.firstLoad = false;
        _this2.showError(__('could_not_load_vehicles_data'));
      });
    },
    clearFilters: function clearFilters() {
      this.filter = '';
      this.statusFilter = 'all';
    },
    // Pill for the card: inactive > on a dispatched trip > idle & ready
    vehicleStatus: function vehicleStatus(v) {
      if (v.status != 1) return {
        label: __('inactive'),
        tone: 'slate'
      };
      if ((v.active_trips_count || 0) > 0) return {
        label: __('On Route'),
        tone: 'blue'
      };
      return {
        label: __('active'),
        tone: 'green'
      };
    },
    formatNumber: function formatNumber(value) {
      var n = parseFloat(value);
      return isNaN(n) ? '0' : n.toLocaleString('en-IN', {
        maximumFractionDigits: 2
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
      var _this3 = this;
      this.loading = true;
      var endpoint = this.apiPath + (this.isEdit ? '/update' : '/save');
      var payload = Object.assign({}, this.form, {
        name: (this.form.name || '').trim(),
        vehicle_number: (this.form.vehicle_number || '').trim().toUpperCase()
      });
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + endpoint, payload).then(function (res) {
        _this3.loading = false;
        if (res.data.status === 1) {
          _this3.showMessage('success', res.data.message);
          _this3.modalShow = false;
          _this3.getVehicles();
        } else {
          _this3.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this3.loading = false;
        _this3.showError(__('an_error_occurred_while_saving_the_vehicle'));
      });
    },
    // Flip active / inactive straight from the card (the update endpoint needs the full record)
    toggleStatus: function toggleStatus(vehicle) {
      var _this4 = this;
      if (this.togglingId) return;
      var next = vehicle.status == 1 ? 0 : 1;
      this.togglingId = vehicle.id;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + this.apiPath + '/update', {
        id: vehicle.id,
        name: vehicle.name,
        vehicle_number: vehicle.vehicle_number,
        capacity: vehicle.capacity,
        status: next
      }).then(function (res) {
        if (res.data.status === 1) {
          vehicle.status = next;
          _this4.showMessage('success', res.data.message);
          _this4.getVehicles(true); // refresh the stat cards / filter counts
        } else {
          _this4.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this4.showError(__('an_error_occurred_while_saving_the_vehicle'));
      })["finally"](function () {
        _this4.togglingId = null;
      });
    },
    deleteVehicle: function deleteVehicle(vehicle) {
      var _this5 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_want_to_delete_this_vehicle_this_action_is_irreversible'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: __('yes_delete'),
        cancelButtonText: __('cancel'),
        confirmButtonColor: '#e74a3b',
        cancelButtonColor: '#858796'
      }).then(function (result) {
        if (result.isConfirmed) {
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this5.$apiUrl + _this5.apiPath + '/delete', {
            id: vehicle.id
          }).then(function (res) {
            if (res.data.status === 1) {
              _this5.showMessage('success', res.data.message);
              _this5.getVehicles();
            } else {
              _this5.showError(res.data.message);
            }
          })["catch"](function (err) {
            _this5.showError(__('an_error_occurred_while_deleting_the_vehicle'));
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
___CSS_LOADER_EXPORT___.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* ---------- tokens (also applied to the modal body, which renders outside the page root) ---------- */\n.vh-scope[data-v-6e7f3107] {\n    --vh-card: #ffffff;\n    --vh-border: #e5eaf2;\n    --vh-text: #0f172a;\n    --vh-muted: #64748b;\n    --vh-soft: #f4f7fb;\n    --vh-primary: #1e3a8a;\n    --vh-primary-hover: #172d6e;\n    --vh-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 20px rgba(15, 23, 42, 0.04);\n\n    --vh-green-bg: #e7f7ef;  --vh-green-fg: #047857;  --vh-green: #10b981;\n    --vh-amber-bg: #fff6e0;  --vh-amber-fg: #b45309;  --vh-amber: #f59e0b;\n    --vh-red-bg: #fdecec;    --vh-red-fg: #b91c1c;    --vh-red: #ef4444;\n    --vh-blue-bg: #e8f0fe;   --vh-blue-fg: #1d4ed8;   --vh-blue: #3b82f6;\n    --vh-purple-bg: #f1eafe; --vh-purple-fg: #6d28d9; --vh-purple: #8b5cf6;\n    --vh-slate-bg: #eef1f6;  --vh-slate-fg: #475569;  --vh-slate: #94a3b8;\n\n    color: var(--vh-text);\n    font-variant-numeric: tabular-nums;\n}\n.theme-dark .vh-scope[data-v-6e7f3107] {\n    --vh-card: #1e1e2d;\n    --vh-border: #2f2f45;\n    --vh-text: #eef2f7;\n    --vh-muted: #9aa5b8;\n    --vh-soft: #262639;\n    --vh-primary: #3d5fd6;\n    --vh-primary-hover: #5373e6;\n    --vh-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);\n\n    --vh-green-bg: rgba(16, 185, 129, 0.16);  --vh-green-fg: #4ade9f;\n    --vh-amber-bg: rgba(245, 158, 11, 0.16);  --vh-amber-fg: #fbbf4a;\n    --vh-red-bg: rgba(239, 68, 68, 0.16);     --vh-red-fg: #f87171;\n    --vh-blue-bg: rgba(59, 130, 246, 0.18);   --vh-blue-fg: #7fb0ff;\n    --vh-purple-bg: rgba(139, 92, 246, 0.18); --vh-purple-fg: #b69cff;\n    --vh-slate-bg: rgba(148, 163, 184, 0.14); --vh-slate-fg: #b6c0d1;\n}\n.vh[data-v-6e7f3107] { padding: 24px;\n}\n.vh-tone--green[data-v-6e7f3107]  { --tone-bg: var(--vh-green-bg);  --tone-fg: var(--vh-green-fg);\n}\n.vh-tone--amber[data-v-6e7f3107]  { --tone-bg: var(--vh-amber-bg);  --tone-fg: var(--vh-amber-fg);\n}\n.vh-tone--red[data-v-6e7f3107]    { --tone-bg: var(--vh-red-bg);    --tone-fg: var(--vh-red-fg);\n}\n.vh-tone--blue[data-v-6e7f3107]   { --tone-bg: var(--vh-blue-bg);   --tone-fg: var(--vh-blue-fg);\n}\n.vh-tone--purple[data-v-6e7f3107] { --tone-bg: var(--vh-purple-bg); --tone-fg: var(--vh-purple-fg);\n}\n.vh-tone--slate[data-v-6e7f3107]  { --tone-bg: var(--vh-slate-bg);  --tone-fg: var(--vh-slate-fg);\n}\n\n/* ---------- header + buttons ---------- */\n.vh-head[data-v-6e7f3107] { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 16px 24px; margin-bottom: 24px;\n}\n.vh-eyebrow[data-v-6e7f3107] { display: block; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--vh-muted); margin-bottom: 4px;\n}\n.vh-head h1[data-v-6e7f3107] { margin: 0; font-size: 34px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--vh-text);\n}\n.vh-head__sub[data-v-6e7f3107] { margin: 8px 0 0; font-size: 14px; color: var(--vh-muted);\n}\n.vh-btn[data-v-6e7f3107] {\n    display: inline-flex; align-items: center; justify-content: center; gap: 8px;\n    height: 44px; padding: 0 20px; border-radius: 12px; border: 1px solid transparent;\n    font-size: 14px; font-weight: 600; line-height: 1; white-space: nowrap; cursor: pointer;\n    text-decoration: none !important;\n    transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;\n}\n.vh-btn[data-v-6e7f3107]:active { transform: translateY(1px);\n}\n.vh-btn[data-v-6e7f3107]:disabled { opacity: 0.6; cursor: not-allowed;\n}\n.vh-btn--primary[data-v-6e7f3107] { background: var(--vh-primary); color: #fff; box-shadow: 0 4px 14px rgba(30, 58, 138, 0.28);\n}\n.vh-btn--primary[data-v-6e7f3107]:hover:not(:disabled) { background: var(--vh-primary-hover); color: #fff;\n}\n.vh-btn--ghost[data-v-6e7f3107] { background: var(--vh-card); color: var(--vh-text); border-color: var(--vh-border);\n}\n.vh-btn--ghost[data-v-6e7f3107]:hover { background: var(--vh-soft); color: var(--vh-text);\n}\n.vh-iconbtn[data-v-6e7f3107] {\n    width: 38px; height: 38px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;\n    border-radius: 10px; border: 1px solid var(--vh-border); background: var(--vh-card); color: var(--vh-muted);\n    font-size: 14px; cursor: pointer; transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;\n}\n.vh-iconbtn[data-v-6e7f3107]:hover:not(:disabled) { background: var(--vh-soft); color: var(--vh-primary);\n}\n.vh-iconbtn--danger[data-v-6e7f3107]:hover:not(:disabled) { background: var(--vh-red-bg); color: var(--vh-red-fg); border-color: var(--vh-red);\n}\n.vh-iconbtn[data-v-6e7f3107]:disabled { opacity: 0.4; cursor: not-allowed;\n}\n\n/* ---------- shared ---------- */\n.vh-card[data-v-6e7f3107] { background: var(--vh-card); border: 1px solid var(--vh-border); border-radius: 18px; box-shadow: var(--vh-shadow);\n}\n.vh-tile[data-v-6e7f3107] {\n    flex-shrink: 0; width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center;\n    font-size: 22px; background: var(--tone-bg); color: var(--tone-fg);\n}\n.vh-tile--sm[data-v-6e7f3107] { width: 44px; height: 44px; border-radius: 12px; font-size: 18px;\n}\n.vh-pill[data-v-6e7f3107] {\n    display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px;\n    font-size: 12px; font-weight: 600; line-height: 1.2; white-space: nowrap; background: var(--tone-bg); color: var(--tone-fg);\n}\n.vh-dot[data-v-6e7f3107] { width: 7px; height: 7px; border-radius: 50%; background: currentColor;\n}\n.vh-plate[data-v-6e7f3107] {\n    display: inline-block; padding: 3px 10px; border-radius: 8px;\n    font-family: SFMono-Regular, Menlo, Consolas, monospace; font-size: 12.5px; font-weight: 600; letter-spacing: 0.04em;\n    background: var(--vh-soft); color: var(--vh-text); border: 1px solid var(--vh-border);\n}\n\n/* ---------- stats ---------- */\n.vh-stats[data-v-6e7f3107] { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px;\n}\n.vh-stat[data-v-6e7f3107] { display: flex; align-items: center; gap: 16px; padding: 20px;\n}\n.vh-stat__body[data-v-6e7f3107] { min-width: 0; display: flex; flex-direction: column; gap: 2px;\n}\n.vh-stat__label[data-v-6e7f3107] { font-size: 13px; color: var(--vh-muted);\n}\n.vh-stat__value[data-v-6e7f3107] { font-size: 28px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--vh-text);\n}\n.vh-stat__value small[data-v-6e7f3107] { font-size: 15px; font-weight: 600; color: var(--vh-muted); letter-spacing: 0;\n}\n.vh-stat__hint[data-v-6e7f3107] { font-size: 12.5px; color: var(--vh-muted);\n}\n\n/* ---------- toolbar ---------- */\n.vh-toolbar[data-v-6e7f3107] { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 16px; padding: 14px 16px; margin-bottom: 20px;\n}\n.vh-search[data-v-6e7f3107] { position: relative; flex: 1; min-width: 220px;\n}\n.vh-search > .fa-search[data-v-6e7f3107] { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--vh-slate); font-size: 14px; pointer-events: none;\n}\n.vh-search input[data-v-6e7f3107] {\n    width: 100%; height: 42px; padding: 0 38px 0 40px; border-radius: 12px; border: 1px solid var(--vh-border);\n    background: var(--vh-soft); color: var(--vh-text); font-size: 14px; outline: none;\n    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;\n}\n.vh-search input[data-v-6e7f3107]::-moz-placeholder { color: var(--vh-muted);\n}\n.vh-search input[data-v-6e7f3107]::placeholder { color: var(--vh-muted);\n}\n.vh-search input[data-v-6e7f3107]:focus { background: var(--vh-card); border-color: var(--vh-blue); box-shadow: 0 0 0 3px var(--vh-blue-bg);\n}\n.vh-search__clear[data-v-6e7f3107] { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 26px; height: 26px; border: 0; border-radius: 50%; background: transparent; color: var(--vh-muted); cursor: pointer;\n}\n.vh-search__clear[data-v-6e7f3107]:hover { background: var(--vh-slate-bg);\n}\n.vh-chips[data-v-6e7f3107], .vh-quick[data-v-6e7f3107] { display: flex; flex-wrap: wrap; gap: 8px;\n}\n.vh-chip[data-v-6e7f3107] {\n    display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 999px;\n    border: 1px solid var(--vh-border); background: var(--vh-card); color: var(--vh-muted);\n    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;\n}\n.vh-chip span[data-v-6e7f3107] { padding: 1px 8px; border-radius: 999px; font-size: 12px; background: var(--vh-slate-bg); color: var(--vh-slate-fg);\n}\n.vh-chip[data-v-6e7f3107]:hover { border-color: var(--vh-blue); color: var(--vh-text);\n}\n.vh-chip--on[data-v-6e7f3107] { background: var(--vh-primary); border-color: var(--vh-primary); color: #fff;\n}\n.vh-chip--on span[data-v-6e7f3107] { background: rgba(255, 255, 255, 0.2); color: #fff;\n}\n\n/* ---------- vehicle cards ---------- */\n.vh-grid[data-v-6e7f3107] { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; transition: opacity 0.15s ease;\n}\n.vh-grid--busy[data-v-6e7f3107] { opacity: 0.55; pointer-events: none;\n}\n.vh-vehicle[data-v-6e7f3107] { display: flex; flex-direction: column; padding: 18px; transition: box-shadow 0.15s ease, transform 0.15s ease;\n}\n.vh-vehicle[data-v-6e7f3107]:hover { box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08); transform: translateY(-2px);\n}\n.vh-vehicle--off[data-v-6e7f3107] { background: var(--vh-soft);\n}\n.vh-vehicle--off .vh-vehicle__stats strong[data-v-6e7f3107] { color: var(--vh-muted);\n}\n.vh-vehicle__top[data-v-6e7f3107] { display: flex; align-items: center; gap: 12px;\n}\n.vh-vehicle__id[data-v-6e7f3107] { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px;\n}\n.vh-vehicle__id h3[data-v-6e7f3107] {\n    margin: 0; max-width: 100%; font-size: 16px; line-height: 1.3; font-weight: 700; color: var(--vh-text);\n    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word;\n}\n.vh-vehicle__stats[data-v-6e7f3107] { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 0; margin: 16px 0; padding: 14px 0; border-top: 1px solid var(--vh-border); border-bottom: 1px solid var(--vh-border);\n}\n.vh-vehicle__stats > div[data-v-6e7f3107] { display: flex; flex-direction: column; gap: 3px; min-width: 0;\n}\n.vh-vehicle__stats > div + div[data-v-6e7f3107] { padding-left: 16px; border-left: 1px solid var(--vh-border);\n}\n.vh-vehicle__stats span[data-v-6e7f3107] { font-size: 12.5px; color: var(--vh-muted);\n}\n.vh-vehicle__stats strong[data-v-6e7f3107] { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: var(--vh-text);\n}\n.vh-vehicle__stats small[data-v-6e7f3107] { font-size: 12px; font-weight: 600; color: var(--vh-muted);\n}\n.vh-vehicle__foot[data-v-6e7f3107] { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px;\n}\n.vh-vehicle__actions[data-v-6e7f3107] { display: flex; gap: 8px;\n}\n.vh-switchrow[data-v-6e7f3107] { display: inline-flex; align-items: center; gap: 10px; margin: 0; font-size: 13px; font-weight: 500; color: var(--vh-muted); cursor: pointer;\n}\n.vh-switch[data-v-6e7f3107] {\n    position: relative; flex-shrink: 0; width: 42px; height: 24px; padding: 0; border: 0; border-radius: 999px;\n    background: var(--vh-slate); cursor: pointer; transition: background-color 0.2s ease;\n}\n.vh-switch span[data-v-6e7f3107] { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25); transition: transform 0.2s ease;\n}\n.vh-switch--on[data-v-6e7f3107] { background: var(--vh-green);\n}\n.vh-switch--on span[data-v-6e7f3107] { transform: translateX(18px);\n}\n.vh-switch[data-v-6e7f3107]:disabled { opacity: 0.6; cursor: wait;\n}\n\n/* ---------- empty / skeleton ---------- */\n.vh-empty[data-v-6e7f3107] { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 56px 24px;\n}\n.vh-empty__icon[data-v-6e7f3107] { width: 72px; height: 72px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 30px; margin-bottom: 8px; background: var(--vh-blue-bg); color: var(--vh-blue-fg);\n}\n.vh-empty h3[data-v-6e7f3107] { margin: 0; font-size: 18px; font-weight: 700; color: var(--vh-text);\n}\n.vh-empty p[data-v-6e7f3107] { margin: 0 0 12px; max-width: 360px; font-size: 14px; color: var(--vh-muted);\n}\n.vh-skeleton[data-v-6e7f3107] { gap: 16px; pointer-events: none;\n}\n.vh-skeleton__row[data-v-6e7f3107] { display: flex; align-items: center; gap: 12px;\n}\n.vh-skeleton__box[data-v-6e7f3107], .vh-skeleton__lines i[data-v-6e7f3107], .vh-skeleton__bar[data-v-6e7f3107] {\n    display: block; border-radius: 10px;\n    background: linear-gradient(90deg, var(--vh-slate-bg) 25%, var(--vh-soft) 50%, var(--vh-slate-bg) 75%);\n    background-size: 200% 100%; animation: vh-shimmer-data-v-6e7f3107 1.3s infinite linear;\n}\n.vh-skeleton__box[data-v-6e7f3107] { width: 44px; height: 44px; border-radius: 12px;\n}\n.vh-skeleton__lines[data-v-6e7f3107] { flex: 1; display: flex; flex-direction: column; gap: 8px;\n}\n.vh-skeleton__lines i[data-v-6e7f3107] { height: 12px; width: 70%;\n}\n.vh-skeleton__lines i + i[data-v-6e7f3107] { width: 40%;\n}\n.vh-skeleton__bar[data-v-6e7f3107] { height: 56px;\n}\n@keyframes vh-shimmer-data-v-6e7f3107 {\nto { background-position: -200% 0;\n}\n}\n\n/* ---------- pagination ---------- */\n.vh-pager[data-v-6e7f3107] { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 20px; margin-top: 20px;\n}\n.vh-pager__size[data-v-6e7f3107] { display: flex; align-items: center; gap: 10px; font-size: 13px; color: var(--vh-muted);\n}\n.vh-pager__size label[data-v-6e7f3107] { margin: 0;\n}\n.vh-pager__size .form-select[data-v-6e7f3107] { width: auto; min-width: 72px;\n}\n.vh-pager__count[data-v-6e7f3107] { flex: 1; font-size: 13px; color: var(--vh-muted); white-space: nowrap;\n}\n\n/* ---------- modal ---------- */\n.vh-form[data-v-6e7f3107] { background: var(--vh-card); border-radius: 16px; overflow: hidden;\n}\n.vh-form__head[data-v-6e7f3107] { display: flex; align-items: center; gap: 14px; padding: 22px 24px 18px; border-bottom: 1px solid var(--vh-border);\n}\n.vh-form__head h2[data-v-6e7f3107] { margin: 0; font-size: 18px; font-weight: 700; color: var(--vh-text);\n}\n.vh-form__head p[data-v-6e7f3107] { margin: 2px 0 0; font-size: 13px; color: var(--vh-muted);\n}\n.vh-form__head > div[data-v-6e7f3107]:nth-child(2) { flex: 1; min-width: 0;\n}\n.vh-form__body[data-v-6e7f3107] { padding: 20px 24px 24px;\n}\n.vh-field[data-v-6e7f3107] { margin-bottom: 18px;\n}\n.vh-field label[data-v-6e7f3107] { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--vh-text);\n}\n.vh-field label em[data-v-6e7f3107] { font-style: normal; color: var(--vh-red);\n}\n.vh-field__hint[data-v-6e7f3107] { margin: 2px 0 0; font-size: 13px; color: var(--vh-muted);\n}\n.vh-field--row[data-v-6e7f3107] { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px; border-radius: 12px; background: var(--vh-soft); border: 1px solid var(--vh-border);\n}\n.vh-field--row label[data-v-6e7f3107] { margin: 0;\n}\n.vh-input[data-v-6e7f3107] {\n    width: 100%; height: 46px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--vh-border);\n    background: var(--vh-card); color: var(--vh-text); font-size: 15px; outline: none;\n    transition: border-color 0.15s ease, box-shadow 0.15s ease;\n}\n.vh-input[data-v-6e7f3107]::-moz-placeholder { color: var(--vh-slate);\n}\n.vh-input[data-v-6e7f3107]::placeholder { color: var(--vh-slate);\n}\n.vh-input[data-v-6e7f3107]:focus { border-color: var(--vh-blue); box-shadow: 0 0 0 3px var(--vh-blue-bg);\n}\n.vh-input--plate[data-v-6e7f3107] { text-transform: uppercase; font-family: SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 0.04em;\n}\n.vh-input-group[data-v-6e7f3107] { display: flex; align-items: stretch;\n}\n.vh-input-group .vh-input[data-v-6e7f3107] { border-top-right-radius: 0; border-bottom-right-radius: 0;\n}\n.vh-input-group > span[data-v-6e7f3107] {\n    display: flex; align-items: center; padding: 0 16px; border: 1px solid var(--vh-border); border-left: 0;\n    border-radius: 0 12px 12px 0; background: var(--vh-soft); color: var(--vh-muted); font-size: 14px; font-weight: 600;\n}\n.vh-quick[data-v-6e7f3107] { margin-top: 10px;\n}\n.vh-quick .vh-chip[data-v-6e7f3107] { height: 32px; padding: 0 12px; font-size: 12.5px;\n}\n.vh-form__foot[data-v-6e7f3107] { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--vh-border);\n}\n\n/* ---------- responsive ---------- */\n@media (max-width: 1399px) {\n.vh-stats[data-v-6e7f3107] { grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n}\n@media (max-width: 767px) {\n.vh[data-v-6e7f3107] { padding: 16px;\n}\n.vh-head h1[data-v-6e7f3107] { font-size: 28px;\n}\n.vh-head > .vh-btn[data-v-6e7f3107] { width: 100%;\n}\n.vh-stats[data-v-6e7f3107] { grid-template-columns: 1fr;\n}\n.vh-grid[data-v-6e7f3107] { grid-template-columns: 1fr;\n}\n.vh-search[data-v-6e7f3107] { flex-basis: 100%;\n}\n.vh-chips[data-v-6e7f3107] { flex: 1; gap: 4px;\n}\n.vh-chip[data-v-6e7f3107] { padding: 0 9px; gap: 6px; font-size: 12.5px;\n}\n.vh-pager__count[data-v-6e7f3107] { flex: none; margin-left: auto; white-space: nowrap;\n}\n.vh-pager .pagination[data-v-6e7f3107] { width: 100%; justify-content: center;\n}\n}\n", ""]);
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
    { staticClass: "vh vh-scope" },
    [
      _c("header", { staticClass: "vh-head" }, [
        _c("div", [
          _c("span", { staticClass: "vh-eyebrow" }, [
            _vm._v(_vm._s(_vm.__("Fleet"))),
          ]),
          _vm._v(" "),
          _c("h1", [_vm._v(_vm._s(_vm.__("manage_vehicles")))]),
          _vm._v(" "),
          _c("p", { staticClass: "vh-head__sub" }, [
            _vm._v(
              _vm._s(
                _vm.__(
                  "add_edit_and_manage_your_distribution_fleet_and_load_capacities"
                )
              )
            ),
          ]),
        ]),
        _vm._v(" "),
        _vm.isSeller
          ? _c(
              "button",
              {
                staticClass: "vh-btn vh-btn--primary",
                on: { click: _vm.openCreateModal },
              },
              [
                _c("i", { staticClass: "fa fa-plus" }),
                _vm._v(" " + _vm._s(_vm.__("add_new_vehicle")) + "\n        "),
              ]
            )
          : _vm._e(),
      ]),
      _vm._v(" "),
      _c("section", { staticClass: "vh-stats" }, [
        _c("div", { staticClass: "vh-card vh-stat" }, [
          _vm._m(0),
          _vm._v(" "),
          _c("div", { staticClass: "vh-stat__body" }, [
            _c("span", { staticClass: "vh-stat__label" }, [
              _vm._v(_vm._s(_vm.__("total_vehicles"))),
            ]),
            _vm._v(" "),
            _c("strong", { staticClass: "vh-stat__value" }, [
              _vm._v(_vm._s(_vm.summary.total)),
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "vh-stat__hint" }, [
              _vm._v(_vm._s(_vm.__("Registered in your fleet"))),
            ]),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "vh-card vh-stat" }, [
          _vm._m(1),
          _vm._v(" "),
          _c("div", { staticClass: "vh-stat__body" }, [
            _c("span", { staticClass: "vh-stat__label" }, [
              _vm._v(_vm._s(_vm.__("active_fleet"))),
            ]),
            _vm._v(" "),
            _c("strong", { staticClass: "vh-stat__value" }, [
              _vm._v(_vm._s(_vm.summary.active)),
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "vh-stat__hint" }, [
              _vm._v(
                _vm._s(_vm.summary.inactive) + " " + _vm._s(_vm.__("inactive"))
              ),
            ]),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "vh-card vh-stat" }, [
          _vm._m(2),
          _vm._v(" "),
          _c("div", { staticClass: "vh-stat__body" }, [
            _c("span", { staticClass: "vh-stat__label" }, [
              _vm._v(_vm._s(_vm.__("On Route"))),
            ]),
            _vm._v(" "),
            _c("strong", { staticClass: "vh-stat__value" }, [
              _vm._v(_vm._s(_vm.summary.on_route)),
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "vh-stat__hint" }, [
              _vm._v(_vm._s(_vm.__("Out on a trip right now"))),
            ]),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "vh-card vh-stat" }, [
          _vm._m(3),
          _vm._v(" "),
          _c("div", { staticClass: "vh-stat__body" }, [
            _c("span", { staticClass: "vh-stat__label" }, [
              _vm._v(_vm._s(_vm.__("total_capacity"))),
            ]),
            _vm._v(" "),
            _c("strong", { staticClass: "vh-stat__value" }, [
              _vm._v(
                _vm._s(_vm.formatNumber(_vm.summary.active_capacity)) + " "
              ),
              _c("small", [_vm._v(_vm._s(_vm.__("kg")))]),
            ]),
            _vm._v(" "),
            _c("span", { staticClass: "vh-stat__hint" }, [
              _vm._v(_vm._s(_vm.__("Across active vehicles"))),
            ]),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "vh-card vh-toolbar" }, [
        _c("div", { staticClass: "vh-search" }, [
          _c("i", { staticClass: "fa fa-search" }),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.filter,
                expression: "filter",
              },
            ],
            attrs: {
              type: "text",
              placeholder: _vm.__("Search by name, number or ID"),
              "aria-label": _vm.__("search"),
            },
            domProps: { value: _vm.filter },
            on: {
              input: function ($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.filter = $event.target.value
              },
            },
          }),
          _vm._v(" "),
          _vm.filter
            ? _c(
                "button",
                {
                  staticClass: "vh-search__clear",
                  attrs: { type: "button", title: _vm.__("Clear") },
                  on: {
                    click: function ($event) {
                      _vm.filter = ""
                    },
                  },
                },
                [_c("i", { staticClass: "fa fa-times" })]
              )
            : _vm._e(),
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "vh-chips", attrs: { role: "tablist" } },
          _vm._l(_vm.statusChips, function (chip) {
            return _c(
              "button",
              {
                key: chip.value,
                staticClass: "vh-chip",
                class: { "vh-chip--on": _vm.statusFilter === chip.value },
                attrs: { type: "button" },
                on: {
                  click: function ($event) {
                    _vm.statusFilter = chip.value
                  },
                },
              },
              [
                _vm._v("\n                " + _vm._s(chip.label) + " "),
                _c("span", [_vm._v(_vm._s(chip.count))]),
              ]
            )
          }),
          0
        ),
        _vm._v(" "),
        _c(
          "button",
          {
            staticClass: "vh-iconbtn",
            attrs: { type: "button", title: _vm.__("refresh") },
            on: {
              click: function ($event) {
                return _vm.getVehicles()
              },
            },
          },
          [
            _c("i", {
              staticClass: "fa fa-sync-alt",
              class: { "fa-spin": _vm.isLoading },
            }),
          ]
        ),
      ]),
      _vm._v(" "),
      _vm.firstLoad
        ? _c(
            "div",
            { staticClass: "vh-grid" },
            _vm._l(6, function (n) {
              return _c(
                "div",
                { key: n, staticClass: "vh-card vh-vehicle vh-skeleton" },
                [
                  _vm._m(4, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "vh-skeleton__bar" }),
                ]
              )
            }),
            0
          )
        : _vm.vehicles.length === 0
        ? _c(
            "div",
            { staticClass: "vh-card vh-empty" },
            [
              _vm._m(5),
              _vm._v(" "),
              _vm.hasActiveFilters
                ? [
                    _c("h3", [
                      _vm._v(_vm._s(_vm.__("No vehicles match your search"))),
                    ]),
                    _vm._v(" "),
                    _c("p", [
                      _vm._v(
                        _vm._s(
                          _vm.__(
                            "Try a different name or number, or clear the filters."
                          )
                        )
                      ),
                    ]),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "vh-btn vh-btn--ghost",
                        attrs: { type: "button" },
                        on: { click: _vm.clearFilters },
                      },
                      [
                        _c("i", { staticClass: "fa fa-times" }),
                        _vm._v(
                          " " +
                            _vm._s(_vm.__("Clear filters")) +
                            "\n            "
                        ),
                      ]
                    ),
                  ]
                : [
                    _c("h3", [_vm._v(_vm._s(_vm.__("No vehicles yet")))]),
                    _vm._v(" "),
                    _c("p", [
                      _vm._v(
                        _vm._s(
                          _vm.isSeller
                            ? _vm.__(
                                "Add your first vehicle to start creating loading slips."
                              )
                            : _vm.__("no_records_to_show")
                        )
                      ),
                    ]),
                    _vm._v(" "),
                    _vm.isSeller
                      ? _c(
                          "button",
                          {
                            staticClass: "vh-btn vh-btn--primary",
                            attrs: { type: "button" },
                            on: { click: _vm.openCreateModal },
                          },
                          [
                            _c("i", { staticClass: "fa fa-plus" }),
                            _vm._v(
                              " " +
                                _vm._s(_vm.__("add_new_vehicle")) +
                                "\n            "
                            ),
                          ]
                        )
                      : _vm._e(),
                  ],
            ],
            2
          )
        : _c(
            "div",
            {
              staticClass: "vh-grid",
              class: { "vh-grid--busy": _vm.isLoading },
            },
            _vm._l(_vm.vehicles, function (v) {
              return _c(
                "article",
                {
                  key: v.id,
                  staticClass: "vh-card vh-vehicle",
                  class: { "vh-vehicle--off": v.status != 1 },
                },
                [
                  _c("div", { staticClass: "vh-vehicle__top" }, [
                    _c(
                      "div",
                      {
                        staticClass: "vh-tile vh-tile--sm",
                        class: "vh-tone--" + _vm.vehicleStatus(v).tone,
                      },
                      [_c("i", { staticClass: "fa fa-truck" })]
                    ),
                    _vm._v(" "),
                    _c("div", { staticClass: "vh-vehicle__id" }, [
                      _c("h3", { attrs: { title: v.name } }, [
                        _vm._v(_vm._s(v.name)),
                      ]),
                      _vm._v(" "),
                      _c("span", { staticClass: "vh-plate" }, [
                        _vm._v(_vm._s(v.vehicle_number)),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c(
                      "span",
                      {
                        staticClass: "vh-pill vh-pill--dot",
                        class: "vh-tone--" + _vm.vehicleStatus(v).tone,
                      },
                      [
                        _c("span", { staticClass: "vh-dot" }),
                        _vm._v(
                          _vm._s(_vm.vehicleStatus(v).label) +
                            "\n                "
                        ),
                      ]
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "vh-vehicle__stats" }, [
                    _c("div", [
                      _c("span", [_vm._v(_vm._s(_vm.__("Load Capacity")))]),
                      _vm._v(" "),
                      _c("strong", [
                        _vm._v(_vm._s(_vm.formatNumber(v.capacity)) + " "),
                        _c("small", [_vm._v(_vm._s(_vm.__("kg")))]),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", [
                      _c("span", [_vm._v(_vm._s(_vm.__("Trips")))]),
                      _vm._v(" "),
                      _c("strong", [
                        _vm._v(_vm._s(v.loading_slips_count || 0)),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", [
                      _c("span", [_vm._v("ID")]),
                      _vm._v(" "),
                      _c("strong", [_vm._v("#" + _vm._s(v.id))]),
                    ]),
                  ]),
                  _vm._v(" "),
                  _vm.isSeller
                    ? _c("div", { staticClass: "vh-vehicle__foot" }, [
                        _c(
                          "label",
                          {
                            staticClass: "vh-switchrow",
                            attrs: {
                              title:
                                v.status == 1
                                  ? _vm.__("Click to mark inactive")
                                  : _vm.__("Click to mark active"),
                            },
                          },
                          [
                            _c(
                              "button",
                              {
                                staticClass: "vh-switch",
                                class: { "vh-switch--on": v.status == 1 },
                                attrs: {
                                  type: "button",
                                  role: "switch",
                                  "aria-checked":
                                    v.status == 1 ? "true" : "false",
                                  disabled: _vm.togglingId === v.id,
                                },
                                on: {
                                  click: function ($event) {
                                    return _vm.toggleStatus(v)
                                  },
                                },
                              },
                              [_c("span")]
                            ),
                            _vm._v(" "),
                            _c("span", [
                              _vm._v(_vm._s(_vm.__("Available for dispatch"))),
                            ]),
                          ]
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "vh-vehicle__actions" }, [
                          _c(
                            "button",
                            {
                              staticClass: "vh-iconbtn",
                              attrs: { type: "button", title: _vm.__("edit") },
                              on: {
                                click: function ($event) {
                                  return _vm.openEditModal(v)
                                },
                              },
                            },
                            [_c("i", { staticClass: "fa fa-pencil-alt" })]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "vh-iconbtn vh-iconbtn--danger",
                              attrs: {
                                type: "button",
                                disabled: (v.loading_slips_count || 0) > 0,
                                title:
                                  (v.loading_slips_count || 0) > 0
                                    ? _vm.__(
                                        "Used in loading slips, mark it inactive instead"
                                      )
                                    : _vm.__("delete"),
                              },
                              on: {
                                click: function ($event) {
                                  return _vm.deleteVehicle(v)
                                },
                              },
                            },
                            [_c("i", { staticClass: "fa fa-trash" })]
                          ),
                        ]),
                      ])
                    : _vm._e(),
                ]
              )
            }),
            0
          ),
      _vm._v(" "),
      !_vm.firstLoad && _vm.total > 0
        ? _c(
            "div",
            { staticClass: "vh-pager" },
            [
              _c(
                "div",
                { staticClass: "vh-pager__size" },
                [
                  _c("label", { attrs: { for: "vh-per-page" } }, [
                    _vm._v(_vm._s(_vm.__("per_page"))),
                  ]),
                  _vm._v(" "),
                  _c("b-form-select", {
                    staticClass: "form-control form-select",
                    attrs: {
                      id: "vh-per-page",
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
              _vm._v(" "),
              _c("span", { staticClass: "vh-pager__count" }, [
                _vm._v(_vm._s(_vm.rangeText)),
              ]),
              _vm._v(" "),
              _vm.total > _vm.perPage
                ? _c("b-pagination", {
                    staticClass: "my-0",
                    attrs: {
                      "total-rows": _vm.total,
                      "per-page": _vm.perPage,
                      size: "sm",
                    },
                    model: {
                      value: _vm.page,
                      callback: function ($$v) {
                        _vm.page = $$v
                      },
                      expression: "page",
                    },
                  })
                : _vm._e(),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          attrs: {
            id: "vehicle-modal",
            "hide-footer": "",
            "hide-header": "",
            centered: "",
            "body-class": "p-0",
            "modal-class": "vh-modal",
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
          _c("div", { staticClass: "vh-scope vh-form" }, [
            _c("div", { staticClass: "vh-form__head" }, [
              _c("div", { staticClass: "vh-tile vh-tile--sm vh-tone--blue" }, [
                _c("i", { staticClass: "fa fa-truck" }),
              ]),
              _vm._v(" "),
              _c("div", [
                _c("h2", [
                  _vm._v(
                    _vm._s(
                      _vm.isEdit
                        ? _vm.__("edit_vehicle_details")
                        : _vm.__("register_new_vehicle")
                    )
                  ),
                ]),
                _vm._v(" "),
                _c("p", [
                  _vm._v(
                    _vm._s(
                      _vm.isEdit
                        ? _vm.__(
                            "Update this vehicle's details or availability."
                          )
                        : _vm.__(
                            "Add a vehicle you can assign to loading slips."
                          )
                    )
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c(
                "button",
                {
                  staticClass: "vh-iconbtn vh-form__close",
                  attrs: { type: "button", title: _vm.__("cancel") },
                  on: {
                    click: function ($event) {
                      _vm.modalShow = false
                    },
                  },
                },
                [_c("i", { staticClass: "fa fa-times" })]
              ),
            ]),
            _vm._v(" "),
            _c(
              "form",
              {
                staticClass: "vh-form__body",
                on: {
                  submit: function ($event) {
                    $event.preventDefault()
                    return _vm.saveVehicle.apply(null, arguments)
                  },
                },
              },
              [
                _c("div", { staticClass: "vh-field" }, [
                  _c("label", [
                    _vm._v(_vm._s(_vm.__("vehicle_model_name")) + " "),
                    _c("em", [_vm._v("*")]),
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
                    staticClass: "vh-input",
                    attrs: {
                      type: "text",
                      placeholder: "e.g. Tata Ace, Mahindra Bolero",
                      required: "",
                      maxlength: "255",
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
                _c("div", { staticClass: "vh-field" }, [
                  _c("label", [
                    _vm._v(_vm._s(_vm.__("vehicle_registration_number")) + " "),
                    _c("em", [_vm._v("*")]),
                  ]),
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
                    staticClass: "vh-input vh-input--plate",
                    attrs: {
                      type: "text",
                      placeholder: "e.g. MH-12-AB-1234",
                      required: "",
                      maxlength: "255",
                    },
                    domProps: { value: _vm.form.vehicle_number },
                    on: {
                      input: function ($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.$set(
                          _vm.form,
                          "vehicle_number",
                          $event.target.value
                        )
                      },
                    },
                  }),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "vh-field" }, [
                  _c("label", [
                    _vm._v(
                      _vm._s(_vm.__("load_weight_capacity_in_kilograms")) + " "
                    ),
                    _c("em", [_vm._v("*")]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "vh-input-group" }, [
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
                      staticClass: "vh-input",
                      attrs: {
                        type: "number",
                        step: "0.01",
                        min: "0.1",
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
                    _c("span", [_vm._v(_vm._s(_vm.__("kg")))]),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "vh-quick" },
                    _vm._l(_vm.quickCapacities, function (q) {
                      return _c(
                        "button",
                        {
                          key: q,
                          staticClass: "vh-chip",
                          class: {
                            "vh-chip--on": Number(_vm.form.capacity) === q,
                          },
                          attrs: { type: "button" },
                          on: {
                            click: function ($event) {
                              _vm.form.capacity = q
                            },
                          },
                        },
                        [
                          _vm._v(
                            "\n                            " +
                              _vm._s(_vm.formatNumber(q)) +
                              " " +
                              _vm._s(_vm.__("kg")) +
                              "\n                        "
                          ),
                        ]
                      )
                    }),
                    0
                  ),
                ]),
                _vm._v(" "),
                _vm.isEdit
                  ? _c("div", { staticClass: "vh-field vh-field--row" }, [
                      _c("div", [
                        _c("label", [
                          _vm._v(_vm._s(_vm.__("vehicle_fleet_status"))),
                        ]),
                        _vm._v(" "),
                        _c("p", { staticClass: "vh-field__hint" }, [
                          _vm._v(
                            _vm._s(
                              _vm.form.status == 1
                                ? _vm.__("active_ready_for_dispatch")
                                : _vm.__("inactive_maintenance")
                            )
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "button",
                        {
                          staticClass: "vh-switch",
                          class: { "vh-switch--on": _vm.form.status == 1 },
                          attrs: {
                            type: "button",
                            role: "switch",
                            "aria-checked":
                              _vm.form.status == 1 ? "true" : "false",
                          },
                          on: {
                            click: function ($event) {
                              _vm.form.status = _vm.form.status == 1 ? 0 : 1
                            },
                          },
                        },
                        [_c("span")]
                      ),
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c("div", { staticClass: "vh-form__foot" }, [
                  _c(
                    "button",
                    {
                      staticClass: "vh-btn vh-btn--ghost",
                      attrs: { type: "button" },
                      on: {
                        click: function ($event) {
                          _vm.modalShow = false
                        },
                      },
                    },
                    [_vm._v(_vm._s(_vm.__("cancel")))]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "vh-btn vh-btn--primary",
                      attrs: { type: "submit", disabled: _vm.loading },
                    },
                    [
                      _vm.loading
                        ? _c("i", { staticClass: "fa fa-spinner fa-spin" })
                        : _vm._e(),
                      _vm._v(
                        "\n                        " +
                          _vm._s(
                            _vm.isEdit
                              ? _vm.__("save_changes")
                              : _vm.__("register_vehicle")
                          ) +
                          "\n                    "
                      ),
                    ]
                  ),
                ]),
              ]
            ),
          ]),
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
    return _c("div", { staticClass: "vh-tile vh-tone--blue" }, [
      _c("i", { staticClass: "fa fa-truck" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "vh-tile vh-tone--green" }, [
      _c("i", { staticClass: "fa fa-check-circle" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "vh-tile vh-tone--purple" }, [
      _c("i", { staticClass: "fa fa-road" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "vh-tile vh-tone--amber" }, [
      _c("i", { staticClass: "fa fa-balance-scale" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "vh-skeleton__row" }, [
      _c("span", { staticClass: "vh-skeleton__box" }),
      _c("span", { staticClass: "vh-skeleton__lines" }, [_c("i"), _c("i")]),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "vh-empty__icon" }, [
      _c("i", { staticClass: "fa fa-truck" }),
    ])
  },
]
render._withStripped = true



/***/ })

}]);