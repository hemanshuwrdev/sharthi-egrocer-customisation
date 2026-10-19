"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Orders_ViewOrder_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=script&lang=js":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=script&lang=js ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Auth.js */ "./resources/js/Auth.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    var _ref;
    return _ref = {
      login_user: _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user,
      isLoading: false,
      isLoadingDboy: false,
      isLoadingUstatus: false,
      isLoadingCancel: false,
      id: null,
      order: [],
      order_items: [],
      whatsapp_message: "",
      order_status_id: "",
      selectedItems: [],
      select: '',
      all_select: false,
      statuses: '',
      status_id: '',
      deliveryBoys: '',
      delivery_boy_id: '',
      itemModalShow: false,
      item: '',
      userRole: ''
    }, _defineProperty(_ref, "order", {
      order_id: '' // Replace with the actual order ID
    }), _defineProperty(_ref, "credit_notes", []), _defineProperty(_ref, "isDownloadingCreditNote", false), _defineProperty(_ref, "creditNotePreviewShow", false), _defineProperty(_ref, "creditNotePreviewLoading", false), _defineProperty(_ref, "creditNotePreview", {
      headers: [],
      rows: []
    }), _ref;
  },
  computed: {
    // What is still payable. remaining_final is empty on some older orders; show the final total then
    // rather than a false 0.00.
    payableTotal: function payableTotal() {
      var o = this.order || {};
      return o.remaining_final !== null && o.remaining_final !== undefined && o.remaining_final !== '' ? o.remaining_final : o.final_total;
    },
    // Sum of the lines still active (cancelled / returned ones don't count), for the table footer.
    itemsSubtotal: function itemsSubtotal() {
      return (this.order_items || []).filter(function (i) {
        return i.active_status != 7 && i.active_status != 8;
      }).reduce(function (sum, i) {
        return sum + (parseFloat(i.sub_total) || 0);
      }, 0);
    },
    isSellerRoute: function isSellerRoute() {
      // Use this.$route to access the current route
      return this.$route.path.startsWith('/seller/');
    },
    isDeliveryBoyRoute: function isDeliveryBoyRoute() {
      // Use this.$route to access the current route
      return this.$route.path.startsWith('/delivery_boy/');
    },
    viewProductRoute: function viewProductRoute() {
      // Define route configurations based on user roles
      if (this.item.master_product_id) {
        if (this.login_user.role.name === 'Seller') {
          return {
            name: 'SellerMyProducts',
            query: {
              master_product_id: this.item.master_product_id
            }
          };
        }
        return {
          name: 'EditMasterProduct',
          params: {
            id: this.item.master_product_id
          }
        };
      }
      var routeConfig = null;
      switch (this.login_user.role.name) {
        case 'Seller':
          routeConfig = {
            name: 'SellerViewProduct',
            params: {
              id: this.item.product_id
            }
          };
          break;
        case 'Delivery Boy':
          routeConfig = {
            name: 'DeliveryBoyViewProduct',
            params: {
              id: this.item.product_id
            }
          };
          break;
        case 'Admin':
          routeConfig = {
            name: 'ViewProduct',
            params: {
              id: this.item.product_id
            }
          };
          break;
        case 'Super Admin':
          routeConfig = {
            name: 'ViewProduct',
            params: {
              id: this.item.product_id
            }
          };
          break;
        default:
          // Handle any other roles or cases
          break;
      }
      return routeConfig;
    }
  },
  created: function created() {
    this.id = this.$route.params.id;
    //this.record = this.$route.params.record;
    if (this.id) {
      this.getOrderStatus();
      this.getOrder();
    }
  },
  methods: {
    num: function num(v) {
      return parseFloat(v) || 0;
    },
    // 5335 -> "5,335.00"
    money: function money(v) {
      return this.num(v).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    // Colour for a status badge, by order_status_lists id (see OrderStatusList).
    statusBadgeClass: function statusBadgeClass(statusId) {
      var id = parseInt(statusId, 10);
      if ([6, 11].includes(id)) return 'bg-success'; // delivered, picked up
      if ([7, 8].includes(id)) return 'bg-danger'; // cancelled, returned
      if (id === 5) return 'bg-info'; // out for delivery
      if ([12, 13].includes(id)) return 'bg-warning text-dark'; // rescheduled, partial delivery
      if ([2, 3, 4, 10].includes(id)) return 'bg-primary'; // received .. ready for pickup
      return 'bg-secondary';
    },
    // The order endpoint already returns the photo as a full URL; only prefix the storage URL when
    // it is a bare path (prefixing a full URL made "storage/https://.../storage/...").
    damagePhotoUrl: function damagePhotoUrl(photo) {
      if (!photo) return '';
      return /^https?:\/\//i.test(photo) ? photo : this.$storageUrl + photo;
    },
    hasShortfall: function hasShortfall(item) {
      return !!item.shortfall_reason || item.delivered_quantity !== null && item.delivered_quantity !== undefined && item.delivered_quantity < item.quantity;
    },
    // Where "view product" goes, per who is looking and what kind of product the line is.
    productRoute: function productRoute(item) {
      if (this.isSellerRoute && item.master_product_id) {
        return {
          name: 'SellerMyProducts',
          query: {
            master_product_id: item.master_product_id
          }
        };
      }
      if (this.isSellerRoute) {
        return {
          name: 'SellerViewProduct',
          params: {
            id: item.product_id
          }
        };
      }
      if (this.isDeliveryBoyRoute) {
        return {
          name: 'DeliveryBoyViewProduct',
          params: {
            id: item.product_id
          }
        };
      }
      if (item.master_product_id) {
        return {
          name: 'EditMasterProduct',
          params: {
            id: item.master_product_id
          }
        };
      }
      return {
        name: 'ViewProduct',
        params: {
          id: item.product_id
        }
      };
    },
    getDisplayName: function getDisplayName(name) {
      if (name == null) return '';
      if (typeof name === 'string') return name;
      if (_typeof(name) === 'object' && !Array.isArray(name)) {
        if ('name' in name && 'lang' in name) return String(name.name || '').trim();
        var appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
        var forLocale = name[appLocale];
        if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
        var firstNonEmpty = Object.values(name).find(function (val) {
          return val != null && String(val).trim() !== '';
        });
        return firstNonEmpty != null ? String(firstNonEmpty).trim() : '';
      }
      return '';
    },
    getStatusDisplayName: function getStatusDisplayName(status) {
      if (!status) return '';
      var sn = status.status_name;
      if (sn == null) return status.status || '';
      if (typeof sn === 'string') return sn.trim() || status.status || '';
      if (_typeof(sn) === 'object' && !Array.isArray(sn)) {
        var appLocale = window.appLocale || window.localStorage.getItem('lang') || 'en';
        var forLocale = sn[appLocale];
        if (forLocale != null && String(forLocale).trim() !== '') return String(forLocale).trim();
        var first = Object.values(sn).find(function (val) {
          return val != null && String(val).trim() !== '';
        });
        return first != null ? String(first).trim() : status.status || '';
      }
      return status.status || '';
    },
    getOrderStatus: function getOrderStatus() {
      var _this = this;
      var vm = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/order_statuses').then(function (response) {
        _this.isLoading = false;
        var data = response.data;
        var statusesToRemoveIds = [1, 4, 7, 8];
        _this.statuses = data.data.filter(function (status) {
          return !statusesToRemoveIds.includes(status.id);
        });
      })["catch"](function (error) {
        vm.isLoading = false;
        if (error.request.statusText) {
          _this.showError(error.request.statusText);
        } else if (error.message) {
          _this.showError(error.message);
        } else {
          _this.showError("Something went wrong!");
        }
      });
    },
    formatDate: function formatDate(dateTime) {
      var date = new Date(dateTime);
      var day = date.getDate().toString().padStart(2, '0');
      var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
      var year = date.getFullYear();
      return "".concat(day, "-").concat(month, "-").concat(year);
    },
    creditNoteTypeLabel: function creditNoteTypeLabel(reasonType) {
      if (reasonType === 'return') return 'Sales Return';
      if (reasonType === 'partial') return 'Partial Delivery';
      return 'Order Cancelled';
    },
    // Same header + rows the Credit Note Excel export produces for this order.
    openCreditNotePreview: function openCreditNotePreview() {
      var _this2 = this;
      this.creditNotePreviewShow = true;
      this.creditNotePreviewLoading = true;
      this.creditNotePreview = {
        headers: [],
        rows: []
      };
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$sellerApiUrl + '/credit-notes/preview', {
        params: {
          order_id: this.id
        }
      }).then(function (response) {
        var res = response.data;
        if (res.status == 1 && res.data) {
          _this2.creditNotePreview = {
            headers: res.data.headers || [],
            rows: res.data.rows || []
          };
        } else {
          _this2.showError(res.message || "Failed to load credit note preview!");
        }
      })["catch"](function (error) {
        _this2.showError(error.response && error.response.data && error.response.data.message || error.message || "Failed to load credit note preview!");
      })["finally"](function () {
        _this2.creditNotePreviewLoading = false;
      });
    },
    getOrder: function getOrder() {
      var _this3 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiUrl + '/orders/view/' + this.id).then(function (response) {
        _this3.isLoading = false;
        var data = response.data;
        if (data.status === 1) {
          _this3.order = response.data.data.order;
          _this3.order_items = response.data.data.order_items;
          _this3.deliveryBoys = response.data.data.deliveryBoys;
          _this3.credit_notes = response.data.data.credit_notes || [];
          _this3.delivery_boy_id = _this3.order.delivery_boy_id != 0 && _this3.order.delivery_boy_id != "" ? _this3.order.delivery_boy_id : "";
          _this3.order_status_id = _this3.order.active_status != 0 && _this3.order.active_status != "" ? _this3.order.active_status : "";
        } else {
          _this3.showError(data.message);
          setTimeout(function () {
            _this3.$router.back();
          }, 1000);
        }
      })["catch"](function (error) {
        _this3.isLoading = false;
        if (error.request.statusText) {
          _this3.showError(error.request.statusText);
        } else if (error.message) {
          _this3.showError(error.message);
        } else {
          _this3.showError("Something went wrong!");
        }
      });
    },
    sendInfo: function sendInfo(item) {
      this.item = item;
      this.itemModalShow = true;
    },
    whatsappMessageLink: function whatsappMessageLink(country_code, mobile, user_name, order_id, item_id) {
      return "https://api.whatsapp.com/send?phone=+" + country_code + " " + mobile + "&text=Hello " + user_name + " ,Your order with ID :" + order_id + " is  " + item_id + ". Please take a note of it. If you have further queries feel free to contact us. Thank you.";
    },
    updateStatus: function updateStatus() {
      var _this4 = this;
      var vm = this;
      this.$swal.fire({
        title: "Are you Sure?",
        text: "You want be able to revert this",
        confirmButtonText: "Yes, Sure",
        cancelButtonText: "Cancel",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (result.value) {
          _this4.isLoadingUstatus = true;
          var postData = {
            order_id: _this4.id,
            status_id: _this4.order_status_id
          };
          axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this4.$apiUrl + '/orders/update_status', postData).then(function (response) {
            _this4.isLoadingUstatus = false;
            var data = response.data;
            if (data.status === 1) {
              //this.showSuccess(data.message);
              _this4.order_status_id = '';
              _this4.getOrder();
              _this4.showMessage("success", data.message);
              setTimeout(function () {
                vm.$swal.close();
              }, 2000);
            } else {
              vm.showError(data.message);
              vm.isLoadingUstatus = false;
            }
          })["catch"](function (error) {
            vm.isLoadingUstatus = false;
            _this4.showError("Something went wrong!");
          });
        }
      });
    },
    assignDeliveryBoy: function assignDeliveryBoy() {
      var _this5 = this;
      this.isLoadingDboy = true;
      var postData = {
        order_id: this.id,
        delivery_boy_id: this.delivery_boy_id
      };
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + '/orders/assign_delivery_boy', postData).then(function (response) {
        _this5.isLoadingDboy = false;
        var data = response.data;
        if (data.status === 1) {
          _this5.delivery_boy_id = '';
          _this5.getOrder();
          _this5.showMessage("success", data.message);
          setTimeout(function () {
            vm.$swal.close();
          }, 2000);
        } else {
          _this5.showMessage("error", data.message);
          _this5.isLoadingDboy = false;
        }
      })["catch"](function (error) {
        _this5.isLoadingDboy = false;
        _this5.showError("Something went wrong!");
      });
    },
    downloadInvoice: function downloadInvoice() {
      var _this6 = this;
      this.isLoading = true;
      var postData = {
        order_id: this.id
      };
      axios__WEBPACK_IMPORTED_MODULE_0___default()({
        url: this.$apiUrl + '/orders/invoice_download',
        method: 'post',
        responseType: 'blob',
        data: postData
      }).then(function (response) {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', 'Invoice-No:#' + _this6.id + '.pdf');
        document.body.appendChild(fileLink);
        fileLink.click();
        _this6.isLoading = false;
      })["catch"](function (error) {
        if (error.request.statusText) {
          _this6.showError(error.request.statusText);
        } else if (error.message) {
          _this6.showError(error.message);
        } else {
          _this6.showError("Something went wrong!");
        }
        _this6.isLoading = false;
      });
    },
    downloadCreditNote: function downloadCreditNote(creditNoteId) {
      var _this7 = this;
      this.isDownloadingCreditNote = true;
      var postData = {
        order_id: this.id,
        credit_note_id: creditNoteId
      };
      axios__WEBPACK_IMPORTED_MODULE_0___default()({
        url: this.$apiUrl + '/orders/credit_note_download',
        method: 'post',
        responseType: 'blob',
        data: postData
      }).then(function (response) {
        if (response.data && response.data.type === 'application/json') {
          var reader = new FileReader();
          reader.onload = function () {
            try {
              var res = JSON.parse(reader.result);
              _this7.showError(res.message || "Failed to download credit note!");
            } catch (e) {
              _this7.showError("Failed to download credit note!");
            }
            _this7.isDownloadingCreditNote = false;
          };
          reader.readAsText(response.data);
          return;
        }
        var blob = new Blob([response.data], {
          type: 'application/pdf'
        });
        var fileURL = window.URL.createObjectURL(blob);
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;
        var filename = 'CreditNote-Order-#' + _this7.id + '.pdf';
        if (creditNoteId && _this7.credit_notes) {
          var found = _this7.credit_notes.find(function (c) {
            return c.id === creditNoteId;
          });
          if (found && found.credit_note_no) {
            filename = 'CreditNote-' + found.credit_note_no.replace(/[/\\?%*:|"<>]/g, '_') + '.pdf';
          }
        }
        fileLink.setAttribute('download', filename);
        document.body.appendChild(fileLink);
        fileLink.click();
        setTimeout(function () {
          if (fileLink.parentNode) {
            fileLink.parentNode.removeChild(fileLink);
          }
          window.URL.revokeObjectURL(fileURL);
        }, 200);
        _this7.isDownloadingCreditNote = false;
      })["catch"](function (error) {
        if (error.request && error.request.statusText) {
          _this7.showError(error.request.statusText);
        } else if (error.message) {
          _this7.showError(error.message);
        } else {
          _this7.showError("Failed to download credit note!");
        }
        _this7.isDownloadingCreditNote = false;
      });
    },
    allSelectCheckBox: function allSelectCheckBox() {
      var _this8 = this;
      if (this.all_select == false) {
        this.all_select = true;
        this.order_items.forEach(function (item) {
          _this8.selectedItems.push(item.id);
        });
      } else {
        this.all_select = false;
        this.selectedItems = [];
      }
    },
    selectCheckBox: function selectCheckBox() {
      var uniqueSelectedItems = _toConsumableArray(new Set(this.selectedItems));
      if (this.order_items.length === uniqueSelectedItems.length) {
        this.all_select = true;
      } else {
        this.all_select = false;
      }
    },
    updateItemsStatus: function updateItemsStatus() {
      var _this9 = this;
      var vm = this;
      var uniqueSelectedItems = _toConsumableArray(new Set(this.selectedItems));
      if (uniqueSelectedItems.length !== 0) {
        this.$swal.fire({
          title: "Are you Sure?",
          text: "You want be able to revert this",
          confirmButtonText: "Yes, Sure",
          cancelButtonText: "Cancel",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#37a279',
          cancelButtonColor: '#d33'
        }).then(function (result) {
          if (result.value) {
            var ids = uniqueSelectedItems.toString();
            _this9.isLoading = true;
            var postData = {
              ids: ids,
              status_id: _this9.status_id
            };
            axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this9.$apiUrl + '/orders/update_items_status', postData).then(function (response) {
              _this9.isLoading = false;
              var data = response.data;
              if (data.status === 1) {
                _this9.getOrder();
                _this9.status_id = '';
                _this9.selectedItems = [];
                _this9.all_select = false;
                _this9.showMessage("success", data.message);
                setTimeout(function () {
                  vm.$swal.close();
                }, 2000);
              } else {
                vm.showError(data.message);
                vm.isLoading = false;
              }
            })["catch"](function (error) {
              vm.isLoading = false;
              _this9.showError("Something went wrong!");
            });
          }
        });
      } else {
        this.showWarning("Select at least one record!");
      }
    },
    getAdditionalChargesTotal: function getAdditionalChargesTotal(charges) {
      if (!charges || !Array.isArray(charges)) return 0;
      return charges.reduce(function (total, charge) {
        return total + (parseFloat(charge.amount) || 0);
      }, 0).toFixed(2);
    },
    canCancelItem: function canCancelItem(item) {
      // 6=delivered, 7=cancelled, 8=returned
      return item.active_status != 6 && item.active_status != 7 && item.active_status != 8 && item.active_status != 11; // 11=selfPickupPicked
    },
    cancelOrderItem: function cancelOrderItem(item) {
      var _this10 = this;
      this.$swal.fire({
        title: this.__('are_you_sure'),
        input: 'textarea',
        inputLabel: this.__('cancellation_reason'),
        inputPlaceholder: this.__('enter_cancellation_reason'),
        showCancelButton: true,
        confirmButtonText: this.__('yes_sure'),
        cancelButtonText: this.__('no'),
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33',
        icon: 'warning',
        inputValidator: function inputValidator(value) {
          if (!value || !value.trim()) {
            return _this10.__('cancellation_reason') + ' ' + _this10.__('is_required');
          }
        },
        showLoaderOnConfirm: true,
        allowOutsideClick: function allowOutsideClick() {
          return !_this10.$swal.isLoading();
        },
        preConfirm: function preConfirm(reason) {
          var postData = {
            order_item_id: item.id,
            cancellation_reason: reason
          };
          return axios__WEBPACK_IMPORTED_MODULE_0___default().post(_this10.$apiUrl + '/orders/cancel_order_item', postData).then(function (response) {
            return response.data;
          })["catch"](function (error) {
            _this10.$swal.showValidationMessage('Something went wrong!');
          });
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          var data = result.value;
          if (data.status === 1) {
            _this10.getOrder();
            _this10.showMessage("success", data.message);
          } else {
            _this10.showError(data.message);
          }
        }
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.status-pill[data-v-721c2304] {\n    font-size: 0.85rem;\n}\n\n/* label / value pairs: label column fixed, value wraps */\n.info-list[data-v-721c2304] {\n    display: grid;\n    grid-template-columns: 105px 1fr;\n    gap: 0.55rem 0.75rem;\n}\n.info-list dt[data-v-721c2304] {\n    color: #6c757d;\n    font-weight: 500;\n}\n.info-list dd[data-v-721c2304] {\n    margin: 0;\n    word-break: break-word;\n}\n.money-row[data-v-721c2304] {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    gap: 0.75rem;\n    padding: 0.4rem 0;\n    border-bottom: 1px dashed rgba(128, 128, 128, 0.3);\n}\n.money-row.total[data-v-721c2304] {\n    border-bottom: 0;\n    border-top: 2px solid rgba(128, 128, 128, 0.35);\n    margin-top: 0.4rem;\n    padding-top: 0.7rem;\n    font-size: 1.2rem;\n    font-weight: 700;\n}\n.order-items-table thead th[data-v-721c2304] {\n    background: rgba(128, 128, 128, 0.08);\n    font-size: 0.78rem;\n    text-transform: uppercase;\n    letter-spacing: 0.03em;\n    color: #6c757d;\n    white-space: nowrap;\n}\n\n/* keep the first and last columns off the card edge */\n.order-items-table th[data-v-721c2304]:first-child,\n.order-items-table td[data-v-721c2304]:first-child {\n    padding-left: 1.25rem;\n}\n.order-items-table th[data-v-721c2304]:last-child,\n.order-items-table td[data-v-721c2304]:last-child {\n    padding-right: 1.25rem;\n}\n.order-items-table tfoot td[data-v-721c2304] {\n    border-top: 2px solid rgba(128, 128, 128, 0.35);\n}\n.item-inactive td[data-v-721c2304] {\n    opacity: 0.55;\n}\n.modal-dialog[data-v-721c2304] {\n    border-radius: 20px;\n}\n.credit-note-preview th[data-v-721c2304] {\n    white-space: pre-line;\n    min-width: 150px;\n    background: #f7f7f7;\n    vertical-align: bottom;\n    position: sticky;\n    top: 0;\n}\n.credit-note-preview td[data-v-721c2304] {\n    white-space: nowrap;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_style_index_0_id_721c2304_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_style_index_0_id_721c2304_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_style_index_0_id_721c2304_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Orders/ViewOrder.vue":
/*!*************************************************!*\
  !*** ./resources/js/views/Orders/ViewOrder.vue ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ViewOrder_vue_vue_type_template_id_721c2304_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewOrder.vue?vue&type=template&id=721c2304&scoped=true */ "./resources/js/views/Orders/ViewOrder.vue?vue&type=template&id=721c2304&scoped=true");
/* harmony import */ var _ViewOrder_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewOrder.vue?vue&type=script&lang=js */ "./resources/js/views/Orders/ViewOrder.vue?vue&type=script&lang=js");
/* harmony import */ var _ViewOrder_vue_vue_type_style_index_0_id_721c2304_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css */ "./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _ViewOrder_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _ViewOrder_vue_vue_type_template_id_721c2304_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _ViewOrder_vue_vue_type_template_id_721c2304_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "721c2304",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Orders/ViewOrder.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Orders/ViewOrder.vue?vue&type=script&lang=js":
/*!*************************************************************************!*\
  !*** ./resources/js/views/Orders/ViewOrder.vue?vue&type=script&lang=js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewOrder.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css":
/*!*********************************************************************************************************!*\
  !*** ./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_style_index_0_id_721c2304_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=style&index=0&id=721c2304&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Orders/ViewOrder.vue?vue&type=template&id=721c2304&scoped=true":
/*!*******************************************************************************************!*\
  !*** ./resources/js/views/Orders/ViewOrder.vue?vue&type=template&id=721c2304&scoped=true ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_template_id_721c2304_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_template_id_721c2304_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewOrder_vue_vue_type_template_id_721c2304_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ViewOrder.vue?vue&type=template&id=721c2304&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=template&id=721c2304&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=template&id=721c2304&scoped=true":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Orders/ViewOrder.vue?vue&type=template&id=721c2304&scoped=true ***!
  \**********************************************************************************************************************************************************************************************************************************/
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
    _c(
      "div",
      { staticClass: "page-heading view_order" },
      [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("view_order")))]),
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
                  _vm.isSellerRoute
                    ? _c(
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
                      )
                    : _vm.isDeliveryBoyRoute
                    ? _c(
                        "li",
                        { staticClass: "breadcrumb-item" },
                        [
                          _c(
                            "router-link",
                            { attrs: { to: "/delivery_boy/" } },
                            [_vm._v(_vm._s(_vm.__("dashboard")))]
                          ),
                        ],
                        1
                      )
                    : _c(
                        "li",
                        { staticClass: "breadcrumb-item" },
                        [
                          _c("router-link", { attrs: { to: "/dashboard" } }, [
                            _vm._v(_vm._s(_vm.__("dashboard"))),
                          ]),
                        ],
                        1
                      ),
                  _vm._v(" "),
                  _vm.isSellerRoute
                    ? _c(
                        "li",
                        { staticClass: "breadcrumb-item" },
                        [
                          _c(
                            "router-link",
                            { attrs: { to: "/seller/orders" } },
                            [_vm._v(_vm._s(_vm.__("view_order")))]
                          ),
                        ],
                        1
                      )
                    : _vm.isDeliveryBoyRoute
                    ? _c(
                        "li",
                        { staticClass: "breadcrumb-item" },
                        [
                          _c(
                            "router-link",
                            { attrs: { to: "/delivery_boy/orders" } },
                            [_vm._v(_vm._s(_vm.__("view_order")))]
                          ),
                        ],
                        1
                      )
                    : _c(
                        "li",
                        { staticClass: "breadcrumb-item" },
                        [
                          _c("router-link", { attrs: { to: "/orders" } }, [
                            _vm._v(_vm._s(_vm.__("view_order"))),
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
                    [
                      _vm._v(
                        "\n                            " +
                          _vm._s(_vm.__("order_details")) +
                          "\n                        "
                      ),
                    ]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
        _vm._v(" "),
        _vm.order && _vm.order.order_id
          ? _c("div", { staticClass: "order-view" }, [
              _c("div", { staticClass: "card mb-3" }, [
                _c(
                  "div",
                  {
                    staticClass:
                      "card-body d-flex flex-wrap align-items-center justify-content-between gap-3",
                  },
                  [
                    _c("div", [
                      _c(
                        "div",
                        {
                          staticClass:
                            "d-flex align-items-center flex-wrap gap-2",
                        },
                        [
                          _c("h4", { staticClass: "mb-0" }, [
                            _vm._v(
                              _vm._s(_vm.__("Order")) +
                                " #" +
                                _vm._s(_vm.order.order_id)
                            ),
                          ]),
                          _vm._v(" "),
                          _c(
                            "span",
                            {
                              staticClass: "badge status-pill",
                              class: _vm.statusBadgeClass(
                                _vm.order.active_status
                              ),
                            },
                            [
                              _vm._v(
                                "\n                                " +
                                  _vm._s(
                                    _vm.getDisplayName(
                                      _vm.order.status_name_translation
                                    ) || _vm.order.status_name
                                  ) +
                                  "\n                            "
                              ),
                            ]
                          ),
                          _vm._v(" "),
                          _vm.order.invoice_number
                            ? _c(
                                "span",
                                {
                                  staticClass:
                                    "badge bg-light text-dark border",
                                },
                                [
                                  _vm._v(
                                    "\n                                " +
                                      _vm._s(_vm.order.invoice_number) +
                                      "\n                            "
                                  ),
                                ]
                              )
                            : _vm._e(),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "text-muted small mt-1" },
                        [
                          _vm._v(
                            "\n                            " +
                              _vm._s(_vm.order.orders_created_at) +
                              "\n                            "
                          ),
                          _vm.order.delivery_date
                            ? [
                                _vm._v(
                                  " · " +
                                    _vm._s(_vm.__("delivery_date")) +
                                    ": " +
                                    _vm._s(_vm.order.delivery_date)
                                ),
                              ]
                            : _vm._e(),
                          _vm._v(
                            "\n                            ·\n                            "
                          ),
                          _vm.order.placed_by === "salesman"
                            ? [
                                _vm._v(
                                  _vm._s(_vm.__("salesman")) +
                                    ": " +
                                    _vm._s(_vm.order.salesman_name)
                                ),
                              ]
                            : [_vm._v(_vm._s(_vm.__("retailer")))],
                        ],
                        2
                      ),
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass:
                          "d-flex align-items-center flex-wrap gap-2",
                      },
                      [
                        _vm.order.active_status == _vm.$delivered ||
                        _vm.order.active_status == 6
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
                                staticClass: "btn btn-secondary btn-sm",
                                attrs: {
                                  title: _vm.__("download_invoice"),
                                  disabled: _vm.isLoading,
                                },
                                on: { click: _vm.downloadInvoice },
                              },
                              [
                                _vm.isLoading
                                  ? [
                                      _c("b-spinner", {
                                        attrs: { small: "", label: "Spinning" },
                                      }),
                                      _vm._v(
                                        " " +
                                          _vm._s(_vm.__("downloading")) +
                                          "...\n                            "
                                      ),
                                    ]
                                  : [
                                      _c("i", {
                                        staticClass: "fa fa-download",
                                      }),
                                      _vm._v(
                                        " " +
                                          _vm._s(_vm.__("download_invoice")) +
                                          "\n                            "
                                      ),
                                    ],
                              ],
                              2
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.credit_notes && _vm.credit_notes.length > 0
                          ? [
                              _vm.credit_notes.length === 1
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
                                      staticClass: "btn btn-secondary btn-sm",
                                      attrs: {
                                        disabled: _vm.isDownloadingCreditNote,
                                        title:
                                          "Download Credit Note " +
                                          _vm.credit_notes[0].credit_note_no,
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.downloadCreditNote(
                                            _vm.credit_notes[0].id
                                          )
                                        },
                                      },
                                    },
                                    [
                                      _vm.isDownloadingCreditNote
                                        ? [
                                            _c("b-spinner", {
                                              attrs: {
                                                small: "",
                                                label: "Spinning",
                                              },
                                            }),
                                            _vm._v(
                                              " " +
                                                _vm._s(_vm.__("downloading")) +
                                                "...\n                                "
                                            ),
                                          ]
                                        : [
                                            _c("i", {
                                              staticClass: "fa fa-download",
                                            }),
                                            _vm._v(
                                              " Download Credit Note\n                                "
                                            ),
                                          ],
                                    ],
                                    2
                                  )
                                : _c(
                                    "b-dropdown",
                                    {
                                      attrs: {
                                        text: "Download Credit Note",
                                        variant: "secondary",
                                        size: "sm",
                                      },
                                    },
                                    _vm._l(_vm.credit_notes, function (cn) {
                                      return _c(
                                        "b-dropdown-item",
                                        {
                                          key: cn.id,
                                          on: {
                                            click: function ($event) {
                                              return _vm.downloadCreditNote(
                                                cn.id
                                              )
                                            },
                                          },
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-download me-1",
                                          }),
                                          _vm._v(
                                            " " +
                                              _vm._s(cn.credit_note_no) +
                                              " (" +
                                              _vm._s(
                                                cn.reason_type === "return"
                                                  ? "Return"
                                                  : cn.reason_type === "partial"
                                                  ? "Partial"
                                                  : "Cancel"
                                              ) +
                                              ") - " +
                                              _vm._s(_vm.$currency) +
                                              _vm._s(cn.total_amount) +
                                              "\n                                "
                                          ),
                                        ]
                                      )
                                    }),
                                    1
                                  ),
                              _vm._v(" "),
                              _vm.isSellerRoute
                                ? _c(
                                    "button",
                                    {
                                      staticClass:
                                        "btn btn-outline-primary btn-sm",
                                      on: { click: _vm.openCreditNotePreview },
                                    },
                                    [
                                      _c("i", { staticClass: "fa fa-eye" }),
                                      _vm._v(
                                        " " +
                                          _vm._s(_vm.__("View credit note")) +
                                          "\n                            "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                            ]
                          : _vm._e(),
                      ],
                      2
                    ),
                  ]
                ),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "row g-3 mb-3" }, [
                _c("div", { staticClass: "col-lg-4" }, [
                  _c("div", { staticClass: "card h-100" }, [
                    _c("div", { staticClass: "card-header" }, [
                      _c("h5", { staticClass: "mb-0" }, [
                        _vm._v(_vm._s(_vm.__("Customer"))),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "card-body" }, [
                      _c("div", { staticClass: "fw-bold fs-5" }, [
                        _vm._v(
                          _vm._s(
                            _vm.order.shop_name ||
                              _vm.order.party_name ||
                              _vm.order.user_name
                          )
                        ),
                      ]),
                      _vm._v(" "),
                      _vm.order.shop_name && _vm.order.user_name
                        ? _c("div", { staticClass: "text-muted" }, [
                            _vm._v(_vm._s(_vm.order.user_name)),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _c(
                        "dl",
                        { staticClass: "info-list mt-3 mb-0" },
                        [
                          _vm.order.user_mobile
                            ? [
                                _c("dt", [_vm._v(_vm._s(_vm.__("mobile")))]),
                                _vm._v(" "),
                                _c("dd", [
                                  _vm._v(
                                    _vm._s(
                                      _vm._f("mobileMask")(
                                        _vm.order.user_mobile
                                      )
                                    )
                                  ),
                                ]),
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.order.user_email
                            ? [
                                _c("dt", [_vm._v(_vm._s(_vm.__("email")))]),
                                _vm._v(" "),
                                _c("dd", [
                                  _vm._v(_vm._s(_vm.order.user_email)),
                                ]),
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.order.order_address
                            ? [
                                _c("dt", [_vm._v(_vm._s(_vm.__("address")))]),
                                _vm._v(" "),
                                _c("dd", [
                                  _vm._v(_vm._s(_vm.order.order_address)),
                                ]),
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.order.area_name || _vm.order.retailer_area_name
                            ? [
                                _c("dt", [_vm._v(_vm._s(_vm.__("area")))]),
                                _vm._v(" "),
                                _c("dd", [
                                  _vm._v(
                                    _vm._s(
                                      _vm.order.area_name ||
                                        _vm.order.retailer_area_name
                                    )
                                  ),
                                ]),
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.order.pincode
                            ? [
                                _c("dt", [_vm._v(_vm._s(_vm.__("pincode")))]),
                                _vm._v(" "),
                                _c("dd", [_vm._v(_vm._s(_vm.order.pincode))]),
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.order.order_note
                            ? [
                                _c("dt", [
                                  _vm._v(_vm._s(_vm.__("order_note"))),
                                ]),
                                _vm._v(" "),
                                _c("dd", [
                                  _vm._v(_vm._s(_vm.order.order_note)),
                                ]),
                              ]
                            : _vm._e(),
                        ],
                        2
                      ),
                    ]),
                  ]),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "col-lg-4" }, [
                  _c("div", { staticClass: "card h-100" }, [
                    _c("div", { staticClass: "card-header" }, [
                      _c("h5", { staticClass: "mb-0" }, [
                        _vm._v(_vm._s(_vm.__("Delivery"))),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "card-body" }, [
                      _c(
                        "dl",
                        { staticClass: "info-list mb-0" },
                        [
                          _c("dt", [_vm._v(_vm._s(_vm.__("delivery_boy")))]),
                          _vm._v(" "),
                          _c(
                            "dd",
                            [
                              _vm.order.delivery_boy_name ||
                              _vm.getDisplayName(
                                _vm.order.delivery_boy_name_translation
                              )
                                ? [
                                    _vm._v(
                                      "\n                                        " +
                                        _vm._s(
                                          _vm.getDisplayName(
                                            _vm.order
                                              .delivery_boy_name_translation
                                          ) || _vm.order.delivery_boy_name
                                        ) +
                                        "\n                                    "
                                    ),
                                  ]
                                : [
                                    _c("span", { staticClass: "text-muted" }, [
                                      _vm._v(_vm._s(_vm.__("not_assign"))),
                                    ]),
                                  ],
                            ],
                            2
                          ),
                          _vm._v(" "),
                          _vm.order.loading_slip_no
                            ? [
                                _c("dt", [
                                  _vm._v(_vm._s(_vm.__("Loading slip"))),
                                ]),
                                _vm._v(" "),
                                _c("dd", [
                                  _vm._v(_vm._s(_vm.order.loading_slip_no)),
                                ]),
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.order.delivery_date
                            ? [
                                _c("dt", [
                                  _vm._v(_vm._s(_vm.__("delivery_date"))),
                                ]),
                                _vm._v(" "),
                                _c("dd", [
                                  _vm._v(_vm._s(_vm.order.delivery_date)),
                                ]),
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.order.delivery_time
                            ? [
                                _c("dt", [
                                  _vm._v(_vm._s(_vm.__("delivery_time"))),
                                ]),
                                _vm._v(" "),
                                _c("dd", [
                                  _vm._v(_vm._s(_vm.order.delivery_time)),
                                ]),
                              ]
                            : _vm._e(),
                          _vm._v(" "),
                          _c("dt", [_vm._v(_vm._s(_vm.__("ordered_by")))]),
                          _vm._v(" "),
                          _c(
                            "dd",
                            [
                              _vm.order.placed_by === "salesman"
                                ? [
                                    _c(
                                      "span",
                                      { staticClass: "badge bg-info me-1" },
                                      [_vm._v(_vm._s(_vm.__("salesman")))]
                                    ),
                                    _vm._v(
                                      _vm._s(_vm.order.salesman_name) +
                                        "\n                                    "
                                    ),
                                  ]
                                : [
                                    _c(
                                      "span",
                                      {
                                        staticClass: "badge bg-secondary me-1",
                                      },
                                      [_vm._v(_vm._s(_vm.__("retailer")))]
                                    ),
                                    _vm._v(
                                      _vm._s(
                                        _vm.order.shop_name ||
                                          _vm.order.user_name
                                      ) +
                                        "\n                                    "
                                    ),
                                  ],
                            ],
                            2
                          ),
                        ],
                        2
                      ),
                    ]),
                  ]),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "col-lg-4" }, [
                  _c("div", { staticClass: "card h-100" }, [
                    _c("div", { staticClass: "card-header" }, [
                      _c("h5", { staticClass: "mb-0" }, [
                        _vm._v(_vm._s(_vm.__("Payment"))),
                      ]),
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "card-body" },
                      [
                        _c("div", { staticClass: "money-row" }, [
                          _c("span", [_vm._v(_vm._s(_vm.__("Items total")))]),
                          _vm._v(" "),
                          _c("span", [
                            _vm._v(
                              _vm._s(_vm.$currency) +
                                _vm._s(_vm.money(_vm.order.total))
                            ),
                          ]),
                        ]),
                        _vm._v(" "),
                        _vm.num(_vm.order.discount) > 0
                          ? _c("div", { staticClass: "money-row" }, [
                              _c("span", [_vm._v(_vm._s(_vm.__("discount")))]),
                              _vm._v(" "),
                              _c("span", [
                                _vm._v(
                                  "- " +
                                    _vm._s(_vm.$currency) +
                                    _vm._s(_vm.money(_vm.order.discount))
                                ),
                              ]),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.order.applied_schemes &&
                        _vm.order.applied_schemes.length
                          ? [
                              _vm._l(_vm.order.applied_schemes, function (s) {
                                return [
                                  _vm.num(s.discount) > 0
                                    ? _c(
                                        "div",
                                        {
                                          key: "scheme-" + s.scheme_id,
                                          staticClass: "money-row",
                                        },
                                        [
                                          _c("span", [
                                            _vm._v(
                                              _vm._s(_vm.__("scheme")) +
                                                "\n                                            "
                                            ),
                                            _c(
                                              "span",
                                              {
                                                staticClass:
                                                  "badge bg-info ms-1",
                                              },
                                              [_vm._v(_vm._s(s.name))]
                                            ),
                                          ]),
                                          _vm._v(" "),
                                          _c("span", [
                                            _vm._v(
                                              "- " +
                                                _vm._s(_vm.$currency) +
                                                _vm._s(_vm.money(s.discount))
                                            ),
                                          ]),
                                        ]
                                      )
                                    : _vm._e(),
                                ]
                              }),
                            ]
                          : _vm.order.scheme_id &&
                            _vm.num(_vm.order.scheme_discount) > 0
                          ? _c("div", { staticClass: "money-row" }, [
                              _c("span", [
                                _vm._v(
                                  _vm._s(_vm.__("scheme")) +
                                    "\n                                    "
                                ),
                                _c(
                                  "span",
                                  { staticClass: "badge bg-info ms-1" },
                                  [
                                    _vm._v(
                                      _vm._s(
                                        _vm.order.scheme_name ||
                                          "#" + _vm.order.scheme_id
                                      )
                                    ),
                                  ]
                                ),
                              ]),
                              _vm._v(" "),
                              _c("span", [
                                _vm._v(
                                  "- " +
                                    _vm._s(_vm.$currency) +
                                    _vm._s(_vm.money(_vm.order.scheme_discount))
                                ),
                              ]),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.num(_vm.order.promo_discount) > 0
                          ? _c("div", { staticClass: "money-row" }, [
                              _c("span", [
                                _vm._v(
                                  _vm._s(_vm.__("promo_discount")) +
                                    "\n                                    "
                                ),
                                _vm.order.promo_code
                                  ? _c(
                                      "span",
                                      {
                                        staticClass:
                                          "badge bg-light text-dark border ms-1",
                                      },
                                      [_vm._v(_vm._s(_vm.order.promo_code))]
                                    )
                                  : _vm._e(),
                              ]),
                              _vm._v(" "),
                              _c("span", [
                                _vm._v(
                                  "- " +
                                    _vm._s(_vm.$currency) +
                                    _vm._s(_vm.money(_vm.order.promo_discount))
                                ),
                              ]),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.num(_vm.order.wallet_balance) > 0
                          ? _c("div", { staticClass: "money-row" }, [
                              _c("span", [
                                _vm._v(_vm._s(_vm.__("wallet_used"))),
                              ]),
                              _vm._v(" "),
                              _c("span", [
                                _vm._v(
                                  "- " +
                                    _vm._s(_vm.$currency) +
                                    _vm._s(_vm.money(_vm.order.wallet_balance))
                                ),
                              ]),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.num(_vm.order.cash_discount_amount) > 0
                          ? _c("div", { staticClass: "money-row" }, [
                              _c("span", [
                                _vm._v(_vm._s(_vm.__("Cash / Bank discount"))),
                              ]),
                              _vm._v(" "),
                              _c("span", [
                                _vm._v(
                                  "- " +
                                    _vm._s(_vm.$currency) +
                                    _vm._s(
                                      _vm.money(_vm.order.cash_discount_amount)
                                    )
                                ),
                              ]),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.num(
                          _vm.getAdditionalChargesTotal(
                            _vm.order.additional_charges
                          )
                        ) > 0
                          ? _c("div", { staticClass: "money-row" }, [
                              _c("span", [
                                _vm._v(_vm._s(_vm.__("additional_charges"))),
                              ]),
                              _vm._v(" "),
                              _c("span", [
                                _vm._v(
                                  "+ " +
                                    _vm._s(_vm.$currency) +
                                    _vm._s(
                                      _vm.money(
                                        _vm.getAdditionalChargesTotal(
                                          _vm.order.additional_charges
                                        )
                                      )
                                    )
                                ),
                              ]),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        _c("div", { staticClass: "money-row total" }, [
                          _c("span", [_vm._v(_vm._s(_vm.__("payable_total")))]),
                          _vm._v(" "),
                          _c("span", [
                            _vm._v(
                              _vm._s(_vm.$currency) +
                                _vm._s(_vm.money(_vm.payableTotal))
                            ),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "text-muted small mt-2" }, [
                          _vm._v(
                            "\n                                " +
                              _vm._s(_vm.__("payment_method")) +
                              ": "
                          ),
                          _c("span", { staticClass: "fw-semibold text-body" }, [
                            _vm._v(_vm._s(_vm.order.payment_method)),
                          ]),
                        ]),
                        _vm._v(" "),
                        _vm.credit_notes && _vm.credit_notes.length > 0
                          ? _c(
                              "div",
                              { staticClass: "mt-2" },
                              _vm._l(_vm.credit_notes, function (cn) {
                                return _c(
                                  "span",
                                  {
                                    key: cn.id,
                                    staticClass: "badge bg-secondary me-1 mb-1",
                                  },
                                  [
                                    _vm._v(
                                      "\n                                    " +
                                        _vm._s(cn.credit_note_no) +
                                        " (" +
                                        _vm._s(
                                          _vm.creditNoteTypeLabel(
                                            cn.reason_type
                                          )
                                        ) +
                                        " — " +
                                        _vm._s(_vm.$currency) +
                                        _vm._s(_vm.money(cn.total_amount)) +
                                        ")\n                                "
                                    ),
                                  ]
                                )
                              }),
                              0
                            )
                          : _vm._e(),
                      ],
                      2
                    ),
                  ]),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "card" }, [
                _c(
                  "div",
                  {
                    staticClass:
                      "card-header d-flex align-items-center justify-content-between",
                  },
                  [
                    _c("h5", { staticClass: "mb-0" }, [
                      _vm._v(_vm._s(_vm.__("list_of_order_items"))),
                    ]),
                    _vm._v(" "),
                    _c("span", { staticClass: "text-muted small" }, [
                      _vm._v(
                        _vm._s(_vm.order_items.length) +
                          " " +
                          _vm._s(
                            _vm.order_items.length === 1
                              ? _vm.__("Item")
                              : _vm.__("Items")
                          )
                      ),
                    ]),
                  ]
                ),
                _vm._v(" "),
                _c("div", { staticClass: "card-body p-0" }, [
                  _c("div", { staticClass: "table-responsive" }, [
                    _c(
                      "table",
                      {
                        staticClass:
                          "table table-hover align-middle mb-0 order-items-table",
                      },
                      [
                        _c("thead", [
                          _c("tr", [
                            _c("th", { staticStyle: { width: "44px" } }, [
                              _vm._v("#"),
                            ]),
                            _vm._v(" "),
                            _c("th", [_vm._v(_vm._s(_vm.__("Product")))]),
                            _vm._v(" "),
                            _c("th", { staticClass: "text-end" }, [
                              _vm._v(_vm._s(_vm.__("quantity"))),
                            ]),
                            _vm._v(" "),
                            _c("th", { staticClass: "text-end" }, [
                              _vm._v(
                                _vm._s(_vm.__("Rate")) +
                                  " (" +
                                  _vm._s(_vm.$currency) +
                                  ")"
                              ),
                            ]),
                            _vm._v(" "),
                            _c("th", { staticClass: "text-end" }, [
                              _vm._v(_vm._s(_vm.__("Tax"))),
                            ]),
                            _vm._v(" "),
                            _c("th", { staticClass: "text-end" }, [
                              _vm._v(
                                _vm._s(_vm.__("Amount")) +
                                  " (" +
                                  _vm._s(_vm.$currency) +
                                  ")"
                              ),
                            ]),
                            _vm._v(" "),
                            _c("th", [_vm._v(_vm._s(_vm.__("status")))]),
                            _vm._v(" "),
                            _c("th", { staticClass: "text-end" }, [
                              _vm._v(_vm._s(_vm.__("actions"))),
                            ]),
                          ]),
                        ]),
                        _vm._v(" "),
                        _c(
                          "tbody",
                          _vm._l(_vm.order_items, function (item, index) {
                            return _c(
                              "tr",
                              {
                                key: item.id,
                                class: {
                                  "item-inactive":
                                    item.active_status == 7 ||
                                    item.active_status == 8,
                                },
                              },
                              [
                                _c("td", { staticClass: "text-muted" }, [
                                  _vm._v(_vm._s(index + 1)),
                                ]),
                                _vm._v(" "),
                                _c("td", [
                                  _c("div", { staticClass: "fw-semibold" }, [
                                    _vm._v(
                                      "\n                                            " +
                                        _vm._s(item.product_name) +
                                        "\n                                            "
                                    ),
                                    item.is_free_item == 1
                                      ? _c(
                                          "span",
                                          {
                                            staticClass:
                                              "badge bg-success ms-1",
                                          },
                                          [_vm._v(_vm._s(_vm.__("free")))]
                                        )
                                      : _vm._e(),
                                  ]),
                                  _vm._v(" "),
                                  item.variant_name
                                    ? _c(
                                        "div",
                                        { staticClass: "text-muted small" },
                                        [_vm._v(_vm._s(item.variant_name))]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  item.active_status == 7 &&
                                  item.cancellation_reason
                                    ? _c(
                                        "div",
                                        { staticClass: "small text-danger" },
                                        [
                                          _vm._v(
                                            "\n                                            " +
                                              _vm._s(_vm.__("reason")) +
                                              ": " +
                                              _vm._s(item.cancellation_reason) +
                                              "\n                                        "
                                          ),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _vm.hasShortfall(item)
                                    ? _c(
                                        "div",
                                        { staticClass: "small text-danger" },
                                        [
                                          _vm._v(
                                            "\n                                            " +
                                              _vm._s(
                                                _vm.__("delivered_quantity")
                                              ) +
                                              ": " +
                                              _vm._s(item.delivered_quantity) +
                                              " / " +
                                              _vm._s(item.quantity) +
                                              "\n                                            "
                                          ),
                                          item.shortfall_reason
                                            ? [
                                                _vm._v(
                                                  " · " +
                                                    _vm._s(
                                                      _vm.__(
                                                        item.shortfall_reason
                                                      )
                                                    )
                                                ),
                                              ]
                                            : _vm._e(),
                                          _vm._v(" "),
                                          item.damage_photo
                                            ? _c(
                                                "a",
                                                {
                                                  staticClass: "ms-1",
                                                  attrs: {
                                                    href: _vm.damagePhotoUrl(
                                                      item.damage_photo
                                                    ),
                                                    target: "_blank",
                                                  },
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                                " +
                                                      _vm._s(
                                                        _vm.__(
                                                          "view_damage_photo"
                                                        )
                                                      ) +
                                                      "\n                                            "
                                                  ),
                                                ]
                                              )
                                            : _vm._e(),
                                        ],
                                        2
                                      )
                                    : _vm._e(),
                                ]),
                                _vm._v(" "),
                                _c("td", { staticClass: "text-end" }, [
                                  _vm._v(_vm._s(item.quantity)),
                                ]),
                                _vm._v(" "),
                                _c("td", { staticClass: "text-end" }, [
                                  _vm._v(_vm._s(_vm.money(item.price))),
                                ]),
                                _vm._v(" "),
                                _c("td", { staticClass: "text-end" }, [
                                  _vm.num(item.tax_percentage) > 0
                                    ? _c("span", [
                                        _vm._v(
                                          _vm._s(item.tax_percentage) + "%"
                                        ),
                                      ])
                                    : _c(
                                        "span",
                                        { staticClass: "text-muted" },
                                        [_vm._v("—")]
                                      ),
                                ]),
                                _vm._v(" "),
                                _c(
                                  "td",
                                  { staticClass: "text-end fw-semibold" },
                                  [_vm._v(_vm._s(_vm.money(item.sub_total)))]
                                ),
                                _vm._v(" "),
                                _c("td", [
                                  _c(
                                    "span",
                                    {
                                      staticClass: "badge",
                                      class: _vm.statusBadgeClass(
                                        item.active_status
                                      ),
                                    },
                                    [
                                      _vm._v(
                                        "\n                                            " +
                                          _vm._s(
                                            _vm.getDisplayName(
                                              item.status_name_translation
                                            ) || item.status_name
                                          ) +
                                          "\n                                        "
                                      ),
                                    ]
                                  ),
                                ]),
                                _vm._v(" "),
                                _c(
                                  "td",
                                  { staticClass: "text-end text-nowrap" },
                                  [
                                    _c(
                                      "b-button",
                                      {
                                        directives: [
                                          {
                                            name: "b-tooltip",
                                            rawName: "v-b-tooltip.hover",
                                            modifiers: { hover: true },
                                          },
                                        ],
                                        attrs: {
                                          size: "sm",
                                          variant: "outline-primary",
                                          title: _vm.__("view_item_details"),
                                        },
                                        on: {
                                          click: function ($event) {
                                            return _vm.sendInfo(item)
                                          },
                                        },
                                      },
                                      [_c("i", { staticClass: "fa fa-eye" })]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "router-link",
                                      {
                                        directives: [
                                          {
                                            name: "b-tooltip",
                                            rawName: "v-b-tooltip.hover",
                                            modifiers: { hover: true },
                                          },
                                        ],
                                        staticClass:
                                          "btn btn-sm btn-outline-secondary",
                                        attrs: {
                                          to: _vm.productRoute(item),
                                          title: _vm.__("view_product"),
                                        },
                                      },
                                      [_c("i", { staticClass: "fa fa-box" })]
                                    ),
                                    _vm._v(" "),
                                    _vm.canCancelItem(item) &&
                                    !_vm.isDeliveryBoyRoute
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
                                            staticClass:
                                              "btn btn-sm btn-outline-danger",
                                            attrs: {
                                              title: _vm.__("cancel_item"),
                                              disabled: _vm.isLoadingCancel,
                                            },
                                            on: {
                                              click: function ($event) {
                                                return _vm.cancelOrderItem(item)
                                              },
                                            },
                                          },
                                          [
                                            _c("i", {
                                              staticClass: "fa fa-times",
                                            }),
                                          ]
                                        )
                                      : _vm._e(),
                                  ],
                                  1
                                ),
                              ]
                            )
                          }),
                          0
                        ),
                        _vm._v(" "),
                        _c("tfoot", [
                          _c("tr", [
                            _c(
                              "td",
                              {
                                staticClass: "text-end text-muted",
                                attrs: { colspan: "5" },
                              },
                              [_vm._v(_vm._s(_vm.__("Active items total")))]
                            ),
                            _vm._v(" "),
                            _c("td", { staticClass: "text-end fw-bold" }, [
                              _vm._v(_vm._s(_vm.money(_vm.itemsSubtotal))),
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
            ])
          : _vm._e(),
        _vm._v(" "),
        _c(
          "b-modal",
          {
            attrs: {
              size: "xl",
              scrollable: "",
              "hide-footer": "",
              title: "Credit Note - Excel Preview",
            },
            model: {
              value: _vm.creditNotePreviewShow,
              callback: function ($$v) {
                _vm.creditNotePreviewShow = $$v
              },
              expression: "creditNotePreviewShow",
            },
          },
          [
            _vm.creditNotePreviewLoading
              ? _c(
                  "div",
                  { staticClass: "text-center py-5" },
                  [_c("b-spinner", { attrs: { label: "Loading" } })],
                  1
                )
              : _vm.creditNotePreview.rows.length > 0
              ? [
                  _c("p", { staticClass: "text-muted small mb-2" }, [
                    _vm._v(
                      "\n                    Exactly what the Credit Note Excel export (Export Center) contains for this order:\n                    " +
                        _vm._s(_vm.creditNotePreview.headers.length) +
                        " columns,\n                    " +
                        _vm._s(_vm.creditNotePreview.rows.length) +
                        " row" +
                        _vm._s(
                          _vm.creditNotePreview.rows.length > 1 ? "s" : ""
                        ) +
                        ".\n                "
                    ),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "table-responsive credit-note-preview" },
                    [
                      _c(
                        "table",
                        { staticClass: "table table-bordered table-sm mb-0" },
                        [
                          _c("thead", [
                            _c(
                              "tr",
                              _vm._l(
                                _vm.creditNotePreview.headers,
                                function (header, hi) {
                                  return _c("th", { key: hi }, [
                                    _vm._v(_vm._s(header)),
                                  ])
                                }
                              ),
                              0
                            ),
                          ]),
                          _vm._v(" "),
                          _c(
                            "tbody",
                            _vm._l(
                              _vm.creditNotePreview.rows,
                              function (row, ri) {
                                return _c(
                                  "tr",
                                  { key: ri },
                                  _vm._l(row, function (cell, ci) {
                                    return _c("td", { key: ci }, [
                                      _vm._v(_vm._s(cell)),
                                    ])
                                  }),
                                  0
                                )
                              }
                            ),
                            0
                          ),
                        ]
                      ),
                    ]
                  ),
                ]
              : _c("p", { staticClass: "text-muted text-center py-4 mb-0" }, [
                  _vm._v("No data found for this credit note."),
                ]),
          ],
          2
        ),
        _vm._v(" "),
        _c(
          "b-modal",
          {
            attrs: { "hide-footer": true, title: _vm.__("order_item_details") },
            model: {
              value: _vm.itemModalShow,
              callback: function ($$v) {
                _vm.itemModalShow = $$v
              },
              expression: "itemModalShow",
            },
          },
          [
            _c("b-container", { attrs: { fluid: "" } }, [
              _c("div", { staticClass: "row" }, [
                _c("ul", { staticClass: "list-group" }, [
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [_vm._v(_vm._s(_vm.__("name")) + " :- ")]),
                    _vm._v(
                      _vm._s(
                        _vm.item.product_name +
                          " (" +
                          _vm.item.variant_name +
                          ")"
                      )
                    ),
                  ]),
                  _vm._v(" "),
                  _vm.item.active_status
                    ? _c("li", { staticClass: "list-group-item capitalize" }, [
                        _c("b", [_vm._v(_vm._s(_vm.__("status")) + " :- ")]),
                        _vm._v(
                          _vm._s(
                            _vm.getDisplayName(
                              _vm.item.status_name_translation
                            ) || _vm.item.status_name
                          ) + "\n                        "
                        ),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _c(
                    "li",
                    { staticClass: "list-group-item" },
                    [
                      _c("span", [
                        _c("b", [
                          _vm._v(_vm._s(_vm.__("product_id")) + " :- "),
                        ]),
                        _vm._v(_vm._s(_vm.item.product_id)),
                      ]),
                      _vm._v(" "),
                      _c(
                        "router-link",
                        {
                          directives: [
                            {
                              name: "b-tooltip",
                              rawName: "v-b-tooltip.hover",
                              modifiers: { hover: true },
                            },
                          ],
                          staticClass: "btn btn-primary btn-sm pull-right",
                          attrs: { to: _vm.viewProductRoute, title: "View" },
                        },
                        [_c("i", { staticClass: "fa fa-eye" })]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.item.seller_name ||
                  _vm.getDisplayName(_vm.item.seller_name_translation)
                    ? _c("li", { staticClass: "list-group-item" }, [
                        _c("b", [
                          _vm._v(_vm._s(_vm.__("seller_name")) + " :- "),
                        ]),
                        _vm._v(
                          _vm._s(
                            _vm.getDisplayName(
                              _vm.item.seller_name_translation
                            ) || _vm.item.seller_name
                          ) + "\n                        "
                        ),
                      ])
                    : _vm._e(),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [_vm._v(_vm._s(_vm.__("user_name")) + " :- ")]),
                    _vm._v(_vm._s(_vm.item.user_name)),
                  ]),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [_vm._v(_vm._s(_vm.__("variant_id")) + " :- ")]),
                    _vm._v(
                      _vm._s(_vm.item.product_variant_id) +
                        "\n                        "
                    ),
                  ]),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [_vm._v(_vm._s(_vm.__("quantity")) + " :- ")]),
                    _vm._v(_vm._s(_vm.item.quantity)),
                  ]),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [_vm._v(_vm._s(_vm.__("price")) + " :- ")]),
                    _vm._v(_vm._s(_vm.item.price)),
                  ]),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [
                      _vm._v(
                        _vm._s(_vm.__("discounted_price")) +
                          " (" +
                          _vm._s(_vm.$currency) +
                          " ) :- "
                      ),
                    ]),
                    _vm._v(_vm._s(_vm.item.discounted_price)),
                  ]),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [
                      _vm._v(
                        _vm._s(_vm.__("tax_amount")) +
                          " (" +
                          _vm._s(_vm.$currency) +
                          " ) :- "
                      ),
                    ]),
                    _vm._v(
                      _vm._s(_vm.item.tax_amount) + "\n                        "
                    ),
                  ]),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [
                      _vm._v(_vm._s(_vm.__("tax_percentage")) + " (%) :- "),
                    ]),
                    _vm._v(_vm._s(_vm.item.tax_percentage)),
                  ]),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c("b", [
                      _vm._v(
                        _vm._s(_vm.__("subtotal")) +
                          " (" +
                          _vm._s(_vm.$currency) +
                          " ) :- "
                      ),
                    ]),
                    _vm._v(_vm._s(_vm.item.sub_total)),
                  ]),
                  _vm._v(" "),
                  _c("li", { staticClass: "list-group-item" }, [
                    _c(
                      "a",
                      {
                        staticClass: " col-sm-12 btn btn-success",
                        attrs: {
                          href: _vm.whatsappMessageLink(
                            _vm.order.country_code,
                            _vm.order.mobile,
                            _vm.order.user_name,
                            _vm.order.id,
                            _vm.item.id
                          ),
                          target: "_blank",
                          title: "Send Whatsapp Notification",
                        },
                      },
                      [_c("i", { staticClass: "fab fa-whatsapp" })]
                    ),
                  ]),
                ]),
              ]),
            ]),
          ],
          1
        ),
      ],
      1
    ),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);