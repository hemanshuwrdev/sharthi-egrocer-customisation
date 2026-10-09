"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Logistics_ViewLoadingSlip_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js ***!
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



// Order status ids (see App\Models\OrderStatusList).
var ORDER_STATUS = {
  outForDelivery: 5,
  delivered: 6,
  cancelled: 7,
  returned: 8,
  rescheduled: 12,
  partialDelivery: 13,
  notDelivered: 14
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'ViewLoadingSlip',
  data: function data() {
    return {
      slip: null,
      orders: [],
      // order id -> bool; only holds the stops the user toggled by hand
      itemsToggled: {}
    };
  },
  computed: {
    hasCapacity: function hasCapacity() {
      return !!(this.slip && this.slip.vehicle && parseFloat(this.slip.vehicle.capacity) > 0);
    },
    loadRatioPercent: function loadRatioPercent() {
      if (!this.hasCapacity) return 0;
      return parseFloat(this.slip.total_weight) / parseFloat(this.slip.vehicle.capacity) * 100;
    },
    loadBarWidth: function loadBarWidth() {
      var pct = Math.min(this.loadRatioPercent, 100);
      // keep a sliver visible so a tiny but non-zero load doesn't look empty
      return pct > 0 ? Math.max(pct, 2) : 0;
    },
    loadTone: function loadTone() {
      if (this.loadRatioPercent > 99) return 'red';
      if (this.loadRatioPercent > 80) return 'amber';
      return 'green';
    },
    urlPrefix: function urlPrefix() {
      return this.$route.path.startsWith('/seller') ? '/seller' : '';
    },
    isSeller: function isSeller() {
      return this.$route.path.startsWith('/seller');
    },
    apiBase: function apiBase() {
      return this.isSeller ? this.$sellerApiUrl : this.$apiUrl;
    },
    // slip.status: 0 planned, 1 dispatched, 2 completed, 3 cancelled
    slipStatus: function slipStatus() {
      switch (Number(this.slip.status)) {
        case 0:
          return {
            label: __('planned'),
            tone: 'amber',
            icon: 'fa-clock'
          };
        case 2:
          return {
            label: __('completed'),
            tone: 'blue',
            icon: 'fa-check-circle'
          };
        case 3:
          return {
            label: __('cancelled'),
            tone: 'red',
            icon: 'fa-ban'
          };
        default:
          return {
            label: __('dispatched'),
            tone: 'green',
            icon: 'fa-truck'
          };
      }
    },
    vehicleStatus: function vehicleStatus() {
      switch (Number(this.slip.status)) {
        case 0:
          return {
            label: __('Assigned'),
            tone: 'amber'
          };
        case 2:
          return {
            label: __('completed'),
            tone: 'blue'
          };
        case 3:
          return {
            label: __('Released'),
            tone: 'slate'
          };
        default:
          return {
            label: __('On Route'),
            tone: 'green'
          };
      }
    },
    driverInitials: function driverInitials() {
      var name = (this.slip && this.slip.driver && this.slip.driver.name || '').trim();
      if (!name) return '?';
      var parts = name.split(/\s+/);
      return ((parts[0][0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
    },
    // Stops that still count towards the run (a cancelled / returned order won't be delivered)
    activeStops: function activeStops() {
      return this.orders.filter(function (o) {
        return ![ORDER_STATUS.cancelled, ORDER_STATUS.returned].includes(Number(o.active_status));
      });
    },
    activeStopCount: function activeStopCount() {
      return this.activeStops.length;
    },
    routeValue: function routeValue() {
      return this.activeStops.reduce(function (sum, o) {
        return sum + (parseFloat(o.final_total) || 0);
      }, 0);
    },
    completedStops: function completedStops() {
      return this.orders.filter(function (o) {
        return [ORDER_STATUS.delivered, ORDER_STATUS.partialDelivery].includes(Number(o.active_status));
      }).length;
    },
    progressStops: function progressStops() {
      return this.activeStopCount;
    },
    // Run lifecycle: Created -> Dispatched -> Completed (or a cancelled end state)
    lifecycle: function lifecycle() {
      var status = Number(this.slip.status);
      var created = {
        key: 'created',
        label: __('Created'),
        icon: 'fa-file-alt',
        state: 'done',
        time: this.formatDate(this.slip.created_at)
      };
      if (status === 3) {
        return [created, {
          key: 'cancelled',
          label: __('cancelled'),
          icon: 'fa-ban',
          state: 'cancelled'
        }];
      }
      return [created, {
        key: 'dispatched',
        label: __('dispatched'),
        icon: 'fa-truck',
        state: status === 1 ? 'current' : status >= 2 ? 'done' : 'pending'
      }, {
        key: 'completed',
        label: __('completed'),
        icon: 'fa-flag-checkered',
        state: status === 2 ? 'done' : 'pending'
      }];
    },
    // Per-status stop counts for the segmented bar (zero-count statuses are dropped)
    stopSummary: function stopSummary() {
      var _this = this;
      var counts = {};
      var meta = {};
      this.orders.forEach(function (o) {
        var s = _this.stopStatus(o);
        counts[s.key] = (counts[s.key] || 0) + 1;
        meta[s.key] = s;
      });
      var order = ['delivered', 'partial', 'out', 'pending', 'rescheduled', 'notDelivered', 'returned', 'cancelled'];
      return order.filter(function (k) {
        return counts[k];
      }).map(function (k) {
        return {
          key: k,
          label: meta[k].label,
          tone: meta[k].tone,
          count: counts[k]
        };
      });
    }
  },
  mounted: function mounted() {
    this.getSlipDetails();
  },
  methods: {
    getSlipDetails: function getSlipDetails() {
      var _this2 = this;
      var id = this.$route.params.id;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/view/' + id).then(function (res) {
        if (res.data.status === 1) {
          _this2.slip = res.data.data.slip;
          _this2.orders = res.data.data.orders;
        } else {
          _this2.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this2.showError(__('could_not_load_slip_details'));
      });
    },
    dispatchSlip: function dispatchSlip() {
      var _this3 = this;
      this.$swal.fire({
        title: __('confirm_dispatch'),
        text: __('this_will_change_status_to_dispatched_and_update_all_assigned_orders_to_out_for_delivery'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: __('yes_dispatch_now'),
        cancelButtonText: __('cancel'),
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#858796'
      }).then(function (result) {
        if (result.isConfirmed) {
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this3.apiBase + '/loading_slips/dispatch', {
            id: _this3.slip.id
          }).then(function (res) {
            if (res.data.status === 1) {
              _this3.showMessage('success', res.data.message);
              _this3.getSlipDetails();
            } else {
              _this3.showError(res.data.message);
            }
          })["catch"](function (err) {
            _this3.showError(__('an_error_occurred_during_dispatch'));
          });
        }
      });
    },
    cancelSlip: function cancelSlip() {
      var _this4 = this;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('this_will_cancel_the_loading_slip_and_release_all_its_orders_so_they_can_be_added_to_a_new_slip'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: __('yes_cancel_slip'),
        cancelButtonText: __('no'),
        confirmButtonColor: '#e74a3b',
        cancelButtonColor: '#858796'
      }).then(function (result) {
        if (result.isConfirmed) {
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this4.apiBase + '/loading_slips/cancel', {
            id: _this4.slip.id
          }).then(function (res) {
            if (res.data.status === 1) {
              _this4.showMessage('success', res.data.message);
              _this4.getSlipDetails();
            } else {
              _this4.showError(res.data.message);
            }
          })["catch"](function (err) {
            _this4.showError(__('an_error_occurred_during_cancellation'));
          });
        }
      });
    },
    printSlip: function printSlip() {
      window.open(this.apiBase + '/loading_slips/print/' + this.slip.id, '_blank');
    },
    formatDate: function formatDate(dateStr) {
      return moment(dateStr).format('DD-MM-YYYY hh:mm A');
    },
    formatNumber: function formatNumber(value) {
      var n = parseFloat(value);
      return isNaN(n) ? '0' : n.toLocaleString('en-IN', {
        maximumFractionDigits: 1
      });
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
    // Where this stop stands: label + colour for its pill and route node.
    // `muted` dims stops that will not be delivered.
    stopStatus: function stopStatus(order) {
      switch (Number(order.active_status)) {
        case ORDER_STATUS.delivered:
          return {
            key: 'delivered',
            label: __('Delivered'),
            tone: 'green'
          };
        case ORDER_STATUS.partialDelivery:
          return {
            key: 'partial',
            label: __('Partial Delivery'),
            tone: 'amber'
          };
        case ORDER_STATUS.outForDelivery:
          return {
            key: 'out',
            label: __('Out For Delivery'),
            tone: 'blue'
          };
        case ORDER_STATUS.rescheduled:
          return {
            key: 'rescheduled',
            label: __('Rescheduled'),
            tone: 'purple'
          };
        case ORDER_STATUS.notDelivered:
          return {
            key: 'notDelivered',
            label: __('Not Delivered'),
            tone: 'red'
          };
        case ORDER_STATUS.returned:
          return {
            key: 'returned',
            label: __('Returned'),
            tone: 'slate',
            muted: true
          };
        case ORDER_STATUS.cancelled:
          return {
            key: 'cancelled',
            label: __('cancelled'),
            tone: 'red',
            muted: true
          };
        default:
          return {
            key: 'pending',
            label: __('Pending'),
            tone: 'slate'
          };
      }
    },
    // Short item lists start open; long ones start collapsed until clicked.
    itemsOpen: function itemsOpen(order) {
      if (Object.prototype.hasOwnProperty.call(this.itemsToggled, order.id)) {
        return this.itemsToggled[order.id];
      }
      return order.items.length <= 3;
    },
    toggleItems: function toggleItems(order) {
      this.$set(this.itemsToggled, order.id, !this.itemsOpen(order));
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* ---------- tokens ---------- */\n.lsv[data-v-6dc471e8] {\n    --lsv-card: #ffffff;\n    --lsv-border: #e5eaf2;\n    --lsv-text: #0f172a;\n    --lsv-muted: #64748b;\n    --lsv-soft: #f4f7fb;\n    --lsv-primary: #1e3a8a;\n    --lsv-primary-hover: #172d6e;\n    --lsv-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 6px 20px rgba(15, 23, 42, 0.04);\n\n    --lsv-green-bg: #e7f7ef;  --lsv-green-fg: #047857;  --lsv-green: #10b981;\n    --lsv-amber-bg: #fff6e0;  --lsv-amber-fg: #b45309;  --lsv-amber: #f59e0b;\n    --lsv-red-bg: #fdecec;    --lsv-red-fg: #b91c1c;    --lsv-red: #ef4444;\n    --lsv-blue-bg: #e8f0fe;   --lsv-blue-fg: #1d4ed8;   --lsv-blue: #3b82f6;\n    --lsv-purple-bg: #f1eafe; --lsv-purple-fg: #6d28d9; --lsv-purple: #8b5cf6;\n    --lsv-slate-bg: #eef1f6;  --lsv-slate-fg: #475569;  --lsv-slate: #94a3b8;\n\n    padding: 24px;\n    color: var(--lsv-text);\n    font-variant-numeric: tabular-nums;\n}\n.theme-dark .lsv[data-v-6dc471e8] {\n    --lsv-card: #1e1e2d;\n    --lsv-border: #2f2f45;\n    --lsv-text: #eef2f7;\n    --lsv-muted: #9aa5b8;\n    --lsv-soft: #262639;\n    --lsv-primary: #3d5fd6;\n    --lsv-primary-hover: #5373e6;\n    --lsv-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);\n\n    --lsv-green-bg: rgba(16, 185, 129, 0.16);  --lsv-green-fg: #4ade9f;\n    --lsv-amber-bg: rgba(245, 158, 11, 0.16);  --lsv-amber-fg: #fbbf4a;\n    --lsv-red-bg: rgba(239, 68, 68, 0.16);     --lsv-red-fg: #f87171;\n    --lsv-blue-bg: rgba(59, 130, 246, 0.18);   --lsv-blue-fg: #7fb0ff;\n    --lsv-purple-bg: rgba(139, 92, 246, 0.18); --lsv-purple-fg: #b69cff;\n    --lsv-slate-bg: rgba(148, 163, 184, 0.14); --lsv-slate-fg: #b6c0d1;\n}\n\n/* tone helpers: set --tone-* once, reused by pills, tiles and route nodes */\n.lsv-tone--green[data-v-6dc471e8]  { --tone-bg: var(--lsv-green-bg);  --tone-fg: var(--lsv-green-fg);\n}\n.lsv-tone--amber[data-v-6dc471e8]  { --tone-bg: var(--lsv-amber-bg);  --tone-fg: var(--lsv-amber-fg);\n}\n.lsv-tone--red[data-v-6dc471e8]    { --tone-bg: var(--lsv-red-bg);    --tone-fg: var(--lsv-red-fg);\n}\n.lsv-tone--blue[data-v-6dc471e8]   { --tone-bg: var(--lsv-blue-bg);   --tone-fg: var(--lsv-blue-fg);\n}\n.lsv-tone--purple[data-v-6dc471e8] { --tone-bg: var(--lsv-purple-bg); --tone-fg: var(--lsv-purple-fg);\n}\n.lsv-tone--slate[data-v-6dc471e8]  { --tone-bg: var(--lsv-slate-bg);  --tone-fg: var(--lsv-slate-fg);\n}\n.lsv-text--green[data-v-6dc471e8] { color: var(--lsv-green-fg);\n}\n.lsv-text--amber[data-v-6dc471e8] { color: var(--lsv-amber-fg);\n}\n.lsv-text--red[data-v-6dc471e8]   { color: var(--lsv-red-fg);\n}\n\n/* ---------- header ---------- */\n.lsv-head[data-v-6dc471e8] {\n    display: flex;\n    flex-wrap: wrap;\n    align-items: flex-start;\n    justify-content: space-between;\n    gap: 16px 24px;\n    margin-bottom: 24px;\n}\n.lsv-eyebrow[data-v-6dc471e8] {\n    display: block;\n    font-size: 12px;\n    font-weight: 700;\n    letter-spacing: 0.08em;\n    text-transform: uppercase;\n    color: var(--lsv-muted);\n    margin-bottom: 4px;\n}\n.lsv-head__title[data-v-6dc471e8] { display: flex; flex-wrap: wrap; align-items: center; gap: 14px;\n}\n.lsv-head__title h1[data-v-6dc471e8] {\n    margin: 0;\n    font-size: 40px;\n    line-height: 1.1;\n    font-weight: 800;\n    letter-spacing: -0.02em;\n    color: var(--lsv-text);\n}\n.lsv-head__sub[data-v-6dc471e8] { margin: 8px 0 0; font-size: 14px; color: var(--lsv-muted);\n}\n.lsv-head__side[data-v-6dc471e8] { display: flex; flex-direction: column; align-items: flex-end; gap: 12px;\n}\n.lsv-actions[data-v-6dc471e8] { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px;\n}\n.lsv-rundate[data-v-6dc471e8] { font-size: 13px; color: var(--lsv-muted);\n}\n.lsv-rundate .fa[data-v-6dc471e8] { margin-right: 6px;\n}\n.lsv-btn[data-v-6dc471e8] {\n    display: inline-flex;\n    align-items: center;\n    gap: 8px;\n    height: 44px;\n    padding: 0 20px;\n    border-radius: 12px;\n    border: 1px solid transparent;\n    font-size: 14px;\n    font-weight: 600;\n    line-height: 1;\n    white-space: nowrap;\n    cursor: pointer;\n    text-decoration: none !important;\n    transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;\n}\n.lsv-btn[data-v-6dc471e8]:active { transform: translateY(1px);\n}\n.lsv-btn--ghost[data-v-6dc471e8] { background: var(--lsv-card); color: var(--lsv-text); border-color: var(--lsv-border); box-shadow: var(--lsv-shadow);\n}\n.lsv-btn--ghost[data-v-6dc471e8]:hover { background: var(--lsv-soft); color: var(--lsv-text);\n}\n.lsv-btn--primary[data-v-6dc471e8] { background: var(--lsv-primary); color: #fff; box-shadow: 0 4px 14px rgba(30, 58, 138, 0.28);\n}\n.lsv-btn--primary[data-v-6dc471e8]:hover { background: var(--lsv-primary-hover); color: #fff;\n}\n.lsv-btn--success[data-v-6dc471e8] { background: var(--lsv-green); color: #fff; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.28);\n}\n.lsv-btn--success[data-v-6dc471e8]:hover { filter: brightness(0.94); color: #fff;\n}\n.lsv-btn--danger[data-v-6dc471e8] { background: var(--lsv-card); color: var(--lsv-red-fg); border-color: var(--lsv-red);\n}\n.lsv-btn--danger[data-v-6dc471e8]:hover { background: var(--lsv-red-bg);\n}\n\n/* ---------- shared bits ---------- */\n.lsv-card[data-v-6dc471e8] {\n    background: var(--lsv-card);\n    border: 1px solid var(--lsv-border);\n    border-radius: 18px;\n    box-shadow: var(--lsv-shadow);\n}\n.lsv-card__head[data-v-6dc471e8] {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    padding: 18px 20px 0;\n}\n.lsv-card__head h2[data-v-6dc471e8] { margin: 0; font-size: 16px; font-weight: 700; color: var(--lsv-text); white-space: nowrap;\n}\n.lsv-card__head > h2[data-v-6dc471e8] { flex: 1; min-width: 0;\n}\n.lsv-card__titles[data-v-6dc471e8] { flex: 1; min-width: 0;\n}\n.lsv-card__titles h2[data-v-6dc471e8] { white-space: normal;\n}\n.lsv-card__titles p[data-v-6dc471e8] { margin: 2px 0 0; font-size: 13px; color: var(--lsv-muted);\n}\n.lsv-card__body[data-v-6dc471e8] { padding: 18px 20px 20px;\n}\n.lsv-tile[data-v-6dc471e8] {\n    flex-shrink: 0;\n    width: 52px;\n    height: 52px;\n    border-radius: 14px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 22px;\n    background: var(--tone-bg);\n    color: var(--tone-fg);\n}\n.lsv-tile--sm[data-v-6dc471e8] { width: 40px; height: 40px; border-radius: 12px; font-size: 17px;\n}\n.lsv-pill[data-v-6dc471e8] {\n    display: inline-flex;\n    align-items: center;\n    gap: 6px;\n    padding: 5px 12px;\n    border-radius: 999px;\n    font-size: 12px;\n    font-weight: 600;\n    line-height: 1.2;\n    white-space: nowrap;\n    background: var(--tone-bg);\n    color: var(--tone-fg);\n}\n.lsv-pill--lg[data-v-6dc471e8] { padding: 8px 16px; font-size: 15px; font-weight: 700; gap: 8px;\n}\n.lsv-dot[data-v-6dc471e8] { width: 7px; height: 7px; border-radius: 50%; background: currentColor;\n}\n.lsv-chip[data-v-6dc471e8] {\n    display: inline-block;\n    padding: 3px 10px;\n    border-radius: 8px;\n    font-size: 12px;\n    font-weight: 600;\n    background: var(--lsv-soft);\n    color: var(--lsv-muted);\n    border: 1px solid var(--lsv-border);\n}\n.lsv-empty[data-v-6dc471e8] { margin: 0; text-align: center; color: var(--lsv-muted); font-size: 14px; padding: 12px 0;\n}\n\n/* ---------- stat cards ---------- */\n.lsv-stats[data-v-6dc471e8] {\n    display: grid;\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n    gap: 16px;\n    margin-bottom: 24px;\n}\n.lsv-stat[data-v-6dc471e8] { display: flex; align-items: center; gap: 16px; padding: 20px;\n}\n.lsv-stat__body[data-v-6dc471e8] { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 2px;\n}\n.lsv-stat__label[data-v-6dc471e8] { font-size: 13px; color: var(--lsv-muted);\n}\n.lsv-stat__value[data-v-6dc471e8] { font-size: 28px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--lsv-text);\n}\n.lsv-stat__value small[data-v-6dc471e8] { font-size: 15px; font-weight: 600; color: var(--lsv-muted); letter-spacing: 0;\n}\n.lsv-stat__hint[data-v-6dc471e8] { font-size: 12.5px; color: var(--lsv-muted);\n}\n.lsv-meter[data-v-6dc471e8] { display: flex; align-items: center; gap: 10px; margin-top: 6px;\n}\n.lsv-meter__track[data-v-6dc471e8] { flex: 1; height: 8px; border-radius: 999px; background: var(--lsv-slate-bg); overflow: hidden;\n}\n.lsv-meter__fill[data-v-6dc471e8] { height: 100%; border-radius: 999px; transition: width 0.4s ease;\n}\n.lsv-meter__fill--green[data-v-6dc471e8] { background: var(--lsv-green);\n}\n.lsv-meter__fill--amber[data-v-6dc471e8] { background: var(--lsv-amber);\n}\n.lsv-meter__fill--red[data-v-6dc471e8]   { background: var(--lsv-red);\n}\n.lsv-meter__pct[data-v-6dc471e8] { font-size: 12.5px; font-weight: 600; white-space: nowrap;\n}\n\n/* ---------- layout ---------- */\n.lsv-grid[data-v-6dc471e8] { display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 24px; align-items: start;\n}\n.lsv-side[data-v-6dc471e8], .lsv-main[data-v-6dc471e8] { display: flex; flex-direction: column; gap: 24px; min-width: 0;\n}\n\n/* ---------- vehicle / driver ---------- */\n.lsv-person[data-v-6dc471e8] { display: flex; align-items: center; gap: 16px; padding-bottom: 16px; margin-bottom: 4px;\n}\n.lsv-person__name[data-v-6dc471e8] { font-size: 17px; font-weight: 700; color: var(--lsv-text);\n}\n.lsv-person__sub[data-v-6dc471e8] { display: inline-block; margin-top: 2px; font-size: 14px; color: var(--lsv-muted); text-decoration: none;\n}\n.lsv-person__sub[data-v-6dc471e8]:hover { color: var(--lsv-primary);\n}\n.lsv-person__sub .fa[data-v-6dc471e8] { margin-right: 4px;\n}\n.lsv-vehicle-art[data-v-6dc471e8] {\n    width: 84px;\n    height: 64px;\n    flex-shrink: 0;\n    border-radius: 14px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 30px;\n    color: var(--lsv-blue-fg);\n    background: linear-gradient(135deg, var(--lsv-blue-bg), var(--lsv-soft));\n}\n.lsv-plate[data-v-6dc471e8] {\n    display: inline-block;\n    margin-top: 4px;\n    padding: 3px 10px;\n    border-radius: 8px;\n    font-family: SFMono-Regular, Menlo, Consolas, monospace;\n    font-size: 12.5px;\n    font-weight: 600;\n    letter-spacing: 0.04em;\n    background: var(--lsv-soft);\n    color: var(--lsv-text);\n    border: 1px solid var(--lsv-border);\n}\n.lsv-avatar[data-v-6dc471e8] {\n    width: 64px;\n    height: 64px;\n    flex-shrink: 0;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 22px;\n    font-weight: 700;\n    letter-spacing: 0.02em;\n    color: var(--lsv-blue-fg);\n    background: var(--lsv-blue-bg);\n}\n.lsv-facts[data-v-6dc471e8] { list-style: none; margin: 0; padding: 4px 0 0; border-top: 1px solid var(--lsv-border);\n}\n.lsv-facts li[data-v-6dc471e8] { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 0; font-size: 14px;\n}\n.lsv-facts li + li[data-v-6dc471e8] { border-top: 1px dashed var(--lsv-border);\n}\n.lsv-facts span[data-v-6dc471e8] { color: var(--lsv-muted);\n}\n.lsv-facts span .fa[data-v-6dc471e8] { width: 20px; color: var(--lsv-slate);\n}\n.lsv-facts strong[data-v-6dc471e8] { font-weight: 700; color: var(--lsv-text); text-align: right;\n}\n\n/* ---------- route sequence ---------- */\n.lsv-stop[data-v-6dc471e8] { display: flex; gap: 16px; padding-bottom: 16px;\n}\n.lsv-stop--last[data-v-6dc471e8] { padding-bottom: 0;\n}\n.lsv-stop__rail[data-v-6dc471e8] { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 40px;\n}\n.lsv-stop__node[data-v-6dc471e8] {\n    width: 40px;\n    height: 40px;\n    flex-shrink: 0;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 16px;\n    font-weight: 700;\n    background: var(--tone-bg);\n    color: var(--tone-fg);\n    box-shadow: 0 0 0 4px var(--lsv-card);\n}\n.lsv-stop__node.lsv-tone--slate[data-v-6dc471e8],\n.lsv-stop__node.lsv-tone--blue[data-v-6dc471e8] { background: var(--lsv-primary); color: #fff;\n}\n.lsv-stop__line[data-v-6dc471e8] { flex: 1; width: 2px; margin-top: 4px; border-radius: 2px; background: var(--lsv-border);\n}\n.lsv-stop__card[data-v-6dc471e8] {\n    flex: 1;\n    min-width: 0;\n    padding: 16px 18px;\n    border: 1px solid var(--lsv-border);\n    border-radius: 14px;\n    background: var(--lsv-card);\n    transition: box-shadow 0.15s ease, border-color 0.15s ease;\n}\n.lsv-stop__card[data-v-6dc471e8]:hover { box-shadow: var(--lsv-shadow);\n}\n.lsv-stop__card--muted[data-v-6dc471e8] { opacity: 0.7; background: var(--lsv-soft);\n}\n.lsv-stop__title[data-v-6dc471e8] { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px;\n}\n.lsv-stop__title h3[data-v-6dc471e8] { margin: 0; font-size: 17px; font-weight: 700; color: var(--lsv-text);\n}\n.lsv-stop__addr[data-v-6dc471e8] { margin: 8px 0 0; font-size: 13.5px; line-height: 1.5; color: var(--lsv-muted);\n}\n.lsv-stop__addr .fa[data-v-6dc471e8] { color: var(--lsv-red); margin-right: 6px;\n}\n.lsv-items[data-v-6dc471e8] { margin-top: 14px; border: 1px solid var(--lsv-border); border-radius: 12px; overflow: hidden; background: var(--lsv-soft);\n}\n.lsv-items__toggle[data-v-6dc471e8] {\n    width: 100%;\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 8px;\n    padding: 10px 14px;\n    border: 0;\n    background: transparent;\n    font-size: 13.5px;\n    font-weight: 600;\n    color: var(--lsv-text);\n    text-align: left;\n    cursor: pointer;\n}\n.lsv-items__toggle .fa-cubes[data-v-6dc471e8] { color: var(--lsv-slate); margin-right: 6px;\n}\n.lsv-items__toggle em[data-v-6dc471e8] { font-style: normal; font-weight: 500; color: var(--lsv-muted); white-space: nowrap;\n}\n.lsv-items__chev[data-v-6dc471e8] { font-size: 11px; color: var(--lsv-muted);\n}\n.lsv-items__list[data-v-6dc471e8] { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--lsv-border); background: var(--lsv-card);\n}\n.lsv-items__list li[data-v-6dc471e8] { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; font-size: 13.5px;\n}\n.lsv-items__list li + li[data-v-6dc471e8] { border-top: 1px dashed var(--lsv-border);\n}\n.lsv-items__name[data-v-6dc471e8] { min-width: 0; font-weight: 500; color: var(--lsv-text);\n}\n.lsv-items__name small[data-v-6dc471e8] { display: block; margin-top: 1px; font-size: 12px; color: var(--lsv-muted);\n}\n.lsv-qty[data-v-6dc471e8] { flex-shrink: 0; padding: 2px 10px; border-radius: 8px; font-weight: 700; font-size: 13px; background: var(--lsv-soft); color: var(--lsv-text);\n}\n.lsv-stop__foot[data-v-6dc471e8] { display: flex; flex-wrap: wrap; gap: 14px 0; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--lsv-border);\n}\n.lsv-stop__foot > div[data-v-6dc471e8] { flex: 1; min-width: 140px; display: flex; flex-direction: column; gap: 2px;\n}\n.lsv-stop__foot > div + div[data-v-6dc471e8] { padding-left: 20px; border-left: 1px solid var(--lsv-border);\n}\n.lsv-stop__flabel[data-v-6dc471e8] { font-size: 12.5px; color: var(--lsv-muted);\n}\n.lsv-stop__foot strong[data-v-6dc471e8] { font-size: 19px; font-weight: 800; letter-spacing: -0.01em; color: var(--lsv-text);\n}\n\n/* ---------- delivery progress ---------- */\n.lsv-steps[data-v-6dc471e8] { list-style: none; margin: 0; padding: 0; display: flex; align-items: flex-start;\n}\n.lsv-step[data-v-6dc471e8] { position: relative; flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;\n}\n.lsv-step[data-v-6dc471e8]::before {\n    content: '';\n    position: absolute;\n    top: 19px;\n    right: 50%;\n    width: 100%;\n    border-top: 2px dashed var(--lsv-border);\n}\n.lsv-step[data-v-6dc471e8]:first-child::before { display: none;\n}\n.lsv-step--done[data-v-6dc471e8]::before, .lsv-step--current[data-v-6dc471e8]::before { border-top: 2px solid var(--lsv-green);\n}\n.lsv-step--cancelled[data-v-6dc471e8]::before { border-top: 2px solid var(--lsv-red);\n}\n.lsv-step__node[data-v-6dc471e8] {\n    position: relative;\n    z-index: 1;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: 15px;\n    background: var(--lsv-card);\n    color: var(--lsv-slate);\n    border: 2px solid var(--lsv-border);\n}\n.lsv-step--done .lsv-step__node[data-v-6dc471e8] { background: var(--lsv-green); border-color: var(--lsv-green); color: #fff;\n}\n.lsv-step--current .lsv-step__node[data-v-6dc471e8] { border-color: var(--lsv-green); color: var(--lsv-green-fg); background: var(--lsv-green-bg); box-shadow: 0 0 0 5px var(--lsv-green-bg);\n}\n.lsv-step--cancelled .lsv-step__node[data-v-6dc471e8] { background: var(--lsv-red); border-color: var(--lsv-red); color: #fff;\n}\n.lsv-step__label[data-v-6dc471e8] { font-size: 13.5px; font-weight: 700; color: var(--lsv-text);\n}\n.lsv-step--pending .lsv-step__label[data-v-6dc471e8] { color: var(--lsv-muted); font-weight: 600;\n}\n.lsv-step__time[data-v-6dc471e8] { font-size: 12px; color: var(--lsv-muted);\n}\n.lsv-breakdown[data-v-6dc471e8] { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--lsv-border);\n}\n.lsv-segbar[data-v-6dc471e8] { display: flex; gap: 3px; height: 10px; border-radius: 999px; overflow: hidden; background: var(--lsv-slate-bg);\n}\n.lsv-segbar__seg[data-v-6dc471e8] { display: block; height: 100%;\n}\n.lsv-segbar__seg--green[data-v-6dc471e8]  { background: var(--lsv-green);\n}\n.lsv-segbar__seg--amber[data-v-6dc471e8]  { background: var(--lsv-amber);\n}\n.lsv-segbar__seg--red[data-v-6dc471e8]    { background: var(--lsv-red);\n}\n.lsv-segbar__seg--blue[data-v-6dc471e8]   { background: var(--lsv-blue);\n}\n.lsv-segbar__seg--purple[data-v-6dc471e8] { background: var(--lsv-purple);\n}\n.lsv-segbar__seg--slate[data-v-6dc471e8]  { background: var(--lsv-slate);\n}\n.lsv-legend[data-v-6dc471e8] { list-style: none; margin: 14px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 22px; font-size: 13px; color: var(--lsv-muted);\n}\n.lsv-legend li[data-v-6dc471e8] { display: inline-flex; align-items: center; gap: 8px;\n}\n.lsv-legend strong[data-v-6dc471e8] { color: var(--lsv-text);\n}\n.lsv-legend__dot[data-v-6dc471e8] { display: inline-block; width: 10px; height: 10px; border-radius: 50%;\n}\n.lsv-loading[data-v-6dc471e8] { padding: 80px 0; text-align: center; font-size: 15px; color: var(--lsv-muted);\n}\n\n/* ---------- responsive ---------- */\n@media (max-width: 1399px) {\n.lsv-stats[data-v-6dc471e8] { grid-template-columns: repeat(2, minmax(0, 1fr));\n}\n}\n@media (max-width: 1199px) {\n.lsv-grid[data-v-6dc471e8] { grid-template-columns: 1fr;\n}\n.lsv-side[data-v-6dc471e8] { flex-direction: row; flex-wrap: wrap;\n}\n.lsv-side > .lsv-card[data-v-6dc471e8] { flex: 1; min-width: 300px;\n}\n}\n@media (max-width: 767px) {\n.lsv[data-v-6dc471e8] { padding: 16px;\n}\n.lsv-head__side[data-v-6dc471e8] { align-items: flex-start; width: 100%;\n}\n.lsv-actions[data-v-6dc471e8] { justify-content: flex-start;\n}\n.lsv-head__title h1[data-v-6dc471e8] { font-size: 32px;\n}\n.lsv-stats[data-v-6dc471e8] { grid-template-columns: 1fr;\n}\n.lsv-stop__foot > div[data-v-6dc471e8] { min-width: 0;\n}\n.lsv-stop__foot > div + div[data-v-6dc471e8] { padding-left: 14px;\n}\n.lsv-stop__foot strong[data-v-6dc471e8] { font-size: 17px;\n}\n.lsv-step__time[data-v-6dc471e8] { display: none;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Logistics/ViewLoadingSlip.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/Logistics/ViewLoadingSlip.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true */ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true");
/* harmony import */ var _ViewLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewLoadingSlip.vue?vue&type=script&lang=js */ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js");
/* harmony import */ var _ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css */ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ViewLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "6dc471e8",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Logistics/ViewLoadingSlip.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewLoadingSlip.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_style_index_0_id_6dc471e8_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=style&index=0&id=6dc471e8&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true":
/*!****************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewLoadingSlip_vue_vue_type_template_id_6dc471e8_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/ViewLoadingSlip.vue?vue&type=template&id=6dc471e8&scoped=true ***!
  \*******************************************************************************************************************************************************************************************************************************************/
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
    { staticClass: "lsv" },
    [
      _vm.slip
        ? [
            _c("header", { staticClass: "lsv-head" }, [
              _c("div", { staticClass: "lsv-head__main" }, [
                _c("span", { staticClass: "lsv-eyebrow" }, [
                  _vm._v(_vm._s(_vm.__("loading_slip"))),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "lsv-head__title" }, [
                  _c("h1", [_vm._v(_vm._s(_vm.slip.slip_no))]),
                  _vm._v(" "),
                  _c(
                    "span",
                    {
                      staticClass: "lsv-pill lsv-pill--lg",
                      class: "lsv-tone--" + _vm.slipStatus.tone,
                    },
                    [
                      _c("i", {
                        staticClass: "fa",
                        class: _vm.slipStatus.icon,
                      }),
                      _vm._v(
                        " " +
                          _vm._s(_vm.slipStatus.label) +
                          "\n                    "
                      ),
                    ]
                  ),
                ]),
                _vm._v(" "),
                _c("p", { staticClass: "lsv-head__sub" }, [
                  _vm._v(
                    _vm._s(
                      _vm.__(
                        "detailed_view_of_planned_route_sequence_loaded_goods_and_vehicle_status"
                      )
                    )
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "lsv-head__side" }, [
                _c(
                  "div",
                  { staticClass: "lsv-actions" },
                  [
                    _c(
                      "router-link",
                      {
                        staticClass: "lsv-btn lsv-btn--ghost",
                        attrs: { to: _vm.urlPrefix + "/loading_slips" },
                      },
                      [
                        _c("i", { staticClass: "fa fa-arrow-left" }),
                        _vm._v(
                          " " +
                            _vm._s(_vm.__("back_to_slips")) +
                            "\n                    "
                        ),
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "lsv-btn lsv-btn--primary",
                        on: { click: _vm.printSlip },
                      },
                      [
                        _c("i", { staticClass: "fa fa-print" }),
                        _vm._v(
                          " " +
                            _vm._s(_vm.__("print_slip")) +
                            "\n                    "
                        ),
                      ]
                    ),
                    _vm._v(" "),
                    _vm.isSeller && _vm.slip.status == 0
                      ? _c(
                          "button",
                          {
                            staticClass: "lsv-btn lsv-btn--success",
                            on: { click: _vm.dispatchSlip },
                          },
                          [
                            _c("i", { staticClass: "fa fa-paper-plane" }),
                            _vm._v(
                              " " +
                                _vm._s(_vm.__("dispatch_run")) +
                                "\n                    "
                            ),
                          ]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.isSeller && _vm.slip.status == 0
                      ? _c(
                          "button",
                          {
                            staticClass: "lsv-btn lsv-btn--danger",
                            on: { click: _vm.cancelSlip },
                          },
                          [
                            _c("i", { staticClass: "fa fa-ban" }),
                            _vm._v(
                              " " +
                                _vm._s(_vm.__("cancel_slip")) +
                                "\n                    "
                            ),
                          ]
                        )
                      : _vm._e(),
                  ],
                  1
                ),
                _vm._v(" "),
                _c("div", { staticClass: "lsv-rundate" }, [
                  _c("i", { staticClass: "fa fa-calendar-alt" }),
                  _vm._v(
                    " " +
                      _vm._s(_vm.__("run_date")) +
                      ": " +
                      _vm._s(_vm.formatDate(_vm.slip.created_at)) +
                      "\n                "
                  ),
                ]),
              ]),
            ]),
            _vm._v(" "),
            _c("section", { staticClass: "lsv-stats" }, [
              _c("div", { staticClass: "lsv-card lsv-stat" }, [
                _vm._m(0),
                _vm._v(" "),
                _c("div", { staticClass: "lsv-stat__body" }, [
                  _c("span", { staticClass: "lsv-stat__label" }, [
                    _vm._v(_vm._s(_vm.__("Total Stops"))),
                  ]),
                  _vm._v(" "),
                  _c("strong", { staticClass: "lsv-stat__value" }, [
                    _vm._v(_vm._s(_vm.orders.length)),
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "lsv-stat__hint" }, [
                    _vm._v(_vm._s(_vm.__("Deliveries in this route"))),
                  ]),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "lsv-card lsv-stat" }, [
                _vm._m(1),
                _vm._v(" "),
                _c("div", { staticClass: "lsv-stat__body" }, [
                  _c("span", { staticClass: "lsv-stat__label" }, [
                    _vm._v(_vm._s(_vm.__("Allocated Load"))),
                  ]),
                  _vm._v(" "),
                  _c("strong", { staticClass: "lsv-stat__value" }, [
                    _vm._v(
                      _vm._s(_vm.formatNumber(_vm.slip.total_weight)) + " "
                    ),
                    _c("small", [_vm._v(_vm._s(_vm.__("kg")))]),
                  ]),
                  _vm._v(" "),
                  _vm.hasCapacity
                    ? _c("span", { staticClass: "lsv-stat__hint" }, [
                        _vm._v(
                          _vm._s(_vm.__("Out of")) +
                            " " +
                            _vm._s(
                              _vm.formatNumber(_vm.slip.vehicle.capacity)
                            ) +
                            " " +
                            _vm._s(_vm.__("kg")) +
                            " " +
                            _vm._s(_vm.__("capacity"))
                        ),
                      ])
                    : _vm._e(),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "lsv-card lsv-stat" }, [
                _vm._m(2),
                _vm._v(" "),
                _c("div", { staticClass: "lsv-stat__body" }, [
                  _c("span", { staticClass: "lsv-stat__label" }, [
                    _vm._v(_vm._s(_vm.__("Vehicle Capacity"))),
                  ]),
                  _vm._v(" "),
                  _vm.hasCapacity
                    ? _c("strong", { staticClass: "lsv-stat__value" }, [
                        _vm._v(
                          _vm._s(_vm.formatNumber(_vm.slip.vehicle.capacity)) +
                            " "
                        ),
                        _c("small", [_vm._v(_vm._s(_vm.__("kg")))]),
                      ])
                    : _c("strong", { staticClass: "lsv-stat__value" }, [
                        _vm._v("-"),
                      ]),
                  _vm._v(" "),
                  _vm.hasCapacity
                    ? _c("div", { staticClass: "lsv-meter" }, [
                        _c("div", { staticClass: "lsv-meter__track" }, [
                          _c("div", {
                            staticClass: "lsv-meter__fill",
                            class: "lsv-meter__fill--" + _vm.loadTone,
                            style: { width: _vm.loadBarWidth + "%" },
                          }),
                        ]),
                        _vm._v(" "),
                        _c(
                          "span",
                          {
                            staticClass: "lsv-meter__pct",
                            class: "lsv-text--" + _vm.loadTone,
                          },
                          [
                            _vm._v(
                              _vm._s(_vm.loadRatioPercent.toFixed(1)) +
                                "% " +
                                _vm._s(_vm.__("Used"))
                            ),
                          ]
                        ),
                      ])
                    : _vm._e(),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "lsv-card lsv-stat" }, [
                _vm._m(3),
                _vm._v(" "),
                _c("div", { staticClass: "lsv-stat__body" }, [
                  _c("span", { staticClass: "lsv-stat__label" }, [
                    _vm._v(_vm._s(_vm.__("Route Value"))),
                  ]),
                  _vm._v(" "),
                  _c("strong", { staticClass: "lsv-stat__value" }, [
                    _vm._v(
                      _vm._s(_vm.$currency) +
                        _vm._s(_vm.formatMoney(_vm.routeValue))
                    ),
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "lsv-stat__hint" }, [
                    _vm._v(
                      _vm._s(_vm.__("Across")) +
                        " " +
                        _vm._s(_vm.activeStopCount) +
                        " " +
                        _vm._s(
                          _vm.activeStopCount === 1
                            ? _vm.__("active stop")
                            : _vm.__("active stops")
                        )
                    ),
                  ]),
                ]),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "lsv-grid" }, [
              _c("aside", { staticClass: "lsv-side" }, [
                _c("div", { staticClass: "lsv-card" }, [
                  _c("div", { staticClass: "lsv-card__head" }, [
                    _vm._m(4),
                    _vm._v(" "),
                    _c("h2", [_vm._v(_vm._s(_vm.__("vehicle_information")))]),
                    _vm._v(" "),
                    _c(
                      "span",
                      {
                        staticClass: "lsv-pill lsv-pill--dot",
                        class: "lsv-tone--" + _vm.vehicleStatus.tone,
                      },
                      [
                        _c("span", { staticClass: "lsv-dot" }),
                        _vm._v(
                          _vm._s(_vm.vehicleStatus.label) +
                            "\n                        "
                        ),
                      ]
                    ),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "lsv-card__body" }, [
                    _vm.slip.vehicle
                      ? _c("div", { staticClass: "lsv-person" }, [
                          _vm._m(5),
                          _vm._v(" "),
                          _c("div", [
                            _c("div", { staticClass: "lsv-person__name" }, [
                              _vm._v(_vm._s(_vm.slip.vehicle.name)),
                            ]),
                            _vm._v(" "),
                            _c("span", { staticClass: "lsv-plate" }, [
                              _vm._v(_vm._s(_vm.slip.vehicle.vehicle_number)),
                            ]),
                          ]),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _c("ul", { staticClass: "lsv-facts" }, [
                      _c("li", [
                        _c("span", [
                          _c("i", { staticClass: "fa fa-archive" }),
                          _vm._v(
                            " " + _vm._s(_vm.__("total_allowed_capacity"))
                          ),
                        ]),
                        _vm._v(" "),
                        _vm.hasCapacity
                          ? _c("strong", [
                              _vm._v(
                                _vm._s(
                                  _vm.formatNumber(_vm.slip.vehicle.capacity)
                                ) +
                                  " " +
                                  _vm._s(_vm.__("kg"))
                              ),
                            ])
                          : _c("strong", [_vm._v("-")]),
                      ]),
                      _vm._v(" "),
                      _c("li", [
                        _c("span", [
                          _c("i", { staticClass: "fa fa-shopping-bag" }),
                          _vm._v(" " + _vm._s(_vm.__("allocated_run_weight"))),
                        ]),
                        _vm._v(" "),
                        _c("strong", [
                          _vm._v(
                            _vm._s(_vm.formatNumber(_vm.slip.total_weight)) +
                              " " +
                              _vm._s(_vm.__("kg"))
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _vm.hasCapacity
                        ? _c("li", [
                            _c("span", [
                              _c("i", { staticClass: "fa fa-tachometer-alt" }),
                              _vm._v(
                                " " + _vm._s(_vm.__("used_capacity_ratio"))
                              ),
                            ]),
                            _vm._v(" "),
                            _c(
                              "strong",
                              { class: "lsv-text--" + _vm.loadTone },
                              [
                                _vm._v(
                                  _vm._s(_vm.loadRatioPercent.toFixed(1)) + "%"
                                ),
                              ]
                            ),
                          ])
                        : _vm._e(),
                    ]),
                  ]),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "lsv-card" }, [
                  _c("div", { staticClass: "lsv-card__head" }, [
                    _vm._m(6),
                    _vm._v(" "),
                    _c("h2", [_vm._v(_vm._s(_vm.__("driver_information")))]),
                    _vm._v(" "),
                    _vm.slip.driver
                      ? _c(
                          "span",
                          {
                            staticClass:
                              "lsv-pill lsv-pill--dot lsv-tone--green",
                          },
                          [
                            _c("span", { staticClass: "lsv-dot" }),
                            _vm._v(
                              _vm._s(_vm.__("active_rider")) +
                                "\n                        "
                            ),
                          ]
                        )
                      : _vm._e(),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "lsv-card__body" },
                    [
                      _vm.slip.driver
                        ? [
                            _c("div", { staticClass: "lsv-person" }, [
                              _c("div", { staticClass: "lsv-avatar" }, [
                                _vm._v(_vm._s(_vm.driverInitials)),
                              ]),
                              _vm._v(" "),
                              _c("div", [
                                _c("div", { staticClass: "lsv-person__name" }, [
                                  _vm._v(_vm._s(_vm.slip.driver.name)),
                                ]),
                                _vm._v(" "),
                                _vm.slip.driver.mobile
                                  ? _c(
                                      "a",
                                      {
                                        staticClass: "lsv-person__sub",
                                        attrs: {
                                          href: "tel:" + _vm.slip.driver.mobile,
                                        },
                                      },
                                      [
                                        _c("i", { staticClass: "fa fa-phone" }),
                                        _vm._v(
                                          " " +
                                            _vm._s(_vm.slip.driver.mobile) +
                                            "\n                                    "
                                        ),
                                      ]
                                    )
                                  : _vm._e(),
                              ]),
                            ]),
                            _vm._v(" "),
                            _c("ul", { staticClass: "lsv-facts" }, [
                              _vm.slip.vehicle
                                ? _c("li", [
                                    _c("span", [
                                      _c("i", { staticClass: "fa fa-id-card" }),
                                      _vm._v(
                                        " " + _vm._s(_vm.__("Vehicle No"))
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("strong", [
                                      _vm._v(
                                        _vm._s(_vm.slip.vehicle.vehicle_number)
                                      ),
                                    ]),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              _c("li", [
                                _c("span", [
                                  _c("i", {
                                    staticClass: "fa fa-calendar-alt",
                                  }),
                                  _vm._v(" " + _vm._s(_vm.__("run_date"))),
                                ]),
                                _vm._v(" "),
                                _c("strong", [
                                  _vm._v(
                                    _vm._s(_vm.formatDate(_vm.slip.created_at))
                                  ),
                                ]),
                              ]),
                            ]),
                          ]
                        : _c("p", { staticClass: "lsv-empty" }, [
                            _vm._v(_vm._s(_vm.__("No driver assigned"))),
                          ]),
                    ],
                    2
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "lsv-main" }, [
                _c("div", { staticClass: "lsv-card" }, [
                  _c("div", { staticClass: "lsv-card__head" }, [
                    _vm._m(7),
                    _vm._v(" "),
                    _c("div", { staticClass: "lsv-card__titles" }, [
                      _c("h2", [_vm._v(_vm._s(_vm.__("Route Sequence")))]),
                      _vm._v(" "),
                      _c("p", [
                        _vm._v(
                          _vm._s(
                            _vm.__("logical_route_sequence_optimized_proximity")
                          )
                        ),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("span", { staticClass: "lsv-pill lsv-tone--blue" }, [
                      _vm._v(
                        _vm._s(_vm.orders.length) +
                          " " +
                          _vm._s(
                            _vm.orders.length === 1
                              ? _vm.__("Stop")
                              : _vm.__("Stops")
                          )
                      ),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "lsv-card__body" },
                    [
                      _vm.orders.length === 0
                        ? _c("p", { staticClass: "lsv-empty" }, [
                            _vm._v(_vm._s(_vm.__("No stops on this slip"))),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _vm._l(_vm.orders, function (order, idx) {
                        return _c(
                          "div",
                          {
                            key: order.id,
                            staticClass: "lsv-stop",
                            class: {
                              "lsv-stop--last": idx === _vm.orders.length - 1,
                            },
                          },
                          [
                            _c("div", { staticClass: "lsv-stop__rail" }, [
                              _c(
                                "div",
                                {
                                  staticClass: "lsv-stop__node",
                                  class:
                                    "lsv-tone--" + _vm.stopStatus(order).tone,
                                },
                                [
                                  _vm.stopStatus(order).key === "delivered"
                                    ? _c("i", { staticClass: "fa fa-check" })
                                    : _c("span", [_vm._v(_vm._s(idx + 1))]),
                                ]
                              ),
                              _vm._v(" "),
                              idx < _vm.orders.length - 1
                                ? _c("div", { staticClass: "lsv-stop__line" })
                                : _vm._e(),
                            ]),
                            _vm._v(" "),
                            _c(
                              "div",
                              {
                                staticClass: "lsv-stop__card",
                                class: {
                                  "lsv-stop__card--muted":
                                    _vm.stopStatus(order).muted,
                                },
                              },
                              [
                                _c("div", { staticClass: "lsv-stop__top" }, [
                                  _c("div", { staticClass: "lsv-stop__who" }, [
                                    _c(
                                      "div",
                                      { staticClass: "lsv-stop__title" },
                                      [
                                        _c("h3", [
                                          _vm._v(
                                            _vm._s(order.user_name || "-")
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c(
                                          "span",
                                          { staticClass: "lsv-chip" },
                                          [
                                            _vm._v(
                                              _vm._s(_vm.__("order")) +
                                                " #" +
                                                _vm._s(order.id)
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "span",
                                          {
                                            staticClass:
                                              "lsv-pill lsv-pill--dot",
                                            class:
                                              "lsv-tone--" +
                                              _vm.stopStatus(order).tone,
                                          },
                                          [
                                            _c("span", {
                                              staticClass: "lsv-dot",
                                            }),
                                            _vm._v(
                                              _vm._s(
                                                _vm.stopStatus(order).label
                                              ) +
                                                "\n                                            "
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    order.customer_address
                                      ? _c(
                                          "p",
                                          { staticClass: "lsv-stop__addr" },
                                          [
                                            _c("i", {
                                              staticClass: "fa fa-map-marker",
                                            }),
                                            _vm._v(
                                              " " +
                                                _vm._s(order.customer_address) +
                                                "\n                                        "
                                            ),
                                          ]
                                        )
                                      : _vm._e(),
                                  ]),
                                ]),
                                _vm._v(" "),
                                order.items && order.items.length > 0
                                  ? _c("div", { staticClass: "lsv-items" }, [
                                      _c(
                                        "button",
                                        {
                                          staticClass: "lsv-items__toggle",
                                          attrs: { type: "button" },
                                          on: {
                                            click: function ($event) {
                                              return _vm.toggleItems(order)
                                            },
                                          },
                                        },
                                        [
                                          _c("span", [
                                            _c("i", {
                                              staticClass: "fa fa-cubes",
                                            }),
                                            _vm._v(
                                              " " +
                                                _vm._s(
                                                  _vm.__("items_to_unload")
                                                ) +
                                                "\n                                            "
                                            ),
                                            _c("em", [
                                              _vm._v(
                                                "(" +
                                                  _vm._s(order.items.length) +
                                                  " " +
                                                  _vm._s(
                                                    order.items.length === 1
                                                      ? _vm.__("item")
                                                      : _vm.__("items")
                                                  ) +
                                                  ")"
                                              ),
                                            ]),
                                          ]),
                                          _vm._v(" "),
                                          _c("i", {
                                            staticClass: "fa lsv-items__chev",
                                            class: _vm.itemsOpen(order)
                                              ? "fa-chevron-up"
                                              : "fa-chevron-down",
                                          }),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "ul",
                                        {
                                          directives: [
                                            {
                                              name: "show",
                                              rawName: "v-show",
                                              value: _vm.itemsOpen(order),
                                              expression: "itemsOpen(order)",
                                            },
                                          ],
                                          staticClass: "lsv-items__list",
                                        },
                                        _vm._l(order.items, function (item) {
                                          return _c("li", { key: item.id }, [
                                            _c(
                                              "span",
                                              {
                                                staticClass: "lsv-items__name",
                                              },
                                              [
                                                _vm._v(
                                                  "\n                                                " +
                                                    _vm._s(item.product_name) +
                                                    "\n                                                "
                                                ),
                                                item.variant_name
                                                  ? _c("small", [
                                                      _vm._v(
                                                        _vm._s(
                                                          item.variant_name
                                                        )
                                                      ),
                                                    ])
                                                  : _vm._e(),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "span",
                                              { staticClass: "lsv-qty" },
                                              [
                                                _vm._v(
                                                  "× " + _vm._s(item.quantity)
                                                ),
                                              ]
                                            ),
                                          ])
                                        }),
                                        0
                                      ),
                                    ])
                                  : _vm._e(),
                                _vm._v(" "),
                                _c("div", { staticClass: "lsv-stop__foot" }, [
                                  _c("div", [
                                    _c(
                                      "span",
                                      { staticClass: "lsv-stop__flabel" },
                                      [_vm._v(_vm._s(_vm.__("stop_value")))]
                                    ),
                                    _vm._v(" "),
                                    _c("strong", [
                                      _vm._v(
                                        _vm._s(_vm.$currency) +
                                          _vm._s(
                                            _vm.formatMoney(order.final_total)
                                          )
                                      ),
                                    ]),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", [
                                    _c(
                                      "span",
                                      { staticClass: "lsv-stop__flabel" },
                                      [_vm._v(_vm._s(_vm.__("Total Weight")))]
                                    ),
                                    _vm._v(" "),
                                    _c("strong", [
                                      _vm._v(
                                        _vm._s(_vm.formatNumber(order.weight)) +
                                          " " +
                                          _vm._s(_vm.__("kg"))
                                      ),
                                    ]),
                                  ]),
                                ]),
                              ]
                            ),
                          ]
                        )
                      }),
                    ],
                    2
                  ),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "lsv-card" }, [
                  _c("div", { staticClass: "lsv-card__head" }, [
                    _vm._m(8),
                    _vm._v(" "),
                    _c("div", { staticClass: "lsv-card__titles" }, [
                      _c("h2", [_vm._v(_vm._s(_vm.__("Delivery Progress")))]),
                      _vm._v(" "),
                      _c("p", [
                        _vm._v(
                          _vm._s(_vm.__("Status of this run and its stops"))
                        ),
                      ]),
                    ]),
                    _vm._v(" "),
                    _vm.progressStops > 0
                      ? _c(
                          "span",
                          { staticClass: "lsv-pill lsv-tone--slate" },
                          [
                            _vm._v(
                              "\n                            " +
                                _vm._s(_vm.completedStops) +
                                " / " +
                                _vm._s(_vm.progressStops) +
                                " " +
                                _vm._s(_vm.__("delivered")) +
                                "\n                        "
                            ),
                          ]
                        )
                      : _vm._e(),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "lsv-card__body" }, [
                    _c(
                      "ol",
                      { staticClass: "lsv-steps" },
                      _vm._l(_vm.lifecycle, function (step) {
                        return _c(
                          "li",
                          {
                            key: step.key,
                            staticClass: "lsv-step",
                            class: "lsv-step--" + step.state,
                          },
                          [
                            _c("span", { staticClass: "lsv-step__node" }, [
                              _c("i", { staticClass: "fa", class: step.icon }),
                            ]),
                            _vm._v(" "),
                            _c("span", { staticClass: "lsv-step__label" }, [
                              _vm._v(_vm._s(step.label)),
                            ]),
                            _vm._v(" "),
                            step.time
                              ? _c("span", { staticClass: "lsv-step__time" }, [
                                  _vm._v(_vm._s(step.time)),
                                ])
                              : _vm._e(),
                          ]
                        )
                      }),
                      0
                    ),
                    _vm._v(" "),
                    _vm.orders.length > 0
                      ? _c("div", { staticClass: "lsv-breakdown" }, [
                          _c(
                            "div",
                            { staticClass: "lsv-segbar" },
                            _vm._l(_vm.stopSummary, function (seg) {
                              return _c("span", {
                                key: seg.key,
                                staticClass: "lsv-segbar__seg",
                                class: "lsv-segbar__seg--" + seg.tone,
                                style: {
                                  width:
                                    (seg.count / _vm.orders.length) * 100 + "%",
                                },
                                attrs: { title: seg.label + ": " + seg.count },
                              })
                            }),
                            0
                          ),
                          _vm._v(" "),
                          _c(
                            "ul",
                            { staticClass: "lsv-legend" },
                            _vm._l(_vm.stopSummary, function (seg) {
                              return _c("li", { key: seg.key }, [
                                _c("span", {
                                  staticClass: "lsv-legend__dot",
                                  class: "lsv-segbar__seg--" + seg.tone,
                                }),
                                _vm._v(
                                  "\n                                    " +
                                    _vm._s(seg.label) +
                                    " "
                                ),
                                _c("strong", [_vm._v(_vm._s(seg.count))]),
                              ])
                            }),
                            0
                          ),
                        ])
                      : _vm._e(),
                  ]),
                ]),
              ]),
            ]),
          ]
        : _c("div", { staticClass: "lsv-loading" }, [
            _c("i", { staticClass: "fa fa-spinner fa-spin" }),
            _vm._v(" " + _vm._s(_vm.__("loading")) + "...\n    "),
          ]),
    ],
    2
  )
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "lsv-tile lsv-tone--blue" }, [
      _c("i", { staticClass: "fa fa-cube" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "lsv-tile lsv-tone--green" }, [
      _c("i", { staticClass: "fa fa-shopping-bag" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "lsv-tile lsv-tone--purple" }, [
      _c("i", { staticClass: "fa fa-truck" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "lsv-tile lsv-tone--amber" }, [
      _c("i", { staticClass: "fa fa-money-bill-wave" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "lsv-tile lsv-tile--sm lsv-tone--blue" }, [
      _c("i", { staticClass: "fa fa-truck" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "lsv-vehicle-art" }, [
      _c("i", { staticClass: "fa fa-truck" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "lsv-tile lsv-tile--sm lsv-tone--green" }, [
      _c("i", { staticClass: "fa fa-user" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "lsv-tile lsv-tile--sm lsv-tone--blue" }, [
      _c("i", { staticClass: "fa fa-road" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "lsv-tile lsv-tile--sm lsv-tone--purple" },
      [_c("i", { staticClass: "fa fa-clock" })]
    )
  },
]
render._withStripped = true



/***/ })

}]);