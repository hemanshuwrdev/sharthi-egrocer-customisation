"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Blogs_Blogs_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/Blogs.vue?vue&type=script&lang=js":
/*!************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/Blogs.vue?vue&type=script&lang=js ***!
  \************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _tinymce_tinymce_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tinymce/tinymce-vue */ "./node_modules/@tinymce/tinymce-vue/lib/es2015/main/ts/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var v_select2_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! v-select2-component */ "./node_modules/v-select2-component/dist/Select2.esm.js");
/* harmony import */ var _mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../mixins/TranslationHelper.js */ "./resources/js/mixins/TranslationHelper.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
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





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  mixins: [_mixins_TranslationHelper_js__WEBPACK_IMPORTED_MODULE_4__["default"]],
  name: 'Blogs',
  components: {
    Editor: _tinymce_tinymce_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  data: function data() {
    return {
      languages: [],
      activeLanguageTab: 0,
      languagesKey: 0,
      blogs: [],
      categories: [],
      create_new: false,
      edit_record: {},
      aiLoading: false,
      aiPrompt: '',
      form: {
        title: '',
        slug: '',
        category_id: '',
        image: null,
        image_url: '',
        description: '',
        short_description: '',
        meta_title: '',
        // meta_keywords: '',
        // meta_description: '',
        status: 1,
        translations: {},
        currentLanguageId: null,
        activeLanguages: []
      },
      tags: [],
      /** Tags per language so dropdown options are ready when switching tabs: { [languageId]: [{ id, name }] } */
      tagsByLanguage: {},
      /** Tag IDs per language: { [languageId]: ['1','2'] } so each tab keeps its own selection */
      tagIdsByLanguage: {},
      isLoading: false,
      isSubmitting: false,
      filter: '',
      filterOn: ['title', 'description'],
      sortBy: 'id',
      sortDesc: true,
      sortDirection: 'desc',
      selectedCategory: '',
      fields: [{
        key: 'id',
        label: __('id'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'image',
        label: __('image'),
        "class": 'text-center'
      }, {
        key: 'title',
        label: __('title'),
        sortable: true,
        "class": 'text-center'
      }, {
        key: 'category',
        label: __('category'),
        "class": 'text-center'
      }, {
        key: 'status',
        label: __('status'),
        "class": 'text-center'
      }, {
        key: 'actions',
        label: __('actions'),
        "class": 'text-center'
      }],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      pageOptions: [5, 10, 15, 20, 25, 50, 100],
      descriptionValidation: '',
      translations: {},
      translatableFields: ['title', 'short_description', 'description', 'meta_title', 'meta_keywords', 'meta_description'],
      translateSuccessMessage: '',
      loadingEmpty: false,
      loadingOverwrite: false,
      imageError: null
    };
  },
  computed: {
    defaultLanguageId: function defaultLanguageId() {
      var d = this.languages.find(function (l) {
        return l.is_default;
      });
      return d ? d.id : null;
    },
    translatedCategories: function translatedCategories() {
      var _this = this;
      if (!this.currentLanguageId || !Array.isArray(this.categories)) {
        return this.categories;
      }
      return this.categories.map(function (cat) {
        var c = _objectSpread({}, cat);
        if (Array.isArray(cat.translations)) {
          var _tr$name;
          var tr = cat.translations.find(function (t) {
            return t.language_id === _this.currentLanguageId;
          });
          if (tr !== null && tr !== void 0 && (_tr$name = tr.name) !== null && _tr$name !== void 0 && _tr$name.trim()) {
            c.name = tr.name;
          }
        }
        return c;
      });
    },
    translatedBlogs: function translatedBlogs() {
      var _this2 = this;
      if (!this.currentLanguageId || !Array.isArray(this.blogs)) {
        return this.blogs;
      }
      return this.blogs.map(function (blog) {
        var translatedBlog = _objectSpread({}, blog);

        // Translate blog fields
        if (Array.isArray(blog.translations)) {
          var tr = blog.translations.find(function (t) {
            return t.language_id === _this2.currentLanguageId;
          });
          if (tr !== null && tr !== void 0 && tr.title) translatedBlog.title = tr.title;
        }

        // Attach translated category name
        if (blog.category) {
          var _blog$category$transl;
          var catTr = (_blog$category$transl = blog.category.translations) === null || _blog$category$transl === void 0 ? void 0 : _blog$category$transl.find(function (t) {
            return t.language_id === _this2.currentLanguageId;
          });
          translatedBlog.category = _objectSpread(_objectSpread({}, blog.category), {}, {
            name: (catTr === null || catTr === void 0 ? void 0 : catTr.name) || blog.category.name || '-'
          });
        }
        return translatedBlog;
      });
    },
    /** Select2 settings for tags dropdown (same as EditProduct). dropdownParent makes dropdown appear inside modal. */tagSelectSettings: function tagSelectSettings() {
      return {
        tags: true,
        multiple: true,
        width: '100%',
        dropdownParent: '#blog-modal',
        tokenSeparators: [',', ';'],
        placeholder: 'Select Tags'
      };
    }
  },
  mounted: function mounted() {
    var _this3 = this;
    this.getLanguages();
    this.fetchActiveLanguages().then(function () {
      _this3.getBlogs();
      _this3.getCategories();
    });
    this.getTags();
  },
  methods: {
    /*--------------------generateWithAI------------------------*/generateWithAI: function generateWithAI() {
      var _this4 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee() {
        var _this4$translations$d;
        var defaultLang, defaultTitle, response, data;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // Get title from default language
                defaultLang = _this4.languages.find(function (l) {
                  return l.is_default;
                });
                if (defaultLang) {
                  _context.next = 4;
                  break;
                }
                _this4.showError(__('default_language_not_found'));
                return _context.abrupt("return");
              case 4:
                defaultTitle = ((_this4$translations$d = _this4.translations[defaultLang.id]) === null || _this4$translations$d === void 0 ? void 0 : _this4$translations$d.title) || '';
                if (defaultTitle) {
                  _context.next = 8;
                  break;
                }
                _this4.showError(__('please_fill_default_language_required_fields'));
                return _context.abrupt("return");
              case 8:
                _this4.aiLoading = true;
                _context.prev = 9;
                _context.next = 12;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().post(_this4.$apiUrl + '/google_gemini', {
                  title: defaultTitle,
                  source: 'web'
                });
              case 12:
                response = _context.sent;
                if (response.data.status === 1) {
                  data = response.data.data; // Update default language translations
                  if (data.title) {
                    _this4.$set(_this4.translations[defaultLang.id], 'title', data.title);
                  }
                  if (data.short_description) {
                    _this4.$set(_this4.translations[defaultLang.id], 'short_description', data.short_description);
                  }
                  if (data.description) {
                    _this4.$set(_this4.translations[defaultLang.id], 'description', data.description);
                  }

                  // Create slug from default language title
                  _this4.createSlug(defaultLang.id);
                  _this4.updateDescriptionValidation();
                } else {
                  _this4.showError(response.data.message || 'AI failed');
                }
                _context.next = 19;
                break;
              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](9);
                _this4.showError('AI generation failed');
              case 19:
                _context.prev = 19;
                _this4.aiLoading = false;
                return _context.finish(19);
              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[9, 16, 19, 22]]);
      }))();
    },
    // Get editor configuration with safe fallbacks
    getEditorConfig: function getEditorConfig() {
      var _this5 = this;
      var plugins = this.$editorPlugins && Array.isArray(this.$editorPlugins) ? this.$editorPlugins : ["autolink", "lists", "link", "image", "charmap", "anchor", "searchreplace", "visualblocks", "media", "table", "wordcount", "code", "codesample"];
      var toolbar = this.$editorToolbar || "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | charmap | code | removeformat";
      var fontSizes = this.$editorFont_size_formats || '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt';
      return _objectSpread({
        height: 400,
        plugins: plugins,
        toolbar: toolbar,
        font_size_formats: fontSizes,
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup: function setup(editor) {
          editor.on('change', function () {
            _this5.updateDescriptionValidation();
          });
        }
      }, this.$tinymceImageUploadOptions());
    },
    // Get category name helper method
    getCategoryName: function getCategoryName(categoryId) {
      var category = this.translatedCategories.find(function (cat) {
        return cat.id === categoryId;
      });
      return category ? category.name : '';
    },
    // Fetch active languages
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this6 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee2() {
        var res, appLocale, currentLang, def;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().get(_this6.$apiUrl + '/active_languages');
              case 3:
                res = _context2.sent;
                if (res.data.status === 1 && Array.isArray(res.data.data)) {
                  _this6.activeLanguages = res.data.data;
                  appLocale = window.appLocale || 'en';
                  currentLang = _this6.activeLanguages.find(function (l) {
                    return l.code === appLocale;
                  });
                  if (currentLang) {
                    _this6.currentLanguageId = currentLang.id;
                  } else {
                    def = _this6.activeLanguages.find(function (l) {
                      return l.is_default === 1;
                    });
                    if (def) _this6.currentLanguageId = def.id;
                  }
                }
                _context2.next = 10;
                break;
              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                console.error('Language load failed', _context2.t0);
              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }))();
    },
    // Initialize translations for all languages
    initTranslations: function initTranslations() {
      var _this7 = this;
      this.translations = {};
      this.languages.forEach(function (lang) {
        _this7.$set(_this7.translations, lang.id, {
          title: '',
          description: '',
          short_description: '',
          meta_title: '',
          meta_keywords: '',
          meta_description: ''
        });
      });
    },
    // Open add modal - reset form and initialize translations
    openAddModal: function openAddModal() {
      var _this8 = this;
      this.resetForm();
      this.initTranslations();
      this.initTagIdsByLanguage();
      this.activeLanguageTab = 0;
      this.languagesKey++;
      this.create_new = true;
      this.$nextTick(function () {
        _this8.getAllTagsForModal();
        _this8.loadTagIdsFromSession();
      });
    },
    // Get all blogs
    getBlogs: function getBlogs() {
      var _this9 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee3() {
        var params, response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _this9.isLoading = true;
                _context3.prev = 1;
                params = {
                  limit: _this9.perPage,
                  page: _this9.currentPage
                };
                if (_this9.selectedCategory) {
                  params.category_id = _this9.selectedCategory;
                }
                _context3.next = 6;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().post(_this9.$apiUrl + '/blogs', params);
              case 6:
                response = _context3.sent;
                if (response.data.status === 1) {
                  _this9.blogs = response.data.data;
                  _this9.totalRows = response.data.total;
                } else {
                  _this9.showError(response.data.message);
                }
                _context3.next = 13;
                break;
              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](1);
                _this9.showError(__('something_went_wrong'));
              case 13:
                _context3.prev = 13;
                _this9.isLoading = false;
                return _context3.finish(13);
              case 16:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[1, 10, 13, 16]]);
      }))();
    },
    getLanguages: function getLanguages() {
      var _this10 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee4() {
        var res;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().get(_this10.$apiUrl + '/active_languages');
              case 3:
                res = _context4.sent;
                if (res.data.status === 1) {
                  _this10.languages = res.data.data;
                  _this10.initTranslations();
                }
                _context4.next = 10;
                break;
              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);
                console.error('Error loading languages', _context4.t0);
              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 7]]);
      }))();
    },
    getCategories: function getCategories() {
      var _this11 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee5() {
        var res;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().get(_this11.$apiUrl + '/blog_categories/dropdown');
              case 2:
                res = _context5.sent;
                if (res.data.status === 1) {
                  _this11.categories = res.data.data;
                }
              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }))();
    },
    /** Fetch tags for one language (used when modal is closed, e.g. list view). */getTags: function getTags(languageId) {
      var _this12 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee6() {
        var _ref, _ref2, _this12$languages$_th, lid, url, response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                lid = (_ref = (_ref2 = languageId !== null && languageId !== void 0 ? languageId : (_this12$languages$_th = _this12.languages[_this12.activeLanguageTab]) === null || _this12$languages$_th === void 0 ? void 0 : _this12$languages$_th.id) !== null && _ref2 !== void 0 ? _ref2 : _this12.currentLanguageId) !== null && _ref !== void 0 ? _ref : null;
                url = lid ? "".concat(_this12.$apiUrl, "/blog_tags?language_id=").concat(lid) : "".concat(_this12.$apiUrl, "/blog_tags");
                _context6.next = 5;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().get(url);
              case 5:
                response = _context6.sent;
                if (response.data.status === 1) {
                  _this12.tags = response.data.data;
                }
                _context6.next = 12;
                break;
              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6["catch"](0);
                console.error('Error fetching blog tags:', _context6.t0);
              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 9]]);
      }))();
    },
    /** Load all tags and group by language_id so every tab has options ready and selection persists when switching tabs */getAllTagsForModal: function getAllTagsForModal() {
      var _this13 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee7() {
        var res, byLang;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (_this13.languages.length) {
                  _context7.next = 2;
                  break;
                }
                return _context7.abrupt("return");
              case 2:
                _context7.prev = 2;
                _context7.next = 5;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().get("".concat(_this13.$apiUrl, "/blog_tags?all=1"));
              case 5:
                res = _context7.sent;
                if (!(res.data.status !== 1 || !Array.isArray(res.data.data))) {
                  _context7.next = 8;
                  break;
                }
                return _context7.abrupt("return");
              case 8:
                byLang = {};
                _this13.languages.forEach(function (lang) {
                  byLang[lang.id] = res.data.data.filter(function (t) {
                    return t.language_id === lang.id;
                  });
                });
                _this13.tagsByLanguage = byLang;
                _context7.next = 16;
                break;
              case 13:
                _context7.prev = 13;
                _context7.t0 = _context7["catch"](2);
                console.error('Error fetching all tags for modal:', _context7.t0);
              case 16:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[2, 13]]);
      }))();
    },
    /** Options for one language (for Tags multi-select). Returns { value, text } for b-form-select. */getTagsOptionsForLang: function getTagsOptionsForLang(langId) {
      if (!langId) return [];
      var list = this.create_new && this.tagsByLanguage[langId] ? this.tagsByLanguage[langId] : this.tags;
      var baseOptions = list.length ? list.map(function (tag) {
        var _tag$name;
        return {
          value: String(tag.id),
          text: (_tag$name = tag === null || tag === void 0 ? void 0 : tag.name) !== null && _tag$name !== void 0 ? _tag$name : String(tag.id)
        };
      }) : [];
      if (!this.create_new) return baseOptions;
      var selectedIds = this.getTagIdsForLang(langId);
      var existingIds = new Set(baseOptions.map(function (o) {
        return o.value;
      }));
      selectedIds.forEach(function (sid) {
        var id = String(sid);
        if (id && !existingIds.has(id)) {
          existingIds.add(id);
          baseOptions.push({
            value: id,
            text: id
          });
        }
      });
      return baseOptions;
    },
    /** Options for Select2: same as getTagsOptionsForLang but with { id, text } (Select2 expects id, not value). Shows only tags for this language tab. */getSelect2TagOptions: function getSelect2TagOptions(langId) {
      return this.getTagsOptionsForLang(langId).map(function (o) {
        return {
          id: o.value,
          text: o.text
        };
      });
    },
    /** Get tag IDs for one language (for Select2 :value). Each tab has its own list. */getTagIdsForLang: function getTagIdsForLang(langId) {
      var list = this.tagIdsByLanguage[langId];
      if (Array.isArray(list)) return list;
      if (list != null && list !== '') return [].concat(list);
      return [];
    },
    /** Set tag IDs for one language (for Select2 @input). Keeps selections separate per tab; persists to sessionStorage. */setTagIdsForLang: function setTagIdsForLang(langId, value) {
      var arr = Array.isArray(value) ? value : value ? [value] : [];
      var trimmed = arr.map(function (id) {
        return id != null ? String(id).trim() : '';
      }).filter(Boolean);
      if (trimmed.length === 0) {
        var _this$languages$this$;
        var currentLangId = (_this$languages$this$ = this.languages[this.activeLanguageTab]) === null || _this$languages$this$ === void 0 ? void 0 : _this$languages$this$.id;
        if (currentLangId !== langId) return;
      }
      this.$set(this.tagIdsByLanguage, langId, trimmed);
      this.saveTagIdsToSession();
    },
    /** Init tag IDs per language so each tab has its own array. */initTagIdsByLanguage: function initTagIdsByLanguage() {
      var _this14 = this;
      this.tagIdsByLanguage = {};
      this.languages.forEach(function (lang) {
        _this14.$set(_this14.tagIdsByLanguage, lang.id, []);
      });
    },
    /** SessionStorage key for tag selections (add vs edit so they don't mix). */getBlogTagsSessionKey: function getBlogTagsSessionKey() {
      return this.edit_record && this.edit_record.id ? "blog_form_tag_ids_".concat(this.edit_record.id) : 'blog_form_tag_ids_new';
    },
    /** Persist current tag selections to sessionStorage so they survive tab switches. */saveTagIdsToSession: function saveTagIdsToSession() {
      if (!this.create_new) return;
      try {
        var key = this.getBlogTagsSessionKey();
        sessionStorage.setItem(key, JSON.stringify(this.tagIdsByLanguage));
      } catch (e) {/* ignore */}
    },
    /** Restore tag selections from sessionStorage (e.g. after tab switch). */loadTagIdsFromSession: function loadTagIdsFromSession() {
      var _this15 = this;
      if (!this.create_new || !this.languages.length) return;
      try {
        var key = this.getBlogTagsSessionKey();
        var raw = sessionStorage.getItem(key);
        if (!raw) return;
        var parsed = JSON.parse(raw);
        if (parsed && _typeof(parsed) === 'object') {
          this.languages.forEach(function (lang) {
            var _parsed$lang$id;
            var val = (_parsed$lang$id = parsed[lang.id]) !== null && _parsed$lang$id !== void 0 ? _parsed$lang$id : parsed[String(lang.id)];
            if (Array.isArray(val)) {
              _this15.$set(_this15.tagIdsByLanguage, lang.id, val.map(function (id) {
                return String(id);
              }));
            }
          });
        }
      } catch (e) {/* ignore */}
    },
    /** Clear sessionStorage for tag selections (after save or reset). */clearTagIdsSession: function clearTagIdsSession() {
      try {
        sessionStorage.removeItem('blog_form_tag_ids_new');
        if (this.edit_record && this.edit_record.id) {
          sessionStorage.removeItem("blog_form_tag_ids_".concat(this.edit_record.id));
        }
      } catch (e) {/* ignore */}
    },
    triggerBlogImageClick: function triggerBlogImageClick() {
      var ref = this.$refs.blog_image;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (input && typeof input.click === 'function') {
        input.click();
      }
    },
    dropImageFile: function dropImageFile(event) {
      event.preventDefault();
      var ref = this.$refs.blog_image;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (!input) return;
      input.files = event.dataTransfer.files;
      this.handleImageUpload();
      // Clean up drag styles
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    handleImageUpload: function handleImageUpload() {
      var ref = this.$refs.blog_image;
      var input = Array.isArray(ref) ? ref[0] : ref;
      if (!input || !input.files || !input.files[0]) {
        return;
      }
      var file = input.files[0];
      this.imageError = null;
      var validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        this.imageError = this.__('invalid_image_type');
        return;
      }
      var maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.imageError = this.__('image_too_large_2mb');
        return;
      }
      this.form.image = file;
      this.form.image_url = URL.createObjectURL(file);
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this16 = this;
      var defaultLangIndex = this.languages.findIndex(function (lang) {
        return lang.id === _this16.defaultLanguageId;
      });
      if (defaultLangIndex !== -1) {
        this.showError(__('please_fill_default_language_required_fields'));
        this.activeLanguageTab = defaultLangIndex;
      }
    },
    saveBlog: function saveBlog(event) {
      var _this17 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee8() {
        var defaultLang, defaultTranslation, descriptionText, formEl, firstInvalid, formData, _defaultLang, _defaultTranslation, response;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _this17.updateDescriptionValidation();

                // Validate required fields for default language
                defaultLang = _this17.languages.find(function (l) {
                  return l.is_default;
                });
                if (!defaultLang) {
                  _context8.next = 17;
                  break;
                }
                defaultTranslation = _this17.translations[defaultLang.id]; // Validate title
                if (!(!(defaultTranslation !== null && defaultTranslation !== void 0 && defaultTranslation.title) || !defaultTranslation.title.trim())) {
                  _context8.next = 8;
                  break;
                }
                _this17.showError(__('please_fill_default_language_required_fields'));
                // this.activeLanguageTab = this.languages.findIndex(l => l.is_default);
                _this17.switchToDefaultLanguageTab();
                return _context8.abrupt("return");
              case 8:
                if (!(!(defaultTranslation !== null && defaultTranslation !== void 0 && defaultTranslation.short_description) || !defaultTranslation.short_description.trim())) {
                  _context8.next = 12;
                  break;
                }
                _this17.showError(__('please_fill_default_language_required_fields'));
                _this17.activeLanguageTab = _this17.languages.findIndex(function (l) {
                  return l.is_default;
                });
                return _context8.abrupt("return");
              case 12:
                // Validate description (strip HTML tags for validation)
                descriptionText = ((defaultTranslation === null || defaultTranslation === void 0 ? void 0 : defaultTranslation.description) || '').replace(/<[^>]*>/g, '').trim();
                if (descriptionText) {
                  _context8.next = 17;
                  break;
                }
                _this17.showError(__('please_fill_default_language_required_fields'));
                _this17.activeLanguageTab = _this17.languages.findIndex(function (l) {
                  return l.is_default;
                });
                return _context8.abrupt("return");
              case 17:
                formEl = event.target;
                if (formEl.checkValidity()) {
                  _context8.next = 22;
                  break;
                }
                firstInvalid = formEl.querySelector(':invalid');
                if (firstInvalid) {
                  firstInvalid.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });
                  setTimeout(function () {
                    firstInvalid.focus();
                    firstInvalid.reportValidity();
                  }, 100);
                } else {
                  formEl.reportValidity();
                }
                return _context8.abrupt("return");
              case 22:
                _this17.isSubmitting = true;
                _context8.prev = 23;
                formData = new FormData(); // Get default language translation for main blog fields
                _defaultLang = _this17.languages.find(function (l) {
                  return l.is_default;
                });
                _defaultTranslation = _defaultLang ? _this17.translations[_defaultLang.id] : null; // Basic fields
                formData.append('slug', _this17.form.slug);
                formData.append('category_id', _this17.form.category_id);
                formData.append('status', _this17.form.status);

                // Image
                if (_this17.form.image) {
                  formData.append('image', _this17.form.image);
                }

                // Tags: send per-language so backend can create new tags with correct language_id
                _this17.languages.forEach(function (lang) {
                  var ids = _this17.getTagIdsForLang(lang.id);
                  var str = Array.isArray(ids) ? ids.filter(Boolean).map(String).join(',') : ids || '';
                  if (str) formData.append("tag_ids_by_language[".concat(lang.id, "]"), str);
                });

                // Send only translations that have actual data (not empty)
                // This prevents storing empty translation records
                Object.keys(_this17.translations).forEach(function (langId) {
                  var tr = _this17.translations[langId];

                  // Check if translation has any meaningful data
                  var hasData = tr.title && tr.title.trim() !== '' || tr.description && tr.description.trim() !== '' || tr.short_description && tr.short_description.trim() !== '' || tr.meta_title && tr.meta_title.trim() !== '' || tr.meta_keywords && tr.meta_keywords.trim() !== '' || tr.meta_description && tr.meta_description.trim() !== '';

                  // Only send translations that have data
                  if (hasData) {
                    formData.append("translations[".concat(langId, "][title]"), tr.title || '');
                    formData.append("translations[".concat(langId, "][description]"), tr.description || '');
                    formData.append("translations[".concat(langId, "][short_description]"), tr.short_description || '');
                    formData.append("translations[".concat(langId, "][meta_title]"), tr.meta_title || '');
                    formData.append("translations[".concat(langId, "][meta_keywords]"), tr.meta_keywords || '');
                    formData.append("translations[".concat(langId, "][meta_description]"), tr.meta_description || '');
                  }
                });
                if (!_this17.edit_record.id) {
                  _context8.next = 39;
                  break;
                }
                _context8.next = 36;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().post("".concat(_this17.$apiUrl, "/blogs/update/").concat(_this17.edit_record.id), formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
              case 36:
                response = _context8.sent;
                _context8.next = 42;
                break;
              case 39:
                _context8.next = 41;
                return axios__WEBPACK_IMPORTED_MODULE_2___default().post("".concat(_this17.$apiUrl, "/blogs/save"), formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
                });
              case 41:
                response = _context8.sent;
              case 42:
                if (response.data.status === 1) {
                  _this17.showMessage('success', response.data.message);
                  _this17.create_new = false;
                  _this17.resetForm();
                  _this17.getBlogs();
                  _this17.getAllTagsForModal();
                } else {
                  _this17.showError(response.data.message);
                }
                _context8.next = 48;
                break;
              case 45:
                _context8.prev = 45;
                _context8.t0 = _context8["catch"](23);
                _this17.showError(__('something_went_wrong'));
              case 48:
                _context8.prev = 48;
                _this17.isSubmitting = false;
                return _context8.finish(48);
              case 51:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, null, [[23, 45, 48, 51]]);
      }))();
    },
    deleteBlog: function deleteBlog(index, id) {
      var _this18 = this;
      return _asyncToGenerator( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(function _callee9() {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _this18.$swal.fire({
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
                    _this18.isLoading = true;
                    axios__WEBPACK_IMPORTED_MODULE_2___default().post(_this18.$apiUrl + "/blogs/delete/".concat(id)).then(function (response) {
                      _this18.isLoading = false;
                      if (response.data.status === 1) {
                        _this18.showMessage('success', response.data.message);
                        _this18.getBlogs();
                      } else {
                        _this18.showError(response.data.message);
                      }
                    })["catch"](function (error) {
                      _this18.isLoading = false;
                      _this18.showError(__('something_went_wrong'));
                    });
                  }
                });
              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }))();
    },
    resetForm: function resetForm() {
      this.clearTagIdsSession();
      this.form = {
        title: '',
        slug: '',
        category_id: '',
        image: null,
        image_url: '',
        description: '',
        short_description: '',
        meta_title: '',
        meta_keywords: '',
        meta_description: '',
        status: 1
      };
      this.edit_record = {};
      this.tagIdsByLanguage = {};
      this.descriptionValidation = '';
      this.initTranslations();
      if (this.languages.length) this.initTagIdsByLanguage();
    },
    // Create slug from title (for default language only)
    createSlug: function createSlug(langId) {
      // Only create slug from default language title
      if (langId) {
        var defaultLang = this.languages.find(function (l) {
          return l.is_default;
        });
        if (defaultLang && defaultLang.id === langId) {
          var _this$translations$la;
          var title = ((_this$translations$la = this.translations[langId]) === null || _this$translations$la === void 0 ? void 0 : _this$translations$la.title) || '';
          if (title !== "") {
            var slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
            this.form.slug = slug;
          }
        }
      } else {
        var _this$translations$_d;
        // Fallback for old code that doesn't pass langId
        var _defaultLang2 = this.languages.find(function (l) {
          return l.is_default;
        });
        if (_defaultLang2 && (_this$translations$_d = this.translations[_defaultLang2.id]) !== null && _this$translations$_d !== void 0 && _this$translations$_d.title) {
          var _title = this.translations[_defaultLang2.id].title;
          if (_title !== "") {
            var _slug = _title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
            this.form.slug = _slug;
          }
        }
      }
    },
    updateDescriptionValidation: function updateDescriptionValidation() {
      var _this$translations$de;
      var defaultLang = this.languages.find(function (l) {
        return l.is_default;
      });
      if (!defaultLang) return;
      var html = ((_this$translations$de = this.translations[defaultLang.id]) === null || _this$translations$de === void 0 ? void 0 : _this$translations$de.description) || '';
      this.descriptionValidation = html.replace(/<[^>]*>/g, '').trim();
    },
    normalizeTagIds: function normalizeTagIds(tagValue) {
      if (Array.isArray(tagValue)) {
        return tagValue.map(function (tagId) {
          if (tagId === null || tagId === undefined) {
            return '';
          }
          return tagId.toString().trim();
        }).filter(function (tagId) {
          return tagId !== '';
        });
      }
      if (typeof tagValue === 'string') {
        return tagValue.split(',').map(function (tagId) {
          return tagId.trim();
        }).filter(function (tagId) {
          return tagId !== '';
        });
      }
      return [];
    }
  },
  watch: {
    edit_record: {
      handler: function handler(newVal) {
        var _this19 = this;
        if (!newVal.id) return;
        this.form = {
          slug: newVal.slug || '',
          category_id: newVal.category_id || '',
          status: newVal.status,
          image: null,
          image_url: newVal.image_url || ''
        };
        this.initTranslations();
        this.initTagIdsByLanguage();

        // Populate tags per language: fetch all tags, group by language for dropdown, and split blog.tags into each tab
        axios__WEBPACK_IMPORTED_MODULE_2___default().get("".concat(this.$apiUrl, "/blog_tags?all=1")).then(function (res) {
          if (res.data.status === 1 && Array.isArray(res.data.data)) {
            var allTags = res.data.data;
            var byLang = {};
            _this19.languages.forEach(function (lang) {
              byLang[lang.id] = allTags.filter(function (t) {
                return t.language_id === lang.id;
              });
            });
            _this19.tagsByLanguage = byLang;
            if (newVal.tags && newVal.tags.trim()) {
              var idToLang = {};
              allTags.forEach(function (t) {
                idToLang[String(t.id)] = t.language_id;
              });
              var blogTagIds = newVal.tags.split(',').map(function (id) {
                return id.trim();
              }).filter(Boolean);
              blogTagIds.forEach(function (tid) {
                var langId = idToLang[String(tid)];
                if (langId != null) {
                  var list = _this19.getTagIdsForLang(langId);
                  var sid = String(tid);
                  if (!list.includes(sid)) _this19.setTagIdsForLang(langId, list.concat(sid));
                }
              });
            }
            _this19.saveTagIdsToSession();
          }
        })["catch"](function () {});

        // Tab switch watcher will restore from session when user changes tabs

        // Get default language for fallback
        var defaultLang = this.languages.find(function (l) {
          return l.is_default;
        });

        // Load translations from API response - only populate languages that have translations
        if (Array.isArray(newVal.translations) && newVal.translations.length > 0) {
          newVal.translations.forEach(function (tr) {
            if (_this19.translations[tr.language_id]) {
              // Only populate if translation has data
              var hasData = tr.title && tr.title.trim() !== '' || tr.description && tr.description.trim() !== '' || tr.short_description && tr.short_description.trim() !== '';
              if (hasData) {
                _this19.translations[tr.language_id] = {
                  title: tr.title || '',
                  description: tr.description || '',
                  short_description: tr.short_description || '',
                  meta_title: tr.meta_title || '',
                  meta_keywords: tr.meta_keywords || '',
                  meta_description: tr.meta_description || ''
                };
              }
            }
          });
        }

        // Apply fallback only for default language if no translation exists
        // Other languages will remain empty if no translation exists
        if (defaultLang) {
          var defaultTranslation = this.translations[defaultLang.id];

          // Check if default language translation is missing or empty
          var isMissing = !defaultTranslation || !defaultTranslation.title && !defaultTranslation.description && !defaultTranslation.short_description;
          if (isMissing) {
            // Use main table data as fallback only for default language
            this.translations[defaultLang.id] = {
              title: newVal.title || '',
              description: newVal.description || '',
              short_description: newVal.short_description || '',
              meta_title: newVal.meta_title || '',
              meta_keywords: newVal.meta_keywords || '',
              meta_description: newVal.meta_description || ''
            };
          } else {
            // Fill in any empty fields in default language translation with main table data
            this.translations[defaultLang.id] = {
              title: defaultTranslation.title || newVal.title || '',
              description: defaultTranslation.description || newVal.description || '',
              short_description: defaultTranslation.short_description || newVal.short_description || '',
              meta_title: defaultTranslation.meta_title || newVal.meta_title || '',
              meta_keywords: defaultTranslation.meta_keywords || newVal.meta_keywords || '',
              meta_description: defaultTranslation.meta_description || newVal.meta_description || ''
            };
          }
        }
        this.create_new = true;
        this.activeLanguageTab = 0;
        this.languagesKey++;
        this.$nextTick(function () {
          _this19.updateDescriptionValidation();
        });
      },
      deep: true
    },
    activeLanguageTab: function activeLanguageTab() {
      if (this.create_new && this.languages.length) {
        this.saveTagIdsToSession();
        this.loadTagIdsFromSession();
      }
    },
    currentPage: function currentPage() {
      this.getBlogs();
    },
    perPage: function perPage() {
      this.currentPage = 1;
      this.getBlogs();
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

/***/ "./resources/js/views/Blogs/Blogs.vue":
/*!********************************************!*\
  !*** ./resources/js/views/Blogs/Blogs.vue ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Blogs_vue_vue_type_template_id_3efd3ca4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Blogs.vue?vue&type=template&id=3efd3ca4 */ "./resources/js/views/Blogs/Blogs.vue?vue&type=template&id=3efd3ca4");
/* harmony import */ var _Blogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Blogs.vue?vue&type=script&lang=js */ "./resources/js/views/Blogs/Blogs.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Blogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Blogs_vue_vue_type_template_id_3efd3ca4__WEBPACK_IMPORTED_MODULE_0__.render,
  _Blogs_vue_vue_type_template_id_3efd3ca4__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Blogs/Blogs.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Blogs/Blogs.vue?vue&type=script&lang=js":
/*!********************************************************************!*\
  !*** ./resources/js/views/Blogs/Blogs.vue?vue&type=script&lang=js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Blogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Blogs.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/Blogs.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Blogs_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Blogs/Blogs.vue?vue&type=template&id=3efd3ca4":
/*!**************************************************************************!*\
  !*** ./resources/js/views/Blogs/Blogs.vue?vue&type=template&id=3efd3ca4 ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Blogs_vue_vue_type_template_id_3efd3ca4__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Blogs_vue_vue_type_template_id_3efd3ca4__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Blogs_vue_vue_type_template_id_3efd3ca4__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Blogs.vue?vue&type=template&id=3efd3ca4 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/Blogs.vue?vue&type=template&id=3efd3ca4");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/Blogs.vue?vue&type=template&id=3efd3ca4":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Blogs/Blogs.vue?vue&type=template&id=3efd3ca4 ***!
  \*****************************************************************************************************************************************************************************************************************/
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
            _c("h3", [_vm._v(_vm._s(_vm.__("blogs")))]),
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
                    [_vm._v(_vm._s(_vm.__("blogs")))]
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
                _c("h4", [_vm._v(_vm._s(_vm.__("blogs")))]),
                _vm._v(" "),
                _c("span", { staticClass: "pull-right" }, [
                  _vm.$can("blog_create")
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
                          staticClass: "btn btn-primary",
                          on: { click: _vm.openAddModal },
                        },
                        [_vm._v(_vm._s(_vm.__("add_blog")))]
                      )
                    : _vm._e(),
                ]),
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "card-body" },
                [
                  _c(
                    "b-row",
                    { staticClass: "mb-2" },
                    [
                      _c(
                        "b-col",
                        { attrs: { md: "2" } },
                        [
                          _c("h6", { staticClass: "box-title" }, [
                            _vm._v(_vm._s(_vm.__("category"))),
                          ]),
                          _vm._v(" "),
                          _c(
                            "b-form-select",
                            {
                              staticClass: "form-control form-select",
                              on: {
                                change: function ($event) {
                                  return _vm.getBlogs()
                                },
                              },
                              model: {
                                value: _vm.selectedCategory,
                                callback: function ($$v) {
                                  _vm.selectedCategory = $$v
                                },
                                expression: "selectedCategory",
                              },
                            },
                            [
                              _c("option", { attrs: { value: "" } }, [
                                _vm._v(_vm._s(_vm.__("all_categories"))),
                              ]),
                              _vm._v(" "),
                              _vm._l(
                                _vm.translatedCategories,
                                function (category) {
                                  return _c(
                                    "option",
                                    {
                                      key: category.id,
                                      domProps: { value: category.id },
                                    },
                                    [_vm._v(_vm._s(category.name))]
                                  )
                                }
                              ),
                            ],
                            2
                          ),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "b-col",
                        { attrs: { md: "3", "offset-md": "5" } },
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
                                  return _vm.getBlogs()
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
                  _c("b-table", {
                    attrs: {
                      items: _vm.translatedBlogs,
                      fields: _vm.fields,
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
                              { staticClass: "text-center text-black my-2" },
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
                        key: "cell(image)",
                        fn: function (row) {
                          return [
                            row.item.image_url
                              ? _c("img", {
                                  attrs: {
                                    src: row.item.image_url,
                                    height: "50",
                                  },
                                })
                              : _c("span", { staticClass: "text-muted" }, [
                                  _vm._v(_vm._s(_vm.__("no_image"))),
                                ]),
                          ]
                        },
                      },
                      {
                        key: "cell(category)",
                        fn: function (row) {
                          return [
                            _c("span", [
                              _vm._v(
                                _vm._s(
                                  row.item.category
                                    ? row.item.category.name
                                    : "-"
                                )
                              ),
                            ]),
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
                            _vm.$can("blog_update")
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
                                        _vm.edit_record = row.item
                                      },
                                    },
                                  },
                                  [_c("i", { staticClass: "fa fa-pencil-alt" })]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            _vm.$can("blog_delete")
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
                                        return _vm.deleteBlog(
                                          row.index,
                                          row.item.id
                                        )
                                      },
                                    },
                                  },
                                  [_c("i", { staticClass: "fa fa-trash" })]
                                )
                              : _vm._e(),
                          ]
                        },
                      },
                    ]),
                  }),
                  _vm._v(" "),
                  _c(
                    "b-row",
                    [
                      _c("b-col", { staticClass: "my-1", attrs: { md: "2" } }, [
                        _c(
                          "label",
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
                      ]),
                      _vm._v(" "),
                      _c(
                        "b-col",
                        {
                          staticClass: "my-1",
                          attrs: { md: "2", "offset-md": "8" },
                        },
                        [
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
      _c(
        "b-modal",
        {
          attrs: {
            title: _vm.edit_record.id
              ? _vm.__("edit_blog")
              : _vm.__("add_blog"),
            size: "xl",
            "hide-footer": true,
            id: "blog-modal",
          },
          on: { hide: _vm.resetForm },
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
              attrs: {
                enctype: "multipart/form-data",
                id: "blog-form",
                novalidate: "",
              },
              on: {
                submit: function ($event) {
                  $event.preventDefault()
                  return _vm.saveBlog.apply(null, arguments)
                },
              },
            },
            [
              _vm.languages.length
                ? _c(
                    "b-tabs",
                    {
                      key: _vm.languagesKey,
                      model: {
                        value: _vm.activeLanguageTab,
                        callback: function ($$v) {
                          _vm.activeLanguageTab = $$v
                        },
                        expression: "activeLanguageTab",
                      },
                    },
                    _vm._l(_vm.languages, function (lang, index) {
                      return _c(
                        "b-tab",
                        {
                          key: lang.id,
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
                                          "text-primary": lang.is_default,
                                        },
                                      },
                                      [
                                        _vm._v(
                                          "\n                            " +
                                            _vm._s(lang.name) +
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
                          lang.is_default && _vm.languages.length > 1
                            ? _c(
                                "div",
                                { staticClass: "my-3" },
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
                                          return _vm.translateEmpty(lang)
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
                                          return _vm.translateOverwrite(lang)
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
                          lang.is_default
                            ? [
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c("label", { attrs: { for: "title" } }, [
                                        _vm._v(_vm._s(_vm.__("title")) + " "),
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
                                            value:
                                              _vm.translations[lang.id].title,
                                            expression:
                                              "translations[lang.id].title",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          type: "text",
                                          id: "title",
                                          placeholder:
                                            _vm.__("enter_blog_title"),
                                          required: "",
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id].title,
                                        },
                                        on: {
                                          keyup: function ($event) {
                                            return _vm.createSlug(lang.id)
                                          },
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "title",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                    _vm._v(" "),
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "category_id" } },
                                        [
                                          _vm._v(
                                            _vm._s(_vm.__("category")) + " "
                                          ),
                                          _c(
                                            "span",
                                            { staticClass: "text-danger" },
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
                                              value: _vm.form.category_id,
                                              expression: "form.category_id",
                                            },
                                          ],
                                          staticClass:
                                            "form-control form-select",
                                          attrs: {
                                            id: "category_id",
                                            name: "category_id",
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
                                                _vm.form,
                                                "category_id",
                                                $event.target.multiple
                                                  ? $$selectedVal
                                                  : $$selectedVal[0]
                                              )
                                            },
                                          },
                                        },
                                        [
                                          _c(
                                            "option",
                                            { attrs: { value: "" } },
                                            [
                                              _vm._v(
                                                _vm._s(
                                                  _vm.__("select_category")
                                                )
                                              ),
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _vm._l(
                                            _vm.translatedCategories,
                                            function (category) {
                                              return _c(
                                                "option",
                                                {
                                                  key: category.id,
                                                  domProps: {
                                                    value: category.id,
                                                  },
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                            " +
                                                      _vm._s(category.name) +
                                                      "\n                                        "
                                                  ),
                                                ]
                                              )
                                            }
                                          ),
                                        ],
                                        2
                                      ),
                                    ]),
                                    _vm._v(" "),
                                    _c("div", { staticClass: "form-group" }, [
                                      _c("label", { attrs: { for: "image" } }, [
                                        _vm._v(_vm._s(_vm.__("image")) + " "),
                                        !_vm.edit_record.id ||
                                        !_vm.form.image_url
                                          ? _c(
                                              "span",
                                              { staticClass: "text-danger" },
                                              [_vm._v("*")]
                                            )
                                          : _vm._e(),
                                      ]),
                                      _vm._v(" "),
                                      _c("p", { staticClass: "text-muted" }, [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(
                                              _vm.__("supported_formats")
                                            ) +
                                            ": JPG, PNG, GIF (" +
                                            _vm._s(_vm.__("max_size")) +
                                            ": 2MB)\n                                    "
                                        ),
                                      ]),
                                      _vm._v(" "),
                                      _vm.imageError
                                        ? _c("span", { staticClass: "error" }, [
                                            _vm._v(_vm._s(_vm.imageError)),
                                          ])
                                        : _vm._e(),
                                      _vm._v(" "),
                                      _c("input", {
                                        ref: "blog_image",
                                        refInFor: true,
                                        staticClass: "file-input",
                                        attrs: {
                                          type: "file",
                                          id: "image",
                                          name: "blog_image",
                                          accept: "image/*",
                                        },
                                        on: { change: _vm.handleImageUpload },
                                      }),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        {
                                          staticClass:
                                            "file-input-div bg-gray-100",
                                          on: {
                                            click: _vm.triggerBlogImageClick,
                                            drop: _vm.dropImageFile,
                                            dragover: _vm.$dragoverFile,
                                            dragleave: _vm.$dragleaveFile,
                                          },
                                        },
                                        [
                                          _vm.form.image && _vm.form.image.name
                                            ? [
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.__(
                                                        "selected_file_name"
                                                      )
                                                    ) +
                                                      " " +
                                                      _vm._s(
                                                        _vm.form.image.name
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
                                      _vm.form.image_url
                                        ? _c(
                                            "div",
                                            { staticClass: "row mt-2" },
                                            [
                                              _c(
                                                "div",
                                                { staticClass: "col-md-6" },
                                                [
                                                  _c("img", {
                                                    staticClass:
                                                      "img-thumbnail custom-imag",
                                                    attrs: {
                                                      src: _vm.form.image_url,
                                                      alt: _vm.__("image"),
                                                    },
                                                  }),
                                                ]
                                              ),
                                            ]
                                          )
                                        : _vm._e(),
                                    ]),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c("label", { attrs: { for: "slug" } }, [
                                        _vm._v(_vm._s(_vm.__("slug")) + " "),
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
                                            value: _vm.form.slug,
                                            expression: "form.slug",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          type: "text",
                                          id: "slug",
                                          placeholder: _vm.__("enter_slug"),
                                          required: "",
                                        },
                                        domProps: { value: _vm.form.slug },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.form,
                                              "slug",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                    _vm._v(" "),
                                    _c("div", { staticClass: "form-group" }, [
                                      _c("label", [
                                        _vm._v(_vm._s(_vm.__("status"))),
                                      ]),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        { staticClass: "mt-1" },
                                        [
                                          _c("b-form-radio-group", {
                                            attrs: {
                                              options: [
                                                {
                                                  text: _vm.__("deactivate"),
                                                  value: 0,
                                                },
                                                {
                                                  text: _vm.__("activate"),
                                                  value: 1,
                                                },
                                              ],
                                              buttons: "",
                                              "button-variant":
                                                "outline-primary",
                                              required: "",
                                            },
                                            model: {
                                              value: _vm.form.status,
                                              callback: function ($$v) {
                                                _vm.$set(
                                                  _vm.form,
                                                  "status",
                                                  $$v
                                                )
                                              },
                                              expression: "form.status",
                                            },
                                          }),
                                        ],
                                        1
                                      ),
                                    ]),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "short_description" } },
                                        [
                                          _vm._v(
                                            _vm._s(
                                              _vm.__("short_description")
                                            ) + " "
                                          ),
                                          _c(
                                            "span",
                                            { staticClass: "text-danger" },
                                            [_vm._v("*")]
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        {
                                          staticClass:
                                            "d-flex align-items-start",
                                        },
                                        [
                                          _c(
                                            "div",
                                            {
                                              staticClass: "flex-grow-1",
                                              staticStyle: {
                                                "margin-right": "10px",
                                              },
                                            },
                                            [
                                              _c("textarea", {
                                                directives: [
                                                  {
                                                    name: "model",
                                                    rawName: "v-model",
                                                    value:
                                                      _vm.translations[lang.id]
                                                        .short_description,
                                                    expression:
                                                      "translations[lang.id].short_description",
                                                  },
                                                ],
                                                staticClass: "form-control",
                                                attrs: {
                                                  id: "short_description",
                                                  rows: "3",
                                                  placeholder:
                                                    _vm.__("short_description"),
                                                  required: "",
                                                },
                                                domProps: {
                                                  value:
                                                    _vm.translations[lang.id]
                                                      .short_description,
                                                },
                                                on: {
                                                  input: function ($event) {
                                                    if (
                                                      $event.target.composing
                                                    ) {
                                                      return
                                                    }
                                                    _vm.$set(
                                                      _vm.translations[lang.id],
                                                      "short_description",
                                                      $event.target.value
                                                    )
                                                  },
                                                },
                                              }),
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c("div", [
                                            _c(
                                              "button",
                                              {
                                                directives: [
                                                  {
                                                    name: "b-tooltip",
                                                    rawName:
                                                      "v-b-tooltip.hover",
                                                    modifiers: { hover: true },
                                                  },
                                                ],
                                                staticClass: "btn btn-success",
                                                attrs: {
                                                  type: "button",
                                                  disabled: _vm.aiLoading,
                                                  title: "Generate with AI",
                                                },
                                                on: {
                                                  click: _vm.generateWithAI,
                                                },
                                              },
                                              [
                                                _vm.aiLoading
                                                  ? _c("span", [
                                                      _c("i", {
                                                        staticClass:
                                                          "fa fa-spinner fa-spin",
                                                      }),
                                                      _vm._v(
                                                        " AI...\n                                                "
                                                      ),
                                                    ])
                                                  : _c("span", [
                                                      _c("i", {
                                                        staticClass:
                                                          "fa fa-magic",
                                                      }),
                                                      _vm._v(
                                                        " " +
                                                          _vm._s(
                                                            _vm.__(
                                                              "generate_with_ai"
                                                            )
                                                          ) +
                                                          "\n                                                "
                                                      ),
                                                    ]),
                                              ]
                                            ),
                                          ]),
                                        ]
                                      ),
                                    ]),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c(
                                      "div",
                                      { staticClass: "form-group" },
                                      [
                                        _c(
                                          "label",
                                          { attrs: { for: "description" } },
                                          [
                                            _vm._v(
                                              _vm._s(_vm.__("description")) +
                                                " "
                                            ),
                                            _c(
                                              "span",
                                              { staticClass: "text-danger" },
                                              [_vm._v("*")]
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c("editor", {
                                          attrs: {
                                            init: _vm.getEditorConfig(),
                                            placeholder: _vm.__(
                                              "enter_blog_description"
                                            ),
                                          },
                                          on: {
                                            input:
                                              _vm.updateDescriptionValidation,
                                          },
                                          model: {
                                            value:
                                              _vm.translations[lang.id]
                                                .description,
                                            callback: function ($$v) {
                                              _vm.$set(
                                                _vm.translations[lang.id],
                                                "description",
                                                $$v
                                              )
                                            },
                                            expression:
                                              "translations[lang.id].description",
                                          },
                                        }),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.descriptionValidation,
                                              expression:
                                                "descriptionValidation",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          staticStyle: {
                                            height: "2px",
                                            padding: "0",
                                            "margin-top": "2px",
                                            "font-size": "1px",
                                            "line-height": "2px",
                                          },
                                          attrs: {
                                            type: "text",
                                            id: "description_validation",
                                            tabindex: "-1",
                                            "aria-label":
                                              "Description validation",
                                            required: "",
                                          },
                                          domProps: {
                                            value: _vm.descriptionValidation,
                                          },
                                          on: {
                                            input: function ($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.descriptionValidation =
                                                $event.target.value
                                            },
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c(
                                      "div",
                                      { staticClass: "form-group" },
                                      [
                                        _c(
                                          "label",
                                          {
                                            staticClass: "control-label",
                                            attrs: { for: "tags" },
                                          },
                                          [
                                            _vm._v(
                                              "\n                                        " +
                                                _vm._s(_vm.__("tags")) +
                                                " ( " +
                                                _vm._s(
                                                  _vm.__(
                                                    "these_tags_help_you_in_search_result"
                                                  )
                                                ) +
                                                " )\n                                    "
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c("Select2", {
                                          key: "blog-tags-" + lang.id,
                                          attrs: {
                                            value: _vm.getTagIdsForLang(
                                              lang.id
                                            ),
                                            placeholder: "Select Tags",
                                            "no-add-on-enter": "",
                                            options: _vm.getSelect2TagOptions(
                                              lang.id
                                            ),
                                            separator: " ,;",
                                            settings: _vm.tagSelectSettings,
                                          },
                                          on: {
                                            input: function ($event) {
                                              return _vm.setTagIdsForLang(
                                                lang.id,
                                                $event
                                              )
                                            },
                                            change: function ($event) {
                                              return _vm.setTagIdsForLang(
                                                lang.id,
                                                $event
                                              )
                                            },
                                          },
                                        }),
                                        _vm._v(" "),
                                        _vm.getTagsOptionsForLang(lang.id)
                                          .length === 0
                                          ? _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "text-muted small mt-1",
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__(
                                                      "no_tags_available"
                                                    ) ||
                                                      "No tags available for this language."
                                                  )
                                                ),
                                              ]
                                            )
                                          : _vm._e(),
                                      ],
                                      1
                                    ),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "meta_title" } },
                                        [_vm._v(_vm._s(_vm.__("meta_title")))]
                                      ),
                                      _vm._v(" "),
                                      _c("input", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.translations[lang.id]
                                                .meta_title,
                                            expression:
                                              "translations[lang.id].meta_title",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          type: "text",
                                          id: "meta_title",
                                          placeholder:
                                            _vm.__("enter_meta_title"),
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id]
                                              .meta_title,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "meta_title",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "meta_keywords" } },
                                        [
                                          _vm._v(
                                            _vm._s(_vm.__("meta_keywords"))
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("textarea", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.translations[lang.id]
                                                .meta_keywords,
                                            expression:
                                              "translations[lang.id].meta_keywords",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          id: "meta_keywords",
                                          rows: "3",
                                          placeholder: _vm.__(
                                            "enter_meta_keywords"
                                          ),
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id]
                                              .meta_keywords,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "meta_keywords",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "meta_description" } },
                                        [
                                          _vm._v(
                                            _vm._s(_vm.__("meta_description"))
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("textarea", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.translations[lang.id]
                                                .meta_description,
                                            expression:
                                              "translations[lang.id].meta_description",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          id: "meta_description",
                                          rows: "3",
                                          placeholder: _vm.__(
                                            "enter_meta_description"
                                          ),
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id]
                                              .meta_description,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "meta_description",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                  ]),
                                ]),
                              ]
                            : [
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c("label", { attrs: { for: "title" } }, [
                                        _vm._v(_vm._s(_vm.__("title"))),
                                      ]),
                                      _vm._v(" "),
                                      _c("input", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.translations[lang.id].title,
                                            expression:
                                              "translations[lang.id].title",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          type: "text",
                                          id: "title",
                                          placeholder:
                                            _vm.__("enter_blog_title"),
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id].title,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "title",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "short_description" } },
                                        [
                                          _vm._v(
                                            _vm._s(_vm.__("short_description"))
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("textarea", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.translations[lang.id]
                                                .short_description,
                                            expression:
                                              "translations[lang.id].short_description",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          id: "short_description",
                                          rows: "3",
                                          placeholder:
                                            _vm.__("short_description"),
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id]
                                              .short_description,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "short_description",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c(
                                      "div",
                                      { staticClass: "form-group" },
                                      [
                                        _c(
                                          "label",
                                          { attrs: { for: "description" } },
                                          [
                                            _vm._v(
                                              _vm._s(_vm.__("description"))
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c("editor", {
                                          attrs: {
                                            init: _vm.getEditorConfig(),
                                          },
                                          model: {
                                            value:
                                              _vm.translations[lang.id]
                                                .description,
                                            callback: function ($$v) {
                                              _vm.$set(
                                                _vm.translations[lang.id],
                                                "description",
                                                $$v
                                              )
                                            },
                                            expression:
                                              "translations[lang.id].description",
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c(
                                      "div",
                                      { staticClass: "form-group" },
                                      [
                                        _c(
                                          "label",
                                          {
                                            staticClass: "control-label",
                                            attrs: { for: "tags" },
                                          },
                                          [
                                            _vm._v(
                                              "\n                                        " +
                                                _vm._s(_vm.__("tags")) +
                                                " ( " +
                                                _vm._s(
                                                  _vm.__(
                                                    "these_tags_help_you_in_search_result"
                                                  )
                                                ) +
                                                " )\n                                    "
                                            ),
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c("Select2", {
                                          key: "blog-tags-" + lang.id,
                                          attrs: {
                                            value: _vm.getTagIdsForLang(
                                              lang.id
                                            ),
                                            placeholder: "Select Tags",
                                            "no-add-on-enter": "",
                                            options: _vm.getSelect2TagOptions(
                                              lang.id
                                            ),
                                            separator: " ,;",
                                            settings: _vm.tagSelectSettings,
                                          },
                                          on: {
                                            input: function ($event) {
                                              return _vm.setTagIdsForLang(
                                                lang.id,
                                                $event
                                              )
                                            },
                                            change: function ($event) {
                                              return _vm.setTagIdsForLang(
                                                lang.id,
                                                $event
                                              )
                                            },
                                          },
                                        }),
                                        _vm._v(" "),
                                        _vm.getTagsOptionsForLang(lang.id)
                                          .length === 0
                                          ? _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "text-muted small mt-1",
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.__(
                                                      "no_tags_available"
                                                    ) ||
                                                      "No tags available for this language."
                                                  )
                                                ),
                                              ]
                                            )
                                          : _vm._e(),
                                      ],
                                      1
                                    ),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-12" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "meta_title" } },
                                        [_vm._v(_vm._s(_vm.__("meta_title")))]
                                      ),
                                      _vm._v(" "),
                                      _c("input", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.translations[lang.id]
                                                .meta_title,
                                            expression:
                                              "translations[lang.id].meta_title",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          type: "text",
                                          id: "meta_title",
                                          placeholder:
                                            _vm.__("enter_meta_title"),
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id]
                                              .meta_title,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "meta_title",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                  ]),
                                ]),
                                _vm._v(" "),
                                _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "meta_keywords" } },
                                        [
                                          _vm._v(
                                            _vm._s(_vm.__("meta_keywords"))
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("textarea", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.translations[lang.id]
                                                .meta_keywords,
                                            expression:
                                              "translations[lang.id].meta_keywords",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          id: "meta_keywords",
                                          rows: "3",
                                          placeholder: _vm.__(
                                            "enter_meta_keywords"
                                          ),
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id]
                                              .meta_keywords,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "meta_keywords",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c("div", { staticClass: "form-group" }, [
                                      _c(
                                        "label",
                                        { attrs: { for: "meta_description" } },
                                        [
                                          _vm._v(
                                            _vm._s(_vm.__("meta_description"))
                                          ),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      _c("textarea", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value:
                                              _vm.translations[lang.id]
                                                .meta_description,
                                            expression:
                                              "translations[lang.id].meta_description",
                                          },
                                        ],
                                        staticClass: "form-control",
                                        attrs: {
                                          id: "meta_description",
                                          rows: "3",
                                          placeholder: _vm.__(
                                            "enter_meta_description"
                                          ),
                                        },
                                        domProps: {
                                          value:
                                            _vm.translations[lang.id]
                                              .meta_description,
                                        },
                                        on: {
                                          input: function ($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.translations[lang.id],
                                              "meta_description",
                                              $event.target.value
                                            )
                                          },
                                        },
                                      }),
                                    ]),
                                  ]),
                                ]),
                              ],
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
                { staticClass: "form-group d-flex justify-content-end" },
                [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-secondary mr-2",
                      attrs: { type: "button" },
                      on: {
                        click: function ($event) {
                          _vm.create_new = false
                          _vm.resetForm()
                        },
                      },
                    },
                    [_vm._v(_vm._s(_vm.__("cancel")))]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary",
                      attrs: { type: "submit", disabled: _vm.isSubmitting },
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