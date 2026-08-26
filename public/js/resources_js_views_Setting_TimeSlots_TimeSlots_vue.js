"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Setting_TimeSlots_TimeSlots_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=script&lang=js":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=script&lang=js ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['record'],
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_2__["default"]],
  data: function data() {
    return {
      isLoading: false,
      id: this.record ? this.record.id : null,
      title: this.record ? this.record.title : null,
      from_time: this.record ? this.record.from_time : null,
      to_time: this.record ? this.record.to_time : null,
      last_order_time: this.record ? this.record.last_order_time : null,
      status: this.record && this.record.status !== undefined ? this.record.status : 1,
      is_free_delivery: this.record && this.record.is_free_delivery !== undefined ? this.record.is_free_delivery : 0,
      hasActiveSubscriptionPlans: false,
      // Track if there are active subscription plans
      activeLanguageTab: 0,
      languages: [],
      defaultLanguageId: null,
      translations: {},
      translatableFields: ['title'],
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false
    };
  },
  computed: {
    modal_title: function modal_title() {
      var title = this.id ? __('edit') : __('add');
      title += " ";
      title += __('time_slot');
      return title;
    }
  },
  methods: {
    loadLanguages: function loadLanguages() {
      var _this = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var _this$record, _this$record2;
        var res, defaultLang, _this$translations$_t;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().get(_this.$apiUrl + '/active_languages');
              case 2:
                res = _context.sent;
                _this.languages = res.data.data;
                defaultLang = _this.languages.find(function (l) {
                  return l.is_default;
                });
                _this.defaultLanguageId = defaultLang.id;

                // init translations
                _this.languages.forEach(function (lang) {
                  _this.$set(_this.translations, lang.id, {
                    title: ''
                  });
                });

                // fill edit data
                if ((_this$record = _this.record) !== null && _this$record !== void 0 && _this$record.translations) {
                  _this.record.translations.forEach(function (t) {
                    if (_this.translations[t.language_id]) {
                      _this.translations[t.language_id].title = t.title;
                    }
                  });
                }

                // fallback: base title → default language
                if ((_this$record2 = _this.record) !== null && _this$record2 !== void 0 && _this$record2.title && _this.defaultLanguageId) {
                  (_this$translations$_t = _this.translations[_this.defaultLanguageId]).title || (_this$translations$_t.title = _this.record.title);
                }
              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    },
    // Check if there are active subscription plans
    checkActiveSubscriptionPlans: function checkActiveSubscriptionPlans() {
      var _this2 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
        var response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().get(_this2.$apiUrl + '/delivery_settings/check_active_subscription_plans');
              case 3:
                response = _context2.sent;
                if (response.data.status === 1) {
                  _this2.hasActiveSubscriptionPlans = response.data.data.has_active_subscription_plans;
                }
                _context2.next = 10;
                break;
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.error('Error checking active subscription plans:', _context2.t0);
              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }))();
    },
    showModal: function showModal() {
      this.$refs['my-modal'].show();
      // Check for active subscription plans when modal opens
      this.checkActiveSubscriptionPlans();
    },
    hideModal: function hideModal() {
      this.$refs['my-modal'].hide();
    },
    validateDefaultLanguageForTranslation: function validateDefaultLanguageForTranslation() {
      var _this3 = this;
      var form = this.$refs['my-form'];
      if (form && !form.reportValidity()) {
        this.$nextTick(function () {
          return _this3.switchToDefaultLanguageTab();
        });
        return false;
      }
      var defaultData = this.translations[this.defaultLanguageId];
      if (!defaultData || !defaultData.title || !String(defaultData.title).trim()) {
        this.showError(__('please_fill_default_language_required_fields') || 'Please fill title in default language');
        this.$nextTick(function () {
          return _this3.switchToDefaultLanguageTab();
        });
        return false;
      }
      return true;
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this4 = this;
      var index = this.languages.findIndex(function (lang) {
        return lang.id === _this4.defaultLanguageId;
      });
      if (index !== -1) this.activeLanguageTab = index;
    },
    saveRecord: function saveRecord() {
      var _this5 = this;
      if (!this.validateDefaultLanguageForTranslation()) return;
      var vm = this;
      this.isLoading = true;
      var saveSequentially = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3() {
          var timeSlotId, _iterator, _step, _res$data$data, language, title, formData, url, res;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  timeSlotId = _this5.id;
                  _iterator = _createForOfIteratorHelper(_this5.languages);
                  _context3.prev = 2;
                  _iterator.s();
                case 4:
                  if ((_step = _iterator.n()).done) {
                    _context3.next = 21;
                    break;
                  }
                  language = _step.value;
                  title = _this5.translations[language.id].title;
                  if (!(!language.is_default && !title)) {
                    _context3.next = 9;
                    break;
                  }
                  return _context3.abrupt("continue", 19);
                case 9:
                  formData = new FormData();
                  if (timeSlotId) formData.append('id', timeSlotId);
                  formData.append('language_id', language.id);
                  formData.append('title', title);
                  if (language.is_default) {
                    formData.append('from_time', _this5.from_time);
                    formData.append('to_time', _this5.to_time);
                    formData.append('last_order_time', _this5.last_order_time);
                    formData.append('status', _this5.status);
                    formData.append('is_free_delivery', _this5.is_free_delivery ? 1 : 0);
                  }
                  url = timeSlotId ? _this5.$apiUrl + '/delivery_settings/update' : _this5.$apiUrl + '/delivery_settings/save';
                  _context3.next = 17;
                  return axios__WEBPACK_IMPORTED_MODULE_1___default().post(url, formData);
                case 17:
                  res = _context3.sent;
                  if (!timeSlotId && (_res$data$data = res.data.data) !== null && _res$data$data !== void 0 && _res$data$data.id) {
                    timeSlotId = res.data.data.id;
                  }
                case 19:
                  _context3.next = 4;
                  break;
                case 21:
                  _context3.next = 26;
                  break;
                case 23:
                  _context3.prev = 23;
                  _context3.t0 = _context3["catch"](2);
                  _iterator.e(_context3.t0);
                case 26:
                  _context3.prev = 26;
                  _iterator.f();
                  return _context3.finish(26);
                case 29:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, null, [[2, 23, 26, 29]]);
        }));
        return function saveSequentially() {
          return _ref.apply(this, arguments);
        };
      }();
      saveSequentially().then(function () {
        _this5.$eventBus.$emit('TimeSlotsSaved', __('time_slot_saved_successfully'));
        _this5.hideModal();
      })["catch"](function () {
        _this5.isLoading = false;
        _this5.showError(__('something_went_wrong'));
      });
    }
  },
  mounted: function mounted() {
    this.showModal();
    this.loadLanguages();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var vuejs_datatable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vuejs-datatable */ "./node_modules/vuejs-datatable/dist/vuejs-datatable.esm.js");
/* harmony import */ var _Edit_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue */ "./resources/js/views/Setting/TimeSlots/Edit.vue");
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



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    VuejsDatatableFactory: vuejs_datatable__WEBPACK_IMPORTED_MODULE_0__.VuejsDatatableFactory,
    "app-edit-record": _Edit_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      fields: [{
        key: "id",
        label: __('id'),
        sortable: true,
        sortDirection: "desc"
      }, {
        key: "title",
        label: __('title'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "from_time",
        label: __('from_time'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "to_time",
        label: __('to_time'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "last_order_time",
        label: __('last_order_time'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "status",
        label: __('status'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "is_free_delivery",
        label: __('free_delivery'),
        sortable: true,
        sortDirection: "desc",
        "class": "text-center"
      }, {
        key: "actions",
        label: __('actions')
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      page: 1,
      time_slots: [],
      isLoading: false,
      sectionStyle: "style_1",
      max_visible_categories: 12,
      max_col_in_single_row: 3,
      edit_record: null,
      is_time_slots_enabled: false,
      delivery_starts_from: "",
      allowed_days: 1,
      timeSlot_settingsObject: {
        time_slot_setting: false
      },
      timeSlot_settings: {},
      validationNoOfDaysError: null,
      validationNoOfEstimateDaysError: null,
      currentLanguageId: null,
      activeLanguages: []
    };
  },
  computed: {
    translatedTimeSlots: function translatedTimeSlots() {
      var _this = this;
      if (!this.currentLanguageId || this.time_slots.length === 0) {
        return this.time_slots;
      }
      return this.time_slots.map(function (slot) {
        var translatedSlot = _objectSpread({}, slot);
        if (slot.translations && Array.isArray(slot.translations)) {
          var translation = slot.translations.find(function (t) {
            return t.language_id === _this.currentLanguageId;
          });
          if (translation && translation.title && translation.title.trim() !== '') {
            translatedSlot.title = translation.title;
          }
        }
        return translatedSlot;
      });
    },
    sortOptions: function sortOptions() {
      // Create an options list from our fields
      return this.fields.filter(function (f) {
        return f.sortable;
      }).map(function (f) {
        return {
          text: f.label,
          value: f.key
        };
      });
    }
  },
  mounted: function mounted() {
    // Set the initial number of items
    this.totalRows = this.time_slots.length;
  },
  created: function created() {
    var _this2 = this;
    this.$eventBus.$on("TimeSlotsSaved", function (message) {
      _this2.showMessage("success", message);
      _this2.getTimeSlots();
    });
    this.fetchActiveLanguages().then(function () {
      _this2.getTimeSlots();
    });
    this.getTimeSlotsSettings();
  },
  watch: {
    // Watch for time_slot_setting changes
    'timeSlot_settingsObject.time_slot_setting': function timeSlot_settingsObjectTime_slot_setting(newVal) {
      if (!newVal) {
        // If main time slot setting is disabled, disable time slots too
        this.timeSlot_settingsObject.time_slots_is_enabled = false;
      }
    }
  },
  methods: {
    /**
     * List: show store-formatted time from API (*_display). Edit modal still uses raw HH:mm fields on the same row.
     */
    timeSlotTimeLabel: function timeSlotTimeLabel(item, field) {
      if (!item) return '';
      var displayKey = "".concat(field, "_display");
      var v = item[displayKey];
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        return v;
      }
      return item[field] != null ? item[field] : '';
    },
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      return axios.get(this.$apiUrl + '/active_languages').then(function (response) {
        if (response.data.data && Array.isArray(response.data.data)) {
          _this3.activeLanguages = response.data.data;
          var appLocale = window.appLocale || 'en';
          var currentLanguage = _this3.activeLanguages.find(function (lang) {
            return lang.code === appLocale;
          });
          if (currentLanguage) {
            _this3.currentLanguageId = currentLanguage.id;
          } else {
            var defaultLanguage = _this3.activeLanguages.find(function (lang) {
              return lang.is_default === 1;
            });
            if (defaultLanguage) {
              _this3.currentLanguageId = defaultLanguage.id;
            }
          }
        }
      })["catch"](function (err) {
        console.error('Language load error', err);
      });
    },
    validateNoOfDays: function validateNoOfDays() {
      if (this.timeSlot_settingsObject.time_slots_allowed_days < 1) {
        this.validationNoOfDaysError = "No of Users must be integer value.";
        this.timeSlot_settingsObject.time_slots_allowed_days = "";
      } else {
        this.validationNoOfDaysError = null;
      }
    },
    validateNoOfEstimateDays: function validateNoOfEstimateDays() {
      if (this.timeSlot_settingsObject.delivery_estimate_days < 1) {
        this.validationNoOfEstimateDaysError = "No of Users must be integer value.";
        this.timeSlot_settingsObject.delivery_estimate_days = "";
      } else {
        this.validationNoOfEstimateDaysError = null;
      }
    },
    getTimeSlots: function getTimeSlots() {
      var _this4 = this;
      this.isLoading = true;
      axios.get(this.$apiUrl + "/delivery_settings").then(function (response) {
        _this4.isLoading = false;
        var data = response.data;
        _this4.time_slots = data.data;
        _this4.totalRows = _this4.time_slots.length;
      });
    },
    deleteTimeSlots: function deleteTimeSlots(index, id) {
      var _this5 = this;
      this.$swal.fire({
        title: "Are you Sure?",
        text: "You want be able to revert this",
        confirmButtonText: "Yes, Sure",
        cancelButtonText: "Cancel",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#37a279",
        cancelButtonColor: "#d33"
      }).then(function (result) {
        if (result.value) {
          _this5.isLoading = true;
          var postData = {
            id: id
          };
          axios.post(_this5.$apiUrl + "/delivery_settings/delete", postData).then(function (response) {
            _this5.isLoading = false;
            var data = response.data;
            _this5.time_slots.splice(index, 1);
            _this5.showMessage("success", data.message);
          });
        }
      });
    },
    getTimeSlotsSettings: function getTimeSlotsSettings() {
      var _this6 = this;
      axios.get(this.$apiUrl + "/delivery_settings/getTimeSlotsSettings").then(function (response) {
        var data = response.data.data;
        _this6.timeSlot_settingsObject = data.timeSlot_settingsObject;
        _this6.timeSlot_settings = response.data.data.timeSlot_settings;
        _this6.timeSlot_settings.map(function (item, index) {
          if (item.value === 'false' || item.value === 'true') {
            _this6.timeSlot_settingsObject[item.variable] = item.value === 'false' ? false : true;
          } else {
            _this6.timeSlot_settingsObject[item.variable] = item.value;
          }
        });
      });
    },
    addTimeSlotsSettings: function addTimeSlotsSettings() {
      var _this7 = this;
      this.isLoading = true;
      var timeSlot_settingsObject = this.timeSlot_settingsObject;
      var formData = new FormData();
      for (var key in timeSlot_settingsObject) {
        formData.append(key, timeSlot_settingsObject[key]);
      }
      axios.post(this.$apiUrl + "/delivery_settings/saveTimeSlotsSettings", formData).then(function (response) {
        var data = response.data;
        if (data.status === 1) {
          _this7.getTimeSlotsSettings();
          _this7.isLoading = false;
          _this7.showMessage("success", data.message);
        } else {
          _this7.isLoading = false;
          _this7.showMessage("error", data.message);
        }
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.$eventBus.$off('TimeSlotsSaved');
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.image_preview[data-v-4973d20f] {\n    margin-top: 5px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_4973d20f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_4973d20f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_4973d20f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Setting/TimeSlots/Edit.vue":
/*!*******************************************************!*\
  !*** ./resources/js/views/Setting/TimeSlots/Edit.vue ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue_vue_type_template_id_4973d20f_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=4973d20f&scoped=true */ "./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=template&id=4973d20f&scoped=true");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js */ "./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=script&lang=js");
/* harmony import */ var _Edit_vue_vue_type_style_index_0_id_4973d20f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css */ "./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_4973d20f_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Edit_vue_vue_type_template_id_4973d20f_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "4973d20f",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Setting/TimeSlots/Edit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Setting/TimeSlots/TimeSlots.vue":
/*!************************************************************!*\
  !*** ./resources/js/views/Setting/TimeSlots/TimeSlots.vue ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TimeSlots_vue_vue_type_template_id_7ed9bfb3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TimeSlots.vue?vue&type=template&id=7ed9bfb3 */ "./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=template&id=7ed9bfb3");
/* harmony import */ var _TimeSlots_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TimeSlots.vue?vue&type=script&lang=js */ "./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TimeSlots_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _TimeSlots_vue_vue_type_template_id_7ed9bfb3__WEBPACK_IMPORTED_MODULE_0__.render,
  _TimeSlots_vue_vue_type_template_id_7ed9bfb3__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Setting/TimeSlots/TimeSlots.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=script&lang=js":
/*!*******************************************************************************!*\
  !*** ./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=script&lang=js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=script&lang=js":
/*!************************************************************************************!*\
  !*** ./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=script&lang=js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TimeSlots_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TimeSlots.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TimeSlots_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css":
/*!***************************************************************************************************************!*\
  !*** ./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_4973d20f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/style-loader/dist/cjs.js!../../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=style&index=0&id=4973d20f&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=template&id=4973d20f&scoped=true":
/*!*************************************************************************************************!*\
  !*** ./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=template&id=4973d20f&scoped=true ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_4973d20f_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_4973d20f_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_4973d20f_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=template&id=4973d20f&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=template&id=4973d20f&scoped=true");


/***/ }),

/***/ "./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=template&id=7ed9bfb3":
/*!******************************************************************************************!*\
  !*** ./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=template&id=7ed9bfb3 ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TimeSlots_vue_vue_type_template_id_7ed9bfb3__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TimeSlots_vue_vue_type_template_id_7ed9bfb3__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TimeSlots_vue_vue_type_template_id_7ed9bfb3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TimeSlots.vue?vue&type=template&id=7ed9bfb3 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=template&id=7ed9bfb3");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=template&id=4973d20f&scoped=true":
/*!****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/Edit.vue?vue&type=template&id=4973d20f&scoped=true ***!
  \****************************************************************************************************************************************************************************************************************************************/
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
    "b-modal",
    {
      ref: "my-modal",
      attrs: { title: _vm.modal_title, "no-fade": "", static: "" },
      on: {
        hidden: function ($event) {
          return _vm.$emit("modalClose")
        },
      },
    },
    [
      _c(
        "div",
        { attrs: { slot: "modal-footer" }, slot: "modal-footer" },
        [
          _c(
            "b-button",
            {
              attrs: { variant: "primary", disabled: _vm.isLoading },
              on: { click: _vm.saveRecord },
            },
            [
              _vm._v(
                "\n            " + _vm._s(_vm.__("save")) + "\n            "
              ),
              _vm.isLoading
                ? _c("b-spinner", { attrs: { small: "", label: "Spinning" } })
                : _vm._e(),
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "b-button",
            { attrs: { variant: "secondary" }, on: { click: _vm.hideModal } },
            [_vm._v(_vm._s(_vm.__("cancel")))]
          ),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "form",
        {
          ref: "my-form",
          on: {
            submit: function ($event) {
              $event.preventDefault()
              return _vm.saveRecord.apply(null, arguments)
            },
          },
        },
        [
          _vm.languages.length > 0
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
                      attrs: { title: language.name, lazy: "" },
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
                                      "\n                        " +
                                        _vm._s(language.name) +
                                        "\n                    "
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
                                    : _c("b-spinner", { attrs: { small: "" } }),
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
                                      return _vm.translateOverwrite(language)
                                    },
                                  },
                                },
                                [
                                  !_vm.loadingOverwrite
                                    ? _c("span", [
                                        _vm._v(
                                          _vm._s(
                                            _vm.__("translate_and_overwrite")
                                          )
                                        ),
                                      ])
                                    : _c("b-spinner", { attrs: { small: "" } }),
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
                                        "\n                        " +
                                          _vm._s(_vm.translateSuccessMessage) +
                                          "\n                    "
                                      ),
                                    ]
                                  )
                                : _vm._e(),
                            ],
                            1
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _c("div", { staticClass: "row" }, [
                        _c("div", { staticClass: "form-group" }, [
                          _c("label", [_vm._v(_vm._s(_vm.__("title")))]),
                          _vm._v(" "),
                          language.is_default
                            ? _c("i", { staticClass: "text-danger" }, [
                                _vm._v("*"),
                              ])
                            : _vm._e(),
                          _vm._v(" "),
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.translations[language.id].title,
                                expression: "translations[language.id].title",
                              },
                            ],
                            staticClass: "form-control",
                            attrs: {
                              type: "text",
                              required: language.is_default ? true : undefined,
                              placeholder: _vm.__("morning_9am_to_12pm"),
                            },
                            domProps: {
                              value: _vm.translations[language.id].title,
                            },
                            on: {
                              input: function ($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.$set(
                                  _vm.translations[language.id],
                                  "title",
                                  $event.target.value
                                )
                              },
                            },
                          }),
                        ]),
                        _vm._v(" "),
                        language.is_default
                          ? _c("div", { staticClass: "form-group" }, [
                              _c("label", [
                                _vm._v(_vm._s(_vm.__("from_time"))),
                                _c("small", [
                                  _vm._v(
                                    "(" +
                                      _vm._s(_vm.__("24_hours_formate")) +
                                      ")"
                                  ),
                                ]),
                              ]),
                              _vm._v(" "),
                              _c("i", { staticClass: "text-danger" }, [
                                _vm._v("*"),
                              ]),
                              _vm._v(" "),
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.from_time,
                                    expression: "from_time",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: { type: "time", required: "" },
                                domProps: { value: _vm.from_time },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.from_time = $event.target.value
                                  },
                                },
                              }),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        language.is_default
                          ? _c("div", { staticClass: "form-group" }, [
                              _c("label", [
                                _vm._v(" " + _vm._s(_vm.__("to_time"))),
                                _c("small", [
                                  _vm._v(
                                    "(" +
                                      _vm._s(_vm.__("24_hours_formate")) +
                                      ")"
                                  ),
                                ]),
                              ]),
                              _vm._v(" "),
                              _c("i", { staticClass: "text-danger" }, [
                                _vm._v("*"),
                              ]),
                              _vm._v(" "),
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.to_time,
                                    expression: "to_time",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: { type: "time", required: "" },
                                domProps: { value: _vm.to_time },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.to_time = $event.target.value
                                  },
                                },
                              }),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        language.is_default
                          ? _c("div", { staticClass: "form-group" }, [
                              _c("label", [
                                _vm._v(" " + _vm._s(_vm.__("last_order_time"))),
                                _c("small", [
                                  _vm._v(
                                    "(" +
                                      _vm._s(_vm.__("24_hours_formate")) +
                                      ")"
                                  ),
                                ]),
                              ]),
                              _vm._v(" "),
                              _c("i", { staticClass: "text-danger" }, [
                                _vm._v("*"),
                              ]),
                              _vm._v(" "),
                              _c("input", {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.last_order_time,
                                    expression: "last_order_time",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: { type: "time", required: "" },
                                domProps: { value: _vm.last_order_time },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.last_order_time = $event.target.value
                                  },
                                },
                              }),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        language.is_default
                          ? _c("div", { staticClass: "form-group" }, [
                              _c("label", [
                                _vm._v(_vm._s(_vm.__("free_delivery"))),
                              ]),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "col-md-9 text-left mt-1" },
                                [
                                  _c(
                                    "div",
                                    {
                                      staticClass:
                                        "position-relative d-inline-block",
                                    },
                                    [
                                      _c("input", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value: _vm.is_free_delivery,
                                            expression: "is_free_delivery",
                                          },
                                          {
                                            name: "b-tooltip",
                                            rawName: "v-b-tooltip.hover",
                                            modifiers: { hover: true },
                                          },
                                        ],
                                        staticClass: "form-check-input",
                                        attrs: {
                                          type: "checkbox",
                                          id: "is_free_delivery",
                                          disabled:
                                            _vm.hasActiveSubscriptionPlans,
                                          title: _vm.hasActiveSubscriptionPlans
                                            ? _vm.__(
                                                "free_delivery_disabled_active_subscription_plans_tooltip"
                                              )
                                            : "",
                                        },
                                        domProps: {
                                          value: 1,
                                          checked: Array.isArray(
                                            _vm.is_free_delivery
                                          )
                                            ? _vm._i(_vm.is_free_delivery, 1) >
                                              -1
                                            : _vm.is_free_delivery,
                                        },
                                        on: {
                                          change: function ($event) {
                                            var $$a = _vm.is_free_delivery,
                                              $$el = $event.target,
                                              $$c = $$el.checked ? true : false
                                            if (Array.isArray($$a)) {
                                              var $$v = 1,
                                                $$i = _vm._i($$a, $$v)
                                              if ($$el.checked) {
                                                $$i < 0 &&
                                                  (_vm.is_free_delivery =
                                                    $$a.concat([$$v]))
                                              } else {
                                                $$i > -1 &&
                                                  (_vm.is_free_delivery = $$a
                                                    .slice(0, $$i)
                                                    .concat($$a.slice($$i + 1)))
                                              }
                                            } else {
                                              _vm.is_free_delivery = $$c
                                            }
                                          },
                                        },
                                      }),
                                      _vm._v(" "),
                                      _c(
                                        "label",
                                        {
                                          staticClass: "form-check-label ml-2",
                                          class: {
                                            "text-muted":
                                              _vm.hasActiveSubscriptionPlans,
                                          },
                                          attrs: { for: "is_free_delivery" },
                                        },
                                        [
                                          _vm._v(
                                            "\n                                    " +
                                              _vm._s(
                                                _vm.__("enable_free_delivery")
                                              ) +
                                              "\n                                "
                                          ),
                                        ]
                                      ),
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _vm.hasActiveSubscriptionPlans &&
                                  language.is_default
                                    ? _c(
                                        "div",
                                        {
                                          staticClass:
                                            "alert alert-success mt-2 mb-0",
                                          attrs: { role: "alert" },
                                        },
                                        [
                                          _c(
                                            "small",
                                            [
                                              _c("i", {
                                                staticClass:
                                                  "fa fa-info-circle",
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
                                                      "free_delivery_disabled_active_subscription_plans_message"
                                                    )
                                                  ) +
                                                  "\n                                    "
                                              ),
                                              _c(
                                                "router-link",
                                                {
                                                  staticClass: "alert-link",
                                                  attrs: {
                                                    to: "/subscriptions",
                                                  },
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                        " +
                                                      _vm._s(
                                                        _vm.__(
                                                          "go_to_subscriptions"
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
                                      )
                                    : _vm._e(),
                                ]
                              ),
                            ])
                          : _vm._e(),
                        _vm._v(" "),
                        language.is_default
                          ? _c("div", { staticClass: "form-group" }, [
                              _c("label", [_vm._v(_vm._s(_vm.__("status")))]),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "col-md-9 text-left mt-1" },
                                [
                                  _c("b-form-radio-group", {
                                    attrs: {
                                      options: [
                                        {
                                          text: _vm.__("deactivate"),
                                          value: 0,
                                        },
                                        { text: _vm.__("activate"), value: 1 },
                                      ],
                                      buttons: "",
                                      "button-variant": "outline-primary",
                                      required: "",
                                    },
                                    model: {
                                      value: _vm.status,
                                      callback: function ($$v) {
                                        _vm.status = $$v
                                      },
                                      expression: "status",
                                    },
                                  }),
                                ],
                                1
                              ),
                            ])
                          : _vm._e(),
                      ]),
                      _vm._v(" "),
                      _c("button", {
                        ref: "dummy_submit",
                        refInFor: true,
                        staticStyle: { display: "none" },
                      }),
                    ]
                  )
                }),
                1
              )
            : _vm._e(),
        ],
        1
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=template&id=7ed9bfb3":
/*!*********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Setting/TimeSlots/TimeSlots.vue?vue&type=template&id=7ed9bfb3 ***!
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
          _vm._v(_vm._s(_vm.__("time_slot_config"))),
        ]),
        _vm._v(" "),
        _vm.$can("time_slot_create")
          ? _c(
              "button",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value:
                      _vm.timeSlot_settingsObject.time_slots_is_enabled == 1,
                    expression:
                      "timeSlot_settingsObject.time_slots_is_enabled == 1",
                  },
                ],
                staticClass:
                  "btn btn-primary list-add-btn d-inline-flex align-items-center gap-2 text-nowrap",
                on: {
                  click: function ($event) {
                    _vm.edit_record = true
                  },
                },
              },
              [
                _c("i", {
                  staticClass: "fa fa-plus",
                  attrs: { "aria-hidden": "true" },
                }),
                _vm._v(" "),
                _c("span", [_vm._v(_vm._s(_vm.__("add")))]),
              ]
            )
          : _vm._e(),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "list-surface" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-md-4" }, [
            _c("div", { staticClass: "box-body" }, [
              _c("div", { staticClass: "form-group" }, [
                _c("label", { attrs: { for: "time_slot_setting" } }, [
                  _vm._v(_vm._s(_vm.__("time_slot_setting"))),
                ]),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.timeSlot_settingsObject.time_slot_setting,
                      expression: "timeSlot_settingsObject.time_slot_setting",
                    },
                  ],
                  staticClass: "form-check-input",
                  attrs: { type: "checkbox", id: "time_slot_setting" },
                  domProps: {
                    value: 1,
                    checked: Array.isArray(
                      _vm.timeSlot_settingsObject.time_slot_setting
                    )
                      ? _vm._i(
                          _vm.timeSlot_settingsObject.time_slot_setting,
                          1
                        ) > -1
                      : _vm.timeSlot_settingsObject.time_slot_setting,
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.timeSlot_settingsObject.time_slot_setting,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = 1,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.timeSlot_settingsObject,
                              "time_slot_setting",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.timeSlot_settingsObject,
                              "time_slot_setting",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(
                          _vm.timeSlot_settingsObject,
                          "time_slot_setting",
                          $$c
                        )
                      }
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("delivery_estimate_days")))]),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.timeSlot_settingsObject.delivery_estimate_days,
                      expression:
                        "timeSlot_settingsObject.delivery_estimate_days",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: { type: "number", min: "1", required: "" },
                  domProps: {
                    value: _vm.timeSlot_settingsObject.delivery_estimate_days,
                  },
                  on: {
                    input: [
                      function ($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.$set(
                          _vm.timeSlot_settingsObject,
                          "delivery_estimate_days",
                          $event.target.value
                        )
                      },
                      _vm.validateNoOfEstimateDays,
                    ],
                  },
                }),
                _vm._v(" "),
                _vm.validationNoOfEstimateDaysError
                  ? _c("span", { staticClass: "error" }, [
                      _vm._v(_vm._s(_vm.validationNoOfEstimateDaysError)),
                    ])
                  : _vm._e(),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c("label", { attrs: { for: "time_slots_is_enabled" } }, [
                  _vm._v(
                    _vm._s(_vm.__("enable")) +
                      " / " +
                      _vm._s(_vm.__("disable")) +
                      " " +
                      _vm._s(_vm.__("time_slots"))
                  ),
                ]),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.timeSlot_settingsObject.time_slots_is_enabled,
                      expression:
                        "timeSlot_settingsObject.time_slots_is_enabled",
                    },
                  ],
                  staticClass: "form-check-input",
                  attrs: {
                    type: "checkbox",
                    required: "",
                    id: "time_slots_is_enabled",
                    disabled: !_vm.timeSlot_settingsObject.time_slot_setting,
                  },
                  domProps: {
                    value: 0,
                    checked: Array.isArray(
                      _vm.timeSlot_settingsObject.time_slots_is_enabled
                    )
                      ? _vm._i(
                          _vm.timeSlot_settingsObject.time_slots_is_enabled,
                          0
                        ) > -1
                      : _vm.timeSlot_settingsObject.time_slots_is_enabled,
                  },
                  on: {
                    change: function ($event) {
                      var $$a =
                          _vm.timeSlot_settingsObject.time_slots_is_enabled,
                        $$el = $event.target,
                        $$c = $$el.checked ? true : false
                      if (Array.isArray($$a)) {
                        var $$v = 0,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 &&
                            _vm.$set(
                              _vm.timeSlot_settingsObject,
                              "time_slots_is_enabled",
                              $$a.concat([$$v])
                            )
                        } else {
                          $$i > -1 &&
                            _vm.$set(
                              _vm.timeSlot_settingsObject,
                              "time_slots_is_enabled",
                              $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                            )
                        }
                      } else {
                        _vm.$set(
                          _vm.timeSlot_settingsObject,
                          "time_slots_is_enabled",
                          $$c
                        )
                      }
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _vm.timeSlot_settingsObject.time_slots_is_enabled == 1
                ? _c("div", { staticClass: "form-group" }, [
                    _c("label", [
                      _vm._v(
                        _vm._s(_vm.__("how_many_days_you_want_to_allow")) + "?"
                      ),
                    ]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value:
                            _vm.timeSlot_settingsObject.time_slots_allowed_days,
                          expression:
                            "timeSlot_settingsObject.time_slots_allowed_days",
                        },
                      ],
                      staticClass: "form-control",
                      attrs: { type: "number", min: "1", required: "" },
                      domProps: {
                        value:
                          _vm.timeSlot_settingsObject.time_slots_allowed_days,
                      },
                      on: {
                        input: [
                          function ($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.timeSlot_settingsObject,
                              "time_slots_allowed_days",
                              $event.target.value
                            )
                          },
                          _vm.validateNoOfDays,
                        ],
                      },
                    }),
                    _vm._v(" "),
                    _vm.validationNoOfDaysError
                      ? _c("span", { staticClass: "error" }, [
                          _vm._v(_vm._s(_vm.validationNoOfDaysError)),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _c("br"),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("div", { staticClass: "box-footer" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary",
                    attrs: { type: "submit", disabled: _vm.isLoading },
                    on: { click: _vm.addTimeSlotsSettings },
                  },
                  [
                    _vm._v(" " + _vm._s(_vm.__("add")) + " "),
                    _vm.isLoading
                      ? _c("b-spinner", {
                          attrs: { small: "", label: "Spinning" },
                        })
                      : _vm._e(),
                  ],
                  1
                ),
              ]),
            ]),
          ]),
          _vm._v(" "),
          _vm.timeSlot_settingsObject.time_slots_is_enabled == 1
            ? _c("div", { staticClass: "col-md-8" }, [
                _c("div", { staticClass: "list-toolbar" }, [
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
                          return _vm.getTimeSlots()
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
                      attrs: {
                        items: _vm.translatedTimeSlots,
                        fields: _vm.fields,
                        "current-page": _vm.currentPage,
                        "per-page": _vm.perPage,
                        filter: _vm.filter,
                        "filter-included-fields": _vm.filterOn,
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
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "table-busy",
                            fn: function () {
                              return [
                                _c(
                                  "div",
                                  {
                                    staticClass: "text-center text-black my-2",
                                  },
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
                            key: "cell(status)",
                            fn: function (row) {
                              return [
                                row.item.status == 1
                                  ? _c(
                                      "span",
                                      { staticClass: "badge bg-success" },
                                      [_vm._v(_vm._s(_vm.__("active")))]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                row.item.status == 0
                                  ? _c(
                                      "span",
                                      { staticClass: "badge bg-danger" },
                                      [_vm._v(_vm._s(_vm.__("deactive")))]
                                    )
                                  : _vm._e(),
                              ]
                            },
                          },
                          {
                            key: "cell(is_free_delivery)",
                            fn: function (row) {
                              return [
                                row.item.is_free_delivery == 1
                                  ? _c(
                                      "span",
                                      { staticClass: "badge bg-success" },
                                      [_vm._v(_vm._s(_vm.__("yes")))]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                row.item.is_free_delivery == 0
                                  ? _c(
                                      "span",
                                      { staticClass: "badge bg-secondary" },
                                      [_vm._v(_vm._s(_vm.__("no")))]
                                    )
                                  : _vm._e(),
                              ]
                            },
                          },
                          {
                            key: "cell(from_time)",
                            fn: function (row) {
                              return [
                                _vm._v(
                                  "\n                      " +
                                    _vm._s(
                                      _vm.timeSlotTimeLabel(
                                        row.item,
                                        "from_time"
                                      )
                                    ) +
                                    "\n                    "
                                ),
                              ]
                            },
                          },
                          {
                            key: "cell(to_time)",
                            fn: function (row) {
                              return [
                                _vm._v(
                                  "\n                      " +
                                    _vm._s(
                                      _vm.timeSlotTimeLabel(row.item, "to_time")
                                    ) +
                                    "\n                    "
                                ),
                              ]
                            },
                          },
                          {
                            key: "cell(last_order_time)",
                            fn: function (row) {
                              return [
                                _vm._v(
                                  "\n                      " +
                                    _vm._s(
                                      _vm.timeSlotTimeLabel(
                                        row.item,
                                        "last_order_time"
                                      )
                                    ) +
                                    "\n                    "
                                ),
                              ]
                            },
                          },
                          {
                            key: "cell(actions)",
                            fn: function (row) {
                              return [
                                _c("div", { staticClass: "list-actions" }, [
                                  _vm.$can("time_slot_update")
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
                                            "list-action-btn is-edit",
                                          attrs: { title: _vm.__("edit") },
                                          on: {
                                            click: function ($event) {
                                              _vm.edit_record = row.item
                                            },
                                          },
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-pencil-alt",
                                          }),
                                        ]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _vm.$can("time_slot_delete")
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
                                            "list-action-btn is-delete",
                                          attrs: { title: _vm.__("delete") },
                                          on: {
                                            click: function ($event) {
                                              return _vm.deleteTimeSlots(
                                                row.index,
                                                row.item.id
                                              )
                                            },
                                          },
                                        },
                                        [
                                          _c("i", {
                                            staticClass: "fa fa-trash",
                                          }),
                                        ]
                                      )
                                    : _vm._e(),
                                ]),
                              ]
                            },
                          },
                        ],
                        null,
                        false,
                        321043089
                      ),
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
              ])
            : _vm._e(),
        ]),
      ]),
      _vm._v(" "),
      _vm.edit_record
        ? _c("app-edit-record", {
            attrs: { record: _vm.edit_record },
            on: {
              modalClose: function ($event) {
                _vm.edit_record = null
              },
            },
          })
        : _vm._e(),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);