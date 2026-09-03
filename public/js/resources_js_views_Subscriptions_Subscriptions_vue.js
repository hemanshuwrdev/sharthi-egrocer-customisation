"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Subscriptions_Subscriptions_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  name: 'Subscriptions',
  data: function data() {
    return {
      plans: [],
      languages: [],
      currentLanguageId: null,
      activeLanguageTab: 0,
      isLoadingLanguages: false,
      isLoadingData: false,
      create_new: false,
      edit_record: {},
      form: {
        id: null,
        translations: {},
        days: '',
        price: '',
        discounted_price: '',
        free_delivery_above: '',
        ios_product_id: '',
        status: 1
      },
      isLoading: false,
      isSubmitting: false,
      isUpdatingName: false,
      subscriptionName: '',
      discountedPriceError: '',
      filter: '',
      filterOn: ['id', 'name', 'days', 'price', 'discounted_price', 'free_delivery_above', 'status'],
      sortBy: 'id',
      sortDesc: true,
      sortDirection: 'desc',
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      pageOptions: [5, 10, 15, 20, 25, 50, 100],
      translatableFields: ['name'],
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false
    };
  },
  mounted: function mounted() {
    var _this = this;
    return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.fetchActiveLanguages();
            case 2:
              _this.getPlans();
            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  computed: {
    defaultLanguageId: function defaultLanguageId() {
      var d = this.languages.find(function (l) {
        return l.is_default === 1;
      });
      return d ? d.id : null;
    },
    translations: function translations() {
      return this.form.translations || {};
    },
    fields: function fields() {
      var c = this.$currency || '';
      return [{
        key: 'id',
        label: __('id'),
        sortable: true
      }, {
        key: 'name',
        label: __('plan_name')
      }, {
        key: 'days',
        label: __('days')
      }, {
        key: 'price',
        label: __('price') + " (".concat(c, ")")
      }, {
        key: 'discounted_price',
        label: __('discounted_price') + " (".concat(c, ")")
      }, {
        key: 'free_delivery_above',
        label: __('free_delivery_above') + " (".concat(c, ")")
      }, {
        key: 'status',
        label: __('status')
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }];
    },
    translatedPlans: function translatedPlans() {
      var _this2 = this;
      if (!this.currentLanguageId) return this.plans;
      return this.plans.map(function (plan) {
        var translated = _objectSpread({}, plan);
        if (Array.isArray(plan.translations)) {
          var _t$name;
          var t = plan.translations.find(function (tr) {
            return tr.language_id === _this2.currentLanguageId;
          });
          if (t !== null && t !== void 0 && (_t$name = t.name) !== null && _t$name !== void 0 && _t$name.trim()) {
            translated.name = t.name;
          }
        }
        return translated;
      });
    }
  },
  methods: {
    loadPlanWithTranslations: function loadPlanWithTranslations() {
      var _this3 = this;
      this.isLoadingData = true;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/subscription_plans', {
        params: {
          id: this.id
        }
      }).then(function (response) {
        if (!response.data.data) {
          _this3.isLoadingData = false;
          return;
        }

        // API may return array or single object
        var plans = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
        var plan = plans.length > 0 ? plans[0] : null;
        if (!plan) {
          console.error('Subscription plan not found in response');
          _this3.isLoadingData = false;
          return;
        }
        _this3.form.id = plan.id;
        _this3.form.days = plan.days;
        _this3.form.price = plan.price;
        _this3.form.discounted_price = plan.discounted_price;
        _this3.form.free_delivery_above = plan.free_delivery_above;
        _this3.form.status = plan.status;

        /* ----------- TRANSLATIONS MERGE ------------ */
        var updatedTranslations = _objectSpread({}, _this3.form.translations);

        // Load translation table data
        if (plan.translations && Array.isArray(plan.translations)) {
          plan.translations.forEach(function (trans) {
            var langId = trans.language_id;
            updatedTranslations[langId] = {
              language_id: langId,
              name: trans.name || ''
            };
          });
        }
        _this3.languages.forEach(function (language) {
          if (!updatedTranslations[language.id] || !updatedTranslations[language.id].name) {
            if (language.is_default) {
              updatedTranslations[language.id] = {
                language_id: language.id,
                name: plan.name || ''
              };
            }
          }
        });
        _this3.form.translations = updatedTranslations;
        _this3.isLoadingData = false;
      })["catch"](function (error) {
        console.error('Error loading subscription plan translations:', error);
        _this3.isLoadingData = false;
        throw error;
      });
    },
    validateDefaultLanguage: function validateDefaultLanguage() {
      var _this$form$translatio;
      var def = this.languages.find(function (l) {
        return l.is_default;
      });
      if (!def) return true;
      var t = (_this$form$translatio = this.form.translations) === null || _this$form$translatio === void 0 ? void 0 : _this$form$translatio[def.id];
      if (!t || !t.name || !t.name.trim()) {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLanguageTab = this.languages.findIndex(function (l) {
          return l.id === def.id;
        });
        return false;
      }
      return true;
    },
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this4 = this;
      this.isLoadingLanguages = true;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/active_languages').then(function (res) {
        _this4.languages = res.data.data || [];
        var appLocale = window.appLocale || 'en';
        var current = _this4.languages.find(function (l) {
          return l.code === appLocale;
        }) || _this4.languages.find(function (l) {
          return l.is_default;
        });
        _this4.currentLanguageId = (current === null || current === void 0 ? void 0 : current.id) || null;
      })["finally"](function () {
        _this4.isLoadingLanguages = false;
      });
    },
    initializeTranslations: function initializeTranslations() {
      var existing = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var map = {};
      this.languages.forEach(function (lang) {
        var _ref, _found$name;
        var found = existing.find(function (t) {
          return t.language_id === lang.id;
        });
        map[lang.id] = {
          language_id: lang.id,
          name: (_ref = (_found$name = found === null || found === void 0 ? void 0 : found.name) !== null && _found$name !== void 0 ? _found$name : lang.is_default ? base === null || base === void 0 ? void 0 : base.name : '') !== null && _ref !== void 0 ? _ref : ''
        };
      });
      this.form.translations = map;
    },
    // Get all subscription plans
    getPlans: function getPlans() {
      var _this5 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
        var params, response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this5.isLoading = true;
                _context2.prev = 1;
                params = {
                  limit: _this5.perPage,
                  offset: (_this5.currentPage - 1) * _this5.perPage,
                  search: _this5.filter
                };
                _context2.next = 5;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().get(_this5.$apiUrl + '/subscription_plans/', {
                  params: params
                });
              case 5:
                response = _context2.sent;
                if (response.data.status === 1) {
                  // Check if response has plans array or object with plans property
                  if (Array.isArray(response.data.data)) {
                    _this5.plans = response.data.data;
                    _this5.totalRows = response.data.total || response.data.data.length;
                  } else if (response.data.data && response.data.data.plans) {
                    // New format with plans and subscription_name
                    _this5.plans = response.data.data.plans;
                    _this5.totalRows = response.data.total || response.data.data.plans.length;
                    // Set subscription name if available
                    if (response.data.data.subscription_name !== undefined) {
                      _this5.subscriptionName = response.data.data.subscription_name || '';
                    }
                  } else {
                    _this5.plans = [];
                    _this5.totalRows = 0;
                  }
                } else {
                  _this5.showError(response.data.message);
                }
                _context2.next = 12;
                break;
              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](1);
                _this5.showError(__('something_went_wrong'));
              case 12:
                _context2.prev = 12;
                _this5.isLoading = false;
                return _context2.finish(12);
              case 15:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[1, 9, 12, 15]]);
      }))();
    },
    // Validate discounted price
    validateDiscountedPrice: function validateDiscountedPrice() {
      this.discountedPriceError = '';

      // Only validate if both price and discounted_price are provided
      if (this.form.discounted_price && this.form.price) {
        var discountedPrice = parseFloat(this.form.discounted_price);
        var regularPrice = parseFloat(this.form.price);

        // Check if discounted price is less than regular price
        if (discountedPrice >= regularPrice) {
          this.discountedPriceError = __('discounted_price_must_be_less_than_regular_price');
          return false;
        }

        // Check if discounted price is negative
        if (discountedPrice < 0) {
          this.discountedPriceError = __('discounted_price_cannot_be_negative');
          return false;
        }
      }
      return true;
    },
    checkFreeDeliveryTimeSlots: function checkFreeDeliveryTimeSlots() {
      var _this6 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().get(_this6.$apiUrl + '/subscription_plans/check_free_delivery_time_slots');
              case 3:
                response = _context3.sent;
                if (!(response.data.status === 1)) {
                  _context3.next = 6;
                  break;
                }
                return _context3.abrupt("return", response.data.data.has_free_delivery_time_slots);
              case 6:
                return _context3.abrupt("return", false);
              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3["catch"](0);
                console.error('Error checking free delivery time slots:', _context3.t0);
                return _context3.abrupt("return", false);
              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 9]]);
      }))();
    },
    // Save or update subscription plan
    savePlan: function savePlan(event) {
      var _this7 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4() {
        var form, payload, url;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                form = event.target; // Validate discounted price before form submission
                if (_this7.validateDiscountedPrice()) {
                  _context4.next = 4;
                  break;
                }
                // Focus on discounted price field if validation fails
                _this7.$nextTick(function () {
                  var discountedPriceInput = document.getElementById('discounted_price');
                  if (discountedPriceInput) {
                    discountedPriceInput.focus();
                    discountedPriceInput.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }
                });
                return _context4.abrupt("return");
              case 4:
                if (form.checkValidity()) {
                  _context4.next = 7;
                  break;
                }
                form.reportValidity();
                return _context4.abrupt("return");
              case 7:
                if (_this7.validateDefaultLanguage()) {
                  _context4.next = 9;
                  break;
                }
                return _context4.abrupt("return");
              case 9:
                _this7.isSubmitting = true;
                payload = {
                  days: _this7.form.days,
                  price: _this7.form.price,
                  discounted_price: _this7.form.discounted_price || null,
                  free_delivery_above: _this7.form.free_delivery_above || null,
                  ios_product_id: _this7.form.ios_product_id || null,
                  status: _this7.form.status,
                  translations: Object.values(_this7.form.translations)
                };
                url = _this7.$apiUrl + '/subscription_plans/save';
                if (_this7.form.id) {
                  url = _this7.$apiUrl + '/subscription_plans/update/' + _this7.form.id;
                }
                _this7.isSubmitting = true;
                axios__WEBPACK_IMPORTED_MODULE_1___default().post(url, payload).then(function (res) {
                  if (res.data.status === 1) {
                    _this7.showMessage('success', res.data.message);
                    _this7.create_new = false;
                    _this7.getPlans();
                  } else {
                    _this7.showError(res.data.message);
                  }
                })["finally"](function () {
                  _this7.isSubmitting = false;
                });
              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }))();
    },
    // Edit plan - populate form with plan data and check for conflicts
    editPlan: function editPlan(plan) {
      var _this8 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5() {
        var hasFreeDeliveryTimeSlots, map, def;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _this8.activeLanguageTab = 0;

                // Check for free delivery time slots before opening edit modal
                _context5.next = 3;
                return _this8.checkFreeDeliveryTimeSlots();
              case 3:
                hasFreeDeliveryTimeSlots = _context5.sent;
                if (!hasFreeDeliveryTimeSlots) {
                  _context5.next = 7;
                  break;
                }
                _this8.$swal.fire({
                  title: __('cannot_create_subscription_plan'),
                  html: "\n                        <div class=\"text-left\">\n                            <p>".concat(__('free_delivery_time_slots_exist_message'), "</p>\n                            <p class=\"mt-3\">\n                                <strong>").concat(__('please_remove_free_delivery_time_slots_first'), "</strong>\n                            </p>\n                            <p class=\"mt-3\">\n                                <a href=\"/delivery_settings\" class=\"btn btn-primary btn-sm\">\n                                    ").concat(__('go_to_delivery_settings'), " <i class=\"fa fa-external-link-alt\"></i>\n                                </a>\n                            </p>\n                        </div>\n                    "),
                  icon: 'warning',
                  confirmButtonText: __('ok'),
                  confirmButtonColor: '#37a279',
                  width: '600px'
                });
                return _context5.abrupt("return");
              case 7:
                _this8.resetForm();
                _context5.next = 10;
                return _this8.fetchActiveLanguages();
              case 10:
                _this8.form.id = plan.id;
                _this8.form.days = plan.days;
                _this8.form.price = plan.price;
                _this8.form.discounted_price = plan.discounted_price;
                _this8.form.free_delivery_above = plan.free_delivery_above;
                _this8.form.ios_product_id = plan.ios_product_id;
                _this8.form.status = plan.status;
                map = {};
                _this8.languages.forEach(function (l) {
                  map[l.id] = {
                    language_id: l.id,
                    name: ''
                  };
                });
                if (Array.isArray(plan.translations)) {
                  plan.translations.forEach(function (t) {
                    map[t.language_id].name = t.name || '';
                  });
                }
                def = _this8.languages.find(function (l) {
                  return l.is_default;
                });
                if (def && !map[def.id].name) {
                  map[def.id].name = plan.name || '';
                }
                _this8.form.translations = map;
                _this8.activeLanguageTab = 0;
                _this8.create_new = true;
              case 25:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    // Delete subscription plan
    deletePlan: function deletePlan(index, id) {
      var _this9 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee6() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _this9.$swal.fire({
                  title: __('are_you_sure'),
                  text: __('you_want_be_able_to_revert_this'),
                  confirmButtonText: __('yes_sure'),
                  cancelButtonText: __('cancel'),
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#37a279',
                  cancelButtonColor: '#d33'
                }).then(function (result) {
                  if (result.value) {
                    _this9.isLoading = true;
                    axios__WEBPACK_IMPORTED_MODULE_1___default().post(_this9.$apiUrl + "/subscription_plans/delete/".concat(id)).then(function (response) {
                      _this9.isLoading = false;
                      if (response.data.status === 1) {
                        _this9.showMessage('success', response.data.message);
                        _this9.getPlans();
                      } else {
                        _this9.showError(response.data.message);
                      }
                    })["catch"](function (error) {
                      _this9.isLoading = false;
                      _this9.showError(__('something_went_wrong'));
                    });
                  }
                });
              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }))();
    },
    // Reset form to default values
    resetForm: function resetForm() {
      this.form = {
        id: null,
        days: '',
        price: '',
        discounted_price: '',
        free_delivery_above: '',
        ios_product_id: '',
        status: 1,
        translations: {}
      };
      this.discountedPriceError = '';
      this.activeLanguageTab = 0;
    },
    closeModal: function closeModal() {
      this.create_new = false;
    },
    onModalHidden: function onModalHidden() {
      this.resetForm();
    },
    openAddModal: function openAddModal() {
      var _this10 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee7() {
        var hasFreeDeliveryTimeSlots;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _this10.activeLanguageTab = 0;

                // Check for free delivery time slots before opening the modal
                _context7.next = 3;
                return _this10.checkFreeDeliveryTimeSlots();
              case 3:
                hasFreeDeliveryTimeSlots = _context7.sent;
                if (!hasFreeDeliveryTimeSlots) {
                  _context7.next = 7;
                  break;
                }
                _this10.$swal.fire({
                  title: __('cannot_create_subscription_plan'),
                  html: "\n                        <div class=\"text-left\">\n                            <p>".concat(__('free_delivery_time_slots_exist_message'), "</p>\n                            <p class=\"mt-3\">\n                                <strong>").concat(__('please_remove_free_delivery_time_slots_first'), "</strong>\n                            </p>\n                                <p class=\"mt-3\">\n                                    <a href=\"/delivery_settings\" class=\"btn btn-primary btn-sm\">\n                                        ").concat(__('go_to_delivery_settings'), " <i class=\"fa fa-external-link-alt\"></i>\n                                    </a>\n                                </p>\n                        </div>\n                    "),
                  icon: 'warning',
                  confirmButtonText: __('ok'),
                  confirmButtonColor: '#37a279',
                  width: '600px'
                });
                return _context7.abrupt("return");
              case 7:
                // If no conflicts, proceed to open the modal
                _this10.resetForm();
                _context7.next = 10;
                return _this10.fetchActiveLanguages();
              case 10:
                _this10.initializeTranslations([], null);
                _this10.activeLanguageTab = 0;
                _this10.create_new = true;
              case 13:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }))();
    },
    // Update subscription name in settings
    updateSubscriptionName: function updateSubscriptionName() {
      var _this11 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee8() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!(!_this11.subscriptionName || _this11.subscriptionName.trim() === '')) {
                  _context8.next = 3;
                  break;
                }
                _this11.showError(__('subscription_name_cannot_be_empty'));
                return _context8.abrupt("return");
              case 3:
                _this11.isUpdatingName = true;
                _context8.prev = 4;
                _context8.next = 7;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().post(_this11.$apiUrl + '/subscription_plans/update_setting', {
                  subscription_name: _this11.subscriptionName.trim()
                });
              case 7:
                response = _context8.sent;
                if (response.data.status === 1) {
                  _this11.showMessage("success", response.data.message);
                } else {
                  _this11.showError(response.data.message);
                }
                _context8.next = 14;
                break;
              case 11:
                _context8.prev = 11;
                _context8.t0 = _context8["catch"](4);
                _this11.showError(__('something_went_wrong'));
              case 14:
                _context8.prev = 14;
                _this11.isUpdatingName = false;
                return _context8.finish(14);
              case 17:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[4, 11, 14, 17]]);
      }))();
    }
  },
  watch: {
    // Watch for pagination changes
    currentPage: function currentPage() {
      this.getPlans();
    },
    // Watch for per page changes
    perPage: function perPage() {
      this.currentPage = 1; // Reset to first page when changing per page
      this.getPlans();
    }
  }
});

/***/ }),

/***/ "./resources/js/mixins/TranslationHelper.js":
/*!**************************************************!*\
  !*** ./resources/js/mixins/TranslationHelper.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  methods: {
    translateEmpty: function translateEmpty(language) {
      var _this = this;
      this.$root.$emit('bv::hide::tooltip');
      if (typeof this.validateDefaultLanguageForTranslation === "function") {
        if (!this.validateDefaultLanguageForTranslation()) return;
      }
      if (this.hasOwnProperty("loadingEmpty")) {
        this.loadingEmpty = true;
      } else {
        this.isTranslating = true;
      }
      var fields = this.translatableFields || [];

      // Check if any field is empty in non-default language tabs
      var hasEmptyFields = this.checkNonDefaultLanguagesHaveEmptyFields(fields);
      if (!hasEmptyFields) {
        // All fields in all non-default languages already have values
        var errorMsg = __("translation_error_all_fields_filled") || "All fields already have values. There is nothing to translate.";
        if (this.hasOwnProperty("loadingEmpty")) {
          this.loadingEmpty = false;
        } else {
          this.isTranslating = false;
        }
        this.showError(errorMsg);
        return;
      }
      this.translateEmptyHelper(language, fields).then(function () {
        _this.showSuccess(__("translation_completed_successfully") || "Translation completed successfully");
      })["catch"](function () {
        // Error handling is done in translateEmptyHelper
      })["finally"](function () {
        if (_this.hasOwnProperty("loadingEmpty")) {
          _this.loadingEmpty = false;
        } else {
          _this.isTranslating = false;
        }
      });
    },
    translateOverwrite: function translateOverwrite(language) {
      var _this2 = this;
      this.$root.$emit('bv::hide::tooltip');
      if (typeof this.validateDefaultLanguageForTranslation === "function") {
        if (!this.validateDefaultLanguageForTranslation()) return;
      }
      if (this.hasOwnProperty("loadingOverwrite")) {
        this.loadingOverwrite = true;
      } else {
        this.isTranslating = true;
      }
      var fields = this.translatableFields || [];
      this.translateOverwriteHelper(language, fields).then(function () {
        _this2.showSuccess(__("translation_overwritten_successfully") || "Translation overwritten successfully");
      })["finally"](function () {
        if (_this2.hasOwnProperty("loadingOverwrite")) {
          _this2.loadingOverwrite = false;
        } else {
          _this2.isTranslating = false;
        }
      });
    },
    getDefaultLanguageData: function getDefaultLanguageData() {
      if (this.translations && this.translations[this.defaultLanguageId]) {
        return this.translations[this.defaultLanguageId];
      } else if (this.form && this.form[this.defaultLanguageId]) {
        return this.form[this.defaultLanguageId];
      }
      return {};
    },
    checkNonDefaultLanguagesHaveEmptyFields: function checkNonDefaultLanguagesHaveEmptyFields() {
      var fieldsToTranslate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      // Determine target object (translations or form)
      var targetObj = null;
      if (this.translations) {
        targetObj = this.translations;
      } else if (this.form) {
        targetObj = this.form;
      }
      if (!targetObj || !this.languages || this.languages.length <= 1) {
        return true; // If no languages or only one language, allow translation
      }
      var fields = fieldsToTranslate.length > 0 ? fieldsToTranslate : this.translatableFields || [];
      if (fields.length === 0) {
        return true; // If no fields to check, allow translation
      }

      // Check if any non-default language has at least one empty field
      var _iterator = _createForOfIteratorHelper(this.languages),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var lang = _step.value;
          if (lang.is_default) continue; // Skip default language

          var langData = targetObj[lang.id];
          if (!langData) {
            return true; // If language data doesn't exist, there are empty fields
          }

          // Check if any field is empty for this language
          var _iterator2 = _createForOfIteratorHelper(fields),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var field = _step2.value;
              var value = langData[field];
              if (value === null || value === undefined || value === "" || typeof value === "string" && value.trim() === "") {
                return true; // Found at least one empty field
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return false; // All fields in all non-default languages have values
    },
    translateEmptyHelper: function translateEmptyHelper(language) {
      var _this3 = this;
      var fieldsToTranslate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var source = this.getDefaultLanguageData();
      if (!source || Object.keys(source).length === 0) {
        var errorMsg = __("default_language_data_missing");
        this.showError(errorMsg);
        return Promise.reject("default_language_data_missing");
      }

      // Determine target object (translations or form)
      var targetObj = null;
      if (this.translations) {
        targetObj = this.translations;
      } else if (this.form) {
        targetObj = this.form;
      }
      var dataToSend = {};
      if (fieldsToTranslate.length > 0) {
        fieldsToTranslate.forEach(function (field) {
          dataToSend[field] = source[field];
        });
      } else {
        Object.keys(source).forEach(function (key) {
          if (_typeof(source[key]) !== "object") {
            dataToSend[key] = source[key];
          }
        });
      }

      // Check if all fields in dataToSend are null or empty
      var allFieldsNull = Object.keys(dataToSend).length > 0 && Object.keys(dataToSend).every(function (field) {
        var value = dataToSend[field];
        return value === null || value === undefined || value === "" || typeof value === "string" && value.trim() === "";
      });
      if (allFieldsNull) {
        var _errorMsg = __("translation_error_all_fields_empty") || "All fields are empty. Please fill at least one field in default language before translating.";
        this.showError(_errorMsg);
        return Promise.reject(new Error(_errorMsg));
      }
      return axios__WEBPACK_IMPORTED_MODULE_0___default().post("/api/languages/translate-empty", {
        target_language: language.code,
        data: dataToSend
      }).then(function (res) {
        if (res.data.status === 0) {
          throw new Error(res.data.message || __("something_went_wrong"));
        }
        var allTranslations = res.data.data;
        _this3.languages.forEach(function (lang) {
          if (lang.is_default) return; // skip default language

          var translated = allTranslations[lang.code];
          if (!translated) return;
          Object.keys(translated).forEach(function (field) {
            if (targetObj && targetObj[lang.id]) {
              if (!targetObj[lang.id][field] || targetObj[lang.id][field] === "") {
                _this3.$set(targetObj[lang.id], field, translated[field]);
              }
            }
          });
        });
        if (typeof _this3.convertTagNamesToIds === "function") {
          _this3.$nextTick(function () {
            _this3.convertTagNamesToIds();
          });
        }
        return res;
      })["catch"](function (error) {
        var msg = error.message;
        if (error.response && error.response.data && error.response.data.message) {
          msg = error.response.data.message;
        }
        var errorMessage = msg || __("something_went_wrong");
        _this3.showError(errorMessage);
        throw error;
      });
    },
    translateOverwriteHelper: function translateOverwriteHelper(language) {
      var _this4 = this;
      var fieldsToTranslate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var source = this.getDefaultLanguageData();
      if (!source || Object.keys(source).length === 0) {
        var errorMsg = __("default_language_data_missing");
        this.showError(errorMsg);
        return Promise.reject("default_language_data_missing");
      }

      // Determine target object (translations or form)
      var targetObj = null;
      if (this.translations) {
        targetObj = this.translations;
      } else if (this.form) {
        targetObj = this.form;
      }
      var dataToSend = {};
      if (fieldsToTranslate.length > 0) {
        fieldsToTranslate.forEach(function (field) {
          dataToSend[field] = source[field];
        });
      } else {
        Object.keys(source).forEach(function (key) {
          if (_typeof(source[key]) !== "object") {
            dataToSend[key] = source[key];
          }
        });
      }

      // Check if all fields in dataToSend are null or empty
      var allFieldsNull = Object.keys(dataToSend).length > 0 && Object.keys(dataToSend).every(function (field) {
        var value = dataToSend[field];
        return value === null || value === undefined || value === "" || typeof value === "string" && value.trim() === "";
      });
      if (allFieldsNull) {
        var _errorMsg2 = __("translation_error_all_fields_empty") || "All fields are empty. Please fill at least one field in default language before translating.";
        this.showError(_errorMsg2);
        return Promise.reject(new Error(_errorMsg2));
      }
      return axios__WEBPACK_IMPORTED_MODULE_0___default().post("/api/languages/translate-overwrite", {
        target_language: language.code,
        data: dataToSend
      }).then(function (res) {
        if (res.data.status === 0) {
          throw new Error(res.data.message || __("something_went_wrong"));
        }
        var allTranslations = res.data.data;
        _this4.languages.forEach(function (lang) {
          if (lang.is_default) return;
          var translated = allTranslations[lang.code];
          if (!translated) return;
          Object.keys(translated).forEach(function (field) {
            if (targetObj && targetObj[lang.id]) {
              _this4.$set(targetObj[lang.id], field, translated[field]);
            }
          });
        });
        if (typeof _this4.convertTagNamesToIds === "function") {
          _this4.$nextTick(function () {
            _this4.convertTagNamesToIds();
          });
        }
        return res;
      })["catch"](function (error) {
        var msg = error.message;
        if (error.response && error.response.data && error.response.data.message) {
          msg = error.response.data.message;
        }
        var errorMessage = msg || __("something_went_wrong");
        _this4.showError(errorMessage);
        throw error;
      })["finally"](function () {
        _this4.isLoading = false;
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Subscriptions/Subscriptions.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/Subscriptions/Subscriptions.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Subscriptions_vue_vue_type_template_id_23e12aae__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subscriptions.vue?vue&type=template&id=23e12aae */ "./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=template&id=23e12aae");
/* harmony import */ var _Subscriptions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscriptions.vue?vue&type=script&lang=js */ "./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Subscriptions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Subscriptions_vue_vue_type_template_id_23e12aae__WEBPACK_IMPORTED_MODULE_0__.render,
  _Subscriptions_vue_vue_type_template_id_23e12aae__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Subscriptions/Subscriptions.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Subscriptions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Subscriptions.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Subscriptions_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=template&id=23e12aae":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=template&id=23e12aae ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Subscriptions_vue_vue_type_template_id_23e12aae__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Subscriptions_vue_vue_type_template_id_23e12aae__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Subscriptions_vue_vue_type_template_id_23e12aae__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Subscriptions.vue?vue&type=template&id=23e12aae */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=template&id=23e12aae");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=template&id=23e12aae":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Subscriptions/Subscriptions.vue?vue&type=template&id=23e12aae ***!
  \*********************************************************************************************************************************************************************************************************************************/
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
          _vm._v(_vm._s(_vm.__("subscription_plans"))),
        ]),
        _vm._v(" "),
        _vm.$can("subscription_create")
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
                  "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap",
                attrs: { title: _vm.__("add_subscription") },
                on: { click: _vm.openAddModal },
              },
              [
                _c("i", {
                  staticClass: "fa fa-plus",
                  attrs: { "aria-hidden": "true" },
                }),
                _vm._v(" "),
                _c("span", [_vm._v(_vm._s(_vm.__("add_subscription")))]),
              ]
            )
          : _vm._e(),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "list-surface" }, [
        _c("div", { staticClass: "list-toolbar" }, [
          _c(
            "div",
            { staticClass: "d-flex gap-2" },
            [
              _c("b-form-input", {
                attrs: {
                  id: "subscription-name-input",
                  type: "text",
                  placeholder: _vm.__("enter_subscription_name"),
                },
                model: {
                  value: _vm.subscriptionName,
                  callback: function ($$v) {
                    _vm.subscriptionName = $$v
                  },
                  expression: "subscriptionName",
                },
              }),
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
                  staticClass: "btn btn-primary",
                  attrs: {
                    disabled: _vm.isUpdatingName,
                    title: _vm.__("update"),
                  },
                  on: { click: _vm.updateSubscriptionName },
                },
                [
                  _vm.isUpdatingName
                    ? _c("span", [
                        _c("i", { staticClass: "fa fa-spinner fa-spin" }),
                      ])
                    : _c("span", [_c("i", { staticClass: "fa fa-save" })]),
                ]
              ),
            ],
            1
          ),
          _vm._v(" "),
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
                on: {
                  input: function ($event) {
                    _vm.currentPage = 1
                    _vm.getPlans()
                  },
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
                  return _vm.getPlans()
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
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "table-responsive" },
          [
            _c("b-table", {
              staticClass: "text-nowrap",
              attrs: {
                items: _vm.translatedPlans,
                fields: _vm.fields,
                "sort-by": _vm.sortBy,
                "sort-desc": _vm.sortDesc,
                "sort-direction": _vm.sortDirection,
                bordered: true,
                busy: _vm.isLoading,
                stacked: "md",
                "show-empty": "",
                small: "",
              },
              on: {
                "update:sortBy": function ($event) {
                  _vm.sortBy = $event
                },
                "update:sort-by": function ($event) {
                  _vm.sortBy = $event
                },
                "update:sortDesc": function ($event) {
                  _vm.sortDesc = $event
                },
                "update:sort-desc": function ($event) {
                  _vm.sortDesc = $event
                },
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
                  key: "cell(name)",
                  fn: function (row) {
                    return [_c("strong", [_vm._v(_vm._s(row.item.name))])]
                  },
                },
                {
                  key: "cell(days)",
                  fn: function (row) {
                    return [
                      _c("span", [
                        _vm._v(
                          _vm._s(row.item.days) + " " + _vm._s(_vm.__("days"))
                        ),
                      ]),
                    ]
                  },
                },
                {
                  key: "cell(price)",
                  fn: function (row) {
                    return [
                      _c("span", [
                        _vm._v(_vm._s(parseFloat(row.item.price).toFixed(2))),
                      ]),
                    ]
                  },
                },
                {
                  key: "cell(discounted_price)",
                  fn: function (row) {
                    return [
                      row.item.discounted_price
                        ? _c("span", [
                            _vm._v(
                              _vm._s(
                                parseFloat(row.item.discounted_price).toFixed(2)
                              )
                            ),
                          ])
                        : _c("span", { staticClass: "text-muted" }, [
                            _vm._v("-"),
                          ]),
                    ]
                  },
                },
                {
                  key: "cell(free_delivery_above)",
                  fn: function (row) {
                    return [
                      row.item.free_delivery_above
                        ? _c("span", [
                            _vm._v(
                              _vm._s(
                                parseFloat(
                                  row.item.free_delivery_above
                                ).toFixed(2)
                              )
                            ),
                          ])
                        : _c("span", { staticClass: "text-muted" }, [
                            _vm._v("-"),
                          ]),
                    ]
                  },
                },
                {
                  key: "cell(status)",
                  fn: function (row) {
                    return [
                      row.item.status == 1
                        ? _c("span", { staticClass: "badge bg-success" }, [
                            _vm._v(_vm._s(_vm.__("active"))),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      row.item.status == 0
                        ? _c("span", { staticClass: "badge bg-danger" }, [
                            _vm._v(_vm._s(_vm.__("deactive"))),
                          ])
                        : _vm._e(),
                    ]
                  },
                },
                {
                  key: "cell(actions)",
                  fn: function (row) {
                    return [
                      _c("div", { staticClass: "list-actions" }, [
                        _vm.$can("subscription_update")
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
                                staticClass: "list-action-btn is-edit",
                                attrs: { title: _vm.__("edit") },
                                on: {
                                  click: function ($event) {
                                    return _vm.editPlan(row.item)
                                  },
                                },
                              },
                              [_c("i", { staticClass: "fa fa-pencil-alt" })]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _vm.$can("subscription_delete")
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
                                attrs: { title: _vm.__("delete") },
                                on: {
                                  click: function ($event) {
                                    return _vm.deletePlan(
                                      row.index,
                                      row.item.id
                                    )
                                  },
                                },
                              },
                              [_c("i", { staticClass: "fa fa-trash" })]
                            )
                          : _vm._e(),
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
            _c("b-pagination", {
              staticClass: "list-pagination",
              attrs: {
                "total-rows": _vm.totalRows,
                "per-page": _vm.perPage,
                align: "fill",
                size: "sm",
              },
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
            title: _vm.form.id
              ? _vm.__("edit_subscription_plan")
              : _vm.__("add_subscription"),
            size: "lg",
            "hide-footer": "",
            "no-close-on-backdrop": "",
          },
          on: { hidden: _vm.onModalHidden },
          model: {
            value: _vm.create_new,
            callback: function ($$v) {
              _vm.create_new = $$v
            },
            expression: "create_new",
          },
        },
        [
          _c(
            "form",
            {
              attrs: { id: "subscription-form" },
              on: {
                submit: function ($event) {
                  $event.preventDefault()
                  return _vm.savePlan.apply(null, arguments)
                },
              },
            },
            [
              _vm.languages.length &&
              _vm.form.translations &&
              Object.keys(_vm.form.translations).length > 0
                ? _c(
                    "b-tabs",
                    {
                      attrs: { "content-class": "mt-3" },
                      model: {
                        value: _vm.activeLanguageTab,
                        callback: function ($$v) {
                          _vm.activeLanguageTab = $$v
                        },
                        expression: "activeLanguageTab",
                      },
                    },
                    _vm._l(_vm.languages, function (language) {
                      return _c(
                        "b-tab",
                        {
                          key: language.id,
                          scopedSlots: _vm._u(
                            [
                              {
                                key: "title",
                                fn: function () {
                                  return [
                                    _c(
                                      "span",
                                      {
                                        class: {
                                          "text-primary font-weight-bold":
                                            language.is_default,
                                        },
                                      },
                                      [
                                        _vm._v(
                                          "\n                            " +
                                            _vm._s(language.name) +
                                            "\n                        "
                                        ),
                                      ]
                                    ),
                                  ]
                                },
                                proxy: true,
                              },
                            ],
                            null,
                            true
                          ),
                        },
                        [
                          _vm._v(" "),
                          language.is_default && _vm.languages.length > 1
                            ? _c(
                                "div",
                                { staticClass: "mb-3" },
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
                                      staticClass: "mr-2",
                                      attrs: {
                                        size: "sm",
                                        variant: "outline-primary",
                                        title: _vm.__(
                                          "only_empty_fields_will_be_translated_existing_content_will_not_be_changed"
                                        ),
                                        disabled: _vm.loadingEmpty,
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.translateEmpty(language)
                                        },
                                      },
                                    },
                                    [
                                      !_vm.loadingEmpty
                                        ? _c("span", [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__("translate_empty_fields")
                                              )
                                            ),
                                          ])
                                        : _c("b-spinner", {
                                            attrs: { small: "" },
                                          }),
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
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
                                        variant: "outline-danger",
                                        title: _vm.__(
                                          "all_fields_will_be_translated_and_existing_content_will_be_overwritten"
                                        ),
                                        disabled: _vm.loadingOverwrite,
                                      },
                                      on: {
                                        click: function ($event) {
                                          return _vm.translateOverwrite(
                                            language
                                          )
                                        },
                                      },
                                    },
                                    [
                                      !_vm.loadingOverwrite
                                        ? _c("span", [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__(
                                                  "translate_and_overwrite"
                                                )
                                              )
                                            ),
                                          ])
                                        : _c("b-spinner", {
                                            attrs: { small: "" },
                                          }),
                                    ],
                                    1
                                  ),
                                  _vm._v(" "),
                                  _vm.translateSuccessMessage
                                    ? _c(
                                        "div",
                                        {
                                          staticClass:
                                            "text-success mt-2 font-weight-bold",
                                        },
                                        [
                                          _vm._v(
                                            "\n                            " +
                                              _vm._s(
                                                _vm.translateSuccessMessage
                                              ) +
                                              "\n                        "
                                          ),
                                        ]
                                      )
                                    : _vm._e(),
                                ],
                                1
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.form.translations &&
                          _vm.form.translations[language.id]
                            ? _c("div", { staticClass: "form-group" }, [
                                language.is_default
                                  ? _c("i", { staticClass: "text-danger" }, [
                                      _vm._v("*"),
                                    ])
                                  : _vm._e(),
                                _vm._v(" "),
                                _c("label", [
                                  _vm._v(_vm._s(_vm.__("plan_name"))),
                                ]),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value:
                                        _vm.form.translations[language.id].name,
                                      expression:
                                        "form.translations[language.id].name",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "text",
                                    id: "plan_name_" + language.id,
                                    placeholder: _vm.__("enter_plan_name"),
                                  },
                                  domProps: {
                                    value:
                                      _vm.form.translations[language.id].name,
                                  },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.form.translations[language.id],
                                        "name",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          language.is_default
                            ? [
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-6 mb-3" }, [
                                    _c("label", { attrs: { for: "days" } }, [
                                      _vm._v(_vm._s(_vm.__("days")) + " "),
                                      _c(
                                        "span",
                                        { staticClass: "text-danger" },
                                        [_vm._v("*")]
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.form.days,
                                          expression: "form.days",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "number",
                                        min: "1",
                                        placeholder: _vm.__("days"),
                                        required: "",
                                      },
                                      domProps: { value: _vm.form.days },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.form,
                                            "days",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "div",
                                    { staticClass: "col-md-6 mt-3 mb-3" },
                                    [
                                      _c("label", [
                                        _vm._v(_vm._s(_vm.__("status")) + " "),
                                        _c(
                                          "span",
                                          { staticClass: "text-danger" },
                                          [_vm._v("*")]
                                        ),
                                      ]),
                                      _vm._v(" "),
                                      _c("b-form-radio-group", {
                                        attrs: {
                                          options: [
                                            {
                                              text: _vm.__("deactive"),
                                              value: 0,
                                            },
                                            {
                                              text: _vm.__("active"),
                                              value: 1,
                                            },
                                          ],
                                          buttons: "",
                                          "button-variant":
                                            "outline-primary d-flex gap-2",
                                          required: "",
                                        },
                                        model: {
                                          value: _vm.form.status,
                                          callback: function ($$v) {
                                            _vm.$set(_vm.form, "status", $$v)
                                          },
                                          expression: "form.status",
                                        },
                                      }),
                                    ],
                                    1
                                  ),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row mt-3" }, [
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("label", [
                                      _vm._v(
                                        "\n                                    " +
                                          _vm._s(_vm.__("price")) +
                                          " (" +
                                          _vm._s(_vm.$currency) +
                                          ")\n                                "
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.form.price,
                                          expression: "form.price",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "number",
                                        id: "price",
                                        placeholder: _vm.__("enter_price"),
                                        step: "0.01",
                                        min: "1",
                                        required: "",
                                      },
                                      domProps: { value: _vm.form.price },
                                      on: {
                                        input: [
                                          function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.form,
                                              "price",
                                              $event.target.value
                                            )
                                          },
                                          _vm.validateDiscountedPrice,
                                        ],
                                      },
                                    }),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("label", [
                                      _vm._v(
                                        "\n                                    " +
                                          _vm._s(_vm.__("discounted_price")) +
                                          " (" +
                                          _vm._s(_vm.$currency) +
                                          ")\n                                "
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.form.discounted_price,
                                          expression: "form.discounted_price",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      class: {
                                        "is-invalid": _vm.discountedPriceError,
                                      },
                                      attrs: {
                                        type: "number",
                                        step: "0.01",
                                        min: "1",
                                        placeholder: _vm.__(
                                          "enter_discounted_price"
                                        ),
                                      },
                                      domProps: {
                                        value: _vm.form.discounted_price,
                                      },
                                      on: {
                                        input: [
                                          function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.form,
                                              "discounted_price",
                                              $event.target.value
                                            )
                                          },
                                          _vm.validateDiscountedPrice,
                                        ],
                                      },
                                    }),
                                    _vm._v(" "),
                                    _vm.discountedPriceError
                                      ? _c(
                                          "div",
                                          { staticClass: "invalid-feedback" },
                                          [
                                            _vm._v(
                                              "\n                                    " +
                                                _vm._s(
                                                  _vm.discountedPriceError
                                                ) +
                                                "\n                                "
                                            ),
                                          ]
                                        )
                                      : _vm._e(),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row mt-3" }, [
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("label", [
                                      _vm._v(
                                        "\n                                    " +
                                          _vm._s(
                                            _vm.__("free_delivery_above")
                                          ) +
                                          " (" +
                                          _vm._s(_vm.$currency) +
                                          ")\n                                "
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.form.free_delivery_above,
                                          expression:
                                            "form.free_delivery_above",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "number",
                                        id: "free_delivery_above",
                                        placeholder: _vm.__(
                                          "enter_free_delivery_above"
                                        ),
                                        step: "0.01",
                                        min: "0",
                                      },
                                      domProps: {
                                        value: _vm.form.free_delivery_above,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.form,
                                            "free_delivery_above",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                    _vm._v(" "),
                                    _c("small", { staticClass: "text-muted" }, [
                                      _vm._v(
                                        _vm._s(
                                          _vm.__(
                                            "minimum_order_amount_for_free_delivery"
                                          )
                                        )
                                      ),
                                    ]),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("label", [
                                      _vm._v(_vm._s(_vm.__("ios_product_id"))),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.form.ios_product_id,
                                          expression: "form.ios_product_id",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        id: "ios_product_id",
                                        placeholder: _vm.__(
                                          "enter_ios_product_id"
                                        ),
                                      },
                                      domProps: {
                                        value: _vm.form.ios_product_id,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.form,
                                            "ios_product_id",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                    _vm._v(" "),
                                    _c("small", { staticClass: "text-muted" }, [
                                      _vm._v(
                                        _vm._s(
                                          _vm.__(
                                            "ios_in_app_purchase_product_id"
                                          )
                                        )
                                      ),
                                    ]),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c(
                                      "div",
                                      {
                                        staticClass:
                                          "alert alert-success mt-2 mb-3",
                                        attrs: { role: "alert" },
                                      },
                                      [
                                        _c(
                                          "small",
                                          [
                                            _c("i", {
                                              staticClass: "fa fa-info-circle",
                                            }),
                                            _vm._v(" "),
                                            _c("strong", [
                                              _vm._v(
                                                _vm._s(_vm.__("note")) + ":"
                                              ),
                                            ]),
                                            _vm._v(
                                              " " +
                                                _vm._s(
                                                  _vm.__(
                                                    "please_configure_free_delivery_settings_properly"
                                                  )
                                                ) +
                                                "\n                                        " +
                                                _vm._s(
                                                  _vm.__(
                                                    "to_avoid_conflicts_with_time_slots"
                                                  )
                                                ) +
                                                ".\n                                        "
                                            ),
                                            _c(
                                              "router-link",
                                              {
                                                staticClass: "alert-link",
                                                attrs: {
                                                  to: "/delivery_settings",
                                                },
                                              },
                                              [
                                                _vm._v(
                                                  "\n                                            " +
                                                    _vm._s(
                                                      _vm.__(
                                                        "configure_delivery_settings"
                                                      )
                                                    ) +
                                                    " "
                                                ),
                                                _c("i", {
                                                  staticClass:
                                                    "fa fa-external-link-alt",
                                                }),
                                              ]
                                            ),
                                          ],
                                          1
                                        ),
                                      ]
                                    ),
                                  ]),
                                ]),
                              ]
                            : _vm._e(),
                        ],
                        2
                      )
                    }),
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "form-group d-flex justify-content-end gap-2" },
                [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-secondary",
                      attrs: { type: "button" },
                      on: { click: _vm.closeModal },
                    },
                    [
                      _vm._v(
                        "\n                    " +
                          _vm._s(_vm.__("cancel")) +
                          "\n                "
                      ),
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary",
                      attrs: { type: "submit", disabled: _vm.isSubmitting },
                      on: { click: _vm.savePlan },
                    },
                    [
                      _vm.isSubmitting
                        ? _c("span", [_vm._v(_vm._s(_vm.__("saving")) + "...")])
                        : _c("span", [_vm._v(_vm._s(_vm.__("save")))]),
                    ]
                  ),
                ]
              ),
            ],
            1
          ),
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