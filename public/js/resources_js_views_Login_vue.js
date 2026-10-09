"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["resources_js_views_Login_vue"],{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Login.vue?vue&type=script&lang=js":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Login.vue?vue&type=script&lang=js ***!
  \******************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Auth_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Auth.js */ "./resources/js/Auth.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  components: {},
  data: function data() {
    return {
      isLoading: false,
      user: {
        email: this.$isDemo === 1 || this.$isDemo === '1' ? 'admin@gmail.com' : '',
        password: this.$isDemo === 1 || this.$isDemo === '1' ? '123456' : '',
        type: 1
      },
      showPassword: false,
      loggedUser: _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].user,
      setting: "",
      copyrightDetails: window.copyrightDetails,
      showSubscriptionModal: false,
      subscriptionMessage: '',
      subscriptionPlans: [],
      isDistributorHost: window.location.hostname.startsWith('distributor.'),
      // Super Admin two-factor step (only shown when the server asks for it)
      twoFactor: {
        required: false,
        token: '',
        email: '',
        otp: '',
        countdown: 0
      },
      twoFactorTimer: null
    };
  },
  beforeDestroy: function beforeDestroy() {
    this.stopTwoFactorTimer();
  },
  mounted: function mounted() {
    if (this.loggedUser) {
      this.$router.push('/dashboard');
    } else {
      this.$router.push('/login')["catch"](function () {});
    }
    var user_theme = sessionStorage.getItem("user-theme");
    this.userTheme = user_theme;
    document.body.className = user_theme;
  },
  methods: {
    loginCheck: function loginCheck() {
      var _this = this;
      var vm = this;
      this.isLoading = true;
      var url = this.$apiUrl + '/login';
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(url, this.user).then(function (res) {
        vm.isLoading = false;
        var data = res.data;
        if (data.status === 1) {
          // Super Admin with two-factor on: no session yet, a code was emailed.
          if (data.data.two_factor_required) {
            vm.startTwoFactor(data.data);
            return;
          }
          vm.finishLogin(data);
        } else {
          vm.showError(data.message);
        }
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
    // Everything that happens once the server has handed back a user + access token.
    finishLogin: function finishLogin(data) {
      var vm = this;
      // Sarthi: this admin-domain login form must not accept a distributor
      // login — currently nothing stops it, only the post-login router
      // redirect confines a seller-role user to their own pages. Block it
      // here directly so distributors are told to use the Distributor Panel
      // URL instead of silently landing on the same panel from this domain.
      if (!this.isDistributorHost && data.data.user.role_id === 3) {
        vm.showError('Distributors must log in via the Distributor Panel.');
        return;
      }
      _Auth_js__WEBPACK_IMPORTED_MODULE_1__["default"].login(data.data.access_token, data.data.user);
      this.$router.push('/dashboard');
      if (data.data.subscription_warning) {
        vm.subscriptionMessage = data.data.subscription_warning;
        vm.subscriptionPlans = data.data.subscription_plans || [];
        vm.showSubscriptionModal = true;
      }
    },
    startTwoFactor: function startTwoFactor(info) {
      var _this2 = this;
      this.twoFactor = {
        required: true,
        token: info.two_factor_token,
        email: info.email,
        otp: '',
        countdown: info.resend_after || 60
      };
      this.startTwoFactorTimer();
      this.$nextTick(function () {
        if (_this2.$refs.otpInput) _this2.$refs.otpInput.focus();
      });
    },
    startTwoFactorTimer: function startTwoFactorTimer() {
      var _this3 = this;
      this.stopTwoFactorTimer();
      this.twoFactorTimer = setInterval(function () {
        if (_this3.twoFactor.countdown > 0) {
          _this3.twoFactor.countdown--;
        } else {
          _this3.stopTwoFactorTimer();
        }
      }, 1000);
    },
    stopTwoFactorTimer: function stopTwoFactorTimer() {
      if (this.twoFactorTimer) {
        clearInterval(this.twoFactorTimer);
        this.twoFactorTimer = null;
      }
    },
    verifyTwoFactor: function verifyTwoFactor() {
      var vm = this;
      this.isLoading = true;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + '/login/two-factor/verify', {
        two_factor_token: this.twoFactor.token,
        otp: this.twoFactor.otp
      }).then(function (res) {
        vm.isLoading = false;
        var data = res.data;
        if (data.status === 1) {
          vm.stopTwoFactorTimer();
          vm.twoFactor = {
            required: false,
            token: '',
            email: '',
            otp: '',
            countdown: 0
          };
          vm.finishLogin(data);
        } else {
          vm.twoFactor.otp = '';
          vm.showError(data.message);
          vm.$nextTick(function () {
            if (vm.$refs.otpInput) vm.$refs.otpInput.focus();
          });
        }
      })["catch"](function (error) {
        vm.isLoading = false;
        vm.showError(error.response && error.response.data && error.response.data.message || error.message || "Something went wrong!");
      });
    },
    resendTwoFactor: function resendTwoFactor() {
      var vm = this;
      axios__WEBPACK_IMPORTED_MODULE_0___default().post(this.$apiUrl + '/login/two-factor/resend', {
        two_factor_token: this.twoFactor.token
      }).then(function (res) {
        var data = res.data;
        if (data.status === 1) {
          vm.twoFactor.otp = '';
          vm.twoFactor.countdown = data.data.resend_after || 60;
          vm.startTwoFactorTimer();
          vm.showMessage('success', __('verification_code_sent'));
        } else {
          vm.showError(data.message);
        }
      })["catch"](function (error) {
        vm.showError(error.response && error.response.data && error.response.data.message || error.message || "Something went wrong!");
      });
    },
    backToLogin: function backToLogin() {
      this.stopTwoFactorTimer();
      this.twoFactor = {
        required: false,
        token: '',
        email: '',
        otp: '',
        countdown: 0
      };
      this.user.password = this.$isDemo === 1 || this.$isDemo === '1' ? '123456' : '';
    }
  }
});

/***/ }),

/***/ "./resources/js/views/Login.vue":
/*!**************************************!*\
  !*** ./resources/js/views/Login.vue ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Login_vue_vue_type_template_id_12f5395a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Login.vue?vue&type=template&id=12f5395a&scoped=true */ "./resources/js/views/Login.vue?vue&type=template&id=12f5395a&scoped=true");
/* harmony import */ var _Login_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Login.vue?vue&type=script&lang=js */ "./resources/js/views/Login.vue?vue&type=script&lang=js");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Login_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  _Login_vue_vue_type_template_id_12f5395a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render,
  _Login_vue_vue_type_template_id_12f5395a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  "12f5395a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Login.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./resources/js/views/Login.vue?vue&type=script&lang=js":
/*!**************************************************************!*\
  !*** ./resources/js/views/Login.vue?vue&type=script&lang=js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Login.vue?vue&type=script&lang=js */ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-5.use[0]!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Login.vue?vue&type=script&lang=js");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_5_use_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/views/Login.vue?vue&type=template&id=12f5395a&scoped=true":
/*!********************************************************************************!*\
  !*** ./resources/js/views/Login.vue?vue&type=template&id=12f5395a&scoped=true ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   render: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_template_id_12f5395a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.render),
/* harmony export */   staticRenderFns: () => (/* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_template_id_12f5395a_scoped_true__WEBPACK_IMPORTED_MODULE_0__.staticRenderFns)
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Login_vue_vue_type_template_id_12f5395a_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Login.vue?vue&type=template&id=12f5395a&scoped=true */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Login.vue?vue&type=template&id=12f5395a&scoped=true");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Login.vue?vue&type=template&id=12f5395a&scoped=true":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./resources/js/views/Login.vue?vue&type=template&id=12f5395a&scoped=true ***!
  \***********************************************************************************************************************************************************************************************************************/
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
    {
      staticClass: "auth",
      style: { backgroundImage: "url(" + _vm.$panelLoginBackgroundImg + ")" },
    },
    [
      _c("div", { staticClass: "login-wrapper" }, [
        _c("div", { staticClass: "auth-section" }, [
          _c("div", { staticClass: "auth-card" }, [
            _c("div", { staticClass: "auth-logo" }, [
              _c(
                "a",
                {
                  staticStyle: {
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "flex-start",
                  },
                  attrs: { href: "javascript:void(0)" },
                },
                [
                  _vm.$appLogo != ""
                    ? _c("img", {
                        staticStyle: { height: "70px", width: "70px" },
                        attrs: {
                          src: _vm.$storageUrl + _vm.$appLogo,
                          alt: "Logo",
                        },
                      })
                    : _c("img", {
                        staticStyle: { height: "70px", width: "70px" },
                        attrs: {
                          src: _vm.$baseUrl + "/images/logo.png",
                          alt: "Logo",
                        },
                      }),
                  _vm._v(" "),
                  _c("h2", { staticStyle: { margin: "10px" } }, [
                    _vm._v(_vm._s(_vm.$appName)),
                  ]),
                ]
              ),
            ]),
            _vm._v(" "),
            _c("h4", [
              _vm._v(
                _vm._s(
                  _vm.twoFactor.required
                    ? _vm.__("verify_its_you")
                    : "Welcome Back!"
                )
              ),
            ]),
            _vm._v(" "),
            _c(
              "p",
              { staticClass: "auth-subtitle text-primary" },
              [
                _vm.twoFactor.required
                  ? [
                      _vm._v(_vm._s(_vm.__("enter_the_code_sent_to")) + " "),
                      _c("strong", [_vm._v(_vm._s(_vm.twoFactor.email))]),
                    ]
                  : [_vm._v("Please login to your Account")],
              ],
              2
            ),
            _vm._v(" "),
            _vm.twoFactor.required
              ? _c(
                  "form",
                  {
                    on: {
                      submit: function ($event) {
                        $event.preventDefault()
                        return _vm.verifyTwoFactor()
                      },
                    },
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass:
                          "form-group position-relative has-icon-left mb-4",
                      },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.twoFactor.otp,
                              expression: "twoFactor.otp",
                            },
                          ],
                          ref: "otpInput",
                          staticClass:
                            "form-control form-control-xl text-center",
                          staticStyle: {
                            "letter-spacing": "8px",
                            "font-size": "22px",
                          },
                          attrs: {
                            type: "text",
                            inputmode: "numeric",
                            autocomplete: "one-time-code",
                            maxlength: "6",
                            placeholder: _vm.__("verification_code"),
                            required: "",
                          },
                          domProps: { value: _vm.twoFactor.otp },
                          on: {
                            input: [
                              function ($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.$set(
                                  _vm.twoFactor,
                                  "otp",
                                  $event.target.value
                                )
                              },
                              function ($event) {
                                _vm.twoFactor.otp = _vm.twoFactor.otp.replace(
                                  /\D/g,
                                  ""
                                )
                              },
                            ],
                          },
                        }),
                        _vm._v(" "),
                        _vm._m(0),
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass:
                          "btn btn-primary btn-block btn-lg shadow-lg mt-3 auth-btn",
                        attrs: {
                          disabled:
                            _vm.isLoading || _vm.twoFactor.otp.length !== 6,
                        },
                      },
                      [
                        _vm._v(
                          "\n                        " +
                            _vm._s(_vm.__("verify_and_login")) +
                            "\n                        "
                        ),
                        _vm.isLoading
                          ? _c("b-spinner", {
                              attrs: { small: "", label: "Spinning" },
                            })
                          : _c("span", { staticClass: "bi bi-arrow-right" }),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass:
                          "d-flex justify-content-between align-items-center mt-4",
                      },
                      [
                        _c(
                          "a",
                          {
                            staticClass: "font-bold",
                            attrs: { href: "javascript:void(0)" },
                            on: { click: _vm.backToLogin },
                          },
                          [
                            _c("span", { staticClass: "bi bi-arrow-left" }),
                            _vm._v(
                              " " +
                                _vm._s(_vm.__("back_to_login")) +
                                "\n                        "
                            ),
                          ]
                        ),
                        _vm._v(" "),
                        _vm.twoFactor.countdown <= 0
                          ? _c(
                              "a",
                              {
                                staticClass: "font-bold",
                                attrs: { href: "javascript:void(0)" },
                                on: { click: _vm.resendTwoFactor },
                              },
                              [_vm._v(_vm._s(_vm.__("resend_code")))]
                            )
                          : _c("span", { staticClass: "text-muted" }, [
                              _vm._v(
                                _vm._s(_vm.__("resend_code_in")) +
                                  " " +
                                  _vm._s(_vm.twoFactor.countdown) +
                                  "s"
                              ),
                            ]),
                      ]
                    ),
                  ]
                )
              : _c(
                  "form",
                  {
                    on: {
                      submit: function ($event) {
                        $event.preventDefault()
                        return _vm.loginCheck()
                      },
                    },
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass:
                          "form-group position-relative has-icon-left mb-4",
                      },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.user.email,
                              expression: "user.email",
                            },
                          ],
                          staticClass: "form-control form-control-xl",
                          attrs: {
                            type: "email",
                            placeholder: "Email Address",
                            required: "",
                          },
                          domProps: { value: _vm.user.email },
                          on: {
                            input: function ($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(_vm.user, "email", $event.target.value)
                            },
                          },
                        }),
                        _vm._v(" "),
                        _vm._m(1),
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass:
                          "form-group position-relative has-icon-left",
                      },
                      [
                        (_vm.showPassword ? "text" : "password") === "checkbox"
                          ? _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.user.password,
                                  expression: "user.password",
                                },
                              ],
                              staticClass: "form-control form-control-xl",
                              attrs: {
                                placeholder: "Password",
                                required: "",
                                type: "checkbox",
                              },
                              domProps: {
                                checked: Array.isArray(_vm.user.password)
                                  ? _vm._i(_vm.user.password, null) > -1
                                  : _vm.user.password,
                              },
                              on: {
                                change: function ($event) {
                                  var $$a = _vm.user.password,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v)
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        _vm.$set(
                                          _vm.user,
                                          "password",
                                          $$a.concat([$$v])
                                        )
                                    } else {
                                      $$i > -1 &&
                                        _vm.$set(
                                          _vm.user,
                                          "password",
                                          $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1))
                                        )
                                    }
                                  } else {
                                    _vm.$set(_vm.user, "password", $$c)
                                  }
                                },
                              },
                            })
                          : (_vm.showPassword ? "text" : "password") === "radio"
                          ? _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.user.password,
                                  expression: "user.password",
                                },
                              ],
                              staticClass: "form-control form-control-xl",
                              attrs: {
                                placeholder: "Password",
                                required: "",
                                type: "radio",
                              },
                              domProps: {
                                checked: _vm._q(_vm.user.password, null),
                              },
                              on: {
                                change: function ($event) {
                                  return _vm.$set(_vm.user, "password", null)
                                },
                              },
                            })
                          : _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.user.password,
                                  expression: "user.password",
                                },
                              ],
                              staticClass: "form-control form-control-xl",
                              attrs: {
                                placeholder: "Password",
                                required: "",
                                type: _vm.showPassword ? "text" : "password",
                              },
                              domProps: { value: _vm.user.password },
                              on: {
                                input: function ($event) {
                                  if ($event.target.composing) {
                                    return
                                  }
                                  _vm.$set(
                                    _vm.user,
                                    "password",
                                    $event.target.value
                                  )
                                },
                              },
                            }),
                        _vm._v(" "),
                        _vm._m(2),
                        _vm._v(" "),
                        _c(
                          "button",
                          {
                            staticClass:
                              "btn btn-sm btn-outline-light font-bold text-primary",
                            staticStyle: {
                              "margin-top": "-45px",
                              position: "absolute",
                              right: "10px",
                              cursor: "pointer",
                            },
                            attrs: { type: "button" },
                            on: {
                              click: function ($event) {
                                _vm.showPassword = !_vm.showPassword
                              },
                            },
                          },
                          [
                            _c("i", {
                              class: _vm.showPassword
                                ? "bi bi-eye"
                                : "bi bi-eye-slash",
                            }),
                          ]
                        ),
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass: "mb-4 text-end",
                        staticStyle: { "margin-top": "35px" },
                      },
                      [
                        _c(
                          "router-link",
                          {
                            staticClass: "font-bold",
                            attrs: { to: "/forgot-password" },
                          },
                          [
                            _c("span", [
                              _vm._v(
                                "Forgot\n                                Password?"
                              ),
                            ]),
                          ]
                        ),
                      ],
                      1
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass:
                          "btn btn-primary btn-block btn-lg shadow-lg mt-5 auth-btn",
                      },
                      [
                        _vm._v(
                          "\n                        Login\n                        "
                        ),
                        _vm.isLoading
                          ? _c("b-spinner", {
                              attrs: { small: "", label: "Spinning" },
                            })
                          : _c("span", { staticClass: "bi bi-arrow-right" }),
                      ],
                      1
                    ),
                  ]
                ),
            _vm._v(" "),
            _c("div", { staticClass: "auth-copyright" }, [
              _c("a", {
                staticClass: "text-primary font-weight-normal",
                attrs: { href: "javascript:void(0)" },
                domProps: { innerHTML: _vm._s(_vm.copyrightDetails) },
              }),
            ]),
          ]),
        ]),
      ]),
      _vm._v(" "),
      _c(
        "b-modal",
        {
          attrs: {
            title: _vm.__("subscription_plan"),
            size: "lg",
            "hide-footer": "",
            centered: "",
          },
          model: {
            value: _vm.showSubscriptionModal,
            callback: function ($$v) {
              _vm.showSubscriptionModal = $$v
            },
            expression: "showSubscriptionModal",
          },
        },
        [
          _c("div", { staticClass: "alert alert-warning py-2 px-3 mb-3" }, [
            _c("i", { staticClass: "fa fa-exclamation-triangle me-1" }),
            _vm._v(
              "\n            " + _vm._s(_vm.subscriptionMessage) + "\n        "
            ),
          ]),
          _vm._v(" "),
          _vm.subscriptionPlans.length
            ? _c(
                "div",
                { staticClass: "row" },
                _vm._l(_vm.subscriptionPlans, function (plan) {
                  return _c(
                    "div",
                    { key: plan.id, staticClass: "col-md-6 mb-3" },
                    [
                      _c("div", { staticClass: "card h-100 border" }, [
                        _c("div", { staticClass: "card-body" }, [
                          _c(
                            "h5",
                            { staticClass: "card-title font-weight-bold" },
                            [_vm._v(_vm._s(plan.name))]
                          ),
                          _vm._v(" "),
                          _c("p", { staticClass: "text-muted small mb-2" }, [
                            _vm._v(_vm._s(plan.description)),
                          ]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mb-1" }, [
                            _c("span", { staticClass: "h4 font-weight-bold" }, [
                              _vm._v(
                                _vm._s(_vm.$currency) +
                                  " " +
                                  _vm._s(plan.discounted_price || plan.price)
                              ),
                            ]),
                            _vm._v(" "),
                            plan.discounted_price
                              ? _c("s", { staticClass: "text-muted ms-2" }, [
                                  _vm._v(
                                    _vm._s(_vm.$currency) +
                                      " " +
                                      _vm._s(plan.price)
                                  ),
                                ])
                              : _vm._e(),
                          ]),
                          _vm._v(" "),
                          _c("p", { staticClass: "small text-muted mb-0" }, [
                            _vm._v(
                              "\n                            " +
                                _vm._s(
                                  plan.duration_type === "limited"
                                    ? plan.duration_days + " " + _vm.__("days")
                                    : _vm.__("unlimited")
                                ) +
                                "\n                        "
                            ),
                          ]),
                        ]),
                      ]),
                    ]
                  )
                }),
                0
              )
            : _c("p", { staticClass: "text-muted text-center" }, [
                _vm._v(_vm._s(_vm.__("no_records_to_show"))),
              ]),
          _vm._v(" "),
          _c("p", { staticClass: "text-center text-muted small mt-2" }, [
            _vm._v(_vm._s(_vm.__("contact_admin_to_subscribe"))),
          ]),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "text-center mt-3" },
            [
              _c(
                "b-button",
                {
                  attrs: { variant: "secondary" },
                  on: {
                    click: function ($event) {
                      _vm.showSubscriptionModal = false
                    },
                  },
                },
                [_vm._v(_vm._s(_vm.__("ok")))]
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
var staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-control-icon" }, [
      _c("i", { staticClass: "bi bi-shield-lock" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-control-icon" }, [
      _c("i", { staticClass: "bi bi-person" }),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "form-control-icon" }, [
      _c("i", { staticClass: "bi bi-shield-lock" }),
    ])
  },
]
render._withStripped = true



/***/ })

}]);