"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_CreateLoadingSlip_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var v_select2_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! v-select2-component */ "./node_modules/v-select2-component/dist/Select2.esm.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
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
//
//
//
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
  name: 'SellerCreateLoadingSlip',
  components: {
    Select2: v_select2_component__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      orders: [],
      // every order loaded so far, by id — the ticked orders stay counted (weight, value) while a filter hides them
      knownOrders: {},
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
    // ticked orders the current filters are not listing — still part of the slip
    hiddenSelectedCount: function hiddenSelectedCount() {
      var listed = new Set(this.orders.map(function (o) {
        return o.id;
      }));
      return this.selectedOrderIds.filter(function (id) {
        return !listed.has(id);
      }).length;
    },
    barClass: function barClass() {
      if (this.loadPercent > 100) return 'bg-danger';
      if (this.loadPercent > 85) return 'bg-warning';
      return 'bg-success';
    },
    // ---- display-only helpers for the redesigned planner ----
    loadTone: function loadTone() {
      if (this.loadPercent > 100) return 'red';
      if (this.loadPercent > 85) return 'amber';
      return 'green';
    },
    // the bar itself never grows past its track (loadPercent can reach 120)
    gaugeWidth: function gaugeWidth() {
      return Math.min(this.loadPercent, 100);
    },
    // kg still free on the chosen vehicle; negative = overloaded
    loadRemaining: function loadRemaining() {
      if (!this.selectedVehicle) return 0;
      return parseFloat((parseFloat(this.selectedVehicle.capacity || 0) - this.totalSelectedWeight).toFixed(2));
    },
    selectedValue: function selectedValue() {
      var _this = this;
      var sum = this.selectedOrderIds.reduce(function (acc, id) {
        return acc + parseFloat((_this.knownOrders[id] || {}).final_total || 0);
      }, 0);
      return sum.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    // purely informational: what is still missing before a slip can be generated
    plannerHint: function plannerHint() {
      if (!this.selectedVehicleId) return this.__('Choose a vehicle to continue');
      if (!this.selectedDriverId) return this.__('Choose a driver to continue');
      if (!this.selectedOrderIds.length) return this.__('Select at least one order to load');
      return '';
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
      this.refreshAreasAndOrders();
    }
  },
  methods: {
    getProductOptions: function getProductOptions() {
      var _this2 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/products').then(function (res) {
        if (res.data.status === 1) {
          _this2.productOptions = res.data.data || [];
        }
      });
    },
    // Only areas that have orders left to load under the Rescheduled / Product filters. Returns the
    // request so callers can reload the orders once the options (and a possibly dropped area) are settled.
    getAreas: function getAreas() {
      var _this3 = this;
      var params = {};
      if (this.selectedRescheduled !== '') params.is_rescheduled = this.selectedRescheduled;
      if (this.selectedProductIds.length) params.product_ids = this.selectedProductIds;
      return axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/areas', {
        params: params
      }).then(function (res) {
        if (res.data.status === 1) {
          _this3.areas = res.data.data || [];
          // the chosen area may have no orders under the new filters — fall back to all areas
          if (_this3.selectedArea && !_this3.areas.some(function (a) {
            return a.id == _this3.selectedArea;
          })) {
            _this3.selectedArea = '';
          }
        }
      })["catch"](function () {});
    },
    refreshAreasAndOrders: function refreshAreasAndOrders() {
      var _this4 = this;
      this.getAreas().then(function () {
        return _this4.getOrders();
      });
    },
    getVehicles: function getVehicles() {
      var _this5 = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/vehicles/active').then(function (res) {
        if (res.data.status === 1) {
          _this5.vehicles = res.data.data;
          // a single vehicle leaves nothing to choose, so it is picked for you
          // (never overrides something already selected)
          if (_this5.vehicles.length === 1 && !_this5.selectedVehicleId) {
            _this5.selectedVehicleId = _this5.vehicles[0].id;
            _this5.updateVehicleCapacity();
          }
        }
      });
    },
    getDrivers: function getDrivers() {
      var _this6 = this;
      // Eager load delivery boys that are active
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/delivery_boys', {
        params: {
          status: 1
        }
      }).then(function (res) {
        if (res.data.status === 1) {
          _this6.drivers = res.data.data.data || res.data.data;
          // same for a single driver
          if (_this6.drivers.length === 1 && !_this6.selectedDriverId) {
            _this6.selectedDriverId = _this6.drivers[0].id;
          }
        }
      });
    },
    getOrders: function getOrders() {
      var _this7 = this;
      var params = {};
      if (this.selectedArea) params.area_id = this.selectedArea;
      if (this.selectedRescheduled !== '') params.is_rescheduled = this.selectedRescheduled;
      if (this.selectedProductIds.length) params.product_ids = this.selectedProductIds;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.apiBase + '/loading_slips/orders', {
        params: params
      }).then(function (res) {
        if (res.data.status === 1) {
          _this7.orders = res.data.data;
          var known = _objectSpread({}, _this7.knownOrders);
          _this7.orders.forEach(function (o) {
            known[o.id] = o;
          });
          _this7.knownOrders = known;
          // ticked orders are kept across filter changes (area, rescheduled, products) — only the
          // list on screen changes, so orders picked under another filter are not lost
          _this7.calculateWeightSum();
        }
      });
    },
    updateVehicleCapacity: function updateVehicleCapacity() {
      var _this8 = this;
      this.selectedVehicle = this.vehicles.find(function (v) {
        return v.id == _this8.selectedVehicleId;
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
      // acts on the orders listed now; ticks made under another filter stay as they are
      var visibleIds = this.orders.map(function (o) {
        return o.id;
      });
      if (this.selectAll) {
        this.selectedOrderIds = _toConsumableArray(new Set([].concat(_toConsumableArray(this.selectedOrderIds), _toConsumableArray(visibleIds))));
      } else {
        this.selectedOrderIds = this.selectedOrderIds.filter(function (id) {
          return !visibleIds.includes(id);
        });
      }
      this.calculateWeightSum();
    },
    calculateWeightSum: function calculateWeightSum() {
      var _this9 = this,
        _this$selectedVehicle;
      var sum = this.selectedOrderIds.reduce(function (acc, id) {
        return acc + parseFloat((_this9.knownOrders[id] || {}).weight || 0);
      }, 0);
      this.totalSelectedWeight = parseFloat(sum.toFixed(2));
      // header checkbox = every listed order is ticked
      this.selectAll = this.orders.length > 0 && this.orders.every(function (o) {
        return _this9.selectedOrderIds.includes(o.id);
      });
      var capacity = parseFloat(((_this$selectedVehicle = this.selectedVehicle) === null || _this$selectedVehicle === void 0 ? void 0 : _this$selectedVehicle.capacity) || 0);
      if (this.selectedVehicle && capacity > 0) {
        this.loadPercent = Math.min(this.totalSelectedWeight / capacity * 100, 120);
      } else {
        this.loadPercent = 0;
      }
    },
    // Rescheduled filter as buttons: sets the same selectedRescheduled value ('' | '1' | '0') the old select did
    setRescheduled: function setRescheduled(value) {
      this.selectedRescheduled = value;
      this.refreshAreasAndOrders();
    },
    // whole amounts stay compact (4,000); fractional ones always show paise (8,336.30)
    formatMoney: function formatMoney(value) {
      var n = parseFloat(value);
      if (isNaN(n)) return '0';
      return n.toLocaleString('en-IN', {
        minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
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
    },
    formatZone: function formatZone(zone) {
      if (!zone) return 'All';
      return zone.charAt(0).toUpperCase() + zone.slice(1);
    },
    openReviewModal: function openReviewModal() {
      var _this10 = this;
      this.reviewLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.apiBase + '/loading_slips/order_items_summary', {
        order_ids: this.selectedOrderIds
      }).then(function (res) {
        _this10.reviewLoading = false;
        if (res.data.status === 1) {
          _this10.reviewSummary = res.data.data || [];
          _this10.expandedProducts = {};
          _this10.showReviewModal = true;
        } else {
          _this10.showError(res.data.message);
        }
      })["catch"](function () {
        _this10.reviewLoading = false;
        _this10.showError(__('an_error_occurred_during_slip_creation'));
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
      var _this11 = this;
      var confirmStock = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.loading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.apiBase + '/loading_slips/save', {
        vehicle_id: this.selectedVehicleId,
        driver_id: this.selectedDriverId,
        order_ids: this.selectedOrderIds,
        confirm_stock_shortage: confirmStock === true
      }).then(function (res) {
        _this11.loading = false;
        if (res.data.status === 1) {
          _this11.showSuccess(__('loading_slip_generated_and_route_optimized_successfully'));
          _this11.$router.push(_this11.urlPrefix + '/loading_slips');
        } else if (res.data.status === 2) {
          var shortageListHtml = '<div class="text-left mt-2" style="max-height: 200px; overflow-y: auto; font-size: 14px;"><ul class="list-group list-group-flush">';
          res.data.shortages.forEach(function (item) {
            shortageListHtml += "<li class=\"list-group-item px-0 py-1 text-danger\">\n                            <strong>".concat(item.name, "</strong><br>\n                            <span class=\"text-muted small\">Required: <b>").concat(item.required, "</b> | Available: <b>").concat(item.available, "</b></span>\n                        </li>");
          });
          shortageListHtml += '</ul></div>';
          _this11.$swal.fire({
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
              _this11.createLoadingSlip(true);
            }
          });
        } else {
          _this11.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this11.loading = false;
        _this11.showError(__('an_error_occurred_during_slip_creation'));
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css ***!
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
___CSS_LOADER_EXPORT___.push([module.id, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* All colours come from the --ui-* tokens that modern.css defines on .ui-modern (the seller layout),\n   so this page follows light/dark mode and the app palette automatically. */\n.clp[data-v-0f2eeed6] { padding: 24px; color: var(--ui-text); font-variant-numeric: tabular-nums;\n}\n.clp-muted[data-v-0f2eeed6] { color: var(--ui-muted);\n}\n.clp-num[data-v-0f2eeed6] { text-align: right; white-space: nowrap;\n}\n\n/* ---------- header ---------- */\n.clp-head[data-v-0f2eeed6] { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 16px; margin-bottom: 18px;\n}\n.clp-head__title[data-v-0f2eeed6] { display: flex; align-items: baseline; gap: 14px;\n}\n.clp-eyebrow[data-v-0f2eeed6] { padding-right: 14px; border-right: 1px solid var(--ui-border); font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ui-muted);\n}\n.clp .clp-head h1[data-v-0f2eeed6] { margin: 0; font-size: 28px; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: var(--ui-text);\n}\n.clp-back[data-v-0f2eeed6] {\n    display: inline-flex; align-items: center; gap: 8px; height: 42px; padding: 0 18px; border-radius: 12px;\n    border: 1px solid var(--ui-border); background: var(--ui-card); color: var(--ui-text); font-size: 14px; font-weight: 600; text-decoration: none !important;\n    box-shadow: var(--ui-shadow); transition: background-color 0.15s ease;\n}\n.clp-back[data-v-0f2eeed6]:hover { background: var(--ui-soft); color: var(--ui-text);\n}\n\n/* ---------- layout ---------- */\n.clp-grid[data-v-0f2eeed6] { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 20px; align-items: start;\n}\n.clp-card[data-v-0f2eeed6] { background: var(--ui-card); border: 1px solid var(--ui-border); border-radius: 18px; box-shadow: var(--ui-shadow);\n}\n.clp-orders[data-v-0f2eeed6] { overflow: hidden; container-type: inline-size; container-name: clporders;\n}\n.clp-planner[data-v-0f2eeed6] { position: sticky; top: 24px;\n}\n.clp-card__head[data-v-0f2eeed6] { padding: 18px 20px; border-bottom: 1px solid var(--ui-border);\n}\n.clp-card__head--plain[data-v-0f2eeed6] { border-bottom: 0; padding-bottom: 4px;\n}\n.clp-card__title[data-v-0f2eeed6] { display: flex; align-items: center; gap: 12px;\n}\n.clp .clp-card__title h2[data-v-0f2eeed6] { margin: 0; font-size: 17px; font-weight: 700; color: var(--ui-text);\n}\n.clp-tile[data-v-0f2eeed6] { width: 40px; height: 40px; border-radius: 12px; font-size: 17px;\n}\n\n/* ---------- filters ---------- */\n.clp-filters[data-v-0f2eeed6] { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 16px; margin-top: 14px;\n}\n.clp-field[data-v-0f2eeed6] { display: flex; flex-direction: column; gap: 5px; min-width: 0;\n}\n.clp-field--grow[data-v-0f2eeed6] { flex: 1 1 260px;\n}\n.clp-field--stack[data-v-0f2eeed6] { margin-bottom: 16px;\n}\n.clp-field__label[data-v-0f2eeed6] { margin: 0; font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ui-muted);\n}\n.clp-field__label em[data-v-0f2eeed6] { font-style: normal; color: var(--ui-red);\n}\n.clp-filters .clp-select[data-v-0f2eeed6] { width: 200px;\n}\n.clp-select[data-v-0f2eeed6] {\n    height: 42px; min-width: 160px; padding: 0 34px 0 14px; border-radius: 12px; border: 1px solid var(--ui-border);\n    background-color: var(--ui-soft); color: var(--ui-text); font-size: 14px; outline: none; cursor: pointer; max-width: 100%;\n}\n.clp-select--lg[data-v-0f2eeed6] { width: 100%; height: 46px;\n}\n.clp-select[data-v-0f2eeed6]:focus { border-color: var(--ui-primary); box-shadow: 0 0 0 3px var(--ui-primary-soft);\n}\n.clp-seg[data-v-0f2eeed6] { display: inline-flex; gap: 4px; padding: 4px; height: 42px; border-radius: 12px; background: var(--ui-slate-bg);\n}\n.clp .clp-seg__btn[data-v-0f2eeed6] { padding: 0 12px; border: 0; border-radius: 9px; background: transparent; color: var(--ui-muted); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; white-space: nowrap;\n}\n.clp-seg__btn[data-v-0f2eeed6]:hover { color: var(--ui-text);\n}\n.clp-seg__btn--on[data-v-0f2eeed6] { background: var(--ui-card); color: var(--ui-text); box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);\n}\n\n/* ---------- order table ---------- */\n.clp-scroll[data-v-0f2eeed6] { max-height: 540px; overflow: auto;\n}\n.clp-table td.clp-col-zone[data-v-0f2eeed6] { max-width: 220px;\n}\n.clp-table[data-v-0f2eeed6] { width: 100%; border-collapse: separate; border-spacing: 0;\n}\n.clp-table thead th[data-v-0f2eeed6] {\n    position: sticky; top: 0; z-index: 1; padding: 12px 16px; background: var(--ui-soft); color: var(--ui-muted); white-space: nowrap;\n    font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid var(--ui-border);\n}\n.clp-table tbody td[data-v-0f2eeed6] { padding: 12px 16px; vertical-align: middle; border-top: 1px solid var(--ui-border); font-size: 14px;\n}\n.clp-table tbody tr:first-child td[data-v-0f2eeed6] { border-top: 0;\n}\n.clp-th-check[data-v-0f2eeed6] { width: 48px; padding-right: 0 !important;\n}\n.clp-check[data-v-0f2eeed6] { width: 18px; height: 18px; cursor: pointer; accent-color: var(--ui-primary);\n}\n.clp-row[data-v-0f2eeed6] { cursor: pointer; transition: background-color 0.12s ease;\n}\n.clp-row:hover td[data-v-0f2eeed6] { background: var(--ui-soft);\n}\n.clp-row--on td[data-v-0f2eeed6] { background: var(--ui-primary-soft) !important;\n}\n.clp-id[data-v-0f2eeed6] { font-weight: 700; white-space: nowrap;\n}\n.clp-shop[data-v-0f2eeed6] { display: flex; align-items: center; gap: 12px; min-width: 220px;\n}\n.clp-shop__text[data-v-0f2eeed6] { display: flex; flex-direction: column; gap: 2px; min-width: 0;\n}\n.clp-shop__name[data-v-0f2eeed6] { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px;\n}\n.clp-shop__name strong[data-v-0f2eeed6] { font-size: 14px; font-weight: 700;\n}\n.clp-shop__addr[data-v-0f2eeed6] { max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; color: var(--ui-muted);\n}\n.clp-pills[data-v-0f2eeed6] { display: flex; flex-wrap: wrap; gap: 6px; max-width: 180px;\n}\n/* long names (an area can list a dozen places) are cut to one line; the full text shows on hover */\n.clp-clip[data-v-0f2eeed6] { display: block; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\n}\n.clp-shop__zone[data-v-0f2eeed6] { display: none; flex-wrap: wrap; gap: 6px; margin-top: 4px;\n}\n.clp-shop__id[data-v-0f2eeed6] { display: none; font-size: 12px; font-weight: 700; color: var(--ui-muted);\n}\n.clp-list-foot[data-v-0f2eeed6] { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 20px; padding: 14px 20px; border-top: 1px solid var(--ui-border); font-size: 13px; color: var(--ui-muted);\n}\n.clp-list-foot strong[data-v-0f2eeed6] { margin-left: 6px; color: var(--ui-text); font-size: 14px;\n}\n/* ticked orders a filter is hiding: its own full-width line under the totals */\n.clp-list-foot__hidden[data-v-0f2eeed6] { flex-basis: 100%;\n}\n.clp-list-foot__hidden strong[data-v-0f2eeed6] { margin: 0 4px 0 0;\n}\n\n/* ---------- planner ---------- */\n.clp-form[data-v-0f2eeed6] { padding: 8px 20px 20px;\n}\n.clp-chips[data-v-0f2eeed6] { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px;\n}\n.clp-plate[data-v-0f2eeed6] { font-family: SFMono-Regular, Menlo, Consolas, monospace; letter-spacing: 0.04em;\n}\n.clp-gauge[data-v-0f2eeed6] { --g: var(--ui-slate); --g-bg: var(--ui-slate-bg); --g-fg: var(--ui-slate-fg); margin-bottom: 16px; padding: 14px 16px; border-radius: 14px; background: var(--ui-soft); border: 1px solid var(--ui-border);\n}\n.clp-gauge--green[data-v-0f2eeed6] { --g: var(--ui-green); --g-fg: var(--ui-green-fg);\n}\n.clp-gauge--amber[data-v-0f2eeed6] { --g: var(--ui-amber); --g-fg: var(--ui-amber-fg);\n}\n.clp-gauge--red[data-v-0f2eeed6]   { --g: var(--ui-red);   --g-fg: var(--ui-red-fg);\n}\n.clp-gauge__title[data-v-0f2eeed6] { margin-bottom: 8px; font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ui-muted);\n}\n.clp-gauge__idle[data-v-0f2eeed6] { padding: 6px 0; text-align: center; font-size: 13px; color: var(--ui-muted);\n}\n.clp-gauge__idle .fa[data-v-0f2eeed6] { margin-right: 6px;\n}\n.clp-gauge__nums[data-v-0f2eeed6] { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; font-size: 13px; color: var(--ui-muted);\n}\n.clp-gauge__nums strong[data-v-0f2eeed6] { font-size: 15px; color: var(--ui-text);\n}\n.clp-gauge__track[data-v-0f2eeed6] { height: 10px; margin: 10px 0 8px; border-radius: 999px; background: var(--g-bg); overflow: hidden;\n}\n.clp-gauge__fill[data-v-0f2eeed6] { height: 100%; border-radius: 999px; background: var(--g); transition: width 0.35s ease, background-color 0.2s ease;\n}\n.clp-gauge__meta[data-v-0f2eeed6] { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; font-weight: 600;\n}\n.clp-gauge__pct[data-v-0f2eeed6] { color: var(--g-fg);\n}\n.clp-gauge__left[data-v-0f2eeed6] { color: var(--ui-muted);\n}\n.clp-sel[data-v-0f2eeed6] { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.35fr); margin-bottom: 16px; border: 1px solid var(--ui-border); border-radius: 14px; overflow: hidden;\n}\n.clp-sel > div[data-v-0f2eeed6] { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px;\n}\n.clp-sel > div + div[data-v-0f2eeed6] { border-left: 1px solid var(--ui-border);\n}\n.clp-sel span[data-v-0f2eeed6] { font-size: 11.5px; color: var(--ui-muted);\n}\n.clp-sel strong[data-v-0f2eeed6] { font-size: 16px; font-weight: 800; color: var(--ui-text);\n}\n.clp-alert[data-v-0f2eeed6] { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 16px; padding: 12px 14px; border-radius: 12px; background: var(--ui-red-bg); color: var(--ui-red-fg); font-size: 13px; line-height: 1.4;\n}\n.clp-alert .fa[data-v-0f2eeed6] { margin-top: 2px;\n}\n.clp .clp-cta[data-v-0f2eeed6] {\n    display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; height: 48px; border: 0; border-radius: 12px;\n    background: var(--ui-primary); color: #fff; font-size: 14.5px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(var(--brand-rgb, 4, 42, 95), 0.3);\n    transition: filter 0.15s ease, transform 0.1s ease;\n}\n.clp-cta[data-v-0f2eeed6]:hover:not(:disabled) { filter: brightness(0.95);\n}\n.clp-cta[data-v-0f2eeed6]:active:not(:disabled) { transform: translateY(1px);\n}\n.clp-cta[data-v-0f2eeed6]:disabled { opacity: 0.65; cursor: wait;\n}\n.clp-hint[data-v-0f2eeed6] { margin: 10px 0 0; text-align: center; font-size: 12.5px; color: var(--ui-muted);\n}\n\n/* ---------- review modal ---------- */\n.clp-review[data-v-0f2eeed6] { background: transparent; color: var(--ui-text);\n}\n.clp-review__lead[data-v-0f2eeed6] { margin: 0 0 12px; font-size: 13px; color: var(--ui-muted);\n}\n.clp-review__strip[data-v-0f2eeed6] { display: flex; gap: 10px; margin-bottom: 14px;\n}\n.clp-review__strip span[data-v-0f2eeed6] { padding: 6px 12px; border-radius: 10px; background: var(--ui-soft); border: 1px solid var(--ui-border); font-size: 13px; color: var(--ui-muted);\n}\n.clp-review__strip strong[data-v-0f2eeed6] { margin-right: 4px; color: var(--ui-text);\n}\n.review-orders-scroll[data-v-0f2eeed6] { max-height: 56vh; overflow-y: auto; padding-right: 4px; margin-bottom: 16px;\n}\n.clp-review__empty[data-v-0f2eeed6] { padding: 20px 0; text-align: center; color: var(--ui-muted);\n}\n.clp-pcard[data-v-0f2eeed6] { margin-bottom: 12px; border: 1px solid var(--ui-border); border-radius: 14px; overflow: hidden; background: var(--ui-card);\n}\n.clp-pcard[data-v-0f2eeed6]:last-child { margin-bottom: 0;\n}\n.clp-pcard__head[data-v-0f2eeed6] { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; background: var(--ui-soft); cursor: pointer; -webkit-user-select: none; -moz-user-select: none; user-select: none;\n}\n.clp-pcard__head[data-v-0f2eeed6]:hover { filter: brightness(0.98);\n}\n.clp-pcard__name[data-v-0f2eeed6] { display: flex; align-items: center; gap: 10px; min-width: 0;\n}\n.clp-pcard__name .fa[data-v-0f2eeed6] { font-size: 11px; color: var(--ui-muted);\n}\n.clp-pcard__name strong[data-v-0f2eeed6] { font-size: 14px;\n}\n.clp-pcard__meta[data-v-0f2eeed6] { display: flex; align-items: center; gap: 12px; flex-shrink: 0;\n}\n.clp-pcard__count[data-v-0f2eeed6] { font-size: 12.5px; color: var(--ui-muted);\n}\n.clp-rtable[data-v-0f2eeed6] { width: 100%; border-collapse: collapse;\n}\n.clp-rtable th[data-v-0f2eeed6] { padding: 10px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ui-muted); border-top: 1px solid var(--ui-border); border-bottom: 1px solid var(--ui-border); background: var(--ui-card);\n}\n.clp-rtable td[data-v-0f2eeed6] { padding: 10px 16px; font-size: 13.5px; border-top: 1px dashed var(--ui-border);\n}\n.clp-rtable tbody tr:first-child td[data-v-0f2eeed6] { border-top: 0;\n}\n.review-order-remove-btn[data-v-0f2eeed6] { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; padding: 0; border: 0; border-radius: 50%; background: transparent; color: var(--ui-muted); font-size: 12px; transition: background-color 0.15s ease, color 0.15s ease;\n}\n.review-order-remove-btn[data-v-0f2eeed6]:hover { background: var(--ui-red-bg); color: var(--ui-red-fg);\n}\n.clp-review__foot[data-v-0f2eeed6] { display: flex; justify-content: flex-end; gap: 10px;\n}\n.clp-btn[data-v-0f2eeed6] { height: 42px; padding: 0 18px; border-radius: 12px; font-weight: 600;\n}\n.clp-btn--primary[data-v-0f2eeed6] { background: var(--ui-primary); border-color: var(--ui-primary);\n}\n\n/* ---------- responsive ---------- */\n/* when the orders card is narrow, the zone/area pills tuck under the address instead of taking a column */\n@container clporders (max-width: 880px) {\n.clp-col-zone { display: none;\n}\n.clp-shop__zone { display: flex;\n}\n}\n@media (max-width: 1199px) {\n.clp-grid[data-v-0f2eeed6] { grid-template-columns: 1fr;\n}\n.clp-planner[data-v-0f2eeed6] { position: static;\n}\n}\n@media (max-width: 767px) {\n.clp[data-v-0f2eeed6] { padding: 16px;\n}\n.clp .clp-head h1[data-v-0f2eeed6] { font-size: 24px;\n}\n.clp-col-zone[data-v-0f2eeed6] { display: none;\n}\n.clp-table[data-v-0f2eeed6] { table-layout: fixed;\n}\n.clp-table thead th[data-v-0f2eeed6], .clp-table tbody td[data-v-0f2eeed6] { padding: 10px 8px;\n}\n.clp-th-check[data-v-0f2eeed6] { width: 34px;\n}\n.clp-col-id[data-v-0f2eeed6] { display: none;\n}\n.clp-col-value[data-v-0f2eeed6] { width: 92px;\n}\n.clp-col-weight[data-v-0f2eeed6] { width: 66px;\n}\n.clp-shop[data-v-0f2eeed6] { min-width: 0;\n}\n.clp-shop .ui-avatar[data-v-0f2eeed6] { display: none;\n}\n.clp-shop__id[data-v-0f2eeed6] { display: inline;\n}\n.clp-shop__addr[data-v-0f2eeed6] { max-width: 100%;\n}\n.clp-sel strong[data-v-0f2eeed6] { font-size: 14px;\n}\n.clp-field[data-v-0f2eeed6], .clp-select[data-v-0f2eeed6], .clp-filters .clp-select[data-v-0f2eeed6] { width: 100%;\n}\n.clp-seg[data-v-0f2eeed6] { width: 100%;\n}\n.clp-seg__btn[data-v-0f2eeed6] { flex: 1; padding: 0 6px;\n}\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.product-filter-select2 .select2-container {\n    flex: 1;\n}\n.product-filter-select2 .select2-container--default .select2-selection--multiple {\n    background-color: var(--ui-soft, #f7f9fc);\n    border: 1px solid var(--ui-border, #e9edf5);\n    border-radius: 12px;\n    min-height: 42px;\n    padding: 0.1rem 0.35rem;\n}\n.product-filter-select2 .select2-container--default.select2-container--focus .select2-selection--multiple,\n.product-filter-select2 .select2-container--default.select2-container--open .select2-selection--multiple {\n    border-color: var(--ui-primary, #042A5F);\n    box-shadow: 0 0 0 3px var(--ui-primary-soft, rgba(4, 42, 95, 0.14));\n}\n.product-filter-select2 .select2-selection__choice {\n    background-color: var(--ui-blue-bg, rgba(78, 115, 223, 0.1)) !important;\n    border: none !important;\n    border-radius: 8px !important;\n    color: var(--ui-blue-fg, #4e73df) !important;\n    font-weight: 600;\n    padding: 2px 8px !important;\n}\n.product-filter-select2 .select2-selection__choice__remove {\n    color: var(--ui-blue-fg, #4e73df) !important;\n    margin-right: 4px !important;\n}\n.product-filter-select2 .select2-search--inline .select2-search__field {\n    margin-top: 6px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_0_id_0f2eeed6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_0_id_0f2eeed6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_0_id_0f2eeed6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_1_id_0f2eeed6_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_1_id_0f2eeed6_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_1_id_0f2eeed6_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sellers/CreateLoadingSlip.vue":
/*!**********************************************************!*\
  !*** ./resources/js/views/Sellers/CreateLoadingSlip.vue ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CreateLoadingSlip_vue_vue_type_template_id_0f2eeed6_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateLoadingSlip.vue?vue&type=template&id=0f2eeed6&scoped=true */ "./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=template&id=0f2eeed6&scoped=true");
/* harmony import */ var _CreateLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreateLoadingSlip.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=script&lang=js");
/* harmony import */ var _CreateLoadingSlip_vue_vue_type_style_index_0_id_0f2eeed6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css */ "./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css");
/* harmony import */ var _CreateLoadingSlip_vue_vue_type_style_index_1_id_0f2eeed6_lang_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css */ "./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;



/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_4__["default"])(
  _CreateLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _CreateLoadingSlip_vue_vue_type_template_id_0f2eeed6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _CreateLoadingSlip_vue_vue_type_template_id_0f2eeed6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0f2eeed6",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/CreateLoadingSlip.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=script&lang=js":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=script&lang=js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css":
/*!******************************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_0_id_0f2eeed6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=0&id=0f2eeed6&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css":
/*!******************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_style_index_1_id_0f2eeed6_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=style&index=1&id=0f2eeed6&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=template&id=0f2eeed6&scoped=true":
/*!****************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=template&id=0f2eeed6&scoped=true ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_template_id_0f2eeed6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_template_id_0f2eeed6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreateLoadingSlip_vue_vue_type_template_id_0f2eeed6_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CreateLoadingSlip.vue?vue&type=template&id=0f2eeed6&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=template&id=0f2eeed6&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=template&id=0f2eeed6&scoped=true":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/CreateLoadingSlip.vue?vue&type=template&id=0f2eeed6&scoped=true ***!
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
    { staticClass: "clp" },
    [
      _c(
        "header",
        { staticClass: "clp-head" },
        [
          _c("div", { staticClass: "clp-head__title" }, [
            _c("span", { staticClass: "clp-eyebrow" }, [
              _vm._v(_vm._s(_vm.__("Logistics"))),
            ]),
            _vm._v(" "),
            _c("h1", [_vm._v(_vm._s(_vm.__("create_loading_slip")))]),
          ]),
          _vm._v(" "),
          _c(
            "router-link",
            {
              staticClass: "clp-back",
              attrs: { to: _vm.urlPrefix + "/loading_slips" },
            },
            [
              _c("i", { staticClass: "fa fa-arrow-left" }),
              _vm._v(" " + _vm._s(_vm.__("back_to_slips")) + "\n        "),
            ]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "clp-grid" }, [
        _c("section", { staticClass: "clp-card clp-orders" }, [
          _c("div", { staticClass: "clp-card__head" }, [
            _c("div", { staticClass: "clp-card__title" }, [
              _c("h2", [_vm._v(_vm._s(_vm.__("unassigned_doorstep_orders")))]),
              _vm._v(" "),
              _c("span", { staticClass: "ui-pill ui-tone--blue" }, [
                _vm._v(_vm._s(_vm.orders.length)),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "clp-filters" }, [
              _c("div", { staticClass: "clp-field" }, [
                _c("span", { staticClass: "clp-field__label" }, [
                  _vm._v(_vm._s(_vm.__("filter_by_area"))),
                ]),
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
                    staticClass: "clp-select",
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
              _c("div", { staticClass: "clp-field" }, [
                _c("span", { staticClass: "clp-field__label" }, [
                  _vm._v("Rescheduled"),
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "clp-seg", attrs: { role: "group" } },
                  [
                    _c(
                      "button",
                      {
                        staticClass: "clp-seg__btn",
                        class: {
                          "clp-seg__btn--on": _vm.selectedRescheduled === "",
                        },
                        attrs: { type: "button" },
                        on: {
                          click: function ($event) {
                            return _vm.setRescheduled("")
                          },
                        },
                      },
                      [_vm._v("All")]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "clp-seg__btn",
                        class: {
                          "clp-seg__btn--on": _vm.selectedRescheduled === "1",
                        },
                        attrs: { type: "button" },
                        on: {
                          click: function ($event) {
                            return _vm.setRescheduled("1")
                          },
                        },
                      },
                      [_vm._v("Rescheduled")]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "clp-seg__btn",
                        class: {
                          "clp-seg__btn--on": _vm.selectedRescheduled === "0",
                        },
                        attrs: { type: "button" },
                        on: {
                          click: function ($event) {
                            return _vm.setRescheduled("0")
                          },
                        },
                      },
                      [_vm._v("Regular")]
                    ),
                  ]
                ),
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass:
                    "clp-field clp-field--grow product-filter-select2",
                },
                [
                  _c("span", { staticClass: "clp-field__label" }, [
                    _vm._v(_vm._s(_vm.__("Filter by Product"))),
                  ]),
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
            ]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "clp-scroll" }, [
            _c("table", { staticClass: "clp-table" }, [
              _c("thead", [
                _c("tr", [
                  _c("th", { staticClass: "clp-th-check" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.selectAll,
                          expression: "selectAll",
                        },
                      ],
                      staticClass: "clp-check",
                      attrs: { type: "checkbox", title: _vm.__("Select all") },
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
                                $$i < 0 && (_vm.selectAll = $$a.concat([$$v]))
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
                  _vm._v(" "),
                  _c("th", { staticClass: "clp-col-id" }, [
                    _vm._v(_vm._s(_vm.__("order_id"))),
                  ]),
                  _vm._v(" "),
                  _c("th", [_vm._v(_vm._s(_vm.__("customer_name")))]),
                  _vm._v(" "),
                  _c("th", { staticClass: "clp-col-zone" }, [
                    _vm._v(
                      _vm._s(_vm.__("zone")) + " / " + _vm._s(_vm.__("area"))
                    ),
                  ]),
                  _vm._v(" "),
                  _c("th", { staticClass: "clp-num clp-col-value" }, [
                    _vm._v(_vm._s(_vm.__("value"))),
                  ]),
                  _vm._v(" "),
                  _c("th", { staticClass: "clp-num clp-col-weight" }, [
                    _vm._v(_vm._s(_vm.__("weight_kg"))),
                  ]),
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
                        staticClass: "clp-row",
                        class: {
                          "clp-row--on": _vm.selectedOrderIds.includes(
                            order.id
                          ),
                        },
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
                            staticClass: "clp-th-check",
                            on: {
                              click: function ($event) {
                                $event.stopPropagation()
                              },
                            },
                          },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.selectedOrderIds,
                                  expression: "selectedOrderIds",
                                },
                              ],
                              staticClass: "clp-check",
                              attrs: { type: "checkbox" },
                              domProps: {
                                value: order.id,
                                checked: Array.isArray(_vm.selectedOrderIds)
                                  ? _vm._i(_vm.selectedOrderIds, order.id) > -1
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
                                          (_vm.selectedOrderIds = $$a.concat([
                                            $$v,
                                          ]))
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
                          ]
                        ),
                        _vm._v(" "),
                        _c("td", { staticClass: "clp-id clp-col-id" }, [
                          _vm._v("#" + _vm._s(order.id)),
                        ]),
                        _vm._v(" "),
                        _c("td", [
                          _c("div", { staticClass: "clp-shop" }, [
                            _c(
                              "span",
                              {
                                staticClass: "ui-avatar",
                                class:
                                  "ui-tone--" + _vm.avatarTone(order.user_name),
                              },
                              [_vm._v(_vm._s(_vm.initials(order.user_name)))]
                            ),
                            _vm._v(" "),
                            _c("div", { staticClass: "clp-shop__text" }, [
                              _c("div", { staticClass: "clp-shop__name" }, [
                                _c("span", { staticClass: "clp-shop__id" }, [
                                  _vm._v("#" + _vm._s(order.id)),
                                ]),
                                _vm._v(" "),
                                _c(
                                  "strong",
                                  { attrs: { title: order.user_name } },
                                  [_vm._v(_vm._s(order.user_name))]
                                ),
                                _vm._v(" "),
                                order.is_rescheduled
                                  ? _c(
                                      "span",
                                      { staticClass: "ui-pill ui-tone--amber" },
                                      [_vm._v("Rescheduled")]
                                    )
                                  : _vm._e(),
                              ]),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass: "clp-shop__addr",
                                  attrs: { title: order.address },
                                },
                                [_vm._v(_vm._s(order.address))]
                              ),
                              _vm._v(" "),
                              _c("div", { staticClass: "clp-shop__zone" }, [
                                _c(
                                  "span",
                                  {
                                    directives: [
                                      {
                                        name: "b-tooltip",
                                        rawName: "v-b-tooltip.hover.top",
                                        modifiers: { hover: true, top: true },
                                      },
                                    ],
                                    staticClass: "ui-pill ui-tone--blue",
                                    attrs: {
                                      title: _vm.formatZone(
                                        order.city_zone || "Default"
                                      ),
                                    },
                                  },
                                  [
                                    _c("span", { staticClass: "clp-clip" }, [
                                      _vm._v(
                                        _vm._s(
                                          _vm.formatZone(
                                            order.city_zone || "Default"
                                          )
                                        )
                                      ),
                                    ]),
                                  ]
                                ),
                                _vm._v(" "),
                                order.area_name
                                  ? _c(
                                      "span",
                                      {
                                        directives: [
                                          {
                                            name: "b-tooltip",
                                            rawName: "v-b-tooltip.hover.top",
                                            modifiers: {
                                              hover: true,
                                              top: true,
                                            },
                                          },
                                        ],
                                        staticClass: "ui-pill ui-tone--amber",
                                        attrs: { title: order.area_name },
                                      },
                                      [
                                        _c(
                                          "span",
                                          { staticClass: "clp-clip" },
                                          [_vm._v(_vm._s(order.area_name))]
                                        ),
                                      ]
                                    )
                                  : _vm._e(),
                              ]),
                            ]),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("td", { staticClass: "clp-col-zone" }, [
                          _c("div", { staticClass: "clp-pills" }, [
                            _c(
                              "span",
                              {
                                directives: [
                                  {
                                    name: "b-tooltip",
                                    rawName: "v-b-tooltip.hover.top",
                                    modifiers: { hover: true, top: true },
                                  },
                                ],
                                staticClass: "ui-pill ui-tone--blue",
                                attrs: {
                                  title: _vm.formatZone(
                                    order.city_zone || "Default"
                                  ),
                                },
                              },
                              [
                                _c("span", { staticClass: "clp-clip" }, [
                                  _vm._v(
                                    _vm._s(
                                      _vm.formatZone(
                                        order.city_zone || "Default"
                                      )
                                    )
                                  ),
                                ]),
                              ]
                            ),
                            _vm._v(" "),
                            order.area_name
                              ? _c(
                                  "span",
                                  {
                                    directives: [
                                      {
                                        name: "b-tooltip",
                                        rawName: "v-b-tooltip.hover.top",
                                        modifiers: { hover: true, top: true },
                                      },
                                    ],
                                    staticClass: "ui-pill ui-tone--amber",
                                    attrs: { title: order.area_name },
                                  },
                                  [
                                    _c("span", { staticClass: "clp-clip" }, [
                                      _vm._v(_vm._s(order.area_name)),
                                    ]),
                                  ]
                                )
                              : _vm._e(),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("td", { staticClass: "clp-num clp-col-value" }, [
                          _c("strong", [
                            _vm._v(
                              "₹" + _vm._s(_vm.formatMoney(order.final_total))
                            ),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("td", { staticClass: "clp-num clp-col-weight" }, [
                          _c("strong", [
                            _vm._v(_vm._s(order.weight || 0) + " kg"),
                          ]),
                        ]),
                      ]
                    )
                  }),
                  _vm._v(" "),
                  _vm.orders.length === 0
                    ? _c("tr", [
                        _c("td", { attrs: { colspan: "6" } }, [
                          _c("div", { staticClass: "ui-empty" }, [
                            _vm._m(0),
                            _vm._v(" "),
                            _c("h3", [
                              _vm._v(
                                _vm._s(
                                  _vm.__(
                                    "hurray_all_doorstep_orders_are_already_assigned_to_slips"
                                  )
                                )
                              ),
                            ]),
                          ]),
                        ]),
                      ])
                    : _vm._e(),
                ],
                2
              ),
            ]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "clp-list-foot" }, [
            _c("span", [
              _vm._v(_vm._s(_vm.__("total_weight")) + " "),
              _c("strong", [
                _vm._v(
                  _vm._s(_vm.totalFilteredWeight) + " " + _vm._s(_vm.__("kg"))
                ),
              ]),
            ]),
            _vm._v(" "),
            _c("span", [
              _vm._v(_vm._s(_vm.__("orders")) + " "),
              _c("strong", [_vm._v(_vm._s(_vm.orders.length))]),
            ]),
            _vm._v(" "),
            _c("span", [
              _vm._v(_vm._s(_vm.__("total_value")) + " "),
              _c("strong", [_vm._v("₹" + _vm._s(_vm.totalFilteredValue))]),
            ]),
            _vm._v(" "),
            _vm.hiddenSelectedCount
              ? _c("span", { staticClass: "clp-list-foot__hidden" }, [
                  _c("strong", [_vm._v(_vm._s(_vm.hiddenSelectedCount))]),
                  _vm._v(
                    " " +
                      _vm._s(
                        _vm.__(
                          "selected orders are hidden by the filters but stay in the slip"
                        )
                      ) +
                      "\n                "
                  ),
                ])
              : _vm._e(),
          ]),
        ]),
        _vm._v(" "),
        _c("aside", { staticClass: "clp-planner" }, [
          _c("div", { staticClass: "clp-card" }, [
            _c("div", { staticClass: "clp-card__head clp-card__head--plain" }, [
              _c("div", { staticClass: "clp-card__title" }, [
                _vm._m(1),
                _vm._v(" "),
                _c("h2", [_vm._v(_vm._s(_vm.__("logistics_planner")))]),
              ]),
            ]),
            _vm._v(" "),
            _c(
              "form",
              {
                staticClass: "clp-form",
                on: {
                  submit: function ($event) {
                    $event.preventDefault()
                    return _vm.openReviewModal.apply(null, arguments)
                  },
                },
              },
              [
                _c("div", { staticClass: "clp-field clp-field--stack" }, [
                  _c(
                    "label",
                    {
                      staticClass: "clp-field__label",
                      attrs: { for: "clp-vehicle" },
                    },
                    [
                      _vm._v(_vm._s(_vm.__("select_delivery_vehicle")) + " "),
                      _c("em", [_vm._v("*")]),
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
                      staticClass: "clp-select clp-select--lg",
                      attrs: { id: "clp-vehicle", required: "" },
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
                              "\n                                " +
                                _vm._s(v.name) +
                                " [" +
                                _vm._s(v.vehicle_number) +
                                "] - " +
                                _vm._s(_vm.__("cap")) +
                                ": " +
                                _vm._s(v.capacity) +
                                " " +
                                _vm._s(_vm.__("kg")) +
                                "\n                            "
                            ),
                          ]
                        )
                      }),
                    ],
                    2
                  ),
                  _vm._v(" "),
                  _vm.selectedVehicle
                    ? _c("div", { staticClass: "clp-chips" }, [
                        _c("span", { staticClass: "ui-tag clp-plate" }, [
                          _vm._v(_vm._s(_vm.selectedVehicle.vehicle_number)),
                        ]),
                        _vm._v(" "),
                        _c("span", { staticClass: "ui-tag" }, [
                          _vm._v(
                            _vm._s(_vm.__("cap")) +
                              ": " +
                              _vm._s(_vm.selectedVehicle.capacity) +
                              " " +
                              _vm._s(_vm.__("kg"))
                          ),
                        ]),
                      ])
                    : _vm._e(),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "clp-field clp-field--stack" }, [
                  _c(
                    "label",
                    {
                      staticClass: "clp-field__label",
                      attrs: { for: "clp-driver" },
                    },
                    [
                      _vm._v(
                        _vm._s(_vm.__("select_active_driver_rider")) + " "
                      ),
                      _c("em", [_vm._v("*")]),
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
                      staticClass: "clp-select clp-select--lg",
                      attrs: { id: "clp-driver", required: "" },
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
                        _vm._v("-- " + _vm._s(_vm.__("choose_driver")) + " --"),
                      ]),
                      _vm._v(" "),
                      _vm._l(_vm.drivers, function (d) {
                        return _c(
                          "option",
                          { key: d.id, domProps: { value: d.id } },
                          [
                            _vm._v(
                              "\n                                " +
                                _vm._s(d.name) +
                                " [" +
                                _vm._s(d.mobile) +
                                "]\n                            "
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
                  {
                    staticClass: "clp-gauge",
                    class:
                      "clp-gauge--" +
                      (_vm.selectedVehicle ? _vm.loadTone : "idle"),
                  },
                  [
                    _c("div", { staticClass: "clp-gauge__title" }, [
                      _vm._v(_vm._s(_vm.__("live_weight_load_bar"))),
                    ]),
                    _vm._v(" "),
                    !_vm.selectedVehicle
                      ? _c("div", { staticClass: "clp-gauge__idle" }, [
                          _c("i", { staticClass: "fa fa-truck" }),
                          _vm._v(
                            " " +
                              _vm._s(
                                _vm.__(
                                  "choose_a_vehicle_to_visualize_weight_limits"
                                )
                              ) +
                              "\n                        "
                          ),
                        ])
                      : _c("div", [
                          _c("div", { staticClass: "clp-gauge__nums" }, [
                            _c("span", [
                              _vm._v(_vm._s(_vm.__("current_load_weight"))),
                            ]),
                            _vm._v(" "),
                            _c("strong", [
                              _vm._v(
                                _vm._s(_vm.totalSelectedWeight) +
                                  " / " +
                                  _vm._s(_vm.selectedVehicle.capacity) +
                                  " " +
                                  _vm._s(_vm.__("kg"))
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "clp-gauge__track" }, [
                            _c("div", {
                              staticClass: "clp-gauge__fill",
                              style: { width: _vm.gaugeWidth + "%" },
                            }),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "clp-gauge__meta" }, [
                            _c("span", { staticClass: "clp-gauge__pct" }, [
                              _vm._v(
                                _vm._s(_vm.loadPercent.toFixed(1)) +
                                  "% " +
                                  _vm._s(_vm.__("capacity_loaded"))
                              ),
                            ]),
                            _vm._v(" "),
                            _c("span", { staticClass: "clp-gauge__left" }, [
                              _vm._v(
                                _vm._s(
                                  _vm.loadRemaining >= 0
                                    ? _vm.loadRemaining +
                                        " " +
                                        _vm.__("kg") +
                                        " left"
                                    : "Over by " +
                                        Math.abs(_vm.loadRemaining) +
                                        " " +
                                        _vm.__("kg")
                                )
                              ),
                            ]),
                          ]),
                        ]),
                  ]
                ),
                _vm._v(" "),
                _c("div", { staticClass: "clp-sel" }, [
                  _c("div", [
                    _c("span", [_vm._v(_vm._s(_vm.__("orders_selected")))]),
                    _c("strong", [_vm._v(_vm._s(_vm.selectedOrderIds.length))]),
                  ]),
                  _vm._v(" "),
                  _c("div", [
                    _c("span", [_vm._v(_vm._s(_vm.__("weight_kg")))]),
                    _c("strong", [_vm._v(_vm._s(_vm.totalSelectedWeight))]),
                  ]),
                  _vm._v(" "),
                  _c("div", [
                    _c("span", [_vm._v(_vm._s(_vm.__("value")))]),
                    _c("strong", [_vm._v("₹" + _vm._s(_vm.selectedValue))]),
                  ]),
                ]),
                _vm._v(" "),
                _vm.loadPercent > 100
                  ? _c("div", { staticClass: "clp-alert" }, [
                      _c("i", { staticClass: "fa fa-exclamation-triangle" }),
                      _vm._v(" "),
                      _c("div", [
                        _c("strong", [
                          _vm._v(_vm._s(_vm.__("vehicle_overloaded")) + "!"),
                        ]),
                        _vm._v(
                          " " +
                            _vm._s(
                              _vm.__(
                                "selected_load_exceeds_the_vehicle_maximum_capability"
                              )
                            )
                        ),
                      ]),
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "clp-cta",
                    attrs: { type: "submit", disabled: _vm.reviewLoading },
                  },
                  [
                    _vm.reviewLoading
                      ? _c("b-spinner", { attrs: { small: "" } })
                      : _c("i", { staticClass: "fa fa-magic" }),
                    _vm._v(
                      _vm._s(_vm.__("generate_slip_and_sequence_route")) +
                        "\n                    "
                    ),
                  ],
                  1
                ),
                _vm._v(" "),
                _vm.plannerHint
                  ? _c("p", { staticClass: "clp-hint" }, [
                      _vm._v(_vm._s(_vm.plannerHint)),
                    ])
                  : _vm._e(),
              ]
            ),
          ]),
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
          _c("div", { staticClass: "ui-modern clp-review" }, [
            _c("p", { staticClass: "clp-review__lead" }, [
              _vm._v(
                _vm._s(
                  _vm.__(
                    "Verify you have enough physical stock for each product below. Click a product to see and adjust the orders behind it."
                  )
                )
              ),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "clp-review__strip" }, [
              _c("span", [
                _c("strong", [_vm._v(_vm._s(_vm.reviewSummary.length))]),
                _vm._v(" " + _vm._s(_vm.__("orders"))),
              ]),
              _vm._v(" "),
              _c("span", [
                _c("strong", [
                  _vm._v(_vm._s(_vm.productGroupedSummary.length)),
                ]),
                _vm._v(" " + _vm._s(_vm.__("Products"))),
              ]),
            ]),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "review-orders-scroll" },
              [
                _vm._l(_vm.productGroupedSummary, function (product) {
                  return _c(
                    "div",
                    { key: product.key, staticClass: "clp-pcard" },
                    [
                      _c(
                        "div",
                        {
                          staticClass: "clp-pcard__head",
                          on: {
                            click: function ($event) {
                              return _vm.toggleProductExpand(product.key)
                            },
                          },
                        },
                        [
                          _c("span", { staticClass: "clp-pcard__name" }, [
                            _c("i", {
                              staticClass: "fa",
                              class: _vm.expandedProducts[product.key]
                                ? "fa-chevron-down"
                                : "fa-chevron-right",
                            }),
                            _vm._v(" "),
                            _c("strong", [_vm._v(_vm._s(product.name))]),
                          ]),
                          _vm._v(" "),
                          _c("span", { staticClass: "clp-pcard__meta" }, [
                            _c("span", { staticClass: "clp-pcard__count" }, [
                              _vm._v(
                                _vm._s(product.orders.length) +
                                  " " +
                                  _vm._s(_vm.__("orders"))
                              ),
                            ]),
                            _vm._v(" "),
                            _c(
                              "span",
                              { staticClass: "ui-pill ui-tone--blue" },
                              [
                                product.boxes !== null
                                  ? [
                                      _vm._v(
                                        "\n                                    " +
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
                          ]),
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
                            _c("table", { staticClass: "clp-rtable" }, [
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
                                  _c("th", { staticClass: "clp-num" }, [
                                    _vm._v(_vm._s(_vm.__("Qty"))),
                                  ]),
                                  _vm._v(" "),
                                  _c("th", { staticClass: "clp-num" }, [
                                    _vm._v(
                                      _vm._s(product.boxUnit || _vm.__("Boxes"))
                                    ),
                                  ]),
                                  _vm._v(" "),
                                  _c("th", { staticClass: "clp-num" }, [
                                    _vm._v(
                                      _vm._s(
                                        product.pieceUnit ||
                                          _vm.__("Loose Pieces")
                                      )
                                    ),
                                  ]),
                                  _vm._v(" "),
                                  _c("th", { staticStyle: { width: "50px" } }),
                                ]),
                              ]),
                              _vm._v(" "),
                              _c(
                                "tbody",
                                _vm._l(product.orders, function (o) {
                                  return _c("tr", { key: o.orderId }, [
                                    _c("td", [
                                      _c("strong", [
                                        _vm._v("#" + _vm._s(o.orderId)),
                                      ]),
                                      _vm._v(" "),
                                      _c("span", { staticClass: "clp-muted" }, [
                                        _vm._v("(" + _vm._s(o.ordersId) + ")"),
                                      ]),
                                    ]),
                                    _vm._v(" "),
                                    _c("td", [_vm._v(_vm._s(o.retailerName))]),
                                    _vm._v(" "),
                                    _c("td", { staticClass: "clp-num" }, [
                                      _vm._v(_vm._s(o.qty)),
                                    ]),
                                    _vm._v(" "),
                                    _c("td", { staticClass: "clp-num" }, [
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
                                            { staticClass: "clp-muted" },
                                            [_vm._v("—")]
                                          ),
                                    ]),
                                    _vm._v(" "),
                                    _c("td", { staticClass: "clp-num" }, [
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
                                            { staticClass: "clp-muted" },
                                            [_vm._v("—")]
                                          ),
                                    ]),
                                    _vm._v(" "),
                                    _c("td", { staticClass: "clp-num" }, [
                                      _c(
                                        "button",
                                        {
                                          directives: [
                                            {
                                              name: "b-tooltip",
                                              rawName:
                                                "v-b-tooltip.hover.right.noninteractive",
                                              modifiers: {
                                                hover: true,
                                                right: true,
                                                noninteractive: true,
                                              },
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
                            ]),
                          ]),
                        ]
                      ),
                    ],
                    1
                  )
                }),
                _vm._v(" "),
                _vm.productGroupedSummary.length === 0
                  ? _c("div", { staticClass: "clp-review__empty" }, [
                      _vm._v(_vm._s(_vm.__("no_data_found"))),
                    ])
                  : _vm._e(),
              ],
              2
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "clp-review__foot" },
              [
                _c(
                  "b-button",
                  {
                    staticClass: "clp-btn",
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
                    staticClass: "clp-btn clp-btn--primary",
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
                        "\n                "
                    ),
                  ],
                  1
                ),
              ],
              1
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
    return _c("div", { staticClass: "ui-empty__icon" }, [
      _c("i", { staticClass: "fa fa-check-circle" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "ui-tile ui-tone--blue clp-tile" }, [
      _c("i", { staticClass: "fa fa-truck" }),
    ])
  },
]
render._withStripped = true



/***/ })

}]);