<template>
    <div class="auth" :style="{ backgroundImage: 'url('+ $panelLoginBackgroundImg + ')' }">
        <div class="login-wrapper">
            <div class="auth-section">
                <div class="auth-card">
                    <div class="auth-logo">
                        <a href="javascript:void(0)" style="display: flex; align-items: center; justify-content: flex-start;">
                            <img v-if="$appLogo != ''" :src="$storageUrl+$appLogo" style="height: 70px; width: 70px;" alt='Logo'/>
                            <img v-else :src="$baseUrl + '/images/logo.png'" style="height: 70px; width: 70px;" alt='Logo'/>
                            <h2 style="margin: 10px;">{{ $appName }}</h2>
                        </a>
                    </div>
                    <h4>Welcome Back!</h4>
                    <p class="auth-subtitle text-primary">Please login to your Distributor Account</p>
                    <form @submit.prevent="loginCheck()">
                        <div class="form-group position-relative has-icon-left mb-4">
                            <input type="email" class="form-control form-control-xl" placeholder="Email Address" required
                                   v-model="user.email">
                            <div class="form-control-icon">
                                <i class="bi bi-person"></i>
                            </div>
                        </div>
                        <div class="form-group position-relative has-icon-left">
                            <input :type="showPassword ? 'text' : 'password'" class="form-control form-control-xl" placeholder="Password" required
                                   v-model="user.password">
                            <div class="form-control-icon">
                                <i class="bi bi-shield-lock"></i>
                            </div>
                            <button type="button" v-on:click="showPassword = !showPassword"
                                    class="btn btn-sm btn-outline-light font-bold text-primary"
                                    style="margin-top: -45px;position: absolute; right: 10px; cursor: pointer;">
                                <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                            </button>
                        </div>
                        <div class="mb-4 text-end" style="margin-top: 35px;">
                            <router-link class="font-bold" to="/forgot-password"><span>Forgot Password?</span></router-link>
                        </div>

                        <button class="btn btn-primary btn-block btn-lg shadow-lg mt-5 auth-btn">
                            Login
                            <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                            <span v-else class="bi bi-arrow-right"></span>
                        </button>
                    </form>


                        <router-link to="/login" class="btn btn-primary btn-block btn-lg shadow-lg mt-5 auth-btn">
                            Admin Panel
                        </router-link>

                    <div class="auth-copyright">
                        <a href="javascript:void(0)" class="text-primary font-weight-normal"> {{ $copyrightDetails }}</a>
                    </div>
                </div>
            </div>
        </div>

        <b-modal v-model="showSubscriptionModal" :title="__('subscription_plan')" size="lg" hide-footer centered>
            <div class="alert alert-warning py-2 px-3 mb-3">
                <i class="fa fa-exclamation-triangle me-1"></i>
                {{ subscriptionMessage }}
            </div>
            <div class="row" v-if="subscriptionPlans.length">
                <div class="col-md-6 mb-3" v-for="plan in subscriptionPlans" :key="plan.id">
                    <div class="card h-100 border">
                        <div class="card-body">
                            <h5 class="card-title font-weight-bold">{{ plan.name }}</h5>
                            <p class="text-muted small mb-2">{{ plan.description }}</p>
                            <p class="mb-1">
                                <span class="h4 font-weight-bold">{{ $currency }} {{ plan.discounted_price || plan.price }}</span>
                                <s v-if="plan.discounted_price" class="text-muted ms-2">{{ $currency }} {{ plan.price }}</s>
                            </p>
                            <p class="small text-muted mb-0">
                                {{ plan.duration_type === 'limited' ? plan.duration_days + ' ' + __('days') : __('unlimited') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <p v-else class="text-muted text-center">{{ __('no_records_to_show') }}</p>
            <p class="text-center text-muted small mt-2">{{ __('contact_admin_to_subscribe') }}</p>
            <div class="text-center mt-3">
                <b-button variant="secondary" @click="showSubscriptionModal = false">{{ __('ok') }}</b-button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios';
import Auth from '../../Auth.js';

export default {
    data: function () {
        return {
            isLoading: false,
            user: {
                email: (this.$isDemo === 1 || this.$isDemo === '1') ? 'seller@gmail.com' : '',
                password: (this.$isDemo === 1 || this.$isDemo === '1') ? '123456' : '',
                type:3
            },
            showPassword: false,
            loggedUser: Auth.user,
            setting:"",
            showSubscriptionModal: false,
            subscriptionMessage: '',
            subscriptionPlans: [],
        };
    },
    mounted() {
        if (this.loggedUser) {
            this.$router.push('/seller/login');
        }
    },
    methods: {

        loginCheck: function () {
            let vm = this;
            this.isLoading = true;

            let url = this.$apiUrl + '/login';
            axios.post(url, this.user).then(res => {
                vm.isLoading = false;
                let data = res.data;
                if (data.status === 1) {
                    Auth.login(data.data.access_token, data.data.user);
                    this.$router.push('/seller');
                    if (data.data.subscription_warning) {
                        vm.subscriptionMessage = data.data.subscription_warning;
                        vm.subscriptionPlans = data.data.subscription_plans || [];
                        vm.showSubscriptionModal = true;
                    }
                } else {
                    vm.showError(data.message);
                }
            }).catch(error => {
                vm.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                }else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }

            });
        }
    }
}
</script>
<style scoped>

</style>
