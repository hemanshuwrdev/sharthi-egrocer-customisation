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
/* harmony import */ var _tinymce_tinymce_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @tinymce/tinymce-vue */ "./node_modules/@tinymce/tinymce-vue/lib/es2015/main/ts/index.js");
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['id'],
  components: {
    'editor': _tinymce_tinymce_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      isSaving: false,
      isEdit: false,
      product: {
        id: null,
        slug: '',
        parent_company_id: null,
        brand_id: null,
        category_id: null,
        tax_id: null,
        hsn: '',
        type: 'single',
        status: 1
      },
      // Main image
      imageFile: null,
      main_image_path: '',
      main_image_name: '',
      mainImageError: null,
      // Other images
      images: [],
      // newly selected (not yet uploaded)
      other_images: [],
      // already-uploaded paths from server
      deletedOtherImages: [],
      otherImageError: null,
      variants: [this.blankVariant()],
      brands: [],
      categories: [],
      taxes: [],
      units: [],
      // Parent company picker
      pcQuery: '',
      pcResults: [],
      pcDropdownOpen: false,
      pcDebounce: null,
      // Multi-language
      isLoadingLanguages: false,
      activeLanguageTab: 0,
      activeSeoLanguageTab: 0,
      languages: [],
      defaultLanguageId: null,
      translations: {}
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
    var _this = this;
    this.isEdit = !!this.id;
    this.fetchActiveLanguages().then(function () {
      _this.fetchLookups();
      if (_this.isEdit) {
        _this.fetchProduct();
      }
    });
  },
  methods: {
    // ---------- Languages / translations ----------
    fetchActiveLanguages: function fetchActiveLanguages() {
      var _this2 = this;
      this.isLoadingLanguages = true;
      return axios.get(this.$apiUrl + '/active_languages').then(function (r) {
        _this2.languages = r.data.data || [];
        var defaultLang = _this2.languages.find(function (l) {
          return l.is_default === 1;
        });
        if (defaultLang) _this2.defaultLanguageId = defaultLang.id;
        _this2.initializeTranslations();
        _this2.isLoadingLanguages = false;
      })["catch"](function () {
        _this2.isLoadingLanguages = false;
      });
    },
    initializeTranslations: function initializeTranslations() {
      var all = {};
      this.languages.forEach(function (language) {
        all[language.id] = {
          name: '',
          description: '',
          meta_title: '',
          meta_keywords: '',
          schema_markup: '',
          meta_description: ''
        };
      });
      this.translations = all;
    },
    loadTranslationsFromRecord: function loadTranslationsFromRecord(record) {
      var _this3 = this;
      if (!record || !Array.isArray(record.translations)) return;
      this.languages.forEach(function (language) {
        var t = record.translations.find(function (tr) {
          return tr.language_id === language.id;
        });
        if (t) {
          _this3.$set(_this3.translations[language.id], 'name', t.name || '');
          _this3.$set(_this3.translations[language.id], 'description', t.description || '');
          _this3.$set(_this3.translations[language.id], 'meta_title', t.meta_title || '');
          _this3.$set(_this3.translations[language.id], 'meta_keywords', t.meta_keywords || '');
          _this3.$set(_this3.translations[language.id], 'schema_markup', t.schema_markup || '');
          _this3.$set(_this3.translations[language.id], 'meta_description', t.meta_description || '');
        }
      });

      // Default language fallback: if no record for default lang, use base columns
      if (this.defaultLanguageId && this.translations[this.defaultLanguageId]) {
        var dt = this.translations[this.defaultLanguageId];
        if (!dt.name) dt.name = record.name || '';
        if (!dt.description) dt.description = record.description || '';
        if (!dt.meta_title) dt.meta_title = record.meta_title || '';
        if (!dt.meta_keywords) dt.meta_keywords = record.meta_keywords || '';
        if (!dt.schema_markup) dt.schema_markup = record.schema_markup || '';
        if (!dt.meta_description) dt.meta_description = record.meta_description || '';
      }
    },
    switchToDefaultLanguageTab: function switchToDefaultLanguageTab() {
      var _this4 = this;
      var idx = this.languages.findIndex(function (l) {
        return l.id === _this4.defaultLanguageId;
      });
      if (idx !== -1) this.activeLanguageTab = idx;
    },
    onNameInput: function onNameInput(language) {
      if (language.is_default) this.createSlug();
    },
    createSlug: function createSlug() {
      var name = (this.translations[this.defaultLanguageId] || {}).name || '';
      if (!name) {
        this.product.slug = '';
        return;
      }
      this.product.slug = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/(?:(?![\t-\r \x2D0-9A-Za-z\xA0\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2000-\u200A\u2028\u2029\u202F\u205F\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3000\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFEFF\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])[\s\S])/g, '').trim().replace(/\s+/g, '-').toLowerCase();
    },
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
    // ---------- Lookups ----------
    fetchLookups: function fetchLookups() {
      var _this5 = this;
      axios.get(this.$apiUrl + '/products/brands/get').then(function (r) {
        _this5.brands = r.data.data || [];
      });
      axios.get(this.$apiUrl + '/categories', {
        params: {
          per_page: 1000
        }
      }).then(function (r) {
        _this5.categories = r.data.data || [];
      })["catch"](function () {});
      axios.get(this.$apiUrl + '/products/taxes').then(function (r) {
        _this5.taxes = r.data.data || [];
      })["catch"](function () {});
      axios.get(this.$apiUrl + '/units/get').then(function (r) {
        _this5.units = r.data.data || [];
      })["catch"](function () {});
    },
    fetchProduct: function fetchProduct() {
      var _this6 = this;
      axios.get(this.$apiUrl + '/master_catalog/products/edit/' + this.id).then(function (r) {
        var p = r.data.data;
        if (!p) return;
        _this6.product = {
          id: p.id,
          slug: p.slug || '',
          parent_company_id: p.parent_company_id,
          brand_id: p.brand_id,
          category_id: p.category_id,
          tax_id: p.tax_id,
          hsn: p.hsn,
          type: p.type || 'single',
          status: p.status
        };
        _this6.pcQuery = p.parent_company ? p.parent_company.name : '';
        if (p.image) {
          _this6.main_image_path = _this6.$storageUrl + p.image;
        }
        _this6.other_images = Array.isArray(p.other_images) ? p.other_images.slice() : [];
        if (Array.isArray(p.variants) && p.variants.length) {
          _this6.variants = p.variants.map(function (v) {
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
        _this6.loadTranslationsFromRecord(p);
      });
    },
    // ---------- Main image ----------
    triggerRefClick: function triggerRefClick(refName) {
      var _this7 = this;
      this.$nextTick(function () {
        try {
          var ref = _this7.$refs[refName];
          if (!ref) return;
          if (Array.isArray(ref)) {
            for (var i = 0; i < ref.length; i++) {
              if (ref[i] && typeof ref[i].click === 'function') {
                ref[i].click();
                return;
              }
            }
            return;
          }
          if (typeof ref.click === 'function') ref.click();
        } catch (e) {/* ignore */}
      });
    },
    dropFile: function dropFile(event) {
      event.preventDefault();
      var fileInput = Array.isArray(this.$refs.file_image) ? this.$refs.file_image[0] : this.$refs.file_image;
      if (fileInput) {
        fileInput.files = event.dataTransfer.files;
        this.fileImage();
      }
    },
    fileImage: function fileImage() {
      var fileInput = Array.isArray(this.$refs.file_image) ? this.$refs.file_image[0] : this.$refs.file_image;
      if (!fileInput) return;
      var file = fileInput.files[0];
      this.mainImageError = null;
      if (!file) return;
      var validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        this.mainImageError = "Invalid file type. Please upload a JPEG, PNG, JPG, GIF or WEBP image.";
        this.main_image_path = '';
        this.main_image_name = '';
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.mainImageError = "File size exceeds the maximum allowed limit (2MB).";
        this.main_image_path = '';
        this.main_image_name = '';
        return;
      }
      this.imageFile = file;
      this.main_image_path = URL.createObjectURL(file);
      this.main_image_name = file.name;
    },
    // ---------- Other images ----------
    dropFileOtherImage: function dropFileOtherImage(event) {
      event.preventDefault();
      var fileInput = Array.isArray(this.$refs.file_other_images) ? this.$refs.file_other_images[0] : this.$refs.file_other_images;
      if (fileInput) {
        fileInput.files = event.dataTransfer.files;
        this.otherImage();
      }
    },
    otherImage: function otherImage() {
      this.images = [];
      var fileInput = Array.isArray(this.$refs.file_other_images) ? this.$refs.file_other_images[0] : this.$refs.file_other_images;
      if (!fileInput) return;
      this.otherImageError = null;
      var files = fileInput.files;
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.type.startsWith('image/')) {
          this.otherImageError = "Invalid file type. Please upload an image.";
          continue;
        }
        this.images.push({
          url: URL.createObjectURL(file),
          name: file.name,
          file: file
        });
      }
    },
    removeSelectedOtherImage: function removeSelectedOtherImage(index) {
      this.images.splice(index, 1);
    },
    removeUploadedOtherImage: function removeUploadedOtherImage(index) {
      var path = this.other_images[index];
      if (path) this.deletedOtherImages.push(path);
      this.other_images.splice(index, 1);
    },
    // ---------- Variants ----------
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
    // ---------- Parent company picker ----------
    onPcInput: function onPcInput() {
      var _this8 = this;
      clearTimeout(this.pcDebounce);
      this.product.parent_company_id = null;
      this.pcDropdownOpen = true;
      this.pcDebounce = setTimeout(function () {
        return _this8.searchPc();
      }, 250);
    },
    searchPc: function searchPc() {
      var _this9 = this;
      axios.get(this.$apiUrl + '/master_catalog/parent_companies/search', {
        params: {
          q: this.pcQuery
        }
      }).then(function (r) {
        _this9.pcResults = r.data.data || [];
      });
    },
    selectParentCompany: function selectParentCompany(pc) {
      this.pcQuery = pc.name;
      this.product.parent_company_id = pc.id;
      this.pcDropdownOpen = false;
    },
    createParentCompany: function createParentCompany() {
      var _this10 = this;
      axios.post(this.$apiUrl + '/master_catalog/parent_companies/find_or_create', {
        name: this.pcQuery
      }).then(function (r) {
        var pc = r.data.data;
        if (pc) _this10.selectParentCompany(pc);
      });
    },
    onPcBlur: function onPcBlur() {
      var _this11 = this;
      setTimeout(function () {
        _this11.pcDropdownOpen = false;
      }, 150);
    },
    // ---------- Save ----------
    validateBeforeSave: function validateBeforeSave() {
      var _this12 = this;
      var form = this.$refs['my-form'];
      if (form && !form.reportValidity()) {
        this.$nextTick(function () {
          return _this12.switchToDefaultLanguageTab();
        });
        return false;
      }
      if (!this.defaultLanguageId) {
        this.showError(__('default_language_not_found'));
        return false;
      }
      var dt = this.translations[this.defaultLanguageId];
      if (!dt.name || !dt.name.trim()) {
        this.showError(__('please_fill_product_name_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      if (!dt.description || !dt.description.trim()) {
        this.showError(__('please_fill_description_in_default_language'));
        this.switchToDefaultLanguageTab();
        return false;
      }
      if (!this.visibleVariants.length) {
        this.showError(__('at_least_one_variant_required'));
        return false;
      }
      return true;
    },
    buildTranslationsPayload: function buildTranslationsPayload() {
      var _this13 = this;
      return this.languages.map(function (language) {
        var t = _this13.translations[language.id] || {};
        return {
          language_id: language.id,
          name: t.name || '',
          description: t.description || '',
          meta_title: t.meta_title || '',
          meta_keywords: t.meta_keywords || '',
          schema_markup: t.schema_markup || '',
          meta_description: t.meta_description || ''
        };
      });
    },
    save: function save() {
      var _this14 = this;
      if (!this.validateBeforeSave()) return;
      this.isSaving = true;
      var fd = new FormData();
      if (this.product.parent_company_id) fd.append('parent_company_id', this.product.parent_company_id);
      if (this.product.brand_id) fd.append('brand_id', this.product.brand_id);
      if (this.product.category_id) fd.append('category_id', this.product.category_id);
      if (this.product.tax_id) fd.append('tax_id', this.product.tax_id);
      if (this.product.hsn) fd.append('hsn', this.product.hsn);
      fd.append('type', this.product.type);
      fd.append('status', this.product.status);

      // Multi-language payload (legacy shape: JSON-encoded array)
      fd.append('translations', JSON.stringify(this.buildTranslationsPayload()));

      // Main image
      if (this.imageFile) fd.append('image', this.imageFile);

      // Other images: send fresh ones, plus paths to delete
      this.images.forEach(function (img) {
        fd.append('other_images[]', img.file);
      });
      this.deletedOtherImages.forEach(function (path) {
        fd.append('delete_other_images[]', path);
      });

      // Variants
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
        _this14.isSaving = false;
        if (res.data.status) {
          _this14.showMessage('success', res.data.message || __(_this14.isEdit ? 'master_product_updated_successfully' : 'master_product_saved_successfully'));
          _this14.$router.push('/master_catalog/products');
        } else {
          _this14.showError(res.data.message);
        }
      })["catch"](function (err) {
        _this14.isSaving = false;
        var msg = err.response && err.response.data && err.response.data.message || __('something_went_wrong');
        _this14.showError(msg);
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
        ref: "my-form",
        attrs: { id: "masterProductForm" },
        on: {
          submit: function ($event) {
            $event.preventDefault()
            return _vm.save.apply(null, arguments)
          },
          keydown: function ($event) {
            if (
              !$event.type.indexOf("key") &&
              _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
            ) {
              return null
            }
            return $event.preventDefault()
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
                            attrs: { lazy: "" },
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
                                            "\n                                    " +
                                              _vm._s(language.name) +
                                              "\n                                "
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
                            _vm.translations[language.id]
                              ? _c("div", [
                                  _c(
                                    "div",
                                    { staticClass: "row" },
                                    [
                                      _c(
                                        "div",
                                        { staticClass: "col-md-6 mb-3" },
                                        [
                                          _c("label", [
                                            _vm._v(
                                              _vm._s(_vm.__("name")) +
                                                "\n                                            "
                                            ),
                                            language.is_default
                                              ? _c(
                                                  "i",
                                                  {
                                                    staticClass: "text-danger",
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
                                                  _vm.translations[language.id]
                                                    .name,
                                                expression:
                                                  "translations[language.id].name",
                                              },
                                            ],
                                            staticClass: "form-control",
                                            attrs: {
                                              type: "text",
                                              placeholder:
                                                _vm.__("enter_product_name"),
                                              required: language.is_default
                                                ? true
                                                : undefined,
                                            },
                                            domProps: {
                                              value:
                                                _vm.translations[language.id]
                                                  .name,
                                            },
                                            on: {
                                              input: [
                                                function ($event) {
                                                  if ($event.target.composing) {
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
                                                function ($event) {
                                                  return _vm.onNameInput(
                                                    language
                                                  )
                                                },
                                              ],
                                            },
                                          }),
                                        ]
                                      ),
                                      _vm._v(" "),
                                      language.is_default
                                        ? [
                                            _c(
                                              "div",
                                              {
                                                staticClass:
                                                  "col-md-6 mb-3 mt-2",
                                              },
                                              [
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(_vm.__("slug"))
                                                  ),
                                                ]),
                                                _vm._v(" "),
                                                _c("input", {
                                                  directives: [
                                                    {
                                                      name: "model",
                                                      rawName: "v-model",
                                                      value: _vm.product.slug,
                                                      expression:
                                                        "product.slug",
                                                    },
                                                  ],
                                                  staticClass: "form-control",
                                                  attrs: {
                                                    type: "text",
                                                    readonly: "",
                                                  },
                                                  domProps: {
                                                    value: _vm.product.slug,
                                                  },
                                                  on: {
                                                    input: function ($event) {
                                                      if (
                                                        $event.target.composing
                                                      ) {
                                                        return
                                                      }
                                                      _vm.$set(
                                                        _vm.product,
                                                        "slug",
                                                        $event.target.value
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
                                                  "col-md-6 mb-3 position-relative",
                                              },
                                              [
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(
                                                      _vm.__("parent_company")
                                                    )
                                                  ),
                                                ]),
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
                                                    placeholder:
                                                      _vm.__(
                                                        "search_or_create"
                                                      ),
                                                    autocomplete: "off",
                                                  },
                                                  domProps: {
                                                    value: _vm.pcQuery,
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
                                                        _vm.pcQuery =
                                                          $event.target.value
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
                                                        _vm._l(
                                                          _vm.pcResults,
                                                          function (pc) {
                                                            return _c(
                                                              "li",
                                                              {
                                                                key: pc.id,
                                                                staticClass:
                                                                  "list-group-item list-group-item-action py-2",
                                                                on: {
                                                                  mousedown:
                                                                    function (
                                                                      $event
                                                                    ) {
                                                                      $event.preventDefault()
                                                                      return _vm.selectParentCompany(
                                                                        pc
                                                                      )
                                                                    },
                                                                },
                                                              },
                                                              [
                                                                _vm._v(
                                                                  "\n                                                    " +
                                                                    _vm._s(
                                                                      pc.name
                                                                    ) +
                                                                    "\n                                                "
                                                                ),
                                                              ]
                                                            )
                                                          }
                                                        ),
                                                        _vm._v(" "),
                                                        _vm.pcQuery &&
                                                        !_vm.pcExactMatch
                                                          ? _c(
                                                              "li",
                                                              {
                                                                staticClass:
                                                                  "list-group-item list-group-item-action py-2 text-primary",
                                                                on: {
                                                                  mousedown:
                                                                    function (
                                                                      $event
                                                                    ) {
                                                                      $event.preventDefault()
                                                                      return _vm.createParentCompany.apply(
                                                                        null,
                                                                        arguments
                                                                      )
                                                                    },
                                                                },
                                                              },
                                                              [
                                                                _c("i", {
                                                                  staticClass:
                                                                    "fa fa-plus",
                                                                }),
                                                                _vm._v(
                                                                  " " +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "create"
                                                                      )
                                                                    ) +
                                                                    '\n                                                    "' +
                                                                    _vm._s(
                                                                      _vm.pcQuery
                                                                    ) +
                                                                    '" ' +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "as_new_parent_company"
                                                                      )
                                                                    ) +
                                                                    "\n                                                "
                                                                ),
                                                              ]
                                                            )
                                                          : _vm._e(),
                                                        _vm._v(" "),
                                                        !_vm.pcResults.length &&
                                                        !_vm.pcQuery
                                                          ? _c(
                                                              "li",
                                                              {
                                                                staticClass:
                                                                  "list-group-item text-muted py-2",
                                                              },
                                                              [
                                                                _vm._v(
                                                                  "\n                                                    " +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "start_typing_to_search"
                                                                      )
                                                                    ) +
                                                                    "\n                                                "
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
                                            _c(
                                              "div",
                                              { staticClass: "col-md-6 mb-3" },
                                              [
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(_vm.__("brand"))
                                                  ),
                                                ]),
                                                _vm._v(" "),
                                                _c(
                                                  "select",
                                                  {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model",
                                                        value:
                                                          _vm.product.brand_id,
                                                        expression:
                                                          "product.brand_id",
                                                      },
                                                    ],
                                                    staticClass:
                                                      "form-control form-select",
                                                    on: {
                                                      change: function (
                                                        $event
                                                      ) {
                                                        var $$selectedVal =
                                                          Array.prototype.filter
                                                            .call(
                                                              $event.target
                                                                .options,
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
                                                    _c(
                                                      "option",
                                                      {
                                                        domProps: {
                                                          value: null,
                                                        },
                                                      },
                                                      [
                                                        _vm._v(
                                                          "-- " +
                                                            _vm._s(
                                                              _vm.__("select")
                                                            ) +
                                                            " --"
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _vm._l(
                                                      _vm.brands,
                                                      function (b) {
                                                        return _c(
                                                          "option",
                                                          {
                                                            key: b.id,
                                                            domProps: {
                                                              value: b.id,
                                                            },
                                                          },
                                                          [
                                                            _vm._v(
                                                              "\n                                                    " +
                                                                _vm._s(b.name) +
                                                                "\n                                                "
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
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              { staticClass: "col-md-6 mb-3" },
                                              [
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(_vm.__("category"))
                                                  ),
                                                ]),
                                                _vm._v(" "),
                                                _c(
                                                  "select",
                                                  {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model",
                                                        value:
                                                          _vm.product
                                                            .category_id,
                                                        expression:
                                                          "product.category_id",
                                                      },
                                                    ],
                                                    staticClass:
                                                      "form-control form-select",
                                                    on: {
                                                      change: function (
                                                        $event
                                                      ) {
                                                        var $$selectedVal =
                                                          Array.prototype.filter
                                                            .call(
                                                              $event.target
                                                                .options,
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
                                                    _c(
                                                      "option",
                                                      {
                                                        domProps: {
                                                          value: null,
                                                        },
                                                      },
                                                      [
                                                        _vm._v(
                                                          "-- " +
                                                            _vm._s(
                                                              _vm.__("select")
                                                            ) +
                                                            " --"
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _vm._l(
                                                      _vm.categories,
                                                      function (c) {
                                                        return _c(
                                                          "option",
                                                          {
                                                            key: c.id,
                                                            domProps: {
                                                              value: c.id,
                                                            },
                                                          },
                                                          [
                                                            _vm._v(
                                                              "\n                                                    " +
                                                                _vm._s(c.name) +
                                                                "\n                                                "
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
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              { staticClass: "col-md-6 mb-3" },
                                              [
                                                _c("label", [
                                                  _vm._v(_vm._s(_vm.__("tax"))),
                                                ]),
                                                _vm._v(" "),
                                                _c(
                                                  "select",
                                                  {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model",
                                                        value:
                                                          _vm.product.tax_id,
                                                        expression:
                                                          "product.tax_id",
                                                      },
                                                    ],
                                                    staticClass:
                                                      "form-control form-select",
                                                    on: {
                                                      change: function (
                                                        $event
                                                      ) {
                                                        var $$selectedVal =
                                                          Array.prototype.filter
                                                            .call(
                                                              $event.target
                                                                .options,
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
                                                    _c(
                                                      "option",
                                                      {
                                                        domProps: {
                                                          value: null,
                                                        },
                                                      },
                                                      [
                                                        _vm._v(
                                                          "-- " +
                                                            _vm._s(
                                                              _vm.__("select")
                                                            ) +
                                                            " --"
                                                        ),
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _vm._l(
                                                      _vm.taxes,
                                                      function (t) {
                                                        return _c(
                                                          "option",
                                                          {
                                                            key: t.id,
                                                            domProps: {
                                                              value: t.id,
                                                            },
                                                          },
                                                          [
                                                            _vm._v(
                                                              "\n                                                    " +
                                                                _vm._s(
                                                                  t.title
                                                                ) +
                                                                " (" +
                                                                _vm._s(
                                                                  t.percentage
                                                                ) +
                                                                "%)\n                                                "
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
                                            _vm._v(" "),
                                            _c(
                                              "div",
                                              { staticClass: "col-md-6 mb-3" },
                                              [
                                                _c("label", [
                                                  _vm._v(
                                                    _vm._s(_vm.__("hsn_code"))
                                                  ),
                                                ]),
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
                                                  domProps: {
                                                    value: _vm.product.hsn,
                                                  },
                                                  on: {
                                                    input: function ($event) {
                                                      if (
                                                        $event.target.composing
                                                      ) {
                                                        return
                                                      }
                                                      _vm.$set(
                                                        _vm.product,
                                                        "hsn",
                                                        $event.target.value
                                                      )
                                                    },
                                                  },
                                                }),
                                              ]
                                            ),
                                          ]
                                        : _vm._e(),
                                      _vm._v(" "),
                                      _c(
                                        "div",
                                        { staticClass: "col-md-12 mb-3" },
                                        [
                                          _c("label", [
                                            _vm._v(
                                              _vm._s(_vm.__("description")) +
                                                "\n                                            "
                                            ),
                                            language.is_default
                                              ? _c(
                                                  "i",
                                                  {
                                                    staticClass: "text-danger",
                                                  },
                                                  [_vm._v("*")]
                                                )
                                              : _vm._e(),
                                          ]),
                                          _vm._v(" "),
                                          _c("editor", {
                                            attrs: {
                                              placeholder: _vm.__(
                                                "enter_product_description"
                                              ),
                                              init: _vm.getEditorConfig(),
                                            },
                                            model: {
                                              value:
                                                _vm.translations[language.id]
                                                  .description,
                                              callback: function ($$v) {
                                                _vm.$set(
                                                  _vm.translations[language.id],
                                                  "description",
                                                  $$v
                                                )
                                              },
                                              expression:
                                                "translations[language.id].description",
                                            },
                                          }),
                                        ],
                                        1
                                      ),
                                      _vm._v(" "),
                                      language.is_default
                                        ? [
                                            _c(
                                              "div",
                                              { staticClass: "col-md-6" },
                                              [
                                                _c(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "form-group mb-3",
                                                  },
                                                  [
                                                    _c("label", [
                                                      _vm._v(
                                                        _vm._s(_vm.__("image"))
                                                      ),
                                                    ]),
                                                    _vm._v(" "),
                                                    _c("input", {
                                                      ref: "file_image",
                                                      refInFor: true,
                                                      staticClass: "file-input",
                                                      attrs: {
                                                        type: "file",
                                                        name: "image",
                                                        accept: "image/*",
                                                      },
                                                      on: {
                                                        change: _vm.fileImage,
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "file-input-div bg-gray-100",
                                                        on: {
                                                          click: function (
                                                            $event
                                                          ) {
                                                            return _vm.triggerRefClick(
                                                              "file_image"
                                                            )
                                                          },
                                                          drop: _vm.dropFile,
                                                          dragover:
                                                            _vm.$dragoverFile,
                                                          dragleave:
                                                            _vm.$dragleaveFile,
                                                        },
                                                      },
                                                      [
                                                        _vm.main_image_name ===
                                                        ""
                                                          ? [
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
                                                            ]
                                                          : [
                                                              _c("label", [
                                                                _vm._v(
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "selected_file_name"
                                                                    )
                                                                  ) +
                                                                    " " +
                                                                    _vm._s(
                                                                      _vm.main_image_name
                                                                    )
                                                                ),
                                                              ]),
                                                            ],
                                                      ],
                                                      2
                                                    ),
                                                    _vm._v(" "),
                                                    _vm.mainImageError
                                                      ? _c(
                                                          "p",
                                                          {
                                                            staticClass:
                                                              "error",
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.mainImageError
                                                              )
                                                            ),
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                    _vm._v(" "),
                                                    _vm.main_image_path
                                                      ? _c(
                                                          "div",
                                                          {
                                                            staticClass: "row",
                                                          },
                                                          [
                                                            _c(
                                                              "div",
                                                              {
                                                                staticClass:
                                                                  "col-md-4",
                                                              },
                                                              [
                                                                _c("img", {
                                                                  staticClass:
                                                                    "custom-image",
                                                                  attrs: {
                                                                    src: _vm.main_image_path,
                                                                    title:
                                                                      "Main Image",
                                                                    alt: "Main Image",
                                                                  },
                                                                }),
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
                                              { staticClass: "col-md-6" },
                                              [
                                                _c(
                                                  "div",
                                                  {
                                                    staticClass:
                                                      "form-group mb-3",
                                                  },
                                                  [
                                                    _c("label", [
                                                      _vm._v(
                                                        _vm._s(
                                                          _vm.__(
                                                            "other_images_of_the_product"
                                                          )
                                                        )
                                                      ),
                                                    ]),
                                                    _vm._v(" "),
                                                    _c("input", {
                                                      ref: "file_other_images",
                                                      refInFor: true,
                                                      staticClass: "file-input",
                                                      attrs: {
                                                        type: "file",
                                                        name: "other_images[]",
                                                        accept: "image/*",
                                                        multiple: "",
                                                      },
                                                      on: {
                                                        change: _vm.otherImage,
                                                      },
                                                    }),
                                                    _vm._v(" "),
                                                    _c(
                                                      "div",
                                                      {
                                                        staticClass:
                                                          "file-input-div bg-gray-100",
                                                        on: {
                                                          click: function (
                                                            $event
                                                          ) {
                                                            return _vm.triggerRefClick(
                                                              "file_other_images"
                                                            )
                                                          },
                                                          drop: _vm.dropFileOtherImage,
                                                          dragover:
                                                            _vm.$dragoverFile,
                                                          dragleave:
                                                            _vm.$dragleaveFile,
                                                        },
                                                      },
                                                      [
                                                        _vm.images.length === 0
                                                          ? [
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
                                                            ]
                                                          : [
                                                              _c("label", [
                                                                _vm._v(
                                                                  _vm._s(
                                                                    _vm.images
                                                                      .length
                                                                  ) +
                                                                    " " +
                                                                    _vm._s(
                                                                      _vm.__(
                                                                        "files_selected"
                                                                      )
                                                                    )
                                                                ),
                                                              ]),
                                                            ],
                                                      ],
                                                      2
                                                    ),
                                                    _vm._v(" "),
                                                    _vm.otherImageError
                                                      ? _c(
                                                          "p",
                                                          {
                                                            staticClass:
                                                              "error",
                                                          },
                                                          [
                                                            _vm._v(
                                                              _vm._s(
                                                                _vm.otherImageError
                                                              )
                                                            ),
                                                          ]
                                                        )
                                                      : _vm._e(),
                                                    _vm._v(" "),
                                                    _vm.images.length
                                                      ? _c(
                                                          "div",
                                                          {
                                                            staticClass: "row",
                                                          },
                                                          [
                                                            _c(
                                                              "h6",
                                                              {
                                                                staticClass:
                                                                  "mt-3",
                                                              },
                                                              [
                                                                _vm._v(
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "selected_other_images"
                                                                    )
                                                                  )
                                                                ),
                                                              ]
                                                            ),
                                                            _vm._v(" "),
                                                            _vm._l(
                                                              _vm.images,
                                                              function (
                                                                image,
                                                                index
                                                              ) {
                                                                return _c(
                                                                  "div",
                                                                  {
                                                                    key:
                                                                      "sel-" +
                                                                      index,
                                                                    staticClass:
                                                                      "col-md-4 image-container",
                                                                  },
                                                                  [
                                                                    _c("img", {
                                                                      staticClass:
                                                                        "img-thumbnail custom-image",
                                                                      attrs: {
                                                                        src: image.url,
                                                                        title:
                                                                          image.name,
                                                                        alt: image.name,
                                                                      },
                                                                    }),
                                                                    _vm._v(" "),
                                                                    _c(
                                                                      "button",
                                                                      {
                                                                        staticClass:
                                                                          "btn btn-sm btn-danger btn-remove",
                                                                        attrs: {
                                                                          type: "button",
                                                                        },
                                                                        on: {
                                                                          click:
                                                                            function (
                                                                              $event
                                                                            ) {
                                                                              return _vm.removeSelectedOtherImage(
                                                                                index
                                                                              )
                                                                            },
                                                                        },
                                                                      },
                                                                      [
                                                                        _c(
                                                                          "i",
                                                                          {
                                                                            staticClass:
                                                                              "fa fa-times-circle",
                                                                          }
                                                                        ),
                                                                      ]
                                                                    ),
                                                                  ]
                                                                )
                                                              }
                                                            ),
                                                          ],
                                                          2
                                                        )
                                                      : _vm._e(),
                                                    _vm._v(" "),
                                                    _vm.other_images.length
                                                      ? _c(
                                                          "div",
                                                          {
                                                            staticClass: "row",
                                                          },
                                                          [
                                                            _c(
                                                              "h6",
                                                              {
                                                                staticClass:
                                                                  "mt-3",
                                                              },
                                                              [
                                                                _vm._v(
                                                                  _vm._s(
                                                                    _vm.__(
                                                                      "uploaded_other_images"
                                                                    )
                                                                  )
                                                                ),
                                                              ]
                                                            ),
                                                            _vm._v(" "),
                                                            _vm._l(
                                                              _vm.other_images,
                                                              function (
                                                                path,
                                                                index
                                                              ) {
                                                                return _c(
                                                                  "div",
                                                                  {
                                                                    key:
                                                                      "up-" +
                                                                      index,
                                                                    staticClass:
                                                                      "col-md-4 image-container",
                                                                  },
                                                                  [
                                                                    _c("img", {
                                                                      staticClass:
                                                                        "img-thumbnail custom-image",
                                                                      attrs: {
                                                                        src:
                                                                          _vm.$storageUrl +
                                                                          path,
                                                                        title:
                                                                          "Other Image",
                                                                        alt: "Other Image",
                                                                      },
                                                                    }),
                                                                    _vm._v(" "),
                                                                    _c(
                                                                      "button",
                                                                      {
                                                                        staticClass:
                                                                          "btn btn-sm btn-danger btn-remove",
                                                                        attrs: {
                                                                          type: "button",
                                                                        },
                                                                        on: {
                                                                          click:
                                                                            function (
                                                                              $event
                                                                            ) {
                                                                              return _vm.removeUploadedOtherImage(
                                                                                index
                                                                              )
                                                                            },
                                                                        },
                                                                      },
                                                                      [
                                                                        _c(
                                                                          "i",
                                                                          {
                                                                            staticClass:
                                                                              "fa fa-times-circle",
                                                                          }
                                                                        ),
                                                                      ]
                                                                    ),
                                                                  ]
                                                                )
                                                              }
                                                            ),
                                                          ],
                                                          2
                                                        )
                                                      : _vm._e(),
                                                  ]
                                                ),
                                              ]
                                            ),
                                          ]
                                        : _vm._e(),
                                    ],
                                    2
                                  ),
                                ])
                              : _vm._e(),
                          ]
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
            _c("div", { staticClass: "col-md-6 mb-3" }, [
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
                    _vm._l(_vm.visibleVariants, function (v) {
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
        _c("div", { staticClass: "card mt-3" }, [
          _c("div", { staticClass: "card-header" }, [
            _c("h4", [_vm._v(_vm._s(_vm.__("seo_settings")))]),
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
                          value: _vm.activeSeoLanguageTab,
                          callback: function ($$v) {
                            _vm.activeSeoLanguageTab = $$v
                          },
                          expression: "activeSeoLanguageTab",
                        },
                      },
                      _vm._l(_vm.languages, function (language) {
                        return _c(
                          "b-tab",
                          {
                            key: "seo-" + language.id,
                            attrs: { lazy: "" },
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
                                            "\n                                    " +
                                              _vm._s(language.name) +
                                              "\n                                "
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
                            _vm.translations[language.id]
                              ? _c("div", { staticClass: "row" }, [
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c(
                                      "div",
                                      { staticClass: "form-group mb-3" },
                                      [
                                        _c("label", [
                                          _vm._v(_vm._s(_vm.__("meta_title"))),
                                        ]),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value:
                                                _vm.translations[language.id]
                                                  .meta_title,
                                              expression:
                                                "translations[language.id].meta_title",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "text",
                                            placeholder:
                                              _vm.__("enter_meta_title"),
                                          },
                                          domProps: {
                                            value:
                                              _vm.translations[language.id]
                                                .meta_title,
                                          },
                                          on: {
                                            input: function ($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.$set(
                                                _vm.translations[language.id],
                                                "meta_title",
                                                $event.target.value
                                              )
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group mb-3" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(_vm.__("meta_keywords"))
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value:
                                                _vm.translations[language.id]
                                                  .meta_keywords,
                                              expression:
                                                "translations[language.id].meta_keywords",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "text",
                                            placeholder: _vm.__(
                                              "enter_meta_keywords"
                                            ),
                                          },
                                          domProps: {
                                            value:
                                              _vm.translations[language.id]
                                                .meta_keywords,
                                          },
                                          on: {
                                            input: function ($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.$set(
                                                _vm.translations[language.id],
                                                "meta_keywords",
                                                $event.target.value
                                              )
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "div",
                                      { staticClass: "form-group mb-3" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(_vm.__("schema_markup"))
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value:
                                                _vm.translations[language.id]
                                                  .schema_markup,
                                              expression:
                                                "translations[language.id].schema_markup",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            type: "text",
                                            placeholder: _vm.__(
                                              "enter_schema_markup"
                                            ),
                                          },
                                          domProps: {
                                            value:
                                              _vm.translations[language.id]
                                                .schema_markup,
                                          },
                                          on: {
                                            input: function ($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.$set(
                                                _vm.translations[language.id],
                                                "schema_markup",
                                                $event.target.value
                                              )
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                  ]),
                                  _vm._v(" "),
                                  _c("div", { staticClass: "col-md-6" }, [
                                    _c(
                                      "div",
                                      { staticClass: "form-group mb-3" },
                                      [
                                        _c("label", [
                                          _vm._v(
                                            _vm._s(_vm.__("meta_description"))
                                          ),
                                        ]),
                                        _vm._v(" "),
                                        _c("textarea", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value:
                                                _vm.translations[language.id]
                                                  .meta_description,
                                              expression:
                                                "translations[language.id].meta_description",
                                            },
                                          ],
                                          staticClass: "form-control",
                                          attrs: {
                                            rows: "4",
                                            placeholder: _vm.__(
                                              "enter_meta_description"
                                            ),
                                          },
                                          domProps: {
                                            value:
                                              _vm.translations[language.id]
                                                .meta_description,
                                          },
                                          on: {
                                            input: function ($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.$set(
                                                _vm.translations[language.id],
                                                "meta_description",
                                                $event.target.value
                                              )
                                            },
                                          },
                                        }),
                                      ]
                                    ),
                                  ]),
                                ])
                              : _vm._e(),
                          ]
                        )
                      }),
                      1
                    ),
                  ],
                  1
                )
              : _vm._e(),
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