(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Seller_EditSeller_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuejs_datatable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuejs-datatable */ "./node_modules/vuejs-datatable/dist/vuejs-datatable.esm.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var v_select2_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! v-select2-component */ "./node_modules/v-select2-component/dist/Select2.esm.js");
/* harmony import */ var vue_multiselect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vue-multiselect */ "./node_modules/vue-multiselect/dist/vue-multiselect.min.js");
/* harmony import */ var vue_multiselect__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(vue_multiselect__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var vue2_google_maps__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vue2-google-maps */ "./node_modules/vue2-google-maps/dist/main.js");
/* harmony import */ var _tinymce_tinymce_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tinymce/tinymce-vue */ "./node_modules/@tinymce/tinymce-vue/lib/es2015/main/ts/index.js");
/* harmony import */ var _Auth_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../Auth.js */ "./resources/js/Auth.js");
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");
var _watch;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_8__["default"]],
  components: {
    VuejsDatatableFactory: vuejs_datatable__WEBPACK_IMPORTED_MODULE_1__.VuejsDatatableFactory,
    Select2: v_select2_component__WEBPACK_IMPORTED_MODULE_3__["default"],
    Multiselect: (vue_multiselect__WEBPACK_IMPORTED_MODULE_4___default()),
    'editor': _tinymce_tinymce_vue__WEBPACK_IMPORTED_MODULE_6__["default"]
  },
  data: function data() {
    return {
      login_user: _Auth_js__WEBPACK_IMPORTED_MODULE_7__["default"].user,
      cacheTimer: null,
      cachedData: null,
      skipCache: false,
      isLoading: false,
      center: {
        lat: 0,
        lng: 0
      },
      map: "",
      drawingManager: "",
      currentPlace: null,
      markers: [],
      place_name: "",
      formatted_address: "",
      infoWindow: {
        position: {
          lat: 0,
          lng: 0
        },
        open: false,
        template: ''
      },
      city: "",
      cities: [],
      name: "",
      email: "",
      mobile: "",
      store_url: "",
      password: "",
      showPassword: false,
      confirm_password: "",
      showConfirmPassword: false,
      store_name: "",
      street: "",
      pincode_id: "",
      city_id: [],
      categories_ids: [],
      state: "",
      remark: "",
      bank_name: "",
      account_number: "",
      bank_ifsc_code: "",
      account_name: "",
      upi_id: "",
      upi_mobile: "",
      upi_name: "",
      zones: [],
      selected_zone: "",
      showAddCityForm: false,
      newCity: {
        name: '',
        latitude: '',
        longitude: '',
        state: '',
        zone: '',
        formatted_address: '',
        boundary_points: '',
        geolocation_type: '',
        radius: ''
      },
      cityMapCenter: {
        lat: 20.5937,
        lng: 78.9629
      },
      cityMapMarkers: [],
      cityCurrentOverlay: null,
      cityVertices: '',
      cityGeolocationType: '',
      cityRadius: '',
      cityInfoWindow: {
        position: {
          lat: 0,
          lng: 0
        },
        open: false,
        template: ''
      },
      isSavingCity: false,
      commission: "",
      tax_name: "",
      tax_number: "",
      pan_number: "",
      latitude: "",
      longitude: "",
      store_description: "",
      require_products_approval: 0,
      // customer_privacy: 0,
      view_order_otp: 0,
      assign_delivery_boy: 0,
      change_order_status_delivered: 0,
      status: 0,
      store_logo: "",
      store_logo_url: "",
      national_id_card: "",
      national_id_card_url: "",
      national_id_card_name: "",
      address_proof: "",
      address_proof_url: "",
      address_proof_name: "",
      categories: [],
      id: null,
      admin_id: null,
      record: null,
      id_card: "",
      proof: "",
      commissionRule: false,
      mobilevalidationError: null,
      commissionvalidationError: null,
      upi_idValidationError: null,
      isFormLoaded: false,
      // Flag to prevent form refilling
      isUserTyping: false,
      // Flag to track if user is actively typing

      // Self Pickup fields
      self_pickup_mode: 0,
      door_step_mode: 1,
      pickup_store_address: "",
      pickup_latitude: "",
      pickup_longitude: "",
      pickup_store_timings: "",
      // Pickup map properties
      pickupCenter: {
        lat: 0,
        lng: 0
      },
      pickupMarkers: [],
      pickupInfoWindow: {
        position: {
          lat: 0,
          lng: 0
        },
        open: false,
        template: ''
      },
      pickupCurrentPlace: null,
      // Store timings (single time range)
      storeTimings: {
        opening_time: '09:00',
        closing_time: '18:00'
      },
      // Store settings for watcher
      store_settings: {
        one_seller_cart: 0,
        self_pickup_mode: 0
      },
      // Multi-language support
      activeLanguageTab: 0,
      translations: {},
      defaultLanguageId: null,
      languages: [],
      isLoadingLanguages: false,
      // Translate buttons
      translatableFields: ['name', 'store_name', 'store_description'],
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false
    };
  },
  watch: (_watch = {
    // Auto-disable self pickup when one seller cart is turned off
    'store_settings.one_seller_cart': function store_settingsOne_seller_cart(newValue) {
      if (newValue == 0) {
        this.self_pickup_mode = 0;
        this.door_step_mode = 1;
      }
    },
    // Validation: When self pickup mode is enabled, at least one delivery mode should be enabled
    'self_pickup_mode': function self_pickup_mode(newValue) {
      this.ensureAtLeastOneDeliveryMode('self_pickup_mode');
    },
    'door_step_mode': function door_step_mode(newValue) {
      this.ensureAtLeastOneDeliveryMode('door_step_mode');
    },
    // Sync name field when language tab changes
    activeLanguageTab: function activeLanguageTab(newTab) {
      if (this.languages.length > 0 && this.languages[newTab]) {
        var currentLangId = this.languages[newTab].id;
        if (this.translations[currentLangId]) {
          // Update the name field to reflect current language
          this.name = this.translations[currentLangId].name || '';
        }
      }
    },
    name: function name() {
      // Update translation when name changes
      var currentLangId = this.getCurrentLanguageId();
      if (currentLangId && this.translations[currentLangId]) {
        this.translations[currentLangId].name = this.name;
      }
      if (!this.id) this.debouncedSave();
    },
    email: function email() {
      if (!this.id) this.debouncedSave();
    },
    mobile: function mobile() {
      if (!this.id) this.debouncedSave();
    },
    store_url: function store_url() {
      if (!this.id) this.debouncedSave();
    },
    store_name: function store_name() {
      if (!this.id) this.debouncedSave();
    },
    street: function street() {
      if (!this.id) this.debouncedSave();
    },
    city_id: {
      handler: function handler() {
        if (!this.id) this.debouncedSave();
      },
      deep: true
    },
    categories_ids: {
      handler: function handler() {
        if (!this.id) this.debouncedSave();
      },
      deep: true
    },
    state: function state() {
      if (!this.id) this.debouncedSave();
    },
    upi_id: function upi_id() {
      if (!this.id) this.debouncedSave();
    },
    upi_mobile: function upi_mobile() {
      if (!this.id) this.debouncedSave();
    },
    upi_name: function upi_name() {
      if (!this.id) this.debouncedSave();
    },
    selected_zone: function selected_zone(val) {
      if (val) {
        this.city_id = [];
        this.getCities();
      } else {
        this.getCities();
      }
    },
    commission: function commission() {
      if (!this.id) this.debouncedSave();
    },
    tax_name: function tax_name() {
      if (!this.id) this.debouncedSave();
    },
    tax_number: function tax_number() {
      if (!this.id) this.debouncedSave();
    },
    pan_number: function pan_number() {
      if (!this.id) this.debouncedSave();
    },
    latitude: function latitude() {
      if (!this.id) this.debouncedSave();
    },
    longitude: function longitude() {
      if (!this.id) this.debouncedSave();
    },
    place_name: function place_name() {
      if (!this.id) this.debouncedSave();
    },
    formatted_address: function formatted_address() {
      if (!this.id) this.debouncedSave();
    },
    store_description: function store_description() {
      if (!this.id) this.debouncedSave();
    },
    require_products_approval: function require_products_approval() {
      if (!this.id) this.debouncedSave();
    }
  }, _defineProperty(_watch, "self_pickup_mode", function self_pickup_mode() {
    if (!this.id) this.debouncedSave();
  }), _defineProperty(_watch, "door_step_mode", function door_step_mode() {
    if (!this.id) this.debouncedSave();
  }), _defineProperty(_watch, "pickup_store_address", function pickup_store_address() {
    if (!this.id) this.debouncedSave();
  }), _defineProperty(_watch, "pickup_latitude", function pickup_latitude() {
    if (!this.id) this.debouncedSave();
  }), _defineProperty(_watch, "pickup_longitude", function pickup_longitude() {
    if (!this.id) this.debouncedSave();
  }), _defineProperty(_watch, "storeTimings", {
    handler: function handler() {
      if (!this.id) this.debouncedSave();
    },
    deep: true
  }), _defineProperty(_watch, "translations", {
    handler: function handler() {
      if (!this.id) this.debouncedSave();
    },
    deep: true
  }), _watch),
  created: function created() {
    var _this = this;
    this.getCategories();
    this.getZones();
    this.getCities();
    this.getSellerCommission();
    this.getStoreSettings();
    var languagesPromise = this.fetchActiveLanguages();
    this.id = this.$route.params.id;
    if (this.isSellerRole) {
      this.id = this.login_user.seller.id;
    }
    if (this.id) {
      this.getSeller();
    } else {
      languagesPromise.then(function () {
        _this.restoreCache();
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (!this.id && !this.skipCache) this.saveCache();
    if (this.cacheTimer) clearTimeout(this.cacheTimer);
  },
  computed: {
    categories_options: function categories_options() {
      var temp = [];
      if (this.categories.length !== 0) {
        this.categories.forEach(function (category) {
          //Only Main Categories
          if (category.parent_id == 0) {
            temp.push({
              id: category.id,
              text: category.name
            });
          }
        });
      }
      return temp;
    },
    cities_options: function cities_options() {
      if (!Array.isArray(this.cities) || this.cities.length === 0) {
        return [];
      }
      return this.cities.map(function (city) {
        return {
          id: city.id,
          text: (city.name || '') + '-' + (city.zone || '')
        };
      });
    },
    google: vue2_google_maps__WEBPACK_IMPORTED_MODULE_5__.gmapApi,
    // Computed property to safely access $roleSeller
    roleSeller: function roleSeller() {
      return this.$roleSeller !== undefined ? this.$roleSeller : '';
    },
    // Computed property to check if current user is seller
    // Safely checks all required properties before comparison
    isSellerRole: function isSellerRole() {
      try {
        return this.login_user && this.login_user.role && this.login_user.role.name && this.roleSeller && this.roleSeller === this.login_user.role.name;
      } catch (e) {
        return false;
      }
    }
  },
  methods: {
    /**
     * File inputs live inside a `v-for` (language tabs).
     * In Vue 2, any `ref` used inside a loop becomes an ARRAY in `$refs`.
     * So `$refs.someRef.click()` can fail with:
     *   "click is not a function"
     * because `$refs.someRef` is actually `[HTMLInputElement]`.
     *
     * This helper safely handles both cases (array ref and single ref).
     * Uses $nextTick to ensure refs are available after DOM updates.
     */
    triggerRefClick: function triggerRefClick(refName) {
      var _this2 = this;
      // Use $nextTick to ensure refs are available after Vue updates DOM
      this.$nextTick(function () {
        try {
          var ref = _this2.$refs[refName];

          // If ref doesn't exist, exit silently
          if (!ref) {
            return;
          }

          // Handle array case (refs inside v-for)
          if (Array.isArray(ref)) {
            // Find first valid element in array
            for (var i = 0; i < ref.length; i++) {
              if (ref[i] && typeof ref[i].click === 'function') {
                ref[i].click();
                return;
              }
            }
            return;
          }

          // Handle single ref case
          if (typeof ref.click === 'function') {
            ref.click();
          }
        } catch (e) {
          // Keep silent; upload input is a best-effort UX helper.
          console.warn('Error triggering file input click:', e);
        }
      });
    },
    // Get editor configuration with safe fallbacks
    getEditorConfig: function getEditorConfig() {
      var plugins = this.$editorPlugins && Array.isArray(this.$editorPlugins) ? this.$editorPlugins : ["autolink", "lists", "link", "image", "charmap", "anchor", "searchreplace", "visualblocks", "media", "table", "wordcount", "code", "codesample"];
      var toolbar = this.$editorToolbar || "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | charmap | code | removeformat";
      var fontSizes = this.$editorFont_size_formats || '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt';
      return _objectSpread({
        height: 400,
        plugins: plugins,
        toolbar: toolbar,
        font_size_formats: fontSizes
      }, this.$tinymceImageUploadOptions());
    },
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      this.isLoadingLanguages = true;
      return axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + '/active_languages').then(function (response) {
        if (response.data.data) {
          _this3.languages = response.data.data;
          var defaultLang = _this3.languages.find(function (lang) {
            return lang.is_default === 1;
          });
          if (defaultLang) {
            _this3.defaultLanguageId = defaultLang.id;
          }
          _this3.initializeTranslations();
          _this3.isLoadingLanguages = false;
        } else {
          _this3.isLoadingLanguages = false;
        }
      })["catch"](function (error) {
        console.error('Error loading languages:', error);
        _this3.isLoadingLanguages = false;
      });
    },
    initializeTranslations: function initializeTranslations() {
      var allTranslations = {};
      this.languages.forEach(function (language) {
        allTranslations[language.id] = {
          name: '',
          store_name: '',
          store_description: ''
        };
      });
      this.translations = allTranslations;
    },
    getCurrentLanguageId: function getCurrentLanguageId() {
      if (this.languages.length > 0 && this.activeLanguageTab >= 0) {
        return this.languages[this.activeLanguageTab].id;
      }
      return this.defaultLanguageId || (this.languages.length > 0 ? this.languages[0].id : null);
    },
    getCities: function getCities() {
      var _this4 = this;
      this.isLoading = true;
      var zone = this.selected_zone || null;
      var url = zone ? this.$apiUrl + '/cities?zone=' + encodeURIComponent(zone) : this.$apiUrl + '/cities';
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(url).then(function (response) {
        _this4.isLoading = false;
        var data = response.data;
        var raw = data.data;
        var list = raw && raw.cities ? raw.cities : raw;
        _this4.cities = Array.isArray(list) ? list : list && _typeof(list) === 'object' ? Object.values(list) : [];
      })["catch"](function (error) {
        var _error$request;
        _this4.isLoading = false;
        if (error !== null && error !== void 0 && (_error$request = error.request) !== null && _error$request !== void 0 && _error$request.statusText) {
          _this4.showError(error.request.statusText);
        } else if (error.message) {
          _this4.showError(error.message);
        } else {
          _this4.showError(__('something_went_wrong'));
        }
      });
    },
    getZones: function getZones() {
      var _this5 = this;
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + '/loading_slips/zones').then(function (response) {
        var data = response.data;
        _this5.zones = data.data && Array.isArray(data.data) ? data.data : [];
      })["catch"](function () {
        _this5.zones = [];
      });
    },
    toggleAddCityForm: function toggleAddCityForm() {
      var _this6 = this;
      this.showAddCityForm = !this.showAddCityForm;
      if (this.showAddCityForm) {
        this.newCity.zone = '';
        this.$nextTick(function () {
          _this6.initCityMap();
        });
      } else {
        this.resetNewCityForm();
      }
    },
    initCityMap: function initCityMap() {
      var _this7 = this;
      // cityMapRef is inside v-for (language tabs), so Vue gives us an array
      var mapRef = this.$refs.cityMapRef;
      if (!mapRef) return;
      if (Array.isArray(mapRef)) mapRef = mapRef[0];
      if (!mapRef || !mapRef.$mapPromise) return;
      mapRef.$mapPromise.then(function (map) {
        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.CIRCLE]
          },
          polygonOptions: {
            editable: true,
            strokeColor: '#FF0000',
            fillColor: '#FF0000',
            fillOpacity: 0.35
          },
          circleOptions: {
            fillColor: '#666666',
            fillOpacity: 0.5,
            strokeWeight: 1,
            clickable: true,
            editable: true,
            draggable: true
          }
        });
        drawingManager.setMap(map);
        _this7.cityDrawingManager = drawingManager;
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
          if (_this7.cityCurrentOverlay) {
            _this7.cityCurrentOverlay.setMap(null);
          }
          _this7.cityCurrentOverlay = event.overlay;
          if (event.type === 'circle') {
            _this7.cityGeolocationType = 'circle';
            _this7.cityRadius = event.overlay.getRadius();
            _this7.cityVertices = JSON.stringify([{
              lat: event.overlay.getCenter().lat(),
              lng: event.overlay.getCenter().lng()
            }]);
          } else {
            _this7.cityGeolocationType = 'polygon';
            _this7.cityVertices = event.overlay.getPath().getArray();
          }
        });
      });
    },
    clearCityDrawing: function clearCityDrawing() {
      if (this.cityCurrentOverlay) {
        this.cityCurrentOverlay.setMap(null);
        this.cityCurrentOverlay = null;
      }
      this.cityVertices = '';
      this.cityGeolocationType = '';
      this.cityRadius = '';
    },
    setCityPlace: function setCityPlace(place) {
      if (!place || !place.geometry) return;
      var lat = place.geometry.location.lat();
      var lng = place.geometry.location.lng();
      this.cityMapCenter = {
        lat: lat,
        lng: lng
      };
      this.cityMapMarkers = [{
        position: {
          lat: lat,
          lng: lng
        }
      }];
      this.newCity.latitude = lat;
      this.newCity.longitude = lng;
      this.newCity.name = place.name || this.newCity.name;
      var parts = (place.formatted_address || '').split(',');
      this.newCity.state = parts.length > 1 ? parts[parts.length - 2].trim() : '';
      this.newCity.formatted_address = place.formatted_address || '';
      this.cityInfoWindow = {
        position: {
          lat: lat,
          lng: lng
        },
        open: true,
        template: "<b>".concat(this.newCity.name, "</b><br>").concat(this.newCity.formatted_address)
      };
    },
    saveNewCity: function saveNewCity() {
      var _this8 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var _response$data, _response$data$data, formData, key, _this8$newCity$key, response, newId, zone, zoneExists, _error$response, _error$response$data, msg;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_this8.newCity.name) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return", _this8.showError(__('city_name') + ' ' + __('is_required')));
              case 2:
                if (_this8.newCity.zone) {
                  _context.next = 4;
                  break;
                }
                return _context.abrupt("return", _this8.showError(__('zone_name') + ' ' + __('is_required')));
              case 4:
                if (!(!_this8.newCity.latitude || !_this8.newCity.longitude)) {
                  _context.next = 6;
                  break;
                }
                return _context.abrupt("return", _this8.showError(__('please_search_and_select_city_on_map')));
              case 6:
                if (_this8.cityVertices) {
                  _context.next = 8;
                  break;
                }
                return _context.abrupt("return", _this8.showError(__('draw_city_boundary_on_map_required')));
              case 8:
                _this8.isSavingCity = true;
                _context.prev = 9;
                formData = new FormData();
                for (key in _this8.newCity) {
                  formData.append(key, (_this8$newCity$key = _this8.newCity[key]) !== null && _this8$newCity$key !== void 0 ? _this8$newCity$key : '');
                }
                formData.append('language_id', _this8.defaultLanguageId || 1);
                formData.append('zone', _this8.newCity.zone);
                formData.append('time_to_travel', 0);
                formData.append('min_amount_for_free_delivery', 0);
                formData.append('delivery_charge_method', 'fixed_charge');
                formData.append('fixed_charge', 0);
                formData.append('geolocation_type', _this8.cityGeolocationType);
                formData.append('radius', _this8.cityRadius || '');
                if (_this8.cityGeolocationType === 'circle') {
                  formData.append('boundary_points', _this8.cityVertices);
                } else {
                  formData.append('boundary_points', JSON.stringify(_this8.cityVertices));
                }
                _context.next = 23;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().post(_this8.$apiUrl + '/cities/save', formData);
              case 23:
                response = _context.sent;
                newId = (_response$data = response.data) === null || _response$data === void 0 ? void 0 : (_response$data$data = _response$data.data) === null || _response$data$data === void 0 ? void 0 : _response$data$data.id;
                if (newId) {
                  // Add to cities list and auto-select
                  _this8.cities.push({
                    id: newId,
                    name: _this8.newCity.name,
                    zone: _this8.newCity.zone
                  });
                  if (!Array.isArray(_this8.city_id)) _this8.city_id = [];
                  _this8.city_id = [].concat(_toConsumableArray(_this8.city_id), [String(newId)]);

                  // If zone is new, add it to zones list and select it
                  zone = _this8.newCity.zone;
                  zoneExists = _this8.zones.find(function (z) {
                    return z.zone === zone;
                  });
                  if (!zoneExists) {
                    _this8.zones.push({
                      zone: zone,
                      city_count: 1
                    });
                  } else {
                    zoneExists.city_count = (zoneExists.city_count || 0) + 1;
                  }
                  if (_this8.selected_zone !== zone) {
                    _this8.selected_zone = zone;
                  }
                  _this8.showMessage('success', __('city_saved_successfully'));
                  _this8.resetNewCityForm();
                  _this8.showAddCityForm = false;
                  _this8.getCities();
                } else {
                  _this8.showError(__('something_went_wrong'));
                }
                _context.next = 32;
                break;
              case 28:
                _context.prev = 28;
                _context.t0 = _context["catch"](9);
                msg = ((_error$response = _context.t0.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : _error$response$data.message) || _context.t0.message || __('something_went_wrong');
                _this8.showError(msg);
              case 32:
                _context.prev = 32;
                _this8.isSavingCity = false;
                return _context.finish(32);
              case 35:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[9, 28, 32, 35]]);
      }))();
    },
    resetNewCityForm: function resetNewCityForm() {
      this.newCity = {
        name: '',
        latitude: '',
        longitude: '',
        state: '',
        zone: '',
        formatted_address: '',
        boundary_points: '',
        geolocation_type: '',
        radius: ''
      };
      this.cityMapMarkers = [];
      this.cityMapCenter = {
        lat: 20.5937,
        lng: 78.9629
      };
      this.cityInfoWindow = {
        position: {
          lat: 0,
          lng: 0
        },
        open: false,
        template: ''
      };
      this.clearCityDrawing();
    },
    getCategories: function getCategories() {
      var _this9 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + '/categories/main').then(function (response) {
        _this9.isLoading = false;
        var data = response.data;
        _this9.categories = data.data;
      })["catch"](function (error) {
        var _error$request2;
        _this9.isLoading = false;
        if (error !== null && error !== void 0 && (_error$request2 = error.request) !== null && _error$request2 !== void 0 && _error$request2.statusText) {
          _this9.showError(error.request.statusText);
        } else if (error.message) {
          _this9.showError(error.message);
        } else {
          _this9.showError(__('something_went_wrong'));
        }
      });
    },
    getSellerCommission: function getSellerCommission() {
      var _this10 = this;
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$sellerApiUrl + '/seller_commission').then(function (response) {
        var data = response.data;
        _this10.commission = data.data.value;
      });
    },
    getStoreSettings: function getStoreSettings() {
      var _this11 = this;
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + '/store_settings').then(function (response) {
        var data = response.data.data;
        _this11.store_settings = data.store_settingsObject;

        // Load store settings values
        data.store_settings.forEach(function (item) {
          if (item.variable === 'one_seller_cart') {
            _this11.store_settings.one_seller_cart = item.value === '1' ? 1 : 0;
          }
          if (item.variable === 'self_pickup_mode') {
            _this11.store_settings.self_pickup_mode = item.value === '1' ? 1 : 0;
          }
        });
      });
    },
    setPlace: function setPlace(place) {
      this.currentPlace = place;
      this.addMarker();
    },
    addMarker: function addMarker() {
      if (this.currentPlace) {
        var marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
          draggable: true
        };
        this.markers.push({
          position: marker
        });
        this.center = marker;
        this.latitude = this.currentPlace.geometry.location.lat();
        this.longitude = this.currentPlace.geometry.location.lng();
        var addressArr = this.currentPlace.formatted_address.split(",");
        this.street = addressArr[0] + " " + addressArr[1];
        this.place_name = this.currentPlace.name;
        this.formatted_address = this.currentPlace.formatted_address;
        this.infoWindow.position = {
          lat: this.latitude,
          lng: this.longitude
        };
        this.infoWindow.template = "<b>".concat(this.place_name, "</b><br>").concat(this.formatted_address);
        this.infoWindow.open = true;
        this.currentPlace = null;
      }
    },
    getCurrentLocation: function getCurrentLocation() {
      var _this12 = this;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          _this12.latitude = position.coords.latitude;
          _this12.longitude = position.coords.longitude;
          var latlng = new google.maps.LatLng(_this12.latitude, _this12.longitude);
          _this12.mapConfig(latlng);
        });
      } else {
        this.showError("Geolocation is not supported by this browser.");
      }
    },
    handleMapClick: function handleMapClick(place) {
      this.latitude = place.latLng.lat();
      this.longitude = place.latLng.lng();
      var latlng = place.latLng;
      this.mapConfig(latlng);
    },
    mapConfig: function mapConfig(latlng) {
      var vm = this;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'location': latlng
      }, function (results, status) {
        if (status === 'OK') {
          if (results[1]) {
            var clikedPlace = results[1];
            var addressArr = clikedPlace.formatted_address.split(",");
            vm.street = addressArr[0] + " " + addressArr[1];
            vm.place_name = addressArr[1];
            vm.formatted_address = clikedPlace.formatted_address;
            vm.infoWindow.position = {
              lat: vm.latitude,
              lng: vm.longitude
            };
            vm.infoWindow.template = "<b>".concat(vm.place_name, "</b><br>").concat(vm.formatted_address);
            vm.infoWindow.open = true;
            vm.currentPlace = null;
            vm.markers = [];
            var marker = {
              lat: parseFloat(vm.latitude),
              lng: parseFloat(vm.longitude),
              draggable: true
            };
            vm.markers.push({
              position: marker
            });
            vm.center = marker;
          } else {
            console.warn('No results found');
          }
        }
      });
    },
    updateCoordinates: function updateCoordinates(location) {
      this.handleMapClick(location);
    },
    setCityId: function setCityId() {
      this.state = this.city.state;
      this.city_id = this.city.id;
    },
    /**
     * Helper to safely get file input ref (handles array refs from v-for)
     */
    getFileInputRef: function getFileInputRef(refName) {
      var ref = this.$refs[refName];
      if (!ref) {
        return null;
      }
      // If ref is array (from v-for), get first valid element
      if (Array.isArray(ref)) {
        return ref.find(function (el) {
          return el && el.files;
        }) || null;
      }
      return ref;
    },
    handleFileStoreLogo: function handleFileStoreLogo() {
      var fileInput = this.getFileInputRef('file_store_logo');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        this.store_logo = fileInput.files[0];
        this.store_logo_url = URL.createObjectURL(this.store_logo);
      }
    },
    dropFileStoreLogo: function dropFileStoreLogo(event) {
      event.preventDefault();
      var fileInput = this.getFileInputRef('file_store_logo');
      if (fileInput) {
        fileInput.files = event.dataTransfer.files;
        this.handleFileStoreLogo(); // Trigger the onChange event manually
      }
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleFileNationalIdCard: function handleFileNationalIdCard() {
      var fileInput = this.getFileInputRef('file_national_id_card');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        this.national_id_card = fileInput.files[0];
        this.national_id_card_url = URL.createObjectURL(this.national_id_card);
      }
    },
    dropFileNationalIdCard: function dropFileNationalIdCard(event) {
      event.preventDefault();
      var fileInput = this.getFileInputRef('file_national_id_card');
      if (fileInput) {
        fileInput.files = event.dataTransfer.files;
        this.handleFileNationalIdCard(); // Trigger the onChange event manually
      }
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleFileAddressProof: function handleFileAddressProof() {
      var fileInput = this.getFileInputRef('file_address_proof');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        this.address_proof = fileInput.files[0];
        this.address_proof_url = URL.createObjectURL(this.address_proof);
        this.address_proof_name = this.address_proof.name;
      }
    },
    dropFileAddressProof: function dropFileAddressProof(event) {
      event.preventDefault();
      var fileInput = this.getFileInputRef('file_address_proof');
      if (fileInput) {
        fileInput.files = event.dataTransfer.files;
        this.handleFileAddressProof(); // Trigger the onChange event manually
      }
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    validateMobileNumber: function validateMobileNumber() {
      var mobileNumber = this.mobile;
      if (!/^\d{1,16}$/.test(mobileNumber)) {
        this.mobilevalidationError = "Mobile Number must be maximum 16 digits numbers.";
      } else {
        this.mobilevalidationError = null;
      }
    },
    validateCommission: function validateCommission() {
      if (this.commission < 0 || this.commission > 100) {
        this.commissionvalidationError = "Percentage must be between 0 and 100.";
        this.commission = null;
      } else {
        this.commissionvalidationError = null;
      }
    },
    clearForm: function clearForm() {
      if (this.$refs['my-form']) this.$refs['my-form'].reset();
      Object.assign(this, {
        name: "",
        email: "",
        mobile: "",
        store_url: "",
        password: "",
        confirm_password: "",
        store_name: "",
        street: "",
        pincode_id: "",
        city_id: [],
        categories_ids: [],
        state: "",
        remark: "",
        bank_name: "",
        account_number: "",
        bank_ifsc_code: "",
        account_name: "",
        upi_id: "",
        upi_mobile: "",
        upi_name: "",
        selected_zone: "",
        commission: "",
        tax_name: "",
        tax_number: "",
        pan_number: "",
        latitude: "",
        longitude: "",
        store_description: "",
        require_products_approval: 0,
        view_order_otp: 0,
        assign_delivery_boy: 0,
        change_order_status_delivered: 0,
        status: 0,
        store_logo: "",
        store_logo_url: "",
        national_id_card: "",
        national_id_card_url: "",
        national_id_card_name: "",
        address_proof: "",
        address_proof_url: "",
        address_proof_name: "",
        place_name: "",
        formatted_address: "",
        markers: [],
        self_pickup_mode: 0,
        door_step_mode: 1,
        pickup_store_address: "",
        pickup_latitude: "",
        pickup_longitude: "",
        storeTimings: {
          opening_time: '09:00',
          closing_time: '18:00'
        },
        mobilevalidationError: null,
        commissionvalidationError: null,
        upi_idValidationError: null,
        isFormLoaded: false,
        activeLanguageTab: 0
      });
      this.initializeTranslations();
      this.infoWindow.open = false;
      localStorage.removeItem('seller_form_cache');
    },
    saveCache: function saveCache() {
      if (this.id || this.skipCache) return;
      try {
        var defaultLang = this.languages.find(function (lang) {
          return lang.is_default === 1;
        });
        var defaultTranslation = defaultLang && this.translations[defaultLang.id] ? this.translations[defaultLang.id] : null;
        var data = {
          name: defaultTranslation ? defaultTranslation.name : this.name,
          email: this.email,
          mobile: this.mobile,
          store_url: this.store_url,
          store_name: defaultTranslation ? defaultTranslation.store_name : this.store_name,
          street: this.street,
          pincode_id: this.pincode_id,
          city_id: this.city_id,
          categories_ids: this.categories_ids,
          state: this.state,
          remark: this.remark,
          bank_name: this.bank_name,
          account_number: this.account_number,
          bank_ifsc_code: this.bank_ifsc_code,
          account_name: this.account_name,
          upi_id: this.upi_id,
          upi_mobile: this.upi_mobile,
          upi_name: this.upi_name,
          selected_zone: this.selected_zone,
          commission: this.commission,
          tax_name: this.tax_name,
          tax_number: this.tax_number,
          pan_number: this.pan_number,
          latitude: this.latitude,
          longitude: this.longitude,
          place_name: this.place_name,
          formatted_address: this.formatted_address,
          store_description: defaultTranslation ? defaultTranslation.store_description : this.store_description,
          require_products_approval: this.require_products_approval,
          view_order_otp: this.view_order_otp,
          assign_delivery_boy: this.assign_delivery_boy,
          change_order_status_delivered: this.change_order_status_delivered,
          status: this.status,
          self_pickup_mode: this.self_pickup_mode,
          door_step_mode: this.door_step_mode,
          pickup_store_address: this.pickup_store_address,
          pickup_latitude: this.pickup_latitude,
          pickup_longitude: this.pickup_longitude,
          storeTimings: JSON.parse(JSON.stringify(this.storeTimings)),
          translations: JSON.parse(JSON.stringify(this.translations)),
          activeLanguageTab: this.activeLanguageTab,
          timestamp: Date.now()
        };
        localStorage.setItem('seller_form_cache', JSON.stringify(data));
      } catch (e) {}
    },
    restoreCache: function restoreCache() {
      var _this13 = this;
      try {
        var cached = localStorage.getItem('seller_form_cache');
        if (!cached) return;
        var data = JSON.parse(cached);
        if (data.timestamp && Date.now() - data.timestamp > 120000) {
          localStorage.removeItem('seller_form_cache');
          return;
        }
        this.cachedData = data;
        Object.keys(data).forEach(function (key) {
          if (key === 'timestamp' || key === 'translations') return;
          if (key === 'storeTimings' && data.storeTimings) {
            _this13.storeTimings = data.storeTimings;
          } else if (_this13.hasOwnProperty(key)) {
            _this13[key] = data[key] !== undefined ? data[key] : _this13[key];
          }
        });
        // Restore translations after languages have been initialized.
        if (data.translations && this.languages && this.languages.length > 0) {
          this.languages.forEach(function (language) {
            if (data.translations[language.id]) {
              _this13.$set(_this13.translations, language.id, _objectSpread(_objectSpread({}, _this13.translations[language.id]), data.translations[language.id]));
            }
          });
          var defaultLang = this.languages.find(function (lang) {
            return lang.is_default === 1;
          });
          if (defaultLang && this.translations[defaultLang.id]) {
            this.name = this.translations[defaultLang.id].name || this.name;
            this.store_name = this.translations[defaultLang.id].store_name || this.store_name;
            this.store_description = this.translations[defaultLang.id].store_description || this.store_description;
          }
        }
        if (this.latitude && this.longitude) {
          var marker = {
            lat: parseFloat(this.latitude),
            lng: parseFloat(this.longitude),
            draggable: true
          };
          this.markers = [{
            position: marker
          }];
          this.center = marker;
          this.infoWindow.position = {
            lat: parseFloat(this.latitude),
            lng: parseFloat(this.longitude)
          };
          this.infoWindow.template = "<b>".concat(this.place_name || 'Location', "</b><br>").concat(this.formatted_address || '');
        }
        if (this.pickup_latitude && this.pickup_longitude) {
          this.pickupCenter = {
            lat: parseFloat(this.pickup_latitude),
            lng: parseFloat(this.pickup_longitude)
          };
          this.pickupMarkers = [{
            position: {
              lat: parseFloat(this.pickup_latitude),
              lng: parseFloat(this.pickup_longitude)
            }
          }];
        }
      } catch (e) {
        localStorage.removeItem('seller_form_cache');
      }
    },
    debouncedSave: function debouncedSave() {
      var _this14 = this;
      if (this.cacheTimer) clearTimeout(this.cacheTimer);
      this.cacheTimer = setTimeout(function () {
        return _this14.saveCache();
      }, 500);
    },
    onInputFocus: function onInputFocus() {
      // Set flag when user starts typing
      this.isUserTyping = true;
    },
    onInputBlur: function onInputBlur() {
      var _this15 = this;
      // Reset flag when user stops typing (with a small delay)
      setTimeout(function () {
        _this15.isUserTyping = false;
      }, 1000);
    },
    getSeller: function getSeller() {
      var _this16 = this;
      // Prevent multiple calls and form refilling
      if (this.isFormLoaded || this.isUserTyping) {
        return;
      }
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + '/sellers/edit/' + this.id).then(function (response) {
        _this16.isLoading = false;
        var data = response.data;
        if (data.status === 1) {
          var _this16$record$admin$, _this16$record$admin$2;
          // Set flag to prevent refilling
          _this16.isFormLoaded = true;
          _this16.record = data.data;

          // Helper: show empty string when value is null, undefined, or string "null"
          var emptyIfNull = function emptyIfNull(val) {
            return val != null && val !== "null" ? val : "";
          };
          _this16.admin_id = (_this16$record$admin$ = _this16.record.admin.id) !== null && _this16$record$admin$ !== void 0 ? _this16$record$admin$ : _this16.record.admin_id;
          _this16.email = (_this16$record$admin$2 = _this16.record.admin.email) !== null && _this16$record$admin$2 !== void 0 ? _this16$record$admin$2 : _this16.record.email;
          _this16.mobile = _this16.record.mobile;
          _this16.store_url = _this16.record.store_url;
          _this16.password = "";
          _this16.confirm_password = "";

          // Load translations from the seller object
          var updatedTranslations = _objectSpread({}, _this16.translations);
          if (_this16.record.translations && Array.isArray(_this16.record.translations)) {
            // Convert array of translation objects to object keyed by language_id
            _this16.record.translations.forEach(function (trans) {
              var langId = trans.language_id;
              updatedTranslations[langId] = {
                name: emptyIfNull(trans.name),
                store_name: emptyIfNull(trans.store_name),
                store_description: emptyIfNull(trans.store_description)
              };
            });
          }

          // For languages without translations, use base table data for default language
          _this16.languages.forEach(function (language) {
            if (!updatedTranslations[language.id] || !updatedTranslations[language.id].name && !updatedTranslations[language.id].store_name) {
              if (language.is_default) {
                // Default language: use base table data as fallback
                updatedTranslations[language.id] = {
                  name: emptyIfNull(_this16.record.name),
                  store_name: emptyIfNull(_this16.record.store_name),
                  store_description: emptyIfNull(_this16.record.store_description)
                };
              }
            }
          });

          // Set default language values for backward compatibility
          var defaultLang = _this16.languages.find(function (lang) {
            return lang.is_default === 1;
          });
          if (defaultLang && updatedTranslations[defaultLang.id]) {
            _this16.name = emptyIfNull(updatedTranslations[defaultLang.id].name) || emptyIfNull(_this16.record.name);
            _this16.store_name = emptyIfNull(updatedTranslations[defaultLang.id].store_name) || emptyIfNull(_this16.record.store_name);
            _this16.store_description = emptyIfNull(updatedTranslations[defaultLang.id].store_description) || emptyIfNull(_this16.record.store_description);
          } else {
            _this16.name = emptyIfNull(_this16.record.name);
            _this16.store_name = emptyIfNull(_this16.record.store_name);
            _this16.store_description = emptyIfNull(_this16.record.store_description);
          }

          // Single assignment for reactivity
          _this16.translations = updatedTranslations;
          _this16.street = emptyIfNull(_this16.record.street);
          _this16.pincode_id = "";
          _this16.city_id = emptyIfNull(_this16.record.city_id) ? _this16.record.city_id.split(",") : [];
          _this16.categories_ids = emptyIfNull(_this16.record.categories) ? _this16.record.categories.split(",") : [];
          _this16.state = emptyIfNull(_this16.record.state);
          _this16.remark = emptyIfNull(_this16.record.remark);
          _this16.bank_name = emptyIfNull(_this16.record.bank_name);
          _this16.account_number = emptyIfNull(_this16.record.account_number);
          _this16.bank_ifsc_code = emptyIfNull(_this16.record.bank_ifsc_code || _this16.record.ifsc_code);
          _this16.account_name = emptyIfNull(_this16.record.account_name);
          _this16.upi_id = emptyIfNull(_this16.record.upi_id);
          _this16.upi_mobile = emptyIfNull(_this16.record.upi_mobile);
          _this16.upi_name = emptyIfNull(_this16.record.upi_name);
          // Pre-select the zone from the first assigned city
          if (_this16.record.cities && _this16.record.cities.length > 0 && _this16.record.cities[0].zone) {
            _this16.selected_zone = _this16.record.cities[0].zone;
          }
          _this16.commission = _this16.record.commission;
          _this16.tax_name = emptyIfNull(_this16.record.tax_name);
          _this16.tax_number = emptyIfNull(_this16.record.tax_number);
          _this16.pan_number = emptyIfNull(_this16.record.pan_number);
          _this16.latitude = _this16.record.latitude;
          _this16.longitude = _this16.record.longitude;
          _this16.place_name = emptyIfNull(_this16.record.place_name);
          _this16.formatted_address = emptyIfNull(_this16.record.formatted_address);
          _this16.require_products_approval = _this16.record.require_products_approval;
          // this.customer_privacy = this.record.customer_privacy;
          _this16.view_order_otp = _this16.record.view_order_otp;
          _this16.assign_delivery_boy = _this16.record.assign_delivery_boy;
          _this16.change_order_status_delivered = _this16.record.change_order_status_delivered;

          // Self Pickup fields
          _this16.self_pickup_mode = _this16.record.self_pickup_mode === null || _this16.record.self_pickup_mode === undefined ? 0 : _this16.record.self_pickup_mode;
          _this16.door_step_mode = _this16.record.door_step_mode === null || _this16.record.door_step_mode === undefined ? 1 : _this16.record.door_step_mode;
          _this16.pickup_store_address = emptyIfNull(_this16.record.pickup_store_address);
          _this16.pickup_latitude = _this16.record.pickup_latitude || "";
          _this16.pickup_longitude = _this16.record.pickup_longitude || "";

          // Load store timings
          if (_this16.record.pickup_store_timings) {
            try {
              var parsedTimings = JSON.parse(_this16.record.pickup_store_timings);
              // Handle both old array format and new object format
              if (Array.isArray(parsedTimings)) {
                // Convert old format to new format (use first day's timings)
                var firstDay = parsedTimings.find(function (day) {
                  return day.is_open;
                });
                if (firstDay) {
                  _this16.storeTimings = {
                    opening_time: firstDay.opening_time || '09:00',
                    closing_time: firstDay.closing_time || '18:00'
                  };
                }
              } else {
                _this16.storeTimings = parsedTimings;
              }
            } catch (e) {
              console.log('Error parsing store timings:', e);
            }
          }

          // Set pickup map marker if coordinates exist
          if (_this16.pickup_latitude && _this16.pickup_longitude) {
            _this16.pickupCenter = {
              lat: parseFloat(_this16.pickup_latitude),
              lng: parseFloat(_this16.pickup_longitude)
            };
            _this16.pickupMarkers = [{
              position: {
                lat: parseFloat(_this16.pickup_latitude),
                lng: parseFloat(_this16.pickup_longitude)
              }
            }];
            _this16.pickupInfoWindow.position = {
              lat: parseFloat(_this16.pickup_latitude),
              lng: parseFloat(_this16.pickup_longitude)
            };
            _this16.pickupInfoWindow.template = "<b>Pickup Location</b><br>".concat(_this16.pickup_store_address);
          }
          _this16.status = _this16.record.status;
          _this16.store_logo = _this16.record.store_logo;
          _this16.store_logo_url = _this16.$storageUrl + _this16.record.logo;
          _this16.national_id_card_url = _this16.$storageUrl + _this16.record.national_identity_card;
          _this16.address_proof_url = _this16.$storageUrl + _this16.record.address_proof;
          var marker = {
            lat: parseFloat(_this16.latitude),
            lng: parseFloat(_this16.longitude),
            draggable: true
          };
          _this16.markers.push({
            position: marker
          });
          _this16.center = marker;
          _this16.infoWindow.position = {
            lat: parseFloat(_this16.latitude),
            lng: parseFloat(_this16.longitude)
          };
          _this16.infoWindow.template = "<b>".concat(_this16.place_name, "</b><br>").concat(_this16.formatted_address);
          _this16.infoWindow.open = true;
        } else {
          _this16.showError(data.message);
          setTimeout(function () {
            _this16.$router.back();
          }, 1000);
        }
      })["catch"](function (error) {
        var _error$request3;
        _this16.isLoading = false;
        if (error !== null && error !== void 0 && (_error$request3 = error.request) !== null && _error$request3 !== void 0 && _error$request3.statusText) {
          _this16.showError(error.request.statusText);
        } else if (error.message) {
          _this16.showError(error.message);
        } else {
          _this16.showError(__('something_went_wrong'));
        }
      });
    },
    validateDefaultLanguageForTranslation: function validateDefaultLanguageForTranslation() {
      var _this17 = this;
      var form = this.$refs['my-form'];

      // Trigger native browser validation UI
      if (form && !form.reportValidity()) {
        // Switch to default language tab so error field is visible
        this.$nextTick(function () {
          _this17.switchToDefaultLanguageTab();
        });
        return false;
      }

      // Also validate required fields specifically
      return this.validateDefaultLanguage();
    },
    saveRecord: function saveRecord() {
      var _this18 = this;
      // Validate default language fields
      if (!this.validateDefaultLanguage()) {
        return;
      }
      this.isLoading = true;
      var vm = this;

      // Collect all languages with translations to save
      var defaultLang = this.languages.find(function (lang) {
        return lang.is_default;
      });
      var allTranslations = [];

      // Add default language translation (required)
      if (defaultLang) {
        var defaultTranslation = this.translations[defaultLang.id];
        allTranslations.push({
          language_id: defaultLang.id,
          name: defaultTranslation.name || '',
          store_name: defaultTranslation.store_name || '',
          store_description: defaultTranslation.store_description || ''
        });
      }

      // Add other languages that have data
      this.languages.forEach(function (language) {
        if (language.is_default) return; // Skip default, already added

        var translation = _this18.translations[language.id];
        var hasData = translation.name && translation.name.trim() !== '' || translation.store_name && translation.store_name.trim() !== '' || translation.store_description && translation.store_description.trim() !== '';
        if (hasData) {
          allTranslations.push({
            language_id: language.id,
            name: translation.name || '',
            store_name: translation.store_name || '',
            store_description: translation.store_description || ''
          });
        }
      });

      // Single save call with all translations
      var saveAll = /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
          var sellerId, defaultTranslation, formData, url, _response$data2, response, apiStatus, _response$data3, apiMessage;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  sellerId = _this18.id; // For edit mode
                  defaultTranslation = _this18.translations[defaultLang.id];
                  formData = new FormData(); // Determine URL
                  url = _this18.$apiUrl + '/sellers/save';
                  if (sellerId) {
                    url = _this18.$apiUrl + '/sellers/update';
                    formData.append('id', sellerId);
                    formData.append('admin_id', _this18.admin_id);
                  }

                  // Send default language_id for backward compatibility
                  formData.append('language_id', defaultLang.id);

                  // Default language translatable fields (for main table)
                  formData.append('name', defaultTranslation.name || '');
                  formData.append('store_name', defaultTranslation.store_name || '');
                  formData.append('store_description', defaultTranslation.store_description || '');

                  // All required fields
                  formData.append('email', _this18.email);
                  formData.append('mobile', _this18.mobile);
                  formData.append('store_url', _this18.store_url);

                  // Password only for new sellers or when changing
                  if (!sellerId) {
                    formData.append('password', _this18.password);
                    formData.append('confirm_password', _this18.confirm_password);
                  } else if (_this18.password) {
                    formData.append('password', _this18.password);
                    formData.append('confirm_password', _this18.confirm_password);
                  }

                  // Non-translatable fields
                  formData.append('street', _this18.street);
                  formData.append('pincode_id', _this18.pincode_id);
                  formData.append('city_id', _this18.city_id);
                  formData.append('categories_ids', _this18.categories_ids);
                  formData.append('state', _this18.state);
                  formData.append('remark', _this18.remark);
                  formData.append('bank_name', _this18.bank_name || '');
                  formData.append('account_number', _this18.account_number || '');
                  formData.append('bank_ifsc_code', _this18.bank_ifsc_code || '');
                  formData.append('ifsc_code', _this18.bank_ifsc_code || '');
                  formData.append('account_name', _this18.account_name || '');
                  formData.append('upi_id', _this18.upi_id || '');
                  formData.append('upi_mobile', _this18.upi_mobile || '');
                  formData.append('upi_name', _this18.upi_name || '');
                  formData.append('commission', _this18.commission);
                  formData.append('tax_name', _this18.tax_name);
                  formData.append('tax_number', _this18.tax_number);
                  formData.append('pan_number', _this18.pan_number);
                  formData.append('latitude', _this18.latitude);
                  formData.append('longitude', _this18.longitude);
                  formData.append('place_name', _this18.place_name);
                  formData.append('formatted_address', _this18.formatted_address);
                  formData.append('require_products_approval', _this18.require_products_approval);
                  formData.append('view_order_otp', _this18.view_order_otp);
                  formData.append('assign_delivery_boy', _this18.assign_delivery_boy);
                  formData.append('change_order_status_delivered', _this18.change_order_status_delivered);
                  formData.append('self_pickup_mode', _this18.self_pickup_mode);
                  formData.append('door_step_mode', _this18.door_step_mode);
                  formData.append('pickup_store_address', _this18.pickup_store_address);
                  formData.append('pickup_latitude', _this18.pickup_latitude);
                  formData.append('pickup_longitude', _this18.pickup_longitude);
                  formData.append('pickup_store_timings', JSON.stringify(_this18.storeTimings));
                  formData.append('status', _this18.status);

                  // Send all translations as JSON array
                  formData.append('translations', JSON.stringify(allTranslations));

                  // Files (only for new sellers or when updating)
                  if (_this18.store_logo) {
                    formData.append('store_logo', _this18.store_logo);
                  }
                  if (_this18.national_id_card) {
                    formData.append('national_id_card', _this18.national_id_card);
                  }
                  if (_this18.address_proof) {
                    formData.append('address_proof', _this18.address_proof);
                  }
                  _context2.prev = 50;
                  _context2.next = 53;
                  return axios__WEBPACK_IMPORTED_MODULE_2___default().post(url, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  });
                case 53:
                  response = _context2.sent;
                  apiStatus = response === null || response === void 0 ? void 0 : (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : _response$data2.status;
                  if (!(apiStatus !== 1)) {
                    _context2.next = 58;
                    break;
                  }
                  apiMessage = (response === null || response === void 0 ? void 0 : (_response$data3 = response.data) === null || _response$data3 === void 0 ? void 0 : _response$data3.message) || __('something_went_wrong');
                  throw new Error(apiMessage);
                case 58:
                  return _context2.abrupt("return", response);
                case 61:
                  _context2.prev = 61;
                  _context2.t0 = _context2["catch"](50);
                  throw _context2.t0;
                case 64:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2, null, [[50, 61]]);
        }));
        return function saveAll() {
          return _ref.apply(this, arguments);
        };
      }();

      // Execute single save with all translations
      saveAll().then(function () {
        vm.skipCache = true;
        localStorage.removeItem('seller_form_cache');
        vm.isLoading = false;

        // Show success message first
        var successMessage = __('seller_saved_successfully') || 'Seller saved successfully!';
        vm.showMessage("success", successMessage);

        // Then redirect after a short delay to ensure toast is visible
        setTimeout(function () {
          if (vm.isSellerRole) {
            vm.$router.push({
              path: '/seller/profile'
            });
          } else {
            vm.$router.push({
              path: '/sellers'
            });
          }
        }, 1500);
      })["catch"](function (error) {
        var _error$response2, _error$response3, _error$response3$data, _error$response4, _error$response4$data;
        vm.isLoading = false;
        // Laravel validation errors often return 422 with `errors` object
        if ((error === null || error === void 0 ? void 0 : (_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.status) === 422 && error !== null && error !== void 0 && (_error$response3 = error.response) !== null && _error$response3 !== void 0 && (_error$response3$data = _error$response3.data) !== null && _error$response3$data !== void 0 && _error$response3$data.errors) {
          var errors = error.response.data.errors;
          var firstKey = Object.keys(errors)[0];
          var firstMsg = firstKey && Array.isArray(errors[firstKey]) ? errors[firstKey][0] : null;
          vm.showError(firstMsg || error.response.data.message || __('something_went_wrong'));
        } else if (error !== null && error !== void 0 && (_error$response4 = error.response) !== null && _error$response4 !== void 0 && (_error$response4$data = _error$response4.data) !== null && _error$response4$data !== void 0 && _error$response4$data.message) {
          vm.showError(error.response.data.message);
        } else if (error.request && error.request.statusText) {
          vm.showError(error.request.statusText);
        } else if (error !== null && error !== void 0 && error.message) {
          vm.showError(error.message);
        } else {
          vm.showError(__('something_went_wrong'));
        }
      });
    },
    validateDefaultLanguage: function validateDefaultLanguage() {
      if (!this.defaultLanguageId) {
        this.showError(__('default_language_not_found'));
        return false;
      }
      var defaultTranslation = this.translations[this.defaultLanguageId];

      // Check required fields for default language
      if (!defaultTranslation.name || defaultTranslation.name.trim() === '') {
        this.showError(__('please_fill_name_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      if (!defaultTranslation.store_name || defaultTranslation.store_name.trim() === '') {
        this.showError(__('please_fill_store_name_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      return true;
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this19 = this;
      var defaultLangIndex = this.languages.findIndex(function (lang) {
        return lang.id === _this19.defaultLanguageId;
      });
      if (defaultLangIndex !== -1) {
        this.activeLanguageTab = defaultLangIndex;
      }
    },
    // Self Pickup methods (similar to EditCity.vue)
    setPickupPlace: function setPickupPlace(place) {
      this.pickupCurrentPlace = place;
      this.addPickupMarker();
    },
    addPickupMarker: function addPickupMarker() {
      if (this.pickupCurrentPlace) {
        var marker = {
          lat: this.pickupCurrentPlace.geometry.location.lat(),
          lng: this.pickupCurrentPlace.geometry.location.lng()
        };
        this.pickupMarkers = [{
          position: marker
        }];
        this.pickupCenter = marker;
        this.pickup_latitude = this.pickupCurrentPlace.geometry.location.lat();
        this.pickup_longitude = this.pickupCurrentPlace.geometry.location.lng();

        // Auto-fill the pickup store address with the full formatted address
        this.pickup_store_address = this.pickupCurrentPlace.formatted_address;
        this.pickupInfoWindow.position = {
          lat: this.pickup_latitude,
          lng: this.pickup_longitude
        };
        this.pickupInfoWindow.template = "<b>".concat(this.pickupCurrentPlace.name, "</b><br>").concat(this.pickup_store_address);
        this.pickupInfoWindow.open = true;
        this.pickupCurrentPlace = null;
      }
    },
    onPickupMarkerDragEnd: function onPickupMarkerDragEnd(event) {
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      this.pickup_latitude = lat.toString();
      this.pickup_longitude = lng.toString();

      // Update marker position
      this.pickupMarkers = [{
        position: {
          lat: lat,
          lng: lng
        }
      }];

      // Update info window
      this.pickupInfoWindow.position = {
        lat: lat,
        lng: lng
      };
      this.pickupInfoWindow.template = "<b>Selected Location</b><br>Lat: ".concat(lat.toFixed(6), ", Lng: ").concat(lng.toFixed(6));
      this.pickupInfoWindow.open = true;
    }
  },
  mounted: function mounted() {}
});

/***/ }),

/***/ "./resources/js/mixins/TranslationHelper.js":
/*!**************************************************!*\
  !*** ./resources/js/mixins/TranslationHelper.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_multiselect_dist_vue_multiselect_min_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! -!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-multiselect/dist/vue-multiselect.min.css");
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.i(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_multiselect_dist_vue_multiselect_min_css__WEBPACK_IMPORTED_MODULE_1__["default"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n/* Compact thumb for logo/identity/address previews - keeps layout aligned when multiple are shown */\n.file-preview-thumb[data-v-0c56d16c] {\n    max-height: 80px;\n    max-width: 80px;\n    width: auto;\n    height: auto;\n    -o-object-fit: contain;\n       object-fit: contain;\n    border: 1px solid #ddd;\n    border-radius: 8px;\n    padding: 4px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-multiselect/dist/vue-multiselect.min.css":
/*!*********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-multiselect/dist/vue-multiselect.min.css ***!
  \*********************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "fieldset[disabled] .multiselect{pointer-events:none}.multiselect__spinner{position:absolute;right:1px;top:1px;width:48px;height:35px;background:#fff;display:block}.multiselect__spinner:after,.multiselect__spinner:before{position:absolute;content:\"\";top:50%;left:50%;margin:-8px 0 0 -8px;width:16px;height:16px;border-radius:100%;border:2px solid transparent;border-top-color:#41b883;box-shadow:0 0 0 1px transparent}.multiselect__spinner:before{animation:spinning 2.4s cubic-bezier(.41,.26,.2,.62);animation-iteration-count:infinite}.multiselect__spinner:after{animation:spinning 2.4s cubic-bezier(.51,.09,.21,.8);animation-iteration-count:infinite}.multiselect__loading-enter-active,.multiselect__loading-leave-active{transition:opacity .4s ease-in-out;opacity:1}.multiselect__loading-enter,.multiselect__loading-leave-active{opacity:0}.multiselect,.multiselect__input,.multiselect__single{font-family:inherit;font-size:16px;-ms-touch-action:manipulation;touch-action:manipulation}.multiselect{box-sizing:content-box;display:block;position:relative;width:100%;min-height:40px;text-align:left;color:#35495e}.multiselect *{box-sizing:border-box}.multiselect:focus{outline:none}.multiselect--disabled{background:#ededed;pointer-events:none;opacity:.6}.multiselect--active{z-index:50}.multiselect--active:not(.multiselect--above) .multiselect__current,.multiselect--active:not(.multiselect--above) .multiselect__input,.multiselect--active:not(.multiselect--above) .multiselect__tags{border-bottom-left-radius:0;border-bottom-right-radius:0}.multiselect--active .multiselect__select{transform:rotate(180deg)}.multiselect--above.multiselect--active .multiselect__current,.multiselect--above.multiselect--active .multiselect__input,.multiselect--above.multiselect--active .multiselect__tags{border-top-left-radius:0;border-top-right-radius:0}.multiselect__input,.multiselect__single{position:relative;display:inline-block;min-height:20px;line-height:20px;border:none;border-radius:5px;background:#fff;padding:0 0 0 5px;width:100%;transition:border .1s ease;box-sizing:border-box;margin-bottom:8px;vertical-align:top}.multiselect__input:-ms-input-placeholder{color:#35495e}.multiselect__input::placeholder{color:#35495e}.multiselect__tag~.multiselect__input,.multiselect__tag~.multiselect__single{width:auto}.multiselect__input:hover,.multiselect__single:hover{border-color:#cfcfcf}.multiselect__input:focus,.multiselect__single:focus{border-color:#a8a8a8;outline:none}.multiselect__single{padding-left:5px;margin-bottom:8px}.multiselect__tags-wrap{display:inline}.multiselect__tags{min-height:40px;display:block;padding:8px 40px 0 8px;border-radius:5px;border:1px solid #e8e8e8;background:#fff;font-size:14px}.multiselect__tag{position:relative;display:inline-block;padding:4px 26px 4px 10px;border-radius:5px;margin-right:10px;color:#fff;line-height:1;background:#41b883;margin-bottom:5px;white-space:nowrap;overflow:hidden;max-width:100%;text-overflow:ellipsis}.multiselect__tag-icon{cursor:pointer;margin-left:7px;position:absolute;right:0;top:0;bottom:0;font-weight:700;font-style:normal;width:22px;text-align:center;line-height:22px;transition:all .2s ease;border-radius:5px}.multiselect__tag-icon:after{content:\"\\D7\";color:#266d4d;font-size:14px}.multiselect__tag-icon:focus,.multiselect__tag-icon:hover{background:#369a6e}.multiselect__tag-icon:focus:after,.multiselect__tag-icon:hover:after{color:#fff}.multiselect__current{min-height:40px;overflow:hidden;padding:8px 30px 0 12px;white-space:nowrap;border-radius:5px;border:1px solid #e8e8e8}.multiselect__current,.multiselect__select{line-height:16px;box-sizing:border-box;display:block;margin:0;text-decoration:none;cursor:pointer}.multiselect__select{position:absolute;width:40px;height:38px;right:1px;top:1px;padding:4px 8px;text-align:center;transition:transform .2s ease}.multiselect__select:before{position:relative;right:0;top:65%;color:#999;margin-top:4px;border-color:#999 transparent transparent;border-style:solid;border-width:5px 5px 0;content:\"\"}.multiselect__placeholder{color:#adadad;display:inline-block;margin-bottom:10px;padding-top:2px}.multiselect--active .multiselect__placeholder{display:none}.multiselect__content-wrapper{position:absolute;display:block;background:#fff;width:100%;max-height:240px;overflow:auto;border:1px solid #e8e8e8;border-top:none;border-bottom-left-radius:5px;border-bottom-right-radius:5px;z-index:50;-webkit-overflow-scrolling:touch}.multiselect__content{list-style:none;display:inline-block;padding:0;margin:0;min-width:100%;vertical-align:top}.multiselect--above .multiselect__content-wrapper{bottom:100%;border-bottom-left-radius:0;border-bottom-right-radius:0;border-top-left-radius:5px;border-top-right-radius:5px;border-bottom:none;border-top:1px solid #e8e8e8}.multiselect__content::webkit-scrollbar{display:none}.multiselect__element{display:block}.multiselect__option{display:block;padding:12px;min-height:40px;line-height:16px;text-decoration:none;text-transform:none;vertical-align:middle;position:relative;cursor:pointer;white-space:nowrap}.multiselect__option:after{top:0;right:0;position:absolute;line-height:40px;padding-right:12px;padding-left:20px;font-size:13px}.multiselect__option--highlight{background:#41b883;outline:none;color:#fff}.multiselect__option--highlight:after{content:attr(data-select);background:#41b883;color:#fff}.multiselect__option--selected{background:#f3f3f3;color:#35495e;font-weight:700}.multiselect__option--selected:after{content:attr(data-selected);color:silver}.multiselect__option--selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect--disabled .multiselect__current,.multiselect--disabled .multiselect__select{background:#ededed;color:#a6a6a6}.multiselect__option--disabled{background:#ededed!important;color:#a6a6a6!important;cursor:text;pointer-events:none}.multiselect__option--group{background:#ededed;color:#35495e}.multiselect__option--group.multiselect__option--highlight{background:#35495e;color:#fff}.multiselect__option--group.multiselect__option--highlight:after{background:#35495e}.multiselect__option--disabled.multiselect__option--highlight{background:#dedede}.multiselect__option--group-selected.multiselect__option--highlight{background:#ff6a6a;color:#fff}.multiselect__option--group-selected.multiselect__option--highlight:after{background:#ff6a6a;content:attr(data-deselect);color:#fff}.multiselect-enter-active,.multiselect-leave-active{transition:all .15s ease}.multiselect-enter,.multiselect-leave-active{opacity:0}.multiselect__strong{margin-bottom:8px;line-height:20px;display:inline-block;vertical-align:top}[dir=rtl] .multiselect{text-align:right}[dir=rtl] .multiselect__select{right:auto;left:1px}[dir=rtl] .multiselect__tags{padding:8px 8px 0 40px}[dir=rtl] .multiselect__content{text-align:right}[dir=rtl] .multiselect__option:after{right:auto;left:0}[dir=rtl] .multiselect__clear{right:auto;left:12px}[dir=rtl] .multiselect__spinner{right:auto;left:1px}@keyframes spinning{0%{transform:rotate(0)}to{transform:rotate(2turn)}}", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_style_index_0_id_0c56d16c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_style_index_0_id_0c56d16c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_style_index_0_id_0c56d16c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Seller/EditSeller.vue":
/*!**************************************************!*\
  !*** ./resources/js/views/Seller/EditSeller.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EditSeller_vue_vue_type_template_id_0c56d16c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EditSeller.vue?vue&type=template&id=0c56d16c&scoped=true */ "./resources/js/views/Seller/EditSeller.vue?vue&type=template&id=0c56d16c&scoped=true");
/* harmony import */ var _EditSeller_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EditSeller.vue?vue&type=script&lang=js */ "./resources/js/views/Seller/EditSeller.vue?vue&type=script&lang=js");
/* harmony import */ var _EditSeller_vue_vue_type_style_index_0_id_0c56d16c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css */ "./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _EditSeller_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _EditSeller_vue_vue_type_template_id_0c56d16c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _EditSeller_vue_vue_type_template_id_0c56d16c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "0c56d16c",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Seller/EditSeller.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Seller/EditSeller.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/views/Seller/EditSeller.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditSeller.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_style_index_0_id_0c56d16c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=style&index=0&id=0c56d16c&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Seller/EditSeller.vue?vue&type=template&id=0c56d16c&scoped=true":
/*!********************************************************************************************!*\
  !*** ./resources/js/views/Seller/EditSeller.vue?vue&type=template&id=0c56d16c&scoped=true ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_template_id_0c56d16c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_template_id_0c56d16c_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditSeller_vue_vue_type_template_id_0c56d16c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditSeller.vue?vue&type=template&id=0c56d16c&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=template&id=0c56d16c&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=template&id=0c56d16c&scoped=true":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Seller/EditSeller.vue?vue&type=template&id=0c56d16c&scoped=true ***!
  \***********************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
    [
      _c("div", { staticClass: "page-heading" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _vm.isSellerRole
              ? _c("h3", [
                  _vm._v(
                    "\n                    " +
                      _vm._s(_vm.__("my_profile")) +
                      "\n                "
                  ),
                ])
              : _c(
                  "h3",
                  [
                    _vm.id
                      ? [_vm._v(_vm._s(_vm.__("edit")))]
                      : [_vm._v(_vm._s(_vm.__("add")))],
                    _vm._v(
                      "\n                    " +
                        _vm._s(_vm.__("seller")) +
                        "\n                "
                    ),
                  ],
                  2
                ),
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
                _c(
                  "ol",
                  { staticClass: "breadcrumb" },
                  [
                    _c(
                      "li",
                      { staticClass: "breadcrumb-item" },
                      [
                        _vm.isSellerRole
                          ? _c("router-link", { attrs: { to: "/seller" } }, [
                              _vm._v(_vm._s(_vm.__("dashboard"))),
                            ])
                          : _c("router-link", { attrs: { to: "/dashboard" } }, [
                              _vm._v(_vm._s(_vm.__("dashboard"))),
                            ]),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _vm.isSellerRole
                      ? [
                          _c(
                            "li",
                            {
                              staticClass: "breadcrumb-item",
                              attrs: { "aria-current": "page" },
                            },
                            [_vm._v(_vm._s(_vm.__("my_profile")))]
                          ),
                        ]
                      : [
                          _c(
                            "li",
                            {
                              staticClass: "breadcrumb-item",
                              attrs: { "aria-current": "page" },
                            },
                            [
                              _c("router-link", { attrs: { to: "/sellers" } }, [
                                _vm._v(_vm._s(_vm.__("manage_sellers"))),
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
                              _vm.id
                                ? [_vm._v(_vm._s(_vm.__("edit")))]
                                : [_vm._v(_vm._s(_vm.__("add")))],
                              _vm._v(
                                "\n                                " +
                                  _vm._s(_vm.__("seller")) +
                                  "\n                            "
                              ),
                            ],
                            2
                          ),
                        ],
                  ],
                  2
                ),
              ]
            ),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-12 order-md-1 order-last" }, [
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
                _c("div", { staticClass: "card" }, [
                  _c("div", { staticClass: "card-header" }, [
                    _c("h4", [
                      _vm._v(_vm._s(_vm.__("seller_information")) + " "),
                    ]),
                    _vm._v(" "),
                    !_vm.isSellerRole
                      ? _c(
                          "span",
                          { staticClass: "pull-right" },
                          [
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
                                staticClass: "btn btn-primary",
                                attrs: {
                                  to: "/sellers",
                                  title: "Manage Seller",
                                },
                              },
                              [_vm._v(_vm._s(_vm.__("manage_seller")))]
                            ),
                          ],
                          1
                        )
                      : _vm._e(),
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "card-body" }, [
                    _vm.languages.length > 0
                      ? _c(
                          "div",
                          { staticClass: "col-md-12 mb-3" },
                          [
                            _c(
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
                                                    "\n                                                " +
                                                      _vm._s(language.name) +
                                                      "\n                                            "
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
                                    language.is_default &&
                                    _vm.languages.length > 1
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
                                                    rawName:
                                                      "v-b-tooltip.hover",
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
                                                    return _vm.translateEmpty(
                                                      language
                                                    )
                                                  },
                                                },
                                              },
                                              [
                                                !_vm.loadingEmpty
                                                  ? _c("span", [
                                                      _vm._v(
                                                        _vm._s(
                                                          _vm.__(
                                                            "translate_empty_fields"
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
                                            _c(
                                              "b-button",
                                              {
                                                directives: [
                                                  {
                                                    name: "b-tooltip",
                                                    rawName:
                                                      "v-b-tooltip.hover",
                                                    modifiers: { hover: true },
                                                  },
                                                ],
                                                attrs: {
                                                  size: "sm",
                                                  variant: "outline-danger",
                                                  title: _vm.__(
                                                    "all_fields_will_be_translated_and_existing_content_will_be_overwritten"
                                                  ),
                                                  disabled:
                                                    _vm.loadingOverwrite,
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
                                                      "\n                                                " +
                                                        _vm._s(
                                                          _vm.translateSuccessMessage
                                                        ) +
                                                        "\n                                            "
                                                    ),
                                                  ]
                                                )
                                              : _vm._e(),
                                          ],
                                          1
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "row" },
                                      [
                                        _c(
                                          "div",
                                          {
                                            staticClass: "form-group col-md-4",
                                          },
                                          [
                                            _c(
                                              "div",
                                              { staticClass: "form-group" },
                                              [
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.__("seller_name")
                                                    ) + " "
                                                  ),
                                                  language.is_default
                                                    ? _c(
                                                        "i",
                                                        {
                                                          staticClass:
                                                            "text-danger",
                                                        },
                                                        [_vm._v("*")]
                                                      )
                                                    : _vm._e(),
                                                ]),
                                                _vm._v(" "),
                                                _c("input", {
                                                  directives: [
                                                    {
                                                      name: "model",
                                                      rawName: "v-model",
                                                      value:
                                                        _vm.translations[
                                                          language.id
                                                        ].name,
                                                      expression:
                                                        "translations[language.id].name",
                                                    },
                                                  ],
                                                  staticClass: "form-control",
                                                  attrs: {
                                                    type: "text",
                                                    required:
                                                      language.is_default
                                                        ? true
                                                        : undefined,
                                                    placeholder:
                                                      _vm.__(
                                                        "enter_seller_name"
                                                      ),
                                                  },
                                                  domProps: {
                                                    value:
                                                      _vm.translations[
                                                        language.id
                                                      ].name,
                                                  },
                                                  on: {
                                                    focus: _vm.onInputFocus,
                                                    blur: _vm.onInputBlur,
                                                    input: function ($event) {
                                                      if (
                                                        $event.target.composing
                                                      ) {
                                                        return
                                                      }
                                                      _vm.$set(
                                                        _vm.translations[
                                                          language.id
                                                        ],
                                                        "name",
                                                        $event.target.value
                                                      )
                                                    },
                                                  },
                                                }),
                                              ]
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        language.is_default
                                          ? [
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "form-group col-md-4",
                                                },
                                                [
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass: "form-group",
                                                    },
                                                    [
                                                      _c("label", [
                                                        _vm._v(
                                                          _vm._s(
                                                            _vm.__("email")
                                                          ) + " "
                                                        ),
                                                        _c(
                                                          "i",
                                                          {
                                                            staticClass:
                                                              "text-danger",
                                                          },
                                                          [_vm._v("*")]
                                                        ),
                                                      ]),
                                                      _vm._v(" "),
                                                      _c("input", {
                                                        directives: [
                                                          {
                                                            name: "model",
                                                            rawName: "v-model",
                                                            value: _vm.email,
                                                            expression: "email",
                                                          },
                                                        ],
                                                        staticClass:
                                                          "form-control",
                                                        attrs: {
                                                          type: "email",
                                                          placeholder:
                                                            _vm.__(
                                                              "enter_email"
                                                            ),
                                                        },
                                                        domProps: {
                                                          value: _vm.email,
                                                        },
                                                        on: {
                                                          focus:
                                                            _vm.onInputFocus,
                                                          blur: _vm.onInputBlur,
                                                          input: function (
                                                            $event
                                                          ) {
                                                            if (
                                                              $event.target
                                                                .composing
                                                            ) {
                                                              return
                                                            }
                                                            _vm.email =
                                                              $event.target.value
                                                          },
                                                        },
                                                      }),
                                                    ]
                                                  ),
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "form-group col-md-4",
                                                },
                                                [
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass: "form-group",
                                                    },
                                                    [
                                                      _c("label", [
                                                        _vm._v(
                                                          _vm._s(
                                                            _vm.__("mobile")
                                                          )
                                                        ),
                                                        _c(
                                                          "i",
                                                          {
                                                            staticClass:
                                                              "text-danger",
                                                          },
                                                          [_vm._v("*")]
                                                        ),
                                                      ]),
                                                      _vm._v(" "),
                                                      _c("input", {
                                                        directives: [
                                                          {
                                                            name: "model",
                                                            rawName: "v-model",
                                                            value: _vm.mobile,
                                                            expression:
                                                              "mobile",
                                                          },
                                                        ],
                                                        staticClass:
                                                          "form-control",
                                                        attrs: {
                                                          type: "text",
                                                          placeholder: _vm.__(
                                                            "enter_mobile_number"
                                                          ),
                                                          inputmode: "numeric",
                                                          required: "",
                                                        },
                                                        domProps: {
                                                          value: _vm.mobile,
                                                        },
                                                        on: {
                                                          input: [
                                                            function ($event) {
                                                              if (
                                                                $event.target
                                                                  .composing
                                                              ) {
                                                                return
                                                              }
                                                              _vm.mobile =
                                                                $event.target.value
                                                            },
                                                            _vm.validateMobileNumber,
                                                          ],
                                                          focus:
                                                            _vm.onInputFocus,
                                                          blur: _vm.onInputBlur,
                                                        },
                                                      }),
                                                      _vm._v(" "),
                                                      _vm.mobilevalidationError
                                                        ? _c(
                                                            "span",
                                                            {
                                                              staticClass:
                                                                "error",
                                                            },
                                                            [
                                                              _vm._v(
                                                                _vm._s(
                                                                  _vm.mobilevalidationError
                                                                )
                                                              ),
                                                            ]
                                                          )
                                                        : _vm._e(),
                                                    ]
                                                  ),
                                                ]
                                              ),
                                              _vm._v(" "),
                                              !_vm.isSellerRole
                                                ? _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-group col-md-4",
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group",
                                                        },
                                                        [
                                                          _c("label", [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.__(
                                                                  "password"
                                                                )
                                                              ) + " "
                                                            ),
                                                            !_vm.id
                                                              ? _c(
                                                                  "i",
                                                                  {
                                                                    staticClass:
                                                                      "text-danger",
                                                                  },
                                                                  [_vm._v("*")]
                                                                )
                                                              : _vm._e(),
                                                          ]),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "input-group",
                                                            },
                                                            [
                                                              (_vm.showPassword
                                                                ? "text"
                                                                : "password") ===
                                                              "checkbox"
                                                                ? _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.password,
                                                                          expression:
                                                                            "password",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "enter_password"
                                                                        ),
                                                                      type: "checkbox",
                                                                    },
                                                                    domProps: {
                                                                      checked:
                                                                        Array.isArray(
                                                                          _vm.password
                                                                        )
                                                                          ? _vm._i(
                                                                              _vm.password,
                                                                              null
                                                                            ) >
                                                                            -1
                                                                          : _vm.password,
                                                                    },
                                                                    on: {
                                                                      change:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          var $$a =
                                                                              _vm.password,
                                                                            $$el =
                                                                              $event.target,
                                                                            $$c =
                                                                              $$el.checked
                                                                                ? true
                                                                                : false
                                                                          if (
                                                                            Array.isArray(
                                                                              $$a
                                                                            )
                                                                          ) {
                                                                            var $$v =
                                                                                null,
                                                                              $$i =
                                                                                _vm._i(
                                                                                  $$a,
                                                                                  $$v
                                                                                )
                                                                            if (
                                                                              $$el.checked
                                                                            ) {
                                                                              $$i <
                                                                                0 &&
                                                                                (_vm.password =
                                                                                  $$a.concat(
                                                                                    [
                                                                                      $$v,
                                                                                    ]
                                                                                  ))
                                                                            } else {
                                                                              $$i >
                                                                                -1 &&
                                                                                (_vm.password =
                                                                                  $$a
                                                                                    .slice(
                                                                                      0,
                                                                                      $$i
                                                                                    )
                                                                                    .concat(
                                                                                      $$a.slice(
                                                                                        $$i +
                                                                                          1
                                                                                      )
                                                                                    ))
                                                                            }
                                                                          } else {
                                                                            _vm.password =
                                                                              $$c
                                                                          }
                                                                        },
                                                                    },
                                                                  })
                                                                : (_vm.showPassword
                                                                    ? "text"
                                                                    : "password") ===
                                                                  "radio"
                                                                ? _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.password,
                                                                          expression:
                                                                            "password",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "enter_password"
                                                                        ),
                                                                      type: "radio",
                                                                    },
                                                                    domProps: {
                                                                      checked:
                                                                        _vm._q(
                                                                          _vm.password,
                                                                          null
                                                                        ),
                                                                    },
                                                                    on: {
                                                                      change:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          _vm.password =
                                                                            null
                                                                        },
                                                                    },
                                                                  })
                                                                : _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.password,
                                                                          expression:
                                                                            "password",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "enter_password"
                                                                        ),
                                                                      type: _vm.showPassword
                                                                        ? "text"
                                                                        : "password",
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.password,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.password =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                              _vm._v(" "),
                                                              _c(
                                                                "button",
                                                                {
                                                                  staticClass:
                                                                    "btn btn-primary font-bold",
                                                                  attrs: {
                                                                    type: "button",
                                                                  },
                                                                  on: {
                                                                    click:
                                                                      function (
                                                                        $event
                                                                      ) {
                                                                        _vm.showPassword =
                                                                          !_vm.showPassword
                                                                      },
                                                                  },
                                                                },
                                                                [
                                                                  _vm.showPassword
                                                                    ? _c("i", {
                                                                        staticClass:
                                                                          "fa fa-eye-slash",
                                                                        attrs: {
                                                                          "aria-hidden":
                                                                            "true",
                                                                        },
                                                                      })
                                                                    : _c("i", {
                                                                        staticClass:
                                                                          "fa fa-eye",
                                                                        attrs: {
                                                                          "aria-hidden":
                                                                            "true",
                                                                        },
                                                                      }),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  )
                                                : _vm._e(),
                                              _vm._v(" "),
                                              !_vm.isSellerRole
                                                ? _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-group col-md-4",
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group",
                                                        },
                                                        [
                                                          _c("label", [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.__(
                                                                  "confirm_password"
                                                                )
                                                              )
                                                            ),
                                                            !_vm.id
                                                              ? _c(
                                                                  "i",
                                                                  {
                                                                    staticClass:
                                                                      "text-danger",
                                                                  },
                                                                  [_vm._v("*")]
                                                                )
                                                              : _vm._e(),
                                                          ]),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "input-group",
                                                            },
                                                            [
                                                              (_vm.showConfirmPassword
                                                                ? "text"
                                                                : "password") ===
                                                              "checkbox"
                                                                ? _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.confirm_password,
                                                                          expression:
                                                                            "confirm_password",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "enter_confirm_password"
                                                                        ),
                                                                      type: "checkbox",
                                                                    },
                                                                    domProps: {
                                                                      checked:
                                                                        Array.isArray(
                                                                          _vm.confirm_password
                                                                        )
                                                                          ? _vm._i(
                                                                              _vm.confirm_password,
                                                                              null
                                                                            ) >
                                                                            -1
                                                                          : _vm.confirm_password,
                                                                    },
                                                                    on: {
                                                                      change:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          var $$a =
                                                                              _vm.confirm_password,
                                                                            $$el =
                                                                              $event.target,
                                                                            $$c =
                                                                              $$el.checked
                                                                                ? true
                                                                                : false
                                                                          if (
                                                                            Array.isArray(
                                                                              $$a
                                                                            )
                                                                          ) {
                                                                            var $$v =
                                                                                null,
                                                                              $$i =
                                                                                _vm._i(
                                                                                  $$a,
                                                                                  $$v
                                                                                )
                                                                            if (
                                                                              $$el.checked
                                                                            ) {
                                                                              $$i <
                                                                                0 &&
                                                                                (_vm.confirm_password =
                                                                                  $$a.concat(
                                                                                    [
                                                                                      $$v,
                                                                                    ]
                                                                                  ))
                                                                            } else {
                                                                              $$i >
                                                                                -1 &&
                                                                                (_vm.confirm_password =
                                                                                  $$a
                                                                                    .slice(
                                                                                      0,
                                                                                      $$i
                                                                                    )
                                                                                    .concat(
                                                                                      $$a.slice(
                                                                                        $$i +
                                                                                          1
                                                                                      )
                                                                                    ))
                                                                            }
                                                                          } else {
                                                                            _vm.confirm_password =
                                                                              $$c
                                                                          }
                                                                        },
                                                                    },
                                                                  })
                                                                : (_vm.showConfirmPassword
                                                                    ? "text"
                                                                    : "password") ===
                                                                  "radio"
                                                                ? _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.confirm_password,
                                                                          expression:
                                                                            "confirm_password",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "enter_confirm_password"
                                                                        ),
                                                                      type: "radio",
                                                                    },
                                                                    domProps: {
                                                                      checked:
                                                                        _vm._q(
                                                                          _vm.confirm_password,
                                                                          null
                                                                        ),
                                                                    },
                                                                    on: {
                                                                      change:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          _vm.confirm_password =
                                                                            null
                                                                        },
                                                                    },
                                                                  })
                                                                : _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.confirm_password,
                                                                          expression:
                                                                            "confirm_password",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "enter_confirm_password"
                                                                        ),
                                                                      type: _vm.showConfirmPassword
                                                                        ? "text"
                                                                        : "password",
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.confirm_password,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.confirm_password =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                              _vm._v(" "),
                                                              _c(
                                                                "button",
                                                                {
                                                                  staticClass:
                                                                    "btn btn-primary font-bold",
                                                                  attrs: {
                                                                    type: "button",
                                                                  },
                                                                  on: {
                                                                    click:
                                                                      function (
                                                                        $event
                                                                      ) {
                                                                        _vm.showConfirmPassword =
                                                                          !_vm.showConfirmPassword
                                                                      },
                                                                  },
                                                                },
                                                                [
                                                                  _vm.showConfirmPassword
                                                                    ? _c("i", {
                                                                        staticClass:
                                                                          "fa fa-eye-slash",
                                                                        attrs: {
                                                                          "aria-hidden":
                                                                            "true",
                                                                        },
                                                                      })
                                                                    : _c("i", {
                                                                        staticClass:
                                                                          "fa fa-eye",
                                                                        attrs: {
                                                                          "aria-hidden":
                                                                            "true",
                                                                        },
                                                                      }),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  )
                                                : _vm._e(),
                                            ]
                                          : _vm._e(),
                                      ],
                                      2
                                    ),
                                    _vm._v(" "),
                                    _c("div", { staticClass: "card" }, [
                                      _c(
                                        "div",
                                        { staticClass: "card-header" },
                                        [
                                          _c("h4", [
                                            _vm._v(
                                              " " +
                                                _vm._s(
                                                  _vm.__("store_information")
                                                )
                                            ),
                                          ]),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("div", { staticClass: "card-body" }, [
                                        _c(
                                          "div",
                                          { staticClass: "row" },
                                          [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "form-group col-md-4",
                                              },
                                              [
                                                _c(
                                                  "div",
                                                  { staticClass: "form-group" },
                                                  [
                                                    _c("label", [
                                                      _vm._v(
                                                        _vm._s(
                                                          _vm.__("store_name")
                                                        ) + " "
                                                      ),
                                                      language.is_default
                                                        ? _c(
                                                            "i",
                                                            {
                                                              staticClass:
                                                                "text-danger",
                                                            },
                                                            [_vm._v("*")]
                                                          )
                                                        : _vm._e(),
                                                    ]),
                                                    _vm._v(" "),
                                                    _c("input", {
                                                      directives: [
                                                        {
                                                          name: "model",
                                                          rawName: "v-model",
                                                          value:
                                                            _vm.translations[
                                                              language.id
                                                            ].store_name,
                                                          expression:
                                                            "translations[language.id].store_name",
                                                        },
                                                      ],
                                                      staticClass:
                                                        "form-control",
                                                      attrs: {
                                                        type: "text",
                                                        required:
                                                          language.is_default
                                                            ? true
                                                            : undefined,
                                                        placeholder:
                                                          _vm.__(
                                                            "enter_store_name"
                                                          ),
                                                      },
                                                      domProps: {
                                                        value:
                                                          _vm.translations[
                                                            language.id
                                                          ].store_name,
                                                      },
                                                      on: {
                                                        input: function (
                                                          $event
                                                        ) {
                                                          if (
                                                            $event.target
                                                              .composing
                                                          ) {
                                                            return
                                                          }
                                                          _vm.$set(
                                                            _vm.translations[
                                                              language.id
                                                            ],
                                                            "store_name",
                                                            $event.target.value
                                                          )
                                                        },
                                                      },
                                                    }),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            language.is_default
                                              ? [
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-group col-md-5",
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group",
                                                        },
                                                        [
                                                          _c("label", [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.__(
                                                                  "category_ids"
                                                                )
                                                              )
                                                            ),
                                                            _c(
                                                              "i",
                                                              {
                                                                staticClass:
                                                                  "text-danger",
                                                              },
                                                              [_vm._v("*")]
                                                            ),
                                                            _vm._v(" "),
                                                            _c("small"),
                                                          ]),
                                                          _vm._v(" "),
                                                          _c("Select2", {
                                                            attrs: {
                                                              placeholder:
                                                                _vm.__(
                                                                  "select_categories"
                                                                ),
                                                              options:
                                                                _vm.categories_options,
                                                              settings: {
                                                                multiple:
                                                                  "multiple",
                                                              },
                                                            },
                                                            model: {
                                                              value:
                                                                _vm.categories_ids,
                                                              callback:
                                                                function ($$v) {
                                                                  _vm.categories_ids =
                                                                    $$v
                                                                },
                                                              expression:
                                                                "categories_ids",
                                                            },
                                                          }),
                                                        ],
                                                        1
                                                      ),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-group col-md-3",
                                                    },
                                                    [
                                                      _c(
                                                        "label",
                                                        {
                                                          staticClass:
                                                            "control-label",
                                                        },
                                                        [
                                                          _vm._v(
                                                            _vm._s(
                                                              _vm.__(
                                                                "product_status"
                                                              )
                                                            )
                                                          ),
                                                        ]
                                                      ),
                                                      _c("br"),
                                                      _vm._v(" "),
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "btn-group",
                                                          attrs: {
                                                            id: "status",
                                                          },
                                                        },
                                                        [
                                                          _c(
                                                            "label",
                                                            {
                                                              staticClass:
                                                                "btn btn-primary",
                                                              attrs: {
                                                                "data-toggle-class":
                                                                  "btn-primary",
                                                                "data-toggle-passive-class":
                                                                  "btn-default",
                                                              },
                                                            },
                                                            [
                                                              _c("input", {
                                                                directives: [
                                                                  {
                                                                    name: "model",
                                                                    rawName:
                                                                      "v-model",
                                                                    value:
                                                                      _vm.status,
                                                                    expression:
                                                                      "status",
                                                                  },
                                                                ],
                                                                attrs: {
                                                                  type: "radio",
                                                                  value: "1",
                                                                },
                                                                domProps: {
                                                                  checked:
                                                                    _vm._q(
                                                                      _vm.status,
                                                                      "1"
                                                                    ),
                                                                },
                                                                on: {
                                                                  change:
                                                                    function (
                                                                      $event
                                                                    ) {
                                                                      _vm.status =
                                                                        "1"
                                                                    },
                                                                },
                                                              }),
                                                              _vm._v(
                                                                "\n                                                                    " +
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "active"
                                                                    )
                                                                  ) +
                                                                  "\n                                                                "
                                                              ),
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "label",
                                                            {
                                                              staticClass:
                                                                "btn btn-danger",
                                                              attrs: {
                                                                "data-toggle-class":
                                                                  "btn-danger",
                                                                "data-toggle-passive-class":
                                                                  "btn-default",
                                                              },
                                                            },
                                                            [
                                                              _c("input", {
                                                                directives: [
                                                                  {
                                                                    name: "model",
                                                                    rawName:
                                                                      "v-model",
                                                                    value:
                                                                      _vm.status,
                                                                    expression:
                                                                      "status",
                                                                  },
                                                                ],
                                                                attrs: {
                                                                  type: "radio",
                                                                  value: "3",
                                                                },
                                                                domProps: {
                                                                  checked:
                                                                    _vm._q(
                                                                      _vm.status,
                                                                      "3"
                                                                    ),
                                                                },
                                                                on: {
                                                                  change:
                                                                    function (
                                                                      $event
                                                                    ) {
                                                                      _vm.status =
                                                                        "3"
                                                                    },
                                                                },
                                                              }),
                                                              _vm._v(
                                                                "\n                                                                    " +
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "deactive"
                                                                    )
                                                                  ) +
                                                                  "\n                                                                "
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-group col-md-4",
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group",
                                                        },
                                                        [
                                                          _c("label", [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.__(
                                                                  "tax_name"
                                                                )
                                                              )
                                                            ),
                                                          ]),
                                                          _vm._v(" "),
                                                          _c("input", {
                                                            directives: [
                                                              {
                                                                name: "model",
                                                                rawName:
                                                                  "v-model",
                                                                value:
                                                                  _vm.tax_name,
                                                                expression:
                                                                  "tax_name",
                                                              },
                                                            ],
                                                            staticClass:
                                                              "form-control",
                                                            attrs: {
                                                              type: "text",
                                                              placeholder:
                                                                _vm.__(
                                                                  "enter_tax_name"
                                                                ),
                                                            },
                                                            domProps: {
                                                              value:
                                                                _vm.tax_name,
                                                            },
                                                            on: {
                                                              input: function (
                                                                $event
                                                              ) {
                                                                if (
                                                                  $event.target
                                                                    .composing
                                                                ) {
                                                                  return
                                                                }
                                                                _vm.tax_name =
                                                                  $event.target.value
                                                              },
                                                            },
                                                          }),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-group col-md-4",
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group",
                                                        },
                                                        [
                                                          _c("label", [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.__(
                                                                  "tax_number"
                                                                )
                                                              )
                                                            ),
                                                          ]),
                                                          _vm._v(" "),
                                                          _c("input", {
                                                            directives: [
                                                              {
                                                                name: "model",
                                                                rawName:
                                                                  "v-model",
                                                                value:
                                                                  _vm.tax_number,
                                                                expression:
                                                                  "tax_number",
                                                              },
                                                            ],
                                                            staticClass:
                                                              "form-control",
                                                            attrs: {
                                                              type: "text",
                                                              placeholder:
                                                                _vm.__(
                                                                  "enter_tax_number"
                                                                ),
                                                            },
                                                            domProps: {
                                                              value:
                                                                _vm.tax_number,
                                                            },
                                                            on: {
                                                              input: function (
                                                                $event
                                                              ) {
                                                                if (
                                                                  $event.target
                                                                    .composing
                                                                ) {
                                                                  return
                                                                }
                                                                _vm.tax_number =
                                                                  $event.target.value
                                                              },
                                                            },
                                                          }),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "form-group col-md-4",
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group",
                                                        },
                                                        [
                                                          _c("label", [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.__(
                                                                  "pan_number"
                                                                )
                                                              )
                                                            ),
                                                          ]),
                                                          _vm._v(" "),
                                                          _c("input", {
                                                            directives: [
                                                              {
                                                                name: "model",
                                                                rawName:
                                                                  "v-model",
                                                                value:
                                                                  _vm.pan_number,
                                                                expression:
                                                                  "pan_number",
                                                              },
                                                            ],
                                                            staticClass:
                                                              "form-control",
                                                            attrs: {
                                                              type: "text",
                                                              placeholder:
                                                                _vm.__(
                                                                  "enter_pan_number"
                                                                ),
                                                            },
                                                            domProps: {
                                                              value:
                                                                _vm.pan_number,
                                                            },
                                                            on: {
                                                              input: function (
                                                                $event
                                                              ) {
                                                                if (
                                                                  $event.target
                                                                    .composing
                                                                ) {
                                                                  return
                                                                }
                                                                _vm.pan_number =
                                                                  $event.target.value
                                                              },
                                                            },
                                                          }),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "row align-items-start",
                                                    },
                                                    [
                                                      !_vm.isSellerRole
                                                        ? _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group col-md-4 mt-0",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group",
                                                                },
                                                                [
                                                                  _c(
                                                                    "label",
                                                                    {
                                                                      attrs: {
                                                                        for: "logo",
                                                                      },
                                                                    },
                                                                    [
                                                                      _vm._v(
                                                                        " " +
                                                                          _vm._s(
                                                                            _vm.__(
                                                                              "logo"
                                                                            )
                                                                          ) +
                                                                          " "
                                                                      ),
                                                                      !_vm.id
                                                                        ? _c(
                                                                            "i",
                                                                            {
                                                                              staticClass:
                                                                                "text-danger",
                                                                            },
                                                                            [
                                                                              _vm._v(
                                                                                "*"
                                                                              ),
                                                                            ]
                                                                          )
                                                                        : _vm._e(),
                                                                    ]
                                                                  ),
                                                                  _vm._v(" "),
                                                                  _c("input", {
                                                                    ref: "file_store_logo",
                                                                    refInFor: true,
                                                                    staticClass:
                                                                      "file-input",
                                                                    attrs: {
                                                                      type: "file",
                                                                      accept:
                                                                        "image/*",
                                                                      id: "logo",
                                                                    },
                                                                    on: {
                                                                      change:
                                                                        _vm.handleFileStoreLogo,
                                                                    },
                                                                  }),
                                                                  _vm._v(" "),
                                                                  _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "file-input-div bg-gray-100",
                                                                      on: {
                                                                        click:
                                                                          function (
                                                                            $event
                                                                          ) {
                                                                            return _vm.triggerRefClick(
                                                                              "file_store_logo"
                                                                            )
                                                                          },
                                                                        drop: _vm.dropFileStoreLogo,
                                                                        dragover:
                                                                          _vm.$dragoverFile,
                                                                        dragleave:
                                                                          _vm.$dragleaveFile,
                                                                      },
                                                                    },
                                                                    [
                                                                      _vm.store_logo &&
                                                                      _vm
                                                                        .store_logo
                                                                        .name !==
                                                                        ""
                                                                        ? [
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _vm._v(
                                                                                  _vm._s(
                                                                                    _vm.__(
                                                                                      "selected_file_name"
                                                                                    )
                                                                                  ) +
                                                                                    _vm._s(
                                                                                      _vm
                                                                                        .store_logo
                                                                                        .name
                                                                                    )
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ]
                                                                        : [
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _c(
                                                                                  "i",
                                                                                  {
                                                                                    staticClass:
                                                                                      "fa fa-cloud-upload-alt fa-2x",
                                                                                  }
                                                                                ),
                                                                              ]
                                                                            ),
                                                                            _vm._v(
                                                                              " "
                                                                            ),
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _vm._v(
                                                                                  _vm._s(
                                                                                    _vm.__(
                                                                                      "drop_files_here_or_click_to_upload"
                                                                                    )
                                                                                  )
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ],
                                                                    ],
                                                                    2
                                                                  ),
                                                                  _vm._v(" "),
                                                                  _vm.store_logo_url
                                                                    ? _c(
                                                                        "div",
                                                                        {
                                                                          staticClass:
                                                                            "row mt-2",
                                                                        },
                                                                        [
                                                                          _c(
                                                                            "div",
                                                                            {
                                                                              staticClass:
                                                                                "col-auto",
                                                                            },
                                                                            [
                                                                              _c(
                                                                                "img",
                                                                                {
                                                                                  staticClass:
                                                                                    "file-preview-thumb",
                                                                                  attrs:
                                                                                    {
                                                                                      src: _vm.store_logo_url,
                                                                                      title:
                                                                                        "Store Logo",
                                                                                      alt: "Store Logo",
                                                                                    },
                                                                                }
                                                                              ),
                                                                            ]
                                                                          ),
                                                                        ]
                                                                      )
                                                                    : _vm._e(),
                                                                ]
                                                              ),
                                                            ]
                                                          )
                                                        : _vm._e(),
                                                      _vm._v(" "),
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group col-md-4",
                                                        },
                                                        [
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group",
                                                            },
                                                            [
                                                              _c("label", [
                                                                _vm._v(
                                                                  " " +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "national_identity_card"
                                                                      )
                                                                    )
                                                                ),
                                                                !_vm.id
                                                                  ? _c(
                                                                      "i",
                                                                      {
                                                                        staticClass:
                                                                          "text-danger",
                                                                      },
                                                                      [
                                                                        _vm._v(
                                                                          "*"
                                                                        ),
                                                                      ]
                                                                    )
                                                                  : _vm._e(),
                                                              ]),
                                                              _vm._v(" "),
                                                              !_vm.isSellerRole
                                                                ? _c("input", {
                                                                    ref: "file_national_id_card",
                                                                    refInFor: true,
                                                                    staticClass:
                                                                      "file-input",
                                                                    attrs: {
                                                                      type: "file",
                                                                      accept:
                                                                        "image/*,application/pdf,.doc,.docx",
                                                                    },
                                                                    on: {
                                                                      change:
                                                                        _vm.handleFileNationalIdCard,
                                                                    },
                                                                  })
                                                                : _vm._e(),
                                                              _vm._v(" "),
                                                              !_vm.isSellerRole
                                                                ? _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "file-input-div bg-gray-100",
                                                                      on: {
                                                                        click:
                                                                          function (
                                                                            $event
                                                                          ) {
                                                                            return _vm.triggerRefClick(
                                                                              "file_national_id_card"
                                                                            )
                                                                          },
                                                                        drop: _vm.dropFileNationalIdCard,
                                                                        dragover:
                                                                          _vm.$dragoverFile,
                                                                        dragleave:
                                                                          _vm.$dragleaveFile,
                                                                      },
                                                                    },
                                                                    [
                                                                      _vm.national_id_card &&
                                                                      _vm
                                                                        .national_id_card
                                                                        .name !==
                                                                        ""
                                                                        ? [
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _vm._v(
                                                                                  _vm._s(
                                                                                    _vm.__(
                                                                                      "selected_file_name"
                                                                                    )
                                                                                  ) +
                                                                                    " " +
                                                                                    _vm._s(
                                                                                      _vm
                                                                                        .national_id_card
                                                                                        .name
                                                                                    )
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ]
                                                                        : [
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _c(
                                                                                  "i",
                                                                                  {
                                                                                    staticClass:
                                                                                      "fa fa-cloud-upload-alt fa-2x",
                                                                                  }
                                                                                ),
                                                                              ]
                                                                            ),
                                                                            _vm._v(
                                                                              " "
                                                                            ),
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _vm._v(
                                                                                  _vm._s(
                                                                                    _vm.__(
                                                                                      "drop_files_here_or_click_to_upload"
                                                                                    )
                                                                                  )
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ],
                                                                    ],
                                                                    2
                                                                  )
                                                                : _vm._e(),
                                                              _vm._v(" "),
                                                              _vm.national_id_card_url
                                                                ? _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "row mt-2",
                                                                    },
                                                                    [
                                                                      _vm.isImage(
                                                                        _vm.national_id_card_url
                                                                      )
                                                                        ? _c(
                                                                            "div",
                                                                            {
                                                                              staticClass:
                                                                                "col-auto",
                                                                            },
                                                                            [
                                                                              _c(
                                                                                "img",
                                                                                {
                                                                                  staticClass:
                                                                                    "file-preview-thumb",
                                                                                  attrs:
                                                                                    {
                                                                                      src: _vm.national_id_card_url,
                                                                                      title:
                                                                                        "Identity Card",
                                                                                      alt: "Identity Card",
                                                                                    },
                                                                                }
                                                                              ),
                                                                            ]
                                                                          )
                                                                        : _c(
                                                                            "div",
                                                                            {
                                                                              staticClass:
                                                                                "col-auto mt-2",
                                                                            },
                                                                            [
                                                                              _c(
                                                                                "a",
                                                                                {
                                                                                  staticClass:
                                                                                    "badge bg-success",
                                                                                  attrs:
                                                                                    {
                                                                                      target:
                                                                                        "_blank",
                                                                                      href: _vm.national_id_card_url,
                                                                                    },
                                                                                },
                                                                                [
                                                                                  _c(
                                                                                    "i",
                                                                                    {
                                                                                      staticClass:
                                                                                        "fa fa-eye",
                                                                                    }
                                                                                  ),
                                                                                  _vm._v(
                                                                                    " Identity\n                                                                            Card"
                                                                                  ),
                                                                                ]
                                                                              ),
                                                                            ]
                                                                          ),
                                                                    ]
                                                                  )
                                                                : _vm._e(),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                      _vm._v(" "),
                                                      _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group col-md-4",
                                                        },
                                                        [
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group",
                                                            },
                                                            [
                                                              _c("label", [
                                                                _vm._v(
                                                                  " " +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "address_proof"
                                                                      )
                                                                    )
                                                                ),
                                                                !_vm.id
                                                                  ? _c(
                                                                      "i",
                                                                      {
                                                                        staticClass:
                                                                          "text-danger",
                                                                      },
                                                                      [
                                                                        _vm._v(
                                                                          "*"
                                                                        ),
                                                                      ]
                                                                    )
                                                                  : _vm._e(),
                                                              ]),
                                                              _vm._v(" "),
                                                              !_vm.isSellerRole
                                                                ? _c("input", {
                                                                    ref: "file_address_proof",
                                                                    refInFor: true,
                                                                    staticClass:
                                                                      "file-input",
                                                                    attrs: {
                                                                      type: "file",
                                                                      accept:
                                                                        "image/*,application/pdf,.doc,.docx",
                                                                    },
                                                                    on: {
                                                                      change:
                                                                        _vm.handleFileAddressProof,
                                                                    },
                                                                  })
                                                                : _vm._e(),
                                                              _vm._v(" "),
                                                              !_vm.isSellerRole
                                                                ? _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "file-input-div bg-gray-100",
                                                                      on: {
                                                                        click:
                                                                          function (
                                                                            $event
                                                                          ) {
                                                                            return _vm.triggerRefClick(
                                                                              "file_address_proof"
                                                                            )
                                                                          },
                                                                        drop: _vm.dropFileAddressProof,
                                                                        dragover:
                                                                          _vm.$dragoverFile,
                                                                        dragleave:
                                                                          _vm.$dragleaveFile,
                                                                      },
                                                                    },
                                                                    [
                                                                      _vm.address_proof_name ==
                                                                      ""
                                                                        ? [
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _c(
                                                                                  "i",
                                                                                  {
                                                                                    staticClass:
                                                                                      "fa fa-cloud-upload-alt fa-2x",
                                                                                  }
                                                                                ),
                                                                              ]
                                                                            ),
                                                                            _vm._v(
                                                                              " "
                                                                            ),
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _vm._v(
                                                                                  _vm._s(
                                                                                    _vm.__(
                                                                                      "drop_files_here_or_click_to_upload"
                                                                                    )
                                                                                  )
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ]
                                                                        : [
                                                                            _c(
                                                                              "label",
                                                                              [
                                                                                _vm._v(
                                                                                  _vm._s(
                                                                                    _vm.__(
                                                                                      "selected_file_name"
                                                                                    )
                                                                                  ) +
                                                                                    " " +
                                                                                    _vm._s(
                                                                                      _vm.address_proof_name
                                                                                    )
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ],
                                                                    ],
                                                                    2
                                                                  )
                                                                : _vm._e(),
                                                              _vm._v(" "),
                                                              _vm.address_proof_url
                                                                ? _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "row mt-2",
                                                                    },
                                                                    [
                                                                      _vm.isImage(
                                                                        _vm.address_proof_url
                                                                      )
                                                                        ? _c(
                                                                            "div",
                                                                            {
                                                                              staticClass:
                                                                                "col-auto",
                                                                            },
                                                                            [
                                                                              _c(
                                                                                "img",
                                                                                {
                                                                                  staticClass:
                                                                                    "file-preview-thumb",
                                                                                  attrs:
                                                                                    {
                                                                                      src: _vm.address_proof_url,
                                                                                      title:
                                                                                        "Address Proof",
                                                                                      alt: "Address Proof",
                                                                                    },
                                                                                }
                                                                              ),
                                                                            ]
                                                                          )
                                                                        : _c(
                                                                            "div",
                                                                            {
                                                                              staticClass:
                                                                                "col-auto mt-2",
                                                                            },
                                                                            [
                                                                              _c(
                                                                                "a",
                                                                                {
                                                                                  staticClass:
                                                                                    "badge bg-success",
                                                                                  attrs:
                                                                                    {
                                                                                      target:
                                                                                        "_blank",
                                                                                      href: _vm.address_proof_url,
                                                                                    },
                                                                                },
                                                                                [
                                                                                  _c(
                                                                                    "i",
                                                                                    {
                                                                                      staticClass:
                                                                                        "fa fa-eye",
                                                                                    }
                                                                                  ),
                                                                                  _vm._v(
                                                                                    " Address\n                                                                            Proof"
                                                                                  ),
                                                                                ]
                                                                              ),
                                                                            ]
                                                                          ),
                                                                    ]
                                                                  )
                                                                : _vm._e(),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  !_vm.isSellerRole
                                                    ? _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "form-group col-md-4",
                                                        },
                                                        [
                                                          _c("label", [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.__(
                                                                  "commission"
                                                                )
                                                              )
                                                            ),
                                                            _c(
                                                              "i",
                                                              {
                                                                staticClass:
                                                                  "text-danger",
                                                              },
                                                              [_vm._v("*")]
                                                            ),
                                                          ]),
                                                          _vm._v(" "),
                                                          _c("input", {
                                                            directives: [
                                                              {
                                                                name: "model",
                                                                rawName:
                                                                  "v-model",
                                                                value:
                                                                  _vm.commission,
                                                                expression:
                                                                  "commission",
                                                              },
                                                            ],
                                                            staticClass:
                                                              "form-control",
                                                            attrs: {
                                                              type: "number",
                                                              placeholder:
                                                                _vm.__(
                                                                  "enter_commission"
                                                                ) + " (%)",
                                                            },
                                                            domProps: {
                                                              value:
                                                                _vm.commission,
                                                            },
                                                            on: {
                                                              input: [
                                                                function (
                                                                  $event
                                                                ) {
                                                                  if (
                                                                    $event
                                                                      .target
                                                                      .composing
                                                                  ) {
                                                                    return
                                                                  }
                                                                  _vm.commission =
                                                                    $event.target.value
                                                                },
                                                                _vm.validateCommission,
                                                              ],
                                                            },
                                                          }),
                                                          _vm._v(" "),
                                                          _vm.commissionvalidationError
                                                            ? _c(
                                                                "p",
                                                                {
                                                                  staticClass:
                                                                    "error",
                                                                },
                                                                [
                                                                  _vm._v(
                                                                    _vm._s(
                                                                      _vm.commissionvalidationError
                                                                    )
                                                                  ),
                                                                ]
                                                              )
                                                            : _vm._e(),
                                                          _vm._v(" "),
                                                          _c(
                                                            "span",
                                                            {
                                                              staticClass:
                                                                "text text-success font-size-13",
                                                            },
                                                            [
                                                              _c(
                                                                "a",
                                                                {
                                                                  attrs: {
                                                                    href: "javascript:void(0)",
                                                                    title:
                                                                      "How it works",
                                                                  },
                                                                  on: {
                                                                    click:
                                                                      function (
                                                                        $event
                                                                      ) {
                                                                        _vm.commissionRule = true
                                                                      },
                                                                  },
                                                                },
                                                                [
                                                                  _vm._v(
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "how_seller_commission_works"
                                                                      )
                                                                    )
                                                                  ),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      )
                                                    : _vm._e(),
                                                  _vm._v(" "),
                                                  _vm.id && !_vm.isSellerRole
                                                    ? _c(
                                                        "div",
                                                        {
                                                          staticClass:
                                                            "col-md-12",
                                                        },
                                                        [
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "row",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group col-md-8",
                                                                },
                                                                [
                                                                  _c(
                                                                    "label",
                                                                    {
                                                                      staticClass:
                                                                        "control-label",
                                                                    },
                                                                    [
                                                                      _vm._v(
                                                                        " " +
                                                                          _vm._s(
                                                                            _vm.__(
                                                                              "status"
                                                                            )
                                                                          ) +
                                                                          "\n                                                                        "
                                                                      ),
                                                                      _c(
                                                                        "i",
                                                                        {
                                                                          staticClass:
                                                                            "text-danger",
                                                                        },
                                                                        [
                                                                          _vm._v(
                                                                            "*"
                                                                          ),
                                                                        ]
                                                                      ),
                                                                    ]
                                                                  ),
                                                                  _c("br"),
                                                                  _vm._v(" "),
                                                                  _c(
                                                                    "b-form-radio-group",
                                                                    {
                                                                      staticClass:
                                                                        "d-flex flex-wrap flex-md-nowrap",
                                                                      attrs: {
                                                                        options:
                                                                          [
                                                                            {
                                                                              text: _vm.__(
                                                                                "registered"
                                                                              ),
                                                                              value: 0,
                                                                            },
                                                                            {
                                                                              text: _vm.__(
                                                                                "approved"
                                                                              ),
                                                                              value: 1,
                                                                            },
                                                                            {
                                                                              text: _vm.__(
                                                                                "not_approved"
                                                                              ),
                                                                              value: 2,
                                                                            },
                                                                            {
                                                                              text: _vm.__(
                                                                                "deactive"
                                                                              ),
                                                                              value: 3,
                                                                            },
                                                                            {
                                                                              text: _vm.__(
                                                                                "block"
                                                                              ),
                                                                              value: 4,
                                                                            },
                                                                          ],
                                                                        buttons:
                                                                          "",
                                                                        "button-variant":
                                                                          "outline-primary",
                                                                        required:
                                                                          "",
                                                                      },
                                                                      model: {
                                                                        value:
                                                                          _vm.status,
                                                                        callback:
                                                                          function (
                                                                            $$v
                                                                          ) {
                                                                            _vm.status =
                                                                              $$v
                                                                          },
                                                                        expression:
                                                                          "status",
                                                                      },
                                                                    }
                                                                  ),
                                                                ],
                                                                1
                                                              ),
                                                              _vm._v(" "),
                                                              [
                                                                2, 3, 4,
                                                              ].includes(
                                                                _vm.status
                                                              )
                                                                ? _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "form-group col-md-4",
                                                                    },
                                                                    [
                                                                      _c(
                                                                        "label",
                                                                        {
                                                                          attrs:
                                                                            {
                                                                              for: "remark",
                                                                            },
                                                                        },
                                                                        [
                                                                          _vm._v(
                                                                            _vm._s(
                                                                              _vm.__(
                                                                                "remark"
                                                                              )
                                                                            ) +
                                                                              " "
                                                                          ),
                                                                          _c(
                                                                            "i",
                                                                            {
                                                                              staticClass:
                                                                                "text-danger",
                                                                            },
                                                                            [
                                                                              _vm._v(
                                                                                "*"
                                                                              ),
                                                                            ]
                                                                          ),
                                                                        ]
                                                                      ),
                                                                      _vm._v(
                                                                        " "
                                                                      ),
                                                                      _c(
                                                                        "textarea",
                                                                        {
                                                                          directives:
                                                                            [
                                                                              {
                                                                                name: "model",
                                                                                rawName:
                                                                                  "v-model",
                                                                                value:
                                                                                  _vm.remark,
                                                                                expression:
                                                                                  "remark",
                                                                              },
                                                                            ],
                                                                          staticClass:
                                                                            "form-control",
                                                                          attrs:
                                                                            {
                                                                              name: "remark",
                                                                              id: "remark",
                                                                              required:
                                                                                "",
                                                                              placeholder:
                                                                                "Add a remark of this status...",
                                                                              rows: "3",
                                                                              spellcheck:
                                                                                "true",
                                                                            },
                                                                          domProps:
                                                                            {
                                                                              value:
                                                                                _vm.remark,
                                                                            },
                                                                          on: {
                                                                            input:
                                                                              function (
                                                                                $event
                                                                              ) {
                                                                                if (
                                                                                  $event
                                                                                    .target
                                                                                    .composing
                                                                                ) {
                                                                                  return
                                                                                }
                                                                                _vm.remark =
                                                                                  $event.target.value
                                                                              },
                                                                          },
                                                                        }
                                                                      ),
                                                                    ]
                                                                  )
                                                                : _vm._e(),
                                                            ]
                                                          ),
                                                        ]
                                                      )
                                                    : _vm._e(),
                                                ]
                                              : _vm._e(),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "form-group col-md-12",
                                              },
                                              [
                                                _c("label", [
                                                  _vm._v(
                                                    " " +
                                                      _vm._s(
                                                        _vm.__(
                                                          "store_description"
                                                        )
                                                      )
                                                  ),
                                                ]),
                                                _vm._v(" "),
                                                _c("editor", {
                                                  attrs: {
                                                    placeholder:
                                                      "Enter store description",
                                                    init: _vm.getEditorConfig(),
                                                  },
                                                  model: {
                                                    value:
                                                      _vm.translations[
                                                        language.id
                                                      ].store_description,
                                                    callback: function ($$v) {
                                                      _vm.$set(
                                                        _vm.translations[
                                                          language.id
                                                        ],
                                                        "store_description",
                                                        $$v
                                                      )
                                                    },
                                                    expression:
                                                      "translations[language.id].store_description",
                                                  },
                                                }),
                                              ],
                                              1
                                            ),
                                          ],
                                          2
                                        ),
                                      ]),
                                    ]),
                                    _vm._v(" "),
                                    language.is_default
                                      ? [
                                          _c("div", { staticClass: "card" }, [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "card-header d-flex align-items-center justify-content-between",
                                              },
                                              [
                                                _c(
                                                  "h4",
                                                  { staticClass: "mb-0" },
                                                  [
                                                    _vm._v(
                                                      _vm._s(
                                                        _vm.__(
                                                          "service_zones_and_cities"
                                                        )
                                                      )
                                                    ),
                                                  ]
                                                ),
                                                _vm._v(" "),
                                                _c(
                                                  "button",
                                                  {
                                                    staticClass:
                                                      "btn btn-sm btn-outline-primary",
                                                    attrs: { type: "button" },
                                                    on: {
                                                      click:
                                                        _vm.toggleAddCityForm,
                                                    },
                                                  },
                                                  [
                                                    _c("i", {
                                                      class: _vm.showAddCityForm
                                                        ? "fa fa-times"
                                                        : "fa fa-plus",
                                                    }),
                                                    _vm._v(
                                                      "\n                                                        " +
                                                        _vm._s(
                                                          _vm.showAddCityForm
                                                            ? _vm.__("cancel")
                                                            : _vm.__("add_zone")
                                                        ) +
                                                        "\n                                                    "
                                                    ),
                                                  ]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              { staticClass: "card-body" },
                                              [
                                                !_vm.showAddCityForm
                                                  ? _c(
                                                      "div",
                                                      { staticClass: "row" },
                                                      [
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group col-md-5 mt-0",
                                                          },
                                                          [
                                                            _c(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "form-group",
                                                              },
                                                              [
                                                                _c("label", [
                                                                  _vm._v(
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "zone"
                                                                      )
                                                                    )
                                                                  ),
                                                                  _c(
                                                                    "i",
                                                                    {
                                                                      staticClass:
                                                                        "text-danger",
                                                                    },
                                                                    [
                                                                      _vm._v(
                                                                        "*"
                                                                      ),
                                                                    ]
                                                                  ),
                                                                ]),
                                                                _vm._v(" "),
                                                                _c(
                                                                  "select",
                                                                  {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.selected_zone,
                                                                          expression:
                                                                            "selected_zone",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    on: {
                                                                      change:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          var $$selectedVal =
                                                                            Array.prototype.filter
                                                                              .call(
                                                                                $event
                                                                                  .target
                                                                                  .options,
                                                                                function (
                                                                                  o
                                                                                ) {
                                                                                  return o.selected
                                                                                }
                                                                              )
                                                                              .map(
                                                                                function (
                                                                                  o
                                                                                ) {
                                                                                  var val =
                                                                                    "_value" in
                                                                                    o
                                                                                      ? o._value
                                                                                      : o.value
                                                                                  return val
                                                                                }
                                                                              )
                                                                          _vm.selected_zone =
                                                                            $event
                                                                              .target
                                                                              .multiple
                                                                              ? $$selectedVal
                                                                              : $$selectedVal[0]
                                                                        },
                                                                    },
                                                                  },
                                                                  [
                                                                    _c(
                                                                      "option",
                                                                      {
                                                                        attrs: {
                                                                          value:
                                                                            "",
                                                                        },
                                                                      },
                                                                      [
                                                                        _vm._v(
                                                                          _vm._s(
                                                                            _vm.__(
                                                                              "select_zone"
                                                                            )
                                                                          )
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    _vm._v(" "),
                                                                    _vm._l(
                                                                      _vm.zones,
                                                                      function (
                                                                        z
                                                                      ) {
                                                                        return _c(
                                                                          "option",
                                                                          {
                                                                            key: z.zone,
                                                                            domProps:
                                                                              {
                                                                                value:
                                                                                  z.zone,
                                                                              },
                                                                          },
                                                                          [
                                                                            _vm._v(
                                                                              "\n                                                                        " +
                                                                                _vm._s(
                                                                                  z.zone
                                                                                ) +
                                                                                " (" +
                                                                                _vm._s(
                                                                                  z.city_count
                                                                                ) +
                                                                                " " +
                                                                                _vm._s(
                                                                                  _vm.__(
                                                                                    "cities"
                                                                                  )
                                                                                ) +
                                                                                ")\n                                                                    "
                                                                            ),
                                                                          ]
                                                                        )
                                                                      }
                                                                    ),
                                                                  ],
                                                                  2
                                                                ),
                                                              ]
                                                            ),
                                                          ]
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group col-md-7",
                                                          },
                                                          [
                                                            _c(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "form-group",
                                                              },
                                                              [
                                                                _c(
                                                                  "label",
                                                                  {
                                                                    attrs: {
                                                                      for: "city_name",
                                                                    },
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.__(
                                                                          "select_cities"
                                                                        )
                                                                      )
                                                                    ),
                                                                    _c(
                                                                      "i",
                                                                      {
                                                                        staticClass:
                                                                          "text-danger",
                                                                      },
                                                                      [
                                                                        _vm._v(
                                                                          "*"
                                                                        ),
                                                                      ]
                                                                    ),
                                                                  ]
                                                                ),
                                                                _vm._v(" "),
                                                                _c("Select2", {
                                                                  attrs: {
                                                                    placeholder:
                                                                      _vm.__(
                                                                        "select_cities"
                                                                      ),
                                                                    options:
                                                                      _vm.cities_options,
                                                                    settings: {
                                                                      multiple:
                                                                        "multiple",
                                                                    },
                                                                  },
                                                                  model: {
                                                                    value:
                                                                      _vm.city_id,
                                                                    callback:
                                                                      function (
                                                                        $$v
                                                                      ) {
                                                                        _vm.city_id =
                                                                          $$v
                                                                      },
                                                                    expression:
                                                                      "city_id",
                                                                  },
                                                                }),
                                                                _vm._v(" "),
                                                                !_vm.selected_zone &&
                                                                _vm.zones.length
                                                                  ? _c(
                                                                      "small",
                                                                      {
                                                                        staticClass:
                                                                          "text-muted",
                                                                      },
                                                                      [
                                                                        _vm._v(
                                                                          _vm._s(
                                                                            _vm.__(
                                                                              "select_zone_to_filter_cities"
                                                                            )
                                                                          )
                                                                        ),
                                                                      ]
                                                                    )
                                                                  : _vm._e(),
                                                              ],
                                                              1
                                                            ),
                                                          ]
                                                        ),
                                                      ]
                                                    )
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                _vm.showAddCityForm
                                                  ? _c("div", [
                                                      _c(
                                                        "p",
                                                        {
                                                          staticClass:
                                                            "text-muted mb-3",
                                                        },
                                                        [
                                                          _c("i", {
                                                            staticClass:
                                                              "fa fa-info-circle",
                                                          }),
                                                          _vm._v(
                                                            "\n                                                            Enter a zone name, search the area on the map, then "
                                                          ),
                                                          _c("strong", [
                                                            _vm._v(
                                                              "draw the zone boundary"
                                                            ),
                                                          ]),
                                                          _vm._v(
                                                            " using the polygon or circle tool.\n                                                        "
                                                          ),
                                                        ]
                                                      ),
                                                      _vm._v(" "),
                                                      _c(
                                                        "div",
                                                        { staticClass: "row" },
                                                        [
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "col-md-5",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group mt-0",
                                                                },
                                                                [
                                                                  _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "form-group",
                                                                    },
                                                                    [
                                                                      _c(
                                                                        "label",
                                                                        [
                                                                          _vm._v(
                                                                            _vm._s(
                                                                              _vm.__(
                                                                                "zone_name"
                                                                              )
                                                                            )
                                                                          ),
                                                                          _c(
                                                                            "i",
                                                                            {
                                                                              staticClass:
                                                                                "text-danger",
                                                                            },
                                                                            [
                                                                              _vm._v(
                                                                                "*"
                                                                              ),
                                                                            ]
                                                                          ),
                                                                        ]
                                                                      ),
                                                                      _vm._v(
                                                                        " "
                                                                      ),
                                                                      _c(
                                                                        "input",
                                                                        {
                                                                          directives:
                                                                            [
                                                                              {
                                                                                name: "model",
                                                                                rawName:
                                                                                  "v-model",
                                                                                value:
                                                                                  _vm
                                                                                    .newCity
                                                                                    .zone,
                                                                                expression:
                                                                                  "newCity.zone",
                                                                              },
                                                                            ],
                                                                          staticClass:
                                                                            "form-control",
                                                                          attrs:
                                                                            {
                                                                              type: "text",
                                                                              placeholder:
                                                                                _vm.__(
                                                                                  "zone_name"
                                                                                ),
                                                                            },
                                                                          domProps:
                                                                            {
                                                                              value:
                                                                                _vm
                                                                                  .newCity
                                                                                  .zone,
                                                                            },
                                                                          on: {
                                                                            input:
                                                                              function (
                                                                                $event
                                                                              ) {
                                                                                if (
                                                                                  $event
                                                                                    .target
                                                                                    .composing
                                                                                ) {
                                                                                  return
                                                                                }
                                                                                _vm.$set(
                                                                                  _vm.newCity,
                                                                                  "zone",
                                                                                  $event
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              },
                                                                          },
                                                                        }
                                                                      ),
                                                                    ]
                                                                  ),
                                                                ]
                                                              ),
                                                              _vm._v(" "),
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group mt-0",
                                                                },
                                                                [
                                                                  _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "form-group",
                                                                    },
                                                                    [
                                                                      _c(
                                                                        "label",
                                                                        [
                                                                          _vm._v(
                                                                            _vm._s(
                                                                              _vm.__(
                                                                                "search_location"
                                                                              )
                                                                            )
                                                                          ),
                                                                        ]
                                                                      ),
                                                                      _vm._v(
                                                                        " "
                                                                      ),
                                                                      _c(
                                                                        "GmapAutocomplete",
                                                                        {
                                                                          staticClass:
                                                                            "form-control",
                                                                          attrs:
                                                                            {
                                                                              type: "search",
                                                                              placeholder:
                                                                                _vm.__(
                                                                                  "search_your_location_on_map"
                                                                                ),
                                                                              options:
                                                                                {
                                                                                  fields:
                                                                                    [
                                                                                      "address_components",
                                                                                      "formatted_address",
                                                                                      "geometry",
                                                                                      "name",
                                                                                    ],
                                                                                  strictBounds: false,
                                                                                },
                                                                              id: "city_map_search",
                                                                            },
                                                                          on: {
                                                                            place_changed:
                                                                              _vm.setCityPlace,
                                                                          },
                                                                        }
                                                                      ),
                                                                      _vm._v(
                                                                        " "
                                                                      ),
                                                                      _c(
                                                                        "small",
                                                                        {
                                                                          staticClass:
                                                                            "text-muted",
                                                                        },
                                                                        [
                                                                          _vm._v(
                                                                            _vm._s(
                                                                              _vm.__(
                                                                                "search_to_navigate_map_then_draw_zone_boundary"
                                                                              )
                                                                            )
                                                                          ),
                                                                        ]
                                                                      ),
                                                                    ],
                                                                    1
                                                                  ),
                                                                ]
                                                              ),
                                                              _vm._v(" "),
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "row",
                                                                },
                                                                [
                                                                  _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "form-group col-md-6 mt-0",
                                                                    },
                                                                    [
                                                                      _c(
                                                                        "div",
                                                                        {
                                                                          staticClass:
                                                                            "form-group",
                                                                        },
                                                                        [
                                                                          _c(
                                                                            "label",
                                                                            [
                                                                              _vm._v(
                                                                                _vm._s(
                                                                                  _vm.__(
                                                                                    "latitude"
                                                                                  )
                                                                                )
                                                                              ),
                                                                            ]
                                                                          ),
                                                                          _vm._v(
                                                                            " "
                                                                          ),
                                                                          _c(
                                                                            "input",
                                                                            {
                                                                              directives:
                                                                                [
                                                                                  {
                                                                                    name: "model",
                                                                                    rawName:
                                                                                      "v-model",
                                                                                    value:
                                                                                      _vm
                                                                                        .newCity
                                                                                        .latitude,
                                                                                    expression:
                                                                                      "newCity.latitude",
                                                                                  },
                                                                                ],
                                                                              staticClass:
                                                                                "form-control",
                                                                              attrs:
                                                                                {
                                                                                  type: "text",
                                                                                  readonly:
                                                                                    "",
                                                                                  placeholder:
                                                                                    _vm.__(
                                                                                      "latitude"
                                                                                    ),
                                                                                },
                                                                              domProps:
                                                                                {
                                                                                  value:
                                                                                    _vm
                                                                                      .newCity
                                                                                      .latitude,
                                                                                },
                                                                              on: {
                                                                                input:
                                                                                  function (
                                                                                    $event
                                                                                  ) {
                                                                                    if (
                                                                                      $event
                                                                                        .target
                                                                                        .composing
                                                                                    ) {
                                                                                      return
                                                                                    }
                                                                                    _vm.$set(
                                                                                      _vm.newCity,
                                                                                      "latitude",
                                                                                      $event
                                                                                        .target
                                                                                        .value
                                                                                    )
                                                                                  },
                                                                              },
                                                                            }
                                                                          ),
                                                                        ]
                                                                      ),
                                                                    ]
                                                                  ),
                                                                  _vm._v(" "),
                                                                  _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "form-group col-md-6",
                                                                    },
                                                                    [
                                                                      _c(
                                                                        "div",
                                                                        {
                                                                          staticClass:
                                                                            "form-group",
                                                                        },
                                                                        [
                                                                          _c(
                                                                            "label",
                                                                            [
                                                                              _vm._v(
                                                                                _vm._s(
                                                                                  _vm.__(
                                                                                    "longitude"
                                                                                  )
                                                                                )
                                                                              ),
                                                                            ]
                                                                          ),
                                                                          _vm._v(
                                                                            " "
                                                                          ),
                                                                          _c(
                                                                            "input",
                                                                            {
                                                                              directives:
                                                                                [
                                                                                  {
                                                                                    name: "model",
                                                                                    rawName:
                                                                                      "v-model",
                                                                                    value:
                                                                                      _vm
                                                                                        .newCity
                                                                                        .longitude,
                                                                                    expression:
                                                                                      "newCity.longitude",
                                                                                  },
                                                                                ],
                                                                              staticClass:
                                                                                "form-control",
                                                                              attrs:
                                                                                {
                                                                                  type: "text",
                                                                                  readonly:
                                                                                    "",
                                                                                  placeholder:
                                                                                    _vm.__(
                                                                                      "longitude"
                                                                                    ),
                                                                                },
                                                                              domProps:
                                                                                {
                                                                                  value:
                                                                                    _vm
                                                                                      .newCity
                                                                                      .longitude,
                                                                                },
                                                                              on: {
                                                                                input:
                                                                                  function (
                                                                                    $event
                                                                                  ) {
                                                                                    if (
                                                                                      $event
                                                                                        .target
                                                                                        .composing
                                                                                    ) {
                                                                                      return
                                                                                    }
                                                                                    _vm.$set(
                                                                                      _vm.newCity,
                                                                                      "longitude",
                                                                                      $event
                                                                                        .target
                                                                                        .value
                                                                                    )
                                                                                  },
                                                                              },
                                                                            }
                                                                          ),
                                                                        ]
                                                                      ),
                                                                    ]
                                                                  ),
                                                                ]
                                                              ),
                                                              _vm._v(" "),
                                                              !_vm.cityVertices
                                                                ? _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "alert alert-warning py-2 px-3",
                                                                    },
                                                                    [
                                                                      _c("i", {
                                                                        staticClass:
                                                                          "fa fa-draw-polygon mr-1",
                                                                      }),
                                                                      _vm._v(
                                                                        "\n                                                                    " +
                                                                          _vm._s(
                                                                            _vm.__(
                                                                              "draw_zone_boundary_on_map_using_tools"
                                                                            )
                                                                          ) +
                                                                          "\n                                                                "
                                                                      ),
                                                                    ]
                                                                  )
                                                                : _c(
                                                                    "div",
                                                                    {
                                                                      staticClass:
                                                                        "alert alert-success py-2 px-3",
                                                                    },
                                                                    [
                                                                      _c("i", {
                                                                        staticClass:
                                                                          "fa fa-check-circle mr-1",
                                                                      }),
                                                                      _vm._v(
                                                                        "\n                                                                    " +
                                                                          _vm._s(
                                                                            _vm.__(
                                                                              "zone_boundary_drawn_successfully"
                                                                            )
                                                                          ) +
                                                                          "\n                                                                "
                                                                      ),
                                                                    ]
                                                                  ),
                                                              _vm._v(" "),
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "d-flex gap-2",
                                                                },
                                                                [
                                                                  _c(
                                                                    "button",
                                                                    {
                                                                      staticClass:
                                                                        "btn btn-success btn-sm",
                                                                      attrs: {
                                                                        type: "button",
                                                                        disabled:
                                                                          _vm.isSavingCity,
                                                                      },
                                                                      on: {
                                                                        click:
                                                                          _vm.saveNewCity,
                                                                      },
                                                                    },
                                                                    [
                                                                      _vm.isSavingCity
                                                                        ? _c(
                                                                            "b-spinner",
                                                                            {
                                                                              staticClass:
                                                                                "mr-1",
                                                                              attrs:
                                                                                {
                                                                                  small:
                                                                                    "",
                                                                                },
                                                                            }
                                                                          )
                                                                        : _vm._e(),
                                                                      _vm._v(
                                                                        "\n                                                                        " +
                                                                          _vm._s(
                                                                            _vm.isSavingCity
                                                                              ? _vm.__(
                                                                                  "saving"
                                                                                )
                                                                              : _vm.__(
                                                                                  "save_zone"
                                                                                )
                                                                          ) +
                                                                          "\n                                                                    "
                                                                      ),
                                                                    ],
                                                                    1
                                                                  ),
                                                                  _vm._v(" "),
                                                                  _c(
                                                                    "button",
                                                                    {
                                                                      staticClass:
                                                                        "btn btn-secondary btn-sm ml-2",
                                                                      attrs: {
                                                                        type: "button",
                                                                      },
                                                                      on: {
                                                                        click:
                                                                          _vm.toggleAddCityForm,
                                                                      },
                                                                    },
                                                                    [
                                                                      _vm._v(
                                                                        _vm._s(
                                                                          _vm.__(
                                                                            "cancel"
                                                                          )
                                                                        )
                                                                      ),
                                                                    ]
                                                                  ),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "col-md-7",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "mb-2 d-flex gap-2",
                                                                },
                                                                [
                                                                  _c(
                                                                    "button",
                                                                    {
                                                                      staticClass:
                                                                        "btn btn-sm btn-danger",
                                                                      attrs: {
                                                                        type: "button",
                                                                      },
                                                                      on: {
                                                                        click:
                                                                          _vm.clearCityDrawing,
                                                                      },
                                                                    },
                                                                    [
                                                                      _c("i", {
                                                                        staticClass:
                                                                          "fa fa-trash",
                                                                      }),
                                                                      _vm._v(
                                                                        " " +
                                                                          _vm._s(
                                                                            _vm.__(
                                                                              "clear_map"
                                                                            )
                                                                          ) +
                                                                          "\n                                                                    "
                                                                      ),
                                                                    ]
                                                                  ),
                                                                  _vm._v(" "),
                                                                  _vm.cityVertices
                                                                    ? _c(
                                                                        "span",
                                                                        {
                                                                          staticClass:
                                                                            "badge bg-success align-self-center ml-2",
                                                                        },
                                                                        [
                                                                          _vm._v(
                                                                            _vm._s(
                                                                              _vm.__(
                                                                                "boundary_drawn"
                                                                              )
                                                                            )
                                                                          ),
                                                                        ]
                                                                      )
                                                                    : _vm._e(),
                                                                ]
                                                              ),
                                                              _vm._v(" "),
                                                              _c(
                                                                "GmapMap",
                                                                {
                                                                  ref: "cityMapRef",
                                                                  refInFor: true,
                                                                  staticStyle: {
                                                                    width:
                                                                      "100%",
                                                                    height:
                                                                      "450px",
                                                                  },
                                                                  attrs: {
                                                                    center:
                                                                      _vm.cityMapCenter,
                                                                    zoom: 5,
                                                                    mapTypeControl: true,
                                                                    drawingControl: true,
                                                                  },
                                                                },
                                                                [
                                                                  _vm._l(
                                                                    _vm.cityMapMarkers,
                                                                    function (
                                                                      m,
                                                                      mi
                                                                    ) {
                                                                      return _c(
                                                                        "GmapMarker",
                                                                        {
                                                                          key: mi,
                                                                          attrs:
                                                                            {
                                                                              position:
                                                                                m.position,
                                                                              draggable: true,
                                                                              clickable: true,
                                                                            },
                                                                        }
                                                                      )
                                                                    }
                                                                  ),
                                                                  _vm._v(" "),
                                                                  _c(
                                                                    "gmap-info-window",
                                                                    {
                                                                      attrs: {
                                                                        options:
                                                                          {
                                                                            maxWidth: 300,
                                                                            pixelOffset:
                                                                              {
                                                                                width: 0,
                                                                                height:
                                                                                  -35,
                                                                              },
                                                                          },
                                                                        position:
                                                                          _vm
                                                                            .cityInfoWindow
                                                                            .position,
                                                                        opened:
                                                                          _vm
                                                                            .cityInfoWindow
                                                                            .open,
                                                                      },
                                                                      on: {
                                                                        closeclick:
                                                                          function (
                                                                            $event
                                                                          ) {
                                                                            _vm.cityInfoWindow.open = false
                                                                          },
                                                                      },
                                                                    },
                                                                    [
                                                                      _c(
                                                                        "div",
                                                                        {
                                                                          domProps:
                                                                            {
                                                                              innerHTML:
                                                                                _vm._s(
                                                                                  _vm
                                                                                    .cityInfoWindow
                                                                                    .template
                                                                                ),
                                                                            },
                                                                        }
                                                                      ),
                                                                    ]
                                                                  ),
                                                                ],
                                                                2
                                                              ),
                                                              _vm._v(" "),
                                                              _c(
                                                                "small",
                                                                {
                                                                  staticClass:
                                                                    "text-muted d-block mt-1",
                                                                },
                                                                [
                                                                  _vm._v(
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "use_drawing_tools_on_map_to_draw_zone_boundary"
                                                                      )
                                                                    )
                                                                  ),
                                                                ]
                                                              ),
                                                            ],
                                                            1
                                                          ),
                                                        ]
                                                      ),
                                                    ])
                                                  : _vm._e(),
                                              ]
                                            ),
                                          ]),
                                          _vm._v(" "),
                                          _c("div", { staticClass: "card" }, [
                                            _c(
                                              "div",
                                              { staticClass: "card-header" },
                                              [
                                                _c("h4", [
                                                  _vm._v(
                                                    " " +
                                                      _vm._s(
                                                        _vm.__(
                                                          "store_location_information"
                                                        )
                                                      )
                                                  ),
                                                ]),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              { staticClass: "card-body" },
                                              [
                                                _c(
                                                  "div",
                                                  { staticClass: "row" },
                                                  [
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "form-group col-md-4",
                                                      },
                                                      [
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group",
                                                          },
                                                          [
                                                            _c("label", [
                                                              _vm._v(
                                                                " " +
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "state"
                                                                    )
                                                                  )
                                                              ),
                                                            ]),
                                                            _vm._v(" "),
                                                            _c("input", {
                                                              directives: [
                                                                {
                                                                  name: "model",
                                                                  rawName:
                                                                    "v-model",
                                                                  value:
                                                                    _vm.state,
                                                                  expression:
                                                                    "state",
                                                                },
                                                              ],
                                                              staticClass:
                                                                "form-control",
                                                              attrs: {
                                                                type: "text",
                                                                readonly: "",
                                                                placeholder:
                                                                  _vm.__(
                                                                    "state"
                                                                  ),
                                                              },
                                                              domProps: {
                                                                value:
                                                                  _vm.state,
                                                              },
                                                              on: {
                                                                input:
                                                                  function (
                                                                    $event
                                                                  ) {
                                                                    if (
                                                                      $event
                                                                        .target
                                                                        .composing
                                                                    ) {
                                                                      return
                                                                    }
                                                                    _vm.state =
                                                                      $event.target.value
                                                                  },
                                                              },
                                                            }),
                                                          ]
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "form-group col-md-4",
                                                      },
                                                      [
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group",
                                                          },
                                                          [
                                                            _c("label", [
                                                              _vm._v(
                                                                " " +
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "street"
                                                                    )
                                                                  )
                                                              ),
                                                            ]),
                                                            _vm._v(" "),
                                                            _c("input", {
                                                              directives: [
                                                                {
                                                                  name: "model",
                                                                  rawName:
                                                                    "v-model",
                                                                  value:
                                                                    _vm.street,
                                                                  expression:
                                                                    "street",
                                                                },
                                                              ],
                                                              staticClass:
                                                                "form-control",
                                                              attrs: {
                                                                type: "text",
                                                                readonly: "",
                                                                placeholder:
                                                                  _vm.__(
                                                                    "street"
                                                                  ),
                                                              },
                                                              domProps: {
                                                                value:
                                                                  _vm.street,
                                                              },
                                                              on: {
                                                                input:
                                                                  function (
                                                                    $event
                                                                  ) {
                                                                    if (
                                                                      $event
                                                                        .target
                                                                        .composing
                                                                    ) {
                                                                      return
                                                                    }
                                                                    _vm.street =
                                                                      $event.target.value
                                                                  },
                                                              },
                                                            }),
                                                          ]
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "form-group col-md-4",
                                                      },
                                                      [
                                                        _c(
                                                          "label",
                                                          {
                                                            attrs: {
                                                              for: "location",
                                                            },
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.__(
                                                                  "search_location"
                                                                )
                                                              )
                                                            ),
                                                          ]
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "input-group",
                                                          },
                                                          [
                                                            _c(
                                                              "GmapAutocomplete",
                                                              {
                                                                staticClass:
                                                                  "form-control",
                                                                attrs: {
                                                                  type: "search",
                                                                  placeholder:
                                                                    _vm.__(
                                                                      "search_your_location_on_map"
                                                                    ),
                                                                  options: {
                                                                    fields: [
                                                                      "formatted_address",
                                                                      "geometry",
                                                                      "name",
                                                                    ],
                                                                    strictBounds: false,
                                                                  },
                                                                  id: "location",
                                                                },
                                                                on: {
                                                                  place_changed:
                                                                    _vm.setPlace,
                                                                },
                                                              }
                                                            ),
                                                            _vm._v(" "),
                                                            _c(
                                                              "b-button",
                                                              {
                                                                directives: [
                                                                  {
                                                                    name: "b-tooltip",
                                                                    rawName:
                                                                      "v-b-tooltip.hover",
                                                                    modifiers: {
                                                                      hover: true,
                                                                    },
                                                                  },
                                                                ],
                                                                staticClass:
                                                                  "search_location_btn",
                                                                attrs: {
                                                                  type: "button",
                                                                  variant:
                                                                    "primary",
                                                                  title:
                                                                    "Add current location",
                                                                },
                                                                on: {
                                                                  click:
                                                                    _vm.getCurrentLocation,
                                                                },
                                                              },
                                                              [
                                                                _c(
                                                                  "svg",
                                                                  {
                                                                    attrs: {
                                                                      xmlns:
                                                                        "http://www.w3.org/2000/svg",
                                                                      height:
                                                                        "48px",
                                                                      viewBox:
                                                                        "0 0 24 24",
                                                                      width:
                                                                        "48px",
                                                                      fill: "#FFFFFF",
                                                                    },
                                                                  },
                                                                  [
                                                                    _c(
                                                                      "title",
                                                                      [
                                                                        _vm._v(
                                                                          "current-location"
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    _vm._v(" "),
                                                                    _c("path", {
                                                                      attrs: {
                                                                        d: "M0 0h24v24H0V0z",
                                                                        fill: "none",
                                                                      },
                                                                    }),
                                                                    _vm._v(" "),
                                                                    _c("path", {
                                                                      attrs: {
                                                                        d: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
                                                                      },
                                                                    }),
                                                                  ]
                                                                ),
                                                              ]
                                                            ),
                                                          ],
                                                          1
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "text-danger d-block font-size-13",
                                                          },
                                                          [
                                                            _vm._v(
                                                              "\n                                                                " +
                                                                _vm._s(
                                                                  _vm.__(
                                                                    "only_search_location_when_update_is_necessary"
                                                                  )
                                                                )
                                                            ),
                                                          ]
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "span",
                                                          {
                                                            staticClass:
                                                              "text text-primary font-size-13",
                                                          },
                                                          [
                                                            _vm._v(
                                                              "\n                                                                " +
                                                                _vm._s(
                                                                  _vm.__(
                                                                    "search_your_seller_name_and_you_will_get_the_location_points_latitude_longitude_below"
                                                                  )
                                                                )
                                                            ),
                                                          ]
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "form-group col-md-4",
                                                      },
                                                      [
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group",
                                                          },
                                                          [
                                                            _c("label", [
                                                              _vm._v(
                                                                " " +
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "latitude"
                                                                    )
                                                                  )
                                                              ),
                                                              _c(
                                                                "i",
                                                                {
                                                                  staticClass:
                                                                    "text-danger",
                                                                },
                                                                [_vm._v("*")]
                                                              ),
                                                            ]),
                                                            _vm._v(" "),
                                                            _c("input", {
                                                              directives: [
                                                                {
                                                                  name: "model",
                                                                  rawName:
                                                                    "v-model",
                                                                  value:
                                                                    _vm.latitude,
                                                                  expression:
                                                                    "latitude",
                                                                },
                                                              ],
                                                              staticClass:
                                                                "form-control",
                                                              attrs: {
                                                                type: "text",
                                                                readonly: "",
                                                                placeholder:
                                                                  _vm.__(
                                                                    "latitude"
                                                                  ),
                                                              },
                                                              domProps: {
                                                                value:
                                                                  _vm.latitude,
                                                              },
                                                              on: {
                                                                input:
                                                                  function (
                                                                    $event
                                                                  ) {
                                                                    if (
                                                                      $event
                                                                        .target
                                                                        .composing
                                                                    ) {
                                                                      return
                                                                    }
                                                                    _vm.latitude =
                                                                      $event.target.value
                                                                  },
                                                              },
                                                            }),
                                                          ]
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "form-group col-md-4",
                                                      },
                                                      [
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group",
                                                          },
                                                          [
                                                            _c("label", [
                                                              _vm._v(
                                                                " " +
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "longitude"
                                                                    )
                                                                  )
                                                              ),
                                                              _c(
                                                                "i",
                                                                {
                                                                  staticClass:
                                                                    "text-danger",
                                                                },
                                                                [_vm._v("*")]
                                                              ),
                                                            ]),
                                                            _vm._v(" "),
                                                            _c("input", {
                                                              directives: [
                                                                {
                                                                  name: "model",
                                                                  rawName:
                                                                    "v-model",
                                                                  value:
                                                                    _vm.longitude,
                                                                  expression:
                                                                    "longitude",
                                                                },
                                                              ],
                                                              staticClass:
                                                                "form-control",
                                                              attrs: {
                                                                type: "text",
                                                                readonly: "",
                                                                placeholder:
                                                                  _vm.__(
                                                                    "longitude"
                                                                  ),
                                                              },
                                                              domProps: {
                                                                value:
                                                                  _vm.longitude,
                                                              },
                                                              on: {
                                                                input:
                                                                  function (
                                                                    $event
                                                                  ) {
                                                                    if (
                                                                      $event
                                                                        .target
                                                                        .composing
                                                                    ) {
                                                                      return
                                                                    }
                                                                    _vm.longitude =
                                                                      $event.target.value
                                                                  },
                                                              },
                                                            }),
                                                          ]
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "col-md-12 mb-3",
                                                      },
                                                      [
                                                        _vm.formatted_address
                                                          ? _c(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "text-danger",
                                                              },
                                                              [
                                                                _vm._v(
                                                                  "\n                                                                " +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "draf_and_click_marker_to_your_shop_proper_location"
                                                                      )
                                                                    )
                                                                ),
                                                              ]
                                                            )
                                                          : _vm._e(),
                                                        _vm._v(" "),
                                                        _c(
                                                          "div",
                                                          {
                                                            staticStyle: {
                                                              position:
                                                                "relative",
                                                              overflow:
                                                                "hidden",
                                                            },
                                                            attrs: {
                                                              id: "map",
                                                            },
                                                          },
                                                          [
                                                            _c(
                                                              "GmapMap",
                                                              {
                                                                ref: "mapRef",
                                                                refInFor: true,
                                                                staticStyle: {
                                                                  width: "100%",
                                                                  height:
                                                                    "400px",
                                                                  "margin-top":
                                                                    "20px",
                                                                },
                                                                attrs: {
                                                                  center:
                                                                    _vm.center,
                                                                  zoom: 13,
                                                                  mapTypeControl: true,
                                                                },
                                                                on: {
                                                                  click:
                                                                    _vm.handleMapClick,
                                                                },
                                                              },
                                                              [
                                                                _vm._l(
                                                                  _vm.markers,
                                                                  function (
                                                                    m,
                                                                    index
                                                                  ) {
                                                                    return _c(
                                                                      "GmapMarker",
                                                                      {
                                                                        key: index,
                                                                        attrs: {
                                                                          position:
                                                                            m.position,
                                                                          clickable: true,
                                                                          draggable: true,
                                                                        },
                                                                        on: {
                                                                          drag: _vm.updateCoordinates,
                                                                          click:
                                                                            _vm.updateCoordinates,
                                                                        },
                                                                      }
                                                                    )
                                                                  }
                                                                ),
                                                                _vm._v(" "),
                                                                _c(
                                                                  "gmap-info-window",
                                                                  {
                                                                    attrs: {
                                                                      options: {
                                                                        maxWidth: 300,
                                                                        pixelOffset:
                                                                          {
                                                                            width: 0,
                                                                            height:
                                                                              -35,
                                                                          },
                                                                      },
                                                                      position:
                                                                        _vm
                                                                          .infoWindow
                                                                          .position,
                                                                      opened:
                                                                        _vm
                                                                          .infoWindow
                                                                          .open,
                                                                    },
                                                                    on: {
                                                                      closeclick:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          _vm.infoWindow.open = false
                                                                        },
                                                                    },
                                                                  },
                                                                  [
                                                                    _c("div", {
                                                                      domProps:
                                                                        {
                                                                          innerHTML:
                                                                            _vm._s(
                                                                              _vm
                                                                                .infoWindow
                                                                                .template
                                                                            ),
                                                                        },
                                                                    }),
                                                                  ]
                                                                ),
                                                              ],
                                                              2
                                                            ),
                                                          ],
                                                          1
                                                        ),
                                                        _vm._v(" "),
                                                        _vm.formatted_address
                                                          ? _c("div", [
                                                              _c(
                                                                "span",
                                                                {
                                                                  staticClass:
                                                                    "title font-weight-bolder",
                                                                },
                                                                [
                                                                  _c("b", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.place_name
                                                                      )
                                                                    ),
                                                                  ]),
                                                                  _vm._v(
                                                                    " - " +
                                                                      _vm._s(
                                                                        _vm.formatted_address
                                                                      )
                                                                  ),
                                                                ]
                                                              ),
                                                            ])
                                                          : _vm._e(),
                                                      ]
                                                    ),
                                                  ]
                                                ),
                                              ]
                                            ),
                                          ]),
                                          _vm._v(" "),
                                          _vm.isSellerRole
                                            ? _c(
                                                "div",
                                                { staticClass: "card" },
                                                [
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "card-header",
                                                    },
                                                    [
                                                      _c("h4", [
                                                        _vm._v(
                                                          _vm._s(
                                                            _vm.__(
                                                              "seller_bank_information"
                                                            )
                                                          )
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass: "card-body",
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        { staticClass: "row" },
                                                        [
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group col-md-3 mt-0",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group",
                                                                },
                                                                [
                                                                  _c("label", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.__(
                                                                          "bank_name"
                                                                        )
                                                                      )
                                                                    ),
                                                                  ]),
                                                                  _vm._v(" "),
                                                                  _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.bank_name,
                                                                          expression:
                                                                            "bank_name",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      type: "text",
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "bank_name"
                                                                        ),
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.bank_name,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.bank_name =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group col-md-3 mt-0",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group",
                                                                },
                                                                [
                                                                  _c("label", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.__(
                                                                          "account_number"
                                                                        )
                                                                      )
                                                                    ),
                                                                  ]),
                                                                  _vm._v(" "),
                                                                  _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.account_number,
                                                                          expression:
                                                                            "account_number",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      type: "text",
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "account_number"
                                                                        ),
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.account_number,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.account_number =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group col-md-3 mt-0",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group",
                                                                },
                                                                [
                                                                  _c("label", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.__(
                                                                          "bank_ifsc_code"
                                                                        )
                                                                      )
                                                                    ),
                                                                  ]),
                                                                  _vm._v(" "),
                                                                  _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.bank_ifsc_code,
                                                                          expression:
                                                                            "bank_ifsc_code",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      type: "text",
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "bank_ifsc_code"
                                                                        ),
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.bank_ifsc_code,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.bank_ifsc_code =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group col-md-3 mt-0",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group",
                                                                },
                                                                [
                                                                  _c("label", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.__(
                                                                          "bank_account_name"
                                                                        )
                                                                      )
                                                                    ),
                                                                  ]),
                                                                  _vm._v(" "),
                                                                  _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.account_name,
                                                                          expression:
                                                                            "account_name",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      type: "text",
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "bank_account_name"
                                                                        ),
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.account_name,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.account_name =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              )
                                            : _vm._e(),
                                          _vm._v(" "),
                                          !_vm.isSellerRole
                                            ? _c(
                                                "div",
                                                { staticClass: "card" },
                                                [
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "card-header",
                                                    },
                                                    [
                                                      _c("h4", [
                                                        _vm._v(
                                                          _vm._s(
                                                            _vm.__(
                                                              "upi_information"
                                                            )
                                                          )
                                                        ),
                                                      ]),
                                                    ]
                                                  ),
                                                  _vm._v(" "),
                                                  _c(
                                                    "div",
                                                    {
                                                      staticClass: "card-body",
                                                    },
                                                    [
                                                      _c(
                                                        "div",
                                                        { staticClass: "row" },
                                                        [
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group col-md-4 mt-0",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group",
                                                                },
                                                                [
                                                                  _c("label", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.__(
                                                                          "upi_id"
                                                                        )
                                                                      )
                                                                    ),
                                                                  ]),
                                                                  _vm._v(" "),
                                                                  _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.upi_id,
                                                                          expression:
                                                                            "upi_id",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      type: "text",
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "upi_id"
                                                                        ),
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.upi_id,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.upi_id =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                                  _vm._v(" "),
                                                                  _c(
                                                                    "small",
                                                                    {
                                                                      staticClass:
                                                                        "text-muted",
                                                                    },
                                                                    [
                                                                      _vm._v(
                                                                        "e.g. name@upi"
                                                                      ),
                                                                    ]
                                                                  ),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group col-md-4",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group",
                                                                },
                                                                [
                                                                  _c("label", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.__(
                                                                          "upi_mobile"
                                                                        )
                                                                      )
                                                                    ),
                                                                  ]),
                                                                  _vm._v(" "),
                                                                  _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.upi_mobile,
                                                                          expression:
                                                                            "upi_mobile",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      type: "text",
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "upi_mobile"
                                                                        ),
                                                                      inputmode:
                                                                        "numeric",
                                                                      maxlength:
                                                                        "10",
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.upi_mobile,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.upi_mobile =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                          _vm._v(" "),
                                                          _c(
                                                            "div",
                                                            {
                                                              staticClass:
                                                                "form-group col-md-4",
                                                            },
                                                            [
                                                              _c(
                                                                "div",
                                                                {
                                                                  staticClass:
                                                                    "form-group",
                                                                },
                                                                [
                                                                  _c("label", [
                                                                    _vm._v(
                                                                      _vm._s(
                                                                        _vm.__(
                                                                          "upi_name"
                                                                        )
                                                                      )
                                                                    ),
                                                                  ]),
                                                                  _vm._v(" "),
                                                                  _c("input", {
                                                                    directives:
                                                                      [
                                                                        {
                                                                          name: "model",
                                                                          rawName:
                                                                            "v-model",
                                                                          value:
                                                                            _vm.upi_name,
                                                                          expression:
                                                                            "upi_name",
                                                                        },
                                                                      ],
                                                                    staticClass:
                                                                      "form-control",
                                                                    attrs: {
                                                                      type: "text",
                                                                      placeholder:
                                                                        _vm.__(
                                                                          "upi_name"
                                                                        ),
                                                                    },
                                                                    domProps: {
                                                                      value:
                                                                        _vm.upi_name,
                                                                    },
                                                                    on: {
                                                                      input:
                                                                        function (
                                                                          $event
                                                                        ) {
                                                                          if (
                                                                            $event
                                                                              .target
                                                                              .composing
                                                                          ) {
                                                                            return
                                                                          }
                                                                          _vm.upi_name =
                                                                            $event.target.value
                                                                        },
                                                                    },
                                                                  }),
                                                                ]
                                                              ),
                                                            ]
                                                          ),
                                                        ]
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              )
                                            : _vm._e(),
                                          _vm._v(" "),
                                          _c("div", { staticClass: "card" }, [
                                            _c(
                                              "div",
                                              { staticClass: "card-header" },
                                              [
                                                _c("h4", [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.__("other_setting")
                                                    )
                                                  ),
                                                ]),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              { staticClass: "card-body" },
                                              [
                                                _c(
                                                  "div",
                                                  { staticClass: "row" },
                                                  [
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "form-group col-md-3",
                                                      },
                                                      [
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group",
                                                          },
                                                          [
                                                            _c(
                                                              "label",
                                                              {
                                                                staticClass:
                                                                  "control-label",
                                                              },
                                                              [
                                                                _vm._v(
                                                                  " " +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "require_product_approval"
                                                                      )
                                                                    )
                                                                ),
                                                              ]
                                                            ),
                                                            _c("br"),
                                                            _vm._v(" "),
                                                            _c(
                                                              "b-form-radio-group",
                                                              {
                                                                attrs: {
                                                                  options: [
                                                                    {
                                                                      text: _vm.__(
                                                                        "yes"
                                                                      ),
                                                                      value: 1,
                                                                    },
                                                                    {
                                                                      text: _vm.__(
                                                                        "no"
                                                                      ),
                                                                      value: 0,
                                                                    },
                                                                  ],
                                                                  buttons: "",
                                                                  "button-variant":
                                                                    "outline-primary",
                                                                  required: "",
                                                                },
                                                                model: {
                                                                  value:
                                                                    _vm.require_products_approval,
                                                                  callback:
                                                                    function (
                                                                      $$v
                                                                    ) {
                                                                      _vm.require_products_approval =
                                                                        $$v
                                                                    },
                                                                  expression:
                                                                    "require_products_approval",
                                                                },
                                                              }
                                                            ),
                                                          ],
                                                          1
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _vm.store_settings
                                                      .self_pickup_mode == 1
                                                      ? _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group col-md-3",
                                                          },
                                                          [
                                                            _c(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "form-group",
                                                              },
                                                              [
                                                                _c(
                                                                  "label",
                                                                  {
                                                                    staticClass:
                                                                      "control-label",
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      " " +
                                                                        _vm._s(
                                                                          _vm.__(
                                                                            "door_step_mode"
                                                                          )
                                                                        )
                                                                    ),
                                                                  ]
                                                                ),
                                                                _c("br"),
                                                                _vm._v(" "),
                                                                _c(
                                                                  "b-form-radio-group",
                                                                  {
                                                                    attrs: {
                                                                      options: [
                                                                        {
                                                                          text: _vm.__(
                                                                            "yes"
                                                                          ),
                                                                          value: 1,
                                                                        },
                                                                        {
                                                                          text: _vm.__(
                                                                            "no"
                                                                          ),
                                                                          value: 0,
                                                                        },
                                                                      ],
                                                                      buttons:
                                                                        "",
                                                                      "button-variant":
                                                                        "outline-primary",
                                                                      required:
                                                                        "",
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        _vm.door_step_mode,
                                                                      callback:
                                                                        function (
                                                                          $$v
                                                                        ) {
                                                                          _vm.door_step_mode =
                                                                            $$v
                                                                        },
                                                                      expression:
                                                                        "door_step_mode",
                                                                    },
                                                                  }
                                                                ),
                                                              ],
                                                              1
                                                            ),
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                    _vm._v(" "),
                                                    _vm.store_settings
                                                      .self_pickup_mode == 1
                                                      ? _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group col-md-3",
                                                          },
                                                          [
                                                            _c(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "form-group",
                                                              },
                                                              [
                                                                _c(
                                                                  "label",
                                                                  {
                                                                    staticClass:
                                                                      "control-label",
                                                                  },
                                                                  [
                                                                    _vm._v(
                                                                      " " +
                                                                        _vm._s(
                                                                          _vm.__(
                                                                            "self_pickup_mode"
                                                                          )
                                                                        )
                                                                    ),
                                                                  ]
                                                                ),
                                                                _c("br"),
                                                                _vm._v(" "),
                                                                _c(
                                                                  "b-form-radio-group",
                                                                  {
                                                                    attrs: {
                                                                      options: [
                                                                        {
                                                                          text: _vm.__(
                                                                            "yes"
                                                                          ),
                                                                          value: 1,
                                                                        },
                                                                        {
                                                                          text: _vm.__(
                                                                            "no"
                                                                          ),
                                                                          value: 0,
                                                                        },
                                                                      ],
                                                                      buttons:
                                                                        "",
                                                                      "button-variant":
                                                                        "outline-primary",
                                                                      required:
                                                                        "",
                                                                    },
                                                                    model: {
                                                                      value:
                                                                        _vm.self_pickup_mode,
                                                                      callback:
                                                                        function (
                                                                          $$v
                                                                        ) {
                                                                          _vm.self_pickup_mode =
                                                                            $$v
                                                                        },
                                                                      expression:
                                                                        "self_pickup_mode",
                                                                    },
                                                                  }
                                                                ),
                                                              ],
                                                              1
                                                            ),
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                  ]
                                                ),
                                                _vm._v(" "),
                                                _vm.store_settings
                                                  .self_pickup_mode == 1 &&
                                                _vm.self_pickup_mode == 1
                                                  ? _c(
                                                      "div",
                                                      {
                                                        staticClass: "row mt-4",
                                                      },
                                                      [
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "col-12",
                                                          },
                                                          [
                                                            _c(
                                                              "h5",
                                                              {
                                                                staticClass:
                                                                  "text-primary",
                                                              },
                                                              [
                                                                _vm._v(
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "self_pickup_configuration"
                                                                    )
                                                                  )
                                                                ),
                                                              ]
                                                            ),
                                                          ]
                                                        ),
                                                        _vm._v(" "),
                                                        _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "form-group col-md-12",
                                                          },
                                                          [
                                                            _c(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "row",
                                                              },
                                                              [
                                                                _c(
                                                                  "div",
                                                                  {
                                                                    staticClass:
                                                                      "col-md-6",
                                                                  },
                                                                  [
                                                                    _c(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "form-group",
                                                                      },
                                                                      [
                                                                        _c(
                                                                          "div",
                                                                          {
                                                                            staticStyle:
                                                                              {
                                                                                position:
                                                                                  "relative",
                                                                                overflow:
                                                                                  "hidden",
                                                                              },
                                                                            attrs:
                                                                              {
                                                                                id: "pickup_map",
                                                                              },
                                                                          },
                                                                          [
                                                                            _c(
                                                                              "GmapMap",
                                                                              {
                                                                                ref: "pickupMapRef",
                                                                                refInFor: true,
                                                                                staticStyle:
                                                                                  {
                                                                                    width:
                                                                                      "100%",
                                                                                    height:
                                                                                      "400px",
                                                                                    "margin-top":
                                                                                      "5px",
                                                                                  },
                                                                                attrs:
                                                                                  {
                                                                                    zoom: 13,
                                                                                    center:
                                                                                      _vm.pickupCenter,
                                                                                    mapTypeControl: true,
                                                                                  },
                                                                              },
                                                                              [
                                                                                _vm._l(
                                                                                  _vm.pickupMarkers,
                                                                                  function (
                                                                                    m,
                                                                                    index
                                                                                  ) {
                                                                                    return _c(
                                                                                      "GmapMarker",
                                                                                      {
                                                                                        key: index,
                                                                                        attrs:
                                                                                          {
                                                                                            position:
                                                                                              _vm.google &&
                                                                                              m.position,
                                                                                            clickable: true,
                                                                                            draggable: true,
                                                                                          },
                                                                                        on: {
                                                                                          click:
                                                                                            function (
                                                                                              $event
                                                                                            ) {
                                                                                              _vm.pickupCenter =
                                                                                                m.position
                                                                                            },
                                                                                          dragend:
                                                                                            _vm.onPickupMarkerDragEnd,
                                                                                        },
                                                                                      }
                                                                                    )
                                                                                  }
                                                                                ),
                                                                                _vm._v(
                                                                                  " "
                                                                                ),
                                                                                _c(
                                                                                  "gmap-info-window",
                                                                                  {
                                                                                    attrs:
                                                                                      {
                                                                                        options:
                                                                                          {
                                                                                            maxWidth: 300,
                                                                                            pixelOffset:
                                                                                              {
                                                                                                width: 0,
                                                                                                height:
                                                                                                  -35,
                                                                                              },
                                                                                          },
                                                                                        position:
                                                                                          _vm
                                                                                            .pickupInfoWindow
                                                                                            .position,
                                                                                        opened:
                                                                                          _vm
                                                                                            .pickupInfoWindow
                                                                                            .open,
                                                                                      },
                                                                                    on: {
                                                                                      closeclick:
                                                                                        function (
                                                                                          $event
                                                                                        ) {
                                                                                          _vm.pickupInfoWindow.open = false
                                                                                        },
                                                                                    },
                                                                                  },
                                                                                  [
                                                                                    _c(
                                                                                      "div",
                                                                                      {
                                                                                        domProps:
                                                                                          {
                                                                                            innerHTML:
                                                                                              _vm._s(
                                                                                                _vm
                                                                                                  .pickupInfoWindow
                                                                                                  .template
                                                                                              ),
                                                                                          },
                                                                                      }
                                                                                    ),
                                                                                  ]
                                                                                ),
                                                                              ],
                                                                              2
                                                                            ),
                                                                          ],
                                                                          1
                                                                        ),
                                                                      ]
                                                                    ),
                                                                  ]
                                                                ),
                                                                _vm._v(" "),
                                                                _c(
                                                                  "div",
                                                                  {
                                                                    staticClass:
                                                                      "col-md-6",
                                                                  },
                                                                  [
                                                                    _c(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "form-group",
                                                                      },
                                                                      [
                                                                        _c(
                                                                          "label",
                                                                          {
                                                                            attrs:
                                                                              {
                                                                                for: "pickup_city_name",
                                                                              },
                                                                          },
                                                                          [
                                                                            _vm._v(
                                                                              _vm._s(
                                                                                _vm.__(
                                                                                  "search_location"
                                                                                )
                                                                              )
                                                                            ),
                                                                          ]
                                                                        ),
                                                                        _vm._v(
                                                                          " "
                                                                        ),
                                                                        _c(
                                                                          "GmapAutocomplete",
                                                                          {
                                                                            staticClass:
                                                                              "form-control",
                                                                            attrs:
                                                                              {
                                                                                type: "search",
                                                                                placeholder:
                                                                                  _vm.__(
                                                                                    "search_pickup_location_on_map"
                                                                                  ),
                                                                                options:
                                                                                  {
                                                                                    fields:
                                                                                      [
                                                                                        "address_components",
                                                                                        "formatted_address",
                                                                                        "geometry",
                                                                                        "name",
                                                                                        "place_id",
                                                                                        "plus_code",
                                                                                        "types",
                                                                                      ],
                                                                                    strictBounds: false,
                                                                                  },
                                                                                id: "pickup_city_name",
                                                                              },
                                                                            on: {
                                                                              place_changed:
                                                                                _vm.setPickupPlace,
                                                                            },
                                                                          }
                                                                        ),
                                                                        _vm._v(
                                                                          " "
                                                                        ),
                                                                        _c(
                                                                          "span",
                                                                          {
                                                                            staticClass:
                                                                              "text text-primary",
                                                                          },
                                                                          [
                                                                            _vm._v(
                                                                              _vm._s(
                                                                                _vm.__(
                                                                                  "search_your_pickup_location_and_to_find_coordinates"
                                                                                )
                                                                              )
                                                                            ),
                                                                          ]
                                                                        ),
                                                                      ],
                                                                      1
                                                                    ),
                                                                    _vm._v(" "),
                                                                    _c(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "form-group",
                                                                      },
                                                                      [
                                                                        _c(
                                                                          "label",
                                                                          [
                                                                            _vm._v(
                                                                              _vm._s(
                                                                                _vm.__(
                                                                                  "pickup_store_address"
                                                                                )
                                                                              ) +
                                                                                " "
                                                                            ),
                                                                            _c(
                                                                              "i",
                                                                              {
                                                                                staticClass:
                                                                                  "text-danger",
                                                                              },
                                                                              [
                                                                                _vm._v(
                                                                                  "*"
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ]
                                                                        ),
                                                                        _vm._v(
                                                                          " "
                                                                        ),
                                                                        _c(
                                                                          "textarea",
                                                                          {
                                                                            directives:
                                                                              [
                                                                                {
                                                                                  name: "model",
                                                                                  rawName:
                                                                                    "v-model",
                                                                                  value:
                                                                                    _vm.pickup_store_address,
                                                                                  expression:
                                                                                    "pickup_store_address",
                                                                                },
                                                                              ],
                                                                            staticClass:
                                                                              "form-control",
                                                                            attrs:
                                                                              {
                                                                                rows: "2",
                                                                                placeholder:
                                                                                  _vm.__(
                                                                                    "pickup_store_address"
                                                                                  ),
                                                                              },
                                                                            domProps:
                                                                              {
                                                                                value:
                                                                                  _vm.pickup_store_address,
                                                                              },
                                                                            on: {
                                                                              input:
                                                                                function (
                                                                                  $event
                                                                                ) {
                                                                                  if (
                                                                                    $event
                                                                                      .target
                                                                                      .composing
                                                                                  ) {
                                                                                    return
                                                                                  }
                                                                                  _vm.pickup_store_address =
                                                                                    $event.target.value
                                                                                },
                                                                            },
                                                                          }
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    _vm._v(" "),
                                                                    _c(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "form-group",
                                                                      },
                                                                      [
                                                                        _c(
                                                                          "label",
                                                                          {
                                                                            attrs:
                                                                              {
                                                                                for: "pickup_latitude",
                                                                              },
                                                                          },
                                                                          [
                                                                            _vm._v(
                                                                              _vm._s(
                                                                                _vm.__(
                                                                                  "latitude"
                                                                                )
                                                                              ) +
                                                                                " "
                                                                            ),
                                                                            _c(
                                                                              "span",
                                                                              {
                                                                                staticClass:
                                                                                  "text-danger text-sm",
                                                                              },
                                                                              [
                                                                                _vm._v(
                                                                                  "*"
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ]
                                                                        ),
                                                                        _vm._v(
                                                                          " "
                                                                        ),
                                                                        _c(
                                                                          "input",
                                                                          {
                                                                            directives:
                                                                              [
                                                                                {
                                                                                  name: "model",
                                                                                  rawName:
                                                                                    "v-model",
                                                                                  value:
                                                                                    _vm.pickup_latitude,
                                                                                  expression:
                                                                                    "pickup_latitude",
                                                                                },
                                                                              ],
                                                                            staticClass:
                                                                              "form-control",
                                                                            attrs:
                                                                              {
                                                                                type: "text",
                                                                                name: "pickup_latitude",
                                                                                id: "pickup_latitude",
                                                                                placeholder:
                                                                                  _vm.__(
                                                                                    "latitude"
                                                                                  ),
                                                                                required:
                                                                                  "",
                                                                                readonly:
                                                                                  "",
                                                                              },
                                                                            domProps:
                                                                              {
                                                                                value:
                                                                                  _vm.pickup_latitude,
                                                                              },
                                                                            on: {
                                                                              input:
                                                                                function (
                                                                                  $event
                                                                                ) {
                                                                                  if (
                                                                                    $event
                                                                                      .target
                                                                                      .composing
                                                                                  ) {
                                                                                    return
                                                                                  }
                                                                                  _vm.pickup_latitude =
                                                                                    $event.target.value
                                                                                },
                                                                            },
                                                                          }
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    _vm._v(" "),
                                                                    _c(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "form-group",
                                                                      },
                                                                      [
                                                                        _c(
                                                                          "label",
                                                                          {
                                                                            attrs:
                                                                              {
                                                                                for: "pickup_longitude",
                                                                              },
                                                                          },
                                                                          [
                                                                            _vm._v(
                                                                              _vm._s(
                                                                                _vm.__(
                                                                                  "longitude"
                                                                                )
                                                                              )
                                                                            ),
                                                                            _c(
                                                                              "span",
                                                                              {
                                                                                staticClass:
                                                                                  "text-danger text-sm",
                                                                              },
                                                                              [
                                                                                _vm._v(
                                                                                  "*"
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ]
                                                                        ),
                                                                        _vm._v(
                                                                          " "
                                                                        ),
                                                                        _c(
                                                                          "input",
                                                                          {
                                                                            directives:
                                                                              [
                                                                                {
                                                                                  name: "model",
                                                                                  rawName:
                                                                                    "v-model",
                                                                                  value:
                                                                                    _vm.pickup_longitude,
                                                                                  expression:
                                                                                    "pickup_longitude",
                                                                                },
                                                                              ],
                                                                            staticClass:
                                                                              "form-control",
                                                                            attrs:
                                                                              {
                                                                                type: "text",
                                                                                name: "pickup_longitude",
                                                                                id: "pickup_longitude",
                                                                                placeholder:
                                                                                  _vm.__(
                                                                                    "longitude"
                                                                                  ),
                                                                                required:
                                                                                  "",
                                                                                readonly:
                                                                                  "",
                                                                              },
                                                                            domProps:
                                                                              {
                                                                                value:
                                                                                  _vm.pickup_longitude,
                                                                              },
                                                                            on: {
                                                                              input:
                                                                                function (
                                                                                  $event
                                                                                ) {
                                                                                  if (
                                                                                    $event
                                                                                      .target
                                                                                      .composing
                                                                                  ) {
                                                                                    return
                                                                                  }
                                                                                  _vm.pickup_longitude =
                                                                                    $event.target.value
                                                                                },
                                                                            },
                                                                          }
                                                                        ),
                                                                      ]
                                                                    ),
                                                                    _vm._v(" "),
                                                                    _c(
                                                                      "div",
                                                                      {
                                                                        staticClass:
                                                                          "form-group",
                                                                      },
                                                                      [
                                                                        _c(
                                                                          "label",
                                                                          [
                                                                            _vm._v(
                                                                              _vm._s(
                                                                                _vm.__(
                                                                                  "store_timings"
                                                                                )
                                                                              ) +
                                                                                " "
                                                                            ),
                                                                            _c(
                                                                              "i",
                                                                              {
                                                                                staticClass:
                                                                                  "text-danger",
                                                                              },
                                                                              [
                                                                                _vm._v(
                                                                                  "*"
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ]
                                                                        ),
                                                                        _vm._v(
                                                                          " "
                                                                        ),
                                                                        _c(
                                                                          "div",
                                                                          {
                                                                            staticClass:
                                                                              "row",
                                                                          },
                                                                          [
                                                                            _c(
                                                                              "div",
                                                                              {
                                                                                staticClass:
                                                                                  "col-md-6",
                                                                              },
                                                                              [
                                                                                _c(
                                                                                  "label",
                                                                                  {
                                                                                    staticClass:
                                                                                      "form-label",
                                                                                  },
                                                                                  [
                                                                                    _vm._v(
                                                                                      _vm._s(
                                                                                        _vm.__(
                                                                                          "opening_time"
                                                                                        )
                                                                                      )
                                                                                    ),
                                                                                  ]
                                                                                ),
                                                                                _vm._v(
                                                                                  " "
                                                                                ),
                                                                                _c(
                                                                                  "input",
                                                                                  {
                                                                                    directives:
                                                                                      [
                                                                                        {
                                                                                          name: "model",
                                                                                          rawName:
                                                                                            "v-model",
                                                                                          value:
                                                                                            _vm
                                                                                              .storeTimings
                                                                                              .opening_time,
                                                                                          expression:
                                                                                            "storeTimings.opening_time",
                                                                                        },
                                                                                      ],
                                                                                    staticClass:
                                                                                      "form-control",
                                                                                    attrs:
                                                                                      {
                                                                                        type: "time",
                                                                                        required:
                                                                                          "",
                                                                                      },
                                                                                    domProps:
                                                                                      {
                                                                                        value:
                                                                                          _vm
                                                                                            .storeTimings
                                                                                            .opening_time,
                                                                                      },
                                                                                    on: {
                                                                                      input:
                                                                                        function (
                                                                                          $event
                                                                                        ) {
                                                                                          if (
                                                                                            $event
                                                                                              .target
                                                                                              .composing
                                                                                          ) {
                                                                                            return
                                                                                          }
                                                                                          _vm.$set(
                                                                                            _vm.storeTimings,
                                                                                            "opening_time",
                                                                                            $event
                                                                                              .target
                                                                                              .value
                                                                                          )
                                                                                        },
                                                                                    },
                                                                                  }
                                                                                ),
                                                                              ]
                                                                            ),
                                                                            _vm._v(
                                                                              " "
                                                                            ),
                                                                            _c(
                                                                              "div",
                                                                              {
                                                                                staticClass:
                                                                                  "col-md-6",
                                                                              },
                                                                              [
                                                                                _c(
                                                                                  "label",
                                                                                  {
                                                                                    staticClass:
                                                                                      "form-label",
                                                                                  },
                                                                                  [
                                                                                    _vm._v(
                                                                                      _vm._s(
                                                                                        _vm.__(
                                                                                          "closing_time"
                                                                                        )
                                                                                      )
                                                                                    ),
                                                                                  ]
                                                                                ),
                                                                                _vm._v(
                                                                                  " "
                                                                                ),
                                                                                _c(
                                                                                  "input",
                                                                                  {
                                                                                    directives:
                                                                                      [
                                                                                        {
                                                                                          name: "model",
                                                                                          rawName:
                                                                                            "v-model",
                                                                                          value:
                                                                                            _vm
                                                                                              .storeTimings
                                                                                              .closing_time,
                                                                                          expression:
                                                                                            "storeTimings.closing_time",
                                                                                        },
                                                                                      ],
                                                                                    staticClass:
                                                                                      "form-control",
                                                                                    attrs:
                                                                                      {
                                                                                        type: "time",
                                                                                        required:
                                                                                          "",
                                                                                      },
                                                                                    domProps:
                                                                                      {
                                                                                        value:
                                                                                          _vm
                                                                                            .storeTimings
                                                                                            .closing_time,
                                                                                      },
                                                                                    on: {
                                                                                      input:
                                                                                        function (
                                                                                          $event
                                                                                        ) {
                                                                                          if (
                                                                                            $event
                                                                                              .target
                                                                                              .composing
                                                                                          ) {
                                                                                            return
                                                                                          }
                                                                                          _vm.$set(
                                                                                            _vm.storeTimings,
                                                                                            "closing_time",
                                                                                            $event
                                                                                              .target
                                                                                              .value
                                                                                          )
                                                                                        },
                                                                                    },
                                                                                  }
                                                                                ),
                                                                              ]
                                                                            ),
                                                                          ]
                                                                        ),
                                                                      ]
                                                                    ),
                                                                  ]
                                                                ),
                                                              ]
                                                            ),
                                                          ]
                                                        ),
                                                      ]
                                                    )
                                                  : _vm._e(),
                                              ]
                                            ),
                                          ]),
                                        ]
                                      : _vm._e(),
                                  ],
                                  2
                                )
                              }),
                              1
                            ),
                          ],
                          1
                        )
                      : _vm.isLoadingLanguages
                      ? _c(
                          "div",
                          { staticClass: "text-center p-3 mb-3" },
                          [
                            _c("b-spinner", {
                              attrs: { label: "Loading languages..." },
                            }),
                          ],
                          1
                        )
                      : _vm._e(),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "card-footer" },
                    [
                      _vm.id
                        ? [
                            _c(
                              "b-button",
                              {
                                attrs: {
                                  type: "submit",
                                  variant: "primary",
                                  disabled: _vm.isLoading,
                                },
                              },
                              [
                                _vm._v(
                                  " " +
                                    _vm._s(_vm.__("update")) +
                                    "\n                                    "
                                ),
                                _vm.isLoading
                                  ? _c("b-spinner", {
                                      attrs: { small: "", label: "Spinning" },
                                    })
                                  : _vm._e(),
                              ],
                              1
                            ),
                          ]
                        : [
                            _c(
                              "b-button",
                              {
                                attrs: {
                                  type: "submit",
                                  variant: "primary",
                                  disabled: _vm.isLoading,
                                },
                              },
                              [
                                _vm._v(
                                  " " +
                                    _vm._s(_vm.__("save")) +
                                    "\n                                    "
                                ),
                                _vm.isLoading
                                  ? _c("b-spinner", {
                                      attrs: { small: "", label: "Spinning" },
                                    })
                                  : _vm._e(),
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c(
                              "button",
                              {
                                staticClass: "btn btn-danger",
                                attrs: { type: "button" },
                                on: {
                                  click: function ($event) {
                                    return _vm.clearForm()
                                  },
                                },
                              },
                              [
                                _vm._v(
                                  "\n                                    " +
                                    _vm._s(_vm.__("clear"))
                                ),
                              ]
                            ),
                          ],
                    ],
                    2
                  ),
                ]),
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
            size: "lg",
            title: "How commission (Admin commission) will get credited?",
          },
          scopedSlots: _vm._u([
            {
              key: "modal-footer",
              fn: function () {
                return [
                  _c(
                    "b-button",
                    {
                      staticClass: "float-right",
                      attrs: { variant: "secondary", size: "sm" },
                      on: {
                        click: function ($event) {
                          _vm.commissionRule = false
                        },
                      },
                    },
                    [_vm._v(_vm._s(_vm.__("ok")) + "\n            ")]
                  ),
                ]
              },
              proxy: true,
            },
          ]),
          model: {
            value: _vm.commissionRule,
            callback: function ($$v) {
              _vm.commissionRule = $$v
            },
            expression: "commissionRule",
          },
        },
        [
          _c("b-container", { attrs: { fluid: "" } }, [
            _c("ol", [
              _c("li", [
                _vm._v(
                  "\n                    Formula for commision (Admin commission) is "
                ),
                _c("b", [
                  _vm._v(
                    "Sub total (Excluding delivery charge) / 100 *\n                        commission percentage"
                  ),
                ]),
              ]),
              _vm._v(" "),
              _c("li", [
                _vm._v(
                  "\n                    For example sub total is 1378 and commission is 20% then 1378 / 100 X 20 = 275.6 so 1378\n                    - 275.6 = 1102.4 will get credited into seller's wallet.\n                "
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _vm._v(
                  "\n                    275.6 is commission for Admin and 1102.4 is earning of seller .\n                "
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _vm._v(
                  "\n                    If Order status is delivered then only seller will get earning.\n                "
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _vm._v(
                  "\n                    Ex - 1. Order placed on 11-Aug-21 and product return days are set to 0 so 11-Aug + 0 days =\n                    11-Aug seller earning will get credited when admin is logged in admin panel.\n                "
                ),
              ]),
              _vm._v(" "),
              _c("li", [
                _vm._v(
                  "\n                    Ex - 2. Order placed on 11-Aug-21 and product return days are set to 7 so 11-Aug + 7 days =\n                    18-Aug seller earning will get credited when admin is logged in admin panel.\n                "
                ),
              ]),
            ]),
          ]),
        ],
        1
      ),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-multiselect/dist/vue-multiselect.min.js":
/*!******************************************************************!*\
  !*** ./node_modules/vue-multiselect/dist/vue-multiselect.min.js ***!
  \******************************************************************/
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=60)}([function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){var i=n(49)("wks"),r=n(30),o=n(0).Symbol,s="function"==typeof o;(t.exports=function(t){return i[t]||(i[t]=s&&o[t]||(s?o:r)("Symbol."+t))}).store=i},function(t,e,n){var i=n(5);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){var i=n(0),r=n(10),o=n(8),s=n(6),u=n(11),a=function(t,e,n){var l,c,f,p,h=t&a.F,d=t&a.G,v=t&a.S,g=t&a.P,y=t&a.B,m=d?i:v?i[e]||(i[e]={}):(i[e]||{}).prototype,b=d?r:r[e]||(r[e]={}),_=b.prototype||(b.prototype={});d&&(n=e);for(l in n)c=!h&&m&&void 0!==m[l],f=(c?m:n)[l],p=y&&c?u(f,i):g&&"function"==typeof f?u(Function.call,f):f,m&&s(m,l,f,t&a.U),b[l]!=f&&o(b,l,p),g&&_[l]!=f&&(_[l]=f)};i.core=r,a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,e,n){t.exports=!n(7)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var i=n(0),r=n(8),o=n(12),s=n(30)("src"),u=Function.toString,a=(""+u).split("toString");n(10).inspectSource=function(t){return u.call(t)},(t.exports=function(t,e,n,u){var l="function"==typeof n;l&&(o(n,"name")||r(n,"name",e)),t[e]!==n&&(l&&(o(n,s)||r(n,s,t[e]?""+t[e]:a.join(String(e)))),t===i?t[e]=n:u?t[e]?t[e]=n:r(t,e,n):(delete t[e],r(t,e,n)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[s]||u.call(this)})},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var i=n(13),r=n(25);t.exports=n(4)?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){var n=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n)},function(t,e,n){var i=n(14);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var i=n(2),r=n(41),o=n(29),s=Object.defineProperty;e.f=n(4)?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){t.exports={}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){"use strict";var i=n(7);t.exports=function(t,e){return!!t&&i(function(){e?t.call(null,function(){},1):t.call(null)})}},function(t,e,n){var i=n(23),r=n(16);t.exports=function(t){return i(r(t))}},function(t,e,n){var i=n(53),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0}},function(t,e,n){var i=n(11),r=n(23),o=n(28),s=n(19),u=n(64);t.exports=function(t,e){var n=1==t,a=2==t,l=3==t,c=4==t,f=6==t,p=5==t||f,h=e||u;return function(e,u,d){for(var v,g,y=o(e),m=r(y),b=i(u,d,3),_=s(m.length),x=0,w=n?h(e,_):a?h(e,0):void 0;_>x;x++)if((p||x in m)&&(v=m[x],g=b(v,x,y),t))if(n)w[x]=g;else if(g)switch(t){case 3:return!0;case 5:return v;case 6:return x;case 2:w.push(v)}else if(c)return!1;return f?-1:l||c?c:w}}},function(t,e,n){var i=n(5),r=n(0).document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var i=n(9);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==i(t)?t.split(""):Object(t)}},function(t,e){t.exports=!1},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e,n){var i=n(13).f,r=n(12),o=n(1)("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,o)&&i(t,o,{configurable:!0,value:e})}},function(t,e,n){var i=n(49)("keys"),r=n(30);t.exports=function(t){return i[t]||(i[t]=r(t))}},function(t,e,n){var i=n(16);t.exports=function(t){return Object(i(t))}},function(t,e,n){var i=n(5);t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e){var n=0,i=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))}},function(t,e,n){"use strict";var i=n(0),r=n(12),o=n(9),s=n(67),u=n(29),a=n(7),l=n(77).f,c=n(45).f,f=n(13).f,p=n(51).trim,h=i.Number,d=h,v=h.prototype,g="Number"==o(n(44)(v)),y="trim"in String.prototype,m=function(t){var e=u(t,!1);if("string"==typeof e&&e.length>2){e=y?e.trim():p(e,3);var n,i,r,o=e.charCodeAt(0);if(43===o||45===o){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===o){switch(e.charCodeAt(1)){case 66:case 98:i=2,r=49;break;case 79:case 111:i=8,r=55;break;default:return+e}for(var s,a=e.slice(2),l=0,c=a.length;l<c;l++)if((s=a.charCodeAt(l))<48||s>r)return NaN;return parseInt(a,i)}}return+e};if(!h(" 0o1")||!h("0b1")||h("+0x1")){h=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof h&&(g?a(function(){v.valueOf.call(n)}):"Number"!=o(n))?s(new d(m(e)),n,h):m(e)};for(var b,_=n(4)?l(d):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),x=0;_.length>x;x++)r(d,b=_[x])&&!r(h,b)&&f(h,b,c(d,b));h.prototype=v,v.constructor=h,n(6)(i,"Number",h)}},function(t,e,n){"use strict";function i(t){return 0!==t&&(!(!Array.isArray(t)||0!==t.length)||!t)}function r(t){return function(){return!t.apply(void 0,arguments)}}function o(t,e){return void 0===t&&(t="undefined"),null===t&&(t="null"),!1===t&&(t="false"),-1!==t.toString().toLowerCase().indexOf(e.trim())}function s(t,e,n,i){return t.filter(function(t){return o(i(t,n),e)})}function u(t){return t.filter(function(t){return!t.$isLabel})}function a(t,e){return function(n){return n.reduce(function(n,i){return i[t]&&i[t].length?(n.push({$groupLabel:i[e],$isLabel:!0}),n.concat(i[t])):n},[])}}function l(t,e,i,r,o){return function(u){return u.map(function(u){var a;if(!u[i])return console.warn("Options passed to vue-multiselect do not contain groups, despite the config."),[];var l=s(u[i],t,e,o);return l.length?(a={},n.i(d.a)(a,r,u[r]),n.i(d.a)(a,i,l),a):[]})}}var c=n(59),f=n(54),p=(n.n(f),n(95)),h=(n.n(p),n(31)),d=(n.n(h),n(58)),v=n(91),g=(n.n(v),n(98)),y=(n.n(g),n(92)),m=(n.n(y),n(88)),b=(n.n(m),n(97)),_=(n.n(b),n(89)),x=(n.n(_),n(96)),w=(n.n(x),n(93)),S=(n.n(w),n(90)),O=(n.n(S),function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(t){return e.reduce(function(t,e){return e(t)},t)}});e.a={data:function(){return{search:"",isOpen:!1,preferredOpenDirection:"below",optimizedHeight:this.maxHeight}},props:{internalSearch:{type:Boolean,default:!0},options:{type:Array,required:!0},multiple:{type:Boolean,default:!1},value:{type:null,default:function(){return[]}},trackBy:{type:String},label:{type:String},searchable:{type:Boolean,default:!0},clearOnSelect:{type:Boolean,default:!0},hideSelected:{type:Boolean,default:!1},placeholder:{type:String,default:"Select option"},allowEmpty:{type:Boolean,default:!0},resetAfter:{type:Boolean,default:!1},closeOnSelect:{type:Boolean,default:!0},customLabel:{type:Function,default:function(t,e){return i(t)?"":e?t[e]:t}},taggable:{type:Boolean,default:!1},tagPlaceholder:{type:String,default:"Press enter to create a tag"},tagPosition:{type:String,default:"top"},max:{type:[Number,Boolean],default:!1},id:{default:null},optionsLimit:{type:Number,default:1e3},groupValues:{type:String},groupLabel:{type:String},groupSelect:{type:Boolean,default:!1},blockKeys:{type:Array,default:function(){return[]}},preserveSearch:{type:Boolean,default:!1},preselectFirst:{type:Boolean,default:!1}},mounted:function(){!this.multiple&&this.max&&console.warn("[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false."),this.preselectFirst&&!this.internalValue.length&&this.options.length&&this.select(this.filteredOptions[0])},computed:{internalValue:function(){return this.value||0===this.value?Array.isArray(this.value)?this.value:[this.value]:[]},filteredOptions:function(){var t=this.search||"",e=t.toLowerCase().trim(),n=this.options.concat();return n=this.internalSearch?this.groupValues?this.filterAndFlat(n,e,this.label):s(n,e,this.label,this.customLabel):this.groupValues?a(this.groupValues,this.groupLabel)(n):n,n=this.hideSelected?n.filter(r(this.isSelected)):n,this.taggable&&e.length&&!this.isExistingOption(e)&&("bottom"===this.tagPosition?n.push({isTag:!0,label:t}):n.unshift({isTag:!0,label:t})),n.slice(0,this.optionsLimit)},valueKeys:function(){var t=this;return this.trackBy?this.internalValue.map(function(e){return e[t.trackBy]}):this.internalValue},optionKeys:function(){var t=this;return(this.groupValues?this.flatAndStrip(this.options):this.options).map(function(e){return t.customLabel(e,t.label).toString().toLowerCase()})},currentOptionLabel:function(){return this.multiple?this.searchable?"":this.placeholder:this.internalValue.length?this.getOptionLabel(this.internalValue[0]):this.searchable?"":this.placeholder}},watch:{internalValue:function(){this.resetAfter&&this.internalValue.length&&(this.search="",this.$emit("input",this.multiple?[]:null))},search:function(){this.$emit("search-change",this.search,this.id)}},methods:{getValue:function(){return this.multiple?this.internalValue:0===this.internalValue.length?null:this.internalValue[0]},filterAndFlat:function(t,e,n){return O(l(e,n,this.groupValues,this.groupLabel,this.customLabel),a(this.groupValues,this.groupLabel))(t)},flatAndStrip:function(t){return O(a(this.groupValues,this.groupLabel),u)(t)},updateSearch:function(t){this.search=t},isExistingOption:function(t){return!!this.options&&this.optionKeys.indexOf(t)>-1},isSelected:function(t){var e=this.trackBy?t[this.trackBy]:t;return this.valueKeys.indexOf(e)>-1},isOptionDisabled:function(t){return!!t.$isDisabled},getOptionLabel:function(t){if(i(t))return"";if(t.isTag)return t.label;if(t.$isLabel)return t.$groupLabel;var e=this.customLabel(t,this.label);return i(e)?"":e},select:function(t,e){if(t.$isLabel&&this.groupSelect)return void this.selectGroup(t);if(!(-1!==this.blockKeys.indexOf(e)||this.disabled||t.$isDisabled||t.$isLabel)&&(!this.max||!this.multiple||this.internalValue.length!==this.max)&&("Tab"!==e||this.pointerDirty)){if(t.isTag)this.$emit("tag",t.label,this.id),this.search="",this.closeOnSelect&&!this.multiple&&this.deactivate();else{if(this.isSelected(t))return void("Tab"!==e&&this.removeElement(t));this.$emit("select",t,this.id),this.multiple?this.$emit("input",this.internalValue.concat([t]),this.id):this.$emit("input",t,this.id),this.clearOnSelect&&(this.search="")}this.closeOnSelect&&this.deactivate()}},selectGroup:function(t){var e=this,n=this.options.find(function(n){return n[e.groupLabel]===t.$groupLabel});if(n)if(this.wholeGroupSelected(n)){this.$emit("remove",n[this.groupValues],this.id);var i=this.internalValue.filter(function(t){return-1===n[e.groupValues].indexOf(t)});this.$emit("input",i,this.id)}else{var r=n[this.groupValues].filter(function(t){return!(e.isOptionDisabled(t)||e.isSelected(t))});this.$emit("select",r,this.id),this.$emit("input",this.internalValue.concat(r),this.id)}},wholeGroupSelected:function(t){var e=this;return t[this.groupValues].every(function(t){return e.isSelected(t)||e.isOptionDisabled(t)})},wholeGroupDisabled:function(t){return t[this.groupValues].every(this.isOptionDisabled)},removeElement:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!this.disabled&&!t.$isDisabled){if(!this.allowEmpty&&this.internalValue.length<=1)return void this.deactivate();var i="object"===n.i(c.a)(t)?this.valueKeys.indexOf(t[this.trackBy]):this.valueKeys.indexOf(t);if(this.$emit("remove",t,this.id),this.multiple){var r=this.internalValue.slice(0,i).concat(this.internalValue.slice(i+1));this.$emit("input",r,this.id)}else this.$emit("input",null,this.id);this.closeOnSelect&&e&&this.deactivate()}},removeLastElement:function(){-1===this.blockKeys.indexOf("Delete")&&0===this.search.length&&Array.isArray(this.internalValue)&&this.internalValue.length&&this.removeElement(this.internalValue[this.internalValue.length-1],!1)},activate:function(){var t=this;this.isOpen||this.disabled||(this.adjustPosition(),this.groupValues&&0===this.pointer&&this.filteredOptions.length&&(this.pointer=1),this.isOpen=!0,this.searchable?(this.preserveSearch||(this.search=""),this.$nextTick(function(){return t.$refs.search.focus()})):this.$el.focus(),this.$emit("open",this.id))},deactivate:function(){this.isOpen&&(this.isOpen=!1,this.searchable?this.$refs.search.blur():this.$el.blur(),this.preserveSearch||(this.search=""),this.$emit("close",this.getValue(),this.id))},toggle:function(){this.isOpen?this.deactivate():this.activate()},adjustPosition:function(){if("undefined"!=typeof window){var t=this.$el.getBoundingClientRect().top,e=window.innerHeight-this.$el.getBoundingClientRect().bottom;e>this.maxHeight||e>t||"below"===this.openDirection||"bottom"===this.openDirection?(this.preferredOpenDirection="below",this.optimizedHeight=Math.min(e-40,this.maxHeight)):(this.preferredOpenDirection="above",this.optimizedHeight=Math.min(t-40,this.maxHeight))}}}}},function(t,e,n){"use strict";var i=n(54),r=(n.n(i),n(31));n.n(r);e.a={data:function(){return{pointer:0,pointerDirty:!1}},props:{showPointer:{type:Boolean,default:!0},optionHeight:{type:Number,default:40}},computed:{pointerPosition:function(){return this.pointer*this.optionHeight},visibleElements:function(){return this.optimizedHeight/this.optionHeight}},watch:{filteredOptions:function(){this.pointerAdjust()},isOpen:function(){this.pointerDirty=!1}},methods:{optionHighlight:function(t,e){return{"multiselect__option--highlight":t===this.pointer&&this.showPointer,"multiselect__option--selected":this.isSelected(e)}},groupHighlight:function(t,e){var n=this;if(!this.groupSelect)return["multiselect__option--group","multiselect__option--disabled"];var i=this.options.find(function(t){return t[n.groupLabel]===e.$groupLabel});return i&&!this.wholeGroupDisabled(i)?["multiselect__option--group",{"multiselect__option--highlight":t===this.pointer&&this.showPointer},{"multiselect__option--group-selected":this.wholeGroupSelected(i)}]:"multiselect__option--disabled"},addPointerElement:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Enter",e=t.key;this.filteredOptions.length>0&&this.select(this.filteredOptions[this.pointer],e),this.pointerReset()},pointerForward:function(){this.pointer<this.filteredOptions.length-1&&(this.pointer++,this.$refs.list.scrollTop<=this.pointerPosition-(this.visibleElements-1)*this.optionHeight&&(this.$refs.list.scrollTop=this.pointerPosition-(this.visibleElements-1)*this.optionHeight),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward()),this.pointerDirty=!0},pointerBackward:function(){this.pointer>0?(this.pointer--,this.$refs.list.scrollTop>=this.pointerPosition&&(this.$refs.list.scrollTop=this.pointerPosition),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerBackward()):this.filteredOptions[this.pointer]&&this.filteredOptions[0].$isLabel&&!this.groupSelect&&this.pointerForward(),this.pointerDirty=!0},pointerReset:function(){this.closeOnSelect&&(this.pointer=0,this.$refs.list&&(this.$refs.list.scrollTop=0))},pointerAdjust:function(){this.pointer>=this.filteredOptions.length-1&&(this.pointer=this.filteredOptions.length?this.filteredOptions.length-1:0),this.filteredOptions.length>0&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward()},pointerSet:function(t){this.pointer=t,this.pointerDirty=!0}}}},function(t,e,n){"use strict";var i=n(36),r=n(74),o=n(15),s=n(18);t.exports=n(72)(Array,"Array",function(t,e){this._t=s(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,r(1)):"keys"==e?r(0,n):"values"==e?r(0,t[n]):r(0,[n,t[n]])},"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries")},function(t,e,n){"use strict";var i=n(31),r=(n.n(i),n(32)),o=n(33);e.a={name:"vue-multiselect",mixins:[r.a,o.a],props:{name:{type:String,default:""},selectLabel:{type:String,default:"Press enter to select"},selectGroupLabel:{type:String,default:"Press enter to select group"},selectedLabel:{type:String,default:"Selected"},deselectLabel:{type:String,default:"Press enter to remove"},deselectGroupLabel:{type:String,default:"Press enter to deselect group"},showLabels:{type:Boolean,default:!0},limit:{type:Number,default:99999},maxHeight:{type:Number,default:300},limitText:{type:Function,default:function(t){return"and ".concat(t," more")}},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},openDirection:{type:String,default:""},showNoOptions:{type:Boolean,default:!0},showNoResults:{type:Boolean,default:!0},tabindex:{type:Number,default:0}},computed:{isSingleLabelVisible:function(){return(this.singleValue||0===this.singleValue)&&(!this.isOpen||!this.searchable)&&!this.visibleValues.length},isPlaceholderVisible:function(){return!(this.internalValue.length||this.searchable&&this.isOpen)},visibleValues:function(){return this.multiple?this.internalValue.slice(0,this.limit):[]},singleValue:function(){return this.internalValue[0]},deselectLabelText:function(){return this.showLabels?this.deselectLabel:""},deselectGroupLabelText:function(){return this.showLabels?this.deselectGroupLabel:""},selectLabelText:function(){return this.showLabels?this.selectLabel:""},selectGroupLabelText:function(){return this.showLabels?this.selectGroupLabel:""},selectedLabelText:function(){return this.showLabels?this.selectedLabel:""},inputStyle:function(){if(this.searchable||this.multiple&&this.value&&this.value.length)return this.isOpen?{width:"100%"}:{width:"0",position:"absolute",padding:"0"}},contentStyle:function(){return this.options.length?{display:"inline-block"}:{display:"block"}},isAbove:function(){return"above"===this.openDirection||"top"===this.openDirection||"below"!==this.openDirection&&"bottom"!==this.openDirection&&"above"===this.preferredOpenDirection},showSearchInput:function(){return this.searchable&&(!this.hasSingleSelectedSlot||!this.visibleSingleValue&&0!==this.visibleSingleValue||this.isOpen)}}}},function(t,e,n){var i=n(1)("unscopables"),r=Array.prototype;void 0==r[i]&&n(8)(r,i,{}),t.exports=function(t){r[i][t]=!0}},function(t,e,n){var i=n(18),r=n(19),o=n(85);t.exports=function(t){return function(e,n,s){var u,a=i(e),l=r(a.length),c=o(s,l);if(t&&n!=n){for(;l>c;)if((u=a[c++])!=u)return!0}else for(;l>c;c++)if((t||c in a)&&a[c]===n)return t||c||0;return!t&&-1}}},function(t,e,n){var i=n(9),r=n(1)("toStringTag"),o="Arguments"==i(function(){return arguments}()),s=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=s(e=Object(t),r))?n:o?i(e):"Object"==(u=i(e))&&"function"==typeof e.callee?"Arguments":u}},function(t,e,n){"use strict";var i=n(2);t.exports=function(){var t=i(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},function(t,e,n){var i=n(0).document;t.exports=i&&i.documentElement},function(t,e,n){t.exports=!n(4)&&!n(7)(function(){return 7!=Object.defineProperty(n(21)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var i=n(9);t.exports=Array.isArray||function(t){return"Array"==i(t)}},function(t,e,n){"use strict";function i(t){var e,n;this.promise=new t(function(t,i){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=i}),this.resolve=r(e),this.reject=r(n)}var r=n(14);t.exports.f=function(t){return new i(t)}},function(t,e,n){var i=n(2),r=n(76),o=n(22),s=n(27)("IE_PROTO"),u=function(){},a=function(){var t,e=n(21)("iframe"),i=o.length;for(e.style.display="none",n(40).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;i--;)delete a.prototype[o[i]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(u.prototype=i(t),n=new u,u.prototype=null,n[s]=t):n=a(),void 0===e?n:r(n,e)}},function(t,e,n){var i=n(79),r=n(25),o=n(18),s=n(29),u=n(12),a=n(41),l=Object.getOwnPropertyDescriptor;e.f=n(4)?l:function(t,e){if(t=o(t),e=s(e,!0),a)try{return l(t,e)}catch(t){}if(u(t,e))return r(!i.f.call(t,e),t[e])}},function(t,e,n){var i=n(12),r=n(18),o=n(37)(!1),s=n(27)("IE_PROTO");t.exports=function(t,e){var n,u=r(t),a=0,l=[];for(n in u)n!=s&&i(u,n)&&l.push(n);for(;e.length>a;)i(u,n=e[a++])&&(~o(l,n)||l.push(n));return l}},function(t,e,n){var i=n(46),r=n(22);t.exports=Object.keys||function(t){return i(t,r)}},function(t,e,n){var i=n(2),r=n(5),o=n(43);t.exports=function(t,e){if(i(t),r(e)&&e.constructor===t)return e;var n=o.f(t);return(0,n.resolve)(e),n.promise}},function(t,e,n){var i=n(10),r=n(0),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:i.version,mode:n(24)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})},function(t,e,n){var i=n(2),r=n(14),o=n(1)("species");t.exports=function(t,e){var n,s=i(t).constructor;return void 0===s||void 0==(n=i(s)[o])?e:r(n)}},function(t,e,n){var i=n(3),r=n(16),o=n(7),s=n(84),u="["+s+"]",a="​",l=RegExp("^"+u+u+"*"),c=RegExp(u+u+"*$"),f=function(t,e,n){var r={},u=o(function(){return!!s[t]()||a[t]()!=a}),l=r[t]=u?e(p):s[t];n&&(r[n]=l),i(i.P+i.F*u,"String",r)},p=f.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(c,"")),t};t.exports=f},function(t,e,n){var i,r,o,s=n(11),u=n(68),a=n(40),l=n(21),c=n(0),f=c.process,p=c.setImmediate,h=c.clearImmediate,d=c.MessageChannel,v=c.Dispatch,g=0,y={},m=function(){var t=+this;if(y.hasOwnProperty(t)){var e=y[t];delete y[t],e()}},b=function(t){m.call(t.data)};p&&h||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return y[++g]=function(){u("function"==typeof t?t:Function(t),e)},i(g),g},h=function(t){delete y[t]},"process"==n(9)(f)?i=function(t){f.nextTick(s(m,t,1))}:v&&v.now?i=function(t){v.now(s(m,t,1))}:d?(r=new d,o=r.port2,r.port1.onmessage=b,i=s(o.postMessage,o,1)):c.addEventListener&&"function"==typeof postMessage&&!c.importScripts?(i=function(t){c.postMessage(t+"","*")},c.addEventListener("message",b,!1)):i="onreadystatechange"in l("script")?function(t){a.appendChild(l("script")).onreadystatechange=function(){a.removeChild(this),m.call(t)}}:function(t){setTimeout(s(m,t,1),0)}),t.exports={set:p,clear:h}},function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)}},function(t,e,n){"use strict";var i=n(3),r=n(20)(5),o=!0;"find"in[]&&Array(1).find(function(){o=!1}),i(i.P+i.F*o,"Array",{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n(36)("find")},function(t,e,n){"use strict";var i,r,o,s,u=n(24),a=n(0),l=n(11),c=n(38),f=n(3),p=n(5),h=n(14),d=n(61),v=n(66),g=n(50),y=n(52).set,m=n(75)(),b=n(43),_=n(80),x=n(86),w=n(48),S=a.TypeError,O=a.process,L=O&&O.versions,k=L&&L.v8||"",P=a.Promise,T="process"==c(O),V=function(){},E=r=b.f,A=!!function(){try{var t=P.resolve(1),e=(t.constructor={})[n(1)("species")]=function(t){t(V,V)};return(T||"function"==typeof PromiseRejectionEvent)&&t.then(V)instanceof e&&0!==k.indexOf("6.6")&&-1===x.indexOf("Chrome/66")}catch(t){}}(),C=function(t){var e;return!(!p(t)||"function"!=typeof(e=t.then))&&e},D=function(t,e){if(!t._n){t._n=!0;var n=t._c;m(function(){for(var i=t._v,r=1==t._s,o=0;n.length>o;)!function(e){var n,o,s,u=r?e.ok:e.fail,a=e.resolve,l=e.reject,c=e.domain;try{u?(r||(2==t._h&&$(t),t._h=1),!0===u?n=i:(c&&c.enter(),n=u(i),c&&(c.exit(),s=!0)),n===e.promise?l(S("Promise-chain cycle")):(o=C(n))?o.call(n,a,l):a(n)):l(i)}catch(t){c&&!s&&c.exit(),l(t)}}(n[o++]);t._c=[],t._n=!1,e&&!t._h&&j(t)})}},j=function(t){y.call(a,function(){var e,n,i,r=t._v,o=N(t);if(o&&(e=_(function(){T?O.emit("unhandledRejection",r,t):(n=a.onunhandledrejection)?n({promise:t,reason:r}):(i=a.console)&&i.error&&i.error("Unhandled promise rejection",r)}),t._h=T||N(t)?2:1),t._a=void 0,o&&e.e)throw e.v})},N=function(t){return 1!==t._h&&0===(t._a||t._c).length},$=function(t){y.call(a,function(){var e;T?O.emit("rejectionHandled",t):(e=a.onrejectionhandled)&&e({promise:t,reason:t._v})})},F=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,e._v=t,e._s=2,e._a||(e._a=e._c.slice()),D(e,!0))},M=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw S("Promise can't be resolved itself");(e=C(t))?m(function(){var i={_w:n,_d:!1};try{e.call(t,l(M,i,1),l(F,i,1))}catch(t){F.call(i,t)}}):(n._v=t,n._s=1,D(n,!1))}catch(t){F.call({_w:n,_d:!1},t)}}};A||(P=function(t){d(this,P,"Promise","_h"),h(t),i.call(this);try{t(l(M,this,1),l(F,this,1))}catch(t){F.call(this,t)}},i=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},i.prototype=n(81)(P.prototype,{then:function(t,e){var n=E(g(this,P));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=T?O.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&D(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new i;this.promise=t,this.resolve=l(M,t,1),this.reject=l(F,t,1)},b.f=E=function(t){return t===P||t===s?new o(t):r(t)}),f(f.G+f.W+f.F*!A,{Promise:P}),n(26)(P,"Promise"),n(83)("Promise"),s=n(10).Promise,f(f.S+f.F*!A,"Promise",{reject:function(t){var e=E(this);return(0,e.reject)(t),e.promise}}),f(f.S+f.F*(u||!A),"Promise",{resolve:function(t){return w(u&&this===s?P:this,t)}}),f(f.S+f.F*!(A&&n(73)(function(t){P.all(t).catch(V)})),"Promise",{all:function(t){var e=this,n=E(e),i=n.resolve,r=n.reject,o=_(function(){var n=[],o=0,s=1;v(t,!1,function(t){var u=o++,a=!1;n.push(void 0),s++,e.resolve(t).then(function(t){a||(a=!0,n[u]=t,--s||i(n))},r)}),--s||i(n)});return o.e&&r(o.v),n.promise},race:function(t){var e=this,n=E(e),i=n.reject,r=_(function(){v(t,!1,function(t){e.resolve(t).then(n.resolve,i)})});return r.e&&i(r.v),n.promise}})},function(t,e,n){"use strict";var i=n(3),r=n(10),o=n(0),s=n(50),u=n(48);i(i.P+i.R,"Promise",{finally:function(t){var e=s(this,r.Promise||o.Promise),n="function"==typeof t;return this.then(n?function(n){return u(e,t()).then(function(){return n})}:t,n?function(n){return u(e,t()).then(function(){throw n})}:t)}})},function(t,e,n){"use strict";function i(t){n(99)}var r=n(35),o=n(101),s=n(100),u=i,a=s(r.a,o.a,!1,u,null,null);e.a=a.exports},function(t,e,n){"use strict";function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}e.a=i},function(t,e,n){"use strict";function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t){return(r="function"==typeof Symbol&&"symbol"===i(Symbol.iterator)?function(t){return i(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":i(t)})(t)}e.a=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n(34),r=(n.n(i),n(55)),o=(n.n(r),n(56)),s=(n.n(o),n(57)),u=n(32),a=n(33);n.d(e,"Multiselect",function(){return s.a}),n.d(e,"multiselectMixin",function(){return u.a}),n.d(e,"pointerMixin",function(){return a.a}),e.default=s.a},function(t,e){t.exports=function(t,e,n,i){if(!(t instanceof e)||void 0!==i&&i in t)throw TypeError(n+": incorrect invocation!");return t}},function(t,e,n){var i=n(14),r=n(28),o=n(23),s=n(19);t.exports=function(t,e,n,u,a){i(e);var l=r(t),c=o(l),f=s(l.length),p=a?f-1:0,h=a?-1:1;if(n<2)for(;;){if(p in c){u=c[p],p+=h;break}if(p+=h,a?p<0:f<=p)throw TypeError("Reduce of empty array with no initial value")}for(;a?p>=0:f>p;p+=h)p in c&&(u=e(u,c[p],p,l));return u}},function(t,e,n){var i=n(5),r=n(42),o=n(1)("species");t.exports=function(t){var e;return r(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!r(e.prototype)||(e=void 0),i(e)&&null===(e=e[o])&&(e=void 0)),void 0===e?Array:e}},function(t,e,n){var i=n(63);t.exports=function(t,e){return new(i(t))(e)}},function(t,e,n){"use strict";var i=n(8),r=n(6),o=n(7),s=n(16),u=n(1);t.exports=function(t,e,n){var a=u(t),l=n(s,a,""[t]),c=l[0],f=l[1];o(function(){var e={};return e[a]=function(){return 7},7!=""[t](e)})&&(r(String.prototype,t,c),i(RegExp.prototype,a,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)}))}},function(t,e,n){var i=n(11),r=n(70),o=n(69),s=n(2),u=n(19),a=n(87),l={},c={},e=t.exports=function(t,e,n,f,p){var h,d,v,g,y=p?function(){return t}:a(t),m=i(n,f,e?2:1),b=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(o(y)){for(h=u(t.length);h>b;b++)if((g=e?m(s(d=t[b])[0],d[1]):m(t[b]))===l||g===c)return g}else for(v=y.call(t);!(d=v.next()).done;)if((g=r(v,m,d.value,e))===l||g===c)return g};e.BREAK=l,e.RETURN=c},function(t,e,n){var i=n(5),r=n(82).set;t.exports=function(t,e,n){var o,s=e.constructor;return s!==n&&"function"==typeof s&&(o=s.prototype)!==n.prototype&&i(o)&&r&&r(t,o),t}},function(t,e){t.exports=function(t,e,n){var i=void 0===n;switch(e.length){case 0:return i?t():t.call(n);case 1:return i?t(e[0]):t.call(n,e[0]);case 2:return i?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return i?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return i?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},function(t,e,n){var i=n(15),r=n(1)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||o[r]===t)}},function(t,e,n){var i=n(2);t.exports=function(t,e,n,r){try{return r?e(i(n)[0],n[1]):e(n)}catch(e){var o=t.return;throw void 0!==o&&i(o.call(t)),e}}},function(t,e,n){"use strict";var i=n(44),r=n(25),o=n(26),s={};n(8)(s,n(1)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=i(s,{next:r(1,n)}),o(t,e+" Iterator")}},function(t,e,n){"use strict";var i=n(24),r=n(3),o=n(6),s=n(8),u=n(15),a=n(71),l=n(26),c=n(78),f=n(1)("iterator"),p=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,e,n,d,v,g,y){a(n,e,d);var m,b,_,x=function(t){if(!p&&t in L)return L[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",S="values"==v,O=!1,L=t.prototype,k=L[f]||L["@@iterator"]||v&&L[v],P=k||x(v),T=v?S?x("entries"):P:void 0,V="Array"==e?L.entries||k:k;if(V&&(_=c(V.call(new t)))!==Object.prototype&&_.next&&(l(_,w,!0),i||"function"==typeof _[f]||s(_,f,h)),S&&k&&"values"!==k.name&&(O=!0,P=function(){return k.call(this)}),i&&!y||!p&&!O&&L[f]||s(L,f,P),u[e]=P,u[w]=h,v)if(m={values:S?P:x("values"),keys:g?P:x("keys"),entries:T},y)for(b in m)b in L||o(L,b,m[b]);else r(r.P+r.F*(p||O),e,m);return m}},function(t,e,n){var i=n(1)("iterator"),r=!1;try{var o=[7][i]();o.return=function(){r=!0},Array.from(o,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!r)return!1;var n=!1;try{var o=[7],s=o[i]();s.next=function(){return{done:n=!0}},o[i]=function(){return s},t(o)}catch(t){}return n}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){var i=n(0),r=n(52).set,o=i.MutationObserver||i.WebKitMutationObserver,s=i.process,u=i.Promise,a="process"==n(9)(s);t.exports=function(){var t,e,n,l=function(){var i,r;for(a&&(i=s.domain)&&i.exit();t;){r=t.fn,t=t.next;try{r()}catch(i){throw t?n():e=void 0,i}}e=void 0,i&&i.enter()};if(a)n=function(){s.nextTick(l)};else if(!o||i.navigator&&i.navigator.standalone)if(u&&u.resolve){var c=u.resolve(void 0);n=function(){c.then(l)}}else n=function(){r.call(i,l)};else{var f=!0,p=document.createTextNode("");new o(l).observe(p,{characterData:!0}),n=function(){p.data=f=!f}}return function(i){var r={fn:i,next:void 0};e&&(e.next=r),t||(t=r,n()),e=r}}},function(t,e,n){var i=n(13),r=n(2),o=n(47);t.exports=n(4)?Object.defineProperties:function(t,e){r(t);for(var n,s=o(e),u=s.length,a=0;u>a;)i.f(t,n=s[a++],e[n]);return t}},function(t,e,n){var i=n(46),r=n(22).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,r)}},function(t,e,n){var i=n(12),r=n(28),o=n(27)("IE_PROTO"),s=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),i(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?s:null}},function(t,e){e.f={}.propertyIsEnumerable},function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},function(t,e,n){var i=n(6);t.exports=function(t,e,n){for(var r in e)i(t,r,e[r],n);return t}},function(t,e,n){var i=n(5),r=n(2),o=function(t,e){if(r(t),!i(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,i){try{i=n(11)(Function.call,n(45).f(Object.prototype,"__proto__").set,2),i(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return o(t,n),e?t.__proto__=n:i(t,n),t}}({},!1):void 0),check:o}},function(t,e,n){"use strict";var i=n(0),r=n(13),o=n(4),s=n(1)("species");t.exports=function(t){var e=i[t];o&&e&&!e[s]&&r.f(e,s,{configurable:!0,get:function(){return this}})}},function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},function(t,e,n){var i=n(53),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)}},function(t,e,n){var i=n(0),r=i.navigator;t.exports=r&&r.userAgent||""},function(t,e,n){var i=n(38),r=n(1)("iterator"),o=n(15);t.exports=n(10).getIteratorMethod=function(t){if(void 0!=t)return t[r]||t["@@iterator"]||o[i(t)]}},function(t,e,n){"use strict";var i=n(3),r=n(20)(2);i(i.P+i.F*!n(17)([].filter,!0),"Array",{filter:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var i=n(3),r=n(37)(!1),o=[].indexOf,s=!!o&&1/[1].indexOf(1,-0)<0;i(i.P+i.F*(s||!n(17)(o)),"Array",{indexOf:function(t){return s?o.apply(this,arguments)||0:r(this,t,arguments[1])}})},function(t,e,n){var i=n(3);i(i.S,"Array",{isArray:n(42)})},function(t,e,n){"use strict";var i=n(3),r=n(20)(1);i(i.P+i.F*!n(17)([].map,!0),"Array",{map:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var i=n(3),r=n(62);i(i.P+i.F*!n(17)([].reduce,!0),"Array",{reduce:function(t){return r(this,t,arguments.length,arguments[1],!1)}})},function(t,e,n){var i=Date.prototype,r=i.toString,o=i.getTime;new Date(NaN)+""!="Invalid Date"&&n(6)(i,"toString",function(){var t=o.call(this);return t===t?r.call(this):"Invalid Date"})},function(t,e,n){n(4)&&"g"!=/./g.flags&&n(13).f(RegExp.prototype,"flags",{configurable:!0,get:n(39)})},function(t,e,n){n(65)("search",1,function(t,e,n){return[function(n){"use strict";var i=t(this),r=void 0==n?void 0:n[e];return void 0!==r?r.call(n,i):new RegExp(n)[e](String(i))},n]})},function(t,e,n){"use strict";n(94);var i=n(2),r=n(39),o=n(4),s=/./.toString,u=function(t){n(6)(RegExp.prototype,"toString",t,!0)};n(7)(function(){return"/a/b"!=s.call({source:"a",flags:"b"})})?u(function(){var t=i(this);return"/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?r.call(t):void 0)}):"toString"!=s.name&&u(function(){return s.call(this)})},function(t,e,n){"use strict";n(51)("trim",function(t){return function(){return t(this,3)}})},function(t,e,n){for(var i=n(34),r=n(47),o=n(6),s=n(0),u=n(8),a=n(15),l=n(1),c=l("iterator"),f=l("toStringTag"),p=a.Array,h={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=r(h),v=0;v<d.length;v++){var g,y=d[v],m=h[y],b=s[y],_=b&&b.prototype;if(_&&(_[c]||u(_,c,p),_[f]||u(_,f,y),a[y]=p,m))for(g in i)_[g]||o(_,g,i[g],!0)}},function(t,e){},function(t,e){t.exports=function(t,e,n,i,r,o){var s,u=t=t||{},a=typeof t.default;"object"!==a&&"function"!==a||(s=t,u=t.default);var l="function"==typeof u?u.options:u;e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns,l._compiled=!0),n&&(l.functional=!0),r&&(l._scopeId=r);var c;if(o?(c=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o)},l._ssrRegister=c):i&&(c=i),c){var f=l.functional,p=f?l.render:l.beforeCreate;f?(l._injectStyles=c,l.render=function(t,e){return c.call(e),p(t,e)}):l.beforeCreate=p?[].concat(p,c):[c]}return{esModule:s,exports:u,options:l}}},function(t,e,n){"use strict";var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"multiselect",class:{"multiselect--active":t.isOpen,"multiselect--disabled":t.disabled,"multiselect--above":t.isAbove},attrs:{tabindex:t.searchable?-1:t.tabindex},on:{focus:function(e){t.activate()},blur:function(e){!t.searchable&&t.deactivate()},keydown:[function(e){return"button"in e||!t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerForward()):null},function(e){return"button"in e||!t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerBackward()):null}],keypress:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")||!t._k(e.keyCode,"tab",9,e.key,"Tab")?(e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate()}}},[t._t("caret",[n("div",{staticClass:"multiselect__select",on:{mousedown:function(e){e.preventDefault(),e.stopPropagation(),t.toggle()}}})],{toggle:t.toggle}),t._v(" "),t._t("clear",null,{search:t.search}),t._v(" "),n("div",{ref:"tags",staticClass:"multiselect__tags"},[t._t("selection",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.visibleValues.length>0,expression:"visibleValues.length > 0"}],staticClass:"multiselect__tags-wrap"},[t._l(t.visibleValues,function(e,i){return[t._t("tag",[n("span",{key:i,staticClass:"multiselect__tag"},[n("span",{domProps:{textContent:t._s(t.getOptionLabel(e))}}),t._v(" "),n("i",{staticClass:"multiselect__tag-icon",attrs:{"aria-hidden":"true",tabindex:"1"},on:{keypress:function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13,n.key,"Enter"))return null;n.preventDefault(),t.removeElement(e)},mousedown:function(n){n.preventDefault(),t.removeElement(e)}}})])],{option:e,search:t.search,remove:t.removeElement})]})],2),t._v(" "),t.internalValue&&t.internalValue.length>t.limit?[t._t("limit",[n("strong",{staticClass:"multiselect__strong",domProps:{textContent:t._s(t.limitText(t.internalValue.length-t.limit))}})])]:t._e()],{search:t.search,remove:t.removeElement,values:t.visibleValues,isOpen:t.isOpen}),t._v(" "),n("transition",{attrs:{name:"multiselect__loading"}},[t._t("loading",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"multiselect__spinner"})])],2),t._v(" "),t.searchable?n("input",{ref:"search",staticClass:"multiselect__input",style:t.inputStyle,attrs:{name:t.name,id:t.id,type:"text",autocomplete:"nope",placeholder:t.placeholder,disabled:t.disabled,tabindex:t.tabindex},domProps:{value:t.search},on:{input:function(e){t.updateSearch(e.target.value)},focus:function(e){e.preventDefault(),t.activate()},blur:function(e){e.preventDefault(),t.deactivate()},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate()},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"]))return null;e.preventDefault(),t.pointerForward()},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"]))return null;e.preventDefault(),t.pointerBackward()},function(e){if(!("button"in e)&&t._k(e.keyCode,"delete",[8,46],e.key,["Backspace","Delete"]))return null;e.stopPropagation(),t.removeLastElement()}],keypress:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null}}}):t._e(),t._v(" "),t.isSingleLabelVisible?n("span",{staticClass:"multiselect__single",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("singleLabel",[[t._v(t._s(t.currentOptionLabel))]],{option:t.singleValue})],2):t._e(),t._v(" "),t.isPlaceholderVisible?n("span",{staticClass:"multiselect__placeholder",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("placeholder",[t._v("\n          "+t._s(t.placeholder)+"\n        ")])],2):t._e()],2),t._v(" "),n("transition",{attrs:{name:"multiselect"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen,expression:"isOpen"}],ref:"list",staticClass:"multiselect__content-wrapper",style:{maxHeight:t.optimizedHeight+"px"},attrs:{tabindex:"-1"},on:{focus:t.activate,mousedown:function(t){t.preventDefault()}}},[n("ul",{staticClass:"multiselect__content",style:t.contentStyle},[t._t("beforeList"),t._v(" "),t.multiple&&t.max===t.internalValue.length?n("li",[n("span",{staticClass:"multiselect__option"},[t._t("maxElements",[t._v("Maximum of "+t._s(t.max)+" options selected. First remove a selected option to select another.")])],2)]):t._e(),t._v(" "),!t.max||t.internalValue.length<t.max?t._l(t.filteredOptions,function(e,i){return n("li",{key:i,staticClass:"multiselect__element"},[e&&(e.$isLabel||e.$isDisabled)?t._e():n("span",{staticClass:"multiselect__option",class:t.optionHighlight(i,e),attrs:{"data-select":e&&e.isTag?t.tagPlaceholder:t.selectLabelText,"data-selected":t.selectedLabelText,"data-deselect":t.deselectLabelText},on:{click:function(n){n.stopPropagation(),t.select(e)},mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.pointerSet(i)}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2),t._v(" "),e&&(e.$isLabel||e.$isDisabled)?n("span",{staticClass:"multiselect__option",class:t.groupHighlight(i,e),attrs:{"data-select":t.groupSelect&&t.selectGroupLabelText,"data-deselect":t.groupSelect&&t.deselectGroupLabelText},on:{mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.groupSelect&&t.pointerSet(i)},mousedown:function(n){n.preventDefault(),t.selectGroup(e)}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2):t._e()])}):t._e(),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoResults&&0===t.filteredOptions.length&&t.search&&!t.loading,expression:"showNoResults && (filteredOptions.length === 0 && search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noResult",[t._v("No elements found. Consider changing the search query.")],{search:t.search})],2)]),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoOptions&&0===t.options.length&&!t.search&&!t.loading,expression:"showNoOptions && (options.length === 0 && !search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noOptions",[t._v("List is empty.")])],2)]),t._v(" "),t._t("afterList")],2)])])],2)},r=[],o={render:i,staticRenderFns:r};e.a=o}])});

/***/ })

}]);