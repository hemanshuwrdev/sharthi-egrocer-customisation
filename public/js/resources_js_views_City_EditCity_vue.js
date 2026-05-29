"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_City_EditCity_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/City/EditCity.vue?vue&type=script&lang=js":
/*!**************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/City/EditCity.vue?vue&type=script&lang=js ***!
  \**************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var vue2_google_maps__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! vue2-google-maps */ "./node_modules/vue2-google-maps/dist/main.js");
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");

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




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_3__["default"]],
  data: function data() {
    return {
      center: {
        lat: 0,
        lng: 0
      },
      currentPlace: null,
      markers: [],
      city: {
        id: "",
        latitude: "",
        longitude: "",
        name: "",
        state: "",
        zone: "",
        formatted_address: "",
        time_to_travel: "",
        min_amount_for_free_delivery: "",
        max_deliverable_distance: "",
        delivery_charge_method: "",
        fixed_charge: "",
        per_km_charge: "",
        range_wise_charges: [{
          from_range: "",
          to_range: "",
          price: ""
        }],
        boundary_points: "",
        geolocation_type: "",
        radius: ""
      },
      boundary_points: "",
      formatted_address: "",
      infoWindow: {
        position: {
          lat: 0,
          lng: 0
        },
        open: false,
        template: ''
      },
      map: "",
      drawingManager: "",
      vertices: "",
      geolocation_type: "",
      googleMapsLoaded: false,
      languages: [],
      translations: {},
      defaultLanguageId: null,
      activeLanguageTab: 0,
      renderKey: 0,
      // Translate buttons
      translatableFields: ['zone'],
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false
    };
  },
  mounted: function mounted() {
    var _this = this;
    var vm = this;
    this.$refs.mapRef.$mapPromise.then(function (map) {
      vm.map = map;
      vm.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON, google.maps.drawing.OverlayType.CIRCLE]
        },
        polygonOptions: {
          editable: true
        },
        circleOptions: {
          fillColor: '#666666',
          fillOpacity: 0.5,
          strokeWeight: 1,
          clickable: true,
          editable: true,
          draggable: true,
          zIndex: 1
        }
      });
      vm.drawingManager.setMap(vm.map);
      google.maps.event.addListener(vm.drawingManager, "overlaycomplete", function (event) {
        var newShape = event.overlay;
        newShape.type = event.type;
      });
      google.maps.event.addListener(vm.drawingManager, "overlaycomplete", function (event) {
        if (event.type == "circle") {
          var circle_points = [];
          vm.radius = event.overlay.getRadius();
          var lat = event.overlay.getCenter().lat();
          var lng = event.overlay.getCenter().lng();
          circle_points.push({
            "lat": lat,
            "lng": lng
          });
          vm.geolocation_type = event.type;
          vm.vertices = JSON.stringify(circle_points);
        } else {
          vm.geolocation_type = event.type;
          vm.vertices = event.overlay.getPath().getArray();
          vm.overlayClickListener(event.overlay);
        }
      });
      google.maps.event.addListener(_this.drawingManager, "overlaycomplete", function (event) {
        vm.overlayRemoveListener(event.overlay, false);
      });
    });
    this.waitForGoogleMaps();
  },
  computed: {
    google: function google() {
      return (0,vue2_google_maps__WEBPACK_IMPORTED_MODULE_2__.gmapApi)(); // This will return the google object once the API is loaded
    }
  },
  created: function created() {
    var _this2 = this;
    this.city.id = this.$route.params.id;
    this.cityRecord = this.$route.params.record;
    this.$apiUrl = '/api';
    this.fetchActiveLanguages().then(function () {
      _this2.initializeTranslations();
      if (_this2.city.id) {
        _this2.loadCityWithTranslations();
      }
      _this2.isLoadingData = false;
    });
  },
  methods: {
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this3 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/active_languages').then(function (response) {
        _this3.languages = response.data.data;
        var defaultLang = _this3.languages.find(function (l) {
          return l.is_default === 1;
        });
        if (defaultLang) {
          _this3.defaultLanguageId = defaultLang.id;
        }
      });
    },
    initializeTranslations: function initializeTranslations() {
      var allTranslations = {};
      this.languages.forEach(function (language) {
        allTranslations[language.id] = {
          name: '',
          zone: ''
        };
      });
      this.translations = allTranslations;
    },
    validateDefaultLanguage: function validateDefaultLanguage() {
      // Validate normal city name
      if (!this.city.name || this.city.name.trim() === '') {
        this.showError("Please enter city name");
        this.switchToDefaultLanguageTab();
        return false;
      }

      // Validate default language zone
      var defaultTranslation = this.translations[this.defaultLanguageId];
      if (!defaultTranslation.zone || defaultTranslation.zone.trim() === '') {
        this.showError("Please enter zone name in default language");
        this.switchToDefaultLanguageTab();
        return false;
      }

      // Validate Time to travel 1 (km) - required
      if (this.city.time_to_travel === '' || this.city.time_to_travel === null || this.city.time_to_travel === undefined) {
        this.showError(__('time_to_travel_1km') + ' ' + __('is_required'));
        this.switchToDefaultLanguageTab(true);
        return false;
      }

      // Validate Minimum Amount for Free Delivery - required
      if (this.city.min_amount_for_free_delivery === '' || this.city.min_amount_for_free_delivery === null || this.city.min_amount_for_free_delivery === undefined) {
        this.showError(__('minimum_amount_for_free_delivery') + ' ' + __('is_required'));
        this.switchToDefaultLanguageTab(true);
        return false;
      }

      // Validate Delivery Charge Methods - required
      if (!this.city.delivery_charge_method || this.city.delivery_charge_method.trim() === '') {
        this.showError(__('delivery_charge_methods') + ' ' + __('is_required'));
        this.switchToDefaultLanguageTab(true);
        return false;
      }

      // Validate delivery charge method specific fields
      if (this.city.delivery_charge_method === 'fixed_charge') {
        if (this.city.fixed_charge === '' || this.city.fixed_charge === null || this.city.fixed_charge === undefined) {
          this.showError(__('fix_delivery_charges') + ' ' + __('is_required'));
          this.switchToDefaultLanguageTab(true);
          return false;
        }
      } else if (this.city.delivery_charge_method === 'per_km_charge') {
        if (this.city.per_km_charge === '' || this.city.per_km_charge === null || this.city.per_km_charge === undefined) {
          this.showError(__('per_km_delivery_charges') + ' ' + __('is_required'));
          this.switchToDefaultLanguageTab(true);
          return false;
        }
      } else if (this.city.delivery_charge_method === 'range_wise_charges') {
        var ranges = this.city.range_wise_charges || [];
        var hasValidRange = ranges.some(function (r) {
          return r.from_range !== '' && r.from_range != null && r.to_range !== '' && r.to_range != null && r.price !== '' && r.price != null;
        });
        if (!hasValidRange) {
          this.showError(__('range_wise_delivery_charges') + ' ' + __('is_required'));
          this.switchToDefaultLanguageTab(true);
          return false;
        }
      }
      return true;
    },
    addRow: function addRow() {
      this.city.range_wise_charges.push({
        from_range: "",
        to_range: "",
        price: ""
      });
    },
    remove: function remove(index) {
      this.city.range_wise_charges.splice(index, 1);
    },
    setPlace: function setPlace(place) {
      this.currentPlace = place;
      this.addMarker();
    },
    addMarker: function addMarker() {
      if (this.currentPlace) {
        var marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({
          position: marker
        });
        this.center = marker;
        this.city.latitude = this.currentPlace.geometry.location.lat();
        this.city.longitude = this.currentPlace.geometry.location.lng();
        this.city.name = this.currentPlace.name;
        var addressArr = this.currentPlace.formatted_address.split(",");
        this.city.state = addressArr[addressArr.length - 2];
        this.city.formatted_address = this.currentPlace.formatted_address;
        this.infoWindow.position = {
          lat: this.city.latitude,
          lng: this.city.longitude
        };
        this.infoWindow.template = "<b>".concat(this.city.name, "</b><br>").concat(this.city.formatted_address);
        this.infoWindow.open = true;
        this.currentPlace = null;
      }
    },
    loadCityWithTranslations: function loadCityWithTranslations() {
      var _this4 = this;
      return axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/cities/edit/' + this.city.id).then(function (response) {
        var city = response.data.data;
        if (!city) {
          _this4.showError("City not found");
          return;
        }

        // Load base fields
        Object.keys(_this4.city).forEach(function (key) {
          if (key === 'range_wise_charges') {
            _this4.city[key] = city[key] ? JSON.parse(city[key]) : [];
          } else if (key !== 'zone') {
            _this4.city[key] = city[key] || '';
          }
        });
        var updatedTranslations = _objectSpread({}, _this4.translations);
        if (city.translations && Array.isArray(city.translations)) {
          city.translations.forEach(function (trans) {
            updatedTranslations[trans.language_id] = {
              zone: trans.zone || ''
            };
          });
        }

        // Fallback for default language
        _this4.languages.forEach(function (language) {
          if (language.is_default) {
            var _updatedTranslations$;
            if (!((_updatedTranslations$ = updatedTranslations[language.id]) !== null && _updatedTranslations$ !== void 0 && _updatedTranslations$.zone)) {
              updatedTranslations[language.id] = {
                zone: city.zone || ''
              };
            }
          }
        });
        _this4.translations = updatedTranslations;

        // Force re-render 
        _this4.renderKey++;
        _this4.setMap();
      })["catch"](function (error) {
        console.error("Error loading city:", error);
        _this4.showError("Failed to load city");
      });
    },
    validateDefaultLanguageForTranslation: function validateDefaultLanguageForTranslation() {
      return this.validateDefaultLanguage();
    },
    overlayClickListener: function overlayClickListener(overlay) {
      google.maps.event.addListener(overlay, "mouseup", function (event) {
        this.vertices = overlay.getPath().getArray();
      });
    },
    overlayRemoveListener: function overlayRemoveListener(overlay) {
      var is_restore = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var drawed_map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
      var not_remove = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var boundary_points = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
      var vm = this;
      if (is_restore == true) {
        document.getElementById("add-line").addEventListener("click", addLine);
      }
      document.getElementById("clear-line").addEventListener("click", clearLine);
      if (not_remove == false) {
        document.getElementById("remove-line").addEventListener("click", removeLine);
      }
      function clearLine() {
        overlay.setMap(null);
        vm.vertices = "";
      }
      function removeLine() {
        overlay.setMap(null);
        vm.vertices = "";
      }
      function addLine() {
        if (drawed_map != "") {
          overlay.setMap(drawed_map);
        } else {
          overlay.setMap(map);
        }
        vm.vertices = boundary_points;
      }
    },
    waitForGoogleMaps: function waitForGoogleMaps() {
      var _this5 = this;
      var checkGoogleMaps = setInterval(function () {
        if ((0,vue2_google_maps__WEBPACK_IMPORTED_MODULE_2__.gmapApi)() && (0,vue2_google_maps__WEBPACK_IMPORTED_MODULE_2__.gmapApi)().maps) {
          _this5.googleMapsLoaded = true;
          clearInterval(checkGoogleMaps);
          _this5.setMap();
        }
      }, 100); // Check every 100ms
    },
    setMap: function setMap() {
      if (!this.city.latitude || !this.city.longitude) {
        return;
      }
      var lat = parseFloat(this.city.latitude);
      var lng = parseFloat(this.city.longitude);
      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates", this.city.latitude, this.city.longitude);
        return;
      }
      var marker = {
        lat: lat,
        lng: lng
      };
      this.markers = []; // clear old markers
      this.markers.push({
        position: marker
      });
      this.center = marker;
      this.infoWindow.position = marker;
      this.infoWindow.template = "<b>".concat(this.city.name, "</b><br>").concat(this.city.formatted_address);
      this.infoWindow.open = true;
      if (!this.map || !this.city.boundary_points || !this.city.id) {
        return;
      }
      var boundaryPoints = this.city.boundary_points;
      if (typeof boundaryPoints === 'string') {
        try {
          boundaryPoints = JSON.parse(boundaryPoints);
        } catch (e) {
          return;
        }
      }
      if (!boundaryPoints || _typeof(boundaryPoints) !== 'object') {
        return;
      }
      var points = Array.isArray(boundaryPoints) ? boundaryPoints : [boundaryPoints];
      if (points.length === 0) return;
      this.geolocation_type = this.city.geolocation_type || 'polygon';
      this.radius = this.city.radius;
      if (this.city.geolocation_type === 'circle') {
        this.vertices = this.city.boundary_points;
        var cityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: this.map,
          center: points[0],
          radius: this.city.radius ? Math.sqrt(parseFloat(this.city.radius)) * 100 : 1000
        });
        this.overlayRemoveListener(cityCircle, true, this.map, true, this.city.boundary_points);
      } else {
        this.vertices = points;
        var polygon = new google.maps.Polygon({
          paths: points,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          editable: true,
          geodesic: true
        });
        polygon.setMap(this.map);
        this.overlayRemoveListener(polygon, true, this.map, true, points);
      }
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this6 = this;
      var skipError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var defaultLangIndex = this.languages.findIndex(function (language) {
        return language.id === _this6.defaultLanguageId;
      });
      if (defaultLangIndex !== -1) {
        if (!skipError) {
          this.showError(__('please_fill_default_language_required_fields'));
        }
        this.activeLanguageTab = defaultLangIndex;
      }
    },
    saveRecord: function saveRecord() {
      var _this7 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var cityId, languagesToSave, defaultLang, _i, _languagesToSave, _response$data$data, language, formData, key, _this7$city$key, response, _error$response, _error$response$data;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (_this7.validateDefaultLanguage()) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return");
              case 2:
                if (_this7.vertices) {
                  _context.next = 5;
                  break;
                }
                _this7.showError("Draw Deliverable area on Map");
                return _context.abrupt("return");
              case 5:
                _this7.isLoading = true;
                cityId = _this7.city.id;
                languagesToSave = [];
                defaultLang = _this7.languages.find(function (l) {
                  return l.is_default;
                });
                if (defaultLang) {
                  languagesToSave.push(defaultLang);
                }
                _this7.languages.forEach(function (language) {
                  if (language.is_default) return;
                  var trans = _this7.translations[language.id];
                  if (trans.zone && trans.zone.trim() !== '') {
                    languagesToSave.push(language);
                  }
                });
                _context.prev = 11;
                _i = 0, _languagesToSave = languagesToSave;
              case 13:
                if (!(_i < _languagesToSave.length)) {
                  _context.next = 27;
                  break;
                }
                language = _languagesToSave[_i];
                formData = new FormData(); // Always send ID only if valid
                if (cityId && cityId !== "") {
                  formData.append("id", cityId);
                }

                // ALWAYS send base fields for default language
                if (language.is_default) {
                  for (key in _this7.city) {
                    if (key === 'range_wise_charges') {
                      formData.append(key, JSON.stringify(_this7.city[key]));
                    } else {
                      formData.append(key, (_this7$city$key = _this7.city[key]) !== null && _this7$city$key !== void 0 ? _this7$city$key : '');
                    }
                  }
                  formData.append("geolocation_type", _this7.geolocation_type);
                  formData.append("radius", _this7.radius);
                  if (_this7.geolocation_type === 'circle') {
                    formData.append("boundary_points", _this7.vertices);
                  } else {
                    formData.append("boundary_points", JSON.stringify(_this7.vertices));
                  }
                }

                // Always send translation fields
                formData.append("language_id", language.id);
                formData.append("zone", _this7.translations[language.id].zone || '');
                _context.next = 22;
                return axios__WEBPACK_IMPORTED_MODULE_1___default().post(_this7.$apiUrl + '/cities/save', formData);
              case 22:
                response = _context.sent;
                if (!cityId && (_response$data$data = response.data.data) !== null && _response$data$data !== void 0 && _response$data$data.id) {
                  cityId = response.data.data.id;
                }
              case 24:
                _i++;
                _context.next = 13;
                break;
              case 27:
                _this7.showMessage("success", __('city_saved_successfully'));
                setTimeout(function () {
                  _this7.$router.push({
                    path: '/cities'
                  });
                }, 1500);
                _context.next = 34;
                break;
              case 31:
                _context.prev = 31;
                _context.t0 = _context["catch"](11);
                if ((_error$response = _context.t0.response) !== null && _error$response !== void 0 && (_error$response$data = _error$response.data) !== null && _error$response$data !== void 0 && _error$response$data.message) {
                  _this7.showError(_context.t0.response.data.message);
                } else {
                  _this7.showError("Something went wrong!");
                }
              case 34:
                _context.prev = 34;
                _this7.isLoading = false;
                return _context.finish(34);
              case 37:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[11, 31, 34, 37]]);
      }))();
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

/***/ "./resources/js/views/City/EditCity.vue":
/*!**********************************************!*\
  !*** ./resources/js/views/City/EditCity.vue ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EditCity_vue_vue_type_template_id_a8c9b86c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EditCity.vue?vue&type=template&id=a8c9b86c */ "./resources/js/views/City/EditCity.vue?vue&type=template&id=a8c9b86c");
/* harmony import */ var _EditCity_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EditCity.vue?vue&type=script&lang=js */ "./resources/js/views/City/EditCity.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _EditCity_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _EditCity_vue_vue_type_template_id_a8c9b86c__WEBPACK_IMPORTED_MODULE_0__.render,
  _EditCity_vue_vue_type_template_id_a8c9b86c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/City/EditCity.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/City/EditCity.vue?vue&type=script&lang=js":
/*!**********************************************************************!*\
  !*** ./resources/js/views/City/EditCity.vue?vue&type=script&lang=js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditCity_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditCity.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/City/EditCity.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditCity_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/City/EditCity.vue?vue&type=template&id=a8c9b86c":
/*!****************************************************************************!*\
  !*** ./resources/js/views/City/EditCity.vue?vue&type=template&id=a8c9b86c ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditCity_vue_vue_type_template_id_a8c9b86c__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditCity_vue_vue_type_template_id_a8c9b86c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditCity_vue_vue_type_template_id_a8c9b86c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./EditCity.vue?vue&type=template&id=a8c9b86c */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/City/EditCity.vue?vue&type=template&id=a8c9b86c");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/City/EditCity.vue?vue&type=template&id=a8c9b86c":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/City/EditCity.vue?vue&type=template&id=a8c9b86c ***!
  \*******************************************************************************************************************************************************************************************************************/
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
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
          _c("h3", [_vm._v(_vm._s(_vm.__("manage_city")))]),
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
                    _c("router-link", { attrs: { to: "/dashboard" } }, [
                      _vm._v(_vm._s(_vm.__("dashboard"))),
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
                    _vm.city.id
                      ? [
                          _vm._v(
                            "\n                                " +
                              _vm._s(_vm.__("edit")) +
                              "\n                            "
                          ),
                        ]
                      : [
                          _vm._v(
                            "\n                                " +
                              _vm._s(_vm.__("create")) +
                              "\n                            "
                          ),
                        ],
                    _vm._v(
                      "\n                            " +
                        _vm._s(_vm.__("city")) +
                        "\n                        "
                    ),
                  ],
                  2
                ),
              ]),
            ]
          ),
        ]),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-md-6 col-sm-12 order-md-1 order-last" }, [
          _c("div", { staticClass: "card h-100" }, [
            _c("div", { staticClass: "card-header" }, [
              _c(
                "h4",
                [
                  _vm.city.id
                    ? [_vm._v(_vm._s(_vm.__("edit")))]
                    : [_vm._v(_vm._s(_vm.__("create")))],
                  _vm._v(
                    "\n                            " +
                      _vm._s(_vm.__("city")) +
                      "\n                        "
                  ),
                ],
                2
              ),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "card-body" }, [
              _c(
                "form",
                {
                  ref: "my-form",
                  attrs: { novalidate: "" },
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
                          key: _vm.renderKey,
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
                              attrs: { title: language.name },
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
                                              "\n                                            " +
                                                _vm._s(language.name) +
                                                "\n                                        "
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
                              _vm.languages.length > 1 &&
                              language.name
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
                                                "\n                                            " +
                                                  _vm._s(
                                                    _vm.translateSuccessMessage
                                                  ) +
                                                  "\n                                        "
                                              ),
                                            ]
                                          )
                                        : _vm._e(),
                                    ],
                                    1
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c(
                                    "div",
                                    { staticClass: "form-group" },
                                    [
                                      _c(
                                        "label",
                                        { attrs: { for: "city_name" } },
                                        [
                                          _vm._v(
                                            " " + _vm._s(_vm.__("search_city"))
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("GmapAutocomplete", {
                                        staticClass: "form-control",
                                        attrs: {
                                          type: "search",
                                          placeholder:
                                            _vm.__("search_city_on_map"),
                                          options: {
                                            fields: [
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
                                          id: "city_name",
                                        },
                                        on: { place_changed: _vm.setPlace },
                                      }),
                                      _vm._v(" "),
                                      _c("input", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value: _vm.city.formatted_address,
                                            expression:
                                              "city.formatted_address",
                                          },
                                        ],
                                        attrs: { type: "hidden" },
                                        domProps: {
                                          value: _vm.city.formatted_address,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.city,
                                              "formatted_address",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                      _vm._v(" "),
                                      _c(
                                        "span",
                                        { staticClass: "text text-primary" },
                                        [
                                          _vm._v(
                                            _vm._s(
                                              _vm.__(
                                                "search_your_city_where_you_will_deliver_the_food_and_to_find_co_ordinates"
                                              )
                                            )
                                          ),
                                        ]
                                      ),
                                    ],
                                    1
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c(
                                      "label",
                                      { attrs: { for: "latitude" } },
                                      [
                                        _vm._v(
                                          _vm._s(_vm.__("latitude")) + " "
                                        ),
                                        _c(
                                          "span",
                                          {
                                            staticClass: "text-danger text-sm",
                                          },
                                          [_vm._v("*")]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.city.latitude,
                                          expression: "city.latitude",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        name: "latitude",
                                        id: "latitude",
                                        placeholder: _vm.__("latitude"),
                                        required: "",
                                        readonly: "",
                                      },
                                      domProps: { value: _vm.city.latitude },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.city,
                                            "latitude",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c(
                                      "label",
                                      { attrs: { for: "longitude" } },
                                      [
                                        _vm._v(
                                          " " + _vm._s(_vm.__("longitude"))
                                        ),
                                        _c(
                                          "span",
                                          {
                                            staticClass: "text-danger text-sm",
                                          },
                                          [_vm._v("*")]
                                        ),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.city.longitude,
                                          expression: "city.longitude",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        name: "longitude",
                                        id: "longitude",
                                        placeholder: _vm.__("longitude"),
                                        required: "",
                                        readonly: "",
                                      },
                                      domProps: { value: _vm.city.longitude },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.city,
                                            "longitude",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c("label", { attrs: { for: "name" } }, [
                                      _vm._v(" " + _vm._s(_vm.__("city_name"))),
                                      _c(
                                        "span",
                                        { staticClass: "text-danger text-sm" },
                                        [_vm._v("*")]
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.city.name,
                                          expression: "city.name",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        name: "name",
                                        id: "name",
                                        placeholder: _vm.__("city_name"),
                                        required: "",
                                        readonly: "",
                                      },
                                      domProps: { value: _vm.city.name },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.city,
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
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c("label", { attrs: { for: "state" } }, [
                                      _vm._v(
                                        " " + _vm._s(_vm.__("state_name"))
                                      ),
                                      _c(
                                        "span",
                                        { staticClass: "text-danger text-sm" },
                                        [_vm._v("*")]
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.city.state,
                                          expression: "city.state",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "text",
                                        name: "state",
                                        id: "state",
                                        placeholder: _vm.__("state_name"),
                                        required: "",
                                        readonly: "",
                                      },
                                      domProps: { value: _vm.city.state },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.city,
                                            "state",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              _c("div", { staticClass: "form-group" }, [
                                _c(
                                  "label",
                                  { attrs: { for: "zone_" + language.id } },
                                  [
                                    _vm._v(" " + _vm._s(_vm.__("zone_name"))),
                                    language.is_default
                                      ? _c(
                                          "span",
                                          {
                                            staticClass: "text-danger text-sm",
                                          },
                                          [_vm._v("*")]
                                        )
                                      : _vm._e(),
                                  ]
                                ),
                                _vm._v(" "),
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.translations[language.id].zone,
                                      expression:
                                        "translations[language.id].zone",
                                    },
                                  ],
                                  staticClass: "form-control",
                                  attrs: {
                                    type: "text",
                                    name: "zone",
                                    id: "zone_" + language.id,
                                    required:
                                      language.is_default == 1
                                        ? true
                                        : undefined,
                                    placeholder: _vm.__("zone_name"),
                                  },
                                  domProps: {
                                    value: _vm.translations[language.id].zone,
                                  },
                                  on: {
                                    input: function ($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.translations[language.id],
                                        "zone",
                                        $event.target.value
                                      )
                                    },
                                  },
                                }),
                              ]),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c(
                                      "label",
                                      { attrs: { for: "time_to_travel" } },
                                      [
                                        _vm._v(
                                          _vm._s(_vm.__("time_to_travel_1km")) +
                                            " "
                                        ),
                                        _c(
                                          "span",
                                          {
                                            staticClass: "text-danger text-sm",
                                          },
                                          [_vm._v("*")]
                                        ),
                                        _vm._v(" "),
                                        _c("small", [
                                          _vm._v(
                                            "(\n                                                " +
                                              _vm._s(
                                                _vm.__("enter_in_minutes")
                                              ) +
                                              ")"
                                          ),
                                        ]),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.city.time_to_travel,
                                          expression: "city.time_to_travel",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "number",
                                        name: "time_to_travel",
                                        id: "time_to_travel",
                                        min: "0",
                                        max: "999999999",
                                        placeholder: _vm.__(
                                          "enter_time_to_travel_1km_in_minutes"
                                        ),
                                        required: "",
                                      },
                                      domProps: {
                                        value: _vm.city.time_to_travel,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.city,
                                            "time_to_travel",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c(
                                      "label",
                                      {
                                        attrs: {
                                          for: "min_amount_for_free_delivery",
                                        },
                                      },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            _vm.__(
                                              "minimum_amount_for_free_delivery"
                                            )
                                          )
                                        ),
                                        _c(
                                          "span",
                                          {
                                            staticClass: "text-danger text-xs",
                                          },
                                          [_vm._v("*")]
                                        ),
                                        _vm._v(" "),
                                        _c("small", [
                                          _vm._v(
                                            "[ " +
                                              _vm._s(_vm.$currency) +
                                              "\n                                                ]"
                                          ),
                                        ]),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value:
                                            _vm.city
                                              .min_amount_for_free_delivery,
                                          expression:
                                            "city.min_amount_for_free_delivery",
                                        },
                                      ],
                                      staticClass: "form-control",
                                      attrs: {
                                        type: "number",
                                        name: "min_amount_for_free_delivery",
                                        id: "min_amount_for_free_delivery",
                                        placeholder: _vm.__(
                                          "minimum_amount_for_free_delivery"
                                        ),
                                        min: "0",
                                        max: "999999999",
                                        required: "",
                                      },
                                      domProps: {
                                        value:
                                          _vm.city.min_amount_for_free_delivery,
                                      },
                                      on: {
                                        input: function ($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.city,
                                            "min_amount_for_free_delivery",
                                            $event.target.value
                                          )
                                        },
                                      },
                                    }),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c(
                                    "div",
                                    { staticClass: "form-group d-none" },
                                    [
                                      _c(
                                        "label",
                                        {
                                          attrs: {
                                            for: "max_deliverable_distance",
                                          },
                                        },
                                        [
                                          _vm._v(
                                            " " +
                                              _vm._s(
                                                _vm.__(
                                                  "maximum_delivarable_distance"
                                                )
                                              )
                                          ),
                                          _c(
                                            "span",
                                            {
                                              staticClass:
                                                "text-danger text-xs",
                                            },
                                            [_vm._v("*")]
                                          ),
                                          _vm._v(" "),
                                          _c("small", [_vm._v("[Kilometre]")]),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("input", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.city.max_deliverable_distance,
                                            expression:
                                              "city.max_deliverable_distance",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          type: "number",
                                          name: "max_deliverable_distance",
                                          placeholder:
                                            "Enter Delivarable Maximum Distance in km",
                                          min: "0",
                                          max: "999999999",
                                        },
                                        domProps: {
                                          value:
                                            _vm.city.max_deliverable_distance,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.city,
                                              "max_deliverable_distance",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", { staticClass: "form-group" }, [
                                    _c(
                                      "label",
                                      {
                                        staticClass: " col-12 col-form-label",
                                        attrs: {
                                          for: "delivery_charge_method",
                                        },
                                      },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            _vm.__("delivery_charge_methods")
                                          ) + " "
                                        ),
                                        _c(
                                          "span",
                                          {
                                            staticClass: "text-danger text-sm",
                                          },
                                          [_vm._v("*")]
                                        ),
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
                                            value:
                                              _vm.city.delivery_charge_method,
                                            expression:
                                              "city.delivery_charge_method",
                                          },
                                        ],
                                        staticClass: "form-control form-select",
                                        attrs: {
                                          name: "delivery_charge_method",
                                          id: "delivery_charge_method",
                                          required: "",
                                        },
                                        on: {
                                          change: function ($event) {
                                            var $$selectedVal =
                                              Array.prototype.filter
                                                .call(
                                                  $event.target.options,
                                                  function (o) {
                                                    return o.selected
                                                  }
                                                )
                                                .map(function (o) {
                                                  var val =
                                                    "_value" in o
                                                      ? o._value
                                                      : o.value
                                                  return val
                                                })
                                            _vm.$set(
                                              _vm.city,
                                              "delivery_charge_method",
                                              $event.target.multiple
                                                ? $$selectedVal
                                                : $$selectedVal[0]
                                            )
                                          },
                                        },
                                      },
                                      [
                                        _c("option", { attrs: { value: "" } }, [
                                          _vm._v(
                                            _vm._s(_vm.__("select_method"))
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c(
                                          "option",
                                          { attrs: { value: "fixed_charge" } },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__("fixed_delivery_charges")
                                              )
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "option",
                                          { attrs: { value: "per_km_charge" } },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__(
                                                  "per_km_delivery_charges"
                                                )
                                              ) +
                                                "\n                                            "
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "option",
                                          {
                                            attrs: {
                                              value: "range_wise_charges",
                                            },
                                          },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                _vm.__(
                                                  "range_wise_delivery_charges"
                                                )
                                              )
                                            ),
                                          ]
                                        ),
                                      ]
                                    ),
                                  ])
                                : _vm._e(),
                              _vm._v(" "),
                              language.is_default
                                ? _c("div", [
                                    _vm.city.delivery_charge_method ===
                                    "fixed_charge"
                                      ? _c(
                                          "div",
                                          { staticClass: "form-group" },
                                          [
                                            _c(
                                              "label",
                                              {
                                                attrs: { for: "fixed_charge" },
                                              },
                                              [
                                                _vm._v(
                                                  " " +
                                                    _vm._s(
                                                      _vm.__(
                                                        "fix_delivery_charges"
                                                      )
                                                    )
                                                ),
                                                _c(
                                                  "span",
                                                  {
                                                    staticClass:
                                                      "text-danger text-sm",
                                                  },
                                                  [_vm._v("*")]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value: _vm.city.fixed_charge,
                                                  expression:
                                                    "city.fixed_charge",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: {
                                                type: "number",
                                                name: "fixed_charge",
                                                id: "fixed_charge",
                                                placeholder: _vm.__(
                                                  "fix_delivery_charges"
                                                ),
                                                min: "0",
                                                max: "999999999",
                                                step: "any",
                                              },
                                              domProps: {
                                                value: _vm.city.fixed_charge,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.$set(
                                                    _vm.city,
                                                    "fixed_charge",
                                                    $event.target.value
                                                  )
                                                },
                                              },
                                            }),
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _vm.city.delivery_charge_method ===
                                    "per_km_charge"
                                      ? _c(
                                          "div",
                                          { staticClass: "form-group" },
                                          [
                                            _c(
                                              "label",
                                              {
                                                attrs: { for: "per_km_charge" },
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__(
                                                      "per_km_delivery_charges"
                                                    )
                                                  )
                                                ),
                                                _c(
                                                  "span",
                                                  {
                                                    staticClass:
                                                      "text-danger text-sm",
                                                  },
                                                  [_vm._v("*")]
                                                ),
                                              ]
                                            ),
                                            _vm._v(" "),
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value: _vm.city.per_km_charge,
                                                  expression:
                                                    "city.per_km_charge",
                                                },
                                              ],
                                              staticClass: "form-control",
                                              attrs: {
                                                type: "number",
                                                name: "per_km_charge",
                                                id: "per_km_charge",
                                                placeholder: _vm.__(
                                                  "per_km_delivery_charges"
                                                ),
                                                min: "0",
                                                max: "999999999",
                                                step: "any",
                                              },
                                              domProps: {
                                                value: _vm.city.per_km_charge,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.$set(
                                                    _vm.city,
                                                    "per_km_charge",
                                                    $event.target.value
                                                  )
                                                },
                                              },
                                            }),
                                            _vm._v(" "),
                                            _c("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value:
                                                    _vm.city.boundary_points,
                                                  expression:
                                                    "city.boundary_points",
                                                },
                                              ],
                                              staticClass:
                                                "form-control d-none",
                                              attrs: {
                                                type: "text",
                                                name: "boundary_points",
                                                id: "boundary_points",
                                                placeholder:
                                                  _vm.__("boundary_points"),
                                              },
                                              domProps: {
                                                value: _vm.city.boundary_points,
                                              },
                                              on: {
                                                input: function ($event) {
                                                  if ($event.target.composing) {
                                                    return
                                                  }
                                                  _vm.$set(
                                                    _vm.city,
                                                    "boundary_points",
                                                    $event.target.value
                                                  )
                                                },
                                              },
                                            }),
                                          ]
                                        )
                                      : _vm._e(),
                                    _vm._v(" "),
                                    _vm.city.delivery_charge_method ===
                                    "range_wise_charges"
                                      ? _c(
                                          "div",
                                          {
                                            staticClass: "form-group col-sm-12",
                                          },
                                          [
                                            _c("label", [
                                              _vm._v(
                                                _vm._s(
                                                  _vm.__(
                                                    "range_wise_delivery_charges"
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
                                                    "*\n                                                "
                                                  ),
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "span",
                                                {
                                                  staticClass:
                                                    "text-secondary text-sm",
                                                },
                                                [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.__(
                                                        "set_proper_ranges_for_delivery_charge_do_not_repeat_the_range_value_to_next_range_for_e_g_1_3_4_6"
                                                      )
                                                    )
                                                  ),
                                                ]
                                              ),
                                            ]),
                                            _vm._v(" "),
                                            _vm._l(
                                              _vm.city.range_wise_charges,
                                              function (range, index) {
                                                return _c(
                                                  "div",
                                                  {
                                                    key: (_vm.key = index + 1),
                                                    staticClass:
                                                      "form-group row",
                                                  },
                                                  [
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass: "col-sm-1",
                                                      },
                                                      [
                                                        _vm._v(
                                                          _vm._s(_vm.key) + "."
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass: "col-sm-3",
                                                      },
                                                      [
                                                        _c("input", {
                                                          directives: [
                                                            {
                                                              name: "model",
                                                              rawName:
                                                                "v-model",
                                                              value:
                                                                range.from_range,
                                                              expression:
                                                                "range.from_range",
                                                            },
                                                          ],
                                                          staticClass:
                                                            "form-control",
                                                          attrs: {
                                                            type: "number",
                                                            name: "from_range[]",
                                                            id: "from_range",
                                                            placeholder:
                                                              _vm.__(
                                                                "from_range"
                                                              ),
                                                            min: "0",
                                                            max: "999999999",
                                                          },
                                                          domProps: {
                                                            value:
                                                              range.from_range,
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
                                                                range,
                                                                "from_range",
                                                                $event.target
                                                                  .value
                                                              )
                                                            },
                                                          },
                                                        }),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "col-sm-1 btn btn-secondary",
                                                      },
                                                      [
                                                        _vm._v(
                                                          _vm._s(_vm.__("to"))
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass: "col-sm-3",
                                                      },
                                                      [
                                                        _c("input", {
                                                          directives: [
                                                            {
                                                              name: "model",
                                                              rawName:
                                                                "v-model",
                                                              value:
                                                                range.to_range,
                                                              expression:
                                                                "range.to_range",
                                                            },
                                                          ],
                                                          staticClass:
                                                            "form-control",
                                                          attrs: {
                                                            type: "number",
                                                            name: "to_range[]",
                                                            id: "to_range",
                                                            placeholder:
                                                              _vm.__(
                                                                "to_range"
                                                              ),
                                                            min: "0",
                                                            max: "999999999",
                                                          },
                                                          domProps: {
                                                            value:
                                                              range.to_range,
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
                                                                range,
                                                                "to_range",
                                                                $event.target
                                                                  .value
                                                              )
                                                            },
                                                          },
                                                        }),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass: "col-sm-3",
                                                      },
                                                      [
                                                        _c("input", {
                                                          directives: [
                                                            {
                                                              name: "model",
                                                              rawName:
                                                                "v-model",
                                                              value:
                                                                range.price,
                                                              expression:
                                                                "range.price",
                                                            },
                                                          ],
                                                          staticClass:
                                                            "form-control",
                                                          attrs: {
                                                            type: "number",
                                                            name: "price[]",
                                                            id: "price",
                                                            placeholder:
                                                              _vm.__("price"),
                                                            min: "0",
                                                            max: "999999999",
                                                            step: "any",
                                                          },
                                                          domProps: {
                                                            value: range.price,
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
                                                                range,
                                                                "price",
                                                                $event.target
                                                                  .value
                                                              )
                                                            },
                                                          },
                                                        }),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    index === 0
                                                      ? _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "col-sm-1",
                                                          },
                                                          [
                                                            _c(
                                                              "a",
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
                                                                staticStyle: {
                                                                  cursor:
                                                                    "pointer",
                                                                },
                                                                attrs: {
                                                                  title:
                                                                    _vm.__(
                                                                      "add_row"
                                                                    ),
                                                                },
                                                                on: {
                                                                  click:
                                                                    _vm.addRow,
                                                                },
                                                              },
                                                              [
                                                                _c("i", {
                                                                  staticClass:
                                                                    "fa fa-plus-square fa-2x",
                                                                }),
                                                              ]
                                                            ),
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                    _vm._v(" "),
                                                    index !== 0
                                                      ? _c(
                                                          "div",
                                                          {
                                                            staticClass:
                                                              "col-sm-1",
                                                          },
                                                          [
                                                            _c(
                                                              "a",
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
                                                                staticStyle: {
                                                                  cursor:
                                                                    "pointer",
                                                                },
                                                                attrs: {
                                                                  title:
                                                                    _vm.__(
                                                                      "remove_row"
                                                                    ),
                                                                },
                                                                on: {
                                                                  click:
                                                                    function (
                                                                      $event
                                                                    ) {
                                                                      return _vm.remove(
                                                                        index
                                                                      )
                                                                    },
                                                                },
                                                              },
                                                              [
                                                                _c("i", {
                                                                  staticClass:
                                                                    "fa fa-times fa-2x",
                                                                }),
                                                              ]
                                                            ),
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                  ]
                                                )
                                              }
                                            ),
                                          ],
                                          2
                                        )
                                      : _vm._e(),
                                  ])
                                : _vm._e(),
                            ]
                          )
                        }),
                        1
                      )
                    : _vm._e(),
                  _vm._v(" "),
                  _c("div", { staticClass: "form-group" }, [
                    _c(
                      "button",
                      {
                        staticClass: "btn btn-primary",
                        attrs: { type: "submit" },
                      },
                      [_vm._v(" " + _vm._s(_vm.__("save")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "btn btn-secondary",
                        attrs: { type: "reset" },
                      },
                      [_vm._v(_vm._s(_vm.__("clear")))]
                    ),
                  ]),
                ],
                1
              ),
            ]),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
          _c("div", { staticClass: "card h-100" }, [
            _c("div", { staticClass: "card-header" }, [
              _c("h4", [_vm._v(_vm._s(_vm.__("map_view")))]),
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "card-body" }, [
              _c("div", { staticClass: "offset-3 mt-1" }, [
                _c(
                  "button",
                  {
                    staticClass: "badge bg-primary",
                    attrs: { type: "button", id: "remove-line" },
                  },
                  [_vm._v(_vm._s(_vm.__("remove_newly_added_line")))]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "badge bg-danger",
                    attrs: { type: "button", id: "clear-line" },
                  },
                  [_vm._v(_vm._s(_vm.__("clear_map")))]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "badge bg-success",
                    attrs: { type: "button", id: "add-line" },
                  },
                  [_vm._v(_vm._s(_vm.__("restore_old_map")))]
                ),
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticStyle: { position: "relative", overflow: "hidden" },
                  attrs: { id: "map" },
                },
                [
                  _c(
                    "GmapMap",
                    {
                      ref: "mapRef",
                      staticStyle: {
                        width: "100%",
                        height: "700px",
                        "margin-top": "5px",
                      },
                      attrs: {
                        zoom: 13,
                        center: _vm.center,
                        mapTypeControl: true,
                        drawingControl: true,
                      },
                    },
                    [
                      _vm._l(_vm.markers, function (m, index) {
                        return _c("GmapMarker", {
                          key: index,
                          attrs: {
                            position: _vm.google && m.position,
                            clickable: true,
                            draggable: true,
                          },
                          on: {
                            click: function ($event) {
                              _vm.center = m.position
                            },
                          },
                        })
                      }),
                      _vm._v(" "),
                      _c(
                        "gmap-info-window",
                        {
                          attrs: {
                            options: {
                              maxWidth: 300,
                              pixelOffset: { width: 0, height: -35 },
                            },
                            position: _vm.infoWindow.position,
                            opened: _vm.infoWindow.open,
                          },
                          on: {
                            closeclick: function ($event) {
                              _vm.infoWindow.open = false
                            },
                          },
                        },
                        [
                          _c("div", {
                            domProps: {
                              innerHTML: _vm._s(_vm.infoWindow.template),
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
              _vm.city.formatted_address
                ? _c("div", [
                    _c("span", { staticClass: "title font-weight-bolder" }, [
                      _vm._v(_vm._s(_vm.city.formatted_address)),
                    ]),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("div", { staticClass: "form-group d-none" }, [
                _c(
                  "label",
                  { staticClass: "control-label", attrs: { for: "vertices" } },
                  [
                    _vm._v(_vm._s(_vm.__("boundry_points"))),
                    _c("span", { staticClass: "text-danger text-xs" }, [
                      _vm._v("*"),
                    ]),
                  ]
                ),
                _vm._v(" "),
                _c("textarea", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.vertices,
                      expression: "vertices",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: {
                    name: "vertices",
                    id: "vertices",
                    placeholder:
                      "here will be your selected outlines latitude and longitude",
                    cols: "10",
                    rows: "2",
                  },
                  domProps: { value: _vm.vertices },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.vertices = $event.target.value
                    },
                  },
                }),
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);