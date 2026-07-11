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
                    <p class="auth-subtitle text-primary">Please login to your Driver Account</p>
                    <form @submit.prevent="loginCheck()">
                        <div v-if="!otpSent">
                            <div class="form-group mb-4 d-flex">
                                <input type="text" class="form-control form-control-xl" placeholder="+91" style="width: 90px; margin-right: 10px;" required v-model="countryCode">
                                <input type="text" class="form-control form-control-xl" placeholder="Mobile Number" required v-model="user.mobile">
                            </div>
                            <button type="button" class="btn btn-primary btn-block btn-lg shadow-lg mt-3 auth-btn" @click="sendOtp()">
                                Send OTP
                                <b-spinner v-if="isSendingOtp" small label="Spinning"></b-spinner>
                                <span v-else class="bi bi-chat-left-text"></span>
                            </button>
                        </div>
                        <div v-else>
                            <div class="form-group position-relative has-icon-left mb-4">
                                <input type="text" class="form-control form-control-xl" placeholder="Enter OTP" required v-model="user.otp">
                                <div class="form-control-icon">
                                    <i class="bi bi-shield-lock"></i>
                                </div>
                            </div>
                            <button class="btn btn-primary btn-block btn-lg shadow-lg mt-3 auth-btn">
                                Verify & Login
                                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                                <span v-else class="bi bi-arrow-right"></span>
                            </button>
                            <div class="mb-4 text-center mt-3">
                                <a href="javascript:void(0)" class="font-bold" @click="otpSent = false"><span>Change Mobile Number</span></a>
                            </div>
                        </div>
                    </form>

                    <router-link to="/delivery_boy/register" class="btn btn-primary btn-block btn-lg shadow-lg mt-2 auth-btn">
                        Register
                    </router-link>
                    <router-link to="/login" class="btn btn-primary btn-block btn-lg shadow-lg mt-5 auth-btn">
                        Admin Panel
                    </router-link>

                    <div class="auth-copyright">
                        <a href="javascript:void(0)" class="text-primary font-weight-normal"> {{ $copyrightDetails }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Auth from '../../Auth.js';

export default {
    data: function () {
        return {
            isLoading: false,
            isSendingOtp: false,
            otpSent: false,
            countryCode: '+91',
            user: {
                mobile: '',
                otp: '',
                phone_auth_type: 'phone_auth_otp',
                type: 4
            },
            loggedUser: Auth.user
        };
    },
    mounted() {
        if (this.loggedUser) {
            this.$router.push('/delivery_boy');
        }
    },
    methods: {
        sendOtp: function () {
            if (!this.user.mobile) {
                this.showError("Please enter your mobile number");
                return;
            }
            this.isSendingOtp = true;
            let url = this.$apiUrl + '/delivery_boy/send_sms';
            let fullPhone = this.countryCode + this.user.mobile;
            axios.post(url, { phone: fullPhone }).then(res => {
                this.isSendingOtp = false;
                let data = res.data;
                if (data.status === 1) {
                    this.otpSent = true;
                    this.showMessage('success', "OTP sent successfully!");
                } else {
                    this.showError(data.message);
                }
            }).catch(error => {
                this.isSendingOtp = false;
                let errorMsg = error.response && error.response.data && error.response.data.message 
                    ? error.response.data.message 
                    : (error.message || "Failed to send OTP. Please try again.");
                this.showError(errorMsg);
            });
        },
        loginCheck: function () {
            let vm = this;
            this.isLoading = true;

            let url = this.$apiUrl + '/login';
            
            // Pass country_code and mobile along with other user payload
            const payload = {
                ...this.user,
                country_code: this.countryCode
            };

            axios.post(url, payload).then(res => {
                vm.isLoading = false;
                let data = res.data;
                if (data.status === 1) {
                    Auth.login(data.data.access_token, data.data.user);
                    this.$router.push('/delivery_boy');
                } else {
                    vm.showError(data.message);
                }
            }).catch(error => {
                vm.isLoading = false;
                if (error.response && error.response.data && error.response.data.message) {
                    this.showError(error.response.data.message);
                } else if (error.message) {
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
