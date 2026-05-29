"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Languages_Languages_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['record', 'system_types', 'supported_languages'],
  data: function data() {
    return {
      isLoading: false,
      id: this.record ? this.record.id : null,
      system_type: this.record ? this.record.system_type : "",
      supported_language: this.record ? this.record.supported_language_id : "",
      display_name: this.record ? this.record.display_name : "",
      json_file: "",
      json_data: this.record ? this.record.json_data : "",
      is_default: this.record ? this.record.is_default : 0,
      status: this.record ? this.record.status : 1,
      error: null,
      jsonDataObjects: {},
      errors: {},
      jsonFileNames: {}
    };
  },
  computed: {
    modal_title: function modal_title() {
      var title = this.id ? __('edit_language') : __('add_language');
      return title;
    }
  },
  methods: {
    showModal: function showModal() {
      this.$refs['my-modal'].show();
    },
    hideModal: function hideModal() {
      this.$refs['my-modal'].hide();
    },
    getError: function getError(key) {
      return this.errors[key] || '';
    },
    getJsonData: function getJsonData(key) {
      return this.jsonDataObjects[key] || '';
    },
    handleFileUpload: function handleFileUpload(event) {
      var _this = this;
      var systemTypeId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (systemTypeId) {
        var fileInput = event.target;
        var file = fileInput.files[0];
        if (!file) {
          return;
        }
        var fileNameKey = 'json_file_' + systemTypeId;
        this.$set(this.jsonFileNames, fileNameKey, file.name);
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var jsonData = JSON.parse(reader.result);
            var jsonDataKey = 'json_data_' + systemTypeId;
            _this.$set(_this.jsonDataObjects, jsonDataKey, JSON.stringify(jsonData, null, 2));
            _this.$set(_this.errors, jsonDataKey, "");
          } catch (error) {
            var _jsonDataKey = 'json_data_' + systemTypeId;
            _this.$set(_this.errors, _jsonDataKey, "Invalid JSON file. Please upload a valid JSON file.");
            _this.$set(_this.jsonDataObjects, _jsonDataKey, "");
            _this.$set(_this.jsonFileNames, fileNameKey, "");
            event.target.value = "";
          }
        };
        reader.readAsText(file);
      } else {
        this.json_file = this.$refs.json_file.files[0];
        if (!this.json_file) {
          return;
        }
        var _reader = new FileReader();
        _reader.onload = function () {
          try {
            var jsonData = JSON.parse(_reader.result);
            _this.json_data = JSON.stringify(jsonData);
            _this.error = "";
          } catch (error) {
            _this.error = "Invalid JSON file. Please upload a valid JSON file.";
            _this.json_data = "";
            _this.json_file = null;
            event.target.value = "";
          }
        };
        _reader.readAsText(this.json_file);
      }
    },
    dropFile: function dropFile(event) {
      var systemTypeId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      event.preventDefault();
      if (systemTypeId) {
        var ref = this.$refs['json_file_' + systemTypeId];
        if (ref && ref[0]) {
          var fileInput = ref[0];
          fileInput.files = event.dataTransfer.files;
          this.handleFileUpload({
            target: fileInput
          }, systemTypeId);
        }
      } else {
        if (this.$refs.json_file) {
          this.$refs.json_file.files = event.dataTransfer.files;
          this.handleFileUpload({
            target: this.$refs.json_file
          });
        }
      }
      if (event.currentTarget) {
        event.currentTarget.classList.add('bg-gray-100');
        event.currentTarget.classList.remove('bg-green-300');
      }
    },
    saveRecord: function saveRecord() {
      var _this2 = this;
      var vm = this;
      if (!this.supported_language) {
        this.showError("Supported language is required.");
        return;
      }
      if (!this.id) {
        var hasAllJsonData = true;
        var missingSystemTypes = [];
        this.system_types.forEach(function (systemType) {
          var jsonDataKey = 'json_data_' + systemType.id;
          if (!_this2.jsonDataObjects[jsonDataKey]) {
            hasAllJsonData = false;
            missingSystemTypes.push(systemType.name);
          }
        });
        if (!hasAllJsonData) {
          this.showError("Please upload JSON files for all system types. Missing: " + missingSystemTypes.join(", "));
          return;
        }
      } else {
        if (!this.json_data) {
          this.showError("JSON data is required.");
          return;
        }
      }
      this.isLoading = true;
      var formData = new FormData();
      if (this.id) {
        formData.append('id', this.id);
        formData.append('system_type', this.system_type);
        formData.append('supported_language', this.supported_language);
        formData.append('display_name', this.display_name);
        formData.append('json_data', this.json_data);
        formData.append('is_default', this.is_default);
        formData.append('status', this.status);
        var url = this.$apiUrl + '/languages/update';
        axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, formData).then(function (res) {
          var data = res.data;
          if (data.status === 1) {
            _this2.$eventBus.$emit('recordSaved', data.message);
            vm.$router.push({
              path: '/languages'
            });
            _this2.hideModal();
          } else {
            vm.showError(data.message);
            vm.isLoading = false;
          }
        })["catch"](function (error) {
          vm.isLoading = false;
          var errorMessage = "Something went wrong!";
          if (error.response && error.response.data) {
            if (error.response.data.message) {
              errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
            }
          } else if (error.request && error.request.statusText) {
            errorMessage = error.request.statusText;
          } else if (error.message) {
            errorMessage = error.message;
          }
          _this2.showError(errorMessage);
        });
      } else {
        formData.append('supported_language', this.supported_language);
        formData.append('display_name', this.display_name);
        formData.append('is_default', this.is_default);
        formData.append('status', this.status);
        this.system_types.forEach(function (systemType) {
          var jsonDataKey = 'json_data_' + systemType.id;
          if (_this2.jsonDataObjects[jsonDataKey]) {
            formData.append(jsonDataKey, _this2.jsonDataObjects[jsonDataKey]);
          }
        });
        var _url = this.$apiUrl + '/languages/save';
        axios__WEBPACK_IMPORTED_MODULE_0___default().post(_url, formData).then(function (res) {
          var data = res.data;
          if (data.status === 1) {
            _this2.$eventBus.$emit('recordSaved', data.message);
            vm.$router.push({
              path: '/languages'
            });
            _this2.hideModal();
          } else {
            vm.showError(data.message);
            vm.isLoading = false;
          }
        })["catch"](function (error) {
          vm.isLoading = false;
          var errorMessage = "Something went wrong!";
          if (error.response && error.response.data) {
            if (error.response.data.message) {
              errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
              errorMessage = error.response.data.error;
            }
          } else if (error.request && error.request.statusText) {
            errorMessage = error.request.statusText;
          } else if (error.message) {
            errorMessage = error.message;
          }
          _this2.showError(errorMessage);
        });
      }
    }
  },
  mounted: function mounted() {
    this.showModal();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=script&lang=js":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=script&lang=js ***!
  \*******************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['record', 'system_type'],
  data: function data() {
    var initialJsonData = "{}";
    if (this.record && this.record.json_data) {
      try {
        var parsed = typeof this.record.json_data === 'string' ? JSON.parse(this.record.json_data) : this.record.json_data;
        initialJsonData = JSON.stringify(parsed, null, 2);
      } catch (e) {
        initialJsonData = this.record.json_data;
      }
    }
    return {
      isLoading: false,
      id: this.record ? this.record.id : null,
      system_type_id: this.record ? this.record.system_type : this.system_type ? this.system_type.id : null,
      supported_language_id: this.record ? this.record.supported_language_id : null,
      json_data: initialJsonData,
      error: null
    };
  },
  computed: {
    modal_title: function modal_title() {
      var title = __('edit_json_data');
      if (this.system_type) {
        title += ' - ' + this.system_type.name;
      }
      return title;
    }
  },
  methods: {
    showModal: function showModal() {
      this.$refs['json-edit-modal'].show();
    },
    hideModal: function hideModal() {
      this.$refs['json-edit-modal'].hide();
    },
    validateJson: function validateJson() {
      if (!this.json_data || this.json_data.trim() === '') {
        this.error = null;
        return;
      }
      try {
        JSON.parse(this.json_data);
        this.error = null;
      } catch (e) {
        this.error = __('invalid_json_format') + ': ' + e.message;
      }
    },
    saveRecord: function saveRecord() {
      var _this = this;
      if (!this.json_data || this.json_data.trim() === '') {
        this.showError(__('json_data_is_required'));
        return;
      }
      try {
        JSON.parse(this.json_data);
      } catch (e) {
        this.showError(__('invalid_json_format') + ': ' + e.message);
        return;
      }
      this.isLoading = true;
      var formData = new FormData();
      if (this.id) {
        formData.append('id', this.id);
      }
      formData.append('system_type', this.system_type_id);
      formData.append('supported_language', this.supported_language_id);
      try {
        var parsedJson = JSON.parse(this.json_data);
        formData.append('json_data', JSON.stringify(parsedJson));
      } catch (e) {
        formData.append('json_data', this.json_data);
      }
      formData.append('display_name', this.record ? this.record.display_name : '');
      formData.append('is_default', this.record ? this.record.is_default : 0);
      formData.append('status', this.record ? this.record.status : 1);
      var url = this.$apiUrl + '/languages/update_json';
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, formData).then(function (res) {
        var data = res.data;
        if (data.status === 1) {
          _this.$eventBus.$emit('recordSaved', data.message);
          _this.hideModal();
          _this.$emit('jsonSaved');
          _this.$emit('modalClose');
        } else {
          _this.showError(data.message);
          _this.isLoading = false;
        }
      })["catch"](function (error) {
        var _error$request;
        _this.isLoading = false;
        if (error !== null && error !== void 0 && (_error$request = error.request) !== null && _error$request !== void 0 && _error$request.statusText) {
          _this.showError(error.request.statusText);
        } else if (error.message) {
          _this.showError(error.message);
        } else {
          _this.showError(__("something_went_wrong"));
        }
      });
    }
  },
  mounted: function mounted() {
    this.showModal();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Languages.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Languages.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue */ "./resources/js/views/Languages/Edit.vue");
/* harmony import */ var _JsonEdit_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JsonEdit.vue */ "./resources/js/views/Languages/JsonEdit.vue");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    'app-edit-record': _Edit_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    'app-json-edit': _JsonEdit_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      fields: [{
        key: 'id',
        label: __('id'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'desc'
      }, {
        key: 'name',
        label: __('name'),
        "class": 'text-center'
      }, {
        key: 'code',
        label: __('code'),
        "class": 'text-center'
      }, {
        key: 'is_default',
        label: __('default'),
        "class": 'text-center'
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      languageFields: [{
        key: 'name',
        label: __('language'),
        "class": 'text-center text-nowrap',
        sortable: true
      }, {
        key: 'code',
        label: __('code'),
        "class": 'text-center text-nowrap',
        sortable: true
      }, {
        key: 'is_default',
        label: __('default'),
        "class": 'text-center text-nowrap',
        sortable: true
      }, {
        key: 'status',
        label: __('status'),
        "class": 'text-center text-nowrap',
        sortable: true
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center text-nowrap'
      }],
      totalRows: 1,
      currentPage: 1,
      perPage: this.$perPage,
      pageOptions: this.$pageOptions,
      sortBy: 'id',
      sortDesc: true,
      sortDirection: 'desc',
      filter: null,
      filterOn: ['name', 'code'],
      page: 1,
      isLoading: false,
      sectionStyle: 'style_1',
      max_visible_units: 12,
      max_col_in_single_row: 3,
      languages: [],
      system_types: [],
      system_type: "",
      supported_languages: [],
      supported_languages_fields: [{
        key: 'id',
        label: __('id'),
        "class": 'text-center',
        sortable: true,
        sortDirection: 'asc'
      }, {
        key: 'name',
        label: __('name'),
        "class": 'text-center'
      }, {
        key: 'code',
        label: __('code'),
        "class": 'text-center'
      }, {
        key: 'type',
        label: __('type'),
        "class": 'text-center'
      }],
      sortBySL: 'id',
      sortDescSL: false,
      sortDirectionSL: 'asc',
      filterSL: null,
      showSupportedLanguages: false,
      isSystemRefreshing: false,
      create_new: null,
      edit_record: null,
      selectedLanguageGroup: null,
      editDisplayName: '',
      editIsDefault: 0,
      editStatus: 1,
      isSaving: false,
      jsonEditRecord: null,
      jsonEditSystemType: null
    };
  },
  computed: {
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
    },
    groupedLanguages: function groupedLanguages() {
      var grouped = {};
      this.languages.forEach(function (lang) {
        var key = lang.supported_language_id;
        if (!grouped[key]) {
          grouped[key] = {
            id: lang.supported_language_id,
            supported_language_id: lang.supported_language_id,
            name: lang.name,
            code: lang.code,
            type: lang.type,
            display_name: lang.display_name,
            has_default: false,
            status: lang.status,
            languages: []
          };
        }
        grouped[key].languages.push(lang);
        if (lang.is_default == 1) {
          grouped[key].has_default = true;
        }
      });
      return Object.values(grouped).sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    }
  },
  mounted: function mounted() {
    // Set the initial number of items
    this.totalRows = this.groupedLanguages.length;
  },
  watch: {
    $route: function $route(to, from) {
      this.showCreateModal();
    },
    groupedLanguages: {
      handler: function handler(newVal) {
        this.totalRows = newVal.length;
      },
      immediate: true
    }
  },
  created: function created() {
    var _this = this;
    this.showCreateModal();
    this.$eventBus.$on('recordSaved', function (message) {
      _this.showMessage('success', message);
      _this.getRecords();
      _this.create_new = null;
    });
    this.getRecords();
    this.getSupportedLanguages();
  },
  methods: {
    getRecords: function getRecords() {
      var _this2 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + '/languages').then(function (response) {
        _this2.isLoading = false;
        var data = response.data;
        _this2.languages = data.data || [];
      })["catch"](function (error) {
        var _error$request;
        _this2.isLoading = false;
        if (error !== null && error !== void 0 && (_error$request = error.request) !== null && _error$request !== void 0 && _error$request.statusText) {
          _this2.showError(error.request.statusText);
        } else if (error.message) {
          _this2.showError(error.message);
        } else {
          _this2.showError("Something went wrong!");
        }
      });
    },
    getSupportedLanguages: function getSupportedLanguages() {
      var _this3 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_2___default().get(this.$apiUrl + '/languages/supported_languages').then(function (response) {
        _this3.isLoading = false;
        var data = response.data;
        _this3.system_types = data.data.system_types;
        _this3.system_types = _this3.system_types; // this line is remove System type admin panel.

        _this3.supported_languages = data.data.supported_languages;
      })["catch"](function (error) {
        var _error$request2;
        _this3.isLoading = false;
        if (error !== null && error !== void 0 && (_error$request2 = error.request) !== null && _error$request2 !== void 0 && _error$request2.statusText) {
          _this3.showError(error.request.statusText);
        } else if (error.message) {
          _this3.showError(error.message);
        } else {
          _this3.showError("Something went wrong!");
        }
      });
    },
    downloadJSON: function downloadJSON(row) {
      var data = this.convertInJsonData(row.json_data);
      var json = JSON.stringify(data, null, 2);
      var blob = new Blob([json], {
        type: 'application/json'
      });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = row.code + '.json';
      link.click();

      // Clean up the object URL
      URL.revokeObjectURL(url);
    },
    convertInJsonData: function convertInJsonData(data) {
      data = JSON.parse(data);
      if (Array.isArray(data)) {
        data = data[0];
      }
      return data;
    },
    deleteRecord: function deleteRecord(index, id) {
      var _this4 = this;
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
          _this4.isLoading = true;
          var postData = {
            id: id
          };
          axios__WEBPACK_IMPORTED_MODULE_2___default().post(_this4.$apiUrl + '/languages/delete', postData).then(function (response) {
            _this4.isLoading = false;
            var data = response.data;
            if (data.status === 1) {
              _this4.getRecords();
              _this4.showMessage('success', data.message);
            } else {
              _this4.showError(data.message);
            }
          })["catch"](function (error) {
            var _error$request3;
            _this4.isLoading = false;
            if (error !== null && error !== void 0 && (_error$request3 = error.request) !== null && _error$request3 !== void 0 && _error$request3.statusText) {
              _this4.showError(error.request.statusText);
            } else if (error.message) {
              _this4.showError(error.message);
            } else {
              _this4.showError("Something went wrong!");
            }
          });
        }
      });
    },
    showCreateModal: function showCreateModal() {
      var create = this.$route.params.create;
      if (create) {
        this.create_new = true;
      }
    },
    hideModal: function hideModal() {
      this.create_new = false;
      this.edit_record = false;
      this.$router.push({
        path: '/languages'
      });
    },
    openEditModal: function openEditModal(languageGroup) {
      var _languageGroup$langua, _languageGroup$langua2;
      this.selectedLanguageGroup = languageGroup;
      this.editDisplayName = languageGroup.display_name || '';
      this.editIsDefault = languageGroup.has_default ? 1 : 0;
      // Get status from the first language in the group (all should have the same status)
      this.editStatus = (_languageGroup$langua = (_languageGroup$langua2 = languageGroup.languages[0]) === null || _languageGroup$langua2 === void 0 ? void 0 : _languageGroup$langua2.status) !== null && _languageGroup$langua !== void 0 ? _languageGroup$langua : 1;
      this.$refs['edit-language-modal'].show();
    },
    closeEditModal: function closeEditModal() {
      this.selectedLanguageGroup = null;
      this.editDisplayName = '';
      this.editIsDefault = 0;
      this.editStatus = 1;
      this.$refs['edit-language-modal'].hide();
    },
    openJsonEditModal: function openJsonEditModal(systemType, languageGroup) {
      var langRecord = languageGroup.languages.find(function (l) {
        return l.system_type == systemType.id;
      });
      if (langRecord) {
        this.jsonEditRecord = langRecord;
        this.jsonEditSystemType = systemType;
      } else {
        this.jsonEditRecord = {
          id: null,
          supported_language_id: languageGroup.supported_language_id,
          system_type: systemType.id,
          json_data: '{}',
          display_name: languageGroup.display_name,
          is_default: 0,
          status: 1
        };
        this.jsonEditSystemType = systemType;
      }
    },
    closeJsonEditModal: function closeJsonEditModal() {
      this.jsonEditRecord = null;
      this.jsonEditSystemType = null;
      this.getRecords();
    },
    saveLanguageSettings: function saveLanguageSettings() {
      var _this5 = this;
      if (!this.selectedLanguageGroup) return;
      this.isSaving = true;
      var updatePromises = this.selectedLanguageGroup.languages.map(function (lang) {
        var formData = new FormData();
        formData.append('id', lang.id);
        formData.append('system_type', lang.system_type);
        formData.append('supported_language', lang.supported_language_id);
        formData.append('display_name', _this5.editDisplayName);
        formData.append('json_data', lang.json_data);
        formData.append('is_default', _this5.editIsDefault);
        formData.append('status', _this5.editStatus);
        return axios__WEBPACK_IMPORTED_MODULE_2___default().post(_this5.$apiUrl + '/languages/update', formData);
      });
      Promise.all(updatePromises).then(function (responses) {
        var _responses$, _responses$$data;
        for (var i = 0; i < responses.length; i++) {
          var response = responses[i];
          var data = response.data;
          if (data.status !== 1) {
            _this5.isSaving = false;
            var errorMessage = data.message || __('something_went_wrong');
            _this5.showError(errorMessage);
            return;
          }
        }
        _this5.isSaving = false;
        var message = ((_responses$ = responses[0]) === null || _responses$ === void 0 ? void 0 : (_responses$$data = _responses$.data) === null || _responses$$data === void 0 ? void 0 : _responses$$data.message) || __('language_updated_successfully');
        _this5.showMessage('success', message);
        _this5.closeEditModal();
        _this5.getRecords();
      })["catch"](function (error) {
        _this5.isSaving = false;
        var errorMessage = __('something_went_wrong');
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        } else if (error.request && error.request.statusText) {
          errorMessage = error.request.statusText;
        } else if (error.message) {
          errorMessage = error.message;
        }
        _this5.showError(errorMessage);
      });
    },
    // Get system type name by ID
    getSystemTypeName: function getSystemTypeName(systemTypeId) {
      var systemType = this.system_types.find(function (st) {
        return st.id == systemTypeId;
      });
      return systemType ? systemType.name : '';
    },
    downloadSampleFile: function downloadSampleFile(fileName, systemTypeName) {
      var fileUrl = this.$baseUrl + '/sample-file/' + fileName;

      // Create a temporary anchor element to trigger download
      var link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      this.showMessage('success', __('sample_file_downloaded') + ': ' + systemTypeName);
    },
    deleteLanguageGroup: function deleteLanguageGroup(languageGroup) {
      var _this6 = this;
      var languageIds = languageGroup.languages.map(function (l) {
        return l.id;
      });
      var languageName = languageGroup.name;
      this.$swal.fire({
        title: __('are_you_sure'),
        text: __('you_will_not_be_able_to_revert_this'),
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        if (result.value) {
          _this6.isLoading = true;
          // Delete all languages for this group
          var deletePromises = languageIds.map(function (id) {
            return axios__WEBPACK_IMPORTED_MODULE_2___default().post(_this6.$apiUrl + '/languages/delete', {
              id: id
            });
          });
          Promise.all(deletePromises).then(function (responses) {
            _this6.isLoading = false;
            _this6.getRecords();
            var failedResponse = responses.find(function (r) {
              return r.data && r.data.status !== 1;
            });
            if (failedResponse) {
              _this6.showError(failedResponse.data.message || __('something_went_wrong'));
            } else {
              var _responses$2, _responses$2$data;
              var message = ((_responses$2 = responses[0]) === null || _responses$2 === void 0 ? void 0 : (_responses$2$data = _responses$2.data) === null || _responses$2$data === void 0 ? void 0 : _responses$2$data.message) || __('language_deleted_successfully');
              _this6.showMessage('success', message);
            }
          })["catch"](function (error) {
            _this6.isLoading = false;
            _this6.getRecords();
            if (error.response && error.response.data && error.response.data.message) {
              _this6.showError(error.response.data.message);
            } else {
              _this6.showError(__('something_went_wrong'));
            }
          });
        }
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.$eventBus.$off('recordSaved');
  }
});

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.image_preview[data-v-bc0a9106] {\n    margin-top: 5px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
___CSS_LOADER_EXPORT___.push([module.id, "\n.image_preview[data-v-4fbf89f6] {\n    margin-top: 5px;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_bc0a9106_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_bc0a9106_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_bc0a9106_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_style_index_0_id_4fbf89f6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_style_index_0_id_4fbf89f6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_style_index_0_id_4fbf89f6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/views/Languages/Edit.vue":
/*!***********************************************!*\
  !*** ./resources/js/views/Languages/Edit.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Edit_vue_vue_type_template_id_bc0a9106_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Edit.vue?vue&type=template&id=bc0a9106&scoped=true */ "./resources/js/views/Languages/Edit.vue?vue&type=template&id=bc0a9106&scoped=true");
/* harmony import */ var _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Edit.vue?vue&type=script&lang=js */ "./resources/js/views/Languages/Edit.vue?vue&type=script&lang=js");
/* harmony import */ var _Edit_vue_vue_type_style_index_0_id_bc0a9106_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css */ "./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Edit_vue_vue_type_template_id_bc0a9106_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Edit_vue_vue_type_template_id_bc0a9106_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "bc0a9106",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Languages/Edit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Languages/JsonEdit.vue":
/*!***************************************************!*\
  !*** ./resources/js/views/Languages/JsonEdit.vue ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _JsonEdit_vue_vue_type_template_id_4fbf89f6_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./JsonEdit.vue?vue&type=template&id=4fbf89f6&scoped=true */ "./resources/js/views/Languages/JsonEdit.vue?vue&type=template&id=4fbf89f6&scoped=true");
/* harmony import */ var _JsonEdit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JsonEdit.vue?vue&type=script&lang=js */ "./resources/js/views/Languages/JsonEdit.vue?vue&type=script&lang=js");
/* harmony import */ var _JsonEdit_vue_vue_type_style_index_0_id_4fbf89f6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css */ "./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _JsonEdit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _JsonEdit_vue_vue_type_template_id_4fbf89f6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _JsonEdit_vue_vue_type_template_id_4fbf89f6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "4fbf89f6",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Languages/JsonEdit.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Languages/Languages.vue":
/*!****************************************************!*\
  !*** ./resources/js/views/Languages/Languages.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Languages_vue_vue_type_template_id_51008a38__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Languages.vue?vue&type=template&id=51008a38 */ "./resources/js/views/Languages/Languages.vue?vue&type=template&id=51008a38");
/* harmony import */ var _Languages_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Languages.vue?vue&type=script&lang=js */ "./resources/js/views/Languages/Languages.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Languages_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Languages_vue_vue_type_template_id_51008a38__WEBPACK_IMPORTED_MODULE_0__.render,
  _Languages_vue_vue_type_template_id_51008a38__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Languages/Languages.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Languages/Edit.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./resources/js/views/Languages/Edit.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Languages/JsonEdit.vue?vue&type=script&lang=js":
/*!***************************************************************************!*\
  !*** ./resources/js/views/Languages/JsonEdit.vue?vue&type=script&lang=js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JsonEdit.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Languages/Languages.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/views/Languages/Languages.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Languages_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Languages.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Languages.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Languages_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css":
/*!*******************************************************************************************************!*\
  !*** ./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_style_index_0_id_bc0a9106_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=style&index=0&id=bc0a9106&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css":
/*!***********************************************************************************************************!*\
  !*** ./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_style_index_0_id_4fbf89f6_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader/dist/cjs.js!../../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=style&index=0&id=4fbf89f6&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/views/Languages/Edit.vue?vue&type=template&id=bc0a9106&scoped=true":
/*!*****************************************************************************************!*\
  !*** ./resources/js/views/Languages/Edit.vue?vue&type=template&id=bc0a9106&scoped=true ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_bc0a9106_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_bc0a9106_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Edit_vue_vue_type_template_id_bc0a9106_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Edit.vue?vue&type=template&id=bc0a9106&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=template&id=bc0a9106&scoped=true");


/***/ }),

/***/ "./resources/js/views/Languages/JsonEdit.vue?vue&type=template&id=4fbf89f6&scoped=true":
/*!*********************************************************************************************!*\
  !*** ./resources/js/views/Languages/JsonEdit.vue?vue&type=template&id=4fbf89f6&scoped=true ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_template_id_4fbf89f6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_template_id_4fbf89f6_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_JsonEdit_vue_vue_type_template_id_4fbf89f6_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./JsonEdit.vue?vue&type=template&id=4fbf89f6&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=template&id=4fbf89f6&scoped=true");


/***/ }),

/***/ "./resources/js/views/Languages/Languages.vue?vue&type=template&id=51008a38":
/*!**********************************************************************************!*\
  !*** ./resources/js/views/Languages/Languages.vue?vue&type=template&id=51008a38 ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Languages_vue_vue_type_template_id_51008a38__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Languages_vue_vue_type_template_id_51008a38__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Languages_vue_vue_type_template_id_51008a38__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Languages.vue?vue&type=template&id=51008a38 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Languages.vue?vue&type=template&id=51008a38");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=template&id=bc0a9106&scoped=true":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Edit.vue?vue&type=template&id=bc0a9106&scoped=true ***!
  \********************************************************************************************************************************************************************************************************************************/
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
      attrs: {
        title: _vm.modal_title,
        size: "lg",
        scrollable: "",
        "no-close-on-backdrop": "",
        "no-fade": "",
        static: "",
      },
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
              on: {
                click: function ($event) {
                  return _vm.$refs["dummy_submit"].click()
                },
              },
            },
            [
              _vm._v(_vm._s(_vm.__("save")) + "\n            "),
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
          _c(
            "div",
            { staticClass: "row" },
            [
              _vm.id
                ? _c("div", { staticClass: "form-group" }, [
                    _c("label", { attrs: { for: "seller" } }, [
                      _vm._v(_vm._s(_vm.__("system_type"))),
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.system_type,
                            expression: "system_type",
                          },
                        ],
                        staticClass: "form-control form-select",
                        attrs: { name: "seller", id: "seller", disabled: "" },
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
                            _vm.system_type = $event.target.multiple
                              ? $$selectedVal
                              : $$selectedVal[0]
                          },
                        },
                      },
                      [
                        _c("option", { attrs: { value: "" } }, [
                          _vm._v(_vm._s(_vm.__("select_system_type"))),
                        ]),
                        _vm._v(" "),
                        _vm._l(_vm.system_types, function (item) {
                          return _c(
                            "option",
                            { domProps: { value: item.id } },
                            [_vm._v(_vm._s(item.name))]
                          )
                        }),
                      ],
                      2
                    ),
                    _vm._v(" "),
                    _c("small", { staticClass: "text-muted" }, [
                      _vm._v(
                        _vm._s(
                          _vm.__("system_type_cannot_be_changed_when_editing")
                        )
                      ),
                    ]),
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("div", { staticClass: "row" }, [
                _c("div", { staticClass: "form-group col-12 col-lg-6" }, [
                  _c("label", { attrs: { for: "supported_language" } }, [
                    _vm._v(_vm._s(_vm.__("supported_language"))),
                  ]),
                  _c("span", { staticClass: "text-danger" }, [_vm._v("*")]),
                  _vm._v(" "),
                  _c(
                    "select",
                    {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.supported_language,
                          expression: "supported_language",
                        },
                      ],
                      staticClass: "form-control form-select",
                      attrs: {
                        name: "supported_language",
                        id: "supported_language",
                        disabled: _vm.id,
                      },
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
                          _vm.supported_language = $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        },
                      },
                    },
                    [
                      _c("option", { attrs: { value: "" } }, [
                        _vm._v(_vm._s(_vm.__("select_supported_language"))),
                      ]),
                      _vm._v(" "),
                      _vm._l(_vm.supported_languages, function (item) {
                        return _c("option", { domProps: { value: item.id } }, [
                          _vm._v(_vm._s(item.name)),
                        ])
                      }),
                    ],
                    2
                  ),
                  _vm._v(" "),
                  _vm.id
                    ? _c("small", { staticClass: "text-muted" }, [
                        _vm._v(
                          _vm._s(
                            _vm.__(
                              "supported_language_cannot_be_changed_when_editing"
                            )
                          )
                        ),
                      ])
                    : _vm._e(),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group col-12 col-lg-6" }, [
                  _c("label", { attrs: { for: "display_name" } }, [
                    _vm._v(_vm._s(_vm.__("display_name"))),
                    _c("span", { staticClass: "text-danger" }, [_vm._v("*")]),
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.display_name,
                        expression: "display_name",
                      },
                    ],
                    staticClass: "form-control",
                    attrs: {
                      name: "display_name",
                      id: "display_name",
                      placeholder: _vm.__("display_name"),
                    },
                    domProps: { value: _vm.display_name },
                    on: {
                      input: function ($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.display_name = $event.target.value
                      },
                    },
                  }),
                ]),
              ]),
              _vm._v(" "),
              !_vm.id
                ? _vm._l(_vm.system_types, function (systemType) {
                    return _c(
                      "div",
                      {
                        key: systemType.id,
                        staticClass: "form-group col-12 col-lg-6",
                      },
                      [
                        _c(
                          "label",
                          { attrs: { for: "json_file_" + systemType.id } },
                          [
                            _vm._v(
                              _vm._s(_vm.__("json_file")) +
                                " - " +
                                _vm._s(systemType.name) +
                                " "
                            ),
                            _c("span", { staticClass: "text-danger" }, [
                              _vm._v("*"),
                            ]),
                          ]
                        ),
                        _vm._v(" "),
                        _vm.getError("json_data_" + systemType.id)
                          ? _c(
                              "span",
                              { staticClass: "text-danger d-block mb-1" },
                              [
                                _vm._v(
                                  _vm._s(
                                    _vm.getError("json_data_" + systemType.id)
                                  )
                                ),
                              ]
                            )
                          : _vm._e(),
                        _vm._v(" "),
                        _c("input", {
                          ref: "json_file_" + systemType.id,
                          refInFor: true,
                          staticClass: "file-input",
                          attrs: {
                            type: "file",
                            name: "json_file_" + systemType.id,
                            id: "json_file_" + systemType.id,
                            accept: "application/json",
                          },
                          on: {
                            change: function ($event) {
                              return _vm.handleFileUpload($event, systemType.id)
                            },
                          },
                        }),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass: "file-input-div bg-gray-100",
                            on: {
                              click: function () {
                                var ref =
                                  _vm.$refs["json_file_" + systemType.id]
                                if (ref && ref[0]) {
                                  ref[0].click()
                                }
                              },
                              drop: function ($event) {
                                return _vm.dropFile($event, systemType.id)
                              },
                              dragover: _vm.$dragoverFile,
                              dragleave: _vm.$dragleaveFile,
                            },
                          },
                          [
                            _vm.jsonFileNames["json_file_" + systemType.id]
                              ? [
                                  _c("label", [
                                    _vm._v(
                                      _vm._s(_vm.__("selected_file_name")) +
                                        ": " +
                                        _vm._s(
                                          _vm.jsonFileNames[
                                            "json_file_" + systemType.id
                                          ]
                                        )
                                    ),
                                  ]),
                                ]
                              : [
                                  _c("label", [
                                    _c("i", {
                                      staticClass:
                                        "fa fa-cloud-upload-alt fa-2x",
                                    }),
                                  ]),
                                  _vm._v(" "),
                                  _c("label", [
                                    _vm._v(
                                      _vm._s(
                                        _vm.__(
                                          "drop_files_here_or_click_to_upload"
                                        )
                                      )
                                    ),
                                  ]),
                                ],
                          ],
                          2
                        ),
                        _vm._v(" "),
                        _vm.getJsonData("json_data_" + systemType.id)
                          ? _c("div", { staticClass: "form-group mt-2" }, [
                              _c(
                                "label",
                                {
                                  attrs: { for: "json_data_" + systemType.id },
                                },
                                [
                                  _vm._v(
                                    _vm._s(_vm.__("json_data")) +
                                      " - " +
                                      _vm._s(systemType.name)
                                  ),
                                ]
                              ),
                              _vm._v(" "),
                              _c("textarea", {
                                staticClass: "form-control",
                                attrs: {
                                  readonly: "",
                                  rows: "5",
                                  name: "json_data_" + systemType.id,
                                  id: "json_data_" + systemType.id,
                                },
                                domProps: {
                                  value: _vm.getJsonData(
                                    "json_data_" + systemType.id
                                  ),
                                },
                              }),
                            ])
                          : _vm._e(),
                      ]
                    )
                  })
                : [
                    _c("div", { staticClass: "form-group" }, [
                      _c("label", { attrs: { for: "json_file" } }, [
                        _vm._v(_vm._s(_vm.__("json_file"))),
                      ]),
                      _vm._v(" "),
                      _vm.error
                        ? _c(
                            "span",
                            { staticClass: "text-danger d-block mb-1" },
                            [_vm._v(_vm._s(_vm.error))]
                          )
                        : _vm._e(),
                      _vm._v(" "),
                      _c("input", {
                        ref: "json_file",
                        staticClass: "file-input",
                        attrs: {
                          type: "file",
                          name: "json_file",
                          id: "json_file",
                          accept: "application/json",
                        },
                        on: {
                          change: function ($event) {
                            return _vm.handleFileUpload($event)
                          },
                        },
                      }),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "file-input-div bg-gray-100",
                          on: {
                            click: function ($event) {
                              return _vm.$refs.json_file.click()
                            },
                            drop: function ($event) {
                              return _vm.dropFile($event)
                            },
                            dragover: _vm.$dragoverFile,
                            dragleave: _vm.$dragleaveFile,
                          },
                        },
                        [
                          _vm.json_file && _vm.json_file.name
                            ? [
                                _c("label", [
                                  _vm._v(
                                    _vm._s(_vm.__("selected_file_name")) +
                                      ": " +
                                      _vm._s(_vm.json_file.name)
                                  ),
                                ]),
                              ]
                            : [
                                _c("label", [
                                  _c("i", {
                                    staticClass: "fa fa-cloud-upload-alt fa-2x",
                                  }),
                                ]),
                                _vm._v(" "),
                                _c("label", [
                                  _vm._v(
                                    _vm._s(
                                      _vm.__(
                                        "drop_files_here_or_click_to_upload"
                                      )
                                    )
                                  ),
                                ]),
                              ],
                        ],
                        2
                      ),
                      _vm._v(" "),
                      _vm.json_data
                        ? _c("div", { staticClass: "form-group mt-2" }, [
                            _c("label", { attrs: { for: "json_data" } }, [
                              _vm._v(_vm._s(_vm.__("json_data"))),
                            ]),
                            _vm._v(" "),
                            _c(
                              "textarea",
                              {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.json_data,
                                    expression: "json_data",
                                  },
                                ],
                                staticClass: "form-control",
                                attrs: {
                                  readonly: "",
                                  rows: "10",
                                  name: "json_data",
                                  id: "json_data",
                                },
                                domProps: { value: _vm.json_data },
                                on: {
                                  input: function ($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.json_data = $event.target.value
                                  },
                                },
                              },
                              [_vm._v(_vm._s(_vm.json_data))]
                            ),
                          ])
                        : _vm._e(),
                    ]),
                  ],
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.is_default,
                      expression: "is_default",
                    },
                  ],
                  staticClass: "form-check-input",
                  attrs: {
                    name: "is_default",
                    id: "is_default",
                    "true-value": "1",
                    "false-value": "0",
                    type: "checkbox",
                  },
                  domProps: {
                    checked: _vm.is_default,
                    checked: Array.isArray(_vm.is_default)
                      ? _vm._i(_vm.is_default, null) > -1
                      : _vm._q(_vm.is_default, "1"),
                  },
                  on: {
                    change: function ($event) {
                      var $$a = _vm.is_default,
                        $$el = $event.target,
                        $$c = $$el.checked ? "1" : "0"
                      if (Array.isArray($$a)) {
                        var $$v = null,
                          $$i = _vm._i($$a, $$v)
                        if ($$el.checked) {
                          $$i < 0 && (_vm.is_default = $$a.concat([$$v]))
                        } else {
                          $$i > -1 &&
                            (_vm.is_default = $$a
                              .slice(0, $$i)
                              .concat($$a.slice($$i + 1)))
                        }
                      } else {
                        _vm.is_default = $$c
                      }
                    },
                  },
                }),
                _vm._v(" "),
                _c("label", { attrs: { for: "is_default" } }, [
                  _vm._v(_vm._s(_vm.__("set_as_a_default_language"))),
                ]),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("status")))]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "col-md-9 text-left mt-1" },
                  [
                    _c("b-form-radio-group", {
                      attrs: {
                        options: [
                          { text: _vm.__("deactivate"), value: 0 },
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
              ]),
            ],
            2
          ),
          _vm._v(" "),
          _c("button", {
            ref: "dummy_submit",
            staticStyle: { display: "none" },
          }),
        ]
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=template&id=4fbf89f6&scoped=true":
/*!************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/JsonEdit.vue?vue&type=template&id=4fbf89f6&scoped=true ***!
  \************************************************************************************************************************************************************************************************************************************/
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
      ref: "json-edit-modal",
      attrs: {
        title: _vm.modal_title,
        size: "lg",
        scrollable: "",
        "no-close-on-backdrop": "",
        "no-fade": "",
        static: "",
      },
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
              on: {
                click: function ($event) {
                  return _vm.$refs["dummy_submit"].click()
                },
              },
            },
            [
              _vm._v(_vm._s(_vm.__("save")) + "\n            "),
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
          _c("div", { staticClass: "row" }, [
            _c("div", { staticClass: "form-group col-md-12" }, [
              _c("label", { attrs: { for: "json_data" } }, [
                _vm._v(
                  _vm._s(_vm.system_type ? _vm.system_type.name : "") + " "
                ),
                _c("span", { staticClass: "text-danger" }, [_vm._v("*")]),
              ]),
              _vm._v(" "),
              _c("textarea", {
                directives: [
                  {
                    name: "model",
                    rawName: "v-model",
                    value: _vm.json_data,
                    expression: "json_data",
                  },
                ],
                staticClass: "form-control",
                class: { "is-invalid": _vm.error },
                attrs: {
                  rows: "20",
                  spellcheck: "false",
                  name: "json_data",
                  id: "json_data",
                  placeholder: '{"key": "value"}',
                },
                domProps: { value: _vm.json_data },
                on: {
                  input: [
                    function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.json_data = $event.target.value
                    },
                    _vm.validateJson,
                  ],
                },
              }),
              _vm._v(" "),
              !_vm.error && _vm.json_data
                ? _c("small", { staticClass: "text-success d-block mt-1" }, [
                    _c("i", { staticClass: "fa fa-check-circle" }),
                    _vm._v(
                      " " +
                        _vm._s(_vm.__("valid_json_format")) +
                        "\n                "
                    ),
                  ])
                : _vm._e(),
            ]),
          ]),
          _vm._v(" "),
          _c("button", {
            ref: "dummy_submit",
            staticStyle: { display: "none" },
          }),
        ]
      ),
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Languages.vue?vue&type=template&id=51008a38":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Languages/Languages.vue?vue&type=template&id=51008a38 ***!
  \*************************************************************************************************************************************************************************************************************************/
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
    [
      _c("div", { staticClass: "page-heading" }, [
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-6 order-md-1 order-last" }, [
            _c("h3", [_vm._v(_vm._s(_vm.__("manage_languages")))]),
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
                    [_vm._v(_vm._s(_vm.__("manage_languages")))]
                  ),
                ]),
              ]
            ),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 col-md-12 order-md-1 order-last" }, [
            _c("div", { staticClass: "card" }, [
              _c("div", { staticClass: "card-header" }, [
                _c("h4", [_vm._v(_vm._s(_vm.__("languages")))]),
                _vm._v(" "),
                _c(
                  "span",
                  { staticClass: "pull-right" },
                  [
                    _c(
                      "button",
                      {
                        staticClass: "btn btn-primary",
                        on: {
                          click: function ($event) {
                            _vm.showSupportedLanguages = true
                          },
                        },
                      },
                      [_vm._v(_vm._s(_vm.__("supported_languages_list")))]
                    ),
                    _vm._v(" "),
                    _c(
                      "b-modal",
                      {
                        attrs: {
                          size: "lg",
                          title: _vm.__("supported_languages_list"),
                          scrollable: "",
                          "no-close-on-backdrop": "",
                          "no-fade": "",
                          static: "",
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
                                    attrs: { variant: "danger", size: "sm" },
                                    on: {
                                      click: function ($event) {
                                        _vm.showSupportedLanguages = false
                                      },
                                    },
                                  },
                                  [
                                    _vm._v(
                                      "\n                                        " +
                                        _vm._s(_vm.__("close")) +
                                        "\n                                    "
                                    ),
                                  ]
                                ),
                              ]
                            },
                            proxy: true,
                          },
                        ]),
                        model: {
                          value: _vm.showSupportedLanguages,
                          callback: function ($$v) {
                            _vm.showSupportedLanguages = $$v
                          },
                          expression: "showSupportedLanguages",
                        },
                      },
                      [
                        _c(
                          "b-container",
                          { attrs: { fluid: "" } },
                          [
                            _c(
                              "b-row",
                              { staticClass: "mb-2" },
                              [
                                _c(
                                  "b-col",
                                  {
                                    attrs: {
                                      cols: "12",
                                      lg: "4",
                                      "offset-lg": "8",
                                    },
                                  },
                                  [
                                    _c("h6", { staticClass: "box-title" }, [
                                      _vm._v(_vm._s(_vm.__("search"))),
                                    ]),
                                    _vm._v(" "),
                                    _c("b-form-input", {
                                      attrs: {
                                        id: "filter-input",
                                        type: "search",
                                        placeholder: _vm.__("search"),
                                      },
                                      model: {
                                        value: _vm.filterSL,
                                        callback: function ($$v) {
                                          _vm.filterSL = $$v
                                        },
                                        expression: "filterSL",
                                      },
                                    }),
                                  ],
                                  1
                                ),
                              ],
                              1
                            ),
                            _vm._v(" "),
                            _c("b-table", {
                              attrs: {
                                "sticky-header": "",
                                hover: "",
                                stacked: "md",
                                "show-empty": "",
                                small: "",
                                bordered: true,
                                items: _vm.supported_languages,
                                fields: _vm.supported_languages_fields,
                                filter: _vm.filterSL,
                                "sort-by": _vm.sortBySL,
                                "sort-desc": _vm.sortDescSL,
                                "sort-direction": _vm.sortDirectionSL,
                              },
                              on: {
                                "update:sortBy": function ($event) {
                                  _vm.sortBySL = $event
                                },
                                "update:sort-by": function ($event) {
                                  _vm.sortBySL = $event
                                },
                                "update:sortDesc": function ($event) {
                                  _vm.sortDescSL = $event
                                },
                                "update:sort-desc": function ($event) {
                                  _vm.sortDescSL = $event
                                },
                              },
                            }),
                          ],
                          1
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _vm.$can("language_create")
                      ? _c(
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
                              to: "/languages/create",
                              title: _vm.__("add_language"),
                            },
                          },
                          [_vm._v(_vm._s(_vm.__("add_language")))]
                        )
                      : _vm._e(),
                  ],
                  1
                ),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "card-body" },
                [
                  _c(
                    "b-row",
                    { staticClass: "mb-2 align-items-end" },
                    [
                      _c("b-col", { attrs: { md: "6" } }, [
                        _c("h6", { staticClass: "box-title mb-2" }, [
                          _vm._v(_vm._s(_vm.__("download_sample_files"))),
                        ]),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass: "d-flex flex-wrap",
                            staticStyle: { gap: "8px" },
                          },
                          [
                            _c(
                              "button",
                              {
                                staticClass: "btn btn-sm btn-outline-primary",
                                on: {
                                  click: function ($event) {
                                    _vm.downloadSampleFile(
                                      "customer.json",
                                      _vm.getSystemTypeName(1)
                                    )
                                  },
                                },
                              },
                              [
                                _c("i", { staticClass: "fa fa-download" }),
                                _vm._v(
                                  " " +
                                    _vm._s(_vm.__("customer_app")) +
                                    "\n                                    "
                                ),
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "button",
                              {
                                staticClass: "btn btn-sm btn-outline-primary",
                                on: {
                                  click: function ($event) {
                                    _vm.downloadSampleFile(
                                      "partner.json",
                                      _vm.getSystemTypeName(2)
                                    )
                                  },
                                },
                              },
                              [
                                _c("i", { staticClass: "fa fa-download" }),
                                _vm._v(
                                  " " +
                                    _vm._s(_vm.__("partner_app")) +
                                    "\n                                    "
                                ),
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "button",
                              {
                                staticClass: "btn btn-sm btn-outline-primary",
                                on: {
                                  click: function ($event) {
                                    _vm.downloadSampleFile(
                                      "web.json",
                                      _vm.getSystemTypeName(3)
                                    )
                                  },
                                },
                              },
                              [
                                _c("i", { staticClass: "fa fa-download" }),
                                _vm._v(
                                  " " +
                                    _vm._s(_vm.__("website")) +
                                    "\n                                    "
                                ),
                              ]
                            ),
                            _vm._v(" "),
                            _c(
                              "button",
                              {
                                staticClass: "btn btn-sm btn-outline-primary",
                                on: {
                                  click: function ($event) {
                                    _vm.downloadSampleFile(
                                      "panel.json",
                                      _vm.getSystemTypeName(4)
                                    )
                                  },
                                },
                              },
                              [
                                _c("i", { staticClass: "fa fa-download" }),
                                _vm._v(
                                  " " +
                                    _vm._s(_vm.__("admin_panel")) +
                                    "\n                                    "
                                ),
                              ]
                            ),
                          ]
                        ),
                      ]),
                      _vm._v(" "),
                      _c(
                        "b-col",
                        { attrs: { md: "3", "offset-md": "2" } },
                        [
                          _c("h6", { staticClass: "box-title" }, [
                            _vm._v(_vm._s(_vm.__("search"))),
                          ]),
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
                        "b-col",
                        { staticClass: "text-center", attrs: { md: "1" } },
                        [
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
                              staticClass: "btn btn-primary btn_refresh",
                              attrs: { title: _vm.__("refresh") },
                              on: {
                                click: function ($event) {
                                  return _vm.getRecords()
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
                        ]
                      ),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "table-responsive" },
                    [
                      _c("b-table", {
                        attrs: {
                          items: _vm.groupedLanguages,
                          fields: _vm.languageFields,
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
                        scopedSlots: _vm._u([
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
                            key: "cell(name)",
                            fn: function (row) {
                              return [
                                _c("span", [_vm._v(_vm._s(row.item.name))]),
                              ]
                            },
                          },
                          {
                            key: "cell(is_default)",
                            fn: function (row) {
                              return [
                                row.item.has_default
                                  ? _c(
                                      "span",
                                      { staticClass: "badge bg-success" },
                                      [_vm._v(_vm._s(_vm.__("yes")))]
                                    )
                                  : _c(
                                      "span",
                                      { staticClass: "badge bg-danger" },
                                      [_vm._v(_vm._s(_vm.__("no")))]
                                    ),
                              ]
                            },
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
                                  : _c(
                                      "span",
                                      { staticClass: "badge bg-danger" },
                                      [_vm._v(_vm._s(_vm.__("inactive")))]
                                    ),
                              ]
                            },
                          },
                          {
                            key: "cell(actions)",
                            fn: function (row) {
                              return [
                                _vm.$can("language_update")
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
                                        staticClass: "btn btn-sm btn-primary",
                                        attrs: { title: _vm.__("edit") },
                                        on: {
                                          click: function ($event) {
                                            return _vm.openEditModal(row.item)
                                          },
                                        },
                                      },
                                      [
                                        _c("i", {
                                          staticClass: "fa fa-pencil-alt",
                                        }),
                                        _vm._v(
                                          " " +
                                            _vm._s(_vm.__("edit")) +
                                            "\n                                    "
                                        ),
                                      ]
                                    )
                                  : _vm._e(),
                                _vm._v(" "),
                                _vm.$can("language_delete")
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
                                        staticClass: "btn btn-sm btn-danger",
                                        attrs: { title: _vm.__("delete") },
                                        on: {
                                          click: function ($event) {
                                            return _vm.deleteLanguageGroup(
                                              row.item
                                            )
                                          },
                                        },
                                      },
                                      [
                                        _c("i", { staticClass: "fa fa-trash" }),
                                        _vm._v(
                                          " " +
                                            _vm._s(_vm.__("delete")) +
                                            "\n                                    "
                                        ),
                                      ]
                                    )
                                  : _vm._e(),
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
                    "b-row",
                    [
                      _c(
                        "b-col",
                        { staticClass: "my-1", attrs: { md: "2" } },
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
                      _c(
                        "b-col",
                        {
                          staticClass: "my-1",
                          attrs: { md: "4", "offset-md": "6" },
                        },
                        [
                          _c("label", [
                            _vm._v(
                              _vm._s(_vm.__("total_records")) +
                                " :- " +
                                _vm._s(_vm.totalRows) +
                                " "
                            ),
                          ]),
                          _vm._v(" "),
                          _c("b-pagination", {
                            staticClass: "my-0",
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
                    ],
                    1
                  ),
                ],
                1
              ),
            ]),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _vm.create_new || _vm.edit_record
        ? _c("app-edit-record", {
            attrs: {
              record: _vm.edit_record,
              system_types: _vm.system_types,
              supported_languages: _vm.supported_languages,
            },
            on: {
              modalClose: function ($event) {
                return _vm.hideModal()
              },
            },
          })
        : _vm._e(),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          ref: "edit-language-modal",
          attrs: {
            title: _vm.__("edit_language"),
            size: "lg",
            scrollable: "",
            "no-close-on-backdrop": "",
            "no-fade": "",
            static: "",
          },
          on: { hidden: _vm.closeEditModal },
          scopedSlots: _vm._u([
            {
              key: "modal-footer",
              fn: function () {
                return [
                  _c(
                    "b-button",
                    {
                      attrs: { variant: "primary", disabled: _vm.isSaving },
                      on: { click: _vm.saveLanguageSettings },
                    },
                    [
                      _vm._v(
                        "\n                " +
                          _vm._s(_vm.__("save")) +
                          "\n                "
                      ),
                      _vm.isSaving
                        ? _c("b-spinner", {
                            attrs: { small: "", label: "Spinning" },
                          })
                        : _vm._e(),
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "b-button",
                    {
                      attrs: { variant: "secondary" },
                      on: { click: _vm.closeEditModal },
                    },
                    [_vm._v(_vm._s(_vm.__("cancel")))]
                  ),
                ]
              },
              proxy: true,
            },
          ]),
        },
        [
          _vm.selectedLanguageGroup
            ? _c("div", { staticClass: "row" }, [
                _c("div", { staticClass: "form-group col-md-6" }, [
                  _c("label", { attrs: { for: "edit_supported_language" } }, [
                    _vm._v(_vm._s(_vm.__("supported_language"))),
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    staticClass: "form-control",
                    attrs: {
                      type: "text",
                      id: "edit_supported_language",
                      readonly: "",
                    },
                    domProps: {
                      value:
                        _vm.selectedLanguageGroup.name +
                        " (" +
                        _vm.selectedLanguageGroup.code +
                        ")",
                    },
                  }),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group col-md-6" }, [
                  _c("label", { attrs: { for: "edit_display_name" } }, [
                    _vm._v(_vm._s(_vm.__("display_name"))),
                    _c("span", { staticClass: "text-danger" }, [_vm._v("*")]),
                  ]),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.editDisplayName,
                        expression: "editDisplayName",
                      },
                    ],
                    staticClass: "form-control",
                    attrs: {
                      type: "text",
                      id: "edit_display_name",
                      placeholder: _vm.__("enter_display_name"),
                    },
                    domProps: { value: _vm.editDisplayName },
                    on: {
                      input: function ($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.editDisplayName = $event.target.value
                      },
                    },
                  }),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group col-md-6" }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.editIsDefault,
                        expression: "editIsDefault",
                      },
                    ],
                    staticClass: "form-check-input",
                    attrs: {
                      name: "edit_is_default",
                      id: "edit_is_default",
                      "true-value": "1",
                      "false-value": "0",
                      type: "checkbox",
                    },
                    domProps: {
                      checked: Array.isArray(_vm.editIsDefault)
                        ? _vm._i(_vm.editIsDefault, null) > -1
                        : _vm._q(_vm.editIsDefault, "1"),
                    },
                    on: {
                      change: function ($event) {
                        var $$a = _vm.editIsDefault,
                          $$el = $event.target,
                          $$c = $$el.checked ? "1" : "0"
                        if (Array.isArray($$a)) {
                          var $$v = null,
                            $$i = _vm._i($$a, $$v)
                          if ($$el.checked) {
                            $$i < 0 && (_vm.editIsDefault = $$a.concat([$$v]))
                          } else {
                            $$i > -1 &&
                              (_vm.editIsDefault = $$a
                                .slice(0, $$i)
                                .concat($$a.slice($$i + 1)))
                          }
                        } else {
                          _vm.editIsDefault = $$c
                        }
                      },
                    },
                  }),
                  _vm._v(" "),
                  _c(
                    "label",
                    {
                      staticClass: "form-check-label ms-2",
                      attrs: { for: "edit_is_default" },
                    },
                    [_vm._v(_vm._s(_vm.__("set_as_a_default_language")))]
                  ),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group col-md-6" }, [
                  _c("label", [_vm._v(_vm._s(_vm.__("status")))]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "text-left mt-1" },
                    [
                      _c("b-form-radio-group", {
                        attrs: {
                          options: [
                            { text: _vm.__("deactivate"), value: 0 },
                            { text: _vm.__("activate"), value: 1 },
                          ],
                          buttons: "",
                          "button-variant": "outline-primary",
                          required: "",
                        },
                        model: {
                          value: _vm.editStatus,
                          callback: function ($$v) {
                            _vm.editStatus = $$v
                          },
                          expression: "editStatus",
                        },
                      }),
                    ],
                    1
                  ),
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group col-md-12" }, [
                  _c("label", { staticClass: "mb-2" }, [
                    _vm._v(
                      _vm._s(_vm.__("edit_json_data_for_system_types")) + ":"
                    ),
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "row" },
                    _vm._l(_vm.system_types, function (systemType) {
                      return _c(
                        "div",
                        { key: systemType.id, staticClass: "col-md-6 mb-2" },
                        [
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-primary btn-block",
                              on: {
                                click: function ($event) {
                                  return _vm.openJsonEditModal(
                                    systemType,
                                    _vm.selectedLanguageGroup
                                  )
                                },
                              },
                            },
                            [
                              _c("i", { staticClass: "fa fa-pencil-alt" }),
                              _vm._v(
                                " " +
                                  _vm._s(_vm.__("edit")) +
                                  " " +
                                  _vm._s(systemType.name) +
                                  "\n                        "
                              ),
                            ]
                          ),
                        ]
                      )
                    }),
                    0
                  ),
                ]),
              ])
            : _vm._e(),
        ]
      ),
      _vm._v(" "),
      _vm.jsonEditRecord
        ? _c("app-json-edit", {
            attrs: {
              record: _vm.jsonEditRecord,
              system_type: _vm.jsonEditSystemType,
            },
            on: {
              modalClose: _vm.closeJsonEditModal,
              jsonSaved: _vm.closeEditModal,
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