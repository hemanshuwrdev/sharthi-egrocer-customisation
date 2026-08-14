<template>
   <div class="auth" :style="{ backgroundImage: 'url('+ $panelLoginBackgroundImg + ')' }">
        <div class="login-wrapper"> 
            <div class="detail-card">
                <div class="auth-logo">
                    <a href="javascript:void(0)"
                       style="display: flex; align-items: center; justify-content: flex-start;">
                        <img v-if="$appLogo != ''" :src="$storageUrl+$appLogo" style="height: 70px; width: 70px;"
                             alt='Logo'/>
                        <img v-else :src="$baseUrl + '/images/logo.png'" style="height: 70px; width: 70px;"
                             alt='Logo'/>
                        <h2 style="margin: 10px;">{{ $appName }}</h2>
                    </a>
                </div>
                <h4>Delivery Boy Complete Profile</h4>
                <p class="auth-subtitle text-primary">Please Complete the form to complete your registration</p>
                <form ref="my-form" @submit.prevent="saveRecord">
                    <div class="content">
                        <h6>Delivery Boy Information</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="name">Name</label>
                                    <input type="text" name="name" id="name" v-model="deliveryBoys.name" class="form-control" placeholder="Enter name.">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="mobile">Mobile No.</label>
                                    <div class="input-group mobile-input-group">
                                        <div class="country-code-dropdown" ref="countryDropdown">
                                            <button type="button" class="country-code-toggle" @click="countryDropdownOpen = !countryDropdownOpen">
                                                <span>{{ deliveryBoys.country_code }}</span>
                                                <span class="country-code-caret"></span>
                                            </button>
                                            <ul v-if="countryDropdownOpen" class="country-code-menu">
                                                <li v-for="c in countries" :key="c.id" @click="deliveryBoys.country_code = c.dial_code; countryDropdownOpen = false">
                                                    {{ c.dial_code }}
                                                </li>
                                            </ul>
                                        </div>
                                        <input type="number" name="mobile" id="mobile" v-model="deliveryBoys.mobile" class="form-control" placeholder="Enter mobile no.">
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="driving_license">Driving License</label>
                                    <input type="file" name="driving_license" id="driving_license" v-on:change="handleFileUploadLicense" ref="file_license" :required="!deliveryBoys.id" class="file-input" />

                                    <div class="file-input-div bg-gray-100" @click="$refs.file_license.click()" @drop="dropFileUploadLicense" @dragover="$dragoverFile" @dragleave="$dragleaveFile">

                                        <template v-if="deliveryBoys.driving_license && deliveryBoys.driving_license.name !== ''">
                                            <label>Selected file name:- {{ deliveryBoys.driving_license.name }}</label>
                                        </template>
                                        <template v-else>
                                            <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                            <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                        </template>

                                    </div>

                                    <div class="row" v-if="deliveryBoys.driving_license_url">
                                        <div v-if="isImage(deliveryBoys.driving_license_url)" class="col-md-2">
                                            <img class="custom-image" :src="deliveryBoys.driving_license_url" title='Driving License' alt='Driving License'/>
                                        </div>
                                        <div v-else class="col-md-2 mt-2">
                                            <a target="_blank" :href="deliveryBoys.driving_license_url" class="badge bg-success"> <i class="fa fa-eye"></i> Identity Card</a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="national_identity_card">National Identity Card</label>
                                    <input type="file" name="national_identity_card" id="national_identity_card" v-on:change="handleFileUploadCard" ref="file_card" :required="!deliveryBoys.id" class="file-input" />
                                    
                                    <div class="file-input-div bg-gray-100" @click="$refs.file_card.click()" @drop="dropFileUploadCard" @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                        <template v-if="deliveryBoys.national_identity_card && deliveryBoys.national_identity_card.name !== ''">
                                            <label>Selected file name:- {{ deliveryBoys.national_identity_card.name }}</label>
                                        </template>
                                        <template v-else>
                                            <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                            <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                                        </template>
                                    </div>

                                    <div class="row" v-if="deliveryBoys.national_identity_card_url">
                                        <div v-if="isImage(deliveryBoys.national_identity_card_url)" class="col-md-2">
                                            <img class="custom-image" :src="deliveryBoys.national_identity_card_url" title='National Identity Card' alt='National Identity Card'/>
                                        </div>
                                        <div v-else class="col-md-2 mt-2">
                                            <a target="_blank" :href="deliveryBoys.national_identity_card_url" class="badge bg-success"> <i class="fa fa-eye"></i> Identity Card</a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="dob">Date Of Birth</label>
                                    <input type="date" name="dob" id="dob" v-model="deliveryBoys.dob" required class="form-control" placeholder="Enter date of birth">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="ifsc_code">Bank's IFSC Code</label>
                                    <input type="text" name="ifsc_code" id="ifsc_code" v-model="deliveryBoys.ifsc_code" required class="form-control" placeholder="Enter bank's IFSC code.">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="bank_name">Bank Name</label>
                                    <input type="text" name="bank_name" id="bank_name" v-model="deliveryBoys.bank_name" required class="form-control" placeholder="Enter bank name">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="account_number">Account Number</label>
                                    <input type="text" name="account_number" id="account_number" v-model="deliveryBoys.bank_account_number" required class="form-control" placeholder="Enter account number">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="account_name">Bank Account Name</label>
                                    <input type="text" name="account_name" id="account_name" v-model="deliveryBoys.account_name" required class="form-control" placeholder="Enter bank account name">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="city_name">Select or Search City</label>
                                <multiselect v-model="city"
                                             :options="cities"
                                             @close="setCityId"
                                             placeholder="Select & Search City"
                                             label="name"
                                             track-by="name" id="city_name" required>
                                    <template slot="singleLabel" slot-scope="props">
                                                        <span class="option__desc">
                                                            <span class="option__title">{{ props.option.name }}</span>
                                                        </span>
                                    </template>
                                    <template slot="option" slot-scope="props">
                                        <div class="option__desc">
                                                            <span class="option__title">{{
                                                                    props.option.formatted_address
                                                                }}</span>
                                        </div>
                                    </template>
                                </multiselect>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="address">Address</label>
                                    <textarea name="address" id="address" v-model="deliveryBoys.address" rows='3' class="form-control" placeholder="Enter address"></textarea>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="other_payment_info">Other Payment Information</label>
                                    <textarea name="other_payment_info" id="other_payment_info" v-model="deliveryBoys.other_payment_information" rows='3' class="form-control" placeholder="Enter other payment information"></textarea>
                                </div>
                            </div>

                        </div>
                    </div>
                    <button class="btn btn-primary btn-block btn-lg shadow-lg mt-5">
                        Complete
                        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                    </button>

                </form>
                <div class="auth-copyright">

                    <a href="javascript:void(0)" class="text-primary font-weight-normal"> {{ $copyrightDetails }}</a>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Auth from '../../Auth.js';
import {VuejsDatatableFactory} from "vuejs-datatable";
import Select2 from "v-select2-component";
import Multiselect from "vue-multiselect";
import Editor from "@tinymce/tinymce-vue";
export default {
    components: {
        VuejsDatatableFactory,
        Select2,
        Multiselect,
        'editor': Editor
    },
    data : function(){
        return {
            isLoading: false,
            loggedUser: Auth.user,
            city:"",
            cities:[],
            deliveryBoys:{
                name: Auth.user.username ,
                mobile: "" ,
                country_code: "+91",
                dob: "" ,

                driving_license: "" ,
                driving_license_url: "" ,
                national_identity_card: "" ,
                national_identity_card_url: "" ,

                ifsc_code: "" ,
                bank_name: "" ,
                bank_account_number: "" ,
                account_name: "" ,
                address: "" ,
                other_payment_information: "" ,
                city_id:""
            },
            countries: [],
            countryDropdownOpen: false,

        };
    },
    created: function () {
        this.getCities();
        this.getCountries();
    },
    mounted() {
        if(!this.loggedUser){
            this.$router.push('/login');
        }
        document.addEventListener('click', this.handleCountryDropdownOutsideClick);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleCountryDropdownOutsideClick);
    },
    methods: {
        handleCountryDropdownOutsideClick(event) {
            if (this.countryDropdownOpen && this.$refs.countryDropdown && !this.$refs.countryDropdown.contains(event.target)) {
                this.countryDropdownOpen = false;
            }
        },
        getCountries() {
            axios.get(this.$apiUrl + '/countries')
                .then((response) => {
                    this.countries = response.data.data || [];
                    if (!this.countries.some(c => c.dial_code === this.deliveryBoys.country_code)) {
                        const india = this.countries.find(c => c.dial_code === '+91');
                        if (india) this.deliveryBoys.country_code = india.dial_code;
                    }
                })
                .catch(() => {
                    this.countries = [];
                });
        },
        handleFileUploadLicense() {
            this.deliveryBoys.driving_license = this.$refs.file_license.files[0];
            this.deliveryBoys.driving_license_url = URL.createObjectURL(this.deliveryBoys.driving_license);;
        },
        dropFileUploadLicense(event){
            event.preventDefault();
            this.$refs.file_license.files = event.dataTransfer.files;
            this.handleFileUploadLicense(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        handleFileUploadCard() {
            this.deliveryBoys.national_identity_card = this.$refs.file_card.files[0];
            this.deliveryBoys.national_identity_card_url = URL.createObjectURL(this.deliveryBoys.national_identity_card);;
        },
        dropFileUploadCard(event){
            event.preventDefault();
            this.$refs.file_card.files = event.dataTransfer.files;
            this.handleFileUploadCard(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        getCities() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/cities')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.cities = data.data;
                });
        },
        setCityId() {
            this.deliveryBoys.city_id = this.city.id;
        },
        saveRecord: function(){
            let vm = this;
            this.isLoading = true;
            let formObject = this.deliveryBoys;
            let formData = new FormData();
            for(let key in formObject){
                formData.append(key, formObject[key]);
            }
            let url = this.$deliveryBoyApiUrl + '/details';
            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                this.isLoading = false;
                let data = res.data;
                if (data.status === 1) {
                    this.showMessage("success", data.message);
                    setTimeout(
                        function () {
                            vm.$swal.close();
                            Auth.logout();
                            vm.$router.push({path: '/login'})
                        }, 2000);
                }else{
                    vm.showError(data.message);
                    vm.isLoading = false;
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
@import "../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";

.input-group.mobile-input-group {
    flex-wrap: nowrap;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    background: #fff;
}
.mobile-input-group .country-code-dropdown {
    position: relative;
    flex: 0 0 auto;
    width: 72px;
    border-right: 1px solid #ced4da;
}
.mobile-input-group .country-code-toggle {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2px;
    padding: 0.375rem 0.5rem;
    border: none;
    background: transparent;
    cursor: pointer;
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
}
.mobile-input-group input.form-control {
    flex: 1 1 auto;
    min-width: 0;
    border: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    box-shadow: none;
}
.mobile-input-group input.form-control:focus {
    box-shadow: none;
}
.country-code-caret {
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid #6c757d;
}
.country-code-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1050;
    width: 130px;
    max-height: 220px;
    overflow-y: auto;
    margin: 2px 0 0;
    padding: 4px 0;
    list-style: none;
    background: #fff;
    border: 1px solid #ced4da;
    border-radius: 4px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.country-code-menu li {
    padding: 6px 12px;
    cursor: pointer;
}
.country-code-menu li:hover {
    background: #f1f3f5;
}

.auth {
    overflow-x: hidden!important;
}
.auth-logo {
    padding-bottom: 10px;
}
</style>
