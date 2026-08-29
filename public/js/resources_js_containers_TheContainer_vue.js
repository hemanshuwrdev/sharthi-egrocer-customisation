"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_containers_TheContainer_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TheSidebar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TheSidebar */ "./resources/js/containers/TheSidebar.vue");
/* harmony import */ var _TheFooter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TheFooter */ "./resources/js/containers/TheFooter.vue");
/* harmony import */ var _VerticalHeader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VerticalHeader */ "./resources/js/containers/VerticalHeader.vue");
/* harmony import */ var _Auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Auth */ "./resources/js/Auth.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils_lucideIcons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/lucideIcons */ "./resources/js/utils/lucideIcons.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: 'TheContainer',
  components: {
    TheSidebar: _TheSidebar__WEBPACK_IMPORTED_MODULE_0__["default"],
    TheFooter: _TheFooter__WEBPACK_IMPORTED_MODULE_1__["default"],
    VerticalHeader: _VerticalHeader__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  created: function created() {
    this.closeSideBarMenu();
    this.checkPermissions();
  },
  watch: {
    '$route': 'checkPermissions'
  },
  mounted: function mounted() {
    var _document$querySelect;
    if (window.localStorage.getItem('lang')) {
      this.lang = window.localStorage.getItem('lang');
      console.log(this.lang);
    }
    function slideToggle(t, e, o) {
      0 === t.clientHeight ? j(t, e, o, !0) : j(t, e, o);
    }
    function slideUp(t, e, o) {
      j(t, e, o);
    }
    function slideDown(t, e, o) {
      j(t, e, o, !0);
    }
    function j(t, e, o, i) {
      void 0 === e && (e = 400), void 0 === i && (i = !1), t.style.overflow = "hidden", i && (t.style.display = "block");
      var p,
        l = window.getComputedStyle(t),
        n = parseFloat(l.getPropertyValue("height")),
        a = parseFloat(l.getPropertyValue("padding-top")),
        s = parseFloat(l.getPropertyValue("padding-bottom")),
        r = parseFloat(l.getPropertyValue("margin-top")),
        d = parseFloat(l.getPropertyValue("margin-bottom")),
        g = n / e,
        y = a / e,
        m = s / e,
        u = r / e,
        h = d / e;
      window.requestAnimationFrame(function l(x) {
        void 0 === p && (p = x);
        var f = x - p;
        i ? (t.style.height = g * f + "px", t.style.paddingTop = y * f + "px", t.style.paddingBottom = m * f + "px", t.style.marginTop = u * f + "px", t.style.marginBottom = h * f + "px") : (t.style.height = n - g * f + "px", t.style.paddingTop = a - y * f + "px", t.style.paddingBottom = s - m * f + "px", t.style.marginTop = r - u * f + "px", t.style.marginBottom = d - h * f + "px"), f >= e ? (t.style.height = "", t.style.paddingTop = "", t.style.paddingBottom = "", t.style.marginTop = "", t.style.marginBottom = "", t.style.overflow = "", i || (t.style.display = "none"), "function" == typeof o && o()) : window.requestAnimationFrame(l);
      });
    }
    var sidebarItems = document.querySelectorAll('.sidebar-item.has-sub');
    // Mark initially open submenus with 'open' class for toggle icon
    sidebarItems.forEach(function (item) {
      var submenu = item.querySelector('.submenu');
      if (submenu && submenu.classList.contains('active')) {
        item.classList.add('open');
      }
    });
    var sidebarEl = document.getElementById('sidebar');
    var sidebarMenu = document.querySelector('.sidebar-menu');
    if (sidebarMenu && sidebarEl) {
      sidebarMenu.addEventListener('click', function (e) {
        if (window.innerWidth >= 1200 && !sidebarEl.classList.contains('active')) {
          sidebarEl.classList.add('active');
        }
      });
    }
    var _loop = function _loop() {
      var _sidebarItems$i$query;
      var sidebarItem = sidebarItems[i];
      (_sidebarItems$i$query = sidebarItems[i].querySelector('.sidebar-link')) === null || _sidebarItems$i$query === void 0 ? void 0 : _sidebarItems$i$query.addEventListener('click', function (e) {
        var _submenu$classList;
        e.preventDefault();
        if (window.innerWidth >= 1200 && sidebarEl && !sidebarEl.classList.contains('active')) {
          sidebarEl.classList.add('active');
        }
        var submenu = sidebarItem.querySelector('.submenu');
        var isCurrentlyOpen = submenu === null || submenu === void 0 ? void 0 : (_submenu$classList = submenu.classList) === null || _submenu$classList === void 0 ? void 0 : _submenu$classList.contains('active');

        // Accordion: close all other open submenus
        sidebarItems.forEach(function (otherItem) {
          if (otherItem !== sidebarItem) {
            var otherSubmenu = otherItem.querySelector('.submenu');
            if (otherSubmenu && otherSubmenu.classList.contains('active')) {
              otherSubmenu.classList.remove('active');
              // Use the same animation instead of setting display: none instantly
              slideUp(otherSubmenu, 300);
              otherItem.classList.remove('open');
            }
          }
        });

        // Toggle current submenu
        if (isCurrentlyOpen) {
          var _submenu$classList2;
          submenu === null || submenu === void 0 ? void 0 : (_submenu$classList2 = submenu.classList) === null || _submenu$classList2 === void 0 ? void 0 : _submenu$classList2.remove('active');
          sidebarItem.classList.remove('open');
          slideUp(submenu, 300);
        } else {
          var _submenu$classList3;
          submenu === null || submenu === void 0 ? void 0 : (_submenu$classList3 = submenu.classList) === null || _submenu$classList3 === void 0 ? void 0 : _submenu$classList3.add('active');
          sidebarItem.classList.add('open');
          slideDown(submenu, 300);
        }
      });
    };
    for (var i = 0; i < sidebarItems.length; i++) {
      _loop();
    }
    window.addEventListener('DOMContentLoaded', function (event) {
      var w = window.innerWidth;
      if (w < 1200) {
        var _document$getElementB, _document$getElementB2;
        (_document$getElementB = document.getElementById('sidebar')) === null || _document$getElementB === void 0 ? void 0 : (_document$getElementB2 = _document$getElementB.classList) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.remove('active');
      }
    });
    // Update backdrop when sidebar opens/closes on small screens
    var updateSidebarBackdrop = function updateSidebarBackdrop() {
      var _sidebar$classList;
      var sidebar = document.getElementById('sidebar');
      var backdrop = document.querySelector('.sidebar-backdrop');
      var isSmallScreen = window.innerWidth < 1200;
      var isActive = sidebar === null || sidebar === void 0 ? void 0 : (_sidebar$classList = sidebar.classList) === null || _sidebar$classList === void 0 ? void 0 : _sidebar$classList.contains('active');
      if (backdrop) backdrop.remove();
      if (isSmallScreen && isActive) {
        var b = document.createElement('div');
        b.className = 'sidebar-backdrop';
        b.addEventListener('click', function () {
          var _sidebar$classList2;
          sidebar === null || sidebar === void 0 ? void 0 : (_sidebar$classList2 = sidebar.classList) === null || _sidebar$classList2 === void 0 ? void 0 : _sidebar$classList2.remove('active');
          updateSidebarBackdrop();
        });
        document.body.appendChild(b);
      }
    };
    window.addEventListener('resize', function (event) {
      var w = window.innerWidth;
      if (w < 1200) {
        var _document$getElementB3, _document$getElementB4;
        (_document$getElementB3 = document.getElementById('sidebar')) === null || _document$getElementB3 === void 0 ? void 0 : (_document$getElementB4 = _document$getElementB3.classList) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.remove('active');
        updateSidebarBackdrop();
      } else {
        var _document$getElementB5, _document$getElementB6;
        (_document$getElementB5 = document.getElementById('sidebar')) === null || _document$getElementB5 === void 0 ? void 0 : (_document$getElementB6 = _document$getElementB5.classList) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.add('active');
        updateSidebarBackdrop();
      }
    });
    (_document$querySelect = document.querySelector('.sidebar-hide')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.addEventListener('click', function () {
      var _document$getElementB7, _document$getElementB8;
      (_document$getElementB7 = document.getElementById('sidebar')) === null || _document$getElementB7 === void 0 ? void 0 : (_document$getElementB8 = _document$getElementB7.classList) === null || _document$getElementB8 === void 0 ? void 0 : _document$getElementB8.toggle('active');
      updateSidebarBackdrop();
    });
    // Perfect Scrollbar Init
    if (typeof PerfectScrollbar["default"] == 'function') {
      var container = document.querySelector(".sidebar-wrapper");
      if (container) {
        var ps = new PerfectScrollbar["default"](container, {
          wheelPropagation: false
        });
      }
    }

    // Scroll into active sidebar
    if (document.querySelector('.sidebar-item.active')) {
      var _document$querySelect2;
      (_document$querySelect2 = document.querySelector('.sidebar-item.active')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.scrollIntoView(false);
    }
  },
  data: function data() {
    return {
      lang: 'en',
      search: '',
      isLoading: false,
      suspecious: null,
      sidebarItems: [{
        name: __('dashboard'),
        icon: 'tachometer-alt',
        url: '/dashboard',
        permission: 'manage_dashboard'
      },
      /*
      {
          name: __('orders'),
          icon: 'shopping-cart',
          url: '/orders',
          permission: 'order_list'
      },
      */
      /*
      {
          name: __('self_pickup_orders'),
          icon: 'box-open',
          url: '/self_pickup_orders',
          permission: 'self_pickup_order_list'
      },
      */
      {
        name: __('categories'),
        icon: 'bullseye',
        permission: null,
        submenu: [{
          name: __('add_category'),
          icon: 'grid-fill',
          url: '/manage_categories/create',
          permission: 'category_create'
        }, {
          name: __('manage_categories'),
          icon: 'grid-fill',
          url: '/manage_categories',
          permission: 'category_list'
        }, {
          name: __('categories_order'),
          icon: 'grid-fill',
          url: '/categories_order',
          permission: 'manage_categories_order'
        }]
      },
      /* Sarthi: legacy per-seller product catalog, superseded by Master Catalog +
         Distributor Product Control. Units/Taxes/Brands/Media moved into
         'master_catalog' below since MasterProductForm.vue still depends on them.
      {
          name: __('products'),
          icon: 'package',
          permission: null,
          submenu: [
              {
                  name: __('add_product'),
                  icon: 'grid-fill',
                  url: '/manage_products/create',
                  permission: 'product_create',
              },
              {
                  name: __('manage_products'),
                  icon: 'grid-fill',
                  url: '/manage_products',
                  permission: 'product_list',
              },
              {
                  name: __('approve_requests'),
                  icon: 'grid-fill',
                  url: '/approve_requests',
                  permission: 'approve_requests',
              },
              {
                  name: __('product_ratings'),
                  icon: 'grid-fill',
                  url: '/product_ratings',
                  permission: 'product_ratings',
              },
              {
                  name: __('bulk_upload'),
                  icon: 'grid-fill',
                  url: '/bulk_upload',
                  permission: 'manage_product_bulk_upload',
              },
              {
                  name: __('bulk_update'),
                  icon: 'grid-fill',
                  url: '/bulk_update',
                  permission: 'manage_product_bulk_upload',
              },
              {
                  name: __('product_order'),
                  icon: 'grid-fill',
                  url: '/product_order',
                  permission: 'manage_product_order',
              },
          ]
      },
      */
      {
        name: __('master_catalog'),
        icon: 'cubes',
        permission: null,
        submenu: [{
          name: __('add_master_product'),
          icon: 'grid-fill',
          url: '/master_catalog/products/create',
          permission: 'product_create'
        }, {
          name: __('master_products'),
          icon: 'grid-fill',
          url: '/master_catalog/products',
          permission: 'product_list'
        }, {
          name: __('brand_distributor_mappings'),
          icon: 'grid-fill',
          url: '/master_catalog/brand_mappings',
          permission: 'product_list'
        }, {
          name: __('units'),
          icon: 'grid-fill',
          url: '/units',
          permission: 'units'
        }, {
          name: __('taxes'),
          icon: 'grid-fill',
          url: '/taxes',
          permission: 'taxes'
        }, {
          name: __('brands'),
          icon: 'grid-fill',
          url: '/brands',
          permission: 'brands'
        }, {
          name: __('media'),
          icon: 'grid-fill',
          url: '/media',
          permission: 'manage_media'
        }]
      },
      /*
      {
          name: __('stock_management'),
          icon: 'cubes',
          url: '/manage_stock',
          permission: 'stock_management',
      },
      */
      {
        name: __('sellers'),
        icon: 'male',
        permission: null,
        submenu: [{
          name: __('add_seller'),
          icon: 'grid-fill',
          url: '/sellers/create',
          permission: 'seller_create'
        },
        /*
        {
            name: __('seller_requests'),
            icon: 'grid-fill',
            url: '/registered_sellers',
            permission: 'seller_requests',
        },
        */
        {
          name: __('manage_sellers'),
          icon: 'grid-fill',
          url: '/sellers',
          permission: 'seller_list'
        }, {
          name: __('seller_wallet_transactions'),
          icon: 'grid-fill',
          url: '/seller_wallet_transactions',
          permission: 'seller_wallet_transactions'
        }, {
          name: __('policies_seller'),
          icon: 'grid-fill',
          url: '/privacy_policy_seller',
          permission: 'manage_privacy_policy_seller_app'
        }]
      }, {
        name: __('home_sliders'),
        icon: 'picture-o',
        permission: 'home_slider_image_list',
        submenu: [{
          name: __('add_home_slider'),
          icon: 'grid-fill',
          url: '/home_sliders/create',
          permission: 'home_slider_image_create'
        }, {
          name: __('manager_home_sliders'),
          icon: 'grid-fill',
          url: '/home_sliders',
          permission: 'home_slider_image_list'
        }]
      }, {
        name: __('offer_image'),
        icon: 'gift',
        permission: null,
        submenu: [{
          name: __('add_offer_images'),
          icon: 'grid-fill',
          url: '/offers/create',
          permission: 'new_offer_image_create'
        }, {
          name: __('manage_offer_images'),
          icon: 'grid-fill',
          url: '/offers',
          permission: 'new_offer_image_list'
        }, {
          name: __('manage_popup_offer'),
          icon: 'grid-fill',
          url: '/popup',
          permission: 'new_offer_image_list'
        }]
      },
      /*
      {
          name: __('promo_code'),
          icon: 'gift',
          permission: 'promo_code_list',
          submenu: [
              {
                  name: __('add_promo_code'),
                  icon: 'grid-fill',
                  url: '/promo_code/create',
                  permission: 'promo_code_create',
              },
              {
                  name: __('manage_promo_code'),
                  icon: 'grid-fill',
                  url: '/promo_code',
                  permission: 'promo_code_list',
              }
          ]
       },
      */

      {
        name: __('featured_sections'),
        icon: 'puzzle-piece',
        permission: 'featured_section_list',
        submenu: [{
          name: __('add_section'),
          icon: 'grid-fill',
          url: '/sections/create',
          permission: 'featured_section_create'
        }, {
          name: __('manage_section'),
          icon: 'grid-fill',
          url: '/sections',
          permission: 'featured_section_list'
        }]
      },
      /*
      {
          name: __('return_requests'),
          icon: 'retweet',
          url: '/return_requests',
          permission: 'return_request_list',
      },
      */
      /*
      {
          name: __('withdrawal_requests'),
          icon: 'credit-card',
          url: '/withdrawal_requests',
          permission: 'withdrawal_request_list',
      },
      */
      /*
      {
          name: __('delivery_boys'),
          icon: 'male',
          permission: null,
          submenu: [
              {
                  name: __('manage_delivery_boys'),
                  icon: 'grid-fill',
                  url: '/delivery_boys',
                  permission: 'delivery_boy_list',
              },
              {
                  name: __('fund_transfers'),
                  icon: 'grid-fill',
                  url: '/fund_transfers',
                  permission: 'fund_transfers_list',
              },
              {
                  name: __('delivery_boy_cash'),
                  icon: 'grid-fill',
                  url: '/cash_collection',
                  permission: 'cash_collection_list',
              },
              {
                  name: __('delivery_boy_policies'),
                  icon: 'grid-fill',
                  url: '/privacy_policy_delivery_boy',
                  permission: 'manage_privacy_policy_delivery_boy',
              },
              {
                  name: __('Salary'),
                  icon: 'grid-fill',
                  url: '/salary',
                  permission: 'salary_list',
              }
          ]
      },
      */

      // {
      //     name: 'Logistics',
      //     icon: 'truck',
      //     permission: null,
      //     submenu: [
      //         {
      //             name: 'Manage Vehicles',
      //             icon: 'grid-fill',
      //             url: '/vehicles',
      //             permission: 'delivery_boy_list',
      //         },
      //         {
      //             name: 'Manage Loading Slips',
      //             icon: 'grid-fill',
      //             url: '/loading_slips',
      //             permission: 'delivery_boy_list',
      //         }
      //     ]
      // },

      // Hidden from super admin sidebar — Vehicles + Loading Slips live under the
      // distributor panel; super admin should not access them. Uncomment to restore.
      // {
      //     name: 'Logistics',
      //     icon: 'truck',
      //     permission: null,
      //     submenu: [
      //         {
      //             name: 'Manage Vehicles',
      //             icon: 'grid-fill',
      //             url: '/vehicles',
      //             permission: 'delivery_boy_list',
      //         },
      //         {
      //             name: 'Create Loading Slip',
      //             icon: 'grid-fill',
      //             url: '/loading_slips/create',
      //             permission: 'delivery_boy_list',
      //         },
      //         {
      //             name: 'Manage Loading Slips',
      //             icon: 'grid-fill',
      //             url: '/loading_slips',
      //             permission: 'delivery_boy_list',
      //         }
      //     ]
      // },

      // {
      //     name: 'Logistics',
      //     icon: 'truck',
      //     permission: null,
      //     submenu: [
      //         {
      //             name: 'Manage Vehicles',
      //             icon: 'grid-fill',
      //             url: '/vehicles',
      //             permission: 'delivery_boy_list',
      //         },
      //         {
      //             name: 'Manage Loading Slips',
      //             icon: 'grid-fill',
      //             url: '/loading_slips',
      //             permission: 'delivery_boy_list',
      //         }
      //     ]
      // },

      {
        name: __('notifications'),
        icon: 'bell',
        url: '/notifications',
        permission: null,
        submenu: [{
          name: __('send_notifications'),
          icon: 'grid-fill',
          url: '/notifications/create',
          permission: 'send_notification'
        }, {
          name: __('manage_notifications'),
          icon: 'grid-fill',
          url: '/notifications',
          permission: 'notification_list'
        }]
      }, {
        name: __('email'),
        icon: 'mail',
        url: '/emails',
        permission: null,
        submenu: [{
          name: __('email_templates'),
          icon: 'grid-fill',
          url: '/email_templates',
          permission: 'email_templates'
        }, {
          name: __('manage_emails'),
          icon: 'grid-fill',
          url: '/emails',
          permission: 'manage_emails'
        }]
      }, {
        name: __('system'),
        icon: 'wrench',
        permission: null,
        submenu: [{
          name: __('store_settings'),
          icon: 'grid-fill',
          url: '/store_settings',
          permission: 'manage_store_settings'
        },
        /*
        {
            name: __('delivery_settings'),
            icon: 'grid-fill',
            url: '/delivery_settings',
            permission: 'manage_time_slots',
        },
        */
        /*
        {
            name: __('payment_methods'),
            icon: 'grid-fill',
            url: '/payment_methods',
            permission: 'manage_payment_methods',
        },
        */
        {
          name: __('additional_charge'),
          icon: 'grid-fill',
          url: '/additional_charges',
          permission: 'additional_charges_list'
        }, {
          name: __('contact_us'),
          icon: 'grid-fill',
          url: '/contact_us',
          permission: 'manage_contact_us'
        }, {
          name: __('about_us'),
          icon: 'grid-fill',
          url: '/about_us',
          permission: 'manage_about_us'
        }, {
          name: __('firebase_settings'),
          icon: 'grid-fill',
          url: '/firebase-settings',
          permission: 'manage_Notification_settings'
        }, {
          name: __('notification_templates'),
          icon: 'grid-fill',
          url: '/notification-templates',
          permission: 'manage_Notification_settings'
        }, {
          name: __('sms_settings'),
          icon: 'grid-fill',
          url: '/sms-settings',
          permission: 'manage_store_settings'
        }, {
          name: __('sms_templates'),
          icon: 'grid-fill',
          url: '/sms-templates',
          permission: 'manage_store_settings'
        }, {
          name: __('seo_settings'),
          icon: 'grid-fill',
          url: '/seo-settings',
          permission: 'manage_store_settings'
        }, {
          name: __('system_registration'),
          icon: 'grid-fill',
          url: '/purchase_code',
          permission: 'manage_system_registration'
        }, {
          name: __('system_updater'),
          icon: 'grid-fill',
          url: '/system_updater',
          permission: 'manage_store_settings'
        }]
      },
      /*
      {
          name: __('web_settings'),
          icon: 'gear',
          permission: null,
          submenu: [
              {
                  name: __('general_web_settings'),
                  icon: 'grid-fill',
                  url: '/general_settings',
                  permission: 'general_settings',
              },
              {
                  name: __('social_media'),
                  icon: 'grid-fill',
                  url: '/social_media',
                  permission: 'manage_social_media_list',
              },
           ]
      },
      */

      {
        name: __('blogs'),
        icon: 'pen',
        permission: null,
        submenu: [{
          name: __('blog_categories'),
          icon: 'grid-fill',
          url: '/blog_categories',
          permission: 'blog_category_list'
        }, {
          name: __('blogs'),
          icon: 'grid-fill',
          url: '/blogs',
          permission: 'blog_list'
        }]
      },
      /*
      {
          name: __('subscriptions'),
          icon: 'credit-card',
          permission: null,
          submenu: [
              {
                  name: __('subscription_plans'),
                  icon: 'grid-fill',
                  url: '/subscriptions',
                  permission: 'subscription_list',
              },
              {
                  name: __('subscriptions_faqs'),
                  icon: 'grid-fill',
                  url: '/subscriptions_faqs',
                  permission: 'subscription_faq_list',
              }
          ]
      },
      */

      {
        name: __('languages'),
        icon: 'language',
        permission: null,
        submenu: [{
          name: __('add_language'),
          icon: 'grid-fill',
          url: '/languages/create',
          permission: 'language_create'
        }, {
          name: __('manage_languages'),
          icon: 'grid-fill',
          url: '/languages',
          permission: 'language_list'
        }]
      }, {
        name: __('countries'),
        icon: 'globe-asia',
        permission: null,
        submenu: [{
          name: __('add_country'),
          icon: 'grid-fill',
          url: '/countries/create',
          permission: 'country_create'
        }, {
          name: __('manage_countries'),
          icon: 'grid-fill',
          url: '/countries',
          permission: 'country_list'
        }]
      }, {
        name: __('location'),
        icon: 'map',
        role: true,
        permission: null,
        submenu: [{
          name: __('add_city'),
          icon: 'grid-fill',
          url: '/cities/create',
          role: true,
          permission: 'city_create'
        }, {
          name: __('manage_cities'),
          icon: 'grid-fill',
          url: '/cities',
          role: true,
          permission: 'city_list'
        }, {
          name: __('add_area'),
          icon: 'grid-fill',
          url: '/areas/create',
          role: true,
          permission: 'area_create'
        }, {
          name: __('manage_areas'),
          icon: 'grid-fill',
          url: '/areas',
          role: true,
          permission: 'area_list'
        }]
      }, {
        name: __('customers'),
        icon: 'male',
        permission: null,
        submenu: [{
          name: __('customers'),
          icon: 'grid-fill',
          url: '/users',
          permission: 'customer_list'
        }, {
          name: __('wishlists'),
          icon: 'grid-fill',
          url: '/wishlists',
          permission: 'manage_wishlists'
        }, {
          name: __('product_requests'),
          icon: 'grid-fill',
          url: '/product_requests',
          permission: 'product_request_list'
        },
        // {
        //     name: __('wallet_transactions'),
        //     icon: 'grid-fill',
        //     url: '/wallet_transactions',
        //     permission: 'manage_customer_wallet',
        // },
        // {
        //     name: __('transactions'),
        //     icon: 'grid-fill',
        //     url: '/transactions',
        //     permission: 'transaction_list',
        // },
        {
          name: __('customer_policies'),
          icon: 'grid-fill',
          url: '/privacy_policy',
          permission: 'manage_privacy_policy'
        }]
      }, {
        name: __('reports'),
        icon: 'folder-open',
        permission: null,
        submenu: [{
          name: __('product_sales_report'),
          icon: 'grid-fill',
          url: '/product_sales_reports',
          permission: 'product_sales_reports'
        }, {
          name: __('sales_reports'),
          icon: 'grid-fill',
          url: '/sales_reports',
          permission: 'sales_reports'
        }, {
          name: __('commission_reports'),
          icon: 'grid-fill',
          url: '/commission_reports',
          permission: 'commission_reports'
        }, {
          name: __('commission_billing'),
          icon: 'credit-card',
          url: '/commission_billing',
          permission: 'commission_reports'
        }]
      },
      /*
      {
          name: __('system_users'),
          icon: 'users',
          url: '/system_users',
          role: true
      },
      */
      {
        name: __('role'),
        icon: 'user-secret',
        url: '/role',
        role: true
      }, {
        name: __('faqs'),
        icon: 'info',
        url: '/faqs',
        permission: 'faq_list'
      }],
      databasedownloadBtn: [{
        name: __('database_backup'),
        icon: 'info',
        permission: 'database_backup_download'
      }]
    };
  },
  computed: {
    filteredSidebarItems: function filteredSidebarItems() {
      return this.sidebarItems;
    },
    filteredDatabaseDownloadBtn: function filteredDatabaseDownloadBtn() {
      return this.databasedownloadBtn;
    }
  },
  methods: {
    navIcon: function navIcon(name) {
      return (0,_utils_lucideIcons__WEBPACK_IMPORTED_MODULE_5__.lucideIcon)(name);
    },
    filterItem: function filterItem() {
      var filter = this.search;
      $(".sidebar-menu li:not(.sidebar-search)").each(function (index, element) {
        var item = $(element);
        var parentListIsNested = item.closest('ul').hasClass('submenu');
        if (item.text().match(new RegExp(filter, 'gi'))) {
          item.fadeIn();
          if (parentListIsNested) {
            item.closest('ul').removeClass('active');
          }
        } else {
          item.fadeOut();
          if (parentListIsNested) {
            item.closest('ul').addClass('active');
          }
        }
      });
    },
    subIsActive: function subIsActive(item) {
      var _this = this;
      var paths = Array.isArray(item.submenu) ? item.submenu : [];
      return paths.some(function (path) {
        return _this.$route.path.indexOf(path.url) === 0;
      });
    },
    isActive: function isActive(url) {
      if (this.$route.path == url) {
        return true;
      }
      return false;
    },
    isHasSub: function isHasSub(item) {
      if (item.hasOwnProperty("submenu")) {
        if (item.submenu.length > 0) {
          return true;
        }
      }
      return false;
    },
    hasAnySubmenuPermission: function hasAnySubmenuPermission(item) {
      var _this2 = this;
      if (!item.submenu || item.submenu.length === 0) {
        return false;
      }
      return item.submenu.some(function (submenu) {
        if (submenu.role) {
          return _this2.$role('Super Admin') && (item.name === 'Role' || item.name === 'System Users');
        }
        return submenu.permission && _this2.$can(submenu.permission);
      });
    },
    checkPermissions: function checkPermissions() {
      var current_path = this.$route.path;
      var permission = '';
      this.sidebarItems.forEach(function (menu) {
        //Only Main Categories
        if (menu.submenu && menu.submenu.length > 0) {
          menu.submenu.forEach(function (submenu) {
            if (submenu.url === current_path) {
              permission = submenu.permission;
            }
          });
        } else {
          if (menu.url === current_path) {
            permission = menu.permission;
          }
        }
      });
      if (_Auth__WEBPACK_IMPORTED_MODULE_3__["default"].check() && UserPermissions.length === 0) {
        //this.$router.push({path:'/login'});
        if (window.localStorage.getItem('loginCheck') == 1) {
          _Auth__WEBPACK_IMPORTED_MODULE_3__["default"].logout();
        }
        window.localStorage.setItem('loginCheck', 1);
        window.location.reload();
      } else if (_Auth__WEBPACK_IMPORTED_MODULE_3__["default"].check() && permission && !this.$can(permission)) {
        this.$router.push({
          path: '/unauthorized'
        });
      }
    },
    closeSideBarMenu: function closeSideBarMenu() {
      var w = window.innerWidth;
      if (w < 1200) {
        var _document$getElementB9, _document$getElementB10;
        (_document$getElementB9 = document.getElementById('sidebar')) === null || _document$getElementB9 === void 0 ? void 0 : (_document$getElementB10 = _document$getElementB9.classList) === null || _document$getElementB10 === void 0 ? void 0 : _document$getElementB10.remove('active');
        var backdrop = document.querySelector('.sidebar-backdrop');
        if (backdrop) backdrop.remove();
      }
    },
    downloadDatabase: function downloadDatabase() {
      var _this3 = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_4___default()({
        method: 'get',
        url: this.$apiUrl + '/database_backup_download',
        responseType: 'blob' // important: responseType must be 'blob' for file download
      }).then(function (response) {
        var blob = new Blob([response.data]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        // Extracting the filename from the response headers
        var contentDisposition = response.headers['content-disposition'];
        var filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
        var filename = filenameMatch ? filenameMatch[1] : 'downloaded-database-backup.sql';
        link.download = filename;
        link.click();
        _this3.showMessage("success", __('database_downloaded_successfully'));
        _this3.isLoading = false;
      })["catch"](function (error) {
        console.error('Error downloading file:', error);
        // Handle error accordingly
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheFooter.vue?vue&type=script&lang=js":
/*!***************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheFooter.vue?vue&type=script&lang=js ***!
  \***************************************************************************************************************************************************************************************************/
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'TheFooter',
  data: function data() {
    return {
      copyrightDetails: window.copyrightDetails,
      currentVersion: window.currentVersion
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheSidebar.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheSidebar.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************/
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


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'TheSidebar',
  data: function data() {
    return {
      //minimize: false,
      nav: [],
      //show: true,
      buffor: []
    };
  },
  computed: {
    show: function show() {
      //return this.$store.state.sidebarShow
    },
    minimize: function minimize() {
      //return this.$store.state.sidebarMinimize
    }
  },
  methods: {
    dropdown: function dropdown(data) {
      var result = {
        _name: 'CSidebarNavDropdown',
        name: data['name'],
        route: data['href'],
        icon: data['icon'],
        _children: []
      };
      for (var i = 0; i < data['elements'].length; i++) {
        if (data['elements'][i]['slug'] == 'dropdown') {
          result._children.push(this.dropdown(data['elements'][i]));
        } else {
          result._children.push({
            _name: 'CSidebarNavItem',
            name: data['elements'][i]['name'],
            to: data['elements'][i]['href'],
            icon: data['elements'][i]['icon']
          });
        }
      }
      return result;
    },
    rebuildData: function rebuildData(data) {
      this.buffor = [{
        _name: 'CSidebarNav',
        _children: []
      }];
      for (var k = 0; k < data.length; k++) {
        switch (data[k]['slug']) {
          case 'link':
            if (data[k]['href'].indexOf('http') !== -1) {
              this.buffor[0]._children.push({
                _name: 'CSidebarNavItem',
                name: data[k]['name'],
                href: data[k]['href'],
                icon: data[k]['icon'],
                target: '_blank'
              });
            } else {
              this.buffor[0]._children.push({
                _name: 'CSidebarNavItem',
                name: data[k]['name'],
                to: data[k]['href'],
                icon: data[k]['icon']
              });
            }
            break;
          case 'title':
            this.buffor[0]._children.push({
              _name: 'CSidebarNavTitle',
              _children: [data[k]['name']]
            });
            break;
          case 'dropdown':
            this.buffor[0]._children.push(this.dropdown(data[k]));
            break;
        }
      }
      return this.buffor;
    }
  },
  mounted: function mounted() {
    var _this = this;
    this.$root.$on('toggle-sidebar', function () {
      var sidebarOpened = _this.show === true || _this.show === 'responsive';
      _this.show = sidebarOpened ? false : 'responsive';
    });
    this.$root.$on('toggle-sidebar-mobile', function () {
      var sidebarClosed = _this.show === 'responsive' || _this.show === false;
      _this.show = sidebarClosed ? true : 'responsive';
    });
    var self = this;
    axios__WEBPACK_IMPORTED_MODULE_0___default().get(this.$apiAdress + '/api/menu?token=' + localStorage.getItem("api_token")).then(function (response) {
      self.nav = self.rebuildData(response.data);
    })["catch"](function (error) {
      self.$router.push({
        path: '/login'
      });
    });
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=script&lang=js":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=script&lang=js ***!
  \********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Auth_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Auth.js */ "./resources/js/Auth.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_lucideIcons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/lucideIcons */ "./resources/js/utils/lucideIcons.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    return {
      lang: window.localStorage.getItem('lang') || window.appLocale || 'en',
      user: _Auth_js__WEBPACK_IMPORTED_MODULE_0__["default"].user,
      role: Role,
      profile_url: Role === 'Seller' ? _Auth_js__WEBPACK_IMPORTED_MODULE_0__["default"].user.seller.logo_url : Role === 'Delivery Boy' ? this.$baseUrl + '/images/admin_logo.png' : this.$baseUrl + '/images/admin_logo.png',
      notifications: [],
      userTheme: "theme-light",
      isToggle: false,
      //seller status
      sellerStatus: null,
      sellerStatusLoading: false,
      deliveryBoyStatus: null,
      deliveryBoyStatusLoading: false,
      remark: '',
      popoverShow: false,
      isSystemRefreshing: false,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      languages: [],
      notifications_unread_count: 0
    };
  },
  computed: {
    isSellerRoute: function isSellerRoute() {
      // Use this.$route to access the current route
      return this.$route.path === '/seller' || this.$route.path.startsWith('/seller/');
    }
  },
  beforeDestroy: function beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('DOMContentLoaded', this.onResize);
  },
  mounted: function mounted() {
    var _this = this;
    if (window.localStorage.getItem('lang_reload_pending') === 'true') {
      window.localStorage.removeItem('lang_reload_pending');
      setTimeout(function () {
        var currentUrl = window.location.href.split('?')[0].split('#')[0];
        var cacheBuster = '_t=' + Date.now();
        window.location.href = currentUrl + '?' + cacheBuster;
      }, 100);
      return;
    }

    // Fetch initial seller status if the user is a seller
    if (this.role === this.$roleSeller) this.getSellerStatus();

    // Fetch initial delivery boy status if the user is a delivery boy
    if (this.role === this.$roleDeliveryBoy) this.getDeliveryBoyStatus();
    this.$nextTick(function () {
      window.addEventListener('resize', _this.onResize);
      window.addEventListener('DOMContentLoaded', _this.onResize);
    });
    var initUserTheme = this.getTheme();
    this.setTheme(initUserTheme);
    this.timer = setInterval(function () {
      _this.getNotifications();
    }, 40000); // 40 seconds

    this.getLanguage();
  },
  created: function created() {
    this.getNotifications();
  },
  watch: {
    'user.delivery_boy.id': function userDelivery_boyId(id) {
      if (id && this.role === this.$roleDeliveryBoy) {
        this.getDeliveryBoyStatus();
      }
    }
  },
  methods: {
    navIcon: function navIcon(name) {
      return (0,_utils_lucideIcons__WEBPACK_IMPORTED_MODULE_2__.lucideIcon)(name);
    },
    toggleSidebar: function toggleSidebar() {
      var sidebar = document.getElementById('sidebar');
      if (!sidebar) return;
      sidebar.classList.toggle('active');
      var isSmallScreen = window.innerWidth < 1200;
      var backdrop = document.querySelector('.sidebar-backdrop');
      if (backdrop) backdrop.remove();
      if (isSmallScreen && sidebar.classList.contains('active')) {
        var b = document.createElement('div');
        b.className = 'sidebar-backdrop';
        b.addEventListener('click', function () {
          sidebar.classList.remove('active');
          var bd = document.querySelector('.sidebar-backdrop');
          if (bd) bd.remove();
        });
        document.body.appendChild(b);
      }
    },
    //seller status toggle
    getSellerStatus: function getSellerStatus() {
      var _this2 = this;
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(this.$apiUrl + '/seller/get_seller_status', {
        seller_id: this.user.seller.id
      }).then(function (response) {
        if (response.data && response.data.data) {
          _this2.sellerStatus = Number(response.data.data.status);
        }
      })["catch"](function (error) {
        var _error$response;
        console.error('Error fetching seller status:', ((_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data) || error);
      });
    },
    //delivery boy status toggle
    getDeliveryBoyStatus: function getDeliveryBoyStatus() {
      var _this3 = this;
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(this.$apiUrl + '/delivery_boy/get_delivery_boy_status', {
        id: this.user.delivery_boy.id
      }).then(function (response) {
        if (response.data && response.data.data) {
          _this3.deliveryBoyStatus = Number(response.data.data.status);
        }
      })["catch"](function (error) {
        var _error$response2;
        console.error('Error fetching delivery boy status:', ((_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data) || error);
      });
    },
    // Toggle seller status update
    toggleSellerStatus: function toggleSellerStatus() {
      var _this4 = this;
      if (this.sellerStatusLoading) return;
      var previousStatus = this.sellerStatus === 1 ? 3 : 1;
      this.sellerStatusLoading = true;
      var formData = new FormData();
      formData.append('seller_id', this.user.seller.id);
      formData.append('status', this.sellerStatus);
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(this.$apiUrl + '/sellers/update_status', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        if (response.data.status === 1) {
          console.log('Seller status updated:', response.data);
        } else {
          console.error('API returned error:', response.data.message);
          _this4.sellerStatus = previousStatus;
        }
      })["catch"](function (error) {
        var _error$response3;
        console.error('API error:', ((_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.data) || error);
        _this4.sellerStatus = previousStatus;
      })["finally"](function () {
        _this4.sellerStatusLoading = false;
      });
    },
    // Toggle delivery boy status update
    toggleDeliveryBoyStatus: function toggleDeliveryBoyStatus() {
      var _this5 = this;
      if (this.deliveryBoyStatusLoading) return;
      var previousStatus = this.deliveryBoyStatus === 1 ? 3 : 1;
      this.deliveryBoyStatusLoading = true;
      var formData = new FormData();
      formData.append('id', this.user.delivery_boy.id);
      formData.append('status', this.deliveryBoyStatus);
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(this.$apiUrl + '/delivery_boys/update-status', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(function (response) {
        if (response.data.status === 1) {
          console.log('Delivery boy status updated:', response.data);
        } else {
          console.error('API returned error:', response.data.message);
          _this5.deliveryBoyStatus = previousStatus;
        }
      })["catch"](function (error) {
        var _error$response4;
        console.error('API error:', ((_error$response4 = error.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.data) || error);
        _this5.deliveryBoyStatus = previousStatus;
      })["finally"](function () {
        _this5.deliveryBoyStatusLoading = false;
      });
    },
    logout: function logout() {
      var _this6 = this;
      var role_id = _Auth_js__WEBPACK_IMPORTED_MODULE_0__["default"].user.role_id;

      // Clear language session on server before logout
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(this.$apiUrl + '/clear_language_session').then(function () {
        // Now proceed with logout
        _Auth_js__WEBPACK_IMPORTED_MODULE_0__["default"].logout();
        setTimeout(function () {
          if (role_id === 3) {
            _this6.$router.push('/seller/login');
          } else if (role_id === 4) {
            _this6.$router.push('/delivery_boy/login');
          } else {
            _this6.$router.push('/login');
          }
          window.location.reload();
        }, 500);
      })["catch"](function () {
        // If API call fails, still proceed with logout
        _Auth_js__WEBPACK_IMPORTED_MODULE_0__["default"].logout();
        setTimeout(function () {
          if (role_id === 3) {
            _this6.$router.push('/seller/login');
          } else if (role_id === 4) {
            _this6.$router.push('/delivery_boy/login');
          } else {
            _this6.$router.push('/login');
          }
          window.location.reload();
        }, 500);
      });
    },
    changeLanguage: function changeLanguage(event) {
      var _this7 = this;
      // Update the selected language based on the change event
      this.lang = event.target.value;
      window.localStorage.setItem('lang', this.lang);
      this.isLoading = true;
      var data = {
        language: this.lang
      };
      axios__WEBPACK_IMPORTED_MODULE_1___default().post(this.$apiUrl + '/change_language', data).then(function (response) {
        _this7.isLoading = false;
        // Apply RTL based on language type from API (any language can be RTL)
        _this7.applyRtlForLanguage(_this7.lang);
        // Update the default language in local state
        _this7.updateDefaultLanguage(_this7.lang);
        window.localStorage.removeItem('language');
        window.localStorage.setItem('lang_reload_pending', 'true');
        var currentUrl = window.location.href.split('?')[0].split('#')[0];
        var cacheBuster = '_t=' + Date.now();
        window.location.href = currentUrl + '?' + cacheBuster;
      });
    },
    updateDefaultLanguage: function updateDefaultLanguage(newDefaultLanguage) {
      // Update the default language in the languages array
      this.languages.forEach(function (language) {
        if (language.code === newDefaultLanguage) {
          language.is_default = 1;
        } else {
          language.is_default = 0;
        }
      });
    },
    getLanguage: function getLanguage() {
      var _this8 = this;
      this.isLoading = true;
      var data = {
        params: {
          system_type: 4
        }
      };
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/system_languages', data).then(function (response) {
        _this8.isLoading = false;
        var data = response.data;
        if (data && Array.isArray(data.data)) {
          _this8.languages = data.data;
          _this8.totalRows = _this8.languages.length;
        } else {
          _this8.languages = [];
          _this8.totalRows = 0;
        }
        // Apply RTL based on language type from API (any language can be RTL)
        _this8.applyRtlForLanguage(window.localStorage.getItem('lang') || _this8.lang);
      })["catch"](function (error) {
        _this8.isLoading = false;
        console.error('Error fetching languages:', error);
      });
    },
    /**
     * Apply or remove RTL class on body based on language type from API.
     * Uses language.type from supported_languages (rtl/ltr) - not hardcoded to any specific language.
     */
    applyRtlForLanguage: function applyRtlForLanguage(langCode) {
      var lang = this.languages.find(function (l) {
        return (l.code || '').toLowerCase() === (langCode || '').toLowerCase();
      });
      var isRtl = lang && String(lang.type || '').toLowerCase() === 'rtl';
      if (isRtl) {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    },
    getNotifications: function getNotifications(event) {
      var _this9 = this;
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/get_top_notifications').then(function (response) {
        _this9.notifications = response.data.data.notifications;
        _this9.notifications_unread_count = response.data.data.unread;
      });
    },
    markAsReadNotification: function markAsReadNotification(notification) {
      var _this10 = this;
      if (notification.read_at == null) {
        axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/notification_read?id=' + notification.id).then(function (response) {
          _this10.getNotifications();
        });
      }
    },
    confirmMarkAllAsRead: function confirmMarkAllAsRead() {
      var _this11 = this;
      // Show SweetAlert confirmation dialog before marking all notifications as read
      this.$swal.fire({
        title: __('are_you_sure'),
        text: 'Do you want to mark all notifications as read?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: __('yes_sure'),
        cancelButtonText: __('cancel'),
        confirmButtonColor: '#37a279',
        cancelButtonColor: '#d33'
      }).then(function (result) {
        // If user confirms, proceed to mark all as read
        if (result.value) {
          _this11.markAllAsRead();
        }
      });
    },
    markAllAsRead: function markAllAsRead() {
      var _this12 = this;
      // Mark all notifications as read by calling the API without id parameter
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/notification_read').then(function (response) {
        // Refresh notifications to update the UI
        _this12.getNotifications();
        // Show success message
        _this12.showMessage("success", response.data.message || "All notifications marked as read");
      })["catch"](function (error) {
        // Show error message if something goes wrong
        _this12.showError("Failed to mark all notifications as read");
      });
    },
    changeDateTime: function changeDateTime(dateTime) {
      return moment(dateTime).fromNow();
    },
    setTheme: function setTheme(theme) {
      sessionStorage.setItem("user-theme", theme);
      this.userTheme = theme;
      // Only swap theme classes so RTL class is preserved (sidebar stays on correct side in RTL + dark mode).
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(theme);
    },
    getMediaPreference: function getMediaPreference() {
      var hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (hasDarkPreference) {
        return "theme-dark";
      } else {
        return "theme-light";
      }
    },
    getTheme: function getTheme() {
      var user_theme = sessionStorage.getItem("user-theme");
      this.userTheme = user_theme;
      return user_theme;
    },
    toggleTheme: function toggleTheme(e) {
      var _this13 = this;
      var x = e ? e.clientX : window.innerWidth / 2;
      var y = e ? e.clientY : window.innerHeight / 2;
      var endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      var activeTheme = sessionStorage.getItem("user-theme");
      var nextTheme = activeTheme === "theme-light" || !activeTheme || activeTheme === "undefined" || activeTheme === "null" ? "theme-dark" : "theme-light";
      if (document.startViewTransition) {
        var transition = document.startViewTransition(function () {
          _this13.setTheme(nextTheme);
        });
        transition.ready.then(function () {
          var clipPath = ["circle(0px at ".concat(x, "px ").concat(y, "px)"), "circle(".concat(endRadius, "px at ").concat(x, "px ").concat(y, "px)")];
          document.documentElement.animate({
            clipPath: clipPath
          }, {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)'
          });
        });
      } else {
        var circle = document.createElement('div');
        circle.className = 'theme-circle-transition';
        var diameter = endRadius * 2;
        circle.style.width = "".concat(diameter, "px");
        circle.style.height = "".concat(diameter, "px");
        circle.style.left = "".concat(x - endRadius, "px");
        circle.style.top = "".concat(y - endRadius, "px");
        circle.style.backgroundColor = nextTheme === 'theme-dark' ? '#151521' : '#f2f7ff';
        document.body.appendChild(circle);
        requestAnimationFrame(function () {
          circle.classList.add('active');
          setTimeout(function () {
            _this13.setTheme(nextTheme);
            setTimeout(function () {
              circle.remove();
            }, 300);
          }, 300);
        });
      }
    },
    onResize: function onResize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },
    clearCache: function clearCache() {
      var vm = this;
      vm.isSystemRefreshing = true;
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$baseUrl + '/clear').then(function (response) {
        var data = response.data;
        if (data.status === 1) {
          setTimeout(function () {
            vm.showMessage("success", data.message);
            vm.isSystemRefreshing = false;
            vm.popoverShow = false;
            window.location.reload();
          }, 2000);
        } else {
          vm.showError(data.message);
          vm.isSystemRefreshing = false;
        }
      })["catch"](function (error) {
        var _error$request;
        vm.isSystemRefreshing = false;
        if (error !== null && error !== void 0 && (_error$request = error.request) !== null && _error$request !== void 0 && _error$request.statusText) {
          vm.showError(error.request.statusText);
        } else if (error.message) {
          vm.showError(error.message);
        } else {
          vm.showError(__('something_went_wrong'));
        }
      });
    },
    handleNotificationClick: function handleNotificationClick(notification) {
      var _this14 = this;
      this.markAsReadNotification(notification);
      var orderId = notification.data.order_id;
      axios__WEBPACK_IMPORTED_MODULE_1___default().get(this.$apiUrl + '/orders/view/' + orderId).then(function (response) {
        var order = response.data.data.order;
        if (order) {
          if (order.order_type === 'selfpickup') {
            _this14.$router.push('/self_pickup_orders/view/' + orderId);
          } else {
            _this14.$router.push('/orders/view/' + orderId);
          }
        } else {
          _this14.$router.push('/orders/view/' + orderId);
        }
      })["catch"](function (error) {
        _this14.$router.push('/orders/view/' + orderId);
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/utils/lucideIcons.js":
/*!*******************************************!*\
  !*** ./resources/js/utils/lucideIcons.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   lucideIcon: () => (/* binding */ lucideIcon)
/* harmony export */ });
// Lucide (https://lucide.dev/icons) SVG markup, fetched verbatim from the
// lucide-static package. Keyed by the *old* font-awesome/bootstrap-icons name
// so existing `item.icon`/icon-class strings in nav configs and templates
// don't need to change — only the rendering swaps from an <i> font glyph to
// an inline SVG.

var ICONS = {
  // sidebar (admin)
  'box-open': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/></svg>',
  'bullseye': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
  'credit-card': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
  'cubes': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/></svg>',
  'folder-open': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>',
  'gear': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>',
  'cog': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>',
  'gift': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5"/><rect x="3" y="7" width="18" height="4" rx="1"/></svg>',
  'globe-asia': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  'grid-fill': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
  'info': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  'language': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>',
  'male': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'map': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>',
  'pen': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>',
  'picture-o': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  'puzzle-piece': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"/></svg>',
  'retweet': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>',
  'share-square': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>',
  'shopping-cart': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  'tachometer-alt': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
  'truck': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  'users': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>',
  'user-secret': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>',
  'wrench': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>',
  'mail': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>',
  'check': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  'package': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/></svg>',
  // seller / delivery-boy sidebar extras
  'calculator': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>',
  'clipboard-check': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',
  'exchange-alt': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>',
  'money': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
  'money-bill': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>',
  // header
  'bell': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>',
  'bell-slash': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742"/><path d="m2 2 20 20"/><path d="M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05"/></svg>',
  'box-arrow-left': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>',
  'chevron-down': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
  'moon-stars': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>',
  'person': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'sun': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
  'ellipsis-h': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  'refresh': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
  'times': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  'search': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>',
  'panel-left': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>'
};

// Fallback for any icon name not in the map above (e.g. a future nav item).
var FALLBACK = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>';
function lucideIcon(name) {
  return ICONS[name] || FALLBACK;
}

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.fade-enter-active[data-v-59a2dd7f],\n.fade-leave-active[data-v-59a2dd7f] {\n    transition: opacity 0.3s;\n}\n.fade-enter[data-v-59a2dd7f],\n.fade-leave-to[data-v-59a2dd7f] {\n    opacity: 0;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "\n.switch-checkbox {\n    display: none;\n}\n:root {\n    --background-color-primary: #ebebeb;\n    --background-color-secondary: #fafafa;\n    --accent-color: #cacaca;\n    --text-primary-color: #222;\n    --element-size: 4rem;\n    /* <- this is the base size of our element */\n}\n.switch-label {\n    /* for width, use the standard element-size */\n    width: var(--element-size);\n\n    /* for other dimensions, calculate values based on it */\n    border-radius: var(--element-size);\n    border: calc(var(--element-size) * 0.025) solid var(--accent-color);\n    padding: calc(var(--element-size) * 0.1);\n    font-size: calc(var(--element-size) * 0.3);\n    height: calc(var(--element-size) * 0.35);\n\n    align-items: center;\n    background: var(--text-primary-color);\n    cursor: pointer;\n    display: flex;\n    position: relative;\n    transition: background 0.5s ease;\n    justify-content: space-between;\n    z-index: 1;\n}\n.switch-toggle {\n    position: absolute;\n    background-color: var(--background-color-primary);\n    border-radius: 50%;\n    top: calc(var(--element-size) * 0.07);\n    left: calc(var(--element-size) * 0.07);\n    height: calc(var(--element-size) * 0.4);\n    width: calc(var(--element-size) * 0.4);\n    transform: translateX(0);\n    transition: transform 0.3s ease, background-color 0.5s ease;\n}\n.switch-toggle-checked {\n    transform: translateX(calc(var(--element-size) * 0.6)) !important;\n}\n.user-dropdown-menu {\n    position: absolute !important;\n    right: 0 !important;\n    left: auto !important;\n    transform: none !important;\n    max-width: 250px;\n    min-width: 200px;\n    z-index: 1050;\n}\n.dropdown {\n    position: relative;\n}\n.navbar .dropdown-menu {\n    position: absolute !important;\n    top: 100% !important;\n    right: 0 !important;\n    left: auto !important;\n}\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_style_index_0_id_59a2dd7f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_style_index_0_id_59a2dd7f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_style_index_0_id_59a2dd7f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_style_index_0_id_29466cd2_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css */ "./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_style_index_0_id_29466cd2_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_style_index_0_id_29466cd2_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./resources/js/containers/TheContainer.vue":
/*!**************************************************!*\
  !*** ./resources/js/containers/TheContainer.vue ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TheContainer_vue_vue_type_template_id_59a2dd7f_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TheContainer.vue?vue&type=template&id=59a2dd7f&scoped=true */ "./resources/js/containers/TheContainer.vue?vue&type=template&id=59a2dd7f&scoped=true");
/* harmony import */ var _TheContainer_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TheContainer.vue?vue&type=script&lang=js */ "./resources/js/containers/TheContainer.vue?vue&type=script&lang=js");
/* harmony import */ var _TheContainer_vue_vue_type_style_index_0_id_59a2dd7f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css */ "./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _TheContainer_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _TheContainer_vue_vue_type_template_id_59a2dd7f_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _TheContainer_vue_vue_type_template_id_59a2dd7f_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "59a2dd7f",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/containers/TheContainer.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/containers/TheFooter.vue":
/*!***********************************************!*\
  !*** ./resources/js/containers/TheFooter.vue ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TheFooter_vue_vue_type_template_id_44bdf58d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TheFooter.vue?vue&type=template&id=44bdf58d */ "./resources/js/containers/TheFooter.vue?vue&type=template&id=44bdf58d");
/* harmony import */ var _TheFooter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TheFooter.vue?vue&type=script&lang=js */ "./resources/js/containers/TheFooter.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TheFooter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _TheFooter_vue_vue_type_template_id_44bdf58d__WEBPACK_IMPORTED_MODULE_0__.render,
  _TheFooter_vue_vue_type_template_id_44bdf58d__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/containers/TheFooter.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/containers/TheSidebar.vue":
/*!************************************************!*\
  !*** ./resources/js/containers/TheSidebar.vue ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TheSidebar_vue_vue_type_template_id_08a98f4c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TheSidebar.vue?vue&type=template&id=08a98f4c */ "./resources/js/containers/TheSidebar.vue?vue&type=template&id=08a98f4c");
/* harmony import */ var _TheSidebar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TheSidebar.vue?vue&type=script&lang=js */ "./resources/js/containers/TheSidebar.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TheSidebar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _TheSidebar_vue_vue_type_template_id_08a98f4c__WEBPACK_IMPORTED_MODULE_0__.render,
  _TheSidebar_vue_vue_type_template_id_08a98f4c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/containers/TheSidebar.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/containers/VerticalHeader.vue":
/*!****************************************************!*\
  !*** ./resources/js/containers/VerticalHeader.vue ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _VerticalHeader_vue_vue_type_template_id_29466cd2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VerticalHeader.vue?vue&type=template&id=29466cd2 */ "./resources/js/containers/VerticalHeader.vue?vue&type=template&id=29466cd2");
/* harmony import */ var _VerticalHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VerticalHeader.vue?vue&type=script&lang=js */ "./resources/js/containers/VerticalHeader.vue?vue&type=script&lang=js");
/* harmony import */ var _VerticalHeader_vue_vue_type_style_index_0_id_29466cd2_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css */ "./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _VerticalHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _VerticalHeader_vue_vue_type_template_id_29466cd2__WEBPACK_IMPORTED_MODULE_0__.render,
  _VerticalHeader_vue_vue_type_template_id_29466cd2__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/containers/VerticalHeader.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/containers/TheContainer.vue?vue&type=script&lang=js":
/*!**************************************************************************!*\
  !*** ./resources/js/containers/TheContainer.vue?vue&type=script&lang=js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TheContainer.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/containers/TheFooter.vue?vue&type=script&lang=js":
/*!***********************************************************************!*\
  !*** ./resources/js/containers/TheFooter.vue?vue&type=script&lang=js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TheFooter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TheFooter.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheFooter.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TheFooter_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/containers/TheSidebar.vue?vue&type=script&lang=js":
/*!************************************************************************!*\
  !*** ./resources/js/containers/TheSidebar.vue?vue&type=script&lang=js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TheSidebar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TheSidebar.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheSidebar.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TheSidebar_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/containers/VerticalHeader.vue?vue&type=script&lang=js":
/*!****************************************************************************!*\
  !*** ./resources/js/containers/VerticalHeader.vue?vue&type=script&lang=js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VerticalHeader.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css":
/*!**********************************************************************************************************!*\
  !*** ./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_style_index_0_id_59a2dd7f_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=style&index=0&id=59a2dd7f&scoped=true&lang=css");


/***/ }),

/***/ "./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css":
/*!************************************************************************************************!*\
  !*** ./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_dist_cjs_js_node_modules_css_loader_dist_cjs_js_clonedRuleSet_9_use_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_dist_cjs_js_clonedRuleSet_9_use_2_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_style_index_0_id_29466cd2_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader/dist/cjs.js!../../../node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css */ "./node_modules/style-loader/dist/cjs.js!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-9.use[1]!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-9.use[2]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=style&index=0&id=29466cd2&lang=css");


/***/ }),

/***/ "./resources/js/containers/TheContainer.vue?vue&type=template&id=59a2dd7f&scoped=true":
/*!********************************************************************************************!*\
  !*** ./resources/js/containers/TheContainer.vue?vue&type=template&id=59a2dd7f&scoped=true ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_template_id_59a2dd7f_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_template_id_59a2dd7f_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheContainer_vue_vue_type_template_id_59a2dd7f_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TheContainer.vue?vue&type=template&id=59a2dd7f&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=template&id=59a2dd7f&scoped=true");


/***/ }),

/***/ "./resources/js/containers/TheFooter.vue?vue&type=template&id=44bdf58d":
/*!*****************************************************************************!*\
  !*** ./resources/js/containers/TheFooter.vue?vue&type=template&id=44bdf58d ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheFooter_vue_vue_type_template_id_44bdf58d__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheFooter_vue_vue_type_template_id_44bdf58d__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheFooter_vue_vue_type_template_id_44bdf58d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TheFooter.vue?vue&type=template&id=44bdf58d */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheFooter.vue?vue&type=template&id=44bdf58d");


/***/ }),

/***/ "./resources/js/containers/TheSidebar.vue?vue&type=template&id=08a98f4c":
/*!******************************************************************************!*\
  !*** ./resources/js/containers/TheSidebar.vue?vue&type=template&id=08a98f4c ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheSidebar_vue_vue_type_template_id_08a98f4c__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheSidebar_vue_vue_type_template_id_08a98f4c__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TheSidebar_vue_vue_type_template_id_08a98f4c__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./TheSidebar.vue?vue&type=template&id=08a98f4c */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheSidebar.vue?vue&type=template&id=08a98f4c");


/***/ }),

/***/ "./resources/js/containers/VerticalHeader.vue?vue&type=template&id=29466cd2":
/*!**********************************************************************************!*\
  !*** ./resources/js/containers/VerticalHeader.vue?vue&type=template&id=29466cd2 ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_template_id_29466cd2__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_template_id_29466cd2__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_VerticalHeader_vue_vue_type_template_id_29466cd2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./VerticalHeader.vue?vue&type=template&id=29466cd2 */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=template&id=29466cd2");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=template&id=59a2dd7f&scoped=true":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheContainer.vue?vue&type=template&id=59a2dd7f&scoped=true ***!
  \***********************************************************************************************************************************************************************************************************************************/
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
  return _c("div", { attrs: { id: "app" } }, [
    _c("div", { staticClass: "active", attrs: { id: "sidebar" } }, [
      _c("div", { staticClass: "sidebar-wrapper active" }, [
        _c("div", { staticClass: "sidebar-header" }, [
          _c(
            "div",
            {
              staticClass: "d-flex justify-content-center align-items-center",
              staticStyle: { position: "relative" },
            },
            [
              _c(
                "div",
                { staticClass: "logo" },
                [
                  _c(
                    "router-link",
                    {
                      staticStyle: {
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "center",
                      },
                      attrs: { to: "/" },
                    },
                    [
                      _vm.$appLogo != ""
                        ? _c("img", {
                            staticClass: "container-logo",
                            attrs: {
                              src: _vm.$storageUrl + _vm.$appLogo,
                              alt: "Logo",
                              srcset: "",
                            },
                          })
                        : _c("img", {
                            staticClass: "container-logo",
                            attrs: {
                              src: _vm.$baseUrl + "/images/logo.png",
                              alt: "Logo",
                              srcset: "",
                            },
                          }),
                    ]
                  ),
                ],
                1
              ),
            ]
          ),
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "sidebar-menu" }, [
          _c(
            "ul",
            { staticClass: "menu" },
            [
              _c(
                "li",
                { staticClass: "sidebar-item sidebar-search" },
                [
                  _c("b-form-input", {
                    attrs: { type: "search", placeholder: _vm.__("search") },
                    on: { keyup: _vm.filterItem, search: _vm.filterItem },
                    model: {
                      value: _vm.search,
                      callback: function ($$v) {
                        _vm.search = $$v
                      },
                      expression: "search",
                    },
                  }),
                ],
                1
              ),
              _vm._v(" "),
              _vm._l(_vm.filteredSidebarItems, function (item) {
                return [
                  (
                    item.role == true
                      ? _vm.$role("Super Admin")
                      : (item.permission && _vm.$can(item.permission)) ||
                        (item.permission === null &&
                          _vm.isHasSub(item) &&
                          _vm.hasAnySubmenuPermission(item))
                  )
                    ? _c(
                        "li",
                        {
                          staticClass: "sidebar-item",
                          class: {
                            active:
                              _vm.isActive(item.url) || _vm.subIsActive(item),
                            "has-sub": _vm.isHasSub(item),
                          },
                        },
                        [
                          _vm.isHasSub(item)
                            ? [
                                _c("a", { staticClass: "sidebar-link" }, [
                                  _c("span", {
                                    staticClass: "sidebar-icon",
                                    domProps: {
                                      innerHTML: _vm._s(_vm.navIcon(item.icon)),
                                    },
                                  }),
                                  _vm._v(" "),
                                  _c("span", [_vm._v(_vm._s(item.name))]),
                                ]),
                                _vm._v(" "),
                                _c(
                                  "ul",
                                  {
                                    staticClass: "submenu",
                                    class: { active: _vm.subIsActive(item) },
                                  },
                                  [
                                    _vm._l(item.submenu, function (sub) {
                                      return [
                                        (
                                          sub.role
                                            ? _vm.$role("Super Admin")
                                            : sub.permission &&
                                              _vm.$can(sub.permission)
                                        )
                                          ? _c(
                                              "li",
                                              {
                                                key: sub.key,
                                                staticClass: "submenu-item",
                                                class: {
                                                  active: _vm.isActive(sub.url),
                                                },
                                              },
                                              [
                                                _c(
                                                  "router-link",
                                                  {
                                                    attrs: { to: sub.url },
                                                    on: {
                                                      click: function ($event) {
                                                        return _vm.closeSideBarMenu()
                                                      },
                                                    },
                                                  },
                                                  [
                                                    _vm._v(
                                                      "\n                                                " +
                                                        _vm._s(sub.name) +
                                                        "\n                                            "
                                                    ),
                                                  ]
                                                ),
                                              ],
                                              1
                                            )
                                          : _vm._e(),
                                      ]
                                    }),
                                  ],
                                  2
                                ),
                              ]
                            : [
                                _c(
                                  "router-link",
                                  {
                                    staticClass: "sidebar-link",
                                    attrs: { to: item.url },
                                    on: {
                                      click: function ($event) {
                                        return _vm.closeSideBarMenu()
                                      },
                                    },
                                  },
                                  [
                                    _c("span", {
                                      staticClass: "sidebar-icon",
                                      domProps: {
                                        innerHTML: _vm._s(
                                          _vm.navIcon(item.icon)
                                        ),
                                      },
                                    }),
                                    _vm._v(" "),
                                    _c("span", [_vm._v(_vm._s(item.name))]),
                                  ]
                                ),
                              ],
                        ],
                        2
                      )
                    : _vm._e(),
                ]
              }),
              _vm._v(" "),
              _vm._l(_vm.filteredDatabaseDownloadBtn, function (item) {
                return [
                  (
                    item.role == true
                      ? _vm.$role("Super Admin")
                      : item.permission && _vm.$can(item.permission)
                  )
                    ? _c("div", [
                        _c(
                          "button",
                          {
                            staticClass: "btn btn-primary",
                            on: { click: _vm.downloadDatabase },
                          },
                          [
                            _c("i", { class: "fa fa-download" }),
                            _vm.isLoading
                              ? _c("b-spinner", {
                                  attrs: { small: "", label: "Spinning" },
                                })
                              : _vm._e(),
                            _vm._v(" Download Database"),
                          ],
                          1
                        ),
                      ])
                    : _vm._e(),
                ]
              }),
            ],
            2
          ),
        ]),
        _vm._v(" "),
        _vm._m(0),
      ]),
    ]),
    _vm._v(" "),
    _c(
      "div",
      { attrs: { id: "main" } },
      [
        _c("vertical-header"),
        _vm._v(" "),
        _c("div", { attrs: { id: "main-content" } }, [_c("router-view")], 1),
        _vm._v(" "),
        _c("the-footer"),
      ],
      1
    ),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("button", { staticClass: "sidebar-toggler btn x" }, [
      _c("i", { attrs: { "data-feather": "x" } }),
    ])
  },
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheFooter.vue?vue&type=template&id=44bdf58d":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheFooter.vue?vue&type=template&id=44bdf58d ***!
  \********************************************************************************************************************************************************************************************************************/
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
  return _c("footer", { staticClass: "app-footer" }, [
    _c("div", { staticClass: "footer clearfix mb-0" }, [
      _c("div", {
        staticClass: "float-start footer-copyright",
        domProps: { innerHTML: _vm._s(_vm.copyrightDetails) },
      }),
      _vm._v(" "),
      _vm.currentVersion !== ""
        ? _c("div", { staticClass: "float-end footer-version" }, [
            _vm._v(
              "\n            " + _vm._s(_vm.__("version")) + " :\n            "
            ),
            _c("span", { staticClass: "footer-version-badge" }, [
              _vm._v(_vm._s(_vm.$currentVersion)),
            ]),
          ])
        : _vm._e(),
    ]),
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheSidebar.vue?vue&type=template&id=08a98f4c":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/TheSidebar.vue?vue&type=template&id=08a98f4c ***!
  \*********************************************************************************************************************************************************************************************************************/
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
    "CSidebar",
    {
      attrs: { fixed: "", minimize: _vm.minimize, show: _vm.show },
      on: {
        "update:show": function (value) {
          return _vm.$store.commit("set", ["sidebarShow", value])
        },
      },
    },
    [
      _c(
        "CSidebarBrand",
        { staticClass: "d-md-down-none", attrs: { to: "/" } },
        [
          _c("CIcon", {
            staticClass: "d-block",
            attrs: {
              name: "logo",
              size: "custom-size",
              height: 35,
              viewBox: "0 0 " + (_vm.minimize ? 110 : 556) + " 134",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c("CRenderFunction", {
        attrs: { flat: "", "content-to-render": _vm.nav },
      }),
      _vm._v(" "),
      _c("CSidebarMinimizer", {
        staticClass: "d-md-down-none",
        nativeOn: {
          click: function ($event) {
            return _vm.$store.commit("set", ["sidebarMinimize", !_vm.minimize])
          },
        },
      }),
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=template&id=29466cd2":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/containers/VerticalHeader.vue?vue&type=template&id=29466cd2 ***!
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
  return _c("header", { staticClass: "app-header mb-3" }, [
    _c("nav", { staticClass: "navbar navbar-expand-lg" }, [
      _c("div", { staticClass: "container-fluid" }, [
        _c(
          "a",
          {
            staticClass: "burger-btn list-icon-btn d-block",
            attrs: { href: "javascript:void(0)", title: "Toggle Sidebar" },
            on: { click: _vm.toggleSidebar },
          },
          [
            _c(
              "svg",
              {
                staticClass: "lucide lucide-panel-left-icon lucide-panel-left",
                attrs: {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                },
              },
              [
                _c("rect", {
                  attrs: { width: "18", height: "18", x: "3", y: "3", rx: "2" },
                }),
                _c("path", { attrs: { d: "M9 3v18" } }),
              ]
            ),
          ]
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "d-flex justify-content-start align-items-center" },
          [
            _vm.$isDemo == 1 && _vm.windowWidth < this.$mobileWidth
              ? _c("div", { staticClass: "me-2" }, [
                  _c("span", { staticClass: "hdr-demo-badge" }, [
                    _c("span", { staticClass: "hdr-demo-dot" }),
                    _vm._v(_vm._s(_vm.__("demo_mode"))),
                  ]),
                ])
              : _vm._e(),
            _vm._v(" "),
            _c(
              "a",
              {
                staticClass: "navbar-toggler list-icon-btn",
                attrs: {
                  href: "javascript:void(0)",
                  "data-bs-toggle": "collapse",
                  "data-bs-target": "#navbarSupportedContent",
                  "aria-controls": "navbarSupportedContent",
                  "aria-expanded": "false",
                  "aria-label": "Toggle navigation",
                },
                on: {
                  click: function ($event) {
                    _vm.isToggle = !_vm.isToggle
                  },
                },
              },
              [
                _vm.isToggle === true
                  ? _c("span", {
                      domProps: { innerHTML: _vm._s(_vm.navIcon("times")) },
                    })
                  : _c("span", {
                      domProps: {
                        innerHTML: _vm._s(_vm.navIcon("ellipsis-h")),
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
            staticClass: "collapse navbar-collapse",
            attrs: { id: "navbarSupportedContent" },
          },
          [
            _c(
              "div",
              {
                staticClass:
                  "d-flex flex-column flex-lg-row align-items-center justify-content-lg-end w-100 mt-1 mt-lg-0",
              },
              [
                _c(
                  "ul",
                  {
                    staticClass:
                      "navbar-nav mb-2 mb-lg-0 d-flex flex-row flex-wrap align-items-center gap-1",
                  },
                  [
                    _vm.$isDemo == 1 && _vm.windowWidth > this.$mobileWidth
                      ? _c("li", { staticClass: "nav-item dropdown me-2" }, [
                          _c(
                            "div",
                            { staticClass: "d-flex gap-2 align-items-center" },
                            [
                              _c("span", { staticClass: "hdr-demo-badge" }, [
                                _c("span", { staticClass: "hdr-demo-dot" }),
                                _vm._v(_vm._s(_vm.__("demo_mode"))),
                              ]),
                            ]
                          ),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _c("li", { staticClass: "nav-item dropdown me-2" }, [
                      _c(
                        "button",
                        {
                          staticClass: "list-icon-btn",
                          attrs: {
                            type: "button",
                            title:
                              _vm.userTheme === "theme-dark"
                                ? "Switch to light"
                                : "Switch to dark",
                          },
                          on: {
                            click: function ($event) {
                              return _vm.toggleTheme($event)
                            },
                          },
                        },
                        [
                          _vm.userTheme === "theme-dark"
                            ? _c("span", {
                                domProps: {
                                  innerHTML: _vm._s(_vm.navIcon("sun")),
                                },
                              })
                            : _c("span", {
                                domProps: {
                                  innerHTML: _vm._s(_vm.navIcon("moon-stars")),
                                },
                              }),
                        ]
                      ),
                    ]),
                    _vm._v(" "),
                    _c("li", { staticClass: "nav-item dropdown me-2" }, [
                      _c(
                        "div",
                        { staticClass: "d-flex gap-2 align-items-center" },
                        [
                          _c(
                            "button",
                            {
                              ref: "confirmButton",
                              staticClass: "list-icon-btn",
                              attrs: {
                                type: "button",
                                id: "confirmButton",
                                title: "Clear",
                              },
                              on: {
                                click: function ($event) {
                                  _vm.popoverShow = true
                                },
                              },
                            },
                            [
                              _vm.isSystemRefreshing
                                ? _c("b-spinner", {
                                    attrs: { small: "", label: "Spinning" },
                                  })
                                : _c("span", {
                                    domProps: {
                                      innerHTML: _vm._s(_vm.navIcon("refresh")),
                                    },
                                  }),
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "b-modal",
                            {
                              attrs: {
                                id: "cache-confirm-modal",
                                title: _vm.__("are_you_sure"),
                                "hide-footer": "",
                                centered: "",
                              },
                              model: {
                                value: _vm.popoverShow,
                                callback: function ($$v) {
                                  _vm.popoverShow = $$v
                                },
                                expression: "popoverShow",
                              },
                            },
                            [
                              _c("span", [_vm._v("cache:clear")]),
                              _vm._v(",\n                                    "),
                              _c("span", [_vm._v("config:clear")]),
                              _vm._v(",\n                                    "),
                              _c("span", [_vm._v("route:clear")]),
                              _vm._v(",\n                                    "),
                              _c("span", [_vm._v("view:clear")]),
                              _vm._v(" "),
                              _vm.isSystemRefreshing
                                ? _c("b-spinner", {
                                    attrs: { small: "", label: "Spinning" },
                                  })
                                : _vm._e(),
                              _vm._v(" "),
                              _c("hr"),
                              _vm._v(" "),
                              _c(
                                "div",
                                {
                                  staticClass:
                                    "d-flex flex-row justify-content-between align-items-center",
                                },
                                [
                                  _c(
                                    "b-button",
                                    {
                                      attrs: {
                                        size: "sm",
                                        variant: "outline-danger",
                                      },
                                      on: {
                                        click: function ($event) {
                                          _vm.popoverShow = false
                                        },
                                      },
                                    },
                                    [_vm._v(_vm._s(_vm.__("cancel")))]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "b-button",
                                    {
                                      attrs: {
                                        size: "sm",
                                        variant: "primary",
                                        disabled: _vm.isSystemRefreshing,
                                      },
                                      on: { click: _vm.clearCache },
                                    },
                                    [
                                      _vm.isSystemRefreshing
                                        ? _c("b-spinner", {
                                            attrs: {
                                              small: "",
                                              label: "Spinning",
                                            },
                                          })
                                        : _vm._e(),
                                      _vm._v(
                                        "\n                                            " +
                                          _vm._s(_vm.__("ok")) +
                                          "\n                                        "
                                      ),
                                    ],
                                    1
                                  ),
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
                    _vm._v(" "),
                    this.$websiteUrl
                      ? _c("li", { staticClass: "nav-item dropdown me-2" }, [
                          _c(
                            "a",
                            {
                              staticClass: "list-icon-btn",
                              attrs: {
                                href: this.$websiteUrl,
                                target: "__blank",
                              },
                            },
                            [
                              _c("span", {
                                domProps: {
                                  innerHTML: _vm._s(_vm.navIcon("globe-asia")),
                                },
                              }),
                            ]
                          ),
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _c("li", { staticClass: "nav-item dropdown me-1" }, [
                      _c(
                        "a",
                        {
                          staticClass:
                            "list-icon-btn position-relative dropdown-toggle",
                          attrs: {
                            href: "#",
                            "data-bs-toggle": "dropdown",
                            "aria-expanded": "false",
                          },
                        },
                        [
                          _c("span", {
                            domProps: {
                              innerHTML: _vm._s(_vm.navIcon("bell")),
                            },
                          }),
                          _vm._v(" "),
                          _vm.notifications_unread_count > 0
                            ? _c("span", { staticClass: "hdr-dot" }, [
                                _vm._v(
                                  _vm._s(
                                    _vm.notifications_unread_count > 9
                                      ? "9+"
                                      : _vm.notifications_unread_count
                                  )
                                ),
                              ])
                            : _vm._e(),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "ul",
                        {
                          staticClass:
                            "dropdown-menu dropdown-menu-end notification-dropdown p-0",
                          attrs: { "aria-labelledby": "dropdownMenuButton" },
                        },
                        [
                          _c("li", { staticClass: "notif-head" }, [
                            _c("span", { staticClass: "notif-head-title" }, [
                              _vm._v(_vm._s(_vm.__("notifications"))),
                            ]),
                            _vm._v(" "),
                            _vm.notifications_unread_count > 0
                              ? _c("span", { staticClass: "notif-count" }, [
                                  _vm._v(
                                    _vm._s(_vm.notifications_unread_count)
                                  ),
                                ])
                              : _vm._e(),
                          ]),
                          _vm._v(" "),
                          _c(
                            "li",
                            { staticClass: "notif-scroll" },
                            [
                              _vm._l(
                                _vm.notifications.slice(0, 4),
                                function (notification) {
                                  return _c(
                                    "button",
                                    {
                                      staticClass: "notif-item",
                                      class: {
                                        "is-unread": !notification.read_at,
                                      },
                                      attrs: { type: "button" },
                                      on: {
                                        click: function ($event) {
                                          _vm.markAsReadNotification(
                                            notification
                                          )
                                          _vm.handleNotificationClick(
                                            notification
                                          )
                                        },
                                      },
                                    },
                                    [
                                      _c("span", {
                                        staticClass: "notif-icon",
                                        domProps: {
                                          innerHTML: _vm._s(
                                            _vm.navIcon("bell")
                                          ),
                                        },
                                      }),
                                      _vm._v(" "),
                                      _c(
                                        "span",
                                        { staticClass: "notif-body" },
                                        [
                                          _c(
                                            "span",
                                            { staticClass: "notif-text" },
                                            [
                                              _vm._v(
                                                _vm._s(notification.data.text)
                                              ),
                                            ]
                                          ),
                                          _vm._v(" "),
                                          _c(
                                            "span",
                                            { staticClass: "notif-time" },
                                            [
                                              _vm._v(
                                                _vm._s(
                                                  _vm.changeDateTime(
                                                    notification.created_at
                                                  )
                                                )
                                              ),
                                            ]
                                          ),
                                        ]
                                      ),
                                    ]
                                  )
                                }
                              ),
                              _vm._v(" "),
                              _vm.notifications.length == 0
                                ? _c("div", { staticClass: "notif-empty" }, [
                                    _c("span", {
                                      staticStyle: { "font-size": "1.5rem" },
                                      domProps: {
                                        innerHTML: _vm._s(
                                          _vm.navIcon("bell-slash")
                                        ),
                                      },
                                    }),
                                    _vm._v(" "),
                                    _c("span", [
                                      _vm._v(
                                        _vm._s(_vm.__("no_new_notification"))
                                      ),
                                    ]),
                                  ])
                                : _vm._e(),
                            ],
                            2
                          ),
                          _vm._v(" "),
                          _vm.notifications.length > 0
                            ? _c("li", { staticClass: "notif-foot" }, [
                                _vm.isSellerRoute
                                  ? _c(
                                      "button",
                                      {
                                        staticClass: "notif-see-all",
                                        on: {
                                          click: function ($event) {
                                            return _vm.$router.push(
                                              "/seller/notification_panel"
                                            )
                                          },
                                        },
                                      },
                                      [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(
                                              _vm.__("see_all_notifications")
                                            ) +
                                            "\n                                    "
                                        ),
                                      ]
                                    )
                                  : _c(
                                      "button",
                                      {
                                        staticClass: "notif-see-all",
                                        on: {
                                          click: function ($event) {
                                            return _vm.$router.push(
                                              "/notification_panel"
                                            )
                                          },
                                        },
                                      },
                                      [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(
                                              _vm.__("see_all_notifications")
                                            ) +
                                            "\n                                    "
                                        ),
                                      ]
                                    ),
                                _vm._v(" "),
                                _vm.notifications_unread_count > 0
                                  ? _c(
                                      "button",
                                      {
                                        staticClass: "notif-mark-all",
                                        on: { click: _vm.confirmMarkAllAsRead },
                                      },
                                      [
                                        _vm._v(
                                          "\n                                        " +
                                            _vm._s(
                                              _vm.__("read_all_notifications")
                                            ) +
                                            "\n                                    "
                                        ),
                                      ]
                                    )
                                  : _vm._e(),
                              ])
                            : _vm._e(),
                        ]
                      ),
                    ]),
                    _vm._v(" "),
                    _c("li", { staticClass: "nav-item dropdown me-2" }, [
                      _c(
                        "a",
                        {
                          staticClass: "list-icon-btn dropdown-toggle",
                          attrs: {
                            href: "#",
                            "data-bs-toggle": "dropdown",
                            "aria-expanded": "false",
                            title: _vm.__("select_language"),
                          },
                        },
                        [
                          _c("span", {
                            domProps: {
                              innerHTML: _vm._s(_vm.navIcon("language")),
                            },
                          }),
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "ul",
                        {
                          staticClass:
                            "dropdown-menu dropdown-menu-end language-dropdown",
                        },
                        [
                          _c("li", [
                            _c("h6", { staticClass: "dropdown-header" }, [
                              _vm._v(_vm._s(_vm.__("select_language"))),
                            ]),
                          ]),
                          _vm._v(" "),
                          _vm.languages.length === 0
                            ? [
                                _c("li", [
                                  _c(
                                    "a",
                                    {
                                      staticClass:
                                        "dropdown-item d-flex align-items-center justify-content-between active",
                                      attrs: { href: "#" },
                                      on: {
                                        click: function ($event) {
                                          $event.preventDefault()
                                          return _vm.changeLanguage({
                                            target: { value: "en" },
                                          })
                                        },
                                      },
                                    },
                                    [
                                      _vm._v(
                                        "\n                                            English\n                                            "
                                      ),
                                      _c("span", {
                                        domProps: {
                                          innerHTML: _vm._s(
                                            _vm.navIcon("check")
                                          ),
                                        },
                                      }),
                                    ]
                                  ),
                                ]),
                              ]
                            : _vm._l(_vm.languages, function (language) {
                                return _c("li", { key: language.code }, [
                                  _c(
                                    "a",
                                    {
                                      staticClass:
                                        "dropdown-item d-flex align-items-center justify-content-between",
                                      class: {
                                        active: _vm.lang === language.code,
                                      },
                                      attrs: { href: "#" },
                                      on: {
                                        click: function ($event) {
                                          $event.preventDefault()
                                          return _vm.changeLanguage({
                                            target: { value: language.code },
                                          })
                                        },
                                      },
                                    },
                                    [
                                      _vm._v(
                                        "\n                                            " +
                                          _vm._s(language.name) +
                                          "\n                                            "
                                      ),
                                      _vm.lang === language.code
                                        ? _c("span", {
                                            domProps: {
                                              innerHTML: _vm._s(
                                                _vm.navIcon("check")
                                              ),
                                            },
                                          })
                                        : _vm._e(),
                                    ]
                                  ),
                                ])
                              }),
                        ],
                        2
                      ),
                    ]),
                  ]
                ),
                _vm._v(" "),
                _c("div", { staticClass: "dropdown" }, [
                  _c(
                    "a",
                    {
                      staticClass: "user-chip text-decoration-none",
                      attrs: {
                        href: "#",
                        "data-bs-toggle": "dropdown",
                        "aria-expanded": "false",
                      },
                    },
                    [
                      _c("img", {
                        attrs: { src: _vm.profile_url, alt: "profile" },
                      }),
                      _vm._v(" "),
                      _c(
                        "span",
                        {
                          staticClass:
                            "d-none d-lg-flex flex-column text-start",
                        },
                        [
                          _c("span", { staticClass: "user-chip-name" }, [
                            _vm._v(_vm._s(_vm.user.username)),
                          ]),
                          _vm._v(" "),
                          _c("span", { staticClass: "user-chip-role" }, [
                            _vm._v(
                              _vm._s(
                                _vm.role === "Seller"
                                  ? _vm.__("seller")
                                  : _vm.role
                              )
                            ),
                          ]),
                        ]
                      ),
                      _vm._v(" "),
                      _c("span", {
                        staticClass: "hdr-caret d-none d-lg-block",
                        domProps: {
                          innerHTML: _vm._s(_vm.navIcon("chevron-down")),
                        },
                      }),
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "ul",
                    {
                      staticClass:
                        "dropdown-menu dropdown-menu-end user-dropdown-menu",
                      attrs: { "aria-labelledby": "dropdownMenuButton" },
                    },
                    [
                      _c("li", [
                        _c("h6", { staticClass: "dropdown-header" }, [
                          _vm._v(
                            _vm._s(_vm.__("hello")) +
                              ", " +
                              _vm._s(_vm.user.username) +
                              "!"
                          ),
                        ]),
                      ]),
                      _vm._v(" "),
                      _c(
                        "li",
                        [
                          _vm.role == this.$roleSeller
                            ? _c(
                                "router-link",
                                {
                                  staticClass: "dropdown-item",
                                  attrs: { to: "/seller/profile" },
                                },
                                [
                                  _c("span", {
                                    staticClass: "icon-mid me-2",
                                    domProps: {
                                      innerHTML: _vm._s(_vm.navIcon("person")),
                                    },
                                  }),
                                  _vm._v(
                                    " " +
                                      _vm._s(_vm.__("my_profile")) +
                                      "\n                                "
                                  ),
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.role == this.$roleDeliveryBoy
                            ? _c(
                                "router-link",
                                {
                                  staticClass: "dropdown-item",
                                  attrs: { to: "/delivery_boy/profile" },
                                },
                                [
                                  _c("span", {
                                    staticClass: "icon-mid me-2",
                                    domProps: {
                                      innerHTML: _vm._s(_vm.navIcon("person")),
                                    },
                                  }),
                                  _vm._v(
                                    " " +
                                      _vm._s(_vm.__("my_profile")) +
                                      "\n                                "
                                  ),
                                ]
                              )
                            : _vm._e(),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "li",
                        [
                          _vm.role == this.$roleSuperAdmin
                            ? _c(
                                "router-link",
                                {
                                  staticClass: "dropdown-item",
                                  attrs: { to: "/settings" },
                                },
                                [
                                  _c("span", {
                                    staticClass: "icon-mid me-2",
                                    domProps: {
                                      innerHTML: _vm._s(_vm.navIcon("gear")),
                                    },
                                  }),
                                  _vm._v(
                                    " " +
                                      _vm._s(_vm.__("settings")) +
                                      "\n                                "
                                  ),
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.role == this.$roleSeller
                            ? _c(
                                "router-link",
                                {
                                  staticClass: "dropdown-item",
                                  attrs: { to: "/seller/settings" },
                                },
                                [
                                  _c("span", {
                                    staticClass: "icon-mid me-2",
                                    domProps: {
                                      innerHTML: _vm._s(_vm.navIcon("gear")),
                                    },
                                  }),
                                  _vm._v(
                                    " " +
                                      _vm._s(_vm.__("settings")) +
                                      "\n                                "
                                  ),
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _vm.role == this.$roleDeliveryBoy
                            ? _c(
                                "router-link",
                                {
                                  staticClass: "dropdown-item",
                                  attrs: { to: "/delivery_boy/settings" },
                                },
                                [
                                  _c("span", {
                                    staticClass: "icon-mid me-2",
                                    domProps: {
                                      innerHTML: _vm._s(_vm.navIcon("gear")),
                                    },
                                  }),
                                  _vm._v(
                                    " " +
                                      _vm._s(_vm.__("settings")) +
                                      "\n                                "
                                  ),
                                ]
                              )
                            : _vm._e(),
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _vm.role == this.$roleSeller
                        ? _c("li", [
                            _c("div", { staticClass: "dropdown-item" }, [
                              _c(
                                "div",
                                { staticClass: "form-check form-switch fs-6" },
                                [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.sellerStatus,
                                        expression: "sellerStatus",
                                      },
                                    ],
                                    staticClass: "form-check-input me-0",
                                    staticStyle: { cursor: "pointer" },
                                    attrs: {
                                      type: "checkbox",
                                      id: "status",
                                      "true-value": 1,
                                      "false-value": 3,
                                      disabled: _vm.sellerStatusLoading,
                                    },
                                    domProps: {
                                      checked: Array.isArray(_vm.sellerStatus)
                                        ? _vm._i(_vm.sellerStatus, null) > -1
                                        : _vm._q(_vm.sellerStatus, 1),
                                    },
                                    on: {
                                      change: [
                                        function ($event) {
                                          var $$a = _vm.sellerStatus,
                                            $$el = $event.target,
                                            $$c = $$el.checked ? 1 : 3
                                          if (Array.isArray($$a)) {
                                            var $$v = null,
                                              $$i = _vm._i($$a, $$v)
                                            if ($$el.checked) {
                                              $$i < 0 &&
                                                (_vm.sellerStatus = $$a.concat([
                                                  $$v,
                                                ]))
                                            } else {
                                              $$i > -1 &&
                                                (_vm.sellerStatus = $$a
                                                  .slice(0, $$i)
                                                  .concat($$a.slice($$i + 1)))
                                            }
                                          } else {
                                            _vm.sellerStatus = $$c
                                          }
                                        },
                                        _vm.toggleSellerStatus,
                                      ],
                                    },
                                  }),
                                  _vm._v(" "),
                                  _vm.sellerStatus === 1
                                    ? _c(
                                        "label",
                                        { staticClass: "badge bg-success" },
                                        [
                                          _vm._v(
                                            "\n                                            " +
                                              _vm._s(_vm.__("active")) +
                                              "\n                                        "
                                          ),
                                        ]
                                      )
                                    : _c(
                                        "label",
                                        { staticClass: "badge bg-danger" },
                                        [
                                          _vm._v(
                                            "\n                                            " +
                                              _vm._s(_vm.__("deactive")) +
                                              "\n                                        "
                                          ),
                                        ]
                                      ),
                                ]
                              ),
                            ]),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _vm.role == this.$roleDeliveryBoy
                        ? _c("li", [
                            _c("div", { staticClass: "dropdown-item" }, [
                              _c(
                                "div",
                                { staticClass: "form-check form-switch fs-6" },
                                [
                                  _c("input", {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.deliveryBoyStatus,
                                        expression: "deliveryBoyStatus",
                                      },
                                    ],
                                    staticClass: "form-check-input me-0",
                                    staticStyle: { cursor: "pointer" },
                                    attrs: {
                                      type: "checkbox",
                                      id: "status",
                                      "true-value": 1,
                                      "false-value": 3,
                                      disabled: _vm.deliveryBoyStatusLoading,
                                    },
                                    domProps: {
                                      checked: Array.isArray(
                                        _vm.deliveryBoyStatus
                                      )
                                        ? _vm._i(_vm.deliveryBoyStatus, null) >
                                          -1
                                        : _vm._q(_vm.deliveryBoyStatus, 1),
                                    },
                                    on: {
                                      change: [
                                        function ($event) {
                                          var $$a = _vm.deliveryBoyStatus,
                                            $$el = $event.target,
                                            $$c = $$el.checked ? 1 : 3
                                          if (Array.isArray($$a)) {
                                            var $$v = null,
                                              $$i = _vm._i($$a, $$v)
                                            if ($$el.checked) {
                                              $$i < 0 &&
                                                (_vm.deliveryBoyStatus =
                                                  $$a.concat([$$v]))
                                            } else {
                                              $$i > -1 &&
                                                (_vm.deliveryBoyStatus = $$a
                                                  .slice(0, $$i)
                                                  .concat($$a.slice($$i + 1)))
                                            }
                                          } else {
                                            _vm.deliveryBoyStatus = $$c
                                          }
                                        },
                                        _vm.toggleDeliveryBoyStatus,
                                      ],
                                    },
                                  }),
                                  _vm._v(" "),
                                  _vm.deliveryBoyStatus === 1
                                    ? _c(
                                        "label",
                                        { staticClass: "badge bg-success" },
                                        [
                                          _vm._v(
                                            "\n                                            " +
                                              _vm._s(_vm.__("active")) +
                                              "\n                                        "
                                          ),
                                        ]
                                      )
                                    : _c(
                                        "label",
                                        { staticClass: "badge bg-danger" },
                                        [
                                          _vm._v(
                                            "\n                                            " +
                                              _vm._s(_vm.__("deactive")) +
                                              "\n                                        "
                                          ),
                                        ]
                                      ),
                                ]
                              ),
                            ]),
                          ])
                        : _vm._e(),
                      _vm._v(" "),
                      _vm._m(0),
                      _vm._v(" "),
                      _c("li", [
                        _c(
                          "a",
                          {
                            staticClass: "dropdown-item",
                            on: {
                              click: function ($event) {
                                return _vm.logout()
                              },
                            },
                          },
                          [
                            _c("span", {
                              staticClass: "icon-mid me-2",
                              domProps: {
                                innerHTML: _vm._s(
                                  _vm.navIcon("box-arrow-left")
                                ),
                              },
                            }),
                            _vm._v(_vm._s(_vm.__("logout"))),
                          ]
                        ),
                      ]),
                    ]
                  ),
                ]),
              ]
            ),
          ]
        ),
      ]),
    ]),
  ])
}
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", [_c("hr", { staticClass: "dropdown-divider" })])
  },
]
render._withStripped = true



/***/ })

}]);