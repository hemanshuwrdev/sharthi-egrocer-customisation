"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Sellers_TripReconciliation_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'SellerTripReconciliation',
  data: function data() {
    return {
      loading: true,
      settlement: null,
      orders: [],
      totals: {
        total_expected: 0,
        total_collected: 0,
        total_cash: 0,
        total_upi: 0,
        total_cheque: 0,
        total_signature: 0,
        verified_upi: 0,
        verified_cheque: 0,
        verified_signature: 0,
        digital_verified: 0,
        cash_expected: 0,
        cash_received: null,
        has_cash: false,
        unverified_digital: 0
      },
      closing: false,
      verifyingId: null
    };
  },
  computed: {
    tripType: function tripType() {
      return this.$route.query.type || 'driver';
    },
    isClosed: function isClosed() {
      return this.settlement && this.settlement.status === 'reconciled';
    },
    needsRereconcile: function needsRereconcile() {
      return this.settlement && this.settlement.status === 'needs_rereconcile';
    },
    overallShortfall: function overallShortfall() {
      return parseFloat((this.totals.total_expected - this.totals.total_collected).toFixed(2));
    },
    canCloseNow: function canCloseNow() {
      return this.totals.unverified_digital === 0;
    },
    flatRows: function flatRows() {
      var rows = [];
      this.orders.forEach(function (order) {
        var payments = order.payments || [];
        var collected = payments.reduce(function (s, p) {
          return s + parseFloat(p.amount || 0);
        }, 0);
        var orderShortfall = parseFloat((order.final_total - collected).toFixed(2));
        var retailerName = order.retailer ? order.retailer.name : '-';
        var retailerMobile = order.retailer ? order.retailer.mobile : '';
        var rowspan = payments.length || 1;
        if (payments.length === 0) {
          rows.push({
            orderId: order.id,
            ordersId: order.orders_id,
            loadingSlipNo: order.loading_slip_no,
            retailerName: retailerName,
            retailerMobile: retailerMobile,
            finalTotal: order.final_total,
            isEmpty: true,
            isFirst: true,
            isLast: true,
            rowspan: 1,
            orderShortfall: orderShortfall,
            paymentId: null,
            method: null,
            amount: 0,
            proofPhoto: null,
            paymentStatus: null
          });
        } else {
          payments.forEach(function (p, pi) {
            rows.push({
              orderId: order.id,
              ordersId: order.orders_id,
              loadingSlipNo: order.loading_slip_no,
              retailerName: retailerName,
              retailerMobile: retailerMobile,
              finalTotal: order.final_total,
              isEmpty: false,
              isFirst: pi === 0,
              isLast: pi === payments.length - 1,
              rowspan: rowspan,
              orderShortfall: orderShortfall,
              paymentId: p.id,
              method: p.method,
              amount: p.amount,
              proofPhoto: p.proof_photo,
              paymentStatus: p.status
            });
          });
        }
      });
      return rows;
    }
  },
  created: function created() {
    this.load();
  },
  methods: {
    load: function load() {
      var _this = this;
      this.loading = true;
      axios.get(this.$apiUrl + '/seller/trips/' + this.$route.params.id, {
        params: {
          type: this.tripType
        }
      }).then(function (res) {
        var d = res.data.data;
        _this.settlement = d.settlement;
        _this.orders = d.orders;
        _this.totals = d.totals;
        _this.loading = false;
      })["catch"](function () {
        _this.loading = false;
      });
    },
    verifyPayment: function verifyPayment(paymentId) {
      var _this2 = this;
      this.verifyingId = paymentId;
      axios.post(this.$apiUrl + '/seller/payments/verify', {
        payment_id: paymentId
      }).then(function () {
        _this2.verifyingId = null;
        _this2.$toasted.success(__('payment_verified'));
        _this2.load();
      })["catch"](function (err) {
        var _err$response, _err$response$data;
        _this2.verifyingId = null;
        var msg = ((_err$response = err.response) === null || _err$response === void 0 ? void 0 : (_err$response$data = _err$response.data) === null || _err$response$data === void 0 ? void 0 : _err$response$data.message) || '';
        if (msg === 'already_verified') {
          // DB already has it verified — reload to sync UI
          _this2.load();
        } else {
          _this2.$toasted.error(msg || __('something_went_wrong'));
        }
      });
    },
    closeTrip: function closeTrip() {
      var _this3 = this;
      if (!this.canCloseNow) return;
      this.$bvModal.msgBoxConfirm(__('verify_close_trip') + '?', {
        okVariant: 'primary',
        okTitle: __('confirm'),
        cancelTitle: __('cancel')
      }).then(function (ok) {
        if (!ok) return;
        _this3.closing = true;
        axios.post(_this3.$apiUrl + '/seller/trips/' + _this3.$route.params.id + '/close', {
          type: _this3.tripType
        }).then(function () {
          _this3.closing = false;
          _this3.$toasted.success(__('trip_closed'));
          _this3.load();
        })["catch"](function (err) {
          var _err$response2, _err$response2$data;
          _this3.closing = false;
          _this3.$toasted.error(((_err$response2 = err.response) === null || _err$response2 === void 0 ? void 0 : (_err$response2$data = _err$response2.data) === null || _err$response2$data === void 0 ? void 0 : _err$response2$data.message) || __('something_went_wrong'));
        });
      });
    },
    exportReport: function exportReport() {
      var rows = [['Order #', 'Loading Slip', 'Retailer', 'Order Value', 'Method', 'Collected', 'Status']].concat(_toConsumableArray(this.flatRows.map(function (r) {
        return [r.ordersId, r.loadingSlipNo || '-', r.retailerName, r.finalTotal, r.method || '-', r.amount, r.paymentStatus || '-'];
      })));
      var csv = rows.map(function (r) {
        return r.join(',');
      }).join('\n');
      var blob = new Blob([csv], {
        type: 'text/csv'
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'settlement-' + this.tripType + '-' + this.$route.params.id + '.csv';
      a.click();
      URL.revokeObjectURL(url);
    },
    fmt: function fmt(val) {
      if (val == null) return '0.00';
      return parseFloat(val).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    methodIcon: function methodIcon(m) {
      return {
        cash: 'fa fa-money',
        upi: 'fa fa-mobile',
        cheque: 'fa fa-file-text',
        signature: 'fa fa-pencil'
      }[m] || 'fa fa-credit-card';
    },
    methodBadgeClass: function methodBadgeClass(m) {
      return {
        cash: 'bg-success',
        upi: 'bg-primary',
        cheque: 'bg-info',
        signature: 'bg-warning text-dark'
      }[m] || 'bg-secondary';
    },
    statusBadgeClass: function statusBadgeClass(s) {
      return {
        open: 'trip-badge--orange',
        locked: 'trip-badge--blue',
        reconciled: 'trip-badge--green',
        needs_rereconcile: 'trip-badge--orange'
      }[s] || '';
    },
    statusIcon: function statusIcon(s) {
      return {
        open: 'fa fa-clock-o',
        locked: 'fa fa-lock',
        reconciled: 'fa fa-check-circle',
        needs_rereconcile: 'fa fa-exclamation-triangle'
      }[s] || 'fa fa-circle';
    },
    reconStatusLabel: function reconStatusLabel(s) {
      return {
        unreconciled: __('unreconciled'),
        partial_match: __('partial_match'),
        full_match: __('full_match'),
        overpaid: __('overpaid')
      }[s] || s || '-';
    },
    reconStatusIcon: function reconStatusIcon(s) {
      return {
        unreconciled: 'fa fa-circle-o',
        partial_match: 'fa fa-exclamation-triangle',
        full_match: 'fa fa-check-circle',
        overpaid: 'fa fa-arrow-up'
      }[s] || 'fa fa-circle-o';
    },
    reconStatusClass: function reconStatusClass(s) {
      return {
        unreconciled: 'text-muted',
        partial_match: 'text-warning fw-semibold',
        full_match: 'text-success fw-semibold',
        overpaid: 'text-info fw-semibold'
      }[s] || 'text-muted';
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.bg-purple[data-v-3ecfca82] { background-color: #7c3aed !important; color: #fff !important;\n}\n.driver-avatar[data-v-3ecfca82] {\n    width: 48px; height: 48px; border-radius: 50%;\n    background: #e8f0fe; color: #4f8ef7;\n    display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;\n}\n.driver-avatar--purple[data-v-3ecfca82] { background: #f3e8ff; color: #7c3aed;\n}\n.trip-badge[data-v-3ecfca82] {\n    display: inline-flex; align-items: center;\n    font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 20px;\n}\n.trip-badge--green[data-v-3ecfca82]  { background: #dcfce7; color: #16a34a;\n}\n.trip-badge--blue[data-v-3ecfca82]   { background: #e0f2fe; color: #0284c7;\n}\n.trip-badge--orange[data-v-3ecfca82] { background: #fff7ed; color: #ea580c;\n}\n.recon-tiles[data-v-3ecfca82] { display: flex; gap: 16px; flex-wrap: wrap;\n}\n.recon-tile[data-v-3ecfca82] {\n    flex: 1; min-width: 130px;\n    background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; padding: 16px;\n}\n.recon-tile--blue[data-v-3ecfca82]  { border-color: #bfdbfe; background: #eff6ff;\n}\n.recon-tile--red[data-v-3ecfca82]   { border-color: #fecaca; background: #fff5f5;\n}\n.recon-tile--green[data-v-3ecfca82] { border-color: #bbf7d0; background: #f0fdf4;\n}\n.recon-tile__label[data-v-3ecfca82] {\n    font-size: 11px; font-weight: 700; text-transform: uppercase;\n    letter-spacing: 0.06em; color: #9ca3af; margin-bottom: 6px;\n}\n.recon-tile__value[data-v-3ecfca82] { font-size: 22px; font-weight: 800; color: #111827;\n}\n.recon-tile__value--blue[data-v-3ecfca82]  { color: #2563eb;\n}\n.recon-tile__value--red[data-v-3ecfca82]   { color: #dc2626;\n}\n.recon-tile__value--green[data-v-3ecfca82] { color: #16a34a;\n}\n.analytics-row[data-v-3ecfca82] {\n    display: flex; align-items: center; gap: 12px;\n    padding: 14px 16px; border-bottom: 1px solid #f0f0f0;\n}\n.analytics-row[data-v-3ecfca82]:last-child { border-bottom: none;\n}\n.analytics-row__icon[data-v-3ecfca82] {\n    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;\n    display: flex; align-items: center; justify-content: center; font-size: 15px;\n}\n.analytics-row__icon--green[data-v-3ecfca82]  { background: #e8f8f1; color: #22c55e;\n}\n.analytics-row__icon--blue[data-v-3ecfca82]   { background: #e8f0fe; color: #4f8ef7;\n}\n.analytics-row__icon--purple[data-v-3ecfca82] { background: #f3e8ff; color: #a855f7;\n}\n.analytics-row__icon--orange[data-v-3ecfca82] { background: #fff4e5; color: #f97316;\n}\n.analytics-row__icon--dark[data-v-3ecfca82]   { background: #e5e7eb; color: #374151;\n}\n.analytics-row__body[data-v-3ecfca82] { flex: 1;\n}\n.analytics-row__label[data-v-3ecfca82] { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;\n}\n.analytics-row__value[data-v-3ecfca82] { font-size: 16px; font-weight: 700; color: #111827;\n}\n.analytics-row__badge[data-v-3ecfca82] { flex-shrink: 0;\n}\n.footer-label[data-v-3ecfca82] { font-size: 10px; text-transform: uppercase; letter-spacing: 0.07em; color: #9ca3af; font-weight: 700;\n}\n.footer-value[data-v-3ecfca82] { font-size: 16px; font-weight: 800; color: #111827;\n}\n.footer-divider[data-v-3ecfca82] { width: 1px; height: 36px; background: #e5e7eb; flex-shrink: 0;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_style_index_0_id_3ecfca82_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_style_index_0_id_3ecfca82_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_style_index_0_id_3ecfca82_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Sellers/TripReconciliation.vue":
/*!***********************************************************!*\
  !*** ./resources/js/views/Sellers/TripReconciliation.vue ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TripReconciliation_vue_vue_type_template_id_3ecfca82_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TripReconciliation.vue?vue&type=template&id=3ecfca82&scoped=true */ "./resources/js/views/Sellers/TripReconciliation.vue?vue&type=template&id=3ecfca82&scoped=true");
/* harmony import */ var _TripReconciliation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TripReconciliation.vue?vue&type=script&lang=js */ "./resources/js/views/Sellers/TripReconciliation.vue?vue&type=script&lang=js");
/* harmony import */ var _TripReconciliation_vue_vue_type_style_index_0_id_3ecfca82_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css */ "./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _TripReconciliation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _TripReconciliation_vue_vue_type_template_id_3ecfca82_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _TripReconciliation_vue_vue_type_template_id_3ecfca82_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "3ecfca82",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Sellers/TripReconciliation.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Sellers/TripReconciliation.vue?vue&type=script&lang=js":
/*!***********************************************************************************!*\
  !*** ./resources/js/views/Sellers/TripReconciliation.vue?vue&type=script&lang=js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TripReconciliation.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css":
/*!*******************************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_style_index_0_id_3ecfca82_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=style&index=0&id=3ecfca82&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Sellers/TripReconciliation.vue?vue&type=template&id=3ecfca82&scoped=true":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/views/Sellers/TripReconciliation.vue?vue&type=template&id=3ecfca82&scoped=true ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_template_id_3ecfca82_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_template_id_3ecfca82_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TripReconciliation_vue_vue_type_template_id_3ecfca82_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TripReconciliation.vue?vue&type=template&id=3ecfca82&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=template&id=3ecfca82&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=template&id=3ecfca82&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Sellers/TripReconciliation.vue?vue&type=template&id=3ecfca82&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************************/
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
  return _c("div", [
    _c("div", { staticClass: "page-heading" }, [
      _c("div", { staticClass: "page-title" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("trip_reconciliation")))]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-12 col-md-6 order-md-2 order-first" }, [
            _c(
              "nav",
              {
                staticClass: "breadcrumb-header float-start float-lg-end",
                attrs: { "aria-label": "breadcrumb" },
              },
              [
                _c("ol", { staticClass: "breadcrumb" }, [
                  _c(
                    "li",
                    { staticClass: "breadcrumb-item" },
                    [
                      _c(
                        "router-link",
                        { attrs: { to: "/seller/dashboard" } },
                        [_vm._v(_vm._s(_vm.__("dashboard")))]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "li",
                    { staticClass: "breadcrumb-item" },
                    [
                      _c("router-link", { attrs: { to: "/seller/trips" } }, [
                        _vm._v(_vm._s(_vm.__("trips"))),
                      ]),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "li",
                    {
                      staticClass: "breadcrumb-item active",
                      attrs: { "aria-current": "page" },
                    },
                    [_vm._v(_vm._s(_vm.__("trip_reconciliation")))]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _vm.loading
        ? _c("section", { staticClass: "section" }, [
            _c(
              "div",
              { staticClass: "text-center py-5" },
              [_c("b-spinner")],
              1
            ),
          ])
        : !_vm.settlement
        ? _c("section", { staticClass: "section" }, [
            _c("div", { staticClass: "card" }, [
              _c(
                "div",
                { staticClass: "card-body text-center text-muted py-5" },
                [_vm._v(_vm._s(_vm.__("trip_not_found")))]
              ),
            ]),
          ])
        : _c("section", { staticClass: "section" }, [
            _c("div", { staticClass: "card mb-4 trip-header" }, [
              _c(
                "div",
                {
                  staticClass:
                    "card-body d-flex flex-wrap justify-content-between align-items-center gap-3",
                },
                [
                  _c(
                    "div",
                    { staticClass: "d-flex align-items-center gap-3" },
                    [
                      _c(
                        "div",
                        {
                          staticClass: "driver-avatar",
                          class:
                            _vm.tripType === "salesman"
                              ? "driver-avatar--purple"
                              : "",
                        },
                        [
                          _c("i", {
                            class:
                              _vm.tripType === "salesman"
                                ? "fa fa-user-tie"
                                : "fa fa-truck",
                          }),
                        ]
                      ),
                      _vm._v(" "),
                      _c("div", [
                        _c("div", { staticClass: "fw-bold fs-5" }, [
                          _vm._v(
                            _vm._s(
                              _vm.settlement.person
                                ? _vm.settlement.person.name
                                : "-"
                            )
                          ),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "text-muted small" }, [
                          _c(
                            "span",
                            {
                              staticClass: "badge me-1",
                              class:
                                _vm.tripType === "salesman"
                                  ? "bg-purple"
                                  : "bg-info",
                            },
                            [
                              _vm._v(
                                "\n                                    " +
                                  _vm._s(
                                    _vm.tripType === "salesman"
                                      ? _vm.__("salesman")
                                      : _vm.__("driver")
                                  ) +
                                  "\n                                "
                              ),
                            ]
                          ),
                          _vm._v(
                            "\n                                " +
                              _vm._s(_vm.settlement.date) +
                              "\n                                 ·  " +
                              _vm._s(_vm.__("total_orders")) +
                              ": " +
                              _vm._s(_vm.orders.length) +
                              "\n                            "
                          ),
                        ]),
                      ]),
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "d-flex align-items-center gap-2" },
                    [
                      _c(
                        "span",
                        {
                          staticClass: "trip-badge",
                          class: _vm.statusBadgeClass(_vm.settlement.status),
                        },
                        [
                          _c("i", {
                            staticClass: "me-1",
                            class: _vm.statusIcon(_vm.settlement.status),
                          }),
                          _vm._v(
                            "\n                            " +
                              _vm._s(_vm.settlement.status_text) +
                              "\n                        "
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "button",
                        {
                          staticClass: "btn btn-sm btn-outline-secondary",
                          on: { click: _vm.exportReport },
                        },
                        [
                          _c("i", { staticClass: "fa fa-download me-1" }),
                          _vm._v(
                            _vm._s(_vm.__("export_report")) +
                              "\n                        "
                          ),
                        ]
                      ),
                    ]
                  ),
                ]
              ),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "row" }, [
              _c("div", { staticClass: "col-lg-8 mb-4" }, [
                _c("div", { staticClass: "card h-100" }, [
                  _c(
                    "div",
                    {
                      staticClass:
                        "card-header d-flex justify-content-between align-items-center",
                    },
                    [
                      _c("h5", { staticClass: "card-title mb-0" }, [
                        _vm._v(_vm._s(_vm.__("collection_reconciliation"))),
                      ]),
                      _vm._v(" "),
                      _vm.settlement.reconciliation_status !== "unreconciled"
                        ? _c("span", { staticClass: "small" }, [
                            _vm._v(
                              "\n                                " +
                                _vm._s(_vm.__("reconciliation_status")) +
                                ":\n                                "
                            ),
                            _c(
                              "span",
                              {
                                staticClass: "fw-semibold",
                                class: _vm.reconStatusClass(
                                  _vm.settlement.reconciliation_status
                                ),
                              },
                              [
                                _c("i", {
                                  staticClass: "me-1",
                                  class: _vm.reconStatusIcon(
                                    _vm.settlement.reconciliation_status
                                  ),
                                }),
                                _vm._v(
                                  "\n                                    " +
                                    _vm._s(
                                      _vm.reconStatusLabel(
                                        _vm.settlement.reconciliation_status
                                      )
                                    ) +
                                    "\n                                "
                                ),
                              ]
                            ),
                          ])
                        : _vm._e(),
                    ]
                  ),
                  _vm._v(" "),
                  _c("div", { staticClass: "card-body" }, [
                    _vm.needsRereconcile
                      ? _c(
                          "div",
                          {
                            staticClass: "alert alert-warning py-2 small mb-3",
                          },
                          [
                            _c("i", {
                              staticClass: "fa fa-exclamation-triangle me-1",
                            }),
                            _vm._v(
                              "\n                                New payments collected after reconciliation — please verify and re-reconcile.\n                            "
                            ),
                          ]
                        )
                      : _vm._e(),
                    _vm._v(" "),
                    _c("div", { staticClass: "recon-tiles mb-4" }, [
                      _c("div", { staticClass: "recon-tile" }, [
                        _c("div", { staticClass: "recon-tile__label" }, [
                          _vm._v(_vm._s(_vm.__("total_expected"))),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "recon-tile__value" }, [
                          _vm._v(
                            _vm._s(_vm.$currency) +
                              " " +
                              _vm._s(_vm.fmt(_vm.totals.total_expected))
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "recon-tile recon-tile--blue" },
                        [
                          _c("div", { staticClass: "recon-tile__label" }, [
                            _vm._v(_vm._s(_vm.__("digital_verified"))),
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            {
                              staticClass:
                                "recon-tile__value recon-tile__value--blue",
                            },
                            [
                              _vm._v(
                                _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(_vm.fmt(_vm.totals.digital_verified))
                              ),
                            ]
                          ),
                        ]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "recon-tile recon-tile--red" }, [
                        _c("div", { staticClass: "recon-tile__label" }, [
                          _vm._v(_vm._s(_vm.__("cash_expected"))),
                        ]),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass:
                              "recon-tile__value recon-tile__value--red",
                          },
                          [
                            _vm._v(
                              _vm._s(_vm.$currency) +
                                " " +
                                _vm._s(_vm.fmt(_vm.totals.cash_expected))
                            ),
                          ]
                        ),
                      ]),
                    ]),
                    _vm._v(" "),
                    _vm.totals.unverified_digital > 0 && !_vm.isClosed
                      ? _c(
                          "div",
                          { staticClass: "alert alert-danger py-2 small mb-0" },
                          [
                            _c("i", { staticClass: "fa fa-lock me-1" }),
                            _vm._v(
                              "\n                                " +
                                _vm._s(_vm.totals.unverified_digital) +
                                " " +
                                _vm._s(
                                  _vm.__("digital_payment_pending_verify")
                                ) +
                                "\n                            "
                            ),
                          ]
                        )
                      : _vm._e(),
                  ]),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-4 mb-4" }, [
                _c("div", { staticClass: "card h-100" }, [
                  _c("div", { staticClass: "card-header" }, [
                    _c("h5", { staticClass: "card-title mb-0" }, [
                      _vm._v(_vm._s(_vm.__("payment_summary"))),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "card-body p-0" }, [
                    _vm.totals.total_cash > 0
                      ? _c("div", { staticClass: "analytics-row" }, [
                          _vm._m(0),
                          _vm._v(" "),
                          _c("div", { staticClass: "analytics-row__body" }, [
                            _c("div", { staticClass: "analytics-row__label" }, [
                              _vm._v(_vm._s(_vm.__("cash"))),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "analytics-row__value" }, [
                              _vm._v(
                                _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(_vm.fmt(_vm.totals.total_cash))
                              ),
                            ]),
                          ]),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.totals.total_upi > 0
                      ? _c("div", { staticClass: "analytics-row" }, [
                          _vm._m(1),
                          _vm._v(" "),
                          _c("div", { staticClass: "analytics-row__body" }, [
                            _c("div", { staticClass: "analytics-row__label" }, [
                              _vm._v(_vm._s(_vm.__("upi"))),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "analytics-row__value" }, [
                              _vm._v(
                                _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(_vm.fmt(_vm.totals.total_upi))
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "analytics-row__badge" }, [
                            _c(
                              "span",
                              {
                                staticClass: "small fw-semibold",
                                class:
                                  _vm.totals.verified_upi >=
                                  _vm.totals.total_upi
                                    ? "text-success"
                                    : "text-warning",
                              },
                              [
                                _vm._v(
                                  "\n                                        " +
                                    _vm._s(_vm.$currency) +
                                    " " +
                                    _vm._s(_vm.fmt(_vm.totals.verified_upi)) +
                                    " " +
                                    _vm._s(_vm.__("verified")) +
                                    "\n                                    "
                                ),
                              ]
                            ),
                          ]),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.totals.total_cheque > 0
                      ? _c("div", { staticClass: "analytics-row" }, [
                          _vm._m(2),
                          _vm._v(" "),
                          _c("div", { staticClass: "analytics-row__body" }, [
                            _c("div", { staticClass: "analytics-row__label" }, [
                              _vm._v(_vm._s(_vm.__("cheque"))),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "analytics-row__value" }, [
                              _vm._v(
                                _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(_vm.fmt(_vm.totals.total_cheque))
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "analytics-row__badge" }, [
                            _c(
                              "span",
                              {
                                staticClass: "small fw-semibold",
                                class:
                                  _vm.totals.verified_cheque >=
                                  _vm.totals.total_cheque
                                    ? "text-success"
                                    : "text-warning",
                              },
                              [
                                _vm._v(
                                  "\n                                        " +
                                    _vm._s(_vm.$currency) +
                                    " " +
                                    _vm._s(
                                      _vm.fmt(_vm.totals.verified_cheque)
                                    ) +
                                    " " +
                                    _vm._s(_vm.__("verified")) +
                                    "\n                                    "
                                ),
                              ]
                            ),
                          ]),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.totals.total_signature > 0
                      ? _c("div", { staticClass: "analytics-row" }, [
                          _vm._m(3),
                          _vm._v(" "),
                          _c("div", { staticClass: "analytics-row__body" }, [
                            _c("div", { staticClass: "analytics-row__label" }, [
                              _vm._v(_vm._s(_vm.__("signature"))),
                            ]),
                            _vm._v(" "),
                            _c("div", { staticClass: "analytics-row__value" }, [
                              _vm._v(
                                _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(_vm.fmt(_vm.totals.total_signature))
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c("div", { staticClass: "analytics-row__badge" }, [
                            _c(
                              "span",
                              {
                                staticClass: "small fw-semibold",
                                class:
                                  _vm.totals.verified_signature >=
                                  _vm.totals.total_signature
                                    ? "text-success"
                                    : "text-warning",
                              },
                              [
                                _vm._v(
                                  "\n                                        " +
                                    _vm._s(_vm.$currency) +
                                    " " +
                                    _vm._s(
                                      _vm.fmt(_vm.totals.verified_signature)
                                    ) +
                                    " " +
                                    _vm._s(_vm.__("verified")) +
                                    "\n                                    "
                                ),
                              ]
                            ),
                          ]),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _c("div", { staticClass: "analytics-row" }, [
                      _vm._m(4),
                      _vm._v(" "),
                      _c("div", { staticClass: "analytics-row__body" }, [
                        _c("div", { staticClass: "analytics-row__label" }, [
                          _vm._v(_vm._s(_vm.__("total_expected"))),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "analytics-row__value" }, [
                          _vm._v(
                            _vm._s(_vm.$currency) +
                              " " +
                              _vm._s(_vm.fmt(_vm.totals.total_expected))
                          ),
                        ]),
                      ]),
                    ]),
                  ]),
                ]),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "card" }, [
              _c(
                "div",
                {
                  staticClass:
                    "card-header d-flex justify-content-between align-items-center",
                },
                [
                  _c("h5", { staticClass: "card-title mb-0" }, [
                    _vm._v(_vm._s(_vm.__("order_settlement_details"))),
                  ]),
                  _vm._v(" "),
                  _c("span", { staticClass: "text-muted small" }, [
                    _vm._v(
                      _vm._s(_vm.__("showing")) +
                        " " +
                        _vm._s(_vm.orders.length) +
                        " " +
                        _vm._s(_vm.__("orders"))
                    ),
                  ]),
                ]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "card-body p-0" }, [
                _vm.orders.length === 0
                  ? _c("div", { staticClass: "text-center text-muted py-4" }, [
                      _c("i", {
                        staticClass: "fa fa-inbox fa-2x mb-2 d-block",
                      }),
                      _vm._v(
                        "\n                        " +
                          _vm._s(_vm.__("no_data_found")) +
                          "\n                    "
                      ),
                    ])
                  : _c("div", { staticClass: "table-responsive" }, [
                      _c(
                        "table",
                        {
                          staticClass: "table table-bordered align-middle mb-0",
                        },
                        [
                          _c("thead", { staticClass: "table-light" }, [
                            _c("tr", [
                              _c(
                                "th",
                                {
                                  staticClass: "ps-3",
                                  staticStyle: { width: "90px" },
                                },
                                [_vm._v(_vm._s(_vm.__("order")) + " #")]
                              ),
                              _vm._v(" "),
                              _c("th", { staticStyle: { width: "110px" } }, [
                                _vm._v(_vm._s(_vm.__("loading_slip"))),
                              ]),
                              _vm._v(" "),
                              _c("th", [_vm._v(_vm._s(_vm.__("retailer")))]),
                              _vm._v(" "),
                              _c(
                                "th",
                                {
                                  staticClass: "text-end",
                                  staticStyle: { width: "110px" },
                                },
                                [_vm._v(_vm._s(_vm.__("order_value")))]
                              ),
                              _vm._v(" "),
                              _c(
                                "th",
                                {
                                  staticClass: "text-end",
                                  staticStyle: { width: "100px" },
                                },
                                [_vm._v(_vm._s(_vm.__("shortfall")))]
                              ),
                              _vm._v(" "),
                              _c("th", { staticStyle: { width: "120px" } }, [
                                _vm._v(_vm._s(_vm.__("method"))),
                              ]),
                              _vm._v(" "),
                              _c(
                                "th",
                                {
                                  staticClass: "text-end",
                                  staticStyle: { width: "110px" },
                                },
                                [_vm._v(_vm._s(_vm.__("collected")))]
                              ),
                              _vm._v(" "),
                              _c(
                                "th",
                                {
                                  staticClass: "text-center",
                                  staticStyle: { width: "70px" },
                                },
                                [_vm._v(_vm._s(_vm.__("proof")))]
                              ),
                              _vm._v(" "),
                              _c(
                                "th",
                                {
                                  staticClass: "text-center",
                                  staticStyle: { width: "100px" },
                                },
                                [_vm._v(_vm._s(_vm.__("status")))]
                              ),
                            ]),
                          ]),
                          _vm._v(" "),
                          _c(
                            "tbody",
                            _vm._l(_vm.flatRows, function (row) {
                              return _c(
                                "tr",
                                {
                                  key: row.paymentId || "empty_" + row.orderId,
                                },
                                [
                                  row.isFirst
                                    ? _c(
                                        "td",
                                        {
                                          staticClass:
                                            "ps-3 fw-semibold text-primary",
                                          attrs: { rowspan: row.rowspan },
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        #" +
                                              _vm._s(row.ordersId) +
                                              "\n                                    "
                                          ),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  row.isFirst
                                    ? _c(
                                        "td",
                                        { attrs: { rowspan: row.rowspan } },
                                        [
                                          row.loadingSlipNo
                                            ? _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "badge bg-secondary",
                                                },
                                                [
                                                  _vm._v(
                                                    _vm._s(row.loadingSlipNo)
                                                  ),
                                                ]
                                              )
                                            : _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "text-muted small",
                                                },
                                                [_vm._v("—")]
                                              ),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  row.isFirst
                                    ? _c(
                                        "td",
                                        { attrs: { rowspan: row.rowspan } },
                                        [
                                          _c(
                                            "div",
                                            { staticClass: "fw-semibold" },
                                            [_vm._v(_vm._s(row.retailerName))]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "div",
                                            { staticClass: "text-muted small" },
                                            [_vm._v(_vm._s(row.retailerMobile))]
                                          ),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  row.isFirst
                                    ? _c(
                                        "td",
                                        {
                                          staticClass: "text-end fw-bold",
                                          attrs: { rowspan: row.rowspan },
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        " +
                                              _vm._s(_vm.$currency) +
                                              " " +
                                              _vm._s(_vm.fmt(row.finalTotal)) +
                                              "\n                                    "
                                          ),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  row.isFirst
                                    ? _c(
                                        "td",
                                        {
                                          staticClass: "text-end",
                                          attrs: { rowspan: row.rowspan },
                                        },
                                        [
                                          row.orderShortfall > 0.005
                                            ? _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "text-danger fw-bold small",
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                            - " +
                                                      _vm._s(_vm.$currency) +
                                                      " " +
                                                      _vm._s(
                                                        _vm.fmt(
                                                          row.orderShortfall
                                                        )
                                                      ) +
                                                      "\n                                        "
                                                  ),
                                                ]
                                              )
                                            : row.orderShortfall < -0.005
                                            ? _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "text-primary fw-bold small",
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                            + " +
                                                      _vm._s(_vm.$currency) +
                                                      " " +
                                                      _vm._s(
                                                        _vm.fmt(
                                                          Math.abs(
                                                            row.orderShortfall
                                                          )
                                                        )
                                                      ) +
                                                      "\n                                        "
                                                  ),
                                                ]
                                              )
                                            : _c(
                                                "span",
                                                { staticClass: "text-success" },
                                                [
                                                  _c("i", {
                                                    staticClass:
                                                      "fa fa-check-circle",
                                                  }),
                                                ]
                                              ),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  row.isEmpty
                                    ? _c(
                                        "td",
                                        {
                                          staticClass:
                                            "text-muted text-center small",
                                          attrs: { colspan: "4" },
                                        },
                                        [
                                          _vm._v(
                                            "\n                                        " +
                                              _vm._s(
                                                _vm.__("no_payment_recorded")
                                              ) +
                                              "\n                                    "
                                          ),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  !row.isEmpty
                                    ? [
                                        _c("td", [
                                          _c(
                                            "span",
                                            {
                                              staticClass: "badge",
                                              class: _vm.methodBadgeClass(
                                                row.method
                                              ),
                                            },
                                            [
                                              _c("i", {
                                                staticClass: "me-1",
                                                class: _vm.methodIcon(
                                                  row.method
                                                ),
                                              }),
                                              _vm._v(
                                                _vm._s(row.method) +
                                                  "\n                                            "
                                              ),
                                            ]
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c(
                                          "td",
                                          {
                                            staticClass: "text-end fw-semibold",
                                          },
                                          [
                                            _vm._v(
                                              _vm._s(_vm.$currency) +
                                                " " +
                                                _vm._s(_vm.fmt(row.amount))
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "td",
                                          { staticClass: "text-center" },
                                          [
                                            row.proofPhoto &&
                                            row.method !== "cash"
                                              ? _c(
                                                  "a",
                                                  {
                                                    staticClass:
                                                      "btn btn-sm btn-outline-info",
                                                    attrs: {
                                                      href:
                                                        "/storage/" +
                                                        row.proofPhoto,
                                                      target: "_blank",
                                                    },
                                                  },
                                                  [
                                                    _c("i", {
                                                      staticClass:
                                                        "fa fa-image",
                                                    }),
                                                  ]
                                                )
                                              : _c(
                                                  "span",
                                                  {
                                                    staticClass:
                                                      "text-muted small",
                                                  },
                                                  [_vm._v("—")]
                                                ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "td",
                                          { staticClass: "text-center" },
                                          [
                                            row.method === "cash"
                                              ? _c(
                                                  "span",
                                                  {
                                                    staticClass:
                                                      "text-muted small",
                                                  },
                                                  [_vm._v("—")]
                                                )
                                              : [
                                                  row.paymentStatus ===
                                                  "verified"
                                                    ? _c(
                                                        "span",
                                                        {
                                                          staticClass:
                                                            "text-success small fw-semibold",
                                                        },
                                                        [
                                                          _c("i", {
                                                            staticClass:
                                                              "fa fa-check-circle",
                                                          }),
                                                          _vm._v(
                                                            " " +
                                                              _vm._s(
                                                                _vm.__(
                                                                  "verified"
                                                                )
                                                              ) +
                                                              "\n                                                "
                                                          ),
                                                        ]
                                                      )
                                                    : _c(
                                                        "button",
                                                        {
                                                          staticClass:
                                                            "btn btn-sm btn-outline-success",
                                                          attrs: {
                                                            disabled:
                                                              _vm.verifyingId ===
                                                              row.paymentId,
                                                          },
                                                          on: {
                                                            click: function (
                                                              $event
                                                            ) {
                                                              return _vm.verifyPayment(
                                                                row.paymentId
                                                              )
                                                            },
                                                          },
                                                        },
                                                        [
                                                          _vm.verifyingId ===
                                                          row.paymentId
                                                            ? _c("b-spinner", {
                                                                attrs: {
                                                                  small: "",
                                                                },
                                                              })
                                                            : _c("i", {
                                                                staticClass:
                                                                  "fa fa-check",
                                                              }),
                                                          _vm._v(
                                                            "\n                                                    " +
                                                              _vm._s(
                                                                _vm.__("verify")
                                                              ) +
                                                              "\n                                                "
                                                          ),
                                                        ],
                                                        1
                                                      ),
                                                ],
                                          ],
                                          2
                                        ),
                                      ]
                                    : _vm._e(),
                                ],
                                2
                              )
                            }),
                            0
                          ),
                          _vm._v(" "),
                          _c("tfoot", { staticClass: "table-light fw-bold" }, [
                            _c("tr", [
                              _c(
                                "td",
                                {
                                  staticClass: "ps-3 text-end",
                                  attrs: { colspan: "4" },
                                },
                                [_vm._v(_vm._s(_vm.__("total")))]
                              ),
                              _vm._v(" "),
                              _c(
                                "td",
                                {
                                  staticClass: "text-end",
                                  class:
                                    _vm.overallShortfall > 0
                                      ? "text-danger"
                                      : _vm.overallShortfall < 0
                                      ? "text-primary"
                                      : "text-success",
                                },
                                [
                                  _vm.overallShortfall > 0
                                    ? [
                                        _vm._v(
                                          "- " +
                                            _vm._s(_vm.$currency) +
                                            " " +
                                            _vm._s(
                                              _vm.fmt(_vm.overallShortfall)
                                            )
                                        ),
                                      ]
                                    : _vm.overallShortfall < 0
                                    ? [
                                        _vm._v(
                                          "+ " +
                                            _vm._s(_vm.$currency) +
                                            " " +
                                            _vm._s(
                                              _vm.fmt(
                                                Math.abs(_vm.overallShortfall)
                                              )
                                            )
                                        ),
                                      ]
                                    : [
                                        _c("i", {
                                          staticClass: "fa fa-check-circle",
                                        }),
                                      ],
                                ],
                                2
                              ),
                              _vm._v(" "),
                              _c("td"),
                              _vm._v(" "),
                              _c("td", { staticClass: "text-end" }, [
                                _vm._v(
                                  _vm._s(_vm.$currency) +
                                    " " +
                                    _vm._s(_vm.fmt(_vm.totals.total_collected))
                                ),
                              ]),
                              _vm._v(" "),
                              _c("td", { attrs: { colspan: "2" } }),
                            ]),
                          ]),
                        ]
                      ),
                    ]),
              ]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "card mt-3" }, [
              _c(
                "div",
                {
                  staticClass:
                    "card-body d-flex align-items-center gap-4 flex-wrap",
                },
                [
                  _c("div", { staticClass: "me-2" }, [
                    _c("div", { staticClass: "footer-label" }, [
                      _vm._v(_vm._s(_vm.__("cash"))),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "footer-value text-success" }, [
                      _vm._v(
                        _vm._s(_vm.$currency) +
                          " " +
                          _vm._s(_vm.fmt(_vm.totals.total_cash))
                      ),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "footer-divider" }),
                  _vm._v(" "),
                  _vm.totals.total_upi > 0
                    ? _c("div", { staticClass: "me-2" }, [
                        _c("div", { staticClass: "footer-label" }, [
                          _vm._v(_vm._s(_vm.__("upi"))),
                        ]),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "footer-value text-primary" },
                          [
                            _vm._v(
                              _vm._s(_vm.$currency) +
                                " " +
                                _vm._s(_vm.fmt(_vm.totals.total_upi))
                            ),
                          ]
                        ),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.totals.total_upi > 0
                    ? _c("div", { staticClass: "footer-divider" })
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.totals.total_cheque > 0
                    ? _c("div", { staticClass: "me-2" }, [
                        _c("div", { staticClass: "footer-label" }, [
                          _vm._v(_vm._s(_vm.__("cheque"))),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "footer-value text-info" }, [
                          _vm._v(
                            _vm._s(_vm.$currency) +
                              " " +
                              _vm._s(_vm.fmt(_vm.totals.total_cheque))
                          ),
                        ]),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.totals.total_cheque > 0
                    ? _c("div", { staticClass: "footer-divider" })
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.totals.total_signature > 0
                    ? _c("div", { staticClass: "me-2" }, [
                        _c("div", { staticClass: "footer-label" }, [
                          _vm._v(_vm._s(_vm.__("signature"))),
                        ]),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "footer-value text-warning" },
                          [
                            _vm._v(
                              _vm._s(_vm.$currency) +
                                " " +
                                _vm._s(_vm.fmt(_vm.totals.total_signature))
                            ),
                          ]
                        ),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _vm.totals.total_signature > 0
                    ? _c("div", { staticClass: "footer-divider" })
                    : _vm._e(),
                  _vm._v(" "),
                  _c("div", { staticClass: "me-2" }, [
                    _c("div", { staticClass: "footer-label" }, [
                      _vm._v(_vm._s(_vm.__("reconciliation_status"))),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "footer-value" }, [
                      _c(
                        "span",
                        {
                          class: _vm.reconStatusClass(
                            _vm.settlement.reconciliation_status
                          ),
                        },
                        [
                          _c("i", {
                            staticClass: "me-1",
                            class: _vm.reconStatusIcon(
                              _vm.settlement.reconciliation_status
                            ),
                          }),
                          _vm._v(
                            "\n                                " +
                              _vm._s(
                                _vm.reconStatusLabel(
                                  _vm.settlement.reconciliation_status
                                )
                              ) +
                              "\n                            "
                          ),
                        ]
                      ),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "ms-auto" }, [
                    !_vm.isClosed
                      ? _c(
                          "button",
                          {
                            staticClass: "btn btn-primary",
                            attrs: {
                              disabled: _vm.closing || !_vm.canCloseNow,
                            },
                            on: { click: _vm.closeTrip },
                          },
                          [
                            _vm.closing
                              ? _c("b-spinner", {
                                  staticClass: "me-1",
                                  attrs: { small: "" },
                                })
                              : _c("i", {
                                  staticClass: "fa fa-check-circle me-1",
                                }),
                            _vm._v(
                              "\n                            " +
                                _vm._s(
                                  _vm.needsRereconcile
                                    ? "Re-Reconcile"
                                    : _vm.__("close_and_reconcile")
                                ) +
                                "\n                        "
                            ),
                          ],
                          1
                        )
                      : _c(
                          "span",
                          { staticClass: "text-success fw-semibold" },
                          [
                            _c("i", { staticClass: "fa fa-check-circle me-1" }),
                            _vm._v(
                              _vm._s(_vm.__("trip_reconciled")) +
                                "\n                        "
                            ),
                          ]
                        ),
                  ]),
                ]
              ),
            ]),
          ]),
    ]),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "analytics-row__icon analytics-row__icon--green" },
      [_c("i", { staticClass: "fa fa-money" })]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "analytics-row__icon analytics-row__icon--blue" },
      [_c("i", { staticClass: "fa fa-mobile" })]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "analytics-row__icon analytics-row__icon--purple" },
      [_c("i", { staticClass: "fa fa-file-text" })]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "analytics-row__icon analytics-row__icon--orange" },
      [_c("i", { staticClass: "fa fa-pencil" })]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      { staticClass: "analytics-row__icon analytics-row__icon--dark" },
      [_c("i", { staticClass: "fa fa-calculator" })]
    )
  },
]
render._withStripped = true



/***/ })

}]);