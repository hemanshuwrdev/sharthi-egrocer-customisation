<template>
    <div>
        <div class="page-heading">
            <div class="page-title">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>{{ __('sms_gateways_methods_settings') }}</h3>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><router-link to="/dashboard">{{ __('dashboard') }}</router-link></li>
                            <li class="breadcrumb-item active" aria-current="page">{{ __('sms_gateways_methods_settings') }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
            <section class="section">
                <form id="sms_method_settings_form" method="post" enctype="multipart/form-data" @submit.prevent="saveRecord">
                    <div class="row">
                        <div class="col-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h4 class="card-title">{{ __('twilio') }}</h4>
                                    <a href="https://console.twilio.com/" target="_blank" rel="noopener" class="small text-muted">
                                        <i class="fa fa-external-link" aria-hidden="true"></i> {{ __('setup_sms_gateway_hint') }}
                                    </a>
                                </div>
                                <div class="card-body">
                                    <input type="hidden" id="sms_method_settings" v-model="sms_settings.sms_method_settings" name="sms_method_settings" required="" value="1" aria-required="true">
                                    <div class="">
                                        <div class="form-group">
                                            <label for="twilio_method">{{ __('twilio') }} <small>[ {{ __('enable') }} / {{ __('disable') }} ] </small></label><br>
                                            <div class='form-check form-switch'>
                                                <input class='form-check-input' id="sms_settings" type='checkbox' true-value="1" false-value="0" v-model="sms_settings.twilio_method" :checked="sms_settings.twilio_method" @change="toggleGateway('twilio', $event.target.checked)">
                                            </div>
                                        </div>
                                        <div class="row" v-if="sms_settings.twilio_method == 1">
                               
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="twilio_sid">{{ __('twilio_sid') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="twilio_sid" id="twilio_sid" v-model="sms_settings.twilio_sid" placeholder="Enter twilio sid.">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="twilio_auth_token">{{ __('twilio_auth_token') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="authDomain" id="authDomain" v-model="sms_settings.twilio_auth_token" placeholder="Enter twilio auth token.">
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="twilio_phone_number">{{ __('twilio_phone_number') }}<span class="text-danger text-xs">*</span></label>
                                        <input type="text" class="form-control" name="twilio_phone_number" id="twilio_phone_number" v-model="sms_settings.twilio_phone_number" placeholder="Enter twilio phone number.">
                                    </div>
                                </div>

                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h4 class="card-title">{{ __('msg91') }}</h4>
                                    <a href="https://control.msg91.com/" target="_blank" rel="noopener" class="small text-muted">
                                        <i class="fa fa-external-link" aria-hidden="true"></i> {{ __('setup_sms_gateway_hint') }}
                                    </a>
                                </div>
                                <div class="card-body">
                                    <div class="">
                                        <div class="form-group">
                                            <label for="msg91_method">{{ __('msg91') }} <small>[ {{ __('enable') }} / {{ __('disable') }} ] </small></label><br>
                                            <div class='form-check form-switch'>
                                                <input class='form-check-input' id="msg91_settings" type='checkbox' true-value="1" false-value="0" v-model="sms_settings.msg91_method" :checked="sms_settings.msg91_method" @change="toggleGateway('msg91', $event.target.checked)">
                                            </div>
                                        </div>
                                        <div class="row" v-if="sms_settings.msg91_method == 1">
                                            <div class="col-md-12">
                                                <div class="form-group">
                                                    <label for="msg91_auth_key">{{ __('msg91_auth_key') }}<span class="text-danger text-xs">*</span></label>
                                                    <input type="text" class="form-control" name="msg91_auth_key" id="msg91_auth_key" v-model="sms_settings.msg91_auth_key" placeholder="Enter MSG91 Auth Key">
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="msg91_sender_id">{{ __('msg91_sender_id') }}<span class="text-danger text-xs">*</span></label>
                                                    <input type="text" class="form-control" name="msg91_sender_id" id="msg91_sender_id" v-model="sms_settings.msg91_sender_id" placeholder="Enter MSG91 Sender ID (DLT Header)">
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="msg91_otp_template_id">{{ __('msg91_otp_template_id') }}<span class="text-danger text-xs">*</span></label>
                                                    <input type="text" class="form-control" name="msg91_otp_template_id" id="msg91_otp_template_id" v-model="sms_settings.msg91_otp_template_id" placeholder="Enter MSG91 OTP Template / Flow ID">
                                                </div>
                                            </div>

                                            <div class="col-md-12">
                                                <p class="text-muted small mb-0">{{ __('msg91_dlt_hint') }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <b-button type="submit" id="btn_update" variant="primary" :disabled="isLoading" v-if="$can('manage_payment_methods') || $can('manage_sms_settings')"> {{ __('update') }}
                                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                            </b-button>
                        </div>

                    </div>
                </form>
            </section>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data: function () {
        return {
            isLoading:false,
            sms_settings: {
                sms_method_settings: 0,
                sms_gateway: 'twilio',
                twilio_method: 0,
                twilio_sid: '',
                twilio_auth_token:'',
                twilio_phone_number:'',
                msg91_method: 0,
                msg91_auth_key: '',
                msg91_sender_id: '',
                msg91_otp_template_id: ''
            },
            record: null
        }
    },
    created: function () {
        this.getSmsMethods()
    },
    methods: {
        toggleGateway(key, enabled) {
            if (enabled) {
                if (key === 'msg91') {
                    this.sms_settings.msg91_method = 1;
                    this.sms_settings.twilio_method = 0;
                    this.sms_settings.sms_gateway = 'msg91';
                } else if (key === 'twilio') {
                    this.sms_settings.twilio_method = 1;
                    this.sms_settings.msg91_method = 0;
                    this.sms_settings.sms_gateway = 'twilio';
                }
            } else {
                if (key === 'msg91') {
                    this.sms_settings.msg91_method = 0;
                    if (this.sms_settings.sms_gateway === 'msg91') {
                        this.sms_settings.sms_gateway = '';
                    }
                } else if (key === 'twilio') {
                    this.sms_settings.twilio_method = 0;
                    if (this.sms_settings.sms_gateway === 'twilio') {
                        this.sms_settings.sms_gateway = '';
                    }
                }
            }
        },
        getSmsMethods() {
            axios.get(this.$apiUrl + '/sms_settings').then((response) => {
                if(response.data.data) {
                    this.record = response.data.data;

                    this.sms_settings.sms_gateway = this.record.sms_gateway ?? (this.record.msg91_method == 1 ? 'msg91' : 'twilio');
                    this.sms_settings.twilio_method = this.record.twilio_method??0;
                    this.sms_settings.twilio_sid = this.record.twilio_sid??"";
                    this.sms_settings.twilio_auth_token = this.record.twilio_auth_token;
                    this.sms_settings.twilio_phone_number = this.record.twilio_phone_number??"";

                    this.sms_settings.msg91_method = this.record.msg91_method??0;
                    this.sms_settings.msg91_auth_key = this.record.msg91_auth_key??"";
                    this.sms_settings.msg91_sender_id = this.record.msg91_sender_id??"";
                    this.sms_settings.msg91_otp_template_id = this.record.msg91_otp_template_id??"";
                }
            });
        },
        saveRecord: function(){
            this.isLoading = true;
            let sms_settingsObject = this.sms_settings;
            let formData = new FormData();
            for (let key in sms_settingsObject) {
                if(sms_settingsObject[key] == false){
                    formData.append(key, 0);
                }else if(sms_settingsObject[key] == true){
                    formData.append(key, 1);
                }else{
                    formData.append(key, sms_settingsObject[key]);
                }
            }


            let vm = this;
            if (this.sms_settings.twilio_method == 1 || this.sms_settings.msg91_method == 1 ) {
                    

            let url = this.$apiUrl + '/sms_settings/save';
       
            axios.post(url, formData).then(res => {
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    setTimeout(
                        function() {
                            vm.$swal.close();
                            vm.getSmsMethods();
                            vm.$router.push({path:'/sms-settings'});
                            vm.isLoading = false;
                        }, 100);
                }else{
                    vm.showError(data.message);
                    vm.isLoading = false;
                }
            }).catch(error => {
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                }else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError(__('something_went_wrong'));
                }
                vm.isLoading = false;
            });
     
} else {
  this.showMessage("error", "At lease one sms method is should enable");
      vm.isLoading = false;

        }
        }
    }
}
</script>
