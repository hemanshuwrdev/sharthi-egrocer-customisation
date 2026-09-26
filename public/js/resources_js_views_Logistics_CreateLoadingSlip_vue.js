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
/* harmony import */ var v_select2_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! v-select2-component */ "./node_modules/v-select2-component/dist/Select2.esm.js");
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  components: {
    Select2: v_select2_component__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      orders: [],
      areas: [],
      vehicles: [],
      drivers: [],
      productOptions: [],
      selectedProductIds: [],
      selectedArea: '',
      selectedRescheduled: '',
      selectedVehicleId: '',
      selectedVehicle: null,
      selectedDriverId: '',
      selectedOrderIds: [],
      selectAll: false,
      totalSelectedWeight: 0,
      loadPercent: 0,
      loading: false,
      reviewLoading: false,
      showReviewModal: false,
      reviewSummary: [],
      expandedProducts: {}
    };
  },
  computed: {
    // Regroups the order-first reviewSummary into product-first rows for display —
    // reviewSummary itself stays the source of truth for what's actually included
    // (removeOrderFromReview mutates that), this just re-derives from it, so removing
    // an order updates every product's total automatically via Vue reactivity.
    productGroupedSummary: function productGroupedSummary() {
      var groups = {};
      this.reviewSummary.forEach(function (order) {
        order.items.forEach(function (item) {
          if (!groups[item.key]) {
            groups[item.key] = {
              key: item.key,
              name: item.name,
              packSize: item.pack_size,
              boxUnit: item.box_unit,
              pieceUnit: item.piece_unit,
              totalQty: 0,
              orders: []
            };
          }
          var group = groups[item.key];
          group.totalQty += item.qty;
          group.orders.push({
            orderId: order.order_id,
            ordersId: order.orders_id,
            retailerName: order.retailer_name,
            qty: item.qty,
            boxes: item.boxes,
            loose: item.loose
          });
        });
      });
      return Object.values(groups).map(function (g) {
        var boxes = null,
          loose = null;
        if (g.packSize > 0) {
          boxes = Math.floor(g.totalQty / g.packSize);
          loose = g.totalQty % g.packSize;
        }
        return _objectSpread(_objectSpread({}, g), {}, {
          boxes: boxes,
          loose: loose
        });
      });
    },
    totalFilteredWeight: function totalFilteredWeight() {
      var sum = this.orders.reduce(function (acc, order) {
        return acc + parseFloat(order.weight || 0);
      }, 0);
      return sum.toFixed(2);
    },
    totalFilteredValue: function totalFilteredValue() {
      var sum = this.orders.reduce(function (acc, order) {
        return acc + parseFloat(order.final_total || 0);
      }, 0);
      return sum.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
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
    this.getAreas();
    this.getVehicles();
    this.getDrivers();
    this.getProductOptions();
    this.getOrders();
  },
  watch: {
    selectedProductIds: function selectedProductIds() {
      this.getOrders();
    }
  },
  methods: {
    getProductOptions: function getProductOptions() {
      var _this = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/products').then(function (res) {
        if (res.data.status === 1) {
          _this.productOptions = res.data.data || [];
        }
      });
    },
    getAreas: function getAreas() {
      var _this2 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/areas').then(function (res) {
        if (res.data.status === 1) {
          _this2.areas = res.data.data || [];
        }
      });
    },
    getVehicles: function getVehicles() {
      var _this3 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/vehicles/active').then(function (res) {
        if (res.data.status === 1) {
          _this3.vehicles = res.data.data;
        }
      });
    },
    getDrivers: function getDrivers() {
      var _this4 = this;
      // Eager load delivery boys that are active
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/delivery_boys', {
        params: {
          status: 1
        }
      }).then(function (res) {
        if (res.data.status === 1) {
          _this4.drivers = res.data.data.data || res.data.data;
        }
      });
    },
    getOrders: function getOrders() {
      var _this5 = this;
      var params = {};
      if (this.selectedArea) params.area_id = this.selectedArea;
      if (this.selectedRescheduled !== '') params.is_rescheduled = this.selectedRescheduled;
      if (this.selectedProductIds.length) params.product_ids = this.selectedProductIds;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/orders', {
        params: params
      }).then(function (res) {
        if (res.data.status === 1) {
          _this5.orders = res.data.data;
          _this5.selectedOrderIds = [];
          _this5.selectAll = false;
          _this5.calculateWeightSum();
        }
      });
    },
    updateVehicleCapacity: function updateVehicleCapacity() {
      var _this6 = this;
      this.selectedVehicle = this.vehicles.find(function (v) {
        return v.id == _this6.selectedVehicleId;
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
      var _this7 = this,
        _this$selectedVehicle;
      var sum = 0;
      this.orders.forEach(function (order) {
        if (_this7.selectedOrderIds.includes(order.id)) {
          sum += parseFloat(order.weight || 0);
        }
      });
      this.totalSelectedWeight = parseFloat(sum.toFixed(2));
      var capacity = parseFloat(((_this$selectedVehicle = this.selectedVehicle) === null || _this$selectedVehicle === void 0 ? void 0 : _this$selectedVehicle.capacity) || 0);
      if (this.selectedVehicle && capacity > 0) {
        this.loadPercent = Math.min(this.totalSelectedWeight / capacity * 100, 120);
      } else {
        this.loadPercent = 0;
      }
    },
    formatZone: function formatZone(zone) {
      if (!zone) return 'All';
      return zone.charAt(0).toUpperCase() + zone.slice(1);
    },
    openReviewModal: function openReviewModal() {
      var _this8 = this;
      this.reviewLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.apiBase + '/loading_slips/order_items_summary', {
        order_ids: this.selectedOrderIds
      }).then(function (res) {
        _this8.reviewLoading = false;
        if (res.data.status === 1) {
          _this8.reviewSummary = res.data.data || [];
          _this8.expandedProducts = {};
          _this8.showReviewModal = true;
        } else {
          _this8.showError(res.data.message);
        }
      })["catch"](function () {
        _this8.reviewLoading = false;
        _this8.showError(__('an_error_occurred_during_slip_creation'));
      });
    },
    confirmGenerate: function confirmGenerate() {
      this.showReviewModal = false;
      this.createLoadingSlip(false);
    },
    // Drop an order right from the review modal instead of forcing cancel ->
    // untick checkbox -> reopen. selectedOrderIds is the same array the order
    // checkboxes v-model against, so this also unticks it there for free, and
    // calculateWeightSum() keeps the weight bar / "orders selected" badge in sync.
    removeOrderFromReview: function removeOrderFromReview(orderId) {
      this.reviewSummary = this.reviewSummary.filter(function (o) {
        return o.order_id !== orderId;
      });
      this.selectedOrderIds = this.selectedOrderIds.filter(function (id) {
        return id !== orderId;
      });
      this.calculateWeightSum();
    },
    toggleProductExpand: function toggleProductExpand(key) {
      this.$set(this.expandedProducts, key, !this.expandedProducts[key]);
    },
    createLoadingSlip: function createLoadingSlip() {
      var _this9 = this;
      var confirmStock = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.loading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.apiBase + '/loading_slips/save', {
        vehicle_id: this.selectedVehicleId,
        driver_id: this.selectedDriverId,
        order_ids: this.selectedOrderIds,
        confirm_stock_shortage: confirmStock === true
      }).then(function (res) {
        _this9.loading = false;
        if (res.data.status === 1) {
          _this9.showSuccess(__('loading_slip_generated_and_route_optimized_successfully'));
          _this9.$router.push(_this9.urlPrefix + '/loading_slips');
        } else if (res.data.status === 2) {
          var shortageListHtml = '<div class="text-left mt-2" style="max-height: 200px; overflow-y: auto; font-size: 14px;"><ul class="list-group list-group-flush">';
          res.data.shortages.forEach(function (item) {
            shortageListHtml += "<li class=\"list-group-item px-0 py-1 text-danger\">\n                            <strong>".concat(item.name, "</strong><br>\n                            <span class=\"text-muted small\">Required: <b>").concat(item.required, "</b> | Available: <b>").concat(item.available, "</b></span>\n                        </li>");
          });
          shortageListHtml += '</ul></div>';
          _this9.$swal.fire({
            title: 'Stock Shortage Warning!',
            html: "<p class=\"mb-2\">The following items have insufficient database stock:</p>".concat(shortageListHtml, "<p class=\"mt-3\">Are you sure you want to proceed and generate the loading slip?</p>"),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Proceed',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#37a279',
            cancelButtonColor: '#d33'
          }).then(function (result) {
            if (result.value) {
              _this9.createLoadingSlip(true);
            }
          });
        } else {
          _this9.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this9.loading = false;
        _this9.showError(__('an_error_occurred_during_slip_creation'));
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.bg-soft-primary[data-v-54652c95] {\n    background-color: rgba(78, 115, 223, 0.1) !important;\n    color: #4e73df !important;\n}\n.bg-soft-warning[data-v-54652c95] {\n    background-color: rgba(246, 194, 62, 0.1) !important;\n    color: #f6c23e !important;\n}\n.max-w-200[data-v-54652c95] {\n    max-width: 200px;\n}\n.max-w-250[data-v-54652c95] {\n    max-width: 250px;\n}\n.transition-all[data-v-54652c95] {\n    transition: all 0.25s ease-in-out;\n}\n.cursor-pointer[data-v-54652c95] {\n    cursor: pointer;\n}\n.gap-2[data-v-54652c95] {\n    gap: 0.5rem;\n}\n.text-xs[data-v-54652c95] {\n    font-size: 0.75rem;\n}\n.position-sticky[data-v-54652c95] {\n    position: sticky;\n}\n.review-orders-scroll[data-v-54652c95] {\n    max-height: 60vh;\n    overflow-y: auto;\n    padding-right: 4px;\n    margin-bottom: 1rem;\n}\n.review-order-card[data-v-54652c95] {\n    border: 1px solid var(--app-card-border, #e6eaf2);\n    border-radius: 0.6rem;\n    overflow: hidden;\n    background-color: var(--app-card-bg, #fff);\n    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);\n    margin-bottom: 1.25rem;\n}\n.review-order-card[data-v-54652c95]:last-child {\n    margin-bottom: 0;\n}\n.review-order-header[data-v-54652c95] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    gap: 10px;\n    padding: 0.6rem 1rem;\n    background-color: var(--app-thead-bg, #f7f9fc);\n    border-bottom: 1px solid var(--app-border, #e9edf5);\n}\n.review-product-header[data-v-54652c95] {\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n            user-select: none;\n}\n.review-product-header[data-v-54652c95]:hover {\n    background-color: var(--app-hover, #f0f2f7);\n}\n.review-order-number[data-v-54652c95] {\n    font-size: 0.875rem;\n    font-weight: 700;\n    color: var(--app-ink, #0f172a);\n}\n.review-order-code[data-v-54652c95] {\n    font-size: 0.75rem;\n    font-weight: 400;\n    color: var(--app-muted, #64748b);\n    margin-left: 4px;\n}\n.review-order-retailer[data-v-54652c95] {\n    font-size: 0.75rem;\n    font-weight: 500;\n}\n.review-order-remove-btn[data-v-54652c95] {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 22px;\n    height: 22px;\n    padding: 0;\n    border: none;\n    border-radius: 50%;\n    background-color: transparent;\n    color: var(--app-muted, #94a3b8);\n    font-size: 0.75rem;\n    line-height: 1;\n    transition: background-color 0.15s ease, color 0.15s ease;\n}\n.review-order-remove-btn[data-v-54652c95]:hover {\n    background-color: rgba(231, 74, 59, 0.12);\n    color: #e74a3b;\n}\n.review-order-table thead th[data-v-54652c95] {\n    background-color: rgba(0, 0, 0, 0.015);\n    font-size: 0.7rem;\n    font-weight: 700;\n    text-transform: uppercase;\n    letter-spacing: 0.04em;\n    color: var(--app-muted, #64748b);\n    border-top: none;\n    padding: 0.6rem 1rem;\n}\n.review-order-table td[data-v-54652c95] {\n    padding: 0.6rem 1rem;\n    font-size: 0.875rem;\n    color: var(--app-ink, #0f172a);\n    border-color: var(--app-border, #e9edf5);\n}\n.review-order-table tbody tr:last-child td[data-v-54652c95] {\n    border-bottom: none;\n}\n.page-head-icon[data-v-54652c95] {\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    width: 40px;\n    height: 40px;\n    margin-right: 12px;\n    border-radius: 0.6rem;\n    background-color: rgba(78, 115, 223, 0.1);\n    color: #4e73df;\n    font-size: 1.05rem;\n    flex-shrink: 0;\n}\n\n/* Header: edge-to-edge bar sitting above a distinct, softly-tinted canvas —\n   this page's root has no padding of its own so the bar can span full width;\n   the canvas below carries the padding + background instead. */\n.cls-page[data-v-54652c95] {\n    min-height: 100%;\n}\n.cls-header-bar[data-v-54652c95] {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    flex-wrap: wrap;\n    gap: 16px;\n    background-color: var(--app-card-bg, #fff);\n    border-bottom: 1px solid var(--app-border, #e9edf5);\n    padding: 1.25rem 2rem;\n}\n.cls-header-left[data-v-54652c95] {\n    display: flex;\n    align-items: center;\n}\n.cls-header-title[data-v-54652c95] {\n    margin: 0;\n    font-size: 1.25rem;\n    font-weight: 700;\n    color: var(--app-ink, #0f172a);\n    line-height: 1.3;\n}\n.cls-header-subtitle[data-v-54652c95] {\n    margin: 0.25rem 0 0;\n    font-size: 0.75rem;\n    font-weight: 400;\n    letter-spacing: 0.02em;\n    color: var(--app-muted, #64748b);\n}\n.cls-header-actions[data-v-54652c95] {\n    display: flex;\n    align-items: center;\n    flex-shrink: 0;\n}\n.cls-back-btn[data-v-54652c95] {\n    display: inline-flex;\n    align-items: center;\n    gap: 8px;\n    padding: 0.5rem 1rem;\n    border: 1px solid var(--app-control-border, #cbd5e1);\n    border-radius: 0.5rem;\n    background-color: var(--app-surface, #fff);\n    color: var(--app-muted, #475569);\n    font-weight: 500;\n    font-size: 0.875rem;\n    text-decoration: none;\n    transition: background-color 0.15s ease, color 0.15s ease;\n}\n.cls-back-btn[data-v-54652c95]:hover {\n    background-color: var(--app-hover, #f8fafc);\n    color: var(--app-ink, #0f172a);\n    text-decoration: none;\n}\n.cls-canvas[data-v-54652c95] {\n    background-color: var(--app-thead-bg, #f7f9fc);\n    padding: 1.5rem 2rem 2rem;\n    min-height: 70vh;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.product-filter-select2 .select2-container {\n    flex: 1;\n}\n.product-filter-select2 .select2-container--default .select2-selection--multiple {\n    background-color: #fff;\n    border: 1px solid #dce7f1;\n    border-radius: 0.4rem;\n    min-height: 38px;\n    padding: 0.1rem 0.25rem;\n}\n.product-filter-select2 .select2-container--default.select2-container--focus .select2-selection--multiple,\n.product-filter-select2 .select2-container--default.select2-container--open .select2-selection--multiple {\n    border-color: #a7ebcb;\n    box-shadow: 0 0 0 0.25rem rgba(86, 199, 146, 0.25);\n}\n.product-filter-select2 .select2-selection__choice {\n    background-color: rgba(78, 115, 223, 0.1) !important;\n    border: none !important;\n    border-radius: 0.3rem !important;\n    color: #4e73df !important;\n    font-weight: 600;\n    padding: 2px 8px !important;\n}\n.product-filter-select2 .select2-selection__choice__remove {\n    color: #4e73df !important;\n    margin-right: 4px !important;\n}\n.product-filter-select2 .select2-search--inline .select2-search__field {\n    margin-top: 4px;\n}\n", ""]);
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

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_1_id_54652c95_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_1_id_54652c95_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_1_id_54652c95_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

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
/* harmony import */ var _CreateLoadingSlip_vue_vue_type_style_index_1_id_54652c95_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css */ "./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
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

/***/ "./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css":
/*!********************************************************************************************************!*\
  !*** ./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_1_id_54652c95_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Logistics/CreateLoadingSlip.vue?vue&type=style&index=1&id=54652c95&lang=css");


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
  return _c("div", { staticClass: "cls-page" }, [
    _c("div", { staticClass: "cls-header-bar" }, [
      _c("div", { staticClass: "cls-header-left" }, [
        _vm._m(0),
        _vm._v(" "),
        _c("div", [
          _c("h1", { staticClass: "cls-header-title" }, [
            _vm._v(_vm._s(_vm.__("create_loading_slip"))),
          ]),
          _vm._v(" "),
          _c("p", { staticClass: "cls-header-subtitle" }, [
            _vm._v(
              _vm._s(
                _vm.__(
                  "select_delivery_zone_assign_driver_and_vehicle_and_optimize_the_delivery_routing"
                )
              )
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "cls-header-actions" },
        [
          _c(
            "router-link",
            {
              staticClass: "cls-back-btn",
              attrs: { to: _vm.urlPrefix + "/loading_slips" },
            },
            [
              _c("i", { staticClass: "fa fa-arrow-left" }),
              _vm._v(" " + _vm._s(_vm.__("back_to_slips")) + "\n            "),
            ]
          ),
        ],
        1
      ),
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "cls-canvas" },
      [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-lg-8 mb-4" }, [
            _c(
              "div",
              { staticClass: "card border-0 shadow-sm rounded-lg h-100" },
              [
                _c("div", { staticClass: "card-header border-0 py-3" }, [
                  _c("h6", { staticClass: "m-0 mb-3 font-weight-bold" }, [
                    _vm._v(_vm._s(_vm.__("unassigned_doorstep_orders"))),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass: "d-flex align-items-center flex-wrap gap-3",
                    },
                    [
                      _c("div", { staticClass: "d-flex align-items-center" }, [
                        _c(
                          "label",
                          {
                            staticClass:
                              "mb-0 text-muted font-weight-bold mr-2 text-nowrap",
                          },
                          [_vm._v(_vm._s(_vm.__("filter_by_area")) + ":")]
                        ),
                        _vm._v(" "),
                        _c(
                          "select",
                          {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.selectedArea,
                                expression: "selectedArea",
                              },
                            ],
                            staticClass:
                              "form-control form-select border shadow-none max-w-200",
                            on: {
                              change: [
                                function ($event) {
                                  var $$selectedVal = Array.prototype.filter
                                    .call($event.target.options, function (o) {
                                      return o.selected
                                    })
                                    .map(function (o) {
                                      var val =
                                        "_value" in o ? o._value : o.value
                                      return val
                                    })
                                  _vm.selectedArea = $event.target.multiple
                                    ? $$selectedVal
                                    : $$selectedVal[0]
                                },
                                _vm.getOrders,
                              ],
                            },
                          },
                          [
                            _c("option", { attrs: { value: "" } }, [
                              _vm._v(_vm._s(_vm.__("all_areas"))),
                            ]),
                            _vm._v(" "),
                            _vm._l(_vm.areas, function (area) {
                              return _c(
                                "option",
                                { key: area.id, domProps: { value: area.id } },
                                [_vm._v(_vm._s(area.name))]
                              )
                            }),
                          ],
                          2
                        ),
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "d-flex align-items-center" }, [
                        _c(
                          "label",
                          {
                            staticClass:
                              "mb-0 text-muted font-weight-bold mr-2 text-nowrap",
                          },
                          [_vm._v("Rescheduled:")]
                        ),
                        _vm._v(" "),
                        _c(
                          "select",
                          {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.selectedRescheduled,
                                expression: "selectedRescheduled",
                              },
                            ],
                            staticClass:
                              "form-control form-select border shadow-none max-w-200",
                            on: {
                              change: [
                                function ($event) {
                                  var $$selectedVal = Array.prototype.filter
                                    .call($event.target.options, function (o) {
                                      return o.selected
                                    })
                                    .map(function (o) {
                                      var val =
                                        "_value" in o ? o._value : o.value
                                      return val
                                    })
                                  _vm.selectedRescheduled = $event.target
                                    .multiple
                                    ? $$selectedVal
                                    : $$selectedVal[0]
                                },
                                _vm.getOrders,
                              ],
                            },
                          },
                          [
                            _c("option", { attrs: { value: "" } }, [
                              _vm._v("All Orders"),
                            ]),
                            _vm._v(" "),
                            _c("option", { attrs: { value: "1" } }, [
                              _vm._v("Rescheduled Only"),
                            ]),
                            _vm._v(" "),
                            _c("option", { attrs: { value: "0" } }, [
                              _vm._v("Regular Only"),
                            ]),
                          ]
                        ),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "d-flex align-items-center flex-grow-1 product-filter-select2",
                          staticStyle: { "min-width": "260px" },
                        },
                        [
                          _c(
                            "label",
                            {
                              staticClass:
                                "mb-0 text-muted font-weight-bold mr-2 text-nowrap",
                            },
                            [_vm._v(_vm._s(_vm.__("Filter by Product")) + ":")]
                          ),
                          _vm._v(" "),
                          _c("Select2", {
                            staticStyle: { flex: "1" },
                            attrs: {
                              options: _vm.productOptions,
                              placeholder: "Search and select products...",
                              settings: { multiple: "multiple", width: "100%" },
                            },
                            model: {
                              value: _vm.selectedProductIds,
                              callback: function ($$v) {
                                _vm.selectedProductIds = $$v
                              },
                              expression: "selectedProductIds",
                            },
                          }),
                        ],
                        1
                      ),
                    ]
                  ),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "card-body p-0" }, [
                  _c(
                    "div",
                    {
                      staticClass: "overflow-auto",
                      staticStyle: { "max-height": "520px" },
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
                                    staticClass: "py-3 pl-4",
                                    staticStyle: { width: "50px" },
                                  },
                                  [
                                    _c(
                                      "div",
                                      { staticClass: "form-check mb-0" },
                                      [
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
                                            checked: Array.isArray(
                                              _vm.selectAll
                                            )
                                              ? _vm._i(_vm.selectAll, null) > -1
                                              : _vm.selectAll,
                                          },
                                          on: {
                                            change: [
                                              function ($event) {
                                                var $$a = _vm.selectAll,
                                                  $$el = $event.target,
                                                  $$c = $$el.checked
                                                    ? true
                                                    : false
                                                if (Array.isArray($$a)) {
                                                  var $$v = null,
                                                    $$i = _vm._i($$a, $$v)
                                                  if ($$el.checked) {
                                                    $$i < 0 &&
                                                      (_vm.selectAll =
                                                        $$a.concat([$$v]))
                                                  } else {
                                                    $$i > -1 &&
                                                      (_vm.selectAll = $$a
                                                        .slice(0, $$i)
                                                        .concat(
                                                          $$a.slice($$i + 1)
                                                        ))
                                                  }
                                                } else {
                                                  _vm.selectAll = $$c
                                                }
                                              },
                                              _vm.toggleSelectAll,
                                            ],
                                          },
                                        }),
                                      ]
                                    ),
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "th",
                                  {
                                    staticClass:
                                      "py-3 font-weight-bold text-muted",
                                  },
                                  [_vm._v(_vm._s(_vm.__("order_id")))]
                                ),
                                _vm._v(" "),
                                _c(
                                  "th",
                                  {
                                    staticClass:
                                      "py-3 font-weight-bold text-muted",
                                  },
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
                                      "py-3 font-weight-bold text-muted text-center",
                                  },
                                  [_vm._v(_vm._s(_vm.__("area")))]
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
                                      staticClass:
                                        "transition-all cursor-pointer align-middle",
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
                                          staticClass: "py-3 pl-4",
                                          on: {
                                            click: function ($event) {
                                              $event.stopPropagation()
                                            },
                                          },
                                        },
                                        [
                                          _c(
                                            "div",
                                            { staticClass: "form-check mb-0" },
                                            [
                                              _c("input", {
                                                directives: [
                                                  {
                                                    name: "model",
                                                    rawName: "v-model",
                                                    value: _vm.selectedOrderIds,
                                                    expression:
                                                      "selectedOrderIds",
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
                                                      var $$a =
                                                          _vm.selectedOrderIds,
                                                        $$el = $event.target,
                                                        $$c = $$el.checked
                                                          ? true
                                                          : false
                                                      if (Array.isArray($$a)) {
                                                        var $$v = order.id,
                                                          $$i = _vm._i($$a, $$v)
                                                        if ($$el.checked) {
                                                          $$i < 0 &&
                                                            (_vm.selectedOrderIds =
                                                              $$a.concat([$$v]))
                                                        } else {
                                                          $$i > -1 &&
                                                            (_vm.selectedOrderIds =
                                                              $$a
                                                                .slice(0, $$i)
                                                                .concat(
                                                                  $$a.slice(
                                                                    $$i + 1
                                                                  )
                                                                ))
                                                        }
                                                      } else {
                                                        _vm.selectedOrderIds =
                                                          $$c
                                                      }
                                                    },
                                                    _vm.calculateWeightSum,
                                                  ],
                                                },
                                              }),
                                            ]
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "td",
                                        { staticClass: "font-weight-bold" },
                                        [_vm._v("#" + _vm._s(order.id))]
                                      ),
                                      _vm._v(" "),
                                      _c("td", [
                                        _c(
                                          "div",
                                          { staticClass: "d-flex flex-column" },
                                          [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "d-flex align-items-center mb-0",
                                              },
                                              [
                                                _c(
                                                  "span",
                                                  {
                                                    staticClass:
                                                      "font-weight-bold mr-2",
                                                  },
                                                  [
                                                    _vm._v(
                                                      _vm._s(order.user_name)
                                                    ),
                                                  ]
                                                ),
                                                _vm._v(" "),
                                                order.is_rescheduled
                                                  ? _c(
                                                      "span",
                                                      {
                                                        staticClass:
                                                          "badge bg-soft-warning text-warning font-weight-bold",
                                                      },
                                                      [_vm._v("Rescheduled")]
                                                    )
                                                  : _vm._e(),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "small",
                                              {
                                                staticClass:
                                                  "text-muted text-truncate d-block max-w-250",
                                              },
                                              [_vm._v(_vm._s(order.address))]
                                            ),
                                          ]
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
                                      _c("td", { staticClass: "text-center" }, [
                                        order.area_name
                                          ? _c(
                                              "span",
                                              {
                                                staticClass:
                                                  "badge bg-soft-warning font-weight-bold",
                                              },
                                              [_vm._v(_vm._s(order.area_name))]
                                            )
                                          : _c(
                                              "span",
                                              {
                                                staticClass: "text-muted small",
                                              },
                                              [_vm._v("-")]
                                            ),
                                      ]),
                                      _vm._v(" "),
                                      _c(
                                        "td",
                                        {
                                          staticClass:
                                            "text-right font-weight-bold",
                                        },
                                        [
                                          _vm._v(
                                            "₹" + _vm._s(order.final_total)
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "td",
                                        {
                                          staticClass:
                                            "text-right font-weight-bold",
                                        },
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
                                          staticClass:
                                            "text-center py-5 text-muted",
                                          attrs: { colspan: "7" },
                                        },
                                        [
                                          _c("i", {
                                            staticClass:
                                              "fa fa-check-circle fa-2x mb-3 text-success",
                                          }),
                                          _vm._v(" "),
                                          _c(
                                            "p",
                                            {
                                              staticClass:
                                                "mb-0 font-weight-bold",
                                            },
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
                  _vm._v(" "),
                  _c(
                    "div",
                    {
                      staticClass:
                        "px-4 py-3 bg-white border-top d-flex justify-content-between font-weight-bold text-success",
                    },
                    [
                      _c("div", [
                        _c("span", [
                          _vm._v(
                            _vm._s(_vm.__("total_weight")) +
                              " :- " +
                              _vm._s(_vm.totalFilteredWeight) +
                              " " +
                              _vm._s(_vm.__("kg"))
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("div", [
                        _c("span", [
                          _vm._v(
                            _vm._s(_vm.__("orders")) +
                              " :- " +
                              _vm._s(_vm.orders.length)
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c("div", [
                        _c("span", [
                          _vm._v(
                            _vm._s(_vm.__("total_value")) +
                              " :- ₹" +
                              _vm._s(_vm.totalFilteredValue)
                          ),
                        ]),
                      ]),
                    ]
                  ),
                ]),
              ]
            ),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-lg-4 mb-4" }, [
            _c(
              "div",
              {
                staticClass:
                  "card border-0 shadow-sm rounded-lg position-sticky",
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
                          return _vm.openReviewModal.apply(null, arguments)
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
                            _vm._v(
                              _vm._s(_vm.__("select_delivery_vehicle")) + " "
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
                                      var val =
                                        "_value" in o ? o._value : o.value
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
                                  staticClass:
                                    "text-center py-2 text-muted small",
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
                                      _vm._v(
                                        _vm._s(_vm.__("current_load_weight"))
                                      ),
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
                                            _vm._s(
                                              _vm.selectedOrderIds.length
                                            ) +
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
                                _vm._v(
                                  _vm._s(_vm.__("vehicle_overloaded")) + "!"
                                ),
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
                            disabled: _vm.reviewLoading,
                          },
                        },
                        [
                          _vm.reviewLoading
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
        _vm._v(" "),
        _c(
          "b-modal",
          {
            attrs: {
              title: _vm.__("Review Before Generating Slip"),
              size: "lg",
              "hide-footer": "",
              "no-close-on-backdrop": "",
            },
            model: {
              value: _vm.showReviewModal,
              callback: function ($$v) {
                _vm.showReviewModal = $$v
              },
              expression: "showReviewModal",
            },
          },
          [
            _c("p", { staticClass: "text-muted small mb-3" }, [
              _vm._v(
                _vm._s(
                  _vm.__(
                    "Verify you have enough physical stock for each product below. Click a product to see and adjust the orders behind it."
                  )
                )
              ),
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "review-orders-scroll" },
              [
                _vm._l(_vm.productGroupedSummary, function (product) {
                  return _c(
                    "div",
                    { key: product.key, staticClass: "review-order-card" },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "review-order-header review-product-header",
                          on: {
                            click: function ($event) {
                              return _vm.toggleProductExpand(product.key)
                            },
                          },
                        },
                        [
                          _c(
                            "span",
                            {
                              staticClass: "d-flex align-items-center",
                              staticStyle: { gap: "8px" },
                            },
                            [
                              _c("i", {
                                staticClass: "fa",
                                class: _vm.expandedProducts[product.key]
                                  ? "fa-chevron-down"
                                  : "fa-chevron-right",
                              }),
                              _vm._v(" "),
                              _c(
                                "span",
                                { staticClass: "review-order-number" },
                                [_vm._v(_vm._s(product.name))]
                              ),
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "span",
                            {
                              staticClass: "d-flex align-items-center",
                              staticStyle: { gap: "12px" },
                            },
                            [
                              _c("span", { staticClass: "text-muted small" }, [
                                _vm._v(
                                  _vm._s(product.orders.length) +
                                    " " +
                                    _vm._s(_vm.__("orders"))
                                ),
                              ]),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "badge bg-soft-primary review-order-retailer",
                                },
                                [
                                  product.boxes !== null
                                    ? [
                                        _vm._v(
                                          "\n                                " +
                                            _vm._s(product.boxes) +
                                            " " +
                                            _vm._s(product.boxUnit)
                                        ),
                                        product.loose
                                          ? [
                                              _vm._v(
                                                " + " +
                                                  _vm._s(product.loose) +
                                                  " " +
                                                  _vm._s(product.pieceUnit)
                                              ),
                                            ]
                                          : _vm._e(),
                                      ]
                                    : [_vm._v(_vm._s(product.totalQty))],
                                ],
                                2
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "b-collapse",
                        {
                          attrs: {
                            visible: !!_vm.expandedProducts[product.key],
                          },
                        },
                        [
                          _c("div", { staticClass: "table-responsive" }, [
                            _c(
                              "table",
                              {
                                staticClass:
                                  "table table-sm review-order-table mb-0",
                              },
                              [
                                _c("thead", [
                                  _c("tr", [
                                    _c("th", [
                                      _vm._v(_vm._s(_vm.__("order")) + " #"),
                                    ]),
                                    _vm._v(" "),
                                    _c("th", [
                                      _vm._v(_vm._s(_vm.__("retailer"))),
                                    ]),
                                    _vm._v(" "),
                                    _c("th", { staticClass: "text-end" }, [
                                      _vm._v(_vm._s(_vm.__("Qty"))),
                                    ]),
                                    _vm._v(" "),
                                    _c("th", { staticClass: "text-end" }, [
                                      _vm._v(
                                        _vm._s(
                                          product.boxUnit || _vm.__("Boxes")
                                        )
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("th", { staticClass: "text-end" }, [
                                      _vm._v(
                                        _vm._s(
                                          product.pieceUnit ||
                                            _vm.__("Loose Pieces")
                                        )
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("th", {
                                      staticClass: "text-center",
                                      staticStyle: { width: "50px" },
                                    }),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c(
                                  "tbody",
                                  _vm._l(product.orders, function (o) {
                                    return _c("tr", { key: o.orderId }, [
                                      _c("td", [
                                        _vm._v("#" + _vm._s(o.orderId) + " "),
                                        _c(
                                          "span",
                                          { staticClass: "text-muted small" },
                                          [
                                            _vm._v(
                                              "(" + _vm._s(o.ordersId) + ")"
                                            ),
                                          ]
                                        ),
                                      ]),
                                      _vm._v(" "),
                                      _c("td", [
                                        _vm._v(_vm._s(o.retailerName)),
                                      ]),
                                      _vm._v(" "),
                                      _c("td", { staticClass: "text-end" }, [
                                        _vm._v(_vm._s(o.qty)),
                                      ]),
                                      _vm._v(" "),
                                      _c("td", { staticClass: "text-end" }, [
                                        o.boxes
                                          ? _c("span", [
                                              _vm._v(
                                                _vm._s(o.boxes) +
                                                  " " +
                                                  _vm._s(product.boxUnit)
                                              ),
                                            ])
                                          : _c(
                                              "span",
                                              { staticClass: "text-muted" },
                                              [_vm._v("—")]
                                            ),
                                      ]),
                                      _vm._v(" "),
                                      _c("td", { staticClass: "text-end" }, [
                                        o.loose
                                          ? _c("span", [
                                              _vm._v(
                                                _vm._s(o.loose) +
                                                  " " +
                                                  _vm._s(product.pieceUnit)
                                              ),
                                            ])
                                          : _c(
                                              "span",
                                              { staticClass: "text-muted" },
                                              [_vm._v("—")]
                                            ),
                                      ]),
                                      _vm._v(" "),
                                      _c("td", { staticClass: "text-center" }, [
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
                                            staticClass:
                                              "review-order-remove-btn",
                                            attrs: {
                                              type: "button",
                                              title: _vm.__(
                                                "Remove this order from the slip"
                                              ),
                                            },
                                            on: {
                                              click: function ($event) {
                                                return _vm.removeOrderFromReview(
                                                  o.orderId
                                                )
                                              },
                                            },
                                          },
                                          [
                                            _c("i", {
                                              staticClass: "fa fa-times",
                                            }),
                                          ]
                                        ),
                                      ]),
                                    ])
                                  }),
                                  0
                                ),
                              ]
                            ),
                          ]),
                        ]
                      ),
                    ],
                    1
                  )
                }),
                _vm._v(" "),
                _vm.productGroupedSummary.length === 0
                  ? _c("div", { staticClass: "text-center text-muted py-3" }, [
                      _vm._v(_vm._s(_vm.__("no_data_found"))),
                    ])
                  : _vm._e(),
              ],
              2
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "d-flex justify-content-end gap-2" },
              [
                _c(
                  "b-button",
                  {
                    staticClass: "rounded-pill",
                    attrs: { variant: "outline-secondary" },
                    on: {
                      click: function ($event) {
                        _vm.showReviewModal = false
                      },
                    },
                  },
                  [_vm._v(_vm._s(_vm.__("cancel")))]
                ),
                _vm._v(" "),
                _c(
                  "b-button",
                  {
                    staticClass: "rounded-pill font-weight-bold",
                    attrs: {
                      variant: "primary",
                      disabled: _vm.loading || _vm.reviewSummary.length === 0,
                    },
                    on: { click: _vm.confirmGenerate },
                  },
                  [
                    _vm.loading
                      ? _c("b-spinner", {
                          staticClass: "mr-2",
                          attrs: { small: "" },
                        })
                      : _c("i", { staticClass: "fa fa-check-circle mr-2" }),
                    _vm._v(
                      _vm._s(_vm.__("Confirm & Generate Slip")) +
                        "\n            "
                    ),
                  ],
                  1
                ),
              ],
              1
            ),
          ]
        ),
      ],
      1
    ),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "page-head-icon" }, [
      _c("i", { staticClass: "fa fa-clipboard" }),
    ])
  },
]
render._withStripped = true



/***/ })

}]);