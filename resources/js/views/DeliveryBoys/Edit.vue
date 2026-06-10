<template>
    <b-modal ref="my-modal" :title="modal_title" @hidden="$emit('modalClose')" size="lg" scrollable no-close-on-backdrop
        no-fade static>
        <div slot="modal-footer">
            <b-button variant="primary" @click="$refs['dummy_submit'].click()" :disabled="isLoading">{{ __('save') }}
                <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
            </b-button>
            <b-button variant="secondary" @click="hideModal">{{ __('cancel') }}</b-button>
        </div>
        <form ref="my-form" @submit.prevent="saveRecord">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="name">{{ __('name') }}</label>
                        <input type="text" name="name" id="name" v-model="deliveryBoys.name" class="form-control"
                            placeholder="Enter name.">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="dob">{{ __('date_of_birth') }}</label>
                        <input type="date" name="dob" id="dob" v-model="deliveryBoys.dob" class="form-control"
                            placeholder="Enter date of birth" @input="validateDateOfBirth">
                        <span v-if="validationError" class="error">{{ validationError }}</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="mobile">{{ __('mobile') }}</label>
                        <input type="number" name="mobile" id="mobile" v-model="deliveryBoys.mobile"
                            class="form-control" placeholder="Enter mobile no." @input="validateMobileNumber">
                        <span v-if="validationError" class="error">{{ validationError }}</span>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group">
                        <label for="license_no">{{ __('license_no') }}</label>
                        <input type="text" name="license_no" id="license_no" v-model="deliveryBoys.license_no"
                            class="form-control" placeholder="Enter license no.">
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group">
                        <label for="email">{{ __('email') }}</label>
                        <input type="text" name="email" id="email" v-model="deliveryBoys.email" class="form-control"
                            placeholder="Enter email id.">
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group">
                        <label for="password">{{ __('password') }}</label>
                        <input type="password" name="password" id="password" v-model="deliveryBoys.password"
                            class="form-control" placeholder="Enter password.">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="confirm_password">{{ __('confirm_password') }}</label>
                        <input type="password" name="confirm_password" id="confirm_password"
                            v-model="deliveryBoys.confirm_password" class="form-control"
                            placeholder="Enter agin password.">
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="form-group">
                        <label for="driving_license">{{ __('driving_license') }}</label>
                        <input type="file" name="driving_license" id="driving_license"
                            v-on:change="handleFileUploadLicense" ref="file_license" class="file-input" />

                        <div class="file-input-div bg-gray-100" @click="$refs.file_license.click()"
                            @drop="dropFileUploadLicense" @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                            <template v-if="deliveryBoys.driving_license && deliveryBoys.driving_license.name !== ''">
                                <label>{{ __('selected_file_name') }}:- {{ deliveryBoys.driving_license.name }}</label>
                            </template>
                            <template v-else>
                                <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                            </template>

                        </div>

                        <div class="row" v-if="deliveryBoys.driving_license_url">
                            <div v-if="isImage(deliveryBoys.driving_license_url)" class="col-md-2">
                                <img class="custom-image" :src="deliveryBoys.driving_license_url"
                                    title='Driving License' alt='Driving License' />
                            </div>
                            <div v-else class="col-md-2 mt-2">
                                <a target="_blank" :href="deliveryBoys.driving_license_url" class="badge bg-success"> <i
                                        class="fa fa-eye"></i>
                                    {{ __('identity_card') }}</a>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="national_identity_card">{{ __('national_identity_card') }}</label>
                        <input type="file" name="national_identity_card" id="national_identity_card"
                            v-on:change="handleFileUploadCard" ref="file_card" class="file-input" />

                        <div class="file-input-div bg-gray-100" @click="$refs.file_card.click()"
                            @drop="dropFileUploadCard" @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                            <template
                                v-if="deliveryBoys.national_identity_card && deliveryBoys.national_identity_card.name !== ''">
                                <label>{{ __('selected_file_name') }}:- {{ deliveryBoys.national_identity_card.name }}</label>
                            </template>
                            <template v-else>
                                <label><i class="fa fa-cloud-upload-alt fa-2x"></i></label>
                                <label>{{ __('drop_files_here_or_click_to_upload') }}</label>
                            </template>
                        </div>

                        <div class="row" v-if="deliveryBoys.national_identity_card_url">
                            <div v-if="isImage(deliveryBoys.national_identity_card_url)" class="col-md-2">
                                <img class="custom-image" :src="deliveryBoys.national_identity_card_url"
                                    title='National Identity Card' alt='National Identity Card' />
                            </div>
                            <div v-else class="col-md-2 mt-2">
                                <a target="_blank" :href="deliveryBoys.national_identity_card_url"
                                    class="badge bg-success"> <i class="fa fa-eye"></i> {{ __('identity_card') }}</a>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="bonus_type">{{ __('bonus_type') }}</label>
                        <select name="bonus_type" id="bonus_type" v-model="deliveryBoys.bonus_type" class="form-control">
                            <option value="0">Fixed Amount / Commission</option>
                            <option value="1">Percentage</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="bonus_percentage">{{ __('bonus') }}</label>
                        <input type="number" name="bonus_percentage" id="bonus_percentage" v-model="deliveryBoys.bonus_percentage" class="form-control"
                            placeholder="Enter Bonus Amount or Percentage">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="ifsc_code">{{ __('bank_ifsc_code') }}</label>
                        <input type="text" name="ifsc_code" id="ifsc_code" v-model="deliveryBoys.ifsc_code"
                            class="form-control" placeholder="Enter bank's IFSC code.">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="bank_name">{{ __('bank_name') }}</label>
                        <input type="text" name="bank_name" id="bank_name" v-model="deliveryBoys.bank_name"
                            class="form-control" placeholder="Enter bank name">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="account_number">{{ __('account_number') }}</label>
                        <input type="number" name="account_number" id="account_number"
                            v-model="deliveryBoys.bank_account_number" class="form-control"
                            placeholder="Enter account number" @input="validateAccountNumber">
                        <span v-if="validationError" class="error">{{ validationError }}</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="account_name">{{ __('bank_account_name') }}</label>
                        <input type="text" name="account_name" id="account_name" v-model="deliveryBoys.account_name"
                            class="form-control" placeholder="Enter bank account name">
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="city_name">{{ __('select_or_search_city') }}</label>
                    <multiselect v-model="city" :options="cities" @close="setCityId" placeholder="Select & Search City"
                        label="name" track-by="name" id="city_name">
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
                        <label for="address">{{ __('address') }}</label>
                        <textarea name="address" id="address" v-model="deliveryBoys.address" rows='3'
                            class="form-control" placeholder="Enter address"></textarea>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="other_payment_info">{{ __('other_payment_information') }}</label>
                        <textarea name="other_payment_info" id="other_payment_info"
                            v-model="deliveryBoys.other_payment_information" rows='3' class="form-control"
                            placeholder="Enter other payment information"></textarea>
                    </div>
                </div>

                <div class="col-md-12" v-if="deliveryBoys.id">
                    <div class="form-group">
                        <label>{{ __('status') }}</label><br>
                        <b-form-radio-group v-model="deliveryBoys.status" :options="[
                            { text: __('registered'), 'value': 0 },
                            { text: __('active'), 'value': 1 },
                            { text: __('not_approved'), 'value': 2 },
                            { text: __('deactive'), 'value': 3 },
                            { text: __('block'), 'value': 4 },
                        ]" buttons button-variant="outline-primary" required></b-form-radio-group>

                    </div>
                </div>
                <div v-if="[2, 3].includes(deliveryBoys.status)" class="form-group col-md-12">
                    <div class="form-group">
                        <label for="remark">{{ __('remark') }}</label>
                        <textarea class="form-control" name="remark" id="remark" v-model="deliveryBoys.remark"
                            placeholder="Add a remark of this status..."></textarea>
                    </div>
                </div>
            </div>
            <button ref="dummy_submit" style="display:none;"></button>
        </form>
    </b-modal>
</template>

<script>
import axios from 'axios';
import Multiselect from "vue-multiselect";

export default {
    props: ['record'],
    components: {
        Multiselect,
    },
    data: function () {
        return {

            language_id: 46,
            languages: [],
            defaultLanguage: null,
            currentLanguage: null,

            translations: {},


            isLoading: false,
            city: "",
            cities: [],
            deliveryBoys: {
                language_id: this.currentLanguage.id,
                id: this.record ? this.record.id : null,
                admin_id: this.record ? this.record.admin_id : "",
                name: this.record ? this.record.name : "",
                mobile: this.record ? this.record.mobile : "",
                license_no: this.record ? this.record.license_no : "",
                email: this.record ? this.record.admin.email : "",
                password: "",
                confirm_password: "",             
                dob: this.record ? this.record.dob : "",
                bonus_type: this.record ? this.record.bonus_type : 0,
                bonus_percentage: this.record ? this.record.bonus_percentage : "",

                driving_license: "",
                driving_license_url: this.record ? this.$storageUrl + this.record.driving_license : "",
                national_identity_card: "",
                national_identity_card_url: this.record ? this.$storageUrl + this.record.national_identity_card : "",

                ifsc_code: this.record ? this.record.ifsc_code : "",
                bank_name: this.record ? this.record.bank_name : "",
                bank_account_number: this.record ? this.record.bank_account_number : "",
                account_name: this.record ? this.record.account_name : "",
                address: this.record ? this.record.address : "",
                other_payment_information: this.record ? this.record.other_payment_information : "",
                city_id: this.record ? this.record.city_id : "",
                status: this.record ? this.record.status : 0,
                remark: this.record ? this.record.remark : ""
            },
            validationError: null
        };
    },
    created: function () {
        this.getCities();
    },
    computed: {
        isDefaultLanguage() {
            return this.deliveryBoys.language_id === this.defaultLanguage.id
        },
        modal_title: function () {
            let title = this.deliveryBoys.id ? __('edit') : __('add');
            title += __('delivery_boys');
            return title;
        },
    },
    methods: {
        showModal() {
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        handleFileUploadLicense() {
            this.deliveryBoys.driving_license = this.$refs.file_license.files[0];
            this.deliveryBoys.driving_license_url = URL.createObjectURL(this.deliveryBoys.driving_license);;
        },
        dropFileUploadLicense(event) {
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
        dropFileUploadCard(event) {
            event.preventDefault();
            this.$refs.file_card.files = event.dataTransfer.files;
            this.handleFileUploadCard(); // Trigger the onChange event manually
            // Clean up
            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        validateDateOfBirth() {
            const selectedDate = new Date(this.deliveryBoys.dob);
            const currentDate = new Date();
            if (selectedDate > currentDate) {
                this.validationError = "Date of Birth cannot be in the future.";
            } else {
                this.validationError = null;
            }
        },
        validateMobileNumber() {

            if (this.deliveryBoys.mobile < 0) {
                this.validationError = "Mobile Number must be numeric value.";
                this.deliveryBoys.mobile = null;
            } else {
                this.validationError = null;
            }
        },
        validateAccountNumber() {
            if (this.deliveryBoys.bank_account_number < 1) {
                this.validationError = "Account Number must be numeric value.";
                this.deliveryBoys.bank_account_number = null;
            } else {
                this.validationError = null;
            }
        },
        getCities() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/cities')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    this.cities = data.data

                    if (this.deliveryBoys.id) {
                        this.city = this.cities.filter((item) => {
                            return item.id === this.record.city_id;
                        });
                    }
                });
        },
        setCityId() {
            this.deliveryBoys.city_id = this.city.id;
        },

        saveRecord: function () {
            if (!this.deliveryBoys.id && !this.isDefaultLanguage) {
                this.$bvToast.toast(
                    this.$t('default_language_required_first') || 'Please save default language first',
                    { variant: 'warning' }
                )
                return
            }

            let formData = new FormData();
            let vm = this;
            this.isLoading = true;
            
            for (let key in this.deliveryBoys) {
                if (key === 'driving_license' || key === 'national_identity_card') {
                    if (this.deliveryBoys[key] && this.deliveryBoys[key] !== "") {
                        formData.append(key, this.deliveryBoys[key]);
                    }
                } else if (this.deliveryBoys[key] !== null) {
                    formData.append(key, this.deliveryBoys[key]);
                }
            }
            let url = this.$apiUrl + '/delivery_boys/save';
            if (this.deliveryBoys.id) {
                url = this.$apiUrl + '/delivery_boys/update';
            }

            axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                let data = res.data;

    if (data.status === 1) {

        const message = isUpdate
            ? (this.$t('delivery_boy_updated_successfully') || 'Delivery boy updated successfully')
            : (this.$t('delivery_boy_saved_successfully') || 'Delivery boy saved successfully');

        this.$eventBus.$emit('deliveryBoysSaved', message);

        this.hideModal();
    } else {
        this.showError(data.message);
    }
            }).catch(error => {
                vm.isLoading = false;
                if (error.request.statusText) {
                    this.showError(error.request.statusText);
                } else if (error.message) {
                    this.showError(error.message);
                } else {
                    this.showError("Something went wrong!");
                }
            });
        }
    },
    mounted() {
        this.showModal();
    }
}
</script>

<style scoped>
@import "../../../../node_modules/vue-multiselect/dist/vue-multiselect.min.css";
</style>
