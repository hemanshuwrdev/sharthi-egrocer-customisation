<template>
    <div class="list-page">
        <div class="page-head">
            <h3 class="page-head-title">
                <template v-if="id">{{ __('edit') }}</template>
                <template v-else>{{ __('create') }}</template>
                {{ __('delivery_boy') }}
            </h3>
            <div class="page-head-actions">
                <router-link to="/seller/delivery_boys" class="ui-backbtn" v-b-tooltip.hover title="View Delivery boys">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i> {{ __('view_delivery_boys') }}
                </router-link>
            </div>
        </div>

        <form ref="my-form" class="ui-card" @submit.prevent="saveRecord">
            <div class="ui-card__body">

                <!-- Language tabs for translatable fields (the tab bar is only shown when there is more than one language) -->
                <b-tabs v-model="activeLanguageTab" v-if="languages.length > 0" :key="'lang-tabs-' + languagesKey" pills
                    :nav-class="languages.length > 1 ? 'ui-seg-nav' : 'd-none'">
                    <!-- Default language tab (all main form fields sit below the tabs) -->
                    <b-tab v-for="(lang, index) in languages" :key="'lang-tab-' + lang.id" lazy
                        v-if="lang.is_default">
                        <template #title>{{ lang.name }}</template>

                        <!-- Translate buttons -->
                        <div class="ui-toolbar" v-if="lang.is_default && languages.length > 1">
                            <b-button size="sm" variant="outline-primary" @click="translateEmpty(lang)" v-b-tooltip.hover
                                :title="__('only_empty_fields_will_be_translated_existing_content_will_not_be_changed')"
                                :disabled="loadingEmpty">
                                <span v-if="!loadingEmpty">{{ __('translate_empty_fields') }}</span>
                                <b-spinner v-else small></b-spinner>
                            </b-button>

                            <b-button size="sm" variant="outline-danger" @click="translateOverwrite(lang)" v-b-tooltip.hover
                                :title="__('all_fields_will_be_translated_and_existing_content_will_be_overwritten')"
                                :disabled="loadingOverwrite">
                                <span v-if="!loadingOverwrite">{{ __('translate_and_overwrite') }}</span>
                                <b-spinner v-else small></b-spinner>
                            </b-button>

                            <span v-if="translateSuccessMessage" class="text-success fw-bold">{{ translateSuccessMessage }}</span>
                        </div>
                        <!-- Translate buttons END -->
                    </b-tab>

                    <!-- Other language tabs (only the translatable fields) -->
                    <b-tab v-for="(lang, index) in languages" :key="'lang-tab-' + lang.id" lazy
                        v-if="!lang.is_default">
                        <template #title>{{ lang.name }}</template>

                        <div class="ui-grid ui-grid--1">
                            <div class="ui-field">
                                <label class="ui-label" :for="'name_' + lang.id">{{ __('name') }}</label>
                                <input type="text" name="name" :id="'name_' + lang.id" v-model="translations[lang.id].name"
                                    class="ui-control" :placeholder="__('name')">
                            </div>
                            <div class="ui-field">
                                <label class="ui-label" :for="'address_' + lang.id">{{ __('address') }}</label>
                                <textarea name="address" :id="'address_' + lang.id" v-model="translations[lang.id].address"
                                    rows="3" class="ui-control" :placeholder="__('address')"></textarea>
                            </div>
                        </div>
                    </b-tab>
                </b-tabs>

                <!-- Main form fields (only shown while the default language tab is active, or when there are no tabs) -->
                <div v-if="!languages.length || (defaultLanguage && getCurrentLanguage() && getCurrentLanguage().is_default)">

                    <section class="ui-section">
                        <h3 class="ui-section__title"><i class="fa fa-user"></i> {{ __('Personal details') }}</h3>
                        <div class="ui-grid ui-grid--3">
                            <!-- Name (default language) -->
                            <div class="ui-field">
                                <label class="ui-label" for="name">{{ __('name') }}<span class="ui-req">*</span></label>
                                <input type="text" name="name" id="name" v-if="defaultLanguage"
                                    v-model="translations[defaultLanguage.id].name" class="ui-control"
                                    :placeholder="__('name')">
                            </div>

                            <!-- Mobile -->
                            <div class="ui-field">
                                <label class="ui-label" for="mobile">{{ __('mobile') }}<span class="ui-req">*</span></label>
                                <div class="ui-phone">
                                    <div class="ui-phone__code" ref="countryDropdown">
                                        <button type="button" class="ui-phone__toggle" @click="countryDropdownOpen = !countryDropdownOpen">
                                            <span>{{ deliveryBoys.country_code }}</span>
                                            <span class="ui-phone__caret"></span>
                                        </button>
                                        <ul v-if="countryDropdownOpen" class="ui-phone__menu">
                                            <li v-for="c in countries" :key="c.id" @click="deliveryBoys.country_code = c.dial_code; countryDropdownOpen = false">
                                                {{ c.dial_code }}
                                            </li>
                                        </ul>
                                    </div>
                                    <input type="number" name="mobile" id="mobile" v-model="deliveryBoys.mobile"
                                        class="ui-phone__input" :placeholder="__('mobile_no')"
                                        @input="validateMobileNumber" @blur="checkExistingDriver">
                                </div>
                                <p v-if="mobilevalidationError" class="ui-error">{{ mobilevalidationError }}</p>
                            </div>

                            <!-- License No -->
                            <div class="ui-field">
                                <label class="ui-label" for="license_no">{{ __('license_no') }}</label>
                                <input type="text" name="license_no" id="license_no" v-model="deliveryBoys.license_no"
                                    class="ui-control" :placeholder="__('license_no')">
                            </div>

                            <!-- Address (default language) -->
                            <div class="ui-field ui-span-all" v-if="defaultLanguage">
                                <label class="ui-label" for="address">{{ __('address') }}</label>
                                <textarea name="address" id="address" v-model="translations[defaultLanguage.id].address"
                                    rows="3" class="ui-control" :placeholder="__('address')"></textarea>
                            </div>
                        </div>
                    </section>

                    <section class="ui-section">
                        <h3 class="ui-section__title"><i class="fa fa-id-card"></i> {{ __('Documents') }}</h3>
                        <div class="ui-grid">
                            <div class="ui-field">
                                <label class="ui-label" for="driving_license">{{ __('driving_licence') }}</label>
                                <input type="file" class="file-input" accept="image/*,application/pdf,.doc,.docx" name="driving_license"
                                    id="driving_license" v-on:change="handleFileUploadLicense" ref="file_license" style="display: none;" />
                                <div class="ui-drop bg-gray-100" @click="$refs.file_license.click()" @drop="dropFileUploadLicense"
                                    @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                    <span class="ui-tile" :class="deliveryBoys.driving_license && deliveryBoys.driving_license.name !== '' ? 'ui-tone--green' : 'ui-tone--blue'">
                                        <i class="fa" :class="deliveryBoys.driving_license && deliveryBoys.driving_license.name !== '' ? 'fa-check' : 'fa-cloud-upload-alt'"></i>
                                    </span>
                                    <div class="ui-drop__text">
                                        <template v-if="deliveryBoys.driving_license && deliveryBoys.driving_license.name !== ''">
                                            <strong>{{ deliveryBoys.driving_license.name }}</strong>
                                            <span>{{ __('Click to choose a different file') }}</span>
                                        </template>
                                        <template v-else>
                                            <strong>{{ __('drop_files_here_or_click_to_upload') }}</strong>
                                            <span>{{ __('Images, PDF or DOC, up to 2 MB') }}</span>
                                        </template>
                                    </div>
                                </div>
                                <p v-if="drivingLicencevalidationerror" class="ui-error">{{ drivingLicencevalidationerror }}</p>
                                <div class="ui-doc" v-if="deliveryBoys.driving_license_url">
                                    <img v-if="isImage(deliveryBoys.driving_license_url)" :src="deliveryBoys.driving_license_url" title="Driving License" alt="Driving License" />
                                    <a v-else target="_blank" :href="deliveryBoys.driving_license_url" class="ui-btn-sm">
                                        <i class="fa fa-eye"></i> {{ __('identity_card') }}
                                    </a>
                                </div>
                            </div>
                            <div class="ui-field">
                                <label class="ui-label" for="national_identity_card">{{ __('national_identity_card') }}</label>
                                <input type="file" class="file-input" accept="image/*,application/pdf,.doc,.docx" name="national_identity_card"
                                    id="national_identity_card" v-on:change="handleFileUploadCard" ref="file_card" style="display: none;" />
                                <div class="ui-drop bg-gray-100" @click="$refs.file_card.click()" @drop="dropFileUploadCard"
                                    @dragover="$dragoverFile" @dragleave="$dragleaveFile">
                                    <span class="ui-tile" :class="deliveryBoys.national_identity_card && deliveryBoys.national_identity_card.name !== '' ? 'ui-tone--green' : 'ui-tone--purple'">
                                        <i class="fa" :class="deliveryBoys.national_identity_card && deliveryBoys.national_identity_card.name !== '' ? 'fa-check' : 'fa-cloud-upload-alt'"></i>
                                    </span>
                                    <div class="ui-drop__text">
                                        <template v-if="deliveryBoys.national_identity_card && deliveryBoys.national_identity_card.name !== ''">
                                            <strong>{{ deliveryBoys.national_identity_card.name }}</strong>
                                            <span>{{ __('Click to choose a different file') }}</span>
                                        </template>
                                        <template v-else>
                                            <strong>{{ __('drop_files_here_or_click_to_upload') }}</strong>
                                            <span>{{ __('Images, PDF or DOC, up to 2 MB') }}</span>
                                        </template>
                                    </div>
                                </div>
                                <p v-if="nationalIdentityCardvalidationerror" class="ui-error">{{ nationalIdentityCardvalidationerror }}</p>
                                <div class="ui-doc" v-if="deliveryBoys.national_identity_card_url">
                                    <img v-if="isImage(deliveryBoys.national_identity_card_url)" :src="deliveryBoys.national_identity_card_url" title="National Identity Card" alt="National Identity Card" />
                                    <a v-else target="_blank" :href="deliveryBoys.national_identity_card_url" class="ui-btn-sm">
                                        <i class="fa fa-eye"></i> {{ __('identity_card') }}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Status (only when editing an existing driver) -->
                    <section class="ui-section" v-if="deliveryBoys.id">
                        <h3 class="ui-section__title"><i class="fa fa-toggle-on"></i> {{ __('status') }}</h3>
                        <div class="ui-grid ui-grid--1">
                            <div class="ui-field">
                                <label class="ui-label">{{ __('status') }}<span class="ui-req">*</span></label>
                                <b-form-radio-group v-model="deliveryBoys.status" :options="[
                                    { text: __('registered'), 'value': 0 },
                                    { text: __('active'), 'value': 1 },
                                    { text: __('not_approved'), 'value': 2 },
                                    { text: __('deactive'), 'value': 3 },
                                    { text: __('block'), 'value': 4 },
                                ]" buttons button-variant="outline-primary" class="ui-seg" required></b-form-radio-group>
                            </div>
                            <div class="ui-field" v-if="[2, 3, 4].includes(deliveryBoys.status)">
                                <label class="ui-label" for="remark">{{ __('remark') }}<span class="ui-req">*</span></label>
                                <textarea class="ui-control" name="remark" id="remark" required rows="3"
                                    v-model="deliveryBoys.remark" :placeholder="__('remark')"></textarea>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <!-- End of main form fields (only visible on the default language tab) -->

            <!-- Action buttons -->
            <div class="ui-card__foot">
                <template v-if="deliveryBoys.id">
                    <b-button type="submit" variant="primary" :disabled="isLoading">
                        {{ __('update') }}
                        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                    </b-button>
                </template>
                <template v-else>
                    <button type="reset" class="btn btn-light border">{{ __('clear') }}</button>
                    <b-button type="submit" variant="primary" :disabled="isLoading">
                        {{ __('save') }}
                        <b-spinner v-if="isLoading" small label="Spinning"></b-spinner>
                    </b-button>
                </template>
            </div>
        </form>

        <!-- A driver with this mobile number already exists (added by another distributor): confirm and link.
             The body sits in .ui-modern because modals mount outside the seller layout root. -->
        <b-modal v-model="showExistingDriverModal" hide-header hide-footer centered no-close-on-backdrop size="md" body-class="p-0">
            <div class="ui-modern driver-link" v-if="existingDriver">
                <div class="driver-link__head">
                    <span class="ui-tile ui-tone--blue"><i class="fa fa-user-check"></i></span>
                    <div class="driver-link__title">
                        <h5>{{ __('driver_already_exists') }}</h5>
                        <p>{{ __('is_this_the_driver_you_want_to_add') }}</p>
                    </div>
                    <button type="button" class="driver-link__close" @click="showExistingDriverModal = false" aria-label="Close">&times;</button>
                </div>

                <div class="driver-link__card">
                    <div class="ui-person">
                        <span class="ui-avatar ui-tone--green driver-link__avatar">{{ driverInitials(existingDriver.driver.name) }}</span>
                        <div class="driver-link__who">
                            <strong>{{ existingDriver.driver.name }}</strong>
                            <span class="ui-pill ui-pill--dot ui-tone--green driver-link__status" v-if="existingDriver.driver.status === 1">
                                <i class="ui-dot"></i>{{ __('active') }}
                            </span>
                            <span class="ui-pill ui-pill--dot ui-tone--amber driver-link__status" v-else>
                                <i class="ui-dot"></i>{{ __('inactive') }}
                            </span>
                        </div>
                    </div>
                    <ul class="driver-link__details">
                        <li>
                            <i class="fa fa-phone-alt"></i>
                            <span>{{ existingDriver.driver.country_code }} {{ existingDriver.driver.mobile }}</span>
                        </li>
                        <li v-if="existingDriver.driver.address">
                            <i class="fa fa-map-marker-alt"></i>
                            <span>{{ existingDriver.driver.address }}</span>
                        </li>
                    </ul>
                </div>

                <div v-if="!existingDriver.linkable" class="driver-link__notice ui-tone--red">
                    <i class="fa fa-info-circle"></i>
                    <span v-if="existingDriver.already_linked">{{ __('this_driver_is_already_in_your_drivers') }}</span>
                    <span v-else>{{ __('this_driver_is_not_active_and_cannot_be_added') }}</span>
                </div>

                <div class="driver-link__actions">
                    <button type="button" class="btn btn-light border" @click="showExistingDriverModal = false">
                        {{ existingDriver.linkable ? __('cancel') : __('close') }}
                    </button>
                    <button v-if="existingDriver.linkable" type="button" class="btn btn-primary" :disabled="isLinkingDriver" @click="confirmLinkDriver">
                        <b-spinner small v-if="isLinkingDriver"></b-spinner>
                        <i class="fa fa-plus" v-else></i>
                        {{ __('yes_add_this_driver') }}
                    </button>
                </div>
            </div>
        </b-modal>
    </div>
</template>
<script>
import { VuejsDatatableFactory } from 'vuejs-datatable';
import axios from "axios";
import Select2 from 'v-select2-component';
import Multiselect from 'vue-multiselect';

import Auth from '../../Auth.js';
import TranslationHelper from '../../mixins/TranslationHelper.js';

export default {
    mixins: [TranslationHelper],
    components: {
        VuejsDatatableFactory,
        Select2,
        Multiselect,
    },
    data: function () {
        return {
            activeLanguageTab: 0,
            languagesKey: 0,
            currentLanguage: null,
            languages: [],
            defaultLanguage: null,


            translations: {},
            login_user: Auth.user,
            isLoading: false,
            showPassword: false,
            showConfirmPassword: false,
            record: null,
            selectedCities: [],
            cities: [],
            id: null,
            bonusSettings: null,
            deliveryBoys: {
                language_id: null,
                id: null,
                admin_id: "",
                name: "",
                dob: "",
                mobile: "",
                country_code: "+91",
                license_no: "",
                email: "",
                password: "",
                confirm_password: "",
                ifsc_code: "",
                bank_name: "",
                bank_account_number: "",
                account_name: "",
                city_id: "",
                city_ids: [],
                address: "",
                other_payment_information: "",

                driving_license: "",
                driving_license_url: "",

                national_identity_card: "",
                national_identity_card_url: "",

                status: 0,
                remark: "",

                bonus_type: 0,
                bonus_percentage: 0,
                bonus_min_amount: 0,
                bonus_max_amount: 0,
            },
            mobilevalidationError: null,
            showExistingDriverModal: false,
            existingDriver: null,
            isLinkingDriver: false,
            dobvalidationError: null,
            account_numbervalidationError: null,
            drivingLicencevalidationerror: null,
            nationalIdentityCardvalidationerror: null,
            bonusMinAmountValidationError: null,
            bonusMaxAmountValidationError: null,

            // Translate buttons (defaultLanguageId set when languages load)
            defaultLanguageId: null,
            translatableFields: ['name', 'address', 'other_payment_information'],
            translateSuccessMessage: '',
            loadingEmpty: false,
            loadingOverwrite: false,
            countries: [],
            countryDropdownOpen: false,
        };
    },
    computed: {
        isSellerRole() {
            return this.$roleSeller === this.login_user.role.name;
        },
    },
    created: function () {


        this.id = this.$route.params.id;
        if (this.$roleDeliveryBoy === this.login_user.role.name) {
            this.id = this.login_user.delivery_boy.id;
        }
        this.fetchLanguages().then(() => {
            if (this.id) {
                this.deliveryBoys.id = this.id;
                this.getDeliveryBoy();
            }
        });

        this.getCities();
        this.getCountries();
    },
    mounted() {
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
        // Get the currently active language based on activeLanguageTab
        getCurrentLanguage() {
            if (!this.languages.length || this.activeLanguageTab === null || this.activeLanguageTab === undefined) {
                return null;
            }
            // Reconstruct the rendered tab order: defaults first, then non-defaults
            const orderedLangs = [
                ...this.languages.filter(l => l.is_default),
                ...this.languages.filter(l => !l.is_default),
            ];
            return orderedLangs[this.activeLanguageTab] || null;
        },
        fetchLanguages() {
            return axios.get(this.$apiUrl + '/active_languages')
                .then(res => {
                    const langs = res.data.data;

                    this.languages = [];
                    this.translations = {};

                    this.languages = langs;
                    this.languagesKey++;

                    const defaultLang = langs.find(l => l.is_default == 1);

                    if (!defaultLang) {
                        this.showError('No default language configured.');
                        return;
                    }


                    this.defaultLanguage = defaultLang;
                    this.defaultLanguageId = defaultLang ? defaultLang.id : null;
                    this.currentLanguage = defaultLang.id;
                    // Set activeLanguageTab to default language index
                    this.activeLanguageTab = langs.findIndex(l => l.id === defaultLang.id);
                    this.deliveryBoys.language_id = defaultLang.id;

                    langs.forEach(lang => {
                        this.$set(this.translations, lang.id, {
                            name: '',
                            address: '',
                            other_payment_information: '',
                        });
                    });
                });
        },

        handleFileUploadLicense() {
            const file = this.$refs.file_license.files[0];

            this.drivingLicencevalidationerror = null;

            if (!file) return;

            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                this.drivingLicencevalidationerror = "Invalid file type. Please upload a JPEG, PNG, JPG, GIF, WEBP image or PDF or DOC file ";
                return;
            }

            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                this.drivingLicencevalidationerror = "File size exceeds the maximum allowed limit (2MB).";
                return;
            }
            this.deliveryBoys.driving_license = this.$refs.file_license.files[0];
            this.deliveryBoys.driving_license_url = URL.createObjectURL(this.deliveryBoys.driving_license);
        },
        dropFileUploadLicense(event) {
            event.preventDefault();
            this.$refs.file_license.files = event.dataTransfer.files;
            this.handleFileUploadLicense();

            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        handleFileUploadCard() {
            const file = this.$refs.file_card.files[0];

            this.nationalIdentityCardvalidationerror = null;

            if (!file) return;

            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!validTypes.includes(file.type)) {
                this.nationalIdentityCardvalidationerrorv = "Invalid file type. Please upload a JPEG, PNG, JPG, GIF, WEBP image or PDF or DOC file ";
                return;
            }

            const maxSize = 2 * 1024 * 1024;
            if (file.size > maxSize) {
                this.drivingLicencevalidationerror = "File size exceeds the maximum allowed limit (2MB).";
                return;
            }
            this.deliveryBoys.national_identity_card = this.$refs.file_card.files[0];
            this.deliveryBoys.national_identity_card_url = URL.createObjectURL(this.deliveryBoys.national_identity_card);;
        },
        dropFileUploadCard(event) {
            event.preventDefault();
            this.$refs.file_card.files = event.dataTransfer.files;
            this.handleFileUploadCard();

            event.currentTarget.classList.add('bg-gray-100');
            event.currentTarget.classList.remove('bg-green-300');
        },
        validateDateOfBirth() {
            const selectedDate = new Date(this.deliveryBoys.dob);
            const currentDate = new Date();
            if (selectedDate > currentDate) {
                this.dobvalidationError = "Date of Birth cannot be in the future.";
                this.deliveryBoys.dob = null;
            } else {
                this.dobvalidationError = null;
            }
        },
        // Distributor adding a new driver: if the mobile number already belongs to a driver (added by another
        // distributor), offer to link that driver instead. Returns true when the confirmation was opened.
        async lookupExistingDriver() {
            if (!this.isSellerRole || this.deliveryBoys.id || !this.deliveryBoys.mobile) return false;
            try {
                const res = await axios.post(this.$apiUrl + '/seller/delivery_boys/lookup', { mobile: String(this.deliveryBoys.mobile) });
                const data = res.data && res.data.data;
                if (!data || !data.found) return false;
                this.existingDriver = data;
                this.showExistingDriverModal = true;
                return true;
            } catch (e) {
                return false; // the save itself still rejects a duplicate mobile
            }
        },
        checkExistingDriver() {
            this.lookupExistingDriver();
        },
        driverInitials(name) {
            const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
            if (!parts.length) return '?';
            return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
        },
        async confirmLinkDriver() {
            this.isLinkingDriver = true;
            try {
                const res = await axios.post(this.$apiUrl + '/seller/delivery_boys/link', { mobile: String(this.deliveryBoys.mobile) });
                if (!res.data || res.data.status !== 1) {
                    throw new Error(res.data?.message || __('something_went_wrong'));
                }
                this.showExistingDriverModal = false;
                this.showMessage('success', __('driver_added_successfully'));
                this.$router.push({ path: '/seller/delivery_boys' });
            } catch (error) {
                this.showError(error.message || error?.response?.data?.message || __('something_went_wrong'));
            } finally {
                this.isLinkingDriver = false;
            }
        },
        validateMobileNumber() {
            if (this.deliveryBoys.mobile < 0) {
                this.mobilevalidationError = "Mobile Number must be numeric value.";
                this.deliveryBoys.mobile = null;
            } else {
                this.mobilevalidationError = null;
            }
        },
        validateAccountNumber() {
            if (this.deliveryBoys.bank_account_number < 1) {
                this.account_numbervalidationError = "Account Number must be numeric value.";
                this.deliveryBoys.bank_account_number = null;
            } else {
                this.account_numbervalidationError = null;
            }
        },
        validateBonusMinAmount() {

            this.bonusMinAmountValidationError = null;

            const minAmount = parseFloat(this.deliveryBoys.bonus_min_amount);
            const maxAmount = parseFloat(this.deliveryBoys.bonus_max_amount);


            if (minAmount > 0 && maxAmount > 0 && minAmount > maxAmount) {
                this.bonusMinAmountValidationError = "Minimum bonus amount cannot be greater than maximum bonus amount.";
                return;
            }

            if (minAmount < 0) {
                this.bonusMinAmountValidationError = "Minimum bonus amount cannot be negative.";
                return;
            }
        },
        validateBonusMaxAmount() {

            this.bonusMaxAmountValidationError = null;

            const minAmount = parseFloat(this.deliveryBoys.bonus_min_amount);
            const maxAmount = parseFloat(this.deliveryBoys.bonus_max_amount);

            if (minAmount > 0 && maxAmount > 0 && maxAmount < minAmount) {
                this.bonusMaxAmountValidationError = "Maximum bonus amount cannot be less than minimum bonus amount.";
                return;
            }

            if (maxAmount < 0) {
                this.bonusMaxAmountValidationError = "Maximum bonus amount cannot be negative.";
                return;
            }
        },
        getBonusSettings() {
            axios.get(this.$apiUrl + '/delivery_boys/bonus_settings')
                .then((response) => {
                    let data = response.data;
                    this.bonusSettings = data.data

                    if (this.bonusSettings.delivery_boy_bonus_settings == 1) {
                        this.deliveryBoys.bonus_type = this.bonusSettings.delivery_boy_bonus_type;
                        this.deliveryBoys.bonus_percentage = this.bonusSettings.delivery_boy_bonus_percentage;
                        this.deliveryBoys.bonus_min_amount = this.bonusSettings.delivery_boy_bonus_min_amount;
                        this.deliveryBoys.bonus_max_amount = this.bonusSettings.delivery_boy_bonus_max_amount;
                    }
                });
        },
        resetBonus() {
            this.deliveryBoys.bonus_type = this.record ? this.record.bonus_type : 0;
            this.deliveryBoys.bonus_percentage = this.record ? this.record.bonus_percentage : 0;
            this.deliveryBoys.bonus_min_amount = this.record ? this.record.bonus_min_amount : 0;
            this.deliveryBoys.bonus_max_amount = this.record ? this.record.bonus_max_amount : 0;
        },
        changeBonusType() {
            if (this.deliveryBoys.bonus_type == 0) {
                this.deliveryBoys.bonus_percentage = 0;
                this.deliveryBoys.bonus_min_amount = 0;
                this.deliveryBoys.bonus_max_amount = 0;

                this.bonusMinAmountValidationError = null;
                this.bonusMaxAmountValidationError = null;
            } else {
                this.deliveryBoys.bonus_percentage = this.record ? this.record.bonus_percentage : "";
                this.deliveryBoys.bonus_min_amount = this.record ? this.record.bonus_min_amount : "";
                this.deliveryBoys.bonus_max_amount = this.record ? this.record.bonus_max_amount : "";
                // Trigger validation when switching to commission type
                this.validateBonusMinAmount();
                this.validateBonusMaxAmount();
            }
        },

        getCities() {
            this.isLoading = true
            axios.get(this.$apiUrl + '/cities')
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    // API returns data.data = { total, cities }; ensure we always set an array for multiselect
                    const raw = data.data;
                    const list = (raw && raw.cities) ? raw.cities : raw;
                    this.cities = Array.isArray(list) ? list : (list && typeof list === 'object' ? Object.values(list) : []);

                    if (this.deliveryBoys.id && this.record) {
                        this.applyRecordCities();
                    }
                });
        },
        setCityId() {
            this.deliveryBoys.city_ids = this.selectedCities.map((c) => c.id);
            this.deliveryBoys.city_id = this.deliveryBoys.city_ids[0] ?? '';
        },
        applyRecordCities() {
            const ids = (this.record?.cities && this.record.cities.length)
                ? this.record.cities.map((c) => c.id)
                : (this.record?.city_id ? [this.record.city_id] : []);
            this.selectedCities = (this.cities || []).filter((item) => ids.includes(item.id));
            this.setCityId();
        },

        getDeliveryBoy() {
            axios.get(this.$apiUrl + '/delivery_boys/edit/' + this.id)
                .then((response) => {
                    this.isLoading = false
                    let data = response.data;
                    if (data.status === 1) {
                        this.record = data.data
                        this.translations = {};
                        if (!this.languages.length) return;

                        // Helper: show empty string when value is null, undefined, or string "null"
                        const emptyIfNull = (val) => (val != null && val !== "null") ? val : "";

                        this.translations = {};
                        this.languages.forEach(lang => {
                            let t = this.record.translations?.find(tr => tr.language_id === lang.id);

                            if (lang.is_default) {
                                this.$set(this.translations, lang.id, {
                                    name: emptyIfNull(t?.name) || emptyIfNull(this.record.name),
                                    address: emptyIfNull(t?.address) || emptyIfNull(this.record.address),
                                    other_payment_information: emptyIfNull(t?.other_payment_information) || emptyIfNull(this.record.other_payment_information),
                                });
                            } else {
                                this.$set(this.translations, lang.id, {
                                    name: emptyIfNull(t?.name),
                                    address: emptyIfNull(t?.address),
                                    other_payment_information: emptyIfNull(t?.other_payment_information),
                                });
                            }
                        });

                        this.deliveryBoys.id = this.record ? this.record.id : null;
                        this.deliveryBoys.admin_id = emptyIfNull(this.record?.admin_id);
                        this.deliveryBoys.name = emptyIfNull(this.record?.name);
                        this.deliveryBoys.dob = emptyIfNull(this.record?.dob);
                        this.deliveryBoys.mobile = emptyIfNull(this.record?.mobile);
                        this.deliveryBoys.country_code = this.record?.country_code || "+91";
                        this.deliveryBoys.license_no = emptyIfNull(this.record?.license_no);
                        this.deliveryBoys.email = (this.record?.admin) ? (this.record.admin.email || '') : '';
                        this.deliveryBoys.password = "";
                        this.deliveryBoys.confirm_password = "";
                        this.deliveryBoys.ifsc_code = emptyIfNull(this.record?.ifsc_code);
                        this.deliveryBoys.bank_name = emptyIfNull(this.record?.bank_name);
                        this.deliveryBoys.bank_account_number = emptyIfNull(this.record?.bank_account_number);
                        this.deliveryBoys.account_name = emptyIfNull(this.record?.account_name);

                        this.applyRecordCities();

                        this.deliveryBoys.address = emptyIfNull(this.record?.address);
                        this.deliveryBoys.other_payment_information = emptyIfNull(this.record?.other_payment_information);

                        this.deliveryBoys.driving_license = "";
                        this.deliveryBoys.driving_license_url = this.record ? this.$storageUrl + this.record.driving_license : "";
                        this.deliveryBoys.national_identity_card = "";
                        this.deliveryBoys.national_identity_card_url = this.record ? this.$storageUrl + this.record.national_identity_card : "";

                        this.deliveryBoys.status = this.record ? this.record.status : 0;
                        this.deliveryBoys.remark = this.record ? this.record.remark : "";

                        this.deliveryBoys.bonus_type = this.record ? this.record.bonus_type : 0;
                        this.deliveryBoys.bonus_percentage = this.record ? this.record.bonus_percentage : 0;
                        this.deliveryBoys.bonus_min_amount = this.record ? this.record.bonus_min_amount : 0;
                        this.deliveryBoys.bonus_max_amount = this.record ? this.record.bonus_max_amount : 0;

                    } else {
                        this.showError(data.message);
                        setTimeout(() => {
                            this.$router.back();
                        }, 1000);
                    }
                }).catch(error => {
                    this.isLoading = false;
                    if (error.request?.statusText) {
                        this.showError(error.request.statusText);
                    } else if (error.message) {
                        this.showError(error.message);
                    } else {
                        this.showError("Something went wrong!");
                    }
                });
        },

        async saveRecord() {
            // --- Client-side validation BEFORE setting isLoading ---
            if (!this.defaultLanguage) {
                this.showError(__('default_language_not_found') || 'Default language not loaded.');
                return;
            }

            const defaultLang = this.defaultLanguage;
            const defaultTrans = this.translations[defaultLang.id];

            const switchToDefault = () => {
                this.activeLanguageTab = this.languages.findIndex(l => l.id === defaultLang.id);
            };

            if (!defaultTrans?.name?.trim()) {
                this.showError(__('please_fill_name_in_default_language') || 'Please fill the name in the default language.');
                switchToDefault();
                return;
            }
            if (!this.deliveryBoys.mobile) {
                this.showError(__('please_fill_mobile') || 'Please fill the mobile number.');
                switchToDefault();
                return;
            }
            if (!this.isSellerRole && !this.deliveryBoys.city_id) {
                this.showError(__('please_select_city') || 'Please select a city.');
                switchToDefault();
                return;
            }
            if (await this.lookupExistingDriver()) {
                return;
            }

            // All client-side checks passed — start loading
            this.isLoading = true;

            try {
                const isEdit = !!this.deliveryBoys.id;
                const fd = new FormData();

                if (isEdit) {
                    fd.append('id', this.deliveryBoys.id);
                }

                // default language
                fd.append('language_id', defaultLang.id);
                fd.append('name', defaultTrans.name);
                fd.append('address', defaultTrans.address ?? '');
                fd.append(
                    'other_payment_information',
                    defaultTrans.other_payment_information ?? ''
                );

                // main fields
                fd.append('dob', this.deliveryBoys.dob ?? '');
                fd.append('mobile', this.deliveryBoys.mobile);
                fd.append('country_code', this.deliveryBoys.country_code);
                fd.append('license_no', this.deliveryBoys.license_no);
                fd.append('email', this.deliveryBoys.email);
                fd.append('ifsc_code', this.deliveryBoys.ifsc_code);
                fd.append('bank_name', this.deliveryBoys.bank_name);
                fd.append('bank_account_number', this.deliveryBoys.bank_account_number);
                fd.append('account_name', this.deliveryBoys.account_name);
                if (!this.isSellerRole) {
                    fd.append('city_id', this.deliveryBoys.city_id);
                    (this.deliveryBoys.city_ids || []).forEach((id, i) => fd.append('city_ids[' + i + ']', id));
                }
                fd.append('status', this.deliveryBoys.status);
                fd.append('remark', this.deliveryBoys.remark ?? '');
                fd.append('bonus_type', this.deliveryBoys.bonus_type || 0);
                fd.append('bonus_percentage', this.deliveryBoys.bonus_percentage || 0);
                fd.append('bonus_min_amount', this.deliveryBoys.bonus_min_amount || 0);
                fd.append('bonus_max_amount', this.deliveryBoys.bonus_max_amount || 0);

                // password: required on CREATE; on EDIT send only when filled
                if (!isEdit) {
                    fd.append('password', this.deliveryBoys.password ?? '');
                    fd.append('confirm_password', this.deliveryBoys.confirm_password ?? '');
                } else if (this.deliveryBoys.password) {
                    fd.append('password', this.deliveryBoys.password);
                    fd.append('confirm_password', this.deliveryBoys.confirm_password ?? '');
                }

                // files
                if (this.deliveryBoys.driving_license instanceof File) {
                    fd.append('driving_license', this.deliveryBoys.driving_license);
                }
                if (this.deliveryBoys.national_identity_card instanceof File) {
                    fd.append(
                        'national_identity_card',
                        this.deliveryBoys.national_identity_card
                    );
                }

                const url = isEdit
                    ? this.$apiUrl + '/delivery_boys/update'
                    : this.$apiUrl + '/delivery_boys/save';

                const response = await axios.post(url, fd);

                if (!response.data || response.data.status !== 1) {
                    throw new Error(response.data?.message || __('something_went_wrong'));
                }

                if (!isEdit) {
                    this.deliveryBoys.id = response.data.data?.id;
                }

                // Save non-default language translations
                for (const lang of this.languages) {
                    if (lang.is_default) continue;

                    const t = this.translations[lang.id];
                    if (
                        !t ||
                        (!t.name && !t.address && !t.other_payment_information)
                    ) {
                        continue;
                    }

                    const tfd = new FormData();
                    tfd.append('id', this.deliveryBoys.id);
                    tfd.append('language_id', lang.id);
                    tfd.append('name', t.name ?? '');
                    tfd.append('address', t.address ?? '');
                    tfd.append(
                        'other_payment_information',
                        t.other_payment_information ?? ''
                    );

                    const tRes = await axios.post(this.$apiUrl + '/delivery_boys/update', tfd);
                    if (!tRes.data || tRes.data.status !== 1) {
                        throw new Error(tRes.data?.message || __('something_went_wrong'));
                    }
                }

                this.showMessage('success', isEdit
                    ? (__('delivery_boy_updated_successfully'))
                    : (__('delivery_boy_saved_successfully'))
                );
                
                if (!this.login_user || this.login_user.role_id !== 4) {
                    if (this.$route.path.includes('/seller')) {
                        this.$router.push({ path: '/seller/delivery_boys' });
                    } else {
                        this.$router.push({ path: '/delivery_boys' });
                    }
                }

            } catch (error) {
                this.showError(
                    error.message || error?.response?.data?.message || __('something_went_wrong') || 'Something went wrong.'
                );
            } finally {
                this.isLoading = false;
            }
        }

    }
};
</script>
<style scoped>
/* All colours come from the --ui-* tokens that modern.css defines on .ui-modern (the seller layout). */
.ui-span-all { grid-column: 1 / -1; }

/* mobile number: country-code dropdown + number as one control */
.ui-phone {
    display: flex; align-items: stretch; flex-wrap: nowrap; height: 44px; border-radius: 12px; border: 1px solid var(--ui-border); background: var(--ui-soft);
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}
.ui-phone:focus-within { background: var(--ui-card); border-color: var(--ui-primary); box-shadow: 0 0 0 3px var(--ui-primary-soft); }
.ui-phone__code { position: relative; flex: 0 0 auto; width: 84px; border-right: 1px solid var(--ui-border); }
.ui-phone__toggle {
    width: 100%; height: 100%; display: flex; align-items: center; justify-content: space-between; gap: 4px; padding: 0 12px; border: 0;
    border-radius: 11px 0 0 11px; background: transparent; color: var(--ui-text); font-size: 14px; font-weight: 600; cursor: pointer;
}
.ui-phone__caret { width: 0; height: 0; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--ui-muted); }
.ui-phone__menu {
    position: absolute; top: 100%; left: 0; z-index: 1050; width: 130px; max-height: 220px; overflow-y: auto; margin: 6px 0 0; padding: 6px;
    list-style: none; background: var(--ui-card); border: 1px solid var(--ui-border); border-radius: 12px; box-shadow: 0 12px 32px rgba(15, 23, 42, 0.14);
}
.ui-phone__menu li { padding: 7px 10px; border-radius: 8px; font-size: 14px; color: var(--ui-text); cursor: pointer; }
.ui-phone__menu li:hover { background: var(--ui-soft); }
.ui-phone__input {
    flex: 1 1 auto; min-width: 0; height: 100%; padding: 0 14px; border: 0; border-radius: 0 11px 11px 0; background: transparent;
    color: var(--ui-text); font-size: 14px; outline: none; box-shadow: none;
}
.ui-phone__input::placeholder { color: var(--ui-muted); }

/* "driver already exists" confirmation modal */
.driver-link { color: var(--ui-text); }
.driver-link__head { display: flex; align-items: flex-start; gap: 14px; padding: 22px 22px 14px; }
.driver-link__title { flex: 1 1 auto; min-width: 0; }
.driver-link__title h5 { margin: 0 0 4px; font-size: 18px; font-weight: 800; letter-spacing: -0.01em; color: var(--ui-text); }
.driver-link__title p { margin: 0; font-size: 14px; line-height: 1.45; color: var(--ui-muted); }
.driver-link__close {
    flex-shrink: 0; width: 32px; height: 32px; margin: -4px -6px 0 0; border: 0; border-radius: 10px; background: transparent;
    font-size: 24px; line-height: 1; color: var(--ui-muted); cursor: pointer;
}
.driver-link__close:hover { background: var(--ui-soft); color: var(--ui-text); }
.driver-link__card {
    margin: 4px 22px 0; padding: 16px; border: 1px solid var(--ui-border); border-radius: 14px; background: var(--ui-soft);
}
.driver-link .driver-link__avatar { width: 48px; height: 48px; font-size: 16px; }
.driver-link .driver-link__card .ui-person { min-width: 0; }
.driver-link__who { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-width: 0; }
.driver-link__who strong { font-size: 16px; font-weight: 700; color: var(--ui-text); }
.driver-link .driver-link__status { font-size: 11.5px; padding: 3px 10px; }
.driver-link__details { list-style: none; margin: 14px 0 0; padding: 12px 0 0; border-top: 1px dashed var(--ui-border); display: grid; gap: 8px; }
.driver-link__details li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--ui-text); }
.driver-link__details li i { width: 16px; margin-top: 3px; text-align: center; color: var(--ui-muted); }
.driver-link__notice {
    display: flex; align-items: flex-start; gap: 10px; margin: 14px 22px 0; padding: 10px 14px; border-radius: 12px;
    font-size: 13.5px; font-weight: 600; background: var(--tone-bg); color: var(--tone-fg);
}
.driver-link__notice i { margin-top: 2px; }
.driver-link__actions { display: flex; justify-content: flex-end; gap: 10px; padding: 18px 22px 22px; }
.driver-link__actions .btn { min-width: 110px; border-radius: 10px; font-weight: 600; }
@media (max-width: 575px) {
    .driver-link__actions { flex-direction: column-reverse; }
    .driver-link__actions .btn { width: 100%; }
}
</style>
