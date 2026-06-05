"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_MasterCatalog_MasterProductForm_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  props: ['id'],
  data: function data() {
    return {
      isSaving: false,
      isEdit: false,
      product: {
        id: null,
        name: '',
        parent_company_id: null,
        brand_id: null,
        category_id: null,
        tax_id: null,
        hsn: '',
        short_description: '',
        description: '',
        type: 'single',
        status: 1,
        image: null
      },
      productImageFile: null,
      productImagePreview: null,
      variants: [this.blankVariant()],
      brands: [],
      categories: [],
      taxes: [],
      units: [],
      // Parent company picker
      pcQuery: '',
      pcResults: [],
      pcDropdownOpen: false,
      pcDebounce: null
    };
  },
  computed: {
    visibleVariants: function visibleVariants() {
      return this.variants.filter(function (v) {
        return !v._delete;
      });
    },
    pcExactMatch: function pcExactMatch() {
      var q = (this.pcQuery || '').trim().toLowerCase();
      return this.pcResults.some(function (pc) {
        return (pc.name || '').toLowerCase() === q;
      });
    }
  },
  created: function created() {
    this.isEdit = !!this.id;
    this.fetchLookups();
    if (this.isEdit) {
      this.fetchProduct();
    }
  },
  methods: {
    blankVariant: function blankVariant() {
      return {
        _key: Math.random().toString(36).slice(2),
        id: null,
        sku: '',
        unit_id: null,
        secondary_unit_id: null,
        secondary_unit_value: null,
        weight: null,
        image: null,
        status: 1,
        _file: null,
        _preview: null,
        _delete: false
      };
    },
    fetchLookups: function fetchLookups() {
      var _this = this;
      axios.get(this.$apiUrl + '/products/brands/get').then(function (r) {
        _this.brands = r.data.data || [];
      });
      axios.get(this.$apiUrl + '/categories', {
        params: {
          per_page: 1000
        }
      }).then(function (r) {
        _this.categories = r.data.data || [];
      })["catch"](function () {});
      axios.get(this.$apiUrl + '/products/taxes').then(function (r) {
        _this.taxes = r.data.data || [];
      })["catch"](function () {});
      axios.get(this.$apiUrl + '/units/get').then(function (r) {
        _this.units = r.data.data || [];
      })["catch"](function () {});
    },
    fetchProduct: function fetchProduct() {
      var _this2 = this;
      axios.get(this.$apiUrl + '/master_catalog/products/edit/' + this.id).then(function (r) {
        var p = r.data.data;
        if (!p) return;
        _this2.product = {
          id: p.id,
          name: p.name,
          parent_company_id: p.parent_company_id,
          brand_id: p.brand_id,
          category_id: p.category_id,
          tax_id: p.tax_id,
          hsn: p.hsn,
          short_description: p.short_description,
          description: p.description,
          type: p.type || 'single',
          status: p.status,
          image: p.image
        };
        _this2.pcQuery = p.parent_company ? p.parent_company.name : '';
        if (p.image) {
          _this2.productImagePreview = _this2.$storageUrl + p.image;
        }
        if (Array.isArray(p.variants) && p.variants.length) {
          _this2.variants = p.variants.map(function (v) {
            return {
              _key: Math.random().toString(36).slice(2),
              id: v.id,
              sku: v.sku,
              unit_id: v.unit_id,
              secondary_unit_id: v.secondary_unit_id,
              secondary_unit_value: v.secondary_unit_value,
              weight: v.weight,
              image: v.image,
              status: v.status,
              _file: null,
              _preview: null,
              _delete: false
            };
          });
        }
      });
    },
    onProductImage: function onProductImage(e) {
      var file = e.target.files[0];
      if (!file) return;
      this.productImageFile = file;
      this.productImagePreview = URL.createObjectURL(file);
    },
    onVariantImage: function onVariantImage(e, v) {
      var file = e.target.files[0];
      if (!file) return;
      v._file = file;
      v._preview = URL.createObjectURL(file);
    },
    onTypeChange: function onTypeChange(value) {
      if (value === 'single' && this.visibleVariants.length > 1) {
        this.variants = [this.visibleVariants[0]];
      }
    },
    addVariantRow: function addVariantRow() {
      this.variants.push(this.blankVariant());
    },
    removeVariantRow: function removeVariantRow(v) {
      if (v.id) {
        v._delete = true;
      } else {
        this.variants = this.variants.filter(function (x) {
          return x._key !== v._key;
        });
      }
    },
    // Parent company picker
    onPcInput: function onPcInput() {
      var _this3 = this;
      clearTimeout(this.pcDebounce);
      this.product.parent_company_id = null;
      this.pcDropdownOpen = true;
      this.pcDebounce = setTimeout(function () {
        return _this3.searchPc();
      }, 250);
    },
    searchPc: function searchPc() {
      var _this4 = this;
      axios.get(this.$apiUrl + '/master_catalog/parent_companies/search', {
        params: {
          q: this.pcQuery
        }
      }).then(function (r) {
        _this4.pcResults = r.data.data || [];
      });
    },
    selectParentCompany: function selectParentCompany(pc) {
      this.pcQuery = pc.name;
      this.product.parent_company_id = pc.id;
      this.pcDropdownOpen = false;
    },
    createParentCompany: function createParentCompany() {
      var _this5 = this;
      axios.post(this.$apiUrl + '/master_catalog/parent_companies/find_or_create', {
        name: this.pcQuery
      }).then(function (r) {
        var pc = r.data.data;
        if (pc) {
          _this5.selectParentCompany(pc);
        }
      });
    },
    onPcBlur: function onPcBlur() {
      var _this6 = this;
      setTimeout(function () {
        _this6.pcDropdownOpen = false;
      }, 150);
    },
    save: function save() {
      var _this7 = this;
      if (!this.product.name) {
        this.showError(__('name_is_required'));
        return;
      }
      if (!this.visibleVariants.length) {
        this.showError(__('at_least_one_variant_required'));
        return;
      }
      this.isSaving = true;
      var fd = new FormData();
      fd.append('name', this.product.name);
      if (this.product.parent_company_id) fd.append('parent_company_id', this.product.parent_company_id);
      if (this.product.brand_id) fd.append('brand_id', this.product.brand_id);
      if (this.product.category_id) fd.append('category_id', this.product.category_id);
      if (this.product.tax_id) fd.append('tax_id', this.product.tax_id);
      if (this.product.hsn) fd.append('hsn', this.product.hsn);
      if (this.product.short_description) fd.append('short_description', this.product.short_description);
      if (this.product.description) fd.append('description', this.product.description);
      fd.append('type', this.product.type);
      fd.append('status', this.product.status);
      if (this.productImageFile) fd.append('image', this.productImageFile);
      this.variants.forEach(function (v, idx) {
        if (v.id) fd.append("variants[".concat(idx, "][id]"), v.id);
        if (v._delete) fd.append("variants[".concat(idx, "][_delete]"), 1);
        fd.append("variants[".concat(idx, "][sku]"), v.sku || '');
        if (v.unit_id) fd.append("variants[".concat(idx, "][unit_id]"), v.unit_id);
        if (v.secondary_unit_id) fd.append("variants[".concat(idx, "][secondary_unit_id]"), v.secondary_unit_id);
        if (v.secondary_unit_value != null) fd.append("variants[".concat(idx, "][secondary_unit_value]"), v.secondary_unit_value);
        if (v.weight != null) fd.append("variants[".concat(idx, "][weight]"), v.weight);
        fd.append("variants[".concat(idx, "][status]"), v.status);
        if (v._file) fd.append("variants[".concat(idx, "][image]"), v._file);
      });
      var url = this.isEdit ? this.$apiUrl + '/master_catalog/products/update' : this.$apiUrl + '/master_catalog/products/save';
      if (this.isEdit) fd.append('id', this.product.id);
      axios.post(url, fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (res) {
        _this7.isSaving = false;
        if (res.data.status) {
          _this7.showMessage('success', res.data.message || __(_this7.isEdit ? 'master_product_updated_successfully' : 'master_product_saved_successfully'));
          _this7.$router.push('/master_catalog/products');
        } else {
          _this7.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this7.isSaving = false;
        var msg = err.response && err.response.data && err.response.data.message || __('something_went_wrong');
        _this7.showError(msg);
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/views/MasterCatalog/MasterProductForm.vue":
/*!****************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/MasterProductForm.vue ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _MasterProductForm_vue_vue_type_template_id_487c532c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MasterProductForm.vue?vue&type=template&id=487c532c */ "./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=template&id=487c532c");
/* harmony import */ var _MasterProductForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MasterProductForm.vue?vue&type=script&lang=js */ "./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _MasterProductForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _MasterProductForm_vue_vue_type_template_id_487c532c__WEBPACK_IMPORTED_MODULE_0__.render,
  _MasterProductForm_vue_vue_type_template_id_487c532c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/MasterCatalog/MasterProductForm.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=script&lang=js":
/*!****************************************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=script&lang=js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProductForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MasterProductForm.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProductForm_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=template&id=487c532c":
/*!**********************************************************************************************!*\
  !*** ./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=template&id=487c532c ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProductForm_vue_vue_type_template_id_487c532c__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProductForm_vue_vue_type_template_id_487c532c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_MasterProductForm_vue_vue_type_template_id_487c532c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./MasterProductForm.vue?vue&type=template&id=487c532c */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=template&id=487c532c");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=template&id=487c532c":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/MasterCatalog/MasterProductForm.vue?vue&type=template&id=487c532c ***!
  \*************************************************************************************************************************************************************************************************************************************/
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
          _c("h3", [
            _vm._v(
              _vm._s(
                _vm.isEdit
                  ? _vm.__("edit_master_product")
                  : _vm.__("add_master_product")
              )
            ),
          ]),
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
                  { staticClass: "breadcrumb-item" },
                  [
                    _c(
                      "router-link",
                      { attrs: { to: "/master_catalog/products" } },
                      [_vm._v(_vm._s(_vm.__("master_catalog")))]
                    ),
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
                        _vm._s(_vm.isEdit ? _vm.__("edit") : _vm.__("add")) +
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
    _vm._v(" "),
    _c(
      "form",
      {
        on: {
          submit: function ($event) {
            $event.preventDefault()
            return _vm.save.apply(null, arguments)
          },
        },
      },
      [
        _c("div", { staticClass: "card" }, [
          _c("div", { staticClass: "card-header" }, [
            _c("h4", [_vm._v(_vm._s(_vm.__("product_details")))]),
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "card-body" }, [
            _c("div", { staticClass: "row" }, [
              _c("div", { staticClass: "form-group col-md-6" }, [
                _c("label", { staticClass: "required" }, [
                  _vm._v(_vm._s(_vm.__("name"))),
                ]),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.product.name,
                      expression: "product.name",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: { type: "text", required: "" },
                  domProps: { value: _vm.product.name },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.product, "name", $event.target.value)
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "form-group col-md-6 position-relative" },
                [
                  _c("label", [_vm._v(_vm._s(_vm.__("parent_company")))]),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.pcQuery,
                        expression: "pcQuery",
                      },
                    ],
                    staticClass: "form-control",
                    attrs: {
                      type: "text",
                      placeholder: _vm.__("search_or_create"),
                      autocomplete: "off",
                    },
                    domProps: { value: _vm.pcQuery },
                    on: {
                      input: [
                        function ($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.pcQuery = $event.target.value
                        },
                        _vm.onPcInput,
                      ],
                      focus: function ($event) {
                        _vm.pcDropdownOpen = true
                      },
                      blur: _vm.onPcBlur,
                    },
                  }),
                  _vm._v(" "),
                  _vm.pcDropdownOpen
                    ? _c(
                        "ul",
                        {
                          staticClass:
                            "list-group position-absolute w-100 shadow-sm",
                          staticStyle: {
                            "z-index": "50",
                            "max-height": "240px",
                            "overflow-y": "auto",
                          },
                        },
                        [
                          _vm._l(_vm.pcResults, function (pc) {
                            return _c(
                              "li",
                              {
                                key: pc.id,
                                staticClass:
                                  "list-group-item list-group-item-action py-2",
                                on: {
                                  mousedown: function ($event) {
                                    $event.preventDefault()
                                    return _vm.selectParentCompany(pc)
                                  },
                                },
                              },
                              [
                                _vm._v(
                                  "\n                                " +
                                    _vm._s(pc.name) +
                                    "\n                            "
                                ),
                              ]
                            )
                          }),
                          _vm._v(" "),
                          _vm.pcQuery && !_vm.pcExactMatch
                            ? _c(
                                "li",
                                {
                                  staticClass:
                                    "list-group-item list-group-item-action py-2 text-primary",
                                  on: {
                                    mousedown: function ($event) {
                                      $event.preventDefault()
                                      return _vm.createParentCompany.apply(
                                        null,
                                        arguments
                                      )
                                    },
                                  },
                                },
                                [
                                  _c("i", { staticClass: "fa fa-plus" }),
                                  _vm._v(
                                    " " +
                                      _vm._s(_vm.__("create")) +
                                      ' "' +
                                      _vm._s(_vm.pcQuery) +
                                      '" ' +
                                      _vm._s(_vm.__("as_new_parent_company")) +
                                      "\n                            "
                                  ),
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          !_vm.pcResults.length && !_vm.pcQuery
                            ? _c(
                                "li",
                                {
                                  staticClass:
                                    "list-group-item text-muted py-2",
                                },
                                [
                                  _vm._v(
                                    "\n                                " +
                                      _vm._s(_vm.__("start_typing_to_search")) +
                                      "\n                            "
                                  ),
                                ]
                              )
                            : _vm._e(),
                        ],
                        2
                      )
                    : _vm._e(),
                ]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "form-group col-md-6" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("brand")))]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.product.brand_id,
                        expression: "product.brand_id",
                      },
                    ],
                    staticClass: "form-control",
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
                        _vm.$set(
                          _vm.product,
                          "brand_id",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  [
                    _c("option", { domProps: { value: null } }, [
                      _vm._v("-- " + _vm._s(_vm.__("select")) + " --"),
                    ]),
                    _vm._v(" "),
                    _vm._l(_vm.brands, function (b) {
                      return _c(
                        "option",
                        { key: b.id, domProps: { value: b.id } },
                        [_vm._v(_vm._s(b.name))]
                      )
                    }),
                  ],
                  2
                ),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group col-md-6" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("category")))]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.product.category_id,
                        expression: "product.category_id",
                      },
                    ],
                    staticClass: "form-control",
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
                        _vm.$set(
                          _vm.product,
                          "category_id",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  [
                    _c("option", { domProps: { value: null } }, [
                      _vm._v("-- " + _vm._s(_vm.__("select")) + " --"),
                    ]),
                    _vm._v(" "),
                    _vm._l(_vm.categories, function (c) {
                      return _c(
                        "option",
                        { key: c.id, domProps: { value: c.id } },
                        [_vm._v(_vm._s(c.name))]
                      )
                    }),
                  ],
                  2
                ),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group col-md-6" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("tax")))]),
                _vm._v(" "),
                _c(
                  "select",
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.product.tax_id,
                        expression: "product.tax_id",
                      },
                    ],
                    staticClass: "form-control",
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
                        _vm.$set(
                          _vm.product,
                          "tax_id",
                          $event.target.multiple
                            ? $$selectedVal
                            : $$selectedVal[0]
                        )
                      },
                    },
                  },
                  [
                    _c("option", { domProps: { value: null } }, [
                      _vm._v("-- " + _vm._s(_vm.__("select")) + " --"),
                    ]),
                    _vm._v(" "),
                    _vm._l(_vm.taxes, function (t) {
                      return _c(
                        "option",
                        { key: t.id, domProps: { value: t.id } },
                        [
                          _vm._v(
                            _vm._s(t.title) + " (" + _vm._s(t.percentage) + "%)"
                          ),
                        ]
                      )
                    }),
                  ],
                  2
                ),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group col-md-6" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("hsn_code")))]),
                _vm._v(" "),
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.product.hsn,
                      expression: "product.hsn",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: { type: "text" },
                  domProps: { value: _vm.product.hsn },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.product, "hsn", $event.target.value)
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group col-md-6" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("type")))]),
                _vm._v(" "),
                _c(
                  "div",
                  [
                    _c("b-form-radio-group", {
                      attrs: {
                        options: [
                          { text: _vm.__("single"), value: "single" },
                          { text: _vm.__("variable"), value: "variable" },
                        ],
                        buttons: "",
                        "button-variant": "outline-primary",
                      },
                      on: { change: _vm.onTypeChange },
                      model: {
                        value: _vm.product.type,
                        callback: function ($$v) {
                          _vm.$set(_vm.product, "type", $$v)
                        },
                        expression: "product.type",
                      },
                    }),
                  ],
                  1
                ),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group col-md-6" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("image")))]),
                _vm._v(" "),
                _c("input", {
                  staticClass: "form-control",
                  attrs: { type: "file", accept: "image/*" },
                  on: { change: _vm.onProductImage },
                }),
                _vm._v(" "),
                _vm.productImagePreview
                  ? _c("div", { staticClass: "mt-2" }, [
                      _c("img", {
                        attrs: { src: _vm.productImagePreview, height: "80" },
                      }),
                    ])
                  : _vm._e(),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group col-md-12" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("short_description")))]),
                _vm._v(" "),
                _c("textarea", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.product.short_description,
                      expression: "product.short_description",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: { rows: "2" },
                  domProps: { value: _vm.product.short_description },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.product,
                        "short_description",
                        $event.target.value
                      )
                    },
                  },
                }),
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group col-md-12" }, [
                _c("label", [_vm._v(_vm._s(_vm.__("description")))]),
                _vm._v(" "),
                _c("textarea", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.product.description,
                      expression: "product.description",
                    },
                  ],
                  staticClass: "form-control",
                  attrs: { rows: "4" },
                  domProps: { value: _vm.product.description },
                  on: {
                    input: function ($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.product, "description", $event.target.value)
                    },
                  },
                }),
              ]),
            ]),
          ]),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card mt-3" }, [
          _c(
            "div",
            {
              staticClass:
                "card-header d-flex justify-content-between align-items-center",
            },
            [
              _c("h4", { staticClass: "mb-0" }, [
                _vm._v(_vm._s(_vm.__("variants"))),
              ]),
              _vm._v(" "),
              _vm.product.type === "variable"
                ? _c(
                    "button",
                    {
                      staticClass: "btn btn-sm btn-outline-primary",
                      attrs: { type: "button" },
                      on: { click: _vm.addVariantRow },
                    },
                    [
                      _c("i", { staticClass: "fa fa-plus" }),
                      _vm._v(
                        " " +
                          _vm._s(_vm.__("add_variant")) +
                          "\n                "
                      ),
                    ]
                  )
                : _vm._e(),
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "card-body" }, [
            _c("div", { staticClass: "table-responsive" }, [
              _c(
                "table",
                { staticClass: "table table-bordered align-middle" },
                [
                  _c("thead", { staticClass: "table-light" }, [
                    _c("tr", [
                      _c("th", [_vm._v(_vm._s(_vm.__("sku")))]),
                      _vm._v(" "),
                      _c("th", [_vm._v(_vm._s(_vm.__("unit")))]),
                      _vm._v(" "),
                      _c("th", [_vm._v(_vm._s(_vm.__("secondary_unit")))]),
                      _vm._v(" "),
                      _c("th", [_vm._v(_vm._s(_vm.__("secondary_value")))]),
                      _vm._v(" "),
                      _c("th", [_vm._v(_vm._s(_vm.__("weight")))]),
                      _vm._v(" "),
                      _c("th", [_vm._v(_vm._s(_vm.__("image")))]),
                      _vm._v(" "),
                      _c("th", [_vm._v(_vm._s(_vm.__("status")))]),
                      _vm._v(" "),
                      _vm.product.type === "variable"
                        ? _c("th", { staticStyle: { width: "60px" } }, [
                            _vm._v(_vm._s(_vm.__("actions"))),
                          ])
                        : _vm._e(),
                    ]),
                  ]),
                  _vm._v(" "),
                  _c(
                    "tbody",
                    _vm._l(_vm.visibleVariants, function (v, idx) {
                      return _c("tr", { key: v._key }, [
                        _c("td", [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: v.sku,
                                expression: "v.sku",
                              },
                            ],
                            staticClass: "form-control form-control-sm",
                            attrs: { type: "text" },
                            domProps: { value: v.sku },
                            on: {
                              input: function ($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.$set(v, "sku", $event.target.value)
                              },
                            },
                          }),
                        ]),
                        _vm._v(" "),
                        _c("td", [
                          _c(
                            "select",
                            {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: v.unit_id,
                                  expression: "v.unit_id",
                                },
                              ],
                              staticClass: "form-control form-control-sm",
                              on: {
                                change: function ($event) {
                                  var $$selectedVal = Array.prototype.filter
                                    .call($event.target.options, function (o) {
                                      return o.selected
                                    })
                                    .map(function (o) {
                                      var val =
                                        "_value" in o ? o._value : o.value
                                      return val
                                    })
                                  _vm.$set(
                                    v,
                                    "unit_id",
                                    $event.target.multiple
                                      ? $$selectedVal
                                      : $$selectedVal[0]
                                  )
                                },
                              },
                            },
                            [
                              _c("option", { domProps: { value: null } }, [
                                _vm._v("--"),
                              ]),
                              _vm._v(" "),
                              _vm._l(_vm.units, function (u) {
                                return _c(
                                  "option",
                                  { key: u.id, domProps: { value: u.id } },
                                  [_vm._v(_vm._s(u.name))]
                                )
                              }),
                            ],
                            2
                          ),
                        ]),
                        _vm._v(" "),
                        _c("td", [
                          _c(
                            "select",
                            {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: v.secondary_unit_id,
                                  expression: "v.secondary_unit_id",
                                },
                              ],
                              staticClass: "form-control form-control-sm",
                              on: {
                                change: function ($event) {
                                  var $$selectedVal = Array.prototype.filter
                                    .call($event.target.options, function (o) {
                                      return o.selected
                                    })
                                    .map(function (o) {
                                      var val =
                                        "_value" in o ? o._value : o.value
                                      return val
                                    })
                                  _vm.$set(
                                    v,
                                    "secondary_unit_id",
                                    $event.target.multiple
                                      ? $$selectedVal
                                      : $$selectedVal[0]
                                  )
                                },
                              },
                            },
                            [
                              _c("option", { domProps: { value: null } }, [
                                _vm._v("--"),
                              ]),
                              _vm._v(" "),
                              _vm._l(_vm.units, function (u) {
                                return _c(
                                  "option",
                                  { key: u.id, domProps: { value: u.id } },
                                  [_vm._v(_vm._s(u.name))]
                                )
                              }),
                            ],
                            2
                          ),
                        ]),
                        _vm._v(" "),
                        _c("td", [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model.number",
                                value: v.secondary_unit_value,
                                expression: "v.secondary_unit_value",
                                modifiers: { number: true },
                              },
                            ],
                            staticClass: "form-control form-control-sm",
                            attrs: { type: "number", step: "0.01" },
                            domProps: { value: v.secondary_unit_value },
                            on: {
                              input: function ($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.$set(
                                  v,
                                  "secondary_unit_value",
                                  _vm._n($event.target.value)
                                )
                              },
                              blur: function ($event) {
                                return _vm.$forceUpdate()
                              },
                            },
                          }),
                        ]),
                        _vm._v(" "),
                        _c("td", [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model.number",
                                value: v.weight,
                                expression: "v.weight",
                                modifiers: { number: true },
                              },
                            ],
                            staticClass: "form-control form-control-sm",
                            attrs: { type: "number", step: "0.001" },
                            domProps: { value: v.weight },
                            on: {
                              input: function ($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.$set(
                                  v,
                                  "weight",
                                  _vm._n($event.target.value)
                                )
                              },
                              blur: function ($event) {
                                return _vm.$forceUpdate()
                              },
                            },
                          }),
                        ]),
                        _vm._v(" "),
                        _c("td", [
                          _c("input", {
                            staticClass: "form-control form-control-sm",
                            attrs: { type: "file", accept: "image/*" },
                            on: {
                              change: function ($event) {
                                return _vm.onVariantImage($event, v)
                              },
                            },
                          }),
                          _vm._v(" "),
                          v._preview || v.image
                            ? _c("div", { staticClass: "mt-1" }, [
                                _c("img", {
                                  attrs: {
                                    src:
                                      v._preview || _vm.$storageUrl + v.image,
                                    height: "40",
                                  },
                                }),
                              ])
                            : _vm._e(),
                        ]),
                        _vm._v(" "),
                        _c("td", [
                          _c(
                            "select",
                            {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model.number",
                                  value: v.status,
                                  expression: "v.status",
                                  modifiers: { number: true },
                                },
                              ],
                              staticClass: "form-control form-control-sm",
                              on: {
                                change: function ($event) {
                                  var $$selectedVal = Array.prototype.filter
                                    .call($event.target.options, function (o) {
                                      return o.selected
                                    })
                                    .map(function (o) {
                                      var val =
                                        "_value" in o ? o._value : o.value
                                      return _vm._n(val)
                                    })
                                  _vm.$set(
                                    v,
                                    "status",
                                    $event.target.multiple
                                      ? $$selectedVal
                                      : $$selectedVal[0]
                                  )
                                },
                              },
                            },
                            [
                              _c("option", { domProps: { value: 1 } }, [
                                _vm._v(_vm._s(_vm.__("active"))),
                              ]),
                              _vm._v(" "),
                              _c("option", { domProps: { value: 0 } }, [
                                _vm._v(_vm._s(_vm.__("deactive"))),
                              ]),
                            ]
                          ),
                        ]),
                        _vm._v(" "),
                        _vm.product.type === "variable"
                          ? _c("td", [
                              _c(
                                "button",
                                {
                                  staticClass: "btn btn-sm btn-danger",
                                  attrs: {
                                    type: "button",
                                    disabled: _vm.visibleVariants.length === 1,
                                  },
                                  on: {
                                    click: function ($event) {
                                      return _vm.removeVariantRow(v)
                                    },
                                  },
                                },
                                [_c("i", { staticClass: "fa fa-trash" })]
                              ),
                            ])
                          : _vm._e(),
                      ])
                    }),
                    0
                  ),
                ]
              ),
            ]),
            _vm._v(" "),
            _c("small", { staticClass: "text-muted" }, [
              _vm._v(
                "\n                    " +
                  _vm._s(
                    _vm.product.type === "single"
                      ? _vm.__("single_type_one_variant_hint")
                      : _vm.__("variable_type_multiple_variants_hint")
                  ) +
                  "\n                "
              ),
            ]),
          ]),
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "card-footer mt-3 text-end" },
          [
            _c(
              "router-link",
              {
                staticClass: "btn btn-secondary me-2",
                attrs: { to: "/master_catalog/products" },
              },
              [
                _vm._v(
                  "\n                " +
                    _vm._s(_vm.__("cancel")) +
                    "\n            "
                ),
              ]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                staticClass: "btn btn-primary",
                attrs: { type: "submit", disabled: _vm.isSaving },
              },
              [
                _vm._v(
                  "\n                " +
                    _vm._s(_vm.__("save")) +
                    "\n                "
                ),
                _vm.isSaving
                  ? _c("b-spinner", { attrs: { small: "" } })
                  : _vm._e(),
              ],
              1
            ),
          ],
          1
        ),
      ]
    ),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);